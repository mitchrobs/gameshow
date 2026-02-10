import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BorderRadius, Colors, FontSize, Spacing } from '../src/constants/theme';
import {
  BarterPuzzle,
  GoodId,
  Trade,
  getDailyBarter,
  getGoodById,
} from '../src/data/barterPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

type GameState = 'playing' | 'won' | 'lost';

const STORAGE_PREFIX = 'barter';
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

interface HistoryEntry {
  inventory: Record<GoodId, number>;
  tradesUsed: number;
}

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

function cloneInventory(inv: Record<GoodId, number>): Record<GoodId, number> {
  return { ...inv };
}

function formatTrade(trade: Trade): string {
  const giveGood = getGoodById(trade.give.good);
  const getGood = getGoodById(trade.get.good);
  return `${trade.give.qty} ${giveGood.emoji} → ${trade.get.qty} ${getGood.emoji}`;
}

export default function BarterScreen() {
  const router = useRouter();
  const puzzle = useMemo<BarterPuzzle>(() => getDailyBarter(), []);
  const { width } = useWindowDimensions();
  const isCompact = width < 400;
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );
  const marketNumber = useMemo(() => {
    const match = puzzle.id.match(/barter-(\d+)/);
    const seed = match ? parseInt(match[1], 10) : 0;
    return String(seed % 1000).padStart(3, '0');
  }, [puzzle.id]);
  const dailyKey = `${STORAGE_PREFIX}:daily:${dateKey}`;

  const [inventory, setInventory] = useState<Record<GoodId, number>>(
    () => cloneInventory(puzzle.inventory)
  );
  const [tradesUsed, setTradesUsed] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastTradeIndex, setLastTradeIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);

  const tradeBounce = useRef(new Animated.Value(1)).current;

  const goalGood = getGoodById(puzzle.goal.good);
  const solvedAtPar = gameState === 'won' && tradesUsed <= puzzle.par;

  const startSummary = useMemo(() => {
    const entries = puzzle.goods
      .filter((good) => puzzle.inventory[good.id] > 0)
      .map(
        (good) =>
          `${puzzle.inventory[good.id]} ${good.emoji} ${good.name}`
      );
    return entries.join(', ');
  }, [puzzle.goods, puzzle.inventory]);

  const shareText = useMemo(() => {
    const title = `🏺 Barter — ${dateLabel}`;
    const resultLine =
      gameState === 'won'
        ? solvedAtPar
          ? '⭐ Perfect Route!'
          : '✅ Market Closed'
        : gameState === 'lost'
        ? '❌ Out of Trades'
        : '✅ Market Closed';
    const tradeDenom = solvedAtPar ? puzzle.par : puzzle.maxTrades;
    const statLine = `🔄 ${tradesUsed}/${tradeDenom} trades · ⏱ ${formatTime(
      elapsedSeconds
    )}`;
    return [title, resultLine, statLine, 'daybreak.com'].join('\n');
  }, [dateLabel, gameState, solvedAtPar, puzzle.par, puzzle.maxTrades, tradesUsed, elapsedSeconds]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    setDailyCompleted(storage.getItem(dailyKey) === '1');
  }, [dailyKey]);

  useEffect(() => {
    if (gameState !== 'won' || dailyCompleted) return;
    const storage = getStorage();
    storage?.setItem(dailyKey, '1');
    setDailyCompleted(true);
  }, [gameState, dailyCompleted, dailyKey]);

  const hasCountedRef = useRef(false);
  useEffect(() => {
    if (gameState === 'playing' || hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount('barter');
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (lastTradeIndex === null) return;
    const timeout = setTimeout(() => setLastTradeIndex(null), 280);
    return () => clearTimeout(timeout);
  }, [lastTradeIndex]);

  useEffect(() => {
    if (gameState === 'playing') return;
    setShowResult(true);
  }, [gameState]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(tradeBounce, {
        toValue: 1.08,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(tradeBounce, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [tradesUsed, tradeBounce]);

  const handleTrade = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (tradesUsed >= puzzle.maxTrades) return;
      const trade = puzzle.trades[index];
      if (inventory[trade.give.good] < trade.give.qty) return;

      setHistory((prev) => [
        ...prev,
        { inventory: cloneInventory(inventory), tradesUsed },
      ]);

      const nextInventory = cloneInventory(inventory);
      nextInventory[trade.give.good] -= trade.give.qty;
      nextInventory[trade.get.good] += trade.get.qty;

      const nextTradesUsed = tradesUsed + 1;
      setInventory(nextInventory);
      setTradesUsed(nextTradesUsed);
      setLastTradeIndex(index);

      if (nextInventory[puzzle.goal.good] >= puzzle.goal.qty) {
        setGameState('won');
        return;
      }
      if (nextTradesUsed >= puzzle.maxTrades) {
        setGameState('lost');
      }
    },
    [gameState, tradesUsed, puzzle, inventory]
  );

  const handleUndo = useCallback(() => {
    if (gameState !== 'playing') return;
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setInventory(last.inventory);
    setTradesUsed(last.tradesUsed);
  }, [gameState, history]);

  const handleReset = useCallback(() => {
    setInventory(cloneInventory(puzzle.inventory));
    setTradesUsed(0);
    setHistory([]);
    setGameState('playing');
    setElapsedSeconds(0);
    setShowResult(false);
    setLastTradeIndex(null);
  }, [puzzle.inventory]);

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
      <Stack.Screen
        options={{
          title: 'Barter',
          headerBackTitle: 'Home',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        {!isCompact && <View style={styles.ambientGlow} pointerEvents="none" />}
        <ScrollView contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
          <View style={styles.page}>
            {!isCompact && (
              <View style={styles.pageAccent}>
                <View style={styles.pageAccentInner} />
              </View>
            )}
            <View style={styles.header}>
              <Text style={styles.title}>Barter</Text>
              <Text style={styles.marketLabel}>Daily Market #{marketNumber}</Text>
              <Text style={styles.dateLabel}>{dateLabel}</Text>
            </View>
          </View>

          <View style={styles.stickyHeader}>
            <View style={styles.stickyInner}>
              {isCompact ? (
                <>
                  <View style={styles.compactStatsRow}>
                    <Text style={styles.compactStatsText}>
                      Trades {tradesUsed}/{puzzle.maxTrades} · Par {puzzle.par}
                    </Text>
                    <Text style={styles.compactTimerText}>⏱ {formatTime(elapsedSeconds)}</Text>
                  </View>
                  <View style={styles.compactActionsRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.undoButtonCompact,
                        (history.length === 0 || gameState !== 'playing') &&
                          styles.undoButtonDisabled,
                        pressed && history.length > 0 && gameState === 'playing'
                          ? styles.undoButtonPressed
                          : null,
                      ]}
                      onPress={handleUndo}
                      disabled={history.length === 0 || gameState !== 'playing'}
                    >
                      <Text style={styles.undoButtonTextCompact}>Undo</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.resetButtonCompact,
                        pressed && styles.resetButtonPressed,
                      ]}
                      onPress={handleReset}
                    >
                      <Text style={styles.resetButtonTextCompact}>Reset</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <View style={styles.controlsRow}>
                  <Animated.View style={[styles.tradeCounter, { transform: [{ scale: tradeBounce }] }]}>
                    <Text style={styles.tradeCounterText}>
                      Trades {tradesUsed}/{puzzle.maxTrades}
                    </Text>
                    <Text style={styles.tradeCounterSub}>Par {puzzle.par}</Text>
                  </Animated.View>
                  <View style={styles.timerChip}>
                    <Text style={styles.timerText}>⏱ {formatTime(elapsedSeconds)}</Text>
                  </View>
                  <View style={styles.controlButtons}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.undoButton,
                        (history.length === 0 || gameState !== 'playing') &&
                          styles.undoButtonDisabled,
                        pressed && history.length > 0 && gameState === 'playing'
                          ? styles.undoButtonPressed
                          : null,
                      ]}
                      onPress={handleUndo}
                      disabled={history.length === 0 || gameState !== 'playing'}
                    >
                      <Text style={styles.undoButtonText}>Undo</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.resetButton,
                        pressed && styles.resetButtonPressed,
                      ]}
                      onPress={handleReset}
                    >
                      <Text style={styles.resetButtonText}>Reset</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {isCompact ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.inventoryScroll}
                >
                  {puzzle.goods.map((good) => {
                    const count = inventory[good.id];
                    return (
                      <View
                        key={good.id}
                        style={[
                          styles.inventoryPill,
                          count === 0 && styles.inventoryCardEmpty,
                        ]}
                      >
                        <Text style={styles.inventoryPillEmoji}>{good.emoji}</Text>
                        <Text style={styles.inventoryPillCount}>{count}</Text>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <View style={styles.inventoryRow}>
                  {puzzle.goods.map((good) => {
                    const count = inventory[good.id];
                    return (
                      <View
                        key={good.id}
                        style={[
                          styles.inventoryCard,
                          count === 0 && styles.inventoryCardEmpty,
                        ]}
                      >
                        <Text style={styles.inventoryEmoji}>{good.emoji}</Text>
                        <Text style={styles.inventoryCount}>{count}</Text>
                        <Text style={styles.inventoryLabel}>{good.name}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View style={styles.page}>
            <View style={[styles.goalCard, isCompact && styles.goalCardCompact]}>
              <View style={styles.goalAccent} />
              <View style={[styles.goalContent, isCompact && styles.goalContentCompact]}>
                <Text style={styles.goalTitle}>Goal</Text>
                <Text style={[styles.goalText, isCompact && styles.goalTextCompact]}>
                  Acquire {puzzle.goal.qty} {goalGood.emoji} {goalGood.name}
                </Text>
              </View>
            </View>

            <View style={[styles.tradeList, isCompact && styles.tradeListCompact]}>
              {puzzle.trades.map((trade, index) => {
                const giveGood = getGoodById(trade.give.good);
                const getGood = getGoodById(trade.get.good);
                const canTrade =
                  gameState === 'playing' &&
                  tradesUsed < puzzle.maxTrades &&
                  inventory[trade.give.good] >= trade.give.qty;
                let buttonLabel = 'Trade';
                if (gameState !== 'playing') {
                  buttonLabel = 'Closed';
                } else if (inventory[trade.give.good] < trade.give.qty) {
                  buttonLabel = `Need ${trade.give.qty} ${giveGood.emoji}`;
                }

                return (
                  <View
                    key={`${trade.give.good}-${trade.get.good}-${index}`}
                    style={[
                      styles.tradeCard,
                      canTrade ? styles.tradeCardAvailable : styles.tradeCardUnavailable,
                      lastTradeIndex === index && styles.tradeCardFlash,
                      isCompact && styles.tradeCardCompact,
                    ]}
                  >
                    <View style={[styles.tradeRow, isCompact && styles.tradeRowCompact]}>
                      <View
                        style={[styles.tradeInfo, isCompact && styles.tradeInfoCompact]}
                        pointerEvents="none"
                      >
                        <View style={styles.tradeSide}>
                          <Text style={[styles.tradeQty, isCompact && styles.tradeQtyCompact]}>
                            {trade.give.qty}
                          </Text>
                          <Text style={[styles.tradeEmoji, isCompact && styles.tradeEmojiCompact]}>
                            {giveGood.emoji}
                          </Text>
                          {!isCompact && <Text style={styles.tradeLabel}>{giveGood.name}</Text>}
                        </View>
                        <Text style={styles.tradeArrow}>→</Text>
                        <View style={styles.tradeSide}>
                          <Text style={[styles.tradeQty, isCompact && styles.tradeQtyCompact]}>
                            {trade.get.qty}
                          </Text>
                          <Text style={[styles.tradeEmoji, isCompact && styles.tradeEmojiCompact]}>
                            {getGood.emoji}
                          </Text>
                          {!isCompact && <Text style={styles.tradeLabel}>{getGood.name}</Text>}
                        </View>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.tradeButton,
                          !canTrade && styles.tradeButtonDisabled,
                          pressed && canTrade ? styles.tradeButtonPressed : null,
                          isCompact && styles.tradeButtonCompact,
                        ]}
                        onPress={() => handleTrade(index)}
                        disabled={!canTrade}
                      >
                        <Text
                          style={[
                            styles.tradeButtonText,
                            !canTrade && styles.tradeButtonTextDisabled,
                          ]}
                        >
                          {buttonLabel}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>

            {!isCompact && (
              <View style={styles.tradesFooter}>
                <Text style={styles.tradesFooterText}>
                  Trades used: {tradesUsed} / {puzzle.maxTrades}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {showResult && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.resultEmoji}>
                {gameState === 'won' ? (solvedAtPar ? '⭐' : '🎉') : '😔'}
              </Text>
              <Text style={styles.resultTitle}>
                {gameState === 'won'
                  ? solvedAtPar
                    ? 'Perfect Trade Route!'
                    : 'Market Closed!'
                  : 'Out of Trades'}
              </Text>
              <Text style={styles.resultSummary}>
                Start: {startSummary} → Goal: {puzzle.goal.qty} {goalGood.emoji}{' '}
                {goalGood.name}
              </Text>

              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Text style={styles.resultStatValue}>
                    {tradesUsed}/{puzzle.par}
                  </Text>
                  <Text style={styles.resultStatLabel}>Trades</Text>
                </View>
                <View style={styles.resultStat}>
                  <Text style={styles.resultStatValue}>{formatTime(elapsedSeconds)}</Text>
                  <Text style={styles.resultStatLabel}>Time</Text>
                </View>
              </View>

              {gameState === 'lost' && (
                <View style={styles.solutionBox}>
                  <Text style={styles.solutionTitle}>Optimal route</Text>
                  {puzzle.solution.map((trade, idx) => (
                    <Text key={idx} style={styles.solutionLine}>
                      {idx + 1}. {formatTrade(trade)}
                    </Text>
                  ))}
                </View>
              )}

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

              <View style={styles.resultActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.reviewButton,
                    pressed && styles.reviewButtonPressed,
                  ]}
                  onPress={() => setShowResult(false)}
                >
                  <Text style={styles.reviewButtonText}>Review Trades</Text>
                </Pressable>
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
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041a12',
  },
  ambientGlow: {
    position: 'absolute',
    top: -120,
    left: '50%',
    width: 520,
    height: 520,
    marginLeft: -260,
    borderRadius: 260,
    backgroundColor: '#0b3a29',
    opacity: 0.6,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  stickyHeader: {
    backgroundColor: '#041a12',
    borderBottomWidth: 1,
    borderBottomColor: '#0f2b21',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    zIndex: 10,
    width: '100%',
  },
  stickyInner: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  pageAccent: {
    height: 6,
    width: 120,
    backgroundColor: '#0d7c5f',
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    alignSelf: 'center',
  },
  pageAccentInner: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
    backgroundColor: '#10b981',
  },
  header: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: '#b8f5dc',
  },
  marketLabel: {
    fontSize: 12,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    color: '#2f7b5e',
    marginTop: Spacing.xs,
    fontWeight: '700',
  },
  dateLabel: {
    fontSize: 12,
    color: '#2f7b5e',
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  compactStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  compactStatsText: {
    fontSize: 12,
    color: '#8ad6b6',
    fontWeight: '600',
  },
  compactTimerText: {
    fontSize: 12,
    color: '#8ad6b6',
    fontWeight: '600',
  },
  compactActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tradeCounter: {
    backgroundColor: '#0f2b21',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    minWidth: 98,
    alignItems: 'flex-start',
  },
  tradeCounterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b8f5dc',
  },
  tradeCounterSub: {
    marginTop: 2,
    fontSize: 10,
    color: '#4c9b7a',
  },
  timerChip: {
    backgroundColor: '#0f2b21',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: '#1e4d3a',
  },
  timerText: {
    color: '#8ad6b6',
    fontSize: 12,
    fontWeight: '600',
  },
  undoButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#1e6f52',
    backgroundColor: 'transparent',
  },
  undoButtonPressed: {
    backgroundColor: '#133a2c',
  },
  undoButtonDisabled: {
    borderColor: '#1e4d3a',
    opacity: 0.5,
  },
  undoButtonText: {
    color: '#8ad6b6',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    backgroundColor: '#0f2b21',
  },
  resetButtonPressed: {
    backgroundColor: '#133a2c',
  },
  resetButtonText: {
    color: '#8ad6b6',
    fontSize: 12,
    fontWeight: '600',
  },
  undoButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#1e6f52',
    backgroundColor: 'transparent',
  },
  undoButtonTextCompact: {
    color: '#8ad6b6',
    fontSize: 12,
    fontWeight: '600',
  },
  resetButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    backgroundColor: '#0f2b21',
  },
  resetButtonTextCompact: {
    color: '#8ad6b6',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#b8f5dc',
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: '#4c9b7a',
  },
  inventoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  inventoryScroll: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  inventoryCard: {
    backgroundColor: '#0f2b21',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 90,
    alignItems: 'center',
  },
  inventoryCardEmpty: {
    opacity: 0.35,
  },
  inventoryEmoji: {
    fontSize: 22,
  },
  inventoryCount: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: '#b8f5dc',
    marginTop: 4,
  },
  inventoryLabel: {
    fontSize: 12,
    color: '#4c9b7a',
    marginTop: 2,
  },
  inventoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    backgroundColor: '#0f2b21',
  },
  inventoryPillEmoji: {
    fontSize: 16,
  },
  inventoryPillCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b8f5dc',
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#0f2b21',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  goalAccent: {
    width: 6,
    backgroundColor: '#1d8f63',
  },
  goalContent: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flex: 1,
    alignItems: 'center',
  },
  goalCardCompact: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  goalContentCompact: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  goalTitle: {
    fontSize: FontSize.sm,
    color: '#4c9b7a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  goalText: {
    fontSize: FontSize.md,
    color: '#b8f5dc',
    marginTop: Spacing.xs,
    fontWeight: '700',
  },
  goalTextCompact: {
    fontSize: FontSize.sm,
  },
  tradeList: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  tradeListCompact: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tradeCard: {
    backgroundColor: '#0f2b21',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#1e4d3a',
    padding: Spacing.md,
    shadowOpacity: 0,
    elevation: 0,
  },
  tradeCardCompact: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  tradeCardAvailable: {
    borderColor: '#1d8f63',
  },
  tradeCardUnavailable: {
    borderColor: '#1e4d3a',
    opacity: 0.65,
  },
  tradeCardFlash: {
    backgroundColor: '#144032',
  },
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  tradeRowCompact: {
    gap: Spacing.xs,
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  tradeInfoCompact: {
    gap: Spacing.xs,
  },
  tradeSide: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  tradeQty: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: '#b8f5dc',
  },
  tradeQtyCompact: {
    fontSize: 16,
  },
  tradeEmoji: {
    fontSize: 22,
  },
  tradeEmojiCompact: {
    fontSize: 18,
  },
  tradeLabel: {
    fontSize: 12,
    color: '#4c9b7a',
  },
  tradeArrow: {
    fontSize: FontSize.lg,
    color: '#2f7b5e',
    fontWeight: '700',
  },
  tradeButton: {
    backgroundColor: '#1d8f63',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    minWidth: 110,
  },
  tradeButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 82,
  },
  tradeButtonPressed: {
    backgroundColor: '#29b97d',
    transform: [{ scale: 0.99 }],
  },
  tradeButtonDisabled: {
    backgroundColor: '#0b261c',
  },
  tradeButtonText: {
    color: '#b8f5dc',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  tradeButtonTextDisabled: {
    color: '#2f7b5e',
  },
  tradesFooter: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  tradesFooterText: {
    fontSize: FontSize.md,
    color: '#2f7b5e',
    fontWeight: '700',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 24, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    ...WEB_NO_SELECT,
  },
  resultEmoji: {
    fontSize: 40,
    textAlign: 'center',
  },
  resultTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  resultSummary: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  resultStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },
  resultStat: {
    alignItems: 'center',
  },
  resultStatValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  resultStatLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  solutionBox: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  solutionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  solutionLine: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  shareCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  shareTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  shareBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
  },
  shareText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shareButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  shareButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  shareStatus: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  resultActions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  reviewButton: {
    backgroundColor: '#0d7c5f',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  reviewButtonPressed: {
    backgroundColor: '#10b981',
  },
  reviewButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeButtonPressed: {
    backgroundColor: Colors.surfaceLight,
  },
  homeButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
});
