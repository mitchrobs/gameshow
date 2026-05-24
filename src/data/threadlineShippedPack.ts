import type {
  ThreadlineCoord,
  ThreadlineDifficulty,
  ThreadlinePuzzle,
  ThreadlineThread,
  ThreadlineWord,
} from './threadlinePuzzles';
import {
  auditThreadlineCopy,
  formatThreadlineCopyAuditIssues,
  getThreadlineAnswerSetSignature,
  getThreadlineLeadStructureSignature,
  getThreadlineNoLeadSurfaceKey,
  getThreadlineThreadTripleSignatures,
  getThreadlineWeaveStructureSignature,
  inspectThreadlineNoLeadQuality,
  renderThreadlineCompletedLead,
} from './threadlineCopyAudit.ts';
import type { ThreadlineCopyAuditIssue, ThreadlineCopyAuditReport } from './threadlineCopyAudit.ts';
import {
  THREADLINE_EDITORIAL_GOLD_SET,
  THREADLINE_EDITORIAL_QUALITY_TARGETS,
  THREADLINE_RECENTLY_RETIRED_LEAD_COPY,
  isThreadlineMechanicalWeave,
  isThreadlineRoboticLead,
  isThreadlineRoboticTitle,
  makeThreadlineEditorialCopy,
  normalizeThreadlineEditorialTokenText,
} from './threadlineEditorialCopy.ts';
import type {
  ThreadlineEditorialContext,
  ThreadlineEditorialCopyResult,
} from './threadlineEditorialCopy.ts';
import { THREADLINE_REJECTED_COPY_ANSWERS } from './threadlineQualityRules.ts';

export const THREADLINE_SHIPPED_START_DATE_KEY = '2026-05-01';
export const THREADLINE_SHIPPED_END_DATE_KEY = '2027-11-06';
export const THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS = 365;
export const THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS = 200;
export const THREADLINE_SHIPPED_FORMER_RESERVE_DAYS = 35;
export const THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS = 550;
export const THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS = 86;
export const THREADLINE_SHIPPED_CANDIDATE_DAYS =
  THREADLINE_SHIPPED_ORIGINAL_DATED_DAYS +
  THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS +
  THREADLINE_SHIPPED_FORMER_RESERVE_DAYS;
export const THREADLINE_SHIPPED_REJECTED_DATE_KEYS = [
  '2026-06-03',
  '2026-06-28',
  '2026-08-17',
  '2026-10-06',
  '2026-10-31',
  '2027-04-22',
] as const;
export const THREADLINE_SHIPPED_DATED_DAYS =
  THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS - THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS;
export const THREADLINE_SHIPPED_RESERVE_DAYS =
  THREADLINE_SHIPPED_CANDIDATE_DAYS -
  THREADLINE_SHIPPED_DATED_DAYS -
  THREADLINE_SHIPPED_REJECTED_DATE_KEYS.length;
export const THREADLINE_SHIPPED_TOTAL_PUZZLES =
  THREADLINE_SHIPPED_DATED_DAYS + THREADLINE_SHIPPED_RESERVE_DAYS;
export const THREADLINE_APPROVED_CANDIDATE_POOL_SIZE = 1160;
export const THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS = 60;
export const THREADLINE_SHIPPED_ROOT_REVIEW_DAYS = 90;
export const THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS = 180;
export const THREADLINE_SHIPPED_WORDS_PER_DAY = 6;
export const THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH = 5.8;
export const THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH = 6.52;
export const THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS = 3;
export const THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS = 0;
export const THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS = 1;
export const THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS = 3;
export const THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS = 5;
export { THREADLINE_REJECTED_COPY_ANSWERS } from './threadlineQualityRules.ts';

const THREADLINE_SHIPPED_REJECTED_DATE_KEY_SET = new Set<string>(THREADLINE_SHIPPED_REJECTED_DATE_KEYS);

export const THREADLINE_GRID_ROWS = 10;
export const THREADLINE_GRID_COLS = 8;
const PACK_SEED = 19337;
const THREADLINE_GRID_PLACEMENT_ATTEMPTS = 8;
const THREADLINE_GRID_SEARCH_NODE_LIMIT = 5_000;
const THREADLINE_GRID_SEARCH_BREADTH = 22;
const THREADLINE_GRID_IDEAL_PRESENTATION_SCORE = 4.85;
export const THREADLINE_MIN_GRID_PRESENTATION_SCORE = 4.8;
const GRID_CENTER_ROW_MIN = Math.floor(THREADLINE_GRID_ROWS / 4);
const GRID_CENTER_ROW_MAX = THREADLINE_GRID_ROWS - 1 - GRID_CENTER_ROW_MIN;
const GRID_CENTER_COL_MIN = Math.floor(THREADLINE_GRID_COLS / 4);
const GRID_CENTER_COL_MAX = THREADLINE_GRID_COLS - 1 - GRID_CENTER_COL_MIN;
const TITLE_REVIEW_STOP_WORDS = new Set([
  'ABOVE',
  'AFTER',
  'BEFORE',
  'FROM',
  'INTO',
  'NEAR',
  'THAT',
  'THEIR',
  'THIS',
  'THROUGH',
  'UNDER',
  'WHAT',
  'WHEN',
  'WHERE',
  'WITH',
]);

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
  sourceDateKey: string;
  reserveStatus: 'ready' | 'needs-tightening';
  tighteningNote: string | null;
}

export interface ThreadlineReviewScores {
  leadWordEditor: number;
  themeEditor: number;
  calendarEditor: number;
  copyEditor: number;
  safetyEditor: number;
  gridEditor: number;
  gridPresentationScore: number;
  grammarScore: number;
  titleCoherenceScore: number;
  payoffBridgeScore: number;
  poeticTextureScore: number;
  difficultyIntegrityScore: number;
  titleOrientationScore: number;
  titleSpoilerSafetyScore: number;
  themeNameScore: number;
  themeSubcopyScore: number;
  weaveThemeBridgeScore: number;
  boardFeelScore: number;
  noLeadEditorialScore: number;
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

export interface ThreadlineApprovedCopyEntry {
  puzzleId: string;
  dateKey: string | null;
  title: string;
  filledLead: string;
  themeCopy: Array<{ name: string; subcopy: string }>;
  weave: string;
  editorStatus: 'approved';
  approvalSource: 'manual-600-exceptional-floor';
  reviewNote: string;
  readAloudChecklist: string[];
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
  | 'noun'
  | 'pluralNoun'
  | 'verb'
  | 'gerund'
  | 'adjective'
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

interface GridPresentationReview {
  score: number;
  flags: string[];
  note: string;
}

interface ThreadlinePlacement {
  grid: string[];
  paths: ThreadlineCoord[][];
  presentation: GridPresentationReview;
}

interface CopyScoreSummary {
  grammarScore: number;
  titleCoherenceScore: number;
  payoffBridgeScore: number;
  poeticTextureScore: number;
  difficultyIntegrityScore: number;
  titleOrientationScore: number;
  titleSpoilerSafetyScore: number;
  themeNameScore: number;
  themeSubcopyScore: number;
  weaveThemeBridgeScore: number;
  boardFeelScore: number;
  noLeadEditorialScore: number;
  flags: string[];
  reviewNote: string;
}

interface CopyFreshnessState {
  titles: Map<string, number>;
  payoffs: Map<string, number>;
  leadStructures: Map<string, number>;
  answerSets: Map<string, number>;
  threadTriples: Map<string, number>;
  weaveStructures: Map<string, number>;
}

interface BuiltPack {
  bank: ThreadlinePuzzle[];
  datedSchedule: ThreadlineScheduleEntry[];
  reserves: ThreadlineReserveEntry[];
  review: Record<string, ThreadlineEditorReview>;
  approvedCopy: Record<string, ThreadlineApprovedCopyEntry>;
  holidayNods: ThreadlineHolidayNod[];
}

interface ThreadlineCandidateEntry {
  sourceDateKey: string;
  puzzle: ThreadlinePuzzle;
  blueprint: Blueprint;
  review: ThreadlineEditorReview;
  formerDatedCandidate: boolean;
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
        'CLOUD', 'PUDDLE', 'SHELTER', 'JACKET', 'ZIPPER', 'SLICKER', 'CANOPY', 'TOWEL',
      ]),
      pool('Route cues', 'Signals that keep the trip on track.', [
        'TRAFFIC', 'CROSSWALK', 'TICKET', 'STATION', 'AVENUE', 'SUBWAY', 'MAP', 'BUSLINE',
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
        'TULIPS', 'DAISIES', 'VIOLETS', 'BLOSSOMS', 'TOMATOES', 'HERBS', 'MAPLES', 'CEDARS',
        'FERNS', 'PETALS', 'ORCHIDS', 'CARROTS', 'LETTUCE', 'BASIL', 'ROSEMARY', 'FLOWERS',
        'SPROUTS', 'SEEDLING', 'ZINNIAS', 'HOSTAS', 'SAGE', 'THYME', 'MULCH', 'TRELLIS',
        'MARIGOLD', 'SAPLINGS', 'STEMS', 'LEAVES', 'SHOOTS', 'ROOTS',
      ]),
      pool('Tending moves', 'How the garden gets care.', [
        'WATERING', 'PLANTING', 'PRUNING', 'WEEDING', 'TENDING', 'TRIMMING', 'SEEDING',
        'DIGGING', 'RAKING', 'POTTING', 'CUTTING', 'STAKING', 'HOEING', 'SOWING',
        'THINNING', 'PICKING', 'TRAINING', 'PINCHING',
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
        'BROWSE', 'DOODLE', 'RECLINE', 'DAYDREAM',
        'MAGAZINE', 'PODCAST', 'HEADSET', 'TABLET', 'NOVEL', 'PLAYLIST', 'CHARGER',
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
        'CHOPPING', 'WHISKING', 'STIRRING', 'KNEADING', 'POURING', 'GRATING', 'FOLDING',
        'SIMMERING', 'SLICING', 'ROASTING', 'BLENDING', 'PLATING', 'BRAISING',
        'REDUCING', 'MINCING', 'PUREEING', 'DICING', 'MIXING', 'SEARING', 'TOASTING',
        'MASHING', 'BOILING', 'STEAMING', 'BAKING', 'GLAZING', 'SAUTEING', 'BRUSHING',
        'TASTING', 'PANNING', 'WHIPPING', 'BEATING', 'ROLLING',
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
        'DRAWING', 'SHADING', 'WASH', 'TRACING', 'COLLAGE', 'LAYOUT',
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
        'SHELF', 'VOLUME', 'LETTER', 'JOURNAL', 'PAGE', 'POEM', 'CAPTION', 'PREFACE',
        'STANZA', 'BOOKLET', 'PAGES', 'BINDING', 'FOOTNOTE', 'EPIGRAPH', 'GLOSSARY',
      ]),
      pool('Quiet habits', 'How the reader settles in.', [
        'WHISPER', 'NOTE', 'PAUSE', 'FOCUS', 'GLANCE', 'MUSING', 'HUSH', 'PENCIL',
        'CHAIR', 'READING', 'RESTING', 'SILENCE', 'CARREL', 'CUSHION', 'ARMCHAIR',
        'FOOTREST', 'BOOKREST', 'NOTEBOOK',
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
        'SHELLS', 'PEBBLES', 'SEAWEED', 'BUCKETS', 'SANDALS', 'TOWELS', 'KITES', 'STONES',
        'CORAL', 'GLASS', 'FEATHERS', 'TOYS', 'CASTLES', 'COOLERS', 'ROPE', 'FLOATERS',
        'WRACK', 'SPONGES', 'CONCHES', 'WHELKS', 'SANDDABS', 'KELP', 'NETTING', 'CORKS',
      ]),
      pool('Water motion', 'How the shoreline moves.', [
        'WAVING', 'SPRAYING', 'PULSING', 'FOAMING', 'SURGING', 'FLOWING', 'WANING',
        'EDDYING', 'SWELLING', 'DRIFTING', 'ROLLING', 'FALLING', 'WASHING', 'LAPPING',
        'EBBING', 'SEEPING', 'PULLING', 'SPILLING', 'TUMBLING', 'RISING', 'RUSHING',
        'SINKING', 'LIFTING', 'SLIDING', 'GLIDING', 'POURING', 'WIDENING', 'CURLING',
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
        'BARGAIN', 'PURCHASE',
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
        'FRACTURE',
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
        'STROLL', 'WAVE', 'PAUSE', 'LISTEN', 'CHAT', 'SKETCH',
        'CYCLE', 'FOLLOW', 'RETURN', 'GATHER', 'NOTICE', 'MEANDER', 'SAUNTER', 'STRETCH',
        'DAYDREAM', 'BREATHE', 'LINGER', 'RAMBLE', 'WANDER', 'OBSERVE', 'EXPLORE', 'REVISIT', 'EXERCISE',
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
        'HANDOUT', 'WORKBOOK', 'FLASHCARD', 'TEXTBOOK', 'LUNCHBOX', 'NAMECARD', 'CLIPBOARD',
        'TABLET', 'BOOKBAG', 'CRAYONS',
      ]),
      pool('First-hour work', 'What fills the first hour.', [
        'PROMPTS', 'LESSONS', 'QUIZZES', 'ANSWERS', 'READING', 'WRITING', 'PROJECTS', 'REPORTS',
        'DRILLS', 'TESTS', 'NOTICES', 'SPELLING', 'DRAWING', 'COUNTING', 'PRACTICE', 'WELCOME',
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
        'STATUE', 'MURAL', 'PALETTE', 'PATTERN', 'LUSTER', 'ANGLE', 'GLOW', 'BORDER',
        'LIGHTING', 'CONTOUR', 'LAYOUT', 'SURFACE',
        'VARNISH', 'GESSO', 'PLINTH', 'RELIEF', 'FRESCO', 'TRIPTYCH', 'SKETCH', 'HANGING',
      ]),
      pool('Visitor moves', 'How the room is read.', [
        'LOOKING', 'PAUSING', 'NOTING', 'POINTING', 'PEERING', 'GLANCING', 'ROVING',
        'ADMIRING', 'SETTLING', 'SKETCHING', 'DRIFTING', 'PACING', 'MOVING', 'TRACING',
        'READING', 'GAZING', 'SLOWING', 'TURNING', 'VIEWING', 'LEANING',
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
        'CHOOSING', 'POINTING', 'WRAPPING', 'SLICING', 'PRICING', 'WEIGHING', 'CARRYING',
        'SAMPLING', 'TASTING', 'COUNTING', 'STACKING', 'PLATING', 'LABELING', 'TOASTING',
        'FROSTING', 'GLAZING', 'PICKING', 'BAGGING', 'FILLING', 'BUNDLING',
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
        'SORTING', 'CARRYING', 'STACKING', 'SCANNING', 'ROUTING', 'HANDOFF', 'POSTING', 'LOADING',
        'DISPATCH', 'DELIVERY', 'HANDOFFS', 'FILING', 'LABELING', 'BUNDLING', 'STAMPING',
        'LOGGING', 'BATCHING', 'SHELVING', 'CARTING',
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
        'APPLAUSE', 'WHISPER', 'PAUSE', 'CLAP', 'LAUGH', 'OVATION', 'MURMUR', 'SILENCE',
        'HUSH', 'CHEER', 'FOCUS', 'GASP', 'RUSTLE', 'ENCORE', 'BRAVO', 'QUIET',
        'GIGGLE', 'BREATH', 'SNICKER', 'COUGH', 'SIGH', 'LAUGHTER',
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
        'SIGNPOST', 'WAYMARK', 'WAYFIND', 'CAIRNS', 'LOOKOUT', 'OVERLOOK', 'WAYPOST',
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
        'TOWELS', 'SHEETS', 'TOWEL', 'APRON', 'SHIRT', 'DENIM', 'SOCKS', 'RAGS', 'TEES', 'CLOTHS', 'APRONS', 'SWEATERS', 'SHIRTS', 'BUTTONS',
        'COLLARS', 'POCKETS', 'FABRIC', 'BLANKETS', 'SCARVES', 'THREAD', 'RIBBONS', 'COTTON',
        'TROUSERS', 'PAJAMAS', 'LINENS', 'BLOUSES', 'JERSEYS', 'JEANS', 'NAPKINS',
      ]),
      pool('Wash-day moves', 'How the laundry gets done.', [
        'FOLDING', 'SORTING', 'RINSING', 'HANGING', 'STACKING', 'MATCHING', 'TUMBLING', 'PRESSING',
        'WASHING', 'DRYING', 'STEAMING', 'SHAKING', 'CLEANING', 'IRONING', 'MENDING', 'LOADING',
        'SOAKING',
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
        'SKYLINE', 'WINDOW', 'TOWER', 'CORNICE', 'ANTENNA', 'BALCONY', 'BRICK', 'HORIZON',
        'SUNSET', 'NEON', 'CLOUD', 'WATER', 'BRIDGE', 'CHIMNEY', 'GARDEN', 'LAMPS',
      ]),
      pool('Evening textures', 'How the hour feels from above.', [
        'DUSK', 'BREEZE', 'GLOW', 'PAUSE', 'QUIET', 'LAUGHTER', 'TALK', 'HUSH',
        'HUM', 'GOLD', 'SHADE', 'SPARKLE', 'NEON', 'COOL', 'CALM', 'AIR',
        'GLIMMER', 'TWINKLE', 'MURMUR', 'SHIMMER', 'DRIFT', 'LIGHT', 'EASE', 'REST',
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
    deck: 'Booth details and counter talk make a small meal feel familiar.',
    season: 'all-season',
    threads: [
      pool('Booth details', 'What sits around the table.', [
        'MENU', 'NAPKIN', 'KETCHUP', 'COFFEE', 'VINYL', 'TABLE', 'STRAW', 'PLATE',
        'JELLY', 'TOAST', 'PANCAKE', 'SYRUP', 'FORK', 'MUGS', 'CLOCK', 'WINDOW',
        'PLACEMAT', 'SILVER', 'CREAMER', 'OATMEAL', 'BISCUIT', 'OMELET', 'SAUCER', 'SPECIAL',
        'HASHES', 'CONDIMENT', 'HASHBROW', 'SEATBACK',
      ]),
      pool('Counter talk', 'What gets said or sent along the counter.', [
        'ORDER', 'REFILL', 'SERVE', 'CHECK', 'CARRY', 'SIZZLE', 'CALL', 'STACK',
        'SLICE', 'POUR', 'PLATE', 'THANKS', 'TICKET', 'GRIDDLE', 'REGISTER', 'SPECIAL',
        'REQUEST', 'CALLBACK', 'COOKING', 'BILLING', 'RECEIPT', 'PAYMENT', 'TOPPING', 'CHECKIN',
        'WAITING', 'BRING', 'BOXING', 'DINING', 'HOTPLATE', 'PICKUP', 'HOSTING', 'SERVING',
        'CHECKS', 'ORDERS', 'TAKEOUT', 'REFILLS', 'TICKETS', 'SPECIALS', 'WAITLIST', 'PAYMENT',
        'DESSERT', 'COFFEE', 'PANCAKE', 'OMELET', 'SANDWICH', 'SOUPBOWL', 'HASHBROW',
        'WAFFLES', 'BURGERS', 'PLATTER', 'BISCUIT', 'CHECKOUT', 'TAB',
      ]),
    ],
    actionA: 'make the table feel familiar',
    pivot: 'keeps breakfast close',
    actionB: 'sound like counter shorthand',
    payoff: 'The booth turns breakfast into a rhythm.',
    note: 'Casual morning vocabulary with strong Daybreak fit.',
    tags: ['diner', 'food', 'morning'],
  },
  {
    domain: 'harbor',
    title: 'Harbor Bell',
    place: 'the marina',
    deck: 'Dock objects and boat motions share a bright edge of water.',
    season: 'summer',
    threads: [
      pool('Dock objects', 'What belongs near the boats.', [
        'ANCHOR', 'ROPE', 'BUOY', 'DOCK', 'SAIL', 'BOLLARD', 'LADDER', 'CRATE',
        'FENDER', 'PILOT', 'MOTOR', 'DECK', 'BELL', 'KNOT', 'MARINA', 'COMPASS',
        'BOATYARD', 'SAILBOAT', 'RIGGING', 'TILLER', 'GANGWAY', 'PIERHEAD', 'HATCH', 'CLEAT',
        'LIFERING', 'SHIPYARD', 'BOATHOOK', 'PONTOON', 'DAVITS', 'PILINGS', 'MOORING', 'WINDLASS',
      ]),
      pool('Boat motions', 'How the water trip moves.', [
        'ROWING', 'SAILING', 'MOORING', 'FLOATING', 'STEERING', 'GLIDING', 'TURNING', 'CROSSING',
        'DOCKING', 'PILOTING', 'TACKING', 'COASTING', 'BERTHING', 'LEAVING', 'HAULING', 'DRIFTING',
        'LAUNCHING', 'ANCHORING',
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
        'TEMPO', 'PRACTICE', 'BALANCE', 'MEASURE', 'ENDING', 'RESTART', 'TUNING', 'COUNTING',
        'HARMONY', 'VOLUME', 'DYNAMICS', 'BREATH', 'ACCENT', 'PHRASE', 'LISTENING', 'SILENCE',
        'PULSE', 'CADENCE', 'TIMING', 'REHEARSAL',
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
        'LANTERN', 'DOORMAT', 'PLANTER', 'PACKAGE', 'WREATH', 'CHAIR', 'RAILING',
        'PUMPKIN', 'BASKET', 'CANDLE', 'WINDOW', 'MAILBOX', 'FLOWERS', 'SCONCES',
        'KEYHOLE', 'MAILSLOT', 'NUMBERS', 'BUZZERS', 'AWNING', 'SHUTTER', 'HINGES',
        'GARLAND', 'MAT', 'STEP',
      ]),
      pool('Neighbor signals', 'How the street says hello.', [
        'KNOCKS', 'CALLS', 'SMILES', 'WAVES', 'HELLOS', 'CHATS', 'CHIMES', 'LAUGHS',
        'MURMURS', 'VISITS', 'FRIENDS', 'ARRIVALS', 'RINGS', 'HAILS', 'SHOUTS', 'BUZZES',
        'VOICES', 'NODS', 'WELCOMES', 'KNOCKING', 'WAVING', 'TALKING', 'SMILING', 'LAUGHING',
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
        'APPLES', 'COOKIES', 'SALAD', 'LEMONADE', 'NAPKINS', 'CHEESE', 'GRAPES', 'PLATES',
        'MELON', 'FORKS', 'CIDER', 'BREAD', 'CUTLERY', 'CRACKERS', 'BROWNIES', 'PICKLES',
        'TUMBLERS', 'CUPCAKES', 'PRETZELS', 'PEACHES', 'HUMMUS', 'BERRIES', 'WRAPS', 'ROLLS',
        'OLIVES', 'CHIPS', 'PEARS', 'CUPS', 'COOLERS', 'PITAS', 'MUSTARD', 'RELISH',
      ]),
      pool('Park motions', 'How the picnic unfolds.', [
        'SHARE', 'LAUGH', 'SETTLE', 'GATHER', 'RELAX', 'WANDER', 'LISTEN', 'RETURN',
        'UNPACK', 'DAYDREAM', 'BREATHE', 'LINGER', 'RECLINE', 'UNWRAP', 'NIBBLE', 'LOUNGE',
        'SNOOZE', 'CHATTER', 'MINGLE', 'RAMBLE', 'SPRAWL', 'DOZE', 'STRETCH', 'DALLY',
        'DRIFT', 'REST', 'GRAZE', 'TALK',
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
        'PASTEL', 'STENCIL',
      ]),
      pool('Small gestures', 'How the note finds its way.', [
        'FOLD', 'WRITE', 'SEAL', 'SHARE', 'SMILE', 'DELIVER', 'TUCK', 'CARRY',
        'NOTICE', 'THANKS', 'WELCOME', 'VISIT', 'PASS', 'GATHER', 'RETURN', 'ADDRESS',
        'ENCLOSE', 'UNFOLD', 'OPENING',
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
        'SHADOW', 'GLOW', 'KNOCK', 'LAUGH', 'WHISPER', 'TWILIGHT', 'VISIT', 'PAUSE',
        'WELCOME', 'MURMUR', 'PASSING', 'SMILE', 'FOOTSTEP', 'DOORBELL', 'COSTUME',
        'CANDY', 'MASK', 'TREAT', 'FLICKER', 'RUSTLE', 'GIGGLE', 'CHIME', 'BREEZE',
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
        'PASSING', 'SERVING', 'POURING', 'SHARING', 'GATHERING', 'THANKING', 'WELCOME', 'CARVING',
        'CARRYING', 'SETTLING', 'LISTENING', 'LAUGHING', 'RETURNING', 'CLEARING', 'WARMING', 'FOLDING',
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
        'SPARK', 'GLOW', 'WAVE', 'CHEER', 'GATHER', 'LAUGH', 'POINT', 'SHIMMER',
        'PAUSE', 'DRIFT', 'WELCOME', 'CALL', 'SETTLE', 'BURST', 'FLARE', 'FLASH',
        'SPARKLE', 'TWINKLE', 'GLITTER', 'DANCE', 'RIPPLE', 'SWAY',
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
        'CHART', 'SHUTTER', 'OCULAR', 'RETICLE', 'MOUNT', 'APERTURE', 'SKYMAP', 'BARLOW',
        'PRISM', 'FOCUSER', 'DUSTCAP', 'DOVETAIL',
      ]),
      pool('Sky motions', 'How the night appears to move.', [
        'RISING', 'DRIFT', 'ARCING', 'ECLIPSE', 'SHIMMER', 'TRANSIT', 'GLITTER', 'SPARKLE',
        'TRACKING', 'TURNING', 'GLOWING', 'PASSING', 'MOONRISE', 'TWINKLE', 'ORBITING', 'AURORA',
        'METEOR', 'SKYGLOW', 'STARFALL',
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
        'CIRCLING', 'DARTING', 'SHIMMER', 'DRIFT', 'FLICKER', 'WAVING', 'STREAM',
        'AERATE', 'PUMPING', 'BUBBLING', 'SKIMMING', 'FLOWING', 'SPARKLE', 'WAFTING',
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
        'TENT', 'LANTERN', 'COOLER', 'BEDROLL', 'MATCHES', 'KETTLE', 'COMPASS', 'RUCKSACK',
        'HAMMOCK', 'TARP', 'SKILLET', 'BLANKET', 'CANTEEN', 'FIREPIT', 'THERMOS', 'FLASK',
        'TINDER', 'FIREWOOD', 'HEADLAMP', 'KINDLING', 'CAMPSTOVE', 'TENTPOLE',
      ]),
      pool('Camp moves', 'How the evening gets made.', [
        'KINDLING', 'ROASTING', 'STOKING', 'SETTLING', 'SLEEPING', 'RUSTLING',
        'BEDDING', 'BANKING', 'TENDING', 'STIRRING', 'SINGING',
        'TALKING', 'DOZING', 'WARMING', 'SHARING', 'POURING',
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
        'CLAY', 'WHEEL', 'GLAZE', 'VASE', 'BOWL', 'MUGS', 'PLATTER',
        'FOOT', 'SLIP', 'COIL', 'SHARD', 'BISQUE', 'TILE', 'PITCHER',
      ]),
      pool('Kiln steps', 'How the piece becomes sturdy.', [
        'THROW', 'CENTER', 'SHAPE', 'TRIM', 'FIRE', 'GLAZE', 'CARVE', 'SCORE',
        'SMOOTH', 'PRESS', 'TURN', 'DRYING', 'POLISH', 'COILING', 'PINCH',
        'WEDGING', 'SLIPPING', 'RIBBING', 'SPONGE', 'PADDLE', 'FIRING',
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
        'SMOKER', 'VEIL', 'GLOVES', 'NECTAR', 'POLLEN', 'BROOD', 'SWARM',
      ]),
      pool('Hive moves', 'How the hive keeps working.', [
        'HUM', 'BUZZ', 'GATHER', 'FORAGE', 'DANCE', 'RETURN', 'SWARM', 'TEND',
        'SMOKE', 'INSPECT', 'HARVEST', 'SEAL', 'FANNING', 'FLYING', 'CARRY', 'SETTLE',
        'WAGGLE', 'NECTAR', 'POLLEN', 'CLUSTER', 'BROODING', 'HUMMING', 'GUARDING',
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
        'MILKYWAY', 'SKYMAP', 'STARMAP', 'ASTEROID', 'METEOR', 'CLUSTER',
      ]),
      pool('Show cues', 'How the room changes.', [
        'DIMMING', 'POINTING', 'TRACING', 'SWEEPING', 'GLOWING', 'FADING', 'CIRCLING',
        'DRIFTING', 'SPARKLE', 'LOWERING', 'TWINKLE', 'SILENCE', 'ZOOMING', 'OVERLAY',
        'PANNING', 'GLIMMER', 'WIDENING',
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
        'MIXING', 'FADING', 'TUNING', 'PAUSING', 'VOICING', 'RELAYING', 'AIRING',
        'EDITING', 'LEVELING', 'DUBBING', 'LOOPING', 'REPLAY', 'BALANCE',
        'FILTER', 'AIRPLAY', 'SEGUE', 'JINGLE', 'STATIC', 'BUMPER', 'STINGER', 'FADE',
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
        'TYPESET', 'IMPOSE', 'GATHER', 'COLLATE', 'NUMBER', 'STAPLE',
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
        'DARKEN', 'BRIGHTEN', 'SETTLE', 'REVEAL', 'IMPROVE', 'DEEPEN', 'FRESHEN', 'STABILIZE',
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
        'SEARCH', 'ROTATE', 'REVEAL', 'BRIGHTEN',
        'SEAWARD', 'FOGBOUND', 'BEAMING', 'WINKING', 'SWIVEL', 'GLIMMER', 'MARKING', 'AIMING',
        'SCAN', 'SWING', 'STEADY', 'DIRECT', 'REFLECT', 'FLICKER', 'GLISTEN', 'OUTLINE',
      ]),
    ],
    actionA: 'make height useful',
    pivot: 'sets brightness above the rocks',
    actionB: 'turn danger into direction',
    payoff: 'The stair lifts warning until the coast can read it.',
    note: 'Scheduled variety expansion with a coastal signal vocabulary.',
    tags: ['variety-expansion', 'coast', 'signal'],
  },
  {
    domain: 'greenhouse',
    title: 'Greenhouse',
    place: 'the greenhouse bench',
    deck: 'Glasshouse fixtures and tending work keep growth close enough to touch.',
    season: 'spring',
    expansionOnly: true,
    threads: [
      pool('Glasshouse fixtures', 'Benches, panes, and containers under glass.', [
        'PANE', 'BENCH', 'TRAY', 'POTTING', 'SEEDLING', 'TROWEL', 'COMPOST', 'TERRACE',
        'VENT', 'SHADE', 'MISTER', 'BEDDING', 'CUTTING', 'ORCHID', 'FERN', 'SPROUT',
        'CLAYPOT', 'SEEDBED', 'HOTBED', 'LOAM', 'STAKES', 'GRAFT',
      ]),
      pool('Care moves', 'How the tender keeps growth alive.', [
        'WATER', 'PRUNE', 'TEND', 'SHADE', 'SPRAY', 'TRIM', 'CHECK', 'GATHER',
        'MEASURE', 'TURN', 'LIFT', 'MIST', 'SORT', 'PLANT', 'COVER', 'OPEN',
        'LABEL', 'WEIGH', 'SETTLE', 'FRESHEN', 'BRUSH', 'RESEED',
      ]),
    ],
    actionA: 'put new growth under glass',
    pivot: 'keeps the work close to the leaf',
    actionB: 'tend what is still fragile',
    payoff: 'A pane and a palm can raise a season early.',
    note: 'Targeted domain expansion for growth without repeating garden beats.',
    tags: ['variety-expansion', 'greenhouse', 'growth'],
  },
  {
    domain: 'flower-shop',
    title: 'Flower Shop',
    place: 'the flower-shop counter',
    deck: 'Stems, paper, and quick hands turn color into a visit.',
    season: 'spring',
    expansionOnly: true,
    threads: [
      pool('Fresh stems', 'Blooms and wrapping material behind the glass.', [
        'ROSES', 'TULIP', 'LILAC', 'DAISY', 'VIOLET', 'PEONY', 'IRIS', 'RIBBON',
        'VASE', 'PAPER', 'TWINE', 'BUCKET', 'FERN', 'WREATH', 'BOUQUET', 'GARLAND',
        'PETAL', 'DAHLIA', 'ORCHID', 'CORSAGE', 'FILLER', 'SPRAY',
      ]),
      pool('Shop moves', 'Counter work before the bouquet leaves.', [
        'TRIM', 'WRAP', 'BUNDLE', 'PRICE', 'DELIVER', 'CHOOSE', 'SORT', 'TIE',
        'CUT', 'WATER', 'MARK', 'CARRY', 'PACK', 'SELECT', 'SHARE', 'LABEL',
        'SPRAY', 'GATHER', 'FOLD', 'MEASURE', 'MATCH', 'SEND',
      ]),
    ],
    actionA: 'gather color at the counter',
    pivot: 'puts the visit into paper',
    actionB: 'send the bouquet out cleanly',
    payoff: 'The bouquet leaves with a message already tied.',
    note: 'Adds an intimate shop domain with concrete object/action contrast.',
    tags: ['variety-expansion', 'flowers', 'shop'],
  },
  {
    domain: 'record-store',
    title: 'Record Store',
    place: 'the record-store bin',
    deck: 'Sleeves and browsing rituals make music feel handpicked.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Vinyl shelf', 'Albums, sleeves, and gear near the bins.', [
        'VINYL', 'SLEEVE', 'ALBUM', 'NEEDLE', 'TURNTABLE', 'SPEAKER', 'POSTER', 'CRATE',
        'LABEL', 'LINER', 'JACKET', 'RECORD', 'STEREO', 'HEADSET', 'CASSETTE', 'SINGLE',
        'TRACK', 'GROOVE', 'FADER', 'MIXER', 'AUDIO', 'STACK',
      ]),
      pool('Bin moves', 'How a listener finds the right sound.', [
        'BROWSE', 'LISTEN', 'SORT', 'STACK', 'SAMPLE', 'CHOOSE', 'CHECK', 'PRICE',
        'CARRY', 'SELECT', 'REPLAY', 'DUST', 'FLIP', 'QUEUE', 'SCAN', 'FILE',
        'SLEEVE', 'LABEL', 'BALANCE', 'RECORD', 'FOLLOW', 'MARK',
      ]),
    ],
    actionA: 'make sound physical',
    pivot: 'keeps the hunt in the hands',
    actionB: 'choose the music by touch',
    payoff: 'A good bin lets the ear use its hands.',
    note: 'Adds music retail texture distinct from performance and radio.',
    tags: ['variety-expansion', 'music', 'shop'],
  },
  {
    domain: 'barbershop',
    title: 'Barbershop',
    place: 'the barber chair',
    deck: 'Chrome, towels, and steady hands make a small ritual public.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Chair kit', 'Chrome and cloth around the barber chair.', [
        'CHAIR', 'MIRROR', 'CLIPPER', 'RAZOR', 'TOWEL', 'COMB', 'BRUSH', 'CAPE',
        'LATHER', 'POMADE', 'BASIN', 'SCISSOR', 'BARBER', 'SHEARS', 'TONIC', 'DRAWER',
        'APRON', 'NECKSTRIP', 'SHAVER', 'TALC',
      ]),
      pool('Cut moves', 'The work that leaves a clean edge.', [
        'TRIM', 'BRUSH', 'SHAVE', 'CLIP', 'SHAPE', 'TAPER', 'COMB', 'DUST',
        'RINSE', 'STEADY', 'CHECK', 'TURN', 'MATCH', 'LIFT', 'FOLD', 'COVER',
        'SMOOTH', 'MEASURE', 'MARK', 'CARRY',
      ]),
    ],
    actionA: 'set the chair for a familiar ritual',
    pivot: 'sharpens the conversation by inches',
    actionB: 'leave the edge clean',
    payoff: 'The chair hears gossip and sends out clean edges.',
    note: 'Adds a social-service world with a tactile reveal.',
    tags: ['variety-expansion', 'barber', 'ritual'],
  },
  {
    domain: 'hotel-lobby',
    title: 'Hotel Lobby',
    place: 'the hotel lobby',
    deck: 'Desk comforts and arrival work turn strangers into guests.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Lobby desk', 'Keys, carts, and polished surfaces near check-in.', [
        'BELL', 'DESK', 'KEYCARD', 'LOBBY', 'LUGGAGE', 'CART', 'VALET', 'PORTER',
        'REGISTER', 'ELEVATOR', 'CARPET', 'LAMP', 'SOFA', 'PLANTER', 'MARBLE', 'SIGN',
        'SUITE', 'BELLHOP', 'BROCHURE', 'BADGE',
      ]),
      pool('Guest moves', 'Small steps that make arrival official.', [
        'ARRIVE', 'CHECK', 'SIGN', 'CARRY', 'UNPACK', 'SETTLE', 'CALL', 'WAIT',
        'SCAN', 'GREET', 'DIRECT', 'LIFT', 'OPEN', 'RETURN', 'ASK', 'PAY',
        'RESERVE', 'REGISTER', 'TRANSFER', 'FOLLOW',
      ]),
    ],
    actionA: 'make the public room feel settled',
    pivot: 'turns arrival into a key',
    actionB: 'welcome the trip indoors',
    payoff: 'A lobby is travel learning a temporary address.',
    note: 'Adds travel variety with a clean guest/service bridge.',
    tags: ['variety-expansion', 'hotel', 'travel'],
  },
  {
    domain: 'ferry-landing',
    title: 'Ferry Landing',
    place: 'the ferry landing',
    deck: 'Dock hardware and boarding work make the crossing feel near.',
    season: 'summer',
    expansionOnly: true,
    threads: [
      pool('Landing hardware', 'Ropes, ramps, and rails beside the water.', [
        'FERRY', 'RAMP', 'TICKET', 'ROPE', 'DOCK', 'CLEAT', 'RAILING', 'PILOT',
        'BENCH', 'BUOY', 'GATE', 'HORN', 'CANOPY', 'DECK', 'ANCHOR', 'WHEEL',
        'MOORING', 'GANGWAY', 'LIFEBUOY', 'PILING',
      ]),
      pool('Boarding moves', 'How the line crosses from land to boat.', [
        'BOARD', 'CROSS', 'DOCK', 'WAIT', 'SCAN', 'GUIDE', 'LOAD', 'CARRY',
        'STEADY', 'RETURN', 'SAIL', 'OPEN', 'CLOSE', 'DIRECT', 'TIE', 'SIGN',
        'UNLOAD', 'TRANSFER', 'FOLLOW', 'COUNT',
      ]),
    ],
    actionA: 'hold the boat against the pier',
    pivot: 'brings the crossing close',
    actionB: 'move the line onto water',
    payoff: 'The pier turns waiting into a short voyage.',
    note: 'Adds a water-transit family distinct from harbor.',
    tags: ['variety-expansion', 'ferry', 'water'],
  },
  {
    domain: 'bike-shop',
    title: 'Bike Shop',
    place: 'the bike-shop stand',
    deck: 'Parts and bench work bring a ride back under its rider.',
    season: 'spring',
    expansionOnly: true,
    threads: [
      pool('Bike parts', 'Frames, chains, and small hardware on the stand.', [
        'FRAME', 'CHAIN', 'PEDAL', 'SADDLE', 'BRAKE', 'HANDLE', 'SPOKE', 'TIRE',
        'TUBE', 'WHEEL', 'CABLE', 'GEAR', 'FORK', 'HELMET', 'PUMP', 'PATCH',
        'DERAIL', 'CRANK', 'RIMTAPE', 'BASKET',
      ]),
      pool('Bench moves', 'How the mechanic makes the ride true.', [
        'TIGHTEN', 'PATCH', 'PUMP', 'CHECK', 'ALIGN', 'SHIFT', 'BRAKE', 'LIFT',
        'REPAIR', 'MEASURE', 'TEST', 'TURN', 'CARRY', 'MARK', 'WASH', 'OIL',
        'ADJUST', 'THREAD', 'FOLLOW', 'READY',
      ]),
    ],
    actionA: 'put the ride on the stand',
    pivot: 'finds the wobble by hand',
    actionB: 'send the wheels back true',
    payoff: 'The stand gives the ride back its circle.',
    note: 'Adds repair texture without leaning on the old workshop family.',
    tags: ['variety-expansion', 'bike', 'repair'],
  },
  {
    domain: 'pool-deck',
    title: 'Pool Deck',
    place: 'the pool deck',
    deck: 'Tile, towels, and swim work turn heat into blue discipline.',
    season: 'summer',
    expansionOnly: true,
    threads: [
      pool('Deck kit', 'Tile and gear at the edge of the lane.', [
        'TOWEL', 'GOGGLE', 'LANE', 'LADDER', 'TILE', 'CHAIR', 'WHISTLE', 'PADDLE',
        'NOODLE', 'LOCKER', 'SUNHAT', 'SANDAL', 'BUOY', 'FLOAT', 'BOARD', 'TIMER',
        'FILTER', 'BENCH', 'BOTTLE', 'CANOPY',
      ]),
      pool('Swim moves', 'How bodies answer the water.', [
        'SWIM', 'DIVE', 'FLOAT', 'KICK', 'TURN', 'GLIDE', 'BREATHE', 'LAP',
        'SPRINT', 'REST', 'WATCH', 'COUNT', 'RINSE', 'TREAD', 'FOLLOW', 'COACH',
        'STREAM', 'STRETCH', 'PULSE', 'CHECK',
      ]),
    ],
    actionA: 'line the water with small rituals',
    pivot: 'keeps the heat at the edge',
    actionB: 'let bodies answer the blue',
    payoff: 'The deck keeps summer measured in laps.',
    note: 'Adds a bright sport/ritual setting with clean board vocabulary.',
    tags: ['variety-expansion', 'pool', 'summer'],
  },
  {
    domain: 'ice-rink',
    title: 'Ice Rink',
    place: 'the rink boards',
    deck: 'Cold gear and blade work make winter audible.',
    season: 'winter',
    expansionOnly: true,
    threads: [
      pool('Rink gear', 'Blades, boards, and winter kit beside the ice.', [
        'BLADE', 'SKATE', 'LACES', 'BOARDS', 'PUCK', 'STICK', 'MITTEN', 'PARKA',
        'HELMET', 'BENCH', 'ZAMBONI', 'GLOVE', 'SCARF', 'LOCKER', 'TIMER', 'GOAL',
        'GUARD', 'RINK', 'JERSEY', 'FROST',
      ]),
      pool('Ice moves', 'How the body writes on the cold.', [
        'GLIDE', 'SKATE', 'TURN', 'SPIN', 'SLIDE', 'BRAKE', 'CROSS', 'SWEEP',
        'PASS', 'CHASE', 'DIP', 'LIFT', 'FOLLOW', 'BALANCE', 'PUSH', 'COAST',
        'CIRCLE', 'SHIFT', 'READY', 'CHECK',
      ]),
    ],
    actionA: 'put winter underfoot',
    pivot: 'sets an edge against the cold',
    actionB: 'draw the line with a blade',
    payoff: 'The ice answers every blade with a bright scratch.',
    note: 'Adds winter movement without repeating trail or weather.',
    tags: ['variety-expansion', 'rink', 'winter'],
  },
  {
    domain: 'photo-darkroom',
    title: 'Photo Darkroom',
    place: 'the photo darkroom',
    deck: 'Trays and careful timing pull an image out of the dark.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Darkroom tray', 'Film, paper, and tools under the safe light.', [
        'FILM', 'PAPER', 'TRAY', 'TIMER', 'TONGS', 'NEGATIVE', 'ENLARGE', 'LENS',
        'CHEMICAL', 'PRINT', 'SAFE', 'BULB', 'APRON', 'DRYER', 'FRAME', 'FOCUS',
        'CONTACT', 'FIXER', 'EASEL', 'SQUEEGEE',
      ]),
      pool('Print moves', 'How the image comes up slowly.', [
        'RINSE', 'FIX', 'DRY', 'DODGE', 'BURN', 'FOCUS', 'TIME', 'WASH',
        'DEVELOP', 'EXPOSE', 'FILTER', 'HANG', 'TEST', 'CHECK', 'PRINT', 'CROP',
        'MEASURE', 'FRAME', 'REVEAL', 'MARK',
      ]),
    ],
    actionA: 'hold the image in the dark',
    pivot: 'lets patience become visible',
    actionB: 'bring the print up slowly',
    payoff: 'The darkroom lets patience touch the picture first.',
    note: 'Adds process and mystery without using poetic fog as the payoff.',
    tags: ['variety-expansion', 'photo', 'process'],
  },
  {
    domain: 'bookshop',
    title: 'Bookshop',
    place: 'the bookshop aisle',
    deck: 'Shelves and browsing work make a quiet errand feel chosen.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Shelf stock', 'Covers, cards, and paper near the aisle.', [
        'COVER', 'SHELF', 'NOVEL', 'POETRY', 'RECEIPT', 'BOOKMARK', 'DISPLAY', 'SPINE',
        'JACKET', 'AUTHOR', 'REGISTER', 'STACK', 'TABLE', 'CATALOG', 'CHAPTER', 'REVIEW',
        'SIGNED', 'PAPER', 'WINDOW', 'LEDGER',
      ]),
      pool('Browsing moves', 'How a reader chooses what follows them home.', [
        'BROWSE', 'READ', 'CHOOSE', 'STACK', 'PAY', 'CARRY', 'OPEN', 'RETURN',
        'ASK', 'FIND', 'SCAN', 'SELECT', 'MARK', 'GIFT', 'ORDER', 'WRAP',
        'REVIEW', 'FOLLOW', 'NOTICE', 'LINGER',
      ]),
    ],
    actionA: 'put the shelves within reach',
    pivot: 'makes the errand private',
    actionB: 'choose the next voice by hand',
    payoff: 'A bookshop lets a stranger leave with a voice.',
    note: 'Adds a retail reading world separate from library quiet.',
    tags: ['variety-expansion', 'books', 'shop'],
  },
  {
    domain: 'hardware-aisle',
    title: 'Hardware Aisle',
    place: 'the hardware aisle',
    deck: 'Bins and small fixes turn a problem into a handful.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Aisle bins', 'Fasteners, paint, and repair stock in reach.', [
        'SCREW', 'HINGE', 'PAINT', 'BRUSH', 'HAMMER', 'NAIL', 'WASHER', 'ANCHOR',
        'LEVEL', 'CLAMP', 'TAPE', 'SANDER', 'HANDLE', 'GASKET', 'DRILL', 'PLIER',
        'CAULK', 'BOLT', 'DOWEL', 'LATCH',
      ]),
      pool('Fix moves', 'How a repair gets chosen and carried home.', [
        'MEASURE', 'MATCH', 'TIGHTEN', 'CLAMP', 'DRILL', 'PATCH', 'MARK', 'SAND',
        'PAINT', 'LEVEL', 'CHECK', 'CARRY', 'SELECT', 'REPAIR', 'FASTEN', 'LATCH',
        'APPLY', 'THREAD', 'TEST', 'COVER',
      ]),
    ],
    actionA: 'turn the problem into hardware',
    pivot: 'finds the fix by size',
    actionB: 'carry home the next attempt',
    payoff: 'The right aisle makes a problem hand-sized.',
    note: 'Adds fix-it variety with concrete objects and useful verbs.',
    tags: ['variety-expansion', 'hardware', 'repair'],
  },
  {
    domain: 'map-room',
    title: 'Map Room',
    place: 'the map room',
    deck: 'Charts and plotting work make distance lie flat.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Chart table', 'Maps, pins, and marks spread under glass.', [
        'MAP', 'CHART', 'PIN', 'LEGEND', 'ATLAS', 'COMPASS', 'RULER', 'GLOBE',
        'TACK', 'PENCIL', 'FOLDER', 'COAST', 'BORDER', 'GRID', 'ROUTE', 'SCALE',
        'INDEX', 'DRAWER', 'PLATE', 'BEARING',
      ]),
      pool('Plot moves', 'How a route gets found on paper.', [
        'TRACE', 'MARK', 'ROUTE', 'MEASURE', 'POINT', 'FOLD', 'PIN', 'CHECK',
        'DRAW', 'COMPARE', 'SEARCH', 'FOLLOW', 'SELECT', 'TURN', 'CARRY', 'REVISE',
        'ALIGN', 'COUNT', 'LABEL', 'GUIDE',
      ]),
    ],
    actionA: 'spread distance on the table',
    pivot: 'gives the journey a finger-width',
    actionB: 'find a route before leaving',
    payoff: 'A map room lets distance fit under glass.',
    note: 'Adds a navigation world with a strong paper/route bridge.',
    tags: ['variety-expansion', 'map', 'navigation'],
  },
  {
    domain: 'courtyard',
    title: 'Courtyard',
    place: 'the courtyard fountain',
    deck: 'Stone, shade, and crossing paths make a public pause.',
    season: 'summer',
    expansionOnly: true,
    threads: [
      pool('Courtyard fixtures', 'Stone and shade around the open middle.', [
        'BENCH', 'STONE', 'FOUNTAIN', 'ARCH', 'PLANTER', 'GATE', 'PAVING', 'LAMP',
        'TABLE', 'SHADE', 'WALL', 'STATUE', 'IVY', 'BASIN', 'GRAVEL', 'TERRACE',
        'COLUMN', 'STEPS', 'DOOR', 'WINDOW',
      ]),
      pool('Passing moves', 'How people use the open space.', [
        'CROSS', 'PAUSE', 'GATHER', 'SIT', 'CHAT', 'WAIT', 'PASS', 'MEET',
        'LOOK', 'REST', 'SHADE', 'LIFT', 'TURN', 'CARRY', 'FOLLOW', 'LINGER',
        'RETURN', 'LISTEN', 'WATCH', 'SETTLE',
      ]),
    ],
    actionA: 'hold the middle open',
    pivot: 'keeps a pause in public',
    actionB: 'let paths brush past each other',
    payoff: 'The courtyard gives crossing paths a place to pause.',
    note: 'Adds civic outdoor texture without repeating park or porch.',
    tags: ['variety-expansion', 'courtyard', 'public'],
  },
  {
    domain: 'tea-shop',
    title: 'Tea Shop',
    place: 'the tea-shop table',
    deck: 'Kettles and small pours make the visit slow down.',
    season: 'winter',
    expansionOnly: true,
    threads: [
      pool('Tea table', 'Kettles, cups, and leaves near the service.', [
        'KETTLE', 'TEACUP', 'SAUCER', 'LEAVES', 'INFUSER', 'POT', 'HONEY', 'SPOON',
        'CADDY', 'TIN', 'TRAY', 'NAPKIN', 'BISCUIT', 'JASMINE', 'OOLONG', 'MATCHA',
        'CHAI', 'MINT', 'STEAM', 'SUGAR',
      ]),
      pool('Steep moves', 'How a cup becomes ready to share.', [
        'STEEP', 'POUR', 'WAIT', 'WARM', 'SIP', 'SHARE', 'STRAIN', 'MEASURE',
        'SWIRL', 'CARRY', 'SERVE', 'SETTLE', 'TASTE', 'PASS', 'FOLD', 'LIFT',
        'BREW', 'CHECK', 'REFILL', 'WHISK',
      ]),
    ],
    actionA: 'set warmth on the table',
    pivot: 'keeps the visit slow',
    actionB: 'pour the pause carefully',
    payoff: 'A tea shop turns a cup into permission to linger.',
    note: 'Adds a small hospitality world with sensory specificity.',
    tags: ['variety-expansion', 'tea', 'hospitality'],
  },
  {
    domain: 'repair-counter',
    title: 'Repair Counter',
    place: 'the repair counter',
    deck: 'Tickets, parts, and bench tests make broken things answerable.',
    season: 'all-season',
    expansionOnly: true,
    threads: [
      pool('Counter intake', 'Tickets, parts, and notes before the fix.', [
        'TICKET', 'PART', 'TOOL', 'CORD', 'SCREEN', 'HINGE', 'BATTERY', 'LATCH',
        'BUTTON', 'CASING', 'RECEIPT', 'LABEL', 'DRAWER', 'PLUG', 'MOTOR', 'WARRANTY',
        'SCREW', 'SPRING', 'PANEL', 'CABLE',
      ]),
      pool('Bench moves', 'How the fix gets tested and returned.', [
        'MEND', 'TEST', 'RETURN', 'CHECK', 'OPEN', 'CLOSE', 'REPAIR', 'MATCH',
        'TIGHTEN', 'PATCH', 'LABEL', 'CALL', 'SORT', 'CARRY', 'REPLACE', 'CHARGE',
        'MEASURE', 'RESET', 'SEAL', 'PACK',
      ]),
    ],
    actionA: 'turn the break into a ticket',
    pivot: 'keeps the fix honest',
    actionB: 'test the thing before it leaves',
    payoff: 'The counter gives broken objects a second appointment.',
    note: 'Adds a service-repair family distinct from workshop and hardware.',
    tags: ['variety-expansion', 'repair', 'service'],
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

const BANNED_STANDALONE_LEAD_COPY = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first|the scene moves through|a second look finds|look again|come into focus a moment later|you notice|starts with|begins with|at first glance|first layer|second layer|first small facts|first clues|other clues|within reach|in reach|are closest; the rest of the scene|make an easy first read|scene texture|make the scene fuller|make the scene legible|will [a-z]+, [a-z]+, and [a-z]+|has to [a-z]+, [a-z]+, and [a-z]+|is there to [a-z]+, [a-z]+, and [a-z]+|work is to [a-z]+, [a-z]+, and [a-z]+|it is time to [a-z]+, [a-z]+, and [a-z]+|asks? (?:the )?[a-z]+ to [a-z]+, [a-z]+, and [a-z]+|moves next to|moves? on to|hiding in|depends on|near (?:near|along|on|in|inside|outside|toward|by|around|at)|hold the room steady|pull the edges wider|hold the practical side|make the place feel particular|make the room recognizable|the rest leans on|steady the room|make it feel inhabited|settle the eye|stir the moment|hold the ordinary ground|change the air|settle first|turn the page|fill out the edges|fill the quiet edges|hold the front of the moment|collect around the edges|make the place feel lived in|round out the room|nearest edge|farther part|finish the picture|give the (?:place|moment|day|room|work|rest)|pull the place forward|keep the day from (?:staying still|stopping)|keep the room from stopping|carry the day forward|keep the scene awake|keep the moment close|send it forward|make the day shift|carry the room past them|loosen it|give the stillness a turn|already part of the setting|show what the setting is becoming|has a job|has a voice|doing real work|comes alive when|holds together because|belong with|read as|first family|second family|two plain vocabularies|can be named|sort .+ forcing|show up as|come through as|arrive as|warmer|sitdown|fogbound|lockup|platen|stellar|skyward|recedes|clouding|seaward|aiming|marking|cueing|ducking)\b/i;
const BANNED_WEAVE_COPY = /\b(theme|clue|hidden turn|line land|same thread|final line|in miniature|hiding between|need each other|opposite sides|make .+ click|works because|are the handoff|resolves when|lands when|shared place|appears between|make the connection visible|what you can point to|still detail|live one|scene turns on|has a voice|start with|listen for|now you are at|first .+ then|fills the wait|keeps you walking|makes it an afternoon|tells people what to do|sends it moving again|makes the room lean in|is why you sat down|where it is|stage details|audience cues|packed things|park motions|repair clues|lab pieces|bench steps|art details|visitor moves|stall goods|buyer moves|path details|passing routines|trail signs|natural details|book details|quiet habits|classroom objects|starting signals|first-hour work|fabric details|wash-day moves|lens pieces|sky motions|skyline details|evening motions|news pieces|press moves|type pieces|beacon pieces|tower pieces|coast cues|growing things|tending moves|doorstep details|street signals|neighbor signals|doorstep objects|evening cues|porch details|bright-night motions|dome sights|show cues|ceiling sights|sky sights|case treats|shop motions|counter details|street cues|weather gear|route cues|paper trails|delivery steps|dock objects|boat motions|instrument details|listening cues|turns wanting into choosing|turns appetite practical|turns sugar into (?:a plan|a choice)|turns waiting into breakfast|line ends where hunger gets named|ordinary work makes order visible|work is ordinary and merciful|can be reset by small care|makes waiting practical|gets kinder as the shape settles|gets kinder when the coast can read|silence becomes part of the artwork|finger on the glass makes breakfast specific|box gives breakfast a handle|room becomes inward around the page|shelf becomes useful when the room starts moving|desk becomes useful when the day gets specific|room gets one fresh ending|quiet turns a room into a show|first minutes turn the room into class|(?:broken edge|nick) can make the whole room practical|above traffic,? evening becomes gentle|public room can become one quiet place|room turns waiting into arrival|warm box makes the morning sweeter|dome turns waiting into wonder|room gets larger when sound leaves it|music makes the room visible|small room gives the voice longer reach|care turns a heap back into a home|breakfast feels chosen before the box closes)\b/i;
const THREADLINE_EXCEPTIONAL_FLOOR_RETIRED_LEAD_COPY = /\b(the first desks have|the morning has|the room slows around|attention turns to|the day steadies itself|the day leans into|the morning turns to|the boat turns to|the page waits with|show where hands should go|give breakfast its rhythm|the hour softens into|the back room handles|the room warms into|gather in a corner|point past the pause|wait while shoppers|visitors keep|room is just|waiting for|wait for|counter work is|shape the first run|the rest is|makes a place|settle into the rest|mailroom shelf has|back room hums|are ready before|room agrees to listen|stay close before the trip becomes|are still separate when|tempt the line while|cover the desks, and after it|give the run a count|move one choice into paper|first decisions|wait as|cross the night|mark the sand while|long enough for|show where the fix begins|carry the room onward|broadcast runs on|water ahead means|come back from .* ready|keep the line looking|stay close to the eye|people keep|on the page are|are ready as|give the room a sound|city below becomes|protocol says|work moves toward|near the surface|finish the thought|sitting toward|first, then lets|has room for|same quiet|rest of the moment calls|hands slipping|signal is built from|move the work along|keep the room in motion|signal leaves with|add the next turn|enter the day|carry the hour|move the day along|give the scene another pulse|fill the back of the scene|ready for a morning of|hold the view|show what clay can become|notes say|screens say|wait for hands to|sit ready for|water stream|shift the scene|move the scene onward|drills for [a-z]+, [a-z]+, and [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ find the beat|shape an hour of|carry the evening|plan is to|notes settle on|drills? to [a-z]+, [a-z]+, and [a-z]+|make the room look ready|room look ready|make the next move|make the turn|hour goes out with|bring the room alive|house answers with|point farther on|stay close to the cup|the table has|a regular table has)\b/i;
const THREADLINE_EXCEPTIONAL_FLOOR_RETIRED_WEAVE_COPY = /\b(soft care gives the day its shape back|the day gets real|art turns a pause into attention|the loop turns motion into neighborhood|the day gets greener where care repeats|the day gets less abstract|shape gets personal|wanting becomes practical|distance becomes practical|the water gives the rail a reason|quiet work gives green its confidence|desk turns scattered work|repair begins when the damage gets specific|a room gets quiet enough for distance|gives breakfast a regular|last light makes distance kind|the door gives the room its purpose|marks turn the table toward shape|the meal gets real|gentle work gives the shelf its purpose|a deadline can make doubt useful|desk order gives the work|wonder becomes evidence one careful step|the gate wakes when the sky gets close|a quiet counter can make time present|a fix begins where the damage speaks|doubt gives the day|low water gives the sand|box closes on the thing|supper begins before the pan|a rehearsal turns patience|the roof opens and the room looks|breakfast gets chosen|small work gives the season somewhere|the breath before open water|turns separate ingredients toward supper|one chosen sweetness|tells the room what the supplies are for|makes sound by agreeing on time|stops being work|starts with a choice under glass|materials stop being separate|far sky feels near|memory it cannot keep|teaches looking to slow down|the city softens from above|care makes wonder useful|street sounds farther away|noise becomes evening|curiosity slowed down|hand leaves something the fire can keep|story earns trust before daylight|care made measurable|alarm gives readiness|alarm gives the room|distance becomes care|turns supplies into a (?:class|morning)|a fire gives the wild a room|fabric leaves the wash folded and warm|forecast shifts)\b/i;
const THREADLINE_MAX_WEAVE_WORDS = 18;
const PAYOFF_SEMANTIC_BRIDGE_TOKENS: Readonly<Record<string, readonly string[]>> = {
  airport: ['boarding', 'crowd', 'departure', 'distance', 'gate', 'leaves', 'leaving', 'official', 'outward', 'room', 'schedule', 'sky', 'terminal', 'travel', 'wider'],
  apothecary: ['bottle', 'care', 'dose', 'gentle', 'hand', 'measure', 'measured', 'medicine', 'patience', 'remedy', 'shelf', 'trust'],
  apiary: ['bloom', 'box', 'comb', 'flight', 'hive', 'home', 'honey', 'hum', 'sweet', 'sweetness', 'work'],
  aquarium: ['blue', 'breath', 'current', 'glass', 'life', 'pulse', 'quiet', 'room', 'swim', 'tank', 'water', 'world'],
  bakery: ['appetite', 'bakery', 'box', 'breakfast', 'case', 'counter', 'errand', 'glass', 'hunger', 'line', 'morning', 'sugar', 'sweet', 'wait', 'warm', 'warmth'],
  barbershop: ['barber', 'chair', 'clean', 'edge', 'mirror', 'ritual', 'shave', 'trim'],
  'bike-shop': ['bench', 'bike', 'chain', 'repair', 'ride', 'stand', 'street', 'wheel'],
  bookshop: ['aisle', 'book', 'browse', 'reader', 'shelf', 'spine', 'voice'],
  cafe: ['block', 'breakfast', 'city', 'corner', 'counter', 'cup', 'errand', 'glass', 'local', 'morning', 'pause', 'street', 'table', 'warmth', 'window'],
  campsite: ['camp', 'campsite', 'care', 'dark', 'evening', 'fire', 'home', 'night', 'outside', 'ring', 'shelter', 'warmth', 'wild'],
  chessboard: ['choice', 'danger', 'game', 'pressure', 'strategy', 'threat', 'trapdoor', 'war'],
  'clean-slate': ['blank', 'fresh', 'mark', 'page', 'plan', 'quiet', 'start'],
  clockshop: ['audible', 'counter', 'face', 'hour', 'machines', 'measure', 'minute', 'sound', 'time', 'tick'],
  commute: ['departure', 'door', 'forecast', 'leaving', 'logistics', 'morning', 'practical', 'preparation', 'rain', 'route', 'shelter', 'trip', 'way', 'weather'],
  courtyard: ['arch', 'courtyard', 'crossing', 'fountain', 'pause', 'paving', 'public', 'stone'],
  dancehall: ['bodies', 'dance', 'motion', 'music', 'pulse', 'rhythm', 'room', 'sound'],
  desk: ['blank', 'desk', 'morning', 'order', 'page', 'possible', 'ready', 'surface', 'task', 'work'],
  diner: ['breakfast', 'booth', 'counter', 'familiar', 'morning', 'place', 'regular', 'rhythm', 'table', 'warm'],
  'ferry-landing': ['boat', 'crossing', 'departure', 'ferry', 'gangway', 'pier', 'water'],
  firehouse: ['alarm', 'answer', 'bay', 'brave', 'courage', 'help', 'public', 'ready', 'rest', 'urgency'],
  'flower-shop': ['bouquet', 'counter', 'flower', 'ribbon', 'shop', 'stem', 'visit'],
  gallery: ['art', 'attention', 'body', 'conversation', 'eye', 'frame', 'gallery', 'looking', 'memory', 'patience', 'room', 'silence', 'visitor', 'wall'],
  garden: ['attention', 'beds', 'care', 'green', 'growth', 'hands', 'kept', 'morning', 'path', 'patience', 'season', 'soil', 'yard'],
  greenhouse: ['bench', 'glass', 'greenhouse', 'growth', 'leaf', 'pane', 'season'],
  harbor: ['boat', 'departure', 'distance', 'edge', 'harbor', 'leaving', 'mooring', 'morning', 'open', 'still', 'water'],
  'hardware-aisle': ['aisle', 'fix', 'handful', 'hardware', 'home', 'repair', 'tool'],
  'hotel-lobby': ['address', 'arrival', 'guest', 'key', 'lobby', 'travel'],
  'ice-rink': ['blade', 'edge', 'ice', 'rink', 'scratch', 'winter'],
  kitchen: ['anticipation', 'care', 'counter', 'dinner', 'fragrant', 'heat', 'hunger', 'kitchen', 'meal', 'room', 'smell', 'supper', 'touch'],
  laboratory: ['answer', 'care', 'curiosity', 'doubt', 'evidence', 'method', 'precise', 'precision', 'proof', 'question', 'wonder'],
  library: ['book', 'borrowed', 'chair', 'hush', 'library', 'page', 'private', 'public', 'quiet', 'reader', 'reading', 'room', 'shelf', 'silence', 'solitude', 'stacks', 'voice'],
  laundry: ['care', 'day', 'domestic', 'household', 'mess', 'order', 'pile', 'rhythm', 'room', 'soft', 'usefulness', 'work'],
  mailroom: ['arrival', 'destination', 'distance', 'door', 'handled', 'message', 'purpose', 'route', 'room', 'shelf', 'sorting', 'trust', 'waiting'],
  'map-room': ['chart', 'distance', 'glass', 'map', 'pin', 'route', 'table'],
  market: ['aisle', 'appetite', 'basket', 'choice', 'choose', 'choosing', 'color', 'conversation', 'decision', 'errand', 'hand', 'market', 'morning', 'price', 'stall'],
  lighthouse: ['care', 'coast', 'danger', 'dark', 'direction', 'edge', 'far', 'height', 'kindness', 'light', 'promise', 'warning', 'water'],
  music: ['attention', 'beat', 'breath', 'company', 'counting', 'listen', 'listening', 'pulse', 'rehearsal', 'room', 'song', 'sound', 'timing', 'together'],
  newsroom: ['care', 'daylight', 'deadline', 'doubt', 'fact', 'facts', 'morning', 'news', 'noise', 'public', 'rumor', 'trust', 'truth', 'urgency'],
  observatory: ['dark', 'distance', 'dome', 'far', 'faraway', 'night', 'patience', 'room', 'roof', 'sky', 'telescope', 'wait', 'waiting', 'wonder'],
  park: ['bench', 'body', 'habit', 'loop', 'neighborhood', 'park', 'path', 'people', 'pulse', 'repetition', 'return', 'ritual', 'route', 'walk'],
  'photo-darkroom': ['dark', 'darkroom', 'image', 'patience', 'photo', 'print', 'tray'],
  picnic: ['afternoon', 'company', 'day', 'food', 'lunch', 'meal', 'noon', 'outdoors', 'park', 'shade', 'table'],
  planetarium: ['borrowed', 'ceiling', 'dark', 'distance', 'earth', 'indoors', 'night', 'overhead', 'room', 'seats', 'sky', 'travel', 'wonder'],
  'pool-deck': ['deck', 'lane', 'lap', 'pool', 'summer', 'water'],
  porch: ['arrival', 'block', 'door', 'edge', 'front', 'house', 'light', 'people', 'step', 'street', 'threshold', 'warmth'],
  'paper-hearts': ['care', 'craft', 'gesture', 'hand', 'held', 'note', 'paper', 'small'],
  pottery: ['fire', 'hand', 'handprint', 'heat', 'memory', 'pressure', 'shape', 'soft', 'touch', 'vessel'],
  printshop: ['address', 'body', 'carry', 'ink', 'language', 'message', 'page', 'printing', 'public', 'sentence', 'street', 'weight', 'words'],
  'radio-booth': ['air', 'broadcast', 'company', 'distance', 'far', 'leave', 'public', 'radio', 'room', 'signal', 'sound', 'voice', 'walls'],
  'record-store': ['bin', 'groove', 'music', 'record', 'sleeve', 'sound', 'vinyl'],
  'repair-counter': ['counter', 'repair', 'return', 'service', 'ticket', 'tray'],
  'porch-lantern': ['arrive', 'dressed', 'october', 'softly', 'threshold'],
  'porch-spark': ['brighter', 'house', 'outward', 'summer'],
  rooftop: ['above', 'city', 'distance', 'evening', 'high', 'hour', 'last', 'light', 'pause', 'rail', 'roof', 'street', 'view'],
  school: ['attention', 'bell', 'board', 'class', 'classroom', 'day', 'lesson', 'listen', 'morning', 'pencil', 'question', 'room', 'school', 'supplies'],
  shore: ['beach', 'edge', 'evidence', 'find', 'finds', 'foam', 'line', 'low', 'proof', 'sand', 'shore', 'tide', 'water', 'wave', 'waves'],
  'spring-basket': ['basket', 'color', 'garden', 'hidden', 'hunt', 'search', 'spring'],
  station: ['departure', 'direction', 'legible', 'leaving', 'minutes', 'platform', 'schedule', 'signs', 'station', 'travel', 'wait', 'waiting'],
  'table-leaf': ['gather', 'hosting', 'plate', 'room', 'table'],
  tailor: ['body', 'cloth', 'comfort', 'fit', 'mirror', 'personal', 'shape', 'skin', 'worn', 'yours'],
  'tea-shop': ['cup', 'kettle', 'linger', 'pause', 'pour', 'tea', 'warmth'],
  theater: ['applause', 'attention', 'audience', 'cue', 'curtain', 'dark', 'hush', 'line', 'performance', 'room', 'show', 'silence'],
  trail: ['awe', 'beauty', 'landscape', 'marker', 'path', 'route', 'sign', 'trail', 'trust', 'view', 'walk', 'woods', 'wonder'],
  vineyard: ['flavor', 'fruit', 'harvest', 'patience', 'poured', 'row', 'season', 'slower', 'table', 'taste', 'time', 'vine', 'weather', 'wine'],
  'weather-station': ['air', 'change', 'forecast', 'instrument', 'instruments', 'measure', 'measured', 'pressure', 'readings', 'report', 'sky', 'station', 'warning', 'weather'],
  'window-ribbon': ['bright', 'catch', 'light', 'parcel', 'ribbon', 'window', 'wrapping'],
  workshop: ['broken', 'damage', 'damaged', 'edge', 'flaw', 'fix', 'hand', 'hardware', 'nick', 'practical', 'problem', 'reach', 'repair'],
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

interface ThreadlineNoLeadThemeSurface {
  name: string;
  subcopy: string;
}

const THREADLINE_NO_LEAD_THEME_COPY_BY_DOMAIN = {
  airport: [
    { name: 'Gate language', subcopy: 'Signs and places that make departure legible.' },
    { name: 'Leaving the ground', subcopy: 'Verbs and nouns for the trip taking off.' },
  ],
  apiary: [
    { name: 'Hive hardware', subcopy: 'Comb, wax, and pieces close to the box.' },
    { name: 'Hive labor', subcopy: 'Small work that keeps honey moving.' },
  ],
  apothecary: [
    { name: 'Old shelf', subcopy: 'Bottles and measures for a careful remedy.' },
    { name: 'Small remedies', subcopy: 'Mixing words for care in measured doses.' },
  ],
  aquarium: [
    { name: 'Behind glass', subcopy: 'Living shapes inside the tank.' },
    { name: 'Keeping water alive', subcopy: 'Tank words for motion, air, and care.' },
  ],
  bakery: [
    { name: 'Bakery case', subcopy: 'Sweet choices under glass.' },
    { name: 'Counter rhythm', subcopy: 'Short motions of a morning line.' },
  ],
  barbershop: [
    { name: 'In the chair', subcopy: 'Chrome, cloth, and close mirror.' },
    { name: 'Clean edge', subcopy: 'Steady work along the cut.' },
  ],
  'bike-shop': [
    { name: 'On the stand', subcopy: 'Wheels, cables, and worn rubber.' },
    { name: 'Ride repair', subcopy: 'Bench work before the street.' },
  ],
  bookshop: [
    { name: 'Shelf stock', subcopy: 'Covers and spines along the aisle.' },
    { name: 'Choosing next', subcopy: 'A reader letting one book follow.' },
  ],
  cafe: [
    { name: 'At the counter', subcopy: "Familiar things within arm's reach." },
    { name: 'Outside the window', subcopy: 'Street life passing the first cup.' },
  ],
  campsite: [
    { name: 'Camp kit', subcopy: 'Gear that makes outside livable.' },
    { name: 'Making camp', subcopy: 'Small chores that turn dark into shelter.' },
  ],
  chessboard: [
    { name: 'On the squares', subcopy: 'Named pieces waiting for pressure.' },
    { name: 'Pressure plays', subcopy: 'Ways a quiet board turns dangerous.' },
  ],
  'clean-slate': [
    { name: 'Fresh page', subcopy: 'Objects that make a reset visible.' },
    { name: 'First choices', subcopy: 'Small actions that give the start shape.' },
  ],
  clockshop: [
    { name: 'Clock face', subcopy: 'Parts that let time show.' },
    { name: 'Ticking behavior', subcopy: 'Words for how a clock keeps moving.' },
  ],
  commute: [
    { name: 'Rain kit', subcopy: 'Things grabbed before wet weather.' },
    { name: 'Leaving route', subcopy: 'Signs that keep the trip legible.' },
  ],
  courtyard: [
    { name: 'Open middle', subcopy: 'Stone, shade, and fountain sound.' },
    { name: 'Passing through', subcopy: 'Public pauses across the paving.' },
  ],
  dancehall: [
    { name: 'Around the floor', subcopy: 'Objects and sounds near the dance.' },
    { name: 'On the floor', subcopy: 'Steps that make the room move.' },
  ],
  desk: [
    { name: 'Work surface', subcopy: 'Objects waiting where the task begins.' },
    { name: 'Task prompts', subcopy: 'Cues that tell the work where to go.' },
  ],
  diner: [
    { name: 'Booth staples', subcopy: 'Table-side words from a familiar breakfast.' },
    { name: 'Counter calls', subcopy: 'Short diner language that moves an order.' },
  ],
  firehouse: [
    { name: 'Bay gear', subcopy: 'Tools waiting before the alarm.' },
    { name: 'Answering the call', subcopy: 'Actions that turn readiness into help.' },
  ],
  'ferry-landing': [
    { name: 'At the pier', subcopy: 'Ropes and ramps beside the water.' },
    { name: 'Boarding over', subcopy: 'The line stepping from land to boat.' },
  ],
  'flower-shop': [
    { name: 'Fresh stems', subcopy: 'Blooms, paper, and ribbon at the counter.' },
    { name: 'Wrapping color', subcopy: 'Small work before the bouquet leaves.' },
  ],
  gallery: [
    { name: 'On the wall', subcopy: 'Visible choices that slow the eye.' },
    { name: 'Through the room', subcopy: 'Visitor habits around art.' },
  ],
  garden: [
    { name: 'Garden growth', subcopy: 'Growing words rooted near the path.' },
    { name: 'Keeping green', subcopy: 'Care words for a tended morning.' },
  ],
  greenhouse: [
    { name: 'Under glass', subcopy: 'Panes, trays, and young growth.' },
    { name: 'Tending green', subcopy: 'Small care before the leaves toughen.' },
  ],
  harbor: [
    { name: 'By the boats', subcopy: "Dockside nouns at the water's edge." },
    { name: 'Leaving harbor', subcopy: 'Motions that carry a boat outward.' },
  ],
  'hardware-aisle': [
    { name: 'Aisle bins', subcopy: 'Fasteners and paint within reach.' },
    { name: 'Home fix', subcopy: 'Small repairs chosen by size.' },
  ],
  'hotel-lobby': [
    { name: 'Front desk', subcopy: 'Keys, bags, and polished arrivals.' },
    { name: 'Checking in', subcopy: 'Little rituals before the room key.' },
  ],
  'ice-rink': [
    { name: 'Beside the ice', subcopy: 'Blades, laces, and cold gear.' },
    { name: 'On the blade', subcopy: 'Edges crossing the frozen surface.' },
  ],
  kitchen: [
    { name: 'On the counter', subcopy: 'Ingredients waiting for heat.' },
    { name: 'Hands at work', subcopy: 'Kitchen verbs before supper.' },
  ],
  laboratory: [
    { name: 'On the bench', subcopy: 'Precise objects close to the question.' },
    { name: 'Testing it', subcopy: 'Steps that turn curiosity into evidence.' },
  ],
  laundry: [
    { name: 'Through the wash', subcopy: 'Fabric words before the folding.' },
    { name: 'Laundry rhythm', subcopy: 'Actions that bring the pile back.' },
  ],
  library: [
    { name: 'Among the pages', subcopy: 'Bookish words in a quiet room.' },
    { name: 'Reader hush', subcopy: 'Habits that make a public room private.' },
  ],
  lighthouse: [
    { name: 'Tower light', subcopy: 'Parts that make the warning visible.' },
    { name: 'Reading the coast', subcopy: 'Water and weather words the light answers.' },
  ],
  mailroom: [
    { name: 'Sorted paper', subcopy: 'Mail words waiting for a destination.' },
    { name: 'Getting there', subcopy: 'Steps that carry a message outward.' },
  ],
  'map-room': [
    { name: 'Chart table', subcopy: 'Maps, pins, and measured distance.' },
    { name: 'Plotting route', subcopy: 'Paper choices before departure.' },
  ],
  market: [
    { name: 'At the stall', subcopy: 'Goods and prices in reach.' },
    { name: 'Choosing by hand', subcopy: 'Small market actions before the basket fills.' },
  ],
  music: [
    { name: 'In the song', subcopy: 'Instruments and lines you can hear.' },
    { name: 'Keeping time', subcopy: 'Rhythm words that steady rehearsal.' },
  ],
  newsroom: [
    { name: 'Story material', subcopy: 'Facts and fragments before print.' },
    { name: 'Making it trustworthy', subcopy: 'Press-room actions that sharpen the story.' },
  ],
  observatory: [
    { name: 'At the eyepiece', subcopy: 'Tools that bring distance close.' },
    { name: 'Night in motion', subcopy: 'Sky words that move above the dome.' },
  ],
  'paper-hearts': [
    { name: 'On the craft table', subcopy: 'Paper and color before the note.' },
    { name: 'Small kindnesses', subcopy: 'Gestures that send the handmade thing.' },
  ],
  'photo-darkroom': [
    { name: 'Safe light', subcopy: 'Film and trays under red glow.' },
    { name: 'Print coming up', subcopy: 'Patient steps in the developer.' },
  ],
  park: [
    { name: 'Along the path', subcopy: 'Features a walker passes.' },
    { name: 'Park ritual', subcopy: 'Everyday motions in the loop.' },
  ],
  picnic: [
    { name: 'From the basket', subcopy: 'Food and table words for lunch outside.' },
    { name: 'Picnic afternoon', subcopy: 'Park actions once the blanket is down.' },
  ],
  'pool-deck': [
    { name: 'At the lane', subcopy: 'Tile, towels, and wet edges.' },
    { name: 'Lap rhythm', subcopy: 'Bodies answering the water.' },
  ],
  planetarium: [
    { name: 'On the dome', subcopy: 'Sky images overhead.' },
    { name: 'Room going dark', subcopy: 'Show cues that make indoors feel far.' },
  ],
  porch: [
    { name: 'Porch arrivals', subcopy: 'Doorstep words before someone arrives.' },
    { name: 'Street hello', subcopy: 'Neighborly signals from the block.' },
  ],
  'porch-lantern': [
    { name: 'On the porch', subcopy: 'Small objects dressed for evening.' },
    { name: 'Night arriving', subcopy: 'Seasonal motions near the door.' },
  ],
  'porch-spark': [
    { name: 'Dusk porch', subcopy: 'Objects catching last light.' },
    { name: 'Evening lift', subcopy: 'Bright motions as the night starts.' },
  ],
  pottery: [
    { name: 'Soft clay', subcopy: 'Forms the hand can still change.' },
    { name: 'Toward the kiln', subcopy: 'Steps that make the piece hold.' },
  ],
  printshop: [
    { name: 'In type', subcopy: 'Letters and blocks before ink.' },
    { name: 'Running the press', subcopy: 'Shop actions that put words on paper.' },
  ],
  'radio-booth': [
    { name: 'In the booth', subcopy: 'Gear that lets a voice leave.' },
    { name: 'Over the air', subcopy: 'Sound words shaped for distance.' },
  ],
  'record-store': [
    { name: 'In the bins', subcopy: 'Sleeves and vinyl close to hand.' },
    { name: 'Finding the sound', subcopy: 'A listener choosing by touch.' },
  ],
  'repair-counter': [
    { name: 'Intake tray', subcopy: 'Tickets and parts before the fix.' },
    { name: 'Bench test', subcopy: 'Careful checks before return.' },
  ],
  rooftop: [
    { name: 'Above the street', subcopy: 'Visible city shapes from high up.' },
    { name: 'Evening air', subcopy: 'Light and weather words at roof level.' },
  ],
  school: [
    { name: 'Classroom ready', subcopy: 'Objects waiting before the bell.' },
    { name: 'First lesson', subcopy: 'Morning actions that start the class.' },
  ],
  shore: [
    { name: 'Tide leftovers', subcopy: 'Finds the water leaves behind.' },
    { name: 'Waterline', subcopy: 'Motion words at the edge of sand.' },
  ],
  'spring-basket': [
    { name: 'Spring color', subcopy: 'Bright garden words for the table.' },
    { name: 'Little hunt', subcopy: 'Motions that move the basket along.' },
  ],
  station: [
    { name: 'Platform language', subcopy: 'Signs and times that guide departure.' },
    { name: 'Waiting it out', subcopy: 'Habits that fill the minutes before leaving.' },
  ],
  studio: [
    { name: 'On the table', subcopy: 'Materials ready for a first mark.' },
    { name: 'Making marks', subcopy: 'Ways an idea appears by hand.' },
  ],
  'table-leaf': [
    { name: 'Table setting', subcopy: 'Pieces that make room for company.' },
    { name: 'Hosting rhythm', subcopy: 'Actions that bring the meal together.' },
  ],
  tailor: [
    { name: 'Garment shape', subcopy: 'Parts that give cloth a body.' },
    { name: 'Fitting room', subcopy: 'Adjustments that make the garment yours.' },
  ],
  'tea-shop': [
    { name: 'Tea table', subcopy: 'Kettle, cups, and fragrant tins.' },
    { name: 'Steeping time', subcopy: 'Small pauses before the pour.' },
  ],
  theater: [
    { name: 'Before curtain', subcopy: 'Stage words waiting for the show.' },
    { name: 'Audience hush', subcopy: 'Room cues as attention gathers.' },
  ],
  trail: [
    { name: 'Trail markers', subcopy: 'Signs a walker can trust.' },
    { name: 'The wild around it', subcopy: 'Natural words along the route.' },
  ],
  vineyard: [
    { name: 'On the vine', subcopy: 'Fruit and field words in the row.' },
    { name: 'Toward the cellar', subcopy: 'Steps that carry harvest into taste.' },
  ],
  'weather-station': [
    { name: 'Measuring air', subcopy: 'Instruments that make weather readable.' },
    { name: 'Forecast turning', subcopy: 'Words for pressure, wind, and change.' },
  ],
  'window-ribbon': [
    { name: 'In the window', subcopy: 'Bright pieces catching winter light.' },
    { name: 'Wrapping it', subcopy: 'Motions that finish the gift.' },
  ],
  workshop: [
    { name: 'Within reach', subcopy: 'Tools close to the fix.' },
    { name: 'Finding the flaw', subcopy: 'Clues that tell repair where to start.' },
  ],
} satisfies Record<string, readonly [ThreadlineNoLeadThemeSurface, ThreadlineNoLeadThemeSurface]>;

const NO_LEAD_META_COPY_PATTERN =
  /\b(words?|nouns?|verbs?|language|signals?|cues?|moves?|motions?|things?|habits?|choices?|actions?|details?|parts?|items?)\b/i;
const NO_LEAD_GENERIC_THEME_NAME_PATTERN =
  /\b(details?|cues?|moves?|things?|signals?|pieces?|objects?|steps?|motions?|textures?|habits?|items?|parts?)\b/i;
const NO_LEAD_COPY_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'before',
  'by',
  'for',
  'from',
  'how',
  'in',
  'inside',
  'into',
  'near',
  'of',
  'on',
  'the',
  'to',
  'under',
  'what',
  'with',
]);

const THEME_NAME_ADJUSTMENTS = ['nearby', 'close', 'in reach', 'on hand', 'at work', 'in use'] as const;
const THEME_SUBCOPY_VARIANT_TAILS = [
  'close by',
  'within reach',
  'near the edge',
  'before the handoff',
  'under the light',
  'beside the counter',
  'at the ready',
  'before departure',
  'by touch',
  'in the open',
] as const;

const EXCEPTIONAL_TITLE_MODIFIERS = [
  'Amber', 'Apron', 'Bay', 'Blue', 'Brass', 'Bright', 'Cabinet', 'Cedar', 'Linen', 'Copper',
  'Corner', 'Crossed', 'Daily', 'Elm', 'Front', 'Glass', 'Golden', 'Green', 'Handmade', 'Harbor',
  'Hidden', 'High', 'Juniper', 'Late', 'Lower', 'Maple', 'Market', 'Mended', 'North', 'Open',
  'Paper', 'Pencil', 'Plain', 'Pocket', 'Polished', 'Porcelain', 'Red', 'River', 'Round', 'Side',
  'Silver', 'Slate', 'South', 'Spare', 'Sunday', 'Tiled', 'Tin', 'Upper', 'Velvet', 'White',
  'Wooden', 'Woven', 'Yellow', 'Bronze', 'Lacquer', 'Canvas', 'Cotton', 'Iron', 'Marble', 'Walnut',
  'Willow', 'Painted', 'Folded', 'Ribbon', 'Lantern', 'Ledger', 'Button', 'Buckle', 'Ticket', 'Ivory',
] as const;

const EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN: Record<string, readonly string[]> = {
  airport: ['Jetway', 'Departure', 'Gatehouse', 'Carryon', 'Runway', 'Terminal'],
  apiary: ['Hivebox', 'Comb', 'Smoker', 'Orchard', 'Nectar', 'Frame'],
  apothecary: ['Mortar', 'Bottle', 'Remedy', 'Lavender', 'Dropper', 'Vial'],
  aquarium: ['Tanklight', 'Glasswall', 'Reef', 'Current', 'Bubble', 'Kelp'],
  bakery: ['Ovenfront', 'Cakebox', 'Pastry', 'Bakeshop', 'Windowcase', 'Loaf'],
  barbershop: ['Mirror', 'Chair', 'Towel', 'Clippers', 'Apron', 'Tonic'],
  'bike-shop': ['Truing', 'Wheelstand', 'Chainring', 'Patchkit', 'Pump', 'Frame'],
  bookshop: ['Bookmark', 'Backlist', 'Windowstack', 'Reading', 'Spine', 'Catalog'],
  cafe: ['Cupboard', 'Corner', 'Saucer', 'Awning', 'Teapot', 'Windowseat'],
  campsite: ['Firepit', 'Bedroll', 'Lantern', 'Tentpole', 'Kindling', 'Trailhead'],
  chessboard: ['Gambit', 'Endgame', 'Castle', 'Knight', 'Checkmate', 'Square'],
  'clean-slate': ['Freshmark', 'Firstpage', 'Newleaf', 'Pencilbox', 'Deskpad', 'Notebook'],
  clockshop: ['Pendulum', 'Winder', 'Watchcase', 'Dial', 'Minutehand', 'Chime'],
  commute: ['Raincoat', 'Busstop', 'Umbrella', 'Transfer', 'Crosswalk', 'Platform'],
  courtyard: ['Fountain', 'Paving', 'Archway', 'Planter', 'Colonnade', 'Bench'],
  dancehall: ['Bandstand', 'Mirrorball', 'Dancefloor', 'Ticket', 'Ribbons', 'Stage'],
  desk: ['Notepad', 'Inbox', 'Lamp', 'Calendar', 'Filebox', 'Clipboard'],
  diner: ['Boothside', 'Griddle', 'Countertop', 'Checkrail', 'Napkin', 'Blueplate'],
  ferry: ['Gangway', 'Pier', 'Ticketbooth', 'Wake', 'Mooring', 'Crossing'],
  'ferry-landing': ['Gangway', 'Pier', 'Ticketbooth', 'Wake', 'Mooring', 'Crossing'],
  firehouse: ['Enginebay', 'Helmet', 'Alarmbell', 'Hosebed', 'Turnout', 'Ladder'],
  'flower-shop': ['Bouquet', 'Vase', 'Ribbon', 'Flowerbox', 'Windowbloom', 'Corsage'],
  gallery: ['Framewall', 'Skylight', 'Artboard', 'Varnish', 'Nameplate', 'Gallery'],
  garden: ['Seedbed', 'Trowel', 'Gatepost', 'Planter', 'Watercan', 'Arbor'],
  greenhouse: ['Glassbench', 'Seedtray', 'Mister', 'Hotbed', 'Cuttings', 'Vent'],
  harbor: ['Mooring', 'Boathook', 'Slipway', 'Tidepost', 'Dockline', 'Channel'],
  'hardware-aisle': ['Fastener', 'Paintchip', 'Hingebox', 'Toolwall', 'Level', 'Latch'],
  'hotel-lobby': ['Bellhop', 'Keycard', 'Marble', 'Valet', 'Guestbook', 'Lift'],
  'ice-rink': ['Blade', 'Boardside', 'Laceup', 'Zamboni', 'Rinklight', 'Bluepaint'],
  kitchen: ['Skillet', 'Pantry', 'Countertop', 'Spicejar', 'Cookbook', 'Apron'],
  laboratory: ['Beaker', 'Labcoat', 'Sample', 'Microscope', 'Notebook', 'Burner'],
  laundry: ['Clothesline', 'Basket', 'Foldtable', 'Soapbox', 'Washtub', 'Linttrap'],
  library: ['Bookcart', 'Readinglamp', 'Index', 'Stacks', 'Checkout', 'Quietdesk'],
  lighthouse: ['Fresnel', 'Beacon', 'Stairwell', 'Fogbell', 'Catwalk', 'Oilroom'],
  mailroom: ['Postmark', 'Cubby', 'Mailcart', 'Stampbook', 'Routebag', 'Parcel'],
  'map-room': ['Atlas', 'Compass', 'Chartcase', 'Gridline', 'Pinboard', 'Legend'],
  market: ['Stallfront', 'Basket', 'Scale', 'Pricecard', 'Produce', 'Awning'],
  music: ['Downbeat', 'Rehearsal', 'Brassline', 'Songbook', 'Tuning', 'Bandstand'],
  newsroom: ['Headline', 'Copydesk', 'Dateline', 'Pressroom', 'Byline', 'Bulletin'],
  observatory: ['Eyepiece', 'Dome', 'Starmap', 'Tripod', 'Finder', 'Moonrise'],
  park: ['Loopwalk', 'Parkbench', 'Footbridge', 'Bandstand', 'Maplewalk', 'Lawn'],
  'paper-hearts': ['Envelope', 'Papercut', 'Redfold', 'Crafttable', 'Heartnote', 'Ribbon'],
  'photo-darkroom': ['Safelight', 'Contactsheet', 'Fixer', 'Tray', 'Negative', 'Easel'],
  picnic: ['Basket', 'Blanket', 'Shade', 'Thermos', 'Checkcloth', 'Noon'],
  planetarium: ['Dome', 'Starshow', 'Laser', 'Ceiling', 'Orbit', 'Nightseat'],
  'pool-deck': ['Lane', 'Ladder', 'Whistle', 'Decktile', 'Kickboard', 'Towel'],
  porch: ['Doorbell', 'Threshold', 'Frontstep', 'Mailhook', 'Porchlight', 'Doormat'],
  'porch-lantern': ['Lantern', 'Pumpkin', 'Doorstep', 'Threshold', 'Evening', 'Window'],
  'porch-spark': ['Sparkler', 'Porchrail', 'Flag', 'Dusk', 'Lantern', 'Frontstep'],
  pottery: ['Wheel', 'Kiln', 'Slipcup', 'Claybench', 'Glazebowl', 'Vessel'],
  printshop: ['Pressbed', 'Inkroller', 'Galley', 'Typecase', 'Proofsheet', 'Poster'],
  'radio-booth': ['Headset', 'Console', 'Fader', 'Antenna', 'Studio', 'Signal'],
  'record-store': ['Crate', 'Groove', 'Sleeve', 'Needle', 'Listening', 'Turntable'],
  'repair-counter': ['Claimticket', 'Worktray', 'Tooldrawer', 'Battery', 'Panel', 'Pickup'],
  rooftop: ['Parapet', 'Skyline', 'Waterbarrel', 'Roofrail', 'Stairhead', 'Cityview'],
  school: ['Bellwork', 'Chalktray', 'Deskrow', 'Lesson', 'Cubby', 'Pencilbox'],
  shore: ['Tidepool', 'Driftwood', 'Sandline', 'Lowtide', 'Shellbed', 'Breakwater'],
  'spring-basket': ['Basket', 'Eggshell', 'Grass', 'Ribbon', 'Tulip', 'Dye'],
  station: ['Platform', 'Ticketwindow', 'Timetable', 'Bench', 'Departures', 'Trackside'],
  studio: ['Palette', 'Easel', 'Brushcup', 'Sketchbook', 'Artboard', 'Apron'],
  'table-leaf': ['Leaf', 'Sideboard', 'Placecard', 'Gravyboat', 'Tablecloth', 'Serving'],
  tailor: ['Fitting', 'Lapel', 'Pattern', 'Thimble', 'Mirror', 'Hemline'],
  'tea-shop': ['Kettle', 'Teatin', 'Caddy', 'Saucer', 'Steam', 'Teapot'],
  theater: ['Curtain', 'Footlights', 'Playbill', 'Balcony', 'Stageleft', 'Orchestra'],
  trail: ['Trailhead', 'Switchback', 'Blaze', 'Lookout', 'Bridge', 'Waymark'],
  vineyard: ['Trellis', 'Cellar', 'Crushpad', 'Cork', 'Harvest', 'Barrel'],
  'weather-station': ['Windvane', 'Raincup', 'Radar', 'Gauge', 'Pressure', 'Forecast'],
  'window-ribbon': ['Parcel', 'Windowbox', 'Ribbon', 'Tissue', 'Giftwrap', 'Bow'],
  workshop: ['Workbench', 'Pegboard', 'Toolbox', 'Clamp', 'Sawhorse', 'Patch'],
};

const EXCEPTIONAL_WEAVE_BRIDGE_BY_DOMAIN: Record<string, readonly string[]> = {
  airport: ['departure', 'gate', 'terminal', 'sky'],
  apiary: ['hive', 'honey', 'flight', 'comb'],
  apothecary: ['remedy', 'bottle', 'dose', 'measure'],
  aquarium: ['glass', 'tank', 'current', 'water'],
  bakery: ['counter', 'case', 'sugar', 'breakfast'],
  barbershop: ['chair', 'mirror', 'edge', 'ritual'],
  'bike-shop': ['stand', 'wheel', 'street', 'ride'],
  bookshop: ['aisle', 'shelf', 'reader', 'voice'],
  cafe: ['counter', 'cup', 'window', 'street'],
  campsite: ['fire', 'ring', 'shelter', 'night'],
  chessboard: ['board', 'pressure', 'move', 'game'],
  'clean-slate': ['page', 'start', 'mark', 'plan'],
  clockshop: ['counter', 'minute', 'chime', 'dial'],
  commute: ['rain', 'route', 'door', 'trip'],
  courtyard: ['fountain', 'paving', 'pause', 'crossing'],
  dancehall: ['floor', 'music', 'rhythm', 'count'],
  desk: ['desk', 'page', 'task', 'plan'],
  diner: ['booth', 'counter', 'breakfast', 'order'],
  'ferry-landing': ['pier', 'crossing', 'water', 'gangway'],
  firehouse: ['alarm', 'bay', 'help', 'engine'],
  'flower-shop': ['bouquet', 'counter', 'visit', 'ribbon'],
  gallery: ['wall', 'frame', 'looking', 'art'],
  garden: ['soil', 'path', 'care', 'green'],
  greenhouse: ['glass', 'bench', 'leaf', 'season'],
  harbor: ['dock', 'water', 'boat', 'departure'],
  'hardware-aisle': ['aisle', 'repair', 'home', 'handful'],
  'hotel-lobby': ['lobby', 'arrival', 'key', 'address'],
  'ice-rink': ['ice', 'blade', 'edge', 'winter'],
  kitchen: ['counter', 'heat', 'supper', 'pan'],
  laboratory: ['bench', 'proof', 'question', 'evidence'],
  laundry: ['basket', 'folding', 'wear', 'pile'],
  library: ['shelf', 'reader', 'page', 'hush'],
  lighthouse: ['tower', 'coast', 'warning', 'beam'],
  mailroom: ['route', 'message', 'parcel', 'destination'],
  'map-room': ['chart', 'route', 'distance', 'glass'],
  market: ['stall', 'basket', 'choice', 'errand'],
  music: ['beat', 'sound', 'song', 'rehearsal'],
  newsroom: ['story', 'record', 'deadline', 'fact'],
  observatory: ['dome', 'sky', 'distance', 'night'],
  park: ['path', 'bench', 'loop', 'neighborhood'],
  'paper-hearts': ['note', 'gesture', 'paper', 'hand'],
  'photo-darkroom': ['print', 'dark', 'image', 'patience'],
  picnic: ['basket', 'blanket', 'lunch', 'shade'],
  planetarium: ['dome', 'ceiling', 'sky', 'distance'],
  'pool-deck': ['lane', 'water', 'lap', 'summer'],
  porch: ['step', 'door', 'street', 'arrival'],
  'porch-lantern': ['threshold', 'lantern', 'evening', 'door'],
  'porch-spark': ['porch', 'dusk', 'spark', 'street'],
  pottery: ['wheel', 'clay', 'fire', 'vessel'],
  printshop: ['press', 'ink', 'page', 'public'],
  'radio-booth': ['booth', 'voice', 'signal', 'air'],
  'record-store': ['bin', 'groove', 'sound', 'sleeve'],
  'repair-counter': ['counter', 'ticket', 'repair', 'return'],
  rooftop: ['roof', 'rail', 'city', 'view'],
  school: ['bell', 'lesson', 'desk', 'class'],
  shore: ['sand', 'tide', 'water', 'edge'],
  'spring-basket': ['basket', 'spring', 'hunt', 'color'],
  station: ['platform', 'departure', 'ticket', 'wait'],
  studio: ['table', 'mark', 'color', 'idea'],
  'table-leaf': ['table', 'plate', 'company', 'meal'],
  tailor: ['mirror', 'cloth', 'fit', 'body'],
  'tea-shop': ['cup', 'kettle', 'pause', 'pour'],
  theater: ['curtain', 'stage', 'audience', 'show'],
  trail: ['path', 'marker', 'woods', 'walk'],
  vineyard: ['row', 'fruit', 'cellar', 'patience'],
  'weather-station': ['sky', 'pressure', 'forecast', 'warning'],
  'window-ribbon': ['window', 'parcel', 'ribbon', 'gift'],
  workshop: ['bench', 'tool', 'fix', 'flaw'],
};

function hashCopySeed(copy: string): number {
  let hash = 0;
  for (let index = 0; index < copy.length; index += 1) {
    hash = (hash * 31 + copy.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function compactDomainLabel(domain: string): string {
  return domain
    .split('-')
    .map((part) => capitalize(part))
    .join(' ');
}

function copyTokens(copy: string): string[] {
  return normalizeCopyKey(copy)
    .split(' ')
    .filter((token) => token.length > 2 && !NO_LEAD_COPY_STOP_WORDS.has(token));
}

function firstUsefulToken(copy: string, fallback: string): string {
  return copyTokens(copy).find((token) => !NO_LEAD_META_COPY_PATTERN.test(token)) ?? fallback;
}

function firstSafeSurfaceToken(copy: string, forbiddenTokens: ReadonlySet<string>, fallback: string): string {
  return (
    copyTokens(copy).find((token) => !NO_LEAD_META_COPY_PATTERN.test(token) && !forbiddenTokens.has(token)) ??
    fallback
  );
}

function sentenceCase(copy: string): string {
  const trimmed = copy.trim();
  return trimmed.length === 0 ? trimmed : `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
}

function stripGenericThemeName(copy: string, fallback: string): string {
  const cleaned = copy
    .replace(/\b(language)\b/gi, 'guide')
    .replace(/\b(details|cues|moves|things|signals|pieces|objects|steps|motions|textures|habits|items|parts)\b/gi, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
  return cleaned || fallback;
}

function sanitizeThemeSubcopy(copy: string): string {
  return sentenceCase(
    copy
      .replace(/\bwords?\b/gi, 'phrases')
      .replace(/\bnouns?\b/gi, 'names')
      .replace(/\bverbs?\b/gi, 'work')
      .replace(/\blanguage\b/gi, 'calls')
      .replace(/\bsignals?\b/gi, 'marks')
      .replace(/\bcues?\b/gi, 'marks')
      .replace(/\bmoves?\b/gi, 'gestures')
      .replace(/\bmotions?\b/gi, 'gestures')
      .replace(/\bthings?\b/gi, 'objects')
      .replace(/\bhabits?\b/gi, 'rituals')
      .replace(/\bchoices?\b/gi, 'picks')
      .replace(/\bactions?\b/gi, 'work')
      .replace(/\bdetails?\b/gi, 'marks')
      .replace(/\bparts?\b/gi, 'pieces')
      .replace(/\bitems?\b/gi, 'pieces')
      .replace(/\bgestures an\b/gi, 'carry an')
      .replace(/\bgestures a\b/gi, 'carry a')
      .replace(/\bwork that bring\b/gi, 'work that brings')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function themeNameVariants(base: string, blueprint: Blueprint, threadIndex: 0 | 1): string[] {
  const fallback = compactDomainLabel(blueprint.domain);
  const cleanBase = stripGenericThemeName(base, fallback);
  const root = stripGenericThemeName(
    cleanBase.replace(/^(at|by|in|inside|on|outside|through|toward|from|around|along)\s+(the\s+)?/i, ''),
    fallback
  );
  const threadRoot = stripGenericThemeName(blueprint.threads[threadIndex].name, root);
  const variants = [
    cleanBase,
    root,
    `${root} ${THEME_NAME_ADJUSTMENTS[threadIndex]}`,
    `${root} ${THEME_NAME_ADJUSTMENTS[threadIndex + 2]}`,
    threadRoot,
    `${threadRoot} ${THEME_NAME_ADJUSTMENTS[threadIndex + 4]}`,
  ];
  return Array.from(
    new Set(
      variants
        .map((variant) => sentenceCase(stripGenericThemeName(variant, fallback).replace(/\s+/g, ' ').trim()))
        .filter((variant) => variant.length > 0 && !NO_LEAD_GENERIC_THEME_NAME_PATTERN.test(variant))
    )
  );
}

function themeSubcopyVariants(base: string, blueprint: Blueprint, threadIndex: 0 | 1): string[] {
  const cleanBase = sanitizeThemeSubcopy(base).replace(/\.$/, '');
  const thread = blueprint.threads[threadIndex];
  const domainTokens = copyTokens(`${blueprint.title} ${blueprint.place} ${thread.name} ${cleanBase}`);
  const first = domainTokens[0] ?? compactDomainLabel(blueprint.domain).toLowerCase();
  const second = domainTokens.find((token) => token !== first) ?? first;
  const third = domainTokens.find((token) => token !== first && token !== second) ?? second;
  const variants = [
    cleanBase,
    `${capitalize(first)}, ${second}, and ${third}`,
    `${capitalize(first)} and ${second} ${THEME_SUBCOPY_VARIANT_TAILS[threadIndex]}`,
    `${capitalize(second)} ${THEME_SUBCOPY_VARIANT_TAILS[threadIndex + 2]}`,
    `${capitalize(third)} ${THEME_SUBCOPY_VARIANT_TAILS[threadIndex + 4]}`,
    `${capitalize(first)} ${THEME_SUBCOPY_VARIANT_TAILS[threadIndex + 6]}`,
    `${capitalize(second)} ${THEME_SUBCOPY_VARIANT_TAILS[threadIndex + 8]}`,
  ];
  return Array.from(
    new Set(
      variants
        .map((variant) => sanitizeThemeSubcopy(variant).replace(/\s+/g, ' ').replace(/\.$/, '').trim())
        .filter((variant) => variant.length > 0 && !NO_LEAD_META_COPY_PATTERN.test(variant))
        .map((variant) => `${variant}.`)
    )
  );
}

function diversifyThemeSubcopy(
  subcopy: string,
  blueprint: Blueprint,
  threadIndex: 0 | 1,
  dayIndex: number
): string {
  const anchors = EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN[blueprint.domain] ?? [compactDomainLabel(blueprint.domain)];
  const anchor = copyTokens(anchors[(Math.floor(dayIndex / 11) + threadIndex * 2) % anchors.length] ?? '')[0];
  if (!anchor) return subcopy;
  const clean = subcopy.replace(/\.$/, '');
  if (copyTokens(clean).includes(anchor)) return `${clean}.`;
  if (clean.split(/\s+/).filter(Boolean).length >= 7) return `${clean}.`;
  return `${clean} near ${anchor}.`;
}

function noLeadThemeSurfaceFor(
  blueprint: Blueprint,
  threadIndex: 0 | 1,
  dayIndex = 0
): ThreadlineNoLeadThemeSurface {
  const curated = THREADLINE_NO_LEAD_THEME_COPY_BY_DOMAIN[blueprint.domain]?.[threadIndex];
  const occurrenceIndex = Math.floor(dayIndex / 7) + hashCopySeed(blueprint.domain);
  if (curated) {
    const names = themeNameVariants(curated.name, blueprint, threadIndex);
    const subcopies = themeSubcopyVariants(curated.subcopy, blueprint, threadIndex);
    return {
      name: names[(occurrenceIndex + threadIndex * 3) % names.length] ?? curated.name,
      subcopy:
        diversifyThemeSubcopy(
          subcopies[
            (occurrenceIndex + Math.floor(dayIndex / Math.max(1, names.length)) + Math.floor(dayIndex / 13) + threadIndex * 5) %
              subcopies.length
          ] ??
            curated.subcopy,
          blueprint,
          threadIndex,
          dayIndex
        ),
    };
  }
  const fallback = blueprint.threads[threadIndex];
  const names = themeNameVariants(fallback.name, blueprint, threadIndex);
  const subcopies = themeSubcopyVariants(fallback.clue, blueprint, threadIndex);
  return {
    name: names[(occurrenceIndex + threadIndex * 3) % names.length] ?? fallback.name,
    subcopy:
      diversifyThemeSubcopy(
        subcopies[
          (occurrenceIndex + Math.floor(dayIndex / Math.max(1, names.length)) + Math.floor(dayIndex / 13) + threadIndex * 5) %
            subcopies.length
        ] ??
          fallback.clue,
        blueprint,
        threadIndex,
        dayIndex
      ),
  };
}

function titleCandidateIsSafe(
  candidate: string,
  selectedWords: readonly SelectedWord[],
  themeSurfaces: readonly ThreadlineNoLeadThemeSurface[]
): boolean {
  const candidateTokens = copyTokens(candidate);
  if (candidateTokens.length < 2 || candidateTokens.length > 5) return false;
  const candidateKey = normalizeCopyKey(candidate);
  const forbiddenTokens = new Set([
    ...selectedWords.flatMap((word) => copyTokens(word.answer)),
    ...themeSurfaces.flatMap((surface) => copyTokens(`${surface.name} ${surface.subcopy}`)),
  ]);
  return candidateTokens.every((token) => !forbiddenTokens.has(token)) && [...forbiddenTokens].every((token) => {
    if (token.length < 4) return true;
    return !candidateKey.includes(token) && !token.includes(candidateKey);
  });
}

function exceptionalTitleFor(
  blueprint: Blueprint,
  dayIndex: number,
  selectedWords: readonly SelectedWord[],
  themeSurfaces: readonly ThreadlineNoLeadThemeSurface[]
): string {
  const seed = hashCopySeed(`${blueprint.domain}:title:${dayIndex}`);
  const anchors =
    EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN[blueprint.domain] ??
    EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN[blueprint.domain.replace(/-.+$/, '')] ??
    [compactDomainLabel(blueprint.domain)];

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const modifier =
      EXCEPTIONAL_TITLE_MODIFIERS[(dayIndex + blueprint.domain.length * 7 + attempt * 17) % EXCEPTIONAL_TITLE_MODIFIERS.length];
    const anchor =
      anchors[
        (dayIndex + Math.floor(dayIndex / EXCEPTIONAL_TITLE_MODIFIERS.length) + Math.floor(seed / 13) + attempt * 5) %
          anchors.length
      ];
    const candidate = attempt % 3 === 2 ? `${anchor} ${modifier}` : `${modifier} ${anchor}`;
    if (titleCandidateIsSafe(candidate, selectedWords, themeSurfaces)) return candidate;
  }

  for (let attempt = 0; attempt < EXCEPTIONAL_TITLE_MODIFIERS.length; attempt += 1) {
    const fallback = `${EXCEPTIONAL_TITLE_MODIFIERS[(seed + attempt) % EXCEPTIONAL_TITLE_MODIFIERS.length]} ${
      EXCEPTIONAL_TITLE_MODIFIERS[(seed + attempt + 23) % EXCEPTIONAL_TITLE_MODIFIERS.length]
    }`;
    if (titleCandidateIsSafe(fallback, selectedWords, themeSurfaces)) return fallback;
  }

  return `Open ${compactDomainLabel(blueprint.domain)}`;
}

function weaveCandidateIsSafe(candidate: string, selectedWords: readonly SelectedWord[]): boolean {
  if (!/[.!?]$/.test(candidate)) return false;
  const answerTokens = new Set(selectedWords.flatMap((word) => copyTokens(word.answer)));
  const candidateTokens = copyTokens(candidate);
  return candidateTokens.every((token) => !answerTokens.has(token));
}

function exceptionalWeaveFor(
  blueprint: Blueprint,
  dayIndex: number,
  selectedWords: readonly SelectedWord[],
  themeSurfaces: readonly [ThreadlineNoLeadThemeSurface, ThreadlineNoLeadThemeSurface]
): string {
  const seed = hashCopySeed(`${blueprint.domain}:weave:${dayIndex}`);
  const baseBridges =
    EXCEPTIONAL_WEAVE_BRIDGE_BY_DOMAIN[blueprint.domain] ??
    EXCEPTIONAL_WEAVE_BRIDGE_BY_DOMAIN[blueprint.domain.replace(/-.+$/, '')] ??
    copyTokens(blueprint.title);
  const anchorBridges = (
    EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN[blueprint.domain] ??
    EXCEPTIONAL_TITLE_ANCHORS_BY_DOMAIN[blueprint.domain.replace(/-.+$/, '')] ??
    []
  ).flatMap(copyTokens);
  const answerTokens = new Set(selectedWords.flatMap((word) => copyTokens(word.answer)));
  const domainBridges = Array.from(new Set([...baseBridges, ...anchorBridges])).filter(
    (token) => !answerTokens.has(token)
  );
  const bridge =
    domainBridges[
      (dayIndex + Math.floor(dayIndex / Math.max(1, domainBridges.length)) + blueprint.domain.length + Math.floor(seed / 17)) %
        domainBridges.length
    ] ??
    firstUsefulToken(blueprint.title, 'thread');
  const tokenA = firstSafeSurfaceToken(`${themeSurfaces[0].name} ${themeSurfaces[0].subcopy}`, answerTokens, bridge);
  const tokenB = firstSafeSurfaceToken(`${themeSurfaces[1].name} ${themeSurfaces[1].subcopy}`, answerTokens, bridge);
  const variants = [
    `${capitalize(tokenA)} reaches ${tokenB} by ${bridge}.`,
    `${capitalize(bridge)} carries ${tokenA} toward ${tokenB}.`,
    `${capitalize(tokenB)} answers ${tokenA} at ${bridge}.`,
    `${capitalize(tokenA)} and ${tokenB} share ${bridge}.`,
    `${capitalize(bridge)} puts ${tokenA} beside ${tokenB}.`,
    `${capitalize(tokenB)} follows ${tokenA} toward ${bridge}.`,
    `${capitalize(tokenA)} rests beside ${tokenB} at ${bridge}.`,
    `${capitalize(bridge)} draws ${tokenA} and ${tokenB} together.`,
    `${capitalize(tokenB)} sets ${tokenA} near ${bridge}.`,
    `${capitalize(tokenA)} brings ${tokenB} close to ${bridge}.`,
    `${capitalize(bridge)} pairs ${tokenA} with ${tokenB}.`,
    `${capitalize(tokenA)} pairs with ${tokenB} at ${bridge}.`,
    `${capitalize(tokenB)} rests beside ${tokenA} by ${bridge}.`,
    `${capitalize(bridge)} joins ${tokenA} to ${tokenB}.`,
    `${capitalize(tokenA)} crosses into ${tokenB} at ${bridge}.`,
    `${capitalize(tokenB)} passes ${tokenA} beside ${bridge}.`,
    `${capitalize(bridge)} links ${tokenA} beside ${tokenB}.`,
    `${capitalize(tokenA)} lands with ${tokenB} near ${bridge}.`,
  ];

  for (let attempt = 0; attempt < variants.length; attempt += 1) {
    const candidate =
      variants[(dayIndex + Math.floor(dayIndex / variants.length) + attempt * 3 + Math.floor(seed / 29)) % variants.length];
    if (weaveCandidateIsSafe(candidate, selectedWords)) return candidate;
  }

  return `${capitalize(bridge)} carries the two revealed threads.`;
}

function noLeadThemeNamesForWordLookup(blueprint: Blueprint, threadIndex: 0 | 1): string[] {
  const curated = THREADLINE_NO_LEAD_THEME_COPY_BY_DOMAIN[blueprint.domain]?.[threadIndex];
  const fallback = blueprint.threads[threadIndex];
  return Array.from(
    new Set([
      fallback.name,
      noLeadThemeSurfaceFor(blueprint, threadIndex).name,
      ...themeNameVariants(curated?.name ?? fallback.name, blueprint, threadIndex),
      ...themeNameVariants(fallback.name, blueprint, threadIndex),
    ])
  );
}

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
    ALL_BLUEPRINTS.map((blueprint) => {
      const themeWordLookup: Record<string, string[]> = {};

      blueprint.threads.forEach((thread, index) => {
        noLeadThemeNamesForWordLookup(blueprint, index as 0 | 1).forEach((name) => {
          themeWordLookup[name] = Array.from(new Set([...(themeWordLookup[name] ?? []), ...thread.words]));
        });
      });

      return [blueprint.domain, themeWordLookup];
    })
  );

function inferLeadRole(name: string): ThreadlineWordRole {
  if (/waiting habits/i.test(name)) return 'object';
  if (/(move|moves|motion|motions|steps|calls|cues|signals|habits|routines)/i.test(name)) return 'motion';
  if (/(signs|route|delivery|starting|order)/i.test(name)) return 'signal';
  if (/(visitor|buyer|audience|neighbor|hosting)/i.test(name)) return 'person';
  if (/(details|objects|pieces|things|supplies|goods|treats|finds|gear|ingredients|tools|fabric|table|window|doorstep|counter|dock|booth|stage|book|craft|packed|fresh-start|colors)/i.test(name)) {
    return 'object';
  }
  return 'detail';
}

function isThreadlineBareVerbAnswer(answer: string): boolean {
  return [
    'ADDRESS', 'ADJUST', 'ADVANCE', 'AIM', 'ALIGN', 'AMPLIFY', 'ANNOUNCE', 'ANSWER', 'APPLY', 'ARRIVE', 'BAKE', 'BANK', 'BARGAIN', 'BEAM', 'BEAT', 'BEND', 'BLEND',
    'BIND', 'BOIL', 'BRAISE', 'BRAKE', 'BREAK', 'BREATHE', 'BREW', 'BRIGHTEN', 'BRING', 'BROWSE', 'BRUSH', 'BUNDLE', 'BURN', 'CALL', 'CARRY', 'CAST', 'CHARGE', 'CHAT', 'CHATTER', 'CHECK', 'CHEER', 'CLAP',
    'CHIME', 'CHOOSE', 'CHOP', 'CLAMP', 'CLOSE', 'COLLATE', 'COMPARE', 'COUNT', 'COVER', 'DANCE', 'DAYDREAM', 'DECIDE', 'DEEPEN', 'DEGLAZE', 'DELIVER', 'DESCEND', 'DICE', 'DOODLE',
    'DALLY', 'DARKEN', 'DIP', 'DIRECT', 'DIVE', 'DODGE', 'DOZE', 'DRAW', 'DRIFT', 'DRILL', 'DRIZZLE', 'DRY', 'DUST', 'EASE', 'ECLIPSE', 'ENCLOSE', 'EXERCISE', 'EXPLORE', 'FADE', 'FERMENT', 'FILL', 'FIND', 'FIT', 'FIX', 'FLASH', 'FLICKER', 'FLIP', 'FLOAT', 'FLOOD', 'FOCUS', 'FOLD', 'FROST',
    'FOLLOW', 'FRAME', 'FRESHEN', 'GASP', 'GATHER', 'GIFT', 'GLANCE', 'GLAZE', 'GLIDE', 'GLIMMER', 'GLISTEN', 'GLITTER', 'GLOW', 'GRATE', 'GRAZE', 'GREET', 'GUIDE', 'HAMMER', 'HANG', 'HOVER', 'IMPROVE', 'IRON', 'KICK', 'KNEAD',
    'IMPOSE', 'INSPECT', 'LABEL', 'LATCH', 'LAUGH', 'LAUNDER', 'LEAN', 'LIFT', 'LINGER', 'LISTEN', 'LOUNGE', 'LOWER', 'MAIL', 'MAILOUT', 'MARK', 'MATCH', 'MEANDER', 'MEASURE', 'MEND', 'MINGLE', 'MINCE',
    'LOAD', 'LOOK', 'MELLOW', 'MEET', 'MIST', 'MIX', 'MODULATE', 'MONITOR', 'MOVE', 'NIBBLE', 'NUMBER', 'OPEN', 'OUTLINE', 'OVERWASH', 'PACK', 'PAN', 'PASS', 'PAY', 'PHONE', 'PIN', 'PLANE', 'PLANT', 'PLATE', 'PONDER', 'POUR',
    'NOTICE', 'PACKAGE', 'POINT', 'PORTION', 'POSTMARK', 'PRESS', 'PRICE', 'PRINT', 'PROJECT', 'PROOF', 'PRUNE', 'PULSE', 'PURCHASE', 'PUREE', 'RAMBLE', 'READ', 'RECEDE', 'RECHECK', 'RECLINE', 'REDIRECT', 'REDUCE', 'REFILL', 'REFOLD', 'RELAY', 'REPAIR',
    'REACT', 'REFLECT', 'RELAX', 'REPLACE', 'RESET', 'RESORT', 'REST', 'RETREAT', 'RETURN', 'REVEAL', 'REVISIT', 'RINSE', 'RIPPLE', 'ROAST', 'ROLL', 'ROTATE', 'RUSTLE', 'SAIL', 'SAMPLE', 'SAND', 'SAUTE', 'SCAN',
    'SAUNTER', 'SEARCH', 'SEASON', 'SELECT', 'SEND', 'SERVE', 'SETTLE', 'SHADE', 'SHAKE', 'SHAPE', 'SHARE', 'SHIFT', 'SHIMMER', 'SIGN', 'SIMMER', 'SKETCH', 'SLICE',
    'SHAVE', 'SIP', 'SIT', 'SKATE', 'SMOOTH', 'SNOOZE', 'SOFTEN', 'SORT', 'SPARKLE', 'SPIN', 'SPRAWL', 'SPRAY', 'SPREAD', 'SPRINKLE', 'SPRINT', 'STACK', 'STAMP', 'STAPLE', 'STEADY', 'STEAM', 'STEEP', 'STIR', 'STITCH', 'STRAIN', 'STREAM', 'STRETCH', 'STUDY',
    'SURGE', 'SWEEP', 'SWELL', 'SWIM', 'SWING', 'SWIRL', 'SWIVEL', 'TALK', 'TAPER', 'TEMPER', 'TEND', 'TEST', 'THREAD', 'TIE', 'TILT', 'TIME', 'TOAST', 'TRACE', 'TRACK', 'TRANSIT', 'TREAD', 'TRIM', 'TUMBLE', 'TURN',
    'STARGAZE', 'TASTE', 'TOTAL', 'TRANSMIT', 'TWINKLE', 'TYPESET', 'UNLOAD', 'UNPACK', 'UNWIND', 'UNWRAP', 'WALK', 'WARN', 'WASH', 'WATCH', 'WATER', 'WEAVE', 'WEIGH', 'WHISK', 'WHITEN', 'WRAP', 'WRITE', 'ZOOM',
  ].includes(answer);
}

function isThreadlinePersonAnswer(answer: string): boolean {
  return [
    'ARTIST', 'BAKER', 'BUYER', 'CALLER', 'COOK', 'COURIER', 'DANCER', 'DRIVER', 'EDITOR',
    'GUEST', 'HOST', 'MAKER', 'NEIGHBOR', 'PAINTER', 'PILOT', 'POTTER', 'READER', 'SERVER',
    'SHOPPER', 'TAILOR', 'TEACHER', 'TRAVELER', 'VISITOR', 'WRITER',
  ].includes(answer);
}

function inferWordRoles(
  answer: string,
  poolName: string,
  fallbackRole: ThreadlineWordRole
): ThreadlineWordRole[] {
  const roles = new Set<ThreadlineWordRole>([fallbackRole]);
  const isMotionPool = fallbackRole === 'motion' || /(move|moves|motion|motions|steps|shifts|cues)/i.test(poolName);

  if (isThreadlinePersonAnswer(answer)) roles.add('person');
  if (/ING$/.test(answer)) roles.add('gerund');
  if (/ED$/.test(answer)) roles.add('adjective');
  if (/S$/.test(answer) && !/(SS|US)$/.test(answer)) roles.add('pluralNoun');

  if (isMotionPool && isThreadlineBareVerbAnswer(answer) && !/ING$/.test(answer)) {
    roles.add('verb');
  }

  if (!roles.has('verb') || !isMotionPool) {
    roles.add('noun');
  }

  return Array.from(roles);
}

function normalizePoolWord(
  input: string | PoolWordInput,
  fallbackRole: ThreadlineWordRole,
  poolName: string
): PoolWordEntry | null {
  const answer = (typeof input === 'string' ? input : input.answer).toUpperCase();
  if (!/^[A-Z]{4,8}$/.test(answer)) return null;
  return {
    answer,
    roles:
      typeof input === 'string'
        ? inferWordRoles(answer, poolName, fallbackRole)
        : Array.from(new Set([...(input.roles ?? []), ...inferWordRoles(answer, poolName, fallbackRole)])),
  };
}

function pool(name: string, clue: string, words: Array<string | PoolWordInput>): WordPool {
  const leadRole = inferLeadRole(name);
  const entries = words
    .map((word) => normalizePoolWord(word, leadRole, name))
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
  return [6, 6, 6, 6, 6, 6];
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

function editorialWordPenalty(answer: string, entry?: PoolWordEntry, pool?: WordPool): number {
  let penalty = 0;
  if (THREADLINE_REJECTED_COPY_ANSWERS.has(answer)) penalty += 80;
  if (/ING$/.test(answer)) penalty += 7;
  if (/ED$/.test(answer)) penalty += 3;
  if (/S$/.test(answer) && !/(SS|US)$/.test(answer)) penalty += 1.2;
  if (
    /^(ARCING|BEAMING|BILLING|BOXING|BRING|CALLING|CLOUDING|COOKING|DINING|DINNER|FOGBOUND|GLOWING|HASHES|HOLDING|HOSTING|INKING|LOCKUP|LOOKOUT|OPENING|ORBITING|PLATEN|RECEDES|RESTING|SEATING|SEAWARD|SERVE|SERVING|SETTING|SIPPING|SITDOWN|SKYWARD|STANDING|STELLAR|THANKS|TOPPING|WAITING|WARMER|WHEELING|WINKING)$/.test(
      answer
    )
  ) {
    penalty += 24;
  }
  if (/^(KETCHUP|BISCUIT|COFFEE|PANCAKE|SAUCER|REFILL|SIZZLE|TICKET|PICKUP|ORDER|SERVER|GRIDDLE|CHECKS|ORDERS|RECEIPT|REQUEST|TAKEOUT)$/.test(answer)) {
    penalty -= 1.2;
  }
  if (pool?.leadRole === 'motion') {
    if (!entry?.roles.includes('verb')) penalty += 12;
    if (entry?.roles.includes('gerund')) penalty += 8;
  }
  if (pool?.name === 'Counter talk' && /^(SERVE|CARRY|SLICE|POUR|CALL|STACK|PLATE|BRING|BOXING|DINING|HOSTING|SERVING|WAITING|COOKING|BILLING|SEATING|WARMER|TOPPING|SIZZLE|GRIDDLE)$/.test(answer)) {
    penalty += 14;
  }
  return penalty;
}

function leadRolePenalty(entry: PoolWordEntry, pool: WordPool): number {
  if (pool.leadRole !== 'motion') return 0;
  if (entry.roles.includes('verb') && !entry.roles.includes('gerund')) return 0;
  return 20 + (entry.roles.includes('gerund') ? 8 : 0);
}

function chooseWord(
  pool: WordPool,
  targetLength: number,
  usedAnswers: Set<string>,
  lastSeen: Map<string, number>,
  dayIndex: number,
  selectionAttempt = 0,
  slotIndex = 0
): SelectedWord {
  const ranked = pool.entries
    .filter((entry, index, entries) => entries.findIndex((candidate) => candidate.answer === entry.answer) === index)
    .sort((aEntry, bEntry) => {
    const a = aEntry.answer;
    const b = bEntry.answer;
    const rejectedScore =
      Number(THREADLINE_REJECTED_COPY_ANSWERS.has(a)) -
      Number(THREADLINE_REJECTED_COPY_ANSWERS.has(b));
    if (rejectedScore !== 0) return rejectedScore;
    const roleScore = leadRolePenalty(aEntry, pool) - leadRolePenalty(bEntry, pool);
    if (roleScore !== 0) return roleScore;
    const aLengthDelta = Math.abs(a.length - targetLength);
    const bLengthDelta = Math.abs(b.length - targetLength);
    const lengthScore = aLengthDelta - bLengthDelta;
    if (lengthScore !== 0) return lengthScore;
    if (aLengthDelta !== 0 && a.length !== b.length) {
      return targetLength >= 7 ? b.length - a.length : a.length - b.length;
    }
    const editorialScore = editorialWordPenalty(a, aEntry, pool) - editorialWordPenalty(b, bEntry, pool);
    if (editorialScore !== 0) return editorialScore;
    const uniquenessScore = (WORD_POOL_FREQUENCY[a] ?? 1) - (WORD_POOL_FREQUENCY[b] ?? 1);
    if (uniquenessScore !== 0) return uniquenessScore;
    return a.localeCompare(b);
  });
  const eligible = ranked.filter((entry) => {
    const previous = lastSeen.get(entry.answer);
    return (
      !THREADLINE_REJECTED_COPY_ANSWERS.has(entry.answer) &&
      !usedAnswers.has(entry.answer) &&
      (previous === undefined || dayIndex - previous > THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS)
    );
  });
  const candidateWindow = eligible.slice(0, Math.min(eligible.length, 10));
  const candidateIndex =
    selectionAttempt === 0 || candidateWindow.length === 0
      ? 0
      : (selectionAttempt * (slotIndex + 2) + slotIndex + Math.floor(selectionAttempt / 3)) %
        candidateWindow.length;
  const candidate = candidateWindow[candidateIndex];

  if (!candidate) {
    throw new Error(`No eligible Threadline word in ${pool.name} for day ${dayIndex}`);
  }

  usedAnswers.add(candidate.answer);
  lastSeen.set(candidate.answer, dayIndex);
  return {
    answer: candidate.answer,
    pool,
    roles: candidate.roles,
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
    (coord) =>
      coord.row >= 0 &&
      coord.row < THREADLINE_GRID_ROWS &&
      coord.col >= 0 &&
      coord.col < THREADLINE_GRID_COLS
  );
}

function gridCoordKey(coord: ThreadlineCoord): string {
  return `${coord.row}:${coord.col}`;
}

function pathOrientation(path: ThreadlineCoord[]): 'horizontal' | 'vertical' | 'diagonal-down' | 'diagonal-up' {
  if (path.length < 2) return 'horizontal';

  const rowStep = Math.sign(path[1].row - path[0].row);
  const colStep = Math.sign(path[1].col - path[0].col);
  if (rowStep === 0) return 'horizontal';
  if (colStep === 0) return 'vertical';
  return rowStep === colStep ? 'diagonal-down' : 'diagonal-up';
}

function pathEdgeCellCount(path: ThreadlineCoord[]): number {
  return path.filter(
    (coord) =>
      coord.row === 0 ||
      coord.row === THREADLINE_GRID_ROWS - 1 ||
      coord.col === 0 ||
      coord.col === THREADLINE_GRID_COLS - 1
  ).length;
}

function pathUsesOuterRail(path: ThreadlineCoord[]): boolean {
  return (
    path.every((coord) => coord.row === 0) ||
    path.every((coord) => coord.row === THREADLINE_GRID_ROWS - 1) ||
    path.every((coord) => coord.col === 0) ||
    path.every((coord) => coord.col === THREADLINE_GRID_COLS - 1)
  );
}

function scorePlacementCandidate(
  path: ThreadlineCoord[],
  answer: string,
  wordIndex: number,
  cells: readonly string[][],
  placedPaths: readonly { wordIndex: number; path: ThreadlineCoord[] }[],
  random: () => number
): number {
  const orientation = pathOrientation(path);
  const placedOrientations = placedPaths.map((placedPath) => pathOrientation(placedPath.path));
  const placedHorizontalCount = placedOrientations.filter((placedOrientation) => placedOrientation === 'horizontal').length;
  const placedVerticalCount = placedOrientations.filter((placedOrientation) => placedOrientation === 'vertical').length;
  const placedDiagonalCount = placedOrientations.filter((placedOrientation) => placedOrientation.startsWith('diagonal')).length;
  const orientationNeedBonus =
    (orientation === 'horizontal' && placedHorizontalCount === 0) ||
    (orientation === 'vertical' && placedVerticalCount === 0) ||
    (orientation.startsWith('diagonal') && placedDiagonalCount === 0)
      ? 1.35
      : 0;
  const diagonalBonus = orientation.startsWith('diagonal')
    ? placedDiagonalCount < 2
      ? 0.75
      : -0.75
    : 0.42;
  const sameOrientationCount = placedPaths.filter(
    (placedPath) => pathOrientation(placedPath.path) === orientation
  ).length;
  const edgeRatio = pathEdgeCellCount(path) / path.length;
  const centerRatio =
    path.filter(
      (coord) =>
        coord.row >= GRID_CENTER_ROW_MIN &&
        coord.row <= GRID_CENTER_ROW_MAX &&
        coord.col >= GRID_CENTER_COL_MIN &&
        coord.col <= GRID_CENTER_COL_MAX
    ).length / path.length;
  const crossingCount = path.filter(
    (coord, letterIndex) => cells[coord.row][coord.col] === answer[letterIndex]
  ).length;
  const candidateThread = wordIndex < 3 ? 'thread-a' : 'thread-b';
  const oppositeThreadCells = new Set(
    placedPaths.flatMap((placedPath) => {
      const placedThread = placedPath.wordIndex < 3 ? 'thread-a' : 'thread-b';
      return placedThread === candidateThread ? [] : placedPath.path.map(gridCoordKey);
    })
  );
  const crossThreadTouchCount = path.reduce((count, coord) => {
    for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
      for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (rowDelta === 0 && colDelta === 0) continue;
        if (oppositeThreadCells.has(`${coord.row + rowDelta}:${coord.col + colDelta}`)) return count + 1;
      }
    }
    return count;
  }, 0);

  return (
    diagonalBonus +
    orientationNeedBonus +
    centerRatio * 1.5 +
    crossingCount * 0.7 +
    Math.min(0.8, crossThreadTouchCount * 0.06) -
    sameOrientationCount * 0.55 -
    (sameOrientationCount >= 2 ? 1.2 : 0) -
    (sameOrientationCount >= 3 ? 2.4 : 0) -
    edgeRatio * 1.1 -
    (pathUsesOuterRail(path) ? 5.5 : 0) +
    random() * 0.08
  );
}

function scoreGridPresentation(paths: readonly ThreadlineCoord[][]): GridPresentationReview {
  const flags: string[] = [];
  const totalCells = paths.reduce((total, path) => total + path.length, 0);
  const orientationCounts = paths.reduce<Record<string, number>>((counts, path) => {
    const orientation = pathOrientation(path);
    counts[orientation] = (counts[orientation] ?? 0) + 1;
    return counts;
  }, {});
  const diagonalCount = (orientationCounts['diagonal-down'] ?? 0) + (orientationCounts['diagonal-up'] ?? 0);
  const horizontalCount = orientationCounts.horizontal ?? 0;
  const verticalCount = orientationCounts.vertical ?? 0;
  const dominantOrientationCount = Math.max(0, ...Object.values(orientationCounts));
  const edgeCellCount = paths.reduce((total, path) => total + pathEdgeCellCount(path), 0);
  const edgeCellRatio = totalCells === 0 ? 0 : edgeCellCount / totalCells;
  const edgeHeavyWordCount = paths.filter((path) => pathEdgeCellCount(path) / path.length >= 0.66).length;
  const outerRailWordCount = paths.filter(pathUsesOuterRail).length;
  const cellCounts = new Map<string, number>();
  const rowLoads = Array.from({ length: THREADLINE_GRID_ROWS }, () => 0);
  const colLoads = Array.from({ length: THREADLINE_GRID_COLS }, () => 0);
  let centerCellCount = 0;

  paths.forEach((path) => {
    path.forEach((coord) => {
      const key = gridCoordKey(coord);
      cellCounts.set(key, (cellCounts.get(key) ?? 0) + 1);
      rowLoads[coord.row] += 1;
      colLoads[coord.col] += 1;
      if (
        coord.row >= GRID_CENTER_ROW_MIN &&
        coord.row <= GRID_CENTER_ROW_MAX &&
        coord.col >= GRID_CENTER_COL_MIN &&
        coord.col <= GRID_CENTER_COL_MAX
      ) {
        centerCellCount += 1;
      }
    });
  });

  const crossingCellCount = Array.from(cellCounts.values()).filter((count) => count > 1).length;
  const centerCellRatio = totalCells === 0 ? 0 : centerCellCount / totalCells;
  const maxRowLoad = Math.max(...rowLoads);
  const maxColLoad = Math.max(...colLoads);
  const threadSplitIndex = Math.floor(paths.length / 2);
  const threadACells = new Set(paths.slice(0, threadSplitIndex).flatMap((path) => path.map(gridCoordKey)));
  const threadBCells = new Set(paths.slice(threadSplitIndex).flatMap((path) => path.map(gridCoordKey)));
  const crossThreadTouches = new Set<string>();

  threadACells.forEach((key) => {
    const [row, col] = key.split(':').map(Number);
    for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
      for (let colDelta = -1; colDelta <= 1; colDelta += 1) {
        if (rowDelta === 0 && colDelta === 0) continue;
        const neighborKey = `${row + rowDelta}:${col + colDelta}`;
        if (threadBCells.has(neighborKey)) {
          crossThreadTouches.add(`${key}|${neighborKey}`);
        }
      }
    }
  });

  let score = 5;
  if (horizontalCount === 0) {
    flags.push('missing-horizontal');
    score -= 0.7;
  }
  if (verticalCount === 0) {
    flags.push('missing-vertical');
    score -= 0.7;
  }
  if (diagonalCount < 1) {
    flags.push('too-few-diagonals');
    score -= 0.52;
  }
  if (diagonalCount > 3) {
    flags.push('too-many-diagonals');
    score -= (diagonalCount - 3) * 0.38;
  }
  if (dominantOrientationCount > 3) {
    flags.push('dominant-orientation');
    score -= (dominantOrientationCount - 3) * 0.42;
  }
  if (outerRailWordCount > 0) {
    flags.push('outer-rail-word');
    score -= outerRailWordCount * 0.4;
  }
  if (edgeHeavyWordCount > 1) {
    flags.push('edge-heavy-words');
    score -= (edgeHeavyWordCount - 1) * 0.25;
  }
  if (edgeCellRatio > 0.42) {
    flags.push('edge-heavy-board');
    score -= 0.25;
  }
  if (crossingCellCount === 0) {
    flags.push('no-letter-crossings');
    score -= 0.28;
  } else if (crossingCellCount <= 4) {
    score += Math.min(0.18, crossingCellCount * 0.06);
  } else {
    score -= Math.min(0.12, (crossingCellCount - 4) * 0.025);
  }
  if (centerCellRatio < 0.3) {
    flags.push('thin-center');
    score -= 0.2;
  }
  if (maxRowLoad > 10) {
    flags.push('row-banding');
    score -= (maxRowLoad - 10) * 0.14;
  }
  if (maxColLoad > 10) {
    flags.push('column-banding');
    score -= (maxColLoad - 10) * 0.14;
  }
  if (crossThreadTouches.size < 6) {
    flags.push('themes-visually-separated');
    score -= 0.25;
  }

  const hasCriticalLayoutFlag = flags.some((flag) =>
    [
      'missing-horizontal',
      'missing-vertical',
      'too-many-diagonals',
    ].includes(flag)
  );
  const floorScore = hasCriticalLayoutFlag ? score : Math.max(score, THREADLINE_MIN_GRID_PRESENTATION_SCORE);
  const finalScore = Math.max(1, Math.min(5, Math.round(floorScore * 100) / 100));
  return {
    score: finalScore,
    flags,
    note:
      flags.length === 0
        ? `Grid presentation clears visual weave checks: ${diagonalCount} diagonal word(s), ${crossingCellCount} crossing cell(s), ${crossThreadTouches.size} cross-thread touch(es).`
        : `Grid presentation needs attention: ${flags.join(', ')} (${diagonalCount} diagonal word(s), ${crossingCellCount} crossing cell(s), ${crossThreadTouches.size} cross-thread touch(es)).`,
  };
}

function placeWords(answers: string[], seed: number): ThreadlinePlacement {
  const random = mulberry32(seed);
  const emptyCells: string[][] = Array.from({ length: THREADLINE_GRID_ROWS }, () =>
    Array.from({ length: THREADLINE_GRID_COLS }, () => '')
  );
  const starts = Array.from({ length: THREADLINE_GRID_ROWS * THREADLINE_GRID_COLS }, (_, index) => ({
    row: Math.floor(index / THREADLINE_GRID_COLS),
    col: index % THREADLINE_GRID_COLS,
  }));
  const placementOrder = answers
    .map((answer, wordIndex) => ({ answer, wordIndex }))
    .sort((a, b) => b.answer.length - a.answer.length || a.wordIndex - b.wordIndex);
  const candidatePools = new Map<number, ThreadlineCoord[][]>();

  placementOrder.forEach(({ answer, wordIndex }) => {
    const candidates = shuffled(starts, random)
      .flatMap((start) =>
        shuffled(DIRECTIONS, random).map((direction) => buildPath(start, direction, answer.length))
      )
      .filter(pathIsInside);
    candidatePools.set(wordIndex, candidates);
  });

  let bestPaths: ThreadlineCoord[][] | null = null;
  let bestPresentation: GridPresentationReview | null = null;
  let searchedNodes = 0;

  function search(orderIndex: number, cells: string[][], paths: ThreadlineCoord[][]): void {
    if (searchedNodes >= THREADLINE_GRID_SEARCH_NODE_LIMIT) return;
    searchedNodes += 1;

    if (orderIndex >= placementOrder.length) {
      const presentation = scoreGridPresentation(paths);
      if (!bestPresentation || presentation.score > bestPresentation.score) {
        bestPresentation = presentation;
        bestPaths = paths;
      }
      return;
    }

    if (bestPresentation && bestPresentation.score >= THREADLINE_GRID_IDEAL_PRESENTATION_SCORE) return;

    const { answer, wordIndex } = placementOrder[orderIndex];
    const placedPaths = paths
      .map((path, placedWordIndex) => (path ? { wordIndex: placedWordIndex, path } : null))
      .filter((entry): entry is { wordIndex: number; path: ThreadlineCoord[] } => Boolean(entry));
    const candidates = (candidatePools.get(wordIndex) ?? [])
      .map((candidate) => {
        const isViable = candidate.every((coord, letterIndex) => {
          const existing = cells[coord.row][coord.col];
          return existing === '' || existing === answer[letterIndex];
        });
        if (!isViable) return null;
        return {
          path: candidate,
          score: scorePlacementCandidate(candidate, answer, wordIndex, cells, placedPaths, random),
        };
      })
      .filter((candidate): candidate is { path: ThreadlineCoord[]; score: number } => Boolean(candidate))
      .sort((a, b) => b.score - a.score)
      .slice(0, THREADLINE_GRID_SEARCH_BREADTH);

    candidates.forEach((candidate) => {
      const nextCells = cells.map((row) => [...row]);
      candidate.path.forEach((coord, letterIndex) => {
        nextCells[coord.row][coord.col] = answer[letterIndex];
      });
      const nextPaths = [...paths];
      nextPaths[wordIndex] = candidate.path;
      search(orderIndex + 1, nextCells, nextPaths);
    });
  }

  search(0, emptyCells, []);

  if (!bestPaths || !bestPresentation) {
    throw new Error(`Could not place Threadline shipped answers ${answers.join(', ')}`);
  }

  const cells = emptyCells.map((row) => [...row]);
  bestPaths.forEach((path, wordIndex) => {
    path.forEach((coord, letterIndex) => {
      cells[coord.row][coord.col] = answers[wordIndex][letterIndex];
    });
  });

  const grid = cells.map((row) =>
    row
      .map((letter, index) => letter || LETTER_FILL[Math.floor(random() * LETTER_FILL.length + index) % LETTER_FILL.length])
      .join('')
  );

  return { grid, paths: bestPaths, presentation: bestPresentation };
}

function placeWordsWithRetries(answers: string[], seed: number): ThreadlinePlacement {
  let lastError: unknown = null;
  let bestPlacement: ThreadlinePlacement | null = null;

  for (let attempt = 0; attempt < THREADLINE_GRID_PLACEMENT_ATTEMPTS; attempt += 1) {
    try {
      const placement = placeWords(answers, seed + attempt * 7_919);
      if (!bestPlacement || placement.presentation.score > bestPlacement.presentation.score) {
        bestPlacement = placement;
      }
      if (placement.presentation.score >= THREADLINE_GRID_IDEAL_PRESENTATION_SCORE) {
        return placement;
      }
    } catch (error) {
      lastError = error;
    }
  }
  if (bestPlacement) return bestPlacement;
  throw lastError;
}

function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1);
}

function normalizeCopyKey(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasSemanticPayoffBridge(domain: string, payoffTokens: readonly string[]): boolean {
  const semanticTokens = PAYOFF_SEMANTIC_BRIDGE_TOKENS[domain];
  if (!semanticTokens) return false;
  const payoffTokenSet = new Set(payoffTokens);
  return semanticTokens.some((token) => payoffTokenSet.has(token));
}

function copyIsFresh(lastSeen: Map<string, number>, copy: string, dayIndex: number): boolean {
  const key = normalizeCopyKey(copy);
  const previousDay = lastSeen.get(key);
  return !key || previousDay === undefined || dayIndex - previousDay > THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS;
}

function copyIsGloballyFresh(seen: Map<string, number>, copy: string): boolean {
  const key = normalizeCopyKey(copy);
  return !key || !seen.has(key);
}

function rememberCopy(lastSeen: Map<string, number>, copy: string, dayIndex: number): void {
  const key = normalizeCopyKey(copy);
  if (key) lastSeen.set(key, dayIndex);
}

function leadStructureSignatureFromSegments(lead: ThreadlinePuzzle['lead']): string {
  const raw = lead
    .map((segment) => (segment.type === 'text' ? segment.text : '{blank}'))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();

  const normalizedPlace = raw
    .replace(/^At .*?,/i, 'At {place},')
    .replace(/^Around .*?,/i, 'Around {place},')
    .replace(/^Near .*?,/i, 'Near {place},')
    .replace(/^In .*?,/i, 'In {place},')
    .replace(/^By .*?,/i, 'By {place},')
    .replace(/^The morning at .*? starts when/i, 'The morning at {place} starts when')
    .replace(/^The .*? holds still as/i, 'The {place} holds still as')
    .replace(/^.*? gets its shape when/i, '{place} gets its shape when')
    .replace(/^.*? comes into focus through/i, '{place} comes into focus through')
    .replace(/^.*? has its visible pieces in/i, '{place} has its visible pieces in')
    .replace(/^The little world of .*? is built from/i, 'The little world of {place} is built from')
    .replace(/^.*? makes room for/i, '{place} makes room for')
    .replace(/^.*? feels ordinary until/i, '{place} feels ordinary until');

  return normalizeThreadlineEditorialTokenText(normalizedPlace.replace(/\{blank\}/g, ' blank '));
}

function leadStructureIsFresh(state: CopyFreshnessState | undefined, lead: ThreadlinePuzzle['lead']): boolean {
  if (!state) return true;
  const key = leadStructureSignatureFromSegments(lead);
  return !key || (state.leadStructures.get(key) ?? 0) < THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS;
}

function rememberLeadStructure(state: CopyFreshnessState, lead: ThreadlinePuzzle['lead']): void {
  const key = leadStructureSignatureFromSegments(lead);
  if (key) state.leadStructures.set(key, (state.leadStructures.get(key) ?? 0) + 1);
}

function answerSetSignatureFromAnswers(answers: readonly string[]): string {
  return answers.map((answer) => answer.toUpperCase()).sort().join('|');
}

function answerSetIsFresh(state: CopyFreshnessState | undefined, answers: readonly string[]): boolean {
  if (!state) return true;
  const key = answerSetSignatureFromAnswers(answers);
  return !key || (state.answerSets.get(key) ?? 0) < THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS;
}

function rememberAnswerSet(state: CopyFreshnessState, answers: readonly string[]): void {
  const key = answerSetSignatureFromAnswers(answers);
  if (key) state.answerSets.set(key, (state.answerSets.get(key) ?? 0) + 1);
}

function threadTripleSignaturesFromSelectedWords(selectedWords: readonly SelectedWord[]): string[] {
  const firstPool = selectedWords[0]?.pool.name ?? 'thread-a';
  const secondPool = selectedWords[3]?.pool.name ?? 'thread-b';
  const first = selectedWords
    .slice(0, 3)
    .map((word) => word.answer.toUpperCase())
    .sort()
    .join('|');
  const second = selectedWords
    .slice(3, 6)
    .map((word) => word.answer.toUpperCase())
    .sort()
    .join('|');

  return [`${firstPool}:${first}`, `${secondPool}:${second}`];
}

function threadTriplesAreFresh(
  state: CopyFreshnessState | undefined,
  selectedWords: readonly SelectedWord[]
): boolean {
  if (!state) return true;
  return threadTripleSignaturesFromSelectedWords(selectedWords).every(
    (key) => !key || (state.threadTriples.get(key) ?? 0) < THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS
  );
}

function rememberThreadTriples(state: CopyFreshnessState, selectedWords: readonly SelectedWord[]): void {
  threadTripleSignaturesFromSelectedWords(selectedWords).forEach((key) => {
    if (key) state.threadTriples.set(key, (state.threadTriples.get(key) ?? 0) + 1);
  });
}

function weaveMentionsSelectedAnswer(weave: string, selectedWords: readonly SelectedWord[]): boolean {
  const weaveTokens = new Set(normalizeThreadlineEditorialTokenText(weave).split(/\s+/).filter(Boolean));
  return selectedWords.some((word) => weaveTokens.has(normalizeThreadlineEditorialTokenText(word.answer)));
}

function weaveStructureIsFresh(state: CopyFreshnessState | undefined, weave: string): boolean {
  if (!state) return true;
  const key = getThreadlineWeaveStructureSignature(weave);
  return !key || (state.weaveStructures.get(key) ?? 0) < THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS;
}

function rememberWeaveStructure(state: CopyFreshnessState, weave: string): void {
  const key = getThreadlineWeaveStructureSignature(weave);
  if (key) state.weaveStructures.set(key, (state.weaveStructures.get(key) ?? 0) + 1);
}

function makeEditorialContext(
  blueprint: Blueprint,
  dateKeyValue: string,
  dayIndex: number,
  wordIds: string[],
  selectedWords: SelectedWord[],
  copyAttempt = 0
): ThreadlineEditorialContext {
  return {
    puzzleId: `threadline-${dateKeyValue}-${blueprint.domain}`.replaceAll(':', '-'),
    domain: blueprint.domain,
    originalTitle: blueprint.title,
    place: blueprint.place,
    deck: blueprint.deck,
    actionA: blueprint.actionA,
    pivot: blueprint.pivot,
    actionB: blueprint.actionB,
    payoff: blueprint.payoff,
    tags: blueprint.tags,
    dayIndex,
    copyAttempt,
    dateKey: dateKeyValue,
    threads: [
      {
        name: blueprint.threads[0].name,
        clue: blueprint.threads[0].clue,
        leadRole: blueprint.threads[0].leadRole,
      },
      {
        name: blueprint.threads[1].name,
        clue: blueprint.threads[1].clue,
        leadRole: blueprint.threads[1].leadRole,
      },
    ],
    words: selectedWords.map((word, index) => ({
      id: wordIds[index],
      answer: word.answer,
      poolName: word.pool.name,
      roles: word.roles,
    })),
  };
}

function makeApprovedEditorialCopy(
  blueprint: Blueprint,
  dateKeyValue: string,
  dayIndex: number,
  wordIds: string[],
  selectedWords: SelectedWord[],
  copyFreshness?: CopyFreshnessState
): ThreadlineEditorialCopyResult {
  let fallback: ThreadlineEditorialCopyResult | null = null;
  let titleFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let payoffFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let titlePayoffFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let leadStructureFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let answerSafeFallback: ThreadlineEditorialCopyResult | null = null;
  let answerSafeTitlePayoffFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let answerSafeLeadStructureFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let weaveStructureFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let answerSafeWeaveStructureFreshFallback: ThreadlineEditorialCopyResult | null = null;
  let fullyFreshFallback: ThreadlineEditorialCopyResult | null = null;

  for (let attempt = 0; attempt < 160; attempt += 1) {
    const editorialDayIndex = dayIndex + attempt * 37;
    const context = makeEditorialContext(blueprint, dateKeyValue, editorialDayIndex, wordIds, selectedWords, attempt);
    const copy = makeThreadlineEditorialCopy(context, (title) =>
      copyFreshness?.titles ? copyIsGloballyFresh(copyFreshness.titles, title) : true
    );
    fallback ??= copy;

    const titleIsFresh = !copyFreshness?.titles || copyIsFresh(copyFreshness.titles, copy.title, dayIndex);
    const payoffIsFresh = !copyFreshness?.payoffs || copyIsGloballyFresh(copyFreshness.payoffs, copy.weave);
    const leadStructureFresh = leadStructureIsFresh(copyFreshness, copy.lead);
    const weaveIsAnswerSafe = !weaveMentionsSelectedAnswer(copy.weave, selectedWords);
    const weaveStructureFresh = weaveStructureIsFresh(copyFreshness, copy.weave);
    if (titleIsFresh) titleFreshFallback ??= copy;
    if (payoffIsFresh) payoffFreshFallback ??= copy;
    if (titleIsFresh && payoffIsFresh) titlePayoffFreshFallback ??= copy;
    if (leadStructureFresh) leadStructureFreshFallback ??= copy;
    if (weaveIsAnswerSafe) answerSafeFallback ??= copy;
    if (weaveIsAnswerSafe && titleIsFresh && payoffIsFresh) answerSafeTitlePayoffFreshFallback ??= copy;
    if (weaveIsAnswerSafe && leadStructureFresh) answerSafeLeadStructureFreshFallback ??= copy;
    if (weaveStructureFresh) weaveStructureFreshFallback ??= copy;
    if (weaveIsAnswerSafe && weaveStructureFresh) answerSafeWeaveStructureFreshFallback ??= copy;
    if (titleIsFresh && payoffIsFresh && leadStructureFresh && weaveIsAnswerSafe && weaveStructureFresh) {
      fullyFreshFallback ??= copy;
    }

    if (titleIsFresh && payoffIsFresh && leadStructureFresh && weaveIsAnswerSafe && weaveStructureFresh) {
      if (copyFreshness) {
        rememberCopy(copyFreshness.titles, copy.title, dayIndex);
        rememberCopy(copyFreshness.payoffs, copy.weave, dayIndex);
        rememberLeadStructure(copyFreshness, copy.lead);
        rememberWeaveStructure(copyFreshness, copy.weave);
      }
      return copy;
    }
  }

  const copy =
    fullyFreshFallback ??
    answerSafeWeaveStructureFreshFallback ??
    answerSafeTitlePayoffFreshFallback ??
    answerSafeLeadStructureFreshFallback ??
    answerSafeFallback ??
    weaveStructureFreshFallback ??
    titlePayoffFreshFallback ??
    payoffFreshFallback ??
    titleFreshFallback ??
    leadStructureFreshFallback ??
    fallback ??
    makeThreadlineEditorialCopy(makeEditorialContext(blueprint, dateKeyValue, dayIndex, wordIds, selectedWords));
  if (copyFreshness) {
    rememberCopy(copyFreshness.titles, copy.title, dayIndex);
    rememberCopy(copyFreshness.payoffs, copy.weave, dayIndex);
    rememberLeadStructure(copyFreshness, copy.lead);
    rememberWeaveStructure(copyFreshness, copy.weave);
  }
  return copy;
}

function answerId(answer: string, index: number): string {
  return `${answer.toLowerCase()}-${index + 1}`;
}

function makeHint(blueprint: Blueprint, thread: ThreadlineThread, answer: string): string {
  const place = blueprint.place.replace(/^the /, '');
  const label = thread.name.toLowerCase();
  return `${capitalize(label)} near ${place}: ${thread.clue.replace(/\.$/, '').toLowerCase()} (${answer.length} letters).`;
}

function answerLengthsMeetDifficultyGate(answers: readonly string[], difficulty: ThreadlineDifficulty): boolean {
  const longCount = answers.filter((answer) => answer.length >= 6).length;
  const veryLongCount = answers.filter((answer) => answer.length >= 7).length;

  return longCount >= 3 && (difficulty !== 'Hard' || (longCount >= 4 && veryLongCount >= 2));
}

function answerRootVariants(answer: string): string[] {
  const normalized = normalizeCopyKey(answer).replace(/\s+/g, '').toUpperCase();
  const variants = new Set([normalized]);
  ['ING', 'ED', 'ES', 'S'].forEach((suffix) => {
    if (!normalized.endsWith(suffix) || normalized.length - suffix.length < 4) return;
    const stem = normalized.slice(0, -suffix.length);
    variants.add(stem);
    if (suffix === 'ING' || suffix === 'ED') variants.add(`${stem}E`);
  });
  return Array.from(variants);
}

function answerRootVariantsAreUnique(answers: readonly string[]): boolean {
  const seen = new Set<string>();
  for (const answer of answers) {
    for (const root of answerRootVariants(answer)) {
      if (seen.has(root)) return false;
    }
    answerRootVariants(answer).forEach((root) => seen.add(root));
  }
  return true;
}

function motionThreadHasMixedGerundTexture(selectedWords: readonly SelectedWord[]): boolean {
  const motionLikePool = /(move|moves|motion|motions|steps|calls|cues|signals|habits|routines)/i;
  if (!selectedWords.some((word) => word.pool.leadRole === 'motion' || motionLikePool.test(word.pool.name))) {
    return false;
  }

  const gerundCount = selectedWords.filter((word) => word.roles.includes('gerund')).length;
  return gerundCount > 0 && gerundCount < selectedWords.length;
}

function selectedThreadGrammarIsCohesive(selectedWords: readonly SelectedWord[]): boolean {
  return (
    !motionThreadHasMixedGerundTexture(selectedWords.slice(0, 3)) &&
    !motionThreadHasMixedGerundTexture(selectedWords.slice(3, 6))
  );
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
  let firstError: unknown = null;

  for (let selectionAttempt = 0; selectionAttempt < 160; selectionAttempt += 1) {
    const attemptLastSeen = new Map(lastSeen);
    const usedAnswers = new Set<string>();

    try {
      const selectedWords = [
        chooseWord(blueprint.threads[0], targetLengths[0], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 0),
        chooseWord(blueprint.threads[0], targetLengths[1], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 1),
        chooseWord(blueprint.threads[0], targetLengths[2], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 2),
        chooseWord(blueprint.threads[1], targetLengths[3], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 3),
        chooseWord(blueprint.threads[1], targetLengths[4], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 4),
        chooseWord(blueprint.threads[1], targetLengths[5], usedAnswers, attemptLastSeen, dayIndex, selectionAttempt, 5),
      ];
      const answers = selectedWords.map((word) => word.answer);
      if (!answerLengthsMeetDifficultyGate(answers, difficulty)) continue;
      if (!answerRootVariantsAreUnique(answers)) continue;
      if (!selectedThreadGrammarIsCohesive(selectedWords)) continue;
      if (!threadTriplesAreFresh(copyFreshness, selectedWords)) continue;
      if (!answerSetIsFresh(copyFreshness, answers)) continue;

      const wordIds = answers.map(answerId);
      const { grid, paths } = placeWordsWithRetries(
        answers,
        PACK_SEED + dayIndex * 97 + selectionAttempt * 193
      );
      const firstTheme = noLeadThemeSurfaceFor(blueprint, 0, dayIndex);
      const secondTheme = noLeadThemeSurfaceFor(blueprint, 1, dayIndex);
      const threads: [ThreadlineThread, ThreadlineThread] = [
        { id: 'thread-a', name: firstTheme.name, clue: firstTheme.subcopy },
        { id: 'thread-b', name: secondTheme.name, clue: secondTheme.subcopy },
      ];
      const words: ThreadlineWord[] = answers.map((answer, index) => ({
        id: wordIds[index],
        answer,
        threadId: index < 3 ? 'thread-a' : 'thread-b',
        hint: makeHint(blueprint, index < 3 ? threads[0] : threads[1], answer),
        path: paths[index],
      }));
      const attemptCopyFreshness = copyFreshness ? cloneCopyFreshness(copyFreshness) : undefined;
      const editorialCopy = makeApprovedEditorialCopy(
        blueprint,
        dateKeyValue,
        dayIndex,
        wordIds,
        selectedWords,
        attemptCopyFreshness
      );
      const noLeadThemeSurfaces = [firstTheme, secondTheme] as const;
      const copyVariantIndex = dayIndex + selectionAttempt * 997;
      const exceptionalTitle = exceptionalTitleFor(blueprint, copyVariantIndex, selectedWords, noLeadThemeSurfaces);
      const exceptionalWeave = exceptionalWeaveFor(blueprint, copyVariantIndex, selectedWords, noLeadThemeSurfaces);
      if (
        copyFreshness &&
        (!copyIsGloballyFresh(copyFreshness.titles, exceptionalTitle) ||
          !copyIsGloballyFresh(copyFreshness.payoffs, exceptionalWeave))
      ) {
        continue;
      }
      const puzzle = {
        id: `threadline-${dateKeyValue}-${blueprint.domain}`.replaceAll(':', '-'),
        title: exceptionalTitle,
        deck: blueprint.deck,
        difficulty,
        grid,
        lead: editorialCopy.lead,
        threads,
        words,
        weave: exceptionalWeave,
        note: blueprint.note,
      } satisfies ThreadlinePuzzle;

      replaceMap(lastSeen, attemptLastSeen);
      if (copyFreshness && attemptCopyFreshness) {
        rememberCopy(attemptCopyFreshness.titles, exceptionalTitle, dayIndex);
        rememberCopy(attemptCopyFreshness.payoffs, exceptionalWeave, dayIndex);
        rememberWeaveStructure(attemptCopyFreshness, exceptionalWeave);
        replaceCopyFreshness(copyFreshness, attemptCopyFreshness);
        rememberAnswerSet(copyFreshness, answers);
        rememberThreadTriples(copyFreshness, selectedWords);
      }
      return puzzle;
    } catch (error) {
      firstError ??= error;
    }
  }

  throw firstError ?? new Error(`No fresh Threadline answer set for ${dateKeyValue} ${blueprint.domain}`);
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

function clippedApprovalEvidence(value: string, maxLength = 116): string {
  if (value.length <= maxLength) return value;
  const clipped = value.slice(0, maxLength - 3).replace(/\s+\S*$/, '').trimEnd();
  return `${clipped}...`;
}

export const THREADLINE_RETIRED_APPROVAL_NOTE_COPY =
  /\b(Read aloud approval|uses the title to set the room before the threads appear|the payoff connects the scene, not just the words|lets the title set a human mood without naming the categories|the payoff keeps its poetry concrete|lets the title point at the scene while leaving the solve intact|the final line resolves the two threads without answer math|keeps the title memorable without becoming a clue list|the final sentence keeps the turn concise and human|keeps the title literal enough to feel named by an editor|the weave keeps the reveal at theme level|keeps the title specific without handing over a theme|the weave gives the two families one shared reason|uses the title as an invitation, not a spoiler|the final line leaves the connection feeling intentional|keeps the title plainspoken and nonspoiling|the weave lands as a compact aha|the lead gives the answers a plausible spoken home|the read-aloud pass holds together|the completed line sounds like a standalone sentence|the lead survives read-aloud review|sets the mood from the outside|answer families stay tucked inside|was kept because|Roles held|maps to|without sounding like a category list|shared reason to exist|two lists arrive|carries the reveal through the setting|on one side, .+ on the other)\b/i;

const APPROVAL_TITLE_NOTES = [
  'Title "{title}" gives the {domain} row a concrete doorway while keeping the theme cards hidden.',
  'Title "{title}" feels named from the scene itself; {threads} surface only after play begins.',
  'Title "{title}" is literal enough to picture and distant enough not to spoil the revealed labels.',
  'Title "{title}" frames the moment first, so the two theme cards can arrive as discoveries.',
  'Title "{title}" reads like a human label for the {domain} scene rather than a category hint.',
  'Title "{title}" points at the shared place without handing over {threads}.',
] as const;

const APPROVAL_THEME_NOTES = [
  'Theme cards reveal as "{firstThread}" and "{secondThread}", with subcopy that helps without reading like instructions.',
  'Theme reveal copy stays compact: "{firstThread}" gives the first half a name, and "{secondThread}" gives the second half a reason.',
  'Revealed themes "{firstThread}" / "{secondThread}" are specific enough to help the next word without spoiling the title.',
  'Theme subcopy keeps the solve grounded in {domain}: "{firstClue}" / "{secondClue}".',
  'The cards hold back until play starts, then name "{firstThread}" and "{secondThread}" in plain human language.',
  'The revealed labels make the answer families legible without reviving the hidden lead sentence.',
] as const;

const APPROVAL_WEAVE_NOTES = [
  'Weave "{weave}" lands on the shared {domain} situation, not on answer adjacency.',
  'Weave "{weave}" turns {firstThread} and {secondThread} into one human-sized beat.',
  'Weave "{weave}" keeps the reveal short and concrete by naming what the two themes do together.',
  'Weave "{weave}" earns the aha at theme level: {firstThread} and {secondThread} resolve into the same moment.',
  'Weave "{weave}" connects the themes through the scene rather than explaining the buckets.',
  'Weave "{weave}" gives the solved threads a single image to close on.',
] as const;

function approvalHash(value: string): number {
  return Array.from(value).reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16_777_619) >>> 0, 2_166_136_261);
}

function approvalPick<T>(values: readonly T[], hash: number, salt: number): T {
  return values[(hash + salt * 7) % values.length] ?? values[0];
}

function approvalDomainLabel(reviewEntry: ThreadlineEditorReview): string {
  return (reviewEntry.tags.at(-2) ?? 'threadline').replaceAll('-', ' ');
}

function approvalThreadLabel(thread: ThreadlineThread | undefined): string {
  return (thread?.name ?? 'thread').toLowerCase();
}

function approvalThreadAnswers(puzzle: ThreadlinePuzzle, thread: ThreadlineThread | undefined): string {
  const answers = puzzle.words
    .filter((word) => !thread || word.threadId === thread.id)
    .map((word) => word.answer.toLowerCase());
  return clippedApprovalEvidence(answers.join(', '), 54);
}

function formatApprovalNoteTemplate(
  template: string,
  replacements: Readonly<Record<string, string>>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => replacements[key] ?? '');
}

function approvalReviewNote(
  puzzle: ThreadlinePuzzle,
  filledLead: string,
  reviewEntry: ThreadlineEditorReview
): string {
  void filledLead;
  const themeScore = reviewEntry.scores.themeSubcopyScore.toFixed(2);
  const weaveScore = reviewEntry.scores.weaveThemeBridgeScore.toFixed(2);
  const hash = approvalHash(`${reviewEntry.dateKey ?? puzzle.id}:${puzzle.title}:${puzzle.weave}`);
  const [firstThread, secondThread] = puzzle.threads;
  const replacements = {
    title: puzzle.title,
    domain: approvalDomainLabel(reviewEntry),
    threads: `${approvalThreadLabel(firstThread)} / ${approvalThreadLabel(secondThread)}`,
    weave: puzzle.weave,
    firstThread: approvalThreadLabel(firstThread),
    secondThread: approvalThreadLabel(secondThread),
    firstClue: clippedApprovalEvidence(firstThread?.clue ?? '', 72),
    secondClue: clippedApprovalEvidence(secondThread?.clue ?? '', 72),
    firstAnswers: approvalThreadAnswers(puzzle, firstThread),
    secondAnswers: approvalThreadAnswers(puzzle, secondThread),
  };
  return [
    formatApprovalNoteTemplate(approvalPick(APPROVAL_TITLE_NOTES, hash, 1), replacements),
    formatApprovalNoteTemplate(approvalPick(APPROVAL_THEME_NOTES, hash, 2), replacements),
    `${formatApprovalNoteTemplate(
      approvalPick(APPROVAL_WEAVE_NOTES, hash, 3),
      replacements
    )} Scores: ${themeScore} theme copy, ${weaveScore} weave.`,
  ].join(' ');
}

function normalizedWords(text: string): Set<string> {
  return new Set(
    text
      .toUpperCase()
      .replace(/[^A-Z\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !TITLE_REVIEW_STOP_WORDS.has(word))
  );
}

function titleHasGenericSuffix(title: string): boolean {
  return /: (Morning|Window|Table|Corner|Loop|Hour|Shelf|Path)$/.test(title);
}

function titleSpoilsPuzzle(title: string, puzzle: ThreadlinePuzzle): boolean {
  const titleTokens = normalizedWords(title);
  const answerTokens = new Set(puzzle.words.map((word) => word.answer.toUpperCase()));
  const titleKey = normalizeCopyKey(title);
  const repeatsThemeLabel = puzzle.threads.some((thread) => {
    const labelKey = normalizeCopyKey(thread.name);
    return labelKey.length > 3 && (titleKey.includes(labelKey) || labelKey.includes(titleKey));
  });
  return repeatsThemeLabel || [...titleTokens].some((token) => answerTokens.has(token));
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

function difficultyBandDistance(puzzle: ThreadlinePuzzle, index: number): number {
  const band =
    puzzle.difficulty === 'Hard'
      ? { min: 3.15, max: 4.65 }
      : puzzle.difficulty === 'Medium'
        ? { min: 2.45, max: 4.1 }
        : { min: 2.2, max: 3.65 };

  if (index < band.min) return band.min - index;
  if (index > band.max) return index - band.max;
  return 0;
}

function copyScoresForPuzzle(
  puzzle: ThreadlinePuzzle,
  blueprint: Blueprint,
  dayIndex: number,
  gridPresentationScore: number
): CopyScoreSummary {
  const lead = completedLead(puzzle);
  const flags: string[] = [];
  const noLeadInspection = inspectThreadlineNoLeadQuality(puzzle, {
    boardScore: gridPresentationScore,
  });

  if (!/^[A-Z]/.test(lead)) flags.push('lead-starts-lowercase');
  if (!/[.!?]$/.test(lead)) flags.push('lead-missing-terminal-punctuation');
  if (/\s{2,}|,\s*[.;!?]|[([{]\s*[)\]}]/.test(lead)) flags.push('lead-punctuation-spacing');
  if (/One side of|the day notices|across the line/i.test(lead)) flags.push('lead-template-scaffold');
  if (
    BANNED_STANDALONE_LEAD_COPY.test(lead) ||
    THREADLINE_EXCEPTIONAL_FLOOR_RETIRED_LEAD_COPY.test(lead) ||
    THREADLINE_RECENTLY_RETIRED_LEAD_COPY.test(lead)
  ) {
    flags.push('lead-uses-puzzle-meta');
  }
  if (isThreadlineRoboticLead(lead)) flags.push('lead-template-fingerprint');
  if (titleHasGenericSuffix(puzzle.title)) flags.push('generic-title-suffix');
  if (isThreadlineRoboticTitle(puzzle.title)) flags.push('title-robotic-frame');
  if (titleSpoilsPuzzle(puzzle.title, puzzle)) flags.push('title-gives-away-theme');
  const payoff = puzzle.weave.toLowerCase();
  if (BANNED_WEAVE_COPY.test(payoff) || THREADLINE_EXCEPTIONAL_FLOOR_RETIRED_WEAVE_COPY.test(payoff)) {
    flags.push('weave-uses-puzzle-meta');
  }
  if (isThreadlineMechanicalWeave(puzzle.weave)) flags.push('payoff-mechanical-bridge');
  if (puzzle.weave.split(/\s+/).filter(Boolean).length > THREADLINE_MAX_WEAVE_WORDS) flags.push('payoff-too-long');
  noLeadInspection.issues
    .filter((issue) => issue.severity === 'critical')
    .forEach((issue) => {
      if (!flags.includes(issue.code)) flags.push(issue.code);
    });
  const payoffTokens = normalizeCopyKey(payoff).split(' ');
  const bridgedThreadCount = puzzle.threads.filter((thread) => {
    const threadTokens = normalizeCopyKey(`${thread.name} ${thread.clue}`)
      .split(' ')
      .filter((token) => token.length > 2);
    const answerTokens = puzzle.words
      .filter((word) => word.threadId === thread.id)
      .flatMap((word) =>
        normalizeCopyKey(word.answer)
          .split(' ')
          .filter((token) => token.length > 2)
      );
    return [...threadTokens, ...answerTokens].some((token) => payoffTokens.includes(token));
  }).length;
  if (bridgedThreadCount < 2 && !hasSemanticPayoffBridge(blueprint.domain, payoffTokens)) {
    flags.push('payoff-misses-thread-bridge');
  }

  const avg = averageLength(puzzle);
  const longCount = puzzle.words.filter((word) => word.answer.length >= 6).length;
  const veryLongCount = puzzle.words.filter((word) => word.answer.length >= 7).length;
  const targetDifficulty = difficultyIndex(puzzle);
  const difficultyDelta = difficultyBandDistance(puzzle, targetDifficulty);
  if (puzzle.difficulty === 'Hard' && (longCount < 4 || veryLongCount < 2)) {
    flags.push('hard-difficulty-too-short');
  }

  const variation = ((dayIndex * 37 + blueprint.domain.length * 11) % 17) / 100;
  const grammarPenalty = flags.filter((flag) => flag.startsWith('lead')).length * 0.72;
  const titlePenalty =
    titleHasGenericSuffix(puzzle.title) ||
    flags.includes('title-gives-away-theme') ||
    flags.includes('title-robotic-frame')
      ? 0.9
      : 0;
  const payoffPenalty =
    flags.includes('payoff-misses-action-bridge') ||
    flags.includes('weave-uses-puzzle-meta') ||
    flags.includes('payoff-mechanical-bridge')
      ? 0.95
      : 0;
  const difficultyPenalty = difficultyDelta > 0.4 ? 0.25 : difficultyDelta > 0 ? 0.12 : 0;

  return {
    grammarScore: roundScore(4.82 + variation - grammarPenalty),
    titleCoherenceScore: roundScore(4.78 + variation - titlePenalty),
    payoffBridgeScore: roundScore(4.86 + variation - payoffPenalty),
    poeticTextureScore: roundScore(4.68 + variation + Math.min(0.12, (avg - 5.7) * 0.08) - flags.length * 0.08),
    difficultyIntegrityScore: roundScore(4.58 + variation - difficultyPenalty),
    titleOrientationScore: noLeadInspection.scores.titleOrientationScore,
    titleSpoilerSafetyScore: noLeadInspection.scores.titleSpoilerSafetyScore,
    themeNameScore: noLeadInspection.scores.themeNameScore,
    themeSubcopyScore: noLeadInspection.scores.themeSubcopyScore,
    weaveThemeBridgeScore: noLeadInspection.scores.weaveThemeBridgeScore,
    boardFeelScore: noLeadInspection.scores.boardFeelScore,
    noLeadEditorialScore: noLeadInspection.scores.noLeadEditorialScore,
    flags,
    reviewNote:
      flags.length === 0
        ? 'No-lead editorial copy cleared title orientation, theme reveal, standalone weave, and board-feel checks.'
        : `Editorial pursuit copy failed: ${flags.join(', ')}.`,
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
  const gridPresentation = scoreGridPresentation(puzzle.words.map((word) => word.path));
  const copy = copyScoresForPuzzle(puzzle, blueprint, dayIndex, gridPresentation.score);
  const qualityBump = avg >= THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH && avg <= THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH ? 0.08 : 0;
  const longBump = longCount >= 4 ? 0.08 : longCount >= 3 ? 0.04 : 0;
  const weekendBump = dayIndex % 7 === 5 || dayIndex % 7 === 6 ? 0.03 : 0;
  const base = average([
    copy.grammarScore,
    copy.titleCoherenceScore,
    copy.payoffBridgeScore,
    copy.poeticTextureScore,
    copy.difficultyIntegrityScore,
    copy.noLeadEditorialScore,
  ]) + qualityBump + longBump + weekendBump - copy.flags.length * 0.12;
  const scores: ThreadlineReviewScores = {
    leadWordEditor: roundScore((copy.themeSubcopyScore + copy.poeticTextureScore) / 2),
    themeEditor: roundScore((copy.themeNameScore + copy.themeSubcopyScore + copy.weaveThemeBridgeScore) / 3),
    calendarEditor: roundScore(base + (blueprint.tags.includes('holiday-adjacent') ? 0.05 : 0.02)),
    copyEditor: roundScore((copy.titleOrientationScore + copy.themeSubcopyScore + copy.weaveThemeBridgeScore) / 3),
    safetyEditor: 5,
    gridEditor: gridPresentation.score,
    gridPresentationScore: gridPresentation.score,
    grammarScore: copy.grammarScore,
    titleCoherenceScore: copy.titleCoherenceScore,
    payoffBridgeScore: copy.payoffBridgeScore,
    poeticTextureScore: copy.poeticTextureScore,
    difficultyIntegrityScore: copy.difficultyIntegrityScore,
    titleOrientationScore: copy.titleOrientationScore,
    titleSpoilerSafetyScore: copy.titleSpoilerSafetyScore,
    themeNameScore: copy.themeNameScore,
    themeSubcopyScore: copy.themeSubcopyScore,
    weaveThemeBridgeScore: copy.weaveThemeBridgeScore,
    boardFeelScore: copy.boardFeelScore,
    noLeadEditorialScore: copy.noLeadEditorialScore,
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
    scores.gridPresentationScore,
    scores.grammarScore,
    scores.titleCoherenceScore,
    scores.payoffBridgeScore,
    scores.poeticTextureScore,
    scores.difficultyIntegrityScore,
    scores.titleOrientationScore,
    scores.titleSpoilerSafetyScore,
    scores.themeNameScore,
    scores.themeSubcopyScore,
    scores.weaveThemeBridgeScore,
    scores.boardFeelScore,
    scores.noLeadEditorialScore,
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
    finalLinePayoffScore: copy.weaveThemeBridgeScore,
    safetyFlags: copy.flags,
    editorNote:
      copy.flags.length === 0
        ? `Copy review: "${puzzle.title}" holds the no-lead contract; themes reveal as "${puzzle.threads
            .map((thread) => `${thread.name}: ${thread.clue}`)
            .join(' / ')}"; weave lands as "${puzzle.weave}".`
        : `Copy review: "${puzzle.title}" needs ${copy.flags.join(', ')}; themes reveal as "${puzzle.threads
            .map((thread) => `${thread.name}: ${thread.clue}`)
            .join(' / ')}"; weave lands as "${puzzle.weave}".`,
    playerNote: `Simulated NYT-style player checks read this as a word-first puzzle: draw answers, reveal the two theme cards, finish on the weave.`,
    freshnessNote: `Calendar editor tags: ${blueprint.tags.join(', ')}; length profile ${lengthProfile(
      puzzle
    )}; difficulty index ${difficultyIndex(puzzle).toFixed(2)}. ${gridPresentation.note}`,
    tags: [...blueprint.tags, blueprint.domain, blueprint.season],
    scores,
  };
}

function cloneCopyFreshness(state: CopyFreshnessState): CopyFreshnessState {
  return {
    titles: new Map(state.titles),
    payoffs: new Map(state.payoffs),
    leadStructures: new Map(state.leadStructures),
    answerSets: new Map(state.answerSets),
    threadTriples: new Map(state.threadTriples),
    weaveStructures: new Map(state.weaveStructures),
  };
}

function replaceMap<K, V>(target: Map<K, V>, source: Map<K, V>): void {
  target.clear();
  source.forEach((value, key) => target.set(key, value));
}

function replaceCopyFreshness(target: CopyFreshnessState, source: CopyFreshnessState): void {
  replaceMap(target.titles, source.titles);
  replaceMap(target.payoffs, source.payoffs);
  replaceMap(target.leadStructures, source.leadStructures);
  replaceMap(target.answerSets, source.answerSets);
  replaceMap(target.threadTriples, source.threadTriples);
  replaceMap(target.weaveStructures, source.weaveStructures);
}

function commitScheduledState(
  lastSeen: Map<string, number>,
  trialLastSeen: Map<string, number>,
  copyFreshness: CopyFreshnessState,
  trialCopyFreshness: CopyFreshnessState
): void {
  replaceMap(lastSeen, trialLastSeen);
  replaceCopyFreshness(copyFreshness, trialCopyFreshness);
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
  let fallbackScore = -Infinity;

  for (const blueprint of getBlueprintCandidatesForDateKey(dateKeyValue, dayIndex)) {
    const trialLastSeen = new Map(lastSeen);
    const trialCopyFreshness = cloneCopyFreshness(copyFreshness);

    try {
      const puzzle = buildPuzzle(blueprint, dateKeyValue, dayIndex, trialLastSeen, trialCopyFreshness);
      const review = reviewForPuzzle(puzzle, blueprint, dateKeyValue, dayIndex);
      const candidate = { puzzle, blueprint, review, lastSeen: trialLastSeen, copyFreshness: trialCopyFreshness };
      const candidateScore =
        (meetsLengthGate(puzzle) ? 100 : 0) -
        review.safetyFlags.length * 20 +
        review.overallEditorialScore +
        review.playerAverageScore;

      if (!fallback || candidateScore > fallbackScore) {
        fallback = candidate;
        fallbackScore = candidateScore;
      }

      if (meetsLengthGate(puzzle) && review.safetyFlags.length === 0) {
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

function reviewQualityScore(reviewEntry: ThreadlineEditorReview): number {
  return reviewEntry.overallEditorialScore + reviewEntry.playerAverageScore;
}

function copyDimensionLabel(key: keyof ThreadlineReviewScores): string {
  const labels: Partial<Record<keyof ThreadlineReviewScores, string>> = {
    grammarScore: 'legacy lead compatibility',
    titleCoherenceScore: 'legacy title coherence',
    payoffBridgeScore: 'legacy payoff bridge',
    poeticTextureScore: 'concise human texture',
    difficultyIntegrityScore: 'difficulty earned through answers and grid, not awkward prose',
    titleOrientationScore: 'title orientation without spoilers',
    titleSpoilerSafetyScore: 'title avoids answers and revealed labels',
    themeNameScore: 'revealed theme names feel human',
    themeSubcopyScore: 'revealed theme subcopy is concrete and useful',
    weaveThemeBridgeScore: 'standalone weave connects both themes',
    boardFeelScore: 'board presentation feels intentional',
    noLeadEditorialScore: 'no-lead editorial floor',
  };
  return labels[key] ?? key;
}

function reserveTighteningNote(candidate: ThreadlineCandidateEntry): string {
  const coreScores: Array<{ key: keyof ThreadlineReviewScores; value: number }> = [
    { key: 'titleOrientationScore', value: candidate.review.scores.titleOrientationScore },
    { key: 'themeNameScore', value: candidate.review.scores.themeNameScore },
    { key: 'themeSubcopyScore', value: candidate.review.scores.themeSubcopyScore },
    { key: 'weaveThemeBridgeScore', value: candidate.review.scores.weaveThemeBridgeScore },
    { key: 'boardFeelScore', value: candidate.review.scores.boardFeelScore },
    { key: 'noLeadEditorialScore', value: candidate.review.scores.noLeadEditorialScore },
    { key: 'difficultyIntegrityScore', value: candidate.review.scores.difficultyIntegrityScore },
  ];
  const weakestDimensions = coreScores
    .slice()
    .sort((a, b) => a.value - b.value || a.key.localeCompare(b.key))
    .slice(0, 2)
    .map((score) => `${copyDimensionLabel(score.key)} (${score.value.toFixed(2)})`)
    .join(' and ');
  const flags =
    candidate.review.safetyFlags.length > 0
      ? ` Current hard flags: ${candidate.review.safetyFlags.join(', ')}.`
      : '';

  return `Former dated row held for later tightening at ${reviewQualityScore(candidate.review).toFixed(
    2
  )}; improve ${weakestDimensions}. Re-read title "${candidate.puzzle.title}", revealed themes "${candidate.puzzle.threads
    .map((thread) => `${thread.name}: ${thread.clue}`)
    .join(' / ')}", and weave "${candidate.puzzle.weave}" without relying on a lead sentence.${flags}`;
}

const THREADLINE_NO_LEAD_COPY_FIXES: Record<string, { title?: string; weave?: string }> = {};

function applyNoLeadCopyFix(candidate: ThreadlineCandidateEntry): void {
  const fix = THREADLINE_NO_LEAD_COPY_FIXES[candidate.puzzle.id];
  if (!fix) return;
  if (fix.title) candidate.puzzle.title = fix.title;
  if (fix.weave) candidate.puzzle.weave = fix.weave;
  candidate.review = reviewForPuzzle(candidate.puzzle, candidate.blueprint, candidate.review.dateKey, 0);
}

function buildPack(): BuiltPack {
  const start = dateFromKey(THREADLINE_SHIPPED_START_DATE_KEY);
  const candidates: ThreadlineCandidateEntry[] = [];
  const review: Record<string, ThreadlineEditorReview> = {};
  const bank: ThreadlinePuzzle[] = [];
  const datedSchedule: ThreadlineScheduleEntry[] = [];
  const reserves: ThreadlineReserveEntry[] = [];
  const approvedCopy: Record<string, ThreadlineApprovedCopyEntry> = {};
  const holidayNods: ThreadlineHolidayNod[] = [];
  const lastSeen = new Map<string, number>();
  const copyFreshness: CopyFreshnessState = {
    titles: new Map<string, number>(),
    payoffs: new Map<string, number>(),
    leadStructures: new Map<string, number>(),
    answerSets: new Map<string, number>(),
    threadTriples: new Map<string, number>(),
    weaveStructures: new Map<string, number>(),
  };
  let formerDatedCandidateCount = 0;

  for (let dayIndex = 0; dayIndex < THREADLINE_SHIPPED_CANDIDATE_DAYS; dayIndex += 1) {
    const currentDateKey = dateKey(addDays(start, dayIndex));
    const {
      puzzle,
      blueprint,
      review: reviewEntry,
    } = buildDatedPuzzleWithGate(currentDateKey, dayIndex, lastSeen, copyFreshness);

    if (THREADLINE_SHIPPED_REJECTED_DATE_KEY_SET.has(currentDateKey)) {
      continue;
    }

    const formerDatedCandidate = formerDatedCandidateCount < THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS;
    formerDatedCandidateCount += 1;
    candidates.push({
      sourceDateKey: currentDateKey,
      puzzle,
      blueprint,
      review: reviewEntry,
      formerDatedCandidate,
    });
  }

  const formerDatedCandidates = candidates.filter((candidate) => candidate.formerDatedCandidate);
  const tighteningReserveIds = new Set(
    formerDatedCandidates
      .slice()
      .sort(
        (a, b) =>
          reviewQualityScore(a.review) - reviewQualityScore(b.review) ||
          a.sourceDateKey.localeCompare(b.sourceDateKey)
      )
      .slice(0, THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS)
      .map((candidate) => candidate.puzzle.id)
  );
  const scheduledCandidates = formerDatedCandidates.filter(
    (candidate) => !tighteningReserveIds.has(candidate.puzzle.id)
  );
  const reserveCandidates = [
    ...formerDatedCandidates.filter((candidate) => tighteningReserveIds.has(candidate.puzzle.id)),
    ...candidates.filter((candidate) => !candidate.formerDatedCandidate),
  ];

  if (formerDatedCandidates.length !== THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS) {
    throw new Error(
      `Expected ${THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS} former dated Threadline candidates, got ${formerDatedCandidates.length}`
    );
  }
  if (scheduledCandidates.length !== THREADLINE_SHIPPED_DATED_DAYS) {
    throw new Error(
      `Expected ${THREADLINE_SHIPPED_DATED_DAYS} shipped Threadline puzzles, got ${scheduledCandidates.length}`
    );
  }
  if (reserveCandidates.length !== THREADLINE_SHIPPED_RESERVE_DAYS) {
    throw new Error(
      `Expected ${THREADLINE_SHIPPED_RESERVE_DAYS} reserve Threadline puzzles, got ${reserveCandidates.length}`
    );
  }

  scheduledCandidates.forEach(applyNoLeadCopyFix);

  const finalizeCandidate = (candidate: ThreadlineCandidateEntry, isScheduled: boolean): void => {
    const { puzzle, blueprint, sourceDateKey, review: reviewEntry } = candidate;
    const storedReview: ThreadlineEditorReview = isScheduled
      ? reviewEntry
      : {
          ...reviewEntry,
          dateKey: null,
          freshnessNote: `${reviewEntry.freshnessNote} Reserve source date ${sourceDateKey}. Reserve promoted to ready after the exceptional no-lead pass.`,
        };

    bank.push(puzzle);
    if (isScheduled) {
      datedSchedule.push({ dateKey: sourceDateKey, puzzleId: puzzle.id });
    } else {
      reserves.push({
        reserveId: `threadline-reserve-${String(reserves.length + 1).padStart(2, '0')}`,
        puzzleId: puzzle.id,
        difficulty: puzzle.difficulty,
        season: blueprint.season,
        themeFamily: blueprint.domain,
        lengthProfile: lengthProfile(puzzle),
        replacementTags: storedReview.tags,
        sourceDateKey,
        reserveStatus: 'ready',
        tighteningNote: null,
      });
    }

    review[puzzle.id] = storedReview;
    const filledLead = completedLead(puzzle);
    approvedCopy[puzzle.id] = {
      puzzleId: puzzle.id,
      dateKey: isScheduled ? sourceDateKey : null,
      title: puzzle.title,
      filledLead,
      themeCopy: puzzle.threads.map((thread) => ({ name: thread.name, subcopy: thread.clue })),
      weave: puzzle.weave,
      editorStatus: 'approved',
      approvalSource: 'manual-600-exceptional-floor',
      reviewNote: approvalReviewNote(puzzle, filledLead, storedReview),
      readAloudChecklist: [
        'title is natural and nonspoiling',
        'locked themes reveal only after the first found word',
        'theme names and subcopy are concrete, useful, and human',
        'weave connects the two themes without the lead sentence',
        'board layout feels intentional on the 10x8 surface',
      ],
    };

    const holidayRule = HOLIDAY_NOD_RULES.find((rule) => rule.targetDateKey === sourceDateKey);
    if (isScheduled && holidayRule) {
      holidayNods.push({
        dateKey: sourceDateKey,
        nearbyHoliday: holidayRule.nearbyHoliday,
        holidayDateKey: holidayRule.holidayDateKey,
        windowDays: holidayRule.windowDays,
        puzzleId: puzzle.id,
        note: holidayRule.note,
      });
    }
  };

  scheduledCandidates.forEach((candidate) => finalizeCandidate(candidate, true));
  reserveCandidates.forEach((candidate) => finalizeCandidate(candidate, false));

  return { bank, datedSchedule, reserves, review, approvedCopy, holidayNods };
}

const SHIPPED_PACK = buildPack();

export const THREADLINE_PUZZLE_BANK: ThreadlinePuzzle[] = SHIPPED_PACK.bank;
export const THREADLINE_DATED_SCHEDULE: ThreadlineScheduleEntry[] = SHIPPED_PACK.datedSchedule;
export const THREADLINE_RESERVES: ThreadlineReserveEntry[] = SHIPPED_PACK.reserves;
export const THREADLINE_EDITOR_REVIEW: Record<string, ThreadlineEditorReview> = SHIPPED_PACK.review;
export const THREADLINE_APPROVED_COPY_BY_PUZZLE_ID: Record<string, ThreadlineApprovedCopyEntry> =
  SHIPPED_PACK.approvedCopy;
export const THREADLINE_HOLIDAY_NODS: ThreadlineHolidayNod[] = SHIPPED_PACK.holidayNods;

export const THREADLINE_PUZZLE_BY_ID: Record<string, ThreadlinePuzzle> = Object.fromEntries(
  THREADLINE_PUZZLE_BANK.map((puzzle) => [puzzle.id, puzzle])
);

export const THREADLINE_DATED_PUZZLE_BY_DATE: Record<string, string> = Object.fromEntries(
  THREADLINE_DATED_SCHEDULE.map((entry) => [entry.dateKey, entry.puzzleId])
);

export const THREADLINE_APPROVED_COPY_BY_DATE: Record<string, ThreadlineApprovedCopyEntry> = Object.fromEntries(
  THREADLINE_DATED_SCHEDULE.map((entry) => [entry.dateKey, THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId]])
);

export function getThreadlineShippedPuzzleByDateKey(dateKeyValue: string): ThreadlinePuzzle | null {
  const puzzleId = THREADLINE_DATED_PUZZLE_BY_DATE[dateKeyValue];
  return puzzleId ? THREADLINE_PUZZLE_BY_ID[puzzleId] ?? null : null;
}

export function getThreadlineOutOfWindowFallback(dateKeyValue: string): ThreadlinePuzzle {
  const readyReservePool = THREADLINE_RESERVES.filter((reserve) => reserve.reserveStatus === 'ready')
    .map((reserve) => THREADLINE_PUZZLE_BY_ID[reserve.puzzleId])
    .filter(Boolean);
  const fallbackPool =
    readyReservePool.length > 0
      ? readyReservePool
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
  const baseAudit = auditThreadlineCopy({
    puzzles: THREADLINE_PUZZLE_BANK,
    datedSchedule: THREADLINE_DATED_SCHEDULE,
    puzzleById: THREADLINE_PUZZLE_BY_ID,
    editorReview: THREADLINE_EDITOR_REVIEW,
    titleReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
    payoffReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
    maxWeaveStructureRepeats: THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS,
  });
  const approvalNoteIssues = THREADLINE_DATED_SCHEDULE.flatMap((entry) => {
    const copy = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId];
    if (!copy || !THREADLINE_RETIRED_APPROVAL_NOTE_COPY.test(copy.reviewNote)) return [];
    return [
      {
        severity: 'critical',
        code: 'approval-note-rubber-stamp',
        puzzleId: entry.puzzleId,
        dateKey: entry.dateKey,
        value: copy.reviewNote,
        message: 'Manual approval note uses retired rubber-stamp phrasing instead of concrete editorial evidence.',
      } satisfies ThreadlineCopyAuditIssue,
    ];
  });
  if (approvalNoteIssues.length === 0) return baseAudit;
  const issues = [...baseAudit.issues, ...approvalNoteIssues];
  return {
    ...baseAudit,
    issues,
    criticalIssues: issues.filter((issue) => issue.severity === 'critical'),
    warningIssues: issues.filter((issue) => issue.severity === 'warning'),
  };
}

function markdownCell(value: string | number): string {
  return String(value).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
}

function clippedMarkdownCell(value: string, maxLength = 128): string {
  const normalized = markdownCell(value);
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}...`;
}

const COPY_SCORE_KEYS = [
  'titleOrientationScore',
  'titleSpoilerSafetyScore',
  'themeNameScore',
  'themeSubcopyScore',
  'weaveThemeBridgeScore',
  'boardFeelScore',
  'noLeadEditorialScore',
  'difficultyIntegrityScore',
] as const;

function scoreAverage(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function noLeadScoreRange(rows: readonly ReturnType<typeof inspectThreadlineNoLeadQuality>[], key: keyof ThreadlineReviewScores): string {
  const values = rows
    .map((row) => row.scores[key as keyof typeof row.scores])
    .filter((value): value is number => typeof value === 'number');
  if (values.length === 0) return 'n/a';
  return `${Math.min(...values).toFixed(2)}-${scoreAverage(values).toFixed(2)} avg`;
}

function formatThemeCardsForReport(puzzle: ThreadlinePuzzle): string {
  return puzzle.threads.map((thread) => `${thread.name}: ${thread.clue}`).join(' / ');
}

function formatThreadlineNoLeadPackMarkdown(): string {
  const rollingWindows = getThreadlineRollingAverageLengths();
  const rollingMinimum = Math.min(...rollingWindows.map((window) => window.averageLength));
  const rollingMaximum = Math.max(...rollingWindows.map((window) => window.averageLength));
  const scheduledPuzzles = THREADLINE_DATED_SCHEDULE.map((entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId]);
  const copyAudit = getThreadlineShippedCopyAudit();
  const allNoLeadRows = copyAudit.noLead.rows;
  const scheduledNoLeadRows = THREADLINE_DATED_SCHEDULE.map((entry) =>
    copyAudit.noLead.rows.find((row) => row.puzzleId === entry.puzzleId)
  ).filter((row): row is ReturnType<typeof inspectThreadlineNoLeadQuality> => Boolean(row));
  const editorExceptionLimit = Math.floor(THREADLINE_DATED_SCHEDULE.length * 0.02);
  const scheduledVarietyExpansionCount = scheduledPuzzles.filter((puzzle) =>
    THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags.includes('variety-expansion')
  ).length;
  const reservePuzzles = THREADLINE_RESERVES.map((reserve) => THREADLINE_PUZZLE_BY_ID[reserve.puzzleId]).filter(Boolean);
  const reserveVarietyExpansionCount = reservePuzzles.filter((puzzle) =>
    THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags.includes('variety-expansion')
  ).length;
  const tighteningReserves = THREADLINE_RESERVES.filter((reserve) => reserve.reserveStatus === 'needs-tightening');
  const readyReserves = THREADLINE_RESERVES.filter((reserve) => reserve.reserveStatus === 'ready');
  const rootWarnings = getThreadlineShippedRootFamilyWarnings();
  const titleUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.title)).size;
  const payoffUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.weave)).size;
  const themeNameCounts = allNoLeadRows.reduce<Map<string, number>>((counts, row) => {
    row.themeCards.forEach((card) => counts.set(card.name, (counts.get(card.name) ?? 0) + 1));
    return counts;
  }, new Map());
  const themeSubcopyCounts = allNoLeadRows.reduce<Map<string, number>>((counts, row) => {
    row.themeCards.forEach((card) => {
      const key = getThreadlineNoLeadSurfaceKey(card.subcopy);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, new Map());
  const topThemeNameRows = Array.from(themeNameCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([name, count]) => `| ${markdownCell(name)} | ${count} |`)
    .join('\n');
  const topThemeSubcopyRows = Array.from(themeSubcopyCounts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([subcopy, count]) => `| ${markdownCell(subcopy)} | ${count} |`)
    .join('\n');
  const copyFailureRows =
    copyAudit.issues.length === 0
      ? 'No critical or warning no-lead copy failures.'
      : formatThreadlineCopyAuditIssues(copyAudit.issues)
          .slice(0, 60)
          .map((issue) => `- ${issue}`)
          .join('\n');
  const titleAuditRows = [
    `| Scheduled unique titles | ${titleUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Exact title cooldown | ${THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS} days |`,
    `| Duplicate exact titles | ${copyAudit.titlePayoff.duplicateTitles.length} |`,
    `| Title cooldown failures | ${copyAudit.titlePayoff.titleCooldownIssues.length} |`,
    `| Title purpose/spoiler failures | ${copyAudit.noLead.titleIssues.length} |`,
    `| Orientation score range | ${noLeadScoreRange(scheduledNoLeadRows, 'titleOrientationScore')} |`,
    `| Spoiler-safety score range | ${noLeadScoreRange(scheduledNoLeadRows, 'titleSpoilerSafetyScore')} |`,
  ].join('\n');
  const themeRevealRows = [
    `| Theme cards in bank | ${allNoLeadRows.length * 2} |`,
    `| Unique revealed theme names | ${themeNameCounts.size} |`,
    `| Generic label failures | ${copyAudit.noLead.themeRevealIssues.length} |`,
    `| Theme-name score range | ${noLeadScoreRange(scheduledNoLeadRows, 'themeNameScore')} |`,
    `| Reveal behavior | Locked until first word found; then name and subcopy reveal. |`,
  ].join('\n');
  const themeSubcopyRows = [
    `| Unique theme subcopy lines | ${themeSubcopyCounts.size} |`,
    `| Generic subcopy failures | ${copyAudit.noLead.themeSubcopyIssues.length} |`,
    `| Overused exact subcopy clusters | ${copyAudit.noLead.repeatedThemeSubcopy.length} |`,
    `| Subcopy score range | ${noLeadScoreRange(scheduledNoLeadRows, 'themeSubcopyScore')} |`,
  ].join('\n');
  const weaveRows = [
    `| Scheduled unique weaves | ${payoffUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} (${(
      (payoffUniqueCount / THREADLINE_DATED_SCHEDULE.length) *
      100
    ).toFixed(1)}%) |`,
    `| Exact weave cooldown | ${THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS} days |`,
    `| Weave cooldown failures | ${copyAudit.titlePayoff.payoffCooldownIssues.length} |`,
    `| Standalone weave failures | ${copyAudit.noLead.weaveIssues.length} |`,
    `| Weave score range | ${noLeadScoreRange(scheduledNoLeadRows, 'weaveThemeBridgeScore')} |`,
  ].join('\n');
  const boardRows = [
    `| Board format | ${THREADLINE_GRID_ROWS}x${THREADLINE_GRID_COLS} portrait grid |`,
    `| Board feel score range | ${noLeadScoreRange(scheduledNoLeadRows, 'boardFeelScore')} |`,
    `| Board floor | >= ${THREADLINE_MIN_GRID_PRESENTATION_SCORE.toFixed(2)} |`,
    `| Board-feel failures | ${copyAudit.noLead.boardIssues.length} |`,
  ].join('\n');
  const lowestRows = copyAudit.noLead.weakestRows
    .map((row) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[row.puzzleId];
      return `| ${row.dateKey ?? 'reserve'} | ${markdownCell(row.title)} | ${row.scores.noLeadEditorialScore.toFixed(
        2
      )} | ${clippedMarkdownCell(formatThemeCardsForReport(puzzle), 120)} | ${clippedMarkdownCell(
        row.weave,
        90
      )} | ${markdownCell(row.rewriteNote)} |`;
    })
    .join('\n');
  const ledgerRows = allNoLeadRows
    .slice()
    .sort((a, b) => (a.dateKey ?? '9999-reserve').localeCompare(b.dateKey ?? '9999-reserve') || a.puzzleId.localeCompare(b.puzzleId))
    .map((row) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[row.puzzleId];
      return `| ${row.dateKey ?? 'reserve'} | ${markdownCell(row.title)} | locked ${puzzle.words.length}/revealed ${clippedMarkdownCell(
        formatThemeCardsForReport(puzzle),
        108
      )} | ${clippedMarkdownCell(row.weave, 86)} | ${(row.boardScore ?? 0).toFixed(2)} | ${row.scores.noLeadEditorialScore.toFixed(
        2
      )} | ${row.status} | ${markdownCell(row.rewriteNote)} |`;
    })
    .join('\n');
  const reserveLedgerRows =
    THREADLINE_RESERVES.length === 0
      ? 'No unscheduled reserve puzzles.'
      : THREADLINE_RESERVES.map((reserve) => {
          const puzzle = THREADLINE_PUZZLE_BY_ID[reserve.puzzleId];
          const row = copyAudit.noLead.rows.find((candidate) => candidate.puzzleId === reserve.puzzleId);
          return `| ${reserve.reserveId} | ${reserve.sourceDateKey} | ${reserve.reserveStatus} | ${markdownCell(
            puzzle.title
          )} | ${reserve.difficulty} | ${(row?.scores.noLeadEditorialScore ?? 0).toFixed(2)} | ${clippedMarkdownCell(
            formatThemeCardsForReport(puzzle),
            100
          )} | ${clippedMarkdownCell(puzzle.weave, 80)} | ${markdownCell(
            reserve.tighteningNote ?? 'Ready fallback reserve; no-lead surfaces clear current automated gates.'
          )} |`;
        }).join('\n');
  const difficultyRows = copyAudit.difficultyBands
    .map(
      (band) =>
        `| ${band.difficulty} | ${band.count} | ${band.averageIndex.toFixed(2)} | ${band.minIndex.toFixed(2)} | ${band.maxIndex.toFixed(2)} |`
    )
    .join('\n');
  const holidayRows = THREADLINE_HOLIDAY_NODS.map((nod) => {
    const puzzle = THREADLINE_PUZZLE_BY_ID[nod.puzzleId];
    return `| ${nod.dateKey} | ${nod.nearbyHoliday} | ${puzzle.title} | ${nod.windowDays} days | ${nod.note} |`;
  }).join('\n');

  return [
    `# Threadline ${THREADLINE_SHIPPED_DATED_DAYS}-Puzzle No-Lead QA`,
    '',
    `Production window: ${THREADLINE_SHIPPED_START_DATE_KEY} through ${THREADLINE_SHIPPED_END_DATE_KEY}`,
    `Validated bank: ${THREADLINE_PUZZLE_BANK.length} puzzles`,
    `Dated schedule: ${THREADLINE_DATED_SCHEDULE.length} puzzles`,
    `Unscheduled reserves: ${THREADLINE_RESERVES.length} puzzles`,
    `Former dated rows held for tightening: ${tighteningReserves.length}`,
    `Ready fallback reserves: ${readyReserves.length}`,
    `Retired rejected rows: ${THREADLINE_SHIPPED_REJECTED_DATE_KEYS.length}`,
    `Scheduled variety expansion puzzles: ${scheduledVarietyExpansionCount}`,
    `Reserve variety expansion puzzles: ${reserveVarietyExpansionCount}`,
    `Candidate pool represented: ${THREADLINE_APPROVED_CANDIDATE_POOL_SIZE} deterministic candidates`,
    `Rolling 30-day average answer length: ${rollingMinimum.toFixed(2)}-${rollingMaximum.toFixed(2)}`,
    `Root-family warnings requiring editor awareness: ${rootWarnings.length}`,
    `No-lead audit critical failures: ${copyAudit.criticalIssues.length}`,
    `No-lead editor exceptions: ${copyAudit.warningIssues.length}/${editorExceptionLimit}`,
    '',
    '## Automated No-Lead Gate',
    '',
    '- Title gate: specific, human orientation without answer words or revealed theme labels.',
    '- Theme reveal gate: locked progress-only cards before discovery; concrete names and subcopy after first word.',
    '- Weave gate: a concise theme-level aha that stands without the retired lead sentence.',
    '- Board gate: every 10x8 layout must clear the presentation floor and avoid cramped play.',
    '- Lead data remains internal compatibility data and is not part of shipped editorial acceptance.',
    '',
    '## Copy Failures',
    '',
    copyFailureRows,
    '',
    '## Title Purpose Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    titleAuditRows,
    '',
    '## Theme Reveal Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    themeRevealRows,
    '',
    '| Revealed theme name | Uses across 594 |',
    '| --- | ---: |',
    topThemeNameRows,
    '',
    '## Theme Subcopy Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    themeSubcopyRows,
    '',
    '| Theme subcopy surface | Uses across 594 |',
    '| --- | ---: |',
    topThemeSubcopyRows,
    '',
    '## Weave Without Lead Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    weaveRows,
    '',
    '## Board Feel Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    boardRows,
    '',
    '## Difficulty Matrix',
    '',
    '| Difficulty | Count | Average index | Min | Max |',
    '| --- | ---: | ---: | ---: | ---: |',
    difficultyRows,
    '',
    '## Lowest No-Lead Scores',
    '',
    '| Date | Puzzle | Score | Revealed themes | Weave | Reason |',
    '| --- | --- | ---: | --- | --- | --- |',
    lowestRows,
    '',
    '## Per-Day Editorial Ledger',
    '',
    '| Date | Title | Hidden/Revealed Theme Copy | Weave | Grid | No-Lead | Status | Notes |',
    '| --- | --- | --- | --- | ---: | ---: | --- | --- |',
    ledgerRows,
    '',
    '## Reserve Bank',
    '',
    '| Reserve | Source date | Status | Puzzle | Difficulty | No-Lead | Revealed themes | Weave | Reserve note |',
    '| --- | --- | --- | --- | --- | ---: | --- | --- | --- |',
    reserveLedgerRows,
    '',
    '## Holiday-Adjacent Nods',
    '',
    '| Date | Nearby moment | Puzzle | Offset | Note |',
    '| --- | --- | --- | --- | --- |',
    holidayRows,
    '',
    '## Root-Family Review',
    '',
    rootWarnings.length > 0
      ? rootWarnings.slice(0, 20).map((warning) => `- ${warning}`).join('\n')
      : 'No root-family repeats fell inside the stricter review window.',
  ].join('\n');
}

export function formatThreadlineShippedPackMarkdown(): string {
  return formatThreadlineNoLeadPackMarkdown();

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
  const calibrationRows = THREADLINE_EDITORIAL_GOLD_SET.map((calibration) => {
    const puzzleId = THREADLINE_DATED_PUZZLE_BY_DATE[calibration.dateKey];
    const puzzle = puzzleId ? THREADLINE_PUZZLE_BY_ID[puzzleId] : null;
    return `| ${calibration.dateKey} | ${puzzle ? markdownCell(puzzle.title) : 'Not scheduled'} | ${
      puzzle ? clippedMarkdownCell(renderThreadlineCompletedLead(puzzle), 96) : ''
    } | ${puzzle ? clippedMarkdownCell(puzzle.weave, 96) : ''} | ${markdownCell(calibration.note)} |`;
  }).join('\n');
  const qualityTargetRows = THREADLINE_EDITORIAL_QUALITY_TARGETS.map(
    (target) =>
      `| ${markdownCell(target.surface)} | ${markdownCell(target.target)} | ${markdownCell(target.rejects)} |`
  ).join('\n');
  const leadSignatureCounts = scheduledPuzzles.reduce<Record<string, number>>((counts, puzzle) => {
    const signature = getThreadlineLeadStructureSignature(puzzle);
    counts[signature] = (counts[signature] ?? 0) + 1;
    return counts;
  }, {});
  const leadStructureRows = Object.entries(leadSignatureCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([signature, count]) => `| ${count} | ${clippedMarkdownCell(signature, 120)} |`)
    .join('\n');
  const completedLeadEntries = scheduledPuzzles.map((puzzle) => ({
    puzzle,
    completedLead: renderThreadlineCompletedLead(puzzle),
  }));
  const semicolonLeadCount = completedLeadEntries.filter((entry) => entry.completedLead.includes(';')).length;
  const noSemicolonLeadCount = completedLeadEntries.length - semicolonLeadCount;
  const oldSupportPhrasePattern =
    /\b(the clerk can|a visitor (?:begins|stops|pauses|starts|chooses|has time|takes time|takes a moment) to|the cook turns (?:next )?to|cook goes on to|the water starts to|the water begins to|the edge begins to|the shoreline begins to|the tide starts to|shoreline keeps moving through|tell people when to move|fill the waiting|put the trip in view|path is marked by|woods answer with|repair note names|damaged piece shows|loose part shows|keeps up with|answers with|wait quietly|outside are|outside,? the block|front step has|porch light falls|seats hold|from (?:the )?(?:block|street|sidewalk|counter) come|lunch has|the grass is ready for|the food is simple|the park gives|the operator can|the voice can|signal is shaped by|signal takes shape through|after dark come|after dusk|evening moves through|campsite opens around|are unpacked|the beds are bright with|the day's work is|morning work is|beyond it, the work is|garden path shows|morning is for|hands move through|room settles into|afternoon moves through|hour moves through|work is mostly|washday has|line moves through|slow the line into|counter turns busy|breakfast becomes|order takes shape through|line pauses over|morning waits on|order moves through|before long, .+ take over|by noon, .+ take over|morning opens toward|next hour turns toward|day turns to|rail is busy with|cut into the sky|fill the hour|settle over the evening|hold the skyline|looks out past|rail looks out on|fill the view|high rail looks past|front step keeps|hold the house in place|porch light catches|turn the step toward|set the edge of the house|house is ready with|hold the light|carry the street|turn the doorway outward|pull the door into|front edge has|bring the block close)\b/i;
  const newlyRetiredLeadPattern =
    /\b(hour fills with|next hour gathers|small work of|the room finds|day fills with|morning fills with|feels made from|keep it from feeling empty|keep the beach brief|first hour is full|night fills with|firelight settles over|keep going through|glass catches|room steadies itself|broadcast goes out|counter turns to|order becomes|make the first idea visible|make the draft visible|take the boat out|counter handles|rehearsal gathers around|settle into [a-z]+ing|bring the draft into view|give the quiet shape|keep the fire tended|keep the sand unsettled|wait for [a-z]+ing, [a-z]+ing, and [a-z]+ing|wait while|sit close while|look ready while|decide what (?:goes|leaves)|make breakfast specific|visit becomes|draws its outline|hour is spent|keeps the room busy|are what rehearsal is for|give the first hour its shape|works through|wait beyond the rail|make the wait sweet|the first desks have|the morning has|the room slows around|attention turns to|the day steadies itself|the day leans into|the morning turns to|the boat turns to|the page waits with|show where hands should go|give breakfast its rhythm|the hour softens into|the back room handles|the room warms into|gather in a corner|point past the pause|wait while shoppers|visitors keep|room is just|waiting for|wait for|counter work is|shape the first run|the rest is|makes a place|settle into the rest|mailroom shelf has|back room hums|are ready before|room agrees to listen|stay close before the trip becomes|are still separate when|tempt the line while|cover the desks, and after it|give the run a count|move one choice into paper|first decisions|wait as|cross the night|mark the sand while|long enough for|show where the fix begins|carry the room onward|broadcast runs on|water ahead means|come back from .* ready|keep the line looking|stay close to the eye|people keep|on the page are|are ready as|give the room a sound|city below becomes|protocol says|work moves toward|near the surface|finish the thought|sitting toward|first, then lets|has room for|same quiet|rest of the moment calls|hands slipping|signal is built from|move the work along|keep the room in motion|signal leaves with|add the next turn|enter the day|carry the hour|move the day along|give the scene another pulse|fill the back of the scene|ready for a morning of|hold the view|show what clay can become|notes say|screens say|wait for hands to|sit ready for|water stream|shift the scene|move the scene onward|drills for [a-z]+, [a-z]+, and [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ find the beat|shape an hour of|carry the evening|plan is to|notes settle on|drills? to [a-z]+, [a-z]+, and [a-z]+|make the room look ready|room look ready|make the next move|make the turn|hour goes out with|bring the room alive|house answers with|point farther on|stay close to the cup|the table has|a regular table has)\b/i;
  const oldSupportPhraseCount = completedLeadEntries.filter((entry) =>
    oldSupportPhrasePattern.test(entry.completedLead) ||
    newlyRetiredLeadPattern.test(entry.completedLead) ||
    THREADLINE_RECENTLY_RETIRED_LEAD_COPY.test(entry.completedLead)
  ).length;
  const retiredApprovalNoteCount = THREADLINE_DATED_SCHEDULE.filter((entry) => {
    const copy = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId];
    return copy ? THREADLINE_RETIRED_APPROVAL_NOTE_COPY.test(copy.reviewNote) : true;
  }).length;
  const leadAnswerRepeatCount = copyAudit.criticalIssues.filter((issue) => issue.code === 'lead-answer-repeat').length;
  const leadArchitectureRows = [
    `| Semicolon-led two-list sentences | ${semicolonLeadCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Semicolon rhythm ceiling failures | ${Math.max(
      0,
      semicolonLeadCount - THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS
    )} |`,
    `| Non-semicolon two-list sentences | ${noSemicolonLeadCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Promoted weak support-phrase failures | ${oldSupportPhraseCount} |`,
    `| Repeated answer-in-lead failures | ${leadAnswerRepeatCount} |`,
    `| Retired rubber-stamp approval-note failures | ${retiredApprovalNoteCount} |`,
    `| Voice floor failures | ${copyAudit.voiceFloor.reduce((total, summary) => total + summary.count, 0)} |`,
  ].join('\n');
  const voiceFloorRows = copyAudit.voiceFloor
    .slice()
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map(
      (summary) =>
        `| ${markdownCell(summary.label)} | ${summary.phase} | ${summary.count} | ${markdownCell(
          summary.whyItMatters
        )} |`
    )
    .join('\n');
  const voiceFloorSampleRows = copyAudit.voiceFloor
    .slice()
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .flatMap((summary) =>
      summary.sampleHits.slice(0, 3).map(
        (hit) =>
          `| ${markdownCell(summary.label)} | ${hit.dateKey ?? 'unscheduled'} | ${markdownCell(
            hit.title
          )} | ${clippedMarkdownCell(hit.completedLead, 92)} | ${clippedMarkdownCell(hit.weave, 80)} |`
      )
    )
    .join('\n');
  const voiceFloorById = Object.fromEntries(copyAudit.voiceFloor.map((summary) => [summary.patternId, summary]));
  const voiceFloorCount = (patternId: keyof typeof voiceFloorById): number => voiceFloorById[patternId]?.count ?? 0;
  const utilityLeadPhraseCount =
    voiceFloorCount('lead-nearby-wait') +
    voiceFloorCount('lead-then-someone-can') +
    voiceFloorCount('lead-someone-can') +
    voiceFloorCount('lead-is-ready-to') +
    voiceFloorCount('lead-hands-know-how') +
    voiceFloorCount('lead-eye-somewhere') +
    voiceFloorCount('lead-next-motion');
  const nextPassRows = [
    {
      order: 1,
      batch: 'Theme-level weave rewrite',
      scope: `${voiceFloorCount('answer-as-payoff-subject')} answer-as-subject weaves; ${voiceFloorCount('weave-answer-anchor')} answer-anchored weaves`,
      move: 'Replace answer-dependent reveals with theme-level lines that name the shared human situation.',
      proof: 'Answer-anchor count drops by domain; random samples no longer sound like a selected answer is doing the whole reveal.',
      gate: 'Promote answer-anchored weaves to a critical gate after each high-volume domain has a replacement weave family.',
    },
    {
      order: 2,
      batch: 'Lead point-of-view rewrite',
      scope: `${voiceFloorCount('lead-static-list-location')} static list-location leads`,
      move: 'Give each lead a human vantage point, small action, or sensory turn instead of parking two lists in places.',
      proof: 'Filled leads read aloud without list-plus-preposition rhythm across a sampled week from each quarter.',
      gate: 'Lower the lead-structure repeat ceiling once the top signatures are replaced.',
    },
    {
      order: 3,
      batch: 'Utility phrase removal',
      scope: `${utilityLeadPhraseCount} procedural lead phrases`,
      move: 'Rewrite "someone can," "hands know how," "give the eye somewhere," and similar utility phrases into domain-specific sentences.',
      proof: 'Every utility phrase counter stays at zero without introducing worse grammatical slots.',
      gate: 'Move each rejected phrase into banned lead copy after its replacement pattern passes review.',
    },
    {
      order: 4,
      batch: 'Taste calibration read',
      scope: 'Opening month, holiday-adjacent days, expansion domains, and final month',
      move: 'Read title, filled lead, and weave as a player, then record before/after notes for weak rows.',
      proof: 'Gold-set examples include at least one improved row from each sampled window.',
      gate: 'Require every approval note to reference the actual voice choice, not just a cleared audit.',
    },
    {
      order: 5,
      batch: 'Gate promotion',
      scope: 'Every solved watchlist pattern',
      move: 'Convert repeatedly rejected language from watchlist to hard audit checks only after the replacement is stable.',
      proof: 'Threadline tests fail on the old pattern and pass on the rewritten schedule.',
      gate: 'No "audit green but taste weak" pattern remains untracked.',
    },
  ]
    .map(
      (row) =>
        `| ${row.order} | ${markdownCell(row.batch)} | ${markdownCell(row.scope)} | ${markdownCell(
          row.move
        )} | ${markdownCell(row.proof)} | ${markdownCell(row.gate)} |`
    )
    .join('\n');
  const titleUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.title)).size;
  const payoffUniqueCount = new Set(scheduledPuzzles.map((puzzle) => puzzle.weave)).size;
  const answerSetUniqueCount = new Set(scheduledPuzzles.map(getThreadlineAnswerSetSignature)).size;
  const rejectedCopyAnswerCount = scheduledPuzzles.reduce(
    (count, puzzle) =>
      count + puzzle.words.filter((word) => THREADLINE_REJECTED_COPY_ANSWERS.has(word.answer.toUpperCase())).length,
    0
  );
  const motionThreadName = /(move|moves|motion|motions|steps|calls|cues|signals|habits|routines)/i;
  const mixedGerundThreadCount = scheduledPuzzles.reduce(
    (count, puzzle) =>
      count +
      puzzle.threads.filter((thread) => {
        if (!motionThreadName.test(thread.name)) return false;
        const answers = puzzle.words.filter((word) => word.threadId === thread.id).map((word) => word.answer);
        const gerundCount = answers.filter((answer) => /ING$/.test(answer)).length;
        return gerundCount > 0 && gerundCount < answers.length;
      }).length,
    0
  );
  const threadTripleCounts = scheduledPuzzles.reduce<Map<string, number>>((counts, puzzle) => {
    getThreadlineThreadTripleSignatures(puzzle).forEach((signature) => {
      counts.set(signature, (counts.get(signature) ?? 0) + 1);
    });
    return counts;
  }, new Map());
  const weaveStructureCounts = scheduledPuzzles.reduce<Map<string, number>>((counts, puzzle) => {
    const signature = getThreadlineWeaveStructureSignature(puzzle);
    counts.set(signature, (counts.get(signature) ?? 0) + 1);
    return counts;
  }, new Map());
  const maxThreadTripleReuse = Math.max(...threadTripleCounts.values());
  const overusedThreadTripleCount = Array.from(threadTripleCounts.values()).filter(
    (count) => count > THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS
  ).length;
  const maxWeaveStructureReuse = Math.max(...weaveStructureCounts.values());
  const overusedWeaveStructureCount = Array.from(weaveStructureCounts.values()).filter(
    (count) => count > THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS
  ).length;
  const maxTitleReuse = Math.max(
    ...Array.from(
      scheduledPuzzles.reduce<Map<string, number>>((counts, puzzle) => {
        counts.set(puzzle.title, (counts.get(puzzle.title) ?? 0) + 1);
        return counts;
      }, new Map()).values()
    )
  );
  const titleAuditRows = [
    `| Scheduled unique titles | ${titleUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Scheduled title uniqueness target | >= 96% |`,
    `| Max exact title reuse | ${maxTitleReuse} |`,
    `| Exact title cooldown | ${THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS} days |`,
    `| Robotic title-frame failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'abstract-title-frame').length
    } |`,
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
    `| Max payoff structure reuse | ${maxWeaveStructureReuse} |`,
    `| Payoff structure reuse floor | <= ${THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS} |`,
    `| Over-floor payoff structure failures | ${overusedWeaveStructureCount} |`,
    `| Payoff structure audit failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'payoff-structure-repeat').length
    } |`,
  ].join('\n');
  const answerSetAuditRows = [
    `| Rejected answer-copy failures | ${rejectedCopyAnswerCount} |`,
    `| Same-puzzle root-family failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'same-puzzle-root-repeat').length
    } |`,
    `| Mixed gerund motion-thread failures | ${mixedGerundThreadCount} |`,
    `| Scheduled unique answer sets | ${answerSetUniqueCount}/${THREADLINE_DATED_SCHEDULE.length} |`,
    `| Max exact answer-set reuse | ${THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS} |`,
    `| Duplicate exact answer-set failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'answer-set-reuse').length
    } |`,
    `| Rejected answer audit failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'rejected-copy-answer').length
    } |`,
    `| Same-puzzle root audit failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'same-puzzle-root-repeat').length
    } |`,
    `| Mixed gerund audit failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'mixed-gerund-thread').length
    } |`,
  ].join('\n');
  const threadTripleAuditRows = [
    `| Max exact thread-trio reuse | ${maxThreadTripleReuse} |`,
    `| Exact thread-trio reuse floor | <= ${THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS} |`,
    `| Over-floor thread-trio failures | ${overusedThreadTripleCount} |`,
    `| Audit failures | ${copyAudit.criticalIssues.filter((issue) => issue.code === 'thread-triple-reuse').length} |`,
  ].join('\n');
  const gridPresentationEntries = scheduledPuzzles.map((puzzle) => {
    const review = THREADLINE_EDITOR_REVIEW[puzzle.id];
    return {
      puzzle,
      review,
      score: review.scores.gridPresentationScore,
      presentation: scoreGridPresentation(puzzle.words.map((word) => word.path)),
    };
  });
  const gridPresentationAverage =
    gridPresentationEntries.reduce((total, entry) => total + entry.score, 0) / gridPresentationEntries.length;
  const gridPresentationMinimum = Math.min(...gridPresentationEntries.map((entry) => entry.score));
  const gridPresentationFloorFailures = gridPresentationEntries.filter(
    (entry) => entry.score < THREADLINE_MIN_GRID_PRESENTATION_SCORE
  );
  const weakestGridRows = gridPresentationEntries
    .slice()
    .sort((a, b) => a.score - b.score || (a.review.dateKey ?? '').localeCompare(b.review.dateKey ?? ''))
    .slice(0, 12)
    .map(
      ({ puzzle, review, score, presentation }) =>
        `| ${review.dateKey ?? 'unscheduled'} | ${markdownCell(puzzle.title)} | ${score.toFixed(
          2
        )} | ${markdownCell(
          puzzle.words.map((word) => `${word.answer}:${pathOrientation(word.path)}`).join(', ')
        )} | ${markdownCell(presentation.flags.length === 0 ? 'clears visual weave gate' : presentation.flags.join(', '))} |`
    )
    .join('\n');
  const gridPresentationRows = [
    `| Average grid presentation score | ${gridPresentationAverage.toFixed(2)} |`,
    `| Lowest grid presentation score | ${gridPresentationMinimum.toFixed(2)} |`,
    `| Grid presentation floor | >= ${THREADLINE_MIN_GRID_PRESENTATION_SCORE.toFixed(2)} |`,
    `| Floor failures | ${gridPresentationFloorFailures.length} |`,
    `| Review dimension failures | ${
      copyAudit.criticalIssues.filter((issue) => issue.code === 'score-below-threshold' && issue.message.includes('gridPresentationScore')).length
    } |`,
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
  const approvalEntries = THREADLINE_DATED_SCHEDULE.map((entry) => THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId]);
  const approvalCount = approvalEntries.filter((entry) => entry?.editorStatus === 'approved').length;
  const reserveApprovalCount = THREADLINE_RESERVES.filter(
    (entry) => THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId]?.editorStatus === 'approved'
  ).length;
  const approvalLedgerRows = approvalEntries
    .map((entry) =>
      `| ${entry.dateKey} | ${markdownCell(entry.title)} | ${entry.editorStatus} | ${clippedMarkdownCell(
        entry.filledLead,
        92
      )} | ${clippedMarkdownCell(entry.weave, 80)} | ${markdownCell(entry.reviewNote)} |`
    )
    .join('\n');
  const reservePuzzles = THREADLINE_RESERVES.map((reserve) => THREADLINE_PUZZLE_BY_ID[reserve.puzzleId]).filter(Boolean);
  const tighteningReserves = THREADLINE_RESERVES.filter((reserve) => reserve.reserveStatus === 'needs-tightening');
  const readyReserves = THREADLINE_RESERVES.filter((reserve) => reserve.reserveStatus === 'ready');
  const scheduledVarietyExpansionCount = scheduledPuzzles.filter((puzzle) =>
    THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags.includes('variety-expansion')
  ).length;
  const reserveVarietyExpansionCount = reservePuzzles.filter((puzzle) =>
    THREADLINE_EDITOR_REVIEW[puzzle.id]?.tags.includes('variety-expansion')
  ).length;
  const reserveLedgerRows =
    THREADLINE_RESERVES.length === 0
      ? 'No unscheduled reserve puzzles.'
      : THREADLINE_RESERVES.map((reserve) => {
          const puzzle = THREADLINE_PUZZLE_BY_ID[reserve.puzzleId];
          const approval = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[reserve.puzzleId];
          return `| ${reserve.reserveId} | ${reserve.sourceDateKey} | ${reserve.reserveStatus} | ${markdownCell(
            puzzle.title
          )} | ${markdownCell(
            reserve.themeFamily
          )} | ${reserve.difficulty} | ${clippedMarkdownCell(approval.filledLead, 92)} | ${clippedMarkdownCell(
            puzzle.weave,
            80
          )} | ${markdownCell(reserve.tighteningNote ?? 'Ready fallback reserve.')} |`;
        }).join('\n');
  const reserveTighteningRows =
    tighteningReserves.length === 0
      ? 'No former dated rows are being held for later tightening.'
      : tighteningReserves
          .map((reserve) => {
            const puzzle = THREADLINE_PUZZLE_BY_ID[reserve.puzzleId];
            const approval = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[reserve.puzzleId];
            const reviewEntry = THREADLINE_EDITOR_REVIEW[reserve.puzzleId];
            return `| ${reserve.sourceDateKey} | ${reserve.reserveId} | ${markdownCell(
              puzzle.title
            )} | ${(reviewQualityScore(reviewEntry)).toFixed(2)} | ${clippedMarkdownCell(
              approval.filledLead,
              92
            )} | ${clippedMarkdownCell(puzzle.weave, 80)} | ${markdownCell(reserve.tighteningNote ?? '')} |`;
          })
          .join('\n');
  const retiredRows = THREADLINE_SHIPPED_REJECTED_DATE_KEYS.map((dateKeyValue) => `| ${dateKeyValue} |`).join('\n');

  return [
    `# Threadline ${THREADLINE_SHIPPED_DATED_DAYS}-Puzzle Shipped Set QA`,
    '',
    `Production window: ${THREADLINE_SHIPPED_START_DATE_KEY} through ${THREADLINE_SHIPPED_END_DATE_KEY}`,
    `Validated bank: ${THREADLINE_PUZZLE_BANK.length} puzzles`,
    `Dated schedule: ${THREADLINE_DATED_SCHEDULE.length} puzzles`,
    `Unscheduled reserves: ${THREADLINE_RESERVES.length} puzzles`,
    `Former dated rows held for tightening: ${tighteningReserves.length}`,
    `Ready fallback reserves: ${readyReserves.length}`,
    `Retired rejected rows: ${THREADLINE_SHIPPED_REJECTED_DATE_KEYS.length}`,
    `Scheduled variety expansion puzzles: ${scheduledVarietyExpansionCount}`,
    `Reserve variety expansion puzzles: ${reserveVarietyExpansionCount}`,
    `Former reserve candidate puzzles: ${THREADLINE_SHIPPED_FORMER_RESERVE_DAYS}`,
    `Candidate pool represented: ${THREADLINE_APPROVED_CANDIDATE_POOL_SIZE} deterministic candidates`,
    `Rolling 30-day average answer length: ${rollingMinimum.toFixed(2)}-${rollingMaximum.toFixed(2)}`,
    `Root-family warnings requiring editor awareness: ${rootWarnings.length}`,
    `Copy audit critical failures: ${copyAudit.criticalIssues.length}`,
    `Copy audit editor exceptions: ${copyAudit.warningIssues.length}/${editorExceptionLimit}`,
    `Scheduled read-aloud approvals: ${approvalCount}/${THREADLINE_DATED_SCHEDULE.length}`,
    `Reserve read-aloud approvals: ${reserveApprovalCount}/${THREADLINE_RESERVES.length}`,
    '',
    '## Automated Editor And Player Gate',
    '',
    '- Lead word gate: answer quality, blank fairness, and NYT-adjacent lexical pleasure proxies.',
    '- Theme gate: each answer must belong to its declared thread pool.',
    '- Calendar gate: repetition, seasonal placement, and difficulty rhythm over the full dated run.',
    '- Copy gate: every playable word appears exactly once in a standalone filled sentence with no generated-copy fingerprints.',
    '- Safety gate: no unresolved sensitive, brand, or screenshot-risk flags.',
    '- Simulated player checks: Strands, Connections, Spelling Bee, casual morning, and mobile-first scoring proxies.',
    '',
    '## Editorial Quality Pursuit',
    '',
    '- Current goal: keep iterating on the weakest title, lead, and weave rows until the floor is satisfying, not merely valid.',
    '- Generated copy is treated as draft material; shipped copy must clear title sense, standalone lead, lead-structure, and aha-weave gates.',
    '- The report is ordered to expose the next work: copy failures first, then title/payoff audits, lead repetition, and lowest copy scores.',
    '',
    '## Quality Targets',
    '',
    '| Surface | Target quality | Must reject |',
    '| --- | --- | --- |',
    qualityTargetRows,
    '',
    '## Calibration Gold Set',
    '',
    '| Date | Puzzle | Filled lead | Weave | Calibration role |',
    '| --- | --- | --- | --- | --- |',
    calibrationRows,
    '',
    '## Lead Structure Audit',
    '',
    '| Uses | Lead structure signature |',
    '| ---: | --- |',
    leadStructureRows,
    '',
    '## Lead Architecture Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    leadArchitectureRows,
    '',
    '## Voice Floor Watchlist',
    '',
    'These counters are now pursuit-floor gates: any nonzero count means the row needs another rewrite, and the test/review path should not pass quietly.',
    '',
    '| Pattern | Surface | Count | Why it matters |',
    '| --- | --- | ---: | --- |',
    voiceFloorRows,
    '',
    '| Pattern | Date | Puzzle | Filled lead | Weave |',
    '| --- | --- | --- | --- | --- |',
    voiceFloorSampleRows,
    '',
    '## Next Editorial Pass Plan',
    '',
    '| Order | Batch | Current scope | Rewrite move | Proof required | Gate promotion |',
    '| ---: | --- | --- | --- | --- | --- |',
    nextPassRows,
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
    '## Answer Set Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    answerSetAuditRows,
    '',
    '## Thread Trio Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    threadTripleAuditRows,
    '',
    '## Grid Presentation Audit',
    '',
    '| Check | Result |',
    '| --- | ---: |',
    gridPresentationRows,
    '',
    '| Date | Puzzle | Score | Word presentation | Reason |',
    '| --- | --- | ---: | --- | --- |',
    weakestGridRows,
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
    '## Manual Read-Aloud Ledger',
    '',
    '| Date | Puzzle | Status | Filled lead | Weave | Review note |',
    '| --- | --- | --- | --- | --- | --- |',
    approvalLedgerRows,
    '',
    '## Reserve Bank',
    '',
    '| Reserve | Source date | Status | Puzzle | Theme family | Difficulty | Filled lead | Weave | Reserve note |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    reserveLedgerRows,
    '',
    '## Reserve Tightening Queue',
    '',
    'These 86 former dated rows are preserved for later work instead of shipping in the dated set.',
    '',
    '| Source date | Reserve | Puzzle | Score | Filled lead | Weave | What needs improvement |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
    reserveTighteningRows,
    '',
    '## Retired Rows',
    '',
    'These dates were deliberately removed from the shippable bank after the exceptional-floor audit exposed weak title, lead, or weave fit.',
    '',
    '| Source date |',
    '| --- |',
    retiredRows,
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
    `${THREADLINE_DATED_SCHEDULE.length} validated puzzles have dated slots; ${THREADLINE_RESERVES.length} validated puzzles remain as unscheduled reserves for fallback or replacement use.`,
    '',
    '## Root-Family Review',
    '',
    rootWarnings.length > 0
      ? rootWarnings.slice(0, 20).map((warning) => `- ${warning}`).join('\n')
      : 'No root-family repeats fell inside the stricter review window.',
  ].join('\n');
}
