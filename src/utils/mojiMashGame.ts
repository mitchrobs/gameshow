export const MOJI_MASH_MAX_WRONG_GUESSES = 3;
export const MOJI_MASH_HINT_REVEAL_AFTER = 2;
const MOJI_MASH_URL = 'https://mitchrobs.github.io/gameshow/';

export type MojiMashGameState = 'playing' | 'won' | 'lost';

type ShareTextOptions = {
  dateLabel: string;
  foundCount: number;
  totalWords: number;
  wrongCount: number;
  maxWrongGuesses?: number;
};

function clampCount(value: number, max: number): number {
  return Math.max(0, Math.min(value, max));
}

export function formatMojiMashHint(words: string[]): string {
  const wordCount = words.length;
  const initials = words.map((word) => word.trim().charAt(0).toLowerCase()).join(', ');
  return `${wordCount} word${wordCount === 1 ? '' : 's'}, starts with: ${initials}`;
}

export function shouldShowMojiMashWordSlots(
  foundCount: number,
  gameState: MojiMashGameState
): boolean {
  return foundCount > 0 || gameState !== 'playing';
}

export function getMojiMashSectionLabel(totalWords: number, showWordSlots: boolean): string {
  if (!showWordSlots) {
    return 'Guess the words used to create this genmoji';
  }

  return `Guess the ${totalWords} word${totalWords === 1 ? '' : 's'} used to create this genmoji`;
}

export function getMojiMashLivesText(remainingWrongGuesses: number): string {
  return `${remainingWrongGuesses} incorrect guess${remainingWrongGuesses === 1 ? '' : 'es'} remaining`;
}

export function formatMojiMashShareText({
  dateLabel,
  foundCount,
  totalWords,
  wrongCount,
  maxWrongGuesses = MOJI_MASH_MAX_WRONG_GUESSES,
}: ShareTextOptions): string {
  const safeFoundCount = clampCount(foundCount, totalWords);
  const safeWrongCount = clampCount(wrongCount, maxWrongGuesses);
  const wordRow =
    'Words: ' +
    '🟩'.repeat(safeFoundCount) +
    '⬜️'.repeat(Math.max(0, totalWords - safeFoundCount));
  const mistakeRow =
    'Mistakes: ' +
    '🟥'.repeat(safeWrongCount) +
    '⬜️'.repeat(Math.max(0, maxWrongGuesses - safeWrongCount));

  return [`Moji Mash ${dateLabel}`, wordRow, mistakeRow, MOJI_MASH_URL].join('\n');
}
