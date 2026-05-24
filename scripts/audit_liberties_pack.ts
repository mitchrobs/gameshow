import {
  getLibertiesBlockerRange,
  getLibertiesPackAudit,
  getLibertiesPuzzleAudit,
  isLibertiesSolved,
  createLibertiesBoard,
  libertiesHardPuzzles,
  libertiesHardReservePuzzles,
  libertiesReservePuzzles,
  libertiesPuzzles,
  replayLibertiesMoves,
  type LibertiesPuzzle,
  type LibertiesPlayMode,
} from '../src/data/libertiesPuzzles';

function getMaximumBoardSize(puzzle: LibertiesPuzzle, mode: LibertiesPlayMode): number {
  if (mode === 'hard') {
    if (puzzle.difficulty === 'Easy') return 9;
    return 10;
  }
  if (puzzle.difficulty === 'Hard') return 10;
  if (puzzle.difficulty === 'Standard') return 9;
  return 8;
}

function puzzleFailsGate(puzzle: LibertiesPuzzle, mode: LibertiesPlayMode = 'standard'): boolean {
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
  return (
    replay.illegalMoveIndex !== null ||
    minimumReplay.illegalMoveIndex !== null ||
    !isLibertiesSolved(puzzle, minimumReplay.board) ||
    minMoves < minimumMoveFloor ||
    minMoves > puzzle.targetMoves ||
    generatedToFloorGap > maximumGeneratedToFloorGap ||
    puzzleAudit.isPureOpeningFill ||
    puzzleAudit.responseEventCount < responseMinimum ||
    puzzleAudit.fillerMoveRatio >= 0.25 ||
    puzzleAudit.blockerCount < minBlockers ||
    puzzleAudit.blockerCount > maxBlockers ||
    puzzleAudit.blockerImpactScore < (puzzle.difficulty === 'Hard' ? 13 : puzzle.difficulty === 'Standard' ? 10 : 5) ||
    puzzle.size > getMaximumBoardSize(puzzle, mode)
  );
}

const PUBLIC_TARGET_PACK_LENGTH = 730;
const RESERVE_TARGET_PACK_LENGTH = 92;
const POOL_TARGET_PACK_LENGTH = PUBLIC_TARGET_PACK_LENGTH + RESERVE_TARGET_PACK_LENGTH;

function printAudit(label: string, puzzles: LibertiesPuzzle[]): void {
  const audit = getLibertiesPackAudit(puzzles);
  console.log(`${label} audit`);
  console.log(`Puzzles: ${audit.puzzleCount}`);
  console.log(
    `Difficulty mix: Easy ${audit.difficultyCounts.Easy}, Standard ${audit.difficultyCounts.Standard}, Hard ${audit.difficultyCounts.Hard}`
  );
  console.log(
    `Generated route moves: min ${audit.minTargetMoves}, max ${audit.maxTargetMoves}, average ${audit.averageTargetMoves.toFixed(1)}`
  );
  console.log(
    `Move floor: min ${audit.minMinimumMoves}, max ${audit.maxMinimumMoves}, average ${audit.averageMinimumMoves.toFixed(1)}`
  );
  console.log(
    `Generated-to-floor gap: average ${audit.averageTargetToMinimumMoveGap.toFixed(1)}, max ${audit.maxTargetToMinimumMoveGap}`
  );
  console.log(`Standard median target seconds: ${audit.standardMedianTargetSeconds}`);
  console.log(`Average red blockers: ${audit.averageBlockerCount.toFixed(1)}`);
  console.log(`Average blocker impact: ${audit.averageBlockerImpactScore.toFixed(1)}`);
  console.log(`Minimum blocker impact: ${audit.minimumBlockerImpactScore}`);
  console.log(`Response events: ${audit.responseEventCount}`);
  console.log(`Dynamic moves: ${audit.dynamicMoveCount}`);
  console.log(`Average filler ratio: ${(audit.averageFillerMoveRatio * 100).toFixed(1)}%`);
}

const allPuzzles = [...libertiesPuzzles, ...libertiesReservePuzzles];
const allHardPuzzles = [...libertiesHardPuzzles, ...libertiesHardReservePuzzles];
const allModePuzzles = [...allPuzzles, ...libertiesHardPuzzles, ...libertiesHardReservePuzzles];
const publicAudit = getLibertiesPackAudit(libertiesPuzzles);
const reserveAudit = getLibertiesPackAudit(libertiesReservePuzzles);
const publicFailed = libertiesPuzzles.filter((puzzle) => puzzleFailsGate(puzzle, 'standard'));
const reserveFailed = libertiesReservePuzzles.filter((puzzle) => puzzleFailsGate(puzzle, 'standard'));
const hardPublicFailed = libertiesHardPuzzles.filter((puzzle) => puzzleFailsGate(puzzle, 'hard'));
const hardReserveFailed = libertiesHardReservePuzzles.filter((puzzle) => puzzleFailsGate(puzzle, 'hard'));
const allIds = new Set(allPuzzles.map((puzzle) => puzzle.id));
const allLayouts = new Set(allPuzzles.map((puzzle) => puzzle.layout.join('/')));
const allHardIds = new Set(allHardPuzzles.map((puzzle) => puzzle.id));
const allHardLayouts = new Set(allHardPuzzles.map((puzzle) => puzzle.layout.join('/')));
const startingBlackPuzzles = allModePuzzles.filter((puzzle) =>
  createLibertiesBoard(puzzle).some((row) => row.some((cell) => cell === 'black'))
);

printAudit('Public Liberties pack', libertiesPuzzles);
printAudit('Reserve Liberties pack', libertiesReservePuzzles);
printAudit('Hard-mode public Liberties pack', libertiesHardPuzzles);
printAudit('Hard-mode reserve Liberties pack', libertiesHardReservePuzzles);
console.log(`Combined pool: ${allPuzzles.length}`);
console.log(`Unique ids: ${allIds.size}`);
console.log(`Unique layouts: ${allLayouts.size}`);
console.log(`Hard combined pool: ${allHardPuzzles.length}`);
console.log(`Hard unique ids: ${allHardIds.size}`);
console.log(`Hard unique layouts: ${allHardLayouts.size}`);
console.log(`Public gate failures: ${publicFailed.length}`);
console.log(`Reserve gate failures: ${reserveFailed.length}`);
console.log(`Hard public gate failures: ${hardPublicFailed.length}`);
console.log(`Hard reserve gate failures: ${hardReserveFailed.length}`);
console.log(`Starting black pebble failures: ${startingBlackPuzzles.length}`);

if (
  libertiesPuzzles.length !== PUBLIC_TARGET_PACK_LENGTH ||
  libertiesReservePuzzles.length !== RESERVE_TARGET_PACK_LENGTH ||
  libertiesHardPuzzles.length !== PUBLIC_TARGET_PACK_LENGTH ||
  libertiesHardReservePuzzles.length !== RESERVE_TARGET_PACK_LENGTH ||
  allPuzzles.length !== POOL_TARGET_PACK_LENGTH ||
  allHardPuzzles.length !== POOL_TARGET_PACK_LENGTH ||
  allIds.size !== allPuzzles.length ||
  allLayouts.size !== allPuzzles.length ||
  allHardIds.size !== allHardPuzzles.length ||
  allHardLayouts.size !== allHardPuzzles.length ||
  publicAudit.standardMedianTargetSeconds < 240 ||
  publicAudit.standardMedianTargetSeconds > 420 ||
    publicAudit.minMinimumMoves < 7 ||
  publicAudit.averageTargetToMinimumMoveGap > 10 ||
  publicAudit.maxTargetToMinimumMoveGap > 20 ||
  publicAudit.pureOpeningFillCount > 0 ||
  reserveAudit.pureOpeningFillCount > 0 ||
  startingBlackPuzzles.length > 0 ||
  publicFailed.length > 0 ||
  reserveFailed.length > 0 ||
  hardPublicFailed.length > 0 ||
  hardReserveFailed.length > 0
) {
  console.error(
    [...publicFailed, ...reserveFailed, ...hardPublicFailed, ...hardReserveFailed, ...startingBlackPuzzles]
      .slice(0, 20)
      .map((puzzle) => puzzle.id)
      .join('\n')
  );
  process.exitCode = 1;
}
