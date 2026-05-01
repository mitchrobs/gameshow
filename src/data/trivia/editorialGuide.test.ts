import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TRIVIA_LINT_RULES, TRIVIA_REQUIRED_FIELDS } from './index';

const guidePath = fileURLToPath(
  new URL('../../../docs/trivia-editorial-guide.md', import.meta.url).href
);
const guide = readFileSync(guidePath, 'utf8');

const LINT_RULE_GUIDE_FRAGMENTS: Record<(typeof TRIVIA_LINT_RULES)[number], string> = {
  'duplicate-stems': 'duplicate stems',
  'repeated-variant-groups': 'repeated variant groups',
  'invalid-option-count': 'invalid option counts',
  'invalid-answer-index': 'invalid answer indices',
  'stale-relative-phrasing': 'stale relative phrasing',
  'expired-freshness': 'expired freshness dates',
  'gimmick-distractors': 'gimmick distractor patterns',
  'answer-position-drift': 'answer-position drift',
  'quota-drift': 'quota drift',
  'entity-cooldown': 'entity cooldown violations',
  'missing-citations': 'missing citations',
  'missing-rationales': 'missing rationales',
};

describe('trivia editorial guide', () => {
  it('anchors Daily Trivia to the requested first-principles sources', () => {
    expect(guide).toContain('/Users/mitchellmacmini/Downloads/deep-research-report.md');
    expect(guide).toContain('docs/moji-mash-style-guide.md');
    expect(guide).toContain('The user-approved Daily Trivia overhaul plan in this thread.');
    expect(guide).toContain('three fair trick questions per month');
    expect(guide).toContain('Player agents should include multiple archetypes');
    expect(guide).toContain('The publish gate is AI-only after calibration.');
    expect(guide).toContain('No human editorial pass exists in the shipping pipeline.');
    expect(guide).toContain('Telemetry is the primary difficulty evidence source once enough plays exist:');
    expect(guide).toContain('Always reject:');
  });

  it('lists every required question field explicitly', () => {
    TRIVIA_REQUIRED_FIELDS.forEach((field) => {
      expect(guide).toContain(`\`${field}\``);
    });
  });

  it('documents every machine-usable lint rule expectation', () => {
    TRIVIA_LINT_RULES.forEach((rule) => {
      expect(guide.toLowerCase()).toContain(LINT_RULE_GUIDE_FRAGMENTS[rule]);
    });
    expect(guide).toContain(
      'If a rule lives only in prose and not in code, the implementation is incomplete.'
    );
  });
});
