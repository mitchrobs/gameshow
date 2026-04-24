import packData from './sudoku/pack.json';
import {
  MINI_SUDOKU_PACK_LENGTH,
  MINI_SUDOKU_PACK_START_DATE,
  MINI_SUDOKU_PATTERN_FAMILIES,
  MINI_SUDOKU_SIZE_BY_DIFFICULTY,
  MINI_SUDOKU_SYMMETRIES,
  type MiniSudokuPatternFamily,
  type MiniSudokuSymmetryId,
  type SudokuDifficulty,
} from './sudokuMetadata';
import { dateKeyToUtcOrdinal, getUtcDateKey, getUtcDateNumber } from '../utils/dailyUtc';

export type { MiniSudokuPatternFamily, MiniSudokuSymmetryId, SudokuDifficulty };

export interface SudokuPuzzle {
  id: string;
  difficulty: SudokuDifficulty;
  size: number;
  boxRows: number;
  boxCols: number;
  digits: number[];
  grid: number[][];
  solution: number[][];
}

export interface MiniSudokuPackEntry {
  date: string;
  difficulty: SudokuDifficulty;
  patternFamily: MiniSudokuPatternFamily;
  symmetryId: MiniSudokuSymmetryId;
  maskSlug: string;
  givens: number;
  difficultyScore: number;
  signature: string;
  source: 'pack' | 'fallback';
  puzzle: SudokuPuzzle;
}

interface MiniSudokuPackPayload {
  version: string;
  generatedAt: string;
  startDate: string;
  endDate: string;
  length: number;
  entries: MiniSudokuPackEntry[];
}

interface FallbackTarget {
  min: number;
  max: number;
}

const PACK = packData as MiniSudokuPackPayload;
const packByDate = new Map(PACK.entries.map((entry) => [entry.date, entry]));
const fallbackCache = new Map<string, MiniSudokuPackEntry>();

const FALLBACK_GIVENS: Record<SudokuDifficulty, FallbackTarget> = {
  Easy: { min: 18, max: 19 },
  Medium: { min: 14, max: 15 },
  Hard: { min: 36, max: 40 },
};

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildOrder(unitSize: number, unitCount: number, rand: () => number): number[] {
  const groups = shuffle(
    Array.from({ length: unitCount }, (_, index) => index),
    rand
  );
  const order: number[] = [];
  groups.forEach((group) => {
    const inner = shuffle(
      Array.from({ length: unitSize }, (_, index) => index),
      rand
    );
    inner.forEach((offset) => order.push(group * unitSize + offset));
  });
  return order;
}

function buildCanonicalGrid(size: number, boxRows: number, boxCols: number): number[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      return ((row % boxRows) * boxCols + Math.floor(row / boxRows) + col) % size + 1;
    })
  );
}

function generateSolution(size: number, boxRows: number, boxCols: number, rand: () => number) {
  const rowOrder = buildOrder(boxRows, size / boxRows, rand);
  const colOrder = buildOrder(boxCols, size / boxCols, rand);
  const digitOrder = shuffle(
    Array.from({ length: size }, (_, index) => index + 1),
    rand
  );
  const canonical = buildCanonicalGrid(size, boxRows, boxCols);

  return rowOrder.map((rowIndex) =>
    colOrder.map((colIndex) => {
      const value = canonical[rowIndex][colIndex];
      return digitOrder[value - 1] ?? value;
    })
  );
}

function cloneGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}

function getBoxIndex(row: number, col: number, size: number, boxRows: number, boxCols: number) {
  return Math.floor(row / boxRows) * (size / boxCols) + Math.floor(col / boxCols);
}

function countBits(mask: number): number {
  let value = mask;
  let count = 0;
  while (value) {
    value &= value - 1;
    count += 1;
  }
  return count;
}

function countSolutions(
  puzzle: number[][],
  size: number,
  boxRows: number,
  boxCols: number,
  limit = 2
): number {
  const rowUsed = Array(size).fill(0);
  const colUsed = Array(size).fill(0);
  const boxUsed = Array(size).fill(0);
  const empties: Array<{ row: number; col: number }> = [];
  const fullMask = (1 << size) - 1;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = puzzle[row]?.[col] ?? 0;
      if (!value) {
        empties.push({ row, col });
        continue;
      }
      const bit = 1 << (value - 1);
      const box = getBoxIndex(row, col, size, boxRows, boxCols);
      if ((rowUsed[row] & bit) !== 0 || (colUsed[col] & bit) !== 0 || (boxUsed[box] & bit) !== 0) {
        return 0;
      }
      rowUsed[row] |= bit;
      colUsed[col] |= bit;
      boxUsed[box] |= bit;
    }
  }

  let solutions = 0;

  const search = () => {
    if (solutions >= limit) return;

    let bestCellIndex = -1;
    let bestMask = 0;
    let bestCount = Number.POSITIVE_INFINITY;

    for (let index = 0; index < empties.length; index += 1) {
      const { row, col } = empties[index]!;
      if (puzzle[row][col] !== 0) continue;
      const box = getBoxIndex(row, col, size, boxRows, boxCols);
      const mask = fullMask & ~(rowUsed[row] | colUsed[col] | boxUsed[box]);
      if (mask === 0) return;
      const candidateCount = countBits(mask);
      if (candidateCount < bestCount) {
        bestCellIndex = index;
        bestMask = mask;
        bestCount = candidateCount;
        if (candidateCount === 1) break;
      }
    }

    if (bestCellIndex === -1) {
      solutions += 1;
      return;
    }

    const { row, col } = empties[bestCellIndex]!;
    const box = getBoxIndex(row, col, size, boxRows, boxCols);
    let mask = bestMask;
    while (mask !== 0 && solutions < limit) {
      const bit = mask & -mask;
      const digit = Math.log2(bit) + 1;
      puzzle[row][col] = digit;
      rowUsed[row] |= bit;
      colUsed[col] |= bit;
      boxUsed[box] |= bit;
      search();
      puzzle[row][col] = 0;
      rowUsed[row] &= ~bit;
      colUsed[col] &= ~bit;
      boxUsed[box] &= ~bit;
      mask &= mask - 1;
    }
  };

  search();
  return solutions;
}

function carveUniquePuzzle(
  solution: number[][],
  size: number,
  boxRows: number,
  boxCols: number,
  target: FallbackTarget,
  rand: () => number
): number[][] {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const puzzle = cloneGrid(solution);
    const positions = shuffle(
      Array.from({ length: size * size }, (_, index) => index),
      rand
    );
    let givens = size * size;

    for (const position of positions) {
      if (givens <= target.min) break;
      const row = Math.floor(position / size);
      const col = position % size;
      const saved = puzzle[row][col];
      if (saved === 0) continue;
      puzzle[row][col] = 0;
      const solutionCount = countSolutions(cloneGrid(puzzle), size, boxRows, boxCols, 2);
      if (solutionCount !== 1) {
        puzzle[row][col] = saved;
        continue;
      }
      givens -= 1;
    }

    if (givens >= target.min && givens <= target.max) {
      return puzzle;
    }
  }

  return solution.map((row, rowIndex) =>
    row.map((value, colIndex) => {
      if (rowIndex === colIndex || (rowIndex + colIndex) % 2 === 0) return value;
      return 0;
    })
  );
}

function buildDifficultyScore(
  difficulty: SudokuDifficulty,
  size: number,
  givens: number
): number {
  if (difficulty === 'Easy') {
    return Math.max(24, 50 - givens);
  }
  if (difficulty === 'Medium') {
    return Math.max(42, 62 - givens);
  }
  return Math.max(70, 92 - givens + size);
}

function chooseFallbackDifficulty(date: Date, rand: () => number): SudokuDifficulty {
  const ordinal = Math.abs(getUtcDateNumber(date)) % 365;
  const quotaIndex = ordinal / 365;
  const roll = (quotaIndex + rand()) / 2;
  if (roll < 96 / 365) return 'Easy';
  if (roll < (96 + 191) / 365) return 'Medium';
  return 'Hard';
}

function buildFallbackEntry(date: Date): MiniSudokuPackEntry {
  const dateKey = getUtcDateKey(date);
  const seed = getUtcDateNumber(date) + 93457;
  const rand = mulberry32(seed);
  const difficulty = chooseFallbackDifficulty(date, rand);
  const geometry = MINI_SUDOKU_SIZE_BY_DIFFICULTY[difficulty];
  const solution = generateSolution(geometry.size, geometry.boxRows, geometry.boxCols, rand);
  const puzzleGrid = carveUniquePuzzle(
    solution,
    geometry.size,
    geometry.boxRows,
    geometry.boxCols,
    FALLBACK_GIVENS[difficulty],
    rand
  );
  const givens = puzzleGrid.flat().filter((value) => value !== 0).length;
  const patternFamily =
    MINI_SUDOKU_PATTERN_FAMILIES[Math.floor(rand() * MINI_SUDOKU_PATTERN_FAMILIES.length)] ??
    'scatter';
  const symmetryId =
    MINI_SUDOKU_SYMMETRIES[Math.floor(rand() * MINI_SUDOKU_SYMMETRIES.length)] ?? 'none';
  const digits = Array.from({ length: geometry.size }, (_, index) => index + 1);
  const signature = `${geometry.size}:${puzzleGrid.flat().join('')}:${solution[0]?.join('') ?? ''}`;
  const difficultyScore = buildDifficultyScore(difficulty, geometry.size, givens);

  return {
    date: dateKey,
    difficulty,
    patternFamily,
    symmetryId,
    maskSlug: `fallback-${patternFamily}-${symmetryId}`,
    givens,
    difficultyScore,
    signature,
    source: 'fallback',
    puzzle: {
      id: `sudoku-fallback-${dateKey}`,
      difficulty,
      size: geometry.size,
      boxRows: geometry.boxRows,
      boxCols: geometry.boxCols,
      digits,
      grid: puzzleGrid,
      solution,
    },
  };
}

export function isMiniSudokuPackDateCovered(date: Date = new Date()): boolean {
  return packByDate.has(getUtcDateKey(date));
}

export function getDailySudoku(date: Date = new Date()): MiniSudokuPackEntry {
  const key = getUtcDateKey(date);
  const fromPack = packByDate.get(key);
  if (fromPack) return fromPack;

  const cached = fallbackCache.get(key);
  if (cached) return cached;

  const fallback = buildFallbackEntry(date);
  fallbackCache.set(key, fallback);
  return fallback;
}

export function getDailySudokuPuzzle(date: Date = new Date()): SudokuPuzzle {
  return getDailySudoku(date).puzzle;
}

export function getMiniSudokuPackMetadata() {
  return {
    startDate: PACK.startDate || MINI_SUDOKU_PACK_START_DATE,
    length: PACK.length || MINI_SUDOKU_PACK_LENGTH,
    startOrdinal: dateKeyToUtcOrdinal(PACK.startDate || MINI_SUDOKU_PACK_START_DATE),
  };
}
