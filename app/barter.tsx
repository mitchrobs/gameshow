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
  BarterMarketTab,
  BarterQualityReport,
  applyTrade,
  BarterPuzzle,
  canAfford as canAffordTrade,
  getDefaultSelectedTradeKey,
  getMarketTradeEntries,
  getTradeActionState,
  getTradeFeedback,
  getTradeOfferLabel,
  GoodId,
  missingForTrade,
  MarketTradeEntry,
  previewTrade,
  shouldShowHiddenNightPlaceholder,
  sortMarketTradeEntries,
  Trade,
  TradeActionState,
  TradeFeedback,
  tradeKey,
  getDailyBarter,
  getGoodById,
  getMarketIdentity as getSharedMarketIdentity,
} from '../src/data/barterPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import { BarterActionIsland, BarterPhaseTabs } from '../src/ui/barterLayout';

type GameState = 'playing' | 'won' | 'lost';
type ActiveTradeFeedback = TradeFeedback & { id: string };

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

function getPreviewDate(): Date {
  const today = new Date();
  if (Platform.OS !== 'web' || typeof window === 'undefined') return today;

  const host = window.location.hostname;
  if (host !== 'localhost' && host !== '127.0.0.1') return today;

  const dateParam = new URLSearchParams(window.location.search).get('date');
  if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) return today;

  const previewDate = new Date(`${dateParam}T12:00:00`);
  return Number.isNaN(previewDate.getTime()) ? today : previewDate;
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

function formatTrade(
  trade: Trade,
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById> = getGoodById
): string {
  const giveParts = trade.give
    .map((side) => {
      const good = getDisplayGood(side.good);
      return `${side.qty} ${good.emoji}`;
    })
    .join(' + ');
  const receiveParts = trade.receive
    .map((side) => {
      const good = getDisplayGood(side.good);
      return `${side.qty} ${good.emoji}`;
    })
    .join(' + ');
  return `${giveParts} → ${receiveParts}`;
}

function formatSideList(
  sides: Array<{ good: GoodId; qty: number }>,
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById>
): string {
  return sides
    .map((side) => {
      const good = getDisplayGood(side.good);
      return `${side.qty} ${good.emoji} ${good.name}`;
    })
    .join(', ');
}

function formatMissingLine(
  missing: Array<{ good: GoodId; qty: number }>,
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById>
): string {
  if (missing.length === 0) return '';
  return `Missing ${missing
    .map((side) => `${side.qty} ${getDisplayGood(side.good).emoji}`)
    .join(' + ')}`;
}

function shortGoodName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function getShareRouteEmojis(
  trades: Trade[],
  puzzle: BarterPuzzle,
  qualityReport: BarterQualityReport
): string {
  if (trades.length === 0) return '🛒';

  const firstTrade = trades[0];
  const firstKey = tradeKey(firstTrade);
  const regret = qualityReport.openingRegrets.find((entry) => entry.tradeKey === firstKey);
  const emojis: string[] = [];

  if (!regret || regret.regret === null) emojis.push('🧪');
  else if (regret.regret === 0) emojis.push('🎯');
  else if (regret.regret === 1) emojis.push('🧭');
  else emojis.push('🔁');

  const usedHiddenVendor =
    qualityReport.hiddenVendorKey !== null &&
    trades.some((trade) => tradeKey(trade) === qualityReport.hiddenVendorKey);
  if (usedHiddenVendor) emojis.push('🌙');

  const usedSignatureBundle = trades.some(
    (trade) =>
      trade.give.length > 1 &&
      trade.receive.some((side) => side.good === puzzle.goal.good && side.qty >= 2)
  );
  if (usedSignatureBundle) emojis.push('🎁');

  return emojis.join('');
}

interface MarketIdentity {
  flavor: string;
  dayScene: string;
  nightScene: string;
  sceneMarks: string[];
  hiddenStall: string;
  vendors: {
    day: string[];
    night: string[];
  };
}

const MARKET_DETAILS: Record<string, Omit<MarketIdentity, 'flavor'>> = {
  'Silk Road Bazaar': {
    dayScene: 'Silk awnings split the lane into color and shadow.',
    nightScene: 'Night lamps warm the fabric stalls as the cloth lanes reopen.',
    sceneMarks: ['🧵', '🏮', '🤝'],
    hiddenStall: 'A curtained night stall is tying off one last cloth bundle.',
    vendors: {
      day: ['Bolt Cutter', 'Thread Broker', 'Dye Clerk', 'Caravan Weaver'],
      night: ['Lantern Draper', 'Quiet Broker', 'Silk Appraiser', 'Back-Lane Weaver'],
    },
  },
  'Spice Wharf': {
    dayScene: 'Sacks thump onto wet boards while gulls circle the scales.',
    nightScene: 'Braziers glow near the quay while covered spice lots come forward.',
    sceneMarks: ['🌶️', '⚓️', '🔥'],
    hiddenStall: 'A shuttered quay stall is grinding one night-only mix.',
    vendors: {
      day: ['Dock Scale', 'Pepper Runner', 'Sack Captain', 'Harbor Clerk'],
      night: ['Brazier Cook', 'Tide Broker', 'Red-Sack Agent', 'Midnight Porter'],
    },
  },
  'Golden Caravan': {
    dayScene: 'Camel bells mark each offer before the shade disappears.',
    nightScene: 'The caravan circle tightens and lantern-lit bundles change hands.',
    sceneMarks: ['🐪', '🪙', '⛺'],
    hiddenStall: 'A locked caravan chest is being opened for nightfall.',
    vendors: {
      day: ['Bell Keeper', 'Shade Trader', 'Gold Clerk', 'Water Scout'],
      night: ['Camp Appraiser', 'Dune Broker', 'Chest Keeper', 'Lamp Merchant'],
    },
  },
  'Jade Exchange': {
    dayScene: 'Quiet counters shine while clerks compare every weight twice.',
    nightScene: 'The polished room quiets as green weights settle on the tables.',
    sceneMarks: ['🏺', '⚖️', '🫖'],
    hiddenStall: 'A sealed back-room quote is being set out for night.',
    vendors: {
      day: ['Jade Clerk', 'Scale Master', 'Porcelain Reader', 'Quiet Counter'],
      night: ['Seal Appraiser', 'Gallery Broker', 'Ledger Keeper', 'Lamp Counter'],
    },
  },
  'Porcelain Court': {
    dayScene: 'Tea steam softens the shelves, but the offers stay precise.',
    nightScene: 'Porcelain bells ring while the screened tables open for night.',
    sceneMarks: ['🫖', '🍵', '🏺'],
    hiddenStall: 'A screened court table is setting one night contract.',
    vendors: {
      day: ['Tea Steward', 'Shelf Keeper', 'Cup Turner', 'Porcelain Clerk'],
      night: ['Screen Steward', 'Bell Broker', 'Moon Cupper', 'Court Appraiser'],
    },
  },
  'Saffron Arcade': {
    dayScene: 'Saffron dust catches in the arcade light around every bargain.',
    nightScene: 'Red-gold lamps narrow the arcade around late spice offers.',
    sceneMarks: ['🟧', '🌶️', '🏮'],
    hiddenStall: 'A side shutter is opening for one late spice offer.',
    vendors: {
      day: ['Dust Clerk', 'Arcade Runner', 'Saffron Scale', 'Tin Keeper'],
      night: ['Lamp Painter', 'Side-Stall Broker', 'Red-Gold Clerk', 'Night Sifter'],
    },
  },
  'Lantern Market': {
    dayScene: 'Lantern frames hang unlit above a market that already points to night.',
    nightScene: 'Paper lanterns light the contracts that were visible all day.',
    sceneMarks: ['🏮', '✨', '🧵'],
    hiddenStall: 'A covered lantern stall is being lit for night.',
    vendors: {
      day: ['Frame Maker', 'Paper Clerk', 'Wick Runner', 'Dawn Lighter'],
      night: ['Lantern Keeper', 'Shadow Broker', 'Paper Appraiser', 'Glow Stall'],
    },
  },
  'Amber Row': {
    dayScene: 'Amber beads click across counters while merchants test your patience.',
    nightScene: 'Candlelight warms the row and makes every kept bead count.',
    sceneMarks: ['🟠', '🕯️', '🪙'],
    hiddenStall: 'A private amber strand is being sorted for night.',
    vendors: {
      day: ['Bead Cutter', 'Row Clerk', 'Amber Counter', 'Wax Broker'],
      night: ['Candle Appraiser', 'Private Strand', 'Night Counter', 'Warm Ledger'],
    },
  },
  'Salt & Timber Yard': {
    dayScene: 'Salt blocks and timber stacks make every exchange feel heavy.',
    nightScene: 'Torchlight marks the prepared bundles that can finally move.',
    sceneMarks: ['🧂', '🪵', '🔥'],
    hiddenStall: 'One locked yard stack is being opened for night.',
    vendors: {
      day: ['Salt Measurer', 'Timber Foreman', 'Stack Clerk', 'Yard Carter'],
      night: ['Torch Foreman', 'Locked Stack', 'Grain Broker', 'Night Carter'],
    },
  },
  'Copperstone Square': {
    dayScene: 'Copper scales ring across the square as traders weigh every shortcut.',
    nightScene: 'Stone arches echo with late offers for anyone who kept balance.',
    sceneMarks: ['🪙', '⚖️', '🏛️'],
    hiddenStall: 'A scale behind the arch is being set for night.',
    vendors: {
      day: ['Scale Ringer', 'Copper Clerk', 'Stone Broker', 'Mint Runner'],
      night: ['Arch Appraiser', 'Coin Keeper', 'Late Minter', 'Square Notary'],
    },
  },
  'Moonlit Souk': {
    dayScene: 'Canvas awnings hide cool shade and hotter arguments.',
    nightScene: 'Moonlight quiets the souk as one covered stall joins the market.',
    sceneMarks: ['🌙', '🏮', '🐪'],
    hiddenStall: 'A covered moonlit stall waits behind a blue awning.',
    vendors: {
      day: ['Shade Broker', 'Awnings Clerk', 'Date Runner', 'Souk Caller'],
      night: ['Moon Clerk', 'Blue Awning', 'Lamp Broker', 'Silent Carter'],
    },
  },
  'Rivergate Trades': {
    dayScene: 'Barges arrive in pairs and the gate clerks move goods by rhythm.',
    nightScene: 'The river gate narrows, rewarding cargo that still matches.',
    sceneMarks: ['🌊', '🚪', '⚓️'],
    hiddenStall: 'One hidden river gate is lifting for night.',
    vendors: {
      day: ['Gate Clerk', 'Barge Pairer', 'River Porter', 'Lock Scale'],
      night: ['Night Lock', 'Tide Appraiser', 'Gate Broker', 'Moon Porter'],
    },
  },
  'Crimson Ledger': {
    dayScene: 'Red ink dries fast, and every overpay stays on the page.',
    nightScene: 'The ledger closes around the goods left on the page.',
    sceneMarks: ['🟥', '🖋️', '📕'],
    hiddenStall: 'A final red-ink line is being balanced for night.',
    vendors: {
      day: ['Ink Auditor', 'Margin Clerk', 'Red Notary', 'Page Runner'],
      night: ['Closing Clerk', 'Night Auditor', 'Hidden Line', 'Ledger Broker'],
    },
  },
  'Starlit Agora': {
    dayScene: 'Open stalls price the future before the stars are visible.',
    nightScene: 'Starlight picks out the contracts that were waiting in plain sight.',
    sceneMarks: ['✨', '🏛️', '🌙'],
    hiddenStall: 'One late agora offer is waiting for its signal.',
    vendors: {
      day: ['Open Caller', 'Agora Clerk', 'Sky Broker', 'Pillar Runner'],
      night: ['Star Speaker', 'Moon Appraiser', 'Pillar Broker', 'Late Caller'],
    },
  },
  'Indigo Harbor': {
    dayScene: 'Indigo tarps snap above crates while the harbor wind keeps score.',
    nightScene: 'Blue lamps swing over the docks as prepared cargo comes due.',
    sceneMarks: ['⚓️', '🟦', '🌊'],
    hiddenStall: 'A dock lamp is swinging over one covered crate.',
    vendors: {
      day: ['Tarp Broker', 'Harbor Clerk', 'Crate Turner', 'Rope Runner'],
      night: ['Blue Lamp', 'Night Dockhand', 'Tide Appraiser', 'Hidden Crate'],
    },
  },
  'Windmill Exchange': {
    dayScene: 'Canvas sails turn above the stalls, pushing every deal into motion.',
    nightScene: 'The sails slow at dusk, and the right goods finally catch the wind.',
    sceneMarks: ['🌬️', '🪽', '🧵'],
    hiddenStall: 'One canvas shutter is rising for the night market.',
    vendors: {
      day: ['Sail Tally', 'Grain Clerk', 'Canvas Broker', 'Gust Runner'],
      night: ['Shutter Miller', 'Dusk Broker', 'Wind Appraiser', 'Night Sail'],
    },
  },
  'Oasis Ledger': {
    dayScene: 'Water sellers and caravan clerks count promises before the heat peaks.',
    nightScene: 'Cool lamps make the oasis ledger count what survived the heat.',
    sceneMarks: ['🌴', '💧', '📒'],
    hiddenStall: 'One cool night reserve is being uncorked.',
    vendors: {
      day: ['Water Clerk', 'Palm Broker', 'Reserve Tally', 'Caravan Scribe'],
      night: ['Night Reserve', 'Lamp Scribe', 'Oasis Appraiser', 'Cool Ledger'],
    },
  },
  'Tea Road Arcade': {
    dayScene: 'Tea tins pass from stall to stall while the arcade keeps its rhythm.',
    nightScene: 'The final cups pour only for warmth kept from the day.',
    sceneMarks: ['🍵', '🫖', '🏮'],
    hiddenStall: 'A hidden night blend is still steeping.',
    vendors: {
      day: ['Tea Runner', 'Tin Keeper', 'Arcade Brewer', 'Steam Clerk'],
      night: ['Night Brewer', 'Hidden Blend', 'Cup Appraiser', 'Lamp Steeper'],
    },
  },
  "Mariner's Market": {
    dayScene: 'Ropes, tide charts, and salt air crowd the tables.',
    nightScene: 'The tide turns, and prepared cargo finds its harbor.',
    sceneMarks: ['⚓️', '🪢', '🌊'],
    hiddenStall: 'One hidden night mooring is being tied off.',
    vendors: {
      day: ['Tide Clerk', 'Rope Broker', 'Chart Runner', 'Salt Pilot'],
      night: ['Night Mooring', 'Lamp Pilot', 'Dock Appraiser', 'Moon Chart'],
    },
  },
  'Atlas Bazaar': {
    dayScene: 'Mapmakers argue over paths while the first marks go down.',
    nightScene: 'The maps fold smaller at night, leaving only the marked paths.',
    sceneMarks: ['🗺️', '📍', '🧭'],
    hiddenStall: 'One covered map case is being inked for night.',
    vendors: {
      day: ['Map Clerk', 'Compass Broker', 'Route Caller', 'Pin Runner'],
      night: ['Night Cartographer', 'Hidden Route', 'Atlas Appraiser', 'Lamp Surveyor'],
    },
  },
  'Sunrise Caravan': {
    dayScene: 'Sunrise opens the caravan gates with every bargain pointed at dusk.',
    nightScene: 'The camp settles into lamplight and the tied packs matter most.',
    sceneMarks: ['🌅', '🐪', '⛺'],
    hiddenStall: 'One hidden bundle is being tied for nightfall.',
    vendors: {
      day: ['Gate Caller', 'Pack Clerk', 'Sun Broker', 'Dawn Carter'],
      night: ['Pack Master', 'Camp Appraiser', 'Lamp Carter', 'Hidden Bundle'],
    },
  },
};

function getMarketIdentity(marketName: string, marketEmoji: string): MarketIdentity {
  const shared = getSharedMarketIdentity(marketName, marketEmoji);
  const details = MARKET_DETAILS[marketName] ?? {
    dayScene: `${marketEmoji} Stalls open with enough information to plan the night.`,
    nightScene: 'The night market opens around the goods you chose to keep.',
    sceneMarks: [marketEmoji, '🤝', '🌙'],
    hiddenStall: 'One night stall is still setting up.',
    vendors: {
      day: ['Day Offer', 'Market Offer', 'Table Offer', 'Stall Offer'],
      night: ['Night Offer', 'Late Offer', 'Moon Offer', 'Hidden Stall'],
    },
  };
  return {
    ...details,
    flavor: shared.flavor,
    hiddenStall: shared.hiddenStall,
  };
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
  const previewDate = useMemo(() => getPreviewDate(), []);
  const puzzle = useMemo<BarterPuzzle>(() => getDailyBarter(previewDate), [previewDate]);
  const qualityReport = useMemo(() => analyzeBarterPuzzle(puzzle), [puzzle]);
  const displayGoods = useMemo(() => {
    return new Map(puzzle.goods.map((good) => [good.id, good]));
  }, [puzzle.goods]);
  const getDisplayGood = useCallback(
    (id: GoodId) => displayGoods.get(id) ?? getGoodById(id),
    [displayGoods]
  );
  const { width } = useWindowDimensions();
  const isCompact = width < 400;
  const canGoBack = router.canGoBack();
  const dateKey = useMemo(() => getLocalDateKey(previewDate), [previewDate]);
  const shortDateLabel = useMemo(
    () =>
      previewDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    [previewDate]
  );
  const dailyKey = useMemo(() => `${STORAGE_PREFIX}:daily:${dateKey}`, [dateKey]);

  const [inventory, setInventory] = useState<Record<GoodId, number>>(
    () => capInventory(cloneInventory(puzzle.inventory))
  );
  const [tradesUsed, setTradesUsed] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastTradeIndex, setLastTradeIndex] = useState<number | null>(null);
  const [tradeEffect, setTradeEffect] = useState<ActiveTradeFeedback | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [lateWindowOpen, setLateWindowOpen] = useState(false);
  const [lateTransition, setLateTransition] = useState(false);
  const [activeTab, setActiveTab] = useState<BarterMarketTab>('day');
  const [selectedGood, setSelectedGood] = useState<GoodId | null>(null);
  const [selectedTradeKey, setSelectedTradeKey] = useState<string | null>(null);
  const [nightNoticeDismissed, setNightNoticeDismissed] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [newlyAffordableKeys, setNewlyAffordableKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [showTutorial, setShowTutorial] = useState(false);
  const lateTransitionAnim = useRef(new Animated.Value(0)).current;
  const tradeEffectAnim = useRef(new Animated.Value(0)).current;

  const marketName = puzzle.marketName?.trim() || 'Daily Market';
  const marketEmoji = puzzle.marketEmoji || '🏺';
  const goalGood = getDisplayGood(puzzle.goal.good);
  const goalShort = `${puzzle.goal.qty} ${goalGood.emoji}`;
  const resultTier = getResultTier(gameState, tradesUsed, puzzle);
  const isMarinerMarket = marketName === "Mariner's Market";
  const earlyWindowTrades = puzzle.earlyWindowTrades ?? 4;
  const lateWindowTrigger = earlyWindowTrades;
  const barterUxColors = useMemo(
    () => ({
      day: '#FFA41F',
      night: '#9C88FF',
      text: theme.mode === 'dark' ? '#F0EDE6' : Colors.text,
      muted: '#888888',
      border: theme.mode === 'dark' ? '#1F2024' : Colors.border,
      surface: theme.mode === 'dark' ? '#111214' : Colors.surfaceElevated,
      surfaceMuted: theme.mode === 'dark' ? '#1A1A1A' : Colors.surfaceLight,
      button: theme.mode === 'dark' ? '#263244' : '#1f1b16',
      buttonPressed: theme.mode === 'dark' ? '#34435a' : '#3a342d',
      buttonText: '#ffffff',
      disabledBg: Colors.surfaceLight,
      disabledText: Colors.textMuted,
    }),
    [Colors, theme.mode]
  );

  const tradeWaves = useMemo(() => {
    const wave1 = puzzle.trades.filter((trade) => trade.window !== 'late');
    const wave2 = puzzle.trades.filter((trade) => trade.window === 'late');
    const hiddenTrade =
      wave2.find((trade) => trade.hiddenUntilNight) ??
      null;
    const previewLateTrades = hiddenTrade
      ? wave2.filter((trade) => trade !== hiddenTrade)
      : wave2;

    return { wave1, wave2, previewLateTrades, hiddenTrade };
  }, [puzzle.trades]);
  const marketIdentity = useMemo(
    () => getMarketIdentity(marketName, marketEmoji),
    [marketEmoji, marketName]
  );

  const marketEntries = useMemo(() => {
    const entries = getMarketTradeEntries(puzzle, activeTab, lateWindowOpen, selectedGood);
    return sortMarketTradeEntries(entries, inventory, selectedGood);
  }, [activeTab, inventory, lateWindowOpen, puzzle, selectedGood]);
  const selectedEntry = useMemo(
    () => marketEntries.find((entry) => entry.key === selectedTradeKey) ?? null,
    [marketEntries, selectedTradeKey]
  );
  const selectedActionState: TradeActionState = useMemo(
    () =>
      getTradeActionState(selectedEntry, inventory, {
        gameState,
        lateTransition,
        tradesUsed,
        maxTrades: puzzle.maxTrades,
      }),
    [gameState, inventory, lateTransition, puzzle.maxTrades, selectedEntry, tradesUsed]
  );
  const showHiddenNightPlaceholder = useMemo(
    () => shouldShowHiddenNightPlaceholder(puzzle, activeTab, lateWindowOpen),
    [activeTab, lateWindowOpen, puzzle]
  );
  const activeTabTitle = activeTab === 'night' ? 'Night Trades' : "Today's Trades";
  const activeTabSubtitle =
    activeTab === 'night'
      ? lateWindowOpen
        ? 'Night market'
        : `Opens after trade ${earlyWindowTrades}`
      : 'Day market';
  const nightTabLabel = lateWindowOpen
    ? 'open'
    : `${tradeWaves.previewLateTrades.length} visible`;
  const dayTabLabel = lateWindowOpen
    ? 'done'
    : 'active';
  const openingStock = useMemo(() => {
    const entries = puzzle.goods
      .filter((good) => puzzle.inventory[good.id] > 0)
      .map((good) => ({ good: good.id, qty: puzzle.inventory[good.id] }));
    return formatSideList(entries, getDisplayGood);
  }, [getDisplayGood, puzzle.goods, puzzle.inventory]);

  const shareText = useMemo(() => {
    const scoreCode =
      gameState === 'won' ? `${tradesUsed}/${puzzle.par}` : `X/${puzzle.maxTrades}`;
    const resultLine =
      gameState === 'won'
        ? resultTier
        : gameState === 'lost'
        ? 'Bust'
        : 'Planning';
    const routeEmojis = getShareRouteEmojis(tradeHistory, puzzle, qualityReport);
    return [
      `Barter ${dateKey} ${scoreCode}`,
      `${resultLine} · ${marketName} ${marketEmoji}`,
      `${routeEmojis} · ${formatTime(elapsedSeconds)}`,
      'https://mitchrobs.github.io/gameshow/barter',
    ].join('\n');
  }, [
    dateKey,
    elapsedSeconds,
    gameState,
    marketEmoji,
    marketName,
    puzzle,
    puzzle.maxTrades,
    puzzle.par,
    qualityReport,
    resultTier,
    tradeHistory,
    tradesUsed,
  ]);

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
    if (gameState !== 'playing' || showIntro) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, showIntro]);

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
    if (!lateWindowOpen) return;
    setActiveTab('night');
    setNightNoticeDismissed(false);
    setNewlyAffordableKeys(new Set());
  }, [lateWindowOpen]);

  useEffect(() => {
    const nextKey = getDefaultSelectedTradeKey(marketEntries, inventory, selectedTradeKey);
    if (nextKey !== selectedTradeKey) setSelectedTradeKey(nextKey);
  }, [inventory, marketEntries, selectedTradeKey]);

  useEffect(() => {
    if (gameState === 'playing') return;
    setShowResult(true);
  }, [gameState]);

  const handleDismissTutorial = useCallback(() => {
    setShowTutorial(false);
  }, []);

  const handleOpenTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const handleStartDayMarket = useCallback(() => {
    setShowTutorial(false);
    setShowIntro(false);
  }, []);

  const handleLeave = useCallback(() => {
    if (canGoBack) {
      router.back();
      return;
    }
    router.replace('/');
  }, [canGoBack, router]);

  const handleSelectTab = useCallback(
    (tab: BarterMarketTab) => {
      if (tab === 'day' && lateWindowOpen) return;
      if (tab === 'night') setNewlyAffordableKeys(new Set());
      setActiveTab(tab);
      setSelectedTradeKey(null);
    },
    [lateWindowOpen]
  );

  const handleSelectGood = useCallback((goodId: GoodId) => {
    setSelectedGood((current) => (current === goodId ? null : goodId));
    setSelectedTradeKey(null);
  }, []);

  const handleTrade = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (showIntro) return;
      if (lateTransition) return;
      if (tradesUsed >= puzzle.maxTrades) return;
      const trade = puzzle.trades[index];
      if (!trade) return;
      if (!canAffordTrade(inventory, trade)) return;

      const preview = previewTrade(puzzle, inventory, trade, tradesUsed);
      const nextInventory = applyTrade(inventory, trade);
      const cappedInventory = capInventory(nextInventory);
      const feedback = getTradeFeedback(trade, inventory, cappedInventory, puzzle.goal.good);
      const effectId = `${tradesUsed}-${tradeKey(trade)}-${Date.now()}`;

      const nextTradesUsed = tradesUsed + 1;
      setInventory(cappedInventory);
      setTradesUsed(nextTradesUsed);
      setLastTradeIndex(index);
      setTradeEffect({ ...feedback, id: effectId });
      setTradeHistory((prev) => [...prev, trade]);
      setNewlyAffordableKeys(new Set(preview.newlyAffordableTradeKeys));
      tradeEffectAnim.stopAnimation();
      tradeEffectAnim.setValue(0);
      Animated.sequence([
        Animated.timing(tradeEffectAnim, {
          toValue: 1,
          duration: feedback.isSignatureBundle ? 260 : 220,
          useNativeDriver: true,
        }),
        Animated.timing(tradeEffectAnim, {
          toValue: 0,
          duration: feedback.isSignatureBundle ? 520 : 380,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        setTradeEffect((current) => (current?.id === effectId ? null : current));
      });

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
    [gameState, showIntro, lateTransition, tradesUsed, puzzle, inventory, tradeEffectAnim]
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

  const renderTradeCard = (entry: MarketTradeEntry) => {
    const { trade, tradeIndex, locked, key } = entry;
    const giveGoods = trade.give.map((side) => ({
      side,
      good: getDisplayGood(side.good),
    }));
    const receiveGoods = trade.receive.map((side) => ({
      side,
      good: getDisplayGood(side.good),
    }));
    const missing = missingForTrade(inventory, trade);
    const canTrade =
      !locked &&
      gameState === 'playing' &&
      !lateTransition &&
      tradesUsed < puzzle.maxTrades &&
      missing.length === 0;
    const isNewlyAffordable = newlyAffordableKeys.has(key);
    const isSelected = selectedTradeKey === key;
    const offerLabel = getTradeOfferLabel(trade, puzzle.goal.good);
    const showMetaRow =
      isNewlyAffordable || entry.matchesSelectedGood || (missing.length > 0 && !locked);
    const isLatestTrade = tradeEffect !== null && lastTradeIndex === tradeIndex && !locked;
    const tradeCardMotion = isLatestTrade
      ? {
          transform: [
            {
              translateY: tradeEffectAnim.interpolate({
                inputRange: [0, 0.35, 1],
                outputRange: [0, -4, 0],
              }),
            },
            {
              scale: tradeEffectAnim.interpolate({
                inputRange: [0, 0.35, 1],
                outputRange: [1, tradeEffect.isSignatureBundle ? 1.025 : 1.015, 1],
              }),
            },
          ],
        }
      : null;

    return (
      <Animated.View
        key={`trade-${locked ? 'locked' : 'active'}-${tradeIndex}`}
        style={[
          styles.tradeCard,
          canTrade ? styles.tradeCardAvailable : styles.tradeCardUnavailable,
          isSelected && styles.tradeCardSelected,
          entry.matchesSelectedGood && styles.tradeCardMatched,
          isNewlyAffordable && styles.tradeCardNewlyAffordable,
          lastTradeIndex === tradeIndex && styles.tradeCardFlash,
          locked && styles.tradeCardLocked,
          isCompact && styles.tradeCardCompact,
          isMarinerMarket && styles.tradeCardMariner,
          tradeCardMotion,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected, disabled: locked }}
          onPress={() => setSelectedTradeKey(key)}
          style={({ pressed }) => [styles.tradePressable, pressed && styles.tradeCardPressed]}
        >
          <View style={[styles.tradeRow, isCompact && styles.tradeRowCompact]}>
            <View
              style={[
                styles.tradeInfo,
                styles.tradeInfoPassive,
                isCompact && styles.tradeInfoCompact,
              ]}
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
            <View style={styles.tradeVendorColumn}>
              <Text style={styles.tradeVendorName} numberOfLines={1}>
                {offerLabel}
              </Text>
              {locked && (
                <Text style={styles.tradeLockedText}>
                  {entry.lockReason === 'day_closed' ? 'Day done' : 'Opens at night'}
                </Text>
              )}
            </View>
            <Text style={styles.tradeSelectArrow}>›</Text>
          </View>
          {showMetaRow && (
            <View style={styles.tradeMetaRow}>
              {isNewlyAffordable && <Text style={styles.tradeNewText}>Newly open</Text>}
              {entry.matchesSelectedGood && (
                <Text style={styles.tradeMatchedText}>Uses selected good</Text>
              )}
              {missing.length > 0 && !locked && (
                <Text style={styles.tradeMissingText}>
                  {formatMissingLine(missing, getDisplayGood)}
                </Text>
              )}
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const actionTradeLine = selectedEntry
    ? formatTrade(selectedEntry.trade, getDisplayGood)
    : 'Choose a trade';
  const actionTitle = selectedEntry
    ? getTradeOfferLabel(selectedEntry.trade, puzzle.goal.good)
    : activeTabTitle;
  const actionMissingLine = selectedEntry?.locked
    ? ''
    : formatMissingLine(selectedActionState.missing, getDisplayGood);

  return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.chrome}>
          <View style={styles.topNav}>
            <Pressable
              accessibilityRole="button"
              onPress={handleLeave}
              style={({ pressed }) => [styles.chromeClose, pressed && styles.chromeButtonPressed]}
            >
              <Text style={styles.chromeCloseText}>×</Text>
            </Pressable>
            <View style={styles.chromeMark}>
              <Text style={styles.chromeMarkText}>⚖</Text>
            </View>
            <View style={styles.chromeTitleBlock}>
              <Text style={styles.chromeTitle}>Barter</Text>
              <Text style={styles.chromeMeta}>
                {shortDateLabel} · {lateWindowOpen ? 'night market' : 'day market'}
              </Text>
            </View>
            <Text style={styles.chromeTimer}>{formatTime(elapsedSeconds)}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleOpenTutorial}
              style={({ pressed }) => [styles.chromeHelp, pressed && styles.chromeButtonPressed]}
            >
              <Text style={styles.chromeHelpText}>?</Text>
            </Pressable>
          </View>
          <View style={styles.goalBar}>
            <View style={styles.goalTextBlock}>
              <Text style={styles.goalKicker}>Goal</Text>
              <Text style={styles.goalLine}>
                Collect{' '}
                <Text style={{ color: lateWindowOpen ? barterUxColors.night : barterUxColors.day }}>
                  {puzzle.goal.qty} {goalGood.name} {goalGood.emoji}
                </Text>
              </Text>
            </View>
            <View style={styles.goalPips}>
              {Array.from({ length: puzzle.goal.qty }).map((_, index) => {
                const filled = index < Math.min(inventory[puzzle.goal.good], puzzle.goal.qty);
                return (
                  <View
                    key={`goal-pip-${index}`}
                    style={[
                      styles.goalPip,
                      filled && {
                        borderColor: lateWindowOpen ? barterUxColors.night : barterUxColors.day,
                        backgroundColor: lateWindowOpen ? '#242044' : '#2a2111',
                      },
                    ]}
                  >
                    {filled && <Text style={styles.goalPipEmoji}>{goalGood.emoji}</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {showIntro ? (
            <View style={styles.marketIntroPage}>
              <View style={styles.marketIntroCard}>
                <Text style={styles.marketIntroEmoji}>{marketEmoji}</Text>
                <Text style={styles.marketIntroKicker}>Today's market</Text>
                <Text style={styles.marketIntroTitle}>Welcome to {marketName}</Text>
                <Text style={styles.marketIntroFlavor}>{marketIdentity.flavor}</Text>
                <View style={styles.marketIntroGoal}>
                  <Text style={styles.marketIntroGoalText}>
                    Collect {puzzle.goal.qty} {goalGood.name} {goalGood.emoji}
                  </Text>
                  <Text style={styles.marketIntroGoalMeta}>
                    Day has {earlyWindowTrades} trades. Night opens after that.
                  </Text>
                </View>
                <View style={styles.marketIntroStock}>
                  <Text style={styles.marketIntroStockTitle}>You start with</Text>
                  <Text style={styles.marketIntroStockText}>{openingStock}</Text>
                </View>
                <View style={styles.marketIntroActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleStartDayMarket}
                    style={({ pressed }) => [
                      styles.marketIntroPrimaryButton,
                      pressed && styles.marketIntroPrimaryButtonPressed,
                    ]}
                  >
                    <Text style={styles.marketIntroPrimaryButtonText}>Start day market</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleOpenTutorial}
                    style={({ pressed }) => [
                      styles.marketIntroSecondaryButton,
                      pressed && styles.marketIntroSecondaryButtonPressed,
                    ]}
                  >
                    <Text style={styles.marketIntroSecondaryButtonText}>How to play</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
          <View style={styles.page}>
            <BarterPhaseTabs
              activeTab={activeTab}
              lateWindowOpen={lateWindowOpen}
              dayLabel={dayTabLabel}
              nightLabel={nightTabLabel}
              colors={barterUxColors}
              onSelectTab={handleSelectTab}
            />
            <View style={styles.stallSection}>
              <Text style={styles.stallTitle}>Your stall</Text>
              <View style={[styles.inventoryRow, isCompact && styles.inventoryRowCompact]}>
                {puzzle.goods.map((good) => {
                  const count = inventory[good.id];
                  const changed = tradeEffect?.changedGoods.includes(good.id) ?? false;
                  const isSelectedGood = selectedGood === good.id;
                  const inventoryPulseStyle = changed
                    ? {
                        transform: [
                          {
                            scale: tradeEffectAnim.interpolate({
                              inputRange: [0, 0.35, 1],
                              outputRange: [1, 1.08, 1],
                            }),
                          },
                        ],
                      }
                    : null;
                  return (
                    <Animated.View
                      key={good.id}
                      style={[
                        styles.inventoryCard,
                        isCompact && styles.inventoryCardCompact,
                        count === 0 && styles.inventoryCardEmpty,
                        isSelectedGood && styles.inventoryCardSelected,
                        changed && styles.inventoryCardChanged,
                        inventoryPulseStyle,
                      ]}
                    >
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelectedGood }}
                        onPress={() => handleSelectGood(good.id)}
                        style={({ pressed }) => [
                          styles.inventoryPressable,
                          pressed && styles.inventoryCardPressed,
                        ]}
                      >
                        <Text style={[styles.inventoryEmoji, isCompact && styles.inventoryEmojiCompact]}>
                          {good.emoji}
                        </Text>
                        <Text style={[styles.inventoryCount, isCompact && styles.inventoryCountCompact]}>
                          {count}
                        </Text>
                        <Text style={styles.inventoryLabel} numberOfLines={1}>
                          {shortGoodName(good.name)}
                        </Text>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
            {tradeEffect && (
              <Animated.View
                style={[
                  styles.tradeEffectToast,
                  tradeEffect.isSignatureBundle && styles.tradeEffectToastSignature,
                  {
                    opacity: tradeEffectAnim.interpolate({
                      inputRange: [0, 0.2, 0.75, 1],
                      outputRange: [0, 1, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: tradeEffectAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [8, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.tradeEffectTrail}>
                  {tradeEffect.glyphTrail.map((goodId, index) => (
                    <Animated.Text
                      key={`${tradeEffect.id}-${goodId}-${index}`}
                      style={[
                        styles.tradeEffectGlyph,
                        {
                          transform: [
                            {
                              translateX: tradeEffectAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-4 + index * 2, 8 + index * 5],
                              }),
                            },
                            {
                              translateY: tradeEffectAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [4, -7 - index, 0],
                              }),
                            },
                          ],
                        },
                      ]}
                    >
                      {getDisplayGood(goodId).emoji}
                    </Animated.Text>
                  ))}
                </View>
                <Text style={styles.tradeEffectText}>
                  {tradeEffect.isSignatureBundle
                    ? `Bundle pays +${tradeEffect.goalDelta} ${goalGood.emoji}`
                    : 'Trade complete'}
                </Text>
              </Animated.View>
            )}
            {lateWindowOpen && !nightNoticeDismissed && (
              <View style={styles.nightWelcomeCard}>
                <Text style={styles.nightWelcomeTitle}>Night Market is open</Text>
                <Text style={styles.nightWelcomeBody}>
                  {marketIdentity.nightScene} {tradeWaves.hiddenTrade ? 'The hidden stall has joined the row.' : ''}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.nightWelcomeButton,
                    pressed && styles.nightWelcomeButtonPressed,
                  ]}
                  onPress={() => setNightNoticeDismissed(true)}
                >
                  <Text style={styles.nightWelcomeButtonText}>Enter night</Text>
                </Pressable>
              </View>
            )}
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
                <Text style={styles.transitionTitle}>Night Market opens</Text>
                <Text style={styles.transitionBody}>The hidden stall is joining the row.</Text>
              </Animated.View>
            )}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{activeTabTitle}</Text>
              <Text style={styles.sectionSubtitle}>{activeTabSubtitle}</Text>
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
              {marketEntries.map((entry) => renderTradeCard(entry))}
              {showHiddenNightPlaceholder && (
                <View style={[styles.tradeCard, styles.tradeCardLocked]}>
                  <View style={styles.tradeRow}>
                    <Text style={styles.hiddenVendorEquation}>?</Text>
                    <View style={styles.tradeVendorColumn}>
                      <Text style={styles.tradeVendorName} numberOfLines={1}>Hidden stall</Text>
                      <Text style={styles.tradeLockedText}>Opens at night</Text>
                    </View>
                    <Text style={styles.tradeSelectArrow}>🔒</Text>
                  </View>
                </View>
              )}
            </Animated.View>

          </View>
          )}
        </ScrollView>

        {!showIntro && (
        <View style={styles.actionIslandDock}>
          <BarterActionIsland
            title={actionTitle}
            tradeLine={actionTradeLine}
            detail={selectedActionState.detail}
            missingLine={actionMissingLine}
            buttonLabel={selectedActionState.buttonLabel}
            canExecute={selectedActionState.canExecute}
            activeTab={activeTab}
            tradesUsed={tradesUsed}
            maxTrades={puzzle.maxTrades}
            dayTradeCount={earlyWindowTrades}
            colors={barterUxColors}
            onTrade={() => {
              if (!selectedEntry) return;
              handleTrade(selectedEntry.tradeIndex);
            }}
          />
        </View>
        )}

        {showTutorial && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, styles.tutorialModalCard]}>
              <Text style={styles.tutorialModalKicker}>How to play</Text>
              <Text style={styles.tutorialModalTitle}>
                {marketName} {marketEmoji}
              </Text>
              <Text style={styles.tutorialModalBody}>
                {marketIdentity.flavor}
              </Text>
              <View style={styles.marketReadBox}>
                <Text style={styles.marketReadBoxTitle}>Today</Text>
                <Text style={styles.marketReadBoxText}>Start: {openingStock}</Text>
                <Text style={styles.marketReadBoxText}>
                  Goal: collect {goalShort} within {puzzle.maxTrades} trades.
                </Text>
                <Text style={styles.marketReadBoxText}>
                  Day Market closes after trade {earlyWindowTrades}. Night Market opens after that.
                </Text>
              </View>
              <Text style={styles.tutorialModalSectionTitle}>Rules</Text>
              <Text style={styles.tutorialModalBody}>
                Tap a good in your stall to bring matching trades upward. Other trades stay visible.
              </Text>
              <Text style={styles.tutorialModalHint}>
                The Night tab can be previewed before it opens. One hidden stall joins at night.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.tutorialButton,
                  pressed && styles.tutorialButtonPressed,
                ]}
                onPress={handleDismissTutorial}
              >
                <Text style={styles.tutorialButtonText}>
                  {showIntro ? 'Back to intro' : 'Back to market'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {showResult && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, styles.resultModalCard]}>
              <ScrollView
                style={styles.resultModalScroll}
                contentContainerStyle={styles.resultModalContent}
                showsVerticalScrollIndicator={false}
              >
              <Text style={styles.resultEmoji}>
                {gameState === 'won' ? (resultTier === 'Perfect' ? '⭐' : '🎉') : '😔'}
              </Text>
              <Text style={styles.resultTitle}>
                {resultTier === 'Bust' ? 'Out of Trades' : resultTier}
              </Text>
              <Text style={styles.resultSummary}>
                {gameState === 'won'
                  ? `Collected ${puzzle.goal.qty} ${goalGood.emoji} in ${tradesUsed} trades.`
                  : `Goal: ${puzzle.goal.qty} ${goalGood.emoji} ${goalGood.name}.`}
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

              <View style={styles.tradeLogCard}>
                <Text style={styles.autopsyTitle}>Trade log</Text>
                {tradeHistory.length > 0 ? (
                  tradeHistory.map((trade, index) => (
                    <View key={`result-trade-${index}`} style={styles.tradeLogRow}>
                      <Text style={styles.tradeLogIndex}>{index + 1}</Text>
                      <Text style={styles.tradeLogText}>
                        {formatTrade(trade, getDisplayGood)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.autopsyInsight}>No trades made.</Text>
                )}
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
              </ScrollView>
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
  const paper = theme.mode === 'dark' ? '#111214' : '#fffdf8';
  const paperMuted = theme.mode === 'dark' ? '#171a20' : '#f0ede8';
  const canvas = theme.mode === 'dark' ? '#0E1014' : '#f6f3ef';
  const borderSoft = theme.mode === 'dark' ? '#1F2024' : '#e6e0d6';
  const inkStrong = theme.mode === 'dark' ? '#f0ede6' : '#1f1b16';
  const inkMuted = theme.mode === 'dark' ? '#c6c0b7' : '#5f584f';
  const inkSoft = theme.mode === 'dark' ? '#888888' : '#8a8174';
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
    paddingTop: 12,
    paddingBottom: Spacing.xxl + 132,
  },
  chrome: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: canvas,
    borderBottomWidth: 1,
    borderBottomColor: borderSoft,
  },
  topNav: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: Spacing.md,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chromeClose: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  chromeCloseText: {
    color: inkSoft,
    fontSize: 22,
    lineHeight: 24,
  },
  chromeButtonPressed: {
    backgroundColor: paperMuted,
  },
  chromeMark: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#FFA41F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chromeMarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  chromeTitleBlock: {
    flex: 1,
    minWidth: 0,
  },
  chromeTitle: {
    color: inkStrong,
    fontSize: 12,
    fontWeight: '700',
  },
  chromeMeta: {
    marginTop: 1,
    color: theme.mode === 'dark' ? '#FFA41F' : '#b75f00',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  chromeTimer: {
    color: inkSoft,
    fontSize: 11,
    fontWeight: '800',
  },
  chromeHelp: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: borderSoft,
  },
  chromeHelpText: {
    color: inkMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  goalBar: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    backgroundColor: paper,
    borderTopWidth: 1,
    borderTopColor: borderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  goalKicker: {
    color: inkSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  goalLine: {
    marginTop: 1,
    color: inkStrong,
    fontSize: 13,
    fontWeight: '600',
  },
  goalPips: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 190,
  },
  goalPip: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: theme.mode === 'dark' ? '#1A1A2A' : '#E8E4F0',
    borderWidth: 1.5,
    borderColor: theme.mode === 'dark' ? '#2A2A3A' : '#C8C4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPipEmoji: {
    fontSize: 13,
  },
  stickyHeader: {
    backgroundColor: canvas,
    borderBottomWidth: 0,
    borderBottomColor: borderSoft,
    paddingHorizontal: 0,
    paddingBottom: 10,
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
  marketIntroPage: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  marketIntroCard: {
    backgroundColor: paper,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: borderSoft,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  marketIntroEmoji: {
    fontSize: 42,
    marginBottom: Spacing.sm,
  },
  marketIntroKicker: {
    color: inkSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  marketIntroTitle: {
    marginTop: 5,
    color: inkStrong,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  marketIntroFlavor: {
    marginTop: Spacing.sm,
    color: inkMuted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  marketIntroGoal: {
    width: '100%',
    marginTop: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? '#3a2b11' : '#f1c38a',
    backgroundColor: theme.mode === 'dark' ? '#1f1710' : '#fff7e6',
    padding: Spacing.md,
  },
  marketIntroGoalText: {
    color: inkStrong,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  marketIntroGoalMeta: {
    marginTop: 4,
    color: inkMuted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  marketIntroStock: {
    width: '100%',
    marginTop: Spacing.sm,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: borderSoft,
    backgroundColor: paperMuted,
    padding: Spacing.md,
  },
  marketIntroStockTitle: {
    color: inkSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  marketIntroStockText: {
    marginTop: 5,
    color: inkStrong,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
  },
  marketIntroActions: {
    width: '100%',
    marginTop: Spacing.lg,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  marketIntroPrimaryButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: '#FFA41F',
    paddingVertical: 13,
    alignItems: 'center',
  },
  marketIntroPrimaryButtonPressed: {
    backgroundColor: '#e99116',
  },
  marketIntroPrimaryButtonText: {
    color: '#1b1203',
    fontSize: 14,
    fontWeight: '900',
  },
  marketIntroSecondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  marketIntroSecondaryButtonPressed: {
    backgroundColor: paperMuted,
  },
  marketIntroSecondaryButtonText: {
    color: inkStrong,
    fontSize: 14,
    fontWeight: '800',
  },
  header: {
    marginBottom: 6,
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
  helpButton: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    backgroundColor: paper,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  introHelpButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  helpButtonPressed: {
    backgroundColor: paperMuted,
  },
  helpButtonText: {
    color: inkStrong,
    fontSize: 12,
    fontWeight: '700',
  },
  introCard: {
    backgroundColor: paper,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    padding: 14,
    marginBottom: 12,
  },
  introActions: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  continueButton: {
    borderRadius: BorderRadius.sm,
    backgroundColor: darkButtonBg,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  continueButtonPressed: {
    backgroundColor: darkButtonPressed,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  readStrip: {
    backgroundColor: paper,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    padding: 10,
    marginBottom: 12,
    gap: 8,
  },
  readStripText: {
    color: inkStrong,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  readStripButton: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  readStripButtonText: {
    color: inkStrong,
    fontSize: 11,
    fontWeight: '800',
  },
  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: inkStrong,
  },
  introFlavor: {
    marginTop: 6,
    fontSize: 12,
    color: inkMuted,
    lineHeight: 17,
  },
  marketRead: {
    marginTop: 8,
    fontSize: 12,
    color: inkStrong,
    lineHeight: 17,
    fontWeight: '700',
  },
  marketManifest: {
    marginTop: 5,
    fontSize: 11,
    color: inkMuted,
    lineHeight: 16,
  },
  introBody: {
    marginTop: 8,
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
  tutorialModalCard: {
    maxWidth: 440,
  },
  tutorialModalKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: screenAccent.main,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  tutorialModalTitle: {
    marginTop: 4,
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  tutorialModalBody: {
    marginTop: Spacing.sm,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  tutorialModalSectionTitle: {
    marginTop: Spacing.md,
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    textTransform: 'uppercase',
  },
  marketReadBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 5,
  },
  marketReadBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
  },
  marketReadBoxText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  tutorialModalSteps: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
  },
  tutorialModalHint: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
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
    backgroundColor: theme.mode === 'dark' ? '#12102A' : '#f2edff',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? '#2A2466' : '#c8b9ff',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  transitionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.mode === 'dark' ? '#9C88FF' : '#5142ad',
  },
  transitionBody: {
    marginTop: 2,
    fontSize: 11,
    color: theme.mode === 'dark' ? '#8877CC' : '#6656cc',
  },
  nightWelcomeCard: {
    backgroundColor: theme.mode === 'dark' ? '#181630' : '#f2edff',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: theme.mode === 'dark' ? '#4a3f82' : '#c8b9ff',
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  nightWelcomeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.mode === 'dark' ? '#ded7ff' : '#392c83',
  },
  nightWelcomeBody: {
    marginTop: 3,
    fontSize: 11,
    color: theme.mode === 'dark' ? '#b8b0df' : '#5b4fa0',
    lineHeight: 16,
  },
  nightWelcomeButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.sm,
    backgroundColor: theme.mode === 'dark' ? '#5f50c9' : '#6656cc',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  nightWelcomeButtonPressed: {
    backgroundColor: theme.mode === 'dark' ? '#7568e0' : '#5142ad',
  },
  nightWelcomeButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  tradeEffectToast: {
    pointerEvents: 'none',
    alignSelf: 'center',
    minWidth: 160,
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceElevated : '#fffdf8',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: -Spacing.xs,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  tradeEffectToastSignature: {
    borderColor: screenAccent.main,
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : '#fff7df',
  },
  tradeEffectTrail: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tradeEffectGlyph: {
    fontSize: 18,
  },
  tradeEffectText: {
    marginTop: 1,
    color: inkMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  bonusVendorCard: {
    backgroundColor: theme.mode === 'dark' ? '#151c26' : '#f7f2ea',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: borderSoft,
    padding: Spacing.sm,
  },
  bonusVendorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: inkStrong,
  },
  bonusVendorBody: {
    marginTop: 3,
    fontSize: 11,
    color: inkMuted,
    lineHeight: 16,
  },
  title: {
    fontSize: 21,
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
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
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
    fontSize: 9,
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
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 105,
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
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: inkSoft,
  },
  selectedGoodText: {
    marginTop: 4,
    fontSize: 11,
    color: inkMuted,
    lineHeight: 16,
  },
  inventoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  inventoryRowCompact: {
    gap: 4,
  },
  inventoryCard: {
    backgroundColor: paper,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: borderSoft,
    paddingVertical: 7,
    paddingHorizontal: 4,
    width: 64,
    minHeight: 64,
    alignItems: 'center',
  },
  inventoryCardCompact: {
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  inventoryPressable: {
    width: '100%',
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  inventoryCardSelected: {
    borderColor: '#FFA41F',
    borderWidth: 2,
    backgroundColor: theme.mode === 'dark' ? '#2a2111' : '#fff7e6',
  },
  inventoryCardPressed: {
    opacity: 0.82,
  },
  inventoryCardEmpty: {
    opacity: 0.35,
  },
  inventoryCardChanged: {
    borderColor: '#FFA41F',
    backgroundColor: theme.mode === 'dark' ? '#2a2111' : '#fff7df',
  },
  inventoryEmoji: {
    fontSize: 22,
  },
  inventoryEmojiCompact: {
    fontSize: 15,
  },
  inventoryCount: {
    fontSize: 13,
    fontWeight: '800',
    color: inkStrong,
    marginTop: 0,
  },
  inventoryCountCompact: {
    fontSize: 12,
  },
  inventoryLabel: {
    marginTop: 2,
    maxWidth: 54,
    color: inkSoft,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stallSection: {
    marginBottom: 12,
  },
  stallTitle: {
    marginBottom: 10,
    color: inkSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  tradeList: {
    gap: 8,
    marginBottom: Spacing.xxl,
  },
  tradeListBeforeBonus: {
    marginBottom: Spacing.md,
  },
  tradeListCompact: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tradeCard: {
    backgroundColor: paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: borderSoft,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowOpacity: 0,
    elevation: 0,
    minHeight: 56,
  },
  tradePressable: {
    width: '100%',
  },
  tradeCardPressed: {
    opacity: 0.88,
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
  tradeCardSelected: {
    borderColor: '#FFA41F',
    borderWidth: 1.5,
    backgroundColor: theme.mode === 'dark' ? '#131313' : '#fffaf0',
  },
  tradeCardMatched: {
    backgroundColor: theme.mode === 'dark' ? '#131313' : '#fffaf0',
  },
  tradeCardNewlyAffordable: {
    borderColor: screenAccent.main,
    borderWidth: 2,
  },
  tradeCardLocked: {
    opacity: 0.72,
  },
  tradeCardFlash: {
    backgroundColor: paperMuted,
  },
  tradeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  tradeVendorName: {
    color: inkMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
  tradeVendorColumn: {
    width: 122,
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 2,
  },
  tradeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  tradeLockedText: {
    color: inkSoft,
    fontSize: 9,
    fontWeight: '700',
  },
  tradeSelectedText: {
    color: theme.mode === 'dark' ? '#ffbf5c' : '#b75f00',
    fontSize: 10,
    fontWeight: '800',
  },
  tradeMatchedText: {
    color: inkMuted,
    fontSize: 9,
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
    gap: 8,
  },
  tradeRowCompact: {
    gap: Spacing.xs,
  },
  tradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  tradeInfoPassive: {
    pointerEvents: 'none',
  },
  tradeInfoCompact: {
    gap: Spacing.xs,
  },
  tradeSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    flexShrink: 1,
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
    fontSize: 18,
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
    fontSize: 10,
    color: disabledText,
    fontWeight: '700',
  },
  tradeArrow: {
    fontSize: 15,
    color: theme.mode === 'dark' ? '#444444' : '#b6afa5',
    fontWeight: '700',
  },
  tradeSelectArrow: {
    fontSize: 19,
    color: theme.mode === 'dark' ? '#555555' : '#b6afa5',
    fontWeight: '700',
    width: 12,
    textAlign: 'right',
  },
  hiddenVendorEquation: {
    flex: 1,
    color: inkSoft,
    fontSize: 18,
    fontWeight: '800',
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
  actionIslandDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: canvas,
    borderTopWidth: 1,
    borderTopColor: borderSoft,
    zIndex: 20,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 16, 24, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    zIndex: 50,
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
  resultModalCard: {
    maxHeight: '88%',
    padding: 0,
    overflow: 'hidden',
  },
  resultModalScroll: {
    width: '100%',
  },
  resultModalContent: {
    padding: Spacing.xl,
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
  resultRead: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    fontWeight: '700',
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
  tradeLogCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: 6,
  },
  tradeLogRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tradeLogIndex: {
    width: 20,
    height: 20,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 20,
    overflow: 'hidden',
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceElevated : '#ffffff',
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  tradeLogText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '700',
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
