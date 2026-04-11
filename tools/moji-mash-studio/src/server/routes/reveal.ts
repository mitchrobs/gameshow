import { Hono } from 'hono';
import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import { resolveInRepo, SandboxError } from '../util/sandbox.js';

export const revealRoute = new Hono();

revealRoute.post('/reveal', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const path = typeof body?.path === 'string' ? body.path : '';
  if (!path) return c.json({ error: 'path required' }, 400);

  let abs: string;
  try {
    abs = resolveInRepo(path);
  } catch (err) {
    if (err instanceof SandboxError) return c.json({ error: err.message }, 400);
    throw err;
  }

  if (platform() !== 'darwin') {
    return c.json({ ok: false, reason: 'reveal only supported on macOS' });
  }
  spawn('open', [abs], { detached: true, stdio: 'ignore' }).unref();
  return c.json({ ok: true, opened: abs });
});
