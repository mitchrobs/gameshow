import { GOODS, createEmptyInventory, orderGoods } from './goods.ts';
import { canonicalizeTrade } from './engine.ts';
import { mulberry32, seededPick, seededShuffle } from './random.ts';
import { validateBarterQuality } from './quality.ts';
import type {
  BarterDifficulty,
  BarterPuzzle,
  GoodId,
  Inventory,
  Trade,
} from './types.ts';
import { BarterGenerationError } from './types.ts';

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

const DAILY_CACHE = new Map<string, BarterPuzzle>();

interface MarketPlan {
  goods: GoodId[];
  inventory: Inventory;
  goal: { good: GoodId; qty: number };
  trades: Trade[];
  solution: Trade[];
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

function getDifficultyForDate(_date: Date = new Date()): BarterDifficulty {
  return 'Hard';
}

function pickPlanGoods(rand: () => number): {
  sourceA: GoodId;
  sourceB: GoodId;
  catalyst: GoodId;
  enginePart: GoodId;
  tempoPart: GoodId;
  goal: GoodId;
  goods: GoodId[];
} {
  const commons = seededShuffle(
    GOODS.filter((good) => good.tier === 'common').map((good) => good.id),
    rand
  );
  const uncommons = seededShuffle(
    GOODS.filter((good) => good.tier === 'uncommon').map((good) => good.id),
    rand
  );
  const rares = GOODS.filter((good) => good.tier === 'rare').map((good) => good.id);
  const [sourceA, sourceB, catalyst] = commons;
  const [enginePart, tempoPart] = uncommons;
  const goal = seededPick(rares, rand);

  return {
    sourceA,
    sourceB,
    catalyst,
    enginePart,
    tempoPart,
    goal,
    goods: [sourceA, sourceB, catalyst, enginePart, tempoPart, goal],
  };
}

function buildMarketPlan(seed: number): MarketPlan {
  const rand = mulberry32(seed);
  const picks = pickPlanGoods(rand);
  const inventory = createEmptyInventory();
  inventory[picks.sourceA] = 9;
  inventory[picks.sourceB] = 4;

  const earlyEngineSetup: Trade = {
    give: [{ good: picks.sourceA, qty: 4 }],
    receive: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.enginePart, qty: 1 },
    ],
    window: 'early',
    stage: 1,
    role: 'engine_setup',
    line: 'engine',
  };
  const earlyTempoOpen: Trade = {
    give: [{ good: picks.sourceB, qty: 4 }],
    receive: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    window: 'early',
    stage: 2,
    role: 'tempo',
    line: 'tempo',
  };
  const earlyTempoBalance: Trade = {
    give: [{ good: picks.sourceA, qty: 5 }],
    receive: [
      { good: picks.enginePart, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    window: 'early',
    stage: 3,
    role: 'tempo',
    line: 'tempo',
  };
  const enginePayoff: Trade = {
    give: [{ good: picks.enginePart, qty: 1 }],
    receive: [{ good: picks.tempoPart, qty: 1 }],
    window: 'late',
    stage: 4,
    role: 'engine_payoff',
    line: 'engine',
  };
  const tempoBailout: Trade = {
    give: [{ good: picks.enginePart, qty: 1 }],
    receive: [{ good: picks.catalyst, qty: 1 }],
    window: 'late',
    stage: 5,
    role: 'tempo_bailout',
    line: 'tempo',
  };
  const compoundGate: Trade = {
    give: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    receive: [{ good: picks.goal, qty: 1 }],
    window: 'late',
    stage: 6,
    role: 'compound_gate',
    line: 'shared',
  };
  const trades = [
    earlyEngineSetup,
    earlyTempoOpen,
    earlyTempoBalance,
    enginePayoff,
    tempoBailout,
    compoundGate,
  ].map(canonicalizeTrade);

  return {
    goods: picks.goods,
    inventory,
    goal: { good: picks.goal, qty: 3 },
    trades,
    solution: [
      earlyEngineSetup,
      earlyEngineSetup,
      earlyTempoOpen,
      enginePayoff,
      enginePayoff,
      compoundGate,
      compoundGate,
      compoundGate,
    ].map(canonicalizeTrade),
  };
}

function buildPuzzleFromPlan(seed: number, date: Date, plan: MarketPlan): BarterPuzzle {
  const market = MARKETS[Math.abs(seed) % MARKETS.length];
  return {
    id: `barter-${seed}`,
    dateKey: getDateKey(date),
    difficulty: getDifficultyForDate(date),
    marketName: market.name,
    marketEmoji: market.emoji,
    goods: orderGoods(plan.goods),
    inventory: plan.inventory,
    goal: plan.goal,
    trades: seededShuffle(plan.trades, mulberry32(seed ^ 0x9e3779b9)),
    solution: plan.solution,
    par: 8,
    maxTrades: 12,
    earlyWindowTrades: 3,
  };
}

function buildAuthoredFallback(date: Date): BarterPuzzle {
  return buildPuzzleFromPlan(20260416, date, buildMarketPlan(20260416));
}

export function generateBarterPuzzle(seed: number, date: Date = new Date()): BarterPuzzle {
  const puzzle = buildPuzzleFromPlan(seed, date, buildMarketPlan(seed));
  const report = validateBarterQuality(puzzle);
  if (report.accepted) return { ...puzzle, par: report.shortestPathLength ?? puzzle.par };

  const fallback = buildAuthoredFallback(date);
  const fallbackReport = validateBarterQuality(fallback);
  if (fallbackReport.accepted) {
    return { ...fallback, id: `barter-${seed}`, dateKey: getDateKey(date) };
  }

  throw new BarterGenerationError(
    'Unable to generate a Barter puzzle that passes quality gates.',
    [...report.violations, ...fallbackReport.violations]
  );
}

export function getDailyBarter(date: Date = new Date()): BarterPuzzle {
  const key = getDateKey(date);
  const cached = DAILY_CACHE.get(key);
  if (cached) return cached;
  const puzzle = generateBarterPuzzle(getDailySeed(date), date);
  DAILY_CACHE.set(key, puzzle);
  return puzzle;
}

export function getBarterTutorialPuzzle(): BarterPuzzle {
  const inventory = createEmptyInventory();
  inventory.spice = 4;
  inventory.wool = 1;
  const tutorialTrades: Trade[] = [
    {
      give: [{ good: 'spice', qty: 2 }],
      receive: [
        { good: 'tea', qty: 1 },
        { good: 'silk', qty: 1 },
      ],
      window: 'early',
      role: 'engine_setup',
      line: 'engine',
    },
    {
      give: [{ good: 'wool', qty: 1 }],
      receive: [{ good: 'porcelain', qty: 1 }],
      window: 'early',
      role: 'tempo',
      line: 'tempo',
    },
    {
      give: [
        { good: 'tea', qty: 1 },
        { good: 'porcelain', qty: 1 },
      ],
      receive: [{ good: 'gold', qty: 1 }],
      window: 'late',
      role: 'compound_gate',
      line: 'shared',
    },
  ];
  const trades = tutorialTrades.map(canonicalizeTrade);

  return {
    id: 'barter-tutorial',
    dateKey: 'tutorial',
    difficulty: 'Easy',
    marketName: 'Training Stall',
    marketEmoji: '🏺',
    goods: orderGoods(['spice', 'wool', 'tea', 'silk', 'porcelain', 'gold']),
    inventory,
    goal: { good: 'gold', qty: 1 },
    trades,
    solution: trades,
    par: 3,
    maxTrades: 4,
    earlyWindowTrades: 2,
  };
}
