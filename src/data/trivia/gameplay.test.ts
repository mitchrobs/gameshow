import { describe, expect, it } from 'vitest';
import {
  canArmShield,
  getShieldQuestionsRemaining,
  MAX_SHIELD_QUESTION_USES,
  resolveShieldAfterQuestion,
} from './gameplay';

describe('trivia shield gameplay', () => {
  it('allows one unused arm before the final shield try', () => {
    const result = resolveShieldAfterQuestion({
      shieldArmed: true,
      shieldAvailable: true,
      shieldQuestionsUsed: 0,
      actualCorrect: true,
    });

    expect(result.savedByShield).toBe(false);
    expect(result.shieldAvailable).toBe(true);
    expect(result.shieldQuestionsUsed).toBe(1);
    expect(getShieldQuestionsRemaining(result.shieldAvailable, result.shieldQuestionsUsed)).toBe(1);
  });

  it('spends the shield immediately when an armed question is missed', () => {
    const result = resolveShieldAfterQuestion({
      shieldArmed: true,
      shieldAvailable: true,
      shieldQuestionsUsed: 0,
      actualCorrect: false,
    });

    expect(result.savedByShield).toBe(true);
    expect(result.shieldAvailable).toBe(false);
    expect(result.shieldQuestionsUsed).toBe(1);
  });

  it('expires the shield after a correct second armed question', () => {
    const result = resolveShieldAfterQuestion({
      shieldArmed: true,
      shieldAvailable: true,
      shieldQuestionsUsed: 1,
      actualCorrect: true,
    });

    expect(result.savedByShield).toBe(false);
    expect(result.shieldAvailable).toBe(false);
    expect(result.shieldQuestionsUsed).toBe(MAX_SHIELD_QUESTION_USES);
  });

  it('still records a shielded save on the second armed question', () => {
    const result = resolveShieldAfterQuestion({
      shieldArmed: true,
      shieldAvailable: true,
      shieldQuestionsUsed: 1,
      actualCorrect: false,
    });

    expect(result.savedByShield).toBe(true);
    expect(result.shieldAvailable).toBe(false);
    expect(result.shieldQuestionsUsed).toBe(MAX_SHIELD_QUESTION_USES);
  });

  it('prevents a third shield arm attempt', () => {
    expect(canArmShield(true, 0)).toBe(true);
    expect(canArmShield(true, 1)).toBe(true);
    expect(canArmShield(true, MAX_SHIELD_QUESTION_USES)).toBe(false);
    expect(canArmShield(false, 1)).toBe(false);
  });
});
