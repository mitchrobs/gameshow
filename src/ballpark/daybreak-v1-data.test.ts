import { describe, expect, it } from 'vitest';
import {
  AUTHORED_BALLPARK_CALENDAR,
  CALENDAR_END_KEY,
  CYCLE_START_KEY,
  DAYBREAK_CYCLE_LENGTH,
  getDailySet,
  getThemePlayabilityForDate,
  runBallparkContentAudit,
  runAuthoredContentValidationSuite,
  shiftDateKey,
  validateAuthoredLibrary,
} from './daybreak-v1-data.mjs';

type BallparkQuestionSummary = {
  difficultyScore: number;
  scaleBand: string;
};

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
      const scaleBands = new Set(
        dailySet.questions.map((question: BallparkQuestionSummary) => question.scaleBand)
      );
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
          .some((question: BallparkQuestionSummary) => question.scaleBand !== firstScaleRank)
      ).toBe(true);

      if (dailySet.extraInning) {
        expect(dailySet.extraInning.difficultyScore).toBeGreaterThanOrEqual(4);
        expect(dailySet.extraInning.difficultyScore).toBeGreaterThanOrEqual(
          dailySet.questions[2]?.difficultyScore ?? 0
        );
        expect(dailySet.extraInning.answer).toBeGreaterThan(dailySet.questions[2]?.answer ?? 0);
      }
    });
  });

  it('uses a true date-keyed calendar with unique themes and sourced questions', () => {
    const summary = runBallparkContentAudit();
    const calendarDates = Object.keys(AUTHORED_BALLPARK_CALENDAR);
    const seenPrompts = new Set<string>();
    const seenThemes = new Set<string>();

    expect(calendarDates).toHaveLength(DAYBREAK_CYCLE_LENGTH);
    expect(summary.questionsChecked).toBe(795);
    expect(summary.uniqueThemes).toBe(DAYBREAK_CYCLE_LENGTH);

    summary.authoredSets.forEach((dailySet) => {
      expect(seenThemes.has(dailySet.theme)).toBe(false);
      seenThemes.add(dailySet.theme);

      [...dailySet.questions, ...(dailySet.extraInning ? [dailySet.extraInning] : [])].forEach(
        (question) => {
          expect(seenPrompts.has(question.prompt)).toBe(false);
          seenPrompts.add(question.prompt);
          expect(question.answerType).toMatch(/^(exact|estimate|range)$/);
          expect(question.sources.length).toBeGreaterThan(0);
          question.sources.forEach((source) => {
            expect(source.title.length).toBeGreaterThan(2);
            expect(source.url).toMatch(/^https?:\/\//);
            expect(source.accessedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          });
        }
      );
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

  it('launches April 25 on a tactile, pictureable Ballpark set', async () => {
    const dailySet = await getDailySet('2026-04-25');

    expect(dailySet.source).toBe('authored');
    expect(dailySet.theme).toBe('The Physics of Sports Balls');
    expect(dailySet.theme).not.toBe('Calendar Math');
    expect(getThemePlayabilityForDate('2026-04-25')).toBe('tactile');
  });

  it('replaces the weak launch-window packs called out by players', async () => {
    const apr30 = await getDailySet('2026-04-30');
    const may7 = await getDailySet('2026-05-07');
    const may8 = await getDailySet('2026-05-08');
    const apr30Prompts = new Set(apr30.questions.map((question) => question.prompt));

    expect(may7.theme).toBe('Money Museum');
    expect(may7.theme).not.toBe('Cash Counts');
    expect(may7.questions.map((question) => question.prompt).join(' ')).not.toMatch(
      /\$1 bills|pennies.*make|would you need to make/i
    );

    expect(may8.theme).toBe('Backyard Birds');
    expect(may8.theme).not.toBe('Ocean Creatures');
    may8.questions.forEach((question) => {
      expect(apr30Prompts.has(question.prompt)).toBe(false);
      expect(question.prompt.toLowerCase()).not.toContain('octopus');
    });
  });

  it('spaces puzzle themes so they stay occasional and never Friday-led', () => {
    const scheduledPlayability: string[] = [];

    for (let offset = 0; offset < DAYBREAK_CYCLE_LENGTH; offset += 1) {
      const dateKey = shiftDateKey(CYCLE_START_KEY, offset);
      const playability = getThemePlayabilityForDate(dateKey);
      scheduledPlayability.push(playability);

      if (offset < 7) {
        expect(playability).not.toBe('puzzle');
      }

      if (isFriday(dateKey)) {
        expect(playability).not.toBe('puzzle');
      }

      if (playability === 'puzzle') {
        expect(scheduledPlayability[offset - 1]).not.toBe('puzzle');
      }

      const rollingWindow = scheduledPlayability.slice(Math.max(0, offset - 6), offset + 1);
      expect(rollingWindow.filter((value) => value === 'puzzle').length).toBeLessThanOrEqual(1);
    }
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
