import mixQuestionsData from './mixQuestionLibrary.json';
import mixEasyScheduleData from './mixEasyEpisodeSchedule.json';
import mixHardScheduleData from './mixHardEpisodeSchedule.json';
import { createTriviaFeedRuntime } from './feedRuntime';
import { getTriviaFeedSummary } from './summaries';
import type { TriviaEpisodeDefinition, TriviaQuestionRecord } from './types';

export const mixTriviaRuntime = createTriviaFeedRuntime({
  feed: 'mix',
  questions: mixQuestionsData as TriviaQuestionRecord[],
  schedules: {
    easy: mixEasyScheduleData as TriviaEpisodeDefinition[],
    hard: mixHardScheduleData as TriviaEpisodeDefinition[],
  },
  getFeedSummary: (difficulty = 'hard', date = new Date()) =>
    getTriviaFeedSummary('mix', difficulty, date),
});
