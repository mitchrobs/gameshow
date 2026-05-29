import { describe, expect, it } from 'vitest';
import { postmarkPack } from './postmarkPack.generated';
import {
  POSTMARK_DIFFICULTY_TOTALS,
  POSTMARK_PACK_LENGTH,
  POSTMARK_PACK_START_DATE,
  POSTMARK_SIZE_TOTALS,
  type PostmarkDifficulty,
} from './postmarkMetadata';
import {
  analyzePostmarkPuzzleQuality,
  countPostmarkSolutions,
  countRouteTurns,
  getDailyPostmarkPackEntry,
  getPostmarkDayNumber,
  getPostmarkPackMetadata,
  validatePostmarkRoutes,
  validatePostmarkSolution,
  type PostmarkPuzzle,
  type PostmarkRouteState,
} from './postmarkPuzzles';

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function makeRouteState(puzzle: PostmarkPuzzle): PostmarkRouteState {
  return Object.fromEntries(
    puzzle.solution.map((route) => [route.startId, route.cells.map((cell) => ({ ...cell }))])
  ) as PostmarkRouteState;
}

function makeValidationPuzzle(): PostmarkPuzzle {
  return {
    id: 'postmark-validation-fixture',
    difficulty: 'Easy',
    size: 5,
    starts: [
      {
        id: 's0',
        side: 'top',
        index: 2,
        entry: { row: 0, col: 2 },
        length: 3,
      },
      {
        id: 's1',
        side: 'left',
        index: 2,
        entry: { row: 2, col: 0 },
        length: 3,
      },
      {
        id: 's2',
        side: 'bottom',
        index: 4,
        entry: { row: 4, col: 4 },
        length: 5,
      },
    ],
    posts: [
      { id: 'p0', row: 2, col: 2, capacity: 2 },
      { id: 'p1', row: 0, col: 4, capacity: 1 },
    ],
    solution: [
      {
        startId: 's0',
        postId: 'p0',
        cells: [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
        ],
      },
      {
        startId: 's1',
        postId: 'p0',
        cells: [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
        ],
      },
      {
        startId: 's2',
        postId: 'p1',
        cells: [
          { row: 4, col: 4 },
          { row: 3, col: 4 },
          { row: 2, col: 4 },
          { row: 1, col: 4 },
          { row: 0, col: 4 },
        ],
      },
    ],
  };
}

describe('Postmark route validation', () => {
  it('accepts solved routes, a capacity-2 post, and unused board cells', () => {
    const puzzle = makeValidationPuzzle();
    const result = validatePostmarkRoutes(puzzle, makeRouteState(puzzle));

    expect(result.solved).toBe(true);
    expect(result.completedRouteCount).toBe(3);
    expect(result.satisfiedPostCount).toBe(2);
    expect(result.usedTileCount).toBeLessThan(result.totalTileCount);
  });

  it('rejects off-by-one route lengths', () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    state.s0 = state.s0!.slice(0, -1);

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'Route 3 needs exactly 3 tiles.'
    );
  });

  it('rejects routes that do not end on a post', () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    state.s0 = [
      { row: 0, col: 2 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ];

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'Route 3 must end on a hollow post.'
    );
  });

  it('rejects overlapping routes', () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    state.s1 = [
      { row: 2, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'Routes cannot overlap or share tiles.'
    );
  });

  it('rejects under-capacity posts', () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    delete state.s1;

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'A hollow post needs 2 routes and has 1.'
    );
  });

  it('rejects over-capacity posts', () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    state.s2 = [
      { row: 4, col: 4 },
      { row: 4, col: 3 },
      { row: 3, col: 3 },
      { row: 2, col: 3 },
      { row: 2, col: 2 },
    ];

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'A hollow post can only take 2 routes.'
    );
  });

  it('rejects routes that pass through posts before ending', () => {
    const puzzle: PostmarkPuzzle = {
      ...makeValidationPuzzle(),
      posts: [
        ...makeValidationPuzzle().posts,
        { id: 'p2', row: 2, col: 4, capacity: 1 },
      ],
    };
    const state = makeRouteState(makeValidationPuzzle());

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      'Route 5 can only use a post as its final tile.'
    );
  });

  it("rejects routes that use another route's entry tile", () => {
    const puzzle = makeValidationPuzzle();
    const state = makeRouteState(puzzle);
    state.s1 = [
      { row: 2, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];

    expect(validatePostmarkRoutes(puzzle, state).errors).toContain(
      "Route 3 cannot pass through another route's entry tile."
    );
  });
});

describe('Postmark 500-day pack', () => {
  it('ships exactly 500 continuous UTC dates from the Gameshow logic start', () => {
    expect(postmarkPack).toHaveLength(POSTMARK_PACK_LENGTH);
    expect(getPostmarkPackMetadata().startDate).toBe(POSTMARK_PACK_START_DATE);
    expect(postmarkPack[0]?.date).toBe('2026-04-24');
    expect(postmarkPack[499]?.date).toBe('2027-09-05');

    postmarkPack.forEach((entry, index) => {
      expect(entry.date).toBe(addUtcDays(POSTMARK_PACK_START_DATE, index));
      expect(entry.dayNumber).toBe(index + 1);
    });
  });

  it('keeps Postmark #36 on May 29, 2026', () => {
    const entry = getDailyPostmarkPackEntry(new Date('2026-05-29T12:00:00.000Z'));

    expect(entry.date).toBe('2026-05-29');
    expect(entry.dayNumber).toBe(36);
    expect(getPostmarkDayNumber('2026-05-29')).toBe(36);
    expect(entry.difficulty).toBe('Medium');
    expect(entry.size).toBe(7);
    expect(entry.doublePostCount).toBeGreaterThanOrEqual(1);
    expect(entry.quality.longestRouteLength).toBeGreaterThanOrEqual(10);
    expect(entry.quality.totalTurns).toBeGreaterThanOrEqual(12);
    expect(entry.quality.usedTileRatio).toBeGreaterThanOrEqual(0.8);
    expect(entry.quality.straightRouteCount).toBe(0);
    expect(entry.quality.routeAdjacencyScore).toBeGreaterThanOrEqual(5);
  });

  it('matches the harder-gentle difficulty and board-size targets', () => {
    const difficulties: Record<PostmarkDifficulty, number> = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };
    const sizes: Record<5 | 6 | 7, number> = {
      5: 0,
      6: 0,
      7: 0,
    };

    postmarkPack.forEach((entry) => {
      difficulties[entry.difficulty] += 1;
      sizes[entry.size] += 1;
    });

    expect(difficulties).toEqual(POSTMARK_DIFFICULTY_TOTALS);
    expect(sizes).toEqual(POSTMARK_SIZE_TOTALS);
  });

  it('keeps every shipped puzzle valid, uniquely solvable, and structurally useful', () => {
    const signatures = new Set<string>();
    let easyDoublePosts = 0;
    let mediumDoublePosts = 0;
    let hardDoublePosts = 0;
    let hardLongTenDays = 0;
    let hardLongTwelveDays = 0;
    const sevenDays: number[] = [];

    postmarkPack.forEach((entry) => {
      expect(signatures.has(entry.signature)).toBe(false);
      signatures.add(entry.signature);

      const validation = validatePostmarkSolution(entry.puzzle);
      expect(validation.solved).toBe(true);
      expect(validation.usedTileCount).toBe(entry.usedTileCount);
      expect(validation.usedTileCount).toBeLessThanOrEqual(entry.size * entry.size);
      expect(validation.satisfiedPostCount).toBe(entry.postCount);

      expect(entry.puzzle.posts).toHaveLength(entry.postCount);
      expect(entry.puzzle.posts.filter((post) => post.capacity === 2)).toHaveLength(
        entry.doublePostCount
      );
      expect(entry.puzzle.posts.reduce((sum, post) => sum + post.capacity, 0)).toBe(
        entry.routeCount
      );

      if (entry.difficulty === 'Easy') easyDoublePosts += entry.doublePostCount;
      if (entry.difficulty === 'Medium') mediumDoublePosts += entry.doublePostCount;
      if (entry.difficulty === 'Hard') hardDoublePosts += entry.doublePostCount;
      if (entry.difficulty === 'Hard' && entry.quality.longestRouteLength >= 10) {
        hardLongTenDays += 1;
      }
      if (entry.difficulty === 'Hard' && entry.quality.longestRouteLength >= 12) {
        hardLongTwelveDays += 1;
      }
      if (entry.size === 7) sevenDays.push(entry.dayNumber);

      const startKeys = new Set(
        entry.puzzle.starts.map((start) => `${start.entry.row}:${start.entry.col}`)
      );
      const postKeys = new Set(entry.puzzle.posts.map((post) => `${post.row}:${post.col}`));
      entry.puzzle.starts.forEach((start) => {
        expect(start.index).toBeGreaterThanOrEqual(0);
        expect(start.index).toBeLessThan(entry.size);
        if (start.side === 'left') {
          expect(start.entry.col).toBe(0);
          expect(start.index).toBe(start.entry.row);
        } else if (start.side === 'right') {
          expect(start.entry.col).toBe(entry.size - 1);
          expect(start.index).toBe(start.entry.row);
        } else if (start.side === 'top') {
          expect(start.entry.row).toBe(0);
          expect(start.index).toBe(start.entry.col);
        } else {
          expect(start.entry.row).toBe(entry.size - 1);
          expect(start.index).toBe(start.entry.col);
        }
      });
      entry.puzzle.posts.forEach((post) => {
        expect(post.capacity === 1 || post.capacity === 2).toBe(true);
        expect(startKeys.has(`${post.row}:${post.col}`)).toBe(false);
      });
      expect(postKeys.size).toBe(entry.puzzle.posts.length);
      expect('stepMarks' in entry.puzzle).toBe(false);
      expect('blockedCells' in entry.puzzle).toBe(false);

      expect(entry.puzzle.starts.every((start) => start.length <= 12)).toBe(true);
      expect(entry.quality.totalTurns).toBeGreaterThan(0);
      expect(entry.quality.straightRouteCount).toBeLessThan(entry.routeCount);
      expect(entry.quality.endpointAmbiguityScore).toBeGreaterThan(0);
      expect(entry.quality.routeAdjacencyScore).toBeGreaterThan(0);
      expect(entry.puzzle.solution.reduce((sum, route) => sum + countRouteTurns(route.cells), 0)).toBe(
        entry.quality.totalTurns
      );
      if (entry.difficulty === 'Easy') {
        expect(entry.size).not.toBe(7);
        expect(entry.quality.usedTileRatio).toBeGreaterThanOrEqual(0.52);
        expect(entry.quality.totalTurns).toBeGreaterThanOrEqual(5);
        expect(entry.quality.straightRouteCount).toBeLessThanOrEqual(1);
      } else {
        expect(entry.quality.longestRouteLength).toBeGreaterThan(7);
      }
      if (entry.difficulty === 'Medium') {
        expect(entry.quality.usedTileRatio).toBeGreaterThanOrEqual(0.68);
        expect(entry.quality.straightRouteCount).toBeLessThanOrEqual(1);
        expect(entry.quality.endpointAmbiguityScore).toBeGreaterThanOrEqual(2);
      }
      if (entry.difficulty === 'Hard') {
        expect(entry.quality.usedTileRatio).toBeGreaterThanOrEqual(0.78);
        expect(entry.quality.straightRouteCount).toBe(0);
        expect(entry.quality.longestRouteLength).toBeGreaterThanOrEqual(
          entry.size === 5 ? 9 : 10
        );
        expect(entry.quality.endpointAmbiguityScore).toBeGreaterThanOrEqual(3);
      }
      if (entry.size === 7) {
        expect(entry.difficulty).not.toBe('Easy');
        expect(entry.quality.usedTileRatio).toBeGreaterThanOrEqual(0.8);
        expect(entry.quality.longestRouteLength).toBeGreaterThanOrEqual(10);
        expect(entry.quality.totalTurns).toBeGreaterThanOrEqual(12);
      }

      expect(countPostmarkSolutions(entry.puzzle, 2).solutionCount).toBe(1);
    });

    expect(easyDoublePosts).toBeGreaterThanOrEqual(8);
    expect(mediumDoublePosts).toBeGreaterThanOrEqual(220);
    expect(hardDoublePosts).toBeGreaterThanOrEqual(85);
    expect(hardLongTenDays).toBeGreaterThanOrEqual(100);
    expect(hardLongTwelveDays).toBeGreaterThanOrEqual(30);
    expect(sevenDays).toContain(36);
    expect(Math.min(...sevenDays)).toBe(36);
    sevenDays.slice(1).forEach((day, index) => {
      expect(day - sevenDays[index]!).toBeGreaterThanOrEqual(15);
    });

    const day36 = postmarkPack[35]!;
    expect(analyzePostmarkPuzzleQuality(day36.puzzle)).toEqual(day36.quality);
  });

  it('returns deterministic fallback puzzles outside the shipped window', () => {
    const first = getDailyPostmarkPackEntry(new Date('2028-01-01T08:00:00.000Z'));
    const second = getDailyPostmarkPackEntry(new Date('2028-01-01T21:00:00.000Z'));

    expect(first.source).toBe('fallback');
    expect(second.source).toBe('fallback');
    expect(first.signature).toBe(second.signature);
    expect(validatePostmarkSolution(first.puzzle).solved).toBe(true);
    expect(countPostmarkSolutions(first.puzzle, 2).solutionCount).toBe(1);
  });
});
