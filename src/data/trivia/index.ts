import mixQuestionsData from './mixQuestionLibrary.json';
import sportsQuestionsData from './sportsQuestionLibrary.json';
import mixScheduleData from './mixEpisodeSchedule.json';
import sportsScheduleData from './sportsEpisodeSchedule.json';
import auditData from './triviaAudit.json';
import playerCalibrationData from './triviaPlayerCalibration.json';
import type {
  TriviaAuditReport,
  TriviaEpisode,
  TriviaEpisodeDefinition,
  TriviaFeed,
  TriviaFeedSummary,
  TriviaPlayerCalibrationReport,
  TriviaQuestionRecord,
} from './types';
export type {
  TriviaAnswerMark,
  TriviaAuditFeedSummary,
  TriviaAuditReport,
  TriviaCitation,
  TriviaEditorialBucket,
  TriviaEpisode,
  TriviaEpisodeDefinition,
  TriviaEpisodeQuestion,
  TriviaFeed,
  TriviaFeedSummary,
  TriviaLookupRisk,
  TriviaPlayerAgentProfile,
  TriviaPlayerAgentSummary,
  TriviaPlayerArchetype,
  TriviaPlayerCalibrationFeedReport,
  TriviaPlayerCalibrationReport,
  TriviaPlayerDaySample,
  TriviaQuestionRecord,
  TriviaQuestionStatus,
  TriviaRunAnswer,
  TriviaRunResult,
} from './types';
export {
  TRIVIA_LINT_RULES,
  TRIVIA_REQUIRED_FIELDS,
  hasGimmickDistractorPattern,
  hasStaleRelativePhrasing,
  validateEpisodeDefinition,
  validateQuestionRecord,
  validateRunResult,
} from './validation';
export { formatTriviaShareText } from './results';

const DAY_MS = 1000 * 60 * 60 * 24;
const OPTION_SEED = 119_731;

const MIX_SUMMARY: TriviaFeedSummary = {
  feed: 'mix',
  title: 'Daily Mix',
  subtitle: 'Culture, history, science, and sharp little reveals.',
  questionCount: 12,
  timerSeconds: 12,
  finalStretchLabel: 'Final 3',
};

const SPORTS_SUMMARY: TriviaFeedSummary = {
  feed: 'sports',
  title: 'Daily Sports',
  subtitle: 'Leagues, legends, records, and matchday energy.',
  questionCount: 9,
  timerSeconds: 12,
  finalStretchLabel: 'Final 3',
};

const QUESTIONS_BY_FEED: Record<TriviaFeed, TriviaQuestionRecord[]> = {
  mix: mixQuestionsData as TriviaQuestionRecord[],
  sports: sportsQuestionsData as TriviaQuestionRecord[],
};

const SCHEDULE_BY_FEED: Record<TriviaFeed, TriviaEpisodeDefinition[]> = {
  mix: mixScheduleData as TriviaEpisodeDefinition[],
  sports: sportsScheduleData as TriviaEpisodeDefinition[],
};

const QUESTION_MAP_BY_FEED: Record<TriviaFeed, Map<string, TriviaQuestionRecord>> = {
  mix: new Map(QUESTIONS_BY_FEED.mix.map((question) => [question.id, question])),
  sports: new Map(QUESTIONS_BY_FEED.sports.map((question) => [question.id, question])),
};

const EPISODE_MAP_BY_FEED: Record<TriviaFeed, Map<string, TriviaEpisodeDefinition>> = {
  mix: new Map(SCHEDULE_BY_FEED.mix.map((episode) => [episode.date, episode])),
  sports: new Map(SCHEDULE_BY_FEED.sports.map((episode) => [episode.date, episode])),
};

const AUDIT_REPORT = auditData as TriviaAuditReport;
const PLAYER_CALIBRATION_REPORT = playerCalibrationData as TriviaPlayerCalibrationReport;

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const next = [...items];
  const rand = mulberry32(seed);
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function getFeedSummary(feed: TriviaFeed): TriviaFeedSummary {
  return feed === 'mix' ? MIX_SUMMARY : SPORTS_SUMMARY;
}

function shuffleQuestionOptions(
  question: TriviaQuestionRecord,
  feed: TriviaFeed,
  dateKey: string
): TriviaQuestionRecord {
  const decorated = question.options.map((option, index) => ({
    option,
    originalIndex: index,
    weight: hashString(`${feed}:${dateKey}:${question.id}:${index}:${OPTION_SEED}`),
  }));

  decorated.sort((left, right) => {
    if (left.weight !== right.weight) return left.weight - right.weight;
    return left.originalIndex - right.originalIndex;
  });

  return {
    ...question,
    options: decorated.map((entry) => entry.option),
    answerIndex: decorated.findIndex((entry) => entry.originalIndex === question.answerIndex),
  };
}

export function getTriviaLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getTriviaScheduleRange() {
  return {
    start: AUDIT_REPORT.scheduleStart,
    end: AUDIT_REPORT.scheduleEnd,
  };
}

export function getTriviaFeedSummary(feed: TriviaFeed, date: Date = new Date()): TriviaFeedSummary {
  void date;
  return getFeedSummary(feed);
}

export function getTriviaEpisode(feed: TriviaFeed, date: Date = new Date()): TriviaEpisode {
  const dateKey = getTriviaLocalDateKey(date);
  const episodeDefinition = EPISODE_MAP_BY_FEED[feed].get(dateKey);
  if (!episodeDefinition) {
    const { start, end } = getTriviaScheduleRange();
    throw new Error(
      `No ${feed} trivia episode scheduled for ${dateKey}. Available schedule runs ${start} through ${end}.`
    );
  }

  const summary = getFeedSummary(feed);
  const questions = episodeDefinition.questionIds.map((questionId, index) => {
    const question = QUESTION_MAP_BY_FEED[feed].get(questionId);
    if (!question) {
      throw new Error(`Missing trivia question ${questionId} for ${feed} on ${episodeDefinition.date}`);
    }

    return {
      ...shuffleQuestionOptions(question, feed, episodeDefinition.date),
      questionNumber: index + 1,
      totalQuestions: episodeDefinition.questionIds.length,
    };
  });

  return {
    date: episodeDefinition.date,
    feed,
    title: summary.title,
    subtitle: summary.subtitle,
    questionCount: episodeDefinition.questionIds.length,
    timerSeconds: summary.timerSeconds,
    finalStretchStartsAt: episodeDefinition.finalStretchStartsAt,
    themeTag: episodeDefinition.themeTag,
    version: episodeDefinition.version,
    questions,
  };
}

export function getTodayTriviaEpisode(feed: TriviaFeed): TriviaEpisode {
  return getTriviaEpisode(feed, new Date());
}

export function getTriviaArchive(feed: TriviaFeed): TriviaEpisodeDefinition[] {
  return [...SCHEDULE_BY_FEED[feed]];
}

export function getTriviaAuditReport(): TriviaAuditReport {
  return AUDIT_REPORT;
}

export function getTriviaPlayerCalibration(): TriviaPlayerCalibrationReport {
  return PLAYER_CALIBRATION_REPORT;
}

export function getTriviaPlayerCalibrationFeed(
  feed: TriviaFeed
): TriviaPlayerCalibrationReport['feeds'][TriviaFeed] {
  return PLAYER_CALIBRATION_REPORT.feeds[feed];
}

export function getTriviaQuestionPool(feed: TriviaFeed): TriviaQuestionRecord[] {
  return [...QUESTIONS_BY_FEED[feed]];
}

export function getTriviaDateIndex(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}
