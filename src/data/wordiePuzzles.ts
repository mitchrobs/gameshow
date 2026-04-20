import scheduleData from './wordieSchedule.json';
import allowedGuessesData from './wordieAllowedGuesses.json';
import priorWordsData from './wordie/priorWords.json';

export type WordieLength = 4 | 5 | 6;
export type WordieDifficultyTier = 'easy' | 'medium' | 'hard';

export interface WordiePuzzle {
  date: string;
  day_of_week: string;
  word: string;
  length: WordieLength;
  guesses_allowed: number;
  difficulty_score: number;
  difficulty_tier: WordieDifficultyTier;
  flags: string[];
  editorial_override: boolean;
}

export interface WordieSchedule {
  version: string;
  generated_at: string;
  seed: number;
  year_start: string;
  year_end: string;
  puzzles: WordiePuzzle[];
  safe_swap_pool: Record<string, Array<Omit<WordiePuzzle, 'date' | 'day_of_week' | 'length' | 'guesses_allowed' | 'editorial_override'>>>;
}

interface WordieAllowedGuesses {
  version: string;
  generated_at: string;
  source: string;
  words: Record<string, string[]>;
}

const DAY_MS = 1000 * 60 * 60 * 24;
const LEGACY_DAILY_SEED = 274931;
const LEGACY_WORDS = priorWordsData.words as string[];
const SCHEDULE = scheduleData as WordieSchedule;
const ALLOWED_GUESSES = allowedGuessesData as WordieAllowedGuesses;
const scheduleByDate = new Map(SCHEDULE.puzzles.map((puzzle) => [puzzle.date, puzzle]));

const allowedByLength = new Map<WordieLength, Set<string>>(
  ([4, 5, 6] as WordieLength[]).map((length) => {
    const words = [
      ...(ALLOWED_GUESSES.words[String(length)] ?? []),
      ...SCHEDULE.puzzles
        .filter((puzzle) => puzzle.length === length)
        .map((puzzle) => puzzle.word),
      ...LEGACY_WORDS.filter((word) => word.length === length),
    ];
    return [length, new Set(words.map((word) => word.toUpperCase()))];
  })
);

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getShuffledIndices(length: number, seed: number): number[] {
  const indices = Array.from({ length }, (_, i) => i);
  const rand = mulberry32(seed);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

const LEGACY_DAILY_ORDER = getShuffledIndices(LEGACY_WORDS.length, LEGACY_DAILY_SEED);

function getLocalDayIndex(date: Date): number {
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS);
}

export function getLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDayOfWeekLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

const LEGACY_INDEX_OVERRIDES: Record<string, number> = {
  '2026-02-12': LEGACY_WORDS.indexOf('ROAST'),
};

function getLegacyWordieIndex(date: Date): number {
  const overrideIndex = LEGACY_INDEX_OVERRIDES[getLocalDateKey(date)];
  if (Number.isInteger(overrideIndex) && overrideIndex >= 0 && overrideIndex < LEGACY_WORDS.length) {
    return overrideIndex;
  }
  return LEGACY_DAILY_ORDER[getLocalDayIndex(date) % LEGACY_DAILY_ORDER.length];
}

function getLegacyPuzzle(date: Date): WordiePuzzle {
  const dateKey = getLocalDateKey(date);
  return {
    date: dateKey,
    day_of_week: getDayOfWeekLabel(date),
    word: LEGACY_WORDS[getLegacyWordieIndex(date)],
    length: 5,
    guesses_allowed: 6,
    difficulty_score: 45,
    difficulty_tier: 'medium',
    flags: ['legacy'],
    editorial_override: false,
  };
}

export function getDailyWordieIndex(date: Date = new Date()): number {
  const dateKey = getLocalDateKey(date);
  const scheduleIndex = SCHEDULE.puzzles.findIndex((puzzle) => puzzle.date === dateKey);
  return scheduleIndex >= 0 ? scheduleIndex : getLegacyWordieIndex(date);
}

export function getDailyWordie(date: Date = new Date()): WordiePuzzle {
  const dateKey = getLocalDateKey(date);
  return scheduleByDate.get(dateKey) ?? getLegacyPuzzle(date);
}

export function isAllowedWordieGuess(guess: string, length: WordieLength): boolean {
  const normalized = guess.trim().toUpperCase();
  if (!/^[A-Z]+$/.test(normalized) || normalized.length !== length) {
    return false;
  }
  return allowedByLength.get(length)?.has(normalized) ?? false;
}

export default SCHEDULE.puzzles;
