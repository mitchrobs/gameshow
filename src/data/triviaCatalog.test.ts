import { describe, expect, it } from 'vitest';
import { getDailyTriviaCategories, getTriviaQuestions } from './triviaCatalog';
import { SPORTS_CATEGORY, SPORTS_DAILY_PACKS } from './triviaSportsBank';

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

describe('trivia sports bank', () => {
  it('ships a full 365-day bank of eight-question packs', () => {
    expect(SPORTS_DAILY_PACKS).toHaveLength(365);

    const flattened = SPORTS_DAILY_PACKS.flat();
    expect(flattened).toHaveLength(365 * 8);
    expect(SPORTS_CATEGORY.questions).toHaveLength(365 * 8);

    SPORTS_DAILY_PACKS.forEach((pack) => {
      expect(pack).toHaveLength(8);
      pack.forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(question.answerIndex).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex).toBeLessThan(4);
        expect([1, 2, 3]).toContain(question.difficulty);
      });
    });
  });

  it('returns sports as the fixed third daily category', () => {
    const spring = getDailyTriviaCategories(new Date(2026, 3, 24));
    const winter = getDailyTriviaCategories(new Date(2026, 11, 3));

    [spring, winter].forEach((categories) => {
      expect(categories).toHaveLength(3);
      expect(categories[2]?.id).toBe('sports');
      expect(categories.slice(0, 2).some((category) => category.id === 'sports')).toBe(false);
    });
  });

  it('is deterministic for the same date', () => {
    const date = new Date(2026, 5, 1);
    const first = getDailyTriviaCategories(date).map((category) => category.id);
    const second = getDailyTriviaCategories(date).map((category) => category.id);
    expect(second).toEqual(first);
  });

  it('does not repeat the sports pack before the same date next year', () => {
    const start = new Date(2026, 3, 24);
    const startPack = getTriviaQuestions('sports', start).map((question) => question.prompt);

    for (let offset = 1; offset < 365; offset += 1) {
      const pack = getTriviaQuestions('sports', addDays(start, offset)).map(
        (question) => question.prompt
      );
      expect(pack).not.toEqual(startPack);
    }

    const nextYearPack = getTriviaQuestions('sports', addDays(start, 365)).map(
      (question) => question.prompt
    );
    expect(nextYearPack).toEqual(startPack);
  });
});
