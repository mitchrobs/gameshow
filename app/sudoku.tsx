import { useMemo, useState, useEffect, useCallback } from 'react';
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
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { getDailySudoku } from '../src/data/sudokuPuzzles';

const SIZE = 6;
const BOX_ROWS = 2;
const BOX_COLS = 3;
const STORAGE_PREFIX = 'sudoku';
const HIGHLIGHT_COLOR = '#3b82f6';
const HIGHLIGHT_BG = 'rgba(59, 130, 246, 0.12)';
const ROW_GLOW_BG = 'rgba(79, 180, 119, 0.14)';
const ROW_GLOW_BORDER = 'rgba(79, 180, 119, 0.4)';

type GameState = 'playing' | 'won';

function getLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getConflicts(grid: number[][]): boolean[][] {
  const conflicts = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

  // Rows
  for (let r = 0; r < SIZE; r += 1) {
    const seen: Record<number, number[]> = {};
    for (let c = 0; c < SIZE; c += 1) {
      const value = grid[r][c];
      if (!value) continue;
      if (!seen[value]) seen[value] = [];
      seen[value].push(c);
    }
    Object.values(seen).forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => (conflicts[r][c] = true));
      }
    });
  }

  // Columns
  for (let c = 0; c < SIZE; c += 1) {
    const seen: Record<number, number[]> = {};
    for (let r = 0; r < SIZE; r += 1) {
      const value = grid[r][c];
      if (!value) continue;
      if (!seen[value]) seen[value] = [];
      seen[value].push(r);
    }
    Object.values(seen).forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => (conflicts[r][c] = true));
      }
    });
  }

  // Boxes
  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX_ROWS) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX_COLS) {
      const seen: Record<number, [number, number][]> = {};
      for (let r = 0; r < BOX_ROWS; r += 1) {
        for (let c = 0; c < BOX_COLS; c += 1) {
          const row = boxRow + r;
          const col = boxCol + c;
          const value = grid[row][col];
          if (!value) continue;
          if (!seen[value]) seen[value] = [];
          seen[value].push([row, col]);
        }
      }
      Object.values(seen).forEach((cells) => {
        if (cells.length > 1) {
          cells.forEach(([row, col]) => (conflicts[row][col] = true));
        }
      });
    }
  }

  return conflicts;
}

export default function SudokuScreen() {
  const router = useRouter();
  const puzzle = useMemo(() => getDailySudoku(), []);
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );
  const storageKey = `${STORAGE_PREFIX}:daily:${getLocalDateKey()}`;
  const [grid, setGrid] = useState<number[][]>(() => puzzle.grid.map((row) => [...row]));
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const conflicts = useMemo(() => getConflicts(grid), [grid]);
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
    if (isComplete && !hasConflict) {
      setGameState('won');
      getStorage()?.setItem(storageKey, '1');
    }
  }, [gameState, isComplete, hasConflict, storageKey]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${getLocalDateKey()}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

  const { width } = useWindowDimensions();
  const baseGap = 6;
  const blockGap = 12;
  const maxBoard = 360;
  const boardSize = Math.min(maxBoard, width - Spacing.lg * 2);
  const boardPadding = Spacing.md;
  const totalGap = baseGap * (SIZE - 2) + blockGap;
  const gridSize = boardSize - boardPadding * 2;
  const cellSize = Math.floor((gridSize - totalGap) / SIZE);

  const isGiven = useCallback(
    (row: number, col: number) => puzzle.grid[row][col] !== 0,
    [puzzle.grid]
  );

  const handleNumberPress = useCallback(
    (value: number) => {
      if (gameState !== 'playing') return;
      if (!selected) return;
      if (isGiven(selected.row, selected.col)) return;
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[selected.row][selected.col] = value;
        return next;
      });
    },
    [selected, isGiven, gameState]
  );

  const handleClear = useCallback(() => {
    if (gameState !== 'playing') return;
    if (!selected) return;
    if (isGiven(selected.row, selected.col)) return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[selected.row][selected.col] = 0;
      return next;
    });
  }, [selected, isGiven, gameState]);

  const handleReset = useCallback(() => {
    setGrid(puzzle.grid.map((row) => [...row]));
    setSelected(null);
    setElapsedSeconds(0);
    setGameState('playing');
  }, [puzzle.grid]);

  const shareText = useMemo(() => {
    return [
      `Mini Sudoku ${dateLabel}`,
      `Solved in ${formatTime(elapsedSeconds)} - ${puzzle.difficulty}`,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [dateLabel, elapsedSeconds, puzzle.difficulty]);

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
                <Text style={styles.subtitle}>{dateLabel}</Text>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyText}>{puzzle.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.helper}>Tap a square, then choose 1-6.</Text>
            </View>

            <View style={[styles.board, { width: boardSize, padding: boardPadding }]}>
              {grid.map((row, rowIndex) => (
                <View
                  key={`row-${rowIndex}`}
                  style={{
                    flexDirection: 'row',
                    marginBottom:
                      rowIndex % BOX_ROWS === BOX_ROWS - 1 && rowIndex !== SIZE - 1
                        ? blockGap
                        : baseGap,
                  }}
                >
                  {row.map((value, colIndex) => {
                    const selectedCell =
                      selected?.row === rowIndex && selected?.col === colIndex;
                    const relatedCell =
                      selected && (selected.row === rowIndex || selected.col === colIndex);
                    const cellConflict = conflicts[rowIndex][colIndex];
                    const rowGlow = rowComplete[rowIndex];
                    const borderRight =
                      colIndex % BOX_COLS === BOX_COLS - 1 && colIndex !== SIZE - 1
                        ? blockGap
                        : baseGap;
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
                            backgroundColor: relatedCell
                              ? HIGHLIGHT_BG
                              : Colors.surface,
                          },
                          isGiven(rowIndex, colIndex) && styles.givenCell,
                          selectedCell && styles.selectedCell,
                          cellConflict && styles.conflictCell,
                        ]}
                      >
                        <Text
                          style={[
                            styles.cellText,
                            isGiven(rowIndex, colIndex) && styles.givenText,
                            cellConflict && styles.conflictText,
                          ]}
                        >
                          {value !== 0 ? value : ''}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>

            {gameState === 'playing' && (
              <View style={[styles.pad, { width: boardSize }]}>
                <View style={styles.padRow}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Pressable
                      key={num}
                      style={({ pressed }) => [
                        styles.padButton,
                        { width: cellSize },
                        pressed && styles.padButtonPressed,
                      ]}
                      onPress={() => handleNumberPress(num)}
                    >
                      <Text style={styles.padText}>{num}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.padActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.clearButton,
                      pressed && styles.clearButtonPressed,
                    ]}
                    onPress={handleClear}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.resetButton,
                      pressed && styles.resetButtonPressed,
                    ]}
                    onPress={handleReset}
                  >
                    <Text style={styles.resetText}>Reset</Text>
                  </Pressable>
                </View>
                <View style={styles.timerRow}>
                  <Text style={styles.timerText}>⏱ {formatTime(elapsedSeconds)}</Text>
                  {hasConflict && (
                    <Text style={styles.conflictHint}>Resolve conflicts to finish.</Text>
                  )}
                </View>
              </View>
            )}

            {gameState === 'won' && (
              <View style={styles.resultCard}>
                <Text style={styles.confetti}>🎉 ✨ 🎊</Text>
                <Text style={styles.resultTitle}>Nice solve!</Text>
                <Text style={styles.resultSubtitle}>
                  {formatTime(elapsedSeconds)} - {puzzle.difficulty}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  pageAccent: {
    height: 6,
    width: 80,
    backgroundColor: '#4fb477',
    borderRadius: 999,
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
  helper: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  board: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center',
  },
  cell: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  givenCell: {
    backgroundColor: Colors.surfaceLight,
  },
  selectedCell: {
    borderColor: HIGHLIGHT_COLOR,
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
  pad: {
    marginTop: Spacing.lg,
    alignSelf: 'center',
  },
  padRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  padButton: {
    flexBasis: '15%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
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
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
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
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
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
    marginTop: Spacing.sm,
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
  },
  confetti: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
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
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  shareButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
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
