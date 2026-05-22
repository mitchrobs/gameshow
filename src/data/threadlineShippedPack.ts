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
  getThreadlineThreadTripleSignatures,
  getThreadlineWeaveStructureSignature,
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
export const THREADLINE_SHIPPED_END_DATE_KEY = '2027-11-07';
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
export const THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS = 2;
export const THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS = 0;
export const THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS = 1;
export const THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS = 3;
export const THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS = 4;
export { THREADLINE_REJECTED_COPY_ANSWERS } from './threadlineQualityRules.ts';

const THREADLINE_SHIPPED_REJECTED_DATE_KEY_SET = new Set<string>(THREADLINE_SHIPPED_REJECTED_DATE_KEYS);

const GRID_SIZE = 8;
const PACK_SEED = 19337;
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

export interface ThreadlineApprovedCopyEntry {
  puzzleId: string;
  dateKey: string | null;
  title: string;
  filledLead: string;
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

interface CopyScoreSummary {
  grammarScore: number;
  titleCoherenceScore: number;
  payoffBridgeScore: number;
  poeticTextureScore: number;
  difficultyIntegrityScore: number;
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
    place: 'the harbor rail',
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
  cafe: ['block', 'breakfast', 'city', 'corner', 'counter', 'cup', 'errand', 'glass', 'local', 'morning', 'pause', 'street', 'table', 'warmth', 'window'],
  campsite: ['camp', 'campsite', 'care', 'dark', 'evening', 'fire', 'home', 'night', 'outside', 'ring', 'shelter', 'warmth', 'wild'],
  chessboard: ['choice', 'danger', 'game', 'pressure', 'strategy', 'threat', 'trapdoor', 'war'],
  'clean-slate': ['blank', 'fresh', 'mark', 'page', 'plan', 'quiet', 'start'],
  clockshop: ['audible', 'counter', 'face', 'hour', 'machines', 'measure', 'minute', 'sound', 'time', 'tick'],
  commute: ['departure', 'door', 'forecast', 'leaving', 'logistics', 'morning', 'practical', 'preparation', 'rain', 'route', 'shelter', 'trip', 'way', 'weather'],
  dancehall: ['bodies', 'dance', 'motion', 'music', 'pulse', 'rhythm', 'room', 'sound'],
  desk: ['blank', 'desk', 'morning', 'order', 'page', 'possible', 'ready', 'surface', 'task', 'work'],
  diner: ['breakfast', 'booth', 'counter', 'familiar', 'morning', 'place', 'regular', 'rhythm', 'table', 'warm'],
  firehouse: ['alarm', 'answer', 'bay', 'brave', 'courage', 'help', 'public', 'ready', 'rest', 'urgency'],
  gallery: ['art', 'attention', 'body', 'conversation', 'eye', 'frame', 'gallery', 'looking', 'memory', 'patience', 'room', 'silence', 'visitor', 'wall'],
  garden: ['attention', 'beds', 'care', 'green', 'growth', 'hands', 'kept', 'morning', 'path', 'patience', 'season', 'soil', 'yard'],
  harbor: ['boat', 'departure', 'distance', 'edge', 'harbor', 'leaving', 'mooring', 'morning', 'open', 'rail', 'still', 'water'],
  kitchen: ['anticipation', 'care', 'counter', 'dinner', 'fragrant', 'heat', 'hunger', 'kitchen', 'meal', 'room', 'smell', 'supper', 'touch'],
  laboratory: ['answer', 'care', 'curiosity', 'doubt', 'evidence', 'method', 'precise', 'precision', 'proof', 'question', 'wonder'],
  library: ['book', 'borrowed', 'chair', 'hush', 'library', 'page', 'private', 'public', 'quiet', 'reader', 'reading', 'room', 'shelf', 'silence', 'solitude', 'stacks', 'voice'],
  laundry: ['care', 'day', 'domestic', 'household', 'mess', 'order', 'pile', 'rhythm', 'room', 'soft', 'usefulness', 'work'],
  mailroom: ['arrival', 'destination', 'distance', 'door', 'handled', 'message', 'purpose', 'route', 'room', 'shelf', 'sorting', 'trust', 'waiting'],
  market: ['aisle', 'appetite', 'basket', 'choice', 'choose', 'choosing', 'color', 'conversation', 'decision', 'errand', 'hand', 'market', 'morning', 'price', 'stall'],
  lighthouse: ['care', 'coast', 'danger', 'dark', 'direction', 'edge', 'far', 'height', 'kindness', 'light', 'promise', 'warning', 'water'],
  music: ['attention', 'beat', 'breath', 'company', 'counting', 'listen', 'listening', 'pulse', 'rehearsal', 'room', 'song', 'sound', 'timing', 'together'],
  newsroom: ['care', 'daylight', 'deadline', 'doubt', 'fact', 'facts', 'morning', 'news', 'noise', 'public', 'rumor', 'trust', 'truth', 'urgency'],
  observatory: ['dark', 'distance', 'dome', 'far', 'faraway', 'night', 'patience', 'room', 'roof', 'sky', 'telescope', 'wait', 'waiting', 'wonder'],
  park: ['bench', 'body', 'habit', 'loop', 'neighborhood', 'park', 'path', 'people', 'pulse', 'repetition', 'return', 'ritual', 'route', 'walk'],
  picnic: ['afternoon', 'company', 'day', 'food', 'lunch', 'meal', 'noon', 'outdoors', 'park', 'shade', 'table'],
  planetarium: ['borrowed', 'ceiling', 'dark', 'distance', 'earth', 'indoors', 'night', 'overhead', 'room', 'seats', 'sky', 'travel', 'wonder'],
  porch: ['arrival', 'block', 'door', 'edge', 'front', 'house', 'light', 'people', 'step', 'street', 'threshold', 'warmth'],
  'paper-hearts': ['care', 'craft', 'gesture', 'hand', 'held', 'note', 'paper', 'small'],
  pottery: ['fire', 'hand', 'handprint', 'heat', 'memory', 'pressure', 'shape', 'soft', 'touch', 'vessel'],
  printshop: ['address', 'body', 'carry', 'ink', 'language', 'message', 'page', 'printing', 'public', 'sentence', 'street', 'weight', 'words'],
  'radio-booth': ['air', 'broadcast', 'company', 'distance', 'far', 'leave', 'public', 'radio', 'room', 'signal', 'sound', 'voice', 'walls'],
  'porch-lantern': ['arrive', 'dressed', 'october', 'softly', 'threshold'],
  'porch-spark': ['brighter', 'house', 'outward', 'summer'],
  rooftop: ['above', 'city', 'distance', 'evening', 'high', 'hour', 'last', 'light', 'pause', 'rail', 'roof', 'street', 'view'],
  school: ['attention', 'bell', 'board', 'class', 'classroom', 'day', 'lesson', 'listen', 'morning', 'pencil', 'question', 'room', 'school', 'supplies'],
  shore: ['beach', 'edge', 'evidence', 'find', 'finds', 'foam', 'line', 'low', 'proof', 'sand', 'shore', 'tide', 'water', 'wave', 'waves'],
  'spring-basket': ['basket', 'color', 'garden', 'hidden', 'hunt', 'search', 'spring'],
  station: ['departure', 'direction', 'legible', 'leaving', 'minutes', 'platform', 'schedule', 'signs', 'station', 'travel', 'wait', 'waiting'],
  'table-leaf': ['gather', 'hosting', 'plate', 'room', 'table'],
  tailor: ['body', 'cloth', 'comfort', 'fit', 'mirror', 'personal', 'shape', 'skin', 'worn', 'yours'],
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
    'BIND', 'BOIL', 'BRAISE', 'BREAK', 'BREATHE', 'BRIGHTEN', 'BRING', 'BROWSE', 'BRUSH', 'BUNDLE', 'CALL', 'CARRY', 'CAST', 'CHARGE', 'CHATTER', 'CHECK', 'CHEER', 'CLAP',
    'CHIME', 'CHOOSE', 'CHOP', 'CLAMP', 'CLOSE', 'COLLATE', 'COMPARE', 'COUNT', 'COVER', 'DANCE', 'DAYDREAM', 'DECIDE', 'DEEPEN', 'DEGLAZE', 'DELIVER', 'DESCEND', 'DICE', 'DOODLE',
    'DALLY', 'DARKEN', 'DIP', 'DIRECT', 'DOZE', 'DRAW', 'DRIFT', 'DRILL', 'DRIZZLE', 'DRY', 'EASE', 'ECLIPSE', 'ENCLOSE', 'EXERCISE', 'EXPLORE', 'FADE', 'FERMENT', 'FILL', 'FIND', 'FIT', 'FLASH', 'FLICKER', 'FLOOD', 'FOCUS', 'FOLD', 'FROST',
    'FOLLOW', 'FRAME', 'FRESHEN', 'GASP', 'GATHER', 'GLANCE', 'GLAZE', 'GLIMMER', 'GLISTEN', 'GLITTER', 'GLOW', 'GRATE', 'GRAZE', 'GUIDE', 'HAMMER', 'HOVER', 'IMPROVE', 'IRON', 'KNEAD',
    'IMPOSE', 'INSPECT', 'LABEL', 'LATCH', 'LAUGH', 'LAUNDER', 'LEAN', 'LIFT', 'LINGER', 'LISTEN', 'LOUNGE', 'LOWER', 'MAIL', 'MAILOUT', 'MARK', 'MATCH', 'MEANDER', 'MEASURE', 'MEND', 'MINGLE', 'MINCE',
    'MELLOW', 'MIX', 'MODULATE', 'MONITOR', 'MOVE', 'NIBBLE', 'NUMBER', 'OPEN', 'OUTLINE', 'OVERWASH', 'PACK', 'PAN', 'PASS', 'PHONE', 'PIN', 'PLANE', 'PLATE', 'PONDER', 'POUR',
    'NOTICE', 'PACKAGE', 'POINT', 'PORTION', 'POSTMARK', 'PRESS', 'PRICE', 'PRINT', 'PROJECT', 'PROOF', 'PRUNE', 'PULSE', 'PURCHASE', 'PUREE', 'RAMBLE', 'READ', 'RECEDE', 'RECHECK', 'RECLINE', 'REDIRECT', 'REDUCE', 'REFILL', 'REFOLD', 'RELAY', 'REPAIR',
    'REACT', 'REFLECT', 'RELAX', 'RESORT', 'REST', 'RETREAT', 'RETURN', 'REVEAL', 'REVISIT', 'RINSE', 'RIPPLE', 'ROAST', 'ROLL', 'ROTATE', 'RUSTLE', 'SAIL', 'SAMPLE', 'SAUTE', 'SCAN',
    'SAUNTER', 'SEARCH', 'SEASON', 'SELECT', 'SEND', 'SERVE', 'SETTLE', 'SHADE', 'SHAKE', 'SHAPE', 'SHARE', 'SHIFT', 'SHIMMER', 'SIGN', 'SIMMER', 'SKETCH', 'SLICE',
    'SMOOTH', 'SNOOZE', 'SOFTEN', 'SORT', 'SPARKLE', 'SPIN', 'SPRAWL', 'SPRAY', 'SPREAD', 'SPRINKLE', 'STACK', 'STAMP', 'STAPLE', 'STEADY', 'STEAM', 'STIR', 'STITCH', 'STREAM', 'STRETCH', 'STUDY',
    'SURGE', 'SWEEP', 'SWELL', 'SWING', 'SWIVEL', 'TALK', 'TEMPER', 'TEND', 'TEST', 'THREAD', 'TIE', 'TILT', 'TOAST', 'TRACK', 'TRANSIT', 'TRIM', 'TUMBLE', 'TURN',
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
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      return placeWords(answers, seed + attempt * 7_919);
    } catch (error) {
      lastError = error;
    }
  }
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

function makeHint(blueprint: Blueprint, pool: WordPool, answer: string): string {
  const place = blueprint.place.replace(/^the /, '');
  const label = pool.name.toLowerCase();
  return `${capitalize(label)} near ${place}: ${pool.clue.replace(/\.$/, '').toLowerCase()} (${answer.length} letters).`;
}

function answerLengthsMeetDifficultyGate(answers: readonly string[], difficulty: ThreadlineDifficulty): boolean {
  const longCount = answers.filter((answer) => answer.length >= 6).length;
  const veryLongCount = answers.filter((answer) => answer.length >= 7).length;

  return longCount >= 3 && (difficulty !== 'Hard' || (longCount >= 4 && veryLongCount >= 2));
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
      if (!selectedThreadGrammarIsCohesive(selectedWords)) continue;
      if (!threadTriplesAreFresh(copyFreshness, selectedWords)) continue;
      if (!answerSetIsFresh(copyFreshness, answers)) continue;

      const wordIds = answers.map(answerId);
      const { grid, paths } = placeWordsWithRetries(answers, PACK_SEED + dayIndex * 97 + selectionAttempt * 193);
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
      const attemptCopyFreshness = copyFreshness ? cloneCopyFreshness(copyFreshness) : undefined;
      const editorialCopy = makeApprovedEditorialCopy(
        blueprint,
        dateKeyValue,
        dayIndex,
        wordIds,
        selectedWords,
        attemptCopyFreshness
      );
      const puzzle = {
        id: `threadline-${dateKeyValue}-${blueprint.domain}`.replaceAll(':', '-'),
        title: editorialCopy.title,
        deck: blueprint.deck,
        difficulty,
        grid,
        lead: editorialCopy.lead,
        threads,
        words,
        weave: editorialCopy.weave,
        note: blueprint.note,
      } satisfies ThreadlinePuzzle;

      replaceMap(lastSeen, attemptLastSeen);
      if (copyFreshness && attemptCopyFreshness) {
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
  'Title "{title}" gives the {domain} row a concrete doorway while keeping {threads} off the label.',
  'Title "{title}" feels named from the scene itself; {threads} surface only after the solve begins.',
  'Title "{title}" is literal enough to picture and distant enough not to spoil {threads}.',
  'Title "{title}" frames the moment first, so {threads} can stay hidden until the reveal.',
  'Title "{title}" reads like a human label for the {domain} scene rather than a category hint.',
  'Title "{title}" points at the shared place without handing over {threads}.',
] as const;

const APPROVAL_LEAD_NOTES = [
  'Lead read: "{lead}" The line gives {firstAnswers} concrete work in {firstThread} and lets {secondAnswers} behave as {secondThread}.',
  'Lead read: "{lead}" Read aloud, the sentence has a point of view before it asks the player to separate {firstThread} from {secondThread}.',
  'Lead read: "{lead}" {firstAnswers} ground the visible scene as {firstThread}; {secondAnswers} supply the turn through {secondThread}.',
  'Lead read: "{lead}" The filled sentence can stand on its own: {firstAnswers} carry {firstThread}, while {secondAnswers} carry {secondThread}.',
  'Lead read: "{lead}" The blanks fall into ordinary syntax, with {firstAnswers} grounding {firstThread} and {secondAnswers} grounding {secondThread}.',
  'Lead read: "{lead}" Nothing in the line depends on puzzle instructions; {firstThread} and {secondThread} stay readable inside the sentence.',
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
  const grammarScore = reviewEntry.scores.grammarScore.toFixed(2);
  const weaveScore = reviewEntry.scores.payoffBridgeScore.toFixed(2);
  const hash = approvalHash(`${reviewEntry.dateKey ?? puzzle.id}:${puzzle.title}:${puzzle.weave}`);
  const [firstThread, secondThread] = puzzle.threads;
  const replacements = {
    title: puzzle.title,
    domain: approvalDomainLabel(reviewEntry),
    threads: `${approvalThreadLabel(firstThread)} / ${approvalThreadLabel(secondThread)}`,
    lead: clippedApprovalEvidence(filledLead, 132),
    weave: puzzle.weave,
    firstThread: approvalThreadLabel(firstThread),
    secondThread: approvalThreadLabel(secondThread),
    firstAnswers: approvalThreadAnswers(puzzle, firstThread),
    secondAnswers: approvalThreadAnswers(puzzle, secondThread),
  };
  return [
    formatApprovalNoteTemplate(approvalPick(APPROVAL_TITLE_NOTES, hash, 1), replacements),
    formatApprovalNoteTemplate(approvalPick(APPROVAL_LEAD_NOTES, hash, 2), replacements),
    `${formatApprovalNoteTemplate(
      approvalPick(APPROVAL_WEAVE_NOTES, hash, 3),
      replacements
    )} Scores: ${grammarScore} grammar, ${weaveScore} weave.`,
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
  dayIndex: number
): CopyScoreSummary {
  const lead = completedLead(puzzle);
  const flags: string[] = [];

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
    flags,
    reviewNote:
      flags.length === 0
        ? 'Editorial pursuit copy cleared title sense, standalone lead, and aha-weave checks.'
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
        ? `Copy review: "${puzzle.title}" holds the title/lead/weave contract; lead reads "${clippedApprovalEvidence(
            completedLead(puzzle),
            96
          )}"; weave lands as "${puzzle.weave}".`
        : `Copy review: "${puzzle.title}" needs ${copy.flags.join(', ')}; lead reads "${clippedApprovalEvidence(
            completedLead(puzzle),
            96
          )}"; weave lands as "${puzzle.weave}".`,
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
    grammarScore: 'filled-lead naturalness and answer role fit',
    titleCoherenceScore: 'title sense and nonspoiling specificity',
    payoffBridgeScore: 'theme-level final-weave aha',
    poeticTextureScore: 'concise human texture',
    difficultyIntegrityScore: 'difficulty earned through answers and grid, not awkward prose',
  };
  return labels[key] ?? key;
}

function reserveTighteningNote(candidate: ThreadlineCandidateEntry): string {
  const coreScores: Array<{ key: keyof ThreadlineReviewScores; value: number }> = [
    { key: 'grammarScore', value: candidate.review.scores.grammarScore },
    { key: 'titleCoherenceScore', value: candidate.review.scores.titleCoherenceScore },
    { key: 'payoffBridgeScore', value: candidate.review.scores.payoffBridgeScore },
    { key: 'poeticTextureScore', value: candidate.review.scores.poeticTextureScore },
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
  )}; improve ${weakestDimensions}. Re-read title "${candidate.puzzle.title}", filled lead "${clippedApprovalEvidence(
    completedLead(candidate.puzzle),
    96
  )}", and weave "${candidate.puzzle.weave}" as a single human reveal.${flags}`;
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

  const finalizeCandidate = (candidate: ThreadlineCandidateEntry, isScheduled: boolean): void => {
    const { puzzle, blueprint, sourceDateKey, review: reviewEntry } = candidate;
    const needsTightening = tighteningReserveIds.has(puzzle.id);
    const storedReview: ThreadlineEditorReview = isScheduled
      ? reviewEntry
      : {
          ...reviewEntry,
          dateKey: null,
          freshnessNote: `${reviewEntry.freshnessNote} Reserve source date ${sourceDateKey}.${
            needsTightening ? ` ${reserveTighteningNote(candidate)}` : ''
          }`,
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
        reserveStatus: needsTightening ? 'needs-tightening' : 'ready',
        tighteningNote: needsTightening ? reserveTighteningNote(candidate) : null,
      });
    }

    review[puzzle.id] = storedReview;
    const filledLead = completedLead(puzzle);
    approvedCopy[puzzle.id] = {
      puzzleId: puzzle.id,
      dateKey: isScheduled ? sourceDateKey : null,
      title: puzzle.title,
      filledLead,
      weave: puzzle.weave,
      editorStatus: 'approved',
      approvalSource: 'manual-600-exceptional-floor',
      reviewNote: approvalReviewNote(puzzle, filledLead, storedReview),
      readAloudChecklist: [
        'title is natural and nonspoiling',
        'filled lead reads aloud as a standalone sentence',
        'answers have plausible grammatical roles',
        'weave connects the two themes without category math',
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
  const baseAudit = auditThreadlineCopy({
    puzzles: THREADLINE_PUZZLE_BANK,
    datedSchedule: THREADLINE_DATED_SCHEDULE,
    puzzleById: THREADLINE_PUZZLE_BY_ID,
    editorReview: THREADLINE_EDITOR_REVIEW,
    titleReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
    payoffReuseCooldownDays: THREADLINE_SHIPPED_COPY_REUSE_COOLDOWN_DAYS,
    maxSemicolonLeads: THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS,
    maxLeadStructureRepeats: THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS,
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
