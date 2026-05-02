export const SUBSET_GRID_SIZE = 3;

export type SubsetAxis = "row" | "column";
export type SubsetOrientation = "canonical" | "transposed";

export type SubsetTileId = string;

export interface SubsetTile {
  id: SubsetTileId;
  word: string;
}

export interface SubsetCategory {
  id: string;
  axis: SubsetAxis;
  index: number;
  label: string;
  tileIds: SubsetTileId[];
}

export interface SubsetSolvedLines {
  rows: boolean[];
  columns: boolean[];
}

export type SubsetBoard = SubsetTileId[];

export interface SubsetLineMatch {
  category: SubsetCategory;
  orientation: SubsetOrientation;
}

export interface SubsetFixedCell {
  index: number;
  tileId: SubsetTileId;
}

export interface SubsetShareTextOptions {
  dateLabel: string;
  solvedLines: SubsetSolvedLines;
  wrongGuesses: number;
  maxWrongGuesses?: number;
  won: boolean;
  url?: string;
}

export interface SubsetPuzzleDefinition {
  id: string;
  date?: string;
  title?: string;
  tiles: SubsetTile[];
  solutionGrid: SubsetTileId[][];
  solutionBoard: SubsetBoard;
  fallbackUnsolvedBoard: SubsetBoard;
  fixedCell: SubsetFixedCell;
  rowCategories: SubsetCategory[];
  columnCategories: SubsetCategory[];
  categories: SubsetCategory[];
}

export const SUBSET_MAX_INCORRECT_GUESSES = 4;
export const SUBSET_SHARE_URL = "https://mitchrobs.github.io/gameshow/subset";

export const SUBSET_TILES: SubsetTile[] = [
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

export const SUBSET_TILE_IDS = SUBSET_TILES.map((tile) => tile.id);

export const SUBSET_SOLUTION_GRID: SubsetTileId[][] = [
  ["mouse", "cookie", "boot"],
  ["bass", "jam", "band"],
  ["bat", "batter", "cap"],
];

export const SUBSET_SOLUTION_BOARD: SubsetBoard =
  SUBSET_SOLUTION_GRID.flat();

export const SUBSET_FALLBACK_UNSOLVED_BOARD: SubsetBoard = [
  "mouse",
  "cookie",
  "bass",
  "boot",
  "jam",
  "bat",
  "band",
  "cap",
  "batter",
];

export const SUBSET_FIXED_CELL: SubsetFixedCell = {
  index: 4,
  tileId: "jam",
};

export const SUBSET_ROW_CATEGORIES: SubsetCategory[] = [
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

export const SUBSET_COLUMN_CATEGORIES: SubsetCategory[] = [
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

export const SUBSET_CATEGORIES = [
  ...SUBSET_ROW_CATEGORIES,
  ...SUBSET_COLUMN_CATEGORIES,
];

export const SUBSET_DEMO_PUZZLE: SubsetPuzzleDefinition = {
  id: "demo",
  title: "Daily demo",
  tiles: SUBSET_TILES,
  solutionGrid: SUBSET_SOLUTION_GRID,
  solutionBoard: SUBSET_SOLUTION_BOARD,
  fallbackUnsolvedBoard: SUBSET_FALLBACK_UNSOLVED_BOARD,
  fixedCell: SUBSET_FIXED_CELL,
  rowCategories: SUBSET_ROW_CATEGORIES,
  columnCategories: SUBSET_COLUMN_CATEGORIES,
  categories: SUBSET_CATEGORIES,
};

function sameMembers(left: SubsetTileId[], right: SubsetTileId[]): boolean {
  if (left.length !== right.length) return false;
  const rightSet = new Set(right);
  return left.every((id) => rightSet.has(id));
}

function sameOrder(left: SubsetTileId[], right: SubsetTileId[]): boolean {
  return (
    left.length === right.length &&
    left.every((tileId, index) => tileId === right[index])
  );
}

function oppositeAxis(axis: SubsetAxis): SubsetAxis {
  return axis === "row" ? "column" : "row";
}

function getPuzzleTileIds(puzzle: SubsetPuzzleDefinition): SubsetTileId[] {
  return puzzle.tiles.map((tile) => tile.id);
}

function clampShareCount(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

function formatSolvedLineMarks(lines: boolean[]): string {
  return lines.map((solved) => (solved ? "🟦" : "⬜️")).join("");
}

export function formatSubsetShareText({
  dateLabel,
  solvedLines,
  wrongGuesses,
  maxWrongGuesses = SUBSET_MAX_INCORRECT_GUESSES,
  won,
  url = SUBSET_SHARE_URL,
}: SubsetShareTextOptions): string {
  const safeWrongGuesses = clampShareCount(wrongGuesses, maxWrongGuesses);
  return [
    `Subset ${dateLabel}`,
    `${won ? "Solved" : "Stumped"} | ${safeWrongGuesses}/${maxWrongGuesses} misses`,
    `Rows ${formatSolvedLineMarks(solvedLines.rows)} | Cols ${formatSolvedLineMarks(
      solvedLines.columns,
    )}`,
    url,
  ].join("\n");
}

export function getSubsetTile(
  id: SubsetTileId,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetTile {
  const tile = puzzle.tiles.find((candidate) => candidate.id === id);
  if (!tile) {
    throw new Error(`Unknown Subset tile: ${id}`);
  }
  return tile;
}

export function createEmptySubsetSolvedLines(): SubsetSolvedLines {
  return {
    rows: Array(SUBSET_GRID_SIZE).fill(false),
    columns: Array(SUBSET_GRID_SIZE).fill(false),
  };
}

export function boardIndex(row: number, column: number): number {
  return row * SUBSET_GRID_SIZE + column;
}

export function getCellFromIndex(index: number): {
  row: number;
  column: number;
} {
  return {
    row: Math.floor(index / SUBSET_GRID_SIZE),
    column: index % SUBSET_GRID_SIZE,
  };
}

export function getLineTileIds(
  board: SubsetBoard,
  axis: SubsetAxis,
  index: number,
): SubsetTileId[] {
  if (axis === "row") {
    return Array.from(
      { length: SUBSET_GRID_SIZE },
      (_, column) => board[boardIndex(index, column)],
    );
  }

  return Array.from(
    { length: SUBSET_GRID_SIZE },
    (_, row) => board[boardIndex(row, index)],
  );
}

export function getMatchingCategory(
  axis: SubsetAxis,
  tileIds: SubsetTileId[],
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetCategory | null {
  const categories =
    axis === "row" ? puzzle.rowCategories : puzzle.columnCategories;
  return (
    categories.find((category) => sameMembers(tileIds, category.tileIds)) ??
    null
  );
}

export function getMatchingCategoryForOrientation(
  axis: SubsetAxis,
  tileIds: SubsetTileId[],
  orientation: SubsetOrientation,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetCategory | null {
  const nativeAxis = orientation === "canonical" ? axis : oppositeAxis(axis);
  return getMatchingCategory(nativeAxis, tileIds, puzzle);
}

export function getOrientedSolvedLineCategory(
  board: SubsetBoard,
  axis: SubsetAxis,
  index: number,
  orientation: SubsetOrientation,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetCategory | null {
  return getMatchingCategoryForOrientation(
    axis,
    getLineTileIds(board, axis, index),
    orientation,
    puzzle,
  );
}

export function getOrientedSolutionLineTileIds(
  axis: SubsetAxis,
  index: number,
  orientation: SubsetOrientation,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetTileId[] {
  if (axis === "row") {
    return Array.from({ length: SUBSET_GRID_SIZE }, (_, column) => {
      const row = orientation === "canonical" ? index : column;
      const orientedColumn = orientation === "canonical" ? column : index;
      return puzzle.solutionBoard[boardIndex(row, orientedColumn)];
    });
  }

  return Array.from({ length: SUBSET_GRID_SIZE }, (_, row) => {
    const orientedRow = orientation === "canonical" ? row : index;
    const column = orientation === "canonical" ? index : row;
    return puzzle.solutionBoard[boardIndex(orientedRow, column)];
  });
}

export function getSubsetLineMatch(
  board: SubsetBoard,
  axis: SubsetAxis,
  index: number,
  orientation: SubsetOrientation | null,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetLineMatch | null {
  const tileIds = getLineTileIds(board, axis, index);
  const orientations: SubsetOrientation[] = orientation
    ? [orientation]
    : ["canonical", "transposed"];

  for (const candidateOrientation of orientations) {
    if (
      !sameOrder(
        tileIds,
        getOrientedSolutionLineTileIds(
          axis,
          index,
          candidateOrientation,
          puzzle,
        ),
      )
    ) {
      continue;
    }

    const category = getMatchingCategoryForOrientation(
      axis,
      tileIds,
      candidateOrientation,
      puzzle,
    );
    if (category) {
      return { category, orientation: candidateOrientation };
    }
  }

  return null;
}

export function getSubsetMisplacedLineMatch(
  board: SubsetBoard,
  axis: SubsetAxis,
  index: number,
  orientation: SubsetOrientation | null,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetLineMatch | null {
  const tileIds = getLineTileIds(board, axis, index);
  const orientations: SubsetOrientation[] = orientation
    ? [orientation]
    : ["canonical", "transposed"];

  for (const candidateOrientation of orientations) {
    const category = getMatchingCategoryForOrientation(
      axis,
      tileIds,
      candidateOrientation,
      puzzle,
    );
    if (!category) continue;

    if (
      !sameOrder(
        tileIds,
        getOrientedSolutionLineTileIds(
          axis,
          index,
          candidateOrientation,
          puzzle,
        ),
      )
    ) {
      return { category, orientation: candidateOrientation };
    }
  }

  return null;
}

export function getSolvedLineCategory(
  board: SubsetBoard,
  axis: SubsetAxis,
  index: number,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetCategory | null {
  return getMatchingCategory(axis, getLineTileIds(board, axis, index), puzzle);
}

export function isLineSolved(
  solvedLines: SubsetSolvedLines,
  axis: SubsetAxis,
  index: number,
): boolean {
  return axis === "row" ? solvedLines.rows[index] : solvedLines.columns[index];
}

export function markLineSolved(
  solvedLines: SubsetSolvedLines,
  axis: SubsetAxis,
  index: number,
): SubsetSolvedLines {
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

export function isBoardComplete(solvedLines: SubsetSolvedLines): boolean {
  return solvedLines.rows.every(Boolean) && solvedLines.columns.every(Boolean);
}

export function hasAnySolvedLine(
  board: SubsetBoard,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
  orientation: SubsetOrientation | null = null,
): boolean {
  for (let index = 0; index < SUBSET_GRID_SIZE; index += 1) {
    if (getSubsetLineMatch(board, "row", index, orientation, puzzle))
      return true;
    if (getSubsetLineMatch(board, "column", index, orientation, puzzle))
      return true;
  }
  return false;
}

export function shuffleSubsetTiles(
  tileIds: SubsetTileId[] = SUBSET_TILE_IDS,
  random: () => number = Math.random,
): SubsetBoard {
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

export function createRandomUnsolvedSubsetBoard(
  random: () => number = Math.random,
  maxTries = 200,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
): SubsetBoard {
  const tileIds = getPuzzleTileIds(puzzle);
  for (let attempt = 0; attempt < maxTries; attempt += 1) {
    const board = shuffleSubsetTiles(tileIds, random);
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
  board: SubsetBoard,
  fromIndex: number,
  toIndex: number,
): SubsetBoard {
  if (fromIndex === toIndex) return [...board];
  const next = [...board];
  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
  return next;
}

export function isTilePinned(
  solvedLines: SubsetSolvedLines,
  index: number,
): boolean {
  const { row, column } = getCellFromIndex(index);
  return solvedLines.rows[row] && solvedLines.columns[column];
}

export function isTileInSolvedLine(
  solvedLines: SubsetSolvedLines,
  index: number,
): boolean {
  const { row, column } = getCellFromIndex(index);
  return solvedLines.rows[row] || solvedLines.columns[column];
}

export function preservesSolvedLines(
  previousBoard: SubsetBoard,
  nextBoard: SubsetBoard,
  solvedLines: SubsetSolvedLines,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
  orientation: SubsetOrientation = "canonical",
): boolean {
  for (let row = 0; row < SUBSET_GRID_SIZE; row += 1) {
    if (!solvedLines.rows[row]) continue;
    const previousMatch = getSubsetLineMatch(
      previousBoard,
      "row",
      row,
      orientation,
      puzzle,
    );
    const nextMatch = getSubsetLineMatch(
      nextBoard,
      "row",
      row,
      orientation,
      puzzle,
    );
    if (!previousMatch || previousMatch.category.id !== nextMatch?.category.id)
      return false;
  }

  for (let column = 0; column < SUBSET_GRID_SIZE; column += 1) {
    if (!solvedLines.columns[column]) continue;
    const previousMatch = getSubsetLineMatch(
      previousBoard,
      "column",
      column,
      orientation,
      puzzle,
    );
    const nextMatch = getSubsetLineMatch(
      nextBoard,
      "column",
      column,
      orientation,
      puzzle,
    );
    if (!previousMatch || previousMatch.category.id !== nextMatch?.category.id)
      return false;
  }

  return true;
}

export function canSwapSubsetTiles(
  board: SubsetBoard,
  fromIndex: number,
  toIndex: number,
  solvedLines: SubsetSolvedLines,
  puzzle: SubsetPuzzleDefinition = SUBSET_DEMO_PUZZLE,
  orientation: SubsetOrientation = "canonical",
): boolean {
  if (fromIndex === toIndex) return false;
  if (
    fromIndex === puzzle.fixedCell.index ||
    toIndex === puzzle.fixedCell.index
  )
    return false;
  if (
    isTileInSolvedLine(solvedLines, fromIndex) ||
    isTileInSolvedLine(solvedLines, toIndex)
  )
    return false;
  return preservesSolvedLines(
    board,
    swapBoardTiles(board, fromIndex, toIndex),
    solvedLines,
    puzzle,
    orientation,
  );
}
