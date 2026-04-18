import {
  formatTrade,
  getDailyBarter,
  getGoodById,
  tradeKey,
  validateBarterQuality,
  type BarterPuzzle,
  type Trade,
} from '../src/data/barterPuzzles.ts';

declare const process: { argv: string[] };

function readArg(name: string, fallback: string): string {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function dateAt(start: Date, offset: number): Date {
  const next = new Date(start);
  next.setDate(start.getDate() + offset);
  return next;
}

function formatGood(puzzle: BarterPuzzle, id: Parameters<typeof getGoodById>[0]): string {
  const good = puzzle.goods.find((candidate) => candidate.id === id) ?? getGoodById(id);
  return `${good.emoji} ${good.name}`;
}

function tradeShape(trade: Trade): string {
  const give = trade.give.map((side) => side.qty).join('+');
  const receive = trade.receive.map((side) => side.qty).join('+');
  return `${trade.window ?? 'early'}:${trade.give.length}[${give}]->${trade.receive.length}[${receive}]`;
}

function puzzleShape(puzzle: BarterPuzzle): string {
  return puzzle.trades.map(tradeShape).sort().join('|');
}

function maxRun(values: string[]): number {
  let longest = 0;
  let current = 0;
  let previous = '';
  values.forEach((value) => {
    current = value === previous ? current + 1 : 1;
    previous = value;
    longest = Math.max(longest, current);
  });
  return longest;
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return counts;
}

const startArg = readArg('start', new Date().toISOString().slice(0, 10));
const days = Number.parseInt(readArg('days', '7'), 10);
const start = new Date(`${startArg}T12:00:00`);
const archetypes: string[] = [];
const parValues: string[] = [];
const regretPatterns: string[] = [];
const shapeSignatures: string[] = [];

for (let day = 0; day < days; day++) {
  const puzzle = getDailyBarter(dateAt(start, day));
  const report = validateBarterQuality(puzzle);
  archetypes.push(puzzle.archetype ?? 'unknown');
  parValues.push(String(puzzle.par));
  regretPatterns.push(report.openingRegrets.map((entry) => entry.regret ?? 'dead').join('/'));
  shapeSignatures.push(puzzleShape(puzzle));
  const tradeByKey = new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));

  console.log(`\n${puzzle.dateKey} ${puzzle.marketEmoji} ${puzzle.marketName}`);
  console.log(
    `Topology: ${puzzle.topology ?? puzzle.archetype ?? 'unknown'} | Goal: ${puzzle.goal.qty} ${formatGood(puzzle, puzzle.goal.good)} | Par ${puzzle.par}/${puzzle.maxTrades}`
  );
  console.log(`Thesis: ${puzzle.thesis ?? 'n/a'}`);
  console.log(
    `Quality: ${report.accepted ? 'PASS' : 'FAIL'} | shortest=${report.shortestPathLength} routeIds=${report.nearOptimalRouteCount} firstMoves=${report.nearOptimalFirstMoveCount} regret=${report.maxEarlyRegret}`
  );
  console.log(
    `Pressure: bottleneck=${report.bottleneckGood ? formatGood(puzzle, report.bottleneckGood) : 'n/a'} | divergence=${report.routeDivergenceDepth ?? 'n/a'} | distance=${report.routeDistance} | compression=${report.compressionValue}`
  );
  console.log(
    `Hidden: ${report.hiddenVendorPurpose ?? 'n/a'} ${report.hiddenVendorKey ?? 'n/a'} | payoffVisible=${report.payoffVisibility} | personalities=${report.routePersonalities.join(',')}`
  );
  if (report.violations.length > 0) {
    console.log(`Violations: ${report.violations.join('; ')}`);
  }
  console.log('Opening regret:');
  report.openingRegrets.forEach((entry) => {
    const trade = tradeByKey.get(entry.tradeKey);
    const label = entry.regret === null ? 'dead' : entry.regret === 0 ? 'par' : `+${entry.regret}`;
    console.log(`- ${label} ${trade ? formatTrade(trade, (id) => (puzzle.goods.find((good) => good.id === id) ?? getGoodById(id)).emoji) : entry.tradeKey}`);
  });
  console.log('Trades:');
  puzzle.trades.forEach((trade) => {
    const hidden = trade.hiddenUntilNight ? ' hidden' : '';
    console.log(`- ${trade.role ?? 'trade'}${hidden} ${tradeKey(trade)} :: ${formatTrade(trade, (id) => (puzzle.goods.find((good) => good.id === id) ?? getGoodById(id)).emoji)}`);
  });
  console.log(`Insight: ${report.strategicInsight}`);
  if (report.bestRoute) {
    console.log(`Best route: ${report.bestRoute.tradeKeys.join(' / ')}`);
  }
  if (report.alternateRoute) {
    console.log(`Alternate: ${report.alternateRoute.tradeKeys.join(' / ')}`);
  }
}

console.log('\nRolling summary');
console.log(`Archetypes: ${Array.from(countBy(archetypes).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Pars: ${Array.from(countBy(parValues).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Max archetype run: ${maxRun(archetypes)}`);
console.log(`Shape signatures: ${countBy(shapeSignatures).size}`);
console.log(`Regret patterns: ${Array.from(countBy(regretPatterns).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
