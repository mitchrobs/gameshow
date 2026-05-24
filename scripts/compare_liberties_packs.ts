import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  LibertiesDifficulty,
  LibertiesPuzzle,
  LibertiesSubPuzzleMoment,
  LibertiesTerrainArchetype,
  LibertiesPuzzleTag,
} from '../src/data/libertiesPuzzles';
import {
  getLibertiesPackAudit,
  getLowestLibertiesMoveCount,
  getLibertiesPuzzleAudit,
  LIBERTIES_TAG_LABELS,
  LIBERTIES_SUB_PUZZLE_MOMENT_LABELS,
} from '../src/data/libertiesPuzzles';

interface CliOptions {
  oldPackPath: string;
  newPackPath: string;
  outputPath: string | null;
}

interface LoadedModePack {
  publicPuzzles: LibertiesPuzzle[];
  reservePuzzles: LibertiesPuzzle[];
}

interface LoadedPack {
  label: string;
  sourcePath: string;
  standard: LoadedModePack;
  hard: LoadedModePack;
  hasHard: boolean;
}

interface PackSummary {
  puzzleCount: number;
  reserveCount: number;
  combinedCount: number;
  difficultyCounts: Record<LibertiesDifficulty, number>;
  sizeCounts: Record<number, number>;
  uniqueIds: number;
  uniqueLayouts: number;
  targetMoves: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
  minMoves: {
    min: number;
    max: number;
    mean: number;
    median: number;
  };
  blocker: {
    avgCount: number;
    avgImpact: number;
    minImpact: number;
  };
  gameplay: {
    avgResponseEvents: number;
    avgDynamicMoves: number;
    avgCaptureDependency: number;
    avgFillerRatio: number;
    pureOpeningFillCount: number;
    delayedMoveCount: number;
    averageTargetSeconds: number;
    standardMedianTargetSeconds: number;
    medianTargetSeconds: number;
    avgNaivePenalty: number;
    avgDecisionPoints: number;
    avgTempoClears: number;
    avgStretchPressure: number;
    avgTerrainUsefulness: number;
  };
  tags: Record<LibertiesPuzzleTag, number>;
  archetypes: Record<LibertiesTerrainArchetype, number>;
  difficultyTransitions: number;
  maxStreakDifficulty?: number;
  sharedOpenSideRatio: number;
  subPuzzleMoments: Record<LibertiesSubPuzzleMoment, number>;
  subPuzzleMomentCoverage: number;
}

interface PersonaProfile {
  id: string;
  label: string;
  solvedRate: number;
  medianSeconds: number;
  medianStandardSeconds: number;
  averageHints: number;
  averageResets: number;
  unclearRuleFlags: number;
  frustrationFlags: number;
}

interface PackPersonaProfile extends PersonaProfile {
  pool: string;
}

const PERSONAS = [
  {
    id: 'first-time-logic',
    label: 'First-time logic player',
    speedMultiplier: 0.98,
    responseTolerance: 16,
    sharedMoveBonus: 0.4,
    hintBias: 0.34,
    resetBias: 0.18,
  },
  {
    id: 'linkedin-casual',
    label: 'LinkedIn Queens/Tango casual',
    speedMultiplier: 0.96,
    responseTolerance: 22,
    sharedMoveBonus: 0.55,
    hintBias: 0.2,
    resetBias: 0.11,
  },
  {
    id: 'nyt-pips-visual',
    label: 'NYT Pips-style visual solver',
    speedMultiplier: 0.92,
    responseTolerance: 25,
    sharedMoveBonus: 0.7,
    hintBias: 0.15,
    resetBias: 0.08,
  },
  {
    id: 'sudoku-bridges-optimizer',
    label: 'Sudoku/Bridges optimizer',
    speedMultiplier: 0.86,
    responseTolerance: 30,
    sharedMoveBonus: 0.9,
    hintBias: 0.08,
    resetBias: 0.06,
  },
  {
    id: 'go-aware-reader',
    label: 'Go-aware tactical reader',
    speedMultiplier: 0.82,
    responseTolerance: 34,
    sharedMoveBonus: 0.8,
    hintBias: 0.06,
    resetBias: 0.05,
  },
  {
    id: 'impatient-mobile',
    label: 'Impatient mobile tapper',
    speedMultiplier: 0.95,
    responseTolerance: 18,
    sharedMoveBonus: 0.45,
    hintBias: 0.28,
    resetBias: 0.2,
  },
  {
    id: 'low-vision-accessibility',
    label: 'Accessibility / low-vision reviewer',
    speedMultiplier: 0.97,
    responseTolerance: 20,
    sharedMoveBonus: 0.5,
    hintBias: 0.25,
    resetBias: 0.13,
  },
] as const;

type Persona = (typeof PERSONAS)[number];

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const get = (key: string): string | undefined => {
    const index = args.findIndex((entry) => entry === `--${key}` || entry.startsWith(`--${key}=`));
    if (index < 0) return undefined;
    const direct = args[index];
    if (direct.includes('=')) return direct.split('=', 2)[1];
    return args[index + 1];
  };

  const outputPath = get('out') || get('output') || null;
  return {
    oldPackPath: get('previous') ?? get('old') ?? '/tmp/gameshow-liberties-baseline/libertiesPack.generated.previous.ts',
    newPackPath: get('new') ?? get('current') ?? 'src/data/libertiesPack.generated.ts',
    outputPath,
  };
}

function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function min(values: number[]): number {
  return values.length === 0 ? 0 : Math.min(...values);
}

function max(values: number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function toMinutes(seconds: number): string {
  const sign = seconds < 0 ? '-' : '';
  const absoluteSeconds = Math.abs(seconds);
  return `${sign}${Math.floor(absoluteSeconds / 60)}:${String(absoluteSeconds % 60).padStart(2, '0')}`;
}

function toOne(v: number): string {
  return v.toFixed(1);
}

function toOnePercent(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

async function loadPack(path: string, label: string): Promise<LoadedPack> {
  const sourcePath = resolve(process.cwd(), path);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing pack module: ${sourcePath}`);
  }

  const module = (await import(pathToFileURL(sourcePath).href)) as {
    generatedLibertiesPack?: LibertiesPuzzle[];
    generatedLibertiesReservePack?: LibertiesPuzzle[];
    generatedLibertiesPackHard?: LibertiesPuzzle[];
    generatedLibertiesReservePackHard?: LibertiesPuzzle[];
    libertiesPuzzles?: LibertiesPuzzle[];
    libertiesReservePuzzles?: LibertiesPuzzle[];
    libertiesPuzzlesStandard?: LibertiesPuzzle[];
    libertiesReservePuzzlesStandard?: LibertiesPuzzle[];
    libertiesPuzzlesHard?: LibertiesPuzzle[];
    libertiesReservePuzzlesHard?: LibertiesPuzzle[];
  };

  const standardPublicPuzzles = module.generatedLibertiesPack ?? module.libertiesPuzzles ?? module.libertiesPuzzlesStandard ?? [];
  const standardReservePuzzles =
    module.generatedLibertiesReservePack ??
    module.libertiesReservePuzzles ??
    module.libertiesReservePuzzlesStandard ??
    [];
  const hardPublicPuzzles = module.generatedLibertiesPackHard ?? module.libertiesPuzzlesHard ?? [];
  const hardReservePuzzles = module.generatedLibertiesReservePackHard ?? module.libertiesReservePuzzlesHard ?? [];
  if (!Array.isArray(standardPublicPuzzles) || !Array.isArray(standardReservePuzzles)) {
    throw new Error(`Loaded module for ${sourcePath} has no export for generated or liberties arrays`);
  }
  if (!Array.isArray(hardPublicPuzzles) || !Array.isArray(hardReservePuzzles)) {
    throw new Error(`Loaded module for ${sourcePath} has invalid hard-mode pack arrays`);
  }

  return {
    label,
    sourcePath,
    standard: {
      publicPuzzles: standardPublicPuzzles,
      reservePuzzles: standardReservePuzzles,
    },
    hard: {
      publicPuzzles: hardPublicPuzzles,
      reservePuzzles: hardReservePuzzles,
    },
    hasHard: hardPublicPuzzles.length > 0 || hardReservePuzzles.length > 0,
  };
}

function buildTagCounts(puzzles: LibertiesPuzzle[]): Record<LibertiesPuzzleTag, number> {
  const counts = Object.fromEntries(
    (Object.keys(LIBERTIES_TAG_LABELS) as LibertiesPuzzleTag[]).map((tag) => [tag, 0])
  ) as Record<LibertiesPuzzleTag, number>;
  puzzles.forEach((puzzle) => {
    puzzle.focusTags.forEach((tag) => {
      counts[tag] += 1;
    });
  });
  return counts;
}

function buildArchetypeCounts(puzzles: LibertiesPuzzle[]): Record<LibertiesTerrainArchetype, number> {
  const archetypes = puzzles.flatMap((puzzle) => puzzle.terrainArchetypes ?? []);
  const uniques = Array.from(new Set(archetypes)).sort();
  const base = Object.fromEntries(uniques.map((entry) => [entry, 0])) as Record<LibertiesTerrainArchetype, number>;
  archetypes.forEach((archetype) => {
    base[archetype] += 1;
  });
  return base;
}

function buildSubPuzzleMomentCounts(puzzles: LibertiesPuzzle[]): Record<LibertiesSubPuzzleMoment, number> {
  const base = Object.fromEntries(
    (Object.keys(LIBERTIES_SUB_PUZZLE_MOMENT_LABELS) as LibertiesSubPuzzleMoment[]).map((moment) => [moment, 0])
  ) as Record<LibertiesSubPuzzleMoment, number>;
  puzzles.forEach((puzzle) => {
    puzzle.subPuzzleMoments?.forEach((moment) => {
      base[moment] += 1;
    });
  });
  return base;
}

function summarizeDifficultyTransitions(puzzles: LibertiesPuzzle[]): { transitions: number; maxStreak: number } {
  let transitions = 0;
  let maxStreak = 0;
  let current = 1;
  for (let index = 1; index < puzzles.length; index += 1) {
    const prev = puzzles[index - 1];
    const currentPuzzle = puzzles[index];
    if (!prev || !currentPuzzle) break;
    if (currentPuzzle.difficulty !== prev.difficulty) transitions += 1;
    if (currentPuzzle.difficulty === prev.difficulty) {
      current += 1;
    } else {
      maxStreak = Math.max(maxStreak, current);
      current = 1;
    }
  }
  maxStreak = Math.max(maxStreak, current);
  return { transitions, maxStreak };
}

function summarizePuzzles(puzzles: LibertiesPuzzle[]): PackSummary {
  const audits = puzzles.map((puzzle) => ({
    puzzle,
    audit: getLibertiesPuzzleAudit(puzzle),
    minMoves: getLowestLibertiesMoveCount(puzzle),
  }));

  const difficultyCounts = {
    Easy: 0,
    Standard: 0,
    Hard: 0,
  } as Record<LibertiesDifficulty, number>;
  const sizeCounts = {} as Record<number, number>;
  audits.forEach(({ puzzle }) => {
    difficultyCounts[puzzle.difficulty] += 1;
    sizeCounts[puzzle.size] = (sizeCounts[puzzle.size] ?? 0) + 1;
  });

  const targetMoves = audits.map(({ puzzle }) => puzzle.targetMoves);
  const minMoves = audits.map(({ minMoves }) => minMoves);

  const sharedOpenSideCount = audits.reduce((sum, { audit }) => sum + audit.sharedOpenSideCount, 0);
  const standardPuzzles = puzzles.filter((puzzle) => puzzle.difficulty === 'Standard');
  const standardAudit = getLibertiesPackAudit(standardPuzzles);
  const subPuzzleMoments = buildSubPuzzleMomentCounts(puzzles);
  const subPuzzleMomentCoverage = Object.values(subPuzzleMoments).filter((count) => count > 0).length / Object.keys(subPuzzleMoments).length;

  return {
    puzzleCount: puzzles.length,
    reserveCount: 0,
    combinedCount: puzzles.length,
    uniqueIds: new Set(puzzles.map((puzzle) => puzzle.id)).size,
    uniqueLayouts: new Set(puzzles.map((puzzle) => puzzle.layout.join('/'))).size,
    difficultyCounts,
    sizeCounts,
    targetMoves: {
      min: min(targetMoves),
      max: max(targetMoves),
      mean: average(targetMoves),
      median: median(targetMoves),
    },
    minMoves: {
      min: min(minMoves),
      max: max(minMoves),
      mean: average(minMoves),
      median: median(minMoves),
    },
    blocker: {
      avgCount: average(audits.map(({ audit }) => audit.blockerCount)),
      avgImpact: average(audits.map(({ audit }) => audit.blockerImpactScore)),
      minImpact: min(audits.map(({ audit }) => audit.blockerImpactScore)),
    },
    gameplay: {
      avgResponseEvents: average(audits.map(({ audit }) => audit.responseEventCount)),
      avgDynamicMoves: average(audits.map(({ audit }) => audit.dynamicMoveCount)),
      avgCaptureDependency: average(audits.map(({ audit }) => audit.captureOrderDependencyScore)),
      avgFillerRatio: average(audits.map(({ audit }) => audit.fillerMoveRatio)),
      pureOpeningFillCount: audits.filter(({ audit }) => audit.isPureOpeningFill).length,
      delayedMoveCount: audits.reduce((sum, { audit }) => sum + audit.delayedMoveCount, 0),
      averageTargetSeconds: average(puzzles.map(({ targetSeconds }) => targetSeconds)),
      standardMedianTargetSeconds: standardAudit.standardMedianTargetSeconds,
      medianTargetSeconds: getLibertiesPackAudit(puzzles).medianTargetSeconds,
      avgNaivePenalty: average(audits.map(({ audit }) => audit.naivePenalty)),
      avgDecisionPoints: average(audits.map(({ audit }) => audit.decisionPointCount)),
      avgTempoClears: average(audits.map(({ audit }) => audit.tempoClearCount)),
      avgStretchPressure: average(audits.map(({ audit }) => audit.stretchPressureCount)),
      avgTerrainUsefulness: average(audits.map(({ audit }) => audit.terrainUsefulnessScore)),
    },
    tags: buildTagCounts(puzzles),
    archetypes: buildArchetypeCounts(puzzles),
    subPuzzleMoments,
    subPuzzleMomentCoverage,
    ...(() => {
      const { transitions, maxStreak } = summarizeDifficultyTransitions(puzzles);
      return { difficultyTransitions: transitions, maxStreakDifficulty: maxStreak, sharedOpenSideRatio: sharedOpenSideCount / Math.max(1, targetMoves.length) };
    })(),
  };
}

function summarizePackSet(loaded: LoadedModePack): {
  public: PackSummary;
  reserve: PackSummary;
  combined: PackSummary;
} {
  const publicSummary = summarizePuzzles(loaded.publicPuzzles);
  const reserveSummary = summarizePuzzles(loaded.reservePuzzles);
  const combinedSummary = summarizePuzzles([...loaded.publicPuzzles, ...loaded.reservePuzzles]);
  const publicPackAudit = getLibertiesPackAudit(loaded.publicPuzzles);
  const reservePackAudit = getLibertiesPackAudit(loaded.reservePuzzles);
  return {
    public: {
      ...publicSummary,
      puzzleCount: publicPackAudit.puzzleCount,
      reserveCount: loaded.reservePuzzles.length,
      combinedCount: publicPackAudit.puzzleCount + reservePackAudit.puzzleCount,
    },
    reserve: {
      ...reserveSummary,
      puzzleCount: reservePackAudit.puzzleCount,
      reserveCount: 0,
      combinedCount: reservePackAudit.puzzleCount,
    },
    combined: {
      ...combinedSummary,
      reserveCount: 0,
      combinedCount: publicSummary.puzzleCount + reserveSummary.puzzleCount,
      puzzleCount: publicPackAudit.puzzleCount + reservePackAudit.puzzleCount,
    },
  };
}


function computePersonaSummary(puzzles: LibertiesPuzzle[], pool: string): PackPersonaProfile[] {
  return PERSONAS.map((persona) => {
    const results = puzzles.map((puzzle) => {
      const audit = getLibertiesPuzzleAudit(puzzle);
      const complexity =
        audit.responseEventCount +
        audit.dynamicMoveCount * 0.8 +
        audit.captureOrderDependencyScore * 0.65 +
        audit.blockerImpactScore * 0.22 +
        Math.max(0, puzzle.targetMoves - 22) * 0.5;
      const sharedHelp = audit.sharedOpenSideCount * persona.sharedMoveBonus;
      const stress = Math.max(0, complexity - persona.responseTolerance - sharedHelp);
      const load = puzzle.difficulty === 'Hard' ? 1 : puzzle.difficulty === 'Standard' ? 1 : 0.78;
      const predictedSeconds = Math.round(puzzle.targetSeconds * persona.speedMultiplier * load + stress * 0.18);
      const hints = Math.max(0, Math.round(stress * persona.hintBias * 0.06));
      const resets = Math.max(0, Math.round(stress * persona.resetBias * 0.02));
      const solved = stress <= persona.responseTolerance * (puzzle.playMode === 'hard' ? 10 : 8) || puzzle.difficulty !== 'Hard';
      const unclearRule = hints > 2 && stress > persona.responseTolerance * 2 ? 1 : 0;
      const frustration = predictedSeconds > (puzzle.difficulty === 'Hard' ? 780 : 540) || resets > 1 ? 1 : 0;
      return { predictedSeconds, hints, resets, solved, unclearRule, frustration };
    });

    const standardSeconds = results
      .filter((_, index) => puzzles[index]?.difficulty === 'Standard')
      .map((result) => result.predictedSeconds);
    const solvedCount = results.filter((result) => result.solved).length;
    return {
      id: persona.id,
      label: persona.label,
      pool,
      solvedRate: solvedCount / Math.max(1, results.length),
      medianSeconds: median(results.map((result) => result.predictedSeconds)),
      medianStandardSeconds: median(standardSeconds),
      averageHints: average(results.map((result) => result.hints)),
      averageResets: average(results.map((result) => result.resets)),
      unclearRuleFlags: results.reduce((sum, result) => sum + result.unclearRule, 0),
      frustrationFlags: results.reduce((sum, result) => sum + result.frustration, 0),
    };
  });
}

function compareSet(
  label: string,
  previous: PackSummary,
  next: PackSummary,
  previousPersonas: PackPersonaProfile[],
  nextPersonas: PackPersonaProfile[],
): string {
  const lines = [`## ${label} Pack Comparison`, ''];
  const summaryRows = [
    [
      'Puzzle count',
      `${previous.puzzleCount}/${previous.reserveCount} + ${previous.combinedCount}`,
      `${next.puzzleCount}/${next.reserveCount} + ${next.combinedCount}`,
      `${next.puzzleCount - previous.puzzleCount}`,
    ],
    [
      'Unique IDs',
      `${previous.uniqueIds.toString()} / layouts ${previous.uniqueLayouts}`,
      `${next.uniqueIds} / layouts ${next.uniqueLayouts}`,
      `${next.uniqueIds - previous.uniqueIds}`,
    ],
    [
      'Target moves avg',
      `${toOne(previous.targetMoves.mean)} (med ${previous.targetMoves.median})`,
      `${toOne(next.targetMoves.mean)} (med ${next.targetMoves.median})`,
      `${toOne(next.targetMoves.mean - previous.targetMoves.mean)}`,
    ],
    [
      'Minimum move floor avg',
      `${toOne(previous.minMoves.mean)} (med ${previous.minMoves.median})`,
      `${toOne(next.minMoves.mean)} (med ${next.minMoves.median})`,
      `${toOne(next.minMoves.mean - previous.minMoves.mean)}`,
    ],
    [
      'Target floor gap avg',
      `${toOne(previous.targetMoves.mean - previous.minMoves.mean)}`,
      `${toOne(next.targetMoves.mean - next.minMoves.mean)}`,
      `${toOne((next.targetMoves.mean - next.minMoves.mean) - (previous.targetMoves.mean - previous.minMoves.mean))}`,
    ],
    ['Difficulty transitions', previous.difficultyTransitions.toString(), next.difficultyTransitions.toString(), `${next.difficultyTransitions - previous.difficultyTransitions}`],
    ['Max same-difficulty streak', `${previous.maxStreakDifficulty}`, `${next.maxStreakDifficulty}`, `${(next.maxStreakDifficulty ?? 0) - (previous.maxStreakDifficulty ?? 0)}`],
    ['Blocker impact', toOne(previous.blocker.avgImpact), toOne(next.blocker.avgImpact), toOne(next.blocker.avgImpact - previous.blocker.avgImpact)],
    ['Response events', toOne(previous.gameplay.avgResponseEvents), toOne(next.gameplay.avgResponseEvents), toOne(next.gameplay.avgResponseEvents - previous.gameplay.avgResponseEvents)],
    ['Dynamic moves', toOne(previous.gameplay.avgDynamicMoves), toOne(next.gameplay.avgDynamicMoves), toOne(next.gameplay.avgDynamicMoves - previous.gameplay.avgDynamicMoves)],
    ['Capture dependency', toOne(previous.gameplay.avgCaptureDependency), toOne(next.gameplay.avgCaptureDependency), toOne(next.gameplay.avgCaptureDependency - previous.gameplay.avgCaptureDependency)],
    ['Naive penalty', toOne(previous.gameplay.avgNaivePenalty), toOne(next.gameplay.avgNaivePenalty), toOne(next.gameplay.avgNaivePenalty - previous.gameplay.avgNaivePenalty)],
    ['Decision points', toOne(previous.gameplay.avgDecisionPoints), toOne(next.gameplay.avgDecisionPoints), toOne(next.gameplay.avgDecisionPoints - previous.gameplay.avgDecisionPoints)],
    ['Tempo clears', toOne(previous.gameplay.avgTempoClears), toOne(next.gameplay.avgTempoClears), toOne(next.gameplay.avgTempoClears - previous.gameplay.avgTempoClears)],
    ['Stretch pressure', toOne(previous.gameplay.avgStretchPressure), toOne(next.gameplay.avgStretchPressure), toOne(next.gameplay.avgStretchPressure - previous.gameplay.avgStretchPressure)],
    ['Terrain usefulness', toOne(previous.gameplay.avgTerrainUsefulness), toOne(next.gameplay.avgTerrainUsefulness), toOne(next.gameplay.avgTerrainUsefulness - previous.gameplay.avgTerrainUsefulness)],
    ['Filler ratio', `${(previous.gameplay.avgFillerRatio * 100).toFixed(2)}%`, `${(next.gameplay.avgFillerRatio * 100).toFixed(2)}%`, `${((next.gameplay.avgFillerRatio - previous.gameplay.avgFillerRatio) * 100).toFixed(2)}%`],
    ['Sub-puzzle label coverage', toOnePercent(previous.subPuzzleMomentCoverage), toOnePercent(next.subPuzzleMomentCoverage), toOnePercent(next.subPuzzleMomentCoverage - previous.subPuzzleMomentCoverage)],
    ['Standard median target', toMinutes(previous.gameplay.standardMedianTargetSeconds), toMinutes(next.gameplay.standardMedianTargetSeconds), toMinutes(next.gameplay.standardMedianTargetSeconds - previous.gameplay.standardMedianTargetSeconds)],
    ['All-puzzle median target', toMinutes(previous.gameplay.medianTargetSeconds), toMinutes(next.gameplay.medianTargetSeconds), toMinutes(next.gameplay.medianTargetSeconds - previous.gameplay.medianTargetSeconds)],
    ['Average target seconds', toMinutes(Math.round(previous.gameplay.averageTargetSeconds)), toMinutes(Math.round(next.gameplay.averageTargetSeconds)), toMinutes(Math.round(next.gameplay.averageTargetSeconds - previous.gameplay.averageTargetSeconds))],
  ];
  const subPuzzleMomentRows = (Object.keys(LIBERTIES_SUB_PUZZLE_MOMENT_LABELS) as LibertiesSubPuzzleMoment[]).map(
    (moment) => {
      const label = LIBERTIES_SUB_PUZZLE_MOMENT_LABELS[moment];
      return [
        `Sub-moment: ${label}`,
        previous.subPuzzleMoments[moment].toString(),
        next.subPuzzleMoments[moment].toString(),
        `${next.subPuzzleMoments[moment] - previous.subPuzzleMoments[moment]}`,
      ] as const;
    }
  );
  const personaRows = [
    ...previousPersonas.map((persona) => {
      const current = nextPersonas.find((candidate) => candidate.id === persona.id);
      return [
        `${persona.label} solve rate`,
        `${Math.round(persona.solvedRate * 100)}%`,
        current ? `${Math.round(current.solvedRate * 100)}%` : 'n/a',
        current ? `${Math.round((current.solvedRate - persona.solvedRate) * 100)}%` : 'n/a',
      ];
    }),
    ...previousPersonas.map((persona) => {
      const current = nextPersonas.find((candidate) => candidate.id === persona.id);
      return [
        `${persona.label} median seconds`,
        toMinutes(persona.medianSeconds),
        current ? toMinutes(current.medianSeconds) : 'n/a',
        current ? toMinutes(current.medianSeconds - persona.medianSeconds) : 'n/a',
      ];
    }),
  ];

  lines.push(
    '| Metric | Previous | New | Delta |',
    '|---|---|---:|---:|',
    ...summaryRows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} |`),
    ...subPuzzleMomentRows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} |`),
    '',
    `### Player-agent summary (${label.toLowerCase()})`,
    '',
    '| Persona | Solve rate Δ | Median seconds Δ | Avg hints Δ | Avg resets Δ | Unclear rule flags Δ | Frustration flags Δ |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...previousPersonas
      .map((persona) => {
        const current = nextPersonas.find((candidate) => candidate.id === persona.id);
        if (!current) return null;
        return `| ${persona.label} | ${formatPercent((current.solvedRate - persona.solvedRate) * 100)} | ${formatPercent((current.medianSeconds - persona.medianSeconds) / Math.max(1, persona.medianSeconds) * 100)} | ${toOne(current.averageHints - persona.averageHints)} | ${toOne(current.averageResets - persona.averageResets)} | ${current.unclearRuleFlags - persona.unclearRuleFlags} | ${current.frustrationFlags - persona.frustrationFlags} |`;
      })
      .filter((line): line is string => line !== null),
    ''
  );
  return lines.join('\n');
}

function formatIdOverlap(previousIdsRaw: string[], currentIdsRaw: string[], title: string): string {
  const previousIds = new Set(previousIdsRaw);
  const newIds = new Set(currentIdsRaw);
  const overlap = [...previousIds].filter((id) => newIds.has(id));
  const previousOnly = [...previousIds].filter((id) => !newIds.has(id));
  const currentOnly = [...newIds].filter((id) => !previousIds.has(id));
  const sample = overlap.slice(0, 30);
  const hasMore = overlap.length > sample.length;
  const denominator = previousIds.size + newIds.size - overlap.length;
  const jaccard = denominator === 0 ? 0 : overlap.length / denominator;

  return [
    `### ${title} ID overlap`,
    '',
    `Previous ids: ${previousIds.size}`,
    `Current ids: ${newIds.size}`,
    `Common ids: ${overlap.length}`,
    `Jaccard similarity: ${(jaccard * 100).toFixed(1)}%`,
    `New removals: ${previousOnly.length}`,
    `New additions: ${currentOnly.length}`,
    '',
    `Overlap ids (${sample.length} shown):`,
    sample.length === 0 ? '_None_' : `- ${sample.join(', ')}${hasMore ? ` ... (+${overlap.length - sample.length} more)` : ''}`,
    '',
  ].filter(Boolean).join('\n');
}

function run() {
  const options = parseArgs();
  const previousPath = options.oldPackPath;
  const newPath = options.newPackPath;
  return Promise.all([
    loadPack(previousPath, 'previous'),
    loadPack(newPath, 'current'),
  ]).then(async ([previousPack, nextPack]) => {
    const previousStandard = summarizePackSet(previousPack.standard);
    const nextStandard = summarizePackSet(nextPack.standard);
    const previousHard = summarizePackSet(previousPack.hard);
    const nextHard = summarizePackSet(nextPack.hard);

    const standardPublicPrevious = computePersonaSummary(previousPack.standard.publicPuzzles, 'standard-public');
    const standardPublicNext = computePersonaSummary(nextPack.standard.publicPuzzles, 'standard-public');
    const standardReservePrevious = computePersonaSummary(previousPack.standard.reservePuzzles, 'standard-reserve');
    const standardReserveNext = computePersonaSummary(nextPack.standard.reservePuzzles, 'standard-reserve');
    const standardCombinedPrevious = computePersonaSummary(
      [...previousPack.standard.publicPuzzles, ...previousPack.standard.reservePuzzles],
      'standard-combined'
    );
    const standardCombinedNext = computePersonaSummary(
      [...nextPack.standard.publicPuzzles, ...nextPack.standard.reservePuzzles],
      'standard-combined'
    );

    const hardPublicPrevious = computePersonaSummary(previousPack.hard.publicPuzzles, 'hard-public');
    const hardPublicNext = computePersonaSummary(nextPack.hard.publicPuzzles, 'hard-public');
    const hardReservePrevious = computePersonaSummary(previousPack.hard.reservePuzzles, 'hard-reserve');
    const hardReserveNext = computePersonaSummary(nextPack.hard.reservePuzzles, 'hard-reserve');
    const hardCombinedPrevious = computePersonaSummary(
      [...previousPack.hard.publicPuzzles, ...previousPack.hard.reservePuzzles],
      'hard-combined'
    );
    const hardCombinedNext = computePersonaSummary(
      [...nextPack.hard.publicPuzzles, ...nextPack.hard.reservePuzzles],
      'hard-combined'
    );

    const previousHasHard = previousPack.hasHard;
    const nextHasHard = nextPack.hasHard;

    const standardSection = [
      compareSet('Standard public', previousStandard.public, nextStandard.public, standardPublicPrevious, standardPublicNext),
      compareSet(
        'Standard reserve',
        previousStandard.reserve,
        nextStandard.reserve,
        standardReservePrevious,
        standardReserveNext
      ),
      compareSet(
        'Standard combined',
        previousStandard.combined,
        nextStandard.combined,
        standardCombinedPrevious,
        standardCombinedNext
      ),
      formatIdOverlap(
        previousPack.standard.publicPuzzles.map((puzzle) => puzzle.id),
        nextPack.standard.publicPuzzles.map((puzzle) => puzzle.id),
        'Standard public'
      ),
      formatIdOverlap(
        previousPack.standard.reservePuzzles.map((puzzle) => puzzle.id),
        nextPack.standard.reservePuzzles.map((puzzle) => puzzle.id),
        'Standard reserve'
      ),
      '',
    ].join('\n');

    const hardSection = previousHasHard && nextHasHard
      ? [
          compareSet('Hard public', previousHard.public, nextHard.public, hardPublicPrevious, hardPublicNext),
          compareSet('Hard reserve', previousHard.reserve, nextHard.reserve, hardReservePrevious, hardReserveNext),
          compareSet('Hard combined', previousHard.combined, nextHard.combined, hardCombinedPrevious, hardCombinedNext),
          formatIdOverlap(
            previousPack.hard.publicPuzzles.map((puzzle) => puzzle.id),
            nextPack.hard.publicPuzzles.map((puzzle) => puzzle.id),
            'Hard public'
          ),
          formatIdOverlap(
            previousPack.hard.reservePuzzles.map((puzzle) => puzzle.id),
            nextPack.hard.reservePuzzles.map((puzzle) => puzzle.id),
            'Hard reserve'
          ),
          '',
        ].join('\n')
      : `Hard mode comparison unavailable in ${!previousHasHard ? 'previous ' : ''}${!nextHasHard ? 'next ' : ''}pack file(s).`;

    const report = [
      '# Liberties Pack Comparison',
      '',
      `Compared: \`${previousPack.sourcePath}\` -> \`${nextPack.sourcePath}\``,
      '',
      `## Source details`,
      '',
      `Previous standard public pool: ${previousPack.standard.publicPuzzles.length}`,
      `New standard public pool: ${nextPack.standard.publicPuzzles.length}`,
      `Previous standard reserve pool: ${previousPack.standard.reservePuzzles.length}`,
      `New standard reserve pool: ${nextPack.standard.reservePuzzles.length}`,
      `Previous hard public pool: ${previousPack.hard.publicPuzzles.length}`,
      `New hard public pool: ${nextPack.hard.publicPuzzles.length}`,
      `Previous hard reserve pool: ${previousPack.hard.reservePuzzles.length}`,
      `New hard reserve pool: ${nextPack.hard.reservePuzzles.length}`,
      '',
      '## Standard mode',
      '',
      standardSection,
      '## Hard mode',
      '',
      hardSection,
      '',
    ].join('\n');

    const scoreline = [
      '## Composite score lens',
      '',
      '| Dimension | Previous | New | Delta |',
      '|---|---:|---:|---:|',
      `| Standard public count | ${previousStandard.public.puzzleCount} | ${nextStandard.public.puzzleCount} | ${nextStandard.public.puzzleCount - previousStandard.public.puzzleCount} |`,
      `| Standard reserve count | ${previousStandard.reserve.puzzleCount} | ${nextStandard.reserve.puzzleCount} | ${nextStandard.reserve.puzzleCount - previousStandard.reserve.puzzleCount} |`,
      `| Standard target moves (mean) | ${toOne(previousStandard.public.targetMoves.mean)} | ${toOne(nextStandard.public.targetMoves.mean)} | ${toOne(nextStandard.public.targetMoves.mean - previousStandard.public.targetMoves.mean)} |`,
      `| Standard blocker impact (mean) | ${toOne(previousStandard.public.blocker.avgImpact)} | ${toOne(nextStandard.public.blocker.avgImpact)} | ${toOne(nextStandard.public.blocker.avgImpact - previousStandard.public.blocker.avgImpact)} |`,
      `| Standard response events (mean) | ${toOne(previousStandard.public.gameplay.avgResponseEvents)} | ${toOne(nextStandard.public.gameplay.avgResponseEvents)} | ${toOne(nextStandard.public.gameplay.avgResponseEvents - previousStandard.public.gameplay.avgResponseEvents)} |`,
      `| Standard target seconds (mean) | ${toMinutes(Math.round(previousStandard.public.gameplay.averageTargetSeconds))} | ${toMinutes(Math.round(nextStandard.public.gameplay.averageTargetSeconds))} | ${toMinutes(Math.round(nextStandard.public.gameplay.averageTargetSeconds - previousStandard.public.gameplay.averageTargetSeconds))} |`,
      `| Hard public count | ${previousHard.public.puzzleCount} | ${nextHard.public.puzzleCount} | ${nextHard.public.puzzleCount - previousHard.public.puzzleCount} |`,
      `| Hard reserve count | ${previousHard.reserve.puzzleCount} | ${nextHard.reserve.puzzleCount} | ${nextHard.reserve.puzzleCount - previousHard.reserve.puzzleCount} |`,
      `| Hard target moves (mean) | ${toOne(previousHard.public.targetMoves.mean)} | ${toOne(nextHard.public.targetMoves.mean)} | ${toOne(nextHard.public.targetMoves.mean - previousHard.public.targetMoves.mean)} |`,
      `| Hard blocker impact (mean) | ${toOne(previousHard.public.blocker.avgImpact)} | ${toOne(nextHard.public.blocker.avgImpact)} | ${toOne(nextHard.public.blocker.avgImpact - previousHard.public.blocker.avgImpact)} |`,
      `| Hard response events (mean) | ${toOne(previousHard.public.gameplay.avgResponseEvents)} | ${toOne(nextHard.public.gameplay.avgResponseEvents)} | ${toOne(nextHard.public.gameplay.avgResponseEvents - previousHard.public.gameplay.avgResponseEvents)} |`,
      `| Hard target seconds (mean) | ${toMinutes(Math.round(previousHard.public.gameplay.averageTargetSeconds))} | ${toMinutes(Math.round(nextHard.public.gameplay.averageTargetSeconds))} | ${toMinutes(Math.round(nextHard.public.gameplay.averageTargetSeconds - previousHard.public.gameplay.averageTargetSeconds))} |`,
    ].join('\n');

    const content = [report, scoreline].join('\n');
    if (options.outputPath) {
      const output = resolve(process.cwd(), options.outputPath);
      writeFileSync(output, `${content}\n`);
      console.log(`Wrote comparison report: ${output}`);
    } else {
      console.log(content);
    }
  });
}

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
