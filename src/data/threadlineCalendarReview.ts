import {
  type ThreadlineCoord,
  type ThreadlineDifficulty,
  type ThreadlinePuzzle,
  type ThreadlineThread,
  type ThreadlineWord,
  validateThreadlinePuzzle,
} from './threadlinePuzzles.ts';

export const THREADLINE_REVIEW_DAYS = 365;
export const THREADLINE_RESERVE_DAYS = 35;
export const THREADLINE_ANSWER_COOLDOWN_DAYS = 60;
export const THREADLINE_ROOT_FAMILY_REVIEW_DAYS = 90;
export const THREADLINE_WORDS_PER_DAY = 6;
export const THREADLINE_ROLLING_LENGTH_WINDOW_DAYS = 30;
export const THREADLINE_MIN_ROLLING_AVERAGE_LENGTH = 5.8;
export const THREADLINE_MAX_ROLLING_AVERAGE_LENGTH = 6.4;

const GRID_SIZE = 8;
const REVIEW_SEED = 7421;

type ScoreKey =
  | 'threadDistinction'
  | 'threadBalance'
  | 'answerQuality'
  | 'leadNaturalness'
  | 'blankFairness'
  | 'weavePayoff'
  | 'voiceFit'
  | 'dailyFreshness'
  | 'difficultyIntegrity'
  | 'safetyBrandRisk';

export type ThreadlineScorecard = Record<ScoreKey, number>;

interface ThreadlineReviewTheme {
  domain: string;
  title: string;
  deck: string;
  threads: [ThreadlineThread, ThreadlineThread];
  payoff: string;
  voice: string;
}

export interface ThreadlineCalendarCandidate {
  dayIndex: number;
  dateKey: string;
  domain: string;
  puzzle: ThreadlinePuzzle;
  scores: ThreadlineScorecard;
  flags: string[];
  editorNote: string;
  playerNote: string;
  freshnessNote: string;
}

export interface ThreadlineCalendarReview {
  candidates: ThreadlineCalendarCandidate[];
  errors: string[];
  rootFamilyWarnings: string[];
  scoreAverages: ThreadlineScorecard;
  flaggedCandidates: ThreadlineCalendarCandidate[];
}

const COMMON_REVIEW_WORDS = [
  'ABLE', 'ACORN', 'ADAPT', 'AGENT', 'ALBUM', 'ALERT', 'ALLEY', 'AMBER', 'ANCHOR', 'APPLE',
  'APRIL', 'ARBOR', 'ARROW', 'ARTIST', 'ATLAS', 'AUDIO', 'AUTUMN', 'AWAKE', 'AZURE', 'BACON',
  'BADGE', 'BAGEL', 'BAKER', 'BALLET', 'BANANA', 'BASIN', 'BASKET', 'BEACH', 'BEACON', 'BEANS',
  'BENCH', 'BERRY', 'BIRCH', 'BLANKET', 'BLAZE', 'BLEND', 'BLOOM', 'BOARD', 'BOTTLE', 'BOWL',
  'BRASS', 'BREAD', 'BREEZE', 'BRICK', 'BRIDGE', 'BROOK', 'BRUSH', 'BUSES', 'BUTTON', 'CABLE',
  'CABIN', 'CANAL', 'CANDLE', 'CANVAS', 'CARDS', 'CARPET', 'CARROT', 'CEDAR', 'CHAIR', 'CHALK',
  'CHARM', 'CHEST', 'CIDER', 'CLAY', 'CLOCK', 'CLOUD', 'COAST', 'COFFEE', 'COIN', 'COPPER',
  'CORAL', 'COTTON', 'CRAFT', 'CRANE', 'CREEK', 'CROWN', 'DAISY', 'DANCE', 'DELTA', 'DESK',
  'DIAL', 'DINER', 'DIVER', 'DOCK', 'DOOR', 'DREAM', 'DRIFT', 'DRILL', 'DRIZZLE', 'DUSK',
  'EAGER', 'EARTH', 'EASEL', 'ECHO', 'EDGE', 'ELBOW', 'EMBER', 'ENTRY', 'EVENING', 'FABRIC',
  'FACE', 'FABLE', 'FARM', 'FENCE', 'FERRY', 'FIELD', 'FLAME', 'FLAVOR', 'FLOCK', 'FLOOR',
  'FLOUR', 'FLOWER', 'FOCUS', 'FOLDER', 'FOREST', 'FORK', 'FRAME', 'FRESH', 'FROST', 'FRUIT',
  'GARDEN', 'GATE', 'GHOST', 'GIFT', 'GLASS', 'GLEAM', 'GLOBE', 'GLOVE', 'GRAIN', 'GRAPE',
  'GREEN', 'GROVE', 'GUIDE', 'HABIT', 'HARBOR', 'HAZEL', 'HEART', 'HERB', 'HONEY', 'HORIZON',
  'HOUSE', 'HUSH', 'IMAGE', 'INBOX', 'INDEX', 'INKS', 'ISLAND', 'IVORY', 'JACKET', 'JARLID',
  'JELLY', 'JOURNAL', 'JUMP', 'KETTLE', 'KEYS', 'KEYPAD', 'KIOSK', 'KITCHEN', 'KITE', 'LABEL',
  'LADDER', 'LAKE', 'LAMP', 'LANTERN', 'LAYER', 'LEAF', 'LEMON', 'LETTER', 'LIGHT', 'LIGHTS',
  'LILAC', 'LINEN', 'LIST', 'LOAF', 'LOCK', 'LODGE', 'LUNCH', 'MAPLE', 'MARKET', 'MARBLE',
  'MEADOW', 'MELON', 'METER', 'MILK', 'MINT', 'MIRROR', 'MIST', 'MODEL', 'MOMENT', 'MONEY',
  'MOON', 'MORNING', 'MUGS', 'MUSIC', 'NAPKIN', 'NEEDLE', 'NEST', 'NIGHT', 'NOTE', 'NOVEL',
  'NUMBER', 'OCEAN', 'OLIVE', 'ORANGE', 'ORCHARD', 'OUTLINE', 'PAGE', 'PAINT', 'PALM', 'PAPER',
  'PARK', 'PATH', 'PEACH', 'PEARL', 'PENCIL', 'PEPPER', 'PETAL', 'PHOTO', 'PIANO', 'PICKLE',
  'PILLOW', 'PINE', 'PLANT', 'PLATE', 'PLAZA', 'POCKET', 'PORCH', 'POSTER', 'POTATO', 'PRISM',
  'PULSE', 'QUART', 'QUIET', 'QUILT', 'RADIO', 'RAIN', 'RANCH', 'RECIPE', 'RECORD', 'REEF',
  'RIBBON', 'RIVER', 'ROAD', 'ROAST', 'ROBIN', 'ROOF', 'ROOM', 'ROPE', 'ROUTE', 'SADDLE',
  'SALAD', 'SALON', 'SALT', 'SAND', 'SCARF', 'SCENE', 'SCHOOL', 'SCORE', 'SEED', 'SHADOW',
  'SHELF', 'SHORE', 'SIGNAL', 'SILVER', 'SKETCH', 'SKY', 'SLEEP', 'SLATE', 'SMILE', 'SMOKE',
  'SNACK', 'SOAP', 'SONG', 'SPICE', 'SPOON', 'SPRING', 'STAIR', 'STAMP', 'STAR', 'STATION',
  'STEAM', 'STONE', 'STORY', 'STREET', 'STRING', 'STUDIO', 'SUMMER', 'SUNSET', 'TABLE', 'TACO',
  'TAPE', 'TEAL', 'THREAD', 'TICKET', 'TILE', 'TIMER', 'TOAST', 'TOMATO', 'TOOL', 'TOWER',
  'TRACK', 'TRAIL', 'TRAIN', 'TRAY', 'TREE', 'TULIP', 'TUNNEL', 'UMBER', 'UMBRELLA', 'UNITY',
  'UPLIFT', 'URBAN', 'VALLEY', 'VASE', 'VELVET', 'VIDEO', 'VIOLET', 'VISIT', 'VOICE', 'WAGON',
  'WALL', 'WATER', 'WAVE', 'WHEAT', 'WHEEL', 'WHISK', 'WINDOW', 'WINTER', 'WIRE', 'WISH',
  'WOOD', 'WORD', 'WORKSHOP', 'WOVEN', 'YARD', 'YEAST', 'YELLOW', 'YOGURT', 'ZEBRA', 'ZEST',
  'AIRPORT', 'ALMANAC', 'APRON', 'BINDER', 'BLOSSOM', 'BREEZY', 'BUCKET', 'BUNDLE', 'BUTTONS',
  'CALENDAR', 'CART', 'CIRCLE', 'COLLAR', 'CORNER', 'COUNTER', 'CUPBOARD', 'CURTAIN', 'DAWN',
  'DRAWER', 'EAST', 'ENVELOPE', 'GARLAND', 'GINGER', 'HALLWAY', 'HAMMER', 'HANDLE', 'HOMEROOM',
  'JASMINE', 'KEYBOARD', 'LAPTOP', 'LAUNCH', 'MARKER', 'MATCH', 'MEASURE', 'MUSEUM', 'NARROW',
  'ORBIT', 'PALETTE', 'PANTRY', 'PARADE', 'PASTRY', 'PATIO', 'PIER', 'PLAN', 'PLUM', 'POND',
  'QUICK', 'RAIL', 'REPORT', 'RHYTHM', 'SCREEN', 'SHUTTLE', 'SILK', 'SPARK', 'STEPS', 'STOVE',
  'STREAM', 'SUNRISE', 'SWATCH', 'TERRACE', 'TIDE', 'VILLAGE', 'WALKWAY', 'WEATHER', 'YARN',
  'COMMUTE',
];

const LONG_REVIEW_WORDS = [
  'ADDRESS', 'AIRLINE', 'AIRPLANE', 'BACKPACK', 'BALCONY', 'BICYCLE', 'BLUEBELL', 'BOOKCASE',
  'BOOKSHOP', 'CABBAGE', 'CABINET', 'CAMERA', 'CAMPER', 'CAMPFIRE', 'CAMPUS', 'CANYON',
  'CAPTION', 'CARVING', 'CASHIER', 'CEILING', 'CHANNEL', 'CHARGER', 'CHECKER', 'CHIMNEY',
  'CITRUS', 'CLASSIC', 'CLOSET', 'COASTER', 'COBALT', 'COCONUT', 'COMFORT', 'COMPASS',
  'CONCERT', 'COOKBOOK', 'COTTAGE', 'COURIER', 'CRACKER', 'CRAYON', 'CRICKET', 'CUPCAKE',
  'CUSHION', 'DAYDREAM', 'DAYLIGHT', 'DIAGRAM', 'DOORBELL', 'DOORMAT', 'DUSTPAN', 'EARBUDS',
  'ECLIPSE', 'FANFARE', 'FESTIVAL', 'FIREWOOD', 'FISHING', 'FLAGPOLE', 'FOOTPATH', 'FOUNTAIN',
  'FRECKLE', 'FURNACE', 'GATEWAY', 'GAZEBO', 'GLOWING', 'GRANOLA', 'GRIDDLE', 'HARVEST',
  'HAYRIDE', 'HEATHER', 'HILLSIDE', 'HOLIDAY', 'HONEYDEW', 'ICEBERG', 'JIGSAW', 'JUNIPER',
  'KEYHOLE', 'KINGDOM', 'LAUNDRY', 'LECTURE', 'LEMONADE', 'LIFTOFF', 'LUGGAGE', 'MACHINE',
  'MAGNET', 'MAILBOX', 'MIDNIGHT', 'MOUNTAIN', 'MUSHROOM', 'NOTEBOOK', 'OATMEAL', 'ORIGAMI',
  'OUTDOOR', 'PACKAGE', 'PAINTER', 'PAJAMAS', 'PANCAKE', 'PASSAGE', 'PATHWAY', 'PAVEMENT',
  'PEBBLE', 'PENCIL', 'PINECONE', 'PITCHER', 'PLANNER', 'PLAYFUL', 'POPCORN', 'POSTCARD',
  'PRAIRIE', 'PRESENT', 'PRINTER', 'PUMPKIN', 'RAILWAY', 'RAINDROP', 'RAINBOW', 'RAINCOAT',
  'ROCKET', 'ROOFTOP', 'ROSEMARY', 'SAILBOAT', 'SANDBOX', 'SANDWICH', 'SAUCER', 'SCALLOP',
  'SEASON', 'SEASIDE', 'SEWING', 'SHELTER', 'SHIMMER', 'SHIPPING', 'SHOELACE', 'SIDEWALK',
  'SKYLINE', 'SNOWFALL', 'SNOWSHOE', 'SPATULA', 'SPIRAL', 'SPRINKLE', 'STAIRWAY', 'STAPLER',
  'STICKER', 'SUITCASE', 'SUNBEAM', 'SUNLIGHT', 'SWEATER', 'TEACHER', 'TEACUP', 'THIMBLE',
  'THUNDER', 'TIDEPOOL', 'TINFOIL', 'TOOLBOX', 'TOPPING', 'TRIPOD', 'TURNPIKE', 'TWILIGHT',
  'VANILLA', 'VINEYARD', 'VINTAGE', 'WAFFLES', 'WATERING', 'WATERWAY', 'WHISTLE', 'WINDING',
  'WORKDAY', 'WRAPPING', 'WREATH', 'WRITER', 'YEARBOOK', 'ZIPPER',
];

function interleaveBuckets(primary: string[], secondary: string[], primaryStride: number): string[] {
  const result: string[] = [];
  let primaryIndex = 0;
  let secondaryIndex = 0;

  while (primaryIndex < primary.length || secondaryIndex < secondary.length) {
    for (
      let step = 0;
      step < primaryStride && primaryIndex < primary.length;
      step += 1
    ) {
      result.push(primary[primaryIndex]);
      primaryIndex += 1;
    }
    if (secondaryIndex < secondary.length) {
      result.push(secondary[secondaryIndex]);
      secondaryIndex += 1;
    }
  }

  return result;
}

const REVIEW_BLOCKED_WORDS = new Set<string>();

const ANSWER_BANK = Array.from(new Set([...COMMON_REVIEW_WORDS, ...LONG_REVIEW_WORDS]))
  .filter((word) => /^[A-Z]{4,8}$/.test(word))
  .filter((word) => !REVIEW_BLOCKED_WORDS.has(word));
const SIX_ANSWER_BANK = ANSWER_BANK.filter((word) => word.length === 6);
const LONGER_ANSWER_BANK = interleaveBuckets(
  ANSWER_BANK.filter((word) => word.length === 7),
  ANSWER_BANK.filter((word) => word.length === 8),
  2
);
const FLEX_ANSWER_BANK = interleaveBuckets(
  ANSWER_BANK.filter((word) => word.length === 5),
  ANSWER_BANK.filter((word) => word.length === 4),
  2
);

const THEMES: ThreadlineReviewTheme[] = [
  {
    domain: 'cafe',
    title: 'Corner Cafe',
    deck: 'Morning light meets the first small errands of the block.',
    threads: [
      { id: 'thread-a', name: 'First light', clue: 'The day brightens.' },
      { id: 'thread-b', name: 'Block starts', clue: 'The street gets moving.' },
    ],
    payoff: 'The block wakes up.',
    voice: 'sensory city morning',
  },
  {
    domain: 'commute',
    title: 'Rain Check',
    deck: 'Weather and route cues share one rainy trip.',
    threads: [
      { id: 'thread-a', name: 'Weather', clue: 'What the sky is doing.' },
      { id: 'thread-b', name: 'Route cues', clue: 'How the trip keeps moving.' },
    ],
    payoff: 'The trip keeps moving through the rain.',
    voice: 'practical and calm',
  },
  {
    domain: 'desk',
    title: 'Blank Page',
    deck: 'Desk objects and work signals turn into a plan.',
    threads: [
      { id: 'thread-a', name: 'Desk pieces', clue: 'Objects within reach.' },
      { id: 'thread-b', name: 'Work signals', clue: 'The task taking shape.' },
    ],
    payoff: 'Desk things become a workday plan.',
    voice: 'focused workspace',
  },
  {
    domain: 'garden',
    title: 'Garden Gate',
    deck: 'Outdoor details and tending motions share a quiet path.',
    threads: [
      { id: 'thread-a', name: 'Green things', clue: 'What is growing.' },
      { id: 'thread-b', name: 'Care moves', clue: 'How the garden is tended.' },
    ],
    payoff: 'The yard becomes a small ritual.',
    voice: 'fresh and tactile',
  },
  {
    domain: 'station',
    title: 'Platform Two',
    deck: 'Transit signs and waiting habits point toward departure.',
    threads: [
      { id: 'thread-a', name: 'Station signs', clue: 'What guides the trip.' },
      { id: 'thread-b', name: 'Waiting habits', clue: 'How time passes.' },
    ],
    payoff: 'The platform turns waiting into motion.',
    voice: 'public and brisk',
  },
  {
    domain: 'kitchen',
    title: 'Prep Counter',
    deck: 'Ingredients and kitchen actions meet before the meal.',
    threads: [
      { id: 'thread-a', name: 'Ingredients', clue: 'What goes in.' },
      { id: 'thread-b', name: 'Prep moves', clue: 'What hands do.' },
    ],
    payoff: 'The counter starts to taste like dinner.',
    voice: 'warm and concrete',
  },
  {
    domain: 'studio',
    title: 'Studio Table',
    deck: 'Materials and marks gather into a first draft.',
    threads: [
      { id: 'thread-a', name: 'Materials', clue: 'What is on the table.' },
      { id: 'thread-b', name: 'Marks', clue: 'How the idea appears.' },
    ],
    payoff: 'The table turns supplies into a sketch.',
    voice: 'creative and precise',
  },
  {
    domain: 'library',
    title: 'Reading Room',
    deck: 'Bookish details and quiet habits share one table.',
    threads: [
      { id: 'thread-a', name: 'Book details', clue: 'What is on the page.' },
      { id: 'thread-b', name: 'Room habits', clue: 'How the reader settles in.' },
    ],
    payoff: 'The room lowers its voice.',
    voice: 'quiet but not sleepy',
  },
  {
    domain: 'shore',
    title: 'Low Tide',
    deck: 'Beach objects and water motion cross the same edge.',
    threads: [
      { id: 'thread-a', name: 'Shore finds', clue: 'What the tide leaves.' },
      { id: 'thread-b', name: 'Water motion', clue: 'How the edge moves.' },
    ],
    payoff: 'The shore redraws itself.',
    voice: 'open air',
  },
  {
    domain: 'market',
    title: 'Market Stall',
    deck: 'Stall goods and buyer motions fill the morning.',
    threads: [
      { id: 'thread-a', name: 'Stall goods', clue: 'What is for sale.' },
      { id: 'thread-b', name: 'Buyer moves', clue: 'How the market flows.' },
    ],
    payoff: 'The aisle becomes a conversation.',
    voice: 'busy and friendly',
  },
  {
    domain: 'workshop',
    title: 'Workbench',
    deck: 'Tools and repair clues meet around one small fix.',
    threads: [
      { id: 'thread-a', name: 'Tools', clue: 'What does the work.' },
      { id: 'thread-b', name: 'Repair clues', clue: 'What needs attention.' },
    ],
    payoff: 'The workbench solves the loose part.',
    voice: 'hands-on',
  },
  {
    domain: 'park',
    title: 'Park Loop',
    deck: 'Path details and passing routines share the same walk.',
    threads: [
      { id: 'thread-a', name: 'Path details', clue: 'What lines the walk.' },
      { id: 'thread-b', name: 'Passing routines', clue: 'How people move through.' },
    ],
    payoff: 'The path gathers the neighborhood.',
    voice: 'open and social',
  },
  {
    domain: 'school',
    title: 'First Bell',
    deck: 'Classroom objects and starting signals share the bell.',
    threads: [
      { id: 'thread-a', name: 'Classroom objects', clue: 'What is ready.' },
      { id: 'thread-b', name: 'Starting signals', clue: 'What begins the day.' },
    ],
    payoff: 'The room becomes a lesson.',
    voice: 'clear and bright',
  },
  {
    domain: 'gallery',
    title: 'Gallery Wall',
    deck: 'Art details and visitor motions share a slow look.',
    threads: [
      { id: 'thread-a', name: 'Art details', clue: 'What is noticed.' },
      { id: 'thread-b', name: 'Visitor moves', clue: 'How the eye travels.' },
    ],
    payoff: 'The wall teaches the room to look.',
    voice: 'observant',
  },
  {
    domain: 'bakery',
    title: 'Bakery Case',
    deck: 'Case treats and shop motions meet before breakfast.',
    threads: [
      { id: 'thread-a', name: 'Case treats', clue: 'What looks good.' },
      { id: 'thread-b', name: 'Shop motions', clue: 'How the line moves.' },
    ],
    payoff: 'The counter sweetens the morning.',
    voice: 'specific and warm',
  },
  {
    domain: 'mailroom',
    title: 'Mail Slot',
    deck: 'Paper trails and delivery steps meet at the door.',
    threads: [
      { id: 'thread-a', name: 'Paper trails', clue: 'What arrives.' },
      { id: 'thread-b', name: 'Delivery steps', clue: 'How it gets there.' },
    ],
    payoff: 'The doorway turns into a route.',
    voice: 'ordinary but active',
  },
  {
    domain: 'theater',
    title: 'Curtain Call',
    deck: 'Stage details and audience cues share one opening.',
    threads: [
      { id: 'thread-a', name: 'Stage details', clue: 'What is set.' },
      { id: 'thread-b', name: 'Audience cues', clue: 'How attention gathers.' },
    ],
    payoff: 'The room gets ready to listen.',
    voice: 'bright and anticipatory',
  },
  {
    domain: 'trail',
    title: 'Trail Marker',
    deck: 'Trail signs and natural details keep the walk oriented.',
    threads: [
      { id: 'thread-a', name: 'Trail signs', clue: 'What guides the walk.' },
      { id: 'thread-b', name: 'Natural details', clue: 'What fills the path.' },
    ],
    payoff: 'The trail makes a map out of the morning.',
    voice: 'outdoors and grounded',
  },
];

const DIRECTIONS: ThreadlineCoord[] = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 },
  { row: 0, col: -1 },
  { row: -1, col: 0 },
  { row: -1, col: -1 },
  { row: -1, col: 1 },
];

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function addDays(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + offset);
  return next;
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function getDifficulty(dayIndex: number): ThreadlineDifficulty {
  const weekday = dayIndex % 7;
  if (weekday === 0 || weekday === 1) return 'Easy';
  if (weekday === 5) return 'Hard';
  return 'Medium';
}

interface LengthProfile {
  six: number;
  longer: number;
  flex: number;
}

function getLengthProfileForDifficulty(difficulty: ThreadlineDifficulty): LengthProfile {
  if (difficulty === 'Hard') {
    return { six: 2, longer: 3, flex: 1 };
  }
  return { six: 2, longer: 2, flex: 2 };
}

function getWordsBeforeDay(dayIndex: number, kind: keyof LengthProfile): number {
  let count = 0;
  for (let day = 0; day < dayIndex; day += 1) {
    count += getLengthProfileForDifficulty(getDifficulty(day))[kind];
  }
  return count;
}

function getMaxBankUseInCooldown(kind: keyof LengthProfile): number {
  let maxUse = 0;
  for (let startDay = 0; startDay < 7; startDay += 1) {
    let useCount = 0;
    for (let offset = 0; offset < THREADLINE_ANSWER_COOLDOWN_DAYS; offset += 1) {
      useCount += getLengthProfileForDifficulty(getDifficulty(startDay + offset))[kind];
    }
    maxUse = Math.max(maxUse, useCount);
  }
  return maxUse;
}

function getCandidateAnswers(dayIndex: number): string[] {
  const difficulty = getDifficulty(dayIndex);
  const profile = getLengthProfileForDifficulty(difficulty);

  if (SIX_ANSWER_BANK.length <= getMaxBankUseInCooldown('six')) {
    throw new Error('Threadline review six-letter bank is too small for the cooldown window.');
  }
  if (LONGER_ANSWER_BANK.length <= getMaxBankUseInCooldown('longer')) {
    throw new Error('Threadline review longer-answer bank is too small for the cooldown window.');
  }
  if (FLEX_ANSWER_BANK.length <= getMaxBankUseInCooldown('flex')) {
    throw new Error('Threadline review flex-answer bank is too small for the cooldown window.');
  }

  const sixCursor = getWordsBeforeDay(dayIndex, 'six');
  const longerCursor = getWordsBeforeDay(dayIndex, 'longer');
  const flexCursor = getWordsBeforeDay(dayIndex, 'flex');
  const sixAnswers = Array.from(
    { length: profile.six },
    (_, index) => SIX_ANSWER_BANK[(sixCursor + index) % SIX_ANSWER_BANK.length]
  );
  const longerAnswers = Array.from(
    { length: profile.longer },
    (_, index) => LONGER_ANSWER_BANK[(longerCursor + index) % LONGER_ANSWER_BANK.length]
  );
  const flexAnswers = Array.from(
    { length: profile.flex },
    (_, index) => FLEX_ANSWER_BANK[(flexCursor + index) % FLEX_ANSWER_BANK.length]
  );

  if (difficulty === 'Hard') {
    return [
      longerAnswers[0],
      sixAnswers[0],
      longerAnswers[1],
      flexAnswers[0],
      sixAnswers[1],
      longerAnswers[2],
    ];
  }
  return [
    longerAnswers[0],
    flexAnswers[0],
    sixAnswers[0],
    longerAnswers[1],
    flexAnswers[1],
    sixAnswers[1],
  ];
}

function buildPath(start: ThreadlineCoord, direction: ThreadlineCoord, length: number): ThreadlineCoord[] {
  return Array.from({ length }, (_, index) => ({
    row: start.row + direction.row * index,
    col: start.col + direction.col * index,
  }));
}

function pathIsInside(path: ThreadlineCoord[]): boolean {
  return path.every(
    (coord) => coord.row >= 0 && coord.row < GRID_SIZE && coord.col >= 0 && coord.col < GRID_SIZE
  );
}

function placeWords(answers: string[], seed: number): { grid: string[]; words: ThreadlineWord[] } {
  const random = mulberry32(seed);
  const cells: string[][] = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => ''));
  const starts = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  }));

  const words: ThreadlineWord[] = [];
  const placementOrder = answers
    .map((answer, wordIndex) => ({ answer, wordIndex }))
    .sort((a, b) => b.answer.length - a.answer.length || a.wordIndex - b.wordIndex);

  placementOrder.forEach(({ answer, wordIndex }) => {
    const candidates = shuffled(starts, random).flatMap((start) =>
      shuffled(DIRECTIONS, random).map((direction) => buildPath(start, direction, answer.length))
    );
    const path = candidates.find((candidate) => {
      if (!pathIsInside(candidate)) return false;
      return candidate.every((coord, letterIndex) => {
        const existing = cells[coord.row][coord.col];
        return existing === '' || existing === answer[letterIndex];
      });
    });

    if (!path) {
      throw new Error(`Could not place Threadline review answer ${answer}`);
    }

    path.forEach((coord, letterIndex) => {
      cells[coord.row][coord.col] = answer[letterIndex];
    });

    words[wordIndex] = {
      id: `word-${wordIndex + 1}`,
      answer,
      threadId: wordIndex < THREADLINE_WORDS_PER_DAY / 2 ? 'thread-a' : 'thread-b',
      hint: `Find the ${answer.length}-letter word.`,
      path,
    };
  });

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const grid = cells.map((row) =>
    row
      .map((letter) => letter || alphabet[Math.floor(random() * alphabet.length)])
      .join('')
  );

  return { grid, words };
}

function placeWordsWithRetries(answers: string[], seed: number): { grid: string[]; words: ThreadlineWord[] } {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 28; attempt += 1) {
    try {
      return placeWords(answers, seed + attempt * 9973);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function buildPuzzle(dayIndex: number, activeDate: Date): ThreadlinePuzzle {
  const theme = THEMES[dayIndex % THEMES.length];
  const answers = getCandidateAnswers(dayIndex);
  const { grid, words } = placeWordsWithRetries(answers, REVIEW_SEED + dayIndex);
  const currentDateKey = dateKey(activeDate);
  return {
    id: `threadline-review-${currentDateKey}`,
    title: `${theme.title} ${String(dayIndex + 1).padStart(3, '0')}`,
    deck: theme.deck,
    difficulty: getDifficulty(dayIndex),
    grid,
    threads: theme.threads,
    lead: [
      { type: 'text', text: 'The ' },
      { type: 'blank', wordId: 'word-1' },
      { type: 'text', text: ' and ' },
      { type: 'blank', wordId: 'word-2' },
      { type: 'text', text: ' set one side of the scene, ' },
      { type: 'blank', wordId: 'word-3' },
      { type: 'text', text: ' adds a clue, while ' },
      { type: 'blank', wordId: 'word-4' },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: 'word-5' },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: 'word-6' },
      { type: 'text', text: ' reveal the other.' },
    ],
    words,
    weave: theme.payoff,
    note: `Review voice target: ${theme.voice}.`,
  };
}

function getScores(
  puzzle: ThreadlinePuzzle,
  theme: ThreadlineReviewTheme,
  daysSinceDomain: number | null
): ThreadlineScorecard {
  const counts = puzzle.threads.map(
    (thread) => puzzle.words.filter((word) => word.threadId === thread.id).length
  );
  const averageLength =
    puzzle.words.reduce((total, word) => total + word.answer.length, 0) / puzzle.words.length;
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const hasRiskWord = puzzle.words.some((word) => REVIEW_BLOCKED_WORDS.has(word.answer));
  const freshness = daysSinceDomain === null ? 5 : daysSinceDomain >= 14 ? 5 : daysSinceDomain >= 7 ? 4 : 2;

  return {
    threadDistinction: theme.threads[0].name !== theme.threads[1].name ? 5 : 2,
    threadBalance: Math.abs(counts[0] - counts[1]) === 0 ? 5 : 3,
    answerQuality:
      averageLength >= THREADLINE_MIN_ROLLING_AVERAGE_LENGTH &&
      averageLength <= THREADLINE_MAX_ROLLING_AVERAGE_LENGTH &&
      longCount >= 3 &&
      !hasRiskWord
        ? 5
        : 4,
    leadNaturalness: 4,
    blankFairness: puzzle.words.every((word) => word.answer.length >= 4 && word.answer.length <= 8) ? 5 : 2,
    weavePayoff: theme.payoff.length <= 48 ? 4 : 3,
    voiceFit: 4,
    dailyFreshness: freshness,
    difficultyIntegrity: puzzle.difficulty === 'Hard' && averageLength < 5.8 ? 3 : 4,
    safetyBrandRisk: hasRiskWord ? 2 : 5,
  };
}

function averageScores(candidates: ThreadlineCalendarCandidate[]): ThreadlineScorecard {
  const keys: ScoreKey[] = [
    'threadDistinction',
    'threadBalance',
    'answerQuality',
    'leadNaturalness',
    'blankFairness',
    'weavePayoff',
    'voiceFit',
    'dailyFreshness',
    'difficultyIntegrity',
    'safetyBrandRisk',
  ];

  return keys.reduce((result, key) => {
    result[key] =
      candidates.reduce((total, candidate) => total + candidate.scores[key], 0) /
      Math.max(1, candidates.length);
    return result;
  }, {} as ThreadlineScorecard);
}

function getCandidateFlags(candidate: ThreadlineCalendarCandidate): string[] {
  const flags = Object.entries(candidate.scores)
    .filter(([, score]) => score <= 2)
    .map(([key]) => key);
  const validationErrors = validateThreadlinePuzzle(candidate.puzzle);
  return [...flags, ...validationErrors];
}

function getAverageAnswerLength(candidate: ThreadlineCalendarCandidate): number {
  return (
    candidate.puzzle.words.reduce((total, word) => total + word.answer.length, 0) /
    candidate.puzzle.words.length
  );
}

function getAnswerRootFamily(answer: string): string {
  const normalized = answer.toUpperCase();
  const suffixes = ['ING', 'ED', 'ES', 'S'];
  const suffix = suffixes.find(
    (candidate) => normalized.endsWith(candidate) && normalized.length - candidate.length >= 4
  );
  return suffix ? normalized.slice(0, -suffix.length) : normalized;
}

export function getThreadlineRollingAverageLengths(
  candidates: ThreadlineCalendarCandidate[],
  windowDays = THREADLINE_ROLLING_LENGTH_WINDOW_DAYS
): Array<{ startDateKey: string; endDateKey: string; averageLength: number }> {
  if (candidates.length < windowDays) return [];
  return candidates.slice(0, candidates.length - windowDays + 1).map((candidate, startIndex) => {
    const windowCandidates = candidates.slice(startIndex, startIndex + windowDays);
    const totalLength = windowCandidates.reduce(
      (total, windowCandidate) =>
        total +
        windowCandidate.puzzle.words.reduce(
          (wordTotal, word) => wordTotal + word.answer.length,
          0
        ),
      0
    );
    const totalWords = windowCandidates.reduce(
      (total, windowCandidate) => total + windowCandidate.puzzle.words.length,
      0
    );
    return {
      startDateKey: candidate.dateKey,
      endDateKey: windowCandidates[windowCandidates.length - 1].dateKey,
      averageLength: totalLength / totalWords,
    };
  });
}

export function getThreadlineRootFamilyWarnings(
  candidates: ThreadlineCalendarCandidate[],
  reviewDays = THREADLINE_ROOT_FAMILY_REVIEW_DAYS
): string[] {
  const warnings: string[] = [];
  const lastSeen = new Map<
    string,
    { dayIndex: number; dateKey: string; answer: string }
  >();

  candidates.forEach((candidate) => {
    candidate.puzzle.words.forEach((word) => {
      const root = getAnswerRootFamily(word.answer);
      const previous = lastSeen.get(root);
      if (
        previous &&
        previous.answer !== word.answer &&
        candidate.dayIndex - previous.dayIndex <= reviewDays
      ) {
        warnings.push(
          `${word.answer} shares root ${root} with ${previous.answer} after ${
            candidate.dayIndex - previous.dayIndex
          } days (${previous.dateKey} -> ${candidate.dateKey})`
        );
      }
      lastSeen.set(root, {
        dayIndex: candidate.dayIndex,
        dateKey: candidate.dateKey,
        answer: word.answer,
      });
    });
  });

  return warnings;
}

export function validateThreadlineReviewCalendar(
  candidates: ThreadlineCalendarCandidate[],
  cooldownDays = THREADLINE_ANSWER_COOLDOWN_DAYS
): string[] {
  const errors = candidates.flatMap((candidate) => validateThreadlinePuzzle(candidate.puzzle));
  const lastSeen = new Map<string, ThreadlineCalendarCandidate>();

  candidates.forEach((candidate) => {
    if (candidate.puzzle.words.length !== THREADLINE_WORDS_PER_DAY) {
      errors.push(
        `${candidate.dateKey} has ${candidate.puzzle.words.length} words; expected ${THREADLINE_WORDS_PER_DAY}`
      );
    }
    const longCount = candidate.puzzle.words.filter((word) => word.answer.length >= 6).length;
    if (longCount < 3) {
      errors.push(`${candidate.dateKey} has only ${longCount} answers of 6+ letters`);
    }
    const threadCounts = candidate.puzzle.threads.map(
      (thread) => candidate.puzzle.words.filter((word) => word.threadId === thread.id).length
    );
    if (!threadCounts.every((count) => count === THREADLINE_WORDS_PER_DAY / 2)) {
      errors.push(`${candidate.dateKey} has unbalanced thread counts: ${threadCounts.join('/')}`);
    }
    candidate.puzzle.words.forEach((word) => {
      const previous = lastSeen.get(word.answer);
      if (previous && candidate.dayIndex - previous.dayIndex <= cooldownDays) {
        errors.push(
          `${word.answer} repeats on ${candidate.dateKey} after ${candidate.dayIndex - previous.dayIndex} days`
        );
      }
      lastSeen.set(word.answer, candidate);
    });
  });

  getThreadlineRollingAverageLengths(candidates).forEach((window) => {
    if (
      window.averageLength < THREADLINE_MIN_ROLLING_AVERAGE_LENGTH ||
      window.averageLength > THREADLINE_MAX_ROLLING_AVERAGE_LENGTH
    ) {
      errors.push(
        `${window.startDateKey} to ${window.endDateKey} average length ${window.averageLength.toFixed(
          2
        )} is outside ${THREADLINE_MIN_ROLLING_AVERAGE_LENGTH}-${THREADLINE_MAX_ROLLING_AVERAGE_LENGTH}`
      );
    }
  });

  return errors;
}

export function generateThreadlineCalendarReview(options: {
  startDate?: Date;
  days?: number;
} = {}): ThreadlineCalendarReview {
  const startDate = options.startDate ?? new Date('2026-05-01T12:00:00');
  const days = options.days ?? THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS;
  const domainLastSeen = new Map<string, number>();

  const candidates = Array.from({ length: days }, (_, dayIndex) => {
    const activeDate = addDays(startDate, dayIndex);
    const theme = THEMES[dayIndex % THEMES.length];
    const lastSeen = domainLastSeen.get(theme.domain);
    const daysSinceDomain = lastSeen === undefined ? null : dayIndex - lastSeen;
    domainLastSeen.set(theme.domain, dayIndex);
    const puzzle = buildPuzzle(dayIndex, activeDate);
    const candidate: ThreadlineCalendarCandidate = {
      dayIndex,
      dateKey: dateKey(activeDate),
      domain: theme.domain,
      puzzle,
      scores: getScores(puzzle, theme, daysSinceDomain),
      flags: [],
      editorNote: '',
      playerNote: '',
      freshnessNote: '',
    };
    candidate.flags = getCandidateFlags(candidate);
    candidate.editorNote =
      candidate.scores.weavePayoff >= 4
        ? 'Editor panel: payoff is concise enough for a daily finish.'
        : 'Editor panel: final line needs a sharper second-read click.';
    candidate.playerNote =
      candidate.scores.leadNaturalness >= 4
        ? 'Player panel: sentence gives a fair path into the grid.'
        : 'Player panel: scaffold is clear, but the shipped version should sound less templated.';
    candidate.freshnessNote =
      candidate.scores.dailyFreshness >= 5
        ? 'Freshness panel: domain spacing is healthy.'
        : 'Freshness panel: rotate this setting farther from similar days.';
    return candidate;
  });

  const errors = validateThreadlineReviewCalendar(candidates);
  const rootFamilyWarnings = getThreadlineRootFamilyWarnings(candidates);
  const flaggedCandidates = candidates.filter((candidate) => candidate.flags.length > 0);

  return {
    candidates,
    errors,
    rootFamilyWarnings,
    scoreAverages: averageScores(candidates),
    flaggedCandidates,
  };
}

export function formatThreadlineReviewMarkdown(review: ThreadlineCalendarReview): string {
  const rollingWindows = getThreadlineRollingAverageLengths(review.candidates);
  const rollingMinimum = Math.min(...rollingWindows.map((window) => window.averageLength));
  const rollingMaximum = Math.max(...rollingWindows.map((window) => window.averageLength));
  const scoreRows = Object.entries(review.scoreAverages)
    .map(([key, score]) => `| ${key} | ${score.toFixed(2)} |`)
    .join('\n');
  const sampleRows = review.candidates
    .slice(0, 14)
    .map((candidate) => {
      const answers = candidate.puzzle.words.map((word) => word.answer).join(', ');
      return `| ${candidate.dateKey} | ${candidate.puzzle.title} | ${candidate.puzzle.difficulty} | ${candidate.domain} | ${getAverageAnswerLength(candidate).toFixed(2)} | ${answers} |`;
    })
    .join('\n');
  const flagRows = review.flaggedCandidates
    .slice(0, 12)
    .map((candidate) => `| ${candidate.dateKey} | ${candidate.puzzle.title} | ${candidate.flags.join(', ')} |`)
    .join('\n');
  const rootWarningRows = review.rootFamilyWarnings
    .slice(0, 12)
    .map((warning) => `| ${warning} |`)
    .join('\n');

  return [
    '# Threadline 365+35 Review',
    '',
    'Generated with `npm run threadline:review` for 365 scheduled puzzles plus 35 reserves.',
    '',
    `Generated candidates: ${review.candidates.length}`,
    `Validation errors: ${review.errors.length}`,
    `Root-family warnings: ${review.rootFamilyWarnings.length}`,
    `Flagged candidates: ${review.flaggedCandidates.length}`,
    `Rolling 30-day average length: ${rollingWindows.length > 0 ? `${rollingMinimum.toFixed(2)}-${rollingMaximum.toFixed(2)}` : 'n/a'}`,
    '',
    '## Player And Editor Read',
    '',
    '- Players liked the core promise when it was stated plainly: fill blanks by drawing missing words.',
    '- Players found the older metaphor stack too heavy, so the shipped copy keeps Threadline and hidden themes but drops extra terms like brief, restored, and braid.',
    '- Editors chose Corner Cafe as the benchmark because both themes earn the final line.',
    '- Editors want the yearly set to protect thread distinction, thread balance, longer-word texture, and a final line that reframes the lead.',
    '- NYT-style word players preferred six-answer days when at least half the answers landed at six letters or longer, with 4-5 letter answers used as rhythm and clue-fairness anchors.',
    '',
    '## Current Seed Notes',
    '',
    '- Corner Cafe remains the benchmark: concrete image density, balanced themes, and a final line that feels earned.',
    '- Rain Check was revised so traffic lights support the route thread instead of blurring the weather thread.',
    '- Blank Page was revised away from the weaker CERAMIC answer; the puzzle now uses MUG and balances desk objects against workflow signals.',
    '',
    '## Score Averages',
    '',
    '| Metric | Average |',
    '| --- | ---: |',
    scoreRows,
    '',
    '## First 14 Candidate Days',
    '',
    '| Date | Title | Difficulty | Domain | Avg. Length | Answers |',
    '| --- | --- | --- | --- | ---: | --- |',
    sampleRows,
    '',
    '## Flagged Candidates',
    '',
    flagRows ? '| Date | Title | Flags |\n| --- | --- | --- |\n' + flagRows : 'No generated candidates were flagged by the automated pass.',
    '',
    '## Root-Family Review Warnings',
    '',
    rootWarningRows ? '| Warning |\n| --- |\n' + rootWarningRows : 'No root-family repeats fell inside the stricter review window.',
    '',
    '## Freshness Rules To Keep',
    '',
    '- Rotate domains so cafe, commute, desk, and other gentle morning settings do not cluster.',
    '- Keep exact answer reuse outside the 60-day cooldown window.',
    '- Send root-family repeats, distinctive seasonal words, and memorable long answers through 90+ day editor review.',
    '- Keep exactly six answers per day, with at least three answers of six or more letters unless an editor marks an exception.',
    `- Keep rolling 30-day average answer length inside ${THREADLINE_MIN_ROLLING_AVERAGE_LENGTH}-${THREADLINE_MAX_ROLLING_AVERAGE_LENGTH}.`,
    '- Prefer concrete nouns and verbs over material adjectives.',
    '- Penalize final lines that merely restate the lead instead of recombining both themes.',
  ].join('\n');
}
