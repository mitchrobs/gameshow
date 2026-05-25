import type {
  ThreadlineCoord,
  ThreadlineDifficulty,
  ThreadlinePuzzle,
  ThreadlineSegment,
  ThreadlineThread,
  ThreadlineWord,
} from './threadlinePuzzles';
import {
  THREADLINE_RUNTIME_COMPACT_PUZZLES,
  THREADLINE_RUNTIME_DATED_INDEXES,
  THREADLINE_RUNTIME_READY_RESERVE_INDEXES,
} from './threadlineRuntimePackData.ts';

const THREADLINE_RUNTIME_GRID_COLS = 8;

type CompactLeadSegment = ['t', string] | ['b', string];
type CompactThread = [string, string, string];
type CompactWord = [string, string, string, string, string];
type CompactPuzzle = [
  string,
  string,
  string,
  ThreadlineDifficulty,
  string,
  CompactLeadSegment[],
  CompactThread[],
  CompactWord[],
  string,
  string,
];

const compactPuzzles = THREADLINE_RUNTIME_COMPACT_PUZZLES as unknown as CompactPuzzle[];
const runtimeDatedIndexes = THREADLINE_RUNTIME_DATED_INDEXES as unknown as Array<[string, number]>;
const runtimeReadyReserveIndexes = THREADLINE_RUNTIME_READY_RESERVE_INDEXES as unknown as number[];

const runtimePuzzleIndexById: Record<string, number> = Object.fromEntries(
  compactPuzzles.map((puzzle, index) => [puzzle[0], index])
);

const runtimePuzzleIndexByDate: Record<string, number> = Object.fromEntries(runtimeDatedIndexes);

const runtimePuzzleCache = new Map<number, ThreadlinePuzzle>();

function inflateGrid(encodedGrid: string): string[] {
  const rows: string[] = [];
  for (let index = 0; index < encodedGrid.length; index += THREADLINE_RUNTIME_GRID_COLS) {
    rows.push(encodedGrid.slice(index, index + THREADLINE_RUNTIME_GRID_COLS));
  }
  return rows;
}

function inflateLead(segments: CompactLeadSegment[]): ThreadlineSegment[] {
  return segments.map((segment) =>
    segment[0] === 't'
      ? { type: 'text', text: segment[1] }
      : { type: 'blank', wordId: segment[1] }
  );
}

function inflateThreads(threads: CompactThread[]): ThreadlineThread[] {
  return threads.map(([id, name, clue]) => ({ id, name, clue }));
}

function inflatePath(encodedPath: string): ThreadlineCoord[] {
  const path: ThreadlineCoord[] = [];
  for (let index = 0; index < encodedPath.length; index += 2) {
    path.push({
      row: Number(encodedPath[index]),
      col: Number(encodedPath[index + 1]),
    });
  }
  return path;
}

function inflateWords(words: CompactWord[]): ThreadlineWord[] {
  return words.map(([id, answer, threadId, hint, encodedPath]) => ({
    id,
    answer,
    threadId,
    hint,
    path: inflatePath(encodedPath),
  }));
}

function inflatePuzzleAt(index: number): ThreadlinePuzzle {
  const cached = runtimePuzzleCache.get(index);
  if (cached) return cached;

  const compact = compactPuzzles[index];
  if (!compact) {
    throw new Error(`Missing Threadline runtime puzzle at index ${index}`);
  }

  const puzzle: ThreadlinePuzzle = {
    id: compact[0],
    title: compact[1],
    deck: compact[2],
    difficulty: compact[3],
    grid: inflateGrid(compact[4]),
    lead: inflateLead(compact[5]),
    threads: inflateThreads(compact[6]),
    words: inflateWords(compact[7]),
    weave: compact[8],
    note: compact[9],
  };
  runtimePuzzleCache.set(index, puzzle);
  return puzzle;
}

let runtimePuzzleBank: ThreadlinePuzzle[] | null = null;

export function getThreadlineRuntimePuzzles(): ThreadlinePuzzle[] {
  if (!runtimePuzzleBank) {
    runtimePuzzleBank = compactPuzzles.map((_puzzle, index) => inflatePuzzleAt(index));
  }
  return runtimePuzzleBank;
}

export function getThreadlineRuntimePuzzleByDateKey(dateKeyValue: string): ThreadlinePuzzle | null {
  const puzzleIndex = runtimePuzzleIndexByDate[dateKeyValue];
  return puzzleIndex === undefined ? null : inflatePuzzleAt(puzzleIndex);
}

export function getThreadlineRuntimeOutOfWindowFallback(dateKeyValue: string): ThreadlinePuzzle {
  const fallbackIndexes =
    runtimeReadyReserveIndexes.length > 0
      ? runtimeReadyReserveIndexes
      : runtimeDatedIndexes.map((entry) => entry[1]);

  if (fallbackIndexes.length === 0) return inflatePuzzleAt(0);

  const seed = Array.from(dateKeyValue).reduce(
    (hash, letter) => Math.imul(hash ^ letter.charCodeAt(0), 16_777_619) >>> 0,
    2_166_136_261
  );
  return inflatePuzzleAt(fallbackIndexes[seed % fallbackIndexes.length]);
}

export function getThreadlineRuntimePuzzleById(puzzleId: string): ThreadlinePuzzle | null {
  const index = runtimePuzzleIndexById[puzzleId];
  return index === undefined ? null : inflatePuzzleAt(index);
}
