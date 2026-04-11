import { Hono } from 'hono';
import { session } from '../state.js';

export const conceptsRoute = new Hono();

conceptsRoute.get('/concepts', (c) => {
  return c.json({ concepts: session.concepts });
});

conceptsRoute.get('/messages', (c) => {
  return c.json({
    messages: session.uiMessages,
    usage: {
      totalInput: session.totalInputTokens,
      totalOutput: session.totalOutputTokens,
    },
    isRunning: session.currentRun !== null,
  });
});
