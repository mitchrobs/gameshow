import { describe, expect, it } from 'vitest';
import {
  applyTrade,
  canAfford,
  canonicalizeTrade,
  createEmptyInventory,
  generateBarterPuzzle,
  getBarterTutorialPuzzle,
  getDailyBarter,
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

describe('Barter excellence generator', () => {
  it('generates deterministic daily puzzles for the same date', () => {
    const date = new Date('2026-04-16T12:00:00');
    const first = getDailyBarter(date);
    const second = getDailyBarter(date);

    expect(second).toEqual(first);
  });

  it('passes the 28-day quality window from April 16, 2026', () => {
    const start = new Date('2026-04-16T12:00:00');
    for (let offset = 0; offset < 28; offset++) {
      const date = new Date(start);
      date.setDate(start.getDate() + offset);
      const puzzle = getDailyBarter(date);
      const report = validateBarterQuality(puzzle);

      expect(report.accepted, `${puzzle.dateKey}: ${report.violations.join(', ')}`).toBe(true);
      expect(report.shortestPathLength).toBeGreaterThanOrEqual(8);
      expect(report.compoundOnNearOptimalRoute).toBe(true);
      expect(report.nearOptimalFirstMoveCount).toBeGreaterThanOrEqual(2);
      expect(report.tempoRouteCount).toBeGreaterThanOrEqual(1);
      expect(report.engineRouteCount).toBeGreaterThanOrEqual(1);
    }
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
    const source = puzzle.goods.find((good) => puzzle.inventory[good.id] >= 9)!.id;
    const target = puzzle.goods.find((good) => good.id !== source && good.id !== puzzle.goal.good)!.id;
    const deadMove: Trade = {
      give: [{ good: source, qty: 9 }],
      receive: [{ good: target, qty: 1 }],
      window: 'early',
      role: 'distractor',
      line: 'shared',
    };
    const report = validateBarterQuality(clonePuzzle(puzzle, [...puzzle.trades, deadMove]));

    expect(report.accepted).toBe(false);
    expect(report.deadEarlyMoveCount).toBeGreaterThan(0);
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
