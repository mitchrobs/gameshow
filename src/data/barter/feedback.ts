import { getInventoryDelta } from './engine.ts';
import type { GoodId, Inventory, Trade, TradeSide } from './types.ts';

export interface TradeFeedback {
  changedGoods: GoodId[];
  givenGoods: GoodId[];
  receivedGoods: GoodId[];
  delta: TradeSide[];
  isSignatureBundle: boolean;
  goalDelta: number;
  glyphTrail: GoodId[];
}

function uniqueGoods(sides: TradeSide[]): GoodId[] {
  return Array.from(new Set(sides.map((side) => side.good)));
}

export function getTradeFeedback(
  trade: Trade,
  before: Inventory,
  after: Inventory,
  goalGood: GoodId
): TradeFeedback {
  const delta = getInventoryDelta(before, after);
  const givenGoods = uniqueGoods(trade.give);
  const receivedGoods = uniqueGoods(trade.receive);
  const changedGoods = delta.map((side) => side.good);
  const goalDelta = after[goalGood] - before[goalGood];
  const glyphTrail = Array.from(new Set([...givenGoods.slice(0, 2), ...receivedGoods.slice(0, 2)]));

  return {
    changedGoods,
    givenGoods,
    receivedGoods,
    delta,
    isSignatureBundle: trade.role === 'compound_gate' && trade.give.length > 1 && goalDelta >= 2,
    goalDelta,
    glyphTrail,
  };
}
