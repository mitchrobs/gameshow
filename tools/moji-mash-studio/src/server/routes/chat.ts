import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { session, sessionEmitter } from '../state.js';
import { runAgent } from '../anthropic/agentLoop.js';
import { createSSESink } from '../util/sse.js';
import { SSE } from '../../shared/events.js';
import type { ConceptUpdatedEvent } from '../../shared/types.js';

export const chatRoute = new Hono();

chatRoute.post('/chat', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const userText = typeof body?.userText === 'string' ? body.userText.trim() : '';
  if (!userText) {
    return c.json({ error: 'userText is required' }, 400);
  }
  if (session.currentRun) {
    return c.json({ error: 'another run is in progress' }, 409);
  }

  return streamSSE(
    c,
    async (stream) => {
      // Disable proxy buffering and compression for the SSE channel.
      c.header('Cache-Control', 'no-cache, no-transform');
      c.header('X-Accel-Buffering', 'no');

      const sink = createSSESink(stream);

      // Forward concept updates that originate inside tool implementations
      // (the Python subprocess can finish and call upsertConcept while the
      // model is mid-stream).
      const onConcept = async (evt: ConceptUpdatedEvent) => {
        await sink.send(SSE.ConceptUpdated, evt);
      };
      sessionEmitter.on('concept_updated', onConcept);

      // Periodic keepalive comment so any proxy in the way doesn't time out.
      const keepalive = setInterval(() => {
        sink.comment('keepalive').catch(() => {});
      }, 15_000);

      try {
        await runAgent({ userText, sink });
      } finally {
        clearInterval(keepalive);
        sessionEmitter.off('concept_updated', onConcept);
      }
    },
    async (err, stream) => {
      const sink = createSSESink(stream);
      await sink.send(SSE.Error, { message: err instanceof Error ? err.message : String(err) });
      await sink.send(SSE.Done, {});
    },
  );
});

chatRoute.post('/chat/abort', (c) => {
  if (session.currentRun) {
    session.currentRun.abort();
    return c.json({ ok: true, aborted: true });
  }
  return c.json({ ok: true, aborted: false });
});

chatRoute.post('/chat/reset', (c) => {
  if (session.currentRun) {
    return c.json({ error: 'cannot reset while a run is in progress' }, 409);
  }
  session.reset();
  return c.json({ ok: true });
});
