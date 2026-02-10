export type GoodTier = 'common' | 'uncommon' | 'rare';
export type GoodId =
  | 'spice'
  | 'wool'
  | 'tea'
  | 'salt'
  | 'timber'
  | 'silk'
  | 'porcelain'
  | 'gold'
  | 'gems'
  | 'jade';

export interface Good {
  id: GoodId;
  name: string;
  emoji: string;
  tier: GoodTier;
}

export interface TradeSide {
  good: GoodId;
  qty: number;
}

export interface Trade {
  give: TradeSide;
  get: TradeSide;
}

export interface BarterGoal {
  good: GoodId;
  qty: number;
}

export type BarterDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface BarterPuzzle {
  id: string;
  dateKey: string;
  difficulty: BarterDifficulty;
  goods: Good[];
  inventory: Record<GoodId, number>;
  goal: BarterGoal;
  trades: Trade[];
  solution: Trade[];
  par: number;
  maxTrades: number;
}

const GOODS: Good[] = [
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

const GOOD_INDEX = new Map(GOODS.map((good, index) => [good.id, index]));
const GOOD_MAP: Record<GoodId, Good> = GOODS.reduce((acc, good) => {
  acc[good.id] = good;
  return acc;
}, {} as Record<GoodId, Good>);

const TIER_RANK: Record<GoodTier, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
};

const DIFFICULTY_CONFIG = {
  Easy: { goods: 4, parRange: [3, 4], surplus: 0.5, slack: 2 },
  Medium: { goods: 5, parRange: [5, 6], surplus: 0.25, slack: 2 },
  Hard: { goods: 6, parRange: [7, 8], surplus: 0, slack: 1 },
} as const;

// ── Seeded random ──────────────────────────────────────────────

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededPick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function getDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDifficultyForDate(date: Date = new Date()): BarterDifficulty {
  const day = date.getDay();
  if (day === 1 || day === 2) return 'Easy';
  if (day === 3 || day === 4) return 'Medium';
  if (day === 5 || day === 6) return 'Hard';
  return 'Medium';
}

function createEmptyInventory(): Record<GoodId, number> {
  return GOODS.reduce((acc, good) => {
    acc[good.id] = 0;
    return acc;
  }, {} as Record<GoodId, number>);
}

function orderGoods(goods: GoodId[]): Good[] {
  return goods
    .slice()
    .sort((a, b) => (GOOD_INDEX.get(a) ?? 0) - (GOOD_INDEX.get(b) ?? 0))
    .map((id) => GOOD_MAP[id]);
}

function pickGoods(rand: () => number, count: number): GoodId[] {
  const commons = GOODS.filter((g) => g.tier === 'common').map((g) => g.id);
  const uncommons = GOODS.filter((g) => g.tier === 'uncommon').map((g) => g.id);
  const rares = GOODS.filter((g) => g.tier === 'rare').map((g) => g.id);

  const picks = new Set<GoodId>();
  picks.add(seededPick(commons, rand));
  picks.add(seededPick(uncommons, rand));
  picks.add(seededPick(rares, rand));

  const shuffled = seededShuffle(GOODS.map((g) => g.id), rand);
  for (const id of shuffled) {
    if (picks.size >= count) break;
    picks.add(id);
  }

  return Array.from(picks);
}

function buildPathGoods(
  goods: GoodId[],
  par: number,
  goal: GoodId,
  rand: () => number,
  difficulty: BarterDifficulty
): GoodId[] {
  const commons = goods.filter((id) => GOOD_MAP[id].tier === 'common');
  const uncommons = goods.filter((id) => GOOD_MAP[id].tier === 'uncommon');

  const path: GoodId[] = [];
  path.push(seededPick(commons, rand));

  for (let i = 1; i < par; i++) {
    const progress = i / par;
    const shouldUseUncommon =
      uncommons.length > 0 && (progress > 0.45 || (difficulty !== 'Easy' && progress > 0.2));
    const tier = shouldUseUncommon ? 'uncommon' : 'common';
    let candidates = goods.filter(
      (id) =>
        id !== goal &&
        id !== path[path.length - 1] &&
        GOOD_MAP[id].tier === tier
    );
    if (candidates.length === 0) {
      candidates = goods.filter((id) => id !== goal && id !== path[path.length - 1]);
    }
    path.push(seededPick(candidates, rand));
  }

  if (difficulty !== 'Easy' && uncommons.length > 0) {
    const hasUncommon = path.some((id) => GOOD_MAP[id].tier === 'uncommon');
    if (!hasUncommon && path.length > 1) {
      path[path.length - 1] = seededPick(uncommons, rand);
    }
  }

  path.push(goal);
  return path;
}

function getGiveQty(source: GoodId, target: GoodId, getQty: number, rand: () => number): number {
  const delta = TIER_RANK[GOOD_MAP[target].tier] - TIER_RANK[GOOD_MAP[source].tier];
  let base = 2;
  if (delta === 1) base = 3;
  if (delta >= 2) base = 5;
  if (delta === 0) base = 2;
  if (delta < 0) base = 1;
  const variance = delta > 0 ? randInt(rand, 0, 1) : randInt(rand, 0, 2);
  return Math.max(1, getQty * (base + variance));
}

function buildTrades(pathGoods: GoodId[], goalQty: number, rand: () => number): Trade[] {
  const needed: Record<GoodId, number> = createEmptyInventory();
  needed[pathGoods[pathGoods.length - 1]] = goalQty;

  const trades: Trade[] = [];
  for (let i = pathGoods.length - 2; i >= 0; i--) {
    const source = pathGoods[i];
    const target = pathGoods[i + 1];
    const getQty = needed[target];
    const giveQty = getGiveQty(source, target, getQty, rand);
    trades.unshift({
      give: { good: source, qty: giveQty },
      get: { good: target, qty: getQty },
    });
    needed[source] = giveQty;
  }
  return trades;
}

function tradeKey(trade: Trade): string {
  return `${trade.give.qty}${trade.give.good}->${trade.get.qty}${trade.get.good}`;
}

function makeReverseTrade(trade: Trade, rand: () => number): Trade {
  const giveQty = trade.get.qty;
  const giveGood = trade.get.good;
  const minReturn = Math.max(1, Math.floor(trade.give.qty * 0.4));
  const maxReturn = Math.max(minReturn, Math.floor(trade.give.qty * 0.7));
  const getQty = randInt(rand, minReturn, maxReturn);
  return {
    give: { good: giveGood, qty: giveQty },
    get: { good: trade.give.good, qty: getQty },
  };
}

function generateDistractors(
  optimal: Trade[],
  goods: GoodId[],
  goal: GoodId,
  rand: () => number,
  count: number
): Trade[] {
  const trades: Trade[] = [];
  const used = new Set(optimal.map((t) => tradeKey(t)));

  const reversed = seededShuffle(optimal, rand);
  for (const trade of reversed) {
    if (trades.length >= count) break;
    const reverse = makeReverseTrade(trade, rand);
    const key = tradeKey(reverse);
    if (!used.has(key)) {
      used.add(key);
      trades.push(reverse);
    }
  }

  while (trades.length < count) {
    const giveGood = seededPick(goods, rand);
    const getGood = seededPick(goods, rand);
    if (giveGood === getGood || getGood === goal) continue;

    const getQty = randInt(rand, 1, 2);
    const giveQty = Math.max(getQty + 1, getQty * randInt(rand, 2, 3));
    const candidate: Trade = {
      give: { good: giveGood, qty: giveQty },
      get: { good: getGood, qty: getQty },
    };
    const key = tradeKey(candidate);
    if (!used.has(key)) {
      used.add(key);
      trades.push(candidate);
    }
  }

  return trades;
}

function generatePuzzle(seed: number, date: Date = new Date()): BarterPuzzle {
  const rand = mulberry32(seed);
  const difficulty = getDifficultyForDate(date);
  const config = DIFFICULTY_CONFIG[difficulty];
  const par = randInt(rand, config.parRange[0], config.parRange[1]);

  const pickedGoods = pickGoods(rand, config.goods);
  const goods = orderGoods(pickedGoods);
  const rareGoods = goods.filter((g) => g.tier === 'rare').map((g) => g.id);
  const goalGood = seededPick(rareGoods, rand);
  const goalQty = difficulty === 'Hard' ? 2 : rand() > 0.7 ? 2 : 1;

  const pathGoods = buildPathGoods(pickedGoods, par, goalGood, rand, difficulty);
  const solution = buildTrades(pathGoods, goalQty, rand);

  const inventory = createEmptyInventory();
  const startTrade = solution[0];
  inventory[startTrade.give.good] = startTrade.give.qty;
  if (config.surplus > 0) {
    inventory[startTrade.give.good] += Math.max(
      1,
      Math.floor(startTrade.give.qty * config.surplus)
    );
  }

  const desiredDistractors = Math.max(0, Math.min(3, 8 - par));
  const distractors = generateDistractors(solution, pickedGoods, goalGood, rand, desiredDistractors);
  const trades = seededShuffle([...solution, ...distractors], rand);

  return {
    id: `barter-${seed}`,
    dateKey: getDateKey(date),
    difficulty,
    goods,
    inventory,
    goal: { good: goalGood, qty: goalQty },
    trades,
    solution,
    par,
    maxTrades: par + config.slack,
  };
}

export function getDailyBarter(date: Date = new Date()): BarterPuzzle {
  return generatePuzzle(getDailySeed(date), date);
}

export function getGoodById(id: GoodId): Good {
  return GOOD_MAP[id];
}

