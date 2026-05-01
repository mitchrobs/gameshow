import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTriviaTelemetryBlendWeights, recordTriviaRunTelemetry } from './telemetry';
import type { TriviaEpisode, TriviaRunAnswer } from './types';

function makeEpisode(difficulty: 'easy' | 'hard'): TriviaEpisode {
  return {
    date: '2026-05-01',
    feed: 'mix',
    difficulty,
    title: 'Daily Mix',
    subtitle: 'Test episode',
    questionCount: 2,
    timerSeconds: 15,
    finalStretchStartsAt: 9,
    themeTag: 'test',
    version: 'test',
    questions: [],
  };
}

function makeAnswers(): TriviaRunAnswer[] {
  return [
    {
      questionId: 'mix-q-1',
      selectedOption: 1,
      correct: true,
      timedOut: false,
      shielded: false,
      shieldArmed: true,
      points: 130,
      timeRemaining: 4,
      answerMilliseconds: 6100,
      correctAnswerIndex: 1,
    },
    {
      questionId: 'mix-q-2',
      selectedOption: null,
      correct: false,
      timedOut: true,
      shielded: true,
      shieldArmed: true,
      points: 50,
      timeRemaining: 0,
      answerMilliseconds: 15000,
      correctAnswerIndex: 2,
    },
  ];
}

describe('trivia telemetry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes one aggregate pipeline batch per completed run with no player identity', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal('fetch', fetchMock);

    await recordTriviaRunTelemetry(makeEpisode('hard'), makeAnswers());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/pipeline');
    const commands = JSON.parse(String(request.body)) as string[][];
    expect(commands.length).toBeGreaterThan(0);
    expect(commands.some((command) => command.includes('selectedOption'))).toBe(false);
    expect(commands.some((command) => command.includes('playerId'))).toBe(false);
    expect(commands.some((command) => command[1]?.includes('trivia:telemetry:question:mix:hard:mix-q-1'))).toBe(
      true
    );
    expect(commands.some((command) => command[1]?.includes('trivia:telemetry:slot:mix:hard:1'))).toBe(true);
  });

  it('keeps easy and hard telemetry isolated', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal('fetch', fetchMock);

    await recordTriviaRunTelemetry(makeEpisode('easy'), makeAnswers());
    await recordTriviaRunTelemetry(makeEpisode('hard'), makeAnswers());

    const [easyCall, hardCall] = fetchMock.mock.calls as Array<[string, RequestInit]>;
    const easyCommands = JSON.parse(String(easyCall[1].body)) as string[][];
    const hardCommands = JSON.parse(String(hardCall[1].body)) as string[][];

    expect(
      easyCommands.every((command) =>
        ['trivia:telemetry:question:mix:easy', 'trivia:telemetry:slot:mix:easy'].some((prefix) =>
          command[1]?.startsWith(prefix)
        )
      )
    ).toBe(true);
    expect(
      hardCommands.every((command) =>
        ['trivia:telemetry:question:mix:hard', 'trivia:telemetry:slot:mix:hard'].some((prefix) =>
          command[1]?.startsWith(prefix)
        )
      )
    ).toBe(true);
  });

  it('changes telemetry blend weights at the 50 and 200 play thresholds', () => {
    expect(getTriviaTelemetryBlendWeights(0)).toEqual({
      agentWeight: 1,
      telemetryWeight: 0,
      confidence: 'agent-only',
    });
    expect(getTriviaTelemetryBlendWeights(50)).toEqual({
      agentWeight: 0.6,
      telemetryWeight: 0.4,
      confidence: 'emerging',
    });
    expect(getTriviaTelemetryBlendWeights(200)).toEqual({
      agentWeight: 0.3,
      telemetryWeight: 0.7,
      confidence: 'trusted',
    });
  });
});
