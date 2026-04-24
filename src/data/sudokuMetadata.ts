export type SudokuDifficulty = 'Easy' | 'Medium' | 'Hard';

export type MiniSudokuPatternFamily =
  | 'ring'
  | 'cross'
  | 'diagonal'
  | 'pinwheel'
  | 'banded'
  | 'scatter';

export type MiniSudokuSymmetryId =
  | 'rotational'
  | 'mirror-h'
  | 'mirror-v'
  | 'diagonal'
  | 'anti-diagonal'
  | 'none';

export const MINI_SUDOKU_PACK_START_DATE = '2026-04-24';
export const MINI_SUDOKU_PACK_LENGTH = 365;
export const MINI_SUDOKU_ONBOARDING_DAYS = 28;

export const MINI_SUDOKU_PATTERN_FAMILIES: readonly MiniSudokuPatternFamily[] = [
  'ring',
  'cross',
  'diagonal',
  'pinwheel',
  'banded',
  'scatter',
];

export const MINI_SUDOKU_SYMMETRIES: readonly MiniSudokuSymmetryId[] = [
  'rotational',
  'mirror-h',
  'mirror-v',
  'diagonal',
  'anti-diagonal',
  'none',
];

export const MINI_SUDOKU_PATTERN_GAP_DAYS = 4;
export const MINI_SUDOKU_DIFFICULTY_FAMILY_GAP_DAYS = 7;

export const MINI_SUDOKU_DIFFICULTY_TOTALS: Record<SudokuDifficulty, number> = {
  Easy: 96,
  Medium: 191,
  Hard: 78,
};

export const MINI_SUDOKU_ONBOARDING_TOTALS: Record<SudokuDifficulty, number> = {
  Easy: 12,
  Medium: 14,
  Hard: 2,
};

export const MINI_SUDOKU_SIZE_BY_DIFFICULTY: Record<
  SudokuDifficulty,
  { size: number; boxRows: number; boxCols: number }
> = {
  Easy: { size: 6, boxRows: 2, boxCols: 3 },
  Medium: { size: 6, boxRows: 2, boxCols: 3 },
  Hard: { size: 9, boxRows: 3, boxCols: 3 },
};
