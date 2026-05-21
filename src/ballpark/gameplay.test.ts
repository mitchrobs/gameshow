import { describe, expect, it } from 'vitest';
import {
  HARD_WIN_THRESHOLD,
  appendDigit,
  evaluateGuess,
  formatBallparkShareText,
  getBallparkDateKey,
  parseGuessInput,
  sanitizeGuessInput,
} from './gameplay';
import { WIN_THRESHOLD } from './daybreak-v1-data.mjs';

describe('Ballpark gameplay helpers', () => {
  it('sanitizes direct numeric entry and pasted guesses', () => {
    expect(sanitizeGuessInput('001,234 apples')).toBe('1234');
    expect(sanitizeGuessInput('abc')).toBe('');
    expect(sanitizeGuessInput('123456789012345')).toBe('123456789012');
    expect(appendDigit('0012', '3')).toBe('123');
    expect(parseGuessInput('000')).toBe(null);
    expect(parseGuessInput('1,440')).toBe(1440);
  });

  it('evaluates normal and hard mode thresholds consistently', () => {
    expect(evaluateGuess(108, 100, WIN_THRESHOLD).tier).toBe('bullseye');
    expect(evaluateGuess(108, 100, HARD_WIN_THRESHOLD).tier).toBe('close');
    expect(evaluateGuess(10, 99, WIN_THRESHOLD)).toMatchObject({
      direction: 'up',
      tier: 'warm',
    });
    expect(evaluateGuess(3000, 100, WIN_THRESHOLD)).toMatchObject({
      direction: 'down',
      tier: 'cold',
    });
  });

  it('formats normal, hard-mode, and Extra Inning share text', () => {
    const results = [
      { won: true, bestPctOff: 0.02, guesses: 3 },
      { won: true, bestPctOff: 0.08, guesses: 4 },
      { won: true, bestPctOff: 0, guesses: 4 },
    ];

    expect(
      formatBallparkShareText({
        dateKey: '2026-04-24',
        hardMode: false,
        results,
        theme: 'In the Orchestra Pit',
      })
    ).toBe('Ballpark Apr 24, 2026\nIn the Orchestra Pit\n11 | 🟩🟩🟩');

    expect(
      formatBallparkShareText({
        dateKey: '2026-04-24',
        hardMode: true,
        results,
        theme: 'In the Orchestra Pit',
      })
    ).toBe('Ballpark Apr 24, 2026\nIn the Orchestra Pit\n11H | 🟩🟩🟩');

    expect(
      formatBallparkShareText({
        dateKey: '2026-04-24',
        extraInningResult: { won: false, bestPctOff: 0.6, guesses: 4 },
        hardMode: true,
        results,
        theme: 'In the Orchestra Pit',
      })
    ).toBe('Ballpark Apr 24, 2026\nIn the Orchestra Pit\n15H | 🟩🟩🟩⬛️ EI');
  });

  it('resolves today using the America/Chicago daily boundary', () => {
    expect(getBallparkDateKey(new Date('2026-05-22T04:30:00Z'))).toBe('2026-05-21');
    expect(getBallparkDateKey(new Date('2026-05-22T05:30:00Z'))).toBe('2026-05-22');
  });
});
