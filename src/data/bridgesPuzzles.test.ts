import { describe, expect, it } from 'vitest';
import {
  BRIDGES_DIFFICULTY_TOTALS,
  BRIDGES_ONBOARDING_DAYS,
  BRIDGES_ONBOARDING_DIFFICULTY_TOTALS,
  BRIDGES_PACK_LENGTH,
  BRIDGES_PACK_START_DATE,
  BRIDGES_SHAPE_FAMILIES,
  BRIDGES_THEME_FAMILY_TARGETS,
  BRIDGES_THEME_IDS,
  BRIDGES_THEME_TOTALS,
  type BridgesDifficulty,
  type BridgesShapeFamily,
  type BridgesThemeId,
} from './bridgesMetadata';
import { bridgesPack } from './bridgesPack.generated';
import {
  bridgesPuzzles,
  analyzePuzzle,
  getBridgesPackMetadata,
  getDailyBridgesPackEntry,
  isBridgesPackDateCovered,
  type BridgesBridge,
  type BridgesIsland,
  type BridgesPuzzle,
} from './bridgesPuzzles';
import { classifyHumanDifficultyScore } from './bridgesGenerator';

function bridgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function buildNeighborPairs(islands: BridgesIsland[]): Set<string> {
  const pairs = new Set<string>();
  islands.forEach((island) => {
    let left: BridgesIsland | null = null;
    let right: BridgesIsland | null = null;
    let up: BridgesIsland | null = null;
    let down: BridgesIsland | null = null;

    islands.forEach((other) => {
      if (other.id === island.id) return;
      if (other.row === island.row) {
        if (other.col < island.col && (!left || other.col > left.col)) left = other;
        if (other.col > island.col && (!right || other.col < right.col)) right = other;
      }
      if (other.col === island.col) {
        if (other.row < island.row && (!up || other.row > up.row)) up = other;
        if (other.row > island.row && (!down || other.row < down.row)) down = other;
      }
    });

    ([left, right, up, down] as Array<BridgesIsland | null>).forEach((neighbor) => {
      if (neighbor) pairs.add(bridgeKey(island.id, neighbor.id));
    });
  });
  return pairs;
}

function wouldCross(
  candidate: BridgesBridge,
  existing: BridgesBridge,
  islandMap: Map<number, BridgesIsland>
): boolean {
  const a = islandMap.get(candidate.island1);
  const b = islandMap.get(candidate.island2);
  const c = islandMap.get(existing.island1);
  const d = islandMap.get(existing.island2);
  if (!a || !b || !c || !d) return false;
  const candidateHorizontal = a.row === b.row;
  const existingHorizontal = c.row === d.row;
  if (candidateHorizontal === existingHorizontal) return false;

  const horizontal = candidateHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const vertical = candidateHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return (
    vertical.col > horizontal.minCol &&
    vertical.col < horizontal.maxCol &&
    horizontal.row > vertical.minRow &&
    horizontal.row < vertical.maxRow
  );
}

function assertValidPuzzle(puzzle: BridgesPuzzle) {
  const islandMap = new Map<number, BridgesIsland>();
  puzzle.islands.forEach((island) => islandMap.set(island.id, island));
  const neighborPairs = buildNeighborPairs(puzzle.islands);
  const counts: Record<number, number> = {};
  puzzle.islands.forEach((island) => {
    counts[island.id] = 0;
    expect(island.row).toBeGreaterThanOrEqual(0);
    expect(island.row).toBeLessThan(puzzle.rowCount);
    expect(island.col).toBeGreaterThanOrEqual(0);
    expect(island.col).toBeLessThan(puzzle.colCount);
  });

  puzzle.solution.forEach((bridge, index) => {
    expect(bridge.count === 1 || bridge.count === 2).toBe(true);
    expect(neighborPairs.has(bridgeKey(bridge.island1, bridge.island2))).toBe(true);
    counts[bridge.island1] += bridge.count;
    counts[bridge.island2] += bridge.count;
    puzzle.solution.slice(index + 1).forEach((other) => {
      expect(wouldCross(bridge, other, islandMap)).toBe(false);
    });
  });

  puzzle.islands.forEach((island) => {
    expect(counts[island.id]).toBe(island.requiredBridges);
    expect(island.requiredBridges).toBeGreaterThan(0);
    expect(island.requiredBridges).toBeLessThanOrEqual(8);
  });

  const visited = new Set<number>();
  const stack = [puzzle.islands[0]?.id];
  while (stack.length) {
    const current = stack.pop();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    puzzle.solution
      .filter((bridge) => bridge.island1 === current || bridge.island2 === current)
      .forEach((bridge) => {
        stack.push(bridge.island1 === current ? bridge.island2 : bridge.island1);
      });
  }
  expect(visited.size).toBe(puzzle.islands.length);
}

describe('bridges yearly pack', () => {
  it('ships a fixed 365-day pack with the configured start date', () => {
    expect(bridgesPack).toHaveLength(BRIDGES_PACK_LENGTH);
    expect(getBridgesPackMetadata().startDate).toBe(BRIDGES_PACK_START_DATE);
  });

  it('audits every shipped pack entry for validity, uniqueness, and human-solver completion', () => {
    bridgesPack.forEach((entry) => {
      assertValidPuzzle(entry.puzzle);
      const analysis = analyzePuzzle(entry.puzzle);
      expect(analysis.exact.solutionCount).toBe(1);
      expect(analysis.human.solved).toBe(true);
      expect(analysis.human.openingProgress).toBe(true);
      expect(analysis.human.stalledPasses).toBeLessThanOrEqual(3);
    });
  });

  it('uses exact difficulty totals and exact theme totals for the year', () => {
    const difficultyCounts: Record<BridgesDifficulty, number> = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };
    const themeCounts: Record<BridgesThemeId, number> = {
      ocean: 0,
      ice: 0,
      desert: 0,
      volcano: 0,
      forest: 0,
      chicago: 0,
    };
    bridgesPack.forEach((entry) => {
      difficultyCounts[entry.difficulty] += 1;
      themeCounts[entry.themeId] += 1;
    });

    expect(difficultyCounts).toEqual(BRIDGES_DIFFICULTY_TOTALS);
    expect(themeCounts).toEqual(BRIDGES_THEME_TOTALS);
  });

  it('keeps theme difficulty mix close to the pack mean without turning theme into a difficulty signal', () => {
    const packMean =
      (BRIDGES_DIFFICULTY_TOTALS.Easy +
        BRIDGES_DIFFICULTY_TOTALS.Medium * 2 +
        BRIDGES_DIFFICULTY_TOTALS.Hard * 3) /
      BRIDGES_PACK_LENGTH;
    const counts: Record<BridgesThemeId, Record<BridgesDifficulty, number>> = {
      ocean: { Easy: 0, Medium: 0, Hard: 0 },
      ice: { Easy: 0, Medium: 0, Hard: 0 },
      desert: { Easy: 0, Medium: 0, Hard: 0 },
      volcano: { Easy: 0, Medium: 0, Hard: 0 },
      forest: { Easy: 0, Medium: 0, Hard: 0 },
      chicago: { Easy: 0, Medium: 0, Hard: 0 },
    };

    bridgesPack.forEach((entry) => {
      counts[entry.themeId][entry.difficulty] += 1;
    });

    BRIDGES_THEME_IDS.forEach((themeId) => {
      const themeCounts = counts[themeId];
      expect(themeCounts.Easy).toBeGreaterThanOrEqual(5);
      expect(themeCounts.Medium).toBeGreaterThanOrEqual(32);
      expect(themeCounts.Hard).toBeGreaterThanOrEqual(15);

      const total = themeCounts.Easy + themeCounts.Medium + themeCounts.Hard;
      expect(total).toBe(BRIDGES_THEME_TOTALS[themeId]);

      const average = (themeCounts.Easy + themeCounts.Medium * 2 + themeCounts.Hard * 3) /
        (themeCounts.Easy + themeCounts.Medium + themeCounts.Hard);
      expect(Math.abs(average - packMean)).toBeLessThanOrEqual(0.15);
    });
  });

  it('covers every family at every difficulty and keeps rectangular share healthy', () => {
    const familiesByDifficulty: Record<BridgesDifficulty, Set<BridgesShapeFamily>> = {
      Easy: new Set(),
      Medium: new Set(),
      Hard: new Set(),
    };
    const rectangularShare: Record<BridgesDifficulty, { total: number; rectangular: number }> = {
      Easy: { total: 0, rectangular: 0 },
      Medium: { total: 0, rectangular: 0 },
      Hard: { total: 0, rectangular: 0 },
    };

    bridgesPack.forEach((entry) => {
      familiesByDifficulty[entry.difficulty].add(entry.shapeFamily);
      rectangularShare[entry.difficulty].total += 1;
      if (entry.puzzle.rowCount !== entry.puzzle.colCount) {
        rectangularShare[entry.difficulty].rectangular += 1;
      }
    });

    (['Easy', 'Medium', 'Hard'] as const).forEach((difficulty) => {
      expect(familiesByDifficulty[difficulty].size).toBe(BRIDGES_SHAPE_FAMILIES.length);
      const share =
        rectangularShare[difficulty].rectangular / rectangularShare[difficulty].total;
      expect(share).toBeGreaterThanOrEqual(0.35);
      expect(share).toBeLessThanOrEqual(0.8);
    });
  });

  it('enforces signature uniqueness and healthy cadence across the year', () => {
    const signatures = new Set<string>();
    const archetypeSlugs = new Set<string>();
    const lastThemeFamilyDay = new Map<string, number>();
    let familyStreak = 1;

    bridgesPack.forEach((entry, index) => {
      expect(signatures.has(entry.signature)).toBe(false);
      signatures.add(entry.signature);

      expect(archetypeSlugs.has(entry.archetypeSlug)).toBe(false);
      archetypeSlugs.add(entry.archetypeSlug);

      if (index > 0) {
        familyStreak =
          bridgesPack[index - 1]!.shapeFamily === entry.shapeFamily ? familyStreak + 1 : 1;
        expect(familyStreak).toBeLessThanOrEqual(4);
      }

      const themeFamilyKey = `${entry.themeId}:${entry.shapeFamily}`;
      const previousThemeFamilyDay = lastThemeFamilyDay.get(themeFamilyKey);
      if (previousThemeFamilyDay !== undefined) {
        expect(index - previousThemeFamilyDay).toBeGreaterThanOrEqual(6);
      }
      lastThemeFamilyDay.set(themeFamilyKey, index);

      if (index >= 2) {
        const hardStreak = bridgesPack
          .slice(index - 2, index + 1)
          .filter((candidate) => candidate.difficulty === 'Hard').length;
        expect(hardStreak).toBeLessThanOrEqual(2);
      }
      if (index >= 13 && index - 13 >= BRIDGES_ONBOARDING_DAYS) {
        const window = bridgesPack.slice(index - 13, index + 1);
        const easy = window.filter((candidate) => candidate.difficulty === 'Easy').length;
        const medium = window.filter((candidate) => candidate.difficulty === 'Medium').length;
        const hard = window.filter((candidate) => candidate.difficulty === 'Hard').length;
        expect(easy).toBeGreaterThanOrEqual(0);
        expect(easy).toBeLessThanOrEqual(3);
        expect(medium).toBeGreaterThanOrEqual(7);
        expect(medium).toBeLessThanOrEqual(10);
        expect(hard).toBeGreaterThanOrEqual(3);
        expect(hard).toBeLessThanOrEqual(5);
      }
    });
  });

  it('tracks theme-family usage close to the intended affinity targets', () => {
    const counts: Record<BridgesThemeId, Partial<Record<BridgesShapeFamily, number>>> = {
      ocean: {},
      ice: {},
      desert: {},
      volcano: {},
      forest: {},
      chicago: {},
    };

    bridgesPack.forEach((entry) => {
      counts[entry.themeId][entry.shapeFamily] =
        (counts[entry.themeId][entry.shapeFamily] ?? 0) + 1;
    });

    BRIDGES_THEME_IDS.forEach((themeId) => {
      const targets = BRIDGES_THEME_FAMILY_TARGETS[themeId];
      Object.entries(targets).forEach(([family, target]) => {
        const actual = counts[themeId][family as BridgesShapeFamily] ?? 0;
        expect(actual).toBe(target ?? 0);
      });
    });
  });

  it('keeps the first 28 days in the lighter onboarding mix', () => {
    const onboarding = bridgesPack.slice(0, BRIDGES_ONBOARDING_DAYS);
    const counts: Record<BridgesDifficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
    onboarding.forEach((entry) => {
      counts[entry.difficulty] += 1;
    });
    expect(counts).toEqual(BRIDGES_ONBOARDING_DIFFICULTY_TOTALS);
  });

  it('reads the frozen pack by UTC date without falling back inside the covered window', () => {
    bridgesPack.forEach((entry) => {
      const date = new Date(`${entry.date}T12:00:00.000Z`);
      expect(isBridgesPackDateCovered(date)).toBe(true);
      const loaded = getDailyBridgesPackEntry(date);
      expect(loaded.date).toBe(entry.date);
      expect(loaded.signature).toBe(entry.signature);
      expect(loaded.themeId).toBe(entry.themeId);
    });
  });

  it('keeps the current shipped hard anchor inside the new medium band', () => {
    const hardAnchor = bridgesPuzzles.find((puzzle) => puzzle.id === 'bridges-hard-001');
    expect(hardAnchor).toBeDefined();
    const analysis = analyzePuzzle(hardAnchor!);
    expect(classifyHumanDifficultyScore(analysis.human.difficultyScore)).toBe('Medium');
  });
});
