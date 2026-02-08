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
    image: require('../../assets/genmoji/music-video.png'),
    words: ['music', 'video'],
    hint: 'Starts with: m, v',
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
