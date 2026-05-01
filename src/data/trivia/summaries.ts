import type { TriviaDifficulty, TriviaFeed, TriviaFeedSummary } from './types';

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

export function getTriviaFeedSummary(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty = 'hard',
  date: Date = new Date()
): TriviaFeedSummary {
  void date;
  return FEED_SUMMARIES[feed][difficulty];
}
