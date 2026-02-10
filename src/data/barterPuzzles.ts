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
  stage?: number;
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
  Hard: { goods: 6, parRange: [8, 10], surplus: 0, slack: 2, distractors: 0 },
} as const;

const MIN_PATH_LENGTH = 8;
const MAX_PATH_LENGTH = 10;
const MIN_EARLY_PATHS = 2;
const MIN_SOLUTION_PATHS = 2;
const PATH_COUNT_CAP = 3;

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
  return trades.map((trade, index) => ({ ...trade, stage: index + 1 }));
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
    stage: trade.stage,
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
  rand: () => number,
  excludedFeeGoods: Set<GoodId>
): { solution: Trade[]; distractors: Trade[]; feeTotals: Record<GoodId, number> } {
  const commons = goods.filter((id) => GOOD_MAP[id].tier === 'common');
  const feeTotals = createEmptyInventory();

  const addFee = (trade: Trade, countFees: boolean): Trade => {
    if (trade.window !== 'late') return trade;
    const primary = trade.give[0];
    if (!primary) return trade;
    const excluded = new Set(trade.give.map((side) => side.good));
    excludedFeeGoods.forEach((id) => excluded.add(id));
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

function getTradeWindowForStage(stage: number, earlyWindowTrades: number): TradeWindow {
  return stage <= earlyWindowTrades ? 'early' : 'late';
}

function createBranchTrades(
  solution: Trade[],
  startIndex: number,
  earlyWindowTrades: number,
  rand: () => number,
  existingKeys: Set<string>
): Trade[] | null {
  const first = solution[startIndex];
  const second = solution[startIndex + 1];
  const third = solution[startIndex + 2];
  if (!first || !second || !third) return null;
  const primaryFirst = first.give[0];
  const primarySecond = second.give[0];
  const primaryThird = third.give[0];
  if (!primaryFirst || !primarySecond || !primaryThird) return null;

  const g0 = primaryFirst.good;
  const q0 = primaryFirst.qty;
  const g1 = first.get.good;
  const q1 = first.get.qty;
  const g2 = second.get.good;
  const q2 = second.get.qty;
  const g3 = third.get.good;
  const q3 = third.get.qty;
  if (g0 === g2 || g1 === g3 || g0 === g1 || g2 === g3) {
    return null;
  }

  const stage1 = first.stage ?? startIndex + 1;
  const stage2 = stage1 + 1;
  const stage3 = stage1 + 2;
  if (
    (second.stage ?? startIndex + 2) !== stage2 ||
    (third.stage ?? startIndex + 3) !== stage3
  ) {
    return null;
  }

  const maxGive = Math.max(1, q0);
  const targetGive = getGiveQty(g0, g2, q2, rand);
  const preferredGive = Math.max(1, Math.min(maxGive, targetGive));

  let branchFirst: Trade | null = null;
  const attempted = new Set<number>();
  const candidateQtys = [
    preferredGive,
    maxGive,
    Math.max(1, Math.floor(maxGive * 0.7)),
    Math.max(1, Math.floor(maxGive * 0.5)),
  ];
  for (let i = 0; i < 4; i++) {
    candidateQtys.push(randInt(rand, 1, maxGive));
  }
  for (const qty of candidateQtys) {
    if (attempted.has(qty)) continue;
    attempted.add(qty);
    const candidate: Trade = {
      give: [{ good: g0, qty }],
      get: { good: g2, qty: q2 },
      window: getTradeWindowForStage(stage1, earlyWindowTrades),
      stage: stage1,
    };
    if (!existingKeys.has(tradeKey(candidate))) {
      branchFirst = candidate;
      break;
    }
  }
  if (!branchFirst) return null;

  const branch: Trade[] = [
    branchFirst,
    {
      give: [{ good: g2, qty: q2 }],
      get: { good: g1, qty: q1 },
      window: getTradeWindowForStage(stage2, earlyWindowTrades),
      stage: stage2,
    },
    {
      give: [{ good: g1, qty: q1 }],
      get: { good: g3, qty: q3 },
      window: getTradeWindowForStage(stage3, earlyWindowTrades),
      stage: stage3,
    },
  ];

  const branchKeys = new Set<string>();
  for (const trade of branch) {
    const key = tradeKey(trade);
    if (existingKeys.has(key) || branchKeys.has(key)) return null;
    branchKeys.add(key);
  }

  return branch;
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

    const earlyFeeExclusions = new Set<GoodId>([goalGood]);
    solution
      .filter((trade) => trade.window === 'early')
      .forEach((trade) => {
        trade.give.forEach((side) => earlyFeeExclusions.add(side.good));
        earlyFeeExclusions.add(trade.get.good);
      });
    const feeApplied = applyLateFees(
      solution,
      distractors,
      pickedGoods,
      rand,
      earlyFeeExclusions
    );
    solution = feeApplied.solution;
    distractors = feeApplied.distractors;

    const existingKeys = new Set(
      [...solution, ...distractors].map((trade) => tradeKey(trade))
    );
    const branchTrades: Trade[] = [];
    const earlyBranch = createBranchTrades(
      solution,
      0,
      earlyWindowTrades,
      rand,
      existingKeys
    );
    if (earlyBranch) {
      earlyBranch.forEach((trade) => existingKeys.add(tradeKey(trade)));
      branchTrades.push(...earlyBranch);
    }

    const lateStartIndices = seededShuffle(
      solution
        .map((_, index) => index)
        .filter((index) => index >= earlyWindowTrades && index + 2 < solution.length),
      rand
    );
    for (const startIndex of lateStartIndices) {
      const lateBranch = createBranchTrades(
        solution,
        startIndex,
        earlyWindowTrades,
        rand,
        existingKeys
      );
      if (!lateBranch) continue;
      lateBranch.forEach((trade) => existingKeys.add(tradeKey(trade)));
      branchTrades.push(...lateBranch);
      break;
    }

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
    inventory[goalGood] = 0;
    (Object.keys(inventory) as GoodId[]).forEach((goodId) => {
      inventory[goodId] = Math.min(200, inventory[goodId]);
    });

    const trades = seededShuffle(
      [...solution, ...distractors, ...branchTrades],
      rand
    );

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
      const encode = (inv: Record<GoodId, number>, stage: number) =>
        `${stage}|${ids.map((id) => inv[id]).join(',')}`;
      const queue: Array<{ inv: Record<GoodId, number>; steps: number; stage: number }> = [
        { inv: puzzle.inventory, steps: 0, stage: 0 },
      ];
      const earlyVisited = new Map<string, number>();
      const lateVisited = new Set<string>();
      earlyVisited.set(encode(puzzle.inventory, 0), 0);

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current) break;
        const { inv, steps, stage } = current;
        if (steps >= puzzle.maxTrades) continue;
        const inEarly = steps < puzzle.earlyWindowTrades;
        const trades = puzzle.trades.filter((trade) =>
          inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
        );

        for (const trade of trades) {
          const requiredStage = stage + 1;
          const tradeStage = trade.stage ?? requiredStage;
          if (tradeStage !== requiredStage) continue;
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

          const key = encode(next, tradeStage);
          if (nextSteps < puzzle.earlyWindowTrades) {
            const prev = earlyVisited.get(key);
            if (prev !== undefined && prev <= nextSteps) continue;
            earlyVisited.set(key, nextSteps);
          } else {
            if (lateVisited.has(key)) continue;
            lateVisited.add(key);
          }
          queue.push({ inv: next, steps: nextSteps, stage: tradeStage });
        }
      }
      return null;
    };

    const countPathsToStage = (
      puzzle: BarterPuzzle,
      targetStage: number,
      maxCount: number
    ): number => {
      const ids = puzzle.goods.map((g) => g.id);
      const encode = (inv: Record<GoodId, number>) =>
        ids.map((id) => inv[id]).join(',');
      let states = new Map<string, { inv: Record<GoodId, number>; count: number }>();
      states.set(encode(puzzle.inventory), { inv: puzzle.inventory, count: 1 });

      let total = 0;
      for (let steps = 0; steps < targetStage; steps++) {
        const inEarly = steps < puzzle.earlyWindowTrades;
        const trades = puzzle.trades.filter((trade) =>
          inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
        );
        const nextStates = new Map<string, { inv: Record<GoodId, number>; count: number }>();

        for (const { inv, count } of states.values()) {
          for (const trade of trades) {
            const requiredStage = steps + 1;
            const tradeStage = trade.stage ?? requiredStage;
            if (tradeStage !== requiredStage) continue;
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

            if (steps + 1 === targetStage) {
              total = Math.min(maxCount, total + count);
              if (total >= maxCount) return total;
              continue;
            }

            const key = encode(next);
            const prev = nextStates.get(key);
            const nextCount = Math.min(maxCount, (prev?.count ?? 0) + count);
            if (prev) {
              prev.count = nextCount;
            } else {
              nextStates.set(key, { inv: next, count: nextCount });
            }
          }
        }

        states = nextStates;
        if (states.size === 0) break;
      }

      return total;
    };

    const countSolutions = (puzzle: BarterPuzzle, maxCount: number): number => {
      const ids = puzzle.goods.map((g) => g.id);
      const encode = (inv: Record<GoodId, number>) =>
        ids.map((id) => inv[id]).join(',');
      let states = new Map<string, { inv: Record<GoodId, number>; count: number }>();
      states.set(encode(puzzle.inventory), { inv: puzzle.inventory, count: 1 });

      let total = 0;
      for (let steps = 0; steps < puzzle.maxTrades; steps++) {
        const inEarly = steps < puzzle.earlyWindowTrades;
        const trades = puzzle.trades.filter((trade) =>
          inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
        );
        const nextStates = new Map<string, { inv: Record<GoodId, number>; count: number }>();

        for (const { inv, count } of states.values()) {
          for (const trade of trades) {
            const requiredStage = steps + 1;
            const tradeStage = trade.stage ?? requiredStage;
            if (tradeStage !== requiredStage) continue;
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

            if (next[puzzle.goal.good] >= puzzle.goal.qty) {
              total = Math.min(maxCount, total + count);
              if (total >= maxCount) return total;
              continue;
            }

            const nextSteps = steps + 1;
            if (nextSteps >= puzzle.maxTrades) continue;

            const key = encode(next);
            const prev = nextStates.get(key);
            const nextCount = Math.min(maxCount, (prev?.count ?? 0) + count);
            if (prev) {
              prev.count = nextCount;
            } else {
              nextStates.set(key, { inv: next, count: nextCount });
            }
          }
        }

        states = nextStates;
        if (states.size === 0) break;
      }

      return total;
    };

  for (let attempt = 0; attempt < 512; attempt++) {
    const candidateSeed = baseSeed + attempt * 7919;
    const candidate = buildCandidate(candidateSeed);
    const shortest = shortestPathLength(candidate);
    const earlyPaths = countPathsToStage(
      candidate,
      candidate.earlyWindowTrades,
      PATH_COUNT_CAP
    );
    const solutionPaths = countSolutions(candidate, PATH_COUNT_CAP);
    if (
      shortest !== null &&
      shortest >= MIN_PATH_LENGTH &&
      shortest <= MAX_PATH_LENGTH &&
      candidate.par >= MIN_PATH_LENGTH &&
      candidate.par <= MAX_PATH_LENGTH &&
      earlyPaths >= MIN_EARLY_PATHS &&
      solutionPaths >= MIN_SOLUTION_PATHS
    ) {
      return candidate;
    }
  }
  throw new Error('Unable to generate a barter puzzle within trade path constraints.');
}

export function getDailyBarter(date: Date = new Date()): BarterPuzzle {
  return generatePuzzle(getDailySeed(date), date);
}

export function getGoodById(id: GoodId): Good {
  return GOOD_MAP[id];
}
