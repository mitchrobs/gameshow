import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
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
import {
  type MiniCrosswordClue,
  type MiniCrosswordDirection,
  getDailyMiniCrossword,
} from '../src/data/miniCrosswordPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

type GameState = 'playing' | 'won-main';
type BonusPhase = 'hidden' | 'animating' | 'ready';

interface ActiveCell {
  row: number;
  col: number;
}

const STORAGE_PREFIX = 'crossword';
const MAX_HINTS = 1;
const KEYBOARD_OFFSET = 86;
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

function getLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDateFromLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
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

function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

export default function MiniCrosswordScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('mini-crossword', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();

  const [dateKey, setDateKey] = useState(() => getLocalDateKey());
  const activeDate = useMemo(() => getDateFromLocalDateKey(dateKey), [dateKey]);
  const puzzle = useMemo(() => getDailyMiniCrossword(activeDate), [activeDate]);
  const firstClue = useMemo(() => puzzle.across[0] ?? puzzle.down[0] ?? null, [puzzle]);
  const dateLabel = useMemo(
    () =>
      activeDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [activeDate]
  );

  const dailyKey = `${STORAGE_PREFIX}:daily:${dateKey}`;
  const bonusKey = `${STORAGE_PREFIX}:bonus:${dateKey}`;

  const [entries, setEntries] = useState<Record<string, string>>({});
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(
    firstClue ? { row: firstClue.row, col: firstClue.col } : null
  );
  const [direction, setDirection] = useState<MiniCrosswordDirection>(
    firstClue?.direction ?? 'across'
  );
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [checkedWrongKeys, setCheckedWrongKeys] = useState<string[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [bonusEntry, setBonusEntry] = useState('');
  const [bonusSolved, setBonusSolved] = useState(false);
  const [bonusStatus, setBonusStatus] = useState<string | null>(null);
  const [bonusPhase, setBonusPhase] = useState<BonusPhase>('hidden');
  const [reduceMotion, setReduceMotion] = useState(false);

  const hasCountedRef = useRef(false);
  const bonusAnimationStartedRef = useRef(false);
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const bonusAnim = useRef(new Animated.Value(0)).current;

  const cellMap = useMemo(() => {
    const map = new Map<string, { row: number; col: number; isBlock: boolean; solution: string; number?: number }>();
    puzzle.cells.forEach((cell) => {
      map.set(cellKey(cell.row, cell.col), cell);
    });
    return map;
  }, [puzzle.cells]);

  const wrongKeySet = useMemo(() => new Set(checkedWrongKeys), [checkedWrongKeys]);

  const cellToClues = useMemo(() => {
    const map: Record<string, { across?: MiniCrosswordClue; down?: MiniCrosswordClue }> = {};
    const bindClue = (clue: MiniCrosswordClue) => {
      const stepRow = clue.direction === 'down' ? 1 : 0;
      const stepCol = clue.direction === 'across' ? 1 : 0;
      for (let i = 0; i < clue.answer.length; i += 1) {
        const row = clue.row + stepRow * i;
        const col = clue.col + stepCol * i;
        const key = cellKey(row, col);
        map[key] = map[key] ?? {};
        map[key][clue.direction] = clue;
      }
    };
    puzzle.across.forEach(bindClue);
    puzzle.down.forEach(bindClue);
    return map;
  }, [puzzle.across, puzzle.down]);

  const activeCellKey = activeCell ? cellKey(activeCell.row, activeCell.col) : null;

  const activeClue = useMemo(() => {
    if (!activeCellKey) return null;
    const clues = cellToClues[activeCellKey];
    if (!clues) return null;
    if (direction === 'across' && clues.across) return clues.across;
    if (direction === 'down' && clues.down) return clues.down;
    return clues.across ?? clues.down ?? null;
  }, [activeCellKey, cellToClues, direction]);

  const activeClueCellSet = useMemo(() => {
    if (!activeClue) return new Set<string>();
    const set = new Set<string>();
    const stepRow = activeClue.direction === 'down' ? 1 : 0;
    const stepCol = activeClue.direction === 'across' ? 1 : 0;
    for (let i = 0; i < activeClue.answer.length; i += 1) {
      set.add(cellKey(activeClue.row + stepRow * i, activeClue.col + stepCol * i));
    }
    return set;
  }, [activeClue]);

  const solvedCount = useMemo(() => {
    let correct = 0;
    puzzle.cells.forEach((cell) => {
      if (cell.isBlock) return;
      const key = cellKey(cell.row, cell.col);
      if (entries[key] === cell.solution) correct += 1;
    });
    return correct;
  }, [entries, puzzle.cells]);

  const playableCellCount = useMemo(
    () => puzzle.cells.filter((cell) => !cell.isBlock).length,
    [puzzle.cells]
  );

  const fillProgress = `${solvedCount}/${playableCellCount}`;
  const isCompactLayout = viewportWidth < 520;
  const shouldCollapseClues =
    isKeyboardVisible || (Platform.OS === 'web' && isCompactLayout && viewportHeight < 620);
  const gridGap = puzzle.size === 7 ? 3 : 4;
  const maxGridWidth = puzzle.size === 7 ? 390 : 310;
  const availableGridWidth = Math.max(
    240,
    viewportWidth - theme.spacing.lg * 2 - theme.spacing.md * 2
  );
  const gridWidth = Math.min(maxGridWidth, availableGridWidth);
  const cellSize = Math.floor((gridWidth - gridGap * (puzzle.size - 1)) / puzzle.size);
  const cellFontSize = puzzle.size === 7 ? Math.max(20, Math.floor(cellSize * 0.52)) : 30;
  const cellNumberSize = puzzle.size === 7 ? 8 : 10;

  const bonusTranslateY = useMemo(
    () => bonusAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
    [bonusAnim]
  );
  const bonusOpacity = useMemo(
    () => bonusAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
    [bonusAnim]
  );
  const bonusScale = useMemo(
    () => bonusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }),
    [bonusAnim]
  );

  useEffect(() => {
    const checkDateRollover = () => {
      const next = getLocalDateKey();
      setDateKey((current) => (current === next ? current : next));
    };
    checkDateRollover();
    const id = setInterval(checkDateRollover, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setEntries({});
    setActiveCell(firstClue ? { row: firstClue.row, col: firstClue.col } : null);
    setDirection(firstClue?.direction ?? 'across');
    setGameState('playing');
    setElapsedSeconds(0);
    setHintsUsed(0);
    setStatusMessage(null);
    setShareStatus(null);
    setCheckedWrongKeys([]);
    setKeyboardVisible(false);
    setBonusEntry('');
    setBonusStatus(null);
    setBonusPhase('hidden');
    bonusAnim.setValue(0);
    bonusAnimationStartedRef.current = false;
    setBonusSolved(getStorage()?.getItem(bonusKey) === '1');
    hasCountedRef.current = false;
  }, [bonusAnim, bonusKey, dateKey, firstClue, puzzle.id]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dateKey]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const id = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [gameState]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    const didShowSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true))
        : null;
    const didHideSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false))
        : null;

    return () => {
      showSub.remove();
      hideSub.remove();
      didShowSub?.remove();
      didHideSub?.remove();
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (solvedCount !== playableCellCount || playableCellCount === 0) return;

    setGameState('won-main');
    setStatusMessage('Puzzle solved!');
    getStorage()?.setItem(dailyKey, '1');
  }, [dailyKey, gameState, playableCellCount, solvedCount]);

  useEffect(() => {
    if (gameState !== 'won-main' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('crossword');
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'won-main') return;

    if (bonusSolved) {
      setBonusPhase('ready');
      bonusAnim.setValue(1);
      return;
    }

    if (bonusAnimationStartedRef.current) return;
    bonusAnimationStartedRef.current = true;
    setBonusPhase('animating');
    bonusAnim.setValue(0);

    Animated.sequence([
      Animated.timing(bonusAnim, {
        toValue: 1,
        duration: reduceMotion ? 1 : 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(reduceMotion ? 0 : 180),
    ]).start(() => {
      setBonusPhase('ready');
    });
  }, [bonusAnim, bonusSolved, gameState, reduceMotion]);

  const focusCell = useCallback((row: number, col: number) => {
    const key = cellKey(row, col);
    const input = inputRefs.current[key];
    if (!input) return;
    requestAnimationFrame(() => input.focus());
  }, []);

  const selectCell = useCallback(
    (row: number, col: number) => {
      const key = cellKey(row, col);
      const clueLinks = cellToClues[key];
      setActiveCell((prev) => {
        if (prev && prev.row === row && prev.col === col) {
          if (clueLinks?.across && clueLinks?.down) {
            setDirection((current) => (current === 'across' ? 'down' : 'across'));
          }
          return prev;
        }
        if (clueLinks?.across && !clueLinks?.down) {
          setDirection('across');
        } else if (clueLinks?.down && !clueLinks?.across) {
          setDirection('down');
        }
        return { row, col };
      });
      focusCell(row, col);
    },
    [cellToClues, focusCell]
  );

  const getOrderedCellsForClue = useCallback((clue: MiniCrosswordClue) => {
    const stepRow = clue.direction === 'down' ? 1 : 0;
    const stepCol = clue.direction === 'across' ? 1 : 0;
    return Array.from({ length: clue.answer.length }, (_, i) => ({
      row: clue.row + stepRow * i,
      col: clue.col + stepCol * i,
    }));
  }, []);

  const moveToOffsetInActiveClue = useCallback(
    (offset: 1 | -1, fromRow: number, fromCol: number) => {
      const clue = activeClue;
      if (!clue) return;
      const cells = getOrderedCellsForClue(clue);
      const index = cells.findIndex((cell) => cell.row === fromRow && cell.col === fromCol);
      if (index < 0) return;
      const next = cells[index + offset];
      if (!next) return;
      setActiveCell(next);
      focusCell(next.row, next.col);
    },
    [activeClue, focusCell, getOrderedCellsForClue]
  );

  const findPlayableCellInDirection = useCallback(
    (row: number, col: number, rowStep: number, colStep: number): ActiveCell | null => {
      let nextRow = row + rowStep;
      let nextCol = col + colStep;

      while (
        nextRow >= 0 &&
        nextRow < puzzle.size &&
        nextCol >= 0 &&
        nextCol < puzzle.size
      ) {
        const nextCell = cellMap.get(cellKey(nextRow, nextCol));
        if (nextCell && !nextCell.isBlock) {
          return { row: nextRow, col: nextCol };
        }
        nextRow += rowStep;
        nextCol += colStep;
      }

      return null;
    },
    [cellMap, puzzle.size]
  );

  const toggleDirectionAtCell = useCallback(
    (row: number, col: number) => {
      const clueLinks = cellToClues[cellKey(row, col)];
      if (!clueLinks) return false;

      if (clueLinks.across && clueLinks.down) {
        setDirection((current) => (current === 'across' ? 'down' : 'across'));
        return true;
      }

      const onlyDirection = clueLinks.across ? 'across' : clueLinks.down ? 'down' : null;
      if (!onlyDirection) return false;
      setDirection(onlyDirection);
      return true;
    },
    [cellToClues]
  );

  const handleCellText = useCallback(
    (row: number, col: number, value: string) => {
      if (gameState !== 'playing') return;
      const key = cellKey(row, col);
      const cell = cellMap.get(key);
      if (!cell || cell.isBlock) return;
      const letter = value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
      setEntries((prev) => ({ ...prev, [key]: letter }));
      setCheckedWrongKeys((prev) => prev.filter((wrongKey) => wrongKey !== key));
      setStatusMessage(null);

      if (letter) {
        moveToOffsetInActiveClue(1, row, col);
      }
    },
    [cellMap, gameState, moveToOffsetInActiveClue]
  );

  const handleKeyPress = useCallback(
    (row: number, col: number, keyValue: string) => {
      if (gameState !== 'playing') return;
      if (keyValue !== 'Backspace') return;
      const key = cellKey(row, col);
      if (entries[key]) return;
      moveToOffsetInActiveClue(-1, row, col);
      const clue = activeClue;
      if (!clue) return;
      const cells = getOrderedCellsForClue(clue);
      const index = cells.findIndex((cell) => cell.row === row && cell.col === col);
      const prev = cells[index - 1];
      if (!prev) return;
      const prevKey = cellKey(prev.row, prev.col);
      setEntries((current) => ({ ...current, [prevKey]: '' }));
      setCheckedWrongKeys((current) => current.filter((wrongKey) => wrongKey !== prevKey));
    },
    [activeClue, entries, gameState, getOrderedCellsForClue, moveToOffsetInActiveClue]
  );

  const handleWebCellKeyDown = useCallback(
    (row: number, col: number, keyValue: string) => {
      if (gameState !== 'playing') return false;

      const move = (rowStep: number, colStep: number, nextDirection: MiniCrosswordDirection) => {
        const next = findPlayableCellInDirection(row, col, rowStep, colStep);
        setDirection(nextDirection);
        if (!next) return true;
        setActiveCell(next);
        focusCell(next.row, next.col);
        return true;
      };

      if (keyValue === 'ArrowLeft') return move(0, -1, 'across');
      if (keyValue === 'ArrowRight') return move(0, 1, 'across');
      if (keyValue === 'ArrowUp') return move(-1, 0, 'down');
      if (keyValue === 'ArrowDown') return move(1, 0, 'down');

      if (keyValue === 'Enter' || keyValue === ' ') {
        return toggleDirectionAtCell(row, col);
      }

      if (keyValue !== 'Backspace') return false;

      const key = cellKey(row, col);
      if (entries[key]) {
        setEntries((current) => ({ ...current, [key]: '' }));
        setCheckedWrongKeys((current) => current.filter((wrongKey) => wrongKey !== key));
        return true;
      }

      const clue = activeClue;
      if (!clue) return true;
      const cells = getOrderedCellsForClue(clue);
      const index = cells.findIndex((cell) => cell.row === row && cell.col === col);
      const prev = cells[index - 1];
      if (!prev) return true;
      const prevKey = cellKey(prev.row, prev.col);
      setEntries((current) => ({ ...current, [prevKey]: '' }));
      setCheckedWrongKeys((current) => current.filter((wrongKey) => wrongKey !== prevKey));
      setActiveCell(prev);
      focusCell(prev.row, prev.col);
      return true;
    },
    [
      activeClue,
      entries,
      findPlayableCellInDirection,
      focusCell,
      gameState,
      getOrderedCellsForClue,
      toggleDirectionAtCell,
    ]
  );

  const handleCheck = useCallback(() => {
    if (gameState !== 'playing') return;
    const wrong: string[] = [];
    let filled = 0;
    puzzle.cells.forEach((cell) => {
      if (cell.isBlock) return;
      const key = cellKey(cell.row, cell.col);
      const value = entries[key];
      if (!value) return;
      filled += 1;
      if (value !== cell.solution) wrong.push(key);
    });

    setCheckedWrongKeys(wrong);
    if (filled === 0) {
      setStatusMessage('Enter at least one letter first.');
      return;
    }
    if (wrong.length === 0) {
      setStatusMessage('All filled letters are correct.');
      return;
    }
    setStatusMessage(`${wrong.length} letter${wrong.length === 1 ? '' : 's'} need fixing.`);
  }, [entries, gameState, puzzle.cells]);

  const handleHint = useCallback(() => {
    if (gameState !== 'playing') return;
    if (hintsUsed >= MAX_HINTS) {
      setStatusMessage('Hint already used.');
      return;
    }

    const unsolvedKeys = puzzle.cells
      .filter((cell) => !cell.isBlock)
      .map((cell) => cellKey(cell.row, cell.col))
      .filter((key) => entries[key] !== cellMap.get(key)?.solution);

    if (unsolvedKeys.length === 0) {
      setStatusMessage('No hint needed.');
      return;
    }

    const preferred = unsolvedKeys.filter((key) => activeClueCellSet.has(key));
    const pool = preferred.length > 0 ? preferred : unsolvedKeys;
    const targetKey = pool[Math.floor(Math.random() * pool.length)] as string;
    const cell = cellMap.get(targetKey);
    if (!cell || cell.isBlock) return;

    setEntries((prev) => ({ ...prev, [targetKey]: cell.solution }));
    setHintsUsed(1);
    setCheckedWrongKeys((prev) => prev.filter((key) => key !== targetKey));
    setStatusMessage('Revealed one letter.');
    setActiveCell({ row: cell.row, col: cell.col });
    focusCell(cell.row, cell.col);
  }, [activeClueCellSet, cellMap, entries, focusCell, gameState, hintsUsed, puzzle.cells]);

  const handleSelectClue = useCallback(
    (clue: MiniCrosswordClue) => {
      setDirection(clue.direction);
      setActiveCell({ row: clue.row, col: clue.col });
      focusCell(clue.row, clue.col);
    },
    [focusCell]
  );

  const handleBonusCheck = useCallback(() => {
    if (gameState !== 'won-main') return;
    if (bonusPhase !== 'ready' || bonusSolved) return;

    const guess = bonusEntry.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 7);
    if (guess.length < 7) {
      setBonusStatus('Enter all 7 letters before checking.');
      return;
    }

    if (guess === puzzle.bonus.answer) {
      setBonusSolved(true);
      setBonusStatus('Bonus solved. Nice pull.');
      getStorage()?.setItem(bonusKey, '1');
      return;
    }

    setBonusStatus('Not this one yet. Try another arrangement.');
  }, [bonusEntry, bonusKey, bonusPhase, bonusSolved, gameState, puzzle.bonus.answer]);

  const shareText = useMemo(() => {
    return [
      `Mini Crossword ${dateLabel}`,
      `Solved in ${formatTime(elapsedSeconds)} · Hints ${hintsUsed}/${MAX_HINTS}`,
      `Bonus: ${bonusSolved ? '✅' : '⬜'}`,
      'https://mitchrobs.github.io/gameshow/#/mini-crossword',
    ].join('\n');
  }, [bonusSolved, dateLabel, elapsedSeconds, hintsUsed]);

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

  const getWebCellKeyDownProps = useCallback(
    (row: number, col: number) =>
      Platform.OS === 'web'
        ? ({
            onKeyDown: (event: { key: string; preventDefault?: () => void }) => {
              if (handleWebCellKeyDown(row, col, event.key)) {
                event.preventDefault?.();
              }
            },
          } as Record<string, unknown>)
        : {},
    [handleWebCellKeyDown]
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Mini Crossword', headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={KEYBOARD_OFFSET}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              shouldCollapseClues && styles.scrollContentKeyboard,
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.page}>
              <View style={styles.pageAccent} />
              <View style={styles.header}>
                <Text style={styles.title}>Mini Crossword</Text>
                <Text style={styles.subtitle}>
                  Fill the {puzzle.size}x{puzzle.size} daily crossword.
                </Text>
                <Text style={styles.metaText}>{dateLabel}</Text>
                <Text style={styles.metaText}>Progress {fillProgress}</Text>
              </View>

              <View style={styles.boardCard}>
                <View style={styles.activeClueStrip}>
                  <View style={styles.activeClueTopRow}>
                    <Text style={styles.activeClueLabel}>
                      {activeClue ? `${activeClue.direction === 'across' ? 'Across' : 'Down'} ${activeClue.number}` : 'Across'}
                    </Text>
                    <View style={styles.themePill}>
                      <Text style={styles.themePillText}>{puzzle.theme.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.activeClueText}>
                    {activeClue
                      ? `${activeClue.clue} (${activeClue.answer.length})`
                      : 'Tap a clue or cell to start.'}
                  </Text>
                </View>

                <View style={[styles.grid, { gap: gridGap }]}>
                  {Array.from({ length: puzzle.size }).map((_, row) => (
                    <View key={`row-${row}`} style={[styles.gridRow, { gap: gridGap }]}>
                      {Array.from({ length: puzzle.size }).map((__, col) => {
                        const key = cellKey(row, col);
                        const cell = cellMap.get(key);
                        if (!cell || cell.isBlock) {
                          return (
                            <View
                              key={key}
                              style={[styles.blockCell, { width: cellSize, height: cellSize }]}
                            />
                          );
                        }
                        const isActive = activeCell?.row === row && activeCell?.col === col;
                        const isInActiveClue = activeClueCellSet.has(key);
                        const isWrong = wrongKeySet.has(key);
                        return (
                          <Pressable
                            key={key}
                            style={({ pressed }) => [
                              styles.letterCell,
                              { width: cellSize, height: cellSize },
                              isInActiveClue && styles.letterCellClue,
                              isActive && styles.letterCellActive,
                              isWrong && styles.letterCellWrong,
                              pressed && styles.letterCellPressed,
                            ]}
                            onPress={() => selectCell(row, col)}
                          >
                            {cell.number ? (
                              <Text style={[styles.cellNumber, { fontSize: cellNumberSize }]}>
                                {cell.number}
                              </Text>
                            ) : null}
                            <TextInput
                              ref={(node) => {
                                inputRefs.current[key] = node;
                              }}
                              style={[styles.cellInput, { fontSize: cellFontSize }]}
                              value={entries[key] ?? ''}
                              onFocus={() => {
                                setActiveCell({ row, col });
                              }}
                              onChangeText={(value) => handleCellText(row, col, value)}
                              onKeyPress={(event) => {
                                if (Platform.OS !== 'web') {
                                  handleKeyPress(row, col, event.nativeEvent.key);
                                }
                              }}
                              {...getWebCellKeyDownProps(row, col)}
                              maxLength={1}
                              autoCapitalize="characters"
                              autoCorrect={false}
                              editable={gameState === 'playing'}
                              selectionColor={screenAccent.main}
                            />
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>

                <View style={styles.controlsRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      pressed && styles.actionButtonPressed,
                    ]}
                    onPress={handleCheck}
                  >
                    <Text style={styles.actionButtonText}>Check</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      hintsUsed >= MAX_HINTS && styles.actionButtonDisabled,
                      pressed && hintsUsed < MAX_HINTS && styles.actionButtonPressed,
                    ]}
                    onPress={handleHint}
                    disabled={hintsUsed >= MAX_HINTS}
                  >
                    <Text style={styles.actionButtonText}>Hint ({MAX_HINTS - hintsUsed})</Text>
                  </Pressable>
                </View>

                <Text style={styles.statusText}>{statusMessage ?? 'Tap a clue or cell to start.'}</Text>
              </View>

              {shouldCollapseClues ? (
                <View style={styles.cluesCollapsedCard}>
                  <Text style={styles.cluesCollapsedText}>
                    Clue list hidden while typing. Use the clue above the grid.
                  </Text>
                </View>
              ) : (
                <View style={styles.cluesCard}>
                  <Text style={styles.cluesTitle}>Across</Text>
                  {puzzle.across.map((clue) => (
                    <Pressable
                      key={clue.id}
                      style={({ pressed }) => [
                        styles.clueRow,
                        activeClue?.id === clue.id && styles.clueRowActive,
                        pressed && styles.clueRowPressed,
                      ]}
                      onPress={() => handleSelectClue(clue)}
                    >
                      <Text style={styles.clueNumber}>{clue.number}.</Text>
                      <Text style={styles.clueText}>
                        {clue.clue} ({clue.answer.length})
                      </Text>
                    </Pressable>
                  ))}

                  <Text style={styles.cluesTitle}>Down</Text>
                  {puzzle.down.map((clue) => (
                    <Pressable
                      key={clue.id}
                      style={({ pressed }) => [
                        styles.clueRow,
                        activeClue?.id === clue.id && styles.clueRowActive,
                        pressed && styles.clueRowPressed,
                      ]}
                      onPress={() => handleSelectClue(clue)}
                    >
                      <Text style={styles.clueNumber}>{clue.number}.</Text>
                      <Text style={styles.clueText}>
                        {clue.clue} ({clue.answer.length})
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}

              {gameState === 'won-main' && (
                <Animated.View
                  style={[
                    styles.bonusCard,
                    {
                      opacity: bonusOpacity,
                      transform: [{ translateY: bonusTranslateY }, { scale: bonusScale }],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.bonusVisual,
                      {
                        backgroundColor: puzzle.bonus.visual.tint,
                        borderColor: puzzle.bonus.visual.accent,
                      },
                    ]}
                  >
                    {Array.from({ length: 6 }).map((_, index) => (
                      <View
                        key={`${puzzle.bonus.visual.motif}-${index}`}
                        style={[
                          styles.bonusVisualMark,
                          {
                            backgroundColor: puzzle.bonus.visual.accent,
                            opacity: 0.18 + index * 0.08,
                            transform: [
                              { translateY: index % 2 === 0 ? -2 : 2 },
                              { rotate: `${index % 2 === 0 ? -8 : 8}deg` },
                            ],
                          },
                          puzzle.bonus.visual.motif === 'bars' && styles.bonusVisualMarkTall,
                          puzzle.bonus.visual.motif === 'path' && styles.bonusVisualMarkRound,
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={styles.bonusTitle}>7-Letter Bonus</Text>
                  <Text style={styles.bonusInstruction}>{puzzle.bonus.instructionText}</Text>
                  <Text style={styles.bonusClue}>Clue: {puzzle.bonus.clue}</Text>
                  <TextInput
                    style={styles.bonusInput}
                    value={bonusEntry}
                    onChangeText={(value) => {
                      setBonusEntry(value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 7));
                      setBonusStatus(null);
                    }}
                    maxLength={7}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={bonusPhase === 'ready' && !bonusSolved}
                    selectionColor={screenAccent.main}
                    placeholder="7 letters"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                  <Pressable
                    style={({ pressed }) => [
                      styles.bonusButton,
                      (bonusPhase !== 'ready' || bonusSolved) && styles.bonusButtonDisabled,
                      pressed && bonusPhase === 'ready' && !bonusSolved && styles.bonusButtonPressed,
                    ]}
                    onPress={handleBonusCheck}
                    disabled={bonusPhase !== 'ready' || bonusSolved}
                  >
                    <Text style={styles.bonusButtonText}>{bonusSolved ? 'Bonus solved' : 'Check bonus'}</Text>
                  </Pressable>
                  {bonusStatus ? <Text style={styles.bonusStatus}>{bonusStatus}</Text> : null}
                </Animated.View>
              )}

              {gameState === 'won-main' && (
                <View style={styles.shareCard}>
                  <Text style={styles.shareTitle}>Share your result</Text>
                  <View style={styles.shareBox}>
                    <Text selectable style={styles.shareText}>
                      {shareText}
                    </Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.shareButton,
                      pressed && styles.shareButtonPressed,
                    ]}
                    onPress={handleCopyResults}
                  >
                    <Text style={styles.shareButtonText}>Copy results</Text>
                  </Pressable>
                  {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
                </View>
              )}

              <Pressable
                style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
                onPress={() => router.back()}
              >
                <Text style={styles.homeButtonText}>Back to games</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  const crosswordCellBg = theme.mode === 'dark' ? '#fffdfb' : '#fffdfb';
  const crosswordClueBg = theme.mode === 'dark' ? '#fff0e4' : '#fff4ec';
  const crosswordActiveBg = theme.mode === 'dark' ? '#ffe4cf' : '#fff0e4';
  const crosswordBlockBg = theme.mode === 'dark' ? '#05070b' : Colors.primary;
  const webInputReset =
    Platform.OS === 'web'
      ? ({
          backgroundColor: 'transparent',
          borderWidth: 0,
          outlineStyle: 'none',
          boxShadow: 'none',
        } as Record<string, unknown>)
      : {};

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    keyboardAvoider: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    scrollContentKeyboard: {
      paddingBottom: Spacing.md,
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
      ...ui.title,
    },
    subtitle: {
      ...ui.subtitle,
    },
    metaText: {
      marginTop: Spacing.xs,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '600',
    },
    boardCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...WEB_NO_SELECT,
    },
    activeClueStrip: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.md,
    },
    activeClueTopRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
      gap: Spacing.sm,
    },
    activeClueLabel: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    activeClueText: {
      fontSize: FontSize.sm,
      color: Colors.text,
      lineHeight: 20,
      fontWeight: '600',
    },
    themePill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
    },
    themePillText: {
      fontSize: 12,
      color: screenAccent.badgeText,
      fontWeight: '700',
    },
    grid: {
      alignItems: 'center',
      marginBottom: Spacing.md,
      gap: 4,
    },
    gridRow: {
      flexDirection: 'row',
      gap: 4,
    },
    blockCell: {
      width: 58,
      height: 58,
      borderRadius: BorderRadius.sm,
      backgroundColor: crosswordBlockBg,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? '#20252d' : Colors.primaryLight,
    },
    letterCell: {
      width: 58,
      height: 58,
      borderRadius: BorderRadius.sm,
      backgroundColor: crosswordCellBg,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : Colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    letterCellClue: {
      backgroundColor: crosswordClueBg,
      borderColor: screenAccent.badgeBorder,
    },
    letterCellActive: {
      backgroundColor: crosswordActiveBg,
      borderColor: screenAccent.main,
      borderWidth: 2,
      shadowColor: screenAccent.main,
      shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.24,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 4,
    },
    letterCellWrong: {
      borderColor: Colors.error,
      backgroundColor: Colors.errorLight,
    },
    letterCellPressed: {
      transform: [{ scale: 0.98 }],
    },
    cellNumber: {
      position: 'absolute',
      top: 3,
      left: 4,
      fontSize: 10,
      color: theme.mode === 'dark' ? '#5f6875' : Colors.textMuted,
      fontWeight: '700',
      zIndex: 2,
    },
    cellInput: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: 30,
      fontWeight: '800',
      color: '#1d2430',
      paddingTop: 6,
      paddingHorizontal: 0,
      paddingBottom: 0,
      backgroundColor: 'transparent',
      ...webInputReset,
    },
    controlsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    actionButton: {
      ...ui.pill,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      minWidth: 118,
      maxWidth: '100%',
      alignItems: 'center',
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
    },
    actionButtonPressed: {
      transform: [{ scale: 0.99 }],
      backgroundColor: screenAccent.soft,
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionButtonText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    statusText: {
      textAlign: 'center',
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      minHeight: 18,
    },
    cluesCollapsedCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
    },
    cluesCollapsedText: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: '600',
    },
    cluesCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    cluesTitle: {
      fontSize: FontSize.md,
      color: Colors.text,
      fontWeight: '800',
      marginTop: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    clueRow: {
      flexDirection: 'row',
      gap: Spacing.xs,
      paddingVertical: 8,
      paddingHorizontal: 6,
      borderRadius: BorderRadius.sm,
    },
    clueRowActive: {
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    clueRowPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    clueNumber: {
      minWidth: 22,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '800',
    },
    clueText: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
    },
    bonusCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    bonusVisual: {
      minHeight: 34,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    bonusVisualMark: {
      width: 34,
      height: 8,
      borderRadius: BorderRadius.full,
    },
    bonusVisualMarkTall: {
      width: 10,
      height: 24,
    },
    bonusVisualMarkRound: {
      width: 14,
      height: 14,
    },
    bonusTitle: {
      fontSize: FontSize.md,
      color: Colors.text,
      fontWeight: '800',
      marginBottom: Spacing.xs,
    },
    bonusInstruction: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
      marginBottom: Spacing.sm,
    },
    bonusClue: {
      fontSize: FontSize.sm,
      color: Colors.text,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    bonusInput: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: Colors.surface,
      color: Colors.text,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      letterSpacing: 6,
      textTransform: 'uppercase',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    bonusButton: {
      ...ui.cta,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
    },
    bonusButtonPressed: {
      ...ui.ctaPressed,
    },
    bonusButtonDisabled: {
      opacity: 0.55,
    },
    bonusButtonText: {
      ...ui.ctaText,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    bonusStatus: {
      marginTop: Spacing.xs,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: 'center',
      minHeight: 18,
    },
    shareCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
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
      alignSelf: 'center',
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
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
