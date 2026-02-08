import { ImageSourcePropType } from 'react-native';

export interface MojiMashPuzzle {
  /** The genmoji image displayed to the player */
  image: ImageSourcePropType;
  /** The words used to "generate" the genmoji (lowercase) */
  words: string[];
  /** A hint shown after 3 wrong guesses */
  hint: string;
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
    image: require('../../assets/genmoji/chandelier-glass.png'),
    words: ['chandelier', 'glass'],
    hint: 'Starts with: c, g',
  },
  {
    image: require('../../assets/genmoji/christmas-ham.png'),
    words: ['christmas', 'ham'],
    hint: 'Starts with: c, h',
  },
  {
    image: require('../../assets/genmoji/city-llama-family.png'),
    words: ['city', 'llama', 'family'],
    hint: 'Starts with: c, l, f',
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

/**
 * Get the puzzle for today based on the date.
 * Cycles through puzzles so there's always one available.
 */
export function getDailyPuzzle(): MojiMashPuzzle {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return puzzles[dayOfYear % puzzles.length];
}

/** Get a random puzzle (for practice / demo mode) */
export function getRandomPuzzle(): MojiMashPuzzle {
  return puzzles[Math.floor(Math.random() * puzzles.length)];
}

export default puzzles;
