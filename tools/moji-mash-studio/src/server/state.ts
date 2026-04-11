import { EventEmitter } from 'node:events';
import type Anthropic from '@anthropic-ai/sdk';
import type { ChatMessage, Concept } from '../shared/types.js';

/**
 * Single-user, single-session in-memory store. Lost on restart — that's fine
 * for v1 since the artifacts (staged PNGs, promoted assets, TS snippets in
 * chat) are all observable on disk.
 */
class Session {
  /** Anthropic-format messages, kept verbatim for the next stream() call. */
  apiMessages: Anthropic.MessageParam[] = [];
  /** UI-friendly chat history, mirrored to the frontend via /api/messages. */
  uiMessages: ChatMessage[] = [];
  /** Generated concepts, newest first. */
  concepts: Concept[] = [];
  /** Active agent run (lets /api/chat/abort cancel the in-flight stream). */
  currentRun: AbortController | null = null;
  /** Per-turn `generate_moji` call counter (resets on each user message). */
  generationsThisTurn = 0;

  /** Cumulative token usage since the server started. */
  totalInputTokens = 0;
  totalOutputTokens = 0;

  reset(): void {
    this.apiMessages = [];
    this.uiMessages = [];
    this.concepts = [];
    this.currentRun = null;
    this.generationsThisTurn = 0;
  }

  upsertConcept(c: Concept): void {
    const idx = this.concepts.findIndex((x) => x.id === c.id);
    if (idx === -1) {
      this.concepts.unshift(c);
    } else {
      this.concepts[idx] = c;
    }
  }

  findConcept(id: string): Concept | undefined {
    return this.concepts.find((x) => x.id === id);
  }
}

export const session = new Session();

/**
 * Fan-out emitter so the SSE stream in /api/chat can broadcast concept and
 * message updates that originate inside tool implementations.
 */
export const sessionEmitter = new EventEmitter();
sessionEmitter.setMaxListeners(32);
