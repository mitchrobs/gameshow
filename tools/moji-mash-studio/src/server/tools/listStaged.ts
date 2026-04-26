import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REPO_ROOT, STAGE_BASE } from '../config.js';
import { parseContactSheet } from './contactSheetParser.js';
import type { Variant } from '../../shared/types.js';

export interface StagedConceptSummary {
  /** Slug derived from filenames, e.g. "tax-return". */
  slug: string;
  /** YYYY-MM-DD subdirectory the variants live under. */
  date: string;
  /** Repo-relative directory like "tmp/moji-mash/2026-04-11". */
  stagedDir: string;
  /** All PNG variant filenames in that directory for this slug. */
  variants: string[];
  /** Per-variant rubric scores parsed from the contact sheet, if --check was run. */
  scoredVariants?: Variant[];
  /** True if a contact sheet (index.html) exists alongside the PNGs. */
  hasContactSheet: boolean;
  /** True if any variant filename ends with -r<seed> (refined). */
  hasRefined: boolean;
}

export interface ListStagedResult {
  total: number;
  concepts: StagedConceptSummary[];
}

const SLUG_RE = /^(.+)-[sr]\d+(?:_\d+)?\.png$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Walk STAGE_BASE/YYYY-MM-DD/ subdirectories, group PNGs by slug, and (when
 * an index.html contact sheet is present) attach the parsed rubric scores so
 * the agent can resume an earlier session without regenerating images.
 *
 * Filename convention (set by scripts/generate_moji.py):
 *   <slug>-s<seed>.png            — fresh generation
 *   <slug>-s<seed>_<n>.png        — same seed, n-th variant
 *   <slug>-r<seed>.png            — refined / img2img output
 */
export function listStagedTool(opts: { date?: string; slug?: string } = {}): ListStagedResult {
  if (!existsSync(STAGE_BASE)) return { total: 0, concepts: [] };

  const dateFilter = opts.date && DATE_RE.test(opts.date) ? opts.date : null;
  const slugFilter = opts.slug ? opts.slug.toLowerCase().trim() : null;

  const dateDirs: string[] = [];
  for (const entry of readdirSync(STAGE_BASE)) {
    if (!DATE_RE.test(entry)) continue;
    if (dateFilter && entry !== dateFilter) continue;
    const abs = join(STAGE_BASE, entry);
    try {
      if (statSync(abs).isDirectory()) dateDirs.push(entry);
    } catch {
      // skip
    }
  }
  dateDirs.sort().reverse(); // most-recent date first

  const concepts: StagedConceptSummary[] = [];

  for (const date of dateDirs) {
    const stagedDirAbs = join(STAGE_BASE, date);
    const stagedDirRel = relative(REPO_ROOT, stagedDirAbs);
    const bySlug = new Map<string, string[]>();

    let files: string[] = [];
    try {
      files = readdirSync(stagedDirAbs);
    } catch {
      continue;
    }

    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const m = file.match(SLUG_RE);
      if (!m || !m[1]) continue;
      const slug = m[1].toLowerCase();
      if (slugFilter && slug !== slugFilter) continue;
      const arr = bySlug.get(slug) ?? [];
      arr.push(file);
      bySlug.set(slug, arr);
    }

    if (bySlug.size === 0) continue;

    const hasContactSheet = files.includes('index.html');
    let scored: Variant[] = [];
    if (hasContactSheet) {
      try {
        scored = parseContactSheet(stagedDirAbs, stagedDirRel);
      } catch {
        scored = [];
      }
    }
    const scoredByFile = new Map(scored.map((v) => [v.file, v] as const));

    for (const [slug, variants] of bySlug) {
      variants.sort();
      const slugScored = variants
        .map((file) => scoredByFile.get(file))
        .filter((v): v is Variant => Boolean(v));
      concepts.push({
        slug,
        date,
        stagedDir: stagedDirRel,
        variants,
        scoredVariants: slugScored.length > 0 ? slugScored : undefined,
        hasContactSheet,
        hasRefined: variants.some((f) => /-r\d+(?:_\d+)?\.png$/.test(f)),
      });
    }
  }

  // Sort: newest date first, then alphabetically by slug.
  concepts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));

  return { total: concepts.length, concepts };
}
