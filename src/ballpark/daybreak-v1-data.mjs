export const CYCLE_START_KEY = "2026-04-23";
export const DAYBREAK_CYCLE_LENGTH = 30;
export const MAX_GUESSES = 4;
export const WIN_THRESHOLD = 0.1;
export const DIFFICULTY_ORDER = ["warmup", "stretch", "closer"];

export const DIFFICULTY_META = {
  warmup: {
    label: "Warm-up",
    blurb: "Start with a foothold you can reason from.",
  },
  stretch: {
    label: "Stretch",
    blurb: "Push beyond the obvious and calibrate fast.",
  },
  closer: {
    label: "Final",
    blurb: "Finish on the question people will talk about later.",
  },
};

const DAY_MS = 24 * 60 * 60 * 1000;
const VOLATILE_PATTERN =
  /\b(today|current|currently|as of|this year|this month|this week|per day|daily|updated|latest|active users|population)\b/i;

function question(prompt, answer, funFact, rationale, extra = {}) {
  return { prompt, answer, funFact, rationale, ...extra };
}

function theme(themeName, questions) {
  return { theme: themeName, questions };
}

const DAILY_THEME_LIBRARY = [
  theme("Inside the Human Body", [
    question(
      "How many bones are in the adult human body?",
      206,
      "Babies start with about 270 bones, and many fuse together as they grow.",
      "A familiar anatomy number eases players into the daily set."
    ),
    question(
      "How many teeth does a typical adult have, including wisdom teeth?",
      32,
      "Those four wisdom teeth are the final pieces in a full adult set.",
      "It stays grounded in the same theme while getting slightly more specific."
    ),
    question(
      "Roughly how many miles of blood vessels are packed into the human body?",
      60_000,
      "Laid end to end, your blood vessels could circle Earth more than twice.",
      "The closer lands on a huge, memorable scale shift inside a familiar body."
    ),
  ]),
  theme("In the Orchestra Pit", [
    question(
      "How many keys are on a full-size piano?",
      88,
      "A standard piano splits those into 52 white keys and 36 black keys.",
      "The opener is iconic and gives players a clean musical anchor."
    ),
    question(
      "How many strings does a concert harp usually have?",
      47,
      "Pedal harps change pitch with foot pedals instead of adding more strings.",
      "It keeps the theme musical while nudging into less common knowledge."
    ),
    question(
      "About how many strings are stretched inside a piano?",
      230,
      "Most piano notes use two or three strings, which is why the total outruns the key count.",
      "The final question turns a familiar instrument into a surprising engineering object."
    ),
  ]),
  theme("Calendar Math", [
    question(
      "How many minutes are in a day?",
      1_440,
      "That clean 24 x 60 calculation is why this makes a strong warm-up.",
      "The first question rewards quick mental math and gets fingers moving."
    ),
    question(
      "How many seconds are in a week?",
      604_800,
      "A single missed second every day adds up to 52 seconds by year-end.",
      "The middle round expands the same timekeeping logic by a full order of magnitude."
    ),
    question(
      "How many seconds are in a 365-day year?",
      31_536_000,
      "That huge total is what makes even tiny timing drifts matter in clocks, software, and astronomy.",
      "The closer keeps the same mental-math theme but lands on a much bigger final reveal."
    ),
  ]),
  theme("The Secret Life of Bees", [
    question(
      "About how many worker bees can live in a strong summer hive?",
      50_000,
      "A winter colony is much smaller because it is surviving, not peak-producing.",
      "The opener gives a concrete colony scale for the rest of the set."
    ),
    question(
      "Roughly how many flowers do bees visit to make one pound of honey?",
      2_000_000,
      "That one-pound jar is the result of millions of tiny visits stitched together.",
      "The middle question widens the player from hive scale to ecosystem scale."
    ),
    question(
      "About how many miles do bees collectively fly to make one pound of honey?",
      55_000,
      "That is more than twice around Earth for a single pound of honey.",
      "The closer delivers the biggest surprise and the best post-round conversation hook."
    ),
  ]),
  theme("The Physics of Sports Balls", [
    question(
      "How many dimples are on a standard golf ball?",
      336,
      "Manufacturers vary the pattern slightly, but 336 is a classic reference count.",
      "A recognizable sports-object number makes the set feel playful right away."
    ),
    question(
      "How many stitches are on a regulation baseball?",
      108,
      "Those two curved seams are stitched with exactly 108 double stitches.",
      "Players usually know baseball has a seam, but not the count."
    ),
    question(
      "How many panels are on the classic black-and-white soccer ball design?",
      32,
      "The famous pattern combines 12 pentagons with 20 hexagons.",
      "The closer rewards people who notice design, not just sport."
    ),
  ]),
  theme("Card Table Numbers", [
    question(
      "How many cards are in a standard deck without jokers?",
      52,
      "Add the jokers back in and many kitchen-table decks jump to 54 cards.",
      "It is instantly legible and establishes the game-night tone."
    ),
    question(
      "How many distinct two-card starting hands exist in Texas Hold'em?",
      1_326,
      "Players talk about pocket pairs and suited connectors, but under the hood the opening hand space is much bigger than it feels.",
      "The stretch turns familiar cards into a true combinatorics estimate."
    ),
    question(
      "How many different five-card poker hands are possible from one deck?",
      2_598_960,
      "That enormous count is why poker can keep producing new situations even with the same 52 cards.",
      "The closer makes the card table feel combinatorially huge."
    ),
  ]),
  theme("Touring the Solar System", [
    question(
      "About how many seconds does sunlight take to reach Earth?",
      500,
      "The more familiar version is a little over 8 minutes, but the seconds view makes the distance feel sharper.",
      "The opener keeps the classic space fact but turns it into a more estimable number."
    ),
    question(
      "About how many miles away is the Moon from Earth on average?",
      239_000,
      "That distance is close enough to matter culturally and far enough to still feel impossible.",
      "The stretch moves from light travel to a physical space distance most players only half-remember."
    ),
    question(
      "About how many Earths could fit inside Jupiter by volume?",
      1_300,
      "Jupiter is so large that even its storms dwarf whole planets.",
      "The closer gives the set its true sense of cosmic scale."
    ),
  ]),
  theme("Iconic Landmarks", [
    question(
      "How many floors are in the Empire State Building?",
      102,
      "Its observatories helped turn skyscrapers into public attractions, not just offices.",
      "The opener starts with a landmark many players can picture clearly."
    ),
    question(
      "How many steps climb from the base to the crown of the Statue of Liberty?",
      354,
      "The crown windows were designed to echo a radiant halo around Liberty's head.",
      "The middle question asks players to reason about a physical journey."
    ),
    question(
      "Roughly how many stone blocks make up the Great Pyramid of Giza?",
      2_300_000,
      "Its core mass is so enormous that each block feels small only in comparison.",
      "The closer moves from visible landmark to almost unimaginable construction scale."
    ),
  ]),
  theme("Grid Logic", [
    question(
      "How many squares are on a chessboard?",
      64,
      "That count includes only the visible 8 by 8 board, not the hidden geometry players sometimes notice.",
      "It is a recognizable starting point for a logic-flavored day."
    ),
    question(
      "How many total squares of all sizes are hidden inside a chessboard?",
      204,
      "Once you count every 2x2, 3x3, and larger square, the board turns into a counting puzzle instead of a simple grid.",
      "The stretch deepens the logic theme without collapsing back into memorized chess trivia."
    ),
    question(
      "How many total rectangles of all sizes are hidden inside an 8 by 8 grid?",
      1_296,
      "Rectangles outrun squares quickly because every pair of horizontal and vertical lines can frame a new shape.",
      "The closer gives the day a stronger combinatorics payoff."
    ),
  ]),
  theme("Map Scale", [
    question(
      "How many time zones wrap around the planet?",
      24,
      "Time zones are a human grid laid over a spinning sphere, not a natural property of Earth.",
      "The opener starts with a round geography number most players can reason toward."
    ),
    question(
      "About how many miles around is Earth at the equator?",
      24_901,
      "People often remember the twenty-five-thousand-mile version because it is close enough to the truth to stick.",
      "The stretch turns globe intuition into real planetary scale."
    ),
    question(
      "About how many miles long is the Amazon River?",
      4_000,
      "Its exact ranking versus the Nile is debated, but its sheer length is not.",
      "The closer lands on a river number that feels huge but still guessable."
    ),
  ]),
  theme("Shelf Life", [
    question(
      "About how many pages are in a typical trade paperback novel?",
      320,
      "Trim size and font move the number around, but a low-three-hundreds estimate is a sturdy shelf benchmark.",
      "The opener turns book intuition into a physical scale guess."
    ),
    question(
      "How many chapters are in Moby-Dick?",
      135,
      "Melville packed the novel with chapters that swing from stage scenes to essay detours.",
      "The stretch keeps the theme literary while staying countable."
    ),
    question(
      "About how many words are in War and Peace?",
      587_000,
      "That giant word count is why the novel can feel like a whole social world instead of a single plotline.",
      "The closer lands on a genuinely epic reading scale."
    ),
  ]),
  theme("Bike Shop", [
    question(
      "About how many spokes does a full bicycle usually have across both wheels?",
      64,
      "A standard bike often uses 32 spokes per wheel, which is why the full-bike count lands neatly in the sixties.",
      "The opener keeps the bike feel but pushes the answer out of raw recall territory."
    ),
    question(
      "How many links are in a standard new bicycle chain?",
      116,
      "Mechanics usually shorten a new chain to match the frame and cassette setup.",
      "The stretch keeps the object-level intuition while making the numbers feel less classroom-exact."
    ),
    question(
      "About how many bicycles are estimated to exist worldwide?",
      1_000_000_000,
      "Bikes are one of the most common machines on Earth, which makes their global footprint much bigger than most riders picture.",
      "The closer blows the theme open from workshop scale to planet scale."
    ),
  ]),
  theme("Pantry Math", [
    question(
      "How many teaspoons are in a cup?",
      48,
      "Kitchen conversions get sticky fast, which is why good bakers memorize a few anchor numbers.",
      "The opener gives the day an instantly usable feel."
    ),
    question(
      "How many teaspoons are in a gallon?",
      768,
      "A gallon sounds manageable until you convert it down to the spoon level.",
      "The stretch keeps the theme in measurement mode but raises the scale dramatically."
    ),
    question(
      "About how many grains of uncooked rice are in one cup?",
      7_500,
      "A single cup of rice hides thousands of grains, which is why portions swell so fast once cooked.",
      "The closer turns a pantry staple into a genuine estimation reveal."
    ),
  ]),
  theme("Weather Signs", [
    question(
      "About how many miles wide can a large hurricane grow?",
      300,
      "Storms that wide can sit over multiple states or island chains at once.",
      "The opener starts with physical storm scale instead of a simple category count."
    ),
    question(
      "How many points does a typical snowflake have?",
      6,
      "That symmetry comes from the hexagonal way water molecules lock together as ice.",
      "The stretch turns a visual fact into a counting puzzle."
    ),
    question(
      "About how many lightning flashes strike Earth in a year?",
      3_100_000_000,
      "The planet-wide pace is roughly one hundred flashes a second, which compounds into a staggering annual total.",
      "The closer gives the weather theme a true world-scale finish without relying on volatile wording."
    ),
  ]),
  theme("Digital Basics", [
    question(
      "How many bits are in one byte?",
      8,
      "That tiny unit still anchors how we casually talk about computer memory and storage.",
      "The opener gives technical players a comfortable foothold."
    ),
    question(
      "How many keys are on a full-size keyboard with a number pad?",
      104,
      "Laptop keyboards hide the count, but the desk standard still follows the full-size layout.",
      "The stretch keeps the theme tactile and familiar."
    ),
    question(
      "How many pixels are in a 1920 by 1080 image?",
      2_073_600,
      "That is why '1080p' sounds compact even though it still means more than two million dots.",
      "The closer makes a digital spec feel newly large."
    ),
  ]),
  theme("Word Count", [
    question(
      "About how many words are on a typical paperback novel page?",
      300,
      "Formatting changes the count, but three hundred words per page is a sturdy mental benchmark.",
      "The opener gives players a book-sized number they can reason from."
    ),
    question(
      "About how many words are in a typical adult novel?",
      90_000,
      "Many commercial novels land between 70,000 and 100,000 words depending on genre.",
      "The stretch scales the same reading intuition up by two big orders of magnitude."
    ),
    question(
      "As of 2026, about how many entries are in the Oxford English Dictionary?",
      500_000,
      "The dictionary keeps growing as English keeps borrowing, inventing, and repurposing words.",
      "The closer turns everyday reading into the scale of a living language archive.",
      { asOfDate: "2026-01-01" }
    ),
  ]),
  theme("Moon Facts", [
    question(
      "How many pounds of Moon rock did Apollo astronauts bring back to Earth?",
      842,
      "Those samples still power lunar science decades later because every gram can be studied again with newer tools.",
      "The opener starts with a concrete number most players have never actually tried to estimate."
    ),
    question(
      "About how many miles wide is the Moon?",
      2_159,
      "The Moon looks small in the sky, but its diameter still stretches farther than a coast-to-coast U.S. road trip segment.",
      "The stretch keeps the theme lunar while shifting away from a duplicated distance prompt."
    ),
    question(
      "About how many craters larger than one kilometer mark the Moon?",
      1_300_000,
      "The Moon preserves old impacts so well because it has almost no weather to erase them.",
      "The closer makes the Moon feel less like a smooth disk and more like an archive of collisions."
    ),
  ]),
  theme("Dinosaur Bones", [
    question(
      "About how many feet long was an adult T. rex?",
      40,
      "Even the famous skeletons in museums can make it hard to feel just how much animal that length represents.",
      "The opener starts with a number people can picture, but rarely pin down."
    ),
    question(
      "About how many pounds of force could a T. rex bite deliver?",
      12_800,
      "That bite force estimate is part of why paleontologists see T. rex as a crushing predator, not just a slashing one.",
      "The stretch moves from body scale to raw mechanical force."
    ),
    question(
      "About how many pounds could a giant Argentinosaurus weigh?",
      150_000,
      "The biggest sauropods were so heavy that their body mass is easier to picture in trucks than in animals.",
      "The closer lands on true prehistoric scale rather than a small anatomical fact."
    ),
  ]),
  theme("Ocean Creatures", [
    question(
      "About how many teeth can a bottlenose dolphin have?",
      100,
      "The exact count varies a little, but bottlenose dolphins really do carry a grin full of nearly triple-digit teeth.",
      "The opener starts with a vivid animal detail that still feels estimate-friendly."
    ),
    question(
      "About how many suckers can a giant Pacific octopus have?",
      2_000,
      "Those suckers are not just grips; they are also sensitive chemical and touch sensors.",
      "The stretch keeps the octopus weirdness but turns it into real scale."
    ),
    question(
      "About how many eggs can an ocean sunfish release in one spawning event?",
      300_000_000,
      "Ocean sunfish lean on absurd egg counts because so few offspring survive to adulthood.",
      "The closer is a true jaw-dropper and one of the strongest large-number reveals in the library."
    ),
  ]),
  theme("Mountain Records", [
    question(
      "About how many feet above sea level is Mount Everest?",
      29_000,
      "The exact modern survey is a little over 29,000 feet, but the rounded version is what most climbers carry in their heads.",
      "The opener starts with a mountain number that feels famous but still fuzzy."
    ),
    question(
      "About how many vertical feet separate Everest Base Camp from the summit?",
      11_500,
      "Climbers think about both altitude and vertical gain because they create different kinds of strain.",
      "The stretch keeps Everest in frame while changing the kind of scale players judge."
    ),
    question(
      "As of 2026, roughly how many miles long is the Appalachian Trail?",
      2_198,
      "The exact route changes a little over time as sections are rerouted or rebuilt.",
      "The closer introduces a living measurement and explicitly time-stamps it.",
      { asOfDate: "2026-01-01" }
    ),
  ]),
  theme("The Coffee Bar", [
    question(
      "About how many coffee beans are in a one-pound bag of roasted coffee?",
      4_000,
      "Bean size varies by roast and origin, but a pound bag still hides several thousand individual beans.",
      "The opener makes a familiar bag of coffee feel more countable."
    ),
    question(
      "About how many cups of brewed coffee can a one-pound bag usually make?",
      48,
      "Brew strength shifts the exact total, but the benchmark helps connect bag size to a real kitchen routine.",
      "The stretch ties the bag count back to a real kitchen outcome."
    ),
    question(
      "About how many cups of coffee does the world drink in a year?",
      730_000_000_000,
      "Once you zoom out from a countertop bag to planet scale, coffee starts looking like one of humanity's biggest shared rituals.",
      "The closer gives the coffee theme a truly global reveal."
    ),
  ]),
  theme("Cash Counts", [
    question(
      "How many quarters are in a standard roll from the bank?",
      40,
      "Coin rolls feel casual, but every denomination has its own tightly fixed count.",
      "The opener starts with money in a form many players have physically handled."
    ),
    question(
      "How many pennies would you need to make $100?",
      10_000,
      "Even a simple dollar amount turns into a surprisingly huge pile when it is all pennies.",
      "The stretch turns a familiar amount of money into a scale question."
    ),
    question(
      "How many $20 bills would it take to make $100,000?",
      5_000,
      "A six-figure stack still becomes a surprisingly concrete object once you convert it into bill count.",
      "The closer keeps the day in cash-scale territory without repeating the stretch answer."
    ),
  ]),
  theme("Cube Logic", [
    question(
      "How many visible stickers appear on a classic 3 by 3 Rubik's Cube?",
      54,
      "Hidden mechanics make the cube feel like 27 little blocks, but only 54 stickers show on the outside.",
      "The opener keeps the cube theme but starts with a more estimation-friendly number."
    ),
    question(
      "How many unit cubes are inside a 5 by 5 by 5 cube?",
      125,
      "Once you think in volume instead of visible faces, cube math jumps quickly.",
      "The stretch broadens the theme from toy design to 3D counting."
    ),
    question(
      "How many one-inch cubes fit inside a cubic yard?",
      46_656,
      "A cubic yard sounds manageable until you break it down into inch-by-inch units.",
      "The closer turns cube logic into a satisfying volume reveal."
    ),
  ]),
  theme("Pet House", [
    question(
      "How many teeth does an adult cat usually have?",
      30,
      "Kittens start with fewer baby teeth before the adult set comes in.",
      "The opener is familiar but not automatic."
    ),
    question(
      "How many teeth does an adult dog usually have?",
      42,
      "That large count helps explain why chew toys matter so much for dental health.",
      "The stretch keeps the theme domestic while widening the number."
    ),
    question(
      "About how many scent receptors can a dog have in its nose?",
      300_000_000,
      "Dogs do not just smell more strongly than we do; they process scent as a main way of reading the world.",
      "The closer jumps from visible anatomy to staggering sensory scale."
    ),
  ]),
  theme("Movie Math", [
    question(
      "How many frames per second define the classic cinema standard?",
      24,
      "That frame rate still shapes what audiences describe as the 'movie look.'",
      "The opener is a film-school staple many players have heard before."
    ),
    question(
      "How many individual frames are in a 10-minute film shot at 24 frames per second?",
      14_400,
      "A short film still contains a surprising parade of still images once you do the math.",
      "The stretch turns a familiar frame rate into something more physical."
    ),
    question(
      "How many individual frames are in a two-hour movie shot at 24 frames per second?",
      172_800,
      "A film that feels seamless to the eye is really a fast parade of still images.",
      "The closer turns a famous frame rate into a true estimation payoff."
    ),
  ]),
  theme("Bridges and Cables", [
    question(
      "How many towers hold up the Golden Gate Bridge?",
      2,
      "Those towers rise above the strait like giant tuning forks for the whole structure.",
      "The opener starts with a silhouette players can picture instantly."
    ),
    question(
      "How many feet long is the Golden Gate Bridge's main span?",
      4_200,
      "When it opened, that central span was the longest suspension span in the world.",
      "The stretch moves from visible shape to measurable engineering."
    ),
    question(
      "How many wire strands are bundled into one main Golden Gate cable?",
      27_572,
      "The bridge's cables are giant ropes made of thousands of thinner wires working together.",
      "The closer reveals the hidden complexity inside a seemingly simple cable."
    ),
  ]),
  theme("Rail Lines", [
    question(
      "How many wheels are on a standard railroad bogie, or truck?",
      4,
      "Most freight and passenger cars ride on two of those four-wheel assemblies.",
      "The opener anchors the day in a part of the train most people have seen without naming."
    ),
    question(
      "How many millimeters wide is standard railroad track gauge?",
      1_435,
      "That oddly specific width spread so widely that it became the global default in many countries.",
      "The stretch is a perfect 'you either know it or you reason toward it' number."
    ),
    question(
      "Roughly how many freight cars fit into a one-mile train?",
      100,
      "Train length depends on car type, but a mile-long freight train really does land near triple digits.",
      "The closer turns an abstract mile into something players can picture rolling past them."
    ),
  ]),
  theme("Spaceflight", [
    question(
      "About how many minutes does the International Space Station take to orbit Earth once?",
      90,
      "That pace gives astronauts about 16 sunrises and sunsets every day.",
      "The opener starts with a round number and a vivid mental image."
    ),
    question(
      "How many astronauts have walked on the Moon?",
      12,
      "All 12 moonwalkers were part of the Apollo program between 1969 and 1972.",
      "The stretch keeps the space theme human and historical."
    ),
    question(
      "About how many heat-resistant tiles covered a space shuttle orbiter?",
      24_000,
      "Each tile had to fit its exact position; they were not interchangeable like bathroom tiles.",
      "The closer ends on engineering scale rather than astronaut count."
    ),
  ]),
  theme("Under the Night Sky", [
    question(
      "About how many miles does light travel in one year?",
      5_900_000_000_000,
      "A light-year is a distance, not a time, which is why the number feels so alien at first glance.",
      "The opener immediately shifts the sky theme into awe-scale estimation."
    ),
    question(
      "About how many light-years away is Polaris?",
      433,
      "The North Star feels fixed only because it is unimaginably distant by earthly standards.",
      "The stretch gives the theme a real space distance that still feels guessable."
    ),
    question(
      "About how many stars can the human eye see under ideal dark-sky conditions?",
      5_000,
      "Light pollution hides most of that sky for modern city dwellers.",
      "The closer gives the set a sense of wonder and loss at the same time."
    ),
  ]),
  theme("Tabletop Pieces", [
    question(
      "How many tiles are in an English-language Scrabble set?",
      100,
      "That total includes the two blank tiles that can stand in for any letter.",
      "The opener starts with a tactile object lots of players have poured onto a table."
    ),
    question(
      "How many tiles are in a standard mahjong set?",
      144,
      "A mahjong wall looks elegant on the table because that full tile count spreads into long, tactile rows.",
      "The stretch gives the day a bigger middle count without dropping back into another near-hundred answer."
    ),
    question(
      "How many pieces are in the kind of full-size living-room jigsaw puzzle many brands treat as the standard challenge?",
      1_000,
      "That round-number puzzle size became standard partly because it feels ambitious without becoming impossible.",
      "The closer lands on a piece count people know emotionally, but often never really visualize."
    ),
  ]),
];

const FALLBACK_ENTRY = theme("Starter Numbers", [
  question(
    "How many bones are in the adult human body?",
    206,
    "It is one of the most durable number-fact anchors in science trivia.",
    "Fallback content should feel trustworthy and familiar."
  ),
  question(
    "How many keys are on a full-size piano?",
    88,
    "The piano is such a familiar object that it makes a good emergency middle question.",
    "Fallback content needs to be instantly legible."
  ),
  question(
    "How many cards are in a standard deck without jokers?",
    52,
    "That deck count is one of the most universal pieces of tabletop trivia.",
    "Fallback closers should still feel satisfying, even if they are simpler."
  ),
]);

function positiveModulo(value, base) {
  return ((value % base) + base) % base;
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

function orderOfMagnitude(value) {
  if (value <= 0) return 0;
  return Math.floor(Math.log10(value));
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

function createContentFingerprint(themeName, questions) {
  const fingerprintPayload = JSON.stringify({
    theme: themeName,
    questions: questions.map((questionEntry) => ({
      prompt: questionEntry.prompt,
      answer: questionEntry.answer,
      funFact: questionEntry.funFact,
      rationale: questionEntry.rationale,
      difficulty: questionEntry.difficulty,
      asOfDate: questionEntry.asOfDate ?? null,
    })),
  });

  return `daybreak-${fnv1aHash(fingerprintPayload)}`;
}

function createDailySet(entry, dateKey, metadata = {}) {
  return {
    date: dateKey,
    theme: entry.theme,
    source: metadata.source ?? "authored",
    ...(metadata.fallbackReason ? { fallbackReason: metadata.fallbackReason } : {}),
    questions: entry.questions.map((questionEntry, index) => ({
      id: `${slugify(entry.theme)}-${index + 1}`,
      prompt: questionEntry.prompt,
      answer: questionEntry.answer,
      funFact: questionEntry.funFact,
      rationale: questionEntry.rationale,
      difficulty: DIFFICULTY_ORDER[index],
      ...(questionEntry.asOfDate ? { asOfDate: questionEntry.asOfDate } : {}),
    })),
  };
}

function getCycleIndex(dateKey) {
  const startDate = parseDateKey(CYCLE_START_KEY);
  const targetDate = parseDateKey(dateKey);
  const dayDiff = Math.round((targetDate - startDate) / DAY_MS);
  return positiveModulo(dayDiff, DAILY_THEME_LIBRARY.length);
}

function validateQuestion(questionEntry, index, seenPrompts) {
  if (!questionEntry || typeof questionEntry !== "object") {
    throw new Error(`Question ${index + 1} is missing.`);
  }

  if (typeof questionEntry.prompt !== "string" || questionEntry.prompt.trim().length < 8) {
    throw new Error(`Question ${index + 1} needs a prompt.`);
  }

  if (!Number.isFinite(questionEntry.answer) || questionEntry.answer <= 0) {
    throw new Error(`Question ${index + 1} needs a positive numeric answer.`);
  }

  if (typeof questionEntry.funFact !== "string" || questionEntry.funFact.trim().length < 8) {
    throw new Error(`Question ${index + 1} needs a fun fact.`);
  }

  if (typeof questionEntry.rationale !== "string" || questionEntry.rationale.trim().length < 8) {
    throw new Error(`Question ${index + 1} needs a rationale.`);
  }

  if (questionEntry.difficulty !== DIFFICULTY_ORDER[index]) {
    throw new Error(`Question ${index + 1} must be tagged as ${DIFFICULTY_ORDER[index]}.`);
  }

  const normalizedPrompt = normalizePrompt(questionEntry.prompt);
  if (seenPrompts.has(normalizedPrompt)) {
    throw new Error(`Question ${index + 1} duplicates another prompt in the same daily set.`);
  }
  seenPrompts.add(normalizedPrompt);

  if (isVolatileQuestion(questionEntry) && !questionEntry.asOfDate) {
    throw new Error(`Question ${index + 1} references a volatile fact and must include asOfDate.`);
  }

  if (questionEntry.asOfDate && Number.isNaN(parseDateKey(questionEntry.asOfDate).getTime())) {
    throw new Error(`Question ${index + 1} has an invalid asOfDate.`);
  }

  return {
    id: questionEntry.id,
    prompt: questionEntry.prompt.trim(),
    answer: Math.round(questionEntry.answer),
    funFact: questionEntry.funFact.trim(),
    rationale: questionEntry.rationale.trim(),
    difficulty: questionEntry.difficulty,
    ...(questionEntry.asOfDate ? { asOfDate: questionEntry.asOfDate } : {}),
  };
}

function createResolvedDailySetMetadata(validatedDailySet, metadata = {}) {
  return {
    ...validatedDailySet,
    contentFingerprint: createContentFingerprint(validatedDailySet.theme, validatedDailySet.questions),
    source: metadata.source ?? "authored",
    ...(metadata.fallbackReason ? { fallbackReason: metadata.fallbackReason } : {}),
  };
}

function buildAuthorDailySetFromEntry(entry, dateKey) {
  return createDailySet(entry, dateKey, { source: "authored" });
}

function auditDailySetHeuristics(dailySet) {
  const answers = dailySet.questions.map((questionEntry) => questionEntry.answer);
  const warnings = [];
  const tinyAnswerCount = answers.filter((answer) => answer <= 15).length;
  const magnitudeSpread = Math.max(...answers) / Math.min(...answers);
  const uniqueMagnitudes = new Set(answers.map((answer) => orderOfMagnitude(answer))).size;
  const [warmup, stretch, closer] = answers;

  if (tinyAnswerCount > 1) {
    warnings.push("Contains more than one tiny-count answer, which can make the set feel recall-first.");
  }

  if (uniqueMagnitudes === 1 && magnitudeSpread < 20) {
    warnings.push("Stays in nearly the same numeric band across all three questions, so the arc feels flat.");
  }

  if (Math.abs(warmup - stretch) <= Math.max(10, warmup * 0.15)) {
    warnings.push("Warm-up and stretch land too close together, which blunts the middle-round calibration shift.");
  }

  if (closer < stretch * 0.25 && closer < 100 && stretch >= 1_000) {
    warnings.push("Closer shrinks to a tiny count after a much larger stretch answer, so the finish can feel smaller than the middle.");
  }

  return warnings;
}

export function validateDailySet(
  rawDailySet,
  dateKey = rawDailySet?.date ?? CYCLE_START_KEY,
  metadata = {}
) {
  if (!rawDailySet || typeof rawDailySet !== "object") {
    throw new Error("Daily set payload is missing.");
  }

  if (typeof rawDailySet.theme !== "string" || rawDailySet.theme.trim().length < 3) {
    throw new Error("Daily set theme is missing.");
  }

  if (!Array.isArray(rawDailySet.questions) || rawDailySet.questions.length !== 3) {
    throw new Error("Daily set must contain exactly 3 questions.");
  }

  const seenPrompts = new Set();
  const validatedQuestions = rawDailySet.questions.map((questionEntry, index) =>
    validateQuestion(questionEntry, index, seenPrompts)
  );

  return createResolvedDailySetMetadata(
    {
      date: dateKey,
      theme: rawDailySet.theme.trim(),
      questions: validatedQuestions,
    },
    metadata
  );
}

function validateAuthoredEntry(entry, dateKey) {
  return validateDailySet(buildAuthorDailySetFromEntry(entry, dateKey), dateKey, {
    source: "authored",
  });
}

export function validateAuthoredLibrary(
  startDateKey = CYCLE_START_KEY,
  daysToCheck = DAYBREAK_CYCLE_LENGTH
) {
  const failures = [];
  const warnings = [];
  const themeSet = new Set();
  const promptToDateMap = new Map();
  const authoredSets = [];

  if (DAILY_THEME_LIBRARY.length !== DAYBREAK_CYCLE_LENGTH) {
    failures.push(
      `Expected ${DAYBREAK_CYCLE_LENGTH} authored daily sets, found ${DAILY_THEME_LIBRARY.length}.`
    );
  }

  DAILY_THEME_LIBRARY.forEach((entry) => {
    if (themeSet.has(entry.theme)) {
      failures.push(`Duplicate theme detected: ${entry.theme}.`);
      return;
    }

    themeSet.add(entry.theme);
  });

  const boundedDays = Math.min(daysToCheck, DAILY_THEME_LIBRARY.length);

  for (let index = 0; index < boundedDays; index += 1) {
    const dateKey = shiftDateKey(startDateKey, index);
    const entry = DAILY_THEME_LIBRARY[index];

    try {
      const authoredSet = validateAuthoredEntry(entry, dateKey);
      authoredSets.push(authoredSet);

      authoredSet.questions.forEach((questionEntry) => {
        const normalizedPrompt = normalizePrompt(questionEntry.prompt);
        const seenDateKey = promptToDateMap.get(normalizedPrompt);

        if (seenDateKey) {
          failures.push(
            `${dateKey}: prompt duplicates an authored question already used on ${seenDateKey}.`
          );
          return;
        }

        promptToDateMap.set(normalizedPrompt, dateKey);
      });

      auditDailySetHeuristics(authoredSet).forEach((warning) => {
        warnings.push(`${dateKey} (${authoredSet.theme}): ${warning}`);
      });
    } catch (error) {
      failures.push(`${dateKey}: ${error.message}`);
    }
  }

  return {
    passed: failures.length === 0 && warnings.length === 0,
    authoredSets,
    authoredSetMap: new Map(authoredSets.map((dailySet) => [dailySet.date, dailySet])),
    failures,
    warnings,
    uniqueThemes: themeSet.size,
    questionsChecked: authoredSets.reduce(
      (sum, dailySet) => sum + dailySet.questions.length,
      0
    ),
  };
}

export async function runAuthoredContentValidationSuite(
  startDateKey = CYCLE_START_KEY,
  daysToCheck = DAYBREAK_CYCLE_LENGTH
) {
  const authoredSummary = validateAuthoredLibrary(startDateKey, daysToCheck);
  const failures = [...authoredSummary.failures];
  const warnings = [...authoredSummary.warnings];
  const boundedDays = Math.min(daysToCheck, DAILY_THEME_LIBRARY.length);

  for (let index = 0; index < boundedDays; index += 1) {
    const dateKey = shiftDateKey(startDateKey, index);
    const authoredSet = authoredSummary.authoredSetMap.get(dateKey);

    try {
      const resolvedSet = await getDailySet(dateKey);

      if (resolvedSet.source !== "authored") {
        failures.push(
          `${dateKey}: runtime resolution used fallback content (${resolvedSet.fallbackReason ?? "unknown reason"}).`
        );
      }

      if (
        authoredSet &&
        resolvedSet.contentFingerprint !== authoredSet.contentFingerprint
      ) {
        failures.push(`${dateKey}: runtime fingerprint does not match the authored library.`);
      }
    } catch (error) {
      failures.push(`${dateKey}: runtime resolution failed with ${error.message}`);
    }
  }

  return {
    passed: failures.length === 0 && warnings.length === 0,
    daysChecked: boundedDays,
    authoredSets: DAILY_THEME_LIBRARY.length,
    uniqueThemes: authoredSummary.uniqueThemes,
    questionsChecked: authoredSummary.questionsChecked,
    failures,
    warnings,
  };
}

export function validateWeatherSignsAuthoredDay() {
  const weatherSignsIndex = DAILY_THEME_LIBRARY.findIndex((entry) => entry.theme === "Weather Signs");

  if (weatherSignsIndex === -1) {
    throw new Error("Weather Signs is missing from the authored library.");
  }

  const dateKey = shiftDateKey(CYCLE_START_KEY, weatherSignsIndex);
  return validateAuthoredEntry(DAILY_THEME_LIBRARY[weatherSignsIndex], dateKey);
}

async function requestDailySetFromProvider(dateKey) {
  const entry = DAILY_THEME_LIBRARY[getCycleIndex(dateKey)];
  return clone(buildAuthorDailySetFromEntry(entry, dateKey));
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
  return getCycleIndex(dateKey) + 1;
}

export function getThemePreview(dateKey) {
  return DAILY_THEME_LIBRARY[getCycleIndex(dateKey)].theme;
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

export async function runContentValidationSuite(
  startDateKey = CYCLE_START_KEY,
  daysToCheck = DAYBREAK_CYCLE_LENGTH
) {
  return runAuthoredContentValidationSuite(startDateKey, daysToCheck);
}
