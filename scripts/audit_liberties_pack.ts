import {
  getLibertiesBlockerRange,
  getLibertiesPackAudit,
  getLibertiesPuzzleAudit,
  libertiesReservePuzzles,
  libertiesPuzzles,
  replayLibertiesMoves,
  type LibertiesPuzzle,
} from '../src/data/libertiesPuzzles';

function puzzleFailsGate(puzzle: LibertiesPuzzle): boolean {
  const replay = replayLibertiesMoves(puzzle, puzzle.solution);
  const puzzleAudit = getLibertiesPuzzleAudit(puzzle);
  const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
  const responseMinimum = puzzle.difficulty === 'Hard' ? 3 : puzzle.difficulty === 'Standard' ? 2 : 0;
  return (
    replay.illegalMoveIndex !== null ||
    puzzleAudit.isPureOpeningFill ||
    puzzleAudit.responseEventCount < responseMinimum ||
    puzzleAudit.fillerMoveRatio >= 0.25 ||
    puzzleAudit.blockerCount < minBlockers ||
    puzzleAudit.blockerCount > maxBlockers ||
    puzzleAudit.blockerImpactScore < (puzzle.difficulty === 'Hard' ? 13 : puzzle.difficulty === 'Standard' ? 10 : 5) ||
    puzzle.size > (puzzle.difficulty === 'Hard' ? 10 : puzzle.difficulty === 'Standard' ? 9 : 8)
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
  console.log(`Standard median target seconds: ${audit.standardMedianTargetSeconds}`);
  console.log(`Average red blockers: ${audit.averageBlockerCount.toFixed(1)}`);
  console.log(`Average blocker impact: ${audit.averageBlockerImpactScore.toFixed(1)}`);
  console.log(`Minimum blocker impact: ${audit.minimumBlockerImpactScore}`);
  console.log(`Response events: ${audit.responseEventCount}`);
  console.log(`Dynamic moves: ${audit.dynamicMoveCount}`);
  console.log(`Average filler ratio: ${(audit.averageFillerMoveRatio * 100).toFixed(1)}%`);
}

const allPuzzles = [...libertiesPuzzles, ...libertiesReservePuzzles];
const publicAudit = getLibertiesPackAudit(libertiesPuzzles);
const reserveAudit = getLibertiesPackAudit(libertiesReservePuzzles);
const publicFailed = libertiesPuzzles.filter(puzzleFailsGate);
const reserveFailed = libertiesReservePuzzles.filter(puzzleFailsGate);
const allIds = new Set(allPuzzles.map((puzzle) => puzzle.id));
const allLayouts = new Set(allPuzzles.map((puzzle) => puzzle.layout.join('/')));

printAudit('Public Liberties pack', libertiesPuzzles);
printAudit('Reserve Liberties pack', libertiesReservePuzzles);
console.log(`Combined pool: ${allPuzzles.length}`);
console.log(`Unique ids: ${allIds.size}`);
console.log(`Unique layouts: ${allLayouts.size}`);
console.log(`Public gate failures: ${publicFailed.length}`);
console.log(`Reserve gate failures: ${reserveFailed.length}`);

if (
  libertiesPuzzles.length !== 365 ||
  libertiesReservePuzzles.length !== 35 ||
  allPuzzles.length !== 400 ||
  allIds.size !== allPuzzles.length ||
  allLayouts.size !== allPuzzles.length ||
  publicAudit.standardMedianTargetSeconds < 240 ||
  publicAudit.standardMedianTargetSeconds > 420 ||
  publicAudit.pureOpeningFillCount > 0 ||
  reserveAudit.pureOpeningFillCount > 0 ||
  publicFailed.length > 0 ||
  reserveFailed.length > 0
) {
  console.error([...publicFailed, ...reserveFailed].slice(0, 20).map((puzzle) => puzzle.id).join('\n'));
  process.exitCode = 1;
}
