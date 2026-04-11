import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { randomUUID } from 'node:crypto';
import {
  REPO_ROOT,
  PYTHON,
  GENERATE_SCRIPT,
  STAGE_BASE,
  ANTHROPIC_API_KEY,
} from '../config.js';
import { session, sessionEmitter } from '../state.js';
import { parseContactSheet } from './contactSheetParser.js';
import type { Concept, Variant, ConceptUpdatedEvent } from '../../shared/types.js';

export interface GenerateMojiInput {
  words: string[];
  prompt: string;
  count?: number;
  seed?: number;
}

export interface GenerateMojiResult {
  conceptId: string;
  slug: string;
  stagedDir: string;
  variants: Variant[];
  recommended: string | null;
  warnings: string[];
}

/** A line of stdout/stderr from the Python subprocess that we want the agent to see. */
const PROGRESS_PATTERNS = [
  /Generating variant \d+\/\d+/i,
  /Saved:/i,
  /Running vision check/i,
  /^\s*[★✓⚠]/,
  /^Warning:/i,
  /^Error:/i,
  /Recommended:/i,
];

const SHORT_TAIL_PATTERNS = [
  /^\s*([★✓⚠])\s+(\S+)\s+\[composite:\s*([0-9.]+)/,
  /Generating variant (\d+\/\d+)\s+\(seed (\d+)\)/,
  /Saved:\s*(.+)/,
  /Recommended:\s*(\S+)\s+\(composite\s+([0-9.]+)/,
];

function slugify(words: string[]): string {
  return words.map((w) => w.toLowerCase().trim()).join('-');
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Run scripts/generate_moji.py with --check, stream filtered progress to the
 * caller, parse the resulting contact sheet, and update the in-memory concept
 * store. Long-running: each variant is ~45s on M2.
 */
export async function generateMojiTool(
  input: GenerateMojiInput,
  opts: {
    onProgress?: (line: string) => void;
    abortSignal?: AbortSignal;
  } = {},
): Promise<GenerateMojiResult> {
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim());
  if (words.length < 2 || words.length > 4) {
    throw new Error(`generate_moji: words must contain 2-4 tokens (got ${words.length})`);
  }
  for (const w of words) {
    if (!/^[a-z]+$/.test(w)) {
      throw new Error(`generate_moji: word "${w}" must be lowercase letters only`);
    }
  }
  if (typeof input.prompt !== 'string' || input.prompt.trim().length === 0) {
    throw new Error('generate_moji: prompt is required');
  }
  if (!ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set in the server environment — required by --check',
    );
  }

  const count = input.count ?? 3;
  const slug = slugify(words);
  const dateKey = todayISO();
  const stagedDirAbs = join(STAGE_BASE, dateKey);
  const stagedDirRel = relative(REPO_ROOT, stagedDirAbs);

  if (!existsSync(stagedDirAbs)) {
    mkdirSync(stagedDirAbs, { recursive: true });
  }

  const args: string[] = [
    GENERATE_SCRIPT,
    '--words',
    words.join(' '),
    '--prompt',
    input.prompt,
    '--count',
    String(count),
    '--check',
  ];
  if (typeof input.seed === 'number') {
    args.push('--seed', String(input.seed));
  }

  const child: ChildProcessWithoutNullStreams = spawn(PYTHON, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, ANTHROPIC_API_KEY },
  });

  // Wire abort to SIGTERM. The chat route stores the AbortController on the
  // session and exposes it via /api/chat/abort.
  const onAbort = () => {
    try {
      child.kill('SIGTERM');
    } catch {
      // ignore
    }
  };
  opts.abortSignal?.addEventListener('abort', onAbort, { once: true });

  let stdoutBuf = '';
  let stderrBuf = '';

  const handleLine = (raw: string) => {
    const line = raw.replace(/\r/g, '').trim();
    if (!line) return;
    if (PROGRESS_PATTERNS.some((re) => re.test(line))) {
      const short = compactProgressLine(line) ?? line;
      opts.onProgress?.(short);
    }
  };

  child.stdout.on('data', (chunk: Buffer) => {
    stdoutBuf += chunk.toString('utf8');
    let nl = stdoutBuf.indexOf('\n');
    while (nl !== -1) {
      handleLine(stdoutBuf.slice(0, nl));
      stdoutBuf = stdoutBuf.slice(nl + 1);
      nl = stdoutBuf.indexOf('\n');
    }
  });

  child.stderr.on('data', (chunk: Buffer) => {
    stderrBuf += chunk.toString('utf8');
    // Only forward stderr lines that match the progress patterns; mflux's
    // tqdm bars would otherwise drown the channel.
    let nl = stderrBuf.indexOf('\n');
    while (nl !== -1) {
      handleLine(stderrBuf.slice(0, nl));
      stderrBuf = stderrBuf.slice(nl + 1);
      nl = stderrBuf.indexOf('\n');
    }
  });

  const exitCode: number = await new Promise((resolveExit) => {
    child.on('close', (code) => resolveExit(code ?? 1));
  });
  opts.abortSignal?.removeEventListener('abort', onAbort);

  if (opts.abortSignal?.aborted) {
    throw new Error('generate_moji: aborted by user');
  }
  if (exitCode !== 0) {
    const tail = stderrBuf.split('\n').slice(-20).join('\n').trim();
    throw new Error(
      `generate_moji: scripts/generate_moji.py exited ${exitCode}\n${tail || '(no stderr)'}`,
    );
  }

  const variants = parseContactSheet(stagedDirAbs, stagedDirRel);
  if (variants.length === 0) {
    throw new Error(
      `generate_moji: no variants parsed from ${stagedDirRel}/index.html — see server log`,
    );
  }

  const concept: Concept = {
    id: randomUUID(),
    words,
    slug,
    prompt: input.prompt,
    stagedDir: stagedDirRel,
    variants,
    createdAt: new Date().toISOString(),
  };
  session.upsertConcept(concept);

  const evt: ConceptUpdatedEvent = { concept };
  sessionEmitter.emit('concept_updated', evt);

  const warnings: string[] = [];
  for (const v of variants) {
    if (v.missing.length > 0) {
      warnings.push(`${v.file}: missing words ${v.missing.join(', ')}`);
    }
  }
  const recommended = variants.find((v) => v.recommended);

  return {
    conceptId: concept.id,
    slug,
    stagedDir: stagedDirRel,
    variants,
    recommended: recommended ? recommended.file : null,
    warnings,
  };
}

function compactProgressLine(line: string): string | null {
  for (const re of SHORT_TAIL_PATTERNS) {
    const m = line.match(re);
    if (m) return line.trim();
  }
  return null;
}
