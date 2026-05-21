import { describe, expect, it } from 'vitest';
import {
  LIBERTIES_TAG_LABELS,
  createLibertiesBoard,
  formatLibertiesShareText,
  getBestLibertiesHintMove,
  getDailyLibertiesEntry,
  getLibertiesBlockerRange,
  getLibertiesPackAudit,
  getLibertiesPuzzleAudit,
  getLibertiesGroupAt,
  getLowestLibertiesMoveCount,
  isLibertiesSolved,
  libertiesPreviewPuzzles,
  libertiesReservePuzzles,
  libertiesPuzzles,
  playLibertiesMove,
  pointKey,
  replayLibertiesMoves,
} from './libertiesPuzzles';

describe('liberties puzzle engine', () => {
  it('clears adjacent light groups after their last empty neighbor is filled', () => {
    const puzzle = {
      id: 'test-last-open-side',
      title: 'Test Last Open Side',
      difficulty: 'Easy' as const,
      size: 3,
      targetMoves: 1,
      targetSeconds: 120,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['XXX', 'XWX', 'X.X'],
      solution: [{ row: 2, col: 1 }],
      releaseLinks: [],
      lightGroups: [[{ row: 1, col: 1 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const result = playLibertiesMove(board, puzzle.size, { row: 2, col: 1 });

    expect(result.legal).toBe(true);
    if (!result.legal) return;
    expect(result.captured).toHaveLength(1);
    expect(isLibertiesSolved(puzzle, result.board)).toBe(true);
  });

  it('clears every enclosed light shape before applying a stretch', () => {
    const puzzle = {
      id: 'test-global-clear',
      title: 'Test Global Clear',
      difficulty: 'Easy' as const,
      size: 5,
      targetMoves: 1,
      targetSeconds: 120,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['XXX..', 'XWX..', 'XXX..', '.....', '.....'],
      solution: [{ row: 4, col: 4 }],
      releaseLinks: [],
      lightGroups: [[{ row: 1, col: 1 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const result = playLibertiesMove(board, puzzle.size, { row: 4, col: 4 }, 'black', puzzle);

    expect(result.legal).toBe(true);
    if (!result.legal) return;
    expect(result.captured).toHaveLength(1);
    expect(result.responses).toHaveLength(0);
    expect(isLibertiesSolved(puzzle, result.board)).toBe(true);
  });

  it('clears a light shape immediately when its own stretch fills its last open side', () => {
    const puzzle = {
      id: 'test-response-self-clear',
      title: 'Test Response Self Clear',
      difficulty: 'Easy' as const,
      size: 5,
      targetMoves: 1,
      targetSeconds: 120,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['XXX..', 'XW.X.', 'XXX..', '.....', '.....'],
      solution: [{ row: 4, col: 4 }],
      releaseLinks: [],
      lightGroups: [[{ row: 1, col: 1 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const result = playLibertiesMove(board, puzzle.size, { row: 4, col: 4 }, 'black', puzzle);

    expect(result.legal).toBe(true);
    if (!result.legal) return;
    expect(result.responses).toEqual([{ row: 1, col: 2 }]);
    expect(result.captured).toHaveLength(2);
    expect(isLibertiesSolved(puzzle, result.board)).toBe(true);
  });

  it('treats locked points as closed directions and unavailable placements', () => {
    const puzzle = libertiesPuzzles.find((entry) => entry.id.includes('liberties-frozen-lanes'))!;
    const board = createLibertiesBoard(puzzle);
    const frozenPoint = board.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) => ({ cell, point: { row: rowIndex, col: colIndex } }))
    ).find(({ cell }) => cell === 'frozen')?.point;

    expect(frozenPoint).toBeDefined();
    const result = playLibertiesMove(board, puzzle.size, frozenPoint!);

    expect(board[frozenPoint!.row]?.[frozenPoint!.col]).toBe('frozen');
    expect(result.legal).toBe(false);
    if (result.legal) return;
    expect(result.reason).toBe('occupied');
  });

  it('rejects stranded dark pebbles that do not clear anything', () => {
    const puzzle = {
      id: 'test-suicide',
      title: 'Test Suicide',
      difficulty: 'Easy' as const,
      size: 3,
      targetMoves: 0,
      targetSeconds: 120,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['BBB', 'B.B', 'BBB'],
      solution: [],
      releaseLinks: [],
      lightGroups: [],
    };
    const board = createLibertiesBoard(puzzle);
    const result = playLibertiesMove(board, puzzle.size, { row: 1, col: 1 });

    expect(result.legal).toBe(false);
    if (result.legal) return;
    expect(result.reason).toBe('suicide');
  });

  it('lets urgent light groups stretch when they are left with one open side', () => {
    const puzzle = {
      id: 'test-capture-race',
      title: 'Test Capture Race',
      difficulty: 'Standard' as const,
      size: 3,
      targetMoves: 2,
      targetSeconds: 300,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['XXX', 'XW.', 'X..'],
      solution: [{ row: 2, col: 1 }, { row: 2, col: 2 }],
      releaseLinks: [],
      lightGroups: [[{ row: 1, col: 1 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const quietMove = playLibertiesMove(board, puzzle.size, { row: 2, col: 1 }, 'black', puzzle);

    expect(quietMove.legal).toBe(true);
    if (!quietMove.legal) return;
    expect(quietMove.responses).toEqual([{ row: 1, col: 2 }]);
    expect(quietMove.board[1]?.[2]).toBe('white');

    const clearMove = playLibertiesMove(quietMove.board, puzzle.size, { row: 2, col: 2 }, 'black', puzzle);
    expect(clearMove.legal).toBe(true);
    if (!clearMove.legal) return;
    expect(clearMove.captured).toHaveLength(2);
  });

  it('chooses the longest straight open lane for a quiet light stretch', () => {
    const puzzle = {
      id: 'test-longest-lane',
      title: 'Test Longest Lane',
      difficulty: 'Standard' as const,
      size: 5,
      targetMoves: 4,
      targetSeconds: 300,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['.....', '..X..', 'X.W..', '..X..', '.....'],
      solution: [],
      releaseLinks: [],
      lightGroups: [[{ row: 2, col: 2 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const quietMove = playLibertiesMove(board, puzzle.size, { row: 0, col: 0 }, 'black', puzzle);

    expect(quietMove.legal).toBe(true);
    if (!quietMove.legal) return;
    expect(quietMove.responses).toEqual([{ row: 2, col: 3 }]);
    expect(quietMove.board[2]?.[3]).toBe('white');
  });

  it('allows extra dark pebbles beyond the internal target move count', () => {
    const puzzle = libertiesPuzzles[0]!;
    const board = createLibertiesBoard(puzzle);
    const openPoint = board
      .flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => ({ cell, point: { row: rowIndex, col: colIndex } }))
      )
      .find(({ cell }) => cell === null)?.point;

    expect(openPoint).toBeDefined();
    expect(playLibertiesMove(board, puzzle.size, openPoint!, 'black', puzzle).legal).toBe(true);
  });

  it('keeps side-touching light pebbles in one group with shared empty neighbors', () => {
    const puzzle = {
      id: 'test-side-touching-group',
      title: 'Test Side Group',
      difficulty: 'Easy' as const,
      size: 4,
      targetMoves: 4,
      targetSeconds: 120,
      variant: 'chase' as const,
      motif: 'Test fixture',
      focusTags: [],
      layout: ['....', '.WW.', '....', '....'],
      solution: [],
      releaseLinks: [],
      lightGroups: [[{ row: 1, col: 1 }, { row: 1, col: 2 }]],
    };
    const board = createLibertiesBoard(puzzle);
    const group = getLibertiesGroupAt(board, puzzle.size, { row: 1, col: 1 });

    expect(group?.stones).toHaveLength(2);
    expect(group?.liberties.size).toBe(6);
  });

  it('ships a full 365-day pack with legal clean-light solutions', () => {
    expect(libertiesPuzzles).toHaveLength(365);
    expect(libertiesReservePuzzles).toHaveLength(35);
    expect(libertiesPreviewPuzzles).toHaveLength(400);
    expect(new Set(libertiesPuzzles.map((puzzle) => puzzle.id)).size).toBe(libertiesPuzzles.length);
    expect(new Set(libertiesPuzzles.map((puzzle) => puzzle.layout.join('/'))).size).toBe(libertiesPuzzles.length);
    expect(new Set(libertiesPreviewPuzzles.map((puzzle) => puzzle.id)).size).toBe(libertiesPreviewPuzzles.length);
    expect(new Set(libertiesPreviewPuzzles.map((puzzle) => puzzle.layout.join('/'))).size).toBe(
      libertiesPreviewPuzzles.length
    );

    libertiesPreviewPuzzles.forEach((puzzle) => {
      const replay = replayLibertiesMoves(puzzle, puzzle.solution);
      const audit = getLibertiesPuzzleAudit(puzzle);
      const [minBlockers, maxBlockers] = getLibertiesBlockerRange(puzzle.difficulty);
      expect(replay.illegalMoveIndex, puzzle.id).toBeNull();
      expect(puzzle.solution, puzzle.id).toHaveLength(puzzle.targetMoves);
      expect(puzzle.targetSeconds, puzzle.id).toBeGreaterThan(0);
      expect(audit.blockerCount, puzzle.id).toBeGreaterThanOrEqual(minBlockers);
      expect(audit.blockerCount, puzzle.id).toBeLessThanOrEqual(maxBlockers);
      expect(audit.releasePebbleCount, puzzle.id).toBe(0);
      expect(isLibertiesSolved(puzzle, replay.board), puzzle.id).toBe(true);
    });
  });

  it('audits non-easy puzzles for depth beyond pure opening-side filling', () => {
    const sharedSidePuzzles = libertiesPuzzles.filter(
      (puzzle) => getLibertiesPuzzleAudit(puzzle).sharedOpenSideCount > 0
    );

    expect(sharedSidePuzzles.length).toBeGreaterThanOrEqual(8);

    libertiesPreviewPuzzles
      .filter((puzzle) => puzzle.difficulty !== 'Easy')
      .forEach((puzzle) => {
        const audit = getLibertiesPuzzleAudit(puzzle);
        const reversedReplay = replayLibertiesMoves(puzzle, [...puzzle.solution].reverse());
        expect(audit.groupCount, puzzle.id).toBeGreaterThanOrEqual(3);
        expect(audit.solutionCaptureMoves, puzzle.id).toBeGreaterThanOrEqual(2);
        expect(audit.releasePebbleCount, puzzle.id).toBe(0);
        expect(audit.captureOrderDependencyScore, puzzle.id).toBeGreaterThanOrEqual(4);
        expect(audit.fillerMoveRatio, puzzle.id).toBeLessThan(0.25);
        expect(audit.isPureOpeningFill, puzzle.id).toBe(false);
        if (puzzle.variant === 'chase') {
          expect(audit.responseEventCount, puzzle.id).toBeGreaterThanOrEqual(1);
          expect(audit.dynamicMoveCount, puzzle.id).toBeGreaterThanOrEqual(1);
          expect(reversedReplay.illegalMoveIndex, puzzle.id).not.toBeNull();
        }
      });
  });

  it('audits the 365-day pack for varied puzzle families', () => {
    const audit = getLibertiesPackAudit();

    expect(audit.puzzleCount).toBe(365);
    expect(audit.difficultyCounts.Easy).toBeGreaterThanOrEqual(40);
    expect(audit.difficultyCounts.Standard).toBeGreaterThanOrEqual(220);
    expect(audit.difficultyCounts.Hard).toBeGreaterThanOrEqual(75);
    expect(audit.minTargetMoves).toBeGreaterThanOrEqual(8);
    expect(audit.maxTargetMoves).toBeGreaterThanOrEqual(24);
    expect(audit.averageTargetMoves).toBeGreaterThan(14);
    expect(audit.standardMedianTargetSeconds).toBeGreaterThanOrEqual(240);
    expect(audit.standardMedianTargetSeconds).toBeLessThanOrEqual(420);
    expect(audit.averageBlockerCount).toBeGreaterThanOrEqual(5);
    expect(audit.averageBlockerImpactScore).toBeGreaterThanOrEqual(20);
    expect(audit.averageSmallBoardDensityScore).toBeGreaterThanOrEqual(28);
    expect(audit.terrainArchetypeCounts['tight-room']).toBeGreaterThan(40);
    expect(audit.terrainArchetypeCounts['soft-net']).toBeGreaterThan(40);
    expect(audit.pureOpeningFillCount).toBe(0);
    expect(audit.releasePebbleCount).toBe(0);
    expect(audit.responseEventCount).toBeGreaterThanOrEqual(200);
    expect(audit.dynamicMoveCount).toBeGreaterThanOrEqual(200);
    expect(audit.delayedMoveCount).toBeGreaterThanOrEqual(500);
    expect(audit.maxUnlockDepth).toBeGreaterThanOrEqual(3);
    expect(audit.averageFillerMoveRatio).toBeLessThan(0.25);

    (Object.keys(LIBERTIES_TAG_LABELS) as Array<keyof typeof LIBERTIES_TAG_LABELS>).forEach((tag) => {
      expect(audit.tagCounts[tag], tag).toBeGreaterThan(tag === 'response-pressure' ? 25 : 40);
    });
  });

  it('keeps generated board sizes skewed smaller with reserve boards outside daily rotation', () => {
    const publicSizeCounts = libertiesPuzzles.reduce<Record<number, number>>((counts, puzzle) => {
      counts[puzzle.size] = (counts[puzzle.size] ?? 0) + 1;
      return counts;
    }, {});
    const firstSixtyMix = libertiesPuzzles.slice(0, 60).reduce<Record<string, number>>((counts, puzzle) => {
      counts[puzzle.difficulty] = (counts[puzzle.difficulty] ?? 0) + 1;
      return counts;
    }, {});
    const difficultyTransitions = libertiesPuzzles
      .slice(1)
      .reduce(
        (count, puzzle, index) => count + (puzzle.difficulty !== libertiesPuzzles[index]!.difficulty ? 1 : 0),
        0
      );
    const reserveIds = new Set(libertiesReservePuzzles.map((puzzle) => puzzle.id));
    const firstDaily = getDailyLibertiesEntry(new Date('2026-05-18T12:00:00.000Z'));

    expect(publicSizeCounts[7]).toBe(28);
    expect(publicSizeCounts[8]).toBe(127);
    expect(publicSizeCounts[9]).toBe(198);
    expect(publicSizeCounts[10]).toBe(12);
    expect(difficultyTransitions).toBeGreaterThanOrEqual(220);
    expect(firstSixtyMix.Easy).toBeGreaterThanOrEqual(6);
    expect(firstSixtyMix.Standard).toBeGreaterThanOrEqual(35);
    expect(firstSixtyMix.Hard).toBeGreaterThanOrEqual(10);
    expect(reserveIds.has(firstDaily.puzzle.id)).toBe(false);
    expect(libertiesReservePuzzles.every((puzzle) => typeof puzzle.reserveRank === 'number')).toBe(true);
  });

  it('recalculates hints from off-path boards', () => {
    const puzzle = libertiesPuzzles.find((entry) => entry.id === 'liberties-clock-square')!;
    const board = createLibertiesBoard(puzzle);
    const deviation = { row: 0, col: 0 };
    const deviated = playLibertiesMove(board, puzzle.size, deviation, 'black', puzzle);

    expect(deviated.legal).toBe(true);
    if (!deviated.legal) return;

    const oldPathHint = puzzle.solution.find((point) => deviated.board[point.row]?.[point.col] === null);
    const liveHint = getBestLibertiesHintMove(puzzle, deviated.board);

    expect(oldPathHint).toEqual({ row: 6, col: 5 });
    expect(liveHint?.point).toEqual({ row: 1, col: 1 });
    expect(liveHint?.point).not.toEqual(oldPathHint);
    expect(liveHint?.movesToSolve).toBe(14);
  });

  it('solves legally when every move after a deviation follows live hints', () => {
    const puzzle = libertiesPuzzles.find((entry) => entry.id === 'liberties-clock-square')!;
    let board = createLibertiesBoard(puzzle);
    const moves = [{ row: 0, col: 0 }];
    const firstMove = playLibertiesMove(board, puzzle.size, moves[0]!, 'black', puzzle);

    expect(firstMove.legal).toBe(true);
    if (!firstMove.legal) return;
    board = firstMove.board;

    while (!isLibertiesSolved(puzzle, board) && moves.length < 60) {
      const hint = getBestLibertiesHintMove(puzzle, board);
      expect(hint).not.toBeNull();
      if (!hint) break;
      const result = playLibertiesMove(board, puzzle.size, hint.point, 'black', puzzle);
      expect(result.legal).toBe(true);
      if (!result.legal) break;
      board = result.board;
      moves.push(hint.point);
    }

    expect(moves.map(pointKey).slice(0, 2)).toEqual(['0:0', '1:1']);
    expect(moves.length).toBeLessThanOrEqual(15);
    expect(isLibertiesSolved(puzzle, board)).toBe(true);
  });

  it('does not treat the generated route as the best hint route for today', () => {
    const entry = getDailyLibertiesEntry(new Date('2026-05-21T12:00:00.000Z'));
    const board = createLibertiesBoard(entry.puzzle);
    const hint = getBestLibertiesHintMove(entry.puzzle, board);

    expect(entry.puzzle.targetMoves).toBe(25);
    expect(hint?.movesToSolve).toBeLessThanOrEqual(15);
    expect(hint?.movesToSolve).toBeLessThan(entry.puzzle.targetMoves);
  });

  it('exposes the day move floor from the move-optimized route', () => {
    const entry = getDailyLibertiesEntry(new Date('2026-05-21T12:00:00.000Z'));

    expect(getLowestLibertiesMoveCount(entry.puzzle)).toBeLessThanOrEqual(15);
    expect(getLowestLibertiesMoveCount(entry.puzzle)).toBeLessThan(entry.puzzle.targetMoves);
  });

  it('solves today at the displayed move floor when every move follows hints', () => {
    const entry = getDailyLibertiesEntry(new Date('2026-05-21T12:00:00.000Z'));
    let board = createLibertiesBoard(entry.puzzle);
    let hintMoveCount = 0;

    while (!isLibertiesSolved(entry.puzzle, board) && hintMoveCount < 40) {
      const hint = getBestLibertiesHintMove(entry.puzzle, board);
      expect(hint).not.toBeNull();
      if (!hint) break;
      const result = playLibertiesMove(board, entry.puzzle.size, hint.point, 'black', entry.puzzle);
      expect(result.legal).toBe(true);
      if (!result.legal) break;
      board = result.board;
      hintMoveCount += 1;
    }

    expect(isLibertiesSolved(entry.puzzle, board)).toBe(true);
    expect(hintMoveCount).toBe(getLowestLibertiesMoveCount(entry.puzzle));
  });

  it('selects a dated daily puzzle', () => {
    const entry = getDailyLibertiesEntry(new Date('2026-05-18T12:00:00.000Z'));

    expect(entry.date).toBe('2026-05-18');
    expect(entry.puzzle.id).toBe('liberties-clock-square');
    expect(entry.puzzle.difficulty).toBe('Standard');
  });

  it('formats share text without exposing the internal clean light', () => {
    expect(
      formatLibertiesShareText({
        date: '2026-05-18',
        moves: 9,
        elapsedSeconds: 292,
        hintsUsed: 0,
        url: 'https://example.test/liberties',
      })
    ).toBe('Liberties ⚪⚫ 2026-05-18\n9 moves · 4:52 · no hints\nhttps://example.test/liberties');
  });
});
