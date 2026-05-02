import { describe, expect, it } from "vitest";
import { getSolvedLineCategory, hasAnySolvedLine } from "./subsetPrototype";
import {
  SUBSET_HOLIDAYS,
  SUBSET_SCHEDULE,
  SUBSET_SCHEDULE_DAYS,
  SUBSET_SCHEDULE_START_DATE,
  SUBSET_SCHEDULE_VERSION,
  SUBSET_MAX_WORD_REUSE_TARGET,
  createSubsetPuzzleDefinitionFromScheduledPuzzle,
  getSubsetPackPuzzleForDate,
  getSubsetPuzzleForDate,
  getSubsetScheduleEditorialAudit,
} from "./subsetSchedule";

const LABEL_HARD_MAX_LENGTH = 20;
const LABEL_SOFT_MAX_LENGTH = 16;
const LABEL_LENGTH_ALLOWLIST = new Set(["St. Patrick's Day"]);
const LABEL_REUSE_CAP = 36;
const CENTER_REUSE_COOLDOWN_DAYS = 60;

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe("Subset V1 schedule", () => {
  it("builds a continuous 365-day V1 schedule", () => {
    expect(SUBSET_SCHEDULE_VERSION).toBe("v1");
    expect(SUBSET_SCHEDULE).toHaveLength(SUBSET_SCHEDULE_DAYS);
    expect(SUBSET_SCHEDULE).toHaveLength(365);

    SUBSET_SCHEDULE.forEach((puzzle, dayIndex) => {
      expect(puzzle.date).toBe(
        addUtcDays(SUBSET_SCHEDULE_START_DATE, dayIndex),
      );
      expect(puzzle.dayIndex).toBe(dayIndex);
    });
  });

  it("keeps every scheduled grid rectangular and non-spoiling", () => {
    SUBSET_SCHEDULE.forEach((puzzle) => {
      expect(puzzle.grid).toHaveLength(3);
      expect(puzzle.rows).toHaveLength(3);
      expect(puzzle.columns).toHaveLength(3);

      const words = puzzle.grid.flat();
      expect(words).toHaveLength(9);
      expect(new Set(words)).toHaveLength(9);
      expect(words.every((word) => word === word.toUpperCase())).toBe(true);
      expect(puzzle.centerWord).toBe(puzzle.grid[1][1]);

      puzzle.rows.forEach((row, rowIndex) => {
        expect(row.words).toEqual(puzzle.grid[rowIndex]);
      });

      puzzle.columns.forEach((column, columnIndex) => {
        expect(column.words).toEqual(
          puzzle.grid.map((row) => row[columnIndex]),
        );
      });

      const playablePuzzle =
        createSubsetPuzzleDefinitionFromScheduledPuzzle(puzzle);
      expect(
        hasAnySolvedLine(playablePuzzle.fallbackUnsolvedBoard, playablePuzzle),
      ).toBe(false);
    });
  });

  it("keeps the 365 boards unique by word set", () => {
    const signatures = SUBSET_SCHEDULE.map((puzzle) =>
      [...puzzle.grid.flat()].sort().join("|"),
    );

    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("includes one holiday row or column on each holiday override", () => {
    expect(SUBSET_HOLIDAYS.length).toBeGreaterThan(10);

    SUBSET_HOLIDAYS.forEach((holiday) => {
      const puzzle = getSubsetPuzzleForDate(holiday.date);
      expect(puzzle?.holiday?.name).toBe(holiday.name);
      expect(puzzle?.holiday?.axis).toBe("row");
      expect(puzzle?.holiday).toBeDefined();
      expect(puzzle?.rows[puzzle.holiday?.index ?? -1]?.label).toBe(
        holiday.name,
      );
    });
  });

  it("sets HOPE as the November 3 pillar word", () => {
    const puzzle = getSubsetPuzzleForDate("2026-11-03");

    expect(puzzle?.pillarWord).toBe("HOPE");
    expect(puzzle?.centerWord).toBe("HOPE");
    expect(puzzle?.grid[1][1]).toBe("HOPE");
  });

  it("adapts the May 15 pack opener into playable Subset puzzle data", () => {
    const scheduledPuzzle = getSubsetPuzzleForDate("2026-05-15");
    expect(scheduledPuzzle).toBeDefined();

    const puzzle = createSubsetPuzzleDefinitionFromScheduledPuzzle(
      scheduledPuzzle!,
    );
    expect(puzzle.fixedCell.index).toBe(4);
    expect(puzzle.fixedCell.tileId).toBe(puzzle.solutionBoard[4]);
    expect(puzzle.fallbackUnsolvedBoard[puzzle.fixedCell.index]).toBe(
      puzzle.fixedCell.tileId,
    );
    expect(hasAnySolvedLine(puzzle.fallbackUnsolvedBoard, puzzle)).toBe(false);

    for (let index = 0; index < 3; index += 1) {
      expect(
        getSolvedLineCategory(puzzle.solutionBoard, "row", index, puzzle)
          ?.label,
      ).toBe(scheduledPuzzle!.rows[index].label);
      expect(
        getSolvedLineCategory(puzzle.solutionBoard, "column", index, puzzle)
          ?.label,
      ).toBe(scheduledPuzzle!.columns[index].label);
    }
  });

  it("keeps the demo active before the May 15 pack opener", () => {
    expect(getSubsetPackPuzzleForDate("2026-05-14")).toBeNull();
    expect(getSubsetPackPuzzleForDate("2026-05-15")?.date).toBe("2026-05-15");
  });

  it("tracks V1 editorial health: reuse, difficulty, lanes, and satisfaction", () => {
    const audit = getSubsetScheduleEditorialAudit();

    expect(audit.wordReuse.maxUse).toBeLessThanOrEqual(
      SUBSET_MAX_WORD_REUSE_TARGET,
    );
    expect(audit.wordReuse.uniqueWords).toBeGreaterThanOrEqual(450);
    expect(audit.wordReuse.underSoftCooldownCount).toBeLessThan(260);

    expect(audit.difficultyCounts.easy).toBeGreaterThanOrEqual(90);
    expect(audit.difficultyCounts.medium).toBeGreaterThanOrEqual(130);
    expect(audit.difficultyCounts.hard).toBeGreaterThanOrEqual(80);

    expect(audit.laneCounts.concrete).toBeGreaterThanOrEqual(200);
    expect(audit.laneCounts.concrete).toBeLessThanOrEqual(240);
    expect(audit.laneCounts["word-form"]).toBeGreaterThanOrEqual(35);
    expect(audit.laneCounts["word-form"]).toBeLessThanOrEqual(55);
    expect(
      audit.laneCounts.modern +
        audit.laneCounts.phrase +
        audit.laneCounts.hybrid,
    ).toBeGreaterThanOrEqual(95);

    expect(audit.satisfaction.averageScore).toBeGreaterThanOrEqual(84);
    expect(audit.satisfaction.minimumScore).toBeGreaterThanOrEqual(78);
  });

  it("keeps category labels short, legible, and not overused", () => {
    const labelCounts = new Map<string, number>();

    SUBSET_SCHEDULE.forEach((puzzle) => {
      [...puzzle.rows, ...puzzle.columns].forEach(({ label }) => {
        labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
        expect(label.length).toBeLessThanOrEqual(LABEL_HARD_MAX_LENGTH);
        if (!LABEL_LENGTH_ALLOWLIST.has(label)) {
          expect(label.length).toBeLessThanOrEqual(LABEL_SOFT_MAX_LENGTH);
        }
        expect(label.trim().split(/\s+/).length).toBeLessThanOrEqual(3);
        expect(
          Math.max(...label.split(/\s+/).map((word) => word.length)),
        ).toBeLessThanOrEqual(13);
      });
    });

    expect(Math.max(...labelCounts.values())).toBeLessThanOrEqual(
      LABEL_REUSE_CAP,
    );
  });

  it("spreads memorable center words across the year", () => {
    const centerCounts = new Map<string, number>();
    const centerLastSeen = new Map<string, number>();

    SUBSET_SCHEDULE.forEach((puzzle) => {
      centerCounts.set(
        puzzle.centerWord,
        (centerCounts.get(puzzle.centerWord) ?? 0) + 1,
      );
      const lastSeen = centerLastSeen.get(puzzle.centerWord);
      if (lastSeen !== undefined) {
        expect(puzzle.dayIndex - lastSeen).toBeGreaterThanOrEqual(
          CENTER_REUSE_COOLDOWN_DAYS,
        );
      }
      centerLastSeen.set(puzzle.centerWord, puzzle.dayIndex);
    });

    expect(Math.max(...centerCounts.values())).toBeLessThanOrEqual(5);
  });

  it("does not run formal word-format puzzles back to back", () => {
    for (let index = 1; index < SUBSET_SCHEDULE.length; index += 1) {
      expect(
        SUBSET_SCHEDULE[index - 1].editorialLane === "word-form" &&
          SUBSET_SCHEDULE[index].editorialLane === "word-form",
      ).toBe(false);
    }
  });
});
