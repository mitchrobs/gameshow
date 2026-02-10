import { getDailyBarter, GoodId, Trade, TradeWindow } from '../src/data/barterPuzzles';

type Inventory = Record<GoodId, number>;

function canAfford(inv: Inventory, trade: Trade): boolean {
  return trade.give.every((side) => inv[side.good] >= side.qty);
}

function applyTrade(inv: Inventory, trade: Trade): Inventory {
  const next: Inventory = { ...inv };
  trade.give.forEach((side) => {
    next[side.good] -= side.qty;
  });
  next[trade.get.good] += trade.get.qty;
  (Object.keys(next) as GoodId[]).forEach((id) => {
    next[id] = Math.min(200, next[id]);
  });
  return next;
}

function shortestPathLength(puzzle: ReturnType<typeof getDailyBarter>): number | null {
  const ids = puzzle.goods.map((g) => g.id);
  const encode = (inv: Inventory, stage: number) =>
    `${stage}|${ids.map((id) => inv[id]).join(',')}`;
  const queue: Array<{ inv: Inventory; steps: number; stage: number }> = [
    { inv: puzzle.inventory, steps: 0, stage: 0 },
  ];
  const earlyVisited = new Map<string, number>();
  const lateVisited = new Set<string>();
  earlyVisited.set(encode(puzzle.inventory, 0), 0);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    const { inv, steps, stage } = current;
    if (steps >= puzzle.maxTrades) continue;
    const inEarly = steps < puzzle.earlyWindowTrades;
    const trades = puzzle.trades.filter((trade) =>
      inEarly ? (trade.window ?? 'early') !== 'late' : trade.window === 'late'
    );

    for (const trade of trades) {
      const requiredStage = stage + 1;
      const tradeStage = trade.stage ?? requiredStage;
      if (tradeStage !== requiredStage) continue;
      if (!canAfford(inv, trade)) continue;
      const next = applyTrade(inv, trade);
      const nextSteps = steps + 1;
      if (next[puzzle.goal.good] >= puzzle.goal.qty) {
        return nextSteps;
      }
      if (nextSteps >= puzzle.maxTrades) continue;

      const key = encode(next, tradeStage);
      if (nextSteps < puzzle.earlyWindowTrades) {
        const prev = earlyVisited.get(key);
        if (prev !== undefined && prev <= nextSteps) continue;
        earlyVisited.set(key, nextSteps);
      } else {
        if (lateVisited.has(key)) continue;
        lateVisited.add(key);
      }
      queue.push({ inv: next, steps: nextSteps, stage: tradeStage });
    }
  }

  return null;
}

function countChoices(
  puzzle: ReturnType<typeof getDailyBarter>,
  depth = 4
): number[] {
  const counts: number[] = [];
  let inv: Inventory = { ...puzzle.inventory };
  for (let step = 0; step < Math.min(depth, puzzle.solution.length); step++) {
    const inEarly = step < puzzle.earlyWindowTrades;
    const window: TradeWindow = inEarly ? 'early' : 'late';
    const stage = step + 1;
    const available = puzzle.trades.filter((trade) => {
      const tradeWindow = trade.window ?? 'early';
      if (window === 'early' && tradeWindow === 'late') return false;
      if (window === 'late' && tradeWindow !== 'late') return false;
      if ((trade.stage ?? stage) !== stage) return false;
      return canAfford(inv, trade);
    });
    counts.push(available.length);
    const nextTrade = puzzle.solution[step];
    if (!nextTrade || !canAfford(inv, nextTrade)) break;
    inv = applyTrade(inv, nextTrade);
  }
  return counts;
}

const puzzle = getDailyBarter();
const shortest = shortestPathLength(puzzle);
const choices = countChoices(puzzle, 4);

console.log('Barter daily check');
console.log(`Market: ${puzzle.marketName} ${puzzle.marketEmoji}`);
console.log(`Goal: ${puzzle.goal.qty} ${puzzle.goal.good}`);
console.log(`Early window trades: ${puzzle.earlyWindowTrades}`);
console.log(`Max trades: ${puzzle.maxTrades}`);
console.log(`Shortest path length: ${shortest ?? 'n/a'}`);
console.log(`Choices in first turns: ${choices.join(', ')}`);
