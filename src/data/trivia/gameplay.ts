export const MAX_SHIELD_QUESTION_USES = 2;

export interface ResolveShieldAfterQuestionInput {
  shieldArmed: boolean;
  shieldAvailable: boolean;
  shieldQuestionsUsed: number;
  actualCorrect: boolean;
}

export interface ResolveShieldAfterQuestionResult {
  savedByShield: boolean;
  shieldAvailable: boolean;
  shieldQuestionsUsed: number;
}

export function canArmShield(
  shieldAvailable: boolean,
  shieldQuestionsUsed: number
): boolean {
  return shieldAvailable && shieldQuestionsUsed < MAX_SHIELD_QUESTION_USES;
}

export function getShieldQuestionsRemaining(
  shieldAvailable: boolean,
  shieldQuestionsUsed: number
): number {
  if (!shieldAvailable) return 0;
  return Math.max(0, MAX_SHIELD_QUESTION_USES - shieldQuestionsUsed);
}

export function resolveShieldAfterQuestion({
  shieldArmed,
  shieldAvailable,
  shieldQuestionsUsed,
  actualCorrect,
}: ResolveShieldAfterQuestionInput): ResolveShieldAfterQuestionResult {
  if (!shieldArmed || !canArmShield(shieldAvailable, shieldQuestionsUsed)) {
    return {
      savedByShield: false,
      shieldAvailable,
      shieldQuestionsUsed,
    };
  }

  const nextShieldQuestionsUsed = Math.min(
    MAX_SHIELD_QUESTION_USES,
    shieldQuestionsUsed + 1
  );

  if (!actualCorrect) {
    return {
      savedByShield: true,
      shieldAvailable: false,
      shieldQuestionsUsed: nextShieldQuestionsUsed,
    };
  }

  return {
    savedByShield: false,
    shieldAvailable: nextShieldQuestionsUsed < MAX_SHIELD_QUESTION_USES,
    shieldQuestionsUsed: nextShieldQuestionsUsed,
  };
}
