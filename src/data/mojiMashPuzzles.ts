import { ImageSourcePropType } from 'react-native';

export interface MojiMashPuzzle {
  /** The genmoji image displayed to the player */
  image: ImageSourcePropType;
  /** The words used to "generate" the genmoji (lowercase) */
  words: string[];
  /** A hint shown after 3 wrong guesses */
  hint: string;
  /** Optional YYYY-MM-DD date pin. Takes precedence over daily rotation. */
  date?: string;
}

/**
 * Each puzzle represents a "genmoji" image made from multiple words.
 * Players must guess the original words.
 */
const puzzles: MojiMashPuzzle[] = [
  {
    image: require('../../assets/genmoji/air-bed-mattress.png'),
    words: ['air', 'bed', 'mattress'],
    hint: 'Starts with: a, b, m',
  },
  {
    image: require('../../assets/genmoji/attic-stove.png'),
    words: ['attic', 'stove'],
    hint: 'Starts with: a, s',
  },
  {
    image: require('../../assets/genmoji/bike-share.png'),
    words: ['bike', 'share'],
    hint: 'Starts with: b, s',
  },
  {
    image: require('../../assets/genmoji/carrot-cake-icing.png'),
    words: ['carrot', 'cake', 'icing'],
    hint: 'Starts with: c, c, i',
  },
  {
    image: require('../../assets/genmoji/chandelier-glass.png'),
    words: ['chandelier', 'glass'],
    hint: 'Starts with: c, g',
  },
  {
    image: require('../../assets/genmoji/christmas-ham.png'),
    words: ['christmas', 'ham'],
    hint: 'Starts with: c, h',
    date: '2025-12-25',
  },
  {
    image: require('../../assets/genmoji/city-llama-family.png'),
    words: ['city', 'llama', 'family'],
    hint: 'Starts with: c, l, f',
  },
  {
    image: require('../../assets/genmoji/clover-party-holiday.png'),
    words: ['clover', 'party', 'holiday'],
    hint: 'Starts with: c, p, h',
  },
  {
    image: require('../../assets/genmoji/date-night.png'),
    words: ['date', 'night'],
    hint: 'Starts with: d, n',
  },
  {
    image: require('../../assets/genmoji/disco-cactus.png'),
    words: ['disco', 'cactus'],
    hint: 'Starts with: d, c',
  },
  {
    image: require('../../assets/genmoji/espresso-machine.png'),
    words: ['espresso', 'machine'],
    hint: 'Starts with: e, m',
  },
  {
    image: require('../../assets/genmoji/fire-helmet-dog.png'),
    words: ['fire', 'helmet', 'dog'],
    hint: 'Starts with: f, h, d',
  },
  {
    image: require('../../assets/genmoji/ghost-pepper.png'),
    words: ['ghost', 'pepper'],
    hint: 'Starts with: g, p',
  },
  {
    image: require('../../assets/genmoji/green-machine.png'),
    words: ['green', 'machine'],
    hint: 'Starts with: g, m',
  },
  {
    image: require('../../assets/genmoji/grumpy-rainbow.png'),
    words: ['grumpy', 'rainbow'],
    hint: 'Starts with: g, r',
  },
  {
    image: require('../../assets/genmoji/hedgehog-ninja.png'),
    words: ['hedgehog', 'ninja'],
    hint: 'Starts with: h, n',
  },
  {
    image: require('../../assets/genmoji/magic-horse.png'),
    words: ['magic', 'horse'],
    hint: 'Starts with: m, h',
  },
  {
    image: require('../../assets/genmoji/music-video.png'),
    words: ['music', 'video'],
    hint: 'Starts with: m, v',
  },
  {
    image: require('../../assets/genmoji/oil-money.png'),
    words: ['oil', 'money'],
    hint: 'Starts with: o, m',
  },
  {
    image: require('../../assets/genmoji/party-pooper.png'),
    words: ['party', 'pooper'],
    hint: 'Starts with: p, p',
  },
  {
    image: require('../../assets/genmoji/penguin-mountain-snow.png'),
    words: ['penguin', 'mountain', 'snow'],
    hint: 'Starts with: p, m, s',
  },
  {
    image: require('../../assets/genmoji/plane-crash.png'),
    words: ['plane', 'crash'],
    hint: 'Starts with: p, c',
  },
  {
    image: require('../../assets/genmoji/pumpkin-shaped-chocolate-candy.png'),
    words: ['pumpkin', 'shaped', 'chocolate', 'candy'],
    hint: 'Starts with: p, s, c, c',
  },
  {
    image: require('../../assets/genmoji/pyramid-scheme.png'),
    words: ['pyramid', 'scheme'],
    hint: 'Starts with: p, s',
  },
  {
    image: require('../../assets/genmoji/red-bull.png'),
    words: ['red', 'bull'],
    hint: 'Starts with: r, b',
  },
  {
    image: require('../../assets/genmoji/roller-skates-rubber-duck.png'),
    words: ['roller', 'skates', 'rubber', 'duck'],
    hint: 'Starts with: r, s, r, d',
  },
  {
    image: require('../../assets/genmoji/shotgun-wedding.png'),
    words: ['shotgun', 'wedding'],
    hint: 'Starts with: s, w',
  },
  {
    image: require('../../assets/genmoji/spaghetti-western.png'),
    words: ['spaghetti', 'western'],
    hint: 'Starts with: s, w',
  },
  {
    image: require('../../assets/genmoji/spicy-curry.png'),
    words: ['spicy', 'curry'],
    hint: 'Starts with: s, c',
  },
  {
    image: require('../../assets/genmoji/very-obese-red-robin.png'),
    words: ['very', 'obese', 'red', 'robin'],
    hint: 'Starts with: v, o, r, r',
  },
];

const DAY_MS = 1000 * 60 * 60 * 24;
const DAILY_SEED = 942317;

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

export function getLocalDateKey(date: Date = new Date()): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  return Math.floor(localMidnight.getTime() / DAY_MS);
}

// Last-write wins: appending a new entry with the same date hotfixes the pin.
const DATE_PINNED: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  puzzles.forEach((p, i) => { if (p.date) map[p.date] = i; });
  return map;
})();

// Rotation pool excludes date-pinned puzzles so they don't double-dip.
const ROTATION_INDICES = puzzles
  .map((p, i) => (p.date ? -1 : i))
  .filter((i) => i >= 0);

const DAILY_ORDER = getShuffledIndices(ROTATION_INDICES.length, DAILY_SEED)
  .map((i) => ROTATION_INDICES[i]);

/**
 * Get the puzzle index for a given date.
 * Date-pinned puzzles (date field set) take precedence over the rotation.
 */
export function getDailyPuzzleIndex(date: Date = new Date()): number {
  const pinned = DATE_PINNED[getLocalDateKey(date)];
  if (pinned !== undefined) return pinned;
  const dayIndex = getLocalDayIndex(date);
  return DAILY_ORDER[dayIndex % DAILY_ORDER.length];
}

export function getDailyPuzzle(date: Date = new Date()): MojiMashPuzzle {
  return puzzles[getDailyPuzzleIndex(date)];
}

export default puzzles;
