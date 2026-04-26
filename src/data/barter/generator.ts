import { GOODS, createEmptyInventory, orderGoods } from './goods.ts';
import { canonicalizeTrade, tradeKey } from './engine.ts';
import { getMarketThemeBySeed, skinGoodsForMarket } from './markets.ts';
import { mulberry32, seededPick, seededShuffle } from './random.ts';
import { validateBarterQuality } from './quality.ts';
import type {
  BarterDifficulty,
  BarterPuzzle,
  BarterTexture,
  BarterTopology,
  EconomicThesis,
  FeltMarketThesis,
  GoodId,
  HiddenVendorPurpose,
  Inventory,
  NightVendorRole,
  StartEconomy,
  StrategyLineId,
  Trade,
  TradeRole,
  TradeSide,
} from './types.ts';
import { BarterGenerationError } from './types.ts';

const DAILY_CACHE = new Map<string, BarterPuzzle>();
const PORTFOLIO_START_UTC = Date.UTC(2026, 3, 16);
const DAY_MS = 24 * 60 * 60 * 1000;

type PortfolioPar = 8 | 9 | 10 | 11;

interface PlanGoods {
  sourceA: GoodId;
  sourceB: GoodId;
  catalyst: GoodId;
  enginePart: GoodId;
  tempoPart: GoodId;
  goal: GoodId;
  goods: GoodId[];
}

interface QualityTargets {
  texture: BarterTexture;
  intendedPar: PortfolioPar;
  feltThesis: FeltMarketThesis;
  startEconomy: StartEconomy;
  economicThesis: EconomicThesis;
  sourceAQty: number;
  sourceBQty: number;
  catalystQty: number;
  initialEnginePartQty: number;
  initialTempoPartQty: number;
  goalQty: number;
  engineCost: number;
  tempoReceiveCatalystQty: number;
  tempoReceiveTempoQty: number;
  balanceCost: number;
  balanceTempoCost: number;
  balanceReceiveEngineQty: number;
  balanceReceiveTempoQty: number;
  falseFriendCost: number;
  falseFriendCatalystCost: number;
  falseFriendEngineQty: number;
  payoffQty: number;
  signatureTempoCost: number;
  signatureValue: number;
  includeCommitmentSetup: boolean;
  includeEngineDiscount: boolean;
  includeExtraNightTrade: boolean;
  nightBridgeTempoCost: number;
  extraNightGoalQty: number;
  earlyWindowTrades: 4 | 5;
}

interface TopologyTemplate {
  id: BarterTopology;
  thesis: string;
  hiddenVendorPurpose: HiddenVendorPurpose;
}

interface PortfolioDirectorChoice {
  topology: BarterTopology;
  target: QualityTargets;
}

interface MarketPlan {
  topology: BarterTopology;
  texture: BarterTexture;
  thesis: string;
  hiddenVendorPurpose: HiddenVendorPurpose;
  feltThesis: FeltMarketThesis;
  startEconomy: StartEconomy;
  economicThesis: EconomicThesis;
  goods: GoodId[];
  inventory: Inventory;
  goal: { good: GoodId; qty: number };
  trades: Trade[];
  solution: Trade[];
  expectedPar: number;
  earlyWindowTrades: number;
}

interface MarketPlanContext {
  seed: number;
  template: TopologyTemplate;
  target: QualityTargets;
  picks: PlanGoods;
  inventory: Inventory;
}

interface CoreRecipeConfig {
  earlyBalanceRole?: TradeRole;
  earlyBalanceLine?: StrategyLineId;
  earlyBalanceVariant?: boolean;
  commitmentReceiveEngineQty?: number;
  falseFriendReceive?: (ctx: MarketPlanContext) => TradeSide[];
  falseFriendReceiveEngineQty?: number;
  enginePayoffReceiveQty?: number;
  hiddenBailoutReceive?: (ctx: MarketPlanContext) => TradeSide[];
  compoundGateGive?: (ctx: MarketPlanContext) => TradeSide[];
  signatureGateGive?: (ctx: MarketPlanContext) => TradeSide[];
  signatureGateReceiveQty?: number;
  engineDiscountGive?: (ctx: MarketPlanContext) => TradeSide[];
}

interface RecipeTradeSet {
  trades: Trade[];
  solution: Trade[];
}

interface TopologyRecipe {
  id: BarterTopology;
  build: (ctx: MarketPlanContext) => RecipeTradeSet;
}

const TOPOLOGY_ORDER: BarterTopology[] = [
  'balanced_pair',
  'catalyst_debt',
  'scarce_bridge',
  'tempo_discount',
  'night_pivot',
  'delayed_multiplier',
  'split_pipeline',
  'compression_route',
  'overproduction_trap',
];

const PAR_TEXTURE_CYCLE: Array<{ par: PortfolioPar; texture: BarterTexture }> = [
  { par: 9, texture: 'classic' },
  { par: 10, texture: 'heavy' },
  { par: 9, texture: 'pivot' },
  { par: 8, texture: 'brisk' },
  { par: 9, texture: 'trap' },
  { par: 10, texture: 'classic' },
  { par: 11, texture: 'heavy' },
  { par: 9, texture: 'compression' },
  { par: 10, texture: 'pivot' },
  { par: 9, texture: 'classic' },
  { par: 9, texture: 'trap' },
  { par: 10, texture: 'heavy' },
  { par: 8, texture: 'brisk' },
  { par: 9, texture: 'compression' },
  { par: 11, texture: 'pivot' },
  { par: 10, texture: 'classic' },
  { par: 9, texture: 'classic' },
  { par: 10, texture: 'heavy' },
  { par: 9, texture: 'trap' },
  { par: 8, texture: 'brisk' },
  { par: 10, texture: 'compression' },
  { par: 9, texture: 'classic' },
  { par: 9, texture: 'pivot' },
  { par: 10, texture: 'heavy' },
  { par: 11, texture: 'heavy' },
  { par: 9, texture: 'trap' },
  { par: 10, texture: 'classic' },
  { par: 9, texture: 'compression' },
];

const START_ECONOMY_CYCLE: StartEconomy[] = [
  'bulk_heap',
  'balanced_pair',
  'split_capital',
  'prepared_piece',
  'scarce_coupon',
  'messy_pantry',
  'bulk_heap',
  'balanced_pair',
  'scarce_coupon',
  'prepared_piece',
  'split_capital',
  'messy_pantry',
  'bulk_heap',
  'prepared_piece',
];

const FELT_THESIS_CYCLE: FeltMarketThesis[] = [
  'protect_key_good',
  'spend_the_heap',
  'carry_the_pair',
  'use_the_ugly_trade',
  'stop_early',
  'night_told_you',
  'hidden_is_mercy',
  'carry_the_pair',
  'spend_the_heap',
  'protect_key_good',
  'use_the_ugly_trade',
  'stop_early',
  'night_told_you',
  'hidden_is_mercy',
];

const TOPOLOGY_TEMPLATES: Record<BarterTopology, TopologyTemplate> = {
  balanced_pair: {
    id: 'balanced_pair',
    thesis: 'Keep the two prepared goods synchronized; the night market only pays when the pair stays even.',
    hiddenVendorPurpose: 'recovery',
  },
  catalyst_debt: {
    id: 'catalyst_debt',
    thesis: 'Borrow against a scarce catalyst early, then make sure the night market can rebuild it.',
    hiddenVendorPurpose: 'safety_valve',
  },
  scarce_bridge: {
    id: 'scarce_bridge',
    thesis: 'One bridge good has two tempting uses; the clean route spends it only after the payoff is visible.',
    hiddenVendorPurpose: 'alternate',
  },
  tempo_discount: {
    id: 'tempo_discount',
    thesis: 'The quick route is real, but only if the discount still leaves enough paired goods to cash out.',
    hiddenVendorPurpose: 'recovery',
  },
  night_pivot: {
    id: 'night_pivot',
    thesis: 'Most of the night market is readable up front; the hidden stall is a pivot, not the whole answer.',
    hiddenVendorPurpose: 'alternate',
  },
  delayed_multiplier: {
    id: 'delayed_multiplier',
    thesis: 'A slower setup unlocks a better night multiplier; rushing creates extra cleanup.',
    hiddenVendorPurpose: 'compression',
  },
  split_pipeline: {
    id: 'split_pipeline',
    thesis: 'Two pipelines look useful, but the best route commits to one and uses the other as a bridge.',
    hiddenVendorPurpose: 'alternate',
  },
  compression_route: {
    id: 'compression_route',
    thesis: 'The compound bundle is not decoration; it compresses a whole turn if the day market prepares both halves.',
    hiddenVendorPurpose: 'compression',
  },
  overproduction_trap: {
    id: 'overproduction_trap',
    thesis: 'Making more of one ingredient feels powerful, but par belongs to the route that stops overproducing.',
    hiddenVendorPurpose: 'safety_valve',
  },
};

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

function positiveModulo(value: number, modulo: number): number {
  return ((value % modulo) + modulo) % modulo;
}

function portfolioIndex(date: Date): number {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return positiveModulo(Math.floor((utc - PORTFOLIO_START_UTC) / DAY_MS), 56);
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

function tradeSide(good: GoodId, qty: number): TradeSide {
  return { good, qty };
}

function optionalTradeSides(sides: TradeSide[]): TradeSide[] {
  return sides.filter((side) => side.qty > 0);
}

function thesisLine(thesis: EconomicThesis, fallback: string): string {
  switch (thesis) {
    case 'save_one_good':
      return 'One good has two jobs; the clean route waits before spending the bridge.';
    case 'stay_flexible':
      return 'Keep one flexible piece alive until the Night Market reveals which route is cheaper.';
    case 'enough_not_more':
      return 'The trick is making enough, then stopping before extra stock becomes cleanup.';
    case 'prepare_the_bundle':
      return 'The best route prepares both halves before night so the bundle can do real work.';
    case 'round_trip':
      return 'A short round trip turns spare goods back into the missing night-market piece.';
    case 'rebuild_the_catalyst':
      return 'Spend the catalyst only when the route can rebuild it before the payoff.';
    default:
      return fallback;
  }
}

function feltThesisLine(thesis: FeltMarketThesis, fallback: string): string {
  switch (thesis) {
    case 'protect_key_good':
      return 'Save the flexible good; it has two jobs tonight.';
    case 'spend_the_heap':
      return 'You start rich but awkward. Turn the heap into useful pieces before night.';
    case 'carry_the_pair':
      return 'Carry a matched pair into night; the visible bundle is the shortcut.';
    case 'use_the_ugly_trade':
      return 'The odd-looking day trade is useful because it opens the night route.';
    case 'stop_early':
      return 'More is not always better. Stop once the bundle has enough.';
    case 'night_told_you':
      return 'The visible Night Market already tells you what to prepare.';
    case 'hidden_is_mercy':
      return 'The hidden stall is a recovery tool. The clean plan is visible now.';
    default:
      return fallback;
  }
}

function startEconomyForIndex(index: number): StartEconomy {
  return START_ECONOMY_CYCLE[index % START_ECONOMY_CYCLE.length];
}

function feltThesisForIndex(index: number): FeltMarketThesis {
  return FELT_THESIS_CYCLE[index % FELT_THESIS_CYCLE.length];
}

function economicThesisForFelt(thesis: FeltMarketThesis, topology: BarterTopology): EconomicThesis {
  if (topology === 'catalyst_debt') return 'rebuild_the_catalyst';
  if (topology === 'compression_route') return 'prepare_the_bundle';
  if (topology === 'overproduction_trap' || thesis === 'stop_early') return 'enough_not_more';
  switch (thesis) {
    case 'protect_key_good':
      return 'save_one_good';
    case 'spend_the_heap':
      return 'stay_flexible';
    case 'carry_the_pair':
      return 'prepare_the_bundle';
    case 'use_the_ugly_trade':
      return 'round_trip';
    case 'night_told_you':
      return 'prepare_the_bundle';
    case 'hidden_is_mercy':
      return 'stay_flexible';
    default:
      return 'stay_flexible';
  }
}

function getPortfolioDirectorChoice(seed: number, date: Date): PortfolioDirectorChoice {
  const index = portfolioIndex(date);
  const topology = TOPOLOGY_ORDER[index % TOPOLOGY_ORDER.length];
  const cycle = PAR_TEXTURE_CYCLE[index % PAR_TEXTURE_CYCLE.length];
  const startEconomy = startEconomyForIndex(index);
  const feltThesis = feltThesisForIndex(index);
  const economicThesis = economicThesisForFelt(feltThesis, topology);
  const par = cycle.par;
  const includeCommitmentSetup =
    par === 11 ||
    (par >= 10 && startEconomy === 'prepared_piece' && feltThesis === 'use_the_ugly_trade');
  const signatureValue =
    feltThesis === 'carry_the_pair' ||
    feltThesis === 'night_told_you' ||
    (feltThesis === 'protect_key_good' && par >= 10) ||
    (feltThesis === 'use_the_ugly_trade' && par >= 10) ||
    topology === 'compression_route'
      ? 3
      : 2;
  let engineCost = cycle.texture === 'trap' ? 6 : 5;
  let balanceCost = includeCommitmentSetup || cycle.texture === 'heavy' ? 7 : 6;
  let sourceAQty = engineCost * 2 + balanceCost;
  let sourceBQty = 4;
  let catalystQty = 1;
  let initialEnginePartQty = 0;
  let initialTempoPartQty = 0;
  let includeEngineDiscount = feltThesis !== 'carry_the_pair' && feltThesis !== 'night_told_you';
  let includeExtraNightTrade =
    feltThesis === 'use_the_ugly_trade' ||
    feltThesis === 'hidden_is_mercy' ||
    (par >= 10 && cycle.texture === 'heavy' && (seed + TOPOLOGY_ORDER.indexOf(topology)) % 2 === 0);
  let extraNightGoalQty = feltThesis === 'use_the_ugly_trade' ? (par >= 10 ? 2 : 1) : 0;

  switch (startEconomy) {
    case 'bulk_heap':
      engineCost = cycle.texture === 'trap' ? 6 : 5;
      balanceCost = 6;
      sourceAQty = 19 + (index % 3);
      sourceBQty = 3;
      catalystQty = 1;
      break;
    case 'balanced_pair':
      engineCost = 3;
      balanceCost = 3;
      sourceAQty = 9;
      sourceBQty = 8;
      catalystQty = 1;
      includeEngineDiscount = false;
      break;
    case 'split_capital':
      engineCost = 3;
      balanceCost = 3;
      sourceAQty = 9;
      sourceBQty = 5;
      catalystQty = 3;
      includeEngineDiscount = false;
      break;
    case 'prepared_piece':
      engineCost = 3;
      balanceCost = 4;
      sourceAQty = 10;
      sourceBQty = 6;
      catalystQty = 1;
      initialEnginePartQty = index % 2 === 0 ? 1 : 0;
      initialTempoPartQty = index % 2 === 0 ? 0 : 1;
      includeEngineDiscount = false;
      break;
    case 'scarce_coupon':
      engineCost = 3;
      balanceCost = 3;
      sourceAQty = 9;
      sourceBQty = 7;
      catalystQty = 1;
      break;
    case 'messy_pantry':
      engineCost = 3;
      balanceCost = 3;
      sourceAQty = 9;
      sourceBQty = 5;
      catalystQty = 2;
      initialTempoPartQty = 1;
      includeEngineDiscount = false;
      break;
  }
  const signatureGoalBump =
    signatureValue >= 3 &&
    (par >= 10 || feltThesis === 'carry_the_pair' || feltThesis === 'night_told_you')
      ? 1
      : 0;
  const target: QualityTargets = {
    texture: cycle.texture,
    intendedPar: par,
    feltThesis,
    startEconomy,
    economicThesis,
    sourceAQty,
    sourceBQty,
    catalystQty,
    initialEnginePartQty,
    initialTempoPartQty,
    goalQty: par - 4 + signatureGoalBump,
    engineCost,
    tempoReceiveCatalystQty: 1,
    tempoReceiveTempoQty: 1,
    balanceCost,
    balanceTempoCost: 0,
    balanceReceiveEngineQty: 1,
    balanceReceiveTempoQty: 1,
    falseFriendCost: balanceCost,
    falseFriendCatalystCost: feltThesis === 'stop_early' ? 2 : 1,
    falseFriendEngineQty:
      par < 10
        ? 1
        : topology === 'overproduction_trap'
        ? 3
        : 2,
    payoffQty: par === 11 ? 5 : topology === 'delayed_multiplier' ? 4 : 3,
    signatureTempoCost: par < 10 ? 4 : includeCommitmentSetup ? 2 : 3,
    signatureValue,
    includeCommitmentSetup,
    includeEngineDiscount,
    includeExtraNightTrade,
    nightBridgeTempoCost: 2,
    extraNightGoalQty,
    earlyWindowTrades: includeCommitmentSetup ? 5 : 4,
  };

  return { topology, target };
}

function targetKey(target: QualityTargets): string {
  return [
    target.texture,
    target.intendedPar,
    target.feltThesis,
    target.startEconomy,
    target.economicThesis,
    target.sourceAQty,
    target.sourceBQty,
    target.catalystQty,
    target.initialEnginePartQty,
    target.initialTempoPartQty,
    target.goalQty,
    target.engineCost,
    target.tempoReceiveCatalystQty,
    target.tempoReceiveTempoQty,
    target.balanceCost,
    target.balanceTempoCost,
    target.balanceReceiveEngineQty,
    target.balanceReceiveTempoQty,
    target.falseFriendCost,
    target.falseFriendCatalystCost,
    target.falseFriendEngineQty,
    target.payoffQty,
    target.signatureTempoCost,
    target.signatureValue,
    target.includeCommitmentSetup ? 'commit' : 'open',
    target.includeEngineDiscount ? 'discount' : 'nodiscount',
    target.includeExtraNightTrade ? 'extra-night' : 'standard-night',
    target.nightBridgeTempoCost,
    target.extraNightGoalQty,
    target.earlyWindowTrades,
  ].join(':');
}

function safeClassicTarget(base: QualityTargets): QualityTargets {
  return {
    ...base,
    startEconomy: 'classic_catalyst',
    sourceAQty: base.engineCost * 2 + base.balanceCost,
    sourceBQty: 4,
    catalystQty: 1,
    initialEnginePartQty: 0,
    initialTempoPartQty: 0,
    goalQty: base.intendedPar - 4 + (base.signatureValue >= 3 ? 1 : 0),
    includeExtraNightTrade:
      base.economicThesis === 'round_trip' ? true : base.includeExtraNightTrade,
    extraNightGoalQty: base.economicThesis === 'round_trip' ? 1 : 0,
  };
}

function portfolioTargetVariants(choice: PortfolioDirectorChoice): QualityTargets[] {
  const base = choice.target;
  const variants: QualityTargets[] = [base];
  const add = (target: QualityTargets) => {
    if (target.sourceAQty <= 0 || target.goalQty <= 0) return;
    if (target.engineCost <= 0 || target.balanceCost <= 0 || target.falseFriendCost <= 0) return;
    if (target.tempoReceiveCatalystQty < 0 || target.tempoReceiveTempoQty < 0) return;
    if (target.tempoReceiveCatalystQty + target.tempoReceiveTempoQty <= 0) return;
    if (target.balanceReceiveEngineQty < 0 || target.balanceReceiveTempoQty < 0) return;
    if (target.balanceReceiveEngineQty + target.balanceReceiveTempoQty <= 0) return;
    variants.push(target);
  };

  add({ ...base, falseFriendEngineQty: 1 });
  add({ ...base, falseFriendEngineQty: 3 });
  add({ ...base, falseFriendCatalystCost: 2 });
  add({ ...base, falseFriendCost: base.falseFriendCost + 1 });
  add({
    ...base,
    falseFriendCost: base.falseFriendCost + 1,
    falseFriendCatalystCost: 2,
  });
  add({ ...base, tempoReceiveCatalystQty: 1, tempoReceiveTempoQty: 0 });
  add({ ...base, tempoReceiveCatalystQty: 0, tempoReceiveTempoQty: 1 });
  add({
    ...base,
    tempoReceiveCatalystQty: 1,
    tempoReceiveTempoQty: 0,
    falseFriendEngineQty: Math.max(base.falseFriendEngineQty, 2),
  });
  add({ ...base, balanceReceiveEngineQty: 1, balanceReceiveTempoQty: 0 });
  add({ ...base, balanceReceiveEngineQty: 0, balanceReceiveTempoQty: 1 });
  add({ ...base, balanceReceiveEngineQty: 2, balanceReceiveTempoQty: 0 });
  add({ ...base, balanceReceiveEngineQty: 0, balanceReceiveTempoQty: 2 });
  add({
    ...base,
    balanceTempoCost: 1,
    balanceReceiveEngineQty: Math.max(2, base.balanceReceiveEngineQty),
    balanceReceiveTempoQty: 0,
  });
  add({
    ...base,
    balanceTempoCost: 1,
    balanceReceiveEngineQty: 1,
    balanceReceiveTempoQty: 0,
    falseFriendEngineQty: 1,
  });
  add({
    ...base,
    balanceReceiveEngineQty: 2,
    balanceReceiveTempoQty: 0,
    falseFriendEngineQty: Math.max(base.falseFriendEngineQty, 2),
  });
  if (base.intendedPar >= 10) {
    add({
      ...base,
      sourceAQty: base.sourceAQty - 1,
      falseFriendEngineQty: Math.min(base.falseFriendEngineQty, 2),
    });
    add({
      ...base,
      sourceAQty: base.sourceAQty - 1,
      falseFriendEngineQty: 1,
    });
  }
  if (base.intendedPar <= 10) {
    add({
      ...base,
      signatureTempoCost: Math.max(2, base.signatureTempoCost - 1),
    });
    add({
      ...base,
      signatureValue: 3,
      signatureTempoCost: Math.max(3, base.signatureTempoCost),
      goalQty: base.goalQty + 1,
    });
  }
  if (base.intendedPar === 8) {
    add({
      ...base,
      includeEngineDiscount: false,
      signatureValue: 3,
      signatureTempoCost: 3,
      goalQty: base.goalQty + 1,
    });
  }
  if (base.intendedPar >= 10) {
    add({
      ...base,
      includeExtraNightTrade: !base.includeExtraNightTrade,
    });
    add({
      ...base,
      includeExtraNightTrade: true,
      extraNightGoalQty: 1,
    });
  }
  add({
    ...base,
    includeExtraNightTrade: true,
    extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
  });
  add({
    ...base,
    includeExtraNightTrade: true,
    nightBridgeTempoCost: 1,
    extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
  });
  add({
    ...base,
    includeExtraNightTrade: true,
    nightBridgeTempoCost: 1,
    extraNightGoalQty: Math.max(2, base.extraNightGoalQty),
    goalQty: base.goalQty + 1,
  });
  if (base.signatureValue < 3) {
    add({
      ...base,
      includeExtraNightTrade: true,
      extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
      signatureValue: 3,
      goalQty: base.goalQty + 1,
    });
  }
  if (base.intendedPar >= 10 || base.feltThesis === 'carry_the_pair' || base.feltThesis === 'night_told_you') {
    add({
      ...base,
      signatureValue: 3,
      signatureTempoCost: Math.max(2, base.signatureTempoCost),
      goalQty: base.goalQty + 1,
    });
  }
  if (base.startEconomy === 'prepared_piece' || base.startEconomy === 'messy_pantry') {
    add({
      ...base,
      goalQty: Math.max(1, base.goalQty - 1),
    });
  }
  if (base.startEconomy === 'scarce_coupon' || base.startEconomy === 'split_capital') {
    add({
      ...base,
      catalystQty: 1,
      goalQty: Math.max(1, base.goalQty - 1),
    });
    add({
      ...base,
      catalystQty: 1,
    });
    add({
      ...base,
      sourceAQty: Math.max(1, base.sourceAQty - 1),
      catalystQty: 1,
    });
  }
  if (base.feltThesis === 'stop_early') {
    add({
      ...base,
      falseFriendEngineQty: 3,
      includeEngineDiscount: false,
    });
  }
  if (base.feltThesis === 'use_the_ugly_trade') {
    add({
      ...base,
      includeCommitmentSetup: false,
      earlyWindowTrades: 4,
    });
    add({
      ...base,
      includeEngineDiscount: true,
      extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
    });
    add({
      ...base,
      includeEngineDiscount: true,
      goalQty: Math.max(1, base.goalQty - 1),
      extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
    });
    add({
      ...base,
      goalQty: Math.max(1, base.goalQty - 2),
      extraNightGoalQty: Math.max(1, base.extraNightGoalQty),
    });
  }
  if (base.feltThesis === 'hidden_is_mercy') {
    add({
      ...base,
      includeEngineDiscount: false,
      includeExtraNightTrade: true,
      extraNightGoalQty: 0,
    });
  }

  return Array.from(new Map(variants.map((target) => [targetKey(target), target])).values());
}

function createMarketPlanContext(
  seed: number,
  template: TopologyTemplate,
  target: QualityTargets
): MarketPlanContext {
  const rand = mulberry32(seed ^ template.id.length ^ target.intendedPar);
  const picks = pickPlanGoods(rand);
  const inventory = createEmptyInventory();
  inventory[picks.sourceA] = target.sourceAQty;
  inventory[picks.sourceB] = target.sourceBQty;
  inventory[picks.catalyst] = target.catalystQty;
  inventory[picks.enginePart] = target.initialEnginePartQty;
  inventory[picks.tempoPart] = target.initialTempoPartQty;

  return { seed, template, target, picks, inventory };
}

function plannedLateSequence(
  target: QualityTargets,
  enginePayoff: Trade,
  compoundGate: Trade,
  signatureGate: Trade,
  engineDiscount: Trade,
  nightBridge: Trade
): Trade[] {
  if (target.feltThesis === 'carry_the_pair' || target.feltThesis === 'night_told_you') {
    const closer = target.includeExtraNightTrade ? nightBridge : compoundGate;
    return target.intendedPar <= 9
      ? [enginePayoff, signatureGate, compoundGate, closer]
      : [enginePayoff, signatureGate, compoundGate, closer, signatureGate, compoundGate].slice(
          0,
          target.intendedPar - target.earlyWindowTrades
        );
  }
  if (target.feltThesis === 'stop_early' || target.feltThesis === 'hidden_is_mercy') {
    const recovery = target.includeExtraNightTrade ? nightBridge : engineDiscount;
    return target.intendedPar <= 9
      ? [enginePayoff, signatureGate, compoundGate, recovery]
      : [enginePayoff, signatureGate, compoundGate, recovery, engineDiscount, compoundGate].slice(
          0,
          target.intendedPar - target.earlyWindowTrades
        );
  }
  if (target.feltThesis === 'use_the_ugly_trade') {
    return target.intendedPar <= 9
      ? [enginePayoff, nightBridge, signatureGate, compoundGate]
      : [enginePayoff, nightBridge, signatureGate, compoundGate, engineDiscount, compoundGate].slice(
          0,
          target.intendedPar - target.earlyWindowTrades
        );
  }
  if (target.intendedPar === 8) {
    if (target.extraNightGoalQty > 0) {
      return [enginePayoff, signatureGate, compoundGate, nightBridge];
    }
    return target.signatureTempoCost >= 4
      ? [enginePayoff, signatureGate, compoundGate, engineDiscount]
      : [enginePayoff, signatureGate, compoundGate, compoundGate];
  }
  if (target.intendedPar === 9) {
    if (target.extraNightGoalQty > 0) {
      return [enginePayoff, signatureGate, compoundGate, nightBridge, engineDiscount];
    }
    return target.signatureTempoCost >= 4
      ? [enginePayoff, signatureGate, compoundGate, engineDiscount, engineDiscount]
      : [enginePayoff, signatureGate, compoundGate, compoundGate, engineDiscount];
  }
  if (target.intendedPar === 10) {
    if (target.extraNightGoalQty > 0) {
      return [
        enginePayoff,
        signatureGate,
        compoundGate,
        nightBridge,
        engineDiscount,
        engineDiscount,
      ];
    }
    return [
      enginePayoff,
      signatureGate,
      compoundGate,
      compoundGate,
      engineDiscount,
      engineDiscount,
    ];
  }
  if (target.extraNightGoalQty > 0) {
    return [
      enginePayoff,
      signatureGate,
      signatureGate,
      compoundGate,
      nightBridge,
      engineDiscount,
    ];
  }
  return [
    enginePayoff,
    signatureGate,
    signatureGate,
    compoundGate,
    engineDiscount,
    engineDiscount,
  ];
}

function hiddenVendorPurposeForFelt(
  thesis: FeltMarketThesis,
  fallback: HiddenVendorPurpose
): HiddenVendorPurpose {
  if (thesis === 'hidden_is_mercy' || thesis === 'stop_early') return 'safety_valve';
  if (thesis === 'night_told_you') return 'recovery';
  if (thesis === 'use_the_ugly_trade') return 'alternate';
  return fallback;
}

function hiddenVendorRole(template: TopologyTemplate, target: QualityTargets): NightVendorRole {
  const purpose = hiddenVendorPurposeForFelt(target.feltThesis, template.hiddenVendorPurpose);
  if (purpose === 'compression') return 'loop_finisher';
  if (purpose === 'alternate') return 'bridge_vendor';
  return 'recycler';
}

function buildCoreRecipeTrades(
  ctx: MarketPlanContext,
  config: CoreRecipeConfig = {}
): RecipeTradeSet {
  const { template, target, picks } = ctx;
  const earlyBalanceRole =
    config.earlyBalanceRole ?? (template.id === 'balanced_pair' ? 'tempo' : 'variant');
  const earlyBalanceLine =
    config.earlyBalanceLine ?? (template.id === 'split_pipeline' ? 'shared' : 'tempo');
  const earlyBalanceVariant =
    config.earlyBalanceVariant ?? template.id !== 'balanced_pair';
  const earlyEngineSetup: Trade = {
    give: [tradeSide(picks.sourceA, target.engineCost)],
    receive: [
      tradeSide(picks.catalyst, 1),
      tradeSide(picks.enginePart, 1),
    ],
    window: 'early',
    stage: 1,
    role: 'engine_setup',
    line: 'engine',
  };
  const earlyTempoOpen: Trade = {
    give: [tradeSide(picks.sourceB, target.sourceBQty)],
    receive: optionalTradeSides([
      tradeSide(picks.catalyst, target.tempoReceiveCatalystQty),
      tradeSide(picks.tempoPart, target.tempoReceiveTempoQty),
    ]),
    window: 'early',
    stage: 2,
    role: 'tempo',
    line: 'tempo',
  };
  const earlyBalance: Trade = {
    give: optionalTradeSides([
      tradeSide(picks.sourceA, target.balanceCost),
      tradeSide(picks.tempoPart, target.balanceTempoCost),
    ]),
    receive: optionalTradeSides([
      tradeSide(picks.enginePart, target.balanceReceiveEngineQty),
      tradeSide(picks.tempoPart, target.balanceReceiveTempoQty),
    ]),
    window: 'early',
    stage: 3,
    role: earlyBalanceRole,
    line: earlyBalanceLine,
    variant: earlyBalanceVariant,
  };
  const commitmentSetup: Trade = {
    give: [
      tradeSide(picks.catalyst, 1),
      tradeSide(picks.tempoPart, 1),
    ],
    receive: [
      tradeSide(
        picks.enginePart,
        config.commitmentReceiveEngineQty ??
          (target.feltThesis === 'use_the_ugly_trade' ? 1 : 2)
      ),
    ],
    window: 'early',
    stage: 4,
    role: 'engine_setup',
    line: 'engine',
  };
  const falseFriend: Trade = {
    give: [
      tradeSide(picks.sourceA, target.falseFriendCost),
      tradeSide(picks.catalyst, target.falseFriendCatalystCost),
    ],
    receive: config.falseFriendReceive?.(ctx) ??
      (target.feltThesis === 'use_the_ugly_trade'
        ? [tradeSide(picks.sourceB, 1)]
        : [
            target.falseFriendEngineQty <= 1
              ? tradeSide(picks.tempoPart, 1)
              : tradeSide(
                  picks.enginePart,
                  config.falseFriendReceiveEngineQty ?? target.falseFriendEngineQty
                ),
          ]),
    window: 'early',
    stage: 5,
    role: 'variant',
    line: 'shared',
    variant: true,
  };
  const enginePayoff: Trade = {
    give: [tradeSide(picks.enginePart, 1)],
    receive: [
      tradeSide(
        picks.tempoPart,
        config.enginePayoffReceiveQty ??
          (target.feltThesis === 'use_the_ugly_trade' ? target.payoffQty + 1 : target.payoffQty)
      ),
    ],
    window: 'late',
    stage: 6,
    role: 'engine_payoff',
    line: 'engine',
    vendorRole: 'bridge_vendor',
  };
  const hiddenTempoBailout: Trade = {
    give: [tradeSide(picks.enginePart, 1)],
    receive: config.hiddenBailoutReceive?.(ctx) ?? [
      tradeSide(picks.catalyst, target.falseFriendEngineQty <= 1 ? 1 : 2),
      ...(target.falseFriendEngineQty <= 1 ? [] : [tradeSide(picks.tempoPart, 1)]),
    ],
    window: 'late',
    stage: 7,
    role: 'tempo_bailout',
    line: 'tempo',
    hiddenUntilNight: true,
    vendorRole: hiddenVendorRole(template, target),
  };
  const compoundGate: Trade = {
    give: config.compoundGateGive?.(ctx) ?? [
      tradeSide(picks.catalyst, 1),
      tradeSide(picks.tempoPart, 1),
    ],
    receive: [tradeSide(picks.goal, 1)],
    window: 'late',
    stage: 8,
    role: 'compound_gate',
    line: 'shared',
    vendorRole: 'bundle_payoff',
  };
  const signatureGate: Trade = {
    give: config.signatureGateGive?.(ctx) ?? [
      tradeSide(picks.enginePart, 2),
      tradeSide(picks.tempoPart, target.signatureTempoCost),
    ],
    receive: [tradeSide(picks.goal, config.signatureGateReceiveQty ?? target.signatureValue)],
    window: 'late',
    stage: 9,
    role: 'compound_gate',
    line: 'shared',
    vendorRole: 'bundle_payoff',
  };
  const engineDiscount: Trade = {
    give: config.engineDiscountGive?.(ctx) ?? [tradeSide(picks.catalyst, 1)],
    receive: [tradeSide(picks.goal, 1)],
    window: 'late',
    stage: 10,
    role: 'engine_payoff',
    line: 'engine',
    variant: true,
    vendorRole: 'reserve_payoff',
  };
  const nightBridge: Trade = {
    give: [tradeSide(picks.tempoPart, target.nightBridgeTempoCost)],
    receive:
      target.extraNightGoalQty > 0
        ? [tradeSide(picks.goal, target.extraNightGoalQty)]
        : [tradeSide(picks.catalyst, 1)],
    window: 'late',
    stage: 11,
    role: target.extraNightGoalQty > 0 ? 'engine_payoff' : 'variant',
    line: 'shared',
    variant: true,
    vendorRole: target.extraNightGoalQty > 0 ? 'loop_finisher' : 'recycler',
  };
  const dayTrades = target.includeCommitmentSetup
    ? [earlyEngineSetup, earlyTempoOpen, earlyBalance, commitmentSetup, falseFriend]
    : [earlyEngineSetup, earlyTempoOpen, earlyBalance, falseFriend];
  const nightTrades = [
    enginePayoff,
    hiddenTempoBailout,
    compoundGate,
    signatureGate,
    ...(target.includeEngineDiscount ? [engineDiscount] : []),
    ...(target.includeExtraNightTrade ? [nightBridge] : []),
  ];
  const solutionEarly = target.includeCommitmentSetup
    ? [earlyEngineSetup, earlyEngineSetup, earlyTempoOpen, earlyBalance, commitmentSetup]
    : [earlyEngineSetup, earlyEngineSetup, earlyTempoOpen, earlyBalance];

  return {
    trades: [...dayTrades, ...nightTrades],
    solution: [
      ...solutionEarly,
      ...plannedLateSequence(
        target,
        enginePayoff,
        compoundGate,
        signatureGate,
        engineDiscount,
        nightBridge
      ),
    ],
  };
}

const TOPOLOGY_RECIPES: Record<BarterTopology, TopologyRecipe> = {
  balanced_pair: {
    id: 'balanced_pair',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        earlyBalanceRole: 'tempo',
        earlyBalanceLine: 'tempo',
        earlyBalanceVariant: false,
      }),
  },
  catalyst_debt: {
    id: 'catalyst_debt',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        hiddenBailoutReceive: ({ picks, target }) => [
          tradeSide(picks.catalyst, target.falseFriendEngineQty <= 1 ? 1 : 3),
        ],
      }),
  },
  scarce_bridge: {
    id: 'scarce_bridge',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        hiddenBailoutReceive: ({ picks, target }) =>
          target.falseFriendEngineQty <= 1
            ? [tradeSide(picks.catalyst, 1)]
            : [tradeSide(picks.catalyst, 2), tradeSide(picks.sourceB, 1)],
      }),
  },
  tempo_discount: {
    id: 'tempo_discount',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        earlyBalanceRole: 'tempo',
        earlyBalanceLine: 'tempo',
        earlyBalanceVariant: true,
      }),
  },
  night_pivot: {
    id: 'night_pivot',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        hiddenBailoutReceive: ({ picks, target }) =>
          target.falseFriendEngineQty <= 1
            ? [tradeSide(picks.catalyst, 1)]
            : [tradeSide(picks.catalyst, 2), tradeSide(picks.tempoPart, 1)],
      }),
  },
  delayed_multiplier: {
    id: 'delayed_multiplier',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        enginePayoffReceiveQty: ctx.target.payoffQty + 1,
      }),
  },
  split_pipeline: {
    id: 'split_pipeline',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        earlyBalanceLine: 'shared',
        earlyBalanceVariant: true,
        commitmentReceiveEngineQty: 3,
      }),
  },
  compression_route: {
    id: 'compression_route',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        signatureGateReceiveQty: ctx.target.signatureValue,
      }),
  },
  overproduction_trap: {
    id: 'overproduction_trap',
    build: (ctx) =>
      buildCoreRecipeTrades(ctx, {
        falseFriendReceiveEngineQty: 3,
      }),
  },
};

function buildMarketPlan(seed: number, choice: PortfolioDirectorChoice): MarketPlan {
  const template = TOPOLOGY_TEMPLATES[choice.topology];
  const ctx = createMarketPlanContext(seed, template, choice.target);
  const recipe = TOPOLOGY_RECIPES[template.id];
  const tradeSet = recipe.build(ctx);

  return {
    topology: template.id,
    texture: choice.target.texture,
    thesis: feltThesisLine(choice.target.feltThesis, template.thesis),
    hiddenVendorPurpose: hiddenVendorPurposeForFelt(
      choice.target.feltThesis,
      template.hiddenVendorPurpose
    ),
    feltThesis: choice.target.feltThesis,
    startEconomy: choice.target.startEconomy,
    economicThesis: choice.target.economicThesis,
    goods: ctx.picks.goods,
    inventory: ctx.inventory,
    goal: { good: ctx.picks.goal, qty: choice.target.goalQty },
    trades: canonicalTrades(tradeSet.trades),
    solution: canonicalTrades(tradeSet.solution),
    expectedPar: choice.target.intendedPar,
    earlyWindowTrades: choice.target.earlyWindowTrades,
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
    texture: plan.texture,
    thesis: plan.thesis,
    feltThesis: plan.feltThesis,
    startEconomy: plan.startEconomy,
    economicThesis: plan.economicThesis,
    hiddenVendorPurpose: plan.hiddenVendorPurpose,
  };
}

function buildAuthoredFallback(seed: number, date: Date): BarterPuzzle {
  const choice = getPortfolioDirectorChoice(seed, date);
  return buildPuzzleFromPlan(seed, date, buildMarketPlan(seed, choice));
}

function withAnalyzedSolution(
  puzzle: BarterPuzzle,
  report: ReturnType<typeof validateBarterQuality>
): BarterPuzzle {
  const par = report.shortestPathLength ?? puzzle.par;
  const solution =
    report.bestRoute?.tradeKeys
      .map((key) => puzzle.trades.find((trade) => tradeKey(trade) === key))
      .filter((trade): trade is Trade => Boolean(trade)) ?? puzzle.solution;
  return { ...puzzle, par, maxTrades: par + 2, solution };
}

function candidateScore(
  puzzle: BarterPuzzle,
  report: ReturnType<typeof validateBarterQuality>
): number {
  const openingSharpness = report.optimalFirstMoveCount === 2 ? 180 : 0;
  const regretPressure = report.maxEarlyRegret * 8;
  const routeSeparation = report.routeDistance * 4;
  const hiddenTexture =
    report.hiddenVendorUsage === 'recovery_only'
      ? 8
      : report.hiddenVendorUsage === 'par_route'
      ? 4
      : 2;
  const signatureSpike = report.signatureTurnValue >= 3 ? 10 : 0;
  const compactBonus = puzzle.trades.length === 8 ? 5 : puzzle.trades.length === 9 ? 3 : 0;
  const repeatPenalty = report.bestRouteMaxRepeat > 2 ? 62 : report.bestRouteMaxRepeat * 3;
  const nightDiversityBonus = report.bestRouteNightRoleDiversity >= 3 ? 8 : 0;
  const repeatedCashoutPenalty = Math.max(0, report.repeatedGoalCashoutCount - 2) * 52;
  const parSweetSpot =
    report.shortestPathLength === 9 ? 12 : report.shortestPathLength === 8 ? -4 : 0;
  const startEconomyBonus =
    report.startInventorySignature.includes(':4:') || report.startInventorySignature.includes(':5:')
      ? 4
      : 0;

  return (
    openingSharpness +
    regretPressure +
    routeSeparation +
    hiddenTexture +
    signatureSpike +
    compactBonus +
    nightDiversityBonus +
    startEconomyBonus +
    parSweetSpot +
    report.compressionValue * 4 -
    repeatPenalty -
    repeatedCashoutPenalty
  );
}

export function generateBarterPuzzle(seed: number, date: Date = new Date()): BarterPuzzle {
  const primaryChoice = getPortfolioDirectorChoice(seed, date);
  const choices: PortfolioDirectorChoice[] = [
    primaryChoice,
    ...TOPOLOGY_ORDER.filter((topology) => topology !== primaryChoice.topology).map((topology) => ({
      topology,
      target: primaryChoice.target,
    })),
  ];
  const violations: string[] = [];

  for (const choice of choices) {
    let bestCandidate:
      | {
          puzzle: BarterPuzzle;
          report: ReturnType<typeof validateBarterQuality>;
          score: number;
        }
      | null = null;
    for (const target of portfolioTargetVariants(choice)) {
      const variantChoice = { ...choice, target };
      const puzzle = buildPuzzleFromPlan(seed, date, buildMarketPlan(seed, variantChoice));
      const initialReport = validateBarterQuality(puzzle);
      const analyzedPuzzle =
        initialReport.shortestPathLength !== null &&
        initialReport.shortestPathLength >= 8 &&
        initialReport.shortestPathLength <= 11
          ? {
              ...puzzle,
              par: initialReport.shortestPathLength,
              maxTrades: initialReport.shortestPathLength + 2,
            }
          : puzzle;
      const report =
        analyzedPuzzle === puzzle ? initialReport : validateBarterQuality(analyzedPuzzle);
      if (report.accepted) {
        const score = candidateScore(analyzedPuzzle, report);
        if (!bestCandidate || score > bestCandidate.score) {
          bestCandidate = { puzzle: analyzedPuzzle, report, score };
        }
        continue;
      }
      violations.push(
        `${choice.topology}/${target.intendedPar}: shortest=${report.shortestPathLength ?? 'none'} open=${report.startAffordableCount} opt=${report.optimalFirstMoveCount} regret=${report.maxEarlyRegret} sig=${report.signatureTurnValue} repeat=${report.bestRouteMaxRepeat} cash=${report.repeatedGoalCashoutCount}: ${report.violations.slice(0, 4).join(', ')}`
      );
    }
    if (bestCandidate) return withAnalyzedSolution(bestCandidate.puzzle, bestCandidate.report);
  }

  const fallback = buildAuthoredFallback(seed, date);
  const fallbackReport = validateBarterQuality(fallback);
  if (fallbackReport.accepted) {
    return {
      ...withAnalyzedSolution(fallback, fallbackReport),
      id: `barter-${seed}`,
      dateKey: getDateKey(date),
    };
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
    texture: 'brisk',
    thesis: 'Day trades prepare the pair that night turns into the goal.',
    feltThesis: 'carry_the_pair',
    startEconomy: 'classic_catalyst',
    economicThesis: 'prepare_the_bundle',
    hiddenVendorPurpose: 'recovery',
  };
}
