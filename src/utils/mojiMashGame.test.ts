import { describe, expect, it } from 'vitest';
import {
  formatMojiMashHint,
  formatMojiMashShareText,
  getMojiMashLivesText,
  getMojiMashSectionLabel,
  shouldShowMojiMashWordSlots,
} from './mojiMashGame';

describe('moji mash gameplay helpers', () => {
  it('formats a two-word hint with count and ordered initials', () => {
    expect(formatMojiMashHint(['ghost', 'pepper'])).toBe('2 words, starts with: g, p');
  });

  it('formats a four-word hint with count and ordered initials', () => {
    expect(formatMojiMashHint(['pumpkin', 'shaped', 'chocolate', 'candy'])).toBe(
      '4 words, starts with: p, s, c, c'
    );
  });

  it('hides the slot row before the player earns it and omits the count from the header', () => {
    expect(shouldShowMojiMashWordSlots(0, 'playing')).toBe(false);
    expect(getMojiMashSectionLabel(3, false)).toBe('Guess the words used to create this genmoji');
  });

  it('reveals the slot row and count-aware header after the first correct guess', () => {
    expect(shouldShowMojiMashWordSlots(1, 'playing')).toBe(true);
    expect(getMojiMashSectionLabel(2, true)).toBe('Guess the 2 words used to create this genmoji');
  });

  it('reveals the slot row after a terminal loss even with zero correct guesses', () => {
    expect(shouldShowMojiMashWordSlots(0, 'lost')).toBe(true);
  });

  it('labels the lives counter as incorrect guesses remaining', () => {
    expect(getMojiMashLivesText(2)).toBe('2 incorrect guesses remaining');
    expect(getMojiMashLivesText(1)).toBe('1 incorrect guess remaining');
  });

  it('caps the share-grid mistake row at three misses', () => {
    expect(
      formatMojiMashShareText({
        dateLabel: 'Apr 25, 2026',
        foundCount: 1,
        totalWords: 2,
        wrongCount: 5,
      })
    ).toBe(
      [
        'Moji Mash Apr 25, 2026',
        'Words: 🟩⬜️',
        'Mistakes: 🟥🟥🟥',
        'https://mitchrobs.github.io/gameshow/',
      ].join('\n')
    );
  });
});
