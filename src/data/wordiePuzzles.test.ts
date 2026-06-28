import { describe, expect, it } from 'vitest';
import { isAllowedWordieGuess } from './wordiePuzzles';

describe('Wordie allowed guesses', () => {
  it('allows broad common guesses without promoting them to answers', () => {
    ['BIBLE', 'CANCER', 'COLOUR', 'ARMOR', 'GHOUL', 'VODKA'].forEach((word) => {
      expect(isAllowedWordieGuess(word, word.length as 4 | 5 | 6)).toBe(true);
    });
  });

  it('keeps severe guess-safety words blocked', () => {
    ['ANAL', 'PENIS', 'RAPES'].forEach((word) => {
      expect(isAllowedWordieGuess(word, word.length as 4 | 5 | 6)).toBe(false);
    });
  });
});
