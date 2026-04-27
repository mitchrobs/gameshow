import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  canAfford,
  getDailyBarter,
  tradeKey,
  type GoodId,
} from '../barterPuzzles.ts';
import {
  getDefaultSelectedTradeKey,
  getMarketTradeEntries,
  getTradeActionState,
  getTradeOfferLabel,
  shouldShowHiddenNightPlaceholder,
  sortMarketTradeEntries,
  splitMarketTrades,
} from './uiState.ts';

const puzzle = getDailyBarter(new Date('2026-04-16T12:00:00'));

function selectableGood(): GoodId {
  const dayEntries = getMarketTradeEntries(puzzle, 'day', false, null);
  const candidate = puzzle.goods.find((good) => {
    const matching = dayEntries.filter((entry) =>
      entry.trade.give.some((side) => side.good === good.id)
    ).length;
    return matching > 0 && matching < dayEntries.length;
  });
  if (!candidate) throw new Error('Expected a mixed day market for UI sorting tests.');
  return candidate.id;
}

describe('Barter UI market state', () => {
  it('shows unlocked day trades and locked previewable night trades before night opens', () => {
    const { dayTrades, previewNightTrades, hiddenNightTrade } = splitMarketTrades(puzzle);
    const dayEntries = getMarketTradeEntries(puzzle, 'day', false, null);
    const nightPreviewEntries = getMarketTradeEntries(puzzle, 'night', false, null);

    expect(dayEntries.map((entry) => entry.key)).toEqual(dayTrades.map(tradeKey));
    expect(dayEntries.every((entry) => !entry.locked)).toBe(true);
    expect(nightPreviewEntries.map((entry) => entry.key)).toEqual(previewNightTrades.map(tradeKey));
    expect(nightPreviewEntries.every((entry) => entry.locked)).toBe(true);
    expect(nightPreviewEntries.every((entry) => entry.lockReason === 'night_locked')).toBe(true);
    expect(shouldShowHiddenNightPlaceholder(puzzle, 'night', false)).toBe(hiddenNightTrade !== null);
  });

  it('merges the hidden night vendor into the normal Night Market after night opens', () => {
    const { nightTrades } = splitMarketTrades(puzzle);
    const nightOpenEntries = getMarketTradeEntries(puzzle, 'night', true, null);

    expect(nightOpenEntries.map((entry) => entry.key)).toEqual(nightTrades.map(tradeKey));
    expect(nightOpenEntries.every((entry) => !entry.locked)).toBe(true);
    expect(shouldShowHiddenNightPlaceholder(puzzle, 'night', true)).toBe(false);
  });

  it('sorts selected-good matches upward without hiding other trades', () => {
    const selectedGood = selectableGood();
    const dayEntries = getMarketTradeEntries(puzzle, 'day', false, selectedGood);
    const sorted = sortMarketTradeEntries(dayEntries, puzzle.inventory, selectedGood);

    expect(sorted).toHaveLength(dayEntries.length);
    expect(sorted[0].matchesSelectedGood).toBe(true);
    expect(sorted.some((entry) => !entry.matchesSelectedGood)).toBe(true);
  });

  it('chooses an executable default action when one exists', () => {
    const dayEntries = getMarketTradeEntries(puzzle, 'day', false, null);
    const defaultKey = getDefaultSelectedTradeKey(dayEntries, puzzle.inventory, null);
    const defaultEntry = dayEntries.find((entry) => entry.key === defaultKey);

    expect(defaultEntry).toBeDefined();
    expect(defaultEntry && canAfford(puzzle.inventory, defaultEntry.trade)).toBe(true);
  });

  it('reports action-island state for ready, missing, and locked trades', () => {
    const dayEntries = getMarketTradeEntries(puzzle, 'day', false, null);
    const readyEntry = dayEntries.find((entry) => canAfford(puzzle.inventory, entry.trade)) ?? null;
    const missingEntry =
      dayEntries.find((entry) => !canAfford(puzzle.inventory, entry.trade)) ?? readyEntry;
    const nightEntry = getMarketTradeEntries(puzzle, 'night', false, null)[0] ?? null;
    const options = {
      gameState: 'playing' as const,
      lateTransition: false,
      tradesUsed: 0,
      maxTrades: puzzle.maxTrades,
    };

    expect(getTradeActionState(readyEntry, puzzle.inventory, options).canExecute).toBe(true);
    expect(getTradeActionState(missingEntry, puzzle.inventory, options).buttonLabel).toMatch(
      missingEntry === readyEntry ? /Trade/ : /Need goods/
    );
    expect(getTradeActionState(nightEntry, puzzle.inventory, options)).toMatchObject({
      canExecute: false,
      buttonLabel: 'Opens at night',
    });
  });

  it('uses short offer labels instead of broker-style vendor names', () => {
    const labels = puzzle.trades.map((trade) => getTradeOfferLabel(trade, puzzle.goal.good));
    const allowedLabels = new Set(['Cash in', 'Blend', 'Combine', 'Split', 'Stretch', 'Condense', 'Exchange']);

    expect(labels.every((label) => allowedLabels.has(label))).toBe(true);
    expect(new Set(labels).size).toBeGreaterThan(2);
    expect(labels.every((label) => label.length <= 14)).toBe(true);
    expect(labels.join(' ')).not.toMatch(
      /\b(Broker|Trader|Appraiser|Buyer|Recycler|Finisher|Refiner|Reserve|Bundle|Goal)\b/
    );
  });

  it('names offers from their trade dynamics', () => {
    expect(
      getTradeOfferLabel(
        { give: [{ good: 'spice', qty: 1 }], receive: [{ good: puzzle.goal.good, qty: 1 }] },
        puzzle.goal.good
      )
    ).toBe('Cash in');
    expect(
      getTradeOfferLabel(
        {
          give: [
            { good: 'spice', qty: 1 },
            { good: 'salt', qty: 1 },
          ],
          receive: [{ good: 'silk', qty: 1 }],
        },
        puzzle.goal.good
      )
    ).toBe('Combine');
    expect(
      getTradeOfferLabel(
        {
          give: [{ good: 'spice', qty: 1 }],
          receive: [
            { good: 'salt', qty: 1 },
            { good: 'silk', qty: 1 },
          ],
        },
        puzzle.goal.good
      )
    ).toBe('Split');
    expect(
      getTradeOfferLabel(
        { give: [{ good: 'spice', qty: 5 }], receive: [{ good: 'salt', qty: 1 }] },
        puzzle.goal.good
      )
    ).toBe('Condense');
    expect(
      getTradeOfferLabel(
        { give: [{ good: 'spice', qty: 1 }], receive: [{ good: 'salt', qty: 3 }] },
        puzzle.goal.good
      )
    ).toBe('Stretch');
  });

  it('keeps retired teaching copy off the gameplay board', () => {
    const source = readFileSync(
      new URL('../../../app/barter.tsx', import.meta.url),
      'utf8'
    );

    expect(source).not.toContain("Today's read");
    expect(source).not.toContain('First pattern');
    expect(source).not.toContain('Prioritizing trades');
    expect(source).not.toContain('Puzzle notes');
    expect(source).not.toContain('Market recap');
  });
});
