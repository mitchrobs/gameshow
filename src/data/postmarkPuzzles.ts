import { postmarkPack, postmarkPackStartDate } from './postmarkPack.generated';
import {
  analyzePostmarkPuzzleQuality,
  countPostmarkSolutions,
  countRouteTurns,
  getPostmarkDayNumber,
  validatePostmarkRoutes,
  validatePostmarkSolution,
  type PostmarkCoord,
  type PostmarkPackEntry,
  type PostmarkPost,
  type PostmarkPuzzle,
  type PostmarkRoute,
  type PostmarkRouteState,
  type PostmarkStart,
  type PostmarkStartSide,
  type PostmarkValidationResult,
} from './postmarkGenerator';
import {
  POSTMARK_PACK_LENGTH,
  POSTMARK_PACK_START_DATE,
  type PostmarkDifficulty,
} from './postmarkMetadata';
import { dateKeyToUtcOrdinal, getUtcDateKey } from '../utils/dailyUtc';

export type {
  PostmarkCoord,
  PostmarkDifficulty,
  PostmarkPackEntry,
  PostmarkPost,
  PostmarkPuzzle,
  PostmarkRoute,
  PostmarkRouteState,
  PostmarkStart,
  PostmarkStartSide,
  PostmarkValidationResult,
};

const packByDate = new Map(postmarkPack.map((entry) => [entry.date, entry]));
const fallbackCache = new Map<string, PostmarkPackEntry>();

function clonePuzzleForDate(puzzle: PostmarkPuzzle, dateKey: string): PostmarkPuzzle {
  return {
    ...puzzle,
    id: `postmark-${dateKey}`,
    starts: puzzle.starts.map((start) => ({
      ...start,
      entry: { ...start.entry },
    })),
    posts: puzzle.posts.map((post) => ({ ...post })),
    solution: puzzle.solution.map((route) => ({
      ...route,
      cells: route.cells.map((cell) => ({ ...cell })),
    })),
  };
}

function buildCycledFallbackEntry(dateKey: string): PostmarkPackEntry {
  const dayNumber = getPostmarkDayNumber(dateKey);
  const baseEntry = postmarkPack[dayNumber - 1] ?? postmarkPack[0]!;
  return {
    ...baseEntry,
    date: dateKey,
    dayNumber,
    source: 'fallback',
    puzzle: clonePuzzleForDate(baseEntry.puzzle, dateKey),
  };
}

export function isPostmarkPackDateCovered(date: Date = new Date()): boolean {
  return packByDate.has(getUtcDateKey(date));
}

export function getDailyPostmarkPackEntry(date: Date = new Date()): PostmarkPackEntry {
  const dateKey = getUtcDateKey(date);
  const entry = packByDate.get(dateKey);
  if (entry) return entry;

  const cached = fallbackCache.get(dateKey);
  if (cached) return cached;

  const fallback = buildCycledFallbackEntry(dateKey);
  fallbackCache.set(dateKey, fallback);
  return fallback;
}

export function getDailyPostmark(date: Date = new Date()): PostmarkPuzzle {
  return getDailyPostmarkPackEntry(date).puzzle;
}

export function getPostmarkPackMetadata() {
  return {
    startDate: postmarkPackStartDate || POSTMARK_PACK_START_DATE,
    length: postmarkPack.length || POSTMARK_PACK_LENGTH,
    startOrdinal: dateKeyToUtcOrdinal(postmarkPackStartDate || POSTMARK_PACK_START_DATE),
  };
}

export { countPostmarkSolutions, getPostmarkDayNumber, validatePostmarkRoutes, validatePostmarkSolution };
export { analyzePostmarkPuzzleQuality, countRouteTurns };
