import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { Stack } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import {
  getDailyBridgesPackEntry,
  type BridgesBridge,
  type BridgesIsland,
  type BridgesPuzzle,
} from '../src/data/bridgesPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import { formatUtcDateLabel } from '../src/utils/dailyUtc';
import {
  getBridgesDailyTheme,
  isBridgesThemeMode,
  type BridgesThemeMode,
  type ThemedBoardIsland,
  ThemedBridgeCelebration,
  ThemedBridgesBoard,
} from '../src/ui/bridgesThemes';

type GameState = 'playing' | 'won';
type BridgeState = Record<string, 1 | 2>;

interface NeighborLookup {
  left?: number;
  right?: number;
  up?: number;
  down?: number;
}

interface HistoryEntry {
  bridges: BridgeState;
  anchor: number | null;
}

interface PersistedBridgesState {
  version: 1;
  bridges: BridgeState;
  history: HistoryEntry[];
  anchorIsland: number | null;
  focusedIsland: number | null;
  gameState: GameState;
  elapsedSeconds: number;
  hintsUsed: number;
}

const STORAGE_PREFIX = 'bridges';
const THEME_MODE_STORAGE_KEY = `${STORAGE_PREFIX}:theme-mode`;
const PROGRESS_STORAGE_VERSION = 1;

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
    // Ignore storage failures and keep the game responsive.
  }
}

function getProgressStorageKey(dateKey: string): string {
  return `${STORAGE_PREFIX}:progress:${dateKey}`;
}

function getReadableTextColor(hexColor: string): string {
  const normalized = hexColor.replace('#', '');
  const hex = normalized.length === 3
    ? normalized
        .split('')
        .map((value) => `${value}${value}`)
        .join('')
    : normalized;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;
  return luminance > 150 ? '#102130' : '#f8fbff';
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function makeBridgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function cloneBridges(state: BridgeState): BridgeState {
  return { ...state };
}

function buildNeighborLookup(islands: BridgesIsland[]): Record<number, NeighborLookup> {
  const lookup: Record<number, NeighborLookup> = {};
  islands.forEach((island) => {
    let leftId: number | undefined;
    let rightId: number | undefined;
    let upId: number | undefined;
    let downId: number | undefined;
    let leftCol = Number.NEGATIVE_INFINITY;
    let rightCol = Number.POSITIVE_INFINITY;
    let upRow = Number.NEGATIVE_INFINITY;
    let downRow = Number.POSITIVE_INFINITY;

    islands.forEach((other) => {
      if (other.id === island.id) return;
      if (other.row === island.row) {
        if (other.col < island.col && other.col > leftCol) {
          leftCol = other.col;
          leftId = other.id;
        }
        if (other.col > island.col && other.col < rightCol) {
          rightCol = other.col;
          rightId = other.id;
        }
      }
      if (other.col === island.col) {
        if (other.row < island.row && other.row > upRow) {
          upRow = other.row;
          upId = other.id;
        }
        if (other.row > island.row && other.row < downRow) {
          downRow = other.row;
          downId = other.id;
        }
      }
    });

    lookup[island.id] = {
      left: leftId,
      right: rightId,
      up: upId,
      down: downId,
    };
  });
  return lookup;
}

function getBridgeList(state: BridgeState): BridgesBridge[] {
  return Object.entries(state)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => {
      const [a, b] = key.split('-').map(Number);
      return { island1: a, island2: b, count } as BridgesBridge;
    });
}

function wouldCross(
  candidate: BridgesBridge,
  existing: BridgesBridge,
  islandMap: Map<number, BridgesIsland>
): boolean {
  const a = islandMap.get(candidate.island1);
  const b = islandMap.get(candidate.island2);
  const c = islandMap.get(existing.island1);
  const d = islandMap.get(existing.island2);
  if (!a || !b || !c || !d) return false;
  const candidateHorizontal = a.row === b.row;
  const existingHorizontal = c.row === d.row;
  if (candidateHorizontal === existingHorizontal) return false;

  const horizontal = candidateHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const vertical = candidateHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return (
    vertical.col > horizontal.minCol &&
    vertical.col < horizontal.maxCol &&
    horizontal.row > vertical.minRow &&
    horizontal.row < vertical.maxRow
  );
}

export default function BridgesScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('bridges', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const dailyEntry = useMemo(() => getDailyBridgesPackEntry(), []);
  const puzzle: BridgesPuzzle = dailyEntry.puzzle;
  const dateKey = dailyEntry.date;
  const [bridges, setBridges] = useState<BridgeState>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [anchorIsland, setAnchorIsland] = useState<number | null>(null);
  const [focusedIsland, setFocusedIsland] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<BridgesThemeMode>('themed');
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const hasCountedRef = useRef(false);

  const islandMap = useMemo(() => {
    const next = new Map<number, BridgesIsland>();
    puzzle.islands.forEach((island) => next.set(island.id, island));
    return next;
  }, [puzzle.islands]);

  const neighborLookup = useMemo(() => buildNeighborLookup(puzzle.islands), [puzzle.islands]);

  const neighborPairs = useMemo(() => {
    const pairs = new Set<string>();
    Object.entries(neighborLookup).forEach(([sourceId, dirs]) => {
      const source = Number(sourceId);
      ['left', 'right', 'up', 'down'].forEach((direction) => {
        const target = dirs[direction as keyof NeighborLookup];
        if (typeof target === 'number') {
          pairs.add(makeBridgeKey(source, target));
        }
      });
    });
    return pairs;
  }, [neighborLookup]);

  const bridgeList = useMemo(() => getBridgeList(bridges), [bridges]);

  const previewBridgeList = useMemo(() => {
    if (anchorIsland === null) return [];
    const neighbors = neighborLookup[anchorIsland];
    if (!neighbors) return [];
    const previews: BridgesBridge[] = [];
    Object.values(neighbors).forEach((target) => {
      if (typeof target !== 'number') return;
      const key = makeBridgeKey(anchorIsland, target);
      const current = bridges[key] ?? 0;
      if (current >= 2) return;

      const candidate: BridgesBridge = {
        island1: anchorIsland,
        island2: target,
        count: 1,
      };
      const crossing = bridgeList.some((bridge) => {
        const existingKey = makeBridgeKey(bridge.island1, bridge.island2);
        return existingKey === key ? false : wouldCross(candidate, bridge, islandMap);
      });
      if (!crossing) previews.push(candidate);
    });
    return previews;
  }, [anchorIsland, neighborLookup, bridges, bridgeList, islandMap]);

  const islandCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    puzzle.islands.forEach((island) => {
      counts[island.id] = 0;
    });
    bridgeList.forEach((bridge) => {
      counts[bridge.island1] += bridge.count;
      counts[bridge.island2] += bridge.count;
    });
    return counts;
  }, [bridgeList, puzzle.islands]);

  const isSolved = useMemo(() => {
    const allSatisfied = puzzle.islands.every(
      (island) => islandCounts[island.id] === island.requiredBridges
    );
    if (!allSatisfied) return false;
    if (puzzle.islands.some((island) => islandCounts[island.id] > island.requiredBridges)) {
      return false;
    }
    if (puzzle.islands.length === 0) return false;

    const visited = new Set<number>();
    const stack = [puzzle.islands[0]!.id];
    while (stack.length) {
      const current = stack.pop();
      if (current === undefined || visited.has(current)) continue;
      visited.add(current);
      bridgeList
        .filter((bridge) => bridge.island1 === current || bridge.island2 === current)
        .forEach((bridge) => {
          stack.push(bridge.island1 === current ? bridge.island2 : bridge.island1);
        });
    }

    return visited.size === puzzle.islands.length;
  }, [bridgeList, islandCounts, puzzle.islands]);

  useEffect(() => {
    if (gameState !== 'playing' || !isSolved) return;
    setGameState('won');
    setAnchorIsland(null);
    writeStorageItem(`${STORAGE_PREFIX}:daily:${dateKey}`, '1');
  }, [dateKey, gameState, isSolved]);

  useEffect(() => {
    const currentRaw = readStorageItem(`${STORAGE_PREFIX}:playcount:${dateKey}`);
    if (currentRaw === null && !getStorage()) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(currentRaw || '0', 10);
    writeStorageItem(key, String(current + 1));
  }, [dateKey]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('bridges');
  }, [gameState]);

  useEffect(() => {
    if (!hasRestoredProgress || gameState !== 'playing') return;
    const timer = setInterval(() => setElapsedSeconds((previous) => previous + 1), 1000);
    return () => clearInterval(timer);
  }, [gameState, hasRestoredProgress]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2400);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    const storedMode = readStorageItem(THEME_MODE_STORAGE_KEY);
    if (isBridgesThemeMode(storedMode)) {
      setThemeMode(storedMode);
    }
  }, []);

  useEffect(() => {
    writeStorageItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    setHasRestoredProgress(false);
    const raw = readStorageItem(getProgressStorageKey(dateKey));
    if (!raw) {
      hasCountedRef.current = false;
      setBridges({});
      setHistory([]);
      setAnchorIsland(null);
      setFocusedIsland(null);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
      setHasRestoredProgress(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PersistedBridgesState> | null;
      const islandIds = new Set(puzzle.islands.map((island) => island.id));
      const nextBridges = Object.fromEntries(
        Object.entries(parsed?.bridges ?? {}).filter(
          ([key, value]) =>
            /^\d+-\d+$/.test(key) && (value === 1 || value === 2)
        )
      ) as BridgeState;
      const nextHistory = Array.isArray(parsed?.history)
        ? parsed!.history
            .map((entry) => ({
              bridges: Object.fromEntries(
                Object.entries(entry?.bridges ?? {}).filter(
                  ([key, value]) =>
                    /^\d+-\d+$/.test(key) && (value === 1 || value === 2)
                )
              ) as BridgeState,
              anchor:
                typeof entry?.anchor === 'number' && islandIds.has(entry.anchor)
                  ? entry.anchor
                  : null,
            }))
        : [];
      const nextAnchor =
        typeof parsed?.anchorIsland === 'number' && islandIds.has(parsed.anchorIsland)
          ? parsed.anchorIsland
          : null;
      const nextFocused =
        typeof parsed?.focusedIsland === 'number' && islandIds.has(parsed.focusedIsland)
          ? parsed.focusedIsland
          : null;
      const nextGameState = parsed?.gameState === 'won' ? 'won' : 'playing';

      setBridges(nextBridges);
      setHistory(nextHistory);
      setAnchorIsland(nextAnchor);
      setFocusedIsland(nextFocused);
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
      hasCountedRef.current = nextGameState === 'won';
    } catch {
      hasCountedRef.current = false;
      setBridges({});
      setHistory([]);
      setAnchorIsland(null);
      setFocusedIsland(null);
      setGameState('playing');
      setElapsedSeconds(0);
      setHintsUsed(0);
    } finally {
      setHasRestoredProgress(true);
    }
  }, [dateKey, puzzle.islands]);

  useEffect(() => {
    if (!hasRestoredProgress) return;
    const payload: PersistedBridgesState = {
      version: PROGRESS_STORAGE_VERSION,
      bridges,
      history,
      anchorIsland,
      focusedIsland,
      gameState,
      elapsedSeconds,
      hintsUsed,
    };
    writeStorageItem(getProgressStorageKey(dateKey), JSON.stringify(payload));
  }, [
    anchorIsland,
    bridges,
    dateKey,
    elapsedSeconds,
    focusedIsland,
    gameState,
    hasRestoredProgress,
    hintsUsed,
    history,
  ]);

  const handleThemeModeToggle = useCallback(() => {
    setThemeMode((current) => (current === 'themed' ? 'plain' : 'themed'));
  }, []);

  const handleIslandPress = useCallback(
    (id: number) => {
      if (gameState !== 'playing') return;
      setFocusedIsland(id);
      if (anchorIsland === null) {
        setAnchorIsland(id);
        return;
      }
      if (anchorIsland === id) {
        setAnchorIsland(null);
        return;
      }

      const key = makeBridgeKey(anchorIsland, id);
      if (!neighborPairs.has(key)) {
        setAnchorIsland(id);
        return;
      }

      const current = (bridges[key] ?? 0) as 0 | 1 | 2;
      const next = current === 0 ? 1 : current === 1 ? 2 : 0;

      if (next > 0) {
        const candidate: BridgesBridge = {
          island1: anchorIsland,
          island2: id,
          count: next as 1 | 2,
        };
        const crossing = bridgeList.some((bridge) => {
          const existingKey = makeBridgeKey(bridge.island1, bridge.island2);
          return existingKey === key ? false : wouldCross(candidate, bridge, islandMap);
        });
        if (crossing) {
          setStatusMessage('Bridges cannot cross.');
          return;
        }
      }

      setHistory((previous) => [
        ...previous,
        { bridges: cloneBridges(bridges), anchor: anchorIsland },
      ]);
      setBridges((previous) => {
        const updated = { ...previous };
        if (next === 0) {
          delete updated[key];
        } else {
          updated[key] = next as 1 | 2;
        }
        return updated;
      });
      setAnchorIsland(null);
      setFocusedIsland(null);
    },
    [anchorIsland, bridges, neighborPairs, bridgeList, islandMap, gameState]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (
        key !== 'ArrowUp' &&
        key !== 'ArrowDown' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight' &&
        key !== 'Enter' &&
        key !== ' '
      ) {
        return;
      }
      event.preventDefault();
      const currentId = focusedIsland ?? puzzle.islands[0]?.id ?? null;
      if (currentId === null) return;

      if (key === 'Enter' || key === ' ') {
        handleIslandPress(currentId);
        return;
      }

      const lookup = neighborLookup[currentId];
      let nextId: number | undefined;
      if (key === 'ArrowLeft') nextId = lookup.left;
      if (key === 'ArrowRight') nextId = lookup.right;
      if (key === 'ArrowUp') nextId = lookup.up;
      if (key === 'ArrowDown') nextId = lookup.down;

      if (typeof nextId === 'number') {
        setFocusedIsland(nextId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIsland, neighborLookup, puzzle.islands, handleIslandPress]);

  const handleUndo = useCallback(() => {
    setHistory((previous) => {
      if (previous.length === 0) return previous;
      const next = [...previous];
      const last = next.pop();
      if (last) {
        setBridges(last.bridges);
        setAnchorIsland(last.anchor);
        if (gameState === 'won') setGameState('playing');
      }
      return next;
    });
  }, [gameState]);

  const handleReset = useCallback(() => {
    setBridges({});
    setHistory([]);
    setAnchorIsland(null);
    setFocusedIsland(null);
    setHintsUsed(0);
    setStatusMessage('Board cleared.');
    setGameState('playing');
    setElapsedSeconds(0);
  }, []);

  const handleHint = useCallback(() => {
    if (gameState !== 'playing') return;
    const solutionMap: Record<string, 1 | 2> = {};
    puzzle.solution.forEach((bridge) => {
      solutionMap[makeBridgeKey(bridge.island1, bridge.island2)] = bridge.count;
    });

    const priorityForKey = (key: string): number => {
      const [a, b] = key.split('-').map(Number);
      if (anchorIsland !== null && (a === anchorIsland || b === anchorIsland)) return 0;
      if (focusedIsland !== null && (a === focusedIsland || b === focusedIsland)) return 1;
      return 2;
    };

    const wrongBridge = Object.entries(bridges)
      .filter(([key, current]) => {
        const target = solutionMap[key];
        return target === undefined || current > target;
      })
      .sort(([leftKey], [rightKey]) => priorityForKey(leftKey) - priorityForKey(rightKey))[0];

    if (wrongBridge) {
      const [key] = wrongBridge;
      const target = solutionMap[key];
      setHistory((previous) => [
        ...previous,
        { bridges: cloneBridges(bridges), anchor: anchorIsland },
      ]);
      setBridges((previous) => {
        const updated = { ...previous };
        if (target === undefined) {
          delete updated[key];
        } else {
          updated[key] = target;
        }
        return updated;
      });
      setAnchorIsland(null);
      setFocusedIsland(null);
      setHintsUsed((previous) => previous + 1);
      setStatusMessage(target === undefined ? 'Hint removed a wrong bridge.' : 'Hint reduced an extra bridge.');
      return;
    }

    const pending = Object.entries(solutionMap)
      .filter(([key, count]) => (bridges[key] ?? 0) < count)
      .sort(([leftKey], [rightKey]) => priorityForKey(leftKey) - priorityForKey(rightKey))
      .find(([key, count]) => {
        const [island1, island2] = key.split('-').map(Number);
        const candidate: BridgesBridge = { island1, island2, count };
        return !bridgeList.some((bridge) => {
          const existingKey = makeBridgeKey(bridge.island1, bridge.island2);
          return existingKey === key ? false : wouldCross(candidate, bridge, islandMap);
        });
      });

    if (!pending) {
      setStatusMessage('Clear a blocked route before asking for a hint.');
      return;
    }

    const [key, count] = pending;
    setHistory((previous) => [
      ...previous,
      { bridges: cloneBridges(bridges), anchor: anchorIsland },
    ]);
    setBridges((previous) => ({ ...previous, [key]: count }));
    setAnchorIsland(null);
    setFocusedIsland(null);
    setHintsUsed((previous) => previous + 1);
    setStatusMessage('Hint applied.');
  }, [anchorIsland, bridgeList, bridges, focusedIsland, gameState, islandMap, puzzle.solution]);

  const occupiedBounds = useMemo(() => {
    if (puzzle.islands.length === 0) {
      const fallbackRowCount = puzzle.rowCount ?? puzzle.gridSize;
      const fallbackColCount = puzzle.colCount ?? puzzle.gridSize;
      return {
        minRow: 0,
        maxRow: Math.max(0, fallbackRowCount - 1),
        minCol: 0,
        maxCol: Math.max(0, fallbackColCount - 1),
      };
    }

    let minRow = Number.POSITIVE_INFINITY;
    let maxRow = Number.NEGATIVE_INFINITY;
    let minCol = Number.POSITIVE_INFINITY;
    let maxCol = Number.NEGATIVE_INFINITY;

    puzzle.islands.forEach((island) => {
      minRow = Math.min(minRow, island.row);
      maxRow = Math.max(maxRow, island.row);
      minCol = Math.min(minCol, island.col);
      maxCol = Math.max(maxCol, island.col);
    });

    return { minRow, maxRow, minCol, maxCol };
  }, [puzzle.gridSize, puzzle.islands, puzzle.rowCount, puzzle.colCount]);

  const occupiedRowSpan = Math.max(0, occupiedBounds.maxRow - occupiedBounds.minRow);
  const occupiedColSpan = Math.max(0, occupiedBounds.maxCol - occupiedBounds.minCol);
  const visualRowSpan = Math.max(1, occupiedRowSpan + 2);
  const visualColSpan = Math.max(1, occupiedColSpan + 2);

  const { width } = useWindowDimensions();
  const maxBoardWidth = Math.max(240, Math.min(360, width - Spacing.lg * 2));
  const maxBoardHeight = 430;
  const contentAspect = visualRowSpan / Math.max(1, visualColSpan);
  const boardAspect = Math.max(0.72, Math.min(1.18, contentAspect));
  const boardWidth =
    boardAspect > 1
      ? Math.max(240, Math.min(maxBoardWidth, maxBoardHeight / boardAspect))
      : maxBoardWidth;
  const boardHeight = boardWidth * boardAspect;
  const baseBoardPadding = Spacing.lg;
  const previewInnerWidth = boardWidth - baseBoardPadding * 2;
  const previewInnerHeight = boardHeight - baseBoardPadding * 2;
  const previewCellSize = Math.min(
    previewInnerWidth / Math.max(1, visualColSpan),
    previewInnerHeight / Math.max(1, visualRowSpan)
  );
  const islandSize = Math.min(46, Math.max(30, previewCellSize * 0.82));
  const islandRadius = islandSize / 2;
  const lineThickness = Math.max(3, Math.min(5, previewCellSize * 0.12));
  const boardPadding = Math.max(baseBoardPadding, islandRadius + lineThickness + 4);
  const innerWidth = boardWidth - boardPadding * 2;
  const innerHeight = boardHeight - boardPadding * 2;
  const cellWidth = innerWidth / Math.max(1, visualColSpan);
  const cellHeight = innerHeight / Math.max(1, visualRowSpan);
  const doubleOffset = lineThickness + 4;

  const islandPositions = useMemo(() => {
    const next = new Map<number, { x: number; y: number }>();
    puzzle.islands.forEach((island) => {
      next.set(island.id, {
        x: boardPadding + (island.col - occupiedBounds.minCol + 1) * cellWidth,
        y: boardPadding + (island.row - occupiedBounds.minRow + 1) * cellHeight,
      });
    });
    return next;
  }, [boardPadding, cellHeight, cellWidth, occupiedBounds.minCol, occupiedBounds.minRow, puzzle.islands]);

  const themedIslands = useMemo<ThemedBoardIsland[]>(() => {
    return puzzle.islands
      .map((island) => {
        const position = islandPositions.get(island.id);
        if (!position) return null;
        const count = islandCounts[island.id] ?? 0;
        return {
          id: island.id,
          x: position.x,
          y: position.y,
          requiredBridges: island.requiredBridges,
          count,
          selected: anchorIsland === island.id,
          focused: focusedIsland === island.id && anchorIsland !== island.id,
          satisfied: count === island.requiredBridges,
          over: count > island.requiredBridges,
        };
      })
      .filter((island): island is ThemedBoardIsland => island !== null);
  }, [anchorIsland, focusedIsland, islandCounts, islandPositions, puzzle.islands]);

  const dateLabel = useMemo(() => formatUtcDateLabel(dailyEntry.date), [dailyEntry.date]);

  const puzzleNumber = useMemo(
    () => String(Number(dailyEntry.date.replaceAll('-', '')) % 1000).padStart(3, '0'),
    [dailyEntry.date]
  );
  const dailyLocation = useMemo(
    () => getBridgesDailyTheme(dailyEntry.themeId),
    [dailyEntry.themeId]
  );
  const visualTheme = dailyLocation.theme;
  const useThemedBoard = themeMode === 'themed';
  const themeToggleStyle = useMemo(
    () =>
      useThemedBoard
        ? {
            backgroundColor: visualTheme.accent,
            borderColor: visualTheme.accent,
          }
        : null,
    [useThemedBoard, visualTheme.accent]
  );
  const themeToggleTextStyle = useMemo(
    () =>
      useThemedBoard
        ? {
            color: getReadableTextColor(visualTheme.accent),
          }
        : null,
    [useThemedBoard, visualTheme.accent]
  );
  const shareText = useMemo(() => {
    const resultLine = `Solved in ${formatTime(elapsedSeconds)} · Hints ${hintsUsed}`;
    return [
      `Bridges ${dateLabel} UTC #${puzzleNumber}`,
      resultLine,
      `Today: ${dailyLocation.emoji} ${dailyLocation.label}`,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [
    dateLabel,
    dailyLocation.emoji,
    dailyLocation.label,
    elapsedSeconds,
    hintsUsed,
    puzzleNumber,
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
          title: 'Bridges',
          headerBackTitle: 'Home',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.page}>
          <View style={styles.pageAccent} />
          <View style={styles.header}>
            <Text style={styles.title}>Bridges</Text>
            <Text style={styles.subtitle}>
              Daily puzzle #{puzzleNumber} · {dateLabel} UTC
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Today:</Text>
              <View style={styles.locationChip}>
                <Text style={styles.locationEmoji}>{dailyLocation.emoji}</Text>
                <Text style={styles.locationText}>{dailyLocation.label}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Objective</Text>
            <Text style={styles.sectionBody}>
              Connect islands with bridges so each island's number matches its bridge
              count. Bridges run horizontally or vertically, can be single or double, and
              cannot cross. All islands must be connected into one group.
            </Text>
            <Text style={styles.sectionTitle}>How to play</Text>
            <Text style={styles.sectionBody}>
              Tap an island, then a neighbor in the same row or column to cycle 1, 2, or 0
              bridges. Faint lines show available neighbors for your selected island.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statText}>⏱ {formatTime(elapsedSeconds)}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>Hints {hintsUsed}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.themeToggle,
                themeToggleStyle,
                pressed && styles.themeTogglePressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: useThemedBoard }}
              accessibilityLabel={`Use ${useThemedBoard ? 'plain' : 'themed'} Bridges board`}
              onPress={handleThemeModeToggle}
            >
              <Text style={[styles.themeToggleText, themeToggleTextStyle]}>
                {useThemedBoard ? 'Theme On' : 'Plain'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.boardWrap}>
            {useThemedBoard ? (
              <View style={[styles.themedBoard, { width: boardWidth, height: boardHeight }]}>
                <ThemedBridgesBoard
                  theme={visualTheme}
                  width={boardWidth}
                  height={boardHeight}
                  cellSize={Math.min(cellWidth, cellHeight)}
                  islandRadius={islandRadius}
                  islands={themedIslands}
                  bridges={bridgeList}
                  previewBridges={previewBridgeList}
                />
                {puzzle.islands.map((island) => {
                  const position = islandPositions.get(island.id);
                  if (!position) return null;
                  const count = islandCounts[island.id] ?? 0;
                  const isAnchor = anchorIsland === island.id;
                  return (
                    <Pressable
                      key={island.id}
                      style={({ pressed }) => [
                        styles.themedIslandHitTarget,
                        {
                          width: islandSize,
                          height: islandSize,
                          left: position.x - islandRadius,
                          top: position.y - islandRadius,
                        },
                        pressed && styles.themedIslandHitTargetPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Island ${island.requiredBridges} at row ${island.row + 1} column ${
                        island.col + 1
                      }, needs ${island.requiredBridges} bridges, currently has ${count}.`}
                      accessibilityState={{ selected: isAnchor }}
                      onPress={() => handleIslandPress(island.id)}
                    />
                  );
                })}
              </View>
            ) : (
              <View style={[styles.board, { width: boardWidth, height: boardHeight }]}>
                {previewBridgeList.map((bridge) => {
                  const start = islandPositions.get(bridge.island1);
                  const end = islandPositions.get(bridge.island2);
                  if (!start || !end) return null;
                  const horizontal = start.y === end.y;
                  if (horizontal) {
                    const left = Math.min(start.x, end.x) + islandRadius;
                    const widthValue = Math.abs(start.x - end.x) - islandRadius * 2;
                    const top = start.y - lineThickness / 2;
                    return (
                      <View
                        key={`preview-${bridge.island1}-${bridge.island2}`}
                        pointerEvents="none"
                        style={[
                          styles.previewBridgeLine,
                          {
                            left,
                            top,
                            width: widthValue,
                            height: lineThickness,
                            borderRadius: lineThickness / 2,
                          },
                        ]}
                      />
                    );
                  }

                  const top = Math.min(start.y, end.y) + islandRadius;
                  const heightValue = Math.abs(start.y - end.y) - islandRadius * 2;
                  const left = start.x - lineThickness / 2;
                  return (
                    <View
                      key={`preview-${bridge.island1}-${bridge.island2}`}
                      pointerEvents="none"
                      style={[
                        styles.previewBridgeLine,
                        {
                          left,
                          top,
                          width: lineThickness,
                          height: heightValue,
                          borderRadius: lineThickness / 2,
                        },
                      ]}
                    />
                  );
                })}

                {bridgeList.flatMap((bridge) => {
                  const start = islandPositions.get(bridge.island1);
                  const end = islandPositions.get(bridge.island2);
                  if (!start || !end) return [];
                  const horizontal = start.y === end.y;
                  const offsets =
                    bridge.count === 2 ? [-doubleOffset / 2, doubleOffset / 2] : [0];

                  return offsets.map((offset, index) => {
                    if (horizontal) {
                      const left = Math.min(start.x, end.x) + islandRadius;
                      const widthValue = Math.abs(start.x - end.x) - islandRadius * 2;
                      const top = start.y - lineThickness / 2 + offset;
                      return (
                        <View
                          key={`${bridge.island1}-${bridge.island2}-${index}`}
                          style={[
                            styles.bridgeLine,
                            {
                              left,
                              top,
                              width: widthValue,
                              height: lineThickness,
                              borderRadius: lineThickness / 2,
                            },
                          ]}
                        />
                      );
                    }

                    const top = Math.min(start.y, end.y) + islandRadius;
                    const heightValue = Math.abs(start.y - end.y) - islandRadius * 2;
                    const left = start.x - lineThickness / 2 + offset;
                    return (
                      <View
                        key={`${bridge.island1}-${bridge.island2}-${index}`}
                        style={[
                          styles.bridgeLine,
                          {
                            left,
                            top,
                            width: lineThickness,
                            height: heightValue,
                            borderRadius: lineThickness / 2,
                          },
                        ]}
                      />
                    );
                  });
                })}

                {puzzle.islands.map((island) => {
                  const position = islandPositions.get(island.id);
                  if (!position) return null;
                  const count = islandCounts[island.id] ?? 0;
                  const isSatisfied = count === island.requiredBridges;
                  const isOver = count > island.requiredBridges;
                  const isAnchor = anchorIsland === island.id;
                  const isFocused = focusedIsland === island.id && anchorIsland !== island.id;

                  return (
                    <Pressable
                      key={island.id}
                      style={({ pressed }) => [
                        styles.island,
                        {
                          width: islandSize,
                          height: islandSize,
                          left: position.x - islandRadius,
                          top: position.y - islandRadius,
                        },
                        isSatisfied && styles.islandSatisfied,
                        isOver && styles.islandOver,
                        isAnchor && styles.islandSelected,
                        isFocused && styles.islandFocused,
                        pressed && styles.islandPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Island ${island.requiredBridges} at row ${island.row + 1} column ${
                        island.col + 1
                      }, needs ${island.requiredBridges} bridges, currently has ${count}.`}
                      accessibilityState={{ selected: isAnchor }}
                      onPress={() => handleIslandPress(island.id)}
                    >
                      <Text style={styles.islandText}>{island.requiredBridges}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
          {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

          {gameState === 'won' && (
            <View style={styles.resultCard}>
              <View style={styles.celebrationArt}>
                <ThemedBridgeCelebration theme={visualTheme} />
              </View>
              <Text style={styles.resultTitle}>{visualTheme.celebrationTitle}</Text>
              <Text style={styles.resultSubtitle}>
                {formatTime(elapsedSeconds)} · {hintsUsed} hints
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
            </View>
          )}

          <View style={styles.actions}>
            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                  history.length === 0 && styles.actionButtonDisabled,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Undo last Bridges move"
                onPress={handleUndo}
                disabled={history.length === 0}
              >
                <Text style={styles.actionButtonText}>Undo</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Reset Bridges board"
                onPress={handleReset}
              >
                <Text style={styles.actionButtonText}>Reset</Text>
              </Pressable>
            </View>
            <View style={styles.actionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Get a Bridges hint"
                onPress={handleHint}
              >
                <Text style={styles.actionButtonText}>
                  Hint{hintsUsed > 0 ? ` (${hintsUsed})` : ''}
                </Text>
              </Pressable>
            </View>
          </View>
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
  const bridgesPalette = {
    accent: screenAccent.main,
    board: theme.mode === 'dark' ? theme.colors.surfaceElevated : '#f5f0e8',
    boardBorder: theme.colors.border,
    bridge: theme.mode === 'dark' ? '#9cb3d3' : '#6b7f99',
    island: theme.mode === 'dark' ? '#2a3240' : '#2d3142',
    islandText: theme.colors.white,
    satisfied: theme.colors.success,
    over: theme.colors.error,
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
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    locationLabel: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
    },
    locationChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    locationEmoji: {
      fontSize: 14,
    },
    locationText: {
      fontSize: FontSize.sm,
      fontWeight: '600',
      color: Colors.text,
    },
    sectionTitle: {
      marginTop: Spacing.sm,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: Colors.textMuted,
      fontWeight: '600',
    },
    sectionBody: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
      marginTop: 4,
    },
    statsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    statPill: {
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    statText: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textSecondary,
    },
    themeToggle: {
      backgroundColor: bridgesPalette.accent,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderWidth: 1,
      borderColor: bridgesPalette.accent,
    },
    themeTogglePressed: {
      opacity: 0.88,
    },
    themeToggleText: {
      fontSize: 13,
      fontWeight: '700',
      color: screenAccent.contrast,
    },
    boardWrap: {
      marginTop: Spacing.lg,
      alignItems: 'center',
    },
    board: {
      backgroundColor: bridgesPalette.board,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: bridgesPalette.boardBorder,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
    },
    themedBoard: {
      position: 'relative',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: bridgesPalette.boardBorder,
      backgroundColor: bridgesPalette.board,
      overflow: 'hidden',
    },
    bridgeLine: {
      position: 'absolute',
      backgroundColor: bridgesPalette.bridge,
    },
    previewBridgeLine: {
      position: 'absolute',
      backgroundColor: bridgesPalette.accent,
      opacity: 0.4,
    },
    island: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: bridgesPalette.island,
      borderWidth: 2,
      borderColor: bridgesPalette.island,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themedIslandHitTarget: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themedIslandHitTargetPressed: {
      transform: [{ scale: 0.97 }],
    },
    islandPressed: {
      transform: [{ scale: 0.97 }],
    },
    islandSelected: {
      borderColor: bridgesPalette.accent,
      shadowColor: bridgesPalette.accent,
      shadowOpacity: 0.3,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    islandFocused: {
      borderColor: bridgesPalette.bridge,
    },
    islandSatisfied: {
      backgroundColor: bridgesPalette.satisfied,
      borderColor: bridgesPalette.satisfied,
    },
    islandOver: {
      backgroundColor: bridgesPalette.over,
      borderColor: bridgesPalette.over,
    },
    islandText: {
      fontSize: 16,
      fontWeight: '700',
      color: bridgesPalette.islandText,
    },
    statusText: {
      marginTop: Spacing.sm,
      textAlign: 'center',
      color: Colors.textMuted,
      fontSize: 13,
    },
    resultCard: {
      marginTop: Spacing.lg,
      ...ui.card,
      padding: Spacing.lg,
      alignItems: 'center',
    },
    celebrationArt: {
      width: 220,
      height: 92,
      alignItems: 'center',
      justifyContent: 'center',
    },
    resultTitle: {
      marginTop: Spacing.sm,
      fontSize: 18,
      fontWeight: '700',
      color: Colors.text,
    },
    resultSubtitle: {
      marginTop: 4,
      fontSize: 13,
      color: Colors.textSecondary,
    },
    shareCard: {
      marginTop: Spacing.md,
      width: '100%',
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    shareTitle: {
      fontSize: FontSize.sm,
      fontWeight: '700',
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
    },
    shareButton: {
      ...ui.cta,
      marginTop: Spacing.sm,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
    },
    shareButtonPressed: {
      opacity: 0.9,
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
      marginTop: Spacing.xl,
      gap: Spacing.sm,
    },
    actionRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionButton: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: Colors.surfaceGlass,
      borderWidth: 1,
      borderColor: Colors.line,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonPressed: {
      transform: [{ scale: 0.98 }],
    },
    actionButtonDisabled: {
      opacity: 0.5,
    },
    actionButtonText: {
      fontSize: FontSize.md,
      fontWeight: '600',
      color: Colors.text,
    },
  });
};
