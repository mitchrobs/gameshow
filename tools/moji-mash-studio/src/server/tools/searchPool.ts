import { existsSync, readFileSync } from 'node:fs';
import { PUZZLES_TS } from '../config.js';

export interface SearchPoolInput {
  /** Words to look for. Match is OR across the list. */
  words?: string[];
  /** ISO date (YYYY-MM-DD). When set with within_days, filter by recency. */
  near_date?: string;
  /** Window in days around near_date (default 14). */
  within_days?: number;
  /** If true, only return puzzles that have a `date:` field. */
  pinned_only?: boolean;
  /** Cap the number of results returned. Default 50. */
  limit?: number;
}

export interface PoolEntry {
  words: string[];
  date: string | null;
  /** Insertion order in the file (0-indexed). */
  index: number;
}

export interface SearchPoolResult {
  matches: PoolEntry[];
  totalScanned: number;
  /** Echo of effective filters so the agent can tell what it actually applied. */
  applied: {
    words: string[];
    near_date: string | null;
    within_days: number | null;
    pinned_only: boolean;
    limit: number;
  };
}

const WORDS_RE = /words:\s*\[([^\]]+)\]/g;

/**
 * Filter the puzzle pool by word membership and/or date recency. Useful when
 * the agent is brainstorming around a theme ("show me everything that has
 * 'snake'") or guarding against pinned-puzzle conflicts ("anything pinned
 * within 14 days of 2026-04-20 that uses 'spring'?").
 *
 * Date matching considers absolute distance — i.e. "within 14 days of
 * 2026-04-20" returns entries dated 2026-04-06 through 2026-05-04.
 */
export function searchPoolTool(input: SearchPoolInput): SearchPoolResult {
  const wantedWords = (input.words ?? [])
    .map((w) => String(w).toLowerCase().trim())
    .filter(Boolean);
  const nearDate = typeof input.near_date === 'string' ? input.near_date : null;
  const withinDays = typeof input.within_days === 'number' ? input.within_days : 14;
  const pinnedOnly = Boolean(input.pinned_only);
  const limit = typeof input.limit === 'number' && input.limit > 0 ? input.limit : 50;

  const applied = {
    words: wantedWords,
    near_date: nearDate,
    within_days: nearDate ? withinDays : null,
    pinned_only: pinnedOnly,
    limit,
  };

  if (!existsSync(PUZZLES_TS)) {
    return { matches: [], totalScanned: 0, applied };
  }

  const text = readFileSync(PUZZLES_TS, 'utf8');
  const entries = parseEntries(text);
  const nearMs = nearDate ? Date.parse(`${nearDate}T00:00:00`) : NaN;
  const windowMs = withinDays * 24 * 60 * 60 * 1000;

  const matches: PoolEntry[] = [];
  for (const e of entries) {
    if (pinnedOnly && !e.date) continue;
    if (wantedWords.length > 0) {
      const overlap = wantedWords.some((w) => e.words.includes(w));
      if (!overlap) continue;
    }
    if (nearDate) {
      if (!e.date) continue;
      const eMs = Date.parse(`${e.date}T00:00:00`);
      if (Number.isNaN(eMs) || Math.abs(eMs - nearMs) > windowMs) continue;
    }
    matches.push(e);
    if (matches.length >= limit) break;
  }

  return { matches, totalScanned: entries.length, applied };
}

/**
 * Parse the puzzles file into ordered entries. We pair each `words: [...]`
 * match with the closest preceding `{` to scan that record's body for an
 * optional `date:` field. This avoids needing a real TypeScript parser while
 * still keeping the words/date pairing accurate.
 */
function parseEntries(text: string): PoolEntry[] {
  const entries: PoolEntry[] = [];
  let m: RegExpExecArray | null;
  let index = 0;
  WORDS_RE.lastIndex = 0;
  while ((m = WORDS_RE.exec(text)) !== null) {
    const raw = m[1] ?? '';
    const words = raw
      .split(',')
      .map((w) => w.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    // Look back ~600 chars for the start of the record and forward ~600 for
    // the close. The puzzles file is one entry per line typically, so this
    // is generous.
    const start = Math.max(0, m.index - 600);
    const end = Math.min(text.length, m.index + 600);
    const region = text.slice(start, end);
    const dateMatch = region.match(/date:\s*['"]([^'"]+)['"]/);
    entries.push({
      words,
      date: dateMatch && dateMatch[1] ? dateMatch[1] : null,
      index: index++,
    });
  }
  return entries;
}
