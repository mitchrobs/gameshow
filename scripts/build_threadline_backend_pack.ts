import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  THREADLINE_RUNTIME_COMPACT_PUZZLES,
  THREADLINE_RUNTIME_DATED_INDEXES,
  THREADLINE_RUNTIME_READY_RESERVE_INDEXES,
} from '../src/data/threadlineRuntimePackData.ts';
import { THREADLINE_RUNTIME_GRID_COLS } from '../src/data/threadlineRuntimePack.ts';

// The Supertime backend enforces "a puzzle is scheduled at most once, ever" and
// a gap-free calendar from SCHEDULE_CONTIGUOUS_FROM through the last dated day
// (supertime-backend/internal/generator/threadline/threadline.go). So this
// export bakes every ready-reserve puzzle into the dated calendar exactly once
// instead of emitting a reserve list for runtime gap-filling:
//   1. A reserve authored for a date on/after the cutoff returns to its own
//      authored date (the calendar holes are exactly the days whose puzzles
//      were parked in the reserve list, so this fills them and extends the
//      tail with the reserves authored past the last dated day).
//   2. A reserve authored for a pre-cutoff date (those days already aired
//      dark and stay unscheduled) is displaced, in order, onto the remaining
//      post-cutoff gap dates, then onto new days appended after the last
//      dated day.
const SCHEDULE_CONTIGUOUS_FROM = '2026-07-03';

const compactPuzzles = THREADLINE_RUNTIME_COMPACT_PUZZLES as unknown as unknown[][];
const datedIndexes = THREADLINE_RUNTIME_DATED_INDEXES as unknown as Array<[string, number]>;
const reserveIndexes = THREADLINE_RUNTIME_READY_RESERVE_INDEXES as unknown as number[];

const nextDay = (dateKey: string): string => {
  const next = new Date(`${dateKey}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
};

const authoredDate = (puzzleIndex: number): string => {
  const puzzleId = compactPuzzles[puzzleIndex][0] as string;
  const match = /^threadline-(\d{4}-\d{2}-\d{2})-/.exec(puzzleId);
  if (!match) {
    throw new Error(`puzzle ${puzzleId} (index ${puzzleIndex}) has no authored date in its id`);
  }
  return match[1];
};

const datedSchedule = new Map<string, number>();
for (const [dateKey, puzzleIndex] of datedIndexes) {
  datedSchedule.set(dateKey, puzzleIndex);
}

const displacedReserves: number[] = [];
for (const puzzleIndex of reserveIndexes) {
  const dateKey = authoredDate(puzzleIndex);
  if (dateKey < SCHEDULE_CONTIGUOUS_FROM) {
    displacedReserves.push(puzzleIndex);
    continue;
  }
  if (datedSchedule.has(dateKey)) {
    throw new Error(
      `reserve puzzle index ${puzzleIndex} authored for ${dateKey}, but that date is already scheduled`
    );
  }
  datedSchedule.set(dateKey, puzzleIndex);
}

const remainingGapDates: string[] = [];
let lastDated = [...datedSchedule.keys()].sort().at(-1)!;
for (let dateKey = SCHEDULE_CONTIGUOUS_FROM; dateKey <= lastDated; dateKey = nextDay(dateKey)) {
  if (!datedSchedule.has(dateKey)) {
    remainingGapDates.push(dateKey);
  }
}
for (const puzzleIndex of displacedReserves) {
  let dateKey = remainingGapDates.shift();
  if (dateKey === undefined) {
    dateKey = nextDay(lastDated);
    lastDated = dateKey;
  }
  datedSchedule.set(dateKey, puzzleIndex);
}

if (datedSchedule.size !== compactPuzzles.length) {
  throw new Error(
    `expected every puzzle dated exactly once: ${datedSchedule.size} dates vs ${compactPuzzles.length} puzzles`
  );
}
const scheduledIndexes = new Set(datedSchedule.values());
if (scheduledIndexes.size !== compactPuzzles.length) {
  throw new Error(`duplicate puzzle index in dated schedule`);
}
for (let dateKey = SCHEDULE_CONTIGUOUS_FROM; dateKey <= lastDated; dateKey = nextDay(dateKey)) {
  if (!datedSchedule.has(dateKey)) {
    throw new Error(`calendar gap at ${dateKey} after baking reserves`);
  }
}

const sortedSchedule: Record<string, number> = {};
for (const dateKey of [...datedSchedule.keys()].sort()) {
  sortedSchedule[dateKey] = datedSchedule.get(dateKey)!;
}

const pack = {
  pack_id: 'threadline_gameshow_runtime_v1',
  locale: 'en-US',
  grid_cols: THREADLINE_RUNTIME_GRID_COLS,
  puzzles: compactPuzzles,
  dated_schedule: sortedSchedule,
};

const outputPath = resolve(
  fileURLToPath(import.meta.url),
  '../../../supertime-backend/internal/generator/threadline/data/threadline_runtime_pack.json'
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(pack)}\n`);

console.log(
  `Wrote ${compactPuzzles.length} Threadline puzzles on a gap-free calendar ` +
    `(${Object.keys(sortedSchedule).length} dated entries, ` +
    `${SCHEDULE_CONTIGUOUS_FROM} contiguous through ${lastDated}) to ${outputPath}.`
);
