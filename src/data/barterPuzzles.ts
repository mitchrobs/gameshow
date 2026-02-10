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

export type TradeWindow = 'early' | 'late';

export interface Trade {
  give: TradeSide[];
  get: TradeSide;
  window?: TradeWindow;
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
  marketName: string;
  marketEmoji: string;
  goods: Good[];
  inventory: Record<GoodId, number>;
  goal: BarterGoal;
  trades: Trade[];
  solution: Trade[];
  par: number;
  maxTrades: number;
  earlyWindowTrades: number;
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
  Easy: { goods: 4, parRange: [3, 4], surplus: 0.5, slack: 2, distractors: 1 },
  Medium: { goods: 5, parRange: [5, 6], surplus: 0.25, slack: 2, distractors: 2 },
  Hard: { goods: 6, parRange: [10, 10], surplus: 0, slack: 2, distractors: 0 },
} as const;

const MARKETS = [
  { name: 'Silk Road Bazaar', emoji: '🧵' },
  { name: 'Spice Wharf', emoji: '🌶️' },
  { name: 'Golden Caravan', emoji: '🐪' },
  { name: 'Jade Exchange', emoji: '🏺' },
  { name: 'Porcelain Court', emoji: '🫖' },
  { name: 'Saffron Arcade', emoji: '🟧' },
  { name: 'Lantern Market', emoji: '🏮' },
  { name: 'Amber Row', emoji: '🟠' },
  { name: 'Salt & Timber Yard', emoji: '🧂' },
  { name: 'Copperstone Square', emoji: '🪙' },
  { name: 'Moonlit Souk', emoji: '🌙' },
  { name: 'Rivergate Trades', emoji: '🌊' },
  { name: 'Crimson Ledger', emoji: '🟥' },
  { name: 'Starlit Agora', emoji: '✨' },
  { name: 'Indigo Harbor', emoji: '⚓️' },
  { name: 'Windmill Exchange', emoji: '🌬️' },
  { name: 'Oasis Ledger', emoji: '🌴' },
  { name: 'Tea Road Arcade', emoji: '🍵' },
  { name: "Mariner's Market", emoji: '⚓️' },
  { name: 'Atlas Bazaar', emoji: '🗺️' },
  { name: 'Sunrise Caravan', emoji: '🌅' },
];

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

function getEarlyWindowTrades(par: number): number {
  return Math.max(2, Math.min(par - 1, 3));
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
  return 'Hard';
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
  _difficulty: BarterDifficulty
): GoodId[] {
  const commons = goods.filter((id) => GOOD_MAP[id].tier === 'common' && id !== goal);
  const startGood = commons.length > 0 ? seededPick(commons, rand) : seededPick(goods, rand);
  const remaining = seededShuffle(
    goods.filter((id) => id !== startGood && id !== goal),
    rand
  );

  const path: GoodId[] = [startGood, ...remaining, goal];

  while (path.length - 1 < par) {
    const minIndex = Math.min(3, path.length - 2);
    const insertIndex = randInt(rand, minIndex, path.length - 2);
    let candidates = goods.filter(
      (id) => id !== goal && id !== path[insertIndex] && id !== path[insertIndex + 1]
    );
    if (candidates.length === 0) {
      candidates = goods.filter((id) => id !== goal);
    }
    const next = seededPick(candidates, rand);
    path.splice(insertIndex + 1, 0, next);
  }

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
      give: [{ good: source, qty: giveQty }],
      get: { good: target, qty: getQty },
    });
    needed[source] = giveQty;
  }
  return trades;
}

function getMaxTradeQuantity(trades: Trade[], goalQty: number): number {
  let maxQty = goalQty;
  for (const trade of trades) {
    for (const give of trade.give) {
      maxQty = Math.max(maxQty, give.qty);
    }
    maxQty = Math.max(maxQty, trade.get.qty);
  }
  return maxQty;
}

function scaleTrades(trades: Trade[], factor: number): Trade[] {
  const scale = (value: number) => Math.max(1, Math.ceil(value / factor));
  return trades.map((trade) => ({
    give: trade.give.map((side) => ({ good: side.good, qty: scale(side.qty) })),
    get: { good: trade.get.good, qty: scale(trade.get.qty) },
    window: trade.window,
  }));
}

function tradeKey(trade: Trade): string {
  const giveKey = trade.give
    .slice()
    .sort((a, b) => {
      const diff = (GOOD_INDEX.get(a.good) ?? 0) - (GOOD_INDEX.get(b.good) ?? 0);
      return diff === 0 ? a.qty - b.qty : diff;
    })
    .map((side) => `${side.qty}${side.good}`)
    .join('+');
  return `${giveKey}->${trade.get.qty}${trade.get.good}`;
}

function makeReverseTrade(trade: Trade, rand: () => number): Trade {
  const primaryGive = trade.give[0];
  if (!primaryGive) {
    return {
      give: [{ good: trade.get.good, qty: trade.get.qty }],
      get: { good: trade.get.good, qty: trade.get.qty },
    };
  }
  const giveQty = trade.get.qty;
  const giveGood = trade.get.good;
  const minReturn = Math.max(1, Math.floor(primaryGive.qty * 0.4));
  const maxReturn = Math.max(minReturn, Math.floor(primaryGive.qty * 0.7));
  const getQty = randInt(rand, minReturn, maxReturn);
  return {
    give: [{ good: giveGood, qty: giveQty }],
    get: { good: primaryGive.good, qty: getQty },
  };
}

function generateDistractors(
  optimal: Trade[],
  goods: GoodId[],
  goal: GoodId,
  rand: () => number,
  count: number,
  blockedTargets?: Set<GoodId>
): Trade[] {
  const trades: Trade[] = [];
  const used = new Set(optimal.map((t) => tradeKey(t)));
  const targetPool = goods.filter((good) => !blockedTargets?.has(good));
  const targetFallback = targetPool.length === 0;

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
    const getGood = seededPick(targetFallback ? goods : targetPool, rand);
    if (giveGood === getGood || getGood === goal) continue;

    const getQty = randInt(rand, 1, 2);
    const giveQty = Math.max(getQty + 1, getQty * randInt(rand, 2, 3));
    const candidate: Trade = {
      give: [{ good: giveGood, qty: giveQty }],
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

function applyTradeWindows(
  solution: Trade[],
  distractors: Trade[],
  earlyWindowTrades: number,
  rand: () => number
): { solution: Trade[]; distractors: Trade[] } {
  const earlyCount = Math.max(1, Math.min(earlyWindowTrades, solution.length - 1));
  const earlySolution = solution
    .slice(0, earlyCount)
    .map((trade) => ({ ...trade, window: 'early' as TradeWindow }));
  const lateSolution = solution
    .slice(earlyCount)
    .map((trade) => ({ ...trade, window: 'late' as TradeWindow }));

  const shuffledDistractors = seededShuffle(distractors, rand);
  const minLate = shuffledDistractors.length >= 2 ? 1 : 0;
  const desiredEarly = shuffledDistractors.length
    ? Math.max(1, Math.round(shuffledDistractors.length * 0.6))
    : 0;
  const earlyDistractorCount = Math.min(
    shuffledDistractors.length - minLate,
    desiredEarly
  );
  const earlyDistractors = shuffledDistractors
    .slice(0, earlyDistractorCount)
    .map((trade) => ({ ...trade, window: 'early' as TradeWindow }));
  const lateDistractors = shuffledDistractors
    .slice(earlyDistractorCount)
    .map((trade) => ({ ...trade, window: 'late' as TradeWindow }));

  return {
    solution: [...earlySolution, ...lateSolution],
    distractors: [...earlyDistractors, ...lateDistractors],
  };
}

function getLateFeeQty(primaryQty: number): number {
  const base = Math.floor(primaryQty * 0.1);
  return Math.max(1, Math.min(3, base));
}

function pickFeeGood(
  excluded: Set<GoodId>,
  commons: GoodId[],
  goods: GoodId[],
  rand: () => number
): GoodId | null {
  let candidates = commons.filter((id) => !excluded.has(id));
  if (candidates.length === 0) {
    candidates = goods.filter((id) => !excluded.has(id));
  }
  if (candidates.length === 0) return null;
  return seededPick(candidates, rand);
}

function applyLateFees(
  solution: Trade[],
  distractors: Trade[],
  goods: GoodId[],
  rand: () => number
): { solution: Trade[]; distractors: Trade[]; feeTotals: Record<GoodId, number> } {
  const commons = goods.filter((id) => GOOD_MAP[id].tier === 'common');
  const feeTotals = createEmptyInventory();

  const addFee = (trade: Trade, countFees: boolean): Trade => {
    if (trade.window !== 'late') return trade;
    const primary = trade.give[0];
    if (!primary) return trade;
    const excluded = new Set(trade.give.map((side) => side.good));
    const feeGood = pickFeeGood(excluded, commons, goods, rand);
    if (!feeGood) return trade;
    const feeQty = getLateFeeQty(primary.qty);
    if (countFees) {
      feeTotals[feeGood] += feeQty;
    }
    return {
      ...trade,
      give: [...trade.give, { good: feeGood, qty: feeQty }],
    };
  };

  return {
    solution: solution.map((trade) => addFee(trade, true)),
    distractors: distractors.map((trade) => addFee(trade, false)),
    feeTotals,
  };
}

function createEarlyBranchTrades(
  solution: Trade[],
  rand: () => number
): { branch: Trade[]; startGood: GoodId; startQty: number } | null {
  if (solution.length < 3) return null;
  const [first, second, third] = solution;
  if (!first || !second || !third) return null;
  if (first.give.length !== 1 || second.give.length !== 1 || third.give.length !== 1) {
    return null;
  }
  const g0 = first.give[0].good;
  const q0 = first.give[0].qty;
  const g1 = first.get.good;
  const q1 = first.get.qty;
  const g2 = second.get.good;
  const q2 = second.get.qty;
  const g3 = third.get.good;
  const q3 = third.get.qty;
  if (g0 === g2 || g1 === g3 || g0 === g1 || g2 === g3) {
    return null;
  }

  const altGive = Math.min(200, Math.max(1, getGiveQty(g0, g2, q2, rand)));
  const branch: Trade[] = [
    {
      give: [{ good: g0, qty: altGive }],
      get: { good: g2, qty: q2 },
      window: 'early',
    },
    {
      give: [{ good: g2, qty: q2 }],
      get: { good: g1, qty: q1 },
      window: 'early',
    },
    {
      give: [{ good: g1, qty: q1 }],
      get: { good: g3, qty: q3 },
      window: 'early',
    },
  ];

  return { branch, startGood: g0, startQty: Math.max(q0, altGive) };
}

function generatePuzzle(seed: number, date: Date = new Date()): BarterPuzzle {
  const baseSeed = seed;

  const buildCandidate = (candidateSeed: number): BarterPuzzle => {
    const rand = mulberry32(candidateSeed);
    const difficulty = getDifficultyForDate(date);
    const config = DIFFICULTY_CONFIG[difficulty];
    const par = randInt(rand, config.parRange[0], config.parRange[1]);
    const earlyWindowTrades = getEarlyWindowTrades(par);

    const pickedGoods = pickGoods(rand, config.goods);
    const goods = orderGoods(pickedGoods);
    const rareGoods = goods.filter((g) => g.tier === 'rare').map((g) => g.id);
    const goalGood = seededPick(rareGoods, rand);
    let goalQty = difficulty === 'Hard' ? 2 : rand() > 0.7 ? 2 : 1;

    const pathGoods = buildPathGoods(pickedGoods, par, goalGood, rand, difficulty);
    let solution = buildTrades(pathGoods, goalQty, rand);

    const desiredDistractors = config.distractors ?? 0;
    const blockedTargets = new Set(solution.map((trade) => trade.get.good));
    let distractors = generateDistractors(
      solution,
      pickedGoods,
      goalGood,
      rand,
      desiredDistractors,
      blockedTargets
    );
    let allTrades = [...solution, ...distractors];
    const maxQty = getMaxTradeQuantity(allTrades, goalQty);
    if (maxQty > 200) {
      const factor = Math.ceil(maxQty / 200);
      solution = scaleTrades(solution, factor);
      distractors = scaleTrades(distractors, factor);
      goalQty = Math.max(1, Math.ceil(goalQty / factor));
      allTrades = [...solution, ...distractors];
    }

    const windowed = applyTradeWindows(solution, distractors, earlyWindowTrades, rand);
    solution = windowed.solution;
    distractors = windowed.distractors;

    const feeApplied = applyLateFees(solution, distractors, pickedGoods, rand);
    solution = feeApplied.solution;
    distractors = feeApplied.distractors;
    const branchBundle = createEarlyBranchTrades(solution, rand);

    const inventory = createEmptyInventory();
    const startTrade = solution[0];
    const startGive = startTrade?.give[0];
    if (startGive) {
      inventory[startGive.good] = startGive.qty;
    }
    if (config.surplus > 0) {
      if (startGive) {
        inventory[startGive.good] += Math.max(
          1,
          Math.floor(startGive.qty * config.surplus)
        );
      }
    }
    (Object.keys(feeApplied.feeTotals) as GoodId[]).forEach((goodId) => {
      const qty = feeApplied.feeTotals[goodId];
      if (qty > 0) {
        inventory[goodId] += qty;
      }
    });
    if (branchBundle) {
      inventory[branchBundle.startGood] = Math.max(
        inventory[branchBundle.startGood],
        branchBundle.startQty
      );
    }
    (Object.keys(inventory) as GoodId[]).forEach((goodId) => {
      inventory[goodId] = Math.min(200, inventory[goodId]);
    });

    const branchTrades = branchBundle ? branchBundle.branch : [];
    const existingKeys = new Set(
      [...solution, ...distractors].map((trade) => tradeKey(trade))
    );
    const uniqueBranch = branchTrades.filter((trade) => !existingKeys.has(tradeKey(trade)));
    const trades = seededShuffle([...solution, ...distractors, ...uniqueBranch], rand);

    return {
      id: `barter-${baseSeed}`,
      dateKey: getDateKey(date),
      difficulty,
      marketName: MARKETS[baseSeed % MARKETS.length].name,
      marketEmoji: MARKETS[baseSeed % MARKETS.length].emoji,
      goods,
      inventory,
      goal: { good: goalGood, qty: goalQty },
      trades,
      solution,
      par,
      maxTrades: par + config.slack,
      earlyWindowTrades,
    };
  };

  const shortestPathLength = (puzzle: BarterPuzzle): number | null => {
    const ids = puzzle.goods.map((g) => g.id);
    const encode = (inv: Record<GoodId, number>) => ids.map((id) => inv[id]).join(',');
    const queue: Array<{ inv: Record<GoodId, number>; steps: number }> = [
      { inv: puzzle.inventory, steps: 0 },
    ];
    const earlyVisited = new Map<string, number>();
    const lateVisited = new Set<string>();
    earlyVisited.set(encode(puzzle.inventory), 0);

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      const { inv, steps } = current;
      if (steps >= puzzle.maxTrades) continue;
      const inEarly = steps < puzzle.earlyWindowTrades;
      const trades = puzzle.trades.filter((trade) =>
        inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
      );

      for (const trade of trades) {
        const canTrade = trade.give.every((side) => inv[side.good] >= side.qty);
        if (!canTrade) continue;
        const next = { ...inv };
        trade.give.forEach((side) => {
          next[side.good] -= side.qty;
        });
        next[trade.get.good] += trade.get.qty;
        ids.forEach((id) => {
          next[id] = Math.min(200, next[id]);
        });
        const nextSteps = steps + 1;
        if (next[ puzzle.goal.good ] >= puzzle.goal.qty) {
          return nextSteps;
        }
        if (nextSteps >= puzzle.maxTrades) continue;

        const key = encode(next);
        if (nextSteps < puzzle.earlyWindowTrades) {
          const prev = earlyVisited.get(key);
          if (prev !== undefined && prev <= nextSteps) continue;
          earlyVisited.set(key, nextSteps);
        } else {
          if (lateVisited.has(key)) continue;
          lateVisited.add(key);
        }
        queue.push({ inv: next, steps: nextSteps });
      }
    }
    return null;
  };

  const hasBranch = (puzzle: BarterPuzzle): boolean => {
    const solutionKeys = new Set(puzzle.solution.map((trade) => tradeKey(trade)));
    const earlyTrades = puzzle.trades.filter((trade) => trade.window !== 'late');
    const branchTrades = earlyTrades.filter((trade) => !solutionKeys.has(tradeKey(trade)));
    return branchTrades.length >= puzzle.earlyWindowTrades;
  };

  let lastCandidate: BarterPuzzle | null = null;
  for (let attempt = 0; attempt < 24; attempt++) {
    const candidateSeed = baseSeed + attempt * 7919;
    const candidate = buildCandidate(candidateSeed);
    lastCandidate = candidate;
    const shortest = shortestPathLength(candidate);
    if (
      shortest !== null &&
      shortest >= 8 &&
      shortest <= 11 &&
      shortest <= candidate.par &&
      hasBranch(candidate)
    ) {
      return candidate;
    }
  }

  return lastCandidate ?? buildCandidate(baseSeed);
}

export function getDailyBarter(date: Date = new Date()): BarterPuzzle {
  return generatePuzzle(getDailySeed(date), date);
}

export function getGoodById(id: GoodId): Good {
  return GOOD_MAP[id];
}
