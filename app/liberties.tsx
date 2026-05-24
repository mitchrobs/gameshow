import {
  memo,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  getBestLibertiesHintMove,
  getDailyLibertiesEntry,
  getLibertiesPuzzleAudit,
  getLowestLibertiesMoveCount,
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
  type LibertiesPlayMode,
} from '../src/data/libertiesPuzzles';

type GameState = 'playing' | 'won';
type DemoMode = 'intro' | 'select' | 'stage0' | 'stage1' | 'stage2' | 'complete';
type HowToCell = 'black' | 'white' | 'frozen' | null;
type LibertiesVisualThemeId = 'pebble' | 'knob' | 'neoCity' | 'softCeramic';
type LibertiesPieceKind = 'black' | 'white' | 'blocker' | 'release';
type LibertiesAssetPieceKind = Exclude<LibertiesPieceKind, 'release'>;
type LibertiesMetricTone = 'default' | 'success';

interface PersistedLibertiesState {
  version: 1;
  moves: LibertiesPoint[];
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
}

const STORAGE_PREFIX = 'liberties';
const PLAY_COUNT_KEY = 'liberties';
const THEME_STORAGE_KEY = `${STORAGE_PREFIX}:visual-theme`;
const PUBLIC_GAME_TITLE = 'Liberties';
const MODE_STORAGE_KEY = `${STORAGE_PREFIX}:mode`;
const PROGRESS_STORAGE_VERSION = 1 as const;
const STANDARD_PLAYTEST_PUZZLE_ID = 'liberties-clock-square';
const HARD_PLAYTEST_PUZZLE_ID = 'liberties-ladder-garden';
const GROUP_ACCENTS = ['#43b7a8', '#d79a33', '#7c93df', '#d76f8b', '#6fac55', '#b17aca', '#cf7c42', '#4d9dc4'] as const;
const LIBERTIES_VISUAL_THEME_IDS = ['pebble', 'knob', 'neoCity', 'softCeramic'] as const;
const LIBERTIES_VISUAL_THEME_LABELS: Record<LibertiesVisualThemeId, string> = {
  pebble: 'Pebble',
  knob: 'Knob',
  neoCity: 'Deco',
  softCeramic: 'Soft',
};
const THEMED_PIECE_ASSETS = {
  pebble: {
    light: {
      black: require('../assets/liberties/themes/pebble/black.png'),
      white: require('../assets/liberties/themes/pebble/white.png'),
      blocker: require('../assets/liberties/themes/pebble/blocker.png'),
    },
    dark: {
      black: require('../assets/liberties/themes/pebble/black.png'),
      white: require('../assets/liberties/themes/pebble/white.png'),
      blocker: require('../assets/liberties/themes/pebble/blocker.png'),
    },
  },
  knob: {
    light: {
      black: require('../assets/liberties/themes/knob/black.png'),
      white: require('../assets/liberties/themes/knob/white.png'),
      blocker: require('../assets/liberties/themes/knob/blocker.png'),
    },
    dark: {
      black: require('../assets/liberties/themes/knob/black.png'),
      white: require('../assets/liberties/themes/knob/white.png'),
      blocker: require('../assets/liberties/themes/knob/blocker.png'),
    },
  },
  neoCity: {
    light: {
      black: require('../assets/liberties/themes/neo-city/light/black.png'),
      white: require('../assets/liberties/themes/neo-city/light/white.png'),
      blocker: require('../assets/liberties/themes/neo-city/light/blocker.png'),
    },
    dark: {
      black: require('../assets/liberties/themes/neo-city/dark/black.png'),
      white: require('../assets/liberties/themes/neo-city/dark/white.png'),
      blocker: require('../assets/liberties/themes/neo-city/dark/blocker.png'),
    },
  },
  softCeramic: {
    light: {
      black: require('../assets/liberties/themes/soft-ceramic/black.png'),
      white: require('../assets/liberties/themes/soft-ceramic/white.png'),
      blocker: require('../assets/liberties/themes/soft-ceramic/blocker.png'),
    },
    dark: {
      black: require('../assets/liberties/themes/soft-ceramic/black.png'),
      white: require('../assets/liberties/themes/soft-ceramic/white.png'),
      blocker: require('../assets/liberties/themes/soft-ceramic/blocker.png'),
    },
  },
} as const;
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
  'Tap an empty crossing once to preview. Tap again to place a black pebble.',
  'White pebbles that touch side-to-side are one white group.',
  'Only side crossings count: up, down, left, and right. Diagonals do not count.',
  'Black pebbles, red blockers, and board edges close empty side crossings.',
  'A white group clears when every side crossing around that white group is closed.',
  'If your move clears a white group, you move again before white moves.',
  'Black pebbles also need one empty side crossing. If white closes the last one, those black pebbles disappear.',
];
const WHITE_STRETCH_RULES = [
  'First, white saves a white group with only one empty side crossing.',
  'If no white group is in trouble, white checks every empty side crossing beside a white group.',
  'White chooses the empty crossing with the longest straight open path.',
  'If two paths are tied, white chooses the topmost crossing, then the leftmost crossing.',
];

interface LibertiesVisualTheme {
  id: LibertiesVisualThemeId;
  label: string;
  mode: ThemeTokens['mode'];
  boardColor: string;
  boardLine: string;
  boardEdge: string;
  pointHover: string;
  pointSelected: string;
  tileColor: string;
  markerRadius: 'round' | 'soft' | 'deco';
}

function parseLibertiesVisualThemeId(value: string | null): LibertiesVisualThemeId {
  return LIBERTIES_VISUAL_THEME_IDS.includes(value as LibertiesVisualThemeId)
    ? (value as LibertiesVisualThemeId)
    : 'pebble';
}

function getLibertiesVisualTheme(mode: ThemeTokens['mode'], id: LibertiesVisualThemeId): LibertiesVisualTheme {
  const dark = mode === 'dark';
  const shared = {
    id,
    label: LIBERTIES_VISUAL_THEME_LABELS[id],
    mode,
  };

  if (id === 'knob') {
    return {
      ...shared,
      boardColor: dark ? '#111923' : '#f0f2ef',
      boardLine: dark ? 'rgba(220, 229, 225, 0.27)' : 'rgba(48, 56, 59, 0.26)',
      boardEdge: dark ? 'rgba(220, 229, 225, 0.14)' : 'rgba(48, 56, 59, 0.2)',
      pointHover: dark ? 'rgba(198, 213, 213, 0.12)' : 'rgba(255,255,255,0.72)',
      pointSelected: dark ? 'rgba(115, 180, 172, 0.18)' : 'rgba(52, 128, 118, 0.14)',
      tileColor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.62)',
      markerRadius: 'round',
    };
  }

  if (id === 'neoCity') {
    return {
      ...shared,
      boardColor: dark ? '#091b1d' : '#f1eee4',
      boardLine: dark ? 'rgba(190, 170, 132, 0.22)' : 'rgba(90, 82, 68, 0.22)',
      boardEdge: dark ? 'rgba(190, 170, 132, 0.16)' : 'rgba(122, 101, 72, 0.22)',
      pointHover: dark ? 'rgba(190, 170, 132, 0.09)' : 'rgba(255, 255, 255, 0.7)',
      pointSelected: dark ? 'rgba(190, 170, 132, 0.14)' : 'rgba(148, 100, 42, 0.12)',
      tileColor: dark ? 'rgba(190, 170, 132, 0.045)' : 'rgba(255,255,255,0.62)',
      markerRadius: 'deco',
    };
  }

  if (id === 'softCeramic') {
    return {
      ...shared,
      boardColor: dark ? '#142229' : '#f5f0e8',
      boardLine: dark ? 'rgba(212, 226, 220, 0.22)' : 'rgba(88, 88, 78, 0.22)',
      boardEdge: dark ? 'rgba(212, 226, 220, 0.13)' : 'rgba(88, 88, 78, 0.17)',
      pointHover: dark ? 'rgba(202, 223, 215, 0.1)' : 'rgba(255,255,255,0.74)',
      pointSelected: dark ? 'rgba(126, 189, 165, 0.15)' : 'rgba(102, 151, 130, 0.13)',
      tileColor: dark ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.58)',
      markerRadius: 'soft',
    };
  }

  return {
    ...shared,
    boardColor: dark ? '#111d23' : '#e5ecea',
    boardLine: dark ? 'rgba(218, 233, 232, 0.24)' : 'rgba(40, 60, 63, 0.24)',
    boardEdge: dark ? 'rgba(218, 233, 232, 0.12)' : 'rgba(40, 60, 63, 0.18)',
    pointHover: dark ? 'rgba(83, 111, 117, 0.34)' : 'rgba(255, 255, 255, 0.62)',
    pointSelected: dark ? 'rgba(99, 210, 178, 0.18)' : 'rgba(30, 143, 112, 0.13)',
    tileColor: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.58)',
    markerRadius: 'round',
  };
}

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

function isLibertiesPlayMode(value: string | null): value is LibertiesPlayMode {
  return value === 'standard' || value === 'hard';
}

function getInitialLibertiesPlayMode(): LibertiesPlayMode {
  const queryMode = isLibertiesPlayMode(readSearchParam('mode')) ? readSearchParam('mode') : null;
  if (queryMode) return queryMode;
  const storedMode = readStorageItem(MODE_STORAGE_KEY);
  return storedMode === 'hard' ? 'hard' : 'standard';
}

function getProgressStorageKey(dateKey: string, mode: LibertiesPlayMode): string {
  return `${STORAGE_PREFIX}:progress:${mode}:${dateKey}`;
}

function markDailySolved(dateKey: string, mode: LibertiesPlayMode): boolean {
  const storage = getStorage();
  if (!storage) return true;
  try {
    const key = `${STORAGE_PREFIX}:${mode}:daily:${dateKey}`;
    const alreadySolved = storage.getItem(key) === '1';
    storage.setItem(key, '1');
    return !alreadySolved;
  } catch {
    return true;
  }
}

function getShareUrl(mode: LibertiesPlayMode): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const basePath = window.location.pathname.startsWith('/gameshow') ? '/gameshow' : '';
      const suffix = mode === 'hard' ? '?mode=hard' : '';
      return `${window.location.origin}${basePath}/liberties${suffix}`;
    }
  }
  if (mode === 'hard') {
    return 'https://mitchrobs.github.io/gameshow/liberties?mode=hard';
  }
  return 'https://mitchrobs.github.io/gameshow/liberties';
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
      return 'A black group needs one open side crossing, so this crossing is not allowed yet.';
  }
}

function getOccupiedCellMessage(cell: LibertiesBoard[number][number], linkedGroupIndex?: number): string {
  if (cell === 'white') return 'White pebbles cannot be covered. Block their side crossings instead.';
  if (cell === 'black') return 'That crossing already has a black pebble.';
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
  if (cell === 'white') return `${position}, white pebble`;
  if (cell === 'black') return `${position}, black pebble`;
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

function formatPreviewStatus(
  point: LibertiesPoint,
  groupIndexes: number[],
  legal: boolean,
  captureCount = 0,
  responsePoints: LibertiesPoint[] = []
): string {
  const targetText =
    groupIndexes.length === 0
      ? 'Does not touch a white pebble yet.'
      : groupIndexes.length === 1
        ? 'Touches a white group.'
        : `Touches ${groupIndexes.length} white groups.`;
  let resultText = '';
  if (captureCount > 0 && responsePoints.length > 0) {
    resultText = ` Standard move: white will stretch to ${formatPointLabel(responsePoints[0]!)} using the stretch order, then clear.`;
  } else if (captureCount > 0) {
    resultText = ` Clears ${captureCount} white pebble${captureCount === 1 ? '' : 's'}. You get the next move before white stretches.`;
  } else if (responsePoints.length > 0) {
    resultText = ` Standard move: white will stretch to ${formatPointLabel(responsePoints[0]!)} using the stretch order.`;
  }
  const actionText = legal ? `Tap again to place.${resultText}` : 'That move is not legal yet.';
  return `${formatPointLabel(point)}. ${targetText} ${actionText}`;
}

function formatDarkClearStatus(count: number): string {
  if (count <= 0) return '';
  const pebbleText = `black pebble${count === 1 ? '' : 's'}`;
  const ending = count === 1 ? 'it disappeared' : 'they disappeared';
  return ` White boxed in ${count} ${pebbleText}, so ${ending}.`;
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

function getThemeMarkerRadius(size: number, visualTheme: LibertiesVisualTheme): number {
  void visualTheme;
  return size / 2;
}

function getThemePieceImageStyle(
  size: number,
  visualTheme: LibertiesVisualTheme,
  assetKind: LibertiesAssetPieceKind
) {
  const anchorByTheme: Partial<Record<LibertiesVisualThemeId, Record<LibertiesAssetPieceKind, number>>> = {
    knob: {
      black: -0.11,
      white: -0.11,
      blocker: -0.05,
    },
    neoCity: {
      black: -0.13,
      white: -0.13,
      blocker: -0.09,
    },
    softCeramic: {
      black: -0.05,
      white: -0.05,
      blocker: -0.05,
    },
  };
  const scaleByTheme: Partial<Record<LibertiesVisualThemeId, number>> = {
    knob: 0.98,
    neoCity: 1.08,
    softCeramic: 0.98,
  };
  const scale = scaleByTheme[visualTheme.id] ?? 1;
  const renderedSize = size * scale;
  const translateY = size * (anchorByTheme[visualTheme.id]?.[assetKind] ?? 0);

  return {
    width: renderedSize,
    height: renderedSize,
    transform: translateY === 0 ? undefined : [{ translateY }],
  };
}

function ThemedLibertiesPiece({
  kind,
  size,
  visualTheme,
  styles,
  preview = false,
  invalid = false,
}: {
  kind: LibertiesPieceKind;
  size: number;
  visualTheme: LibertiesVisualTheme;
  styles: ReturnType<typeof createStyles>;
  preview?: boolean;
  invalid?: boolean;
}) {
  const assetKind: LibertiesAssetPieceKind = kind === 'release' ? 'blocker' : kind;

  return (
    <View
      style={[
        styles.pieceStage,
        preview && styles.previewPiece,
        invalid && styles.invalidPreviewPiece,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Image
        source={THEMED_PIECE_ASSETS[visualTheme.id][visualTheme.mode][assetKind]}
        style={[
          styles.pieceImage,
          getThemePieceImageStyle(size, visualTheme, assetKind),
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

function HowToMiniBoard({
  grid,
  label,
  caption,
  styles,
  visualTheme,
}: {
  grid: HowToCell[][];
  label: string;
  caption: string;
  styles: ReturnType<typeof createStyles>;
  visualTheme: LibertiesVisualTheme;
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
                <ThemedLibertiesPiece
                  kind={cell === 'frozen' ? 'blocker' : cell}
                  size={cell === 'frozen' ? 32 : 34}
                  styles={styles}
                  visualTheme={visualTheme}
                />
              </View>
            );
          })
        )}
      </View>
      <Text style={styles.howToMiniBoardCaption}>{caption}</Text>
    </View>
  );
}

function HowToStretchOrderBoard({
  styles,
  visualTheme,
}: {
  styles: ReturnType<typeof createStyles>;
  visualTheme: LibertiesVisualTheme;
}) {
  const miniSize = 176;
  const miniPadding = 24;
  const miniGridSpan = miniSize - miniPadding * 2;
  const miniGap = miniGridSpan / 4;
  const miniHitSize = 34;
  const pointStyle = (row: number, col: number) => ({
    left: miniPadding + col * miniGap - miniHitSize / 2,
    top: miniPadding + row * miniGap - miniHitSize / 2,
    width: miniHitSize,
    height: miniHitSize,
    borderRadius: miniHitSize / 2,
  });

  return (
    <View style={styles.howToStretchPanel}>
      <Text style={styles.howToMiniBoardLabel}>How white chooses</Text>
      <View style={styles.howToStretchBoard}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={`stretch-vertical-${index}`}
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
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={`stretch-horizontal-${index}`}
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
        <View
          style={[
            styles.howToStretchPath,
            {
              left: miniPadding + 3 * miniGap,
              top: miniPadding + 2 * miniGap - 3,
              width: miniGap,
            },
          ]}
        />
        <View style={[styles.howToStretchCandidate, styles.howToStretchShortCandidate, pointStyle(1, 2)]}>
          <Text style={styles.howToStretchCandidateText}>1</Text>
        </View>
        <View style={[styles.howToStretchCandidate, styles.howToStretchChosenCandidate, pointStyle(2, 3)]}>
          <Text style={styles.howToStretchChosenText}>2</Text>
        </View>
        <View style={[styles.howToStretchDot, pointStyle(2, 4)]} />
        <View style={[styles.howToMiniPoint, pointStyle(0, 2)]}>
          <ThemedLibertiesPiece kind="blocker" size={32} styles={styles} visualTheme={visualTheme} />
        </View>
        <View style={[styles.howToMiniPoint, pointStyle(2, 1)]}>
          <ThemedLibertiesPiece kind="black" size={34} styles={styles} visualTheme={visualTheme} />
        </View>
        <View style={[styles.howToMiniPoint, pointStyle(3, 2)]}>
          <ThemedLibertiesPiece kind="black" size={34} styles={styles} visualTheme={visualTheme} />
        </View>
        <View style={[styles.howToMiniPoint, pointStyle(2, 2)]}>
          <ThemedLibertiesPiece kind="white" size={34} styles={styles} visualTheme={visualTheme} />
        </View>
        <Text style={[styles.howToStretchLabel, styles.howToStretchShortLabel]}>short</Text>
        <Text style={[styles.howToStretchLabel, styles.howToStretchLongLabel]}>longer</Text>
      </View>
      <Text style={styles.howToMiniBoardCaption}>
        White compares the empty side crossings beside white groups. Longer straight path wins.
      </Text>
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

function HowToNumberedItem({
  index,
  text,
  styles,
}: {
  index: number;
  text: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.numberedRuleItem}>
      <Text style={styles.numberedRuleIndex}>{index + 1}</Text>
      <Text style={styles.numberedRuleText}>{text}</Text>
    </View>
  );
}

type LibertiesBoardCardProps = {
  activeGroupIndex: number | null;
  activeOpenSideKeys: Set<string>;
  board: LibertiesBoard;
  boardPadding: number;
  boardSize: number;
  dailyLabel: string;
  gameState: GameState;
  gridLineThickness: number;
  gridSpan: number;
  groupIndexByPoint: Map<string, number>;
  guideStoneSize: number;
  handlePointPress: (point: LibertiesPoint) => void;
  highlightedGroupIndexes: Set<number>;
  hintPoint: LibertiesPoint | null;
  hitSize: number;
  hoverPoint: LibertiesPoint | null;
  pointGap: number;
  previewStoneSize: number;
  puzzle: typeof libertiesPuzzles[number];
  recentResponseKeys: Set<string>;
  releaseIndexByPoint: Map<string, number>;
  selectedPoint: LibertiesPoint | null;
  setActiveGroupIndex: Dispatch<SetStateAction<number | null>>;
  setHoverPoint: Dispatch<SetStateAction<LibertiesPoint | null>>;
  stoneSize: number;
  styles: ReturnType<typeof createStyles>;
  visualTheme: LibertiesVisualTheme;
  width: number;
  showHeader?: boolean;
  phoneLayout?: boolean;
};

const LibertiesBoardCard = memo(function LibertiesBoardCard({
  activeGroupIndex,
  activeOpenSideKeys,
  board,
  boardPadding,
  boardSize,
  dailyLabel,
  gameState,
  gridLineThickness,
  gridSpan,
  groupIndexByPoint,
  guideStoneSize,
  handlePointPress,
  highlightedGroupIndexes,
  hintPoint,
  hitSize,
  hoverPoint,
  pointGap,
  previewStoneSize,
  puzzle,
  recentResponseKeys,
  releaseIndexByPoint,
  selectedPoint,
  setActiveGroupIndex,
  setHoverPoint,
  stoneSize,
  styles,
  visualTheme,
  width,
  showHeader = true,
  phoneLayout = false,
}: LibertiesBoardCardProps) {
  const haloSize = stoneSize * 1.22;
  const previewMarkerSize = stoneSize * 1.16;
  const hintMarkerSize = guideStoneSize * 1.14;
  const openSideMarkerSize = Math.max(12, Math.min(18, stoneSize * 0.28));

  return (
    <View
      style={[
        styles.boardCard,
        width < 420 && styles.boardCardCompact,
        phoneLayout && styles.boardCardPhone,
        WEB_BORDER_BOX,
      ]}
    >
      {showHeader && (
        <View style={styles.boardHeader}>
          <View>
            <Text style={styles.puzzleTitle}>{dailyLabel}</Text>
          </View>
          {gameState === 'won' && (
            <View style={[styles.statePill, styles.statePillWon]}>
              <Text style={[styles.statePillText, styles.statePillTextWon]}>Solved</Text>
            </View>
          )}
        </View>
      )}

      <View
        style={[
          styles.board,
          phoneLayout && styles.boardPhone,
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
                  if (cell === 'release' && releaseGroupIndex !== undefined) {
                    setActiveGroupIndex(releaseGroupIndex);
                  }
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
                  pressed && cell === null && styles.cellPressed,
                ]}
              >
                {cell === 'frozen' && (
                  <ThemedLibertiesPiece
                    kind="blocker"
                    size={stoneSize}
                    styles={styles}
                    visualTheme={visualTheme}
                  />
                )}
                {cell === 'release' && releaseGroupIndex !== undefined && (
                  <View
                    style={[
                      styles.releaseHalo,
                      {
                        width: haloSize,
                        height: haloSize,
                        borderRadius: getThemeMarkerRadius(haloSize, visualTheme),
                        borderColor: getGroupAccent(releaseGroupIndex),
                        opacity: releaseHighlighted ? 0.78 : 0.34,
                      },
                      releaseHighlighted && styles.releaseHaloActive,
                    ]}
                  />
                )}
                {cell === 'release' && (
                  <ThemedLibertiesPiece
                    kind="release"
                    size={stoneSize}
                    styles={styles}
                    visualTheme={visualTheme}
                  />
                )}
                {cell === 'white' && groupIndex !== undefined && (
                  <View
                    style={[
                      styles.lightGroupHalo,
                      {
                        width: haloSize,
                        height: haloSize,
                        borderRadius: getThemeMarkerRadius(haloSize, visualTheme),
                        borderColor: getGroupAccent(groupIndex),
                        opacity: highlightedGroupIndexes.has(groupIndex) ? 0.78 : 0.34,
                      },
                      highlightedGroupIndexes.has(groupIndex) && styles.lightGroupHaloActive,
                    ]}
                  />
                )}
                {(cell === 'black' || cell === 'white') && (
                  <ThemedLibertiesPiece
                    kind={cell}
                    size={stoneSize}
                    styles={styles}
                    visualTheme={visualTheme}
                  />
                )}
                {selected && cell === null && (
                  <View
                    style={[
                      styles.previewRing,
                      !previewLegal && styles.previewRingInvalid,
                      {
                        width: previewMarkerSize,
                        height: previewMarkerSize,
                        borderRadius: getThemeMarkerRadius(previewMarkerSize, visualTheme),
                      },
                    ]}
                  />
                )}
                {hovered && cell === null && !selected && (
                  <View
                    style={[
                      styles.hoverRing,
                      {
                        width: previewMarkerSize,
                        height: previewMarkerSize,
                        borderRadius: getThemeMarkerRadius(previewMarkerSize, visualTheme),
                      },
                    ]}
                  />
                )}
                {isActiveOpenSide && !previewing && (
                  <View
                    style={[
                      styles.openSideMarker,
                      {
                        width: openSideMarkerSize,
                        height: openSideMarkerSize,
                        borderRadius: getThemeMarkerRadius(openSideMarkerSize, visualTheme),
                        borderColor: getGroupAccent(activeGroupIndex ?? 0),
                      },
                    ]}
                  />
                )}
                {recentlyResponded && !previewing && (
                  <View
                    style={[
                      styles.releasedPulse,
                      {
                        width: previewMarkerSize,
                        height: previewMarkerSize,
                        borderRadius: getThemeMarkerRadius(previewMarkerSize, visualTheme),
                      },
                    ]}
                  />
                )}
                {previewing && (
                  <ThemedLibertiesPiece
                    kind="black"
                    size={previewStoneSize}
                    styles={styles}
                    visualTheme={visualTheme}
                    preview
                    invalid={!previewLegal}
                  />
                )}
                {hinted && !previewing && cell === null && (
                  <View
                    style={[
                      styles.hintRing,
                      {
                        width: hintMarkerSize,
                        height: hintMarkerSize,
                        borderRadius: getThemeMarkerRadius(hintMarkerSize, visualTheme),
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
  );
});

function LibertiesMetric({
  label,
  value,
  styles,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  styles: ReturnType<typeof createStyles>;
  tone?: LibertiesMetricTone;
}) {
  return (
    <View style={styles.mobileMetric}>
      <Text style={[styles.mobileMetricValue, tone === 'success' && styles.mobileMetricValueSuccess]}>{value}</Text>
      <Text style={styles.mobileMetricLabel}>{label}</Text>
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
  const [visualThemeId, setVisualThemeId] = useState<LibertiesVisualThemeId>(() =>
    parseLibertiesVisualThemeId(readSearchParam('theme') ?? readStorageItem(THEME_STORAGE_KEY))
  );
  const visualTheme = useMemo(
    () => getLibertiesVisualTheme(theme.mode, visualThemeId),
    [theme.mode, visualThemeId]
  );
  const screenAccent = useMemo(() => resolveScreenAccent('liberties', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent, visualTheme), [theme, screenAccent, visualTheme]);
  const { width, height } = useWindowDimensions();
  const layoutWidth =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? Math.min(
          width,
          window.innerWidth,
          window.outerWidth || Number.POSITIVE_INFINITY,
          window.visualViewport?.width ?? Number.POSITIVE_INFINITY,
          typeof document !== 'undefined' ? document.documentElement.clientWidth : Number.POSITIVE_INFINITY
        )
      : width;
  const demoMode = useMemo(() => readDemoMode(), []);
  const puzzleOverride = useMemo(() => getPreviewPuzzleFromOverride(readPuzzleOverride()), []);
  const queryMode = useMemo(() => {
    const value = readSearchParam('mode');
    return isLibertiesPlayMode(value) ? value : null;
  }, []);
  const isPreviewMode = demoMode !== null || puzzleOverride !== null || readSearchParam('howTo') === '1';
  const [playMode, setPlayMode] = useState<LibertiesPlayMode>(() => {
    return queryMode ?? getInitialLibertiesPlayMode();
  });
  const activeMode: LibertiesPlayMode = isPreviewMode ? 'standard' : playMode;
  const dailyEntry = useMemo(() => getDailyLibertiesEntry(new Date(), activeMode), [activeMode]);
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
  const [isStyleMenuVisible, setIsStyleMenuVisible] = useState(false);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const hasCountedRef = useRef(false);

  const handleVisualThemeChange = useCallback((nextTheme: LibertiesVisualThemeId) => {
    setVisualThemeId(nextTheme);
    writeStorageItem(THEME_STORAGE_KEY, nextTheme);
  }, []);

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
  const isPhoneLayout = layoutWidth < 720;
  const desktopHeightCap = Math.max(620, height - 300);
  const boardCap = isPhoneLayout
    ? Math.min(520, layoutWidth - 24)
    : Math.min(layoutWidth >= 1100 ? 940 : layoutWidth >= 900 ? 860 : 740, desktopHeightCap);
  const mobileHeightCap = Math.max(300, height - (gameState === 'won' ? 330 : 244));
  const boardInset = isPhoneLayout ? 40 : layoutWidth < 900 ? 72 : 24;
  const boardFloor = isPhoneLayout ? Math.min(Math.max(layoutWidth - 56, 276), 340) : 380;
  const boardSize = isPhoneLayout
    ? Math.max(276, Math.min(layoutWidth - boardInset, mobileHeightCap, boardCap))
    : Math.min(Math.max(layoutWidth - boardInset, boardFloor), boardCap);
  const boardPadding = isPhoneLayout
    ? Math.max(22, Math.min(42, boardSize * 0.07))
    : Math.max(34, Math.min(54, boardSize * 0.075));
  const gridSpan = boardSize - boardPadding * 2;
  const pointGap = gridSpan / Math.max(1, puzzle.size - 1);
  const stoneSize = Math.min(pointGap * (isPhoneLayout ? 0.8 : 0.78), isPhoneLayout ? 52 : 68);
  const previewStoneSize = stoneSize;
  const guideStoneSize = stoneSize;
  const hitSize = Math.max(isPhoneLayout ? 44 : stoneSize * 1.16, Math.min(pointGap * 1.02, isPhoneLayout ? 58 : 78));
  const gridLineThickness = isPhoneLayout && boardSize < 360 ? 1 : 2;
  const dailyLabel = useMemo(() => formatUtcDateLabel(dateKey), [dateKey]);
  const lowestMoveCount = useMemo(
    () => (gameState === 'won' ? getLowestLibertiesMoveCount(puzzle) : null),
    [gameState, puzzle]
  );
  const shareText = useMemo(
    () =>
      formatLibertiesShareText({
        date: dateKey,
        moves: moves.length,
        elapsedSeconds,
        hintsUsed,
        url: getShareUrl(activeMode),
      }),
    [activeMode, dateKey, elapsedSeconds, hintsUsed, moves.length]
  );
  const modeIsLocked = isPreviewMode;
  const isHardMode = activeMode === 'hard';
  const isStandardMode = activeMode === 'standard';
  const displayedModeLabel = isHardMode ? 'Hard mode' : 'Standard mode';
  const displayedPuzzleDifficulty = puzzle.difficulty;
  const handleModeChange = useCallback(
    (nextMode: LibertiesPlayMode) => {
      if (modeIsLocked || nextMode === activeMode) return;
      setPlayMode(nextMode);
    },
    [activeMode, modeIsLocked]
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
    if (isPreviewMode) return;
    writeStorageItem(MODE_STORAGE_KEY, playMode);
  }, [isPreviewMode, playMode]);

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
    const raw = readStorageItem(getProgressStorageKey(dateKey, activeMode));
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
  }, [activeMode, dateKey, demoMode, puzzle, puzzleOverride]);

  useEffect(() => {
    if (!hasRestoredProgress || isPreviewMode) return;
    const payload: PersistedLibertiesState = {
      version: PROGRESS_STORAGE_VERSION,
      moves,
      gameState,
      elapsedSeconds,
      hintsUsed,
    };
    writeStorageItem(getProgressStorageKey(dateKey, activeMode), JSON.stringify(payload));
  }, [activeMode, dateKey, elapsedSeconds, gameState, hasRestoredProgress, hintsUsed, isPreviewMode, moves]);

  useEffect(() => {
    if (gameState !== 'playing' || !solved) return;
    setGameState('won');
  }, [gameState, solved]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current || isPreviewMode) return;
    hasCountedRef.current = true;
    const shouldCount = markDailySolved(dateKey, activeMode);
    if (shouldCount) {
      incrementGlobalPlayCount(PLAY_COUNT_KEY);
    }
  }, [activeMode, dateKey, gameState, isPreviewMode]);

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
      const darkClearStatus = formatDarkClearStatus(result.capturedDark.length);
      if (result.captured.length > 0 && result.responses.length > 0) {
        setStatusMessage(
          `Standard move: white stretched to ${formatPointLabel(result.responses[0]!)} and cleared ${result.captured.length} white pebble${result.captured.length === 1 ? '' : 's'}.${darkClearStatus}`
        );
      } else if (result.captured.length > 0) {
        setStatusMessage(
          `Cleared ${result.captured.length} white pebble${result.captured.length === 1 ? '' : 's'}. Your turn again before white stretches.${darkClearStatus}`
        );
      } else if (result.responses.length > 0) {
        setStatusMessage(
          `Standard move: white stretched to ${formatPointLabel(result.responses[0]!)}.${darkClearStatus}`
        );
      } else if (darkClearStatus) {
        setStatusMessage(darkClearStatus.trim());
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
    if (
      hintPoint &&
      selectedPoint &&
      samePoint(hintPoint, selectedPoint) &&
      board[hintPoint.row]?.[hintPoint.col] === null
    ) {
      commitMove(hintPoint);
      return;
    }

    const nextHint = getBestLibertiesHintMove(puzzle, board);
    if (!nextHint) {
      setStatusMessage('No useful hint is available from this position.');
      return;
    }
    setHintPoint(nextHint.point);
    setSelectedPoint(nextHint.point);
    setHintsUsed((previous) => previous + 1);
    setShareStatus(null);
    setStatusMessage(
      nextHint.movesToSolve <= 1
        ? 'Hint marks the clearing move. Tap the crossing or press Hint again to place.'
        : `Hint marks the move floor from here: ${nextHint.movesToSolve} moves left. Tap the crossing or press Hint again to place.`
    );
  }, [board, commitMove, gameState, hintPoint, puzzle, selectedPoint]);

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

  const phoneChromeWidth = Math.max(260, Math.min(layoutWidth - 32, 520));
  const phoneChromeStyle = isPhoneLayout
    ? Platform.OS === 'web'
      ? ({ width: 'calc(100vw - 32px)', maxWidth: phoneChromeWidth, alignSelf: 'center' as const } as const)
      : { width: phoneChromeWidth, maxWidth: phoneChromeWidth, alignSelf: 'center' as const }
    : null;
  const themeSwitcher = (
    <View style={[styles.themeSwitcher, isPhoneLayout && styles.themeSwitcherPhone, phoneChromeStyle]}>
      {LIBERTIES_VISUAL_THEME_IDS.map((themeId) => {
        const active = themeId === visualThemeId;
        return (
          <Pressable
            key={themeId}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [
              styles.themeButton,
              active && styles.themeButtonActive,
              pressed && styles.themeButtonPressed,
            ]}
            onPress={() => {
              handleVisualThemeChange(themeId);
              setIsStyleMenuVisible(false);
            }}
          >
            <Text style={[styles.themeButtonText, active && styles.themeButtonTextActive]}>
              {LIBERTIES_VISUAL_THEME_LABELS[themeId]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const modeSectionSurface = (
    <View style={[styles.modeSection, isPhoneLayout && styles.modeSectionPhone, phoneChromeStyle]}>
      <Text style={styles.modeSectionLabel}>Player mode: {displayedModeLabel}</Text>
      <View style={styles.modeSectionControls}>
        <Pressable
          accessibilityRole="button"
          disabled={modeIsLocked || isStandardMode}
          style={({ pressed }) => [
            styles.modeSectionButton,
            isStandardMode ? styles.modeSectionButtonActive : styles.modeSectionButtonInactive,
            modeIsLocked && styles.modeSectionButtonDisabled,
            pressed && !modeIsLocked && !isStandardMode && styles.modeSectionButtonPressed,
          ]}
          onPress={() => handleModeChange('standard')}
        >
          <Text style={[styles.modeSectionButtonText, isStandardMode && styles.modeSectionButtonTextActive]}>Standard</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={modeIsLocked || isHardMode}
          style={({ pressed }) => [
            styles.modeSectionButton,
            isHardMode ? styles.modeSectionButtonActive : styles.modeSectionButtonInactive,
            modeIsLocked && styles.modeSectionButtonDisabled,
            pressed && !modeIsLocked && !isHardMode && styles.modeSectionButtonPressed,
          ]}
          onPress={() => handleModeChange('hard')}
        >
          <Text style={[styles.modeSectionButtonText, isHardMode && styles.modeSectionButtonTextActive]}>Hard</Text>
        </Pressable>
      </View>
      <Text style={styles.modeSectionMapLabel}>Map label: {displayedPuzzleDifficulty}</Text>
    </View>
  );

  const topBarSurface = (
    <View style={[styles.gameTopBar, isPhoneLayout && styles.gameTopBarPhone, phoneChromeStyle]}>
      <View style={styles.mobileTitleCluster}>
        <Text style={styles.gameTitle}>{PUBLIC_GAME_TITLE}</Text>
        <Text style={styles.gameDate}>{dailyLabel}</Text>
      </View>
      {!isPhoneLayout && (
        <View style={styles.desktopMetricsInline}>
          <View style={styles.desktopMetric}>
            <Text style={styles.desktopMetricValue}>{moves.length}</Text>
            <Text style={styles.desktopMetricLabel}>Moves</Text>
          </View>
          <View style={styles.desktopMetric}>
            <Text style={styles.desktopMetricValue}>{clearedCount}</Text>
            <Text style={styles.desktopMetricLabel}>Cleared</Text>
          </View>
          <View style={styles.desktopMetric}>
            <Text style={styles.desktopMetricValue}>{formatTime(elapsedSeconds)}</Text>
            <Text style={styles.desktopMetricLabel}>Time</Text>
          </View>
        </View>
      )}
      <View style={styles.mobileTopActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="How to play"
          style={({ pressed }) => [styles.mobileTopButton, pressed && styles.mobileTopButtonPressed]}
          onPress={() => setIsHowToVisible(true)}
        >
          <Text style={styles.mobileTopButtonText}>?</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose visual style"
          accessibilityState={{ expanded: isStyleMenuVisible }}
          style={({ pressed }) => [styles.mobileTopButton, pressed && styles.mobileTopButtonPressed]}
          onPress={() => setIsStyleMenuVisible((current) => !current)}
        >
          <Text style={styles.mobileTopButtonText}>◐</Text>
        </Pressable>
      </View>
    </View>
  );

  const metricsSurface = (
    <View style={[styles.metricsBar, isPhoneLayout && styles.metricsBarPhone, phoneChromeStyle]}>
      <LibertiesMetric label="Moves" value={moves.length} styles={styles} />
      <LibertiesMetric label="Cleared" value={clearedCount} styles={styles} tone={gameState === 'won' ? 'success' : 'default'} />
      <LibertiesMetric label="Time" value={formatTime(elapsedSeconds)} styles={styles} />
    </View>
  );

  const boardSurface = (
    <LibertiesBoardCard
      activeGroupIndex={activeGroupIndex}
      activeOpenSideKeys={activeOpenSideKeys}
      board={board}
      boardPadding={boardPadding}
      boardSize={boardSize}
      dailyLabel={dailyLabel}
      gameState={gameState}
      gridLineThickness={gridLineThickness}
      gridSpan={gridSpan}
      groupIndexByPoint={groupIndexByPoint}
      guideStoneSize={guideStoneSize}
      handlePointPress={handlePointPress}
      highlightedGroupIndexes={highlightedGroupIndexes}
      hintPoint={hintPoint}
      hitSize={hitSize}
      hoverPoint={hoverPoint}
      phoneLayout={isPhoneLayout}
      pointGap={pointGap}
      previewStoneSize={previewStoneSize}
      puzzle={puzzle}
      recentResponseKeys={recentResponseKeys}
      releaseIndexByPoint={releaseIndexByPoint}
      selectedPoint={selectedPoint}
      setActiveGroupIndex={setActiveGroupIndex}
      setHoverPoint={setHoverPoint}
      showHeader={false}
      stoneSize={stoneSize}
      styles={styles}
      visualTheme={visualTheme}
      width={width}
    />
  );

  const statusSurface = statusMessage ? (
    <View style={[styles.statusCard, isPhoneLayout && styles.statusCardPhone, phoneChromeStyle]}>
      <Text style={styles.statusText}>{statusMessage}</Text>
    </View>
  ) : isPhoneLayout ? (
    <View style={[styles.statusCard, styles.statusCardIdle, phoneChromeStyle]}>
      <Text style={[styles.statusText, styles.statusTextIdle]}>Tap once to preview. Tap again to place.</Text>
    </View>
  ) : null;

  const controlsSurface = (
    <View style={[styles.controls, isPhoneLayout && styles.controlsPhone, phoneChromeStyle]}>
      <Pressable
        accessibilityRole="button"
        disabled={moves.length === 0}
        style={({ pressed }) => [
          styles.secondaryButton,
          isPhoneLayout && styles.secondaryButtonPhone,
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
          isPhoneLayout && styles.secondaryButtonPhone,
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
          isPhoneLayout && styles.secondaryButtonPhone,
          pressed && styles.secondaryButtonPressed,
        ]}
        onPress={handleReset}
      >
        <Text style={styles.secondaryButtonText}>Reset</Text>
      </Pressable>
    </View>
  );

  const winSurface = gameState === 'won' ? (
    <View style={[styles.winCard, isPhoneLayout && styles.winCardPhone]}>
      <Text style={styles.winTitle}>Cleared in {moves.length} moves</Text>
      {lowestMoveCount !== null && (
        <View style={styles.bestScoreCard}>
          <Text style={styles.bestScoreLabel}>Lowest possible today</Text>
          <Text style={styles.bestScoreValue}>
            {lowestMoveCount} move{lowestMoveCount === 1 ? '' : 's'}
          </Text>
          <Text style={styles.bestScoreNote}>
            {moves.length === lowestMoveCount
              ? 'You hit the move floor. Time breaks ties.'
              : 'Score is moves first. Time breaks ties.'}
          </Text>
        </View>
      )}
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
  ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: PUBLIC_GAME_TITLE,
          headerBackTitle: 'Games',
          headerShown: false,
        }}
      />
      <Modal
        animationType="fade"
        transparent
        visible={isHowToVisible}
        onRequestClose={() => setIsHowToVisible(false)}
      >
        <View style={[styles.modalOverlay, isPhoneLayout && styles.modalOverlayPhone]}>
          <View style={[styles.howToCard, isPhoneLayout && styles.howToCardPhone]}>
            <ScrollView contentContainerStyle={styles.howToScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.howToHeader}>
                <View>
                  <Text style={styles.howToKicker}>How to play</Text>
                  <Text accessibilityRole="header" style={styles.howToTitle}>Clear the white groups</Text>
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
                <Text style={styles.objectiveTitle}>Goal</Text>
                <Text style={styles.objectiveText}>
                  Place black pebbles on empty crossings. Clear each white group by closing every
                  empty side crossing directly beside that white group.
                </Text>
              </View>

              <Text accessibilityRole="header" style={styles.modalTitle}>Your move</Text>
              <View style={styles.rulesList}>
                <HowToMiniBoard
                  grid={HOW_TO_OPEN_GRID}
                  label="Board example"
                  caption="Pebbles sit where grid lines meet. White pebbles touching side-to-side are one white group."
                  styles={styles}
                  visualTheme={visualTheme}
                />
                <Text style={styles.ruleListTitle}>Rules</Text>
                {QUICK_START_RULES.map((rule) => (
                  <HowToRuleItem key={rule} text={rule} styles={styles} />
                ))}
              </View>

              <Text accessibilityRole="header" style={styles.modalTitle}>When white moves</Text>
              <View style={[styles.rulesList, styles.rulesListSecondary]}>
                <Text style={styles.ruleListIntro}>
                  White moves only after a standard move: a black pebble that clears no white group.
                  White adds one white pebble beside an existing white group.
                </Text>
                <HowToStretchOrderBoard styles={styles} visualTheme={visualTheme} />
                <View style={styles.whiteMoveSteps}>
                  {WHITE_STRETCH_RULES.map((rule, index) => (
                    <HowToNumberedItem key={rule} index={index} text={rule} styles={styles} />
                  ))}
                </View>
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isPhoneLayout && styles.scrollContentPhone]}
      >
        <View style={[styles.page, isPhoneLayout && styles.pagePhone, WEB_BORDER_BOX]}>
          {isPhoneLayout ? (
            <>
              {topBarSurface}
              {metricsSurface}
              {modeSectionSurface}
              {isStyleMenuVisible && themeSwitcher}
              {boardSurface}
              {statusSurface}
              {controlsSurface}
              {winSurface}
            </>
          ) : (
            <>
              {topBarSurface}
              {modeSectionSurface}
              {isStyleMenuVisible && themeSwitcher}
              {boardSurface}
              {statusSurface}
              {controlsSurface}
              {winSurface}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (
  theme: ThemeTokens,
  screenAccent: ReturnType<typeof resolveScreenAccent>,
  visualTheme: LibertiesVisualTheme
) => {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const FontSize = theme.fontSize;
  const BorderRadius = theme.borderRadius;
  const ui = createDaybreakPrimitives(theme, screenAccent);
  const boardColor = visualTheme.boardColor;
  const boardLine = visualTheme.boardLine;
  const boardEdge = visualTheme.boardEdge;
  const pointHover = visualTheme.pointHover;
  const pointSelected = visualTheme.pointSelected;
  const tileColor = visualTheme.tileColor;
  const modalSurface = theme.mode === 'dark' ? '#121a23' : '#ffffff';
  const modalPanelSurface = theme.mode === 'dark' ? '#1b2632' : '#eef2f8';
  const modalAccentPanel = theme.mode === 'dark' ? '#173637' : '#e3f6f1';
  const phoneChromeWidth =
    Platform.OS === 'web'
      ? ({ width: 'calc(100% - 16px)', maxWidth: 'calc(100% - 16px)', marginHorizontal: 8, boxSizing: 'border-box' } as any)
      : { width: 'auto', maxWidth: '100%', marginHorizontal: 8 };

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
    scrollContentPhone: {
      paddingBottom: Spacing.md,
    },
    page: {
      ...ui.page,
      maxWidth: 1040,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.lg,
      gap: Spacing.md,
    },
    pagePhone: {
      maxWidth: '100%',
      paddingHorizontal: 0,
      paddingTop: 6,
      gap: 8,
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
    gameTopBar: {
      alignSelf: 'stretch',
      minHeight: 54,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      overflow: 'hidden',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.7)',
      paddingHorizontal: Spacing.md,
      paddingVertical: 7,
    },
    gameTopBarPhone: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      minHeight: 48,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
      backgroundColor: Colors.surfaceGlass,
    },
    gameTitle: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 22,
    },
    gameDate: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 15,
    },
    desktopMetricsInline: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.lg,
      flexShrink: 0,
      paddingHorizontal: Spacing.md,
    },
    desktopMetric: {
      minWidth: 78,
      alignItems: 'center',
      justifyContent: 'center',
    },
    desktopMetricValue: {
      color: Colors.text,
      fontSize: FontSize.md,
      lineHeight: 18,
      fontWeight: '900',
    },
    desktopMetricLabel: {
      marginTop: 1,
      color: Colors.textMuted,
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    metricsBar: {
      alignSelf: 'stretch',
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.028)' : 'rgba(255,255,255,0.56)',
      padding: 4,
    },
    metricsBarPhone: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      minHeight: 50,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.74)',
    },
    mobileTopBar: {
      ...phoneChromeWidth,
      alignSelf: 'stretch',
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      overflow: 'hidden',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceGlass,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 6,
    },
    mobileTitleCluster: {
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
    },
    mobileTitle: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: '900',
      lineHeight: 22,
    },
    mobileDate: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 15,
    },
    mobileTopActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexShrink: 0,
    },
    mobileTopButton: {
      minHeight: 36,
      minWidth: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
      paddingHorizontal: 8,
    },
    mobileTopButtonPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.98 }],
    },
    mobileTopButtonText: {
      color: screenAccent.badgeText,
      fontSize: 14,
      fontWeight: '900',
    },
    mobileStatsBar: {
      ...phoneChromeWidth,
      alignSelf: 'stretch',
      minHeight: 50,
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.74)',
      padding: 4,
    },
    mobileMetric: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      borderRadius: BorderRadius.md,
    },
    mobileMetricValue: {
      color: Colors.text,
      fontSize: FontSize.md,
      lineHeight: 19,
      fontWeight: '900',
    },
    mobileMetricValueSuccess: {
      color: Colors.success,
    },
    mobileMetricLabel: {
      marginTop: 1,
      color: Colors.textMuted,
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    modeSection: {
      marginTop: Spacing.md,
      gap: Spacing.sm,
    },
    modeSectionLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.9,
    },
    modeSectionControls: {
      flexDirection: 'row',
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    modeSectionButton: {
      ...ui.pill,
      minWidth: 122,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f2f6fb',
    },
    modeSectionButtonActive: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    modeSectionButtonInactive: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.56)',
    },
    modeSectionButtonDisabled: {
      opacity: 0.55,
    },
    modeSectionButtonPressed: {
      opacity: 0.86,
      transform: [{ scale: 0.98 }],
    },
    modeSectionButtonText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    modeSectionButtonTextActive: {
      color: screenAccent.badgeText,
    },
    modeSectionMapLabel: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      backgroundColor: theme.mode === 'dark' ? 'rgba(5, 8, 12, 0.88)' : Colors.overlay,
    },
    modalOverlayPhone: {
      justifyContent: 'flex-end',
      padding: 8,
      paddingTop: Spacing.lg,
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
    howToCardPhone: {
      maxHeight: '88%',
      borderBottomLeftRadius: BorderRadius.lg,
      borderBottomRightRadius: BorderRadius.lg,
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
      color: Colors.text,
      fontSize: FontSize.md,
      lineHeight: 22,
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
    rulesListSecondary: {
      borderColor: Colors.border,
      backgroundColor: modalPanelSurface,
      paddingTop: Spacing.md,
      gap: Spacing.md,
    },
    ruleListTitle: {
      color: screenAccent.main,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    ruleListIntro: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
      fontWeight: '700',
      marginTop: -4,
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
    numberedRuleItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.xs,
    },
    numberedRuleIndex: {
      width: 22,
      height: 22,
      borderRadius: 999,
      overflow: 'hidden',
      color: screenAccent.badgeText,
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 20,
      fontWeight: '900',
      marginTop: 0,
    },
    numberedRuleText: {
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
    howToStretchPanel: {
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.xs,
    },
    howToStretchBoard: {
      width: 176,
      height: 176,
      overflow: 'hidden',
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: boardEdge,
      backgroundColor: boardColor,
      position: 'relative',
      shadowColor: '#000',
      shadowOpacity: theme.mode === 'dark' ? 0.2 : 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      ...WEB_NO_SELECT,
    },
    howToStretchPath: {
      position: 'absolute',
      height: 6,
      borderRadius: 999,
      backgroundColor: screenAccent.main,
      opacity: theme.mode === 'dark' ? 0.72 : 0.58,
    },
    howToStretchCandidate: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      backgroundColor: theme.mode === 'dark' ? 'rgba(17, 29, 35, 0.84)' : 'rgba(255, 255, 255, 0.78)',
    },
    howToStretchShortCandidate: {
      borderColor: theme.mode === 'dark' ? 'rgba(215, 154, 51, 0.72)' : 'rgba(172, 111, 20, 0.62)',
    },
    howToStretchChosenCandidate: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    howToStretchCandidateText: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '900',
    },
    howToStretchChosenText: {
      color: screenAccent.badgeText,
      fontSize: 12,
      fontWeight: '900',
    },
    howToStretchDot: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.18)' : 'rgba(30, 143, 112, 0.12)',
    },
    howToStretchLabel: {
      position: 'absolute',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 999,
      overflow: 'hidden',
      color: Colors.textMuted,
      backgroundColor: theme.mode === 'dark' ? 'rgba(7, 13, 18, 0.78)' : 'rgba(255, 255, 255, 0.78)',
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    howToStretchShortLabel: {
      top: 42,
      left: 104,
    },
    howToStretchLongLabel: {
      top: 80,
      right: 10,
      color: screenAccent.badgeText,
    },
    whiteMoveSteps: {
      gap: Spacing.sm,
      paddingTop: Spacing.xs,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
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
    themeSwitcher: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      alignSelf: 'flex-end',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.58)',
      padding: 4,
    },
    themeSwitcherPhone: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      borderRadius: BorderRadius.lg,
      justifyContent: 'space-between',
      backgroundColor: Colors.surfaceGlass,
      padding: 5,
    },
    themeButton: {
      minHeight: 34,
      minWidth: 68,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    themeButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    themeButtonActive: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    themeButtonText: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0,
    },
    themeButtonTextActive: {
      color: screenAccent.badgeText,
    },
    boardCard: {
      alignSelf: 'center',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.58)',
      padding: Spacing.md,
      gap: Spacing.sm,
      shadowColor: '#000',
      shadowOpacity: theme.mode === 'dark' ? 0.18 : 0.07,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 2,
    },
    boardCardCompact: {
      padding: Spacing.md,
    },
    boardCardPhone: {
      width: '100%',
      maxWidth: '100%',
      alignItems: 'center',
      padding: 0,
      gap: 0,
      borderWidth: 0,
      borderRadius: 0,
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
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
    boardPhone: {
      borderRadius: 20,
      borderWidth: 1,
      shadowOpacity: theme.mode === 'dark' ? 0.24 : 0.16,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
    },
    boardGridLine: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: boardLine,
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
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    cellHovered: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    cellSelected: {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
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
    pieceStage: {
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    blockerPiece: {
      opacity: 0.98,
    },
    releasePiece: {
      opacity: 0.98,
    },
    lightGroupHalo: {
      position: 'absolute',
      borderWidth: 1,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.018)' : 'rgba(255,255,255,0.22)',
    },
    lightGroupHaloActive: {
      borderWidth: 2,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.36)',
    },
    releaseHalo: {
      position: 'absolute',
      borderWidth: 1,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.018)' : 'rgba(255,255,255,0.2)',
    },
    releaseHaloActive: {
      borderWidth: 2,
      backgroundColor: theme.mode === 'dark' ? 'rgba(85, 208, 148, 0.045)' : 'rgba(39, 166, 104, 0.06)',
    },
    hintRing: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.055)' : 'rgba(30, 143, 112, 0.065)',
      opacity: 0.82,
    },
    previewPiece: {
      opacity: 0.68,
    },
    invalidPreviewPiece: {
      opacity: 0.34,
    },
    previewRing: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: pointSelected,
      opacity: 0.76,
    },
    previewRingInvalid: {
      borderColor: Colors.error,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 92, 92, 0.1)' : 'rgba(193, 56, 56, 0.08)',
    },
    hoverRing: {
      position: 'absolute',
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: pointHover,
      opacity: 0.62,
    },
    openSideMarker: {
      position: 'absolute',
      borderWidth: 2,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.36)',
    },
    releasedPulse: {
      position: 'absolute',
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: 'transparent',
      opacity: 0.72,
    },
    statusCard: {
      alignSelf: 'center',
      maxWidth: 740,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      paddingVertical: 9,
      paddingHorizontal: Spacing.md,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: theme.mode === 'dark' ? 'rgba(99, 210, 178, 0.085)' : 'rgba(30, 143, 112, 0.085)',
    },
    statusCardPhone: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      minHeight: 48,
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    statusCardIdle: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      minHeight: 42,
      justifyContent: 'center',
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.68)',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    statusText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '700',
      textAlign: 'center',
    },
    statusTextIdle: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '800',
    },
    controls: {
      alignSelf: 'center',
      width: '100%',
      maxWidth: 520,
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    controlsPhone: {
      ...phoneChromeWidth,
      alignSelf: 'center',
      gap: 8,
    },
    secondaryButton: {
      ...ui.pill,
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    secondaryButtonPhone: {
      minHeight: 48,
      backgroundColor: Colors.surfaceGlass,
      borderColor: Colors.border,
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
    winCardPhone: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
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
    bestScoreCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      padding: Spacing.md,
      gap: 2,
    },
    bestScoreLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    bestScoreValue: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
    },
    bestScoreNote: {
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
