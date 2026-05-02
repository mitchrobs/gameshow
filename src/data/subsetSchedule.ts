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
  rowLabelCounts: Map<string, number>;
  signatures: Set<string>;
  wordCounts: Map<string, number>;
  wordLastSeen: Map<string, number>;
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
    id: "starts-bcs",
    theme: "Everyday categories by first letter",
    editorialLane: "word-form",
    columns: ["Starts with B", "Starts with C", "Starts with S"],
    rows: [
      { label: "Animals", words: ["BEAR", "COYOTE", "SEAL"] },
      { label: "Foods", words: ["BAGEL", "CURRY", "SALSA"] },
      { label: "Music", words: ["BEAT", "CHORD", "SOLO"] },
      { label: "Sports", words: ["BOXING", "CRICKET", "SOCCER"] },
      { label: "Clothing", words: ["BOOT", "COAT", "SCARF"] },
      { label: "Office", words: ["BINDER", "CALENDAR", "STAPLER"] },
      { label: "Weather", words: ["BLIZZARD", "CLOUD", "SNOW"] },
      { label: "Travel", words: ["BUS", "CRUISE", "SUBWAY"] },
      { label: "Plants", words: ["BASIL", "CACTUS", "SAGE"] },
      { label: "Games", words: ["BINGO", "CHESS", "SCRABBLE"] },
      { label: "Home", words: ["BOWL", "CHAIR", "SOFA"] },
      { label: "Digital", words: ["BROWSER", "COOKIE", "SERVER"] },
    ],
  },
  {
    id: "starts-mpt",
    theme: "Modern mix by first letter",
    editorialLane: "word-form",
    columns: ["Starts with M", "Starts with P", "Starts with T"],
    rows: [
      { label: "Animals", words: ["MOUSE", "PANDA", "TIGER"] },
      { label: "Foods", words: ["MUFFIN", "PASTA", "TACO"] },
      { label: "Music", words: ["MELODY", "PIANO", "TRUMPET"] },
      { label: "Sports", words: ["MARATHON", "POLO", "TENNIS"] },
      { label: "Clothing", words: ["MITTEN", "PANTS", "TIE"] },
      { label: "Office", words: ["MEMO", "PAPER", "TASK"] },
      { label: "Weather", words: ["MIST", "PRESSURE", "TEMPEST"] },
      { label: "Travel", words: ["METRO", "PASSPORT", "TICKET"] },
      { label: "Plants", words: ["MOSS", "POPPY", "TULIP"] },
      { label: "Games", words: ["MAHJONG", "POKER", "TAG"] },
      { label: "Home", words: ["MIRROR", "PILLOW", "TRUNK"] },
      { label: "Digital", words: ["MODEM", "PIXEL", "TAB"] },
    ],
  },
  {
    id: "ends-try",
    theme: "Concrete categories by final letter",
    editorialLane: "word-form",
    columns: ["Ends in T", "Ends in R", "Ends in Y"],
    rows: [
      { label: "Animals", words: ["BAT", "BEAVER", "PONY"] },
      { label: "Foods", words: ["TOAST", "BURGER", "HONEY"] },
      { label: "Tech", words: ["BOT", "ROUTER", "PROXY"] },
      { label: "Clothing", words: ["HAT", "BLAZER", "JERSEY"] },
      { label: "Music", words: ["CHANT", "GUITAR", "HARMONY"] },
      { label: "Sports", words: ["COURT", "RACER", "HOCKEY"] },
      { label: "Weather", words: ["SLEET", "THUNDER", "CLOUDY"] },
      { label: "Home", words: ["MAT", "MIRROR", "ENTRY"] },
      { label: "Office", words: ["DRAFT", "FOLDER", "COPY"] },
      { label: "Travel", words: ["TICKET", "DRIVER", "FERRY"] },
      { label: "Plants", words: ["ROOT", "FLOWER", "IVY"] },
      { label: "Games", words: ["QUEST", "PLAYER", "STRATEGY"] },
    ],
  },
  {
    id: "ends-ens",
    theme: "Daily-life categories by final letter",
    editorialLane: "word-form",
    columns: ["Ends in E", "Ends in N", "Ends in S"],
    rows: [
      { label: "Animals", words: ["MOOSE", "LION", "FOXES"] },
      { label: "Foods", words: ["PIE", "BACON", "FRIES"] },
      { label: "Music", words: ["NOTE", "HYMN", "DRUMS"] },
      { label: "Sports", words: ["RACE", "RUN", "SKIS"] },
      { label: "Clothing", words: ["SHOE", "APRON", "GLASSES"] },
      { label: "Office", words: ["CASE", "PEN", "NOTES"] },
      { label: "Weather", words: ["BREEZE", "RAIN", "CLOUDS"] },
      { label: "Travel", words: ["PLANE", "TRAIN", "TICKETS"] },
      { label: "Plants", words: ["VINE", "ACORN", "ROSES"] },
      { label: "Games", words: ["DICE", "TOKEN", "CARDS"] },
      { label: "Home", words: ["HOUSE", "SCREEN", "CURTAINS"] },
      { label: "Digital", words: ["QUEUE", "LOGIN", "SETTINGS"] },
    ],
  },
  {
    id: "length-357",
    theme: "Concrete categories by word length",
    editorialLane: "word-form",
    columns: ["3 Letters", "5 Letters", "7 Letters"],
    rows: [
      { label: "Animals", words: ["CAT", "HORSE", "GIRAFFE"] },
      { label: "Foods", words: ["TEA", "SALAD", "LASAGNA"] },
      { label: "Music", words: ["RAP", "OPERA", "CONCERT"] },
      { label: "Sports", words: ["SKI", "RUGBY", "CYCLING"] },
      { label: "Home", words: ["RUG", "SHELF", "CABINET"] },
      { label: "Weather", words: ["FOG", "STORM", "DRIZZLE"] },
      { label: "Travel", words: ["BUS", "TRAIN", "AIRPORT"] },
      { label: "Plants", words: ["OAK", "FERNS", "ORCHARD"] },
      { label: "Clothing", words: ["HAT", "SCARF", "SWEATER"] },
      { label: "Office", words: ["PAD", "EMAIL", "MEETING"] },
      { label: "Digital", words: ["APP", "CLOUD", "WEBSITE"] },
      { label: "Games", words: ["UNO", "CARDS", "MAHJONG"] },
    ],
  },
  {
    id: "opened-locked-shared",
    theme: "Objects by interaction",
    editorialLane: "modern",
    columns: ["Can Be Opened", "Can Be Locked", "Can Be Shared"],
    rows: [
      { label: "Digital", words: ["FILE", "PHONE", "LINK"] },
      { label: "Home", words: ["WINDOW", "DOOR", "ROOM"] },
      { label: "Work", words: ["CALENDAR", "DESK", "NOTE"] },
      { label: "Travel", words: ["GATE", "LUGGAGE", "RIDE"] },
      { label: "Food", words: ["JAR", "PANTRY", "RECIPE"] },
      { label: "School", words: ["BOOK", "LOCKER", "PROJECT"] },
      { label: "Finance", words: ["ACCOUNT", "CARD", "BILL"] },
      { label: "Gaming", words: ["CHEST", "LEVEL", "SCREEN"] },
      { label: "Social", words: ["THREAD", "ACCOUNT", "POST"] },
      { label: "Media", words: ["VIDEO", "ARCHIVE", "PLAYLIST"] },
      { label: "Community", words: ["GARDEN", "SHED", "TOOL"] },
      { label: "Personal", words: ["JOURNAL", "DIARY", "STORY"] },
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
      { label: "Office", words: ["FILE", "FOLDER", "TRAYS"] },
      { label: "Home", words: ["CURTAIN", "BLANKET", "TOWELS"] },
      { label: "Crafts", words: ["RIBBON", "ORIGAMI", "BEADS"] },
      { label: "Garden", words: ["HEDGE", "HOSE", "POTS"] },
      { label: "Games", words: ["DECK", "BOARD", "TOKENS"] },
      { label: "Building", words: ["TILE", "LADDER", "BRICKS"] },
      { label: "Mail", words: ["LABEL", "ENVELOPE", "BOXES"] },
      { label: "Picnic", words: ["BREAD", "NAPKIN", "PLATES"] },
    ],
  },
  {
    id: "played-recorded-streamed",
    theme: "Media and activity formats",
    editorialLane: "modern",
    columns: ["Can Be Played", "Can Be Recorded", "Can Be Streamed"],
    rows: [
      { label: "Music", words: ["SONG", "DEMO", "ALBUM"] },
      { label: "Games", words: ["GAME", "MATCH", "SPEEDRUN"] },
      { label: "Video", words: ["MOVIE", "CLIP", "SERIES"] },
      { label: "Audio", words: ["PODCAST", "INTERVIEW", "RADIO"] },
      { label: "Sports", words: ["MATCH", "HIGHLIGHT", "TOURNAMENT"] },
      { label: "Theater", words: ["PLAY", "REHEARSAL", "SHOW"] },
      { label: "Learning", words: ["LESSON", "LECTURE", "COURSE"] },
      { label: "Fitness", words: ["ROUTINE", "SESSION", "CLASS"] },
      { label: "News", words: ["SEGMENT", "REPORT", "BROADCAST"] },
      { label: "Comedy", words: ["SET", "SPECIAL", "CHANNEL"] },
      { label: "Dance", words: ["ROUTINE", "RECITAL", "PERFORMANCE"] },
      { label: "Esports", words: ["ROUND", "REPLAY", "TOURNAMENT"] },
    ],
  },
];

const SUBSET_HOLIDAY_SEEDS: SubsetHolidaySeed[] = [
  {
    date: "2027-05-09",
    name: "Mother's Day",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with F", "Starts with M"],
    rows: [
      { label: "Mother's Day", words: ["CARD", "FLOWERS", "MOM"] },
      { label: "Animals", words: ["CAT", "FOX", "MOOSE"] },
      { label: "Foods", words: ["CURRY", "FRIES", "MUFFIN"] },
    ],
  },
  {
    date: "2026-05-25",
    name: "Memorial Day",
    difficulty: "medium",
    columns: ["Starts with F", "Starts with P", "Starts with S"],
    rows: [
      { label: "Memorial Day", words: ["FLAG", "PARADE", "SERVICE"] },
      { label: "Animals", words: ["FOX", "PANDA", "SEAL"] },
      { label: "Foods", words: ["FRIES", "PASTA", "SALSA"] },
    ],
  },
  {
    date: "2026-06-19",
    name: "Juneteenth",
    difficulty: "medium",
    columns: ["Starts with B", "Starts with F", "Starts with J"],
    rows: [
      { label: "Juneteenth", words: ["BARBECUE", "FREEDOM", "JUBILEE"] },
      { label: "Music", words: ["BEAT", "FOLK", "JAZZ"] },
      { label: "Foods", words: ["BREAD", "FRIES", "JAM"] },
    ],
  },
  {
    date: "2026-06-21",
    name: "Father's Day",
    difficulty: "easy",
    columns: ["Starts with D", "Starts with G", "Starts with T"],
    rows: [
      { label: "Father's Day", words: ["DAD", "GRILL", "TIE"] },
      { label: "Animals", words: ["DEER", "GOAT", "TIGER"] },
      { label: "Games", words: ["DICE", "GO", "TAG"] },
    ],
  },
  {
    date: "2026-07-04",
    name: "Independence Day",
    difficulty: "easy",
    columns: ["Starts with F", "Starts with P", "Starts with S"],
    rows: [
      {
        label: "Independence Day",
        words: ["FIREWORKS", "PARADE", "SPARKLERS"],
      },
      { label: "Music", words: ["FOLK", "PIANO", "SONG"] },
      { label: "Travel", words: ["FERRY", "PLANE", "SUBWAY"] },
    ],
  },
  {
    date: "2026-09-07",
    name: "Labor Day",
    difficulty: "medium",
    columns: ["Starts with W", "Starts with P", "Starts with S"],
    rows: [
      { label: "Labor Day", words: ["WORKERS", "PICNIC", "SALE"] },
      { label: "Digital", words: ["WEBSITE", "PIXEL", "SERVER"] },
      { label: "Home", words: ["WINDOW", "PILLOW", "SOFA"] },
    ],
  },
  {
    date: "2026-10-31",
    name: "Halloween",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with G", "Starts with T"],
    rows: [
      { label: "Halloween", words: ["CANDY", "GHOST", "TREAT"] },
      { label: "Animals", words: ["CAT", "GOAT", "TIGER"] },
      { label: "Colors", words: ["CYAN", "GREEN", "TAN"] },
    ],
  },
  {
    date: "2026-11-11",
    name: "Veterans Day",
    difficulty: "medium",
    columns: ["Starts with F", "Starts with M", "Starts with S"],
    rows: [
      { label: "Veterans Day", words: ["FLAG", "MEDAL", "SERVICE"] },
      { label: "Weather", words: ["FOG", "MIST", "STORM"] },
      { label: "Music", words: ["FOLK", "MELODY", "SOLO"] },
    ],
  },
  {
    date: "2026-11-26",
    name: "Thanksgiving",
    difficulty: "easy",
    columns: ["Starts with F", "Starts with P", "Starts with T"],
    rows: [
      { label: "Thanksgiving", words: ["FEAST", "PARADE", "TURKEY"] },
      { label: "Music", words: ["FOLK", "PIANO", "TRUMPET"] },
      { label: "Travel", words: ["FERRY", "PASSPORT", "TRAIN"] },
    ],
  },
  {
    date: "2026-12-24",
    name: "Christmas Eve",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with G", "Starts with T"],
    rows: [
      { label: "Christmas Eve", words: ["CAROL", "GIFT", "TREE"] },
      { label: "Animals", words: ["CAT", "GOAT", "TIGER"] },
      { label: "Games", words: ["CHESS", "GO", "TAG"] },
    ],
  },
  {
    date: "2026-12-25",
    name: "Christmas",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with G", "Starts with S"],
    rows: [
      { label: "Christmas", words: ["CAROL", "GIFT", "SANTA"] },
      { label: "Foods", words: ["COOKIE", "GRAVY", "SOUP"] },
      { label: "Home", words: ["CHAIR", "GARAGE", "SOFA"] },
    ],
  },
  {
    date: "2026-12-31",
    name: "New Year's Eve",
    difficulty: "medium",
    columns: ["Starts with C", "Starts with R", "Starts with T"],
    rows: [
      { label: "New Year's Eve", words: ["COUNTDOWN", "RESOLUTION", "TOAST"] },
      { label: "Sports", words: ["COURT", "RACER", "TENNIS"] },
      { label: "Office", words: ["CALENDAR", "REPORT", "TASK"] },
    ],
  },
  {
    date: "2027-01-01",
    name: "New Year's Day",
    difficulty: "easy",
    columns: ["Starts with F", "Starts with R", "Starts with S"],
    rows: [
      { label: "New Year's Day", words: ["FRESH", "RESOLUTION", "START"] },
      { label: "Weather", words: ["FOG", "RAIN", "SNOW"] },
      { label: "Music", words: ["FOLK", "RAP", "SONG"] },
    ],
  },
  {
    date: "2027-01-18",
    name: "MLK Day",
    difficulty: "medium",
    columns: ["Starts with D", "Starts with E", "Starts with J"],
    rows: [
      { label: "MLK Day", words: ["DREAM", "EQUALITY", "JUSTICE"] },
      { label: "Animals", words: ["DEER", "EAGLE", "JAGUAR"] },
      { label: "Foods", words: ["DUMPLING", "EGG", "JAM"] },
    ],
  },
  {
    date: "2027-02-14",
    name: "Valentine's Day",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with F", "Starts with H"],
    rows: [
      { label: "Valentine's Day", words: ["CARD", "FLOWERS", "HEART"] },
      { label: "Animals", words: ["CAT", "FOX", "HORSE"] },
      { label: "Foods", words: ["CAKE", "FRIES", "HONEY"] },
    ],
  },
  {
    date: "2027-02-15",
    name: "Presidents' Day",
    difficulty: "hard",
    columns: ["Starts with B", "Starts with L", "Starts with W"],
    rows: [
      { label: "Presidents' Day", words: ["BALLOT", "LINCOLN", "WASHINGTON"] },
      { label: "Animals", words: ["BEAR", "LION", "WOLF"] },
      { label: "Home", words: ["BOWL", "LAMP", "WINDOW"] },
    ],
  },
  {
    date: "2027-03-17",
    name: "St. Patrick's Day",
    difficulty: "easy",
    columns: ["Starts with C", "Starts with G", "Starts with S"],
    rows: [
      { label: "St. Patrick's Day", words: ["CLOVER", "GREEN", "SHAMROCK"] },
      { label: "Music", words: ["CHORD", "GUITAR", "SOLO"] },
      { label: "Foods", words: ["CURRY", "GRAPES", "SALSA"] },
    ],
  },
  {
    date: "2027-03-28",
    name: "Easter",
    difficulty: "easy",
    columns: ["Starts with B", "Starts with E", "Starts with R"],
    rows: [
      { label: "Easter", words: ["BUNNY", "EGG", "RABBIT"] },
      { label: "Office", words: ["BINDER", "EMAIL", "REPORT"] },
      { label: "Foods", words: ["BREAD", "EDAMAME", "RICE"] },
    ],
  },
  {
    date: "2027-04-22",
    name: "Earth Day",
    difficulty: "medium",
    columns: ["Starts with C", "Starts with P", "Starts with R"],
    rows: [
      { label: "Earth Day", words: ["CLIMATE", "PLANET", "RECYCLE"] },
      { label: "Animals", words: ["CAT", "PANDA", "RABBIT"] },
      { label: "Foods", words: ["CURRY", "PASTA", "RICE"] },
    ],
  },
  {
    date: "2027-05-05",
    name: "Cinco de Mayo",
    difficulty: "medium",
    columns: ["Starts with D", "Starts with M", "Starts with T"],
    rows: [
      { label: "Cinco de Mayo", words: ["DANCE", "MARIACHI", "TACOS"] },
      { label: "Animals", words: ["DEER", "MOOSE", "TIGER"] },
      { label: "Office", words: ["DRAFT", "MEMO", "TASK"] },
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
    columns: ["Starts with F", "Starts with H", "Starts with T"],
    rows: [
      { label: "Animals", words: ["FOX", "HORSE", "TIGER"] },
      { label: "Abstract Nouns", words: ["FAITH", "HOPE", "TRUST"] },
      { label: "Foods", words: ["FRIES", "HONEY", "TACO"] },
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
  puzzle.rows.forEach((row) => {
    state.rowLabelCounts.set(
      row.label,
      (state.rowLabelCounts.get(row.label) ?? 0) + 1,
    );
  });
  puzzle.grid.flat().forEach((word) => {
    state.wordCounts.set(word, (state.wordCounts.get(word) ?? 0) + 1);
    state.wordLastSeen.set(word, puzzle.dayIndex);
  });
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
    score += (state.rowLabelCounts.get(row.label) ?? 0) * 18;
  });

  const centerWord = rows[1].words[1];
  score += (state.wordCounts.get(centerWord) ?? 0) * 35;
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
    rowLabelCounts: new Map(),
    signatures: new Set(),
    wordCounts: new Map(),
    wordLastSeen: new Map(),
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
  let score = 74;
  if (puzzle.holiday) score += 8;
  if (puzzle.pillarWord) score += 7;
  if (puzzle.editorialLane === "modern" || puzzle.editorialLane === "phrase")
    score += 4;
  if (puzzle.editorialLane === "hybrid") score += 3;
  if (puzzle.difficulty === "easy") score += 3;
  if (puzzle.difficulty === "hard") score -= 2;
  if (words.some((word) => word.length > 10)) score -= 3;
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
