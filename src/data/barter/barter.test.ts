import { describe, expect, it } from 'vitest';
import {
  applyTrade,
  canAfford,
  canonicalizeTrade,
  createEmptyInventory,
  BARTER_MARKETS,
  generateBarterPuzzle,
  getBarterTutorialPuzzle,
  getDailyBarter,
  getGoodById,
  getTradeFeedback,
  missingForTrade,
  previewTrade,
  tradeKey,
  validateBarterQuality,
  type BarterPuzzle,
  type Trade,
} from '../barterPuzzles.ts';

function clonePuzzle(puzzle: BarterPuzzle, trades: Trade[]): BarterPuzzle {
  return {
    ...puzzle,
    trades: trades.map(canonicalizeTrade),
    solution: puzzle.solution.map((trade) => {
      const key = tradeKey(trade);
      return trades.find((candidate) => tradeKey(candidate) === key) ?? trade;
    }),
  };
}

function maxRun(values: string[]): number {
  let previous = '';
  let current = 0;
  let longest = 0;
  values.forEach((value) => {
    current = value === previous ? current + 1 : 1;
    previous = value;
    longest = Math.max(longest, current);
  });
  return longest;
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return counts;
}

function inventorySummary(
  puzzle: BarterPuzzle,
  inventory: BarterPuzzle['inventory'] | null
): string {
  if (!inventory) return '';
  return puzzle.goods.map((good) => `${good.id}:${inventory[good.id]}`).join('|');
}

function tradeShape(trade: Trade): string {
  const give = trade.give.map((side) => side.qty).join('+');
  const receive = trade.receive.map((side) => side.qty).join('+');
  return `${trade.window ?? 'early'}:${trade.give.length}[${give}]->${trade.receive.length}[${receive}]`;
}

const ALL_TOPOLOGIES = [
  'balanced_pair',
  'catalyst_debt',
  'scarce_bridge',
  'tempo_discount',
  'night_pivot',
  'delayed_multiplier',
  'split_pipeline',
  'compression_route',
  'overproduction_trap',
].sort();

const ALL_FELT_THESES = [
  'carry_the_pair',
  'hidden_is_mercy',
  'night_told_you',
  'protect_key_good',
  'spend_the_heap',
  'stop_early',
  'use_the_ugly_trade',
].sort();

describe('Barter excellence generator', () => {
  it('generates deterministic daily puzzles for the same date', () => {
    const date = new Date('2026-04-16T12:00:00');
    const first = getDailyBarter(date);
    const second = getDailyBarter(date);

    expect(second).toEqual(first);
  });

  it('passes the 28-day quality window from April 16, 2026', () => {
    const start = new Date('2026-04-16T12:00:00');
    const archetypes: string[] = [];
    const pars = new Set<number>();
    const shapeSignatures = new Set<string>();
    for (let offset = 0; offset < 28; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const puzzle = getDailyBarter(date);
      const report = validateBarterQuality(puzzle);
      const dayTrades = puzzle.trades.filter((trade) => trade.window !== 'late');
      const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
      const hiddenTrades = puzzle.trades.filter((trade) => trade.hiddenUntilNight);
      archetypes.push(puzzle.archetype ?? 'unknown');
      pars.add(puzzle.par);
      shapeSignatures.add(puzzle.trades.map(tradeShape).sort().join('|'));

      expect(report.accepted, `${puzzle.dateKey}: ${report.violations.join(', ')}`).toBe(true);
      expect(report.shortestPathLength).toBeGreaterThanOrEqual(8);
      expect(report.shortestPathLength).toBeLessThanOrEqual(11);
      expect(puzzle.maxTrades).toBe(puzzle.par + 2);
      expect([4, 5]).toContain(puzzle.earlyWindowTrades);
      expect(puzzle.earlyWindowTrades).toBeLessThanOrEqual(5);
      expect(puzzle.trades.length).toBeGreaterThanOrEqual(8);
      expect(puzzle.trades.length).toBeLessThanOrEqual(11);
      expect(dayTrades.length).toBeGreaterThanOrEqual(4);
      expect(dayTrades.length).toBeLessThanOrEqual(5);
      expect(nightTrades.length).toBeGreaterThanOrEqual(4);
      expect(nightTrades.length).toBeLessThanOrEqual(6);
      expect(hiddenTrades).toHaveLength(1);
      expect(hiddenTrades[0].window).toBe('late');
      expect(report.compoundOnNearOptimalRoute).toBe(true);
      expect(report.nearOptimalRouteCount).toBeGreaterThanOrEqual(2);
      expect(report.nearOptimalFirstMoveCount).toBeGreaterThanOrEqual(2);
      expect(report.optimalFirstMoveCount).toBeGreaterThanOrEqual(2);
      expect(report.optimalFirstMoveCount).toBeLessThanOrEqual(3);
      expect(report.maxEarlyRegret).toBeGreaterThanOrEqual(1);
      expect(report.maxEarlyRegret).toBeLessThanOrEqual(2);
      expect(report.signatureTurnValue).toBeGreaterThanOrEqual(2);
      expect(report.bestRouteMaxRepeat).toBeLessThanOrEqual(3);
      expect(report.bestRouteNightRoleDiversity).toBeGreaterThanOrEqual(2);
      expect(report.repeatedGoalCashoutCount).toBeLessThanOrEqual(4);
      expect(report.routeDivergenceDepth).not.toBeNull();
      expect(report.bottleneckGood).not.toBeNull();
      expect(report.feltThesis).not.toBeNull();
      expect(report.firstQuestion.length).toBeGreaterThan(10);
      expect(report.startSilhouette).toContain(report.startEconomy ?? '');
      expect(report.visiblePremiseTradeKey).not.toBeNull();
      expect(report.nightScriptSignature.length).toBeGreaterThan(20);
      expect(report.motifEvidence.length).toBeGreaterThanOrEqual(3);
      expect(report.hiddenVendorKey).toBe(tradeKey(hiddenTrades[0]));
      expect(report.hiddenVendorPurpose).not.toBeNull();
      expect(report.routeDistance).toBeGreaterThanOrEqual(2);
      expect(report.payoffVisibility).toBe(true);
      expect(report.engineRouteCount).toBeGreaterThanOrEqual(1);
      expect(report.bestDayCloseInventory).not.toBeNull();
    }
    expect(new Set(archetypes).size).toBeGreaterThanOrEqual(5);
    expect(maxRun(archetypes)).toBeLessThanOrEqual(3);
    expect(pars.size).toBeGreaterThanOrEqual(2);
    expect(shapeSignatures.size).toBeGreaterThanOrEqual(3);
  }, 60000);

  it('passes a 56-day topology and par variety window', () => {
    const start = new Date('2026-04-16T12:00:00');
    const topologies: string[] = [];
    const pars: string[] = [];
    const shapeSignatures: string[] = [];
    const roleSkeletonSignatures: string[] = [];
    const regretPatterns: string[] = [];
    const regretRoleSignatures: string[] = [];
    const feltTheses: string[] = [];
    const firstQuestions: string[] = [];
    const startSilhouettes: string[] = [];
    const nightScriptSignatures: string[] = [];
    const affordableOpeningCounts: string[] = [];
    const signatureValues: string[] = [];
    const optimalFirstMoveCounts: string[] = [];
    const bestRouteRepeats: string[] = [];
    const startEconomies: string[] = [];
    const economicTheses: string[] = [];
    const startInventorySignatures: string[] = [];
    const nightRoleSignatures: string[] = [];
    const nightRoleDiversity: string[] = [];
    const repeatedGoalCashouts: string[] = [];
    const signaturesByPattern = new Map<string, Set<string>>();
    let plusTwoRegretDays = 0;
    let fourPlusStartGoodDays = 0;
    const dayMarketCounts: string[] = [];
    const nightMarketCounts: string[] = [];
    for (let offset = 0; offset < 56; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const puzzle = getDailyBarter(date);
      const report = validateBarterQuality(puzzle);
      const regretPattern = report.openingRegrets.map((entry) => entry.regret ?? 'dead').join('/');
      const dayTrades = puzzle.trades.filter((trade) => trade.window !== 'late');
      const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
      topologies.push(puzzle.topology ?? puzzle.archetype ?? 'unknown');
      pars.push(String(puzzle.par));
      shapeSignatures.push(puzzle.trades.map(tradeShape).sort().join('|'));
      roleSkeletonSignatures.push(report.roleSkeletonSignature);
      regretPatterns.push(regretPattern);
      regretRoleSignatures.push(report.regretRoleSignature);
      feltTheses.push(report.feltThesis ?? 'unknown');
      firstQuestions.push(report.firstQuestion);
      startSilhouettes.push(report.startSilhouette);
      nightScriptSignatures.push(report.nightScriptSignature);
      affordableOpeningCounts.push(String(report.startAffordableCount));
      signatureValues.push(String(report.signatureTurnValue));
      optimalFirstMoveCounts.push(String(report.optimalFirstMoveCount));
      bestRouteRepeats.push(String(report.bestRouteMaxRepeat));
      startEconomies.push(report.startEconomy ?? 'unknown');
      economicTheses.push(report.economicThesis ?? 'unknown');
      startInventorySignatures.push(report.startInventorySignature);
      nightRoleSignatures.push(report.nightRoleSignature);
      nightRoleDiversity.push(String(report.bestRouteNightRoleDiversity));
      repeatedGoalCashouts.push(String(report.repeatedGoalCashoutCount));
      dayMarketCounts.push(String(dayTrades.length));
      nightMarketCounts.push(String(nightTrades.length));
      if (report.maxEarlyRegret === 2) plusTwoRegretDays += 1;
      if (puzzle.goods.filter((good) => puzzle.inventory[good.id] > 0).length >= 4) {
        fourPlusStartGoodDays += 1;
      }
      const patternSignatures = signaturesByPattern.get(regretPattern) ?? new Set<string>();
      patternSignatures.add(report.regretRoleSignature);
      signaturesByPattern.set(regretPattern, patternSignatures);

      expect(report.accepted, `${puzzle.dateKey}: ${report.violations.join(', ')}`).toBe(true);
      expect(report.shortestPathLength).toBeGreaterThanOrEqual(8);
      expect(report.shortestPathLength).toBeLessThanOrEqual(11);
      expect(puzzle.maxTrades).toBe(puzzle.par + 2);
      expect(puzzle.trades.length).toBeGreaterThanOrEqual(8);
      expect(puzzle.trades.length).toBeLessThanOrEqual(11);
      expect(report.bestRouteNightRoleDiversity).toBeGreaterThanOrEqual(2);
      expect(report.repeatedGoalCashoutCount).toBeLessThanOrEqual(4);
      expect(report.feltThesis).not.toBeNull();
      expect(report.visiblePremiseTradeKey).not.toBeNull();
      expect(report.motifEvidence.length).toBeGreaterThanOrEqual(3);
    }

    const parCounts = countBy(pars);
    expect(Array.from(new Set(topologies)).sort()).toEqual(ALL_TOPOLOGIES);
    expect(Array.from(new Set(feltTheses)).sort()).toEqual(ALL_FELT_THESES);
    expect(maxRun(topologies)).toBeLessThanOrEqual(2);
    expect(maxRun(feltTheses)).toBeLessThanOrEqual(2);
    expect(parCounts.get('8') ?? 0).toBeGreaterThanOrEqual(3);
    expect(parCounts.get('9') ?? 0).toBeGreaterThanOrEqual(18);
    expect(parCounts.get('10') ?? 0).toBeGreaterThanOrEqual(12);
    expect(parCounts.get('11') ?? 0).toBeGreaterThanOrEqual(1);
    expect(countBy(dayMarketCounts).get('4') ?? 0).toBeGreaterThan(countBy(dayMarketCounts).get('5') ?? 0);
    expect(countBy(nightMarketCounts).get('5') ?? 0).toBeGreaterThan(countBy(nightMarketCounts).get('6') ?? 0);
    expect(countBy(nightMarketCounts).get('6') ?? 0).toBeGreaterThanOrEqual(3);
    expect(plusTwoRegretDays).toBeGreaterThanOrEqual(6);
    expect(countBy(optimalFirstMoveCounts).get('2') ?? 0).toBeGreaterThanOrEqual(14);
    expect(countBy(optimalFirstMoveCounts).get('2') ?? 0).toBeLessThanOrEqual(22);
    expect(countBy(optimalFirstMoveCounts).get('3') ?? 0).toBeGreaterThan(countBy(optimalFirstMoveCounts).get('2') ?? 0);
    expect(countBy(affordableOpeningCounts).get('3') ?? 0).toBeGreaterThanOrEqual(1);
    expect(countBy(affordableOpeningCounts).get('4') ?? 0).toBeGreaterThanOrEqual(1);
    expect(countBy(affordableOpeningCounts).get('5') ?? 0).toBeGreaterThanOrEqual(1);
    expect(countBy(bestRouteRepeats).get('2') ?? 0).toBeGreaterThan(countBy(bestRouteRepeats).get('3') ?? 0);
    expect(countBy(bestRouteRepeats).get('3') ?? 0).toBeLessThanOrEqual(18);
    expect(countBy(repeatedGoalCashouts).get('2') ?? 0).toBeGreaterThan(countBy(repeatedGoalCashouts).get('3') ?? 0);
    expect(countBy(repeatedGoalCashouts).get('3') ?? 0).toBeLessThanOrEqual(24);
    expect(countBy(repeatedGoalCashouts).get('4') ?? 0).toBeLessThanOrEqual(4);
    expect(countBy(signatureValues).get('3') ?? 0).toBeGreaterThanOrEqual(10);
    expect(new Set(startEconomies).size).toBe(6);
    expect(Math.max(...Array.from(countBy(startEconomies).values()))).toBeLessThanOrEqual(14);
    expect(countBy(startEconomies).get('prepared_piece') ?? 0).toBeGreaterThanOrEqual(6);
    expect(fourPlusStartGoodDays).toBeGreaterThanOrEqual(18);
    expect(new Set(economicTheses).size).toBeGreaterThanOrEqual(6);
    expect(new Set(startInventorySignatures).size).toBeGreaterThanOrEqual(9);
    expect(new Set(startSilhouettes).size).toBeGreaterThanOrEqual(18);
    expect(Math.max(...Array.from(countBy(startSilhouettes).values()))).toBeLessThanOrEqual(3);
    expect(new Set(firstQuestions).size).toBe(7);
    expect(new Set(nightRoleSignatures).size).toBeGreaterThanOrEqual(10);
    expect(new Set(nightScriptSignatures).size).toBeGreaterThanOrEqual(18);
    expect(new Set(shapeSignatures).size).toBeGreaterThanOrEqual(10);
    expect(new Set(roleSkeletonSignatures).size).toBeGreaterThanOrEqual(10);
    expect(new Set(regretPatterns).size).toBeGreaterThanOrEqual(4);
    expect(new Set(regretRoleSignatures).size).toBeGreaterThanOrEqual(8);
    expect(Math.max(...Array.from(countBy(roleSkeletonSignatures).values()))).toBeLessThanOrEqual(14);
    expect(Math.max(...Array.from(countBy(nightRoleSignatures).values()))).toBeLessThanOrEqual(20);
    expect(Array.from(signaturesByPattern.values()).some((signatures) => signatures.size > 1)).toBe(true);
  }, 120000);

  it('gives each topology an accepted recipe-specific motif', () => {
    const start = new Date('2026-04-16T12:00:00');
    const byTopology = new Map<string, { puzzle: BarterPuzzle; report: ReturnType<typeof validateBarterQuality> }>();

    for (let offset = 0; offset < 56; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const puzzle = getDailyBarter(date);
      const report = validateBarterQuality(puzzle);
      const topology = puzzle.topology ?? puzzle.archetype ?? 'unknown';
      if (!byTopology.has(topology)) byTopology.set(topology, { puzzle, report });
    }

    expect(Array.from(byTopology.keys()).sort()).toEqual(ALL_TOPOLOGIES);
    expect(byTopology.get('balanced_pair')!.puzzle.trades.some((trade) => trade.role === 'tempo' && trade.line === 'tempo' && trade.receive.length === 2)).toBe(true);
    expect(byTopology.get('catalyst_debt')!.puzzle.trades.some((trade) => trade.hiddenUntilNight)).toBe(true);
    expect(byTopology.get('catalyst_debt')!.puzzle.trades.some((trade) => trade.role === 'engine_payoff')).toBe(true);
    expect(byTopology.get('scarce_bridge')!.puzzle.trades.some((trade) => trade.hiddenUntilNight && trade.vendorRole === 'bridge_vendor')).toBe(true);
    expect(byTopology.get('scarce_bridge')!.report.bottleneckGood).not.toBeNull();
    expect(byTopology.get('tempo_discount')!.puzzle.trades.some((trade) => trade.role === 'tempo' && trade.variant)).toBe(true);
    expect(byTopology.get('night_pivot')!.report.hiddenVendorUsage).not.toBeNull();
    expect(byTopology.get('delayed_multiplier')!.puzzle.trades.some((trade) => trade.role === 'engine_payoff' && trade.receive.some((side) => side.qty >= 5))).toBe(true);
    expect(byTopology.get('split_pipeline')!.report.routePersonalities).toContain('split');
    expect(byTopology.get('compression_route')!.report.routePersonalities).toContain('compression');
    expect(byTopology.get('overproduction_trap')!.report.routePersonalities).toContain('overpay');
  });

  it('skins goods to match the selected market while keeping base good ids stable', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const theme = BARTER_MARKETS.find((market) => market.name === puzzle.marketName);

    expect(theme).toBeDefined();
    BARTER_MARKETS.forEach((market) => {
      expect(Object.keys(market.skins).sort()).toEqual(
        ['gems', 'gold', 'jade', 'porcelain', 'salt', 'silk', 'spice', 'tea', 'timber', 'wool'].sort()
      );
    });
    puzzle.goods.forEach((good) => {
      expect(good.id).toBe(getGoodById(good.id).id);
      expect(good.name).toBe(theme!.skins[good.id].name);
      expect(good.emoji).toBe(theme!.skins[good.id].emoji);
    });
  });

  it('rejects linear-only routes', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const compound = puzzle.trades.find((trade) => trade.role === 'compound_gate');
    expect(compound).toBeDefined();
    const linearGate: Trade = {
      ...compound!,
      give: [compound!.give[0]],
    };
    const fixture = clonePuzzle(
      puzzle,
      puzzle.trades.map((trade) => (trade.role === 'compound_gate' ? linearGate : trade))
    );
    const report = validateBarterQuality(fixture);

    expect(report.accepted).toBe(false);
    expect(report.compoundOnNearOptimalRoute).toBe(false);
  });

  it('rejects cosmetic compound trades outside near-optimal routes', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const compound = puzzle.trades.find((trade) => trade.role === 'compound_gate')!;
    const linearGate: Trade = {
      ...compound,
      give: [compound.give[0]],
    };
    const cosmeticCompound: Trade = {
      give: [
        { good: puzzle.goal.good, qty: 1 },
        { good: puzzle.goods[0].id, qty: 1 },
      ],
      receive: [{ good: puzzle.goods[1].id, qty: 1 }],
      window: 'late',
      role: 'distractor',
      line: 'shared',
    };
    const fixture = clonePuzzle(
      puzzle,
      [
        ...puzzle.trades.map((trade) => (trade.role === 'compound_gate' ? linearGate : trade)),
        cosmeticCompound,
      ]
    );
    const report = validateBarterQuality(fixture);

    expect(report.accepted).toBe(false);
    expect(report.compoundOnNearOptimalRoute).toBe(false);
  });

  it('rejects puzzles without a signature compound exchange', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const fixture = clonePuzzle(
      puzzle,
      puzzle.trades.map((trade) =>
        trade.role === 'compound_gate'
          ? {
              ...trade,
              receive: trade.receive.map((side) =>
                side.good === puzzle.goal.good ? { ...side, qty: 1 } : side
              ),
            }
          : trade
      )
    );
    const report = validateBarterQuality(fixture);

    expect(report.accepted).toBe(false);
    expect(report.signatureTurnValue).toBeLessThan(2);
  });

  it('rejects dead affordable early moves', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const deadMove: Trade = {
      give: puzzle.goods
        .filter((good) => puzzle.inventory[good.id] > 0)
        .map((good) => ({ good: good.id, qty: puzzle.inventory[good.id] })),
      receive: [{ good: puzzle.goal.good, qty: 1 }],
      window: 'early',
      role: 'distractor',
      line: 'shared',
    };
    const report = validateBarterQuality(clonePuzzle(puzzle, [...puzzle.trades, deadMove]));

    expect(report.accepted).toBe(false);
    expect(report.deadEarlyMoveCount).toBeGreaterThan(0);
  });

  it('rejects puzzles whose accepted start does not match the intended start economy', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const report = validateBarterQuality({
      ...puzzle,
      startEconomy: 'prepared_piece',
    });

    expect(report.accepted).toBe(false);
    expect(report.violations).toContain('Accepted puzzle must match its intended start economy.');
  });

  it('rejects puzzles without a visible premise trade', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const report = validateBarterQuality(
      clonePuzzle(
        puzzle,
        puzzle.trades.map((trade) =>
          trade.window === 'late' ? { ...trade, hiddenUntilNight: true } : trade
        )
      )
    );

    expect(report.accepted).toBe(false);
    expect(report.visiblePremiseTradeKey).toBeNull();
  });

  it('keeps the hidden night vendor out of preview but merges it when night opens', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
    const hiddenTrade = nightTrades.find((trade) => trade.hiddenUntilNight);
    const previewNightTrades = hiddenTrade
      ? nightTrades.filter((trade) => trade !== hiddenTrade)
      : nightTrades;
    const openNightTrades = nightTrades;

    expect(hiddenTrade).toBeDefined();
    expect(previewNightTrades).not.toContain(hiddenTrade);
    expect(openNightTrades).toContain(hiddenTrade);
    expect(openNightTrades).toHaveLength(nightTrades.length);
  });

  it('rejects puzzles where the hidden vendor is required by every par route', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const hiddenTrade = puzzle.trades.find((trade) => trade.hiddenUntilNight)!;
    const fillerGood = puzzle.goods.find((good) => good.id !== puzzle.goal.good)!.id;
    const fixture = clonePuzzle(
      {
        ...puzzle,
        goal: { ...puzzle.goal, qty: 1 },
        par: puzzle.earlyWindowTrades + 1,
        maxTrades: puzzle.earlyWindowTrades + 3,
      },
      puzzle.trades.map((trade) =>
        trade.window === 'late'
          ? trade === hiddenTrade
            ? { ...trade, give: [{ ...trade.give[0] }], receive: [{ good: puzzle.goal.good, qty: 1 }] }
            : { ...trade, receive: [{ good: fillerGood, qty: 1 }] }
          : trade
      )
    );
    const report = validateBarterQuality(fixture);

    expect(report.accepted).toBe(false);
    expect(report.violations).toContain('The hidden night vendor may not be required for every par route.');
  });

  it('exposes post-game autopsy data for opening regret and alternate routes', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const report = validateBarterQuality(puzzle);

    expect(report.bestRoute).not.toBeNull();
    expect(report.alternateRoute).not.toBeNull();
    expect(report.openingRegrets.some((entry) => entry.regret === 0)).toBe(true);
    expect(report.openingRegrets.some((entry) => entry.regret && entry.regret > 0)).toBe(true);
    expect(report.bestDayCloseInventory).not.toBeNull();
    expect(inventorySummary(puzzle, report.bestDayCloseInventory)).not.toBe('');
    expect(report.strategicInsight.length).toBeGreaterThan(20);
  });

  it('exposes Day Market close checkpoints for par and alternate route comparison', () => {
    const puzzle = generateBarterPuzzle(20260417, new Date('2026-04-17T12:00:00'));
    const report = validateBarterQuality(puzzle);

    expect(report.bestDayCloseInventory).not.toBeNull();
    expect(report.alternateDayCloseInventory).not.toBeNull();
    expect(inventorySummary(puzzle, report.bestDayCloseInventory)).not.toEqual(
      inventorySummary(puzzle, puzzle.inventory)
    );
  });

  it('applies multi-output trades and previews newly affordable contracts', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const trade = puzzle.trades.find((candidate) => candidate.receive.length > 1)!;
    const before = { ...puzzle.inventory };
    const after = applyTrade(before, trade);

    expect(canAfford(before, trade)).toBe(true);
    trade.receive.forEach((side) => {
      expect(after[side.good]).toBe(before[side.good] + side.qty);
    });
    trade.give.forEach((side) => {
      expect(after[side.good]).toBe(before[side.good] - side.qty);
    });

    const preview = previewTrade(puzzle, before, trade, 0);
    expect(preview.canTrade).toBe(true);
    expect(preview.delta.length).toBeGreaterThan(0);
    expect(Array.isArray(preview.newlyAffordableTradeKeys)).toBe(true);
  });

  it('summarizes tactile trade feedback without changing game rules', () => {
    const before = createEmptyInventory();
    before.tea = 2;
    before.silk = 2;
    const trade: Trade = {
      give: [
        { good: 'tea', qty: 2 },
        { good: 'silk', qty: 2 },
      ],
      receive: [{ good: 'gold', qty: 2 }],
      window: 'late',
      role: 'compound_gate',
      line: 'shared',
    };
    const after = applyTrade(before, trade);
    const feedback = getTradeFeedback(trade, before, after, 'gold');

    expect(feedback.changedGoods.sort()).toEqual(['gold', 'silk', 'tea']);
    expect(feedback.givenGoods).toEqual(['tea', 'silk']);
    expect(feedback.receivedGoods).toEqual(['gold']);
    expect(feedback.goalDelta).toBe(2);
    expect(feedback.isSignatureBundle).toBe(true);
    expect(feedback.glyphTrail).toEqual(['tea', 'silk', 'gold']);
  });

  it('calculates missing goods for locked or unaffordable trades', () => {
    const inv = createEmptyInventory();
    inv.spice = 1;
    const trade: Trade = {
      give: [
        { good: 'spice', qty: 2 },
        { good: 'tea', qty: 1 },
      ],
      receive: [{ good: 'gold', qty: 1 }],
      window: 'early',
    };

    expect(missingForTrade(inv, trade)).toEqual([
      { good: 'spice', qty: 1 },
      { good: 'tea', qty: 1 },
    ]);
  });

  it('provides a fixed first-run tutorial puzzle', () => {
    const tutorial = getBarterTutorialPuzzle();

    expect(tutorial.par).toBe(3);
    expect(tutorial.solution.some((trade) => trade.give.length > 1)).toBe(true);
    expect(tutorial.trades.some((trade) => trade.receive.length > 1)).toBe(true);
  });
});
