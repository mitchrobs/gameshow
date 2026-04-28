import type {
  TriviaEpisodeDefinition,
  TriviaQuestionRecord,
  TriviaRunResult,
  TriviaCitation,
} from './types';

export const TRIVIA_REQUIRED_FIELDS = [
  'id',
  'feed',
  'stem',
  'options',
  'answerIndex',
  'rationaleShort',
  'rationaleLong',
  'citations',
  'domain',
  'subdomain',
  'entities',
  'difficultyTarget',
  'lookupRisk',
  'freshUntil',
  'status',
  'schemaVersion',
  'promptKind',
  'salienceScore',
  'obscurityFlags',
  'sourceTier',
  'sourceLabel',
  'anchorSubdomain',
  'curveballKind',
  'legacyFamily',
] as const;

export const TRIVIA_LINT_RULES = [
  'duplicate-stems',
  'repeated-variant-groups',
  'invalid-option-count',
  'invalid-answer-index',
  'stale-relative-phrasing',
  'expired-freshness',
  'gimmick-distractors',
  'answer-position-drift',
  'quota-drift',
  'entity-cooldown',
  'missing-citations',
  'missing-rationales',
] as const;

const RELATIVE_TIME_PATTERN =
  /\b(currently|current|today|recently|now|this year|last season|this season)\b/i;
const GIMMICK_PATTERN =
  /\b(all of the above|none of the above|which of these is not|except)\b/i;

export function hasStaleRelativePhrasing(text: string): boolean {
  return RELATIVE_TIME_PATTERN.test(text);
}

export function hasGimmickDistractorPattern(text: string): boolean {
  return GIMMICK_PATTERN.test(text);
}

export function validateCitation(citation: TriviaCitation): string[] {
  const issues: string[] = [];
  if (!citation.title.trim()) issues.push('citation missing title');
  if (!citation.url.trim()) issues.push('citation missing url');
  if (!citation.accessedAt.trim()) issues.push('citation missing accessedAt');
  return issues;
}

export function validateQuestionRecord(question: TriviaQuestionRecord): string[] {
  const issues: string[] = [];
  TRIVIA_REQUIRED_FIELDS.forEach((field) => {
    if (!(field in question)) {
      issues.push(`missing ${field}`);
    }
  });

  if (question.options.length !== 3) issues.push('question must have exactly 3 options');
  if (question.answerIndex < 0 || question.answerIndex >= question.options.length) {
    issues.push('answerIndex out of range');
  }
  if (!question.rationaleShort.trim()) issues.push('missing rationaleShort');
  if (!question.rationaleLong.trim()) issues.push('missing rationaleLong');
  if (question.citations.length === 0) issues.push('missing citations');
  if (question.salienceScore < 0 || question.salienceScore > 100) {
    issues.push('salienceScore out of range');
  }
  if (!question.promptKind) issues.push('missing promptKind');
  if (!Array.isArray(question.obscurityFlags)) issues.push('obscurityFlags must be an array');
  question.citations.forEach((citation) => {
    issues.push(...validateCitation(citation));
  });
  if (hasStaleRelativePhrasing(question.stem)) issues.push('stale relative phrasing');
  if (hasGimmickDistractorPattern(question.stem)) issues.push('gimmick distractor pattern');
  if (question.options.some((option) => hasGimmickDistractorPattern(option))) {
    issues.push('gimmick option pattern');
  }
  return issues;
}

export function validateEpisodeDefinition(episode: TriviaEpisodeDefinition): string[] {
  const issues: string[] = [];
  if (!episode.date) issues.push('episode missing date');
  if (!episode.difficulty) issues.push('episode missing difficulty');
  if (episode.questionIds.length !== episode.difficultyTargets.length) {
    issues.push('episode questionIds and difficultyTargets length mismatch');
  }
  if (episode.finalStretchStartsAt < 0 || episode.finalStretchStartsAt >= episode.questionIds.length) {
    issues.push('episode finalStretchStartsAt out of range');
  }
  return issues;
}

export function validateRunResult(result: TriviaRunResult): string[] {
  const issues: string[] = [];
  if (!result.difficulty) issues.push('run result missing difficulty');
  if (result.answerMarks.length !== result.totalQuestions) {
    issues.push('run result marks length mismatch');
  }
  return issues;
}
