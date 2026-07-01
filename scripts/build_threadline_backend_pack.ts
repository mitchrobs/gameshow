import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  THREADLINE_RUNTIME_COMPACT_PUZZLES,
  THREADLINE_RUNTIME_DATED_INDEXES,
  THREADLINE_RUNTIME_READY_RESERVE_INDEXES,
} from '../src/data/threadlineRuntimePackData.ts';
import { THREADLINE_RUNTIME_GRID_COLS } from '../src/data/threadlineRuntimePack.ts';

const compactPuzzles = THREADLINE_RUNTIME_COMPACT_PUZZLES as unknown as unknown[];
const datedIndexes = THREADLINE_RUNTIME_DATED_INDEXES as unknown as Array<[string, number]>;
const reserveIndexes = THREADLINE_RUNTIME_READY_RESERVE_INDEXES as unknown as number[];

const datedSchedule: Record<string, number> = {};
for (const [dateKey, puzzleIndex] of datedIndexes) {
  datedSchedule[dateKey] = puzzleIndex;
}

const pack = {
  pack_id: 'threadline_gameshow_runtime_v1',
  locale: 'en-US',
  grid_cols: THREADLINE_RUNTIME_GRID_COLS,
  puzzles: compactPuzzles,
  dated_schedule: datedSchedule,
  reserve_indexes: reserveIndexes,
};

const outputPath = resolve(
  fileURLToPath(import.meta.url),
  '../../../supertime-backend/internal/generator/threadline/data/threadline_runtime_pack.json'
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(pack)}\n`);

console.log(
  `Wrote ${compactPuzzles.length} Threadline puzzles, ` +
    `${Object.keys(datedSchedule).length} dated calendar entries, and ` +
    `${reserveIndexes.length} reserve indexes to ${outputPath}.`
);
