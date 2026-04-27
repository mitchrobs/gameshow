import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  DAWN_CABINET_DAILY_DIFFICULTIES,
  type DawnCabinetDailyDifficulty,
  type DawnCabinetDawnTile,
  type DawnCabinetLineState,
  type DawnCabinetPuzzle,
  type DawnCabinetSetKind,
  type DawnCabinetTile,
  cellKey,
  dawnTileLabel,
  formatDawnCabinetShareText,
  getCabinetLineState,
  getDawnTileResolvedValueForCell,
  getDailyDawnCabinet,
  getDemoDawnCabinet,
  getLedgerKinds,
  getLedgerState,
  isBankGoalSatisfied,
  isCabinetSolved,
  isLedgerSatisfied,
  lineGoalLabel,
  lineGoalShortLabel,
  makeTutorialPuzzle,
  setKindPluralLabel,
  suitShortLabel,
  tileKey,
  tileLabel,
} from '../src/data/dawnCabinetPuzzles';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import { formatUtcDateLabel } from '../src/utils/dailyUtc';
import { DAWN_VARIANT_COUNT, DawnTileMark } from '../src/ui/dawnTileArt';

type BankEntry = {
  id: string;
} & (
  | { kind: 'tile'; tile: DawnCabinetTile }
  | { kind: 'dawn'; dawnTile: DawnCabinetDawnTile }
);

type BankStack = {
  key: string;
  entries: BankEntry[];
  availableEntries: BankEntry[];
} & (
  | { kind: 'tile'; tile: DawnCabinetTile }
  | { kind: 'dawn'; dawnTile: DawnCabinetDawnTile }
);

type GameState = 'playing' | 'won';
type DailyPlayStatus = 'not-started' | 'in-progress' | 'complete';
type SuitFilter = 'all' | 'dawn' | DawnCabinetTile['suit'];
type TileRenderSize = 'small' | 'compact' | 'large';
type SuitMarkSize = TileRenderSize | 'micro';
type BoardPoint = { x: number; y: number };
type BoardRect = { x1: number; y1: number; x2: number; y2: number };

const STORAGE_PREFIX = 'dawn-cabinet-v10';
const DAILY_DIFFICULTIES = DAWN_CABINET_DAILY_DIFFICULTIES;
const RAIL_LEGEND_ITEMS: {
  goal: DawnCabinetSetKind | 'hidden';
  description: string;
}[] = [
  { goal: 'run', description: 'Same suit, consecutive' },
  { goal: 'mixedRun', description: 'Different suits, consecutive' },
  { goal: 'gapRun', description: 'Same suit, skip by two' },
  { goal: 'mixedGap', description: 'Different suits, skip by two' },
  { goal: 'match', description: 'Three identical' },
  { goal: 'pair', description: 'Two identical' },
  { goal: 'flush', description: 'Same suit, not a run' },
  { goal: 'number', description: 'Same rank, different suits' },
  { goal: 'hidden', description: 'Counts in Cabinet progress' },
];
const WEB_NO_SELECT =
  Platform.OS === 'web'
    ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }
    : {};

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function isDailyDifficulty(value: string | null | undefined): value is DawnCabinetDailyDifficulty {
  return DAILY_DIFFICULTIES.includes(value as DawnCabinetDailyDifficulty);
}

function readSavedDailyDifficulty(date: string): DawnCabinetDailyDifficulty {
  const stored = getStorage()?.getItem(`${STORAGE_PREFIX}:choice:${date}`);
  return isDailyDifficulty(stored) ? stored : 'Standard';
}

function writeSavedDailyDifficulty(date: string, difficulty: DawnCabinetDailyDifficulty) {
  getStorage()?.setItem(`${STORAGE_PREFIX}:choice:${date}`, difficulty);
}

function puzzleSolvedKey(puzzle: DawnCabinetPuzzle): string {
  return `${STORAGE_PREFIX}:daily:${puzzle.id}`;
}

function dailySolvedKey(date: string, difficulty: DawnCabinetDailyDifficulty): string {
  return `${STORAGE_PREFIX}:daily:${date}:${difficulty}`;
}

function legacyDifficultylessSolvedKey(date: string): string {
  return `${STORAGE_PREFIX}:daily:${date}`;
}

function legacyDailySolvedKey(date: string): string {
  return `dawn-cabinet:daily:${date}`;
}

function markPuzzleSolved(puzzle: DawnCabinetPuzzle, isPractice: boolean): boolean {
  const storage = getStorage();
  if (!storage) return !isPractice;

  storage.setItem(puzzleSolvedKey(puzzle), '1');
  if (isPractice) return false;
  if (!isDailyDifficulty(puzzle.difficulty)) return false;

  const wasAlreadyCounted =
    storage.getItem(dailySolvedKey(puzzle.date, puzzle.difficulty)) === '1' ||
    (
      puzzle.difficulty === 'Standard' &&
      (
        storage.getItem(legacyDifficultylessSolvedKey(puzzle.date)) === '1' ||
        storage.getItem(legacyDailySolvedKey(puzzle.date)) === '1'
      )
    );
  storage.setItem(dailySolvedKey(puzzle.date, puzzle.difficulty), '1');
  return !wasAlreadyCounted;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function createBankEntries(puzzle: DawnCabinetPuzzle): BankEntry[] {
  const entries: BankEntry[] = puzzle.bank.map((tile, index) => ({
    id: `${tileKey(tile)}:${index}`,
    kind: 'tile',
    tile,
  }));
  if (puzzle.dawnTile) {
    entries.push({
      id: puzzle.dawnTile.id,
      kind: 'dawn',
      dawnTile: puzzle.dawnTile,
    });
  }
  return entries;
}

function readSavedPlacements(puzzle: DawnCabinetPuzzle, bankEntries: BankEntry[]): Record<string, string> {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}:state:${puzzle.id}`);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { placedEntryIdsByCell?: Record<string, string> };
    const entryIDs = new Set(bankEntries.map((entry) => entry.id));
    const blankCells = new Set(puzzle.cells.map((cell) => cellKey(cell.row, cell.col)).filter((key) => !puzzle.givens[key]));
    const next: Record<string, string> = {};
    Object.entries(parsed.placedEntryIdsByCell ?? {}).forEach(([cell, entryID]) => {
      if (blankCells.has(cell) && entryIDs.has(entryID)) {
        next[cell] = entryID;
      }
    });
    return next;
  } catch {
    return {};
  }
}

function createPlacements(
  puzzle: DawnCabinetPuzzle,
  bankByID: Map<string, BankEntry>,
  placedEntryIdsByCell: Record<string, string>
): Record<string, DawnCabinetTile> {
  const next: Record<string, DawnCabinetTile> = { ...puzzle.givens };
  Object.entries(placedEntryIdsByCell).forEach(([cell, entryID]) => {
    const entry = bankByID.get(entryID);
    if (!entry) return;
    if (entry.kind === 'tile') {
      next[cell] = entry.tile;
      return;
    }
    const resolvedTile = getDawnTileResolvedValueForCell(puzzle, cell);
    if (resolvedTile) next[cell] = resolvedTile;
  });
  return next;
}

function writeSavedPlacements(puzzleID: string, placedEntryIdsByCell: Record<string, string>) {
  getStorage()?.setItem(
    `${STORAGE_PREFIX}:state:${puzzleID}`,
    JSON.stringify({ placedEntryIdsByCell })
  );
}

function countEntriesByTile(entries: BankEntry[]): Record<string, number> {
  return entries.reduce<Record<string, number>>((counts, entry) => {
    if (entry.kind === 'dawn') return counts;
    const key = tileKey(entry.tile);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function createBankStacks(entries: BankEntry[], usedEntryIDs: Set<string>): BankStack[] {
  const stackMap = entries.reduce<Map<string, BankStack>>((map, entry) => {
    const key = entry.kind === 'dawn' ? 'dawn' : tileKey(entry.tile);
    const existing = map.get(key);
    if (existing) {
      existing.entries.push(entry);
      if (!usedEntryIDs.has(entry.id)) existing.availableEntries.push(entry);
    } else {
      map.set(
        key,
        entry.kind === 'dawn'
          ? {
              key,
              kind: 'dawn',
              dawnTile: entry.dawnTile,
              entries: [entry],
              availableEntries: usedEntryIDs.has(entry.id) ? [] : [entry],
            }
          : {
              key,
              kind: 'tile',
              tile: entry.tile,
              entries: [entry],
              availableEntries: usedEntryIDs.has(entry.id) ? [] : [entry],
            }
      );
    }
    return map;
  }, new Map());

  return Array.from(stackMap.values());
}

function getPuzzleSuits(puzzle: DawnCabinetPuzzle): DawnCabinetTile['suit'][] {
  const seen = new Set<DawnCabinetTile['suit']>();
  Object.values(puzzle.solution).forEach((tile) => {
    seen.add(tile.suit);
  });
  return Array.from(seen);
}

function bankEntryLabel(entry: BankEntry): string {
  return entry.kind === 'dawn' ? dawnTileLabel(entry.dawnTile) : tileLabel(entry.tile);
}

function getDawnVariantIndex(dawnTile: DawnCabinetDawnTile): number {
  const source = `${dawnTile.id}:${dawnTile.solutionCell}:${dawnTile.options.map(tileKey).join('|')}`;
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return hash % DAWN_VARIANT_COUNT;
}

function bankEntryMatchesFilter(entry: BankEntry, filter: SuitFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'dawn') return entry.kind === 'dawn';
  return entry.kind === 'tile' && entry.tile.suit === filter;
}

function renderBankEntryTile({
  entry,
  styles,
  size,
  muted,
  selected,
  totalTileCounts,
  remainingTileCounts,
}: {
  entry: BankEntry;
  styles: ReturnType<typeof createStyles>;
  size: TileRenderSize;
  muted?: boolean;
  selected?: boolean;
  totalTileCounts?: Record<string, number>;
  remainingTileCounts?: Record<string, number>;
}) {
  if (entry.kind === 'dawn') {
    return (
      <DawnTile
        dawnTile={entry.dawnTile}
        styles={styles}
        size={size}
        muted={muted}
        selected={selected}
      />
    );
  }
  const key = tileKey(entry.tile);
  return (
    <MahjongTile
      tile={entry.tile}
      styles={styles}
      size={size}
      muted={muted}
      selected={selected}
      totalCount={totalTileCounts?.[key] ?? 0}
      remainingCount={remainingTileCounts?.[key] ?? 0}
    />
  );
}

function hasSavedPuzzleProgress(puzzle: DawnCabinetPuzzle): boolean {
  const storage = getStorage();
  if (!storage) return false;
  if (storage.getItem(puzzleSolvedKey(puzzle)) === '1') return true;

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}:state:${puzzle.id}`);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { placedEntryIdsByCell?: Record<string, string> };
    return Object.keys(parsed.placedEntryIdsByCell ?? {}).length > 0;
  } catch {
    return false;
  }
}

function getDailyPlayStatus(puzzle: DawnCabinetPuzzle): DailyPlayStatus {
  const storage = getStorage();
  if (!storage) return 'not-started';
  if (storage.getItem(puzzleSolvedKey(puzzle)) === '1') return 'complete';

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}:state:${puzzle.id}`);
    if (!raw) return 'not-started';
    const parsed = JSON.parse(raw) as { placedEntryIdsByCell?: Record<string, string> };
    return Object.keys(parsed.placedEntryIdsByCell ?? {}).length > 0 ? 'in-progress' : 'not-started';
  } catch {
    return 'not-started';
  }
}

function dailyPlayStatusLabel(status: DailyPlayStatus): string {
  if (status === 'complete') return 'Complete';
  if (status === 'in-progress') return 'Resume';
  return 'Open';
}

function getBankGoalText(puzzle: DawnCabinetPuzzle): string | null {
  if (puzzle.bankGoal) return `Leave ${lineGoalLabel(puzzle.bankGoal.type)}`;
  if (puzzle.spareCount > 0) return `Leave ${puzzle.spareCount}`;
  return null;
}

function getCabinetReserveText(puzzle: DawnCabinetPuzzle): string {
  return getBankGoalText(puzzle) ?? 'Use every tile';
}

function getDifficultyCardSummary(puzzle: DawnCabinetPuzzle): string {
  switch (puzzle.difficulty) {
    case 'Standard':
      return 'Core cabinet\nNo Dawn Tile\nBest first daily';
    case 'Hard':
      return 'Adds Dawn Tile\nStricter reserve\nDenser rails';
    case 'Expert':
      return 'Largest cabinet\nFull rail set\nHardest Dawn placement';
    default:
      return 'Small cabinet\nPractice rails\nGentle solve';
  }
}

function getStartGoalPreview(puzzle: DawnCabinetPuzzle): string {
  switch (puzzle.difficulty) {
    case 'Standard':
      return 'Start here for the daily rhythm: read rails, place Cabinet tiles, and balance the hidden counts.';
    case 'Hard':
      return 'Hard adds the Dawn Tile, tighter reserve choices, and more crossing rail pressure.';
    case 'Expert':
      return 'Expert is the longest cabinet, with every rail family and the most demanding Dawn Tile placement.';
    default:
      return 'A short practice cabinet for learning the rail language.';
  }
}

function getShareUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return `${window.location.origin}/dawn-cabinet`;
    }
  }
  return 'https://mitchrobs.github.io/gameshow/';
}

const SUIT_MARK_COLORS: Record<DawnCabinetTile['suit'], string> = {
  bamboo: '#16835b',
  dots: '#1767b1',
  characters: '#cb392f',
  coins: '#b7811a',
  lotus: '#b9467d',
  jade: '#0d8f82',
  clouds: '#6f7f95',
  stars: '#7c5fd0',
  waves: '#1384a5',
  knots: '#a3562d',
  moons: '#5964b3',
  suns: '#d16d22',
  lanterns: '#c24f34',
  sparks: '#c08a16',
};

export default function DawnCabinetScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('dawn-cabinet', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const ui = useMemo(() => createDaybreakPrimitives(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dailyDate = useMemo(() => getDailyDawnCabinet().date, []);
  const initialDailyDifficulty = useMemo(() => readSavedDailyDifficulty(dailyDate), [dailyDate]);
  const initialDailyPuzzle = useMemo(
    () => getDailyDawnCabinet(dailyDate, initialDailyDifficulty),
    [dailyDate, initialDailyDifficulty]
  );
  const [selectedDailyDifficulty, setSelectedDailyDifficulty] = useState<DawnCabinetDailyDifficulty>(() =>
    initialDailyDifficulty
  );
  const [isPractice, setIsPractice] = useState(false);
  const [hasStartedPuzzle, setHasStartedPuzzle] = useState(() =>
    hasSavedPuzzleProgress(initialDailyPuzzle)
  );
  const [hasChecked, setHasChecked] = useState(false);
  const [selectedSuitFilter, setSelectedSuitFilter] = useState<SuitFilter>('all');
  const puzzle = useMemo(
    () =>
      isPractice
        ? getDemoDawnCabinet('Easy', dailyDate)
        : getDailyDawnCabinet(dailyDate, selectedDailyDifficulty),
    [dailyDate, isPractice, selectedDailyDifficulty]
  );
  const isMobile = width < 700;
  const dateLabel = useMemo(() => formatUtcDateLabel(puzzle.date), [puzzle.date]);
  const bankEntries = useMemo(() => createBankEntries(puzzle), [puzzle]);
  const bankByID = useMemo(
    () => new Map(bankEntries.map((entry) => [entry.id, entry])),
    [bankEntries]
  );
  const initialPlacedEntryIdsByCell = useMemo(
    () => readSavedPlacements(puzzle, bankEntries),
    [bankEntries, puzzle]
  );
  const initialIsSolved = useMemo(
    () =>
      getStorage()?.getItem(puzzleSolvedKey(puzzle)) === '1' &&
      isCabinetSolved(puzzle, createPlacements(puzzle, bankByID, initialPlacedEntryIdsByCell)),
    [bankByID, initialPlacedEntryIdsByCell, puzzle]
  );
  const [placedEntryIdsByCell, setPlacedEntryIdsByCell] = useState<Record<string, string>>(
    () => initialPlacedEntryIdsByCell
  );
  const [selectedEntryID, setSelectedEntryID] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [armedCell, setArmedCell] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>(() => (initialIsSolved ? 'won' : 'playing'));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [firstCorrectCells, setFirstCorrectCells] = useState<string[]>([]);
  const hasCountedRef = useRef(false);

  const placements = useMemo(() => {
    return createPlacements(puzzle, bankByID, placedEntryIdsByCell);
  }, [bankByID, placedEntryIdsByCell, puzzle]);

  const usedEntryIDs = useMemo(() => new Set(Object.values(placedEntryIdsByCell)), [placedEntryIdsByCell]);
  const availableBankEntries = useMemo(
    () => bankEntries.filter((entry) => !usedEntryIDs.has(entry.id)),
    [bankEntries, usedEntryIDs]
  );
  const totalTileCounts = useMemo(() => countEntriesByTile(bankEntries), [bankEntries]);
  const remainingTileCounts = useMemo(
    () => countEntriesByTile(availableBankEntries),
    [availableBankEntries]
  );
  const bankStacks = useMemo(
    () => createBankStacks(bankEntries, usedEntryIDs),
    [bankEntries, usedEntryIDs]
  );
  const activeSuits = useMemo(() => getPuzzleSuits(puzzle), [puzzle]);
  const visibleBankStacks = useMemo(
    () =>
      selectedSuitFilter === 'all'
        ? bankStacks
        : bankStacks.filter((stack) => bankEntryMatchesFilter(stack.entries[0], selectedSuitFilter)),
    [bankStacks, selectedSuitFilter]
  );
  const lineStates = useMemo(
    () => puzzle.lines.map((line) => getCabinetLineState(line, placements)),
    [placements, puzzle.lines]
  );
  const ledgerState = useMemo(
    () => getLedgerState(puzzle, placements),
    [placements, puzzle]
  );
  const visibleRailCount = puzzle.lines.filter((line) => line.goal !== 'hidden').length;
  const validVisibleRailCount = puzzle.lines.filter((line, index) => {
    return line.goal !== 'hidden' && lineStates[index] === 'valid';
  }).length;
  const invalidLineCount = lineStates.filter((state) => state === 'invalid').length;
  const allCellsFilled = puzzle.cells.every((cell) => Boolean(placements[cellKey(cell.row, cell.col)]));
  const ledgerComplete = isLedgerSatisfied(puzzle, placements);
  const bankGoalComplete = isBankGoalSatisfied(puzzle, placements);
  const tilesToPlace = Math.max(availableBankEntries.length - puzzle.spareCount, 0);
  const bankGoalText = getBankGoalText(puzzle);
  const bankMeta =
    puzzle.bankGoal
      ? `${tilesToPlace} to place · ${bankGoalText}`
      : puzzle.spareCount > 0
        ? `${tilesToPlace} to place · Leave ${puzzle.spareCount}`
        : `${availableBankEntries.length} left`;
  const winSuffix =
    puzzle.bankGoal
      ? `, with a ${lineGoalLabel(puzzle.bankGoal.type)} reserve left`
      : puzzle.spareCount > 0
        ? `, with ${puzzle.spareCount} reserve left`
        : '';
  const cabinetNotice = gameState === 'playing' && hasChecked ? message : null;
  const shareTileTrail = useMemo(() => {
    const trackedTiles = firstCorrectCells
      .map((cell) => puzzle.solution[cell])
      .filter(Boolean)
      .slice(0, 3);
    if (trackedTiles.length >= 3 || gameState !== 'won') return trackedTiles;

    const trackedKeys = new Set(firstCorrectCells);
    const fallbackTiles = puzzle.cells
      .map((cell) => cellKey(cell.row, cell.col))
      .filter((key) => !trackedKeys.has(key))
      .map((key) => puzzle.solution[key])
      .filter(Boolean);
    return [...trackedTiles, ...fallbackTiles].slice(0, 3);
  }, [firstCorrectCells, gameState, puzzle.cells, puzzle.solution]);
  const shareText = useMemo(
    () =>
      isPractice
        ? ''
        : formatDawnCabinetShareText({
            date: puzzle.date,
            difficulty: puzzle.difficulty as DawnCabinetDailyDifficulty,
            elapsedSeconds,
            railCount: puzzle.lines.length,
            tileTrail: shareTileTrail,
            url: getShareUrl(),
          }),
    [
      elapsedSeconds,
      isPractice,
      puzzle.date,
      puzzle.difficulty,
      puzzle.lines.length,
      shareTileTrail,
    ]
  );

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  const completePuzzle = useCallback(() => {
    setGameState('won');
    setMessage('Cabinet complete.');
    const shouldCount = markPuzzleSolved(puzzle, isPractice);
    if (shouldCount && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('dawn-cabinet');
    }
  }, [isPractice, puzzle]);

  useEffect(() => {
    const savedPlacements = readSavedPlacements(puzzle, bankEntries);
    const solved =
      getStorage()?.getItem(puzzleSolvedKey(puzzle)) === '1' &&
      isCabinetSolved(puzzle, createPlacements(puzzle, bankByID, savedPlacements));

    setPlacedEntryIdsByCell(savedPlacements);
    setSelectedEntryID(null);
    setSelectedCell(null);
    setArmedCell(null);
    setMessage(null);
    setElapsedSeconds(0);
    setGameState(solved ? 'won' : 'playing');
    setHasChecked(false);
    setSelectedSuitFilter('all');
    setFirstCorrectCells([]);
    hasCountedRef.current = false;
  }, [bankByID, bankEntries, puzzle]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const solvedKey = puzzleSolvedKey(puzzle);
    if (storage.getItem(solvedKey) !== '1') return;
    if (isCabinetSolved(puzzle, placements)) return;

    storage.removeItem(solvedKey);
    setGameState('playing');
  }, [placements, puzzle]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || !isCabinetSolved(puzzle, placements)) return;
    completePuzzle();
  }, [completePuzzle, gameState, placements, puzzle]);

  const trackCorrectPlacement = useCallback(
    (cell: string, entry: BankEntry | undefined) => {
      const solutionTile = puzzle.solution[cell];
      if (!entry || !solutionTile) return;
      if (entry.kind === 'tile' && tileKey(entry.tile) !== tileKey(solutionTile)) return;
      if (entry.kind === 'dawn' && cell !== entry.dawnTile.solutionCell) return;
      setFirstCorrectCells((previous) =>
        previous.includes(cell) || previous.length >= 3 ? previous : [...previous, cell]
      );
    },
    [puzzle.solution]
  );

  const placeEntryInCell = useCallback(
    (cell: string, entryID: string) => {
      if (gameState !== 'playing' || puzzle.givens[cell]) return false;
      const entry = bankByID.get(entryID);
      if (!entry || usedEntryIDs.has(entryID)) return false;

      setPlacedEntryIdsByCell((previous) => {
        const next = {
          ...previous,
          [cell]: entryID,
        };
        writeSavedPlacements(puzzle.id, next);
        return next;
      });
      trackCorrectPlacement(cell, entry);
      setSelectedEntryID(null);
      setSelectedCell(cell);
      setArmedCell(null);
      setMessage(null);
      setHasChecked(false);
      return true;
    },
    [bankByID, gameState, puzzle.givens, puzzle.id, trackCorrectPlacement, usedEntryIDs]
  );

  const handleBankPress = useCallback(
    (entryID: string) => {
      if (gameState !== 'playing') return;
      if (armedCell && placeEntryInCell(armedCell, entryID)) return;
      setSelectedEntryID((current) => (current === entryID ? null : entryID));
      setMessage(null);
    },
    [armedCell, gameState, placeEntryInCell]
  );

  const handleBankStackPress = useCallback(
    (stack: BankStack) => {
      if (gameState !== 'playing') return;
      const nextEntry = stack.availableEntries[0];
      if (!nextEntry) return;
      if (armedCell && placeEntryInCell(armedCell, nextEntry.id)) return;
      setSelectedEntryID((current) =>
        stack.entries.some((entry) => entry.id === current) ? null : nextEntry.id
      );
      setMessage(null);
    },
    [armedCell, gameState, placeEntryInCell]
  );

  const handleSuitFilterSelect = useCallback(
    (filter: SuitFilter) => {
      setSelectedSuitFilter(filter);
      if (filter === 'all' || !selectedEntryID) return;
      const selectedEntry = bankByID.get(selectedEntryID);
      if (!selectedEntry || !bankEntryMatchesFilter(selectedEntry, filter)) setSelectedEntryID(null);
    },
    [bankByID, selectedEntryID]
  );

  const handleCellPress = useCallback(
    (cell: string) => {
      if (gameState !== 'playing') return;

      setSelectedCell((current) => (current === cell ? current : cell));
      if (puzzle.givens[cell]) {
        setArmedCell(null);
        setMessage(null);
        return;
      }

      if (selectedEntryID) {
        placeEntryInCell(cell, selectedEntryID);
        return;
      }

      if (placedEntryIdsByCell[cell] && selectedCell === cell && armedCell === cell) {
        setPlacedEntryIdsByCell((previous) => {
          const next = { ...previous };
          delete next[cell];
          writeSavedPlacements(puzzle.id, next);
          return next;
        });
        setMessage(null);
        setHasChecked(false);
        setArmedCell(cell);
        return;
      }

      setArmedCell(cell);
      setMessage(null);
    },
    [
      armedCell,
      gameState,
      placedEntryIdsByCell,
      placeEntryInCell,
      puzzle.givens,
      selectedCell,
      selectedEntryID,
    ]
  );

  const handleCheck = useCallback(() => {
    setHasChecked(true);
    if (isCabinetSolved(puzzle, placements)) {
      completePuzzle();
      return;
    }

    if (!allCellsFilled) {
      setMessage('Fill every open slot.');
    } else if (invalidLineCount > 0) {
      setMessage('One marked wait breaks its line tag.');
    } else if (!ledgerComplete) {
      setMessage('The hidden-rail ledger does not balance.');
    } else if (!bankGoalComplete) {
      setMessage(`The leftover Cabinet tiles must form ${bankGoalText ? bankGoalText.toLowerCase().replace('leave ', 'a ') : 'the reserve goal'}.`);
    } else {
      setMessage('Keep reading the rails.');
    }
  }, [allCellsFilled, bankGoalComplete, bankGoalText, completePuzzle, invalidLineCount, ledgerComplete, placements, puzzle]);

  const handleClear = useCallback(() => {
    const storage = getStorage();
    storage?.removeItem(puzzleSolvedKey(puzzle));
    if (!isPractice && isDailyDifficulty(puzzle.difficulty)) {
      storage?.removeItem(dailySolvedKey(puzzle.date, puzzle.difficulty));
      if (puzzle.difficulty === 'Standard') {
        storage?.removeItem(legacyDifficultylessSolvedKey(puzzle.date));
        storage?.removeItem(legacyDailySolvedKey(puzzle.date));
      }
    }
    storage?.removeItem(`${STORAGE_PREFIX}:state:${puzzle.id}`);
    setPlacedEntryIdsByCell({});
    setSelectedEntryID(null);
    setSelectedCell(null);
    setArmedCell(null);
    setMessage(null);
    setShareStatus(null);
    setHasChecked(false);
    setFirstCorrectCells([]);
    setElapsedSeconds(0);
    setGameState('playing');
  }, [isPractice, puzzle]);

  const handleDailyDifficultySelect = useCallback(
    (difficulty: DawnCabinetDailyDifficulty) => {
      writeSavedDailyDifficulty(dailyDate, difficulty);
      setSelectedDailyDifficulty(difficulty);
      setIsPractice(false);
      setHasStartedPuzzle(false);
      setShareStatus(null);
      setMessage(null);
    },
    [dailyDate]
  );

  const handleChooseLevel = useCallback(() => {
    setIsPractice(false);
    setHasStartedPuzzle(false);
    setShowTutorial(false);
    setShareStatus(null);
    setMessage(null);
  }, []);

  const handleStartDaily = useCallback(() => {
    writeSavedDailyDifficulty(dailyDate, selectedDailyDifficulty);
    setIsPractice(false);
    setHasStartedPuzzle(true);
    setShowTutorial(false);
    setShareStatus(null);
    setMessage(null);
  }, [dailyDate, selectedDailyDifficulty]);

  const handlePracticeEasy = useCallback(() => {
    getStorage()?.setItem(`${STORAGE_PREFIX}:tutorial-seen`, '1');
    setIsPractice(true);
    setHasStartedPuzzle(true);
    setShowTutorial(false);
    setShareStatus(null);
    setMessage(null);
  }, []);

  const handleCopyResults = useCallback(async () => {
    if (Platform.OS !== 'web') return;
    const clipboard = (globalThis as typeof globalThis & {
      navigator?: { clipboard?: { writeText?: (text: string) => Promise<void> } };
    }).navigator?.clipboard;
    if (!clipboard?.writeText) {
      setShareStatus('Copy not supported');
      return;
    }
    try {
      await clipboard.writeText(shareText);
      setShareStatus('Copied to clipboard');
    } catch {
      setShareStatus('Copy failed');
    }
  }, [shareText]);

  const handleGoHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const showMobileBankTray = hasStartedPuzzle && isMobile && gameState === 'playing';

  if (!hasStartedPuzzle) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Dawn Cabinet',
            headerBackTitle: 'Today',
          }}
        />
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <StartScreen
              puzzle={puzzle}
              dateLabel={dateLabel}
              selectedDifficulty={selectedDailyDifficulty}
              onSelectDifficulty={handleDailyDifficultySelect}
              onStart={handleStartDaily}
              onRules={() => setShowTutorial(true)}
              onPractice={handlePracticeEasy}
              onBack={() => router.back()}
              styles={styles}
            />
          </View>
        </ScrollView>
        <TutorialModal
          visible={showTutorial}
          onClose={() => setShowTutorial(false)}
          onStartDaily={handleStartDaily}
          onPracticeEasy={handlePracticeEasy}
          styles={styles}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Dawn Cabinet',
          headerBackTitle: 'Today',
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          showMobileBankTray && styles.scrollContentWithMobileTray,
        ]}
      >
        <View style={styles.page}>
          <View style={styles.playHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Today"
              style={({ pressed }) => [
                styles.backButton,
                styles.playBackButton,
                pressed && styles.backButtonPressed,
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Today</Text>
            </Pressable>
            <View style={styles.playTitleBlock}>
              <Text style={styles.playTitle}>Dawn Cabinet</Text>
              <Text style={styles.playSubtitle}>{isPractice ? 'Easy Demo' : dateLabel}</Text>
            </View>
            <View style={styles.playStatusRow}>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{puzzle.difficulty}</Text>
              </View>
              {isPractice ? (
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Demo</Text>
                </View>
              ) : null}
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{formatTime(elapsedSeconds)}</Text>
              </View>
            </View>
          </View>

          {gameState === 'won' && (
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>Cabinet complete</Text>
              <Text style={styles.winText}>
                {`${puzzle.lines.length} waits resolved in ${formatTime(elapsedSeconds)}${winSuffix}.`}
              </Text>
              {!isPractice ? (
                <View style={styles.shareCard}>
                  <Text style={styles.shareTitle}>Share your result</Text>
                  <View style={styles.shareBox}>
                    <Text selectable style={styles.shareText}>
                      {shareText}
                    </Text>
                  </View>
                  {Platform.OS === 'web' ? (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Copy Dawn Cabinet result"
                      style={({ pressed }) => [
                        styles.shareButton,
                        pressed && styles.shareButtonPressed,
                      ]}
                      onPress={handleCopyResults}
                    >
                      <Text style={styles.shareButtonText}>Copy results</Text>
                    </Pressable>
                  ) : null}
                  {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
                </View>
              ) : null}
              {!isPractice ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Choose another Dawn Cabinet level"
                  style={({ pressed }) => [
                    styles.winHomeButton,
                    styles.winLevelButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={handleChooseLevel}
                >
                  <Text style={styles.winHomeButtonText}>Choose Level</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to the main page"
                style={({ pressed }) => [
                  styles.winHomeButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleGoHome}
              >
                <Text style={styles.winHomeButtonText}>Back to Today</Text>
              </Pressable>
            </View>
          )}

          <View style={[ui.card, styles.boardCard]}>
            <CabinetBoard
              puzzle={puzzle}
              placements={placements}
              placedEntryIdsByCell={placedEntryIdsByCell}
              bankByID={bankByID}
              selectedEntryID={selectedEntryID}
              selectedCell={selectedCell}
              revealHiddenRails={gameState === 'won'}
              onCellPress={handleCellPress}
              styles={styles}
              theme={theme}
            />
          </View>

          {!isMobile ? (
            <View style={styles.bankSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Cabinet</Text>
                <Text style={styles.sectionMeta}>{bankMeta}</Text>
              </View>
              <View style={styles.bankGrid}>
                {bankEntries.map((entry) => {
                  const isUsed = usedEntryIDs.has(entry.id);
                  return (
                    <Pressable
                      key={entry.id}
                      accessibilityRole="button"
                      accessibilityLabel={bankEntryLabel(entry)}
                      testID={`dawn-cabinet.bank.${entry.id}`}
                      disabled={isUsed || gameState !== 'playing'}
                      style={({ pressed }) => [
                        styles.bankTileButton,
                        selectedEntryID === entry.id && styles.bankTileSelected,
                        isUsed && styles.bankTileUsed,
                        pressed && !isUsed && styles.bankTilePressed,
                      ]}
                      onPress={() => handleBankPress(entry.id)}
                    >
                      {renderBankEntryTile({
                        entry,
                        styles,
                        muted: isUsed,
                        selected: selectedEntryID === entry.id,
                        size: 'small',
                        totalTileCounts,
                        remainingTileCounts,
                      })}
                    </Pressable>
                  );
                })}
              </View>
              <CabinetProgressPanel
                puzzle={puzzle}
                ledgerState={ledgerState}
                validVisibleRailCount={validVisibleRailCount}
                visibleRailCount={visibleRailCount}
                notice={cabinetNotice}
                styles={styles}
              />
            </View>
          ) : null}

          <View style={styles.actionRow}>
            {!isPractice ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose another Dawn Cabinet level"
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
                onPress={handleChooseLevel}
              >
                <Text style={styles.secondaryButtonText}>Levels</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show rules"
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={() => setShowTutorial(true)}
            >
              <Text style={styles.secondaryButtonText}>Rules</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={gameState === 'won' ? 'Reset cabinet' : 'Clear cabinet'}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={handleClear}
            >
              <Text style={styles.secondaryButtonText}>{gameState === 'won' ? 'Reset' : 'Clear'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Check cabinet"
              style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
              onPress={handleCheck}
            >
              <Text style={styles.primaryButtonText}>{gameState === 'won' ? 'Solved' : 'Check'}</Text>
            </Pressable>
          </View>

          {message && !cabinetNotice && (
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {showMobileBankTray ? (
        <MobileBankTray
          activeSuits={activeSuits}
          selectedSuitFilter={selectedSuitFilter}
          stacks={visibleBankStacks}
          selectedEntryID={selectedEntryID}
          bankMeta={bankMeta}
          puzzle={puzzle}
          ledgerState={ledgerState}
          validVisibleRailCount={validVisibleRailCount}
          visibleRailCount={visibleRailCount}
          notice={cabinetNotice}
          totalTileCounts={totalTileCounts}
          remainingTileCounts={remainingTileCounts}
          onFilterPress={handleSuitFilterSelect}
          onStackPress={handleBankStackPress}
          styles={styles}
        />
      ) : null}

      <TutorialModal
        visible={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStartDaily={handleStartDaily}
        onPracticeEasy={handlePracticeEasy}
        styles={styles}
      />
    </SafeAreaView>
  );
}

function StartScreen({
  puzzle,
  dateLabel,
  selectedDifficulty,
  onSelectDifficulty,
  onStart,
  onRules,
  onPractice,
  onBack,
  styles,
}: {
  puzzle: DawnCabinetPuzzle;
  dateLabel: string;
  selectedDifficulty: DawnCabinetDailyDifficulty;
  onSelectDifficulty: (difficulty: DawnCabinetDailyDifficulty) => void;
  onStart: () => void;
  onRules: () => void;
  onPractice: () => void;
  onBack: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const accentTiles = Array.from(
    new Map(puzzle.bank.map((tile) => [tileKey(tile), tile])).values()
  ).slice(0, 5);
  const selectedStatus = getDailyPlayStatus(puzzle);
  const startLabel =
    selectedStatus === 'complete' ? 'View Results' :
    selectedStatus === 'in-progress' ? 'Resume' :
    'Start';
  const quickStartSteps = [
    'Place Cabinet tiles onto the board.',
    'Every rail must form its set.',
    'Harder cabinets may leave reserve tiles or include a Dawn Tile.',
  ];

  return (
    <View style={styles.startPage}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Today"
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>Today</Text>
      </Pressable>

      <View style={styles.startHero}>
        <Text style={styles.kicker}>{dateLabel}</Text>
        <Text style={styles.title}>Dawn Cabinet</Text>
        <Text style={styles.subtitle}>Choose today's cabinet.</Text>
        <View style={styles.startAccentTiles} accessibilityElementsHidden>
          {accentTiles.map((tile, index) => (
            <View
              key={`${tileKey(tile)}-${index}`}
              style={[
                styles.startAccentTile,
                index % 2 === 1 && styles.startAccentTileRaised,
              ]}
            >
              <MahjongTile tile={tile} styles={styles} size="small" />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.startHowCard}>
        <Text style={styles.startHowTitle}>How this works</Text>
        {quickStartSteps.map((step, index) => (
          <View key={step} style={styles.startHowStep}>
            <View style={styles.startHowNumber}>
              <Text style={styles.startHowNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.startHowText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.difficultyCardRow}>
        {DAILY_DIFFICULTIES.map((difficulty) => {
          const isSelected = difficulty === selectedDifficulty;
          const optionPuzzle = getDailyDawnCabinet(puzzle.date, difficulty);
          const status = getDailyPlayStatus(optionPuzzle);
          const isRecommended = difficulty === 'Standard';
          return (
            <Pressable
              key={difficulty}
              accessibilityRole="button"
              accessibilityLabel={`Select ${difficulty} Dawn Cabinet, ${dailyPlayStatusLabel(status)}`}
              testID={`dawn-cabinet.difficulty.${difficulty.toLowerCase()}`}
              style={({ pressed }) => [
                styles.difficultyCard,
                isSelected && styles.difficultyCardSelected,
                pressed && styles.bankTilePressed,
              ]}
              onPress={() => onSelectDifficulty(difficulty)}
            >
              <View style={styles.difficultyCardHeader}>
                <Text
                  style={[
                    styles.difficultyCardTitle,
                    isSelected && styles.difficultyCardTitleSelected,
                  ]}
                >
                  {difficulty}
                </Text>
                {isRecommended ? (
                  <View style={styles.difficultyRecommendedBadge}>
                    <Text style={styles.difficultyRecommendedText}>Recommended</Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.difficultyCardText}>{getDifficultyCardSummary(optionPuzzle)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.startSummaryBox}>
        <Text style={styles.startSummaryTitle}>{selectedDifficulty}</Text>
        <Text style={styles.startSummaryText}>{getDifficultyCardSummary(puzzle).replace(/\n/g, ' · ')}</Text>
        <Text style={styles.startSummaryText}>{getStartGoalPreview(puzzle)}</Text>
      </View>

      <View style={styles.startActionRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start today's Dawn Cabinet"
          testID="dawn-cabinet.start-daily"
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={onStart}
        >
          <Text style={styles.primaryButtonText}>{startLabel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show rules"
          testID="dawn-cabinet.rules"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={onRules}
        >
          <Text style={styles.secondaryButtonText}>How to Play</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Practice a small Dawn Cabinet"
        testID="dawn-cabinet.practice-easy"
        style={({ pressed }) => [styles.practiceButton, pressed && styles.buttonPressed]}
        onPress={onPractice}
      >
        <Text style={styles.practiceButtonText}>Practice a Small Cabinet</Text>
      </Pressable>
    </View>
  );
}

function CabinetProgressPanel({
  puzzle,
  ledgerState,
  validVisibleRailCount,
  visibleRailCount,
  notice,
  compact,
  styles,
}: {
  puzzle: DawnCabinetPuzzle;
  ledgerState: ReturnType<typeof getLedgerState>;
  validVisibleRailCount: number;
  visibleRailCount: number;
  notice: string | null;
  compact?: boolean;
  styles: ReturnType<typeof createStyles>;
}) {
  const ledgerKinds = getLedgerKinds(puzzle);
  const reserveText = getCabinetReserveText(puzzle);
  const progressItems = [
    {
      key: 'visible-rails',
      label: 'Visible rails',
      value: validVisibleRailCount,
      total: visibleRailCount,
    },
    ...ledgerKinds.map((kind: DawnCabinetSetKind) => ({
      key: kind,
      label: setKindPluralLabel(kind),
      value: ledgerState.counts[kind],
      total: puzzle.ledger?.[kind] ?? 0,
    })),
  ];

  return (
    <View style={[styles.cabinetProgressPanel, compact && styles.cabinetProgressPanelCompact]}>
      <View style={compact ? styles.cabinetProgressScrollRow : styles.cabinetProgressWrap}>
        {progressItems.map((item) => (
          <View key={item.key} style={styles.cabinetProgressItem}>
            <View style={styles.cabinetProgressLabelRow}>
              <Text style={styles.cabinetProgressLabel}>{item.label}</Text>
              <Text style={styles.cabinetProgressCount}>{`${item.value}/${item.total}`}</Text>
            </View>
            <View style={styles.cabinetProgressTrack}>
              <View
                style={[
                  styles.cabinetProgressFill,
                  { width: `${Math.min(100, Math.round((item.value / Math.max(1, item.total)) * 100))}%` },
                ]}
              />
            </View>
          </View>
        ))}
        <View style={[styles.cabinetProgressItem, styles.cabinetReserveItem]}>
          <Text style={styles.cabinetProgressLabel}>Reserve</Text>
          <Text style={styles.cabinetReserveText}>{reserveText}</Text>
        </View>
      </View>
      {notice ? <Text style={styles.cabinetProgressNotice}>{notice}</Text> : null}
    </View>
  );
}

function MobileBankTray({
  activeSuits,
  selectedSuitFilter,
  stacks,
  selectedEntryID,
  bankMeta,
  puzzle,
  ledgerState,
  validVisibleRailCount,
  visibleRailCount,
  notice,
  totalTileCounts,
  remainingTileCounts,
  onFilterPress,
  onStackPress,
  styles,
}: {
  activeSuits: DawnCabinetTile['suit'][];
  selectedSuitFilter: SuitFilter;
  stacks: BankStack[];
  selectedEntryID: string | null;
  bankMeta: string;
  puzzle: DawnCabinetPuzzle;
  ledgerState: ReturnType<typeof getLedgerState>;
  validVisibleRailCount: number;
  visibleRailCount: number;
  notice: string | null;
  totalTileCounts: Record<string, number>;
  remainingTileCounts: Record<string, number>;
  onFilterPress: (filter: SuitFilter) => void;
  onStackPress: (stack: BankStack) => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const filters: SuitFilter[] = ['all', ...activeSuits, ...(puzzle.dawnTile ? ['dawn' as const] : [])];
  const dawnStack = selectedSuitFilter === 'dawn'
    ? stacks.find((stack): stack is Extract<BankStack, { kind: 'dawn' }> => stack.kind === 'dawn')
    : undefined;
  const isDawnSelected = Boolean(dawnStack?.entries.some((entry) => entry.id === selectedEntryID));
  const isDawnEmpty = Boolean(dawnStack && dawnStack.availableEntries.length === 0);

  return (
    <View style={styles.mobileBankTray} testID="dawn-cabinet.mobile-bank">
      <View style={styles.mobileBankHeader}>
        <Text style={styles.mobileBankTitle}>Cabinet</Text>
        <Text style={styles.mobileBankMeta}>{bankMeta}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suitFilterRow}
      >
        {filters.map((filter) => {
          const selected = filter === selectedSuitFilter;
          const label = filter === 'all' ? 'All' : filter === 'dawn' ? 'Dawn' : suitShortLabel(filter);
          return (
            <Pressable
              key={filter}
              accessibilityRole="button"
              accessibilityLabel={`Show ${label} tiles`}
              testID={`dawn-cabinet.suit-filter.${filter}`}
              style={({ pressed }) => [
                styles.suitFilterButton,
                selected && styles.suitFilterButtonSelected,
                pressed && styles.bankTilePressed,
              ]}
              onPress={() => onFilterPress(filter)}
            >
              {filter === 'all' ? (
                <Text
                  style={[
                    styles.suitFilterText,
                    selected && styles.suitFilterTextSelected,
                  ]}
                >
                  All
                </Text>
              ) : filter === 'dawn' ? (
                puzzle.dawnTile ? (
                  <DawnVariantMark
                    variant={getDawnVariantIndex(puzzle.dawnTile)}
                    styles={styles}
                    size="compact"
                  />
                ) : null
              ) : (
                <View style={styles.suitFilterIconWrap}>
                  <SuitMark suit={filter} styles={styles} compact />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      {dawnStack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${dawnTileLabel(dawnStack.dawnTile)}, ${dawnStack.availableEntries.length} available`}
          disabled={isDawnEmpty}
          style={({ pressed }) => [
            styles.dawnFilterDetailCard,
            isDawnSelected && styles.bankTileSelected,
            isDawnEmpty && styles.bankTileUsed,
            pressed && !isDawnEmpty && styles.bankTilePressed,
          ]}
          onPress={() => onStackPress(dawnStack)}
        >
          <View style={styles.dawnFilterDetailTile}>
            {renderBankEntryTile({
              entry: dawnStack.entries[0],
              styles,
              size: 'small',
              muted: isDawnEmpty,
              selected: isDawnSelected,
              totalTileCounts,
              remainingTileCounts,
            })}
          </View>
          <DawnFilterNote dawnTile={dawnStack.dawnTile} styles={styles} />
        </Pressable>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mobileBankScroller}
        >
          {stacks.map((stack) => {
            const isEmpty = stack.availableEntries.length === 0;
            const selected = stack.entries.some((entry) => entry.id === selectedEntryID);
            return (
              <Pressable
                key={stack.key}
                accessibilityRole="button"
                accessibilityLabel={`${stack.kind === 'dawn' ? dawnTileLabel(stack.dawnTile) : tileLabel(stack.tile)}, ${stack.availableEntries.length} available`}
                disabled={isEmpty}
                style={({ pressed }) => [
                  styles.mobileBankStack,
                  selected && styles.bankTileSelected,
                  isEmpty && styles.bankTileUsed,
                  pressed && !isEmpty && styles.bankTilePressed,
                ]}
                onPress={() => onStackPress(stack)}
              >
                {renderBankEntryTile({
                  entry: stack.entries[0],
                  styles,
                  size: 'small',
                  muted: isEmpty,
                  selected,
                  totalTileCounts,
                  remainingTileCounts,
                })}
                <View style={styles.stackCountBadge}>
                  <Text style={styles.stackCountText}>
                    {`${stack.availableEntries.length}/${stack.entries.length}`}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mobileCabinetProgressScroller}
      >
        <CabinetProgressPanel
          puzzle={puzzle}
          ledgerState={ledgerState}
          validVisibleRailCount={validVisibleRailCount}
          visibleRailCount={visibleRailCount}
          notice={notice}
          compact
          styles={styles}
        />
      </ScrollView>
    </View>
  );
}

function CabinetBoard({
  puzzle,
  placements,
  placedEntryIdsByCell,
  bankByID,
  selectedEntryID,
  selectedCell,
  revealHiddenRails,
  onCellPress,
  styles,
  theme,
}: {
  puzzle: DawnCabinetPuzzle;
  placements: Record<string, DawnCabinetTile>;
  placedEntryIdsByCell: Record<string, string>;
  bankByID: Map<string, BankEntry>;
  selectedEntryID: string | null;
  selectedCell: string | null;
  revealHiddenRails: boolean;
  onCellPress: (cell: string) => void;
  styles: ReturnType<typeof createStyles>;
  theme: ThemeTokens;
}) {
  const { width } = useWindowDimensions();
  const gap = puzzle.columns >= 5 ? 6 : 8;
  const padding = 12;
  const maxBoard = puzzle.columns >= 5 ? 460 : 390;
  const available = Math.min(width - 40, maxBoard);
  const cellSize = Math.floor((available - padding * 2 - gap * (puzzle.columns - 1)) / puzzle.columns);
  const boardWidth = cellSize * puzzle.columns + gap * (puzzle.columns - 1) + padding * 2;
  const boardHeight = cellSize * puzzle.rows + gap * (puzzle.rows - 1) + padding * 2;
  const activeCells = new Set(puzzle.cells.map((cell) => cellKey(cell.row, cell.col)));
  const selectedCellLines = selectedCell
    ? puzzle.lines.filter((line) => line.cells.includes(selectedCell))
    : [];
  const selectedCellLineIDs = new Set(selectedCellLines.map((line) => line.id));
  const selectedCellRailCells = new Set(selectedCellLines.flatMap((line) => line.cells));
  const accent = resolveScreenAccent('dawn-cabinet', theme);
  const [showRailLegend, setShowRailLegend] = useState(false);
  const activeLegendGoals = useMemo(() => {
    const goals = new Set<DawnCabinetSetKind | 'hidden'>();
    puzzle.lines.forEach((line) => {
      if (line.goal === 'hidden') goals.add('hidden');
      else goals.add(line.goal);
    });
    getLedgerKinds(puzzle).forEach((kind) => goals.add(kind));
    if (puzzle.bankGoal) goals.add(puzzle.bankGoal.type);
    return goals;
  }, [puzzle]);
  const railLegendItems = useMemo(
    () => RAIL_LEGEND_ITEMS.filter((item) => activeLegendGoals.has(item.goal)),
    [activeLegendGoals]
  );
  const protectedTileInfoRects = useMemo(() => {
    return puzzle.cells.flatMap((cell) => {
      const key = cellKey(cell.row, cell.col);
      if (!placements[key]) return [];
      const x = padding + cell.col * (cellSize + gap);
      const y = padding + cell.row * (cellSize + gap);
      return [
        {
          x1: x + cellSize * 0.2,
          y1: y + cellSize * 0.02,
          x2: x + cellSize * 0.8,
          y2: y + cellSize * 0.34,
        },
        {
          x1: x + cellSize * 0.2,
          y1: y + cellSize * 0.34,
          x2: x + cellSize * 0.8,
          y2: y + cellSize * 0.7,
        },
        {
          x1: x + cellSize * 0.08,
          y1: y + cellSize * 0.72,
          x2: x + cellSize * 0.92,
          y2: y + cellSize * 0.98,
        },
      ];
    });
  }, [cellSize, gap, padding, placements, puzzle.cells]);

  useEffect(() => {
    setShowRailLegend(false);
  }, [selectedCell]);

  const centerFor = (cell: string) => {
    const [row, col] = cell.split(':').map(Number);
    return {
      x: padding + col * (cellSize + gap) + cellSize / 2,
      y: padding + row * (cellSize + gap) + cellSize / 2,
    };
  };

  const lineColor = (state: DawnCabinetLineState) => {
    if (state === 'valid') return theme.colors.success;
    if (state === 'invalid') return theme.colors.error;
    return accent.main;
  };

  const rectIntersectionArea = (left: BoardRect, right: BoardRect) => {
    const width = Math.max(0, Math.min(left.x2, right.x2) - Math.max(left.x1, right.x1));
    const height = Math.max(0, Math.min(left.y2, right.y2) - Math.max(left.y1, right.y1));
    return width * height;
  };

  const rectForLabel = (point: BoardPoint, size: number): BoardRect => ({
    x1: point.x - size / 2,
    y1: point.y - size / 2,
    x2: point.x + size / 2,
    y2: point.y + size / 2,
  });

  const labelCandidatesForSegment = (start: BoardPoint, end: BoardPoint, labelSize: number) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
    const normal = { x: -dy / length, y: dx / length };
    const offset = Math.min(4, labelSize * 0.2);
    const at = (t: number, multiplier = 0) => {
      return {
        x: start.x + dx * t + normal.x * offset * multiplier,
        y: start.y + dy * t + normal.y * offset * multiplier,
      };
    };
    return [
      at(0.5, 0),
      at(0.35, 0),
      at(0.65, 0),
      at(0.42, 0),
      at(0.58, 0),
      at(0.25, 0),
      at(0.75, 0),
      at(0.5, 1),
      at(0.5, -1),
      at(0.35, 1),
      at(0.65, -1),
      at(0.35, -1),
      at(0.65, 1),
    ];
  };

  const labelFor = (
    lineCells: string[],
    points: BoardPoint[],
    labelSize: number,
    placedLabelRects: BoardRect[]
  ) => {
    const selectedIndex = selectedCell ? lineCells.indexOf(selectedCell) : -1;
    const segmentIndexes = points.slice(1).map((_, index) => index);
    const orderedSegmentIndexes =
      selectedIndex >= 0
        ? [
            ...segmentIndexes.filter((index) => index === selectedIndex || index === selectedIndex - 1),
            ...segmentIndexes.filter((index) => index !== selectedIndex && index !== selectedIndex - 1),
          ]
        : segmentIndexes;
    const candidates = orderedSegmentIndexes.flatMap((index, segmentPriority) => {
      return labelCandidatesForSegment(points[index], points[index + 1], labelSize).map((point, pointPriority) => ({
        point,
        priority: segmentPriority * 12 + pointPriority,
      }));
    });
    const fallbackPoint = candidates[0]?.point ?? points[0] ?? { x: padding, y: padding };
    let best = {
      point: fallbackPoint,
      score: Number.POSITIVE_INFINITY,
      rect: rectForLabel(fallbackPoint, labelSize),
    };
    candidates.forEach((candidate) => {
      const rect = rectForLabel(candidate.point, labelSize);
      const outOfBounds =
        rect.x1 < 2 || rect.y1 < 2 || rect.x2 > boardWidth - 2 || rect.y2 > boardHeight - 2;
      const protectedOverlap = protectedTileInfoRects.reduce(
        (total, protectedRect) => total + rectIntersectionArea(rect, protectedRect),
        0
      );
      const labelOverlap = placedLabelRects.reduce(
        (total, placedRect) => total + rectIntersectionArea(rect, placedRect),
        0
      );
      const score =
        (outOfBounds ? 100000 : 0) +
        protectedOverlap * 24 +
        labelOverlap * 8 +
        candidate.priority;
      if (score < best.score) {
        best = { point: candidate.point, score, rect };
      }
    });
    placedLabelRects.push(best.rect);
    return best.point;
  };

  return (
    <View style={styles.boardColumn}>
      <View style={[styles.boardWrap, { width: boardWidth, height: boardHeight }]}>
        <Svg width={boardWidth} height={boardHeight} style={StyleSheet.absoluteFill}>
          {puzzle.lines.map((line) => {
            const state = getCabinetLineState(line, placements);
            const visualState =
              line.goal === 'hidden' && state === 'valid' && !revealHiddenRails
                ? 'incomplete'
                : state;
            const isRailHighlighted = selectedCellLineIDs.has(line.id);
            const isRailDimmed = Boolean(selectedCell) && !isRailHighlighted;
            const points = line.cells.map(centerFor);
            const color = lineColor(visualState);
            const railStrokeWidth = isRailHighlighted ? 10 : visualState === 'incomplete' ? 5 : 7;
            const railStrokeOpacity = isRailHighlighted
              ? visualState === 'incomplete'
                ? 0.82
                : 0.96
              : isRailDimmed
                ? 0.08
                : visualState === 'incomplete'
                  ? 0.2
                  : 0.48;
            const railNodeOpacity = isRailHighlighted
              ? 1
              : isRailDimmed
                ? 0.12
                : visualState === 'incomplete'
                  ? 0.28
                  : 0.62;
            return (
              <G key={line.id}>
                {isRailHighlighted
                  ? points.slice(1).map((point, index) => (
                      <Line
                        key={`${line.id}-glow-${index}`}
                        x1={points[index].x}
                        y1={points[index].y}
                        x2={point.x}
                        y2={point.y}
                        stroke={color}
                        strokeWidth={18}
                        strokeOpacity={0.18}
                        strokeLinecap="round"
                      />
                    ))
                  : null}
                {points.slice(1).map((point, index) => (
                  <Line
                    key={`${line.id}-segment-${index}`}
                    x1={points[index].x}
                    y1={points[index].y}
                    x2={point.x}
                    y2={point.y}
                    stroke={color}
                    strokeWidth={railStrokeWidth}
                    strokeOpacity={railStrokeOpacity}
                    strokeLinecap="round"
                  />
                ))}
                {points.map((point, index) => (
                  <Circle
                    key={`${line.id}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={isRailHighlighted ? 4.5 : 3}
                    fill={color}
                    opacity={railNodeOpacity}
                  />
                ))}
              </G>
            );
          })}
        </Svg>

        <View style={[styles.boardGrid, { padding, gap }]}>
          {Array.from({ length: puzzle.rows }, (_, row) => (
            <View key={`row-${row}`} style={[styles.boardRow, { gap }]}>
              {Array.from({ length: puzzle.columns }, (_, col) => {
                const key = cellKey(row, col);
                const tile = placements[key];
                const isActive = activeCells.has(key);
                const isGiven = Boolean(puzzle.givens[key]);
                const isPlaced = Boolean(placedEntryIdsByCell[key]);
                const placedEntry = placedEntryIdsByCell[key] ? bankByID.get(placedEntryIdsByCell[key]) : undefined;
                const isDawnPlaced = placedEntry?.kind === 'dawn' && !revealHiddenRails;
                const isSelected = selectedCell === key;
                const isRailRelated = selectedCellRailCells.has(key);
                const isRailDimmedCell = Boolean(selectedCell) && !isRailRelated && !isSelected;
                if (!isActive) {
                  return (
                    <View
                      key={key}
                      style={[styles.cellButton, styles.inactiveCell, { width: cellSize, height: cellSize }]}
                    />
                  );
                }

                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityLabel={`Cabinet cell ${row + 1}, ${col + 1}`}
                    testID={`dawn-cabinet.cell.${key}`}
                    style={[
                      styles.cellButton,
                      { width: cellSize, height: cellSize },
                      isGiven && styles.givenCell,
                      isPlaced && styles.placedCell,
                      isRailRelated && styles.railRelatedCell,
                      selectedEntryID && !tile && !isGiven && styles.readyCell,
                      isSelected && styles.selectedCell,
                      isRailDimmedCell && styles.unfocusedCell,
                    ]}
                    onPress={() => onCellPress(key)}
                  >
                    {isDawnPlaced && placedEntry?.kind === 'dawn' ? (
                      <DawnTile
                        dawnTile={placedEntry.dawnTile}
                        styles={styles}
                        size={cellSize < 58 ? 'compact' : 'large'}
                      />
                    ) : tile ? (
                      <MahjongTile
                        tile={tile}
                        styles={styles}
                        size={cellSize < 58 ? 'compact' : 'large'}
                        given={isGiven}
                      />
                    ) : (
                      <View style={styles.emptySlot}>
                        <Text style={styles.emptySlotText}>+</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <Svg
          width={boardWidth}
          height={boardHeight}
          style={[StyleSheet.absoluteFill, styles.railLabelOverlay]}
          pointerEvents="none"
        >
          {(() => {
            const placedLabelRects: BoardRect[] = [];
            return puzzle.lines.map((line) => {
              const state = getCabinetLineState(line, placements);
              const visualState =
                line.goal === 'hidden' && state === 'valid' && !revealHiddenRails
                  ? 'incomplete'
                  : state;
              const isRailHighlighted = selectedCellLineIDs.has(line.id);
              const isRailDimmed = Boolean(selectedCell) && !isRailHighlighted;
              const points = line.cells.map(centerFor);
              const color = lineColor(visualState);
              const labelSize = isRailHighlighted ? 22 : 18;
              const labelPoint = labelFor(line.cells, points, labelSize, placedLabelRects);
              const labelOpacity = isRailHighlighted
                ? 1
                : isRailDimmed
                  ? 0.34
                  : visualState === 'incomplete'
                    ? 0.88
                    : 0.94;
              const labelFill = isRailHighlighted ? color : theme.colors.surface;
              const textFill = isRailHighlighted ? '#ffffff' : color;
              return (
                <G key={`${line.id}-label`}>
                  <Circle
                    cx={labelPoint.x}
                    cy={labelPoint.y}
                    r={labelSize / 2 + 3}
                    fill={theme.mode === 'dark' ? '#071018' : '#ffffff'}
                    opacity={isRailDimmed ? 0.34 : 0.86}
                  />
                  <Circle
                    cx={labelPoint.x}
                    cy={labelPoint.y}
                    r={labelSize / 2}
                    fill={labelFill}
                    stroke={color}
                    strokeWidth={isRailHighlighted ? 2.2 : 1.7}
                    opacity={labelOpacity}
                  />
                  <SvgText
                    x={labelPoint.x}
                    y={labelPoint.y + (isRailHighlighted ? 4.2 : 3.4)}
                    fill={textFill}
                    fontSize={isRailHighlighted ? 12 : 10}
                    fontWeight="900"
                    textAnchor="middle"
                    opacity={isRailDimmed ? 0.78 : 1}
                  >
                    {lineGoalShortLabel(line.goal)}
                  </SvgText>
                </G>
              );
            });
          })()}
        </Svg>
      </View>
      {selectedCellLines.length > 0 ? (
        <View style={[styles.railFocusStrip, { width: boardWidth }]}>
          <View style={styles.railFocusHeader}>
            <Text style={styles.railFocusTitle}>Attached rails</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showRailLegend ? 'Hide set type legend' : 'Show set type legend'}
              style={({ pressed }) => [
                styles.railFocusInfoButton,
                showRailLegend && styles.railFocusInfoButtonActive,
                pressed && styles.bankTilePressed,
              ]}
              onPress={() => setShowRailLegend((current) => !current)}
            >
              <Text
                style={[
                  styles.railFocusInfoText,
                  showRailLegend && styles.railFocusInfoTextActive,
                ]}
              >
                i
              </Text>
            </Pressable>
          </View>
          <View style={styles.railFocusItems}>
            {selectedCellLines.map((line) => {
              const state = getCabinetLineState(line, placements);
              const visualState =
                line.goal === 'hidden' && state === 'valid' && !revealHiddenRails
                  ? 'incomplete'
                  : state;
              const color = lineColor(visualState);
              return (
                <View key={line.id} style={styles.railFocusItem}>
                  <View style={[styles.railFocusBadge, { borderColor: color, backgroundColor: color }]}>
                    <Text style={styles.railFocusBadgeText}>{lineGoalShortLabel(line.goal)}</Text>
                  </View>
                  <Text style={styles.railFocusText}>
                    {line.goal === 'hidden' ? 'Hidden ?' : lineGoalLabel(line.goal)}
                  </Text>
                </View>
              );
            })}
          </View>
          {showRailLegend ? (
            <View style={styles.railLegendGrid}>
              {railLegendItems.map((item) => (
                <View key={item.goal} style={styles.railLegendItem}>
                  <View style={styles.railLegendCode}>
                    <Text style={styles.railLegendCodeText}>{lineGoalShortLabel(item.goal)}</Text>
                  </View>
                  <View style={styles.railLegendCopy}>
                    <Text style={styles.railLegendTitle}>
                      {item.goal === 'hidden' ? 'Hidden' : lineGoalLabel(item.goal)}
                    </Text>
                    <Text style={styles.railLegendDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function MahjongTile({
  tile,
  styles,
  size,
  muted,
  selected,
  given,
  totalCount,
  remainingCount,
}: {
  tile: DawnCabinetTile;
  styles: ReturnType<typeof createStyles>;
  size: TileRenderSize;
  muted?: boolean;
  selected?: boolean;
  given?: boolean;
  totalCount?: number;
  remainingCount?: number;
}) {
  const showCopyPips = size === 'small' && Boolean(totalCount && totalCount > 1);
  const isSmall = size !== 'large';

  return (
    <View
      style={[
        styles.mahjongTile,
        size === 'small' && styles.mahjongTileSmall,
        size === 'compact' && styles.mahjongTileCompact,
        muted && styles.mahjongTileMuted,
        selected && styles.mahjongTileSelected,
        given && styles.mahjongTileGiven,
      ]}
    >
      <View style={[styles.tileRankSlot, isSmall && styles.tileRankSlotSmall, size === 'compact' && styles.tileRankSlotCompact]}>
        <Text style={[styles.tileRank, isSmall && styles.tileRankSmall, size === 'compact' && styles.tileRankCompact]}>{tile.rank}</Text>
      </View>
      <View style={[styles.tileSuitSlot, isSmall && styles.tileSuitSlotSmall, size === 'compact' && styles.tileSuitSlotCompact]}>
        <SuitMark suit={tile.suit} styles={styles} tileSize={size} />
      </View>
      <View style={[styles.tileSuitLabelSlot, isSmall && styles.tileSuitLabelSlotSmall, size === 'compact' && styles.tileSuitLabelSlotCompact]}>
        <Text style={[styles.tileSuitText, isSmall && styles.tileSuitTextSmall, size === 'compact' && styles.tileSuitTextCompact]}>
          {suitShortLabel(tile.suit)}
        </Text>
      </View>
      <View style={[styles.copyPipSlot, !showCopyPips && styles.copyPipSlotEmpty]}>
        {showCopyPips ? (
          <View style={styles.copyPipRow}>
            {Array.from({ length: totalCount ?? 0 }, (_, index) => (
              <View
                key={`${tileKey(tile)}-pip-${index}`}
                style={[
                  styles.copyPip,
                  index >= (remainingCount ?? 0) && styles.copyPipSpent,
                ]}
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function DawnTile({
  dawnTile,
  styles,
  size,
  muted,
  selected,
}: {
  dawnTile: DawnCabinetDawnTile;
  styles: ReturnType<typeof createStyles>;
  size: TileRenderSize;
  muted?: boolean;
  selected?: boolean;
}) {
  const variant = getDawnVariantIndex(dawnTile);
  const isSmall = size !== 'large';
  return (
    <View
      style={[
        styles.mahjongTile,
        styles.dawnTile,
        size === 'small' && styles.mahjongTileSmall,
        size === 'compact' && styles.mahjongTileCompact,
        muted && styles.mahjongTileMuted,
        selected && styles.mahjongTileSelected,
      ]}
    >
      <View style={[styles.dawnIconSlot, isSmall && styles.dawnIconSlotSmall]}>
        <DawnVariantMark variant={variant} styles={styles} size={size} />
      </View>
      <View style={[styles.dawnTitleSlot, isSmall && styles.dawnTitleSlotSmall]}>
        <Text style={[styles.dawnTileTitle, isSmall && styles.dawnTileTitleSmall]}>Dawn</Text>
      </View>
    </View>
  );
}

function DawnCandidateChips({
  dawnTile,
  styles,
  compact,
  leftAligned,
}: {
  dawnTile: DawnCabinetDawnTile;
  styles: ReturnType<typeof createStyles>;
  compact?: boolean;
  leftAligned?: boolean;
}) {
  return (
    <View style={[styles.dawnCandidateRow, compact && styles.dawnCandidateRowCompact, leftAligned && styles.dawnCandidateRowLeft]}>
      {dawnTile.options.map((tile) => (
        <View key={`${dawnTile.id}-${tileKey(tile)}`} style={[styles.dawnCandidateChip, compact && styles.dawnCandidateChipCompact]}>
          <Text style={[styles.dawnCandidateRank, compact && styles.dawnCandidateRankCompact]}>{tile.rank}</Text>
          <SuitMark suit={tile.suit} styles={styles} tileSize="micro" />
        </View>
      ))}
    </View>
  );
}

function DawnFilterNote({
  dawnTile,
  styles,
}: {
  dawnTile: DawnCabinetDawnTile;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.dawnFilterNote}>
      <View style={styles.dawnFilterNoteCopy}>
        <Text style={styles.dawnFilterNoteTitle}>Today's Dawn Tile</Text>
        <Text style={styles.dawnFilterNoteText}>Can be used as any of these tiles:</Text>
        <DawnCandidateChips dawnTile={dawnTile} styles={styles} leftAligned />
        <Text style={styles.dawnFilterNoteText}>Must be placed on the board.</Text>
      </View>
    </View>
  );
}

function DawnVariantMark({
  variant,
  styles,
  size,
}: {
  variant: number;
  styles: ReturnType<typeof createStyles>;
  size: TileRenderSize;
}) {
  return (
    <View style={[styles.dawnTileMark, size !== 'large' && styles.dawnTileMarkSmall]}>
      <DawnTileMark variant={variant} />
    </View>
  );
}

function SuitMark({
  suit,
  styles,
  compact,
  tileSize,
}: {
  suit: DawnCabinetTile['suit'];
  styles: ReturnType<typeof createStyles>;
  compact?: boolean;
  tileSize?: SuitMarkSize;
}) {
  const color = SUIT_MARK_COLORS[suit];
  const resolvedSize = tileSize ?? (compact ? 'compact' : 'large');
  const icon = suit === 'bamboo' ? (
    <View style={styles.bambooMark}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={[styles.bambooStem, { backgroundColor: color, borderColor: '#0f6143' }]} />
      ))}
    </View>
  ) : suit === 'dots' ? (
    <View style={[styles.dotMark, { borderColor: color }]}>
      <View style={styles.dotInner} />
    </View>
  ) : suit === 'characters' ? (
    <View style={[styles.characterMark, { backgroundColor: color }]}>
      <Text style={styles.characterMarkText}>C</Text>
    </View>
  ) : suit === 'coins' ? (
    <View style={[styles.coinMark, { borderColor: color }]}>
      <View style={[styles.coinHole, { borderColor: color }]} />
    </View>
  ) : suit === 'lotus' ? (
    <View style={styles.lotusMark}>
      {[styles.lotusPetalTop, styles.lotusPetalRight, styles.lotusPetalBottom, styles.lotusPetalLeft].map((style, index) => (
        <View key={index} style={[styles.lotusPetal, style, { backgroundColor: color }]} />
      ))}
      <View style={styles.lotusCenter} />
    </View>
  ) : suit === 'jade' ? (
    <View style={[styles.jadeMark, { borderColor: color }]}>
      <View style={[styles.jadeCore, { backgroundColor: color }]} />
    </View>
  ) : suit === 'clouds' ? (
    <View style={styles.cloudMark}>
      <View style={[styles.cloudPuff, styles.cloudPuffLeft, { backgroundColor: color }]} />
      <View style={[styles.cloudPuff, styles.cloudPuffCenter, { backgroundColor: color }]} />
      <View style={[styles.cloudPuff, styles.cloudPuffRight, { backgroundColor: color }]} />
      <View style={[styles.cloudBase, { backgroundColor: color }]} />
    </View>
  ) : suit === 'stars' ? (
    <View style={styles.starMark}>
      <View style={[styles.starArmVertical, { backgroundColor: color }]} />
      <View style={[styles.starArmHorizontal, { backgroundColor: color }]} />
      <View style={[styles.starCore, { backgroundColor: color }]} />
    </View>
  ) : suit === 'waves' ? (
    <View style={styles.waveMark}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={[styles.waveLine, { backgroundColor: color, width: item === 1 ? 24 : 18 }]} />
      ))}
    </View>
  ) : suit === 'knots' ? (
    <View style={styles.knotMark}>
      <View style={[styles.knotLoop, styles.knotLoopLeft, { borderColor: color }]} />
      <View style={[styles.knotLoop, styles.knotLoopRight, { borderColor: color }]} />
      <View style={[styles.knotBand, { backgroundColor: color }]} />
    </View>
  ) : suit === 'moons' ? (
    <View style={[styles.moonMark, { backgroundColor: color }]}>
      <View style={styles.moonCutout} />
    </View>
  ) : suit === 'suns' ? (
    <View style={styles.sunMark}>
      <View style={[styles.sunRayVertical, { backgroundColor: color }]} />
      <View style={[styles.sunRayHorizontal, { backgroundColor: color }]} />
      <View style={[styles.sunCore, { backgroundColor: color }]} />
    </View>
  ) : suit === 'lanterns' ? (
    <View style={styles.lanternMark}>
      <View style={[styles.lanternCap, { backgroundColor: color }]} />
      <View style={[styles.lanternBody, { borderColor: color }]}>
        <View style={[styles.lanternGlow, { backgroundColor: color }]} />
      </View>
      <View style={[styles.lanternBase, { backgroundColor: color }]} />
    </View>
  ) : (
    <View style={styles.sparkMark}>
      <View style={[styles.sparkArmVertical, { backgroundColor: color }]} />
      <View style={[styles.sparkArmHorizontal, { backgroundColor: color }]} />
      <View style={[styles.sparkDiamond, { borderColor: color }]} />
    </View>
  );

  return (
    <View
      style={[
        styles.suitIcon,
        resolvedSize === 'small' && styles.suitIconSmall,
        resolvedSize === 'compact' && styles.suitIconCompact,
        resolvedSize === 'micro' && styles.suitIconMicro,
      ]}
    >
      <View
        style={[
          styles.suitMarkArt,
          resolvedSize === 'small' && styles.suitMarkArtSmall,
          resolvedSize === 'compact' && styles.suitMarkArtCompact,
          resolvedSize === 'micro' && styles.suitMarkArtMicro,
        ]}
      >
        {icon}
      </View>
    </View>
  );
}

function TutorialModal({
  visible,
  onClose,
  onStartDaily,
  onPracticeEasy,
  styles,
}: {
  visible: boolean;
  onClose: () => void;
  onStartDaily: () => void;
  onPracticeEasy: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const tutorial = useMemo(() => makeTutorialPuzzle(), []);
  const runTiles = [
    { suit: 'bamboo', rank: 2 },
    { suit: 'bamboo', rank: 3 },
    { suit: 'bamboo', rank: 4 },
  ] satisfies DawnCabinetTile[];
  const matchTiles = [
    { suit: 'dots', rank: 6 },
    { suit: 'dots', rank: 6 },
    { suit: 'dots', rank: 6 },
  ] satisfies DawnCabinetTile[];
  const mixedRunTiles = [
    { suit: 'bamboo', rank: 3 },
    { suit: 'dots', rank: 4 },
    { suit: 'characters', rank: 5 },
  ] satisfies DawnCabinetTile[];
  const gapRunTiles = [
    { suit: 'bamboo', rank: 2 },
    { suit: 'bamboo', rank: 4 },
    { suit: 'bamboo', rank: 6 },
  ] satisfies DawnCabinetTile[];
  const mixedGapTiles = [
    { suit: 'bamboo', rank: 1 },
    { suit: 'dots', rank: 3 },
    { suit: 'characters', rank: 5 },
  ] satisfies DawnCabinetTile[];
  const pairTiles = [
    { suit: 'characters', rank: 8 },
    { suit: 'characters', rank: 8 },
  ] satisfies DawnCabinetTile[];
  const flushTiles = [
    { suit: 'bamboo', rank: 1 },
    { suit: 'bamboo', rank: 4 },
    { suit: 'bamboo', rank: 7 },
  ] satisfies DawnCabinetTile[];
  const numberTiles = [
    { suit: 'bamboo', rank: 5 },
    { suit: 'dots', rank: 5 },
    { suit: 'characters', rank: 5 },
  ] satisfies DawnCabinetTile[];
  const dawnLessonTile = {
    id: 'rules-dawn-tile',
    solutionCell: cellKey(0, 0),
    resolvedTile: { suit: 'dots', rank: 8 },
    options: [
      { suit: 'dots', rank: 8 },
      { suit: 'sparks', rank: 5 },
      { suit: 'sparks', rank: 9 },
    ],
  } satisfies DawnCabinetDawnTile;
  const quickStartRules = [
    'The Cabinet is your tile supply. Place tiles from it onto the board.',
    'Only tiles joined by a rail belong to the same set.',
    'A crossing tile must satisfy every rail that passes through it.',
    '? rails are mystery rails. Cabinet progress tells you how many hidden sets of each type you still need.',
  ];
  const cabinetRules = [
    'Copy tiles show how many identical Cabinet tiles remain.',
    'Reserve tells you which tiles, if any, should be left after the board is complete.',
    'The Dawn Tile can be used as one of its shown values, but it must be placed on the board.',
    'Tap a cell to spotlight every rail that uses it.',
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalScrim}>
        <ScrollView
          style={styles.modalCard}
          contentContainerStyle={styles.modalCardContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalKicker}>How to Play</Text>
          <View style={styles.objectiveCard}>
            <Text style={styles.objectiveTitle}>Objective</Text>
            <Text style={styles.objectiveText}>
              Complete Dawn Cabinet by placing Cabinet tiles so every rail forms its required set,
              hidden rail counts balance, and only the listed reserve remains.
            </Text>
          </View>
          <Text style={styles.modalTitle}>Quick Start</Text>

          <View style={styles.rulesList}>
            <Text style={styles.ruleListTitle}>Cabinet Basics</Text>
            {quickStartRules.map((rule) => (
              <View key={rule} style={styles.ruleItem}>
                <View style={styles.ruleBullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tutorialGrid}>
            <View style={styles.tutorialGridStage}>
              <Svg width={172} height={208} style={styles.tutorialRailSvg} pointerEvents="none">
                <Line
                  x1={27}
                  y1={33}
                  x2={145}
                  y2={33}
                  stroke="#c87820"
                  strokeWidth={9}
                  strokeOpacity={0.82}
                  strokeLinecap="round"
                />
                {[27, 86, 145].map((x) => (
                  <Circle key={`tutorial-rail-dot-${x}`} cx={x} cy={33} r={4} fill="#c87820" />
                ))}
                <Circle cx={86} cy={33} r={13} fill="#c87820" />
                <SvgText
                  x={86}
                  y={37}
                  fill="#fffaf0"
                  fontSize={11}
                  fontWeight="900"
                  textAnchor="middle"
                >
                  R
                </SvgText>
              </Svg>
              {Array.from({ length: tutorial.rows }, (_, row) => (
                <View key={`tutorial-row-${row}`} style={styles.tutorialGridRow}>
                  {Array.from({ length: tutorial.columns }, (_, col) => {
                    const key = cellKey(row, col);
                    const tile = tutorial.givens[key];
                    return (
                      <View key={key} style={styles.tutorialCell}>
                        {tile ? (
                          <MahjongTile tile={tile} styles={styles} size="small" given />
                        ) : (
                          <Text style={styles.tutorialBlank}>+</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
            <Text style={styles.tutorialRailCaption}>The rail marks one set across the cabinet.</Text>
          </View>

          <Text style={styles.modalTitle}>Rail Types</Text>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {runTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Run</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>All</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three consecutive ranks, all in one suit.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {matchTiles.map((tile, index) => (
                <MahjongTile key={`${tileKey(tile)}-${index}`} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Match</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>All</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three identical tiles.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {mixedRunTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Mixed Run</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>All</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three consecutive ranks, each in a different suit.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {pairTiles.map((tile, index) => (
                <MahjongTile key={`${tileKey(tile)}-${index}`} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Pair</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>All</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Two identical tiles.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {flushTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Flush</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>All</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three tiles in one suit, but not a Run, Gap Run, or Match.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {gapRunTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Gap Run</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>Hard+</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three same-suit ranks stepping by two.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {numberTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Number Set</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>Hard+</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three suits sharing the same rank.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {mixedGapTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Mixed Gap</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>Expert</Text>
                </View>
              </View>
              <Text style={styles.lessonText}>Three different suits stepping by two ranks.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              <DawnTile dawnTile={dawnLessonTile} styles={styles} size="small" />
            </View>
            <View style={styles.lessonCopy}>
              <View style={styles.lessonTitleRow}>
                <Text style={styles.lessonTitle}>Dawn Tile</Text>
                <View style={styles.lessonDifficultyBadge}>
                  <Text style={styles.lessonDifficultyText}>Hard+</Text>
                </View>
              </View>
              <DawnCandidateChips dawnTile={dawnLessonTile} styles={styles} leftAligned />
              <Text style={styles.lessonText}>Can be used as one of its shown values, but must be placed on the board.</Text>
            </View>
          </View>

          <Text style={styles.modalTitle}>Cabinet Details</Text>
          <View style={styles.rulesList}>
            <Text style={styles.ruleListTitle}>During Play</Text>
            {cabinetRules.map((rule) => (
              <View key={rule} style={styles.ruleItem}>
                <View style={styles.ruleBullet} />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.lessonText}>
            The best moves resolve more than one rail at once.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start today's Dawn Cabinet"
            testID="dawn-cabinet.start"
            style={({ pressed }) => [styles.modalButton, pressed && styles.primaryButtonPressed]}
            onPress={onStartDaily}
          >
            <Text style={styles.modalButtonText}>Start Today</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close rules"
            style={({ pressed }) => [styles.modalSecondaryButton, pressed && styles.buttonPressed]}
            onPress={onClose}
          >
            <Text style={styles.modalSecondaryButtonText}>Close</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Practice a small Dawn Cabinet"
            testID="dawn-cabinet.practice-easy"
            style={({ pressed }) => [styles.modalSecondaryButton, pressed && styles.buttonPressed]}
            onPress={onPracticeEasy}
          >
            <Text style={styles.modalSecondaryButtonText}>Practice a Small Cabinet</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const createStyles = (
  theme: ThemeTokens,
  screenAccent: ReturnType<typeof resolveScreenAccent>
) => {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const FontSize = theme.fontSize;
  const BorderRadius = theme.borderRadius;
  const ui = createDaybreakPrimitives(theme, screenAccent);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollView: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    scrollContentWithMobileTray: {
      paddingBottom: 324,
    },
    page: {
      ...ui.page,
    },
    startPage: {
      gap: Spacing.lg,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    startHero: {
      gap: Spacing.xs,
      paddingBottom: Spacing.xs,
    },
    startAccentTiles: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginTop: Spacing.md,
      minHeight: 76,
    },
    startAccentTile: {
      width: 58,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ rotate: '-3deg' }],
    },
    startAccentTileRaised: {
      transform: [{ translateY: -5 }, { rotate: '3deg' }],
    },
    startHowCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      gap: Spacing.xs,
    },
    startHowTitle: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    startHowStep: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    startHowNumber: {
      width: 22,
      height: 22,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    startHowNumberText: {
      color: screenAccent.main,
      fontSize: 11,
      fontWeight: '900',
      lineHeight: 13,
    },
    startHowText: {
      flex: 1,
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 19,
      fontWeight: '800',
    },
    difficultyCardRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      width: '100%',
    },
    difficultyCard: {
      flex: 1,
      minWidth: 0,
      minHeight: 148,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.sm,
      justifyContent: 'space-between',
      ...WEB_NO_SELECT,
    },
    difficultyCardHeader: {
      gap: Spacing.xs,
      alignItems: 'flex-start',
    },
    difficultyCardSelected: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    difficultyCardTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
    difficultyCardTitleSelected: {
      color: screenAccent.main,
    },
    difficultyRecommendedBadge: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
      maxWidth: '100%',
    },
    difficultyRecommendedText: {
      color: Colors.white,
      fontSize: 9,
      lineHeight: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    difficultyCardText: {
      color: Colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '800',
      marginTop: Spacing.sm,
    },
    startSummaryBox: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      padding: Spacing.md,
      gap: Spacing.xs,
    },
    startSummaryTitle: {
      color: screenAccent.badgeText,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
    startSummaryText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '700',
    },
    startActionRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    practiceButton: {
      minHeight: 48,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    practiceButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    header: {
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
    },
    playHeader: {
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.md,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    backButton: {
      alignSelf: 'flex-start',
      ...ui.pill,
      marginBottom: Spacing.lg,
      ...WEB_NO_SELECT,
    },
    playBackButton: {
      marginBottom: 0,
    },
    backButtonPressed: {
      backgroundColor: screenAccent.soft,
      transform: [{ scale: 0.98 }],
    },
    backButtonText: {
      color: Colors.textSecondary,
      fontWeight: '700',
    },
    titleBlock: {
      gap: Spacing.xs,
    },
    kicker: {
      color: screenAccent.main,
      fontSize: FontSize.sm,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 1.1,
    },
    title: {
      fontSize: 42,
      fontWeight: '900',
      color: Colors.text,
    },
    subtitle: {
      fontSize: FontSize.md,
      color: Colors.textMuted,
      lineHeight: 23,
      maxWidth: 450,
    },
    playTitleBlock: {
      flex: 1,
      minWidth: 168,
    },
    playTitle: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '900',
    },
    playSubtitle: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '800',
      marginTop: 2,
    },
    playStatusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      justifyContent: 'flex-end',
    },
    statusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    statusPill: {
      ...ui.pill,
      backgroundColor: screenAccent.badgeBg,
      borderColor: screenAccent.badgeBorder,
    },
    statusPillText: {
      color: screenAccent.badgeText,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    demoPanel: {
      marginTop: Spacing.md,
      gap: Spacing.xs,
    },
    demoLabel: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    demoToggleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    demoToggleButton: {
      minHeight: 34,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    demoToggleButtonSelected: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.main,
    },
    demoToggleText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
    demoToggleTextSelected: {
      color: Colors.white,
    },
    winCard: {
      ...ui.card,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderColor: Colors.success,
      backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.16)' : '#eefbf2',
    },
    winTitle: {
      color: Colors.success,
      fontSize: FontSize.lg,
      fontWeight: '900',
    },
    winText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      marginTop: Spacing.xs,
      fontWeight: '700',
    },
    shareCard: {
      marginTop: Spacing.md,
      width: '100%',
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    shareTitle: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: Colors.text,
    },
    shareBox: {
      marginTop: Spacing.sm,
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.sm,
    },
    shareText: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 18,
      fontWeight: '700',
    },
    shareButton: {
      marginTop: Spacing.sm,
      minHeight: 42,
      borderRadius: BorderRadius.md,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    shareButtonPressed: {
      opacity: 0.9,
    },
    shareButtonText: {
      color: Colors.white,
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
    shareStatus: {
      marginTop: Spacing.xs,
      fontSize: 12,
      color: Colors.textMuted,
      fontWeight: '700',
    },
    winHomeButton: {
      marginTop: Spacing.md,
      minHeight: 44,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    winLevelButton: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    winHomeButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    boardCard: {
      padding: Spacing.md,
      alignItems: 'center',
    },
    cabinetProgressPanel: {
      width: '100%',
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: Colors.line,
      gap: Spacing.sm,
    },
    cabinetProgressPanelCompact: {
      width: 'auto',
      minWidth: '100%',
      marginTop: Spacing.sm,
      paddingTop: Spacing.sm,
    },
    cabinetProgressWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    cabinetProgressScrollRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    cabinetProgressItem: {
      minWidth: 132,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      gap: 5,
    },
    cabinetReserveItem: {
      minWidth: 118,
      justifyContent: 'center',
    },
    cabinetProgressLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    cabinetProgressLabel: {
      color: Colors.textSecondary,
      fontSize: 11,
      fontWeight: '900',
    },
    cabinetProgressCount: {
      color: Colors.textMuted,
      fontSize: 11,
      fontWeight: '900',
    },
    cabinetProgressTrack: {
      height: 4,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(13,37,32,0.1)',
    },
    cabinetProgressFill: {
      height: '100%',
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
    },
    cabinetReserveText: {
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: '900',
      marginTop: 2,
    },
    cabinetProgressNotice: {
      color: Colors.error,
      fontSize: 12,
      fontWeight: '900',
      lineHeight: 17,
    },
    boardColumn: {
      alignItems: 'center',
      width: '100%',
    },
    boardWrap: {
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.mode === 'dark' ? '#101820' : '#f7faf6',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors.line,
    },
    boardGrid: {
      position: 'relative',
      zIndex: 2,
    },
    railLabelOverlay: {
      zIndex: 3,
    },
    boardRow: {
      flexDirection: 'row',
    },
    cellButton: {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.68)',
      borderWidth: 1,
      borderColor: Colors.line,
      ...WEB_NO_SELECT,
    },
    inactiveCell: {
      opacity: 0,
    },
    givenCell: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
    },
    placedCell: {
      borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.38)' : 'rgba(11,11,11,0.22)',
    },
    railRelatedCell: {
      borderColor: screenAccent.main,
      borderWidth: 2,
      backgroundColor: screenAccent.soft,
      shadowColor: screenAccent.main,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: theme.mode === 'dark' ? 0.28 : 0.16,
      shadowRadius: 5,
    },
    unfocusedCell: {
      opacity: 0.36,
    },
    readyCell: {
      borderColor: screenAccent.main,
      borderStyle: 'dashed',
      backgroundColor: screenAccent.soft,
    },
    selectedCell: {
      borderColor: screenAccent.main,
      borderWidth: 2,
      backgroundColor: screenAccent.soft,
    },
    emptySlot: {
      width: '72%',
      height: '72%',
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptySlotText: {
      color: Colors.textMuted,
      fontSize: FontSize.lg,
      fontWeight: '700',
    },
    boardMetaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    boardMetaText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '700',
    },
    boardWarningText: {
      color: Colors.error,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    railFocusStrip: {
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      gap: Spacing.xs,
    },
    railFocusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    railFocusTitle: {
      color: Colors.textMuted,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    railFocusInfoButton: {
      width: 24,
      height: 24,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    railFocusInfoButtonActive: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.main,
    },
    railFocusInfoText: {
      color: Colors.textSecondary,
      fontSize: 13,
      fontWeight: '900',
      lineHeight: 16,
    },
    railFocusInfoTextActive: {
      color: Colors.white,
    },
    railFocusItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    railFocusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingRight: Spacing.xs,
      paddingVertical: 2,
    },
    railFocusBadge: {
      width: 20,
      height: 20,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    railFocusBadgeText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: '900',
    },
    railFocusText: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: '900',
    },
    railLegendGrid: {
      marginTop: 2,
      paddingTop: Spacing.xs,
      borderTopWidth: 1,
      borderTopColor: Colors.line,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    railLegendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      minWidth: 136,
      flexGrow: 1,
      flexBasis: 136,
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderRadius: BorderRadius.sm,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.035)',
    },
    railLegendCode: {
      width: 20,
      height: 20,
      borderRadius: 999,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
    },
    railLegendCodeText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: '900',
    },
    railLegendCopy: {
      flex: 1,
      minWidth: 0,
    },
    railLegendTitle: {
      color: Colors.textSecondary,
      fontSize: 11,
      fontWeight: '900',
      lineHeight: 14,
    },
    railLegendDescription: {
      color: Colors.textMuted,
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 13,
    },
    bankSection: {
      ...ui.card,
      marginTop: Spacing.lg,
      padding: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
    },
    sectionMeta: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    bankGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    bankTileButton: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      padding: 4,
      ...WEB_NO_SELECT,
    },
    bankTileSelected: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
      transform: [{ translateY: -2 }],
    },
    bankTileUsed: {
      opacity: 0.28,
    },
    bankTilePressed: {
      transform: [{ scale: 0.96 }],
    },
    mobileBankTray: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: Colors.surface,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      ...theme.shadows.elevated,
    },
    mobileBankHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    mobileBankTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
    mobileBankMeta: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },
    suitFilterRow: {
      gap: Spacing.xs,
      paddingRight: Spacing.lg,
      paddingBottom: Spacing.xs,
    },
    suitFilterButton: {
      minHeight: 32,
      minWidth: 38,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    suitFilterButtonSelected: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.main,
    },
    suitFilterText: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: '900',
    },
    suitFilterTextSelected: {
      color: Colors.white,
    },
    suitFilterIconWrap: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    mobileBankScroller: {
      gap: Spacing.sm,
      paddingRight: Spacing.xl,
    },
    dawnFilterDetailCard: {
      marginBottom: Spacing.xs,
      minHeight: 98,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.line,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      ...WEB_NO_SELECT,
    },
    dawnFilterDetailTile: {
      width: 62,
      height: 76,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      flexShrink: 0,
    },
    dawnFilterNote: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },
    dawnFilterNoteCopy: {
      flex: 1,
      minWidth: 0,
      gap: 4,
    },
    dawnFilterNoteTitle: {
      color: Colors.text,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '900',
      letterSpacing: 0,
    },
    dawnFilterNoteText: {
      color: Colors.textSecondary,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '800',
    },
    mobileCabinetProgressScroller: {
      paddingRight: Spacing.xl,
    },
    mobileBankStack: {
      width: 66,
      height: 88,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 4,
      ...WEB_NO_SELECT,
    },
    stackCountBadge: {
      position: 'absolute',
      right: 3,
      top: 3,
      minWidth: 22,
      height: 18,
      paddingHorizontal: 4,
      borderRadius: 999,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stackCountText: {
      color: Colors.white,
      fontSize: 10,
      fontWeight: '900',
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginTop: Spacing.lg,
    },
    secondaryButton: {
      ...ui.pill,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      minWidth: 88,
      ...WEB_NO_SELECT,
    },
    secondaryButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
    primaryButton: {
      flex: 1.25,
      minHeight: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
      minWidth: 104,
      ...WEB_NO_SELECT,
    },
    primaryButtonPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.98 }],
    },
    buttonPressed: {
      backgroundColor: screenAccent.soft,
      transform: [{ scale: 0.98 }],
    },
    primaryButtonText: {
      color: Colors.white,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    messageCard: {
      ...ui.subtleCard,
      marginTop: Spacing.md,
      padding: Spacing.md,
    },
    messageText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '700',
      textAlign: 'center',
    },
    mahjongTile: {
      width: '86%',
      height: '90%',
      minWidth: 0,
      minHeight: 0,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(88,62,35,0.22)',
      backgroundColor: theme.mode === 'dark' ? '#f4efe5' : '#fffaf0',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
      paddingHorizontal: 2,
      paddingVertical: 2,
      shadowColor: '#000',
      shadowOpacity: theme.mode === 'dark' ? 0.22 : 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    mahjongTileSmall: {
      width: 52,
      height: 68,
      minWidth: 52,
      minHeight: 68,
      paddingVertical: 3,
    },
    mahjongTileCompact: {
      width: '84%',
      height: '88%',
      minWidth: 0,
      minHeight: 0,
      borderRadius: 7,
      paddingHorizontal: 1,
      paddingVertical: 1,
    },
    mahjongTileMuted: {
      opacity: 0.58,
    },
    mahjongTileSelected: {
      borderColor: screenAccent.main,
    },
    mahjongTileGiven: {
      backgroundColor: theme.mode === 'dark' ? '#fff8e9' : '#fff7e7',
    },
    dawnTile: {
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? '#fff4d7' : '#fff0cf',
    },
    dawnTitleSlot: {
      height: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 0,
    },
    dawnTitleSlotSmall: {
      height: 10,
    },
    dawnTileTitle: {
      color: '#7a4511',
      fontSize: 10,
      fontWeight: '900',
      lineHeight: 12,
    },
    dawnTileTitleSmall: {
      fontSize: 8,
      lineHeight: 10,
    },
    dawnIconSlot: {
      flex: 1,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 1,
      minHeight: 34,
      paddingTop: 5,
    },
    dawnIconSlotSmall: {
      height: 42,
      minHeight: 34,
      paddingTop: 5,
    },
    dawnTileMark: {
      width: 38,
      height: 38,
      borderRadius: 7,
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    dawnTileMarkSmall: {
      width: 34,
      height: 34,
      borderRadius: 5,
    },
    dawnCandidateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 3,
      width: '100%',
    },
    dawnCandidateRowLeft: {
      justifyContent: 'flex-start',
      width: 'auto',
      flexShrink: 1,
    },
    dawnCandidateRowCompact: {
      gap: 1,
    },
    dawnCandidateChip: {
      minWidth: 18,
      minHeight: 15,
      paddingHorizontal: 2,
      paddingVertical: 1,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: 'rgba(122,69,17,0.26)',
      backgroundColor: 'rgba(255,248,223,0.86)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
    },
    dawnCandidateChipCompact: {
      minWidth: 12,
      minHeight: 9,
      paddingHorizontal: 1,
      paddingVertical: 0,
      borderRadius: 3,
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    dawnCandidateRank: {
      color: '#221a12',
      fontSize: 9,
      lineHeight: 10,
      fontWeight: '900',
    },
    dawnCandidateRankCompact: {
      fontSize: 6,
      lineHeight: 7,
    },
    tileRankSlot: {
      height: 17,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 0,
    },
    tileRankSlotSmall: {
      height: 15,
    },
    tileRankSlotCompact: {
      height: 14,
    },
    tileRank: {
      color: '#221a12',
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 20,
    },
    tileRankSmall: {
      fontSize: 14,
      lineHeight: 15,
    },
    tileRankCompact: {
      fontSize: 13,
      lineHeight: 14,
    },
    tileSuitSlot: {
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 1,
      minHeight: 17,
    },
    tileSuitSlotSmall: {
      height: 20,
      minHeight: 16,
    },
    tileSuitSlotCompact: {
      height: 18,
      minHeight: 15,
    },
    tileSuitLabelSlot: {
      height: 9,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 0,
    },
    tileSuitLabelSlotSmall: {
      height: 8,
    },
    tileSuitLabelSlotCompact: {
      height: 8,
    },
    tileSuitText: {
      color: '#6b4e2d',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.8,
      lineHeight: 9,
    },
    tileSuitTextSmall: {
      fontSize: 7,
      lineHeight: 8,
      letterSpacing: 0.7,
    },
    tileSuitTextCompact: {
      fontSize: 6.5,
      lineHeight: 8,
      letterSpacing: 0.5,
    },
    copyPipSlot: {
      height: 6,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      flexShrink: 0,
    },
    copyPipSlotEmpty: {
      height: 0,
    },
    copyPipRow: {
      flexDirection: 'row',
      gap: 2,
    },
    copyPip: {
      width: 4.5,
      height: 4.5,
      borderRadius: 999,
      backgroundColor: '#6b4e2d',
      opacity: 0.9,
    },
    copyPipSpent: {
      opacity: 0.18,
    },
    suitIcon: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    suitIconSmall: {
      width: 20,
      height: 20,
    },
    suitIconCompact: {
      width: 18,
      height: 18,
    },
    suitIconMicro: {
      width: 9,
      height: 9,
    },
    suitMarkArt: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: 0.8 }],
    },
    suitMarkArtSmall: {
      transform: [{ scale: 0.66 }],
    },
    suitMarkArtCompact: {
      transform: [{ scale: 0.58 }],
    },
    suitMarkArtMicro: {
      transform: [{ scale: 0.3 }],
    },
    bambooMark: {
      flexDirection: 'row',
      gap: 3,
      height: 22,
      alignItems: 'center',
    },
    bambooStem: {
      width: 5,
      height: 20,
      borderRadius: 4,
      backgroundColor: '#16835b',
      borderWidth: 1,
      borderColor: '#0f6143',
    },
    dotMark: {
      width: 26,
      height: 26,
      borderRadius: 999,
      borderWidth: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotInner: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: '#d33f35',
    },
    characterMark: {
      width: 25,
      height: 25,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    characterMarkText: {
      color: '#fffaf0',
      fontSize: 14,
      fontWeight: '900',
    },
    coinMark: {
      width: 26,
      height: 26,
      borderRadius: 999,
      borderWidth: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinHole: {
      width: 8,
      height: 8,
      borderWidth: 2,
      borderRadius: 2,
      backgroundColor: '#fffaf0',
    },
    lotusMark: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lotusPetal: {
      position: 'absolute',
      width: 10,
      height: 16,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(34,26,18,0.24)',
    },
    lotusPetalTop: {
      top: 2,
    },
    lotusPetalRight: {
      right: 4,
      transform: [{ rotate: '90deg' }],
    },
    lotusPetalBottom: {
      bottom: 2,
    },
    lotusPetalLeft: {
      left: 4,
      transform: [{ rotate: '90deg' }],
    },
    lotusCenter: {
      width: 7,
      height: 7,
      borderRadius: 999,
      backgroundColor: '#fffaf0',
      borderWidth: 1,
      borderColor: 'rgba(34,26,18,0.18)',
    },
    jadeMark: {
      width: 23,
      height: 23,
      borderWidth: 4,
      borderRadius: 6,
      transform: [{ rotate: '45deg' }],
      alignItems: 'center',
      justifyContent: 'center',
    },
    jadeCore: {
      width: 7,
      height: 7,
      borderRadius: 2,
    },
    cloudMark: {
      width: 30,
      height: 24,
    },
    cloudPuff: {
      position: 'absolute',
      borderRadius: 999,
      borderWidth: 1,
      borderColor: 'rgba(34,26,18,0.16)',
    },
    cloudPuffLeft: {
      width: 15,
      height: 15,
      left: 2,
      top: 8,
    },
    cloudPuffCenter: {
      width: 18,
      height: 18,
      left: 8,
      top: 3,
    },
    cloudPuffRight: {
      width: 14,
      height: 14,
      right: 2,
      top: 9,
    },
    cloudBase: {
      position: 'absolute',
      left: 5,
      right: 4,
      bottom: 2,
      height: 9,
      borderRadius: 999,
    },
    starMark: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    starArmVertical: {
      position: 'absolute',
      width: 7,
      height: 26,
      borderRadius: 999,
    },
    starArmHorizontal: {
      position: 'absolute',
      width: 26,
      height: 7,
      borderRadius: 999,
    },
    starCore: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: '#fffaf0',
      borderWidth: 1,
      borderColor: 'rgba(34,26,18,0.14)',
    },
    waveMark: {
      width: 30,
      height: 26,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
    },
    waveLine: {
      height: 5,
      borderRadius: 999,
      transform: [{ skewX: '-20deg' }],
    },
    knotMark: {
      width: 30,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    knotLoop: {
      position: 'absolute',
      width: 16,
      height: 16,
      borderRadius: 5,
      borderWidth: 4,
      transform: [{ rotate: '45deg' }],
    },
    knotLoopLeft: {
      left: 3,
    },
    knotLoopRight: {
      right: 3,
    },
    knotBand: {
      width: 10,
      height: 10,
      borderRadius: 3,
    },
    moonMark: {
      width: 25,
      height: 25,
      borderRadius: 999,
      overflow: 'hidden',
    },
    moonCutout: {
      position: 'absolute',
      width: 23,
      height: 23,
      borderRadius: 999,
      backgroundColor: '#fffaf0',
      right: -6,
      top: 1,
    },
    sunMark: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sunRayVertical: {
      position: 'absolute',
      width: 6,
      height: 28,
      borderRadius: 999,
      opacity: 0.8,
    },
    sunRayHorizontal: {
      position: 'absolute',
      width: 28,
      height: 6,
      borderRadius: 999,
      opacity: 0.8,
    },
    sunCore: {
      width: 19,
      height: 19,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: '#fffaf0',
    },
    lanternMark: {
      width: 28,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
    },
    lanternCap: {
      width: 14,
      height: 4,
      borderRadius: 2,
    },
    lanternBody: {
      width: 22,
      height: 20,
      borderRadius: 7,
      borderWidth: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lanternGlow: {
      width: 7,
      height: 12,
      borderRadius: 999,
      opacity: 0.35,
    },
    lanternBase: {
      width: 10,
      height: 3,
      borderRadius: 2,
    },
    sparkMark: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sparkArmVertical: {
      position: 'absolute',
      width: 5,
      height: 27,
      borderRadius: 999,
    },
    sparkArmHorizontal: {
      position: 'absolute',
      width: 27,
      height: 5,
      borderRadius: 999,
    },
    sparkDiamond: {
      width: 15,
      height: 15,
      borderRadius: 3,
      borderWidth: 3,
      backgroundColor: '#fffaf0',
      transform: [{ rotate: '45deg' }],
    },
    suitMarkCompact: {
      transform: [{ scale: 0.8 }],
      marginVertical: 0,
    },
    modalScrim: {
      flex: 1,
      backgroundColor: Colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
    },
    modalCard: {
      width: '100%',
      maxWidth: 460,
      maxHeight: '92%',
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      ...theme.shadows.elevated,
    },
    modalCardContent: {
      padding: Spacing.xl,
    },
    modalKicker: {
      color: screenAccent.main,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    modalTitle: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '900',
      marginTop: Spacing.xs,
      marginBottom: Spacing.lg,
    },
    objectiveCard: {
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      gap: Spacing.xs,
    },
    objectiveTitle: {
      color: screenAccent.main,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    objectiveText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '800',
    },
    lessonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    lessonTiles: {
      flexDirection: 'row',
      gap: 4,
    },
    lessonCopy: {
      flex: 1,
    },
    lessonTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    lessonTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
    lessonDifficultyBadge: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    lessonDifficultyText: {
      color: screenAccent.main,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    lessonText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      lineHeight: 20,
      marginTop: 2,
    },
    rulesList: {
      marginTop: Spacing.xs,
      marginBottom: Spacing.md,
      gap: Spacing.xs,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      backgroundColor: screenAccent.badgeBg,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    ruleListTitle: {
      color: screenAccent.main,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    ruleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
    },
    ruleBullet: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: screenAccent.main,
      marginTop: 7,
    },
    ruleText: {
      flex: 1,
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '700',
    },
    tutorialGrid: {
      alignSelf: 'center',
      gap: 5,
      marginVertical: Spacing.md,
      padding: Spacing.sm,
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.surfaceLight,
    },
    tutorialGridStage: {
      position: 'relative',
      width: 172,
      height: 208,
      gap: 5,
    },
    tutorialRailSvg: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 2,
    },
    tutorialGridRow: {
      flexDirection: 'row',
      gap: 5,
      zIndex: 1,
    },
    tutorialCell: {
      width: 54,
      height: 66,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.line,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.surface,
    },
    tutorialBlank: {
      color: Colors.textMuted,
      fontSize: FontSize.lg,
      fontWeight: '800',
    },
    tutorialRailCaption: {
      color: Colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '800',
      textAlign: 'center',
      marginTop: Spacing.xs,
    },
    modalButton: {
      marginTop: Spacing.lg,
      minHeight: 48,
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    modalButtonText: {
      color: Colors.white,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    modalSecondaryButton: {
      marginTop: Spacing.sm,
      minHeight: 44,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    modalSecondaryButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
  });
};
