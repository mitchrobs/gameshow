import { describe, expect, it } from 'vitest';
import {
  getTriviaArchive,
  getTriviaAuditReport,
  getTriviaEpisode,
  getTriviaFeedSummary,
  getTriviaPlayerCalibration,
  getTriviaQuestionPool,
  getTriviaScheduleRange,
  validateEpisodeDefinition,
  validateQuestionRecord,
  type TriviaFeed,
} from './index';

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function keyForDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function averageSlotRange(slotMap: Map<number, { averageCorrectRate: number }>, slots: number[]) {
  const values = slots.map((slot) => slotMap.get(slot)?.averageCorrectRate ?? 0);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

describe('daily trivia episodes', () => {
  it('ships a full 365-day schedule for both feeds', () => {
    const { start, end } = getTriviaScheduleRange();
    expect(start).toBe('2026-04-26');
    expect(end).toBe('2027-04-25');

    (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
      const archive = getTriviaArchive(feed);
      expect(archive).toHaveLength(365);

      const seen = new Set<string>();
      const firstDate = dateFromKey(start);
      archive.forEach((episode, index) => {
        expect(seen.has(episode.date)).toBe(false);
        seen.add(episode.date);

        const expectedDate = new Date(firstDate);
        expectedDate.setDate(firstDate.getDate() + index);
        expect(episode.date).toBe(keyForDate(expectedDate));
      });
    });
  });

  it('validates every shipped question record and episode definition', () => {
    (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
      const questions = getTriviaQuestionPool(feed);
      const archive = getTriviaArchive(feed);
      const expectedQuestionCount = feed === 'mix' ? 12 : 9;

      const questionIds = new Set(questions.map((question) => question.id));
      expect(questionIds.size).toBe(questions.length);

      questions.forEach((question) => {
        expect(validateQuestionRecord(question)).toEqual([]);
      });

      const scheduledIds = new Set<string>();
      archive.forEach((episode) => {
        expect(validateEpisodeDefinition(episode)).toEqual([]);
        expect(episode.questionIds).toHaveLength(expectedQuestionCount);
        expect(episode.difficultyTargets).toHaveLength(expectedQuestionCount);
        expect(episode.refreshableSlotIds.length).toBeGreaterThan(0);

        episode.questionIds.forEach((questionId) => {
          expect(questionIds.has(questionId)).toBe(true);
          expect(scheduledIds.has(questionId)).toBe(false);
          scheduledIds.add(questionId);
        });
      });
    });
  });

  it('keeps the shipped 365-day schedule off legacy-backed question sources', () => {
    (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
      const archive = getTriviaArchive(feed);
      const questionMap = new Map(
        getTriviaQuestionPool(feed).map((question) => [question.id, question])
      );

      archive.forEach((episode) => {
        episode.questionIds.forEach((questionId) => {
          const question = questionMap.get(questionId);
          expect(question).toBeDefined();
          expect(question?.sourceTier).not.toBe('legacy');
          expect(question?.sourceTier).not.toBe('supplemental');
        });
      });
    });
  });

  it('returns deterministic feed summaries and dated episodes', () => {
    const targetDate = new Date(2026, 3, 26);
    const mixSummary = getTriviaFeedSummary('mix');
    const sportsSummary = getTriviaFeedSummary('sports');

    expect(mixSummary.questionCount).toBe(12);
    expect(mixSummary.timerSeconds).toBe(12);
    expect(sportsSummary.questionCount).toBe(9);
    expect(sportsSummary.timerSeconds).toBe(12);

    (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
      const first = getTriviaEpisode(feed, targetDate);
      const second = getTriviaEpisode(feed, targetDate);
      const expectedCount = feed === 'mix' ? 12 : 9;
      const expectedFinalStretchStart = feed === 'mix' ? 9 : 6;

      expect(first.questionCount).toBe(expectedCount);
      expect(first.questions).toHaveLength(expectedCount);
      expect(first.finalStretchStartsAt).toBe(expectedFinalStretchStart);
      expect(second.questions.map((question) => question.options)).toEqual(
        first.questions.map((question) => question.options)
      );
    });
  });

  it('publishes audit metadata for both feeds', () => {
    const audit = getTriviaAuditReport();
    expect(audit.calibrationDays).toBe(28);
    expect(audit.scheduleStart).toBe('2026-04-26');
    expect(audit.scheduleEnd).toBe('2027-04-25');
    expect(audit.feeds.mix.scheduledCount).toBe(365 * 12);
    expect(audit.feeds.sports.scheduledCount).toBe(365 * 9);
    expect(audit.feeds.mix.libraryCount).toBeGreaterThan(audit.feeds.mix.scheduledCount);
    expect(audit.feeds.sports.libraryCount).toBeGreaterThan(audit.feeds.sports.scheduledCount);
    expect(audit.feeds.mix.trickQuestionCount).toBe(39);
    expect(audit.feeds.sports.trickQuestionCount).toBeGreaterThanOrEqual(30);
    expect(audit.feeds.mix.playerAgentSummaries.length).toBeGreaterThanOrEqual(5);
    expect(audit.feeds.sports.playerAgentSummaries.length).toBeGreaterThanOrEqual(5);
  });

  it('ships player-calibration feedback for both feeds', () => {
    const calibration = getTriviaPlayerCalibration();
    expect(calibration.sampleDays).toBe(28);
    expect(calibration.feeds.mix.agentSummaries.length).toBeGreaterThanOrEqual(5);
    expect(calibration.feeds.sports.agentSummaries.length).toBeGreaterThanOrEqual(5);
    expect(calibration.feeds.mix.daySamples.length).toBeGreaterThan(0);
    expect(calibration.feeds.sports.daySamples.length).toBeGreaterThan(0);
  });

  it('keeps Mix steady and Sports restrained on monthly curveballs', () => {
    const { start } = getTriviaScheduleRange();
    const startMonth = start.slice(0, 7);
    const audit = getTriviaAuditReport();

    (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
      const trickCountsByMonth = Object.entries(audit.feeds[feed].curveballCoverageByMonth);

      trickCountsByMonth.forEach(([monthKey, count]) => {
        if (feed === 'sports') {
          if (monthKey === startMonth) {
            expect(count).toBeGreaterThan(0);
            expect(count).toBeLessThanOrEqual(3);
            return;
          }
          expect(count).toBe(3);
          return;
        }
        if (monthKey === startMonth) {
          expect(count).toBeGreaterThan(0);
          return;
        }
        expect(count).toBe(3);
      });
      if (feed === 'sports') {
        expect(trickCountsByMonth.length).toBeGreaterThanOrEqual(10);
      }
      expect(trickCountsByMonth.reduce((sum, [, count]) => sum + count, 0)).toBe(
        audit.feeds[feed].trickQuestionCount
      );
    });
  });

  it('keeps the updated structural quality floor for both feeds', () => {
    const audit = getTriviaAuditReport();
    const mixSlotMap = new Map(audit.feeds.mix.agentFrictionBySlot.map((slot) => [slot.slot, slot]));
    const sportsSlotMap = new Map(audit.feeds.sports.agentFrictionBySlot.map((slot) => [slot.slot, slot]));
    const mixAgents = new Map(audit.feeds.mix.playerAgentSummaries.map((summary) => [summary.agentId, summary]));
    const sportsAgents = new Map(
      audit.feeds.sports.playerAgentSummaries.map((summary) => [summary.agentId, summary])
    );

    expect(audit.feeds.mix.playerGatePass).toBe(true);
    expect(audit.feeds.mix.playerGateFailures).toEqual([]);
    expect(audit.feeds.mix.scheduledOffToneCount).toBe(0);
    expect(averageSlotRange(mixSlotMap, [1, 2, 3])).toBeGreaterThanOrEqual(0.6);
    expect(averageSlotRange(mixSlotMap, [1, 2, 3])).toBeLessThanOrEqual(0.82);
    expect(averageSlotRange(mixSlotMap, [4, 5, 6])).toBeGreaterThanOrEqual(0.35);
    expect(averageSlotRange(mixSlotMap, [4, 5, 6])).toBeLessThanOrEqual(0.62);
    expect(averageSlotRange(mixSlotMap, [7, 8, 9])).toBeGreaterThanOrEqual(0.2);
    expect(averageSlotRange(mixSlotMap, [7, 8, 9])).toBeLessThanOrEqual(0.37);
    expect(averageSlotRange(mixSlotMap, [10, 11, 12])).toBeGreaterThanOrEqual(0.08);
    expect(averageSlotRange(mixSlotMap, [10, 11, 12])).toBeLessThanOrEqual(0.22);
    expect(mixAgents.get('commuter-max')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(4.4);
    expect(mixAgents.get('broad-ava')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(4.4);

    expect(audit.feeds.sports.scheduledOffToneCount).toBe(0);
    expect(audit.feeds.sports.lateSlotGeneralSportsCount).toBe(0);
    expect(audit.feeds.sports.curveballSpacingViolations).toBe(0);
    expect(audit.feeds.sports.playerGatePass).toBe(true);
    expect(audit.feeds.sports.playerGateFailures).toEqual([]);
    expect(audit.feeds.sports.repeatedVariantGroups).toBeLessThanOrEqual(300);
    expect(audit.feeds.sports.reserveCount).toBeGreaterThanOrEqual(250);
    expect(audit.feeds.sports.coreSubdomainShare).toBeGreaterThanOrEqual(0.68);
    expect(audit.feeds.sports.coreSubdomainShare).toBeLessThanOrEqual(0.8);
    expect(averageSlotRange(sportsSlotMap, [1, 2])).toBeGreaterThanOrEqual(0.5);
    expect(averageSlotRange(sportsSlotMap, [1, 2])).toBeLessThanOrEqual(0.77);
    expect(averageSlotRange(sportsSlotMap, [3, 4, 5])).toBeGreaterThanOrEqual(0.31);
    expect(averageSlotRange(sportsSlotMap, [3, 4, 5])).toBeLessThanOrEqual(0.45);
    expect(sportsSlotMap.get(6)?.averageCorrectRate ?? 0).toBeGreaterThanOrEqual(0.1);
    expect(sportsSlotMap.get(6)?.averageCorrectRate ?? 1).toBeLessThanOrEqual(0.33);
    expect(averageSlotRange(sportsSlotMap, [7, 8, 9])).toBeGreaterThanOrEqual(0.03);
    expect(averageSlotRange(sportsSlotMap, [7, 8, 9])).toBeLessThanOrEqual(0.13);
    expect(sportsAgents.get('commuter-max')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(2.4);
    expect(sportsAgents.get('sports-ryan')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(4.3);
    expect(sportsAgents.get('broad-ava')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(3.5);
    expect(sportsAgents.get('culture-maya')?.averageCorrect ?? 0).toBeGreaterThanOrEqual(2.4);
  });

  it('keeps Sports harder than Mix in the calibrated first-90-day window', () => {
    const audit = getTriviaAuditReport();
    const mixAgents = new Map(audit.feeds.mix.playerAgentSummaries.map((summary) => [summary.agentId, summary]));
    const sportsAgents = new Map(
      audit.feeds.sports.playerAgentSummaries.map((summary) => [summary.agentId, summary])
    );

    expect((sportsAgents.get('commuter-max')?.averageCorrect ?? 99)).toBeLessThan(
      mixAgents.get('commuter-max')?.averageCorrect ?? 0
    );
    expect((sportsAgents.get('broad-ava')?.averageCorrect ?? 99)).toBeLessThan(
      mixAgents.get('broad-ava')?.averageCorrect ?? 0
    );
    expect((sportsAgents.get('sports-ryan')?.averageCorrect ?? 99)).toBeLessThan(
      mixAgents.get('sports-ryan')?.averageCorrect ?? 0
    );
  });

  it('keeps Sports core-heavy rather than soccer- or Olympics-led', () => {
    const archive = getTriviaArchive('sports');
    const questionMap = new Map(
      getTriviaQuestionPool('sports').map((question) => [question.id, question])
    );
    const counts = new Map<string, number>();

    archive.forEach((episode) => {
      episode.questionIds.forEach((questionId) => {
        const question = questionMap.get(questionId);
        if (!question) return;
        counts.set(question.subdomain, (counts.get(question.subdomain) ?? 0) + 1);
      });
    });

    expect((counts.get('football') ?? 0)).toBeGreaterThan(counts.get('soccer') ?? 0);
    expect((counts.get('basketball') ?? 0)).toBeGreaterThan(counts.get('soccer') ?? 0);
    expect((counts.get('baseball') ?? 0)).toBeGreaterThan(counts.get('soccer') ?? 0);
    expect((counts.get('hockey') ?? 0)).toBeGreaterThan(counts.get('olympics') ?? 0);
  });

  it('keeps the scheduled sports feed free of off-tone spillover clues', () => {
    const offToneSportsPattern =
      /\b(movie|film|tv|television|episode|novel|book|song|lyrics|band|musician|actor|actress|character|fictional|imaginary|mascot|favorite football team|favourite football team|most popular sport|national sport of|profession before becoming|beauties as well|what country are they from|how many brothers|special force|supreme court|board of education|court of appeals|peoples court|other company|which war was fought|during which war|battle of marathon|pretty woman|medal of honor)\b/i;
    const archive = getTriviaArchive('sports');
    const questionMap = new Map(
      getTriviaQuestionPool('sports').map((question) => [question.id, question])
    );

    const offenders = archive.flatMap((episode) =>
      episode.questionIds
        .map((questionId) => questionMap.get(questionId))
        .filter(
          (question): question is NonNullable<typeof question> =>
            question !== undefined && offToneSportsPattern.test(question.stem)
        )
        .map((question) => `${episode.date}: ${question.stem}`)
    );

    expect(offenders).toEqual([]);

    const knownRejectedSportsStems = [
      'Wilhelm Kolff invented what device?',
      'Which of the following lists of symptoms is typical of a person with depression?',
      'What is a normal curve?',
    ];
    const sportsStems = new Set(getTriviaQuestionPool('sports').map((question) => question.stem));
    knownRejectedSportsStems.forEach((stem) => {
      expect(sportsStems.has(stem)).toBe(false);
    });
  });
});
