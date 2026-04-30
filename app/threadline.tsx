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
  type LayoutChangeEvent,
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
type FrameSize = { width: number; height: number };

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

function coordsBetween(
  start: ThreadlineCoord,
  end: ThreadlineCoord
): ThreadlineCoord[] | null {
  const rowDelta = end.row - start.row;
  const colDelta = end.col - start.col;
  if (rowDelta === 0 && colDelta === 0) return [];

  const rowAbs = Math.abs(rowDelta);
  const colAbs = Math.abs(colDelta);
  const isStraightLine = rowDelta === 0 || colDelta === 0 || rowAbs === colAbs;
  if (!isStraightLine) return null;

  const steps = Math.max(rowAbs, colAbs);
  const rowStep = Math.sign(rowDelta);
  const colStep = Math.sign(colDelta);

  return Array.from({ length: steps }, (_, index) => ({
    row: start.row + rowStep * (index + 1),
    col: start.col + colStep * (index + 1),
  }));
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
  const router = useRouter();
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('threadline', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const { width, height } = useWindowDimensions();
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
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);
  const [frameSize, setFrameSize] = useState<FrameSize>({ width: 0, height: 0 });
  const [playAreaSize, setPlayAreaSize] = useState<FrameSize>({ width: 0, height: 0 });
  const isPointerDownRef = useRef(false);
  const hasCountedRef = useRef(false);
  const selectedPathRef = useRef<ThreadlineCoord[]>([]);

  const foundIdSet = useMemo(() => new Set(foundIds), [foundIds]);
  const selectedKeys = useMemo(
    () => new Set(selectedPath.map(coordKey)),
    [selectedPath]
  );

  const isPhoneLayout = width <= 900 || (width <= 960 && height <= 600);
  const frameWidth = frameSize.width || width;
  const frameHeight = frameSize.height || height;
  const mobileHorizontalPadding = frameWidth <= 380 ? 10 : 12;
  const mobileVerticalPadding = frameHeight <= 680 ? 8 : 12;

  const handleFrameLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout;
    setFrameSize((current) => {
      if (
        Math.round(current.width) === Math.round(next.width) &&
        Math.round(current.height) === Math.round(next.height)
      ) {
        return current;
      }
      return { width: next.width, height: next.height };
    });
  }, []);

  const handlePlayAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout;
    setPlayAreaSize((current) => {
      if (
        Math.round(current.width) === Math.round(next.width) &&
        Math.round(current.height) === Math.round(next.height)
      ) {
        return current;
      }
      return { width: next.width, height: next.height };
    });
  }, []);

  useEffect(() => {
    selectedPathRef.current = selectedPath;
  }, [selectedPath]);

  const wordById = useMemo(() => {
    const map = new Map<string, ThreadlineWord>();
    puzzle.words.forEach((word) => map.set(word.id, word));
    return map;
  }, [puzzle.words]);

  const completedLeadText = useMemo(
    () =>
      puzzle.lead
        .map((segment) => {
          if (segment.type === 'text') return segment.text;
          return wordById.get(segment.wordId)?.answer ?? '';
        })
        .join(''),
    [puzzle.lead, wordById]
  );

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
    setIsCompletionOpen(false);
    hasCountedRef.current = false;
  }, [dateKey]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handlePointerDone = () => {
      isPointerDownRef.current = false;
      setIsBoardGestureActive(false);
    };
    window.addEventListener('pointerup', handlePointerDone);
    window.addEventListener('pointercancel', handlePointerDone);
    window.addEventListener('touchend', handlePointerDone);
    window.addEventListener('touchcancel', handlePointerDone);
    return () => {
      window.removeEventListener('pointerup', handlePointerDone);
      window.removeEventListener('pointercancel', handlePointerDone);
      window.removeEventListener('touchend', handlePointerDone);
      window.removeEventListener('touchcancel', handlePointerDone);
    };
  }, []);

  useEffect(() => {
    if (
      Platform.OS !== 'web' ||
      !isPhoneLayout ||
      typeof document === 'undefined' ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      bodyTouchAction: body.style.touchAction,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.touchAction = 'none';

    return () => {
      html.style.overflow = previous.htmlOverflow;
      html.style.overscrollBehavior = previous.htmlOverscrollBehavior;
      body.style.overflow = previous.bodyOverflow;
      body.style.overscrollBehavior = previous.bodyOverscrollBehavior;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      body.style.height = previous.bodyHeight;
      body.style.touchAction = previous.bodyTouchAction;
      window.scrollTo(0, scrollY);
    };
  }, [isPhoneLayout]);

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
    setIsCompletionOpen(true);
    setStatusMessage(null);
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
    setStatusMessage(`Found ${word.answer}`);
  }, []);

  const commitPath = useCallback(
    (nextPath: ThreadlineCoord[]) => {
      const matchedWord = findWordForPath(puzzle, nextPath, foundIdSet);
      if (matchedWord) {
        completeWord(matchedWord);
        return true;
      }
      selectedPathRef.current = nextPath;
      setSelectedPath(nextPath);
      return false;
    },
    [completeWord, foundIdSet, puzzle]
  );

  const handleCellPress = useCallback(
    (coord: ThreadlineCoord) => {
      if (gameState !== 'playing') return;
      const currentPath = selectedPathRef.current;
      const existingIndex = currentPath.findIndex((item) => sameCoord(item, coord));

      if (existingIndex >= 0 && existingIndex === currentPath.length - 1) {
        return;
      }

      if (existingIndex >= 0) {
        commitPath(currentPath.slice(0, existingIndex + 1));
        return;
      }

      if (currentPath.length === 0) {
        commitPath([coord]);
        return;
      }

      const last = currentPath[currentPath.length - 1];
      const bridge = coordsBetween(last, coord);
      if (!bridge) return;

      let nextPath = currentPath;
      for (const stepCoord of bridge) {
        const loopIndex = nextPath.findIndex((item) => sameCoord(item, stepCoord));
        if (loopIndex >= 0) {
          commitPath(nextPath.slice(0, loopIndex + 1));
          return;
        }

        if (!canExtendSelection(nextPath, stepCoord)) return;

        const candidatePath = [...nextPath, stepCoord];
        if (candidatePath.length > longestWordLength) return;

        const didComplete = commitPath(candidatePath);
        if (didComplete) return;
        nextPath = candidatePath;
      }
    },
    [commitPath, gameState, longestWordLength]
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
  const measuredPlayAreaWidth =
    playAreaSize.width || Math.max(0, frameWidth - mobileHorizontalPadding * 2);
  const measuredPlayAreaHeight = playAreaSize.height || 0;
  const mobileReservedHeight =
    mobileVerticalPadding * 2 +
    (frameHeight <= 680 ? 34 : 38) +
    (frameHeight <= 680 ? 142 : 156) +
    (frameHeight <= 680 ? 46 : 52) +
    (frameHeight <= 680 ? 18 : 24);
  const mobileBoardFallback = Math.max(160, frameHeight - mobileReservedHeight);
  const mobileBoardLimit =
    measuredPlayAreaHeight > 0
      ? Math.max(0, measuredPlayAreaHeight - 8)
      : mobileBoardFallback;
  const pageWidth = isPhoneLayout
    ? Math.max(0, measuredPlayAreaWidth)
    : Math.max(0, Math.min(520, width - Spacing.lg * 2));
  const boardSize = Math.floor(
    Math.max(
      0,
      Math.min(430, pageWidth, isPhoneLayout ? mobileBoardLimit : pageWidth)
    )
  );
  const cellGap = isPhoneLayout ? (boardSize < 310 ? 3 : 4) : 5;
  const boardPadding = isPhoneLayout ? (boardSize < 310 ? 5 : 6) : Spacing.sm;
  const fittedCellSize =
    (boardSize - boardPadding * 2 - cellGap * (gridSize - 1)) / gridSize;
  const cellSize = isPhoneLayout
    ? Math.max(14, fittedCellSize)
    : Math.max(22, fittedCellSize);
  const cellRadius = Math.max(6, Math.min(10, cellSize * 0.28));
  const cellFontSize = Math.max(12, Math.min(16, cellSize * 0.46));

  const coordFromBoardPoint = useCallback(
    (locationX: number, locationY: number): ThreadlineCoord | null => {
      const localX = locationX - boardPadding;
      const localY = locationY - boardPadding;
      const pitch = cellSize + cellGap;
      const gridPixelSize = gridSize * cellSize + (gridSize - 1) * cellGap;
      const edgeTolerance = Math.max(10, Math.min(18, cellSize * 0.45));

      if (
        localX < -edgeTolerance ||
        localY < -edgeTolerance ||
        localX > gridPixelSize + edgeTolerance ||
        localY > gridPixelSize + edgeTolerance
      ) {
        return null;
      }

      const col = Math.max(
        0,
        Math.min(gridSize - 1, Math.round((localX - cellSize / 2) / pitch))
      );
      const row = Math.max(
        0,
        Math.min(gridSize - 1, Math.round((localY - cellSize / 2) / pitch))
      );

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
      setShareStatus('Copy unavailable');
      return;
    }
    try {
      await clipboard.writeText(shareText);
      setShareStatus('Copied');
    } catch {
      setShareStatus('Could not copy');
    }
  }, [shareText]);

  const handleMoreGames = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleBackToPuzzle = useCallback(() => {
    setIsCompletionOpen(false);
  }, []);

  const screenOptions = {
    title: 'Threadline',
    headerShown: !isPhoneLayout,
    headerBackTitle: 'Home',
    headerStyle: { backgroundColor: Colors.backgroundSoft },
    headerTintColor: Colors.text,
    headerShadowVisible: false,
    headerTitleStyle: { fontWeight: '700' as const },
  };

  const renderHeader = (compact = false) => (
    <View style={[styles.page, compact && styles.mobilePage, compact && styles.mobileHeaderPage]}>
      {!compact && <View style={styles.pageAccent} />}
      <View style={[styles.header, compact && styles.mobileHeader]}>
        <View style={[styles.headerTopRow, compact && styles.mobileHeaderTopRow]}>
          {compact && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to games"
              style={({ pressed }) => [
                styles.mobileBackButton,
                pressed && styles.mobileBackButtonPressed,
              ]}
              onPress={handleMoreGames}
            >
              <Text style={styles.mobileBackButtonText}>Back</Text>
            </Pressable>
          )}
          <View style={[styles.headerTitleBlock, compact && styles.mobileHeaderTitleBlock]}>
            {!compact && <Text style={styles.kicker}>Daily Word Puzzle</Text>}
            <Text style={[styles.title, compact && styles.mobileTitle]}>Threadline</Text>
            <Text style={[styles.subtitle, compact && styles.mobileSubtitle]}>
              Puzzle #{puzzleNumber} · {dateLabel}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="How to play Threadline"
            style={({ pressed }) => [
              styles.howToButton,
              compact && styles.mobileHowToButton,
              pressed && styles.howToButtonPressed,
            ]}
            onPress={() => setIsHowToOpen(true)}
          >
            <Text style={[styles.howToButtonText, compact && styles.mobileHowToButtonText]}>
              How to play
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderLeadSegments = () =>
    puzzle.lead.map((segment, index) => {
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
    });

  const renderPuzzleDock = (compact = false) => {
    if (compact) {
      return (
        <View style={styles.mobilePuzzleDock}>
          <View style={styles.mobilePuzzleDockCard}>
            <View style={styles.mobileDockMetaRow}>
              <Text style={styles.mobileDockTitle} numberOfLines={1}>
                {puzzle.title}
              </Text>
              <View style={styles.mobileDockProgressPill}>
                <Text style={styles.mobileDockProgressText}>
                  {completedCount}/{puzzle.words.length}
                </Text>
              </View>
            </View>
            <Text style={styles.mobileDockLead}>
              {renderLeadSegments()}
            </Text>
            <View style={styles.mobileThemeMiniRow}>
              {threadStats.map((thread) => {
                const isRevealed = thread.foundCount > 0 || isSolved;
                const themeName = isRevealed ? thread.name : 'Theme hidden';
                return (
                  <View
                    key={thread.id}
                    style={[
                      styles.mobileThemeMiniCard,
                      isRevealed && styles.mobileThemeMiniCardRevealed,
                      thread.isComplete && styles.mobileThemeMiniCardComplete,
                    ]}
                  >
                    <View style={styles.mobileThemeMiniHeader}>
                      <Text style={styles.mobileThemeMiniName} numberOfLines={1}>
                        {themeName}
                      </Text>
                      <Text style={styles.mobileThemeMiniCount}>
                        {thread.foundCount}/{thread.totalCount}
                      </Text>
                    </View>
                    <Text style={styles.mobileThemeMiniClue} numberOfLines={2}>
                      {isRevealed ? thread.clue : 'Find one to reveal theme'}
                    </Text>
                    <View style={styles.mobileThemeMiniMeter}>
                      {Array.from({ length: thread.totalCount }).map((_, index) => (
                        <View
                          key={`${thread.id}-mobile-${index}`}
                          style={[
                            styles.mobileThemeMiniDot,
                            index < thread.foundCount && styles.mobileThemeMiniDotFilled,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.stickyPuzzleDock}>
      <View style={[styles.page, compact && styles.mobilePage]}>
        <View style={[styles.briefCard, compact && styles.mobileBriefCard]}>
          <View style={styles.briefMetaRow}>
            <Text style={[styles.briefTitle, compact && styles.mobileBriefTitle]}>
              {puzzle.title}
            </Text>
            <View style={[styles.difficultyPill, compact && styles.mobileDifficultyPill]}>
              <Text style={[styles.difficultyText, compact && styles.mobileDifficultyText]}>
                {puzzle.difficulty}
              </Text>
            </View>
          </View>
          <Text
            style={[styles.leadText, compact && styles.mobileLeadText]}
            numberOfLines={compact ? 3 : undefined}
          >
            {renderLeadSegments()}
          </Text>
        </View>

        <View style={[styles.threadRow, compact && styles.mobileThreadRow]}>
          {threadStats.map((thread) => (
            <View
              key={thread.id}
              style={[
                styles.threadCard,
                compact && styles.mobileThreadCard,
                thread.isComplete && styles.threadCardComplete,
              ]}
            >
              <View style={styles.threadHeader}>
                <Text
                  style={[styles.threadName, compact && styles.mobileThreadName]}
                  numberOfLines={1}
                >
                  {thread.foundCount > 0 || isSolved ? thread.name : 'Theme hidden'}
                </Text>
                <Text style={[styles.threadCount, compact && styles.mobileThreadCount]}>
                  {thread.foundCount}/{thread.totalCount}
                </Text>
              </View>
              <Text
                style={[styles.threadClue, compact && styles.mobileThreadClue]}
                numberOfLines={compact ? 1 : undefined}
              >
                {thread.foundCount > 0 || isSolved ? thread.clue : 'Find one to reveal theme'}
              </Text>
              <View style={[styles.threadMeter, compact && styles.mobileThreadMeter]}>
                {Array.from({ length: thread.totalCount }).map((_, index) => (
                  <View
                    key={`${thread.id}-${index}`}
                    style={[
                      styles.threadDot,
                      compact && styles.mobileThreadDot,
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
    );
  };

  const renderBoard = (compact = false) => (
    <View
      style={[
        styles.boardWrap,
        compact && styles.mobileBoardWrap,
        compact && { width: boardSize, height: boardSize },
      ]}
    >
      <View
        style={[
          styles.board,
          {
            width: boardSize,
            height: boardSize,
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
        {...(webBoardHandlers as object)}
      >
        {puzzle.grid.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.boardRow, { gap: cellGap }]}>
            {row.split('').map((letter, colIndex) => {
              const coord = { row: rowIndex, col: colIndex };
              const key = coordKey(coord);
              const selected = selectedKeys.has(key);
              const found = foundCellKeys.has(key);
              const hinted = hintCellKey === key;
              const cellStyle = [
                styles.cell,
                styles.cellPassive,
                { width: cellSize, height: cellSize, borderRadius: cellRadius },
                found && styles.cellFound,
                selected && styles.cellSelected,
                hinted && styles.cellHinted,
              ];
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
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );

  const renderStatus = (compact = false) => {
    if (!statusMessage) return null;
    if (compact) {
      return (
        <View style={styles.mobileStatusToast}>
          <Text style={styles.mobileStatusText}>{statusMessage}</Text>
        </View>
      );
    }
    return <Text style={styles.statusText}>{statusMessage}</Text>;
  };

  const renderActions = (compact = false) => {
    if (gameState !== 'playing') {
      if (!compact || isCompletionOpen) return null;
      return (
        <View style={[styles.actions, styles.mobileActions]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show Threadline results"
            style={({ pressed }) => [
              styles.hintButton,
              styles.mobileHintButton,
              pressed && styles.hintButtonPressed,
            ]}
            onPress={() => setIsCompletionOpen(true)}
          >
            <Text style={[styles.hintButtonText, styles.mobileActionText]}>Results</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go to more Daybreak games"
            style={({ pressed }) => [
              styles.timerButton,
              styles.mobileTimerButton,
              pressed && styles.timerButtonPressed,
            ]}
            onPress={handleMoreGames}
          >
            <Text style={[styles.timerButtonText, styles.mobileTimerButtonText]}>
              More games
            </Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={[styles.actions, compact && styles.mobileActions]}>
        <Pressable
          style={({ pressed }) => [
            styles.hintButton,
            compact && styles.mobileHintButton,
            pressed && styles.hintButtonPressed,
            hasUsedHint && styles.hintButtonDisabled,
          ]}
          onPress={handleHint}
          disabled={hasUsedHint}
        >
          <Text style={[styles.hintButtonText, compact && styles.mobileActionText]}>
            {hasUsedHint ? 'Hint used' : 'Hint'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isTimerHidden ? 'Show timer' : 'Hide timer'}
          style={({ pressed }) => [
            styles.timerButton,
            compact && styles.mobileTimerButton,
            pressed && styles.timerButtonPressed,
          ]}
          onPress={() => setIsTimerHidden((hidden) => !hidden)}
        >
          <Text style={[styles.timerButtonText, compact && styles.mobileTimerButtonText]}>
            {isTimerHidden ? 'Timer hidden' : formatTime(elapsedSeconds)}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderResult = (compact = false) => {
    if (gameState !== 'won') return null;
    return (
      <View style={[styles.resultCard, compact && styles.mobileResultCard]}>
        <Text style={[styles.resultTitle, compact && styles.mobileResultTitle]}>
          Threadline complete
        </Text>
        <Text style={styles.resultSubtitle}>
          Solved in {formatTime(elapsedSeconds)} · {hasUsedHint ? 'Hint used' : 'No hint'}
        </Text>
        <Text style={[styles.resultSectionLabel, compact && styles.mobileResultSectionLabel]}>
          The line
        </Text>
        <Text style={[styles.completedLineText, compact && styles.mobileCompletedLineText]}>
          {completedLeadText}
        </Text>
        <Text style={[styles.weaveText, compact && styles.mobileWeaveText]}>
          {puzzle.weave}
        </Text>
        <Text style={[styles.note, compact && styles.mobileNote]}>{puzzle.note}</Text>
        {!compact && (
          <View style={styles.shareBox}>
            <Text selectable style={styles.shareText}>
              {shareText}
            </Text>
          </View>
        )}
        <View style={[styles.resultActions, compact && styles.mobileResultActions]}>
          {Platform.OS === 'web' && (
            <Pressable
              style={({ pressed }) => [
                styles.shareButton,
                compact && styles.mobileShareButton,
                pressed && styles.shareButtonPressed,
              ]}
              onPress={handleCopyResults}
            >
              <Text style={styles.shareButtonText}>Copy results</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go to more Daybreak games"
            style={({ pressed }) => [
              styles.moreGamesButton,
              compact && styles.mobileMoreGamesButton,
              pressed && styles.moreGamesButtonPressed,
            ]}
            onPress={handleMoreGames}
          >
            <Text style={[styles.moreGamesButtonText, compact && styles.mobileMoreGamesText]}>
              More games
            </Text>
          </Pressable>
          {compact && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Return to the completed puzzle"
              style={({ pressed }) => [
                styles.backToPuzzleButton,
                pressed && styles.backToPuzzleButtonPressed,
              ]}
              onPress={handleBackToPuzzle}
            >
              <Text style={styles.backToPuzzleButtonText}>Back to puzzle</Text>
            </Pressable>
          )}
        </View>
        {shareStatus && <Text style={styles.shareStatus}>{shareStatus}</Text>}
      </View>
    );
  };

  const completionModal = (
    <Modal
      visible={isPhoneLayout && gameState === 'won' && isCompletionOpen}
      transparent
      animationType="fade"
      onRequestClose={handleBackToPuzzle}
    >
      <View style={styles.mobileResultLayer}>
        <Pressable
          style={styles.modalBackdrop}
          accessible={false}
          onPress={handleBackToPuzzle}
        />
        {renderResult(true)}
      </View>
    </Modal>
  );

  const howToModal = (
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
  );

  if (isPhoneLayout) {
    return (
      <SafeAreaView
        style={[styles.container, styles.mobileContainer]}
        edges={['bottom']}
        onLayout={handleFrameLayout}
      >
        <Stack.Screen options={screenOptions} />
        <View
          style={[
            styles.mobileGameFrame,
            {
              paddingHorizontal: mobileHorizontalPadding,
              paddingTop: mobileVerticalPadding,
              paddingBottom: mobileVerticalPadding,
            },
          ]}
        >
          {renderHeader(true)}
          {renderPuzzleDock(true)}
          <View style={styles.mobilePlayArea} onLayout={handlePlayAreaLayout}>
            {renderBoard(true)}
            {renderStatus(true)}
          </View>
          {renderActions(true)}
        </View>
        {completionModal}
        {howToModal}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']} onLayout={handleFrameLayout}>
      <Stack.Screen options={screenOptions} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
        scrollEnabled={Platform.OS === 'web' || !isBoardGestureActive}
      >
        {renderHeader()}
        {renderPuzzleDock()}

        <View style={styles.page}>
          {renderBoard()}
          {renderStatus()}
          {renderResult()}
          {renderActions()}
        </View>
      </ScrollView>
      {howToModal}
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
    mobileContainer: {
      overflow: 'hidden',
    },
    mobileGameFrame: {
      flex: 1,
      width: '100%',
      maxWidth: 520,
      alignSelf: 'center',
      overflow: 'hidden',
      justifyContent: 'flex-start',
      gap: 8,
    },
    mobilePlayArea: {
      flex: 1,
      minHeight: 0,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      paddingTop: 8,
      overflow: 'hidden',
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
    mobilePage: {
      maxWidth: '100%',
      alignSelf: 'stretch',
    },
    mobileHeaderPage: {
      flexShrink: 0,
    },
    pageAccent: {
      ...ui.accentBar,
      width: 90,
      marginBottom: Spacing.md,
    },
    mobilePageAccent: {
      width: 52,
      height: 4,
      marginBottom: 6,
    },
    header: {
      marginBottom: Spacing.md,
    },
    mobileHeader: {
      marginBottom: 0,
    },
    headerTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.md,
      flexWrap: 'wrap',
    },
    mobileHeaderTopRow: {
      alignItems: 'center',
      gap: Spacing.sm,
      flexWrap: 'nowrap',
    },
    headerTitleBlock: {
      flex: 1,
      minWidth: 220,
    },
    mobileHeaderTitleBlock: {
      minWidth: 0,
    },
    mobileBackButton: {
      minHeight: 30,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      paddingHorizontal: 9,
      justifyContent: 'center',
      ...WEB_NO_SELECT,
    },
    mobileBackButtonPressed: {
      backgroundColor: screenAccent.badgeBg,
      transform: [{ scale: 0.98 }],
    },
    mobileBackButtonText: {
      fontSize: 11,
      fontWeight: '800',
      color: Colors.textSecondary,
    },
    kicker: {
      fontSize: 12,
      fontWeight: '800',
      color: screenAccent.main,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: Spacing.xs,
    },
    mobileKicker: {
      fontSize: 9,
      letterSpacing: 0.8,
      marginBottom: 1,
    },
    title: {
      fontSize: FontSize.xxl,
      fontWeight: '800',
      color: Colors.text,
    },
    mobileTitle: {
      fontSize: 24,
      lineHeight: 27,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      marginTop: Spacing.xs,
    },
    mobileSubtitle: {
      fontSize: 12,
      marginTop: 1,
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
    mobileHowToButton: {
      minHeight: 30,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
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
    mobileHowToButtonText: {
      fontSize: 11,
    },
    briefCard: {
      ...ui.card,
      padding: Spacing.md,
    },
    mobilePuzzleDock: {
      width: '100%',
      paddingTop: 0,
      paddingBottom: 0,
      zIndex: 1,
      elevation: 0,
      flexShrink: 0,
    },
    mobilePuzzleDockCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      paddingHorizontal: 14,
      paddingVertical: 11,
      gap: 9,
    },
    mobileDockMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    mobileDockTitle: {
      flex: 1,
      fontSize: 18,
      lineHeight: 21,
      fontWeight: '800',
      color: Colors.text,
    },
    mobileDockProgressPill: {
      minWidth: 44,
      minHeight: 28,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 9,
    },
    mobileDockProgressText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.textMuted,
    },
    mobileDockLead: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
      color: Colors.text,
    },
    mobileThemeMiniRow: {
      flexDirection: 'row',
      gap: 8,
    },
    mobileThemeMiniCard: {
      flex: 1,
      minHeight: 74,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      padding: 8,
      justifyContent: 'space-between',
    },
    mobileThemeMiniCardRevealed: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
    },
    mobileThemeMiniCardComplete: {
      backgroundColor: theme.mode === 'dark' ? '#173b34' : '#e2f7ef',
      borderColor: theme.mode === 'dark' ? '#48c5ad' : '#77bea8',
    },
    mobileThemeMiniHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },
    mobileThemeMiniName: {
      flex: 1,
      minWidth: 0,
      fontSize: 12,
      lineHeight: 14,
      fontWeight: '800',
      color: Colors.text,
    },
    mobileThemeMiniCount: {
      fontSize: 11,
      lineHeight: 13,
      fontWeight: '800',
      color: Colors.textMuted,
    },
    mobileThemeMiniClue: {
      marginTop: 4,
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '600',
      color: Colors.textMuted,
    },
    mobileThemeMiniMeter: {
      flexDirection: 'row',
      gap: 3,
      marginTop: 5,
    },
    mobileThemeMiniDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.mode === 'dark' ? Colors.white : Colors.surface,
      borderWidth: 1,
      borderColor: theme.mode === 'dark' ? Colors.white : Colors.border,
      opacity: theme.mode === 'dark' ? 0.82 : 1,
    },
    mobileThemeMiniDotFilled: {
      backgroundColor: screenAccent.main,
      borderColor: screenAccent.main,
      opacity: 1,
    },
    mobileBriefCard: {
      borderRadius: BorderRadius.md,
      padding: Spacing.sm,
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
    mobileBriefTitle: {
      fontSize: 13,
      lineHeight: 16,
    },
    difficultyPill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 3,
    },
    mobileDifficultyPill: {
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    difficultyText: {
      fontSize: 11,
      fontWeight: '700',
      color: screenAccent.badgeText,
    },
    mobileDifficultyText: {
      fontSize: 9,
    },
    leadText: {
      marginTop: Spacing.sm,
      fontSize: 17,
      lineHeight: 25,
      fontWeight: '700',
      color: Colors.text,
    },
    mobileLeadText: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 16,
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
    mobileThreadRow: {
      gap: 6,
      marginTop: 6,
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
    mobileThreadCard: {
      minHeight: 54,
      borderRadius: BorderRadius.sm,
      padding: 6,
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
    mobileThreadName: {
      fontSize: 11,
      lineHeight: 13,
    },
    threadCount: {
      fontSize: 11,
      fontWeight: '800',
      color: Colors.textMuted,
    },
    mobileThreadCount: {
      fontSize: 9,
    },
    threadClue: {
      marginTop: 3,
      fontSize: 11,
      lineHeight: 15,
      color: Colors.textMuted,
    },
    mobileThreadClue: {
      marginTop: 2,
      fontSize: 9,
      lineHeight: 11,
    },
    threadMeter: {
      flexDirection: 'row',
      gap: 4,
      marginTop: Spacing.xs,
    },
    mobileThreadMeter: {
      gap: 3,
      marginTop: 3,
    },
    threadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    mobileThreadDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    threadDotFilled: {
      backgroundColor: screenAccent.main,
      borderColor: screenAccent.main,
    },
    boardWrap: {
      alignItems: 'center',
      marginTop: Spacing.lg,
    },
    mobileBoardWrap: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      flexShrink: 0,
      overflow: 'visible',
    },
    board: {
      backgroundColor: palette.board,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      position: 'relative',
      alignSelf: 'center',
      ...WEB_NO_SELECT,
    },
    boardRow: {
      flexDirection: 'row',
      zIndex: 1,
    },
    cell: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    cellPassive: {
      pointerEvents: 'none',
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
    mobileStatusToast: {
      position: 'absolute',
      bottom: 4,
      alignSelf: 'center',
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: Colors.surfaceElevated,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 5,
      ...theme.shadows.card,
    },
    mobileStatusText: {
      color: Colors.textSecondary,
      fontSize: 11,
      fontWeight: '800',
    },
    resultCard: {
      ...ui.card,
      marginTop: Spacing.lg,
      padding: Spacing.lg,
    },
    mobileResultLayer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(10, 16, 24, 0.52)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.md,
    },
    mobileResultCard: {
      width: '100%',
      maxWidth: 360,
      maxHeight: '92%',
      marginTop: 0,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    resultTitle: {
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: Colors.text,
    },
    mobileResultTitle: {
      fontSize: FontSize.md,
    },
    resultSubtitle: {
      marginTop: 4,
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    resultSectionLabel: {
      marginTop: Spacing.md,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: Colors.textMuted,
    },
    mobileResultSectionLabel: {
      marginTop: Spacing.sm,
      fontSize: 10,
    },
    completedLineText: {
      marginTop: 6,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      color: Colors.text,
      fontSize: FontSize.sm,
      lineHeight: 21,
      fontWeight: '700',
    },
    mobileCompletedLineText: {
      padding: Spacing.sm,
      fontSize: 12,
      lineHeight: 17,
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
    mobileWeaveText: {
      marginTop: Spacing.sm,
      padding: Spacing.sm,
      fontSize: 13,
      lineHeight: 18,
    },
    note: {
      marginTop: Spacing.sm,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 20,
    },
    mobileNote: {
      fontSize: 12,
      lineHeight: 16,
    },
    shareBox: {
      marginTop: Spacing.md,
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.md,
    },
    mobileShareBox: {
      marginTop: Spacing.sm,
      padding: Spacing.sm,
    },
    shareText: {
      fontSize: 12,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
    mobileShareText: {
      fontSize: 10,
      lineHeight: 14,
    },
    shareButton: {
      ...ui.cta,
      flex: 1,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
    },
    mobileShareButton: {
      minHeight: 38,
      paddingVertical: 8,
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
    resultActions: {
      marginTop: Spacing.md,
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'stretch',
    },
    mobileResultActions: {
      marginTop: Spacing.sm,
      flexDirection: 'column',
      gap: 8,
    },
    moreGamesButton: {
      flex: 1,
      minHeight: 42,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      ...WEB_NO_SELECT,
    },
    mobileMoreGamesButton: {
      minHeight: 38,
    },
    moreGamesButtonPressed: {
      opacity: 0.84,
      transform: [{ scale: 0.99 }],
    },
    moreGamesButtonText: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: screenAccent.badgeText,
    },
    mobileMoreGamesText: {
      fontSize: 12,
    },
    backToPuzzleButton: {
      minHeight: 32,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 4,
      ...WEB_NO_SELECT,
    },
    backToPuzzleButtonPressed: {
      opacity: 0.72,
    },
    backToPuzzleButtonText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.textMuted,
    },
    actions: {
      marginTop: Spacing.lg,
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'stretch',
    },
    mobileActions: {
      marginTop: 0,
      gap: Spacing.sm,
      flexShrink: 0,
    },
    hintButton: {
      ...ui.cta,
      borderRadius: BorderRadius.lg,
      flex: 1,
    },
    mobileHintButton: {
      minHeight: 42,
      borderRadius: BorderRadius.md,
      paddingVertical: 9,
      paddingHorizontal: Spacing.md,
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
    mobileActionText: {
      fontSize: 12,
      letterSpacing: 0.9,
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
    mobileTimerButton: {
      minHeight: 42,
      minWidth: 96,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.sm,
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
    mobileTimerButtonText: {
      fontSize: 12,
      letterSpacing: 0.3,
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
