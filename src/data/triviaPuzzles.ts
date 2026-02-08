export interface TriviaQuestion {
  prompt: string;
  options: string[];
  answerIndex: number;
}

export interface TriviaCategory {
  id: string;
  name: string;
  description: string;
  questions: TriviaQuestion[];
}

const CATEGORIES: TriviaCategory[] = [
  {
    id: 'world',
    name: 'World & Places',
    description: 'Geography, landmarks, and cultures.',
    questions: [
      {
        prompt: 'Which city is known as the "City of Canals"?',
        options: ['Amsterdam', 'Venice', 'Bangkok', 'Bruges'],
        answerIndex: 1,
      },
      {
        prompt: 'Machu Picchu is located in which country?',
        options: ['Peru', 'Chile', 'Bolivia', 'Ecuador'],
        answerIndex: 0,
      },
      {
        prompt: 'The Great Barrier Reef lies off the coast of which country?',
        options: ['South Africa', 'Australia', 'Mexico', 'Indonesia'],
        answerIndex: 1,
      },
      {
        prompt: 'Which desert is the largest hot desert in the world?',
        options: ['Sahara', 'Gobi', 'Mojave', 'Kalahari'],
        answerIndex: 0,
      },
      {
        prompt: 'What is the capital of New Zealand?',
        options: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'],
        answerIndex: 1,
      },
      {
        prompt: 'Which river runs through Paris?',
        options: ['Thames', 'Seine', 'Rhine', 'Danube'],
        answerIndex: 1,
      },
      {
        prompt: 'Which U.S. state has the most active volcanoes?',
        options: ['Alaska', 'Hawaii', 'California', 'Washington'],
        answerIndex: 0,
      },
      {
        prompt: 'Petra, the ancient city carved into rock, is in which country?',
        options: ['Jordan', 'Turkey', 'Greece', 'Egypt'],
        answerIndex: 0,
      },
      {
        prompt: 'The Andes mountain range runs along which continent?',
        options: ['Africa', 'Asia', 'South America', 'Europe'],
        answerIndex: 2,
      },
      {
        prompt: 'Which country has the most islands in the world?',
        options: ['Norway', 'Indonesia', 'Sweden', 'Canada'],
        answerIndex: 2,
      },
      {
        prompt: 'Mount Kilimanjaro is located in which country?',
        options: ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'],
        answerIndex: 1,
      },
      {
        prompt: 'Which city is home to the Sydney Opera House?',
        options: ['Melbourne', 'Sydney', 'Perth', 'Adelaide'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'science',
    name: 'Science & Nature',
    description: 'Space, biology, and the natural world.',
    questions: [
      {
        prompt: 'What planet is known as the Red Planet?',
        options: ['Mars', 'Jupiter', 'Mercury', 'Venus'],
        answerIndex: 0,
      },
      {
        prompt: 'Which gas do plants absorb during photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'],
        answerIndex: 2,
      },
      {
        prompt: 'What is the largest organ in the human body?',
        options: ['Heart', 'Skin', 'Liver', 'Lung'],
        answerIndex: 1,
      },
      {
        prompt: 'How many bones are in the adult human body?',
        options: ['206', '208', '201', '212'],
        answerIndex: 0,
      },
      {
        prompt: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Gd', 'Go'],
        answerIndex: 1,
      },
      {
        prompt: 'Which animal has the fastest land speed?',
        options: ['Cheetah', 'Lion', 'Pronghorn', 'Greyhound'],
        answerIndex: 0,
      },
      {
        prompt: 'Which layer of Earth lies just below the crust?',
        options: ['Core', 'Mantle', 'Outer core', 'Lithosphere'],
        answerIndex: 1,
      },
      {
        prompt: 'Which planet has the most moons (as of 2024)?',
        options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
        answerIndex: 1,
      },
      {
        prompt: 'DNA stands for what?',
        options: [
          'Deoxyribonucleic acid',
          'Deoxyribose nucleic acid',
          'Dinucleic acid',
          'Deoxynitric acid',
        ],
        answerIndex: 0,
      },
      {
        prompt: 'What is the smallest unit of life?',
        options: ['Atom', 'Cell', 'Molecule', 'Organ'],
        answerIndex: 1,
      },
      {
        prompt: 'Which blood type is known as the universal donor?',
        options: ['O negative', 'AB positive', 'A positive', 'B negative'],
        answerIndex: 0,
      },
      {
        prompt: "What is the main gas in Earth's atmosphere?",
        options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon'],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'arts',
    name: 'Arts & Pop',
    description: 'Movies, music, books, and culture.',
    questions: [
      {
        prompt: 'Which band released the album "Abbey Road"?',
        options: ['The Beatles', 'The Rolling Stones', 'Pink Floyd', 'Queen'],
        answerIndex: 0,
      },
      {
        prompt: 'Who wrote "1984"?',
        options: ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'Philip K. Dick'],
        answerIndex: 0,
      },
      {
        prompt: 'Which movie features the quote, "May the Force be with you"?',
        options: ['Star Wars', 'Star Trek', 'Dune', 'Blade Runner'],
        answerIndex: 0,
      },
      {
        prompt: "What is the name of Sherlock Holmes' assistant?",
        options: ['Watson', 'Hudson', 'Lestrade', 'Moriarty'],
        answerIndex: 0,
      },
      {
        prompt: 'Which artist painted the Mona Lisa?',
        options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Van Gogh'],
        answerIndex: 1,
      },
      {
        prompt: 'In music, what does "forte" mean?',
        options: ['Fast', 'Soft', 'Loud', 'Slow'],
        answerIndex: 2,
      },
      {
        prompt: 'Which film won Best Picture at the 2020 Oscars?',
        options: ['1917', 'Joker', 'Parasite', 'Ford v Ferrari'],
        answerIndex: 2,
      },
      {
        prompt: 'Which novel opens with "Call me Ishmael"?',
        options: ['Moby-Dick', 'The Old Man and the Sea', 'Dracula', 'Frankenstein'],
        answerIndex: 0,
      },
      {
        prompt: 'Which artist is known for the sculpture "The Thinker"?',
        options: ['Rodin', 'Bernini', 'Donatello', 'Degas'],
        answerIndex: 0,
      },
      {
        prompt: 'Which character lives in a pineapple under the sea?',
        options: ['SpongeBob', 'Patrick', 'Squidward', 'Plankton'],
        answerIndex: 0,
      },
      {
        prompt: 'What is the highest-grossing film of all time (as of 2024)?',
        options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'The Force Awakens'],
        answerIndex: 0,
      },
      {
        prompt: 'Who is the author of the Harry Potter series?',
        options: ['J.K. Rowling', 'Philip Pullman', 'Neil Gaiman', 'Suzanne Collins'],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'history',
    name: 'History & Inventions',
    description: 'Timelines, breakthroughs, and famous figures.',
    questions: [
      {
        prompt: 'Who was the first person to walk on the Moon?',
        options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins'],
        answerIndex: 1,
      },
      {
        prompt: 'The printing press was invented by which person?',
        options: ['Johannes Gutenberg', 'Isaac Newton', 'Thomas Edison', 'Nikola Tesla'],
        answerIndex: 0,
      },
      {
        prompt: 'Which ancient civilization built the Pyramids of Giza?',
        options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'],
        answerIndex: 2,
      },
      {
        prompt: 'Which war ended with the Treaty of Versailles?',
        options: ['World War I', 'World War II', 'Crimean War', 'Cold War'],
        answerIndex: 0,
      },
      {
        prompt: 'Who painted the ceiling of the Sistine Chapel?',
        options: ['Michelangelo', 'Da Vinci', 'Raphael', 'Caravaggio'],
        answerIndex: 0,
      },
      {
        prompt: 'The telephone was invented by which person?',
        options: ['Alexander Graham Bell', 'Thomas Edison', 'Guglielmo Marconi', 'Nikola Tesla'],
        answerIndex: 0,
      },
      {
        prompt: 'In which year did the Berlin Wall fall?',
        options: ['1987', '1989', '1991', '1993'],
        answerIndex: 1,
      },
      {
        prompt: 'Which empire was ruled by Genghis Khan?',
        options: ['Ottoman Empire', 'Mongol Empire', 'Roman Empire', 'Persian Empire'],
        answerIndex: 1,
      },
      {
        prompt: 'Who discovered penicillin?',
        options: ['Louis Pasteur', 'Alexander Fleming', 'Marie Curie', 'Gregor Mendel'],
        answerIndex: 1,
      },
      {
        prompt: 'The Magna Carta was signed in which year?',
        options: ['1066', '1215', '1492', '1776'],
        answerIndex: 1,
      },
      {
        prompt: 'Which civilization built Machu Picchu?',
        options: ['Inca', 'Aztec', 'Olmec', 'Maya'],
        answerIndex: 0,
      },
      {
        prompt: 'Who was the first female Prime Minister of the UK?',
        options: ['Theresa May', 'Margaret Thatcher', 'Indira Gandhi', 'Angela Merkel'],
        answerIndex: 1,
      },
    ],
  },
];

const DAY_MS = 1000 * 60 * 60 * 24;
const DAILY_SEED = 773401;

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
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / DAY_MS);
}

function getDailySeed(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getDailyTriviaCategories(date: Date = new Date()): TriviaCategory[] {
  const rand = mulberry32(getDailySeed(date) + DAILY_SEED);
  const shuffled = seededShuffle(CATEGORIES, rand);
  return shuffled.slice(0, 2);
}

export function getTriviaQuestions(categoryId: string, date: Date = new Date()): TriviaQuestion[] {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return [];
  const rand = mulberry32(getDailySeed(date) + DAILY_SEED + categoryId.length * 97);
  const shuffled = seededShuffle(category.questions, rand);
  return shuffled.slice(0, 8);
}

export function getTriviaCategory(id: string): TriviaCategory | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export default CATEGORIES;
