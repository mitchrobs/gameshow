import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
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

export interface RefineMojiInput {
  words: string[];
  /** Repo-relative path to the previous variant we're iterating on. */
  staged_path: string;
  /** Revised prompt — what should change vs. the original. */
  prompt: string;
  /** Number of refined variants. Default 2. */
  count?: number;
  /** Optional seed override. Default: derived from the original filename. */
  seed?: number;
  /** 0.0–1.0; lower keeps original layout, higher follows new prompt. Default 0.4. */
  init_strength?: number;
}

export interface RefineMojiResult {
  conceptId: string;
  slug: string;
  stagedDir: string;
  initImage: string;
  initStrength: number;
  variants: Variant[];
  recommended: string | null;
  warnings: string[];
}

const PROGRESS_PATTERNS = [
  /Refining variant \d+\/\d+/i,
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
  /Refining variant (\d+\/\d+)\s+\(seed (\d+)\)/,
  /Generating variant (\d+\/\d+)\s+\(seed (\d+)\)/,
  /Saved:\s*(.+)/,
  /Recommended:\s*(\S+)\s+\(composite\s+([0-9.]+)/,
];

function slugify(words: string[]): string {
  return words.map((w) => w.toLowerCase().trim()).join('-');
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Run scripts/generate_moji.py with --refine on an existing staged PNG. mflux
 * uses the source image as the init latent so the new render preserves
 * composition/colors while responding to the revised prompt.
 *
 * Best for targeted fixes — "make the broom bigger", "add a coffee cup", "drop
 * the sunburst" — rather than whole-concept rewrites. For a brand-new
 * direction, just call generate_moji again.
 */
export async function refineMojiTool(
  input: RefineMojiInput,
  opts: {
    onProgress?: (line: string) => void;
    abortSignal?: AbortSignal;
  } = {},
): Promise<RefineMojiResult> {
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim());
  if (words.length < 2 || words.length > 4) {
    throw new Error(`refine_moji: words must contain 2-4 tokens (got ${words.length})`);
  }
  for (const w of words) {
    if (!/^[a-z]+$/.test(w)) {
      throw new Error(`refine_moji: word "${w}" must be lowercase letters only`);
    }
  }
  if (typeof input.prompt !== 'string' || input.prompt.trim().length === 0) {
    throw new Error('refine_moji: prompt is required');
  }
  if (typeof input.staged_path !== 'string' || input.staged_path.length === 0) {
    throw new Error('refine_moji: staged_path is required');
  }
  if (!ANTHROPIC_API_KEY) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set in the server environment — required by --check',
    );
  }

  const initAbs = isAbsolute(input.staged_path)
    ? input.staged_path
    : join(REPO_ROOT, input.staged_path);
  if (!existsSync(initAbs)) {
    throw new Error(`refine_moji: init image not found at ${input.staged_path}`);
  }

  const initStrength = clampFloat(input.init_strength ?? 0.4, 0, 1);
  const count = Math.min(Math.max(input.count ?? 2, 1), 4);
  const slug = slugify(words);

  // Refined variants land in today's staged dir, alongside any fresh
  // generations from the same chat session.
  const dateKey = todayISO();
  const stagedDirAbs = join(STAGE_BASE, dateKey);
  const stagedDirRel = relative(REPO_ROOT, stagedDirAbs);
  if (!existsSync(stagedDirAbs)) {
    mkdirSync(stagedDirAbs, { recursive: true });
  }

  // Default seed: parse the original filename's `-s<seed>` (or `-r<seed>`)
  // and add 100 so refinements land in a fresh seed range. Falls back to
  // 200 if we can't parse it.
  const sourceSeedMatch = input.staged_path.match(/-[sr](\d+)(?:_\d+)?\.png$/);
  const sourceSeed = sourceSeedMatch && sourceSeedMatch[1]
    ? parseInt(sourceSeedMatch[1], 10)
    : 100;
  const seed = typeof input.seed === 'number' ? input.seed : sourceSeed + 100;

  const args: string[] = [
    GENERATE_SCRIPT,
    '--words',
    words.join(' '),
    '--prompt',
    input.prompt,
    '--count',
    String(count),
    '--seed',
    String(seed),
    '--refine',
    initAbs,
    '--init-strength',
    String(initStrength),
    '--check',
  ];

  const child: ChildProcessWithoutNullStreams = spawn(PYTHON, args, {
    cwd: REPO_ROOT,
    env: { ...process.env, ANTHROPIC_API_KEY },
  });

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
    throw new Error('refine_moji: aborted by user');
  }
  if (exitCode !== 0) {
    const tail = stderrBuf.split('\n').slice(-20).join('\n').trim();
    throw new Error(
      `refine_moji: scripts/generate_moji.py exited ${exitCode}\n${tail || '(no stderr)'}`,
    );
  }

  const allVariants = parseContactSheet(stagedDirAbs, stagedDirRel);
  // The contact sheet covers the most recent run only; restrict to slug.
  const variants = allVariants.filter((v) => v.file.startsWith(`${slug}-r`));
  if (variants.length === 0) {
    throw new Error(
      `refine_moji: no refined variants parsed from ${stagedDirRel}/index.html — see server log`,
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
    initImage: relative(REPO_ROOT, initAbs),
    initStrength,
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

function clampFloat(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
