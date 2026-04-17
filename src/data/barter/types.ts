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

export type TradeRole =
  | 'tempo'
  | 'engine_setup'
  | 'engine_payoff'
  | 'compound_gate'
  | 'tempo_bailout'
  | 'distractor'
  | 'variant';

export type StrategyLineId = 'tempo' | 'engine' | 'shared';

export interface Trade {
  give: TradeSide[];
  receive: TradeSide[];
  window?: TradeWindow;
  stage?: number;
  role?: TradeRole;
  line?: StrategyLineId;
  variant?: boolean;
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
}

export interface BarterQualityReport {
  accepted: boolean;
  violations: string[];
  shortestPathLength: number | null;
  nearOptimalRouteCount: number;
  nearOptimalFirstMoveCount: number;
  compoundOnNearOptimalRoute: boolean;
  tempoRouteCount: number;
  engineRouteCount: number;
  startAffordableCount: number;
  meaningfulOptionsByDepth: number[];
  maxEarlyRegret: number;
  deadEarlyMoveCount: number;
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
}

export class BarterGenerationError extends Error {
  violations: string[];

  constructor(message: string, violations: string[]) {
    super(message);
    this.name = 'BarterGenerationError';
    this.violations = violations;
  }
}
