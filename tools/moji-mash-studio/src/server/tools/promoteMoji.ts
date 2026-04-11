import { spawn } from 'node:child_process';
import { relative } from 'node:path';
import { REPO_ROOT, PYTHON, GENERATE_SCRIPT } from '../config.js';
import { session, sessionEmitter } from '../state.js';
import type { ConceptUpdatedEvent } from '../../shared/types.js';

export interface PromoteMojiInput {
  words: string[];
  staged_path: string;
  force?: boolean;
}

export interface PromoteMojiResult {
  promotedAsset: string;
  tsSnippet: string;
}

export async function promoteMojiTool(input: PromoteMojiInput): Promise<PromoteMojiResult> {
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim());
  if (words.length < 2 || words.length > 4) {
    throw new Error(`promote_moji: words must contain 2-4 tokens (got ${words.length})`);
  }
  if (typeof input.staged_path !== 'string' || input.staged_path.length === 0) {
    throw new Error('promote_moji: staged_path is required');
  }

  const args: string[] = [
    GENERATE_SCRIPT,
    '--words',
    words.join(' '),
    '--promote',
    input.staged_path,
  ];
  if (input.force) args.push('--force');

  const child = spawn(PYTHON, args, { cwd: REPO_ROOT, env: { ...process.env } });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (b: Buffer) => {
    stdout += b.toString('utf8');
  });
  child.stderr.on('data', (b: Buffer) => {
    stderr += b.toString('utf8');
  });
  const exitCode: number = await new Promise((res) => {
    child.on('close', (c) => res(c ?? 1));
  });
  if (exitCode !== 0) {
    throw new Error(
      `promote_moji: scripts/generate_moji.py exited ${exitCode}\n${stderr.trim() || '(no stderr)'}`,
    );
  }

  const slug = words.join('-');
  const promotedAsset = `assets/genmoji/${slug}.png`;
  const tsSnippet = extractTsSnippet(stdout, slug, words);

  // Mark the concept as promoted in the gallery if it's still around.
  const stagedFile = input.staged_path.split('/').pop() ?? '';
  const matching = session.concepts.find(
    (c) => c.slug === slug && c.variants.some((v) => v.file === stagedFile),
  );
  if (matching) {
    matching.promoted = {
      variantFile: stagedFile,
      assetPath: promotedAsset,
      tsSnippet,
    };
    session.upsertConcept(matching);
    const evt: ConceptUpdatedEvent = { concept: matching };
    sessionEmitter.emit('concept_updated', evt);
  }

  return { promotedAsset, tsSnippet };
}

/**
 * Extract the paste-ready TypeScript block printed by promote() at
 * scripts/generate_moji.py:442. The Python script prints exactly:
 *
 *   Paste into src/data/mojiMashPuzzles.ts:
 *
 *     {
 *       image: require('../../assets/genmoji/<slug>.png'),
 *       words: ['w1', 'w2'],
 *       hint: 'Starts with: w, w',
 *       // date: 'YYYY-MM-DD',
 *     },
 */
function extractTsSnippet(stdout: string, slug: string, words: string[]): string {
  const idx = stdout.indexOf('Paste into');
  if (idx === -1) {
    // Fallback: synthesize from known inputs (mirrors generate_hint() at
    // scripts/generate_moji.py:56).
    const letters = words.map((w) => (w[0] ?? '').toLowerCase()).join(', ');
    const wordsTs = words.map((w) => `'${w}'`).join(', ');
    return [
      '  {',
      `    image: require('../../assets/genmoji/${slug}.png'),`,
      `    words: [${wordsTs}],`,
      `    hint: 'Starts with: ${letters}',`,
      `    // date: 'YYYY-MM-DD',  // uncomment to pin to a specific date`,
      '  },',
    ].join('\n');
  }
  const after = stdout.slice(idx);
  const lines = after.split('\n');
  const start = lines.findIndex((l) => l.trim() === '{');
  if (start === -1) return after.trim();
  const end = lines.findIndex((l, i) => i >= start && l.trim() === '},');
  if (end === -1) return lines.slice(start).join('\n').trim();
  return lines.slice(start, end + 1).join('\n');
}
