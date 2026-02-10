export type BridgesDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface BridgesIsland {
  id: number;
  row: number;
  col: number;
  requiredBridges: number;
}

export interface BridgesBridge {
  island1: number;
  island2: number;
  count: 1 | 2;
}

export interface BridgesPuzzle {
  id: string;
  difficulty: BridgesDifficulty;
  gridSize: number;
  islands: BridgesIsland[];
  solution: BridgesBridge[];
}

interface BridgesSeedPuzzle {
  id: string;
  difficulty: BridgesDifficulty;
  gridSize: number;
  islands: Array<Omit<BridgesIsland, 'requiredBridges'>>;
  solution: BridgesBridge[];
}

const BASE_PUZZLES: BridgesSeedPuzzle[] = [
  {
    id: 'bridges-easy-001',
    difficulty: 'Easy',
    gridSize: 7,
    islands: [
      { id: 0, row: 1, col: 1 },
      { id: 1, row: 1, col: 5 },
      { id: 2, row: 3, col: 1 },
      { id: 3, row: 3, col: 3 },
      { id: 4, row: 3, col: 5 },
      { id: 5, row: 5, col: 1 },
      { id: 6, row: 5, col: 5 },
    ],
    solution: [
      { island1: 0, island2: 1, count: 2 },
      { island1: 0, island2: 2, count: 1 },
      { island1: 2, island2: 3, count: 1 },
      { island1: 3, island2: 4, count: 2 },
      { island1: 1, island2: 4, count: 1 },
      { island1: 2, island2: 5, count: 2 },
      { island1: 5, island2: 6, count: 1 },
      { island1: 4, island2: 6, count: 1 },
    ],
  },
  {
    id: 'bridges-medium-001',
    difficulty: 'Medium',
    gridSize: 9,
    islands: [
      { id: 0, row: 1, col: 1 },
      { id: 1, row: 1, col: 4 },
      { id: 2, row: 1, col: 7 },
      { id: 3, row: 3, col: 1 },
      { id: 4, row: 3, col: 4 },
      { id: 5, row: 3, col: 7 },
      { id: 6, row: 5, col: 1 },
      { id: 7, row: 5, col: 4 },
      { id: 8, row: 5, col: 7 },
      { id: 9, row: 7, col: 1 },
      { id: 10, row: 7, col: 4 },
      { id: 11, row: 7, col: 7 },
    ],
    solution: [
      { island1: 0, island2: 1, count: 2 },
      { island1: 1, island2: 2, count: 1 },
      { island1: 3, island2: 4, count: 1 },
      { island1: 4, island2: 5, count: 2 },
      { island1: 6, island2: 7, count: 2 },
      { island1: 7, island2: 8, count: 1 },
      { island1: 9, island2: 10, count: 1 },
      { island1: 10, island2: 11, count: 2 },
      { island1: 0, island2: 3, count: 1 },
      { island1: 3, island2: 6, count: 2 },
      { island1: 6, island2: 9, count: 1 },
      { island1: 1, island2: 4, count: 1 },
      { island1: 4, island2: 7, count: 2 },
      { island1: 7, island2: 10, count: 1 },
      { island1: 2, island2: 5, count: 2 },
      { island1: 5, island2: 8, count: 1 },
      { island1: 8, island2: 11, count: 2 },
    ],
  },
  {
    id: 'bridges-hard-001',
    difficulty: 'Hard',
    gridSize: 13,
    islands: [
      { id: 0, row: 1, col: 1 },
      { id: 1, row: 1, col: 4 },
      { id: 2, row: 1, col: 7 },
      { id: 3, row: 1, col: 10 },
      { id: 4, row: 4, col: 1 },
      { id: 5, row: 4, col: 4 },
      { id: 6, row: 4, col: 7 },
      { id: 7, row: 4, col: 10 },
      { id: 8, row: 7, col: 1 },
      { id: 9, row: 7, col: 4 },
      { id: 10, row: 7, col: 7 },
      { id: 11, row: 7, col: 10 },
      { id: 12, row: 10, col: 1 },
      { id: 13, row: 10, col: 4 },
      { id: 14, row: 10, col: 7 },
      { id: 15, row: 10, col: 10 },
    ],
    solution: [
      { island1: 0, island2: 1, count: 2 },
      { island1: 1, island2: 2, count: 1 },
      { island1: 2, island2: 3, count: 2 },
      { island1: 4, island2: 5, count: 1 },
      { island1: 5, island2: 6, count: 2 },
      { island1: 6, island2: 7, count: 1 },
      { island1: 8, island2: 9, count: 2 },
      { island1: 9, island2: 10, count: 1 },
      { island1: 10, island2: 11, count: 2 },
      { island1: 12, island2: 13, count: 1 },
      { island1: 13, island2: 14, count: 2 },
      { island1: 14, island2: 15, count: 1 },
      { island1: 0, island2: 4, count: 1 },
      { island1: 4, island2: 8, count: 2 },
      { island1: 8, island2: 12, count: 1 },
      { island1: 1, island2: 5, count: 2 },
      { island1: 5, island2: 9, count: 1 },
      { island1: 9, island2: 13, count: 2 },
      { island1: 2, island2: 6, count: 1 },
      { island1: 6, island2: 10, count: 2 },
      { island1: 10, island2: 14, count: 1 },
      { island1: 3, island2: 7, count: 2 },
      { island1: 7, island2: 11, count: 1 },
      { island1: 11, island2: 15, count: 2 },
    ],
  },
];

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function applyRequirements(puzzle: BridgesSeedPuzzle): BridgesPuzzle {
  const counts: Record<number, number> = {};
  puzzle.islands.forEach((island) => {
    counts[island.id] = 0;
  });
  puzzle.solution.forEach((bridge) => {
    counts[bridge.island1] += bridge.count;
    counts[bridge.island2] += bridge.count;
  });

  return {
    ...puzzle,
    islands: puzzle.islands.map((island) => ({
      ...island,
      requiredBridges: counts[island.id] ?? 0,
    })),
  };
}

export const bridgesPuzzles: BridgesPuzzle[] = BASE_PUZZLES.map(applyRequirements);

export function getDailyBridges(date: Date = new Date()): BridgesPuzzle {
  const seed = getDailySeed(date);
  const index = seed % bridgesPuzzles.length;
  return bridgesPuzzles[index];
}
