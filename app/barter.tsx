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
const MAX_COUNT = 200;
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

function capInventory(inv: Record<GoodId, number>): Record<GoodId, number> {
  const next = { ...inv };
  (Object.keys(next) as GoodId[]).forEach((key) => {
    next[key] = Math.min(MAX_COUNT, next[key]);
  });
  return next;
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
  const dailyKey = `${STORAGE_PREFIX}:daily:${dateKey}`;

  const [inventory, setInventory] = useState<Record<GoodId, number>>(
    () => capInventory(cloneInventory(puzzle.inventory))
  );
  const [tradesUsed, setTradesUsed] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastTradeIndex, setLastTradeIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [lateWindowOpen, setLateWindowOpen] = useState(false);
  const [lateTransition, setLateTransition] = useState(false);
  const lateTransitionAnim = useRef(new Animated.Value(0)).current;

  const goalGood = getGoodById(puzzle.goal.good);
  const goalShort = `${puzzle.goal.qty} ${goalGood.emoji}`;
  const solvedAtPar = gameState === 'won' && tradesUsed <= puzzle.par;
  const isMarinerMarket = puzzle.marketName === "Mariner's Market";
  const vendorSectionTitle = puzzle.marketName.includes('Market')
    ? `${puzzle.marketEmoji} Vendors`
    : `${puzzle.marketEmoji} ${puzzle.marketName} Vendors`;
  const earlyWindowTrades = 4;
  const lateWindowTrigger = earlyWindowTrades;
  const tradingWindowLabel = lateWindowOpen
    ? 'Late Trading Hours'
    : `Early Trading Hours · ${earlyWindowTrades} trades max`;

  const tradeWaves = useMemo(() => {
    const trades = [...puzzle.trades];
    const firstSolution = puzzle.solution[0];
    const tradeKey = (trade: Trade) =>
      `${trade.give.good}:${trade.give.qty}->${trade.get.good}:${trade.get.qty}`;
    const firstKey = firstSolution ? tradeKey(firstSolution) : '';
    const minLate = Math.min(3, trades.length - 1);
    const targetWave1 = Math.max(3, Math.floor(trades.length * 0.55));

    const goalTrades = trades.filter((trade) => trade.get.good === puzzle.goal.good);
    const nonGoalTrades = trades.filter((trade) => trade.get.good !== puzzle.goal.good);
    const wave1Count = Math.min(
      nonGoalTrades.length,
      Math.max(1, Math.min(nonGoalTrades.length - minLate, targetWave1))
    );

    let wave1 = nonGoalTrades.slice(0, wave1Count);
    let wave2 = [...nonGoalTrades.slice(wave1Count), ...goalTrades];

    if (firstKey && !wave1.some((trade) => tradeKey(trade) === firstKey)) {
      const swapIndex = wave2.findIndex((trade) => tradeKey(trade) === firstKey);
      if (swapIndex >= 0 && wave1.length > 0) {
        const swapTrade = wave2[swapIndex];
        const wave1Last = wave1[wave1.length - 1];
        wave1 = [...wave1.slice(0, -1), swapTrade];
        wave2 = [...wave2.slice(0, swapIndex), wave1Last, ...wave2.slice(swapIndex + 1)];
      }
    }

    return { wave1, wave2 };
  }, [puzzle.trades, puzzle.solution, puzzle.goal.good]);

  const visibleTrades = lateWindowOpen ? tradeWaves.wave2 : tradeWaves.wave1;

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
    if (lateWindowOpen || lateTransition) return;
    if (tradesUsed < lateWindowTrigger) return;
    setLateTransition(true);
    lateTransitionAnim.setValue(0);
    Animated.sequence([
      Animated.timing(lateTransitionAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(700),
      Animated.timing(lateTransitionAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLateTransition(false);
      setLateWindowOpen(true);
    });
  }, [lateTransitionAnim, lateWindowOpen, lateTransition, tradesUsed, lateWindowTrigger]);

  useEffect(() => {
    if (gameState === 'playing') return;
    setShowResult(true);
  }, [gameState]);

  const handleTrade = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (lateTransition) return;
      if (tradesUsed >= puzzle.maxTrades) return;
      const trade = puzzle.trades[index];
      if (inventory[trade.give.good] < trade.give.qty) return;

      const nextInventory = cloneInventory(inventory);
      nextInventory[trade.give.good] -= trade.give.qty;
      nextInventory[trade.get.good] += trade.get.qty;
      const cappedInventory = capInventory(nextInventory);

      const nextTradesUsed = tradesUsed + 1;
      setInventory(cappedInventory);
      setTradesUsed(nextTradesUsed);
      setLastTradeIndex(index);

      if (cappedInventory[puzzle.goal.good] >= puzzle.goal.qty) {
        setGameState('won');
        return;
      }
      const canStillTrade = visibleTrades.some(
        (candidate) => cappedInventory[candidate.give.good] >= candidate.give.qty
      );
      if (!canStillTrade) {
        setGameState('lost');
        return;
      }
      if (nextTradesUsed >= puzzle.maxTrades) {
        setGameState('lost');
      }
    },
    [gameState, lateTransition, tradesUsed, puzzle, inventory, visibleTrades]
  );

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
        <ScrollView contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
          <View style={styles.page}>
            <View style={styles.header}>
              <Text style={[styles.title, isCompact && styles.titleCompact]}>Barter</Text>
              <Text style={[styles.dateLabel, isCompact && styles.dateLabelCompact]}>
                {dateLabel}
              </Text>
            </View>
          </View>

          <View style={styles.stickyHeader}>
            <View style={styles.stickyInner}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                <Text style={[styles.summaryText, isCompact && styles.summaryTextCompact]}>
                  Trades {tradesUsed}/{puzzle.maxTrades} · Par {puzzle.par} · Goal {goalShort} ·{' '}
                  {formatTime(elapsedSeconds)}
                </Text>
              </View>
              </View>

              <View style={[styles.inventoryRow, isCompact && styles.inventoryRowCompact]}>
                {puzzle.goods.map((good) => {
                  const count = inventory[good.id];
                  return (
                    <View
                      key={good.id}
                      style={[
                        styles.inventoryCard,
                        isCompact && styles.inventoryCardCompact,
                        count === 0 && styles.inventoryCardEmpty,
                      ]}
                    >
                      <Text style={[styles.inventoryEmoji, isCompact && styles.inventoryEmojiCompact]}>
                        {good.emoji}
                      </Text>
                      <Text style={[styles.inventoryCount, isCompact && styles.inventoryCountCompact]}>
                        {count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.page}>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>
                Welcome to {puzzle.marketName} {puzzle.marketEmoji}
              </Text>
              <Text style={styles.introBody}>
                Trade your goods to reach today&apos;s goal in as few trades as possible.
              </Text>
              <Text style={styles.introHint}>
                Tap a vendor to trade. Trades are final.
              </Text>
            </View>
            {lateTransition && (
              <Animated.View
                style={[
                  styles.transitionBanner,
                  {
                    opacity: lateTransitionAnim,
                    transform: [
                      {
                        translateY: lateTransitionAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-6, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.transitionTitle}>Vendors are shuffling out</Text>
                <Text style={styles.transitionBody}>Late trading hours begin soon.</Text>
              </Animated.View>
            )}
            <View style={styles.vendorSection}>
              <Text style={styles.vendorSectionTitle}>{vendorSectionTitle}</Text>
              <Text
                style={[
                  styles.vendorSectionCaption,
                  !lateWindowOpen && styles.vendorSectionCaptionEarly,
                ]}
              >
                {tradingWindowLabel}
              </Text>
            </View>
            <View style={[styles.tradeList, isCompact && styles.tradeListCompact]}>
              {visibleTrades.map((trade) => {
                const tradeIndex = puzzle.trades.indexOf(trade);
                const giveGood = getGoodById(trade.give.good);
                const getGood = getGoodById(trade.get.good);
                const canTrade =
                  gameState === 'playing' &&
                  !lateTransition &&
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
                    key={`${trade.give.good}-${trade.get.good}-${tradeIndex}`}
                    style={[
                      styles.tradeCard,
                      canTrade ? styles.tradeCardAvailable : styles.tradeCardUnavailable,
                      lastTradeIndex === tradeIndex && styles.tradeCardFlash,
                      isCompact && styles.tradeCardCompact,
                      isMarinerMarket && styles.tradeCardMariner,
                    ]}
                  >
                    <View style={[styles.tradeRow, isCompact && styles.tradeRowCompact]}>
                      <View
                        style={[styles.tradeInfo, isCompact && styles.tradeInfoCompact]}
                        pointerEvents="none"
                      >
                        <View style={[styles.tradeSide, isCompact && styles.tradeSideCompact]}>
                          <Text
                            style={[
                              styles.tradeQty,
                              isCompact && styles.tradeQtyCompact,
                              isMarinerMarket && styles.tradeQtyMariner,
                            ]}
                          >
                            {trade.give.qty}
                          </Text>
                          <Text
                            style={[
                              styles.tradeEmoji,
                              isCompact && styles.tradeEmojiCompact,
                              isMarinerMarket && styles.tradeEmojiMariner,
                            ]}
                          >
                            {giveGood.emoji}
                          </Text>
                        </View>
                        <Text style={styles.tradeArrow}>→</Text>
                        <View style={[styles.tradeSide, isCompact && styles.tradeSideCompact]}>
                          <Text
                            style={[
                              styles.tradeQty,
                              isCompact && styles.tradeQtyCompact,
                              isMarinerMarket && styles.tradeQtyMariner,
                            ]}
                          >
                            {trade.get.qty}
                          </Text>
                          <Text
                            style={[
                              styles.tradeEmoji,
                              isCompact && styles.tradeEmojiCompact,
                              isMarinerMarket && styles.tradeEmojiMariner,
                            ]}
                          >
                            {getGood.emoji}
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.tradeButton,
                          !canTrade && styles.tradeButtonDisabled,
                          pressed && canTrade ? styles.tradeButtonPressed : null,
                          isCompact && styles.tradeButtonCompact,
                          isMarinerMarket && styles.tradeButtonMariner,
                        ]}
                        onPress={() => handleTrade(tradeIndex)}
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
    backgroundColor: '#f6f3ef',
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  stickyHeader: {
    backgroundColor: '#f6f3ef',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e0d6',
    paddingHorizontal: 0,
    paddingBottom: Spacing.sm,
    zIndex: 10,
    width: '100%',
    alignItems: 'center',
  },
  stickyInner: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  introCard: {
    backgroundColor: '#fffdf8',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#e6e0d6',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f1b16',
  },
  introBody: {
    marginTop: 4,
    fontSize: 12,
    color: '#5f584f',
  },
  introHint: {
    marginTop: 2,
    fontSize: 11,
    color: '#8a8174',
  },
  transitionBanner: {
    backgroundColor: '#fffdf8',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e6e0d6',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  transitionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1f1b16',
  },
  transitionBody: {
    marginTop: 2,
    fontSize: 11,
    color: '#5f584f',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f1b16',
  },
  titleCompact: {
    fontSize: 20,
  },
  dateLabel: {
    fontSize: 12,
    color: '#8a8174',
    marginTop: 2,
  },
  dateLabelCompact: {
    fontSize: 11,
  },
  summaryRow: {
    alignItems: 'flex-start',
  },
  summaryCard: {
    backgroundColor: '#fffdf8',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e6e0d6',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  summaryText: {
    fontSize: 15,
    color: '#5f584f',
    fontWeight: '600',
    textAlign: 'left',
  },
  summaryTextCompact: {
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: '#1f1b16',
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: '#8a8174',
  },
  inventoryRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: Spacing.xs,
    justifyContent: 'space-between',
  },
  inventoryRowCompact: {
    gap: 4,
  },
  inventoryCard: {
    backgroundColor: '#fffdf8',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e6e0d6',
    paddingVertical: 5,
    paddingHorizontal: 4,
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  inventoryCardCompact: {
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  inventoryCardEmpty: {
    opacity: 0.35,
  },
  inventoryEmoji: {
    fontSize: 18,
  },
  inventoryEmojiCompact: {
    fontSize: 15,
  },
  inventoryCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1f1b16',
    marginTop: 2,
  },
  inventoryCountCompact: {
    fontSize: 12,
  },
  tradeList: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  tradeListCompact: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  vendorSection: {
    marginBottom: Spacing.xs,
  },
  vendorSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5f584f',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  vendorSectionCaption: {
    marginTop: 2,
    fontSize: 11,
    color: '#8a8174',
    textAlign: 'center',
  },
  vendorSectionCaptionEarly: {
    marginBottom: Spacing.sm,
  },
  tradeCard: {
    backgroundColor: '#fffdf8',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e6e0d6',
    padding: Spacing.sm,
    shadowOpacity: 0,
    elevation: 0,
  },
  tradeCardCompact: {
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  tradeCardMariner: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  tradeCardAvailable: {
    borderColor: '#e6e0d6',
  },
  tradeCardUnavailable: {
    borderColor: '#e6e0d6',
    opacity: 0.65,
  },
  tradeCardFlash: {
    backgroundColor: '#f0ede8',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 6,
  },
  tradeSideCompact: {
    gap: 4,
  },
  tradeQty: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1f1b16',
  },
  tradeQtyCompact: {
    fontSize: 13,
  },
  tradeQtyMariner: {
    fontSize: 16,
  },
  tradeEmoji: {
    fontSize: 16,
  },
  tradeEmojiCompact: {
    fontSize: 14,
  },
  tradeEmojiMariner: {
    fontSize: 18,
  },
  tradeLabel: {
    fontSize: 12,
    color: '#8a8174',
  },
  tradeArrow: {
    fontSize: 16,
    color: '#8a8174',
    fontWeight: '700',
  },
  tradeButton: {
    backgroundColor: '#1f1b16',
    borderRadius: BorderRadius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    minWidth: 84,
  },
  tradeButtonCompact: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 72,
  },
  tradeButtonMariner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 96,
  },
  tradeButtonPressed: {
    backgroundColor: '#3a342d',
    transform: [{ scale: 0.99 }],
  },
  tradeButtonDisabled: {
    backgroundColor: '#eee9e3',
  },
  tradeButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  tradeButtonTextDisabled: {
    color: '#9a9082',
  },
  tradesFooter: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  tradesFooterText: {
    fontSize: FontSize.md,
    color: '#8a8174',
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
    backgroundColor: '#1f1b16',
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  reviewButtonPressed: {
    backgroundColor: '#3a342d',
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
