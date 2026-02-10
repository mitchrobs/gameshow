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
import { BorderRadius, FontSize, Spacing } from '../src/constants/theme';
import {
  bridgesPuzzles,
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

const PALETTE = {
  background: '#0b1422',
  backgroundDeep: '#07101c',
  surface: '#0f1a2b',
  surfaceStrong: '#132338',
  glow: 'rgba(50, 140, 220, 0.25)',
  text: '#d4ecff',
  textMuted: '#6f8ba8',
  textSoft: '#9db6cc',
  accent: '#86d1ff',
  bridge: '#6b7f99',
  bridgeStrong: '#88a8c4',
  islandFill: '#0f2033',
  islandBorder: '#3fb6ff',
  islandText: '#cfeaff',
  islandSatisfied: '#5b8a72',
  islandSatisfiedText: '#ecf7f1',
  islandOver: '#d64045',
  islandOverText: '#ffe7ea',
  selection: '#e8a838',
  buttonDark: '#15263b',
  buttonDarkBorder: '#1e3954',
  buttonAccent: '#1da2e2',
  buttonAccentText: '#e5f8ff',
};

const THEMES = [
  { emoji: '🌴', label: 'Pacific Islands' },
  { emoji: '❄️', label: 'Arctic Drift' },
  { emoji: '🏜️', label: 'Desert Trails' },
  { emoji: '🌋', label: 'Volcanic Rim' },
  { emoji: '🏝️', label: 'Coral Keys' },
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

function getDailyIndex(date: Date = new Date()): number {
  return getDailySeed(date) % bridgesPuzzles.length;
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
  const [puzzleIndex, setPuzzleIndex] = useState(() => getDailyIndex());
  const puzzle: BridgesPuzzle = useMemo(
    () => bridgesPuzzles[puzzleIndex % bridgesPuzzles.length],
    [puzzleIndex]
  );
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
    hasCountedRef.current = false;
  }, [puzzleIndex]);

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
    setBridges({});
    setHistory([]);
    setAnchorIsland(null);
    setFocusedIsland(null);
    setElapsedSeconds(0);
    setGameState('playing');
    setHintsUsed(0);
    setStatusMessage(null);
  }, [puzzleIndex]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 2400);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

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
  }, [focusedIsland, neighborLookup, puzzle.islands, anchorIsland, bridges]);

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

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop();
      if (last) {
        setBridges(last.bridges);
        setAnchorIsland(last.anchor);
      }
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setBridges({});
    setHistory([]);
    setAnchorIsland(null);
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

  const handleNewGame = useCallback(() => {
    setPuzzleIndex((prev) => (prev + 1) % bridgesPuzzles.length);
  }, []);

  const { width } = useWindowDimensions();
  const boardSize = Math.min(360, width - Spacing.lg * 2);
  const boardPadding = 18;
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

  const theme = useMemo(() => {
    const seed = getDailySeed();
    return THEMES[seed % THEMES.length];
  }, []);

  const puzzleNumber = useMemo(() => {
    const seed = getDailySeed();
    return String(seed % 1000).padStart(3, '0');
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Bridges',
          headerStyle: { backgroundColor: PALETTE.background },
          headerTintColor: PALETTE.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <View style={styles.background}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>Bridges</Text>
              <Text style={styles.subtitle}>DAILY PUZZLE #{puzzleNumber}</Text>
              <View style={styles.todayRow}>
                <Text style={styles.todayLabel}>Today:</Text>
                <View style={styles.todayTag}>
                  <Text style={styles.todayEmoji}>{theme.emoji}</Text>
                  <Text style={styles.todayText}>{theme.label}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statText}>⏱ {formatTime(elapsedSeconds)}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statText}>★ {puzzle.difficulty}</Text>
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
                        style={[
                          styles.islandText,
                          isSatisfied && styles.islandTextSatisfied,
                          isOver && styles.islandTextOver,
                        ]}
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
                  <Text style={styles.actionButtonText}>↩ Undo</Text>
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
                <Pressable
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.actionButtonAccent,
                    pressed && styles.actionButtonAccentPressed,
                  ]}
                  onPress={handleNewGame}
                >
                  <Text style={styles.actionButtonAccentText}>New Game</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  background: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: PALETTE.glow,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -160,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(40, 100, 160, 0.25)',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: PALETTE.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: PALETTE.textMuted,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 8,
  },
  todayLabel: {
    fontSize: 15,
    color: PALETTE.textSoft,
  },
  todayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.surfaceStrong,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    gap: 6,
  },
  todayEmoji: {
    fontSize: 14,
  },
  todayText: {
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.accent,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  statPill: {
    backgroundColor: PALETTE.surfaceStrong,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.text,
  },
  boardWrap: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  board: {
    backgroundColor: PALETTE.surface,
    borderRadius: BorderRadius.xl,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bridgeLine: {
    position: 'absolute',
    backgroundColor: PALETTE.bridge,
  },
  island: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: PALETTE.islandFill,
    borderWidth: 2,
    borderColor: PALETTE.islandBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  islandPressed: {
    transform: [{ scale: 0.98 }],
  },
  islandSelected: {
    borderColor: PALETTE.selection,
    shadowColor: PALETTE.selection,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  islandFocused: {
    borderColor: PALETTE.accent,
    shadowColor: PALETTE.accent,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  islandSatisfied: {
    borderColor: PALETTE.islandSatisfied,
    backgroundColor: 'rgba(91, 138, 114, 0.18)',
  },
  islandOver: {
    borderColor: PALETTE.islandOver,
    backgroundColor: 'rgba(214, 64, 69, 0.2)',
  },
  islandText: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.islandText,
  },
  islandTextSatisfied: {
    color: PALETTE.islandSatisfiedText,
  },
  islandTextOver: {
    color: PALETTE.islandOverText,
  },
  statusText: {
    marginTop: Spacing.md,
    textAlign: 'center',
    color: PALETTE.textSoft,
    fontSize: 13,
  },
  winBanner: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(29, 162, 226, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(29, 162, 226, 0.35)',
    alignItems: 'center',
  },
  winTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.text,
  },
  winSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: PALETTE.textSoft,
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
    backgroundColor: PALETTE.buttonDark,
    borderWidth: 1,
    borderColor: PALETTE.buttonDarkBorder,
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
    color: PALETTE.text,
  },
  actionButtonAccent: {
    backgroundColor: PALETTE.buttonAccent,
    borderColor: PALETTE.buttonAccent,
  },
  actionButtonAccentPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  actionButtonAccentText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: PALETTE.buttonAccentText,
  },
});
