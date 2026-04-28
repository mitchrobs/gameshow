import { describe, expect, it } from 'vitest';
import { formatTriviaShareText } from './results';
import type { TriviaEpisode, TriviaRunResult } from './types';

const EPISODE: TriviaEpisode = {
  date: '2026-04-26',
  feed: 'mix',
  difficulty: 'hard',
  title: 'Daily Mix',
  subtitle: 'Culture, history, science, and sharp little reveals.',
  questionCount: 12,
  timerSeconds: 12,
  finalStretchStartsAt: 9,
  themeTag: 'launch-week',
  version: 'trivia-v1',
  questions: [],
};

const RESULT: TriviaRunResult = {
  feed: 'mix',
  difficulty: 'hard',
  dateKey: '2026-04-26',
  timerSeconds: 12,
  score: 1040,
  correctCount: 9,
  totalQuestions: 12,
  shieldUsed: true,
  cleanRun: false,
  answerMarks: [
    'correct',
    'correct',
    'shielded',
    'wrong',
    'correct',
    'timeout',
    'correct',
    'correct',
    'wrong',
    'correct',
    'correct',
    'correct',
  ],
};

describe('trivia share text', () => {
  it('formats the Daybreak-style sharecode with the right row symbols', () => {
    expect(formatTriviaShareText(RESULT, EPISODE, 'Apr 26, 2026')).toBe(
      [
        'Daily Mix Hard Apr 26, 2026',
        '9/12 · 1040 pts · Shield used',
        '🟩🟩🟦🟨🟩⬛🟩🟩🟨🟩🟩🟩',
        'https://mitchrobs.github.io/gameshow/',
      ].join('\n')
    );
  });
});
