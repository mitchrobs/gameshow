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

export type RoutePersonality =
  | 'engine'
  | 'tempo'
  | 'balanced'
  | 'recovery'
  | 'overpay'
  | 'compression'
  | 'split';

export type HiddenVendorPurpose = 'recovery' | 'alternate' | 'compression' | 'safety_valve';

export interface Trade {
  give: TradeSide[];
  receive: TradeSide[];
  window?: TradeWindow;
  stage?: number;
  role?: TradeRole;
  line?: StrategyLineId;
  variant?: boolean;
  hiddenUntilNight?: boolean;
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
  routeDivergenceDepth: number | null;
  bottleneckGood: GoodId | null;
  hiddenVendorKey: string | null;
  topology: BarterTopology | null;
  thesis: string | null;
  hiddenVendorPurpose: HiddenVendorPurpose | null;
  routeDistance: number;
  compressionValue: number;
  payoffVisibility: boolean;
  routePersonalities: RoutePersonality[];
  bestRoute: RouteSummary | null;
  alternateRoute: RouteSummary | null;
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
  thesis?: string;
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
