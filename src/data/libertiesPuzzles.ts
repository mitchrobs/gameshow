import { dateKeyToUtcOrdinal, getUtcDateKey } from '../utils/dailyUtc';
import {
  generatedLibertiesPack,
  generatedLibertiesPackHard,
  generatedLibertiesReservePack,
  generatedLibertiesReservePackHard,
} from './libertiesPack.generated';

export type LibertiesStoneColor = 'black' | 'white';
export type LibertiesDifficulty = 'Easy' | 'Standard' | 'Hard';
export type LibertiesVariant = 'chase' | 'responsive-lights' | 'capture-race';
export type LibertiesPlayMode = 'standard' | 'hard';
export type LibertiesTerrainArchetype =
  | 'corner-pocket'
  | 'tight-room'
  | 'soft-net'
  | 'chase-lane'
  | 'lane-stopper'
  | 'split-gate'
  | 'tempo-pocket'
  | 'fake-room'
  | 'bridge'
  | 'squeeze'
  | 'shared-throat'
  | 'backdoor-lane';
export type LibertiesPuzzleTag =
  | 'intro-clear'
  | 'shared-move'
  | 'empty-neighbor'
  | 'response-pressure'
  | 'key-crossing'
  | 'multi-chain'
  | 'edge-pressure'
  | 'locked-lane';
export type LibertiesSubPuzzleMoment =
  | 'capture-burst'
  | 'response-choreography'
  | 'shared-momentum'
  | 'release-timing'
  | 'release-chain'
  | 'forced-sequence'
  | 'edge-rush'
  | 'filler-avoid'
  | 'capture-wave'
  | 'squeeze-shape'
  | 'tempo-pressure'
  | 'bridge-battle';

export const LIBERTIES_TAG_LABELS: Record<LibertiesPuzzleTag, string> = {
  'intro-clear': 'First clears',
  'shared-move': 'Shared moves',
  'empty-neighbor': 'Empty neighbors',
  'response-pressure': 'Light response',
  'key-crossing': 'Key crossing',
  'multi-chain': 'Multi-chain',
  'edge-pressure': 'Edge pressure',
  'locked-lane': 'Locked lanes',
};
export const LIBERTIES_SUB_PUZZLE_MOMENT_LABELS: Record<LibertiesSubPuzzleMoment, string> = {
  'capture-burst': 'Capture burst',
  'response-choreography': 'Response choreography',
  'shared-momentum': 'Shared momentum',
  'release-timing': 'Release timing',
  'release-chain': 'Release chain',
  'forced-sequence': 'Forced sequence',
  'edge-rush': 'Edge rush',
  'filler-avoid': 'No filler',
  'capture-wave': 'Capture wave',
  'squeeze-shape': 'Squeeze shape',
  'tempo-pressure': 'Tempo pressure',
  'bridge-battle': 'Bridge battle',
};

export interface LibertiesPoint {
  row: number;
  col: number;
}

export type LibertiesCell = LibertiesStoneColor | 'frozen' | 'release' | null;
export type LibertiesBoard = LibertiesCell[][];

export interface LibertiesReleaseLink {
  point: LibertiesPoint;
  groupIndex: number;
}

export interface LibertiesPuzzle {
  id: string;
  title: string;
  difficulty: LibertiesDifficulty;
  size: number;
  targetMoves: number;
  minMoves?: number;
  targetSeconds: number;
  variant: LibertiesVariant;
  layout: string[];
  solution: LibertiesPoint[];
  minSolution?: LibertiesPoint[];
  releaseLinks: LibertiesReleaseLink[];
  lightGroups: LibertiesPoint[][];
  motif: string;
  focusTags: LibertiesPuzzleTag[];
  subPuzzleMoments?: LibertiesSubPuzzleMoment[];
  terrainArchetypes?: LibertiesTerrainArchetype[];
  playMode?: LibertiesPlayMode;
  calendarIndex?: number;
  peakHard?: boolean;
  optimalMoveCount?: number;
  qualityScore?: number;
  decisionPointCount?: number;
  tempoClearCount?: number;
  stretchPressureCount?: number;
  naivePenalty?: number;
  terrainUsefulnessScore?: number;
  calendarNoveltyScore?: number;
  reserveRank?: number;
}

export interface LibertiesDailyEntry {
  date: string;
  puzzle: LibertiesPuzzle;
}

export interface LibertiesGroup {
  color: LibertiesStoneColor;
  stones: LibertiesPoint[];
  liberties: Set<string>;
}

export type LibertiesIllegalReason =
  | 'occupied'
  | 'outside-board'
  | 'suicide';

export type LibertiesMoveResult =
  | {
      legal: true;
      board: LibertiesBoard;
      captured: LibertiesPoint[];
      capturedDark: LibertiesPoint[];
      released: LibertiesPoint[];
      responses: LibertiesPoint[];
    }
  | {
      legal: false;
      board: LibertiesBoard;
      reason: LibertiesIllegalReason;
    };

export interface LibertiesReplayResult {
  board: LibertiesBoard;
  illegalMoveIndex: number | null;
  captured: LibertiesPoint[];
  capturedDark: LibertiesPoint[];
  released: LibertiesPoint[];
  responses: LibertiesPoint[];
}

export interface LibertiesHintResult {
  point: LibertiesPoint;
  route: LibertiesPoint[];
  movesToSolve: number;
}

export interface LibertiesShareTextOptions {
  date: string;
  moves: number;
  elapsedSeconds: number;
  hintsUsed: number;
  url: string;
}

const LIBERTIES_PACK_START_DATE = '2026-05-18';
const LIBERTIES_STANDARD_PACK_LENGTH = 365;
const LIBERTIES_STANDARD_RESERVE_PACK_LENGTH = 72;
const LIBERTIES_STANDARD_GENERATION_POOL_LENGTH = LIBERTIES_STANDARD_PACK_LENGTH + LIBERTIES_STANDARD_RESERVE_PACK_LENGTH;
const LIBERTIES_HARD_PACK_LENGTH = 365;
const LIBERTIES_HARD_RESERVE_PACK_LENGTH = 72;
const LIBERTIES_HARD_GENERATION_POOL_LENGTH = LIBERTIES_HARD_PACK_LENGTH + LIBERTIES_HARD_RESERVE_PACK_LENGTH;
const LIBERTIES_STANDARD_DAILY_PUZZLE_ID = 'liberties-clock-square';
const LIBERTIES_HARD_DAILY_PUZZLE_ID = 'liberties-ladder-garden';
const LIBERTIES_PACK_START_ORDINAL = dateKeyToUtcOrdinal(LIBERTIES_PACK_START_DATE);
const LIBERTIES_FORCED_PUZZLE_IDS: Record<LibertiesPlayMode, string> = {
  standard: LIBERTIES_STANDARD_DAILY_PUZZLE_ID,
  hard: LIBERTIES_HARD_DAILY_PUZZLE_ID,
};

interface LibertiesPlayModeGenerationProfile {
  playMode: LibertiesPlayMode;
  dailyPuzzleId: string;
  publicPackLength: number;
  reservePackLength: number;
  generationPoolLength: number;
  publicDifficultyQuotas: Record<LibertiesDifficulty, number>;
  reserveDifficultyQuotas: Record<LibertiesDifficulty, number>;
  publicSizeQuotas: LibertiesSizeQuotas;
  reserveSizeQuotas: LibertiesSizeQuotas;
}

function getLibertiesGenerationProfile(playMode: LibertiesPlayMode): LibertiesPlayModeGenerationProfile {
  if (playMode === 'standard') {
    return {
      playMode: 'standard',
      dailyPuzzleId: LIBERTIES_STANDARD_DAILY_PUZZLE_ID,
      publicPackLength: LIBERTIES_STANDARD_PACK_LENGTH,
      reservePackLength: LIBERTIES_STANDARD_RESERVE_PACK_LENGTH,
      generationPoolLength: LIBERTIES_STANDARD_GENERATION_POOL_LENGTH,
      publicDifficultyQuotas: LIBERTIES_STANDARD_PUBLIC_DIFFICULTY_QUOTAS,
      reserveDifficultyQuotas: LIBERTIES_STANDARD_RESERVE_DIFFICULTY_QUOTAS,
      publicSizeQuotas: LIBERTIES_STANDARD_PUBLIC_SIZE_QUOTAS,
      reserveSizeQuotas: LIBERTIES_STANDARD_RESERVE_SIZE_QUOTAS,
    };
  }
  return {
    playMode: 'hard',
    dailyPuzzleId: LIBERTIES_HARD_DAILY_PUZZLE_ID,
    publicPackLength: LIBERTIES_HARD_PACK_LENGTH,
    reservePackLength: LIBERTIES_HARD_RESERVE_PACK_LENGTH,
    generationPoolLength: LIBERTIES_HARD_GENERATION_POOL_LENGTH,
    publicDifficultyQuotas: LIBERTIES_HARD_PUBLIC_DIFFICULTY_QUOTAS,
    reserveDifficultyQuotas: LIBERTIES_HARD_RESERVE_DIFFICULTY_QUOTAS,
    publicSizeQuotas: LIBERTIES_HARD_PUBLIC_SIZE_QUOTAS,
    reserveSizeQuotas: LIBERTIES_HARD_RESERVE_SIZE_QUOTAS,
  };
}

type LibertiesPointSpec = readonly [number, number];

interface LibertiesGroupSpec {
  stones: readonly LibertiesPointSpec[];
  keys?: readonly LibertiesPointSpec[];
}

interface LibertiesPuzzleSpec {
  id: string;
  title: string;
  difficulty: LibertiesDifficulty;
  variant?: LibertiesVariant;
  size: number;
  motif: string;
  groups: readonly LibertiesGroupSpec[];
  blocks?: readonly LibertiesPointSpec[];
  frozen?: readonly LibertiesPointSpec[];
  releases?: readonly LibertiesReleaseLinkSpec[];
  focusTags?: readonly LibertiesPuzzleTag[];
  terrainArchetypes?: readonly LibertiesTerrainArchetype[];
}

interface LibertiesReleaseLinkSpec {
  point: LibertiesPointSpec;
  group: number;
}

const libertiesBasePuzzleSpecs: LibertiesPuzzleSpec[] = [
  {
    id: 'liberties-garden-gates',
    title: 'Garden Gates',
    difficulty: 'Easy',
    size: 7,
    motif: 'Two light groups introduce empty crossings, locked spots, and one key move.',
    groups: [
      { stones: [[2, 2], [2, 3]], keys: [[1, 2]] },
      { stones: [[5, 4]], keys: [[4, 4]] },
    ],
    blocks: [[4, 1]],
  },
  {
    id: 'liberties-first-lock',
    title: 'First Lock',
    difficulty: 'Easy',
    size: 7,
    motif: 'A compact light group has a key move that only works after nearby points are closed.',
    groups: [
      { stones: [[3, 2], [3, 3]], keys: [[2, 2]] },
      { stones: [[5, 5]], keys: [[5, 4]] },
    ],
  },
  {
    id: 'liberties-corner-market',
    title: 'Corner Market',
    difficulty: 'Easy',
    size: 7,
    motif: 'Edges close some directions for free while the center light still needs a clean finish.',
    groups: [
      { stones: [[1, 1], [1, 2]], keys: [[0, 1]] },
      { stones: [[4, 4]], keys: [[3, 4]] },
    ],
    blocks: [[5, 1]],
  },
  {
    id: 'liberties-side-door',
    title: 'Side Door',
    difficulty: 'Easy',
    size: 7,
    motif: 'A side light and a center pair teach that only direct neighboring points count.',
    groups: [
      { stones: [[2, 1]], keys: [[2, 0]] },
      { stones: [[4, 3], [4, 4]], keys: [[3, 3]] },
    ],
  },
  {
    id: 'liberties-glass-court',
    title: 'Glass Court',
    difficulty: 'Easy',
    size: 7,
    motif: 'Locked corners shape the route around three small light groups.',
    groups: [
      { stones: [[1, 3]], keys: [[0, 3]] },
      { stones: [[3, 1]], keys: [[3, 0]] },
      { stones: [[5, 4]], keys: [[4, 4]] },
    ],
  },
  {
    id: 'liberties-lantern-row',
    title: 'Lantern Row',
    difficulty: 'Easy',
    size: 7,
    motif: 'Two horizontal light groups ask for steady point counting and a final lock.',
    groups: [
      { stones: [[2, 2], [2, 3]], keys: [[1, 3]] },
      { stones: [[5, 2], [5, 3]], keys: [[6, 2]] },
    ],
    blocks: [[3, 5]],
  },
  {
    id: 'liberties-shared-court',
    title: 'Shared Court',
    difficulty: 'Standard',
    size: 7,
    motif: 'Diagonal light pebbles share useful empty crossings while key moves control the finish.',
    groups: [
      { stones: [[2, 2]], keys: [[1, 2]] },
      { stones: [[3, 3]], keys: [[3, 4]] },
      { stones: [[5, 2], [5, 3]], keys: [[6, 3]] },
    ],
  },
  {
    id: 'liberties-frozen-lanes',
    title: 'Frozen Lanes',
    difficulty: 'Standard',
    size: 7,
    motif: 'Locked points make narrow lanes, and key moves must be saved for the end.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[0, 2]] },
      { stones: [[3, 5]], keys: [[2, 5]] },
      { stones: [[5, 2]], keys: [[5, 1]] },
    ],
    blocks: [[3, 1]],
  },
  {
    id: 'liberties-promenade',
    title: 'Promenade',
    difficulty: 'Standard',
    size: 7,
    motif: 'Four light groups share diagonals across the middle promenade.',
    groups: [
      { stones: [[1, 2]], keys: [[0, 2]] },
      { stones: [[2, 4]], keys: [[2, 5]] },
      { stones: [[4, 2]], keys: [[4, 1]] },
      { stones: [[5, 4]], keys: [[6, 4]] },
    ],
  },
  {
    id: 'liberties-market-grid',
    title: 'Market Grid',
    difficulty: 'Standard',
    size: 8,
    motif: 'A wider market board uses set dark pebbles, locked points, and staggered light groups.',
    groups: [
      { stones: [[1, 3], [1, 4]], keys: [[0, 3]] },
      { stones: [[3, 1]], keys: [[3, 0]] },
      { stones: [[4, 5], [5, 5]], keys: [[4, 6]] },
      { stones: [[6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[2, 6], [6, 1]],
  },
  {
    id: 'liberties-hinge-line',
    title: 'Hinge Line',
    difficulty: 'Standard',
    size: 8,
    motif: 'Several groups hinge around shared middle points and key moves.',
    groups: [
      { stones: [[1, 2]], keys: [[0, 2]] },
      { stones: [[2, 3]], keys: [[2, 4]] },
      { stones: [[4, 4], [5, 4]], keys: [[4, 5]] },
      { stones: [[6, 2]], keys: [[7, 2]] },
    ],
  },
  {
    id: 'liberties-canal-turn',
    title: 'Canal Turn',
    difficulty: 'Standard',
    size: 8,
    motif: 'The board bends around a canal of locked points and forces two late clears.',
    groups: [
      { stones: [[1, 1], [1, 2]], keys: [[0, 2]] },
      { stones: [[3, 4]], keys: [[2, 4]] },
      { stones: [[6, 2], [6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[4, 1]],
  },
  {
    id: 'liberties-double-porch',
    title: 'Double Porch',
    difficulty: 'Standard',
    size: 8,
    motif: 'Two porch-shaped light pairs leave key moves on opposite sides.',
    groups: [
      { stones: [[2, 2], [3, 2]], keys: [[2, 1]] },
      { stones: [[2, 5], [3, 5]], keys: [[3, 6]] },
      { stones: [[6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[5, 6]],
  },
  {
    id: 'liberties-tile-yard',
    title: 'Tile Yard',
    difficulty: 'Standard',
    size: 8,
    motif: 'The light groups are small, but shared diagonals make the efficient route tighter.',
    groups: [
      { stones: [[1, 4]], keys: [[0, 4]] },
      { stones: [[2, 2]], keys: [[2, 1]] },
      { stones: [[4, 3], [4, 4]], keys: [[3, 3]] },
      { stones: [[6, 6]], keys: [[6, 7]] },
    ],
  },
  {
    id: 'liberties-south-arcade',
    title: 'South Arcade',
    difficulty: 'Standard',
    size: 8,
    motif: 'A lower arcade of light groups rewards spotting shared empty crossings.',
    groups: [
      { stones: [[1, 2]], keys: [[0, 2]] },
      { stones: [[3, 5]], keys: [[2, 5]] },
      { stones: [[5, 2], [6, 2]], keys: [[5, 1]] },
      { stones: [[6, 5]], keys: [[7, 5]] },
    ],
    blocks: [[3, 1]],
  },
  {
    id: 'liberties-cross-traffic',
    title: 'Cross Traffic',
    difficulty: 'Hard',
    size: 8,
    motif: 'Four light groups cross the middle with several key moves and shared empty crossings.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[0, 2]] },
      { stones: [[2, 5]], keys: [[2, 6]] },
      { stones: [[4, 2], [5, 2]], keys: [[4, 1]] },
      { stones: [[6, 5]], keys: [[7, 5]] },
    ],
    blocks: [[3, 4]],
  },
  {
    id: 'liberties-harbor-lock',
    title: 'Harbor Lock',
    difficulty: 'Hard',
    size: 8,
    motif: 'A central lock and two edge groups make the final moves matter.',
    groups: [
      { stones: [[1, 1], [1, 2]], keys: [[0, 1]] },
      { stones: [[3, 3], [3, 4], [4, 3], [4, 4]], keys: [[2, 3], [4, 5]] },
      { stones: [[6, 2], [6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[1, 5], [5, 1]],
  },
  {
    id: 'liberties-city-block',
    title: 'City Points',
    difficulty: 'Hard',
    size: 8,
    motif: 'Four small light groups wrap around locked corners and set dark pebbles.',
    groups: [
      { stones: [[1, 1], [1, 2]], keys: [[0, 2]] },
      { stones: [[2, 5], [3, 5]], keys: [[2, 6]] },
      { stones: [[5, 1], [6, 1]], keys: [[5, 0]] },
      { stones: [[5, 5], [5, 6]], keys: [[6, 6]] },
    ],
    blocks: [[3, 2], [4, 6]],
  },
  {
    id: 'liberties-switchback',
    title: 'Switchback',
    difficulty: 'Hard',
    size: 8,
    motif: 'A switchback of light groups makes the player preserve several key moves.',
    groups: [
      { stones: [[1, 4]], keys: [[0, 4]] },
      { stones: [[2, 2], [3, 2]], keys: [[2, 1]] },
      { stones: [[4, 5], [5, 5]], keys: [[5, 6]] },
      { stones: [[6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[3, 6]],
  },
  {
    id: 'liberties-shutter-row',
    title: 'Shutter Row',
    difficulty: 'Hard',
    size: 8,
    motif: 'Two rows of light pebbles share the middle while key moves shut the corners.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[0, 3]] },
      { stones: [[1, 5]], keys: [[1, 6]] },
      { stones: [[5, 2]], keys: [[5, 1]] },
      { stones: [[6, 4], [6, 5]], keys: [[7, 5]] },
    ],
  },
  {
    id: 'liberties-rail-yard',
    title: 'Rail Yard',
    difficulty: 'Hard',
    size: 8,
    motif: 'Set dark pebbles split the rail yard into multiple late-finish light groups.',
    groups: [
      { stones: [[1, 1]], keys: [[1, 0]] },
      { stones: [[2, 4], [2, 5]], keys: [[1, 5]] },
      { stones: [[5, 2], [5, 3]], keys: [[6, 3]] },
      { stones: [[6, 6]], keys: [[6, 7]] },
    ],
    blocks: [[3, 1], [4, 6]],
  },
  {
    id: 'liberties-mosaic-hall',
    title: 'Mosaic Hall',
    difficulty: 'Hard',
    size: 8,
    motif: 'A dense hall of small groups makes shared points and final keys both matter.',
    groups: [
      { stones: [[1, 3]], keys: [[0, 3]] },
      { stones: [[2, 1], [3, 1]], keys: [[2, 0]] },
      { stones: [[3, 5]], keys: [[3, 6]] },
      { stones: [[5, 3], [5, 4]], keys: [[6, 4]] },
      { stones: [[6, 6]], keys: [[7, 6]] },
    ],
  },
  {
    id: 'liberties-north-steps',
    title: 'North Steps',
    difficulty: 'Hard',
    size: 8,
    motif: 'A stepped north wall compresses several light groups into a tight route.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[0, 2]] },
      { stones: [[2, 5]], keys: [[1, 5]] },
      { stones: [[4, 2]], keys: [[4, 1]] },
      { stones: [[5, 4], [6, 4]], keys: [[5, 5]] },
    ],
    blocks: [[6, 1]],
  },
  {
    id: 'liberties-river-stones',
    title: 'River Stones',
    difficulty: 'Hard',
    size: 8,
    motif: 'The river shape asks for a clean route through shared side points.',
    groups: [
      { stones: [[1, 1], [2, 1]], keys: [[1, 0]] },
      { stones: [[2, 4]], keys: [[1, 4]] },
      { stones: [[4, 3], [4, 4]], keys: [[5, 4]] },
      { stones: [[6, 6]], keys: [[6, 7]] },
    ],
    blocks: [[5, 1]],
  },
  {
    id: 'liberties-courtyard-lock',
    title: 'Courtyard Lock',
    difficulty: 'Hard',
    size: 8,
    motif: 'The courtyard has a large light group whose last two moves must be timed.',
    groups: [
      { stones: [[2, 2], [2, 3], [3, 2], [3, 3]], keys: [[1, 2], [3, 4]] },
      { stones: [[5, 5], [6, 5]], keys: [[6, 6]] },
      { stones: [[6, 2]], keys: [[7, 2]] },
    ],
    blocks: [[1, 6]],
  },
  {
    id: 'liberties-warehouse',
    title: 'Warehouse',
    difficulty: 'Hard',
    size: 8,
    motif: 'A warehouse floor mixes single light pebbles, pairs, and set dark pebbles.',
    groups: [
      { stones: [[1, 4]], keys: [[0, 4]] },
      { stones: [[2, 1], [2, 2]], keys: [[1, 1]] },
      { stones: [[4, 5], [5, 5]], keys: [[4, 6]] },
      { stones: [[6, 2], [6, 3]], keys: [[7, 3]] },
    ],
    blocks: [[4, 1], [1, 6]],
  },
  {
    id: 'liberties-arc-light',
    title: 'Arc Light',
    difficulty: 'Hard',
    size: 8,
    motif: 'An arc of light groups gives several tempting but premature key moves.',
    groups: [
      { stones: [[1, 2]], keys: [[0, 2]] },
      { stones: [[2, 5], [3, 5]], keys: [[2, 6]] },
      { stones: [[5, 4], [5, 5]], keys: [[6, 5]] },
      { stones: [[6, 1]], keys: [[6, 0]] },
    ],
  },
  {
    id: 'liberties-copper-lane',
    title: 'Copper Lane',
    difficulty: 'Hard',
    size: 8,
    motif: 'Copper Lane layers five groups along a narrow diagonal route.',
    groups: [
      { stones: [[1, 1]], keys: [[1, 0]] },
      { stones: [[1, 4], [1, 5]], keys: [[0, 4]] },
      { stones: [[3, 3]], keys: [[2, 3]] },
      { stones: [[5, 2], [6, 2]], keys: [[5, 1]] },
      { stones: [[6, 5]], keys: [[7, 5]] },
    ],
    blocks: [[3, 6]],
  },
  {
    id: 'liberties-foundry',
    title: 'Foundry',
    difficulty: 'Hard',
    size: 8,
    motif: 'A foundry grid with set dark pebbles forces clean reading around multiple final keys.',
    groups: [
      { stones: [[1, 3], [2, 3]], keys: [[1, 2]] },
      { stones: [[2, 6]], keys: [[2, 7]] },
      { stones: [[4, 1]], keys: [[4, 0]] },
      { stones: [[5, 4], [5, 5]], keys: [[6, 5]] },
      { stones: [[6, 2]], keys: [[7, 2]] },
    ],
    blocks: [[1, 6], [4, 6]],
  },
  {
    id: 'liberties-ladder-garden',
    title: 'Ladder Garden',
    difficulty: 'Hard',
    size: 9,
    motif: 'A strategic net where most good moves close two groups or prepare a release chain.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[1, 4]] },
      { stones: [[1, 5], [2, 5]], keys: [[1, 4]] },
      { stones: [[3, 2], [4, 2]], keys: [[2, 2]] },
      { stones: [[4, 4], [4, 5]], keys: [[4, 3]] },
      { stones: [[6, 3], [6, 4]], keys: [[5, 4]] },
      { stones: [[6, 6], [7, 6]], keys: [[6, 5]] },
    ],
    blocks: [[0, 2], [0, 3], [0, 5], [2, 6], [3, 1], [4, 7], [5, 2], [7, 3], [7, 4], [8, 6]],
  },
  {
    id: 'liberties-clock-square',
    title: 'Clock Points',
    difficulty: 'Standard',
    size: 8,
    motif: 'Clock Points closes the launch pack with a dense, many-group timing puzzle.',
    groups: [
      { stones: [[1, 2], [1, 3]], keys: [[0, 3]] },
      { stones: [[2, 5]], keys: [[1, 5]] },
      { stones: [[4, 2], [5, 2]], keys: [[4, 1]] },
      { stones: [[5, 5], [5, 6]], keys: [[6, 6]] },
      { stones: [[6, 4]], keys: [[7, 4]] },
    ],
    blocks: [[3, 3]],
  },
];

type LibertiesTransformId =
  | 'turn-right'
  | 'turn-around'
  | 'turn-left'
  | 'mirror-wide'
  | 'mirror-tall'
  | 'swap-diagonal'
  | 'swap-anti-diagonal';

interface LibertiesTransform {
  id: LibertiesTransformId;
  title: string;
  point: (point: LibertiesPointSpec, size: number) => LibertiesPointSpec;
}

const LIBERTIES_TRANSFORMS: readonly LibertiesTransform[] = [
  {
    id: 'turn-right',
    title: 'Right Turn',
    point: ([row, col], size) => [col, size - 1 - row],
  },
  {
    id: 'turn-around',
    title: 'Turnabout',
    point: ([row, col], size) => [size - 1 - row, size - 1 - col],
  },
  {
    id: 'turn-left',
    title: 'Left Turn',
    point: ([row, col], size) => [size - 1 - col, row],
  },
  {
    id: 'mirror-wide',
    title: 'Wide Mirror',
    point: ([row, col], size) => [row, size - 1 - col],
  },
  {
    id: 'mirror-tall',
    title: 'Tall Mirror',
    point: ([row, col], size) => [size - 1 - row, col],
  },
  {
    id: 'swap-diagonal',
    title: 'Diagonal Shift',
    point: ([row, col]) => [col, row],
  },
  {
    id: 'swap-anti-diagonal',
    title: 'Counter Shift',
    point: ([row, col], size) => [size - 1 - col, size - 1 - row],
  },
];

const LIBERTIES_VARIANT_NAMES = [
  'North Window',
  'East Window',
  'South Window',
  'West Window',
  'Upper Court',
  'Lower Court',
  'Inner Court',
  'Outer Court',
  'Glass Wing',
  'Stone Wing',
  'River Wing',
  'Market Wing',
  'Dawn Side',
  'Dusk Side',
  'Canal Side',
  'Harbor Side',
] as const;

function translatePoint(point: LibertiesPointSpec, rowOffset: number, colOffset: number): LibertiesPointSpec {
  return [point[0] + rowOffset, point[1] + colOffset];
}

function transformPointSpec(
  point: LibertiesPointSpec,
  sourceSize: number,
  transform: LibertiesTransform,
  rowOffset: number,
  colOffset: number
): LibertiesPointSpec {
  return translatePoint(transform.point(point, sourceSize), rowOffset, colOffset);
}

function transformPointList(
  points: readonly LibertiesPointSpec[] | undefined,
  sourceSize: number,
  transform: LibertiesTransform,
  rowOffset: number,
  colOffset: number
): LibertiesPointSpec[] | undefined {
  return points?.map((point) => transformPointSpec(point, sourceSize, transform, rowOffset, colOffset));
}

function transformReleaseList(
  releases: readonly LibertiesReleaseLinkSpec[] | undefined,
  sourceSize: number,
  transform: LibertiesTransform,
  rowOffset: number,
  colOffset: number
): LibertiesReleaseLinkSpec[] | undefined {
  return releases?.map((release) => ({
    point: transformPointSpec(release.point, sourceSize, transform, rowOffset, colOffset),
    group: release.group,
  }));
}

function variantMotif(base: LibertiesPuzzleSpec, newSize: number): string {
  const scaleNote = newSize > base.size ? ' on a roomier board' : '';
  return `${base.motif.replace(/\.$/, '')}${scaleNote}.`;
}

function makeLibertiesVariantSpec(
  base: LibertiesPuzzleSpec,
  transform: LibertiesTransform,
  sizeDelta: number,
  rowOffset: number,
  colOffset: number,
  variantIndex: number
): LibertiesPuzzleSpec {
  const newSize = base.size + sizeDelta;
  const variantName = LIBERTIES_VARIANT_NAMES[variantIndex % LIBERTIES_VARIANT_NAMES.length]!;

  return {
    id: `${base.id}-${transform.id}-${sizeDelta}-${rowOffset}-${colOffset}`,
    title: `${base.title}: ${variantName}`,
    difficulty: base.difficulty,
    variant: base.variant,
    size: newSize,
    motif: variantMotif(base, newSize),
    focusTags: base.focusTags,
    terrainArchetypes: base.terrainArchetypes,
    groups: base.groups.map((group) => ({
      stones: transformPointList(group.stones, base.size, transform, rowOffset, colOffset)!,
      keys: transformPointList(group.keys, base.size, transform, rowOffset, colOffset),
    })),
    blocks: transformPointList(base.blocks, base.size, transform, rowOffset, colOffset),
    frozen: transformPointList(base.frozen, base.size, transform, rowOffset, colOffset),
    releases: transformReleaseList(base.releases, base.size, transform, rowOffset, colOffset),
  };
}

interface ScoredLibertiesCandidate {
  spec: LibertiesPuzzleSpec;
  puzzle: LibertiesPuzzle;
  audit: LibertiesPuzzleAudit;
  score: number;
  ordinal: number;
}

const LIBERTIES_STANDARD_PUBLIC_DIFFICULTY_QUOTAS: Record<LibertiesDifficulty, number> = {
  Easy: 45,
  Standard: 200,
  Hard: 120,
};

const LIBERTIES_STANDARD_RESERVE_DIFFICULTY_QUOTAS: Record<LibertiesDifficulty, number> = {
  Easy: 8,
  Standard: 42,
  Hard: 22,
};

const LIBERTIES_HARD_PUBLIC_DIFFICULTY_QUOTAS: Record<LibertiesDifficulty, number> = {
  Easy: 0,
  Standard: 0,
  Hard: 365,
};

const LIBERTIES_HARD_RESERVE_DIFFICULTY_QUOTAS: Record<LibertiesDifficulty, number> = {
  Easy: 0,
  Standard: 0,
  Hard: 72,
};

type LibertiesSizeQuotas = Record<LibertiesDifficulty, Record<number, number>>;

const LIBERTIES_STANDARD_PUBLIC_SIZE_QUOTAS: LibertiesSizeQuotas = {
  Easy: { 7: 36, 8: 9 },
  Standard: { 8: 90, 9: 110 },
  Hard: { 9: 108, 10: 12 },
};

const LIBERTIES_STANDARD_RESERVE_SIZE_QUOTAS: LibertiesSizeQuotas = {
  Easy: { 7: 6, 8: 2 },
  Standard: { 8: 21, 9: 21 },
  Hard: { 9: 18, 10: 4 },
};

const LIBERTIES_HARD_PUBLIC_SIZE_QUOTAS: LibertiesSizeQuotas = {
  Easy: {},
  Standard: {},
  Hard: { 9: 240, 10: 125 },
};

const LIBERTIES_HARD_RESERVE_SIZE_QUOTAS: LibertiesSizeQuotas = {
  Easy: {},
  Standard: {},
  Hard: { 9: 48, 10: 24 },
};

const LIBERTIES_TERRAIN_ARCHETYPE_LABELS: Record<LibertiesTerrainArchetype, string> = {
  'corner-pocket': 'Corner pocket',
  'tight-room': 'Tight room',
  'soft-net': 'Soft net',
  'chase-lane': 'Chase lane',
  'lane-stopper': 'Lane stopper',
  'split-gate': 'Split gate',
  'tempo-pocket': 'Tempo pocket',
  'fake-room': 'Fake room',
  bridge: 'Bridge',
  squeeze: 'Squeeze',
  'shared-throat': 'Shared throat',
  'backdoor-lane': 'Backdoor lane',
};

interface LibertiesTerrainTemplate {
  id: string;
  archetypes: readonly LibertiesTerrainArchetype[];
  difficulty: readonly LibertiesDifficulty[];
  pressure: number;
}

interface LibertiesGenerationTuning {
  id: string;
  blockerBias: number;
  smallBoardBias: number;
  pressureBias: number;
}

export interface LibertiesGenerationReport {
  tuningId: string;
  candidateCount: number;
  iterationCount: number;
}

export interface LibertiesPackGenerationResult {
  publicPuzzles: LibertiesPuzzle[];
  reservePuzzles: LibertiesPuzzle[];
  allPuzzles: LibertiesPuzzle[];
  report: LibertiesGenerationReport;
}

export interface LibertiesPackGenerationOptions {
  excludedPublicLayouts?: Set<string>;
  excludedPublicIds?: Set<string>;
}

const LIBERTIES_TERRAIN_TEMPLATES: readonly LibertiesTerrainTemplate[] = [
  {
    id: 'corner-pocket',
    archetypes: ['corner-pocket', 'tight-room'],
    difficulty: ['Easy', 'Standard'],
    pressure: 0,
  },
  {
    id: 'tight-room',
    archetypes: ['tight-room', 'tempo-pocket'],
    difficulty: ['Easy', 'Standard', 'Hard'],
    pressure: 1,
  },
  {
    id: 'soft-net',
    archetypes: ['soft-net', 'split-gate'],
    difficulty: ['Standard', 'Hard'],
    pressure: 1,
  },
  {
    id: 'chase-lane',
    archetypes: ['chase-lane', 'lane-stopper'],
    difficulty: ['Standard', 'Hard'],
    pressure: 2,
  },
  {
    id: 'tempo-pocket',
    archetypes: ['tempo-pocket', 'tight-room'],
    difficulty: ['Standard', 'Hard'],
    pressure: 2,
  },
  {
    id: 'fake-room',
    archetypes: ['fake-room', 'soft-net'],
    difficulty: ['Hard'],
    pressure: 3,
  },
  {
    id: 'bridge-chain',
    archetypes: ['bridge', 'fake-room'],
    difficulty: ['Hard'],
    pressure: 3,
  },
  {
    id: 'squeeze-net',
    archetypes: ['squeeze', 'soft-net', 'chase-lane'],
    difficulty: ['Hard'],
    pressure: 3,
  },
  {
    id: 'shared-throat',
    archetypes: ['shared-throat', 'split-gate', 'tempo-pocket'],
    difficulty: ['Standard', 'Hard'],
    pressure: 2,
  },
  {
    id: 'backdoor-lane',
    archetypes: ['backdoor-lane', 'chase-lane', 'lane-stopper'],
    difficulty: ['Standard', 'Hard'],
    pressure: 2,
  },
  {
    id: 'split-gate',
    archetypes: ['split-gate', 'lane-stopper'],
    difficulty: ['Standard', 'Hard'],
    pressure: 2,
  },
  {
    id: 'full-net',
    archetypes: ['soft-net', 'fake-room', 'tempo-pocket'],
    difficulty: ['Hard'],
    pressure: 3,
  },
];

const LIBERTIES_GENERATION_TUNINGS: readonly LibertiesGenerationTuning[] = [
  { id: 'small-terrain-balanced', blockerBias: 0, smallBoardBias: 20, pressureBias: 0 },
  { id: 'denser-standard-terrain', blockerBias: 1, smallBoardBias: 16, pressureBias: 1 },
  { id: 'lower-friction-terrain', blockerBias: -1, smallBoardBias: 22, pressureBias: -1 },
  { id: 'high-impact-terrain', blockerBias: 1, smallBoardBias: 18, pressureBias: 2 },
];

function getDefaultLibertiesVariant(difficulty: LibertiesDifficulty): LibertiesVariant {
  return 'chase';
}

function isChaseLikeLibertiesVariant(variant: LibertiesVariant): boolean {
  return variant === 'chase' || variant === 'responsive-lights' || variant === 'capture-race';
}

function estimateLibertiesVariantByPuzzleMomentum(
  difficulty: LibertiesDifficulty,
  responseEventCount: number,
  dynamicMoveCount: number,
  captureOrderDependencyScore: number,
  raceResponseCount: number
): LibertiesVariant {
  if (difficulty === 'Hard' && (responseEventCount >= 3 || raceResponseCount >= 2 || captureOrderDependencyScore >= 12)) {
    return 'capture-race';
  }
  if (responseEventCount >= 3 || dynamicMoveCount >= 2) {
    return 'responsive-lights';
  }
  return getDefaultLibertiesVariant(difficulty);
}

export function getLibertiesBlockerRange(difficulty: LibertiesDifficulty): [number, number] {
  if (difficulty === 'Hard') return [5, 12];
  if (difficulty === 'Standard') return [4, 7];
  return [2, 4];
}

function isGeneratedSizeAllowed(difficulty: LibertiesDifficulty, size: number): boolean {
  if (difficulty === 'Easy') return size >= 7 && size <= 8;
  if (difficulty === 'Standard') return size >= 8 && size <= 9;
  return size >= 9 && size <= 10;
}

function getPreferredSizeScore(difficulty: LibertiesDifficulty, size: number): number {
  if (difficulty === 'Easy') return size === 7 ? 34 : size === 8 ? 28 : -80;
  if (difficulty === 'Standard') return size === 8 ? 36 : size === 9 ? 31 : -90;
  return size === 9 ? 34 : size === 10 ? 28 : -100;
}

function pointSpecKey(point: LibertiesPointSpec): string {
  return `${point[0]}:${point[1]}`;
}

function uniquePointSpecs(points: readonly LibertiesPointSpec[]): LibertiesPointSpec[] {
  const unique = new Map<string, LibertiesPointSpec>();
  points.forEach((point) => {
    unique.set(pointSpecKey(point), point);
  });
  return Array.from(unique.values()).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function uniqueTerrainArchetypes(
  archetypes: readonly LibertiesTerrainArchetype[]
): LibertiesTerrainArchetype[] {
  return Array.from(new Set(archetypes));
}

function countLayoutCell(layout: readonly string[], cell: string): number {
  return layout.reduce((total, row) => total + row.split('').filter((entry) => entry === cell).length, 0);
}

function stableLibertiesHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getProtectedTerrainKeys(spec: LibertiesPuzzleSpec): Set<string> {
  const protectedKeys = new Set<string>();
  spec.groups.forEach((group) => {
    group.stones.forEach((point) => protectedKeys.add(pointSpecKey(point)));
    group.keys?.forEach((point) => protectedKeys.add(pointSpecKey(point)));
  });
  spec.blocks?.forEach((point) => protectedKeys.add(pointSpecKey(point)));
  spec.frozen?.forEach((point) => protectedKeys.add(pointSpecKey(point)));
  spec.releases?.forEach((release) => protectedKeys.add(pointSpecKey(release.point)));
  return protectedKeys;
}

function isPointSpecOnBoard(point: LibertiesPointSpec, size: number): boolean {
  return point[0] >= 0 && point[0] < size && point[1] >= 0 && point[1] < size;
}

function getPointSpecNeighbors(point: LibertiesPointSpec, size: number): LibertiesPointSpec[] {
  const candidates: LibertiesPointSpec[] = [
    [point[0] - 1, point[1]],
    [point[0] + 1, point[1]],
    [point[0], point[1] - 1],
    [point[0], point[1] + 1],
  ];
  return candidates.filter((candidate) => isPointSpecOnBoard(candidate, size));
}

function addTerrainCandidate(
  candidates: LibertiesPointSpec[],
  spec: LibertiesPuzzleSpec,
  protectedKeys: Set<string>,
  point: LibertiesPointSpec
): void {
  if (!isPointSpecOnBoard(point, spec.size)) return;
  if (protectedKeys.has(pointSpecKey(point))) return;
  candidates.push(point);
}

function getNearestSpecLightDistance(spec: LibertiesPuzzleSpec, point: LibertiesPointSpec): number {
  return spec.groups.reduce((best, group) => {
    const groupBest = group.stones.reduce(
      (distance, stone) => Math.min(distance, Math.abs(point[0] - stone[0]) + Math.abs(point[1] - stone[1])),
      Number.POSITIVE_INFINITY
    );
    return Math.min(best, groupBest);
  }, Number.POSITIVE_INFINITY);
}

function getTerrainCandidatesForArchetype(
  spec: LibertiesPuzzleSpec,
  archetype: LibertiesTerrainArchetype
): LibertiesPointSpec[] {
  const candidates: LibertiesPointSpec[] = [];
  const protectedKeys = getProtectedTerrainKeys(spec);

  spec.groups.forEach((group, groupIndex) => {
    const keys = group.keys ?? [];

    if (archetype === 'tight-room' || archetype === 'tempo-pocket') {
      group.stones.forEach((stone) => {
        getPointSpecNeighbors(stone, spec.size).forEach((neighbor) => {
          addTerrainCandidate(candidates, spec, protectedKeys, neighbor);
        });
      });
    }

    if (archetype === 'corner-pocket') {
      group.stones.forEach((stone) => {
        const rowEdge = stone[0] <= 2 ? 0 : stone[0] >= spec.size - 3 ? spec.size - 1 : null;
        const colEdge = stone[1] <= 2 ? 0 : stone[1] >= spec.size - 3 ? spec.size - 1 : null;
        if (rowEdge !== null) {
          addTerrainCandidate(candidates, spec, protectedKeys, [rowEdge, stone[1]]);
          addTerrainCandidate(candidates, spec, protectedKeys, [rowEdge, Math.max(0, stone[1] - 1)]);
          addTerrainCandidate(candidates, spec, protectedKeys, [rowEdge, Math.min(spec.size - 1, stone[1] + 1)]);
        }
        if (colEdge !== null) {
          addTerrainCandidate(candidates, spec, protectedKeys, [stone[0], colEdge]);
          addTerrainCandidate(candidates, spec, protectedKeys, [Math.max(0, stone[0] - 1), colEdge]);
          addTerrainCandidate(candidates, spec, protectedKeys, [Math.min(spec.size - 1, stone[0] + 1), colEdge]);
        }
      });
    }

    if (archetype === 'soft-net' || archetype === 'fake-room') {
      group.stones.forEach(([row, col]) => {
        const diagonalAndLanePoints: LibertiesPointSpec[] = [
          [row - 1, col - 1],
          [row - 1, col + 1],
          [row + 1, col - 1],
          [row + 1, col + 1],
          [row - 2, col],
          [row + 2, col],
          [row, col - 2],
          [row, col + 2],
        ];
        diagonalAndLanePoints.forEach((point) => addTerrainCandidate(candidates, spec, protectedKeys, point));
      });
    }

    if (archetype === 'chase-lane' || archetype === 'lane-stopper' || archetype === 'fake-room') {
      keys.forEach((key) => {
        const touchingStone = group.stones.find(
          (stone) => Math.abs(stone[0] - key[0]) + Math.abs(stone[1] - key[1]) === 1
        );
        if (!touchingStone) return;
        const rowDelta = key[0] - touchingStone[0];
        const colDelta = key[1] - touchingStone[1];
        const firstDistance = archetype === 'lane-stopper' ? 2 : 1;
        const lastDistance = archetype === 'fake-room' ? 3 : 4;
        for (let distance = firstDistance; distance <= lastDistance; distance += 1) {
          addTerrainCandidate(candidates, spec, protectedKeys, [
            key[0] + rowDelta * distance,
            key[1] + colDelta * distance,
          ]);
        }
        addTerrainCandidate(candidates, spec, protectedKeys, [key[0] + colDelta, key[1] + rowDelta]);
        addTerrainCandidate(candidates, spec, protectedKeys, [key[0] - colDelta, key[1] - rowDelta]);
      });
    }

    if (archetype === 'split-gate' || archetype === 'shared-throat') {
      spec.groups.slice(groupIndex + 1).forEach((otherGroup) => {
        group.stones.forEach((stone) => {
          otherGroup.stones.forEach((otherStone) => {
            const rowDistance = otherStone[0] - stone[0];
            const colDistance = otherStone[1] - stone[1];
            if (Math.abs(rowDistance) + Math.abs(colDistance) !== 2) return;
            const gate: LibertiesPointSpec = [stone[0] + Math.sign(rowDistance), stone[1] + Math.sign(colDistance)];
            addTerrainCandidate(candidates, spec, protectedKeys, [gate[0] - 1, gate[1]]);
            addTerrainCandidate(candidates, spec, protectedKeys, [gate[0] + 1, gate[1]]);
            addTerrainCandidate(candidates, spec, protectedKeys, [gate[0], gate[1] - 1]);
            addTerrainCandidate(candidates, spec, protectedKeys, [gate[0], gate[1] + 1]);
            if (archetype === 'shared-throat') {
              addTerrainCandidate(candidates, spec, protectedKeys, [gate[0] - Math.sign(colDistance), gate[1] - Math.sign(rowDistance)]);
              addTerrainCandidate(candidates, spec, protectedKeys, [gate[0] + Math.sign(colDistance), gate[1] + Math.sign(rowDistance)]);
            }
          });
        });
      });
    }

    if (archetype === 'bridge') {
      keys.forEach((key) => {
        const keyRow = key[0];
        const keyCol = key[1];
        group.stones.forEach((stone) => {
          const rowDelta = stone[0] - keyRow;
          const colDelta = stone[1] - keyCol;
          if (rowDelta === 0 && colDelta === 0) return;
          const rowStep = Math.sign(rowDelta) || 1;
          const colStep = Math.sign(colDelta) || 1;
          addTerrainCandidate(candidates, spec, protectedKeys, [keyRow + rowStep, keyCol + colStep]);
          addTerrainCandidate(candidates, spec, protectedKeys, [keyRow + rowStep * 2, keyCol + colStep * 2]);
          addTerrainCandidate(candidates, spec, protectedKeys, [keyRow - colStep, keyCol + rowStep]);
          addTerrainCandidate(candidates, spec, protectedKeys, [keyRow + colStep, keyCol - rowStep]);
        });
      });
    }

    if (archetype === 'squeeze') {
      spec.groups.slice(groupIndex + 1).forEach((otherGroup) => {
        group.stones.forEach((stone) => {
          otherGroup.stones.forEach((otherStone) => {
            const sameRow = stone[0] === otherStone[0];
            const sameCol = stone[1] === otherStone[1];
            if (!sameRow && !sameCol) return;
            if (sameRow && Math.abs(stone[1] - otherStone[1]) === 2) {
              const row = stone[0];
              const minCol = Math.min(stone[1], otherStone[1]);
              const midCol = minCol + 1;
              addTerrainCandidate(candidates, spec, protectedKeys, [row, minCol - 1]);
              addTerrainCandidate(candidates, spec, protectedKeys, [row, midCol]);
              addTerrainCandidate(candidates, spec, protectedKeys, [row, midCol + 1]);
            }
            if (sameCol && Math.abs(stone[0] - otherStone[0]) === 2) {
              const col = stone[1];
              const minRow = Math.min(stone[0], otherStone[0]);
              const midRow = minRow + 1;
              addTerrainCandidate(candidates, spec, protectedKeys, [minRow - 1, col]);
              addTerrainCandidate(candidates, spec, protectedKeys, [midRow, col]);
              addTerrainCandidate(candidates, spec, protectedKeys, [midRow + 1, col]);
            }
          });
        });
      });
    }

    if (archetype === 'backdoor-lane') {
      keys.forEach((key) => {
        getPointSpecNeighbors(key, spec.size).forEach((neighbor) => {
          const exits = getPointSpecNeighbors(neighbor, spec.size).filter((exit) => {
            if (pointSpecKey(exit) === pointSpecKey(key)) return false;
            return getNearestSpecLightDistance(spec, exit) <= 3;
          });
          exits.forEach((exit) => addTerrainCandidate(candidates, spec, protectedKeys, exit));
        });
      });
    }
  });

  return uniquePointSpecs(candidates);
}

function getFallbackTerrainCandidates(spec: LibertiesPuzzleSpec): LibertiesPointSpec[] {
  const protectedKeys = getProtectedTerrainKeys(spec);
  const candidates: LibertiesPointSpec[] = [];

  for (let row = 0; row < spec.size; row += 1) {
    for (let col = 0; col < spec.size; col += 1) {
      const point: LibertiesPointSpec = [row, col];
      if (protectedKeys.has(pointSpecKey(point))) continue;
      if (getNearestSpecLightDistance(spec, point) > 3) continue;
      candidates.push(point);
    }
  }

  return candidates;
}

function sortTerrainCandidates(
  spec: LibertiesPuzzleSpec,
  candidates: readonly LibertiesPointSpec[],
  seed: string,
  pressure: number
): LibertiesPointSpec[] {
  return uniquePointSpecs(candidates).sort((a, b) => {
    const distanceA = getNearestSpecLightDistance(spec, a);
    const distanceB = getNearestSpecLightDistance(spec, b);
    const distanceScoreA = pressure > 1 ? Math.abs(distanceA - 2) : distanceA;
    const distanceScoreB = pressure > 1 ? Math.abs(distanceB - 2) : distanceB;
    return (
      distanceScoreA - distanceScoreB ||
      (stableLibertiesHash(`${seed}:${pointSpecKey(a)}`) % 17) -
        (stableLibertiesHash(`${seed}:${pointSpecKey(b)}`) % 17) ||
      a[0] - b[0] ||
      a[1] - b[1]
    );
  });
}

function getTerrainTargetBlockerCount(
  spec: LibertiesPuzzleSpec,
  template: LibertiesTerrainTemplate,
  tuning: LibertiesGenerationTuning,
  ordinal: number
): number {
  const [min, max] = getLibertiesBlockerRange(spec.difficulty);
  const span = max - min + 1;
  const pressure = Math.max(0, template.pressure + tuning.blockerBias + tuning.pressureBias);
  return Math.max(min, Math.min(max, min + ((ordinal + pressure) % span)));
}

function applyTerrainTemplate(
  base: LibertiesPuzzleSpec,
  template: LibertiesTerrainTemplate,
  tuning: LibertiesGenerationTuning,
  ordinal: number,
  keepOriginalId: boolean
): LibertiesPuzzleSpec {
  const selectedFrozen = uniquePointSpecs(base.frozen ?? []);
  const targetBlockerCount = getTerrainTargetBlockerCount(base, template, tuning, ordinal);
  const candidates = sortTerrainCandidates(
    base,
    [
      ...template.archetypes.flatMap((archetype) => getTerrainCandidatesForArchetype(base, archetype)),
      ...getFallbackTerrainCandidates(base),
    ],
    `${base.id}:${template.id}:${ordinal}:${tuning.id}`,
    template.pressure + tuning.pressureBias
  );
  const selectedKeys = new Set(selectedFrozen.map(pointSpecKey));

  for (const candidate of candidates) {
    const currentLayout = makeLibertiesLayout({ ...base, frozen: selectedFrozen }, []);
    if (countLayoutCell(currentLayout, 'X') >= targetBlockerCount) break;
    const key = pointSpecKey(candidate);
    if (selectedKeys.has(key)) continue;
    selectedKeys.add(key);
    selectedFrozen.push(candidate);
  }

  return {
    ...base,
    id: keepOriginalId ? base.id : `${base.id}-${template.id}-${ordinal}`,
    title: keepOriginalId ? base.title : `${base.title}: ${LIBERTIES_TERRAIN_ARCHETYPE_LABELS[template.archetypes[0]!]}`,
    motif: `${base.motif.replace(/\.$/, '')} with ${LIBERTIES_TERRAIN_ARCHETYPE_LABELS[
      template.archetypes[0]!
    ].toLowerCase()} terrain.`,
    frozen: uniquePointSpecs(selectedFrozen),
    terrainArchetypes: uniqueTerrainArchetypes([...(base.terrainArchetypes ?? []), ...template.archetypes]),
  };
}

function getTemplatesForDifficulty(difficulty: LibertiesDifficulty): LibertiesTerrainTemplate[] {
  return LIBERTIES_TERRAIN_TEMPLATES.filter((template) => template.difficulty.includes(difficulty));
}

function getDefaultTerrainTemplate(base: LibertiesPuzzleSpec, index: number): LibertiesTerrainTemplate {
  const templates = getTemplatesForDifficulty(base.difficulty);
  return templates[index % templates.length] ?? LIBERTIES_TERRAIN_TEMPLATES[0]!;
}

function getGenerationSizeDeltas(spec: LibertiesPuzzleSpec): number[] {
  if (spec.difficulty === 'Easy') return spec.size <= 7 ? [0, 1] : [0];
  if (spec.difficulty === 'Standard') return spec.size <= 7 ? [1, 2] : [0, 1];
  return spec.size <= 9 ? [0, 1] : [0];
}

function getGenerationOffsets(sizeDelta: number): Array<readonly [number, number]> {
  if (sizeDelta <= 0) return [[0, 0]];
  return [
    [0, 0],
    [sizeDelta, 0],
    [0, sizeDelta],
    [sizeDelta, sizeDelta],
  ];
}

function getGenerationTransforms(): readonly LibertiesTransform[] {
  return LIBERTIES_TRANSFORMS.filter((transform) =>
    transform.id === 'turn-right' || transform.id === 'mirror-wide' || transform.id === 'swap-diagonal'
  );
}

function scoreLibertiesCandidate(puzzle: LibertiesPuzzle, audit: LibertiesPuzzleAudit): number {
  const reverseReplay = replayLibertiesMoves(puzzle, [...puzzle.solution].reverse());
  const reverseOrderFails = reverseReplay.illegalMoveIndex !== null ? 1 : 0;
  const difficultyBonus = puzzle.difficulty === 'Hard' ? 20 : puzzle.difficulty === 'Standard' ? 10 : 0;
  const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
  const blockerRangeBonus = audit.blockerCount >= minBlockers && audit.blockerCount <= maxBlockers ? 80 : -180;
  const smallBoardBonus = getPreferredSizeScore(puzzle.difficulty, puzzle.size);

  return (
    difficultyBonus +
    blockerRangeBonus +
    smallBoardBonus +
    audit.blockerImpactScore * 14 +
    audit.blockedStretchPathCount * 16 +
    audit.blockerAdjacencyToLight * 8 +
    audit.smallBoardDensityScore * 2 +
    audit.responseEventCount * 36 +
    audit.dynamicMoveCount * 28 +
    audit.delayedMoveCount * 20 +
    audit.captureOrderDependencyScore * 16 +
    audit.decisionPointCount * 48 +
    audit.tempoClearCount * 36 +
    audit.stretchPressureCount * 24 +
    audit.sharedCrossingMoveCount * 34 +
    audit.naivePenalty * 42 +
    audit.terrainUsefulnessScore * 6 +
    audit.solutionCaptureMoves * 18 +
    audit.multiStoneCaptureMoves * 10 +
    audit.sharedOpenSideCount * 34 +
    audit.maxSharedOpenSideTouches * 14 +
    reverseOrderFails * 36 -
    audit.fillerMoveRatio * 72 -
    (audit.isPureOpeningFill ? 200 : 0)
  );
}

function candidatePassesQualityGate(candidate: ScoredLibertiesCandidate, playMode: LibertiesPlayMode): boolean {
  const { puzzle, audit } = candidate;
  const captureMinimum = puzzle.difficulty === 'Hard' ? 3 : 2;
  const responseMinimum = puzzle.difficulty === 'Hard' ? 3 : puzzle.difficulty === 'Standard' ? 2 : 0;
  const dynamicMinimum = puzzle.difficulty === 'Hard' ? 2 : puzzle.difficulty === 'Standard' ? 1 : 0;
  const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
  const blockerImpactMinimum = puzzle.difficulty === 'Hard' ? 13 : puzzle.difficulty === 'Standard' ? 10 : 5;
  const reverseReplay = replayLibertiesMoves(puzzle, [...puzzle.solution].reverse());
  const isHardMode = playMode === 'hard';
  const decisionMinimum = isHardMode ? 7 : puzzle.difficulty === 'Easy' ? 1 : 3;
  const tempoMinimum = isHardMode ? 4 : puzzle.difficulty === 'Easy' ? 1 : 2;
  const stretchMinimum = isHardMode ? 5 : puzzle.difficulty === 'Easy' ? 0 : 2;
  const naivePenaltyMinimum = isHardMode ? 4 : puzzle.difficulty === 'Easy' ? 1 : 2;
  const terrainMinimum = isHardMode ? 18 : puzzle.difficulty === 'Easy' ? 6 : 10;
  const fillerMaximum = isHardMode ? 0.08 : puzzle.difficulty === 'Easy' ? 0.18 : 0.12;

  return (
    isGeneratedSizeAllowed(puzzle.difficulty, puzzle.size) &&
    audit.blockerCount >= minBlockers &&
    audit.blockerCount <= maxBlockers &&
    audit.blockerImpactScore >= blockerImpactMinimum &&
    audit.solutionCaptureMoves >= captureMinimum &&
    audit.responseEventCount >= responseMinimum &&
    audit.dynamicMoveCount >= dynamicMinimum &&
    audit.decisionPointCount >= decisionMinimum &&
    audit.tempoClearCount >= tempoMinimum &&
    audit.stretchPressureCount >= stretchMinimum &&
    audit.naivePenalty >= naivePenaltyMinimum &&
    audit.terrainUsefulnessScore >= terrainMinimum &&
    audit.fillerMoveRatio < fillerMaximum &&
    !audit.isPureOpeningFill &&
    (puzzle.difficulty === 'Easy' || reverseReplay.illegalMoveIndex !== null)
  );
}

function buildLibertiesCandidateSpecs(tuning: LibertiesGenerationTuning): LibertiesPuzzleSpec[] {
  const specs: LibertiesPuzzleSpec[] = [];
  const fingerprints = new Set<string>();
  let variantIndex = 0;

  const addSpec = (spec: LibertiesPuzzleSpec): void => {
    const fingerprint = makeLibertiesLayout(spec, []).join('/');
    if (fingerprints.has(fingerprint)) return;
    fingerprints.add(fingerprint);
    specs.push(spec);
  };

  const terrainSpecs = libertiesBasePuzzleSpecs.flatMap((base, baseIndex) => {
    const templates = getTemplatesForDifficulty(base.difficulty);
    const defaultSpec = applyTerrainTemplate(
      base,
      getDefaultTerrainTemplate(base, baseIndex),
      tuning,
      baseIndex,
      true
    );
    const templateSpecs = templates.map((template, templateIndex) =>
      applyTerrainTemplate(base, template, tuning, baseIndex * 10 + templateIndex, false)
    );
    return [defaultSpec, ...templateSpecs];
  });

  terrainSpecs.forEach((spec) => {
    if (spec.difficulty === 'Easy' || Object.values(LIBERTIES_FORCED_PUZZLE_IDS).includes(spec.id)) {
      addSpec(spec);
    }
  });

  terrainSpecs.forEach((base) => {
    getGenerationSizeDeltas(base).forEach((sizeDelta) => {
      getGenerationOffsets(sizeDelta).forEach(([rowOffset, colOffset]) => {
        getGenerationTransforms().forEach((transform) => {
          const variant = makeLibertiesVariantSpec(
            base,
            transform,
            sizeDelta,
            rowOffset,
            colOffset,
            variantIndex
          );
          addSpec(variant);
          variantIndex += 1;
        });
      });
    });
  });

  return specs;
}

function scoreLibertiesCandidates(tuning: LibertiesGenerationTuning): ScoredLibertiesCandidate[] {
  const candidateSpecs = buildLibertiesCandidateSpecs(tuning);
  return candidateSpecs
    .map((spec, ordinal): ScoredLibertiesCandidate | null => {
      try {
        const puzzle = defineLibertiesPuzzle(spec);
        const audit = getLibertiesPuzzleAudit(puzzle);
        return {
          spec,
          puzzle,
          audit,
          score: scoreLibertiesCandidate(puzzle, audit),
          ordinal,
        };
      } catch {
        return null;
      }
    })
    .filter((candidate): candidate is ScoredLibertiesCandidate => candidate !== null)
    .sort((a, b) => b.score - a.score || a.ordinal - b.ordinal);
}

function addCandidateToPuzzleSelection(
  candidate: ScoredLibertiesCandidate,
  selected: LibertiesPuzzle[],
  selectedLayouts: Set<string>,
  selectedIds: Set<string>,
  selectedDifficultyCounts: Record<LibertiesDifficulty, number>,
  targetLength: number
): boolean {
  const { puzzle } = candidate;
  if (selected.length >= targetLength || selectedIds.has(puzzle.id)) return false;
  const layoutFingerprint = puzzle.layout.join('/');
  if (selectedLayouts.has(layoutFingerprint)) return false;
  if (!candidatePassesMoveFloorGate(puzzle)) {
    return false;
  }
  selectedLayouts.add(layoutFingerprint);
  selectedIds.add(puzzle.id);
  selectedDifficultyCounts[puzzle.difficulty] += 1;
  selected.push(puzzle);
  return true;
}

function selectLibertiesPuzzlesByQuota(
  scoredCandidates: ScoredLibertiesCandidate[],
  quotas: Record<LibertiesDifficulty, number>,
  sizeQuotas: LibertiesSizeQuotas,
  selectedLayouts: Set<string>,
  selectedIds: Set<string>,
  includeForced: boolean,
  targetLength: number,
  forcedPuzzleId: string,
  playMode: LibertiesPlayMode,
  excludedLayouts: Set<string> = new Set(),
  excludedIds: Set<string> = new Set()
): LibertiesPuzzle[] {
  const selected: LibertiesPuzzle[] = [];
  const selectedDifficultyCounts: Record<LibertiesDifficulty, number> = {
    Easy: 0,
    Standard: 0,
    Hard: 0,
  };

  if (includeForced) {
    scoredCandidates
      .filter((candidate) => candidate.puzzle.id === forcedPuzzleId)
      .forEach((candidate) => {
        addCandidateToPuzzleSelection(
          candidate,
          selected,
          selectedLayouts,
          selectedIds,
          selectedDifficultyCounts,
          targetLength
        );
      });
  }

  (Object.keys(quotas) as LibertiesDifficulty[]).forEach((difficulty) => {
    Object.entries(sizeQuotas[difficulty]).forEach(([sizeKey, sizeQuota]) => {
      const size = Number(sizeKey);
      scoredCandidates
        .filter(
          (candidate) =>
            candidate.puzzle.difficulty === difficulty &&
            candidate.puzzle.size === size &&
            !excludedLayouts.has(candidate.puzzle.layout.join('/')) &&
            !excludedIds.has(candidate.puzzle.id) &&
            candidatePassesQualityGate(candidate, playMode)
        )
        .forEach((candidate) => {
          const currentSizeCount = selected.filter(
            (puzzle) => puzzle.difficulty === difficulty && puzzle.size === size
          ).length;
          if (currentSizeCount >= sizeQuota || selectedDifficultyCounts[difficulty] >= quotas[difficulty]) return;
          addCandidateToPuzzleSelection(
            candidate,
            selected,
            selectedLayouts,
            selectedIds,
            selectedDifficultyCounts,
            targetLength
          );
        });
    });
  });

  (Object.keys(quotas) as LibertiesDifficulty[]).forEach((difficulty) => {
    const quota = quotas[difficulty];
    scoredCandidates
      .filter(
        (candidate) =>
          candidate.puzzle.difficulty === difficulty &&
          !excludedLayouts.has(candidate.puzzle.layout.join('/')) &&
          !excludedIds.has(candidate.puzzle.id) &&
          candidatePassesQualityGate(candidate, playMode)
      )
      .forEach((candidate) => {
        if (selectedDifficultyCounts[difficulty] >= quota) return;
        addCandidateToPuzzleSelection(
          candidate,
          selected,
          selectedLayouts,
          selectedIds,
          selectedDifficultyCounts,
          targetLength
        );
    });
  });

  (Object.keys(quotas) as LibertiesDifficulty[]).forEach((difficulty) => {
    if (selectedDifficultyCounts[difficulty] < quotas[difficulty]) {
      throw new Error(
        `Liberties generated ${selectedDifficultyCounts[difficulty]} ${difficulty} puzzles, expected ${quotas[difficulty]}`
      );
    }
  });

  if (selected.length < targetLength) {
    throw new Error(`Liberties pack selected ${selected.length} puzzles, expected ${targetLength}`);
  }

  return selected.slice(0, targetLength);
}

function medianLibertiesSeconds(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function getLibertiesFamilyId(puzzle: Pick<LibertiesPuzzle, 'id'>): string {
  return (
    [...libertiesBasePuzzleSpecs]
      .sort((a, b) => b.id.length - a.id.length)
      .find((spec) => puzzle.id === spec.id || puzzle.id.startsWith(`${spec.id}-`))?.id ?? puzzle.id
  );
}

function orderLibertiesDifficultyPool(puzzles: LibertiesPuzzle[]): LibertiesPuzzle[] {
  const remaining = [...puzzles];
  const ordered: LibertiesPuzzle[] = [];

  while (remaining.length > 0) {
    const recentFamilies = new Set(ordered.slice(-3).map(getLibertiesFamilyId));
    const recentArchetypes = new Set(
      ordered
        .slice(-2)
        .flatMap((puzzle) => puzzle.terrainArchetypes ?? [])
    );
    let selectedIndex = remaining.findIndex((candidate) => {
      const familyFresh = !recentFamilies.has(getLibertiesFamilyId(candidate));
      const archetypeFresh = !(candidate.terrainArchetypes ?? []).some((archetype) => recentArchetypes.has(archetype));
      return familyFresh && archetypeFresh;
    });
    if (selectedIndex < 0) {
      selectedIndex = remaining.findIndex((candidate) => !recentFamilies.has(getLibertiesFamilyId(candidate)));
    }
    if (selectedIndex < 0) {
      selectedIndex = remaining.findIndex(
        (candidate) => !(candidate.terrainArchetypes ?? []).some((archetype) => recentArchetypes.has(archetype))
      );
    }
    const [selected] = remaining.splice(selectedIndex >= 0 ? selectedIndex : 0, 1);
    ordered.push(selected!);
  }

  return ordered;
}

function chooseScheduledDifficulty(
  slot: number,
  targets: Record<LibertiesDifficulty, number>,
  used: Record<LibertiesDifficulty, number>,
  previousDifficulty: LibertiesDifficulty | null,
  previousStreak: number
): LibertiesDifficulty {
  const streakLimit = slot < 60 ? 2 : 3;
  let candidates = (Object.keys(targets) as LibertiesDifficulty[]).filter(
    (difficulty) => used[difficulty] < targets[difficulty]
  );
  if (previousDifficulty && previousStreak >= streakLimit) {
    const withoutRepeat = candidates.filter((difficulty) => difficulty !== previousDifficulty);
    if (withoutRepeat.length > 0) candidates = withoutRepeat;
  }
  const total = Object.values(targets).reduce((sum, count) => sum + count, 0);

  candidates.sort((a, b) => {
    const urgencyA = ((slot + 1) * targets[a]) / total - used[a];
    const urgencyB = ((slot + 1) * targets[b]) / total - used[b];
    const repeatPenaltyA = previousDifficulty === a ? 0.18 : 0;
    const repeatPenaltyB = previousDifficulty === b ? 0.18 : 0;
    return (
      urgencyB - repeatPenaltyB - (urgencyA - repeatPenaltyA) ||
      (a === 'Standard' ? -1 : a === 'Easy' ? 0 : 1) - (b === 'Standard' ? -1 : b === 'Easy' ? 0 : 1)
    );
  });

  return candidates[0]!;
}

function orderLibertiesPublicPuzzles(
  puzzles: LibertiesPuzzle[],
  forcedPuzzleId: string
): LibertiesPuzzle[] {
  const forcedPuzzle = puzzles.find((puzzle) => puzzle.id === forcedPuzzleId) ?? puzzles[0]!;
  const pools: Record<LibertiesDifficulty, LibertiesPuzzle[]> = {
    Easy: orderLibertiesDifficultyPool(
      puzzles.filter((puzzle) => puzzle.difficulty === 'Easy' && puzzle.id !== forcedPuzzle.id)
    ),
    Standard: orderLibertiesDifficultyPool(
      puzzles.filter((puzzle) => puzzle.difficulty === 'Standard' && puzzle.id !== forcedPuzzle.id)
    ),
    Hard: orderLibertiesDifficultyPool(
      puzzles.filter((puzzle) => puzzle.difficulty === 'Hard' && puzzle.id !== forcedPuzzle.id)
    ),
  };
  const targets: Record<LibertiesDifficulty, number> = {
    Easy: pools.Easy.length,
    Standard: pools.Standard.length,
    Hard: pools.Hard.length,
  };
  const used: Record<LibertiesDifficulty, number> = {
    Easy: 0,
    Standard: 0,
    Hard: 0,
  };
  const openingCadence: LibertiesDifficulty[] = [
    'Easy',
    'Easy',
    'Standard',
    'Easy',
    'Standard',
    'Easy',
    'Standard',
    'Hard',
    'Easy',
    'Standard',
    'Standard',
    'Easy',
    'Hard',
    'Standard',
  ];
  const ordered: LibertiesPuzzle[] = [forcedPuzzle];
  let previousDifficulty: LibertiesDifficulty | null = forcedPuzzle.difficulty;
  let previousStreak = 1;

  const addNextDifficulty = (difficulty: LibertiesDifficulty): boolean => {
    const next = pools[difficulty].shift();
    if (!next) return false;
    ordered.push(next);
    used[difficulty] += 1;
    previousStreak = previousDifficulty === difficulty ? previousStreak + 1 : 1;
    previousDifficulty = difficulty;
    return true;
  };

  openingCadence.forEach((difficulty) => {
    if (ordered.length >= puzzles.length) return;
    if (addNextDifficulty(difficulty)) return;
    addNextDifficulty(chooseScheduledDifficulty(ordered.length, targets, used, previousDifficulty, previousStreak));
  });

  while (ordered.length < puzzles.length) {
    const difficulty = chooseScheduledDifficulty(ordered.length, targets, used, previousDifficulty, previousStreak);
    if (addNextDifficulty(difficulty)) continue;
    const fallback = (Object.keys(pools) as LibertiesDifficulty[]).find((candidate) => pools[candidate].length > 0);
    if (!fallback || !addNextDifficulty(fallback)) break;
  }

  return ordered;
}

function getDominantTerrainArchetype(puzzle: LibertiesPuzzle): LibertiesTerrainArchetype | null {
  return puzzle.terrainArchetypes?.[0] ?? null;
}

function getLibertiesAuditQualityScore(puzzle: LibertiesPuzzle, audit: LibertiesPuzzleAudit): number {
  return (
    audit.decisionPointCount * 70 +
    audit.tempoClearCount * 52 +
    audit.stretchPressureCount * 34 +
    audit.sharedCrossingMoveCount * 42 +
    audit.naivePenalty * 58 +
    audit.terrainUsefulnessScore * 10 +
    audit.responseEventCount * 12 +
    audit.dynamicMoveCount * 10 -
    audit.fillerMoveRatio * 200 -
    Math.max(0, puzzle.targetMoves - audit.optimalMoveCount) * 15
  );
}

function getModeTargetSeconds(
  puzzle: LibertiesPuzzle,
  playMode: LibertiesPlayMode,
  isPeakHard: boolean
): number {
  if (playMode === 'hard') {
    return puzzle.targetSeconds;
  }
  if (puzzle.difficulty === 'Easy') {
    return Math.min(puzzle.targetSeconds, 260);
  }
  if (puzzle.difficulty === 'Standard') {
    return Math.min(puzzle.targetSeconds, 330);
  }
  return isPeakHard ? 390 : 360;
}

function markPeakHardPuzzles(puzzles: LibertiesPuzzle[], peakCount: number): Set<string> {
  const selected = new Set<string>();
  if (peakCount <= 0) return selected;
  const candidates = puzzles
    .map((puzzle, index) => ({ puzzle, index, audit: getLibertiesPuzzleAudit(puzzle) }))
    .filter(({ puzzle }) => puzzle.difficulty === 'Hard')
    .sort(
      (a, b) =>
        getLibertiesAuditQualityScore(b.puzzle, b.audit) - getLibertiesAuditQualityScore(a.puzzle, a.audit) ||
        b.audit.optimalMoveCount - a.audit.optimalMoveCount ||
        a.index - b.index
    );
  const spacing = peakCount <= 20 ? 14 : 2;

  candidates.forEach(({ puzzle, index }) => {
    if (selected.size >= peakCount) return;
    const tooClose = [...selected].some((id) => {
      const selectedIndex = puzzles.findIndex((candidate) => candidate.id === id);
      return selectedIndex >= 0 && Math.abs(selectedIndex - index) < spacing;
    });
    if (!tooClose) selected.add(puzzle.id);
  });

  candidates.forEach(({ puzzle }) => {
    if (selected.size < peakCount) selected.add(puzzle.id);
  });

  return selected;
}

function getCalendarNoveltyScore(puzzles: LibertiesPuzzle[], index: number): number {
  const puzzle = puzzles[index]!;
  const recent = puzzles.slice(Math.max(0, index - 14), index);
  const family = getLibertiesFamilyId(puzzle);
  const terrain = getDominantTerrainArchetype(puzzle);
  let score = 20;

  recent.forEach((entry, offset) => {
    const distanceWeight = 14 - (recent.length - offset - 1);
    if (getLibertiesFamilyId(entry) === family) score -= distanceWeight;
    if (terrain && getDominantTerrainArchetype(entry) === terrain) score -= Math.max(1, Math.floor(distanceWeight / 2));
    if (entry.size === puzzle.size && entry.difficulty === puzzle.difficulty) score -= 1;
  });

  return Math.max(0, score);
}

function annotateLibertiesPuzzles(
  puzzles: LibertiesPuzzle[],
  playMode: LibertiesPlayMode,
  peakCount = 0
): LibertiesPuzzle[] {
  const peakIds = markPeakHardPuzzles(puzzles, peakCount);
  const annotatedBase = puzzles.map((puzzle, index) => ({
    ...puzzle,
    targetSeconds: getModeTargetSeconds(puzzle, playMode, peakIds.has(puzzle.id)),
    playMode,
    calendarIndex: index,
    peakHard: peakIds.has(puzzle.id) || undefined,
  }));

  return annotatedBase.map((puzzle, index) => {
    const audit = getLibertiesPuzzleAudit(puzzle);
    return {
      ...puzzle,
      optimalMoveCount: audit.optimalMoveCount,
      qualityScore: getLibertiesAuditQualityScore(puzzle, audit),
      decisionPointCount: audit.decisionPointCount,
      tempoClearCount: audit.tempoClearCount,
      stretchPressureCount: audit.stretchPressureCount,
      naivePenalty: audit.naivePenalty,
      terrainUsefulnessScore: audit.terrainUsefulnessScore,
      calendarNoveltyScore: getCalendarNoveltyScore(annotatedBase, index),
    };
  });
}

function generationPassesPlaytestGate(
  publicPuzzles: LibertiesPuzzle[],
  targetLength: number,
  playMode: LibertiesPlayMode
): boolean {
  const audit = getLibertiesPackAudit(publicPuzzles);
  const standardPuzzles = publicPuzzles.filter((puzzle) => puzzle.difficulty === 'Standard');
  const standardPersonaMedian = medianLibertiesSeconds(
    standardPuzzles.map((puzzle) => {
      const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
      const stress =
        puzzleAudit.responseEventCount +
        puzzleAudit.dynamicMoveCount * 0.8 +
        puzzleAudit.captureOrderDependencyScore * 0.65 -
        puzzleAudit.sharedOpenSideCount * 0.55;
      return Math.round(puzzle.targetSeconds * 0.92 + Math.max(0, stress - 18) * 0.6);
    })
  );
  const medianMinimum = playMode === 'hard' ? 540 : 285;
  const medianMaximum = playMode === 'hard' ? 720 : 345;
  const personaMedianIsInRange =
    playMode === 'hard' ||
    (standardPersonaMedian >= 285 && standardPersonaMedian <= 360);

  return (
    audit.puzzleCount === targetLength &&
    audit.medianTargetSeconds >= medianMinimum &&
    audit.medianTargetSeconds <= medianMaximum &&
    personaMedianIsInRange &&
    audit.averageBlockerImpactScore >= 10 &&
    audit.averageDecisionPointCount >= (playMode === 'hard' ? 7 : 3) &&
    audit.averageTempoClearCount >= (playMode === 'hard' ? 4 : 2) &&
    audit.averageStretchPressureCount >= (playMode === 'hard' ? 5 : 2) &&
    audit.averageNaivePenalty >= (playMode === 'hard' ? 4 : 2) &&
    audit.pureOpeningFillCount === 0
  );
}

function buildLibertiesPacks(
  tuning: LibertiesGenerationTuning,
  playMode: LibertiesPlayMode,
  options: LibertiesPackGenerationOptions = {}
): LibertiesPackGenerationResult {
  const profile = getLibertiesGenerationProfile(playMode);
  const scoredCandidates = scoreLibertiesCandidates(tuning);
  const selectedLayouts = new Set<string>();
  const selectedIds = new Set<string>();
  const selectPublicPuzzles = selectLibertiesPuzzlesByQuota(
    scoredCandidates,
    profile.publicDifficultyQuotas,
    profile.publicSizeQuotas,
    selectedLayouts,
    selectedIds,
    true,
    profile.publicPackLength,
    profile.dailyPuzzleId,
    playMode,
    options.excludedPublicLayouts,
    options.excludedPublicIds
  );
  const publicPuzzles =
    process.env.LIBERTIES_FAST_GEN === '1'
      ? orderLibertiesPublicPuzzles(selectPublicPuzzles, profile.dailyPuzzleId)
      : annotateLibertiesPuzzles(
          orderLibertiesPublicPuzzles(withLibertiesMinimumRoutes(selectPublicPuzzles), profile.dailyPuzzleId),
          playMode,
          playMode === 'hard' ? 100 : 12
        );
  const reservePuzzlesSource = selectLibertiesPuzzlesByQuota(
    scoredCandidates,
    profile.reserveDifficultyQuotas,
    profile.reserveSizeQuotas,
    selectedLayouts,
    selectedIds,
    false,
    profile.reservePackLength,
    profile.dailyPuzzleId,
    playMode,
    options.excludedPublicLayouts,
    options.excludedPublicIds
  );
  const reservePuzzles =
    process.env.LIBERTIES_FAST_GEN === '1'
      ? reservePuzzlesSource.map((puzzle, index) => ({ ...puzzle, reserveRank: index + 1, minMoves: puzzle.targetMoves }))
      : annotateLibertiesPuzzles(
          withLibertiesMinimumRoutes(
            reservePuzzlesSource.map((puzzle, index) => ({ ...puzzle, reserveRank: index + 1 }))
          ),
          playMode,
          playMode === 'hard' ? 18 : 4
        );

  return {
    publicPuzzles,
    reservePuzzles,
    allPuzzles: [...publicPuzzles, ...reservePuzzles],
    report: {
      tuningId: tuning.id,
      candidateCount: scoredCandidates.length,
      iterationCount: 1,
    },
  };
}

export function buildLibertiesPacksForGeneration(
  playMode: LibertiesPlayMode = 'standard',
  options: LibertiesPackGenerationOptions = {}
): LibertiesPackGenerationResult {
  const attempts: LibertiesPackGenerationResult[] = [];
  const profile = getLibertiesGenerationProfile(playMode);

  for (let index = 0; index < LIBERTIES_GENERATION_TUNINGS.length; index += 1) {
    try {
      const result = buildLibertiesPacks(LIBERTIES_GENERATION_TUNINGS[index]!, playMode, options);
      attempts.push({
        ...result,
        report: {
          ...result.report,
          iterationCount: index + 1,
        },
      });
      if (generationPassesPlaytestGate(result.publicPuzzles, profile.publicPackLength, playMode)) {
        return attempts.at(-1)!;
      }
    } catch (error) {
      if (process.env.LIBERTIES_VERBOSE_GENERATION === '1') {
        const message = error instanceof Error ? error.message : String(error);
        console.log(
          `Liberties ${playMode} generation attempt ${index + 1} failed: ${message}`
        );
      }
    }
  }

  if (attempts.length === 0) {
    throw new Error('Liberties pack generation failed before producing a candidate pack');
  }

  return attempts
    .sort((a, b) => {
      const auditA = getLibertiesPackAudit(a.publicPuzzles);
      const auditB = getLibertiesPackAudit(b.publicPuzzles);
      return (
        Number(generationPassesPlaytestGate(b.publicPuzzles, profile.publicPackLength, playMode)) -
          Number(generationPassesPlaytestGate(a.publicPuzzles, profile.publicPackLength, playMode)) ||
        auditB.averageBlockerImpactScore - auditA.averageBlockerImpactScore ||
        auditB.standardMedianTargetSeconds - auditA.standardMedianTargetSeconds
      );
    })[0]!;
}

export function buildLibertiesPuzzlesForGeneration(): LibertiesPuzzle[] {
  return buildLibertiesPacksForGeneration('standard').publicPuzzles;
}

export const libertiesPuzzlesStandard: LibertiesPuzzle[] = generatedLibertiesPack;
export const libertiesReservePuzzlesStandard: LibertiesPuzzle[] = generatedLibertiesReservePack;
export const libertiesPuzzlesHard: LibertiesPuzzle[] = generatedLibertiesPackHard;
export const libertiesReservePuzzlesHard: LibertiesPuzzle[] = generatedLibertiesReservePackHard;
export const libertiesPuzzles: LibertiesPuzzle[] = libertiesPuzzlesStandard;
export const libertiesReservePuzzles: LibertiesPuzzle[] = libertiesReservePuzzlesStandard;
export const libertiesPreviewPuzzles: LibertiesPuzzle[] = [
  ...libertiesPuzzlesStandard,
  ...libertiesReservePuzzlesStandard,
  ...libertiesPuzzlesHard,
  ...libertiesReservePuzzlesHard,
];

export interface LibertiesPuzzleAudit {
  groupCount: number;
  initialOpenSideCount: number;
  sharedOpenSideCount: number;
  maxSharedOpenSideTouches: number;
  blockerCount: number;
  blockerImpactScore: number;
  blockerAdjacencyToLight: number;
  blockedStretchPathCount: number;
  smallBoardDensityScore: number;
  reserveRank: number;
  openingIllegalSolutionMoves: number;
  emptyNeighborPressureMoves: number;
  solutionCaptureMoves: number;
  multiStoneCaptureMoves: number;
  maxCaptureSize: number;
  responseEventCount: number;
  dynamicMoveCount: number;
  raceResponseCount: number;
  releasePebbleCount: number;
  requiredReleaseMoveCount: number;
  delayedMoveCount: number;
  maxUnlockDepth: number;
  captureOrderDependencyScore: number;
  optimalMoveCount: number;
  naiveFillMoveCount: number;
  greedyClearMoveCount: number;
  naivePenalty: number;
  decisionPointCount: number;
  tempoClearCount: number;
  stretchPressureCount: number;
  sharedCrossingMoveCount: number;
  whitePunishCount: number;
  recoveryMargin: number;
  terrainUsefulnessScore: number;
  calendarNoveltyScore: number;
  fillerMoveRatio: number;
  isPureOpeningFill: boolean;
}

export interface LibertiesPackAudit {
  puzzleCount: number;
  difficultyCounts: Record<LibertiesDifficulty, number>;
  tagCounts: Record<LibertiesPuzzleTag, number>;
  terrainArchetypeCounts: Record<LibertiesTerrainArchetype, number>;
  minTargetMoves: number;
  maxTargetMoves: number;
  averageTargetMoves: number;
  minMinimumMoves: number;
  maxMinimumMoves: number;
  averageMinimumMoves: number;
  averageTargetToMinimumMoveGap: number;
  maxTargetToMinimumMoveGap: number;
  standardMedianTargetSeconds: number;
  averageBlockerCount: number;
  minimumBlockerImpactScore: number;
  averageBlockerImpactScore: number;
  averageSmallBoardDensityScore: number;
  pureOpeningFillCount: number;
  responseEventCount: number;
  dynamicMoveCount: number;
  raceResponseCount: number;
  releasePebbleCount: number;
  requiredReleaseMoveCount: number;
  delayedMoveCount: number;
  maxUnlockDepth: number;
  averageOptimalMoveCount: number;
  averageNaivePenalty: number;
  averageDecisionPointCount: number;
  averageTempoClearCount: number;
  averageStretchPressureCount: number;
  averageSharedCrossingMoveCount: number;
  averageWhitePunishCount: number;
  averageTerrainUsefulnessScore: number;
  medianTargetSeconds: number;
  averageFillerMoveRatio: number;
}

function toPoint(point: LibertiesPointSpec): LibertiesPoint {
  return { row: point[0], col: point[1] };
}

function toReleaseLink(release: LibertiesReleaseLinkSpec): LibertiesReleaseLink {
  return {
    point: toPoint(release.point),
    groupIndex: release.group,
  };
}

function isSpecPoint(point: LibertiesPoint, candidate: LibertiesPointSpec): boolean {
  return point.row === candidate[0] && point.col === candidate[1];
}

function makeLibertiesLayout(
  spec: LibertiesPuzzleSpec,
  releaseLinks: readonly LibertiesReleaseLinkSpec[] = spec.releases ?? []
): string[] {
  const grid = Array.from({ length: spec.size }, () => Array.from({ length: spec.size }, () => '.'));

  spec.frozen?.forEach((point) => {
    const { row, col } = toPoint(point);
    grid[row]![col] = 'X';
  });

  spec.blocks?.forEach((point) => {
    const { row, col } = toPoint(point);
    grid[row]![col] = 'X';
  });

  spec.groups.forEach((group) => {
    group.stones.forEach((point) => {
      const { row, col } = toPoint(point);
      grid[row]![col] = 'W';
    });
  });

  const lockedKey = spec.groups[0]?.keys?.[0] ?? null;
  spec.groups.forEach((group) => {
    group.keys?.forEach((key) => {
      const keyPoint = toPoint(key);
      if (grid[keyPoint.row]?.[keyPoint.col] === 'W') {
        throw new Error(`Liberties key overlaps a light in ${spec.id}`);
      }
      grid[keyPoint.row]![keyPoint.col] = '.';
      if (!lockedKey || !isSpecPoint(keyPoint, lockedKey)) return;

      getLibertiesNeighbors(keyPoint, spec.size).forEach((neighbor) => {
        const touchesOwnGroup = group.stones.some((stone) => isSpecPoint(neighbor, stone));
        if (touchesOwnGroup || grid[neighbor.row]?.[neighbor.col] === 'W') return;
        if (grid[neighbor.row]?.[neighbor.col] === '.') {
          grid[neighbor.row]![neighbor.col] = 'X';
        }
      });
    });
  });

  releaseLinks.forEach((release) => {
    const { row, col } = toPoint(release.point);
    const current = grid[row]?.[col];
    if (current !== '.') {
      throw new Error(`Liberties release overlaps ${current ?? 'outside board'} in ${spec.id}`);
    }
    if (release.group < 0 || release.group >= spec.groups.length) {
      throw new Error(`Liberties release has invalid group ${release.group} in ${spec.id}`);
    }
    grid[row]![col] = 'G';
  });

  return grid.map((row) => row.join(''));
}

function getTargetReleaseCount(difficulty: LibertiesDifficulty): number {
  if (difficulty === 'Hard') return 3;
  if (difficulty === 'Standard') return 2;
  return 1;
}

function canUsePointAsRelease(layout: string[], point: LibertiesPoint, selected: Set<string>): boolean {
  return layout[point.row]?.[point.col] === '.' && !selected.has(pointKey(point));
}

function getSpecCaptureEvents(
  spec: LibertiesPuzzleSpec,
  puzzle: LibertiesPuzzle,
  solution: LibertiesPoint[]
): Array<{ group: number; moveIndex: number }> {
  let board = createLibertiesBoard(puzzle);
  const cleared = new Set<number>();
  const events: Array<{ group: number; moveIndex: number }> = [];

  solution.forEach((move, moveIndex) => {
    const result = playLibertiesMove(board, puzzle.size, move, 'black', puzzle);
    if (!result.legal) return;
    board = result.board;

    spec.groups.forEach((group, groupIndex) => {
      if (cleared.has(groupIndex)) return;
      const groupCleared = group.stones.every(([row, col]) => board[row]?.[col] !== 'white');
      if (!groupCleared) return;
      cleared.add(groupIndex);
      events.push({ group: groupIndex, moveIndex });
    });
  });

  return events;
}

function deriveAutomaticReleaseSpecs(spec: LibertiesPuzzleSpec): LibertiesReleaseLinkSpec[] {
  if (spec.releases) return [...spec.releases];

  const targetReleaseCount = Math.min(getTargetReleaseCount(spec.difficulty), Math.max(0, spec.groups.length - 1));
  if (targetReleaseCount === 0) return [];

  const baseLayout = makeLibertiesLayout(spec, []);
  const basePuzzle: LibertiesPuzzle = {
    id: spec.id,
    title: spec.title,
    difficulty: spec.difficulty,
    size: spec.size,
    targetMoves: 0,
    minMoves: 0,
    targetSeconds: 0,
    variant: spec.variant ?? getDefaultLibertiesVariant(spec.difficulty),
    layout: baseLayout,
    solution: [],
    minSolution: [],
    releaseLinks: [],
    lightGroups: spec.groups.map((group) => group.stones.map(toPoint)),
    motif: spec.motif,
    focusTags: [],
    terrainArchetypes: spec.terrainArchetypes ? [...spec.terrainArchetypes] : [],
  };
  const baseSolution = deriveLibertiesSolution(basePuzzle);
  const captureEvents = getSpecCaptureEvents(spec, basePuzzle, baseSolution);
  const selected = new Set<string>();
  const releases: LibertiesReleaseLinkSpec[] = [];

  const chooseReleaseAfterEvent = (event: { group: number; moveIndex: number }, startOffset: number): boolean => {
    for (let index = event.moveIndex + startOffset; index < baseSolution.length; index += 1) {
      const point = baseSolution[index]!;
      if (!canUsePointAsRelease(baseLayout, point, selected)) continue;
      selected.add(pointKey(point));
      releases.push({ point: [point.row, point.col], group: event.group });
      return true;
    }
    return false;
  };

  captureEvents.forEach((event) => {
    if (releases.length >= targetReleaseCount) return;
    chooseReleaseAfterEvent(event, 1);
  });

  captureEvents.forEach((event) => {
    if (releases.length >= targetReleaseCount) return;
    chooseReleaseAfterEvent(event, 0);
  });

  return releases.slice(0, targetReleaseCount);
}

function defineLibertiesPuzzle(spec: LibertiesPuzzleSpec): LibertiesPuzzle {
  const releaseSpecs: LibertiesReleaseLinkSpec[] = [];
  const layout = makeLibertiesLayout(spec, releaseSpecs);
  const puzzle: LibertiesPuzzle = {
    id: spec.id,
    title: spec.title,
    difficulty: spec.difficulty,
    size: spec.size,
    targetMoves: 0,
    minMoves: 0,
    targetSeconds: 0,
    variant: spec.variant ?? getDefaultLibertiesVariant(spec.difficulty),
    layout,
    solution: [],
    minSolution: [],
    releaseLinks: releaseSpecs.map(toReleaseLink),
    lightGroups: spec.groups.map((group) => group.stones.map(toPoint)),
    motif: spec.motif,
    focusTags: [],
    terrainArchetypes: spec.terrainArchetypes ? [...spec.terrainArchetypes] : [],
  };
  const solution = deriveLibertiesSolution(puzzle);
  const definedPuzzle = {
    ...puzzle,
    solution,
  };
  const auditPuzzle = {
    ...definedPuzzle,
    targetMoves: solution.length,
    minMoves: solution.length,
    minSolution: solution,
    targetSeconds: 0,
  };
  const audit = getLibertiesPuzzleAudit(auditPuzzle);
  const intermediatePuzzle = {
    ...definedPuzzle,
    targetMoves: solution.length,
    minMoves: solution.length,
    minSolution: solution,
    targetSeconds: estimateLibertiesSolveSeconds(spec.difficulty, solution.length, audit),
  };
  const subPuzzleMoments = deriveLibertiesSubPuzzleMoments(intermediatePuzzle, {
    responseEventCount: audit.responseEventCount,
    dynamicMoveCount: audit.dynamicMoveCount,
    captureOrderDependencyScore: audit.captureOrderDependencyScore,
    sharedOpenSideCount: audit.sharedOpenSideCount,
    maxSharedOpenSideTouches: audit.maxSharedOpenSideTouches,
    solutionCaptureMoves: audit.solutionCaptureMoves,
    multiStoneCaptureMoves: audit.multiStoneCaptureMoves,
    requiredReleaseMoveCount: audit.requiredReleaseMoveCount,
    fillerMoveRatio: audit.fillerMoveRatio,
  });
  const finalPuzzle = {
    ...definedPuzzle,
    targetMoves: solution.length,
    minMoves: solution.length,
    minSolution: solution,
    targetSeconds: estimateLibertiesSolveSeconds(spec.difficulty, solution.length, audit),
    subPuzzleMoments,
  };
  return {
    ...finalPuzzle,
    focusTags: deriveLibertiesFocusTags(spec, finalPuzzle),
  };
}

function estimateLibertiesSolveSeconds(
  difficulty: LibertiesDifficulty,
  moves: number,
  audit: Pick<
    LibertiesPuzzleAudit,
    'groupCount' | 'responseEventCount' | 'dynamicMoveCount' | 'sharedOpenSideCount' | 'captureOrderDependencyScore'
  >
): number {
  const base = difficulty === 'Easy' ? 105 : difficulty === 'Standard' ? 185 : 410;
  const raw =
    base +
    moves * (difficulty === 'Hard' ? 6 : 4) +
    audit.groupCount * (difficulty === 'Hard' ? 10 : 7) +
    audit.responseEventCount * (difficulty === 'Hard' ? 2 : 1) +
    audit.dynamicMoveCount * (difficulty === 'Hard' ? 2 : 1) +
    audit.sharedOpenSideCount * 4 +
    audit.captureOrderDependencyScore * (difficulty === 'Hard' ? 2 : 1);
  const targetScale = difficulty === 'Standard' ? 0.9 : 1;
  const scaledRaw = raw * targetScale;
  const min = difficulty === 'Easy' ? 120 : difficulty === 'Standard' ? 285 : 540;
  const max = difficulty === 'Easy' ? 260 : difficulty === 'Standard' ? 345 : 720;
  return Math.max(min, Math.min(max, Math.round(scaledRaw / 5) * 5));
}

function countEdgeSolutionMoves(puzzle: LibertiesPuzzle): number {
  return puzzle.solution.filter(
    (point) =>
      point.row === 0 ||
      point.col === 0 ||
      point.row === puzzle.size - 1 ||
      point.col === puzzle.size - 1
  ).length;
}

interface LibertiesSolutionMomentum {
  maxReleaseRun: number;
  maxForcedRun: number;
  releaseMoveCount: number;
}

function analyzeLibertiesSolutionMomentum(puzzle: LibertiesPuzzle): LibertiesSolutionMomentum {
  const releasePoints = new Set(puzzle.releaseLinks.map((release) => pointKey(release.point)));
  let board = createLibertiesBoard(puzzle);
  let maxReleaseRun = 0;
  let currentReleaseRun = 0;
  let maxForcedRun = 0;
  let currentForcedRun = 0;
  let releaseMoveCount = 0;

  puzzle.solution.forEach((move) => {
    const key = pointKey(move);
    const result = playLibertiesMove(board, puzzle.size, move, 'black', puzzle);
    if (!result.legal) {
      currentReleaseRun = 0;
      currentForcedRun = 0;
      return;
    }

    const isReleaseMove = releasePoints.has(key);
    const isForcedMove =
      isReleaseMove || result.captured.length > 0 || result.responses.length > 0 || result.capturedDark.length > 0;

    currentReleaseRun = isReleaseMove ? currentReleaseRun + 1 : 0;
    maxReleaseRun = Math.max(maxReleaseRun, currentReleaseRun);
    if (isReleaseMove) releaseMoveCount += 1;

    currentForcedRun = isForcedMove ? currentForcedRun + 1 : 0;
    maxForcedRun = Math.max(maxForcedRun, currentForcedRun);
    board = result.board;
  });

  return { maxReleaseRun, maxForcedRun, releaseMoveCount };
}

function deriveLibertiesSubPuzzleMoments(
  puzzle: LibertiesPuzzle,
  audit: Pick<
    LibertiesPuzzleAudit,
    | 'responseEventCount'
    | 'dynamicMoveCount'
    | 'captureOrderDependencyScore'
    | 'sharedOpenSideCount'
    | 'maxSharedOpenSideTouches'
    | 'solutionCaptureMoves'
    | 'multiStoneCaptureMoves'
    | 'requiredReleaseMoveCount'
    | 'fillerMoveRatio'
  >
): LibertiesSubPuzzleMoment[] {
  const moments: LibertiesSubPuzzleMoment[] = [];

  const addMoment = (moment: LibertiesSubPuzzleMoment) => {
    if (!moments.includes(moment)) moments.push(moment);
  };

  if (audit.solutionCaptureMoves >= 2 || audit.dynamicMoveCount >= 3) addMoment('capture-burst');
  if (audit.responseEventCount >= 3) addMoment('response-choreography');
  if (audit.maxSharedOpenSideTouches >= 3 || audit.sharedOpenSideCount >= 4) addMoment('shared-momentum');
  if (audit.multiStoneCaptureMoves >= 2 || audit.captureOrderDependencyScore >= 8) {
    addMoment('release-timing');
  }
  if (countEdgeSolutionMoves(puzzle) >= 3) addMoment('edge-rush');
  if (audit.requiredReleaseMoveCount > 0 || puzzle.solution.length >= 18) addMoment('filler-avoid');
  const momentum = analyzeLibertiesSolutionMomentum(puzzle);
  if (momentum.maxReleaseRun >= 2 || momentum.releaseMoveCount >= 2) {
    addMoment('release-chain');
  }
  if (momentum.maxForcedRun >= 4 || (puzzle.difficulty === 'Hard' && momentum.maxForcedRun >= 3)) {
    addMoment('forced-sequence');
  }
  if (puzzle.terrainArchetypes?.includes('bridge')) {
    addMoment('bridge-battle');
  }
  if (puzzle.terrainArchetypes?.includes('squeeze')) {
    addMoment('squeeze-shape');
  }

  return moments;
}

function addFocusTag(tags: LibertiesPuzzleTag[], tag: LibertiesPuzzleTag): void {
  if (!tags.includes(tag)) tags.push(tag);
}

function deriveLibertiesFocusTags(
  spec: LibertiesPuzzleSpec,
  puzzle: LibertiesPuzzle
): LibertiesPuzzleTag[] {
  const tags: LibertiesPuzzleTag[] = [];
  spec.focusTags?.forEach((tag) => addFocusTag(tags, tag));
  const audit = getLibertiesPuzzleAudit(puzzle);

  if (puzzle.difficulty === 'Easy') addFocusTag(tags, 'intro-clear');
  if (audit.sharedOpenSideCount > 0 || audit.maxSharedOpenSideTouches > 1) {
    addFocusTag(tags, 'shared-move');
  }
  if (audit.emptyNeighborPressureMoves >= 2) {
    addFocusTag(tags, 'empty-neighbor');
  }
  if (audit.responseEventCount > 0 || audit.dynamicMoveCount >= 2) addFocusTag(tags, 'response-pressure');
  if (audit.multiStoneCaptureMoves >= 2 || audit.maxCaptureSize >= 3) addFocusTag(tags, 'key-crossing');
  if (audit.solutionCaptureMoves >= 3 || audit.groupCount >= 4) addFocusTag(tags, 'multi-chain');
  if (countEdgeSolutionMoves(puzzle) >= 3) addFocusTag(tags, 'edge-pressure');
  if ((spec.blocks?.length ?? 0) + (spec.frozen?.length ?? 0) > 0) addFocusTag(tags, 'locked-lane');
  if ((spec.terrainArchetypes ?? []).includes('bridge')) addFocusTag(tags, 'key-crossing');
  if ((spec.terrainArchetypes ?? []).includes('squeeze')) addFocusTag(tags, 'multi-chain');
  if (tags.length === 0 && audit.openingIllegalSolutionMoves > 0) addFocusTag(tags, 'empty-neighbor');
  if (tags.length === 0) addFocusTag(tags, 'key-crossing');

  return tags;
}

function getLightOpenSideEntries(puzzle: LibertiesPuzzle, board: LibertiesBoard): Map<string, {
  point: LibertiesPoint;
  groupTouches: number;
}> {
  const entries = new Map<string, { point: LibertiesPoint; groupTouches: number }>();

  getRemainingLibertiesLights(puzzle, board).forEach((group) => {
    group.liberties.forEach((key) => {
      const [row, col] = key.split(':').map(Number);
      const existing = entries.get(key);
      if (existing) {
        existing.groupTouches += 1;
      } else {
        entries.set(key, {
          point: { row: row!, col: col! },
          groupTouches: 1,
        });
      }
    });
  });

  return entries;
}

function getInitialLightOpenSideEntries(puzzle: LibertiesPuzzle): Map<string, {
  point: LibertiesPoint;
  groupTouches: number;
}> {
  return getLightOpenSideEntries(puzzle, createLibertiesBoard(puzzle));
}

function serializeLibertiesBoard(board: LibertiesBoard): string {
  return board
    .map((row) =>
      row
        .map((cell) => {
          if (cell === 'black') return 'B';
          if (cell === 'white') return 'W';
          if (cell === 'frozen') return 'X';
          if (cell === 'release') return 'G';
          return '.';
        })
        .join('')
    )
    .join('/');
}

function countLibertiesBoardCells(board: LibertiesBoard, target: LibertiesCell): number {
  return board.reduce(
    (total, row) => total + row.filter((cell) => cell === target).length,
    0
  );
}

function getSolutionSearchDepth(puzzle: LibertiesPuzzle): number {
  if (puzzle.difficulty === 'Hard') return 46;
  if (puzzle.difficulty === 'Standard') return 36;
  return 24;
}

function deriveLibertiesSolution(puzzle: LibertiesPuzzle): LibertiesPoint[] {
  const maxDepth = getSolutionSearchDepth(puzzle);
  const targetResponses = puzzle.difficulty === 'Hard' ? 4 : puzzle.difficulty === 'Standard' ? 3 : 1;

  const attemptGreedySolve = (desiredResponses: number): LibertiesPoint[] | null => {
    let board = createLibertiesBoard(puzzle);
    const solution: LibertiesPoint[] = [];
    let responseCount = 0;
    const seen = new Set<string>();

    for (let depth = 0; depth < maxDepth; depth += 1) {
      if (isLibertiesSolved(puzzle, board)) return solution;

      const boardKey = serializeLibertiesBoard(board);
      if (seen.has(boardKey)) return null;
      seen.add(boardKey);

      const beforeWhiteCount = countLibertiesBoardCells(board, 'white');
      const candidates = Array.from(getLightOpenSideEntries(puzzle, board).values())
        .map((entry) => {
          const result = playLibertiesMove(board, puzzle.size, entry.point, 'black', puzzle);
          if (!result.legal) return null;
          const afterWhiteCount = countLibertiesBoardCells(result.board, 'white');
          const ownGroup = getLibertiesGroupAt(result.board, puzzle.size, entry.point);
          const captureScore = result.captured.length * 28;
          const sharedScore = entry.groupTouches * 13;
          const wantsResponse = responseCount < desiredResponses;
          const responseScore = result.responses.length * (wantsResponse ? 18 : -18);
          const progressScore = (beforeWhiteCount - afterWhiteCount) * 16;
          const breathScore = Math.min(3, ownGroup?.liberties.size ?? 0) * 2;
          const whitePenalty = Math.max(0, afterWhiteCount - beforeWhiteCount) * 5;
          const score =
            captureScore +
            sharedScore +
            responseScore +
            progressScore +
            breathScore -
            whitePenalty -
            1;

          return {
            point: entry.point,
            result,
            score,
            captureCount: result.captured.length,
            touchCount: entry.groupTouches,
            responseCount: result.responses.length,
          };
        })
        .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null)
        .sort(
          (a, b) =>
            b.score - a.score ||
            b.captureCount - a.captureCount ||
            b.responseCount - a.responseCount ||
            b.touchCount - a.touchCount ||
            pointKey(a.point).localeCompare(pointKey(b.point))
        );

      const selected = candidates[0];
      if (!selected) return null;
      board = selected.result.board;
      solution.push(selected.point);
      responseCount += selected.responseCount;
    }

    return isLibertiesSolved(puzzle, board) ? solution : null;
  };

  const solution = attemptGreedySolve(targetResponses) ?? attemptGreedySolve(0);
  if (!solution) {
    throw new Error(`Liberties puzzle ${puzzle.id} did not solve within ${maxDepth} moves`);
  }

  return solution;
}

function positiveModulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

export function pointKey(point: LibertiesPoint): string {
  return `${point.row}:${point.col}`;
}

export function samePoint(a: LibertiesPoint, b: LibertiesPoint): boolean {
  return a.row === b.row && a.col === b.col;
}

export function getLibertiesNeighbors(point: LibertiesPoint, size: number): LibertiesPoint[] {
  return [
    { row: point.row - 1, col: point.col },
    { row: point.row + 1, col: point.col },
    { row: point.row, col: point.col - 1 },
    { row: point.row, col: point.col + 1 },
  ].filter((candidate) => isPointOnBoard(candidate, size));
}

export function isPointOnBoard(point: LibertiesPoint, size: number): boolean {
  return point.row >= 0 && point.row < size && point.col >= 0 && point.col < size;
}

export function cloneLibertiesBoard(board: LibertiesBoard): LibertiesBoard {
  return board.map((row) => [...row]);
}

export function createLibertiesBoard(puzzle: LibertiesPuzzle): LibertiesBoard {
  return puzzle.layout.map((row) =>
    row.split('').map((cell) => {
      if (cell === 'B') return 'frozen';
      if (cell === 'W') return 'white';
      if (cell === 'X') return 'frozen';
      if (cell === 'G') return 'release';
      return null;
    })
  );
}

export function getLibertiesLightKeys(puzzle: LibertiesPuzzle): Set<string> {
  const lightKeys = new Set<string>();
  puzzle.layout.forEach((row, rowIndex) => {
    row.split('').forEach((cell, colIndex) => {
      if (cell === 'W') lightKeys.add(pointKey({ row: rowIndex, col: colIndex }));
    });
  });
  return lightKeys;
}

export function getLibertiesGroupAt(
  board: LibertiesBoard,
  size: number,
  start: LibertiesPoint
): LibertiesGroup | null {
  if (!isPointOnBoard(start, size)) return null;
  const color = board[start.row]?.[start.col];
  if (color !== 'black' && color !== 'white') return null;

  const stones: LibertiesPoint[] = [];
  const liberties = new Set<string>();
  const visited = new Set<string>();
  const stack = [start];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentKey = pointKey(current);
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);
    stones.push(current);

    getLibertiesNeighbors(current, size).forEach((neighbor) => {
      const occupant = board[neighbor.row]?.[neighbor.col];
      if (!occupant) {
        liberties.add(pointKey(neighbor));
      } else if (occupant === color && !visited.has(pointKey(neighbor))) {
        stack.push(neighbor);
      }
    });
  }

  return { color, stones, liberties };
}

export function getLibertiesGroups(
  board: LibertiesBoard,
  size: number,
  color?: LibertiesStoneColor
): LibertiesGroup[] {
  const groups: LibertiesGroup[] = [];
  const visited = new Set<string>();

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const point = { row, col };
      const key = pointKey(point);
      const occupant = board[row]?.[col];
      if (
        occupant !== 'black' &&
        occupant !== 'white'
      ) {
        continue;
      }
      if (visited.has(key) || (color && occupant !== color)) continue;

      const group = getLibertiesGroupAt(board, size, point);
      if (!group) continue;
      group.stones.forEach((stone) => visited.add(pointKey(stone)));
      groups.push(group);
    }
  }

  return groups;
}

function isLightGroupCleared(
  board: LibertiesBoard,
  puzzle: Pick<LibertiesPuzzle, 'lightGroups'>,
  groupIndex: number
): boolean {
  const group = puzzle.lightGroups[groupIndex];
  if (!group) return false;
  return group.every((stone) => board[stone.row]?.[stone.col] !== 'white');
}

function releasePebblesForClearedGroups(
  board: LibertiesBoard,
  puzzle?: Partial<Pick<LibertiesPuzzle, 'releaseLinks' | 'lightGroups'>>
): LibertiesPoint[] {
  if (!puzzle?.releaseLinks || !puzzle.lightGroups || puzzle.releaseLinks.length === 0) return [];

  const released: LibertiesPoint[] = [];
  const lightGroups = puzzle.lightGroups;
  puzzle.releaseLinks.forEach((release) => {
    if (board[release.point.row]?.[release.point.col] !== 'release') return;
    if (!isLightGroupCleared(board, { lightGroups }, release.groupIndex)) return;
    board[release.point.row]![release.point.col] = null;
    released.push({ ...release.point });
  });
  return released;
}

function removeLibertiesStones(board: LibertiesBoard, stones: LibertiesPoint[]): void {
  stones.forEach((stone) => {
    board[stone.row]![stone.col] = null;
  });
}

function captureEnclosedLibertiesGroups(
  board: LibertiesBoard,
  size: number,
  color: LibertiesStoneColor
): LibertiesPoint[] {
  const captured = getLibertiesGroups(board, size, color)
    .filter((group) => group.liberties.size === 0)
    .flatMap((group) => group.stones);

  removeLibertiesStones(board, captured);
  return captured;
}

function parsePointKey(key: string): LibertiesPoint {
  const [row, col] = key.split(':').map(Number);
  return { row: row!, col: col! };
}

function getEscapeLaneLength(
  board: LibertiesBoard,
  size: number,
  group: LibertiesGroup,
  liberty: LibertiesPoint
): number {
  return group.stones.reduce((best, stone) => {
    const rowDelta = liberty.row - stone.row;
    const colDelta = liberty.col - stone.col;
    if (Math.abs(rowDelta) + Math.abs(colDelta) !== 1) return best;

    let length = 1;
    let cursor = { row: liberty.row + rowDelta, col: liberty.col + colDelta };
    while (isPointOnBoard(cursor, size) && board[cursor.row]?.[cursor.col] === null) {
      length += 1;
      cursor = { row: cursor.row + rowDelta, col: cursor.col + colDelta };
    }
    return Math.max(best, length);
  }, 1);
}

function getGroupSortKey(group: LibertiesGroup): string {
  return group.stones.map(pointKey).sort().join('|');
}

function pickChaseResponsePoint(board: LibertiesBoard, size: number): LibertiesPoint | null {
  const candidates = getLibertiesGroups(board, size, 'white').flatMap((group) =>
    Array.from(group.liberties)
      .map(parsePointKey)
      .filter((point) => board[point.row]?.[point.col] === null)
      .map((point) => ({
        point,
        urgent: group.liberties.size === 1,
        laneLength: getEscapeLaneLength(board, size, group, point),
        groupKey: getGroupSortKey(group),
      }))
  );

  candidates.sort(
    (a, b) =>
      Number(b.urgent) - Number(a.urgent) ||
      b.laneLength - a.laneLength ||
      a.point.row - b.point.row ||
      a.point.col - b.point.col ||
      a.groupKey.localeCompare(b.groupKey)
  );

  return candidates[0]?.point ?? null;
}

function applyLightResponse(
  board: LibertiesBoard,
  size: number,
  responsePoint: LibertiesPoint | null
): { responses: LibertiesPoint[]; capturedDark: LibertiesPoint[] } {
  if (!responsePoint || board[responsePoint.row]?.[responsePoint.col] !== null) {
    return { responses: [], capturedDark: [] };
  }

  board[responsePoint.row]![responsePoint.col] = 'white';
  const capturedDark = captureEnclosedLibertiesGroups(board, size, 'black');
  return { responses: [{ ...responsePoint }], capturedDark };
}

export function playLibertiesMove(
  board: LibertiesBoard,
  size: number,
  move: LibertiesPoint,
  color: LibertiesStoneColor = 'black',
  puzzle?: Partial<Pick<LibertiesPuzzle, 'releaseLinks' | 'lightGroups' | 'variant' | 'difficulty'>>
): LibertiesMoveResult {
  if (!isPointOnBoard(move, size)) {
    return { legal: false, board, reason: 'outside-board' };
  }
  if (board[move.row]?.[move.col]) {
    return { legal: false, board, reason: 'occupied' };
  }

  const next = cloneLibertiesBoard(board);
  const opponent: LibertiesStoneColor = color === 'black' ? 'white' : 'black';
  next[move.row][move.col] = color;

  let captured = captureEnclosedLibertiesGroups(next, size, opponent);

  const released = releasePebblesForClearedGroups(next, puzzle);
  const ownGroup = getLibertiesGroupAt(next, size, move);
  if (!ownGroup || ownGroup.liberties.size === 0) {
    return { legal: false, board, reason: 'suicide' };
  }

  let responses: LibertiesPoint[] = [];
  let capturedDark: LibertiesPoint[] = [];
  if (color === 'black' && captured.length === 0) {
    const response = applyLightResponse(next, size, pickChaseResponsePoint(next, size));
    responses = response.responses;
    capturedDark = response.capturedDark;
    if (responses.length > 0) {
      captured = captured.concat(captureEnclosedLibertiesGroups(next, size, opponent));
    }
  }

  return { legal: true, board: next, captured, capturedDark, released, responses };
}

export function replayLibertiesMoves(
  puzzle: LibertiesPuzzle,
  moves: LibertiesPoint[]
): LibertiesReplayResult {
  let board = createLibertiesBoard(puzzle);
  const captured: LibertiesPoint[] = [];
  const capturedDark: LibertiesPoint[] = [];
  const released: LibertiesPoint[] = [];
  const responses: LibertiesPoint[] = [];

  for (let index = 0; index < moves.length; index += 1) {
    const result = playLibertiesMove(board, puzzle.size, moves[index]!, 'black', puzzle);
    if (!result.legal) {
      return { board, illegalMoveIndex: index, captured, capturedDark, released, responses };
    }
    board = result.board;
    captured.push(...result.captured);
    capturedDark.push(...result.capturedDark);
    released.push(...result.released);
    responses.push(...result.responses);
  }

  return { board, illegalMoveIndex: null, captured, capturedDark, released, responses };
}

type LegalLibertiesMoveResult = Extract<LibertiesMoveResult, { legal: true }>;

interface LiveHintCandidate {
  point: LibertiesPoint;
  result: LegalLibertiesMoveResult;
  score: number;
  captureCount: number;
  progressCount: number;
  responseCount: number;
  touchCount: number;
  whiteCountAfter: number;
  solutionRank: number;
}

const MISSING_SOLUTION_RANK = Number.MAX_SAFE_INTEGER;
const LIVE_HINT_CANDIDATE_LIMIT = 10;
const LIVE_HINT_ROUTE_CACHE_LIMIT = 600;

const liveHintRouteCache = new Map<string, LibertiesHintResult>();
const lowestMoveCountCache = new Map<string, number>();
const lowestMoveRouteCache = new Map<string, LibertiesPoint[]>();
const generatedMinimumRouteCache = new Map<string, LibertiesPoint[]>();
const libertiesPuzzleAuditCache = new Map<string, LibertiesPuzzleAudit>();

function getSolutionRankMap(puzzle: Pick<LibertiesPuzzle, 'solution'>): Map<string, number> {
  const ranks = new Map<string, number>();
  puzzle.solution.forEach((point, index) => {
    if (!ranks.has(pointKey(point))) ranks.set(pointKey(point), index);
  });
  return ranks;
}

function getSolutionRank(ranks: Map<string, number>, point: LibertiesPoint): number {
  return ranks.get(pointKey(point)) ?? MISSING_SOLUTION_RANK;
}

function getLiveHintCandidates(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard,
  desiredResponses: number,
  responseCount: number,
  solutionRanks: Map<string, number>,
  limit = Number.POSITIVE_INFINITY
): LiveHintCandidate[] {
  const beforeWhiteCount = countLibertiesBoardCells(board, 'white');

  return Array.from(getLightOpenSideEntries(puzzle, board).values())
    .map((entry): LiveHintCandidate | null => {
      const result = playLibertiesMove(board, puzzle.size, entry.point, 'black', puzzle);
      if (!result.legal) return null;
      const afterWhiteCount = countLibertiesBoardCells(result.board, 'white');
      const ownGroup = getLibertiesGroupAt(result.board, puzzle.size, entry.point);
      const wantsResponse = responseCount < desiredResponses;
      const captureScore = result.captured.length * 28;
      const sharedScore = entry.groupTouches * 13;
      const responseScore = result.responses.length * (wantsResponse ? 18 : -18);
      const progressScore = (beforeWhiteCount - afterWhiteCount) * 16;
      const breathScore = Math.min(3, ownGroup?.liberties.size ?? 0) * 2;
      const whitePenalty = Math.max(0, afterWhiteCount - beforeWhiteCount) * 5;

      return {
        point: entry.point,
        result,
        score: captureScore + sharedScore + responseScore + progressScore + breathScore - whitePenalty - 1,
        captureCount: result.captured.length,
        progressCount: beforeWhiteCount - afterWhiteCount,
        responseCount: result.responses.length,
        touchCount: entry.groupTouches,
        whiteCountAfter: afterWhiteCount,
        solutionRank: getSolutionRank(solutionRanks, entry.point),
      };
    })
    .filter((candidate): candidate is LiveHintCandidate => candidate !== null)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.captureCount - a.captureCount ||
        b.progressCount - a.progressCount ||
        b.responseCount - a.responseCount ||
        b.touchCount - a.touchCount ||
        a.solutionRank - b.solutionRank ||
        pointKey(a.point).localeCompare(pointKey(b.point))
    )
    .slice(0, limit);
}

function solveLibertiesGreedyFromBoard(
  puzzle: LibertiesPuzzle,
  startBoard: LibertiesBoard,
  solutionRanks: Map<string, number>,
  maxDepth: number
): LibertiesPoint[] | null {
  if (isLibertiesSolved(puzzle, startBoard)) return [];

  const targetResponses = puzzle.difficulty === 'Hard' ? 4 : puzzle.difficulty === 'Standard' ? 3 : 1;

  const attemptGreedySolve = (desiredResponses: number): LibertiesPoint[] | null => {
    let board = cloneLibertiesBoard(startBoard);
    const solution: LibertiesPoint[] = [];
    let responseCount = 0;
    const seen = new Set<string>();

    for (let depth = 0; depth < maxDepth; depth += 1) {
      if (isLibertiesSolved(puzzle, board)) return solution;

      const boardKey = serializeLibertiesBoard(board);
      if (seen.has(boardKey)) return null;
      seen.add(boardKey);

      const selected = getLiveHintCandidates(
        puzzle,
        board,
        desiredResponses,
        responseCount,
        solutionRanks,
        1
      )[0];
      if (!selected) return null;

      board = selected.result.board;
      solution.push(selected.point);
      responseCount += selected.responseCount;
    }

    return isLibertiesSolved(puzzle, board) ? solution : null;
  };

  return attemptGreedySolve(targetResponses) ?? attemptGreedySolve(0);
}

function getLiveHintRouteCacheKey(puzzle: Pick<LibertiesPuzzle, 'id'>, board: LibertiesBoard): string {
  return `${puzzle.id}:${serializeLibertiesBoard(board)}`;
}

function cloneHintRoute(route: LibertiesPoint[]): LibertiesPoint[] {
  return route.map((point) => ({ ...point }));
}

function cacheLiveHintRoute(
  puzzle: LibertiesPuzzle,
  startBoard: LibertiesBoard,
  route: LibertiesPoint[]
): void {
  let board = cloneLibertiesBoard(startBoard);

  for (let index = 0; index < route.length; index += 1) {
    const suffix = cloneHintRoute(route.slice(index));
    const key = getLiveHintRouteCacheKey(puzzle, board);
    liveHintRouteCache.set(key, {
      point: suffix[0]!,
      route: suffix,
      movesToSolve: suffix.length,
    });

    const result = playLibertiesMove(board, puzzle.size, route[index]!, 'black', puzzle);
    if (!result.legal) break;
    board = result.board;
  }

  if (liveHintRouteCache.size > LIVE_HINT_ROUTE_CACHE_LIMIT) {
    Array.from(liveHintRouteCache.keys())
      .slice(0, liveHintRouteCache.size - LIVE_HINT_ROUTE_CACHE_LIMIT)
      .forEach((key) => liveHintRouteCache.delete(key));
  }
}

function scoreLibertiesHintBoard(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard,
  routeLength: number
): number {
  const groups = getRemainingLibertiesLights(puzzle, board);
  const whiteCount = countLibertiesBoardCells(board, 'white');
  const totalOpenSides = groups.reduce((total, group) => total + group.liberties.size, 0);
  const minimumOpenSides = Math.min(...groups.map((group) => group.liberties.size));
  const urgentBonus = minimumOpenSides === 1 ? 20 : 0;

  return (
    urgentBonus -
    groups.length * 80 -
    whiteCount * 15 -
    totalOpenSides * 8 -
    routeLength * 2
  );
}

function scoreLibertiesHintCandidate(candidate: LiveHintCandidate): number {
  return (
    candidate.captureCount * 120 +
    candidate.progressCount * 40 +
    candidate.touchCount * 20 -
    candidate.responseCount * 10 -
    candidate.whiteCountAfter * 2 +
    candidate.score
  );
}

function getLiveHintBeamWidth(difficulty: LibertiesDifficulty): number {
  if (difficulty === 'Hard') return 90;
  if (difficulty === 'Standard') return 60;
  return 40;
}

function getLiveHintTimeBudgetMs(difficulty: LibertiesDifficulty): number {
  if (difficulty === 'Hard') return 800;
  if (difficulty === 'Standard') return 500;
  return 250;
}

function getGenerationMoveFloorBudgetMs(difficulty: LibertiesDifficulty): number {
  if (process.env.LIBERTIES_FAST_GEN === '1') {
    if (difficulty === 'Hard') return 140;
    if (difficulty === 'Standard') return 100;
    return 60;
  }
  if (difficulty === 'Hard') return 450;
  if (difficulty === 'Standard') return 320;
  return 180;
}

function getMoveFloorTimeBudgetMs(difficulty: LibertiesDifficulty): number {
  return getGenerationMoveFloorBudgetMs(difficulty);
}

function findMoveOptimizedLibertiesRoute(
  puzzle: LibertiesPuzzle,
  startBoard: LibertiesBoard,
  solutionRanks: Map<string, number>,
  timeBudgetMs = getLiveHintTimeBudgetMs(puzzle.difficulty)
): LibertiesPoint[] | null {
  if (isLibertiesSolved(puzzle, startBoard)) return [];

  const startedAt = Date.now();
  const deadline = startedAt + timeBudgetMs;
  const beamWidth = getLiveHintBeamWidth(puzzle.difficulty);
  const maxDepth = getSolutionSearchDepth(puzzle);
  const targetResponses = puzzle.difficulty === 'Hard' ? 4 : puzzle.difficulty === 'Standard' ? 3 : 1;
  const seen = new Map<string, number>([[serializeLibertiesBoard(startBoard), 0]]);
  let frontier: Array<{
    board: LibertiesBoard;
    route: LibertiesPoint[];
    responseCount: number;
    score: number;
  }> = [
    {
      board: cloneLibertiesBoard(startBoard),
      route: [],
      responseCount: 0,
      score: scoreLibertiesHintBoard(puzzle, startBoard, 0),
    },
  ];

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const nextFrontier: typeof frontier = [];

    for (const state of frontier) {
      if (Date.now() > deadline) return null;

      const candidates = getLiveHintCandidates(
        puzzle,
        state.board,
        targetResponses,
        state.responseCount,
        solutionRanks
      );

      for (const candidate of candidates) {
        const route = [...state.route, candidate.point];
        if (isLibertiesSolved(puzzle, candidate.result.board)) {
          return route;
        }

        const boardKey = serializeLibertiesBoard(candidate.result.board);
        const previousDepth = seen.get(boardKey);
        if (previousDepth !== undefined && previousDepth <= route.length) continue;
        seen.set(boardKey, route.length);

        nextFrontier.push({
          board: candidate.result.board,
          route,
          responseCount: state.responseCount + candidate.responseCount,
          score:
            scoreLibertiesHintBoard(puzzle, candidate.result.board, route.length) +
            scoreLibertiesHintCandidate(candidate),
        });
      }
    }

    if (nextFrontier.length === 0) return null;
    nextFrontier.sort((a, b) => b.score - a.score || a.route.length - b.route.length);
    frontier = nextFrontier.slice(0, beamWidth);
  }

  return null;
}

function getMoveFloorGenerationTimeBudgetMs(difficulty: LibertiesDifficulty): number {
  return getGenerationMoveFloorBudgetMs(difficulty);
}

function routeSolvesLibertiesPuzzle(puzzle: LibertiesPuzzle, route: LibertiesPoint[]): boolean {
  const replay = replayLibertiesMoves(puzzle, route);
  return replay.illegalMoveIndex === null && isLibertiesSolved(puzzle, replay.board);
}

function getGeneratedLibertiesMinimumRoute(puzzle: LibertiesPuzzle): LibertiesPoint[] {
  const cached = generatedMinimumRouteCache.get(puzzle.id);
  if (cached) return cloneHintRoute(cached);

  const route = findMoveOptimizedLibertiesRoute(
    puzzle,
    createLibertiesBoard(puzzle),
    getSolutionRankMap(puzzle),
    getMoveFloorGenerationTimeBudgetMs(puzzle.difficulty)
  );

  if (route && route.length > 0 && route.length <= puzzle.solution.length && routeSolvesLibertiesPuzzle(puzzle, route)) {
    generatedMinimumRouteCache.set(puzzle.id, cloneHintRoute(route));
    return cloneHintRoute(route);
  }

  generatedMinimumRouteCache.set(puzzle.id, cloneHintRoute(puzzle.solution));
  return cloneHintRoute(puzzle.solution);
}

function getMinimumMoveFloorThreshold(puzzle: LibertiesPuzzle): number {
  if (puzzle.difficulty === 'Hard') return puzzle.size >= 10 ? 18 : 13;
  if (puzzle.difficulty === 'Standard') return 9;
  return 6;
}

function getMaximumGeneratedToFloorGap(puzzle: LibertiesPuzzle): number {
  if (puzzle.difficulty === 'Hard') return puzzle.size >= 10 ? 20 : 16;
  if (puzzle.difficulty === 'Standard') return 16;
  return 12;
}

function candidatePassesMoveFloorGate(puzzle: LibertiesPuzzle): boolean {
  const minMoves = puzzle.minMoves ?? puzzle.targetMoves;
  const generatedToFloorGap = Math.max(0, puzzle.targetMoves - minMoves);
  return minMoves >= getMinimumMoveFloorThreshold(puzzle) && generatedToFloorGap <= getMaximumGeneratedToFloorGap(puzzle);
}

function withLibertiesMinimumRoute(puzzle: LibertiesPuzzle): LibertiesPuzzle {
  const minSolution = getGeneratedLibertiesMinimumRoute(puzzle);
  return {
    ...puzzle,
    minMoves: minSolution.length,
    minSolution,
  };
}

function withLibertiesMinimumRoutes(puzzles: LibertiesPuzzle[]): LibertiesPuzzle[] {
  return puzzles.map(withLibertiesMinimumRoute);
}

function getInitialMoveOptimizedLibertiesRoute(puzzle: LibertiesPuzzle): LibertiesPoint[] | null {
  const cached = lowestMoveRouteCache.get(puzzle.id);
  if (cached) return cloneHintRoute(cached);

  if (Array.isArray(puzzle.minSolution) && puzzle.minSolution.length > 0) {
    const route = cloneHintRoute(puzzle.minSolution);
    lowestMoveRouteCache.set(puzzle.id, cloneHintRoute(route));
    lowestMoveCountCache.set(puzzle.id, route.length);
    cacheLiveHintRoute(puzzle, createLibertiesBoard(puzzle), route);
    return cloneHintRoute(route);
  }

  const board = createLibertiesBoard(puzzle);
  const route = findMoveOptimizedLibertiesRoute(
    puzzle,
    board,
    getSolutionRankMap(puzzle),
    getMoveFloorTimeBudgetMs(puzzle.difficulty)
  );

  if (!route || route.length === 0) return route;

  lowestMoveRouteCache.set(puzzle.id, cloneHintRoute(route));
  lowestMoveCountCache.set(puzzle.id, route.length);
  cacheLiveHintRoute(puzzle, board, route);
  return cloneHintRoute(route);
}

function getPackedSolutionRouteFromBoard(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard
): LibertiesPoint[] | null {
  const targetBoardKey = serializeLibertiesBoard(board);
  let cursor = createLibertiesBoard(puzzle);

  for (let index = 0; index <= puzzle.solution.length; index += 1) {
    if (serializeLibertiesBoard(cursor) === targetBoardKey) {
      return puzzle.solution.slice(index);
    }

    const move = puzzle.solution[index];
    if (!move) break;
    const result = playLibertiesMove(cursor, puzzle.size, move, 'black', puzzle);
    if (!result.legal) return null;
    cursor = result.board;
  }

  return null;
}

export function getBestLibertiesHintMove(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard
): LibertiesHintResult | null {
  if (isLibertiesSolved(puzzle, board)) return null;

  const initialBoardKey = serializeLibertiesBoard(createLibertiesBoard(puzzle));
  const currentBoardKey = serializeLibertiesBoard(board);
  if (currentBoardKey === initialBoardKey) {
    const route = getInitialMoveOptimizedLibertiesRoute(puzzle);
    if (route && route.length > 0) {
      return liveHintRouteCache.get(getLiveHintRouteCacheKey(puzzle, board)) ?? {
        point: route[0]!,
        route,
        movesToSolve: route.length,
      };
    }
  }

  const cached = liveHintRouteCache.get(getLiveHintRouteCacheKey(puzzle, board));
  if (cached) return cached;

  const solutionRanks = getSolutionRankMap(puzzle);
  const optimizedRoute = findMoveOptimizedLibertiesRoute(puzzle, board, solutionRanks);
  if (optimizedRoute && optimizedRoute.length > 0) {
    cacheLiveHintRoute(puzzle, board, optimizedRoute);
    return liveHintRouteCache.get(getLiveHintRouteCacheKey(puzzle, board)) ?? null;
  }

  const packedRoute = getPackedSolutionRouteFromBoard(puzzle, board);
  if (packedRoute && packedRoute.length > 0) {
    return {
      point: packedRoute[0]!,
      route: packedRoute,
      movesToSolve: packedRoute.length,
    };
  }

  const maxDepth = getSolutionSearchDepth(puzzle);
  const targetResponses = puzzle.difficulty === 'Hard' ? 4 : puzzle.difficulty === 'Standard' ? 3 : 1;
  const candidates = getLiveHintCandidates(
    puzzle,
    board,
    targetResponses,
    0,
    solutionRanks,
    LIVE_HINT_CANDIDATE_LIMIT
  );
  let best: LibertiesHintResult | undefined;
  let bestCandidate: LiveHintCandidate | null = null;

  candidates.forEach((candidate) => {
    const rest = solveLibertiesGreedyFromBoard(
      puzzle,
      candidate.result.board,
      solutionRanks,
      maxDepth - 1
    );
    if (!rest) return;

    const route = [candidate.point, ...rest];
    const result: LibertiesHintResult = {
      point: candidate.point,
      route,
      movesToSolve: route.length,
    };

    if (
      !best ||
      result.movesToSolve < best.movesToSolve ||
      (result.movesToSolve === best.movesToSolve &&
        (candidate.solutionRank < (bestCandidate?.solutionRank ?? MISSING_SOLUTION_RANK) ||
          (candidate.solutionRank === (bestCandidate?.solutionRank ?? MISSING_SOLUTION_RANK) &&
            candidate.score > (bestCandidate?.score ?? Number.NEGATIVE_INFINITY))))
    ) {
      best = result;
      bestCandidate = candidate;
    }
  });

  if (best !== undefined) {
    cacheLiveHintRoute(puzzle, board, best.route);
    return liveHintRouteCache.get(getLiveHintRouteCacheKey(puzzle, board)) ?? best;
  }
  const fallback = candidates[0];
  if (!fallback) return null;

  return {
    point: fallback.point,
    route: [fallback.point],
    movesToSolve: 1,
  };
}

export function getLowestLibertiesMoveCount(puzzle: LibertiesPuzzle): number {
  if (typeof puzzle.minMoves === 'number' && (puzzle.minMoves > 0 || puzzle.solution.length === 0)) {
    return puzzle.minMoves;
  }

  const cached = lowestMoveCountCache.get(puzzle.id);
  if (cached !== undefined) return cached;

  const route = getInitialMoveOptimizedLibertiesRoute(puzzle);
  const moveCount = route?.length ?? puzzle.targetMoves;
  lowestMoveCountCache.set(puzzle.id, moveCount);
  return moveCount;
}

export function isLibertiesSolved(puzzle: LibertiesPuzzle, board: LibertiesBoard): boolean {
  return getLibertiesGroups(board, puzzle.size, 'white').length === 0;
}

export function getRemainingLibertiesLights(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard
): LibertiesGroup[] {
  return getLibertiesGroups(board, puzzle.size, 'white');
}

function countBoardAdjacency(
  board: LibertiesBoard,
  size: number,
  fromCell: LibertiesCell,
  toCell: LibertiesCell
): number {
  let adjacencyCount = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row]?.[col] !== fromCell) continue;
      getLibertiesNeighbors({ row, col }, size).forEach((neighbor) => {
        if (board[neighbor.row]?.[neighbor.col] === toCell) {
          adjacencyCount += 1;
        }
      });
    }
  }
  return adjacencyCount;
}

function getBlockersNearLights(board: LibertiesBoard, size: number): number {
  let blockerCount = 0;
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row]?.[col] !== 'frozen') continue;
      const nearLight = getLibertiesGroups(board, size, 'white').some((group) =>
        group.stones.some((stone) => Math.abs(stone.row - row) + Math.abs(stone.col - col) <= 2)
      );
      if (nearLight) blockerCount += 1;
    }
  }
  return blockerCount;
}

function getBlockedStretchPathCount(board: LibertiesBoard, size: number): number {
  let blockedPathCount = 0;

  getLibertiesGroups(board, size, 'white').forEach((group) => {
    Array.from(group.liberties).forEach((libertyKey) => {
      const liberty = parsePointKey(libertyKey);
      group.stones.forEach((stone) => {
        const rowDelta = liberty.row - stone.row;
        const colDelta = liberty.col - stone.col;
        if (Math.abs(rowDelta) + Math.abs(colDelta) !== 1) return;
        let cursor = { row: liberty.row + rowDelta, col: liberty.col + colDelta };
        while (isPointOnBoard(cursor, size)) {
          const cell = board[cursor.row]?.[cursor.col];
          if (cell === 'frozen') {
            blockedPathCount += 1;
            break;
          }
          if (cell !== null) break;
          cursor = { row: cursor.row + rowDelta, col: cursor.col + colDelta };
        }
      });
    });
  });

  return blockedPathCount;
}

function getLegalLibertiesCandidateMoves(
  puzzle: LibertiesPuzzle,
  board: LibertiesBoard
): Array<{
  point: LibertiesPoint;
  result: Extract<LibertiesMoveResult, { legal: true }>;
  groupTouches: number;
  whiteCountAfter: number;
}> {
  return Array.from(getLightOpenSideEntries(puzzle, board).values())
    .map((entry) => {
      const result = playLibertiesMove(board, puzzle.size, entry.point, 'black', puzzle);
      if (!result.legal) return null;
      return {
        point: entry.point,
        result,
        groupTouches: entry.groupTouches,
        whiteCountAfter: countLibertiesBoardCells(result.board, 'white'),
      };
    })
    .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);
}

function solveLibertiesBySimplePolicy(
  puzzle: LibertiesPuzzle,
  policy: 'naive-fill' | 'greedy-clear'
): number {
  let board = createLibertiesBoard(puzzle);
  const maxDepth = Math.max(getSolutionSearchDepth(puzzle), puzzle.solution.length + 12);
  const seen = new Set<string>();

  for (let depth = 0; depth < maxDepth; depth += 1) {
    if (isLibertiesSolved(puzzle, board)) return depth;
    const boardKey = serializeLibertiesBoard(board);
    if (seen.has(boardKey)) return maxDepth + 1;
    seen.add(boardKey);

    const candidates = getLegalLibertiesCandidateMoves(puzzle, board);
    if (candidates.length === 0) return maxDepth + 1;

    if (policy === 'naive-fill') {
      candidates.sort((a, b) => a.point.row - b.point.row || a.point.col - b.point.col);
    } else {
      candidates.sort(
        (a, b) =>
          b.result.captured.length - a.result.captured.length ||
          b.groupTouches - a.groupTouches ||
          a.whiteCountAfter - b.whiteCountAfter ||
          a.result.responses.length - b.result.responses.length ||
          a.point.row - b.point.row ||
          a.point.col - b.point.col
      );
    }

    board = candidates[0]!.result.board;
  }

  return maxDepth + 1;
}

function analyzeLibertiesRouteQuality(
  puzzle: LibertiesPuzzle,
  initialOpenSideKeys: Set<string>
): {
  decisionPointCount: number;
  tempoClearCount: number;
  stretchPressureCount: number;
  sharedCrossingMoveCount: number;
  whitePunishCount: number;
  fillerMoves: number;
} {
  let board = createLibertiesBoard(puzzle);
  let decisionPointCount = 0;
  let tempoClearCount = 0;
  let stretchPressureCount = 0;
  let sharedCrossingMoveCount = 0;
  let whitePunishCount = 0;
  let fillerMoves = 0;

  puzzle.solution.forEach((move) => {
    const moveKey = pointKey(move);
    const openSideEntries = getLightOpenSideEntries(puzzle, board);
    const preMoveTouches = openSideEntries.get(moveKey)?.groupTouches ?? 0;
    const candidates = getLegalLibertiesCandidateMoves(puzzle, board);
    const moveCandidate = candidates.find((candidate) => samePoint(candidate.point, move));
    if (candidates.length >= 3 && moveCandidate) {
      const bestCapture = Math.max(...candidates.map((candidate) => candidate.result.captured.length));
      const bestTouches = Math.max(...candidates.map((candidate) => candidate.groupTouches));
      if (moveCandidate.result.captured.length < bestCapture || moveCandidate.groupTouches < bestTouches || candidates.length >= 4) {
        decisionPointCount += 1;
      }
    }

    const result = playLibertiesMove(board, puzzle.size, move, 'black', puzzle);
    if (!result.legal) return;
    if (result.captured.length > 0 && result.responses.length === 0) tempoClearCount += result.captured.length;
    if (result.responses.length > 0) stretchPressureCount += result.responses.length;
    if (preMoveTouches > 1) sharedCrossingMoveCount += 1;
    if (result.capturedDark.length > 0) whitePunishCount += result.capturedDark.length;
    if (result.captured.length === 0 && result.responses.length === 0 && preMoveTouches === 0) {
      fillerMoves += 1;
    }
    board = result.board;
  });

  return {
    decisionPointCount,
    tempoClearCount,
    stretchPressureCount,
    sharedCrossingMoveCount,
    whitePunishCount,
    fillerMoves,
  };
}

export function getLibertiesPuzzleAudit(puzzle: LibertiesPuzzle): LibertiesPuzzleAudit {
  const auditCacheKey = [
    puzzle.id,
    puzzle.layout.join('/'),
    puzzle.targetMoves,
    puzzle.minMoves ?? '',
    puzzle.solution.length,
    puzzle.minSolution?.length ?? '',
  ].join('::');
  const cachedAudit = libertiesPuzzleAuditCache.get(auditCacheKey);
  if (cachedAudit) return cachedAudit;

  const initialBoard = createLibertiesBoard(puzzle);
  const initialGroups = getRemainingLibertiesLights(puzzle, initialBoard);
  const openSideEntries = getInitialLightOpenSideEntries(puzzle);
  const blockerCount = countLibertiesBoardCells(initialBoard, 'frozen');
  const blockerAdjacencyToLight = countBoardAdjacency(initialBoard, puzzle.size, 'frozen', 'white');
  const blockedStretchPathCount = getBlockedStretchPathCount(initialBoard, puzzle.size);
  const blockersNearLights = getBlockersNearLights(initialBoard, puzzle.size);
  const initialWhiteCount = countLibertiesBoardCells(initialBoard, 'white');
  const initialBlackCount = countLibertiesBoardCells(initialBoard, 'black');
  const smallBoardDensityScore = Math.round(
    ((initialWhiteCount + initialBlackCount + blockerCount + openSideEntries.size) / (puzzle.size * puzzle.size)) * 100
  );
  const blockerImpactScore =
    blockerAdjacencyToLight * 4 +
    blockedStretchPathCount * 3 +
    blockersNearLights +
    Math.min(6, puzzle.terrainArchetypes?.length ?? 0) * 2;
  const solutionKeys = new Set(puzzle.solution.map(pointKey));
  const isSameOpenSideSet =
    solutionKeys.size === openSideEntries.size &&
    Array.from(openSideEntries.keys()).every((key) => solutionKeys.has(key));

  let board = initialBoard;
  let emptyNeighborPressureMoves = 0;
  let solutionCaptureMoves = 0;
  let multiStoneCaptureMoves = 0;
  let maxCaptureSize = 0;
  let responseEventCount = 0;
  let raceResponseCount = 0;
  let dynamicMoveCount = 0;
  const releasePointKeys = new Set(puzzle.releaseLinks.map((release) => pointKey(release.point)));
  const initialOpenSideKeys = new Set(openSideEntries.keys());
  const routeQuality = analyzeLibertiesRouteQuality(puzzle, initialOpenSideKeys);

  puzzle.solution.forEach((move, moveIndex) => {
    const preMoveTouches = getLightOpenSideEntries(puzzle, board).get(pointKey(move))?.groupTouches ?? 0;
    const result = playLibertiesMove(board, puzzle.size, move, 'black', puzzle);
    if (!result.legal) return;
    const ownGroup = getLibertiesGroupAt(result.board, puzzle.size, move);
    if (ownGroup && ownGroup.liberties.size <= 1) {
      emptyNeighborPressureMoves += 1;
    }
    if (result.captured.length > 0) {
      solutionCaptureMoves += 1;
    }
    if (result.captured.length > 1) {
      multiStoneCaptureMoves += 1;
    }
    if (result.responses.length > 0) {
      responseEventCount += result.responses.length;
      if (puzzle.variant === 'chase') {
        raceResponseCount += result.responses.length;
      }
    }
    if (!initialOpenSideKeys.has(pointKey(move))) {
      dynamicMoveCount += 1;
    }
    maxCaptureSize = Math.max(maxCaptureSize, result.captured.length);
    board = result.board;
  });

  const openingIllegalSolutionMoves = puzzle.solution.filter((move) => {
    const result = playLibertiesMove(initialBoard, puzzle.size, move, 'black', puzzle);
    return !result.legal;
  }).length;
  const requiredReleaseMoveCount = puzzle.solution.filter((move) => releasePointKeys.has(pointKey(move))).length;
  const delayedMoveCount = openingIllegalSolutionMoves + dynamicMoveCount;
  const maxUnlockDepth = dynamicMoveCount > 0 ? Math.max(1, Math.min(4, responseEventCount)) : 0;
  const fillerMoveRatio = puzzle.solution.length > 0 ? routeQuality.fillerMoves / puzzle.solution.length : 0;
  const optimalMoveCount = puzzle.optimalMoveCount ?? puzzle.minMoves ?? puzzle.minSolution?.length ?? puzzle.solution.length;
  const estimatedNaivePenalty = Math.max(
    0,
    Math.min(
      30,
      Math.floor(routeQuality.decisionPointCount / 2) +
        Math.floor(routeQuality.stretchPressureCount / 3) +
        routeQuality.sharedCrossingMoveCount -
        Math.floor(routeQuality.tempoClearCount / 2)
    )
  );
  const naivePenalty = estimatedNaivePenalty;
  const naiveFillMoveCount = optimalMoveCount + estimatedNaivePenalty;
  const recoveryMargin = Math.max(0, Math.min(20, Math.floor(estimatedNaivePenalty / 2) + routeQuality.whitePunishCount));
  const greedyClearMoveCount = optimalMoveCount + recoveryMargin;
  const terrainUsefulnessScore =
    blockerImpactScore +
    blockedStretchPathCount * 2 +
    blockerAdjacencyToLight +
    routeQuality.stretchPressureCount * 2 +
    routeQuality.sharedCrossingMoveCount * 3;

  const audit: LibertiesPuzzleAudit = {
    groupCount: initialGroups.length,
    initialOpenSideCount: openSideEntries.size,
    sharedOpenSideCount: Array.from(openSideEntries.values()).filter((entry) => entry.groupTouches > 1).length,
    maxSharedOpenSideTouches: Math.max(0, ...Array.from(openSideEntries.values()).map((entry) => entry.groupTouches)),
    blockerCount,
    blockerImpactScore,
    blockerAdjacencyToLight,
    blockedStretchPathCount,
    smallBoardDensityScore,
    reserveRank: puzzle.reserveRank ?? 0,
    openingIllegalSolutionMoves,
    emptyNeighborPressureMoves,
    solutionCaptureMoves,
    multiStoneCaptureMoves,
    maxCaptureSize,
    responseEventCount,
    dynamicMoveCount,
    raceResponseCount,
    releasePebbleCount: puzzle.releaseLinks.length,
    requiredReleaseMoveCount,
    delayedMoveCount,
    maxUnlockDepth,
    captureOrderDependencyScore:
      openingIllegalSolutionMoves +
      dynamicMoveCount +
      responseEventCount +
      solutionCaptureMoves +
      Math.min(3, maxUnlockDepth),
    optimalMoveCount,
    naiveFillMoveCount,
    greedyClearMoveCount,
    naivePenalty,
    decisionPointCount: routeQuality.decisionPointCount,
    tempoClearCount: routeQuality.tempoClearCount,
    stretchPressureCount: routeQuality.stretchPressureCount,
    sharedCrossingMoveCount: routeQuality.sharedCrossingMoveCount,
    whitePunishCount: routeQuality.whitePunishCount,
    recoveryMargin,
    terrainUsefulnessScore,
    calendarNoveltyScore: puzzle.calendarNoveltyScore ?? 0,
    fillerMoveRatio,
    isPureOpeningFill: isSameOpenSideSet && responseEventCount === 0 && dynamicMoveCount === 0 && openingIllegalSolutionMoves === 0,
  };
  libertiesPuzzleAuditCache.set(auditCacheKey, audit);
  return audit;
}

export function getLibertiesPackAudit(puzzles: LibertiesPuzzle[] = libertiesPuzzles): LibertiesPackAudit {
  const difficultyCounts: Record<LibertiesDifficulty, number> = {
    Easy: 0,
    Standard: 0,
    Hard: 0,
  };
  const tagCounts = Object.fromEntries(
    (Object.keys(LIBERTIES_TAG_LABELS) as LibertiesPuzzleTag[]).map((tag) => [tag, 0])
  ) as Record<LibertiesPuzzleTag, number>;
  const terrainArchetypeCounts = Object.fromEntries(
    (Object.keys(LIBERTIES_TERRAIN_ARCHETYPE_LABELS) as LibertiesTerrainArchetype[]).map((archetype) => [
      archetype,
      0,
    ])
  ) as Record<LibertiesTerrainArchetype, number>;
  let minTargetMoves = Number.POSITIVE_INFINITY;
  let maxTargetMoves = 0;
  let targetMoveTotal = 0;
  let minMinimumMoves = Number.POSITIVE_INFINITY;
  let maxMinimumMoves = 0;
  let minimumMoveTotal = 0;
  let targetToMinimumMoveGapTotal = 0;
  let maxTargetToMinimumMoveGap = 0;
  let blockerCountTotal = 0;
  let blockerImpactTotal = 0;
  let minimumBlockerImpactScore = Number.POSITIVE_INFINITY;
  let smallBoardDensityScoreTotal = 0;
  let pureOpeningFillCount = 0;
  let responseEventCount = 0;
  let dynamicMoveCount = 0;
  let raceResponseCount = 0;
  let releasePebbleCount = 0;
  let requiredReleaseMoveCount = 0;
  let delayedMoveCount = 0;
  let maxUnlockDepth = 0;
  let optimalMoveCountTotal = 0;
  let naivePenaltyTotal = 0;
  let decisionPointCountTotal = 0;
  let tempoClearCountTotal = 0;
  let stretchPressureCountTotal = 0;
  let sharedCrossingMoveCountTotal = 0;
  let whitePunishCountTotal = 0;
  let terrainUsefulnessScoreTotal = 0;
  let fillerMoveRatioTotal = 0;

  puzzles.forEach((puzzle) => {
    const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
    difficultyCounts[puzzle.difficulty] += 1;
    puzzle.focusTags.forEach((tag) => {
      tagCounts[tag] += 1;
    });
    puzzle.terrainArchetypes?.forEach((archetype) => {
      terrainArchetypeCounts[archetype] += 1;
    });
    minTargetMoves = Math.min(minTargetMoves, puzzle.targetMoves);
    maxTargetMoves = Math.max(maxTargetMoves, puzzle.targetMoves);
    targetMoveTotal += puzzle.targetMoves;
    const minimumMoves = getLowestLibertiesMoveCount(puzzle);
    const targetToMinimumMoveGap = Math.max(0, puzzle.targetMoves - minimumMoves);
    minMinimumMoves = Math.min(minMinimumMoves, minimumMoves);
    maxMinimumMoves = Math.max(maxMinimumMoves, minimumMoves);
    minimumMoveTotal += minimumMoves;
    targetToMinimumMoveGapTotal += targetToMinimumMoveGap;
    maxTargetToMinimumMoveGap = Math.max(maxTargetToMinimumMoveGap, targetToMinimumMoveGap);
    blockerCountTotal += puzzleAudit.blockerCount;
    blockerImpactTotal += puzzleAudit.blockerImpactScore;
    minimumBlockerImpactScore = Math.min(minimumBlockerImpactScore, puzzleAudit.blockerImpactScore);
    smallBoardDensityScoreTotal += puzzleAudit.smallBoardDensityScore;
    responseEventCount += puzzleAudit.responseEventCount;
    dynamicMoveCount += puzzleAudit.dynamicMoveCount;
    raceResponseCount += puzzleAudit.raceResponseCount;
    releasePebbleCount += puzzleAudit.releasePebbleCount;
    requiredReleaseMoveCount += puzzleAudit.requiredReleaseMoveCount;
    delayedMoveCount += puzzleAudit.delayedMoveCount;
    maxUnlockDepth = Math.max(maxUnlockDepth, puzzleAudit.maxUnlockDepth);
    optimalMoveCountTotal += puzzleAudit.optimalMoveCount;
    naivePenaltyTotal += puzzleAudit.naivePenalty;
    decisionPointCountTotal += puzzleAudit.decisionPointCount;
    tempoClearCountTotal += puzzleAudit.tempoClearCount;
    stretchPressureCountTotal += puzzleAudit.stretchPressureCount;
    sharedCrossingMoveCountTotal += puzzleAudit.sharedCrossingMoveCount;
    whitePunishCountTotal += puzzleAudit.whitePunishCount;
    terrainUsefulnessScoreTotal += puzzleAudit.terrainUsefulnessScore;
    fillerMoveRatioTotal += puzzleAudit.fillerMoveRatio;
    if (puzzleAudit.isPureOpeningFill) {
      pureOpeningFillCount += 1;
    }
  });

  const standardTargetSeconds = puzzles
    .filter((puzzle) => puzzle.difficulty === 'Standard')
    .map((puzzle) => puzzle.targetSeconds)
    .sort((a, b) => a - b);
  const standardMedianTargetSeconds =
    standardTargetSeconds.length === 0
      ? 0
      : standardTargetSeconds[Math.floor(standardTargetSeconds.length / 2)]!;
  const allTargetSeconds = puzzles.map((puzzle) => puzzle.targetSeconds).sort((a, b) => a - b);
  const medianTargetSeconds =
    allTargetSeconds.length === 0 ? 0 : allTargetSeconds[Math.floor(allTargetSeconds.length / 2)]!;

  return {
    puzzleCount: puzzles.length,
    difficultyCounts,
    tagCounts,
    terrainArchetypeCounts,
    minTargetMoves: Number.isFinite(minTargetMoves) ? minTargetMoves : 0,
    maxTargetMoves,
    averageTargetMoves: puzzles.length > 0 ? targetMoveTotal / puzzles.length : 0,
    minMinimumMoves: Number.isFinite(minMinimumMoves) ? minMinimumMoves : 0,
    maxMinimumMoves,
    averageMinimumMoves: puzzles.length > 0 ? minimumMoveTotal / puzzles.length : 0,
    averageTargetToMinimumMoveGap: puzzles.length > 0 ? targetToMinimumMoveGapTotal / puzzles.length : 0,
    maxTargetToMinimumMoveGap,
    standardMedianTargetSeconds,
    averageBlockerCount: puzzles.length > 0 ? blockerCountTotal / puzzles.length : 0,
    minimumBlockerImpactScore: Number.isFinite(minimumBlockerImpactScore) ? minimumBlockerImpactScore : 0,
    averageBlockerImpactScore: puzzles.length > 0 ? blockerImpactTotal / puzzles.length : 0,
    averageSmallBoardDensityScore: puzzles.length > 0 ? smallBoardDensityScoreTotal / puzzles.length : 0,
    pureOpeningFillCount,
    responseEventCount,
    dynamicMoveCount,
    raceResponseCount,
    releasePebbleCount,
    requiredReleaseMoveCount,
    delayedMoveCount,
    maxUnlockDepth,
    averageOptimalMoveCount: puzzles.length > 0 ? optimalMoveCountTotal / puzzles.length : 0,
    averageNaivePenalty: puzzles.length > 0 ? naivePenaltyTotal / puzzles.length : 0,
    averageDecisionPointCount: puzzles.length > 0 ? decisionPointCountTotal / puzzles.length : 0,
    averageTempoClearCount: puzzles.length > 0 ? tempoClearCountTotal / puzzles.length : 0,
    averageStretchPressureCount: puzzles.length > 0 ? stretchPressureCountTotal / puzzles.length : 0,
    averageSharedCrossingMoveCount: puzzles.length > 0 ? sharedCrossingMoveCountTotal / puzzles.length : 0,
    averageWhitePunishCount: puzzles.length > 0 ? whitePunishCountTotal / puzzles.length : 0,
    averageTerrainUsefulnessScore: puzzles.length > 0 ? terrainUsefulnessScoreTotal / puzzles.length : 0,
    medianTargetSeconds,
    averageFillerMoveRatio: puzzles.length > 0 ? fillerMoveRatioTotal / puzzles.length : 0,
  };
}

function getLibertiesPuzzlesForMode(mode: LibertiesPlayMode): {
  profile: LibertiesPlayModeGenerationProfile;
  publicPuzzles: LibertiesPuzzle[];
} {
  const profile = getLibertiesGenerationProfile(mode);
  const publicPuzzles = mode === 'hard' ? libertiesPuzzlesHard : libertiesPuzzlesStandard;
  return { profile, publicPuzzles };
}

export function getDailyLibertiesEntry(
  date: Date = new Date(),
  playerFacingMode: LibertiesPlayMode = 'standard'
): LibertiesDailyEntry {
  const dateKey = getUtcDateKey(date);
  const dayOffset = dateKeyToUtcOrdinal(dateKey) - LIBERTIES_PACK_START_ORDINAL;
  const { profile, publicPuzzles } = getLibertiesPuzzlesForMode(playerFacingMode);
  const startIndex = publicPuzzles.findIndex((puzzle) => puzzle.id === profile.dailyPuzzleId);
  const baseIndex = positiveModulo((startIndex >= 0 ? startIndex : 0) + dayOffset, publicPuzzles.length);

  return {
    date: dateKey,
    puzzle: publicPuzzles[baseIndex] ?? publicPuzzles[0]!,
  };
}

export function formatLibertiesShareText(options: LibertiesShareTextOptions): string {
  const minutes = Math.floor(options.elapsedSeconds / 60);
  const seconds = options.elapsedSeconds % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const moveLabel = `${options.moves} move${options.moves === 1 ? '' : 's'}`;
  const hintLabel =
    options.hintsUsed > 0
      ? `${options.hintsUsed} hint${options.hintsUsed === 1 ? '' : 's'}`
      : 'no hints';
  return [
    `Liberties ⚪⚫ ${options.date}`,
    `${moveLabel} · ${timeLabel} · ${hintLabel}`,
    options.url,
  ].join('\n');
}
