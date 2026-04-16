// @ts-nocheck
import { getDailyBarter, getGoodById } from '../src/data/barterPuzzles.ts';
import type { GoodId, Trade, TradeWindow } from '../src/data/barterPuzzles.ts';

type Inventory = Record<GoodId, number>;

interface GraphNode {
  id: string;
  step: number;
  inv: Inventory;
  goalQty: number;
  win: boolean;
}

interface GraphEdge {
  from: string;
  to: string;
  trade: Trade;
}

interface LayerStats {
  step: number;
  states: number;
  winningStates: number;
  avgBranching: number;
}

const DEFAULT_DATES = [
  '2026-04-23',
  '2026-04-26',
  '2026-05-09',
  '2026-05-25',
  '2026-06-18',
];

const DEFAULT_DEPTH = 6;
const DEFAULT_MAX_NODES = 120;

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const entry = process.argv.find((arg) => arg.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : undefined;
}

function parseDates(): string[] {
  const cli = parseArg('dates');
  if (!cli) return DEFAULT_DATES;
  return cli
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseNumber(name: string, fallback: number): number {
  const raw = parseArg(name);
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.floor(value);
}

function canAfford(inv: Inventory, trade: Trade): boolean {
  return trade.give.every((side) => inv[side.good] >= side.qty);
}

function applyTrade(inv: Inventory, trade: Trade): Inventory {
  const next = { ...inv };
  trade.give.forEach((side) => {
    next[side.good] -= side.qty;
  });
  next[trade.get.good] += trade.get.qty;
  (Object.keys(next) as GoodId[]).forEach((id) => {
    next[id] = Math.min(200, next[id]);
  });
  return next;
}

function nodeKey(step: number, inv: Inventory, goods: GoodId[]): string {
  return `${step}|${goods.map((id) => inv[id]).join(',')}`;
}

function formatTrade(trade: Trade): string {
  const give = trade.give
    .map((side) => `${side.qty}${getGoodById(side.good).emoji}`)
    .join('+');
  const get = `${trade.get.qty}${getGoodById(trade.get.good).emoji}`;
  return `${give}→${get}`;
}

function summarizeInventory(inv: Inventory, goods: GoodId[]): string {
  return goods
    .filter((id) => inv[id] > 0)
    .sort((a, b) => inv[b] - inv[a])
    .slice(0, 3)
    .map((id) => `${inv[id]}${getGoodById(id).emoji}`)
    .join(' ');
}

function buildDecisionGraph(dateKey: string, maxDepth: number, maxNodes: number) {
  const puzzle = getDailyBarter(new Date(`${dateKey}T00:00:00Z`));
  const goods = puzzle.goods.map((g) => g.id);
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const byStep = new Map<number, string[]>();
  const branchCounts = new Map<string, number>();

  const start: GraphNode = {
    id: 'N0',
    step: 0,
    inv: { ...puzzle.inventory },
    goalQty: puzzle.inventory[puzzle.goal.good],
    win: puzzle.inventory[puzzle.goal.good] >= puzzle.goal.qty,
  };

  const queue: GraphNode[] = [start];
  nodes.set(nodeKey(0, start.inv, goods), start);
  byStep.set(0, [start.id]);

  let nextId = 1;
  while (queue.length > 0 && nodes.size < maxNodes) {
    const current = queue.shift();
    if (!current) break;
    if (current.step >= maxDepth) continue;
    if (current.win) continue;

    const window: TradeWindow =
      current.step < puzzle.earlyWindowTrades ? 'early' : 'late';
    const available = puzzle.trades.filter((trade) => {
      const tradeWindow = trade.window ?? 'early';
      if (window === 'early' && tradeWindow === 'late') return false;
      if (window === 'late' && tradeWindow !== 'late') return false;
      return canAfford(current.inv, trade);
    });

    branchCounts.set(current.id, available.length);

    for (const trade of available) {
      if (nodes.size >= maxNodes) break;
      const nextInv = applyTrade(current.inv, trade);
      const nextStep = current.step + 1;
      const key = nodeKey(nextStep, nextInv, goods);
      let target = nodes.get(key);
      if (!target) {
        target = {
          id: `N${nextId++}`,
          step: nextStep,
          inv: nextInv,
          goalQty: nextInv[puzzle.goal.good],
          win: nextInv[puzzle.goal.good] >= puzzle.goal.qty,
        };
        nodes.set(key, target);
        queue.push(target);
        const layer = byStep.get(nextStep) ?? [];
        layer.push(target.id);
        byStep.set(nextStep, layer);
      }
      edges.push({ from: current.id, to: target.id, trade });
    }
  }

  const layerStats: LayerStats[] = [];
  const maxStep = Math.max(...Array.from(byStep.keys()));
  for (let step = 0; step <= maxStep; step++) {
    const ids = byStep.get(step) ?? [];
    const layerNodes = ids
      .map((id) => Array.from(nodes.values()).find((node) => node.id === id))
      .filter((node): node is GraphNode => Boolean(node));
    const winningStates = layerNodes.filter((node) => node.win).length;
    const activeBranchNodes = layerNodes.filter((node) => branchCounts.has(node.id));
    const avgBranching =
      activeBranchNodes.length === 0
        ? 0
        : activeBranchNodes.reduce((sum, node) => sum + (branchCounts.get(node.id) ?? 0), 0) /
          activeBranchNodes.length;
    layerStats.push({
      step,
      states: layerNodes.length,
      winningStates,
      avgBranching,
    });
  }

  return { puzzle, nodes: Array.from(nodes.values()), edges, layerStats, maxNodesReached: nodes.size >= maxNodes };
}

function mermaidForGraph(
  graph: ReturnType<typeof buildDecisionGraph>,
  maxEdges = 180
): string {
  const { puzzle, nodes, edges } = graph;
  const goods = puzzle.goods.map((g) => g.id);
  const keptEdges = edges.slice(0, maxEdges);
  const referenced = new Set<string>();
  keptEdges.forEach((edge) => {
    referenced.add(edge.from);
    referenced.add(edge.to);
  });
  referenced.add('N0');

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const lines: string[] = ['flowchart TD'];
  Array.from(referenced)
    .map((id) => byId.get(id))
    .filter((node): node is GraphNode => Boolean(node))
    .sort((a, b) => a.step - b.step || a.id.localeCompare(b.id))
    .forEach((node) => {
      const inv = summarizeInventory(node.inv, goods);
      const goalText = `${node.goalQty}/${puzzle.goal.qty}${getGoodById(puzzle.goal.good).emoji}`;
      const label = `t${node.step} | goal ${goalText}${inv ? ` | ${inv}` : ''}`;
      const shape = node.win ? `(["${label} ✅"])` : `["${label}"]`;
      lines.push(`  ${node.id}${shape}`);
    });

  keptEdges.forEach((edge) => {
    lines.push(`  ${edge.from} -->|${formatTrade(edge.trade)}| ${edge.to}`);
  });
  return lines.join('\n');
}

function markdownForPuzzle(dateKey: string, maxDepth: number, maxNodes: number): string {
  const graph = buildDecisionGraph(dateKey, maxDepth, maxNodes);
  const { puzzle, layerStats, maxNodesReached } = graph;
  const startInventory = puzzle.goods
    .filter((good) => puzzle.inventory[good.id] > 0)
    .map((good) => `${puzzle.inventory[good.id]} ${good.emoji} ${good.name}`)
    .join(', ');
  const totalNodes = graph.nodes.length;
  const totalEdges = graph.edges.length;

  const statsTable = [
    '| Step | Reachable states | Winning states | Avg branching |',
    '|---:|---:|---:|---:|',
    ...layerStats.map(
      (row) =>
        `| ${row.step} | ${row.states} | ${row.winningStates} | ${row.avgBranching.toFixed(2)} |`
    ),
  ].join('\n');

  return [
    `## ${dateKey} — ${puzzle.marketName} ${puzzle.marketEmoji}`,
    '',
    `- Strategy profile: \`${puzzle.strategyProfile}\``,
    `- Goal: ${puzzle.goal.qty} ${getGoodById(puzzle.goal.good).emoji} ${getGoodById(puzzle.goal.good).name}`,
    `- Start inventory: ${startInventory}`,
    `- Early window trades: ${puzzle.earlyWindowTrades} · Max trades: ${puzzle.maxTrades} · Par: ${puzzle.par}`,
    `- Graph coverage: ${totalNodes} states, ${totalEdges} transitions (depth ≤ ${maxDepth})${maxNodesReached ? `, capped at ${maxNodes} states` : ''}`,
    '',
    statsTable,
    '',
    '```mermaid',
    mermaidForGraph(graph),
    '```',
    '',
  ].join('\n');
}

function main() {
  const dates = parseDates();
  const depth = parseNumber('depth', DEFAULT_DEPTH);
  const maxNodes = parseNumber('maxNodes', DEFAULT_MAX_NODES);

  const sections = dates.map((date) => markdownForPuzzle(date, depth, maxNodes));
  const header = [
    '# Barter Decision Trees',
    '',
    `Generated with \`node --experimental-strip-types scripts/barter-decision-tree.ts --depth=${depth} --maxNodes=${maxNodes}\`.`,
    '',
    'This view shows deduplicated reachable inventory states by turn and all affordable transitions among those states for each selected puzzle date.',
    '',
  ].join('\n');

  process.stdout.write(`${header}${sections.join('\n')}`);
}

main();
