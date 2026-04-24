import type {
  TriviaCategory,
  TriviaDifficulty,
  TriviaQuestion,
} from './triviaPuzzles';
import baseCategories, {
  getTriviaCategory as getBaseTriviaCategory,
  getTriviaQuestionPools as getBaseTriviaQuestionPools,
  getTriviaQuestions as getBaseTriviaQuestions,
} from './triviaPuzzles';
import { SPORTS_CATEGORY, SPORTS_DAILY_PACKS, SPORTS_CATEGORY_ID } from './triviaSportsBank';

export type {
  TriviaCategory,
  TriviaDifficulty,
  TriviaQuestion,
} from './triviaPuzzles';

const DAILY_SEED = 773401;
const CATALOG_VERSION = 1;
const ROTATING_CATEGORY_COUNT = 2;

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / (1000 * 60 * 60 * 24));
}

function getDailySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function getSportsPack(date: Date): TriviaQuestion[] {
  const packIndex = getLocalDayIndex(date) % SPORTS_DAILY_PACKS.length;
  return SPORTS_DAILY_PACKS[packIndex] ?? [];
}

const TRIVIA_CATEGORIES: TriviaCategory[] = [...baseCategories, SPORTS_CATEGORY];

export function getDailyTriviaCategories(date: Date = new Date()): TriviaCategory[] {
  const rand = mulberry32(getDailySeed(date) + DAILY_SEED + CATALOG_VERSION * 101);
  const shuffled = seededShuffle(baseCategories, rand);
  return [...shuffled.slice(0, ROTATING_CATEGORY_COUNT), SPORTS_CATEGORY];
}

export function getTriviaQuestions(categoryId: string, date: Date = new Date()): TriviaQuestion[] {
  if (categoryId === SPORTS_CATEGORY_ID) {
    return getSportsPack(date);
  }
  return getBaseTriviaQuestions(categoryId, date);
}

export function getTriviaQuestionPools(
  categoryId: string,
  date: Date = new Date()
): Record<TriviaDifficulty, TriviaQuestion[]> {
  if (categoryId === SPORTS_CATEGORY_ID) {
    const pools: Record<TriviaDifficulty, TriviaQuestion[]> = { 1: [], 2: [], 3: [] };
    for (const question of getSportsPack(date)) {
      pools[question.difficulty].push(question);
    }
    return pools;
  }
  return getBaseTriviaQuestionPools(categoryId, date);
}

export function getTriviaCategory(id: string): TriviaCategory | undefined {
  if (id === SPORTS_CATEGORY_ID) {
    return SPORTS_CATEGORY;
  }
  return getBaseTriviaCategory(id);
}

export default TRIVIA_CATEGORIES;
