import { describe, expect, it } from 'vitest';
import {
  BridgesBridge,
  BridgesIsland,
  BridgesPuzzle,
  getDailyBridges,
} from './bridgesPuzzles';

function bridgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function buildNeighborPairs(islands: BridgesIsland[]): Set<string> {
  const pairs = new Set<string>();
  islands.forEach((island) => {
    let left: BridgesIsland | null = null;
    let right: BridgesIsland | null = null;
    let up: BridgesIsland | null = null;
    let down: BridgesIsland | null = null;

    islands.forEach((other) => {
      if (other.id === island.id) return;
      if (other.row === island.row) {
        if (other.col < island.col && (!left || other.col > left.col)) left = other;
        if (other.col > island.col && (!right || other.col < right.col)) right = other;
      }
      if (other.col === island.col) {
        if (other.row < island.row && (!up || other.row > up.row)) up = other;
        if (other.row > island.row && (!down || other.row < down.row)) down = other;
      }
    });

    const neighbors: Array<BridgesIsland | null> = [left, right, up, down];
    neighbors.forEach((neighbor) => {
      if (neighbor) pairs.add(bridgeKey(island.id, neighbor.id));
    });
  });
  return pairs;
}

function wouldCross(
  candidate: BridgesBridge,
  existing: BridgesBridge,
  islandMap: Map<number, BridgesIsland>
): boolean {
  const a = islandMap.get(candidate.island1);
  const b = islandMap.get(candidate.island2);
  const c = islandMap.get(existing.island1);
  const d = islandMap.get(existing.island2);
  if (!a || !b || !c || !d) return false;
  const candHorizontal = a.row === b.row;
  const existHorizontal = c.row === d.row;
  if (candHorizontal === existHorizontal) return false;

  const h = candHorizontal
    ? { row: a.row, minCol: Math.min(a.col, b.col), maxCol: Math.max(a.col, b.col) }
    : { row: c.row, minCol: Math.min(c.col, d.col), maxCol: Math.max(c.col, d.col) };
  const v = candHorizontal
    ? { col: c.col, minRow: Math.min(c.row, d.row), maxRow: Math.max(c.row, d.row) }
    : { col: a.col, minRow: Math.min(a.row, b.row), maxRow: Math.max(a.row, b.row) };

  return v.col > h.minCol && v.col < h.maxCol && h.row > v.minRow && h.row < v.maxRow;
}

function assertValidPuzzle(puzzle: BridgesPuzzle) {
  const islandMap = new Map<number, BridgesIsland>();
  puzzle.islands.forEach((island) => islandMap.set(island.id, island));
  const neighborPairs = buildNeighborPairs(puzzle.islands);
  const counts: Record<number, number> = {};
  puzzle.islands.forEach((island) => {
    counts[island.id] = 0;
    expect(island.row).toBeGreaterThanOrEqual(0);
    expect(island.row).toBeLessThan(puzzle.rowCount);
    expect(island.col).toBeGreaterThanOrEqual(0);
    expect(island.col).toBeLessThan(puzzle.colCount);
  });

  puzzle.solution.forEach((bridge, index) => {
    expect(bridge.count === 1 || bridge.count === 2).toBe(true);
    expect(neighborPairs.has(bridgeKey(bridge.island1, bridge.island2))).toBe(true);
    counts[bridge.island1] += bridge.count;
    counts[bridge.island2] += bridge.count;
    puzzle.solution.slice(index + 1).forEach((other) => {
      expect(wouldCross(bridge, other, islandMap)).toBe(false);
    });
  });

  puzzle.islands.forEach((island) => {
    expect(counts[island.id]).toBe(island.requiredBridges);
    expect(island.requiredBridges).toBeGreaterThan(0);
    expect(island.requiredBridges).toBeLessThanOrEqual(8);
  });

  const visited = new Set<number>();
  const stack = [puzzle.islands[0]?.id];
  while (stack.length) {
    const current = stack.pop();
    if (current === undefined || visited.has(current)) continue;
    visited.add(current);
    puzzle.solution
      .filter((bridge) => bridge.island1 === current || bridge.island2 === current)
      .forEach((bridge) => {
        stack.push(bridge.island1 === current ? bridge.island2 : bridge.island1);
      });
  }
  expect(visited.size).toBe(puzzle.islands.length);
}

describe('getDailyBridges', () => {
  it('generates valid connected non-crossing puzzles for a long daily run', () => {
    for (let offset = 0; offset < 120; offset += 1) {
      const puzzle = getDailyBridges(new Date(2026, 0, 1 + offset));
      assertValidPuzzle(puzzle);
    }
  });

  it('keeps the average daily difficulty 50% higher than the old Easy/Medium pool', () => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    for (let offset = 0; offset < 28; offset += 1) {
      counts[getDailyBridges(new Date(2026, 3, 17 + offset)).difficulty] += 1;
    }

    expect(counts).toEqual({ Easy: 7, Medium: 7, Hard: 14 });
    expect((counts.Easy + counts.Medium * 2 + counts.Hard * 3) / 28).toBe(2.25);
  });

  it('uses non-square map shapes instead of only larger square grids', () => {
    const shapes = new Set<string>();
    let rectangularCount = 0;
    for (let offset = 0; offset < 60; offset += 1) {
      const puzzle = getDailyBridges(new Date(2026, 5, 1 + offset));
      shapes.add(puzzle.shape);
      if (puzzle.rowCount !== puzzle.colCount) rectangularCount += 1;
    }

    expect(shapes.size).toBeGreaterThan(3);
    expect(rectangularCount).toBeGreaterThan(20);
  });
});
