import {
  canAfford,
  enumerateRoutes,
  legalTradesForStep,
  summarizeRoute,
  tradeKey,
} from './engine.ts';
import type { BarterPuzzle, BarterQualityReport, RouteSummary, Trade } from './types.ts';

const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 11;

function uniqueCount(values: string[]): number {
  return new Set(values).size;
}

function hasDuplicateTradeKeys(trades: Trade[]): boolean {
  const keys = trades.map(tradeKey);
  return uniqueCount(keys) !== keys.length;
}

function hasSelfTrade(trade: Trade): boolean {
  const giveGoods = new Set(trade.give.map((side) => side.good));
  return trade.receive.some((side) => giveGoods.has(side.good));
}

function routePathKey(route: RouteSummary): string {
  return route.tradeKeys.join('|');
}

function pickAlternate(routes: RouteSummary[], best: RouteSummary | null): RouteSummary | null {
  if (!best) return routes[0] ?? null;
  return (
    routes.find((route) => route.line !== best.line) ??
    routes.find(
      (route) =>
        route.firstTradeKey !== best.firstTradeKey ||
        route.line !== best.line ||
        routePathKey(route) !== routePathKey(best)
    ) ?? routes.find((route) => routePathKey(route) !== routePathKey(best)) ?? null
  );
}

function buildInsight(best: RouteSummary | null, alternate: RouteSummary | null): string {
  if (!best) return 'No route reached the goal.';
  if (best.usesCompound) {
    return 'The bundle trade is the hinge: early setup goods become late goal progress only when paired.';
  }
  if (alternate?.usesCompound) {
    return 'The alternate route spends an early setup turn to make the bundle trade efficient later.';
  }
  return 'The best routes keep late-window ingredients balanced instead of overproducing one good.';
}

function countMeaningfulOptionsByDepth(routes: RouteSummary[], maxDepth: number): number[] {
  const counts: number[] = [];
  for (let depth = 0; depth < maxDepth; depth++) {
    const options = new Set<string>();
    routes.forEach((route) => {
      const next = route.tradeKeys[depth];
      if (next) options.add(next);
    });
    counts.push(options.size);
  }
  return counts;
}

export function analyzeBarterPuzzle(puzzle: BarterPuzzle): BarterQualityReport {
  const violations: string[] = [];
  const { routes } = enumerateRoutes(puzzle);
  const sortedRoutes = routes.slice().sort((a, b) => a.steps - b.steps);
  const shortestPathLength = sortedRoutes[0]?.steps ?? null;
  const nearRoutes =
    shortestPathLength === null
      ? []
      : sortedRoutes.filter((route) => route.steps <= shortestPathLength + 1);
  const nearSummaries = nearRoutes.map(summarizeRoute);
  const bestRoute = nearSummaries[0] ?? null;
  const alternateRoute = pickAlternate(nearSummaries, bestRoute);
  const startTrades = legalTradesForStep(puzzle, 0).filter((trade) =>
    canAfford(puzzle.inventory, trade)
  );
  const firstBest = new Map<string, number>();
  sortedRoutes.forEach((route) => {
    const current = firstBest.get(route.firstTradeKey);
    if (current === undefined || route.steps < current) {
      firstBest.set(route.firstTradeKey, route.steps);
    }
  });
  const bestLength = shortestPathLength ?? Infinity;
  const startKeys = startTrades.map(tradeKey);
  const deadEarlyMoveCount = startKeys.filter((key) => !firstBest.has(key)).length;
  const regrets = startKeys
    .map((key) => firstBest.get(key))
    .filter((value): value is number => value !== undefined)
    .map((value) => value - bestLength);
  const maxEarlyRegret = regrets.length ? Math.max(...regrets) : 0;
  const nearFirstMoveCount = uniqueCount(nearRoutes.map((route) => route.firstTradeKey));
  const nearPathCount = uniqueCount(nearSummaries.map(routePathKey));
  const tempoRouteCount = nearSummaries.filter((route) => route.line === 'tempo').length;
  const engineRouteCount = nearSummaries.filter((route) => route.line === 'engine').length;
  const compoundOnNearOptimalRoute = nearRoutes.some((route) => route.usesCompound);
  const meaningfulOptionsByDepth = countMeaningfulOptionsByDepth(nearSummaries, 3);

  if (shortestPathLength === null) {
    violations.push('No route reaches the goal.');
  } else {
    if (shortestPathLength < MIN_PATH_LENGTH || shortestPathLength > MAX_PATH_LENGTH) {
      violations.push(`Shortest route must be ${MIN_PATH_LENGTH}-${MAX_PATH_LENGTH} trades.`);
    }
    if (puzzle.par !== shortestPathLength) {
      violations.push('Puzzle par must equal the shortest route length.');
    }
  }
  if (nearPathCount < 2) violations.push('At least two near-optimal routes are required.');
  if (nearFirstMoveCount < 2) violations.push('At least two near-optimal first moves are required.');
  if (!compoundOnNearOptimalRoute) {
    violations.push('At least one near-optimal route must use a compound trade.');
  }
  if (tempoRouteCount < 1) violations.push('At least one near-optimal tempo route is required.');
  if (engineRouteCount < 1) violations.push('At least one near-optimal engine route is required.');
  if (startTrades.length < 3) violations.push('At least three starting trades must be affordable.');
  if (meaningfulOptionsByDepth.some((count) => count < 2)) {
    violations.push('Early near-optimal route states need at least two meaningful options.');
  }
  if (deadEarlyMoveCount > 0) violations.push('Affordable early moves must not be dead ends.');
  if (maxEarlyRegret > 2) violations.push('Affordable early moves must stay within two trades of optimal.');
  if (puzzle.trades.some(hasSelfTrade)) violations.push('Trades may not give and receive the same good.');
  if (hasDuplicateTradeKeys(puzzle.trades)) violations.push('Trade list contains duplicate trades.');
  if (!nearRoutes.some((route) => route.roles.has('engine_payoff'))) {
    violations.push('A near-optimal route must reach an engine payoff.');
  }
  if (!nearRoutes.some((route) => route.roles.has('tempo_bailout'))) {
    violations.push('A near-optimal route must reach a tempo bailout.');
  }

  return {
    accepted: violations.length === 0,
    violations,
    shortestPathLength,
    nearOptimalRouteCount: nearPathCount,
    nearOptimalFirstMoveCount: nearFirstMoveCount,
    compoundOnNearOptimalRoute,
    tempoRouteCount,
    engineRouteCount,
    startAffordableCount: startTrades.length,
    meaningfulOptionsByDepth,
    maxEarlyRegret,
    deadEarlyMoveCount,
    bestRoute,
    alternateRoute,
    strategicInsight: buildInsight(bestRoute, alternateRoute),
  };
}

export function validateBarterQuality(puzzle: BarterPuzzle): BarterQualityReport {
  return analyzeBarterPuzzle(puzzle);
}
