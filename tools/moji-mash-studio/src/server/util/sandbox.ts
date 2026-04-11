import { resolve, sep, extname } from 'node:path';
import { existsSync, realpathSync } from 'node:fs';
import { REPO_ROOT } from '../config.js';

export class SandboxError extends Error {}

const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.json', '.py', '.txt', '.js', '.mjs']);

/**
 * Resolve a repo-relative path and assert that it stays under REPO_ROOT.
 * Rejects ".." escapes, absolute paths, and symlink escapes via realpath.
 */
export function resolveInRepo(relPath: string): string {
  if (typeof relPath !== 'string' || relPath.length === 0) {
    throw new SandboxError('path must be a non-empty string');
  }
  if (relPath.startsWith('/') || /^[a-zA-Z]:/.test(relPath)) {
    throw new SandboxError('absolute paths are not allowed');
  }
  const resolved = resolve(REPO_ROOT, relPath);
  const real = existsSync(resolved) ? realpathSync(resolved) : resolved;
  if (real !== REPO_ROOT && !real.startsWith(REPO_ROOT + sep)) {
    throw new SandboxError(`path escapes repo root: ${relPath}`);
  }
  return real;
}

export function assertTextExtension(absPath: string): void {
  const ext = extname(absPath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) {
    throw new SandboxError(`extension ${ext || '(none)'} is not in the read whitelist`);
  }
}
