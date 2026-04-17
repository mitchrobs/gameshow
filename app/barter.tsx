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
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import {
  analyzeBarterPuzzle,
  applyTrade,
  BarterPuzzle,
  canAfford as canAffordTrade,
  getBarterTutorialPuzzle,
  GoodId,
  missingForTrade,
  previewTrade,
  RouteSummary,
  Trade,
  tradeKey,
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
  const giveParts = trade.give
    .map((side) => {
      const good = getGoodById(side.good);
      return `${side.qty} ${good.emoji}`;
    })
    .join(' + ');
  const receiveParts = trade.receive
    .map((side) => {
      const good = getGoodById(side.good);
      return `${side.qty} ${good.emoji}`;
    })
    .join(' + ');
  return `${giveParts} → ${receiveParts}`;
}

function formatTradeSides(sides: Array<{ good: GoodId; qty: number }>): string {
  return sides
    .map((side) => {
      const good = getGoodById(side.good);
      const prefix = side.qty > 0 ? '+' : '';
      return `${prefix}${side.qty} ${good.emoji}`;
    })
    .join('  ');
}

function getRoleLabel(trade: Trade): string | null {
  switch (trade.role) {
    case 'engine_setup':
      return 'Setup';
    case 'compound_gate':
      return 'Bundle';
    case 'engine_payoff':
      return 'Payoff';
    case 'tempo_bailout':
      return 'Bailout';
    case 'tempo':
      return 'Tempo';
    default:
      return null;
  }
}

function getResultTier(gameState: GameState, tradesUsed: number, puzzle: BarterPuzzle): string {
  if (gameState === 'lost') return 'Bust';
  if (gameState !== 'won') return 'Planning';
  if (tradesUsed <= puzzle.par) return 'Perfect';
  if (tradesUsed <= puzzle.par + 1) return 'Par';
  return 'Solved';
}

export default function BarterScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('barter', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const router = useRouter();
  const puzzle = useMemo<BarterPuzzle>(() => getDailyBarter(), []);
  const qualityReport = useMemo(() => analyzeBarterPuzzle(puzzle), [puzzle]);
  const tutorialPuzzle = useMemo(() => getBarterTutorialPuzzle(), []);
  const tradeLookup = useMemo(() => {
    return new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));
  }, [puzzle.trades]);
  const { width } = useWindowDimensions();
  const isCompact = width < 400;
  const canGoBack = router.canGoBack();
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
  const dailyKey = useMemo(() => `${STORAGE_PREFIX}:daily:${dateKey}`, [dateKey]);
  const tutorialKey = `${STORAGE_PREFIX}:tutorial:v1`;

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
  const [previewTradeIndex, setPreviewTradeIndex] = useState<number | null>(null);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [newlyAffordableKeys, setNewlyAffordableKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [showTutorial, setShowTutorial] = useState(() => {
    const storage = getStorage();
    return storage?.getItem(tutorialKey) !== '1';
  });
  const lateTransitionAnim = useRef(new Animated.Value(0)).current;

  const marketName = puzzle.marketName?.trim() || 'Daily Market';
  const marketEmoji = puzzle.marketEmoji || '🏺';
  const goalGood = getGoodById(puzzle.goal.good);
  const goalShort = `${puzzle.goal.qty} ${goalGood.emoji}`;
  const resultTier = getResultTier(gameState, tradesUsed, puzzle);
  const isMarinerMarket = marketName === "Mariner's Market";
  const earlyWindowTrades = puzzle.earlyWindowTrades ?? 4;
  const lateWindowTrigger = earlyWindowTrades;
  const earlyWindowRemaining = Math.max(0, earlyWindowTrades - tradesUsed);
  const tradingWindowTitle = lateWindowOpen ? 'Late Window' : 'Early Window';
  const tradingWindowCounter = lateWindowOpen
    ? 'Vendors refreshed'
    : `${earlyWindowRemaining} trades left`;
  const marketAlertTone = useMemo(() => {
    const dark = theme.mode === 'dark';
    switch (marketEmoji) {
      case '🌶️':
        return dark
          ? { bg: 'rgba(255, 138, 92, 0.18)', border: 'rgba(255, 138, 92, 0.36)', text: '#ffd4bf' }
          : { bg: '#fff0e8', border: '#f1b48c', text: '#8b3a12' };
      case '🏺':
        return dark
          ? { bg: 'rgba(232, 168, 56, 0.18)', border: 'rgba(232, 168, 56, 0.36)', text: '#ffe0a8' }
          : { bg: '#fff4e5', border: '#e9c79a', text: '#7a4a1a' };
      case '⚓️':
        return dark
          ? { bg: 'rgba(116, 173, 255, 0.18)', border: 'rgba(116, 173, 255, 0.36)', text: '#c9e2ff' }
          : { bg: '#e9f3ff', border: '#9dbde6', text: '#2d4f7a' };
      case '🧵':
        return dark
          ? { bg: 'rgba(170, 141, 255, 0.2)', border: 'rgba(170, 141, 255, 0.36)', text: '#dfd0ff' }
          : { bg: '#f1edff', border: '#c4b6f3', text: '#4a3b84' };
      case '🫖':
        return dark
          ? { bg: 'rgba(215, 194, 167, 0.2)', border: 'rgba(215, 194, 167, 0.36)', text: '#efdbc5' }
          : { bg: '#f7f0e8', border: '#d7c2a7', text: '#6a4c2a' };
      default:
        return dark
          ? { bg: screenAccent.soft, border: screenAccent.badgeBorder, text: Colors.text }
          : { bg: '#fff4e5', border: '#f1c38a', text: '#8a4a0b' };
    }
  }, [marketEmoji, theme.mode, screenAccent, Colors.text]);

  const tradeWaves = useMemo(() => {
    const wave1 = puzzle.trades.filter((trade) => trade.window !== 'late');
    const wave2 = puzzle.trades.filter((trade) => trade.window === 'late');

    return { wave1, wave2 };
  }, [puzzle.trades]);

  const visibleTrades = lateWindowOpen ? tradeWaves.wave2 : tradeWaves.wave1;
  const previewTradeCandidate =
    previewTradeIndex === null ? null : puzzle.trades[previewTradeIndex] ?? null;
  const activePreview = useMemo(() => {
    if (!previewTradeCandidate) return null;
    return previewTrade(puzzle, inventory, previewTradeCandidate, tradesUsed);
  }, [inventory, previewTradeCandidate, puzzle, tradesUsed]);
  const formatRouteSummary = useCallback(
    (route: RouteSummary | null): string => {
      if (!route) return 'No route available';
      return route.tradeKeys
        .map((key) => {
          const trade = tradeLookup.get(key);
          return trade ? formatTrade(trade) : key;
        })
        .join('  /  ');
    },
    [tradeLookup]
  );

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
        ? resultTier === 'Perfect'
          ? '⭐ Perfect Route!'
          : `✅ ${resultTier}`
        : gameState === 'lost'
        ? '❌ Out of Trades'
        : '✅ Market Closed';
    const tradeDenom = gameState === 'won' ? puzzle.par : puzzle.maxTrades;
    const statLine = `🔄 ${tradesUsed}/${tradeDenom} trades · ⏱ ${formatTime(
      elapsedSeconds
    )}`;
    return [title, resultLine, statLine, 'daybreak.com'].join('\n');
  }, [dateLabel, elapsedSeconds, gameState, puzzle.maxTrades, puzzle.par, resultTier, tradesUsed]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage || !dailyKey) return;
    setDailyCompleted(storage.getItem(dailyKey) === '1');
  }, [dailyKey]);

  useEffect(() => {
    if (gameState !== 'won' || dailyCompleted || !dailyKey) return;
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
    Animated.timing(lateTransitionAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setLateWindowOpen(true);
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(lateTransitionAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setLateTransition(false);
      });
    });
  }, [lateTransitionAnim, lateWindowOpen, lateTransition, tradesUsed, lateWindowTrigger]);

  useEffect(() => {
    if (gameState === 'playing') return;
    setShowResult(true);
  }, [gameState]);

  const handleDismissTutorial = useCallback(() => {
    const storage = getStorage();
    storage?.setItem(tutorialKey, '1');
    setShowTutorial(false);
  }, [tutorialKey]);

  const handleTrade = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (lateTransition) return;
      if (tradesUsed >= puzzle.maxTrades) return;
      const trade = puzzle.trades[index];
      if (!trade) return;
      if (!canAffordTrade(inventory, trade)) return;

      const preview = previewTrade(puzzle, inventory, trade, tradesUsed);
      const nextInventory = applyTrade(inventory, trade);
      const cappedInventory = capInventory(nextInventory);

      const nextTradesUsed = tradesUsed + 1;
      setInventory(cappedInventory);
      setTradesUsed(nextTradesUsed);
      setLastTradeIndex(index);
      setPreviewTradeIndex(null);
      setTradeHistory((prev) => [...prev, trade]);
      setNewlyAffordableKeys(new Set(preview.newlyAffordableTradeKeys));

      if (cappedInventory[puzzle.goal.good] >= puzzle.goal.qty) {
        setGameState('won');
        return;
      }
      const nextWindowIsEarly = nextTradesUsed < puzzle.earlyWindowTrades;
      const candidateTrades = puzzle.trades.filter((candidate) =>
        nextWindowIsEarly
          ? (candidate.window ?? 'early') !== 'late'
          : candidate.window === 'late'
      );
      const canStillTrade = candidateTrades.some((candidate) => {
        return canAffordTrade(cappedInventory, candidate);
      });
      if (!canStillTrade) {
        setGameState('lost');
        return;
      }
      if (nextTradesUsed >= puzzle.maxTrades) {
        setGameState('lost');
      }
    },
    [gameState, lateTransition, tradesUsed, puzzle, inventory]
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

  const renderTradeCard = (trade: Trade, locked = false) => {
    const tradeIndex = puzzle.trades.indexOf(trade);
    const giveGoods = trade.give.map((side) => ({
      side,
      good: getGoodById(side.good),
    }));
    const receiveGoods = trade.receive.map((side) => ({
      side,
      good: getGoodById(side.good),
    }));
    const missing = missingForTrade(inventory, trade);
    const canTrade =
      !locked &&
      gameState === 'playing' &&
      !lateTransition &&
      tradesUsed < puzzle.maxTrades &&
      missing.length === 0;
    const label = getRoleLabel(trade);
    const key = tradeKey(trade);
    const isNewlyAffordable = newlyAffordableKeys.has(key);
    let buttonLabel = locked ? 'Late' : 'Trade';
    if (gameState !== 'playing') {
      buttonLabel = 'Closed';
    } else if (!locked && missing.length > 0) {
      buttonLabel = `Need ${missing
        .map((side) => `${side.qty} ${getGoodById(side.good).emoji}`)
        .join(' + ')}`;
    }

    return (
      <Pressable
        key={`trade-${locked ? 'locked' : 'active'}-${tradeIndex}`}
        style={({ pressed }) => [
          styles.tradeCard,
          canTrade ? styles.tradeCardAvailable : styles.tradeCardUnavailable,
          isNewlyAffordable && styles.tradeCardNewlyAffordable,
          previewTradeIndex === tradeIndex && styles.tradeCardPreviewed,
          lastTradeIndex === tradeIndex && styles.tradeCardFlash,
          locked && styles.tradeCardLocked,
          pressed && !locked ? styles.tradeCardPressed : null,
          isCompact && styles.tradeCardCompact,
          isMarinerMarket && styles.tradeCardMariner,
        ]}
        onPress={() => setPreviewTradeIndex(tradeIndex)}
        onHoverIn={() => setPreviewTradeIndex(tradeIndex)}
      >
        <View style={styles.tradeMetaRow}>
          {label && <Text style={styles.tradeRole}>{label}</Text>}
          {locked && <Text style={styles.tradeLockedText}>Opens late</Text>}
          {isNewlyAffordable && <Text style={styles.tradeNewText}>Newly open</Text>}
        </View>
        <View style={[styles.tradeRow, isCompact && styles.tradeRowCompact]}>
          <View
            style={[styles.tradeInfo, isCompact && styles.tradeInfoCompact]}
            pointerEvents="none"
          >
            <View style={[styles.tradeSide, isCompact && styles.tradeSideCompact]}>
              {giveGoods.map(({ side, good }, index) => (
                <View
                  key={`${side.good}-${index}`}
                  style={[
                    styles.tradeGiveItem,
                    isCompact && styles.tradeGiveItemCompact,
                  ]}
                >
                  <Text
                    style={[
                      styles.tradeQty,
                      isCompact && styles.tradeQtyCompact,
                      isMarinerMarket && styles.tradeQtyMariner,
                    ]}
                  >
                    {side.qty}
                  </Text>
                  <Text
                    style={[
                      styles.tradeEmoji,
                      isCompact && styles.tradeEmojiCompact,
                      isMarinerMarket && styles.tradeEmojiMariner,
                    ]}
                  >
                    {good.emoji}
                  </Text>
                  {index < giveGoods.length - 1 && (
                    <Text style={styles.tradePlus}>+</Text>
                  )}
                </View>
              ))}
            </View>
            <Text style={styles.tradeArrow}>→</Text>
            <View style={[styles.tradeSide, isCompact && styles.tradeSideCompact]}>
              {receiveGoods.map(({ side, good }, index) => (
                <View
                  key={`${side.good}-${index}`}
                  style={[
                    styles.tradeGiveItem,
                    isCompact && styles.tradeGiveItemCompact,
                  ]}
                >
                  <Text
                    style={[
                      styles.tradeQty,
                      isCompact && styles.tradeQtyCompact,
                      isMarinerMarket && styles.tradeQtyMariner,
                    ]}
                  >
                    {side.qty}
                  </Text>
                  <Text
                    style={[
                      styles.tradeEmoji,
                      isCompact && styles.tradeEmojiCompact,
                      isMarinerMarket && styles.tradeEmojiMariner,
                    ]}
                  >
                    {good.emoji}
                  </Text>
                  {index < receiveGoods.length - 1 && (
                    <Text style={styles.tradePlus}>+</Text>
                  )}
                </View>
              ))}
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
        {missing.length > 0 && !locked && (
          <Text style={styles.tradeMissingText}>
            Missing {missing.map((side) => `${side.qty} ${getGoodById(side.good).emoji}`).join(', ')}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen
          options={{
            title: 'Barter',
            headerBackTitle: 'Home',
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerShadowVisible: false,
            headerTitleStyle: { fontWeight: '700' },
            ...(canGoBack
              ? {}
              : {
                  headerLeft: () => (
                    <Pressable
                      style={({ pressed }) => [
                        styles.headerFallbackButton,
                        pressed && styles.headerFallbackButtonPressed,
                      ]}
                      onPress={() => router.replace('/')}
                    >
                      <Text style={styles.headerFallbackButtonText}>← Home</Text>
                    </Pressable>
                  ),
                }),
          }}
        />
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
                <View style={[styles.summaryRow, isCompact && styles.summaryRowCompact]}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Trades</Text>
                    <Text style={[styles.summaryValue, isCompact && styles.summaryValueCompact]}>
                      {tradesUsed}/{puzzle.maxTrades}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Goal</Text>
                    <Text style={[styles.summaryValue, isCompact && styles.summaryValueCompact]}>
                      {goalShort}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Time</Text>
                    <Text style={[styles.summaryValue, isCompact && styles.summaryValueCompact]}>
                      {formatTime(elapsedSeconds)}
                    </Text>
                  </View>
                  <View style={[styles.summaryItem, styles.summaryStatusItem]}>
                    <View
                      style={[
                        styles.summaryStatusPill,
                        lateWindowOpen ? styles.summaryStatusLate : styles.summaryStatusEarly,
                      ]}
                    >
                      <Text style={styles.summaryStatusTitle}>{tradingWindowTitle}</Text>
                      <Text style={styles.summaryStatusCounter}>{tradingWindowCounter}</Text>
                    </View>
                  </View>
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
                Welcome to {marketName} {marketEmoji}
              </Text>
              <Text style={styles.introBody}>
                Objective: turn your starting goods into {goalShort} within {puzzle.maxTrades} trades.
                Use the first {earlyWindowTrades} trades to prepare, then close in during the late window.
              </Text>
            </View>
            {showTutorial && (
              <View style={styles.tutorialCard}>
                <Text style={styles.tutorialTitle}>First pattern: setup, bundle, cash out</Text>
                <Text style={styles.tutorialBody}>
                  Early trades create ingredients. Late contracts reward balanced goods, especially bundles.
                </Text>
                <View style={styles.tutorialSteps}>
                  {tutorialPuzzle.solution.map((trade, index) => (
                    <Text key={`tutorial-${index}`} style={styles.tutorialStepText}>
                      {index + 1}. {formatTrade(trade)}
                    </Text>
                  ))}
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.tutorialButton,
                    pressed && styles.tutorialButtonPressed,
                  ]}
                  onPress={handleDismissTutorial}
                >
                  <Text style={styles.tutorialButtonText}>Start daily market</Text>
                </Pressable>
              </View>
            )}
            {lateTransition && (
              <Animated.View
                style={[
                  styles.transitionBanner,
                  {
                    opacity: lateTransitionAnim,
                    backgroundColor: marketAlertTone.bg,
                    borderColor: marketAlertTone.border,
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
                <Text style={[styles.transitionTitle, { color: marketAlertTone.text }]}>
                  Vendors are shuffling
                </Text>
                <Text style={[styles.transitionBody, { color: marketAlertTone.text }]}>
                  The late window opens shortly.
                </Text>
              </Animated.View>
            )}
            {activePreview && previewTradeCandidate && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Trade preview</Text>
                <Text style={styles.previewTradeText}>{formatTrade(previewTradeCandidate)}</Text>
                {activePreview.canTrade ? (
                  <>
                    <Text style={styles.previewDelta}>
                      Inventory: {formatTradeSides(activePreview.delta)}
                    </Text>
                    <Text style={styles.previewDelta}>
                      Opens:{' '}
                      {activePreview.newlyAffordableTradeKeys.length > 0
                        ? activePreview.newlyAffordableTradeKeys
                            .map((key) => {
                              const trade = tradeLookup.get(key);
                              return trade ? formatTrade(trade) : key;
                            })
                            .join('  /  ')
                        : 'No new contracts yet'}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.previewDelta}>
                    Missing {activePreview.missing.map((side) => `${side.qty} ${getGoodById(side.good).emoji}`).join(', ')}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {lateWindowOpen ? 'Late Contracts' : 'Early Market'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {lateWindowOpen
                  ? 'Spend the ingredients you prepared.'
                  : 'Make the first three trades count.'}
              </Text>
            </View>
            <Animated.View
              style={[
                styles.tradeList,
                isCompact && styles.tradeListCompact,
                {
                  opacity: lateTransitionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              {visibleTrades.map((trade) => renderTradeCard(trade))}
            </Animated.View>
            {!lateWindowOpen && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Late Contracts</Text>
                  <Text style={styles.sectionSubtitle}>
                    Plan around these now. They unlock after trade {earlyWindowTrades}.
                  </Text>
                </View>
                <View style={[styles.tradeList, isCompact && styles.tradeListCompact]}>
                  {tradeWaves.wave2.map((trade) => renderTradeCard(trade, true))}
                </View>
              </>
            )}

          </View>
        </ScrollView>

        {showResult && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.resultEmoji}>
                {gameState === 'won' ? (resultTier === 'Perfect' ? '⭐' : '🎉') : '😔'}
              </Text>
              <Text style={styles.resultTitle}>
                {resultTier === 'Bust' ? 'Out of Trades' : `${resultTier} Route`}
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

              <View style={styles.autopsyCard}>
                <Text style={styles.autopsyTitle}>Route notes</Text>
                <Text style={styles.autopsyInsight}>{qualityReport.strategicInsight}</Text>
                <Text style={styles.autopsyLabel}>Your route</Text>
                <Text style={styles.autopsyRoute}>
                  {tradeHistory.length > 0
                    ? tradeHistory.map(formatTrade).join('  /  ')
                    : 'No trades made'}
                </Text>
                <Text style={styles.autopsyLabel}>Par route</Text>
                <Text style={styles.autopsyRoute}>
                  {formatRouteSummary(qualityReport.bestRoute)}
                </Text>
                <Text style={styles.autopsyLabel}>Alternate route</Text>
                <Text style={styles.autopsyRoute}>
                  {formatRouteSummary(qualityReport.alternateRoute)}
                </Text>
              </View>

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
                    styles.homeButton,
                    pressed && styles.homeButtonPressed,
                  ]}
                  onPress={() => router.replace('/')}
                >
                  <Text style={styles.homeButtonText}>Back to games</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
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
  const paper = theme.mode === 'dark' ? Colors.surfaceElevated : '#fffdf8';
  const paperMuted = theme.mode === 'dark' ? Colors.surfaceLight : '#f0ede8';
  const canvas = theme.mode === 'dark' ? Colors.backgroundSoft : '#f6f3ef';
  const borderSoft = theme.mode === 'dark' ? Colors.border : '#e6e0d6';
  const inkStrong = theme.mode === 'dark' ? Colors.text : '#1f1b16';
  const inkMuted = theme.mode === 'dark' ? Colors.textSecondary : '#5f584f';
  const inkSoft = theme.mode === 'dark' ? Colors.textMuted : '#8a8174';
  const windowPillStrong = theme.mode === 'dark' ? '#1a2c46' : inkStrong;
  const windowPillMuted = theme.mode === 'dark' ? '#39587f' : inkMuted;
  const darkButtonBg = theme.mode === 'dark' ? Colors.primary : '#1f1b16';
  const darkButtonPressed = theme.mode === 'dark' ? Colors.primaryLight : '#3a342d';
  const disabledBg = theme.mode === 'dark' ? Colors.surfaceLight : '#eee9e3';
  const disabledText = theme.mode === 'dark' ? Colors.textMuted : '#9a9082';

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: canvas,
  },
  scrollContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  stickyHeader: {
    backgroundColor: canvas,
    borderBottomWidth: 1,
    borderBottomColor: borderSoft,
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
    ...ui.page,
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  headerFallbackButton: {
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  headerFallbackButtonPressed: {
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : '#f3efe8',
  },
  headerFallbackButtonText: {
    color: inkStrong,
    fontSize: 13,
    fontWeight: '600',
  },
  introCard: {
    backgroundColor: paper,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: borderSoft,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: inkStrong,
  },
  introBody: {
    marginTop: 4,
    fontSize: 12,
    color: inkMuted,
    lineHeight: 17,
  },
  tutorialCard: {
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceElevated : '#eef8f3',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? screenAccent.badgeBorder : '#9bcbb4',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: inkStrong,
  },
  tutorialBody: {
    marginTop: 4,
    fontSize: 12,
    color: inkMuted,
    lineHeight: 17,
  },
  tutorialSteps: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  tutorialStepText: {
    fontSize: 12,
    color: inkStrong,
    lineHeight: 18,
  },
  tutorialButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: darkButtonBg,
    borderRadius: BorderRadius.sm,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  tutorialButtonPressed: {
    backgroundColor: darkButtonPressed,
  },
  tutorialButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  transitionBanner: {
    backgroundColor: '#fff4e5',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#f1c38a',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  transitionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8a4a0b',
  },
  transitionBody: {
    marginTop: 2,
    fontSize: 11,
    color: '#8a4a0b',
  },
  previewCard: {
    backgroundColor: paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: screenAccent.badgeBorder,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: inkStrong,
  },
  previewTradeText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: inkStrong,
  },
  previewDelta: {
    marginTop: 4,
    fontSize: 11,
    color: inkMuted,
    lineHeight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: inkStrong,
  },
  titleCompact: {
    fontSize: 20,
  },
  dateLabel: {
    fontSize: 12,
    color: inkSoft,
    marginTop: 2,
  },
  dateLabelCompact: {
    fontSize: 11,
  },
  summaryCard: {
    backgroundColor: paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  summaryRowCompact: {
    flexWrap: 'wrap',
    rowGap: Spacing.xs,
  },
  summaryItem: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  summaryLabel: {
    fontSize: 10,
    color: inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '700',
    color: inkStrong,
  },
  summaryValueCompact: {
    fontSize: 13,
  },
  summaryStatusItem: {
    flex: 1.3,
    alignItems: 'flex-start',
  },
  summaryStatusPill: {
    marginTop: 2,
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    minWidth: 112,
    shadowColor: '#000',
    shadowOpacity: theme.mode === 'dark' ? 0.12 : 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  summaryStatusTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: windowPillStrong,
    letterSpacing: 0.2,
  },
  summaryStatusCounter: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: windowPillMuted,
    letterSpacing: 0.15,
  },
  summaryStatusEarly: {
    backgroundColor: '#e8f3ff',
    borderColor: '#9fc1ea',
  },
  summaryStatusLate: {
    backgroundColor: '#f3ebff',
    borderColor: '#c2a9ec',
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: inkStrong,
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: FontSize.sm,
    color: inkSoft,
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
    backgroundColor: paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: borderSoft,
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
    color: inkStrong,
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
  tradeCard: {
    backgroundColor: paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: borderSoft,
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
    borderColor: borderSoft,
  },
  tradeCardUnavailable: {
    borderColor: borderSoft,
    opacity: 0.65,
  },
  tradeCardNewlyAffordable: {
    borderColor: screenAccent.main,
    borderWidth: 2,
  },
  tradeCardPreviewed: {
    borderColor: screenAccent.main,
  },
  tradeCardLocked: {
    opacity: 0.72,
  },
  tradeCardPressed: {
    backgroundColor: paperMuted,
  },
  tradeCardFlash: {
    backgroundColor: paperMuted,
  },
  tradeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tradeRole: {
    alignSelf: 'flex-start',
    backgroundColor: screenAccent.badgeBg,
    borderColor: screenAccent.badgeBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    color: screenAccent.badgeText,
    fontSize: 10,
    fontWeight: '800',
  },
  tradeLockedText: {
    color: inkSoft,
    fontSize: 10,
    fontWeight: '700',
  },
  tradeNewText: {
    color: screenAccent.main,
    fontSize: 10,
    fontWeight: '800',
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
  tradeGiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tradeGiveItemCompact: {
    gap: 3,
  },
  tradeQty: {
    fontSize: 15,
    fontWeight: '800',
    color: inkStrong,
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
  tradePlus: {
    fontSize: 12,
    fontWeight: '700',
    color: inkSoft,
    marginHorizontal: 2,
  },
  tradeLabel: {
    fontSize: 12,
    color: inkSoft,
  },
  tradeMissingText: {
    marginTop: 6,
    fontSize: 10,
    color: disabledText,
    fontWeight: '700',
  },
  tradeArrow: {
    fontSize: 16,
    color: inkSoft,
    fontWeight: '700',
  },
  tradeButton: {
    backgroundColor: darkButtonBg,
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
    backgroundColor: darkButtonPressed,
    transform: [{ scale: 0.99 }],
  },
  tradeButtonDisabled: {
    backgroundColor: disabledBg,
  },
  tradeButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  tradeButtonTextDisabled: {
    color: disabledText,
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
    ...theme.shadows.elevated,
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
  autopsyCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  autopsyTitle: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.text,
  },
  autopsyInsight: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  autopsyLabel: {
    marginTop: Spacing.sm,
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  autopsyRoute: {
    marginTop: 3,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
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
    ...ui.cta,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
  },
  shareButtonPressed: {
    ...ui.ctaPressed,
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
    textAlign: 'center',
  },
  resultActions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
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
};
