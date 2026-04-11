import { useSyncExternalStore } from 'react';
import { sessionStore, type StoreState } from '../store/sessionStore.js';
import { SSE } from '../../shared/events.js';
import type {
  TokenEvent,
  ToolCallEvent,
  ToolProgressEvent,
  ToolResultEvent,
  ConceptUpdatedEvent,
  MessageAppendedEvent,
  UsageEvent,
  ErrorEvent,
} from '../../shared/types.js';

export function useSession(): StoreState {
  return useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getState,
    sessionStore.getState,
  );
}

let currentAbort: AbortController | null = null;

/**
 * Fire one chat turn and stream the response into the session store.
 *
 * Uses fetch + ReadableStream rather than EventSource because EventSource
 * can't POST a JSON body.
 */
export async function sendChat(userText: string): Promise<void> {
  if (currentAbort) {
    currentAbort.abort();
  }
  const ac = new AbortController();
  currentAbort = ac;
  sessionStore.setStreaming(true);
  sessionStore.setStatus('thinking…');

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userText }),
      signal: ac.signal,
    });
  } catch (err) {
    sessionStore.setStreaming(false);
    throw err;
  }
  if (!response.ok || !response.body) {
    sessionStore.setStreaming(false);
    const text = await response.text().catch(() => '');
    throw new Error(`chat failed: ${response.status} ${text}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      buffer = drainSSE(buffer);
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') throw err;
  } finally {
    sessionStore.setStreaming(false);
    if (currentAbort === ac) currentAbort = null;
  }
}

export async function abortChat(): Promise<void> {
  if (currentAbort) currentAbort.abort();
  await fetch('/api/chat/abort', { method: 'POST' }).catch(() => {});
}

function drainSSE(buffer: string): string {
  // Each event is terminated by \n\n. Process complete events; return any
  // partial trailing fragment for the next read.
  let idx: number;
  while ((idx = buffer.indexOf('\n\n')) !== -1) {
    const block = buffer.slice(0, idx);
    buffer = buffer.slice(idx + 2);
    handleEventBlock(block);
  }
  return buffer;
}

function handleEventBlock(block: string): void {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of block.split('\n')) {
    if (line.startsWith(':')) continue; // comment / keepalive
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (dataLines.length === 0) return;
  let data: unknown;
  try {
    data = JSON.parse(dataLines.join('\n'));
  } catch {
    return;
  }
  dispatch(event, data);
}

function dispatch(event: string, data: unknown): void {
  switch (event) {
    case SSE.MessageAppended: {
      const { message } = data as MessageAppendedEvent;
      sessionStore.appendMessage(message);
      break;
    }
    case SSE.Token: {
      const e = data as TokenEvent;
      sessionStore.appendToken(e.messageId, e.blockIndex, e.delta);
      break;
    }
    case SSE.ToolCall: {
      const e = data as ToolCallEvent;
      sessionStore.appendToolCall(e.messageId, e.toolUseId, e.name, e.input);
      sessionStore.setStatus(`${e.name}…`);
      break;
    }
    case SSE.ToolProgress: {
      const e = data as ToolProgressEvent;
      sessionStore.setToolProgress(e.toolUseId, e.line);
      break;
    }
    case SSE.ToolResult: {
      const e = data as ToolResultEvent;
      sessionStore.resolveTool(e.toolUseId, e.status, e.summary, e.error);
      sessionStore.setStatus(e.status === 'ok' ? 'thinking…' : `error: ${e.summary}`);
      break;
    }
    case SSE.ConceptUpdated: {
      const e = data as ConceptUpdatedEvent;
      sessionStore.upsertConcept(e.concept);
      break;
    }
    case SSE.Usage: {
      const e = data as UsageEvent;
      sessionStore.addUsage(e.inputTokens, e.outputTokens, e.totalInput, e.totalOutput);
      break;
    }
    case SSE.Error: {
      const e = data as ErrorEvent;
      sessionStore.setStatus(`error: ${e.message}`);
      break;
    }
    case SSE.Done: {
      sessionStore.setStreaming(false);
      break;
    }
    default:
      // ignore unknown events
      break;
  }
}

export async function hydrate(): Promise<void> {
  const [healthRes, messagesRes, conceptsRes] = await Promise.all([
    fetch('/api/health').then((r) => r.json()).catch(() => null),
    fetch('/api/messages').then((r) => r.json()).catch(() => null),
    fetch('/api/concepts').then((r) => r.json()).catch(() => null),
  ]);
  if (healthRes) sessionStore.setHealth(healthRes);
  if (messagesRes && conceptsRes) {
    sessionStore.hydrate(messagesRes.messages ?? [], conceptsRes.concepts ?? [], {
      totalInput: messagesRes.usage?.totalInput ?? 0,
      totalOutput: messagesRes.usage?.totalOutput ?? 0,
    });
  }
}
