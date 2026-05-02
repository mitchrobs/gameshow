import { describe, expect, it } from "vitest";
import { getSolvedLineCategory, hasAnySolvedLine } from "./straddlePrototype";
import {
  STRADDLE_HOLIDAYS,
  STRADDLE_SCHEDULE,
  STRADDLE_SCHEDULE_DAYS,
  STRADDLE_SCHEDULE_START_DATE,
  STRADDLE_SCHEDULE_VERSION,
  STRADDLE_MAX_WORD_REUSE_TARGET,
  createStraddlePuzzleDefinitionFromScheduledPuzzle,
  getStraddlePackPuzzleForDate,
  getStraddlePuzzleForDate,
  getStraddleScheduleEditorialAudit,
} from "./straddleSchedule";

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe("Straddle V1 schedule", () => {
  it("builds a continuous 365-day V1 schedule", () => {
    expect(STRADDLE_SCHEDULE_VERSION).toBe("v1");
    expect(STRADDLE_SCHEDULE).toHaveLength(STRADDLE_SCHEDULE_DAYS);
    expect(STRADDLE_SCHEDULE).toHaveLength(365);

    STRADDLE_SCHEDULE.forEach((puzzle, dayIndex) => {
      expect(puzzle.date).toBe(
        addUtcDays(STRADDLE_SCHEDULE_START_DATE, dayIndex),
      );
      expect(puzzle.dayIndex).toBe(dayIndex);
    });
  });

  it("keeps every scheduled grid rectangular and non-spoiling", () => {
    STRADDLE_SCHEDULE.forEach((puzzle) => {
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
    });
  });

  it("keeps the 365 boards unique by word set", () => {
    const signatures = STRADDLE_SCHEDULE.map((puzzle) =>
      [...puzzle.grid.flat()].sort().join("|"),
    );

    expect(new Set(signatures).size).toBe(signatures.length);
  });

  it("includes one holiday row or column on each holiday override", () => {
    expect(STRADDLE_HOLIDAYS.length).toBeGreaterThan(10);

    STRADDLE_HOLIDAYS.forEach((holiday) => {
      const puzzle = getStraddlePuzzleForDate(holiday.date);
      expect(puzzle?.holiday?.name).toBe(holiday.name);
      expect(puzzle?.holiday?.axis).toBe("row");
      expect(puzzle?.holiday).toBeDefined();
      expect(puzzle?.rows[puzzle.holiday?.index ?? -1]?.label).toBe(
        holiday.name,
      );
    });
  });

  it("sets HOPE as the November 3 pillar word", () => {
    const puzzle = getStraddlePuzzleForDate("2026-11-03");

    expect(puzzle?.pillarWord).toBe("HOPE");
    expect(puzzle?.centerWord).toBe("HOPE");
    expect(puzzle?.grid[1][1]).toBe("HOPE");
  });

  it("adapts the May 15 pack opener into playable Straddle puzzle data", () => {
    const scheduledPuzzle = getStraddlePuzzleForDate("2026-05-15");
    expect(scheduledPuzzle).toBeDefined();

    const puzzle = createStraddlePuzzleDefinitionFromScheduledPuzzle(
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
    expect(getStraddlePackPuzzleForDate("2026-05-14")).toBeNull();
    expect(getStraddlePackPuzzleForDate("2026-05-15")?.date).toBe("2026-05-15");
  });

  it("tracks V1 editorial health: reuse, difficulty, lanes, and satisfaction", () => {
    const audit = getStraddleScheduleEditorialAudit();

    expect(audit.wordReuse.maxUse).toBeLessThanOrEqual(
      STRADDLE_MAX_WORD_REUSE_TARGET,
    );
    expect(audit.wordReuse.uniqueWords).toBeGreaterThanOrEqual(300);
    expect(audit.wordReuse.underSoftCooldownCount).toBeLessThan(450);

    expect(audit.difficultyCounts.easy).toBeGreaterThanOrEqual(90);
    expect(audit.difficultyCounts.medium).toBeGreaterThanOrEqual(130);
    expect(audit.difficultyCounts.hard).toBeGreaterThanOrEqual(80);

    expect(audit.laneCounts["word-form"]).toBeLessThanOrEqual(225);
    expect(
      audit.laneCounts.modern +
        audit.laneCounts.phrase +
        audit.laneCounts.hybrid,
    ).toBeGreaterThanOrEqual(140);

    expect(audit.satisfaction.averageScore).toBeGreaterThanOrEqual(78);
    expect(audit.satisfaction.minimumScore).toBeGreaterThanOrEqual(75);
  });
});
