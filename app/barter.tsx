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
  BarterQualityReport,
  applyTrade,
  BarterPuzzle,
  canAfford as canAffordTrade,
  getBarterTutorialPuzzle,
  getTradeFeedback,
  GoodId,
  missingForTrade,
  NightVendorRole,
  previewTrade,
  RouteSummary,
  Trade,
  TradeFeedback,
  tradeKey,
  getDailyBarter,
  getGoodById,
  getMarketIdentity as getSharedMarketIdentity,
} from '../src/data/barterPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

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

function inventoryToSideList(
  inventory: Record<GoodId, number> | null,
  puzzle: BarterPuzzle
): Array<{ good: GoodId; qty: number }> {
  if (!inventory) return [];
  return puzzle.goods
    .map((good) => ({ good: good.id, qty: inventory[good.id] ?? 0 }))
    .filter((side) => side.qty > 0);
}

function applyTradesThroughDepth(
  startingInventory: Record<GoodId, number>,
  trades: Trade[],
  depth: number
): Record<GoodId, number> {
  let next = cloneInventory(startingInventory);
  trades.slice(0, depth).forEach((trade) => {
    next = applyTrade(next, trade);
  });
  return next;
}

function getMarketRead(
  puzzle: BarterPuzzle,
  qualityReport: BarterQualityReport,
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById>
): string {
  const bottleneck = qualityReport.bottleneckGood
    ? getDisplayGood(qualityReport.bottleneckGood).name
    : 'one prepared good';
  const goal = getDisplayGood(puzzle.goal.good).name;

  switch (puzzle.feltThesis) {
    case 'protect_key_good':
      return `${bottleneck} has two jobs tonight. Save it until the better use is clear.`;
    case 'spend_the_heap':
      return 'You start rich but awkward. Turn the heap into flexible pieces.';
    case 'carry_the_pair':
      return 'Carry a matched pair into night. The bundle is the shortcut.';
    case 'use_the_ugly_trade':
      return 'The odd trade may be useful because it opens more stalls.';
    case 'stop_early':
      return `More ${bottleneck} is not always better. Stop once the bundle has enough.`;
    case 'night_told_you':
      return 'The visible Night Market already tells you what to prepare.';
    case 'hidden_is_mercy':
      return 'The hidden stall is backup. The clean route is already visible.';
  }

  switch (puzzle.economicThesis) {
    case 'save_one_good':
      return `${bottleneck} has two jobs today. The clean route saves it for the better Night Market use.`;
    case 'stay_flexible':
      return `Keep one flexible piece alive for night. The cheap-looking route can become expensive fast.`;
    case 'enough_not_more':
      return `Make enough for ${goal}, then stop. Extra production usually turns into cleanup.`;
    case 'prepare_the_bundle':
      return `Prepare both halves before night. The bundle is the trade that makes par feel clever.`;
    case 'round_trip':
      return `A short round trip can turn spare goods into the missing night piece.`;
    case 'rebuild_the_catalyst':
      return `Spend the catalyst only when your route rebuilds it before the payoff.`;
  }

  switch (qualityReport.topology ?? puzzle.topology) {
    case 'balanced_pair':
      return `Keep two prepared goods close together; the clean route turns a balanced pair into ${goal}.`;
    case 'catalyst_debt':
      return `${bottleneck} is doing double duty. Spending it early is fine only if your route rebuilds it.`;
    case 'scarce_bridge':
      return `${bottleneck} has competing uses. Pick which night payoff it should serve before the day closes.`;
    case 'tempo_discount':
      return `The fast line overpays. The slower line is harder to read, but it can buy the night discount.`;
    case 'night_pivot':
      return `Most of the night market is visible now. The covered stall is a pivot, not the whole answer.`;
    case 'delayed_multiplier':
      return `A quiet day setup can multiply late. Save the piece that looks idle before night opens.`;
    case 'split_pipeline':
      return `Two pipelines feed the goal. Balanced leftovers matter more than building one big pile.`;
    case 'compression_route':
      return `The bundle route saves a trade only if the day market prepares both halves first.`;
    case 'overproduction_trap':
      return `Extra goods can strand you. Make enough for ${goal}, not the biggest possible pile.`;
    default:
      return puzzle.thesis ?? 'Read the visible night contracts before spending the day market.';
  }
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

const MARKET_FLAVOR: Record<string, string> = {
  'Silk Road Bazaar': 'Bright bolts hang over narrow lanes while brokers trade in whispers and hand signs.',
  'Spice Wharf': 'Dockhands unload red sacks before sunrise; every stall smells expensive by noon.',
  'Golden Caravan': 'Caravan bells mark the rhythm here, and every trader watches what leaves the shade.',
  'Jade Exchange': 'Polished counters, quiet offers, and one wrong imbalance can echo through the room.',
  'Porcelain Court': 'Tea steam curls over porcelain shelves while patient vendors wait for perfect pairs.',
  'Saffron Arcade': 'Lanterns catch on saffron dust, and fast deals can cost more than they seem.',
  'Lantern Market': 'Paper lanterns mark the night stalls early, giving careful planners a route to read.',
  'Amber Row': 'Amber beads click across tables as merchants test whether you saved the right pieces.',
  'Salt & Timber Yard': 'Salt blocks and timber stacks move slowly here, but the right bundle travels far.',
  'Copperstone Square': 'Copper scales ring all morning; the square rewards balance more than speed.',
  'Moonlit Souk': 'Moonlit awnings hide one late stall, so the visible contracts matter even more.',
  'Rivergate Trades': 'River barges arrive in pairs, and the best traders keep their cargo matched.',
  'Crimson Ledger': 'Every offer is marked in red ink; overpay once and the ledger remembers.',
  'Starlit Agora': 'Under open sky, vendors price the future before the night market fully wakes.',
  'Indigo Harbor': 'Indigo tarps snap in the harbor wind while rare goods wait behind clean timing.',
  'Windmill Exchange': 'Canvas sails turn over the stalls, and every gust seems to change what a fair trade means.',
  'Oasis Ledger': 'Water sellers and caravan clerks count every promise before the night lamps are lit.',
  'Tea Road Arcade': 'Tea tins pass from stall to stall; the clever route keeps enough warmth for later.',
  "Mariner's Market": 'Rope, salt, and tide charts crowd the tables; nothing stays useful forever.',
  'Atlas Bazaar': 'Mapmakers argue over routes while vendors reward the trader who planned two turns ahead.',
  'Sunrise Caravan': 'Sunrise opens the caravan gates, but the best bargains are aimed at night.',
};

const MARKET_DETAILS: Record<string, Omit<MarketIdentity, 'flavor'>> = {
  'Silk Road Bazaar': {
    dayScene: 'Silk awnings split the lane into color and shadow.',
    nightScene: 'Lamp cords drop between fabric stalls as brokers reopen their ledgers.',
    sceneMarks: ['🧵', '🏮', '🤝'],
    hiddenStall: 'A curtained silk broker is tying up one last night offer.',
    vendors: {
      day: ['Bolt Cutter', 'Thread Broker', 'Dye Clerk', 'Caravan Weaver'],
      night: ['Lantern Draper', 'Quiet Broker', 'Silk Appraiser', 'Back-Lane Weaver'],
    },
  },
  'Spice Wharf': {
    dayScene: 'Sacks thump onto wet boards while gulls circle the scales.',
    nightScene: 'Braziers glow near the quay and the sharpest spices move under cover.',
    sceneMarks: ['🌶️', '⚓️', '🔥'],
    hiddenStall: 'A quay cook is grinding a night-only offer behind the shutters.',
    vendors: {
      day: ['Dock Scale', 'Pepper Runner', 'Sack Captain', 'Harbor Clerk'],
      night: ['Brazier Cook', 'Tide Broker', 'Red-Sack Agent', 'Midnight Porter'],
    },
  },
  'Golden Caravan': {
    dayScene: 'Camel bells mark each offer before the shade disappears.',
    nightScene: 'The caravan circle tightens and lantern-lit bundles change hands.',
    sceneMarks: ['🐪', '🪙', '⛺'],
    hiddenStall: 'A caravan guard is unpacking a locked chest for nightfall.',
    vendors: {
      day: ['Bell Keeper', 'Shade Trader', 'Gold Clerk', 'Water Scout'],
      night: ['Camp Appraiser', 'Dune Broker', 'Chest Keeper', 'Lamp Merchant'],
    },
  },
  'Jade Exchange': {
    dayScene: 'Quiet counters shine while clerks compare every weight twice.',
    nightScene: 'The polished room hushes as paired goods reach the jade tables.',
    sceneMarks: ['🏺', '⚖️', '🫖'],
    hiddenStall: 'A back-room appraiser is preparing one sealed night quote.',
    vendors: {
      day: ['Jade Clerk', 'Scale Master', 'Porcelain Reader', 'Quiet Counter'],
      night: ['Seal Appraiser', 'Gallery Broker', 'Ledger Keeper', 'Lamp Counter'],
    },
  },
  'Porcelain Court': {
    dayScene: 'Tea steam softens the shelves, but the offers stay precise.',
    nightScene: 'Porcelain bells ring as the court rewards careful pairs.',
    sceneMarks: ['🫖', '🍵', '🏺'],
    hiddenStall: 'A court steward is polishing a night contract behind the screen.',
    vendors: {
      day: ['Tea Steward', 'Shelf Keeper', 'Cup Turner', 'Porcelain Clerk'],
      night: ['Screen Steward', 'Bell Broker', 'Moon Cupper', 'Court Appraiser'],
    },
  },
  'Saffron Arcade': {
    dayScene: 'Saffron dust catches in the arcade light around every bargain.',
    nightScene: 'Red-gold lamps turn the arcade into a narrow row of payoffs.',
    sceneMarks: ['🟧', '🌶️', '🏮'],
    hiddenStall: 'A spice painter is opening a side shutter for nightfall.',
    vendors: {
      day: ['Dust Clerk', 'Arcade Runner', 'Saffron Scale', 'Tin Keeper'],
      night: ['Lamp Painter', 'Side-Stall Broker', 'Red-Gold Clerk', 'Night Sifter'],
    },
  },
  'Lantern Market': {
    dayScene: 'Lantern frames hang unlit above a market that already points to night.',
    nightScene: 'Every paper lantern becomes a signpost for the final trades.',
    sceneMarks: ['🏮', '✨', '🧵'],
    hiddenStall: 'A paper-lantern vendor is lighting one covered stall.',
    vendors: {
      day: ['Frame Maker', 'Paper Clerk', 'Wick Runner', 'Dawn Lighter'],
      night: ['Lantern Keeper', 'Shadow Broker', 'Paper Appraiser', 'Glow Stall'],
    },
  },
  'Amber Row': {
    dayScene: 'Amber beads click across counters while merchants test your patience.',
    nightScene: 'Candlelight turns every bead warm and every mistake visible.',
    sceneMarks: ['🟠', '🕯️', '🪙'],
    hiddenStall: 'A bead cutter is sorting a private strand for the night row.',
    vendors: {
      day: ['Bead Cutter', 'Row Clerk', 'Amber Counter', 'Wax Broker'],
      night: ['Candle Appraiser', 'Private Strand', 'Night Counter', 'Warm Ledger'],
    },
  },
  'Salt & Timber Yard': {
    dayScene: 'Salt blocks and timber stacks make every route feel heavy.',
    nightScene: 'Torchlight marks the prepared bundles that can finally move.',
    sceneMarks: ['🧂', '🪵', '🔥'],
    hiddenStall: 'A yard foreman is unlocking one night stack.',
    vendors: {
      day: ['Salt Measurer', 'Timber Foreman', 'Stack Clerk', 'Yard Carter'],
      night: ['Torch Foreman', 'Locked Stack', 'Grain Broker', 'Night Carter'],
    },
  },
  'Copperstone Square': {
    dayScene: 'Copper scales ring across the square as traders weigh every shortcut.',
    nightScene: 'Stone arches echo with late offers for anyone who kept balance.',
    sceneMarks: ['🪙', '⚖️', '🏛️'],
    hiddenStall: 'A copper minter is setting one scale behind the arch.',
    vendors: {
      day: ['Scale Ringer', 'Copper Clerk', 'Stone Broker', 'Mint Runner'],
      night: ['Arch Appraiser', 'Coin Keeper', 'Late Minter', 'Square Notary'],
    },
  },
  'Moonlit Souk': {
    dayScene: 'Canvas awnings hide cool shade and hotter arguments.',
    nightScene: 'Moonlight turns the souk quiet, and one covered stall joins the route.',
    sceneMarks: ['🌙', '🏮', '🐪'],
    hiddenStall: 'A moonlit stall is still hidden behind a blue awning.',
    vendors: {
      day: ['Shade Broker', 'Awnings Clerk', 'Date Runner', 'Souk Caller'],
      night: ['Moon Clerk', 'Blue Awning', 'Lamp Broker', 'Silent Carter'],
    },
  },
  'Rivergate Trades': {
    dayScene: 'Barges arrive in pairs and the gate clerks move goods by rhythm.',
    nightScene: 'The river gate narrows, rewarding cargo that still matches.',
    sceneMarks: ['🌊', '🚪', '⚓️'],
    hiddenStall: 'A lock keeper is raising one hidden night gate.',
    vendors: {
      day: ['Gate Clerk', 'Barge Pairer', 'River Porter', 'Lock Scale'],
      night: ['Night Lock', 'Tide Appraiser', 'Gate Broker', 'Moon Porter'],
    },
  },
  'Crimson Ledger': {
    dayScene: 'Red ink dries fast, and every overpay stays on the page.',
    nightScene: 'The ledger closes around the goods you chose to preserve.',
    sceneMarks: ['🟥', '🖋️', '📕'],
    hiddenStall: 'A red-ink auditor is balancing one hidden night line.',
    vendors: {
      day: ['Ink Auditor', 'Margin Clerk', 'Red Notary', 'Page Runner'],
      night: ['Closing Clerk', 'Night Auditor', 'Hidden Line', 'Ledger Broker'],
    },
  },
  'Starlit Agora': {
    dayScene: 'Open stalls price the future before the stars are visible.',
    nightScene: 'Starlight picks out the contracts that were readable all along.',
    sceneMarks: ['✨', '🏛️', '🌙'],
    hiddenStall: 'An agora speaker is waiting to announce one night offer.',
    vendors: {
      day: ['Open Caller', 'Agora Clerk', 'Sky Broker', 'Pillar Runner'],
      night: ['Star Speaker', 'Moon Appraiser', 'Pillar Broker', 'Late Caller'],
    },
  },
  'Indigo Harbor': {
    dayScene: 'Indigo tarps snap above crates while the harbor wind keeps score.',
    nightScene: 'Blue lamps swing over the docks as prepared cargo pays off.',
    sceneMarks: ['⚓️', '🟦', '🌊'],
    hiddenStall: 'A dock lamp is swinging over one hidden night crate.',
    vendors: {
      day: ['Tarp Broker', 'Harbor Clerk', 'Crate Turner', 'Rope Runner'],
      night: ['Blue Lamp', 'Night Dockhand', 'Tide Appraiser', 'Hidden Crate'],
    },
  },
  'Windmill Exchange': {
    dayScene: 'Canvas sails turn above the stalls, pushing every deal into motion.',
    nightScene: 'The sails slow at dusk, and balanced goods finally catch the wind.',
    sceneMarks: ['🌬️', '🪽', '🧵'],
    hiddenStall: 'A miller is raising one canvas shutter for the night market.',
    vendors: {
      day: ['Sail Tally', 'Grain Clerk', 'Canvas Broker', 'Gust Runner'],
      night: ['Shutter Miller', 'Dusk Broker', 'Wind Appraiser', 'Night Sail'],
    },
  },
  'Oasis Ledger': {
    dayScene: 'Water sellers and caravan clerks count promises before the heat peaks.',
    nightScene: 'Cool lamps make the oasis ledger strict but generous to planners.',
    sceneMarks: ['🌴', '💧', '📒'],
    hiddenStall: 'A water clerk is uncorking one night reserve.',
    vendors: {
      day: ['Water Clerk', 'Palm Broker', 'Reserve Tally', 'Caravan Scribe'],
      night: ['Night Reserve', 'Lamp Scribe', 'Oasis Appraiser', 'Cool Ledger'],
    },
  },
  'Tea Road Arcade': {
    dayScene: 'Tea tins pass from stall to stall while the arcade keeps its rhythm.',
    nightScene: 'The final cups pour only for traders who saved the right warmth.',
    sceneMarks: ['🍵', '🫖', '🏮'],
    hiddenStall: 'A tea master is steeping one hidden night blend.',
    vendors: {
      day: ['Tea Runner', 'Tin Keeper', 'Arcade Brewer', 'Steam Clerk'],
      night: ['Night Brewer', 'Hidden Blend', 'Cup Appraiser', 'Lamp Steeper'],
    },
  },
  "Mariner's Market": {
    dayScene: 'Ropes, tide charts, and salt air crowd the tables.',
    nightScene: 'The tide turns, and the prepared cargo decides the route home.',
    sceneMarks: ['⚓️', '🪢', '🌊'],
    hiddenStall: 'A mariner is tying off one hidden night mooring.',
    vendors: {
      day: ['Tide Clerk', 'Rope Broker', 'Chart Runner', 'Salt Pilot'],
      night: ['Night Mooring', 'Lamp Pilot', 'Dock Appraiser', 'Moon Chart'],
    },
  },
  'Atlas Bazaar': {
    dayScene: 'Mapmakers argue over routes while vendors watch your first commitment.',
    nightScene: 'The maps fold smaller at night, leaving only the planned paths.',
    sceneMarks: ['🗺️', '📍', '🧭'],
    hiddenStall: 'A cartographer is inking one hidden night route.',
    vendors: {
      day: ['Map Clerk', 'Compass Broker', 'Route Caller', 'Pin Runner'],
      night: ['Night Cartographer', 'Hidden Route', 'Atlas Appraiser', 'Lamp Surveyor'],
    },
  },
  'Sunrise Caravan': {
    dayScene: 'Sunrise opens the caravan gates with every bargain pointed at dusk.',
    nightScene: 'The camp settles into lamplight and the prepared packs matter most.',
    sceneMarks: ['🌅', '🐪', '⛺'],
    hiddenStall: 'A pack master is tying one hidden bundle for nightfall.',
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
    nightScene: 'The night market rewards the goods you chose to protect.',
    sceneMarks: [marketEmoji, '🤝', '🌙'],
    hiddenStall: 'One night stall is still setting up.',
    vendors: {
      day: ['Day Broker', 'Market Clerk', 'Route Trader', 'Stall Keeper'],
      night: ['Night Broker', 'Late Appraiser', 'Moon Clerk', 'Hidden Stall'],
    },
  };
  return {
    ...details,
    flavor: shared.flavor,
    hiddenStall: shared.hiddenStall,
  };
}

function formatVendorGoods(
  sides: Trade['give'],
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById>
): string {
  const label = sides
    .slice(0, 2)
    .map((side) => getDisplayGood(side.good).name)
    .join(' & ');
  return label || 'Market';
}

function getTradeVendorName(
  trade: Trade,
  getDisplayGood: (id: GoodId) => ReturnType<typeof getGoodById>
): string {
  const giveLabel = formatVendorGoods(trade.give, getDisplayGood);
  const receiveLabel = formatVendorGoods(trade.receive, getDisplayGood);
  const vendorRole: NightVendorRole | undefined = trade.vendorRole;

  if (vendorRole === 'bundle_payoff') return `${receiveLabel} Appraiser`;
  if (vendorRole === 'reserve_payoff') return `${giveLabel} Buyer`;
  if (vendorRole === 'bridge_vendor') return `${giveLabel} Broker`;
  if (vendorRole === 'recycler') return `${giveLabel} Recycler`;
  if (vendorRole === 'loop_finisher') return `${giveLabel} Finisher`;

  if (trade.role === 'compound_gate') return `${receiveLabel} Appraiser`;
  if (trade.hiddenUntilNight || trade.role === 'tempo_bailout') return `${giveLabel} Reserve`;
  if (trade.give.length > 1) return `${giveLabel} Broker`;
  if (trade.role === 'engine_payoff') return `${giveLabel} Refiner`;
  return `${giveLabel} Trader`;
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
  const tutorialPuzzle = useMemo(() => getBarterTutorialPuzzle(), []);
  const displayGoods = useMemo(() => {
    return new Map(puzzle.goods.map((good) => [good.id, good]));
  }, [puzzle.goods]);
  const getDisplayGood = useCallback(
    (id: GoodId) => displayGoods.get(id) ?? getGoodById(id),
    [displayGoods]
  );
  const tradeLookup = useMemo(() => {
    return new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));
  }, [puzzle.trades]);
  const { width } = useWindowDimensions();
  const isCompact = width < 400;
  const canGoBack = router.canGoBack();
  const dateKey = useMemo(() => getLocalDateKey(previewDate), [previewDate]);
  const dateLabel = useMemo(
    () =>
      previewDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [previewDate]
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
  const [tradeEffect, setTradeEffect] = useState<ActiveTradeFeedback | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [lateWindowOpen, setLateWindowOpen] = useState(false);
  const [lateTransition, setLateTransition] = useState(false);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [newlyAffordableKeys, setNewlyAffordableKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [showTutorial, setShowTutorial] = useState(() => {
    const storage = getStorage();
    return storage?.getItem(tutorialKey) !== '1';
  });
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
  const earlyWindowRemaining = Math.max(0, earlyWindowTrades - tradesUsed);
  const tradingWindowTitle = lateWindowOpen ? 'Night Market' : 'Day Market';
  const tradingWindowCounter = lateWindowOpen
    ? 'Night vendors open'
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

  const visibleTrades = lateWindowOpen ? tradeWaves.wave2 : tradeWaves.wave1;
  const formatRouteSummary = useCallback(
    (route: RouteSummary | null): string => {
      if (!route) return 'No route available';
      return route.tradeKeys
        .map((key) => {
          const trade = tradeLookup.get(key);
          return trade ? formatTrade(trade, getDisplayGood) : key;
        })
        .join('  /  ');
    },
    [getDisplayGood, tradeLookup]
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
  const openingStock = useMemo(() => {
    const entries = puzzle.goods
      .filter((good) => puzzle.inventory[good.id] > 0)
      .map((good) => ({ good: good.id, qty: puzzle.inventory[good.id] }));
    return formatSideList(entries, getDisplayGood);
  }, [getDisplayGood, puzzle.goods, puzzle.inventory]);
  const marketRead = useMemo(
    () => getMarketRead(puzzle, qualityReport, getDisplayGood),
    [getDisplayGood, puzzle, qualityReport]
  );
  const nightRead = useMemo(() => {
    const visibleNightCount = tradeWaves.previewLateTrades.length;
    const hiddenCount = tradeWaves.hiddenTrade ? 1 : 0;
    return `${visibleNightCount} night contracts are readable now${
      hiddenCount ? '; one stall joins when night opens.' : '.'
    }`;
  }, [tradeWaves.hiddenTrade, tradeWaves.previewLateTrades.length]);
  const routeRead = useMemo(() => {
    const firstTrade = tradeHistory[0];
    if (!firstTrade) return 'Reading the stalls';
    const usedHiddenVendor =
      qualityReport.hiddenVendorKey !== null &&
      tradeHistory.some((trade) => tradeKey(trade) === qualityReport.hiddenVendorKey);
    if (usedHiddenVendor) return 'Night pivot recovery';
    const regret = qualityReport.openingRegrets.find(
      (entry) => entry.tradeKey === tradeKey(firstTrade)
    );
    if (!regret || regret.regret === null) return 'Uncharted route';
    if (regret.regret === 0) return 'Par opening';
    if (regret.regret === 1) return '+1 recovery';
    return `+${regret.regret} recovery`;
  }, [qualityReport.hiddenVendorKey, qualityReport.openingRegrets, tradeHistory]);

  const shareText = useMemo(() => {
    const scoreCode =
      gameState === 'won' ? `${tradesUsed}/${puzzle.par}` : `X/${puzzle.maxTrades}`;
    const resultLine =
      gameState === 'won'
        ? `${resultTier} route`
        : gameState === 'lost'
        ? 'Bust'
        : 'Planning';
    const routeEmojis = getShareRouteEmojis(tradeHistory, puzzle, qualityReport);
    return [
      `Barter ${dateKey} ${scoreCode}`,
      `${resultLine} · ${marketName} ${marketEmoji}`,
      `Route: ${routeEmojis} · ${formatTime(elapsedSeconds)}`,
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

  const openingRegretNote = useMemo(() => {
    const firstTrade = tradeHistory[0];
    if (!firstTrade) return 'No opening trade recorded.';
    const firstKey = tradeKey(firstTrade);
    const regret = qualityReport.openingRegrets.find((entry) => entry.tradeKey === firstKey);
    if (!regret || regret.regret === null) return 'Your first trade did not reach a solving line.';
    if (regret.regret === 0) return 'Your first trade stayed on a par route.';
    if (regret.regret === 1) return 'Your first trade found a +1 recovery route.';
    return `Your first trade found a +${regret.regret} recovery route.`;
  }, [qualityReport.openingRegrets, tradeHistory]);

  const dayCloseComparison = useMemo(() => {
    const playerClose =
      tradeHistory.length > 0
        ? applyTradesThroughDepth(puzzle.inventory, tradeHistory, earlyWindowTrades)
        : null;
    const parClose = qualityReport.bestDayCloseInventory;
    return {
      player:
        playerClose === null
          ? 'No day close recorded'
          : formatSideList(inventoryToSideList(playerClose, puzzle), getDisplayGood),
      par:
        parClose === null
          ? 'No par close available'
          : formatSideList(inventoryToSideList(parClose, puzzle), getDisplayGood),
    };
  }, [
    earlyWindowTrades,
    getDisplayGood,
    puzzle,
    qualityReport.bestDayCloseInventory,
    tradeHistory,
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

  const handleOpenTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

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
    [gameState, lateTransition, tradesUsed, puzzle, inventory, tradeEffectAnim]
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
    const key = tradeKey(trade);
    const isNewlyAffordable = newlyAffordableKeys.has(key);
    const vendorName = getTradeVendorName(trade, getDisplayGood);
    const showMetaRow = locked || isNewlyAffordable;
    let buttonLabel = locked ? 'Night' : 'Trade';
    if (gameState !== 'playing') {
      buttonLabel = 'Closed';
    } else if (!locked && missing.length > 0) {
      buttonLabel = `Need ${missing
        .map((side) => `${side.qty} ${getDisplayGood(side.good).emoji}`)
        .join(' + ')}`;
    }
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
          isNewlyAffordable && styles.tradeCardNewlyAffordable,
          lastTradeIndex === tradeIndex && styles.tradeCardFlash,
          locked && styles.tradeCardLocked,
          isCompact && styles.tradeCardCompact,
          isMarinerMarket && styles.tradeCardMariner,
          tradeCardMotion,
        ]}
      >
        <View style={styles.tradeTopRow}>
          <Text style={styles.tradeVendorName}>{vendorName}</Text>
          {showMetaRow && (
            <View style={styles.tradeMetaRow}>
              {locked && <Text style={styles.tradeLockedText}>Opens at night</Text>}
              {isNewlyAffordable && <Text style={styles.tradeNewText}>Newly open</Text>}
            </View>
          )}
        </View>
        {missing.length > 0 && !locked && (
          <View style={styles.tradeMetaRow}>
            <Text style={styles.tradeMissingText}>
              Missing {missing.map((side) => `${side.qty} ${getDisplayGood(side.good).emoji}`).join(', ')}
            </Text>
          </View>
        )}
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
      </Animated.View>
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
                  const changed = tradeEffect?.changedGoods.includes(good.id) ?? false;
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
                        changed && styles.inventoryCardChanged,
                        inventoryPulseStyle,
                      ]}
                    >
                      <Text style={[styles.inventoryEmoji, isCompact && styles.inventoryEmojiCompact]}>
                        {good.emoji}
                      </Text>
                      <Text style={[styles.inventoryCount, isCompact && styles.inventoryCountCompact]}>
                        {count}
                      </Text>
                    </Animated.View>
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
              </Text>
              <Text style={styles.marketRead}>Today's read: {marketRead}</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.helpButton,
                  styles.introHelpButton,
                  pressed && styles.helpButtonPressed,
                ]}
                onPress={handleOpenTutorial}
              >
                <Text style={styles.helpButtonText}>How to play</Text>
              </Pressable>
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
                  The night market opens shortly.
                </Text>
              </Animated.View>
            )}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {lateWindowOpen ? 'Night Market' : 'Day Market'}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {lateWindowOpen
                  ? 'Spend the ingredients you prepared.'
                  : `Make the first ${earlyWindowTrades} trades count.`}
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
                  <Text style={styles.sectionTitle}>Night Market</Text>
                  <Text style={styles.sectionSubtitle}>
                    Plan around these now. They open after trade {earlyWindowTrades}.
                  </Text>
                </View>
                <View style={[styles.tradeList, isCompact && styles.tradeListCompact]}>
                  {tradeWaves.previewLateTrades.map((trade) => renderTradeCard(trade, true))}
                  {tradeWaves.hiddenTrade && (
                    <View style={styles.bonusVendorCard}>
                      <Text style={styles.bonusVendorTitle}>A night vendor is setting up</Text>
                      <Text style={styles.bonusVendorBody}>
                        {marketIdentity.hiddenStall}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

          </View>
        </ScrollView>

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
                <Text style={styles.marketReadBoxTitle}>Today's read</Text>
                <Text style={styles.marketReadBoxText}>{marketRead}</Text>
                <Text style={styles.marketReadBoxText}>Start: {openingStock}</Text>
                <Text style={styles.marketReadBoxText}>
                  Goal: {goalShort} in par {puzzle.par}. {nightRead}
                </Text>
                <Text style={styles.marketReadBoxText}>
                  Use the first {earlyWindowTrades} trades in the day market, then close in at the night market.
                </Text>
              </View>
              <Text style={styles.tutorialModalSectionTitle}>First pattern</Text>
              <Text style={styles.tutorialModalBody}>
                Day trades create ingredients. Night Market trades reward balanced goods, especially pairs.
              </Text>
              <View style={styles.tutorialModalSteps}>
                {tutorialPuzzle.solution.map((trade, index) => (
                  <Text key={`tutorial-${index}`} style={styles.tutorialStepText}>
                    {index + 1}. {formatTrade(trade)}
                  </Text>
                ))}
              </View>
              <Text style={styles.tutorialModalHint}>
                Read the visible Night Market before spending your Day Market trades.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.tutorialButton,
                  pressed && styles.tutorialButtonPressed,
                ]}
                onPress={handleDismissTutorial}
              >
                <Text style={styles.tutorialButtonText}>
                  {tradesUsed === 0 && gameState === 'playing' ? 'Start day market' : 'Back to market'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

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
              <Text style={styles.resultRead}>
                {marketName} · {routeRead}
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
                <Text style={styles.autopsyInsight}>{openingRegretNote}</Text>
                <Text style={styles.autopsyLabel}>Day Market close</Text>
                <Text style={styles.autopsyRoute}>You: {dayCloseComparison.player}</Text>
                <Text style={styles.autopsyRoute}>Par: {dayCloseComparison.par}</Text>
                <Text style={styles.autopsyLabel}>Your route</Text>
                <Text style={styles.autopsyRoute}>
                  {tradeHistory.length > 0
                    ? tradeHistory.map((trade) => formatTrade(trade, getDisplayGood)).join('  /  ')
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
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : '#f7f2ea',
    borderRadius: BorderRadius.md,
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
  inventoryCardChanged: {
    borderColor: screenAccent.main,
    backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : '#fff7df',
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
  tradeListBeforeBonus: {
    marginBottom: Spacing.md,
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
    flexShrink: 1,
    color: inkMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  tradeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
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
  tradeInfoPassive: {
    pointerEvents: 'none',
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
