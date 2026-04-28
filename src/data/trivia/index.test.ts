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
  type TriviaDifficulty,
  type TriviaFeed,
} from './index';

const FEEDS: TriviaFeed[] = ['mix', 'sports'];
const DIFFICULTIES: TriviaDifficulty[] = ['easy', 'hard'];

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

function getExpectedQuestionCount(feed: TriviaFeed) {
  return feed === 'mix' ? 12 : 9;
}

function getExpectedFinalStretchStart(feed: TriviaFeed) {
  return feed === 'mix' ? 9 : 6;
}

describe('daily trivia episodes', () => {
  it('ships a full 365-day schedule for both feeds and both difficulties', () => {
    const { start, end } = getTriviaScheduleRange();
    expect(start).toBe('2026-04-26');
    expect(end).toBe('2027-04-25');

    FEEDS.forEach((feed) => {
      DIFFICULTIES.forEach((difficulty) => {
        const archive = getTriviaArchive(feed, difficulty);
        expect(archive).toHaveLength(365);

        const seen = new Set<string>();
        const firstDate = dateFromKey(start);
        archive.forEach((episode, index) => {
          expect(episode.feed).toBe(feed);
          expect(episode.difficulty).toBe(difficulty);
          expect(seen.has(episode.date)).toBe(false);
          seen.add(episode.date);

          const expectedDate = new Date(firstDate);
          expectedDate.setDate(firstDate.getDate() + index);
          expect(episode.date).toBe(keyForDate(expectedDate));
        });
      });
    });
  });

  it('validates every shipped question record and episode definition', () => {
    FEEDS.forEach((feed) => {
      const questions = getTriviaQuestionPool(feed);
      const expectedQuestionCount = getExpectedQuestionCount(feed);
      const questionIds = new Set(questions.map((question) => question.id));

      expect(questionIds.size).toBe(questions.length);
      questions.forEach((question) => {
        expect(validateQuestionRecord(question)).toEqual([]);
      });

      DIFFICULTIES.forEach((difficulty) => {
        const archive = getTriviaArchive(feed, difficulty);
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
  });

  it('keeps all four shipped schedules off legacy-backed question sources', () => {
    FEEDS.forEach((feed) => {
      const questionMap = new Map(
        getTriviaQuestionPool(feed).map((question) => [question.id, question])
      );

      DIFFICULTIES.forEach((difficulty) => {
        const archive = getTriviaArchive(feed, difficulty);
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
  });

  it('returns deterministic summaries and dated episodes for each game/difficulty', () => {
    const targetDate = new Date(2026, 3, 26);

    FEEDS.forEach((feed) => {
      DIFFICULTIES.forEach((difficulty) => {
        const summary = getTriviaFeedSummary(feed, difficulty);
        const first = getTriviaEpisode(feed, difficulty, targetDate);
        const second = getTriviaEpisode(feed, difficulty, targetDate);

        expect(summary.feed).toBe(feed);
        expect(summary.difficulty).toBe(difficulty);
        expect(summary.questionCount).toBe(getExpectedQuestionCount(feed));
        expect(summary.timerSeconds).toBe(15);
        expect(first.questionCount).toBe(getExpectedQuestionCount(feed));
        expect(first.questions).toHaveLength(getExpectedQuestionCount(feed));
        expect(first.finalStretchStartsAt).toBe(getExpectedFinalStretchStart(feed));
        expect(first.difficulty).toBe(difficulty);
        expect(second.questions.map((question) => question.options)).toEqual(
          first.questions.map((question) => question.options)
        );
      });
    });

    expect(getTriviaFeedSummary('mix').difficulty).toBe('hard');
    expect(getTriviaFeedSummary('sports').difficulty).toBe('hard');
  });

  it('publishes nested audit metadata and player calibration for both games and both difficulties', () => {
    const audit = getTriviaAuditReport();
    const calibration = getTriviaPlayerCalibration();

    expect(audit.calibrationDays).toBe(28);
    expect(audit.scheduleStart).toBe('2026-04-26');
    expect(audit.scheduleEnd).toBe('2027-04-25');
    expect(calibration.sampleDays).toBe(28);

    FEEDS.forEach((feed) => {
      DIFFICULTIES.forEach((difficulty) => {
        const auditFeed = audit.feeds[feed][difficulty];
        const calibrationFeed = calibration.feeds[feed][difficulty];

        expect(auditFeed.feed).toBe(feed);
        expect(auditFeed.difficulty).toBe(difficulty);
        expect(auditFeed.scheduledCount).toBe(365 * getExpectedQuestionCount(feed));
        expect(auditFeed.libraryCount).toBeGreaterThan(auditFeed.scheduledCount);
        expect(auditFeed.playerAgentSummaries.length).toBeGreaterThanOrEqual(5);
        expect(calibrationFeed.feed).toBe(feed);
        expect(calibrationFeed.difficulty).toBe(difficulty);
        expect(calibrationFeed.agentSummaries.length).toBeGreaterThanOrEqual(5);
        expect(calibrationFeed.daySamples.length).toBeGreaterThan(0);
      });
    });
  });

  it('keeps monthly curveball cadence intact for both difficulties', () => {
    const { start } = getTriviaScheduleRange();
    const startMonth = start.slice(0, 7);
    const audit = getTriviaAuditReport();

    FEEDS.forEach((feed) => {
      DIFFICULTIES.forEach((difficulty) => {
        const trickCountsByMonth = Object.entries(audit.feeds[feed][difficulty].curveballCoverageByMonth);

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

        expect(trickCountsByMonth.reduce((sum, [, count]) => sum + count, 0)).toBe(
          audit.feeds[feed][difficulty].trickQuestionCount
        );
      });
    });
  });

  it('keeps both difficulty profiles inside their grouped first-90-day bands', () => {
    const audit = getTriviaAuditReport();

    const mixEasy = new Map(audit.feeds.mix.easy.agentFrictionBySlot.map((slot) => [slot.slot, slot]));
    const mixHard = new Map(audit.feeds.mix.hard.agentFrictionBySlot.map((slot) => [slot.slot, slot]));
    const sportsEasy = new Map(audit.feeds.sports.easy.agentFrictionBySlot.map((slot) => [slot.slot, slot]));
    const sportsHard = new Map(audit.feeds.sports.hard.agentFrictionBySlot.map((slot) => [slot.slot, slot]));

    expect(audit.feeds.mix.easy.playerGatePass).toBe(true);
    expect(audit.feeds.mix.hard.playerGatePass).toBe(true);
    expect(audit.feeds.sports.easy.playerGatePass).toBe(true);
    expect(audit.feeds.sports.hard.playerGatePass).toBe(true);

    expect(averageSlotRange(mixEasy, [1, 2, 3])).toBeGreaterThanOrEqual(0.85);
    expect(averageSlotRange(mixEasy, [1, 2, 3])).toBeLessThanOrEqual(0.93);
    expect(averageSlotRange(mixEasy, [4, 5, 6])).toBeGreaterThanOrEqual(0.72);
    expect(averageSlotRange(mixEasy, [4, 5, 6])).toBeLessThanOrEqual(0.82);
    expect(averageSlotRange(mixEasy, [7, 8, 9])).toBeGreaterThanOrEqual(0.47);
    expect(averageSlotRange(mixEasy, [7, 8, 9])).toBeLessThanOrEqual(0.57);
    expect(averageSlotRange(mixEasy, [10, 11, 12])).toBeGreaterThanOrEqual(0.42);
    expect(averageSlotRange(mixEasy, [10, 11, 12])).toBeLessThanOrEqual(0.53);

    expect(averageSlotRange(mixHard, [1, 2, 3])).toBeGreaterThanOrEqual(0.6);
    expect(averageSlotRange(mixHard, [1, 2, 3])).toBeLessThanOrEqual(0.82);
    expect(averageSlotRange(mixHard, [4, 5, 6])).toBeGreaterThanOrEqual(0.35);
    expect(averageSlotRange(mixHard, [4, 5, 6])).toBeLessThanOrEqual(0.62);
    expect(averageSlotRange(mixHard, [7, 8, 9])).toBeGreaterThanOrEqual(0.2);
    expect(averageSlotRange(mixHard, [7, 8, 9])).toBeLessThanOrEqual(0.37);
    expect(averageSlotRange(mixHard, [10, 11, 12])).toBeGreaterThanOrEqual(0.08);
    expect(averageSlotRange(mixHard, [10, 11, 12])).toBeLessThanOrEqual(0.22);

    expect(averageSlotRange(sportsEasy, [1, 2])).toBeGreaterThanOrEqual(0.78);
    expect(averageSlotRange(sportsEasy, [1, 2])).toBeLessThanOrEqual(0.86);
    expect(averageSlotRange(sportsEasy, [3, 4, 5])).toBeGreaterThanOrEqual(0.55);
    expect(averageSlotRange(sportsEasy, [3, 4, 5])).toBeLessThanOrEqual(0.66);
    expect(sportsEasy.get(6)?.averageCorrectRate ?? 0).toBeGreaterThanOrEqual(0.36);
    expect(sportsEasy.get(6)?.averageCorrectRate ?? 1).toBeLessThanOrEqual(0.46);
    expect(averageSlotRange(sportsEasy, [7, 8, 9])).toBeGreaterThanOrEqual(0.22);
    expect(averageSlotRange(sportsEasy, [7, 8, 9])).toBeLessThanOrEqual(0.32);

    expect(averageSlotRange(sportsHard, [1, 2])).toBeGreaterThanOrEqual(0.5);
    expect(averageSlotRange(sportsHard, [1, 2])).toBeLessThanOrEqual(0.77);
    expect(averageSlotRange(sportsHard, [3, 4, 5])).toBeGreaterThanOrEqual(0.31);
    expect(averageSlotRange(sportsHard, [3, 4, 5])).toBeLessThanOrEqual(0.45);
    expect(sportsHard.get(6)?.averageCorrectRate ?? 0).toBeGreaterThanOrEqual(0.1);
    expect(sportsHard.get(6)?.averageCorrectRate ?? 1).toBeLessThanOrEqual(0.33);
    expect(averageSlotRange(sportsHard, [7, 8, 9])).toBeGreaterThanOrEqual(0.03);
    expect(averageSlotRange(sportsHard, [7, 8, 9])).toBeLessThanOrEqual(0.13);
  });

  it('keeps Sports harder than Mix at both easy and hard levels', () => {
    const audit = getTriviaAuditReport();

    const mixEasyAgents = new Map(audit.feeds.mix.easy.playerAgentSummaries.map((summary) => [summary.agentId, summary]));
    const mixHardAgents = new Map(audit.feeds.mix.hard.playerAgentSummaries.map((summary) => [summary.agentId, summary]));
    const sportsEasyAgents = new Map(
      audit.feeds.sports.easy.playerAgentSummaries.map((summary) => [summary.agentId, summary])
    );
    const sportsHardAgents = new Map(
      audit.feeds.sports.hard.playerAgentSummaries.map((summary) => [summary.agentId, summary])
    );

    expect((sportsEasyAgents.get('commuter-max')?.averageCorrect ?? 99)).toBeLessThan(
      mixEasyAgents.get('commuter-max')?.averageCorrect ?? 0
    );
    expect((sportsEasyAgents.get('broad-ava')?.averageCorrect ?? 99)).toBeLessThan(
      mixEasyAgents.get('broad-ava')?.averageCorrect ?? 0
    );
    expect((sportsHardAgents.get('commuter-max')?.averageCorrect ?? 99)).toBeLessThan(
      mixHardAgents.get('commuter-max')?.averageCorrect ?? 0
    );
    expect((sportsHardAgents.get('broad-ava')?.averageCorrect ?? 99)).toBeLessThan(
      mixHardAgents.get('broad-ava')?.averageCorrect ?? 0
    );
  });

  it('keeps Sports core-heavy in both schedules', () => {
    DIFFICULTIES.forEach((difficulty) => {
      const archive = getTriviaArchive('sports', difficulty);
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
  });

  it('keeps the scheduled sports feeds free of off-tone spillover clues', () => {
    const offToneSportsPattern =
      /\b(movie|film|tv|television|episode|novel|book|song|lyrics|band|musician|actor|actress|character|fictional|imaginary|mascot|favorite football team|favourite football team|most popular sport|national sport of|profession before becoming|beauties as well|what country are they from|how many brothers|special force|supreme court|board of education|court of appeals|peoples court|other company|which war was fought|during which war|battle of marathon|pretty woman|medal of honor)\b/i;
    const questionMap = new Map(
      getTriviaQuestionPool('sports').map((question) => [question.id, question])
    );

    DIFFICULTIES.forEach((difficulty) => {
      const archive = getTriviaArchive('sports', difficulty);
      const offenders = archive.flatMap((episode) =>
        episode.questionIds
          .map((questionId) => questionMap.get(questionId))
          .filter(
            (question): question is NonNullable<typeof question> =>
              question !== undefined && offToneSportsPattern.test(question.stem)
          )
          .map((question) => `${difficulty}:${episode.date}: ${question.stem}`)
      );

      expect(offenders).toEqual([]);
    });

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
