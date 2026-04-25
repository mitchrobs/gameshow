export const CYCLE_START_KEY = "2026-04-23";
export const CALENDAR_END_KEY = "2026-12-31";
export const MAX_GUESSES = 4;
export const WIN_THRESHOLD = 0.1;
const CORE_QUESTION_COUNT = 3;
const CORE_DIFFICULTY_SCORES = [2, 3, 4];
const EXTRA_INNING_DIFFICULTY_SCORE = 5;
const SCALE_BAND_RANK = {
  pocket: 0,
  room: 1,
  city: 2,
  world: 3,
};
const DAY_MS = 24 * 60 * 60 * 1000;
export const DAYBREAK_CYCLE_LENGTH = countInclusiveDays(CYCLE_START_KEY, CALENDAR_END_KEY);
const VOLATILE_PATTERN =
  /\b(today|current|currently|as of|this year|this month|this week|per day|daily|updated|latest|active users|population)\b/i;

function question(prompt, answer, funFact, rationale, extra = {}) {
  return { prompt, answer, funFact, rationale, ...extra };
}

function theme(themeName, questions, extraInning = null) {
  return {
    id: slugify(themeName),
    theme: themeName,
    questions,
    ...(extraInning ? { extraInning } : {}),
  };
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
      "About how many pounds can a concert grand piano weigh?",
      1_200,
      "A concert grand feels graceful onstage, but it is really a thousand-plus-pound machine on casters.",
      "The closer widens the music set from instrument details to the physical heft of performance gear."
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
      "About how many bees can a thousand-hive pollination outfit hold at peak season?",
      50_000_000,
      "Commercial pollination turns bee scale from one humming box into tens of millions of insects moving through one job.",
      "The closer pushes the bee day from hive intuition to full agricultural-scale logistics."
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
      "About how many tennis balls can the U.S. Open use across one tournament?",
      100_000,
      "A major tournament cycles through a startling number of fresh balls just to keep the bounce and wear consistent.",
      "The closer finally widens the sports-ball set from object scale to event scale."
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
      "About how many square miles does the contiguous United States cover?",
      3_100_000,
      "A map of the lower forty-eight feels manageable only because paper shrinks millions of square miles into one rectangle.",
      "The closer makes the geography day end on a true map-scale reveal instead of a smaller landmark distance."
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
      "How many mountains on Earth rise above 8,000 meters?",
      14,
      "That very short list is why climbers talk about the eight-thousanders almost like a separate class of mountain.",
      "The opener gives the day a small, memorable anchor before the numbers climb."
    ),
    question(
      "About how many vertical feet separate Everest Base Camp from the summit?",
      11_500,
      "Climbers think about both altitude and vertical gain because they create different kinds of strain.",
      "The stretch keeps Everest in frame while changing the kind of scale players judge."
    ),
    question(
      "About how many vertical feet rise from the Pacific seafloor to the summit of Mauna Kea?",
      33_500,
      "Measured from its underwater base, Mauna Kea rises higher than Everest does above sea level.",
      "The closer gives the mountain day its biggest true-scale reveal without leaning on a volatile trail stat."
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
      "How many $1 bills would it take to make $1,000,000?",
      1_000_000,
      "A million dollars sounds abstract until you picture it as a literal million single bills stacked and boxed.",
      "The closer gives the money day a cleaner, bigger final scale jump."
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
      "About how many light-years away is Polaris?",
      433,
      "The North Star feels fixed only because it is unimaginably distant by earthly standards.",
      "The opener starts with one star you can actually point to."
    ),
    question(
      "About how many stars can the human eye see under ideal dark-sky conditions?",
      5_000,
      "Light pollution hides most of that sky for modern city dwellers.",
      "The stretch widens the day from one famous star to the whole visible sky."
    ),
    question(
      "About how many miles does light travel in one year?",
      5_900_000_000_000,
      "A light-year is a distance, not a time, which is why the number feels so alien at first glance.",
      "The closer gives the set its true cosmic leap."
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

const HOLIDAY_THEME_LIBRARY = [
  theme("Flower Shop", [
    question(
      "How many stems are in a florist's two-dozen rose bundle?",
      24,
      "Florists still talk in dozens because bouquets are sold by visual fullness as much as by stem count.",
      "The opener gives Mother's Day weekend a familiar, giftable object."
    ),
    question(
      "About how many petals can you count across a dozen average roses?",
      420,
      "Rose varieties swing a little, but a dozen blooms still add up to a surprising pile of petals.",
      "The middle question keeps the flower theme but zooms into the structure of the bouquet."
    ),
    question(
      "About how many square feet can a working commercial greenhouse cover?",
      50_000,
      "Commercial houses that size feel less like backyard gardens and more like glass factories for living things.",
      "The closer widens the holiday from bouquet scale to the spaces that grow those flowers."
    ),
  ]),
  theme("Backyard Grill", [
    question(
      "How many ounces are in a standard 20-pound propane tank?",
      320,
      "Propane tanks are sold by pounds, but grill planning usually feels easier once you picture the ounces.",
      "The opener gives Memorial Day weekend a sturdy cookout anchor."
    ),
    question(
      "About how many charcoal briquettes are in a typical 16-pound bag?",
      160,
      "Those bags feel heavy because each briquette is dense, not because there are thousands of them inside.",
      "The stretch keeps the grill theme tactile and countable."
    ),
    question(
      "About how many BTUs are stored in a full 20-pound propane tank?",
      430_000,
      "That hidden energy budget is why a backyard grill can feel small while still doing restaurant-scale heat work.",
      "The closer turns a familiar tank into a real energy-scale estimate."
    ),
  ]),
  theme("Block Party", [
    question(
      "How many dominoes are in a double-six set?",
      28,
      "The set feels larger than it is because every tile can sit in more than one pattern at the table.",
      "The opener gives the Juneteenth block-party date a familiar tabletop anchor."
    ),
    question(
      "How many pips appear across that whole double-six set?",
      168,
      "Once you count every dot on every face, a tiny domino case starts to feel unexpectedly dense.",
      "The stretch keeps the same object in view but changes what the player is counting."
    ),
    question(
      "About how many steps would you walk along a two-mile parade route?",
      4_200,
      "A parade route sounds casual until you translate it into thousands of steps on warm pavement.",
      "The closer opens the party theme from the table to the whole street."
    ),
  ]),
  theme("Garage Weekend", [
    question(
      "How many ounces are in a standard claw hammer?",
      16,
      "The classic household hammer is sold by head weight, not by how hefty it feels in your hand.",
      "The opener gives Father's Day a crisp, tool-bench foothold."
    ),
    question(
      "How many inches are in a 25-foot tape measure?",
      300,
      "Tape measures feel modest on a hook, but the full run is long enough to redraw a whole room.",
      "The stretch keeps the Father's Day garage theme tactile while expanding the working scale."
    ),
    question(
      "About how many pounds can a common home garage floor jack lift?",
      6_000,
      "A floor jack that size feels like one tool on the shelf, but it is built to lift something roughly the weight of two cars.",
      "The closer gives the garage day a stronger Father's Day machine-scale finish."
    ),
  ]),
  theme("Fireworks Night", [
    question(
      "About how many seconds does a hand sparkler usually burn?",
      60,
      "A sparkler feels long in the hand mostly because your brain notices every second of bright metal fizzing.",
      "The opener gives Independence Day a tactile number players can estimate from lived experience."
    ),
    question(
      "About how many feet can a consumer firework shell climb before it bursts?",
      200,
      "A backyard shell only feels tiny until you picture two hundred feet of dark air underneath it.",
      "The stretch turns the holiday from something in your hand into something high over the block."
    ),
    question(
      "About how many shells can a large public fireworks show launch in one night?",
      5_000,
      "Big city displays feel seamless from the lawn because thousands of separate launches have been choreographed into one long burst of light.",
      "The closer gives July 4 an event-scale finale instead of ending in small flag trivia."
    ),
  ]),
  theme("Toolbox Day", [
    question(
      "How many inches are in an eight-foot ladder?",
      96,
      "Workday gear gets easier to picture once you convert it into the units people actually see on the tool.",
      "The opener gives Labor Day a solid workshop number."
    ),
    question(
      "How many inches are in a standard 10-foot stud?",
      120,
      "That clean round cut is one reason framing lumber feels surprisingly legible on a job site.",
      "The stretch stays in the same building world with a number close enough to invite overconfidence."
    ),
    question(
      "How many pounds can a one-ton shop hoist lift?",
      2_000,
      "The phrase one ton sounds industrial until you translate it into a number you can compare to cars and engines.",
      "The closer gives the holiday a true labor-and-machinery finish."
    ),
  ]),
  theme("Candy Bowl", [
    question(
      "How many pieces are in a standard fun-size variety bag of candy?",
      30,
      "Those mixed bags feel bottomless only because the pieces are small and the wrappers are loud.",
      "The opener gives Halloween a familiar doorstep count."
    ),
    question(
      "About how many candy kernels are in a pound of candy corn?",
      460,
      "Candy corn looks like a light snack until you count how densely those little triangles stack together.",
      "The stretch turns the candy bowl into a real estimate instead of a seasonal prop."
    ),
    question(
      "About how many pumpkins can grow on one acre of pumpkin patch?",
      3_000,
      "The patches people stroll through in October are usually carrying thousands of pumpkins at once.",
      "The closer widens Halloween from the bowl on the porch to the whole field."
    ),
  ]),
  theme("Thanksgiving Table", [
    question(
      "How many square inches are on a nine-inch pie?",
      64,
      "A pie tin sounds small until you translate the circle into the surface that actually has to bake evenly.",
      "The opener gives Thanksgiving an everyday table object with a number hiding inside it."
    ),
    question(
      "How many tablespoons are in a cup?",
      16,
      "Kitchen confidence often comes down to a few tiny conversion numbers you can reach for without thinking.",
      "The stretch keeps the holiday in prep mode with a number cooks half-remember."
    ),
    question(
      "About how many kernels are on an average ear of corn?",
      800,
      "An ear looks tidy in your hand, but the rows hide hundreds of kernels packed together.",
      "The closer turns the table from portion scale to harvest scale."
    ),
  ]),
  theme("Stocking Stuffers", [
    question(
      "How many crayons are in a classic small Crayola tuck box?",
      24,
      "That little box became iconic because twenty-four colors feels generous before it turns overwhelming.",
      "The opener gives Christmas Eve a small gift-sized count."
    ),
    question(
      "How many pieces are in a standard jacks set, counting the ball?",
      11,
      "The whole game fits in one palm, which is why it still feels like the definition of a stocking stuffer.",
      "The stretch keeps the same gift scale but asks for a number most players have never counted."
    ),
    question(
      "How many square inches of wrapping paper are on a 30-inch by 20-foot roll?",
      7_200,
      "One slim holiday roll hides a surprising amount of paper once you flatten the cylinder into sheet area.",
      "The closer turns Christmas Eve from tiny gifts to the full table of paper and tape."
    ),
  ]),
  theme("Under the Tree", [
    question(
      "How many ornaments come in a standard six-box starter pack?",
      36,
      "Starter sets feel full on the shelf because the boxes are grouped by color, not because each box is huge.",
      "The opener starts Christmas morning with a simple decoration count."
    ),
    question(
      "How many inches are in a six-foot tree diameter?",
      72,
      "Once a tree is lying on its side, the room math gets much more literal.",
      "The stretch keeps the tree in frame while shifting to spatial reasoning."
    ),
    question(
      "About how many lights are on a 7.5-foot pre-lit tree?",
      700,
      "Pre-lit trees feel magical largely because the bulb count is much higher than most people would string by hand.",
      "The closer turns one Christmas tree into a real little grid of numbers."
    ),
  ]),
  theme("Countdown Night", [
    question(
      "How many seconds are in the final minute before midnight?",
      60,
      "The last minute feels fast because everyone agrees to count every single second out loud together.",
      "The opener gives New Year's Eve a number nobody needs explained, only felt."
    ),
    question(
      "How many seconds are in the final hour before midnight?",
      3_600,
      "An hour feels roomy until you start mentally spending it in sixty-second chunks.",
      "The stretch turns the same countdown energy into a bigger time block."
    ),
    question(
      "How many seconds are in the final 24 hours of the year?",
      86_400,
      "A whole last day is still just one finite pile of seconds leaking away toward midnight.",
      "The closer gives the year-end date its cleanest big-number reveal."
    ),
  ]),
];

const FRIDAY_EXTRA_INNING_BY_THEME_ID = {
  "in-the-orchestra-pit": question(
    "About how many pipes can a large concert organ have?",
    5_000,
    "Large organs become harder to picture once you stop thinking about keys and start thinking about thousands of tuned pipes.",
    "The bonus question makes the orchestra theme feel architectural instead of orchestral.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "calendar-math": question(
    "How many seconds are in a leap year?",
    31_622_400,
    "That extra day looks tiny on a wall calendar and enormous once it gets converted into seconds.",
    "The bonus question rewards players who stayed loose with calendar conversions all day.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "touring-the-solar-system": question(
    "About how many miles from the Sun is Neptune on average?",
    2_800_000_000,
    "Neptune sits so far out that even the numbers for the inner planets stop feeling useful as intuition.",
    "The bonus question is the day's hardest solar-system scale jump.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "card-table-numbers": question(
    "How many different bridge hands can be dealt from one standard deck?",
    635_013_559_600,
    "Card games feel intimate at the table even when the combinatorics under them become astronomical.",
    "The bonus question turns card-table intuition into a truly huge counting space.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "map-scale": question(
    "About how many square miles does the Sahara cover?",
    3_600_000,
    "Map scale stops feeling decorative once a desert starts swallowing millions of square miles.",
    "The bonus question gives the geography day its largest surface-area leap.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "word-count": question(
    "About how many words are in the King James Bible?",
    783_000,
    "That familiar one-volume book feels portable only because readers do not picture nearly eight hundred thousand words inside it.",
    "The bonus question pushes the reading day into canonical-library territory.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "ocean-creatures": question(
    "About how many pounds can a blue whale weigh?",
    300_000,
    "Blue whales push animal scale so far that their weight reads more like machinery than wildlife.",
    "The bonus question gives the ocean day its biggest living-number payoff.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  spaceflight: question(
    "About how many miles above Earth is geostationary orbit?",
    22_236,
    "That orbit feels close on a diagram and very far once you imagine the radio path to get there.",
    "The bonus question keeps the spaceflight day precise while making it materially tougher.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "under-the-night-sky": question(
    "About how many stars are in the Milky Way?",
    100_000_000_000,
    "The galaxy looks like one soft band overhead because the true star count is far beyond ordinary counting intuition.",
    "The bonus question gives the night-sky day its deepest awe-scale estimate.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "movie-math": question(
    "How many individual frames are in a 90-minute movie shot at 24 frames per second?",
    129_600,
    "A feature-length movie feels seamless only because the frame count is high enough for your eye to stop noticing the pieces.",
    "The bonus question keeps the movie day mathematical and a little tougher than the main closer.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "bridges-and-cables": question(
    "About how many miles of wire are bundled inside the Golden Gate Bridge's main cables?",
    80_000,
    "If the bridge's cable wire were stretched out, the length would feel less like one bridge and more like a planet-scale spool.",
    "The bonus question turns hidden bridge engineering into the hardest estimate of the day.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "cash-counts": question(
    "How many pennies would it take to make one million dollars?",
    100_000_000,
    "Big money sounds abstract until you convert it into one-cent pieces and realize you are counting into the hundreds of millions.",
    "The bonus question is the purest high-scale version of the cash day.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "world" }
  ),
  "block-party": question(
    "How many pips appear across a full double-twelve domino set?",
    1_092,
    "The tile count rises fast when the set expands, but the dot count grows even faster once every face has to be totaled.",
    "The Juneteenth Friday bonus keeps the same domino logic while making the arithmetic heavier.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
  "under-the-tree": question(
    "About how many lights glow on the Rockefeller Center Christmas tree?",
    50_000,
    "That famous tree reads as one warm shape on TV because the bulb count is so high your eye stops separating individual lights.",
    "The Christmas Day bonus gives the holiday its biggest, brightest estimate.",
    { difficultyScore: EXTRA_INNING_DIFFICULTY_SCORE, scaleBand: "city" }
  ),
};

const AUTHOR_THEME_LIBRARY = [...DAILY_THEME_LIBRARY, ...HOLIDAY_THEME_LIBRARY];
const THEME_ENTRY_BY_ID = new Map(AUTHOR_THEME_LIBRARY.map((entry) => [entry.id, entry]));
const HOLIDAY_THEME_BY_DATE = {
  "2026-05-10": "flower-shop",
  "2026-05-25": "backyard-grill",
  "2026-06-19": "block-party",
  "2026-06-21": "garage-weekend",
  "2026-07-04": "fireworks-night",
  "2026-09-07": "toolbox-day",
  "2026-10-31": "candy-bowl",
  "2026-11-26": "thanksgiving-table",
  "2026-12-24": "stocking-stuffers",
  "2026-12-25": "under-the-tree",
  "2026-12-31": "countdown-night",
};
const WEEKDAY_ROTATION_THEME_IDS = DAILY_THEME_LIBRARY.map((entry) => entry.id);
const FRIDAY_ROTATION_THEME_IDS = [
  "in-the-orchestra-pit",
  "calendar-math",
  "touring-the-solar-system",
  "card-table-numbers",
  "map-scale",
  "word-count",
  "ocean-creatures",
  "spaceflight",
  "under-the-night-sky",
  "movie-math",
  "bridges-and-cables",
  "cash-counts",
];
const CALENDAR_DATE_KEYS = buildCalendarDateKeys(CYCLE_START_KEY, CALENDAR_END_KEY);
const CALENDAR_THEME_BY_DATE = buildCalendarThemeMap();

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

function buildCalendarThemeMap() {
  const mapping = {};
  let weekdayIndex = 0;
  let fridayIndex = 0;
  let previousThemeId = null;

  const takeNextThemeId = (rotation, cursor) => {
    let nextCursor = cursor;
    let nextThemeId = rotation[nextCursor % rotation.length];

    while (
      rotation.length > 1 &&
      nextThemeId === previousThemeId
    ) {
      nextCursor += 1;
      nextThemeId = rotation[nextCursor % rotation.length];
    }

    return {
      themeId: nextThemeId,
      nextCursor: nextCursor + 1,
    };
  };

  CALENDAR_DATE_KEYS.forEach((dateKey) => {
    const holidayThemeId = HOLIDAY_THEME_BY_DATE[dateKey];
    if (holidayThemeId) {
      mapping[dateKey] = holidayThemeId;
      previousThemeId = holidayThemeId;
      return;
    }

    if (isFridayDateKey(dateKey)) {
      const nextFriday = takeNextThemeId(FRIDAY_ROTATION_THEME_IDS, fridayIndex);
      mapping[dateKey] = nextFriday.themeId;
      fridayIndex = nextFriday.nextCursor;
      previousThemeId = nextFriday.themeId;
      return;
    }

    const nextWeekday = takeNextThemeId(WEEKDAY_ROTATION_THEME_IDS, weekdayIndex);
    mapping[dateKey] = nextWeekday.themeId;
    weekdayIndex = nextWeekday.nextCursor;
    previousThemeId = nextWeekday.themeId;
  });

  return mapping;
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

function inferScaleBand(answer) {
  if (answer < 100) return "pocket";
  if (answer < 1_000) return "room";
  if (answer < 100_000) return "city";
  return "world";
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
    scaleBand: questionEntry.scaleBand ?? inferScaleBand(questionEntry.answer),
    ...(questionEntry.asOfDate ? { asOfDate: questionEntry.asOfDate } : {}),
  };
}

function getExtraInningForDate(entry, dateKey) {
  if (!isFridayDateKey(dateKey)) return null;
  return entry.extraInning ?? FRIDAY_EXTRA_INNING_BY_THEME_ID[entry.id] ?? null;
}

function createContentFingerprint(themeName, questions, extraInning = null) {
  const fingerprintPayload = JSON.stringify({
    theme: themeName,
    questions: questions.map((questionEntry) => ({
      prompt: questionEntry.prompt,
      answer: questionEntry.answer,
      funFact: questionEntry.funFact,
      rationale: questionEntry.rationale,
      difficultyScore: questionEntry.difficultyScore,
      scaleBand: questionEntry.scaleBand,
      asOfDate: questionEntry.asOfDate ?? null,
    })),
    extraInning: extraInning
      ? {
          prompt: extraInning.prompt,
          answer: extraInning.answer,
          funFact: extraInning.funFact,
          rationale: extraInning.rationale,
          difficultyScore: extraInning.difficultyScore,
          scaleBand: extraInning.scaleBand,
          asOfDate: extraInning.asOfDate ?? null,
        }
      : null,
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
  const extraInning = getExtraInningForDate(entry, dateKey);

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

function buildAuthorDailySetFromEntry(entry, dateKey) {
  return createDailySet(entry, dateKey, { source: "authored" });
}

function auditDailySetHeuristics(dailySet) {
  const answers = dailySet.questions.map((questionEntry) => questionEntry.answer);
  const scaleBands = dailySet.questions.map((questionEntry) => questionEntry.scaleBand);
  const warnings = [];
  const tinyAnswerCount = answers.filter((answer) => answer <= 15).length;
  const magnitudeSpread = Math.max(...answers) / Math.min(...answers);
  const firstScaleRank = getScaleBandRank(scaleBands[0]);

  if (tinyAnswerCount > 1) {
    warnings.push("Contains more than one tiny-count answer, which can make the set feel recall-first.");
  }

  if (new Set(scaleBands).size === 1 || magnitudeSpread < 4) {
    warnings.push("Stays too compressed in one scale band, so the set can feel flat.");
  }

  if (
    !dailySet.questions
      .slice(1)
      .some((questionEntry) => getScaleBandRank(questionEntry.scaleBand) > firstScaleRank)
  ) {
    warnings.push("Never widens beyond the opener's scale, which blunts the day-to-day Ballpark arc.");
  }

  if (dailySet.questions[2].difficultyScore < dailySet.questions[1].difficultyScore) {
    warnings.push("The closer grades easier than the middle question, which softens the finish.");
  }

  return warnings;
}

function validateCoreArc(questions) {
  const scaleBands = new Set(questions.map((questionEntry) => questionEntry.scaleBand));
  if (scaleBands.size < 2) {
    throw new Error("Core questions must span at least 2 scale bands.");
  }

  const firstScaleRank = getScaleBandRank(questions[0].scaleBand);
  if (
    !questions
      .slice(1)
      .some((questionEntry) => getScaleBandRank(questionEntry.scaleBand) > firstScaleRank)
  ) {
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

  if (!Array.isArray(rawDailySet.questions) || rawDailySet.questions.length !== CORE_QUESTION_COUNT) {
    throw new Error(`Daily set must contain exactly ${CORE_QUESTION_COUNT} questions.`);
  }

  const seenPrompts = new Set();
  const validatedQuestions = rawDailySet.questions.map((questionEntry, index) =>
    validateQuestion(questionEntry, index, seenPrompts)
  );
  const validatedExtraInning = rawDailySet.extraInning
    ? validateQuestion(
        rawDailySet.extraInning,
        CORE_QUESTION_COUNT,
        seenPrompts,
        "Extra Inning"
      )
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
      const hardestCoreDifficulty = Math.max(
        ...validatedQuestions.map((questionEntry) => questionEntry.difficultyScore)
      );

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
  return validateDailySet(buildAuthorDailySetFromEntry(entry, dateKey), dateKey, {
    source: "authored",
  });
}

function getAuthoredDateKeys(startDateKey, daysToCheck) {
  const startIndex = CALENDAR_DATE_KEYS.indexOf(startDateKey);
  if (startIndex === -1) {
    return [];
  }

  return CALENDAR_DATE_KEYS.slice(startIndex, startIndex + daysToCheck);
}

export function validateAuthoredLibrary(
  startDateKey = CYCLE_START_KEY,
  daysToCheck = DAYBREAK_CYCLE_LENGTH
) {
  const failures = [];
  const warnings = [];
  const uniqueThemes = new Set();
  const authoredSets = [];
  const authoredDateKeys = getAuthoredDateKeys(startDateKey, daysToCheck);

  if (authoredDateKeys.length === 0) {
    failures.push(`No authored Ballpark dates found for ${startDateKey}.`);
  }

  authoredDateKeys.forEach((dateKey) => {
    const scheduledThemeId = CALENDAR_THEME_BY_DATE[dateKey];
    const scheduledEntry = scheduledThemeId ? THEME_ENTRY_BY_ID.get(scheduledThemeId) : null;

    if (!scheduledThemeId || !scheduledEntry) {
      failures.push(`${dateKey}: missing authored theme assignment.`);
      return;
    }

    if (HOLIDAY_THEME_BY_DATE[dateKey] && HOLIDAY_THEME_BY_DATE[dateKey] !== scheduledThemeId) {
      failures.push(`${dateKey}: holiday theme assignment does not match the authored schedule.`);
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

  return {
    passed: failures.length === 0 && warnings.length === 0,
    daysChecked: authoredDateKeys.length,
    authoredSets,
    authoredSetMap: new Map(authoredSets.map((dailySet) => [dailySet.date, dailySet])),
    failures,
    warnings,
    uniqueThemes: uniqueThemes.size,
    questionsChecked: authoredSets.reduce(
      (sum, dailySet) =>
        sum + dailySet.questions.length + (dailySet.extraInning ? 1 : 0),
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

  authoredSummary.authoredSets.forEach((dailySet) => {
    const expectedHolidayThemeId = HOLIDAY_THEME_BY_DATE[dailySet.date];
    if (expectedHolidayThemeId) {
      const expectedHolidayTheme = THEME_ENTRY_BY_ID.get(expectedHolidayThemeId)?.theme;
      if (dailySet.theme !== expectedHolidayTheme) {
        failures.push(`${dailySet.date}: holiday theme did not resolve to the intended authored set.`);
      }
    }
  });

  for (const authoredSet of authoredSummary.authoredSets) {
    try {
      const resolvedSet = await getDailySet(authoredSet.date);

      if (resolvedSet.source !== "authored") {
        failures.push(
          `${authoredSet.date}: runtime resolution used fallback content (${resolvedSet.fallbackReason ?? "unknown reason"}).`
        );
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

export function validateWeatherSignsAuthoredDay() {
  const weatherSignsDateKey = CALENDAR_DATE_KEYS.find(
    (dateKey) => CALENDAR_THEME_BY_DATE[dateKey] === "weather-signs"
  );

  if (!weatherSignsDateKey) {
    throw new Error("Weather Signs is missing from the authored calendar.");
  }

  return validateAuthoredEntry(THEME_ENTRY_BY_ID.get("weather-signs"), weatherSignsDateKey);
}

async function requestDailySetFromProvider(dateKey) {
  if (!isDateKeyInCalendar(dateKey)) {
    throw new Error(`No authored Ballpark set scheduled for ${dateKey}.`);
  }

  const themeId = CALENDAR_THEME_BY_DATE[dateKey];
  const entry = themeId ? THEME_ENTRY_BY_ID.get(themeId) : null;

  if (!entry) {
    throw new Error(`No Ballpark theme found for ${dateKey}.`);
  }

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
  if (!isDateKeyInCalendar(dateKey)) return 1;
  return Math.round((parseDateKey(dateKey) - parseDateKey(CYCLE_START_KEY)) / DAY_MS) + 1;
}

export function getThemePreview(dateKey) {
  const themeId = CALENDAR_THEME_BY_DATE[dateKey];
  return themeId ? THEME_ENTRY_BY_ID.get(themeId)?.theme ?? FALLBACK_ENTRY.theme : FALLBACK_ENTRY.theme;
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
