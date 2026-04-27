import { canAfford, missingForTrade, tradeKey } from './engine.ts';
import type { BarterPuzzle, GoodId, Inventory, Trade, TradeSide } from './types.ts';

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
          : 'This contract can be used after the Day Market closes.',
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
      detail: 'Missing required goods.',
      missing,
    };
  }

  return {
    canExecute: true,
    buttonLabel: 'Trade',
    detail: 'Ready to trade.',
    missing: [],
  };
}
