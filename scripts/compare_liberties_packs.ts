import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  buildLibertiesDualPacksForGeneration,
  getLibertiesBlockerRange,
  type LibertiesDualModePackGenerationResult,
  getLibertiesPackAudit,
  getLibertiesPuzzleAudit,
  isLibertiesSolved,
  replayLibertiesMoves,
  type LibertiesDifficulty,
  type LibertiesPackAudit,
  type LibertiesPuzzle,
} from '../src/data/libertiesPuzzles';

interface CountRecord {
  [value: string]: number;
}

interface ScopeSummary {
  label: string;
  labelKey: 'public' | 'reserve' | 'combined';
  puzzles: LibertiesPuzzle[];
  audit: LibertiesPackAudit;
  expectedDifficultyCounts: Record<LibertiesDifficulty, number>;
  expectedSizeCounts: Record<number, number>;
  sizeCounts: Record<number, number>;
  gateFailureIds: string[];
  gateFailureReasons: CountRecord;
}

interface DimensionRow {
  dimension: string;
  oldValue: string;
  newValue: string;
  delta: string;
  score: string;
  direction: string;
}

interface LoadedLegacyPack {
  publicPuzzles: LibertiesPuzzle[];
  reservePuzzles: LibertiesPuzzle[];
  hardPublicPuzzles: LibertiesPuzzle[];
  hardReservePuzzles: LibertiesPuzzle[];
}

const TARGET_PUBLIC_DIFFICULTY: Record<LibertiesDifficulty, number> = {
  Easy: 93,
  Standard: 411,
  Hard: 246,
};

const TARGET_RESERVE_DIFFICULTY: Record<LibertiesDifficulty, number> = {
  Easy: 10,
  Standard: 48,
  Hard: 14,
};

const TARGET_PUBLIC_SIZE_STANDARD: Record<LibertiesDifficulty, Record<number, number>> = {
  Easy: { 7: 72, 8: 21 },
  Standard: { 8: 185, 9: 226 },
  Hard: { 9: 221, 10: 25 },
};

const TARGET_PUBLIC_SIZE_HARD: Record<LibertiesDifficulty, Record<number, number>> = {
  Easy: { 9: 93 },
  Standard: { 8: 40, 9: 80, 10: 181, 11: 106, 12: 4 },
  Hard: { 9: 90, 10: 87, 11: 59, 12: 10 },
};

const TARGET_RESERVE_SIZE_STANDARD: Record<LibertiesDifficulty, Record<number, number>> = {
  Easy: { 7: 8, 8: 2 },
  Standard: { 8: 33, 9: 15 },
  Hard: { 9: 13, 10: 1 },
};

const TARGET_RESERVE_SIZE_HARD: Record<LibertiesDifficulty, Record<number, number>> = {
  Easy: { 9: 10 },
  Standard: { 9: 40, 10: 8 },
  Hard: { 11: 14 },
};

const TARGET_COMBINED_DIFFICULTY: Record<LibertiesDifficulty, number> = {
  Easy: TARGET_PUBLIC_DIFFICULTY.Easy + TARGET_RESERVE_DIFFICULTY.Easy,
  Standard: TARGET_PUBLIC_DIFFICULTY.Standard + TARGET_RESERVE_DIFFICULTY.Standard,
  Hard: TARGET_PUBLIC_DIFFICULTY.Hard + TARGET_RESERVE_DIFFICULTY.Hard,
};

type CompareMode = 'standard' | 'hard';

const TARGET_COMBINED_SIZE_STANDARD: Record<number, number> = mergeSizeCounts(
  flattenDifficultySizeTargets(TARGET_PUBLIC_SIZE_STANDARD),
  flattenDifficultySizeTargets(TARGET_RESERVE_SIZE_STANDARD)
);

const TARGET_COMBINED_SIZE_HARD: Record<number, number> = mergeSizeCounts(
  flattenDifficultySizeTargets(TARGET_PUBLIC_SIZE_HARD),
  flattenDifficultySizeTargets(TARGET_RESERVE_SIZE_HARD)
);

function getTargetSizeCounts(
  mode: CompareMode,
  scope: 'public' | 'reserve'
): Record<number, number> {
  if (mode === 'hard') {
    return scope === 'public'
      ? flattenDifficultySizeTargets(TARGET_PUBLIC_SIZE_HARD)
      : flattenDifficultySizeTargets(TARGET_RESERVE_SIZE_HARD);
  }
  return scope === 'public'
    ? flattenDifficultySizeTargets(TARGET_PUBLIC_SIZE_STANDARD)
    : flattenDifficultySizeTargets(TARGET_RESERVE_SIZE_STANDARD);
}

const BASELINE_REF = (() => {
  const refIndex = process.argv.indexOf('--ref');
  if (refIndex >= 0) return process.argv[refIndex + 1] ?? 'HEAD';
  return 'HEAD';
})();

const REPORT_PATH = 'docs/liberties-pack-comparison.md';

function clamp01(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function scoreFromNoChange(oldValue: number, newValue: number): number {
  const delta = Math.abs(newValue - oldValue);
  const basis = Math.max(1, Math.abs(oldValue));
  return clamp01(1 - delta / basis) * 100;
}

function scoreFromTargetMatch(actual: number, target: number): number {
  if (target === 0) return actual === 0 ? 100 : 0;
  const ratio = 1 - Math.abs(actual - target) / target;
  return clamp01(ratio) * 100;
}

function scoreVectorMatch(
  actual: Record<string, number>,
  target: Record<string, number>
): { score: number; mismatch: number; total: number } {
  const keys = new Set<string>([...Object.keys(actual), ...Object.keys(target)]);
  let mismatch = 0;
  let total = 0;
  keys.forEach((key) => {
    const actualValue = actual[key] ?? 0;
    const targetValue = target[key] ?? 0;
    mismatch += Math.abs(actualValue - targetValue);
    total += targetValue + actualValue;
  });
  const score = total > 0 ? clamp01(1 - mismatch / total) * 100 : 100;
  return { score, mismatch, total };
}

function percent(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

function expectedDifficultyTotal(target: Record<LibertiesDifficulty, number>): number {
  return target.Easy + target.Standard + target.Hard;
}

function flattenDifficultySizeTargets(sizeTargets: Record<LibertiesDifficulty, Record<number, number>>): Record<number, number> {
  return mergeSizeCounts(...Object.values(sizeTargets));
}

function mergeSizeCounts(...targets: Array<Record<number, number>>): Record<number, number> {
  const merged: Record<number, number> = {};
  targets.forEach((target) => {
    Object.entries(target).forEach(([size, count]) => {
      const sizeKey = Number(size);
      merged[sizeKey] = (merged[sizeKey] ?? 0) + count;
    });
  });
  return merged;
}

function countBySize(puzzles: LibertiesPuzzle[]): Record<number, number> {
  const counts: Record<number, number> = {};
  puzzles.forEach((puzzle) => {
    counts[puzzle.size] = (counts[puzzle.size] ?? 0) + 1;
  });
  return counts;
}

function countByDifficultyAndSize(
  puzzles: LibertiesPuzzle[]
): Record<LibertiesDifficulty, Record<number, number>> {
  const counts: Record<LibertiesDifficulty, Record<number, number>> = {
    Easy: {},
    Standard: {},
    Hard: {},
  };
  puzzles.forEach((puzzle) => {
    const bucket = counts[puzzle.difficulty];
    bucket[puzzle.size] = (bucket[puzzle.size] ?? 0) + 1;
  });
  return counts;
}

function uniqueLayouts(puzzles: LibertiesPuzzle[]): number {
  return new Set(puzzles.map((puzzle) => puzzle.layout.join('/'))).size;
}

const MAX_ALLOWED_SIZES_BY_MODE: Record<CompareMode, Record<LibertiesDifficulty, number>> = {
  standard: {
    Easy: 8,
    Standard: 9,
    Hard: 10,
  },
  hard: {
    Easy: 9,
    Standard: 10,
    Hard: 12,
  },
};

function puzzlePassesPlayerTest(puzzle: LibertiesPuzzle, mode: CompareMode): string[] {
  const replay = replayLibertiesMoves(puzzle, puzzle.solution);
  const minimumReplay = replayLibertiesMoves(puzzle, puzzle.minSolution ?? []);
  const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
  const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
  const responseMinimum = puzzle.difficulty === 'Hard' ? 3 : puzzle.difficulty === 'Standard' ? 2 : 0;
  const minMoves = puzzle.minMoves ?? puzzle.targetMoves;
  const generatedToFloorGap = Math.max(0, puzzle.targetMoves - minMoves);
  const minimumMoveFloor =
    puzzle.difficulty === 'Hard' ? (puzzle.size >= 10 ? 18 : 13) : puzzle.difficulty === 'Standard' ? 9 : 6;
  const maximumGeneratedToFloorGap =
    puzzle.difficulty === 'Hard' ? (puzzle.size >= 10 ? 20 : 16) : puzzle.difficulty === 'Standard' ? 16 : 12;

  const failures: string[] = [];
  if (replay.illegalMoveIndex !== null) {
    failures.push(`target move ${replay.illegalMoveIndex + 1} illegal`);
  }
  if (minimumReplay.illegalMoveIndex !== null) {
    failures.push(`minimum solution contains illegal move ${minimumReplay.illegalMoveIndex + 1}`);
  }
  if (!isLibertiesSolved(puzzle, minimumReplay.board)) {
    failures.push('minimum solution does not solve board');
  }
  if (minMoves < minimumMoveFloor) {
    failures.push(`minimum moves ${minMoves} below floor ${minimumMoveFloor}`);
  }
  if (minMoves > puzzle.targetMoves) {
    failures.push(`minimum moves ${minMoves} above target ${puzzle.targetMoves}`);
  }
  if (generatedToFloorGap > maximumGeneratedToFloorGap) {
    failures.push(`gap ${generatedToFloorGap} exceeds target ${maximumGeneratedToFloorGap}`);
  }
  if (puzzleAudit.isPureOpeningFill) {
    failures.push('pure opening fill');
  }
  if (puzzleAudit.responseEventCount < responseMinimum) {
    failures.push(`response events ${puzzleAudit.responseEventCount} below minimum ${responseMinimum}`);
  }
  if (puzzleAudit.fillerMoveRatio >= 0.25) {
    failures.push(`filler ratio ${(puzzleAudit.fillerMoveRatio * 100).toFixed(1)}%`);
  }
  if (puzzleAudit.blockerCount < minBlockers) {
    failures.push(`blocker count ${puzzleAudit.blockerCount} below minimum ${minBlockers}`);
  }
  if (puzzleAudit.blockerCount > maxBlockers) {
    failures.push(`blocker count ${puzzleAudit.blockerCount} above maximum ${maxBlockers}`);
  }
  if (puzzleAudit.blockerImpactScore < (puzzle.difficulty === 'Hard' ? 13 : puzzle.difficulty === 'Standard' ? 10 : 5)) {
    failures.push(`blocker impact ${puzzleAudit.blockerImpactScore} too low`);
  }
  if (puzzle.size > MAX_ALLOWED_SIZES_BY_MODE[mode][puzzle.difficulty]) {
    failures.push(`board size ${puzzle.size} too large`);
  }

  return failures;
}

function runPlayerTestFailures(
  puzzles: LibertiesPuzzle[],
  mode: CompareMode
): { failures: string[]; reasons: CountRecord } {
  const failureReasons: CountRecord = {};
  const failureIds: string[] = [];

  puzzles.forEach((puzzle) => {
    const reasons = puzzlePassesPlayerTest(puzzle, mode);
    if (reasons.length === 0) return;
    failureIds.push(puzzle.id);
    reasons.forEach((reason) => {
      failureReasons[reason] = (failureReasons[reason] ?? 0) + 1;
    });
  });

  return { failures: failureIds, reasons: failureReasons };
}

function asValueMap(counts: Record<number, number>): string {
  return Object.entries(counts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([size, count]) => `${size}: ${count}`)
    .join(', ');
}

function asDifficultyMap(counts: Record<LibertiesDifficulty, number>): string {
  return (['Easy', 'Standard', 'Hard'] as LibertiesDifficulty[]).map((key) => `${key} ${counts[key]}`).join(', ');
}

function overlapIds(oldPuzzles: LibertiesPuzzle[], newPuzzles: LibertiesPuzzle[]): string[] {
  const newSet = new Set(newPuzzles.map((puzzle) => puzzle.id));
  return oldPuzzles.map((puzzle) => puzzle.id).filter((id) => newSet.has(id));
}

function averageCaptureDependency(puzzles: LibertiesPuzzle[]): number {
  const total = puzzles.reduce((sum, puzzle) => {
    const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
    return sum + puzzleAudit.captureOrderDependencyScore;
  }, 0);
  return puzzles.length > 0 ? total / puzzles.length : 0;
}

function formatScore(value: number): string {
  return `${value.toFixed(1)}`;
}

function toSummary(
  scopeLabel: 'public' | 'reserve' | 'combined',
  puzzles: LibertiesPuzzle[],
  expectedDifficultyCounts: Record<LibertiesDifficulty, number>,
  expectedSizeCounts: Record<number, number>,
  mode: CompareMode
): ScopeSummary {
  const audit = getLibertiesPackAudit(puzzles);
  const { failures, reasons } = runPlayerTestFailures(puzzles, mode);

  return {
    label: scopeLabel === 'public' ? 'Public' : scopeLabel === 'reserve' ? 'Reserve' : 'Combined',
    labelKey: scopeLabel,
    puzzles,
    audit,
    expectedDifficultyCounts,
    expectedSizeCounts,
    sizeCounts: countBySize(puzzles),
    gateFailureIds: failures,
    gateFailureReasons: reasons,
  };
}

function buildDimensionRows(
  oldSummary: ScopeSummary,
  newSummary: ScopeSummary,
  scopeLabel: string
): {
  rows: DimensionRow[];
  overallScore: number;
} {
  const rows: DimensionRow[] = [];
  const newTargetCount = expectedDifficultyTotal(newSummary.expectedDifficultyCounts);
  const difficultyMatchOld = scoreVectorMatch(
    oldSummary.audit.difficultyCounts,
    oldSummary.expectedDifficultyCounts as unknown as Record<string, number>
  );
  const difficultyMatchNew = scoreVectorMatch(
    newSummary.audit.difficultyCounts,
    newSummary.expectedDifficultyCounts as unknown as Record<string, number>
  );

  const sizeMatchOld = scoreVectorMatch(oldSummary.sizeCounts, oldSummary.expectedSizeCounts);
  const sizeMatchNew = scoreVectorMatch(newSummary.sizeCounts, newSummary.expectedSizeCounts);

  const dimensions: Array<{
    label: string;
    old: number;
    next: number;
    delta: number;
    score: number;
    direction: string;
    format: (value: number) => string;
  }> = [
    {
      label: 'Puzzle count',
      old: oldSummary.puzzles.length,
      next: newSummary.puzzles.length,
      delta: newSummary.puzzles.length - oldSummary.puzzles.length,
      score: scoreFromTargetMatch(newSummary.puzzles.length, newTargetCount),
      direction: 'target',
      format: (value) => `${value}`,
    },
    {
      label: 'Duplicate IDs',
      old: oldSummary.puzzles.length - new Set(oldSummary.puzzles.map((puzzle) => puzzle.id)).size,
      next: newSummary.puzzles.length - new Set(newSummary.puzzles.map((puzzle) => puzzle.id)).size,
      delta: newSummary.puzzles.length - oldSummary.puzzles.length,
      score: scoreFromTargetMatch(
        newSummary.puzzles.length - new Set(newSummary.puzzles.map((puzzle) => puzzle.id)).size,
        0
      ),
      direction: 'lower',
      format: (value) => `${value}`,
    },
    {
      label: 'Duplicate layouts',
      old: oldSummary.puzzles.length - uniqueLayouts(oldSummary.puzzles),
      next: newSummary.puzzles.length - uniqueLayouts(newSummary.puzzles),
      delta:
        newSummary.puzzles.length - uniqueLayouts(newSummary.puzzles) - (oldSummary.puzzles.length - uniqueLayouts(oldSummary.puzzles)),
      score: scoreFromTargetMatch(
        newSummary.puzzles.length - uniqueLayouts(newSummary.puzzles),
        0
      ),
      direction: 'lower',
      format: (value) => `${value}`,
    },
    {
      label: 'Player-gate failures',
      old: oldSummary.gateFailureIds.length,
      next: newSummary.gateFailureIds.length,
      delta: newSummary.gateFailureIds.length - oldSummary.gateFailureIds.length,
      score: scoreFromNoChange(
        oldSummary.gateFailureIds.length,
        newSummary.gateFailureIds.length
      ),
      direction: 'lower',
      format: (value) => `${value}`,
    },
    {
      label: 'Difficulty mix target match',
      old: difficultyMatchOld.score,
      next: difficultyMatchNew.score,
      delta: difficultyMatchNew.score - difficultyMatchOld.score,
      score: difficultyMatchNew.score,
      direction: 'target',
      format: formatScore,
    },
    {
      label: 'Size mix target match',
      old: sizeMatchOld.score,
      next: sizeMatchNew.score,
      delta: sizeMatchNew.score - sizeMatchOld.score,
      score: sizeMatchNew.score,
      direction: 'target',
      format: formatScore,
    },
    {
      label: 'Avg target moves',
      old: oldSummary.audit.averageTargetMoves,
      next: newSummary.audit.averageTargetMoves,
      delta: newSummary.audit.averageTargetMoves - oldSummary.audit.averageTargetMoves,
      score: scoreFromNoChange(oldSummary.audit.averageTargetMoves, newSummary.audit.averageTargetMoves),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Avg minimum moves',
      old: oldSummary.audit.averageMinimumMoves,
      next: newSummary.audit.averageMinimumMoves,
      delta: newSummary.audit.averageMinimumMoves - oldSummary.audit.averageMinimumMoves,
      score: scoreFromNoChange(oldSummary.audit.averageMinimumMoves, newSummary.audit.averageMinimumMoves),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Avg generated-to-floor gap',
      old: oldSummary.audit.averageTargetToMinimumMoveGap,
      next: newSummary.audit.averageTargetToMinimumMoveGap,
      delta: newSummary.audit.averageTargetToMinimumMoveGap - oldSummary.audit.averageTargetToMinimumMoveGap,
      score: scoreFromNoChange(oldSummary.audit.averageTargetToMinimumMoveGap, newSummary.audit.averageTargetToMinimumMoveGap),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Avg blocker impact',
      old: oldSummary.audit.averageBlockerImpactScore,
      next: newSummary.audit.averageBlockerImpactScore,
      delta: newSummary.audit.averageBlockerImpactScore - oldSummary.audit.averageBlockerImpactScore,
      score: scoreFromNoChange(oldSummary.audit.averageBlockerImpactScore, newSummary.audit.averageBlockerImpactScore),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Response events / puzzle',
      old: oldSummary.audit.responseEventCount / Math.max(1, oldSummary.puzzles.length),
      next: newSummary.audit.responseEventCount / Math.max(1, newSummary.puzzles.length),
      delta:
        newSummary.audit.responseEventCount / Math.max(1, newSummary.puzzles.length) -
        oldSummary.audit.responseEventCount / Math.max(1, oldSummary.puzzles.length),
      score: scoreFromNoChange(
        oldSummary.audit.responseEventCount / Math.max(1, oldSummary.puzzles.length),
        newSummary.audit.responseEventCount / Math.max(1, newSummary.puzzles.length)
      ),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Dynamic moves / puzzle',
      old: oldSummary.audit.dynamicMoveCount / Math.max(1, oldSummary.puzzles.length),
      next: newSummary.audit.dynamicMoveCount / Math.max(1, newSummary.puzzles.length),
      delta:
        newSummary.audit.dynamicMoveCount / Math.max(1, newSummary.puzzles.length) -
        oldSummary.audit.dynamicMoveCount / Math.max(1, oldSummary.puzzles.length),
      score: scoreFromNoChange(
        oldSummary.audit.dynamicMoveCount / Math.max(1, oldSummary.puzzles.length),
        newSummary.audit.dynamicMoveCount / Math.max(1, newSummary.puzzles.length)
      ),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Release moves per puzzle',
      old: oldSummary.audit.requiredReleaseMoveCount / Math.max(1, oldSummary.puzzles.length),
      next: newSummary.audit.requiredReleaseMoveCount / Math.max(1, newSummary.puzzles.length),
      delta:
        newSummary.audit.requiredReleaseMoveCount / Math.max(1, newSummary.puzzles.length) -
        oldSummary.audit.requiredReleaseMoveCount / Math.max(1, oldSummary.puzzles.length),
      score: scoreFromNoChange(
        oldSummary.audit.requiredReleaseMoveCount / Math.max(1, oldSummary.puzzles.length),
        newSummary.audit.requiredReleaseMoveCount / Math.max(1, newSummary.puzzles.length)
      ),
      direction: 'stable',
      format: formatScore,
    },
    {
      label: 'Tag coverage',
      old: Object.values(oldSummary.audit.tagCounts).filter((count) => count > 0).length,
      next: Object.values(newSummary.audit.tagCounts).filter((count) => count > 0).length,
      delta:
        Object.values(newSummary.audit.tagCounts).filter((count) => count > 0).length -
        Object.values(oldSummary.audit.tagCounts).filter((count) => count > 0).length,
      score: scoreFromTargetMatch(
        Object.values(newSummary.audit.tagCounts).filter((count) => count > 0).length,
        Object.keys(oldSummary.audit.tagCounts).length
      ),
      direction: 'higher',
      format: (value) => `${value}`,
    },
    {
      label: 'Terrain coverage',
      old: Object.values(oldSummary.audit.terrainArchetypeCounts).filter((count) => count > 0).length,
      next: Object.values(newSummary.audit.terrainArchetypeCounts).filter((count) => count > 0).length,
      delta:
        Object.values(newSummary.audit.terrainArchetypeCounts).filter((count) => count > 0).length -
        Object.values(oldSummary.audit.terrainArchetypeCounts).filter((count) => count > 0).length,
      score: scoreFromTargetMatch(
        Object.values(newSummary.audit.terrainArchetypeCounts).filter((count) => count > 0).length,
        Object.keys(newSummary.audit.terrainArchetypeCounts).length
      ),
      direction: 'higher',
      format: (value) => `${value}`,
    },
  ];

  const dimensionRows = dimensions.map(
    ({ label, old, next, delta, score, direction, format }) => ({
      dimension: `${scopeLabel}: ${label}`,
      oldValue: format(old),
      newValue: format(next),
      delta: delta.toFixed(2),
      score: formatScore(score),
      direction,
    })
  );

  const allScores = dimensions.map((dimension) => dimension.score);
  const overallScore = allScores.reduce((sum, score) => sum + score, 0) / Math.max(1, allScores.length);

  rows.push(...dimensionRows);
  return { rows, overallScore };
}

async function loadLegacyPack(ref: string): Promise<LoadedLegacyPack> {
  const source = execSync(`git show ${ref}:src/data/libertiesPack.generated.ts`, {
    encoding: 'utf8',
    maxBuffer: 200 * 1024 * 1024,
  });
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'liberties-pack-legacy-'));
  const tempPath = path.join(tempDir, 'libertiesPack.generated.ts');

  try {
    writeFileSync(tempPath, source, 'utf8');
    const legacy = await import(pathToFileURL(tempPath).href);
    const legacyStandardPublic = (legacy.generatedLibertiesPack as LibertiesPuzzle[]) ?? [];
    const legacyStandardReserve = (legacy.generatedLibertiesReservePack as LibertiesPuzzle[]) ?? [];
    const legacyHardPublic = (legacy.generatedLibertiesHardPack as LibertiesPuzzle[]) ?? legacyStandardPublic;
    const legacyHardReserve =
      (legacy.generatedLibertiesHardReservePack as LibertiesPuzzle[]) ??
      legacyStandardReserve;
    return {
      publicPuzzles: legacyStandardPublic,
      reservePuzzles: legacyStandardReserve,
      hardPublicPuzzles: legacyHardPublic,
      hardReservePuzzles: legacyHardReserve,
    };
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function markdownTable(rows: DimensionRow[]): string {
  const header = ['Dimension', 'Old', 'New', 'Δ', 'Score (0-100)', 'Direction'].join('|');
  const divider = ['---', '---', '---', '---', '---', '---'].join('|');
  const lines = [header, divider];
  rows.forEach((row) => {
    lines.push([row.dimension, row.oldValue, row.newValue, row.delta, row.score, row.direction].join('|'));
  });
  return lines.map((line) => `|${line}|`).join('\n');
}

function markdownList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function toTopDependencyPuzzles(puzzles: LibertiesPuzzle[], limit: number): string[] {
  return puzzles
    .map((puzzle) => {
      const audit = getLibertiesPuzzleAudit(puzzle);
      return {
        puzzle,
        audit,
      };
    })
    .sort(
      (a, b) =>
        b.audit.captureOrderDependencyScore - a.audit.captureOrderDependencyScore ||
        b.audit.responseEventCount - a.audit.responseEventCount ||
        b.audit.dynamicMoveCount - a.audit.dynamicMoveCount
    )
    .slice(0, limit)
    .map(
      ({ puzzle, audit }) =>
        `${puzzle.id} (${puzzle.difficulty}, size ${puzzle.size}, ${puzzle.targetMoves} moves, ${audit.captureOrderDependencyScore} dependency, ${audit.responseEventCount} stretches)`
    );
}

function formatTopFailures(summary: ScopeSummary): string {
  const entries = Object.entries(summary.gateFailureReasons).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return '- None';
  return entries
    .slice(0, 10)
    .map(([reason, count]) => `${reason} (${count}x)`)
    .map((line) => `- ${line}`)
    .join('\n');
}

async function main(): Promise<void> {
  const result: LibertiesDualModePackGenerationResult = buildLibertiesDualPacksForGeneration();
  const legacy = await loadLegacyPack(BASELINE_REF);
  const modeSummaries: Array<{
    modeLabel: string;
    mode: CompareMode;
    oldPublicSummary: ScopeSummary;
    oldReserveSummary: ScopeSummary;
    oldCombinedSummary: ScopeSummary;
    newPublicSummary: ScopeSummary;
    newReserveSummary: ScopeSummary;
    newCombinedSummary: ScopeSummary;
    publicRows: ReturnType<typeof buildDimensionRows>;
    reserveRows: ReturnType<typeof buildDimensionRows>;
    combinedRows: ReturnType<typeof buildDimensionRows>;
    overlapPublicIds: string[];
    overlapReserveIds: string[];
    overlapCombinedIds: string[];
  }> = [];

  const modePairs: Array<{
    modeLabel: string;
    mode: CompareMode;
    oldPublic: LibertiesPuzzle[];
    oldReserve: LibertiesPuzzle[];
    newPublic: LibertiesPuzzle[];
    newReserve: LibertiesPuzzle[];
  }> = [
    {
      modeLabel: 'Standard',
      mode: 'standard',
      oldPublic: legacy.publicPuzzles,
      oldReserve: legacy.reservePuzzles,
      newPublic: result.standard.publicPuzzles,
      newReserve: result.standard.reservePuzzles,
    },
    {
      modeLabel: 'Hard',
      mode: 'hard',
      oldPublic: legacy.hardPublicPuzzles,
      oldReserve: legacy.hardReservePuzzles,
      newPublic: result.hard.publicPuzzles,
      newReserve: result.hard.reservePuzzles,
    },
  ];

  for (const modePair of modePairs) {
    const oldAll = [...modePair.oldPublic, ...modePair.oldReserve];
    const newAll = [...modePair.newPublic, ...modePair.newReserve];
    const targetPublicSize = getTargetSizeCounts(modePair.mode, 'public');
    const targetReserveSize = getTargetSizeCounts(modePair.mode, 'reserve');

    const oldPublicSummary = toSummary(
      'public',
      modePair.oldPublic,
      TARGET_PUBLIC_DIFFICULTY,
      targetPublicSize,
      modePair.mode
    );
    const oldReserveSummary = toSummary(
      'reserve',
      modePair.oldReserve,
      TARGET_RESERVE_DIFFICULTY,
      targetReserveSize,
      modePair.mode
    );
    const oldCombinedSummary = toSummary(
      'combined',
      oldAll,
      TARGET_COMBINED_DIFFICULTY,
      modePair.mode === 'hard' ? TARGET_COMBINED_SIZE_HARD : TARGET_COMBINED_SIZE_STANDARD,
      modePair.mode
    );
    const newPublicSummary = toSummary(
      'public',
      modePair.newPublic,
      TARGET_PUBLIC_DIFFICULTY,
      targetPublicSize,
      modePair.mode
    );
    const newReserveSummary = toSummary(
      'reserve',
      modePair.newReserve,
      TARGET_RESERVE_DIFFICULTY,
      targetReserveSize,
      modePair.mode
    );
    const newCombinedSummary = toSummary(
      'combined',
      newAll,
      TARGET_COMBINED_DIFFICULTY,
      modePair.mode === 'hard' ? TARGET_COMBINED_SIZE_HARD : TARGET_COMBINED_SIZE_STANDARD,
      modePair.mode
    );

    const publicRows = buildDimensionRows(oldPublicSummary, newPublicSummary, `${modePair.modeLabel} Public`);
    const reserveRows = buildDimensionRows(oldReserveSummary, newReserveSummary, `${modePair.modeLabel} Reserve`);
    const combinedRows = buildDimensionRows(oldCombinedSummary, newCombinedSummary, `${modePair.modeLabel} Combined`);
    const overlapPublicIds = overlapIds(modePair.oldPublic, modePair.newPublic);
    const overlapReserveIds = overlapIds(modePair.oldReserve, modePair.newReserve);
    const overlapCombinedIds = overlapIds(oldAll, newAll);

    modeSummaries.push({
      modeLabel: modePair.modeLabel,
      mode: modePair.mode,
      oldPublicSummary,
      oldReserveSummary,
      oldCombinedSummary,
      newPublicSummary,
      newReserveSummary,
      newCombinedSummary,
      publicRows,
      reserveRows,
      combinedRows,
      overlapPublicIds,
      overlapReserveIds,
      overlapCombinedIds,
    });
  }

  const allRows = modeSummaries.flatMap((modeSummary) => [
    ...modeSummary.publicRows.rows,
    ...modeSummary.reserveRows.rows,
    ...modeSummary.combinedRows.rows,
  ]);
  const sortedDimensionRows = [...allRows].sort((a, b) => Number(a.score) - Number(b.score));

  const reportSections = modeSummaries.flatMap((modeSummary) => {
    return [
      `## ${modeSummary.modeLabel} mode comparison`,
      '',
      `${modeSummary.modeLabel} public: ${modeSummary.newPublicSummary.puzzles.length} new vs ${modeSummary.oldPublicSummary.puzzles.length} baseline`,
      `${modeSummary.modeLabel} reserve: ${modeSummary.newReserveSummary.puzzles.length} new vs ${modeSummary.oldReserveSummary.puzzles.length} baseline`,
      `${modeSummary.modeLabel} combined: ${modeSummary.newCombinedSummary.puzzles.length} new vs ${modeSummary.oldCombinedSummary.puzzles.length} baseline`,
      `Public overlap IDs with baseline: ${modeSummary.overlapPublicIds.length}/${modeSummary.oldPublicSummary.puzzles.length}`,
      `Reserve overlap IDs with baseline: ${modeSummary.overlapReserveIds.length}/${modeSummary.oldReserveSummary.puzzles.length}`,
      `Combined overlap IDs with baseline: ${modeSummary.overlapCombinedIds.length}/${modeSummary.oldCombinedSummary.puzzles.length}`,
      '',
      `Public overlap IDs: ${modeSummary.overlapPublicIds.slice(0, 10).join(', ') || 'none'}`,
      `Reserve overlap IDs: ${modeSummary.overlapReserveIds.slice(0, 10).join(', ') || 'none'}`,
      '',
      `Public difficulty mix: ${asDifficultyMap(modeSummary.newPublicSummary.audit.difficultyCounts)} (old ${asDifficultyMap(modeSummary.oldPublicSummary.audit.difficultyCounts)})`,
      `Reserve difficulty mix: ${asDifficultyMap(modeSummary.newReserveSummary.audit.difficultyCounts)} (old ${asDifficultyMap(modeSummary.oldReserveSummary.audit.difficultyCounts)})`,
      `Combined difficulty mix: ${asDifficultyMap(modeSummary.newCombinedSummary.audit.difficultyCounts)} (old ${asDifficultyMap(modeSummary.oldCombinedSummary.audit.difficultyCounts)})`,
      `Public size mix: ${asValueMap(modeSummary.newPublicSummary.sizeCounts)} vs ${asValueMap(modeSummary.oldPublicSummary.sizeCounts)}`,
      `Reserve size mix: ${asValueMap(modeSummary.newReserveSummary.sizeCounts)} vs ${asValueMap(modeSummary.oldReserveSummary.sizeCounts)}`,
      '',
      'Top reasoned public failures:',
      formatTopFailures(modeSummary.newPublicSummary),
      '',
      'Top hardest public examples:',
      markdownList(toTopDependencyPuzzles(modeSummary.newPublicSummary.puzzles, 10)),
      '',
      'Top reasoned reserve failures:',
      formatTopFailures(modeSummary.newReserveSummary),
      '',
      'Top hardest reserve examples:',
      markdownList(toTopDependencyPuzzles(modeSummary.newReserveSummary.puzzles, 10)),
      '',
      'Top reasoned combined failures:',
      formatTopFailures(modeSummary.newCombinedSummary),
      '',
      'Top hardest combined examples:',
      markdownList(toTopDependencyPuzzles(modeSummary.newCombinedSummary.puzzles, 10)),
      '',
    ];
  });

  const report = [
    '# Liberties Pack Player-Test Comparison',
    '',
    `Baseline: ${BASELINE_REF}:src/data/libertiesPack.generated.ts`,
    '',
    '## Method',
    '',
    'Automated play checks are run for each puzzle by validating generated routes, minimum-route solvability, move-floor bounds, blocker bounds, response-pressure requirements, and release legality.',
    '',
    ...reportSections,
    '## Dimension comparison',
    '',
    markdownTable(sortedDimensionRows),
    '',
  ].join('\n');

  writeFileSync(REPORT_PATH, report, 'utf8');

  console.log(`Compared new pack to ${BASELINE_REF}`);
  modeSummaries.forEach((modeSummary) => {
    console.log(
      `${modeSummary.modeLabel} public score: ${formatScore(modeSummary.publicRows.overallScore)}`
    );
    console.log(
      `${modeSummary.modeLabel} reserve score: ${formatScore(modeSummary.reserveRows.overallScore)}`
    );
    console.log(
      `${modeSummary.modeLabel} combined score: ${formatScore(modeSummary.combinedRows.overallScore)}`
    );
  });
  console.log(`Wrote comparison report to ${REPORT_PATH}`);
}

void main();
