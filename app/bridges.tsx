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
import { BorderRadius, Colors, FontSize, Spacing } from '../src/constants/theme';
import {
  getDailyBridges,
  BridgesBridge,
  BridgesIsland,
  BridgesPuzzle,
} from '../src/data/bridgesPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

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

const STORAGE_PREFIX = 'bridges';

const BRIDGES_COLORS = {
  accent: '#e8a838',
  board: '#f5f0e8',
  boardBorder: '#e3dccf',
  bridge: '#6b7f99',
  island: '#2d3142',
  islandText: '#f5f0e8',
  satisfied: '#5b8a72',
  over: '#d64045',
};

const DAILY_LOCATIONS = [
  { emoji: '🏝️', label: 'Pacific Islands' },
  { emoji: '❄️', label: 'Arctic Drift' },
  { emoji: '🏜️', label: 'Desert Trails' },
  { emoji: '🌋', label: 'Volcanic Rim' },
  { emoji: '🌿', label: 'Rainforest Path' },
  { emoji: '🌌', label: 'Midnight Sky' },
];

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

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
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
    let left: BridgesIsland | null = null;
    let right: BridgesIsland | null = null;
    let up: BridgesIsland | null = null;
    let down: BridgesIsland | null = null;

    islands.forEach((other) => {
      if (other.id === island.id) return;
      if (other.row === island.row) {
        if (other.col < island.col && (!left || other.col > left.col)) {
          left = other;
        }
        if (other.col > island.col && (!right || other.col < right.col)) {
          right = other;
        }
      }
      if (other.col === island.col) {
        if (other.row < island.row && (!up || other.row > up.row)) {
          up = other;
        }
        if (other.row > island.row && (!down || other.row < down.row)) {
          down = other;
        }
      }
    });

    lookup[island.id] = {
      left: left?.id,
      right: right?.id,
      up: up?.id,
      down: down?.id,
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
  const candHorizontal = a.row === b.row;
  const existHorizontal = c.row === d.row;
  if (candHorizontal === existHorizontal) return false;

  const h = candHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const v = candHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return v.col > h.minCol && v.col < h.maxCol && h.row > v.minRow && h.row < v.maxRow;
}

export default function BridgesScreen() {
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const puzzle: BridgesPuzzle = useMemo(() => getDailyBridges(), []);
  const [bridges, setBridges] = useState<BridgeState>({});
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [anchorIsland, setAnchorIsland] = useState<number | null>(null);
  const [focusedIsland, setFocusedIsland] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const hasCountedRef = useRef(false);

  const islandMap = useMemo(() => {
    const map = new Map<number, BridgesIsland>();
    puzzle.islands.forEach((island) => map.set(island.id, island));
    return map;
  }, [puzzle.islands]);

  const neighborLookup = useMemo(
    () => buildNeighborLookup(puzzle.islands),
    [puzzle.islands]
  );

  const neighborPairs = useMemo(() => {
    const pairs = new Set<string>();
    Object.entries(neighborLookup).forEach(([id, dirs]) => {
      const source = Number(id);
      ['left', 'right', 'up', 'down'].forEach((dir) => {
        const target = dirs[dir as keyof NeighborLookup];
        if (typeof target === 'number') {
          pairs.add(makeBridgeKey(source, target));
        }
      });
    });
    return pairs;
  }, [neighborLookup]);

  const bridgeList = useMemo(() => getBridgeList(bridges), [bridges]);

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
    const hasOver = puzzle.islands.some(
      (island) => islandCounts[island.id] > island.requiredBridges
    );
    if (hasOver) return false;
    if (puzzle.islands.length === 0) return false;
    const visited = new Set<number>();
    const stack = [puzzle.islands[0].id];
    while (stack.length) {
      const current = stack.pop();
      if (current === undefined) continue;
      if (visited.has(current)) continue;
      visited.add(current);
      bridgeList
        .filter(
          (bridge) =>
            bridge.island1 === current || bridge.island2 === current
        )
        .forEach((bridge) => {
          const next = bridge.island1 === current ? bridge.island2 : bridge.island1;
          if (!visited.has(next)) stack.push(next);
        });
    }
    return visited.size === puzzle.islands.length;
  }, [bridgeList, islandCounts, puzzle.islands]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!isSolved) return;
    setGameState('won');
    setAnchorIsland(null);
    getStorage()?.setItem(`${STORAGE_PREFIX}:daily:${dateKey}`, '1');
  }, [gameState, isSolved, dateKey]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dateKey]);

  useEffect(() => {
    if (gameState !== 'won' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('bridges');
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2400);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

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

      const current = bridges[key] ?? 0;
      const next = current === 0 ? 1 : current === 1 ? 2 : 0;

      if (next > 0) {
        const candidate: BridgesBridge = {
          island1: anchorIsland,
          island2: id,
          count: next as 1 | 2,
        };
        const crossing = bridgeList.some((bridge) =>
          bridge.island1 === candidate.island1 &&
          bridge.island2 === candidate.island2
            ? false
            : wouldCross(candidate, bridge, islandMap)
        );
        if (crossing) {
          setStatusMessage('Bridges cannot cross.');
          return;
        }
      }

      setHistory((prev) => [...prev, { bridges: cloneBridges(bridges), anchor: anchorIsland }]);
      setBridges((prev) => {
        const updated = { ...prev };
        if (next === 0) {
          delete updated[key];
        } else {
          updated[key] = next as 1 | 2;
        }
        return updated;
      });
      setAnchorIsland(id);
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
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop();
      if (last) {
        setBridges(last.bridges);
        setAnchorIsland(last.anchor);
        if (gameState === 'won') {
          setGameState('playing');
        }
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

    const pending = Object.entries(solutionMap).find(([key, count]) => {
      const current = bridges[key] ?? 0;
      return current < count;
    });

    if (!pending) {
      setStatusMessage('No hints available.');
      return;
    }

    const [key, count] = pending;
    setHistory((prev) => [...prev, { bridges: cloneBridges(bridges), anchor: anchorIsland }]);
    setBridges((prev) => ({ ...prev, [key]: count }));
    setHintsUsed((prev) => prev + 1);
    setStatusMessage('Hint applied.');
  }, [bridges, puzzle.solution, gameState, anchorIsland]);

  const { width } = useWindowDimensions();
  const boardSize = Math.min(360, width - Spacing.lg * 2);
  const boardPadding = Spacing.md;
  const innerSize = boardSize - boardPadding * 2;
  const cellSize = innerSize / Math.max(1, puzzle.gridSize - 1);
  const islandSize = Math.min(52, Math.max(32, cellSize * 0.9));
  const islandRadius = islandSize / 2;
  const lineThickness = Math.max(3, Math.min(6, cellSize * 0.14));
  const doubleOffset = lineThickness + 4;

  const islandPositions = useMemo(() => {
    const map = new Map<number, { x: number; y: number }>();
    puzzle.islands.forEach((island) => {
      map.set(island.id, {
        x: boardPadding + island.col * cellSize,
        y: boardPadding + island.row * cellSize,
      });
    });
    return map;
  }, [puzzle.islands, boardPadding, cellSize]);

  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const puzzleNumber = useMemo(() => {
    const seed = getDailySeed();
    return String(seed % 1000).padStart(3, '0');
  }, []);
  const dailyLocation = useMemo(() => {
    const seed = getDailySeed();
    return DAILY_LOCATIONS[seed % DAILY_LOCATIONS.length];
  }, []);

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
              Daily puzzle #{puzzleNumber} · {dateLabel}
            </Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Today:</Text>
              <View style={styles.locationChip}>
                <Text style={styles.locationEmoji}>{dailyLocation.emoji}</Text>
                <Text style={styles.locationText}>{dailyLocation.label}</Text>
              </View>
            </View>
            <Text style={styles.howTo}>
              Tap an island, then a neighbor in the same row or column to cycle 1, 2, or 0
              bridges. Each number shows the exact bridges needed. Bridges cannot cross and
              all islands must connect.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statText}>⏱ {formatTime(elapsedSeconds)}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>★ {puzzle.difficulty}</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>Hints {hintsUsed}</Text>
            </View>
          </View>

          <View style={styles.boardWrap}>
            <View style={[styles.board, { width: boardSize, height: boardSize }]}>
                {bridgeList.flatMap((bridge) => {
                  const start = islandPositions.get(bridge.island1);
                  const end = islandPositions.get(bridge.island2);
                  if (!start || !end) return [];
                  const horizontal = start.y === end.y;
                  const offsets = bridge.count === 2 ? [-doubleOffset / 2, doubleOffset / 2] : [0];

                  return offsets.map((offset, index) => {
                    if (horizontal) {
                      const left = Math.min(start.x, end.x) + islandRadius;
                      const width = Math.abs(start.x - end.x) - islandRadius * 2;
                      const top = start.y - lineThickness / 2 + offset;
                      return (
                        <View
                          key={`${bridge.island1}-${bridge.island2}-${index}`}
                          style={[
                            styles.bridgeLine,
                            {
                              left,
                              top,
                              width,
                              height: lineThickness,
                              borderRadius: lineThickness / 2,
                            },
                          ]}
                        />
                      );
                    }
                    const top = Math.min(start.y, end.y) + islandRadius;
                    const height = Math.abs(start.y - end.y) - islandRadius * 2;
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
                            height,
                            borderRadius: lineThickness / 2,
                          },
                        ]}
                      />
                    );
                  });
                })}

                {puzzle.islands.map((island) => {
                  const pos = islandPositions.get(island.id);
                  if (!pos) return null;
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
                          left: pos.x - islandRadius,
                          top: pos.y - islandRadius,
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
                      <Text
                        style={styles.islandText}
                      >
                        {island.requiredBridges}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

            {gameState === 'won' && (
              <View style={styles.winBanner}>
                <Text style={styles.winTitle}>Puzzle Complete</Text>
                <Text style={styles.winSubtitle}>All islands connected. Nice work.</Text>
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
    width: 90,
    backgroundColor: BRIDGES_COLORS.accent,
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
  howTo: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  boardWrap: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  board: {
    backgroundColor: BRIDGES_COLORS.board,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: BRIDGES_COLORS.boardBorder,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bridgeLine: {
    position: 'absolute',
    backgroundColor: BRIDGES_COLORS.bridge,
  },
  island: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: BRIDGES_COLORS.island,
    borderWidth: 2,
    borderColor: BRIDGES_COLORS.island,
    alignItems: 'center',
    justifyContent: 'center',
  },
  islandPressed: {
    transform: [{ scale: 0.97 }],
  },
  islandSelected: {
    borderColor: BRIDGES_COLORS.accent,
    shadowColor: BRIDGES_COLORS.accent,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  islandFocused: {
    borderColor: BRIDGES_COLORS.bridge,
  },
  islandSatisfied: {
    backgroundColor: BRIDGES_COLORS.satisfied,
    borderColor: BRIDGES_COLORS.satisfied,
  },
  islandOver: {
    backgroundColor: BRIDGES_COLORS.over,
    borderColor: BRIDGES_COLORS.over,
  },
  islandText: {
    fontSize: 16,
    fontWeight: '700',
    color: BRIDGES_COLORS.islandText,
  },
  statusText: {
    marginTop: Spacing.md,
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
  },
  winBanner: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(91, 138, 114, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(91, 138, 114, 0.35)',
    alignItems: 'center',
  },
  winTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  winSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
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
