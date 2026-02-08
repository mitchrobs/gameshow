const WORDS = [
  'CRANE',
  'SLATE',
  'PRIDE',
  'BRICK',
  'HONEY',
  'GHOST',
  'CLIMB',
  'PRISM',
  'VIVID',
  'MANGO',
  'RIVER',
  'CROWN',
  'SPICE',
  'NORTH',
  'LIGHT',
  'BLEND',
  'FROST',
  'QUART',
  'GLASS',
  'PULSE',
  'BLOOM',
  'CLOUD',
  'FLAME',
  'STONE',
  'PLANE',
  'TREND',
  'SHARP',
  'OASIS',
  'RAISE',
  'LEMON',
  'SHELF',
  'GRIND',
  'FABLE',
  'CANDY',
  'DREAM',
  'STAIR',
  'WALTZ',
  'ZEBRA',
  'UNITY',
  'ROAST',
];

const DAY_MS = 1000 * 60 * 60 * 24;
const DAILY_SEED = 274931;

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

const DAILY_ORDER = getShuffledIndices(WORDS.length, DAILY_SEED);

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / DAY_MS);
}

export function getDailyWordleIndex(date: Date = new Date()): number {
  const dayIndex = getLocalDayIndex(date);
  return DAILY_ORDER[dayIndex % DAILY_ORDER.length];
}

export function getDailyWordle(date: Date = new Date()): string {
  return WORDS[getDailyWordleIndex(date)];
}

export default WORDS;
