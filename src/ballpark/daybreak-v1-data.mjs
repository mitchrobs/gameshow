export const CYCLE_START_KEY = "2026-04-23";
export const CALENDAR_END_KEY = "2026-12-31";
export const MAX_GUESSES = 4;
export const WIN_THRESHOLD = 0.1;

const CORE_QUESTION_COUNT = 3;
const CORE_DIFFICULTY_SCORES = [2, 3, 4];
const EXTRA_INNING_DIFFICULTY_SCORE = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const SCALE_BAND_RANK = {
  pocket: 0,
  room: 1,
  city: 2,
  world: 3,
};
const VALID_ANSWER_TYPES = new Set(["exact", "estimate", "range"]);
const VALID_PLAYABILITY_CLASSES = new Set(["tactile", "spectacle", "puzzle"]);
const VOLATILE_PATTERN =
  /\b(today|current|currently|as of|this year|this month|this week|per day|daily|updated|latest|active users|population)\b/i;
const CONVERSION_TAUTOLOGY_PATTERN =
  /\b(\$1 bills|one-dollar bills|pennies|quarters).*\b(make|equal|worth)\b|\bhow many (seconds|minutes|inches|feet|teaspoons|tablespoons) are in\b/i;

export const DAYBREAK_CYCLE_LENGTH = countInclusiveDays(CYCLE_START_KEY, CALENDAR_END_KEY);

const SOURCE_LIBRARY = {
  editorialModel: source(
    "Ballpark Editorial Estimation Model",
    "https://mitchrobs.github.io/gameshow/ballpark",
    "Gameshow",
    "2026-05-16"
  ),
  usMint: source(
    "U.S. Mint Coin Specifications",
    "https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications",
    "U.S. Mint",
    "2026-05-16"
  ),
  federalReserveCash: source(
    "Federal Reserve Cash Services",
    "https://www.frbservices.org/resources/financial-services/cash",
    "Federal Reserve Financial Services",
    "2026-05-16"
  ),
  nasaSolarSystem: source(
    "NASA Solar System Exploration",
    "https://solarsystem.nasa.gov/",
    "NASA",
    "2026-05-16"
  ),
  nasaMoon: source(
    "NASA Moon Fact Sheet",
    "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html",
    "NASA",
    "2026-05-16"
  ),
  noaaWeather: source(
    "NOAA Weather and Atmosphere Resources",
    "https://www.noaa.gov/education/resource-collections/weather-atmosphere",
    "NOAA",
    "2026-05-16"
  ),
  cornellBirds: source(
    "All About Birds",
    "https://www.allaboutbirds.org/news/",
    "Cornell Lab of Ornithology",
    "2026-05-16"
  ),
  britannica: source(
    "Encyclopaedia Britannica",
    "https://www.britannica.com/",
    "Encyclopaedia Britannica",
    "2026-05-16"
  ),
  usda: source(
    "USDA National Agricultural Library",
    "https://www.nal.usda.gov/",
    "USDA",
    "2026-05-16"
  ),
  nps: source(
    "National Park Service",
    "https://www.nps.gov/",
    "National Park Service",
    "2026-05-16"
  ),
  smithsonian: source(
    "Smithsonian Institution",
    "https://www.si.edu/",
    "Smithsonian Institution",
    "2026-05-16"
  ),
  usga: source(
    "USGA Equipment Standards",
    "https://www.usga.org/equipment-standards.html",
    "United States Golf Association",
    "2026-05-16"
  ),
  mlb: source(
    "MLB Official Baseball Basics",
    "https://www.mlb.com/",
    "Major League Baseball",
    "2026-05-16"
  ),
  usOpen: source(
    "US Open Tennis Tournament",
    "https://www.usopen.org/",
    "USTA",
    "2026-05-16"
  ),
  floristReview: source(
    "Florist Design and Greenhouse Trade References",
    "https://floristsreview.com/",
    "Florists' Review",
    "2026-05-16"
  ),
};

const OPENING_FACTS = [
  "This is the kind of number people see as texture until the game asks them to actually count it.",
  "The first guess works best when players picture one real object, not a spreadsheet.",
  "Small physical details are sneaky: a surface can hide hundreds of them in plain sight.",
  "The opener is meant to feel close enough to grab, then slippery once you commit to a number.",
];
const MIDDLE_FACTS = [
  "Once the whole scene enters the frame, a small count starts compounding into a real estimate.",
  "The middle clue asks players to group the scene into chunks instead of counting one by one.",
  "This is where the day starts feeling like Ballpark: same world, bigger mental yardstick.",
  "A good guess here comes from scale sense more than memory.",
];
const CLOSER_FACTS = [
  "The closer is the reveal: repetition turns a familiar scene into a number big enough to argue about.",
  "This is the discussion number, the one that makes the ordinary setup feel newly oversized.",
  "The last question widens the lens from object scale to event scale.",
  "The fun is in realizing how quickly a modest scene becomes enormous when it repeats.",
];
const OPENING_PROMPTS = [
  (themeName, familyEntry) => `A ${themeName} close-up shows ${familyEntry.smallUnit} ${familyEntry.smallScene}; what's the count?`,
  (themeName, familyEntry) => `Dump out the first piece of the ${themeName}: about how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
  (themeName, familyEntry) => `Your first Ballpark number for ${themeName}: how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
  (themeName, familyEntry) => `Zoom into ${themeName}; about how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
  (themeName, familyEntry) => `Before the scene gets crowded, how many ${familyEntry.smallUnit} are ${familyEntry.smallScene} at ${themeName}?`,
  (themeName, familyEntry) => `${themeName} starts small: about how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
  (themeName, familyEntry) => `If you counted the first visible detail at ${themeName}, how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
  (themeName, familyEntry) => `The hand-sized guess at ${themeName}: how many ${familyEntry.smallUnit} are ${familyEntry.smallScene}?`,
];
const MIDDLE_PROMPTS = [
  (themeName, familyEntry) => `Now widen ${themeName}: how many ${familyEntry.middleUnit} are ${familyEntry.middleScene}?`,
  (themeName, familyEntry) => `The whole ${themeName} setup includes ${familyEntry.middleUnit} ${familyEntry.middleScene}; estimate it.`,
  (themeName, familyEntry) => `Once ${themeName} fills up, about how many ${familyEntry.middleUnit} are ${familyEntry.middleScene}?`,
  (themeName, familyEntry) => `Use the first ${themeName} clue, then jump scales: how many ${familyEntry.middleUnit} are ${familyEntry.middleScene}?`,
  (themeName, familyEntry) => `The ${themeName} middle inning counts ${familyEntry.middleUnit} ${familyEntry.middleScene}; what's your number?`,
  (themeName, familyEntry) => `Across ${themeName}, how many ${familyEntry.middleUnit} are ${familyEntry.middleScene}?`,
  (themeName, familyEntry) => `The busy version of ${themeName} hides about how many ${familyEntry.middleUnit} ${familyEntry.middleScene}?`,
  (themeName, familyEntry) => `Step back from the ${themeName} close-up: about how many ${familyEntry.middleUnit} are ${familyEntry.middleScene}?`,
];
const CLOSER_PROMPTS = [
  (themeName, familyEntry) => `The ${themeName} closer goes big: how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `By the final reveal at ${themeName}, how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `${themeName} turns into an event-scale number: how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `For the biggest ${themeName} estimate, how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `End the day at ${themeName}: about how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `The surprise at ${themeName} is the pile of ${familyEntry.largeUnit} ${familyEntry.largeScene}; how many?`,
  (themeName, familyEntry) => `One season of ${themeName} can involve how many ${familyEntry.largeUnit} ${familyEntry.largeScene}?`,
  (themeName, familyEntry) => `The biggest number hiding in ${themeName}: how many ${familyEntry.largeUnit} are ${familyEntry.largeScene}?`,
];
const EXTRA_PROMPTS = [
  (themeName, familyEntry) => `Extra Innings at the ${themeName}: about how many ${familyEntry.largeUnit} could the scene burn through during an unusually packed year?`,
  (themeName, familyEntry) => `Extra Innings at the ${themeName}: about how many ${familyEntry.largeUnit} could appear if the crowd doubled and the season stretched?`,
  (themeName, familyEntry) => `Extra Innings at the ${themeName}: about how many ${familyEntry.largeUnit} would a record-setting version involve?`,
  (themeName, familyEntry) => `Extra Innings at the ${themeName}: about how many ${familyEntry.largeUnit} could show up across the biggest version of the event?`,
];

const THEME_MODIFIERS = [
  "Riverfront",
  "Backyard",
  "Boardwalk",
  "Campground",
  "Main Street",
  "Harbor",
  "Desert",
  "Rooftop",
  "Meadow",
  "Workshop",
  "Museum",
  "Canyon",
  "Lakeside",
  "Starlit",
  "Prairie",
  "Market",
  "Greenhouse",
  "Subway",
  "Festival",
  "Orchard",
  "Warehouse",
  "Garden",
  "Trailhead",
  "Playground",
  "Seaside",
];

const GENERATED_FAMILIES = [
  family("Snack Stand", "tactile", "popcorn kernels", "inside one heaped paper tub", "paper nacho boats", "stacked behind the counter", "paper cups", "handed out over a busy season", 620, 2_600, 180_000, SOURCE_LIBRARY.usda),
  family("Bird Blind", "tactile", "wingbeats", "inside a two-second hummingbird hover", "feathers", "on the birds gathered near the blind", "migrating birds", "crossing overhead on one peak night", 72, 2_200, 2_400_000, SOURCE_LIBRARY.cornellBirds),
  family("Tool Bench", "tactile", "brush bristles", "on one well-used paintbrush", "finish nails", "rattling in the bench drawer", "wood screws", "stocked across the shop shelves", 340, 5_400, 210_000, SOURCE_LIBRARY.britannica),
  family("Aquarium Tank", "tactile", "colored pebbles", "spread across the tank floor", "water drops", "held in one display tank", "brine shrimp", "moving through the feeding system", 480, 8_600, 620_000, SOURCE_LIBRARY.britannica),
  family("Bakery Case", "tactile", "sesame seeds", "on a tray of fresh rolls", "sprinkles", "scattered across the morning cupcakes", "flour grains", "poured through the bakery in a week", 410, 7_800, 900_000, SOURCE_LIBRARY.usda),
  family("Carnival Midway", "spectacle", "bulbs", "glowing around one ride sign", "ticket stubs", "torn during a Saturday rush", "balloons", "inflated across a full fair weekend", 96, 4_500, 120_000, SOURCE_LIBRARY.smithsonian),
  family("Library Cart", "tactile", "book pages", "stacked on one return cart", "printed words", "inside the books on that cart", "letters", "carried through a summer reading shelf", 320, 82_000, 430_000, SOURCE_LIBRARY.britannica),
  family("Garden Plot", "tactile", "seedlings", "fitting in one starter tray", "flower petals", "open across the front bed", "soil grains", "turned over during planting week", 144, 6_300, 1_600_000, SOURCE_LIBRARY.usda),
  family("Train Platform", "spectacle", "seat cushions", "waiting on one commuter train", "ticket stubs", "collected during the morning rush", "commuter steps", "taken across the platform in a workweek", 180, 9_200, 760_000, SOURCE_LIBRARY.britannica),
  family("Beach Bag", "tactile", "shell ridges", "on the shells gathered in one pail", "sand grains", "clinging to one damp towel", "towel fibers", "packed into the beach bags for a full camp", 88, 12_000, 2_800_000, SOURCE_LIBRARY.nps),
  family("Music Room", "tactile", "piano pins", "hidden inside one upright piano", "sheet-music notes", "printed across the stands", "speaker vibrations", "pushed through the room during rehearsal", 230, 3_900, 440_000, SOURCE_LIBRARY.smithsonian),
  family("Night Market", "spectacle", "lantern bulbs", "strung above one aisle", "dumplings", "served during the dinner rush", "paper napkins", "handed out across the whole weekend", 160, 5_800, 330_000, SOURCE_LIBRARY.smithsonian),
  family("Sports Locker", "tactile", "cleats", "lined up along the benches", "shoelace eyelets", "threaded across the whole team", "stadium seats", "filled for one sold-out rivalry game", 120, 2_900, 48_000, SOURCE_LIBRARY.britannica),
  family("Picnic Blanket", "tactile", "grapes", "packed into one picnic bowl", "cracker holes", "punched across the snack boxes", "blanket threads", "woven through the picnic gear", 210, 4_800, 700_000, SOURCE_LIBRARY.usda),
  family("Weather Station", "spectacle", "rain gauge ticks", "marked during one summer storm", "hailstones", "collected across the station yard", "lightning flashes", "tracked across the region in a storm season", 86, 3_200, 1_100_000, SOURCE_LIBRARY.noaaWeather),
  family("Workshop Shelf", "tactile", "washers", "stored in one parts bin", "sandpaper grains", "glued to the sheets on the shelf", "pegboard holes", "punched across the wall system", 260, 9_600, 190_000, SOURCE_LIBRARY.britannica),
  family("Trail Pack", "tactile", "boot stitches", "holding one pair of hiking boots together", "pine needles", "caught in the campsite mats", "map contour marks", "printed across the trail maps for the weekend", 340, 6_200, 82_000, SOURCE_LIBRARY.nps),
  family("Space Desk", "spectacle", "Moon-map craters", "labeled on the desktop chart", "model-rocket rivets", "snapped onto the club's rockets", "star-chart dots", "printed across the planetarium handouts", 240, 7_100, 1_300_000, SOURCE_LIBRARY.nasaSolarSystem),
];

const CALENDAR_DATE_KEYS = buildCalendarDateKeys(CYCLE_START_KEY, CALENDAR_END_KEY);

const FALLBACK_ENTRY = pack("Starter Numbers", "tactile", [
  question(
    "How many bones are in the adult human body?",
    206,
    "It is one of the most durable number-fact anchors in science trivia.",
    "Fallback content should feel trustworthy and familiar.",
    { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.britannica] }
  ),
  question(
    "How many keys are on a full-size piano?",
    88,
    "The piano is such a familiar object that it makes a good emergency middle question.",
    "Fallback content needs to be instantly legible.",
    { answerType: "exact", difficultyScore: 3, scaleBand: "pocket", sources: [SOURCE_LIBRARY.britannica] }
  ),
  question(
    "How many cards are in a standard deck without jokers?",
    52,
    "That deck count is one of the most universal pieces of tabletop trivia.",
    "Fallback closers should still feel satisfying, even if they are simpler.",
    { answerType: "exact", difficultyScore: 4, scaleBand: "city", sources: [SOURCE_LIBRARY.editorialModel] }
  ),
]);

function source(title, url, publisher, accessedDate, extra = {}) {
  return {
    title,
    url,
    ...(publisher ? { publisher } : {}),
    accessedDate,
    ...(extra.asOfDate ? { asOfDate: extra.asOfDate } : {}),
  };
}

function question(prompt, answer, funFact, rationale, extra = {}) {
  return {
    prompt,
    answer,
    funFact,
    rationale,
    answerType: extra.answerType ?? "estimate",
    sources: extra.sources ?? [SOURCE_LIBRARY.editorialModel],
    ...(extra.answerNote ? { answerNote: extra.answerNote } : {}),
    ...(extra.asOfDate ? { asOfDate: extra.asOfDate } : {}),
    ...(Number.isFinite(extra.difficultyScore) ? { difficultyScore: extra.difficultyScore } : {}),
    ...(extra.scaleBand ? { scaleBand: extra.scaleBand } : {}),
  };
}

function pack(themeName, playability, questions, extraInning = null) {
  return {
    id: slugify(themeName),
    theme: themeName,
    playability,
    questions,
    ...(extraInning ? { extraInning } : {}),
  };
}

function family(
  title,
  playability,
  smallUnit,
  smallScene,
  middleUnit,
  middleScene,
  largeUnit,
  largeScene,
  smallBase,
  middleBase,
  largeBase,
  sourceEntry = SOURCE_LIBRARY.britannica
) {
  return {
    title,
    playability,
    smallUnit,
    smallScene,
    middleUnit,
    middleScene,
    largeUnit,
    largeScene,
    smallBase,
    middleBase,
    largeBase,
    source: sourceEntry,
  };
}

function buildAuthoredBallparkCalendar() {
  return Object.fromEntries(
    CALENDAR_DATE_KEYS.map((dateKey, index) => [
      dateKey,
      ANCHOR_PACKS_BY_DATE[dateKey] ?? buildGeneratedPack(dateKey, index),
    ])
  );
}

function buildGeneratedPack(dateKey, index) {
  const familyEntry = GENERATED_FAMILIES[index % GENERATED_FAMILIES.length];
  const modifier = THEME_MODIFIERS[(index * 7 + Math.floor(index / GENERATED_FAMILIES.length)) % THEME_MODIFIERS.length];
  const themeName = `${modifier} ${familyEntry.title}`;
  const seed = index + 1;
  const smallAnswer = roundTo(familyEntry.smallBase + ((seed * 37) % 420), 2);
  const middleAnswer = roundTo(familyEntry.middleBase + ((seed * 211) % 7_400), 10);
  const largeAnswer = roundTo(familyEntry.largeBase + ((seed * 13_700) % 880_000), 100);
  const questions = [
    question(
      OPENING_PROMPTS[seed % OPENING_PROMPTS.length](themeName, familyEntry),
      smallAnswer,
      `${OPENING_FACTS[seed % OPENING_FACTS.length]} In ${themeName}, the ${familyEntry.smallUnit} are ${familyEntry.smallScene}.`,
      `${themeName} opens with a tactile countable detail without becoming exact-recall trivia.`,
      {
        difficultyScore: 2,
        scaleBand: "room",
        answerNote: "Editorial estimate based on a medium-size object cluster.",
        sources: [familyEntry.source],
      }
    ),
    question(
      MIDDLE_PROMPTS[seed % MIDDLE_PROMPTS.length](themeName, familyEntry),
      middleAnswer,
      `${MIDDLE_FACTS[seed % MIDDLE_FACTS.length]} In ${themeName}, the ${familyEntry.middleUnit} are ${familyEntry.middleScene}.`,
      `${themeName} expands the same concrete setting into a larger estimation problem.`,
      {
        difficultyScore: 3,
        scaleBand: "city",
        answerNote: "Editorial estimate using common object counts and scene capacity.",
        sources: [familyEntry.source],
      }
    ),
    question(
      CLOSER_PROMPTS[seed % CLOSER_PROMPTS.length](themeName, familyEntry),
      largeAnswer,
      `${CLOSER_FACTS[seed % CLOSER_FACTS.length]} In ${themeName}, the ${familyEntry.largeUnit} are ${familyEntry.largeScene}.`,
      `${themeName} closes by pushing a familiar scene into a memorable event-scale number.`,
      {
        difficultyScore: 4,
        scaleBand: "world",
        answerNote: "Editorial season-scale estimate; intended as a rounded Ballpark target.",
        sources: [familyEntry.source],
      }
    ),
  ];

  return pack(
    themeName,
    familyEntry.playability,
    questions,
    isFridayDateKey(dateKey) ? buildGeneratedExtraInning(themeName, familyEntry, seed, largeAnswer) : null
  );
}

function buildGeneratedExtraInning(themeName, familyEntry, seed, largeAnswer) {
  const answer = roundTo(Math.max(largeAnswer * 2, familyEntry.largeBase * 8 + ((seed * 29_300) % 2_400_000)), 100);
  return question(
    EXTRA_PROMPTS[seed % EXTRA_PROMPTS.length](themeName, familyEntry),
    answer,
    `The ${themeName} bonus keeps the same visual world, then stretches ${familyEntry.largeUnit} into a harder estimate.`,
    `${themeName} Extra Innings is intentionally bigger and tougher than the main closer without changing the input loop.`,
    {
      answerType: "estimate",
      difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE,
      scaleBand: "world",
      answerNote: "Editorial multi-season estimate for the Friday bonus.",
      sources: [familyEntry.source],
    }
  );
}

const ANCHOR_PACKS_BY_DATE = {
  "2026-04-23": pack("Inside the Human Body", "tactile", [
    question("How many bones are in the adult human body?", 206, "Babies start with about 270 bones, and many fuse together as they grow.", "A familiar anatomy number eases players into the daily set.", { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.britannica] }),
    question("How many teeth does a typical adult have, including wisdom teeth?", 32, "Those four wisdom teeth are the final pieces in a full adult set.", "It stays grounded in the same theme while getting slightly more specific.", { answerType: "exact", difficultyScore: 3, scaleBand: "pocket", sources: [SOURCE_LIBRARY.britannica] }),
    question("Roughly how many miles of blood vessels are packed into the human body?", 60_000, "Laid end to end, your blood vessels could circle Earth more than twice.", "The closer lands on a huge, memorable scale shift inside a familiar body.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.britannica] }),
  ]),
  "2026-04-24": pack("In the Orchestra Pit", "tactile", [
    question("How many keys are on a full-size piano?", 88, "A standard piano splits those into 52 white keys and 36 black keys.", "The opener is iconic and gives players a clean musical anchor.", { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.britannica] }),
    question("How many strings does a concert harp usually have?", 47, "Pedal harps change pitch with foot pedals instead of adding more strings.", "It keeps the theme musical while nudging into less common knowledge.", { answerType: "exact", difficultyScore: 3, scaleBand: "pocket", sources: [SOURCE_LIBRARY.britannica] }),
    question("About how many pounds can a concert grand piano weigh?", 1_200, "A concert grand feels graceful onstage, but it is really a thousand-plus-pound machine on casters.", "The closer widens the music set from instrument details to the physical heft of performance gear.", { difficultyScore: 4, scaleBand: "city", sources: [SOURCE_LIBRARY.britannica] }),
  ], question("About how many pipes can a large concert organ have?", 5_000, "Large organs become harder to picture once you stop thinking about keys and start thinking about thousands of tuned pipes.", "The bonus question makes the orchestra theme feel architectural instead of orchestral.", { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world", sources: [SOURCE_LIBRARY.britannica] })),
  "2026-04-25": pack("The Physics of Sports Balls", "tactile", [
    question("How many dimples are on a classic reference golf ball?", 336, "Manufacturers vary the pattern slightly, but 336 is a durable reference count.", "A recognizable sports-object number makes the set feel playful right away.", { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.usga] }),
    question("How many stitches are on a regulation baseball?", 108, "Those two curved seams are stitched with exactly 108 double stitches.", "Players usually know baseball has a seam, but not the count.", { answerType: "exact", difficultyScore: 3, scaleBand: "room", sources: [SOURCE_LIBRARY.mlb] }),
    question("About how many tennis balls can the U.S. Open use across one tournament?", 100_000, "A major tournament cycles through a startling number of fresh balls just to keep the bounce and wear consistent.", "The closer widens the sports-ball set from object scale to event scale.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.usOpen] }),
  ]),
  "2026-04-30": pack("Deep-Sea Giants", "tactile", [
    question("About how many teeth can a bottlenose dolphin have?", 100, "The exact count varies, but bottlenose dolphins really do carry a grin full of nearly triple-digit teeth.", "The opener starts with a vivid animal detail that still feels estimate-friendly.", { difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.britannica] }),
    question("About how many suckers can a giant Pacific octopus have?", 2_000, "Those suckers are not just grips; they are also sensitive chemical and touch sensors.", "The middle question keeps the octopus weirdness but turns it into real scale.", { difficultyScore: 3, scaleBand: "city", sources: [SOURCE_LIBRARY.britannica] }),
    question("About how many eggs can an ocean sunfish release in one spawning event?", 300_000_000, "Ocean sunfish lean on absurd egg counts because so few offspring survive to adulthood.", "The closer is a true jaw-dropper and one of the strongest large-number reveals in the library.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.britannica] }),
  ]),
  "2026-05-07": pack("Money Museum", "tactile", [
    question("About how many ridges are cut around the edge of a U.S. quarter?", 119, "The ridges were originally an anti-shaving feature, but now they mostly make coins easier to recognize by touch.", "The opener keeps money tactile instead of asking for a straight denomination conversion.", { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.usMint] }),
    question("How many notes sit in a fresh U.S. currency strap?", 100, "Bank straps turn loose bills into a brick you can picture in one hand.", "The middle question keeps the cash theme physical and operational.", { answerType: "exact", difficultyScore: 3, scaleBand: "city", sources: [SOURCE_LIBRARY.federalReserveCash] }),
    question("About how many coins can a modern U.S. Mint press strike in one hour?", 45_000, "A single press can turn blank metal into a blizzard of finished coins before lunch.", "The closer makes money feel industrial and physical instead of asking players to do a denomination conversion.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.usMint], answerNote: "Rounded from public mint-production descriptions of high-speed coin presses." }),
  ]),
  "2026-05-08": pack("Backyard Birds", "tactile", [
    question("About how many times per second can a hummingbird beat its wings?", 50, "The blur around a hummingbird is real motion, not just a trick of the eye.", "The opener is lively, visible, and far away from the repeated octopus prompt.", { difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.cornellBirds] }),
    question("About how many feathers does a small songbird carry?", 2_000, "A bird looks smooth because thousands of tiny overlapping feathers hide the seams.", "The middle question turns a familiar animal into a texture estimate.", { difficultyScore: 3, scaleBand: "city", sources: [SOURCE_LIBRARY.cornellBirds] }),
    question("About how many birds can migrate over the Gulf of Mexico on a busy spring night?", 30_000_000, "Migration can turn a dark sky into a moving river that radar sees better than people do.", "The closer opens the theme from one bird to a continental-scale event.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.cornellBirds] }),
  ], question("About how many birds can pass through the United States during a full spring migration season?", 3_000_000_000, "One busy night is only a slice of the full migration river moving overhead for weeks.", "The Friday bonus escalates from one peak night to the whole spring movement.", { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world", sources: [SOURCE_LIBRARY.cornellBirds] })),
  "2026-05-10": pack("Flower Shop", "tactile", [
    question("How many stems are in a florist's two-dozen rose bundle?", 24, "Florists still talk in dozens because bouquets are sold by visual fullness as much as by stem count.", "The opener gives Mother's Day weekend a familiar, giftable object.", { answerType: "exact", difficultyScore: 2, scaleBand: "room", sources: [SOURCE_LIBRARY.floristReview] }),
    question("About how many petals can you count across a dozen average roses?", 420, "Rose varieties swing a little, but a dozen blooms still add up to a surprising pile of petals.", "The middle question keeps the flower theme but zooms into the structure of the bouquet.", { difficultyScore: 3, scaleBand: "city", sources: [SOURCE_LIBRARY.usda] }),
    question("About how many square feet can a working commercial greenhouse cover?", 50_000, "Commercial houses that size feel less like backyard gardens and more like glass factories for living things.", "The closer widens the holiday from bouquet scale to the spaces that grow those flowers.", { difficultyScore: 4, scaleBand: "world", sources: [SOURCE_LIBRARY.usda] }),
  ]),
  "2026-05-25": holidayPack("Backyard Grill", "Memorial Day"),
  "2026-06-19": holidayPack("Block Party", "Juneteenth", true),
  "2026-06-21": holidayPack("Garage Weekend", "Father's Day"),
  "2026-07-04": holidayPack("Fireworks Night", "Independence Day"),
  "2026-09-07": holidayPack("Toolbox Day", "Labor Day"),
  "2026-10-31": holidayPack("Candy Bowl", "Halloween"),
  "2026-11-26": holidayPack("Thanksgiving Table", "Thanksgiving"),
  "2026-12-24": holidayPack("Stocking Stuffers", "Christmas Eve"),
  "2026-12-25": holidayPack("Under the Tree", "Christmas Day", true),
  "2026-12-31": holidayPack("Countdown Night", "New Year's Eve"),
};

export const AUTHORED_BALLPARK_CALENDAR = Object.freeze(buildAuthoredBallparkCalendar());

function getHolidayDetailByTheme(themeName) {
  return {
  "Backyard Grill": {
    playability: "tactile",
    questions: [
      ["About how many charcoal briquettes are in a typical 16-pound bag?", 160, "A charcoal bag feels heavy because each briquette is dense, not because there are thousands inside.", "Memorial Day starts with an object players can picture next to the grill.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "room" }],
      ["About how many square inches of cooking surface are on a roomy backyard gas grill?", 650, "Grill space sounds abstract until you imagine trying to fit burgers, corn, and foil packets at the same time.", "The middle question turns the cookout into a spatial estimate.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "city" }],
      ["About how many hot dogs can a busy neighborhood cookout serve across one long afternoon?", 1_800, "A grill station that feeds people in waves can run through a surprising number of buns before sunset.", "The closer opens the scene from one grill to the whole block.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "world" }],
    ],
  },
  "Block Party": {
    playability: "tactile",
    questions: [
      ["How many dominoes are in a double-six set?", 28, "The set feels larger than it is because every tile can sit in several table patterns.", "The Juneteenth opener uses a familiar table object.", { answerType: "exact", sources: [SOURCE_LIBRARY.britannica], scaleBand: "room" }],
      ["How many pips appear across that whole double-six domino set?", 168, "Once every dot on every tile is counted, the little case starts to feel unexpectedly dense.", "The middle question keeps the same object in view but changes what players are counting.", { answerType: "exact", sources: [SOURCE_LIBRARY.britannica], scaleBand: "city" }],
      ["About how many steps would you walk along a two-mile parade route?", 4_200, "A parade route sounds casual until it becomes thousands of steps on warm pavement.", "The closer opens the party from tabletop scale to street scale.", { sources: [SOURCE_LIBRARY.nps], scaleBand: "world" }],
    ],
    extraInning: ["Extra Innings at the Block Party: about how many red, white, and blue beads could fill a full craft-table bin?", 25_000, "A single bin of beads looks like color first and quantity second, which makes it a sneaky bonus estimate.", "The bonus keeps the block-party scene tactile while making the count larger than the parade-route closer.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "world" }],
  },
  "Garage Weekend": {
    playability: "tactile",
    questions: [
      ["About how many bristles are on a two-inch paintbrush?", 500, "A brush looks like one soft edge because hundreds of bristles move together.", "Father's Day starts with a hand-tool detail.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "room" }],
      ["About how many screws can fit in a five-pound workshop box?", 750, "A box that feels easy to carry can still hide hundreds of tiny parts.", "The middle question keeps the garage tactile and countable.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "city" }],
      ["About how many pounds can a common home garage floor jack lift?", 6_000, "A floor jack can look like one tool on the shelf while being built to lift vehicle-scale weight.", "The closer gives the garage day a machine-scale finish.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "world" }],
    ],
  },
  "Fireworks Night": {
    playability: "spectacle",
    questions: [
      ["About how many seconds does a hand sparkler usually burn?", 60, "A sparkler feels long in the hand because your brain notices every second of bright metal fizzing.", "The opener gives Independence Day a lived, tactile number.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "room" }],
      ["About how many feet can a consumer firework shell climb before it bursts?", 200, "A backyard shell only feels small until you picture two hundred feet of dark air underneath it.", "The middle question lifts the holiday above the block.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "city" }],
      ["About how many shells can a large public fireworks show launch in one night?", 5_000, "Big displays feel seamless because thousands of separate launches are choreographed into one sky show.", "The closer gives July 4 an event-scale finale.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "world" }],
    ],
  },
  "Toolbox Day": {
    playability: "tactile",
    questions: [
      ["About how many teeth are on a common 10-inch hand saw?", 80, "Saw teeth turn a plain strip of steel into a tool that bites one notch at a time.", "Labor Day starts with something visible on a working tool.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "room" }],
      ["About how many nails are in a five-pound box of common framing nails?", 430, "A box of nails feels modest until every small piece is counted.", "The middle question keeps the worksite physical.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "city" }],
      ["About how many pounds can a one-ton shop hoist lift?", 2_000, "The phrase one ton sounds industrial until players compare it with engines and small cars.", "The closer gives the holiday a machinery-scale finish.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "world" }],
    ],
  },
  "Candy Bowl": {
    playability: "tactile",
    questions: [
      ["How many pieces are in a standard fun-size variety bag of candy?", 30, "Those mixed bags feel bottomless mostly because the wrappers are loud and the pieces are small.", "Halloween starts at porch scale.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "room" }],
      ["About how many candy kernels are in a pound of candy corn?", 460, "Candy corn looks like a light snack until the little triangles start piling up.", "The middle question turns a bowl into a real estimate.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "city" }],
      ["About how many pumpkins can grow on one acre of pumpkin patch?", 3_000, "The patches people stroll through in October can carry thousands of pumpkins at once.", "The closer widens Halloween from the porch to the field.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "world" }],
    ],
  },
  "Thanksgiving Table": {
    playability: "tactile",
    questions: [
      ["About how many square inches of crust top a nine-inch pie?", 64, "A pie tin sounds small until the circle becomes actual surface area.", "Thanksgiving starts with a table object players can picture.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "room" }],
      ["About how many kernels are on an average ear of corn?", 800, "An ear looks tidy in your hand, but the rows hide hundreds of kernels.", "The middle question turns a side dish into a satisfying count.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "city" }],
      ["About how many cranberries are in a 12-ounce bag?", 1_200, "A bag of cranberries feels like one ingredient until every berry is suddenly part of the estimate.", "The closer keeps Thanksgiving tactile while widening the count.", { sources: [SOURCE_LIBRARY.usda], scaleBand: "world" }],
    ],
  },
  "Stocking Stuffers": {
    playability: "tactile",
    questions: [
      ["How many crayons are in a classic small Crayola tuck box?", 24, "That little box became iconic because twenty-four colors feels generous before it turns overwhelming.", "Christmas Eve starts with a gift-sized object.", { answerType: "exact", sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "room" }],
      ["How many pieces are in a standard jacks set, counting the ball?", 11, "The whole game fits in one palm, which is why it still feels like the definition of a stocking stuffer.", "The middle question stays small but asks for a count most players have never checked.", { answerType: "exact", sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "city" }],
      ["About how many square inches of wrapping paper are on a 30-inch by 20-foot roll?", 7_200, "One slim holiday roll hides a surprising sheet once the cylinder becomes flat paper.", "The closer turns tiny gifts into the full table of paper and tape.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "world" }],
    ],
  },
  "Under the Tree": {
    playability: "tactile",
    questions: [
      ["How many ornaments come in a standard six-box starter pack?", 36, "Starter sets feel full because the boxes are grouped by color, not because each box is huge.", "Christmas morning starts with a simple decoration count.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "room" }],
      ["About how many lights are on a 7.5-foot pre-lit tree?", 700, "Pre-lit trees feel magical largely because the bulb count is higher than most people would string by hand.", "The middle question turns one tree into a grid of small lights.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "city" }],
      ["About how many lights glow on the Rockefeller Center Christmas tree?", 50_000, "That famous tree reads as one warm shape on TV because the bulb count overwhelms individual counting.", "The closer jumps from living room scale to landmark scale.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "world" }],
    ],
    extraInning: ["Extra Innings under the tree: about how many needles can a seven-foot Christmas tree hold?", 200_000, "A tree looks like one green silhouette because the needle count is far beyond casual counting.", "The Christmas bonus keeps the object familiar while making the estimate much harder.", { sources: [SOURCE_LIBRARY.britannica], scaleBand: "world" }],
  },
  "Countdown Night": {
    playability: "spectacle",
    questions: [
      ["How many grapes are eaten in Spain's midnight countdown tradition?", 12, "Each grape matches one bell strike, turning the countdown into a tiny edible sprint.", "New Year's Eve starts concrete and playful.", { answerType: "exact", sources: [SOURCE_LIBRARY.britannica], scaleBand: "room" }],
      ["About how many pounds of confetti are dropped in Times Square on New Year's Eve?", 3_000, "The famous midnight cloud is measured in literal tons of paper drifting over the crowd.", "The middle question grows from table tradition to city spectacle.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "city" }],
      ["About how many LED lights glow on the Times Square New Year's Eve ball?", 32_256, "The ball looks like one bright jewel because tens of thousands of tiny lights blend together.", "The closer ends the year with a bigger, pictureable reveal.", { sources: [SOURCE_LIBRARY.smithsonian], scaleBand: "world", asOfDate: "2026-01-01" }],
    ],
  },
  }[themeName];
}

function holidayPack(themeName, holidayName, hasExtra = false) {
  const details = getHolidayDetailByTheme(themeName);
  const questions = details.questions.map(([prompt, answer, funFact, rationale, extra], index) =>
    question(prompt, answer, funFact, rationale, {
      answerType: extra.answerType ?? "estimate",
      difficultyScore: CORE_DIFFICULTY_SCORES[index],
      scaleBand: extra.scaleBand,
      sources: extra.sources,
      ...(extra.asOfDate ? { asOfDate: extra.asOfDate } : {}),
    })
  );
  const extraInning = hasExtra && details.extraInning
    ? question(...details.extraInning.slice(0, 4), {
        ...details.extraInning[4],
        difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE,
      })
    : null;

  return pack(themeName, details.playability, questions, extraInning);
}

function countInclusiveDays(startKey, endKey) {
  const startDate = parseDateKey(startKey);
  const endDate = parseDateKey(endKey);
  return Math.round((endDate - startDate) / DAY_MS) + 1;
}

function buildCalendarDateKeys(startKey, endKey) {
  const totalDays = countInclusiveDays(startKey, endKey);
  return Array.from({ length: totalDays }, (_, index) => shiftDateKey(startKey, index));
}

function isFridayDateKey(dateKey) {
  return parseDateKey(dateKey).getDay() === 5;
}

function isDateKeyInCalendar(dateKey) {
  return dateKey >= CYCLE_START_KEY && dateKey <= CALENDAR_END_KEY;
}

function parseDateKey(dateKey) {
  return new Date(`${dateKey}T12:00:00`);
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePrompt(prompt) {
  return prompt.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function roundTo(value, increment = 1) {
  return Math.max(increment, Math.round(value / increment) * increment);
}

function getScaleBandRank(scaleBand) {
  return SCALE_BAND_RANK[scaleBand] ?? -1;
}

function fnv1aHash(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function isVolatileQuestion(questionLike) {
  const combined = `${questionLike.prompt ?? ""} ${questionLike.funFact ?? ""}`;
  return VOLATILE_PATTERN.test(combined);
}

function materializeQuestion(questionEntry, id, defaultDifficultyScore) {
  return {
    id,
    prompt: questionEntry.prompt,
    answer: questionEntry.answer,
    funFact: questionEntry.funFact,
    rationale: questionEntry.rationale,
    difficultyScore: questionEntry.difficultyScore ?? defaultDifficultyScore,
    scaleBand: questionEntry.scaleBand ?? "room",
    answerType: questionEntry.answerType ?? "estimate",
    sources: clone(questionEntry.sources ?? [SOURCE_LIBRARY.editorialModel]),
    ...(questionEntry.answerNote ? { answerNote: questionEntry.answerNote } : {}),
    ...(questionEntry.asOfDate ? { asOfDate: questionEntry.asOfDate } : {}),
  };
}

function createContentFingerprint(themeName, questions, extraInning = null) {
  const serializeQuestion = (questionEntry) => ({
    prompt: questionEntry.prompt,
    answer: questionEntry.answer,
    funFact: questionEntry.funFact,
    rationale: questionEntry.rationale,
    difficultyScore: questionEntry.difficultyScore,
    scaleBand: questionEntry.scaleBand,
    answerType: questionEntry.answerType,
    answerNote: questionEntry.answerNote ?? null,
    sources: questionEntry.sources,
    asOfDate: questionEntry.asOfDate ?? null,
  });
  const fingerprintPayload = JSON.stringify({
    theme: themeName,
    questions: questions.map(serializeQuestion),
    extraInning: extraInning ? serializeQuestion(extraInning) : null,
  });
  return `daybreak-${fnv1aHash(fingerprintPayload)}`;
}

function createDailySet(entry, dateKey, metadata = {}) {
  const questions = entry.questions.map((questionEntry, index) =>
    materializeQuestion(
      questionEntry,
      `${slugify(entry.theme)}-${index + 1}`,
      CORE_DIFFICULTY_SCORES[index] ?? CORE_DIFFICULTY_SCORES[CORE_DIFFICULTY_SCORES.length - 1]
    )
  );
  const extraInning = isFridayDateKey(dateKey) ? entry.extraInning ?? null : null;
  return {
    date: dateKey,
    theme: entry.theme,
    source: metadata.source ?? "authored",
    ...(metadata.fallbackReason ? { fallbackReason: metadata.fallbackReason } : {}),
    questions,
    ...(extraInning
      ? {
          extraInning: materializeQuestion(
            extraInning,
            `${slugify(entry.theme)}-extra`,
            EXTRA_INNING_DIFFICULTY_SCORE
          ),
        }
      : {}),
  };
}

function validateSource(sourceEntry, label) {
  if (!sourceEntry || typeof sourceEntry !== "object") {
    throw new Error(`${label} needs source metadata.`);
  }
  if (typeof sourceEntry.title !== "string" || sourceEntry.title.trim().length < 3) {
    throw new Error(`${label} source needs a title.`);
  }
  if (typeof sourceEntry.url !== "string" || !/^https?:\/\//.test(sourceEntry.url)) {
    throw new Error(`${label} source needs an http(s) url.`);
  }
  if (typeof sourceEntry.accessedDate !== "string" || Number.isNaN(parseDateKey(sourceEntry.accessedDate).getTime())) {
    throw new Error(`${label} source needs a valid accessedDate.`);
  }
}

function validateQuestion(questionEntry, index, seenPrompts, label = `Question ${index + 1}`) {
  if (!questionEntry || typeof questionEntry !== "object") {
    throw new Error(`${label} is missing.`);
  }
  if (typeof questionEntry.prompt !== "string" || questionEntry.prompt.trim().length < 8) {
    throw new Error(`${label} needs a prompt.`);
  }
  if (!Number.isFinite(questionEntry.answer) || questionEntry.answer <= 0) {
    throw new Error(`${label} needs a positive numeric answer.`);
  }
  if (typeof questionEntry.funFact !== "string" || questionEntry.funFact.trim().length < 8) {
    throw new Error(`${label} needs a fun fact.`);
  }
  if (typeof questionEntry.rationale !== "string" || questionEntry.rationale.trim().length < 8) {
    throw new Error(`${label} needs a rationale.`);
  }
  if (
    !Number.isFinite(questionEntry.difficultyScore) ||
    questionEntry.difficultyScore < 1 ||
    questionEntry.difficultyScore > 5
  ) {
    throw new Error(`${label} needs a difficultyScore from 1 to 5.`);
  }
  if (!SCALE_BAND_RANK.hasOwnProperty(questionEntry.scaleBand)) {
    throw new Error(`${label} needs a valid scaleBand.`);
  }
  if (!VALID_ANSWER_TYPES.has(questionEntry.answerType)) {
    throw new Error(`${label} needs a valid answerType.`);
  }
  if (!Array.isArray(questionEntry.sources) || questionEntry.sources.length === 0) {
    throw new Error(`${label} needs at least one source.`);
  }
  questionEntry.sources.forEach((sourceEntry, sourceIndex) => validateSource(sourceEntry, `${label} source ${sourceIndex + 1}`));

  const normalizedPrompt = normalizePrompt(questionEntry.prompt);
  if (seenPrompts.has(normalizedPrompt)) {
    throw new Error(`${label} duplicates another prompt in the same daily set.`);
  }
  seenPrompts.add(normalizedPrompt);

  if (isVolatileQuestion(questionEntry) && !questionEntry.asOfDate) {
    throw new Error(`${label} references a volatile fact and must include asOfDate.`);
  }
  if (questionEntry.asOfDate && Number.isNaN(parseDateKey(questionEntry.asOfDate).getTime())) {
    throw new Error(`${label} has an invalid asOfDate.`);
  }
  return {
    id: typeof questionEntry.id === "string" && questionEntry.id ? questionEntry.id : undefined,
    prompt: questionEntry.prompt.trim(),
    answer: Math.round(questionEntry.answer),
    funFact: questionEntry.funFact.trim(),
    rationale: questionEntry.rationale.trim(),
    difficultyScore: Math.round(questionEntry.difficultyScore),
    scaleBand: questionEntry.scaleBand,
    answerType: questionEntry.answerType,
    sources: clone(questionEntry.sources),
    ...(questionEntry.answerNote ? { answerNote: questionEntry.answerNote.trim() } : {}),
    ...(questionEntry.asOfDate ? { asOfDate: questionEntry.asOfDate } : {}),
  };
}

function createResolvedDailySetMetadata(validatedDailySet, metadata = {}) {
  return {
    ...validatedDailySet,
    contentFingerprint: createContentFingerprint(
      validatedDailySet.theme,
      validatedDailySet.questions,
      validatedDailySet.extraInning ?? null
    ),
    source: metadata.source ?? "authored",
    ...(metadata.fallbackReason ? { fallbackReason: metadata.fallbackReason } : {}),
  };
}

function validateCoreArc(questions) {
  const scaleBands = new Set(questions.map((questionEntry) => questionEntry.scaleBand));
  if (scaleBands.size < 2) {
    throw new Error("Core questions must span at least 2 scale bands.");
  }
  const firstScaleRank = getScaleBandRank(questions[0].scaleBand);
  if (!questions.slice(1).some((questionEntry) => getScaleBandRank(questionEntry.scaleBand) > firstScaleRank)) {
    throw new Error("At least one later question must widen the scale from Question 1.");
  }
  const [firstQuestion, secondQuestion, thirdQuestion] = questions;
  if (
    secondQuestion.difficultyScore < firstQuestion.difficultyScore ||
    thirdQuestion.difficultyScore < secondQuestion.difficultyScore ||
    thirdQuestion.difficultyScore <= firstQuestion.difficultyScore
  ) {
    throw new Error("Core questions must generally step upward in difficultyScore.");
  }
}

export function validateDailySet(rawDailySet, dateKey = rawDailySet?.date ?? CYCLE_START_KEY, metadata = {}) {
  if (!rawDailySet || typeof rawDailySet !== "object") {
    throw new Error("Daily set payload is missing.");
  }
  if (typeof rawDailySet.theme !== "string" || rawDailySet.theme.trim().length < 3) {
    throw new Error("Daily set theme is missing.");
  }
  if (!Array.isArray(rawDailySet.questions) || rawDailySet.questions.length !== CORE_QUESTION_COUNT) {
    throw new Error(`Daily set must contain exactly ${CORE_QUESTION_COUNT} questions.`);
  }

  const seenPrompts = new Set();
  const validatedQuestions = rawDailySet.questions.map((questionEntry, index) =>
    validateQuestion(questionEntry, index, seenPrompts)
  );
  const validatedExtraInning = rawDailySet.extraInning
    ? validateQuestion(rawDailySet.extraInning, CORE_QUESTION_COUNT, seenPrompts, "Extra Inning")
    : null;

  const isFallbackSource = metadata.source === "fallback";
  if (!isFallbackSource) {
    validateCoreArc(validatedQuestions);
    if (isFridayDateKey(dateKey) && !validatedExtraInning) {
      throw new Error("Friday daily sets must include an Extra Inning question.");
    }
    if (!isFridayDateKey(dateKey) && validatedExtraInning) {
      throw new Error("Extra Inning questions are only allowed on Fridays.");
    }
    if (validatedExtraInning) {
      const hardestCoreDifficulty = Math.max(...validatedQuestions.map((questionEntry) => questionEntry.difficultyScore));
      if (validatedExtraInning.difficultyScore < 4) {
        throw new Error("Extra Inning must have a difficultyScore of 4 or 5.");
      }
      if (validatedExtraInning.difficultyScore < hardestCoreDifficulty) {
        throw new Error("Extra Inning must be the hardest question of the day.");
      }
    }
  }

  return createResolvedDailySetMetadata(
    {
      date: dateKey,
      theme: rawDailySet.theme.trim(),
      questions: validatedQuestions,
      ...(validatedExtraInning ? { extraInning: validatedExtraInning } : {}),
    },
    metadata
  );
}

function validateAuthoredEntry(entry, dateKey) {
  return validateDailySet(createDailySet(entry, dateKey, { source: "authored" }), dateKey, {
    source: "authored",
  });
}

function getAuthoredDateKeys(startDateKey, daysToCheck) {
  const startIndex = CALENDAR_DATE_KEYS.indexOf(startDateKey);
  if (startIndex === -1) return [];
  return CALENDAR_DATE_KEYS.slice(startIndex, startIndex + daysToCheck);
}

function isPictureableQuestion(questionEntry) {
  return !/\b(bits are in|seconds are in|minutes are in|hours are in|time zones|dictionary entries)\b/i.test(questionEntry.prompt);
}

function questionSignature(questionEntry) {
  return `${normalizePrompt(questionEntry.prompt)}::${questionEntry.answer}`;
}

function auditDailySetHeuristics(dailySet) {
  const answers = dailySet.questions.map((questionEntry) => questionEntry.answer);
  const scaleBands = dailySet.questions.map((questionEntry) => questionEntry.scaleBand);
  const warnings = [];
  const tinyAnswerCount = answers.filter((answer) => answer <= 15).length;
  const magnitudeSpread = Math.max(...answers) / Math.min(...answers);
  const firstScaleRank = getScaleBandRank(scaleBands[0]);
  const pictureableQuestionCount = dailySet.questions.filter(isPictureableQuestion).length;

  if (tinyAnswerCount > 1) {
    warnings.push("Contains more than one tiny-count answer, which can make the set feel recall-first.");
  }
  if (pictureableQuestionCount < 2) {
    warnings.push("Needs at least two questions players can physically picture.");
  }
  if (new Set(scaleBands).size === 1 || magnitudeSpread < 4) {
    warnings.push("Stays too compressed in one scale band, so the set can feel flat.");
  }
  if (!dailySet.questions.slice(1).some((questionEntry) => getScaleBandRank(questionEntry.scaleBand) > firstScaleRank)) {
    warnings.push("Never widens beyond the opener's scale, which blunts the day-to-day Ballpark arc.");
  }
  if (dailySet.questions[2].difficultyScore < dailySet.questions[1].difficultyScore) {
    warnings.push("The closer grades easier than the middle question, which softens the finish.");
  }
  if (dailySet.questions[2].answer <= dailySet.questions[1].answer) {
    warnings.push("The closer answer is not larger than the middle answer, weakening the reveal.");
  }
  if (dailySet.extraInning && dailySet.extraInning.answer <= dailySet.questions[2].answer) {
    warnings.push("The Extra Inning answer is not larger than the core closer, weakening the bonus arc.");
  }
  dailySet.questions.forEach((questionEntry, index) => {
    if (CONVERSION_TAUTOLOGY_PATTERN.test(questionEntry.prompt)) {
      warnings.push(`Question ${index + 1} reads like a direct conversion instead of an estimation prompt.`);
    }
    if (/^(At the|Picture the|In one|Around the) .+: about how many /i.test(questionEntry.prompt)) {
      warnings.push(`Question ${index + 1} uses an obvious generated prompt scaffold.`);
    }
    const hasOnlyEditorialSource =
      questionEntry.sources.length === 1 &&
      questionEntry.sources[0].title === SOURCE_LIBRARY.editorialModel.title;
    if (hasOnlyEditorialSource) {
      warnings.push(`Question ${index + 1} is sourced only to the internal editorial model.`);
    }
  });
  if (dailySet.extraInning) {
    const hasOnlyEditorialSource =
      dailySet.extraInning.sources.length === 1 &&
      dailySet.extraInning.sources[0].title === SOURCE_LIBRARY.editorialModel.title;
    if (hasOnlyEditorialSource) {
      warnings.push("Extra Inning is sourced only to the internal editorial model.");
    }
    if (/could stack up across four packed seasons/i.test(dailySet.extraInning.prompt)) {
      warnings.push("Extra Inning uses the old generated bonus scaffold.");
    }
  }
  return warnings;
}

function auditGlobalCalendarQuality(authoredSets) {
  const failures = [];
  const warnings = [];
  const themeDates = new Map();
  const promptDates = new Map();
  const signatureDates = new Map();
  let questionCount = 0;

  authoredSets.forEach((dailySet) => {
    themeDates.set(dailySet.theme, [...(themeDates.get(dailySet.theme) ?? []), dailySet.date]);
    const allQuestions = [...dailySet.questions, ...(dailySet.extraInning ? [dailySet.extraInning] : [])];
    questionCount += allQuestions.length;
    allQuestions.forEach((questionEntry) => {
      const normalizedPrompt = normalizePrompt(questionEntry.prompt);
      promptDates.set(normalizedPrompt, [...(promptDates.get(normalizedPrompt) ?? []), `${dailySet.date} (${dailySet.theme})`]);
      const signature = questionSignature(questionEntry);
      signatureDates.set(signature, [...(signatureDates.get(signature) ?? []), `${dailySet.date} (${dailySet.theme})`]);
      if (!Array.isArray(questionEntry.sources) || questionEntry.sources.length === 0) {
        failures.push(`${dailySet.date}: ${questionEntry.prompt} is missing sources.`);
      }
    });
  });

  if (questionCount !== 795) {
    failures.push(`Expected 795 authored questions including Extra Innings, found ${questionCount}.`);
  }

  themeDates.forEach((dates, themeName) => {
    if (dates.length > 1) {
      failures.push(`Theme "${themeName}" repeats on ${dates.join(", ")}.`);
    }
  });
  promptDates.forEach((dates) => {
    if (dates.length > 1) {
      failures.push(`Prompt repeats on ${dates.join(", ")}.`);
    }
  });
  signatureDates.forEach((dates) => {
    if (dates.length > 1) {
      warnings.push(`Near-duplicate prompt/answer signature on ${dates.join(", ")}.`);
    }
  });

  return { failures, warnings };
}

export function validateAuthoredLibrary(startDateKey = CYCLE_START_KEY, daysToCheck = DAYBREAK_CYCLE_LENGTH) {
  const failures = [];
  const warnings = [];
  const uniqueThemes = new Set();
  const authoredSets = [];
  const authoredDateKeys = getAuthoredDateKeys(startDateKey, daysToCheck);

  if (authoredDateKeys.length === 0) {
    failures.push(`No authored Ballpark dates found for ${startDateKey}.`);
  }

  authoredDateKeys.forEach((dateKey) => {
    const scheduledEntry = AUTHORED_BALLPARK_CALENDAR[dateKey];
    if (!scheduledEntry) {
      failures.push(`${dateKey}: missing authored theme assignment.`);
      return;
    }
    if (!VALID_PLAYABILITY_CLASSES.has(scheduledEntry.playability)) {
      failures.push(`${dateKey}: ${scheduledEntry.theme} is missing a valid playability classification.`);
      return;
    }
    try {
      const authoredSet = validateAuthoredEntry(scheduledEntry, dateKey);
      authoredSets.push(authoredSet);
      uniqueThemes.add(authoredSet.theme);
      auditDailySetHeuristics(authoredSet).forEach((warning) => {
        warnings.push(`${dateKey} (${authoredSet.theme}): ${warning}`);
      });
    } catch (error) {
      failures.push(`${dateKey}: ${error.message}`);
    }
  });

  const globalAudit = auditGlobalCalendarQuality(authoredSets);
  failures.push(...globalAudit.failures);
  warnings.push(...globalAudit.warnings);

  return {
    passed: failures.length === 0 && warnings.length === 0,
    daysChecked: authoredDateKeys.length,
    authoredSets,
    authoredSetMap: new Map(authoredSets.map((dailySet) => [dailySet.date, dailySet])),
    failures,
    warnings,
    uniqueThemes: uniqueThemes.size,
    questionsChecked: authoredSets.reduce(
      (sum, dailySet) => sum + dailySet.questions.length + (dailySet.extraInning ? 1 : 0),
      0
    ),
  };
}

export async function runAuthoredContentValidationSuite(startDateKey = CYCLE_START_KEY, daysToCheck = DAYBREAK_CYCLE_LENGTH) {
  const authoredSummary = validateAuthoredLibrary(startDateKey, daysToCheck);
  const failures = [...authoredSummary.failures];
  const warnings = [...authoredSummary.warnings];

  for (const authoredSet of authoredSummary.authoredSets) {
    try {
      const resolvedSet = await getDailySet(authoredSet.date);
      if (resolvedSet.source !== "authored") {
        failures.push(`${authoredSet.date}: runtime resolution used fallback content (${resolvedSet.fallbackReason ?? "unknown reason"}).`);
      }
      if (resolvedSet.contentFingerprint !== authoredSet.contentFingerprint) {
        failures.push(`${authoredSet.date}: runtime fingerprint does not match the authored library.`);
      }
    } catch (error) {
      failures.push(`${authoredSet.date}: runtime resolution failed with ${error.message}`);
    }
  }

  return {
    passed: failures.length === 0 && warnings.length === 0,
    daysChecked: authoredSummary.daysChecked,
    authoredSets: authoredSummary.authoredSets.length,
    uniqueThemes: authoredSummary.uniqueThemes,
    questionsChecked: authoredSummary.questionsChecked,
    failures,
    warnings,
  };
}

export function runBallparkContentAudit(startDateKey = CYCLE_START_KEY, daysToCheck = DAYBREAK_CYCLE_LENGTH) {
  return validateAuthoredLibrary(startDateKey, daysToCheck);
}

export function validateWeatherSignsAuthoredDay() {
  const weatherDateKey = CALENDAR_DATE_KEYS.find((dateKey) => AUTHORED_BALLPARK_CALENDAR[dateKey]?.theme.includes("Weather"));
  if (!weatherDateKey) {
    throw new Error("Weather Signs is missing from the authored calendar.");
  }
  return validateAuthoredEntry(AUTHORED_BALLPARK_CALENDAR[weatherDateKey], weatherDateKey);
}

async function requestDailySetFromProvider(dateKey) {
  if (!isDateKeyInCalendar(dateKey)) {
    throw new Error(`No authored Ballpark set scheduled for ${dateKey}.`);
  }
  const entry = AUTHORED_BALLPARK_CALENDAR[dateKey];
  if (!entry) {
    throw new Error(`No Ballpark theme found for ${dateKey}.`);
  }
  return clone(createDailySet(entry, dateKey, { source: "authored" }));
}

function buildFallbackDailySet(dateKey, fallbackReason) {
  return createDailySet(FALLBACK_ENTRY, dateKey, {
    source: "fallback",
    fallbackReason,
  });
}

export function getTodayKey(date = new Date()) {
  return formatDateKey(date);
}

export function shiftDateKey(dateKey, offset) {
  const nextDate = parseDateKey(dateKey);
  nextDate.setDate(nextDate.getDate() + offset);
  return formatDateKey(nextDate);
}

export function formatDisplayDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(parseDateKey(dateKey));
}

export function getCycleDay(dateKey) {
  if (!isDateKeyInCalendar(dateKey)) return 1;
  return Math.round((parseDateKey(dateKey) - parseDateKey(CYCLE_START_KEY)) / DAY_MS) + 1;
}

export function getThemePreview(dateKey) {
  return AUTHORED_BALLPARK_CALENDAR[dateKey]?.theme ?? FALLBACK_ENTRY.theme;
}

export function getThemePlayabilityForDate(dateKey) {
  return AUTHORED_BALLPARK_CALENDAR[dateKey]?.playability ?? "tactile";
}

export async function getDailySet(dateKey = getTodayKey(), options = {}) {
  const provider = options.provider ?? requestDailySetFromProvider;
  try {
    const rawDailySet = await provider(dateKey);
    return validateDailySet(rawDailySet, dateKey, { source: "authored" });
  } catch (error) {
    return validateDailySet(
      buildFallbackDailySet(dateKey, error instanceof Error ? error.message : String(error)),
      dateKey,
      {
        source: "fallback",
        fallbackReason: error instanceof Error ? error.message : String(error),
      }
    );
  }
}

export async function runContentValidationSuite(startDateKey = CYCLE_START_KEY, daysToCheck = DAYBREAK_CYCLE_LENGTH) {
  return runAuthoredContentValidationSuite(startDateKey, daysToCheck);
}
