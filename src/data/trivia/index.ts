import mixQuestionsData from './mixQuestionLibrary.json';
import sportsQuestionsData from './sportsQuestionLibrary.json';
import mixEasyScheduleData from './mixEasyEpisodeSchedule.json';
import mixHardScheduleData from './mixHardEpisodeSchedule.json';
import sportsEasyScheduleData from './sportsEasyEpisodeSchedule.json';
import sportsHardScheduleData from './sportsHardEpisodeSchedule.json';
import auditData from './triviaAudit.json';
import playerCalibrationData from './triviaPlayerCalibration.json';
import type {
  TriviaAuditReport,
  TriviaDifficulty,
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
  TriviaDifficulty,
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
const TRIVIA_DIFFICULTIES: TriviaDifficulty[] = ['easy', 'hard'];

const FEED_SUMMARIES: Record<TriviaFeed, Record<TriviaDifficulty, TriviaFeedSummary>> = {
  mix: {
    easy: {
      feed: 'mix',
      difficulty: 'easy',
      title: 'Daily Mix',
      subtitle: 'Culture, history, science, and broad general knowledge.',
      questionCount: 12,
      timerSeconds: 15,
      finalStretchLabel: 'Final 3',
    },
    hard: {
      feed: 'mix',
      difficulty: 'hard',
      title: 'Daily Mix',
      subtitle: 'Culture, history, science, and sharp little reveals.',
      questionCount: 12,
      timerSeconds: 15,
      finalStretchLabel: 'Final 3',
    },
  },
  sports: {
    easy: {
      feed: 'sports',
      difficulty: 'easy',
      title: 'Daily Sports',
      subtitle: 'Leagues, legends, and the mainstream sports moments you should know.',
      questionCount: 9,
      timerSeconds: 15,
      finalStretchLabel: 'Final 3',
    },
    hard: {
      feed: 'sports',
      difficulty: 'hard',
      title: 'Daily Sports',
      subtitle: 'Leagues, legends, records, and the details that matter.',
      questionCount: 9,
      timerSeconds: 15,
      finalStretchLabel: 'Final 3',
    },
  },
};

const QUESTIONS_BY_FEED: Record<TriviaFeed, TriviaQuestionRecord[]> = {
  mix: mixQuestionsData as TriviaQuestionRecord[],
  sports: sportsQuestionsData as TriviaQuestionRecord[],
};

const SCHEDULE_BY_FEED: Record<TriviaFeed, Record<TriviaDifficulty, TriviaEpisodeDefinition[]>> = {
  mix: {
    easy: mixEasyScheduleData as TriviaEpisodeDefinition[],
    hard: mixHardScheduleData as TriviaEpisodeDefinition[],
  },
  sports: {
    easy: sportsEasyScheduleData as TriviaEpisodeDefinition[],
    hard: sportsHardScheduleData as TriviaEpisodeDefinition[],
  },
};

const QUESTION_MAP_BY_FEED: Record<TriviaFeed, Map<string, TriviaQuestionRecord>> = {
  mix: new Map(QUESTIONS_BY_FEED.mix.map((question) => [question.id, question])),
  sports: new Map(QUESTIONS_BY_FEED.sports.map((question) => [question.id, question])),
};

const EPISODE_MAP_BY_FEED: Record<
  TriviaFeed,
  Record<TriviaDifficulty, Map<string, TriviaEpisodeDefinition>>
> = {
  mix: {
    easy: new Map(SCHEDULE_BY_FEED.mix.easy.map((episode) => [episode.date, episode])),
    hard: new Map(SCHEDULE_BY_FEED.mix.hard.map((episode) => [episode.date, episode])),
  },
  sports: {
    easy: new Map(SCHEDULE_BY_FEED.sports.easy.map((episode) => [episode.date, episode])),
    hard: new Map(SCHEDULE_BY_FEED.sports.hard.map((episode) => [episode.date, episode])),
  },
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

function getFeedSummary(feed: TriviaFeed, difficulty: TriviaDifficulty = 'hard'): TriviaFeedSummary {
  return FEED_SUMMARIES[feed][difficulty];
}

function shuffleQuestionOptions(
  question: TriviaQuestionRecord,
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  dateKey: string
): TriviaQuestionRecord {
  const decorated = question.options.map((option, index) => ({
    option,
    originalIndex: index,
    weight: hashString(`${feed}:${difficulty}:${dateKey}:${question.id}:${index}:${OPTION_SEED}`),
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

export function getTriviaFeedSummary(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard',
  date: Date = new Date()
): TriviaFeedSummary {
  void date;
  return getFeedSummary(feed, difficulty);
}

export function getTriviaEpisode(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard',
  date: Date = new Date()
): TriviaEpisode {
  const dateKey = getTriviaLocalDateKey(date);
  const episodeDefinition = EPISODE_MAP_BY_FEED[feed][difficulty].get(dateKey);
  if (!episodeDefinition) {
    const { start, end } = getTriviaScheduleRange();
    throw new Error(
      `No ${feed}/${difficulty} trivia episode scheduled for ${dateKey}. Available schedule runs ${start} through ${end}.`
    );
  }

  const summary = getFeedSummary(feed, difficulty);
  const questions = episodeDefinition.questionIds.map((questionId, index) => {
    const question = QUESTION_MAP_BY_FEED[feed].get(questionId);
    if (!question) {
      throw new Error(
        `Missing trivia question ${questionId} for ${feed}/${difficulty} on ${episodeDefinition.date}`
      );
    }

    return {
      ...shuffleQuestionOptions(question, feed, difficulty, episodeDefinition.date),
      questionNumber: index + 1,
      totalQuestions: episodeDefinition.questionIds.length,
    };
  });

  return {
    date: episodeDefinition.date,
    feed,
    difficulty,
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

export function getTodayTriviaEpisode(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard'
): TriviaEpisode {
  return getTriviaEpisode(feed, difficulty, new Date());
}

export function getTriviaArchive(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard'
): TriviaEpisodeDefinition[] {
  return [...SCHEDULE_BY_FEED[feed][difficulty]];
}

export function getTriviaAuditReport(): TriviaAuditReport {
  return AUDIT_REPORT;
}

export function getTriviaPlayerCalibration(): TriviaPlayerCalibrationReport {
  return PLAYER_CALIBRATION_REPORT;
}

export function getTriviaPlayerCalibrationFeed(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard'
): TriviaPlayerCalibrationReport['feeds'][TriviaFeed][TriviaDifficulty] {
  return PLAYER_CALIBRATION_REPORT.feeds[feed][difficulty];
}

export function getTriviaQuestionPool(feed: TriviaFeed): TriviaQuestionRecord[] {
  return [...QUESTIONS_BY_FEED[feed]];
}

export function getTriviaDateIndex(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}
