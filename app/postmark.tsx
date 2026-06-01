import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  useWindowDimensions,
  type GestureResponderEvent,
  type ViewStyle,
} from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import {
  getDailyPostmarkPackEntry,
  validatePostmarkRoutes,
  type PostmarkCoord,
  type PostmarkPuzzle,
  type PostmarkRouteState,
  type PostmarkStart,
} from '../src/data/postmarkPuzzles';
import { getPostmarkStampForStart } from '../src/data/postmarkStamps';
import { PostmarkStampOnBoard } from '../src/ui/PostmarkStamp';
import { formatUtcDateLabel } from '../src/utils/dailyUtc';

type GameState = 'playing' | 'won';

interface HistoryEntry {
  routes: PostmarkRouteState;
  activeStartId: string | null;
}

interface PersistedPostmarkState {
  version: 3;
  routes: PostmarkRouteState;
  history: HistoryEntry[];
  activeStartId: string | null;
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
}

type RouteHit = { startId: string; index: number } | null;
type InstructionDiagramKind = 'start' | 'count' | 'post' | 'double-post' | 'empty-cells' | 'auto-solve';

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
    locationX?: number;
    locationY?: number;
    clientX?: number;
    clientY?: number;
    pointerId?: number;
    buttons?: number;
    touches?: WebBoardTouch[];
    changedTouches?: WebBoardTouch[];
  };
};

const STORAGE_PREFIX = 'postmark';
const PROGRESS_STORAGE_VERSION = 3;
const POSTMARK_EMOJI = '📮';
const POSTMARK_BLUE = '#1547D6';
const ROUTE_COLORS = ['#cf6682', '#9274d7', '#52b99e', '#e4b63f', '#c87564', '#579fdb', '#86b45f', '#d28f55'];
const BOARD_BACKGROUND = '#fffdf8';
const BOARD_LINE = 'rgba(64, 49, 38, 0.115)';
const INK = '#342b25';
const PAGE_BACKGROUND = '#f5f1eb';
const SURFACE = '#fffdf8';
const SOFT_BORDER = '#ded5c9';
const POST_HIGHLIGHT_FILL = 'rgba(21, 71, 214, 0.1)';
const POST_HIGHLIGHT_DOUBLE_FILL = 'rgba(21, 71, 214, 0.16)';
const POST_HIGHLIGHT_STROKE = POSTMARK_BLUE;
const POST_HIGHLIGHT_INNER_STROKE = 'rgba(21, 71, 214, 0.42)';
const SOLVE_CONFETTI_COLORS = [
  POSTMARK_BLUE,
  '#cf6682',
  '#9274d7',
  '#52b99e',
  '#e4b63f',
  '#c87564',
  '#579fdb',
  '#86b45f',
];
const AnimatedPath = Animated.createAnimatedComponent(Path);
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
const WEB_FULL_HEIGHT =
  Platform.OS === 'web' ? ({ minHeight: '100vh' } as unknown as ViewStyle) : {};

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
    // Keep the puzzle playable when storage is unavailable.
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

function makeCoordKey(coord: PostmarkCoord): string {
  return `${coord.row}:${coord.col}`;
}

function coordsEqual(a: PostmarkCoord, b: PostmarkCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function areNeighbors(a: PostmarkCoord, b: PostmarkCoord): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function cloneRouteState(routes: PostmarkRouteState): PostmarkRouteState {
  return Object.fromEntries(
    Object.entries(routes).map(([startId, cells]) => [
      startId,
      cells.map((cell) => ({ ...cell })),
    ])
  ) as PostmarkRouteState;
}

function buildInitialRoutes(puzzle: PostmarkPuzzle): PostmarkRouteState {
  return Object.fromEntries(
    puzzle.starts.map((start) => [start.id, [{ ...start.entry }]])
  ) as PostmarkRouteState;
}

function sanitizeRouteState(puzzle: PostmarkPuzzle, rawRoutes: unknown): PostmarkRouteState {
  const next = buildInitialRoutes(puzzle);
  if (!rawRoutes || typeof rawRoutes !== 'object') return next;

  puzzle.starts.forEach((start) => {
    const raw = (rawRoutes as Record<string, unknown>)[start.id];
    if (!Array.isArray(raw)) return;
    const cells = raw
      .map((cell) =>
        cell &&
        typeof cell === 'object' &&
        typeof (cell as PostmarkCoord).row === 'number' &&
        typeof (cell as PostmarkCoord).col === 'number'
          ? { row: (cell as PostmarkCoord).row, col: (cell as PostmarkCoord).col }
          : null
      )
      .filter((cell): cell is PostmarkCoord => {
        return (
          cell !== null &&
          cell.row >= 0 &&
          cell.row < puzzle.size &&
          cell.col >= 0 &&
          cell.col < puzzle.size
        );
      })
      .slice(0, start.length);

    if (cells.length > 0 && coordsEqual(cells[0]!, start.entry)) {
      next[start.id] = cells;
    }
  });

  return next;
}

function findRouteHit(routes: PostmarkRouteState, coord: PostmarkCoord): RouteHit {
  for (const [startId, cells] of Object.entries(routes)) {
    const index = cells.findIndex((cell) => coordsEqual(cell, coord));
    if (index >= 0) return { startId, index };
  }
  return null;
}

function getRouteColor(index: number): string {
  return ROUTE_COLORS[index % ROUTE_COLORS.length]!;
}

function renderMiniGrid(
  x: number,
  y: number,
  cols: number,
  rows: number,
  cell: number,
  fills: Record<string, string> = {},
  strokes: Record<string, string> = {},
  strokeWidths: Record<string, number> = {}
) {
  return Array.from({ length: rows * cols }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const key = `${row}:${col}`;
    return (
      <Rect
        key={`mini-cell-${x}-${y}-${key}`}
        x={x + col * cell}
        y={y + row * cell}
        width={cell}
        height={cell}
        fill={fills[key] ?? BOARD_BACKGROUND}
        stroke={strokes[key] ?? BOARD_LINE}
        strokeWidth={strokeWidths[key] ?? 1}
      />
    );
  });
}

function InstructionDiagram({
  kind,
  stampSpec,
}: {
  kind: InstructionDiagramKind;
  stampSpec: ReturnType<typeof getPostmarkStampForStart>;
}) {
  const rose = getRouteColor(0);
  const lilac = getRouteColor(1);
  const seafoam = getRouteColor(2);
  const butter = getRouteColor(3);
  const clay = getRouteColor(4);

  if (kind === 'start') {
    return (
      <Svg width="100%" height="72" viewBox="0 0 128 72">
        <Line x1={28} y1={36} x2={55} y2={36} stroke={rose} strokeWidth={9} strokeLinecap="round" />
        <Path d="M 55 36 L 72 36 L 72 21" stroke={rose} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {renderMiniGrid(50, 12, 3, 3, 16)}
        <PostmarkStampOnBoard spec={stampSpec} number={7} fill={rose} x={6} y={16} size={40} />
      </Svg>
    );
  }

  if (kind === 'count') {
    return (
      <Svg width="100%" height="72" viewBox="0 0 128 72">
        {renderMiniGrid(10, 20, 6, 1, 16, {
          '0:0': 'rgba(146, 116, 215, 0.18)',
          '0:1': 'rgba(146, 116, 215, 0.18)',
          '0:2': 'rgba(146, 116, 215, 0.18)',
          '0:3': 'rgba(146, 116, 215, 0.18)',
          '0:4': 'rgba(146, 116, 215, 0.18)',
          '0:5': POST_HIGHLIGHT_FILL,
        }, {
          '0:5': POST_HIGHLIGHT_STROKE,
        }, {
          '0:5': 1.6,
        })}
        <Path d="M 18 28 L 34 28 L 50 28 L 66 28 L 82 28 L 98 28" stroke={lilac} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <PostmarkStampOnBoard spec={stampSpec} number={6} fill={lilac} x={4} y={6} size={31} />
        <SvgText x={111} y={32} fontSize={11} fontWeight="900" fill={INK} textAnchor="middle">
          6
        </SvgText>
      </Svg>
    );
  }

  if (kind === 'post') {
    return (
      <Svg width="100%" height="72" viewBox="0 0 128 72">
        {renderMiniGrid(28, 8, 4, 3, 16, {
          '1:0': 'rgba(82, 185, 158, 0.18)',
          '1:1': 'rgba(82, 185, 158, 0.18)',
          '1:2': 'rgba(82, 185, 158, 0.18)',
          '2:2': POST_HIGHLIGHT_FILL,
        }, {
          '2:2': POST_HIGHLIGHT_STROKE,
        }, {
          '2:2': 1.8,
        })}
        <Path d="M 36 32 L 52 32 L 68 32 L 68 48" stroke={seafoam} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Rect x={62} y={42} width={12} height={12} rx={3} fill={seafoam} opacity={0.25} />
      </Svg>
    );
  }

  if (kind === 'double-post') {
    return (
      <Svg width="100%" height="72" viewBox="0 0 128 72">
        {renderMiniGrid(28, 8, 4, 3, 16, {
          '0:1': 'rgba(228, 182, 63, 0.18)',
          '1:1': 'rgba(228, 182, 63, 0.18)',
          '2:0': 'rgba(146, 116, 215, 0.18)',
          '2:1': 'rgba(146, 116, 215, 0.18)',
          '2:2': POST_HIGHLIGHT_DOUBLE_FILL,
        }, {
          '2:2': POST_HIGHLIGHT_STROKE,
        }, {
          '2:2': 1.8,
        })}
        <Path d="M 52 16 L 52 32 L 68 32 L 68 48" stroke={butter} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M 36 48 L 52 48 L 68 48" stroke={lilac} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Rect x={62} y={42} width={12} height={12} rx={3} fill={butter} opacity={0.26} />
        <Rect x={68} y={42} width={6} height={12} rx={3} fill={lilac} opacity={0.26} />
        <Rect x={31} y={11} width={58} height={42} rx={7} fill="none" stroke={POST_HIGHLIGHT_INNER_STROKE} strokeWidth={1.3} opacity={0.75} />
      </Svg>
    );
  }

  if (kind === 'empty-cells') {
    return (
      <Svg width="100%" height="72" viewBox="0 0 128 72">
        {renderMiniGrid(27, 8, 4, 3, 16, {
          '0:0': 'rgba(200, 117, 100, 0.16)',
          '0:1': 'rgba(200, 117, 100, 0.16)',
          '1:1': 'rgba(200, 117, 100, 0.16)',
          '2:1': POST_HIGHLIGHT_FILL,
        }, {
          '2:1': POST_HIGHLIGHT_STROKE,
        }, {
          '2:1': 1.7,
        })}
        <Path d="M 35 16 L 51 16 L 51 32 L 51 48" stroke={clay} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Rect x={75} y={11} width={10} height={10} rx={2} fill="rgba(52, 43, 37, 0.08)" />
        <Rect x={75} y={27} width={10} height={10} rx={2} fill="rgba(52, 43, 37, 0.08)" />
      </Svg>
    );
  }

  return (
    <Svg width="100%" height="72" viewBox="0 0 128 72">
      {renderMiniGrid(24, 8, 4, 3, 16, {
        '0:0': 'rgba(207, 102, 130, 0.18)',
        '0:1': 'rgba(207, 102, 130, 0.18)',
        '1:1': POST_HIGHLIGHT_FILL,
        '2:2': 'rgba(82, 185, 158, 0.18)',
      }, {
        '1:1': POST_HIGHLIGHT_STROKE,
      }, {
        '1:1': 1.7,
      })}
      <Path d="M 32 16 L 48 16 L 48 32" stroke={rose} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M 72 48 L 72 32 L 56 32 L 48 32" stroke={seafoam} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {[0, 1, 2, 3, 4].map((index) => (
        <Rect
          key={`mini-confetti-${index}`}
          x={88 + index * 6}
          y={14 + (index % 2) * 10}
          width={4}
          height={9}
          rx={2}
          fill={SOLVE_CONFETTI_COLORS[index]!}
          opacity={0.86}
          transform={`rotate(${index % 2 === 0 ? 18 : -22} ${90 + index * 6} ${18 + (index % 2) * 10})`}
        />
      ))}
    </Svg>
  );
}

export default function PostmarkScreen() {
  const router = useRouter();
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('postmark', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const dailyEntry = useMemo(() => getDailyPostmarkPackEntry(), []);
  const puzzle = dailyEntry.puzzle;
  const dateKey = dailyEntry.date;
  const completionStorageKey = `${STORAGE_PREFIX}:daily:${dateKey}`;
  const [routes, setRoutes] = useState<PostmarkRouteState>(() => buildInitialRoutes(puzzle));
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeStartId, setActiveStartId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const hasCountedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const solveAnimation = useRef(new Animated.Value(0)).current;
  const routesRef = useRef(routes);
  const activeStartIdRef = useRef(activeStartId);
  const [showSolvedCelebration, setShowSolvedCelebration] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    routesRef.current = routes;
  }, [routes]);

  useEffect(() => {
    activeStartIdRef.current = activeStartId;
  }, [activeStartId]);

  const startById = useMemo(
    () => new Map(puzzle.starts.map((start) => [start.id, start])),
    [puzzle.starts]
  );
  const entryByKey = useMemo(
    () => new Map(puzzle.starts.map((start) => [makeCoordKey(start.entry), start])),
    [puzzle.starts]
  );
  const postByKey = useMemo(
    () => new Map(puzzle.posts.map((post) => [makeCoordKey(post), post])),
    [puzzle.posts]
  );
  const routeOrder = useMemo(() => puzzle.starts.map((start) => start.id), [puzzle.starts]);
  const dateLabel = useMemo(() => formatUtcDateLabel(dateKey), [dateKey]);
  const validation = useMemo(() => validatePostmarkRoutes(puzzle, routes), [puzzle, routes]);
  const cleanLabel = hintsUsed === 0 ? 'Clean' : `Hints ${hintsUsed}`;
  const routeProgressPercent = `${Math.round(
    (validation.completedRouteCount / puzzle.starts.length) * 100
  )}%`;
  const activeStart = activeStartId ? startById.get(activeStartId) : null;
  const activeRouteLength = activeStartId ? (routes[activeStartId]?.length ?? 0) : 0;
  const activeRouteTarget = activeStart?.length ?? 0;
  const activeRouteIndex = activeStartId ? routeOrder.indexOf(activeStartId) : -1;
  const activeRouteColor = activeRouteIndex >= 0 ? getRouteColor(activeRouteIndex) : '#9274d7';
  const activeRouteProgressPercent =
    activeRouteTarget > 0
      ? `${Math.round((activeRouteLength / activeRouteTarget) * 100)}%`
      : '0%';
  const instructionStampSpec = useMemo(
    () =>
      getPostmarkStampForStart({
        date: dateKey,
        dayNumber: dailyEntry.dayNumber,
        startId: 'instructions',
        startIndex: 0,
      }),
    [dailyEntry.dayNumber, dateKey]
  );
  const instructionSteps: Array<{
    kind: InstructionDiagramKind;
    title: string;
    text: string;
  }> = [
    {
      kind: 'start',
      title: 'Start at a stamp',
      text: 'Drag from a numbered stamp into its board square. The stamp outside the board does not count.',
    },
    {
      kind: 'count',
      title: 'Count board spots',
      text: 'A 6 stamp must use exactly 6 board squares, including the last blue post square.',
    },
    {
      kind: 'post',
      title: 'Land on a blue mark',
      text: 'Blue highlighted cells are endings only. Do not pass through one on the way to somewhere else.',
    },
    {
      kind: 'double-post',
      title: 'Double marks take two',
      text: 'A stronger blue mark is shared by two different routes. Both routes must finish there.',
    },
    {
      kind: 'empty-cells',
      title: 'Leave space if you need it',
      text: 'Not every square has to be used. Routes still cannot share a square or cross each other.',
    },
  ];
  const isCompactLayout = width < 520 || height < 760;
  const pagePadding = isCompactLayout ? theme.spacing.md : theme.spacing.lg;
  const pageWidth = Math.max(0, Math.min(560, width - pagePadding * 2));
  const verticalBoardBudget = Math.max(300, height - (isCompactLayout ? 236 : 300));
  const boardOuterSize = Math.floor(Math.min(560, pageWidth, verticalBoardBudget));
  const startGutter = Math.max(44, Math.min(62, boardOuterSize * 0.132));
  const boardSize = Math.floor(Math.max(220, boardOuterSize - startGutter * 2));
  const boardOrigin = startGutter;
  const svgSize = boardSize + startGutter * 2;
  const cellSize = boardSize / puzzle.size;
  const routeStrokeWidth = Math.max(12, Math.min(23, cellSize * 0.3));
  const startTileSize = Math.max(34, Math.min(52, startGutter * 0.96, cellSize * 0.9));
  const startBoardGap = Math.max(5, Math.min(8, cellSize * 0.1));
  const postHighlightInset = Math.max(3, Math.min(6, cellSize * 0.085));
  const postHighlightRadius = Math.max(6, Math.min(12, cellSize * 0.16));
  const boardRadius = 18;
  const boardClipId = 'postmark-board-clip';
  const solvePulseOpacity = solveAnimation.interpolate({
    inputRange: [0, 0.18, 0.62, 1],
    outputRange: [0, 0.72, 0.38, 0],
  });
  const solvePulseStrokeWidth = solveAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [routeStrokeWidth * 0.8, routeStrokeWidth * 1.72, routeStrokeWidth * 0.96],
  });
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => {
        const lane = (index * 37) % 100;
        return {
          id: `confetti-${index}`,
          x: svgSize * (0.08 + lane / 120),
          y: svgSize * (0.06 + ((index * 19) % 26) / 100),
          width: 4 + (index % 3),
          height: 8 + (index % 4) * 2,
          fall: 42 + ((index * 17) % 76),
          drift: ((index % 2 === 0 ? 1 : -1) * (18 + ((index * 11) % 46))),
          rotate: (index % 2 === 0 ? 1 : -1) * (160 + ((index * 29) % 260)),
          color: SOLVE_CONFETTI_COLORS[index % SOLVE_CONFETTI_COLORS.length]!,
          radius: index % 5 === 0 ? 999 : 2,
        };
      }),
    [svgSize]
  );
  const postRouteColorsByKey = useMemo(() => {
    const next = new Map<string, string[]>();
    routeOrder.forEach((startId, index) => {
      const start = startById.get(startId);
      const cells = routes[startId] ?? [];
      if (!start || cells.length !== start.length) return;
      const end = cells[cells.length - 1];
      if (!end) return;
      const key = makeCoordKey(end);
      if (!postByKey.has(key)) return;
      const colors = next.get(key) ?? [];
      colors.push(getRouteColor(index));
      next.set(key, colors);
    });
    return next;
  }, [postByKey, routeOrder, routes, startById]);

  const commitRoutes = useCallback(
    (nextRoutes: PostmarkRouteState, nextActiveStartId: string | null, message?: string) => {
      setHistory((previous) => [
        ...previous.slice(-80),
        {
          routes: cloneRouteState(routesRef.current),
          activeStartId: activeStartIdRef.current,
        },
      ]);
      routesRef.current = nextRoutes;
      activeStartIdRef.current = nextActiveStartId;
      setRoutes(nextRoutes);
      setActiveStartId(nextActiveStartId);
      if (gameState === 'won') {
        solveAnimation.stopAnimation();
        setShowSolvedCelebration(false);
        setGameState('playing');
      }
      if (message) setStatusMessage(message);
    },
    [gameState, solveAnimation]
  );

  useEffect(() => {
    setHasRestoredProgress(false);
    const raw = readStorageItem(getProgressStorageKey(dateKey));
    if (!raw) {
      const initial = buildInitialRoutes(puzzle);
      routesRef.current = initial;
      activeStartIdRef.current = null;
      hasCountedRef.current = false;
      setRoutes(initial);
      setHistory([]);
      setActiveStartId(null);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
      setHasRestoredProgress(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedPostmarkState> | null;
      if (parsed?.version !== PROGRESS_STORAGE_VERSION) {
        const initial = buildInitialRoutes(puzzle);
        routesRef.current = initial;
        activeStartIdRef.current = null;
        hasCountedRef.current = false;
        setRoutes(initial);
        setHistory([]);
        setActiveStartId(null);
        setGameState('playing');
        setElapsedSeconds(0);
        setHintsUsed(0);
        return;
      }
      const nextRoutes = sanitizeRouteState(puzzle, parsed?.routes);
      const startIds = new Set(puzzle.starts.map((start) => start.id));
      const nextActive =
        typeof parsed?.activeStartId === 'string' && startIds.has(parsed.activeStartId)
          ? parsed.activeStartId
          : null;
      const nextHistory = Array.isArray(parsed?.history)
        ? parsed!.history
            .map((entry) => ({
              routes: sanitizeRouteState(puzzle, entry?.routes),
              activeStartId:
                typeof entry?.activeStartId === 'string' && startIds.has(entry.activeStartId)
                  ? entry.activeStartId
                  : null,
            }))
            .slice(-80)
        : [];
      const nextGameState = parsed?.gameState === 'won' ? 'won' : 'playing';

      routesRef.current = nextRoutes;
      activeStartIdRef.current = nextActive;
      hasCountedRef.current = nextGameState === 'won';
      setRoutes(nextRoutes);
      setHistory(nextHistory);
      setActiveStartId(nextActive);
      setGameState(nextGameState);
      setElapsedSeconds(
        typeof parsed?.elapsedSeconds === 'number' && parsed.elapsedSeconds >= 0
          ? parsed.elapsedSeconds
          : 0
      );
      setHintsUsed(
        typeof parsed?.hintsUsed === 'number' && parsed.hintsUsed >= 0 ? parsed.hintsUsed : 0
      );
    } catch {
      const initial = buildInitialRoutes(puzzle);
      routesRef.current = initial;
      activeStartIdRef.current = null;
      hasCountedRef.current = false;
      setRoutes(initial);
      setHistory([]);
      setActiveStartId(null);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
    } finally {
      setHasRestoredProgress(true);
    }
  }, [dateKey, puzzle]);

  useEffect(() => {
    if (!hasRestoredProgress) return;
    const payload: PersistedPostmarkState = {
      version: PROGRESS_STORAGE_VERSION,
      routes,
      history,
      activeStartId,
      gameState,
      elapsedSeconds,
      hintsUsed,
    };
    writeStorageItem(getProgressStorageKey(dateKey), JSON.stringify(payload));
  }, [
    activeStartId,
    dateKey,
    elapsedSeconds,
    gameState,
    hasRestoredProgress,
    hintsUsed,
    history,
    routes,
  ]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    writeStorageItem(key, String(current + 1));
  }, [dateKey]);

  useEffect(() => {
    if (!hasRestoredProgress || gameState !== 'playing') return;
    const timer = setInterval(() => setElapsedSeconds((previous) => previous + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, hasRestoredProgress]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('postmark');
  }, [gameState]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const previousHtmlBackground = html.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    const previousRootBackground = root?.style.backgroundColor;

    html.style.backgroundColor = PAGE_BACKGROUND;
    body.style.backgroundColor = PAGE_BACKGROUND;
    if (root) root.style.backgroundColor = PAGE_BACKGROUND;

    return () => {
      html.style.backgroundColor = previousHtmlBackground;
      body.style.backgroundColor = previousBodyBackground;
      if (root && previousRootBackground !== undefined) {
        root.style.backgroundColor = previousRootBackground;
      }
    };
  }, []);

  const coordCenter = useCallback(
    (coord: PostmarkCoord) => ({
      x: boardOrigin + coord.col * cellSize + cellSize / 2,
      y: boardOrigin + coord.row * cellSize + cellSize / 2,
    }),
    [boardOrigin, cellSize]
  );

  const startCenter = useCallback(
    (start: PostmarkStart) => {
      const entryCenter = coordCenter(start.entry);
      if (start.side === 'top') {
        return { x: entryCenter.x, y: boardOrigin - startBoardGap - startTileSize / 2 };
      }
      if (start.side === 'bottom') {
        return { x: entryCenter.x, y: boardOrigin + boardSize + startBoardGap + startTileSize / 2 };
      }
      if (start.side === 'right') {
        return { x: boardOrigin + boardSize + startBoardGap + startTileSize / 2, y: entryCenter.y };
      }
      return { x: boardOrigin - startBoardGap - startTileSize / 2, y: entryCenter.y };
    },
    [boardOrigin, boardSize, coordCenter, startBoardGap, startTileSize]
  );

  const startHitFromPoint = useCallback(
    (locationX: number, locationY: number) => {
      for (const start of puzzle.starts) {
        const center = startCenter(start);
        const dx = Math.abs(locationX - center.x);
        const dy = Math.abs(locationY - center.y);
        if (dx <= startTileSize * 0.62 && dy <= startTileSize * 0.62) return start;
      }
      return null;
    },
    [puzzle.starts, startCenter, startTileSize]
  );

  const coordFromBoardPoint = useCallback(
    (locationX: number, locationY: number): PostmarkCoord | null => {
      const boardX = locationX - boardOrigin;
      const boardY = locationY - boardOrigin;
      if (boardX < 0 || boardY < 0 || boardX > boardSize || boardY > boardSize) {
        return null;
      }
      const col = Math.min(puzzle.size - 1, Math.max(0, Math.floor(boardX / cellSize)));
      const row = Math.min(puzzle.size - 1, Math.max(0, Math.floor(boardY / cellSize)));
      return { row, col };
    },
    [boardOrigin, boardSize, cellSize, puzzle.size]
  );

  const handleBoardCoord = useCallback(
    (coord: PostmarkCoord, resetSelection = false) => {
      if (gameState !== 'playing') return;
      const key = makeCoordKey(coord);
      const currentRoutes = routesRef.current;

      if (resetSelection) {
        const hit = findRouteHit(currentRoutes, coord);
        if (hit) {
          const route = currentRoutes[hit.startId] ?? [];
          const trimmed = route.slice(0, hit.index + 1);
          if (trimmed.length !== route.length) {
            commitRoutes(
              {
                ...currentRoutes,
                [hit.startId]: trimmed,
              },
              hit.startId
            );
          } else {
            setActiveStartId(hit.startId);
            activeStartIdRef.current = hit.startId;
          }
          return;
        }

        return;
      }

      const activeId = activeStartIdRef.current;
      if (!activeId) return;
      const start = startById.get(activeId);
      if (!start) return;
      const route = currentRoutes[activeId] ?? [{ ...start.entry }];
      const existingIndex = route.findIndex((cell) => coordsEqual(cell, coord));
      if (existingIndex >= 0) {
        if (existingIndex < route.length - 1) {
          commitRoutes(
            {
              ...currentRoutes,
              [activeId]: route.slice(0, existingIndex + 1),
            },
            activeId
          );
        }
        return;
      }

      const last = route[route.length - 1];
      if (!last || !areNeighbors(last, coord)) return;
      if (route.length >= start.length) {
        setStatusMessage(`Route ${start.length} is already exact length.`);
        return;
      }

      const post = postByKey.get(key);
      const isPost = Boolean(post);
      const nextLength = route.length + 1;
      const hit = findRouteHit(currentRoutes, coord);
      if (hit && hit.startId !== activeId) {
        if (!post || nextLength !== start.length) {
          setStatusMessage('Routes cannot overlap.');
          return;
        }
      }

      const otherStart = entryByKey.get(key);
      if (otherStart && otherStart.id !== activeId) {
        setStatusMessage("Routes cannot pass through another route's entry.");
        return;
      }

      if (isPost && nextLength !== start.length) {
        setStatusMessage('A post can only be the final tile.');
        return;
      }

      if (post && nextLength === start.length) {
        const routesAlreadyEndingHere = Object.entries(currentRoutes).filter(([routeStartId, cells]) => {
          if (routeStartId === activeId) return false;
          const end = cells[cells.length - 1];
          return end ? makeCoordKey(end) === key : false;
        }).length;
        if (routesAlreadyEndingHere >= post.capacity) {
          setStatusMessage('That post is already full.');
          return;
        }
      }

      if (!isPost && nextLength === start.length) {
        setStatusMessage('Exact routes must land on a post.');
        return;
      }

      const nextRoute = [...route, coord];
      const nextActive = isPost && nextLength === start.length ? null : activeId;
      commitRoutes(
        {
          ...currentRoutes,
          [activeId]: nextRoute,
        },
        nextActive
      );
    },
    [commitRoutes, entryByKey, gameState, postByKey, startById]
  );

  const handleBoardPoint = useCallback(
    (locationX: number, locationY: number, resetSelection = false) => {
      if (resetSelection) {
        const start = startHitFromPoint(locationX, locationY);
        if (start) {
          setActiveStartId(start.id);
          activeStartIdRef.current = start.id;
          return;
        }
      }
      const coord = coordFromBoardPoint(locationX, locationY);
      if (!coord) return;
      handleBoardCoord(coord, resetSelection);
    },
    [coordFromBoardPoint, handleBoardCoord, startHitFromPoint]
  );

  const handleBoardResponderGrant = useCallback(
    (event: GestureResponderEvent) => {
      isPointerDownRef.current = true;
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
      if (typeof pointerId === 'number') event.currentTarget?.setPointerCapture?.(pointerId);
      const point = pointFromWebBoardEvent(event);
      if (!point) return;
      isPointerDownRef.current = true;
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
    if (typeof pointerId === 'number') event?.currentTarget?.releasePointerCapture?.(pointerId);
    isPointerDownRef.current = false;
  }, []);

  const webBoardHandlers = useMemo(
    () =>
      Platform.OS === 'web'
        ? ({
            onPointerDown: handleWebBoardStart,
            onPointerMove: handleWebBoardMove,
            onPointerUp: handleWebBoardEnd,
            onPointerCancel: handleWebBoardEnd,
          } as Record<string, unknown>)
        : ({} as Record<string, unknown>),
    [handleWebBoardEnd, handleWebBoardMove, handleWebBoardStart]
  );

  const handleUndo = useCallback(() => {
    setHistory((previous) => {
      if (previous.length === 0) return previous;
      const next = [...previous];
      const last = next.pop();
      if (last) {
        routesRef.current = last.routes;
        activeStartIdRef.current = last.activeStartId;
        setRoutes(last.routes);
        setActiveStartId(last.activeStartId);
        if (gameState === 'won') {
          solveAnimation.stopAnimation();
          setShowSolvedCelebration(false);
          setGameState('playing');
        }
      }
      return next;
    });
  }, [gameState, solveAnimation]);

  const handleClear = useCallback(() => {
    const initial = buildInitialRoutes(puzzle);
    solveAnimation.stopAnimation();
    setShowSolvedCelebration(false);
    commitRoutes(initial, null, 'Board cleared.');
    setGameState('playing');
    setElapsedSeconds(0);
  }, [commitRoutes, puzzle, solveAnimation]);

  const handleHint = useCallback(() => {
    if (gameState !== 'playing') return;
    const currentRoutes = routesRef.current;

    for (const solutionRoute of puzzle.solution) {
      const current = currentRoutes[solutionRoute.startId] ?? [];
      for (let index = 0; index < current.length; index += 1) {
        const expected = solutionRoute.cells[index];
        if (!expected || !coordsEqual(current[index]!, expected)) {
          const trimmed = solutionRoute.cells.slice(0, Math.max(1, index));
          commitRoutes(
            {
              ...currentRoutes,
              [solutionRoute.startId]: trimmed,
            },
            solutionRoute.startId,
            'Hint trimmed a route back to its last correct tile.'
          );
          setHintsUsed((previous) => previous + 1);
          return;
        }
      }
    }

    const preferredIds = activeStartIdRef.current
      ? [activeStartIdRef.current, ...routeOrder.filter((id) => id !== activeStartIdRef.current)]
      : routeOrder;

    for (const startId of preferredIds) {
      const solutionRoute = puzzle.solution.find((route) => route.startId === startId);
      if (!solutionRoute) continue;
      const current = currentRoutes[startId] ?? [];
      if (current.length >= solutionRoute.cells.length) continue;
      const nextCell = solutionRoute.cells[current.length]!;
      commitRoutes(
        {
          ...currentRoutes,
          [startId]: [...current, nextCell],
        },
        startId,
        'Hint added one correct tile.'
      );
      setHintsUsed((previous) => previous + 1);
      return;
    }

    setStatusMessage('All routes are already exact length.');
  }, [commitRoutes, gameState, puzzle.solution, routeOrder]);

  const startSolvedCelebration = useCallback(() => {
    solveAnimation.stopAnimation();
    solveAnimation.setValue(0);
    setShowSolvedCelebration(true);
    Animated.timing(solveAnimation, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setShowSolvedCelebration(false);
    });
  }, [solveAnimation]);

  const completePuzzle = useCallback(() => {
    if (gameState === 'won') return;
    setGameState('won');
    setActiveStartId(null);
    activeStartIdRef.current = null;
    writeStorageItem(completionStorageKey, '1');
    setStatusMessage('Postmark complete.');
    startSolvedCelebration();
  }, [completionStorageKey, gameState, startSolvedCelebration]);

  useEffect(() => {
    if (!hasRestoredProgress || gameState !== 'playing' || !validation.solved) return;
    completePuzzle();
  }, [completePuzzle, gameState, hasRestoredProgress, validation.solved]);

  const shareText = useMemo(
    () =>
      [
        `${POSTMARK_EMOJI} Postmark #${dailyEntry.dayNumber}`,
        `Solved in ${formatTime(elapsedSeconds)}`,
        `${cleanLabel} · ${puzzle.starts.length} routes`,
      ].join('\n'),
    [cleanLabel, dailyEntry.dayNumber, elapsedSeconds, puzzle.starts.length]
  );

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: pagePadding }]}
      >
        <View style={styles.page}>
          <View style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to Gameshow home"
              style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
              onPress={() => router.push('/')}
            >
              <Text style={styles.homeButtonText}>Home</Text>
            </Pressable>
            <Text style={styles.topTitle}>#{dailyEntry.dayNumber}</Text>
            <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Postmark</Text>
              <Text style={styles.subtitle}>
                #{dailyEntry.dayNumber} · {dateLabel} UTC · {dailyEntry.difficulty}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showInstructions ? 'Hide Postmark instructions' : 'Show Postmark instructions'}
              style={({ pressed }) => [
                styles.rulesToggle,
                showInstructions && styles.rulesToggleActive,
                pressed && styles.rulesTogglePressed,
              ]}
              onPress={() => setShowInstructions((previous) => !previous)}
            >
              <Text style={[styles.rulesToggleText, showInstructions && styles.rulesToggleTextActive]}>
                {showInstructions ? 'Hide Rules' : 'Rules'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.statusBar}>
            <View style={styles.statusMeter}>
              <View style={styles.statusMeterHeader}>
                <Text style={styles.statusLabel}>Routes</Text>
                <Text style={styles.statusValue}>
                  {validation.completedRouteCount}/{puzzle.starts.length}
                </Text>
              </View>
              <View style={styles.statusTrack}>
                <View style={[styles.statusFill, { width: routeProgressPercent }]} />
              </View>
            </View>
            <View style={styles.statusMeter}>
              <View style={styles.statusMeterHeader}>
                <Text style={styles.statusLabel}>Spots</Text>
                <Text style={styles.statusValue}>
                  {activeRouteTarget > 0 ? `${activeRouteLength}/${activeRouteTarget}` : 'Pick'}
                </Text>
              </View>
              <View style={styles.statusTrack}>
                <View
                  style={[
                    styles.statusFill,
                    styles.statusFillSecondary,
                    { width: activeRouteProgressPercent, backgroundColor: activeRouteColor },
                  ]}
                />
              </View>
            </View>
            <View style={[styles.cleanBadge, hintsUsed > 0 && styles.hintBadge]}>
              <Text style={styles.cleanBadgeLabel}>{gameState === 'won' ? 'Solved' : cleanLabel}</Text>
              <Text style={styles.cleanBadgeMeta}>{formatTime(elapsedSeconds)}</Text>
            </View>
          </View>

          {showInstructions && (
            <View style={styles.instructionsCard}>
              <View style={styles.instructionsHeader}>
                <Text style={styles.instructionsTitle}>How to play</Text>
                <Text style={styles.instructionsSubtitle}>
                  Draw exact stamp paths into blue destination marks.
                </Text>
              </View>
              <View style={styles.instructionsKey}>
                <View style={styles.keyItem}>
                  <View style={[styles.keySwatch, styles.keyStampSwatch]} />
                  <Text style={styles.keyText}>stamp</Text>
                </View>
                <View style={styles.keyItem}>
                  <View style={[styles.keySwatch, styles.keyRouteSwatch]} />
                  <Text style={styles.keyText}>route</Text>
                </View>
                <View style={styles.keyItem}>
                  <View style={[styles.keySwatch, styles.keyPostSwatch]} />
                  <Text style={styles.keyText}>mark</Text>
                </View>
                <View style={styles.keyItem}>
                  <View style={[styles.keySwatch, styles.keyDoublePostSwatch]} />
                  <Text style={styles.keyText}>double mark</Text>
                </View>
              </View>
              <View style={styles.instructionsGrid}>
                {instructionSteps.map((instruction) => (
                  <View key={instruction.kind} style={styles.instructionStep}>
                    <View style={styles.instructionVisual}>
                      <InstructionDiagram kind={instruction.kind} stampSpec={instructionStampSpec} />
                    </View>
                    <View style={styles.instructionCopy}>
                      <Text style={styles.instructionTitle}>{instruction.title}</Text>
                      <Text style={styles.instructionText}>{instruction.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.boardShell}>
            <View
              style={[styles.board, { width: svgSize, height: svgSize }]}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={handleBoardResponderGrant}
              onResponderMove={handleBoardResponderMove}
              onResponderRelease={handleBoardResponderEnd}
              onResponderTerminate={handleBoardResponderEnd}
              {...webBoardHandlers}
            >
              <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                <Defs>
                  <ClipPath id={boardClipId}>
                    <Rect
                      x={boardOrigin}
                      y={boardOrigin}
                      width={boardSize}
                      height={boardSize}
                      rx={boardRadius}
                    />
                  </ClipPath>
                </Defs>
                <Rect
                  x={boardOrigin}
                  y={boardOrigin}
                  width={boardSize}
                  height={boardSize}
                  rx={boardRadius}
                  fill={BOARD_BACKGROUND}
                />
                <G clipPath={`url(#${boardClipId})`}>
                  {Array.from({ length: puzzle.size + 1 }, (_, index) => {
                    const position = boardOrigin + index * cellSize;
                    return (
                      <G key={`grid-${index}`}>
                        <Line
                          x1={position}
                          y1={boardOrigin}
                          x2={position}
                          y2={boardOrigin + boardSize}
                          stroke={BOARD_LINE}
                          strokeWidth={1}
                        />
                        <Line
                          x1={boardOrigin}
                          y1={position}
                          x2={boardOrigin + boardSize}
                          y2={position}
                          stroke={BOARD_LINE}
                          strokeWidth={1}
                        />
                      </G>
                    );
                  })}

                  {puzzle.posts.map((post) => {
                  const x = boardOrigin + post.col * cellSize + postHighlightInset;
                  const y = boardOrigin + post.row * cellSize + postHighlightInset;
                  const size = cellSize - postHighlightInset * 2;
                  const innerInset = Math.max(4, Math.min(7, cellSize * 0.1));
                  const routeColors = postRouteColorsByKey.get(makeCoordKey(post)) ?? [];
                  const isRouteColored = routeColors.length > 0;
                  const primaryColor = routeColors[0] ?? POST_HIGHLIGHT_STROKE;
                  const secondaryColor = routeColors[1] ?? null;
                  const postClipId = `postmark-post-fill-${post.id}`;
                  return (
                    <G key={`post-highlight-${post.id}`}>
                      <Defs>
                        <ClipPath id={postClipId}>
                          <Rect
                            x={x}
                            y={y}
                            width={size}
                            height={size}
                            rx={postHighlightRadius}
                          />
                        </ClipPath>
                      </Defs>
                      <Rect
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        rx={postHighlightRadius}
                        fill={post.capacity === 2 ? POST_HIGHLIGHT_DOUBLE_FILL : POST_HIGHLIGHT_FILL}
                        stroke={isRouteColored ? primaryColor : POST_HIGHLIGHT_STROKE}
                        strokeWidth={isRouteColored ? 1.9 : post.capacity === 2 ? 1.6 : 1.2}
                        opacity={0.84}
                      />
                      <G clipPath={`url(#${postClipId})`}>
                        {post.capacity === 1 && isRouteColored && (
                          <Rect
                            x={x}
                            y={y}
                            width={size}
                            height={size}
                            fill={primaryColor}
                            opacity={0.28}
                          />
                        )}
                        {post.capacity === 2 && (
                          <G>
                            {isRouteColored && (
                              <Rect
                                x={x}
                                y={y}
                                width={size / 2}
                                height={size}
                                fill={primaryColor}
                                opacity={0.3}
                              />
                            )}
                            {secondaryColor && (
                              <Rect
                                x={x + size / 2}
                                y={y}
                                width={size / 2}
                                height={size}
                                fill={secondaryColor}
                                opacity={0.3}
                              />
                            )}
                          </G>
                        )}
                      </G>
                      {post.capacity === 2 && (
                        <G>
                          <Rect
                            x={x + innerInset}
                            y={y + innerInset}
                            width={size - innerInset * 2}
                            height={size - innerInset * 2}
                            rx={Math.max(4, postHighlightRadius - 3)}
                            fill="none"
                            stroke={
                              isRouteColored
                                ? secondaryColor ?? primaryColor
                                : POST_HIGHLIGHT_INNER_STROKE
                            }
                            strokeWidth={1.4}
                            opacity={isRouteColored ? 0.72 : 0.9}
                          />
                        </G>
                      )}
                    </G>
                  );
                  })}

                </G>

                {routeOrder.map((startId, index) => {
                  const cells = routes[startId] ?? [];
                  const start = startById.get(startId);
                  if (!start || cells.length < 2) return null;
                  const points = [startCenter(start), ...cells.map((cell) => coordCenter(cell))];
                  const d = points
                    .map((point, pointIndex) => {
                      return `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
                    })
                    .join(' ');
                  return (
                    <Path
                      key={`route-${startId}`}
                      d={d}
                      fill="none"
                      stroke={getRouteColor(index)}
                      strokeWidth={routeStrokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={gameState === 'won' ? 0.95 : activeStartId === startId ? 0.96 : 0.82}
                    />
                  );
                })}

                {showSolvedCelebration &&
                  routeOrder.map((startId, index) => {
                    const cells = routes[startId] ?? [];
                    const start = startById.get(startId);
                    if (!start || cells.length < 2) return null;
                    const points = [startCenter(start), ...cells.map((cell) => coordCenter(cell))];
                    const d = points
                      .map((point, pointIndex) => {
                        return `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
                      })
                      .join(' ');
                    return (
                      <AnimatedPath
                        key={`solve-pulse-${startId}`}
                        d={d}
                        fill="none"
                        stroke={getRouteColor(index)}
                        strokeWidth={solvePulseStrokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={solvePulseOpacity}
                      />
                    );
                  })}

                <Rect
                  x={boardOrigin}
                  y={boardOrigin}
                  width={boardSize}
                  height={boardSize}
                  rx={boardRadius}
                  fill="none"
                  stroke="rgba(52, 43, 37, 0.2)"
                  strokeWidth={1}
                />

                {puzzle.starts.map((start, index) => {
                  const center = startCenter(start);
                  const spec = getPostmarkStampForStart({
                    date: dateKey,
                    dayNumber: dailyEntry.dayNumber,
                    startId: start.id,
                    startIndex: index,
                  });
                  return (
                    <PostmarkStampOnBoard
                      key={`start-stamp-${start.id}`}
                      spec={spec}
                      number={start.length}
                      fill={getRouteColor(index)}
                      active={activeStartId === start.id}
                      x={center.x - startTileSize / 2}
                      y={center.y - startTileSize / 2}
                      size={startTileSize}
                    />
                  );
                })}

              </Svg>
              {showSolvedCelebration && (
                <View
                  pointerEvents="none"
                  testID="postmark-confetti-layer"
                  style={styles.confettiLayer}
                >
                  {confettiPieces.map((piece) => {
                    const translateY = solveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, piece.fall],
                    });
                    const translateX = solveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, piece.drift],
                    });
                    const rotate = solveAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${piece.rotate}deg`],
                    });
                    const opacity = solveAnimation.interpolate({
                      inputRange: [0, 0.08, 0.78, 1],
                      outputRange: [0, 1, 1, 0],
                    });
                    return (
                      <Animated.View
                        key={piece.id}
                        testID="postmark-confetti-piece"
                        style={[
                          styles.confettiPiece,
                          {
                            left: piece.x,
                            top: piece.y,
                            width: piece.width,
                            height: piece.height,
                            borderRadius: piece.radius,
                            backgroundColor: piece.color,
                            opacity,
                            transform: [{ translateX }, { translateY }, { rotate }],
                          },
                        ]}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          {statusMessage ? (
            <View style={styles.alertToast} accessibilityRole="alert">
              <View style={styles.alertRail} />
              <View style={styles.alertMark}>
                <Text style={styles.alertMarkText}>!</Text>
              </View>
              <Text style={styles.alertText}>{statusMessage}</Text>
            </View>
          ) : null}

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Undo last Postmark move"
              disabled={history.length === 0}
              style={({ pressed }) => [
                styles.actionButton,
                history.length === 0 && styles.actionButtonDisabled,
                pressed && styles.actionButtonPressed,
              ]}
              onPress={handleUndo}
            >
              <Text style={styles.actionButtonText}>Undo</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear Postmark board"
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={handleClear}
            >
              <Text style={styles.actionButtonText}>Clear</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get a Postmark hint"
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
              onPress={handleHint}
            >
              <Text style={styles.actionButtonText}>Hint</Text>
            </Pressable>
          </View>

          {gameState === 'won' && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Postmarked</Text>
              <Text style={styles.resultMeta}>
                {formatTime(elapsedSeconds)} · {cleanLabel} · {puzzle.starts.length} routes
              </Text>
              <View style={styles.shareBox}>
                <Text selectable style={styles.shareText}>
                  {shareText}
                </Text>
              </View>
              {Platform.OS === 'web' && (
                <Pressable
                  style={({ pressed }) => [
                    styles.copyButton,
                    pressed && styles.copyButtonPressed,
                  ]}
                  onPress={handleCopyResults}
                >
                  <Text style={styles.copyButtonText}>Copy results</Text>
                </Pressable>
              )}
              {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
            </View>
          )}
        </View>
      </ScrollView>
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

  return StyleSheet.create({
    container: {
      ...WEB_FULL_HEIGHT,
      flex: 1,
      backgroundColor: PAGE_BACKGROUND,
    },
    scrollView: {
      ...WEB_FULL_HEIGHT,
      flex: 1,
      backgroundColor: PAGE_BACKGROUND,
    },
    scrollContent: {
      ...WEB_FULL_HEIGHT,
      flexGrow: 1,
      paddingBottom: Spacing.xl,
      backgroundColor: PAGE_BACKGROUND,
      alignItems: 'center',
    },
    page: {
      width: '100%',
      maxWidth: 600,
      paddingTop: Spacing.sm,
    },
    topBar: {
      minHeight: 34,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    homeButton: {
      ...WEB_NO_SELECT,
      minHeight: 32,
      minWidth: 58,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: SOFT_BORDER,
      backgroundColor: SURFACE,
    },
    homeButtonPressed: {
      opacity: 0.78,
      transform: [{ scale: 0.98 }],
    },
    homeButtonText: {
      color: INK,
      fontSize: 13,
      fontWeight: '800',
    },
    topTitle: {
      color: 'rgba(52, 43, 37, 0.66)',
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 0.4,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.md,
      marginBottom: Spacing.sm,
    },
    titleBlock: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      fontSize: 32,
      fontWeight: '900',
      color: INK,
    },
    subtitle: {
      marginTop: 1,
      fontSize: 13,
      color: 'rgba(52, 43, 37, 0.58)',
      fontWeight: '800',
    },
    rulesToggle: {
      ...WEB_NO_SELECT,
      minHeight: 34,
      paddingHorizontal: 12,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: 'rgba(21, 71, 214, 0.22)',
      backgroundColor: 'rgba(21, 71, 214, 0.065)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rulesToggleActive: {
      borderColor: POSTMARK_BLUE,
      backgroundColor: POSTMARK_BLUE,
    },
    rulesTogglePressed: {
      opacity: 0.82,
      transform: [{ scale: 0.98 }],
    },
    rulesToggleText: {
      color: POSTMARK_BLUE,
      fontSize: 12,
      fontWeight: '900',
    },
    rulesToggleTextActive: {
      color: '#fffdf8',
    },
    timer: {
      fontSize: 18,
      fontWeight: '900',
      color: INK,
      fontVariant: ['tabular-nums'],
    },
    statusBar: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(21, 71, 214, 0.18)',
      backgroundColor: 'rgba(255, 253, 248, 0.92)',
      padding: 8,
      marginBottom: Spacing.sm,
    },
    statusMeter: {
      flex: 1,
      minWidth: 104,
      borderRadius: BorderRadius.sm,
      backgroundColor: 'rgba(21, 71, 214, 0.055)',
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    statusMeterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 7,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: '900',
      color: 'rgba(52, 43, 37, 0.58)',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    statusValue: {
      fontSize: 14,
      fontWeight: '900',
      color: INK,
      fontVariant: ['tabular-nums'],
    },
    statusTrack: {
      height: 7,
      borderRadius: 999,
      backgroundColor: 'rgba(21, 71, 214, 0.13)',
      overflow: 'hidden',
    },
    statusFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: POSTMARK_BLUE,
    },
    statusFillSecondary: {
      backgroundColor: '#9274d7',
    },
    cleanBadge: {
      minWidth: 86,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: 'rgba(21, 71, 214, 0.2)',
      backgroundColor: 'rgba(21, 71, 214, 0.095)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    hintBadge: {
      borderColor: 'rgba(207, 102, 130, 0.28)',
      backgroundColor: 'rgba(207, 102, 130, 0.105)',
    },
    cleanBadgeLabel: {
      fontSize: 13,
      fontWeight: '900',
      color: INK,
    },
    cleanBadgeMeta: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '900',
      color: 'rgba(52, 43, 37, 0.58)',
      fontVariant: ['tabular-nums'],
    },
    instructionsCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: SOFT_BORDER,
      backgroundColor: 'rgba(255, 253, 248, 0.86)',
      padding: 12,
      marginBottom: Spacing.md,
    },
    instructionsHeader: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: Spacing.md,
      marginBottom: Spacing.sm,
    },
    instructionsTitle: {
      fontSize: 15,
      fontWeight: '900',
      color: INK,
    },
    instructionsSubtitle: {
      flex: 1,
      textAlign: 'right',
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '800',
      color: 'rgba(52, 43, 37, 0.58)',
    },
    instructionsKey: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginBottom: 10,
    },
    keyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: 'rgba(21, 71, 214, 0.12)',
      backgroundColor: 'rgba(21, 71, 214, 0.045)',
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    keySwatch: {
      width: 15,
      height: 15,
      borderRadius: 4,
    },
    keyStampSwatch: {
      backgroundColor: '#cf6682',
      borderWidth: 2,
      borderColor: '#fffdf8',
    },
    keyRouteSwatch: {
      height: 8,
      borderRadius: 999,
      backgroundColor: '#9274d7',
    },
    keyPostSwatch: {
      backgroundColor: POST_HIGHLIGHT_FILL,
      borderWidth: 1.5,
      borderColor: POSTMARK_BLUE,
    },
    keyDoublePostSwatch: {
      backgroundColor: POST_HIGHLIGHT_DOUBLE_FILL,
      borderWidth: 2.2,
      borderColor: POSTMARK_BLUE,
    },
    keyText: {
      color: 'rgba(52, 43, 37, 0.66)',
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    instructionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    instructionStep: {
      flexBasis: '48%',
      flexGrow: 1,
      minWidth: 210,
      overflow: 'hidden',
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: 'rgba(222, 213, 201, 0.82)',
      backgroundColor: 'rgba(245, 241, 235, 0.58)',
    },
    instructionVisual: {
      height: 76,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255, 253, 248, 0.78)',
    },
    instructionCopy: {
      paddingHorizontal: 10,
      paddingTop: 9,
      paddingBottom: 11,
    },
    instructionTitle: {
      marginBottom: 3,
      color: INK,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '900',
    },
    instructionText: {
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '800',
      color: 'rgba(52, 43, 37, 0.74)',
    },
    boardShell: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    board: {
      ...WEB_NO_SELECT,
      position: 'relative',
      overflow: 'visible',
      backgroundColor: 'transparent',
    },
    confettiLayer: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'visible',
    },
    confettiPiece: {
      position: 'absolute',
    },
    alertToast: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      maxWidth: '100%',
      minHeight: 44,
      overflow: 'hidden',
      gap: 10,
      marginTop: 8,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: 'rgba(207, 102, 130, 0.26)',
      backgroundColor: 'rgba(255, 253, 248, 0.96)',
      paddingRight: 14,
      shadowColor: '#342b25',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    alertRail: {
      width: 4,
      alignSelf: 'stretch',
      backgroundColor: '#cf6682',
    },
    alertMark: {
      width: 24,
      height: 24,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(207, 102, 130, 0.16)',
    },
    alertMarkText: {
      color: '#9f405d',
      fontSize: 14,
      fontWeight: '900',
    },
    alertText: {
      flex: 1,
      color: INK,
      fontSize: FontSize.sm,
      lineHeight: 18,
      fontWeight: '800',
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    actionButton: {
      ...WEB_NO_SELECT,
      flexGrow: 1,
      minWidth: 96,
      minHeight: 42,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: SURFACE,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    actionButtonPressed: {
      backgroundColor: screenAccent.badgeBg,
      transform: [{ scale: 0.98 }],
    },
    actionButtonDisabled: {
      opacity: 0.42,
    },
    actionButtonText: {
      color: INK,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    submitButton: {
      ...WEB_NO_SELECT,
      flexGrow: 1,
      minWidth: 112,
      minHeight: 42,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: '#0f37a9',
      backgroundColor: POSTMARK_BLUE,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    submitButtonPressed: {
      backgroundColor: '#123db8',
      transform: [{ scale: 0.98 }],
    },
    submitButtonText: {
      color: '#fffdf8',
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
    resultCard: {
      marginTop: Spacing.xl,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: SOFT_BORDER,
      backgroundColor: SURFACE,
    },
    resultTitle: {
      fontSize: FontSize.xl,
      color: INK,
      fontWeight: '900',
    },
    resultMeta: {
      marginTop: 4,
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      fontWeight: '700',
    },
    shareBox: {
      marginTop: Spacing.md,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      padding: Spacing.md,
    },
    shareText: {
      fontSize: FontSize.sm,
      lineHeight: 22,
      color: Colors.textSecondary,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    copyButton: {
      ...ui.cta,
      borderRadius: BorderRadius.sm,
      marginTop: Spacing.md,
      backgroundColor: INK,
    },
    copyButtonPressed: {
      opacity: 0.86,
      transform: [{ scale: 0.98 }],
    },
    copyButtonText: {
      ...ui.ctaText,
      textTransform: 'none',
      letterSpacing: 0.4,
    },
    shareStatus: {
      marginTop: Spacing.sm,
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textMuted,
      textAlign: 'center',
    },
  });
};
