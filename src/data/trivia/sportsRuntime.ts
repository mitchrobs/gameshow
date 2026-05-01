import sportsQuestionsData from './sportsQuestionLibrary.json';
import sportsEasyScheduleData from './sportsEasyEpisodeSchedule.json';
import sportsHardScheduleData from './sportsHardEpisodeSchedule.json';
import { createTriviaFeedRuntime } from './feedRuntime';
import { getTriviaFeedSummary } from './summaries';
import type { TriviaEpisodeDefinition, TriviaQuestionRecord } from './types';

export const sportsTriviaRuntime = createTriviaFeedRuntime({
  feed: 'sports',
  questions: sportsQuestionsData as TriviaQuestionRecord[],
  schedules: {
    easy: sportsEasyScheduleData as TriviaEpisodeDefinition[],
    hard: sportsHardScheduleData as TriviaEpisodeDefinition[],
  },
  getFeedSummary: (difficulty = 'hard', date = new Date()) =>
    getTriviaFeedSummary('sports', difficulty, date),
});
