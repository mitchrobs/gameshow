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

const STORAGE_PREFIX = 'sudoku';
const ROW_GLOW_BG = 'rgba(79, 180, 119, 0.14)';
const ROW_GLOW_BORDER = 'rgba(79, 180, 119, 0.4)';

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
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

export default function SudokuScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('sudoku', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const router = useRouter();
  const dailyEntry = useMemo(() => getDailySudoku(), []);
  const puzzle: SudokuPuzzle = dailyEntry.puzzle;
  const dateLabel = useMemo(() => formatUtcDateLabel(dailyEntry.date), [dailyEntry.date]);
  const storageKey = `${STORAGE_PREFIX}:daily:${dailyEntry.date}`;
  const [grid, setGrid] = useState<number[][]>(() => copyGrid(puzzle.grid));
  const [notes, setNotes] = useState<NotesState>(() => createEmptyNotesState());
  const [selected, setSelected] = useState<SelectedCell>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

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
    getStorage()?.setItem(storageKey, '1');
  }, [gameState, hasConflict, isComplete, storageKey]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dailyEntry.date}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dailyEntry.date]);

  const hasCountedRef = useRef(false);
  useEffect(() => {
    if (gameState !== 'playing' && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('sudoku');
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

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
  const selectedStatus = selected
    ? `Selected: Row ${selected.row + 1}, Col ${selected.col + 1}`
    : 'Select a square to start.';

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
      return;
    }

    setNotes((previous) => removeNotesAt(previous, selected.row, selected.col));
  }, [gameState, grid, isGiven, selected]);

  const handleReset = useCallback(() => {
    setGrid(copyGrid(puzzle.grid));
    setNotes(createEmptyNotesState());
    setSelected(null);
    setNotesMode(false);
    setElapsedSeconds(0);
    setGameState('playing');
  }, [puzzle.grid]);

  const shareText = useMemo(() => {
    return [
      `Mini Sudoku ${dateLabel} UTC`,
      `Solved in ${formatTime(elapsedSeconds)} - ${dailyEntry.difficulty} ${puzzle.size}x${puzzle.size}`,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [dailyEntry.difficulty, dateLabel, elapsedSeconds, puzzle.size]);

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
      <Stack.Screen options={{ title: 'Mini Sudoku', headerBackTitle: 'Home' }} />
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
                    const cellConflict = conflicts[rowIndex][colIndex];
                    const rowGlow = rowComplete[rowIndex];
                    const borderRight =
                      colIndex % puzzle.boxCols === puzzle.boxCols - 1 &&
                      colIndex !== puzzle.size - 1
                        ? blockGap
                        : baseGap;
                    const cellKey = makeCellKey(rowIndex, colIndex);
                    const cellNotes = notes[cellKey] ?? [];

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
                          isGiven(rowIndex, colIndex) && styles.givenCell,
                          selectedCell && styles.selectedCell,
                          cellConflict && styles.conflictCell,
                        ]}
                      >
                        {value !== 0 ? (
                          <Text
                            style={[
                              styles.cellText,
                              isGiven(rowIndex, colIndex) && styles.givenText,
                              cellConflict && styles.conflictText,
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
                    style={({ pressed }) => [
                      styles.modeToggle,
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
                      style={({ pressed }) => [
                        styles.padButton,
                        { width: keypadButtonWidth, minHeight: keypadButtonHeight },
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
                    style={({ pressed }) => [
                      styles.clearButton,
                      { minHeight: keypadButtonHeight + 4 },
                      pressed && styles.clearButtonPressed,
                    ]}
                    onPress={handleClear}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.resetButton,
                      { minHeight: keypadButtonHeight + 4 },
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
                {hasConflict && (
                  <Text style={styles.conflictHint}>Resolve conflicts to finish.</Text>
                )}
              </View>
            )}

            {gameState === 'won' && (
              <View style={styles.resultCard}>
                <Text style={styles.confetti}>🎉 ✨ 🎊</Text>
                <Text style={styles.resultTitle}>Nice solve!</Text>
                <Text style={styles.resultSubtitle}>
                  {formatTime(elapsedSeconds)} - {dailyEntry.difficulty} {puzzle.size}x{puzzle.size}
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
                  onPress={() => router.back()}
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
    conflictCell: {
      borderColor: Colors.error,
      borderWidth: 2,
    },
    rowCompleteCell: {
      backgroundColor: ROW_GLOW_BG,
      borderColor: ROW_GLOW_BORDER,
    },
    cellText: {
      fontSize: FontSize.lg,
      fontWeight: '700',
      color: Colors.text,
    },
    givenText: {
      color: Colors.textSecondary,
    },
    conflictText: {
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
    padButtonPressed: {
      backgroundColor: Colors.surfaceLight,
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
      backgroundColor: Colors.border,
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
      backgroundColor: Colors.primaryLight,
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
    conflictHint: {
      fontSize: FontSize.sm,
      color: Colors.error,
      fontWeight: '600',
      marginTop: Spacing.xs,
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
