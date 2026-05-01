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
  | 'casual-pace'
  | 'broad-generalist'
  | 'culture-generalist'
  | 'sports-core'
  | 'sports-casual'
  | 'analytical-reasoner';
export type TriviaTelemetryConfidenceTier = 'agent-only' | 'emerging' | 'trusted';
export type TriviaTelemetryTimeBucket =
  | 'lt-4s'
  | 'lt-8s'
  | 'lt-12s'
  | 'lt-15s'
  | 'timeout';
export type TriviaCouncilFlagCode =
  | 'ambiguity'
  | 'timer-friction'
  | 'weak-distractors'
  | 'low-reveal-value'
  | 'obscurity-mismatch'
  | 'off-feed-fit'
  | 'dirty-curveball'
  | 'over-soft-opening'
  | 'over-harsh-finish';
export type TriviaCouncilFlagSeverity = 'info' | 'warn' | 'fail';

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
  shieldArmed: boolean;
  points: number;
  timeRemaining: number;
  answerMilliseconds: number;
  correctAnswerIndex: number;
}

export interface TriviaTelemetryQuestionAggregate {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  questionId: string;
  plays: number;
  correctCount: number;
  wrongCount: number;
  timeoutCount: number;
  shieldArmedCount: number;
  shieldSaveCount: number;
  totalAnswerMilliseconds: number;
  timeBucketHistogram: Partial<Record<TriviaTelemetryTimeBucket, number>>;
}

export interface TriviaTelemetrySlotAggregate {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  slot: number;
  plays: number;
  correctCount: number;
  wrongCount: number;
  timeoutCount: number;
  shieldArmedCount: number;
  shieldSaveCount: number;
  totalAnswerMilliseconds: number;
  timeBucketHistogram: Partial<Record<TriviaTelemetryTimeBucket, number>>;
}

export interface TriviaTelemetrySnapshot {
  generatedAt: string;
  questions: TriviaTelemetryQuestionAggregate[];
  slots: TriviaTelemetrySlotAggregate[];
}

export interface TriviaCalibrationEvidence {
  agentCorrectRate: number;
  observedCorrectRate: number | null;
  blendedCorrectRate: number;
  agentTimeoutRate: number;
  observedTimeoutRate: number | null;
  blendedTimeoutRate: number;
  agentShieldRate: number;
  observedShieldRate: number | null;
  blendedShieldRate: number;
  meanAnswerMilliseconds: number | null;
  lateClockStress: number | null;
  telemetrySampleSize: number;
  telemetryConfidence: TriviaTelemetryConfidenceTier;
}

export interface TriviaCouncilFlag {
  agentId: string;
  code: TriviaCouncilFlagCode;
  severity: TriviaCouncilFlagSeverity;
  message: string;
  scope: 'question' | 'slot-group';
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
  agentCorrectRate: number;
  observedCorrectRate: number | null;
  blendedCorrectRate: number;
  agentTimeoutRate: number;
  observedTimeoutRate: number | null;
  blendedTimeoutRate: number;
  agentShieldRate: number;
  observedShieldRate: number | null;
  blendedShieldRate: number;
  telemetrySampleSize: number;
  telemetryConfidence: TriviaTelemetryConfidenceTier;
  meanAnswerMilliseconds: number | null;
  lateClockStress: number | null;
}

export interface TriviaPlayerCalibrationFeedReport {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  sampleDays: number;
  agentSummaries: TriviaPlayerAgentSummary[];
  daySamples: TriviaPlayerDaySample[];
  slotSummaries: TriviaPlayerSlotSummary[];
  slotGroupEvidence: Record<string, TriviaCalibrationEvidence>;
  councilFlags: TriviaCouncilFlag[];
  questionEvidence: TriviaQuestionScheduleEvidence[];
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
  agentCorrectRate: number;
  observedCorrectRate: number | null;
  blendedCorrectRate: number;
  agentTimeoutRate: number;
  observedTimeoutRate: number | null;
  blendedTimeoutRate: number;
  agentShieldRate: number;
  observedShieldRate: number | null;
  blendedShieldRate: number;
  telemetrySampleSize: number;
  telemetryConfidence: TriviaTelemetryConfidenceTier;
  meanAnswerMilliseconds: number | null;
  lateClockStress: number | null;
}

export interface TriviaQuestionScheduleEvidence {
  date: string;
  slot: number;
  questionId: string;
  subdomain: string;
  promptKind: TriviaPromptKind;
  telemetrySampleSize: number;
  telemetryConfidence: TriviaTelemetryConfidenceTier;
  agentCorrectRate: number;
  observedCorrectRate: number | null;
  blendedCorrectRate: number;
  councilFlags: TriviaCouncilFlag[];
  replacementReason: string | null;
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
  observedCorrectRate: number | null;
  observedTimeoutRate: number | null;
  observedShieldRate: number | null;
  blendedCorrectRate: number;
  telemetrySampleSize: number;
  telemetryConfidence: TriviaTelemetryConfidenceTier;
  replacementCount: number;
  replacementReasons: string[];
  slotGroupEvidence: Record<string, TriviaCalibrationEvidence>;
  questionEvidence: TriviaQuestionScheduleEvidence[];
  councilFlags: TriviaCouncilFlag[];
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
