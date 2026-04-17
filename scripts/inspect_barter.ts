import {
  formatTrade,
  getDailyBarter,
  getGoodById,
  tradeKey,
  validateBarterQuality,
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

function formatGood(id: Parameters<typeof getGoodById>[0]): string {
  const good = getGoodById(id);
  return `${good.emoji} ${good.name}`;
}

const startArg = readArg('start', new Date().toISOString().slice(0, 10));
const days = Number.parseInt(readArg('days', '7'), 10);
const start = new Date(`${startArg}T12:00:00`);

for (let day = 0; day < days; day++) {
  const puzzle = getDailyBarter(dateAt(start, day));
  const report = validateBarterQuality(puzzle);
  console.log(`\n${puzzle.dateKey} ${puzzle.marketEmoji} ${puzzle.marketName}`);
  console.log(`Goal: ${puzzle.goal.qty} ${formatGood(puzzle.goal.good)} | Par ${puzzle.par}`);
  console.log(
    `Quality: ${report.accepted ? 'PASS' : 'FAIL'} | shortest=${report.shortestPathLength} nearRoutes=${report.nearOptimalRouteCount} firstMoves=${report.nearOptimalFirstMoveCount}`
  );
  if (report.violations.length > 0) {
    console.log(`Violations: ${report.violations.join('; ')}`);
  }
  console.log('Trades:');
  puzzle.trades.forEach((trade) => {
    console.log(`- ${trade.role ?? 'trade'} ${tradeKey(trade)} :: ${formatTrade(trade, (id) => getGoodById(id).emoji)}`);
  });
  console.log(`Insight: ${report.strategicInsight}`);
  if (report.bestRoute) {
    console.log(`Best route: ${report.bestRoute.tradeKeys.join(' / ')}`);
  }
  if (report.alternateRoute) {
    console.log(`Alternate: ${report.alternateRoute.tradeKeys.join(' / ')}`);
  }
}
