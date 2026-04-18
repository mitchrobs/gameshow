import { GOODS, createEmptyInventory, orderGoods } from './goods.ts';
import { canonicalizeTrade, tradeKey } from './engine.ts';
import { getMarketThemeBySeed, skinGoodsForMarket } from './markets.ts';
import { mulberry32, seededPick, seededShuffle } from './random.ts';
import { validateBarterQuality } from './quality.ts';
import type {
  BarterDifficulty,
  BarterPuzzle,
  BarterTopology,
  GoodId,
  HiddenVendorPurpose,
  Inventory,
  Trade,
} from './types.ts';
import { BarterGenerationError } from './types.ts';

const DAILY_CACHE = new Map<string, BarterPuzzle>();

interface PlanGoods {
  sourceA: GoodId;
  sourceB: GoodId;
  catalyst: GoodId;
  enginePart: GoodId;
  tempoPart: GoodId;
  goal: GoodId;
  goods: GoodId[];
}

interface TunableParams {
  sourceAQty: number;
  sourceBQty: number;
  catalystQty: number;
  goalQty: number;
  engineCost: number;
  balanceCost: number;
  falseFriendCost: number;
  payoffQty: number;
  earlyWindowTrades: number;
  expectedPar: number;
}

interface TopologyTemplate {
  id: BarterTopology;
  thesis: string;
  hiddenVendorPurpose: HiddenVendorPurpose;
  primary: TunableParams;
  sourceADeltas?: number[];
  balanceDeltas?: number[];
  payoffDeltas?: number[];
}

interface MarketPlan {
  topology: BarterTopology;
  thesis: string;
  hiddenVendorPurpose: HiddenVendorPurpose;
  goods: GoodId[];
  inventory: Inventory;
  goal: { good: GoodId; qty: number };
  trades: Trade[];
  solution: Trade[];
  expectedPar: number;
  earlyWindowTrades: number;
}

const TOPOLOGY_TEMPLATES: TopologyTemplate[] = [
  {
    id: 'balanced_pair',
    thesis: 'Keep the two prepared goods synchronized; the night market only pays when the pair stays even.',
    hiddenVendorPurpose: 'recovery',
    primary: {
      sourceAQty: 15,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 4,
      engineCost: 5,
      balanceCost: 6,
      falseFriendCost: 4,
      payoffQty: 2,
      earlyWindowTrades: 4,
      expectedPar: 10,
    },
    sourceADeltas: [0, 1, 2],
    balanceDeltas: [0, 1, 2],
  },
  {
    id: 'catalyst_debt',
    thesis: 'Borrow against a scarce catalyst early, then make sure the night market can rebuild it.',
    hiddenVendorPurpose: 'safety_valve',
    primary: {
      sourceAQty: 17,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 5,
      engineCost: 5,
      balanceCost: 7,
      falseFriendCost: 4,
      payoffQty: 2,
      earlyWindowTrades: 4,
      expectedPar: 11,
    },
    sourceADeltas: [-1, 0, 1, 2],
    balanceDeltas: [-1, 0, 1],
  },
  {
    id: 'scarce_bridge',
    thesis: 'One bridge good has two tempting uses; the clean route spends it only after the payoff is visible.',
    hiddenVendorPurpose: 'alternate',
    primary: {
      sourceAQty: 16,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 5,
      engineCost: 5,
      balanceCost: 6,
      falseFriendCost: 4,
      payoffQty: 2,
      earlyWindowTrades: 4,
      expectedPar: 11,
    },
    sourceADeltas: [0, 1, 2, 3],
    balanceDeltas: [0, 1, 2],
  },
  {
    id: 'tempo_discount',
    thesis: 'The quick route is real, but only if the discount still leaves enough paired goods to cash out.',
    hiddenVendorPurpose: 'recovery',
    primary: {
      sourceAQty: 16,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 4,
      engineCost: 6,
      balanceCost: 7,
      falseFriendCost: 5,
      payoffQty: 2,
      earlyWindowTrades: 4,
      expectedPar: 10,
    },
    sourceADeltas: [-1, 0, 1, 2],
    balanceDeltas: [-1, 0, 1],
  },
  {
    id: 'night_pivot',
    thesis: 'Most of the night market is readable up front; the hidden stall is a pivot, not the whole answer.',
    hiddenVendorPurpose: 'alternate',
    primary: {
      sourceAQty: 20,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 5,
      engineCost: 5,
      balanceCost: 6,
      falseFriendCost: 4,
      payoffQty: 2,
      earlyWindowTrades: 5,
      expectedPar: 12,
    },
    sourceADeltas: [0, 1, 2],
    balanceDeltas: [0, 1, 2],
  },
  {
    id: 'delayed_multiplier',
    thesis: 'A slower setup unlocks a better night multiplier; rushing creates extra cleanup.',
    hiddenVendorPurpose: 'compression',
    primary: {
      sourceAQty: 22,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 6,
      engineCost: 5,
      balanceCost: 7,
      falseFriendCost: 4,
      payoffQty: 3,
      earlyWindowTrades: 5,
      expectedPar: 13,
    },
    sourceADeltas: [-1, 0, 1, 2, 3],
    balanceDeltas: [-1, 0, 1],
  },
  {
    id: 'split_pipeline',
    thesis: 'Two pipelines look useful, but the best route commits to one and uses the other as a bridge.',
    hiddenVendorPurpose: 'alternate',
    primary: {
      sourceAQty: 21,
      sourceBQty: 4,
      catalystQty: 2,
      goalQty: 6,
      engineCost: 5,
      balanceCost: 7,
      falseFriendCost: 4,
      payoffQty: 3,
      earlyWindowTrades: 5,
      expectedPar: 13,
    },
    sourceADeltas: [-1, 0, 1, 2],
    balanceDeltas: [-1, 0, 1],
  },
  {
    id: 'compression_route',
    thesis: 'The compound bundle is not decoration; it compresses a whole turn if the day market prepares both halves.',
    hiddenVendorPurpose: 'compression',
    primary: {
      sourceAQty: 23,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 6,
      engineCost: 5,
      balanceCost: 6,
      falseFriendCost: 4,
      payoffQty: 3,
      earlyWindowTrades: 5,
      expectedPar: 13,
    },
    sourceADeltas: [-2, -1, 0, 1, 2],
    balanceDeltas: [0, 1, 2],
  },
  {
    id: 'overproduction_trap',
    thesis: 'Making more of one ingredient feels powerful, but par belongs to the route that stops overproducing.',
    hiddenVendorPurpose: 'safety_valve',
    primary: {
      sourceAQty: 20,
      sourceBQty: 4,
      catalystQty: 1,
      goalQty: 6,
      engineCost: 5,
      balanceCost: 7,
      falseFriendCost: 4,
      payoffQty: 2,
      earlyWindowTrades: 5,
      expectedPar: 14,
    },
    sourceADeltas: [0, 1, 2],
    balanceDeltas: [0, 1],
  },
];

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

function pickPlanGoods(rand: () => number): PlanGoods {
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

function canonicalTrades(trades: Trade[]): Trade[] {
  return trades.map(canonicalizeTrade);
}

function tunedParams(template: TopologyTemplate, seed: number): TunableParams[] {
  const sourceADeltas = template.sourceADeltas ?? [0];
  const balanceDeltas = template.balanceDeltas ?? [0];
  const payoffDeltas = template.payoffDeltas ?? [0];
  const variants: TunableParams[] = [];
  sourceADeltas.forEach((sourceADelta) => {
    balanceDeltas.forEach((balanceDelta) => {
      payoffDeltas.forEach((payoffDelta) => {
        variants.push({
          ...template.primary,
          sourceAQty: template.primary.sourceAQty + sourceADelta,
          balanceCost: template.primary.balanceCost + balanceDelta,
          payoffQty: template.primary.payoffQty + payoffDelta,
        });
      });
    });
  });
  return seededShuffle(
    variants.filter(
      (params) =>
        params.sourceAQty > 0 &&
        params.sourceBQty > 0 &&
        params.engineCost > 0 &&
        params.balanceCost > 0 &&
        params.falseFriendCost > 0 &&
        params.payoffQty > 0
    ),
    mulberry32(seed ^ 0x7a11cab1)
  );
}

function buildMarketPlan(
  seed: number,
  template: TopologyTemplate,
  params: TunableParams
): MarketPlan {
  const rand = mulberry32(seed ^ template.id.length);
  const picks = pickPlanGoods(rand);
  const inventory = createEmptyInventory();
  inventory[picks.sourceA] = params.sourceAQty;
  inventory[picks.sourceB] = params.sourceBQty;
  inventory[picks.catalyst] = params.catalystQty;

  const earlyEngineSetup: Trade = {
    give: [{ good: picks.sourceA, qty: params.engineCost }],
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
    give: [{ good: picks.sourceB, qty: params.sourceBQty }],
    receive: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    window: 'early',
    stage: 2,
    role: 'tempo',
    line: 'tempo',
  };
  const earlyBalance: Trade = {
    give: [{ good: picks.sourceA, qty: params.balanceCost }],
    receive: [
      { good: picks.enginePart, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    window: 'early',
    stage: 3,
    role: template.id === 'balanced_pair' ? 'tempo' : 'variant',
    line: template.id === 'split_pipeline' ? 'shared' : 'tempo',
    variant: template.id !== 'balanced_pair',
  };
  const falseFriend: Trade = {
    give: [
      { good: picks.sourceA, qty: params.falseFriendCost },
      { good: picks.catalyst, qty: 1 },
    ],
    receive: [{ good: picks.enginePart, qty: 2 }],
    window: 'early',
    stage: 4,
    role: 'variant',
    line: 'shared',
    variant: true,
  };
  const enginePayoff: Trade = {
    give: [{ good: picks.enginePart, qty: 1 }],
    receive: [{ good: picks.tempoPart, qty: params.payoffQty }],
    window: 'late',
    stage: 5,
    role: 'engine_payoff',
    line: 'engine',
  };
  const hiddenTempoBailout: Trade = {
    give: [{ good: picks.enginePart, qty: 1 }],
    receive: [{ good: picks.catalyst, qty: 1 }],
    window: 'late',
    stage: 6,
    role: 'tempo_bailout',
    line: 'tempo',
    hiddenUntilNight: true,
  };
  const compoundGate: Trade = {
    give: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.tempoPart, qty: 1 },
    ],
    receive: [{ good: picks.goal, qty: 1 }],
    window: 'late',
    stage: 7,
    role: 'compound_gate',
    line: 'shared',
  };
  const engineDiscount: Trade = {
    give: [
      { good: picks.catalyst, qty: 1 },
      { good: picks.enginePart, qty: 1 },
    ],
    receive: [{ good: picks.tempoPart, qty: Math.max(2, params.payoffQty - 1) }],
    window: 'late',
    stage: 8,
    role: 'engine_payoff',
    line: 'engine',
    variant: true,
  };
  const trades = [
    earlyEngineSetup,
    earlyTempoOpen,
    earlyBalance,
    falseFriend,
    enginePayoff,
    hiddenTempoBailout,
    compoundGate,
    engineDiscount,
  ];

  return {
    topology: template.id,
    thesis: template.thesis,
    hiddenVendorPurpose: template.hiddenVendorPurpose,
    goods: picks.goods,
    inventory,
    goal: { good: picks.goal, qty: params.goalQty },
    trades: canonicalTrades(trades),
    solution: canonicalTrades([
      earlyEngineSetup,
      earlyEngineSetup,
      earlyTempoOpen,
      earlyBalance,
      enginePayoff,
      ...Array.from({ length: params.goalQty }, () => compoundGate),
    ]),
    expectedPar: params.expectedPar,
    earlyWindowTrades: params.earlyWindowTrades,
  };
}

function buildPuzzleFromPlan(seed: number, date: Date, plan: MarketPlan): BarterPuzzle {
  const market = getMarketThemeBySeed(seed);
  const orderedGoods = orderGoods(plan.goods);
  return {
    id: `barter-${seed}`,
    dateKey: getDateKey(date),
    difficulty: getDifficultyForDate(date),
    marketName: market.name,
    marketEmoji: market.emoji,
    goods: skinGoodsForMarket(orderedGoods, market),
    inventory: plan.inventory,
    goal: plan.goal,
    trades: seededShuffle(plan.trades, mulberry32(seed ^ 0x9e3779b9)),
    solution: plan.solution,
    par: plan.expectedPar,
    maxTrades: plan.expectedPar + 2,
    earlyWindowTrades: plan.earlyWindowTrades,
    archetype: plan.topology,
    topology: plan.topology,
    thesis: plan.thesis,
    hiddenVendorPurpose: plan.hiddenVendorPurpose,
  };
}

function buildAuthoredFallback(date: Date): BarterPuzzle {
  const template = TOPOLOGY_TEMPLATES[0];
  return buildPuzzleFromPlan(
    20260416,
    date,
    buildMarketPlan(20260416, template, template.primary)
  );
}

function withAnalyzedSolution(puzzle: BarterPuzzle, report: ReturnType<typeof validateBarterQuality>): BarterPuzzle {
  const par = report.shortestPathLength ?? puzzle.par;
  const solution =
    report.bestRoute?.tradeKeys
      .map((key) => puzzle.trades.find((trade) => tradeKey(trade) === key))
      .filter((trade): trade is Trade => Boolean(trade)) ?? puzzle.solution;
  return { ...puzzle, par, maxTrades: par + 2, solution };
}

export function generateBarterPuzzle(seed: number, date: Date = new Date()): BarterPuzzle {
  const primaryIndex = Math.abs(seed) % TOPOLOGY_TEMPLATES.length;
  const templates = [
    TOPOLOGY_TEMPLATES[primaryIndex],
    ...TOPOLOGY_TEMPLATES.filter((_, index) => index !== primaryIndex),
  ];
  const violations: string[] = [];

  for (const template of templates) {
    for (const params of tunedParams(template, seed)) {
      const puzzle = buildPuzzleFromPlan(seed, date, buildMarketPlan(seed, template, params));
      const report = validateBarterQuality(puzzle);
      if (report.accepted) {
        return withAnalyzedSolution(puzzle, report);
      }
      violations.push(
        `${template.id}/${params.expectedPar}: ${report.violations.slice(0, 3).join(', ')}`
      );
    }
  }

  const fallback = buildAuthoredFallback(date);
  const fallbackReport = validateBarterQuality(fallback);
  if (fallbackReport.accepted) {
    return { ...withAnalyzedSolution(fallback, fallbackReport), id: `barter-${seed}`, dateKey: getDateKey(date) };
  }

  throw new BarterGenerationError(
    'Unable to generate a Barter puzzle that passes quality gates.',
    [...violations, ...fallbackReport.violations]
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
    topology: 'balanced_pair',
    archetype: 'balanced_pair',
    thesis: 'Day trades prepare the pair that night turns into the goal.',
    hiddenVendorPurpose: 'recovery',
  };
}
