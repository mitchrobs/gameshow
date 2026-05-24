import {
  createLibertiesBoard,
  getBestLibertiesHintMove,
  getLibertiesBlockerRange,
  getLibertiesPackAudit,
  getLibertiesPuzzleAudit,
  getLowestLibertiesMoveCount,
  isLibertiesSolved,
  libertiesPuzzles,
  libertiesPuzzlesHard,
  libertiesReservePuzzles,
  libertiesReservePuzzlesHard,
  replayLibertiesMoves,
  type LibertiesPlayMode,
  type LibertiesPuzzle,
} from '../src/data/libertiesPuzzles';

interface AuditExpectation {
  mode: LibertiesPlayMode;
  publicLength: number;
  reserveLength: number;
  medianSecondsMin: number;
  medianSecondsMax: number;
  decisionPointMin: number;
  tempoClearMin: number;
  stretchPressureMin: number;
  naivePenaltyMin: number;
  terrainUsefulnessMin: number;
  fillerRatioMax: number;
}

const EXPECTATIONS: Record<LibertiesPlayMode, AuditExpectation> = {
  standard: {
    mode: 'standard',
    publicLength: 365,
    reserveLength: 72,
    medianSecondsMin: 285,
    medianSecondsMax: 345,
    decisionPointMin: 3,
    tempoClearMin: 2,
    stretchPressureMin: 2,
    naivePenaltyMin: 2,
    terrainUsefulnessMin: 10,
    fillerRatioMax: 0.12,
  },
  hard: {
    mode: 'hard',
    publicLength: 365,
    reserveLength: 72,
    medianSecondsMin: 540,
    medianSecondsMax: 720,
    decisionPointMin: 7,
    tempoClearMin: 4,
    stretchPressureMin: 5,
    naivePenaltyMin: 4,
    terrainUsefulnessMin: 18,
    fillerRatioMax: 0.08,
  },
};

function puzzleHasInitialBlack(puzzle: LibertiesPuzzle): boolean {
  const board = createLibertiesBoard(puzzle);
  return board.some((row) => row.some((cell) => cell === 'black'));
}

function openingHintReachesFloor(puzzle: LibertiesPuzzle): boolean {
  const hint = getBestLibertiesHintMove(puzzle, createLibertiesBoard(puzzle));
  return !!hint && hint.movesToSolve === getLowestLibertiesMoveCount(puzzle);
}

function puzzleFailsGate(puzzle: LibertiesPuzzle, expectation: AuditExpectation): boolean {
  const replay = replayLibertiesMoves(puzzle, puzzle.solution);
  const minReplay = replayLibertiesMoves(puzzle, puzzle.minSolution ?? []);
  const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
  const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
  return (
    replay.illegalMoveIndex !== null ||
    minReplay.illegalMoveIndex !== null ||
    !isLibertiesSolved(puzzle, minReplay.board) ||
    !openingHintReachesFloor(puzzle) ||
    puzzleAudit.isPureOpeningFill ||
    puzzleAudit.fillerMoveRatio >= expectation.fillerRatioMax ||
    puzzleAudit.blockerCount < minBlockers ||
    puzzleAudit.blockerCount > maxBlockers ||
    puzzleAudit.decisionPointCount < (puzzle.difficulty === 'Easy' ? 1 : expectation.decisionPointMin) ||
    puzzleAudit.tempoClearCount < (puzzle.difficulty === 'Easy' ? 1 : expectation.tempoClearMin) ||
    puzzleAudit.stretchPressureCount < (puzzle.difficulty === 'Easy' ? 0 : expectation.stretchPressureMin) ||
    puzzleAudit.naivePenalty < (puzzle.difficulty === 'Easy' ? 1 : expectation.naivePenaltyMin) ||
    puzzleAudit.terrainUsefulnessScore < (puzzle.difficulty === 'Easy' ? 6 : expectation.terrainUsefulnessMin)
  );
}

function printAudit(label: string, puzzles: LibertiesPuzzle[]): void {
  const audit = getLibertiesPackAudit(puzzles);
  console.log(`${label} audit`);
  console.log(`Puzzles: ${audit.puzzleCount}`);
  console.log(
    `Difficulty mix: Easy ${audit.difficultyCounts.Easy}, Standard ${audit.difficultyCounts.Standard}, Hard ${audit.difficultyCounts.Hard}`
  );
  console.log(
    `Target moves: min ${audit.minTargetMoves}, max ${audit.maxTargetMoves}, average ${audit.averageTargetMoves.toFixed(1)}`
  );
  console.log(
    `Minimum moves: min ${audit.minMinimumMoves}, max ${audit.maxMinimumMoves}, average ${audit.averageMinimumMoves.toFixed(1)}`
  );
  console.log(`Median target seconds: ${audit.medianTargetSeconds}`);
  console.log(`Average decision points: ${audit.averageDecisionPointCount.toFixed(1)}`);
  console.log(`Average tempo clears: ${audit.averageTempoClearCount.toFixed(1)}`);
  console.log(`Average stretch pressure: ${audit.averageStretchPressureCount.toFixed(1)}`);
  console.log(`Average naive penalty: ${audit.averageNaivePenalty.toFixed(1)}`);
  console.log(`Average terrain usefulness: ${audit.averageTerrainUsefulnessScore.toFixed(1)}`);
  console.log(`Average filler ratio: ${(audit.averageFillerMoveRatio * 100).toFixed(1)}%`);
}

function auditMode(
  label: string,
  publicPuzzles: LibertiesPuzzle[],
  reservePuzzles: LibertiesPuzzle[],
  expectation: AuditExpectation
): string[] {
  const failures: string[] = [];
  const allPuzzles = [...publicPuzzles, ...reservePuzzles];
  const publicAudit = getLibertiesPackAudit(publicPuzzles);
  const reserveAudit = getLibertiesPackAudit(reservePuzzles);
  const allIds = new Set(allPuzzles.map((puzzle) => puzzle.id));
  const allLayouts = new Set(allPuzzles.map((puzzle) => puzzle.layout.join('/')));
  const publicFailed = publicPuzzles.filter((puzzle) => puzzleFailsGate(puzzle, expectation));
  const reserveFailed = reservePuzzles.filter((puzzle) => puzzleFailsGate(puzzle, expectation));
  const initialBlackPuzzles = allPuzzles.filter(puzzleHasInitialBlack);
  const terrain = publicAudit.terrainArchetypeCounts;

  printAudit(`${label} public`, publicPuzzles);
  printAudit(`${label} reserve`, reservePuzzles);

  if (publicPuzzles.length !== expectation.publicLength) failures.push(`${label}: public length ${publicPuzzles.length}`);
  if (reservePuzzles.length !== expectation.reserveLength) failures.push(`${label}: reserve length ${reservePuzzles.length}`);
  if (allIds.size !== allPuzzles.length) failures.push(`${label}: duplicate ids`);
  if (allLayouts.size !== allPuzzles.length) failures.push(`${label}: duplicate layouts`);
  if (initialBlackPuzzles.length > 0) failures.push(`${label}: initial black ${initialBlackPuzzles.map((puzzle) => puzzle.id).join(', ')}`);
  if (
    publicAudit.medianTargetSeconds < expectation.medianSecondsMin ||
    publicAudit.medianTargetSeconds > expectation.medianSecondsMax
  ) {
    failures.push(`${label}: median seconds ${publicAudit.medianTargetSeconds}`);
  }
  if (publicAudit.averageDecisionPointCount < expectation.decisionPointMin) failures.push(`${label}: low decision points`);
  if (publicAudit.averageTempoClearCount < expectation.tempoClearMin) failures.push(`${label}: low tempo clears`);
  if (publicAudit.averageStretchPressureCount < expectation.stretchPressureMin) failures.push(`${label}: low stretch pressure`);
  if (publicAudit.averageNaivePenalty < expectation.naivePenaltyMin) failures.push(`${label}: low naive penalty`);
  if (publicAudit.averageTerrainUsefulnessScore < expectation.terrainUsefulnessMin) failures.push(`${label}: low terrain usefulness`);
  if (publicAudit.averageFillerMoveRatio >= expectation.fillerRatioMax) failures.push(`${label}: high filler ratio`);
  if (publicAudit.pureOpeningFillCount > 0 || reserveAudit.pureOpeningFillCount > 0) failures.push(`${label}: pure fill puzzles`);
  if (publicFailed.length > 0 || reserveFailed.length > 0) {
    failures.push(`${label}: puzzle gate failures ${[...publicFailed, ...reserveFailed].slice(0, 20).map((puzzle) => puzzle.id).join(', ')}`);
  }
  if (expectation.mode === 'hard' && ((terrain.bridge ?? 0) === 0 || (terrain.squeeze ?? 0) === 0)) {
    failures.push(`${label}: missing bridge or squeeze terrain`);
  }

  return failures;
}

const standardFailures = auditMode('Standard', libertiesPuzzles, libertiesReservePuzzles, EXPECTATIONS.standard);
const hardFailures = auditMode('Hard', libertiesPuzzlesHard, libertiesReservePuzzlesHard, EXPECTATIONS.hard);
const standardLayouts = new Set(libertiesPuzzles.map((puzzle) => puzzle.layout.join('/')));
const hardLayoutOverlap = libertiesPuzzlesHard.filter((puzzle) => standardLayouts.has(puzzle.layout.join('/')));
const standardIds = new Set(libertiesPuzzles.map((puzzle) => puzzle.id));
const hardIdOverlap = libertiesPuzzlesHard.filter((puzzle) => standardIds.has(puzzle.id));
const failures = [...standardFailures, ...hardFailures];

console.log(`Standard/Hard public layout overlap: ${hardLayoutOverlap.length}`);
console.log(`Standard/Hard public id overlap: ${hardIdOverlap.length}`);
if (hardLayoutOverlap.length > 0 || hardIdOverlap.length > 0) {
  failures.push('Standard/Hard public overlap detected');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
