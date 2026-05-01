import {
  hasGimmickDistractorPattern,
  hasStaleRelativePhrasing,
} from './validation';
import type {
  TriviaCalibrationEvidence,
  TriviaCouncilFlag,
  TriviaPlayerAgentProfile,
  TriviaQuestionRecord,
} from './types';

export const TRIVIA_PLAYER_CALIBRATION_DAYS = 28;

export const TRIVIA_SOLVE_AGENTS: TriviaPlayerAgentProfile[] = [
  {
    id: 'casual-pace',
    displayName: 'Casual Pace',
    archetype: 'casual-pace',
    notes: 'Fast-reader generalist who exposes bloated stems and low-payoff obscurity.',
    favoredFeeds: ['mix'],
    baseAccuracyByDifficulty: { 1: 0.84, 2: 0.64, 3: 0.39 },
    baseTimeoutByDifficulty: { 1: 0.02, 2: 0.05, 3: 0.085 },
    feedAdjustments: { mix: 0.03, sports: -0.01 },
    domainAdjustments: { arts: 0.04, world: 0.03, science: -0.03, history: -0.01, sports: 0.01 },
    subdomainAdjustments: { movies: 0.04, music: 0.04, football: 0.01, basketball: 0.01 },
    lookupRiskAdjustments: { medium: -0.03, high: -0.07 },
    shieldConfidenceFloor: 0.46,
  },
  {
    id: 'broad-generalist',
    displayName: 'Broad Generalist',
    archetype: 'broad-generalist',
    notes: 'Middle-of-the-road player who should track the overall Daybreak feel.',
    favoredFeeds: ['mix', 'sports'],
    baseAccuracyByDifficulty: { 1: 0.88, 2: 0.71, 3: 0.52 },
    baseTimeoutByDifficulty: { 1: 0.015, 2: 0.04, 3: 0.075 },
    feedAdjustments: { mix: 0.02, sports: 0.02 },
    domainAdjustments: { arts: 0.02, world: 0.02, science: 0, history: 0.01, sports: 0.03 },
    subdomainAdjustments: { football: 0.03, basketball: 0.03, baseball: 0.02, movies: 0.03, music: 0.03 },
    lookupRiskAdjustments: { medium: -0.01, high: -0.04 },
    shieldConfidenceFloor: 0.5,
  },
  {
    id: 'culture-generalist',
    displayName: 'Culture Generalist',
    archetype: 'culture-generalist',
    notes: 'Strong on people, places, arts, and mainstream culture. Flags trivia that turns too stat-heavy.',
    favoredFeeds: ['mix'],
    baseAccuracyByDifficulty: { 1: 0.9, 2: 0.73, 3: 0.48 },
    baseTimeoutByDifficulty: { 1: 0.015, 2: 0.038, 3: 0.072 },
    feedAdjustments: { mix: 0.04, sports: -0.04 },
    domainAdjustments: { arts: 0.07, world: 0.05, history: 0.01, science: -0.05, sports: -0.05 },
    subdomainAdjustments: { movies: 0.07, music: 0.07, television: 0.06, literature: 0.04 },
    lookupRiskAdjustments: { medium: -0.01, high: -0.05 },
    editorialBucketAdjustments: { topical: 0.03, evergreen: 0.01, experimental: -0.03 },
    shieldConfidenceFloor: 0.44,
  },
  {
    id: 'sports-core',
    displayName: 'Sports Core',
    archetype: 'sports-core',
    notes: 'Mainstream US sports regular who should expose off-feed weirdness and soft sports days.',
    favoredFeeds: ['sports'],
    baseAccuracyByDifficulty: { 1: 0.93, 2: 0.79, 3: 0.58 },
    baseTimeoutByDifficulty: { 1: 0.012, 2: 0.03, 3: 0.06 },
    feedAdjustments: { mix: -0.05, sports: 0.07 },
    domainAdjustments: { sports: 0.08, arts: -0.04, science: -0.03, history: -0.01, world: -0.02 },
    subdomainAdjustments: {
      football: 0.08,
      basketball: 0.07,
      baseball: 0.07,
      hockey: 0.04,
      golf: 0.03,
      tennis: 0.01,
      olympics: 0.02,
      soccer: -0.01,
      motorsport: 0,
    },
    lookupRiskAdjustments: { medium: -0.01, high: -0.05 },
    editorialBucketAdjustments: { current: 0.03, event: 0.04, experimental: -0.05 },
    shieldConfidenceFloor: 0.53,
  },
  {
    id: 'sports-casual',
    displayName: 'Sports Casual',
    archetype: 'sports-casual',
    notes: 'Knows marquee sports moments, but should struggle when a day drifts into deep-cuts or stat bait.',
    favoredFeeds: ['sports'],
    baseAccuracyByDifficulty: { 1: 0.85, 2: 0.61, 3: 0.34 },
    baseTimeoutByDifficulty: { 1: 0.02, 2: 0.055, 3: 0.095 },
    feedAdjustments: { mix: -0.01, sports: 0.02 },
    domainAdjustments: { sports: 0.03, arts: 0, world: 0.01, science: -0.02, history: -0.01 },
    subdomainAdjustments: {
      football: 0.05,
      basketball: 0.04,
      baseball: 0.03,
      hockey: 0.01,
      golf: 0.01,
      tennis: 0.01,
      olympics: 0.02,
      soccer: -0.01,
    },
    lookupRiskAdjustments: { medium: -0.03, high: -0.08 },
    shieldConfidenceFloor: 0.48,
  },
  {
    id: 'analytical-reasoner',
    displayName: 'Analytical Reasoner',
    archetype: 'analytical-reasoner',
    notes: 'Tolerates sharp questions but punishes sloppy wording, brittle distractors, and muddy logic.',
    favoredFeeds: ['mix', 'sports'],
    baseAccuracyByDifficulty: { 1: 0.89, 2: 0.76, 3: 0.58 },
    baseTimeoutByDifficulty: { 1: 0.016, 2: 0.038, 3: 0.075 },
    feedAdjustments: { mix: 0.02, sports: 0.01 },
    domainAdjustments: { science: 0.05, history: 0.05, sports: 0.02, arts: -0.02, world: 0.01 },
    subdomainAdjustments: { technology: 0.05, 'brain-teaser': 0.05, olympics: 0.02, golf: 0.02 },
    lookupRiskAdjustments: { medium: 0, high: -0.03 },
    editorialBucketAdjustments: { evergreen: 0.02, experimental: 0.02, topical: -0.01, current: -0.01 },
    shieldConfidenceFloor: 0.42,
  },
];

function pushFlag(
  flags: TriviaCouncilFlag[],
  agentId: string,
  code: TriviaCouncilFlag['code'],
  severity: TriviaCouncilFlag['severity'],
  message: string,
  scope: TriviaCouncilFlag['scope'] = 'question'
) {
  flags.push({ agentId, code, severity, message, scope });
}

export function evaluateTriviaCouncilQuestion(
  question: TriviaQuestionRecord,
  feed: TriviaQuestionRecord['feed'],
  slot: number,
  evidence?: TriviaCalibrationEvidence
): TriviaCouncilFlag[] {
  const flags: TriviaCouncilFlag[] = [];
  const stemLower = question.stem.toLowerCase();
  const optionLengths = question.options.map((option) => option.length);
  const longestOption = Math.max(...optionLengths);
  const shortestOption = Math.min(...optionLengths);
  const meanAnswerMs = evidence?.meanAnswerMilliseconds ?? null;
  const lateClockStress = evidence?.lateClockStress ?? null;

  if (
    question.obscurityFlags.includes('vague-stem') ||
    /\bwhich statement is true\b|\bone of the following\b/i.test(question.stem)
  ) {
    pushFlag(
      flags,
      'ambiguity-detector',
      'ambiguity',
      'fail',
      'Stem reads as ambiguous or elimination-based rather than a clean Daybreak clue.'
    );
  }

  if (/\bwhich of these\b/i.test(question.stem)) {
    pushFlag(
      flags,
      'ambiguity-detector',
      'ambiguity',
      'warn',
      'Stem leans on elimination phrasing and may need a cleaner rewrite.'
    );
  }

  if (
    question.obscurityFlags.includes('timer-friction') ||
    question.stem.length > 142 ||
    (meanAnswerMs !== null && meanAnswerMs > 11250) ||
    (lateClockStress !== null && lateClockStress > 0.45)
  ) {
    pushFlag(
      flags,
      'timer-friction',
      'timer-friction',
      question.stem.length > 162 || (lateClockStress !== null && lateClockStress > 0.58) ? 'fail' : 'warn',
      'Question is more likely to fail on clock pressure than on satisfying recall.'
    );
  }

  if (
    question.options.some((option) => hasGimmickDistractorPattern(option)) ||
    shortestOption <= 3 ||
    longestOption - shortestOption >= 18
  ) {
    pushFlag(
      flags,
      'distractor-fairness',
      'weak-distractors',
      'warn',
      'Distractor set looks unbalanced or too giveaway-heavy.'
    );
  }

  if (
    question.rationaleShort.trim().length < 35 ||
    question.rationaleLong.trim().length < 65 ||
    question.rationaleLong.toLowerCase().includes(question.rationaleShort.toLowerCase())
  ) {
    pushFlag(
      flags,
      'reveal-value',
      'low-reveal-value',
      'warn',
      'Reveal copy does not add enough payoff beyond the answer lock moment.'
    );
  }

  if (
    question.difficultyTarget <= 2 &&
    question.obscurityFlags.some((flag) => ['surname-inference', 'roster-deep-cut', 'stat-only'].includes(flag))
  ) {
    pushFlag(
      flags,
      'ambiguity-detector',
      'obscurity-mismatch',
      'warn',
      'Question asks for more obscurity than its scheduled difficulty should require.'
    );
  }

  if (
    feed === 'sports' &&
    (question.subdomain === 'general-sports' && slot >= 7
      ? question.promptKind !== 'rule' && question.promptKind !== 'term'
      : /\bmovie|film|tv|television|novel|book|song|lyrics|actor|actress\b/i.test(question.stem))
  ) {
    pushFlag(
      flags,
      'off-feed-fit',
      'off-feed-fit',
      'fail',
      'Sports question drifts away from a sports-led clue or uses a weak general-sports late slot.'
    );
  }

  if (
    question.isTrickQuestion &&
    (question.curveballKind === 'none' ||
      hasStaleRelativePhrasing(question.stem) ||
      /\bwhat year\b|\bwhich year\b|\bwhich statement is true\b/i.test(stemLower))
  ) {
    pushFlag(
      flags,
      'curveball-fairness',
      'dirty-curveball',
      'fail',
      'Curveball is leaning on dirty framing instead of a fair aha moment.'
    );
  }

  return flags;
}

export const TRIVIA_CRITIC_AGENTS = [
  'distractor-fairness',
  'ambiguity-detector',
  'timer-friction',
  'reveal-value',
  'curveball-fairness',
] as const;
