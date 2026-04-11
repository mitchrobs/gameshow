import { readFileSync, statSync } from 'node:fs';
import { resolveInRepo, assertTextExtension, SandboxError } from '../util/sandbox.js';

const MAX_BYTES = 256 * 1024;

export interface ReadFileInput {
  path: string;
}

export interface ReadFileResult {
  path: string;
  bytes: number;
  lines: number;
  content: string;
}

export function readFileTool(input: ReadFileInput): ReadFileResult {
  if (!input || typeof input.path !== 'string') {
    throw new SandboxError('read_file requires a "path" string');
  }
  const abs = resolveInRepo(input.path);
  assertTextExtension(abs);

  const stat = statSync(abs);
  if (!stat.isFile()) {
    throw new SandboxError(`not a file: ${input.path}`);
  }
  if (stat.size > MAX_BYTES) {
    throw new SandboxError(
      `file too large: ${stat.size} bytes (max ${MAX_BYTES})`
    );
  }
  const content = readFileSync(abs, 'utf8');
  return {
    path: input.path,
    bytes: stat.size,
    lines: content.split('\n').length,
    content,
  };
}
