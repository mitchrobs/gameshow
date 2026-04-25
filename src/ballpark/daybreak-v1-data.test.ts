import { describe, expect, it } from 'vitest';
import {
  CALENDAR_END_KEY,
  CYCLE_START_KEY,
  DAYBREAK_CYCLE_LENGTH,
  getDailySet,
  runAuthoredContentValidationSuite,
  shiftDateKey,
  validateAuthoredLibrary,
} from './daybreak-v1-data.mjs';

function isFriday(dateKey: string): boolean {
  return new Date(`${dateKey}T12:00:00`).getDay() === 5;
}

describe('Ballpark 2026 calendar', () => {
  it('ships a validated authored calendar through the end of 2026', async () => {
    const summary = await runAuthoredContentValidationSuite();

    expect(DAYBREAK_CYCLE_LENGTH).toBe(253);
    expect(summary.passed).toBe(true);
    expect(summary.daysChecked).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(summary.failures).toEqual([]);
    expect(summary.warnings).toEqual([]);
  });

  it('keeps every authored day varied in scale and upward in difficulty', () => {
    const summary = validateAuthoredLibrary();

    expect(summary.daysChecked).toBe(DAYBREAK_CYCLE_LENGTH);

    summary.authoredSets.forEach((dailySet) => {
      const scaleBands = new Set(dailySet.questions.map((question) => question.scaleBand));
      const firstScaleRank = dailySet.questions[0]?.scaleBand;

      expect(scaleBands.size).toBeGreaterThanOrEqual(2);
      expect(dailySet.questions[1]?.difficultyScore).toBeGreaterThanOrEqual(
        dailySet.questions[0]?.difficultyScore ?? 0
      );
      expect(dailySet.questions[2]?.difficultyScore).toBeGreaterThanOrEqual(
        dailySet.questions[1]?.difficultyScore ?? 0
      );
      expect(
        dailySet.questions
          .slice(1)
          .some((question) => question.scaleBand !== firstScaleRank)
      ).toBe(true);

      if (dailySet.extraInning) {
        expect(dailySet.extraInning.difficultyScore).toBeGreaterThanOrEqual(4);
        expect(dailySet.extraInning.difficultyScore).toBeGreaterThanOrEqual(
          dailySet.questions[2]?.difficultyScore ?? 0
        );
      }
    });
  });

  it('anchors the intended holiday dates to the intended themes', async () => {
    const expectedThemeByDate: Record<string, string> = {
      '2026-05-10': 'Flower Shop',
      '2026-05-25': 'Backyard Grill',
      '2026-06-19': 'Block Party',
      '2026-06-21': 'Garage Weekend',
      '2026-07-04': 'Fireworks Night',
      '2026-09-07': 'Toolbox Day',
      '2026-10-31': 'Candy Bowl',
      '2026-11-26': 'Thanksgiving Table',
      '2026-12-24': 'Stocking Stuffers',
      '2026-12-25': 'Under the Tree',
      '2026-12-31': 'Countdown Night',
    };

    await Promise.all(
      Object.entries(expectedThemeByDate).map(async ([dateKey, expectedTheme]) => {
        const dailySet = await getDailySet(dateKey);
        expect(dailySet.source).toBe('authored');
        expect(dailySet.theme).toBe(expectedTheme);
      })
    );
  });

  it('adds an Extra Inning on Fridays and keeps non-Fridays to the main three', async () => {
    for (let offset = 0; offset < DAYBREAK_CYCLE_LENGTH; offset += 1) {
      const dateKey = shiftDateKey(CYCLE_START_KEY, offset);
      const dailySet = await getDailySet(dateKey);
      expect(Boolean(dailySet.extraInning)).toBe(isFriday(dateKey));
    }
  });

  it('falls back cleanly outside the authored 2026 calendar', async () => {
    const afterCalendar = await getDailySet(shiftDateKey(CALENDAR_END_KEY, 1));

    expect(afterCalendar.source).toBe('fallback');
    expect(afterCalendar.fallbackReason).toMatch(/No authored Ballpark set scheduled/);
    expect(afterCalendar.questions).toHaveLength(3);
    expect(afterCalendar.extraInning).toBeUndefined();
  });
});
