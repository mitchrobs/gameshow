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
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  DAWN_CABINET_DAILY_DIFFICULTIES,
  type DawnCabinetDailyDifficulty,
  type DawnCabinetLineState,
  type DawnCabinetPuzzle,
  type DawnCabinetSetKind,
  type DawnCabinetTile,
  cellKey,
  formatDawnCabinetShareText,
  getCabinetLineState,
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

type BankEntry = {
  id: string;
  tile: DawnCabinetTile;
};

type BankStack = {
  key: string;
  tile: DawnCabinetTile;
  entries: BankEntry[];
  availableEntries: BankEntry[];
};

type GameState = 'playing' | 'won';
type DailyPlayStatus = 'not-started' | 'in-progress' | 'complete';
type SuitFilter = 'all' | DawnCabinetTile['suit'];

const STORAGE_PREFIX = 'dawn-cabinet-v10';
const DAILY_DIFFICULTIES = DAWN_CABINET_DAILY_DIFFICULTIES;
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
  return puzzle.bank.map((tile, index) => ({
    id: `${tileKey(tile)}:${index}`,
    tile,
  }));
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
    if (entry) next[cell] = entry.tile;
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
    const key = tileKey(entry.tile);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function createBankStacks(entries: BankEntry[], usedEntryIDs: Set<string>): BankStack[] {
  const stackMap = entries.reduce<Map<string, BankStack>>((map, entry) => {
    const key = tileKey(entry.tile);
    const existing = map.get(key);
    if (existing) {
      existing.entries.push(entry);
      if (!usedEntryIDs.has(entry.id)) existing.availableEntries.push(entry);
    } else {
      map.set(key, {
        key,
        tile: entry.tile,
        entries: [entry],
        availableEntries: usedEntryIDs.has(entry.id) ? [] : [entry],
      });
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

function getLedgerPillText(puzzle: DawnCabinetPuzzle): string | null {
  const kinds = getLedgerKinds(puzzle);
  if (kinds.length === 0) return null;
  return kinds
    .map((kind) => `${lineGoalShortLabel(kind)}${puzzle.ledger?.[kind] ?? 0}`)
    .join(' ');
}

function getBankGoalText(puzzle: DawnCabinetPuzzle): string | null {
  if (puzzle.bankGoal) return `Leave ${lineGoalLabel(puzzle.bankGoal.type)}`;
  if (puzzle.spareCount > 0) return `Leave ${puzzle.spareCount}`;
  return null;
}

function getGoalSummary(puzzle: DawnCabinetPuzzle): string {
  const ledger = getLedgerPillText(puzzle);
  const reserve = getBankGoalText(puzzle) ?? 'Exact bank';
  return ledger ? `Hidden rails ${ledger} · ${reserve}` : reserve;
}

function getDifficultySummary(puzzle: DawnCabinetPuzzle): string {
  const blanks = puzzle.cells.length - Object.keys(puzzle.givens).length;
  const suits = getPuzzleSuits(puzzle).length;
  const hidden = puzzle.lines.filter((line) => line.goal === 'hidden').length;
  const reserve = getBankGoalText(puzzle) ?? 'Exact bank';
  return `${suits} suits · ${blanks} blanks · ${puzzle.lines.length} rails · ${hidden} hidden · ${reserve}`;
}

function getDifficultyCardSummary(puzzle: DawnCabinetPuzzle): string {
  const blanks = puzzle.cells.length - Object.keys(puzzle.givens).length;
  const hidden = puzzle.lines.filter((line) => line.goal === 'hidden').length;
  const density =
    puzzle.lines.length >= 34 ? 'Sprawling cabinet' :
    puzzle.lines.length >= 22 ? 'Dense cabinet' :
    'Compact cabinet';
  const secrecy =
    hidden / Math.max(1, puzzle.lines.length) >= 0.72 ? 'Hidden-heavy rails' :
    'Mixed rail clues';
  const reserve =
    puzzle.spareCount >= 4 ? 'Strict reserve' :
    puzzle.spareCount >= 2 ? 'Reserve pressure' :
    puzzle.spareCount === 1 ? 'Light reserve' :
    'Exact bank';
  const tempo =
    blanks >= 28 ? 'Long solve' :
    blanks >= 17 ? 'Deep solve' :
    'Quick solve';
  return `${density}\n${secrecy}\n${reserve} · ${tempo}`;
}

function getStartGoalPreview(puzzle: DawnCabinetPuzzle): string {
  const kinds = getLedgerKinds(puzzle).map(lineGoalLabel);
  const sets = kinds.length > 0 ? kinds.join(' / ') : 'Open rails';
  const reserve =
    puzzle.spareCount === 0 ? 'Exact bank' :
    puzzle.bankGoal ? `${lineGoalLabel(puzzle.bankGoal.type)} reserve` :
    'Loose reserve';
  return `${sets} · ${reserve}`;
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
  const [goalsExpanded, setGoalsExpanded] = useState(false);
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
        : bankStacks.filter((stack) => stack.tile.suit === selectedSuitFilter),
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
  const validLineCount = puzzle.lines.filter((line, index) => {
    return lineStates[index] === 'valid' && (line.goal !== 'hidden' || gameState === 'won');
  }).length;
  const invalidLineCount = lineStates.filter((state) => state === 'invalid').length;
  const allCellsFilled = puzzle.cells.every((cell) => Boolean(placements[cellKey(cell.row, cell.col)]));
  const ledgerComplete = isLedgerSatisfied(puzzle, placements);
  const bankGoalComplete = isBankGoalSatisfied(puzzle, placements);
  const tilesToPlace = Math.max(availableBankEntries.length - puzzle.spareCount, 0);
  const bankGoalText = getBankGoalText(puzzle);
  const goalSummary = getGoalSummary(puzzle);
  const bankMeta =
    puzzle.bankGoal
      ? `${tilesToPlace} to place, ${bankGoalText?.toLowerCase()}`
      : puzzle.spareCount > 0
        ? `${tilesToPlace} to place, leave ${puzzle.spareCount}`
        : `${availableBankEntries.length} left`;
  const winSuffix =
    puzzle.bankGoal
      ? `, with a bank ${lineGoalLabel(puzzle.bankGoal.type)} left`
      : puzzle.spareCount > 0
        ? `, with ${puzzle.spareCount} spare left`
        : '';
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
    setGoalsExpanded(false);
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
      if (!entry || !solutionTile || tileKey(entry.tile) !== tileKey(solutionTile)) return;
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
      if (selectedEntry?.tile.suit !== filter) setSelectedEntryID(null);
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
      setMessage(`The leftover bank tiles must form ${bankGoalText ? bankGoalText.toLowerCase().replace('leave ', 'a ') : 'the reserve goal'}.`);
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
    setGoalsExpanded(false);
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
              <Text style={styles.playSubtitle}>{isPractice ? 'Easy Practice' : dateLabel}</Text>
            </View>
            <View style={styles.playStatusRow}>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{puzzle.difficulty}</Text>
              </View>
              {isPractice ? (
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Practice</Text>
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
              selectedEntryID={selectedEntryID}
              selectedCell={selectedCell}
              revealHiddenRails={gameState === 'won'}
              onCellPress={handleCellPress}
              styles={styles}
              theme={theme}
            />
            <GoalFooter
              puzzle={puzzle}
              ledgerState={ledgerState}
              validLineCount={validLineCount}
              goalSummary={goalSummary}
              hasChecked={hasChecked}
              allCellsFilled={allCellsFilled}
              ledgerComplete={ledgerComplete}
              bankGoalComplete={bankGoalComplete}
              expanded={goalsExpanded}
              onToggle={() => setGoalsExpanded((current) => !current)}
              styles={styles}
            />
          </View>

          {!isMobile ? (
            <View style={styles.bankSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Tile Bank</Text>
                <Text style={styles.sectionMeta}>{bankMeta}</Text>
              </View>
              <View style={styles.bankGrid}>
                {bankEntries.map((entry) => {
                  const isUsed = usedEntryIDs.has(entry.id);
                  return (
                    <Pressable
                      key={entry.id}
                      accessibilityRole="button"
                      accessibilityLabel={tileLabel(entry.tile)}
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
                      <MahjongTile
                        tile={entry.tile}
                        styles={styles}
                        size="small"
                        muted={isUsed}
                        selected={selectedEntryID === entry.id}
                        totalCount={totalTileCounts[tileKey(entry.tile)] ?? 0}
                        remainingCount={remainingTileCounts[tileKey(entry.tile)] ?? 0}
                      />
                    </Pressable>
                  );
                })}
              </View>
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

          {message && (
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

      <View style={styles.difficultyCardRow}>
        {DAILY_DIFFICULTIES.map((difficulty) => {
          const isSelected = difficulty === selectedDifficulty;
          const optionPuzzle = getDailyDawnCabinet(puzzle.date, difficulty);
          const status = getDailyPlayStatus(optionPuzzle);
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
              <Text
                style={[
                  styles.difficultyCardTitle,
                  isSelected && styles.difficultyCardTitleSelected,
                ]}
              >
                {difficulty}
              </Text>
              <Text
                style={[
                  styles.difficultyCardStatus,
                  status === 'complete' && styles.difficultyCardStatusComplete,
                ]}
              >
                {dailyPlayStatusLabel(status)}
              </Text>
              <Text style={styles.difficultyCardText}>{getDifficultyCardSummary(optionPuzzle)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.startSummaryBox}>
        <Text style={styles.startSummaryTitle}>{selectedDifficulty}</Text>
        <Text style={styles.startSummaryStatus}>{dailyPlayStatusLabel(selectedStatus)}</Text>
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
        accessibilityLabel="Try Easy practice"
        testID="dawn-cabinet.practice-easy"
        style={({ pressed }) => [styles.practiceButton, pressed && styles.buttonPressed]}
        onPress={onPractice}
      >
        <Text style={styles.practiceButtonText}>Try Easy Practice</Text>
      </Pressable>
    </View>
  );
}

function GoalFooter({
  puzzle,
  ledgerState,
  validLineCount,
  goalSummary,
  hasChecked,
  allCellsFilled,
  ledgerComplete,
  bankGoalComplete,
  expanded,
  onToggle,
  styles,
}: {
  puzzle: DawnCabinetPuzzle;
  ledgerState: ReturnType<typeof getLedgerState>;
  validLineCount: number;
  goalSummary: string;
  hasChecked: boolean;
  allCellsFilled: boolean;
  ledgerComplete: boolean;
  bankGoalComplete: boolean;
  expanded: boolean;
  onToggle: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const ledgerKinds = getLedgerKinds(puzzle);
  const reserveText = getBankGoalText(puzzle) ?? 'Exact bank';
  const warning =
    hasChecked && allCellsFilled && !ledgerComplete
      ? 'Ledger mismatch.'
      : hasChecked && allCellsFilled && !bankGoalComplete
        ? 'Reserve goal missing.'
        : null;

  return (
    <View style={styles.goalFooter}>
      <View style={styles.goalFooterHeader}>
        <View style={styles.goalFooterCopy}>
          <Text style={styles.goalFooterTitle}>Goal</Text>
          <Text style={styles.goalFooterSummary}>{goalSummary}</Text>
        </View>
        {ledgerKinds.length > 0 || puzzle.spareCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Hide goal details' : 'Show goal details'}
            style={({ pressed }) => [styles.goalFooterToggle, pressed && styles.buttonPressed]}
            onPress={onToggle}
          >
            <Text style={styles.goalFooterToggleText}>{expanded ? 'Hide' : 'Details'}</Text>
          </Pressable>
        ) : null}
      </View>

      {expanded ? (
        <View style={styles.goalDetails}>
          <Text style={styles.goalDetailText}>
            {`Visible rails ${validLineCount}/${puzzle.lines.length}`}
          </Text>
          {ledgerKinds.map((kind: DawnCabinetSetKind) => (
            <Text key={kind} style={styles.goalDetailText}>
              {`${setKindPluralLabel(kind)} ${ledgerState.counts[kind]}/${puzzle.ledger?.[kind] ?? 0}`}
            </Text>
          ))}
          <Text style={styles.goalDetailText}>{reserveText}</Text>
        </View>
      ) : null}

      {warning ? <Text style={styles.goalWarningText}>{warning}</Text> : null}
    </View>
  );
}

function MobileBankTray({
  activeSuits,
  selectedSuitFilter,
  stacks,
  selectedEntryID,
  bankMeta,
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
  totalTileCounts: Record<string, number>;
  remainingTileCounts: Record<string, number>;
  onFilterPress: (filter: SuitFilter) => void;
  onStackPress: (stack: BankStack) => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const filters: SuitFilter[] = ['all', ...activeSuits];

  return (
    <View style={styles.mobileBankTray} testID="dawn-cabinet.mobile-bank">
      <View style={styles.mobileBankHeader}>
        <Text style={styles.mobileBankTitle}>Bank</Text>
        <Text style={styles.mobileBankMeta}>{bankMeta}</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suitFilterRow}
      >
        {filters.map((filter) => {
          const selected = filter === selectedSuitFilter;
          const label = filter === 'all' ? 'All' : suitShortLabel(filter);
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
              ) : (
                <View style={styles.suitFilterIconWrap}>
                  <SuitMark suit={filter} styles={styles} compact />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mobileBankScroller}
      >
        {stacks.map((stack) => {
          const isEmpty = stack.availableEntries.length === 0;
          const selected = stack.entries.some((entry) => entry.id === selectedEntryID);
          const key = tileKey(stack.tile);
          return (
            <Pressable
              key={stack.key}
              accessibilityRole="button"
              accessibilityLabel={`${tileLabel(stack.tile)}, ${stack.availableEntries.length} available`}
              disabled={isEmpty}
              style={({ pressed }) => [
                styles.mobileBankStack,
                selected && styles.bankTileSelected,
                isEmpty && styles.bankTileUsed,
                pressed && !isEmpty && styles.bankTilePressed,
              ]}
              onPress={() => onStackPress(stack)}
            >
              <MahjongTile
                tile={stack.tile}
                styles={styles}
                size="small"
                muted={isEmpty}
                selected={selected}
                totalCount={totalTileCounts[key] ?? 0}
                remainingCount={remainingTileCounts[key] ?? 0}
              />
              <View style={styles.stackCountBadge}>
                <Text style={styles.stackCountText}>
                  {`${stack.availableEntries.length}/${stack.entries.length}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function CabinetBoard({
  puzzle,
  placements,
  placedEntryIdsByCell,
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
    return resolveScreenAccent('dawn-cabinet', theme).main;
  };

  return (
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
          const labelPoint = {
            x: (points[0].x + points[1].x) / 2,
            y: (points[0].y + points[1].y) / 2,
          };
          const railStrokeOpacity = isRailHighlighted
            ? visualState === 'incomplete'
              ? 0.68
              : 0.88
            : isRailDimmed
              ? 0.1
              : visualState === 'incomplete'
                ? 0.22
                : 0.5;
          const railNodeOpacity = isRailHighlighted
            ? 0.88
            : isRailDimmed
              ? 0.14
              : visualState === 'incomplete'
                ? 0.32
                : 0.65;
          const labelOpacity = isRailDimmed ? 0.24 : isRailHighlighted ? 1 : 0.94;
          return (
            <G key={line.id}>
              {points.slice(1).map((point, index) => (
                <Line
                  key={`${line.id}-segment-${index}`}
                  x1={points[index].x}
                  y1={points[index].y}
                  x2={point.x}
                  y2={point.y}
                  stroke={color}
                  strokeWidth={isRailHighlighted ? 9 : visualState === 'incomplete' ? 5 : 7}
                  strokeOpacity={railStrokeOpacity}
                  strokeLinecap="round"
                />
              ))}
              {points.map((point, index) => (
                <Circle
                  key={`${line.id}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={3}
                  fill={color}
                  opacity={railNodeOpacity}
                />
              ))}
              <Rect
                x={labelPoint.x - (isRailHighlighted ? 11 : 9)}
                y={labelPoint.y - (isRailHighlighted ? 11 : 9)}
                width={isRailHighlighted ? 22 : 18}
                height={isRailHighlighted ? 22 : 18}
                rx={999}
                fill={theme.colors.surface}
                stroke={color}
                strokeWidth={isRailHighlighted ? 2.5 : 1.5}
                opacity={labelOpacity}
              />
              <SvgText
                x={labelPoint.x}
                y={labelPoint.y + (isRailHighlighted ? 4 : 3.5)}
                fill={color}
                fontSize={isRailHighlighted ? 11 : 10}
                fontWeight="900"
                textAnchor="middle"
                opacity={isRailDimmed ? 0.24 : 1}
              >
                {lineGoalShortLabel(line.goal)}
              </SvgText>
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
              const isSelected = selectedCell === key;
              const isRailRelated = selectedCellRailCells.has(key);
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
                    isRailRelated && styles.railRelatedCell,
                    isGiven && styles.givenCell,
                    isPlaced && styles.placedCell,
                    selectedEntryID && !tile && !isGiven && styles.readyCell,
                    isSelected && styles.selectedCell,
                  ]}
                  onPress={() => onCellPress(key)}
                >
                  {tile ? (
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
  size: 'small' | 'compact' | 'large';
  muted?: boolean;
  selected?: boolean;
  given?: boolean;
  totalCount?: number;
  remainingCount?: number;
}) {
  const showCopyPips = size === 'small' && Boolean(totalCount && totalCount > 1);

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
      <Text style={[styles.tileRank, size !== 'large' && styles.tileRankSmall]}>{tile.rank}</Text>
      <SuitMark suit={tile.suit} styles={styles} compact={size !== 'large'} />
      <Text style={[styles.tileSuitText, size !== 'large' && styles.tileSuitTextSmall]}>
        {suitShortLabel(tile.suit)}
      </Text>
      {showCopyPips && (
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
      )}
    </View>
  );
}

function SuitMark({
  suit,
  styles,
  compact,
}: {
  suit: DawnCabinetTile['suit'];
  styles: ReturnType<typeof createStyles>;
  compact?: boolean;
}) {
  if (suit === 'bamboo') {
    return (
      <View style={[styles.bambooMark, compact && styles.suitMarkCompact]}>
        {[0, 1, 2].map((item) => (
          <View key={item} style={styles.bambooStem} />
        ))}
      </View>
    );
  }

  if (suit === 'dots') {
    return (
      <View style={[styles.dotMark, compact && styles.suitMarkCompact]}>
        <View style={styles.dotInner} />
      </View>
    );
  }

  if (suit === 'characters') {
    return (
      <View style={[styles.characterMark, compact && styles.suitMarkCompact]}>
        <Text style={styles.characterMarkText}>C</Text>
      </View>
    );
  }

  const shortLabel = suitShortLabel(suit);
  return (
    <View
      style={[
        styles.genericSuitMark,
        { backgroundColor: SUIT_MARK_COLORS[suit] },
        compact && styles.suitMarkCompact,
      ]}
    >
      <Text style={styles.genericSuitMarkText}>{shortLabel[0]}</Text>
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalScrim}>
        <ScrollView
          style={styles.modalCard}
          contentContainerStyle={styles.modalCardContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalKicker}>How to Play</Text>
          <Text style={styles.modalTitle}>Read the rails</Text>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {runTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <Text style={styles.lessonTitle}>Run</Text>
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
              <Text style={styles.lessonTitle}>Match</Text>
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
              <Text style={styles.lessonTitle}>Mixed Run</Text>
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
              <Text style={styles.lessonTitle}>Pair</Text>
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
              <Text style={styles.lessonTitle}>Flush</Text>
              <Text style={styles.lessonText}>Three tiles in one suit, but not a Run or Match.</Text>
            </View>
          </View>

          <View style={styles.lessonRow}>
            <View style={styles.lessonTiles}>
              {numberTiles.map((tile) => (
                <MahjongTile key={tileKey(tile)} tile={tile} styles={styles} size="small" />
              ))}
            </View>
            <View style={styles.lessonCopy}>
              <Text style={styles.lessonTitle}>Number Set</Text>
              <Text style={styles.lessonText}>Three suits sharing the same rank.</Text>
            </View>
          </View>

          <View style={styles.rulesList}>
            <Text style={styles.ruleText}>Only tiles joined by a rail belong to the same set.</Text>
            <Text style={styles.ruleText}>Tiles may touch on the board and still be unrelated.</Text>
            <Text style={styles.ruleText}>R, X, M, P, F, and N rails name their required set.</Text>
            <Text style={styles.ruleText}>? rails are hidden rails: the ledger tells how many of each set they become.</Text>
            <Text style={styles.ruleText}>A crossing tile must satisfy every rail that passes through it.</Text>
            <Text style={styles.ruleText}>Copy pips show how many identical bank tiles remain.</Text>
            <Text style={styles.ruleText}>Harder cabinets include reserve tiles that must form the listed leftover set.</Text>
          </View>

          <View style={styles.tutorialGrid}>
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
            accessibilityLabel="Try Easy practice"
            testID="dawn-cabinet.practice-easy"
            style={({ pressed }) => [styles.modalSecondaryButton, pressed && styles.buttonPressed]}
            onPress={onPracticeEasy}
          >
            <Text style={styles.modalSecondaryButtonText}>Try Easy Practice</Text>
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
      paddingBottom: 238,
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
    difficultyCardStatus: {
      alignSelf: 'flex-start',
      marginTop: Spacing.xs,
      paddingHorizontal: Spacing.xs,
      paddingVertical: 3,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.line,
      color: Colors.textMuted,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    difficultyCardStatusComplete: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.2)' : '#e6f8ec',
      borderColor: Colors.success,
      color: Colors.success,
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
    startSummaryStatus: {
      color: screenAccent.main,
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
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
    goalFooter: {
      width: '100%',
      marginTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: Colors.line,
      paddingTop: Spacing.md,
      gap: Spacing.sm,
    },
    goalFooterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    goalFooterCopy: {
      flex: 1,
      minWidth: 0,
    },
    goalFooterTitle: {
      color: screenAccent.main,
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    goalFooterSummary: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '800',
      marginTop: 2,
    },
    goalFooterToggle: {
      minHeight: 34,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    goalFooterToggleText: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: '900',
    },
    goalDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    goalDetailText: {
      color: Colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '800',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 5,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.line,
    },
    goalWarningText: {
      color: Colors.error,
      fontSize: FontSize.sm,
      fontWeight: '900',
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
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
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
    mobileBankStack: {
      width: 66,
      height: 84,
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
      minWidth: 44,
      minHeight: 56,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.28)' : 'rgba(88,62,35,0.22)',
      backgroundColor: theme.mode === 'dark' ? '#f4efe5' : '#fffaf0',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: theme.mode === 'dark' ? 0.22 : 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    mahjongTileSmall: {
      width: 52,
      height: 64,
      minWidth: 52,
      minHeight: 64,
    },
    mahjongTileCompact: {
      minWidth: 38,
      minHeight: 48,
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
    tileRank: {
      color: '#221a12',
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 20,
    },
    tileRankSmall: {
      fontSize: 15,
      lineHeight: 17,
    },
    tileSuitText: {
      marginTop: 2,
      color: '#6b4e2d',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.8,
    },
    tileSuitTextSmall: {
      fontSize: 8,
    },
    copyPipRow: {
      flexDirection: 'row',
      gap: 2,
      marginTop: 3,
    },
    copyPip: {
      width: 5,
      height: 5,
      borderRadius: 999,
      backgroundColor: '#6b4e2d',
      opacity: 0.9,
    },
    copyPipSpent: {
      opacity: 0.18,
    },
    bambooMark: {
      flexDirection: 'row',
      gap: 3,
      marginVertical: 4,
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
      borderColor: '#1767b1',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 3,
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
      backgroundColor: '#cb392f',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
    },
    characterMarkText: {
      color: '#fffaf0',
      fontSize: 14,
      fontWeight: '900',
    },
    genericSuitMark: {
      width: 25,
      height: 25,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
      borderWidth: 1,
      borderColor: 'rgba(34,26,18,0.24)',
    },
    genericSuitMarkText: {
      color: '#fffaf0',
      fontSize: 13,
      fontWeight: '900',
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
    lessonTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
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
    ruleText: {
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
    tutorialGridRow: {
      flexDirection: 'row',
      gap: 5,
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
