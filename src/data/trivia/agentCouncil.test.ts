import { describe, expect, it } from 'vitest';
import { evaluateTriviaCouncilQuestion } from './agentCouncil';
import type { TriviaCalibrationEvidence, TriviaQuestionRecord } from './types';

function makeQuestion(overrides: Partial<TriviaQuestionRecord> = {}): TriviaQuestionRecord {
  return {
    id: 'test-question',
    feed: 'mix',
    stem: 'Which river runs through Cairo?',
    options: ['Nile', 'Danube', 'Seine'],
    answerIndex: 0,
    rationaleShort: 'The Nile flows through Cairo.',
    rationaleLong: 'Cairo sits on the Nile, the river most closely associated with Egypt.',
    citations: [{ title: 'Reference', url: 'https://example.com', sourceType: 'editorial', accessedAt: '2026-05-01' }],
    domain: 'world',
    subdomain: 'geography',
    entities: ['Cairo', 'Nile'],
    difficultyTarget: 2,
    lookupRisk: 'low',
    freshUntil: '2027-01-01',
    status: 'reviewed',
    schemaVersion: 1,
    promptKind: 'place',
    salienceScore: 82,
    obscurityFlags: [],
    sourceTier: 'curated',
    sourceLabel: 'curated-authored',
    anchorSubdomain: 'geography',
    curveballKind: 'none',
    legacyFamily: 'none',
    editorialBucket: 'evergreen',
    ...overrides,
  };
}

const HARD_EVIDENCE: TriviaCalibrationEvidence = {
  agentCorrectRate: 0.42,
  observedCorrectRate: 0.38,
  blendedCorrectRate: 0.39,
  agentTimeoutRate: 0.14,
  observedTimeoutRate: 0.18,
  blendedTimeoutRate: 0.17,
  agentShieldRate: 0.08,
  observedShieldRate: 0.1,
  blendedShieldRate: 0.09,
  meanAnswerMilliseconds: 12100,
  lateClockStress: 0.52,
  telemetrySampleSize: 280,
  telemetryConfidence: 'trusted',
};

describe('agent council', () => {
  it('flags ambiguous elimination stems', () => {
    const flags = evaluateTriviaCouncilQuestion(
      makeQuestion({ stem: 'Which statement is true about this river?', obscurityFlags: ['vague-stem'] }),
      'mix',
      6,
      HARD_EVIDENCE
    );

    expect(flags.some((flag) => flag.code === 'ambiguity' && flag.severity === 'fail')).toBe(true);
  });

  it('flags timer friction when telemetry shows late-clock stress', () => {
    const flags = evaluateTriviaCouncilQuestion(
      makeQuestion({ stem: 'Which of these river systems is most closely associated with a city founded near the delta?' }),
      'mix',
      11,
      HARD_EVIDENCE
    );

    expect(flags.some((flag) => flag.code === 'timer-friction')).toBe(true);
  });

  it('flags dirty sports curveballs that rely on year traps', () => {
    const flags = evaluateTriviaCouncilQuestion(
      makeQuestion({
        feed: 'sports',
        domain: 'sports',
        subdomain: 'football',
        promptKind: 'rule',
        isTrickQuestion: true,
        curveballKind: 'rule-nuance',
        stem: 'In what year did the NFL first adopt this exact overtime wording?',
      }),
      'sports',
      8,
      HARD_EVIDENCE
    );

    expect(flags.some((flag) => flag.code === 'dirty-curveball' && flag.severity === 'fail')).toBe(true);
  });
});
