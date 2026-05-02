import type {
  SubsetCategory,
  SubsetPuzzleDefinition,
  SubsetTile,
  SubsetTileId,
} from "./subsetPrototype";

export const SUBSET_SCHEDULE_START_DATE = "2026-05-15";
export const SUBSET_SCHEDULE_DAYS = 365;
export const SUBSET_SCHEDULE_VERSION = "v1";
export const SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS = 21;
export const SUBSET_MAX_WORD_REUSE_TARGET = 18;

export type SubsetScheduleDifficulty = "easy" | "medium" | "hard";
export type SubsetScheduleLane =
  | "concrete"
  | "modern"
  | "word-form"
  | "phrase"
  | "hybrid";

export interface SubsetScheduleCategory {
  label: string;
  words: string[];
}

export interface SubsetScheduledPuzzle {
  id: string;
  date: string;
  dayIndex: number;
  difficulty: SubsetScheduleDifficulty;
  editorialLane: SubsetScheduleLane;
  theme: string;
  familyId: string;
  centerWord: string;
  rows: SubsetScheduleCategory[];
  columns: SubsetScheduleCategory[];
  grid: string[][];
  pillarWord?: string;
  holiday?: {
    name: string;
    axis: "row" | "column";
    index: number;
    label: string;
  };
}

export interface SubsetScheduleEditorialAudit {
  difficultyCounts: Record<SubsetScheduleDifficulty, number>;
  laneCounts: Record<SubsetScheduleLane, number>;
  satisfaction: {
    averageScore: number;
    minimumScore: number;
  };
  wordReuse: {
    uniqueWords: number;
    maxUse: number;
    averageUse: number;
    underSoftCooldownCount: number;
    softCooldownDays: number;
  };
}

interface SubsetScheduleRowSeed {
  label: string;
  words: [string, string, string];
}

interface SubsetScheduleFamily {
  id: string;
  theme: string;
  editorialLane: SubsetScheduleLane;
  columns: [string, string, string];
  rows: SubsetScheduleRowSeed[];
}

interface SubsetHolidaySeed {
  date: string;
  name: string;
  difficulty: SubsetScheduleDifficulty;
  columns: [string, string, string];
  rows: [
    SubsetScheduleRowSeed,
    SubsetScheduleRowSeed,
    SubsetScheduleRowSeed,
  ];
}

interface SubsetSpecialSeed {
  date: string;
  familyId: string;
  theme: string;
  editorialLane: SubsetScheduleLane;
  difficulty: SubsetScheduleDifficulty;
  columns: [string, string, string];
  rows: [
    SubsetScheduleRowSeed,
    SubsetScheduleRowSeed,
    SubsetScheduleRowSeed,
  ];
  holiday?: string;
  pillarWord?: string;
}

interface SubsetScheduleBuildState {
  categoryLabelCounts: Map<string, number>;
  signatures: Set<string>;
  wordCounts: Map<string, number>;
  wordLastSeen: Map<string, number>;
  centerWordCounts: Map<string, number>;
  centerWordLastSeen: Map<string, number>;
}

const DIFFICULTY_CADENCE: SubsetScheduleDifficulty[] = [
  "medium",
  "hard",
  "medium",
  "easy",
  "easy",
  "medium",
  "hard",
];

export const SUBSET_SCHEDULE_FAMILIES: SubsetScheduleFamily[] = [
  {
    id: "outings",
    theme: "Places people go together",
    editorialLane: "concrete",
    columns: ["Beach", "Theater", "Stadium"],
    rows: [
      { label: "Seats", words: ["TOWEL", "BALCONY", "BLEACHERS"] },
      { label: "Snacks", words: ["PRETZEL", "POPCORN", "NACHOS"] },
      { label: "Sounds", words: ["WAVES", "APPLAUSE", "CHEERS"] },
      { label: "On Duty", words: ["LIFEGUARD", "USHER", "UMPIRE"] },
      { label: "Passes", words: ["WRISTBAND", "TICKET", "PASS"] },
      { label: "Gear", words: ["UMBRELLA", "COSTUME", "JERSEY"] },
    ],
  },
  {
    id: "rooms",
    theme: "Rooms and the objects that define them",
    editorialLane: "concrete",
    columns: ["Kitchen", "Bath", "Bedroom"],
    rows: [
      { label: "Fixtures", words: ["OVEN", "SHOWER", "BED"] },
      { label: "Storage", words: ["PANTRY", "CABINET", "CLOSET"] },
      { label: "Linens", words: ["NAPKIN", "TOWEL", "SHEET"] },
      { label: "Morning", words: ["COFFEE", "RAZOR", "ALARM"] },
      { label: "Floor Items", words: ["MAT", "SCALE", "RUG"] },
      { label: "Lights", words: ["PENDANT", "SCONCE", "LAMP"] },
    ],
  },
  {
    id: "opened-locked-shared",
    theme: "Everyday things by interaction",
    editorialLane: "hybrid",
    columns: ["Can Be Opened", "Can Be Locked", "Can Be Shared"],
    rows: [
      { label: "Digital", words: ["FILE", "PHONE", "LINK"] },
      { label: "Home", words: ["WINDOW", "DOOR", "ROOM"] },
      { label: "Work", words: ["CALENDAR", "ACCOUNT", "NOTE"] },
      { label: "Travel", words: ["GATE", "LUGGAGE", "RIDE"] },
      { label: "Kitchen", words: ["JAR", "PANTRY", "RECIPE"] },
      { label: "School", words: ["BOOK", "LOCKER", "PROJECT"] },
    ],
  },
  {
    id: "workspaces",
    theme: "Creative and focused work spaces",
    editorialLane: "concrete",
    columns: ["Studio", "Office", "Classroom"],
    rows: [
      { label: "Writing", words: ["SKETCH", "MEMO", "ESSAY"] },
      { label: "Furniture", words: ["EASEL", "DESK", "CHAIR"] },
      { label: "Supplies", words: ["BRUSH", "STAPLER", "RULER"] },
      { label: "Deadlines", words: ["COMMISSION", "REPORT", "HOMEWORK"] },
      { label: "Displays", words: ["CANVAS", "MONITOR", "PROJECTOR"] },
      { label: "Feedback", words: ["CRITIQUE", "REVIEW", "GRADE"] },
    ],
  },
  {
    id: "travel-stops",
    theme: "Travel stops and what they ask of you",
    editorialLane: "concrete",
    columns: ["Airport", "Hotel", "Camp"],
    rows: [
      { label: "Sleep", words: ["LOUNGE", "SUITE", "TENT"] },
      { label: "Bags", words: ["CARRYON", "LUGGAGE", "BACKPACK"] },
      { label: "Check-In", words: ["GATE", "LOBBY", "PERMIT"] },
      { label: "Comfort", words: ["PILLOW", "ROBE", "BLANKET"] },
      { label: "Food", words: ["PRETZEL", "BUFFET", "GRANOLA"] },
      { label: "Lights", words: ["BEACON", "LAMP", "LANTERN"] },
    ],
  },
  {
    id: "starts-bcs",
    theme: "A light first-letter grid",
    editorialLane: "word-form",
    columns: ["Starts with B", "Starts with C", "Starts with S"],
    rows: [
      { label: "Animals", words: ["BEAR", "COYOTE", "SEAL"] },
      { label: "Foods", words: ["BAGEL", "CURRY", "SALSA"] },
      { label: "Music", words: ["BEAT", "CHORD", "SOLO"] },
      { label: "Clothes", words: ["BOOT", "COAT", "SCARF"] },
      { label: "Office", words: ["BINDER", "CALENDAR", "STAPLER"] },
      { label: "Plants", words: ["BASIL", "CACTUS", "SAGE"] },
    ],
  },
  {
    id: "park-days",
    theme: "Green spaces and the things inside them",
    editorialLane: "concrete",
    columns: ["Garden", "Playground", "Trail"],
    rows: [
      { label: "Ground", words: ["MULCH", "SAND", "GRAVEL"] },
      { label: "Seats", words: ["BENCH", "SWING", "LOG"] },
      { label: "Signs", words: ["LABEL", "RULES", "MARKER"] },
      { label: "Water", words: ["HOSE", "FOUNTAIN", "STREAM"] },
      { label: "Tools", words: ["RAKE", "SHOVEL", "COMPASS"] },
      { label: "Wildlife", words: ["BEE", "SQUIRREL", "DEER"] },
    ],
  },
  {
    id: "food-stops",
    theme: "Places to get something good",
    editorialLane: "concrete",
    columns: ["Bakery", "Diner", "Market"],
    rows: [
      { label: "Crew", words: ["BAKER", "SERVER", "CASHIER"] },
      { label: "Counters", words: ["CASE", "COUNTER", "STALL"] },
      { label: "Breakfast", words: ["MUFFIN", "OMELET", "BERRIES"] },
      { label: "Paper", words: ["BAG", "MENU", "LIST"] },
      { label: "Sweet", words: ["ICING", "SYRUP", "HONEY"] },
      { label: "Tools", words: ["OVEN", "GRIDDLE", "SCALE"] },
    ],
  },
  {
    id: "media-modes",
    theme: "Modern media in three formats",
    editorialLane: "modern",
    columns: ["Podcast", "Movie", "Newsletter"],
    rows: [
      { label: "Openers", words: ["INTRO", "SCENE", "HEADLINE"] },
      { label: "People", words: ["HOST", "ACTOR", "EDITOR"] },
      { label: "Timing", words: ["EPISODE", "TRAILER", "ISSUE"] },
      { label: "Sound", words: ["MIC", "SCORE", "TONE"] },
      { label: "Following", words: ["SUBSCRIBE", "WATCHLIST", "INBOX"] },
      { label: "Opinion", words: ["RATING", "REVIEW", "COMMENT"] },
    ],
  },
  {
    id: "cut-folded-stacked",
    theme: "Tactile objects by action",
    editorialLane: "phrase",
    columns: ["Can Be Cut", "Can Be Folded", "Can Be Stacked"],
    rows: [
      { label: "Paper", words: ["CARD", "LETTER", "POSTER"] },
      { label: "Food", words: ["CAKE", "TORTILLA", "PANCAKE"] },
      { label: "Clothing", words: ["SHIRT", "JEANS", "SWEATER"] },
      { label: "Camping", words: ["ROPE", "TENT", "FIREWOOD"] },
      { label: "Office", words: ["PAPER", "FOLDER", "TRAYS"] },
      { label: "Picnic", words: ["BREAD", "NAPKIN", "PLATES"] },
    ],
  },
  {
    id: "sports-fields",
    theme: "Sports through their objects and rhythms",
    editorialLane: "concrete",
    columns: ["Baseball", "Tennis", "Soccer"],
    rows: [
      { label: "Gear", words: ["BAT", "RACKET", "CLEATS"] },
      { label: "Scoring", words: ["RUN", "SET", "GOAL"] },
      { label: "Places", words: ["DUGOUT", "COURT", "FIELD"] },
      { label: "Officials", words: ["UMPIRE", "REFEREE", "REF"] },
      { label: "Actions", words: ["PITCH", "SERVE", "PASS"] },
      { label: "Fans", words: ["CAP", "VISOR", "SCARF"] },
    ],
  },
  {
    id: "music-groups",
    theme: "Three ways people make music together",
    editorialLane: "concrete",
    columns: ["Band", "Orchestra", "Choir"],
    rows: [
      { label: "Players", words: ["DRUMMER", "VIOLINIST", "SINGER"] },
      { label: "Practice", words: ["GARAGE", "REHEARSAL", "WARMUP"] },
      { label: "Parts", words: ["SOLO", "MOVEMENT", "VERSE"] },
      { label: "Sheets", words: ["SETLIST", "SCORE", "HYMNAL"] },
      { label: "Signals", words: ["COUNT", "BATON", "CUE"] },
      { label: "Sounds", words: ["RIFF", "CRESCENDO", "HARMONY"] },
    ],
  },
  {
    id: "ends-try",
    theme: "A light final-letter grid",
    editorialLane: "word-form",
    columns: ["Ends in T", "Ends in R", "Ends in Y"],
    rows: [
      { label: "Animals", words: ["BAT", "BEAVER", "PONY"] },
      { label: "Foods", words: ["TOAST", "BURGER", "HONEY"] },
      { label: "Tech", words: ["BOT", "ROUTER", "PROXY"] },
      { label: "Clothes", words: ["VEST", "BLAZER", "JERSEY"] },
      { label: "Music", words: ["CHANT", "GUITAR", "HARMONY"] },
      { label: "Sports", words: ["COURT", "RACER", "HOCKEY"] },
    ],
  },
  {
    id: "nature-zones",
    theme: "Nature by habitat and texture",
    editorialLane: "concrete",
    columns: ["Forest", "Ocean", "Sky"],
    rows: [
      { label: "Animals", words: ["FOX", "SEAL", "EAGLE"] },
      { label: "Motion", words: ["RUSTLE", "CURRENT", "BREEZE"] },
      { label: "Colors", words: ["MOSS", "CORAL", "AZURE"] },
      { label: "Weather", words: ["FOG", "TIDE", "CLOUD"] },
      { label: "Curves", words: ["RING", "WAVE", "ARC"] },
      { label: "Treasures", words: ["ACORN", "PEARL", "STAR"] },
    ],
  },
  {
    id: "city-outings",
    theme: "A day moving through the city",
    editorialLane: "concrete",
    columns: ["Subway", "Museum", "Restaurant"],
    rows: [
      { label: "Tickets", words: ["FARE", "ADMISSION", "RESERVATION"] },
      { label: "Maps", words: ["ROUTE", "GALLERY", "MENU"] },
      { label: "Workers", words: ["CONDUCTOR", "DOCENT", "WAITER"] },
      { label: "Seats", words: ["SEAT", "BENCH", "BOOTH"] },
      { label: "Waiting", words: ["PLATFORM", "LINE", "TABLE"] },
      { label: "Objects", words: ["TOKEN", "FRAME", "FORK"] },
    ],
  },
  {
    id: "worn-thrown-drawn",
    theme: "Words that change by use",
    editorialLane: "phrase",
    columns: ["Can Be Worn", "Can Be Thrown", "Can Be Drawn"],
    rows: [
      { label: "Sports", words: ["JERSEY", "BALL", "PLAY"] },
      { label: "Party", words: ["HAT", "CONFETTI", "NAME"] },
      { label: "Magic", words: ["CLOAK", "SPELL", "CIRCLE"] },
      { label: "Theater", words: ["COSTUME", "ROSE", "CURTAIN"] },
      { label: "Games", words: ["CROWN", "DICE", "MAP"] },
      { label: "Studio", words: ["APRON", "CLAY", "SKETCH"] },
    ],
  },
  {
    id: "errands",
    theme: "Small errands with their own rituals",
    editorialLane: "concrete",
    columns: ["Bank", "Pharmacy", "Post Office"],
    rows: [
      { label: "Staff", words: ["TELLER", "PHARMACIST", "CLERK"] },
      { label: "Papers", words: ["CHECK", "PRESCRIPTION", "STAMP"] },
      { label: "Cards", words: ["DEBIT", "INSURANCE", "POSTCARD"] },
      { label: "Storage", words: ["VAULT", "DRAWER", "BOX"] },
      { label: "Numbers", words: ["PIN", "DOSE", "ZIP"] },
      { label: "Receipts", words: ["RECEIPT", "LABEL", "TRACKING"] },
    ],
  },
  {
    id: "school-life",
    theme: "A school building after the bell",
    editorialLane: "concrete",
    columns: ["Library", "Gym", "Lab"],
    rows: [
      { label: "Adults", words: ["LIBRARIAN", "COACH", "SCIENTIST"] },
      { label: "Equipment", words: ["SHELF", "WHISTLE", "MICROSCOPE"] },
      { label: "Rules", words: ["QUIET", "DRILLS", "SAFETY"] },
      { label: "Sounds", words: ["PAGE", "BUZZER", "BEEP"] },
      { label: "Work", words: ["READING", "LAPS", "EXPERIMENT"] },
      { label: "Storage", words: ["STACK", "LOCKER", "FREEZER"] },
    ],
  },
  {
    id: "length-357",
    theme: "A light word-length grid",
    editorialLane: "word-form",
    columns: ["3 Letters", "5 Letters", "7 Letters"],
    rows: [
      { label: "Animals", words: ["CAT", "HORSE", "GIRAFFE"] },
      { label: "Foods", words: ["TEA", "SALAD", "LASAGNA"] },
      { label: "Music", words: ["RAP", "OPERA", "CONCERT"] },
      { label: "Sports", words: ["SKI", "RUGBY", "CYCLING"] },
      { label: "Home", words: ["RUG", "SHELF", "CABINET"] },
      { label: "Weather", words: ["FOG", "STORM", "DRIZZLE"] },
    ],
  },
  {
    id: "celebrations",
    theme: "Milestones and the things they gather",
    editorialLane: "concrete",
    columns: ["Birthday", "Wedding", "Graduation"],
    rows: [
      { label: "Keepsakes", words: ["CARD", "RING", "DIPLOMA"] },
      { label: "Guests", words: ["FRIEND", "BRIDE", "CLASSMATE"] },
      { label: "Clothes", words: ["HAT", "VEIL", "GOWN"] },
      { label: "Spoken", words: ["WISH", "VOW", "SPEECH"] },
      { label: "Treats", words: ["CAKE", "CHAMPAGNE", "CUPCAKE"] },
      { label: "Symbols", words: ["CANDLE", "BOUQUET", "TASSEL"] },
    ],
  },
  {
    id: "commute",
    theme: "Getting across town",
    editorialLane: "concrete",
    columns: ["Bike", "Bus", "Train"],
    rows: [
      { label: "Operators", words: ["RIDER", "DRIVER", "CONDUCTOR"] },
      { label: "Routes", words: ["LANE", "ROUTE", "TRACK"] },
      { label: "Stops", words: ["RACK", "SHELTER", "STATION"] },
      { label: "Signals", words: ["BELL", "SIGN", "WHISTLE"] },
      { label: "Passes", words: ["LOCK", "PASS", "TICKET"] },
      { label: "Motion", words: ["PEDAL", "RIDE", "RAIL"] },
    ],
  },
  {
    id: "pets",
    theme: "Pets by care, sound, and play",
    editorialLane: "concrete",
    columns: ["Dog", "Cat", "Fish"],
    rows: [
      { label: "Homes", words: ["KENNEL", "CONDO", "TANK"] },
      { label: "Food", words: ["KIBBLE", "TUNA", "FLAKES"] },
      { label: "Care", words: ["LEASH", "LITTER", "FILTER"] },
      { label: "Sounds", words: ["BARK", "MEOW", "BUBBLES"] },
      { label: "Toys", words: ["BALL", "YARN", "CASTLE"] },
      { label: "Motion", words: ["FETCH", "POUNCE", "SWIM"] },
    ],
  },
  {
    id: "daily-tech",
    theme: "Personal tech by use and parts",
    editorialLane: "modern",
    columns: ["Phone", "Laptop", "Camera"],
    rows: [
      { label: "Parts", words: ["SCREEN", "KEYBOARD", "LENS"] },
      { label: "Power", words: ["CHARGER", "CABLE", "BATTERY"] },
      { label: "Actions", words: ["CALL", "TYPE", "SNAP"] },
      { label: "Storage", words: ["CONTACTS", "FILES", "ALBUM"] },
      { label: "Warnings", words: ["ALERT", "CRASH", "BLUR"] },
      { label: "Accessories", words: ["CASE", "MOUSE", "TRIPOD"] },
    ],
  },
  {
    id: "saved-sent-printed",
    theme: "Useful things by what happens to them",
    editorialLane: "hybrid",
    columns: ["Can Be Saved", "Can Be Sent", "Can Be Printed"],
    rows: [
      { label: "Work", words: ["FILE", "EMAIL", "REPORT"] },
      { label: "Money", words: ["RECEIPT", "INVOICE", "COUPON"] },
      { label: "School", words: ["PROJECT", "NOTE", "HANDOUT"] },
      { label: "Photo", words: ["IMAGE", "SNAP", "POSTER"] },
      { label: "Kitchen", words: ["RECIPE", "INVITE", "MENU"] },
      { label: "Travel", words: ["MAP", "TEXT", "TICKET"] },
    ],
  },
];

const SUBSET_HOLIDAY_SEEDS: SubsetHolidaySeed[] = [
  {
    date: "2027-05-09",
    name: "Mother's Day",
    difficulty: "easy",
    columns: ["Gifts", "Flowers", "Family"],
    rows: [
      { label: "Mother's Day", words: ["CARD", "ROSES", "MOM"] },
      { label: "Wedding", words: ["RING", "BOUQUET", "BRIDE"] },
      { label: "Childhood", words: ["TOY", "DAISY", "CHILD"] },
    ],
  },
  {
    date: "2026-05-25",
    name: "Memorial Day",
    difficulty: "medium",
    columns: ["Symbols", "Events", "Promises"],
    rows: [
      { label: "Memorial Day", words: ["FLAG", "PARADE", "HONOR"] },
      { label: "School", words: ["BADGE", "ASSEMBLY", "PLEDGE"] },
      { label: "Wedding", words: ["RING", "CEREMONY", "VOW"] },
    ],
  },
  {
    date: "2026-06-19",
    name: "Juneteenth",
    difficulty: "medium",
    columns: ["Food", "Values", "Gatherings"],
    rows: [
      { label: "Juneteenth", words: ["BARBECUE", "FREEDOM", "JUBILEE"] },
      { label: "School", words: ["LUNCH", "FAIRNESS", "ASSEMBLY"] },
      { label: "Wedding", words: ["DINNER", "TRUST", "RECEPTION"] },
    ],
  },
  {
    date: "2026-06-21",
    name: "Father's Day",
    difficulty: "easy",
    columns: ["Family", "Food", "Gifts"],
    rows: [
      { label: "Father's Day", words: ["DAD", "GRILL", "TIE"] },
      { label: "Wedding", words: ["BRIDE", "DINNER", "RING"] },
      { label: "Childhood", words: ["CHILD", "SNACK", "TOY"] },
    ],
  },
  {
    date: "2026-07-04",
    name: "Independence Day",
    difficulty: "easy",
    columns: ["Lights", "Gatherings", "Symbols"],
    rows: [
      {
        label: "Independence Day",
        words: ["FIREWORKS", "PARADE", "FLAG"],
      },
      { label: "Theater", words: ["SPOTLIGHT", "AUDIENCE", "CURTAIN"] },
      { label: "School", words: ["LAMP", "ASSEMBLY", "BADGE"] },
    ],
  },
  {
    date: "2026-09-07",
    name: "Labor Day",
    difficulty: "medium",
    columns: ["Work", "Outdoors", "Deals"],
    rows: [
      { label: "Labor Day", words: ["WORKERS", "PICNIC", "SALE"] },
      { label: "Store", words: ["CLERK", "PATIO", "COUPON"] },
      { label: "School", words: ["HOMEWORK", "RECESS", "FUNDRAISER"] },
    ],
  },
  {
    date: "2026-10-31",
    name: "Halloween",
    difficulty: "easy",
    columns: ["Sweets", "Outfits", "Spooky"],
    rows: [
      { label: "Halloween", words: ["CANDY", "COSTUME", "GHOST"] },
      { label: "Monster", words: ["COOKIE", "MASK", "VAMPIRE"] },
      { label: "Party", words: ["CAKE", "HAT", "SHADOW"] },
    ],
  },
  {
    date: "2026-11-11",
    name: "Veterans Day",
    difficulty: "medium",
    columns: ["Symbols", "Honors", "Service"],
    rows: [
      { label: "Veterans Day", words: ["FLAG", "MEDAL", "SERVICE"] },
      { label: "School", words: ["BADGE", "GRADE", "DUTY"] },
      { label: "Wedding", words: ["RING", "TOAST", "VOW"] },
    ],
  },
  {
    date: "2026-11-26",
    name: "Thanksgiving",
    difficulty: "easy",
    columns: ["Food", "Events", "Gratitude"],
    rows: [
      { label: "Thanksgiving", words: ["TURKEY", "PARADE", "THANKS"] },
      { label: "School", words: ["LUNCH", "ASSEMBLY", "PRAISE"] },
      { label: "Wedding", words: ["DINNER", "RECEPTION", "TOAST"] },
    ],
  },
  {
    date: "2026-12-24",
    name: "Christmas Eve",
    difficulty: "easy",
    columns: ["Music", "Gifts", "Decor"],
    rows: [
      { label: "Christmas Eve", words: ["CAROL", "GIFT", "TREE"] },
      { label: "Birthday", words: ["SONG", "SURPRISE", "BALLOON"] },
      { label: "Service", words: ["HYMN", "CARD", "WREATH"] },
    ],
  },
  {
    date: "2026-12-25",
    name: "Christmas",
    difficulty: "easy",
    columns: ["Sweets", "Gifts", "Visitors"],
    rows: [
      { label: "Christmas", words: ["COOKIE", "GIFT", "SANTA"] },
      { label: "Birthday", words: ["CAKE", "PRESENT", "GUEST"] },
      { label: "Housewarming", words: ["PIE", "PLANT", "NEIGHBOR"] },
    ],
  },
  {
    date: "2026-12-31",
    name: "New Year's Eve",
    difficulty: "medium",
    columns: ["Moments", "Drinks", "Promises"],
    rows: [
      { label: "New Year's Eve", words: ["COUNTDOWN", "TOAST", "RESOLUTION"] },
      { label: "Wedding", words: ["CEREMONY", "CHAMPAGNE", "VOW"] },
      { label: "School", words: ["DEADLINE", "JUICE", "GOAL"] },
    ],
  },
  {
    date: "2027-01-01",
    name: "New Year's Day",
    difficulty: "easy",
    columns: ["Fresh", "Plans", "Beginnings"],
    rows: [
      { label: "New Year's Day", words: ["FRESH", "RESOLUTION", "START"] },
      { label: "Garden", words: ["SEED", "PLAN", "SPROUT"] },
      { label: "School", words: ["NOTEBOOK", "SCHEDULE", "CLASS"] },
    ],
  },
  {
    date: "2027-01-18",
    name: "MLK Day",
    difficulty: "medium",
    columns: ["Values", "Speech", "Action"],
    rows: [
      { label: "MLK Day", words: ["DREAM", "SPEECH", "MARCH"] },
      { label: "School", words: ["FAIRNESS", "ESSAY", "PROJECT"] },
      { label: "Court", words: ["JUSTICE", "ARGUMENT", "VERDICT"] },
    ],
  },
  {
    date: "2027-02-14",
    name: "Valentine's Day",
    difficulty: "easy",
    columns: ["Gifts", "Flowers", "Affection"],
    rows: [
      { label: "Valentine's Day", words: ["CARD", "ROSES", "HEART"] },
      { label: "Wedding", words: ["RING", "BOUQUET", "VOW"] },
      { label: "Friendship", words: ["NOTE", "DAISY", "HUG"] },
    ],
  },
  {
    date: "2027-02-15",
    name: "Presidents' Day",
    difficulty: "hard",
    columns: ["Voting", "Leaders", "Places"],
    rows: [
      { label: "Presidents' Day", words: ["BALLOT", "LINCOLN", "WASHINGTON"] },
      { label: "School", words: ["ELECTION", "PRINCIPAL", "CLASSROOM"] },
      { label: "City", words: ["POLL", "MAYOR", "CAPITOL"] },
    ],
  },
  {
    date: "2027-03-17",
    name: "St. Patrick's Day",
    difficulty: "easy",
    columns: ["Green", "Symbols", "Plants"],
    rows: [
      { label: "St. Patrick's Day", words: ["GREEN", "CLOVER", "SHAMROCK"] },
      { label: "Garden", words: ["MOSS", "MARKER", "FERN"] },
      { label: "Traffic", words: ["GO", "SIGN", "HEDGE"] },
    ],
  },
  {
    date: "2027-03-28",
    name: "Easter",
    difficulty: "easy",
    columns: ["Treats", "Animals", "Flowers"],
    rows: [
      { label: "Easter", words: ["CHOCOLATE", "BUNNY", "LILY"] },
      { label: "Picnic", words: ["COOKIE", "ANT", "DAISY"] },
      { label: "Garden", words: ["HONEY", "BEE", "ROSE"] },
    ],
  },
  {
    date: "2027-04-22",
    name: "Earth Day",
    difficulty: "medium",
    columns: ["Nature", "Planet", "Care"],
    rows: [
      { label: "Earth Day", words: ["CLIMATE", "PLANET", "RECYCLE"] },
      { label: "Garden", words: ["SOIL", "EARTH", "COMPOST"] },
      { label: "Ocean", words: ["TIDE", "REEF", "CLEANUP"] },
    ],
  },
  {
    date: "2027-05-05",
    name: "Cinco de Mayo",
    difficulty: "medium",
    columns: ["Food", "Music", "Movement"],
    rows: [
      { label: "Cinco de Mayo", words: ["TACOS", "MARIACHI", "DANCE"] },
      { label: "Wedding", words: ["DINNER", "BAND", "WALTZ"] },
      { label: "Parade", words: ["CANDY", "DRUM", "MARCH"] },
    ],
  },
];

export const SUBSET_HOLIDAYS = SUBSET_HOLIDAY_SEEDS.map((holiday) => ({
  date: holiday.date,
  name: holiday.name,
}));

const SUBSET_PILLAR_SEEDS: SubsetSpecialSeed[] = [
  {
    date: "2026-11-03",
    familyId: "pillar-hope",
    theme: "A hopeful Election Day center",
    editorialLane: "hybrid",
    difficulty: "medium",
    columns: ["Actions", "Feelings", "Outcomes"],
    rows: [
      { label: "Morning", words: ["BREW", "CALM", "SUNRISE"] },
      { label: "Election Day", words: ["VOTE", "HOPE", "COUNT"] },
      { label: "Garden", words: ["PLANT", "PATIENCE", "HARVEST"] },
    ],
    pillarWord: "HOPE",
  },
];

const SPECIAL_BY_DATE = new Map<string, SubsetSpecialSeed>([
  ...SUBSET_HOLIDAY_SEEDS.map((holiday): [string, SubsetSpecialSeed] => [
    holiday.date,
    {
      date: holiday.date,
      familyId: `holiday-${slugify(holiday.name)}`,
      theme: holiday.name,
      editorialLane: "hybrid",
      difficulty: holiday.difficulty,
      columns: holiday.columns,
      rows: holiday.rows,
      holiday: holiday.name,
    },
  ]),
  ...SUBSET_PILLAR_SEEDS.map((seed): [string, SubsetSpecialSeed] => [
    seed.date,
    seed,
  ]),
]);

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createTileId(word: string, index: number): SubsetTileId {
  return `${slugify(word)}-${index}`;
}

function createFallbackUnsolvedBoard(
  solutionBoard: SubsetTileId[],
): SubsetTileId[] {
  const fallbackPattern = [0, 1, 3, 2, 4, 6, 5, 8, 7];
  return fallbackPattern.map((index) => solutionBoard[index]);
}

export function createSubsetPuzzleDefinitionFromScheduledPuzzle(
  puzzle: SubsetScheduledPuzzle,
): SubsetPuzzleDefinition {
  const words = puzzle.grid.flat();
  const idsByWord = new Map<string, SubsetTileId>(
    words.map((word, index) => [word, createTileId(word, index)]),
  );
  const tiles: SubsetTile[] = words.map((word) => ({
    id: idsByWord.get(word) ?? slugify(word),
    word,
  }));
  const solutionGrid = puzzle.grid.map((row) =>
    row.map((word) => idsByWord.get(word) ?? slugify(word)),
  );
  const solutionBoard = solutionGrid.flat();
  const rowCategories: SubsetCategory[] = puzzle.rows.map((row, index) => ({
    id: `row-${index}-${slugify(row.label)}`,
    axis: "row",
    index,
    label: row.label,
    tileIds: row.words.map((word) => idsByWord.get(word) ?? slugify(word)),
  }));
  const columnCategories: SubsetCategory[] = puzzle.columns.map(
    (column, index) => ({
      id: `column-${index}-${slugify(column.label)}`,
      axis: "column",
      index,
      label: column.label,
      tileIds: column.words.map((word) => idsByWord.get(word) ?? slugify(word)),
    }),
  );

  return {
    id: puzzle.id,
    date: puzzle.date,
    title: puzzle.holiday?.name ?? puzzle.pillarWord ?? "Daily puzzle",
    tiles,
    solutionGrid,
    solutionBoard,
    fallbackUnsolvedBoard: createFallbackUnsolvedBoard(solutionBoard),
    fixedCell: {
      index: 4,
      tileId: solutionBoard[4],
    },
    rowCategories,
    columnCategories,
    categories: [...rowCategories, ...columnCategories],
  };
}

function hasUniqueWords(rows: SubsetScheduleRowSeed[]): boolean {
  const words = rows.flatMap((row) => row.words);
  return new Set(words).size === words.length;
}

function buildRowCombinations(
  family: SubsetScheduleFamily,
): SubsetScheduleRowSeed[][] {
  const combinations: SubsetScheduleRowSeed[][] = [];
  for (let first = 0; first < family.rows.length - 2; first += 1) {
    for (let second = first + 1; second < family.rows.length - 1; second += 1) {
      for (let third = second + 1; third < family.rows.length; third += 1) {
        const rows = [
          family.rows[first],
          family.rows[second],
          family.rows[third],
        ];
        if (hasUniqueWords(rows)) {
          combinations.push(rows);
        }
      }
    }
  }
  return combinations;
}

function buildSpecialPuzzleForDay(
  seed: SubsetSpecialSeed,
  dayIndex: number,
): SubsetScheduledPuzzle {
  const grid = seed.rows.map((row) => [...row.words]);
  const centerWord = grid[1][1];
  const puzzle: SubsetScheduledPuzzle = {
    id: `subset-${seed.date}-${seed.familyId}`,
    date: seed.date,
    dayIndex,
    difficulty: seed.difficulty,
    editorialLane: seed.editorialLane,
    theme: seed.theme,
    familyId: seed.familyId,
    centerWord,
    pillarWord: seed.pillarWord,
    rows: seed.rows.map((row) => ({ label: row.label, words: [...row.words] })),
    columns: seed.columns.map((label, columnIndex) => ({
      label,
      words: seed.rows.map((row) => row.words[columnIndex]),
    })),
    grid,
  };

  if (seed.holiday) {
    puzzle.holiday = {
      name: seed.holiday,
      axis: "row",
      index: 0,
      label: seed.rows[0].label,
    };
  }

  return puzzle;
}

function getGridSignature(grid: string[][]): string {
  return [...grid.flat()].sort().join("|");
}

function registerPuzzle(
  state: SubsetScheduleBuildState,
  puzzle: SubsetScheduledPuzzle,
): void {
  state.signatures.add(getGridSignature(puzzle.grid));
  [...puzzle.rows, ...puzzle.columns].forEach((category) => {
    state.categoryLabelCounts.set(
      category.label,
      (state.categoryLabelCounts.get(category.label) ?? 0) + 1,
    );
  });
  puzzle.grid.flat().forEach((word) => {
    state.wordCounts.set(word, (state.wordCounts.get(word) ?? 0) + 1);
    state.wordLastSeen.set(word, puzzle.dayIndex);
  });
  state.centerWordCounts.set(
    puzzle.centerWord,
    (state.centerWordCounts.get(puzzle.centerWord) ?? 0) + 1,
  );
  state.centerWordLastSeen.set(puzzle.centerWord, puzzle.dayIndex);
}

function scoreRowsForSchedule(
  rows: SubsetScheduleRowSeed[],
  dayIndex: number,
  state: SubsetScheduleBuildState,
): number {
  const words = rows.flatMap((row) => row.words);
  const signature = [...words].sort().join("|");
  if (state.signatures.has(signature)) return Number.POSITIVE_INFINITY;

  let score = 0;
  words.forEach((word) => {
    const useCount = state.wordCounts.get(word) ?? 0;
    const lastSeen = state.wordLastSeen.get(word);
    score += useCount * useCount * 40;
    if (lastSeen !== undefined) {
      const gap = dayIndex - lastSeen;
      if (gap < SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS) {
        score += (SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS - gap) * 120;
      }
    }
  });

  rows.forEach((row) => {
    score += (state.categoryLabelCounts.get(row.label) ?? 0) * 18;
  });

  const centerWord = rows[1].words[1];
  score += (state.centerWordCounts.get(centerWord) ?? 0) ** 2 * 130;
  const centerLastSeen = state.centerWordLastSeen.get(centerWord);
  if (centerLastSeen !== undefined) {
    const centerGap = dayIndex - centerLastSeen;
    if (centerGap < 60) {
      score += (60 - centerGap) * 100_000;
    }
  }
  return score;
}

function buildGenericPuzzleForDay(
  dayIndex: number,
  date: string,
  state: SubsetScheduleBuildState,
): SubsetScheduledPuzzle {
  const familyIndex = dayIndex % SUBSET_SCHEDULE_FAMILIES.length;
  const family = SUBSET_SCHEDULE_FAMILIES[familyIndex];
  const combinations = buildRowCombinations(family);
  const rows = combinations.reduce((bestRows, candidateRows) => {
    const bestScore = scoreRowsForSchedule(bestRows, dayIndex, state);
    const candidateScore = scoreRowsForSchedule(candidateRows, dayIndex, state);
    return candidateScore < bestScore ? candidateRows : bestRows;
  }, combinations[0]);
  const grid = rows.map((row) => [...row.words]);

  return {
    id: `subset-${date}-${family.id}-${slugify(rows.map((row) => row.label).join("-"))}`,
    date,
    dayIndex,
    difficulty: DIFFICULTY_CADENCE[dayIndex % DIFFICULTY_CADENCE.length],
    editorialLane: family.editorialLane,
    theme: family.theme,
    familyId: family.id,
    centerWord: grid[1][1],
    rows: rows.map((row) => ({ label: row.label, words: [...row.words] })),
    columns: family.columns.map((label, columnIndex) => ({
      label,
      words: rows.map((row) => row.words[columnIndex]),
    })),
    grid,
  };
}

function buildSubsetSchedule(): SubsetScheduledPuzzle[] {
  const state: SubsetScheduleBuildState = {
    categoryLabelCounts: new Map(),
    signatures: new Set(),
    wordCounts: new Map(),
    wordLastSeen: new Map(),
    centerWordCounts: new Map(),
    centerWordLastSeen: new Map(),
  };
  const schedule: SubsetScheduledPuzzle[] = [];

  for (let dayIndex = 0; dayIndex < SUBSET_SCHEDULE_DAYS; dayIndex += 1) {
    const date = addUtcDays(SUBSET_SCHEDULE_START_DATE, dayIndex);
    const specialSeed = SPECIAL_BY_DATE.get(date);
    const puzzle = specialSeed
      ? buildSpecialPuzzleForDay(specialSeed, dayIndex)
      : buildGenericPuzzleForDay(dayIndex, date, state);
    schedule.push(puzzle);
    registerPuzzle(state, puzzle);
  }

  return schedule;
}

function countBy<T extends string>(
  values: T[],
  keys: readonly T[],
): Record<T, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<
    T,
    number
  >;
  values.forEach((value) => {
    counts[value] += 1;
  });
  return counts;
}

export function scoreSubsetPuzzleSatisfaction(
  puzzle: SubsetScheduledPuzzle,
): number {
  const words = puzzle.grid.flat();
  let score = 76;
  if (puzzle.holiday) score += 6;
  if (puzzle.pillarWord) score += 6;
  if (puzzle.editorialLane === "concrete") score += 6;
  if (puzzle.editorialLane === "modern") score += 5;
  if (puzzle.editorialLane === "phrase" || puzzle.editorialLane === "hybrid")
    score += 4;
  if (puzzle.editorialLane === "word-form") score -= 2;
  if (puzzle.difficulty === "easy") score += 2;
  if (puzzle.difficulty === "hard") score -= 1;
  if (words.some((word) => word.length > 11)) score -= 1;
  if (new Set(puzzle.rows.map((row) => row.label)).size === 3) score += 3;
  if (new Set(puzzle.columns.map((column) => column.label)).size === 3)
    score += 3;
  return Math.max(0, Math.min(100, score));
}

export const SUBSET_SCHEDULE: SubsetScheduledPuzzle[] =
  buildSubsetSchedule();

export function getSubsetScheduleEditorialAudit(
  schedule: SubsetScheduledPuzzle[] = SUBSET_SCHEDULE,
): SubsetScheduleEditorialAudit {
  const wordCounts = new Map<string, number>();
  const wordLastSeen = new Map<string, number>();
  let underSoftCooldownCount = 0;

  schedule.forEach((puzzle) => {
    puzzle.grid.flat().forEach((word) => {
      const lastSeen = wordLastSeen.get(word);
      if (
        lastSeen !== undefined &&
        puzzle.dayIndex - lastSeen < SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS
      ) {
        underSoftCooldownCount += 1;
      }
      wordLastSeen.set(word, puzzle.dayIndex);
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    });
  });

  const uses = [...wordCounts.values()];
  const satisfactionScores = schedule.map(scoreSubsetPuzzleSatisfaction);

  return {
    difficultyCounts: countBy(
      schedule.map((puzzle) => puzzle.difficulty),
      ["easy", "medium", "hard"],
    ),
    laneCounts: countBy(
      schedule.map((puzzle) => puzzle.editorialLane),
      ["concrete", "modern", "word-form", "phrase", "hybrid"],
    ),
    satisfaction: {
      averageScore:
        satisfactionScores.reduce((total, score) => total + score, 0) /
        satisfactionScores.length,
      minimumScore: Math.min(...satisfactionScores),
    },
    wordReuse: {
      uniqueWords: wordCounts.size,
      maxUse: Math.max(...uses),
      averageUse: uses.reduce((total, count) => total + count, 0) / uses.length,
      underSoftCooldownCount,
      softCooldownDays: SUBSET_WORD_REUSE_SOFT_COOLDOWN_DAYS,
    },
  };
}

export function getSubsetPuzzleForDate(
  dateKey: string,
): SubsetScheduledPuzzle | null {
  return SUBSET_SCHEDULE.find((puzzle) => puzzle.date === dateKey) ?? null;
}

export function getSubsetPackPuzzleForDate(
  dateKey: string,
): SubsetScheduledPuzzle | null {
  if (dateKey < SUBSET_SCHEDULE_START_DATE) return null;
  return getSubsetPuzzleForDate(dateKey);
}

export function getTodaysSubsetPuzzle(
  today = new Date(),
): SubsetScheduledPuzzle | null {
  return getSubsetPackPuzzleForDate(toDateKey(today));
}
