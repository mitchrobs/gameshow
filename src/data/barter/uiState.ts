import { canAfford, missingForTrade, tradeKey } from './engine.ts';
import type {
  BarterPuzzle,
  BarterQualityReport,
  GoodId,
  Inventory,
  PlayerSolveFeel,
  Trade,
  TradeSide,
} from './types.ts';

export type BarterMarketTab = 'day' | 'night';
export type TradeLockReason = 'night_locked' | 'day_closed' | null;

export interface MarketTradeEntry {
  trade: Trade;
  tradeIndex: number;
  key: string;
  locked: boolean;
  lockReason: TradeLockReason;
  matchesSelectedGood: boolean;
}

export interface TradeActionState {
  canExecute: boolean;
  buttonLabel: string;
  detail: string;
  missing: TradeSide[];
}

export type BarterOutcomeGameState = 'playing' | 'won' | 'lost';

export interface BarterOutcome {
  title: string;
  shareLabel: string;
  subtitle: string;
  detail: string;
  tone: 'perfect' | 'clean' | 'close' | 'lost' | 'planning';
  routeLabel: string | null;
}

type OutcomeQualityRead = Pick<BarterQualityReport, 'hiddenVendorKey' | 'playerSolveFeel'>;

const SOLVE_FEEL_OUTCOMES: Record<PlayerSolveFeel, { label: string; note: string }> = {
  liquefy_heap: {
    label: 'Heap Liquidated',
    note: 'Awkward starting stock turned into useful night goods.',
  },
  protect_coupon: {
    label: 'Key Protected',
    note: 'The flexible good stayed alive long enough to pay off.',
  },
  carry_pair: {
    label: 'Pair Carried',
    note: 'A matched pair reached Night and unlocked the better trade.',
  },
  ugly_liquidity: {
    label: 'Ugly Trade',
    note: 'The odd-looking move created the liquid route.',
  },
  stop_production: {
    label: 'Stopped Early',
    note: 'The route stopped producing before extra stock became cleanup.',
  },
  visible_night_target: {
    label: 'Night Read',
    note: 'The visible Night Market told you what to prepare.',
  },
  hidden_recovery: {
    label: 'Recovery Read',
    note: 'The route stayed alive around the hidden night option.',
  },
  split_lanes: {
    label: 'Split Lane',
    note: 'One pipeline did the work while the other acted as a bridge.',
  },
  compression_bundle: {
    label: 'Bundle Route',
    note: 'The compound bundle compressed the cash-out.',
  },
  delayed_key: {
    label: 'Delayed Key',
    note: 'A quiet good stayed useful until Night made its value clear.',
  },
  reserve_fund: {
    label: 'Reserve Held',
    note: 'One reserve good stayed available for the late bridge.',
  },
  one_big_cashout: {
    label: 'Big Cash-Out',
    note: 'The route built toward one large payout instead of nibbling early.',
  },
};

function routeOutcome(
  qualityReport: OutcomeQualityRead | null | undefined,
  tradeHistory: Trade[] | undefined
): { label: string; note: string } | null {
  if (!qualityReport) return null;

  const usedHiddenVendor =
    qualityReport.hiddenVendorKey !== null &&
    Boolean(tradeHistory?.some((trade) => tradeKey(trade) === qualityReport.hiddenVendorKey));

  if (usedHiddenVendor) {
    return {
      label: 'Hidden Save',
      note: 'A night-only stall helped keep the route alive.',
    };
  }

  return qualityReport.playerSolveFeel
    ? SOLVE_FEEL_OUTCOMES[qualityReport.playerSolveFeel]
    : null;
}

export function getBarterOutcome(
  puzzle: BarterPuzzle,
  options: {
    gameState: BarterOutcomeGameState;
    tradesUsed: number;
    qualityReport?: OutcomeQualityRead | null;
    tradeHistory?: Trade[];
  }
): BarterOutcome {
  const route = routeOutcome(options.qualityReport, options.tradeHistory);

  if (options.gameState === 'lost') {
    return {
      title: 'Overtraded',
      shareLabel: 'Overtraded',
      subtitle: 'The market closed before the goal.',
      detail: `Goal was ${puzzle.goal.qty} goods in ${puzzle.maxTrades} trades.`,
      tone: 'lost',
      routeLabel: route?.label ?? null,
    };
  }

  if (options.gameState !== 'won') {
    return {
      title: 'Planning',
      shareLabel: 'Planning',
      subtitle: 'The route is still open.',
      detail: `Par is ${puzzle.par}; the market closes at ${puzzle.maxTrades} trades.`,
      tone: 'planning',
      routeLabel: route?.label ?? null,
    };
  }

  const result =
    options.tradesUsed <= puzzle.par
      ? {
          title: 'Perfect Trade',
          shareLabel: 'Perfect Trade',
          subtitle: 'Solved at par. Every move paid.',
          tone: 'perfect' as const,
        }
      : options.tradesUsed <= puzzle.par + 1
        ? {
            title: 'Clean Profit',
            shareLabel: 'Clean Profit',
            subtitle: 'One trade over par, still controlled.',
            tone: 'clean' as const,
          }
        : {
            title: 'Close Call',
            shareLabel: 'Close Call',
            subtitle: 'Solved on the final cushion.',
            tone: 'close' as const,
          };

  return {
    ...result,
    detail: route?.note ?? `Collected the goal in ${options.tradesUsed} trades.`,
    routeLabel: route?.label ?? null,
  };
}

export function tradeUsesGood(trade: Trade, good: GoodId | null): boolean {
  if (!good) return false;
  return trade.give.some((side) => side.good === good);
}

export function getTradeOfferLabel(trade: Trade, goalGood: GoodId): string {
  const givesMultipleGoods = trade.give.length > 1;
  const receivesMultipleGoods = trade.receive.length > 1;
  const givesQty = trade.give.reduce((sum, side) => sum + side.qty, 0);
  const receivesQty = trade.receive.reduce((sum, side) => sum + side.qty, 0);
  const receivesGoal = trade.receive.some((side) => side.good === goalGood);

  if (receivesGoal) return 'Cash in';
  if (givesMultipleGoods && receivesMultipleGoods) return 'Blend';
  if (givesMultipleGoods) return 'Combine';
  if (receivesMultipleGoods) return 'Split';
  if (receivesQty > givesQty) return 'Stretch';
  if (givesQty > receivesQty) return 'Condense';
  return 'Exchange';
}

export function splitMarketTrades(puzzle: BarterPuzzle): {
  dayTrades: Trade[];
  nightTrades: Trade[];
  hiddenNightTrade: Trade | null;
  previewNightTrades: Trade[];
} {
  const dayTrades = puzzle.trades.filter((trade) => (trade.window ?? 'early') !== 'late');
  const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
  const hiddenNightTrade = nightTrades.find((trade) => trade.hiddenUntilNight) ?? null;
  const previewNightTrades = hiddenNightTrade
    ? nightTrades.filter((trade) => trade !== hiddenNightTrade)
    : nightTrades;

  return { dayTrades, nightTrades, hiddenNightTrade, previewNightTrades };
}

export function getMarketTradeEntries(
  puzzle: BarterPuzzle,
  activeTab: BarterMarketTab,
  lateWindowOpen: boolean,
  selectedGood: GoodId | null
): MarketTradeEntry[] {
  const { dayTrades, nightTrades, previewNightTrades } = splitMarketTrades(puzzle);
  const trades =
    activeTab === 'day'
      ? dayTrades
      : lateWindowOpen
        ? nightTrades
        : previewNightTrades;
  const locked = activeTab === 'night' ? !lateWindowOpen : lateWindowOpen;
  const lockReason: TradeLockReason =
    activeTab === 'night' && !lateWindowOpen
      ? 'night_locked'
      : activeTab === 'day' && lateWindowOpen
        ? 'day_closed'
        : null;

  return trades.map((trade) => ({
    trade,
    tradeIndex: puzzle.trades.indexOf(trade),
    key: tradeKey(trade),
    locked,
    lockReason,
    matchesSelectedGood: tradeUsesGood(trade, selectedGood),
  }));
}

export function shouldShowHiddenNightPlaceholder(
  puzzle: BarterPuzzle,
  activeTab: BarterMarketTab,
  lateWindowOpen: boolean
): boolean {
  return activeTab === 'night' && !lateWindowOpen && splitMarketTrades(puzzle).hiddenNightTrade !== null;
}

export function sortMarketTradeEntries(
  entries: MarketTradeEntry[],
  inventory: Inventory,
  selectedGood: GoodId | null
): MarketTradeEntry[] {
  if (!selectedGood) return entries;

  return [...entries].sort((a, b) => {
    if (a.matchesSelectedGood !== b.matchesSelectedGood) {
      return a.matchesSelectedGood ? -1 : 1;
    }

    const aAffordable = !a.locked && canAfford(inventory, a.trade);
    const bAffordable = !b.locked && canAfford(inventory, b.trade);
    if (aAffordable !== bAffordable) return aAffordable ? -1 : 1;

    return a.tradeIndex - b.tradeIndex;
  });
}

export function getDefaultSelectedTradeKey(
  entries: MarketTradeEntry[],
  inventory: Inventory,
  currentKey: string | null
): string | null {
  if (currentKey && entries.some((entry) => entry.key === currentKey)) return currentKey;

  const firstExecutable = entries.find((entry) => !entry.locked && canAfford(inventory, entry.trade));
  return firstExecutable?.key ?? entries[0]?.key ?? null;
}

export function getTradeActionState(
  entry: MarketTradeEntry | null,
  inventory: Inventory,
  options: {
    gameState: 'playing' | 'won' | 'lost';
    lateTransition: boolean;
    tradesUsed: number;
    maxTrades: number;
  }
): TradeActionState {
  if (!entry) {
    return {
      canExecute: false,
      buttonLabel: 'Choose trade',
      detail: 'Select a market row.',
      missing: [],
    };
  }

  const missing = missingForTrade(inventory, entry.trade);

  if (entry.locked) {
    return {
      canExecute: false,
      buttonLabel: entry.lockReason === 'day_closed' ? 'Day done' : 'Opens at night',
      detail:
        entry.lockReason === 'day_closed'
          ? 'Day Market trades are closed.'
          : 'You can use this after the Day Market closes.',
      missing,
    };
  }

  if (options.gameState !== 'playing') {
    return {
      canExecute: false,
      buttonLabel: 'Closed',
      detail: 'This market is closed.',
      missing,
    };
  }

  if (options.lateTransition) {
    return {
      canExecute: false,
      buttonLabel: 'Opening...',
      detail: 'Vendors are moving into place.',
      missing,
    };
  }

  if (options.tradesUsed >= options.maxTrades) {
    return {
      canExecute: false,
      buttonLabel: 'Out of trades',
      detail: 'No trades remain.',
      missing,
    };
  }

  if (missing.length > 0) {
    return {
      canExecute: false,
      buttonLabel: 'Need goods',
      detail: 'You do not have the goods for this trade yet.',
      missing,
    };
  }

  return {
    canExecute: true,
    buttonLabel: 'Trade',
    detail: 'Ready.',
    missing: [],
  };
}
