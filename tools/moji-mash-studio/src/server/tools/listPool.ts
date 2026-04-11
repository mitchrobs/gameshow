import { existsSync, readFileSync } from 'node:fs';
import { PUZZLES_TS } from '../config.js';

export interface PoolSummary {
  total: number;
  rotationCount: number;
  pinnedCount: number;
  tuples: string[][];
  wordCounts: Record<string, number>;
  pinnedDates: string[];
}

/**
 * TypeScript port of `load_existing_pool` and `count_pinned` from
 * scripts/generate_moji.py:61-83. Parses the puzzles array via the same regex
 * as the Python script so the two can never disagree.
 */
export function listPoolTool(): PoolSummary {
  if (!existsSync(PUZZLES_TS)) {
    return {
      total: 0,
      rotationCount: 0,
      pinnedCount: 0,
      tuples: [],
      wordCounts: {},
      pinnedDates: [],
    };
  }
  const text = readFileSync(PUZZLES_TS, 'utf8');

  // Match `words: ['a', 'b', 'c']` exactly the way the Python script does.
  const tuples: string[][] = [];
  const wordCounts: Record<string, number> = {};
  const wordsRe = /words:\s*\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = wordsRe.exec(text)) !== null) {
    const raw = m[1] ?? '';
    const words = raw
      .split(',')
      .map((w) => w.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    tuples.push(words);
    for (const w of words) {
      wordCounts[w] = (wordCounts[w] ?? 0) + 1;
    }
  }

  const pinnedDates: string[] = [];
  const dateRe = /date:\s*['"]([^'"]+)['"]/g;
  while ((m = dateRe.exec(text)) !== null) {
    if (m[1]) pinnedDates.push(m[1]);
  }

  return {
    total: tuples.length,
    rotationCount: tuples.length - pinnedDates.length,
    pinnedCount: pinnedDates.length,
    tuples,
    wordCounts,
    pinnedDates,
  };
}
