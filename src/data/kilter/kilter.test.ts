import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  KILTER_GAME_SECONDS,
  KILTER_PACK,
  KILTER_PACK_DAYS,
  KILTER_PACK_START_DATE,
  KILTER_RANK_COUNT,
  formatKilterShareText,
  getDailyKilter,
  getKilterAvailableCoreScore,
  getKilterPackEntryForDate,
  getKilterRank,
  getKilterRemainingSeconds,
  isKilterTimeUp,
  scoreKilterWord,
  validateKilterGuess,
  type KilterPackEntry,
} from './index';

const DAY_MS = 24 * 60 * 60 * 1000;
const CORE_TARGETS: Record<number, [number, number]> = {
  1: [45, 90],
  2: [25, 55],
  3: [14, 35],
};
const KILTER_ROUTE_SOURCE = readFileSync(
  new URL('../../../app/kilter.tsx', import.meta.url),
  'utf8'
);
const KILTER_REVIEW_QUEUE_SOURCE = readFileSync(
  new URL('../../../docs/composed-editorial-review-queue.md', import.meta.url),
  'utf8'
);
const REPO_ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const WORD_TRUST_SAMPLE_WORDS = ['CODING', 'SIGNING', 'PRICING', 'NOTING'] as const;
const HARD_SWEEP_DENY_FIXTURES = [
  'CONSTITUENCY',
  'CONNECTIVITY',
  'NORTHEASTERN',
  'SOUTHWESTERN',
  'DISASTER',
  'PREDATOR',
  'PARASITE',
  'THERAPIST',
  'INTERNSHIP',
  'PEDIATRIC',
  'NATIONALISM',
  'RESIDENCY',
  'LEIGHTON',
  'TRADEMARK',
  'SHAREHOLDER',
  'OUTPATIENT',
  'IRRESPECTIVE',
  'RESPIRATORY',
  'CONGENITAL',
] as const;

function dateKeyForIndex(index: number): string {
  const date = new Date(Date.UTC(2026, 5, 1 + index));
  return date.toISOString().slice(0, 10);
}

function assertValidEntry(entry: KilterPackEntry) {
  const key = entry.key;
  const allowed = new Set([...key.split(''), ...entry.letters]);
  const target = CORE_TARGETS[key.length]!;

  expect(key).toMatch(/^[A-Z]{1,3}$/);
  expect(new Set(key).size).toBe(key.length);
  expect(entry.letters).toHaveLength(6);
  expect(new Set(entry.letters).size).toBe(6);
  expect(entry.coreWords.length).toBeGreaterThanOrEqual(target[0]);
  expect(entry.coreWords.length).toBeLessThanOrEqual(target[1]);
  expect(entry.sweeps.length).toBeGreaterThanOrEqual(1);
  expect(entry.sweeps.length).toBeLessThanOrEqual(2);
  expect(new Set(entry.coreWords).size).toBe(entry.coreWords.length);
  expect(new Set(entry.bonusWords).size).toBe(entry.bonusWords.length);

  const bonusSet = new Set(entry.bonusWords);
  entry.coreWords.forEach((word) => {
    expect(bonusSet.has(word)).toBe(false);
  });

  [...entry.coreWords, ...entry.bonusWords].forEach((word) => {
    expect(word).toMatch(/^[A-Z]{4,14}$/);
    expect(word.includes(key)).toBe(true);
    word.split('').forEach((letter) => {
      expect(allowed.has(letter)).toBe(true);
    });
  });

  entry.sweeps.forEach((word) => {
    expect(entry.coreWords).toContain(word);
    entry.letters.forEach((letter) => {
      expect(word).toContain(letter);
    });
  });

  expect(entry.availableCoreScore).toBe(getKilterAvailableCoreScore(entry));
}

function canMakeWord(entry: KilterPackEntry, word: string): boolean {
  const allowed = new Set([...entry.key.split(''), ...entry.letters]);
  return word.includes(entry.key) && word.split('').every((letter) => allowed.has(letter));
}

function acceptedWords(entry: KilterPackEntry): Set<string> {
  return new Set([...entry.coreWords, ...entry.bonusWords]);
}

describe('Kilter pack', () => {
  it('ships 400 consecutive dates from June 1, 2026', () => {
    expect(KILTER_PACK_START_DATE).toBe('2026-06-01');
    expect(KILTER_PACK.days).toBe(KILTER_PACK_DAYS);
    expect(KILTER_PACK.entries).toHaveLength(KILTER_PACK_DAYS);
    expect(KILTER_PACK.entries[0]?.date).toBe('2026-06-01');
    expect(KILTER_PACK.entries[KILTER_PACK.entries.length - 1]?.date).toBe('2027-07-05');

    KILTER_PACK.entries.forEach((entry, index) => {
      expect(entry.date).toBe(dateKeyForIndex(index));
      expect(entry.dayIndex).toBe(index);
    });
  });

  it('uses the required key mix and validates every puzzle shape', () => {
    const keyCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    const signatures = new Set<string>();
    const primarySweeps = new Set<string>();

    KILTER_PACK.entries.forEach((entry) => {
      keyCounts[entry.key.length] += 1;
      expect(signatures.has(entry.signature)).toBe(false);
      signatures.add(entry.signature);
      expect(primarySweeps.has(entry.sweeps[0]!)).toBe(false);
      primarySweeps.add(entry.sweeps[0]!);
      assertValidEntry(entry);
    });

    expect(keyCounts).toEqual({ 1: 100, 2: 260, 3: 40 });
    expect(KILTER_PACK.entries.filter((entry) => entry.sweeps.length === 1).length).toBeGreaterThanOrEqual(360);
  });

  it('has no unresolved hard Sweep blockers in the generated editorial queue', () => {
    const sweepWords = new Set(KILTER_PACK.entries.flatMap((entry) => entry.sweeps));

    expect(KILTER_REVIEW_QUEUE_SOURCE).toContain('- Hard Sweep blockers: 0');
    HARD_SWEEP_DENY_FIXTURES.forEach((word) => {
      expect(sweepWords.has(word)).toBe(false);
    });
  });

  it('accepts obvious common words that the system dictionary used to omit', () => {
    const launchDay = KILTER_PACK.entries[0]!;
    expect(launchDay.date).toBe('2026-06-01');
    expect(launchDay.key).toBe('IN');
    expect(launchDay.letters.join('')).toBe('ACDGOR');
    expect(launchDay.coreWords).toContain('CARING');
    expect(launchDay.coreWords).toContain('RAINING');

    let legalSampleDays = 0;
    WORD_TRUST_SAMPLE_WORDS.forEach((word) => {
      const legalDays = KILTER_PACK.entries.filter((entry) => canMakeWord(entry, word));
      legalDays.forEach((entry) => {
        legalSampleDays += 1;
        expect(acceptedWords(entry).has(word)).toBe(true);
      });
    });
    expect(legalSampleDays).toBeGreaterThan(0);
  });

  it('accepts broad valid bonus words while keeping them out of core progress', () => {
    ['BIBLE', 'CANCER', 'ARMOR'].forEach((word) => {
      const legalDays = KILTER_PACK.entries.filter((entry) => canMakeWord(entry, word));
      expect(legalDays.length).toBeGreaterThan(0);
      legalDays.forEach((entry) => {
        expect(acceptedWords(entry).has(word)).toBe(true);
        expect(entry.coreWords).not.toContain(word);
      });
    });
  });

  it('keeps severe guess-safety words out of the accepted pack surface', () => {
    ['ANAL', 'PENIS', 'RAPES'].forEach((word) => {
      const legalDays = KILTER_PACK.entries.filter((entry) => canMakeWord(entry, word));
      expect(legalDays.length).toBeGreaterThan(0);
      legalDays.forEach((entry) => {
        expect(acceptedWords(entry).has(word)).toBe(false);
      });
    });
  });

  it('fails the generator self-test when an obvious legal word is omitted', () => {
    const output = execFileSync('python3', ['scripts/build_kilter_pack.py', '--self-test-omitted-obvious'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    expect(output).toContain('omitted obvious word audit self-test passed');
  });

  it('looks up daily puzzles by local date and falls back to launch day before the pack starts', () => {
    expect(getKilterPackEntryForDate('2026-06-01')?.id).toBe(KILTER_PACK.entries[0]?.id);
    expect(getDailyKilter(new Date(2026, 4, 28)).date).toBe('2026-06-01');
    expect(getDailyKilter(new Date(2026, 5, 2)).date).toBe('2026-06-02');
    expect(getDailyKilter(new Date(2027, 6, 6)).date).toBe('2026-06-01');
  });
});

describe('Kilter rules and scoring', () => {
  const puzzle: KilterPackEntry = {
    id: 'fixture',
    date: '2026-06-01',
    dayIndex: 0,
    key: 'ST',
    letters: ['A', 'E', 'I', 'N', 'O', 'R'],
    coreWords: ['STARE', 'STONE', 'TOAST', 'ROOST', 'EARNEST'],
    bonusWords: ['STET'],
    sweeps: ['EARNEST'],
    availableCoreScore: 37,
    signature: 'ST:AEINOR',
  };

  it('accepts core, bonus, and sweep words with the contiguous key rule', () => {
    expect(validateKilterGuess('stare', puzzle)).toMatchObject({
      ok: true,
      word: 'STARE',
      kind: 'core',
      points: 5,
      isSweep: false,
    });
    expect(validateKilterGuess('stet', puzzle)).toMatchObject({
      ok: true,
      kind: 'bonus',
      points: 1,
    });
    expect(validateKilterGuess('earnest', puzzle)).toMatchObject({
      ok: true,
      points: 22,
      isSweep: true,
    });
  });

  it('rejects invalid, missing-key, out-of-bank, duplicate, and unlisted words', () => {
    expect(validateKilterGuess('sat', puzzle)).toMatchObject({ ok: false, reason: 'too-short' });
    expect(validateKilterGuess('tears', puzzle)).toMatchObject({
      ok: false,
      reason: 'missing-key',
      message: 'Use ST together.',
    });
    expect(validateKilterGuess('stark', puzzle)).toMatchObject({ ok: false, reason: 'invalid-letters' });
    expect(validateKilterGuess('stare', puzzle, ['STARE'])).toMatchObject({
      ok: false,
      reason: 'duplicate',
    });
    expect(validateKilterGuess('stair', puzzle)).toMatchObject({ ok: false, reason: 'not-in-list' });
  });

  it('uses simple missing-required-letter copy without saying Key', () => {
    const oneLetterPuzzle: KilterPackEntry = {
      ...puzzle,
      key: 'E',
      letters: ['A', 'N', 'O', 'R', 'S', 'T'],
      coreWords: ['EARN'],
      bonusWords: [],
      sweeps: ['EARN'],
      availableCoreScore: 19,
      signature: 'E:ANORST',
    };
    expect(validateKilterGuess('tarn', oneLetterPuzzle)).toMatchObject({
      ok: false,
      reason: 'missing-key',
      message: 'Use E.',
    });
  });

  it('scores ranks and share text from core score only', () => {
    expect(scoreKilterWord('TOAST', puzzle)).toBe(5);
    expect(scoreKilterWord('STET', puzzle)).toBe(1);
    expect(scoreKilterWord('NOPE', puzzle)).toBe(0);
    expect(KILTER_RANK_COUNT).toBe(5);
    expect(getKilterRank(0, 100).name).toBe('Drafting');
    expect(getKilterRank(14, 100).name).toBe('Drafting');
    expect(getKilterRank(15, 100).name).toBe('Steady');
    expect(getKilterRank(35, 100).name).toBe('Posed');
    expect(getKilterRank(55, 100).name).toBe('Composed');
    expect(getKilterRank(75, 100).name).toBe('Composed');
    expect(getKilterRank(75, 100, true).name).toBe('Mastered');
    const sweepShare = formatKilterShareText({
      puzzle,
      score: 28,
      foundWords: ['STARE', 'EARNEST'],
      foundSweeps: 1,
      url: 'https://example.test/kilter',
    });
    expect(sweepShare).toBe(
      [
        'Composed June 1st 2026',
        'Found Words: 2 ⭐️',
        'Score: 28 - Composed (4/5)',
        'https://example.test/kilter',
      ].join('\n')
    );
    const bonusOnlyShare = formatKilterShareText({
      puzzle,
      score: 99,
      foundWords: ['STET'],
      foundSweeps: 0,
      url: 'https://example.test/kilter',
    });
    expect(bonusOnlyShare).toContain('Composed June 1st 2026');
    expect(bonusOnlyShare).toContain('Found Words: 1');
    expect(bonusOnlyShare).toContain('Score: 99 - Drafting (1/5)');
    expect(bonusOnlyShare).not.toContain('⭐️');
  });

  it('locks exactly after the five-minute timer expires', () => {
    const startedAt = Date.UTC(2026, 5, 1, 12, 0, 0);
    expect(getKilterRemainingSeconds(startedAt, startedAt)).toBe(KILTER_GAME_SECONDS);
    expect(getKilterRemainingSeconds(startedAt, startedAt + 299_000)).toBe(1);
    expect(getKilterRemainingSeconds(startedAt, startedAt + 300_000)).toBe(0);
    expect(isKilterTimeUp(startedAt, startedAt + 299_000)).toBe(false);
    expect(isKilterTimeUp(startedAt, startedAt + DAY_MS)).toBe(true);
  });
});

describe('Kilter route presentation contracts', () => {
  it('keeps intro, play, and final/share surfaces separated by phase', () => {
    expect(KILTER_ROUTE_SOURCE).toContain("phase === 'intro' ? (");
    expect(KILTER_ROUTE_SOURCE).toMatch(
      /phase === 'playing' \? \([\s\S]+?\) : \(\s*<View style=\{styles\.resultCard\}>/
    );
    expect(KILTER_ROUTE_SOURCE.match(/<View style=\{styles\.resultCard\}>/g)).toHaveLength(1);
    expect(KILTER_ROUTE_SOURCE).toContain('testID="kilter-share"');
    expect(KILTER_ROUTE_SOURCE).toContain('testID="kilter-start"');
    expect(KILTER_ROUTE_SOURCE).toContain('testID="kilter-finish"');
  });

  it('removes play-surface line artifacts and uses kid-simple overview copy', () => {
    expect(KILTER_ROUTE_SOURCE).not.toContain('progressTrack');
    expect(KILTER_ROUTE_SOURCE).not.toContain('wordStageRule');
    expect(KILTER_ROUTE_SOURCE).not.toContain('keyCluster');
    expect(KILTER_ROUTE_SOURCE).not.toContain('Use the Key');
    expect(KILTER_ROUTE_SOURCE).toContain('Make words fast');
    expect(KILTER_ROUTE_SOURCE).toContain('Every word needs the green letter or green letters.');
    expect(KILTER_ROUTE_SOURCE).toContain('If there are 2 or 3 green letters, use them together in that order.');
    expect(KILTER_ROUTE_SOURCE).toContain('A Sweep uses all six outside letters. It adds a star and helps you reach Mastered.');
    expect(KILTER_ROUTE_SOURCE).toContain('Bonus words are accepted for +1.');
  });

  it('keeps input tap-first and starts clock urgency at one minute', () => {
    expect(KILTER_ROUTE_SOURCE).not.toContain('PanResponder');
    expect(KILTER_ROUTE_SOURCE).not.toContain('panHandlers');
    expect(KILTER_ROUTE_SOURCE).toContain("remainingSeconds <= 60");
    expect(KILTER_ROUTE_SOURCE).toContain('timerPulse');
    expect(KILTER_ROUTE_SOURCE).toContain('timerTextUrgent');
  });
});
