import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateBarterPuzzle } from '../src/data/barter/generator.ts';
import type { BarterPuzzle } from '../src/data/barter/types.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const outputPath = resolve(repoRoot, 'src/data/barter/precomputedDaily.ts');
const startDate = '2026-04-16';
const days = 56;

function dateAt(offset: number): Date {
  const date = new Date(`${startDate}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return date;
}

function dailySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function serializePuzzle(puzzle: BarterPuzzle): string {
  return JSON.stringify(puzzle, null, 2);
}

const entries = new Map<string, BarterPuzzle>();

for (let offset = 0; offset < days; offset += 1) {
  const date = dateAt(offset);
  const puzzle = generateBarterPuzzle(dailySeed(date), date);
  entries.set(puzzle.dateKey, puzzle);
  console.log(`${puzzle.dateKey} par=${puzzle.par} goal=${puzzle.goal.qty} ${puzzle.goal.good}`);
}

const body = `import type { BarterPuzzle } from './types.ts';

export const PRECOMPUTED_BARTER_PUZZLES: Record<string, BarterPuzzle> = {
${Array.from(entries)
  .map(([dateKey, puzzle]) => `  ${JSON.stringify(dateKey)}: ${serializePuzzle(puzzle)},`)
  .join('\n')}
};

export type PrecomputedBarterDateKey = keyof typeof PRECOMPUTED_BARTER_PUZZLES;
`;

writeFileSync(outputPath, body);
console.log(`Wrote ${entries.size} precomputed Barter puzzles to ${outputPath}`);
