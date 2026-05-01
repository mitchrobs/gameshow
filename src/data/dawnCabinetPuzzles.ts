import { getUtcDateKey } from '../utils/dailyUtc';
import dawnCabinetSchedule from './dawnCabinetSchedule.json';

export type DawnCabinetSuit =
  | 'bamboo'
  | 'dots'
  | 'characters'
  | 'coins'
  | 'lotus'
  | 'jade'
  | 'clouds'
  | 'stars'
  | 'waves'
  | 'knots'
  | 'moons'
  | 'suns'
  | 'lanterns'
  | 'sparks';
export type DawnCabinetDifficulty = 'Easy' | 'Standard' | 'Hard' | 'Expert';
export type DawnCabinetDailyDifficulty = Exclude<DawnCabinetDifficulty, 'Easy'>;
export type DawnCabinetLineState = 'incomplete' | 'valid' | 'invalid';
export type DawnCabinetSetKind =
  | 'run'
  | 'mixedRun'
  | 'gapRun'
  | 'mixedGap'
  | 'match'
  | 'pair'
  | 'flush'
  | 'number';
export type DawnCabinetLineGoal = DawnCabinetSetKind | 'hidden';
export type DawnCabinetMacroFamily =
  | 'easyPractice'
  | 'splitHinge'
  | 'cornerExchange'
  | 'threePocket'
  | 'shortBasin'
  | 'braidedReservoir'
  | 'mirrorTrap'
  | 'offsetBridge'
  | 'reserveFork'
  | 'ringCabinet'
  | 'fiveDistrict'
  | 'doubleBasin'
  | 'brokenSpine'
  | 'lanternWeb';
export type DawnCabinetExposureProfile =
  | 'friendlyStart'
  | 'ledgerFirst'
  | 'reserveFirst'
  | 'dawnFork'
  | 'copyPressure'
  | 'bridgeRead';
export type DawnCabinetOpeningClueStyle =
  | 'friendlyStart'
  | 'ledgerFirst'
  | 'reserveFirst'
  | 'dawnFork'
  | 'copyPressure'
  | 'bridgeRead';
export type DawnCabinetDawnPressure = 'none' | 'gentle' | 'fork' | 'hinge' | 'crossroad';
export type DawnCabinetReservePressure = 'none' | 'light' | 'strict' | 'setGoal' | 'wideReserve';
export type DawnCabinetSolvePosture =
  | 'lineReading'
  | 'ledgerCounting'
  | 'reserveAccounting'
  | 'dawnPivot'
  | 'copyCounting'
  | 'bridgeMapping';
export type DawnCabinetSilhouetteClass = 'compact' | 'split' | 'stepped' | 'basin' | 'spine' | 'web';

export interface DawnCabinetTile {
  suit: DawnCabinetSuit;
  rank: number;
}

export interface DawnCabinetDawnTile {
  id: string;
  solutionCell: string;
  resolvedTile: DawnCabinetTile;
  options: DawnCabinetTile[];
}

export interface DawnCabinetCellClue {
  suit?: DawnCabinetSuit;
  rank?: number;
}

export type DawnCabinetLedger = Partial<Record<DawnCabinetSetKind, number>>;

export interface DawnCabinetLedgerState {
  counts: Record<DawnCabinetSetKind, number>;
  unknown: number;
  invalid: number;
}

export interface DawnCabinetBankGoal {
  type: DawnCabinetSetKind;
}

export interface DawnCabinetDifficultyRating {
  blanks: number;
  hiddenRails: number;
  lineCount: number;
  bankCount: number;
  setKindCount: number;
  reserveCount: number;
  overlapDensity: number;
  branchCount: number;
  motifCount: number;
  shapeSignature: string;
  compositeSignature: string;
  hasDawnTile: boolean;
  dawnOptionCount: number;
  dawnRailTouchCount: number;
  dawnHiddenRailTouchCount: number;
  dawnAmbiguityScore: number;
  dawnQualityScore: number;
  visibleRailSpreadScore: number;
  playProfileKey?: string;
  score: number;
}

export interface DawnCabinetPlayProfile {
  key: string;
  macroFamily: DawnCabinetMacroFamily;
  exposureProfile: DawnCabinetExposureProfile;
  motifProfile: string;
  visibleRailTypeMix: string;
  hiddenLedgerMix: string;
  openingClueStyle: DawnCabinetOpeningClueStyle;
  dawnPressure: DawnCabinetDawnPressure;
  reservePressure: DawnCabinetReservePressure;
  solvePosture: DawnCabinetSolvePosture;
  silhouetteClass: DawnCabinetSilhouetteClass;
  countProfile: string;
}

export interface DawnCabinetShareTextOptions {
  date: string;
  difficulty: DawnCabinetDailyDifficulty;
  elapsedSeconds: number;
  railCount: number;
  tileTrail?: DawnCabinetTile[];
  url: string;
}

export interface DawnCabinetCell {
  row: number;
  col: number;
}

export interface DawnCabinetLine {
  id: string;
  cells: string[];
  goal: DawnCabinetLineGoal;
}

export interface DawnCabinetPuzzle {
  id: string;
  date: string;
  title: string;
  difficulty: DawnCabinetDifficulty;
  rows: number;
  columns: number;
  cells: DawnCabinetCell[];
  lines: DawnCabinetLine[];
  givens: Record<string, DawnCabinetTile>;
  cellClues: Record<string, DawnCabinetCellClue>;
  ledger?: DawnCabinetLedger;
  bankGoal?: DawnCabinetBankGoal;
  solution: Record<string, DawnCabinetTile>;
  bank: DawnCabinetTile[];
  reserveTiles: DawnCabinetTile[];
  spareCount: number;
  dawnTile?: DawnCabinetDawnTile;
  motifs: string[];
  macroFamily?: DawnCabinetMacroFamily;
  exposureProfile?: DawnCabinetExposureProfile;
  playProfile?: DawnCabinetPlayProfile;
  qualityFlags?: string[];
  shapeSignature: string;
  compositeSignature: string;
}

type PuzzleDraft = {
  solution: Record<string, DawnCabinetTile>;
  lines: DawnCabinetLine[];
  givens: string[];
  cellClues: Record<string, DawnCabinetCellClue>;
};

const SUITS: DawnCabinetSuit[] = [
  'bamboo',
  'dots',
  'characters',
  'coins',
  'lotus',
  'jade',
  'clouds',
  'stars',
  'waves',
  'knots',
  'moons',
  'suns',
  'lanterns',
  'sparks',
];
const SUIT_LABELS: Record<DawnCabinetSuit, string> = {
  bamboo: 'Bamboo',
  dots: 'Dots',
  characters: 'Characters',
  coins: 'Coins',
  lotus: 'Lotus',
  jade: 'Jade',
  clouds: 'Clouds',
  stars: 'Stars',
  waves: 'Waves',
  knots: 'Knots',
  moons: 'Moons',
  suns: 'Suns',
  lanterns: 'Lanterns',
  sparks: 'Sparks',
};
const SUIT_SHORT_LABELS: Record<DawnCabinetSuit, string> = {
  bamboo: 'BAM',
  dots: 'DOT',
  characters: 'CHR',
  coins: 'COI',
  lotus: 'LOT',
  jade: 'JAD',
  clouds: 'CLD',
  stars: 'STR',
  waves: 'WAV',
  knots: 'KNT',
  moons: 'MON',
  suns: 'SUN',
  lanterns: 'LAN',
  sparks: 'SPK',
};
const SUIT_SHARE_MARKS: Record<DawnCabinetSuit, string> = {
  bamboo: '🟩',
  dots: '🟦',
  characters: '🟥',
  coins: '🟨',
  lotus: '🟪',
  jade: '🟢',
  clouds: '⚪',
  stars: '🔵',
  waves: '🔷',
  knots: '🟫',
  moons: '🟣',
  suns: '🟧',
  lanterns: '🟠',
  sparks: '✨',
};
const SET_KINDS: DawnCabinetSetKind[] = [
  'run',
  'mixedRun',
  'gapRun',
  'mixedGap',
  'match',
  'pair',
  'flush',
  'number',
];
const THREE_TILE_SET_KINDS: DawnCabinetSetKind[] = [
  'run',
  'mixedRun',
  'gapRun',
  'mixedGap',
  'match',
  'flush',
  'number',
];
const CANDIDATE_CACHE = new Map<string, DawnCabinetPuzzle[]>();
const SELECTED_CANDIDATE_CACHE = new Map<string, DawnCabinetPuzzle>();
const MAX_CANDIDATE_CACHE_SIZE = 360;
const STANDARD_MACRO_FAMILIES: DawnCabinetMacroFamily[] = [
  'splitHinge',
  'cornerExchange',
  'threePocket',
  'shortBasin',
];
const HARD_MACRO_FAMILIES: DawnCabinetMacroFamily[] = [
  'braidedReservoir',
  'mirrorTrap',
  'offsetBridge',
  'reserveFork',
];
const EXPERT_MACRO_FAMILIES: DawnCabinetMacroFamily[] = [
  'ringCabinet',
  'fiveDistrict',
  'doubleBasin',
  'brokenSpine',
  'lanternWeb',
];
const EXPOSURE_PROFILES: DawnCabinetExposureProfile[] = [
  'friendlyStart',
  'ledgerFirst',
  'reserveFirst',
  'dawnFork',
  'copyPressure',
  'bridgeRead',
];
export const DAWN_CABINET_DAILY_DIFFICULTIES: DawnCabinetDailyDifficulty[] = [
  'Standard',
  'Hard',
  'Expert',
];
export const DAWN_CABINET_SCHEDULE_START = '2026-05-15';
export const DAWN_CABINET_SCHEDULE_DAYS = 365;

type DawnCabinetSchedulePuzzleEntry = {
  id: string;
  variant: number;
};

type DawnCabinetScheduleEntry = {
  date: string;
  puzzles: Record<DawnCabinetDailyDifficulty, DawnCabinetSchedulePuzzleEntry>;
};

type DawnCabinetSchedule = {
  start: string;
  days: number;
  entries: DawnCabinetScheduleEntry[];
};

const DAWN_CABINET_SCHEDULE = dawnCabinetSchedule as DawnCabinetSchedule;
const DAWN_CABINET_SCHEDULE_BY_DATE = new Map(
  DAWN_CABINET_SCHEDULE.entries.map((entry) => [entry.date, entry])
);

export function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function tileKey(tile: DawnCabinetTile): string {
  return `${tile.suit}:${tile.rank}`;
}

export function tileLabel(tile: DawnCabinetTile): string {
  return `${tile.rank} ${SUIT_LABELS[tile.suit]}`;
}

export function dawnTileLabel(dawnTile: DawnCabinetDawnTile): string {
  return `Dawn tile: ${dawnTile.options.map(tileLabel).join(' / ')}`;
}

export function suitShortLabel(suit: DawnCabinetSuit): string {
  return SUIT_SHORT_LABELS[suit];
}

export function getDawnTileResolvedValueForCell(
  puzzle: DawnCabinetPuzzle,
  cell: string
): DawnCabinetTile | undefined {
  const dawnTile = puzzle.dawnTile;
  const solutionTile = puzzle.solution[cell];
  if (!dawnTile || !solutionTile) return undefined;
  if (cell !== dawnTile.solutionCell) return undefined;
  return dawnTile.options.some((option) => tileKey(option) === tileKey(solutionTile))
    ? solutionTile
    : undefined;
}

export function getCabinetEntryCount(puzzle: DawnCabinetPuzzle): number {
  return puzzle.bank.length + (puzzle.dawnTile ? 1 : 0);
}

export function cellClueLabel(clue: DawnCabinetCellClue): string {
  if (clue.suit && clue.rank) return `${clue.rank} ${suitShortLabel(clue.suit)}`;
  if (clue.suit) return suitShortLabel(clue.suit);
  if (clue.rank) return String(clue.rank);
  return '';
}

export function tileMatchesCellClue(
  tile: DawnCabinetTile | undefined,
  clue: DawnCabinetCellClue | undefined
): boolean {
  if (!tile || !clue) return true;
  if (clue.suit && tile.suit !== clue.suit) return false;
  if (clue.rank && tile.rank !== clue.rank) return false;
  return true;
}

export function lineGoalLabel(goal: DawnCabinetLineGoal): string {
  if (goal === 'run') return 'Run';
  if (goal === 'mixedRun') return 'Mixed Run';
  if (goal === 'gapRun') return 'Gap Run';
  if (goal === 'mixedGap') return 'Mixed Gap';
  if (goal === 'match') return 'Match';
  if (goal === 'pair') return 'Pair';
  if (goal === 'flush') return 'Flush';
  if (goal === 'number') return 'Number Set';
  return 'Hidden';
}

export function lineGoalShortLabel(goal: DawnCabinetLineGoal): string {
  if (goal === 'run') return 'R';
  if (goal === 'mixedRun') return 'X';
  if (goal === 'gapRun') return 'G';
  if (goal === 'mixedGap') return 'Z';
  if (goal === 'match') return 'M';
  if (goal === 'pair') return 'P';
  if (goal === 'flush') return 'F';
  if (goal === 'number') return 'N';
  return '?';
}

export function setKindPluralLabel(kind: DawnCabinetSetKind): string {
  if (kind === 'run') return 'Runs';
  if (kind === 'mixedRun') return 'Mixed Runs';
  if (kind === 'gapRun') return 'Gap Runs';
  if (kind === 'mixedGap') return 'Mixed Gaps';
  if (kind === 'match') return 'Matches';
  if (kind === 'pair') return 'Pairs';
  if (kind === 'flush') return 'Flushes';
  return 'Number Sets';
}

export function formatDawnCabinetShareText({
  date,
  difficulty,
  elapsedSeconds,
  railCount,
  tileTrail = [],
  url,
}: DawnCabinetShareTextOptions): string {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const trail = tileTrail.slice(0, 3).map((tile) => SUIT_SHARE_MARKS[tile.suit]).join(' ');
  return [
    `Dawn Cabinet ${date}`,
    `${difficulty} | ${duration} | ${railCount} rails`,
    trail ? `First correct: ${trail}` : 'Cabinet complete',
    url,
  ].join('\n');
}

export function classifyCabinetLine(
  tiles: DawnCabinetTile[]
): DawnCabinetSetKind | null {
  if (tiles.length === 2) {
    return tiles[0].suit === tiles[1].suit && tiles[0].rank === tiles[1].rank ? 'pair' : null;
  }

  if (tiles.length !== 3) return null;

  if (tiles.every((tile) => tile.suit === tiles[0].suit && tile.rank === tiles[0].rank)) {
    return 'match';
  }

  const sameSuit = tiles.every((tile) => tile.suit === tiles[0].suit);
  const ranks = tiles.map((tile) => tile.rank).sort((left, right) => left - right);
  const isConsecutive = ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2];
  const isGapped = ranks[0] + 2 === ranks[1] && ranks[1] + 2 === ranks[2];
  if (sameSuit && isConsecutive) return 'run';
  if (sameSuit && isGapped) return 'gapRun';
  if (sameSuit) return 'flush';

  const sameRank = tiles.every((tile) => tile.rank === tiles[0].rank);
  const distinctSuits = new Set(tiles.map((tile) => tile.suit)).size === tiles.length;
  if (isConsecutive && distinctSuits) return 'mixedRun';
  if (isGapped && distinctSuits) return 'mixedGap';
  return sameRank && distinctSuits ? 'number' : null;
}

export function isValidCabinetLine(
  tiles: DawnCabinetTile[],
  goal: DawnCabinetLineGoal = 'hidden'
): boolean {
  const kind = classifyCabinetLine(tiles);
  if (!kind) return false;
  if (goal === 'hidden') return THREE_TILE_SET_KINDS.includes(kind) && tiles.length === 3;
  return kind === goal;
}

export function getCabinetLineState(
  line: DawnCabinetLine,
  placements: Record<string, DawnCabinetTile>
): DawnCabinetLineState {
  const tiles = line.cells.map((cell) => placements[cell]).filter(Boolean);
  if (tiles.length !== line.cells.length) return 'incomplete';
  return isValidCabinetLine(tiles, line.goal) ? 'valid' : 'invalid';
}

export function isCabinetSolved(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): boolean {
  const everyCellFilled = puzzle.cells.every((cell) => Boolean(placements[cellKey(cell.row, cell.col)]));
  if (!everyCellFilled) return false;
  const everyClueObeyed = puzzle.cells.every((cell) => {
    const key = cellKey(cell.row, cell.col);
    return tileMatchesCellClue(placements[key], puzzle.cellClues[key]);
  });
  if (!everyClueObeyed) return false;
  return (
    puzzle.lines.every((line) => getCabinetLineState(line, placements) === 'valid') &&
    isLedgerSatisfied(puzzle, placements) &&
    isBankGoalSatisfied(puzzle, placements)
  );
}

export function getLedgerState(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): DawnCabinetLedgerState {
  return puzzle.lines
    .filter((line) => line.goal === 'hidden')
    .reduce(
      (counts, line) => {
        const tiles = line.cells.map((cell) => placements[cell]).filter(Boolean);
        if (tiles.length !== line.cells.length) {
          counts.unknown += 1;
          return counts;
        }

        const kind = classifyCabinetLine(tiles);
        if (kind && THREE_TILE_SET_KINDS.includes(kind)) counts.counts[kind] += 1;
        else counts.invalid += 1;
        return counts;
      },
      {
        counts: { run: 0, mixedRun: 0, gapRun: 0, mixedGap: 0, match: 0, pair: 0, flush: 0, number: 0 },
        unknown: 0,
        invalid: 0,
      } satisfies DawnCabinetLedgerState
    );
}

export function isLedgerPossible(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): boolean {
  if (!puzzle.ledger) return true;
  const state = getLedgerState(puzzle, placements);
  if (state.invalid > 0) return false;
  const ledgerKinds = getLedgerKinds(puzzle);
  const completed = SET_KINDS.reduce((sum, kind) => sum + state.counts[kind], 0);
  const required = ledgerKinds.reduce((sum, kind) => sum + (puzzle.ledger?.[kind] ?? 0), 0);
  if (completed + state.unknown < required) return false;

  for (const kind of SET_KINDS) {
    const target = puzzle.ledger[kind] ?? 0;
    if (state.counts[kind] > target) return false;
    if (ledgerKinds.includes(kind) && state.counts[kind] + state.unknown < target) return false;
  }
  return true;
}

export function isLedgerSatisfied(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): boolean {
  if (!puzzle.ledger) return true;
  const state = getLedgerState(puzzle, placements);
  return state.invalid === 0 && state.unknown === 0 && SET_KINDS.every((kind) => {
    return state.counts[kind] === (puzzle.ledger?.[kind] ?? 0);
  });
}

export function getRemainingBankTiles(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): DawnCabinetTile[] {
  const remaining = countTiles(puzzle.bank);
  puzzle.cells.forEach((cell) => {
    const key = cellKey(cell.row, cell.col);
    if (puzzle.givens[key] || !placements[key]) return;

    const placedKey = tileKey(placements[key]);
    if (remaining[placedKey]) remaining[placedKey] -= 1;
  });

  return Object.entries(remaining).flatMap(([key, amount]) =>
    Array.from({ length: amount }, () => parseTileKey(key))
  );
}

export function isBankGoalSatisfied(
  puzzle: DawnCabinetPuzzle,
  placements: Record<string, DawnCabinetTile>
): boolean {
  const remaining = getRemainingBankTiles(puzzle, placements);
  if (remaining.length !== puzzle.spareCount) return false;
  if (!puzzle.bankGoal) return true;
  return classifyCabinetLine(remaining) === puzzle.bankGoal.type;
}

export function rateDawnCabinetPuzzle(puzzle: DawnCabinetPuzzle): DawnCabinetDifficultyRating {
  const blanks = puzzle.cells.length - Object.keys(puzzle.givens).length;
  const hiddenRails = puzzle.lines.filter((line) => line.goal === 'hidden').length;
  const setKindCount = getPuzzleSetKinds(puzzle).size;
  const overlapDensity = getOverlapDensity(puzzle);
  const branchCount = estimateBranchCount(puzzle);
  const dawnRailTouchCount = getDawnRailTouchCount(puzzle);
  const dawnHiddenRailTouchCount = getDawnHiddenRailTouchCount(puzzle);
  const dawnOptionCount = puzzle.dawnTile?.options.length ?? 0;
  const dawnAmbiguityScore = Math.max(0, dawnOptionCount - 1) + Math.max(0, dawnRailTouchCount - 1);
  const dawnQualityScore = getDawnQualityScore(puzzle);
  const visibleRailSpreadScore = getVisibleRailSpreadScore(puzzle);
  const score =
    blanks * 10 +
    hiddenRails * 7 +
    puzzle.lines.length * 3 +
    setKindCount * 12 +
    puzzle.spareCount * 14 +
    overlapDensity * 20 +
    branchCount * 2 +
    puzzle.motifs.length * 4 +
    dawnOptionCount * 12 +
    dawnRailTouchCount * 6 +
    dawnQualityScore * 4 +
    visibleRailSpreadScore * 3;

  return {
    blanks,
    hiddenRails,
    lineCount: puzzle.lines.length,
    bankCount: getCabinetEntryCount(puzzle),
    setKindCount,
    reserveCount: puzzle.spareCount,
    overlapDensity,
    branchCount,
    motifCount: puzzle.motifs.length,
    shapeSignature: puzzle.shapeSignature,
    compositeSignature: puzzle.compositeSignature,
    hasDawnTile: Boolean(puzzle.dawnTile),
    dawnOptionCount,
    dawnRailTouchCount,
    dawnHiddenRailTouchCount,
    dawnAmbiguityScore,
    dawnQualityScore,
    visibleRailSpreadScore,
    playProfileKey: puzzle.playProfile?.key,
    score,
  };
}

export function getLedgerKinds(puzzle: DawnCabinetPuzzle): DawnCabinetSetKind[] {
  return SET_KINDS.filter((kind) => (puzzle.ledger?.[kind] ?? 0) > 0);
}

function getPuzzleSetKinds(puzzle: DawnCabinetPuzzle): Set<DawnCabinetSetKind> {
  const kinds = new Set<DawnCabinetSetKind>();
  puzzle.lines.forEach((line) => {
    if (line.goal === 'hidden') {
      getLedgerKinds(puzzle).forEach((kind) => kinds.add(kind));
    } else {
      kinds.add(line.goal);
    }
  });
  if (puzzle.bankGoal) kinds.add(puzzle.bankGoal.type);
  return kinds;
}

function getOverlapDensity(puzzle: DawnCabinetPuzzle): number {
  const linesByCell = getLinesByCell(puzzle);
  const activeCells = puzzle.cells.length || 1;
  const overlappingCells = puzzle.cells.filter((cell) => {
    return (linesByCell[cellKey(cell.row, cell.col)]?.length ?? 0) > 1;
  }).length;
  return overlappingCells / activeCells;
}

function getDawnRailTouchCount(puzzle: DawnCabinetPuzzle): number {
  if (!puzzle.dawnTile) return 0;
  return getLinesByCell(puzzle)[puzzle.dawnTile.solutionCell]?.length ?? 0;
}

function getDawnHiddenRailTouchCount(puzzle: DawnCabinetPuzzle): number {
  if (!puzzle.dawnTile) return 0;
  return (getLinesByCell(puzzle)[puzzle.dawnTile.solutionCell] ?? [])
    .filter((line) => line.goal === 'hidden').length;
}

function getDawnQualityScore(puzzle: DawnCabinetPuzzle): number {
  if (!puzzle.dawnTile) return 0;
  const touchCount = getDawnRailTouchCount(puzzle);
  const hiddenTouchCount = getDawnHiddenRailTouchCount(puzzle);
  const linesByCell = getLinesByCell(puzzle);
  const dawnLines = linesByCell[puzzle.dawnTile.solutionCell] ?? [];
  const visibleKinds = new Set(
    dawnLines
      .filter((line) => line.goal !== 'hidden')
      .map((line) => line.goal)
  );
  const hiddenBonus = Math.min(2, hiddenTouchCount) * 2;
  const visibilityBonus = visibleKinds.size;
  const optionBonus = Math.max(0, puzzle.dawnTile.options.length - 2);
  const reserveBonus = puzzle.spareCount > 1 ? 1 : 0;
  return touchCount * 2 + hiddenBonus + visibilityBonus + optionBonus + reserveBonus;
}

function getVisibleRailSpreadScore(puzzle: DawnCabinetPuzzle): number {
  const visibleLines = puzzle.lines.filter((line) => line.goal !== 'hidden');
  if (visibleLines.length === 0) return 0;
  const visibleKinds = new Set(visibleLines.map((line) => line.goal)).size;
  const rows = new Set<number>();
  const cols = new Set<number>();
  visibleLines.forEach((line) => {
    line.cells.forEach((cell) => {
      const [row, col] = cell.split(':').map(Number);
      rows.add(row);
      cols.add(col);
    });
  });
  const rowSpread = Math.min(4, rows.size);
  const colSpread = Math.min(4, cols.size);
  const bunchPenalty = visibleLines.length > 0 && rowSpread <= 2 && colSpread <= 2 ? 2 : 0;
  return visibleKinds * 2 + rowSpread + colSpread - bunchPenalty;
}

function estimateBranchCount(puzzle: DawnCabinetPuzzle): number {
  const linesByCell = getLinesByCell(puzzle);
  const remaining = countTiles(puzzle.bank);
  const placements: Record<string, DawnCabinetTile> = { ...puzzle.givens };
  let dawnAvailable = Boolean(puzzle.dawnTile);
  return puzzle.cells
    .map((cell) => cellKey(cell.row, cell.col))
    .filter((key) => !puzzle.givens[key])
    .reduce((sum, cell) => {
      const options = Object.entries(remaining)
        .filter(([, amount]) => amount > 0)
        .map(([key]) => parseTileKey(key))
        .filter((tile) => {
          placements[cell] = tile;
          const canResolve = tileMatchesCellClue(tile, puzzle.cellClues[cell]) &&
            (linesByCell[cell] ?? []).every((line) => {
              const assigned = line.cells.map((lineCell) => placements[lineCell]).filter(Boolean);
              if (assigned.length === line.cells.length) return isValidCabinetLine(assigned, line.goal);
              return canCompleteLine(assigned, line.goal);
            }) &&
            isLedgerPossible(puzzle, placements);
          delete placements[cell];
          return canResolve;
        }).length;
      const dawnResolvedTile = dawnAvailable ? getDawnTileResolvedValueForCell(puzzle, cell) : undefined;
      const dawnOptions = dawnResolvedTile
        ? [dawnResolvedTile].filter((tile) => {
            placements[cell] = tile;
            const canResolve = tileMatchesCellClue(tile, puzzle.cellClues[cell]) &&
              (linesByCell[cell] ?? []).every((line) => {
                const assigned = line.cells.map((lineCell) => placements[lineCell]).filter(Boolean);
                if (assigned.length === line.cells.length) return isValidCabinetLine(assigned, line.goal);
                return canCompleteLine(assigned, line.goal);
              }) &&
              isLedgerPossible(puzzle, placements);
            delete placements[cell];
            return canResolve;
          }).length
        : 0;
      return sum + Math.max(options + dawnOptions - 1, 0);
    }, 0);
}

export function getDailyDawnCabinet(
  date = getUtcDateKey(new Date()),
  difficulty: DawnCabinetDailyDifficulty = 'Standard'
): DawnCabinetPuzzle {
  const seed = stableSeed(`${date}:${difficulty}:daily`);
  const scheduled = getScheduledDawnCabinet(date, difficulty, seed);
  if (scheduled) return scheduled;
  return getDawnCabinetByDifficulty(date, difficulty, seed);
}

export function getGeneratedDailyDawnCabinet(
  date = getUtcDateKey(new Date()),
  difficulty: DawnCabinetDailyDifficulty = 'Standard'
): DawnCabinetPuzzle {
  const seed = stableSeed(`${date}:${difficulty}:daily`);
  return getDawnCabinetByDifficulty(date, difficulty, seed);
}

export function getDemoDawnCabinet(
  difficulty: DawnCabinetDifficulty,
  date = getUtcDateKey(new Date())
): DawnCabinetPuzzle {
  return getDawnCabinetByDifficulty(date, difficulty, stableSeed(`${date}:${difficulty}:demo`));
}

function getScheduledDawnCabinet(
  date: string,
  difficulty: DawnCabinetDailyDifficulty,
  seed: bigint
): DawnCabinetPuzzle | undefined {
  const entry = DAWN_CABINET_SCHEDULE_BY_DATE.get(date)?.puzzles[difficulty];
  if (!entry) return undefined;
  return makePuzzleVariant(date, difficulty, seed, entry.variant);
}

function getDawnCabinetByDifficulty(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint
): DawnCabinetPuzzle {
  const variants = makeVariantNumbers(difficulty, seed);
  if (difficulty === 'Easy') return makePuzzleVariant(date, difficulty, seed, variants[0]);
  return selectAntiFingerprintVariant(date, difficulty, seed, variants);
}

function selectAntiFingerprintVariant(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint,
  variants: number[]
): DawnCabinetPuzzle {
  const cacheKey = selectedCandidateCacheKey(date, difficulty, seed);
  const cached = SELECTED_CANDIDATE_CACHE.get(cacheKey);
  if (cached) return cached;

  const dayIndex = getUtcDayIndex(date);
  const dateOffset = Number.isNaN(dayIndex) ? 0 : dayIndex;
  const recent = getCachedRecentCompositeSignatures(date, difficulty);
  const recentProfiles = getCachedRecentPlayProfileKeys(date, difficulty);
  const offset = Number((seed + BigInt(dateOffset)) % BigInt(variants.length));
  const ordered = [...variants.slice(offset), ...variants.slice(0, offset)];
  let best: { candidate: DawnCabinetPuzzle; score: number } | undefined;
  let bestFreshComposite: DawnCabinetPuzzle | undefined;
  let bestSelectable: DawnCabinetPuzzle | undefined;

  for (const [index, variant] of ordered.entries()) {
    const candidate = makePuzzleVariant(date, difficulty, seed, variant);
    const score = getCandidateFreshnessScore(candidate, recent, recentProfiles);
    const selectable = isSelectableDawnCandidate(candidate);
    if (!best || score > best.score) best = { candidate, score };
    if (!bestFreshComposite && !recent.has(candidate.compositeSignature)) bestFreshComposite = candidate;
    if (!bestSelectable && selectable) bestSelectable = candidate;

    const strongFreshCandidate =
      !recent.has(candidate.compositeSignature) &&
      !recentProfiles.has(candidate.playProfile?.key ?? '') &&
      selectable &&
      meetsDawnQualityTarget(candidate);
    const acceptableFreshCandidate =
      !recent.has(candidate.compositeSignature) &&
      selectable &&
      meetsDawnQualityTarget(candidate);
    if (
      strongFreshCandidate &&
      countCabinetSolutions(candidate, 2) === 1
    ) {
      SELECTED_CANDIDATE_CACHE.set(cacheKey, candidate);
      return candidate;
    }

    if (
      index >= getMinimumCandidateScanCount(difficulty) &&
      acceptableFreshCandidate &&
      countCabinetSolutions(candidate, 2) === 1
    ) {
      SELECTED_CANDIDATE_CACHE.set(cacheKey, candidate);
      return candidate;
    }
  }

  const selected =
    bestSelectable ??
    bestFreshComposite ??
    best?.candidate ??
    makePuzzleVariant(date, difficulty, seed, ordered[0]);
  SELECTED_CANDIDATE_CACHE.set(cacheKey, selected);
  return selected;
}

function getMinimumCandidateScanCount(difficulty: DawnCabinetDifficulty): number {
  if (difficulty === 'Expert') return 40;
  if (difficulty === 'Hard') return 28;
  return 18;
}

function selectedCandidateCacheKey(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint
): string {
  return `${date}:${difficulty}:${seed.toString()}`;
}

function getCachedRecentCompositeSignatures(date: string, difficulty: DawnCabinetDifficulty): Set<string> {
  const recent = new Set<string>();
  const dateIndex = getUtcDayIndex(date);
  if (Number.isNaN(dateIndex)) return recent;
  for (let dayIndex = dateIndex - 90; dayIndex < dateIndex; dayIndex += 1) {
    const currentDate = utcDateFromDayIndex(dayIndex);
    const currentSeed = stableSeed(`${currentDate}:${difficulty}:daily`);
    const selected = SELECTED_CANDIDATE_CACHE.get(selectedCandidateCacheKey(currentDate, difficulty, currentSeed));
    if (selected) recent.add(selected.compositeSignature);
  }
  return recent;
}

function getCachedRecentPlayProfileKeys(date: string, difficulty: DawnCabinetDifficulty): Set<string> {
  const recent = new Set<string>();
  const dateIndex = getUtcDayIndex(date);
  if (Number.isNaN(dateIndex)) return recent;
  for (let dayIndex = dateIndex - 21; dayIndex < dateIndex; dayIndex += 1) {
    const currentDate = utcDateFromDayIndex(dayIndex);
    const currentSeed = stableSeed(`${currentDate}:${difficulty}:daily`);
    const selected = SELECTED_CANDIDATE_CACHE.get(selectedCandidateCacheKey(currentDate, difficulty, currentSeed));
    if (selected?.playProfile?.key) recent.add(selected.playProfile.key);
  }
  return recent;
}

function getCandidateFreshnessScore(
  candidate: DawnCabinetPuzzle,
  recentCompositeSignatures: Set<string>,
  recentPlayProfileKeys: Set<string>
): number {
  const compositeFresh = recentCompositeSignatures.has(candidate.compositeSignature) ? -1_000 : 200;
  const postureFresh = recentPlayProfileKeys.has(candidate.playProfile?.key ?? '') ? -250 : 120;
  const dawnQuality = getDawnQualityScore(candidate) * 12;
  const visibleSpread = getVisibleRailSpreadScore(candidate) * 8;
  const connectedBonus = isBoardConnected(candidate) ? 50 : -500;
  const widthBonus = candidate.columns <= 7 ? 30 : -500;
  const motifBonus = new Set(candidate.motifs).size * 3;
  return compositeFresh + postureFresh + dawnQuality + visibleSpread + connectedBonus + widthBonus + motifBonus;
}

function isSelectableDawnCandidate(candidate: DawnCabinetPuzzle): boolean {
  const dawnTile = candidate.dawnTile;
  if (!dawnTile) return true;
  return dawnTile.options.some((tile) => tileKey(tile) === tileKey(dawnTile.resolvedTile)) &&
    getDawnRailTouchCount(candidate) >= 2 &&
    getDawnHiddenRailTouchCount(candidate) >= 1;
}

function meetsDawnQualityTarget(candidate: DawnCabinetPuzzle): boolean {
  if (!candidate.dawnTile) return true;
  return getDawnQualityScore(candidate) >= getDawnQualityTarget(candidate.difficulty);
}

function getDawnQualityTarget(difficulty: DawnCabinetDifficulty): number {
  if (difficulty === 'Expert') return 10;
  if (difficulty === 'Hard') return 8;
  if (difficulty === 'Standard') return 6;
  return 0;
}

function getCandidateSet(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint
): DawnCabinetPuzzle[] {
  const key = `${date}:${difficulty}:${seed.toString()}`;
  const cached = CANDIDATE_CACHE.get(key);
  if (cached) return cached;
  const candidates = makeCandidates(date, difficulty, seed);
  CANDIDATE_CACHE.set(key, candidates);
  while (CANDIDATE_CACHE.size > MAX_CANDIDATE_CACHE_SIZE) {
    const oldestKey = CANDIDATE_CACHE.keys().next().value;
    if (!oldestKey) break;
    CANDIDATE_CACHE.delete(oldestKey);
  }
  return candidates;
}

export function makeTutorialPuzzle(date = 'tutorial'): DawnCabinetPuzzle {
  const suit: DawnCabinetSuit = 'bamboo';
  const rank = 3;
  const draft = createDraft();

  place(draft, '0:0', { suit, rank: rank - 1 }, true);
  place(draft, '0:1', { suit, rank });
  place(draft, '0:2', { suit, rank: rank + 1 }, true);
  place(draft, '1:0', { suit, rank }, true);
  place(draft, '1:1', { suit, rank });
  place(draft, '2:1', { suit, rank }, true);

  addLine(draft, 'tutorial-run', ['0:0', '0:1', '0:2'], 'run');
  addLine(draft, 'tutorial-match', ['0:1', '1:1', '2:1'], 'match');
  addLine(draft, 'tutorial-pair', ['1:0', '1:1'], 'pair');

  return makePuzzle({
    id: 'dawn-cabinet-tutorial',
    date,
    title: 'Dawn Cabinet',
    difficulty: 'Easy',
    rows: 3,
    columns: 3,
    spares: [],
    ...draft,
  });
}

export function countCabinetSolutions(puzzle: DawnCabinetPuzzle, limit = 2): number {
  const linesByCell = getLinesByCell(puzzle);
  const blanks = puzzle.cells
    .map((cell) => cellKey(cell.row, cell.col))
    .filter((key) => !puzzle.givens[key])
    .sort((left, right) => (linesByCell[right]?.length ?? 0) - (linesByCell[left]?.length ?? 0));
  const placements: Record<string, DawnCabinetTile> = { ...puzzle.givens };
  const remaining = countTiles(puzzle.bank);
  let dawnAvailable = Boolean(puzzle.dawnTile);
  let count = 0;

  const affectedLinesCanResolve = (cell: string): boolean => {
    if (!tileMatchesCellClue(placements[cell], puzzle.cellClues[cell])) return false;
    return (linesByCell[cell] ?? []).every((line) => {
      const assigned = line.cells.map((lineCell) => placements[lineCell]).filter(Boolean);
      if (assigned.length === line.cells.length) return isValidCabinetLine(assigned, line.goal);
      return canCompleteLine(assigned, line.goal);
    }) && isLedgerPossible(puzzle, placements);
  };

  const candidatesFor = (cell: string): { tile: DawnCabinetTile; dawn: boolean }[] => {
    const tileCandidates = Object.entries(remaining)
      .filter(([, amount]) => amount > 0)
      .map(([key]) => parseTileKey(key))
      .filter((tile) => {
        placements[cell] = tile;
        const canResolve = affectedLinesCanResolve(cell);
        delete placements[cell];
        return canResolve;
      })
      .map((tile) => ({ tile, dawn: false }));
    const dawnResolvedTile = dawnAvailable ? getDawnTileResolvedValueForCell(puzzle, cell) : undefined;
    const dawnCandidates = dawnResolvedTile
      ? [dawnResolvedTile]
          .filter((tile) => {
            placements[cell] = tile;
            const canResolve = affectedLinesCanResolve(cell);
            delete placements[cell];
            return canResolve;
          })
          .map((tile) => ({ tile, dawn: true }))
      : [];
    return [...tileCandidates, ...dawnCandidates]
      .sort((left, right) => Number(left.dawn) - Number(right.dawn) || compareTiles(left.tile, right.tile));
  };

  const search = () => {
    if (count >= limit) return;
    const openCell = blanks
      .filter((key) => !placements[key])
      .sort((left, right) => candidatesFor(left).length - candidatesFor(right).length)[0];

    if (!openCell) {
      const remainingTiles = Object.values(remaining).reduce((sum, value) => sum + value, 0);
      if (!dawnAvailable && remainingTiles === puzzle.spareCount && isCabinetSolved(puzzle, placements)) count += 1;
      return;
    }

    candidatesFor(openCell).forEach((candidate) => {
      const key = tileKey(candidate.tile);
      if (!candidate.dawn && !remaining[key]) return;
      placements[openCell] = candidate.tile;
      if (candidate.dawn) dawnAvailable = false;
      else remaining[key] -= 1;
      if (affectedLinesCanResolve(openCell)) search();
      if (candidate.dawn) dawnAvailable = true;
      else remaining[key] += 1;
      delete placements[openCell];
    });
  };

  search();
  return count;
}

function makeCandidates(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint
): DawnCabinetPuzzle[] {
  return makeVariantNumbers(difficulty, seed).map((variant) => makePuzzleVariant(date, difficulty, seed, variant));
}

function makeVariantNumbers(difficulty: DawnCabinetDifficulty, seed: bigint): number[] {
  const variantCount = difficulty === 'Expert' ? 180 : difficulty === 'Hard' ? 120 : difficulty === 'Standard' ? 96 : 1;
  return Array.from({ length: variantCount }, (_, index) =>
    Number((seed + BigInt(index) * 104_729n) % 10_000n)
  );
}

function makePuzzleVariant(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint,
  variant: number
): DawnCabinetPuzzle {
  const twoSuits = pickSuits(seed, 2);
  const threeSuits = pickSuits(seed, 3);
  const fourSuits = pickSuits(seed, 4);
  const fiveSuits = pickSuits(seed, 5);
  const baseRank = 1 + Number((seed >> 5n) % 3n);
  switch (difficulty) {
    case 'Easy':
      return makeEasyPuzzle({
        id: `dawn-cabinet-${date}-easy-a`,
        date,
        difficulty,
        suits: twoSuits,
        baseRank,
        variant,
      });
    case 'Standard':
      return makeStandardPuzzle({
        id: `dawn-cabinet-${date}-standard-${variant}`,
        date,
        difficulty,
        suits: threeSuits,
        baseRank,
        variant,
      });
    case 'Hard':
      return makeHardPuzzle({
        id: `dawn-cabinet-${date}-hard-${variant}`,
        date,
        difficulty,
        suits: fourSuits,
        baseRank,
        variant,
      });
    case 'Expert':
      return makeExpertPuzzle({
        id: `dawn-cabinet-${date}-expert-${variant}`,
        date,
        difficulty,
        suits: fiveSuits,
        baseRank,
        variant,
      });
  }
}

function getMacroFamily(
  difficulty: DawnCabinetDifficulty,
  variant: number
): DawnCabinetMacroFamily {
  if (difficulty === 'Easy') return 'easyPractice';
  const families =
    difficulty === 'Standard'
      ? STANDARD_MACRO_FAMILIES
      : difficulty === 'Hard'
        ? HARD_MACRO_FAMILIES
        : EXPERT_MACRO_FAMILIES;
  const index = Math.abs(variant + Math.floor(variant / 7)) % families.length;
  return families[index];
}

function getExposureProfile(variant: number): DawnCabinetExposureProfile {
  return EXPOSURE_PROFILES[Math.abs(variant + Math.floor(variant / 13)) % EXPOSURE_PROFILES.length];
}

function makeEasyPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
  variant?: number;
}): DawnCabinetPuzzle {
  const [a, b] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();

  place(draft, '0:0', { suit: a, rank: r }, true);
  place(draft, '0:1', { suit: a, rank: r + 1 });
  place(draft, '0:2', { suit: a, rank: r + 2 });
  place(draft, '1:2', { suit: a, rank: r + 3 }, true);
  place(draft, '2:2', { suit: a, rank: r + 4 }, true);
  addLine(draft, 'low-bamboo-wait', ['0:0', '0:1', '0:2'], 'run');
  addLine(draft, 'high-bamboo-wait', ['0:2', '1:2', '2:2'], 'run');

  place(draft, '3:2', { suit: b, rank: r }, true);
  place(draft, '3:3', { suit: b, rank: r + 1 });
  place(draft, '3:4', { suit: b, rank: r + 2 });
  place(draft, '2:4', { suit: b, rank: r + 3 }, true);
  place(draft, '1:4', { suit: b, rank: r + 4 }, true);
  addLine(draft, 'low-dot-wait', ['3:2', '3:3', '3:4'], 'run');
  addLine(draft, 'high-dot-wait', ['3:4', '2:4', '1:4'], 'run');

  place(draft, '1:0', { suit: a, rank: r + 5 }, true);
  place(draft, '2:0', { suit: a, rank: r + 5 }, true);
  place(draft, '3:0', { suit: a, rank: r + 5 });
  place(draft, '3:1', { suit: a, rank: r + 5 });
  addLine(draft, 'copy-match', ['1:0', '2:0', '3:0'], 'match');
  addLine(draft, 'copy-pair', ['3:0', '3:1'], 'pair');
  addLine(draft, 'copy-left-pair', ['1:0', '2:0'], 'pair');
  addLine(draft, 'copy-mid-pair', ['2:0', '3:0'], 'pair');
  setLineGoal(draft, 'low-bamboo-wait', 'hidden');
  setLineGoal(draft, 'low-dot-wait', 'hidden');
  setLineGoal(draft, 'copy-match', 'hidden');

  return makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: 4,
    columns: 5,
    spares: [],
    ledger: { run: 2, match: 1 },
    motifs: ['easy-practice'],
    macroFamily: 'easyPractice',
    exposureProfile: 'friendlyStart',
    ...draft,
  });
}

function makeStandardPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
  variant: number;
}): DawnCabinetPuzzle {
  const [a, b, c] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();
  const macroFamily = getMacroFamily(config.difficulty, config.variant);
  const exposureProfile = getExposureProfile(config.variant);
  const motifs = ['weave', 'weave', macroFamily];
  const columnLayouts = [[0, 4], [0, 3], [1, 4]] as const;
  const [leftCol, rightCol] = columnLayouts[config.variant % columnLayouts.length];
  const leftRow = Math.floor(config.variant / 3) % 4;
  const rightRow = Math.floor(config.variant / 11) % 4;
  const baseBottom = Math.max(leftRow, rightRow) + 5;
  const leftPocketCol = leftCol === 1 ? 1 : 0;
  const rightPocketCol = rightCol >= 4 ? 4 : 3;
  const leftMask = getStandardWeaveMask(config.variant);
  const rightMask = getStandardWeaveMask(config.variant >> 2);

  const left = addWeaveCluster(draft, {
    idPrefix: 'standard-left',
    suit: a,
    baseRank: r,
    originRow: leftRow,
    originCol: leftCol,
    givens: leftMask,
  });
  addWeavePairAnchor(draft, 'standard-left-pair', left, config.variant);

  const right = addWeaveCluster(draft, {
    idPrefix: 'standard-right',
    suit: b,
    baseRank: r,
    originRow: rightRow,
    originCol: rightCol,
    givens: rightMask,
  });
  addWeavePairAnchor(draft, 'standard-right-pair', right, config.variant >> 1);

  if (config.variant % 3 === 0) {
    motifs.push('flush-pocket', 'flush-pocket');
    addFlushPocket(draft, {
      idPrefix: 'standard-low-flush',
      suit: c,
      baseRank: r,
      row: baseBottom,
      col: leftPocketCol,
      orientation: config.variant % 4 === 0 ? 'horizontal' : 'vertical',
      rankOffset: 0,
    });
    addFlushPocket(draft, {
      idPrefix: 'standard-high-flush',
      suit: c,
      baseRank: r,
      row: baseBottom,
      col: rightPocketCol,
      orientation: config.variant % 4 === 0 ? 'horizontal' : 'vertical',
      rankOffset: 1,
    });
  } else if (config.variant % 3 === 1) {
    motifs.push('flush-pocket', 'copy-block');
    addFlushPocket(draft, {
      idPrefix: 'standard-center-flush',
      suit: c,
      baseRank: r,
      row: baseBottom,
      col: config.variant % 4 === 1 ? 2 : leftPocketCol,
      orientation: 'horizontal',
      rankOffset: 1,
    });
    addCopyIsland(draft, {
      idPrefix: 'standard-copy-island',
      suit: c,
      rank: r + 6,
      row: baseBottom + 2,
      col: config.variant % 2 === 0 ? 1 : 2,
    });
  } else {
    motifs.push('flush-pocket', 'run-ladder');
    addFlushPocket(draft, {
      idPrefix: 'standard-center-flush',
      suit: c,
      baseRank: r,
      row: baseBottom,
      col: config.variant % 4 === 1 ? 2 : leftPocketCol,
      orientation: 'horizontal',
      rankOffset: 1,
    });
    addRunLadder(draft, {
      idPrefix: 'standard-run-ladder',
      suit: c,
      baseRank: r,
      row: baseBottom + 2,
      col: 0,
    });
  }
  motifs.push('switchback-ladder');
  addSwitchbackLadder(draft, {
    idPrefix: 'standard-switchback',
    suit: c,
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 0 : 2,
  });
  if (config.variant % 2 === 0) {
    motifs.push('mixed-run-braid');
    addMixedRunBraid(draft, {
      idPrefix: 'standard-mixed-braid',
      suits: [a, b, c],
      baseRank: r,
      row: getDraftMaxRow(draft) + 1,
      col: config.variant % 4 === 0 ? 0 : 2,
    });
  }
  applyMacroFamilyVariation(draft, config.difficulty, macroFamily, config.variant, motifs);
  applyRailExposureProfile(draft, config.difficulty, config.variant, exposureProfile);
  const reserveCount = config.variant % 5 === 0 ? 2 : 1;
  const spares = makeArbitraryReserveTiles(config.suits, r, reserveCount, config.variant);

  return addDawnTileToPuzzle(makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: Math.max(...Object.keys(draft.solution).map((cell) => Number(cell.split(':')[0]))) + 1,
    columns: 7,
    spares,
    motifs,
    macroFamily,
    exposureProfile,
    ...draft,
  }), {
    optionCount: 3,
    variant: config.variant,
    allowDuplicateResolvedTile: true,
    preferredLineCount: config.variant % 4 === 0 ? 3 : 2,
    minLineCount: 2,
  });
}

function makeHardPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
  variant: number;
}): DawnCabinetPuzzle {
  const [a, b, c, d] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();
  const macroFamily = getMacroFamily(config.difficulty, config.variant);
  const exposureProfile = getExposureProfile(config.variant);
  const motifs = ['weave', 'weave', 'number-bridge', 'flush-pocket', macroFamily];
  const columnLayouts = [[0, 4], [0, 3], [1, 4]] as const;
  const [leftCol, rightCol] = columnLayouts[config.variant % columnLayouts.length];
  const leftRow = Math.floor(config.variant / 3) % 4;
  const rightRow = Math.floor(config.variant / 11) % 4;
  const baseBottom = Math.max(leftRow, rightRow) + 5;

  const left = addWeaveCluster(draft, {
    idPrefix: 'hard-left',
    suit: a,
    baseRank: r,
    originRow: leftRow,
    originCol: leftCol,
    givens: getHardWeaveMask(config.variant),
  });
  addWeavePairAnchor(draft, 'hard-left-pair-a', left, config.variant);
  if (config.variant % 3 !== 0) addWeavePairAnchor(draft, 'hard-left-pair-b', left, config.variant + 1);

  const right = addWeaveCluster(draft, {
    idPrefix: 'hard-right',
    suit: b,
    baseRank: r,
    originRow: rightRow,
    originCol: rightCol,
    givens: getHardWeaveMask(config.variant >> 2),
  });
  addWeavePairAnchor(draft, 'hard-right-pair-a', right, config.variant >> 1);
  if (config.variant % 4 !== 0) addWeavePairAnchor(draft, 'hard-right-pair-b', right, (config.variant >> 1) + 1);

  addNumberFlushTail(draft, {
    idPrefix: 'hard-tail',
    row: baseBottom,
    col: config.variant % 2,
    left,
    right,
    suitC: c,
    suitD: d,
    baseRank: r,
  });

  if (config.variant % 5 === 0) {
    motifs.push('run-ladder');
    addRunLadder(draft, {
      idPrefix: 'hard-run-ladder',
      suit: config.variant % 10 === 0 ? c : d,
      baseRank: r,
      row: baseBottom + 3,
      col: 0,
    });
  } else if (config.variant % 4 === 1) {
    motifs.push('copy-block');
    addCopyIsland(draft, {
      idPrefix: 'hard-copy-island',
      suit: config.variant % 8 === 1 ? c : d,
      rank: r + 6,
      row: baseBottom + 3,
      col: config.variant % 2 === 0 ? 1 : 2,
    });
  }
  motifs.push('mixed-run-braid');
  addMixedRunBraid(draft, {
    idPrefix: 'hard-mixed-braid',
    suits: [a, c, d],
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 0 : 2,
  });
  motifs.push('gap-run-pocket');
  addGapRunPocket(draft, {
    idPrefix: 'hard-gap-pocket',
    suit: config.variant % 2 === 0 ? c : d,
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 0 : 3,
  });
  if (config.variant % 3 === 0) {
    motifs.push('knot-cell');
    addKnotCell(draft, {
      idPrefix: 'hard-knot',
      suits: [b, c, d],
      baseRank: r,
      row: getDraftMaxRow(draft) + 1,
      col: config.variant % 2 === 0 ? 0 : 2,
    });
  }
  applyMacroFamilyVariation(draft, config.difficulty, macroFamily, config.variant, motifs);
  applyRailExposureProfile(draft, config.difficulty, config.variant, exposureProfile);

  const reserveCount = 2 + (config.variant % 3);
  const bankGoalType = reserveCount === 2 ? 'pair' : getThreeTileBankGoal(config.id, r, a, false);
  const spares = reserveCount === 4
    ? makeArbitraryReserveTiles(config.suits, r, reserveCount, config.variant)
    : makeBankGoalTiles(bankGoalType, config.suits, r);

  return addDawnTileToPuzzle(makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: Math.max(...Object.keys(draft.solution).map((cell) => Number(cell.split(':')[0]))) + 1,
    columns: 7,
    spares,
    bankGoal: reserveCount === 4 ? undefined : { type: bankGoalType },
    motifs,
    macroFamily,
    exposureProfile,
    ...draft,
  }), {
    optionCount: 3,
    variant: config.variant,
    preferredLineCount: 3,
    minLineCount: 3,
  });
}

function makeExpertPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
  variant: number;
}): DawnCabinetPuzzle {
  const [a, b, c, d, e] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();
  const macroFamily = getMacroFamily(config.difficulty, config.variant);
  const exposureProfile = getExposureProfile(config.variant);
  const motifs = ['weave', 'weave', 'weave', 'weave', 'number-bridge', 'flush-pocket', macroFamily];
  const columnLayouts = [[0, 4], [0, 3], [1, 4]] as const;
  const [leftCol, rightCol] = columnLayouts[config.variant % columnLayouts.length];
  const topStagger = config.variant % 3;
  const bottomStagger = (config.variant >> 2) % 3;
  const topLeftRow = topStagger === 1 ? 1 : 0;
  const topRightRow = topStagger === 2 ? 1 : 0;
  const bottomBase = Math.max(topLeftRow, topRightRow) + 5 + (config.variant % 2);
  const bottomLeftRow = bottomBase + (bottomStagger === 1 ? 1 : 0);
  const bottomRightRow = bottomBase + (bottomStagger === 2 ? 1 : 0);

  const topLeft = addWeaveCluster(draft, {
    idPrefix: 'expert-left',
    suit: a,
    baseRank: r,
    originRow: topLeftRow,
    originCol: leftCol,
    givens: getHardWeaveMask(config.variant),
  });
  addWeavePairAnchor(draft, 'expert-left-pair-a', topLeft, config.variant);
  addWeavePairAnchor(draft, 'expert-left-pair-b', topLeft, config.variant + 1);

  const topRight = addWeaveCluster(draft, {
    idPrefix: 'expert-right',
    suit: b,
    baseRank: r,
    originRow: topRightRow,
    originCol: rightCol,
    givens: getHardWeaveMask(config.variant >> 1),
  });
  addWeavePairAnchor(draft, 'expert-right-pair-a', topRight, config.variant >> 1);
  if (config.variant % 4 !== 0) addWeavePairAnchor(draft, 'expert-right-pair-b', topRight, (config.variant >> 1) + 1);

  const lowerLeft = addWeaveCluster(draft, {
    idPrefix: 'expert-lower-left',
    suit: c,
    baseRank: r,
    originRow: bottomLeftRow,
    originCol: leftCol,
    givens: getHardWeaveMask(config.variant >> 2),
  });
  addWeavePairAnchor(draft, 'expert-lower-left-pair-a', lowerLeft, config.variant >> 2);
  if (config.variant % 5 !== 0) addWeavePairAnchor(draft, 'expert-lower-left-pair-b', lowerLeft, (config.variant >> 2) + 1);

  const lowerRight = addWeaveCluster(draft, {
    idPrefix: 'expert-lower-right',
    suit: d,
    baseRank: r,
    originRow: bottomRightRow,
    originCol: rightCol,
    givens: getHardWeaveMask(config.variant >> 3),
  });
  addWeavePairAnchor(draft, 'expert-lower-right-pair-a', lowerRight, config.variant >> 3);
  addWeavePairAnchor(draft, 'expert-lower-right-pair-b', lowerRight, (config.variant >> 3) + 1);

  const tailRow = Math.max(bottomLeftRow, bottomRightRow) + 5 + (config.variant % 3 === 0 ? 1 : 0);
  addExpertFifthSuitTail(draft, {
    idPrefix: 'expert-tail',
    row: tailRow,
    topLeft,
    topRight,
    lowerLeft,
    lowerRight,
    suit: e,
    baseRank: r,
  });

  if (config.variant % 2 === 0) {
    motifs.push('long-spine');
    addLine(draft, 'expert-cross-low', [topLeft.midLeft, topRight.midLeft, lowerLeft.midLeft], 'hidden');
    addLine(draft, 'expert-cross-high', [topLeft.midRight, topRight.midRight, lowerRight.midRight], 'hidden');
  }
  if (config.variant % 3 === 0) {
    motifs.push('run-ladder');
    addRunLadder(draft, {
      idPrefix: 'expert-run-ladder',
      suit: e,
      baseRank: r,
      row: tailRow + 2,
      col: 0,
    });
  }
  motifs.push('mixed-run-braid');
  addMixedRunBraid(draft, {
    idPrefix: 'expert-mixed-braid',
    suits: [a, c, e],
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 0 : 2,
  });
  motifs.push('gap-run-pocket');
  addGapRunPocket(draft, {
    idPrefix: 'expert-gap-pocket',
    suit: config.variant % 2 === 0 ? d : e,
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 0 : 3,
  });
  motifs.push('mixed-gap-braid');
  addMixedGapBraid(draft, {
    idPrefix: 'expert-mixed-gap',
    suits: [b, d, e],
    baseRank: r,
    row: getDraftMaxRow(draft) + 1,
    col: config.variant % 2 === 0 ? 2 : 0,
  });
  if (config.variant % 2 === 0) {
    motifs.push('knot-cell');
    addKnotCell(draft, {
      idPrefix: 'expert-knot',
      suits: [b, d, e],
      baseRank: r,
      row: getDraftMaxRow(draft) + 1,
      col: 0,
    });
  } else {
    motifs.push('flush-basin');
    addFlushBasin(draft, {
      idPrefix: 'expert-basin',
      suit: e,
      baseRank: r,
      row: getDraftMaxRow(draft) + 1,
      col: 0,
    });
  }
  applyMacroFamilyVariation(draft, config.difficulty, macroFamily, config.variant, motifs);
  applyRailExposureProfile(draft, config.difficulty, config.variant, exposureProfile);

  const reserveCount = 3;
  const bankGoalType = reserveCount === 3 ? getThreeTileBankGoal(config.date, r, a, true) : undefined;
  const spares = bankGoalType
    ? makeBankGoalTiles(bankGoalType, config.suits, r)
    : makeArbitraryReserveTiles(config.suits, r, reserveCount, config.variant);

  return addDawnTileToPuzzle(makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: Math.max(...Object.keys(draft.solution).map((cell) => Number(cell.split(':')[0]))) + 1,
    columns: 7,
    spares,
    bankGoal: bankGoalType ? { type: bankGoalType } : undefined,
    motifs,
    macroFamily,
    exposureProfile,
    ...draft,
  }), {
    optionCount: 4,
    variant: config.variant,
    preferredLineCount: config.variant % 5 === 0 ? 4 : 3,
    minLineCount: 3,
  });
}

function getStandardWeaveMask(variant: number): WeaveCellName[] {
  const masks: WeaveCellName[][] = [
    ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottom', 'bottomRight'],
    ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
    ['topLeft', 'top', 'mid', 'bottomLeft', 'bottomRight'],
  ];
  return masks[Math.abs(variant) % masks.length];
}

function getHardWeaveMask(variant: number): WeaveCellName[] {
  const masks: WeaveCellName[][] = [
    ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
    ['topLeft', 'topRight', 'midLeft', 'midRight', 'bottom'],
    ['topLeft', 'top', 'mid', 'bottomLeft', 'bottomRight'],
  ];
  return masks[Math.abs(variant) % masks.length];
}

function addWeavePairAnchor(
  draft: PuzzleDraft,
  id: string,
  cells: Record<WeaveCellName, string>,
  variant: number
) {
  const anchorChoices: [WeaveCellName, WeaveCellName][] = [
    ['topLeft', 'midLeft'],
    ['midLeft', 'bottomLeft'],
    ['topRight', 'midRight'],
    ['midRight', 'bottomRight'],
  ];
  const [first, second] = anchorChoices[Math.abs(variant) % anchorChoices.length];
  addLine(draft, id, [cells[first], cells[second]], 'pair');
}

function addFlushPocket(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    row: number;
    col: number;
    orientation: 'horizontal' | 'vertical';
    rankOffset: number;
  }
) {
  const low = config.baseRank + config.rankOffset;
  const mid = config.baseRank + config.rankOffset + 3;
  const high = config.baseRank + 6;
  const start = cellKey(config.row, config.col);
  const wait = config.orientation === 'horizontal'
    ? cellKey(config.row, config.col + 1)
    : cellKey(config.row + 1, config.col);
  const end = config.orientation === 'horizontal'
    ? cellKey(config.row, config.col + 2)
    : cellKey(config.row + 2, config.col);
  const anchor = config.orientation === 'horizontal'
    ? cellKey(config.row + 1, config.col + 1)
    : cellKey(config.row + 1, config.col + 1);

  place(draft, start, { suit: config.suit, rank: low }, true);
  place(draft, wait, { suit: config.suit, rank: mid });
  place(draft, end, { suit: config.suit, rank: high }, true);
  place(draft, anchor, { suit: config.suit, rank: mid }, true);
  addLine(draft, `${config.idPrefix}-flush`, [start, wait, end], 'hidden');
  addLine(draft, `${config.idPrefix}-anchor`, [wait, anchor], 'pair');
}

function addRunLadder(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    row: number;
    col: number;
  }
) {
  addLinkedRunWait(draft, {
    idPrefix: config.idPrefix,
    suit: config.suit,
    baseRank: config.baseRank,
    lowA: cellKey(config.row, config.col),
    lowB: cellKey(config.row, config.col + 1),
    left: cellKey(config.row, config.col + 2),
    center: cellKey(config.row, config.col + 3),
    right: cellKey(config.row, config.col + 4),
    highA: cellKey(config.row, config.col + 5),
    highB: cellKey(config.row, config.col + 6),
  });
}

function addCopyIsland(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    rank: number;
    row: number;
    col: number;
  }
) {
  addCopyBlock(draft, {
    idPrefix: config.idPrefix,
    suit: config.suit,
    rank: config.rank,
    blankA: cellKey(config.row, config.col),
    matchGiven: cellKey(config.row, config.col + 1),
    blankB: cellKey(config.row, config.col + 2),
    pairGivenA: cellKey(config.row + 1, config.col),
    pairGivenB: cellKey(config.row + 1, config.col + 2),
  });
}

function addSwitchbackLadder(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const r = config.baseRank;
  const low = cellKey(config.row, config.col);
  const lowMid = cellKey(config.row, config.col + 1);
  const pivot = cellKey(config.row, config.col + 2);
  const highMid = cellKey(config.row, config.col + 3);
  const high = cellKey(config.row, config.col + 4);
  place(draft, low, { suit: config.suit, rank: r }, true);
  place(draft, lowMid, { suit: config.suit, rank: r + 1 }, true);
  place(draft, pivot, { suit: config.suit, rank: r + 2 });
  place(draft, highMid, { suit: config.suit, rank: r + 3 }, true);
  place(draft, high, { suit: config.suit, rank: r + 4 }, true);
  addLine(draft, `${config.idPrefix}-low`, [low, lowMid, pivot], 'hidden');
  addLine(draft, `${config.idPrefix}-high`, [pivot, highMid, high], 'hidden');
}

function addMixedRunBraid(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suits: [DawnCabinetSuit, DawnCabinetSuit, DawnCabinetSuit];
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const [a, b, c] = config.suits;
  const r = config.baseRank;
  const topLow = cellKey(config.row, config.col);
  const topMid = cellKey(config.row, config.col + 1);
  const topHigh = cellKey(config.row, config.col + 2);
  const bottomLow = cellKey(config.row + 1, config.col);
  const bottomMid = cellKey(config.row + 1, config.col + 1);
  const bottomHigh = cellKey(config.row + 1, config.col + 2);
  place(draft, topLow, { suit: a, rank: r }, true);
  place(draft, topMid, { suit: b, rank: r + 1 });
  place(draft, topHigh, { suit: c, rank: r + 2 }, true);
  place(draft, bottomLow, { suit: c, rank: r }, true);
  place(draft, bottomMid, { suit: a, rank: r + 1 });
  place(draft, bottomHigh, { suit: b, rank: r + 2 }, true);
  addLine(draft, `${config.idPrefix}-top`, [topLow, topMid, topHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-bottom`, [bottomLow, bottomMid, bottomHigh], 'hidden');
}

function addGapRunPocket(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const r = config.baseRank;
  const topLow = cellKey(config.row, config.col);
  const topMid = cellKey(config.row, config.col + 1);
  const topHigh = cellKey(config.row, config.col + 2);
  const bottomLow = cellKey(config.row + 1, config.col);
  const bottomMid = cellKey(config.row + 1, config.col + 1);
  const bottomHigh = cellKey(config.row + 1, config.col + 2);
  place(draft, topLow, { suit: config.suit, rank: r }, true);
  place(draft, topMid, { suit: config.suit, rank: r + 2 });
  place(draft, topHigh, { suit: config.suit, rank: r + 4 }, true);
  place(draft, bottomLow, { suit: config.suit, rank: r + 1 }, true);
  place(draft, bottomMid, { suit: config.suit, rank: r + 3 });
  place(draft, bottomHigh, { suit: config.suit, rank: r + 5 }, true);
  addLine(draft, `${config.idPrefix}-top`, [topLow, topMid, topHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-bottom`, [bottomLow, bottomMid, bottomHigh], 'hidden');
}

function addMixedGapBraid(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suits: [DawnCabinetSuit, DawnCabinetSuit, DawnCabinetSuit];
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const [a, b, c] = config.suits;
  const r = config.baseRank;
  const topLow = cellKey(config.row, config.col);
  const topMid = cellKey(config.row, config.col + 1);
  const topHigh = cellKey(config.row, config.col + 2);
  const bottomLow = cellKey(config.row + 1, config.col);
  const bottomMid = cellKey(config.row + 1, config.col + 1);
  const bottomHigh = cellKey(config.row + 1, config.col + 2);
  place(draft, topLow, { suit: a, rank: r }, true);
  place(draft, topMid, { suit: b, rank: r + 2 });
  place(draft, topHigh, { suit: c, rank: r + 4 }, true);
  place(draft, bottomLow, { suit: c, rank: r + 1 }, true);
  place(draft, bottomMid, { suit: a, rank: r + 3 });
  place(draft, bottomHigh, { suit: b, rank: r + 5 }, true);
  addLine(draft, `${config.idPrefix}-top`, [topLow, topMid, topHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-bottom`, [bottomLow, bottomMid, bottomHigh], 'hidden');
}

function addKnotCell(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suits: [DawnCabinetSuit, DawnCabinetSuit, DawnCabinetSuit];
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const [a, b, c] = config.suits;
  const r = config.baseRank + 1;
  const center = cellKey(config.row + 1, config.col + 1);
  const runLow = cellKey(config.row + 1, config.col);
  const runHigh = cellKey(config.row + 1, config.col + 2);
  const matchTop = cellKey(config.row, config.col + 1);
  const matchBottom = cellKey(config.row + 2, config.col + 1);
  const numberTop = cellKey(config.row, config.col);
  const numberBottom = cellKey(config.row + 2, config.col + 2);
  place(draft, center, { suit: a, rank: r });
  place(draft, runLow, { suit: a, rank: r - 1 }, true);
  place(draft, runHigh, { suit: a, rank: r + 1 }, true);
  place(draft, matchTop, { suit: a, rank: r }, true);
  place(draft, matchBottom, { suit: a, rank: r });
  place(draft, numberTop, { suit: b, rank: r }, true);
  place(draft, numberBottom, { suit: c, rank: r }, true);
  addLine(draft, `${config.idPrefix}-run`, [runLow, center, runHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-match`, [matchTop, center, matchBottom], 'hidden');
  addLine(draft, `${config.idPrefix}-number`, [numberTop, center, numberBottom], 'hidden');
}

function addFlushBasin(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    row: number;
    col: number;
  }
) {
  const r = config.baseRank;
  const a = cellKey(config.row, config.col);
  const b = cellKey(config.row, config.col + 2);
  const c = cellKey(config.row, config.col + 4);
  const d = cellKey(config.row + 1, config.col + 1);
  const e = cellKey(config.row + 1, config.col + 3);
  place(draft, a, { suit: config.suit, rank: r }, true);
  place(draft, b, { suit: config.suit, rank: r + 2 });
  place(draft, c, { suit: config.suit, rank: r + 6 }, true);
  place(draft, d, { suit: config.suit, rank: r + 3 });
  place(draft, e, { suit: config.suit, rank: r + 5 }, true);
  addCellClue(draft, b, { rank: r + 2 });
  addCellClue(draft, d, { rank: r + 3 });
  addLine(draft, `${config.idPrefix}-wide`, [a, b, c], 'hidden');
  addLine(draft, `${config.idPrefix}-middle`, [b, d, e], 'hidden');
  addLine(draft, `${config.idPrefix}-rim`, [a, d, c], 'hidden');
}

function addNumberFlushTail(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    row: number;
    col: number;
    left: Record<WeaveCellName, string>;
    right: Record<WeaveCellName, string>;
    suitC: DawnCabinetSuit;
    suitD: DawnCabinetSuit;
    baseRank: number;
  }
) {
  const r = config.baseRank;
  const cLow = cellKey(config.row, config.col);
  const dLow = cellKey(config.row, config.col + 1);
  const cMid = cellKey(config.row, config.col + 2);
  const cBridge = cellKey(config.row, config.col + 3);
  const dMid = cellKey(config.row, config.col + 4);
  const dHigh = cellKey(config.row, config.col + 5);
  const cLowPair = cellKey(config.row + 1, config.col);
  const cHigh = cellKey(config.row + 1, config.col + 1);
  const cLowPairAnchor = cellKey(config.row + 1, config.col + 2);
  const dMidAnchor = cellKey(config.row + 1, config.col + 4);

  place(draft, cLow, { suit: config.suitC, rank: r });
  place(draft, dLow, { suit: config.suitD, rank: r + 2 });
  place(draft, cMid, { suit: config.suitC, rank: r + 1 });
  place(draft, cBridge, { suit: config.suitC, rank: r + 5 }, true);
  place(draft, dMid, { suit: config.suitD, rank: r + 4 });
  place(draft, dHigh, { suit: config.suitD, rank: r + 6 }, true);
  place(draft, cLowPair, { suit: config.suitC, rank: r + 3 });
  place(draft, cHigh, { suit: config.suitC, rank: r + 6 }, true);
  place(draft, cLowPairAnchor, { suit: config.suitC, rank: r + 3 }, true);
  place(draft, dMidAnchor, { suit: config.suitD, rank: r + 4 }, true);

  addLine(draft, `${config.idPrefix}-number-low`, [config.left.topLeft, config.right.topLeft, cLow], 'hidden');
  addLine(draft, `${config.idPrefix}-number-mid`, [config.left.mid, config.right.mid, cMid], 'hidden');
  addLine(draft, `${config.idPrefix}-number-high`, [config.left.topRight, config.right.topRight, dLow], 'hidden');
  addLine(draft, `${config.idPrefix}-flush-c-low`, [cLow, cMid, cBridge], 'hidden');
  addLine(draft, `${config.idPrefix}-flush-c-high`, [cLowPair, cBridge, cHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-flush-d`, [dLow, dMid, dHigh], 'hidden');
  addLine(draft, `${config.idPrefix}-flush-c-anchor`, [cLowPair, cLowPairAnchor], 'pair');
  addLine(draft, `${config.idPrefix}-flush-d-anchor`, [dMid, dMidAnchor], 'pair');
}

function addExpertFifthSuitTail(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    row: number;
    topLeft: Record<WeaveCellName, string>;
    topRight: Record<WeaveCellName, string>;
    lowerLeft: Record<WeaveCellName, string>;
    lowerRight: Record<WeaveCellName, string>;
    suit: DawnCabinetSuit;
    baseRank: number;
  }
) {
  const r = config.baseRank;
  const cells = Array.from({ length: 7 }, (_, col) => cellKey(config.row, col));
  place(draft, cells[0], { suit: config.suit, rank: r });
  place(draft, cells[1], { suit: config.suit, rank: r + 1 });
  place(draft, cells[2], { suit: config.suit, rank: r + 2 });
  place(draft, cells[3], { suit: config.suit, rank: r });
  place(draft, cells[4], { suit: config.suit, rank: r + 5 }, true);
  place(draft, cells[5], { suit: config.suit, rank: r + 6 });
  place(draft, cells[6], { suit: config.suit, rank: r + 6 }, true);
  addLine(draft, `${config.idPrefix}-number-north-low`, [config.topLeft.topLeft, config.topRight.topLeft, cells[0]], 'hidden');
  addLine(draft, `${config.idPrefix}-number-north-mid`, [config.topLeft.mid, config.topRight.mid, cells[1]], 'hidden');
  addLine(draft, `${config.idPrefix}-number-north-high`, [config.topLeft.topRight, config.topRight.topRight, cells[2]], 'hidden');
  addLine(draft, `${config.idPrefix}-number-south-low`, [config.lowerLeft.topLeft, config.lowerRight.topLeft, cells[3]], 'hidden');
  addLine(draft, `${config.idPrefix}-low-flush`, [cells[0], cells[2], cells[4]], 'hidden');
  addLine(draft, `${config.idPrefix}-high-flush`, [cells[1], cells[3], cells[5]], 'hidden');
  addLine(draft, `${config.idPrefix}-anchor`, [cells[5], cells[6]], 'pair');
}

function getThreeTileBankGoal(
  id: string,
  baseRank: number,
  firstSuit: DawnCabinetSuit,
  includeMixedGap: boolean
): Exclude<DawnCabinetSetKind, 'pair'> {
  const goals: Exclude<DawnCabinetSetKind, 'pair'>[] = includeMixedGap
    ? ['run', 'mixedRun', 'gapRun', 'mixedGap', 'match', 'flush', 'number']
    : ['run', 'mixedRun', 'gapRun', 'match', 'flush', 'number'];
  const dayIndex = getUtcDayIndex(id);
  const offset = Number.isNaN(dayIndex)
    ? Number(stableSeed(`${id}:${baseRank}:${firstSuit}:${includeMixedGap}`) % BigInt(goals.length))
    : Math.abs(dayIndex + baseRank + SUITS.indexOf(firstSuit)) % goals.length;
  return goals[offset];
}

function makeBankGoalTiles(
  goal: DawnCabinetSetKind,
  suits: DawnCabinetSuit[],
  baseRank: number
): DawnCabinetTile[] {
  const [a, b, c, d] = suits;
  if (goal === 'pair') {
    return [
      { suit: a, rank: baseRank + 6 },
      { suit: a, rank: baseRank + 6 },
    ];
  }
  if (goal === 'run') {
    return [
      { suit: a, rank: baseRank + 4 },
      { suit: a, rank: baseRank + 5 },
      { suit: a, rank: baseRank + 6 },
    ];
  }
  if (goal === 'mixedRun') {
    return [
      { suit: a, rank: baseRank + 4 },
      { suit: b, rank: baseRank + 5 },
      { suit: c, rank: baseRank + 6 },
    ];
  }
  if (goal === 'gapRun') {
    return [
      { suit: a, rank: baseRank + 2 },
      { suit: a, rank: baseRank + 4 },
      { suit: a, rank: baseRank + 6 },
    ];
  }
  if (goal === 'mixedGap') {
    return [
      { suit: a, rank: baseRank + 2 },
      { suit: b, rank: baseRank + 4 },
      { suit: c, rank: baseRank + 6 },
    ];
  }
  if (goal === 'match') {
    return [
      { suit: d, rank: baseRank + 6 },
      { suit: d, rank: baseRank + 6 },
      { suit: d, rank: baseRank + 6 },
    ];
  }
  if (goal === 'flush') {
    return [
      { suit: a, rank: baseRank + 3 },
      { suit: a, rank: baseRank + 5 },
      { suit: a, rank: baseRank + 6 },
    ];
  }
  return [
    { suit: a, rank: baseRank + 6 },
    { suit: b, rank: baseRank + 6 },
    { suit: c, rank: baseRank + 6 },
  ];
}

function makeArbitraryReserveTiles(
  suits: DawnCabinetSuit[],
  baseRank: number,
  count: number,
  variant: number
): DawnCabinetTile[] {
  return Array.from({ length: count }, (_, index) => {
    const suit = suits[(variant + index * 2) % suits.length];
    const rank = Math.min(9, baseRank + 6 - (index % 2));
    return { suit, rank };
  });
}

type WeaveCellName =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'upper'
  | 'midLeft'
  | 'mid'
  | 'midRight'
  | 'lower'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight';

function addWeaveCluster(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    originRow: number;
    originCol: number;
    givens: WeaveCellName[];
  }
): Record<WeaveCellName, string> {
  const keyFor = (rowOffset: number, colOffset: number) =>
    cellKey(config.originRow + rowOffset, config.originCol + colOffset);
  const cells: Record<WeaveCellName, string> = {
    topLeft: keyFor(0, 0),
    top: keyFor(0, 1),
    topRight: keyFor(0, 2),
    upper: keyFor(1, 1),
    midLeft: keyFor(2, 0),
    mid: keyFor(2, 1),
    midRight: keyFor(2, 2),
    lower: keyFor(3, 1),
    bottomLeft: keyFor(4, 0),
    bottom: keyFor(4, 1),
    bottomRight: keyFor(4, 2),
  };
  const givenSet = new Set(config.givens);
  const placeWeave = (name: WeaveCellName, rank: number) => {
    place(draft, cells[name], { suit: config.suit, rank }, givenSet.has(name));
  };

  placeWeave('topLeft', config.baseRank);
  placeWeave('midLeft', config.baseRank);
  placeWeave('bottomLeft', config.baseRank);

  placeWeave('top', config.baseRank + 1);
  placeWeave('upper', config.baseRank + 1);
  placeWeave('mid', config.baseRank + 1);
  placeWeave('lower', config.baseRank + 1);
  placeWeave('bottom', config.baseRank + 1);

  placeWeave('topRight', config.baseRank + 2);
  placeWeave('midRight', config.baseRank + 2);
  placeWeave('bottomRight', config.baseRank + 2);

  addLine(draft, `${config.idPrefix}-top`, [cells.topLeft, cells.top, cells.topRight], 'hidden');
  addLine(draft, `${config.idPrefix}-upper-spine`, [cells.top, cells.upper, cells.mid], 'hidden');
  addLine(draft, `${config.idPrefix}-middle`, [cells.midLeft, cells.mid, cells.midRight], 'hidden');
  addLine(draft, `${config.idPrefix}-lower-spine`, [cells.mid, cells.lower, cells.bottom], 'hidden');
  addLine(draft, `${config.idPrefix}-bottom`, [cells.bottomLeft, cells.bottom, cells.bottomRight], 'hidden');
  return cells;
}

function addLinkedRunWait(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    baseRank: number;
    left: string;
    center: string;
    right: string;
    lowA: string;
    lowB: string;
    highA: string;
    highB: string;
  }
) {
  const r = config.baseRank;
  place(draft, config.left, { suit: config.suit, rank: r + 2 });
  place(draft, config.center, { suit: config.suit, rank: r + 3 }, true);
  place(draft, config.right, { suit: config.suit, rank: r + 4 });
  place(draft, config.lowA, { suit: config.suit, rank: r }, true);
  place(draft, config.lowB, { suit: config.suit, rank: r + 1 }, true);
  place(draft, config.highA, { suit: config.suit, rank: r + 5 }, true);
  place(draft, config.highB, { suit: config.suit, rank: r + 6 }, true);

  addLine(draft, `${config.idPrefix}-middle-run`, [config.left, config.center, config.right], 'run');
  addLine(draft, `${config.idPrefix}-low-wait`, [config.lowA, config.lowB, config.left], 'run');
  addLine(draft, `${config.idPrefix}-high-wait`, [config.right, config.highA, config.highB], 'run');
}

function addCopyBlock(
  draft: PuzzleDraft,
  config: {
    idPrefix: string;
    suit: DawnCabinetSuit;
    rank: number;
    blankA: string;
    blankB: string;
    matchGiven: string;
    pairGivenA: string;
    pairGivenB: string;
  }
) {
  const tile = { suit: config.suit, rank: config.rank };
  place(draft, config.blankA, tile);
  place(draft, config.blankB, tile);
  place(draft, config.matchGiven, tile, true);
  place(draft, config.pairGivenA, tile, true);
  place(draft, config.pairGivenB, tile, true);
  addLine(draft, `${config.idPrefix}-match`, [config.blankA, config.blankB, config.matchGiven], 'match');
  addLine(draft, `${config.idPrefix}-left-pair`, [config.pairGivenA, config.blankA], 'pair');
  addLine(draft, `${config.idPrefix}-right-pair`, [config.pairGivenB, config.blankB], 'pair');
}

function addDawnTileToPuzzle(
  puzzle: DawnCabinetPuzzle,
  config: {
    optionCount: 3 | 4;
    variant: number;
    allowDuplicateResolvedTile?: boolean;
    preferredLineCount?: number;
    minLineCount?: number;
  }
): DawnCabinetPuzzle {
  const linesByCell = getLinesByCell(puzzle);
  const bankCounts = countTiles(puzzle.bank);
  const reserveCounts = countTiles(puzzle.reserveTiles);
  const minLineCount = config.minLineCount ?? 2;
  const preferredLineCount = config.preferredLineCount ?? minLineCount;
  const allowDuplicateResolvedTile = config.allowDuplicateResolvedTile ?? false;
  const blankCells = puzzle.cells
    .map((cell) => cellKey(cell.row, cell.col))
    .filter((cell) => !puzzle.givens[cell]);
  const baseCandidates = blankCells
    .map((cell) => {
      const lines = linesByCell[cell] ?? [];
      const hiddenCount = lines.filter((line) => line.goal === 'hidden').length;
      const tile = puzzle.solution[cell];
      return { cell, tile, lineCount: lines.length, hiddenCount };
    })
    .filter(({ tile, lineCount, hiddenCount }) => {
      return tile && lineCount >= minLineCount && hiddenCount >= 1 && !reserveCounts[tileKey(tile)];
    });
  const relaxedCandidates = minLineCount > 2 && baseCandidates.length === 0
    ? blankCells
      .map((cell) => {
        const lines = linesByCell[cell] ?? [];
        const hiddenCount = lines.filter((line) => line.goal === 'hidden').length;
        const tile = puzzle.solution[cell];
        return { cell, tile, lineCount: lines.length, hiddenCount };
      })
      .filter(({ tile, lineCount, hiddenCount }) =>
        tile && lineCount >= 2 && hiddenCount >= 1 && !reserveCounts[tileKey(tile)]
      )
    : baseCandidates;
  const uniqueCandidates = relaxedCandidates.filter(({ tile }) => tile && bankCounts[tileKey(tile)] === 1);
  const candidates = (uniqueCandidates.length > 0 ? uniqueCandidates : allowDuplicateResolvedTile ? relaxedCandidates : relaxedCandidates)
    .sort((left, right) =>
      Math.abs(preferredLineCount - left.lineCount) - Math.abs(preferredLineCount - right.lineCount) ||
      right.hiddenCount - left.hiddenCount ||
      right.lineCount - left.lineCount ||
      tileKey(left.tile).localeCompare(tileKey(right.tile)) ||
      left.cell.localeCompare(right.cell)
    );

  if (candidates.length === 0) return puzzle;

  const dawnChoicePool = candidates.slice(0, Math.min(candidates.length, 8));
  const offset = Math.abs(config.variant) % dawnChoicePool.length;
  const ordered = [...dawnChoicePool.slice(offset), ...dawnChoicePool.slice(0, offset)];
  const chosen = ordered[0];
  const options = makeDawnOptions(puzzle, chosen.cell, chosen.tile, config.optionCount, config.variant);
  const dawnTile: DawnCabinetDawnTile = {
    id: `${puzzle.id}-dawn`,
    solutionCell: chosen.cell,
    resolvedTile: chosen.tile,
    options,
  };
  const reserveTiles = puzzle.reserveTiles;
  const bank = [
    ...puzzle.cells
      .map((cell) => cellKey(cell.row, cell.col))
      .filter((cell) => cell !== chosen.cell && !puzzle.givens[cell])
      .map((cell) => puzzle.solution[cell]),
    ...reserveTiles,
  ].sort(compareTiles);
  const next = {
    ...puzzle,
    bank,
    dawnTile,
    motifs: [...puzzle.motifs, 'dawn-tile'],
  };
  return finalizePuzzleMetadata(next);
}

function makeDawnOptions(
  puzzle: DawnCabinetPuzzle,
  chosenCell: string,
  resolvedTile: DawnCabinetTile,
  optionCount: 3 | 4,
  variant: number
): DawnCabinetTile[] {
  const suits = Array.from(new Set(Object.values(puzzle.solution).map((tile) => tile.suit)));
  const otherSolutionKeys = new Set(
    Object.entries(puzzle.solution)
      .filter(([cell]) => cell !== chosenCell)
      .map(([, tile]) => tileKey(tile))
  );
  const pool: DawnCabinetTile[] = [
    ...suits.flatMap((suit) => Array.from({ length: 9 }, (_, index) => ({ suit, rank: index + 1 }))),
    ...suits.map((suit) => ({ suit, rank: resolvedTile.rank })),
    { suit: resolvedTile.suit, rank: Math.max(1, resolvedTile.rank - 2) },
    { suit: resolvedTile.suit, rank: Math.max(1, resolvedTile.rank - 1) },
    { suit: resolvedTile.suit, rank: Math.min(9, resolvedTile.rank + 1) },
    { suit: resolvedTile.suit, rank: Math.min(9, resolvedTile.rank + 2) },
    ...suits.flatMap((suit, index) => [
      { suit, rank: Math.max(1, resolvedTile.rank - 1 - (index % 2)) },
      { suit, rank: Math.min(9, resolvedTile.rank + 1 + (index % 2)) },
    ]),
  ];
  const seen = new Set([tileKey(resolvedTile)]);
  const ordered = pool
    .filter((tile) => tile.rank >= 1 && tile.rank <= 9 && tileKey(tile) !== tileKey(resolvedTile))
    .sort((left, right) => {
      const leftHash = stableSeed(`${variant}:${tileKey(left)}`);
      const rightHash = stableSeed(`${variant}:${tileKey(right)}`);
      return leftHash < rightHash ? -1 : leftHash > rightHash ? 1 : compareTiles(left, right);
    });
  const safeOptions = ordered.filter((tile) =>
    !otherSolutionKeys.has(tileKey(tile)) &&
    !canDawnOptionFitCell(puzzle, chosenCell, tile) &&
    !canDawnOptionFitAnotherCell(puzzle, chosenCell, tile)
  );
  const unusedOptions = ordered.filter((tile) =>
    !otherSolutionKeys.has(tileKey(tile)) && !canDawnOptionFitCell(puzzle, chosenCell, tile)
  );
  const optionPool = [...safeOptions, ...unusedOptions, ...ordered];
  const options = [resolvedTile];
  optionPool.forEach((tile) => {
    if (options.length >= optionCount) return;
    const key = tileKey(tile);
    if (seen.has(key)) return;
    seen.add(key);
    options.push(tile);
  });
  return options.sort(compareTiles);
}

function canDawnOptionFitAnotherCell(
  puzzle: DawnCabinetPuzzle,
  chosenCell: string,
  tile: DawnCabinetTile
): boolean {
  return puzzle.cells
    .map((cell) => cellKey(cell.row, cell.col))
    .filter((cell) => cell !== chosenCell && !puzzle.givens[cell])
    .some((cell) => canDawnOptionFitCell(puzzle, cell, tile));
}

function canDawnOptionFitCell(
  puzzle: DawnCabinetPuzzle,
  cell: string,
  tile: DawnCabinetTile
): boolean {
  if (!tileMatchesCellClue(tile, puzzle.cellClues[cell])) return false;
  const linesByCell = getLinesByCell(puzzle);
  const placements = { ...puzzle.givens, [cell]: tile };
  return (linesByCell[cell] ?? []).every((line) => {
    const assigned = line.cells.map((lineCell) => placements[lineCell]).filter(Boolean);
    if (assigned.length === line.cells.length) return isValidCabinetLine(assigned, line.goal);
    return canCompleteLine(assigned, line.goal);
  });
}

function removeOneTile(tiles: DawnCabinetTile[], tile: DawnCabinetTile): DawnCabinetTile[] {
  let removed = false;
  return tiles.filter((candidate) => {
    if (!removed && tileKey(candidate) === tileKey(tile)) {
      removed = true;
      return false;
    }
    return true;
  });
}

function makePuzzle(config: {
  id: string;
  date: string;
  title: string;
  difficulty: DawnCabinetDifficulty;
  rows: number;
  columns: number;
  lines: DawnCabinetLine[];
  solution: Record<string, DawnCabinetTile>;
  givens: string[];
  spares: DawnCabinetTile[];
  cellClues?: Record<string, DawnCabinetCellClue>;
  ledger?: DawnCabinetLedger;
  bankGoal?: DawnCabinetBankGoal;
  motifs?: string[];
  macroFamily?: DawnCabinetMacroFamily;
  exposureProfile?: DawnCabinetExposureProfile;
  qualityFlags?: string[];
  shapeSignature?: string;
  compositeSignature?: string;
}): DawnCabinetPuzzle {
  const givenSet = new Set(config.givens);
  const cells = Object.keys(config.solution)
    .map((key) => {
      const [row, col] = key.split(':').map(Number);
      return { row, col };
    })
    .sort((left, right) => left.row - right.row || left.col - right.col);
  const givens = Object.fromEntries(
    Object.entries(config.solution).filter(([key]) => givenSet.has(key))
  );
  const bank = [
    ...cells
    .map((cell) => cellKey(cell.row, cell.col))
    .filter((key) => !givens[key])
      .map((key) => config.solution[key]),
    ...config.spares,
  ].sort(compareTiles);
  const ledger = config.ledger ?? makeLedgerForLines(config.lines, config.solution);
  const shapeSignature = config.shapeSignature ?? makeShapeSignature(cells, config.lines);
  const basePuzzle = {
    id: config.id,
    date: config.date,
    title: config.title,
    difficulty: config.difficulty,
    rows: config.rows,
    columns: config.columns,
    cells,
    lines: config.lines,
    givens,
    cellClues: config.cellClues ?? {},
    ledger,
    bankGoal: config.bankGoal,
    solution: config.solution,
    bank,
    reserveTiles: [...config.spares].sort(compareTiles),
    spareCount: config.spares.length,
    motifs: config.motifs ?? [],
    macroFamily: config.macroFamily,
    exposureProfile: config.exposureProfile,
    qualityFlags: config.qualityFlags ?? [],
    shapeSignature,
    compositeSignature: config.compositeSignature ?? '',
  };

  return finalizePuzzleMetadata(basePuzzle);
}

function finalizePuzzleMetadata(puzzle: DawnCabinetPuzzle): DawnCabinetPuzzle {
  const qualityFlags = makeQualityFlags(puzzle);
  const playProfile = makePlayProfile({ ...puzzle, qualityFlags });
  const next = {
    ...puzzle,
    playProfile,
    qualityFlags,
  };
  return {
    ...next,
    compositeSignature: makeCompositeSignature(next),
  };
}

function makeQualityFlags(puzzle: DawnCabinetPuzzle): string[] {
  const flags: string[] = [];
  if (puzzle.columns <= 7) flags.push('mobile-safe-width');
  if (isBoardConnected(puzzle)) flags.push('connected-board');
  if (getVisibleRailSpreadScore(puzzle) >= 8) flags.push('spread-visible-rails');
  if (getDawnQualityScore(puzzle) >= getDawnQualityTarget(puzzle.difficulty)) flags.push('strong-dawn');
  if ((puzzle.playProfile?.reservePressure ?? getReservePressure(puzzle)) !== 'none') flags.push('reserve-pressure');
  return flags;
}

function makePlayProfile(puzzle: DawnCabinetPuzzle): DawnCabinetPlayProfile {
  const macroFamily = puzzle.macroFamily ?? (puzzle.difficulty === 'Easy' ? 'easyPractice' : getMacroFamily(puzzle.difficulty, 0));
  const exposureProfile = puzzle.exposureProfile ?? 'friendlyStart';
  const visibleRailTypeMix = summarizeCounts(
    puzzle.lines
      .filter((line) => line.goal !== 'hidden')
      .map((line) => line.goal)
  );
  const hiddenLedgerMix = summarizeLedger(puzzle.ledger);
  const motifProfile = summarizeCounts(puzzle.motifs);
  const openingClueStyle = getOpeningClueStyle(puzzle, exposureProfile);
  const dawnPressure = getDawnPressure(puzzle);
  const reservePressure = getReservePressure(puzzle);
  const solvePosture = getSolvePosture(puzzle, exposureProfile, dawnPressure, reservePressure);
  const silhouetteClass = getSilhouetteClass(puzzle, macroFamily);
  const blanks = puzzle.cells.length - Object.keys(puzzle.givens).length;
  const hidden = puzzle.lines.filter((line) => line.goal === 'hidden').length;
  const visibleKinds = new Set(puzzle.lines.filter((line) => line.goal !== 'hidden').map((line) => line.goal)).size;
  const countProfile = `${blanks}b/${puzzle.lines.length}r/${hidden}h/${puzzle.spareCount}s/${visibleKinds}v`;
  const key = [
    macroFamily,
    exposureProfile,
    solvePosture,
    openingClueStyle,
    dawnPressure,
    reservePressure,
    silhouetteClass,
    countProfile,
    visibleRailTypeMix,
    hiddenLedgerMix,
  ].join('|');

  return {
    key,
    macroFamily,
    exposureProfile,
    motifProfile,
    visibleRailTypeMix,
    hiddenLedgerMix,
    openingClueStyle,
    dawnPressure,
    reservePressure,
    solvePosture,
    silhouetteClass,
    countProfile,
  };
}

function summarizeCounts(values: string[]): string {
  const counts = values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
  return Object.entries(counts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, count]) => `${value}:${count}`)
    .join('.') || 'none';
}

function summarizeLedger(ledger?: DawnCabinetLedger): string {
  return Object.entries(ledger ?? {})
    .filter(([, count]) => (count ?? 0) > 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([kind, count]) => `${kind}:${count}`)
    .join('.') || 'none';
}

function getOpeningClueStyle(
  puzzle: DawnCabinetPuzzle,
  exposureProfile: DawnCabinetExposureProfile
): DawnCabinetOpeningClueStyle {
  if (exposureProfile === 'dawnFork' && puzzle.dawnTile) return 'dawnFork';
  if (exposureProfile === 'reserveFirst' && puzzle.spareCount > 1) return 'reserveFirst';
  if (exposureProfile === 'copyPressure' && ((puzzle.ledger?.match ?? 0) + visibleLineCount(puzzle, 'match')) >= 2) {
    return 'copyPressure';
  }
  if (exposureProfile === 'bridgeRead' && hasBridgeKind(puzzle)) return 'bridgeRead';
  if (exposureProfile === 'ledgerFirst' || (puzzle.ledger && Object.keys(puzzle.ledger).length >= 4)) return 'ledgerFirst';
  return 'friendlyStart';
}

function getDawnPressure(puzzle: DawnCabinetPuzzle): DawnCabinetDawnPressure {
  if (!puzzle.dawnTile) return 'none';
  const touchCount = getDawnRailTouchCount(puzzle);
  const hiddenTouchCount = getDawnHiddenRailTouchCount(puzzle);
  if (touchCount >= 4 && hiddenTouchCount >= 2) return 'crossroad';
  if (touchCount >= 3 && hiddenTouchCount >= 1) return 'hinge';
  if (touchCount >= 3) return 'fork';
  return 'gentle';
}

function getReservePressure(puzzle: DawnCabinetPuzzle): DawnCabinetReservePressure {
  if (puzzle.spareCount === 0) return 'none';
  if (puzzle.bankGoal) return puzzle.spareCount >= 3 ? 'setGoal' : 'strict';
  if (puzzle.spareCount >= 3) return 'wideReserve';
  return 'light';
}

function getSolvePosture(
  puzzle: DawnCabinetPuzzle,
  exposureProfile: DawnCabinetExposureProfile,
  dawnPressure: DawnCabinetDawnPressure,
  reservePressure: DawnCabinetReservePressure
): DawnCabinetSolvePosture {
  if (exposureProfile === 'dawnFork' || dawnPressure === 'hinge' || dawnPressure === 'crossroad') return 'dawnPivot';
  if (exposureProfile === 'reserveFirst' || reservePressure === 'strict' || reservePressure === 'setGoal') return 'reserveAccounting';
  if (exposureProfile === 'copyPressure' || ((puzzle.ledger?.match ?? 0) + visibleLineCount(puzzle, 'match')) >= 3) return 'copyCounting';
  if (exposureProfile === 'bridgeRead' || hasBridgeKind(puzzle)) return 'bridgeMapping';
  if (exposureProfile === 'ledgerFirst' || Object.keys(puzzle.ledger ?? {}).length >= 4) return 'ledgerCounting';
  return 'lineReading';
}

function getSilhouetteClass(
  puzzle: DawnCabinetPuzzle,
  macroFamily: DawnCabinetMacroFamily
): DawnCabinetSilhouetteClass {
  if (macroFamily === 'shortBasin' || macroFamily === 'doubleBasin') return 'basin';
  if (macroFamily === 'brokenSpine') return 'spine';
  if (macroFamily === 'ringCabinet' || macroFamily === 'lanternWeb') return 'web';
  if (macroFamily === 'splitHinge' || macroFamily === 'fiveDistrict') return 'split';
  if (puzzle.rows >= 16) return 'spine';
  if (puzzle.rows >= 10) return 'stepped';
  return 'compact';
}

function visibleLineCount(puzzle: DawnCabinetPuzzle, kind: DawnCabinetSetKind): number {
  return puzzle.lines.filter((line) => line.goal === kind).length;
}

function hasBridgeKind(puzzle: DawnCabinetPuzzle): boolean {
  return puzzle.lines.some((line) => ['mixedRun', 'gapRun', 'mixedGap', 'number'].includes(line.goal));
}

function isBoardConnected(puzzle: DawnCabinetPuzzle): boolean {
  if (puzzle.cells.length <= 1) return true;
  const allCells = new Set(puzzle.cells.map((cell) => cellKey(cell.row, cell.col)));
  const adjacency = new Map<string, Set<string>>();
  allCells.forEach((cell) => adjacency.set(cell, new Set()));
  puzzle.lines.forEach((line) => {
    line.cells.forEach((cell) => {
      line.cells.forEach((other) => {
        if (cell !== other && allCells.has(cell) && allCells.has(other)) {
          adjacency.get(cell)?.add(other);
        }
      });
    });
  });
  const [start] = allCells;
  const stack = [start];
  const seen = new Set<string>();
  while (stack.length > 0) {
    const cell = stack.pop();
    if (!cell || seen.has(cell)) continue;
    seen.add(cell);
    adjacency.get(cell)?.forEach((next) => {
      if (!seen.has(next)) stack.push(next);
    });
  }
  return seen.size === allCells.size;
}

function makeLedgerForLines(
  lines: DawnCabinetLine[],
  solution: Record<string, DawnCabinetTile>
): DawnCabinetLedger | undefined {
  const ledger: Record<DawnCabinetSetKind, number> = {
    run: 0,
    mixedRun: 0,
    gapRun: 0,
    mixedGap: 0,
    match: 0,
    pair: 0,
    flush: 0,
    number: 0,
  };
  lines.forEach((line) => {
    if (line.goal !== 'hidden') return;
    const kind = classifyCabinetLine(line.cells.map((cell) => solution[cell]));
    if (!kind || kind === 'pair') {
      throw new Error(`Hidden rail ${line.id} does not resolve to a 3-tile set`);
    }
    ledger[kind] += 1;
  });

  const compact = Object.fromEntries(
    SET_KINDS
      .filter((kind) => ledger[kind] > 0)
      .map((kind) => [kind, ledger[kind]])
  ) as DawnCabinetLedger;
  return Object.keys(compact).length > 0 ? compact : undefined;
}

function makeShapeSignature(cells: DawnCabinetCell[], lines: DawnCabinetLine[]): string {
  if (cells.length === 0) return 'empty';
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const active = cells
    .map((cell) => `${cell.row - minRow}:${cell.col - minCol}`)
    .sort()
    .join('.');
  const rails = lines
    .map((line) => {
      const railCells = line.cells
        .map((cell) => {
          const [row, col] = cell.split(':').map(Number);
          return `${row - minRow}:${col - minCol}`;
        })
        .join('-');
      return `${line.goal}:${railCells}`;
    })
    .sort()
    .join('.');
  return `${active}|${rails}`;
}

function makeCompositeSignature(puzzle: {
  cells: DawnCabinetCell[];
  lines: DawnCabinetLine[];
  solution: Record<string, DawnCabinetTile>;
  motifs: string[];
  spareCount: number;
  bankGoal?: DawnCabinetBankGoal;
  dawnTile?: DawnCabinetDawnTile;
  macroFamily?: DawnCabinetMacroFamily;
  exposureProfile?: DawnCabinetExposureProfile;
  playProfile?: DawnCabinetPlayProfile;
}): string {
  const shape = makeShapeSignature(puzzle.cells, puzzle.lines);
  const visibleGoals = puzzle.lines
    .filter((line) => line.goal !== 'hidden')
    .map((line) => line.goal)
    .sort()
    .join('.');
  const hiddenKinds = makeLedgerForLines(puzzle.lines, puzzle.solution);
  const motifProfile = [...puzzle.motifs].sort().join('.');
  const reserveProfile = puzzle.bankGoal ? `${puzzle.spareCount}:${puzzle.bankGoal.type}` : `${puzzle.spareCount}:any`;
  const dawnProfile = puzzle.dawnTile
    ? `${puzzle.dawnTile.options.length}:${getNormalizedCellKey(puzzle.cells, puzzle.dawnTile.solutionCell)}:${puzzle.dawnTile.options.map(tileKey).sort().join('.')}`
    : 'none';
  return [
    shape,
    `visible=${visibleGoals}`,
    `hidden=${puzzle.lines.filter((line) => line.goal === 'hidden').length}`,
    `ledger=${Object.entries(hiddenKinds ?? {}).sort().map(([kind, count]) => `${kind}:${count}`).join('.')}`,
    `motifs=${motifProfile}`,
    `macro=${puzzle.macroFamily ?? 'none'}`,
    `exposure=${puzzle.exposureProfile ?? 'none'}`,
    `posture=${puzzle.playProfile?.key ?? 'none'}`,
    `reserve=${reserveProfile}`,
    `dawn=${dawnProfile}`,
  ].join('|');
}

function getNormalizedCellKey(cells: DawnCabinetCell[], cell: string): string {
  const minRow = Math.min(...cells.map((item) => item.row));
  const minCol = Math.min(...cells.map((item) => item.col));
  const [row, col] = cell.split(':').map(Number);
  return `${row - minRow}:${col - minCol}`;
}

function createDraft(): PuzzleDraft {
  return { solution: {}, lines: [], givens: [], cellClues: {} };
}

function getDraftMaxRow(draft: PuzzleDraft): number {
  return Object.keys(draft.solution).reduce((max, cell) => {
    return Math.max(max, Number(cell.split(':')[0]));
  }, -1);
}

function place(
  draft: PuzzleDraft,
  cell: string,
  tile: DawnCabinetTile,
  given = false
) {
  const existing = draft.solution[cell];
  if (existing && tileKey(existing) !== tileKey(tile)) {
    throw new Error(`Dawn Cabinet cell ${cell} already has ${tileKey(existing)}, cannot place ${tileKey(tile)}`);
  }
  draft.solution[cell] = tile;
  if (given && !draft.givens.includes(cell)) draft.givens.push(cell);
}

function addLine(
  draft: PuzzleDraft,
  id: string,
  cells: string[],
  goal: DawnCabinetLineGoal
) {
  draft.lines.push({ id, cells, goal });
}

function addCellClue(draft: PuzzleDraft, cell: string, clue: DawnCabinetCellClue) {
  draft.cellClues[cell] = clue;
}

function setLineGoal(draft: PuzzleDraft, id: string, goal: DawnCabinetLineGoal) {
  draft.lines = draft.lines.map((line) => (line.id === id ? { ...line, goal } : line));
}

function applyMacroFamilyVariation(
  draft: PuzzleDraft,
  difficulty: DawnCabinetDifficulty,
  macroFamily: DawnCabinetMacroFamily,
  variant: number,
  motifs: string[]
) {
  if (difficulty === 'Easy') return;

  const addConnectors = (
    idPrefix: string,
    desiredKinds: DawnCabinetSetKind[],
    count: number,
    seedOffset = 0
  ) => {
    for (let index = 0; index < count; index += 1) {
      const added = addGeneratedConnectorRail(draft, {
        id: `${idPrefix}-${index}`,
        desiredKinds,
        difficulty,
        variant: variant + seedOffset + index * 37,
      });
      if (added) motifs.push(`${idPrefix}-rail`);
    }
  };

  switch (macroFamily) {
    case 'splitHinge':
      addConnectors('split-hinge', ['run', 'mixedRun', 'flush'], 1);
      break;
    case 'cornerExchange':
      addConnectors('corner-exchange', ['match', 'flush', 'mixedRun'], 1, 11);
      break;
    case 'threePocket':
      addConnectors('three-pocket', ['run', 'match', 'flush'], 1, 23);
      break;
    case 'shortBasin':
      addConnectors('short-basin', ['flush', 'mixedRun', 'run'], 1, 31);
      break;
    case 'braidedReservoir':
      addConnectors('braided-reservoir', ['number', 'mixedRun', 'flush', 'gapRun'], 2);
      break;
    case 'mirrorTrap':
      addConnectors('mirror-trap', ['match', 'number', 'flush', 'gapRun'], 2, 17);
      break;
    case 'offsetBridge':
      addConnectors('offset-bridge', ['mixedRun', 'number', 'gapRun', 'run'], 2, 29);
      break;
    case 'reserveFork':
      addConnectors('reserve-fork', ['flush', 'number', 'match', 'mixedRun'], 1, 41);
      break;
    case 'ringCabinet':
      addConnectors('ring-cabinet', ['mixedGap', 'number', 'mixedRun', 'gapRun'], 3);
      break;
    case 'fiveDistrict':
      addConnectors('five-district', ['number', 'mixedRun', 'mixedGap', 'flush'], 2, 19);
      break;
    case 'doubleBasin':
      addConnectors('double-basin', ['flush', 'gapRun', 'number', 'mixedGap'], 3, 43);
      break;
    case 'brokenSpine':
      addConnectors('broken-spine', ['gapRun', 'mixedGap', 'mixedRun', 'number'], 2, 53);
      break;
    case 'lanternWeb':
      addConnectors('lantern-web', ['mixedGap', 'number', 'gapRun', 'mixedRun'], 3, 61);
      break;
    case 'easyPractice':
      break;
  }
}

function addGeneratedConnectorRail(
  draft: PuzzleDraft,
  config: {
    id: string;
    desiredKinds: DawnCabinetSetKind[];
    difficulty: DawnCabinetDifficulty;
    variant: number;
  }
): boolean {
  const allCells = Object.keys(draft.solution).sort(compareCellKeys);
  const existingSets = new Set(
    draft.lines.map((line) => normalizeRailCellSet(line.cells))
  );
  const lineCounts = draft.lines.reduce<Record<string, number>>((counts, line) => {
    line.cells.forEach((cell) => {
      counts[cell] = (counts[cell] ?? 0) + 1;
    });
    return counts;
  }, {});
  const cellLimit = config.difficulty === 'Expert' ? 12 : config.difficulty === 'Hard' ? 11 : 10;
  const cells = allCells
    .map((cell) => ({
      cell,
      score: (lineCounts[cell] ?? 0) * 10,
      hash: stableSeed(`${config.id}:${config.variant}:${cell}`),
    }))
    .sort((left, right) =>
      right.score - left.score ||
      (left.hash < right.hash ? -1 : left.hash > right.hash ? 1 : compareCellKeys(left.cell, right.cell))
    )
    .slice(0, cellLimit)
    .map((item) => item.cell)
    .sort(compareCellKeys);
  const maxRowSpan = config.difficulty === 'Expert' ? 9 : config.difficulty === 'Hard' ? 7 : 5;
  const candidates: Array<{
    cells: string[];
    kind: DawnCabinetSetKind;
    score: number;
    hash: bigint;
  }> = [];

  for (let a = 0; a < cells.length - 2; a += 1) {
    for (let b = a + 1; b < cells.length - 1; b += 1) {
      for (let c = b + 1; c < cells.length; c += 1) {
        const railCells = [cells[a], cells[b], cells[c]].sort(compareCellKeys);
        const railSet = normalizeRailCellSet(railCells);
        if (existingSets.has(railSet)) continue;

        const coords = railCells.map(parseCellKey);
        const rowSpan = Math.max(...coords.map((cell) => cell.row)) - Math.min(...coords.map((cell) => cell.row));
        const colSpan = Math.max(...coords.map((cell) => cell.col)) - Math.min(...coords.map((cell) => cell.col));
        if (rowSpan > maxRowSpan || colSpan > 6) continue;
        if (rowSpan === 0 && colSpan <= 2) continue;
        if (colSpan === 0 && rowSpan <= 2) continue;

        const kind = classifyCabinetLine(railCells.map((cell) => draft.solution[cell]));
        if (!kind || kind === 'pair' || !config.desiredKinds.includes(kind)) continue;

        const overlapScore = railCells.reduce((sum, cell) => sum + Math.min(3, lineCounts[cell] ?? 0), 0);
        const spreadScore = rowSpan + colSpan + new Set(coords.map((cell) => cell.row)).size + new Set(coords.map((cell) => cell.col)).size;
        const hash = stableSeed(`${config.id}:${config.variant}:${railSet}:${kind}`);
        candidates.push({
          cells: railCells,
          kind,
          score: overlapScore * 4 + spreadScore * 2 + config.desiredKinds.indexOf(kind),
          hash,
        });
      }
    }
  }

  const selected = candidates.sort((left, right) =>
    right.score - left.score ||
    (left.hash < right.hash ? -1 : left.hash > right.hash ? 1 : 0)
  )[Math.abs(config.variant) % Math.max(1, Math.min(7, candidates.length))];
  if (!selected) return false;

  addLine(draft, config.id, selected.cells, 'hidden');
  return true;
}

function normalizeRailCellSet(cells: string[]): string {
  return [...cells].sort(compareCellKeys).join('/');
}

function compareCellKeys(left: string, right: string): number {
  const a = parseCellKey(left);
  const b = parseCellKey(right);
  return a.row - b.row || a.col - b.col;
}

function parseCellKey(cell: string): DawnCabinetCell {
  const [row, col] = cell.split(':').map(Number);
  return { row, col };
}

function applyRailExposureProfile(
  draft: PuzzleDraft,
  difficulty: DawnCabinetDifficulty,
  variant: number,
  exposureProfile: DawnCabinetExposureProfile = 'friendlyStart'
) {
  if (difficulty === 'Easy') return;

  const targetKindCount = getVisibleKindTarget(difficulty, exposureProfile, variant);
  const maxReveals = difficulty === 'Standard' ? 3 : difficulty === 'Hard' ? 5 : 6;
  const priority = getExposurePriority(difficulty, exposureProfile);

  const visibleKinds = () =>
    new Set(draft.lines.filter((line) => line.goal !== 'hidden').map((line) => line.goal as DawnCabinetSetKind));
  const hiddenCandidates = draft.lines
    .map((line, index) => ({
      line,
      index,
      kind: line.goal === 'hidden'
        ? classifyCabinetLine(line.cells.map((cell) => draft.solution[cell]))
        : null,
    }))
    .filter((candidate): candidate is { line: DawnCabinetLine; index: number; kind: DawnCabinetSetKind } => {
      return Boolean(candidate.kind && candidate.kind !== 'pair');
    });
  const offset = hiddenCandidates.length ? Math.abs(variant) % hiddenCandidates.length : 0;
  const ordered = [...hiddenCandidates.slice(offset), ...hiddenCandidates.slice(0, offset)];
  let revealCount = 0;

  priority.forEach((kind) => {
    if (revealCount >= maxReveals) return;
    if (visibleKinds().size >= targetKindCount && Math.abs(variant + revealCount) % 3 !== 0) return;
    if (visibleKinds().has(kind) && Math.abs(variant + revealCount) % 5 !== 0) return;

    const candidate = ordered.find((item) => item.kind === kind && draft.lines[item.index].goal === 'hidden');
    if (!candidate) return;
    draft.lines[candidate.index] = { ...candidate.line, goal: kind };
    revealCount += 1;
  });
}

function getVisibleKindTarget(
  difficulty: DawnCabinetDifficulty,
  exposureProfile: DawnCabinetExposureProfile,
  variant: number
): number {
  if (difficulty === 'Standard') {
    return exposureProfile === 'friendlyStart' || exposureProfile === 'copyPressure'
      ? 2
      : 2 + (Math.abs(variant) % 2);
  }
  if (difficulty === 'Hard') {
    return 3 + (['bridgeRead', 'dawnFork'].includes(exposureProfile) ? 1 : Math.abs(variant) % 2);
  }
  return 4 + (['bridgeRead', 'dawnFork'].includes(exposureProfile) ? 1 : Math.abs(variant) % 3 === 0 ? 2 : 0);
}

function getExposurePriority(
  difficulty: DawnCabinetDifficulty,
  exposureProfile: DawnCabinetExposureProfile
): DawnCabinetSetKind[] {
  const standard: Record<DawnCabinetExposureProfile, DawnCabinetSetKind[]> = {
    friendlyStart: ['run', 'match', 'flush', 'mixedRun'],
    ledgerFirst: ['flush', 'mixedRun', 'run', 'match'],
    reserveFirst: ['match', 'flush', 'run', 'mixedRun'],
    dawnFork: ['mixedRun', 'run', 'flush', 'match'],
    copyPressure: ['match', 'run', 'flush', 'mixedRun'],
    bridgeRead: ['mixedRun', 'flush', 'run', 'match'],
  };
  const hard: Record<DawnCabinetExposureProfile, DawnCabinetSetKind[]> = {
    friendlyStart: ['run', 'mixedRun', 'flush', 'number', 'gapRun', 'match'],
    ledgerFirst: ['number', 'gapRun', 'flush', 'mixedRun', 'match', 'run'],
    reserveFirst: ['flush', 'number', 'match', 'gapRun', 'mixedRun', 'run'],
    dawnFork: ['mixedRun', 'number', 'gapRun', 'run', 'flush', 'match'],
    copyPressure: ['match', 'number', 'run', 'flush', 'mixedRun', 'gapRun'],
    bridgeRead: ['number', 'mixedRun', 'gapRun', 'flush', 'match', 'run'],
  };
  const expert: Record<DawnCabinetExposureProfile, DawnCabinetSetKind[]> = {
    friendlyStart: ['run', 'mixedRun', 'flush', 'number', 'gapRun', 'mixedGap', 'match'],
    ledgerFirst: ['mixedGap', 'number', 'gapRun', 'mixedRun', 'flush', 'match', 'run'],
    reserveFirst: ['number', 'flush', 'mixedGap', 'gapRun', 'match', 'mixedRun', 'run'],
    dawnFork: ['mixedGap', 'mixedRun', 'number', 'gapRun', 'flush', 'run', 'match'],
    copyPressure: ['match', 'number', 'mixedGap', 'gapRun', 'flush', 'mixedRun', 'run'],
    bridgeRead: ['mixedGap', 'number', 'gapRun', 'mixedRun', 'flush', 'match', 'run'],
  };
  return difficulty === 'Standard' ? standard[exposureProfile] : difficulty === 'Hard' ? hard[exposureProfile] : expert[exposureProfile];
}

function pickSuits(seed: bigint, count: number): DawnCabinetSuit[] {
  const start = Number(seed % BigInt(SUITS.length));
  return Array.from({ length: count }, (_, index) => SUITS[(start + index) % SUITS.length]);
}

function stableSeed(value: string): bigint {
  let hash = 14695981039346656037n;
  for (const char of value) {
    hash ^= BigInt(char.charCodeAt(0));
    hash = BigInt.asUintN(64, hash * 1099511628211n);
  }
  return hash;
}

function getUtcDayIndex(date: string): number {
  const time = Date.parse(`${date}T00:00:00.000Z`);
  if (Number.isNaN(time)) return Number.NaN;
  return Math.floor(time / 86_400_000);
}

function utcDateFromDayIndex(dayIndex: number): string {
  return new Date(dayIndex * 86_400_000).toISOString().slice(0, 10);
}

function countTiles(tiles: DawnCabinetTile[]): Record<string, number> {
  return tiles.reduce<Record<string, number>>((counts, tile) => {
    const key = tileKey(tile);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function parseTileKey(key: string): DawnCabinetTile {
  const [suit, rank] = key.split(':');
  return { suit: suit as DawnCabinetSuit, rank: Number(rank) };
}

function compareTiles(left: DawnCabinetTile, right: DawnCabinetTile): number {
  const suitDelta = SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit);
  return suitDelta || left.rank - right.rank;
}

function getLinesByCell(puzzle: DawnCabinetPuzzle): Record<string, DawnCabinetLine[]> {
  return puzzle.lines.reduce<Record<string, DawnCabinetLine[]>>((map, line) => {
    line.cells.forEach((cell) => {
      map[cell] = [...(map[cell] ?? []), line];
    });
    return map;
  }, {});
}

function canCompleteLine(assigned: DawnCabinetTile[], goal: DawnCabinetLineGoal): boolean {
  if (assigned.length === 0) return true;
  if (assigned.length > 3) return false;
  if (goal === 'hidden') {
    return THREE_TILE_SET_KINDS.some((kind) => canCompleteLine(assigned, kind));
  }
  if (goal === 'pair') {
    return assigned.length <= 2 && assigned.every((tile) => tileKey(tile) === tileKey(assigned[0]));
  }
  if (goal === 'match') {
    return assigned.every((tile) => tileKey(tile) === tileKey(assigned[0]));
  }
  if (goal === 'run') {
    return canCompleteRankWindow(assigned, 1) && assigned.every((tile) => tile.suit === assigned[0].suit);
  }
  if (goal === 'mixedRun') {
    return canCompleteRankWindow(assigned, 1) && new Set(assigned.map((tile) => tile.suit)).size === assigned.length;
  }
  if (goal === 'gapRun') {
    return canCompleteRankWindow(assigned, 2) && assigned.every((tile) => tile.suit === assigned[0].suit);
  }
  if (goal === 'mixedGap') {
    return canCompleteRankWindow(assigned, 2) && new Set(assigned.map((tile) => tile.suit)).size === assigned.length;
  }
  if (goal === 'flush') {
    return assigned.every((tile) => tile.suit === assigned[0].suit);
  }
  return (
    assigned.every((tile) => tile.rank === assigned[0].rank) &&
    new Set(assigned.map((tile) => tile.suit)).size === assigned.length
  );
}

function canCompleteRankWindow(assigned: DawnCabinetTile[], step: 1 | 2): boolean {
  const ranks = assigned.map((tile) => tile.rank);
  if (new Set(ranks).size !== ranks.length) return false;
  const min = Math.min(...ranks);
  const max = Math.max(...ranks);
  if (max - min > step * 2) return false;
  const firstPossibleStart = Math.max(1, max - step * 2);
  const lastPossibleStart = Math.min(min, 9 - step * 2);
  for (let start = firstPossibleStart; start <= lastPossibleStart; start += 1) {
    if (ranks.every((rank) => (rank - start) % step === 0 && rank >= start && rank <= start + step * 2)) {
      return true;
    }
  }
  return false;
}
