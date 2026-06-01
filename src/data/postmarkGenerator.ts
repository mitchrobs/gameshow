import {
  POSTMARK_DIFFICULTY_TOTALS,
  POSTMARK_PACK_LENGTH,
  POSTMARK_PACK_START_DATE,
  POSTMARK_ROUTE_TARGETS,
  POSTMARK_SIZE_TOTALS,
  type PostmarkDifficulty,
} from './postmarkMetadata';

export interface PostmarkCoord {
  row: number;
  col: number;
}

export type PostmarkStartSide = 'top' | 'right' | 'bottom' | 'left';

export interface PostmarkStart {
  id: string;
  length: number;
  side: PostmarkStartSide;
  index: number;
  entry: PostmarkCoord;
}

export interface PostmarkPost extends PostmarkCoord {
  id: string;
  capacity: 1 | 2;
}

export interface PostmarkRoute {
  startId: string;
  postId: string;
  cells: PostmarkCoord[];
}

export interface PostmarkPuzzle {
  id: string;
  difficulty: PostmarkDifficulty;
  size: 5 | 6 | 7;
  starts: PostmarkStart[];
  posts: PostmarkPost[];
  solution: PostmarkRoute[];
}

export interface PostmarkPackEntry {
  date: string;
  dayNumber: number;
  difficulty: PostmarkDifficulty;
  size: 5 | 6 | 7;
  routeCount: number;
  postCount: number;
  doublePostCount: number;
  usedTileCount: number;
  difficultyScore: number;
  quality: PostmarkQualityMetadata;
  signature: string;
  source: 'pack' | 'fallback';
  puzzle: PostmarkPuzzle;
}

export type PostmarkRouteState = Record<string, PostmarkCoord[]>;

export interface PostmarkValidationResult {
  solved: boolean;
  errors: string[];
  firstError: string | null;
  usedTileCount: number;
  totalTileCount: number;
  completedRouteCount: number;
  satisfiedPostCount: number;
}

export interface PostmarkSolveResult {
  solutionCount: number;
  solution: PostmarkRoute[] | null;
}

export interface PostmarkQualityMetadata {
  totalTurns: number;
  straightRouteCount: number;
  longestRouteLength: number;
  usedTileRatio: number;
  endpointAmbiguityScore: number;
  candidateBranchingScore: number;
  routeAdjacencyScore: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MAX_GENERATION_ATTEMPTS = 5000;
const MAX_POST_ATTEMPTS = 120;
const MAX_PATH_CANDIDATES = 120;

type RouteDraft = {
  postIndex: number;
  cells: PostmarkCoord[];
};

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateKeyToOrdinal(dateKey: string): number {
  return Math.floor(Date.parse(`${dateKey}T00:00:00.000Z`) / MS_PER_DAY);
}

export function getPostmarkDayNumber(dateKey: string): number {
  const offset = dateKeyToOrdinal(dateKey) - dateKeyToOrdinal(POSTMARK_PACK_START_DATE);
  return ((offset % POSTMARK_PACK_LENGTH) + POSTMARK_PACK_LENGTH) % POSTMARK_PACK_LENGTH + 1;
}

export function coordKey(coord: PostmarkCoord): string {
  return `${coord.row}:${coord.col}`;
}

export function coordsEqual(a: PostmarkCoord, b: PostmarkCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

export function areOrthogonalNeighbors(a: PostmarkCoord, b: PostmarkCoord): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

function buildRouteStateFromSolution(puzzle: PostmarkPuzzle): PostmarkRouteState {
  return Object.fromEntries(
    puzzle.solution.map((route) => [route.startId, route.cells])
  ) as PostmarkRouteState;
}

function getCoordInBounds(coord: PostmarkCoord, size: number): boolean {
  return coord.row >= 0 && coord.row < size && coord.col >= 0 && coord.col < size;
}

function getCoordIsEdge(coord: PostmarkCoord, size: number): boolean {
  return coord.row === 0 || coord.col === 0 || coord.row === size - 1 || coord.col === size - 1;
}

function getDistanceToEdge(coord: PostmarkCoord, size: number): number {
  return Math.min(coord.row, coord.col, size - 1 - coord.row, size - 1 - coord.col);
}

function getNeighbors(coord: PostmarkCoord, size: number): PostmarkCoord[] {
  return [
    { row: coord.row - 1, col: coord.col },
    { row: coord.row + 1, col: coord.col },
    { row: coord.row, col: coord.col - 1 },
    { row: coord.row, col: coord.col + 1 },
  ].filter((candidate) => getCoordInBounds(candidate, size));
}

function makeErrorResult(
  errors: string[],
  usedTileCount: number,
  totalTileCount: number,
  completedRouteCount: number,
  satisfiedPostCount: number
): PostmarkValidationResult {
  return {
    solved: errors.length === 0,
    errors,
    firstError: errors[0] ?? null,
    usedTileCount,
    totalTileCount,
    completedRouteCount,
    satisfiedPostCount,
  };
}

function pluralRoutes(count: number): string {
  return count === 1 ? 'route' : 'routes';
}

export function validatePostmarkRoutes(
  puzzle: PostmarkPuzzle,
  routeState: PostmarkRouteState
): PostmarkValidationResult {
  const errors: string[] = [];
  const totalTileCount = puzzle.size * puzzle.size;
  const entryKeyToId = new Map(puzzle.starts.map((start) => [coordKey(start.entry), start.id]));
  const postByKey = new Map(puzzle.posts.map((post) => [coordKey(post), post]));
  const postById = new Map(puzzle.posts.map((post) => [post.id, post]));
  const occupied = new Map<string, string>();
  const postUsage = new Map<string, number>();
  let completedRouteCount = 0;

  puzzle.starts.forEach((start) => {
    const route = routeState[start.id] ?? [];
    const routeLabel = `Route ${start.length}`;
    const routeSeen = new Set<string>();

    if (route.length === 0) {
      errors.push(`${routeLabel} has not been started.`);
      return;
    }

    if (!coordsEqual(route[0], start.entry)) {
      errors.push(`${routeLabel} must enter from its numbered edge start.`);
    }

    if (route.length !== start.length) {
      errors.push(`${routeLabel} needs exactly ${start.length} tiles.`);
    }

    route.forEach((coord, index) => {
      const key = coordKey(coord);
      const isFinalTile = index === route.length - 1;
      const post = postByKey.get(key);

      if (!getCoordInBounds(coord, puzzle.size)) {
        errors.push(`${routeLabel} leaves the board.`);
      }

      if (index > 0 && !areOrthogonalNeighbors(route[index - 1]!, coord)) {
        errors.push(`${routeLabel} must move orthogonally.`);
      }

      if (routeSeen.has(key)) {
        errors.push('Routes cannot overlap or share tiles.');
      }
      routeSeen.add(key);

      const otherStartId = entryKeyToId.get(key);
      if (otherStartId && otherStartId !== start.id) {
        errors.push(`${routeLabel} cannot pass through another route's entry tile.`);
      }

      if (post && !isFinalTile) {
        errors.push(`${routeLabel} can only use a post as its final tile.`);
      }

      if (!post || !isFinalTile) {
        const occupyingStartId = occupied.get(key);
        if (occupyingStartId && occupyingStartId !== start.id) {
          errors.push('Routes cannot overlap or share tiles.');
        } else {
          occupied.set(key, start.id);
        }
      }
    });

    const end = route[route.length - 1];
    const endPost = end ? postByKey.get(coordKey(end)) : undefined;
    if (!endPost) {
      errors.push(`${routeLabel} must end on a hollow post.`);
    } else {
      postUsage.set(endPost.id, (postUsage.get(endPost.id) ?? 0) + 1);
    }

    if (route.length === start.length && endPost) {
      completedRouteCount += 1;
    }
  });

  let satisfiedPostCount = 0;
  puzzle.posts.forEach((post) => {
    const usage = postUsage.get(post.id) ?? 0;
    const capacity = postById.get(post.id)?.capacity ?? post.capacity;
    if (usage === capacity) {
      satisfiedPostCount += 1;
    } else if (usage < capacity) {
      errors.push(
        `A hollow post needs ${capacity} ${pluralRoutes(capacity)} and has ${usage}.`
      );
    } else {
      errors.push(`A hollow post can only take ${capacity} ${pluralRoutes(capacity)}.`);
    }
  });

  const usedTileCount = new Set(
    Object.values(routeState).flatMap((route) => route.map(coordKey))
  ).size;

  return makeErrorResult(
    [...new Set(errors)],
    usedTileCount,
    totalTileCount,
    completedRouteCount,
    satisfiedPostCount
  );
}

export function validatePostmarkSolution(puzzle: PostmarkPuzzle): PostmarkValidationResult {
  return validatePostmarkRoutes(puzzle, buildRouteStateFromSolution(puzzle));
}

function manhattan(a: PostmarkCoord, b: PostmarkCoord): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function countRouteTurns(cells: PostmarkCoord[]): number {
  let turns = 0;
  for (let index = 2; index < cells.length; index += 1) {
    const a = cells[index - 2]!;
    const b = cells[index - 1]!;
    const c = cells[index]!;
    const previousDirection = `${b.row - a.row}:${b.col - a.col}`;
    const nextDirection = `${c.row - b.row}:${c.col - b.col}`;
    if (previousDirection !== nextDirection) turns += 1;
  }
  return turns;
}

function getUsedTileCount(routes: PostmarkRoute[]): number {
  return new Set(routes.flatMap((route) => route.cells.map(coordKey))).size;
}

function coordBit(coord: PostmarkCoord, size: number): bigint {
  return 1n << BigInt(coord.row * size + coord.col);
}

function generateCandidatesForStart(
  puzzle: PostmarkPuzzle,
  start: PostmarkStart
): PostmarkRoute[] {
  const entryKeys = new Set(puzzle.starts.map((candidate) => coordKey(candidate.entry)));
  const postByKey = new Map(puzzle.posts.map((post) => [coordKey(post), post]));
  const candidates: PostmarkRoute[] = [];
  const path: PostmarkCoord[] = [start.entry];
  const used = new Set([coordKey(start.entry)]);

  const canStillReachPost = (coord: PostmarkCoord, remainingSteps: number): boolean => {
    return puzzle.posts.some((post) => {
      const distance = manhattan(coord, post);
      return distance <= remainingSteps && (remainingSteps - distance) % 2 === 0;
    });
  };

  const dfs = (coord: PostmarkCoord, step: number) => {
    const remainingSteps = start.length - step;
    if (remainingSteps === 0) {
      const post = postByKey.get(coordKey(coord));
      if (post) {
        candidates.push({
          startId: start.id,
          postId: post.id,
          cells: path.map((cell) => ({ ...cell })),
        });
      }
      return;
    }

    if (!canStillReachPost(coord, remainingSteps)) return;

    getNeighbors(coord, puzzle.size).forEach((next) => {
      const key = coordKey(next);
      const nextStep = step + 1;
      const post = postByKey.get(key);
      if (used.has(key)) return;
      if (entryKeys.has(key) && key !== coordKey(start.entry)) return;
      if (post && nextStep !== start.length) return;
      if (!post && nextStep === start.length) return;

      used.add(key);
      path.push(next);
      dfs(next, nextStep);
      path.pop();
      used.delete(key);
    });
  };

  dfs(start.entry, 1);
  return candidates;
}

type CandidatePressureProfile = {
  counts: number[];
  total: number;
  max: number;
  min: number;
  branchingScore: number;
};

function getCandidatePressureProfile(puzzle: PostmarkPuzzle): CandidatePressureProfile {
  const counts = puzzle.starts.map((start) => generateCandidatesForStart(puzzle, start).length);
  const total = counts.reduce((sum, count) => sum + count, 0);
  return {
    counts,
    total,
    max: Math.max(...counts),
    min: Math.min(...counts),
    branchingScore: counts.reduce((sum, count) => sum + Math.max(0, Math.min(count, 24) - 1), 0),
  };
}

function candidatePressureLimits(
  size: 5 | 6 | 7,
  difficulty: PostmarkDifficulty,
  routeCount: number,
  stage: number
) {
  const base = {
    Easy: { minPerRoute: 3, maxPerRoute: 54, maxSingle: 82 },
    Medium: { minPerRoute: 6, maxPerRoute: 66, maxSingle: 104 },
    Hard: { minPerRoute: 8, maxPerRoute: 78, maxSingle: 126 },
  }[difficulty];
  const sizeAdjustment = size === 5 ? -10 : size === 7 ? 22 : 0;
  const stageAdjustment = stage * 16;

  return {
    minTotal: Math.max(routeCount, routeCount * Math.max(1, base.minPerRoute - stage)),
    maxTotal: routeCount * (base.maxPerRoute + sizeAdjustment + stageAdjustment),
    maxSingle: base.maxSingle + sizeAdjustment + stageAdjustment,
  };
}

function puzzleHasManageableCandidatePressure(
  puzzle: PostmarkPuzzle,
  profile: CandidatePressureProfile,
  stage: number
): boolean {
  if (profile.min <= 0) return false;
  const limits = candidatePressureLimits(puzzle.size, puzzle.difficulty, puzzle.starts.length, stage);
  return (
    profile.total >= limits.minTotal &&
    profile.total <= limits.maxTotal &&
    profile.max <= limits.maxSingle
  );
}

export function countPostmarkSolutions(
  puzzle: PostmarkPuzzle,
  limit = 2
): PostmarkSolveResult {
  const postIndexById = new Map(puzzle.posts.map((post, index) => [post.id, index]));
  const postCapacities = puzzle.posts.map((post) => post.capacity);
  const solutionSignatureByStart = new Map(
    puzzle.solution.map((route) => [
      route.startId,
      route.cells.map(coordKey).join('|'),
    ])
  );

  let solutionCount = 0;
  let firstSolution: PostmarkRoute[] | null = null;
  const startById = new Map(puzzle.starts.map((start) => [start.id, start]));
  const candidatesByStart = new Map<
    string,
    Array<{ route: PostmarkRoute; postIndex: number; mask: bigint }>
  >();

  puzzle.starts.forEach((start) => {
    const solutionSignature = solutionSignatureByStart.get(start.id);
    const candidates = generateCandidatesForStart(puzzle, start)
      .map((route) => {
        const postIndex = postIndexById.get(route.postId);
        if (postIndex === undefined) return null;
        const finalIndex = route.cells.length - 1;
        const mask = route.cells.reduce((bits, cell, index) => {
          return index === finalIndex ? bits : bits | coordBit(cell, puzzle.size);
        }, 0n);
        return { route, postIndex, mask };
      })
      .filter((candidate): candidate is { route: PostmarkRoute; postIndex: number; mask: bigint } =>
        candidate !== null
      );

    if (solutionSignature) {
      candidates.sort((left, right) => {
        const leftIsSolution = left.route.cells.map(coordKey).join('|') === solutionSignature;
        const rightIsSolution = right.route.cells.map(coordKey).join('|') === solutionSignature;
        return Number(rightIsSolution) - Number(leftIsSolution);
      });
    }

    candidatesByStart.set(start.id, candidates);
  });

  const generateViableCandidates = (
    start: PostmarkStart,
    usedTiles: bigint,
    postUsage: number[]
  ): Array<{ route: PostmarkRoute; postIndex: number; mask: bigint }> => {
    return (candidatesByStart.get(start.id) ?? []).filter((candidate) => {
      if ((candidate.mask & usedTiles) !== 0n) return false;
      return postUsage[candidate.postIndex]! < postCapacities[candidate.postIndex]!;
    });
  };

  const search = (
    pendingIds: string[],
    usedTiles: bigint,
    postUsage: number[],
    routes: PostmarkRoute[]
  ) => {
    if (solutionCount >= limit) return;
    if (pendingIds.length === 0) {
      const postsSatisfied = puzzle.posts.every(
        (post, index) => postUsage[index] === post.capacity
      );
      if (postsSatisfied) {
        solutionCount += 1;
        if (!firstSolution) {
          firstSolution = routes.map((route) => ({
            ...route,
            cells: route.cells.map((cell) => ({ ...cell })),
          }));
        }
      }
      return;
    }

    for (let postIndex = 0; postIndex < postCapacities.length; postIndex += 1) {
      const remainingCapacity = postCapacities[postIndex]! - postUsage[postIndex]!;
      if (remainingCapacity < 0) return;
      if (remainingCapacity === 0) continue;

      let possibleStarts = 0;
      for (const startId of pendingIds) {
        const hasCandidate = (candidatesByStart.get(startId) ?? []).some((candidate) => {
          return candidate.postIndex === postIndex && (candidate.mask & usedTiles) === 0n;
        });
        if (hasCandidate) possibleStarts += 1;
      }
      if (possibleStarts < remainingCapacity) return;
    }

    let bestIndex = 0;
    let bestViable: Array<{ route: PostmarkRoute; postIndex: number; mask: bigint }> | null = null;
    for (let index = 0; index < pendingIds.length; index += 1) {
      const startId = pendingIds[index]!;
      const start = startById.get(startId);
      const viable = start ? generateViableCandidates(start, usedTiles, postUsage) : [];
      if (!bestViable || viable.length < bestViable.length) {
        bestIndex = index;
        bestViable = viable;
        if (viable.length === 0) break;
      }
    }

    if (!bestViable || bestViable.length === 0) return;

    const nextPending = [...pendingIds];
    nextPending.splice(bestIndex, 1);

    bestViable.forEach((candidate) => {
      const nextPostUsage = [...postUsage];
      nextPostUsage[candidate.postIndex] = nextPostUsage[candidate.postIndex]! + 1;
      search(nextPending, usedTiles | candidate.mask, nextPostUsage, [
        ...routes,
        candidate.route,
      ]);
    });
  };

  search(puzzle.starts.map((start) => start.id), 0n, puzzle.posts.map(() => 0), []);
  return { solutionCount, solution: firstSolution };
}

function routeLengthRange(size: 5 | 6 | 7, difficulty: PostmarkDifficulty) {
  if (size === 5) {
    if (difficulty === 'Easy') return { min: 5, max: 9 };
    if (difficulty === 'Medium') return { min: 4, max: 11 };
    return { min: 4, max: 12 };
  }
  if (size === 6) {
    if (difficulty === 'Easy') return { min: 5, max: 10 };
    if (difficulty === 'Medium') return { min: 5, max: 14 };
    return { min: 5, max: 14 };
  }
  if (difficulty === 'Easy') return { min: 5, max: 10 };
  if (difficulty === 'Medium') return { min: 5, max: 14 };
  return { min: 5, max: 14 };
}

function usageTargetRange(difficulty: PostmarkDifficulty, stage: number): [number, number] {
  const base: Record<PostmarkDifficulty, [number, number]> = {
    Easy: [0.72, 0.82],
    Medium: [0.8, 0.91],
    Hard: [0.88, 0.95],
  };
  const minimumFloor: Record<PostmarkDifficulty, number> = {
    Easy: 0.68,
    Medium: 0.76,
    Hard: 0.86,
  };
  const [min, max] = base[difficulty];
  return [
    Math.max(minimumFloor[difficulty], min - stage * 0.018),
    Math.min(0.97, max + stage * 0.012),
  ];
}

function longRouteTarget(size: 5 | 6 | 7, difficulty: PostmarkDifficulty): number {
  if (difficulty === 'Easy') return size === 5 ? 7 : 8;
  if (difficulty === 'Medium') return size === 5 ? 8 : size === 6 ? 12 : 13;
  return size === 5 ? 9 : size === 6 ? 12 : 13;
}

function longRouteTargetFor(size: 5 | 6 | 7, difficulty: PostmarkDifficulty): number {
  return longRouteTarget(size, difficulty);
}

function chooseRouteCount(size: 5 | 6 | 7, difficulty: PostmarkDifficulty, rand: () => number) {
  const target = POSTMARK_ROUTE_TARGETS[size][difficulty];
  const max = Math.min(size + 1, target.max);
  const min = Math.min(max, target.min);
  return min + Math.floor(rand() * (max - min + 1));
}

function chooseDoublePostCount(
  routeCount: number,
  size: 5 | 6 | 7,
  difficulty: PostmarkDifficulty,
  rand: () => number
) {
  if (routeCount < 3) return 0;
  if (size === 5) {
    if (difficulty === 'Hard') return 1;
    if (difficulty === 'Medium') return rand() < 0.9 ? 1 : 0;
    return rand() < 0.75 ? 1 : 0;
  }
  if (difficulty === 'Easy') return rand() < 0.75 ? 1 : 0;
  if (difficulty === 'Medium') return routeCount >= 5 && rand() < 0.38 ? 2 : 1;
  return routeCount >= 5 && rand() < 0.7 ? 2 : 1;
}

function buildPostCapacities(
  routeCount: number,
  size: 5 | 6 | 7,
  difficulty: PostmarkDifficulty,
  rand: () => number
): Array<1 | 2> {
  let doubleCount = chooseDoublePostCount(routeCount, size, difficulty, rand);
  doubleCount = Math.min(doubleCount, Math.floor(routeCount / 2));
  const singleCount = routeCount - doubleCount * 2;
  return shuffle(
    [
      ...Array.from({ length: singleCount }, () => 1 as const),
      ...Array.from({ length: doubleCount }, () => 2 as const),
    ],
    rand
  );
}

function internalCells(size: 5 | 6 | 7): PostmarkCoord[] {
  const cells: PostmarkCoord[] = [];
  for (let row = 1; row < size - 1; row += 1) {
    for (let col = 1; col < size - 1; col += 1) {
      cells.push({ row, col });
    }
  }
  return cells;
}

function edgeStartSlots(size: 5 | 6 | 7): Array<Omit<PostmarkStart, 'id' | 'length'>> {
  const starts: Array<Omit<PostmarkStart, 'id' | 'length'>> = [];
  for (let col = 0; col < size; col += 1) {
    starts.push({ side: 'top', index: col, entry: { row: 0, col } });
  }
  for (let row = 1; row < size; row += 1) {
    starts.push({ side: 'right', index: row, entry: { row, col: size - 1 } });
  }
  for (let col = size - 2; col >= 0; col -= 1) {
    starts.push({ side: 'bottom', index: col, entry: { row: size - 1, col } });
  }
  for (let row = size - 2; row > 0; row -= 1) {
    starts.push({ side: 'left', index: row, entry: { row, col: 0 } });
  }
  return starts;
}

function findCandidatePathsFromPostToEdge(
  post: PostmarkCoord,
  length: number,
  size: 5 | 6 | 7,
  occupied: Set<string>,
  blockedPosts: Set<string>,
  reservedEntries: Set<string>,
  rand: () => number,
  maxCandidates = MAX_PATH_CANDIDATES
): PostmarkCoord[][] {
  const candidates: PostmarkCoord[][] = [];
  const path: PostmarkCoord[] = [{ ...post }];
  const used = new Set([coordKey(post)]);

  const dfs = (coord: PostmarkCoord, step: number) => {
    if (candidates.length >= maxCandidates) return;
    const remainingSteps = length - step;
    if (remainingSteps === 0) {
      const key = coordKey(coord);
      if (
        getCoordIsEdge(coord, size) &&
        !reservedEntries.has(key) &&
        !occupied.has(key)
      ) {
        candidates.push(path.map((cell) => ({ ...cell })));
      }
      return;
    }

    if (getDistanceToEdge(coord, size) > remainingSteps) return;

    for (const next of shuffle(getNeighbors(coord, size), rand)) {
      const key = coordKey(next);
      const isLast = remainingSteps === 1;
      if (used.has(key)) continue;
      if (occupied.has(key)) continue;
      if (blockedPosts.has(key)) continue;
      if (reservedEntries.has(key)) continue;
      if (isLast && !getCoordIsEdge(next, size)) continue;

      used.add(key);
      path.push(next);
      dfs(next, step + 1);
      path.pop();
      used.delete(key);
    }
  };

  dfs(post, 1);
  return candidates;
}

function scoreCandidatePath(
  postToEntryPath: PostmarkCoord[],
  post: PostmarkCoord,
  size: 5 | 6 | 7,
  occupied: Set<string>,
  rand: () => number
): number {
  const routeCells = [...postToEntryPath].reverse();
  const entry = routeCells[0]!;
  const turns = countRouteTurns(routeCells);
  const detour = routeCells.length - (manhattan(entry, post) + 1);
  const adjacency = routeCells.reduce((sum, cell, index) => {
    const isFinalPost = index === routeCells.length - 1 && coordsEqual(cell, post);
    if (isFinalPost) return sum;
    return (
      sum +
      getNeighbors(cell, size).filter((neighbor) => occupied.has(coordKey(neighbor))).length
    );
  }, 0);
  const edgeCells = routeCells.filter((cell) => getCoordIsEdge(cell, size)).length;
  const straightPenalty = turns === 0 ? 24 : 0;
  const edgeHugPenalty = Math.max(0, edgeCells - 1) * 3;
  return (
    turns * 18 +
    detour * 11 +
    adjacency * 17 +
    routeCells.length * 2.5 -
    straightPenalty -
    edgeHugPenalty +
    rand() * 4
  );
}

function makeStartFromRoute(route: PostmarkRoute, size: 5 | 6 | 7): PostmarkStart {
  const entry = route.cells[0]!;
  const next = route.cells[1];
  let side: PostmarkStartSide | null = null;

  if (next) {
    if (next.row === entry.row && next.col > entry.col && entry.col === 0) side = 'left';
    if (next.row === entry.row && next.col < entry.col && entry.col === size - 1) side = 'right';
    if (next.col === entry.col && next.row > entry.row && entry.row === 0) side = 'top';
    if (next.col === entry.col && next.row < entry.row && entry.row === size - 1) side = 'bottom';
  }

  if (!side) {
    if (entry.col === 0) side = 'left';
    else if (entry.col === size - 1) side = 'right';
    else if (entry.row === 0) side = 'top';
    else side = 'bottom';
  }

  return {
    id: route.startId,
    length: route.cells.length,
    side,
    index: side === 'left' || side === 'right' ? entry.row : entry.col,
    entry: { ...entry },
  };
}

function chooseRouteLengths(
  routeCount: number,
  doublePostCount: number,
  size: 5 | 6 | 7,
  difficulty: PostmarkDifficulty,
  stage: number,
  rand: () => number
): number[] {
  const range = routeLengthRange(size, difficulty);
  const [usageMin, usageMax] = usageTargetRange(difficulty, stage);
  const totalTiles = size * size;
  const targetUsedTileCount = Math.round(
    totalTiles * (usageMin + rand() * (usageMax - usageMin))
  );
  const minSum = range.min * routeCount;
  const maxSum = range.max * routeCount;
  const longTarget = longRouteTargetFor(size, difficulty);
  const requiredLongGoals: number[] = [];
  if (longTarget > 0) {
    const longVariance = Math.max(0, range.max - longTarget);
    const primaryVariance =
      difficulty === 'Hard'
        ? longVariance
        : difficulty === 'Medium'
          ? Math.min(2, longVariance)
          : Math.min(size === 6 && rand() < 0.18 ? 2 : 1, longVariance);
    const primaryLongGoal = longTarget + Math.floor(rand() * (primaryVariance + 1));
    requiredLongGoals.push(primaryLongGoal);
    if (difficulty === 'Hard' && routeCount >= 4 && rand() < 0.52) {
      requiredLongGoals.push(Math.min(range.max, Math.max(longTarget, primaryLongGoal - 1)));
    }
  }
  const requiredLongSum =
    requiredLongGoals.reduce((sum, length) => sum + length, 0) +
    Math.max(0, routeCount - requiredLongGoals.length) * range.min;
  const targetSum = Math.max(
    minSum,
    Math.min(maxSum, Math.max(targetUsedTileCount + doublePostCount, requiredLongSum))
  );
  const lengths = Array.from({ length: routeCount }, (_, index) =>
    requiredLongGoals[index] ?? range.min
  );
  let remaining = targetSum - lengths.reduce((sum, length) => sum + length, 0);

  while (remaining > 0) {
    const growable = lengths
      .map((length, index) => ({ length, index }))
      .filter((item) => item.length < range.max);
    if (growable.length === 0) break;
    const selected = growable[Math.floor(rand() * growable.length)]!;
    lengths[selected.index]! += 1;
    remaining -= 1;
  }

  return shuffle(lengths, rand);
}

function buildRouteDrafts(
  size: 5 | 6 | 7,
  difficulty: PostmarkDifficulty,
  stage: number,
  rand: () => number
) {
  const routeCount = chooseRouteCount(size, difficulty, rand);
  const capacities = buildPostCapacities(routeCount, size, difficulty, rand).sort(
    (left, right) => right - left
  );
  const doublePostCount = capacities.filter((capacity) => capacity === 2).length;
  const routeLengths = chooseRouteLengths(
    routeCount,
    doublePostCount,
    size,
    difficulty,
    stage,
    rand
  ).sort((left, right) => left - right);
  const occupied = new Set<string>();
  const postKeys = new Set<string>();
  const reservedEntries = new Set<string>();
  const posts: PostmarkPost[] = [];
  const drafts: RouteDraft[] = [];
  let routeLengthIndex = 0;

  for (const capacity of capacities) {
    let placed = false;
    const postCandidates = shuffle(internalCells(size), rand).filter((cell) => {
      const key = coordKey(cell);
      return !occupied.has(key) && !postKeys.has(key);
    });

    for (let postAttempt = 0; postAttempt < Math.min(MAX_POST_ATTEMPTS, postCandidates.length); postAttempt += 1) {
      const post = postCandidates[postAttempt]!;
      const localOccupied = new Set(occupied);
      const localReservedEntries = new Set(reservedEntries);
      const localDrafts: RouteDraft[] = [];
      const blockedPosts = new Set(postKeys);
      const postIndex = posts.length;
      let routeWasBlocked = false;

      for (let routeOffset = 0; routeOffset < capacity; routeOffset += 1) {
        const length = routeLengths[routeLengthIndex + routeOffset];
        if (!length) {
          routeWasBlocked = true;
          break;
        }
        const candidatePaths = findCandidatePathsFromPostToEdge(
          post,
          length,
          size,
          localOccupied,
          blockedPosts,
          localReservedEntries,
          rand
        ).sort(
          (left, right) =>
            scoreCandidatePath(right, post, size, localOccupied, rand) -
            scoreCandidatePath(left, post, size, localOccupied, rand)
        );
        const topCandidates = candidatePaths.slice(
          0,
          Math.min(difficulty === 'Easy' ? 6 : 4, candidatePaths.length)
        );
        const selected =
          topCandidates[Math.floor(Math.pow(rand(), difficulty === 'Hard' ? 1.9 : 1.45) * topCandidates.length)];
        if (!selected) {
          routeWasBlocked = true;
          break;
        }
        const routeCells = [...selected].reverse();
        localDrafts.push({ postIndex, cells: routeCells });
        routeCells.forEach((cell, index) => {
          const isFinalPost = index === routeCells.length - 1 && coordsEqual(cell, post);
          if (!isFinalPost) localOccupied.add(coordKey(cell));
        });
        localReservedEntries.add(coordKey(routeCells[0]!));
      }

      if (routeWasBlocked || localDrafts.length < capacity) continue;

      posts.push({
        id: `p${postIndex}`,
        row: post.row,
        col: post.col,
        capacity,
      });
      postKeys.add(coordKey(post));
      localDrafts.forEach((draft) => drafts.push(draft));
      occupied.clear();
      localOccupied.forEach((key) => occupied.add(key));
      reservedEntries.clear();
      localReservedEntries.forEach((key) => reservedEntries.add(key));
      routeLengthIndex += capacity;
      placed = true;
      break;
    }

    if (!placed) return null;
  }

  const routes: PostmarkRoute[] = drafts.map((draft, index) => ({
    startId: `s${index}`,
    postId: `p${draft.postIndex}`,
    cells: draft.cells,
  }));

  return { posts, routes };
}

function makePuzzleFromRoutes(
  dateKey: string,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  posts: PostmarkPost[],
  routes: PostmarkRoute[]
): PostmarkPuzzle {
  return {
    id: `postmark-${dateKey}`,
    difficulty,
    size,
    starts: routes.map((route) => makeStartFromRoute(route, size)),
    posts,
    solution: routes.map((route) => ({
      ...route,
      cells: route.cells.map((cell) => ({ ...cell })),
    })),
  };
}

function puzzleSignature(puzzle: PostmarkPuzzle): string {
  const starts = puzzle.starts
    .map((start) => `${start.side},${start.index},${start.entry.row},${start.entry.col},${start.length}`)
    .sort()
    .join(';');
  const posts = puzzle.posts
    .map((post) => `${post.row},${post.col},${post.capacity}`)
    .sort()
    .join(';');
  return `${puzzle.size}|${puzzle.difficulty}|${starts}|${posts}`;
}

export function analyzePostmarkPuzzleQuality(
  puzzle: PostmarkPuzzle,
  includeBranching = true
): PostmarkQualityMetadata {
  const routeTurns = puzzle.solution.map((route) => countRouteTurns(route.cells));
  const totalTurns = routeTurns.reduce((sum, turns) => sum + turns, 0);
  const straightRouteCount = routeTurns.filter((turns) => turns === 0).length;
  const longestRouteLength = Math.max(...puzzle.solution.map((route) => route.cells.length));
  const usedTileCount = getUsedTileCount(puzzle.solution);
  const occupiedByRoute = new Map<string, string>();
  const postKeys = new Set(puzzle.posts.map(coordKey));
  puzzle.solution.forEach((route) => {
    route.cells.forEach((cell, index) => {
      const isFinalPost = index === route.cells.length - 1 && postKeys.has(coordKey(cell));
      if (!isFinalPost) occupiedByRoute.set(coordKey(cell), route.startId);
    });
  });

  const routeAdjacencyPairs = new Set<string>();
  puzzle.solution.forEach((route) => {
    route.cells.forEach((cell, index) => {
      const key = coordKey(cell);
      const isFinalPost = index === route.cells.length - 1 && postKeys.has(key);
      if (isFinalPost) return;
      getNeighbors(cell, puzzle.size).forEach((neighbor) => {
        const neighborRouteId = occupiedByRoute.get(coordKey(neighbor));
        if (!neighborRouteId || neighborRouteId === route.startId) return;
        routeAdjacencyPairs.add([route.startId, neighborRouteId].sort().join(':'));
      });
    });
  });

  const endpointAmbiguityScore = puzzle.starts.reduce((sum, start) => {
    const steps = start.length - 1;
    const reachablePosts = puzzle.posts.filter((post) => {
      const distance = manhattan(start.entry, post);
      return distance <= steps && (steps - distance) % 2 === 0;
    }).length;
    return sum + Math.max(0, reachablePosts - 1);
  }, 0);

  const candidateBranchingScore = includeBranching
    ? puzzle.starts.reduce((sum, start) => {
        const candidateCount = generateCandidatesForStart(puzzle, start).length;
        return sum + Math.max(0, Math.min(candidateCount, 24) - 1);
      }, 0)
    : 0;

  return {
    totalTurns,
    straightRouteCount,
    longestRouteLength,
    usedTileRatio: Math.round((usedTileCount / (puzzle.size * puzzle.size)) * 1000) / 1000,
    endpointAmbiguityScore,
    candidateBranchingScore,
    routeAdjacencyScore: routeAdjacencyPairs.size,
  };
}

function difficultyScoreFor(puzzle: PostmarkPuzzle): number {
  const usedTileCount = getUsedTileCount(puzzle.solution);
  const doublePostCount = puzzle.posts.filter((post) => post.capacity === 2).length;
  const quality = analyzePostmarkPuzzleQuality(puzzle);
  return (
    puzzle.size * 18 +
    puzzle.starts.length * 13 +
    usedTileCount * 3 +
    doublePostCount * 18 +
    quality.totalTurns * 9 +
    quality.longestRouteLength * 4 +
    quality.routeAdjacencyScore * 5 +
    (puzzle.difficulty === 'Hard' ? 30 : puzzle.difficulty === 'Medium' ? 14 : 0)
  );
}

function minimumQualityFor(
  difficulty: PostmarkDifficulty,
  routeCount: number,
  stage: number
) {
  if (difficulty === 'Easy') {
    return {
      totalTurns: Math.max(6, routeCount + 3 - Math.floor(stage / 2)),
      maxStraightRoutes: 0,
      endpointAmbiguityScore: stage >= 3 ? 1 : 2,
      candidateBranchingScore: 0,
      routeAdjacencyScore: stage >= 2 ? 1 : 2,
    };
  }
  if (difficulty === 'Medium') {
    return {
      totalTurns: Math.max(10, routeCount + 6 - stage),
      maxStraightRoutes: 0,
      endpointAmbiguityScore: stage >= 3 ? 3 : 4,
      candidateBranchingScore: 0,
      routeAdjacencyScore: stage >= 2 ? 3 : 4,
    };
  }
  return {
    totalTurns: Math.max(13, routeCount + 9 - stage),
    maxStraightRoutes: 0,
    endpointAmbiguityScore: stage >= 3 ? 4 : 5,
    candidateBranchingScore: 0,
    routeAdjacencyScore: stage >= 2 ? 4 : 5,
  };
}

function puzzleMeetsQuality(
  puzzle: PostmarkPuzzle,
  quality: PostmarkQualityMetadata,
  stage: number
): boolean {
  if (quality.totalTurns === 0) return false;
  if (
    puzzle.difficulty !== 'Easy' &&
    quality.longestRouteLength < longRouteTargetFor(puzzle.size, puzzle.difficulty)
  ) {
    return false;
  }
  const [minUsage, maxUsage] = usageTargetRange(puzzle.difficulty, stage);
  if (quality.usedTileRatio < minUsage || quality.usedTileRatio > maxUsage) return false;

  const minimum = minimumQualityFor(puzzle.difficulty, puzzle.starts.length, stage);
  return (
    quality.totalTurns >= minimum.totalTurns &&
    quality.straightRouteCount <= minimum.maxStraightRoutes &&
    quality.endpointAmbiguityScore >= minimum.endpointAmbiguityScore &&
    quality.candidateBranchingScore >= minimum.candidateBranchingScore &&
    quality.routeAdjacencyScore >= minimum.routeAdjacencyScore
  );
}

function qualityScoreFor(puzzle: PostmarkPuzzle, quality: PostmarkQualityMetadata): number {
  const [usageMin, usageMax] = usageTargetRange(puzzle.difficulty, 0);
  const usageCenter = (usageMin + usageMax) / 2;
  const routeTurns = puzzle.solution.map((route) => countRouteTurns(route.cells));
  const longTarget = longRouteTargetFor(puzzle.size, puzzle.difficulty);
  const longRouteCount =
    longTarget > 0
      ? puzzle.solution.filter((route) => route.cells.length >= longTarget).length
      : puzzle.solution.filter((route) => route.cells.length >= 7).length;
  const multiTurnRouteCount = routeTurns.filter((turns) => turns >= 2).length;
  const singleTurnRouteCount = routeTurns.filter((turns) => turns === 1).length;
  const shortRoutePenalty = puzzle.solution.filter((route) => {
    if (puzzle.difficulty === 'Easy') return route.cells.length <= 4;
    if (puzzle.difficulty === 'Medium') return route.cells.length <= 5;
    return route.cells.length <= 6;
  }).length;
  const usageScore = 90 - Math.abs(quality.usedTileRatio - usageCenter) * 210;
  return (
    usageScore +
    quality.totalTurns * 26 +
    quality.longestRouteLength * 13 +
    longRouteCount * 32 +
    multiTurnRouteCount * 22 +
    singleTurnRouteCount * 4 +
    quality.endpointAmbiguityScore * 12 +
    quality.candidateBranchingScore * 1.4 +
    quality.routeAdjacencyScore * 22 -
    quality.straightRouteCount * 80 -
    shortRoutePenalty * 24 +
    puzzle.posts.filter((post) => post.capacity === 2).length * 24
  );
}

function transformCoord(coord: PostmarkCoord, size: 5 | 6 | 7, variant: number): PostmarkCoord {
  const max = size - 1;
  switch (variant % 8) {
    case 1:
      return { row: coord.col, col: max - coord.row };
    case 2:
      return { row: max - coord.row, col: max - coord.col };
    case 3:
      return { row: max - coord.col, col: coord.row };
    case 4:
      return { row: coord.row, col: max - coord.col };
    case 5:
      return { row: max - coord.row, col: coord.col };
    case 6:
      return { row: coord.col, col: coord.row };
    case 7:
      return { row: max - coord.col, col: max - coord.row };
    default:
      return { row: coord.row, col: coord.col };
  }
}

function transformPuzzleGeometry(
  dateKey: string,
  puzzle: PostmarkPuzzle,
  variant: number
): PostmarkPuzzle {
  const posts = puzzle.posts.map((post) => ({
    ...post,
    ...transformCoord(post, puzzle.size, variant),
  }));
  const routes = puzzle.solution.map((route) => ({
    ...route,
    cells: route.cells.map((cell) => transformCoord(cell, puzzle.size, variant)),
  }));
  return makePuzzleFromRoutes(dateKey, puzzle.difficulty, puzzle.size, posts, routes);
}

function liftSixPuzzleToSeven(
  dateKey: string,
  basePuzzle: PostmarkPuzzle,
  variant: number
): PostmarkPuzzle | null {
  const startById = new Map(basePuzzle.starts.map((start) => [start.id, start]));
  const liftedRoutes = basePuzzle.solution.map((route) => {
    const start = startById.get(route.startId);
    if (!start) return route;
    const cells = route.cells.map((cell) => ({ ...cell }));
    if (start.side === 'right') {
      cells.unshift({ row: start.entry.row, col: 6 });
    } else if (start.side === 'bottom') {
      cells.unshift({ row: 6, col: start.entry.col });
    }
    return {
      ...route,
      cells,
    };
  });

  if (liftedRoutes.some((route) => route.cells.length > 14)) return null;

  const liftedPuzzle = makePuzzleFromRoutes(
    dateKey,
    basePuzzle.difficulty,
    7,
    basePuzzle.posts.map((post) => ({ ...post })),
    liftedRoutes
  );
  return transformPuzzleGeometry(dateKey, liftedPuzzle, variant);
}

function liftedPuzzleMeetsQuality(
  puzzle: PostmarkPuzzle,
  quality: PostmarkQualityMetadata
): boolean {
  const minimumUsage: Record<PostmarkDifficulty, number> = {
    Easy: 0.64,
    Medium: 0.76,
    Hard: 0.84,
  };

  if (quality.totalTurns === 0) return false;
  if (quality.usedTileRatio < minimumUsage[puzzle.difficulty]) return false;
  if (
    puzzle.difficulty !== 'Easy' &&
    quality.longestRouteLength < longRouteTargetFor(puzzle.size, puzzle.difficulty)
  ) {
    return false;
  }
  if (puzzle.difficulty === 'Medium' && puzzle.posts.every((post) => post.capacity === 1)) {
    return false;
  }
  if (quality.straightRouteCount > 0) return false;
  if (puzzle.difficulty === 'Medium' && quality.totalTurns < 10) return false;
  if (puzzle.difficulty === 'Hard' && quality.totalTurns < 13) return false;
  return true;
}

function generateLiftedSevenPuzzle(
  dateKey: string,
  difficulty: PostmarkDifficulty,
  seed: number
): PostmarkPuzzle | null {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const basePuzzle = generatePuzzle(dateKey, difficulty, 6, seed + attempt * 65537 + 3001);
      for (let variant = 0; variant < 8; variant += 1) {
        const liftedPuzzle = liftSixPuzzleToSeven(dateKey, basePuzzle, variant + attempt);
        if (!liftedPuzzle) continue;
        const validation = validatePostmarkSolution(liftedPuzzle);
        if (!validation.solved) continue;
        const quality = analyzePostmarkPuzzleQuality(liftedPuzzle);
        if (!liftedPuzzleMeetsQuality(liftedPuzzle, quality)) continue;
        const solutionCount = countPostmarkSolutions(liftedPuzzle, 2).solutionCount;
        if (solutionCount !== 1) continue;
        return liftedPuzzle;
      }
    } catch {
      // Try another deterministic seed.
    }
  }

  return null;
}

function buildParameterFirstPuzzle(
  dateKey: string,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  stage: number,
  rand: () => number
): PostmarkPuzzle | null {
  const routeCount = chooseRouteCount(size, difficulty, rand);
  const capacities = buildPostCapacities(routeCount, size, difficulty, rand);
  const doublePostCount = capacities.filter((capacity) => capacity === 2).length;
  const lengths = chooseRouteLengths(routeCount, doublePostCount, size, difficulty, stage, rand);
  const starts = shuffle(edgeStartSlots(size), rand)
    .slice(0, routeCount)
    .map((start, index) => ({
      id: `s${index}`,
      length: lengths[index]!,
      side: start.side,
      index: start.index,
      entry: { ...start.entry },
    }));
  const posts = shuffle(internalCells(size), rand)
    .slice(0, capacities.length)
    .map((post, index) => ({
      id: `p${index}`,
      row: post.row,
      col: post.col,
      capacity: capacities[index]!,
    }));

  const reachableCapacity = posts.reduce((sum, post) => {
    const reachableStarts = starts.filter((start) => {
      const distance = manhattan(start.entry, post);
      const steps = start.length - 1;
      return distance <= steps && (steps - distance) % 2 === 0;
    }).length;
    return sum + Math.min(reachableStarts, post.capacity);
  }, 0);
  if (reachableCapacity < routeCount) return null;

  if (
    starts.some((start) =>
      posts.every((post) => {
        const distance = manhattan(start.entry, post);
        const steps = start.length - 1;
        return distance > steps || (steps - distance) % 2 !== 0;
      })
    )
  ) {
    return null;
  }

  const shellPuzzle: PostmarkPuzzle = {
    id: `postmark-${dateKey}`,
    difficulty,
    size,
    starts,
    posts,
    solution: [],
  };
  const solveResult = countPostmarkSolutions(shellPuzzle, 2);
  if (solveResult.solutionCount !== 1 || !solveResult.solution) return null;

  return {
    ...shellPuzzle,
    solution: solveResult.solution,
  };
}

function generateParameterFirstPuzzle(
  dateKey: string,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  seed: number
): PostmarkPuzzle | null {
  const attemptsByStage = [120, 220, 360, 620];
  for (let stage = 0; stage < attemptsByStage.length; stage += 1) {
    let bestPuzzle: PostmarkPuzzle | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let attempt = 0; attempt < attemptsByStage[stage]!; attempt += 1) {
      const rand = mulberry32(seed + stage * 15485863 + attempt * 32452843);
      const puzzle = buildParameterFirstPuzzle(dateKey, difficulty, size, stage, rand);
      if (!puzzle) continue;
      const validation = validatePostmarkSolution(puzzle);
      if (!validation.solved) continue;
      const quality = analyzePostmarkPuzzleQuality(puzzle, false);
      if (!puzzleMeetsQuality(puzzle, quality, stage)) continue;
      const score = qualityScoreFor(puzzle, quality);
      if (stage >= 2) {
        if (process.env.POSTMARK_DEBUG_GENERATOR === '1') {
          console.info(`[postmark-generator] ${dateKey} success`, JSON.stringify({ stage, attempt }));
        }
        return puzzle;
      }
      if (score > bestScore) {
        bestPuzzle = puzzle;
        bestScore = score;
      }
    }

    if (bestPuzzle) return bestPuzzle;
  }
  return null;
}

function generatePuzzle(
  dateKey: string,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  seed: number
): PostmarkPuzzle {
  if (size === 7 && process.env.POSTMARK_USE_PARAMETER_FIRST === '1') {
    const parameterPuzzle = generateParameterFirstPuzzle(dateKey, difficulty, size, seed);
    if (parameterPuzzle) return parameterPuzzle;
  }

  if (size === 7 && process.env.POSTMARK_USE_LIFTED_SEVEN === '1') {
    const liftedPuzzle = generateLiftedSevenPuzzle(dateKey, difficulty, seed);
    if (liftedPuzzle) return liftedPuzzle;
  }

  const stageAttempts = [260, 420, 760, MAX_GENERATION_ATTEMPTS];
  const debugStats = {
    drafts: 0,
    invalid: 0,
    lowQuality: 0,
    unmanageablePressure: 0,
    notUnique: 0,
    bestQualityScore: Number.NEGATIVE_INFINITY,
    bestNotUniqueSolutionCount: 0,
  };
  let bestRejectedPuzzle: PostmarkPuzzle | null = null;
  let bestRejectedScore = Number.NEGATIVE_INFINITY;

  for (let stage = 0; stage < stageAttempts.length; stage += 1) {
    let bestPuzzle: PostmarkPuzzle | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let attempt = 0; attempt < stageAttempts[stage]!; attempt += 1) {
      const rand = mulberry32(seed + stage * 104729 + attempt * 7919);
      const draft = buildRouteDrafts(size, difficulty, stage, rand);
      if (!draft) continue;
      debugStats.drafts += 1;

      const puzzle = makePuzzleFromRoutes(dateKey, difficulty, size, draft.posts, draft.routes);
      const validation = validatePostmarkSolution(puzzle);
      if (!validation.solved) {
        debugStats.invalid += 1;
        continue;
      }

      const quality = analyzePostmarkPuzzleQuality(puzzle, false);
      debugStats.bestQualityScore = Math.max(debugStats.bestQualityScore, qualityScoreFor(puzzle, quality));
      if (!puzzleMeetsQuality(puzzle, quality, stage)) {
        debugStats.lowQuality += 1;
        continue;
      }

      const pressureProfile = getCandidatePressureProfile(puzzle);
      if (!puzzleHasManageableCandidatePressure(puzzle, pressureProfile, stage)) {
        debugStats.unmanageablePressure += 1;
        continue;
      }
      const scoredQuality = {
        ...quality,
        candidateBranchingScore: pressureProfile.branchingScore,
      };

      const solutionCount = countPostmarkSolutions(puzzle, 2).solutionCount;
      if (solutionCount !== 1) {
        debugStats.notUnique += 1;
        debugStats.bestNotUniqueSolutionCount = Math.max(
          debugStats.bestNotUniqueSolutionCount,
          solutionCount
        );
        const rejectedScore = qualityScoreFor(puzzle, scoredQuality);
        if (rejectedScore > bestRejectedScore) {
          bestRejectedPuzzle = puzzle;
          bestRejectedScore = rejectedScore;
        }
        continue;
      }

      const score = qualityScoreFor(puzzle, scoredQuality);
      if (stage >= 2) {
        if (process.env.POSTMARK_DEBUG_GENERATOR === '1') {
          console.info(`[postmark-generator] ${dateKey} success`, JSON.stringify({ stage, attempt }));
        }
        return puzzle;
      }
      if (score > bestScore) {
        bestPuzzle = puzzle;
        bestScore = score;
      }
    }

    if (bestPuzzle) {
      if (process.env.POSTMARK_DEBUG_GENERATOR === '1') {
        console.info(`[postmark-generator] ${dateKey} success`, JSON.stringify({ stage }));
      }
      return bestPuzzle;
    }
  }

  if (process.env.POSTMARK_DEBUG_GENERATOR === '1') {
    console.info(
      `[postmark-generator] ${dateKey} ${difficulty} ${size}`,
      JSON.stringify(debugStats)
    );
  }
  if (process.env.POSTMARK_RETURN_NON_UNIQUE === '1' && bestRejectedPuzzle) {
    return bestRejectedPuzzle;
  }
  throw new Error(`Unable to generate unique Postmark puzzle for ${dateKey}`);
}

function balancedSchedule<T extends string | number>(
  total: number,
  targets: Record<string, number>,
  seed: number
): T[] {
  const rand = mulberry32(seed);
  const keys = Object.keys(targets);
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<string, number>;
  const schedule: string[] = [];

  for (let index = 0; index < total; index += 1) {
    const remainingSlots = total - index;
    const forced = keys.find((key) => targets[key]! - counts[key]! === remainingSlots);
    const key =
      forced ??
      [...keys].sort((left, right) => {
        const leftNeed = targets[left]! - counts[left]!;
        const rightNeed = targets[right]! - counts[right]!;
        const leftScore = (leftNeed / targets[left]!) * 100 + rand();
        const rightScore = (rightNeed / targets[right]!) * 100 + rand();
        return rightScore - leftScore;
      })[0]!;
    schedule.push(key);
    counts[key] += 1;
  }

  return schedule as T[];
}

function difficultySchedule(): PostmarkDifficulty[] {
  return balancedSchedule<PostmarkDifficulty>(
    POSTMARK_PACK_LENGTH,
    POSTMARK_DIFFICULTY_TOTALS,
    51203
  );
}

function sizeSchedule(): Array<5 | 6 | 7> {
  const sevenCount = POSTMARK_SIZE_TOTALS[7];
  const sevenIndexes = new Set<number>([35]);
  const difficulties = difficultySchedule();

  const addSpreadSevenIndexes = (difficulty: PostmarkDifficulty, count: number) => {
    const candidates = difficulties
      .map((candidateDifficulty, index) => ({ difficulty: candidateDifficulty, index }))
      .filter((candidate) => candidate.index !== 35 && candidate.difficulty === difficulty)
      .map((candidate) => candidate.index);

    for (let slot = 0; slot < count && sevenIndexes.size < sevenCount; slot += 1) {
      const target = Math.round(((slot + 1) * (POSTMARK_PACK_LENGTH - 1)) / (count + 1));
      const selected = candidates
        .filter((index) => !sevenIndexes.has(index))
        .sort((left, right) => Math.abs(left - target) - Math.abs(right - target))[0];
      if (selected !== undefined) {
        sevenIndexes.add(selected);
      }
    }
  };

  const remainingSevenSlots = sevenCount - sevenIndexes.size;
  const hardSevenCount = Math.min(6, remainingSevenSlots);
  addSpreadSevenIndexes('Hard', hardSevenCount);
  addSpreadSevenIndexes('Medium', sevenCount - sevenIndexes.size);
  addSpreadSevenIndexes('Hard', sevenCount - sevenIndexes.size);

  const nonSevenSizes = balancedSchedule<5 | 6>(
    POSTMARK_PACK_LENGTH - sevenIndexes.size,
    {
      5: POSTMARK_SIZE_TOTALS[5],
      6: POSTMARK_SIZE_TOTALS[6],
    },
    91411
  ).map((value) => Number(value) as 5 | 6);
  let nonSevenIndex = 0;

  return Array.from({ length: POSTMARK_PACK_LENGTH }, (_, index) => {
    if (sevenIndexes.has(index)) return 7;
    const size = nonSevenSizes[nonSevenIndex]!;
    nonSevenIndex += 1;
    return size;
  });
}

export function buildPostmarkEntry(
  dateKey: string,
  dayNumber: number,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  source: 'pack' | 'fallback' = 'pack',
  salt = ''
): PostmarkPackEntry {
  const seed = hashString(`${dateKey}:${dayNumber}:${difficulty}:${size}:${salt}:postmark-v4`);
  const puzzle = generatePuzzle(dateKey, difficulty, size, seed);
  const usedTileCount = getUsedTileCount(puzzle.solution);
  const doublePostCount = puzzle.posts.filter((post) => post.capacity === 2).length;
  const quality = analyzePostmarkPuzzleQuality(puzzle);
  return {
    date: dateKey,
    dayNumber,
    difficulty,
    size,
    routeCount: puzzle.starts.length,
    postCount: puzzle.posts.length,
    doublePostCount,
    usedTileCount,
    difficultyScore: difficultyScoreFor(puzzle),
    quality,
    signature: puzzleSignature(puzzle),
    source,
    puzzle,
  };
}

function buildPostmarkEntryWithRetries(
  dateKey: string,
  dayNumber: number,
  difficulty: PostmarkDifficulty,
  size: 5 | 6 | 7,
  source: 'pack' | 'fallback',
  saltPrefix = 'retry'
): PostmarkPackEntry {
  const useBlankFirst = saltPrefix === 'retry';
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return buildPostmarkEntry(
        dateKey,
        dayNumber,
        difficulty,
        size,
        source,
        attempt === 0 && useBlankFirst ? '' : `${saltPrefix}-${attempt}`
      );
    } catch {
      // Try another deterministic seed.
    }
  }
  return buildPostmarkEntry(dateKey, dayNumber, difficulty, size, source, `${saltPrefix}-final`);
}

export function buildFallbackPostmarkEntry(date: Date = new Date()): PostmarkPackEntry {
  const dateKey = date.toISOString().slice(0, 10);
  const dayNumber = getPostmarkDayNumber(dateKey);
  const rand = mulberry32(hashString(`fallback:${dateKey}`));
  const difficulty: PostmarkDifficulty = rand() < 0.18 ? 'Easy' : rand() < 0.78 ? 'Medium' : 'Hard';
  const size: 5 | 6 | 7 =
    difficulty === 'Easy'
      ? rand() < 0.72
        ? 5
        : 6
      : difficulty === 'Hard'
        ? rand() < 0.7
          ? 7
          : 6
        : rand() < 0.78
          ? 6
          : 7;
  return buildPostmarkEntryWithRetries(dateKey, dayNumber, difficulty, size, 'fallback');
}

export function buildPostmarkPack(
  startDate: string = POSTMARK_PACK_START_DATE
): PostmarkPackEntry[] {
  const difficulties = difficultySchedule();
  const sizes = sizeSchedule();
  const seenSignatures = new Set<string>();

  return Array.from({ length: POSTMARK_PACK_LENGTH }, (_, index) => {
    const date = addUtcDays(startDate, index);
    const startedAt = Date.now();
    if (process.env.POSTMARK_BUILD_PROGRESS === '1') {
      console.info(
        `[postmark-pack] start ${index + 1}/${POSTMARK_PACK_LENGTH} ${date} ${difficulties[index]} ${sizes[index]}`
      );
    }
    let entry = buildPostmarkEntryWithRetries(
      date,
      index + 1,
      difficulties[index]!,
      sizes[index]!,
      'pack'
    );
    let collisionSalt = 0;
    while (seenSignatures.has(entry.signature)) {
      collisionSalt += 1;
      entry = buildPostmarkEntryWithRetries(
        date,
        index + 1,
        difficulties[index]!,
        sizes[index]!,
        'pack',
        `collision-${collisionSalt}`
      );
    }
    seenSignatures.add(entry.signature);
    if (process.env.POSTMARK_BUILD_PROGRESS === '1') {
      console.info(
        `[postmark-pack] ${index + 1}/${POSTMARK_PACK_LENGTH} ${date} ${entry.difficulty} ${entry.size} ${Date.now() - startedAt}ms`
      );
    }
    return entry;
  });
}
