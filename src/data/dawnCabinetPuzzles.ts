import { getUtcDateKey } from '../utils/dailyUtc';

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
  | 'suns';
export type DawnCabinetDifficulty = 'Easy' | 'Standard' | 'Hard' | 'Expert';
export type DawnCabinetDailyDifficulty = Exclude<DawnCabinetDifficulty, 'Easy'>;
export type DawnCabinetLineState = 'incomplete' | 'valid' | 'invalid';
export type DawnCabinetSetKind = 'run' | 'match' | 'pair' | 'flush' | 'number';
export type DawnCabinetLineGoal = DawnCabinetSetKind | 'hidden';

export interface DawnCabinetTile {
  suit: DawnCabinetSuit;
  rank: number;
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
  setKindCount: number;
  reserveCount: number;
  overlapDensity: number;
  branchCount: number;
  score: number;
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
  spareCount: number;
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
};
const SET_KINDS: DawnCabinetSetKind[] = ['run', 'match', 'pair', 'flush', 'number'];
const THREE_TILE_SET_KINDS: DawnCabinetSetKind[] = ['run', 'match', 'flush', 'number'];
const VALID_LINE_CACHE: Partial<Record<DawnCabinetLineGoal, DawnCabinetTile[][]>> = {};
export const DAWN_CABINET_DAILY_DIFFICULTIES: DawnCabinetDailyDifficulty[] = [
  'Standard',
  'Hard',
  'Expert',
];

export function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export function tileKey(tile: DawnCabinetTile): string {
  return `${tile.suit}:${tile.rank}`;
}

export function tileLabel(tile: DawnCabinetTile): string {
  return `${tile.rank} ${SUIT_LABELS[tile.suit]}`;
}

export function suitShortLabel(suit: DawnCabinetSuit): string {
  return SUIT_SHORT_LABELS[suit];
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
  if (goal === 'match') return 'Match';
  if (goal === 'pair') return 'Pair';
  if (goal === 'flush') return 'Flush';
  if (goal === 'number') return 'Number Set';
  return 'Hidden';
}

export function lineGoalShortLabel(goal: DawnCabinetLineGoal): string {
  if (goal === 'run') return 'R';
  if (goal === 'match') return 'M';
  if (goal === 'pair') return 'P';
  if (goal === 'flush') return 'F';
  if (goal === 'number') return 'N';
  return '?';
}

export function setKindPluralLabel(kind: DawnCabinetSetKind): string {
  if (kind === 'run') return 'Runs';
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
  if (sameSuit && ranks[0] + 1 === ranks[1] && ranks[1] + 1 === ranks[2]) return 'run';
  if (sameSuit) return 'flush';

  const sameRank = tiles.every((tile) => tile.rank === tiles[0].rank);
  const distinctSuits = new Set(tiles.map((tile) => tile.suit)).size === tiles.length;
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
        counts: { run: 0, match: 0, pair: 0, flush: 0, number: 0 },
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
  const score =
    blanks * 10 +
    hiddenRails * 7 +
    puzzle.lines.length * 3 +
    setKindCount * 12 +
    puzzle.spareCount * 14 +
    overlapDensity * 20 +
    branchCount * 2;

  return {
    blanks,
    hiddenRails,
    lineCount: puzzle.lines.length,
    setKindCount,
    reserveCount: puzzle.spareCount,
    overlapDensity,
    branchCount,
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

function estimateBranchCount(puzzle: DawnCabinetPuzzle): number {
  const linesByCell = getLinesByCell(puzzle);
  const remaining = countTiles(puzzle.bank);
  const placements: Record<string, DawnCabinetTile> = { ...puzzle.givens };
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
      return sum + Math.max(options - 1, 0);
    }, 0);
}

export function getDailyDawnCabinet(
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

function getDawnCabinetByDifficulty(
  date: string,
  difficulty: DawnCabinetDifficulty,
  seed: bigint
): DawnCabinetPuzzle {
  const candidates = makeCandidates(date, difficulty, seed);
  const offset = Number(seed % BigInt(candidates.length));
  return candidates[offset];
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
  let count = 0;

  const affectedLinesCanResolve = (cell: string): boolean => {
    if (!tileMatchesCellClue(placements[cell], puzzle.cellClues[cell])) return false;
    return (linesByCell[cell] ?? []).every((line) => {
      const assigned = line.cells.map((lineCell) => placements[lineCell]).filter(Boolean);
      if (assigned.length === line.cells.length) return isValidCabinetLine(assigned, line.goal);
      return canCompleteLine(assigned, line.goal);
    }) && isLedgerPossible(puzzle, placements);
  };

  const candidatesFor = (cell: string): DawnCabinetTile[] => {
    return Object.entries(remaining)
      .filter(([, amount]) => amount > 0)
      .map(([key]) => parseTileKey(key))
      .filter((tile) => {
        placements[cell] = tile;
        const canResolve = affectedLinesCanResolve(cell);
        delete placements[cell];
        return canResolve;
      })
      .sort(compareTiles);
  };

  const search = () => {
    if (count >= limit) return;
    const openCell = blanks
      .filter((key) => !placements[key])
      .sort((left, right) => candidatesFor(left).length - candidatesFor(right).length)[0];

    if (!openCell) {
      const remainingTiles = Object.values(remaining).reduce((sum, value) => sum + value, 0);
      if (remainingTiles === puzzle.spareCount && isCabinetSolved(puzzle, placements)) count += 1;
      return;
    }

    candidatesFor(openCell).forEach((tile) => {
      const key = tileKey(tile);
      if (!remaining[key]) return;
      placements[openCell] = tile;
      remaining[key] -= 1;
      if (affectedLinesCanResolve(openCell)) search();
      remaining[key] += 1;
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
  const twoSuits = pickSuits(seed, 2);
  const threeSuits = pickSuits(seed, 3);
  const fourSuits = pickSuits(seed, 4);
  const fiveSuits = pickSuits(seed, 5);
  const baseRank = 1 + Number((seed >> 5n) % 3n);

  switch (difficulty) {
    case 'Easy':
      return [
        makeEasyPuzzle({
          id: `dawn-cabinet-${date}-easy-a`,
          date,
          difficulty,
          suits: twoSuits,
          baseRank,
        }),
      ];
    case 'Standard':
      return [
        makeStandardPuzzle({
          id: `dawn-cabinet-${date}-standard-a`,
          date,
          difficulty,
          suits: threeSuits,
          baseRank,
        }),
      ];
    case 'Hard':
      return [
        makeHardPuzzle({
          id: `dawn-cabinet-${date}-hard-a`,
          date,
          difficulty,
          suits: fourSuits,
          baseRank,
        }),
      ];
    case 'Expert':
      return [
        makeExpertPuzzle({
          id: `dawn-cabinet-${date}-expert-a`,
          date,
          difficulty,
          suits: fiveSuits,
          baseRank,
        }),
      ];
  }
}

function makeEasyPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
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
    ...draft,
  });
}

function makeStandardPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
}): DawnCabinetPuzzle {
  const [a, b, c] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();

  addWeaveCluster(draft, {
    idPrefix: 'standard-left',
    suit: a,
    baseRank: r,
    originRow: 0,
    originCol: 0,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottom', 'bottomRight'],
  });
  addLine(draft, 'standard-left-pair', ['0:0', '2:0'], 'pair');

  addWeaveCluster(draft, {
    idPrefix: 'standard-right',
    suit: b,
    baseRank: r,
    originRow: 0,
    originCol: 4,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottom', 'bottomRight'],
  });
  addLine(draft, 'standard-right-pair', ['0:6', '2:6'], 'pair');

  place(draft, '5:0', { suit: c, rank: r }, true);
  place(draft, '5:1', { suit: c, rank: r + 3 });
  place(draft, '5:2', { suit: c, rank: r + 6 }, true);
  place(draft, '6:1', { suit: c, rank: r + 3 }, true);
  addLine(draft, 'standard-low-flush', ['5:0', '5:1', '5:2'], 'hidden');
  addLine(draft, 'standard-low-flush-anchor', ['5:1', '6:1'], 'pair');

  place(draft, '5:4', { suit: c, rank: r + 1 }, true);
  place(draft, '5:5', { suit: c, rank: r + 4 });
  place(draft, '5:6', { suit: c, rank: r + 6 }, true);
  place(draft, '6:5', { suit: c, rank: r + 4 }, true);
  addLine(draft, 'standard-high-flush', ['5:4', '5:5', '5:6'], 'hidden');
  addLine(draft, 'standard-high-flush-anchor', ['5:5', '6:5'], 'pair');

  return makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: 7,
    columns: 7,
    spares: [{ suit: a, rank: r + 6 }],
    ledger: { run: 6, match: 4, flush: 2 },
    ...draft,
  });
}

function makeHardPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
}): DawnCabinetPuzzle {
  const [a, b, c, d] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();

  addWeaveCluster(draft, {
    idPrefix: 'hard-left',
    suit: a,
    baseRank: r,
    originRow: 0,
    originCol: 0,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'hard-left-pair-a', ['0:0', '2:0'], 'pair');
  addLine(draft, 'hard-left-pair-b', ['0:2', '2:2'], 'pair');

  addWeaveCluster(draft, {
    idPrefix: 'hard-right',
    suit: b,
    baseRank: r,
    originRow: 0,
    originCol: 4,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'hard-right-pair-a', ['0:4', '2:4'], 'pair');
  addLine(draft, 'hard-right-pair-b', ['0:6', '2:6'], 'pair');

  place(draft, '5:0', { suit: c, rank: r });
  place(draft, '5:1', { suit: d, rank: r + 2 });
  place(draft, '5:2', { suit: c, rank: r + 1 });
  place(draft, '5:3', { suit: c, rank: r + 5 }, true);
  place(draft, '5:4', { suit: d, rank: r + 4 });
  place(draft, '5:5', { suit: d, rank: r + 6 }, true);
  place(draft, '6:0', { suit: c, rank: r + 3 });
  place(draft, '6:1', { suit: c, rank: r + 6 }, true);
  place(draft, '6:2', { suit: c, rank: r + 3 }, true);
  place(draft, '6:4', { suit: d, rank: r + 4 }, true);
  addLine(draft, 'hard-number-low', ['0:0', '0:4', '5:0'], 'hidden');
  addLine(draft, 'hard-number-mid', ['2:1', '2:5', '5:2'], 'hidden');
  addLine(draft, 'hard-number-high', ['0:2', '0:6', '5:1'], 'hidden');
  addLine(draft, 'hard-flush-c-low', ['5:0', '5:2', '5:3'], 'hidden');
  addLine(draft, 'hard-flush-c-high', ['6:0', '5:3', '6:1'], 'hidden');
  addLine(draft, 'hard-flush-d', ['5:1', '5:4', '5:5'], 'hidden');
  addLine(draft, 'hard-flush-c-anchor', ['6:0', '6:2'], 'pair');
  addLine(draft, 'hard-flush-d-anchor', ['5:4', '6:4'], 'pair');

  const bankGoalType = getExpertBankGoal(config.id, r, a);

  return makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: 7,
    columns: 7,
    spares: makeBankGoalTiles(bankGoalType, [a, b, c, d], r),
    ledger: { run: 6, match: 4, flush: 3, number: 3 },
    bankGoal: { type: bankGoalType },
    ...draft,
  });
}

function makeExpertPuzzle(config: {
  id: string;
  date: string;
  difficulty: DawnCabinetDifficulty;
  suits: DawnCabinetSuit[];
  baseRank: number;
}): DawnCabinetPuzzle {
  const [a, b, c, d, e] = config.suits;
  const r = config.baseRank;
  const draft = createDraft();

  addWeaveCluster(draft, {
    idPrefix: 'expert-left',
    suit: a,
    baseRank: r,
    originRow: 0,
    originCol: 0,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'expert-left-pair-a', ['0:0', '2:0'], 'pair');
  addLine(draft, 'expert-left-pair-b', ['0:2', '2:2'], 'pair');

  addWeaveCluster(draft, {
    idPrefix: 'expert-right',
    suit: b,
    baseRank: r,
    originRow: 0,
    originCol: 4,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'expert-right-pair-a', ['0:4', '2:4'], 'pair');
  addLine(draft, 'expert-right-pair-b', ['0:6', '2:6'], 'pair');

  addWeaveCluster(draft, {
    idPrefix: 'expert-lower-left',
    suit: c,
    baseRank: r,
    originRow: 5,
    originCol: 0,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'expert-lower-left-pair-a', ['5:0', '7:0'], 'pair');
  addLine(draft, 'expert-lower-left-pair-b', ['5:2', '7:2'], 'pair');

  addWeaveCluster(draft, {
    idPrefix: 'expert-lower-right',
    suit: d,
    baseRank: r,
    originRow: 5,
    originCol: 4,
    givens: ['topLeft', 'topRight', 'mid', 'bottomLeft', 'bottomRight'],
  });
  addLine(draft, 'expert-lower-right-pair-a', ['5:4', '7:4'], 'pair');
  addLine(draft, 'expert-lower-right-pair-b', ['5:6', '7:6'], 'pair');

  place(draft, '10:0', { suit: e, rank: r });
  place(draft, '10:1', { suit: e, rank: r + 1 });
  place(draft, '10:2', { suit: e, rank: r + 2 });
  place(draft, '10:3', { suit: e, rank: r });
  place(draft, '10:4', { suit: e, rank: r + 5 }, true);
  place(draft, '10:5', { suit: e, rank: r + 6 });
  place(draft, '10:6', { suit: e, rank: r + 6 }, true);
  addLine(draft, 'expert-number-north-low', ['0:0', '0:4', '10:0'], 'hidden');
  addLine(draft, 'expert-number-north-mid', ['2:1', '2:5', '10:1'], 'hidden');
  addLine(draft, 'expert-number-north-high', ['0:2', '0:6', '10:2'], 'hidden');
  addLine(draft, 'expert-number-south-low', ['5:0', '5:4', '10:3'], 'hidden');
  addLine(draft, 'expert-fifth-suit-low-flush', ['10:0', '10:2', '10:4'], 'hidden');
  addLine(draft, 'expert-fifth-suit-high-flush', ['10:1', '10:3', '10:5'], 'hidden');
  addLine(draft, 'expert-fifth-suit-anchor', ['10:5', '10:6'], 'pair');

  const bankGoalType = getExpertBankGoal(config.id, r, a);

  return makePuzzle({
    id: config.id,
    date: config.date,
    title: 'Dawn Cabinet',
    difficulty: config.difficulty,
    rows: 11,
    columns: 7,
    spares: makeBankGoalTiles(bankGoalType, [a, b, c, d, e], r),
    ledger: { run: 12, match: 8, flush: 2, number: 4 },
    bankGoal: { type: bankGoalType },
    ...draft,
  });
}

function getExpertBankGoal(id: string, baseRank: number, firstSuit: DawnCabinetSuit): Exclude<DawnCabinetSetKind, 'pair'> {
  const goals: Exclude<DawnCabinetSetKind, 'pair'>[] = ['run', 'match', 'flush', 'number'];
  const offset = (id.length + baseRank + SUITS.indexOf(firstSuit)) % goals.length;
  return goals[offset];
}

function makeBankGoalTiles(
  goal: Exclude<DawnCabinetSetKind, 'pair'>,
  suits: DawnCabinetSuit[],
  baseRank: number
): DawnCabinetTile[] {
  const [a, b, c, d] = suits;
  if (goal === 'run') {
    return [
      { suit: a, rank: baseRank + 4 },
      { suit: a, rank: baseRank + 5 },
      { suit: a, rank: baseRank + 6 },
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
) {
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

  return {
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
    ledger: config.ledger,
    bankGoal: config.bankGoal,
    solution: config.solution,
    bank,
    spareCount: config.spares.length,
  };
}

function createDraft(): PuzzleDraft {
  return { solution: {}, lines: [], givens: [], cellClues: {} };
}

function place(
  draft: PuzzleDraft,
  cell: string,
  tile: DawnCabinetTile,
  given = false
) {
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
  return getAllValidLineMultisets(goal).some((valid) => isSubsetMultiset(assigned, valid));
}

function getAllValidLineMultisets(goal: DawnCabinetLineGoal): DawnCabinetTile[][] {
  const cached = VALID_LINE_CACHE[goal];
  if (cached) return cached;

  const valid: DawnCabinetTile[][] = [];
  if (goal === 'run' || goal === 'hidden') {
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 7; rank += 1) {
        valid.push([
          { suit, rank },
          { suit, rank: rank + 1 },
          { suit, rank: rank + 2 },
        ]);
      }
    });
  }

  if (goal === 'match' || goal === 'hidden') {
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 9; rank += 1) {
        valid.push([
          { suit, rank },
          { suit, rank },
          { suit, rank },
        ]);
      }
    });
  }

  if (goal === 'flush' || goal === 'hidden') {
    SUITS.forEach((suit) => {
      for (let first = 1; first <= 9; first += 1) {
        for (let second = first; second <= 9; second += 1) {
          for (let third = second; third <= 9; third += 1) {
            if (first === second && second === third) continue;
            if (first + 1 === second && second + 1 === third) continue;
            valid.push([
              { suit, rank: first },
              { suit, rank: second },
              { suit, rank: third },
            ]);
          }
        }
      }
    });
  }

  if (goal === 'number' || goal === 'hidden') {
    for (let rank = 1; rank <= 9; rank += 1) {
      for (let first = 0; first <= SUITS.length - 3; first += 1) {
        for (let second = first + 1; second <= SUITS.length - 2; second += 1) {
          for (let third = second + 1; third <= SUITS.length - 1; third += 1) {
            valid.push([
              { suit: SUITS[first], rank },
              { suit: SUITS[second], rank },
              { suit: SUITS[third], rank },
            ]);
          }
        }
      }
    }
  }

  if (goal === 'pair') {
    SUITS.forEach((suit) => {
      for (let rank = 1; rank <= 9; rank += 1) {
        valid.push([
          { suit, rank },
          { suit, rank },
        ]);
      }
    });
  }

  VALID_LINE_CACHE[goal] = valid;
  return valid;
}

function isSubsetMultiset(subset: DawnCabinetTile[], superset: DawnCabinetTile[]): boolean {
  const counts = countTiles(superset);
  return subset.every((tile) => {
    const key = tileKey(tile);
    if (!counts[key]) return false;
    counts[key] -= 1;
    return true;
  });
}
