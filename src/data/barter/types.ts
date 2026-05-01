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

export interface GoodSkin {
  id: GoodId;
  name: string;
  emoji: string;
}

export interface TradeSide {
  good: GoodId;
  qty: number;
}

export type TradeWindow = 'early' | 'late';

export type TradeRole =
  | 'tempo'
  | 'engine_setup'
  | 'engine_payoff'
  | 'compound_gate'
  | 'tempo_bailout'
  | 'distractor'
  | 'variant';

export type StrategyLineId = 'tempo' | 'engine' | 'shared';

export type BarterTopology =
  | 'balanced_pair'
  | 'catalyst_debt'
  | 'scarce_bridge'
  | 'tempo_discount'
  | 'night_pivot'
  | 'delayed_multiplier'
  | 'split_pipeline'
  | 'compression_route'
  | 'overproduction_trap';

export type BarterArchetype = BarterTopology;

export type BarterTexture = 'brisk' | 'classic' | 'heavy' | 'pivot' | 'trap' | 'compression';

export type RoutePersonality =
  | 'engine'
  | 'tempo'
  | 'balanced'
  | 'recovery'
  | 'overpay'
  | 'compression'
  | 'split';

export type HiddenVendorPurpose = 'recovery' | 'alternate' | 'compression' | 'safety_valve';

export type HiddenVendorUsage = 'par_route' | 'alternate_route' | 'recovery_only';

export type NightVendorRole =
  | 'bundle_payoff'
  | 'reserve_payoff'
  | 'bridge_vendor'
  | 'recycler'
  | 'loop_finisher';

export type StartEconomy =
  | 'bulk_heap'
  | 'balanced_pair'
  | 'split_capital'
  | 'prepared_piece'
  | 'scarce_coupon'
  | 'messy_pantry'
  | 'classic_catalyst'
  | 'balanced_pantry'
  | 'coupon_start'
  | 'illiquid_bulk';

export type EconomicThesis =
  | 'save_one_good'
  | 'stay_flexible'
  | 'enough_not_more'
  | 'prepare_the_bundle'
  | 'round_trip'
  | 'rebuild_the_catalyst';

export type FeltMarketThesis =
  | 'protect_key_good'
  | 'spend_the_heap'
  | 'carry_the_pair'
  | 'use_the_ugly_trade'
  | 'stop_early'
  | 'night_told_you'
  | 'hidden_is_mercy';

export type PlayerSolveFeel =
  | 'liquefy_heap'
  | 'protect_coupon'
  | 'carry_pair'
  | 'ugly_liquidity'
  | 'stop_production'
  | 'visible_night_target'
  | 'hidden_recovery'
  | 'split_lanes'
  | 'compression_bundle';

export interface Trade {
  give: TradeSide[];
  receive: TradeSide[];
  window?: TradeWindow;
  stage?: number;
  role?: TradeRole;
  line?: StrategyLineId;
  variant?: boolean;
  hiddenUntilNight?: boolean;
  vendorRole?: NightVendorRole;
}

export interface BarterGoal {
  good: GoodId;
  qty: number;
}

export type BarterDifficulty = 'Easy' | 'Medium' | 'Hard';

export type Inventory = Record<GoodId, number>;

export interface RouteSummary {
  steps: number;
  tradeKeys: string[];
  firstTradeKey: string;
  roles: TradeRole[];
  line: StrategyLineId;
  usesCompound: boolean;
  personality?: RoutePersonality;
}

export interface OpeningRegret {
  tradeKey: string;
  bestLength: number | null;
  regret: number | null;
  nearOptimal: boolean;
}

export interface BarterQualityReport {
  accepted: boolean;
  violations: string[];
  archetype: BarterArchetype | null;
  shortestPathLength: number | null;
  nearOptimalRouteCount: number;
  nearOptimalFirstMoveCount: number;
  optimalFirstMoveCount: number;
  compoundOnNearOptimalRoute: boolean;
  tempoRouteCount: number;
  engineRouteCount: number;
  startAffordableCount: number;
  meaningfulOptionsByDepth: number[];
  maxEarlyRegret: number;
  deadEarlyMoveCount: number;
  openingRegrets: OpeningRegret[];
  openingRegretSignature: string;
  regretRoleSignature: string;
  roleSkeletonSignature: string;
  routeDivergenceDepth: number | null;
  bottleneckGood: GoodId | null;
  hiddenVendorKey: string | null;
  hiddenVendorUsage: HiddenVendorUsage | null;
  topology: BarterTopology | null;
  texture: BarterTexture | null;
  thesis: string | null;
  hiddenVendorPurpose: HiddenVendorPurpose | null;
  feltThesis: FeltMarketThesis | null;
  playerSolveFeel: PlayerSolveFeel | null;
  firstQuestion: string;
  startSilhouette: string;
  startQuantitySilhouette: string;
  visiblePremiseTradeKey: string | null;
  nightScriptSignature: string;
  nightCashoutPattern: string;
  dayCloseTargetSignature: string;
  solveFeelSignature: string;
  adjacentSimilarityScore: number;
  motifEvidence: string[];
  startEconomy: StartEconomy | null;
  economicThesis: EconomicThesis | null;
  startInventorySignature: string;
  nightRoleSignature: string;
  bestRouteNightRoleDiversity: number;
  repeatedGoalCashoutCount: number;
  routeDistance: number;
  compressionValue: number;
  signatureTurnValue: number;
  bestRouteMaxRepeat: number;
  payoffVisibility: boolean;
  routePersonalities: RoutePersonality[];
  bestRoute: RouteSummary | null;
  alternateRoute: RouteSummary | null;
  bestDayCloseInventory: Inventory | null;
  alternateDayCloseInventory: Inventory | null;
  strategicInsight: string;
}

export interface BarterPuzzle {
  id: string;
  dateKey: string;
  difficulty: BarterDifficulty;
  marketName: string;
  marketEmoji: string;
  goods: Good[];
  inventory: Inventory;
  goal: BarterGoal;
  trades: Trade[];
  solution: Trade[];
  par: number;
  maxTrades: number;
  earlyWindowTrades: number;
  archetype?: BarterArchetype;
  topology?: BarterTopology;
  texture?: BarterTexture;
  thesis?: string;
  feltThesis?: FeltMarketThesis;
  playerSolveFeel?: PlayerSolveFeel;
  startEconomy?: StartEconomy;
  economicThesis?: EconomicThesis;
  hiddenVendorPurpose?: HiddenVendorPurpose;
}

export class BarterGenerationError extends Error {
  violations: string[];

  constructor(message: string, violations: string[]) {
    super(message);
    this.name = 'BarterGenerationError';
    this.violations = violations;
  }
}
