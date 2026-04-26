import { Hono } from 'hono';
import { existsSync } from 'node:fs';
import { homedir, platform, arch } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  ANTHROPIC_API_KEY,
  PORT,
  PYTHON,
  REPO_ROOT,
} from '../config.js';
import { listPoolTool } from '../tools/listPool.js';
import { todayLocalISO } from '../util/today.js';
import type { HealthStatus } from '../../shared/types.js';

export const healthRoute = new Hono();

const OPEN_GENMOJI_PATH =
  process.env.OPEN_GENMOJI_PATH ?? join(homedir(), 'tools', 'open-genmoji');

healthRoute.get('/health', (c) => {
  const appleSilicon = platform() === 'darwin' && arch() === 'arm64';
  const openGenmojiInstalled = existsSync(
    join(OPEN_GENMOJI_PATH, '.venv', 'bin', 'python'),
  );

  let pythonVersion: string | null = null;
  try {
    const out = execFileSync(PYTHON, ['--version'], { encoding: 'utf8' });
    pythonVersion = out.trim();
  } catch {
    pythonVersion = null;
  }

  const pool = listPoolTool();
  const status: HealthStatus = {
    appleSilicon,
    openGenmojiInstalled,
    anthropicKeyPresent: ANTHROPIC_API_KEY.length > 0,
    pythonVersion,
    poolCount: pool.total,
    today: todayLocalISO(),
    repoRoot: REPO_ROOT,
    port: PORT,
  };
  return c.json(status);
});
