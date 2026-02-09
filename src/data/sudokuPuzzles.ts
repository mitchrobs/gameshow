export type SudokuDifficulty = 'Medium' | 'Hard';

export interface SudokuPuzzle {
  id: string;
  difficulty: SudokuDifficulty;
  grid: number[][];
  solution: number[][];
}

const SIZE = 6;
const BOX_ROWS = 2;
const BOX_COLS = 3;

const BASE_GRID: number[][] = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 4, 5],
];

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
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildOrder(unitSize: number, unitCount: number, rand: () => number): number[] {
  const groups = shuffle(
    Array.from({ length: unitCount }, (_, i) => i),
    rand
  );
  const order: number[] = [];
  groups.forEach((group) => {
    const inner = shuffle(
      Array.from({ length: unitSize }, (_, i) => i),
      rand
    );
    inner.forEach((offset) => order.push(group * unitSize + offset));
  });
  return order;
}

function generateSolution(rand: () => number): number[][] {
  const rowOrder = buildOrder(BOX_ROWS, SIZE / BOX_ROWS, rand);
  const colOrder = buildOrder(BOX_COLS, SIZE / BOX_COLS, rand);
  const numberMap = shuffle([1, 2, 3, 4, 5, 6], rand);

  return rowOrder.map((rowIndex) =>
    colOrder.map((colIndex) => {
      const value = BASE_GRID[rowIndex][colIndex];
      return numberMap[value - 1];
    })
  );
}

function carvePuzzle(
  solution: number[][],
  rand: () => number,
  difficulty: SudokuDifficulty
): number[][] {
  const puzzle = solution.map((row) => [...row]);
  const rowCount = Array(SIZE).fill(SIZE);
  const colCount = Array(SIZE).fill(SIZE);
  const boxCount = Array((SIZE / BOX_ROWS) * (SIZE / BOX_COLS)).fill(SIZE);

  const baseTarget = difficulty === 'Hard' ? 14 : 18;
  const target = baseTarget + (rand() > 0.6 ? 1 : 0);
  const positions = shuffle(
    Array.from({ length: SIZE * SIZE }, (_, i) => i),
    rand
  );
  let givens = SIZE * SIZE;

  for (const pos of positions) {
    if (givens <= target) break;
    const row = Math.floor(pos / SIZE);
    const col = pos % SIZE;
    const box = Math.floor(row / BOX_ROWS) * (SIZE / BOX_COLS) + Math.floor(col / BOX_COLS);
    if (puzzle[row][col] === 0) continue;
    if (rowCount[row] <= 1 || colCount[col] <= 1 || boxCount[box] <= 1) continue;
    puzzle[row][col] = 0;
    rowCount[row] -= 1;
    colCount[col] -= 1;
    boxCount[box] -= 1;
    givens -= 1;
  }

  return puzzle;
}

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getDailySudoku(date: Date = new Date()): SudokuPuzzle {
  const seed = getDailySeed(date);
  const rand = mulberry32(seed + 93457);
  const difficulty: SudokuDifficulty = rand() > 0.55 ? 'Hard' : 'Medium';
  const solution = generateSolution(rand);
  const grid = carvePuzzle(solution, rand, difficulty);

  return {
    id: `sudoku-${seed}`,
    difficulty,
    grid,
    solution,
  };
}
