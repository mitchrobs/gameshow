import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { getDailySudoku, type SudokuPuzzle } from '../src/data/sudokuPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import { formatUtcDateLabel } from '../src/utils/dailyUtc';

type GameState = 'playing' | 'won';
type SelectedCell = { row: number; col: number } | null;
type NotesState = Record<string, number[]>;

interface PersistedSudokuStateV1 {
  version?: 1;
  grid: number[][];
  notes: NotesState;
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
  hintedCellKeys: string[];
}

interface PersistedSudokuStateV2 {
  version: 2;
  grid: number[][];
  notes: NotesState;
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
  revealedHintCellKeys: string[];
  hintMarkedCellKeys: string[];
}

type PersistedSudokuState = PersistedSudokuStateV1 | PersistedSudokuStateV2;
type HintAction =
  | { kind: 'mark-wrong'; row: number; col: number }
  | { kind: 'reveal-value'; row: number; col: number }
  | null;

const STORAGE_PREFIX = 'sudoku';
const MAX_HINTS = 3;
const PROGRESS_STORAGE_VERSION = 2;
const ROW_GLOW_BG = 'rgba(79, 180, 119, 0.14)';
const ROW_GLOW_BORDER = 'rgba(79, 180, 119, 0.4)';

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function readStorageItem(key: string): string | null {
  try {
    return getStorage()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorageItem(key: string, value: string): void {
  try {
    getStorage()?.setItem(key, value);
  } catch {
    // Ignore storage failures so the game still works without persistence.
  }
}

function getProgressStorageKey(dateKey: string): string {
  return `${STORAGE_PREFIX}:progress:${dateKey}`;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function makeCellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

function createEmptyNotesState(): NotesState {
  return {};
}

function getBoxIndex(row: number, col: number, size: number, boxRows: number, boxCols: number) {
  return Math.floor(row / boxRows) * (size / boxCols) + Math.floor(col / boxCols);
}

function getConflicts(grid: number[][], size: number, boxRows: number, boxCols: number): boolean[][] {
  const conflicts = Array.from({ length: size }, () => Array(size).fill(false));

  for (let row = 0; row < size; row += 1) {
    const seen = new Map<number, number[]>();
    for (let col = 0; col < size; col += 1) {
      const value = grid[row][col];
      if (!value) continue;
      const cols = seen.get(value) ?? [];
      cols.push(col);
      seen.set(value, cols);
    }
    seen.forEach((cols) => {
      if (cols.length < 2) return;
      cols.forEach((col) => {
        conflicts[row][col] = true;
      });
    });
  }

  for (let col = 0; col < size; col += 1) {
    const seen = new Map<number, number[]>();
    for (let row = 0; row < size; row += 1) {
      const value = grid[row][col];
      if (!value) continue;
      const rows = seen.get(value) ?? [];
      rows.push(row);
      seen.set(value, rows);
    }
    seen.forEach((rows) => {
      if (rows.length < 2) return;
      rows.forEach((row) => {
        conflicts[row][col] = true;
      });
    });
  }

  for (let boxRow = 0; boxRow < size; boxRow += boxRows) {
    for (let boxCol = 0; boxCol < size; boxCol += boxCols) {
      const seen = new Map<number, Array<[number, number]>>();
      for (let rowOffset = 0; rowOffset < boxRows; rowOffset += 1) {
        for (let colOffset = 0; colOffset < boxCols; colOffset += 1) {
          const row = boxRow + rowOffset;
          const col = boxCol + colOffset;
          const value = grid[row][col];
          if (!value) continue;
          const cells = seen.get(value) ?? [];
          cells.push([row, col]);
          seen.set(value, cells);
        }
      }
      seen.forEach((cells) => {
        if (cells.length < 2) return;
        cells.forEach(([row, col]) => {
          conflicts[row][col] = true;
        });
      });
    }
  }

  return conflicts;
}

function copyGrid(grid: number[][]): number[][] {
  return grid.map((row) => [...row]);
}

function removeNotesAt(notes: NotesState, row: number, col: number): NotesState {
  const key = makeCellKey(row, col);
  if (!(key in notes)) return notes;
  const next = { ...notes };
  delete next[key];
  return next;
}

function removeCellKey(cellKeys: string[], row: number, col: number): string[] {
  const key = makeCellKey(row, col);
  if (!cellKeys.includes(key)) return cellKeys;
  return cellKeys.filter((entry) => entry !== key);
}

function sanitizeGrid(rawGrid: unknown, puzzle: SudokuPuzzle): number[][] {
  if (!Array.isArray(rawGrid) || rawGrid.length !== puzzle.size) {
    return copyGrid(puzzle.grid);
  }

  return puzzle.grid.map((row, rowIndex) =>
    row.map((givenValue, colIndex) => {
      if (givenValue !== 0) return givenValue;
      const rawRow = Array.isArray(rawGrid[rowIndex]) ? rawGrid[rowIndex] : null;
      const rawValue = rawRow?.[colIndex];
      if (!Number.isInteger(rawValue)) return 0;
      const value = Number(rawValue);
      return value >= 0 && value <= puzzle.size ? value : 0;
    })
  );
}

function sanitizeNotesState(rawNotes: unknown, grid: number[][], puzzle: SudokuPuzzle): NotesState {
  if (!rawNotes || typeof rawNotes !== 'object' || Array.isArray(rawNotes)) {
    return {};
  }

  const next: NotesState = {};

  Object.entries(rawNotes as Record<string, unknown>).forEach(([key, rawValues]) => {
    const match = key.match(/^(\d+):(\d+)$/);
    if (!match) return;

    const row = Number(match[1]);
    const col = Number(match[2]);
    if (
      row < 0 ||
      row >= puzzle.size ||
      col < 0 ||
      col >= puzzle.size ||
      puzzle.grid[row]?.[col] !== 0 ||
      grid[row]?.[col] !== 0 ||
      !Array.isArray(rawValues)
    ) {
      return;
    }

    const digits = [...new Set(rawValues)]
      .map((value) => Number(value))
      .filter(
        (value) =>
          Number.isInteger(value) && value >= puzzle.digits[0]! && value <= puzzle.digits[puzzle.digits.length - 1]!
      )
      .sort((left, right) => left - right);

    if (digits.length > 0) {
      next[key] = digits;
    }
  });

  return next;
}

function sanitizeRevealedHintCellKeys(
  rawRevealedHintCellKeys: unknown,
  grid: number[][],
  puzzle: SudokuPuzzle
): string[] {
  if (!Array.isArray(rawRevealedHintCellKeys)) return [];

  const seen = new Set<string>();
  const next: string[] = [];

  rawRevealedHintCellKeys.forEach((value) => {
    if (typeof value !== 'string' || seen.has(value)) return;
    const match = value.match(/^(\d+):(\d+)$/);
    if (!match) return;

    const row = Number(match[1]);
    const col = Number(match[2]);
    if (
      row < 0 ||
      row >= puzzle.size ||
      col < 0 ||
      col >= puzzle.size ||
      puzzle.grid[row]?.[col] !== 0 ||
      grid[row]?.[col] === 0 ||
      grid[row]?.[col] !== puzzle.solution[row]?.[col]
    ) {
      return;
    }

    seen.add(value);
    next.push(value);
  });

  return next;
}

function sanitizeHintMarkedCellKeys(
  rawHintMarkedCellKeys: unknown,
  grid: number[][],
  puzzle: SudokuPuzzle
): string[] {
  if (!Array.isArray(rawHintMarkedCellKeys)) return [];

  const seen = new Set<string>();
  const next: string[] = [];

  rawHintMarkedCellKeys.forEach((value) => {
    if (typeof value !== 'string' || seen.has(value)) return;
    const match = value.match(/^(\d+):(\d+)$/);
    if (!match) return;

    const row = Number(match[1]);
    const col = Number(match[2]);
    if (
      row < 0 ||
      row >= puzzle.size ||
      col < 0 ||
      col >= puzzle.size ||
      puzzle.grid[row]?.[col] !== 0 ||
      grid[row]?.[col] === 0 ||
      grid[row]?.[col] === puzzle.solution[row]?.[col]
    ) {
      return;
    }

    seen.add(value);
    next.push(value);
  });

  return next;
}

function getHintActionForCell(
  row: number,
  col: number,
  grid: number[][],
  puzzle: SudokuPuzzle,
  hintMarkedCellKeySet: Set<string>
): HintAction {
  if (puzzle.grid[row]?.[col] !== 0) return null;

  const value = grid[row]?.[col] ?? 0;
  const solutionValue = puzzle.solution[row]?.[col] ?? 0;
  const cellKey = makeCellKey(row, col);

  if (value !== 0 && value !== solutionValue && !hintMarkedCellKeySet.has(cellKey)) {
    return { kind: 'mark-wrong', row, col };
  }

  if (value === 0) {
    return { kind: 'reveal-value', row, col };
  }

  return null;
}

function getHintAction(
  grid: number[][],
  puzzle: SudokuPuzzle,
  selected: SelectedCell,
  hintMarkedCellKeySet: Set<string>
): HintAction {
  if (selected) {
    const selectedAction = getHintActionForCell(
      selected.row,
      selected.col,
      grid,
      puzzle,
      hintMarkedCellKeySet
    );
    if (selectedAction) return selectedAction;
  }

  for (let row = 0; row < puzzle.size; row += 1) {
    for (let col = 0; col < puzzle.size; col += 1) {
      const action = getHintActionForCell(row, col, grid, puzzle, hintMarkedCellKeySet);
      if (action?.kind === 'mark-wrong') {
        return action;
      }
    }
  }

  for (let row = 0; row < puzzle.size; row += 1) {
    for (let col = 0; col < puzzle.size; col += 1) {
      const action = getHintActionForCell(row, col, grid, puzzle, hintMarkedCellKeySet);
      if (action?.kind === 'reveal-value') {
        return action;
      }
    }
  }

  return null;
}

export default function SudokuScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('sudoku', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const router = useRouter();
  const canGoBack = router.canGoBack();
  const dailyEntry = useMemo(() => getDailySudoku(), []);
  const puzzle: SudokuPuzzle = dailyEntry.puzzle;
  const dateKey = dailyEntry.date;
  const dateLabel = useMemo(() => formatUtcDateLabel(dateKey), [dateKey]);
  const completionStorageKey = `${STORAGE_PREFIX}:daily:${dateKey}`;
  const progressStorageKey = getProgressStorageKey(dateKey);
  const [grid, setGrid] = useState<number[][]>(() => copyGrid(puzzle.grid));
  const [notes, setNotes] = useState<NotesState>(() => createEmptyNotesState());
  const [selected, setSelected] = useState<SelectedCell>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHintCellKeys, setRevealedHintCellKeys] = useState<string[]>([]);
  const [hintMarkedCellKeys, setHintMarkedCellKeys] = useState<string[]>([]);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const [focusedControl, setFocusedControl] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const hintMarkedCellKeySet = useMemo(
    () => new Set(hintMarkedCellKeys),
    [hintMarkedCellKeys]
  );

  const conflicts = useMemo(
    () => getConflicts(grid, puzzle.size, puzzle.boxRows, puzzle.boxCols),
    [grid, puzzle.size, puzzle.boxRows, puzzle.boxCols]
  );
  const rowComplete = useMemo(
    () =>
      grid.map(
        (row, rowIndex) =>
          row.every((value) => value !== 0) && !conflicts[rowIndex].some(Boolean)
      ),
    [grid, conflicts]
  );
  const isComplete = useMemo(
    () => grid.every((row) => row.every((value) => value !== 0)),
    [grid]
  );
  const hasConflict = useMemo(
    () => conflicts.some((row) => row.some((value) => value)),
    [conflicts]
  );

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!isComplete || hasConflict) return;
    setGameState('won');
    writeStorageItem(completionStorageKey, '1');
  }, [completionStorageKey, gameState, hasConflict, isComplete]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dateKey]);

  const hasCountedRef = useRef(false);
  useEffect(() => {
    if (gameState !== 'playing' && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('sudoku');
    }
  }, [gameState]);

  useEffect(() => {
    if (!hasRestoredProgress || gameState !== 'playing') return;
    const id = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameState, hasRestoredProgress]);

  useEffect(() => {
    setHasRestoredProgress(false);

    const resetToDailyStart = () => {
      hasCountedRef.current = false;
      setGrid(copyGrid(puzzle.grid));
      setNotes(createEmptyNotesState());
      setSelected(null);
      setNotesMode(false);
      setFocusedControl(null);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
      setRevealedHintCellKeys([]);
      setHintMarkedCellKeys([]);
      setHasRestoredProgress(true);
    };

    const raw = readStorageItem(progressStorageKey);
    if (!raw) {
      resetToDailyStart();
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedSudokuState> | null;
      const nextGrid = sanitizeGrid(parsed?.grid, puzzle);
      const nextNotes = sanitizeNotesState(parsed?.notes, nextGrid, puzzle);
      const legacyHintedCellKeys = (parsed as Partial<PersistedSudokuStateV1> | null)?.hintedCellKeys;
      const nextRevealedHintCellKeys = sanitizeRevealedHintCellKeys(
        parsed?.version === 2
          ? parsed?.revealedHintCellKeys
          : legacyHintedCellKeys,
        nextGrid,
        puzzle
      );
      const nextHintMarkedCellKeys = sanitizeHintMarkedCellKeys(
        parsed?.version === 2 ? parsed?.hintMarkedCellKeys : [],
        nextGrid,
        puzzle
      );
      const nextHintsUsed = Math.min(
        MAX_HINTS,
        Math.max(
          0,
          Number.isInteger(parsed?.hintsUsed) ? Number(parsed?.hintsUsed) : 0
        )
      );
      const nextElapsedSeconds = Math.max(
        0,
        Number.isFinite(parsed?.elapsedSeconds) ? Number(parsed?.elapsedSeconds) : 0
      );
      const restoredConflicts = getConflicts(
        nextGrid,
        puzzle.size,
        puzzle.boxRows,
        puzzle.boxCols
      );
      const restoredIsComplete = nextGrid.every((row) => row.every((value) => value !== 0));
      const restoredHasConflict = restoredConflicts.some((row) => row.some(Boolean));
      const nextGameState =
        parsed?.gameState === 'won' && restoredIsComplete && !restoredHasConflict
          ? 'won'
          : 'playing';

      setGrid(nextGrid);
      setNotes(nextNotes);
      setSelected(null);
      setNotesMode(false);
      setFocusedControl(null);
      setGameState(nextGameState);
      setElapsedSeconds(nextElapsedSeconds);
      setHintsUsed(nextHintsUsed);
      setRevealedHintCellKeys(nextRevealedHintCellKeys);
      setHintMarkedCellKeys(nextHintMarkedCellKeys);
      hasCountedRef.current = nextGameState === 'won';
    } catch {
      resetToDailyStart();
      return;
    }

    setHasRestoredProgress(true);
  }, [progressStorageKey, puzzle]);

  useEffect(() => {
    if (!hasRestoredProgress) return;

    const payload: PersistedSudokuStateV2 = {
      version: PROGRESS_STORAGE_VERSION,
      grid,
      notes,
      gameState,
      elapsedSeconds,
      hintsUsed,
      revealedHintCellKeys,
      hintMarkedCellKeys,
    };

    writeStorageItem(progressStorageKey, JSON.stringify(payload));
  }, [
    elapsedSeconds,
    gameState,
    grid,
    hasRestoredProgress,
    hintMarkedCellKeys,
    hintsUsed,
    notes,
    progressStorageKey,
    revealedHintCellKeys,
  ]);

  const { width } = useWindowDimensions();
  const baseGap = puzzle.size === 9 ? 4 : 6;
  const blockGap = puzzle.size === 9 ? 10 : 12;
  const maxBoard = puzzle.size === 9 ? 420 : 360;
  const browserViewportWidth =
    Platform.OS === 'web'
      ? Math.max(
          typeof window !== 'undefined' ? window.innerWidth : 0,
          typeof document !== 'undefined' ? document.documentElement?.clientWidth ?? 0 : 0
        )
      : 0;
  const viewportWidth =
    width > 0
      ? width
      : browserViewportWidth > 0
        ? browserViewportWidth
        : maxBoard + Spacing.lg * 2;
  const boardSize = Math.min(maxBoard, Math.max(0, viewportWidth - Spacing.lg * 2));
  const boardPadding = puzzle.size === 9 ? Spacing.sm : Spacing.md;
  const padPadding = Spacing.md;
  const keypadGap = puzzle.size === 9 ? Spacing.xs : Spacing.sm;
  const keypadWraps = puzzle.size === 9;
  const keypadColumns =
    puzzle.size === 9 && boardSize < 390 ? 5 : puzzle.digits.length;
  const totalGap =
    baseGap * (puzzle.size - Math.ceil(puzzle.size / puzzle.boxCols)) +
    blockGap * (Math.ceil(puzzle.size / puzzle.boxCols) - 1);
  const gridSize = boardSize - boardPadding * 2;
  const cellSize = Math.floor((gridSize - totalGap) / puzzle.size);
  const keypadButtonWidth = Math.max(
    42,
    Math.floor(
      (boardSize -
        padPadding * 2 -
        (keypadWraps ? keypadGap * (keypadColumns - 1) : 0)) /
        keypadColumns
    )
  );
  const keypadButtonHeight = puzzle.size === 9 ? 42 : 48;

  const isGiven = useCallback(
    (row: number, col: number) => puzzle.grid[row][col] !== 0,
    [puzzle.grid]
  );

  const noteColumns = puzzle.boxCols;
  const noteRows = puzzle.boxRows;
  const noteCellWidth = Math.max(8, Math.floor((cellSize - 8) / noteColumns));
  const hintAction = useMemo(
    () => getHintAction(grid, puzzle, selected, hintMarkedCellKeySet),
    [grid, hintMarkedCellKeySet, puzzle, selected]
  );
  const remainingHints = Math.max(0, MAX_HINTS - hintsUsed);
  const hintDisabled = remainingHints === 0 || !hintAction;
  const selectedStatus = selected
    ? `Selected: Row ${selected.row + 1}, Col ${selected.col + 1}`
    : 'Select a square to start.';
  const handleBackToGames = useCallback(() => {
    router.replace('/');
  }, [router]);

  const handleNumberPress = useCallback(
    (value: number) => {
      if (gameState !== 'playing' || !selected) return;
      if (isGiven(selected.row, selected.col)) return;

      if (notesMode) {
        if (grid[selected.row][selected.col] !== 0) return;
        const key = makeCellKey(selected.row, selected.col);
        setNotes((previous) => {
          const existing = previous[key] ?? [];
          const nextValues = existing.includes(value)
            ? existing.filter((item) => item !== value)
            : [...existing, value].sort((left, right) => left - right);
          const next = { ...previous };
          if (nextValues.length === 0) {
            delete next[key];
          } else {
            next[key] = nextValues;
          }
          return next;
        });
        return;
      }

      setGrid((previous) => {
        const next = copyGrid(previous);
        next[selected.row][selected.col] = value;
        return next;
      });
      setNotes((previous) => removeNotesAt(previous, selected.row, selected.col));
      setRevealedHintCellKeys((previous) =>
        removeCellKey(previous, selected.row, selected.col)
      );
      setHintMarkedCellKeys((previous) =>
        removeCellKey(previous, selected.row, selected.col)
      );
    },
    [gameState, grid, isGiven, notesMode, selected]
  );

  const handleClear = useCallback(() => {
    if (gameState !== 'playing' || !selected) return;
    if (isGiven(selected.row, selected.col)) return;

    if (grid[selected.row][selected.col] !== 0) {
      setGrid((previous) => {
        const next = copyGrid(previous);
        next[selected.row][selected.col] = 0;
        return next;
      });
      setRevealedHintCellKeys((previous) =>
        removeCellKey(previous, selected.row, selected.col)
      );
      setHintMarkedCellKeys((previous) =>
        removeCellKey(previous, selected.row, selected.col)
      );
      return;
    }

    setNotes((previous) => removeNotesAt(previous, selected.row, selected.col));
  }, [gameState, grid, isGiven, selected]);

  const handleHint = useCallback(() => {
    if (gameState !== 'playing' || hintDisabled || !hintAction) return;

    const targetKey = makeCellKey(hintAction.row, hintAction.col);

    if (hintAction.kind === 'mark-wrong') {
      setHintMarkedCellKeys((previous) =>
        previous.includes(targetKey) ? previous : [...previous, targetKey]
      );
    } else {
      setGrid((previous) => {
        const next = copyGrid(previous);
        next[hintAction.row][hintAction.col] = puzzle.solution[hintAction.row]![hintAction.col]!;
        return next;
      });
      setNotes((previous) => removeNotesAt(previous, hintAction.row, hintAction.col));
      setRevealedHintCellKeys((previous) =>
        previous.includes(targetKey) ? previous : [...previous, targetKey]
      );
      setHintMarkedCellKeys((previous) =>
        removeCellKey(previous, hintAction.row, hintAction.col)
      );
    }

    setHintsUsed((previous) => Math.min(MAX_HINTS, previous + 1));
    setSelected({ row: hintAction.row, col: hintAction.col });
  }, [gameState, hintAction, hintDisabled, puzzle.solution]);

  const handleReset = useCallback(() => {
    setGrid(copyGrid(puzzle.grid));
    setNotes(createEmptyNotesState());
    setRevealedHintCellKeys([]);
    setHintMarkedCellKeys([]);
    setSelected(null);
    setNotesMode(false);
    setFocusedControl(null);
    setElapsedSeconds(0);
    setGameState('playing');
  }, [puzzle.grid]);

  const shareText = useMemo(() => {
    return [
      `Mini Sudoku ${dateLabel} UTC`,
      `Solved in ${formatTime(elapsedSeconds)} · Hints ${hintsUsed}/${MAX_HINTS} · ${dailyEntry.difficulty} ${puzzle.size}x${puzzle.size}`,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [dailyEntry.difficulty, dateLabel, elapsedSeconds, hintsUsed, puzzle.size]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

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

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mini Sudoku',
          headerBackTitle: 'Home',
          ...(canGoBack
            ? {}
            : {
                headerLeft: () => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.headerFallbackButton,
                      pressed && styles.headerFallbackButtonPressed,
                    ]}
                    onPress={handleBackToGames}
                  >
                    <Text style={styles.headerFallbackButtonText}>← Home</Text>
                  </Pressable>
                ),
              }),
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <View style={styles.pageAccent} />
            <View style={styles.header}>
              <Text style={styles.title}>Mini Sudoku</Text>
              <View style={styles.headerRow}>
                <Text style={styles.subtitle}>{dateLabel} UTC</Text>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyText}>{dailyEntry.difficulty}</Text>
                </View>
                <View style={styles.sizePill}>
                  <Text style={styles.sizeText}>
                    {puzzle.size}x{puzzle.size}
                  </Text>
                </View>
              </View>
              <Text style={styles.helper}>
                Tap a square, then choose {puzzle.digits[0]}-{puzzle.digits[puzzle.digits.length - 1]}.
                Toggle Notes to pencil in possibilities.
              </Text>
              {dailyEntry.source === 'fallback' && (
                <Text style={styles.fallbackNote}>Using seeded fallback content outside the frozen pack.</Text>
              )}
            </View>

            <View style={[styles.board, { width: boardSize, padding: boardPadding }]}>
              {grid.map((row, rowIndex) => (
                <View
                  key={`row-${rowIndex}`}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom:
                      rowIndex % puzzle.boxRows === puzzle.boxRows - 1 &&
                      rowIndex !== puzzle.size - 1
                        ? blockGap
                        : baseGap,
                  }}
                >
                  {row.map((value, colIndex) => {
                    const selectedCell =
                      selected?.row === rowIndex && selected?.col === colIndex;
                    const relatedCell =
                      selected &&
                      (selected.row === rowIndex ||
                        selected.col === colIndex ||
                        getBoxIndex(
                          selected.row,
                          selected.col,
                          puzzle.size,
                          puzzle.boxRows,
                          puzzle.boxCols
                        ) ===
                          getBoxIndex(
                            rowIndex,
                            colIndex,
                            puzzle.size,
                            puzzle.boxRows,
                            puzzle.boxCols
                          ));
                    const rowGlow = rowComplete[rowIndex];
                    const borderRight =
                      colIndex % puzzle.boxCols === puzzle.boxCols - 1 &&
                      colIndex !== puzzle.size - 1
                        ? blockGap
                        : baseGap;
                    const cellKey = makeCellKey(rowIndex, colIndex);
                    const cellNotes = notes[cellKey] ?? [];
                    const givenCell = isGiven(rowIndex, colIndex);
                    const hintMarkedCell = hintMarkedCellKeySet.has(cellKey);

                    return (
                      <Pressable
                        key={`cell-${rowIndex}-${colIndex}`}
                        disabled={gameState !== 'playing'}
                        onPress={() => {
                          if (gameState !== 'playing') return;
                          setSelected({ row: rowIndex, col: colIndex });
                        }}
                        style={[
                          styles.cell,
                          rowGlow && styles.rowCompleteCell,
                          {
                            width: cellSize,
                            height: cellSize,
                            marginRight: borderRight,
                            backgroundColor: relatedCell ? screenAccent.soft : Colors.surface,
                          },
                          givenCell && styles.givenCell,
                          hintMarkedCell && styles.hintMarkedCell,
                          selectedCell && styles.selectedCell,
                        ]}
                      >
                        {value !== 0 ? (
                          <Text
                            style={[
                              styles.cellText,
                              givenCell && styles.givenText,
                              hintMarkedCell && styles.hintMarkedText,
                            ]}
                          >
                            {value}
                          </Text>
                        ) : cellNotes.length > 0 ? (
                          <View style={styles.notesGrid}>
                            {Array.from({ length: noteRows }, (_, noteRow) => (
                              <View key={`notes-row-${noteRow}`} style={styles.notesRow}>
                                {puzzle.digits
                                  .slice(
                                    noteRow * noteColumns,
                                    (noteRow + 1) * noteColumns
                                  )
                                  .map((digit) => (
                                    <View
                                      key={`${cellKey}-${digit}`}
                                      style={[
                                        styles.noteSlot,
                                        { width: noteCellWidth, height: noteCellWidth },
                                      ]}
                                    >
                                      <Text style={styles.noteText}>
                                        {cellNotes.includes(digit) ? digit : ''}
                                      </Text>
                                    </View>
                                  ))}
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {gameState === 'playing' && (
              <View style={[styles.pad, { width: boardSize }]}>
                <View style={styles.modeRow}>
                  <Text style={styles.modeCopy}>
                    {notesMode ? 'Notes mode: tap digits to add/remove pencil marks.' : 'Entry mode: tap digits to place a value.'}
                  </Text>
                  <Pressable
                    onFocus={() => setFocusedControl('notes-toggle')}
                    onBlur={() =>
                      setFocusedControl((current) =>
                        current === 'notes-toggle' ? null : current
                      )
                    }
                    style={({ pressed }) => [
                      styles.modeToggle,
                      focusedControl === 'notes-toggle' && styles.controlFocusRing,
                      notesMode && styles.modeToggleActive,
                      pressed && styles.modeTogglePressed,
                    ]}
                    onPress={() => setNotesMode((previous) => !previous)}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        notesMode && styles.modeToggleTextActive,
                      ]}
                    >
                      Notes
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.padRow,
                    keypadWraps
                      ? { gap: keypadGap, flexWrap: 'wrap', justifyContent: 'center' }
                      : { flexWrap: 'nowrap', justifyContent: 'space-between' },
                  ]}
                >
                  {puzzle.digits.map((digit) => (
                    <Pressable
                      key={digit}
                      onFocus={() => setFocusedControl(`digit-${digit}`)}
                      onBlur={() =>
                        setFocusedControl((current) =>
                          current === `digit-${digit}` ? null : current
                        )
                      }
                      style={({ pressed }) => [
                        styles.padButton,
                        { width: keypadButtonWidth, minHeight: keypadButtonHeight },
                        focusedControl === `digit-${digit}` && styles.padButtonFocused,
                        pressed && styles.padButtonPressed,
                      ]}
                      onPress={() => handleNumberPress(digit)}
                    >
                      <Text style={styles.padText}>{digit}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.padActions}>
                  <Pressable
                    onFocus={() => setFocusedControl('hint')}
                    onBlur={() =>
                      setFocusedControl((current) => (current === 'hint' ? null : current))
                    }
                    style={({ pressed }) => [
                      styles.hintButton,
                      { minHeight: keypadButtonHeight + 4 },
                      focusedControl === 'hint' && styles.controlFocusRing,
                      hintDisabled && styles.hintButtonDisabled,
                      pressed && !hintDisabled && styles.hintButtonPressed,
                    ]}
                    disabled={hintDisabled}
                    onPress={handleHint}
                  >
                    <Text
                      style={[
                        styles.hintText,
                        hintDisabled && styles.hintTextDisabled,
                      ]}
                    >
                      Hint ({remainingHints})
                    </Text>
                  </Pressable>
                  <Pressable
                    onFocus={() => setFocusedControl('clear')}
                    onBlur={() =>
                      setFocusedControl((current) => (current === 'clear' ? null : current))
                    }
                    style={({ pressed }) => [
                      styles.clearButton,
                      { minHeight: keypadButtonHeight + 4 },
                      focusedControl === 'clear' && styles.controlFocusRing,
                      pressed && styles.clearButtonPressed,
                    ]}
                    onPress={handleClear}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                  <Pressable
                    onFocus={() => setFocusedControl('reset')}
                    onBlur={() =>
                      setFocusedControl((current) => (current === 'reset' ? null : current))
                    }
                    style={({ pressed }) => [
                      styles.resetButton,
                      { minHeight: keypadButtonHeight + 4 },
                      focusedControl === 'reset' && styles.controlFocusRing,
                      pressed && styles.resetButtonPressed,
                    ]}
                    onPress={handleReset}
                  >
                    <Text style={styles.resetText}>Reset</Text>
                  </Pressable>
                </View>
                <View style={styles.timerRow}>
                  <Text style={styles.selectionText}>{selectedStatus}</Text>
                  <Text style={styles.timerText}>⏱ {formatTime(elapsedSeconds)}</Text>
                </View>
              </View>
            )}

            {gameState === 'won' && (
              <View style={styles.resultCard}>
                <Text style={styles.confetti}>🎉 ✨ 🎊</Text>
                <Text style={styles.resultTitle}>Nice solve!</Text>
                <Text style={styles.resultSubtitle}>
                  {formatTime(elapsedSeconds)} · Hints {hintsUsed}/{MAX_HINTS} · {dailyEntry.difficulty} {puzzle.size}x{puzzle.size}
                </Text>
                <View style={styles.shareCard}>
                  <Text style={styles.shareTitle}>Share your result</Text>
                  <View style={styles.shareBox}>
                    <Text selectable style={styles.shareText}>
                      {shareText}
                    </Text>
                  </View>
                  {Platform.OS === 'web' && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.shareButton,
                        pressed && styles.shareButtonPressed,
                      ]}
                      onPress={handleCopyResults}
                    >
                      <Text style={styles.shareButtonText}>Copy results</Text>
                    </Pressable>
                  )}
                  {shareStatus && <Text style={styles.shareStatus}>{shareStatus}</Text>}
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.homeButton,
                    pressed && styles.homeButtonPressed,
                  ]}
                  onPress={handleBackToGames}
                >
                  <Text style={styles.homeButtonText}>Back to games</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    page: {
      ...ui.page,
    },
    pageAccent: {
      ...ui.accentBar,
      marginBottom: Spacing.md,
    },
    header: {
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: FontSize.xxl,
      fontWeight: '800',
      color: Colors.text,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginTop: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    difficultyPill: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.textSecondary,
    },
    sizePill: {
      backgroundColor: screenAccent.soft,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    sizeText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.textSecondary,
    },
    helper: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      marginTop: Spacing.xs,
      lineHeight: 20,
    },
    fallbackNote: {
      marginTop: Spacing.xs,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    board: {
      backgroundColor: Colors.surface,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: Colors.border,
      alignSelf: 'center',
      shadowColor: Colors.text,
      shadowOpacity: 0.06,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 2,
    },
    cell: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
    },
    givenCell: {
      backgroundColor: Colors.surfaceLight,
    },
    selectedCell: {
      borderColor: screenAccent.main,
      borderWidth: 2,
    },
    rowCompleteCell: {
      backgroundColor: ROW_GLOW_BG,
      borderColor: ROW_GLOW_BORDER,
    },
    hintMarkedCell: {
      backgroundColor: Colors.errorLight,
      borderColor: Colors.errorLight,
    },
    cellText: {
      fontSize: FontSize.lg,
      fontWeight: '700',
      color: Colors.text,
    },
    givenText: {
      color: Colors.textSecondary,
    },
    hintMarkedText: {
      color: Colors.error,
    },
    notesGrid: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
    },
    notesRow: {
      flexDirection: 'row',
      gap: 1,
    },
    noteSlot: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    noteText: {
      fontSize: 9,
      fontWeight: '700',
      color: Colors.textMuted,
      lineHeight: 10,
    },
    pad: {
      marginTop: Spacing.lg,
      alignSelf: 'center',
      backgroundColor: Colors.surface,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.md,
      shadowColor: Colors.text,
      shadowOpacity: 0.05,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 1,
    },
    modeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      flexWrap: 'wrap',
      marginBottom: Spacing.md,
    },
    modeCopy: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 18,
      minWidth: 180,
    },
    modeToggle: {
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: screenAccent.main,
      backgroundColor: Colors.surface,
    },
    modeToggleActive: {
      backgroundColor: screenAccent.main,
      borderColor: screenAccent.main,
    },
    modeTogglePressed: {
      opacity: 0.86,
    },
    modeToggleText: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textSecondary,
    },
    modeToggleTextActive: {
      color: Colors.white,
    },
    padRow: {
      width: '100%',
      flexDirection: 'row',
    },
    padButton: {
      backgroundColor: Colors.surface,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.white,
      shadowOpacity: 0.35,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    padButtonFocused: {
      borderColor: screenAccent.main,
      borderWidth: 2,
    },
    padButtonPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    padText: {
      fontSize: FontSize.md,
      fontWeight: '700',
      color: Colors.text,
    },
    padActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    controlFocusRing: {
      borderColor: screenAccent.main,
      borderWidth: 2,
    },
    hintButton: {
      flex: 1,
      backgroundColor: screenAccent.soft,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: screenAccent.main,
    },
    hintButtonDisabled: {
      backgroundColor: Colors.surfaceLight,
      borderColor: Colors.border,
      opacity: 0.7,
    },
    hintButtonPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    hintText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '700',
    },
    hintTextDisabled: {
      color: Colors.textMuted,
    },
    clearButton: {
      flex: 1,
      backgroundColor: Colors.surfaceLight,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    clearButtonPressed: {
      opacity: 0.88,
      transform: [{ scale: 0.98 }],
    },
    clearText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '600',
    },
    resetButton: {
      flex: 1,
      backgroundColor: Colors.primary,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resetButtonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
    resetText: {
      fontSize: FontSize.sm,
      color: Colors.white,
      fontWeight: '700',
    },
    timerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.sm,
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    selectionText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: '600',
    },
    timerText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '600',
    },
    confetti: {
      fontSize: 28,
      marginBottom: Spacing.sm,
    },
    resultCard: {
      alignItems: 'center',
      ...ui.card,
      padding: Spacing.lg,
      marginTop: Spacing.lg,
    },
    resultTitle: {
      fontSize: FontSize.xl,
      fontWeight: '800',
      color: Colors.text,
      marginTop: Spacing.md,
    },
    resultSubtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
    },
    shareCard: {
      width: '100%',
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      marginTop: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    shareTitle: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    shareBox: {
      marginTop: Spacing.sm,
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
    },
    shareText: {
      fontSize: FontSize.sm,
      color: Colors.text,
      lineHeight: 18,
    },
    shareButton: {
      ...ui.cta,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      marginTop: Spacing.sm,
    },
    shareButtonPressed: {
      ...ui.ctaPressed,
    },
    shareButtonText: {
      ...ui.ctaText,
    },
    shareStatus: {
      marginTop: Spacing.xs,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: 'center',
    },
    headerFallbackButton: {
      borderRadius: BorderRadius.sm,
      paddingVertical: 4,
      paddingHorizontal: 6,
    },
    headerFallbackButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    headerFallbackButtonText: {
      color: Colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    homeButton: {
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      marginTop: Spacing.sm,
    },
    homeButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    homeButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.md,
      fontWeight: '600',
    },
  });
};
