import {
  BRIDGES_DIFFICULTY_TOTALS,
  BRIDGES_ONBOARDING_DAYS,
  BRIDGES_ONBOARDING_DIFFICULTY_TOTALS,
  BRIDGES_PACK_LENGTH,
  BRIDGES_PACK_START_DATE,
  BRIDGES_SHAPE_FAMILIES,
  BRIDGES_THEME_FAMILY_TARGETS,
  BRIDGES_THEME_IDS,
  BRIDGES_THEME_ORDER,
  type BridgesDifficulty,
  type BridgesShapeFamily,
  type BridgesThemeId,
} from './bridgesMetadata';

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
  shapeFamily: BridgesShapeFamily;
  archetypeSlug: string;
  islands: BridgesIsland[];
  solution: BridgesBridge[];
}

export interface BridgesPackEntry {
  date: string;
  difficulty: BridgesDifficulty;
  themeId: BridgesThemeId;
  shapeFamily: BridgesShapeFamily;
  archetypeSlug: string;
  difficultyScore: number;
  signature: string;
  puzzle: BridgesPuzzle;
}

interface SeedIsland {
  id: number;
  row: number;
  col: number;
}

type SeedPuzzle = Omit<BridgesPuzzle, 'gridSize' | 'islands'> & {
  islands: SeedIsland[];
};

interface BridgesArchetype {
  slug: string;
  difficulty: BridgesDifficulty;
  family: BridgesShapeFamily;
  rowCount: number;
  colCount: number;
  extraEdges: [number, number];
  doubleRate: number;
  allowTranspose?: boolean;
  positions: Array<Omit<SeedIsland, 'id'>>;
}

interface CandidateBridge {
  island1: number;
  island2: number;
}

interface SolverEdge extends CandidateBridge {
  crossings: number[];
}

interface SolverContext {
  islands: BridgesIsland[];
  edges: SolverEdge[];
  incidentEdges: number[][];
}

type HumanRuleName =
  | 'saturation'
  | 'minimum-required'
  | 'exhausted-neighbor'
  | 'crossing-lane'
  | 'stranded-component'
  | 'split-prevention'
  | 'consistency-sweep';

interface HumanSolveAnalysis {
  solved: boolean;
  contradiction: boolean;
  openingProgress: boolean;
  stalledPasses: number;
  passes: number;
  usedAdvancedRule: boolean;
  difficultyScore: number;
  ruleCounts: Record<HumanRuleName, number>;
}

interface ExactSolveResult {
  solutionCount: number;
  solution: BridgesBridge[] | null;
}

interface CandidatePoolEntry {
  archetypeSlug: string;
  difficulty: BridgesDifficulty;
  shapeFamily: BridgesShapeFamily;
  difficultyScore: number;
  signature: string;
  puzzle: BridgesPuzzle;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DOMAIN_ZERO = 1;
const DOMAIN_ONE = 2;
const DOMAIN_TWO = 4;
const DOMAIN_ANY = DOMAIN_ZERO | DOMAIN_ONE | DOMAIN_TWO;
const POSITIVE_DOMAIN = DOMAIN_ONE | DOMAIN_TWO;

const HUMAN_RULE_ORDER: readonly HumanRuleName[] = [
  'saturation',
  'minimum-required',
  'exhausted-neighbor',
  'crossing-lane',
  'stranded-component',
  'split-prevention',
  'consistency-sweep',
];

const HUMAN_RULE_WEIGHTS: Record<HumanRuleName, number> = {
  saturation: 1,
  'minimum-required': 2,
  'exhausted-neighbor': 1,
  'crossing-lane': 2,
  'stranded-component': 4,
  'split-prevention': 5,
  'consistency-sweep': 7,
};

const MAX_REQUIREMENT_BY_DIFFICULTY: Record<BridgesDifficulty, number> = {
  Easy: 5,
  Medium: 7,
  Hard: 8,
};

const STRUCTURAL_FLOORS: Record<
  BridgesDifficulty,
  { islands: number; bridges: number; highRequirements: number }
> = {
  Easy: { islands: 9, bridges: 9, highRequirements: 0 },
  Medium: { islands: 12, bridges: 14, highRequirements: 2 },
  Hard: { islands: 15, bridges: 18, highRequirements: 4 },
};

const BASE_SEED_PUZZLES: SeedPuzzle[] = [
  {
    id: 'bridges-easy-001',
    difficulty: 'Easy' as const,
    rowCount: 7,
    colCount: 7,
    shape: 'classic',
    shapeFamily: 'grid' as const,
    archetypeSlug: 'classic-easy',
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
    difficulty: 'Medium' as const,
    rowCount: 9,
    colCount: 9,
    shape: 'classic',
    shapeFamily: 'grid' as const,
    archetypeSlug: 'classic-medium',
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
    difficulty: 'Hard' as const,
    rowCount: 13,
    colCount: 13,
    shape: 'classic',
    shapeFamily: 'grid' as const,
    archetypeSlug: 'classic-hard',
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

export const BRIDGES_ARCHETYPES: readonly BridgesArchetype[] = [
  {
    slug: 'easy-archipelago',
    difficulty: 'Easy',
    family: 'archipelago',
    rowCount: 9,
    colCount: 9,
    extraEdges: [2, 4],
    doubleRate: 0.26,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 3, col: 7 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
      { row: 5, col: 7 },
      { row: 7, col: 2 },
      { row: 7, col: 4 },
      { row: 7, col: 6 },
    ],
  },
  {
    slug: 'easy-channel',
    difficulty: 'Easy',
    family: 'channel',
    rowCount: 9,
    colCount: 11,
    extraEdges: [2, 4],
    doubleRate: 0.24,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 1, col: 10 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 3, col: 7 },
      { row: 3, col: 10 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
      { row: 5, col: 7 },
    ],
  },
  {
    slug: 'easy-ring',
    difficulty: 'Easy',
    family: 'ring',
    rowCount: 9,
    colCount: 9,
    extraEdges: [2, 4],
    doubleRate: 0.28,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 3, col: 1 },
      { row: 3, col: 7 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
      { row: 5, col: 7 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 7, col: 7 },
    ],
  },
  {
    slug: 'easy-spine',
    difficulty: 'Easy',
    family: 'spine',
    rowCount: 11,
    colCount: 9,
    extraEdges: [2, 4],
    doubleRate: 0.22,
    allowTranspose: true,
    positions: [
      { row: 1, col: 4 },
      { row: 2, col: 1 },
      { row: 2, col: 4 },
      { row: 2, col: 7 },
      { row: 4, col: 4 },
      { row: 5, col: 2 },
      { row: 5, col: 4 },
      { row: 5, col: 6 },
      { row: 7, col: 4 },
      { row: 8, col: 1 },
      { row: 8, col: 4 },
      { row: 8, col: 7 },
    ],
  },
  {
    slug: 'easy-fan',
    difficulty: 'Easy',
    family: 'fan',
    rowCount: 9,
    colCount: 11,
    extraEdges: [2, 4],
    doubleRate: 0.22,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 1, col: 9 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 3, col: 8 },
      { row: 5, col: 1 },
      { row: 5, col: 5 },
      { row: 5, col: 9 },
      { row: 7, col: 1 },
      { row: 7, col: 6 },
    ],
  },
  {
    slug: 'easy-grid',
    difficulty: 'Easy',
    family: 'grid',
    rowCount: 9,
    colCount: 9,
    extraEdges: [1, 2],
    doubleRate: 0.18,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 3, col: 7 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
      { row: 5, col: 7 },
    ],
  },
  {
    slug: 'medium-archipelago',
    difficulty: 'Medium',
    family: 'archipelago',
    rowCount: 13,
    colCount: 9,
    extraEdges: [7, 10],
    doubleRate: 0.49,
    allowTranspose: true,
    positions: [
      { row: 1, col: 4 },
      { row: 2, col: 1 },
      { row: 2, col: 4 },
      { row: 2, col: 7 },
      { row: 4, col: 2 },
      { row: 4, col: 4 },
      { row: 4, col: 6 },
      { row: 6, col: 4 },
      { row: 8, col: 2 },
      { row: 8, col: 4 },
      { row: 8, col: 6 },
      { row: 10, col: 1 },
      { row: 10, col: 4 },
      { row: 10, col: 7 },
      { row: 12, col: 4 },
    ],
  },
  {
    slug: 'medium-channel',
    difficulty: 'Medium',
    family: 'channel',
    rowCount: 11,
    colCount: 13,
    extraEdges: [7, 10],
    doubleRate: 0.5,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 2, col: 5 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 5, col: 1 },
      { row: 5, col: 3 },
      { row: 5, col: 5 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 9, col: 1 },
      { row: 9, col: 3 },
      { row: 9, col: 5 },
    ],
  },
  {
    slug: 'medium-ring',
    difficulty: 'Medium',
    family: 'ring',
    rowCount: 11,
    colCount: 11,
    extraEdges: [7, 10],
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
  {
    slug: 'medium-spine',
    difficulty: 'Medium',
    family: 'spine',
    rowCount: 13,
    colCount: 9,
    extraEdges: [7, 10],
    doubleRate: 0.49,
    allowTranspose: true,
    positions: [
      { row: 1, col: 4 },
      { row: 2, col: 1 },
      { row: 2, col: 4 },
      { row: 2, col: 7 },
      { row: 4, col: 2 },
      { row: 4, col: 4 },
      { row: 4, col: 6 },
      { row: 6, col: 4 },
      { row: 8, col: 2 },
      { row: 8, col: 4 },
      { row: 8, col: 6 },
      { row: 10, col: 1 },
      { row: 10, col: 4 },
      { row: 10, col: 7 },
      { row: 12, col: 4 },
    ],
  },
  {
    slug: 'medium-fan',
    difficulty: 'Medium',
    family: 'fan',
    rowCount: 11,
    colCount: 13,
    extraEdges: [7, 10],
    doubleRate: 0.47,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 8 },
      { row: 1, col: 11 },
      { row: 3, col: 1 },
      { row: 3, col: 5 },
      { row: 3, col: 9 },
      { row: 5, col: 1 },
      { row: 5, col: 6 },
      { row: 5, col: 10 },
      { row: 7, col: 1 },
      { row: 7, col: 7 },
      { row: 7, col: 11 },
      { row: 9, col: 1 },
      { row: 9, col: 8 },
    ],
  },
  {
    slug: 'medium-grid',
    difficulty: 'Medium',
    family: 'grid',
    rowCount: 11,
    colCount: 11,
    extraEdges: [7, 10],
    doubleRate: 0.48,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 3, col: 1 },
      { row: 3, col: 4 },
      { row: 3, col: 7 },
      { row: 5, col: 1 },
      { row: 5, col: 4 },
      { row: 5, col: 7 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 7, col: 7 },
    ],
  },
  {
    slug: 'hard-archipelago',
    difficulty: 'Hard',
    family: 'archipelago',
    rowCount: 13,
    colCount: 13,
    extraEdges: [10, 13],
    doubleRate: 0.58,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 1, col: 10 },
      { row: 4, col: 1 },
      { row: 4, col: 4 },
      { row: 4, col: 7 },
      { row: 4, col: 10 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 7, col: 7 },
      { row: 7, col: 10 },
      { row: 10, col: 1 },
      { row: 10, col: 4 },
      { row: 10, col: 7 },
      { row: 10, col: 10 },
    ],
  },
  {
    slug: 'hard-channel',
    difficulty: 'Hard',
    family: 'channel',
    rowCount: 13,
    colCount: 11,
    extraEdges: [10, 13],
    doubleRate: 0.6,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 8 },
      { row: 1, col: 10 },
      { row: 3, col: 1 },
      { row: 3, col: 5 },
      { row: 3, col: 8 },
      { row: 3, col: 10 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
      { row: 5, col: 9 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 7, col: 8 },
      { row: 7, col: 10 },
      { row: 9, col: 2 },
      { row: 9, col: 6 },
      { row: 9, col: 9 },
    ],
  },
  {
    slug: 'hard-ring',
    difficulty: 'Hard',
    family: 'ring',
    rowCount: 13,
    colCount: 13,
    extraEdges: [10, 14],
    doubleRate: 0.62,
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
      { row: 11, col: 1 },
      { row: 11, col: 4 },
      { row: 11, col: 7 },
      { row: 11, col: 9 },
    ],
  },
  {
    slug: 'hard-spine',
    difficulty: 'Hard',
    family: 'spine',
    rowCount: 13,
    colCount: 11,
    extraEdges: [10, 13],
    doubleRate: 0.58,
    allowTranspose: true,
    positions: [
      { row: 1, col: 5 },
      { row: 2, col: 2 },
      { row: 2, col: 5 },
      { row: 2, col: 8 },
      { row: 4, col: 1 },
      { row: 4, col: 5 },
      { row: 4, col: 9 },
      { row: 6, col: 3 },
      { row: 6, col: 5 },
      { row: 6, col: 7 },
      { row: 8, col: 1 },
      { row: 8, col: 5 },
      { row: 8, col: 9 },
      { row: 10, col: 2 },
      { row: 10, col: 5 },
      { row: 10, col: 8 },
      { row: 12, col: 5 },
    ],
  },
  {
    slug: 'hard-fan',
    difficulty: 'Hard',
    family: 'fan',
    rowCount: 11,
    colCount: 13,
    extraEdges: [10, 13],
    doubleRate: 0.57,
    allowTranspose: true,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 8 },
      { row: 1, col: 11 },
      { row: 3, col: 1 },
      { row: 3, col: 5 },
      { row: 3, col: 9 },
      { row: 5, col: 1 },
      { row: 5, col: 6 },
      { row: 5, col: 10 },
      { row: 7, col: 1 },
      { row: 7, col: 7 },
      { row: 7, col: 11 },
      { row: 9, col: 1 },
      { row: 9, col: 5 },
      { row: 9, col: 9 },
      { row: 9, col: 11 },
    ],
  },
  {
    slug: 'hard-grid',
    difficulty: 'Hard',
    family: 'grid',
    rowCount: 13,
    colCount: 13,
    extraEdges: [10, 13],
    doubleRate: 0.6,
    positions: [
      { row: 1, col: 1 },
      { row: 1, col: 4 },
      { row: 1, col: 7 },
      { row: 1, col: 10 },
      { row: 4, col: 1 },
      { row: 4, col: 4 },
      { row: 4, col: 7 },
      { row: 4, col: 10 },
      { row: 7, col: 1 },
      { row: 7, col: 4 },
      { row: 7, col: 7 },
      { row: 7, col: 10 },
      { row: 10, col: 1 },
      { row: 10, col: 4 },
      { row: 10, col: 7 },
      { row: 10, col: 10 },
    ],
  },
] as const;

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function rand() {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], rand: () => number): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function bridgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function isSingleDomain(mask: number): boolean {
  return mask === DOMAIN_ZERO || mask === DOMAIN_ONE || mask === DOMAIN_TWO;
}

function hasDomainValue(mask: number, value: 0 | 1 | 2): boolean {
  return value === 0
    ? (mask & DOMAIN_ZERO) !== 0
    : value === 1
      ? (mask & DOMAIN_ONE) !== 0
      : (mask & DOMAIN_TWO) !== 0;
}

function domainValues(mask: number): Array<0 | 1 | 2> {
  const values: Array<0 | 1 | 2> = [];
  if (mask & DOMAIN_ZERO) values.push(0);
  if (mask & DOMAIN_ONE) values.push(1);
  if (mask & DOMAIN_TWO) values.push(2);
  return values;
}

function domainMin(mask: number): number {
  if (mask & DOMAIN_ZERO) return 0;
  if (mask & DOMAIN_ONE) return 1;
  return 2;
}

function domainMax(mask: number): number {
  if (mask & DOMAIN_TWO) return 2;
  if (mask & DOMAIN_ONE) return 1;
  return 0;
}

function maskForValue(value: 0 | 1 | 2): number {
  return value === 0 ? DOMAIN_ZERO : value === 1 ? DOMAIN_ONE : DOMAIN_TWO;
}

function applyRequirements(
  seed: Omit<BridgesPuzzle, 'islands' | 'gridSize'> & { islands: SeedIsland[] }
): BridgesPuzzle {
  const counts: Record<number, number> = {};
  seed.islands.forEach((island) => {
    counts[island.id] = 0;
  });
  seed.solution.forEach((bridge) => {
    counts[bridge.island1] += bridge.count;
    counts[bridge.island2] += bridge.count;
  });

  return {
    id: seed.id,
    difficulty: seed.difficulty,
    rowCount: seed.rowCount,
    colCount: seed.colCount,
    gridSize: Math.max(seed.rowCount, seed.colCount),
    shape: seed.shape,
    shapeFamily: seed.shapeFamily,
    archetypeSlug: seed.archetypeSlug,
    islands: seed.islands.map((island) => ({
      ...island,
      requiredBridges: counts[island.id] ?? 0,
    })),
    solution: seed.solution,
  };
}

export const bridgesAnchorPuzzles: BridgesPuzzle[] = BASE_SEED_PUZZLES.map(applyRequirements);

function getUtcDayOrdinal(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY);
}

function dateStringToOrdinal(date: string): number {
  return Math.floor(new Date(`${date}T00:00:00.000Z`).getTime() / MS_PER_DAY);
}

function ordinalToDateString(ordinal: number): string {
  return new Date(ordinal * MS_PER_DAY).toISOString().slice(0, 10);
}

export function getPackStartOrdinal(): number {
  return dateStringToOrdinal(BRIDGES_PACK_START_DATE);
}

function buildNeighborCandidates(islands: SeedIsland[] | BridgesIsland[]): CandidateBridge[] {
  const candidates = new Map<string, CandidateBridge>();
  islands.forEach((island) => {
    let left: SeedIsland | BridgesIsland | null = null;
    let right: SeedIsland | BridgesIsland | null = null;
    let up: SeedIsland | BridgesIsland | null = null;
    let down: SeedIsland | BridgesIsland | null = null;

    islands.forEach((other) => {
      if (other.id === island.id) return;
      if (other.row === island.row) {
        if (other.col < island.col && (!left || other.col > left.col)) left = other;
        if (other.col > island.col && (!right || other.col < right.col)) right = other;
      }
      if (other.col === island.col) {
        if (other.row < island.row && (!up || other.row > up.row)) up = other;
        if (other.row > island.row && (!down || other.row < down.row)) down = other;
      }
    });

    ([left, right, up, down] as Array<SeedIsland | BridgesIsland | null>).forEach((neighbor) => {
      if (!neighbor) return;
      const key = bridgeKey(island.id, neighbor.id);
      candidates.set(key, {
        island1: Math.min(island.id, neighbor.id),
        island2: Math.max(island.id, neighbor.id),
      });
    });
  });

  return [...candidates.values()];
}

function wouldCandidateCross(
  candidate: CandidateBridge,
  existing: CandidateBridge,
  islandMap: Map<number, SeedIsland | BridgesIsland>
): boolean {
  const a = islandMap.get(candidate.island1);
  const b = islandMap.get(candidate.island2);
  const c = islandMap.get(existing.island1);
  const d = islandMap.get(existing.island2);
  if (!a || !b || !c || !d) return false;
  const candidateHorizontal = a.row === b.row;
  const existingHorizontal = c.row === d.row;
  if (candidateHorizontal === existingHorizontal) return false;

  const horizontal = candidateHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const vertical = candidateHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return (
    vertical.col > horizontal.minCol &&
    vertical.col < horizontal.maxCol &&
    horizontal.row > vertical.minRow &&
    horizontal.row < vertical.maxRow
  );
}

function crossesAny(
  candidate: CandidateBridge,
  selected: CandidateBridge[],
  islandMap: Map<number, SeedIsland | BridgesIsland>
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

  if (archetype.allowTranspose && rand() < 0.45) {
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
  const islandMap = new Map<number, SeedIsland>(islands.map((island) => [island.id, island]));
  const candidates = buildNeighborCandidates(islands);
  const selected: CandidateBridge[] = [];
  const components = new UnionFind(islands.length);

  shuffle(candidates, rand).forEach((candidate) => {
    if (selected.length >= islands.length - 1) return;
    if (components.find(candidate.island1) === components.find(candidate.island2)) return;
    if (crossesAny(candidate, selected, islandMap)) return;
    if (components.union(candidate.island1, candidate.island2)) {
      selected.push(candidate);
    }
  });

  if (selected.length !== islands.length - 1) return null;

  const targetExtras =
    archetype.extraEdges[0] +
    Math.floor(rand() * (archetype.extraEdges[1] - archetype.extraEdges[0] + 1));
  const selectedKeys = new Set(selected.map((bridge) => bridgeKey(bridge.island1, bridge.island2)));

  for (const candidate of shuffle(candidates, rand)) {
    if (selected.length >= islands.length - 1 + targetExtras) break;
    const key = bridgeKey(candidate.island1, candidate.island2);
    if (selectedKeys.has(key)) continue;
    if (crossesAny(candidate, selected, islandMap)) continue;
    selected.push(candidate);
    selectedKeys.add(key);
  }

  return selected.map((bridge) => ({
    island1: bridge.island1,
    island2: bridge.island2,
    count: rand() < archetype.doubleRate ? 2 : 1,
  }));
}

class UnionFind {
  private readonly parent: number[];
  private readonly rank: number[];

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
    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA] += 1;
    }
    return true;
  }
}

function buildSolverContext(puzzle: BridgesPuzzle): SolverContext {
  const candidates = buildNeighborCandidates(puzzle.islands);
  const islandMap = new Map<number, BridgesIsland>(puzzle.islands.map((island) => [island.id, island]));
  const edges: SolverEdge[] = candidates.map((candidate) => ({
    ...candidate,
    crossings: [],
  }));
  for (let first = 0; first < edges.length; first += 1) {
    for (let second = first + 1; second < edges.length; second += 1) {
      if (wouldCandidateCross(edges[first], edges[second], islandMap)) {
        edges[first].crossings.push(second);
        edges[second].crossings.push(first);
      }
    }
  }
  const incidentEdges: number[][] = puzzle.islands.map(() => []);
  edges.forEach((edge, edgeIndex) => {
    incidentEdges[edge.island1]?.push(edgeIndex);
    incidentEdges[edge.island2]?.push(edgeIndex);
  });
  return { islands: puzzle.islands, edges, incidentEdges };
}

function reachableSums(edgeIndices: number[], domains: number[]): Set<number> {
  let sums = new Set<number>([0]);
  edgeIndices.forEach((edgeIndex) => {
    const next = new Set<number>();
    sums.forEach((sum) => {
      domainValues(domains[edgeIndex]).forEach((value) => {
        next.add(sum + value);
      });
    });
    sums = next;
  });
  return sums;
}

function buildPartialGraph(
  context: SolverContext,
  domains: number[],
  positiveOnly: boolean
): number[][] {
  const graph = context.islands.map(() => [] as number[]);
  context.edges.forEach((edge, edgeIndex) => {
    const mask = domains[edgeIndex];
    const include = positiveOnly ? (mask & DOMAIN_ZERO) === 0 : (mask & POSITIVE_DOMAIN) !== 0;
    if (!include) return;
    graph[edge.island1]?.push(edge.island2);
    graph[edge.island2]?.push(edge.island1);
  });
  return graph;
}

function connectedComponentIds(graph: number[][]): number[][] {
  const visited = new Set<number>();
  const components: number[][] = [];
  for (let islandId = 0; islandId < graph.length; islandId += 1) {
    if (visited.has(islandId)) continue;
    const stack = [islandId];
    const component: number[] = [];
    while (stack.length) {
      const current = stack.pop();
      if (current === undefined || visited.has(current)) continue;
      visited.add(current);
      component.push(current);
      graph[current]?.forEach((next) => {
        if (!visited.has(next)) stack.push(next);
      });
    }
    components.push(component);
  }
  return components;
}

function applyDomain(domains: number[], edgeIndex: number, nextMask: number): boolean {
  if (nextMask === 0) return false;
  if (domains[edgeIndex] === nextMask) return true;
  domains[edgeIndex] = nextMask;
  return true;
}

function exactPropagate(domains: number[], context: SolverContext): boolean {
  let changed = true;
  while (changed) {
    changed = false;

    for (let islandId = 0; islandId < context.islands.length; islandId += 1) {
      const required = context.islands[islandId]?.requiredBridges ?? 0;
      const incident = context.incidentEdges[islandId] ?? [];
      const reachable = reachableSums(incident, domains);
      if (!reachable.has(required)) return false;

      for (const edgeIndex of incident) {
        const otherEdges = incident.filter((candidateIndex) => candidateIndex !== edgeIndex);
        const otherReachable = reachableSums(otherEdges, domains);
        let nextMask = 0;
        domainValues(domains[edgeIndex]).forEach((value) => {
          if (otherReachable.has(required - value)) {
            nextMask |= maskForValue(value);
          }
        });
        if (nextMask === 0) return false;
        if (nextMask !== domains[edgeIndex]) {
          domains[edgeIndex] = nextMask;
          changed = true;
        }
      }
    }

    for (let edgeIndex = 0; edgeIndex < context.edges.length; edgeIndex += 1) {
      const mask = domains[edgeIndex];
      if ((mask & DOMAIN_ZERO) !== 0) continue;
      for (const crossingIndex of context.edges[edgeIndex]?.crossings ?? []) {
        const nextMask = domains[crossingIndex] & DOMAIN_ZERO;
        if (nextMask === 0) return false;
        if (nextMask !== domains[crossingIndex]) {
          domains[crossingIndex] = nextMask;
          changed = true;
        }
      }
    }

    const possibleGraph = buildPartialGraph(context, domains, false);
    if (connectedComponentIds(possibleGraph).length > 1) return false;
  }

  return true;
}

function buildBridgeSolution(context: SolverContext, domains: number[]): BridgesBridge[] {
  return context.edges
    .map((edge, edgeIndex) => {
      const mask = domains[edgeIndex];
      if (!isSingleDomain(mask)) return null;
      const count = domainMax(mask);
      if (count <= 0) return null;
      return {
        island1: edge.island1,
        island2: edge.island2,
        count: count as 1 | 2,
      };
    })
    .filter((bridge): bridge is BridgesBridge => bridge !== null);
}

function chooseBranchEdge(context: SolverContext, domains: number[]): number {
  let bestIndex = -1;
  let bestScore = -Infinity;
  for (let edgeIndex = 0; edgeIndex < domains.length; edgeIndex += 1) {
    const mask = domains[edgeIndex];
    if (isSingleDomain(mask)) continue;
    const domainSize = domainValues(mask).length;
    const score =
      (context.edges[edgeIndex]?.crossings.length ?? 0) * 10 +
      (context.incidentEdges[context.edges[edgeIndex]?.island1 ?? 0]?.length ?? 0) +
      (context.incidentEdges[context.edges[edgeIndex]?.island2 ?? 0]?.length ?? 0) -
      domainSize * 20;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = edgeIndex;
    }
  }
  return bestIndex;
}

function exactSolveWithDomains(
  context: SolverContext,
  domains: number[],
  limit: number
): ExactSolveResult {
  const working = [...domains];
  if (!exactPropagate(working, context)) {
    return { solutionCount: 0, solution: null };
  }

  if (working.every(isSingleDomain)) {
    const solution = buildBridgeSolution(context, working);
    const graph = context.islands.map(() => [] as number[]);
    solution.forEach((bridge) => {
      graph[bridge.island1]?.push(bridge.island2);
      graph[bridge.island2]?.push(bridge.island1);
    });
    if (connectedComponentIds(graph).length !== 1) {
      return { solutionCount: 0, solution: null };
    }
    return { solutionCount: 1, solution };
  }

  const edgeIndex = chooseBranchEdge(context, working);
  if (edgeIndex < 0) return { solutionCount: 0, solution: null };

  let count = 0;
  let firstSolution: BridgesBridge[] | null = null;
  for (const value of domainValues(working[edgeIndex]).sort((a, b) => b - a)) {
    const next = [...working];
    next[edgeIndex] = maskForValue(value);
    const result = exactSolveWithDomains(context, next, limit - count);
    if (result.solutionCount > 0 && !firstSolution) {
      firstSolution = result.solution;
    }
    count += result.solutionCount;
    if (count >= limit) {
      return { solutionCount: count, solution: firstSolution };
    }
  }

  return { solutionCount: count, solution: firstSolution };
}

export function solvePuzzleExactly(puzzle: BridgesPuzzle, limit = 2): ExactSolveResult {
  const context = buildSolverContext(puzzle);
  return exactSolveWithDomains(context, Array(context.edges.length).fill(DOMAIN_ANY), limit);
}

function tryForceZero(
  context: SolverContext,
  domains: number[],
  edgeIndex: number
): boolean {
  const test = [...domains];
  test[edgeIndex] = DOMAIN_ZERO;
  return exactSolveWithDomains(context, test, 1).solutionCount > 0;
}

function tryForceValue(
  context: SolverContext,
  domains: number[],
  edgeIndex: number,
  value: 0 | 1 | 2
): boolean {
  const test = [...domains];
  test[edgeIndex] = maskForValue(value);
  return exactSolveWithDomains(context, test, 1).solutionCount > 0;
}

function runHumanSolve(puzzle: BridgesPuzzle): HumanSolveAnalysis {
  const context = buildSolverContext(puzzle);
  const domains = Array(context.edges.length).fill(DOMAIN_ANY);
  const ruleCounts = Object.fromEntries(
    HUMAN_RULE_ORDER.map((rule) => [rule, 0])
  ) as Record<HumanRuleName, number>;
  let passes = 0;
  let openingProgress = false;
  let consecutiveStalls = 0;
  let contradiction = false;

  const applyRule = (rule: HumanRuleName): boolean => {
    if (rule === 'saturation') {
      for (let islandId = 0; islandId < context.islands.length; islandId += 1) {
        const incident = context.incidentEdges[islandId] ?? [];
        const required = context.islands[islandId]?.requiredBridges ?? 0;
        const minTotal = incident.reduce((sum, edgeIndex) => sum + domainMin(domains[edgeIndex]), 0);
        const maxTotal = incident.reduce((sum, edgeIndex) => sum + domainMax(domains[edgeIndex]), 0);
        if (required === minTotal) {
          for (const edgeIndex of incident) {
            const nextMask = maskForValue(domainMin(domains[edgeIndex]) as 0 | 1 | 2);
            if (nextMask !== domains[edgeIndex]) {
              if (!applyDomain(domains, edgeIndex, nextMask)) {
                contradiction = true;
                return false;
              }
              ruleCounts[rule] += 1;
              return true;
            }
          }
        }
        if (required === maxTotal) {
          for (const edgeIndex of incident) {
            const nextMask = maskForValue(domainMax(domains[edgeIndex]) as 0 | 1 | 2);
            if (nextMask !== domains[edgeIndex]) {
              if (!applyDomain(domains, edgeIndex, nextMask)) {
                contradiction = true;
                return false;
              }
              ruleCounts[rule] += 1;
              return true;
            }
          }
        }
      }
      return false;
    }

    if (rule === 'minimum-required') {
      for (let islandId = 0; islandId < context.islands.length; islandId += 1) {
        const incident = context.incidentEdges[islandId] ?? [];
        const required = context.islands[islandId]?.requiredBridges ?? 0;
        for (const edgeIndex of incident) {
          const others = incident.filter((candidateIndex) => candidateIndex !== edgeIndex);
          const reachable = reachableSums(others, domains);
          let nextMask = 0;
          domainValues(domains[edgeIndex]).forEach((value) => {
            if (reachable.has(required - value)) {
              nextMask |= maskForValue(value);
            }
          });
          if (nextMask === 0) {
            contradiction = true;
            return false;
          }
          if (nextMask !== domains[edgeIndex]) {
            domains[edgeIndex] = nextMask;
            ruleCounts[rule] += 1;
            return true;
          }
        }
      }
      return false;
    }

    if (rule === 'exhausted-neighbor') {
      for (let islandId = 0; islandId < context.islands.length; islandId += 1) {
        const incident = context.incidentEdges[islandId] ?? [];
        const required = context.islands[islandId]?.requiredBridges ?? 0;
        const fixedTotal = incident.reduce((sum, edgeIndex) => {
          return sum + (isSingleDomain(domains[edgeIndex]) ? domainMax(domains[edgeIndex]) : 0);
        }, 0);
        const undecided = incident.filter((edgeIndex) => !isSingleDomain(domains[edgeIndex]));
        if (fixedTotal === required) {
          for (const edgeIndex of undecided) {
            if ((domains[edgeIndex] & DOMAIN_ZERO) === 0 || domains[edgeIndex] !== DOMAIN_ZERO) {
              domains[edgeIndex] = DOMAIN_ZERO;
              ruleCounts[rule] += 1;
              return true;
            }
          }
        }
        if (undecided.length === 1) {
          const edgeIndex = undecided[0];
          const needed = (required - (fixedTotal as number)) as 0 | 1 | 2;
          if (needed < 0 || needed > 2) {
            contradiction = true;
            return false;
          }
          const nextMask = domains[edgeIndex] & maskForValue(needed);
          if (nextMask === 0) {
            contradiction = true;
            return false;
          }
          if (nextMask !== domains[edgeIndex]) {
            domains[edgeIndex] = nextMask;
            ruleCounts[rule] += 1;
            return true;
          }
        }
      }
      return false;
    }

    if (rule === 'crossing-lane') {
      for (let edgeIndex = 0; edgeIndex < context.edges.length; edgeIndex += 1) {
        if ((domains[edgeIndex] & DOMAIN_ZERO) !== 0) continue;
        for (const crossingIndex of context.edges[edgeIndex]?.crossings ?? []) {
          const nextMask = domains[crossingIndex] & DOMAIN_ZERO;
          if (nextMask === 0) {
            contradiction = true;
            return false;
          }
          if (nextMask !== domains[crossingIndex]) {
            domains[crossingIndex] = nextMask;
            ruleCounts[rule] += 1;
            return true;
          }
        }
      }
      return false;
    }

    if (rule === 'stranded-component') {
      const forcedGraph = buildPartialGraph(context, domains, true);
      const components = connectedComponentIds(forcedGraph);
      if (components.length <= 1) return false;
      for (const component of components) {
        if (component.length === context.islands.length) continue;
        const componentSet = new Set(component);
        const exits = new Set<number>();
        context.edges.forEach((edge, edgeIndex) => {
          const touchesComponent =
            componentSet.has(edge.island1) !== componentSet.has(edge.island2);
          if (!touchesComponent) return;
          if ((domains[edgeIndex] & POSITIVE_DOMAIN) === 0) return;
          exits.add(edgeIndex);
        });
        if (exits.size === 0) {
          contradiction = true;
          return false;
        }
        if (exits.size === 1) {
          const [edgeIndex] = [...exits];
          const nextMask = domains[edgeIndex] & POSITIVE_DOMAIN;
          if (nextMask === 0) {
            contradiction = true;
            return false;
          }
          if (nextMask !== domains[edgeIndex]) {
            domains[edgeIndex] = nextMask;
            ruleCounts[rule] += 1;
            return true;
          }
        }
      }
      return false;
    }

    if (rule === 'split-prevention') {
      for (let edgeIndex = 0; edgeIndex < context.edges.length; edgeIndex += 1) {
        if ((domains[edgeIndex] & DOMAIN_ZERO) === 0) continue;
        if ((domains[edgeIndex] & POSITIVE_DOMAIN) === 0) continue;
        if (!tryForceZero(context, domains, edgeIndex)) {
          const nextMask = domains[edgeIndex] & POSITIVE_DOMAIN;
          if (nextMask === 0) {
            contradiction = true;
            return false;
          }
          if (nextMask !== domains[edgeIndex]) {
            domains[edgeIndex] = nextMask;
            ruleCounts[rule] += 1;
            return true;
          }
        }
      }
      return false;
    }

    for (let edgeIndex = 0; edgeIndex < context.edges.length; edgeIndex += 1) {
      if (isSingleDomain(domains[edgeIndex])) continue;
      let nextMask = 0;
      domainValues(domains[edgeIndex]).forEach((value) => {
        if (tryForceValue(context, domains, edgeIndex, value)) {
          nextMask |= maskForValue(value);
        }
      });
      if (nextMask === 0) {
        contradiction = true;
        return false;
      }
      if (nextMask !== domains[edgeIndex]) {
        domains[edgeIndex] = nextMask;
        ruleCounts[rule] += 1;
        return true;
      }
    }
    return false;
  };

  while (passes < 96) {
    passes += 1;
    let progress = false;
    for (const rule of HUMAN_RULE_ORDER) {
      if (applyRule(rule)) {
        progress = true;
        if (passes <= 2) openingProgress = true;
        break;
      }
      if (contradiction) break;
    }

    if (contradiction) break;
    if (domains.every(isSingleDomain)) break;
    if (!progress) {
      consecutiveStalls += 1;
      if (passes <= 2 || consecutiveStalls > 3) break;
    } else {
      consecutiveStalls = 0;
    }
  }

  const exact = contradiction ? { solutionCount: 0, solution: null } : exactSolveWithDomains(context, domains, 2);
  const solved = !contradiction && exact.solutionCount === 1 && domains.every(isSingleDomain);
  const advancedRules =
    ruleCounts['stranded-component'] +
    ruleCounts['split-prevention'] +
    ruleCounts['consistency-sweep'];
  const highRequirements = puzzle.islands.filter((island) => island.requiredBridges >= 5).length;
  const doubles = puzzle.solution.filter((bridge) => bridge.count === 2).length;
  const difficultyScore =
    HUMAN_RULE_ORDER.reduce((sum, rule) => sum + ruleCounts[rule] * HUMAN_RULE_WEIGHTS[rule], 0) +
    passes * 4 +
    puzzle.solution.length +
    puzzle.islands.length +
    highRequirements * 3 +
    doubles * 2 +
    (puzzle.rowCount !== puzzle.colCount ? 4 : 0);

  return {
    solved,
    contradiction,
    openingProgress,
    stalledPasses: consecutiveStalls,
    passes,
    usedAdvancedRule: advancedRules > 0,
    difficultyScore,
    ruleCounts,
  };
}

const HARD_ANCHOR_SCORE = runHumanSolve(bridgesAnchorPuzzles[2]).difficultyScore;
const MEDIUM_FLOOR_SCORE = Math.max(42, HARD_ANCHOR_SCORE - 30);
const HARD_FLOOR_SCORE = HARD_ANCHOR_SCORE + 70;

export function classifyHumanDifficultyScore(score: number): BridgesDifficulty {
  if (score < MEDIUM_FLOOR_SCORE) return 'Easy';
  if (score < HARD_FLOOR_SCORE) return 'Medium';
  return 'Hard';
}

function buildPuzzleSignature(puzzle: BridgesPuzzle, difficultyScore: number): string {
  const rowBand = `${puzzle.rowCount}x${puzzle.colCount}`;
  const islandBand = `${Math.floor(puzzle.islands.length / 2) * 2}+`;
  const doubleBand = `${puzzle.solution.filter((bridge) => bridge.count === 2).length}`;
  const highBand = `${puzzle.islands.filter((island) => island.requiredBridges >= 5).length}`;
  const axis =
    puzzle.rowCount === puzzle.colCount ? 'square' : puzzle.rowCount > puzzle.colCount ? 'tall' : 'wide';
  const histogram = puzzle.islands
    .map((island) => island.requiredBridges)
    .sort((a, b) => a - b)
    .join('');
  return [
    puzzle.shapeFamily,
    rowBand,
    islandBand,
    doubleBand,
    highBand,
    axis,
    Math.round(difficultyScore / 10),
    histogram,
  ].join('|');
}

function meetsStructuralFloor(puzzle: BridgesPuzzle): boolean {
  const floor = STRUCTURAL_FLOORS[puzzle.difficulty];
  const highRequirements = puzzle.islands.filter((island) => island.requiredBridges >= 5).length;
  return (
    puzzle.islands.length >= floor.islands &&
    puzzle.solution.length >= floor.bridges &&
    highRequirements >= floor.highRequirements
  );
}

function generateAcceptedCandidatePool(
  archetype: BridgesArchetype,
  neededCount: number
): CandidatePoolEntry[] {
  const targetCount = Math.max(8, neededCount + 2);
  const pool: CandidatePoolEntry[] = [];
  const seenSignatures = new Set<string>();
  let attempts = 0;
  const rejected = {
    noSolution: 0,
    requirements: 0,
    structure: 0,
    exact: 0,
    human: 0,
    difficulty: 0,
    duplicate: 0,
  };

  while (pool.length < targetCount && attempts < targetCount * 900) {
    attempts += 1;
    const rand = mulberry32(attempts * 101 + archetype.slug.length * 977 + targetCount * 31);
    const transformed = transformPositions(archetype, rand);
    const solution = buildSolution(transformed.islands, archetype, rand);
    if (!solution) {
      rejected.noSolution += 1;
      continue;
    }

    const puzzle = applyRequirements({
      id: `${archetype.slug}-${attempts}`,
      difficulty: archetype.difficulty,
      rowCount: transformed.rowCount,
      colCount: transformed.colCount,
      shape: transformed.shape,
      shapeFamily: archetype.family,
      archetypeSlug: archetype.slug,
      islands: transformed.islands,
      solution,
    });

    const maxRequirement = MAX_REQUIREMENT_BY_DIFFICULTY[archetype.difficulty];
    if (puzzle.islands.some((island) => island.requiredBridges <= 0 || island.requiredBridges > maxRequirement)) {
      rejected.requirements += 1;
      continue;
    }
    if (!meetsStructuralFloor(puzzle)) {
      rejected.structure += 1;
      continue;
    }

    const exact = solvePuzzleExactly(puzzle, 2);
    if (exact.solutionCount !== 1) {
      rejected.exact += 1;
      continue;
    }

    const human = runHumanSolve(puzzle);
    if (!human.solved || !human.openingProgress || human.stalledPasses > 3) {
      rejected.human += 1;
      continue;
    }

    const signature = buildPuzzleSignature(puzzle, human.difficultyScore);
    if (seenSignatures.has(signature)) {
      rejected.duplicate += 1;
      continue;
    }
    seenSignatures.add(signature);
    pool.push({
      archetypeSlug: `${archetype.slug}-candidate-${String(pool.length + 1).padStart(2, '0')}`,
      difficulty: archetype.difficulty,
      shapeFamily: archetype.family,
      difficultyScore: human.difficultyScore,
      signature,
      puzzle: {
        ...puzzle,
        id: `${archetype.slug}-${String(pool.length + 1).padStart(2, '0')}`,
      },
    });
  }

  if (pool.length < targetCount) {
    throw new Error(
      `Only built ${pool.length} accepted puzzles for ${archetype.slug}; expected ${targetCount}. Rejects=${JSON.stringify(
        rejected
      )}.`
    );
  }

  return pool;
}

const ONBOARDING_SEQUENCE: readonly BridgesDifficulty[] = [
  'Easy',
  'Medium',
  'Easy',
  'Medium',
  'Hard',
  'Medium',
  'Easy',
  'Medium',
  'Hard',
  'Medium',
  'Easy',
  'Medium',
  'Easy',
  'Hard',
  'Medium',
  'Easy',
  'Medium',
  'Hard',
  'Medium',
  'Easy',
  'Medium',
  'Easy',
  'Medium',
  'Hard',
  'Medium',
  'Easy',
  'Medium',
  'Easy',
];

const REMAINING_BLOCK_PATTERNS: Record<'A' | 'B' | 'C', readonly BridgesDifficulty[]> = {
  A: ['Medium', 'Hard', 'Medium', 'Medium', 'Easy', 'Medium', 'Hard', 'Medium', 'Medium', 'Hard', 'Medium', 'Medium', 'Hard', 'Medium'],
  B: ['Medium', 'Hard', 'Medium', 'Easy', 'Medium', 'Medium', 'Hard', 'Medium', 'Easy', 'Medium', 'Hard', 'Medium', 'Medium', 'Hard'],
  C: ['Medium', 'Hard', 'Medium', 'Medium', 'Hard', 'Easy', 'Medium', 'Hard', 'Medium', 'Medium', 'Hard', 'Medium', 'Hard', 'Medium'],
};

const REMAINING_BLOCK_SEQUENCE: ReadonlyArray<'A' | 'B' | 'C'> = [
  'B', 'C', 'A', 'B', 'C', 'B', 'A', 'C', 'B', 'A', 'C', 'B',
  'B', 'C', 'A', 'B', 'C', 'B', 'A', 'C', 'B', 'A', 'C', 'B',
];

function buildDifficultySchedule(): BridgesDifficulty[] {
  const countsForWindow = (window: BridgesDifficulty[]) => ({
    Easy: window.filter((value) => value === 'Easy').length,
    Medium: window.filter((value) => value === 'Medium').length,
    Hard: window.filter((value) => value === 'Hard').length,
  });

  const isPrefixValid = (sequence: BridgesDifficulty[]): boolean => {
    for (let index = 2; index < sequence.length; index += 1) {
      if (
        sequence[index] === 'Hard' &&
        sequence[index - 1] === 'Hard' &&
        sequence[index - 2] === 'Hard'
      ) {
        return false;
      }
    }

    for (let end = BRIDGES_ONBOARDING_DAYS + 13; end < sequence.length; end += 1) {
      const start = end - 13;
      if (start < BRIDGES_ONBOARDING_DAYS) continue;
      const counts = countsForWindow(sequence.slice(start, end + 1));
      if (
        counts.Easy > 3 ||
        counts.Medium < 7 ||
        counts.Medium > 10 ||
        counts.Hard < 3 ||
        counts.Hard > 5
      ) {
        return false;
      }
    }

    return true;
  };

  const baseSequence: BridgesDifficulty[] = [...ONBOARDING_SEQUENCE];
  const remainingBlocks: Record<'A' | 'B' | 'C', number> = { A: 6, B: 10, C: 8 };
  const chosenBlocks: Array<'A' | 'B' | 'C'> = [];

  const buildBlocks = (sequence: BridgesDifficulty[]): BridgesDifficulty[] | null => {
    if (chosenBlocks.length === 24) {
      const completed: BridgesDifficulty[] = [...sequence, 'Medium'];
      if (!isPrefixValid(completed)) return null;
      const totals = countsForWindow(completed);
      if (
        totals.Easy !== BRIDGES_DIFFICULTY_TOTALS.Easy ||
        totals.Medium !== BRIDGES_DIFFICULTY_TOTALS.Medium ||
        totals.Hard !== BRIDGES_DIFFICULTY_TOTALS.Hard
      ) {
        return null;
      }
      return completed;
    }

    for (const blockId of ['B', 'C', 'A'] as const) {
      if (remainingBlocks[blockId] <= 0) continue;
      const next: BridgesDifficulty[] = [...sequence, ...REMAINING_BLOCK_PATTERNS[blockId]];
      if (!isPrefixValid(next)) continue;
      chosenBlocks.push(blockId);
      remainingBlocks[blockId] -= 1;
      const built = buildBlocks(next);
      if (built) return built;
      remainingBlocks[blockId] += 1;
      chosenBlocks.pop();
    }

    return null;
  };

  const sequence = buildBlocks(baseSequence);
  if (!sequence) {
    throw new Error('Could not build a Bridges difficulty schedule that met the yearly constraints.');
  }
  return sequence;
}

function buildThemeSchedule(): BridgesThemeId[] {
  return Array.from({ length: BRIDGES_PACK_LENGTH }, (_, index) => {
    return BRIDGES_THEME_ORDER[index % BRIDGES_THEME_ORDER.length]?.id ?? 'ocean';
  });
}

function assignFamilyBlocks(): BridgesShapeFamily[] {
  const themeSchedule = buildThemeSchedule();
  const perThemeSequences = Object.fromEntries(
    BRIDGES_THEME_IDS.map((themeId) => {
      const targetCounts = { ...BRIDGES_THEME_FAMILY_TARGETS[themeId] };
      const sequence: BridgesShapeFamily[] = [];
      const rand = mulberry32(themeId.length * 1301 + themeSchedule.length * 17);
      let previous: BridgesShapeFamily | null = null;

      const total =
        themeSchedule.filter((candidateThemeId) => candidateThemeId === themeId).length;

      for (let index = 0; index < total; index += 1) {
        const candidates = BRIDGES_SHAPE_FAMILIES.filter(
          (family) => (targetCounts[family] ?? 0) > 0
        ).sort((left, right) => {
          const remainingLeft = targetCounts[left] ?? 0;
          const remainingRight = targetCounts[right] ?? 0;
          const repeatPenaltyLeft = previous === left ? -10 : 0;
          const repeatPenaltyRight = previous === right ? -10 : 0;
          return remainingRight + repeatPenaltyRight - (remainingLeft + repeatPenaltyLeft) || rand() - 0.5;
        });

        const selected = candidates[0];
        if (!selected) {
          throw new Error(`No themed family candidates left for ${themeId}.`);
        }
        sequence.push(selected);
        targetCounts[selected] = (targetCounts[selected] ?? 0) - 1;
        previous = selected;
      }

      return [themeId, sequence];
    })
  ) as Record<BridgesThemeId, BridgesShapeFamily[]>;

  const cursors = Object.fromEntries(
    BRIDGES_THEME_IDS.map((themeId) => [themeId, 0])
  ) as Record<BridgesThemeId, number>;

  return themeSchedule.map((themeId) => {
    const cursor = cursors[themeId];
    const family = perThemeSequences[themeId][cursor];
    cursors[themeId] += 1;
    if (!family) {
      throw new Error(`Missing theme family assignment for ${themeId} at position ${cursor}.`);
    }
    return family;
  });
}

function scheduleCellCounts(
  difficulties: BridgesDifficulty[],
  families: BridgesShapeFamily[]
): Record<BridgesDifficulty, Record<BridgesShapeFamily, number>> {
  const counts = {
    Easy: Object.fromEntries(BRIDGES_SHAPE_FAMILIES.map((family) => [family, 0])),
    Medium: Object.fromEntries(BRIDGES_SHAPE_FAMILIES.map((family) => [family, 0])),
    Hard: Object.fromEntries(BRIDGES_SHAPE_FAMILIES.map((family) => [family, 0])),
  } as Record<BridgesDifficulty, Record<BridgesShapeFamily, number>>;

  difficulties.forEach((difficulty, index) => {
    const family = families[index];
    if (family) counts[difficulty][family] += 1;
  });
  return counts;
}

export function buildBridgesPack(startDate = BRIDGES_PACK_START_DATE): BridgesPackEntry[] {
  const difficultySchedule = buildDifficultySchedule();
  const themeSchedule = buildThemeSchedule();
  const familySchedule = assignFamilyBlocks();

  if (
    difficultySchedule.length !== BRIDGES_PACK_LENGTH ||
    themeSchedule.length !== BRIDGES_PACK_LENGTH ||
    familySchedule.length !== BRIDGES_PACK_LENGTH
  ) {
    throw new Error('Pack schedule dimensions drifted.');
  }

  const cellCounts = scheduleCellCounts(difficultySchedule, familySchedule);
  const pools = new Map<string, CandidatePoolEntry[]>();
  BRIDGES_ARCHETYPES.forEach((archetype) => {
    const needed = cellCounts[archetype.difficulty][archetype.family];
    const pool = generateAcceptedCandidatePool(archetype, needed);
    pools.set(`${archetype.difficulty}:${archetype.family}`, pool);
  });

  const signatures = new Set<string>();
  const entries: BridgesPackEntry[] = [];
  const startOrdinal = dateStringToOrdinal(startDate);

  for (let index = 0; index < BRIDGES_PACK_LENGTH; index += 1) {
    const difficulty = difficultySchedule[index]!;
    const themeId = themeSchedule[index]!;
    const shapeFamily = familySchedule[index]!;
    const poolKey = `${difficulty}:${shapeFamily}`;
    const pool = pools.get(poolKey);
    if (!pool || pool.length === 0) {
      throw new Error(`No puzzle pool available for ${poolKey}.`);
    }

    const candidate = pool.shift();
    if (!candidate) {
      throw new Error(`Ran out of generated candidates for ${poolKey}.`);
    }
    if (signatures.has(candidate.signature)) {
      throw new Error(`Duplicate signature ${candidate.signature}.`);
    }
    signatures.add(candidate.signature);

    entries.push({
      date: ordinalToDateString(startOrdinal + index),
      difficulty,
      themeId,
      shapeFamily,
      archetypeSlug: candidate.archetypeSlug,
      difficultyScore: candidate.difficultyScore,
      signature: candidate.signature,
      puzzle: candidate.puzzle,
    });
  }

  return entries;
}

export function buildFallbackEntry(date: Date): BridgesPackEntry {
  const ordinal = getUtcDayOrdinal(date);
  const packOffset = Math.abs(ordinal - getPackStartOrdinal()) % BRIDGES_PACK_LENGTH;
  const pack = buildBridgesPack(BRIDGES_PACK_START_DATE);
  const template = pack[packOffset]!;
  const seed = ordinal * 131 + packOffset * 977 + 47281;
  const rand = mulberry32(seed);
  const archetype = BRIDGES_ARCHETYPES.find(
    (candidate) =>
      candidate.difficulty === template.difficulty && candidate.family === template.shapeFamily
  );
  if (!archetype) {
    return template;
  }
  for (let attempt = 0; attempt < 160; attempt += 1) {
    const transformed = transformPositions(archetype, rand);
    const solution = buildSolution(transformed.islands, archetype, rand);
    if (!solution) continue;
    const puzzle = applyRequirements({
      id: `${archetype.slug}-fallback-${ordinal}-${attempt}`,
      difficulty: archetype.difficulty,
      rowCount: transformed.rowCount,
      colCount: transformed.colCount,
      shape: transformed.shape,
      shapeFamily: archetype.family,
      archetypeSlug: archetype.slug,
      islands: transformed.islands,
      solution,
    });
    const exact = solvePuzzleExactly(puzzle, 2);
    const human = runHumanSolve(puzzle);
    if (
      exact.solutionCount === 1 &&
      human.solved &&
      human.openingProgress &&
      classifyHumanDifficultyScore(human.difficultyScore) === archetype.difficulty
    ) {
      return {
        date: ordinalToDateString(ordinal),
        difficulty: template.difficulty,
        themeId: BRIDGES_THEME_ORDER[packOffset % BRIDGES_THEME_ORDER.length]?.id ?? 'ocean',
        shapeFamily: archetype.family,
        archetypeSlug: `${archetype.slug}-fallback-${attempt}`,
        difficultyScore: human.difficultyScore,
        signature: buildPuzzleSignature(puzzle, human.difficultyScore),
        puzzle,
      };
    }
  }
  return {
    ...template,
    date: ordinalToDateString(ordinal),
  };
}

export function analyzePuzzle(puzzle: BridgesPuzzle): {
  exact: ExactSolveResult;
  human: HumanSolveAnalysis;
} {
  return {
    exact: solvePuzzleExactly(puzzle, 2),
    human: runHumanSolve(puzzle),
  };
}
