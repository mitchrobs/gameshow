export type TriviaFeed = 'mix' | 'sports';
export type TriviaDifficulty = 'easy' | 'hard';
export type TriviaDifficultyTarget = 1 | 2 | 3;
export type TriviaLookupRisk = 'low' | 'medium' | 'high';
export type TriviaQuestionStatus = 'reviewed' | 'staged' | 'retired';
export type TriviaEditorialBucket =
  | 'evergreen'
  | 'topical'
  | 'experimental'
  | 'current'
  | 'event';
export type TriviaSourceTier = 'curated' | 'legacy' | 'supplemental' | 'variant';
export type TriviaSourceLabel =
  | 'curated-authored'
  | 'curated-template'
  | 'legacy-base'
  | 'supplemental'
  | 'variant';
export type TriviaCurveballKind =
  | 'none'
  | 'rule-nuance'
  | 'terminology'
  | 'sport-identification'
  | 'famous-nickname'
  | 'famous-edge-case'
  | 'clean-term'
  | 'clean-concept';
export type TriviaLegacyFamily =
  | 'none'
  | 'archive-bio'
  | 'exact-date'
  | 'stat-trap'
  | 'relationship'
  | 'off-tone'
  | 'fringe-subdomain'
  | 'misc-trivia';
export type TriviaAnswerMark = 'correct' | 'shielded' | 'wrong' | 'timeout';
export type TriviaPromptKind =
  | 'team'
  | 'player'
  | 'event'
  | 'rule'
  | 'equipment'
  | 'term'
  | 'record'
  | 'sport-id'
  | 'venue'
  | 'achievement'
  | 'person'
  | 'place'
  | 'work'
  | 'concept';
export type TriviaObscurityFlag =
  | 'surname-inference'
  | 'roster-deep-cut'
  | 'stat-only'
  | 'vague-stem'
  | 'media-tie-in'
  | 'incidental-context'
  | 'famous-nickname'
  | 'edge-case'
  | 'timer-friction';
export type TriviaPlayerArchetype =
  | 'casual'
  | 'streak-hunter'
  | 'culture-first'
  | 'sports-core'
  | 'analytical'
  | 'broad-fan';

export interface TriviaCitation {
  title: string;
  url: string;
  sourceType: 'dataset' | 'reference-search' | 'editorial';
  accessedAt: string;
}

export interface TriviaQuestionRecord {
  id: string;
  feed: TriviaFeed;
  stem: string;
  options: string[];
  answerIndex: number;
  rationaleShort: string;
  rationaleLong: string;
  citations: TriviaCitation[];
  domain: string;
  subdomain: string;
  entities: string[];
  difficultyTarget: TriviaDifficultyTarget;
  lookupRisk: TriviaLookupRisk;
  freshUntil: string;
  status: TriviaQuestionStatus;
  schemaVersion: number;
  promptKind: TriviaPromptKind;
  salienceScore: number;
  obscurityFlags: TriviaObscurityFlag[];
  sourceTier: TriviaSourceTier;
  sourceLabel: TriviaSourceLabel;
  anchorSubdomain: string;
  curveballKind: TriviaCurveballKind;
  legacyFamily: TriviaLegacyFamily;
  isTrickQuestion?: boolean;
  curveballOnly?: boolean;
  variantGroup?: string;
  editorialBucket?: TriviaEditorialBucket;
  themeTags?: string[];
}

export interface TriviaEpisodeDefinition {
  date: string;
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  questionIds: string[];
  difficultyTargets: TriviaDifficultyTarget[];
  finalStretchStartsAt: number;
  themeTag: string;
  refreshableSlotIds: string[];
  publishedAt: string;
  version: string;
}

export interface TriviaEpisodeQuestion extends TriviaQuestionRecord {
  questionNumber: number;
  totalQuestions: number;
}

export interface TriviaEpisode {
  date: string;
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  title: string;
  subtitle: string;
  questionCount: number;
  timerSeconds: number;
  finalStretchStartsAt: number;
  themeTag: string;
  questions: TriviaEpisodeQuestion[];
  version: string;
}

export interface TriviaFeedSummary {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  title: string;
  subtitle: string;
  questionCount: number;
  timerSeconds: number;
  finalStretchLabel: string;
}

export interface TriviaRunAnswer {
  questionId: string;
  selectedOption: number | null;
  correct: boolean;
  timedOut: boolean;
  shielded: boolean;
  points: number;
  timeRemaining: number;
  correctAnswerIndex: number;
}

export interface TriviaRunResult {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  dateKey: string;
  timerSeconds: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  shieldUsed: boolean;
  cleanRun: boolean;
  answerMarks: TriviaAnswerMark[];
}

export interface TriviaPlayerAgentProfile {
  id: string;
  displayName: string;
  archetype: TriviaPlayerArchetype;
  notes: string;
  favoredFeeds: TriviaFeed[];
  baseAccuracyByDifficulty: Record<TriviaDifficultyTarget, number>;
  baseTimeoutByDifficulty: Record<TriviaDifficultyTarget, number>;
  feedAdjustments: Record<TriviaFeed, number>;
  domainAdjustments?: Record<string, number>;
  subdomainAdjustments?: Record<string, number>;
  lookupRiskAdjustments?: Partial<Record<TriviaLookupRisk, number>>;
  editorialBucketAdjustments?: Partial<Record<TriviaEditorialBucket, number>>;
  shieldConfidenceFloor: number;
}

export interface TriviaPlayerAgentSummary {
  agentId: string;
  displayName: string;
  archetype: TriviaPlayerArchetype;
  sampleDays: number;
  averageCorrect: number;
  averageScore: number;
  shieldUseRate: number;
  timeoutRate: number;
  cleanRunRate: number;
  standoutStrengths: string[];
  frictionFlags: string[];
}

export interface TriviaPlayerDaySample {
  date: string;
  agentId: string;
  displayName: string;
  correctCount: number;
  timeoutCount: number;
  shieldUsed: boolean;
  note: string;
}

export interface TriviaPlayerSlotSummary {
  slot: number;
  averageCorrectRate: number;
  timeoutRate: number;
  shieldUseRate: number;
}

export interface TriviaPlayerCalibrationFeedReport {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  sampleDays: number;
  agentSummaries: TriviaPlayerAgentSummary[];
  daySamples: TriviaPlayerDaySample[];
  slotSummaries: TriviaPlayerSlotSummary[];
}

export interface TriviaPlayerCalibrationCohortReport {
  sampleDays: number;
  feeds: Record<TriviaFeed, Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport>>;
}

export interface TriviaPlayerCalibrationReport {
  generatedAt: string;
  sampleDays: number;
  feeds: Record<TriviaFeed, Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport>>;
  cohorts: {
    first90: TriviaPlayerCalibrationCohortReport;
    fullYear: TriviaPlayerCalibrationCohortReport;
  };
}

export interface TriviaAuditRepeatedGroupSummary {
  variantGroup: string;
  stem: string;
  subdomain: string;
  sourceTier: TriviaSourceTier;
  count: number;
  lateSlotHits: number;
}

export interface TriviaAuditSlotFrictionSummary {
  slot: number;
  averageCorrectRate: number;
  timeoutRate: number;
  shieldUseRate: number;
}

export interface TriviaAuditFeedSummary {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  libraryCount: number;
  scheduledCount: number;
  reserveCount: number;
  refreshableCount: number;
  byBucket: Partial<Record<TriviaEditorialBucket, number>>;
  byDifficulty: Record<string, number>;
  rollingQuotaViolations: number;
  staleQuestionCount: number;
  repeatedVariantGroups: number;
  variantReuseCount: number;
  trickQuestionCount: number;
  scheduledOffToneCount: number;
  lateSlotGeneralSportsCount: number;
  curveballSpacingViolations: number;
  first90BlockedPatternCount: number;
  curveballCoverageByMonth: Record<string, number>;
  topRepeatedGroups: TriviaAuditRepeatedGroupSummary[];
  lateSlotLegibilityScore: number;
  agentFrictionBySlot: TriviaAuditSlotFrictionSummary[];
  coreSubdomainShare: number;
  playerGatePass: boolean;
  playerGateFailures: string[];
  playerAgentSummaries: TriviaPlayerAgentSummary[];
  launchReady: boolean;
}

export interface TriviaAuditReport {
  version: string;
  generatedAt: string;
  scheduleStart: string;
  scheduleEnd: string;
  calibrationDays: number;
  feeds: Record<TriviaFeed, Record<TriviaDifficulty, TriviaAuditFeedSummary>>;
}
