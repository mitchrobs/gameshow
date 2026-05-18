import type { ThreadlineDifficulty, ThreadlinePuzzle } from './threadlinePuzzles';

export type ThreadlineCopyAuditSeverity = 'critical' | 'warning';

export type ThreadlineCopyAuditCode =
  | 'generic-title-suffix'
  | 'lead-render-error'
  | 'missing-payoff'
  | 'missing-puzzle'
  | 'missing-review'
  | 'payoff-format'
  | 'payoff-title-duplicate'
  | 'payoff-reuse-window'
  | 'score-below-threshold'
  | 'score-not-number'
  | 'title-spoiler'
  | 'title-coherence'
  | 'title-reuse-window';

export interface ThreadlineAuditScheduleEntry {
  dateKey: string;
  puzzleId: string;
}

export interface ThreadlineAuditReview {
  overallEditorialScore?: number;
  playerAverageScore?: number;
  finalLinePayoffScore?: number;
  safetyFlags?: readonly string[];
  scores?: object;
}

export interface ThreadlineCopyAuditIssue {
  severity: ThreadlineCopyAuditSeverity;
  code: ThreadlineCopyAuditCode;
  message: string;
  puzzleId?: string;
  dateKey?: string;
  value?: string | number;
}

export interface ThreadlineRenderedLead {
  puzzleId: string;
  completedLead: string;
  missingWordIds: string[];
}

export interface ThreadlineReuseEntry {
  value: string;
  count: number;
  puzzleIds: string[];
  dateKeys: string[];
}

export interface ThreadlineTitlePayoffInspection {
  duplicateTitles: ThreadlineReuseEntry[];
  duplicatePayoffs: ThreadlineReuseEntry[];
  genericSuffixTitles: ThreadlineCopyAuditIssue[];
  titleCooldownIssues: ThreadlineCopyAuditIssue[];
  payoffCooldownIssues: ThreadlineCopyAuditIssue[];
}

export interface ThreadlineTitlePayoffCoherence {
  puzzleId: string;
  title: string;
  payoff: string;
  completedLead: string;
  sharedTitleTokens: string[];
  sharedPayoffTokens: string[];
  issues: ThreadlineCopyAuditIssue[];
}

export interface ThreadlineDifficultyProfile {
  puzzleId: string;
  difficulty: ThreadlineDifficulty;
  index: number;
  averageAnswerLength: number;
  maxAnswerLength: number;
  longAnswerCount: number;
  answerCount: number;
  crossingCellCount: number;
  averageHintWords: number;
  declaredDifficultyWeight: number;
}

export interface ThreadlineDifficultyBandSummary {
  difficulty: ThreadlineDifficulty;
  count: number;
  averageIndex: number;
  minIndex: number;
  maxIndex: number;
}

export interface ThreadlineScoreDimensionSummary {
  key: string;
  minimum: number;
  present: number;
  missing: number;
  belowThreshold: number;
  average: number | null;
  min: number | null;
  max: number | null;
}

export interface ThreadlineCopyAuditOptions {
  puzzles: readonly ThreadlinePuzzle[];
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[];
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>;
  editorReview?: Readonly<Record<string, ThreadlineAuditReview | undefined>>;
  titleReuseCooldownDays?: number;
  payoffReuseCooldownDays?: number;
  scoreThresholds?: Readonly<Record<string, number>>;
}

export interface ThreadlineCopyAuditReport {
  issues: ThreadlineCopyAuditIssue[];
  criticalIssues: ThreadlineCopyAuditIssue[];
  warningIssues: ThreadlineCopyAuditIssue[];
  titlePayoff: ThreadlineTitlePayoffInspection;
  difficultyBands: ThreadlineDifficultyBandSummary[];
  scoreDimensions: ThreadlineScoreDimensionSummary[];
}

export const THREADLINE_COPY_SCORE_THRESHOLDS: Readonly<Record<string, number>> = {
  leadWordEditor: 4,
  themeEditor: 4,
  calendarEditor: 4,
  copyEditor: 4,
  safetyEditor: 4,
  gridEditor: 4,
  grammarScore: 4,
  titleCoherenceScore: 4,
  payoffBridgeScore: 4,
  poeticTextureScore: 4,
  difficultyIntegrityScore: 4,
  overallEditorialScore: 4.4,
  playerAverageScore: 4.3,
  finalLinePayoffScore: 4.4,
};

const DIFFICULTY_ORDER: ThreadlineDifficulty[] = ['Easy', 'Medium', 'Hard'];

const DECLARED_DIFFICULTY_WEIGHT: Record<ThreadlineDifficulty, number> = {
  Easy: 0,
  Medium: 0.4,
  Hard: 0.8,
};

const GENERIC_TITLE_SUFFIXES = new Set([
  'corner',
  'hour',
  'loop',
  'morning',
  'path',
  'shelf',
  'table',
  'window',
]);

const TOKEN_STOP_WORDS = new Set([
  'and',
  'are',
  'for',
  'from',
  'into',
  'its',
  'one',
  'the',
  'their',
  'this',
  'through',
  'when',
  'where',
  'with',
]);

const BANNED_LEAD_COPY = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first)\b/i;
const BANNED_PAYOFF_COPY = /\b(theme|clue|hidden turn|line land|same thread|final line)\b/i;

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function normalizeThreadlineCopy(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function meaningfulTokens(copy: string): string[] {
  return normalizeThreadlineCopy(copy)
    .split(' ')
    .filter((token) => token.length > 2 && !TOKEN_STOP_WORDS.has(token));
}

function hasTitleSpoiler(puzzle: ThreadlinePuzzle, titleTokens: readonly string[]): boolean {
  const answerTokens = new Set(puzzle.words.map((word) => normalizeThreadlineCopy(word.answer)));
  const threadTokens = new Set(
    puzzle.threads.flatMap((thread) => meaningfulTokens(`${thread.name} ${thread.clue}`))
  );
  return titleTokens.some((token) => answerTokens.has(token) || threadTokens.has(token));
}

function formatLeadAnswer(answer: string): string {
  return answer.toLowerCase();
}

export function renderThreadlineCompletedLead(puzzle: ThreadlinePuzzle): string {
  const wordsById = new Map(puzzle.words.map((word) => [word.id, word.answer]));

  return puzzle.lead
    .map((segment) => {
      if (segment.type === 'text') return segment.text;
      const answer = wordsById.get(segment.wordId);
      return answer ? formatLeadAnswer(answer) : `[missing:${segment.wordId}]`;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderThreadlineLeadForAudit(puzzle: ThreadlinePuzzle): ThreadlineRenderedLead {
  const wordsById = new Set(puzzle.words.map((word) => word.id));
  const missingWordIds = puzzle.lead
    .filter((segment) => segment.type === 'blank' && !wordsById.has(segment.wordId))
    .map((segment) => (segment.type === 'blank' ? segment.wordId : ''));

  return {
    puzzleId: puzzle.id,
    completedLead: renderThreadlineCompletedLead(puzzle),
    missingWordIds,
  };
}

export function getThreadlineGenericTitleSuffix(title: string): string | null {
  const titleOnly = normalizeThreadlineCopy(title);
  if (GENERIC_TITLE_SUFFIXES.has(titleOnly)) return titleOnly;

  const suffix = title.match(/:\s*([A-Za-z ]+)$/)?.[1];
  const normalizedSuffix = suffix ? normalizeThreadlineCopy(suffix) : '';
  return GENERIC_TITLE_SUFFIXES.has(normalizedSuffix) ? normalizedSuffix : null;
}

function makePuzzleLookup(
  puzzles: readonly ThreadlinePuzzle[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>
): Readonly<Record<string, ThreadlinePuzzle | undefined>> {
  return puzzleById ?? Object.fromEntries(puzzles.map((puzzle) => [puzzle.id, puzzle]));
}

function getOrderedPuzzleEntries(
  puzzles: readonly ThreadlinePuzzle[],
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>
): Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }> {
  if (!datedSchedule) {
    return puzzles.map((puzzle, dayIndex) => ({ puzzle, dayIndex }));
  }

  const lookup = makePuzzleLookup(puzzles, puzzleById);
  return datedSchedule.flatMap((entry, dayIndex) => {
    const puzzle = lookup[entry.puzzleId];
    return puzzle ? [{ puzzle, dateKey: entry.dateKey, dayIndex }] : [];
  });
}

function buildReuseEntries(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>,
  getValue: (puzzle: ThreadlinePuzzle) => string
): ThreadlineReuseEntry[] {
  const grouped = new Map<string, ThreadlineReuseEntry>();

  entries.forEach(({ puzzle, dateKey }) => {
    const value = getValue(puzzle).trim();
    const key = normalizeThreadlineCopy(value);
    if (!key) return;

    const existing =
      grouped.get(key) ??
      ({
        value,
        count: 0,
        puzzleIds: [],
        dateKeys: [],
      } satisfies ThreadlineReuseEntry);

    existing.count += 1;
    existing.puzzleIds.push(puzzle.id);
    if (dateKey) existing.dateKeys.push(dateKey);
    grouped.set(key, existing);
  });

  return Array.from(grouped.values())
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function getCooldownIssues(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  getValue: (puzzle: ThreadlinePuzzle) => string,
  cooldownDays: number,
  code: 'payoff-reuse-window' | 'title-reuse-window',
  label: string
): ThreadlineCopyAuditIssue[] {
  const lastSeen = new Map<string, { dateKey?: string; dayIndex: number; puzzleId: string; value: string }>();
  const issues: ThreadlineCopyAuditIssue[] = [];

  entries.forEach(({ puzzle, dateKey, dayIndex }) => {
    const value = getValue(puzzle).trim();
    const key = normalizeThreadlineCopy(value);
    const previous = lastSeen.get(key);

    if (previous && dayIndex - previous.dayIndex <= cooldownDays) {
      issues.push({
        severity: 'critical',
        code,
        puzzleId: puzzle.id,
        dateKey,
        value,
        message: `${label} repeats after ${dayIndex - previous.dayIndex} days: ${previous.puzzleId} -> ${puzzle.id}`,
      });
    }

    if (key) lastSeen.set(key, { dateKey, dayIndex, puzzleId: puzzle.id, value });
  });

  return issues;
}

export function inspectThreadlineTitlePayoffReuse(
  puzzles: readonly ThreadlinePuzzle[],
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>,
  options: { titleReuseCooldownDays?: number; payoffReuseCooldownDays?: number } = {}
): ThreadlineTitlePayoffInspection {
  const entries = getOrderedPuzzleEntries(puzzles, datedSchedule, puzzleById);
  const genericSuffixTitles = entries
    .map(({ puzzle, dateKey }) => {
      const suffix = getThreadlineGenericTitleSuffix(puzzle.title);
      if (!suffix) return null;

      return {
        severity: 'critical',
        code: 'generic-title-suffix',
        puzzleId: puzzle.id,
        dateKey,
        value: puzzle.title,
        message: `Title uses generic suffix "${suffix}" instead of a specific title angle.`,
      } satisfies ThreadlineCopyAuditIssue;
    })
    .filter((issue): issue is ThreadlineCopyAuditIssue => Boolean(issue));

  return {
    duplicateTitles: buildReuseEntries(entries, (puzzle) => puzzle.title),
    duplicatePayoffs: buildReuseEntries(entries, (puzzle) => puzzle.weave),
    genericSuffixTitles,
    titleCooldownIssues: getCooldownIssues(
      entries,
      (puzzle) => puzzle.title,
      options.titleReuseCooldownDays ?? 180,
      'title-reuse-window',
      'Title'
    ),
    payoffCooldownIssues: getCooldownIssues(
      entries,
      (puzzle) => puzzle.weave,
      options.payoffReuseCooldownDays ?? 180,
      'payoff-reuse-window',
      'Payoff'
    ),
  };
}

export function inspectThreadlineTitlePayoffCoherence(
  puzzle: ThreadlinePuzzle
): ThreadlineTitlePayoffCoherence {
  const rendered = renderThreadlineLeadForAudit(puzzle);
  const title = puzzle.title.trim();
  const payoff = puzzle.weave.trim();
  const titleTokens = meaningfulTokens(title);
  const payoffTokens = meaningfulTokens(payoff);
  const leadTokens = new Set(meaningfulTokens(rendered.completedLead));
  const threadTokens = new Set(puzzle.threads.flatMap((thread) => meaningfulTokens(`${thread.name} ${thread.clue}`)));
  const answerTokens = new Set(puzzle.words.map((word) => word.answer.toLowerCase()));
  const contextTokens = new Set([...leadTokens, ...threadTokens, ...answerTokens]);
  const sharedTitleTokens = titleTokens.filter((token) => contextTokens.has(token));
  const sharedPayoffTokens = payoffTokens.filter((token) => contextTokens.has(token) || titleTokens.includes(token));
  const issues: ThreadlineCopyAuditIssue[] = [];

  if (rendered.missingWordIds.length > 0 || rendered.completedLead.includes('[missing:')) {
    issues.push({
      severity: 'critical',
      code: 'lead-render-error',
      puzzleId: puzzle.id,
      value: rendered.missingWordIds.join(', '),
      message: `Completed lead cannot render missing word ids: ${rendered.missingWordIds.join(', ')}`,
    });
  }

  if (BANNED_LEAD_COPY.test(rendered.completedLead)) {
    issues.push({
      severity: 'critical',
      code: 'lead-render-error',
      puzzleId: puzzle.id,
      value: rendered.completedLead,
      message: 'Completed lead uses puzzle-meta scaffolding instead of a standalone sentence.',
    });
  }

  if (!payoff) {
    issues.push({
      severity: 'critical',
      code: 'missing-payoff',
      puzzleId: puzzle.id,
      message: 'Puzzle is missing final payoff copy.',
    });
  } else if (normalizeThreadlineCopy(payoff) === normalizeThreadlineCopy(title)) {
    issues.push({
      severity: 'critical',
      code: 'payoff-title-duplicate',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff repeats the title instead of landing the completed line.',
    });
  }

  if (payoff && !/[.!?]$/.test(payoff)) {
    issues.push({
      severity: 'warning',
      code: 'payoff-format',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff should read as a finished sentence.',
    });
  }

  if (payoff && BANNED_PAYOFF_COPY.test(payoff)) {
    issues.push({
      severity: 'critical',
      code: 'payoff-format',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff uses puzzle-meta scaffolding instead of an exceptional final sentence.',
    });
  }

  if (titleTokens.length > 0 && hasTitleSpoiler(puzzle, titleTokens)) {
    issues.push({
      severity: 'critical',
      code: 'title-spoiler',
      puzzleId: puzzle.id,
      value: title,
      message: 'Title gives away an answer or theme token before the solve.',
    });
  }

  return {
    puzzleId: puzzle.id,
    title,
    payoff,
    completedLead: rendered.completedLead,
    sharedTitleTokens,
    sharedPayoffTokens,
    issues,
  };
}

export function computeThreadlineDifficultyIndex(puzzle: ThreadlinePuzzle): ThreadlineDifficultyProfile {
  const answerLengths = puzzle.words.map((word) => word.answer.length);
  const answerCount = answerLengths.length;
  const averageAnswerLength =
    answerCount === 0 ? 0 : answerLengths.reduce((total, length) => total + length, 0) / answerCount;
  const maxAnswerLength = answerCount === 0 ? 0 : Math.max(...answerLengths);
  const longAnswerCount = answerLengths.filter((length) => length >= 6).length;
  const averageHintWords =
    answerCount === 0
      ? 0
      : puzzle.words.reduce((total, word) => total + word.hint.split(/\s+/).filter(Boolean).length, 0) /
        answerCount;
  const cellCounts = new Map<string, number>();

  puzzle.words.forEach((word) => {
    word.path.forEach((coord) => {
      const key = `${coord.row},${coord.col}`;
      cellCounts.set(key, (cellCounts.get(key) ?? 0) + 1);
    });
  });

  const crossingCellCount = Array.from(cellCounts.values()).filter((count) => count > 1).length;
  const declaredDifficultyWeight = DECLARED_DIFFICULTY_WEIGHT[puzzle.difficulty];
  const index = round(
    averageAnswerLength +
      longAnswerCount * 0.08 +
      maxAnswerLength * 0.03 +
      averageHintWords * 0.01 +
      crossingCellCount * 0.015 +
      declaredDifficultyWeight
  );

  return {
    puzzleId: puzzle.id,
    difficulty: puzzle.difficulty,
    index,
    averageAnswerLength: round(averageAnswerLength),
    maxAnswerLength,
    longAnswerCount,
    answerCount,
    crossingCellCount,
    averageHintWords: round(averageHintWords),
    declaredDifficultyWeight,
  };
}

export function summarizeThreadlineDifficultyBands(
  puzzles: readonly ThreadlinePuzzle[]
): ThreadlineDifficultyBandSummary[] {
  const profiles = puzzles.map(computeThreadlineDifficultyIndex);

  return DIFFICULTY_ORDER.map((difficulty) => {
    const indexes = profiles
      .filter((profile) => profile.difficulty === difficulty)
      .map((profile) => profile.index);

    return {
      difficulty,
      count: indexes.length,
      averageIndex: indexes.length === 0 ? 0 : round(indexes.reduce((total, index) => total + index, 0) / indexes.length),
      minIndex: indexes.length === 0 ? 0 : Math.min(...indexes),
      maxIndex: indexes.length === 0 ? 0 : Math.max(...indexes),
    };
  });
}

function readReviewScore(review: ThreadlineAuditReview, key: string): unknown {
  if (key === 'overallEditorialScore') return review.overallEditorialScore;
  if (key === 'playerAverageScore') return review.playerAverageScore;
  if (key === 'finalLinePayoffScore') return review.finalLinePayoffScore;
  const scores = review.scores;
  if (!scores || typeof scores !== 'object') return undefined;
  const scoreRecord = scores as Record<string, unknown>;
  return Object.prototype.hasOwnProperty.call(scoreRecord, key) ? scoreRecord[key] : undefined;
}

function inspectReviewScores(
  puzzleIds: readonly string[],
  editorReview: Readonly<Record<string, ThreadlineAuditReview | undefined>>,
  thresholds: Readonly<Record<string, number>>
): { issues: ThreadlineCopyAuditIssue[]; dimensions: ThreadlineScoreDimensionSummary[] } {
  const issues: ThreadlineCopyAuditIssue[] = [];
  const dimensions = Object.entries(thresholds).map(([key, minimum]) => {
    const values: number[] = [];
    let missing = 0;
    let belowThreshold = 0;

    puzzleIds.forEach((puzzleId) => {
      const review = editorReview[puzzleId];
      if (!review) {
        missing += 1;
        return;
      }

      const rawValue = readReviewScore(review, key);
      if (rawValue === undefined || rawValue === null) {
        missing += 1;
        return;
      }

      if (typeof rawValue !== 'number' || Number.isNaN(rawValue)) {
        issues.push({
          severity: 'critical',
          code: 'score-not-number',
          puzzleId,
          value: String(rawValue),
          message: `${key} is present but is not numeric.`,
        });
        return;
      }

      values.push(rawValue);
      if (rawValue < minimum) {
        belowThreshold += 1;
        issues.push({
          severity: 'critical',
          code: 'score-below-threshold',
          puzzleId,
          value: rawValue,
          message: `${key} score ${rawValue} is below the ${minimum} production floor.`,
        });
      }
    });

    return {
      key,
      minimum,
      present: values.length,
      missing,
      belowThreshold,
      average: values.length === 0 ? null : round(values.reduce((total, value) => total + value, 0) / values.length),
      min: values.length === 0 ? null : Math.min(...values),
      max: values.length === 0 ? null : Math.max(...values),
    } satisfies ThreadlineScoreDimensionSummary;
  });

  return { issues, dimensions };
}

export function auditThreadlineCopy(options: ThreadlineCopyAuditOptions): ThreadlineCopyAuditReport {
  const {
    puzzles,
    datedSchedule,
    puzzleById,
    editorReview,
    titleReuseCooldownDays,
    payoffReuseCooldownDays,
    scoreThresholds = THREADLINE_COPY_SCORE_THRESHOLDS,
  } = options;
  const issues: ThreadlineCopyAuditIssue[] = [];
  const lookup = makePuzzleLookup(puzzles, puzzleById);

  datedSchedule?.forEach((entry) => {
    if (!lookup[entry.puzzleId]) {
      issues.push({
        severity: 'critical',
        code: 'missing-puzzle',
        puzzleId: entry.puzzleId,
        dateKey: entry.dateKey,
        message: 'Dated schedule references a missing puzzle.',
      });
    }
  });

  puzzles.forEach((puzzle) => {
    issues.push(...inspectThreadlineTitlePayoffCoherence(puzzle).issues);

    if (editorReview && !editorReview[puzzle.id]) {
      issues.push({
        severity: 'critical',
        code: 'missing-review',
        puzzleId: puzzle.id,
        message: 'Puzzle is missing editor review metadata.',
      });
    }
  });

  const titlePayoff = inspectThreadlineTitlePayoffReuse(puzzles, datedSchedule, lookup, {
    titleReuseCooldownDays,
    payoffReuseCooldownDays,
  });
  issues.push(
    ...titlePayoff.genericSuffixTitles,
    ...titlePayoff.titleCooldownIssues,
    ...titlePayoff.payoffCooldownIssues
  );

  const scoreResult = editorReview
    ? inspectReviewScores(
        puzzles.map((puzzle) => puzzle.id),
        editorReview,
        scoreThresholds
      )
    : { issues: [], dimensions: [] };
  issues.push(...scoreResult.issues);

  const criticalIssues = issues.filter((issue) => issue.severity === 'critical');
  const warningIssues = issues.filter((issue) => issue.severity === 'warning');

  return {
    issues,
    criticalIssues,
    warningIssues,
    titlePayoff,
    difficultyBands: summarizeThreadlineDifficultyBands(puzzles),
    scoreDimensions: scoreResult.dimensions,
  };
}

export function formatThreadlineCopyAuditIssues(issues: readonly ThreadlineCopyAuditIssue[]): string[] {
  return issues.map((issue) => {
    const location = [issue.dateKey, issue.puzzleId].filter(Boolean).join(' ') || 'pack';
    return `${issue.severity}:${issue.code}:${location}: ${issue.message}`;
  });
}
