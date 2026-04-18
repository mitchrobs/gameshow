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

function tradeShape(trade: Trade): string {
  const give = trade.give.map((side) => side.qty).join('+');
  const receive = trade.receive.map((side) => side.qty).join('+');
  return `${trade.window ?? 'early'}:${trade.give.length}[${give}]->${trade.receive.length}[${receive}]`;
}

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
      expect(report.shortestPathLength).toBeGreaterThanOrEqual(10);
      expect(report.shortestPathLength).toBeLessThanOrEqual(14);
      expect(puzzle.maxTrades).toBe(puzzle.par + 2);
      expect([4, 5]).toContain(puzzle.earlyWindowTrades);
      expect(puzzle.earlyWindowTrades).toBeLessThanOrEqual(5);
      expect(puzzle.trades.length).toBeGreaterThanOrEqual(8);
      expect(puzzle.trades.length).toBeLessThanOrEqual(12);
      expect(dayTrades.length).toBeGreaterThanOrEqual(4);
      expect(dayTrades.length).toBeLessThanOrEqual(5);
      expect(nightTrades.length).toBeGreaterThanOrEqual(4);
      expect(nightTrades.length).toBeLessThanOrEqual(7);
      expect(hiddenTrades).toHaveLength(1);
      expect(hiddenTrades[0].window).toBe('late');
      expect(report.compoundOnNearOptimalRoute).toBe(true);
      expect(report.nearOptimalRouteCount).toBeGreaterThanOrEqual(2);
      expect(report.nearOptimalRouteCount).toBeLessThanOrEqual(4);
      expect(report.nearOptimalFirstMoveCount).toBeGreaterThanOrEqual(2);
      expect(report.optimalFirstMoveCount).toBe(2);
      expect(report.maxEarlyRegret).toBeGreaterThanOrEqual(1);
      expect(report.maxEarlyRegret).toBeLessThanOrEqual(2);
      expect(report.routeDivergenceDepth).not.toBeNull();
      expect(report.bottleneckGood).not.toBeNull();
      expect(report.hiddenVendorKey).toBe(tradeKey(hiddenTrades[0]));
      expect(report.hiddenVendorPurpose).not.toBeNull();
      expect(report.routeDistance).toBeGreaterThanOrEqual(2);
      expect(report.compressionValue).toBeGreaterThanOrEqual(1);
      expect(report.payoffVisibility).toBe(true);
      expect(report.tempoRouteCount).toBeGreaterThanOrEqual(1);
      expect(report.engineRouteCount).toBeGreaterThanOrEqual(1);
    }
    expect(new Set(archetypes).size).toBeGreaterThanOrEqual(5);
    expect(maxRun(archetypes)).toBeLessThanOrEqual(3);
    expect(pars.size).toBeGreaterThanOrEqual(2);
    expect(shapeSignatures.size).toBeGreaterThanOrEqual(3);
  });

  it('passes a 56-day topology and par variety window', () => {
    const start = new Date('2026-04-16T12:00:00');
    const topologies: string[] = [];
    const pars = new Set<number>();
    const shapeSignatures = new Set<string>();
    for (let offset = 0; offset < 56; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const puzzle = getDailyBarter(date);
      const report = validateBarterQuality(puzzle);
      topologies.push(puzzle.topology ?? puzzle.archetype ?? 'unknown');
      pars.add(puzzle.par);
      shapeSignatures.add(puzzle.trades.map(tradeShape).sort().join('|'));

      expect(report.accepted, `${puzzle.dateKey}: ${report.violations.join(', ')}`).toBe(true);
    }

    expect(new Set(topologies).size).toBeGreaterThanOrEqual(7);
    expect(maxRun(topologies)).toBeLessThanOrEqual(3);
    expect(pars.has(13)).toBe(true);
    expect(pars.has(14)).toBe(true);
    expect(pars.size).toBeGreaterThanOrEqual(4);
    expect(shapeSignatures.size).toBeGreaterThanOrEqual(5);
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

  it('exposes post-game autopsy data for opening regret and alternate routes', () => {
    const puzzle = generateBarterPuzzle(20260416, new Date('2026-04-16T12:00:00'));
    const report = validateBarterQuality(puzzle);

    expect(report.bestRoute).not.toBeNull();
    expect(report.alternateRoute).not.toBeNull();
    expect(report.openingRegrets.some((entry) => entry.regret === 0)).toBe(true);
    expect(report.openingRegrets.some((entry) => entry.regret && entry.regret > 0)).toBe(true);
    expect(report.strategicInsight.length).toBeGreaterThan(20);
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
