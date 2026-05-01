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
const textures: string[] = [];
const parValues: string[] = [];
const regretPatterns: string[] = [];
const regretSignatures: string[] = [];
const regretRoleSignatures: string[] = [];
const shapeSignatures: string[] = [];
const roleSkeletonSignatures: string[] = [];
const dayMarketCounts: string[] = [];
const nightMarketCounts: string[] = [];
const hiddenVendorUsages: string[] = [];
const feltTheses: string[] = [];
const playerSolveFeels: string[] = [];
const firstQuestions: string[] = [];
const startEconomies: string[] = [];
const economicTheses: string[] = [];
const startInventorySignatures: string[] = [];
const startSilhouettes: string[] = [];
const startQuantitySilhouettes: string[] = [];
const nightRoleSignatures: string[] = [];
const nightScriptSignatures: string[] = [];
const nightCashoutPatterns: string[] = [];
const dayCloseTargetSignatures: string[] = [];
const solveFeelSignatures: string[] = [];
const nightRoleDiversity: string[] = [];
const repeatedGoalCashouts: string[] = [];
const signatureValues: string[] = [];
const optimalFirstMoveCounts: string[] = [];
const bestRouteRepeats: string[] = [];
const adjacentSimilarityScores: number[] = [];
let plusTwoRegretDays = 0;
let previousReport: ReturnType<typeof validateBarterQuality> | null = null;

function adjacentSimilarityScore(
  previous: ReturnType<typeof validateBarterQuality> | null,
  current: ReturnType<typeof validateBarterQuality>
): number {
  if (!previous) return 0;
  let score = 0;
  if (previous.playerSolveFeel === current.playerSolveFeel) score += 4;
  if (previous.startQuantitySilhouette === current.startQuantitySilhouette) score += 3;
  if (previous.nightCashoutPattern === current.nightCashoutPattern) score += 3;
  if (previous.dayCloseTargetSignature === current.dayCloseTargetSignature) score += 2;
  if (previous.firstQuestion === current.firstQuestion) score += 1;
  if (previous.startEconomy === current.startEconomy) score += 1;
  return score;
}

function cooldownRepeatCount(values: string[], cooldown: number): number {
  let repeats = 0;
  for (let index = 0; index < values.length; index++) {
    const start = Math.max(0, index - cooldown);
    if (values.slice(start, index).includes(values[index])) repeats += 1;
  }
  return repeats;
}

for (let day = 0; day < days; day++) {
  const puzzle = getDailyBarter(dateAt(start, day));
  const report = validateBarterQuality(puzzle);
  const adjacentScore = adjacentSimilarityScore(previousReport, report);
  const dayTrades = puzzle.trades.filter((trade) => trade.window !== 'late');
  const nightTrades = puzzle.trades.filter((trade) => trade.window === 'late');
  archetypes.push(puzzle.archetype ?? 'unknown');
  textures.push(puzzle.texture ?? 'unknown');
  parValues.push(String(puzzle.par));
  regretPatterns.push(report.openingRegrets.map((entry) => entry.regret ?? 'dead').join('/'));
  regretSignatures.push(report.openingRegretSignature);
  regretRoleSignatures.push(report.regretRoleSignature);
  shapeSignatures.push(puzzleShape(puzzle));
  roleSkeletonSignatures.push(report.roleSkeletonSignature);
  dayMarketCounts.push(String(dayTrades.length));
  nightMarketCounts.push(String(nightTrades.length));
  hiddenVendorUsages.push(report.hiddenVendorUsage ?? 'none');
  feltTheses.push(report.feltThesis ?? 'unknown');
  playerSolveFeels.push(report.playerSolveFeel ?? 'unknown');
  firstQuestions.push(report.firstQuestion);
  startEconomies.push(report.startEconomy ?? 'unknown');
  economicTheses.push(report.economicThesis ?? 'unknown');
  startInventorySignatures.push(report.startInventorySignature);
  startSilhouettes.push(report.startSilhouette);
  startQuantitySilhouettes.push(report.startQuantitySilhouette);
  nightRoleSignatures.push(report.nightRoleSignature);
  nightScriptSignatures.push(report.nightScriptSignature);
  nightCashoutPatterns.push(report.nightCashoutPattern);
  dayCloseTargetSignatures.push(report.dayCloseTargetSignature);
  solveFeelSignatures.push(report.solveFeelSignature);
  adjacentSimilarityScores.push(adjacentScore);
  nightRoleDiversity.push(String(report.bestRouteNightRoleDiversity));
  repeatedGoalCashouts.push(String(report.repeatedGoalCashoutCount));
  signatureValues.push(String(report.signatureTurnValue));
  optimalFirstMoveCounts.push(String(report.optimalFirstMoveCount));
  bestRouteRepeats.push(String(report.bestRouteMaxRepeat));
  if (report.maxEarlyRegret === 2) plusTwoRegretDays += 1;
  const tradeByKey = new Map(puzzle.trades.map((trade) => [tradeKey(trade), trade]));

  console.log(`\n${puzzle.dateKey} ${puzzle.marketEmoji} ${puzzle.marketName}`);
  console.log(
    `Topology: ${puzzle.topology ?? puzzle.archetype ?? 'unknown'} | Texture: ${puzzle.texture ?? 'unknown'} | Goal: ${puzzle.goal.qty} ${formatGood(puzzle, puzzle.goal.good)} | Par ${puzzle.par}/${puzzle.maxTrades}`
  );
  console.log(`Thesis: ${puzzle.thesis ?? 'n/a'}`);
  console.log(
    `Felt thesis: ${report.feltThesis ?? 'n/a'} | Solve feel: ${report.playerSolveFeel ?? 'n/a'} | First question: ${report.firstQuestion} | Visible premise: ${report.visiblePremiseTradeKey ?? 'n/a'}`
  );
  console.log(
    `Start economy: ${report.startEconomy ?? 'n/a'} | Economic thesis: ${report.economicThesis ?? 'n/a'} | Start signature: ${report.startInventorySignature}`
  );
  console.log(`Start silhouette: ${report.startSilhouette}`);
  console.log(`Player feel: start=${report.startQuantitySilhouette} | day-close=${report.dayCloseTargetSignature} | night=${report.nightCashoutPattern} | adjacent=${adjacentScore}`);
  console.log(
    `Quality: ${report.accepted ? 'PASS' : 'FAIL'} | shortest=${report.shortestPathLength} routeIds=${report.nearOptimalRouteCount} firstMoves=${report.nearOptimalFirstMoveCount} regret=${report.maxEarlyRegret} signature=${report.signatureTurnValue} repeat=${report.bestRouteMaxRepeat}`
  );
  console.log(
    `Pressure: bottleneck=${report.bottleneckGood ? formatGood(puzzle, report.bottleneckGood) : 'n/a'} | divergence=${report.routeDivergenceDepth ?? 'n/a'} | distance=${report.routeDistance} | compression=${report.compressionValue}`
  );
  console.log(
    `Night roles: diversity=${report.bestRouteNightRoleDiversity} | repeated goal cashouts=${report.repeatedGoalCashoutCount} | ${report.nightRoleSignature}`
  );
  console.log(`Night script: ${report.nightScriptSignature}`);
  console.log(
    `Hidden: ${report.hiddenVendorPurpose ?? 'n/a'} / ${report.hiddenVendorUsage ?? 'none'} ${report.hiddenVendorKey ?? 'n/a'} | payoffVisible=${report.payoffVisibility} | personalities=${report.routePersonalities.join(',')}`
  );
  if (report.violations.length > 0) {
    console.log(`Violations: ${report.violations.join('; ')}`);
  }
  console.log('Opening regret:');
  console.log(`Signature: ${report.openingRegretSignature}`);
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
  console.log(`Motif evidence: ${report.motifEvidence.join(', ')}`);
  if (report.bestRoute) {
    console.log(`Best route: ${report.bestRoute.tradeKeys.join(' / ')}`);
  }
  if (report.alternateRoute) {
    console.log(`Alternate: ${report.alternateRoute.tradeKeys.join(' / ')}`);
  }
  previousReport = report;
}

console.log('\nRolling summary');
console.log(`Archetypes: ${Array.from(countBy(archetypes).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Textures: ${Array.from(countBy(textures).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Pars: ${Array.from(countBy(parValues).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Day Market counts: ${Array.from(countBy(dayMarketCounts).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Night Market counts: ${Array.from(countBy(nightMarketCounts).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`+2 regret days: ${plusTwoRegretDays}`);
console.log(`Optimal first moves: ${Array.from(countBy(optimalFirstMoveCounts).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Signature values: ${Array.from(countBy(signatureValues).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Best route max repeat: ${Array.from(countBy(bestRouteRepeats).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Hidden vendor usage: ${Array.from(countBy(hiddenVendorUsages).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Felt theses: ${Array.from(countBy(feltTheses).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Player solve feels: ${Array.from(countBy(playerSolveFeels).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`First questions: ${Array.from(countBy(firstQuestions).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Start economies: ${Array.from(countBy(startEconomies).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Economic theses: ${Array.from(countBy(economicTheses).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Start inventory signatures: ${countBy(startInventorySignatures).size}`);
console.log(`Start silhouettes: ${countBy(startSilhouettes).size}`);
console.log(`Start quantity silhouettes: ${countBy(startQuantitySilhouettes).size}`);
console.log(`Night role diversity: ${Array.from(countBy(nightRoleDiversity).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Repeated goal cashouts: ${Array.from(countBy(repeatedGoalCashouts).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Night role signatures: ${countBy(nightRoleSignatures).size}`);
console.log(`Night script signatures: ${countBy(nightScriptSignatures).size}`);
console.log(`Night cashout patterns: ${countBy(nightCashoutPatterns).size}`);
console.log(`Day-close target signatures: ${countBy(dayCloseTargetSignatures).size}`);
console.log(`Solve feel signatures: ${countBy(solveFeelSignatures).size}`);
console.log(`Solve feel repeats inside 21 days: ${cooldownRepeatCount(solveFeelSignatures, 21)}`);
console.log(`Max adjacent similarity: ${Math.max(0, ...adjacentSimilarityScores)}`);
console.log(`Max archetype run: ${maxRun(archetypes)}`);
console.log(`Shape signatures: ${countBy(shapeSignatures).size}`);
console.log(`Role skeleton signatures: ${countBy(roleSkeletonSignatures).size}`);
console.log(`Regret patterns: ${Array.from(countBy(regretPatterns).entries()).map(([key, count]) => `${key}=${count}`).join(', ')}`);
console.log(`Regret signatures: ${countBy(regretSignatures).size}`);
console.log(`Regret role signatures: ${countBy(regretRoleSignatures).size}`);
