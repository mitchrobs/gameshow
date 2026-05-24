import { describe, expect, it } from "vitest";
import { getSolvedLineCategory, hasAnySolvedLine } from "./subsetPrototype";
import {
  SUBSET_ALL_PACK_DAYS,
  SUBSET_ALL_PACK_PUZZLES,
  SUBSET_HOLIDAYS,
  SUBSET_LIVE_PUZZLES,
  SUBSET_SCHEDULE,
  SUBSET_SCHEDULE_DAYS,
  SUBSET_SCHEDULE_START_DATE,
  SUBSET_SCHEDULE_VERSION,
  SUBSET_MAX_WORD_REUSE_TARGET,
  SUBSET_RESERVE_DAYS,
  SUBSET_RESERVE_PUZZLES,
  createSubsetPuzzleDefinitionFromScheduledPuzzle,
  getSubsetPackPuzzleForDate,
  getSubsetPuzzleForDate,
  getSubsetScheduleEditorialAudit,
  type SubsetScheduledPuzzle,
} from "./subsetSchedule";
import {
  buildSubsetPackAuditReport,
  checkSubsetPackEditorialStandards,
  findStaleSubsetBuildStrings,
  getRawSubsetMechanicPuzzles,
  recognizabilityRiskForPuzzle,
  sameStructureRiskForPuzzle,
} from "../../scripts/audit_subset_pack";

const LABEL_HARD_MAX_LENGTH = 20;
const LABEL_SOFT_MAX_LENGTH = 16;
const LABEL_LENGTH_ALLOWLIST = new Set(["St. Patrick's Day"]);
const LABEL_REUSE_CAP = 22;
const GENERIC_LABEL_REUSE_CAP = 22;
const CENTER_REUSE_COOLDOWN_DAYS = 60;
const LATERAL_THEME_MIN_DAYS = 65;
const LATERAL_THEME_MAX_DAYS = 85;
const MECHANICAL_WORD_FORM_DAY_CAP = 25;
const MINIMUM_SATISFACTION_SCORE = 90;
const AVERAGE_SATISFACTION_SCORE = 95;
const THEME_FEEL_AVERAGE_SCORE = 95;

const GENERIC_SUBSET_LABELS = new Set([
  "Actions",
  "Animals",
  "Clothes",
  "Food",
  "Foods",
  "Kitchen",
  "Motion",
  "Music",
  "Objects",
  "Office",
  "School",
  "Sounds",
  "Sports",
  "Storage",
  "Theater",
  "Wedding",
  "Work",
]);

const CIVIC_SUBSET_DATES = [
  "2026-05-25",
  "2026-06-19",
  "2026-07-04",
  "2026-09-07",
  "2026-11-11",
  "2027-01-18",
  "2027-02-15",
];

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function withRawStartsWithColumns(
  puzzle: SubsetScheduledPuzzle,
): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Raw starts-with regression fixture",
    editorialLane: "word-form",
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["Starts with B", "Starts with C", "Starts with S"][columnIndex],
    })),
  };
}

function withStackedPhraseColumns(
  puzzle: SubsetScheduledPuzzle,
): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Stacked phrase-template regression fixture",
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["After Blue", "After Silver", "After Green"][columnIndex],
    })),
  };
}

function withPairColumns(puzzle: SubsetScheduledPuzzle): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Same-structure pair regression fixture",
    themeTypes: ["wordplay", "interaction"],
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["Blue Pair", "Silver Pair", "Green Pair"][columnIndex],
    })),
  };
}

function withCompoundEndingColumns(
  puzzle: SubsetScheduledPuzzle,
): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Same-structure compound regression fixture",
    themeTypes: ["wordplay", "interaction"],
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["Board Pair", "Room Pair", "Stone Pair"][columnIndex],
    })),
  };
}

function withCanBeColumns(puzzle: SubsetScheduledPuzzle): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Same-structure can-be regression fixture",
    themeTypes: ["phrase", "interaction"],
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["Can Be Cut", "Can Be Folded", "Can Be Stacked"][columnIndex],
    })),
  };
}

function withPropsResetColumn(
  puzzle: SubsetScheduledPuzzle,
): SubsetScheduledPuzzle {
  const grid = puzzle.grid.map((row) => [...row]);
  grid[2][2] = "RESET";
  return {
    ...puzzle,
    theme: "Props reset regression fixture",
    grid,
    rows: puzzle.rows.map((row, rowIndex) => ({
      ...row,
      words: grid[rowIndex],
    })),
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: columnIndex === 2 ? "Props" : column.label,
      words: grid.map((row) => row[columnIndex]),
    })),
  };
}

function withConcreteRepairColumns(
  puzzle: SubsetScheduledPuzzle,
): SubsetScheduledPuzzle {
  return {
    ...puzzle,
    theme: "Concrete repair regression fixture",
    themeTypes: ["place-context", "interaction"],
    columns: puzzle.columns.map((column, columnIndex) => ({
      ...column,
      label: ["Watch Repair", "Bike Repair", "Shoe Repair"][columnIndex],
    })),
  };
}

describe("Subset authored pack", () => {
  it("builds a continuous 365-day live schedule plus 35 reserves", () => {
    expect(SUBSET_SCHEDULE_VERSION).toBe("v2-authored");
    expect(SUBSET_SCHEDULE).toHaveLength(SUBSET_SCHEDULE_DAYS);
    expect(SUBSET_LIVE_PUZZLES).toHaveLength(SUBSET_SCHEDULE_DAYS);
    expect(SUBSET_RESERVE_PUZZLES).toHaveLength(SUBSET_RESERVE_DAYS);
    expect(SUBSET_ALL_PACK_PUZZLES).toHaveLength(SUBSET_ALL_PACK_DAYS);
    expect(SUBSET_SCHEDULE).toHaveLength(365);
    expect(SUBSET_RESERVE_PUZZLES).toHaveLength(35);
    expect(SUBSET_ALL_PACK_PUZZLES).toHaveLength(400);

    SUBSET_SCHEDULE.forEach((puzzle, dayIndex) => {
      expect(puzzle.packRole).toBe("live");
      expect(puzzle.date).toBe(
        addUtcDays(SUBSET_SCHEDULE_START_DATE, dayIndex),
      );
      expect(puzzle.dayIndex).toBe(dayIndex);
      expect(puzzle.themeGroupId).toBeTruthy();
    });

    SUBSET_RESERVE_PUZZLES.forEach((puzzle, index) => {
      expect(puzzle.packRole).toBe("reserve");
      expect(puzzle.reserveId).toBe(
        `reserve-${String(index + 1).padStart(3, "0")}`,
      );
      expect("date" in puzzle).toBe(false);
      expect("dayIndex" in puzzle).toBe(false);
    });
  });

  it("keeps every authored grid rectangular and non-spoiling", () => {
    SUBSET_ALL_PACK_PUZZLES.forEach((puzzle) => {
      expect(puzzle.grid).toHaveLength(3);
      expect(puzzle.rows).toHaveLength(3);
      expect(puzzle.columns).toHaveLength(3);
      expect(puzzle.themeTypes.length).toBeGreaterThan(0);
      expect(puzzle.themeGroupId).toBeTruthy();

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

  it("keeps all 400 boards unique by word set", () => {
    const signatures = SUBSET_ALL_PACK_PUZZLES.map((puzzle) =>
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
    expect(puzzle?.theme).toContain("Birthday");
    expect(puzzle?.theme).not.toMatch(/Election/i);
    expect(puzzle?.rows[1]?.label).toBe("Birthday");
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

  it("tracks authored pack editorial health: reuse, lanes, lateral themes, and satisfaction", () => {
    const liveAudit = getSubsetScheduleEditorialAudit(SUBSET_LIVE_PUZZLES);
    const allAudit = getSubsetScheduleEditorialAudit(SUBSET_ALL_PACK_PUZZLES);

    expect(allAudit.wordReuse.maxUse).toBeLessThanOrEqual(
      SUBSET_MAX_WORD_REUSE_TARGET,
    );
    expect(allAudit.wordReuse.uniqueWords).toBeGreaterThanOrEqual(700);

    expect(liveAudit.difficultyCounts.easy).toBeGreaterThanOrEqual(90);
    expect(liveAudit.difficultyCounts.medium).toBeGreaterThanOrEqual(130);
    expect(liveAudit.difficultyCounts.hard).toBeGreaterThanOrEqual(80);

    expect(liveAudit.laneCounts.concrete).toBeGreaterThanOrEqual(200);
    expect(liveAudit.laneCounts.concrete).toBeLessThanOrEqual(240);
    expect(liveAudit.laneCounts["word-form"]).toBeLessThan(
      MECHANICAL_WORD_FORM_DAY_CAP,
    );
    expect(liveAudit.lateralThemeCount).toBeGreaterThanOrEqual(
      LATERAL_THEME_MIN_DAYS,
    );
    expect(liveAudit.lateralThemeCount).toBeLessThanOrEqual(
      LATERAL_THEME_MAX_DAYS,
    );
    expect(
      liveAudit.laneCounts.modern +
        liveAudit.laneCounts.phrase +
        liveAudit.laneCounts.hybrid,
    ).toBeGreaterThanOrEqual(95);

    expect(liveAudit.satisfaction.averageScore).toBeGreaterThanOrEqual(
      AVERAGE_SATISFACTION_SCORE,
    );
    expect(allAudit.satisfaction.averageScore).toBeGreaterThanOrEqual(
      AVERAGE_SATISFACTION_SCORE,
    );
    expect(allAudit.satisfaction.minimumScore).toBeGreaterThanOrEqual(
      MINIMUM_SATISFACTION_SCORE,
    );
    expect(allAudit.themeFeel.averageScore).toBeGreaterThanOrEqual(
      THEME_FEEL_AVERAGE_SCORE,
    );
  });

  it("keeps category labels short, legible, and not overused", () => {
    const labelCounts = new Map<string, number>();
    const genericLabelCounts = new Map<string, number>();

    SUBSET_ALL_PACK_PUZZLES.forEach((puzzle) => {
      [...puzzle.rows, ...puzzle.columns].forEach(({ label }) => {
        labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
        if (GENERIC_SUBSET_LABELS.has(label)) {
          genericLabelCounts.set(
            label,
            (genericLabelCounts.get(label) ?? 0) + 1,
          );
        }
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
    genericLabelCounts.forEach((count) => {
      expect(count).toBeLessThanOrEqual(GENERIC_LABEL_REUSE_CAP);
    });
  });

  it("keeps civic and remembrance puzzles off stock filler rows", () => {
    CIVIC_SUBSET_DATES.forEach((date) => {
      const puzzle = getSubsetPuzzleForDate(date);
      expect(puzzle).toBeDefined();
      const labels = [...puzzle!.rows, ...puzzle!.columns].map(
        (category) => category.label,
      );
      expect(labels).not.toContain("Wedding");
      expect(labels).not.toContain("School");
    });
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

  it("keeps raw letter mechanics rare and off the May 20 concern date", () => {
    expect(getRawSubsetMechanicPuzzles(SUBSET_ALL_PACK_PUZZLES)).toHaveLength(
      0,
    );
    expect(getSubsetPuzzleForDate("2026-05-20")?.theme).toMatch(/Color cues/);

    const may20Regression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.date === "2026-05-20"
        ? withRawStartsWithColumns(puzzle)
        : puzzle,
    );
    const may20Violations = checkSubsetPackEditorialStandards({
      schedule: may20Regression,
      checkBuildOutput: false,
    });
    expect(
      may20Violations.some((violation) =>
        violation.includes("May 20 must not use raw Starts with labels"),
      ),
    ).toBe(true);
    expect(
      may20Violations.some((violation) =>
        violation.includes("raw mechanic in launch week"),
      ),
    ).toBe(true);

    const spacingRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 || puzzle.dayIndex === 20
        ? withRawStartsWithColumns(puzzle)
        : puzzle,
    );
    const spacingViolations = checkSubsetPackEditorialStandards({
      schedule: spacingRegression,
      checkBuildOutput: false,
    });
    expect(
      spacingViolations.some((violation) =>
        violation.includes("minimum is 21"),
      ),
    ).toBe(true);

    const phraseStackRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? withStackedPhraseColumns(puzzle) : puzzle,
    );
    const phraseStackViolations = checkSubsetPackEditorialStandards({
      schedule: phraseStackRegression,
      checkBuildOutput: false,
    });
    expect(
      phraseStackViolations.some((violation) =>
        violation.includes("phrase-template labels"),
      ),
    ).toBe(true);
  });

  it("re-examines every puzzle for same-structure and recognizability standards", () => {
    const report = buildSubsetPackAuditReport();

    expect(report.rows).toHaveLength(400);
    expect(report.summary.liveSameStructureFailureCount).toBe(0);
    expect(report.summary.liveRecognizabilityFailureCount).toBe(0);
    expect(report.summary.rewriteLiveCount).toBe(0);

    const reserveExperiment = report.rows.find(
      (row) => row.date === "reserve-012",
    );
    expect(reserveExperiment?.sameStructureRisk).not.toBe("none");
    expect(reserveExperiment?.editorialVerdict).toBe("reserve-tagged");
  });

  it("fails repeated category structures in live puzzles", () => {
    const pairRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? withPairColumns(puzzle) : puzzle,
    );
    const pairViolations = checkSubsetPackEditorialStandards({
      schedule: pairRegression,
      checkBuildOutput: false,
    });
    expect(
      pairViolations.some((violation) =>
        violation.includes("same category structure"),
      ),
    ).toBe(true);

    const compoundRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? withCompoundEndingColumns(puzzle) : puzzle,
    );
    const compoundViolations = checkSubsetPackEditorialStandards({
      schedule: compoundRegression,
      checkBuildOutput: false,
    });
    expect(
      compoundViolations.some((violation) =>
        violation.includes("same category structure"),
      ),
    ).toBe(true);

    const canBeRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? withCanBeColumns(puzzle) : puzzle,
    );
    const canBeViolations = checkSubsetPackEditorialStandards({
      schedule: canBeRegression,
      checkBuildOutput: false,
    });
    expect(
      canBeViolations.some((violation) =>
        violation.includes("same category structure"),
      ),
    ).toBe(true);
  });

  it("flags unclear cross-fits and repeated concrete label structures", () => {
    const propsResetPuzzle = withPropsResetColumn(SUBSET_SCHEDULE[10]);
    expect(recognizabilityRiskForPuzzle(propsResetPuzzle)).toContain("RESET");

    const propsResetRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? propsResetPuzzle : puzzle,
    );
    const propsResetViolations = checkSubsetPackEditorialStandards({
      schedule: propsResetRegression,
      checkBuildOutput: false,
    });
    expect(
      propsResetViolations.some((violation) =>
        violation.includes("recognizability risk"),
      ),
    ).toBe(true);

    const concreteRepairPuzzle = withConcreteRepairColumns(SUBSET_SCHEDULE[10]);
    expect(sameStructureRiskForPuzzle(concreteRepairPuzzle)).toContain(
      "suffix grammar",
    );
    const concreteRepairRegression = SUBSET_SCHEDULE.map((puzzle) =>
      puzzle.dayIndex === 10 ? concreteRepairPuzzle : puzzle,
    );
    const concreteRepairViolations = checkSubsetPackEditorialStandards({
      schedule: concreteRepairRegression,
      checkBuildOutput: false,
    });
    expect(
      concreteRepairViolations.some((violation) =>
        violation.includes("same category structure"),
      ),
    ).toBe(true);
  });

  it("detects stale Subset schedule strings in built output text", () => {
    expect(
      findStaleSubsetBuildStrings("theme: A light first-letter grid"),
    ).toContain("A light first-letter grid");
    expect(
      findStaleSubsetBuildStrings("theme: Words that follow color cues"),
    ).toEqual([]);
  });
});
