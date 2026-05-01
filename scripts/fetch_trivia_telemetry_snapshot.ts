import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { upstashCommand, upstashPipeline } from '../src/upstashRedis';
import type {
  TriviaDifficulty,
  TriviaFeed,
  TriviaTelemetryQuestionAggregate,
  TriviaTelemetrySlotAggregate,
  TriviaTelemetrySnapshot,
  TriviaTelemetryTimeBucket,
} from '../src/data/trivia/types';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const OUTPUT_PATH = path.join(ROOT, 'src/data/trivia/triviaTelemetrySnapshot.json');
const PREFIX = 'trivia:telemetry';
const BUCKET_PREFIX = 'bucket:';

function parseFeed(value: string): TriviaFeed {
  if (value === 'mix' || value === 'sports') return value;
  throw new Error(`Unknown trivia feed in telemetry key: ${value}`);
}

function parseDifficulty(value: string): TriviaDifficulty {
  if (value === 'easy' || value === 'hard') return value;
  throw new Error(`Unknown trivia difficulty in telemetry key: ${value}`);
}

function mapHistogram(fields: Record<string, string>): Partial<Record<TriviaTelemetryTimeBucket, number>> {
  const histogram: Partial<Record<TriviaTelemetryTimeBucket, number>> = {};
  Object.entries(fields).forEach(([field, value]) => {
    if (!field.startsWith(BUCKET_PREFIX)) return;
    const bucket = field.slice(BUCKET_PREFIX.length) as TriviaTelemetryTimeBucket;
    histogram[bucket] = parseInt(value, 10);
  });
  return histogram;
}

async function scanKeys(match: string) {
  let cursor = '0';
  const keys: string[] = [];
  do {
    const result = await upstashCommand(['SCAN', cursor, 'MATCH', match, 'COUNT', '500']);
    if (!Array.isArray(result) || result.length < 2) break;
    cursor = String(result[0] ?? '0');
    const batchKeys = Array.isArray(result[1]) ? (result[1] as string[]) : [];
    keys.push(...batchKeys);
  } while (cursor !== '0');
  return keys.sort();
}

async function hgetAllMany(keys: string[]) {
  const results = await upstashPipeline(keys.map((key) => ['HGETALL', key]));
  if (!results) {
    throw new Error('Unable to fetch trivia telemetry snapshot from Upstash.');
  }
  return keys.map((key, index) => [key, (results[index] ?? []) as string[]] as const);
}

function fieldsFromFlatArray(values: string[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (let index = 0; index < values.length; index += 2) {
    const field = values[index];
    const value = values[index + 1];
    if (typeof field === 'string' && typeof value === 'string') {
      fields[field] = value;
    }
  }
  return fields;
}

function parseQuestionAggregate(key: string, fields: Record<string, string>): TriviaTelemetryQuestionAggregate {
  const [, , type, feed, difficulty, ...questionParts] = key.split(':');
  if (type !== 'question') {
    throw new Error(`Expected question telemetry key, received ${key}`);
  }
  return {
    feed: parseFeed(feed),
    difficulty: parseDifficulty(difficulty),
    questionId: questionParts.join(':'),
    plays: parseInt(fields.plays ?? '0', 10),
    correctCount: parseInt(fields.correctCount ?? '0', 10),
    wrongCount: parseInt(fields.wrongCount ?? '0', 10),
    timeoutCount: parseInt(fields.timeoutCount ?? '0', 10),
    shieldArmedCount: parseInt(fields.shieldArmedCount ?? '0', 10),
    shieldSaveCount: parseInt(fields.shieldSaveCount ?? '0', 10),
    totalAnswerMilliseconds: Number(fields.totalAnswerMilliseconds ?? '0'),
    timeBucketHistogram: mapHistogram(fields),
  };
}

function parseSlotAggregate(key: string, fields: Record<string, string>): TriviaTelemetrySlotAggregate {
  const [, , type, feed, difficulty, slot] = key.split(':');
  if (type !== 'slot') {
    throw new Error(`Expected slot telemetry key, received ${key}`);
  }
  return {
    feed: parseFeed(feed),
    difficulty: parseDifficulty(difficulty),
    slot: parseInt(slot, 10),
    plays: parseInt(fields.plays ?? '0', 10),
    correctCount: parseInt(fields.correctCount ?? '0', 10),
    wrongCount: parseInt(fields.wrongCount ?? '0', 10),
    timeoutCount: parseInt(fields.timeoutCount ?? '0', 10),
    shieldArmedCount: parseInt(fields.shieldArmedCount ?? '0', 10),
    shieldSaveCount: parseInt(fields.shieldSaveCount ?? '0', 10),
    totalAnswerMilliseconds: Number(fields.totalAnswerMilliseconds ?? '0'),
    timeBucketHistogram: mapHistogram(fields),
  };
}

async function main() {
  const [questionKeys, slotKeys] = await Promise.all([
    scanKeys(`${PREFIX}:question:*`),
    scanKeys(`${PREFIX}:slot:*`),
  ]);

  const [questionRows, slotRows] = await Promise.all([
    hgetAllMany(questionKeys),
    hgetAllMany(slotKeys),
  ]);

  const snapshot: TriviaTelemetrySnapshot = {
    generatedAt: new Date().toISOString(),
    questions: questionRows.map(([key, values]) => parseQuestionAggregate(key, fieldsFromFlatArray(values))),
    slots: slotRows.map(([key, values]) => parseSlotAggregate(key, fieldsFromFlatArray(values))),
  };

  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  console.log(
    JSON.stringify(
      {
        generatedAt: snapshot.generatedAt,
        questions: snapshot.questions.length,
        slots: snapshot.slots.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
