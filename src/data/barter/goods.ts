import type { Good, GoodId, GoodTier, Inventory } from './types.ts';

export const GOODS: Good[] = [
  { id: 'spice', name: 'Spice', emoji: '🌶️', tier: 'common' },
  { id: 'wool', name: 'Wool', emoji: '🧶', tier: 'common' },
  { id: 'tea', name: 'Tea', emoji: '🍵', tier: 'common' },
  { id: 'salt', name: 'Salt', emoji: '🧂', tier: 'common' },
  { id: 'timber', name: 'Timber', emoji: '🪵', tier: 'common' },
  { id: 'silk', name: 'Silk', emoji: '🧵', tier: 'uncommon' },
  { id: 'porcelain', name: 'Porcelain', emoji: '🫖', tier: 'uncommon' },
  { id: 'gold', name: 'Gold', emoji: '🪙', tier: 'rare' },
  { id: 'gems', name: 'Gems', emoji: '💎', tier: 'rare' },
  { id: 'jade', name: 'Jade', emoji: '🏺', tier: 'rare' },
];

export const GOOD_INDEX = new Map(GOODS.map((good, index) => [good.id, index]));

export const GOOD_MAP: Record<GoodId, Good> = GOODS.reduce((acc, good) => {
  acc[good.id] = good;
  return acc;
}, {} as Record<GoodId, Good>);

export const TIER_RANK: Record<GoodTier, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
};

export function createEmptyInventory(): Inventory {
  return GOODS.reduce((acc, good) => {
    acc[good.id] = 0;
    return acc;
  }, {} as Inventory);
}

export function orderGoods(goods: GoodId[]): Good[] {
  return goods
    .slice()
    .sort((a, b) => (GOOD_INDEX.get(a) ?? 0) - (GOOD_INDEX.get(b) ?? 0))
    .map((id) => GOOD_MAP[id]);
}

export function getGoodById(id: GoodId): Good {
  return GOOD_MAP[id];
}
