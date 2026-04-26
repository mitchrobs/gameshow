import { GOOD_INDEX, GOODS, createEmptyInventory } from './goods.ts';
import type {
  BarterGoal,
  BarterPuzzle,
  GoodId,
  Inventory,
  RouteSummary,
  StrategyLineId,
  Trade,
  TradeRole,
  TradeSide,
  TradeWindow,
} from './types.ts';

const MAX_COUNT = 200;

function normalizeSides(sides: TradeSide[]): TradeSide[] {
  const totals = new Map<GoodId, number>();
  sides.forEach((side) => {
    totals.set(side.good, (totals.get(side.good) ?? 0) + side.qty);
  });
  return Array.from(totals.entries())
    .map(([good, qty]) => ({ good, qty }))
    .filter((side) => side.qty > 0)
    .sort((a, b) => {
      const diff = (GOOD_INDEX.get(a.good) ?? 0) - (GOOD_INDEX.get(b.good) ?? 0);
      return diff === 0 ? a.qty - b.qty : diff;
    });
}

export function canonicalizeTrade(trade: Trade): Trade {
  return {
    ...trade,
    give: normalizeSides(trade.give),
    receive: normalizeSides(trade.receive),
  };
}

export function tradeKey(trade: Trade): string {
  const giveKey = normalizeSides(trade.give)
    .map((side) => `${side.qty}${side.good}`)
    .join('+');
  const receiveKey = normalizeSides(trade.receive)
    .map((side) => `${side.qty}${side.good}`)
    .join('+');
  return `${giveKey}->${receiveKey}`;
}

export function canAfford(inv: Inventory, trade: Trade): boolean {
  return trade.give.every((side) => inv[side.good] >= side.qty);
}

export function applyTrade(inv: Inventory, trade: Trade): Inventory {
  const next = { ...inv };
  trade.give.forEach((side) => {
    next[side.good] -= side.qty;
  });
  trade.receive.forEach((side) => {
    next[side.good] += side.qty;
  });
  GOODS.forEach((good) => {
    next[good.id] = Math.min(MAX_COUNT, next[good.id]);
  });
  return next;
}

export function inventoryKey(inv: Inventory, goods: GoodId[]): string {
  return goods.map((id) => inv[id]).join(',');
}

export function legalTradesForStep(puzzle: BarterPuzzle, step: number): Trade[] {
  const inEarly = step < puzzle.earlyWindowTrades;
  return puzzle.trades.filter((trade) =>
    inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
  );
}

export function hasGoal(inv: Inventory, goal: BarterGoal): boolean {
  return inv[goal.good] >= goal.qty;
}

export function missingForTrade(inv: Inventory, trade: Trade): TradeSide[] {
  return trade.give
    .map((side) => ({ good: side.good, qty: Math.max(0, side.qty - inv[side.good]) }))
    .filter((side) => side.qty > 0);
}

export function getInventoryDelta(before: Inventory, after: Inventory): TradeSide[] {
  return GOODS.map((good) => ({
    good: good.id,
    qty: after[good.id] - before[good.id],
  })).filter((side) => side.qty !== 0);
}

export interface TradePreview {
  canTrade: boolean;
  missing: TradeSide[];
  nextInventory: Inventory;
  delta: TradeSide[];
  newlyAffordableTradeKeys: string[];
}

export function previewTrade(
  puzzle: BarterPuzzle,
  inventory: Inventory,
  trade: Trade,
  step: number
): TradePreview {
  const missing = missingForTrade(inventory, trade);
  const canTrade = missing.length === 0;
  const nextInventory = canTrade ? applyTrade(inventory, trade) : { ...inventory };
  const nextStep = step + 1;
  const currentAffordable = new Set(
    legalTradesForStep(puzzle, step)
      .filter((candidate) => canAfford(inventory, candidate))
      .map(tradeKey)
  );
  const newlyAffordableTradeKeys = canTrade
    ? legalTradesForStep(puzzle, nextStep)
        .filter((candidate) => canAfford(nextInventory, candidate))
        .map(tradeKey)
        .filter((key) => !currentAffordable.has(key))
    : [];

  return {
    canTrade,
    missing,
    nextInventory,
    delta: getInventoryDelta(inventory, nextInventory),
    newlyAffordableTradeKeys,
  };
}

export interface RouteResult {
  trades: Trade[];
  steps: number;
  firstTradeKey: string;
  usesCompound: boolean;
  roles: Set<TradeRole>;
}

export interface RouteSearchResult {
  routes: RouteResult[];
  capped: boolean;
}

function routeLine(roles: Set<TradeRole>): StrategyLineId {
  if (roles.has('tempo_bailout')) return 'tempo';
  if (roles.has('engine_payoff') || roles.has('engine_setup')) return 'engine';
  if (roles.has('tempo')) return 'tempo';
  return 'shared';
}

export function summarizeRoute(route: RouteResult): RouteSummary {
  return {
    steps: route.steps,
    tradeKeys: route.trades.map(tradeKey),
    firstTradeKey: route.firstTradeKey,
    roles: Array.from(route.roles),
    line: routeLine(route.roles),
    usesCompound: route.usesCompound,
  };
}

export function enumerateRoutes(
  puzzle: BarterPuzzle,
  maxDepth: number = puzzle.maxTrades,
  cap = 1200
): RouteSearchResult {
  const goods = puzzle.goods.map((good) => good.id);
  const start = createEmptyInventory();
  GOODS.forEach((good) => {
    start[good.id] = puzzle.inventory[good.id];
  });

  let frontier: Array<{
    inv: Inventory;
    trades: Trade[];
    firstTradeKey: string | null;
    usesCompound: boolean;
    roles: Set<TradeRole>;
  }> = [
    {
      inv: start,
      trades: [],
      firstTradeKey: null,
      usesCompound: false,
      roles: new Set(),
    },
  ];
  const routes: RouteResult[] = [];
  let capped = false;

  for (let step = 0; step < maxDepth; step++) {
    const nextFrontier: typeof frontier = [];
    const seen = new Set<string>();
    for (const state of frontier) {
      for (const trade of legalTradesForStep(puzzle, step)) {
        if (!canAfford(state.inv, trade)) continue;
        const nextInv = applyTrade(state.inv, trade);
        const key = tradeKey(trade);
        const roles = new Set(state.roles);
        if (trade.role) roles.add(trade.role);
        const trades = [...state.trades, trade];
        const firstTradeKey = state.firstTradeKey ?? key;
        const usesCompound = state.usesCompound || trade.give.length > 1;

        if (hasGoal(nextInv, puzzle.goal)) {
          routes.push({
            trades,
            steps: step + 1,
            firstTradeKey,
            usesCompound,
            roles,
          });
          if (routes.length >= cap) {
            capped = true;
            return { routes, capped };
          }
          continue;
        }

        if (step + 1 >= maxDepth) continue;
        const stateKey = [
          step + 1,
          firstTradeKey,
          usesCompound ? 'compound' : 'simple',
          Array.from(roles).sort().join('.'),
          inventoryKey(nextInv, goods),
        ].join('|');
        if (seen.has(stateKey)) continue;
        seen.add(stateKey);
        nextFrontier.push({
          inv: nextInv,
          trades,
          firstTradeKey,
          usesCompound,
          roles,
        });
      }
    }

    frontier = nextFrontier;
    if (frontier.length === 0) break;
    if (frontier.length > cap * 4) {
      frontier = frontier.slice(0, cap * 4);
      capped = true;
    }
  }

  return { routes, capped };
}

export function formatTrade(trade: Trade, formatGood: (good: GoodId) => string): string {
  const give = normalizeSides(trade.give)
    .map((side) => `${side.qty} ${formatGood(side.good)}`)
    .join(' + ');
  const receive = normalizeSides(trade.receive)
    .map((side) => `${side.qty} ${formatGood(side.good)}`)
    .join(' + ');
  return `${give} -> ${receive}`;
}
