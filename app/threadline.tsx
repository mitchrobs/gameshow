import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  useWindowDimensions,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import {
  type ThreadlineCoord,
  type ThreadlineWord,
  areAdjacent,
  coordKey,
  findWordForPath,
  getDailyThreadline,
  getLocalThreadlineDateKey,
} from '../src/data/threadlinePuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

type GameState = 'playing' | 'won';

const STORAGE_PREFIX = 'threadline';
const HOW_TO_STEPS = [
  'Draw through the missing words in the grid.',
  'Words run in straight lines: across, down, or diagonal.',
  'Each found word belongs to one of two hidden themes.',
  'You get one hint. Complete both themes to reveal the final line.',
];

const WEB_NO_SELECT =
  Platform.OS === 'web'
    ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }
    : {};

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

function blankFor(answer: string): string {
  return Array.from({ length: answer.length }, () => '_').join('');
}

function sameCoord(a: ThreadlineCoord, b: ThreadlineCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function directionBetween(a: ThreadlineCoord, b: ThreadlineCoord): ThreadlineCoord {
  return {
    row: Math.sign(b.row - a.row),
    col: Math.sign(b.col - a.col),
  };
}

function sameDirection(a: ThreadlineCoord, b: ThreadlineCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function canExtendSelection(path: ThreadlineCoord[], coord: ThreadlineCoord): boolean {
  if (path.length === 0) return true;
  const last = path[path.length - 1];
  if (!areAdjacent(last, coord)) return false;
  if (path.some((item) => sameCoord(item, coord))) return false;
  if (path.length < 2) return true;
  return sameDirection(
    directionBetween(path[path.length - 2], last),
    directionBetween(last, coord)
  );
}

function getPuzzleNumber(dateKey: string): string {
  return dateKey.replaceAll('-', '').slice(-3);
}

type WebBoardTouch = {
  clientX?: number;
  clientY?: number;
};

type WebBoardEvent = {
  preventDefault?: () => void;
  stopPropagation?: () => void;
  currentTarget?: {
    getBoundingClientRect?: () => { left: number; top: number };
    setPointerCapture?: (pointerId: number) => void;
    releasePointerCapture?: (pointerId: number) => void;
  };
  nativeEvent?: {
    buttons?: number;
    clientX?: number;
    clientY?: number;
    locationX?: number;
    locationY?: number;
    pointerId?: number;
    touches?: ArrayLike<WebBoardTouch>;
    changedTouches?: ArrayLike<WebBoardTouch>;
  };
};

export default function ThreadlineScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('threadline', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const { width } = useWindowDimensions();
  const [dateKey, setDateKey] = useState(() => getLocalThreadlineDateKey());
  const activeDate = useMemo(() => getDateFromLocalDateKey(dateKey), [dateKey]);
  const puzzle = useMemo(() => getDailyThreadline(activeDate), [activeDate]);
  const [selectedPath, setSelectedPath] = useState<ThreadlineCoord[]>([]);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [hintedIds, setHintedIds] = useState<string[]>([]);
  const [hintCellKey, setHintCellKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isHowToOpen, setIsHowToOpen] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [isBoardGestureActive, setIsBoardGestureActive] = useState(false);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const isPointerDownRef = useRef(false);
  const hasCountedRef = useRef(false);
  const selectedPathRef = useRef<ThreadlineCoord[]>([]);

  const foundIdSet = useMemo(() => new Set(foundIds), [foundIds]);
  const selectedKeys = useMemo(
    () => new Set(selectedPath.map(coordKey)),
    [selectedPath]
  );

  useEffect(() => {
    selectedPathRef.current = selectedPath;
  }, [selectedPath]);

  const wordById = useMemo(() => {
    const map = new Map<string, ThreadlineWord>();
    puzzle.words.forEach((word) => map.set(word.id, word));
    return map;
  }, [puzzle.words]);

  const foundCellKeys = useMemo(() => {
    const keys = new Set<string>();
    puzzle.words.forEach((word) => {
      if (!foundIdSet.has(word.id)) return;
      word.path.forEach((coord) => keys.add(coordKey(coord)));
    });
    return keys;
  }, [puzzle.words, foundIdSet]);

  const remainingWord = useMemo(
    () => puzzle.words.find((word) => !foundIdSet.has(word.id)) ?? null,
    [puzzle.words, foundIdSet]
  );
  const threadStats = useMemo(
    () =>
      puzzle.threads.map((thread) => {
        const words = puzzle.words.filter((word) => word.threadId === thread.id);
        const foundCount = words.filter((word) => foundIdSet.has(word.id)).length;
        return {
          ...thread,
          foundCount,
          totalCount: words.length,
          isComplete: foundCount === words.length,
        };
      }),
    [foundIdSet, puzzle.threads, puzzle.words]
  );

  const completedCount = foundIds.length;
  const isSolved = completedCount === puzzle.words.length;
  const hasUsedHint = hintedIds.length > 0;
  const longestWordLength = useMemo(
    () => Math.max(...puzzle.words.map((word) => word.answer.length)),
    [puzzle.words]
  );
  const dateLabel = useMemo(
    () =>
      activeDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [activeDate]
  );
  const puzzleNumber = useMemo(() => getPuzzleNumber(dateKey), [dateKey]);
  useEffect(() => {
    const checkDateRollover = () => {
      const nextKey = getLocalThreadlineDateKey();
      setDateKey((currentKey) => (currentKey === nextKey ? currentKey : nextKey));
    };
    checkDateRollover();
    const intervalId = setInterval(checkDateRollover, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    selectedPathRef.current = [];
    setSelectedPath([]);
    setFoundIds([]);
    setHintedIds([]);
    setHintCellKey(null);
    setStatusMessage(null);
    setElapsedSeconds(0);
    setIsTimerHidden(false);
    setIsBoardGestureActive(false);
    setGameState('playing');
    setShareStatus(null);
    hasCountedRef.current = false;
  }, [dateKey]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handlePointerUp = () => {
      isPointerDownRef.current = false;
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dateKey]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (!isSolved || gameState === 'won') return;
    setGameState('won');
    getStorage()?.setItem(`${STORAGE_PREFIX}:daily:${dateKey}`, '1');
  }, [dateKey, gameState, isSolved]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('threadline');
  }, [gameState]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  const completeWord = useCallback((word: ThreadlineWord) => {
    setFoundIds((prev) => (prev.includes(word.id) ? prev : [...prev, word.id]));
    setHintCellKey(null);
    isPointerDownRef.current = false;
    selectedPathRef.current = [];
    setSelectedPath([]);
    setStatusMessage(`${word.answer} filled in.`);
  }, []);

  const applySelection = useCallback(
    (nextPath: ThreadlineCoord[]) => {
      const matchedWord = findWordForPath(puzzle, nextPath, foundIdSet);
      if (matchedWord) {
        completeWord(matchedWord);
        return;
      }
      selectedPathRef.current = nextPath;
      setSelectedPath(nextPath);
    },
    [completeWord, foundIdSet, puzzle]
  );

  const handleCellPress = useCallback(
    (coord: ThreadlineCoord) => {
      if (gameState !== 'playing') return;
      const currentPath = selectedPathRef.current;
      const existingIndex = currentPath.findIndex((item) => sameCoord(item, coord));
      let nextPath: ThreadlineCoord[];

      if (existingIndex >= 0 && existingIndex === currentPath.length - 1) {
        return;
      }

      if (existingIndex >= 0) {
        nextPath = currentPath.slice(0, existingIndex + 1);
      } else if (canExtendSelection(currentPath, coord)) {
        nextPath = [...currentPath, coord];
      } else {
        nextPath = [coord];
      }

      if (nextPath.length > longestWordLength) {
        nextPath = [coord];
      }
      applySelection(nextPath);
    },
    [applySelection, gameState, longestWordLength]
  );

  const handleCellStart = useCallback(
    (coord: ThreadlineCoord) => {
      isPointerDownRef.current = true;
      const currentPath = selectedPathRef.current;
      const existingIndex = currentPath.findIndex((item) => sameCoord(item, coord));
      const canContinue =
        currentPath.length > 0 &&
        (existingIndex >= 0 || canExtendSelection(currentPath, coord));

      if (!canContinue) {
        selectedPathRef.current = [];
        setSelectedPath([]);
      }
      handleCellPress(coord);
    },
    [handleCellPress]
  );

  const handleHint = useCallback(() => {
    if (!remainingWord || hasUsedHint || gameState !== 'playing') return;
    setHintedIds((prev) =>
      prev.includes(remainingWord.id) ? prev : [...prev, remainingWord.id]
    );
    setHintCellKey(coordKey(remainingWord.path[0]));
    setStatusMessage(`${remainingWord.answer.length} letters: ${remainingWord.hint}`);
  }, [gameState, hasUsedHint, remainingWord]);

  const gridSize = puzzle.grid.length;
  const pageWidth = Math.max(0, Math.min(520, width - Spacing.lg * 2));
  const boardSize = Math.max(0, Math.min(430, pageWidth));
  const cellGap = 5;
  const boardPadding = Spacing.sm;
  const cellSize = Math.max(
    22,
    (boardSize - boardPadding * 2 - cellGap * (gridSize - 1)) / gridSize
  );
  const cellRadius = Math.max(6, Math.min(10, cellSize * 0.28));
  const cellFontSize = Math.max(12, Math.min(16, cellSize * 0.46));

  const coordFromBoardPoint = useCallback(
    (locationX: number, locationY: number): ThreadlineCoord | null => {
      const localX = locationX - boardPadding;
      const localY = locationY - boardPadding;
      const pitch = cellSize + cellGap;
      if (localX < 0 || localY < 0) return null;

      const col = Math.floor(localX / pitch);
      const row = Math.floor(localY / pitch);
      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return null;

      const cellX = localX - col * pitch;
      const cellY = localY - row * pitch;
      if (cellX > cellSize || cellY > cellSize) return null;

      return { row, col };
    },
    [boardPadding, cellGap, cellSize, gridSize]
  );

  const handleBoardPoint = useCallback(
    (locationX: number, locationY: number, resetPath = false) => {
      const coord = coordFromBoardPoint(locationX, locationY);
      if (!coord) return;
      if (resetPath) {
        selectedPathRef.current = [];
        setSelectedPath([]);
      }
      handleCellPress(coord);
    },
    [coordFromBoardPoint, handleCellPress]
  );

  const handleBoardResponderGrant = useCallback(
    (event: GestureResponderEvent) => {
      isPointerDownRef.current = true;
      setIsBoardGestureActive(true);
      handleBoardPoint(event.nativeEvent.locationX, event.nativeEvent.locationY, true);
    },
    [handleBoardPoint]
  );

  const handleBoardResponderMove = useCallback(
    (event: GestureResponderEvent) => {
      if (!isPointerDownRef.current) return;
      handleBoardPoint(event.nativeEvent.locationX, event.nativeEvent.locationY);
    },
    [handleBoardPoint]
  );

  const handleBoardResponderEnd = useCallback(() => {
    isPointerDownRef.current = false;
    setIsBoardGestureActive(false);
  }, []);

  const pointFromWebBoardEvent = useCallback((event: WebBoardEvent) => {
    const nativeEvent = event.nativeEvent ?? {};
    const touch = nativeEvent.touches?.[0] ?? nativeEvent.changedTouches?.[0] ?? null;
    const clientX = touch?.clientX ?? nativeEvent.clientX;
    const clientY = touch?.clientY ?? nativeEvent.clientY;
    const rect = event.currentTarget?.getBoundingClientRect?.();

    if (typeof clientX === 'number' && typeof clientY === 'number' && rect) {
      return {
        locationX: clientX - rect.left,
        locationY: clientY - rect.top,
      };
    }

    if (
      typeof nativeEvent.locationX === 'number' &&
      typeof nativeEvent.locationY === 'number'
    ) {
      return {
        locationX: nativeEvent.locationX,
        locationY: nativeEvent.locationY,
      };
    }

    return null;
  }, []);

  const handleWebBoardStart = useCallback(
    (event: WebBoardEvent) => {
      if (gameState !== 'playing') return;
      event.preventDefault?.();
      event.stopPropagation?.();
      const pointerId = event.nativeEvent?.pointerId;
      if (typeof pointerId === 'number') {
        event.currentTarget?.setPointerCapture?.(pointerId);
      }
      const point = pointFromWebBoardEvent(event);
      if (!point) return;
      isPointerDownRef.current = true;
      setIsBoardGestureActive(true);
      handleBoardPoint(point.locationX, point.locationY, true);
    },
    [gameState, handleBoardPoint, pointFromWebBoardEvent]
  );

  const handleWebBoardMove = useCallback(
    (event: WebBoardEvent) => {
      if (gameState !== 'playing' || !isPointerDownRef.current) return;
      const buttons = event.nativeEvent?.buttons;
      if (typeof buttons === 'number' && buttons === 0) {
        isPointerDownRef.current = false;
        setIsBoardGestureActive(false);
        return;
      }
      event.preventDefault?.();
      event.stopPropagation?.();
      const point = pointFromWebBoardEvent(event);
      if (!point) return;
      handleBoardPoint(point.locationX, point.locationY);
    },
    [gameState, handleBoardPoint, pointFromWebBoardEvent]
  );

  const handleWebBoardEnd = useCallback((event?: WebBoardEvent) => {
    const pointerId = event?.nativeEvent?.pointerId;
    if (typeof pointerId === 'number') {
      event?.currentTarget?.releasePointerCapture?.(pointerId);
    }
    isPointerDownRef.current = false;
    setIsBoardGestureActive(false);
  }, []);

  const webBoardHandlers = useMemo(
    () =>
      Platform.OS === 'web'
        ? {
            onPointerDown: handleWebBoardStart,
            onPointerMove: handleWebBoardMove,
            onPointerUp: handleWebBoardEnd,
            onPointerCancel: handleWebBoardEnd,
            onPointerLeave: handleWebBoardEnd,
            onTouchStart: handleWebBoardStart,
            onTouchMove: handleWebBoardMove,
            onTouchEnd: handleWebBoardEnd,
            onTouchCancel: handleWebBoardEnd,
          }
        : {},
    [handleWebBoardEnd, handleWebBoardMove, handleWebBoardStart]
  );

  const shareText = useMemo(() => {
    const threadLine = threadStats
      .map((thread) => `${thread.name} ${thread.foundCount}/${thread.totalCount}`)
      .join(' | ');
    return [
      `Threadline ${dateLabel} #${puzzleNumber}`,
      `${completedCount}/${puzzle.words.length} filled in ${formatTime(elapsedSeconds)}`,
      threadLine,
      hasUsedHint ? 'Hint used' : 'No hint',
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [
    completedCount,
    dateLabel,
    elapsedSeconds,
    hasUsedHint,
    puzzle.words.length,
    puzzleNumber,
    threadStats,
  ]);

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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Threadline',
          headerBackTitle: 'Home',
          headerStyle: { backgroundColor: Colors.backgroundSoft },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        scrollEnabled={Platform.OS === 'web' || !isBoardGestureActive}
      >
        <View style={styles.page}>
          <View style={styles.pageAccent} />
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleBlock}>
                <Text style={styles.kicker}>Daily Word Puzzle</Text>
                <Text style={styles.title}>Threadline</Text>
                <Text style={styles.subtitle}>
                  Daily puzzle #{puzzleNumber} - {dateLabel}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="How to play Threadline"
                style={({ pressed }) => [
                  styles.howToButton,
                  pressed && styles.howToButtonPressed,
                ]}
                onPress={() => setIsHowToOpen(true)}
              >
                <Text style={styles.howToButtonText}>How to play</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.stickyPuzzleDock}>
          <View style={styles.page}>
            <View style={styles.briefCard}>
              <View style={styles.briefMetaRow}>
                <Text style={styles.briefTitle}>{puzzle.title}</Text>
                <View style={styles.difficultyPill}>
                  <Text style={styles.difficultyText}>{puzzle.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.leadText}>
                {puzzle.lead.map((segment, index) => {
                  if (segment.type === 'text') {
                    return <Text key={`text-${index}`}>{segment.text}</Text>;
                  }
                  const word = wordById.get(segment.wordId);
                  const found = word ? foundIdSet.has(word.id) : false;
                  return (
                    <Text
                      key={`blank-${segment.wordId}-${index}`}
                      style={found ? styles.leadWordFound : styles.leadWordBlank}
                    >
                      {word ? (found ? word.answer : blankFor(word.answer)) : '_____'}
                    </Text>
                  );
                })}
              </Text>
            </View>

            <View style={styles.threadRow}>
              {threadStats.map((thread) => (
                <View
                  key={thread.id}
                  style={[
                    styles.threadCard,
                    thread.isComplete && styles.threadCardComplete,
                  ]}
                >
                  <View style={styles.threadHeader}>
                    <Text style={styles.threadName}>
                      {thread.foundCount > 0 || isSolved ? thread.name : 'Theme hidden'}
                    </Text>
                    <Text style={styles.threadCount}>
                      {thread.foundCount}/{thread.totalCount}
                    </Text>
                  </View>
                  <Text style={styles.threadClue}>
                    {thread.foundCount > 0 || isSolved ? thread.clue : 'Find a word to reveal it'}
                  </Text>
                  <View style={styles.threadMeter}>
                    {Array.from({ length: thread.totalCount }).map((_, index) => (
                      <View
                        key={`${thread.id}-${index}`}
                        style={[
                          styles.threadDot,
                          index < thread.foundCount && styles.threadDotFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.page}>
          <View style={styles.boardWrap}>
            <View
              style={[
                styles.board,
                {
                  width: boardSize,
                  gap: cellGap,
                  padding: boardPadding,
                },
              ]}
              onStartShouldSetResponderCapture={() => Platform.OS !== 'web' && gameState === 'playing'}
              onMoveShouldSetResponderCapture={() => Platform.OS !== 'web' && gameState === 'playing'}
              onStartShouldSetResponder={() => Platform.OS !== 'web' && gameState === 'playing'}
              onMoveShouldSetResponder={() => Platform.OS !== 'web' && gameState === 'playing'}
              onResponderGrant={handleBoardResponderGrant}
              onResponderMove={handleBoardResponderMove}
              onResponderRelease={handleBoardResponderEnd}
              onResponderTerminate={handleBoardResponderEnd}
              onResponderTerminationRequest={() => false}
              {...webBoardHandlers}
            >
              {puzzle.grid.map((row, rowIndex) => (
                <View
                  key={`row-${rowIndex}`}
                  style={[styles.boardRow, { gap: cellGap }]}
                >
                  {row.split('').map((letter, colIndex) => {
                    const coord = { row: rowIndex, col: colIndex };
                    const key = coordKey(coord);
                    const selected = selectedKeys.has(key);
                    const found = foundCellKeys.has(key);
                    const hinted = hintCellKey === key;
                    const cellStyle = [
                      styles.cell,
                      { width: cellSize, height: cellSize, borderRadius: cellRadius },
                      found && styles.cellFound,
                      selected && styles.cellSelected,
                      hinted && styles.cellHinted,
                    ];
                    const cellText = (
                      <Text
                        style={[
                          styles.cellText,
                          { fontSize: cellFontSize },
                          found && styles.cellTextFound,
                          selected && styles.cellTextSelected,
                        ]}
                      >
                        {letter}
                      </Text>
                    );
                    if (Platform.OS !== 'web') {
                      return (
                        <View
                          key={key}
                          style={cellStyle as ViewStyle[]}
                          accessibilityRole="button"
                          accessibilityLabel={`Letter ${letter}, row ${rowIndex + 1}, column ${
                            colIndex + 1
                          }`}
                          accessibilityState={{ selected }}
                        >
                          {cellText}
                        </View>
                      );
                    }
                    return (
                      <Pressable
                        key={key}
                        style={({ pressed }) => [
                          ...cellStyle,
                          pressed && styles.cellPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Letter ${letter}, row ${rowIndex + 1}, column ${
                          colIndex + 1
                        }`}
                        accessibilityState={{ selected }}
                        onPressIn={Platform.OS === 'web' ? undefined : () => handleCellStart(coord)}
                        onPress={Platform.OS === 'web' ? undefined : () => handleCellPress(coord)}
                        onHoverIn={
                          Platform.OS === 'web'
                            ? undefined
                            : () => {
                                if (isPointerDownRef.current) handleCellPress(coord);
                              }
                        }
                        {...(Platform.OS === 'web'
                          ? {
                              onMouseDown: () => {
                                handleCellStart(coord);
                              },
                              onMouseEnter: () => {
                                if (isPointerDownRef.current) handleCellPress(coord);
                              },
                              onMouseMove: (event: { buttons?: number }) => {
                                if (event.buttons !== 1) return;
                                if (!isPointerDownRef.current) {
                                  isPointerDownRef.current = true;
                                  selectedPathRef.current = [];
                                  setSelectedPath([]);
                                }
                                handleCellPress(coord);
                              },
                            }
                          : {})}
                      >
                        {cellText}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

          {gameState === 'won' && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Threadline complete</Text>
              <Text style={styles.resultSubtitle}>
                {formatTime(elapsedSeconds)} - {hasUsedHint ? 'hint used' : 'no hint'}
              </Text>
              <Text style={styles.weaveText}>{puzzle.weave}</Text>
              <Text style={styles.note}>{puzzle.note}</Text>
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
          )}

          {gameState === 'playing' && (
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.hintButton,
                  pressed && styles.hintButtonPressed,
                  hasUsedHint && styles.hintButtonDisabled,
                ]}
                onPress={handleHint}
                disabled={hasUsedHint}
              >
                <Text style={styles.hintButtonText}>{hasUsedHint ? 'Hint used' : 'Hint'}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isTimerHidden ? 'Show timer' : 'Hide timer'}
                style={({ pressed }) => [
                  styles.timerButton,
                  pressed && styles.timerButtonPressed,
                ]}
                onPress={() => setIsTimerHidden((hidden) => !hidden)}
              >
                <Text style={styles.timerButtonText}>
                  {isTimerHidden ? 'Time hidden' : formatTime(elapsedSeconds)}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <Modal
        visible={isHowToOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsHowToOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            accessible={false}
            onPress={() => setIsHowToOpen(false)}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How to play Threadline</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close how to play"
                style={({ pressed }) => [
                  styles.modalCloseButton,
                  pressed && styles.modalCloseButtonPressed,
                ]}
                onPress={() => setIsHowToOpen(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </Pressable>
            </View>
            <View style={styles.howToList}>
              {HOW_TO_STEPS.map((step, index) => (
                <View key={step} style={styles.howToStep}>
                  <View style={styles.howToStepNumber}>
                    <Text style={styles.howToStepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.howToStepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  const palette = {
    board: theme.mode === 'dark' ? '#151d24' : '#f5f2ea',
    found: theme.mode === 'dark' ? '#1f6f63' : '#d7f2e8',
    foundBorder: theme.mode === 'dark' ? '#46c2a8' : '#62b89d',
    selected: screenAccent.main,
    selectedText: theme.mode === 'dark' ? '#111827' : '#111827',
    hinted: theme.mode === 'dark' ? '#3d2f17' : '#fff0bd',
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollContent: {
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    stickyPuzzleDock: {
      backgroundColor: Colors.backgroundSoft,
      paddingTop: 4,
      paddingBottom: Spacing.sm,
      zIndex: 5,
      elevation: 5,
    },
    page: {
      ...ui.page,
    },
    pageAccent: {
      ...ui.accentBar,
      width: 90,
      marginBottom: Spacing.md,
    },
    header: {
      marginBottom: Spacing.md,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.md,
      flexWrap: 'wrap',
    },
    headerTitleBlock: {
      flex: 1,
      minWidth: 220,
    },
    kicker: {
      fontSize: 12,
      fontWeight: '800',
      color: screenAccent.main,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: FontSize.xxl,
      fontWeight: '800',
      color: Colors.text,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
    },
    howToButton: {
      minHeight: 38,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    howToButtonPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.98 }],
    },
    howToButtonText: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: screenAccent.badgeText,
    },
    briefCard: {
      ...ui.card,
      padding: Spacing.md,
    },
    briefMetaRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    briefTitle: {
      flex: 1,
      fontSize: FontSize.md,
      fontWeight: '800',
      color: Colors.text,
    },
    difficultyPill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
    },
    difficultyText: {
      fontSize: 11,
      fontWeight: '700',
      color: screenAccent.badgeText,
    },
    leadText: {
      marginTop: Spacing.sm,
      fontSize: 17,
      lineHeight: 25,
      fontWeight: '700',
      color: Colors.text,
    },
    leadWordBlank: {
      color: Colors.textMuted,
      letterSpacing: 1,
    },
    leadWordFound: {
      color: screenAccent.main,
      fontWeight: '800',
    },
    threadRow: {
      flexDirection: 'row',
      gap: Spacing.xs,
      marginTop: Spacing.sm,
    },
    threadCard: {
      flex: 1,
      minHeight: 84,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      padding: Spacing.sm,
      justifyContent: 'space-between',
    },
    threadCardComplete: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
    },
    threadHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.xs,
    },
    threadName: {
      flex: 1,
      fontSize: 13,
      fontWeight: '800',
      color: Colors.text,
    },
    threadCount: {
      fontSize: 11,
      fontWeight: '800',
      color: Colors.textMuted,
    },
    threadClue: {
      marginTop: 3,
      fontSize: 11,
      lineHeight: 15,
      color: Colors.textMuted,
    },
    threadMeter: {
      flexDirection: 'row',
      gap: 4,
      marginTop: Spacing.xs,
    },
    threadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    threadDotFilled: {
      backgroundColor: screenAccent.main,
      borderColor: screenAccent.main,
    },
    boardWrap: {
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    board: {
      backgroundColor: palette.board,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      position: 'relative',
      ...WEB_NO_SELECT,
    },
    boardRow: {
      flexDirection: 'row',
    },
    cell: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellPressed: {
      transform: [{ scale: 0.97 }],
    },
    cellSelected: {
      backgroundColor: palette.selected,
      borderColor: palette.selected,
      shadowColor: palette.selected,
      shadowOpacity: theme.mode === 'dark' ? 0.38 : 0.24,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
    },
    cellFound: {
      backgroundColor: palette.found,
      borderColor: palette.foundBorder,
    },
    cellHinted: {
      backgroundColor: palette.hinted,
      borderColor: screenAccent.main,
    },
    cellText: {
      fontWeight: '800',
      color: Colors.text,
    },
    cellTextSelected: {
      color: palette.selectedText,
    },
    cellTextFound: {
      color: theme.mode === 'dark' ? Colors.white : '#16594e',
    },
    statusText: {
      marginTop: Spacing.sm,
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      textAlign: 'center',
    },
    resultCard: {
      ...ui.card,
      marginTop: Spacing.lg,
      padding: Spacing.lg,
    },
    resultTitle: {
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: Colors.text,
    },
    resultSubtitle: {
      marginTop: 4,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    weaveText: {
      marginTop: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
      backgroundColor: screenAccent.badgeBg,
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '800',
      lineHeight: 22,
    },
    note: {
      marginTop: Spacing.sm,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 20,
    },
    shareBox: {
      marginTop: Spacing.md,
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.md,
    },
    shareText: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
    shareButton: {
      ...ui.cta,
      marginTop: Spacing.sm,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
    },
    shareButtonPressed: {
      backgroundColor: screenAccent.main,
      opacity: 0.92,
    },
    shareButtonText: {
      ...ui.ctaText,
      textTransform: 'none',
      letterSpacing: 0.6,
    },
    shareStatus: {
      marginTop: Spacing.xs,
      fontSize: 12,
      color: Colors.textMuted,
    },
    actions: {
      marginTop: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'stretch',
    },
    hintButton: {
      ...ui.cta,
      borderRadius: BorderRadius.lg,
      flex: 1,
    },
    hintButtonPressed: {
      ...ui.ctaPressed,
    },
    hintButtonDisabled: {
      opacity: 0.5,
    },
    hintButtonText: {
      ...ui.ctaText,
    },
    timerButton: {
      minHeight: 52,
      minWidth: 116,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      paddingHorizontal: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    timerButtonPressed: {
      backgroundColor: screenAccent.badgeBg,
      transform: [{ scale: 0.99 }],
    },
    timerButtonText: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: Colors.textSecondary,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(10, 16, 24, 0.48)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    modalCard: {
      width: '100%',
      maxWidth: 520,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.lg,
      ...theme.shadows.elevated,
      ...WEB_NO_SELECT,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.md,
    },
    modalTitle: {
      flex: 1,
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: Colors.text,
    },
    modalCloseButton: {
      minHeight: 34,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
    },
    modalCloseButtonPressed: {
      backgroundColor: screenAccent.badgeBg,
    },
    modalCloseText: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: Colors.textSecondary,
    },
    howToList: {
      marginTop: Spacing.lg,
      gap: Spacing.md,
    },
    howToStep: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    howToStepNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: screenAccent.badgeBg,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    howToStepNumberText: {
      fontSize: 13,
      fontWeight: '800',
      color: screenAccent.badgeText,
    },
    howToStepText: {
      flex: 1,
      fontSize: FontSize.sm,
      lineHeight: 21,
      color: Colors.textSecondary,
      fontWeight: '600',
    },
  });
};
