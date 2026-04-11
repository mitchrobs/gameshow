import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import {
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
  MAX_AGENT_ITERATIONS,
  MAX_GENERATIONS_PER_TURN,
  MAX_OUTPUT_TOKENS,
} from '../config.js';
import { TOOL_DEFS } from './toolDefs.js';
import { loadSystemPrompt } from './systemPrompt.js';
import { session } from '../state.js';
import { readFileTool } from '../tools/readFile.js';
import { listPoolTool } from '../tools/listPool.js';
import { generateMojiTool } from '../tools/generateMoji.js';
import { promoteMojiTool } from '../tools/promoteMoji.js';
import type {
  ChatBlock,
  ChatMessage,
  ChatMessageToolCall,
  TokenEvent,
  ToolCallEvent,
  ToolProgressEvent,
  ToolResultEvent,
  UsageEvent,
  MessageAppendedEvent,
  ErrorEvent,
} from '../../shared/types.js';
import { SSE } from '../../shared/events.js';
import type { SSESink } from '../util/sse.js';

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

export interface RunAgentOpts {
  userText: string;
  sink: SSESink;
}

/**
 * Drive a single user-message turn against Claude with tool use enabled.
 *
 * Loop semantics:
 *   1. Append the user's text to api+ui messages.
 *   2. Stream a Claude response, forwarding text deltas as `token` events.
 *   3. If the response stops with `tool_use`, run each tool, stream
 *      `tool_call` / `tool_progress` / `tool_result` events, append the
 *      tool results to the message history, and loop.
 *   4. Otherwise we're done; emit `done`.
 *
 * Caps:
 *   - MAX_AGENT_ITERATIONS hard limit on tool-use turns.
 *   - MAX_GENERATIONS_PER_TURN limit on `generate_moji` calls per user
 *     message (image generation is slow and expensive).
 */
export async function runAgent({ userText, sink }: RunAgentOpts): Promise<void> {
  if (!ANTHROPIC_API_KEY) {
    const evt: ErrorEvent = { message: 'ANTHROPIC_API_KEY is not set in the server environment.' };
    await sink.send(SSE.Error, evt);
    await sink.send(SSE.Done, {});
    return;
  }

  const ac = new AbortController();
  session.currentRun = ac;
  session.generationsThisTurn = 0;

  // Append the user message to both stores.
  const userMsg: ChatMessage = {
    id: randomUUID(),
    role: 'user',
    blocks: [{ type: 'text', text: userText }],
    createdAt: new Date().toISOString(),
  };
  session.uiMessages.push(userMsg);
  session.apiMessages.push({ role: 'user', content: userText });
  const userAppended: MessageAppendedEvent = { message: userMsg };
  await sink.send(SSE.MessageAppended, userAppended);

  const systemPrompt = loadSystemPrompt(new Date().toISOString().slice(0, 10));

  try {
    for (let iter = 0; iter < MAX_AGENT_ITERATIONS; iter++) {
      if (ac.signal.aborted) break;

      // Create the in-progress assistant message that token events will fill in.
      const assistantMsg: ChatMessage = {
        id: randomUUID(),
        role: 'assistant',
        blocks: [],
        createdAt: new Date().toISOString(),
      };
      session.uiMessages.push(assistantMsg);
      const appended: MessageAppendedEvent = { message: assistantMsg };
      await sink.send(SSE.MessageAppended, appended);

      const stream = client.messages.stream(
        {
          model: ANTHROPIC_MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          system: systemPrompt,
          tools: TOOL_DEFS,
          messages: session.apiMessages,
        },
        { signal: ac.signal },
      );

      // We accumulate the current text block on the server so the snapshot
      // in session.uiMessages stays in sync.
      let currentTextBlockIdx: number | null = null;

      for await (const event of stream) {
        if (ac.signal.aborted) break;

        if (event.type === 'content_block_start') {
          if (event.content_block.type === 'text') {
            assistantMsg.blocks.push({ type: 'text', text: '' });
            currentTextBlockIdx = assistantMsg.blocks.length - 1;
          } else if (event.content_block.type === 'tool_use') {
            // tool_use input arrives via deltas; we'll record it after the
            // stream finishes (Anthropic SDK assembles the final input on
            // finalMessage()).
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta' && currentTextBlockIdx !== null) {
            const block = assistantMsg.blocks[currentTextBlockIdx];
            if (block && block.type === 'text') {
              block.text += event.delta.text;
            }
            const tokenEvt: TokenEvent = {
              delta: event.delta.text,
              blockIndex: currentTextBlockIdx,
              messageId: assistantMsg.id,
            };
            await sink.send(SSE.Token, tokenEvt);
          }
        } else if (event.type === 'content_block_stop') {
          currentTextBlockIdx = null;
        }
      }

      if (ac.signal.aborted) break;
      const finalMsg = await stream.finalMessage();

      if (finalMsg.usage) {
        session.totalInputTokens += finalMsg.usage.input_tokens;
        session.totalOutputTokens += finalMsg.usage.output_tokens;
        const usageEvt: UsageEvent = {
          inputTokens: finalMsg.usage.input_tokens,
          outputTokens: finalMsg.usage.output_tokens,
          totalInput: session.totalInputTokens,
          totalOutput: session.totalOutputTokens,
        };
        await sink.send(SSE.Usage, usageEvt);
      }

      // Save the assistant turn to the API message history (verbatim).
      session.apiMessages.push({ role: 'assistant', content: finalMsg.content });

      // Mirror tool_use blocks into the assistant ChatMessage so the frontend
      // can show them as inline cards.
      const toolUseBlocks = finalMsg.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );
      for (const tu of toolUseBlocks) {
        const card: ChatMessageToolCall = {
          type: 'tool_call',
          toolUseId: tu.id,
          name: tu.name,
          input: (tu.input as Record<string, unknown>) ?? {},
          status: 'running',
        };
        assistantMsg.blocks.push(card);
        const callEvt: ToolCallEvent = {
          messageId: assistantMsg.id,
          toolUseId: tu.id,
          name: tu.name,
          input: card.input,
        };
        await sink.send(SSE.ToolCall, callEvt);
      }

      if (finalMsg.stop_reason !== 'tool_use' || toolUseBlocks.length === 0) {
        // Conversation turn is complete.
        break;
      }

      // Run each tool sequentially and build tool_result blocks for the next
      // user message in the API history.
      const resultBlocks: Anthropic.ToolResultBlockParam[] = [];
      for (const tu of toolUseBlocks) {
        if (ac.signal.aborted) break;
        const card = assistantMsg.blocks.find(
          (b): b is ChatMessageToolCall =>
            b.type === 'tool_call' && b.toolUseId === tu.id,
        )!;
        try {
          const { resultJson, summary } = await runOneTool(
            tu.name,
            (tu.input as Record<string, unknown>) ?? {},
            tu.id,
            sink,
            ac.signal,
          );
          card.status = 'ok';
          card.summary = summary;
          const resEvt: ToolResultEvent = {
            toolUseId: tu.id,
            status: 'ok',
            summary,
          };
          await sink.send(SSE.ToolResult, resEvt);
          resultBlocks.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            content: resultJson,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          card.status = 'error';
          card.error = message;
          card.summary = `Error: ${message.split('\n')[0]}`;
          const resEvt: ToolResultEvent = {
            toolUseId: tu.id,
            status: 'error',
            summary: card.summary,
            error: message,
          };
          await sink.send(SSE.ToolResult, resEvt);
          resultBlocks.push({
            type: 'tool_result',
            tool_use_id: tu.id,
            is_error: true,
            content: message,
          });
        }
      }

      session.apiMessages.push({ role: 'user', content: resultBlocks });
      // Loop and let Claude react to the tool results.
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (ac.signal.aborted) {
      const evt: ErrorEvent = { message: 'aborted by user' };
      await sink.send(SSE.Error, evt);
    } else {
      const evt: ErrorEvent = { message };
      await sink.send(SSE.Error, evt);
    }
  } finally {
    session.currentRun = null;
    await sink.send(SSE.Done, {});
  }
}

async function runOneTool(
  name: string,
  input: Record<string, unknown>,
  toolUseId: string,
  sink: SSESink,
  signal: AbortSignal,
): Promise<{ resultJson: string; summary: string }> {
  switch (name) {
    case 'read_file': {
      const result = readFileTool({ path: String(input.path ?? '') });
      return {
        resultJson: JSON.stringify(result),
        summary: `Read \`${result.path}\` (${result.lines} lines, ${result.bytes} bytes)`,
      };
    }
    case 'list_pool': {
      const result = listPoolTool();
      const wordTotal = Object.keys(result.wordCounts).length;
      return {
        resultJson: JSON.stringify(result),
        summary: `Loaded pool (${result.total} puzzles, ${wordTotal} unique words, ${result.pinnedCount} pinned)`,
      };
    }
    case 'generate_moji': {
      if (session.generationsThisTurn >= MAX_GENERATIONS_PER_TURN) {
        throw new Error(
          `MAX_GENERATIONS_PER_TURN (${MAX_GENERATIONS_PER_TURN}) reached. Stop and check in with the user before generating more candidates this turn.`,
        );
      }
      session.generationsThisTurn += 1;
      const result = await generateMojiTool(
        {
          words: (input.words as string[]) ?? [],
          prompt: String(input.prompt ?? ''),
          count: typeof input.count === 'number' ? input.count : undefined,
          seed: typeof input.seed === 'number' ? input.seed : undefined,
        },
        {
          abortSignal: signal,
          onProgress: async (line) => {
            const evt: ToolProgressEvent = { toolUseId, line };
            await sink.send(SSE.ToolProgress, evt);
          },
        },
      );
      const best = result.variants.find((v) => v.recommended);
      const summary = best
        ? `Generated ${result.variants.length} variants for \`${result.slug}\` — best ${best.file} (composite ${best.composite.toFixed(1)}/25)`
        : `Generated ${result.variants.length} variants for \`${result.slug}\``;
      return { resultJson: JSON.stringify(result), summary };
    }
    case 'promote_moji': {
      const result = await promoteMojiTool({
        words: (input.words as string[]) ?? [],
        staged_path: String(input.staged_path ?? ''),
        force: Boolean(input.force),
      });
      return {
        resultJson: JSON.stringify(result),
        summary: `Promoted \`${result.promotedAsset}\``,
      };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
