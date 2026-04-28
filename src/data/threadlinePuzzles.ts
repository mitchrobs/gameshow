export type ThreadlineDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ThreadlineCoord {
  row: number;
  col: number;
}

export interface ThreadlineWord {
  id: string;
  answer: string;
  threadId: string;
  path: ThreadlineCoord[];
  hint: string;
}

export interface ThreadlineThread {
  id: string;
  name: string;
  clue: string;
}

export type ThreadlineSegment =
  | { type: 'text'; text: string }
  | { type: 'blank'; wordId: string };

export interface ThreadlinePuzzle {
  id: string;
  title: string;
  deck: string;
  difficulty: ThreadlineDifficulty;
  grid: string[];
  lead: ThreadlineSegment[];
  threads: ThreadlineThread[];
  words: ThreadlineWord[];
  weave: string;
  note: string;
}

const THREADLINE_PUZZLES: ThreadlinePuzzle[] = [
  {
    id: 'threadline-corner-cafe-001',
    title: 'Corner Cafe',
    deck: 'A city block starts moving as the morning light arrives.',
    difficulty: 'Easy',
    grid: ['OEBRKTNC', 'WQEULSWS', 'SVEISITE', 'VLFKNEPS', 'ZSFDAESY', 'TROMAWII', 'UWCCEGAB', 'SGHNOGDS'],
    threads: [
      { id: 'first-light', name: 'First light', clue: 'The morning arrives.' },
      { id: 'city-starts', name: 'City starts', clue: 'The block gets moving.' },
    ],
    lead: [
      { type: 'text', text: 'Before the city is fully ' },
      { type: 'blank', wordId: 'awake' },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: 'steam' },
      { type: 'text', text: ' lifts from ' },
      { type: 'blank', wordId: 'coffee' },
      { type: 'text', text: ' carts, ' },
      { type: 'blank', wordId: 'buses' },
      { type: 'text', text: ' hiss, and ' },
      { type: 'blank', wordId: 'windows' },
      { type: 'text', text: ' catch the ' },
      { type: 'blank', wordId: 'peach' },
      { type: 'text', text: ' edge of morning.' },
    ],
    words: [
      {
        id: 'awake',
        answer: 'AWAKE',
        threadId: 'first-light',
        hint: 'Not still sleeping.',
        path: [
          { row: 6, col: 6 },
          { row: 5, col: 5 },
          { row: 4, col: 4 },
          { row: 3, col: 3 },
          { row: 2, col: 2 },
        ],
      },
      {
        id: 'steam',
        answer: 'STEAM',
        threadId: 'first-light',
        hint: 'A curl above something hot.',
        path: [
          { row: 1, col: 7 },
          { row: 2, col: 6 },
          { row: 3, col: 5 },
          { row: 4, col: 4 },
          { row: 5, col: 3 },
        ],
      },
      {
        id: 'coffee',
        answer: 'COFFEE',
        threadId: 'city-starts',
        hint: 'The cart smell doing most of the work.',
        path: [
          { row: 6, col: 2 },
          { row: 5, col: 2 },
          { row: 4, col: 2 },
          { row: 3, col: 2 },
          { row: 2, col: 2 },
          { row: 1, col: 2 },
        ],
      },
      {
        id: 'buses',
        answer: 'BUSES',
        threadId: 'city-starts',
        hint: 'They sigh at curbs.',
        path: [
          { row: 0, col: 2 },
          { row: 1, col: 3 },
          { row: 2, col: 4 },
          { row: 3, col: 5 },
          { row: 4, col: 6 },
        ],
      },
      {
        id: 'windows',
        answer: 'WINDOWS',
        threadId: 'city-starts',
        hint: 'Glass squares facing the street.',
        path: [
          { row: 1, col: 6 },
          { row: 2, col: 5 },
          { row: 3, col: 4 },
          { row: 4, col: 3 },
          { row: 5, col: 2 },
          { row: 6, col: 1 },
          { row: 7, col: 0 },
        ],
      },
      {
        id: 'peach',
        answer: 'PEACH',
        threadId: 'first-light',
        hint: 'A soft sunrise color.',
        path: [
          { row: 3, col: 6 },
          { row: 4, col: 5 },
          { row: 5, col: 4 },
          { row: 6, col: 3 },
          { row: 7, col: 2 },
        ],
      },
    ],
    weave: 'The block wakes up.',
    note: 'Morning light and city motion meet in one small street scene.',
  },
  {
    id: 'threadline-rain-check-001',
    title: 'Rain Check',
    deck: 'A rainy trip keeps moving one small cue at a time.',
    difficulty: 'Medium',
    grid: ['AALDKRMH', 'ALMIELET', 'LZLPGTMK', 'WQAEUHIZ', 'OPPMRLTW', 'CUMAUBSS', 'OOICANMK', 'CNOLTHXU'],
    threads: [
      { id: 'weather', name: 'Weather', clue: 'What the morning is doing.' },
      { id: 'route', name: 'Street route', clue: 'How the trip keeps moving.' },
    ],
    lead: [
      { type: 'text', text: 'An ' },
      { type: 'blank', wordId: 'umbrella' },
      { type: 'text', text: ' waits by the door while ' },
      { type: 'blank', wordId: 'rain' },
      { type: 'text', text: ' taps the glass, traffic ' },
      { type: 'blank', wordId: 'lights' },
      { type: 'text', text: ' blur on the avenue, and a folded ' },
      { type: 'blank', wordId: 'paper' },
      { type: 'text', text: ' steadies the ' },
      { type: 'blank', wordId: 'commute' },
      { type: 'text', text: '.' },
    ],
    words: [
      {
        id: 'umbrella',
        answer: 'UMBRELLA',
        threadId: 'weather',
        hint: 'Doorway rain gear.',
        path: [
          { row: 7, col: 7 },
          { row: 6, col: 6 },
          { row: 5, col: 5 },
          { row: 4, col: 4 },
          { row: 3, col: 3 },
          { row: 2, col: 2 },
          { row: 1, col: 1 },
          { row: 0, col: 0 },
        ],
      },
      {
        id: 'rain',
        answer: 'RAIN',
        threadId: 'weather',
        hint: 'What taps the glass.',
        path: [
          { row: 4, col: 4 },
          { row: 5, col: 3 },
          { row: 6, col: 2 },
          { row: 7, col: 1 },
        ],
      },
      {
        id: 'lights',
        answer: 'LIGHTS',
        threadId: 'route',
        hint: 'Traffic signals through the rain.',
        path: [
          { row: 0, col: 2 },
          { row: 1, col: 3 },
          { row: 2, col: 4 },
          { row: 3, col: 5 },
          { row: 4, col: 6 },
          { row: 5, col: 7 },
        ],
      },
      {
        id: 'paper',
        answer: 'PAPER',
        threadId: 'route',
        hint: 'Folded reading material.',
        path: [
          { row: 4, col: 1 },
          { row: 3, col: 2 },
          { row: 2, col: 3 },
          { row: 1, col: 4 },
          { row: 0, col: 5 },
        ],
      },
      {
        id: 'commute',
        answer: 'COMMUTE',
        threadId: 'route',
        hint: 'The trip to work.',
        path: [
          { row: 7, col: 0 },
          { row: 6, col: 1 },
          { row: 5, col: 2 },
          { row: 4, col: 3 },
          { row: 3, col: 4 },
          { row: 2, col: 5 },
          { row: 1, col: 6 },
        ],
      },
    ],
    weave: 'The trip keeps moving through the rain.',
    note: 'Weather and route cues cross without turning the morning gloomy.',
  },
  {
    id: 'threadline-blank-page-001',
    title: 'Blank Page',
    deck: 'Desk objects and work signals turn a blank page into a plan.',
    difficulty: 'Medium',
    grid: ['JRSBXYCZ', 'LEWZKJCY', 'NMQCNEKO', 'UIIARHKX', 'DTLAPTOP', 'SPMWEBTF', 'NIGYNSEV', 'MUGINLNC'],
    threads: [
      { id: 'desk', name: 'Desk pieces', clue: 'Objects on the table.' },
      { id: 'workflow', name: 'Workflow', clue: 'The work taking shape.' },
    ],
    lead: [
      { type: 'text', text: 'The ' },
      { type: 'blank', wordId: 'laptop' },
      { type: 'text', text: ' glows before the ' },
      { type: 'blank', wordId: 'inbox' },
      { type: 'text', text: ' opens; a ' },
      { type: 'blank', wordId: 'sticky' },
      { type: 'text', text: ' note, a ' },
      { type: 'blank', wordId: 'mug' },
      { type: 'text', text: ', and a ticking ' },
      { type: 'blank', wordId: 'timer' },
      { type: 'text', text: ' turn the page into a ' },
      { type: 'blank', wordId: 'plan' },
      { type: 'text', text: '.' },
    ],
    words: [
      {
        id: 'laptop',
        answer: 'LAPTOP',
        threadId: 'desk',
        hint: 'A glowing work machine.',
        path: [
          { row: 4, col: 2 },
          { row: 4, col: 3 },
          { row: 4, col: 4 },
          { row: 4, col: 5 },
          { row: 4, col: 6 },
          { row: 4, col: 7 },
        ],
      },
      {
        id: 'inbox',
        answer: 'INBOX',
        threadId: 'workflow',
        hint: 'Where messages gather.',
        path: [
          { row: 7, col: 3 },
          { row: 6, col: 4 },
          { row: 5, col: 5 },
          { row: 4, col: 6 },
          { row: 3, col: 7 },
        ],
      },
      {
        id: 'sticky',
        answer: 'STICKY',
        threadId: 'desk',
        hint: 'A note that clings.',
        path: [
          { row: 5, col: 0 },
          { row: 4, col: 1 },
          { row: 3, col: 2 },
          { row: 2, col: 3 },
          { row: 1, col: 4 },
          { row: 0, col: 5 },
        ],
      },
      {
        id: 'mug',
        answer: 'MUG',
        threadId: 'desk',
        hint: 'A cup for the desk.',
        path: [
          { row: 7, col: 0 },
          { row: 7, col: 1 },
          { row: 7, col: 2 },
        ],
      },
      {
        id: 'timer',
        answer: 'TIMER',
        threadId: 'workflow',
        hint: 'A ticking focus aid.',
        path: [
          { row: 4, col: 1 },
          { row: 3, col: 1 },
          { row: 2, col: 1 },
          { row: 1, col: 1 },
          { row: 0, col: 1 },
        ],
      },
      {
        id: 'plan',
        answer: 'PLAN',
        threadId: 'workflow',
        hint: 'What the page becomes.',
        path: [
          { row: 5, col: 1 },
          { row: 4, col: 2 },
          { row: 3, col: 3 },
          { row: 2, col: 4 },
        ],
      },
    ],
    weave: 'Desk things become a workday plan.',
    note: 'Objects on the desk and signals of work land in the same final line.',
  },
];

export function getLocalThreadlineDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getDailyThreadline(date: Date = new Date()): ThreadlinePuzzle {
  return THREADLINE_PUZZLES[getDailySeed(date) % THREADLINE_PUZZLES.length];
}

export function getThreadlinePuzzles(): ThreadlinePuzzle[] {
  return THREADLINE_PUZZLES;
}

export function coordKey(coord: ThreadlineCoord): string {
  return `${coord.row}:${coord.col}`;
}

export function getGridLetter(puzzle: ThreadlinePuzzle, coord: ThreadlineCoord): string {
  return puzzle.grid[coord.row]?.[coord.col] ?? '';
}

export function pathToLetters(puzzle: ThreadlinePuzzle, path: ThreadlineCoord[]): string {
  return path.map((coord) => getGridLetter(puzzle, coord)).join('');
}

export function areAdjacent(a: ThreadlineCoord, b: ThreadlineCoord): boolean {
  const rowDelta = Math.abs(a.row - b.row);
  const colDelta = Math.abs(a.col - b.col);
  return rowDelta <= 1 && colDelta <= 1 && rowDelta + colDelta > 0;
}

function sameCoord(a: ThreadlineCoord, b: ThreadlineCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

function directionBetween(a: ThreadlineCoord, b: ThreadlineCoord): ThreadlineCoord {
  return {
    row: Math.sign(b.row - a.row),
    col: Math.sign(b.col - a.col),
  };
}

function pathIsStraight(path: ThreadlineCoord[]): boolean {
  if (path.length < 3) return true;
  const firstDirection = directionBetween(path[0], path[1]);
  return path.every((coord, index) => {
    if (index === 0) return true;
    const previous = path[index - 1];
    const nextDirection = directionBetween(previous, coord);
    return nextDirection.row === firstDirection.row && nextDirection.col === firstDirection.col;
  });
}

export function pathsEqual(a: ThreadlineCoord[], b: ThreadlineCoord[]): boolean {
  return a.length === b.length && a.every((coord, index) => sameCoord(coord, b[index]));
}

export function pathMatchesWord(path: ThreadlineCoord[], word: ThreadlineWord): boolean {
  return pathsEqual(path, word.path) || pathsEqual(path, [...word.path].reverse());
}

export function findWordForPath(
  puzzle: ThreadlinePuzzle,
  path: ThreadlineCoord[],
  foundIds: Set<string>
): ThreadlineWord | null {
  return (
    puzzle.words.find((word) => !foundIds.has(word.id) && pathMatchesWord(path, word)) ?? null
  );
}

export function validateThreadlinePuzzle(puzzle: ThreadlinePuzzle): string[] {
  const errors: string[] = [];
  const rowLength = puzzle.grid[0]?.length ?? 0;

  puzzle.grid.forEach((row, rowIndex) => {
    if (row.length !== rowLength) {
      errors.push(`${puzzle.id}: row ${rowIndex} has length ${row.length}, expected ${rowLength}`);
    }
    if (!/^[A-Z]+$/.test(row)) {
      errors.push(`${puzzle.id}: row ${rowIndex} contains non-uppercase letters`);
    }
  });

  const wordIds = new Set<string>();
  const threadIds = new Set(puzzle.threads.map((thread) => thread.id));
  if (puzzle.threads.length !== 2) {
    errors.push(`${puzzle.id}: expected exactly two threads`);
  }
  puzzle.words.forEach((word) => {
    if (wordIds.has(word.id)) {
      errors.push(`${puzzle.id}: duplicate word id ${word.id}`);
    }
    wordIds.add(word.id);

    if (word.answer !== word.answer.toUpperCase()) {
      errors.push(`${puzzle.id}: ${word.id} answer must be uppercase`);
    }
    if (!threadIds.has(word.threadId)) {
      errors.push(`${puzzle.id}: ${word.id} references missing thread ${word.threadId}`);
    }
    if (word.path.length !== word.answer.length) {
      errors.push(`${puzzle.id}: ${word.id} path length does not match answer`);
    }
    if (!pathIsStraight(word.path)) {
      errors.push(`${puzzle.id}: ${word.id} path must stay in one straight line`);
    }
    word.path.forEach((coord, index) => {
      if (coord.row < 0 || coord.row >= puzzle.grid.length || coord.col < 0 || coord.col >= rowLength) {
        errors.push(`${puzzle.id}: ${word.id} coordinate ${index} is out of bounds`);
      }
      if (index > 0 && !areAdjacent(word.path[index - 1], coord)) {
        errors.push(`${puzzle.id}: ${word.id} coordinate ${index} is not adjacent`);
      }
    });
    const letters = pathToLetters(puzzle, word.path);
    if (letters !== word.answer) {
      errors.push(`${puzzle.id}: ${word.id} path spells ${letters}, expected ${word.answer}`);
    }
  });

  puzzle.lead.forEach((segment) => {
    if (segment.type === 'blank' && !wordIds.has(segment.wordId)) {
      errors.push(`${puzzle.id}: lead references missing word ${segment.wordId}`);
    }
  });

  return errors;
}
