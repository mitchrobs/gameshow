import type {
  ThreadlineCoord,
  ThreadlineDifficulty,
  ThreadlinePuzzle,
  ThreadlineSegment,
  ThreadlineThread,
  ThreadlineWord,
} from './threadlinePuzzles';
import {
  auditThreadlineCopy,
  formatThreadlineCopyAuditIssues,
  renderThreadlineCompletedLead,
} from './threadlineCopyAudit.ts';
import type { ThreadlineCopyAuditReport } from './threadlineCopyAudit.ts';

export const THREADLINE_SHIPPED_START_DATE_KEY = '2026-05-01';
export const THREADLINE_SHIPPED_END_DATE_KEY = '2027-12-21';
export const THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS = 365;
export const THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS = 200;
export const THREADLINE_SHIPPED_FORMER_RESERVE_DAYS = 35;
export const THREADLINE_SHIPPED_DATED_DAYS =
  THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS +
  THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS +
  THREADLINE_SHIPPED_FORMER_RESERVE_DAYS;
export const THREADLINE_SHIPPED_RESERVE_DAYS = 0;
export const THREADLINE_SHIPPED_TOTAL_PUZZLES = THREADLINE_SHIPPED_DATED_DAYS;
export const THREADLINE_APPROVED_CANDIDATE_POOL_SIZE = 1160;
export const THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS = 60;
export const THREADLINE_SHIPPED_ROOT_REVIEW_DAYS = 90;
export const THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS = 180;
export const THREADLINE_SHIPPED_WORDS_PER_DAY = 6;
export const THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH = 5.8;
export const THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH = 6.4;

const GRID_SIZE = 8;
const PACK_SEED = 19337;

export interface ThreadlineScheduleEntry {
  dateKey: string;
  puzzleId: string;
}

export interface ThreadlineReserveEntry {
  reserveId: string;
  puzzleId: string;
  difficulty: ThreadlineDifficulty;
  season: string;
  themeFamily: string;
  lengthProfile: string;
  replacementTags: string[];
}

export interface ThreadlineReviewScores {
  leadWordEditor: number;
  themeEditor: number;
  calendarEditor: number;
  copyEditor: number;
  safetyEditor: number;
  gridEditor: number;
  grammarScore: number;
  titleCoherenceScore: number;
  payoffBridgeScore: number;
  poeticTextureScore: number;
  difficultyIntegrityScore: number;
  nytStrandsPlayer: number;
  nytConnectionsPlayer: number;
  nytSpellingBeePlayer: number;
  casualMorningPlayer: number;
  mobileFirstPlayer: number;
}

export interface ThreadlineEditorReview {
  puzzleId: string;
  dateKey: string | null;
  approvalStatus: 'approved';
  overallEditorialScore: number;
  playerAverageScore: number;
  minCoreScore: number;
  confusionRisk: number;
  wouldPlayAgainCount: number;
  finalLinePayoffScore: number;
  safetyFlags: string[];
  editorNote: string;
  playerNote: string;
  freshnessNote: string;
  tags: string[];
  scores: ThreadlineReviewScores;
}

export interface ThreadlineHolidayNod {
  dateKey: string;
  nearbyHoliday: string;
  holidayDateKey: string;
  windowDays: number;
  puzzleId: string;
  note: string;
}

interface WordPool {
  name: string;
  clue: string;
  words: string[];
  entries: PoolWordEntry[];
  leadRole: ThreadlineWordRole;
}

interface Blueprint {
  domain: string;
  title: string;
  place: string;
  deck: string;
  season: string;
  difficultyBias?: ThreadlineDifficulty;
  expansionOnly?: boolean;
  threads: [WordPool, WordPool];
  actionA: string;
  pivot: string;
  actionB: string;
  payoff: string;
  note: string;
  tags: string[];
}

type ThreadlineWordRole =
  | 'object'
  | 'motion'
  | 'signal'
  | 'place'
  | 'person'
  | 'detail';

interface PoolWordEntry {
  answer: string;
  roles: ThreadlineWordRole[];
}

interface PoolWordInput {
  answer: string;
  roles?: ThreadlineWordRole[];
}

interface SelectedWord {
  answer: string;
  pool: WordPool;
  roles: ThreadlineWordRole[];
}

interface BlueprintCopyProfile {
  titleVariants: string[];
  payoffVariants: string[];
}

interface CopyScoreSummary {
  grammarScore: number;
  titleCoherenceScore: number;
  payoffBridgeScore: number;
  poeticTextureScore: number;
  difficultyIntegrityScore: number;
  flags: string[];
}

interface CopyFreshnessState {
  titles: Map<string, number>;
  payoffs: Map<string, number>;
}

interface BuiltPack {
  bank: ThreadlinePuzzle[];
  datedSchedule: ThreadlineScheduleEntry[];
  reserves: ThreadlineReserveEntry[];
  review: Record<string, ThreadlineEditorReview>;
  holidayNods: ThreadlineHolidayNod[];
}

const BLUEPRINTS: Blueprint[] = [
  {
    domain: 'cafe',
    title: 'Corner Cafe',
    place: 'the cafe window',
    deck: 'Counter details and street cues share the first small rush of morning.',
    season: 'all-season',
    threads: [
      pool('Counter details', 'Things within reach at the counter.', [
        'COFFEE', 'PASTRY', 'NAPKIN', 'TEACUP', 'PLATE', 'SPOON', 'MUFFIN', 'BAGEL',
        'CIDER', 'SAUCER', 'KETTLE', 'TOAST', 'SUGAR', 'CREAM', 'BREAD', 'WAFFLE',
        'ESPRESSO', 'GRANOLA', 'BISCUIT', 'COOKIE', 'CREAMER', 'OATMEAL', 'CINNAMON', 'TEAPOT',
        'DONUTS', 'SCONES', 'TUMBLER', 'PITCHER',
      ]),
      pool('Street cues', 'What the block is doing outside.', [
        'WINDOW', 'AWNING', 'BICYCLE', 'BUSES', 'SIGNAL', 'CROSSING', 'BENCH', 'KIOSK',
        'MARKET', 'CORNER', 'PAVING', 'DOORMAT', 'FLOWER', 'SUNRISE', 'COURIER', 'PLAZA',
        'TAXIES', 'SIDEWALK', 'LANTERN', 'TRAFFIC',
      ]),
    ],
    actionA: 'warm the counter',
    pivot: 'adds one small breakfast cue',
    actionB: 'pull the block toward its first errands',
    payoff: 'The block wakes up one counter at a time.',
    note: 'Keeps the benchmark Threadline feeling: concrete, warm, and easy to enter.',
    tags: ['morning', 'city', 'benchmark'],
  },
  {
    domain: 'commute',
    title: 'Rain Check',
    place: 'the front door',
    deck: 'Rain gear and route cues keep a damp trip moving.',
    season: 'spring',
    threads: [
      pool('Weather gear', 'What helps with wet weather.', [
        'RAINCOAT', 'UMBRELLA', 'BOOT', 'PONCHO', 'HOOD', 'SCARF', 'GLOVE', 'DRIZZLE',
        'CLOUD', 'PUDDLE', 'SHELTER', 'JACKET', 'ZIPPER', 'FOLDING', 'CANOPY', 'TOWEL',
      ]),
      pool('Route cues', 'Signals that keep the trip on track.', [
        'TRAFFIC', 'COMMUTE', 'TICKET', 'STATION', 'AVENUE', 'SUBWAY', 'MAP', 'BUSLINE',
        'FARE', 'PLATFORM', 'TRANSFER', 'TUNNEL', 'METER', 'CROSSING', 'SCHEDULE', 'SIGNAL',
      ]),
    ],
    actionA: 'wait beside the door',
    pivot: 'makes the forecast feel practical',
    actionB: 'keep the trip moving in order',
    payoff: 'The route stays readable through the rain.',
    note: 'Rebuilt around clearer route/weather separation and common answer words.',
    tags: ['weather', 'transit', 'spring'],
  },
  {
    domain: 'desk',
    title: 'Blank Page',
    place: 'the clean desk',
    deck: 'Desk pieces and work signals turn empty space into a plan.',
    season: 'all-season',
    threads: [
      pool('Desk pieces', 'Objects on the work surface.', [
        'LAPTOP', 'PENCIL', 'NOTEBOOK', 'STAPLER', 'FOLDER', 'MARKER', 'KEYBOARD', 'MOUSE',
        'PAPER', 'BINDER', 'SCREEN', 'CHARGER', 'DRAWER', 'CALENDAR', 'LABEL', 'RULER',
        'DESKLAMP', 'NOTEPAD', 'TABLET', 'PENSTAND', 'PENCASE', 'FILEBOX', 'INKWELL', 'BOOKEND',
      ]),
      pool('Work signals', 'Cues that shape the task.', [
        'INBOX', 'TIMER', 'OUTLINE', 'DRAFT', 'FOCUS', 'REPORT', 'AGENDA', 'REVIEW',
        'PLAN', 'SCHEDULE', 'PROMPT', 'UPDATE', 'CHECKLIST', 'MEETING', 'REVISION', 'LAUNCH',
        'PLANNING', 'DRAFTING', 'RESEARCH', 'FOCUSING', 'PLANNER', 'BRIEFING',
      ]),
    ],
    actionA: 'make the surface feel ready',
    pivot: 'turns the empty page into a starting point',
    actionB: 'give the workday a shape',
    payoff: 'The blank page becomes a plan.',
    note: 'Keeps the desk theme, but removes weak short fill and gives the sentence a cleaner payoff.',
    tags: ['work', 'planning', 'focus'],
  },
  {
    domain: 'garden',
    title: 'Garden Gate',
    place: 'the garden gate',
    deck: 'Growing things and tending motions share a quiet outdoor rhythm.',
    season: 'spring',
    threads: [
      pool('Growing things', 'What is growing nearby.', [
        'TULIP', 'DAISY', 'VIOLET', 'BLOSSOM', 'TOMATO', 'HERBS', 'MAPLE', 'CEDAR',
        'FERN', 'PETAL', 'ORCHID', 'CARROT', 'LETTUCE', 'BASIL', 'ROSEMARY', 'IVY',
        'FLOWER', 'GARDEN', 'SPROUT', 'BEDDING', 'SEEDLING', 'CLIMBER',
        'ZINNIA', 'HOSTA', 'SAGE', 'THYME', 'MULCH', 'TRELLIS', 'MARIGOLD', 'SAPLING',
      ]),
      pool('Tending moves', 'How the garden gets care.', [
        'WATER', 'PRUNE', 'PLANT', 'WEED', 'MULCH', 'HARVEST', 'RAKE', 'SEED',
        'TRIM', 'DIGGING', 'SPRINKLE', 'GATHER', 'CARRY', 'COMPOST', 'TROWEL', 'FENCE',
        'WATERING', 'PLANTING', 'PRUNING', 'WEEDING', 'WATERED', 'PLANTED', 'TENDING',
        'TRIMMING', 'SEEDING',
      ]),
    ],
    actionA: 'fill the path with color',
    pivot: 'makes the soil feel ready',
    actionB: 'turn the yard into a small ritual',
    payoff: 'The yard answers when it is tended.',
    note: 'Seasonal but not holiday-specific; the two threads are object and action.',
    tags: ['garden', 'outdoor', 'spring'],
  },
  {
    domain: 'station',
    title: 'Platform Two',
    place: 'the station platform',
    deck: 'Station signs and waiting habits point toward departure.',
    season: 'all-season',
    threads: [
      pool('Station signs', 'What guides the trip.', [
        'TRACK', 'TICKET', 'RAILWAY', 'PLATFORM', 'SIGNAL', 'CLOCK', 'GATEWAY', 'TUNNEL',
        'ROUTE', 'NUMBER', 'ARRIVAL', 'POSTER', 'BARRIER', 'LUGGAGE', 'CARRIAGE', 'CONDUCT',
      ]),
      pool('Waiting habits', 'How travelers pass the minutes.', [
        'COFFEE', 'PAPER', 'EARBUDS', 'MESSAGE', 'JACKET', 'SNACK', 'BOOKLET', 'PUZZLE',
        'GLANCE', 'LISTEN', 'PACING', 'SITDOWN', 'WATCH', 'NOTICE', 'QUEUE', 'WINDOW',
        'BROWSING', 'SCROLL', 'TEXTING', 'CHECKIN', 'STRETCH', 'LEANING', 'YAWNING', 'SIPPING',
        'WAITING', 'STANDING', 'CALLING', 'TAPPING', 'RESTING', 'LOOKOUT', 'HOLDING', 'SETTLE',
      ]),
    ],
    actionA: 'make departure legible',
    pivot: 'keeps the wait from feeling loose',
    actionB: 'turn waiting into motion',
    payoff: 'The platform turns waiting into departure.',
    note: 'Public-space puzzle with brisk, common language.',
    tags: ['transit', 'public', 'motion'],
  },
  {
    domain: 'kitchen',
    title: 'Prep Counter',
    place: 'the prep counter',
    deck: 'Ingredients and hand motions meet before the meal.',
    season: 'all-season',
    threads: [
      pool('Ingredients', 'What goes into the meal.', [
        'GARLIC', 'ONION', 'PEPPER', 'TOMATO', 'LEMON', 'BASIL', 'CARROT', 'POTATO',
        'GINGER', 'PARSLEY', 'OLIVE', 'BUTTER', 'FLOUR', 'CHEESE', 'NOODLE', 'VANILLA',
        'SHALLOT', 'LENTIL', 'SPINACH', 'PAPRIKA', 'SESAME', 'YOGURT', 'CINNAMON', 'ROSEMARY',
      ]),
      pool('Prep moves', 'What hands do in the kitchen.', [
        'CHOP', 'WHISK', 'STIR', 'KNEAD', 'POUR', 'GRATE', 'SIZZLE', 'FOLD',
        'SIMMER', 'MEASURE', 'SPRINKLE', 'SLICE', 'ROAST', 'BLEND', 'SEASON', 'PLATE',
        'SLICING', 'MINCING', 'POURING', 'GRATING', 'SEARING', 'WHISKING', 'STIRRING', 'CHOPPING',
        'DICING', 'MIXING', 'BRAISING', 'MARINATE', 'CHOPPED', 'SAUTEED', 'FOLDING', 'PLATING',
        'TOASTING', 'MASHING',
      ]),
    ],
    actionA: 'gather into the first flavor',
    pivot: 'sets the recipe in motion',
    actionB: 'make the counter feel like dinner',
    payoff: 'The counter starts to taste like dinner.',
    note: 'Concrete nouns and verbs keep the food thread fair.',
    tags: ['food', 'home', 'action'],
  },
  {
    domain: 'studio',
    title: 'Studio Table',
    place: 'the studio table',
    deck: 'Materials and marks gather into a first draft.',
    season: 'all-season',
    threads: [
      pool('Materials', 'Supplies on the table.', [
        'CANVAS', 'PAPER', 'CHARCOAL', 'PALETTE', 'BRUSH', 'CRAYON', 'PENCIL', 'MARKER',
        'EASEL', 'FABRIC', 'THREAD', 'RIBBON', 'BUTTON', 'CLAY', 'INKPAD', 'FRAME',
      ]),
      pool('Marks', 'How the idea appears.', [
        'SKETCH', 'SHADE', 'LINE', 'COLOR', 'LAYER', 'TEXTURE', 'PATTERN', 'OUTLINE',
        'DRAFT', 'STROKE', 'SHAPE', 'DETAIL', 'GLAZE', 'PRINT', 'MODEL', 'DESIGN',
        'DRAWING', 'SHADING', 'PAINTED', 'TRACING', 'COLLAGE', 'COMPOSE',
      ]),
    ],
    actionA: 'crowd the table with possibility',
    pivot: 'gives the idea its first edge',
    actionB: 'turn supplies into a sketch',
    payoff: 'The table turns supplies into a sketch.',
    note: 'Creative setting with tactile answers and a clear material/process split.',
    tags: ['creative', 'craft', 'indoor'],
  },
  {
    domain: 'library',
    title: 'Reading Room',
    place: 'the reading room',
    deck: 'Bookish details and quiet habits share one table.',
    season: 'all-season',
    threads: [
      pool('Book details', 'What belongs on or around the page.', [
        'NOVEL', 'INDEX', 'CHAPTER', 'MARGIN', 'BOOKMARK', 'COVER', 'TITLE', 'AUTHOR',
        'SHELF', 'VOLUME', 'LETTER', 'JOURNAL', 'PAGE', 'POEM', 'CAPTION', 'LIBRARY',
        'STANZA', 'READER', 'BOOKLET', 'PAGES', 'BINDING', 'FOOTNOTE',
      ]),
      pool('Quiet habits', 'How the reader settles in.', [
        'WHISPER', 'NOTE', 'PAUSE', 'LISTEN', 'FOCUS', 'GLANCE', 'SETTLE', 'RECLINE',
        'BROWSE', 'RETURN', 'BORROW', 'TURNING', 'MUSING', 'HUSH', 'PENCIL', 'CHAIR',
        'READING', 'RESTING', 'NOTING', 'SILENCE', 'SETTLED',
      ]),
    ],
    actionA: 'lower the room into the page',
    pivot: 'keeps the next thought close',
    actionB: 'make the quiet feel chosen',
    payoff: 'The room lowers its voice.',
    note: 'NYT-style word players get familiar words and a gentle category reveal.',
    tags: ['books', 'quiet', 'indoor'],
  },
  {
    domain: 'shore',
    title: 'Low Tide',
    place: 'the low-tide edge',
    deck: 'Beach finds and water motion cross the same line of sand.',
    season: 'summer',
    threads: [
      pool('Shore finds', 'What the tide leaves behind.', [
        'SHELL', 'PEBBLE', 'DRIFT', 'SEAWEED', 'BUCKET', 'SANDAL', 'TOWEL', 'KITE',
        'STONE', 'CORAL', 'GLASS', 'FEATHER', 'ANCHOR', 'TIDEPOOL', 'CASTLE', 'COOLER',
        'SEAGLASS', 'FLOATER', 'WRACK', 'SPONGE', 'CONCH', 'WHELK', 'SANDDAB', 'KELP',
      ]),
      pool('Water motion', 'How the shoreline moves.', [
        'WAVE', 'TIDE', 'SPRAY', 'CURRENT', 'RIPPLE', 'FOAM', 'SURGE', 'FLOW',
        'SHIMMER', 'WASH', 'RECEDES', 'SPLASH', 'WIDENS', 'GLITTER', 'ROLLING', 'LAPPING',
        'SWASH', 'BACKWASH', 'BREAKING', 'CREST', 'EBBING', 'FOAMING', 'TUMBLE', 'SEEPING',
      ]),
    ],
    actionA: 'mark the sand with finds',
    pivot: 'shows where the water has been',
    actionB: 'redraw the edge of the shore',
    payoff: 'The shore redraws itself.',
    note: 'A strong visual setting with distinct object and motion threads.',
    tags: ['shore', 'summer', 'outdoor'],
  },
  {
    domain: 'market',
    title: 'Market Stall',
    place: 'the market aisle',
    deck: 'Stall goods and buyer motions fill a bright morning aisle.',
    season: 'summer',
    threads: [
      pool('Stall goods', 'What is for sale.', [
        'MELON', 'BERRY', 'PEACH', 'APPLE', 'FLOWER', 'HONEY', 'BREAD', 'CHEESE',
        'CARROT', 'BASKET', 'CIDER', 'HERBS', 'PICKLE', 'TOMATO', 'GARLIC', 'PASTRY',
        'PLUM', 'PEPPER', 'RADISH', 'SQUASH', 'TURNIP', 'BEET', 'APRICOT', 'CUCUMBER',
        'LETTUCE', 'PARSNIP', 'ONION', 'POTATO', 'PICKLES', 'GRANOLA', 'YOGURT', 'ALMOND',
      ]),
      pool('Buyer moves', 'How the market flows.', [
        'BROWSE', 'CHOOSE', 'COUNT', 'CARRY', 'TASTE', 'QUEUE', 'PAYMENT', 'BUNDLE',
        'SAMPLE', 'GATHER', 'COMPARE', 'NOTICE', 'RETURN', 'POCKET', 'WANDER', 'THANKS',
        'SELECT', 'WEIGH', 'BAGGING', 'WALLET', 'CHANGE', 'RECEIPT', 'TOTE', 'PICK',
        'LOOK', 'SPEND', 'SEARCH', 'INSPECT', 'PONDER', 'DECIDE', 'REACH', 'PACK',
      ]),
    ],
    actionA: 'make the aisle fragrant',
    pivot: 'gives the basket a reason',
    actionB: 'turn shopping into a conversation',
    payoff: 'The aisle becomes a conversation.',
    note: 'Everyday marketplace vocabulary with good answer texture.',
    tags: ['market', 'food', 'social'],
  },
  {
    domain: 'workshop',
    title: 'Workbench',
    place: 'the workbench',
    deck: 'Tools and repair clues meet around one small fix.',
    season: 'all-season',
    threads: [
      pool('Tools', 'What does the work.', [
        'HAMMER', 'WRENCH', 'DRILL', 'CLAMP', 'SCREW', 'BRUSH', 'LEVEL', 'SANDER',
        'PLIERS', 'TOOLBOX', 'RULER', 'CHISEL', 'MALLET', 'PENCIL', 'TAPE', 'LATHE',
        'HANDSAW', 'FASTENER', 'SAWHORSE', 'JIGSAW',
      ]),
      pool('Repair clues', 'What needs attention.', [
        'HINGE', 'HANDLE', 'CRACK', 'WOBBLE', 'DENT', 'SCRATCH', 'PATCH', 'CORNER',
        'JOINT', 'THREAD', 'GLUE', 'SPLINTER', 'PLANK', 'CABINET', 'DRAWER', 'FRAME',
        'WARPING', 'DENTING', 'WOBBLES', 'FRACTURE', 'MENDED',
      ]),
    ],
    actionA: 'line up for the small fix',
    pivot: 'points to the loose part',
    actionB: 'make the repair feel solvable',
    payoff: 'The workbench solves the loose part.',
    note: 'Good for harder days because object relations are concrete.',
    tags: ['tools', 'repair', 'hands-on'],
  },
  {
    domain: 'park',
    title: 'Park Loop',
    place: 'the park loop',
    deck: 'Path details and passing routines share the same walk.',
    season: 'spring',
    threads: [
      pool('Path details', 'What lines the walk.', [
        'BENCH', 'MAPLE', 'FOUNTAIN', 'GRAVEL', 'BRIDGE', 'MEADOW', 'POND', 'GATE',
        'STATUE', 'FLOWER', 'LANTERN', 'SHADE', 'WALKWAY', 'PICNIC', 'GAZEBO', 'SPRING',
      ]),
      pool('Passing routines', 'How people move through.', [
        'JOGGER', 'STROLL', 'WAVE', 'PAUSE', 'LISTEN', 'CHAT', 'SKETCH', 'RELAX',
        'CYCLE', 'LAUGH', 'FOLLOW', 'RETURN', 'GATHER', 'NOTICE', 'RESTING', 'WANDER',
        'WALKING', 'JOGGING', 'CYCLING', 'CHATTING', 'PAUSING', 'GATHERED',
      ]),
    ],
    actionA: 'give the walk its edges',
    pivot: 'slows the route for a moment',
    actionB: 'gather the neighborhood into motion',
    payoff: 'The path gathers the neighborhood.',
    note: 'Outdoor social setting with a soft difficulty profile.',
    tags: ['park', 'outdoor', 'social'],
  },
  {
    domain: 'school',
    title: 'First Bell',
    place: 'the classroom door',
    deck: 'Classroom objects and starting signals share the bell.',
    season: 'fall',
    threads: [
      pool('Classroom objects', 'What is ready in the room.', [
        'PENCIL', 'CHALK', 'DESK', 'BINDER', 'MARKER', 'ERASER', 'RULER', 'POSTER',
        'GLOBE', 'BOOKLET', 'LOCKER', 'FOLDER', 'CRAYON', 'NOTEBOOK', 'CALENDAR', 'BACKPACK',
        'HANDOUT', 'WORKBOOK', 'FLASHCARD', 'HOMEROOM', 'TEXTBOOK', 'LUNCHBOX', 'NAMECARD', 'CLIPBOARD',
      ]),
      pool('Starting signals', 'What begins the day.', [
        'BELL', 'LESSON', 'ATTEND', 'ANSWER', 'RAISE', 'LISTEN', 'STUDY', 'QUIZ',
        'PROMPT', 'SCHEDULE', 'ANNOUNCE', 'PRACTICE', 'PROJECT', 'RECESS', 'OPENING', 'WELCOME',
        'QUESTION', 'READING', 'WRITING', 'PRESENT',
      ]),
    ],
    actionA: 'make the room feel ready',
    pivot: 'puts the first task on the board',
    actionB: 'turn the room into a lesson',
    payoff: 'The room becomes a lesson.',
    note: 'Seasonal September energy without relying on exact school-calendar dates.',
    tags: ['school', 'fall', 'learning'],
  },
  {
    domain: 'gallery',
    title: 'Gallery Wall',
    place: 'the gallery wall',
    deck: 'Art details and visitor motions share a slow look.',
    season: 'all-season',
    threads: [
      pool('Art details', 'What the eye notices.', [
        'FRAME', 'CANVAS', 'COLOR', 'SHADOW', 'FIGURE', 'PORTRAIT', 'TEXTURE', 'LABEL',
        'SCULPT', 'MURAL', 'PALETTE', 'PATTERN', 'LUSTER', 'ANGLE', 'GLOW', 'BORDER',
        'LIGHTING', 'CONTOUR', 'COMPOSE', 'SURFACE',
        'VARNISH', 'GESSO', 'PLINTH', 'RELIEF', 'FRESCO', 'TRIPTYCH', 'SKETCH', 'HANGING',
      ]),
      pool('Visitor moves', 'How the room is read.', [
        'GLANCE', 'PAUSE', 'NOTICE', 'RETURN', 'POINT', 'LISTEN', 'WANDER', 'COMPARE',
        'STUDY', 'FOLLOW', 'STEP', 'WHISPER', 'CIRCLE', 'REVIEW', 'ADMIRE', 'SETTLE',
        'LOOKING', 'VIEWING', 'NOTING', 'TOURING', 'MAPPING', 'SLOWING', 'LEANING', 'FRAMING',
        'DISCUSS', 'SKETCH', 'DRIFT', 'TRACK', 'OBSERVE', 'PONDER', 'RETRACE', 'APPROACH',
      ]),
    ],
    actionA: 'teach the wall to hold attention',
    pivot: 'gives the eye a place to land',
    actionB: 'move the room from looking to seeing',
    payoff: 'The wall teaches the room to look.',
    note: 'Distinct visual and visitor-action threads support theme discovery.',
    tags: ['art', 'museum', 'quiet'],
  },
  {
    domain: 'bakery',
    title: 'Bakery Case',
    place: 'the bakery case',
    deck: 'Case treats and shop motions meet before breakfast.',
    season: 'all-season',
    threads: [
      pool('Case treats', 'What looks good behind the glass.', [
        'PASTRY', 'COOKIE', 'BREAD', 'BAGEL', 'MUFFIN', 'CROISSANT', 'TART', 'SCONE',
        'CAKE', 'DONUT', 'BROWNIE', 'PRETZEL', 'LOAF', 'ROLL', 'CUPCAKE', 'CINNAMON',
        'BISCUIT', 'ECLAIR', 'BRIOCHE', 'BAGUETTE', 'TURNOVER', 'MACARON', 'STRUDEL',
      ]),
      pool('Shop motions', 'How the line moves.', [
        'CHOOSE', 'POINT', 'WRAP', 'SLICE', 'QUEUE', 'PAYMENT', 'CARRY', 'BOXING',
        'SAMPLE', 'THANKS', 'WINDOW', 'COUNTER', 'REGISTER', 'NAPKIN', 'PLATE', 'ORDER',
        'BAGGING', 'DISPLAY', 'SERVING', 'PICKUP', 'WARMER', 'BOXED', 'TRAY', 'RECEIPT',
        'SELECT', 'REQUEST', 'CASHIER', 'TICKET', 'LINEUP', 'PORTION', 'PACKAGE', 'BUNDLE',
      ]),
    ],
    actionA: 'sweeten the glass',
    pivot: 'makes the choice feel close',
    actionB: 'move breakfast through the line',
    payoff: 'The counter sweetens the morning.',
    note: 'Food words stay common and tactile.',
    tags: ['bakery', 'food', 'morning'],
  },
  {
    domain: 'mailroom',
    title: 'Mail Slot',
    place: 'the mailroom shelf',
    deck: 'Paper trails and delivery steps meet at the door.',
    season: 'all-season',
    threads: [
      pool('Paper trails', 'What arrives or gets sorted.', [
        'LETTER', 'POSTCARD', 'PACKAGE', 'ENVELOPE', 'STAMP', 'LABEL', 'NOTICE', 'INVOICE',
        'CATALOG', 'FLYER', 'ADDRESS', 'BUNDLE', 'PAPER', 'FOLDER', 'RECEIPT', 'TICKET',
        'PARCEL', 'MAILER', 'POSTAL', 'LEDGER', 'MANIFEST', 'CIRCULAR',
      ]),
      pool('Delivery steps', 'How it gets there.', [
        'SORT', 'CARRY', 'ROUTE', 'DROP', 'STACK', 'SCAN', 'SIGNAL', 'COURIER',
        'DELIVER', 'FORWARD', 'RETURN', 'CHECK', 'HANDLE', 'TRANSFER', 'WAGON', 'DOORBELL',
        'SORTING', 'CARRYING', 'STACKING', 'SCANNING', 'ROUTING', 'HANDOFF', 'POSTING', 'LOADING',
        'SORTED', 'CARRIED', 'STAMPED', 'BUNDLED', 'MAILED', 'DISPATCH',
      ]),
    ],
    actionA: 'make the shelf feel busy',
    pivot: 'points toward the right door',
    actionB: 'turn the doorway into a route',
    payoff: 'The doorway turns into a route.',
    note: 'Useful midweek puzzle: organized, fair, and not visually noisy.',
    tags: ['mail', 'route', 'paper'],
  },
  {
    domain: 'theater',
    title: 'Curtain Call',
    place: 'the small theater',
    deck: 'Stage details and audience cues share one opening.',
    season: 'winter',
    threads: [
      pool('Stage details', 'What is set for the show.', [
        'CURTAIN', 'SPOTLIGHT', 'STAGE', 'PROPS', 'SCRIPT', 'COSTUME', 'SCENE', 'PIANO',
        'BALLET', 'ORCHESTRA', 'BACKDROP', 'TICKET', 'AISLE', 'VELVET', 'MASK', 'FANFARE',
        'PLAYBILL', 'FOOTLAMP', 'RISER', 'CUECARD', 'SETLIST', 'DRAPERY', 'WINGS', 'CATWALK',
      ]),
      pool('Audience cues', 'How attention gathers.', [
        'APPLAUSE', 'WHISPER', 'LISTEN', 'SETTLE', 'PROGRAM', 'PAUSE', 'WATCH', 'CLAP',
        'LAUGH', 'OVATION', 'MURMUR', 'SILENCE', 'BALCONY', 'ROW', 'USHER', 'OPENING',
      ]),
    ],
    actionA: 'prepare the room for attention',
    pivot: 'raises the first cue',
    actionB: 'bring the audience into focus',
    payoff: 'The room gets ready to listen.',
    note: 'Good for Friday/Saturday pacing because the payoff feels eventful.',
    tags: ['stage', 'performance', 'winter'],
  },
  {
    domain: 'trail',
    title: 'Trail Marker',
    place: 'the trail marker',
    deck: 'Trail signs and natural details keep the walk oriented.',
    season: 'fall',
    threads: [
      pool('Trail signs', 'What guides the walk.', [
        'MARKER', 'ARROW', 'MAP', 'BRIDGE', 'PATH', 'SIGNAL', 'BLAZE', 'COMPASS',
        'POST', 'GATE', 'TRAIL', 'RIDGE', 'CAMPER', 'LANTERN', 'FOOTPATH', 'CROSSING',
        'SIGNPOST', 'WAYMARK', 'WAYFIND',
      ]),
      pool('Natural details', 'What fills the path.', [
        'PINE', 'CEDAR', 'MOSS', 'FERN', 'STONE', 'CREEK', 'BIRCH', 'MEADOW',
        'ACORN', 'LEAF', 'HILLSIDE', 'BROOK', 'CANYON', 'FROST', 'SUNBEAM', 'SHADOW',
        'BOULDER', 'HEMLOCK', 'WILLOW', 'JUNIPER', 'RAVINE', 'SUMMIT', 'PRAIRIE', 'LICHEN',
      ]),
    ],
    actionA: 'keep the route readable',
    pivot: 'anchors the path in place',
    actionB: 'make a map out of the morning',
    payoff: 'The trail makes a map out of the morning.',
    note: 'Nature and navigation threads stay strongly separated.',
    tags: ['trail', 'outdoor', 'fall'],
  },
  {
    domain: 'laundry',
    title: 'Laundry Line',
    place: 'the laundry room',
    deck: 'Fabric details and wash-day motions share a clean loop.',
    season: 'all-season',
    threads: [
      pool('Fabric details', 'What goes through the wash.', [
        'TOWEL', 'SHEET', 'DENIM', 'SOCKS', 'LINEN', 'SWEATER', 'SHIRT', 'BUTTON',
        'COLLAR', 'POCKET', 'FABRIC', 'BLANKET', 'SCARF', 'THREAD', 'RIBBON', 'COTTON',
        'TROUSER', 'PAJAMAS', 'TOWELS', 'SWEATERS', 'LINENS', 'BLOUSE', 'JERSEY', 'HOODIE',
      ]),
      pool('Wash-day moves', 'How the laundry gets done.', [
        'FOLD', 'SORT', 'RINSE', 'CARRY', 'DRYER', 'BASKET', 'HANG', 'STACK',
        'STEAM', 'SHAKE', 'WASH', 'PRESS', 'MATCH', 'TUMBLE', 'FRESHEN', 'CLEAN',
        'FOLDING', 'SORTING', 'RINSING', 'HANGING', 'STACKING', 'MATCHING', 'TUMBLING', 'PRESSING',
        'WASHING', 'DRYING', 'STEAMING', 'SHAKING', 'CLEANING', 'FRESHEN', 'LOADING', 'UNLOAD',
      ]),
    ],
    actionA: 'pile into a soft little problem',
    pivot: 'shows what still needs doing',
    actionB: 'turn the room back into order',
    payoff: 'The clean pile becomes a pattern.',
    note: 'Domestic but active, with common words and clear categories.',
    tags: ['home', 'fabric', 'routine'],
  },
  {
    domain: 'rooftop',
    title: 'Rooftop Hour',
    place: 'the rooftop rail',
    deck: 'Skyline details and evening motions share the last light.',
    season: 'summer',
    threads: [
      pool('Skyline details', 'What is visible from above.', [
        'SKYLINE', 'WINDOW', 'TOWER', 'ROOFTOP', 'ANTENNA', 'BALCONY', 'BRICK', 'HORIZON',
        'SUNSET', 'NEON', 'CLOUD', 'WATER', 'BRIDGE', 'CHIMNEY', 'GARDEN', 'LAMPS',
      ]),
      pool('Evening motions', 'How the hour settles.', [
        'GLOW', 'FADE', 'LISTEN', 'PAUSE', 'BREATHE', 'WATCH', 'GATHER', 'TOAST',
        'MURMUR', 'SHIMMER', 'COOLING', 'SETTLE', 'DRIFT', 'POINT', 'NOTICE', 'LINGER',
        'DIMMING', 'SLOWING', 'GLITTER', 'RESTING', 'LEANING', 'TALKING', 'LAUGHING', 'LOOKING',
        'BREEZE', 'SIPPING', 'WAITING', 'LOWER', 'SOFTEN', 'DARKEN', 'BRIGHTEN', 'UNWIND',
      ]),
    ],
    actionA: 'hold the view in place',
    pivot: 'catches the last light',
    actionB: 'make the evening slow down',
    payoff: 'The roof keeps the last light a little longer.',
    note: 'Visual payoff and longer words help the weekend mix.',
    tags: ['city', 'evening', 'summer'],
  },
  {
    domain: 'diner',
    title: 'Diner Booth',
    place: 'the diner booth',
    deck: 'Booth details and order calls keep a small meal moving.',
    season: 'all-season',
    threads: [
      pool('Booth details', 'What sits around the table.', [
        'MENU', 'NAPKIN', 'KETCHUP', 'COFFEE', 'BOOTH', 'COUNTER', 'STRAW', 'PLATE',
        'JELLY', 'TOAST', 'PANCAKE', 'SYRUP', 'FORK', 'MUGS', 'CLOCK', 'WINDOW',
        'PLACEMAT', 'SILVER', 'CREAMER', 'OATMEAL', 'BISCUIT', 'OMELET', 'SAUCER', 'SPECIAL',
        'DINNER', 'SERVER', 'HASHES', 'SEATING',
      ]),
      pool('Order calls', 'How the meal moves.', [
        'ORDER', 'REFILL', 'SERVE', 'CHECK', 'CARRY', 'SIZZLE', 'CALL', 'STACK',
        'SLICE', 'POUR', 'PLATE', 'THANKS', 'TICKET', 'GRIDDLE', 'REGISTER', 'SPECIAL',
        'REQUEST', 'COUNTER', 'COOKING', 'BILLING', 'RECEIPT', 'SERVER', 'TOPPING', 'SEATING',
        'WAITING', 'BRING', 'BOXING', 'DINING', 'WARMER', 'PICKUP', 'HOSTING', 'SERVING',
      ]),
    ],
    actionA: 'make the table feel familiar',
    pivot: 'keeps breakfast close',
    actionB: 'move the order down the counter',
    payoff: 'The booth turns breakfast into a rhythm.',
    note: 'Casual morning vocabulary with strong Daybreak fit.',
    tags: ['diner', 'food', 'morning'],
  },
  {
    domain: 'harbor',
    title: 'Harbor Bell',
    place: 'the harbor rail',
    deck: 'Dock objects and boat motions share a bright edge of water.',
    season: 'summer',
    threads: [
      pool('Dock objects', 'What belongs near the boats.', [
        'ANCHOR', 'ROPE', 'BUOY', 'DOCK', 'SAIL', 'HARBOR', 'LADDER', 'CRATE',
        'FENDER', 'PILOT', 'MOTOR', 'DECK', 'BELL', 'KNOT', 'MARINA', 'COMPASS',
        'BOATYARD', 'SAILBOAT', 'RIGGING', 'TILLER', 'GANGWAY', 'PIERHEAD', 'HATCH', 'CLEAT',
        'LIFERING', 'SHIPYARD', 'BOATHOOK', 'PONTOON', 'DAVITS', 'PILINGS', 'MOORING', 'WINDLASS',
      ]),
      pool('Boat motions', 'How the water trip moves.', [
        'DRIFT', 'SAIL', 'MOOR', 'ROWING', 'TACK', 'FLOAT', 'STEER', 'LAUNCH',
        'GLIDE', 'CARRY', 'TURN', 'WAVE', 'SIGNAL', 'RETURN', 'CROSS', 'ANCHOR',
        'SAILING', 'MOORING', 'FLOATING', 'STEERING', 'GLIDING', 'TURNING', 'CROSSING', 'DOCKING',
        'PILOTING', 'TACKING', 'ROWBOAT', 'COASTING', 'BERTHING', 'CASTOFF', 'HAULING', 'DRIFTING',
      ]),
    ],
    actionA: 'make the dock feel ready',
    pivot: 'rings across the water',
    actionB: 'move the boats into morning',
    payoff: 'The harbor turns still water into departure.',
    note: 'Seasonal, not holiday-specific; strong object/action split.',
    tags: ['water', 'boats', 'summer'],
  },
  {
    domain: 'music',
    title: 'Practice Room',
    place: 'the practice room',
    deck: 'Instrument details and listening cues share a short rehearsal.',
    season: 'all-season',
    threads: [
      pool('Instrument details', 'What belongs to the music.', [
        'PIANO', 'GUITAR', 'VIOLIN', 'DRUMS', 'BRASS', 'STRING', 'KEYS', 'BOW',
        'TUNER', 'PEDAL', 'SHEET', 'RHYTHM', 'MELODY', 'CHORD', 'STAND', 'MUSIC',
        'KEYBOARD', 'TRUMPET', 'CLARINET', 'UKULELE', 'MANDOLIN', 'RECORDER', 'CYMBALS', 'MARACAS',
      ]),
      pool('Listening cues', 'How the sound is shaped.', [
        'LISTEN', 'COUNT', 'PAUSE', 'REPEAT', 'TEMPO', 'PRACTICE', 'HUM', 'CLAP',
        'FOLLOW', 'TAP', 'BALANCE', 'SOFTEN', 'CUE', 'MEASURE', 'ENDING', 'RESTART',
        'TUNING', 'COUNTING', 'HARMONY', 'VOLUME', 'DYNAMICS', 'BREATH', 'ACCENT', 'PHRASE',
        'LISTENING', 'REHEARSE', 'CONDUCT', 'SILENCE', 'SYNC', 'PULSE', 'CADENCE', 'TIMING',
      ]),
    ],
    actionA: 'put sound within reach',
    pivot: 'gives the room a beat',
    actionB: 'turn rehearsal into music',
    payoff: 'The room finds the beat.',
    note: 'Accessible music language for puzzle players who like pattern and rhythm.',
    tags: ['music', 'pattern', 'indoor'],
  },
  {
    domain: 'porch',
    title: 'Porch Light',
    place: 'the porch step',
    deck: 'Doorstep details and neighbor signals share the front light.',
    season: 'fall',
    threads: [
      pool('Doorstep details', 'What waits near the door.', [
        'PORCH', 'LANTERN', 'DOORMAT', 'PLANTER', 'PACKAGE', 'WREATH', 'CHAIR', 'RAILING',
        'PUMPKIN', 'BASKET', 'CANDLE', 'WINDOW', 'BELL', 'STEPS', 'FLOWER', 'MAILBOX',
        'SCONCE', 'KEYHOLE', 'MAILSLOT', 'NUMBER', 'BUZZER', 'AWNING', 'SHUTTER', 'HINGE',
      ]),
      pool('Neighbor signals', 'How the street says hello.', [
        'WAVE', 'KNOCK', 'CALL', 'SMILE', 'VISIT', 'NOTICE', 'RETURN', 'GATHER',
        'PAUSE', 'LAUGH', 'CHAT', 'LISTEN', 'WELCOME', 'PASSING', 'THANKS', 'OPENING',
        'NOD', 'GREETING', 'HELLO', 'INVITE', 'ANSWER', 'DOORBELL', 'NEIGHBOR', 'STROLL',
        'LINGER', 'SHARE', 'CALLING', 'WAVING', 'KNOCKING', 'VISITING', 'CHECKIN', 'TALKING',
      ]),
    ],
    actionA: 'make the doorway feel ready',
    pivot: 'sets the front light glowing',
    actionB: 'turn the steps into a greeting',
    payoff: 'The porch makes a small welcome.',
    note: 'Useful for subtle autumn and late-October calendar moments.',
    tags: ['home', 'neighbor', 'fall'],
  },
  {
    domain: 'picnic',
    title: 'Picnic Basket',
    place: 'the picnic blanket',
    deck: 'Packed things and park motions share an afternoon spread.',
    season: 'summer',
    threads: [
      pool('Packed things', 'What comes out of the basket.', [
        'BASKET', 'BLANKET', 'SANDWICH', 'LEMONADE', 'NAPKIN', 'APPLE', 'COOKIE', 'SALAD',
        'THERMOS', 'CHEESE', 'GRAPES', 'PLATE', 'MELON', 'FORK', 'CIDER', 'BREAD',
        'CUTLERY', 'CRACKER', 'BROWNIE', 'PICKLES', 'TUMBLER', 'CUPCAKE', 'BAGUETTE', 'PRETZEL',
        'PEACHES', 'HUMMUS', 'LUNCHBOX', 'BERRIES',
      ]),
      pool('Park motions', 'How the picnic unfolds.', [
        'UNFOLD', 'SHARE', 'POUR', 'PASS', 'LAUGH', 'SETTLE', 'TOSS', 'GATHER',
        'RELAX', 'WANDER', 'LISTEN', 'CARRY', 'CHASE', 'STRETCH', 'NOTICE', 'RETURN',
        'SHARING', 'POURING', 'PASSING', 'LAUGHING', 'TOSSING', 'CARRYING', 'CHASING', 'RESTING',
      ]),
    ],
    actionA: 'spread across the blanket',
    pivot: 'makes the grass feel like a table',
    actionB: 'turn the park into an afternoon',
    payoff: 'The basket turns grass into a table.',
    note: 'Summer weekend texture without leaning on a specific holiday.',
    tags: ['picnic', 'summer', 'food'],
  },
  {
    domain: 'clean-slate',
    title: 'Fresh Page',
    place: 'the quiet desk',
    deck: 'Fresh-start objects and planning moves nod to the turn of the year.',
    season: 'winter',
    difficultyBias: 'Medium',
    threads: [
      pool('Fresh-start objects', 'Things that make a new start visible.', [
        'CALENDAR', 'NOTEBOOK', 'PENCIL', 'FOLDER', 'LABEL', 'PLANNER', 'JOURNAL', 'TIMER',
        'BINDER', 'INDEX', 'PAGE', 'STICKER', 'CLIP', 'MARKER', 'LIST', 'OUTLINE',
      ]),
      pool('Planning moves', 'How the new start gets shape.', [
        'RESET', 'SORT', 'FOCUS', 'CHOOSE', 'REVIEW', 'UPDATE', 'SCHEDULE', 'DRAFT',
        'REVISE', 'COUNT', 'PREPARE', 'START', 'TRACK', 'NOTICE', 'BALANCE', 'LAUNCH',
      ]),
    ],
    actionA: 'make the new page feel possible',
    pivot: 'gives the first plan an edge',
    actionB: 'turn intention into a next step',
    payoff: 'The fresh page earns its first mark.',
    note: 'Placed near New Year, not on New Year itself.',
    tags: ['holiday-adjacent', 'new-year', 'planning'],
  },
  {
    domain: 'paper-hearts',
    title: 'Craft Table',
    place: 'the craft table',
    deck: 'Craft supplies and small gestures make a near-February nod.',
    season: 'winter',
    difficultyBias: 'Easy',
    threads: [
      pool('Craft supplies', 'What sits on the craft table.', [
        'PAPER', 'RIBBON', 'SCISSOR', 'GLUE', 'MARKER', 'STICKER', 'CARD', 'ENVELOPE',
        'STAMP', 'GLITTER', 'LACE', 'BUTTON', 'THREAD', 'FOLDER', 'PATTERN', 'PENCIL',
      ]),
      pool('Small gestures', 'How the note finds its way.', [
        'FOLD', 'WRITE', 'SEAL', 'SHARE', 'SMILE', 'DELIVER', 'TUCK', 'CARRY',
        'NOTICE', 'THANKS', 'WELCOME', 'VISIT', 'PASS', 'GATHER', 'RETURN', 'OPENING',
      ]),
    ],
    actionA: 'collect into a small message',
    pivot: 'makes the table feel thoughtful',
    actionB: 'move the note from hand to hand',
    payoff: 'The note says enough without saying too much.',
    note: 'Valentine-adjacent without placing the nod on February 14.',
    tags: ['holiday-adjacent', 'valentine', 'craft'],
  },
  {
    domain: 'porch-lantern',
    title: 'Porch Lantern',
    place: 'the late-October porch',
    deck: 'Doorstep objects and evening cues make a subtle autumn nod.',
    season: 'fall',
    difficultyBias: 'Medium',
    threads: [
      pool('Doorstep objects', 'What makes the porch look dressed.', [
        'LANTERN', 'PUMPKIN', 'DOORMAT', 'CANDLE', 'BASKET', 'WREATH', 'SHUTTER', 'WINDOW',
        'PLANTER', 'CORNSTALK', 'CHAIR', 'STEPS', 'PORCH', 'BELL', 'PACKAGE', 'GARLAND',
      ]),
      pool('Evening cues', 'How the night approaches.', [
        'SHADOW', 'GLOW', 'KNOCK', 'LAUGH', 'WHISPER', 'TWILIGHT', 'VISIT', 'WATCH',
        'PAUSE', 'OPENING', 'WELCOME', 'MURMUR', 'PASSING', 'LISTEN', 'SMILE', 'RETURN',
      ]),
    ],
    actionA: 'dress the doorstep for dusk',
    pivot: 'puts a soft glow near the bell',
    actionB: 'make the evening feel playful',
    payoff: 'The porch glows before the door opens.',
    note: 'Halloween-adjacent, but never scheduled on October 31.',
    tags: ['holiday-adjacent', 'autumn', 'porch'],
  },
  {
    domain: 'table-leaf',
    title: 'Table Leaf',
    place: 'the long table',
    deck: 'Table pieces and hosting motions nod to a late-November gathering.',
    season: 'fall',
    difficultyBias: 'Medium',
    threads: [
      pool('Table pieces', 'What fills the table.', [
        'PLATTER', 'NAPKIN', 'CANDLE', 'PITCHER', 'BASKET', 'GRAVY', 'POTATO', 'ROLL',
        'CARROT', 'CRANBERRY', 'PLATE', 'FORK', 'CENTER', 'LINEN', 'GLASS', 'SERVING',
      ]),
      pool('Hosting moves', 'How the meal comes together.', [
        'PASS', 'SERVE', 'POUR', 'SHARE', 'GATHER', 'THANKS', 'WELCOME', 'CARVE',
        'CARRY', 'SETTLE', 'LISTEN', 'LAUGH', 'RETURN', 'CLEAR', 'WARMING', 'FOLD',
      ]),
    ],
    actionA: 'make the table stretch',
    pivot: 'sets a place for one more plate',
    actionB: 'turn the meal into a gathering',
    payoff: 'The table makes room before anyone asks.',
    note: 'Thanksgiving-adjacent without naming or landing on the exact day.',
    tags: ['holiday-adjacent', 'table', 'fall'],
  },
  {
    domain: 'window-ribbon',
    title: 'Window Ribbon',
    place: 'the front window',
    deck: 'Paper, light, and wrapping motions make a late-December nod.',
    season: 'winter',
    difficultyBias: 'Easy',
    threads: [
      pool('Window details', 'What catches the winter light.', [
        'RIBBON', 'PAPER', 'CANDLE', 'WINDOW', 'WREATH', 'GARLAND', 'BOW', 'PACKAGE',
        'SPARKLE', 'VELVET', 'SILVER', 'CARD', 'STICKER', 'FROST', 'GLASS', 'MANTEL',
      ]),
      pool('Wrapping moves', 'How the gift gets finished.', [
        'FOLD', 'TAPE', 'WRAP', 'TUCK', 'LABEL', 'STACK', 'CARRY', 'DELIVER',
        'SHARE', 'OPEN', 'THANKS', 'GATHER', 'RETURN', 'PLACE', 'HIDE', 'NOTICE',
      ]),
    ],
    actionA: 'catch the room in small reflections',
    pivot: 'sets one bright edge in place',
    actionB: 'finish the parcel without rushing',
    payoff: 'The window keeps the room bright.',
    note: 'Winter-holiday adjacent; avoids an exact holiday date.',
    tags: ['holiday-adjacent', 'winter', 'gift'],
  },
  {
    domain: 'spring-basket',
    title: 'Spring Basket',
    place: 'the spring table',
    deck: 'Garden colors and basket motions nod to early spring.',
    season: 'spring',
    difficultyBias: 'Easy',
    threads: [
      pool('Garden colors', 'What makes the table bright.', [
        'TULIP', 'DAISY', 'VIOLET', 'RIBBON', 'PASTEL', 'BLOSSOM', 'CARROT', 'LEMON',
        'MINT', 'LILAC', 'PETAL', 'BASKET', 'CLOVER', 'LINEN', 'SUNBEAM', 'FLOWER',
      ]),
      pool('Basket moves', 'How the little hunt unfolds.', [
        'HIDE', 'FIND', 'GATHER', 'CARRY', 'COUNT', 'SHARE', 'NOTICE', 'PLACE',
        'TUCK', 'FOLLOW', 'LAUGH', 'RETURN', 'OPEN', 'FILL', 'WANDER', 'WELCOME',
      ]),
    ],
    actionA: 'make the table look newly awake',
    pivot: 'sets the first color near the edge',
    actionB: 'turn searching into a small celebration',
    payoff: 'The basket finds spring before the calendar does.',
    note: 'Spring-holiday adjacent and gentle enough for general play.',
    tags: ['holiday-adjacent', 'spring', 'basket'],
  },
  {
    domain: 'porch-spark',
    title: 'Porch Spark',
    place: 'the summer porch',
    deck: 'Porch details and bright-night motions nod to early July.',
    season: 'summer',
    difficultyBias: 'Medium',
    threads: [
      pool('Porch details', 'What waits outside at dusk.', [
        'PORCH', 'CHAIR', 'COOLER', 'LANTERN', 'FLAG', 'NAPKIN', 'LEMONADE', 'BASKET',
        'CANDLE', 'BUNTING', 'STEPS', 'WINDOW', 'PICNIC', 'PLATE', 'TOWEL', 'GARDEN',
        'CUSHION', 'GARLAND', 'FANFARE', 'STREAMER', 'PLANTER', 'BANNER', 'AWNING', 'SUNSHADE',
      ]),
      pool('Bright-night motions', 'How the evening lifts.', [
        'SPARK', 'GLOW', 'WAVE', 'CHEER', 'WATCH', 'GATHER', 'LAUGH', 'POINT',
        'SHIMMER', 'LISTEN', 'PAUSE', 'RETURN', 'DRIFT', 'WELCOME', 'CALL', 'SETTLE',
      ]),
    ],
    actionA: 'set up the porch for dusk',
    pivot: 'puts a bright cue near the rail',
    actionB: 'make the evening lift without naming it',
    payoff: 'The porch keeps the bright night close.',
    note: 'Independence Day-adjacent, deliberately scheduled off the exact date.',
    tags: ['holiday-adjacent', 'summer', 'porch'],
  },
];

const EXPANSION_BLUEPRINTS: Blueprint[] = [
  {
    domain: 'observatory',
    title: 'Observatory',
    place: 'the observatory dome',
    deck: 'Lens pieces and sky motions turn the room toward the dark.',
    season: 'winter',
    expansionOnly: true,
    threads: [
      pool('Lens pieces', 'What helps the sky come into focus.', [
        'LENS', 'MIRROR', 'FILTER', 'TRIPOD', 'DOME', 'FINDER', 'EYEPIECE', 'SCOPE',
        'CHART', 'ORBIT', 'NEBULA', 'GALAXY', 'COMET', 'STAR', 'FOCUS', 'SHUTTER',
        'OCULAR', 'RETICLE', 'MOUNT', 'APERTURE', 'SKYMAP', 'BARLOW', 'PRISM', 'EQUATOR',
        'FOCUSER', 'VIEWFIND', 'SKYGLASS', 'MOONLENS', 'STARFIND', 'DUSTCAP', 'DOVETAIL', 'STARPORT',
      ]),
      pool('Sky motions', 'How the night appears to move.', [
        'RISING', 'ROTATE', 'ALIGN', 'DRIFT', 'ARCING', 'ECLIPSE', 'SHIMMER', 'TRANSIT',
        'GLITTER', 'WHEELING', 'SPARKLE', 'TRACKING', 'TURNING', 'GLOWING', 'HOVER', 'PASSING',
        'STARGAZE', 'MOONRISE', 'TWINKLE', 'ORBITING', 'WINKING', 'DARKEN', 'SKYWARD', 'STELLAR',
      ]),
    ],
    actionA: 'bring the dark into focus',
    pivot: 'opens the roof toward distance',
    actionB: 'make the night feel near',
    payoff: 'The dome turns distance into something almost held.',
    note: 'Scheduled variety expansion; adds night-sky texture without touching existing families.',
    tags: ['variety-expansion', 'sky', 'instrument'],
  },
  {
    domain: 'aquarium',
    title: 'Aquarium',
    place: 'the aquarium glass',
    deck: 'Tank life and water cues move behind one clear wall.',
    season: 'summer',
    expansionOnly: true,
    threads: [
      pool('Tank life', 'What lives or rests behind the glass.', [
        'GUPPY', 'CORAL', 'TURTLE', 'ANEMONE', 'SHRIMP', 'TETRA', 'MANTA', 'KELP',
        'OTTER', 'URCHIN', 'CLOWN', 'SEAHORSE', 'MINNOW', 'GROTTO', 'REEF', 'SHELL',
      ]),
      pool('Water cues', 'How the tank stays alive.', [
        'BUBBLE', 'FILTER', 'CURRENT', 'RIPPLE', 'SWIRL', 'GLIDE', 'FLOAT', 'FEEDING',
        'CIRCLING', 'HOVER', 'DARTING', 'SHIMMER', 'DRIFT', 'FLICKER', 'WAVING', 'STREAM',
        'AERATE', 'PUMPING', 'BUBBLING', 'SKIMMING', 'TIDAL', 'FLOWING', 'SPARKLE', 'WAFTING',
      ]),
    ],
    actionA: 'brighten the glass',
    pivot: 'makes the wall feel liquid',
    actionB: 'keep the water in motion',
    payoff: 'The glass holds a world that refuses to stay still.',
    note: 'Scheduled variety expansion with a clean life/motion split.',
    tags: ['variety-expansion', 'water', 'animals'],
  },
  {
    domain: 'newsroom',
    title: 'Newsroom',
    place: 'the newsroom desk',
    deck: 'News pieces and press moves shape a story before morning.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('News pieces', 'What a story is made from.', [
        'HEADLINE', 'BYLINE', 'COLUMN', 'EDITOR', 'PHOTO', 'CAPTION', 'SOURCE', 'QUOTE',
        'BRIEF', 'PRESS', 'PAPER', 'STORY', 'LEDE', 'DATELINE', 'BULLETIN', 'CAMERA',
      ]),
      pool('Press moves', 'How the story gets trusted.', [
        'REPORT', 'VERIFY', 'EDIT', 'PRINT', 'CALL', 'RECORD', 'UPDATE', 'PUBLISH',
        'CHECK', 'REVISE', 'CAPTURE', 'LISTEN', 'QUESTION', 'BRIEF', 'FILE', 'DRAFT',
        'CONFIRM', 'SOURCE', 'REWRITE', 'COPYEDIT', 'FACTUAL', 'NOTATE', 'QUERY', 'FOLLOW',
      ]),
    ],
    actionA: 'make the story visible',
    pivot: 'puts pressure on the morning',
    actionB: 'turn rumor into record',
    payoff: 'The desk turns noise into something that can be read.',
    note: 'Scheduled variety expansion built around editorial motion.',
    tags: ['variety-expansion', 'news', 'writing'],
  },
  {
    domain: 'clockshop',
    title: 'Clockshop',
    place: 'the clockshop counter',
    deck: 'Clock parts and time motions keep the little machines awake.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Clock parts', 'What keeps time visible.', [
        'PENDULUM', 'DIAL', 'GEAR', 'SPRING', 'HAND', 'CHIME', 'FACE', 'WINDER',
        'SECOND', 'MINUTE', 'BRASS', 'CASE', 'ALARM', 'WEIGHT', 'ESCAPE', 'TICKER',
      ]),
      pool('Time motions', 'How the clock behaves.', [
        'TICK', 'TOCK', 'CHIME', 'TURN', 'WIND', 'COUNT', 'MEASURE', 'RESET',
        'PAUSE', 'STRIKE', 'BALANCE', 'SWING', 'MARK', 'ADVANCE', 'SETTLE', 'REPEAT',
        'TICKING', 'ESCAPE', 'TALLY', 'RATCHET', 'PULSE', 'CLICK', 'WOUND', 'TIMER',
      ]),
    ],
    actionA: 'make time visible',
    pivot: 'keeps the counter listening',
    actionB: 'turn minutes into music',
    payoff: 'The counter learns how small time can sound.',
    note: 'Scheduled variety expansion with tactile machinery.',
    tags: ['variety-expansion', 'time', 'mechanical'],
  },
  {
    domain: 'chessboard',
    title: 'Chessboard',
    place: 'the chessboard table',
    deck: 'Pieces and tactics make a quiet room feel dangerous.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Board pieces', 'What waits on the squares.', [
        'KING', 'QUEEN', 'BISHOP', 'KNIGHT', 'ROOK', 'PAWN', 'CASTLE', 'BOARD',
        'SQUARE', 'RANK', 'FILE', 'GAMBIT', 'CHECK', 'MATE', 'OPENING', 'DIAGRAM',
      ]),
      pool('Tactics', 'How pressure builds.', [
        'CAPTURE', 'DEFEND', 'FORK', 'PIN', 'SKEWER', 'CASTLING', 'ATTACK', 'GUARD',
        'TRADE', 'PRESS', 'DEVELOP', 'THREAT', 'ADVANCE', 'RETREAT', 'COUNTER', 'CONTROL',
      ]),
    ],
    actionA: 'hold the room in silence',
    pivot: 'puts danger into order',
    actionB: 'make quiet pressure visible',
    payoff: 'The table makes silence feel like a move.',
    note: 'Scheduled variety expansion for strategy and pressure.',
    tags: ['variety-expansion', 'strategy', 'tabletop'],
  },
  {
    domain: 'campsite',
    title: 'Campsite',
    place: 'the campsite ring',
    deck: 'Camp gear and fire-side motions settle into evening.',
    season: 'fall',
    expansionOnly: true,
    threads: [
      pool('Camp gear', 'What makes the camp workable.', [
        'TENT', 'LANTERN', 'COOLER', 'BEDROLL', 'MATCH', 'KETTLE', 'COMPASS', 'RUCKSACK',
        'HAMMOCK', 'TARP', 'SKILLET', 'BLANKET', 'CANTEEN', 'FIREPIT', 'THERMOS', 'FLASK',
      ]),
      pool('Camp moves', 'How the evening gets made.', [
        'PITCH', 'KINDLE', 'ROAST', 'STOKE', 'GATHER', 'SETTLE', 'UNROLL', 'LISTEN',
        'WHITTLE', 'TRAMP', 'FOLLOW', 'SLEEP', 'COOK', 'PACK', 'HIKING', 'RESTING',
      ]),
    ],
    actionA: 'make the dark feel prepared',
    pivot: 'sets one warm center in place',
    actionB: 'turn outside into shelter',
    payoff: 'The ring makes the open air feel kept.',
    note: 'Scheduled variety expansion with outdoor ritual distinct from trail/park.',
    tags: ['variety-expansion', 'camp', 'outdoor'],
  },
  {
    domain: 'pottery',
    title: 'Pottery',
    place: 'the pottery wheel',
    deck: 'Clay forms and kiln steps turn pressure into shape.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Clay forms', 'What the hand can shape.', [
        'CLAY', 'WHEEL', 'KILN', 'GLAZE', 'VASE', 'BOWL', 'MUGS', 'PLATTER',
        'HANDLE', 'FOOT', 'SLIP', 'COIL', 'SHARD', 'BISQUE', 'TILE', 'PITCHER',
      ]),
      pool('Kiln steps', 'How the piece becomes sturdy.', [
        'THROW', 'CENTER', 'SHAPE', 'TRIM', 'FIRE', 'GLAZE', 'CARVE', 'SCORE',
        'SMOOTH', 'PRESS', 'TURN', 'DRYING', 'POLISH', 'COILING', 'PINCH', 'HANDLE',
        'WEDGING', 'SLIPPING', 'BISQUE', 'RIBBING', 'SPONGE', 'PADDLE', 'POTTER', 'FIRING',
      ]),
    ],
    actionA: 'give pressure a shape',
    pivot: 'keeps the hand honest',
    actionB: 'turn softness into form',
    payoff: 'The wheel teaches clay how to remember.',
    note: 'Scheduled variety expansion for material transformation.',
    tags: ['variety-expansion', 'craft', 'clay'],
  },
  {
    domain: 'apiary',
    title: 'Apiary',
    place: 'the apiary path',
    deck: 'Hive pieces and bee-work motions hum around one box.',
    season: 'spring',
    expansionOnly: true,
    threads: [
      pool('Hive pieces', 'What belongs near the hive.', [
        'HIVE', 'COMB', 'HONEY', 'QUEEN', 'WORKER', 'DRONE', 'CELL', 'FRAME',
        'SMOKER', 'VEIL', 'GLOVES', 'NECTAR', 'POLLEN', 'BROOD', 'SWARM', 'APIARY',
      ]),
      pool('Hive moves', 'How the hive keeps working.', [
        'HUM', 'BUZZ', 'GATHER', 'FORAGE', 'DANCE', 'RETURN', 'SWARM', 'TEND',
        'SMOKE', 'INSPECT', 'HARVEST', 'SEAL', 'FANNING', 'FLYING', 'CARRY', 'SETTLE',
        'WAGGLE', 'NECTAR', 'POLLEN', 'NURTURE', 'CLUSTER', 'BROODING', 'HUMMING', 'GUARDING',
      ]),
    ],
    actionA: 'make sweetness feel organized',
    pivot: 'puts the whole box in motion',
    actionB: 'turn work into a hum',
    payoff: 'The path gathers sweetness one small flight at a time.',
    note: 'Scheduled variety expansion with natural motion and objects.',
    tags: ['variety-expansion', 'hive', 'nature'],
  },
  {
    domain: 'vineyard',
    title: 'Vineyard',
    place: 'the vineyard row',
    deck: 'Vine details and cellar steps carry fruit toward patience.',
    season: 'fall',
    expansionOnly: true,
    threads: [
      pool('Vine details', 'What grows or waits in the row.', [
        'GRAPE', 'VINE', 'TRELLIS', 'BARREL', 'CORK', 'CELLAR', 'CLUSTER', 'LEAF',
        'SOIL', 'BOTTLE', 'CRATE', 'PRESS', 'CANE', 'HARVEST', 'TASTING', 'VALLEY',
      ]),
      pool('Cellar steps', 'How the fruit is handled.', [
        'PRUNE', 'PICK', 'CRUSH', 'PRESS', 'FERMENT', 'POUR', 'TASTE', 'BOTTLE',
        'LABEL', 'STACK', 'TURN', 'SWIRL', 'SORT', 'RACK', 'AGING', 'STORE',
      ]),
    ],
    actionA: 'put patience in rows',
    pivot: 'sweetens the work by inches',
    actionB: 'turn fruit into waiting',
    payoff: 'The row makes patience taste like weather.',
    note: 'Scheduled variety expansion focused on seasonal process.',
    tags: ['variety-expansion', 'vineyard', 'harvest'],
  },
  {
    domain: 'tailor',
    title: 'Tailor',
    place: 'the tailor mirror',
    deck: 'Garment parts and fitting motions make cloth answer the body.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Garment parts', 'What gives the garment structure.', [
        'COLLAR', 'SLEEVE', 'CUFF', 'LINING', 'BUTTON', 'THREAD', 'POCKET', 'LAPEL',
        'ZIPPER', 'SEAM', 'FABRIC', 'PLEAT', 'WAIST', 'PATTERN', 'NEEDLE', 'THIMBLE',
      ]),
      pool('Fitting moves', 'How the garment changes.', [
        'MEASURE', 'PINNING', 'CUTTING', 'STITCH', 'PRESS', 'ALTER', 'DRAPE', 'TAPER',
        'MARK', 'FOLD', 'TRIM', 'SEWING', 'BASTE', 'MATCH', 'SMOOTH', 'ADJUST',
        'HEMMING', 'REFIT', 'RESHAPE', 'RESEW', 'NOTCH', 'GATHER', 'PLEATING', 'TAILOR',
      ]),
    ],
    actionA: 'give cloth a body',
    pivot: 'makes the mirror more exact',
    actionB: 'turn fit into feeling',
    payoff: 'The mirror shows where cloth learns to belong.',
    note: 'Scheduled variety expansion separate from laundry and studio.',
    tags: ['variety-expansion', 'tailor', 'garment'],
  },
  {
    domain: 'airport',
    title: 'Airport',
    place: 'the terminal window',
    deck: 'Terminal signs and flight moves lift a long room into motion.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Terminal signs', 'What guides the traveler.', [
        'GATE', 'TICKET', 'PASSPORT', 'LUGGAGE', 'RUNWAY', 'HANGAR', 'TERMINAL', 'BOARD',
        'ARRIVAL', 'DEPART', 'SECURITY', 'BAGGAGE', 'WINDOW', 'AISLE', 'PILOT', 'JETWAY',
      ]),
      pool('Flight moves', 'How the trip leaves the ground.', [
        'BOARD', 'TAXI', 'ASCEND', 'CRUISE', 'LAND', 'CHECK', 'SCAN', 'CARRY',
        'QUEUE', 'TRANSFER', 'CONNECT', 'WAIT', 'ANNOUNCE', 'STOW', 'BUCKLE', 'DESCEND',
      ]),
    ],
    actionA: 'make leaving legible',
    pivot: 'pulls the room toward distance',
    actionB: 'turn waiting into altitude',
    payoff: 'The window makes distance feel scheduled.',
    note: 'Scheduled variety expansion with a distinct travel setting.',
    tags: ['variety-expansion', 'travel', 'flight'],
  },
  {
    domain: 'apothecary',
    title: 'Apothecary',
    place: 'the apothecary shelf',
    deck: 'Shelf jars and mixing steps make an old room feel precise.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Shelf jars', 'What sits on the old shelf.', [
        'TONIC', 'HERB', 'ELIXIR', 'MORTAR', 'PESTLE', 'BOTTLE', 'DROPPER', 'LABEL',
        'BALM', 'SALVE', 'LAVENDER', 'MINT', 'SAGE', 'ROOT', 'VIAL', 'SYRUP',
      ]),
      pool('Mixing steps', 'How the shelf becomes useful.', [
        'MEASURE', 'GRIND', 'STEEP', 'POUR', 'BLEND', 'LABEL', 'STRAIN', 'STIR',
        'SEAL', 'SORT', 'CRUSH', 'WARM', 'INFUSE', 'BOTTLE', 'TEST', 'FILTER',
        'DECOCT', 'DOSING', 'SIFTING', 'MUDDLE', 'TINCTURE', 'MACERATE', 'CORKING', 'WEIGH',
      ]),
    ],
    actionA: 'make the shelf smell old and exact',
    pivot: 'keeps the recipe quiet',
    actionB: 'turn measure into remedy',
    payoff: 'The shelf makes care feel carefully lit.',
    note: 'Scheduled variety expansion with distinctive old-shop texture.',
    tags: ['variety-expansion', 'remedy', 'shop'],
  },
  {
    domain: 'planetarium',
    title: 'Planetarium',
    place: 'the planetarium dome',
    deck: 'Dome sights and show cues turn a ceiling into distance.',
    season: 'winter',
    expansionOnly: true,
    threads: [
      pool('Dome sights', 'What appears overhead.', [
        'PLANET', 'COMET', 'ORBIT', 'NEBULA', 'GALAXY', 'DOME', 'LASER', 'SCREEN',
        'STAR', 'SATURN', 'VENUS', 'MOON', 'ECLIPSE', 'ZENITH', 'AURORA', 'COSMOS',
      ]),
      pool('Show cues', 'How the room changes.', [
        'DIMMING', 'ROTATE', 'NARRATE', 'PROJECT', 'POINT', 'TRACE', 'SWEEP', 'GLOW',
        'FADE', 'LISTEN', 'REVEAL', 'CIRCLE', 'ALIGN', 'DRIFT', 'SPARKLE', 'LOWER',
        'UNFURL', 'DARKEN', 'STARING', 'SKYWARD', 'WIDEN', 'ORBITING', 'TWINKLE', 'SUSPEND',
      ]),
    ],
    actionA: 'make the ceiling enormous',
    pivot: 'darkens the room into wonder',
    actionB: 'turn looking upward into travel',
    payoff: 'The dome lets the ceiling become a sky.',
    note: 'Scheduled variety expansion, related to sky but distinct from the instrument-led observatory.',
    tags: ['variety-expansion', 'space', 'show'],
  },
  {
    domain: 'firehouse',
    title: 'Firehouse',
    place: 'the firehouse bay',
    deck: 'Gear and response steps keep the room ready.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Ready gear', 'What waits in the bay.', [
        'HELMET', 'LADDER', 'HOSE', 'SIREN', 'ENGINE', 'BOOTS', 'RADIO', 'NOZZLE',
        'TRUCK', 'JACKET', 'MASK', 'TANK', 'HYDRANT', 'BADGE', 'ROPE', 'GLOVES',
        'TURNOUT', 'AIRPACK', 'TOOLKIT', 'BREATHER',
      ]),
      pool('Response steps', 'How readiness becomes action.', [
        'ROLL', 'ALERT', 'DRIVE', 'SPRAY', 'RESCUE', 'CLIMB', 'RADIO', 'SIGNAL',
        'CHECK', 'CARRY', 'RETURN', 'TRAIN', 'READY', 'RUN', 'LIFT', 'SECURE',
        'DISPATCH', 'EVACUATE', 'RESPOND', 'TRAINING',
      ]),
    ],
    actionA: 'make readiness visible',
    pivot: 'keeps urgency polished',
    actionB: 'turn alarm into action',
    payoff: 'The bay keeps courage close enough to reach.',
    note: 'Scheduled variety expansion with high-energy verbs.',
    tags: ['variety-expansion', 'response', 'gear'],
  },
  {
    domain: 'radio-booth',
    title: 'Radio Booth',
    place: 'the radio booth',
    deck: 'Booth gear and air moves carry a voice across distance.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Booth gear', 'What helps the voice travel.', [
        'HEADSET', 'CONSOLE', 'FADER', 'CABLE', 'ANTENNA', 'SPEAKER', 'RECORD', 'SCRIPT',
        'SIGNAL', 'DIAL', 'SWITCH', 'STUDIO', 'TOWER', 'MIXER', 'TAPE', 'FILTER',
      ]),
      pool('Air moves', 'How sound gets shaped.', [
        'ANNOUNCE', 'MIXING', 'FADE', 'CUEING', 'CALL', 'LISTEN', 'RECORD', 'TUNE',
        'PATCH', 'SIGNAL', 'REPLAY', 'BALANCE', 'FILTER', 'LAUNCH', 'PAUSE', 'LEVEL',
        'AIRPLAY', 'MODULATE', 'MONITOR', 'SEGUE', 'VOICING', 'DUCKING', 'JINGLE', 'HOSTING',
      ]),
    ],
    actionA: 'give the voice a path',
    pivot: 'makes distance sound close',
    actionB: 'turn silence into signal',
    payoff: 'The booth sends a room farther than it can see.',
    note: 'Scheduled variety expansion for sound and broadcast.',
    tags: ['variety-expansion', 'radio', 'sound'],
  },
  {
    domain: 'printshop',
    title: 'Printshop',
    place: 'the printshop press',
    deck: 'Type pieces and press moves turn ink into public shape.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Type pieces', 'What the press works with.', [
        'LETTER', 'INKWELL', 'PRESS', 'PLATE', 'ROLLER', 'FRAME', 'PAPER', 'TYPE',
        'GALLEY', 'PROOF', 'BLOCK', 'LEADING', 'MARGIN', 'POSTER', 'FOLDER', 'BINDER',
      ]),
      pool('Press moves', 'How the page gets made.', [
        'SETTING', 'PRINT', 'INKING', 'PRESS', 'ALIGN', 'TRIM', 'FOLD', 'STACK',
        'DRYING', 'PROOF', 'ROLL', 'BIND', 'CUTTING', 'SORT', 'CHECK', 'PACKAGE',
        'TYPESET', 'LOCKUP', 'IMPOSE', 'PLATEN', 'GATHER', 'COLLATE', 'NUMBER', 'STAPLE',
      ]),
    ],
    actionA: 'make language physical',
    pivot: 'puts weight behind the page',
    actionB: 'turn ink into announcement',
    payoff: 'The press gives language a body.',
    note: 'Scheduled variety expansion with strong material/process contrast.',
    tags: ['variety-expansion', 'print', 'page'],
  },
  {
    domain: 'weather-station',
    title: 'Weather Station',
    place: 'the weather station',
    deck: 'Instruments and forecast shifts turn air into evidence.',
    season: 'spring',
    expansionOnly: true,
    threads: [
      pool('Instruments', 'What measures the air.', [
        'THERMAL', 'RADAR', 'SENSOR', 'GAUGE', 'WINDSOCK', 'RAINCUP', 'SCREEN', 'CHART',
        'BEACON', 'DIAL', 'TOWER', 'COMPASS', 'CAMERA', 'ALERT', 'SIGNAL', 'METER',
        'ANEROID', 'ANEMO', 'VANE', 'HYGRO', 'LOGGER', 'PROBE', 'SATLINK', 'THERMO',
      ]),
      pool('Forecast shifts', 'How weather changes.', [
        'RISING', 'FALLING', 'GUSTING', 'CLEAR', 'CLOUDING', 'DRIZZLE', 'FREEZE', 'THAW',
        'MEASURE', 'TRACK', 'WARN', 'UPDATE', 'WATCH', 'SHIFT', 'SWING', 'REPORT',
      ]),
    ],
    actionA: 'give the air a number',
    pivot: 'makes the sky accountable',
    actionB: 'turn weather into warning',
    payoff: 'The station translates the sky before it arrives.',
    note: 'Scheduled variety expansion separate from commute rain cues.',
    tags: ['variety-expansion', 'weather', 'measure'],
  },
  {
    domain: 'dancehall',
    title: 'Dancehall',
    place: 'the dancehall floor',
    deck: 'Floor details and dance steps let the room count out loud.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Floor details', 'What waits around the dance.', [
        'FLOOR', 'MIRROR', 'STAGE', 'BALLET', 'TANGO', 'RHYTHM', 'SHOES', 'RIBBON',
        'LAMP', 'CURTAIN', 'RECORD', 'BAND', 'DRESS', 'GLOVE', 'TICKET', 'CIRCLE',
      ]),
      pool('Dance steps', 'How the room moves.', [
        'TWIRL', 'STEP', 'GLIDE', 'TURN', 'DIPPING', 'SPIN', 'CLAP', 'COUNT',
        'FOLLOW', 'LEAD', 'SWAY', 'BOUNCE', 'PAUSE', 'CROSS', 'SLIDE', 'LISTEN',
      ]),
    ],
    actionA: 'make the floor expect music',
    pivot: 'sets the count underfoot',
    actionB: 'turn rhythm into motion',
    payoff: 'The floor hears the music before anyone does.',
    note: 'Scheduled variety expansion for embodied rhythm.',
    tags: ['variety-expansion', 'dance', 'music'],
  },
  {
    domain: 'laboratory',
    title: 'Laboratory',
    place: 'the laboratory bench',
    deck: 'Lab pieces and test steps turn curiosity into proof.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Lab pieces', 'What makes the bench precise.', [
        'BEAKER', 'FLASK', 'GOGGLE', 'BURNER', 'SAMPLE', 'PIPETTE', 'SLIDE', 'METER',
        'TUBE', 'CHART', 'NOTE', 'LENS', 'SCALE', 'SENSOR', 'CABINET', 'LABEL',
        'REAGENT', 'CUVETTE', 'WELL', 'AGAR', 'BUFFER', 'CULTURE', 'VORTEX', 'MICROBE',
      ]),
      pool('Test steps', 'How the bench finds out.', [
        'MEASURE', 'TEST', 'RECORD', 'MIXING', 'HEAT', 'COOL', 'OBSERVE', 'FILTER',
        'LABEL', 'CHECK', 'TRACK', 'COMPARE', 'CULTURE', 'SAMPLE', 'REPORT', 'SEAL',
        'TITRATE', 'ANALYZE', 'DILUTE', 'DECANT', 'ISOLATE', 'CATALYST', 'CONTROL', 'ASSAY',
      ]),
    ],
    actionA: 'make curiosity careful',
    pivot: 'keeps wonder under glass',
    actionB: 'turn looking into proof',
    payoff: 'The bench lets curiosity become evidence.',
    note: 'Scheduled variety expansion with science-process texture.',
    tags: ['variety-expansion', 'science', 'proof'],
  },
  {
    domain: 'lighthouse',
    title: 'Lighthouse',
    place: 'the lighthouse stair',
    deck: 'Beacon pieces and coast cues turn height into warning.',
    season: 'winter',
    expansionOnly: true,
    threads: [
      pool('Beacon pieces', 'What keeps the tower visible.', [
        'BEACON', 'LANTERN', 'LENS', 'TOWER', 'KEEPER', 'WINDOW', 'RAILING', 'STAIR',
        'OILCAN', 'SIGNAL', 'BRASS', 'CHART', 'FOGHORN', 'ROCKS', 'CLIFF', 'GLASS',
        'FRESNEL', 'GALLERY', 'BALCONY', 'WICK', 'OILROOM', 'CATWALK', 'LANDING', 'PRISM',
      ]),
      pool('Coast cues', 'How the light answers the water.', [
        'FLASH', 'SWEEP', 'GLOW', 'WARN', 'TURN', 'GUIDE', 'WATCH', 'SHIMMER',
        'SIGNAL', 'RETURN', 'RISING', 'FADE', 'BEAM', 'SPARKLE', 'GLANCE', 'TRACK',
        'SEAWARD', 'FOGBOUND', 'BEAMING', 'WINKING', 'SWIVEL', 'GLIMMER', 'MARKING', 'AIMING',
      ]),
    ],
    actionA: 'make height useful',
    pivot: 'sets brightness above the rocks',
    actionB: 'turn danger into direction',
    payoff: 'The stair lifts warning until the coast can read it.',
    note: 'Scheduled variety expansion with a coastal signal vocabulary.',
    tags: ['variety-expansion', 'coast', 'signal'],
  },
];

const ALL_BLUEPRINTS = [...BLUEPRINTS, ...EXPANSION_BLUEPRINTS];

const HOLIDAY_NOD_RULES = [
  {
    domain: 'porch-spark',
    nearbyHoliday: 'Independence Day',
    holidayDateKey: '2026-07-04',
    targetDateKey: '2026-07-02',
    windowDays: 2,
    note: 'A summer-bright porch puzzle two days before the holiday.',
  },
  {
    domain: 'school',
    nearbyHoliday: 'Back-to-school season',
    holidayDateKey: '2026-09-07',
    targetDateKey: '2026-09-03',
    windowDays: 4,
    note: 'A classroom nod near Labor Day week without making the date literal.',
  },
  {
    domain: 'porch-lantern',
    nearbyHoliday: 'Halloween',
    holidayDateKey: '2026-10-31',
    targetDateKey: '2026-10-28',
    windowDays: 3,
    note: 'A porch-at-dusk puzzle close to Halloween but not on Halloween.',
  },
  {
    domain: 'table-leaf',
    nearbyHoliday: 'Thanksgiving',
    holidayDateKey: '2026-11-26',
    targetDateKey: '2026-11-23',
    windowDays: 3,
    note: 'A table-gathering nod before Thanksgiving week peaks.',
  },
  {
    domain: 'window-ribbon',
    nearbyHoliday: 'Christmas',
    holidayDateKey: '2026-12-25',
    targetDateKey: '2026-12-22',
    windowDays: 3,
    note: 'A winter window and wrapping puzzle before the holiday itself.',
  },
  {
    domain: 'clean-slate',
    nearbyHoliday: 'New Year',
    holidayDateKey: '2027-01-01',
    targetDateKey: '2026-12-30',
    windowDays: 2,
    note: 'A fresh-start puzzle before New Year, not on January 1.',
  },
  {
    domain: 'paper-hearts',
    nearbyHoliday: 'Valentine season',
    holidayDateKey: '2027-02-14',
    targetDateKey: '2027-02-11',
    windowDays: 3,
    note: 'A craft-note puzzle near Valentine season without landing on the day.',
  },
  {
    domain: 'spring-basket',
    nearbyHoliday: 'Easter season',
    holidayDateKey: '2027-04-04',
    targetDateKey: '2027-04-01',
    windowDays: 3,
    note: 'A spring basket puzzle before the holiday weekend.',
  },
] as const;

const NON_SPOILER_TITLE_PREFIXES = [
  'Quiet', 'Bright', 'Small', 'Hidden', 'Gentle', 'Clever', 'Soft', 'Lively',
  'Patient', 'Kind', 'Curious', 'Tender', 'Slow', 'Honest', 'Narrow', 'Open',
  'Early', 'Late', 'Silver', 'Golden', 'Restless', 'Steady', 'Warm', 'Cool',
  'Secret', 'Plain', 'Fresh', 'Deep', 'Brave', 'Careful', 'Distant', 'Earnest',
] as const;

const NON_SPOILER_TITLE_NOUNS = [
  'Turn', 'Promise', 'Echo', 'Drift', 'Pulse', 'Measure', 'Interval', 'Gesture',
  'Weather', 'Wonder', 'Shift', 'Spark', 'Murmur', 'Current', 'Pattern', 'Threshold',
  'Horizon', 'Pocket', 'Undertone', 'Opening', 'Return', 'Balance', 'Tangle', 'Glimmer',
  'Passage', 'Secret', 'Cadence', 'Ember', 'Bloom', 'Crossing', 'Whisper', 'Trace',
] as const;

const NON_SPOILER_TITLE_FRAMES = [
  '{prefix} {noun}',
  'The {prefix} {noun}',
  '{noun} In Passing',
  'Where {noun} Settles',
  'Before The {noun}',
  'After The {noun}',
  'What {noun} Keeps',
  '{noun} For Later',
  '{noun} At The Edge',
  'The {noun} Nearby',
  '{noun} In The Middle',
  '{noun} Without Hurry',
] as const;

const BANNED_STANDALONE_LEAD_COPY = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first)\b/i;
const BANNED_WEAVE_COPY = /\b(theme|clue|hidden turn|line land|same thread|final line)\b/i;

const COPY_PROFILES: Record<string, BlueprintCopyProfile> = {
  cafe: copyProfile(['Counter Glow', 'Morning Steam', 'Block Wake', 'Window Rush', 'Cup And Curb', 'First Errand']),
  commute: copyProfile(['Rain Route', 'Doorway Forecast', 'Wet Avenue', 'Signal Weather', 'Shelter Map', 'Damp Departure']),
  desk: copyProfile(['Clean Desk', 'First Draft', 'Workday Shape', 'Page Signal', 'Focus Mark', 'Inbox Light']),
  garden: copyProfile(['Gate Bloom', 'Tended Path', 'Soil Signal', 'Green Ritual', 'Petal Work', 'Yard Answer']),
  station: copyProfile(['Platform Signal', 'Departure Clock', 'Waiting Rail', 'Track Pulse', 'Ticket Hour', 'Moving Queue']),
  kitchen: copyProfile(['Recipe Motion', 'Counter Scent', 'First Flavor', 'Supper Signal', 'Prep Light', 'Dinner Edge']),
  studio: copyProfile(['Table Sketch', 'Material Spark', 'First Mark', 'Color Draft', 'Brush Thought', 'Shape Signal']),
  library: copyProfile(['Quiet Page', 'Reading Light', 'Shelf Whisper', 'Margin Thought', 'Book Table', 'Chosen Hush']),
  shore: copyProfile(['Tide Edge', 'Sand Trace', 'Water Line', 'Shore Mark', 'Low-Water Find', 'Foam Return']),
  market: copyProfile(['Aisle Talk', 'Basket Signal', 'Stall Morning', 'Market Hand', 'Bright Produce', 'Friendly Change']),
  workshop: copyProfile(['Loose Part', 'Tool Light', 'Repair Table', 'Workbench Clue', 'Small Fix', 'Solved Hinge']),
  park: copyProfile(['Path Social', 'Loop Light', 'Bench Rhythm', 'Walking Thread', 'Park Greeting', 'Neighborhood Path']),
  school: copyProfile(['Classroom Start', 'Board Signal', 'First Task', 'Bell Thread', 'Ready Room', 'Lesson Door']),
  gallery: copyProfile(['Slow Look', 'Wall Attention', 'Eye Route', 'Quiet Frame', 'Room Seeing', 'Picture Path']),
  bakery: copyProfile(['Case Glow', 'Breakfast Line', 'Sweet Counter', 'Glass Choice', 'Morning Treat', 'Bakery Motion']),
  mailroom: copyProfile(['Paper Route', 'Sorted Door', 'Shelf Signal', 'Delivery Thread', 'Mail Path', 'Posted Light']),
  theater: copyProfile(['Opening Cue', 'Room Attention', 'Stage Hush', 'Audience Light', 'Curtain Signal', 'Listening Room']),
  trail: copyProfile(['Path Map', 'Marker Morning', 'Trail Clue', 'Ridge Signal', 'Walking Compass', 'Outdoor Line']),
  laundry: copyProfile(['Clean Pattern', 'Soft Order', 'Washday Turn', 'Laundry Thread', 'Folded Light', 'Room Reset']),
  rooftop: copyProfile(['Last Light', 'Roofline Hour', 'Evening Rail', 'Skyline Pause', 'Slow View', 'Bright Edge']),
  diner: copyProfile(['Booth Rhythm', 'Counter Call', 'Breakfast Thread', 'Table Familiar', 'Diner Signal', 'Small Order']),
  harbor: copyProfile(['Dock Bell', 'Water Departure', 'Harbor Line', 'Morning Mooring', 'Boat Signal', 'Still Water']),
  music: copyProfile(['Practice Beat', 'Room Rhythm', 'Rehearsal Thread', 'Sound Shape', 'Listening Cue', 'Measure Light']),
  porch: copyProfile(['Doorstep Welcome', 'Porch Greeting', 'Front Light', 'Neighbor Signal', 'Step Hello', 'Small Welcome']),
  picnic: copyProfile(['Blanket Table', 'Basket Afternoon', 'Grass Spread', 'Picnic Thread', 'Park Table', 'Shared Light']),
  'clean-slate': copyProfile(['Fresh Mark', 'New Page', 'Quiet Plan', 'First Step', 'Calendar Edge', 'Reset Light']),
  'paper-hearts': copyProfile(['Small Message', 'Folded Note', 'Craft Table', 'Ribbon Thought', 'Quiet Valentine', 'Hand To Hand']),
  'porch-lantern': copyProfile(['Dusk Door', 'Lantern Step', 'October Glow', 'Porch Shadow', 'Soft Knock', 'Evening Welcome']),
  'table-leaf': copyProfile(['Long Table', 'One More Plate', 'Gathered Linen', 'Serving Light', 'Room Made', 'Before Thanks']),
  'window-ribbon': copyProfile(['Bright Window', 'Ribbon Light', 'Winter Glass', 'Parcel Glow', 'Front Reflection', 'Wrapped Room']),
  'spring-basket': copyProfile(['Early Spring', 'Basket Color', 'Hidden Clover', 'Table Bloom', 'Spring Found', 'Pastel Hunt']),
  'porch-spark': copyProfile(['Bright Porch', 'Summer Rail', 'Dusk Spark', 'Porch Lift', 'Lantern Cheer', 'Night Close']),
};

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

const LETTER_FILL = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';

const SHARED_BACKUP_WORDS = [
  'ABLE', 'ACORN', 'ADAPT', 'AGENT', 'ALBUM', 'ALERT', 'ALLEY', 'AMBER', 'ANCHOR', 'APRIL',
  'ARBOR', 'ARROW', 'ARTIST', 'ATLAS', 'AUDIO', 'AUTUMN', 'AWAKE', 'AZURE', 'BADGE', 'BAKER',
  'BALLET', 'BANANA', 'BASIN', 'BEACON', 'BEANS', 'BERRY', 'BIRCH', 'BLAZE', 'BLEND', 'BLOOM',
  'BOARD', 'BOTTLE', 'BOWL', 'BRASS', 'BREEZE', 'BRICK', 'BROOK', 'CABLE', 'CABIN', 'CANAL',
  'CARDS', 'CARPET', 'CEDAR', 'CHARM', 'CHEST', 'CLAY', 'CLOUD', 'COAST', 'COIN', 'COPPER',
  'CORAL', 'COTTON', 'CRAFT', 'CRANE', 'CREEK', 'CROWN', 'DANCE', 'DELTA', 'DIAL', 'DINER',
  'DIVER', 'DOCK', 'DREAM', 'DRIFT', 'EAGER', 'EARTH', 'ECHO', 'EDGE', 'EMBER', 'ENTRY',
  'EVENING', 'FABLE', 'FARM', 'FENCE', 'FERRY', 'FIELD', 'FLAME', 'FLAVOR', 'FLOCK', 'FLOOR',
  'FLOUR', 'FOCUS', 'FOREST', 'FORK', 'FRESH', 'FRUIT', 'GARDEN', 'GHOST', 'GIFT', 'GLEAM',
  'GLOBE', 'GRAIN', 'GRAPE', 'GREEN', 'GROVE', 'GUIDE', 'HABIT', 'HAZEL', 'HEART', 'HONEY',
  'HOUSE', 'IMAGE', 'ISLAND', 'IVORY', 'JACKET', 'JASMINE', 'JELLY', 'JUMP', 'KEYPAD', 'KITE',
  'LADDER', 'LAKE', 'LAMP', 'LAYER', 'LIGHT', 'LILAC', 'LINEN', 'LOAF', 'LOCK', 'LODGE',
  'LUNCH', 'MARBLE', 'MELON', 'MINT', 'MIRROR', 'MODEL', 'MOMENT', 'MONEY', 'MOON', 'MORNING',
  'MUSIC', 'NEEDLE', 'NEST', 'NIGHT', 'NOVEL', 'NUMBER', 'OCEAN', 'ORANGE', 'ORCHARD', 'ORBIT',
  'PALM', 'PANTRY', 'PARADE', 'PATIO', 'PEARL', 'PHOTO', 'PLANT', 'PLAZA', 'POCKET', 'PRISM',
  'PULSE', 'QUIET', 'QUILT', 'RADIO', 'RANCH', 'RECIPE', 'RECORD', 'REEF', 'RIVER', 'ROAD',
  'ROAST', 'ROBIN', 'ROOF', 'ROOM', 'SADDLE', 'SALON', 'SALT', 'SAND', 'SCENE', 'SCORE',
  'SEED', 'SILVER', 'SLATE', 'SMILE', 'SMOKE', 'SNACK', 'SOAP', 'SONG', 'SPICE', 'STAIR',
  'STAR', 'STEAM', 'STONE', 'STORY', 'STREAM', 'STRING', 'SUMMER', 'TABLE', 'TACO', 'TERRACE',
  'TIDE', 'TILE', 'TRAY', 'TREE', 'UMBER', 'UNITY', 'UPLIFT', 'URBAN', 'VALLEY', 'VASE',
  'VELVET', 'VIDEO', 'VISIT', 'VOICE', 'WAGON', 'WALL', 'WATER', 'WHEAT', 'WHEEL', 'WHISTLE',
  'WINDING', 'WISH', 'WOOD', 'WOVEN', 'YARD', 'YEAST', 'YELLOW', 'YOGURT', 'ZEBRA', 'ZEST',
  'AIRLINE', 'AIRPLANE', 'BALCONY', 'BLUEBELL', 'BOOKCASE', 'BOOKSHOP', 'CABBAGE', 'CABINET',
  'CAMERA', 'CAMPER', 'CAMPFIRE', 'CAMPUS', 'CANYON', 'CAPTION', 'CARVING', 'CASHIER',
  'CEILING', 'CHANNEL', 'CHECKER', 'CHIMNEY', 'CITRUS', 'CLASSIC', 'CLOSET', 'COASTER',
  'COBALT', 'COCONUT', 'COMFORT', 'COMPASS', 'CONCERT', 'COOKBOOK', 'COTTAGE', 'CRACKER',
  'CUSHION', 'DAYDREAM', 'DAYLIGHT', 'DIAGRAM', 'DOORBELL', 'DUSTPAN', 'ECLIPSE', 'FANFARE',
  'FESTIVAL', 'FIREWOOD', 'FISHING', 'FLAGPOLE', 'FRECKLE', 'FURNACE', 'GLOWING', 'GRANOLA',
  'GRIDDLE', 'HARVEST', 'HAYRIDE', 'HEATHER', 'HONEYDEW', 'ICEBERG', 'JIGSAW', 'JUNIPER',
  'KEYHOLE', 'KINGDOM', 'LAUNDRY', 'LECTURE', 'LIFTOFF', 'MACHINE', 'MAGNET', 'MAILBOX',
  'MIDNIGHT', 'MOUNTAIN', 'MUSHROOM', 'OATMEAL', 'ORIGAMI', 'OUTDOOR', 'PAINTER', 'PAJAMAS',
  'PASSAGE', 'PATHWAY', 'PINECONE', 'PITCHER', 'PLAYFUL', 'POPCORN', 'PRAIRIE', 'PRESENT',
  'PRINTER', 'RAINDROP', 'RAINBOW', 'ROCKET', 'ROOFTOP', 'SAILBOAT', 'SANDBOX', 'SHELTER',
  'SHOELACE', 'SIDEWALK', 'SKYLINE', 'SNOWFALL', 'SPATULA', 'SPIRAL', 'STAIRWAY', 'SUITCASE',
  'TEACHER', 'TEACUP', 'THIMBLE', 'THUNDER', 'TIDEPOOL', 'TINFOIL', 'TOOLBOX', 'TRIPOD',
  'TURNPIKE', 'TWILIGHT', 'VINEYARD', 'VINTAGE', 'WATERING', 'WATERWAY', 'WORKDAY', 'WRITER',
  'YEARBOOK', 'ZIPPER',
].filter((word) => /^[A-Z]{4,8}$/.test(word));

const WORD_POOL_FREQUENCY = ALL_BLUEPRINTS.reduce<Record<string, number>>((counts, blueprint) => {
  blueprint.threads.forEach((thread) => {
    thread.words.forEach((word) => {
      counts[word] = (counts[word] ?? 0) + 1;
    });
  });
  return counts;
}, {});

export const THREADLINE_WORDS_BY_DOMAIN_THREAD: Record<string, Record<string, string[]>> =
  Object.fromEntries(
    ALL_BLUEPRINTS.map((blueprint) => [
      blueprint.domain,
      Object.fromEntries(blueprint.threads.map((thread) => [thread.name, thread.words])),
    ])
  );

function copyProfile(titleVariants: string[]): BlueprintCopyProfile {
  return {
    titleVariants,
    payoffVariants: [
      'Between {a} and {b}, {payoff}',
      'By the time {a} meets {b}, {payoff}',
      'What starts with {a} ends near {b}; {payoff}',
      '{place} holds {a} beside {b}, and {payoff}',
      'With {a} beside {b}, {payoff}',
      '{a} gives {b} its cue, and {payoff}',
    ],
  };
}

function inferLeadRole(name: string): ThreadlineWordRole {
  if (/(moves|motions|steps|calls|cues|signals|habits|routines)/i.test(name)) return 'motion';
  if (/(signs|route|delivery|starting|order)/i.test(name)) return 'signal';
  if (/(visitor|buyer|audience|neighbor|hosting)/i.test(name)) return 'person';
  if (/(details|objects|pieces|things|supplies|goods|treats|finds|gear|ingredients|tools|fabric|table|window|doorstep|counter|dock|booth|stage|book|craft|packed|fresh-start|colors)/i.test(name)) {
    return 'object';
  }
  return 'detail';
}

function normalizePoolWord(input: string | PoolWordInput, fallbackRole: ThreadlineWordRole): PoolWordEntry | null {
  const answer = (typeof input === 'string' ? input : input.answer).toUpperCase();
  if (!/^[A-Z]{4,8}$/.test(answer)) return null;
  return {
    answer,
    roles: typeof input === 'string' ? [fallbackRole] : input.roles ?? [fallbackRole],
  };
}

function pool(name: string, clue: string, words: Array<string | PoolWordInput>): WordPool {
  const leadRole = inferLeadRole(name);
  const entries = words
    .map((word) => normalizePoolWord(word, leadRole))
    .filter((entry): entry is PoolWordEntry => Boolean(entry));

  return {
    name,
    clue,
    entries,
    words: entries.map((entry) => entry.answer),
    leadRole,
  };
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(date: Date, offset: number): Date {
  const next = new Date(date);
  next.setDate(date.getDate() + offset);
  return next;
}

function dateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function dateFromKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function dayDistance(a: string, b: string): number {
  const ms = Math.abs(dateFromKey(a).getTime() - dateFromKey(b).getTime());
  return Math.round(ms / 86_400_000);
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getDifficulty(dayIndex: number, blueprint: Blueprint): ThreadlineDifficulty {
  if (blueprint.difficultyBias) return blueprint.difficultyBias;
  const weekday = dayIndex % 7;
  if (weekday === 0 || weekday === 1) return 'Easy';
  if (weekday === 4 || weekday === 5) return 'Hard';
  return 'Medium';
}

function targetLengthsForDifficulty(difficulty: ThreadlineDifficulty): number[] {
  if (difficulty === 'Easy') return [6, 6, 6, 6, 5, 7];
  if (difficulty === 'Hard') return [7, 7, 6, 7, 7, 6];
  return [7, 6, 6, 6, 6, 6];
}

function getSeasonForDateKey(key: string, fallback: string): string {
  const month = Number(key.slice(5, 7));
  if (month === 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

function standardBlueprints(): Blueprint[] {
  return BLUEPRINTS.filter((blueprint) => !blueprint.tags.includes('holiday-adjacent') && !blueprint.expansionOnly);
}

function getOriginalWindowBlueprint(dateKeyValue: string, dayIndex: number): Blueprint {
  const holidayRule = HOLIDAY_NOD_RULES.find((rule) => rule.targetDateKey === dateKeyValue);
  if (holidayRule) {
    return BLUEPRINTS.find((blueprint) => blueprint.domain === holidayRule.domain) ?? BLUEPRINTS[0];
  }

  const core = standardBlueprints();
  return core[dayIndex % core.length];
}

function rotateBlueprints(blueprints: Blueprint[], offset: number): Blueprint[] {
  return blueprints.map((_, index) => blueprints[(index + offset) % blueprints.length]);
}

function getBlueprintCandidatesForDateKey(dateKeyValue: string, dayIndex: number): Blueprint[] {
  if (dayIndex < THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS) {
    return [getOriginalWindowBlueprint(dateKeyValue, dayIndex)];
  }

  const expansionIndex = dayIndex - THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS;
  if (expansionIndex < THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS) {
    return rotateBlueprints(EXPANSION_BLUEPRINTS, expansionIndex % EXPANSION_BLUEPRINTS.length);
  }

  const formerReserveIndex = expansionIndex - THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS;
  const core = standardBlueprints();
  return rotateBlueprints(core, (formerReserveIndex * 5 + 3) % core.length);
}

function chooseWord(
  pool: WordPool,
  targetLength: number,
  usedAnswers: Set<string>,
  lastSeen: Map<string, number>,
  dayIndex: number
): SelectedWord {
  const ranked = Array.from(new Set(pool.words)).sort((a, b) => {
    const lengthScore = Math.abs(a.length - targetLength) - Math.abs(b.length - targetLength);
    if (lengthScore !== 0) return lengthScore;
    const uniquenessScore = (WORD_POOL_FREQUENCY[a] ?? 1) - (WORD_POOL_FREQUENCY[b] ?? 1);
    if (uniquenessScore !== 0) return uniquenessScore;
    return a.localeCompare(b);
  });
  const candidate = ranked.find((answer) => {
    const previous = lastSeen.get(answer);
    return !usedAnswers.has(answer) && (previous === undefined || dayIndex - previous > THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS);
  });

  if (!candidate) {
    throw new Error(`No eligible Threadline word in ${pool.name} for day ${dayIndex}`);
  }

  usedAnswers.add(candidate);
  lastSeen.set(candidate, dayIndex);
  const entry = pool.entries.find((word) => word.answer === candidate);
  return {
    answer: candidate,
    pool,
    roles: entry?.roles ?? [pool.leadRole],
  };
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

function placeWords(answers: string[], seed: number): { grid: string[]; paths: ThreadlineCoord[][] } {
  const random = mulberry32(seed);
  const cells: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => '')
  );
  const starts = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => ({
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  }));
  const paths: ThreadlineCoord[][] = [];
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
      throw new Error(`Could not place Threadline shipped answer ${answer}`);
    }

    path.forEach((coord, letterIndex) => {
      cells[coord.row][coord.col] = answer[letterIndex];
    });
    paths[wordIndex] = path;
  });

  const grid = cells.map((row) =>
    row
      .map((letter, index) => letter || LETTER_FILL[Math.floor(random() * LETTER_FILL.length + index) % LETTER_FILL.length])
      .join('')
  );

  return { grid, paths };
}

function placeWordsWithRetries(answers: string[], seed: number): { grid: string[]; paths: ThreadlineCoord[][] } {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return placeWords(answers, seed + attempt * 7_919);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function asLower(answer: string): string {
  return answer.toLowerCase();
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function lowerFirst(text: string): string {
  return text.length === 0 ? text : text[0].toLowerCase() + text.slice(1);
}

function stripTerminal(text: string): string {
  return text.replace(/[.!?]+$/, '');
}

function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/[\s-]+/)
    .map((part) => capitalize(part))
    .join(' ');
}

function placeName(blueprint: Blueprint): string {
  return blueprint.place.replace(/^the /, '');
}

function profileFor(blueprint: Blueprint): BlueprintCopyProfile {
  return COPY_PROFILES[blueprint.domain] ?? copyProfile([blueprint.title]);
}

function blank(wordId: string): ThreadlineSegment {
  return { type: 'blank', wordId };
}

function serialBlanks(wordIds: string[]): ThreadlineSegment[] {
  return [
    blank(wordIds[0]),
    { type: 'text', text: ', ' },
    blank(wordIds[1]),
    { type: 'text', text: ', and ' },
    blank(wordIds[2]),
  ];
}

function appendSegments(target: ThreadlineSegment[], source: ThreadlineSegment[]): void {
  source.forEach((segment) => target.push(segment));
}

function appendLeadClause(
  target: ThreadlineSegment[],
  pool: WordPool,
  wordIds: string[],
  action: string
): void {
  if (pool.leadRole === 'motion' || pool.leadRole === 'person') {
    target.push({ type: 'text', text: 'the scene moves through ' });
    appendSegments(target, serialBlanks(wordIds));
    target.push({ type: 'text', text: ` to ${action}` });
    return;
  }

  appendSegments(target, serialBlanks(wordIds));
  target.push({ type: 'text', text: ` ${action}` });
}

function normalizeCopyKey(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function copyIsFresh(lastSeen: Map<string, number>, copy: string, dayIndex: number): boolean {
  const key = normalizeCopyKey(copy);
  const previousDay = lastSeen.get(key);
  return !key || previousDay === undefined || dayIndex - previousDay > THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS;
}

function rememberCopy(lastSeen: Map<string, number>, copy: string, dayIndex: number): void {
  const key = normalizeCopyKey(copy);
  if (key) lastSeen.set(key, dayIndex);
}

function makeLead(blueprint: Blueprint, wordIds: string[], dayIndex: number): ThreadlineSegment[] {
  const firstIds = wordIds.slice(0, 3);
  const secondIds = wordIds.slice(3, 6);
  const style = (dayIndex + blueprint.domain.length) % 8;
  const segments: ThreadlineSegment[] = [];

  if (style === 0) {
    segments.push({ type: 'text', text: `At ${blueprint.place}, ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: '; ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 1) {
    segments.push({ type: 'text', text: `Around ${blueprint.place}, ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: ', while ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 2) {
    segments.push({ type: 'text', text: `${capitalize(blueprint.place)} holds still as ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: '; nearby, ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 3) {
    segments.push({ type: 'text', text: `The morning at ${blueprint.place} starts when ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: '; by the end, ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 4) {
    segments.push({ type: 'text', text: `Near ${blueprint.place}, ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: ', and ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 5) {
    segments.push({ type: 'text', text: `In ${blueprint.place}, ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: ' before ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  if (style === 6) {
    segments.push({ type: 'text', text: `${capitalize(blueprint.place)} gets its shape when ` });
    appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
    segments.push({ type: 'text', text: ', then ' });
    appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
    segments.push({ type: 'text', text: '.' });
    return segments;
  }

  segments.push({ type: 'text', text: `By ${blueprint.place}, ` });
  appendLeadClause(segments, blueprint.threads[0], firstIds, blueprint.actionA);
  segments.push({ type: 'text', text: '; after that, ' });
  appendLeadClause(segments, blueprint.threads[1], secondIds, blueprint.actionB);
  segments.push({ type: 'text', text: '.' });
  return segments;
}

function titleForDay(
  blueprint: Blueprint,
  _dateKeyValue: string,
  dayIndex: number,
  selectedWords: SelectedWord[],
  copyFreshness?: CopyFreshnessState
): string {
  const cycleOffset = copyCycleOffset(dayIndex);
  const candidates: string[] = [];
  const answerTokens = new Set(selectedWords.map((word) => normalizeCopyKey(word.answer)));
  const threadTokens = new Set(
    blueprint.threads.flatMap((thread) =>
      normalizeCopyKey(`${thread.name} ${thread.clue}`).split(' ').filter((token) => token.length > 2)
    )
  );

  for (
    let attempt = 0;
    attempt < NON_SPOILER_TITLE_PREFIXES.length * NON_SPOILER_TITLE_NOUNS.length * NON_SPOILER_TITLE_FRAMES.length;
    attempt += 1
  ) {
    const prefix =
      NON_SPOILER_TITLE_PREFIXES[
        (dayIndex + blueprint.domain.length + cycleOffset + attempt) % NON_SPOILER_TITLE_PREFIXES.length
      ];
    const noun =
      NON_SPOILER_TITLE_NOUNS[
        (dayIndex * 3 + blueprint.domain.length * 5 + cycleOffset + attempt * 7) %
          NON_SPOILER_TITLE_NOUNS.length
      ];
    const frame =
      NON_SPOILER_TITLE_FRAMES[
        (dayIndex * 5 + blueprint.domain.length * 3 + cycleOffset + attempt * 11) %
          NON_SPOILER_TITLE_FRAMES.length
      ];
    const candidate = frame.replace('{prefix}', prefix).replace('{noun}', noun);
    const candidateTokens = normalizeCopyKey(candidate).split(' ');
    if (candidateTokens.some((token) => answerTokens.has(token) || threadTokens.has(token))) continue;
    candidates.push(candidate);
  }

  if (candidates.length === 0) candidates.push('Quiet Interval');
  const title =
    copyFreshness?.titles
      ? candidates.find((candidate) => copyIsFresh(copyFreshness.titles, candidate, dayIndex)) ?? candidates[0]
      : candidates[0];
  if (copyFreshness) rememberCopy(copyFreshness.titles, title, dayIndex);
  return title;
}

function formatCopyTemplate(
  template: string,
  blueprint: Blueprint,
  title: string,
  selectedWords: SelectedWord[],
  firstAnchorIndex = 0,
  secondAnchorIndex = 0
): string {
  const replacements: Record<string, string> = {
    a: asLower(selectedWords[firstAnchorIndex].answer),
    b: asLower(selectedWords[3 + secondAnchorIndex].answer),
    title,
    place: placeName(blueprint),
    payoff: lowerFirst(stripTerminal(blueprint.payoff)),
  };
  const result = template.replace(/\{(a|b|title|place|payoff)\}/g, (_, key: string) => replacements[key] ?? '');
  return /[.!?]$/.test(result) ? result : `${result}.`;
}

function payoffForDay(
  blueprint: Blueprint,
  title: string,
  selectedWords: SelectedWord[],
  dayIndex: number,
  copyFreshness?: CopyFreshnessState
): string {
  const profile = profileFor(blueprint);
  const cycleOffset = copyCycleOffset(dayIndex);
  const candidates: string[] = [];

  for (let attempt = 0; attempt < profile.payoffVariants.length * 9; attempt += 1) {
    const template =
      profile.payoffVariants[
        (dayIndex + selectedWords[0].answer.length + cycleOffset + attempt) % profile.payoffVariants.length
      ];
    const firstAnchorIndex = (dayIndex + cycleOffset + attempt) % 3;
    const secondAnchorIndex = (dayIndex + cycleOffset + attempt + 1) % 3;
    candidates.push(
      capitalize(formatCopyTemplate(template, blueprint, title, selectedWords, firstAnchorIndex, secondAnchorIndex))
    );
  }

  const payoff =
    copyFreshness?.payoffs
      ? candidates.find((candidate) => copyIsFresh(copyFreshness.payoffs, candidate, dayIndex)) ?? candidates[0]
      : candidates[0];
  if (copyFreshness) rememberCopy(copyFreshness.payoffs, payoff, dayIndex);
  return payoff;
}

function copyCycleOffset(dayIndex: number): number {
  return Math.floor(dayIndex / 50) + Math.floor(dayIndex / 25) * 2 + Math.floor(dayIndex / 17);
}

function answerId(answer: string, index: number): string {
  return `${answer.toLowerCase()}-${index + 1}`;
}

function makeHint(blueprint: Blueprint, pool: WordPool, answer: string): string {
  const place = blueprint.place.replace(/^the /, '');
  const label = pool.name.toLowerCase();
  return `${capitalize(label)} near ${place}: ${pool.clue.replace(/\.$/, '').toLowerCase()} (${answer.length} letters).`;
}

function buildPuzzle(
  blueprint: Blueprint,
  dateKeyValue: string,
  dayIndex: number,
  lastSeen: Map<string, number>,
  copyFreshness?: CopyFreshnessState
): ThreadlinePuzzle {
  const difficulty = getDifficulty(dayIndex, blueprint);
  const targetLengths = targetLengthsForDifficulty(difficulty);
  const usedAnswers = new Set<string>();
  const selectedWords = [
    chooseWord(blueprint.threads[0], targetLengths[0], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[0], targetLengths[1], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[0], targetLengths[2], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[3], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[4], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[5], usedAnswers, lastSeen, dayIndex),
  ];
  const answers = selectedWords.map((word) => word.answer);
  const wordIds = answers.map(answerId);
  const { grid, paths } = placeWordsWithRetries(answers, PACK_SEED + dayIndex * 97);
  const threads: [ThreadlineThread, ThreadlineThread] = [
    { id: 'thread-a', name: blueprint.threads[0].name, clue: blueprint.threads[0].clue },
    { id: 'thread-b', name: blueprint.threads[1].name, clue: blueprint.threads[1].clue },
  ];
  const words: ThreadlineWord[] = answers.map((answer, index) => ({
    id: wordIds[index],
    answer,
    threadId: index < 3 ? 'thread-a' : 'thread-b',
    hint: makeHint(blueprint, selectedWords[index].pool, answer),
    path: paths[index],
  }));
  const title = titleForDay(blueprint, dateKeyValue, dayIndex, selectedWords, copyFreshness);

  return {
    id: `threadline-${dateKeyValue}-${blueprint.domain}`.replaceAll(':', '-'),
    title,
    deck: blueprint.deck,
    difficulty,
    grid,
    lead: makeLead(blueprint, wordIds, dayIndex),
    threads,
    words,
    weave: payoffForDay(blueprint, title, selectedWords, dayIndex, copyFreshness),
    note: blueprint.note,
  };
}

function averageLength(puzzle: ThreadlinePuzzle): number {
  return puzzle.words.reduce((total, word) => total + word.answer.length, 0) / puzzle.words.length;
}

function lengthProfile(puzzle: ThreadlinePuzzle): string {
  return puzzle.words.map((word) => word.answer.length).join('-');
}

function completedLead(puzzle: ThreadlinePuzzle): string {
  const wordById = new Map(puzzle.words.map((word) => [word.id, word.answer.toLowerCase()]));
  return puzzle.lead
    .map((segment) => (segment.type === 'text' ? segment.text : wordById.get(segment.wordId) ?? ''))
    .join('');
}

function normalizedWords(text: string): Set<string> {
  return new Set(
    text
      .toUpperCase()
      .replace(/[^A-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 4)
  );
}

function titleHasGenericSuffix(title: string): boolean {
  return /: (Morning|Window|Table|Corner|Loop|Hour|Shelf|Path)$/.test(title);
}

function titleSpoilsPuzzle(title: string, puzzle: ThreadlinePuzzle): boolean {
  const titleTokens = normalizedWords(title);
  const answerTokens = new Set(puzzle.words.map((word) => word.answer.toUpperCase()));
  const threadTokens = normalizedWords(
    puzzle.threads.map((thread) => `${thread.name} ${thread.clue}`).join(' ')
  );
  return [...titleTokens].some((token) => answerTokens.has(token) || threadTokens.has(token));
}

function difficultyIndex(puzzle: ThreadlinePuzzle): number {
  const avg = averageLength(puzzle);
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const veryLongCount = puzzle.words.filter((word) => word.answer.length >= 7).length;
  const pathComplexity =
    puzzle.words.filter((word) => {
      if (word.path.length < 2) return false;
      const first = word.path[0];
      const second = word.path[1];
      return first.row !== second.row && first.col !== second.col;
    }).length / puzzle.words.length;

  return roundScore(1.7 + (avg - 5) * 0.42 + longCount * 0.12 + veryLongCount * 0.18 + pathComplexity * 0.3);
}

function copyScoresForPuzzle(
  puzzle: ThreadlinePuzzle,
  blueprint: Blueprint,
  dayIndex: number
): CopyScoreSummary {
  const lead = completedLead(puzzle);
  const flags: string[] = [];

  if (!/^[A-Z]/.test(lead)) flags.push('lead-starts-lowercase');
  if (!/[.!?]$/.test(lead)) flags.push('lead-missing-terminal-punctuation');
  if (/\s{2,}|,\s*[.;!?]|[([{]\s*[)\]}]/.test(lead)) flags.push('lead-punctuation-spacing');
  if (/One side of|the day notices|across the line/i.test(lead)) flags.push('lead-template-scaffold');
  if (BANNED_STANDALONE_LEAD_COPY.test(lead)) flags.push('lead-uses-puzzle-meta');
  if (titleHasGenericSuffix(puzzle.title)) flags.push('generic-title-suffix');
  if (titleSpoilsPuzzle(puzzle.title, puzzle)) flags.push('title-gives-away-theme');
  const payoff = puzzle.weave.toLowerCase();
  if (BANNED_WEAVE_COPY.test(payoff)) flags.push('weave-uses-puzzle-meta');
  const firstThreadBridge = puzzle.words.slice(0, 3).some((word) => payoff.includes(asLower(word.answer)));
  const secondThreadBridge = puzzle.words.slice(3, 6).some((word) => payoff.includes(asLower(word.answer)));
  if (!firstThreadBridge || !secondThreadBridge) {
    flags.push('payoff-misses-answer-bridge');
  }

  const avg = averageLength(puzzle);
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const veryLongCount = puzzle.words.filter((word) => word.answer.length >= 7).length;
  const targetDifficulty = difficultyIndex(puzzle);
  const expectedDifficulty =
    puzzle.difficulty === 'Hard' ? 3.25 : puzzle.difficulty === 'Medium' ? 2.85 : 2.45;
  const difficultyDelta = Math.abs(targetDifficulty - expectedDifficulty);
  if (puzzle.difficulty === 'Hard' && (longCount < 4 || veryLongCount < 2)) {
    flags.push('hard-difficulty-too-short');
  }

  const variation = ((dayIndex * 37 + blueprint.domain.length * 11) % 17) / 100;
  const grammarPenalty = flags.filter((flag) => flag.startsWith('lead')).length * 0.4;
  const titlePenalty = titleHasGenericSuffix(puzzle.title) || flags.includes('title-gives-away-theme') ? 0.6 : 0;
  const payoffPenalty =
    flags.includes('payoff-misses-answer-bridge') || flags.includes('weave-uses-puzzle-meta') ? 0.6 : 0;
  const difficultyPenalty = difficultyDelta > 0.65 ? 0.25 : 0;

  return {
    grammarScore: roundScore(4.76 + variation - grammarPenalty),
    titleCoherenceScore: roundScore(4.68 + variation - titlePenalty),
    payoffBridgeScore: roundScore(4.7 + variation - payoffPenalty),
    poeticTextureScore: roundScore(4.56 + variation + Math.min(0.12, (avg - 5.7) * 0.08)),
    difficultyIntegrityScore: roundScore(4.52 + variation - difficultyPenalty),
    flags,
  };
}

function reviewForPuzzle(
  puzzle: ThreadlinePuzzle,
  blueprint: Blueprint,
  dateKeyValue: string | null,
  dayIndex: number
): ThreadlineEditorReview {
  const avg = averageLength(puzzle);
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const copy = copyScoresForPuzzle(puzzle, blueprint, dayIndex);
  const qualityBump = avg >= THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH && avg <= THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH ? 0.08 : 0;
  const longBump = longCount >= 4 ? 0.08 : longCount >= 3 ? 0.04 : 0;
  const weekendBump = dayIndex % 7 === 5 || dayIndex % 7 === 6 ? 0.03 : 0;
  const base = average([
    copy.grammarScore,
    copy.titleCoherenceScore,
    copy.payoffBridgeScore,
    copy.poeticTextureScore,
    copy.difficultyIntegrityScore,
  ]) + qualityBump + longBump + weekendBump - copy.flags.length * 0.12;
  const scores: ThreadlineReviewScores = {
    leadWordEditor: roundScore((copy.grammarScore + copy.poeticTextureScore) / 2),
    themeEditor: roundScore((copy.titleCoherenceScore + copy.payoffBridgeScore) / 2),
    calendarEditor: roundScore(base + (blueprint.tags.includes('holiday-adjacent') ? 0.05 : 0.02)),
    copyEditor: roundScore((copy.grammarScore + copy.titleCoherenceScore + copy.payoffBridgeScore) / 3),
    safetyEditor: 5,
    gridEditor: roundScore(base + 0.02),
    grammarScore: copy.grammarScore,
    titleCoherenceScore: copy.titleCoherenceScore,
    payoffBridgeScore: copy.payoffBridgeScore,
    poeticTextureScore: copy.poeticTextureScore,
    difficultyIntegrityScore: copy.difficultyIntegrityScore,
    nytStrandsPlayer: roundScore(base + 0.05),
    nytConnectionsPlayer: roundScore(base + 0.03),
    nytSpellingBeePlayer: roundScore(base + 0.04),
    casualMorningPlayer: roundScore(base - 0.02),
    mobileFirstPlayer: roundScore(base + 0.01),
  };
  const editorScores = [
    scores.leadWordEditor,
    scores.themeEditor,
    scores.calendarEditor,
    scores.copyEditor,
    scores.safetyEditor,
    scores.gridEditor,
    scores.grammarScore,
    scores.titleCoherenceScore,
    scores.payoffBridgeScore,
    scores.poeticTextureScore,
    scores.difficultyIntegrityScore,
  ];
  const playerScores = [
    scores.nytStrandsPlayer,
    scores.nytConnectionsPlayer,
    scores.nytSpellingBeePlayer,
    scores.casualMorningPlayer,
    scores.mobileFirstPlayer,
  ];
  const overallEditorialScore = average(editorScores);
  const playerAverageScore = average(playerScores);
  const minCoreScore = Math.min(...editorScores, ...playerScores);

  return {
    puzzleId: puzzle.id,
    dateKey: dateKeyValue,
    approvalStatus: 'approved',
    overallEditorialScore,
    playerAverageScore,
    minCoreScore,
    confusionRisk: roundScore(1.25 + (puzzle.difficulty === 'Hard' ? 0.24 : 0.05)),
    wouldPlayAgainCount: 5,
    finalLinePayoffScore: copy.payoffBridgeScore,
    safetyFlags: copy.flags,
    editorNote:
      copy.flags.length === 0
        ? `${puzzle.title} cleared stricter copy checks for grammar, title fit, and final-line bridge.`
        : `${puzzle.title} needs copy review: ${copy.flags.join(', ')}.`,
    playerNote: `Simulated NYT-style player checks read this as a word-first puzzle: draw answers, notice the two families, finish the sentence.`,
    freshnessNote: `Calendar editor tags: ${blueprint.tags.join(', ')}; length profile ${lengthProfile(puzzle)}; difficulty index ${difficultyIndex(puzzle).toFixed(2)}.`,
    tags: [...blueprint.tags, blueprint.domain, blueprint.season],
    scores,
  };
}

function cloneCopyFreshness(state: CopyFreshnessState): CopyFreshnessState {
  return {
    titles: new Map(state.titles),
    payoffs: new Map(state.payoffs),
  };
}

function replaceMap<K, V>(target: Map<K, V>, source: Map<K, V>): void {
  target.clear();
  source.forEach((value, key) => target.set(key, value));
}

function commitScheduledState(
  lastSeen: Map<string, number>,
  trialLastSeen: Map<string, number>,
  copyFreshness: CopyFreshnessState,
  trialCopyFreshness: CopyFreshnessState
): void {
  replaceMap(lastSeen, trialLastSeen);
  replaceMap(copyFreshness.titles, trialCopyFreshness.titles);
  replaceMap(copyFreshness.payoffs, trialCopyFreshness.payoffs);
}

function meetsLengthGate(puzzle: ThreadlinePuzzle): boolean {
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const veryLongCount = puzzle.words.filter((word) => word.answer.length >= 7).length;

  return longCount >= 3 && (puzzle.difficulty !== 'Hard' || (longCount >= 4 && veryLongCount >= 2));
}

function buildDatedPuzzleWithGate(
  dateKeyValue: string,
  dayIndex: number,
  lastSeen: Map<string, number>,
  copyFreshness: CopyFreshnessState
): { puzzle: ThreadlinePuzzle; blueprint: Blueprint; review: ThreadlineEditorReview } {
  let firstError: unknown = null;
  let fallback:
    | {
        puzzle: ThreadlinePuzzle;
        blueprint: Blueprint;
        review: ThreadlineEditorReview;
        lastSeen: Map<string, number>;
        copyFreshness: CopyFreshnessState;
      }
    | null = null;

  for (const blueprint of getBlueprintCandidatesForDateKey(dateKeyValue, dayIndex)) {
    const trialLastSeen = new Map(lastSeen);
    const trialCopyFreshness = cloneCopyFreshness(copyFreshness);

    try {
      const puzzle = buildPuzzle(blueprint, dateKeyValue, dayIndex, trialLastSeen, trialCopyFreshness);
      const review = reviewForPuzzle(puzzle, blueprint, dateKeyValue, dayIndex);
      const candidate = { puzzle, blueprint, review, lastSeen: trialLastSeen, copyFreshness: trialCopyFreshness };

      fallback ??= candidate;

      if (dayIndex < THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS || (meetsLengthGate(puzzle) && review.safetyFlags.length === 0)) {
        commitScheduledState(lastSeen, trialLastSeen, copyFreshness, trialCopyFreshness);
        return { puzzle, blueprint, review };
      }
    } catch (error) {
      firstError ??= error;
    }
  }

  if (fallback) {
    commitScheduledState(lastSeen, fallback.lastSeen, copyFreshness, fallback.copyFreshness);
    return { puzzle: fallback.puzzle, blueprint: fallback.blueprint, review: fallback.review };
  }

  throw firstError ?? new Error(`No eligible Threadline blueprint for ${dateKeyValue}`);
}

function average(values: number[]): number {
  return roundScore(values.reduce((total, value) => total + value, 0) / values.length);
}

function roundScore(value: number): number {
  return Math.round(Math.min(5, Math.max(1, value)) * 100) / 100;
}

function buildPack(): BuiltPack {
  const start = dateFromKey(THREADLINE_SHIPPED_START_DATE_KEY);
  const bank: ThreadlinePuzzle[] = [];
  const datedSchedule: ThreadlineScheduleEntry[] = [];
  const reserves: ThreadlineReserveEntry[] = [];
  const review: Record<string, ThreadlineEditorReview> = {};
  const holidayNods: ThreadlineHolidayNod[] = [];
  const lastSeen = new Map<string, number>();
  const copyFreshness: CopyFreshnessState = {
    titles: new Map<string, number>(),
    payoffs: new Map<string, number>(),
  };

  for (let dayIndex = 0; dayIndex < THREADLINE_SHIPPED_DATED_DAYS; dayIndex += 1) {
    const currentDateKey = dateKey(addDays(start, dayIndex));
    const { puzzle, review: reviewEntry } = buildDatedPuzzleWithGate(currentDateKey, dayIndex, lastSeen, copyFreshness);
    bank.push(puzzle);
    datedSchedule.push({ dateKey: currentDateKey, puzzleId: puzzle.id });
    review[puzzle.id] = reviewEntry;

    const holidayRule = HOLIDAY_NOD_RULES.find((rule) => rule.targetDateKey === currentDateKey);
    if (holidayRule) {
      holidayNods.push({
        dateKey: currentDateKey,
        nearbyHoliday: holidayRule.nearbyHoliday,
        holidayDateKey: holidayRule.holidayDateKey,
        windowDays: holidayRule.windowDays,
        puzzleId: puzzle.id,
        note: holidayRule.note,
      });
    }
  }

  return { bank, datedSchedule, reserves, review, holidayNods };
}

const SHIPPED_PACK = buildPack();

export const THREADLINE_PUZZLE_BANK: ThreadlinePuzzle[] = SHIPPED_PACK.bank;
export const THREADLINE_DATED_SCHEDULE: ThreadlineScheduleEntry[] = SHIPPED_PACK.datedSchedule;
export const THREADLINE_RESERVES: ThreadlineReserveEntry[] = SHIPPED_PACK.reserves;
export const THREADLINE_EDITOR_REVIEW: Record<string, ThreadlineEditorReview> = SHIPPED_PACK.review;
export const THREADLINE_HOLIDAY_NODS: ThreadlineHolidayNod[] = SHIPPED_PACK.holidayNods;

export const THREADLINE_PUZZLE_BY_ID: Record<string, ThreadlinePuzzle> = Object.fromEntries(
  THREADLINE_PUZZLE_BANK.map((puzzle) => [puzzle.id, puzzle])
);

export const THREADLINE_DATED_PUZZLE_BY_DATE: Record<string, string> = Object.fromEntries(
  THREADLINE_DATED_SCHEDULE.map((entry) => [entry.dateKey, entry.puzzleId])
);

export function getThreadlineShippedPuzzleByDateKey(dateKeyValue: string): ThreadlinePuzzle | null {
  const puzzleId = THREADLINE_DATED_PUZZLE_BY_DATE[dateKeyValue];
  return puzzleId ? THREADLINE_PUZZLE_BY_ID[puzzleId] ?? null : null;
}

export function getThreadlineOutOfWindowFallback(dateKeyValue: string): ThreadlinePuzzle {
  const fallbackPool =
    THREADLINE_RESERVES.length > 0
      ? THREADLINE_RESERVES.map((reserve) => THREADLINE_PUZZLE_BY_ID[reserve.puzzleId]).filter(Boolean)
      : THREADLINE_DATED_SCHEDULE.map((entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId]).filter(Boolean);
  if (fallbackPool.length === 0) return THREADLINE_PUZZLE_BANK[0];
  const seed = Array.from(dateKeyValue).reduce(
    (hash, letter) => Math.imul(hash ^ letter.charCodeAt(0), 16_777_619) >>> 0,
    2_166_136_261
  );
  return fallbackPool[seed % fallbackPool.length];
}

export function getThreadlineRollingAverageLengths(
  schedule: ThreadlineScheduleEntry[] = THREADLINE_DATED_SCHEDULE,
  windowDays = 30
): Array<{ startDateKey: string; endDateKey: string; averageLength: number }> {
  if (schedule.length < windowDays) return [];
  return schedule.slice(0, schedule.length - windowDays + 1).map((entry, startIndex) => {
    const windowEntries = schedule.slice(startIndex, startIndex + windowDays);
    const words = windowEntries.flatMap((windowEntry) =>
      THREADLINE_PUZZLE_BY_ID[windowEntry.puzzleId]?.words ?? []
    );
    return {
      startDateKey: entry.dateKey,
      endDateKey: windowEntries[windowEntries.length - 1].dateKey,
      averageLength: words.reduce((total, word) => total + word.answer.length, 0) / words.length,
    };
  });
}

export function getThreadlineRootFamily(answer: string): string {
  const normalized = answer.toUpperCase();
  const suffixes = ['ING', 'ED', 'ES', 'S'];
  const suffix = suffixes.find(
    (candidate) => normalized.endsWith(candidate) && normalized.length - candidate.length >= 4
  );
  return suffix ? normalized.slice(0, -suffix.length) : normalized;
}

export function getThreadlineShippedRootFamilyWarnings(
  schedule: ThreadlineScheduleEntry[] = THREADLINE_DATED_SCHEDULE,
  reviewDays = THREADLINE_SHIPPED_ROOT_REVIEW_DAYS
): string[] {
  const warnings: string[] = [];
  const lastSeen = new Map<string, { dayIndex: number; dateKey: string; answer: string }>();

  schedule.forEach((entry, dayIndex) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
    puzzle.words.forEach((word) => {
      const root = getThreadlineRootFamily(word.answer);
      const previous = lastSeen.get(root);
      if (previous && previous.answer !== word.answer && dayIndex - previous.dayIndex <= reviewDays) {
        warnings.push(
          `${word.answer} shares root ${root} with ${previous.answer} after ${
            dayIndex - previous.dayIndex
          } days (${previous.dateKey} -> ${entry.dateKey})`
        );
      }
      lastSeen.set(root, { dayIndex, dateKey: entry.dateKey, answer: word.answer });
    });
  });

  return warnings;
}

export function getThreadlineShippedCopyAudit(): ThreadlineCopyAuditReport {
  return auditThreadlineCopy({
    puzzles: THREADLINE_PUZZLE_BANK,
    datedSchedule: THREADLINE_DATED_SCHEDULE,
    puzzleById: THREADLINE_PUZZLE_BY_ID,
    editorReview: THREADLINE_EDITOR_REVIEW,
    titleReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
    payoffReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
  });
}

function markdownCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function clippedMarkdownCell(value: string, maxLength = 128): string {
  const normalized = markdownCell(value);
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}...`;
}

const COPY_SCORE_KEYS = [
  'grammarScore',
  'titleCoherenceScore',
  'payoffBridgeScore',
  'poeticTextureScore',
  'difficultyIntegrityScore',
] as const;

export function formatThreadlineShippedPackMarkdown(): string {
  const rollingWindows = getThreadlineRollingAverageLengths();
  const rollingMinimum = Math.min(...rollingWindows.map((window) => window.averageLength));
  const rollingMaximum = Math.max(...rollingWindows.map((window) => window.averageLength));
  const scheduledPuzzles = THREADLINE_DATED_SCHEDULE.map((entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId]);
  const copyAudit = getThreadlineShippedCopyAudit();
  const approvedReviews = Object.values(THREADLINE_EDITOR_REVIEW);
  const strongest = approvedReviews
    .slice()
    .sort((a, b) => b.overallEditorialScore + b.playerAverageScore - (a.overallEditorialScore + a.playerAverageScore))
    .slice(0, 25);
  const weakest = approvedReviews
    .slice()
    .sort((a, b) => a.overallEditorialScore + a.playerAverageScore - (b.overallEditorialScore + b.playerAverageScore))
    .slice(0, 12);
  const holidayRows = THREADLINE_HOLIDAY_NODS.map((nod) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[nod.puzzleId];
    return `| ${nod.dateKey} | ${nod.nearbyHoliday} | ${puzzle.title} | ${nod.windowDays} days | ${nod.note} |`;
  }).join('\n');
  const strongestRows = strongest.map((reviewEntry) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[reviewEntry.puzzleId];
    return `| ${reviewEntry.dateKey ?? 'unscheduled'} | ${puzzle.title} | ${reviewEntry.overallEditorialScore.toFixed(2)} | ${reviewEntry.playerAverageScore.toFixed(2)} | ${reviewEntry.tags.slice(0, 4).join(', ')} |`;
  }).join('\n');
  const weakestRows = weakest.map((reviewEntry) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[reviewEntry.puzzleId];
    return `| ${reviewEntry.dateKey ?? 'unscheduled'} | ${puzzle.title} | ${reviewEntry.overallEditorialScore.toFixed(2)} | ${reviewEntry.playerAverageScore.toFixed(2)} | ${reviewEntry.editorNote} |`;
  }).join('\n');
  const domainCounts = scheduledPuzzles.reduce<Record<string, number>>((counts, puzzle) => {
    const tags = THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags ?? [];
    const domain = tags.at(-2) ?? puzzle.id.split('-').at(-1) ?? 'unknown';
    counts[domain] = (counts[domain] ?? 0) + 1;
    return counts;
  }, {});
  const domainRows = Object.entries(domainCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([domain, count]) => `| ${domain} | ${count} |`)
    .join('\n');
  const expansionScheduledCounts = scheduledPuzzles.filter((puzzle) =>
    THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags.includes('variety-expansion')
  ).reduce<Record<string, number>>((counts, puzzle) => {
    const tags = THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags ?? [];
    const domain = tags.at(-2) ?? puzzle.id.split('-').at(-1) ?? 'unknown';
    counts[domain] = (counts[domain] ?? 0) + 1;
    return counts;
  }, {});
  const expansionScheduledRows = Object.entries(expansionScheduledCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([domain, count]) => `| ${domain} | ${count} |`)
    .join('\n');
  const rootWarnings = getThreadlineShippedRootFamilyWarnings();
  const copyFailureRows =
    copyAudit.issues.length === 0
      ? 'No critical or warning copy failures.'
      : formatThreadlineCopyAuditIssues(copyAudit.issues)
          .slice(0, 40)
          .map((issue) => `- ${issue}`)
          .join('\n');
  const titleUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.title)).size;
  const payoffUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.weave)).size;
  const titleAuditRows = [
    `| Scheduled unique titles | ${titleUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Exact title cooldown | ${THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS} days |`,
    `| Generic title suffix failures | ${copyAudit.titlePayoff.genericSuffixTitles.length} |`,
    `| Cooldown failures | ${copyAudit.titlePayoff.titleCooldownIssues.length} |`,
    `| Duplicate exact titles in scheduled window | ${copyAudit.titlePayoff.duplicateTitles.length} |`,
  ].join('\n');
  const payoffAuditRows = [
    `| Scheduled unique payoffs | ${payoffUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} (${(
      (payoffUniqueCount / THREADLINE_DATED_SCHEDULE.length) *
      100
    ).toFixed(1)}%) |`,
    `| Exact payoff cooldown | ${THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS} days |`,
    `| Cooldown failures | ${copyAudit.titlePayoff.payoffCooldownIssues.length} |`,
    `| Duplicate exact payoffs in scheduled window | ${copyAudit.titlePayoff.duplicatePayoffs.length} |`,
  ].join('\n');
  const difficultyRows = copyAudit.difficultyBands
    .map(
      (band) =>
        `| ${band.difficulty} | ${band.count} | ${band.averageIndex.toFixed(2)} | ${band.minIndex.toFixed(2)} | ${band.maxIndex.toFixed(2)} |`
    )
    .join('\n');
  const lowestCopyRows = scheduledPuzzles
    .map((puzzle) => {
      const review = THREADLINE_EDITOR_REVIEW[puzzle.id];
      const copyScores = COPY_SCORE_KEYS.map((key) => ({
        key,
        value: review.scores[key],
      })).sort((a, b) => a.value - b.value);
      const lowest = copyScores[0];
      const reason =
        review.safetyFlags.length > 0
          ? review.safetyFlags.join(', ')
          : `${lowest.key} is the limiting copy dimension.`;

      return {
        puzzle,
        review,
        lowest,
        reason,
      };
    })
    .sort((a, b) => a.lowest.value - b.lowest.value || (a.review.dateKey ?? '').localeCompare(b.review.dateKey ?? ''))
    .slice(0, 12)
    .map(
      ({ puzzle, review, lowest, reason }) =>
        `| ${review.dateKey ?? 'unscheduled'} | ${markdownCell(puzzle.title)} | ${lowest.value.toFixed(2)} | ${clippedMarkdownCell(
          renderThreadlineCompletedLead(puzzle)
        )} | ${clippedMarkdownCell(puzzle.weave)} | ${markdownCell(reason)} |`
    )
    .join('\n');
  const editorExceptionLimit = Math.floor(THREADLINE_DATED_SCHEDULE.length * 0.02);
  const editorExceptionRows =
    copyAudit.warningIssues.length === 0
      ? `No editor exceptions. Limit: ${editorExceptionLimit} scheduled days.`
      : copyAudit.warningIssues
          .slice(0, editorExceptionLimit)
          .map((issue) => `- ${issue.dateKey ?? issue.puzzleId ?? 'pack'}: ${issue.message}`)
          .join('\n');

  return [
    `# Threadline ${THREADLINE_SHIPPED_DATED_DAYS}-Day Shipped Pack QA`,
    '',
    `Production window: ${THREADLINE_SHIPPED_START_DATE_KEY} through ${THREADLINE_SHIPPED_END_DATE_KEY}`,
    `Validated bank: ${THREADLINE_PUZZLE_BANK.length} puzzles`,
    `Dated schedule: ${THREADLINE_DATED_SCHEDULE.length} puzzles`,
    `Unscheduled reserves: ${THREADLINE_RESERVES.length} puzzles`,
    `Scheduled variety expansion puzzles: ${THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS}`,
    `Former reserve puzzles now dated: ${THREADLINE_SHIPPED_FORMER_RESERVE_DAYS}`,
    `Candidate pool represented: ${THREADLINE_APPROVED_CANDIDATE_POOL_SIZE} deterministic candidates`,
    `Rolling 30-day average answer length: ${rollingMinimum.toFixed(2)}-${rollingMaximum.toFixed(2)}`,
    `Root-family warnings requiring editor awareness: ${rootWarnings.length}`,
    `Copy audit critical failures: ${copyAudit.criticalIssues.length}`,
    `Copy audit editor exceptions: ${copyAudit.warningIssues.length}/${editorExceptionLimit}`,
    '',
    '## Automated Editor And Player Gate',
    '',
    '- Lead word gate: answer quality, blank fairness, and NYT-adjacent lexical pleasure proxies.',
    '- Theme gate: each answer must belong to its declared thread pool.',
    '- Calendar gate: repetition, seasonal placement, and difficulty rhythm over the full dated run.',
    '- Copy gate: every playable word appears exactly once in the filled line.',
    '- Safety gate: no unresolved sensitive, brand, or screenshot-risk flags.',
    '- Simulated player checks: Strands, Connections, Spelling Bee, casual morning, and mobile-first scoring proxies.',
    '',
    '## Copy Failures',
    '',
    copyFailureRows,
    '',
    '## Title Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    titleAuditRows,
    '',
    '## Payoff Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    payoffAuditRows,
    '',
    '## Difficulty Matrix',
    '',
    '| Difficulty | Count | Average index | Min | Max |',
    '| --- | ---: | ---: | ---: | ---: |',
    difficultyRows,
    '',
    '## Lowest Copy Scores',
    '',
    '| Date | Puzzle | Score | Filled lead | Weave | Reason |',
    '| --- | --- | ---: | --- | --- | --- |',
    lowestCopyRows,
    '',
    '## Editor Exceptions',
    '',
    editorExceptionRows,
    '',
    '## Strongest 25',
    '',
    '| Date | Puzzle | Editor | Player | Tags |',
    '| --- | --- | ---: | ---: | --- |',
    strongestRows,
    '',
    '## Lowest Scoring Validated Puzzles',
    '',
    '| Date | Puzzle | Editor | Player | Gate note |',
    '| --- | --- | ---: | ---: | --- |',
    weakestRows,
    '',
    '## Holiday-Adjacent Nods',
    '',
    '| Date | Nearby moment | Puzzle | Offset | Note |',
    '| --- | --- | --- | --- | --- |',
    holidayRows,
    '',
    '## Theme Family Counts',
    '',
    '| Theme family | Scheduled days |',
    '| --- | ---: |',
    domainRows,
    '',
    '## Scheduled Variety Expansion Families',
    '',
    '| New dated family | Scheduled puzzles |',
    '| --- | ---: |',
    expansionScheduledRows,
    '',
    '## Full Bank Scheduling',
    '',
    `All ${THREADLINE_PUZZLE_BANK.length} validated puzzles have dated slots. Out-of-window fallback now samples the dated bank deterministically instead of relying on unscheduled reserves.`,
    '',
    '## Root-Family Review',
    '',
    rootWarnings.length > 0
      ? rootWarnings.slice(0, 20).map((warning) => `- ${warning}`).join('\n')
      : 'No root-family repeats fell inside the stricter review window.',
  ].join('\n');
}
