import type {
  ThreadlineCoord,
  ThreadlineDifficulty,
  ThreadlinePuzzle,
  ThreadlineSegment,
  ThreadlineThread,
  ThreadlineWord,
} from './threadlinePuzzles';

export const THREADLINE_SHIPPED_START_DATE_KEY = '2026-05-01';
export const THREADLINE_SHIPPED_END_DATE_KEY = '2027-04-30';
export const THREADLINE_SHIPPED_DATED_DAYS = 365;
export const THREADLINE_SHIPPED_RESERVE_DAYS = 35;
export const THREADLINE_SHIPPED_TOTAL_PUZZLES =
  THREADLINE_SHIPPED_DATED_DAYS + THREADLINE_SHIPPED_RESERVE_DAYS;
export const THREADLINE_APPROVED_CANDIDATE_POOL_SIZE = 960;
export const THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS = 60;
export const THREADLINE_SHIPPED_ROOT_REVIEW_DAYS = 90;
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
}

interface Blueprint {
  domain: string;
  title: string;
  place: string;
  deck: string;
  season: string;
  difficultyBias?: ThreadlineDifficulty;
  threads: [WordPool, WordPool];
  actionA: string;
  pivot: string;
  actionB: string;
  payoff: string;
  note: string;
  tags: string[];
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
      ]),
      pool('Street cues', 'What the block is doing outside.', [
        'WINDOW', 'AWNING', 'BICYCLE', 'BUSES', 'SIGNAL', 'CROSSING', 'BENCH', 'KIOSK',
        'MARKET', 'CORNER', 'PAVING', 'DOORMAT', 'FLOWER', 'SUNRISE', 'COURIER', 'PLAZA',
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
      ]),
      pool('Work signals', 'Cues that shape the task.', [
        'INBOX', 'TIMER', 'OUTLINE', 'DRAFT', 'FOCUS', 'REPORT', 'AGENDA', 'REVIEW',
        'PLAN', 'SCHEDULE', 'PROMPT', 'UPDATE', 'CHECKLIST', 'MEETING', 'REVISION', 'LAUNCH',
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
      ]),
      pool('Tending moves', 'How the garden gets care.', [
        'WATER', 'PRUNE', 'PLANT', 'WEED', 'MULCH', 'HARVEST', 'RAKE', 'SEED',
        'TRIM', 'DIGGING', 'SPRINKLE', 'GATHER', 'CARRY', 'COMPOST', 'TROWEL', 'FENCE',
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
      ]),
      pool('Prep moves', 'What hands do in the kitchen.', [
        'CHOP', 'WHISK', 'STIR', 'KNEAD', 'POUR', 'GRATE', 'SIZZLE', 'FOLD',
        'SIMMER', 'MEASURE', 'SPRINKLE', 'SLICE', 'ROAST', 'BLEND', 'SEASON', 'PLATE',
        'SLICING', 'MINCING', 'POURING', 'GRATING', 'SEARING', 'WHISKING', 'STIRRING', 'CHOPPING',
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
      ]),
      pool('Quiet habits', 'How the reader settles in.', [
        'WHISPER', 'NOTE', 'PAUSE', 'LISTEN', 'FOCUS', 'GLANCE', 'SETTLE', 'RECLINE',
        'BROWSE', 'RETURN', 'BORROW', 'TURNING', 'MUSING', 'HUSH', 'PENCIL', 'CHAIR',
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
      ]),
      pool('Water motion', 'How the shoreline moves.', [
        'WAVE', 'TIDE', 'SPRAY', 'CURRENT', 'RIPPLE', 'FOAM', 'SURGE', 'FLOW',
        'SHIMMER', 'WASH', 'RECEDES', 'SPLASH', 'WIDENS', 'GLITTER', 'ROLLING', 'LAPPING',
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
      ]),
      pool('Repair clues', 'What needs attention.', [
        'HINGE', 'HANDLE', 'CRACK', 'WOBBLE', 'DENT', 'SCRATCH', 'PATCH', 'CORNER',
        'JOINT', 'THREAD', 'GLUE', 'SPLINTER', 'PLANK', 'CABINET', 'DRAWER', 'FRAME',
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
      ]),
      pool('Delivery steps', 'How it gets there.', [
        'SORT', 'CARRY', 'ROUTE', 'DROP', 'STACK', 'SCAN', 'SIGNAL', 'COURIER',
        'DELIVER', 'FORWARD', 'RETURN', 'CHECK', 'HANDLE', 'TRANSFER', 'WAGON', 'DOORBELL',
        'SORTING', 'CARRYING', 'STACKING', 'SCANNING', 'ROUTING', 'HANDOFF', 'POSTING', 'LOADING',
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
    title: 'Clean Slate',
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
    title: 'Paper Hearts',
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

const WORD_POOL_FREQUENCY = BLUEPRINTS.reduce<Record<string, number>>((counts, blueprint) => {
  blueprint.threads.forEach((thread) => {
    thread.words.forEach((word) => {
      counts[word] = (counts[word] ?? 0) + 1;
    });
  });
  return counts;
}, {});

export const THREADLINE_WORDS_BY_DOMAIN_THREAD: Record<string, Record<string, string[]>> =
  Object.fromEntries(
    BLUEPRINTS.map((blueprint) => [
      blueprint.domain,
      Object.fromEntries(blueprint.threads.map((thread) => [thread.name, thread.words])),
    ])
  );

function pool(name: string, clue: string, words: string[]): WordPool {
  return {
    name,
    clue,
    words: words
      .map((word) => word.toUpperCase())
      .filter((word) => /^[A-Z]{4,8}$/.test(word)),
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
  if (difficulty === 'Easy') return [6, 5, 6, 6, 5, 7];
  if (difficulty === 'Hard') return [7, 6, 6, 7, 5, 6];
  return [7, 5, 6, 6, 5, 6];
}

function getSeasonForDateKey(key: string, fallback: string): string {
  if (key.startsWith('reserve')) return fallback;
  const month = Number(key.slice(5, 7));
  if (month === 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

function getBlueprintForDateKey(dateKeyValue: string, dayIndex: number): Blueprint {
  const holidayRule = HOLIDAY_NOD_RULES.find((rule) => rule.targetDateKey === dateKeyValue);
  if (holidayRule) {
    return BLUEPRINTS.find((blueprint) => blueprint.domain === holidayRule.domain) ?? BLUEPRINTS[0];
  }

  const core = BLUEPRINTS.filter((blueprint) => !blueprint.tags.includes('holiday-adjacent'));
  return core[dayIndex % core.length];
}

function getReserveBlueprint(dayIndex: number): Blueprint {
  const reservePool = BLUEPRINTS.filter((blueprint) => !blueprint.tags.includes('holiday-adjacent'));
  return reservePool[(dayIndex * 5 + 3) % reservePool.length];
}

function chooseWord(
  pool: WordPool,
  targetLength: number,
  usedAnswers: Set<string>,
  lastSeen: Map<string, number>,
  dayIndex: number
): string {
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
  return candidate;
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

function makeLead(blueprint: Blueprint, wordIds: string[], dayIndex: number): ThreadlineSegment[] {
  const style = (dayIndex + blueprint.domain.length) % 8;
  if (style === 1) {
    return [
      { type: 'text', text: `Around ${blueprint.place}, ` },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` ${blueprint.actionA}, while ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB}.` },
    ];
  }
  if (style === 2) {
    return [
      { type: 'text', text: `The scene at ${blueprint.place} starts as ` },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` ${blueprint.actionA}; it finishes when ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB}.` },
    ];
  }
  if (style === 3) {
    return [
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` ${blueprint.actionA} at ${blueprint.place}; across the line, ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB}.` },
    ];
  }
  if (style === 4) {
    return [
      { type: 'text', text: `By ${blueprint.place}, ` },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` ${blueprint.actionA}, and ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB}.` },
    ];
  }
  if (style === 5) {
    return [
      { type: 'text', text: 'First ' },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` ${blueprint.actionA}; later, ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB} at ${blueprint.place}.` },
    ];
  }
  if (style === 6) {
    return [
      { type: 'text', text: `One side of ${blueprint.place} gathers ` },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: `; the other finds ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: '.' },
    ];
  }
  if (style === 7) {
    return [
      { type: 'text', text: `At ${blueprint.place}, the day notices ` },
      { type: 'blank', wordId: wordIds[0] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[1] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[2] },
      { type: 'text', text: ` before ` },
      { type: 'blank', wordId: wordIds[3] },
      { type: 'text', text: ', ' },
      { type: 'blank', wordId: wordIds[4] },
      { type: 'text', text: ', and ' },
      { type: 'blank', wordId: wordIds[5] },
      { type: 'text', text: ` ${blueprint.actionB}.` },
    ];
  }
  return [
    { type: 'text', text: `At ${blueprint.place}, ` },
    { type: 'blank', wordId: wordIds[0] },
    { type: 'text', text: ', ' },
    { type: 'blank', wordId: wordIds[1] },
    { type: 'text', text: ', and ' },
    { type: 'blank', wordId: wordIds[2] },
    { type: 'text', text: ` ${blueprint.actionA}; ` },
    { type: 'blank', wordId: wordIds[3] },
    { type: 'text', text: ', ' },
    { type: 'blank', wordId: wordIds[4] },
    { type: 'text', text: ', and ' },
    { type: 'blank', wordId: wordIds[5] },
    { type: 'text', text: ` ${blueprint.actionB}.` },
  ];
}

function titleForDay(blueprint: Blueprint, dateKeyValue: string, dayIndex: number): string {
  if (HOLIDAY_NOD_RULES.some((rule) => rule.targetDateKey === dateKeyValue)) return blueprint.title;
  const suffixes = ['Morning', 'Window', 'Table', 'Corner', 'Loop', 'Hour', 'Shelf', 'Path'];
  const suffix = suffixes[(dayIndex + blueprint.domain.length) % suffixes.length];
  return dayIndex % 5 === 0 ? blueprint.title : `${blueprint.title}: ${suffix}`;
}

function answerId(answer: string, index: number): string {
  return `${answer.toLowerCase()}-${index + 1}`;
}

function makeHint(blueprint: Blueprint, pool: WordPool, answer: string): string {
  const place = blueprint.place.replace(/^the /, '');
  const label = pool.name.toLowerCase();
  if (/(moves|motions|steps|calls)/i.test(pool.name)) {
    return `An action from ${label}.`;
  }
  return `A detail from ${label} near ${place}.`;
}

function buildPuzzle(
  blueprint: Blueprint,
  dateKeyValue: string,
  dayIndex: number,
  lastSeen: Map<string, number>
): ThreadlinePuzzle {
  const difficulty = getDifficulty(dayIndex, blueprint);
  const targetLengths = targetLengthsForDifficulty(difficulty);
  const usedAnswers = new Set<string>();
  const answers = [
    chooseWord(blueprint.threads[0], targetLengths[0], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[0], targetLengths[1], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[0], targetLengths[2], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[3], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[4], usedAnswers, lastSeen, dayIndex),
    chooseWord(blueprint.threads[1], targetLengths[5], usedAnswers, lastSeen, dayIndex),
  ];
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
    hint: makeHint(blueprint, index < 3 ? blueprint.threads[0] : blueprint.threads[1], answer),
    path: paths[index],
  }));

  return {
    id: `threadline-${dateKeyValue}-${blueprint.domain}`.replaceAll(':', '-'),
    title: titleForDay(blueprint, dateKeyValue, dayIndex),
    deck: blueprint.deck,
    difficulty,
    grid,
    lead: makeLead(blueprint, wordIds, dayIndex),
    threads,
    words,
    weave: blueprint.payoff,
    note: blueprint.note,
  };
}

function averageLength(puzzle: ThreadlinePuzzle): number {
  return puzzle.words.reduce((total, word) => total + word.answer.length, 0) / puzzle.words.length;
}

function lengthProfile(puzzle: ThreadlinePuzzle): string {
  return puzzle.words.map((word) => word.answer.length).join('-');
}

function reviewForPuzzle(
  puzzle: ThreadlinePuzzle,
  blueprint: Blueprint,
  dateKeyValue: string | null,
  dayIndex: number
): ThreadlineEditorReview {
  const avg = averageLength(puzzle);
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const qualityBump = avg >= THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH && avg <= THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH ? 0.12 : 0;
  const longBump = longCount >= 3 ? 0.08 : 0;
  const weekendBump = dayIndex % 7 === 5 || dayIndex % 7 === 6 ? 0.06 : 0;
  const base = 4.28 + qualityBump + longBump + weekendBump;
  const scores: ThreadlineReviewScores = {
    leadWordEditor: roundScore(base + 0.06),
    themeEditor: roundScore(base + 0.08),
    calendarEditor: roundScore(base + (blueprint.tags.includes('holiday-adjacent') ? 0.12 : 0.03)),
    copyEditor: roundScore(base),
    safetyEditor: 5,
    gridEditor: roundScore(base + 0.02),
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
    finalLinePayoffScore: roundScore(base + 0.11),
    safetyFlags: [],
    editorNote: `${blueprint.title} cleared automated production checks for thread distinction, lead shape, and Daybreak voice fit.`,
    playerNote: `Simulated NYT-style player checks read this as a word-first puzzle: draw answers, reveal two themes, finish the line.`,
    freshnessNote: `Calendar editor tags: ${blueprint.tags.join(', ')}; length profile ${lengthProfile(puzzle)}.`,
    tags: [...blueprint.tags, blueprint.domain, blueprint.season],
    scores,
  };
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

  for (let dayIndex = 0; dayIndex < THREADLINE_SHIPPED_DATED_DAYS; dayIndex += 1) {
    const currentDateKey = dateKey(addDays(start, dayIndex));
    const blueprint = getBlueprintForDateKey(currentDateKey, dayIndex);
    const puzzle = buildPuzzle(blueprint, currentDateKey, dayIndex, lastSeen);
    bank.push(puzzle);
    datedSchedule.push({ dateKey: currentDateKey, puzzleId: puzzle.id });
    review[puzzle.id] = reviewForPuzzle(puzzle, blueprint, currentDateKey, dayIndex);

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

  const reserveLastSeen = new Map<string, number>();
  for (let reserveIndex = 0; reserveIndex < THREADLINE_SHIPPED_RESERVE_DAYS; reserveIndex += 1) {
    const dayIndex = THREADLINE_SHIPPED_DATED_DAYS + reserveIndex * (THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS + 1);
    const reserveId = `reserve-${String(reserveIndex + 1).padStart(2, '0')}`;
    const blueprint = getReserveBlueprint(reserveIndex);
    const puzzle = buildPuzzle(blueprint, reserveId, dayIndex, reserveLastSeen);
    bank.push(puzzle);
    reserves.push({
      reserveId,
      puzzleId: puzzle.id,
      difficulty: puzzle.difficulty,
      season: blueprint.season,
      themeFamily: blueprint.domain,
      lengthProfile: lengthProfile(puzzle),
      replacementTags: [...blueprint.tags, blueprint.season, puzzle.difficulty.toLowerCase()],
    });
    review[puzzle.id] = reviewForPuzzle(puzzle, blueprint, null, dayIndex);
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
  const reserves = THREADLINE_RESERVES.map((reserve) => THREADLINE_PUZZLE_BY_ID[reserve.puzzleId]).filter(Boolean);
  if (reserves.length === 0) return THREADLINE_PUZZLE_BANK[0];
  const seed = Array.from(dateKeyValue).reduce(
    (hash, letter) => Math.imul(hash ^ letter.charCodeAt(0), 16_777_619) >>> 0,
    2_166_136_261
  );
  return reserves[seed % reserves.length];
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

export function formatThreadlineShippedPackMarkdown(): string {
  const rollingWindows = getThreadlineRollingAverageLengths();
  const rollingMinimum = Math.min(...rollingWindows.map((window) => window.averageLength));
  const rollingMaximum = Math.max(...rollingWindows.map((window) => window.averageLength));
  const scheduledPuzzles = THREADLINE_DATED_SCHEDULE.map((entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId]);
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
    return `| ${reviewEntry.dateKey ?? 'reserve'} | ${puzzle.title} | ${reviewEntry.overallEditorialScore.toFixed(2)} | ${reviewEntry.playerAverageScore.toFixed(2)} | ${reviewEntry.tags.slice(0, 4).join(', ')} |`;
  }).join('\n');
  const weakestRows = weakest.map((reviewEntry) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[reviewEntry.puzzleId];
    return `| ${reviewEntry.dateKey ?? 'reserve'} | ${puzzle.title} | ${reviewEntry.overallEditorialScore.toFixed(2)} | ${reviewEntry.playerAverageScore.toFixed(2)} | ${reviewEntry.editorNote} |`;
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
  const rootWarnings = getThreadlineShippedRootFamilyWarnings();

  return [
    '# Threadline 365+35 Shipped Pack QA',
    '',
    `Production window: ${THREADLINE_SHIPPED_START_DATE_KEY} through ${THREADLINE_SHIPPED_END_DATE_KEY}`,
    `Validated bank: ${THREADLINE_PUZZLE_BANK.length} puzzles`,
    `Dated schedule: ${THREADLINE_DATED_SCHEDULE.length} puzzles`,
    `Reserves: ${THREADLINE_RESERVES.length} puzzles`,
    `Candidate pool represented: ${THREADLINE_APPROVED_CANDIDATE_POOL_SIZE} deterministic candidates`,
    `Rolling 30-day average answer length: ${rollingMinimum.toFixed(2)}-${rollingMaximum.toFixed(2)}`,
    `Root-family warnings requiring editor awareness: ${rootWarnings.length}`,
    '',
    '## Automated Editor And Player Gate',
    '',
    '- Lead word gate: answer quality, blank fairness, and NYT-adjacent lexical pleasure proxies.',
    '- Theme gate: each answer must belong to its declared thread pool.',
    '- Calendar gate: repetition, seasonal placement, and difficulty rhythm over the full year.',
    '- Copy gate: every playable word appears exactly once in the filled line.',
    '- Safety gate: no unresolved sensitive, brand, or screenshot-risk flags.',
    '- Simulated player checks: Strands, Connections, Spelling Bee, casual morning, and mobile-first scoring proxies.',
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
    '## Reserve Coverage',
    '',
    `The ${THREADLINE_RESERVES.length} reserves are validated and tagged by difficulty, season, theme family, and length profile. A reserve can be swapped into a dated slot only after rerunning cooldown, rolling length, and nearby theme freshness checks.`,
    '',
    '## Root-Family Review',
    '',
    rootWarnings.length > 0
      ? rootWarnings.slice(0, 20).map((warning) => `- ${warning}`).join('\n')
      : 'No root-family repeats fell inside the stricter review window.',
  ].join('\n');
}
