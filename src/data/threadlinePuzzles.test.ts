import { describe, expect, it } from 'vitest';
import {
  getDailyThreadline,
  getThreadlinePuzzles,
  pathToLetters,
  validateThreadlinePuzzle,
} from './threadlinePuzzles';
import {
  THREADLINE_DATED_PUZZLE_BY_DATE,
  THREADLINE_DATED_SCHEDULE,
  THREADLINE_EDITOR_REVIEW,
  THREADLINE_HOLIDAY_NODS,
  THREADLINE_PUZZLE_BANK,
  THREADLINE_PUZZLE_BY_ID,
  THREADLINE_RESERVES,
  THREADLINE_SHIPPED_DATED_DAYS,
  THREADLINE_SHIPPED_END_DATE_KEY,
  THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS,
  THREADLINE_SHIPPED_FORMER_RESERVE_DAYS,
  THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH,
  THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH,
  THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS,
  THREADLINE_SHIPPED_RESERVE_DAYS,
  THREADLINE_SHIPPED_START_DATE_KEY,
  THREADLINE_SHIPPED_TOTAL_PUZZLES,
  THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS,
  THREADLINE_SHIPPED_WORDS_PER_DAY,
  THREADLINE_WORDS_BY_DOMAIN_THREAD,
  getThreadlineOutOfWindowFallback,
  getThreadlineRollingAverageLengths as getShippedRollingAverageLengths,
  getThreadlineShippedRootFamilyWarnings,
} from './threadlineShippedPack';
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
import {
  THREADLINE_COPY_SCORE_THRESHOLDS,
  auditThreadlineCopy,
  formatThreadlineCopyAuditIssues,
  inspectThreadlineTitlePayoffReuse,
  renderThreadlineCompletedLead,
  summarizeThreadlineDifficultyBands,
} from './threadlineCopyAudit';

const THREADLINE_COPY_AUDIT_OPTIONS = {
  titleReuseCooldownDays: 180,
  payoffReuseCooldownDays: 180,
  scoreThresholds: THREADLINE_COPY_SCORE_THRESHOLDS,
};

function getShippedThreadlineCopyAudit() {
  return auditThreadlineCopy({
    puzzles: THREADLINE_PUZZLE_BANK,
    datedSchedule: THREADLINE_DATED_SCHEDULE,
    puzzleById: THREADLINE_PUZZLE_BY_ID,
    editorReview: THREADLINE_EDITOR_REVIEW,
    ...THREADLINE_COPY_AUDIT_OPTIONS,
  });
}

describe('threadline puzzles', () => {
  it('ships every approved puzzle in the dated Threadline schedule', () => {
    expect(THREADLINE_PUZZLE_BANK).toHaveLength(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(THREADLINE_DATED_SCHEDULE).toHaveLength(THREADLINE_SHIPPED_DATED_DAYS);
    expect(THREADLINE_RESERVES).toHaveLength(THREADLINE_SHIPPED_RESERVE_DAYS);

    const dateKeys = new Set(THREADLINE_DATED_SCHEDULE.map((entry) => entry.dateKey));
    const puzzleIds = new Set(THREADLINE_PUZZLE_BANK.map((puzzle) => puzzle.id));
    const scheduledPuzzleIds = new Set(THREADLINE_DATED_SCHEDULE.map((entry) => entry.puzzleId));

    expect(dateKeys.size).toBe(THREADLINE_SHIPPED_DATED_DAYS);
    expect(puzzleIds.size).toBe(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(scheduledPuzzleIds).toEqual(puzzleIds);
    expect(THREADLINE_SHIPPED_TOTAL_PUZZLES).toBe(THREADLINE_SHIPPED_DATED_DAYS);
    expect(THREADLINE_DATED_SCHEDULE[0].dateKey).toBe(THREADLINE_SHIPPED_START_DATE_KEY);
    expect(THREADLINE_DATED_SCHEDULE.at(-1)?.dateKey).toBe(THREADLINE_SHIPPED_END_DATE_KEY);
    expect(THREADLINE_SHIPPED_RESERVE_DAYS).toBe(0);

    const startDate = new Date(`${THREADLINE_SHIPPED_START_DATE_KEY}T12:00:00`);
    THREADLINE_DATED_SCHEDULE.forEach((entry, index) => {
      const expectedDate = new Date(startDate);
      expectedDate.setDate(startDate.getDate() + index);
      const month = String(expectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(expectedDate.getDate()).padStart(2, '0');
      expect(entry.dateKey).toBe(`${expectedDate.getFullYear()}-${month}-${day}`);
      expect(THREADLINE_PUZZLE_BY_ID[entry.puzzleId]).toBeTruthy();
    });
  });

  it('resolves shipped dates through the dated schedule instead of the old rotation', () => {
    const firstScheduled = THREADLINE_DATED_SCHEDULE[0];
    const fourthScheduled = THREADLINE_DATED_SCHEDULE[3];
    const firstPuzzle = getDailyThreadline(new Date(`${firstScheduled.dateKey}T12:00:00`));
    const fourthPuzzle = getDailyThreadline(new Date(`${fourthScheduled.dateKey}T12:00:00`));

    expect(firstPuzzle.id).toBe(firstScheduled.puzzleId);
    expect(fourthPuzzle.id).toBe(fourthScheduled.puzzleId);
    expect(firstPuzzle.id).not.toBe(fourthPuzzle.id);
    expect(THREADLINE_DATED_PUZZLE_BY_DATE[firstScheduled.dateKey]).toBe(firstScheduled.puzzleId);
  });

  it('distributes out-of-window fallback across the dated bank', () => {
    const scheduledPuzzleIds = new Set(THREADLINE_DATED_SCHEDULE.map((entry) => entry.puzzleId));
    const seenPuzzleIds = new Set<string>();

    for (let offset = 1; offset <= 140; offset += 1) {
      const date = new Date(`${THREADLINE_SHIPPED_END_DATE_KEY}T12:00:00`);
      date.setDate(date.getDate() + offset);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const fallback = getThreadlineOutOfWindowFallback(`${date.getFullYear()}-${month}-${day}`);
      expect(scheduledPuzzleIds.has(fallback.id)).toBe(true);
      seenPuzzleIds.add(fallback.id);
    }

    expect(seenPuzzleIds.size).toBeGreaterThanOrEqual(90);
  });

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

  it('keeps the shipped pack inside production editorial gates', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(validateThreadlinePuzzle(puzzle)).toEqual([]);
      expect(puzzle.words).toHaveLength(THREADLINE_SHIPPED_WORDS_PER_DAY);
      expect(puzzle.words.every((word) => word.answer.length >= 4)).toBe(true);
      expect(puzzle.words.filter((word) => word.answer.length >= 6).length).toBeGreaterThanOrEqual(3);
      expect(puzzle.note).not.toMatch(/deterministic candidates|editor-player|review/i);
      puzzle.threads.forEach((thread) => {
        expect(puzzle.words.filter((word) => word.threadId === thread.id)).toHaveLength(3);
      });
      const blankIds = puzzle.lead
        .filter((segment) => segment.type === 'blank')
        .map((segment) => segment.wordId);
      expect(new Set(blankIds)).toEqual(new Set(puzzle.words.map((word) => word.id)));
    });
  });

  it('keeps shipped answers inside their declared thread word pools', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const review = THREADLINE_EDITOR_REVIEW[puzzle.id];
      const domain = review.tags.at(-2) ?? '';
      puzzle.words.forEach((word) => {
        const thread = puzzle.threads.find((candidate) => candidate.id === word.threadId);
        const allowedWords = thread ? THREADLINE_WORDS_BY_DOMAIN_THREAD[domain]?.[thread.name] : undefined;

        expect(allowedWords).toBeTruthy();
        expect(allowedWords).toContain(word.answer);
        expect(word.hint).not.toBe(thread?.clue);
        expect(word.hint).not.toMatch(/^A motion around /);
      });
    });
  });

  it('keeps shipped lead skeletons varied across the calendar', () => {
    const skeletonCounts = new Map<string, number>();

    THREADLINE_DATED_SCHEDULE.forEach((entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      const skeleton = puzzle.lead
        .map((segment) => (segment.type === 'text' ? segment.text.replace(puzzle.title, '{title}') : '{blank}'))
        .join('');
      skeletonCounts.set(skeleton, (skeletonCounts.get(skeleton) ?? 0) + 1);
    });

    expect(skeletonCounts.size).toBeGreaterThanOrEqual(8);
    expect(Math.max(...skeletonCounts.values())).toBeLessThanOrEqual(55);
  });

  it('renders completed shipped leads through the reusable copy audit helper', () => {
    const bannedLeadCopy = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first)\b/i;

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const completedLead = renderThreadlineCompletedLead(puzzle);

      expect(completedLead).not.toContain('[missing:');
      expect(completedLead).not.toMatch(bannedLeadCopy);
      expect(completedLead.length).toBeGreaterThan(puzzle.title.length);
      puzzle.words.forEach((word) => {
        expect(completedLead).toContain(word.answer.toLowerCase());
      });
    });
  });

  it('keeps puzzle titles from giving away answers or themes', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const titleTokens = new Set(
        puzzle.title
          .toUpperCase()
          .replace(/[^A-Z\s]/g, ' ')
          .split(/\s+/)
          .filter((token) => token.length > 2)
      );
      const answerTokens = new Set(puzzle.words.map((word) => word.answer));
      const threadTokens = new Set(
        puzzle.threads
          .flatMap((thread) => `${thread.name} ${thread.clue}`.toUpperCase().split(/[^A-Z]+/))
          .filter((token) => token.length > 2)
      );

      titleTokens.forEach((token) => {
        expect(answerTokens.has(token)).toBe(false);
        expect(threadTokens.has(token)).toBe(false);
      });
      expect(puzzle.title).not.toContain(':');
      expect(puzzle.title).not.toContain('&');
    });
  });

  it('keeps weave copy exceptional and free of puzzle-meta scaffolding', () => {
    const bannedWeaveCopy = /\b(theme|clue|hidden turn|line land|same thread|final line)\b/i;

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(puzzle.weave).not.toMatch(bannedWeaveCopy);
      expect(puzzle.weave).toMatch(/[.!?]$/);
      expect(puzzle.weave.length).toBeGreaterThanOrEqual(44);
    });
  });

  it('dates the 200 new variety puzzles without adding them to old theme families', () => {
    const expansionEntries = THREADLINE_DATED_SCHEDULE.slice(
      THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS,
      THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS + THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS
    );
    const expansionFamilies = new Set(
      expansionEntries.map((entry) => THREADLINE_EDITOR_REVIEW[entry.puzzleId].tags.at(-2))
    );

    expect(expansionEntries).toHaveLength(THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS);
    expect(expansionFamilies.size).toBe(20);
    expansionEntries.forEach((entry) => {
      const review = THREADLINE_EDITOR_REVIEW[entry.puzzleId];

      expect(review.dateKey).toBe(entry.dateKey);
      expect(review.tags).toContain('variety-expansion');
    });
    expect(THREADLINE_DATED_SCHEDULE.slice(-THREADLINE_SHIPPED_FORMER_RESERVE_DAYS)).toHaveLength(
      THREADLINE_SHIPPED_FORMER_RESERVE_DAYS
    );
  });

  it('keeps shipped copy audit free of critical title, lead, payoff, and review issues', () => {
    const audit = getShippedThreadlineCopyAudit();

    expect(formatThreadlineCopyAuditIssues(audit.criticalIssues)).toEqual([]);
  });

  it('does not ship generic suffix titles or close title/payoff repeats', () => {
    const titlePayoff = inspectThreadlineTitlePayoffReuse(
      THREADLINE_PUZZLE_BANK,
      THREADLINE_DATED_SCHEDULE,
      THREADLINE_PUZZLE_BY_ID,
      THREADLINE_COPY_AUDIT_OPTIONS
    );
    const reuseIssues = [
      ...titlePayoff.genericSuffixTitles,
      ...titlePayoff.titleCooldownIssues,
      ...titlePayoff.payoffCooldownIssues,
    ];

    expect(formatThreadlineCopyAuditIssues(reuseIssues)).toEqual([]);
  });

  it('keeps scheduled payoff copy above the uniqueness target', () => {
    const scheduledPayoffs = THREADLINE_DATED_SCHEDULE.map(
      (entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId].weave
    );
    const uniquePayoffRatio = new Set(scheduledPayoffs).size / scheduledPayoffs.length;

    expect(uniquePayoffRatio).toBeGreaterThanOrEqual(0.95);
  });

  it('keeps shipped difficulty bands separated by the audit index', () => {
    const bands = summarizeThreadlineDifficultyBands(THREADLINE_PUZZLE_BANK);
    const byDifficulty = Object.fromEntries(
      bands.map((band) => [band.difficulty, band])
    );

    expect(byDifficulty.Easy.count).toBeGreaterThan(0);
    expect(byDifficulty.Medium.count).toBeGreaterThan(0);
    expect(byDifficulty.Hard.count).toBeGreaterThan(0);
    expect(byDifficulty.Medium.averageIndex - byDifficulty.Easy.averageIndex).toBeGreaterThanOrEqual(0.15);
    expect(byDifficulty.Hard.averageIndex - byDifficulty.Medium.averageIndex).toBeGreaterThanOrEqual(0.25);
  });

  it('keeps objective shipped difficulty integrity from relying on awkward copy', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const lengths = puzzle.words.map((word) => word.answer.length);
      const longCount = lengths.filter((length) => length >= 6).length;
      const veryLongCount = lengths.filter((length) => length >= 7).length;

      expect(longCount).toBeGreaterThanOrEqual(3);
      if (puzzle.difficulty === 'Hard') {
        expect(longCount).toBeGreaterThanOrEqual(4);
        expect(veryLongCount).toBeGreaterThanOrEqual(2);
      }
    });
  });

  it('enforces shipped review score dimensions when the generator provides them', () => {
    const audit = getShippedThreadlineCopyAudit();
    const presentDimensions = audit.scoreDimensions.filter((dimension) => dimension.present > 0);

    expect(presentDimensions.length).toBeGreaterThan(0);
    presentDimensions.forEach((dimension) => {
      expect(dimension.present).toBe(THREADLINE_PUZZLE_BANK.length);
      expect(dimension.belowThreshold).toBe(0);
      expect(dimension.min).toBeGreaterThanOrEqual(dimension.minimum);
    });
  });

  it('keeps shipped score integrity varied and explained', () => {
    const reviews = Object.values(THREADLINE_EDITOR_REVIEW);
    const overallScores = new Set(reviews.map((review) => review.overallEditorialScore.toFixed(2)));
    const playerScores = new Set(reviews.map((review) => review.playerAverageScore.toFixed(2)));
    const weakest = reviews
      .slice()
      .sort((a, b) => a.overallEditorialScore + a.playerAverageScore - (b.overallEditorialScore + b.playerAverageScore))
      .slice(0, 20);

    expect(overallScores.size).toBeGreaterThan(10);
    expect(playerScores.size).toBeGreaterThan(10);
    weakest.forEach((review) => {
      expect(review.editorNote).toMatch(/grammar|title|final-line|copy review/i);
      expect(review.freshnessNote).toMatch(/length profile \d(?:-\d)+; difficulty index \d\.\d{2}/);
    });
  });

  it('keeps shipped scheduled answers outside the exact cooldown window', () => {
    const lastSeen = new Map<string, number>();

    THREADLINE_DATED_SCHEDULE.forEach((entry, dayIndex) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      puzzle.words.forEach((word) => {
        const previous = lastSeen.get(word.answer);
        if (previous !== undefined) {
          expect(dayIndex - previous).toBeGreaterThan(THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS);
        }
        lastSeen.set(word.answer, dayIndex);
      });
    });
  });

  it('keeps shipped rolling answer length in the longer-word target band', () => {
    const rollingAverages = getShippedRollingAverageLengths();

    expect(rollingAverages.length).toBeGreaterThan(0);
    rollingAverages.forEach((window) => {
      expect(window.averageLength).toBeGreaterThanOrEqual(THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH);
      expect(window.averageLength).toBeLessThanOrEqual(THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH);
    });
  });

  it('ships only editor/player-agent approved puzzles', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const review = THREADLINE_EDITOR_REVIEW[puzzle.id];

      expect(review).toBeTruthy();
      expect(review.approvalStatus).toBe('approved');
      expect(review.overallEditorialScore).toBeGreaterThanOrEqual(4.4);
      expect(review.playerAverageScore).toBeGreaterThanOrEqual(4.3);
      expect(review.minCoreScore).toBeGreaterThanOrEqual(3.5);
      expect(review.confusionRisk).toBeLessThanOrEqual(2);
      expect(review.wouldPlayAgainCount).toBeGreaterThanOrEqual(4);
      expect(review.finalLinePayoffScore).toBeGreaterThanOrEqual(4.4);
      expect(review.safetyFlags).toEqual([]);
    });
  });

  it('places holiday nods near but not on the exact holiday dates', () => {
    expect(THREADLINE_HOLIDAY_NODS.length).toBeGreaterThan(0);
    THREADLINE_HOLIDAY_NODS.forEach((nod) => {
      expect(nod.dateKey).not.toBe(nod.holidayDateKey);
      expect(THREADLINE_DATED_PUZZLE_BY_DATE[nod.dateKey]).toBe(nod.puzzleId);

      const date = new Date(`${nod.dateKey}T12:00:00`);
      const holiday = new Date(`${nod.holidayDateKey}T12:00:00`);
      const distance = Math.round(Math.abs(date.getTime() - holiday.getTime()) / 86_400_000);
      expect(distance).toBeLessThanOrEqual(nod.windowDays);
    });
  });

  it('reports root-family repeats for editor awareness without blocking approved shipped data', () => {
    const warnings = getThreadlineShippedRootFamilyWarnings();

    expect(Array.isArray(warnings)).toBe(true);
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(THREADLINE_EDITOR_REVIEW[puzzle.id]?.approvalStatus).toBe('approved');
    });
  });
});
