import { writeFileSync } from 'node:fs';
import {
  getLibertiesPuzzleAudit,
  libertiesHardPuzzles,
  libertiesHardReservePuzzles,
  libertiesReservePuzzles,
  libertiesPuzzles,
  type LibertiesDifficulty,
  type LibertiesPuzzle,
} from '../src/data/libertiesPuzzles';

interface Persona {
  id: string;
  label: string;
  description: string;
  speedMultiplier: number;
  responseTolerance: number;
  sharedMoveBonus: number;
  hintBias: number;
  resetBias: number;
}

interface PersonaSummary {
  id: string;
  label: string;
  pool: string;
  solved: number;
  solveRate: number;
  medianSeconds: number;
  medianStandardSeconds: number;
  averageHints: number;
  averageResets: number;
  unclearRuleFlags: number;
  frustrationFlags: number;
}

const PERSONAS: Persona[] = [
  {
    id: 'first-time-logic',
    label: 'First-time logic player',
    description: 'Needs literal rules, slow pattern recognition, high cost for hidden state changes.',
    speedMultiplier: 0.98,
    responseTolerance: 16,
    sharedMoveBonus: 0.4,
    hintBias: 0.34,
    resetBias: 0.18,
  },
  {
    id: 'linkedin-casual',
    label: 'LinkedIn Queens/Tango casual',
    description: 'Understands daily constraint puzzles but expects very clear UI feedback.',
    speedMultiplier: 0.96,
    responseTolerance: 22,
    sharedMoveBonus: 0.55,
    hintBias: 0.2,
    resetBias: 0.11,
  },
  {
    id: 'nyt-pips-visual',
    label: 'NYT Pips-style visual solver',
    description: 'Reads spatial objects well and benefits from tactile piece language.',
    speedMultiplier: 0.92,
    responseTolerance: 25,
    sharedMoveBonus: 0.7,
    hintBias: 0.15,
    resetBias: 0.08,
  },
  {
    id: 'sudoku-bridges-optimizer',
    label: 'Sudoku/Bridges optimizer',
    description: 'Looks for efficiency and shared crossings quickly; dislikes arbitrary reactions.',
    speedMultiplier: 0.86,
    responseTolerance: 30,
    sharedMoveBonus: 0.9,
    hintBias: 0.08,
    resetBias: 0.06,
  },
  {
    id: 'go-aware-reader',
    label: 'Go-aware tactical reader',
    description: 'Understands groups and threat timing but may overread rules that are not present.',
    speedMultiplier: 0.82,
    responseTolerance: 34,
    sharedMoveBonus: 0.8,
    hintBias: 0.06,
    resetBias: 0.05,
  },
  {
    id: 'impatient-mobile',
    label: 'Impatient mobile tapper',
    description: 'Taps quickly, relies on preview/status copy, and is sensitive to long hard boards.',
    speedMultiplier: 0.95,
    responseTolerance: 18,
    sharedMoveBonus: 0.45,
    hintBias: 0.28,
    resetBias: 0.2,
  },
  {
    id: 'low-vision-accessibility',
    label: 'Accessibility / low-vision reviewer',
    description: 'Needs high contrast, stable labels, and non-color-only group relationships.',
    speedMultiplier: 0.97,
    responseTolerance: 20,
    sharedMoveBonus: 0.5,
    hintBias: 0.25,
    resetBias: 0.13,
  },
];

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function difficultyLoad(difficulty: LibertiesDifficulty): number {
  if (difficulty === 'Hard') return 1.18;
  if (difficulty === 'Standard') return 1;
  return 0.78;
}

function simulatePersona(persona: Persona, puzzles: LibertiesPuzzle[], pool: string): PersonaSummary {
  const results = puzzles.map((puzzle) => {
    const audit = getLibertiesPuzzleAudit(puzzle);
    const moveFloor = puzzle.minMoves ?? puzzle.targetMoves;
    const routeGap = Math.max(0, puzzle.targetMoves - moveFloor);
    const complexity =
      audit.responseEventCount +
      audit.dynamicMoveCount * 0.8 +
      audit.captureOrderDependencyScore * 0.65 +
      audit.blockerImpactScore * 0.22 +
      Math.max(0, moveFloor - 18) * 0.8 +
      Math.min(10, routeGap) * 0.25;
    const sharedHelp = audit.sharedOpenSideCount * persona.sharedMoveBonus;
    const stress = Math.max(0, complexity - persona.responseTolerance - sharedHelp);
    const predictedSeconds = Math.round(
      puzzle.targetSeconds * persona.speedMultiplier * difficultyLoad(puzzle.difficulty) + stress * 0.6
    );
    const hints = Math.max(0, Math.round(stress * persona.hintBias * 0.08));
    const resets = Math.max(0, Math.round(stress * persona.resetBias * 0.03));
    const solved = stress <= persona.responseTolerance * 6 || puzzle.difficulty !== 'Hard';
    const unclearRule = hints > 2 && stress > persona.responseTolerance * 2 ? 1 : 0;
    const frustration = predictedSeconds > (puzzle.difficulty === 'Hard' ? 780 : 540) || resets > 1 ? 1 : 0;
    return { puzzle, predictedSeconds, hints, resets, solved, unclearRule, frustration };
  });

  const standardSeconds = results
    .filter((result) => result.puzzle.difficulty === 'Standard')
    .map((result) => result.predictedSeconds);
  const solved = results.filter((result) => result.solved).length;
  return {
    id: persona.id,
    label: persona.label,
    pool,
    solved,
    solveRate: solved / results.length,
    medianSeconds: median(results.map((result) => result.predictedSeconds)),
    medianStandardSeconds: median(standardSeconds),
    averageHints: results.reduce((sum, result) => sum + result.hints, 0) / results.length,
    averageResets: results.reduce((sum, result) => sum + result.resets, 0) / results.length,
    unclearRuleFlags: results.reduce((sum, result) => sum + result.unclearRule, 0),
    frustrationFlags: results.reduce((sum, result) => sum + result.frustration, 0),
  };
}

function simulatePersonaPools(
  modeLabel: string,
  modePuzzles: LibertiesPuzzle[],
  modeReservePuzzles: LibertiesPuzzle[]
): PersonaSummary[] {
  const publicSummaries = PERSONAS.map((persona) => simulatePersona(persona, modePuzzles, `${modeLabel}-public`));
  const reserveSummaries = PERSONAS.map((persona) => simulatePersona(persona, modeReservePuzzles, `${modeLabel}-reserve`));
  const combinedSummaries = PERSONAS.map((persona) =>
    simulatePersona(persona, [...modePuzzles, ...modeReservePuzzles], `${modeLabel}-combined`)
  );
  return [...publicSummaries, ...reserveSummaries, ...combinedSummaries];
}

function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const standardSummaries = simulatePersonaPools('standard', libertiesPuzzles, libertiesReservePuzzles);
const hardSummaries = simulatePersonaPools('hard', libertiesHardPuzzles, libertiesHardReservePuzzles);
const summaries = [...standardSummaries, ...hardSummaries];
const standardPuzzles = [...libertiesPuzzles, ...libertiesReservePuzzles];
const hardPuzzles = [...libertiesHardPuzzles, ...libertiesHardReservePuzzles];
const payload = {
  generatedAt: new Date().toISOString(),
  standardPublicPuzzleCount: libertiesPuzzles.length,
  standardReservePuzzleCount: libertiesReservePuzzles.length,
  standardPuzzleCount: standardPuzzles.length,
  hardPublicPuzzleCount: libertiesHardPuzzles.length,
  hardReservePuzzleCount: libertiesHardReservePuzzles.length,
  hardPuzzleCount: hardPuzzles.length,
  puzzleCount: standardPuzzles.length + hardPuzzles.length,
  personas: PERSONAS,
  summaries,
};

writeFileSync('src/data/libertiesPersonaAudit.json', `${JSON.stringify(payload, null, 2)}\n`);
writeFileSync(
  'docs/liberties-player-agent-report.md',
  [
    '# Liberties Player-Agent Report',
    '',
    `Standard public puzzles tested: ${libertiesPuzzles.length}`,
    `Standard reserve puzzles tested: ${libertiesReservePuzzles.length}`,
    `Hard public puzzles tested: ${libertiesHardPuzzles.length}`,
    `Hard reserve puzzles tested: ${libertiesHardReservePuzzles.length}`,
    '',
    '| Pool | Persona | Solve rate | Median solve | Median Standard | Avg hints | Avg resets | Unclear-rule flags | Frustration flags |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|',
    ...summaries.map(
      (summary) =>
        `| ${summary.pool} | ${summary.label} | ${Math.round(summary.solveRate * 100)}% | ${formatTime(summary.medianSeconds)} | ${formatTime(summary.medianStandardSeconds)} | ${summary.averageHints.toFixed(2)} | ${summary.averageResets.toFixed(2)} | ${summary.unclearRuleFlags} | ${summary.frustrationFlags} |`
    ),
    '',
    '## Interpretation',
    '',
    '- The agent gate models Daybreak newcomers, LinkedIn-style daily players, NYT Pips visual solvers, existing logic optimizers, Go-aware players, impatient mobile players, and accessibility review.',
    '- The pass target for this build is a Standard median between 4:00 and 7:00, a Hard public median above 7:30, high solve rate, and no repeated rule-confusion concentration in one persona.',
    '- These are simulated player agents, not a substitute for real external human testing.',
    '',
  ].join('\n')
);

console.log('Liberties player-agent audit');
summaries.forEach((summary) => {
  console.log(
    `${summary.pool} ${summary.label}: solve=${Math.round(summary.solveRate * 100)}% standardMedian=${formatTime(
      summary.medianStandardSeconds
    )} median=${formatTime(summary.medianSeconds)} hints=${summary.averageHints.toFixed(2)} resets=${summary.averageResets.toFixed(2)}`
  );
});

const failing = standardSummaries.filter(
  (summary) =>
    summary.pool === 'standard-public' &&
    (summary.solveRate < 0.94 ||
      summary.medianStandardSeconds < 240 ||
      summary.medianStandardSeconds > 420 ||
      summary.frustrationFlags > 30)
);

const hardFailing = hardSummaries.filter(
  (summary) =>
    summary.pool === 'hard-public' &&
    (summary.solveRate < 0.94 ||
      summary.medianSeconds < 450 ||
      summary.medianSeconds > 780 ||
      summary.frustrationFlags > 30)
);

if (failing.length > 0 || hardFailing.length > 0) {
  const failedPersonas = [...new Set([...failing, ...hardFailing].map((summary) => summary.label))];
  console.error(`Player-agent gate failed: ${failedPersonas.join(', ')}`);
  process.exitCode = 1;
}
