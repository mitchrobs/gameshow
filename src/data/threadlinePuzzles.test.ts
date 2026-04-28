import { describe, expect, it } from 'vitest';
import {
  getThreadlinePuzzles,
  pathToLetters,
  validateThreadlinePuzzle,
} from './threadlinePuzzles';
import {
  THREADLINE_ANSWER_COOLDOWN_DAYS,
  THREADLINE_MAX_ROLLING_AVERAGE_LENGTH,
  THREADLINE_MIN_ROLLING_AVERAGE_LENGTH,
  THREADLINE_RESERVE_DAYS,
  THREADLINE_REVIEW_DAYS,
  THREADLINE_WORDS_PER_DAY,
  generateThreadlineCalendarReview,
  getThreadlineRollingAverageLengths,
  getThreadlineRootFamilyWarnings,
  validateThreadlineReviewCalendar,
} from './threadlineCalendarReview';

describe('threadline puzzles', () => {
  it('keeps authored paths legal and synced to answers', () => {
    const errors = getThreadlinePuzzles().flatMap(validateThreadlinePuzzle);
    expect(errors).toEqual([]);
  });

  it('uses every blank reference as a playable hidden word', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      const wordIds = new Set(puzzle.words.map((word) => word.id));
      const blankIds = puzzle.lead
        .filter((segment) => segment.type === 'blank')
        .map((segment) => segment.wordId);

      expect(blankIds.length).toBeGreaterThan(0);
      blankIds.forEach((id) => expect(wordIds.has(id)).toBe(true));
    });
  });

  it('keeps both threads represented by playable words', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      expect(puzzle.threads).toHaveLength(2);
      puzzle.threads.forEach((thread) => {
        expect(puzzle.words.some((word) => word.threadId === thread.id)).toBe(true);
      });
    });
  });

  it('spells each answer from the grid in path order', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      puzzle.words.forEach((word) => {
        expect(pathToLetters(puzzle, word.path)).toBe(word.answer);
      });
    });
  });

  it('generates a valid 365-day plus reserve review calendar', () => {
    const expectedDays = THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS;
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: expectedDays,
    });

    expect(review.candidates).toHaveLength(expectedDays);
    expect(validateThreadlineReviewCalendar(review.candidates)).toEqual([]);
    expect(review.scoreAverages.threadBalance).toBe(5);
    expect(review.scoreAverages.safetyBrandRisk).toBe(5);
  });

  it('keeps generated answers outside the cooldown window', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });
    const lastSeen = new Map<string, number>();

    review.candidates.forEach((candidate) => {
      candidate.puzzle.words.forEach((word) => {
        const previousDay = lastSeen.get(word.answer);
        if (previousDay !== undefined) {
          expect(candidate.dayIndex - previousDay).toBeGreaterThan(
            THREADLINE_ANSWER_COOLDOWN_DAYS
          );
        }
        lastSeen.set(word.answer, candidate.dayIndex);
      });
    });
  });

  it('keeps generated days at six words with a longer-word bias', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });

    review.candidates.forEach((candidate) => {
      expect(candidate.puzzle.words).toHaveLength(THREADLINE_WORDS_PER_DAY);
      expect(candidate.puzzle.words.filter((word) => word.answer.length >= 6).length).toBeGreaterThanOrEqual(3);
      expect(candidate.puzzle.words.every((word) => word.answer.length >= 4)).toBe(true);
      candidate.puzzle.threads.forEach((thread) => {
        expect(candidate.puzzle.words.filter((word) => word.threadId === thread.id)).toHaveLength(3);
      });
    });
  });

  it('keeps the rolling answer length in the editorial target band', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });
    const rollingAverages = getThreadlineRollingAverageLengths(review.candidates);

    expect(rollingAverages.length).toBeGreaterThan(0);
    rollingAverages.forEach((window) => {
      expect(window.averageLength).toBeGreaterThanOrEqual(THREADLINE_MIN_ROLLING_AVERAGE_LENGTH);
      expect(window.averageLength).toBeLessThanOrEqual(THREADLINE_MAX_ROLLING_AVERAGE_LENGTH);
    });
  });

  it('separates root-family repeats from exact cooldown errors', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });

    expect(validateThreadlineReviewCalendar(review.candidates)).toEqual([]);
    expect(Array.isArray(getThreadlineRootFamilyWarnings(review.candidates))).toBe(true);
  });
});
