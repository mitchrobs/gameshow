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
  FeltMarketThesis,
  GoodId,
  HiddenVendorPurpose,
  HiddenVendorUsage,
  Inventory,
  NightVendorRole,
  OpeningRegret,
  RoutePersonality,
  RouteSummary,
  Trade,
} from './types.ts';

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
  switch (puzzle.feltThesis) {
    case 'protect_key_good':
      return 'The clean route protects the flexible good until its better Night Market use is clear.';
    case 'spend_the_heap':
      return 'The puzzle starts with awkward wealth; par comes from turning the heap into useful pieces without clogging night.';
    case 'carry_the_pair':
      return 'The visible bundle is the shortcut, so the day is about carrying a matched pair into night.';
    case 'use_the_ugly_trade':
      return 'The strange day trade is not a mistake; it creates the piece that makes the night route work.';
    case 'stop_early':
      return 'Par stops production once the bundle has enough; extra stock becomes cleanup.';
    case 'night_told_you':
      return 'The Night Market gave the clue before the first trade: prepare what the visible payoff wants.';
    case 'hidden_is_mercy':
      return 'The hidden stall is mercy for recovery, while the clean route is readable from the visible market.';
  }
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

function routeInventoryAfter(
  puzzle: BarterPuzzle,
  route: RouteResult | null,
  depth: number
): Inventory | null {
  if (!route) return null;
  let inv = { ...puzzle.inventory };
  for (let index = 0; index < Math.min(depth, route.trades.length); index++) {
    inv = applyTrade(inv, route.trades[index]);
  }
  return inv;
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

function openingRegretSignature(
  puzzle: BarterPuzzle,
  openingRegrets: OpeningRegret[],
  routePersonalities: RoutePersonality[]
): string {
  const tradeByKey = new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));
  const personalityKey = routePersonalities.slice().sort().join('+') || 'plain';
  const openingKey = openingRegrets
    .map((entry) => {
      const trade = tradeByKey.get(entry.tradeKey);
      const regret = entry.regret === null ? 'dead' : `+${entry.regret}`;
      if (!trade) return `${regret}:missing`;
      const role = trade.role ?? 'trade';
      const line = trade.line ?? 'shared';
      const shape = `${trade.give.length}-${trade.receive.length}`;
      const quantityShape = `${trade.give.map((side) => side.qty).join('+')}>${trade.receive
        .map((side) => side.qty)
        .join('+')}`;
      const compound = trade.give.length > 1 ? 'compound' : 'simple';
      return `${regret}:${role}:${line}:${shape}:${quantityShape}:${compound}`;
    })
    .join('|');
  return `${puzzle.topology ?? puzzle.archetype ?? 'unknown'}::${personalityKey}::${openingKey}`;
}

function regretRoleSignature(puzzle: BarterPuzzle, openingRegrets: OpeningRegret[]): string {
  const tradeByKey = new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));
  const openingKey = openingRegrets
    .map((entry) => {
      const trade = tradeByKey.get(entry.tradeKey);
      const role = trade?.role ?? 'trade';
      const line = trade?.line ?? 'shared';
      const regret = entry.regret === null ? 'dead' : `+${entry.regret}`;
      return `${role}:${line}:${regret}`;
    })
    .sort()
    .join('|');
  return `${puzzle.topology ?? puzzle.archetype ?? 'unknown'}:${puzzle.texture ?? 'plain'}::${openingKey}`;
}

function roleSkeletonSignature(puzzle: BarterPuzzle): string {
  return puzzle.trades
    .map((trade) => {
      const role = trade.role ?? 'trade';
      const line = trade.line ?? 'shared';
      const window = trade.window ?? 'early';
      const hidden = trade.hiddenUntilNight ? 'hidden' : 'open';
      const shape = `${trade.give.length}-${trade.receive.length}`;
      const quantities = `${trade.give.map((side) => side.qty).join('+')}>${trade.receive
        .map((side) => side.qty)
        .join('+')}`;
      return `${window}:${role}:${line}:${hidden}:${shape}:${quantities}`;
    })
    .sort()
    .join('|');
}

function startInventorySignature(puzzle: BarterPuzzle): string {
  const nonZero = puzzle.goods
    .map((good) => ({ good: good.id, qty: puzzle.inventory[good.id] ?? 0 }))
    .filter((side) => side.qty > 0);
  const quantities = nonZero
    .map((side) => side.qty)
    .sort((a, b) => b - a)
    .join('/');
  const tiers = nonZero
    .map((side) => {
      if (side.good === puzzle.goal.good) return 'goal';
      const tradeUseCount = puzzle.trades.filter((trade) =>
        trade.give.some((give) => give.good === side.good)
      ).length;
      return tradeUseCount >= 2 ? 'liquid' : 'held';
    })
    .sort()
    .join('+');
  return `${puzzle.startEconomy ?? 'unknown'}:${nonZero.length}:${quantities}:${tiers}`;
}

function startSilhouette(puzzle: BarterPuzzle, startAffordableCount = 0): string {
  const nonZero = puzzle.goods
    .map((good) => ({ good, qty: puzzle.inventory[good.id] ?? 0 }))
    .filter((side) => side.qty > 0)
    .sort((a, b) => b.qty - a.qty || a.good.id.localeCompare(b.good.id));
  const quantityShape = nonZero.map((side) => side.qty).join('/');
  const goodShape = nonZero.map((side) => `${side.good.tier}:${side.good.id}`).join('/');
  return `${puzzle.startEconomy ?? 'unknown'}:${nonZero.length}:${quantityShape}:${goodShape}:open${startAffordableCount}`;
}

function hasValidStartEconomyShape(puzzle: BarterPuzzle): boolean {
  const nonZero = puzzle.goods
    .map((good) => ({ good, qty: puzzle.inventory[good.id] ?? 0 }))
    .filter((side) => side.qty > 0)
    .sort((a, b) => b.qty - a.qty);
  const quantities = nonZero.map((side) => side.qty);
  const max = quantities[0] ?? 0;
  const second = quantities[1] ?? 0;
  const uncommonStarts = nonZero.filter((side) => side.good.tier === 'uncommon').length;
  switch (puzzle.startEconomy) {
    case 'bulk_heap':
      return nonZero.length === 3 && max >= 18 && second <= 4;
    case 'balanced_pair':
      return nonZero.length >= 3 && max <= 10 && max - second <= 2 && max >= 8;
    case 'split_capital':
      return nonZero.length >= 3 && max <= 10 && quantities.filter((qty) => qty >= 3).length >= 3;
    case 'prepared_piece':
      return nonZero.length >= 4 && uncommonStarts >= 1 && max <= 12;
    case 'scarce_coupon':
      return nonZero.length === 3 && max <= 10 && second >= 6;
    case 'messy_pantry':
      return nonZero.length >= 4 && max <= 10;
    default:
      return true;
  }
}

function inferNightVendorRole(puzzle: BarterPuzzle, trade: Trade): NightVendorRole {
  if (trade.vendorRole) return trade.vendorRole;
  const goalOutputQty = goalOutput(trade, puzzle.goal.good);
  if (trade.hiddenUntilNight || trade.role === 'tempo_bailout') return 'recycler';
  if (goalOutputQty > 0 && trade.give.length > 1) return 'bundle_payoff';
  if (goalOutputQty > 0) return 'reserve_payoff';
  if (trade.receive.some((side) => side.good === puzzle.goal.good)) return 'loop_finisher';
  return trade.role === 'variant' ? 'recycler' : 'bridge_vendor';
}

function nightRoleSignature(puzzle: BarterPuzzle): string {
  return puzzle.trades
    .filter((trade) => trade.window === 'late')
    .map((trade) => {
      const role = inferNightVendorRole(puzzle, trade);
      const hidden = trade.hiddenUntilNight ? 'hidden' : 'open';
      const output = goalOutput(trade, puzzle.goal.good) > 0 ? 'goal' : 'prep';
      const shape = `${trade.give.length}-${trade.receive.length}`;
      return `${role}:${hidden}:${output}:${shape}`;
    })
    .sort()
    .join('|');
}

function nightScriptSignature(puzzle: BarterPuzzle): string {
  return puzzle.trades
    .filter((trade) => trade.window === 'late')
    .map((trade) => {
      const role = inferNightVendorRole(puzzle, trade);
      const hidden = trade.hiddenUntilNight ? 'hidden' : 'open';
      const goal = goalOutput(trade, puzzle.goal.good);
      const give = trade.give.map((side) => side.qty).join('+');
      const receive = trade.receive.map((side) => side.qty).join('+');
      return `${role}:${hidden}:goal${goal}:${trade.give.length}[${give}]->${trade.receive.length}[${receive}]`;
    })
    .sort()
    .join('|');
}

function firstQuestion(thesis: FeltMarketThesis | undefined): string {
  switch (thesis) {
    case 'protect_key_good':
      return 'what do I protect?';
    case 'spend_the_heap':
      return 'how do I spend this heap?';
    case 'carry_the_pair':
      return 'what pair reaches night?';
    case 'use_the_ugly_trade':
      return 'why is the ugly trade useful?';
    case 'stop_early':
      return 'when do I stop?';
    case 'night_told_you':
      return 'what did night already tell me?';
    case 'hidden_is_mercy':
      return 'how do I solve without the hidden stall?';
    default:
      return 'what is the market asking?';
  }
}

function findVisiblePremiseTrade(puzzle: BarterPuzzle, bottleneckGood: GoodId | null): Trade | null {
  const visibleNight = puzzle.trades.filter(
    (trade) => trade.window === 'late' && !trade.hiddenUntilNight
  );
  const biggestBundle = visibleNight
    .filter((trade) => trade.role === 'compound_gate' && goalOutput(trade, puzzle.goal.good) > 0)
    .sort((a, b) => goalOutput(b, puzzle.goal.good) - goalOutput(a, puzzle.goal.good))[0];
  switch (puzzle.feltThesis) {
    case 'carry_the_pair':
    case 'night_told_you':
      return biggestBundle ?? visibleNight.find((trade) => goalOutput(trade, puzzle.goal.good) > 0) ?? null;
    case 'protect_key_good':
      return (
        (bottleneckGood
          ? visibleNight.find((trade) => trade.give.some((side) => side.good === bottleneckGood))
          : null) ?? biggestBundle ?? null
      );
    case 'spend_the_heap':
    case 'use_the_ugly_trade':
      return (
        visibleNight.find((trade) => inferNightVendorRole(puzzle, trade) === 'bridge_vendor') ??
        biggestBundle ??
        null
      );
    case 'stop_early':
      return biggestBundle ?? visibleNight.find((trade) => inferNightVendorRole(puzzle, trade) === 'recycler') ?? null;
    case 'hidden_is_mercy':
      return biggestBundle ?? visibleNight.find((trade) => goalOutput(trade, puzzle.goal.good) > 0) ?? null;
    default:
      return biggestBundle ?? visibleNight[0] ?? null;
  }
}

function motifEvidence(
  puzzle: BarterPuzzle,
  visiblePremiseTrade: Trade | null,
  bottleneckGood: GoodId | null,
  startAffordableCount: number,
  signatureValue: number,
  hiddenVendorUsage: HiddenVendorUsage | null
): string[] {
  const evidence: string[] = [];
  if (hasValidStartEconomyShape(puzzle)) evidence.push(`start:${puzzle.startEconomy ?? 'unknown'}`);
  if (visiblePremiseTrade) evidence.push(`visible:${tradeKey(visiblePremiseTrade)}`);
  if (bottleneckGood) {
    const uses = puzzle.trades.filter((trade) =>
      [...trade.give, ...trade.receive].some((side) => side.good === bottleneckGood)
    ).length;
    if (uses >= 3) evidence.push(`bottleneck:${bottleneckGood}:${uses}`);
  }
  if (startAffordableCount >= 3 && startAffordableCount <= 5) {
    evidence.push(`openings:${startAffordableCount}`);
  }
  if (signatureValue >= 3) evidence.push('big-bundle');
  if (puzzle.feltThesis === 'hidden_is_mercy' && hiddenVendorUsage !== 'par_route') {
    evidence.push('hidden-mercy');
  }
  return evidence;
}

function routeNightRoleDiversity(puzzle: BarterPuzzle, route: RouteResult | null): number {
  if (!route) return 0;
  return new Set(
    route.trades
      .filter((trade) => trade.window === 'late')
      .map((trade) => inferNightVendorRole(puzzle, trade))
  ).size;
}

function repeatedGoalCashoutCount(puzzle: BarterPuzzle, route: RouteResult | null): number {
  if (!route) return 0;
  const counts = new Map<string, number>();
  route.trades
    .filter((trade) => trade.window === 'late' && goalOutput(trade, puzzle.goal.good) > 0)
    .forEach((trade) => {
      const role = inferNightVendorRole(puzzle, trade);
      const key = `${role}:${trade.give.length > 1 ? 'compound' : 'single'}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
  return Math.max(0, ...counts.values());
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

function routeMaxRepeat(route: RouteSummary | null): number {
  if (!route) return 0;
  return keyMaxRepeat(route.tradeKeys);
}

function keyMaxRepeat(keys: string[]): number {
  const counts = new Map<string, number>();
  keys.forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));
  return Math.max(0, ...counts.values());
}

function routeResultMaxRepeat(route: RouteResult): number {
  return keyMaxRepeat(route.trades.map(tradeKey));
}

function pickBestRoute(puzzle: BarterPuzzle, routes: RouteResult[]): RouteResult | null {
  return (
    routes
      .slice()
      .sort((a, b) => {
        const cashoutDiff =
          repeatedGoalCashoutCount(puzzle, a) - repeatedGoalCashoutCount(puzzle, b);
        if (cashoutDiff !== 0) return cashoutDiff;
        const diversityDiff =
          routeNightRoleDiversity(puzzle, b) - routeNightRoleDiversity(puzzle, a);
        if (diversityDiff !== 0) return diversityDiff;
        const repeatDiff = routeResultMaxRepeat(a) - routeResultMaxRepeat(b);
        if (repeatDiff !== 0) return repeatDiff;
        const hiddenDiff =
          Number(a.trades.some((trade) => trade.hiddenUntilNight)) -
          Number(b.trades.some((trade) => trade.hiddenUntilNight));
        if (hiddenDiff !== 0) return hiddenDiff;
        return a.trades.map(tradeKey).join('|').localeCompare(b.trades.map(tradeKey).join('|'));
      })[0] ?? null
  );
}

function goalOutput(trade: Trade, goalGood: GoodId): number {
  return trade.receive
    .filter((side) => side.good === goalGood)
    .reduce((total, side) => total + side.qty, 0);
}

function signatureTurnValue(puzzle: BarterPuzzle, routes: RouteResult[]): number {
  let best = 0;
  routes.forEach((route) => {
    route.trades.forEach((trade) => {
      const output = goalOutput(trade, puzzle.goal.good);
      if (output <= 0) return;
      if (trade.give.length > 1 || trade.role === 'compound_gate') {
        best = Math.max(best, output);
      }
    });
  });
  return best;
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
  shortestRoutes: RouteResult[],
  allRoutes: RouteResult[]
): HiddenVendorPurpose | null {
  if (!hiddenVendorKey) return null;
  const usedNear = nearRoutes.some((route) => routeHasTrade(route, hiddenVendorKey));
  const usedAnywhere = allRoutes.some((route) => routeHasTrade(route, hiddenVendorKey));
  if (!usedNear && !usedAnywhere) return null;
  const usedByShortest = shortestRoutes.some((route) => routeHasTrade(route, hiddenVendorKey));
  if (!usedByShortest) return puzzle.hiddenVendorPurpose ?? 'recovery';
  return puzzle.hiddenVendorPurpose ?? 'alternate';
}

function classifyHiddenVendorUsage(
  hiddenVendorKey: string | null,
  nearRoutes: RouteResult[],
  shortestRoutes: RouteResult[],
  allRoutes: RouteResult[]
): HiddenVendorUsage | null {
  if (!hiddenVendorKey) return null;
  if (shortestRoutes.some((route) => routeHasTrade(route, hiddenVendorKey))) return 'par_route';
  if (nearRoutes.some((route) => routeHasTrade(route, hiddenVendorKey))) return 'alternate_route';
  if (allRoutes.some((route) => routeHasTrade(route, hiddenVendorKey))) return 'recovery_only';
  return null;
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
  const shortestRoutes =
    shortestPathLength === null
      ? []
      : sortedRoutes.filter((route) => route.steps === shortestPathLength);
  const preferredBestRoute = pickBestRoute(puzzle, shortestRoutes);
  const nearSummaries = nearRoutes.map(summarizeRoute);
  const nearIdentities = new Set(nearSummaries.map(routeIdentityKey));
  const bestRoute = preferredBestRoute ? summarizeRoute(preferredBestRoute) : nearSummaries[0] ?? null;
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
  const routePersonalities = Array.from(
    new Set(uniqueNearSummaries.map((route) => classifyRoutePersonality(route, puzzle.topology)))
  );
  const regretSignature = openingRegretSignature(puzzle, openingRegrets, routePersonalities);
  const hiddenVendorPurpose = inferHiddenVendorPurpose(
    puzzle,
    hiddenVendorKey,
    nearRoutes,
    shortestRoutes,
    sortedRoutes
  );
  const hiddenVendorUsage = classifyHiddenVendorUsage(
    hiddenVendorKey,
    nearRoutes,
    shortestRoutes,
    sortedRoutes
  );
  const roleSignature = roleSkeletonSignature(puzzle);
  const regretRole = regretRoleSignature(puzzle, openingRegrets);
  const distance = routeDistance(bestRoute, alternateRoute);
  const compoundCompressionValue = compressionValue(sortedRoutes, shortestPathLength);
  const bestRouteMaxRepeat = routeMaxRepeat(bestRoute);
  const bestSignatureTurnValue = signatureTurnValue(puzzle, nearRoutes);
  const payoffVisibility = hasVisiblePreparedPayoff(puzzle, nearRoutes);
  const startSignature = startInventorySignature(puzzle);
  const nightSignature = nightRoleSignature(puzzle);
  const scriptSignature = nightScriptSignature(puzzle);
  const silhouette = startSilhouette(puzzle, startTrades.length);
  const nightRoleDiversity = routeNightRoleDiversity(puzzle, preferredBestRoute);
  const repeatedCashouts = repeatedGoalCashoutCount(puzzle, preferredBestRoute);
  const visiblePremiseTrade = findVisiblePremiseTrade(puzzle, bottleneckGood);
  const visiblePremiseTradeKey = visiblePremiseTrade ? tradeKey(visiblePremiseTrade) : null;
  const dayTrades = puzzle.trades.filter((trade) => (trade.window ?? 'early') !== 'late');
  const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
  const bestDayCloseInventory = routeInventoryAfter(
    puzzle,
    preferredBestRoute,
    puzzle.earlyWindowTrades
  );
  const alternateRouteResult =
    alternateRoute === null
      ? null
      : nearRoutes.find(
          (route) => route.trades.map(tradeKey).join('|') === alternateRoute.tradeKeys.join('|')
        ) ?? null;
  const alternateDayCloseInventory = routeInventoryAfter(
    puzzle,
    alternateRouteResult,
    puzzle.earlyWindowTrades
  );
  const evidence = motifEvidence(
    puzzle,
    visiblePremiseTrade,
    bottleneckGood,
    startTrades.length,
    bestSignatureTurnValue,
    hiddenVendorUsage
  );

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
  if (puzzle.trades.length < 8 || puzzle.trades.length > 11) {
    violations.push('Trade pool must contain eight to eleven trades.');
  }
  if (!puzzle.feltThesis) violations.push('A daily needs a felt market thesis.');
  if (!hasValidStartEconomyShape(puzzle)) {
    violations.push('Accepted puzzle must match its intended start economy.');
  }
  if (!visiblePremiseTradeKey) violations.push('A daily needs a visible premise trade.');
  if (evidence.length < 3) violations.push('Felt thesis needs visible motif evidence.');
  if (dayTrades.length < 4 || dayTrades.length > 5) {
    violations.push('Day Market must contain four or five trades.');
  }
  if (nightTrades.length < 4 || nightTrades.length > 6) {
    violations.push('Night Market must contain four to six trades.');
  }
  if (nearPathCount < 2) violations.push('At least two near-optimal route identities are required.');
  if (nearFirstMoveCount < 2) violations.push('At least two near-optimal first moves are required.');
  if (nearFirstMoveCount > 4) violations.push('Near-optimal first moves must stay readable.');
  if (optimalFirstMoveCount < 2 || optimalFirstMoveCount > 3) {
    violations.push('Two or three par-quality first moves are required.');
  }
  if (!compoundOnNearOptimalRoute) {
    violations.push('At least one near-optimal route must use a compound trade.');
  }
  if (startTrades.length < 3 || startTrades.length > 5) {
    violations.push('Starting affordances must vary between three and five readable moves.');
  }
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
  if (
    bestRouteMaxRepeat > 2 &&
    puzzle.feltThesis !== 'spend_the_heap' &&
    puzzle.feltThesis !== 'hidden_is_mercy' &&
    puzzle.topology !== 'compression_route'
  ) {
    violations.push('Best route repeats a trade too often for this thesis.');
  }
  if (bestRouteMaxRepeat > 3) {
    violations.push('Best route may not repeat a trade more than three times.');
  }
  if (nightRoleDiversity < 2) {
    violations.push('Best route needs more than one kind of Night Market vendor.');
  }
  if (repeatedCashouts > 4) {
    violations.push('Best route repeats too many similar goal-building vendors.');
  }
  if (bestSignatureTurnValue < 2) {
    violations.push('A daily needs a signature compound exchange worth at least two goal units.');
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
    if (!hiddenVendorUsage) {
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
    openingRegretSignature: regretSignature,
    regretRoleSignature: regretRole,
    roleSkeletonSignature: roleSignature,
    routeDivergenceDepth,
    bottleneckGood,
    hiddenVendorKey,
    hiddenVendorUsage,
    topology: puzzle.topology ?? puzzle.archetype ?? null,
    texture: puzzle.texture ?? null,
    thesis: puzzle.thesis ?? null,
    hiddenVendorPurpose,
    feltThesis: puzzle.feltThesis ?? null,
    firstQuestion: firstQuestion(puzzle.feltThesis),
    startSilhouette: silhouette,
    visiblePremiseTradeKey,
    nightScriptSignature: scriptSignature,
    motifEvidence: evidence,
    startEconomy: puzzle.startEconomy ?? null,
    economicThesis: puzzle.economicThesis ?? null,
    startInventorySignature: startSignature,
    nightRoleSignature: nightSignature,
    bestRouteNightRoleDiversity: nightRoleDiversity,
    repeatedGoalCashoutCount: repeatedCashouts,
    routeDistance: distance,
    compressionValue: compoundCompressionValue,
    signatureTurnValue: bestSignatureTurnValue,
    bestRouteMaxRepeat,
    payoffVisibility,
    routePersonalities,
    bestRoute,
    alternateRoute,
    bestDayCloseInventory,
    alternateDayCloseInventory,
    strategicInsight: buildInsight(puzzle, bestRoute, alternateRoute),
  };
}

export function validateBarterQuality(puzzle: BarterPuzzle): BarterQualityReport {
  return analyzeBarterPuzzle(puzzle);
}
