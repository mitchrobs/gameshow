import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  AUTHORED_BALLPARK_CALENDAR,
  AUTHORED_BALLPARK_RESERVE_PACKS,
  BALLPARK_PLAYER_AGENT_PROFILES,
  BALLPARK_PLAYER_AGENT_ROLES,
  CALENDAR_END_KEY,
  CYCLE_START_KEY,
  DEFAULT_LAUNCH_WINDOW_DAYS,
  DAYBREAK_CYCLE_LENGTH,
  getDailySet,
  getPlayableDailySet,
  classifyBallparkContentForRemediation,
  classifyBallparkReserveContentForRemediation,
  getBallparkPlayableStatus,
  getBallparkReservePool,
  getBallparkReviewPacket,
  getBallparkRemediationBatch,
  runBallpark400PackAudit,
  runBallparkProductionReadinessAudit,
  runBallparkReserveLaunchReadinessAudit,
  getThemePlayabilityForDate,
  runBallparkContentAudit,
  runBallparkLaunchReadinessAudit,
  runAuthoredContentValidationSuite,
  shiftDateKey,
  validateDailySet,
  validateBallparkReserveBank,
  validateAuthoredLibrary,
} from './daybreak-v1-data.mjs';

type BallparkQuestionSummary = {
  difficultyScore: number;
  scaleBand: string;
};

function isFriday(dateKey: string): boolean {
  return new Date(`${dateKey}T12:00:00`).getDay() === 5;
}

function countFridaysInCalendar(): number {
  let fridayCount = 0;
  for (let offset = 0; offset < DAYBREAK_CYCLE_LENGTH; offset += 1) {
    if (isFriday(shiftDateKey(CYCLE_START_KEY, offset))) {
      fridayCount += 1;
    }
  }
  return fridayCount;
}

describe('Ballpark 2026 calendar', () => {
  it('does not keep runtime family-generator scaffolding in the authored content module', () => {
    const moduleText = readFileSync(new URL('./daybreak-v1-data.mjs', import.meta.url), 'utf8');

    expect(moduleText).not.toMatch(
      /GENERATED_FAMILIES|THEME_PREFIXES_BY_FAMILY|buildGeneratedPack|getGeneratedPackIndex|getCuratedThemeName|OPENING_PROMPTS|OPENING_FACTS|EXTRA_PROMPTS|seed-jitter|seed \*/
    );
  });

  it('ships a validated 365-day authored calendar through all of 2026', async () => {
    const summary = await runAuthoredContentValidationSuite();

    expect(CYCLE_START_KEY).toBe('2026-01-01');
    expect(CALENDAR_END_KEY).toBe('2026-12-31');
    expect(DAYBREAK_CYCLE_LENGTH).toBe(365);
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
      }
    });
  });

  it('uses a true date-keyed calendar with unique themes and sourced questions', () => {
    const summary = runBallparkContentAudit();
    const calendarDates = Object.keys(AUTHORED_BALLPARK_CALENDAR);
    const seenThemes = new Set<string>();
    const expectedQuestionCount = DAYBREAK_CYCLE_LENGTH * 3 + countFridaysInCalendar();

    expect(calendarDates).toHaveLength(DAYBREAK_CYCLE_LENGTH);
    expect(summary.questionsChecked).toBe(expectedQuestionCount);
    expect(summary.uniqueThemes).toBe(DAYBREAK_CYCLE_LENGTH);

    summary.authoredSets.forEach((dailySet) => {
      expect(seenThemes.has(dailySet.theme)).toBe(false);
      expect(dailySet.theme).not.toMatch(/^(Corner|Neighborhood|Downtown|County Fair|Community)\b/);
      seenThemes.add(dailySet.theme);

      [...dailySet.questions, ...(dailySet.extraInning ? [dailySet.extraInning] : [])].forEach(
        (question) => {
          expect(question.answerType).toMatch(/^(exact|estimate|range)$/);
          expect(question.answerNote.length).toBeGreaterThan(7);
          expect(question.prompt).not.toMatch(/\bfor the [a-z][a-z -]+\?/i);
          expect(question.prompt).not.toMatch(
            /\b(one-inch|one inch|football field after|five-gallon bucket|syrup ounces|coffee ounces|paper feet|four full bowling racks|five-pound|dozen roses|stack of plywood|classroom canvas|regulation basketball court)\b/i
          );
          expect(`${question.prompt} ${question.funFact}`).not.toMatch(
            /in the (corner-shop|neighborhood|downtown|fairground|community) version|at rush hour|at year-end|over a three-day stretch/i
          );
          const answerInReveal = question.funFact.match(/lands at ([0-9,]+)/);
          if (answerInReveal) {
            expect(Number(answerInReveal[1].replace(/,/g, ''))).toBe(question.answer);
          }
          const answerFirstReveal = question.funFact.match(/^Answer: ([0-9,]+)\./);
          expect(answerFirstReveal).toBeTruthy();
          expect(Number(answerFirstReveal?.[1].replace(/,/g, ''))).toBe(question.answer);
          expect(question.themeKey.length).toBeGreaterThan(2);
          expect(question.questionKey.length).toBeGreaterThan(2);
          expect(question.estimationMode).toMatch(/^(count|capacity|rate|distance|area|weight|crowd|duration)$/);
          expect(question.calibrationAnchor.length).toBeGreaterThan(7);
          expect(question.questionMove).toMatch(/^(familiar_anchor|physical_capacity|object_anatomy|production_scale|famous_macro|iconic_exact)$/);
          expect(question.anchorType).toMatch(/^(regulation|named_standard|iconic_object|sourced_typical|famous_event|natural_scale)$/);
          expect(typeof question.iconicExact).toBe('boolean');
          expect(question.agentDifficultyTarget).toMatch(/^(normal|wide_spread_bonus)$/);
          if (question.answerType === 'exact') {
            expect(question.iconicExact).toBe(true);
          }
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

  it('passes full-year launch-readiness after resolved-output player review is complete', () => {
    const structuralSummary = runBallparkContentAudit();
    const launchSummary = runBallparkLaunchReadinessAudit();

    expect(structuralSummary.passed).toBe(true);
    expect(launchSummary.passed).toBe(true);
    expect(launchSummary.daysChecked).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(launchSummary.questionsChecked).toBe(
      DAYBREAK_CYCLE_LENGTH * 3 + countFridaysInCalendar()
    );
    expect(launchSummary.blockerCount).toBe(0);
    expect(launchSummary.warningCount).toBe(0);

    [
      'extra_inning_scaffold',
      'low_answer_precision',
      'generated_context',
      'theme_title',
      'editorial_status',
      'default_agent_review',
      'clue_arithmetic',
      'arbitrary_container',
      'weak_macro',
      'reveal_scaffold',
    ].forEach((category) => {
      expect(launchSummary.categories[category].count).toBe(0);
      expect(launchSummary.categories[category].examples.length).toBe(0);
    });
    expect(launchSummary.categories.repeated_base_shape.count).toBe(0);
    expect(launchSummary.categories.question_move_repetition.count).toBe(0);
    expect(launchSummary.categories.weak_anchor.count).toBe(0);
    expect(launchSummary.categories.agent_review.count).toBe(0);
    expect(launchSummary.categories.agent_review.examples.length).toBe(0);
    expect(launchSummary.categories.agent_signoff.count).toBe(0);
    expect(launchSummary.warningCategories.source_specificity.count).toBe(0);
    expect(launchSummary.warningCategories.source_specificity.examples.length).toBe(0);
  });

  it('treats the eight-player-agent panel as part of the launch-ready contract', () => {
    expect(BALLPARK_PLAYER_AGENT_PROFILES).toHaveLength(8);
    expect(BALLPARK_PLAYER_AGENT_ROLES).toEqual(
      BALLPARK_PLAYER_AGENT_PROFILES.map((profile) => profile.role)
    );
    BALLPARK_PLAYER_AGENT_PROFILES.forEach((profile) => {
      expect(profile.playerType.length).toBeGreaterThan(20);
      expect(profile.qualityLens.length).toBeGreaterThan(20);
      expect(profile.blocksOn).toMatch(/P1\/P2/);
    });

    const rawSet = JSON.parse(JSON.stringify(AUTHORED_BALLPARK_CALENDAR['2026-04-26']));
    rawSet.editorialStatus = 'launch_ready';
    rawSet.playerAgentSignoff = [...BALLPARK_PLAYER_AGENT_ROLES];

    const validatedSet = validateDailySet(rawSet, '2026-04-26');
    expect(validatedSet.editorialStatus).toBe('launch_ready');
    expect(validatedSet.playerAgentSignoff).toEqual([...BALLPARK_PLAYER_AGENT_ROLES]);

    rawSet.playerAgentSignoff = ['Casual Morning Player', 'Unrecognized Agent'];
    expect(() => validateDailySet(rawSet, '2026-04-26')).toThrow(/invalid playerAgentSignoff role/);

    rawSet.playerAgentSignoff = [...BALLPARK_PLAYER_AGENT_ROLES];
    rawSet.playerAgentFindings = [
      { role: 'Casual Morning Player', severity: 'PX', message: 'Bad severity should fail.' },
    ];
    expect(() => validateDailySet(rawSet, '2026-04-26')).toThrow(/invalid severity/);
  });

  it('classifies every authored day for continuous launch remediation', () => {
    const classification = classifyBallparkContentForRemediation();
    const aprilBatch = getBallparkRemediationBatch('2026-04');

    expect(classification.days).toHaveLength(DAYBREAK_CYCLE_LENGTH);
    expect(classification.actionCounts.keep).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(classification.actionCounts.revise).toBe(0);
    expect(classification.actionCounts.replace).toBe(0);
    expect(classification.launchReadyDays).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(classification.automatedClearDays).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(classification.monthSummaries).toHaveLength(12);

    classification.days.forEach((day) => {
      expect(day.date).toMatch(/^2026-\d{2}-\d{2}$/);
      expect(day.month).toMatch(/^2026-\d{2}$/);
      expect(day.action).toMatch(/^(keep|revise|replace)$/);
      expect(Array.isArray(day.playerAgentSignoff)).toBe(true);
      expect(Array.isArray(day.playerAgentFindings)).toBe(true);
      if (day.launchReady) {
        expect(day.editorialStatus).toBe('launch_ready');
        expect(day.blockerCount).toBe(0);
      } else if (day.automatedClear) {
        expect(['draft', 'source_ready', 'player_ready', 'launch_ready']).toContain(day.editorialStatus);
        expect(day.contentBlockerCount).toBe(0);
      } else {
        expect(day.contentBlockerCount).toBeGreaterThanOrEqual(1);
      }
    });

    expect(aprilBatch.month).toBe('2026-04');
    expect(aprilBatch.days.every((day) => day.month === '2026-04')).toBe(true);
    expect(aprilBatch.days.length).toBe(30);
    expect(aprilBatch.launchReadyDays).toBe(aprilBatch.days.length);
    expect(aprilBatch.automatedClearDays).toBe(aprilBatch.days.length);
  });

  it('tracks automated-clear reserve candidates outside the active launch window', () => {
    const reservePool = getBallparkReservePool({
      fromDateKey: '2026-05-17',
      windowDays: DEFAULT_LAUNCH_WINDOW_DAYS,
    });

	    expect(reservePool.excludedLaunchWindow.start).toBe('2026-05-17');
	    expect(reservePool.excludedLaunchWindow.end).toBe('2026-06-30');
	    expect(reservePool.candidates.every((day) => day.automatedClear)).toBe(true);
	    expect(reservePool.candidates.every((day) => day.warningCount === 0)).toBe(true);
	    expect(reservePool.candidates.every((day) => day.date < '2026-05-17' || day.date > '2026-06-30')).toBe(true);
	  });

  it('reports rolling production readiness and full-year completion when all packs are green', () => {
    const launchWindow = runBallparkProductionReadinessAudit('2026-05-21');
    const blockedWindow = runBallparkProductionReadinessAudit('2026-05-17');
    const oneDayWindow = runBallparkProductionReadinessAudit('2026-04-26', 1);

    expect(launchWindow.requestedWindowDays).toBe(DEFAULT_LAUNCH_WINDOW_DAYS);
    expect(launchWindow.daysChecked).toBe(DEFAULT_LAUNCH_WINDOW_DAYS);
    expect(launchWindow.productionReady).toBe(true);
    expect(launchWindow.fullYearReady).toBe(true);
    expect(launchWindow.fullYear.daysChecked).toBe(DAYBREAK_CYCLE_LENGTH);
    expect(launchWindow.blockerCount).toBe(0);
    expect(launchWindow.categoryCounts.default_agent_review ?? 0).toBe(0);
    expect(launchWindow.categoryCounts.arbitrary_container ?? 0).toBe(0);
    expect(launchWindow.fullYear.blockerCount).toBe(0);

    expect(blockedWindow.productionReady).toBe(true);
    expect(blockedWindow.blockerCount).toBe(0);

    expect(oneDayWindow.daysChecked).toBe(1);
    expect(oneDayWindow.windowDateKeys).toEqual(['2026-04-26']);
    expect(oneDayWindow.productionReady).toBe(true);
    expect(oneDayWindow.fullYear.blockerCount).toBe(0);
  });

  it('blocks production access to out-of-window Ballpark dates', async () => {
    const todayStatus = getBallparkPlayableStatus('2026-05-21', {
      fromDateKey: '2026-05-21',
    });
    const repairedWindowStatus = getBallparkPlayableStatus('2026-04-26', {
      fromDateKey: '2026-04-26',
      windowDays: 1,
    });
    const futureStatus = getBallparkPlayableStatus('2026-12-31', {
      fromDateKey: '2026-05-21',
    });
    const playableSet = await getPlayableDailySet('2026-05-21', {
      fromDateKey: '2026-05-21',
    });
    const repairedPlayableSet = await getPlayableDailySet('2026-04-26', {
      fromDateKey: '2026-04-26',
      windowDays: 1,
    });
    const futurePlayableSet = await getPlayableDailySet('2026-12-31', {
      fromDateKey: '2026-05-21',
    });

    expect(todayStatus.playable).toBe(true);
    expect(todayStatus.reason).toBe('launch_ready');
    expect(repairedWindowStatus.playable).toBe(true);
    expect(repairedWindowStatus.reason).toBe('launch_ready');
    expect(futureStatus.playable).toBe(false);
    expect(futureStatus.reason).toBe('outside_launch_window');
    expect(playableSet.available).toBe(true);
    expect(playableSet.dailySet?.date).toBe('2026-05-21');
    expect(repairedPlayableSet.available).toBe(true);
    expect(repairedPlayableSet.dailySet?.date).toBe('2026-04-26');
    expect(futurePlayableSet.available).toBe(false);
    expect(futurePlayableSet.dailySet).toBeUndefined();
  });

  it('builds self-contained review packets so player agents never need filesystem search', () => {
    const packet = getBallparkReviewPacket({
      dates: ['2026-04-26', '2026-04-27', '2026-05-01'],
      reserveIds: ['reserve-001'],
    });

    expect(packet.agentRoles).toEqual([...BALLPARK_PLAYER_AGENT_ROLES]);
    expect(packet.agentProfiles).toEqual([...BALLPARK_PLAYER_AGENT_PROFILES]);
    expect(packet.agentProfiles).toHaveLength(8);
    expect(packet.reviewInstructions.join(' ')).toMatch(/player-type lenses/);
    expect(packet.summary.days).toBe(3);
    expect(packet.summary.reservePacks).toBe(1);
    expect(packet.summary.totalPacks).toBe(4);
    expect(packet.summary.automatedClearDays).toBe(3);
    expect(packet.summary.automatedClearReservePacks).toBe(1);
    expect(packet.days.map((day) => day.date)).toEqual([
      '2026-04-26',
      '2026-04-27',
      '2026-05-01',
    ]);
    expect(packet.reservePacks.map((pack) => pack.reserveId)).toEqual(['reserve-001']);
    expect(packet.reservePacks[0].extraInning).toBeTruthy();
    packet.days.forEach((day) => {
      expect(Array.isArray(day.playerAgentSignoff)).toBe(true);
      expect(Array.isArray(day.playerAgentFindings)).toBe(true);
      expect(day.questions).toHaveLength(3);
      expect(day.questions[0].prompt.length).toBeGreaterThan(10);
      expect(day.questions[0].sources.length).toBeGreaterThan(0);
      expect(day.blockers).toHaveLength(0);
    });
    expect(packet.days.find((day) => day.date === '2026-05-01')?.extraInning).toBeTruthy();
  });

  it('ships a 35-pack undated reserve bank and certifies the 400-pack set', () => {
    const reserveValidation = validateBallparkReserveBank();
    const reserveAudit = runBallparkReserveLaunchReadinessAudit();
    const reserveClassification = classifyBallparkReserveContentForRemediation();
    const combinedAudit = runBallpark400PackAudit();
    const reserveThemes = new Set(AUTHORED_BALLPARK_RESERVE_PACKS.map((pack) => pack.theme));
    const reserveIds = new Set(AUTHORED_BALLPARK_RESERVE_PACKS.map((pack) => pack.reserveId));

    expect(AUTHORED_BALLPARK_RESERVE_PACKS).toHaveLength(35);
    expect(reserveIds.size).toBe(35);
    expect(reserveThemes.size).toBe(35);
    expect(reserveValidation.passed).toBe(true);
    expect(reserveValidation.questionsChecked).toBe(35 * 4);
    expect(reserveAudit.passed).toBe(true);
    expect(reserveAudit.categories.default_agent_review.count).toBe(0);
    expect(reserveAudit.warningCount).toBe(0);
    expect(reserveClassification.launchReadyPacks).toBe(35);

    reserveValidation.reservePacks.forEach((pack) => {
      expect(pack.reserveId).toMatch(/^reserve-\d{3}$/);
      expect(pack.editorialStatus).toBe('launch_ready');
      expect(pack.playerAgentSignoff).toEqual([...BALLPARK_PLAYER_AGENT_ROLES]);
      expect(pack.questions).toHaveLength(3);
      expect(pack.extraInning).toBeTruthy();
      expect(pack.extraInning?.agentDifficultyTarget).toBe('wide_spread_bonus');
      expect(pack.extraInning?.difficultyScore).toBe(5);
    });

    expect(combinedAudit.passed).toBe(true);
    expect(combinedAudit.datedReady).toBe(365);
    expect(combinedAudit.reserveReady).toBe(35);
    expect(combinedAudit.totalReady).toBe(400);
    expect(combinedAudit.categoryCounts.default_agent_review).toBe(0);
    expect(combinedAudit.categoryCounts.repeated_prompt).toBe(0);
    expect(combinedAudit.warningCount).toBe(0);
  });

  it('anchors the intended holiday dates to the intended themes', async () => {
    const expectedThemeByDate: Record<string, string> = {
      '2026-01-01': "New Year's Desk Calendar",
      '2026-01-19': 'Service Kitchen',
      '2026-02-14': 'Valentine Candy Counter',
      '2026-02-16': 'Presidents Day Desk',
      '2026-03-17': 'St. Patrick Parade',
      '2026-04-01': 'Prank Desk',
      '2026-04-22': 'Earth Day Cleanup',
      '2026-05-10': 'Flower Shop',
      '2026-05-25': 'Memorial Day Cookout',
      '2026-06-19': 'Juneteenth Block Party',
      '2026-06-21': "Father's Day Cards",
      '2026-07-04': 'Fireworks Finale',
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
    expect(dailySet.theme).toBe('Science Museum Lens Lab');
    expect(dailySet.theme).not.toBe('Calendar Math');
    expect(getThemePlayabilityForDate('2026-04-25')).toBe('tactile');
  });

  it('keeps the launch-window week concrete and free of generated venue residue', async () => {
    const expectedThemesByDate: Record<string, string> = {
      '2026-04-26': 'Bike Shop Tune-Up',
      '2026-04-27': 'Rooftop Garden Beds',
      '2026-04-28': 'Public Art Mural',
      '2026-04-29': 'Hotel Key Desk',
      '2026-04-30': 'Deep-Sea Giants',
      '2026-05-01': 'Library Returns Desk',
    };

    await Promise.all(
      Object.entries(expectedThemesByDate).map(async ([dateKey, expectedTheme]) => {
        const dailySet = await getDailySet(dateKey);
        expect(dailySet.theme).toBe(expectedTheme);
        [...dailySet.questions, ...(dailySet.extraInning ? [dailySet.extraInning] : [])].forEach(
          (question) => {
            expect(`${question.prompt} ${question.funFact} ${question.answerNote}`).not.toMatch(
              /around the neighborhood|at the corner shop|full long-weekend rush|Computed from the cited reference/i
            );
          }
        );
      })
    );
  });

  it('uses curated domain themes instead of cross-domain mad libs', async () => {
    const jan2 = await getDailySet('2026-01-02');
    const apr26 = await getDailySet('2026-04-26');

    expect(jan2.source).toBe('authored');
    expect(Boolean(jan2.extraInning)).toBe(true);
    expect([jan2.theme, apr26.theme].join(' ')).not.toMatch(/Orchard Library Cart|Subway Tool Bench/);
  });

  it('replaces May 17 with a calibratable Apple Orchard pack', async () => {
    const dailySet = await getDailySet('2026-05-17');

    expect(dailySet.source).toBe('authored');
    expect(dailySet.theme).toBe('Apple Orchard');
    expect(dailySet.theme).not.toBe('Orchard Library Cart');
    expect(dailySet.questions.map((question) => question.prompt).join(' ')).toMatch(/bushel|tree|acre/);
    dailySet.questions.forEach((question) => {
      expect(question.themeKey).toBe('apple-orchard');
      expect(question.calibrationAnchor.length).toBeGreaterThan(7);
    });
  });

  it('keeps today Game Night from becoming recall-first or two repeated sales macros', async () => {
    const dailySet = await getDailySet('2026-05-23');
    const prompts = dailySet.questions.map((question) => question.prompt);
    const worldwideSalesPrompts = prompts.filter((prompt) =>
      /\b(?:sold|sales|sell|selling)\b/i.test(prompt) && /\bworldwide\b/i.test(prompt)
    );

    expect(dailySet.theme).toBe('Game Night');
    expect(prompts[0]).toMatch(/Jenga/i);
    expect(prompts[0]).not.toMatch(/standard deck/i);
    expect(new Set(dailySet.questions.map((question) => question.questionMove))).toEqual(
      new Set(['iconic_exact', 'object_anatomy', 'famous_macro'])
    );
    expect(worldwideSalesPrompts.length).toBeLessThanOrEqual(1);
  });

  it('includes source metadata in the content fingerprint', async () => {
    const baseSet = await getDailySet('2026-05-17');
    const revisedRawSet = JSON.parse(JSON.stringify(AUTHORED_BALLPARK_CALENDAR['2026-05-17']));
    revisedRawSet.questions[0].sources[0].title = `${revisedRawSet.questions[0].sources[0].title} revised`;

    const revisedSet = await getDailySet('2026-05-17', {
      provider: async () => revisedRawSet,
    });

    expect(revisedSet.source).toBe('authored');
    expect(revisedSet.contentFingerprint).not.toBe(baseSet.contentFingerprint);
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
    expect(may8.extraInning?.prompt).toMatch(/bird|tern|migration/i);
    expect(may8.extraInning?.prompt).not.toMatch(/redwood/i);
    expect(may8.extraInning?.questionMove).toBe('famous_macro');
    expect(may8.extraInning?.agentDifficultyTarget).toBe('wide_spread_bonus');
    may8.questions.forEach((question) => {
      expect(apr30Prompts.has(question.prompt)).toBe(false);
      expect(question.prompt.toLowerCase()).not.toContain('octopus');
    });
  });

  it('applies the calibrated Ballpark quality reset to the active launch window', async () => {
    const launchWindow = runBallparkProductionReadinessAudit('2026-05-21', DEFAULT_LAUNCH_WINDOW_DAYS);
    const backyardRainfall = await getDailySet('2026-05-21');
    const toyChest = await getDailySet('2026-05-22');
    const memorialDay = await getDailySet('2026-05-25');
    const lightShow = await getDailySet('2026-06-07');
    const fireworks = await getDailySet('2026-07-04');

    expect(launchWindow.productionReady).toBe(true);
    expect(launchWindow.blockerCount).toBe(0);
    expect(launchWindow.categoryCounts.default_agent_review ?? 0).toBe(0);
    expect(launchWindow.categoryCounts.arbitrary_container ?? 0).toBe(0);
    expect(launchWindow.days.every((day) => day.contentBlockerCount === 0)).toBe(true);
    expect(launchWindow.fullYearReady).toBe(true);

    expect(backyardRainfall.theme).toBe('Backyard Rainfall');
    expect(backyardRainfall.questions[2].prompt).toMatch(/Niagara Falls/i);
    expect(backyardRainfall.questions[2].questionMove).toBe('famous_macro');
    backyardRainfall.questions.forEach((question) => {
      expect(question.funFact).toMatch(/^Answer: [0-9,]+[.]/);
      expect(question.funFact.length).toBeLessThanOrEqual(90);
    });

    expect(toyChest.questions[2].prompt).not.toMatch(/25 kids|each dump|120-piece tub/i);
    expect(new Set(toyChest.questions.map((question) => question.questionMove)).size).toBeGreaterThanOrEqual(2);
    expect(toyChest.extraInning?.agentDifficultyTarget).toBe('wide_spread_bonus');
    expect(memorialDay.questions.map((question) => question.prompt).join(' ')).not.toMatch(/coolers|long .*block/i);
    expect(lightShow.questions.map((question) => question.prompt).join(' ')).toMatch(/Las Vegas Sphere/i);
    expect(lightShow.questions.map((question) => question.prompt).join(' ')).not.toMatch(/Rockefeller|Christmas|extension cord/i);
    expect(fireworks.questions.map((question) => question.prompt).join(' ')).not.toMatch(/show plan|climb-feet|barges firing/i);
  });

  it('keeps repaired Moon Watch and Countdown Night facts fair and sourced', async () => {
    const moonWatch = await getDailySet('2026-05-13');
    const countdownNight = await getDailySet('2026-12-31');

    expect(moonWatch.theme).toBe('Moon Watch');
    expect(moonWatch.questions[1].prompt).not.toMatch(/seconds for light/i);
    expect(moonWatch.questions[2].questionMove).toBe('famous_macro');
    expect(moonWatch.questions[2].prompt).not.toMatch(/moon-watching seconds/i);
    expect(moonWatch.questions[2].answer).toBeGreaterThan(100000);

    expect(countdownNight.questions[0].prompt).toMatch(/Times Square Ball/i);
    expect(countdownNight.questions[0].answerType).toBe('exact');
    expect(countdownNight.questions[0].prompt).toMatch(/circular crystals/i);
    expect(countdownNight.questions[2].questionMove).toBe('famous_macro');
    expect(countdownNight.questions[2].prompt).toMatch(/Times Square New Year's broadcast/i);
    expect(countdownNight.questions.filter((question) => question.answerType === 'exact')).toHaveLength(1);
  });

  it('keeps broader-player polish gates strict enough to catch unresolved review and repetition', () => {
    const combinedAudit = runBallpark400PackAudit();
    const reviewScoreKeys = [
      'firstGuessFairness',
      'calibrationFun',
      'revealSatisfaction',
      'copyClarity',
      'freshness',
    ];
    const artificialUnitPattern =
      /\b(?:viewer|audience|listener|waiting|reader|visitor|passenger|conveyor|rise|climb|lap|lane|song|checkout|oven|blade|washer|moon-watching|table-lap|claw-machine|concert-hall|yellow-bus|passenger-seat)-?(?:minutes|seconds|feet|inches|miles|hours|beats|turns|rotations|ounces|pounds|square-inches|square inches)\b/i;
    const promptNumberPattern = /\b\d[\d,]*(?:\.\d+)?\b/g;
    const allPacks = [
      ...validateAuthoredLibrary().authoredSets,
      ...validateBallparkReserveBank().reservePacks,
    ];
    const allQuestions = allPacks.flatMap((pack) => [
      ...pack.questions,
      ...(pack.extraInning ? [pack.extraInning] : []),
    ]);

    expect(combinedAudit.passed).toBe(true);
    expect(combinedAudit.totalReady).toBe(400);
    expect(combinedAudit.blockerCount).toBe(0);
    expect(combinedAudit.warningCount).toBe(0);
    expect(combinedAudit.categoryCounts.artificial_unit ?? 0).toBe(0);
    expect(combinedAudit.categoryCounts.placeholder_source ?? 0).toBe(0);
    expect(combinedAudit.categoryCounts.agent_review_scores ?? 0).toBe(0);
    expect(combinedAudit.categoryCounts.iconic_exact_mix ?? 0).toBe(0);
    expect(combinedAudit.categoryCounts.default_agent_review).toBe(0);
    expect(combinedAudit.categoryCounts.repeated_prompt).toBe(0);

    expect(allPacks.filter((pack) => pack.playerAgentReviews?.length === 8)).toHaveLength(400);
    allPacks.forEach((pack) => {
      pack.playerAgentReviews.forEach((review) => {
        expect(['P3', undefined]).toContain(review.severity);
        reviewScoreKeys.forEach((scoreKey) => {
          expect(review.scores[scoreKey]).toBeGreaterThanOrEqual(4);
        });
      });
    });

    const iconicExactCount = allQuestions.filter((question) => question.answerType === 'exact').length;
    expect(iconicExactCount).toBeGreaterThanOrEqual(40);
    expect(iconicExactCount).toBeLessThanOrEqual(70);
    allQuestions.forEach((question) => {
      expect(question.prompt).not.toMatch(artificialUnitPattern);
      expect(question.prompt.match(promptNumberPattern)?.length ?? 0).toBeLessThanOrEqual(1);
      expect(question.sources.some((source) => source.url.includes('mitchrobs.github.io/gameshow/ballpark'))).toBe(false);
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
      if (dailySet.extraInning) {
        expect(dailySet.extraInning.answer).not.toBe(dailySet.questions[2].answer * 3);
      }
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
