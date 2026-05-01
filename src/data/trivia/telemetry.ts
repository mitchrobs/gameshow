import type {
  TriviaEpisode,
  TriviaRunAnswer,
  TriviaTelemetryConfidenceTier,
  TriviaTelemetryTimeBucket,
} from './types';
import { upstashPipeline } from '../../upstashRedis';

const TRIVIA_TELEMETRY_PREFIX = 'trivia:telemetry';
export const TRIVIA_TELEMETRY_BLEND_LOW = 50;
export const TRIVIA_TELEMETRY_BLEND_HIGH = 200;

export const TRIVIA_TELEMETRY_BUCKETS: Array<{
  bucket: TriviaTelemetryTimeBucket;
  maxMilliseconds: number;
}> = [
  { bucket: 'lt-4s', maxMilliseconds: 4000 },
  { bucket: 'lt-8s', maxMilliseconds: 8000 },
  { bucket: 'lt-12s', maxMilliseconds: 12000 },
  { bucket: 'lt-15s', maxMilliseconds: 15000 },
];

export function getTriviaTelemetryBlendWeights(sampleSize: number): {
  agentWeight: number;
  telemetryWeight: number;
  confidence: TriviaTelemetryConfidenceTier;
} {
  if (sampleSize >= TRIVIA_TELEMETRY_BLEND_HIGH) {
    return { agentWeight: 0.3, telemetryWeight: 0.7, confidence: 'trusted' };
  }
  if (sampleSize >= TRIVIA_TELEMETRY_BLEND_LOW) {
    return { agentWeight: 0.6, telemetryWeight: 0.4, confidence: 'emerging' };
  }
  return { agentWeight: 1, telemetryWeight: 0, confidence: 'agent-only' };
}

function buildQuestionTelemetryKey(
  feed: TriviaEpisode['feed'],
  difficulty: TriviaEpisode['difficulty'],
  questionId: string
): string {
  return `${TRIVIA_TELEMETRY_PREFIX}:question:${feed}:${difficulty}:${questionId}`;
}

function buildSlotTelemetryKey(
  feed: TriviaEpisode['feed'],
  difficulty: TriviaEpisode['difficulty'],
  slot: number
): string {
  return `${TRIVIA_TELEMETRY_PREFIX}:slot:${feed}:${difficulty}:${slot}`;
}

function getTelemetryBucket(
  answerMilliseconds: number,
  timedOut: boolean
): TriviaTelemetryTimeBucket {
  if (timedOut) return 'timeout';
  const matchingBucket = TRIVIA_TELEMETRY_BUCKETS.find(
    (candidate) => answerMilliseconds < candidate.maxMilliseconds
  );
  return matchingBucket?.bucket ?? 'lt-15s';
}

function buildAggregateCommands(
  key: string,
  answer: TriviaRunAnswer,
  answerMilliseconds: number
): string[][] {
  const bucket = getTelemetryBucket(answerMilliseconds, answer.timedOut);
  const commands: string[][] = [
    ['HINCRBY', key, 'plays', '1'],
    ['HINCRBY', key, 'correctCount', answer.correct ? '1' : '0'],
    ['HINCRBY', key, 'wrongCount', !answer.correct && !answer.timedOut ? '1' : '0'],
    ['HINCRBY', key, 'timeoutCount', answer.timedOut ? '1' : '0'],
    ['HINCRBY', key, 'shieldArmedCount', answer.shieldArmed ? '1' : '0'],
    ['HINCRBY', key, 'shieldSaveCount', answer.shielded ? '1' : '0'],
    ['HINCRBYFLOAT', key, 'totalAnswerMilliseconds', String(answerMilliseconds)],
    ['HINCRBY', key, `bucket:${bucket}`, '1'],
  ];
  return commands;
}

export async function recordTriviaRunTelemetry(
  episode: TriviaEpisode,
  answers: TriviaRunAnswer[]
): Promise<void> {
  if (answers.length === 0) return;

  const commands: string[][] = [];
  answers.forEach((answer, index) => {
    const answerMilliseconds = Math.max(
      0,
      Math.min(episode.timerSeconds * 1000, Math.round(answer.answerMilliseconds))
    );
    commands.push(
      ...buildAggregateCommands(
        buildQuestionTelemetryKey(episode.feed, episode.difficulty, answer.questionId),
        answer,
        answerMilliseconds
      ),
      ...buildAggregateCommands(
        buildSlotTelemetryKey(episode.feed, episode.difficulty, index + 1),
        answer,
        answerMilliseconds
      )
    );
  });

  await upstashPipeline(commands);
}
