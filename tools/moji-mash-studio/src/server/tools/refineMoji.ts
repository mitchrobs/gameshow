import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, relative, isAbsolute } from 'node:path';
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
import { loadImageAttachment } from './imageAttachment.js';
import type { ViewImageImage } from './viewImage.js';
import { todayLocalISO } from '../util/today.js';
import type { Concept, Variant, ConceptUpdatedEvent } from '../../shared/types.js';

export interface RefineMojiInput {
  words: string[];
  /** Repo-relative or absolute staged path of the variant to use as init image. */
  source_path: string;
  /** Revised genmoji prompt that describes the targeted tweak. */
  prompt: string;
  /** 0.0-1.0; higher = stronger change from the source. Default 0.4. */
  init_strength?: number;
  /** How many refined variants to produce (default 2, max 3). */
  count?: number;
  /** Optional seed; defaults to source seed + 100. */
  seed?: number;
}

export interface RefineMojiResult {
  conceptId: string;
  slug: string;
  stagedDir: string;
  variants: Variant[];
  recommended: string | null;
  warnings: string[];
  /** When present, agentLoop attaches this to the tool_result so the agent can see the image. */
  images?: ViewImageImage[];
}

const SLUG_RE = /^(.+)-[sr]\d+(?:_\d+)?\.png$/;
const SEED_RE = /-[sr](\d+)(?:_\d+)?\.png$/;

function slugify(words: string[]): string {
  return words.map((w) => w.toLowerCase().trim()).join('-');
}

// Local-time today; must match Python's `date.today()`.
const todayISO = todayLocalISO;

/**
 * img2img iteration — runs `scripts/generate_moji.py --refine` against an
 * existing staged variant. Use this instead of generate_moji when the
 * composition is basically right and one element needs a targeted tweak;
 * generate_moji from scratch is the right choice when the concept direction
 * was wrong entirely.
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
  if (typeof input.source_path !== 'string' || input.source_path.length === 0) {
    throw new Error('refine_moji: source_path is required');
  }
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set — required by --check');
  }

  const sourceAbs = isAbsolute(input.source_path)
    ? input.source_path
    : join(REPO_ROOT, input.source_path);
  if (!existsSync(sourceAbs)) {
    throw new Error(`refine_moji: source_path does not exist: ${input.source_path}`);
  }
  const sourceFile = sourceAbs.split('/').pop() ?? '';
  const sourceSlugMatch = sourceFile.match(SLUG_RE);
  const sourceSlug = sourceSlugMatch ? (sourceSlugMatch[1] ?? '') : '';
  const slug = slugify(words);
  if (sourceSlug && sourceSlug !== slug) {
    throw new Error(
      `refine_moji: source slug "${sourceSlug}" does not match words slug "${slug}"`,
    );
  }
  const sourceSeedMatch = sourceFile.match(SEED_RE);
  const sourceSeed = sourceSeedMatch && sourceSeedMatch[1] ? parseInt(sourceSeedMatch[1], 10) : 0;

  const initStrength = clamp01(input.init_strength ?? 0.4);
  const count = Math.max(1, Math.min(input.count ?? 2, 3));
  const seed = typeof input.seed === 'number' ? input.seed : sourceSeed + 100;

  const dateKey = todayISO();
  const stagedDirAbs = join(STAGE_BASE, dateKey);
  const stagedDirRel = relative(REPO_ROOT, stagedDirAbs);

  const args: string[] = [
    GENERATE_SCRIPT,
    '--words',
    words.join(' '),
    '--prompt',
    input.prompt,
    '--count',
    String(count),
    '--check',
    '--refine',
    sourceAbs,
    '--init-strength',
    String(initStrength),
    '--seed',
    String(seed),
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
    if (
      /Generating variant|Saved:|Running vision check|Recommended:|^\s*[★✓⚠]|^Warning:|^Error:|refine|init/i.test(
        line,
      )
    ) {
      opts.onProgress?.(line);
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

  const exitCode: number = await new Promise((res) => {
    child.on('close', (c) => res(c ?? 1));
  });
  opts.abortSignal?.removeEventListener('abort', onAbort);
  if (opts.abortSignal?.aborted) throw new Error('refine_moji: aborted by user');
  if (exitCode !== 0) {
    const tail = stderrBuf.split('\n').slice(-20).join('\n').trim();
    throw new Error(
      `refine_moji: scripts/generate_moji.py exited ${exitCode}\n${tail || '(no stderr)'}`,
    );
  }

  // Parse contact sheet, then narrow to refined variants for THIS slug only
  // (the index.html may include earlier seeds for the same date+slug).
  const all = parseContactSheet(stagedDirAbs, stagedDirRel);
  const refinedPrefix = `${slug}-r`;
  const refined = all.filter((v) => v.file.startsWith(refinedPrefix));
  const variants = refined.length > 0 ? refined : all.filter((v) => v.file.startsWith(`${slug}-`));
  if (variants.length === 0) {
    throw new Error(
      `refine_moji: no variants parsed from ${stagedDirRel}/index.html — see server log`,
    );
  }
  // Pick the highest composite as recommended within the refined subset.
  variants.sort((a, b) => b.composite - a.composite);
  for (const v of variants) v.recommended = false;
  if (variants[0]) variants[0].recommended = true;

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
    if (v.missing.length > 0) warnings.push(`${v.file}: missing words ${v.missing.join(', ')}`);
  }

  const images: ViewImageImage[] = [];
  const top = variants[0];
  if (top) {
    const att = loadImageAttachment(
      join(stagedDirAbs, top.file),
      `Refined variant ${top.file} (composite ${top.composite.toFixed(1)}/25)`,
    );
    if (att) images.push(att);
  }

  return {
    conceptId: concept.id,
    slug,
    stagedDir: stagedDirRel,
    variants,
    recommended: top?.file ?? null,
    warnings,
    images,
  };
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0.4;
  return Math.max(0, Math.min(1, n));
}
