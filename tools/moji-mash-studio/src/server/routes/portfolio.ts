import { Hono } from 'hono';
import { analyzePoolTool } from '../tools/analyzePool.js';

export const portfolioRoute = new Hono();

portfolioRoute.get('/portfolio', (c) => {
  return c.json(analyzePoolTool());
});
