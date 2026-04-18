import {
  applyTrade,
  canAfford,
  enumerateRoutes,
  inventoryKey,
  legalTradesForStep,
  summarizeRoute,
  tradeKey,
  type RouteResult,
} from './engine.ts';
import type {
  BarterPuzzle,
  BarterQualityReport,
  BarterTopology,
  GoodId,
  HiddenVendorPurpose,
  OpeningRegret,
  RoutePersonality,
  RouteSummary,
  Trade,
} from './types.ts';

const MIN_PATH_LENGTH = 10;
const MAX_PATH_LENGTH = 14;

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

function routeIdentityKey(route: RouteSummary): string {
  const roles = route.roles.slice().sort().join('+');
  return [route.line, roles, route.usesCompound ? 'compound' : 'linear'].join('|');
}

function pickAlternate(routes: RouteSummary[], best: RouteSummary | null): RouteSummary | null {
  if (!best) return routes[0] ?? null;
  const bestIdentity = routeIdentityKey(best);
  return (
    routes.find((route) => routeIdentityKey(route) !== bestIdentity && route.line !== best.line) ??
    routes.find(
      (route) =>
        routeIdentityKey(route) !== bestIdentity ||
        route.firstTradeKey !== best.firstTradeKey ||
        route.line !== best.line ||
        routePathKey(route) !== routePathKey(best)
    ) ?? routes.find((route) => routePathKey(route) !== routePathKey(best)) ?? null
  );
}

function buildInsight(puzzle: BarterPuzzle, best: RouteSummary | null, alternate: RouteSummary | null): string {
  if (!best) return 'No route reached the goal.';
  switch (puzzle.topology ?? puzzle.archetype) {
    case 'catalyst_debt':
      return 'The hard part is borrowing against a scarce catalyst without starving the night-market pairs.';
    case 'scarce_bridge':
      return 'One bridge good is pulled in two directions; spending it too early leaves a longer recovery route.';
    case 'tempo_discount':
      return 'The quick-looking trades work only if they still leave enough matched goods for the final bundle.';
    case 'night_pivot':
      return 'The hidden night vendor is a pivot for recovery, but the clean route prepares enough balance before night.';
    case 'balanced_pair':
      return 'The paired trade is the hinge: day-market goods become progress only when the night market sees a match.';
    case 'delayed_multiplier':
      return 'The setup looks slow, but the better night multiplier repays the delay.';
    case 'split_pipeline':
      return 'The clean route commits to one pipeline, then uses the other only as a bridge.';
    case 'compression_route':
      return 'The bundle is the turn saver: preparing both halves makes the compound cash-out efficient.';
    case 'overproduction_trap':
      return 'Extra ingredients can be a trap; par comes from stopping production once the bundle is balanced.';
    default:
      if (alternate?.usesCompound) {
        return 'The alternate route spends a day-market trade to make the night-market pairing efficient later.';
      }
      return 'The best routes keep the bottleneck balanced instead of overproducing one good.';
  }
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

function routeHasTrade(route: RouteResult, key: string): boolean {
  return route.trades.some((trade) => tradeKey(trade) === key);
}

function findBottleneckGood(puzzle: BarterPuzzle): GoodId | null {
  const lateTrades = puzzle.trades.filter((trade) => trade.window === 'late');
  const roleByGood = new Map<GoodId, Set<string>>();
  lateTrades.forEach((trade) => {
    trade.give.forEach((side) => {
      if (side.good === puzzle.goal.good) return;
      const roles = roleByGood.get(side.good) ?? new Set<string>();
      roles.add(trade.role ?? tradeKey(trade));
      roleByGood.set(side.good, roles);
    });
  });
  const candidates = Array.from(roleByGood.entries()).filter(([, roles]) => roles.size >= 2);
  return candidates[0]?.[0] ?? null;
}

function routeInventoryAt(puzzle: BarterPuzzle, route: RouteResult, depth: number): string {
  let inv = { ...puzzle.inventory };
  for (let index = 0; index < Math.min(depth, route.trades.length); index++) {
    inv = applyTrade(inv, route.trades[index]);
  }
  return inventoryKey(inv, puzzle.goods.map((good) => good.id));
}

function findRouteDivergenceDepth(
  puzzle: BarterPuzzle,
  routes: RouteResult[],
  maxDepth: number
): number | null {
  for (let left = 0; left < routes.length; left++) {
    const leftSummary = summarizeRoute(routes[left]);
    for (let right = left + 1; right < routes.length; right++) {
      const rightSummary = summarizeRoute(routes[right]);
      if (routeIdentityKey(leftSummary) === routeIdentityKey(rightSummary)) continue;
      for (let depth = 1; depth <= maxDepth; depth++) {
        if (routeInventoryAt(puzzle, routes[left], depth) !== routeInventoryAt(puzzle, routes[right], depth)) {
          return depth;
        }
      }
    }
  }
  return null;
}

function getOpeningRegrets(
  startKeys: string[],
  firstBest: Map<string, number>,
  bestLength: number
): OpeningRegret[] {
  return startKeys.map((key) => {
    const best = firstBest.get(key) ?? null;
    const regret = best === null ? null : best - bestLength;
    return {
      tradeKey: key,
      bestLength: best,
      regret,
      nearOptimal: regret !== null && regret <= 1,
    };
  });
}

function hasInvalidQuantities(trade: Trade): boolean {
  return [...trade.give, ...trade.receive].some((side) => !Number.isFinite(side.qty) || side.qty <= 0);
}

function classifyRoutePersonality(route: RouteSummary, topology?: BarterTopology): RoutePersonality {
  if (route.roles.includes('tempo_bailout')) return 'recovery';
  if (topology === 'split_pipeline') return 'split';
  if (topology === 'compression_route' && route.usesCompound) return 'compression';
  if (topology === 'overproduction_trap' && route.roles.includes('variant')) return 'overpay';
  if (route.line === 'engine') return 'engine';
  if (route.line === 'tempo') return 'tempo';
  return 'balanced';
}

function routeDistance(best: RouteSummary | null, alternate: RouteSummary | null): number {
  if (!best || !alternate) return 0;
  let distance = 0;
  if (best.firstTradeKey !== alternate.firstTradeKey) distance += 1;
  if (best.line !== alternate.line) distance += 1;
  if (best.usesCompound !== alternate.usesCompound) distance += 1;
  for (let index = 0; index < Math.min(4, best.tradeKeys.length, alternate.tradeKeys.length); index++) {
    if (best.tradeKeys[index] !== alternate.tradeKeys[index]) distance += 1;
  }
  const bestRoles = best.roles.slice().sort().join('|');
  const alternateRoles = alternate.roles.slice().sort().join('|');
  if (bestRoles !== alternateRoles) distance += 1;
  return distance;
}

function compressionValue(routes: RouteResult[], shortestPathLength: number | null): number {
  if (shortestPathLength === null) return 0;
  const nonCompoundRoutes = routes.filter((route) => !route.trades.some((trade) => trade.give.length > 1));
  if (nonCompoundRoutes.length === 0) return 1;
  const shortestWithoutCompound = Math.min(...nonCompoundRoutes.map((route) => route.steps));
  return Math.max(0, shortestWithoutCompound - shortestPathLength);
}

function hasVisiblePreparedPayoff(puzzle: BarterPuzzle, routes: RouteResult[]): boolean {
  return routes.some((route) =>
    route.trades.some((trade) => {
      if (trade.window !== 'late' || trade.hiddenUntilNight) return false;
      if (trade.role !== 'engine_payoff' && trade.role !== 'compound_gate') return false;
      return trade.give.some((side) => puzzle.inventory[side.good] < side.qty);
    })
  );
}

function inferHiddenVendorPurpose(
  puzzle: BarterPuzzle,
  hiddenVendorKey: string | null,
  nearRoutes: RouteResult[],
  shortestRoutes: RouteResult[]
): HiddenVendorPurpose | null {
  if (!hiddenVendorKey) return null;
  const usedNear = nearRoutes.some((route) => routeHasTrade(route, hiddenVendorKey));
  if (!usedNear) return null;
  const usedByShortest = shortestRoutes.some((route) => routeHasTrade(route, hiddenVendorKey));
  if (!usedByShortest) return puzzle.hiddenVendorPurpose ?? 'recovery';
  return puzzle.hiddenVendorPurpose ?? 'alternate';
}

export function analyzeBarterPuzzle(puzzle: BarterPuzzle): BarterQualityReport {
  const violations: string[] = [];
  const { routes, capped } = enumerateRoutes(puzzle);
  const sortedRoutes = routes.slice().sort((a, b) => a.steps - b.steps);
  const shortestPathLength = sortedRoutes[0]?.steps ?? null;
  const nearRoutes =
    shortestPathLength === null
      ? []
      : sortedRoutes.filter((route) => route.steps <= shortestPathLength + 1);
  const nearSummaries = nearRoutes.map(summarizeRoute);
  const nearIdentities = new Set(nearSummaries.map(routeIdentityKey));
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
  const openingRegrets = getOpeningRegrets(startKeys, firstBest, bestLength);
  const regrets = openingRegrets
    .map((entry) => entry.regret)
    .filter((value): value is number => value !== null);
  const maxEarlyRegret = regrets.length ? Math.max(...regrets) : 0;
  const optimalFirstMoveCount = regrets.filter((regret) => regret === 0).length;
  const nearFirstMoveCount = uniqueCount(nearRoutes.map((route) => route.firstTradeKey));
  const uniqueNearSummaries = Array.from(
    new Map(nearSummaries.map((route) => [routeIdentityKey(route), route])).values()
  );
  const nearPathCount = nearIdentities.size;
  const tempoRouteCount = uniqueNearSummaries.filter((route) => route.line === 'tempo').length;
  const engineRouteCount = uniqueNearSummaries.filter((route) => route.line === 'engine').length;
  const compoundOnNearOptimalRoute = nearRoutes.some((route) =>
    route.trades.some((trade) => trade.role === 'compound_gate' && trade.give.length > 1)
  );
  const meaningfulOptionsByDepth = countMeaningfulOptionsByDepth(nearSummaries, 3);
  const routeDivergenceDepth = findRouteDivergenceDepth(puzzle, nearRoutes, 3);
  const bottleneckGood = findBottleneckGood(puzzle);
  const hiddenTrades = puzzle.trades.filter((trade) => trade.hiddenUntilNight);
  const hiddenVendorKey = hiddenTrades[0] ? tradeKey(hiddenTrades[0]) : null;
  const shortestRoutes =
    shortestPathLength === null
      ? []
      : sortedRoutes.filter((route) => route.steps === shortestPathLength);
  const routePersonalities = Array.from(
    new Set(uniqueNearSummaries.map((route) => classifyRoutePersonality(route, puzzle.topology)))
  );
  const hiddenVendorPurpose = inferHiddenVendorPurpose(
    puzzle,
    hiddenVendorKey,
    nearRoutes,
    shortestRoutes
  );
  const distance = routeDistance(bestRoute, alternateRoute);
  const compoundCompressionValue = compressionValue(sortedRoutes, shortestPathLength);
  const payoffVisibility = hasVisiblePreparedPayoff(puzzle, nearRoutes);
  const dayTrades = puzzle.trades.filter((trade) => (trade.window ?? 'early') !== 'late');
  const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');

  if (shortestPathLength === null) {
    violations.push('No route reaches the goal.');
  } else {
    if (shortestPathLength < MIN_PATH_LENGTH || shortestPathLength > MAX_PATH_LENGTH) {
      violations.push(`Shortest route must be ${MIN_PATH_LENGTH}-${MAX_PATH_LENGTH} trades.`);
    }
    if (puzzle.par !== shortestPathLength) {
      violations.push('Puzzle par must equal the shortest route length.');
    }
    if (puzzle.maxTrades !== shortestPathLength + 2) {
      violations.push('Puzzle max trades must be par plus two.');
    }
  }
  if (capped) violations.push('Route search capped before quality analysis completed.');
  if (puzzle.earlyWindowTrades !== 4 && puzzle.earlyWindowTrades !== 5) {
    violations.push('Day window must be four or five trades.');
  }
  if (puzzle.earlyWindowTrades > 5) violations.push('Day window may not exceed five trades.');
  if (shortestPathLength !== null && shortestPathLength >= 12 && puzzle.earlyWindowTrades !== 5) {
    violations.push('Par 12+ puzzles must use a five-trade day window.');
  }
  if (puzzle.trades.length < 8 || puzzle.trades.length > 12) {
    violations.push('Trade pool must contain eight to twelve trades.');
  }
  if (dayTrades.length < 4 || dayTrades.length > 5) {
    violations.push('Day Market must contain four or five trades.');
  }
  if (nightTrades.length < 4 || nightTrades.length > 7) {
    violations.push('Night Market must contain four to seven trades.');
  }
  if (nearPathCount < 2) violations.push('At least two near-optimal route identities are required.');
  if (nearPathCount > 4) violations.push('Near-optimal route identities must stay focused.');
  if (nearFirstMoveCount < 2) violations.push('At least two near-optimal first moves are required.');
  if (nearFirstMoveCount > 4) violations.push('Near-optimal first moves must stay readable.');
  if (optimalFirstMoveCount !== 2) {
    violations.push('Exactly two par-quality first moves are required.');
  }
  if (!compoundOnNearOptimalRoute) {
    violations.push('At least one near-optimal route must use a compound trade.');
  }
  if (tempoRouteCount < 1) violations.push('At least one near-optimal tempo route is required.');
  if (engineRouteCount < 1) violations.push('At least one near-optimal engine route is required.');
  if (startTrades.length < 4) violations.push('At least four starting trades must be affordable.');
  if ((meaningfulOptionsByDepth[0] ?? 0) < 2) {
    violations.push('Opening near-optimal routes need at least two meaningful options.');
  }
  if (deadEarlyMoveCount > 0) violations.push('Affordable early moves must not be dead ends.');
  if (maxEarlyRegret < 1) violations.push('At least one affordable opening must carry regret.');
  if (maxEarlyRegret > 2) violations.push('Affordable early moves must stay within two trades of optimal.');
  if (routeDivergenceDepth === null) {
    violations.push('Near-optimal routes must diverge by inventory within three trades.');
  }
  if (!bottleneckGood) violations.push('At least one late bottleneck good must have competing uses.');
  if (distance < 2) violations.push('Near-optimal routes must differ by route identity, not only order.');
  if (compoundCompressionValue < 1) {
    violations.push('A compound route must compress at least one trade of value.');
  }
  if (!payoffVisibility) {
    violations.push('At least one visible night payoff must require day preparation.');
  }
  if (puzzle.trades.some(hasSelfTrade)) violations.push('Trades may not give and receive the same good.');
  if (puzzle.trades.some(hasInvalidQuantities)) violations.push('Trade quantities must be positive.');
  if (hasDuplicateTradeKeys(puzzle.trades)) violations.push('Trade list contains duplicate trades.');
  if (hiddenTrades.length !== 1) violations.push('Exactly one night vendor must be hidden before night.');
  if (hiddenTrades.some((trade) => trade.window !== 'late')) {
    violations.push('Hidden vendors must belong to the night market.');
  }
  if (hiddenVendorKey) {
    if (!sortedRoutes.some((route) => routeHasTrade(route, hiddenVendorKey))) {
      violations.push('The hidden night vendor must affect at least one solving route.');
    }
    if (
      shortestRoutes.length > 0 &&
      shortestRoutes.every((route) => routeHasTrade(route, hiddenVendorKey))
    ) {
      violations.push('The hidden night vendor may not be required for every par route.');
    }
  }
  if (!hiddenVendorPurpose) violations.push('Hidden night vendor must have a route purpose.');
  if (!nearRoutes.some((route) => route.roles.has('engine_payoff'))) {
    violations.push('A near-optimal route must reach an engine payoff.');
  }
  if (!nearRoutes.some((route) => route.roles.has('tempo_bailout'))) {
    violations.push('A near-optimal route must reach a tempo bailout.');
  }

  return {
    accepted: violations.length === 0,
    violations,
    archetype: puzzle.archetype ?? null,
    shortestPathLength,
    nearOptimalRouteCount: nearPathCount,
    nearOptimalFirstMoveCount: nearFirstMoveCount,
    optimalFirstMoveCount,
    compoundOnNearOptimalRoute,
    tempoRouteCount,
    engineRouteCount,
    startAffordableCount: startTrades.length,
    meaningfulOptionsByDepth,
    maxEarlyRegret,
    deadEarlyMoveCount,
    openingRegrets,
    routeDivergenceDepth,
    bottleneckGood,
    hiddenVendorKey,
    topology: puzzle.topology ?? puzzle.archetype ?? null,
    thesis: puzzle.thesis ?? null,
    hiddenVendorPurpose,
    routeDistance: distance,
    compressionValue: compoundCompressionValue,
    payoffVisibility,
    routePersonalities,
    bestRoute,
    alternateRoute,
    strategicInsight: buildInsight(puzzle, bestRoute, alternateRoute),
  };
}

export function validateBarterQuality(puzzle: BarterPuzzle): BarterQualityReport {
  return analyzeBarterPuzzle(puzzle);
}
