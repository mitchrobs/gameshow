export const STRADDLE_GRID_SIZE = 3;

export type StraddleAxis = "row" | "column";

export type StraddleTileId = string;

export interface StraddleTile {
  id: StraddleTileId;
  word: string;
}

export interface StraddleCategory {
  id: string;
  axis: StraddleAxis;
  index: number;
  label: string;
  tileIds: StraddleTileId[];
}

export interface StraddleSolvedLines {
  rows: boolean[];
  columns: boolean[];
}

export type StraddleBoard = StraddleTileId[];

export interface StraddleFixedCell {
  index: number;
  tileId: StraddleTileId;
}

export interface StraddleShareTextOptions {
  dateLabel: string;
  solvedLines: StraddleSolvedLines;
  wrongGuesses: number;
  maxWrongGuesses?: number;
  won: boolean;
  url?: string;
}

export interface StraddlePuzzleDefinition {
  id: string;
  date?: string;
  title?: string;
  tiles: StraddleTile[];
  solutionGrid: StraddleTileId[][];
  solutionBoard: StraddleBoard;
  fallbackUnsolvedBoard: StraddleBoard;
  fixedCell: StraddleFixedCell;
  rowCategories: StraddleCategory[];
  columnCategories: StraddleCategory[];
  categories: StraddleCategory[];
}

export const STRADDLE_MAX_INCORRECT_GUESSES = 4;
export const STRADDLE_SHARE_URL = "https://mitchrobs.github.io/gameshow/";

export const STRADDLE_TILES: StraddleTile[] = [
  { id: "mouse", word: "MOUSE" },
  { id: "cookie", word: "COOKIE" },
  { id: "boot", word: "BOOT" },
  { id: "bass", word: "BASS" },
  { id: "jam", word: "JAM" },
  { id: "band", word: "BAND" },
  { id: "bat", word: "BAT" },
  { id: "batter", word: "BATTER" },
  { id: "cap", word: "CAP" },
] as const;

export const STRADDLE_TILE_IDS = STRADDLE_TILES.map((tile) => tile.id);

export const STRADDLE_SOLUTION_GRID: StraddleTileId[][] = [
  ["mouse", "cookie", "boot"],
  ["bass", "jam", "band"],
  ["bat", "batter", "cap"],
];

export const STRADDLE_SOLUTION_BOARD: StraddleBoard =
  STRADDLE_SOLUTION_GRID.flat();

export const STRADDLE_FALLBACK_UNSOLVED_BOARD: StraddleBoard = [
  "mouse",
  "band",
  "cap",
  "cookie",
  "jam",
  "bat",
  "boot",
  "batter",
  "bass",
];

export const STRADDLE_FIXED_CELL: StraddleFixedCell = {
  index: 4,
  tileId: "jam",
};

export const STRADDLE_ROW_CATEGORIES: StraddleCategory[] = [
  {
    id: "computer-terms",
    axis: "row",
    index: 0,
    label: "Computer Terms",
    tileIds: ["mouse", "cookie", "boot"],
  },
  {
    id: "music-terms",
    axis: "row",
    index: 1,
    label: "Music Terms",
    tileIds: ["bass", "jam", "band"],
  },
  {
    id: "baseball-things",
    axis: "row",
    index: 2,
    label: "Baseball Things",
    tileIds: ["bat", "batter", "cap"],
  },
];

export const STRADDLE_COLUMN_CATEGORIES: StraddleCategory[] = [
  {
    id: "animals",
    axis: "column",
    index: 0,
    label: "Animals",
    tileIds: ["mouse", "bass", "bat"],
  },
  {
    id: "foods",
    axis: "column",
    index: 1,
    label: "Foods",
    tileIds: ["cookie", "jam", "batter"],
  },
  {
    id: "things-worn",
    axis: "column",
    index: 2,
    label: "Things Worn",
    tileIds: ["boot", "band", "cap"],
  },
];

export const STRADDLE_CATEGORIES = [
  ...STRADDLE_ROW_CATEGORIES,
  ...STRADDLE_COLUMN_CATEGORIES,
];

export const STRADDLE_DEMO_PUZZLE: StraddlePuzzleDefinition = {
  id: "demo",
  title: "Daily demo",
  tiles: STRADDLE_TILES,
  solutionGrid: STRADDLE_SOLUTION_GRID,
  solutionBoard: STRADDLE_SOLUTION_BOARD,
  fallbackUnsolvedBoard: STRADDLE_FALLBACK_UNSOLVED_BOARD,
  fixedCell: STRADDLE_FIXED_CELL,
  rowCategories: STRADDLE_ROW_CATEGORIES,
  columnCategories: STRADDLE_COLUMN_CATEGORIES,
  categories: STRADDLE_CATEGORIES,
};

function sameMembers(left: StraddleTileId[], right: StraddleTileId[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((id) => rightSet.has(id));
}

function getPuzzleTileIds(puzzle: StraddlePuzzleDefinition): StraddleTileId[] {
  return puzzle.tiles.map((tile) => tile.id);
}

function clampShareCount(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

function formatSolvedLineMarks(lines: boolean[]): string {
  return lines.map((solved) => (solved ? "🟦" : "⬜️")).join("");
}

export function formatStraddleShareText({
  dateLabel,
  solvedLines,
  wrongGuesses,
  maxWrongGuesses = STRADDLE_MAX_INCORRECT_GUESSES,
  won,
  url = STRADDLE_SHARE_URL,
}: StraddleShareTextOptions): string {
  const safeWrongGuesses = clampShareCount(wrongGuesses, maxWrongGuesses);
  return [
    `Straddle ${dateLabel}`,
    `${won ? "Solved" : "Stumped"} | ${safeWrongGuesses}/${maxWrongGuesses} misses`,
    `Rows ${formatSolvedLineMarks(solvedLines.rows)} | Cols ${formatSolvedLineMarks(
      solvedLines.columns,
    )}`,
    url,
  ].join("\n");
}

export function getStraddleTile(
  id: StraddleTileId,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): StraddleTile {
  const tile = puzzle.tiles.find((candidate) => candidate.id === id);
  if (!tile) {
    throw new Error(`Unknown Straddle tile: ${id}`);
  }
  return tile;
}

export function createEmptyStraddleSolvedLines(): StraddleSolvedLines {
  return {
    rows: Array(STRADDLE_GRID_SIZE).fill(false),
    columns: Array(STRADDLE_GRID_SIZE).fill(false),
  };
}

export function boardIndex(row: number, column: number): number {
  return row * STRADDLE_GRID_SIZE + column;
}

export function getCellFromIndex(index: number): {
  row: number;
  column: number;
} {
  return {
    row: Math.floor(index / STRADDLE_GRID_SIZE),
    column: index % STRADDLE_GRID_SIZE,
  };
}

export function getLineTileIds(
  board: StraddleBoard,
  axis: StraddleAxis,
  index: number,
): StraddleTileId[] {
  if (axis === "row") {
    return Array.from(
      { length: STRADDLE_GRID_SIZE },
      (_, column) => board[boardIndex(index, column)],
    );
  }

  return Array.from(
    { length: STRADDLE_GRID_SIZE },
    (_, row) => board[boardIndex(row, index)],
  );
}

export function getMatchingCategory(
  axis: StraddleAxis,
  tileIds: StraddleTileId[],
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): StraddleCategory | null {
  const categories =
    axis === "row" ? puzzle.rowCategories : puzzle.columnCategories;
  return (
    categories.find((category) => sameMembers(tileIds, category.tileIds)) ??
    null
  );
}

export function getSolvedLineCategory(
  board: StraddleBoard,
  axis: StraddleAxis,
  index: number,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): StraddleCategory | null {
  return getMatchingCategory(axis, getLineTileIds(board, axis, index), puzzle);
}

export function isLineSolved(
  solvedLines: StraddleSolvedLines,
  axis: StraddleAxis,
  index: number,
): boolean {
  return axis === "row" ? solvedLines.rows[index] : solvedLines.columns[index];
}

export function markLineSolved(
  solvedLines: StraddleSolvedLines,
  axis: StraddleAxis,
  index: number,
): StraddleSolvedLines {
  return {
    rows:
      axis === "row"
        ? solvedLines.rows.map(
            (solved, rowIndex) => solved || rowIndex === index,
          )
        : [...solvedLines.rows],
    columns:
      axis === "column"
        ? solvedLines.columns.map(
            (solved, columnIndex) => solved || columnIndex === index,
          )
        : [...solvedLines.columns],
  };
}

export function isBoardComplete(solvedLines: StraddleSolvedLines): boolean {
  return solvedLines.rows.every(Boolean) && solvedLines.columns.every(Boolean);
}

export function hasAnySolvedLine(
  board: StraddleBoard,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): boolean {
  for (let index = 0; index < STRADDLE_GRID_SIZE; index += 1) {
    if (getSolvedLineCategory(board, "row", index, puzzle)) return true;
    if (getSolvedLineCategory(board, "column", index, puzzle)) return true;
  }
  return false;
}

export function shuffleStraddleTiles(
  tileIds: StraddleTileId[] = STRADDLE_TILE_IDS,
  random: () => number = Math.random,
): StraddleBoard {
  const shuffled = [...tileIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function createRandomUnsolvedStraddleBoard(
  random: () => number = Math.random,
  maxTries = 200,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): StraddleBoard {
  const tileIds = getPuzzleTileIds(puzzle);
  for (let attempt = 0; attempt < maxTries; attempt += 1) {
    const board = shuffleStraddleTiles(tileIds, random);
    const fixedTileIndex = board.indexOf(puzzle.fixedCell.tileId);
    [board[puzzle.fixedCell.index], board[fixedTileIndex]] = [
      board[fixedTileIndex],
      board[puzzle.fixedCell.index],
    ];
    if (!hasAnySolvedLine(board, puzzle)) return board;
  }
  return [...puzzle.fallbackUnsolvedBoard];
}

export function swapBoardTiles(
  board: StraddleBoard,
  fromIndex: number,
  toIndex: number,
): StraddleBoard {
  if (fromIndex === toIndex) return [...board];
  const next = [...board];
  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
  return next;
}

export function isTilePinned(
  solvedLines: StraddleSolvedLines,
  index: number,
): boolean {
  const { row, column } = getCellFromIndex(index);
  return solvedLines.rows[row] && solvedLines.columns[column];
}

export function preservesSolvedLines(
  previousBoard: StraddleBoard,
  nextBoard: StraddleBoard,
  solvedLines: StraddleSolvedLines,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): boolean {
  for (let row = 0; row < STRADDLE_GRID_SIZE; row += 1) {
    if (!solvedLines.rows[row]) continue;
    const previousCategory = getSolvedLineCategory(
      previousBoard,
      "row",
      row,
      puzzle,
    );
    const nextCategory = getSolvedLineCategory(nextBoard, "row", row, puzzle);
    if (!previousCategory || previousCategory.id !== nextCategory?.id)
      return false;
  }

  for (let column = 0; column < STRADDLE_GRID_SIZE; column += 1) {
    if (!solvedLines.columns[column]) continue;
    const previousCategory = getSolvedLineCategory(
      previousBoard,
      "column",
      column,
      puzzle,
    );
    const nextCategory = getSolvedLineCategory(
      nextBoard,
      "column",
      column,
      puzzle,
    );
    if (!previousCategory || previousCategory.id !== nextCategory?.id)
      return false;
  }

  return true;
}

export function canSwapStraddleTiles(
  board: StraddleBoard,
  fromIndex: number,
  toIndex: number,
  solvedLines: StraddleSolvedLines,
  puzzle: StraddlePuzzleDefinition = STRADDLE_DEMO_PUZZLE,
): boolean {
  if (fromIndex === toIndex) return false;
  if (
    fromIndex === puzzle.fixedCell.index ||
    toIndex === puzzle.fixedCell.index
  )
    return false;
  if (
    isTilePinned(solvedLines, fromIndex) ||
    isTilePinned(solvedLines, toIndex)
  )
    return false;
  return preservesSolvedLines(
    board,
    swapBoardTiles(board, fromIndex, toIndex),
    solvedLines,
    puzzle,
  );
}
