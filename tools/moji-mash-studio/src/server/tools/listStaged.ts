import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REPO_ROOT, STAGE_BASE } from '../config.js';
import { parseContactSheet } from './contactSheetParser.js';
import type { Variant } from '../../shared/types.js';

export interface StagedConcept {
  /** YYYY-MM-DD subdirectory name. */
  date: string;
  /** Slug derived from PNG filenames (e.g. "tax-return"). */
  slug: string;
  /** Repo-relative directory, e.g. "tmp/moji-mash/2026-04-15". */
  stagedDir: string;
  /** Files matching this slug, sorted by name (so seeds appear in order). */
  files: string[];
  /**
   * Per-variant rubric data — only populated when index.html exists for the
   * date and could be parsed. Otherwise this is empty and the agent can still
   * see the file list above.
   */
  variants: Variant[];
}

export interface ListStagedResult {
  /** Most-recent dates first (lexical sort works for ISO YYYY-MM-DD). */
  concepts: StagedConcept[];
  /** Number of date subdirectories scanned. */
  daysScanned: number;
}

/**
 * Walk tmp/moji-mash/YYYY-MM-DD/ and group staged PNGs by slug so the agent
 * can pick up where a previous chat session left off. Each date subdirectory
 * may contain images for multiple slugs; we split them by the `<slug>-s<seed>`
 * filename convention used by scripts/generate_moji.py.
 *
 * If the date has an index.html (i.e. it was generated with --check), we
 * parse it once and split the variants per slug so the agent sees rubric
 * scores too. This is exactly what the gallery panel shows live, but stays
 * available across server restarts.
 */
export function listStagedTool(): ListStagedResult {
  if (!existsSync(STAGE_BASE)) {
    return { concepts: [], daysScanned: 0 };
  }

  const dates = readdirSync(STAGE_BASE)
    .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry))
    .filter((entry) => {
      try {
        return statSync(join(STAGE_BASE, entry)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort()
    .reverse();

  const concepts: StagedConcept[] = [];

  for (const dateKey of dates) {
    const stagedDirAbs = join(STAGE_BASE, dateKey);
    const stagedDirRel = relative(REPO_ROOT, stagedDirAbs);

    let entries: string[];
    try {
      entries = readdirSync(stagedDirAbs);
    } catch {
      continue;
    }
    const pngs = entries.filter((f) => f.endsWith('.png')).sort();
    if (pngs.length === 0) continue;

    // Filenames look like `<slug>-s<seed>[ _<n>].png`. Strip from the last
    // `-s<digits>` to derive slug. This mirrors the convention in
    // scripts/generate_moji.py:generate().
    const bySlug = new Map<string, string[]>();
    for (const file of pngs) {
      const m = file.match(/^(.+)-[sr]\d+(?:_\d+)?\.png$/);
      const slug = m && m[1] ? m[1] : file.replace(/\.png$/, '');
      const arr = bySlug.get(slug) ?? [];
      arr.push(file);
      bySlug.set(slug, arr);
    }

    // Parse the contact sheet once if present — it may cover any subset of
    // the slugs in this directory (whichever was generated last).
    const allVariants: Variant[] = parseContactSheet(stagedDirAbs, stagedDirRel);
    const variantsBySlug = new Map<string, Variant[]>();
    for (const v of allVariants) {
      const m = v.file.match(/^(.+)-[sr]\d+(?:_\d+)?\.png$/);
      const slug = m && m[1] ? m[1] : v.file.replace(/\.png$/, '');
      const arr = variantsBySlug.get(slug) ?? [];
      arr.push(v);
      variantsBySlug.set(slug, arr);
    }

    for (const [slug, files] of bySlug) {
      concepts.push({
        date: dateKey,
        slug,
        stagedDir: stagedDirRel,
        files,
        variants: variantsBySlug.get(slug) ?? [],
      });
    }
  }

  return { concepts, daysScanned: dates.length };
}
