import packData from './pack.json';

export const KILTER_GAME_SECONDS = 5 * 60;
export const KILTER_SWEEP_BONUS = 15;
export const KILTER_PACK_START_DATE = '2026-06-01';
export const KILTER_PACK_DAYS = 400;
export const KILTER_SHARE_URL = 'https://mitchrobs.github.io/gameshow/kilter';

export type KilterWordKind = 'core' | 'bonus';
export type KilterValidationReason =
  | 'empty'
  | 'too-short'
  | 'invalid-characters'
  | 'missing-key'
  | 'invalid-letters'
  | 'duplicate'
  | 'not-in-list';

export interface KilterPuzzle {
  date: string;
  key: string;
  letters: string[];
  coreWords: string[];
  bonusWords: string[];
  sweeps: string[];
}

export interface KilterPackEntry extends KilterPuzzle {
  id: string;
  dayIndex: number;
  availableCoreScore: number;
  signature: string;
}

export interface KilterPackPayload {
  version: string;
  generatedAt: string;
  seed: number;
  startDate: string;
  endDate: string;
  days: number;
  keyMix: Record<string, number>;
  candidateDepth?: Record<string, number>;
  sweepBonus: number;
  entries: KilterPackEntry[];
}

export interface KilterRank {
  tier: number;
  name: string;
  minPercent: number;
  percent: number;
  requiresSweep?: boolean;
}

export type KilterValidationResult =
  | {
      ok: true;
      word: string;
      kind: KilterWordKind;
      points: number;
      isSweep: boolean;
    }
  | {
      ok: false;
      word: string;
      reason: KilterValidationReason;
      message: string;
    };

export interface KilterShareTextOptions {
  puzzle: KilterPackEntry;
  score: number;
  foundWords: readonly string[];
  foundSweeps: number;
  url?: string;
}

const PACK = packData as KilterPackPayload;
const packByDate = new Map(PACK.entries.map((entry) => [entry.date, entry]));
const firstEntry = PACK.entries[0]!;
const lastEntry = PACK.entries[PACK.entries.length - 1]!;

export const KILTER_PACK = PACK;
export const KILTER_RANKS: readonly Omit<KilterRank, 'percent'>[] = [
  { tier: 1, name: 'Drafting', minPercent: 0 },
  { tier: 2, name: 'Composed', minPercent: 20 },
  { tier: 3, name: 'Poised', minPercent: 40 },
  { tier: 4, name: 'Mastered', minPercent: 75, requiresSweep: true },
] as const;
export const KILTER_RANK_COUNT = KILTER_RANKS.length;

const SHARE_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function getLocalKilterDateKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function formatKilterShareDate(dateKey: string): string {
  const date = parseLocalDateKey(dateKey);
  const day = date.getDate();
  return `${SHARE_MONTH_NAMES[date.getMonth()]} ${day}${getOrdinalSuffix(day)} ${date.getFullYear()}`;
}

function dateDiffDays(left: string, right: string): number {
  const leftDate = parseLocalDateKey(left);
  const rightDate = parseLocalDateKey(right);
  const leftOrdinal = Date.UTC(leftDate.getFullYear(), leftDate.getMonth(), leftDate.getDate());
  const rightOrdinal = Date.UTC(rightDate.getFullYear(), rightDate.getMonth(), rightDate.getDate());
  return Math.floor((leftOrdinal - rightOrdinal) / (24 * 60 * 60 * 1000));
}

export function getKilterPackEntryForDate(dateKey: string): KilterPackEntry | null {
  return packByDate.get(dateKey) ?? null;
}

export function getDailyKilter(date: Date = new Date()): KilterPackEntry {
  const dateKey = getLocalKilterDateKey(date);
  const datedEntry = getKilterPackEntryForDate(dateKey);
  if (datedEntry) return datedEntry;
  if (dateKey < KILTER_PACK_START_DATE) return firstEntry;

  const daysAfterStart = dateDiffDays(dateKey, KILTER_PACK_START_DATE);
  const index = ((daysAfterStart % PACK.entries.length) + PACK.entries.length) % PACK.entries.length;
  return PACK.entries[index] ?? lastEntry;
}

export function normalizeKilterWord(input: string): string {
  return input.trim().toUpperCase();
}

export function getKilterAllowedLetters(puzzle: Pick<KilterPuzzle, 'key' | 'letters'>): Set<string> {
  return new Set([...puzzle.key.split(''), ...puzzle.letters]);
}

export function includesKilterKey(word: string, key: string): boolean {
  return key.length === 1 ? word.includes(key) : word.includes(key);
}

export function usesOnlyKilterLetters(
  word: string,
  puzzle: Pick<KilterPuzzle, 'key' | 'letters'>
): boolean {
  const allowed = getKilterAllowedLetters(puzzle);
  return word.split('').every((letter) => allowed.has(letter));
}

export function isKilterSweep(word: string, puzzle: Pick<KilterPuzzle, 'sweeps'>): boolean {
  return puzzle.sweeps.includes(normalizeKilterWord(word));
}

export function getKilterWordKind(
  word: string,
  puzzle: Pick<KilterPuzzle, 'coreWords' | 'bonusWords'>
): KilterWordKind | null {
  const normalized = normalizeKilterWord(word);
  if (puzzle.coreWords.includes(normalized)) return 'core';
  if (puzzle.bonusWords.includes(normalized)) return 'bonus';
  return null;
}

export function scoreKilterWord(word: string, puzzle: KilterPuzzle): number {
  const normalized = normalizeKilterWord(word);
  const kind = getKilterWordKind(normalized, puzzle);
  if (!kind) return 0;
  if (kind === 'bonus') return 1;
  const baseScore = normalized.length === 4 ? 1 : normalized.length;
  return baseScore + (isKilterSweep(normalized, puzzle) ? KILTER_SWEEP_BONUS : 0);
}

export function getKilterAvailableCoreScore(puzzle: Pick<KilterPuzzle, 'coreWords' | 'sweeps'>): number {
  return puzzle.coreWords.reduce((score, word) => {
    const baseScore = word.length === 4 ? 1 : word.length;
    return score + baseScore + (puzzle.sweeps.includes(word) ? KILTER_SWEEP_BONUS : 0);
  }, 0);
}

export function getKilterRank(
  score: number,
  availableCoreScore: number,
  hasFoundSweep = false
): KilterRank {
  const percent =
    availableCoreScore <= 0 ? 0 : Math.max(0, Math.floor((score / availableCoreScore) * 100));
  const rank = [...KILTER_RANKS]
    .reverse()
    .find((candidate) => percent >= candidate.minPercent && (!candidate.requiresSweep || hasFoundSweep)) ??
    KILTER_RANKS[0]!;
  return { ...rank, percent };
}

export function validateKilterGuess(
  input: string,
  puzzle: KilterPuzzle,
  foundWords: Iterable<string> = []
): KilterValidationResult {
  const word = normalizeKilterWord(input);
  if (!word) {
    return { ok: false, word, reason: 'empty', message: 'Enter a word first.' };
  }
  if (!/^[A-Z]+$/.test(word)) {
    return { ok: false, word, reason: 'invalid-characters', message: 'Use letters only.' };
  }
  if (word.length < 4) {
    return { ok: false, word, reason: 'too-short', message: 'Words must be at least 4 letters.' };
  }
  if (!includesKilterKey(word, puzzle.key)) {
    return {
      ok: false,
      word,
      reason: 'missing-key',
      message: puzzle.key.length === 1 ? `Use ${puzzle.key}.` : `Use ${puzzle.key} together.`,
    };
  }
  if (!usesOnlyKilterLetters(word, puzzle)) {
    return {
      ok: false,
      word,
      reason: 'invalid-letters',
      message: 'Use only today\'s letters.',
    };
  }
  const found = new Set(Array.from(foundWords, normalizeKilterWord));
  if (found.has(word)) {
    return { ok: false, word, reason: 'duplicate', message: 'Already found.' };
  }
  const kind = getKilterWordKind(word, puzzle);
  if (!kind) {
    return { ok: false, word, reason: 'not-in-list', message: 'Not in today\'s list.' };
  }
  return {
    ok: true,
    word,
    kind,
    points: scoreKilterWord(word, puzzle),
    isSweep: isKilterSweep(word, puzzle),
  };
}

export function getKilterRemainingSeconds(startedAtMs: number | null, nowMs: number): number {
  if (startedAtMs === null) return KILTER_GAME_SECONDS;
  const elapsedSeconds = Math.floor((nowMs - startedAtMs) / 1000);
  return Math.max(0, KILTER_GAME_SECONDS - elapsedSeconds);
}

export function isKilterTimeUp(startedAtMs: number | null, nowMs: number): boolean {
  return getKilterRemainingSeconds(startedAtMs, nowMs) <= 0;
}

export function formatKilterShareText({
  puzzle,
  score,
  foundWords,
  foundSweeps,
  url = KILTER_SHARE_URL,
}: KilterShareTextOptions): string {
  const coreScore = foundWords.reduce((total, word) => {
    const normalized = normalizeKilterWord(word);
    return puzzle.coreWords.includes(normalized)
      ? total + scoreKilterWord(normalized, puzzle)
      : total;
  }, 0);
  const rank = getKilterRank(coreScore, puzzle.availableCoreScore, foundSweeps > 0);
  const sweepBadge = foundSweeps > 0 ? ' ⭐️' : '';
  return [
    `Composed ${formatKilterShareDate(puzzle.date)}`,
    `Score: ${score} - ${rank.name} (${rank.tier}/${KILTER_RANK_COUNT})`,
    `Found Words: ${foundWords.length}${sweepBadge}`,
    url,
  ].join('\n');
}
