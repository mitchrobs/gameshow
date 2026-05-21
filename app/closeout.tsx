import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import { formatUtcDateLabel } from '../src/utils/dailyUtc';
import {
  formatLibertiesShareText,
  getDailyLibertiesEntry,
  getLibertiesPuzzleAudit,
  getRemainingLibertiesLights,
  isLibertiesSolved,
  libertiesPreviewPuzzles,
  libertiesPuzzles,
  playLibertiesMove,
  pointKey,
  replayLibertiesMoves,
  samePoint,
  type LibertiesBoard,
  type LibertiesIllegalReason,
  type LibertiesPoint,
} from '../src/data/libertiesPuzzles';

type GameState = 'playing' | 'won';
type DemoMode = 'intro' | 'select' | 'stage0' | 'stage1' | 'stage2' | 'complete';
type HowToCell = 'black' | 'white' | 'frozen' | null;
type HowToLessonKind = 'target' | 'seal' | 'response' | 'blocker';

interface PersistedLibertiesState {
  version: 1;
  moves: LibertiesPoint[];
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
}

const STORAGE_PREFIX = 'liberties';
const PLAY_COUNT_KEY = 'liberties';
const PUBLIC_GAME_TITLE = 'Liberties';
const PROGRESS_STORAGE_VERSION = 1 as const;
const STANDARD_PLAYTEST_PUZZLE_ID = 'liberties-clock-square';
const HARD_PLAYTEST_PUZZLE_ID = 'liberties-ladder-garden';
const PEBBLE_ASSETS = {
  seal: require('../assets/closeout/seal-pebble.png'),
  target: require('../assets/closeout/target-pebble.png'),
  guide: require('../assets/closeout/guide-pebble.png'),
  blocker: require('../assets/closeout/blocker-pebble.png'),
};
const GROUP_ACCENTS = ['#43b7a8', '#d79a33', '#7c93df', '#d76f8b', '#6fac55', '#b17aca', '#cf7c42', '#4d9dc4'] as const;
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
const WEB_BORDER_BOX = Platform.OS === 'web' ? ({ boxSizing: 'border-box' } as any) : null;
const HOW_TO_OPEN_GRID: HowToCell[][] = [
  [null, 'black', 'frozen', null],
  ['black', 'white', 'white', null],
  [null, null, 'black', null],
  [null, null, null, null],
];
const HOW_TO_CLOSED_GRID: HowToCell[][] = [
  [null, 'black', 'frozen', null],
  ['black', 'white', 'white', 'white'],
  [null, 'black', 'black', null],
  [null, null, null, null],
];
const QUICK_START_RULES = [
  'This is a pebble-trapping puzzle. The light pebbles are trying to stay on the board.',
  'Your job is to place dark pebbles so the light pebbles get trapped and disappear.',
  'Pebbles sit on crossings where grid lines meet. The squares between the lines are only background.',
  'A light pebble checks the four crossings touching it: above, below, left, and right.',
  'When all touching crossings are filled, blocked, or outside the board, that light pebble clears.',
  'Clearing is the reward: if your move clears light pebbles, the light does not stretch and you get the next move.',
  'Tap an empty crossing once to preview a dark pebble. Tap that same crossing again to place it.',
];
const LIBERTIES_RULES = [
  'If light pebbles touch side-to-side, they move and clear together. Trap the outside of the whole connected shape.',
  'A board edge already closes that direction because there is no crossing beyond the edge.',
  'A red pebble is a blocked crossing. It already counts as closed for nearby light pebbles, but you cannot play there.',
  'Diagonal crossings never count. Corners do not connect light pebbles and do not close them.',
  'Your dark pebbles do not all need to connect. Separate dark groups are allowed.',
  'After you place a dark pebble, that pebble or its connected dark shape must still touch at least one empty neighboring crossing.',
];
const SCORING_RULES = [
  'Every dark pebble you place counts as one move.',
  'A strong move can close touching crossings for more than one light shape at once.',
  'The share result shows your time, move count, and hint count. The puzzle never shows an internal target number.',
];
const PUZZLE_PATTERN_RULES = [
  'If your move clears at least one light pebble, the light pebbles do not move. You get to place again before any stretch.',
  'If your move clears nothing, one connected light shape stretches into one empty touching crossing.',
  'The stretch is not random. First, the most trapped light shape gets a chance to stretch.',
  'If several shapes are equally trapped, the one with the longest straight escape lane stretches.',
  'If there is still a tie, the game uses a fixed top-to-bottom, left-to-right order.',
  'The preview tells you where a quiet move will stretch before you place it.',
];

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
    // Keep gameplay available if browser storage is blocked.
  }
}

function getProgressStorageKey(dateKey: string): string {
  return `${STORAGE_PREFIX}:progress:${dateKey}`;
}

function markDailySolved(dateKey: string): boolean {
  const storage = getStorage();
  if (!storage) return true;
  try {
    const key = `${STORAGE_PREFIX}:daily:${dateKey}`;
    const alreadySolved = storage.getItem(key) === '1';
    storage.setItem(key, '1');
    return !alreadySolved;
  } catch {
    return true;
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function getIllegalMoveMessage(reason: LibertiesIllegalReason): string {
  switch (reason) {
    case 'occupied':
      return 'That spot is already filled.';
    case 'outside-board':
      return 'That spot is outside the board.';
    case 'suicide':
      return 'That dark pebble would leave its connected dark shape with no empty neighboring crossing. Clear a light pebble first or choose a different crossing.';
  }
}

function getOccupiedCellMessage(cell: LibertiesBoard[number][number], linkedGroupIndex?: number): string {
  if (cell === 'white') return 'Light pebbles cannot be covered. Close their adjacent empty crossings instead.';
  if (cell === 'black') return 'That crossing already has a dark pebble.';
  if (cell === 'frozen') return 'Red pebbles are already blocked. You cannot place there.';
  if (cell === 'release') return 'That crossing is blocked in this puzzle.';
  return 'Choose an empty crossing.';
}

function getCellAccessibilityLabel(
  row: number,
  col: number,
  cell: LibertiesBoard[number][number]
): string {
  const position = `Row ${row + 1}, column ${col + 1}`;
  if (cell === 'white') return `${position}, light pebble`;
  if (cell === 'black') return `${position}, dark pebble`;
  if (cell === 'frozen') return `${position}, red pebble, blocked crossing`;
  if (cell === 'release') return `${position}, blocked crossing`;
  return `${position}, empty crossing`;
}

function getGroupAccent(index: number): string {
  return GROUP_ACCENTS[index % GROUP_ACCENTS.length] ?? GROUP_ACCENTS[0];
}

function formatPointLabel(point: LibertiesPoint): string {
  return `Row ${point.row + 1}, Col ${point.col + 1}`;
}

function getPointPixel(
  point: LibertiesPoint,
  boardPadding: number,
  pointGap: number
): { x: number; y: number } {
  return {
    x: boardPadding + point.col * pointGap,
    y: boardPadding + point.row * pointGap,
  };
}

function getGroupCenter(points: LibertiesPoint[]): LibertiesPoint {
  if (points.length === 0) return { row: 0, col: 0 };
  const total = points.reduce(
    (sum, point) => ({
      row: sum.row + point.row,
      col: sum.col + point.col,
    }),
    { row: 0, col: 0 }
  );
  return {
    row: total.row / points.length,
    col: total.col / points.length,
  };
}

function getReleaseConnectorStyle(
  releasePoint: LibertiesPoint,
  groupCenter: LibertiesPoint,
  boardPadding: number,
  pointGap: number
) {
  const start = getPointPixel(releasePoint, boardPadding, pointGap);
  const end = getPointPixel(groupCenter, boardPadding, pointGap);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  return {
    left: (start.x + end.x) / 2 - distance / 2,
    top: (start.y + end.y) / 2 - 1,
    width: distance,
    transform: [{ rotate: `${angle}rad` }],
  };
}

function formatPreviewStatus(
  point: LibertiesPoint,
  groupIndexes: number[],
  legal: boolean,
  captureCount = 0,
  responsePoints: LibertiesPoint[] = []
): string {
  const targetText =
    groupIndexes.length === 0
      ? 'Does not touch a light pebble yet.'
      : groupIndexes.length === 1
        ? 'Touches a light shape.'
        : `Touches ${groupIndexes.length} light shapes.`;
  let resultText = '';
  if (captureCount > 0 && responsePoints.length > 0) {
    resultText = ` Quiet move: the most trapped light shape will stretch to ${formatPointLabel(responsePoints[0]!)} and clear.`;
  } else if (captureCount > 0) {
    resultText = ` Clears ${captureCount} light pebble${captureCount === 1 ? '' : 's'}. You get the next move before light stretches.`;
  } else if (responsePoints.length > 0) {
    resultText = ` Quiet move: the most trapped light shape will stretch to ${formatPointLabel(responsePoints[0]!)}.`;
  }
  const actionText = legal ? `Tap again to place.${resultText}` : 'That move is not legal yet.';
  return `${formatPointLabel(point)}. ${targetText} ${actionText}`;
}

function getShareUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const basePath = window.location.pathname.startsWith('/gameshow') ? '/gameshow' : '';
      return `${window.location.origin}${basePath}/liberties`;
    }
  }
  return 'https://mitchrobs.github.io/gameshow/liberties';
}

function readSearchParam(name: string): string | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

function readDemoMode(): DemoMode | null {
  const value = readSearchParam('demo');
  if (
    value === 'intro' ||
    value === 'select' ||
    value === 'stage0' ||
    value === 'stage1' ||
    value === 'stage2' ||
    value === 'complete'
  ) {
    return value;
  }
  return null;
}

function readPuzzleOverride(): string | null {
  const value = readSearchParam('puzzle');
  if (!value) return null;
  return value.trim().toLowerCase();
}

function getPreviewPuzzleFromOverride(value: string | null): typeof libertiesPuzzles[number] | null {
  if (!value) return null;
  if (value === 'hard') {
    return (
      libertiesPuzzles.find((entry) => entry.id === HARD_PLAYTEST_PUZZLE_ID) ??
      libertiesPuzzles
        .filter((entry) => entry.difficulty === 'Hard')
        .sort((a, b) => {
          const auditA = getLibertiesPuzzleAudit(a);
          const auditB = getLibertiesPuzzleAudit(b);
          return (
            auditB.responseEventCount - auditA.responseEventCount ||
            auditB.dynamicMoveCount - auditA.dynamicMoveCount ||
            auditB.sharedOpenSideCount - auditA.sharedOpenSideCount ||
            auditB.captureOrderDependencyScore - auditA.captureOrderDependencyScore ||
            b.lightGroups.length - a.lightGroups.length ||
            b.solution.length - a.solution.length
          );
        })[0] ??
      libertiesPuzzles.find((entry) => entry.difficulty === 'Hard') ??
      libertiesPuzzles.find((entry) => entry.id === STANDARD_PLAYTEST_PUZZLE_ID) ??
      null
    );
  }
  if (value === 'standard' || value === 'easy') {
    const difficulty = value === 'standard' ? 'Standard' : 'Easy';
    return libertiesPuzzles.find((entry) => entry.difficulty === difficulty) ?? null;
  }
  return libertiesPreviewPuzzles.find((entry) => entry.id.toLowerCase() === value) ?? null;
}

function HowToMiniBoard({
  grid,
  label,
  caption,
  styles,
}: {
  grid: HowToCell[][];
  label: string;
  caption: string;
  styles: ReturnType<typeof createStyles>;
}) {
  const miniSize = 154;
  const miniPadding = 24;
  const miniGridSpan = miniSize - miniPadding * 2;
  const miniGap = miniGridSpan / Math.max(1, grid.length - 1);
  const miniHitSize = 34;

  return (
    <View style={styles.howToMiniBoardPanel}>
      <Text style={styles.howToMiniBoardLabel}>{label}</Text>
      <View style={styles.howToMiniBoard}>
        {grid.map((_, index) => (
          <View
            key={`how-to-mini-vertical-${label}-${index}`}
            style={[
              styles.howToMiniGridLine,
              {
                left: miniPadding + index * miniGap,
                top: miniPadding,
                width: 1,
                height: miniGridSpan,
              },
            ]}
          />
        ))}
        {grid.map((_, index) => (
          <View
            key={`how-to-mini-horizontal-${label}-${index}`}
            style={[
              styles.howToMiniGridLine,
              {
                left: miniPadding,
                top: miniPadding + index * miniGap,
                width: miniGridSpan,
                height: 1,
              },
            ]}
          />
        ))}
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (cell === null) return null;
            return (
              <View
                key={`how-to-point-${label}-${rowIndex}-${colIndex}`}
                style={[
                  styles.howToMiniPoint,
                  cell === 'frozen' && styles.howToMiniFrozen,
                  {
                    left: miniPadding + colIndex * miniGap - miniHitSize / 2,
                    top: miniPadding + rowIndex * miniGap - miniHitSize / 2,
                    width: miniHitSize,
                    height: miniHitSize,
                    borderRadius: miniHitSize / 2,
                  },
                ]}
              >
                {cell === 'black' && (
                  <Image source={PEBBLE_ASSETS.seal} style={styles.howToPiece} resizeMode="contain" />
                )}
                {cell === 'white' && (
                  <Image source={PEBBLE_ASSETS.target} style={styles.howToPiece} resizeMode="contain" />
                )}
                {cell === 'frozen' && (
                  <Image source={PEBBLE_ASSETS.blocker} style={styles.howToBlockerPiece} resizeMode="contain" />
                )}
              </View>
            );
          })
        )}
      </View>
      <Text style={styles.howToMiniBoardCaption}>{caption}</Text>
    </View>
  );
}

function HowToLessonRow({
  kind,
  title,
  badge,
  text,
  styles,
}: {
  kind: HowToLessonKind;
  title: string;
  badge: string;
  text: string;
  styles: ReturnType<typeof createStyles>;
}) {
  const renderToken = () => {
    if (kind === 'blocker') {
      return (
        <View style={[styles.howToLessonToken, styles.howToLessonTokenBlocker]}>
          <Image source={PEBBLE_ASSETS.blocker} style={styles.howToLessonBlocker} resizeMode="contain" />
        </View>
      );
    }

    const source =
      kind === 'target'
        ? PEBBLE_ASSETS.target
        : kind === 'response'
          ? PEBBLE_ASSETS.target
          : PEBBLE_ASSETS.seal;

    return (
      <View style={styles.howToLessonToken}>
        <Image
          source={source}
          style={kind === 'response' ? styles.howToLessonGuide : styles.howToLessonPiece}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <View style={styles.howToLessonRow}>
      <View style={styles.howToLessonIcon}>{renderToken()}</View>
      <View style={styles.howToLessonCopy}>
        <View style={styles.howToLessonTitleRow}>
          <Text style={styles.howToLessonTitle}>{title}</Text>
          <View style={styles.howToLessonBadge}>
            <Text style={styles.howToLessonBadgeText}>{badge}</Text>
          </View>
        </View>
        <Text style={styles.howToLessonText}>{text}</Text>
      </View>
    </View>
  );
}

function HowToRuleItem({ text, styles }: { text: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View style={styles.ruleItem}>
      <View style={styles.ruleBullet} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

function sanitizeMoves(value: unknown, size: number): LibertiesPoint[] {
  if (!Array.isArray(value)) return [];
  return value.filter((move): move is LibertiesPoint => {
    if (!move || typeof move !== 'object') return false;
    const candidate = move as Partial<LibertiesPoint>;
    return (
      Number.isInteger(candidate.row) &&
      Number.isInteger(candidate.col) &&
      typeof candidate.row === 'number' &&
      typeof candidate.col === 'number' &&
      candidate.row >= 0 &&
      candidate.row < size &&
      candidate.col >= 0 &&
      candidate.col < size
    );
  });
}

function isSolutionMoveAvailable(
  board: LibertiesBoard,
  point: LibertiesPoint | undefined
): point is LibertiesPoint {
  if (!point) return false;
  return board[point.row]?.[point.col] === null;
}

function getDemoMoveCount(mode: DemoMode): number {
  switch (mode) {
    case 'stage1':
      return 1;
    case 'stage2':
      return 2;
    case 'complete':
      return Number.POSITIVE_INFINITY;
    default:
      return 0;
  }
}

function getDemoElapsedSeconds(mode: DemoMode): number {
  switch (mode) {
    case 'stage1':
      return 42;
    case 'stage2':
      return 74;
    case 'complete':
      return 258;
    default:
      return 0;
  }
}

export default function LibertiesScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('liberties', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const { width } = useWindowDimensions();
  const demoMode = useMemo(() => readDemoMode(), []);
  const puzzleOverride = useMemo(() => getPreviewPuzzleFromOverride(readPuzzleOverride()), []);
  const isPreviewMode = demoMode !== null || puzzleOverride !== null || readSearchParam('howTo') === '1';
  const dailyEntry = useMemo(() => getDailyLibertiesEntry(), []);
  const demoPuzzle = useMemo(
    () => libertiesPuzzles.find((entry) => entry.id === 'liberties-shared-court') ?? null,
    []
  );
  const puzzle = puzzleOverride ?? (demoMode ? demoPuzzle ?? dailyEntry.puzzle : dailyEntry.puzzle);
  const dateKey = dailyEntry.date;
  const [moves, setMoves] = useState<LibertiesPoint[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintPoint, setHintPoint] = useState<LibertiesPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LibertiesPoint | null>(null);
  const [hoverPoint, setHoverPoint] = useState<LibertiesPoint | null>(null);
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [recentResponseKeys, setRecentResponseKeys] = useState<Set<string>>(() => new Set());
  const [isHowToVisible, setIsHowToVisible] = useState(false);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const hasCountedRef = useRef(false);

  const replay = useMemo(() => replayLibertiesMoves(puzzle, moves), [moves, puzzle]);
  const board = replay.board;
  const solved = useMemo(() => isLibertiesSolved(puzzle, board), [board, puzzle]);
  const remainingGroups = useMemo(
    () => getRemainingLibertiesLights(puzzle, board),
    [board, puzzle]
  );
  const lightGroupIndexByPoint = useMemo(() => {
    const next = new Map<string, number>();
    puzzle.lightGroups.forEach((group, groupIndex) => {
      group.forEach((stone) => next.set(pointKey(stone), groupIndex));
    });
    return next;
  }, [puzzle.lightGroups]);
  const remainingGroupEntries = useMemo(
    () =>
      remainingGroups
        .map((group) => {
          const groupIndex = group.stones
            .map((stone) => lightGroupIndexByPoint.get(pointKey(stone)))
            .find((index): index is number => index !== undefined);
          return groupIndex === undefined ? null : { group, groupIndex };
        })
        .filter((entry): entry is { group: typeof remainingGroups[number]; groupIndex: number } => entry !== null)
        .sort((a, b) => a.groupIndex - b.groupIndex),
    [lightGroupIndexByPoint, remainingGroups]
  );
  const groupIndexByPoint = useMemo(() => {
    const next = new Map<string, number>();
    remainingGroupEntries.forEach(({ group, groupIndex }) => {
      group.stones.forEach((stone) => next.set(pointKey(stone), groupIndex));
    });
    return next;
  }, [remainingGroupEntries]);
  const releaseIndexByPoint = useMemo(() => {
    const next = new Map<string, number>();
    puzzle.releaseLinks.forEach((release) => {
      next.set(pointKey(release.point), release.groupIndex);
    });
    return next;
  }, [puzzle.releaseLinks]);
  const clearedCount = replay.captured.length;
  const boardCap = width >= 1100 ? 940 : width >= 900 ? 860 : 740;
  const boardInset = width < 420 ? 52 : width < 720 ? 56 : width < 900 ? 72 : 24;
  const boardFloor = width < 420 ? 296 : 380;
  const boardSize = Math.min(Math.max(width - boardInset, boardFloor), boardCap);
  const boardPadding = Math.max(width < 420 ? 28 : 34, Math.min(54, boardSize * 0.075));
  const gridSpan = boardSize - boardPadding * 2;
  const pointGap = gridSpan / Math.max(1, puzzle.size - 1);
  const stoneSize = Math.min(pointGap * 0.74, width < 420 ? 46 : 64);
  const previewStoneSize = stoneSize;
  const guideStoneSize = stoneSize;
  const hitSize = Math.max(stoneSize * 1.1, Math.min(pointGap * 0.98, width < 420 ? 54 : 78));
  const gridLineThickness = width < 420 ? 1 : 2;
  const dailyLabel = useMemo(() => formatUtcDateLabel(dateKey), [dateKey]);
  const nextHint = useMemo(
    () => puzzle.solution.find((point) => isSolutionMoveAvailable(board, point)) ?? null,
    [board, puzzle.solution]
  );
  const shareText = useMemo(
    () =>
      formatLibertiesShareText({
        date: dateKey,
        moves: moves.length,
        elapsedSeconds,
        hintsUsed,
        url: getShareUrl(),
      }),
    [dateKey, elapsedSeconds, hintsUsed, moves.length]
  );
  const getLightImpactsForPoint = useCallback((point: LibertiesPoint) => {
    const selectedKey = pointKey(point);
    return remainingGroupEntries
      .map(({ group, groupIndex }) => {
        if (!group.liberties.has(selectedKey)) return null;
        return groupIndex;
      })
      .filter((index): index is number => index !== null);
  }, [remainingGroupEntries]);
  const selectedLightImpacts = useMemo(() => {
    if (!selectedPoint) return [];
    return getLightImpactsForPoint(selectedPoint);
  }, [getLightImpactsForPoint, selectedPoint]);
  const hoverLightImpacts = useMemo(() => {
    if (!hoverPoint) return [];
    return getLightImpactsForPoint(hoverPoint);
  }, [getLightImpactsForPoint, hoverPoint]);
  const selectedTouchGroupIndexes = useMemo(
    () => new Set(selectedLightImpacts),
    [selectedLightImpacts]
  );
  const highlightedGroupIndexes = useMemo(() => {
    const next = new Set(selectedTouchGroupIndexes);
    if (activeGroupIndex !== null) next.add(activeGroupIndex);
    return next;
  }, [activeGroupIndex, selectedTouchGroupIndexes]);
  const activeOpenSideKeys = useMemo(() => {
    if (activeGroupIndex === null) return new Set<string>();
    return remainingGroupEntries.find((entry) => entry.groupIndex === activeGroupIndex)?.group.liberties ?? new Set<string>();
  }, [activeGroupIndex, remainingGroupEntries]);
  useEffect(() => {
    if (readSearchParam('howTo') === '1' || demoMode === 'intro') {
      setIsHowToVisible(true);
    }
  }, [demoMode]);

  useEffect(() => {
    if (demoMode || puzzleOverride) {
      const demoMoves = demoMode ? puzzle.solution.slice(0, getDemoMoveCount(demoMode)) : [];
      hasCountedRef.current = true;
      setMoves(demoMoves);
      setGameState(demoMode === 'complete' ? 'won' : 'playing');
      setElapsedSeconds(demoMode ? getDemoElapsedSeconds(demoMode) : 0);
      setHintsUsed(0);
      setHintPoint(
        demoMode === 'stage0' || demoMode === 'stage1' || demoMode === 'stage2'
          ? puzzle.solution[demoMoves.length] ?? null
          : null
      );
      setSelectedPoint(demoMode === 'select' ? puzzle.solution[0] ?? null : null);
      setHoverPoint(null);
      setActiveGroupIndex(null);
      setRecentResponseKeys(new Set());
      setHasRestoredProgress(true);
      return;
    }

    setHasRestoredProgress(false);
    const raw = readStorageItem(getProgressStorageKey(dateKey));
    if (!raw) {
      hasCountedRef.current = false;
      setMoves([]);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
      setHintPoint(null);
      setSelectedPoint(null);
      setHoverPoint(null);
      setActiveGroupIndex(null);
      setRecentResponseKeys(new Set());
      setIsHowToVisible(readStorageItem(`${STORAGE_PREFIX}:intro-seen`) !== '1');
      setHasRestoredProgress(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedLibertiesState> | null;
      const nextMoves = sanitizeMoves(parsed?.moves, puzzle.size);
      const replayed = replayLibertiesMoves(puzzle, nextMoves);
      const legalMoves =
        replayed.illegalMoveIndex === null
          ? nextMoves
          : nextMoves.slice(0, replayed.illegalMoveIndex);
      const legalReplay = replayLibertiesMoves(puzzle, legalMoves);
      const nextGameState =
        parsed?.gameState === 'won' || isLibertiesSolved(puzzle, legalReplay.board)
          ? 'won'
          : 'playing';

      setMoves(legalMoves);
      setGameState(nextGameState);
      setElapsedSeconds(
        typeof parsed?.elapsedSeconds === 'number' && parsed.elapsedSeconds >= 0
          ? parsed.elapsedSeconds
          : 0
      );
      setHintsUsed(
        typeof parsed?.hintsUsed === 'number' && parsed.hintsUsed >= 0
          ? parsed.hintsUsed
          : 0
      );
      setHintPoint(null);
      setSelectedPoint(null);
      setHoverPoint(null);
      setActiveGroupIndex(null);
      setRecentResponseKeys(new Set());
      hasCountedRef.current = nextGameState === 'won';
    } catch {
      hasCountedRef.current = false;
      setMoves([]);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
      setHintPoint(null);
      setSelectedPoint(null);
      setHoverPoint(null);
      setActiveGroupIndex(null);
      setRecentResponseKeys(new Set());
    } finally {
      setHasRestoredProgress(true);
    }
  }, [dateKey, demoMode, puzzle, puzzleOverride]);

  useEffect(() => {
    if (!hasRestoredProgress || isPreviewMode) return;
    const payload: PersistedLibertiesState = {
      version: PROGRESS_STORAGE_VERSION,
      moves,
      gameState,
      elapsedSeconds,
      hintsUsed,
    };
    writeStorageItem(getProgressStorageKey(dateKey), JSON.stringify(payload));
  }, [dateKey, elapsedSeconds, gameState, hasRestoredProgress, hintsUsed, isPreviewMode, moves]);

  useEffect(() => {
    if (gameState !== 'playing' || !solved) return;
    setGameState('won');
  }, [gameState, solved]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current || isPreviewMode) return;
    hasCountedRef.current = true;
    const shouldCount = markDailySolved(dateKey);
    if (shouldCount) {
      incrementGlobalPlayCount(PLAY_COUNT_KEY);
    }
  }, [dateKey, gameState, isPreviewMode]);

  useEffect(() => {
    if (!hasRestoredProgress || gameState !== 'playing' || isPreviewMode) return;
    const timer = setInterval(() => setElapsedSeconds((previous) => previous + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, hasRestoredProgress, isPreviewMode]);

  useEffect(() => {
    if (selectedPoint && board[selectedPoint.row]?.[selectedPoint.col] !== null) {
      setSelectedPoint(null);
    }
  }, [board, selectedPoint]);

  useEffect(() => {
    if (
      activeGroupIndex !== null &&
      !remainingGroupEntries.some((entry) => entry.groupIndex === activeGroupIndex)
    ) {
      setActiveGroupIndex(null);
    }
  }, [activeGroupIndex, remainingGroupEntries]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    if (recentResponseKeys.size === 0) return;
    const timeout = setTimeout(() => setRecentResponseKeys(new Set()), 1800);
    return () => clearTimeout(timeout);
  }, [recentResponseKeys]);

  const commitMove = useCallback(
    (point: LibertiesPoint) => {
      if (gameState !== 'playing') return;
      setShareStatus(null);
      const result = playLibertiesMove(board, puzzle.size, point, 'black', puzzle);
      if (!result.legal) {
        setStatusMessage(getIllegalMoveMessage(result.reason));
        return;
      }

      setRecentResponseKeys(new Set(result.responses.map(pointKey)));
      setHintPoint(null);
      setSelectedPoint(null);
      setHoverPoint(null);
      setActiveGroupIndex(null);
      setMoves((previous) => [...previous, point]);
      if (result.captured.length > 0 && result.responses.length > 0) {
        setStatusMessage(
          `Quiet move: light stretched to ${formatPointLabel(result.responses[0]!)} and cleared ${result.captured.length} light pebble${result.captured.length === 1 ? '' : 's'}.`
        );
      } else if (result.captured.length > 0) {
        setStatusMessage(
          `Cleared ${result.captured.length} light pebble${result.captured.length === 1 ? '' : 's'}. Your turn again before light stretches.`
        );
      } else if (result.responses.length > 0) {
        setStatusMessage(
          `Quiet move: light stretched to ${formatPointLabel(result.responses[0]!)}.`
        );
      }
    },
    [board, gameState, puzzle]
  );

  const handlePointPress = useCallback(
    (point: LibertiesPoint) => {
      if (gameState !== 'playing') return;
      setShareStatus(null);
      const cell = board[point.row]?.[point.col];
      if (cell !== null) {
        setSelectedPoint(null);
        setStatusMessage(getOccupiedCellMessage(cell, releaseIndexByPoint.get(pointKey(point))));
        return;
      }

      if (selectedPoint && samePoint(selectedPoint, point)) {
        commitMove(point);
        return;
      }

      setSelectedPoint(point);
      const previewResult = playLibertiesMove(board, puzzle.size, point, 'black', puzzle);
      setStatusMessage(
        formatPreviewStatus(
          point,
          getLightImpactsForPoint(point),
          previewResult.legal,
          previewResult.legal ? previewResult.captured.length : 0,
          previewResult.legal ? previewResult.responses : []
        )
      );
    },
    [board, commitMove, gameState, getLightImpactsForPoint, puzzle, releaseIndexByPoint, selectedPoint]
  );

  const handleUndo = useCallback(() => {
    setMoves((previous) => previous.slice(0, -1));
    setGameState('playing');
    setHintPoint(null);
    setSelectedPoint(null);
    setHoverPoint(null);
    setActiveGroupIndex(null);
    setRecentResponseKeys(new Set());
    setShareStatus(null);
    setStatusMessage('Move undone.');
    hasCountedRef.current = false;
  }, []);

  const handleReset = useCallback(() => {
    setMoves([]);
    setGameState('playing');
    setElapsedSeconds(0);
    setHintsUsed(0);
    setHintPoint(null);
    setSelectedPoint(null);
    setHoverPoint(null);
    setActiveGroupIndex(null);
    setRecentResponseKeys(new Set());
    setShareStatus(null);
    setStatusMessage('Board reset.');
    hasCountedRef.current = false;
  }, []);

  const handleHint = useCallback(() => {
    if (gameState !== 'playing') return;
    if (!nextHint) {
      setStatusMessage('No useful hint is available from this position.');
      return;
    }
    setHintPoint(nextHint);
    setSelectedPoint(nextHint);
    setHintsUsed((previous) => previous + 1);
    setShareStatus(null);
    setStatusMessage('Hint ring marks a useful empty crossing. Tap it again to place.');
  }, [gameState, nextHint]);

  const handleShare = useCallback(async () => {
    setShareStatus(null);
    if (Platform.OS !== 'web' || typeof navigator === 'undefined' || !navigator.clipboard) {
      setShareStatus('Copy not supported');
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus('Copied to clipboard');
    } catch {
      setShareStatus('Copy failed');
    }
  }, [shareText]);

  const handleDismissHowTo = useCallback(() => {
    setIsHowToVisible(false);
    if (!isPreviewMode) {
      writeStorageItem(`${STORAGE_PREFIX}:intro-seen`, '1');
    }
  }, [isPreviewMode]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: PUBLIC_GAME_TITLE,
          headerBackTitle: 'Games',
        }}
      />
      <Modal
        animationType="fade"
        transparent
        visible={isHowToVisible}
        onRequestClose={() => setIsHowToVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.howToCard}>
            <ScrollView contentContainerStyle={styles.howToScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.howToHeader}>
                <View>
                  <Text style={styles.howToKicker}>How to play</Text>
                  <Text style={styles.howToTitle}>Clear the light pebbles</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close how to play"
                  style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                  onPress={handleDismissHowTo}
                >
                  <Text style={styles.closeButtonText}>x</Text>
                </Pressable>
              </View>

              <View style={styles.objectiveCard}>
                <Text style={styles.objectiveTitle}>Objective</Text>
                <Text style={styles.objectiveText}>
                  Trap every light pebble. A light pebble looks at the crossings directly above, below, left, and right.
                  Place dark pebbles on those touching crossings until the light pebble has no empty way out. If your move
                  clears light pebbles, the board stays still and you get the next move before any stretch. If your move
                  clears nothing, the most trapped connected light shape stretches into one empty touching crossing. Red
                  pebbles are blocked crossings. Your dark pebbles do not need to form one connected chain.
                </Text>
              </View>

              <Text style={styles.modalTitle}>Start Here</Text>
              <View style={styles.rulesList}>
                <Text style={styles.ruleListTitle}>The board, from scratch</Text>
                {QUICK_START_RULES.map((rule) => (
                  <HowToRuleItem key={rule} text={rule} styles={styles} />
                ))}
              </View>

              <View style={styles.howToDiagram}>
                <HowToMiniBoard
                  grid={HOW_TO_OPEN_GRID}
                  label="Before"
                  caption="The two light pebbles touch side-to-side, so they act as one shape. The empty crossings directly around the shape are the ones you care about."
                  styles={styles}
                />
                <HowToMiniBoard
                  grid={HOW_TO_CLOSED_GRID}
                  label="Stretch"
                  caption="If your move clears nothing, the most trapped light shape stretches into an open side crossing. Clear urgent shapes before they grow."
                  styles={styles}
                />
              </View>

              <Text style={styles.modalTitle}>Pieces</Text>
              <HowToLessonRow
                kind="target"
                title="Light Pebble"
                badge="Clear"
                text="Clear all light pebbles to finish the puzzle."
                styles={styles}
              />
              <HowToLessonRow
                kind="seal"
                title="Dark Pebble"
                badge="Place"
                text="A dark pebble closes the neighboring crossings around light pebbles. Black pebbles do not all need to touch each other. Some dark pebbles are already set at the start."
                styles={styles}
              />
              <HowToLessonRow
                kind="response"
                title="Light Stretch"
                badge="Stretch"
                text="After a quiet move, one connected light shape stretches into one open side crossing. A clear move skips this, so finishing a light shape earns you the next move."
                styles={styles}
              />
              <HowToLessonRow
                kind="blocker"
                title="Red Pebble"
                badge="Blocked"
                text="A red pebble marks a crossing that is already blocked. It helps close nearby light pebbles, but you cannot place a dark pebble there."
                styles={styles}
              />

              <Text style={styles.modalTitle}>Playing a Move</Text>
              <View style={styles.howToActionGrid}>
                <View style={styles.howToActionCard}>
                  <Text style={styles.howToActionNumber}>1</Text>
                  <Text style={styles.howToActionTitle}>Find</Text>
                  <Text style={styles.howToActionText}>Pick a light pebble or connected light shape and look at the crossings touching it.</Text>
                </View>
                <View style={styles.howToActionCard}>
                  <Text style={styles.howToActionNumber}>2</Text>
                  <Text style={styles.howToActionTitle}>Preview</Text>
                  <Text style={styles.howToActionText}>Tap an empty crossing to test it. The dark pebble appears as a preview, and the message below the board tells you if it is legal.</Text>
                </View>
                <View style={styles.howToActionCard}>
                  <Text style={styles.howToActionNumber}>3</Text>
                  <Text style={styles.howToActionTitle}>Place</Text>
                  <Text style={styles.howToActionText}>Tap that same crossing again to place the pebble. If a light shape has no empty touching crossings left, it disappears.</Text>
                </View>
              </View>

              <Text style={styles.modalTitle}>Rules That Matter</Text>
              <View style={styles.rulesList}>
                <Text style={styles.ruleListTitle}>Shapes and closed crossings</Text>
                {LIBERTIES_RULES.map((rule) => (
                  <HowToRuleItem key={rule} text={rule} styles={styles} />
                ))}
              </View>
              <View style={styles.rulesList}>
                <Text style={styles.ruleListTitle}>Finish and score</Text>
                {SCORING_RULES.map((rule) => (
                  <HowToRuleItem key={rule} text={rule} styles={styles} />
                ))}
              </View>
              <View style={styles.rulesList}>
                <Text style={styles.ruleListTitle}>What changes day to day</Text>
                {PUZZLE_PATTERN_RULES.map((rule) => (
                  <HowToRuleItem key={rule} text={rule} styles={styles} />
                ))}
              </View>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.howToPlayButton, pressed && styles.howToPlayButtonPressed]}
                onPress={handleDismissHowTo}
              >
                <Text style={styles.howToPlayButtonText}>Start playing</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.page, WEB_BORDER_BOX]}>
          <View style={styles.hero}>
            <View style={styles.accentBar} />
            <Text style={styles.kicker}>Spatial logic</Text>
            <Text style={styles.title}>{PUBLIC_GAME_TITLE}</Text>
            <Text style={styles.subtitle}>
              {dailyLabel}
            </Text>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [styles.howToTrigger, pressed && styles.howToTriggerPressed]}
              onPress={() => setIsHowToVisible(true)}
            >
              <Text style={styles.howToTriggerText}>How to play</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, WEB_BORDER_BOX]}>
              <Text style={styles.statValue}>{moves.length}</Text>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <View style={[styles.statCard, WEB_BORDER_BOX]}>
              <Text style={styles.statValue}>{clearedCount}</Text>
              <Text style={styles.statLabel}>Cleared</Text>
            </View>
            <View style={[styles.statCard, WEB_BORDER_BOX]}>
              <Text style={styles.statValue}>{formatTime(elapsedSeconds)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>

          <View style={[styles.boardCard, width < 420 && styles.boardCardCompact, WEB_BORDER_BOX]}>
            <View style={styles.boardHeader}>
              <View>
                <Text style={styles.puzzleTitle}>{dailyLabel}</Text>
              </View>
              <View style={[styles.statePill, gameState === 'won' && styles.statePillWon]}>
                <Text style={[styles.statePillText, gameState === 'won' && styles.statePillTextWon]}>
                  {gameState === 'won'
                    ? 'Solved'
                    : `${remainingGroups.length} shape${remainingGroups.length === 1 ? '' : 's'}`}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.board,
                {
                  width: boardSize,
                  height: boardSize,
                },
              ]}
            >
              {Array.from({ length: puzzle.size }).map((_, index) => (
                <View
                  key={`grid-vertical-${index}`}
                  style={[
                    styles.boardGridLine,
                    {
                      left: boardPadding + index * pointGap - gridLineThickness / 2,
                      top: boardPadding,
                      width: gridLineThickness,
                      height: gridSpan,
                    },
                  ]}
                />
              ))}
              {Array.from({ length: puzzle.size }).map((_, index) => (
                <View
                  key={`grid-horizontal-${index}`}
                  style={[
                    styles.boardGridLine,
                    {
                      left: boardPadding,
                      top: boardPadding + index * pointGap - gridLineThickness / 2,
                      width: gridSpan,
                      height: gridLineThickness,
                    },
                  ]}
                />
              ))}
              {puzzle.releaseLinks.map((release, index) => {
                if (board[release.point.row]?.[release.point.col] !== 'release') return null;
                const group = puzzle.lightGroups[release.groupIndex] ?? [];
                const active = activeGroupIndex === release.groupIndex;
                return (
                  <View
                    key={`release-link-${index}-${pointKey(release.point)}`}
                    style={[
                      styles.releaseConnector,
                      {
                        ...getReleaseConnectorStyle(
                          release.point,
                          getGroupCenter(group),
                          boardPadding,
                          pointGap
                        ),
                        backgroundColor: getGroupAccent(release.groupIndex),
                        opacity: active ? 0.6 : 0.22,
                      },
                      active && styles.releaseConnectorActive,
                    ]}
                  />
                );
              })}
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const point = { row: rowIndex, col: colIndex };
                    const pointKeyValue = pointKey(point);
                    const pointLeft = boardPadding + colIndex * pointGap;
                    const pointTop = boardPadding + rowIndex * pointGap;
                    const hinted = hintPoint ? samePoint(hintPoint, point) : false;
                    const selected = selectedPoint ? samePoint(selectedPoint, point) : false;
                    const hovered = hoverPoint ? samePoint(hoverPoint, point) : false;
                    const previewing = cell === null && (selected || hovered);
                    const previewResult = previewing
                      ? playLibertiesMove(board, puzzle.size, point, 'black', puzzle)
                      : null;
                    const previewLegal = previewResult?.legal ?? false;
                    const groupIndex = cell === 'white' ? groupIndexByPoint.get(pointKeyValue) : undefined;
                    const releaseGroupIndex = cell === 'release' ? releaseIndexByPoint.get(pointKeyValue) : undefined;
                    const releaseHighlighted =
                      cell === 'release' &&
                      releaseGroupIndex !== undefined &&
                      highlightedGroupIndexes.has(releaseGroupIndex);
                    const isActiveOpenSide = cell === null && activeOpenSideKeys.has(pointKeyValue);
                    const recentlyResponded = recentResponseKeys.has(pointKeyValue);
                    return (
                      <Pressable
                        key={pointKeyValue}
                        accessibilityRole="button"
                        accessibilityLabel={getCellAccessibilityLabel(rowIndex, colIndex, cell)}
                        disabled={gameState === 'won'}
                        onPress={() => {
                          if (cell === 'white' && groupIndex !== undefined) {
                            setActiveGroupIndex(groupIndex);
                          }
                          if (cell === 'release' && releaseGroupIndex !== undefined) {
                            setActiveGroupIndex(releaseGroupIndex);
                          }
                          handlePointPress(point);
                        }}
                        onHoverIn={() => {
                          if (Platform.OS !== 'web') return;
                          if (cell === null) setHoverPoint(point);
                          if (cell === 'white' && groupIndex !== undefined) setActiveGroupIndex(groupIndex);
                          if (cell === 'release' && releaseGroupIndex !== undefined) setActiveGroupIndex(releaseGroupIndex);
                        }}
                        onHoverOut={() => {
                          if (Platform.OS !== 'web') return;
                          if (hoverPoint && samePoint(hoverPoint, point)) {
                            setHoverPoint(null);
                          }
                          if (cell === 'white' && groupIndex !== undefined) {
                            setActiveGroupIndex((current) => (current === groupIndex ? null : current));
                          }
                          if (cell === 'release' && releaseGroupIndex !== undefined) {
                            setActiveGroupIndex((current) => (current === releaseGroupIndex ? null : current));
                          }
                        }}
                        style={({ pressed }) => [
                          styles.cell,
                          {
                            left: pointLeft - hitSize / 2,
                            top: pointTop - hitSize / 2,
                            width: hitSize,
                            height: hitSize,
                            borderRadius: hitSize / 2,
                          },
                          cell === 'frozen' && styles.frozenCell,
                          cell === 'release' && styles.releaseCell,
                          hinted && styles.cellHinted,
                          hovered && cell === null && styles.cellHovered,
                          selected && styles.cellSelected,
                          previewing && !previewLegal && styles.cellInvalid,
                          pressed && cell === null && styles.cellPressed,
                        ]}
                      >
                        {cell === 'frozen' && (
                          <Image
                            source={PEBBLE_ASSETS.blocker}
                            style={[
                              styles.pieceImage,
                              styles.blockerPiece,
                              {
                                width: stoneSize,
                                height: stoneSize,
                              },
                            ]}
                            resizeMode="contain"
                          />
                        )}
                        {cell === 'release' && releaseGroupIndex !== undefined && (
                          <View
                            style={[
                              styles.releaseHalo,
                              {
                                width: stoneSize * 1.18,
                                height: stoneSize * 1.18,
                                borderRadius: stoneSize,
                                borderColor: getGroupAccent(releaseGroupIndex),
                                opacity: releaseHighlighted ? 0.78 : 0.22,
                              },
                              releaseHighlighted && styles.releaseHaloActive,
                            ]}
                          />
                        )}
                        {cell === 'release' && (
                          <Image
                            source={PEBBLE_ASSETS.guide}
                            style={[
                              styles.pieceImage,
                              styles.releasePiece,
                              {
                                width: stoneSize,
                                height: stoneSize,
                              },
                            ]}
                            resizeMode="contain"
                          />
                        )}
                        {cell === 'white' && groupIndex !== undefined && (
                          <View
                            style={[
                              styles.lightGroupHalo,
                              {
                                width: stoneSize * 1.22,
                                height: stoneSize * 1.22,
                                borderRadius: stoneSize,
                                borderColor: getGroupAccent(groupIndex),
                                opacity: highlightedGroupIndexes.has(groupIndex) ? 0.72 : 0.3,
                              },
                              highlightedGroupIndexes.has(groupIndex) && styles.lightGroupHaloActive,
                            ]}
                          />
                        )}
                        {(cell === 'black' || cell === 'white') && (
                          <Image
                            source={cell === 'black' ? PEBBLE_ASSETS.seal : PEBBLE_ASSETS.target}
                            style={[
                              styles.pieceImage,
                              {
                                width: stoneSize,
                                height: stoneSize,
                              },
                            ]}
                            resizeMode="contain"
                          />
                        )}
                        {selected && cell === null && (
                          <View
                            style={[
                              styles.previewRing,
                              {
                                width: stoneSize,
                                height: stoneSize,
                                borderRadius: stoneSize / 2,
                              },
                            ]}
                          />
                        )}
                        {hovered && cell === null && !selected && (
                          <View
                            style={[
                              styles.hoverRing,
                              {
                                width: stoneSize,
                                height: stoneSize,
                                borderRadius: stoneSize / 2,
                              },
                            ]}
                          />
                        )}
                        {isActiveOpenSide && !previewing && (
                          <View style={[styles.openSideMarker, { borderColor: getGroupAccent(activeGroupIndex ?? 0) }]} />
                        )}
                        {recentlyResponded && !previewing && (
                          <View
                            style={[
                              styles.releasedPulse,
                              {
                                width: stoneSize,
                                height: stoneSize,
                                borderRadius: stoneSize / 2,
                              },
                            ]}
                          />
                        )}
                        {previewing && (
                          <Image
                            source={PEBBLE_ASSETS.seal}
                            style={[
                              styles.pieceImage,
                              styles.previewPiece,
                              !previewLegal && styles.invalidPreviewPiece,
                              {
                                width: previewStoneSize,
                                height: previewStoneSize,
                              },
                            ]}
                            resizeMode="contain"
                          />
                        )}
                        {hinted && !previewing && cell === null && (
                          <View
                            style={[
                              styles.hintRing,
                              {
                                width: guideStoneSize,
                                height: guideStoneSize,
                                borderRadius: guideStoneSize / 2,
                              },
                            ]}
                          />
                        )}
                      </Pressable>
                    );
                  })
              )}
            </View>

          </View>

          {statusMessage && (
            <View style={styles.statusCard}>
              <Text style={styles.statusText}>{statusMessage}</Text>
            </View>
          )}

          <View style={styles.controls}>
            <Pressable
              accessibilityRole="button"
              disabled={moves.length === 0}
              style={({ pressed }) => [
                styles.secondaryButton,
                moves.length === 0 && styles.buttonDisabled,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={handleUndo}
            >
              <Text style={styles.secondaryButtonText}>Undo</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={handleHint}
            >
              <Text style={styles.secondaryButtonText}>Hint</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={handleReset}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          </View>

          {gameState === 'won' && (
            <View style={styles.winCard}>
              <Text style={styles.winTitle}>Cleared in {moves.length} moves</Text>
              <Text style={styles.winCopy}>
                {hintsUsed > 0 ? `${hintsUsed} hint${hintsUsed === 1 ? '' : 's'} used.` : 'No hints used.'}
              </Text>
              <View style={styles.sharePreview}>
                <Text style={styles.sharePreviewLabel}>Share code</Text>
                <Text style={styles.sharePreviewText}>{shareText}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]}
                onPress={handleShare}
              >
                <Text style={styles.shareButtonText}>Share result</Text>
              </Pressable>
              {shareStatus && <Text style={styles.shareStatus}>{shareStatus}</Text>}
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
  const boardColor = theme.mode === 'dark' ? '#111d23' : '#e5ecea';
  const boardLine = theme.mode === 'dark' ? 'rgba(218, 233, 232, 0.24)' : 'rgba(40, 60, 63, 0.24)';
  const boardEdge = theme.mode === 'dark' ? 'rgba(218, 233, 232, 0.12)' : 'rgba(40, 60, 63, 0.18)';
  const pointHover = theme.mode === 'dark' ? 'rgba(83, 111, 117, 0.34)' : 'rgba(255, 255, 255, 0.62)';
  const pointSelected = theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.18)' : 'rgba(30, 143, 112, 0.13)';
  const tileColor = theme.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.58)';
  const modalSurface = theme.mode === 'dark' ? '#121a23' : '#ffffff';
  const modalPanelSurface = theme.mode === 'dark' ? '#1b2632' : '#eef2f8';
  const modalAccentPanel = theme.mode === 'dark' ? '#173637' : '#e3f6f1';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: Spacing.xxl,
    },
    page: {
      ...ui.page,
      maxWidth: 1040,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.lg,
      gap: Spacing.md,
    },
    hero: {
      ...ui.glassCard,
      padding: Spacing.lg,
    },
    accentBar: ui.accentBar,
    kicker: {
      marginTop: Spacing.md,
      color: screenAccent.badgeText,
      fontSize: FontSize.sm,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      ...ui.title,
      marginTop: Spacing.xs,
      fontSize: FontSize.display,
      letterSpacing: 0,
    },
    subtitle: {
      ...ui.subtitle,
      fontSize: FontSize.md,
    },
    howToTrigger: {
      ...ui.pill,
      alignSelf: 'flex-start',
      marginTop: Spacing.md,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    howToTriggerPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.98 }],
    },
    howToTriggerText: {
      color: screenAccent.badgeText,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      backgroundColor: theme.mode === 'dark' ? 'rgba(5, 8, 12, 0.88)' : Colors.overlay,
    },
    howToCard: {
      width: '100%',
      maxWidth: 620,
      maxHeight: '92%',
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: modalSurface,
      ...theme.shadows.elevated,
    },
    howToScroll: {
      padding: Spacing.xl,
      gap: Spacing.lg,
    },
    howToHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    howToKicker: {
      color: screenAccent.badgeText,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    howToTitle: {
      marginTop: 3,
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '900',
    },
    closeButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
    },
    closeButtonPressed: {
      backgroundColor: screenAccent.soft,
    },
    closeButtonText: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
      lineHeight: 20,
    },
    objectiveCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: modalAccentPanel,
      padding: Spacing.md,
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
    modalTitle: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
      marginTop: Spacing.xs,
      marginBottom: -Spacing.sm,
    },
    rulesList: {
      gap: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: modalAccentPanel,
      padding: Spacing.md,
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
    howToDiagram: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      gap: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: modalPanelSurface,
      padding: Spacing.md,
    },
    howToMiniBoardPanel: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 238,
      alignItems: 'center',
      gap: Spacing.sm,
      minWidth: 0,
    },
    howToMiniBoardLabel: {
      alignSelf: 'flex-start',
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    howToMiniBoard: {
      width: 154,
      height: 154,
      overflow: 'hidden',
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: boardEdge,
      backgroundColor: boardColor,
      position: 'relative',
      ...WEB_NO_SELECT,
    },
    howToMiniGridLine: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: boardLine,
    },
    howToMiniPoint: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    howToMiniFrozen: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    howToPiece: {
      width: 32,
      height: 32,
    },
    howToGuidePiece: {
      width: 32,
      height: 32,
    },
    howToBlockerPiece: {
      width: 32,
      height: 32,
    },
    howToMiniBoardCaption: {
      color: Colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '800',
      textAlign: 'center',
      maxWidth: 220,
    },
    howToLessonRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: modalPanelSurface,
      padding: Spacing.md,
    },
    howToLessonIcon: {
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
    },
    howToLessonToken: {
      width: 52,
      height: 52,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: boardEdge,
      backgroundColor: tileColor,
    },
    howToLessonTokenBlocker: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    howToLessonPiece: {
      width: 46,
      height: 46,
    },
    howToLessonGuide: {
      width: 46,
      height: 46,
    },
    howToLessonBlocker: {
      width: 46,
      height: 46,
    },
    howToLessonCopy: {
      flex: 1,
      minWidth: 0,
      gap: 3,
    },
    howToLessonTitleRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    howToLessonTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
    howToLessonBadge: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
      paddingHorizontal: 7,
      paddingVertical: 2,
    },
    howToLessonBadgeText: {
      color: screenAccent.main,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    howToLessonText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '700',
    },
    howToActionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    howToActionCard: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 150,
      minWidth: 0,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      padding: Spacing.md,
      gap: 3,
    },
    howToActionNumber: {
      width: 24,
      height: 24,
      borderRadius: 999,
      overflow: 'hidden',
      color: screenAccent.main,
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      textAlign: 'center',
      fontSize: 12,
      lineHeight: 22,
      fontWeight: '900',
    },
    howToActionTitle: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
      marginTop: Spacing.xs,
    },
    howToActionText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      lineHeight: 19,
      fontWeight: '700',
    },
    howToPlayButton: {
      ...ui.cta,
      marginTop: Spacing.sm,
    },
    howToPlayButtonPressed: ui.ctaPressed,
    howToPlayButtonText: ui.ctaText,
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    statCard: {
      ...ui.subtleCard,
      flex: 1,
      minWidth: 0,
      padding: Spacing.md,
      alignItems: 'center',
    },
    statValue: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '800',
    },
    statValueEmpty: {
      color: Colors.error,
    },
    statLabel: {
      marginTop: 2,
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    boardCard: {
      ...ui.card,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    boardCardCompact: {
      padding: Spacing.md,
    },
    boardHeader: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: Spacing.md,
      alignItems: 'flex-start',
    },
    puzzleTitle: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '800',
    },
    puzzleMeta: {
      maxWidth: 320,
      marginTop: 4,
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      lineHeight: 19,
    },
    statePill: {
      ...ui.pill,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      backgroundColor: screenAccent.soft,
      borderColor: screenAccent.badgeBorder,
    },
    statePillWon: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
    },
    statePillText: {
      color: screenAccent.badgeText,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    statePillTextWon: {
      color: Colors.white,
    },
    board: {
      alignSelf: 'center',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: boardEdge,
      backgroundColor: boardColor,
      shadowColor: screenAccent.main,
      shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.13,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 3,
      ...WEB_NO_SELECT,
    },
    boardGridLine: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: boardLine,
    },
    releaseConnector: {
      position: 'absolute',
      height: 2,
      borderRadius: 999,
    },
    releaseConnectorActive: {
      height: 3,
    },
    cell: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    cellPressed: {
      transform: [{ scale: 0.98 }],
    },
    cellHinted: {
      borderColor: screenAccent.main,
      backgroundColor: pointSelected,
    },
    cellHovered: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    cellSelected: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.08)' : 'rgba(30, 143, 112, 0.07)',
    },
    cellInvalid: {
      borderWidth: 2,
      borderColor: Colors.error,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 92, 92, 0.16)' : 'rgba(193, 56, 56, 0.12)',
    },
    frozenCell: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    releaseCell: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    pieceImage: {},
    blockerPiece: {
      opacity: 0.98,
    },
    releasePiece: {
      opacity: 0.98,
    },
    lightGroupHalo: {
      position: 'absolute',
      borderWidth: 2,
      backgroundColor: 'transparent',
    },
    lightGroupHaloActive: {
      borderWidth: 3,
    },
    releaseHalo: {
      position: 'absolute',
      borderWidth: 2,
      backgroundColor: 'transparent',
    },
    releaseHaloActive: {
      borderWidth: 3,
      backgroundColor: theme.mode === 'dark' ? 'rgba(85, 208, 148, 0.08)' : 'rgba(39, 166, 104, 0.08)',
    },
    hintRing: {
      position: 'absolute',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.1)' : 'rgba(30, 143, 112, 0.1)',
      opacity: 0.9,
    },
    previewPiece: {
      opacity: 0.46,
    },
    invalidPreviewPiece: {
      opacity: 0.34,
    },
    previewRing: {
      position: 'absolute',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: screenAccent.main,
      opacity: 0.72,
    },
    hoverRing: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: pointHover,
      opacity: 0.82,
    },
    openSideMarker: {
      position: 'absolute',
      width: 18,
      height: 18,
      borderRadius: 999,
      borderWidth: 2,
      borderStyle: 'dashed',
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.45)',
    },
    releasedPulse: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.16)' : 'rgba(30, 143, 112, 0.14)',
      opacity: 0.9,
    },
    statusCard: {
      ...ui.subtleCard,
      padding: Spacing.md,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    statusText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '700',
      textAlign: 'center',
    },
    controls: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    secondaryButton: {
      ...ui.pill,
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    secondaryButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    buttonDisabled: {
      opacity: 0.45,
    },
    secondaryButtonText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    winCard: {
      ...ui.glassCard,
      padding: Spacing.lg,
      gap: Spacing.sm,
      borderColor: screenAccent.badgeBorder,
    },
    winTitle: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '800',
    },
    winCopy: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
    },
    shareButton: {
      ...ui.cta,
      marginTop: Spacing.sm,
    },
    shareButtonPressed: ui.ctaPressed,
    shareButtonText: ui.ctaText,
    shareStatus: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      textAlign: 'center',
    },
    sharePreview: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      padding: Spacing.md,
      gap: Spacing.xs,
    },
    sharePreviewLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    sharePreviewText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '700',
    },
  });
};
