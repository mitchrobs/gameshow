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
  rowCount: number;
  colCount: number;
  shape: string;
  islands: BridgesIsland[];
  solution: BridgesBridge[];
}

type SeedIsland = Omit<BridgesIsland, 'requiredBridges'>;
type CandidateBridge = Omit<BridgesBridge, 'count'>;

interface BridgesSeedPuzzle {
  id: string;
  difficulty: BridgesDifficulty;
  gridSize: number;
  rowCount?: number;
  colCount?: number;
  shape?: string;
  islands: SeedIsland[];
  solution: BridgesBridge[];
}

interface BridgesArchetype {
  slug: string;
  difficulty: BridgesDifficulty;
  rowCount: number;
  colCount: number;
  extraEdges: [number, number];
  doubleRate: number;
  allowTranspose?: boolean;
  positions: Array<Omit<SeedIsland, 'id'>>;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const BASE_PUZZLES: BridgesSeedPuzzle[] = [
  {
    id: 'bridges-easy-001',
    difficulty: 'Easy',
    gridSize: 7,
    shape: 'classic',
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
    shape: 'classic',
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
    shape: 'classic',
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
      { id: 15, col: 10 },
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

const BRIDGES_ARCHETYPES: Record<BridgesDifficulty, BridgesArchetype[]> = {
  Easy: [
    {
      slug: 'stepping-stones',
      difficulty: 'Easy',
      rowCount: 7,
      colCount: 7,
      extraEdges: [1, 2],
      doubleRate: 0.36,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 2, col: 6 },
        { row: 3, col: 1 },
        { row: 3, col: 4 },
        { row: 5, col: 1 },
        { row: 5, col: 4 },
        { row: 5, col: 6 },
      ],
    },
    {
      slug: 'small-lagoon',
      difficulty: 'Easy',
      rowCount: 7,
      colCount: 9,
      extraEdges: [1, 2],
      doubleRate: 0.32,
      allowTranspose: true,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 1, col: 7 },
        { row: 3, col: 1 },
        { row: 3, col: 5 },
        { row: 3, col: 7 },
        { row: 5, col: 2 },
        { row: 5, col: 5 },
        { row: 5, col: 7 },
      ],
    },
  ],
  Medium: [
    {
      slug: 'river-channel',
      difficulty: 'Medium',
      rowCount: 11,
      colCount: 7,
      extraEdges: [3, 5],
      doubleRate: 0.46,
      allowTranspose: true,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 2, col: 6 },
        { row: 3, col: 1 },
        { row: 3, col: 4 },
        { row: 5, col: 2 },
        { row: 5, col: 4 },
        { row: 5, col: 6 },
        { row: 7, col: 1 },
        { row: 7, col: 4 },
        { row: 9, col: 2 },
        { row: 9, col: 4 },
        { row: 9, col: 6 },
      ],
    },
    {
      slug: 'twin-coves',
      difficulty: 'Medium',
      rowCount: 9,
      colCount: 11,
      extraEdges: [4, 6],
      doubleRate: 0.44,
      allowTranspose: true,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 1, col: 8 },
        { row: 2, col: 10 },
        { row: 3, col: 1 },
        { row: 3, col: 4 },
        { row: 4, col: 6 },
        { row: 5, col: 2 },
        { row: 5, col: 6 },
        { row: 5, col: 10 },
        { row: 7, col: 2 },
        { row: 7, col: 6 },
        { row: 7, col: 9 },
      ],
    },
  ],
  Hard: [
    {
      slug: 'bottleneck',
      difficulty: 'Hard',
      rowCount: 13,
      colCount: 9,
      extraEdges: [6, 8],
      doubleRate: 0.54,
      allowTranspose: true,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 1, col: 7 },
        { row: 3, col: 1 },
        { row: 3, col: 4 },
        { row: 3, col: 7 },
        { row: 5, col: 2 },
        { row: 5, col: 4 },
        { row: 5, col: 6 },
        { row: 7, col: 4 },
        { row: 9, col: 2 },
        { row: 9, col: 4 },
        { row: 9, col: 6 },
        { row: 11, col: 1 },
        { row: 11, col: 4 },
        { row: 11, col: 7 },
      ],
    },
    {
      slug: 'wide-bay',
      difficulty: 'Hard',
      rowCount: 9,
      colCount: 13,
      extraEdges: [6, 9],
      doubleRate: 0.52,
      allowTranspose: true,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 1, col: 8 },
        { row: 1, col: 11 },
        { row: 3, col: 1 },
        { row: 3, col: 5 },
        { row: 3, col: 8 },
        { row: 3, col: 11 },
        { row: 5, col: 2 },
        { row: 5, col: 5 },
        { row: 5, col: 9 },
        { row: 7, col: 1 },
        { row: 7, col: 4 },
        { row: 7, col: 8 },
        { row: 7, col: 11 },
      ],
    },
    {
      slug: 'atoll',
      difficulty: 'Hard',
      rowCount: 11,
      colCount: 11,
      extraEdges: [7, 9],
      doubleRate: 0.5,
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 4 },
        { row: 1, col: 7 },
        { row: 1, col: 9 },
        { row: 3, col: 1 },
        { row: 3, col: 5 },
        { row: 3, col: 9 },
        { row: 5, col: 1 },
        { row: 5, col: 3 },
        { row: 5, col: 7 },
        { row: 5, col: 9 },
        { row: 7, col: 1 },
        { row: 7, col: 5 },
        { row: 7, col: 9 },
        { row: 9, col: 1 },
        { row: 9, col: 4 },
        { row: 9, col: 7 },
        { row: 9, col: 9 },
      ],
    },
  ],
};

class UnionFind {
  private parent: number[];
  private rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, index) => index);
    this.rank = Array(size).fill(0);
  }

  find(value: number): number {
    const parent = this.parent[value];
    if (parent === value) return value;
    const root = this.find(parent);
    this.parent[value] = root;
    return root;
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const rankA = this.rank[rootA];
    const rankB = this.rank[rootB];
    if (rankA < rankB) {
      this.parent[rootA] = rootB;
    } else if (rankA > rankB) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA] += 1;
    }
    return true;
  }
}

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

function getDailyOrdinal(date: Date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY
  );
}

function bridgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function buildNeighborCandidates(islands: SeedIsland[]): CandidateBridge[] {
  const candidates = new Map<string, CandidateBridge>();
  islands.forEach((island) => {
    const rowNeighbors = islands
      .filter((other) => other.id !== island.id && other.row === island.row)
      .sort((a, b) => Math.abs(a.col - island.col) - Math.abs(b.col - island.col));
    const colNeighbors = islands
      .filter((other) => other.id !== island.id && other.col === island.col)
      .sort((a, b) => Math.abs(a.row - island.row) - Math.abs(b.row - island.row));

    const left = rowNeighbors
      .filter((other) => other.col < island.col)
      .sort((a, b) => b.col - a.col)[0];
    const right = rowNeighbors
      .filter((other) => other.col > island.col)
      .sort((a, b) => a.col - b.col)[0];
    const up = colNeighbors
      .filter((other) => other.row < island.row)
      .sort((a, b) => b.row - a.row)[0];
    const down = colNeighbors
      .filter((other) => other.row > island.row)
      .sort((a, b) => a.row - b.row)[0];

    [left, right, up, down].forEach((neighbor) => {
      if (!neighbor) return;
      const key = bridgeKey(island.id, neighbor.id);
      candidates.set(key, {
        island1: Math.min(island.id, neighbor.id),
        island2: Math.max(island.id, neighbor.id),
      });
    });
  });
  return Array.from(candidates.values());
}

function wouldCandidateCross(
  candidate: CandidateBridge,
  existing: CandidateBridge,
  islandMap: Map<number, SeedIsland>
): boolean {
  const a = islandMap.get(candidate.island1);
  const b = islandMap.get(candidate.island2);
  const c = islandMap.get(existing.island1);
  const d = islandMap.get(existing.island2);
  if (!a || !b || !c || !d) return false;
  const candHorizontal = a.row === b.row;
  const existHorizontal = c.row === d.row;
  if (candHorizontal === existHorizontal) return false;

  const h = candHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const v = candHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return v.col > h.minCol && v.col < h.maxCol && h.row > v.minRow && h.row < v.maxRow;
}

function crossesAny(
  candidate: CandidateBridge,
  selected: CandidateBridge[],
  islandMap: Map<number, SeedIsland>
): boolean {
  return selected.some((existing) => wouldCandidateCross(candidate, existing, islandMap));
}

function transformPositions(
  archetype: BridgesArchetype,
  rand: () => number
): { rowCount: number; colCount: number; islands: SeedIsland[]; shape: string } {
  let rowCount = archetype.rowCount;
  let colCount = archetype.colCount;
  let positions = archetype.positions.map((position) => ({ ...position }));
  let shape = archetype.slug;

  if (archetype.allowTranspose && rand() < 0.35) {
    positions = positions.map((position) => ({ row: position.col, col: position.row }));
    [rowCount, colCount] = [colCount, rowCount];
    shape = `${shape}-turned`;
  }
  if (rand() < 0.5) {
    positions = positions.map((position) => ({
      ...position,
      col: colCount - 1 - position.col,
    }));
  }
  if (rand() < 0.5) {
    positions = positions.map((position) => ({
      ...position,
      row: rowCount - 1 - position.row,
    }));
  }

  const islands = positions
    .sort((a, b) => a.row - b.row || a.col - b.col)
    .map((position, id) => ({ id, ...position }));

  return { rowCount, colCount, islands, shape };
}

function buildSolution(
  islands: SeedIsland[],
  archetype: BridgesArchetype,
  rand: () => number
): BridgesBridge[] | null {
  const islandMap = new Map(islands.map((island) => [island.id, island]));
  const candidates = buildNeighborCandidates(islands);
  const unionFind = new UnionFind(islands.length);
  const selected: CandidateBridge[] = [];

  shuffle(candidates, rand).forEach((candidate) => {
    if (selected.length >= islands.length - 1) return;
    if (unionFind.find(candidate.island1) === unionFind.find(candidate.island2)) return;
    if (crossesAny(candidate, selected, islandMap)) return;
    if (unionFind.union(candidate.island1, candidate.island2)) {
      selected.push(candidate);
    }
  });

  if (selected.length !== islands.length - 1) return null;

  const extraCount =
    archetype.extraEdges[0] +
    Math.floor(rand() * (archetype.extraEdges[1] - archetype.extraEdges[0] + 1));
  const selectedKeys = new Set(selected.map((bridge) => bridgeKey(bridge.island1, bridge.island2)));
  const extras = shuffle(candidates, rand);
  for (const candidate of extras) {
    if (selected.length >= islands.length - 1 + extraCount) break;
    const key = bridgeKey(candidate.island1, candidate.island2);
    if (selectedKeys.has(key)) continue;
    if (crossesAny(candidate, selected, islandMap)) continue;
    selectedKeys.add(key);
    selected.push(candidate);
  }

  return selected.map((bridge) => ({
    ...bridge,
    count: rand() < archetype.doubleRate ? 2 : 1,
  }));
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

  const rowCount = puzzle.rowCount ?? puzzle.gridSize;
  const colCount = puzzle.colCount ?? puzzle.gridSize;
  return {
    ...puzzle,
    rowCount,
    colCount,
    gridSize: Math.max(rowCount, colCount),
    shape: puzzle.shape ?? 'classic',
    islands: puzzle.islands.map((island) => ({
      ...island,
      requiredBridges: counts[island.id] ?? 0,
    })),
  };
}

function scorePuzzle(puzzle: BridgesPuzzle): number {
  const doubleCount = puzzle.solution.filter((bridge) => bridge.count === 2).length;
  const highRequirementCount = puzzle.islands.filter((island) => island.requiredBridges >= 5).length;
  const shapeBonus = puzzle.rowCount !== puzzle.colCount ? 8 : 0;
  const sizeScore = puzzle.islands.length * 2 + puzzle.solution.length;
  return sizeScore + doubleCount * 2 + highRequirementCount * 3 + shapeBonus;
}

function generatePuzzle(
  dayIndex: number,
  difficulty: BridgesDifficulty,
  rand: () => number
): BridgesPuzzle | null {
  const archetypes = BRIDGES_ARCHETYPES[difficulty];
  let best: BridgesPuzzle | null = null;
  let bestScore = -Infinity;
  const primaryArchetype = archetypes[dayIndex % archetypes.length];
  const fallbackArchetypes = archetypes.filter((archetype) => archetype !== primaryArchetype);

  for (let attempt = 0; attempt < 36; attempt += 1) {
    const archetype = primaryArchetype ?? archetypes[attempt % archetypes.length];
    if (!archetype) continue;
    const transformed = transformPositions(archetype, rand);
    const solution = buildSolution(transformed.islands, archetype, rand);
    if (!solution) continue;

    const puzzle = applyRequirements({
      id: `bridges-${difficulty.toLowerCase()}-${transformed.shape}-${dayIndex}`,
      difficulty,
      gridSize: Math.max(transformed.rowCount, transformed.colCount),
      rowCount: transformed.rowCount,
      colCount: transformed.colCount,
      shape: transformed.shape,
      islands: transformed.islands,
      solution,
    });
    if (puzzle.islands.some((island) => island.requiredBridges <= 0 || island.requiredBridges > 8)) {
      continue;
    }

    const score = scorePuzzle(puzzle) + rand();
    if (score > bestScore) {
      best = puzzle;
      bestScore = score;
    }
  }

  if (best) return best;

  for (const archetype of fallbackArchetypes) {
    const transformed = transformPositions(archetype, rand);
    const solution = buildSolution(transformed.islands, archetype, rand);
    if (!solution) continue;
    return applyRequirements({
      id: `bridges-${difficulty.toLowerCase()}-${transformed.shape}-${dayIndex}`,
      difficulty,
      gridSize: Math.max(transformed.rowCount, transformed.colCount),
      rowCount: transformed.rowCount,
      colCount: transformed.colCount,
      shape: transformed.shape,
      islands: transformed.islands,
      solution,
    });
  }

  return null;
}

export const bridgesPuzzles: BridgesPuzzle[] = BASE_PUZZLES.map(applyRequirements);
const bridgesPuzzlesByDifficulty: Record<BridgesDifficulty, BridgesPuzzle[]> = {
  Easy: bridgesPuzzles.filter((puzzle) => puzzle.difficulty === 'Easy'),
  Medium: bridgesPuzzles.filter((puzzle) => puzzle.difficulty === 'Medium'),
  Hard: bridgesPuzzles.filter((puzzle) => puzzle.difficulty === 'Hard'),
};

// Easy + Medium averaged 1.5; Easy + Medium + Hard + Hard averages 2.25.
const DAILY_DIFFICULTY_ROTATION: BridgesDifficulty[] = ['Easy', 'Medium', 'Hard', 'Hard'];

export function getDailyBridges(date: Date = new Date()): BridgesPuzzle {
  const dayIndex = getDailyOrdinal(date);
  const rotationIndex = dayIndex % DAILY_DIFFICULTY_ROTATION.length;
  const difficulty = DAILY_DIFFICULTY_ROTATION[rotationIndex] ?? 'Hard';
  const rand = mulberry32(dayIndex * 131 + rotationIndex * 977 + 47281);
  const generated = generatePuzzle(dayIndex, difficulty, rand);
  if (generated) return generated;

  const preferredPool = bridgesPuzzlesByDifficulty[difficulty];
  const pool = preferredPool.length > 0 ? preferredPool : bridgesPuzzles;
  const index = Math.floor(dayIndex / DAILY_DIFFICULTY_ROTATION.length) % pool.length;
  return pool[index];
}
