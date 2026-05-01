import { getTriviaLocalDateKey } from './date';
import type {
  TriviaDifficulty,
  TriviaEpisode,
  TriviaEpisodeDefinition,
  TriviaFeed,
  TriviaFeedSummary,
  TriviaQuestionRecord,
} from './types';

const OPTION_SEED = 119_731;

type TriviaScheduleByDifficulty = Record<TriviaDifficulty, TriviaEpisodeDefinition[]>;

interface CreateTriviaFeedRuntimeConfig {
  feed: TriviaFeed;
  questions: TriviaQuestionRecord[];
  schedules: TriviaScheduleByDifficulty;
  getFeedSummary: (difficulty?: TriviaDifficulty, date?: Date) => TriviaFeedSummary;
}

export interface TriviaFeedRuntime {
  feed: TriviaFeed;
  getFeedSummary: (difficulty?: TriviaDifficulty, date?: Date) => TriviaFeedSummary;
  getTriviaEpisode: (difficulty?: TriviaDifficulty, date?: Date) => TriviaEpisode;
  getTodayEpisode: (difficulty?: TriviaDifficulty) => TriviaEpisode;
  getArchive: (difficulty?: TriviaDifficulty) => TriviaEpisodeDefinition[];
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
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

export function createTriviaFeedRuntime({
  feed,
  questions,
  schedules,
  getFeedSummary,
}: CreateTriviaFeedRuntimeConfig): TriviaFeedRuntime {
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const episodeMapByDifficulty: Record<
    TriviaDifficulty,
    Map<string, TriviaEpisodeDefinition>
  > = {
    easy: new Map(schedules.easy.map((episode) => [episode.date, episode])),
    hard: new Map(schedules.hard.map((episode) => [episode.date, episode])),
  };

  const getTriviaEpisode = (
    difficulty: TriviaDifficulty = 'hard',
    date: Date = new Date()
  ): TriviaEpisode => {
    const dateKey = getTriviaLocalDateKey(date);
    const episodeDefinition = episodeMapByDifficulty[difficulty].get(dateKey);
    if (!episodeDefinition) {
      const schedule = schedules[difficulty];
      const start = schedule[0]?.date ?? 'unknown';
      const end = schedule[schedule.length - 1]?.date ?? 'unknown';
      throw new Error(
        `No ${feed}/${difficulty} trivia episode scheduled for ${dateKey}. Available schedule runs ${start} through ${end}.`
      );
    }

    const summary = getFeedSummary(difficulty, date);
    const episodeQuestions = episodeDefinition.questionIds.map((questionId, index) => {
      const question = questionMap.get(questionId);
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
      questions: episodeQuestions,
    };
  };

  return {
    feed,
    getFeedSummary,
    getTriviaEpisode,
    getTodayEpisode: (difficulty: TriviaDifficulty = 'hard') => getTriviaEpisode(difficulty),
    getArchive: (difficulty: TriviaDifficulty = 'hard') => [...schedules[difficulty]],
  };
}
