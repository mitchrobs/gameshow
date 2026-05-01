import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  DAWN_CABINET_DAILY_DIFFICULTIES,
  DAWN_CABINET_SCHEDULE_DAYS,
  DAWN_CABINET_SCHEDULE_START,
  getGeneratedDailyDawnCabinet,
  type DawnCabinetDailyDifficulty,
  type DawnCabinetPuzzle,
} from '../src/data/dawnCabinetPuzzles';

type SchedulePuzzleEntry = {
  id: string;
  variant: number;
};

type ScheduleEntry = {
  date: string;
  puzzles: Record<DawnCabinetDailyDifficulty, SchedulePuzzleEntry>;
};

function addUtcDays(date: string, days: number): string {
  const time = Date.parse(`${date}T00:00:00.000Z`);
  return new Date(time + days * 86_400_000).toISOString().slice(0, 10);
}

function variantFromPuzzleId(puzzle: DawnCabinetPuzzle): number {
  const match = puzzle.id.match(/-(\d+)$/);
  if (!match) throw new Error(`Could not read Dawn Cabinet variant from ${puzzle.id}`);
  return Number(match[1]);
}

function makePuzzleEntry(puzzle: DawnCabinetPuzzle): SchedulePuzzleEntry {
  return {
    id: puzzle.id,
    variant: variantFromPuzzleId(puzzle),
  };
}

const entries: ScheduleEntry[] = [];

for (let index = 0; index < DAWN_CABINET_SCHEDULE_DAYS; index += 1) {
  const date = addUtcDays(DAWN_CABINET_SCHEDULE_START, index);
  const puzzles = Object.fromEntries(
    DAWN_CABINET_DAILY_DIFFICULTIES.map((difficulty) => {
      const puzzle = getGeneratedDailyDawnCabinet(date, difficulty);
      return [difficulty, makePuzzleEntry(puzzle)];
    })
  ) as Record<DawnCabinetDailyDifficulty, SchedulePuzzleEntry>;
  entries.push({ date, puzzles });
  if ((index + 1) % 25 === 0 || index === DAWN_CABINET_SCHEDULE_DAYS - 1) {
    console.log(`  selected ${index + 1}/${DAWN_CABINET_SCHEDULE_DAYS} days`);
  }
}

const output = {
  start: DAWN_CABINET_SCHEDULE_START,
  days: DAWN_CABINET_SCHEDULE_DAYS,
  entries,
};

const outputPath = resolve(process.cwd(), 'src/data/dawnCabinetSchedule.json');
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${entries.length} Dawn Cabinet days to ${outputPath}`);
