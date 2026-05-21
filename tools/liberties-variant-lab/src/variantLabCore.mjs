const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export const VARIANTS = [
  {
    id: 'efficient-capture',
    name: 'Efficient Capture',
    shortName: 'Efficient',
    thesis: 'Clear every light pebble in as few meaningful placements as possible.',
    rules: ['Place dark pebbles on empty crossings.', 'Light pebbles clear when every side-touching empty crossing is closed.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 2, filler: -3, response: 0, risk: 0 },
    flags: {},
  },
  {
    id: 'stone-budget',
    name: 'Stone Budget',
    shortName: 'Budget',
    thesis: 'The bowl is tight, so a wasteful placement can make the puzzle impossible.',
    rules: ['Clear every light pebble before the bowl runs out.', 'The bowl size is based on the solved sample plus one spare.'],
    weights: { sharedMove: 1.5, capture: 1.5, multiCapture: 2, filler: -4, response: 0, risk: 0 },
    flags: { budgeted: true },
  },
  {
    id: 'shared-crossing',
    name: 'Shared Crossing',
    shortName: 'Shared',
    thesis: 'The best moves touch more than one light group at once.',
    rules: ['A crossing can touch multiple separate light groups.', 'Shared crossings are the main solve currency.'],
    weights: { sharedMove: 5, capture: 1, multiCapture: 2, filler: -3, response: 0, risk: 0 },
    flags: { requireShared: true },
  },
  {
    id: 'dark-survival',
    name: 'Dark Chain Survival',
    shortName: 'Survival',
    thesis: 'Dark chains must keep room after quiet moves, turning placement into shape management.',
    rules: ['A quiet move must leave its dark group touching at least two empty crossings.', 'Capturing moves may be tighter.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 2, filler: -3, response: 0, risk: 4 },
    flags: { strictBreath: true },
  },
  {
    id: 'capture-race',
    name: 'Capture Race',
    shortName: 'Race',
    thesis: 'When a light group is almost trapped, delaying lets it breathe into its last space.',
    rules: ['A light group with one open side is urgent.', 'If you ignore an urgent group, it extends into that space.'],
    weights: { sharedMove: 1, capture: 3, multiCapture: 2, filler: -3, response: 4, risk: 2 },
    flags: { raceResponse: true },
  },
  {
    id: 'responsive-lights',
    name: 'Responsive Lights',
    shortName: 'Responsive',
    thesis: 'Light groups push back after quiet moves, so the board state keeps changing.',
    rules: ['After a non-capturing move, one light group extends into an open crossing.', 'Captures stop the response.'],
    weights: { sharedMove: 1.5, capture: 2, multiCapture: 2, filler: -3, response: 5, risk: 1 },
    flags: { responsive: true },
  },
  {
    id: 'net-ladder',
    name: 'Net / Ladder Chase',
    shortName: 'Net',
    thesis: 'Light groups run along lanes; dark pebbles steer them into nets.',
    rules: ['After quiet moves, light pebbles prefer extending toward open lanes.', 'Block the run before it spreads.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 1, filler: -2, response: 4, risk: 1 },
    flags: { responsive: true, laneResponse: true },
  },
  {
    id: 'snapback-sacrifice',
    name: 'Snapback / Sacrifice',
    shortName: 'Sacrifice',
    thesis: 'A tight throw-in can be removed but leave a nearby light group vulnerable.',
    rules: ['A self-stranded dark placement may be used as an offer.', 'The offer vanishes and marks adjacent light groups as thin.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 3, filler: -2, response: 0, risk: 4, sacrifice: 5 },
    flags: { sacrifice: true },
  },
  {
    id: 'life-shape',
    name: 'Life Shape',
    shortName: 'Life',
    thesis: 'After clearing the board, the main dark chain must still have two breathing spaces.',
    rules: ['Clear every light pebble.', 'The largest dark chain must finish touching at least two empty crossings.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 2, filler: -3, response: 0, risk: 3, life: 4 },
    flags: { lifeGoal: true },
  },
  {
    id: 'ko-threat',
    name: 'Ko Threat Miniature',
    shortName: 'Ko',
    thesis: 'A one-stone capture temporarily locks the captured crossing, forcing a move elsewhere.',
    rules: ['A single captured crossing is locked for one turn.', 'Play elsewhere before that crossing can be used.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 2, filler: -2, response: 0, risk: 1, ko: 4 },
    flags: { ko: true },
  },
  {
    id: 'green-release',
    name: 'Green Release Locks',
    shortName: 'Release',
    thesis: 'Green crossings are blocked until a linked light group clears.',
    rules: ['Green pebbles are closed crossings.', 'A green crossing opens after its linked light group clears.'],
    weights: { sharedMove: 1, capture: 2, multiCapture: 1, filler: -2, response: 0, risk: 0, release: 5 },
    flags: { release: true },
  },
  {
    id: 'territory-closure',
    name: 'Territory Closure',
    shortName: 'Territory',
    thesis: 'The goal is not just capture; settle marked pockets by closing light influence out.',
    rules: ['Clear light pebbles and seal marked pockets.', 'A pocket is settled when its empty region touches no light pebbles.'],
    weights: { sharedMove: 1, capture: 1, multiCapture: 1, filler: -2, response: 0, risk: 0, territory: 5 },
    flags: { territory: true },
  },
];

const BASE_PUZZLES = [
  {
    id: 'four-corners',
    title: 'Four Corners',
    layout: [
      'XXXXX',
      'XW.WX',
      'X...X',
      'XW.WX',
      'XXXXX',
    ],
  },
  {
    id: 'paired-halls',
    title: 'Paired Halls',
    layout: [
      'XXXXX',
      'XWW.X',
      'X...X',
      'X.WWX',
      'XXXXX',
    ],
  },
  {
    id: 'hinge',
    title: 'Hinge',
    layout: [
      'XXXXX',
      'XW..X',
      'X.W.X',
      'X..WX',
      'XXXXX',
    ],
  },
  {
    id: 'pocket',
    title: 'Pocket',
    layout: [
      'XXXXX',
      'X.WWX',
      'X...X',
      'XW..X',
      'XXXXX',
    ],
  },
];

const RELEASE_BASE_PUZZLES = [
  {
    id: 'release-gate',
    title: 'Release Gate',
    layout: [
      'XXXXXX',
      'XW...X',
      'X..W.X',
      'X....X',
      'XG..WX',
      'XXXXXX',
    ],
    releasePoint: { row: 4, col: 1 },
  },
  {
    id: 'release-court',
    title: 'Release Court',
    layout: [
      'XXXXXX',
      'X.W..X',
      'X....X',
      'X..W.X',
      'XG.W.X',
      'XXXXXX',
    ],
    releasePoint: { row: 4, col: 1 },
  },
];

export function getVariantById(id) {
  return VARIANTS.find((variant) => variant.id === id) ?? VARIANTS[0];
}

export function pointKey(point) {
  return `${point.row}:${point.col}`;
}

export function parseKey(key) {
  const [row, col] = key.split(':').map(Number);
  return { row, col };
}

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function parseLayout(layout) {
  return layout.map((row) => row.split(''));
}

export function boardToLayout(board) {
  return board.map((row) => row.join(''));
}

function makeState(puzzle) {
  return {
    board: parseLayout(puzzle.layout),
    moves: [],
    captures: 0,
    sharedMoves: 0,
    fillerMoves: 0,
    responseEvents: 0,
    sacrificeEvents: 0,
    releaseEvents: 0,
    territoryEvents: 0,
    koEvents: 0,
    riskMoves: 0,
    markedLightKeys: new Set(),
    koLock: null,
    events: [],
  };
}

export function createInitialState(puzzle) {
  return makeState(puzzle);
}

export function serializeState(state) {
  return [
    boardToLayout(state.board).join('/'),
    state.koLock ?? '-',
    [...state.markedLightKeys].sort().join(','),
  ].join('|');
}

export function isOnBoard(board, point) {
  return point.row >= 0 && point.row < board.length && point.col >= 0 && point.col < board[0].length;
}

export function neighbors(board, point) {
  return DIRECTIONS
    .map(([rowDelta, colDelta]) => ({ row: point.row + rowDelta, col: point.col + colDelta }))
    .filter((candidate) => isOnBoard(board, candidate));
}

export function getGroup(board, start, color) {
  if (!isOnBoard(board, start) || board[start.row][start.col] !== color) return null;
  const stack = [start];
  const seen = new Set();
  const stones = [];
  const liberties = new Set();

  while (stack.length > 0) {
    const current = stack.pop();
    const currentKey = pointKey(current);
    if (seen.has(currentKey)) continue;
    seen.add(currentKey);
    stones.push(current);

    for (const neighbor of neighbors(board, current)) {
      const cell = board[neighbor.row][neighbor.col];
      if (cell === '.') {
        liberties.add(pointKey(neighbor));
      } else if (cell === color && !seen.has(pointKey(neighbor))) {
        stack.push(neighbor);
      }
    }
  }

  return { color, stones, liberties };
}

export function getGroups(board, color) {
  const groups = [];
  const seen = new Set();
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] !== color) continue;
      const key = pointKey({ row, col });
      if (seen.has(key)) continue;
      const group = getGroup(board, { row, col }, color);
      if (!group) continue;
      group.stones.forEach((stone) => seen.add(pointKey(stone)));
      groups.push(group);
    }
  }
  return groups;
}

export function getLightTouchCount(board, point) {
  const touched = new Set();
  for (const neighbor of neighbors(board, point)) {
    if (board[neighbor.row][neighbor.col] !== 'W') continue;
    const group = getGroup(board, neighbor, 'W');
    if (!group) continue;
    touched.add(group.stones.map(pointKey).sort().join('|'));
  }
  return touched.size;
}

export function getLegalMoves(state, variant, puzzle) {
  const moves = [];
  for (let row = 0; row < state.board.length; row += 1) {
    for (let col = 0; col < state.board[row].length; col += 1) {
      const point = { row, col };
      const result = applyMove(state, variant, puzzle, point, { dryRun: true });
      if (result.legal) moves.push(point);
    }
  }
  return moves;
}

function removeStones(board, stones) {
  for (const stone of stones) {
    board[stone.row][stone.col] = '.';
  }
}

function captureAdjacentOpponentGroups(board, move, opponentColor) {
  const captured = [];
  const checked = new Set();
  for (const neighbor of neighbors(board, move)) {
    if (board[neighbor.row][neighbor.col] !== opponentColor) continue;
    const group = getGroup(board, neighbor, opponentColor);
    if (!group) continue;
    const signature = group.stones.map(pointKey).sort().join('|');
    if (checked.has(signature)) continue;
    checked.add(signature);
    if (group.liberties.size === 0) {
      captured.push(...group.stones);
    }
  }
  removeStones(board, captured);
  return captured;
}

function cloneState(state) {
  return {
    ...state,
    board: cloneBoard(state.board),
    moves: [...state.moves],
    markedLightKeys: new Set(state.markedLightKeys),
    events: [...state.events],
  };
}

function getLightGroupsWithOneLiberty(board) {
  return getGroups(board, 'W')
    .map((group) => ({ group, liberties: [...group.liberties].map(parseKey) }))
    .filter((entry) => entry.liberties.length === 1);
}

function pickResponsiveMove(board, variant) {
  const groups = getGroups(board, 'W')
    .map((group) => ({ group, liberties: [...group.liberties].map(parseKey) }))
    .filter((entry) => entry.liberties.length > 0)
    .sort((a, b) => a.liberties.length - b.liberties.length || b.group.stones.length - a.group.stones.length);

  if (groups.length === 0) return null;
  const selected = groups[0];
  const liberties = selected.liberties.sort((a, b) => {
    if (variant.flags.laneResponse) {
      const aEdge = Math.min(a.row, a.col, board.length - 1 - a.row, board[0].length - 1 - a.col);
      const bEdge = Math.min(b.row, b.col, board.length - 1 - b.row, board[0].length - 1 - b.col);
      return bEdge - aEdge || a.row - b.row || a.col - b.col;
    }
    return a.row - b.row || a.col - b.col;
  });
  return liberties[0] ?? null;
}

function applyWhiteResponse(next, variant, responsePoint) {
  if (!responsePoint || next.board[responsePoint.row]?.[responsePoint.col] !== '.') return null;
  next.board[responsePoint.row][responsePoint.col] = 'W';
  const capturedBlack = captureAdjacentOpponentGroups(next.board, responsePoint, 'B');
  next.responseEvents += 1;
  next.events.push(capturedBlack.length > 0 ? `Light extends and removes ${capturedBlack.length} dark.` : 'Light extends.');
  return responsePoint;
}

function applyRelease(next, puzzle) {
  if (!puzzle.releaseLinks?.length) return;
  const lightGroups = puzzle.lightGroups ?? [];
  for (const release of puzzle.releaseLinks) {
    if (next.board[release.point.row]?.[release.point.col] !== 'G') continue;
    const linked = lightGroups[release.groupIndex] ?? [];
    const cleared = linked.every((point) => next.board[point.row]?.[point.col] !== 'W');
    if (!cleared) continue;
    next.board[release.point.row][release.point.col] = '.';
    next.releaseEvents += 1;
    next.events.push('A green crossing opens.');
  }
}

function applyTerritory(next) {
  const seen = new Set();
  let claimed = 0;
  for (let row = 0; row < next.board.length; row += 1) {
    for (let col = 0; col < next.board[row].length; col += 1) {
      const start = { row, col };
      const startKey = pointKey(start);
      if (seen.has(startKey) || next.board[row][col] !== 'T') continue;
      const stack = [start];
      const region = [];
      let touchesLight = false;
      while (stack.length > 0) {
        const current = stack.pop();
        const key = pointKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (next.board[current.row][current.col] !== 'T' && next.board[current.row][current.col] !== '.') continue;
        region.push(current);
        for (const neighbor of neighbors(next.board, current)) {
          const cell = next.board[neighbor.row][neighbor.col];
          if (cell === 'W') touchesLight = true;
          if ((cell === 'T' || cell === '.') && !seen.has(pointKey(neighbor))) stack.push(neighbor);
        }
      }
      if (!touchesLight && region.some((point) => next.board[point.row][point.col] === 'T')) {
        for (const point of region) {
          if (next.board[point.row][point.col] === 'T') {
            next.board[point.row][point.col] = 'C';
            claimed += 1;
          }
        }
      }
    }
  }
  if (claimed > 0) {
    next.territoryEvents += claimed;
    next.events.push(`${claimed} pocket marker${claimed === 1 ? '' : 's'} settled.`);
  }
}

export function applyMove(state, variant, puzzle, move, options = {}) {
  if (!isOnBoard(state.board, move)) {
    return { legal: false, reason: 'outside', state };
  }
  if (state.koLock && pointKey(move) === state.koLock) {
    return { legal: false, reason: 'ko-lock', state };
  }
  const cell = state.board[move.row][move.col];
  if (cell !== '.' && cell !== 'T') {
    return { legal: false, reason: 'occupied', state };
  }

  const next = cloneState(state);
  const preUrgent = getLightGroupsWithOneLiberty(next.board);
  const touchedBefore = getLightTouchCount(next.board, move);
  const previousKo = next.koLock;
  next.koLock = null;
  next.board[move.row][move.col] = 'B';

  let captured = captureAdjacentOpponentGroups(next.board, move, 'W');
  let ownGroup = getGroup(next.board, move, 'B');
  let sacrificed = false;

  if (!ownGroup || ownGroup.liberties.size === 0) {
    if (!variant.flags.sacrifice || touchedBefore === 0) {
      return { legal: false, reason: 'no-dark-breath', state };
    }
    next.board[move.row][move.col] = '.';
    sacrificed = true;
    next.sacrificeEvents += 1;
    for (const neighbor of neighbors(next.board, move)) {
      if (next.board[neighbor.row][neighbor.col] === 'W') {
        const group = getGroup(next.board, neighbor, 'W');
        group?.stones.forEach((stone) => next.markedLightKeys.add(pointKey(stone)));
      }
    }
    next.events.push('A dark offer vanishes and weakens nearby light.');
  } else if (variant.flags.strictBreath && captured.length === 0 && ownGroup.liberties.size < 2) {
    return { legal: false, reason: 'dark-chain-needs-two-breaths', state };
  }

  if (variant.flags.sacrifice && !sacrificed && touchedBefore > 0) {
    const markedCapture = [];
    for (const neighbor of neighbors(next.board, move)) {
      if (next.board[neighbor.row][neighbor.col] !== 'W') continue;
      const group = getGroup(next.board, neighbor, 'W');
      if (!group) continue;
      const markedCount = group.stones.filter((stone) => next.markedLightKeys.has(pointKey(stone))).length;
      if (markedCount > 0 && group.liberties.size <= 1) markedCapture.push(...group.stones);
    }
    if (markedCapture.length > 0) {
      removeStones(next.board, markedCapture);
      captured = [...captured, ...markedCapture];
      next.events.push(`Thin light clears for ${markedCapture.length}.`);
    }
  }

  if (captured.length > 0) {
    next.captures += captured.length;
    next.events.push(`Captured ${captured.length} light pebble${captured.length === 1 ? '' : 's'}.`);
  }
  if (touchedBefore > 1) next.sharedMoves += 1;
  if (captured.length === 0 && touchedBefore <= 1 && !sacrificed) next.fillerMoves += 1;
  ownGroup = sacrificed ? null : getGroup(next.board, move, 'B');
  if (ownGroup && ownGroup.liberties.size <= 1) next.riskMoves += 1;

  if (variant.flags.ko && captured.length === 1) {
    next.koLock = pointKey(captured[0]);
    next.koEvents += 1;
    next.events.push('The captured crossing is locked for one turn.');
  }
  if (variant.flags.release) applyRelease(next, puzzle);

  if (variant.flags.raceResponse && captured.length === 0) {
    const ignored = preUrgent.find((entry) => !entry.group.stones.some((stone) => neighbors(state.board, move).some((n) => pointKey(n) === pointKey(stone))));
    if (ignored) applyWhiteResponse(next, variant, ignored.liberties[0]);
  } else if (variant.flags.responsive && captured.length === 0) {
    applyWhiteResponse(next, variant, pickResponsiveMove(next.board, variant));
  }

  if (variant.flags.territory) applyTerritory(next);
  if (!next.koLock && previousKo) next.events.push('Previous ko lock clears.');

  next.moves.push(move);
  if (options.dryRun) return { legal: true, state };
  return { legal: true, state: next, captured, touchedBefore, sacrificed };
}

export function isSolved(state, variant, puzzle) {
  const lightSolved = getGroups(state.board, 'W').length === 0;
  if (!lightSolved) return false;
  if (variant.flags.lifeGoal) {
    const darkGroups = getGroups(state.board, 'B').sort((a, b) => b.stones.length - a.stones.length);
    if ((darkGroups[0]?.liberties.size ?? 0) < 2) return false;
  }
  if (variant.flags.territory) {
    const unsettled = state.board.flat().some((cell) => cell === 'T');
    if (unsettled) return false;
  }
  if (variant.flags.requireShared && state.sharedMoves < (puzzle.requiredShared ?? 1)) return false;
  if (variant.flags.budgeted && state.moves.length > puzzle.budget) return false;
  return true;
}

function transformLayout(layout, transformId) {
  const board = parseLayout(layout);
  const size = board.length;
  const at = (row, col) => board[row][col];
  const next = Array.from({ length: size }, () => Array.from({ length: size }, () => '.'));
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      let target;
      if (transformId === 1) target = { row: col, col: size - 1 - row };
      else if (transformId === 2) target = { row: size - 1 - row, col: size - 1 - col };
      else if (transformId === 3) target = { row, col: size - 1 - col };
      else target = { row, col };
      next[target.row][target.col] = at(row, col);
    }
  }
  return boardToLayout(next);
}

function findLightGroupsFromLayout(layout) {
  const board = parseLayout(layout);
  return getGroups(board, 'W').map((group) => group.stones);
}

function makeVariantPuzzle(base, variant, dayIndex) {
  let layout = transformLayout(base.layout, dayIndex % 4);
  const size = layout.length;
  const board = parseLayout(layout);
  const puzzle = {
    id: `${variant.id}-${base.id}-${dayIndex + 1}`,
    title: `${base.title} ${dayIndex + 1}`,
    variantId: variant.id,
    size,
    layout,
    budget: 12,
    requiredShared: variant.flags.requireShared ? 1 : 0,
    releaseLinks: [],
    lightGroups: findLightGroupsFromLayout(layout),
  };

  if (variant.flags.territory) {
    for (let row = 1; row < size - 1; row += 1) {
      for (let col = 1; col < size - 1; col += 1) {
        if (board[row][col] === '.' && (row + col + dayIndex) % 4 === 0) board[row][col] = 'T';
      }
    }
    puzzle.layout = boardToLayout(board);
  }

  return puzzle;
}

export function buildVariantPack(variantId, count = 12) {
  const variant = getVariantById(variantId);
  const sourcePuzzles = getSourcePuzzlesForVariant(variant);
  const pack = [];
  for (let index = 0; index < count; index += 1) {
    const base = sourcePuzzles[index % sourcePuzzles.length];
    const puzzle = makeVariantPuzzle(base, variant, index);
    if (variant.flags.release && base.releasePoint) {
      const transformed = transformPoint(base.releasePoint, puzzle.size, index % 4);
      puzzle.releaseLinks = [{ point: transformed, groupIndex: 0 }];
    }
    pack.push(puzzle);
  }
  return pack;
}

function getSourcePuzzlesForVariant(variant) {
  if (variant.flags.release) return RELEASE_BASE_PUZZLES;
  if (variant.flags.requireShared) return BASE_PUZZLES.filter((puzzle) => puzzle.id !== 'pocket');
  if (variant.flags.strictBreath) return BASE_PUZZLES.filter((puzzle) => puzzle.id !== 'hinge');
  return BASE_PUZZLES;
}

function transformPoint(point, size, transformId) {
  if (transformId === 1) return { row: point.col, col: size - 1 - point.row };
  if (transformId === 2) return { row: size - 1 - point.row, col: size - 1 - point.col };
  if (transformId === 3) return { row: point.row, col: size - 1 - point.col };
  return { ...point };
}

function sortMovesByHeuristic(state, variant, puzzle, moves) {
  return [...moves].sort((a, b) => {
    const score = (point) => {
      const result = applyMove(state, variant, puzzle, point);
      if (!result.legal) return -1000;
      const next = result.state;
      const captured = (result.captured?.length ?? 0) * 8;
      const shared = getLightTouchCount(state.board, point) * 4;
      const responsePenalty = next.responseEvents - state.responseEvents;
      const fillerPenalty = next.fillerMoves - state.fillerMoves;
      return captured + shared - responsePenalty * 2 - fillerPenalty;
    };
    return score(b) - score(a) || pointKey(a).localeCompare(pointKey(b));
  });
}

export function solvePuzzle(variant, puzzle, options = {}) {
  const maxDepth = options.maxDepth ?? (variant.flags.responsive || variant.flags.raceResponse ? 14 : 12);
  const initial = createInitialState(puzzle);
  const queue = [{ state: initial, solution: [] }];
  const seen = new Set([serializeState(initial)]);
  let expanded = 0;

  while (queue.length > 0 && expanded < (options.maxExpanded ?? 6000)) {
    const current = queue.shift();
    expanded += 1;
    if (isSolved(current.state, variant, puzzle)) {
      return { solved: true, solution: current.solution, state: current.state, expanded };
    }
    if (current.solution.length >= maxDepth) continue;
    const moves = sortMovesByHeuristic(current.state, variant, puzzle, getLegalMoves(current.state, variant, puzzle));
    for (const move of moves) {
      const result = applyMove(current.state, variant, puzzle, move);
      if (!result.legal) continue;
      const stateKey = serializeState(result.state);
      if (seen.has(stateKey)) continue;
      seen.add(stateKey);
      queue.push({ state: result.state, solution: [...current.solution, move] });
    }
  }

  return { solved: false, solution: [], state: initial, expanded };
}

export function replaySolution(variant, puzzle, solution) {
  let state = createInitialState(puzzle);
  const steps = [];
  for (const move of solution) {
    const result = applyMove(state, variant, puzzle, move);
    if (!result.legal) {
      return { solved: false, illegal: result.reason, state, steps };
    }
    state = result.state;
    steps.push({ move, events: [...state.events].slice(-3) });
  }
  return { solved: isSolved(state, variant, puzzle), illegal: null, state, steps };
}

export function auditSolvedPuzzle(variant, puzzle, solved) {
  const replay = replaySolution(variant, puzzle, solved.solution);
  const moves = solved.solution.length;
  const state = replay.state;
  const fillerRatio = moves > 0 ? state.fillerMoves / moves : 1;
  const sharedRatio = moves > 0 ? state.sharedMoves / moves : 0;
  const score =
    moves * -0.35 +
    state.sharedMoves * (variant.weights.sharedMove ?? 0) +
    state.captures * (variant.weights.capture ?? 0) +
    Math.max(0, state.captures - 1) * (variant.weights.multiCapture ?? 0) +
    state.responseEvents * (variant.weights.response ?? 0) +
    state.riskMoves * (variant.weights.risk ?? 0) +
    state.sacrificeEvents * (variant.weights.sacrifice ?? 0) +
    state.releaseEvents * (variant.weights.release ?? 0) +
    state.territoryEvents * (variant.weights.territory ?? 0) +
    state.koEvents * (variant.weights.ko ?? 0) +
    fillerRatio * (variant.weights.filler ?? 0);

  return {
    puzzleId: puzzle.id,
    solved: replay.solved,
    moves,
    captures: state.captures,
    sharedMoves: state.sharedMoves,
    fillerRatio,
    sharedRatio,
    responseEvents: state.responseEvents,
    riskMoves: state.riskMoves,
    sacrificeEvents: state.sacrificeEvents,
    releaseEvents: state.releaseEvents,
    territoryEvents: state.territoryEvents,
    koEvents: state.koEvents,
    expanded: solved.expanded,
    score,
  };
}

export function runVariantPlaytest({ packSize = 12 } = {}) {
  return VARIANTS.map((variant) => {
    const puzzles = buildVariantPack(variant.id, packSize);
    const audits = puzzles.map((puzzle) => {
      const solved = solvePuzzle(variant, puzzle);
      if (!solved.solved) {
        return {
          puzzleId: puzzle.id,
          solved: false,
          moves: 0,
          captures: 0,
          sharedMoves: 0,
          fillerRatio: 1,
          sharedRatio: 0,
          responseEvents: 0,
          riskMoves: 0,
          sacrificeEvents: 0,
          releaseEvents: 0,
          territoryEvents: 0,
          koEvents: 0,
          expanded: solved.expanded,
          score: -25,
        };
      }
      return auditSolvedPuzzle(variant, puzzle, solved);
    });
    const average = (field) => audits.reduce((sum, audit) => sum + audit[field], 0) / audits.length;
    const solvedCount = audits.filter((audit) => audit.solved).length;
    const weakCount = audits.filter((audit) => audit.score < 8).length;
    const dayToDayVariance = standardDeviation(audits.map((audit) => audit.score));
    return {
      variantId: variant.id,
      name: variant.name,
      thesis: variant.thesis,
      solvedCount,
      packSize: audits.length,
      averageMoves: average('moves'),
      averageScore: average('score'),
      averageFillerRatio: average('fillerRatio'),
      averageSharedMoves: average('sharedMoves'),
      averageResponses: average('responseEvents'),
      averageCaptures: average('captures'),
      averageRiskMoves: average('riskMoves'),
      weakCount,
      dayToDayVariance,
      audits,
    };
  }).sort((a, b) => b.averageScore - a.averageScore);
}

function standardDeviation(values) {
  if (values.length === 0) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length);
}

export function formatPoint(point) {
  return `R${point.row + 1} C${point.col + 1}`;
}
