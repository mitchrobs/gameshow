import { Hono } from 'hono';
import { existsSync, statSync, createReadStream } from 'node:fs';
import { join, extname } from 'node:path';
import { Readable } from 'node:stream';
import { STAGE_BASE, ASSETS_GENMOJI } from '../config.js';

export const imagesRoute = new Hono();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STAGED_FILE_RE = /^[a-z0-9-]+\.(png|html)$/i;
const PROMOTED_FILE_RE = /^[a-z0-9-]+\.png$/i;

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.html': 'text/html; charset=utf-8',
};

function streamFile(absPath: string): Response {
  const ext = extname(absPath).toLowerCase();
  const mime = MIME[ext] ?? 'application/octet-stream';
  const stat = statSync(absPath);
  const nodeStream = createReadStream(absPath);
  // Convert Node Readable -> Web ReadableStream so Hono can return it.
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;
  return new Response(webStream, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(stat.size),
      'Cache-Control': 'no-cache',
    },
  });
}

imagesRoute.get('/images/staged/:date/:filename', (c) => {
  const date = c.req.param('date');
  const filename = c.req.param('filename');
  if (!DATE_RE.test(date)) return c.text('bad date', 400);
  if (!STAGED_FILE_RE.test(filename)) return c.text('bad filename', 400);
  const abs = join(STAGE_BASE, date, filename);
  if (!abs.startsWith(STAGE_BASE)) return c.text('forbidden', 403);
  if (!existsSync(abs)) return c.text('not found', 404);
  return streamFile(abs);
});

imagesRoute.get('/images/promoted/:filename', (c) => {
  const filename = c.req.param('filename');
  if (!PROMOTED_FILE_RE.test(filename)) return c.text('bad filename', 400);
  const abs = join(ASSETS_GENMOJI, filename);
  if (!abs.startsWith(ASSETS_GENMOJI)) return c.text('forbidden', 403);
  if (!existsSync(abs)) return c.text('not found', 404);
  return streamFile(abs);
});
