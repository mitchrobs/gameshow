export interface MojiMashPuzzle {
  /** The emoji combination displayed to the player */
  display: string;
  /** The words used to "generate" the genmoji (lowercase) */
  words: string[];
  /** A hint shown after 3 wrong guesses */
  hint: string;
}

/**
 * Each puzzle represents a "genmoji" — an AI-generated emoji made from 2-3 words.
 * The display is a combo of real emojis that visually represents the mash-up.
 * Players must guess the original words.
 */
const puzzles: MojiMashPuzzle[] = [
  {
    display: '🐱💻',
    words: ['cat', 'coding'],
    hint: 'A feline at work on something digital',
  },
  {
    display: '🌮🦄',
    words: ['taco', 'unicorn'],
    hint: 'Magical Mexican food',
  },
  {
    display: '🧠💪',
    words: ['brain', 'muscle'],
    hint: 'Intelligence meets strength',
  },
  {
    display: '🐶☁️',
    words: ['dog', 'cloud'],
    hint: 'A fluffy pet in the sky',
  },
  {
    display: '🍕🚀',
    words: ['pizza', 'rocket'],
    hint: 'Italian food goes to space',
  },
  {
    display: '🦊❄️',
    words: ['fox', 'ice'],
    hint: 'An arctic animal',
  },
  {
    display: '🌻🌙',
    words: ['sunflower', 'moon'],
    hint: 'A bloom under the night sky',
  },
  {
    display: '🐸👑',
    words: ['frog', 'king'],
    hint: 'A fairy tale amphibian',
  },
  {
    display: '🎸🔥',
    words: ['guitar', 'fire'],
    hint: 'A blazing instrument',
  },
  {
    display: '🐧🎩',
    words: ['penguin', 'hat'],
    hint: 'A fancy antarctic bird',
  },
  {
    display: '🍩🌈',
    words: ['donut', 'rainbow'],
    hint: 'Colorful circular treat',
  },
  {
    display: '🦁🧊',
    words: ['lion', 'ice'],
    hint: 'A frozen king of the jungle',
  },
  {
    display: '🌊🐉',
    words: ['wave', 'dragon'],
    hint: 'A mythical sea creature',
  },
  {
    display: '🎭🤖',
    words: ['theater', 'robot'],
    hint: 'An artificial performer',
  },
  {
    display: '🍄⭐',
    words: ['mushroom', 'star'],
    hint: 'A classic video game power-up',
  },
  {
    display: '🐻🍯🌙',
    words: ['bear', 'honey', 'night'],
    hint: 'A nocturnal snacking animal',
  },
  {
    display: '🦈🌪️',
    words: ['shark', 'tornado'],
    hint: 'A famously bad movie concept',
  },
  {
    display: '🐙🎨',
    words: ['octopus', 'paint'],
    hint: 'A multi-armed artist',
  },
  {
    display: '🦉📚',
    words: ['owl', 'book'],
    hint: 'A wise reader',
  },
  {
    display: '🐝🏰',
    words: ['bee', 'castle'],
    hint: 'A royal hive',
  },
  {
    display: '🍋😤',
    words: ['lemon', 'angry'],
    hint: 'A sour attitude',
  },
  {
    display: '🐢🏎️',
    words: ['turtle', 'race'],
    hint: 'A slow creature going fast',
  },
  {
    display: '🌵👻',
    words: ['cactus', 'ghost'],
    hint: 'A spooky desert plant',
  },
  {
    display: '🦜🏴‍☠️',
    words: ['parrot', 'pirate'],
    hint: 'A classic shoulder companion',
  },
  {
    display: '🐋🎵',
    words: ['whale', 'music'],
    hint: 'An ocean singer',
  },
  {
    display: '🦊🔮✨',
    words: ['fox', 'crystal', 'magic'],
    hint: 'A mystical woodland creature',
  },
  {
    display: '🐼🎂',
    words: ['panda', 'cake'],
    hint: 'A black and white birthday treat',
  },
  {
    display: '🦩🌴',
    words: ['flamingo', 'palm'],
    hint: 'A tropical pink scene',
  },
  {
    display: '🐺🌕',
    words: ['wolf', 'moon'],
    hint: 'A howling night scene',
  },
  {
    display: '🦋💎',
    words: ['butterfly', 'gem'],
    hint: 'A precious winged insect',
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
