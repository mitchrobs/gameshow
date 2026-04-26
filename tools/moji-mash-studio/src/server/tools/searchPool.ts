import { listPoolTool } from './listPool.js';
import { existsSync, readFileSync } from 'node:fs';
import { PUZZLES_TS } from '../config.js';

export interface SearchPoolInput {
  /** Filter to entries whose tuple contains ANY of these words (lowercase). */
  words?: string[];
  /** ISO date (YYYY-MM-DD) — combine with within_days for recency search. */
  near_date?: string;
  /** Window size in days for near_date. Defaults to 14. */
  within_days?: number;
  /** Only consider pinned (date-tagged) puzzles. */
  pinned_only?: boolean;
  /** Cap result entries (default 50). */
  limit?: number;
}

export interface PoolEntry {
  words: string[];
  /** ISO date or null for rotation puzzles. */
  date: string | null;
  /** If near_date supplied: absolute day difference (date - near_date). */
  daysAway?: number;
  /** Words from the request that matched this entry. */
  matchedWords?: string[];
}

export interface SearchPoolResult {
  total: number;
  entries: PoolEntry[];
  /** Word -> count across the FULL pool (always informational). */
  wordCounts: Record<string, number>;
  /** Words from the input filter that don't appear in the pool at all. */
  unseenWords?: string[];
  /** True if any entry matched the input words AND date window. */
  conflict: boolean;
  /** Plain-text human summary of the result. */
  summary: string;
}

const ENTRY_RE = /\{\s*image:[^}]*?words:\s*\[([^\]]+)\][^}]*?(?:date:\s*['"]([^'"]+)['"][^}]*?)?\}/g;

/**
 * Parse the puzzle list and return entries along with their (optional) pinned
 * date so the caller can do date-aware recency checks. Mirrors the regex in
 * listPoolTool and scripts/generate_moji.py:load_existing_pool.
 */
function loadEntries(): PoolEntry[] {
  if (!existsSync(PUZZLES_TS)) return [];
  const text = readFileSync(PUZZLES_TS, 'utf8');
  const out: PoolEntry[] = [];
  let m: RegExpExecArray | null;
  ENTRY_RE.lastIndex = 0;
  while ((m = ENTRY_RE.exec(text)) !== null) {
    const wordsRaw = m[1] ?? '';
    const words = wordsRaw
      .split(',')
      .map((w) => w.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    if (words.length === 0) continue;
    out.push({ words, date: m[2] ?? null });
  }
  return out;
}

function daysBetween(a: string, b: string): number {
  const da = Date.parse(a);
  const db = Date.parse(b);
  if (Number.isNaN(da) || Number.isNaN(db)) return Number.POSITIVE_INFINITY;
  return Math.abs(Math.round((da - db) / (24 * 60 * 60 * 1000)));
}

/**
 * Targeted query against the puzzle pool. Use this instead of listPoolTool when
 * you only care about whether a specific word will collide with a recent
 * pinned puzzle, or when you want to scan everything tagged for a given date
 * window.
 *
 * Examples:
 *   search_pool({ words: ['tax'], near_date: '2026-04-15', within_days: 14, pinned_only: true })
 *     → did we already use 'tax' near tax day this year?
 *   search_pool({ words: ['party', 'pooper'] })
 *     → has the exact concept appeared anywhere?
 */
export function searchPoolTool(input: SearchPoolInput = {}): SearchPoolResult {
  const limit = Math.max(1, Math.min(input.limit ?? 50, 500));
  const words = (input.words ?? []).map((w) => String(w).toLowerCase().trim()).filter(Boolean);
  const wordSet = new Set(words);
  const pinnedOnly = Boolean(input.pinned_only);
  const within = Math.max(0, input.within_days ?? 14);
  const nearDate = input.near_date ?? null;

  const summary = listPoolTool();
  const allEntries = loadEntries();

  const filtered: PoolEntry[] = [];
  let conflict = false;

  for (const entry of allEntries) {
    if (pinnedOnly && !entry.date) continue;
    let matchedWords: string[] | undefined;
    if (wordSet.size > 0) {
      matchedWords = entry.words.filter((w) => wordSet.has(w));
      if (matchedWords.length === 0) continue;
    }
    let daysAway: number | undefined;
    if (nearDate && entry.date) {
      daysAway = daysBetween(entry.date, nearDate);
      if (daysAway > within) continue;
    } else if (nearDate && !entry.date && pinnedOnly === false) {
      // Rotation puzzles have no date — skip date-window filtering for them.
    } else if (nearDate && !entry.date) {
      continue;
    }
    const out: PoolEntry = { words: entry.words, date: entry.date };
    if (matchedWords) out.matchedWords = matchedWords;
    if (daysAway !== undefined) out.daysAway = daysAway;
    filtered.push(out);
    if (matchedWords && matchedWords.length > 0 && (daysAway === undefined || daysAway <= within)) {
      // Conflict only meaningful if caller is checking a word against a date window.
      if (nearDate && entry.date) conflict = true;
    }
  }

  // Sort: nearest in time first when near_date supplied, else most-recent date.
  filtered.sort((a, b) => {
    if (a.daysAway !== undefined && b.daysAway !== undefined) return a.daysAway - b.daysAway;
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });

  const sliced = filtered.slice(0, limit);

  let unseen: string[] | undefined;
  if (words.length > 0) {
    unseen = words.filter((w) => !summary.wordCounts[w]);
    if (unseen.length === 0) unseen = undefined;
  }

  let summaryText: string;
  if (filtered.length === 0) {
    summaryText = words.length > 0
      ? `No matches in pool for ${words.map((w) => `'${w}'`).join(', ')}${nearDate ? ` within ${within} days of ${nearDate}` : ''}.`
      : 'No entries matched the filter.';
  } else {
    summaryText = `${filtered.length} matching entr${filtered.length === 1 ? 'y' : 'ies'}${conflict ? ' — RECENCY CONFLICT' : ''}`;
  }

  const restricted: Record<string, number> = {};
  if (words.length > 0) {
    for (const w of words) {
      if (summary.wordCounts[w] !== undefined) restricted[w] = summary.wordCounts[w] as number;
    }
  }

  return {
    total: filtered.length,
    entries: sliced,
    wordCounts: words.length > 0 ? restricted : summary.wordCounts,
    unseenWords: unseen,
    conflict,
    summary: summaryText,
  };
}
