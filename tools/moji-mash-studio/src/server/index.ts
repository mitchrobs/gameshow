import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getRequestListener } from '@hono/node-server';
import { createServer as createViteServer } from 'vite';
import { Hono } from 'hono';

import { PORT, STUDIO_ROOT, ANTHROPIC_API_KEY, REPO_ROOT } from './config.js';
import { chatRoute } from './routes/chat.js';
import { imagesRoute } from './routes/images.js';
import { conceptsRoute } from './routes/concepts.js';
import { healthRoute } from './routes/health.js';
import { revealRoute } from './routes/reveal.js';

const app = new Hono();
app.route('/api', chatRoute);
app.route('/api', imagesRoute);
app.route('/api', conceptsRoute);
app.route('/api', healthRoute);
app.route('/api', revealRoute);
app.notFound((c) => c.json({ error: 'not found' }, 404));
app.onError((err, c) => {
  console.error('[hono error]', err);
  return c.json({ error: err.message }, 500);
});

const vite = await createViteServer({
  root: STUDIO_ROOT,
  server: { middlewareMode: true },
  appType: 'custom',
});

const honoListener = getRequestListener(app.fetch);

const server = createServer((req, res) => {
  const url = req.url ?? '/';
  if (url.startsWith('/api/') || url === '/api') {
    return honoListener(req, res);
  }
  vite.middlewares(req, res, async () => {
    try {
      const indexPath = join(STUDIO_ROOT, 'index.html');
      let template = await readFile(indexPath, 'utf8');
      template = await vite.transformIndexHtml(url, template);
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end(template);
    } catch (e) {
      const err = e as Error;
      vite.ssrFixStacktrace(err);
      res.statusCode = 500;
      res.end(err.message ?? 'server error');
    }
  });
});

server.listen(PORT, () => {
  const banner = [
    '',
    '┌─────────────────────────────────────────────┐',
    '│  Moji Mash Studio                           │',
    `│  → http://localhost:${String(PORT).padEnd(5, ' ')}                  │`,
    '└─────────────────────────────────────────────┘',
    `repo  : ${REPO_ROOT}`,
    `key   : ${ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY ✓' : 'ANTHROPIC_API_KEY ✗ (chat will fail)'}`,
    '',
  ].join('\n');
  console.log(banner);
});
