const CORE_ROLES = Object.freeze([
  "Casual Morning Player",
  "Math-Averse Player",
  "Skeptical Trivia Player",
  "Competitive Player",
  "Mobile UX Player",
  "Family Couch Player",
  "Social Sharer",
  "Editorial Calendar Player",
  "NYT Word Game Player",
  "Daily Word Search Player",
  "Connections Pattern Player",
  "Fermi Estimator",
]);

const SCORE_KEYS = Object.freeze([
  "firstGuessFairness",
  "calibrationFun",
  "revealSatisfaction",
  "copyClarity",
  "freshness",
]);

const CORE_QUESTION_COUNT = 3;
const CORE_DIFFICULTY_BY_INDEX = [2, 3, 4];

const SOURCE = Object.freeze({
  usgsWater: source(
    "USGS Water Science School",
    "https://www.usgs.gov/special-topics/water-science-school/science/water-qa-how-much-water-does-average-person-use-home-day",
    "U.S. Geological Survey"
  ),
  usdaFood: source(
    "USDA FoodData Central",
    "https://fdc.nal.usda.gov/",
    "U.S. Department of Agriculture"
  ),
  nist: source(
    "NIST Handbook 44",
    "https://www.nist.gov/pml/owm/nist-handbook-44",
    "National Institute of Standards and Technology"
  ),
  nasa: source(
    "NASA Solar System Exploration",
    "https://science.nasa.gov/solar-system/",
    "NASA"
  ),
  britannicaScience: source(
    "Encyclopaedia Britannica Science Reference",
    "https://www.britannica.com/science",
    "Encyclopaedia Britannica"
  ),
  censusQuickFacts: source(
    "U.S. Census QuickFacts",
    "https://www.census.gov/quickfacts/",
    "U.S. Census Bureau"
  ),
  smithsonian: source(
    "Smithsonian Education",
    "https://www.si.edu/learn",
    "Smithsonian Institution"
  ),
  usMint: source(
    "U.S. Mint Coin Specifications",
    "https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications",
    "U.S. Mint"
  ),
  mlb: source(
    "MLB Official Baseball Basics",
    "https://www.mlb.com/official-information",
    "Major League Baseball"
  ),
  timesSquare: source(
    "Times Square Ball Facts",
    "https://timessquareball.net/times-square-ball-facts/",
    "Times Square Alliance"
  ),
  apta: source(
    "APTA Public Transportation Fact Book",
    "https://www.apta.com/research-technical-resources/transit-statistics/public-transportation-fact-book/",
    "American Public Transportation Association"
  ),
  parkTool: source(
    "Park Tool Repair Help",
    "https://www.parktool.com/en-us/blog/repair-help",
    "Park Tool"
  ),
  birdCast: source(
    "BirdCast Migration Dashboard",
    "https://birdcast.info/migration-tools/migration-dashboard/",
    "BirdCast"
  ),
});

const FALLBACK_SOURCE = SOURCE.britannicaScience;

const DATE_THEME_OVERRIDES = Object.freeze({
  "2026-01-04": "Snow Route Map",
  "2026-05-19": "Laundry Room",
  "2026-05-25": "Memorial Day Cookout",
  "2026-06-03": "Summer Trailhead",
  "2026-06-20": "Berry Patch",
  "2026-06-28": "National Park Postcard",
  "2026-03-21": "City Bus Garage",
  "2026-06-21": "Father's Day Gifts",
  "2026-08-14": "Resort Laundry Room",
});

const DOMAIN_PROFILES = [
  {
    key: "tailgate",
    pattern: /tailgate|cooler|road trip cooler|backyard grill/i,
    source: SOURCE.usdaFood,
    q1: item("cans", "fit in one game-day cooler", 72, "A big tailgate cooler can hold dozens of cans.", "capacity"),
    q2: item("pounds of ice", "can a row of tailgate coolers hold", 500, "A row of coolers can hold hundreds of pounds of ice.", "weight"),
    q3: item("fans", "can fill a major stadium tailgate lot", 50000, "A major tailgate lot can draw tens of thousands of fans.", "crowd", "famous_event"),
    extra: item("meals", "can a stadium district serve on a rivalry Saturday", 250000, "A rivalry Saturday can serve hundreds of thousands of meals.", "rate", "famous_event"),
  },
  {
    key: "train",
    pattern: /\btrain\b|\bamtrak\b|\bsnack car\b|\brail(?:road|way| system| station| platform| yard| map)\b|platform|station map|train yard|switches/i,
    source: SOURCE.apta,
    q1: item("station stops", "can appear on a busy rail-system wall map", 120, "A rail map can show more than 100 station stops.", "count"),
    q2: item("riders", "can pass through a major train station in one hour", 50000, "A major station can move tens of thousands of riders hourly.", "crowd"),
    q3: item("riders", "can a major rail station serve in one day", 750000, "A major rail station can serve hundreds of thousands daily.", "crowd", "famous_event"),
    extra: item("riders", "can a big-city rail system carry in one day", 3000000, "A big-city rail system can carry millions of riders daily.", "crowd", "famous_event"),
  },
  {
    key: "gift_wrap",
    pattern: /wrapp|gift wrap|stocking|stuffers/i,
    source: SOURCE.nist,
    q1: item("rolls of wrapping paper", "fit on a holiday gift-wrap table", 36, "A gift-wrap table can hold a few dozen rolls.", "capacity"),
    q2: item("feet of curling ribbon", "are on a standard ribbon spool", 500, "A standard curling-ribbon spool can hold hundreds of feet.", "distance", "named_standard"),
    q3: item("letters and packages", "can USPS handle during the holiday season", 2000000000, "USPS holiday mail can run into the billions.", "count", "famous_event"),
    extra: item("gift boxes", "can a national retailer ship in one peak week", 10000000, "A peak retail week can ship millions of gift boxes.", "count", "famous_event"),
  },
  {
    key: "service_kitchen",
    pattern: /service kitchen|community kitchen|soup kitchen/i,
    source: SOURCE.usdaFood,
    q1: item("sheet pans", "fit on one service-kitchen speed rack", 40, "A speed rack can hold dozens of sheet pans.", "capacity"),
    q2: item("meals", "can a community kitchen serve in one day", 1200, "A community kitchen can serve more than 1,000 meals.", "rate"),
    q3: item("pounds of food", "can a city food bank move in one week", 1000000, "A city food bank can move about a million pounds weekly.", "weight", "famous_event"),
    extra: item("meals", "can a national hunger-relief network serve in one day", 5000000, "A national relief network can serve millions of meals daily.", "rate", "famous_event"),
  },
  {
    key: "ice_cream",
    pattern: /ice cream|sundae/i,
    source: SOURCE.usdaFood,
    q1: item("ice-cream bars", "fit in one truck-window freezer", 360, "A truck freezer can hold hundreds of bars.", "capacity"),
    q2: item("scoops", "can a busy ice-cream truck serve in one hot day", 1050, "A busy truck can serve about 1,000 scoops.", "rate"),
    q3: item("gallons of ice cream", "do Americans eat in one year", 1300000000, "Americans eat ice cream at a billion-gallon scale.", "capacity", "famous_event"),
    extra: item("ice-cream sandwiches", "can be made in one U.S. factory year", 1000000000, "A major frozen-treat line can make billions yearly.", "count", "famous_event"),
  },
  {
    key: "candle_market",
    pattern: /candle/i,
    source: SOURCE.nist,
    q1: item("candles", "fit on a market-stall display table", 288, "A market table can hold hundreds of candles.", "capacity"),
    q2: item("pounds of wax", "can a busy candle workshop pour in one week", 2400, "A workshop can pour more than a ton of wax weekly.", "weight"),
    q3: item("candles", "can a major summer craft fair sell", 100000, "A big craft fair can sell six figures of candles.", "count", "famous_event"),
    extra: item("candles", "can a candle factory make in one holiday month", 250000, "A candle factory can make hundreds of thousands monthly.", "count", "famous_event"),
  },
  {
    key: "lighthouse",
    pattern: /lighthouse/i,
    source: SOURCE.smithsonian,
    q1: item("steps", "can climb a tall lighthouse tower", 200, "A tall lighthouse can have hundreds of steps.", "count"),
    q2: item("pounds", "can a large lighthouse lens weigh", 2000, "A large lighthouse lens can weigh thousands of pounds.", "weight"),
    q3: item("visitors", "can a landmark lighthouse welcome in one year", 500000, "A landmark lighthouse can welcome hundreds of thousands yearly.", "crowd", "famous_event"),
    extra: item("miles", "can a powerful lighthouse beam reach", 25, "A powerful lighthouse beam can reach dozens of miles.", "distance", "natural_scale"),
  },
  {
    key: "record_press",
    pattern: /record press|vinyl|record shop/i,
    source: SOURCE.smithsonian,
    q1: item("vinyl records", "fit in one packed record-store crate", 140, "A packed crate can hold about 140 records.", "capacity"),
    q2: item("records", "can a small pressing plant make in one day", 10000, "A small pressing plant can make thousands of records daily.", "rate"),
    q3: item("vinyl records", "can sell in the U.S. in one year", 50000000, "U.S. vinyl sales sit in the tens of millions yearly.", "count", "famous_event"),
    extra: item("records", "can a major pressing network make in one year", 100000000, "A large pressing network can make nine figures of records.", "count", "famous_event"),
  },
  {
    key: "record_store",
    pattern: /record store/i,
    source: SOURCE.smithsonian,
    q1: item("vinyl records", "fit in one packed record-store crate", 140, "A packed crate can hold about 140 records.", "capacity"),
    q2: item("turntables", "fit on one record-store display wall", 45, "A display wall can hold dozens of turntables.", "capacity"),
    q3: item("vinyl records", "can sell in the U.S. in one year", 50000000, "U.S. vinyl sales sit in the tens of millions yearly.", "count", "famous_event"),
    extra: item("records", "can a major pressing network make in one year", 100000000, "A large pressing network can make nine figures of records.", "count", "famous_event"),
  },
  {
    key: "classroom",
    pattern: /classroom|school shelf/i,
    source: SOURCE.smithsonian,
    q1: item("books", "fit on one full classroom cart", 145, "A full cart can carry about 145 books.", "capacity"),
    q2: item("pencils", "fit in one classroom supply tub", 1000, "A supply tub can hold about 1,000 pencils.", "capacity"),
    q3: item("students", "attend New York City public schools", 900000, "NYC public schools serve close to a million students.", "crowd", "famous_event"),
    extra: item("books", "are listed in the WorldCat library catalog", 500000000, "WorldCat lists hundreds of millions of books.", "count", "famous_event"),
  },
  {
    key: "game_night",
    pattern: /game night|board game|tabletop game/i,
    source: SOURCE.britannicaScience,
    q1: item("letter tiles", "are in a standard {scene} Scrabble set", 100, "A standard Scrabble set has 100 letter tiles.", "count"),
    q2: item("game boxes", "can fill one board-game cafe wall", 500, "A cafe wall can hold hundreds of game boxes.", "capacity"),
    q3: item("Monopoly sets", "can sell worldwide in one year", 3000000, "Monopoly can sell millions of sets worldwide.", "count", "famous_event"),
    extra: item("Uno decks", "can sell worldwide in one year", 15000000, "Uno can sell at a huge family-game scale.", "count", "famous_event"),
  },
  {
    key: "gift_drawer",
    pattern: /gift drawer/i,
    source: SOURCE.nist,
    q1: item("bows", "fit in a crowded gift drawer", 80, "A gift drawer can hold dozens of bows.", "capacity"),
    q2: item("gift cards", "fit on a checkout rack display", 420, "A checkout rack can hold hundreds of gift cards.", "capacity"),
    q3: item("toys", "can a big summer toy drive collect", 250000, "A big toy drive can collect hundreds of thousands of toys.", "count", "famous_event"),
    extra: item("letters", "can Operation Santa receive in a busy year", 100000, "Operation Santa can receive six figures of letters.", "count", "famous_event"),
  },
  {
    key: "boardwalk_arcade",
    pattern: /boardwalk arcade/i,
    source: SOURCE.britannicaScience,
    q1: item("tokens", "fit in a full boardwalk arcade cup", 160, "A full arcade cup can hold more than 100 tokens.", "capacity"),
    q2: item("prize tickets", "can a busy boardwalk arcade hand out in one day", 50000, "A busy arcade can hand out tens of thousands of prize tickets.", "count"),
    q3: item("visitors", "can the Atlantic City Boardwalk draw in one summer", 5000000, "Atlantic City's boardwalk can draw millions of summer visitors.", "crowd", "famous_event"),
    extra: item("prize tickets", "can a busy boardwalk arcade print in one summer", 10000000, "A busy arcade can print millions of prize tickets.", "count", "famous_event"),
  },
  {
    key: "toy_chest",
    pattern: /toy chest|toy brick|toy store|toy train|toy fair/i,
    source: SOURCE.britannicaScience,
    q1: item("toy bricks", "fit in a medium playroom storage tub", 1500, "A medium brick tub can hold about 1,500 toy bricks.", "capacity"),
    q2: item("toy cars", "fit in one shoebox parking lot", 75, "A shoebox can hold dozens of toy cars.", "capacity"),
    q3: item("Barbie dolls", "can sell worldwide in one year", 58000000, "Barbie can sell tens of millions of dolls yearly.", "count", "famous_event"),
    extra: item("LEGO minifigures", "have been made since 1978", 8000000000, "LEGO has made billions of minifigures.", "count", "famous_event"),
  },
  {
    key: "coffee_bar",
    pattern: /coffee|roaster/i,
    source: SOURCE.usdaFood,
    q1: item("coffee beans", "are in one pound of roasted coffee", 3000, "One pound of roasted coffee has about 3,000 beans.", "count"),
    q2: item("cups of coffee", "can a busy coffee bar pour in one morning", 1500, "A busy coffee bar can pour about 1,500 cups.", "rate"),
    q3: item("Starbucks stores", "are open worldwide", 40000, "Starbucks has tens of thousands of stores worldwide.", "count", "famous_event"),
    extra: item("pounds of coffee", "can the U.S. import in one year", 3000000000, "U.S. coffee imports are about 3 billion pounds yearly.", "count", "famous_event"),
  },
  {
    key: "garage_weekend",
    pattern: /garage weekend|garage project/i,
    source: SOURCE.nist,
    q1: item("screws", "fit in one garage-project organizer drawer", 500, "A small organizer drawer can hold hundreds of screws.", "capacity"),
    q2: item("feet", "are on a standard contractor cord reel", 100, "A contractor cord reel often holds about 100 feet.", "distance", "named_standard"),
    q3: item("visitors", "can a major home-improvement show draw", 100000, "A major home-improvement show can draw six figures of visitors.", "crowd", "famous_event"),
    extra: item("tool-rental orders", "does Home Depot handle in one busy season", 250000, "Home Depot tool rentals can reach hundreds of thousands.", "count", "famous_event"),
  },
  {
    key: "trailhead_map",
    pattern: /trailhead map|trailhead|hiking map/i,
    source: SOURCE.britannicaScience,
    q1: item("miles of trails", "does Yellowstone National Park maintain", 900, "Yellowstone maintains about 900 miles of trails.", "distance", "famous_event"),
    q2: item("hikers", "can pass a popular trailhead in one day", 3500, "A popular trailhead can see thousands of hikers daily.", "crowd"),
    q3: item("visitors", "can Great Smoky Mountains National Park welcome in one year", 13000000, "Great Smoky Mountains gets the most U.S. park visits.", "crowd", "famous_event"),
    extra: item("acres", "can Yellowstone National Park cover", 2200000, "Yellowstone covers more than two million acres.", "area", "natural_scale"),
  },
  {
    key: "clock_tower",
    pattern: /clock tower|clock\b|timer/i,
    source: SOURCE.smithsonian,
    q1: item("clock faces", "fit on one clock-repair wall", 170, "A repair wall can hold nearly 170 clock faces.", "capacity"),
    q2: item("watch batteries", "fit in one repair-shop counter tray", 850, "A repair tray can hold hundreds of watch batteries.", "capacity"),
    q3: item("visitors", "tour Big Ben and the UK Parliament in one year", 1000000, "Big Ben and Parliament can draw about a million visitors yearly.", "crowd", "famous_event"),
    extra: item("bell strikes", "can Big Ben ring in one year", 35000, "Big Ben rings tens of thousands of times a year.", "count", "famous_event"),
  },
  {
    key: "public_art",
    pattern: /mural|public art|street mural|gallery wall/i,
    source: SOURCE.smithsonian,
    q1: item("gallons of paint", "can cover a big street mural", 80, "A big mural can use dozens of gallons of paint.", "capacity"),
    q2: item("square feet", "can a landmark mural cover", 12000, "A landmark mural can cover thousands of square feet.", "area"),
    q3: item("visitors", "can a major public-art festival draw", 500000, "A major public-art festival can draw hundreds of thousands.", "crowd", "famous_event"),
    extra: item("artworks", "does Art Basel Miami Beach show", 4000, "Art Basel Miami Beach shows thousands of artworks.", "count", "famous_event"),
  },
  {
    key: "swim_meet",
    pattern: /swim meet|lap pool|public pool lanes/i,
    source: SOURCE.usgsWater,
    q1: item("kickboards", "fit in one swim-team storage cage", 96, "A swim-team cage can hold close to 100 kickboards.", "capacity"),
    q2: item("swimmers", "can compete in a big swim meet in one day", 800, "A big swim meet can put hundreds of swimmers in the water.", "crowd"),
    q3: item("spectators", "can fit in the Paris La Defense Arena for Olympic swimming", 15000, "The Paris Olympic swimming venue seated about 15,000 fans.", "crowd", "famous_event"),
    extra: item("people", "can watch Olympic swimming across a full Games", 100000000, "Olympic swimming can draw huge worldwide audiences.", "crowd", "famous_event"),
  },
  {
    key: "beach_day",
    pattern: /beach day|beach lifeguard|lifeguard tower|boardwalk beach/i,
    source: SOURCE.usgsWater,
    q1: item("umbrellas", "can line a busy beach-rental stand", 200, "A beach-rental stand can hold hundreds of umbrellas.", "capacity"),
    q2: item("beach chairs", "fit in one rental-stand stack", 600, "A rental-stand stack can hold hundreds of beach chairs.", "capacity"),
    q3: item("visitors", "can Coney Island draw in one summer", 5000000, "Coney Island can draw millions of summer visitors.", "crowd", "famous_event"),
    extra: item("visitors", "can a national seashore welcome in one year", 10000000, "A national seashore can welcome millions of visitors yearly.", "crowd", "famous_event"),
  },
  {
    key: "fishing_derby",
    pattern: /fishing derby|tackle box|fishing pier/i,
    source: SOURCE.britannicaScience,
    q1: item("lures", "fit in a packed tackle box", 140, "A packed tackle box can hold well over 100 lures.", "capacity"),
    q2: item("fish", "can cross a Bassmaster Classic weigh-in stage", 900, "A major bass weigh-in can count hundreds of fish.", "count"),
    q3: item("licensed anglers", "fish in the U.S. in one year", 57000000, "Tens of millions of Americans fish each year.", "crowd", "famous_event"),
    extra: item("pounds of fish", "can Alaska's salmon harvest land in one year", 700000000, "Alaska salmon harvests can reach hundreds of millions of pounds.", "weight", "famous_event"),
  },
  {
    key: "flower",
    pattern: /bouquet|flower|florist/i,
    source: SOURCE.usdaFood,
    q1: item("stems", "fit in one full florist bucket", 150, "A florist bucket can hold about 150 stems.", "capacity"),
    q2: item("bouquets", "can a busy flower stand sell in one day", 1000, "A busy flower stand can sell about 1,000 bouquets.", "rate"),
    q3: item("flowers", "can pass through the Dutch flower auction in one day", 30000000, "The Dutch flower auction can move tens of millions of flowers daily.", "count", "famous_event"),
    extra: item("roses", "can sell across the U.S. for Valentine's week", 250000000, "Valentine's week can move hundreds of millions of roses.", "count", "famous_event"),
  },
  {
    key: "farmers_market",
    pattern: /farmers market/i,
    source: SOURCE.usdaFood,
    q1: item("tomatoes", "fit in one farmers-market crate", 160, "A market crate can hold about 160 tomatoes.", "capacity"),
    q2: item("pounds of peaches", "fit on one farmers-market stall table", 900, "A market stall table can carry hundreds of pounds of fruit.", "weight"),
    q3: item("visitors", "can Seattle's Pike Place Market draw in one year", 10000000, "Pike Place Market can draw millions of visitors yearly.", "crowd", "famous_event"),
    extra: item("pounds of produce", "can a regional food hub sell in one year", 50000000, "A regional food hub can move tens of millions of pounds yearly.", "weight", "famous_event"),
  },
  {
    key: "cornfield",
    pattern: /cornfield|corn maze|cornfield row/i,
    source: SOURCE.usdaFood,
    q1: item("kernels", "grow on one good ear of corn", 800, "One good ear of corn can hold about 800 kernels.", "count"),
    q2: item("ears of corn", "fit in one farmers-market pickup load", 1200, "A market pickup load can carry more than 1,000 ears.", "capacity"),
    q3: item("bushels of corn", "can Iowa harvest in one year", 2500000000, "Iowa can harvest billions of bushels of corn.", "count", "famous_event"),
    extra: item("bushels of corn", "can the U.S. harvest in one year", 15000000000, "The U.S. corn harvest can total billions of bushels.", "count", "famous_event"),
  },
  {
    key: "aquarium",
    pattern: /aquarium|reef window|shark tunnel|deep-sea|touch tank|tank|tunnel/i,
    source: SOURCE.britannicaScience,
    q1: item("fish", "can fit in a large public aquarium exhibit", 1300, "A large exhibit can hold more than 1,000 fish.", "capacity"),
    q2: item("feet", "is Georgia Aquarium's Ocean Voyager tunnel", 100, "Ocean Voyager's tunnel is about 100 feet long.", "distance", "famous_event"),
    q3: item("visitors", "can the Georgia Aquarium welcome in one year", 2500000, "Georgia Aquarium can welcome about 2.5 million visitors yearly.", "crowd", "famous_event"),
    extra: item("gallons", "can Monterey Bay Aquarium pump through in one week", 14000000, "Monterey Bay pumps millions of gallons weekly.", "capacity", "famous_event"),
  },
  {
    key: "cider_press",
    pattern: /cider press|apple press/i,
    source: SOURCE.usdaFood,
    q1: item("apples", "fit in one orchard-store display crate", 125, "A display crate can hold roughly 125 medium apples.", "capacity"),
    q2: item("apples", "grow on a mature apple tree", 500, "A mature apple tree can grow hundreds of apples.", "count"),
    q3: item("pounds of apples", "can Washington harvest in one year", 7000000000, "Washington can harvest billions of pounds of apples.", "weight", "famous_event"),
    extra: item("apples", "can Washington harvest in one year", 20000000000, "Washington's apple harvest can reach tens of billions of apples.", "count", "famous_event"),
  },
  {
    key: "taco",
    pattern: /taco/i,
    source: SOURCE.usdaFood,
    q1: item("tortillas", "fit in one taco-stand warming drawer", 300, "A warming drawer can hold hundreds of tortillas.", "capacity"),
    q2: item("limes", "can a busy taco stand squeeze in one lunch rush", 900, "A busy taco stand can squeeze hundreds of limes at lunch.", "rate"),
    q3: item("tacos", "can Taco Bell sell in one year", 2000000000, "Taco Bell can sell billions of tacos yearly.", "count", "famous_event"),
    extra: item("tacos", "can a citywide taco festival serve in one week", 1000000, "A citywide taco week can serve about a million tacos.", "count", "famous_event"),
  },
  {
    key: "pizza_night",
    pattern: /pizza night|pizza party/i,
    source: SOURCE.usdaFood,
    q1: item("pepperoni slices", "can cover one extra-large pepperoni pizza", 96, "An extra-large pepperoni pizza can use around 96 slices.", "count"),
    q2: item("pizza boxes", "can stack during a busy shop dinner rush", 700, "A busy pizza shop can stack hundreds of boxes.", "count"),
    q3: item("pizza slices", "can a stadium concession sell in one game day", 96000, "A stadium can sell nearly six figures of pizza slices.", "count", "famous_event"),
    extra: item("pizzas", "can a citywide game night deliver", 150000, "A citywide game night can push pizza deliveries into six figures.", "count", "famous_event"),
  },
  {
    key: "movie_theater",
    pattern: /movie theater|movie lobby|movie palace|multiplex|drive-in/i,
    source: SOURCE.smithsonian,
    q1: item("seats", "fill one midsize movie theater auditorium", 220, "A midsize auditorium can seat more than 200 people.", "capacity"),
    q2: item("popcorn kernels", "fit in one large movie-theater tub", 650, "A large popcorn tub can hold hundreds of kernels.", "capacity"),
    q3: item("tickets", "did Avengers: Endgame sell on opening weekend worldwide", 80000000, "Avengers: Endgame sold tickets at a huge opening-weekend scale.", "count", "famous_event"),
    extra: item("tickets", "can a record-setting movie sell worldwide", 100000000, "A record-setting movie can sell hundreds of millions of tickets.", "count", "famous_event"),
  },
  {
    key: "bee_yard",
    pattern: /bee yard|bee/i,
    source: SOURCE.britannicaScience,
    q1: item("bees", "can live in one backyard hive", 50000, "A healthy hive can hold tens of thousands of bees.", "capacity"),
    q2: item("pounds of honey", "can a strong hive make in one season", 60, "A strong hive can make dozens of pounds of honey.", "weight"),
    q3: item("pounds of honey", "can U.S. beekeepers produce in one year", 150000000, "U.S. beekeepers can produce hundreds of millions of pounds.", "weight", "famous_event"),
    extra: item("bees", "can work across California almond pollination", 30000000000, "Almond bloom can use tens of billions of bees.", "count", "famous_event"),
  },
  {
    key: "juneteenth",
    pattern: /juneteenth/i,
    source: SOURCE.smithsonian,
    q1: item("strawberry sodas", "can chill in a block-party cooler", 260, "A cooler can hold hundreds of red celebration drinks.", "capacity"),
    q2: item("ice pops", "can a festival freezer hand out", 1400, "A festival freezer can hand out more than 1,000 ice pops.", "count"),
    q3: item("people", "can a major Juneteenth celebration draw", 100000, "A major Juneteenth celebration can draw six figures of visitors.", "crowd", "famous_event"),
    extra: item("people", "can attend a major city Juneteenth weekend", 1000000, "A major city Juneteenth weekend can draw about a million visits.", "crowd", "famous_event"),
  },
  {
    key: "skate_park",
    pattern: /skate park|halfpipe/i,
    source: SOURCE.mlb,
    q1: item("skateboards", "can line one skate-park fence", 90, "A skate-park fence can hold dozens of boards.", "capacity"),
    q2: item("feet", "is an Olympic halfpipe from end to end", 600, "An Olympic halfpipe is hundreds of feet long.", "distance", "named_standard"),
    q3: item("skateboards", "are sold in the U.S. in one year", 2000000, "U.S. skateboard sales are about 2 million yearly.", "count", "famous_event"),
    extra: item("video views", "can Tony Hawk's famous trick clips draw", 10000000, "A famous Tony Hawk clip can draw millions of views.", "crowd", "famous_event"),
  },
  {
    key: "dairy_barn",
    pattern: /dairy barn|milking parlor|milk house/i,
    source: SOURCE.usdaFood,
    q1: item("milk cartons", "fit in one cafeteria milk crate", 48, "A cafeteria crate can hold about 48 milk cartons.", "capacity"),
    q2: item("cows", "can a modern milking parlor milk in one day", 1500, "A large parlor can milk more than 1,000 cows daily.", "rate"),
    q3: item("dairy cows", "live on Wisconsin farms", 1200000, "Wisconsin has about 1.2 million dairy cows.", "count", "famous_event"),
    extra: item("gallons of milk", "can U.S. dairy farms produce in one day", 60000000, "U.S. dairy farms produce tens of millions of gallons daily.", "capacity", "famous_event"),
  },
  {
    key: "breakfast_counter",
    pattern: /breakfast counter|diner griddle|pancake/i,
    source: SOURCE.usdaFood,
    q1: item("pancakes", "can cook at once on a diner griddle", 48, "A full griddle can cook about 48 pancakes.", "capacity"),
    q2: item("cups of coffee", "can a diner morning rush pour", 960, "A breakfast rush can pour close to a thousand cups.", "rate"),
    q3: item("Waffle House restaurants", "are open across the U.S.", 2000, "Waffle House has roughly 2,000 U.S. restaurants.", "count", "famous_event"),
    extra: item("eggs", "does Waffle House use in one year", 272000000, "Waffle House uses hundreds of millions of eggs yearly.", "count", "famous_event"),
  },
  {
    key: "photo_booth",
    pattern: /photo booth/i,
    source: SOURCE.smithsonian,
    q1: item("photos", "are on a common disposable camera roll", 27, "A disposable camera roll usually has 27 photos.", "count"),
    q2: item("photos", "can a busy booth print in one festival day", 3000, "A busy photo booth can print thousands of photos.", "rate"),
    q3: item("prints and photographs", "are in the Library of Congress collection", 15000000, "The Library of Congress collection holds millions of items.", "count", "famous_event"),
    extra: item("photos", "can a global image archive add in one day", 10000000, "A global photo archive can add millions of images daily.", "count", "famous_event"),
  },
  {
    key: "airport",
    pattern: /airport|baggage|gate queue|gate\b/i,
    source: SOURCE.apta,
    q1: item("suitcases", "can fit on one baggage carousel", 180, "A baggage carousel can carry hundreds of suitcases.", "capacity"),
    q2: item("seats", "are on a typical Boeing narrow-body jet", 162, "A Boeing 737-style jet seats around 162 passengers.", "count", "named_standard"),
    q3: item("passengers", "does Hartsfield-Jackson Atlanta airport serve in one day", 250000, "Atlanta's airport can serve about 250,000 passengers daily.", "famous_macro", "crowd"),
    extra: item("bags", "does Denver International Airport handle in one day", 500000, "A giant airport can handle hundreds of thousands of bags.", "famous_macro", "count"),
  },
  {
    key: "photo",
    pattern: /camera|photo|photo booth|lens lab/i,
    source: SOURCE.smithsonian,
    q1: item("photos", "are on a common disposable camera roll", 27, "A disposable camera roll usually has 27 photos.", "count"),
    q2: item("photos", "can a busy booth print in one festival day", 3000, "A busy photo booth can print thousands of photos.", "rate"),
    q3: item("photos", "can a major museum archive hold", 2000000, "A major photo archive can hold millions of images.", "famous_macro", "count"),
    extra: item("photos", "can a global image archive add in one day", 10000000, "A global photo archive can add millions of images daily.", "famous_macro", "count"),
  },
  {
    key: "book",
    pattern: /library|libraries|book|bookstore|comic|used book/i,
    source: SOURCE.smithsonian,
    q1: item("books", "fit on one full library cart", 140, "A full library cart can carry about 140 books.", "capacity"),
    q2: item("books", "can a busy branch library check out in one day", 4200, "A busy branch can check out thousands of books daily.", "rate"),
    q3: item("books", "are in the Library of Congress collections", 39000000, "The Library of Congress holds tens of millions of books.", "famous_macro", "count"),
    extra: item("library records", "can WorldCat connect across libraries", 500000000, "WorldCat connects hundreds of millions of library records.", "famous_macro", "count"),
  },
  {
    key: "postcard",
    pattern: /postcard|souvenir postcard/i,
    source: SOURCE.apta,
    q1: item("postcards", "fit on one souvenir rack", 480, "A postcard rack can hold hundreds of cards.", "capacity"),
    q2: item("square inches", "does a standard postcard cover", 24, "A standard postcard covers about 24 square inches.", "area"),
    q3: item("postcards", "can Statue of Liberty gift shops sell in one season", 250000, "A landmark gift shop can sell hundreds of thousands of postcards.", "famous_macro", "count"),
    extra: item("postcards", "can National Park Service stores sell in one year", 1000000, "Park stores can sell postcard totals in the millions.", "famous_macro", "count"),
  },
  {
    key: "sushi",
    pattern: /sushi/i,
    source: SOURCE.usdaFood,
    q1: item("sushi pieces", "fit on one full conveyor loop", 360, "A conveyor loop can carry hundreds of sushi pieces.", "capacity"),
    q2: item("rolls", "can a busy sushi counter make in one day", 1200, "A busy sushi counter can make more than 1,000 rolls.", "rate"),
    q3: item("sushi pieces", "can Japan's Sushi Festival serve in one weekend", 100000, "A sushi festival can serve six figures of pieces.", "famous_macro", "count"),
    extra: item("plates", "can Kura Sushi restaurants serve in one day", 1000000, "A big conveyor-sushi chain can serve millions of plates.", "famous_macro", "rate"),
  },
  {
    key: "window_washer",
    pattern: /window washer|window washer rig/i,
    source: SOURCE.nist,
    q1: item("squeegees", "fit on one window-washer rig", 60, "A window-washer rig can carry dozens of squeegees.", "capacity"),
    q2: item("gallons of cleaning water", "can a tower crew use in one day", 500, "A tower crew can use hundreds of gallons of water.", "capacity"),
    q3: item("windows", "can a skyscraper washing crew clean in one month", 50000, "A skyscraper crew can clean tens of thousands of windows.", "famous_macro", "count"),
    extra: item("square feet of glass", "can a landmark tower crew clean in one season", 1000000, "A landmark tower can have about a million square feet of glass.", "famous_macro", "area"),
  },
  {
    key: "garden_hose",
    pattern: /garden hose|hose reel/i,
    source: SOURCE.usgsWater,
    q1: item("feet of hose", "wrap around one backyard reel", 100, "A backyard hose reel often holds about 100 feet of hose.", "distance"),
    q2: item("gallons", "can flow through a garden hose in one hour", 600, "A garden hose can move hundreds of gallons in an hour.", "capacity"),
    q3: item("gallons", "can a city water tower hold", 1000000, "A city water tower can hold about a million gallons.", "capacity", "famous_event"),
    extra: item("gallons", "can a large reservoir release in one day", 10000000, "A large reservoir release can top eight figures of gallons.", "capacity", "natural_scale"),
  },
  {
    key: "pet",
    pattern: /pet shelter|dog|kennel|fetch|groomer|dog park|dog agility/i,
    source: SOURCE.britannicaScience,
    q1: item("leashes", "hang on one full dog-shelter wall", 230, "A shelter wall can hold hundreds of leashes.", "capacity"),
    q2: item("pounds of dog food", "can a large shelter use in one week", 2400, "A large shelter can use more than a ton of food weekly.", "weight"),
    q3: item("dogs", "are adopted from U.S. shelters in one year", 2000000, "U.S. shelters place dogs at a million-plus scale.", "famous_macro", "count"),
    extra: item("pets", "can Clear the Shelters adoptions place in one campaign", 150000, "Clear the Shelters can place six figures of pets.", "famous_macro", "count"),
  },
  {
    key: "bee",
    pattern: /bee/i,
    source: SOURCE.britannicaScience,
    q1: item("bees", "can live in one backyard hive", 50000, "A healthy hive can hold tens of thousands of bees.", "capacity"),
    q2: item("flower visits", "can one strong hive make in a day", 1000000, "A strong hive can make about a million flower visits daily.", "rate"),
    q3: item("bees", "can pollinate a large almond orchard", 1000000000, "A large orchard bloom can use billions of bees.", "famous_macro", "count"),
    extra: item("pounds of honey", "can U.S. beekeepers produce in one year", 150000000, "U.S. beekeepers can produce hundreds of millions of pounds.", "famous_macro", "weight"),
  },
  {
    key: "butterfly",
    pattern: /butterfly/i,
    source: SOURCE.britannicaScience,
    q1: item("butterflies", "can fly in one conservatory room", 2000, "A conservatory room can hold thousands of butterflies.", "capacity"),
    q2: item("wingbeats", "can fill one butterfly release minute", 60000, "A butterfly release can make tens of thousands of wingbeats.", "rate"),
    q3: item("monarchs", "can gather in a major wintering forest", 10000000, "A major monarch forest can hold millions of butterflies.", "famous_macro", "count"),
    extra: item("miles", "can monarch butterflies migrate in one season", 3000, "Monarchs can migrate thousands of miles.", "famous_macro", "distance"),
  },
  {
    key: "zoo",
    pattern: /zoo|animal feeding|zoo feeding/i,
    source: SOURCE.britannicaScience,
    q1: item("pounds of animal food", "can a zoo kitchen prep in one day", 2400, "A zoo kitchen can prep more than a ton of food daily.", "weight"),
    q2: item("animals", "can a large zoo care for", 6000, "A large zoo can care for thousands of animals.", "count"),
    q3: item("visitors", "can the San Diego Zoo welcome in one year", 4000000, "San Diego Zoo can welcome millions of visitors yearly.", "famous_macro", "crowd"),
    extra: item("meals", "can a large zoo serve its animals in one year", 5000000, "A large zoo can serve millions of animal meals yearly.", "famous_macro", "rate"),
  },
  {
    key: "baseball",
    pattern: /baseball|bullpen|dugout|bat rack|bat\b|ballfield/i,
    source: SOURCE.mlb,
    q1: item("baseballs", "fit in one bullpen ball bucket", 132, "A bullpen bucket can hold around 132 baseballs.", "capacity"),
    q2: item("stitches", "are on one Major League baseball", 108, "A Major League baseball has 108 red stitches.", "count", "iconic_object", true),
    q3: item("fans", "can Dodger Stadium hold", 56000, "Dodger Stadium can hold more than 50,000 fans.", "famous_macro", "crowd"),
    extra: item("baseballs", "can MLB use in one regular season", 900000, "MLB can use close to a million baseballs each season.", "famous_macro", "count"),
  },
  {
    key: "bowling",
    pattern: /bowling/i,
    source: SOURCE.mlb,
    q1: item("bowling balls", "fit on one full house-ball wall", 360, "A house-ball wall can hold hundreds of balls.", "capacity"),
    q2: item("pairs of shoes", "fit behind one bowling-alley rental counter", 1100, "A rental counter can hold more than 1,000 pairs of shoes.", "capacity"),
    q3: item("people", "go bowling in the U.S. in one year", 67000000, "Tens of millions of Americans bowl each year.", "famous_macro", "crowd"),
    extra: item("games", "can U.S. bowling centers host in one year", 500000000, "U.S. bowling centers can host hundreds of millions of games.", "famous_macro", "count"),
  },
  {
    key: "golf",
    pattern: /golf|mini golf/i,
    source: SOURCE.mlb,
    q1: item("golf balls", "fit in one driving-range hopper", 300, "A range hopper can hold hundreds of golf balls.", "capacity"),
    q2: item("putts", "can a busy mini-golf course see in one day", 12000, "A busy mini-golf course can see thousands of putts.", "rate"),
    q3: item("spectators", "can a major golf tournament draw in one week", 200000, "A major golf tournament can draw hundreds of thousands.", "famous_macro", "crowd"),
    extra: item("golf balls", "can a big driving range hit in one summer", 1000000, "A big driving range can hit about a million balls.", "famous_macro", "count"),
  },
  {
    key: "basketball",
    pattern: /basketball/i,
    source: SOURCE.mlb,
    q1: item("basketballs", "fit on one full gym rack", 40, "A gym rack can hold dozens of basketballs.", "capacity"),
    q2: item("shots", "can a tournament gym take in one day", 12000, "A tournament gym can see thousands of shots.", "rate"),
    q3: item("fans", "can a major basketball arena hold", 20000, "A major basketball arena can hold about 20,000 fans.", "famous_macro", "crowd"),
    extra: item("shots", "can March Madness teams take in one tournament", 50000, "A huge tournament can stack tens of thousands of shots.", "famous_macro", "count"),
  },
  {
    key: "hockey",
    pattern: /hockey/i,
    source: SOURCE.mlb,
    q1: item("pucks", "fit in one full hockey bench bucket", 160, "A puck bucket can hold more than 100 pucks.", "capacity"),
    q2: item("shots", "can a busy hockey tournament take in one day", 3000, "A hockey tournament can take thousands of shots.", "rate"),
    q3: item("fans", "can a major hockey arena hold", 18000, "A major hockey arena can hold tens of thousands of fans.", "famous_macro", "crowd"),
    extra: item("pounds of ice", "can cover a full hockey rink", 100000, "A rink sheet can weigh about 100,000 pounds.", "famous_macro", "weight"),
  },
  {
    key: "tennis",
    pattern: /tennis/i,
    source: SOURCE.mlb,
    q1: item("tennis balls", "fit in one teaching cart", 325, "A teaching cart can hold hundreds of tennis balls.", "capacity"),
    q2: item("serves", "can a tournament court see in one day", 3000, "A tournament court can see thousands of serves.", "rate"),
    q3: item("fans", "can a major tennis stadium hold", 24000, "A major tennis stadium can hold tens of thousands.", "famous_macro", "crowd"),
    extra: item("balls", "can a Grand Slam tournament use", 70000, "A Grand Slam can use tens of thousands of tennis balls.", "famous_macro", "count"),
  },
  {
    key: "skate",
    pattern: /skate|roller|rink|halfpipe/i,
    source: SOURCE.mlb,
    q1: item("pairs of skates", "fit on one rental wall", 300, "A rental wall can hold hundreds of skate pairs.", "capacity"),
    q2: item("laps", "can a busy rink see in one night", 12000, "A busy rink can see thousands of laps.", "rate"),
    q3: item("spectators", "can a major skate event draw", 25000, "A major skate event can draw tens of thousands.", "famous_macro", "crowd"),
    extra: item("runs", "can a major halfpipe contest log in one week", 50000, "A major contest can log tens of thousands of runs.", "famous_macro", "rate"),
  },
  {
    key: "trail_nature",
    pattern: /trail|trailhead|canyon|hike|redwood|leaf|firefly|kite|campfire|smores|national park|forest|grove|rake/i,
    source: SOURCE.britannicaScience,
    q1: item("feet", "can a mature redwood stand tall", 350, "A mature redwood can stand hundreds of feet tall.", "distance"),
    q2: item("visitors", "can a popular trailhead see in one day", 5000, "A popular trailhead can see thousands of visitors.", "crowd"),
    q3: item("visitors", "can Great Smoky Mountains National Park welcome in one year", 13000000, "Great Smoky Mountains can welcome tens of millions yearly.", "famous_macro", "crowd"),
    extra: item("acres", "can Yellowstone National Park cover", 2200000, "Yellowstone covers more than two million acres.", "famous_macro", "area"),
  },
  {
    key: "crosswalk",
    pattern: /crosswalk/i,
    source: SOURCE.censusQuickFacts,
    q1: item("pedestrians", "can cross a busy downtown crosswalk in one hour", 1200, "A busy downtown crosswalk can move more than 1,000 people hourly.", "crowd"),
    q2: item("walking steps", "can hit one famous crosswalk in a day", 50000, "A famous crosswalk can collect tens of thousands of steps daily.", "rate"),
    q3: item("people", "can pass through Times Square on a crowded day", 350000, "Times Square can move hundreds of thousands of people daily.", "famous_macro", "crowd"),
    extra: item("people", "can cross Shibuya Crossing on its busiest days", 500000, "Shibuya Crossing can move huge crowds on peak days.", "famous_macro", "crowd"),
  },
  {
    key: "light_show",
    pattern: /light show|lantern|holiday market|light walk|stage crew light|cul-de-sac light|las vegas sphere|sphere screen/i,
    source: SOURCE.smithsonian,
    q1: item("bulbs", "glow on a neighborhood light-show house", 1800, "A small stage wall can use around 1,800 bulbs.", "count"),
    q2: item("feet tall", "is the Las Vegas Sphere", 366, "The Las Vegas Sphere is about 366 feet tall.", "distance", "famous_event"),
    q3: item("LED lights", "cover the Las Vegas Sphere exterior", 1200000, "The Las Vegas Sphere uses about 1.2 million exterior lights.", "famous_macro", "count", "famous_event"),
    extra: item("LEDs", "glow across the Las Vegas Sphere exterior", 48000000, "The Sphere exterior uses tens of millions of LEDs.", "famous_macro", "count", "famous_event"),
  },
  {
    key: "cleanup",
    pattern: /earth day cleanup|cleanup/i,
    source: SOURCE.smithsonian,
    q1: item("trash bags", "fit at one park cleanup station", 300, "A cleanup station can hand out hundreds of bags.", "capacity"),
    q2: item("pounds of litter", "can a city cleanup crew collect in one day", 2400, "A city cleanup can collect more than a ton of litter.", "weight"),
    q3: item("volunteers", "can join a national cleanup day", 1000000, "A national cleanup day can draw about a million volunteers.", "famous_macro", "crowd"),
    extra: item("pounds of trash", "can a national cleanup remove in one day", 10000000, "A national cleanup can remove millions of pounds.", "famous_macro", "weight"),
  },
  {
    key: "camp",
    pattern: /summer camp/i,
    source: SOURCE.censusQuickFacts,
    q1: item("campers", "fit in one big summer-camp dining hall", 250, "A big camp dining hall can seat hundreds of campers.", "capacity"),
    q2: item("life jackets", "fit on a camp boathouse rack wall", 300, "A boathouse wall can hold hundreds of life jackets.", "capacity"),
    q3: item("campers", "can attend summer camp across the U.S. in one season", 26000000, "U.S. summer camps serve tens of millions of campers.", "famous_macro", "crowd"),
    extra: item("campfire songs", "can echo across a national camp season", 250000, "A national camp season can stack hundreds of thousands of songs.", "famous_macro", "count"),
  },
  {
    key: "fairground",
    pattern: /fairground|state fair|county fair|festival/i,
    source: SOURCE.smithsonian,
    q1: item("seats", "fit in one fairground show-ring bleacher section", 800, "A show-ring bleacher section can seat hundreds.", "capacity"),
    q2: item("animals", "can fill a county fair barn", 1200, "A county fair barn can hold more than 1,000 animals.", "capacity"),
    q3: item("visitors", "can the Minnesota State Fair draw in one season", 2000000, "The Minnesota State Fair draws millions of visitors.", "famous_macro", "crowd"),
    extra: item("corn dogs", "can a big state fair sell in one season", 500000, "A big state fair can sell hundreds of thousands of corn dogs.", "famous_macro", "count"),
  },
  {
    key: "health",
    pattern: /blood drive|health fair|hospital supply/i,
    source: SOURCE.censusQuickFacts,
    q1: item("donor chairs", "fit in one community blood drive room", 48, "A community blood drive room can hold dozens of donor chairs.", "capacity"),
    q2: item("donors", "can a busy regional blood drive see in one day", 600, "A busy regional drive can see hundreds of donors.", "crowd"),
    q3: item("pints of blood", "do U.S. hospitals need in one day", 29000, "U.S. hospitals need tens of thousands of pints daily.", "famous_macro", "capacity"),
    extra: item("people", "can a Remote Area Medical clinic screen in one weekend", 50000, "A large free clinic can screen tens of thousands.", "famous_macro", "crowd"),
  },
  {
    key: "prank",
    pattern: /prank/i,
    source: SOURCE.smithsonian,
    q1: item("sticky notes", "can cover one office prank wall", 1200, "An office prank wall can take more than 1,000 sticky notes.", "count"),
    q2: item("rubber chickens", "can fill a novelty-shop pallet", 3000, "A novelty pallet can hold thousands of gag props.", "capacity"),
    q3: item("views", "can a famous April Fools brand prank get online", 10000000, "A viral April Fools prank can get millions of views.", "famous_macro", "crowd"),
    extra: item("joke products", "can a big novelty warehouse ship in April", 250000, "A novelty warehouse can ship hundreds of thousands of gag items.", "famous_macro", "count"),
  },
  {
    key: "weather",
    pattern: /weather|storm|thunderstorm|storm prep|stormy|storm drain|sprinkler/i,
    source: SOURCE.usgsWater,
    q1: item("gallons", "does a standard home rain barrel hold", 55, "A standard home rain barrel holds about 55 gallons.", "capacity"),
    q2: item("gallons", "can fill a standard backyard hot tub", 400, "A backyard hot tub often holds hundreds of gallons.", "capacity"),
    q3: item("lightning strikes", "can hit Earth in one day", 8000000, "Earth gets millions of lightning strikes each day.", "famous_macro", "count"),
    extra: item("gallons of water", "does Niagara Falls send over in one minute", 45000000, "Niagara Falls sends tens of millions of gallons per minute.", "famous_macro", "capacity"),
  },
  {
    key: "school_bus",
    pattern: /school bus|bus wash|yellow bus/i,
    source: SOURCE.apta,
    q1: item("students", "fit on one full-size school bus", 72, "A full-size school bus often seats about 72 students.", "capacity"),
    q2: item("tires", "sit in a full school-bus maintenance yard", 720, "A bus yard can put hundreds of big tires in view.", "count"),
    q3: item("students", "can a large school district bus in one morning", 100000, "A large district can bus six figures of students daily.", "famous_macro", "crowd"),
    extra: item("miles", "can a large district's buses drive in one school year", 10000000, "A big school-bus fleet can drive millions of miles yearly.", "famous_macro", "distance"),
  },
  {
    key: "science",
    pattern: /science lab|science fair|circuit|robotics lab|robot club|robotics workbench/i,
    source: SOURCE.smithsonian,
    q1: item("test tubes", "fit in a classroom lab rack set", 240, "A classroom lab rack set can hold hundreds of test tubes.", "capacity"),
    q2: item("feet of wire", "can a science-fair robotics table use", 1200, "A robotics table can hide more than 1,000 feet of wire.", "distance"),
    q3: item("visitors", "can Chicago's Museum of Science and Industry welcome in one year", 5000000, "A big science museum can welcome millions yearly.", "famous_macro", "crowd"),
    extra: item("objects", "can the Smithsonian science collections hold", 150000000, "Smithsonian science collections hold hundreds of millions.", "famous_macro", "count"),
  },
  {
    key: "parade",
    pattern: /parade|mardi gras|bead truck|balloons|confetti|flag box|patriotic flag|arlington memorial flags|memorial flags/i,
    source: SOURCE.smithsonian,
    q1: item("bead necklaces", "fit in one parade throw bag", 720, "A throw bag can hold hundreds of bead necklaces.", "capacity"),
    q2: item("feet of route", "can separate the first and last parade float", 5280, "A long parade can stretch about a mile from front to back.", "distance"),
    q3: item("spectators", "can the Macy's Thanksgiving Day Parade draw", 1000000, "Macy's parade can draw about a million curbside spectators.", "famous_macro", "crowd"),
    extra: item("throws", "can a Mardi Gras krewe toss in a big parade", 500000, "A big krewe can toss hundreds of thousands of parade throws.", "famous_macro", "count"),
  },
  {
    key: "candy",
    pattern: /candy|valentine|halloween|candy bowl|candy jar/i,
    source: SOURCE.usdaFood,
    q1: item("jelly beans", "fit in one candy-counter jar", 950, "A candy jar can hold hundreds of jelly beans.", "capacity"),
    q2: item("wrapped candies", "fit in a big party bowl", 1400, "A big candy bowl can hold around 1,400 pieces.", "capacity"),
    q3: item("M&M's", "can be made in one day", 400000000, "M&M's production runs in the hundreds of millions daily.", "famous_macro", "count"),
    extra: item("Reese's cups", "can be made in one year", 8000000000, "Reese's can be produced by the billions each year.", "famous_macro", "count"),
  },
  {
    key: "snowplay",
    pattern: /sled|sledding|snow day|snow globe|snow fort|ice rink|ski lodge|ski rental/i,
    source: SOURCE.usgsWater,
    q1: item("trail maps", "fit in one summer trailhead dispenser", 450, "A trailhead dispenser can hold hundreds of folded maps.", "capacity"),
    q2: item("hikers", "can pass a popular trailhead in one day", 3500, "A popular trailhead can see thousands of hikers daily.", "crowd"),
    q3: item("skiable acres", "does Vail Mountain cover", 5300, "Vail covers more than 5,000 skiable acres.", "famous_macro", "area"),
    extra: item("visitors", "can Great Smoky Mountains National Park welcome in one year", 13000000, "Great Smoky Mountains gets the most U.S. park visits.", "famous_macro", "crowd"),
  },
  {
    key: "dairy",
    pattern: /dairy|milking|milk house/i,
    source: SOURCE.usdaFood,
    q1: item("pounds of milk", "fit in one full dairy milk can", 86, "A full ten-gallon milk can weighs about 86 pounds.", "weight"),
    q2: item("cows", "can a modern milking parlor milk in one day", 1500, "A large parlor can milk more than 1,000 cows daily.", "rate"),
    q3: item("gallons of milk", "can U.S. dairy farms produce in one day", 60000000, "U.S. dairy farms produce tens of millions of gallons daily.", "famous_macro", "capacity"),
    extra: item("gallons of milk", "can U.S. farms produce in one day", 60000000, "U.S. dairy farms can produce tens of millions of gallons daily.", "famous_macro", "capacity"),
  },
  {
    key: "canoe",
    pattern: /canoe|kayak|paddle|boat ramp|harbor/i,
    source: SOURCE.britannicaScience,
    q1: item("life jackets", "hang on a full canoe-rental dock wall", 240, "A rental dock wall can hold hundreds of life jackets.", "capacity"),
    q2: item("paddle strokes", "can cross a busy lake morning", 12000, "A busy paddle morning can stack thousands of strokes.", "rate"),
    q3: item("visitors", "can a national river recreation area welcome in one year", 1000000, "A major river area can welcome about a million visitors.", "famous_macro", "crowd"),
    extra: item("paddle strokes", "can a canoe outfitter log in one summer", 2000000, "A canoe outfitter can log millions of paddle strokes.", "famous_macro", "rate"),
  },
  {
    key: "ferry",
    pattern: /ferry/i,
    source: SOURCE.apta,
    q1: item("passengers", "fit on one commuter ferry", 200, "A commuter ferry can carry hundreds of passengers.", "capacity"),
    q2: item("cars", "fit on a large vehicle ferry", 600, "A large vehicle ferry can carry hundreds of cars.", "capacity"),
    q3: item("riders", "can a famous city ferry carry in one day", 70000, "A famous city ferry can carry tens of thousands daily.", "famous_macro", "crowd"),
    extra: item("riders", "can a famous ferry system carry in one year", 20000000, "A major ferry system can carry millions of riders yearly.", "famous_macro", "crowd"),
  },
  {
    key: "kitchen_drawer",
    pattern: /kitchen drawer/i,
    source: SOURCE.nist,
    q1: item("utensils", "fit in a crowded kitchen drawer", 80, "A packed kitchen drawer can hold dozens of utensils.", "capacity"),
    q2: item("rubber bands", "fit in one junk-drawer jar", 500, "A junk-drawer jar can hide hundreds of rubber bands.", "capacity"),
    q3: item("meals", "can a large community kitchen serve in one day", 50000, "A large community kitchen can serve tens of thousands of meals.", "famous_macro", "rate"),
    extra: item("pounds of food", "can a city food bank move in one week", 1000000, "A city food bank can move about a million pounds weekly.", "famous_macro", "weight"),
  },
  {
    key: "breakfast",
    pattern: /diner|breakfast|pancake|griddle|kitchen timer|roadside diner|waffle house/i,
    source: SOURCE.usdaFood,
    q1: item("pancakes", "can cook at once on a full {scene} griddle", 48, "A full griddle can cook about four dozen pancakes.", "capacity"),
    q2: item("cups of coffee", "can a busy {scene} morning pour", 960, "A breakfast rush can pour close to a thousand cups.", "rate"),
    q3: item("Waffle House restaurants", "are open across the U.S.", 2000, "Waffle House has roughly 2,000 U.S. restaurants.", "famous_macro", "count"),
    extra: item("eggs", "does Waffle House use in one year", 272000000, "Waffle House uses hundreds of millions of eggs yearly.", "famous_macro", "count"),
  },
  {
    key: "pizza",
    pattern: /pizza/i,
    source: SOURCE.usdaFood,
    q1: item("pepperoni slices", "go on one full {scene} party order", 2400, "A party order can use thousands of pepperoni slices.", "count"),
    q2: item("pizza boxes", "can stack up during a {scene} dinner rush", 3600, "A pizza rush can stack thousands of boxes.", "count"),
    q3: item("pizza slices", "can Yankee Stadium sell on a sold-out game day", 96000, "A sold-out stadium day can move about 96,000 pizza slices.", "famous_macro", "count"),
    extra: item("pizzas", "can New York City deliver on Super Bowl Sunday", 150000, "A Super Bowl city can deliver six figures of pizzas.", "famous_macro", "count"),
  },
  {
    key: "coffee",
    pattern: /coffee|roaster/i,
    source: SOURCE.usdaFood,
    q1: item("beans", "fit in one pound of roasted coffee at {theScene}", 3200, "A one-pound bag holds roughly a few thousand beans.", "count"),
    q2: item("cups of coffee", "can a busy {scene} morning line pour", 12000, "A busy cafe morning can pour more than 10,000 cups.", "rate"),
    q3: item("cups of coffee", "can a city cafe chain sell in one {scene} morning", 50000, "A city cafe chain can pour tens of thousands of cups.", "famous_macro", "rate"),
    extra: item("coffee beans", "can a {scene} roasting batch hold", 240000, "A small roasting batch can hold hundreds of thousands of beans.", "famous_macro", "count"),
  },
  {
    key: "food_service",
    pattern: /taco|sushi|noodle|bagel|donut|ice cream|sundae|fudge|soup|candy|bakery|cookie|gingerbread|cooler|picnic|grill|service kitchen|food pantry|cider|market basket|tailgate|spice|maple sugar|thermos|food truck|bbq|smokehouse|easter egg/i,
    source: SOURCE.usdaFood,
    q1: item("servings", "are in a full-size steam-table pan", 40, "A full-size steam-table pan serves about 40 portions.", "capacity", "named_standard"),
    q2: item("pounds of flour", "does a commercial 20-quart mixer hold", 25, "A 20-quart mixer holds roughly 25 pounds of flour.", "weight", "named_standard"),
    q3: item("meals", "does Feeding America distribute in one year", 5300000000, "Feeding America distributes meals at a billion-scale.", "famous_macro", "rate"),
    extra: item("meals", "does World Central Kitchen serve in a major relief year", 100000000, "World Central Kitchen can serve meals at a huge scale.", "famous_macro", "rate"),
  },
  {
    key: "water",
    pattern: /\brain\b|storm|weather|pool|swim|water|beach|lifeguard|fountain|hose|thunderstorm|storm drain|reservoir|spillway/i,
    source: SOURCE.usgsWater,
    q1: item("gallons", "does a standard {scene} rain barrel hold", 55, "Many home rain barrels use a 55-gallon drum size.", "capacity"),
    q2: item("gallons", "does a backyard {scene} pool hold", 20000, "A typical backyard pool holds about 20,000 gallons.", "capacity"),
    q3: item("gallons", "can a city {scene} water tower hold", 1000000, "A city water tower can hold about a million gallons.", "famous_macro", "capacity"),
    extra: item("gallons", "can a large {scene} reservoir release in a day", 10000000, "A large reservoir release can top eight figures of gallons.", "famous_macro", "capacity"),
  },
  {
    key: "mail",
    pattern: /mail|post office|postcard|package|baggage|airport baggage/i,
    source: SOURCE.apta,
    q1: item("packages", "fit on a full {scene} sorting cart", 220, "A sorting cart can hold hundreds of small packages.", "capacity"),
    q2: item("letters", "fit in one full carrier delivery tray", 500, "A delivery tray can hold hundreds of letters.", "capacity"),
    q3: item("letters and packages", "can USPS process and deliver on an average day", 371000000, "USPS moves hundreds of millions of pieces daily.", "famous_macro", "rate"),
    extra: item("delivery vehicles", "can USPS operate across the U.S.", 230000, "USPS operates hundreds of thousands of delivery vehicles.", "famous_macro", "count"),
  },
  {
    key: "hotel",
    pattern: /hotel|motel|elevator|laundry cart|laundry chute/i,
    source: SOURCE.nist,
    q1: item("room keys", "fit behind a full {scene} desk", 120, "A hotel desk can hold more than 100 room keys.", "capacity"),
    q2: item("towels", "fit in a tall {scene} laundry cart", 240, "A tall laundry cart can hold hundreds of towels.", "capacity"),
    q3: item("guests", "can a large {scene} hotel host in one sold-out night", 5000, "A large convention hotel can sleep thousands of guests.", "famous_macro", "crowd"),
    extra: item("elevator rides", "can a convention {scene} hotel handle in one busy day", 50000, "A convention hotel can handle tens of thousands of elevator rides.", "famous_macro", "rate"),
  },
  {
    key: "bird",
    pattern: /bird|migration|feeder|tern|hummingbird/i,
    source: SOURCE.britannicaScience,
    q1: item("sunflower seeds", "fit in a full {scene} feeder tube", 1800, "A feeder tube can hold thousands of sunflower seeds.", "capacity"),
    q2: item("wingbeats", "can a hummingbird make during one {scene} minute", 3000, "A hummingbird can beat its wings thousands of times a minute.", "rate"),
    q3: item("birds", "can move on a record {scene} migration night", 858000000, "A record migration night can involve hundreds of millions of birds.", "famous_macro", "count"),
    extra: item("birds", "can pass over the U.S. on BirdCast's biggest nights", 1250000000, "BirdCast's biggest nights can pass one billion birds.", "famous_macro", "count"),
  },
  {
    key: "farm",
    pattern: /cornfield|dairy|milk|milking|farmstand|farmers market|harvest|market scale|produce scale|apple press|cider press|berry|pumpkin|greenhouse|garden center|nursery|seed tray|seed rack|orchard/i,
    source: SOURCE.usdaFood,
    q1: item("pounds of produce", "fit on a full {scene} market table", 800, "A loaded market table can carry hundreds of pounds.", "weight"),
    q2: item("plants", "fit in a {scene} greenhouse flat stack", 2400, "Greenhouse flat stacks can hold thousands of young plants.", "capacity"),
    q3: item("farmers markets", "operate across the U.S.", 8700, "The U.S. has thousands of farmers markets.", "famous_macro", "count"),
    extra: item("pounds of milk", "can a large {scene} dairy region produce in a day", 10000000, "A dairy region can produce eight figures of pounds daily.", "famous_macro", "weight"),
  },
  {
    key: "fishing",
    pattern: /fishing|fish|pier|canoe|dock|reef|shark|aquarium|deep-sea|touch tank|tank|tunnel/i,
    source: SOURCE.britannicaScience,
    q1: item("fish", "can fit in a large public {scene} aquarium window", 1200, "A large exhibit can hold thousands of fish.", "capacity"),
    q2: item("pounds of seafood", "can a busy {scene} pier land in a day", 12000, "A busy pier can land thousands of pounds of seafood.", "weight"),
    q3: item("visitors", "can a major {scene} aquarium welcome in one year", 2000000, "A major aquarium can welcome millions of visitors.", "famous_macro", "crowd"),
    extra: item("gallons", "can a major aquarium hold across all exhibits", 10000000, "A major aquarium can hold millions of gallons.", "famous_macro", "capacity"),
  },
  {
    key: "warehouse",
    pattern: /warehouse|loading dock|dock lines|loading/i,
    source: SOURCE.nist,
    q1: item("pallets", "fit in a standard 53-foot freight trailer", 26, "A 53-foot trailer usually fits about 26 pallets.", "capacity", "named_standard"),
    q2: item("pounds of freight", "can one loaded box truck carry", 26000, "A loaded box truck can carry tens of thousands of pounds.", "weight"),
    q3: item("packages", "can UPS Worldport move in one day", 1000000, "UPS Worldport can move packages at a million-a-day scale.", "famous_macro", "count"),
    extra: item("packages", "can UPS move worldwide on one peak day", 50000000, "UPS can move tens of millions of packages on peak days.", "famous_macro", "rate"),
  },
  {
    key: "museum",
    pattern: /museum|gallery|lens lab|coat check/i,
    source: SOURCE.smithsonian,
    q1: item("coat hangers", "fit on a full museum coat-check rack", 600, "A museum coat check can hold hundreds of hangers.", "capacity"),
    q2: item("objects", "fit in a busy gallery storage room", 12000, "A gallery store room can hold thousands of objects.", "count"),
    q3: item("visitors", "can Smithsonian museums welcome in one year", 7000000, "Smithsonian museums welcome visitors in the millions.", "famous_macro", "crowd"),
    extra: item("objects", "can the Smithsonian collections hold", 150000000, "Smithsonian collections hold hundreds of millions of objects.", "famous_macro", "count"),
  },
  {
    key: "climbing",
    pattern: /climbing/i,
    source: SOURCE.nist,
    q1: item("holds", "fit on one busy climbing wall", 1200, "A climbing wall can use more than 1,000 holds.", "capacity"),
    q2: item("feet of rope", "hang in a large climbing gym", 6000, "A climbing gym can hang thousands of feet of rope.", "distance"),
    q3: item("spectators", "can an IFSC World Cup climbing stop draw", 25000, "A World Cup climbing stop can draw tens of thousands.", "famous_macro", "crowd"),
    extra: item("climbing attempts", "can a Reel Rock festival tour inspire", 250000, "A global climbing-film tour can inspire huge try totals.", "famous_macro", "count"),
  },
  {
    key: "bike",
    pattern: /bike|helmet/i,
    source: SOURCE.parkTool,
    q1: item("helmets", "fit on a full bike-shop helmet wall", 170, "A helmet wall can hold hundreds of helmets.", "capacity"),
    q2: item("bikes", "fit on one full bike-share dock block", 120, "A full bike-share dock block can hold more than 100 bikes.", "capacity"),
    q3: item("bicycles", "are sold in the U.S. in one year", 15000000, "Americans buy bicycles by the tens of millions.", "famous_macro", "count"),
    extra: item("bike-share rides", "can Citi Bike log in one busy year", 30000000, "Citi Bike can log tens of millions of rides yearly.", "famous_macro", "rate"),
  },
  {
    key: "pool",
    pattern: /pool|swim|lifeguard|beach|towels/i,
    source: SOURCE.usgsWater,
    q1: item("pool noodles", "fit in one lifeguard storage bin", 200, "A lifeguard bin can hold hundreds of pool noodles.", "capacity"),
    q2: item("beach towels", "fit on one full pool-deck rack", 500, "A pool-deck rack can hold hundreds of towels.", "capacity"),
    q3: item("gallons", "fill an Olympic-size swimming pool", 660000, "An Olympic pool holds roughly 660,000 gallons.", "famous_macro", "capacity"),
    extra: item("visitors", "can Schlitterbahn welcome in one year", 2000000, "A famous water park can welcome millions yearly.", "famous_macro", "crowd"),
  },
  {
    key: "toy",
    pattern: /toy|brick|model railroad|toy train|robot|claw|puzzle table|dollhouse|action figure/i,
    source: SOURCE.britannicaScience,
    q1: item("toy bricks", "fit in a full {scene} cleanup bin", 1200, "A cleanup bin can hold more than 1,000 toy bricks.", "capacity"),
    q2: item("tiny parts", "fit on a crowded {scene} model table", 6000, "A model table can hold thousands of tiny parts.", "count"),
    q3: item("visitors", "can a major {scene} toy fair draw in one year", 250000, "A major toy fair can draw hundreds of thousands of visitors.", "famous_macro", "crowd"),
    extra: item("toy bricks", "can a record {scene} fan build use", 5000000, "A record-scale fan build can use millions of toy bricks.", "famous_macro", "count"),
  },
  {
    key: "arcade",
    pattern: /arcade|pinball|token|prize counter|ticket counter/i,
    source: SOURCE.britannicaScience,
    q1: item("watts", "does a full-size arcade cabinet draw", 250, "A full-size arcade cabinet can draw a few hundred watts.", "count", "named_standard"),
    q2: item("tickets", "can a busy {scene} arcade pay out in one day", 120000, "A busy arcade can pay out six figures of tickets.", "rate"),
    q3: item("visitors", "can a major {scene} arcade expo draw", 250000, "A major game expo can draw hundreds of thousands of visitors.", "famous_macro", "crowd"),
    extra: item("tickets", "can a jackpot {scene} arcade weekend pay out", 500000, "A jackpot weekend can pay out half a million tickets.", "famous_macro", "count"),
  },
  {
    key: "print",
    pattern: /print|paper|newspaper|small print|press|book fair|library|bookstore|comic/i,
    source: SOURCE.smithsonian,
    q1: item("books", "fit on one full {scene} library cart", 120, "A full cart can carry about 120 books.", "capacity"),
    q2: item("pages", "can a small {scene} print shop run in one busy day", 50000, "A busy print day can run tens of thousands of pages.", "rate"),
    q3: item("items", "can a major {scene} public library hold", 1000000, "A major public library can hold more than a million items.", "famous_macro", "count"),
    extra: item("pages", "can a big-city print shop run in one month", 5000000, "A big-city print shop can run millions of pages monthly.", "famous_macro", "rate"),
  },
  {
    key: "nature",
    pattern: /redwood|canyon|trailhead|trail|kite|leaf|evergreen|tree lot|forest|campfire|smores|firefly|beach towels/i,
    source: SOURCE.britannicaScience,
    q1: item("feet", "can a mature {scene} redwood tree stand tall", 350, "A mature redwood can stand hundreds of feet tall.", "distance"),
    q2: item("visitors", "can a popular {scene} trailhead see in one day", 5000, "A popular trailhead can see thousands of visitors.", "crowd"),
    q3: item("acres", "can a major {scene} national park cover", 1000000, "A major national park can cover about a million acres.", "famous_macro", "area"),
    extra: item("visitors", "can a major {scene} national park welcome in one year", 5000000, "A major national park can welcome millions of visitors.", "famous_macro", "crowd"),
  },
  {
    key: "firewood",
    pattern: /firewood|campfire|smores/i,
    source: SOURCE.britannicaScience,
    q1: item("logs", "fit in one {scene} backyard rack", 180, "A backyard rack can hold hundreds of split logs.", "capacity"),
    q2: item("pounds of firewood", "stack on one {scene} pickup load", 1200, "A pickup load of firewood can weigh well over 1,000 pounds.", "weight"),
    q3: item("logs", "can a busy {scene} campground season burn", 250000, "A busy campground season can burn hundreds of thousands of logs.", "famous_macro", "count"),
    extra: item("cords of firewood", "can a winter {scene} wood yard sell", 12000, "A winter wood yard can sell thousands of cords.", "famous_macro", "count"),
  },
  {
    key: "clock",
    pattern: /clock|timer/i,
    source: SOURCE.nist,
    q1: item("clock faces", "fit on one {scene} repair-tray wall", 120, "A repair wall can hold more than 100 clock faces.", "capacity"),
    q2: item("gears", "sit in the {scene} parts drawers", 900, "A clockmaker's drawers can hold hundreds of gears.", "count"),
    q3: item("visitors", "come to a famous {scene} clock tower in one year", 1000000, "A famous clock tower can draw about a million visitors yearly.", "famous_macro", "crowd"),
    extra: item("ticks", "sound across a {scene} clock-shop day", 5000000, "A clock-shop day can produce millions of ticks.", "famous_macro", "rate"),
  },
  {
    key: "art",
    pattern: /\bart\b|gallery|mural|camera|photo|pottery|ceramic|glaze|paint|lens|museum/i,
    source: SOURCE.smithsonian,
    q1: item("paintbrushes", "fit in {aScene}", 360, "An art cart can hold hundreds of paintbrushes.", "capacity"),
    q2: item("square feet", "are painted by one gallon of {scene} wall paint", 400, "One gallon of interior paint covers about 400 square feet.", "area"),
    q3: item("visitors", "can a major museum welcome during {aScene} exhibit year", 7000000, "A major museum can welcome millions of visitors yearly.", "famous_macro", "crowd"),
    extra: item("square feet of mural", "cover a landmark public art wall near {theScene}", 100000, "A landmark mural can cover a huge wall area.", "famous_macro", "area"),
  },
  {
    key: "election",
    pattern: /ballot|election|presidents|courthouse|jury/i,
    source: SOURCE.censusQuickFacts,
    q1: item("ballots", "fit in one {scene} precinct scanner tray", 3000, "A scanner tray can hold thousands of ballots.", "capacity"),
    q2: item("voter stickers", "get handed out at one busy {scene} polling place", 12000, "A busy polling place can hand out thousands of stickers.", "count"),
    q3: item("ballots", "count in a large county {scene} election", 1000000, "A large county election can count about a million ballots.", "famous_macro", "count"),
    extra: item("votes", "cast in a high-turnout {scene} state election", 10000000, "A large state can cast eight figures of votes.", "famous_macro", "count"),
  },
  {
    key: "winter",
    pattern: /snow|winter|ski|sled|ice rink|snowplow|plow|firewood|snow globe|ice fishing/i,
    source: SOURCE.usgsWater,
    q1: item("gallons of brine", "does a {scene} road-treatment truck carry", 2000, "A road-treatment truck can carry thousands of gallons of brine.", "capacity"),
    q2: item("pounds of road salt", "stack in a {scene} pallet", 2400, "A road-salt pallet can weigh more than a ton.", "weight"),
    q3: item("lane miles", "can a big city snow route cover", 9000, "A big city snow route can cover thousands of lane miles.", "famous_macro", "distance"),
    extra: item("pounds of snow", "can Killington make in one winter", 50000000, "Killington snowmaking uses tens of millions of pounds.", "famous_macro", "weight"),
  },
  {
    key: "firehouse",
    pattern: /fire station|firehouse|hose rack|fire-station|fire engine|fire pump|engine pump/i,
    source: SOURCE.censusQuickFacts,
    q1: item("helmets", "fit on {theScene} gear wall", 90, "A firehouse gear wall can hold dozens of helmets.", "capacity"),
    q2: item("feet of hose", "can one FDNY engine carry", 1200, "A fire engine can carry more than 1,000 feet of hose.", "distance"),
    q3: item("emergency calls", "can FDNY answer in one year", 1800000, "FDNY handles calls at a seven-figure scale.", "famous_macro", "rate"),
    extra: item("gallons of water", "can FDNY fireboats pump in one hour", 2000000, "FDNY fireboats can pump millions of gallons per hour.", "famous_macro", "capacity"),
  },
  {
    key: "animals",
    pattern: /pet|dog|kennel|fetch|groomer|zoo|aquarium|shark|deep-sea|reef|turtle|animal|fish|butterfly|bird|migration|feeder|bee/i,
    source: SOURCE.britannicaScience,
    q1: item("animals", "can a busy {scene} care room handle", 120, "A busy care room can handle more than 100 animals.", "capacity"),
    q2: item("pounds of animal food", "get prepped in one busy {scene} care day", 2400, "A large animal-care day can prep more than a ton of food.", "weight"),
    q3: item("visitors", "can a major {scene} animal attraction welcome in one year", 2000000, "A major animal attraction can welcome millions of visitors.", "famous_macro", "crowd"),
    extra: item("gallons", "can a major aquarium hold across all exhibits", 10000000, "A major aquarium can hold millions of gallons.", "famous_macro", "capacity"),
  },
  {
    key: "garden",
    pattern: /greenhouse|garden|flower|farm|\bcorn\b|pumpkin|apple|orchard|redwood|leaf|seed|evergreen|\btree\b|trees|canyon|trailhead|kite|farmers market|bouquet|berry|harvest/i,
    source: SOURCE.usdaFood,
    q1: item("plants", "fit on the {scene} display bench", 240, "A display bench can hold hundreds of plants.", "capacity"),
    q2: item("pounds of produce", "does a farmers-market stall sell in one day", 900, "A market stall can sell hundreds of pounds in a day.", "rate"),
    q3: item("visitors", "can Keukenhof welcome in one spring season", 1500000, "Keukenhof can welcome about 1.5 million spring visitors.", "famous_macro", "crowd"),
    extra: item("seedlings", "grow in a regional greenhouse season", 5000000, "A regional greenhouse season can grow millions of seedlings.", "famous_macro", "count"),
  },
  {
    key: "apple",
    pattern: /apple|orchard|cider|apple press/i,
    source: SOURCE.usdaFood,
    q1: item("apples", "fit in a {scene} bushel basket", 125, "A bushel basket holds roughly 125 medium apples.", "capacity"),
    q2: item("apple trees", "are planted on one orchard acre", 150, "An orchard acre can hold about 150 apple trees.", "count"),
    q3: item("pounds of apples", "grow on one productive {scene} orchard acre", 20000, "A productive orchard acre can grow about 20,000 pounds.", "famous_macro", "weight"),
    extra: item("pounds of apples", "come from a county {scene} orchard harvest", 1200000, "A county orchard harvest can pass a million pounds.", "famous_macro", "weight"),
  },
  {
    key: "transit",
    pattern: /train|station|bus|airport|ferry|post office|mail|package|elevator|hotel|motel|route|highway|road trip|rail|taxi|cable car/i,
    source: SOURCE.apta,
    q1: item("passengers", "fit on one full {scene} city bus", 72, "A full city bus can carry dozens of passengers.", "capacity"),
    q2: item("stops", "are on a typical NYC city bus route", 40, "A NYC bus route can have a few dozen stops.", "count", "famous_event"),
    q3: item("riders", "does the New York City subway carry in one day", 3000000, "The NYC subway carries riders by the millions daily.", "famous_macro", "crowd"),
    extra: item("riders", "does New York City Transit carry on buses in one day", 1800000, "NYC buses carry more than a million riders daily.", "famous_macro", "crowd"),
  },
  {
    key: "music",
    pattern: /orchestra|music|guitar|concert|stage|record|choir|drumline|theater seat|backstage|stage crew/i,
    source: SOURCE.smithsonian,
    q1: item("guitar strings", "are on a full {scene} guitar rack", 240, "A guitar rack can show hundreds of strings.", "count"),
    q2: item("seats", "fit in a large {scene} concert hall", 2200, "A large concert hall can seat a few thousand people.", "capacity"),
    q3: item("attendees", "can a major outdoor {scene} music festival draw", 400000, "A major music festival can draw hundreds of thousands.", "famous_macro", "crowd"),
    extra: item("streams", "can a major festival livestream draw", 10000000, "A major festival livestream can draw millions of streams.", "famous_macro", "count"),
  },
  {
    key: "movie",
    pattern: /movie|multiplex|drive-in|marquee|popcorn|movie palace/i,
    source: SOURCE.smithsonian,
    q1: item("seats", "fill one midsize {scene} auditorium", 220, "A midsize auditorium can seat more than 200 people.", "capacity"),
    q2: item("popcorn kernels", "fit in one large {scene} theater tub", 650, "A large popcorn tub can hold hundreds of kernels.", "capacity"),
    q3: item("moviegoers", "can a blockbuster {scene} opening weekend bring in", 1000000, "A blockbuster weekend can draw more than a million moviegoers.", "famous_macro", "crowd"),
    extra: item("tickets", "can a national cinema chain sell in one blockbuster weekend", 5000000, "A national cinema chain can sell millions of weekend tickets.", "famous_macro", "count"),
  },
  {
    key: "tools",
    pattern: /hardware|tool|workbench|workshop|repair|shoe|tailor|key cutting|pegboard|factory|warehouse|loading dock|drawer|maker|solder|neon|lighthouse|recycling|garage/i,
    source: SOURCE.nist,
    q1: item("screws", "are in a one-pound {scene} hardware box", 300, "A one-pound hardware box can hold hundreds of screws.", "count"),
    q2: item("feet of material", "can a stocked {scene} hardware wall unroll", 3600, "A stocked wall can unroll thousands of feet of material.", "distance"),
    q3: item("customer jobs", "can a busy {scene} repair shop finish in one year", 12000, "A busy shop can finish thousands of customer jobs yearly.", "famous_macro", "count"),
    extra: item("rental orders", "can a big {scene} home-center chain handle in a season", 250000, "A busy rental season can handle hundreds of thousands of orders.", "famous_macro", "count"),
  },
  {
    key: "tailor",
    pattern: /tailor|sock|wrapp|gift wrap|stocking/i,
    source: SOURCE.nist,
    q1: item("buttons", "can a {scene} counter hold", 720, "A tailor counter can hold hundreds of loose buttons.", "capacity"),
    q2: item("feet of ribbon", "can a {scene} worktable unroll", 3000, "A worktable can unroll thousands of feet of trim.", "distance"),
    q3: item("garments", "can a busy {scene} shop finish in one year", 12000, "A busy shop can finish thousands of garments yearly.", "famous_macro", "count"),
    extra: item("packages", "ship during a holiday {scene} wrapping season", 3000000000, "Holiday deliveries can number in the billions.", "famous_macro", "count"),
  },
  {
    key: "laundry",
    pattern: /laundry|laundromat|washer/i,
    source: SOURCE.usgsWater,
    q1: item("towels", "fit in a tall {scene} laundry cart", 240, "A tall laundry cart can hold hundreds of towels.", "capacity"),
    q2: item("wash loads", "can a busy {scene} day run", 720, "A busy laundromat day can run hundreds of loads.", "rate"),
    q3: item("pounds of laundry", "does the MGM Grand wash in one month", 1000000, "The MGM Grand can wash laundry at a million-pound scale.", "famous_macro", "weight"),
    extra: item("towels", "does Walt Disney World laundry wash in one day", 285000, "Disney laundry can wash hundreds of thousands of towels daily.", "famous_macro", "count"),
  },
  {
    key: "candle",
    pattern: /candle/i,
    source: SOURCE.nist,
    q1: item("candles", "fit on the {scene} market display", 288, "A market display can hold hundreds of candles.", "capacity"),
    q2: item("feet of wick", "can a full {scene} inventory hide", 4320, "A full inventory can hide thousands of feet of wick.", "distance"),
    q3: item("candles", "can a holiday {scene} market season sell", 100000, "A holiday market season can sell six figures of candles.", "famous_macro", "count"),
    extra: item("candles", "can a candle factory make in one holiday month", 250000, "A candle factory can make hundreds of thousands in a holiday month.", "famous_macro", "count"),
  },
  {
    key: "school",
    pattern: /school|classroom|library|book|notebook|print|paper|science fair|book fair|comic|newspaper/i,
    source: SOURCE.smithsonian,
    q1: item("books", "fit on one full {scene} cart", 120, "A full cart can carry about 120 books.", "capacity"),
    q2: item("pages", "can a busy {scene} reading room move in one day", 50000, "A busy day can move tens of thousands of pages.", "rate"),
    q3: item("items", "can a major {scene} public library hold", 1000000, "A major public library can hold more than a million items.", "famous_macro", "count"),
    extra: item("checkout items", "can a city {scene} library week circulate", 70000, "A city library week can move tens of thousands of checkouts.", "famous_macro", "rate"),
  },
  {
    key: "sports",
    pattern: /baseball|basketball|bowling|golf|tennis|hockey|soccer|football|track meet|field sideline|skate|rink|climbing|marathon|bike|halfpipe|stadium|gym|sports ball|trail|canyon|game night|pool deck|derby/i,
    source: SOURCE.mlb,
    q1: item("practice balls", "fit in a full {scene} equipment rack", 120, "A practice rack can hold more than 100 balls.", "capacity"),
    q2: item("plays", "can happen in a busy {scene} tournament day", 12000, "A busy tournament day can stack thousands of plays.", "rate"),
    q3: item("fans", "can a major {scene} stadium or arena hold", 42000, "A major stadium can hold tens of thousands of fans.", "famous_macro", "crowd"),
    extra: item("spectators", "can a major {scene} tournament week draw", 200000, "A major tournament week can draw hundreds of thousands.", "famous_macro", "crowd"),
  },
  {
    key: "games",
    pattern: /arcade|pinball|toy|puzzle|\bgame\b|domino|scrabble|card|cards|dice|checkers|backgammon|cribbage|mahjong|roulette|board game|board-game|chess|robot|claw/i,
    source: SOURCE.britannicaScience,
    q1: item("letter tiles", "are in a standard {scene} Scrabble set", 100, "A standard Scrabble set has 100 letter tiles.", "count"),
    q2: item("puzzle pieces", "fit in a large {scene} tabletop puzzle", 5000, "A large tabletop puzzle can hold thousands of pieces.", "count"),
    q3: item("visitors", "can a major {scene} tabletop-game convention draw", 250000, "A major game convention can draw hundreds of thousands.", "famous_macro", "crowd"),
    extra: item("game pieces", "can a record {scene} tabletop collection include", 500000, "A record-scale collection can include hundreds of thousands of pieces.", "famous_macro", "count"),
  },
  {
    key: "space",
    pattern: /moon|star|space|rocket|planet|mars|rover|saturn|telescope|observatory|planetarium|sky|meteor shower|asteroid/i,
    source: SOURCE.nasa,
    q1: item("eyepieces", "fit in the {scene} telescope loaner case", 96, "A telescope case can hold dozens of eyepieces.", "capacity"),
    q2: item("miles", "separate Earth and the Moon when {theScene} zooms to lunar scale", 239000, "The Moon is about 239,000 miles away.", "distance"),
    q3: item("stars", "sit in the Milky Way", 100000000000, "The Milky Way has roughly 100 billion stars.", "famous_macro", "count"),
    extra: item("miles", "separate Earth from the nearest star", 25300000000000, "The nearest star is about 25 trillion miles away.", "famous_macro", "distance"),
  },
  {
    key: "money",
    pattern: /money|coin|cash|mint|quarter/i,
    source: SOURCE.usMint,
    q1: item("coins", "fit in the {scene} display case", 480, "A coin display case can hold hundreds of coins.", "capacity"),
    q2: item("coins", "does a U.S. Mint coin press strike in one minute", 750, "A U.S. Mint press can strike hundreds of coins per minute.", "rate", "famous_event"),
    q3: item("coins", "does the U.S. Mint make in a busy {scene} year", 10000000000, "The U.S. Mint can make billions of coins in a year.", "famous_macro", "count"),
    extra: item("coins", "can the U.S. Mint strike in a high-output {scene} month", 1000000000, "The Mint can strike huge monthly coin totals.", "famous_macro", "count"),
  },
  {
    key: "city",
    pattern: /museum|gallery|mural|camera|photo|art|crosswalk|street|plaza|market|roadside|fairground|booth|holiday market/i,
    source: SOURCE.smithsonian,
    q1: item("visitor passes", "fit on a full {scene} check-in table", 900, "A check-in table can hold hundreds of visitor passes.", "capacity"),
    q2: item("acres", "are in the National Mall", 146, "The National Mall covers about 146 acres.", "area", "famous_event"),
    q3: item("people", "visit Times Square on a busy day", 350000, "Times Square can see hundreds of thousands in one day.", "famous_macro", "crowd"),
    extra: item("visitors", "does the Statue of Liberty welcome in one year", 4000000, "The Statue of Liberty welcomes millions yearly.", "famous_macro", "crowd"),
  },
];

const SPECIAL_PACKS = {
  "New Year's Desk Calendar": {
    source: SOURCE.timesSquare,
    questions: [
      specialQuestion("How many noisemakers are in a typical New Year's party-supply case?", 240, "A party-supply case holds hundreds of noisemakers.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many pounds of confetti fall in Times Square at midnight?", 3000, "The midnight confetti drop uses thousands of pounds of paper.", "physical_capacity", "weight", "famous_event"),
      specialQuestion("How many people gather near the Times Square Ball on New Year's Eve?", 1000000, "Times Square can draw about a million people on New Year's Eve.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many wishes can Times Square's New Year's wishing wall collect?", 100000, "The wishing wall can collect six figures of wishes.", "famous_macro", "count", "famous_event"),
  },
  "Snow Route Map": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many gallons of brine does a road-treatment truck carry?", 2000, "A road-treatment truck can carry about 2,000 gallons of brine.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many pounds of road salt sit on one full pallet?", 2400, "One pallet of road salt can weigh more than a ton.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many lane miles can Chicago's snow route cover?", 9000, "Chicago snow routes cover thousands of lane miles.", "famous_macro", "distance", "famous_event"),
    ],
  },
  "Tailor Shop Counter": {
    source: SOURCE.nist,
    questions: [
      specialQuestion("How many buttons fit in a one-pound tailor-shop jar?", 720, "A pound of loose buttons can make a jar look bottomless.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many feet of thread sit on one sewing-machine spool?", 3000, "One sewing-machine spool can hold thousands of feet of thread.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How many garments can a busy tailor shop alter in one year?", 12000, "A busy tailor shop can finish thousands of garments yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Toy Brick Cleanup": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many pieces are in a LEGO Classic medium brick box?", 484, "The LEGO Classic medium box has 484 pieces.", "familiar_anchor", "count", "iconic_object"),
      specialQuestion("How many toy bricks fit in a five-gallon cleanup bin?", 3000, "A five-gallon bin can swallow thousands of small bricks.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many LEGO bricks does LEGO make in one year?", 36000000000, "LEGO makes tens of billions of bricks yearly.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many LEGO minifigures have been made since 1978?", 8000000000, "LEGO has made billions of minifigures.", "famous_macro", "count", "famous_event"),
  },
  "Wrapping Paper Table": {
    source: SOURCE.nist,
    questions: [
      specialQuestion("How many rolls of wrapping paper fit on a gift-wrap table?", 36, "A gift-wrap table can hold a few dozen rolls.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many yards of ribbon are on a standard craft spool?", 100, "A standard craft spool can unroll to about 100 yards.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How many packages can U.S. carriers deliver during the holidays?", 3000000000, "Holiday deliveries can number in the billions.", "famous_macro", "count", "famous_event"),
    ],
  },
  "St. Patrick Parade": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many bead necklaces fit in one standard parade throw bag?", 720, "A standard throw bag can hold hundreds of bead necklaces.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many feet long is New York's St. Patrick's parade route?", 9600, "The New York route runs close to two miles.", "physical_capacity", "distance", "famous_event"),
      specialQuestion("How many spectators can New York's St. Patrick's parade draw?", 2000000, "New York's St. Patrick's parade can draw millions.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "City Bus Garage": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many passengers fit on one full city bus?", 72, "A full city bus can carry dozens of passengers.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many gallons can a city bus fuel tank hold?", 125, "A city bus fuel tank can hold more than 100 gallons.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many buses are in New York City's public bus fleet?", 5800, "New York City's bus fleet has thousands of buses.", "famous_macro", "count", "famous_event"),
    ],
  },
  "The Moon": {
    source: SOURCE.nasa,
    questions: [
      specialQuestion("How many miles wide is the Moon?", 2159, "The Moon is about 2,159 miles wide.", "physical_capacity", "distance", "natural_scale", false, "physical_dimension"),
      specialQuestion("How many days does one lunar phase cycle take?", 29, "A lunar phase cycle takes about 29 days.", "production_scale", "count", "natural_scale", false, "natural_cycle"),
      specialQuestion("How many craters are mapped on the Moon?", 1300000, "Scientists have mapped more than a million lunar craters.", "famous_macro", "count", "natural_scale", false, "surface_features"),
    ],
    extra: specialQuestion("How many miles is the Moon from Earth?", 239000, "The Moon is about 239,000 miles away.", "famous_macro", "distance", "natural_scale"),
  },
  "Theater Seat Rows": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many seats fit in a midsize theater auditorium?", 220, "A midsize auditorium seats a few hundred people.", "familiar_anchor", "crowd", "sourced_typical"),
      specialQuestion("How many Broadway theaters operate in New York City?", 41, "Broadway has 41 official theaters.", "iconic_exact", "count", "famous_event", true),
      specialQuestion("How many people attend Broadway shows in one season?", 12000000, "Broadway attendance reaches eight figures in a season.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Stage Crew Fly Rail": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many rope lines can hang on a theater fly rail?", 60, "A fly rail can organize dozens of rope lines.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many pounds of scenery can a counterweight fly system move?", 20000, "A stage fly system can move tons of scenery overhead.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many lighting cues can fire during a Broadway musical run?", 54000, "A musical run can trigger tens of thousands of cues.", "famous_macro", "rate", "famous_event"),
    ],
  },
  "Weather Station": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many gallons does a standard home rain barrel hold?", 55, "A standard home rain barrel holds about 55 gallons.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many miles per hour marks a severe thunderstorm wind gust?", 58, "Severe thunderstorm wind starts at about 58 mph.", "physical_capacity", "rate", "natural_scale"),
      specialQuestion("How many lightning strikes hit Earth in one day?", 8000000, "Earth gets millions of lightning strikes daily.", "famous_macro", "count", "natural_scale"),
    ],
    extra: specialQuestion("How many U.S. weather observations can be logged in one month?", 30000000, "U.S. weather networks can log tens of millions of observations monthly.", "famous_macro", "rate", "famous_event"),
  },
  "Weather Desk": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many inches of mercury is standard sea-level air pressure?", 30, "Sea-level pressure is about 30 inches of mercury.", "familiar_anchor", "distance", "named_standard"),
      specialQuestion("How many readings can one automated weather station log in a day?", 288, "A five-minute weather station logs 288 readings daily.", "physical_capacity", "rate", "named_standard"),
      specialQuestion("How many weather balloons does the U.S. launch in one year?", 90000, "U.S. balloon launches add up to tens of thousands yearly.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many feet high can a weather balloon climb?", 100000, "A weather balloon can climb about 100,000 feet.", "famous_macro", "distance", "natural_scale"),
  },
  "Harvest Wagons": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many pounds are in a bushel of apples?", 48, "A bushel of apples weighs about 48 pounds.", "familiar_anchor", "weight", "named_standard"),
      specialQuestion("How many pounds of pumpkins fill one harvest wagon?", 2000, "One harvest wagon can carry about a ton of pumpkins.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many pounds of pumpkins does Illinois grow in one year?", 650000000, "Illinois grows hundreds of millions of pounds of pumpkins.", "famous_macro", "weight", "famous_event"),
    ],
  },
  "Ice Rink Skate Rental": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many pairs of skates fit on a full rental wall?", 300, "A rental wall can hold hundreds of skate pairs.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many gallons of water freeze into an NHL rink sheet?", 12000, "An NHL rink sheet takes thousands of gallons of water.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many skaters can Rockefeller Center's rink host in a season?", 250000, "Rockefeller's rink can host hundreds of thousands of skaters.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Gingerbread Bakery": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many gingerbread cookies fit on a full bakery sheet pan?", 24, "A sheet pan can hold a couple dozen cookies.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many cookies can a busy bakery bake in one day?", 5000, "A busy bakery can turn out thousands of cookies daily.", "production_scale", "rate", "named_standard"),
      specialQuestion("How many pounds did the world's largest gingerbread house weigh?", 36000, "The largest gingerbread house weighed about 36,000 pounds.", "famous_macro", "weight", "famous_event"),
    ],
    extra: specialQuestion("How many gingerbread houses can a holiday display include?", 1000, "A big holiday display can include about 1,000 houses.", "famous_macro", "count", "famous_event"),
  },
  "Sledding Hill": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many plastic sleds fit in a park rental shed?", 120, "A park shed can stack more than 100 sleds.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many feet long can a public sledding run be?", 900, "A big public sledding run can stretch hundreds of feet.", "physical_capacity", "distance", "natural_scale"),
      specialQuestion("How many skiable acres does Vail Mountain cover?", 5300, "Vail covers more than 5,000 skiable acres.", "famous_macro", "area", "famous_event"),
    ],
  },
  "Stage Light Catwalk": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many spotlights hang over a midsize theater stage?", 96, "A midsize stage can hang close to 100 lights.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many gel-frame square inches color the light rack?", 3456, "The color frames add up to a small stained-glass wall.", "physical_capacity", "area", "named_standard"),
      specialQuestion("How many light cues fire during a long musical run?", 54000, "A musical run can trigger tens of thousands of light cues.", "famous_macro", "rate", "famous_event"),
    ],
    extra: specialQuestion("How many watts blaze if the whole stage rig peaks at once?", 115200, "A stage rig can peak above 100,000 watts.", "famous_macro", "rate", "named_standard"),
  },
  "Arcade Token Cup": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many tokens fit in a standard plastic arcade cup?", 120, "A standard arcade cup can hold about 120 tokens.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many button presses happen on a fighting-game row in one busy night?", 216000, "A fighting-game row can rack up hundreds of thousands of presses.", "production_scale", "rate", "named_standard"),
      specialQuestion("How many prize tickets spill out on a jackpot day?", 360000, "A jackpot day can spill hundreds of thousands of tickets.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many prize tickets can a packed arcade weekend pay out?", 720000, "A packed arcade weekend can pay out hundreds of thousands of tickets.", "famous_macro", "count", "famous_event"),
  },
  "Observatory Telescope Night": {
    source: SOURCE.nasa,
    questions: [
      specialQuestion("How many eyepieces are needed for a public observatory star party?", 96, "A public star party can need dozens of eyepieces.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many mirror square inches collect light in a telescope row?", 11310, "A telescope row can collect thousands of square inches of light.", "physical_capacity", "area", "natural_scale"),
      specialQuestion("How many miles does moonlight travel before reaching the telescope?", 239000, "Moonlight reaches us after about 239,000 miles.", "famous_macro", "distance", "natural_scale"),
    ],
    extra: specialQuestion("How many stars sit in the Milky Way?", 100000000000, "The Milky Way holds about 100 billion stars.", "famous_macro", "count", "natural_scale"),
  },
  "Backyard Rainfall": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many gallons does a common home rain barrel hold?", 55, "Many home rain barrels use a 55-gallon drum size.", "familiar_anchor", "capacity", "sourced_typical"),
      specialQuestion("How many gallons can a typical backyard swimming pool hold?", 20000, "A typical backyard pool holds about 20,000 gallons.", "physical_capacity", "capacity", "sourced_typical"),
      specialQuestion("How many gallons flow over Niagara Falls in one second?", 750000, "Niagara Falls can move hundreds of thousands of gallons per second.", "famous_macro", "capacity", "natural_scale"),
    ],
    extra: specialQuestion("How many gallons flow over Niagara Falls in one second?", 750000, "Niagara Falls can move hundreds of thousands of gallons per second.", "famous_macro", "capacity", "natural_scale"),
  },
  "Backyard Birds": {
    source: SOURCE.birdCast,
    questions: [
      specialQuestion("How many sunflower seeds fit in a full backyard feeder tube?", 1800, "A feeder tube can hold thousands of sunflower seeds.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many wingbeats does a hummingbird make in one minute?", 3000, "A hummingbird can beat its wings thousands of times a minute.", "object_anatomy", "rate", "natural_scale"),
      specialQuestion("How many birds can move on a huge spring migration night?", 858000000, "A huge migration night can involve hundreds of millions of birds.", "famous_macro", "count", "natural_scale"),
    ],
    extra: specialQuestion("How many birds can pass over the U.S. on BirdCast's biggest nights?", 1250000000, "BirdCast's biggest nights can pass one billion birds.", "famous_macro", "count", "natural_scale"),
  },
  "Apple Orchard": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many apples fit in a bushel basket?", 125, "A bushel basket holds roughly 125 medium apples.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many apples can a mature apple tree grow?", 500, "A mature apple tree can grow hundreds of apples.", "production_scale", "count", "natural_scale"),
      specialQuestion("How many pounds of apples can a productive orchard acre grow?", 20000, "A productive orchard acre can grow about 20,000 pounds.", "famous_macro", "weight", "natural_scale"),
    ],
    extra: specialQuestion("How many pounds of apples can a county orchard harvest produce?", 1200000, "A county orchard harvest can pass a million pounds.", "famous_macro", "weight", "natural_scale"),
  },
  "Money Museum": {
    source: SOURCE.usMint,
    questions: [
      specialQuestion("How many ridges are around a U.S. quarter?", 119, "A U.S. quarter has 119 ridges.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many coins does a U.S. Mint coin press strike in one minute?", 750, "A U.S. Mint press can strike hundreds of coins per minute.", "production_scale", "rate", "famous_event"),
      specialQuestion("How many coins can the U.S. Mint make in a busy year?", 10000000000, "The U.S. Mint can make billions of coins in a year.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Toy Chest": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many cards are in a standard Uno deck?", 112, "A standard Uno deck has 112 cards.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many pieces are in a LEGO Classic large brick box?", 790, "The LEGO Classic large box has hundreds of pieces.", "familiar_anchor", "count", "iconic_object"),
      specialQuestion("How many Barbie dolls have sold worldwide?", 1000000000, "Barbie sales have passed one billion dolls.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many LEGO minifigures have been made since 1978?", 8000000000, "LEGO has made billions of minifigures.", "famous_macro", "count", "famous_event"),
  },
  "Game Night": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many wooden blocks start a classic Jenga tower on game night?", 54, "A classic Jenga tower starts with 54 wooden blocks.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many letter tiles are in a standard Scrabble set?", 100, "A standard Scrabble set has 100 letter tiles.", "familiar_anchor", "count", "iconic_object"),
      specialQuestion("How many Monopoly sets have sold worldwide?", 300000000, "Monopoly sales have reached hundreds of millions.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Rocket Club Launch Table": {
    source: SOURCE.nasa,
    questions: [
      specialQuestion("How many feet high can a beginner model rocket fly?", 1000, "A beginner model rocket can climb about 1,000 feet.", "familiar_anchor", "distance", "natural_scale"),
      specialQuestion("How many miles per hour can a fast model rocket fly?", 300, "A fast model rocket flies hundreds of miles per hour.", "physical_capacity", "rate", "natural_scale"),
      specialQuestion("How many people watched the Apollo 11 moon landing?", 650000000, "Apollo 11 drew hundreds of millions of viewers.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Classroom Shelf": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many sheets are in a fresh ream of printer paper?", 500, "A fresh paper ream has 500 sheets.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many books can one full classroom book cart carry?", 145, "A full classroom book cart can carry about 145 books.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many books are in the Library of Congress?", 39000000, "The Library of Congress holds tens of millions of books.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Fire Station": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many gallons of water does a standard fire engine carry?", 500, "A standard fire engine carries hundreds of gallons.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many firefighters work for FDNY?", 11000, "FDNY has more than 11,000 firefighters.", "production_scale", "crowd", "famous_event"),
      specialQuestion("How many emergency calls can FDNY handle in one year?", 1600000, "FDNY handles calls at a million-plus scale.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Post Office": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many letters fit in one full USPS carrier tray?", 500, "A full carrier tray can hold hundreds of letters.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many delivery vehicles does USPS operate?", 230000, "USPS operates hundreds of thousands of vehicles.", "production_scale", "count", "famous_event"),
      specialQuestion("How many mail pieces does USPS handle on an average day?", 318000000, "USPS handles hundreds of millions daily.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Bus Wash Bay": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many students fit on one full-size school bus?", 72, "A full-size school bus often seats about 72 students.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many gallons can a full-size school bus fuel tank hold?", 100, "A school bus fuel tank can hold about 100 gallons.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many students can New York City public schools bus in one morning?", 100000, "NYC can bus about 100,000 students daily.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Hardware Store": {
    source: SOURCE.nist,
    questions: [
      specialQuestion("How many screws are in a one-pound hardware box?", 300, "A one-pound hardware box can hold hundreds of screws.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many pounds can one sheet of plywood weigh?", 60, "A plywood sheet can weigh around 60 pounds.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many customer jobs does Repair Cafe International finish in one year?", 12000, "Repair Cafe International finishes thousands of jobs yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Dairy Barn": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many pounds does a full milk can weigh?", 86, "A full 10-gallon milk can weighs about 86 pounds.", "familiar_anchor", "weight", "named_standard"),
      specialQuestion("How many scoops of ice cream can come from one gallon of milk?", 32, "One gallon can become about 32 scoops.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many pounds of cheese does Wisconsin make in one year?", 3500000000, "Wisconsin makes billions of pounds of cheese.", "famous_macro", "weight", "famous_event"),
    ],
    extra: specialQuestion("How many pounds of milk do U.S. dairy farms produce in one year?", 226000000000, "U.S. dairy farms produce hundreds of billions of pounds yearly.", "famous_macro", "weight", "famous_event"),
  },
  "Fishing Derby": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many feet of line are on a typical spinning reel?", 200, "A spinning reel can carry hundreds of feet of line.", "familiar_anchor", "distance", "sourced_typical"),
      specialQuestion("How many licensed anglers fish in the U.S. each year?", 57000000, "Tens of millions of Americans fish each year.", "production_scale", "crowd", "famous_event"),
      specialQuestion("How many pounds of salmon can Alaska harvest in one year?", 700000000, "Alaska salmon harvests total hundreds of millions.", "famous_macro", "weight", "famous_event"),
    ],
  },
  "Cornfield": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many kernels grow on one good ear of corn?", 800, "One good ear of corn can hold about 800 kernels.", "familiar_anchor", "count", "natural_scale"),
      specialQuestion("How many pounds are in one bushel of shelled corn?", 56, "A corn bushel weighs 56 pounds.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many bushels of corn can Iowa harvest in one year?", 2500000000, "Iowa can harvest billions of bushels.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Skate Park": {
    source: SOURCE.mlb,
    questions: [
      specialQuestion("How many wheels are on one standard skateboard?", 4, "A standard skateboard has four wheels.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many square feet does a neighborhood skate park cover?", 12000, "A neighborhood skate park can cover thousands of square feet.", "physical_capacity", "area", "sourced_typical"),
      specialQuestion("How many people skateboard in the U.S.?", 6000000, "Millions of Americans skateboard.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Pool Deck": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many lanes are in an Olympic swimming pool?", 10, "An Olympic pool has 10 lanes.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many athletes compete in Olympic swimming at one Games?", 850, "Olympic swimming fields hundreds of athletes.", "production_scale", "crowd", "famous_event"),
      specialQuestion("How many people visit U.S. public swimming pools in one year?", 300000000, "Public pools draw hundreds of millions of visits.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Boardwalk Arcade": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many dots are in the original Pac-Man maze?", 240, "The original Pac-Man maze has 240 dots.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many feet tall is Coney Island's Wonder Wheel?", 150, "The Wonder Wheel stands about 150 feet tall.", "production_scale", "distance", "famous_event"),
      specialQuestion("How many visitors can the Atlantic City Boardwalk draw in one summer?", 5000000, "Atlantic City's boardwalk can draw millions.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Bouquet Bench": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many petals are on a typical garden rose?", 30, "A garden rose often has a few dozen petals.", "familiar_anchor", "count", "sourced_typical"),
      specialQuestion("How many flowers does the Rose Parade use on its floats?", 18000000, "Rose Parade floats use millions of flowers.", "production_scale", "count", "famous_event"),
      specialQuestion("How many roses sell across the U.S. for Valentine's week?", 250000000, "Valentine's week moves hundreds of millions of roses.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many cut flowers are sold worldwide in one year?", 40000000000, "Global cut-flower sales reach tens of billions.", "famous_macro", "count", "famous_event"),
  },
  "Candy Counter": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many jelly beans fit in one candy-counter jar?", 950, "A candy jar can hold hundreds of jelly beans.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many jelly beans are in one pound?", 400, "One pound of jelly beans has a few hundred beans.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many M&M's can Mars make in one day?", 400000000, "Mars makes hundreds of millions of M&M's daily.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Gift Drawer": {
    source: SOURCE.nist,
    questions: [
      specialQuestion("How many bows are in a common gift-bow bag?", 40, "A gift-bow bag can hold a few dozen bows.", "familiar_anchor", "count", "sourced_typical"),
      specialQuestion("How many inches of ribbon are on a standard 10-yard spool?", 360, "A 10-yard ribbon spool has 360 inches.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How much do Americans spend on gift cards in one year?", 200000000000, "Gift cards are a hundred-billion-dollar habit.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Swim Meet Stopwatch": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many meters long is an Olympic swimming pool?", 50, "An Olympic pool is 50 meters long.", "iconic_exact", "distance", "iconic_object", true),
      specialQuestion("How many gallons of water are in an Olympic swimming pool?", 660000, "An Olympic pool holds hundreds of thousands of gallons.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many Americans swim for fitness or recreation each year?", 28000000, "U.S. swimming participation reaches tens of millions.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Summer Trailhead": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many ounces does a standard wide-mouth Nalgene bottle hold?", 32, "A standard wide-mouth Nalgene bottle holds 32 ounces.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many miles long is the Appalachian Trail?", 2190, "The Appalachian Trail runs about 2,190 miles.", "production_scale", "distance", "famous_event"),
      specialQuestion("How many visitors can Great Smoky Mountains National Park welcome in one year?", 13000000, "Great Smoky Mountains gets the most U.S. park visits.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many acres does Yellowstone National Park cover?", 2200000, "Yellowstone covers more than two million acres.", "famous_macro", "area", "natural_scale"),
  },
  "Light Show": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many drones can fly in a large public drone show?", 1000, "A large drone show can put about 1,000 drones up.", "production_scale", "count", "famous_event"),
      specialQuestion("How many LED modules light the Times Square Ball?", 32000, "The Times Square Ball uses tens of thousands of LEDs.", "familiar_anchor", "count", "famous_event"),
      specialQuestion("How many LED lights cover the Las Vegas Sphere exterior?", 1200000, "The Sphere uses about 1.2 million exterior lights.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many LEDs glow across the Las Vegas Sphere exterior?", 48000000, "The Sphere exterior uses tens of millions of LEDs.", "famous_macro", "count", "famous_event"),
  },
  "Breakfast Counter": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many eggs are in a standard carton?", 12, "A standard egg carton holds 12 eggs.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many eggs does Waffle House use in one year?", 272000000, "Waffle House uses hundreds of millions of eggs yearly.", "production_scale", "count", "famous_event"),
      specialQuestion("How many pancakes does IHOP serve in one year?", 700000000, "IHOP serves hundreds of millions of pancakes yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Pizza Night": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many slices are in a typical large pizza?", 8, "A large pizza is usually cut into eight slices.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many square inches are in a typical large pizza?", 154, "A 14-inch pizza has about 154 square inches.", "physical_capacity", "area", "named_standard"),
      specialQuestion("How many pizzas do Americans eat in one year?", 3000000000, "Americans eat billions of pizzas yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Movie Theater": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many seats are in a midsize movie-theater auditorium?", 220, "A midsize auditorium seats a few hundred people.", "familiar_anchor", "crowd", "sourced_typical"),
      specialQuestion("How many movie screens operate in the U.S.?", 40000, "The U.S. has tens of thousands of movie screens.", "production_scale", "count", "famous_event"),
      specialQuestion("How many movie tickets are sold in the U.S. in one year?", 800000000, "U.S. theaters sell hundreds of millions of tickets yearly.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many tickets can a record-setting movie sell worldwide?", 100000000, "A record-setting movie can sell huge worldwide totals.", "famous_macro", "count", "famous_event"),
  },
  "Aquarium Tank": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many gallons does a large home aquarium hold?", 125, "A large home aquarium can hold over 100 gallons.", "familiar_anchor", "capacity", "sourced_typical"),
      specialQuestion("How many feet long can a whale shark grow?", 40, "A whale shark can grow about 40 feet long.", "physical_capacity", "distance", "natural_scale"),
      specialQuestion("How many gallons are in Georgia Aquarium's Ocean Voyager exhibit?", 6300000, "Ocean Voyager holds millions of gallons.", "famous_macro", "capacity", "famous_event"),
    ],
    extra: specialQuestion("How many gallons can Monterey Bay Aquarium pump in one week?", 14000000, "Monterey Bay pumps millions of gallons weekly.", "famous_macro", "capacity", "famous_event"),
  },
  "Coffee Bar": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many coffee beans are in one pound of roasted coffee?", 3000, "One pound of roasted coffee has about 3,000 beans.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many cups of coffee can a busy coffee bar pour in one morning?", 1500, "A busy coffee bar can pour about 1,500 cups.", "physical_capacity", "rate", "named_standard"),
      specialQuestion("How many cups of coffee do Americans drink each day?", 400000000, "Americans drink hundreds of millions of cups daily.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many pounds of coffee does the U.S. import in one year?", 3000000000, "U.S. coffee imports are about three billion pounds.", "famous_macro", "weight", "famous_event"),
  },
  "Taco Stand": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many tortillas are in a common taco-shop stack?", 30, "A small taco-shop stack can hold about 30 tortillas.", "familiar_anchor", "count", "sourced_typical"),
      specialQuestion("How many Taco Bell restaurants are open worldwide?", 8000, "Taco Bell has thousands of restaurants worldwide.", "production_scale", "count", "famous_event"),
      specialQuestion("How many tacos can Taco Bell sell in one year?", 2000000000, "Taco Bell sells tacos at a billion-scale pace.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Bike Lane": {
    source: SOURCE.parkTool,
    questions: [
      specialQuestion("How many spokes are on a common road-bike wheel?", 32, "A common road-bike wheel has about 32 spokes.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many bicycles are sold in the U.S. in one year?", 15000000, "Americans buy millions of bicycles yearly.", "production_scale", "count", "famous_event"),
      specialQuestion("How many bicycles are made worldwide in one year?", 100000000, "World bicycle production reaches about 100 million.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Record Store": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many vinyl records fit in one packed record-store crate?", 140, "A packed crate can hold about 140 records.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many records can a small pressing plant make in one day?", 10000, "A small pressing plant can make thousands of records daily.", "production_scale", "rate", "famous_event"),
      specialQuestion("How many copies has Thriller sold worldwide?", 70000000, "Thriller has sold tens of millions of copies.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Farmers Market": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many pounds are in a bushel of peaches?", 50, "A bushel of peaches weighs about 50 pounds.", "familiar_anchor", "weight", "named_standard"),
      specialQuestion("How many farmers markets operate in the U.S.?", 8700, "The U.S. has thousands of farmers markets.", "production_scale", "count", "famous_event"),
      specialQuestion("How many pounds of apples does the U.S. grow in one year?", 11000000000, "The U.S. apple crop reaches billions of pounds.", "famous_macro", "weight", "famous_event"),
    ],
  },
  "Summer Camp": {
    source: SOURCE.censusQuickFacts,
    questions: [
      specialQuestion("How many campers sit at a large camp dining hall?", 250, "A large camp dining hall can seat hundreds.", "familiar_anchor", "crowd", "sourced_typical"),
      specialQuestion("How many accredited camps operate in the U.S.?", 3000, "The U.S. has thousands of accredited camps.", "production_scale", "count", "famous_event"),
      specialQuestion("How many campers attend U.S. summer camps each season?", 26000000, "U.S. camps serve tens of millions each season.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Photo Booth": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many photos are on a classic photo-booth strip?", 4, "A classic photo-booth strip has four photos.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many pixels are in a standard 4K image?", 8300000, "A 4K image has about 8.3 million pixels.", "object_anatomy", "count", "named_standard"),
      specialQuestion("How many photos are uploaded to Instagram each day?", 95000000, "Instagram gets tens of millions of uploads daily.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Dog Park": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many teeth does a typical adult dog have?", 42, "A typical adult dog has 42 teeth.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many dogs are adopted from U.S. shelters each year?", 2000000, "U.S. shelters adopt out millions of dogs yearly.", "production_scale", "count", "famous_event"),
      specialQuestion("How many pet dogs live in the United States?", 90000000, "The U.S. has tens of millions of pet dogs.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Bowling Alley": {
    source: SOURCE.mlb,
    questions: [
      specialQuestion("How many pins stand in a regulation bowling setup?", 10, "A bowling lane starts with 10 pins.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many bowling centers operate in the U.S.?", 3000, "The U.S. has thousands of bowling centers.", "production_scale", "count", "famous_event"),
      specialQuestion("How many people bowl in the U.S. in one year?", 67000000, "U.S. bowling participation reaches tens of millions.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Clock Shop": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many hours are marked on a standard clock face?", 12, "A standard clock face marks 12 hours.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many pounds does Big Ben's main bell weigh?", 30000, "Big Ben's main bell weighs about 30,000 pounds.", "production_scale", "weight", "famous_event"),
      specialQuestion("How many visitors tour Big Ben and Parliament in one year?", 1000000, "Big Ben and Parliament draw about a million visitors.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Beach Day": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many miles of ocean shoreline does California have?", 840, "California has hundreds of miles of ocean shoreline.", "familiar_anchor", "distance", "famous_event"),
      specialQuestion("How many grains of sand can fit in one teaspoon?", 100000, "A teaspoon of sand can hold about 100,000 grains.", "physical_capacity", "count", "natural_scale"),
      specialQuestion("How many visitors can U.S. national seashores welcome in one year?", 10000000, "National seashores welcome millions of visitors.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Thunderstorm Porch": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many gallons can a standard storm-drain inlet move in one minute?", 1000, "A storm-drain inlet can move about 1,000 gallons a minute.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many feet tall can a thunderstorm cloud grow?", 60000, "A tall thunderstorm cloud rises tens of thousands of feet.", "physical_capacity", "distance", "natural_scale"),
      specialQuestion("How many U.S. cloud-to-ground lightning flashes happen in one year?", 20000000, "The U.S. gets tens of millions of lightning flashes yearly.", "famous_macro", "count", "natural_scale"),
    ],
  },
  "Ice Cream Truck": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many ice-cream bars fit in one truck-window freezer?", 360, "A truck freezer can hold hundreds of bars.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many scoops can a busy ice-cream truck serve in one hot day?", 1050, "A busy truck can serve about 1,000 scoops.", "production_scale", "rate", "named_standard"),
      specialQuestion("How many gallons of ice cream do Americans eat in one year?", 1300000000, "Americans eat ice cream at a billion-gallon scale.", "famous_macro", "capacity", "famous_event"),
    ],
  },
  "Baseball Bullpen": {
    source: SOURCE.mlb,
    questions: [
      specialQuestion("How many stitches are on one major-league baseball?", 108, "A baseball has 108 double stitches.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many fans can Dodger Stadium hold?", 56000, "Dodger Stadium holds more than 50,000 fans.", "production_scale", "crowd", "famous_event"),
      specialQuestion("How many baseballs can MLB use in one season?", 900000, "MLB can use nearly a million baseballs.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many fans can MLB draw in one regular season?", 70000000, "MLB attendance reaches tens of millions.", "famous_macro", "crowd", "famous_event"),
  },
  "Fireworks Finale": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many sparklers come in one common party pack?", 36, "A common party pack can hold about 36 sparklers.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many feet high can a big public firework burst?", 1000, "A big public burst can open about 1,000 feet up.", "physical_capacity", "distance", "famous_event"),
      specialQuestion("How many shells did Macy's 2024 Fourth of July fireworks launch?", 60000, "Macy's 2024 show launched about 60,000 shells.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Memorial Day Cookout": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many stars are on one U.S. flag?", 50, "A U.S. flag has 50 stars.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many flags do service members place at Arlington before Memorial Day?", 260000, "Arlington's Flags In places hundreds of thousands of flags.", "physical_capacity", "count", "famous_event"),
      specialQuestion("How many visitors can Arlington National Cemetery welcome in one year?", 3000000, "Arlington welcomes millions of visitors each year.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many people can attend the National Memorial Day Parade in Washington?", 250000, "The National Memorial Day Parade can draw hundreds of thousands.", "famous_macro", "crowd", "famous_event"),
  },
  "Countdown Night": {
    source: SOURCE.timesSquare,
    questions: [
      specialQuestion("How many circular crystals are on the Times Square Ball?", 2688, "The current Times Square Ball uses 2,688 Waterford crystals.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many LED lights are inside the current Times Square Ball?", 32256, "The current Times Square Ball uses 32,256 LEDs.", "production_scale", "count", "iconic_object"),
      specialQuestion("How many U.S. viewers watch the Times Square New Year's broadcast?", 22000000, "The broadcast can draw tens of millions of viewers.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Thanksgiving Table": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many cranberries fit in one pound of fresh cranberries?", 450, "A pound of cranberries has a few hundred berries.", "familiar_anchor", "count", "iconic_object"),
      specialQuestion("How many guests can a big community Thanksgiving dinner serve?", 1200, "A big community dinner can serve more than 1,000 guests.", "physical_capacity", "crowd", "famous_event"),
      specialQuestion("How many people watch the Macy's Thanksgiving Day Parade on TV?", 25000000, "The parade can draw tens of millions of TV viewers.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Veterans Day Parade": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many flags fly around the National Mall on Veterans Day?", 600, "A Mall ceremony can wave hundreds of small flags.", "familiar_anchor", "count", "famous_event"),
      specialQuestion("How many marching steps fit into one parade mile?", 2500, "A parade mile takes a few thousand marching steps.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How many people can a major Veterans Day parade draw?", 500000, "A major parade can draw hundreds of thousands of spectators.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Easter Egg Hunt": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many plastic eggs are hidden in a big park Easter hunt?", 1000, "A big park hunt can hide around 1,000 plastic eggs.", "physical_capacity", "capacity", "famous_event"),
      specialQuestion("How many jelly beans are in one big Easter candy jar?", 1200, "A big candy jar holds more than 1,000 jelly beans.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many people can the White House Easter Egg Roll host?", 30000, "The Easter Egg Roll can bring tens of thousands of guests.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Juneteenth Block Party": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many people live in Galveston, Texas?", 50000, "Galveston is home to about 50,000 people.", "familiar_anchor", "crowd", "famous_event"),
      specialQuestion("How many cups can a five-gallon drink cooler pour?", 80, "A five-gallon cooler pours about 80 cups.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many visitors can the National Museum of African American History and Culture welcome in one year?", 2000000, "The museum welcomes millions of visitors.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many people can attend Juneteenth events across the U.S.?", 10000000, "Juneteenth events can draw millions nationwide.", "famous_macro", "crowd", "famous_event"),
  },
  "Berry Patch": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many blueberries are in one pound?", 275, "One pound of blueberries has a few hundred berries.", "familiar_anchor", "weight", "named_standard"),
      specialQuestion("How many strawberries fit in one quart basket?", 30, "A quart basket holds a few dozen strawberries.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many pounds of strawberries can California harvest in one year?", 1800000000, "California can harvest strawberries at a billion-pound scale.", "famous_macro", "weight", "famous_event"),
    ],
  },
  "Bookstore Table": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many pages are in a typical paperback novel?", 320, "A typical paperback can run a few hundred pages.", "familiar_anchor", "count", "sourced_typical"),
      specialQuestion("How many independent bookstores operate in the U.S.?", 2500, "The U.S. has thousands of independent bookstores.", "production_scale", "count", "famous_event"),
      specialQuestion("How many print books can sell in the U.S. in one year?", 750000000, "U.S. print-book sales are about 750 million yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "National Park Postcard": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many miles of road cross Yellowstone National Park?", 466, "Yellowstone has hundreds of miles of roads.", "familiar_anchor", "distance", "famous_event"),
      specialQuestion("How many acres does Yellowstone National Park cover?", 2200000, "Yellowstone covers more than two million acres.", "physical_capacity", "area", "natural_scale"),
      specialQuestion("How many visitors can the Grand Canyon welcome in one year?", 5000000, "Grand Canyon visits are about five million yearly.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Father's Day Gifts": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many briquettes fit in a standard charcoal chimney starter?", 100, "A chimney starter holds about 100 briquettes.", "object_anatomy", "capacity", "named_standard"),
      specialQuestion("How many cards fit on one full greeting-card store rack?", 420, "A full greeting-card rack can hold hundreds of cards.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How much do Americans spend for Father's Day?", 24000000000, "Father's Day spending reaches tens of billions.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many Father's Day cards are exchanged in the U.S. each year?", 72000000, "Americans exchange tens of millions of Father's Day cards.", "famous_macro", "count", "famous_event"),
  },
  "Bee Yard": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many bees can live in one healthy hive?", 50000, "A healthy hive can hold tens of thousands of bees.", "physical_capacity", "count", "natural_scale"),
      specialQuestion("How many flower visits can one strong hive make in a day?", 1000000, "A strong hive can make about a million flower visits.", "production_scale", "count", "natural_scale"),
      specialQuestion("How many almonds depend on California bee pollination each year?", 3000000000000, "California almonds depend on trillions of bee visits.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many bees can work across California almond pollination?", 30000000000, "Almond bloom can use tens of billions of bees.", "famous_macro", "count", "famous_event"),
  },
  "In the Orchestra Pit": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many piano keys are on the instrument in an orchestra pit?", 88, "A full-size piano has 88 keys.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many sheet-music pages are on a full orchestra stand cart?", 1200, "A pit stand cart carries more than 1,000 pages.", "physical_capacity", "capacity", "iconic_object"),
      specialQuestion("How many people can Coachella draw across one festival weekend?", 400000, "Coachella can draw hundreds of thousands of visits.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many notes can an orchestra season put on page?", 5000000, "An orchestra season can put millions of notes on page.", "famous_macro", "count", "famous_event"),
  },
  "Under the Tree": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many wrapped gifts can fit under a family Christmas tree?", 40, "A full tree skirt can hold a few dozen gifts.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many yards of ribbon does a holiday gift-wrap table use?", 100, "A wrapping table can run through about 100 yards of ribbon.", "physical_capacity", "distance", "iconic_object"),
      specialQuestion("How many Christmas trees are sold in the U.S. each year?", 25000000, "The U.S. sells tens of millions of Christmas trees yearly.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many packages can U.S. carriers deliver during the holiday season?", 3000000000, "Holiday deliveries can number in the billions.", "famous_macro", "count", "famous_event"),
  },
  "Sock Basket": {
    source: SOURCE.nist,
    questions: [
      specialQuestion("How many socks fit in one full laundry basket?", 80, "A full laundry basket can hold dozens of socks.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many pounds can a full laundry basket weigh?", 35, "A heavy laundry basket can weigh a few dozen pounds.", "physical_capacity", "weight", "sourced_typical"),
      specialQuestion("How many garments can a busy tailor shop finish in one year?", 12000, "A busy tailor shop can finish thousands of garments yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Halfpipe Session": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many skateboards can line one skate-shop wall?", 90, "A full skate-shop wall can hold around 90 boards.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many feet long is a competition vert halfpipe?", 60, "A competition vert halfpipe is roughly 60 feet long.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How many spectators can X Games events draw over a weekend?", 100000, "X Games crowds can draw about 100,000 people.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Toy Train Window": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many toy train cars fit in a store-window display?", 48, "A window display can hold dozens of toy train cars.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many feet of track fit around a store-window toy train loop?", 32, "A window loop can use a few dozen feet of track.", "physical_capacity", "distance", "named_standard"),
      specialQuestion("How many riders can the New York City subway carry in one day?", 3500000, "The NYC subway can carry millions of riders daily.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Toy Train Table": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many wooden track pieces fit on a crowded toy train table?", 120, "A toy train table can hold more than 100 track pieces.", "familiar_anchor", "capacity", "iconic_object"),
      specialQuestion("How many station stops are marked on the London Underground map?", 272, "The Tube map has hundreds of station stops.", "physical_capacity", "count", "famous_event"),
      specialQuestion("How many riders can the New York City subway carry in one day?", 3500000, "The NYC subway can carry millions of riders daily.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many riders can Tokyo's Yamanote Line carry in one day?", 3600000, "Tokyo's Yamanote Line can carry millions daily.", "famous_macro", "crowd", "famous_event"),
  },
  "Yellowstone Geyser Basin": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many named geysers are in Yellowstone National Park?", 500, "Yellowstone has about 500 named geysers.", "familiar_anchor", "count", "famous_event"),
      specialQuestion("How many feet high does Old Faithful usually shoot water?", 180, "Old Faithful eruptions rise around 180 feet.", "physical_capacity", "distance", "natural_scale"),
      specialQuestion("How many people visit Yellowstone National Park in a year?", 4000000, "Yellowstone draws about 4 million visitors a year.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Donut Proofing Rack": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many donuts fit on a full bakery proofing rack?", 480, "A full proofing rack can hold hundreds of donuts.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many pounds of dough does a busy donut shop use in a day?", 750, "A busy donut shop can use hundreds of pounds of dough.", "production_scale", "weight", "sourced_typical"),
      specialQuestion("How many donuts does Dunkin' sell worldwide in a year?", 2900000000, "Dunkin' sells donuts at a billion-plus scale.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Light Show": {
    source: SOURCE.sphere,
    questions: [
      specialQuestion("How many drones can fly in a modern public drone show?", 1000, "A large drone show can put about 1,000 drones up.", "production_scale", "count", "famous_event"),
      specialQuestion("How many LEDs can fit in a stadium video-board cabinet?", 250000, "A stadium video-board cabinet can pack in hundreds of thousands of LEDs.", "physical_capacity", "count", "famous_event"),
      specialQuestion("How many LED pucks cover the Las Vegas Sphere exterior?", 1200000, "The Sphere exterior uses about 1.2 million LED pucks.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Movie Palace Matinee": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many seats fill a classic movie-palace auditorium?", 1800, "A movie palace can seat well over 1,000 people.", "familiar_anchor", "crowd", "sourced_typical"),
      specialQuestion("How many kernels can pop from one pound of popcorn?", 16000, "One pound of kernels can pop into tens of thousands of pieces.", "physical_capacity", "count", "named_standard"),
      specialQuestion("How many tickets did Barbie sell worldwide in theaters?", 160000000, "Barbie sold tickets at a hundred-million scale worldwide.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Swimming Pool Deck": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many gallons fill a standard backyard swimming pool?", 20000, "A standard backyard pool holds about 20,000 gallons.", "familiar_anchor", "capacity", "named_standard"),
      specialQuestion("How many lane lines divide an Olympic swimming pool?", 10, "An Olympic pool has 10 lanes.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many people visit U.S. public swimming pools in a year?", 300000000, "Public pools draw hundreds of millions of visits yearly.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Noodle Bar Steam Table": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many instant-ramen packs are in one standard case?", 24, "A standard instant-ramen case holds 24 packs.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many pounds of noodles can a restaurant stockpot cook at once?", 50, "A big stockpot can cook dozens of pounds of noodles.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many instant ramen servings are eaten worldwide in one year?", 120000000000, "Instant ramen is eaten at a hundred-billion-serving scale.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Food Pantry Shelf": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many cans are in one standard food-pantry case?", 24, "A standard pantry case usually holds 24 cans.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many pounds of food can one pantry pallet hold?", 2000, "One food pallet can carry about a ton.", "physical_capacity", "weight", "named_standard"),
      specialQuestion("How many meals does Feeding America help provide in a year?", 5000000000, "Feeding America helps provide billions of meals yearly.", "famous_macro", "count", "famous_event"),
    ],
  },
  "Patriotic Flag Box": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many stripes are on one U.S. flag?", 13, "A U.S. flag has 13 stripes.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many flags fit in a standard cemetery flag case?", 144, "A flag case can hold a gross of small flags.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many people watch Fourth of July fireworks in the U.S.?", 140000000, "Fourth of July fireworks reach a hundred-million-plus audience.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Telescope Mirror Lab": {
    source: SOURCE.nasa,
    questions: [
      specialQuestion("How many inches wide is the Hubble Space Telescope mirror?", 94, "Hubble's primary mirror is about 94 inches wide.", "familiar_anchor", "distance", "famous_event"),
      specialQuestion("How many pounds does the Hale Telescope mirror weigh?", 28000, "The Hale mirror weighs about 28,000 pounds.", "physical_capacity", "weight", "famous_event"),
      specialQuestion("How many miles from Earth does the James Webb Space Telescope orbit?", 1000000, "The Webb telescope works about 1 million miles from Earth.", "famous_macro", "distance", "famous_event"),
    ],
    extra: specialQuestion("How many miles separate Earth from the nearest star?", 25300000000000, "The nearest star is about 25 trillion miles away.", "famous_macro", "distance", "natural_scale"),
  },
  "Photo Booth Strip": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many frames are on a classic photo-booth strip?", 4, "A classic booth strip has four frames.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many prints can a standard photo-booth media roll make?", 700, "A photo-booth media roll can make hundreds of prints.", "production_scale", "count", "named_standard"),
      specialQuestion("How many photos can be stored on a 128 GB phone?", 32000, "A 128 GB phone can hold tens of thousands of photos.", "famous_macro", "count", "named_standard"),
    ],
  },
  "Stormy Umbrella Stand": {
    source: SOURCE.usgsWater,
    questions: [
      specialQuestion("How many inches wide is a standard golf umbrella?", 60, "A golf umbrella opens to about 60 inches wide.", "familiar_anchor", "distance", "named_standard"),
      specialQuestion("How many gallons does a standard home rain barrel hold?", 55, "A home rain barrel holds about 55 gallons.", "physical_capacity", "capacity", "named_standard"),
      specialQuestion("How many lightning flashes happen on Earth in one day?", 8000000, "Earth gets millions of lightning flashes daily.", "famous_macro", "count", "natural_scale"),
    ],
  },
  "Forest Fire Lookout": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many feet tall is a common fire lookout tower?", 80, "A fire lookout tower can stand about 80 feet tall.", "familiar_anchor", "distance", "named_standard"),
      specialQuestion("How many miles can a lookout see on a clear day?", 30, "A clear lookout view can stretch for dozens of miles.", "physical_capacity", "distance", "natural_scale"),
      specialQuestion("How many acres can a large western wildfire burn?", 1000000, "A major western wildfire can burn around a million acres.", "famous_macro", "area", "natural_scale"),
    ],
  },
  "Track Meet Timing Tent": {
    source: SOURCE.olympics,
    questions: [
      specialQuestion("How many meters around is one lap on a regulation track?", 400, "One regulation track lap is 400 meters.", "familiar_anchor", "distance", "regulation"),
      specialQuestion("How many lanes are on a standard outdoor track?", 8, "A standard outdoor track usually has eight lanes.", "iconic_exact", "count", "regulation", true),
      specialQuestion("How many runners finish the New York City Marathon?", 55000, "The New York City Marathon has about 55,000 finishers.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Miniature Train Window": {
    source: SOURCE.apta,
    questions: [
      specialQuestion("How many feet of track does a beginner model railroad layout use?", 40, "A beginner model railroad can use a few dozen feet of track.", "familiar_anchor", "distance", "named_standard"),
      specialQuestion("How many station stops are marked on the London Underground map?", 272, "The Tube map has hundreds of station stops.", "physical_capacity", "count", "famous_event"),
      specialQuestion("How many riders can the New York City subway carry in one day?", 3500000, "The NYC subway can carry millions of riders daily.", "famous_macro", "crowd", "famous_event"),
    ],
  },
  "Grand Pianos": {
    source: SOURCE.smithsonian,
    questions: [
      specialQuestion("How many keys are on a full-size grand piano?", 88, "A full-size piano has 88 keys.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many pounds does a concert grand piano weigh?", 990, "A concert grand can weigh close to 1,000 pounds.", "object_anatomy", "weight", "iconic_object"),
      specialQuestion("How many pianos can Steinway build in one year?", 3000, "Steinway builds pianos at a few-thousand-per-year scale.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many pianos are in U.S. homes?", 10000000, "U.S. homes hold pianos at a ten-million scale.", "famous_macro", "count", "famous_event"),
  },
  "Rubik Cubes": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many competitors can a major speedcubing championship host?", 1000, "A major speedcubing championship can host about 1,000 competitors.", "familiar_anchor", "crowd", "famous_event"),
      specialQuestion("How many solves are attempted at a major speedcubing championship?", 10000, "A major championship can produce tens of thousands of solves.", "production_scale", "count", "famous_event"),
      specialQuestion("How many Rubik's Cubes have sold worldwide?", 450000000, "Rubik's Cube sales are in the hundreds of millions.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many official solves has the World Cube Association logged?", 1000000000, "Official speedcubing solves have reached billion-scale.", "famous_macro", "count", "famous_event"),
  },
  "Peach Orchards": {
    source: SOURCE.usdaFood,
    questions: [
      specialQuestion("How many pounds are in one bushel of peaches?", 48, "A peach bushel weighs about 48 pounds.", "familiar_anchor", "weight", "named_standard"),
      specialQuestion("How many acres does a mid-size peach orchard cover?", 100, "A mid-size orchard can cover about 100 acres.", "object_anatomy", "area", "natural_scale"),
      specialQuestion("How many pounds of peaches does Georgia grow in a year?", 70000000, "Georgia grows peaches at a tens-of-millions-of-pounds scale.", "famous_macro", "weight", "famous_event"),
    ],
    extra: specialQuestion("How many pounds of peaches does California grow in a year?", 500000000, "California grows peaches at a hundreds-of-millions scale.", "famous_macro", "weight", "famous_event"),
  },
  "Campgrounds": {
    source: SOURCE.britannicaScience,
    questions: [
      specialQuestion("How many square feet are in a standard campground tent pad?", 100, "A tent pad is often around 100 square feet.", "familiar_anchor", "area", "named_standard"),
      specialQuestion("How many gallons does an RV freshwater tank hold?", 40, "An RV freshwater tank can hold dozens of gallons.", "production_scale", "capacity", "named_standard"),
      specialQuestion("How many people camp in U.S. national parks in a year?", 13000000, "National park camping runs in the millions of visits yearly.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many acres does the National Park Service manage?", 85000000, "The National Park Service manages tens of millions of acres.", "famous_macro", "area", "famous_event"),
  },
  "Stage Lighting": {
    source: SOURCE.sphere,
    questions: [
      specialQuestion("How many watts does a common theater spotlight draw?", 750, "A theater spotlight can draw hundreds of watts.", "familiar_anchor", "rate", "named_standard"),
      specialQuestion("How many feet of cable can a theater lighting rig use?", 5000, "A theater lighting rig can use thousands of feet of cable.", "production_scale", "distance", "named_standard"),
      specialQuestion("How many lighting cues can fire during a Broadway musical run?", 54000, "A long Broadway run can trigger tens of thousands of lighting cues.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many LED pucks cover the Las Vegas Sphere exterior?", 1200000, "The Sphere exterior uses about 1.2 million LED pucks.", "famous_macro", "count", "famous_event"),
  },
  "Theater Lighting": {
    source: SOURCE.sphere,
    questions: [
      specialQuestion("How many lights can hang on a theater electrics pipe?", 36, "One theater pipe can carry dozens of lights.", "familiar_anchor", "count", "named_standard"),
      specialQuestion("How many watts can one stage lighting circuit handle?", 2400, "A stage circuit can handle a few thousand watts.", "physical_capacity", "rate", "named_standard"),
      specialQuestion("How many lighting cues can fire during a Broadway musical run?", 54000, "A long Broadway run can trigger tens of thousands of lighting cues.", "famous_macro", "count", "famous_event"),
    ],
    extra: specialQuestion("How many LED pucks cover the Las Vegas Sphere exterior?", 1200000, "The Sphere exterior uses about 1.2 million LED pucks.", "famous_macro", "count", "famous_event"),
  },
  "Observatories": {
    source: SOURCE.nasa,
    questions: [
      specialQuestion("How many stars can a dark-sky eye see without a telescope?", 2500, "A dark sky can show about 2,500 stars to the eye.", "familiar_anchor", "count", "natural_scale"),
      specialQuestion("How many pounds does the Hale Telescope mirror weigh?", 28000, "The Hale Telescope mirror weighs about 28,000 pounds.", "object_anatomy", "weight", "famous_event"),
      specialQuestion("How many stars are in the Milky Way?", 100000000000, "The Milky Way contains about 100 billion stars.", "famous_macro", "count", "natural_scale"),
    ],
    extra: specialQuestion("How many miles separate Earth from the nearest star?", 25300000000000, "The nearest star is about 25 trillion miles away.", "famous_macro", "distance", "natural_scale"),
  },
  "Baseball Diamonds": {
    source: SOURCE.mlb,
    questions: [
      specialQuestion("How many stitches are on one Major League baseball?", 108, "A Major League baseball has 108 red stitches.", "iconic_exact", "count", "iconic_object", true),
      specialQuestion("How many feet is it from home plate to first base?", 90, "A baseball diamond puts first base 90 feet from home.", "physical_capacity", "distance", "regulation"),
      specialQuestion("How many fans can Dodger Stadium hold?", 56000, "Dodger Stadium holds about 56,000 fans.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many baseballs can MLB use in one regular season?", 900000, "MLB can use close to a million baseballs in a season.", "famous_macro", "count", "famous_event"),
  },
  "Baseball Fields": {
    source: SOURCE.mlb,
    questions: [
      specialQuestion("How many pounds of clay are in a regulation baseball mound?", 2000, "A baseball mound can use around a ton of clay.", "familiar_anchor", "weight", "regulation"),
      specialQuestion("How many square feet are inside a baseball infield diamond?", 8100, "The basepaths frame about 8,100 square feet.", "physical_capacity", "area", "regulation"),
      specialQuestion("How many fans can Yankee Stadium hold?", 47000, "Yankee Stadium holds about 47,000 fans.", "famous_macro", "crowd", "famous_event"),
    ],
    extra: specialQuestion("How many baseballs can MLB use in one regular season?", 900000, "MLB can use close to a million baseballs in a season.", "famous_macro", "count", "famous_event"),
  },
};

const EXACT_OPTIONS_BY_PROFILE = {
  breakfast: [],
  movie: [],
  money: [],
  clock_tower: [
    ["How many hours are marked on a standard clock face?", 12, "A standard clock face marks 12 hours.", SOURCE.nist],
  ],
  music: [
    ["How many keys are on a full-size piano?", 88, "A full-size piano has 88 keys.", SOURCE.smithsonian, /orchestra|piano/i],
  ],
  games: [
    ["How many wooden blocks are in a classic Jenga tower?", 54, "A classic Jenga tower starts with 54 wooden blocks.", SOURCE.britannicaScience, /game night|game table|board game|tabletop|jenga/i],
  ],
  school: [],
  mail: [],
  sports: [
    ["How many stitches are on one major-league baseball?", 108, "A baseball has 108 double stitches.", SOURCE.mlb, /baseball|bullpen|dugout|bat/i],
    ["How many pins stand in a regulation bowling setup?", 10, "A bowling lane starts with 10 pins.", SOURCE.mlb, /bowling/i],
  ],
  baseball: [
    ["How many stitches are on one Major League baseball in {theScene}?", 108, "A Major League baseball has 108 red stitches.", SOURCE.mlb],
  ],
  bowling: [
    ["How many pins stand in a regulation bowling setup in {theScene}?", 10, "A bowling lane starts with 10 pins.", SOURCE.mlb],
  ],
  golf: [
    ["How many dimples are on a regulation golf ball in {theScene}?", 336, "A regulation golf ball commonly has 336 dimples.", SOURCE.mlb],
  ],
  basketball: [
    ["How many panels are on a regulation basketball in {theScene}?", 8, "A regulation basketball has eight panels.", SOURCE.mlb],
  ],
  skate: [
    ["How many wheels are on one standard skateboard in {theScene}?", 4, "A standard skateboard has four wheels.", SOURCE.mlb],
  ],
  bike: [
    ["How many spokes are on a common road-bike wheel in {theScene}?", 32, "A common road-bike wheel has about 32 spokes.", SOURCE.parkTool],
  ],
  clock: [
    ["How many hours are marked on a standard clock face in {theScene}?", 12, "A standard clock face marks 12 hours.", SOURCE.nist],
  ],
  pool: [
    ["How many lanes are in an Olympic swimming pool?", 10, "An Olympic swimming pool has 10 lanes.", SOURCE.usgsWater, /swim|swimming|lifeguard|water park|pool deck|backyard pool|lesson/i],
  ],
  school: [
    ["How many sheets are in a fresh ream of printer paper in {theScene}?", 500, "A fresh paper ream has 500 sheets.", SOURCE.smithsonian, /paper|print|classroom|school|library/i],
  ],
  boardwalk_arcade: [
    ["How many dots are in the original Pac-Man maze in {theScene}?", 240, "The original Pac-Man maze has 240 dots.", SOURCE.britannicaScience],
  ],
  toy_chest: [
    ["How many cards are in a standard Uno deck in {theScene}?", 112, "A standard Uno deck has 112 cards.", SOURCE.britannicaScience],
  ],
  transit: [],
  school_bus: [
    ["How many students fit on one full-size school bus?", 72, "A full-size school bus often seats about 72 students.", SOURCE.apta],
  ],
  pool: [
    ["How many lanes are in an Olympic swimming pool in {theScene}?", 10, "An Olympic swimming pool has 10 lanes.", SOURCE.usgsWater],
  ],
  apple: [],
  art: [
    ["How many crayons are in a classic big Crayola box?", 64, "A classic big Crayola box has 64 crayons.", SOURCE.smithsonian, /art studio|school supply|crayon/i],
  ],
};

function source(title, url, publisher, accessedDate = "2026-05-21") {
  return { title, url, publisher, accessedDate };
}

function item(unit, verbPhrase, baseAnswer, fact, estimationMode, anchorType = "named_standard") {
  // Older recipe drafts used "famous_macro" as a positional marker. Keep the
  // constructor forgiving so macro items resolve to a valid estimation mode.
  if (estimationMode === "famous_macro") {
    return {
      unit,
      verbPhrase,
      baseAnswer,
      fact,
      estimationMode: anchorType ?? "count",
      anchorType: "famous_event",
    };
  }
  return { unit, verbPhrase, baseAnswer, fact, estimationMode, anchorType };
}

function variant(unit, verbPhrase, baseAnswer, fact, estimationMode, anchorType = "named_standard") {
  return { ...item(unit, verbPhrase, baseAnswer, fact, estimationMode, anchorType), skipOverride: true };
}

const PROFILE_VARIANTS = Object.freeze({
  space: [
    [
      variant("eyepieces", "fit in a telescope loaner case", 96, "A telescope case can hold dozens of eyepieces.", "capacity"),
      variant("seats", "fit under a planetarium dome", 300, "A planetarium dome can seat hundreds of sky watchers.", "capacity"),
      variant("model rockets", "stand on a club launch rack", 80, "A launch rack can hold dozens of model rockets.", "capacity"),
      variant("star-map dots", "cover a public sky chart", 1200, "A public sky chart can show more than 1,000 stars.", "count"),
    ],
    [
      variant("miles", "separate Earth and the Moon", 239000, "The Moon is about 239,000 miles away.", "distance", "natural_scale"),
      variant("visitors", "can a major planetarium welcome in one year", 1000000, "A major planetarium can welcome about a million visitors.", "crowd", "famous_event"),
      variant("pounds of thrust", "can a powerful rocket engine produce", 1000000, "A powerful rocket engine can produce about a million pounds of thrust.", "weight", "natural_scale"),
      variant("miles", "would wrap around the Moon's equator", 6800, "The Moon's equator is roughly 6,800 miles around.", "distance", "natural_scale"),
    ],
    [
      variant("stars", "sit in the Milky Way", 100000000000, "The Milky Way has roughly 100 billion stars.", "count", "natural_scale"),
      variant("people", "can watch a famous rocket launch online", 10000000, "A famous rocket launch can draw millions of viewers.", "crowd", "famous_event"),
      variant("people", "can watch a major eclipse across its path", 30000000, "A major eclipse can draw tens of millions of watchers.", "crowd", "famous_event"),
    ],
    [
      variant("stars", "sit in a large galaxy cluster", 100000000000000, "A large galaxy cluster can contain hundreds of trillions of stars.", "count", "natural_scale"),
      variant("people", "can watch a major eclipse across its path", 30000000, "A major eclipse can draw tens of millions of watchers.", "crowd", "famous_event"),
      variant("views", "can a famous rocket-launch livestream draw", 10000000, "A famous rocket launch can draw millions of livestream views.", "crowd", "famous_event"),
      variant("stars", "can sit in a giant galaxy supercluster", 500000000000000, "A giant supercluster can contain hundreds of trillions of stars.", "count", "natural_scale"),
    ],
  ],
  music: [
    [
      variant("guitar strings", "are on a full guitar-shop rack", 240, "A guitar rack can show hundreds of strings.", "count"),
      variant("microphones", "fit in a backstage audio case", 120, "An audio case can hold more than 100 microphones.", "capacity"),
      variant("piano keys", "sit on a full-size piano", 88, "A full-size piano has 88 keys.", "count", "iconic_object"),
    ],
    [
      variant("seats", "fit in a large concert hall", 2200, "A large concert hall can seat a few thousand people.", "capacity"),
      variant("voices", "can sing in a festival choir", 1000, "A festival choir can gather about 1,000 voices.", "crowd"),
      variant("guitar strings", "hang across a busy guitar-shop wall", 1440, "A guitar-shop wall can show more than 1,000 strings.", "count"),
    ],
    [
      variant("attendees", "can a major outdoor music festival draw", 400000, "A major music festival can draw hundreds of thousands.", "crowd", "famous_event"),
      variant("streams", "can a major festival livestream draw", 10000000, "A major festival livestream can draw millions of streams.", "count", "famous_event"),
      variant("tickets", "can a famous concert tour sell", 3000000, "A famous concert tour can sell millions of tickets.", "count", "famous_event"),
    ],
    [
      variant("streams", "can a major festival livestream draw", 10000000, "A major festival livestream can draw millions of streams.", "count", "famous_event"),
      variant("tickets", "can a famous concert tour sell", 3000000, "A famous concert tour can sell millions of tickets.", "count", "famous_event"),
      variant("notes", "can an orchestra season put on page", 5000000, "An orchestra season can put millions of notes on page.", "count", "famous_event"),
    ],
  ],
  trail_nature: [
    [
      variant("feet", "can a mature redwood stand tall", 350, "A mature redwood can stand hundreds of feet tall.", "distance", "natural_scale"),
      variant("trail signs", "can line a long national-park route", 600, "A long park route can carry hundreds of trail signs.", "count"),
      variant("logs", "fit in one campground firewood rack", 180, "A campground rack can hold hundreds of split logs.", "capacity"),
    ],
    [
      variant("visitors", "can a popular trailhead see in one day", 5000, "A popular trailhead can see thousands of visitors.", "crowd"),
      variant("leaf bags", "can a city park fill in one fall weekend", 12000, "A city park can fill thousands of leaf bags in fall.", "count"),
      variant("campers", "can a major campground host in one summer", 100000, "A major campground can host six figures of campers.", "crowd"),
    ],
    [
      variant("acres", "can a major national park cover", 1000000, "A major national park can cover about a million acres.", "area", "natural_scale"),
      variant("visitors", "can a major national park welcome in one year", 5000000, "A major national park can welcome millions of visitors.", "crowd", "famous_event"),
      variant("trees", "can stand in a huge protected forest", 100000000, "A huge protected forest can hold hundreds of millions of trees.", "count", "natural_scale"),
    ],
    [
      variant("visitors", "can a major national park welcome in one year", 5000000, "A major national park can welcome millions of visitors.", "crowd", "famous_event"),
      variant("acres", "can a huge protected wilderness cover", 5000000, "A huge wilderness can cover millions of acres.", "area", "natural_scale"),
      variant("campfire logs", "can a national campground season burn", 5000000, "A national campground season can burn millions of logs.", "count", "famous_event"),
    ],
  ],
});

function specialQuestion(prompt, answer, fact, questionMove, estimationMode, anchorType, iconicExact = false, topicFacet = null) {
  return { prompt, answer, fact, questionMove, estimationMode, anchorType, iconicExact, topicFacet };
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00Z`);
}

function isFridayDateKey(dateKey) {
  return parseDateKey(dateKey).getUTCDay() === 5;
}

function hashNumber(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function formatAnswer(value) {
  return Number(value).toLocaleString("en-US");
}

function plainFactText(fact, answer) {
  const answerText = formatAnswer(answer);
  return String(fact)
    .replace(/\bnearly six figures of ([a-z -]+)/gi, `about ${answerText} $1`)
    .replace(/\bsix figures of ([a-z -]+)/gi, `about ${answerText} $1`)
    .replace(/\bfive figures of ([a-z -]+)/gi, `about ${answerText} $1`)
    .replace(/\bseven figures of ([a-z -]+)/gi, `about ${answerText} $1`)
    .replace(/\beight figures of ([a-z -]+)/gi, `about ${answerText} $1`)
    .replace(/\bnine figures of ([a-z -]+)/gi, `about ${answerText} $1`);
}

function scenePhrase(theme) {
  return `the ${compactScene(theme)}`;
}

function compactScene(theme) {
  return String(theme)
    .replace(/\s+/g, " ")
    .replace(/^(in|under)\s+the\s+/i, "")
    .trim()
    .toLowerCase();
}

function articleForScene(theme) {
  const text = compactScene(theme);
  return /^[aeiou]/i.test(text) ? `an ${text}` : `a ${text}`;
}

function themeSubject(theme, profileKey) {
  const text = compactScene(theme)
    .replace(/\bst\.\s+/g, "st. ")
    .replace(/\b(movie lobby popcorn|movie theater marquee|movie palace matinee|multiplex night|drive-in lot)\b/i, "movie theater")
    .replace(/\b(art studio supply cart)\b/i, "art studio")
    .replace(/\b(science museum lens lab|museum coat check|museum gallery wall|museum gift shop shelf)\b/i, "museum")
    .replace(/\b(public art mural|street mural|gallery wall)\b/i, "public art")
    .replace(/\b(pottery studio kiln|pottery glaze shelf|ceramics kiln room|pottery wheel)\b/i, "ceramics studio")
    .replace(/\b(climbing gym wall|climbing gym)\b/i, "climbing gym")
    .replace(/\b(backyard grill|tailgate cooler|picnic basket|road trip thermos|road trip cooler)\b/i, "cookout")
    .replace(/\b(donut rack morning)\b/i, "donut shop")
    .replace(/\b(toy chest|toy brick cleanup|toy store aisle|toy train window|toy train table)\b/i, "toy fair")
    .replace(/\b(game night table|game night|board game table)\b/i, "tabletop game")
    .replace(/\b(post office sorting|mail sorting floor|post office|apartment mailroom)\b/i, "post office")
    .replace(/\b(fire station gear bay|fire station bay|fire station|firehouse hose rack|firehouse open bay)\b/i, "firehouse")
    .replace(/\b(planetarium dome night|planetarium night|planetarium dome|winter star dome|winter sky dome|night sky map|backyard telescope|observatory dome|observatory telescope night|moon watch|model rocket launch|rocket club launch table|rocket field|model rocket range|telescope night)\b/i, "space show")
    .replace(/\b(backyard bird feeder|bird feeder station|bird feeder|winter bird feeder|spring bird migration|bird migration map)\b/i, "birdwatching")
    .replace(/\b(aquarium touch tank|aquarium tank|aquarium tunnel|aquarium window tunnel|reef window|shark tunnel|deep-sea giants)\b/i, "aquarium")
    .replace(/\b(cornfield seed row|cornfield row|corn maze|cornfield)\b/i, "cornfield")
    .replace(/\b(dairy milking parlor|dairy barn|milk house)\b/i, "dairy")
    .replace(/\b(diner griddle rush|pancake griddle|pancake breakfast|roadside diner|breakfast counter|kitchen timer shelf)\b/i, "diner")
    .replace(/\b(train station clock|rail station clock)\b/i, "station clock")
    .replace(/\b(print shop paper stack|print shop rollers|print shop roll|print shop|small print press|newspaper press room)\b/i, "print shop")
    .replace(/\b(garden center seed rack|garden nursery|greenhouse seed trays|greenhouse flats|rooftop garden beds)\b/i, "garden")
    .replace(/\b(snow plow garage|snowplow route|snowplow yard|snow plow)\b/i, "snowplow")
    .replace(/\b(pool party|pool deck|public pool lanes|lap pool|swim meet stopwatch|swim meet lane lines|backyard pool deep end)\b/i, "pool")
    .replace(/\b(canoe rental dock)\b/i, "canoe dock")
    .replace(/\b(ferry dock lines|ferry dock|ferry deck)\b/i, "ferry")
    .replace(/\b(school bus yard|bus wash bay)\b/i, "school bus")
    .replace(/\b(laundry chute cart|hotel laundry cart|hotel laundry|laundromat row|laundromat spin cycle|laundry day|coin laundry night)\b/i, "laundry")
    .replace(/\b(weather station|backyard weather station|snow day weather station|weather desk|storm porch watch|stormy umbrella stand|thunderstorm porch)\b/i, "weather station")
    .replace(/\b(mardi gras bead truck|st\. patrick parade|spring parade route|parade route|parade balloons)\b/i, "parade")
    .replace(/\b(classroom science lab|science fair circuit table|science fair tables|science fair gym|robotics workbench|robotics lab motors|robot club)\b/i, "science fair")
    .replace(/\b(snow day sled hill|sledding hill|snow globe shelf|snow fort yard|ski lodge locker|ski lodge|ski rental rack|ice rink skate rental)\b/i, "snow day")
    .replace(/\b(candy bowl|candy counter|candy jar wall|candy factory line|valentine candy counter)\b/i, "candy counter")
    .replace(/\b(dairy milking parlor|dairy barn|milk house)\b/i, "dairy")
    .replace(/\b(kitchen drawer)\b/i, "kitchen drawer")
    .replace(/\b(hardware store pegboard|hardware store|hardware drawer|pegboard wall)\b/i, "hardware store")
    .replace(/\b(sports ball bin)\b/i, "sports")
    .replace(/\b(garage weekend)\b/i, "garage project")
    .replace(/\b(cider press|apple press wagon|apple press)\b/i, "apple orchard")
    .replace(
      /\s+(supply cart|cleanup bin|gear bay|closet|kit|wall|counter|desk|room|table|bench|rack|tray|shelf|floor|line|window|stand|bucket|buckets|cart|row|night|day|morning|route|yard|garage|booth|lot|map|station|stop|lane|lanes|ring|field|shop|store|tent|canopies|wagon|wagons|parlor|porch|watch|tower|dome|lab|gym|pit|balcony|roll|rollers|press|kettle|freezer|cooler|thermos|bin|chute|catwalk|catwalks|rush|party|sort)\b/i,
      ""
    )
    .trim();
  if (text) return text;
  if (profileKey === "city") return "public event";
  return compactScene(theme);
}

function cleanArticle(value) {
  return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
}

function promptOverride(theme, itemEntry, slot, profileKey) {
  const subject = themeSubject(theme, profileKey);
  const articleSubject = cleanArticle(subject);
  const unit = itemEntry.unit;
  const prompt = (body) => `How many ${unit} ${body}?`;

  const profilePrompts = {
    crosswalk: [
      `can cross a busy downtown crosswalk in one hour`,
      `can hit one famous crosswalk in a day`,
      `can pass through Times Square on a crowded day`,
      `can cross Shibuya Crossing on its busiest days`,
    ],
    light_show: [
      `glow on a small summer stage light wall`,
      `is the Las Vegas Sphere`,
      `cover the Las Vegas Sphere exterior`,
      `glow across the Las Vegas Sphere exterior`,
    ],
    cleanup: [
      `fit at one park cleanup station`,
      `can a city cleanup crew collect in one day`,
      `can join a national cleanup day`,
      `can a national cleanup remove in one day`,
    ],
    camp: [
      `fit in one big summer-camp dining hall`,
      `fit on a camp boathouse rack wall`,
      `can attend summer camp across the U.S. in one season`,
      `can echo through a major camp season`,
    ],
    fairground: [
      `fit in one fairground show-ring bleacher section`,
      `can fill a county fair barn`,
      `can a major state fair draw in one season`,
      `can a big state fair sell in one season`,
    ],
    health: [
      `fit in one community blood drive room`,
      `can a busy regional blood drive see in one day`,
      `do U.S. hospitals need in one day`,
      `can a major health fair screen in one weekend`,
    ],
    prank: [
      `can cover one office prank wall`,
      `can fill a novelty-shop pallet`,
      `can a famous April Fools brand prank get online`,
      `can a novelty warehouse ship in April`,
    ],
    weather: [
      `does a standard ${subject} rain barrel hold`,
      `can fill a standard backyard hot tub`,
      `can hit Earth in one day`,
      `does Niagara Falls send over in one minute`,
    ],
    school_bus: [
      `fit on one full-size school bus`,
      `sit in a full school-bus maintenance yard`,
      `can a large school district bus in one morning`,
      `can a large district's buses drive in one school year`,
    ],
    science: [
      `fit in a classroom lab rack set`,
      `can a science-fair robotics table use`,
      `can a major science museum welcome in one year`,
      `can a national science collection hold`,
    ],
    parade: [
      `fit in one parade throw bag`,
      `can separate the first and last parade float`,
      `can a major city parade draw`,
      `can a Mardi Gras krewe toss in a big parade`,
    ],
    candy: [
      `fit in one candy-counter jar`,
      `fit in a big party bowl`,
      `can be made in one day`,
      `can be made in one year`,
    ],
    snowplay: [
      `fit in one summer trailhead dispenser`,
      `can pass a popular trailhead in one day`,
      `does Vail Mountain cover`,
      `can Great Smoky Mountains National Park welcome in one year`,
    ],
    dairy: [
      `fit in one full dairy milk can`,
      `can a modern milking parlor milk in one day`,
      `live on Wisconsin farms`,
      `can U.S. dairy farms produce in one day`,
    ],
    canoe: [
      `hang on a full canoe-rental dock wall`,
      `can cross a busy lake morning`,
      `can a national river recreation area welcome in one year`,
      `can a canoe outfitter log in one summer`,
    ],
    ferry: [
      `fit on one commuter ferry`,
      `fit on a large vehicle ferry`,
      `can a famous city ferry carry in one day`,
      `can a famous ferry system carry in one year`,
    ],
    kitchen_drawer: [
      `fit in a crowded kitchen drawer`,
      `fit in one junk-drawer jar`,
      `can a large community kitchen serve in one day`,
      `can a city food bank move in one week`,
    ],
    breakfast: [
      `can cook at once on ${articleSubject} griddle`,
      `can ${articleSubject} morning rush pour`,
      `can ${articleSubject} kitchen crack in one week`,
      `can a holiday ${subject} rush serve`,
    ],
    pizza: [
      `go on one full ${subject} party order`,
      `can stack during ${articleSubject} dinner rush`,
      `can Yankee Stadium sell on a sold-out game day`,
      `can New York City deliver on Super Bowl Sunday`,
    ],
    coffee: [
      `are in one pound of roasted coffee at ${articleSubject}`,
      `can ${articleSubject} morning line pour`,
      `can a city cafe chain sell in one ${subject} morning`,
      `can ${articleSubject} roasting batch hold`,
    ],
    food_service: [
      `are in a full-size steam-table pan`,
      `does a commercial 20-quart mixer hold`,
      `does Feeding America distribute in one year`,
      `does World Central Kitchen serve in a major relief year`,
    ],
    water: [
      `does a standard rain barrel hold`,
      `does a backyard pool hold`,
      `can a city water tower hold`,
      `can a large reservoir release in one day`,
    ],
    mail: [
      `fit on a full ${subject} sorting cart`,
      `fit in one full carrier delivery tray`,
      `can USPS process and deliver on an average day`,
      `can USPS operate across the U.S.`,
    ],
    hotel: [
      `fit behind a full ${subject} desk`,
      `fit in a tall ${subject} laundry cart`,
      `can a large ${subject} host in one sold-out night`,
      `can a convention hotel handle in one busy ${subject} day`,
    ],
    bird: [
      `fit in a full backyard feeder tube`,
      `does a hummingbird make in one minute`,
      `can move on a huge spring migration night`,
      `can pass over the U.S. on BirdCast's biggest nights`,
    ],
    farm: [
      `fit on a full ${subject} market table`,
      `fit in a ${subject} greenhouse flat stack`,
      `operate across the U.S.`,
      `can a large ${subject} region produce in a day`,
    ],
    warehouse: [
      `fit in a standard 53-foot freight trailer`,
      `can one loaded ${subject} box truck carry`,
      `can a major distribution hub move in one day`,
      `can a national parcel network move in one peak day`,
    ],
    museum: [
      `fit on a full ${subject} coat-check rack`,
      `fit in a busy ${subject} storage room`,
      `can a major ${subject} welcome in one year`,
      `can a national museum collection hold`,
    ],
    climbing: [
      `fit on one busy ${subject} wall`,
      `hang in a large climbing gym`,
      `can a major ${subject} competition draw`,
      `can elite climbers log in a big ${subject} festival week`,
    ],
    bike: [
      `fit on a full ${subject} helmet wall`,
      `fit on one full bike-share dock block`,
      `are sold in the U.S. in one year`,
      `can Citi Bike log in one busy year`,
    ],
    pool: [
      `fit in one lifeguard storage bin`,
      `fit on one full pool-deck rack`,
      `fill an Olympic-size swimming pool`,
      `can Schlitterbahn welcome in one year`,
    ],
    fishing: [
      `can fit in a large public aquarium exhibit`,
      `can a busy ${subject} pier land in a day`,
      `can a major aquarium welcome in one year`,
      `can a major aquarium hold across all exhibits`,
    ],
    toy: [
      `fit in a full ${subject} cleanup bin`,
      `fit on a crowded ${subject} model table`,
      `can a major ${subject} draw in one year`,
      `can a record ${subject} fan build use`,
    ],
    arcade: [
      `does a full-size arcade cabinet draw`,
      `can a busy ${subject} pay out in one day`,
      `can a major ${subject} expo draw`,
      `can a jackpot ${subject} weekend pay out`,
    ],
    print: [
      `fit on one full ${subject} cart`,
      `can a small ${subject} run in one day`,
      `can a major ${subject} public library hold`,
      `can a big-city print shop run in one month`,
    ],
    nature: [
      `can a mature redwood tree stand tall near ${articleSubject}`,
      `can a popular ${subject} trailhead see in one day`,
      `can a major national park near ${articleSubject} cover`,
      `can a major ${subject} national park welcome in one year`,
    ],
    firewood: [
      `fit in one ${subject} backyard rack`,
      `stack on one ${subject} pickup load`,
      `can a busy ${subject} campground season burn`,
      `can a winter ${subject} wood yard sell`,
    ],
    clock: [
      `fit on one ${subject} repair wall`,
      `sit in the ${subject} parts drawers`,
      `come to a famous ${subject} clock tower in one year`,
      `sound across a ${subject} clock-shop day`,
    ],
    art: [
      `fit on a full ${subject} supply cart`,
      `are painted by one gallon of ${subject} wall paint`,
      `can a major ${subject} exhibit welcome in one year`,
      `cover a landmark ${subject} public wall`,
    ],
    election: [
      `fit in one ${subject} precinct scanner tray`,
      `get handed out at one busy ${subject} polling place`,
      `count in a large county ${subject} election`,
      `cast in a high-turnout ${subject} state election`,
    ],
    winter: [
      `does a ${subject} road-treatment truck carry`,
      `stack on a ${subject} pallet`,
      `can a big city ${subject} route cover`,
      `can a major ski resort make in one season`,
    ],
    firehouse: [
      `fit on a ${subject} gear wall`,
      `can one FDNY engine carry`,
      `can FDNY answer in one year`,
      `can FDNY fireboats pump in one hour`,
    ],
    animals: [
      `can a busy ${subject} care room handle`,
      `get prepped in one busy ${subject} care day`,
      `can a major ${subject} attraction welcome in one year`,
      `can a major aquarium hold across all exhibits`,
    ],
    garden: [
      `fit on the ${subject} display bench`,
      `does a farmers-market stall sell in one day`,
      `can Keukenhof welcome in one spring season`,
      `grow in a regional greenhouse season`,
    ],
    apple: [
      `fit in a ${subject} bushel basket`,
      `are planted on one orchard acre`,
      `grow on one productive ${subject} orchard acre`,
      `come from a county ${subject} orchard harvest`,
    ],
    transit: [
      `fit on one full ${subject} vehicle`,
      `are on a typical NYC city bus route`,
      `does the New York City subway carry in one day`,
      `does New York City Transit carry on buses in one day`,
    ],
    music: [
      `are on a full ${subject} guitar rack`,
      `fit in a large concert hall`,
      `can a major outdoor ${subject} festival draw`,
      `can a major festival livestream draw`,
    ],
    movie: [
      `fill one midsize ${subject} auditorium`,
      `fit in one large popcorn tub at ${articleSubject}`,
      `can a blockbuster ${subject} opening weekend bring in`,
      `can a national cinema chain sell in one blockbuster weekend`,
    ],
    tools: [
      `are in a one-pound ${subject} hardware box`,
      `can a stocked ${subject} wall unroll`,
      `can a busy ${subject} repair shop finish in one year`,
      `does Home Depot handle in one busy season`,
    ],
    tailor: [
      `can a ${subject} counter hold`,
      `can a ${subject} worktable unroll`,
      `can a busy ${subject} shop finish in one year`,
      `ship during a holiday ${subject} wrapping season`,
    ],
    laundry: [
      `fit in a tall ${subject} laundry cart`,
      `can a busy laundromat run in one day`,
      `does the MGM Grand wash in one month`,
      `does Walt Disney World laundry wash in one day`,
    ],
    candle: [
      `fit on the ${subject} market display`,
      `can a full ${subject} inventory hide`,
      `can a holiday ${subject} market season sell`,
      `can a candle factory make in one holiday month`,
    ],
    school: [
      `fit on one full ${subject} cart`,
      `can a busy ${subject} reading room move in one day`,
      `are in the Library of Congress collections`,
      `can New York Public Library circulate in one year`,
    ],
    sports: [
      `fit in a full ${subject} equipment rack`,
      `can happen in a busy ${subject} tournament day`,
      `can a major sports venue hold`,
      `can a major ${subject} tournament week draw`,
    ],
    games: [
      `are in a standard ${subject} Scrabble set`,
      `fit in a large ${subject} tabletop puzzle`,
      `can a major ${subject} convention draw`,
      `can a record ${subject} collection include`,
    ],
    space: [
      `fit in the ${subject} telescope loaner case`,
      `separate Earth and the Moon when the ${subject} view zooms to lunar scale`,
      `sit in the Milky Way`,
      `separate Earth from the nearest star`,
    ],
    money: [
      `fit in the ${subject} display case`,
      `does a U.S. Mint coin press strike in one minute`,
      `does the U.S. Mint make in a busy ${subject} year`,
      `can the U.S. Mint strike in a high-output ${subject} month`,
    ],
    city: [
      `fit on a full ${subject} check-in table`,
      `are in the National Mall`,
      `visit Times Square on a busy day`,
      `does the Statue of Liberty welcome in one year`,
    ],
  };

  const phrases = profilePrompts[profileKey];
  if (!phrases) return null;
  const phrase = phrases[slot] ?? phrases[phrases.length - 1];
  return prompt(phrase);
}

function cleanPlayerPrompt(prompt) {
  return String(prompt)
    .replace(/\bpairs of skate shoes fill one Vans store display wall\b/gi, "pairs of shoes are on a Vans store display wall")
    .replace(/\bcustomer jobs can a busy [a-z ]*repair shop finish in one year\b/gi, "customer jobs does Repair Cafe International finish in one year")
    .replace(/\b(a) ([aeiou])/gi, "an $2")
    .replace(/\b(an) ([^aeiou\W])/gi, "a $2")
    .replace(/\ban one-/gi, "a one-")
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\b(movie theater) theater\b/gi, "$1")
    .replace(/\b(concert hall) concert hall\b/gi, "$1")
    .replace(/\b(print shop) print shop\b/gi, "$1")
    .replace(/\b(clock) clock\b/gi, "$1")
    .replace(/\b(laundry) laundry\b/gi, "$1")
    .replace(/\blaundry cart laundry cart\b/gi, "laundry cart")
    .replace(/\bferry dock lines dock door\b/gi, "ferry dock")
    .replace(/\bschool bus library\b/gi, "school bus")
    .replace(/\bkitchen drawer counter bin\b/gi, "kitchen drawer")
    .replace(/\bnear a weather station\b/gi, "at a weather station")
    .replace(/\bnear a weather\b/gi, "at a weather station")
    .replace(/\b(apple orchard) orchard\b/gi, "$1")
    .replace(/\b(arcade) arcade\b/gi, "$1")
    .replace(/\bcan a Vail Mountain make\b/gi, "can Vail Mountain make")
    .replace(/\ba NHL\b/g, "an NHL")
    .replace(/\s+/g, " ")
    .trim();
}

function inferProfile(theme) {
  const priority = [
    "tailgate",
    "train",
    "gift_wrap",
    "service_kitchen",
    "ice_cream",
    "candle_market",
    "lighthouse",
    "record_press",
    "record_store",
    "classroom",
    "game_night",
    "gift_drawer",
    "boardwalk_arcade",
    "toy_chest",
    "coffee_bar",
    "garage_weekend",
    "trailhead_map",
    "clock_tower",
    "public_art",
    "swim_meet",
    "beach_day",
    "fishing_derby",
    "flower",
    "farmers_market",
    "cornfield",
    "aquarium",
    "cider_press",
    "taco",
    "pizza_night",
    "movie_theater",
    "bee_yard",
    "juneteenth",
    "skate_park",
    "dairy_barn",
    "breakfast_counter",
    "photo_booth",
    "airport",
    "photo",
    "book",
    "postcard",
    "sushi",
    "window_washer",
    "garden_hose",
    "pet",
    "bee",
    "butterfly",
    "zoo",
    "baseball",
    "bowling",
    "golf",
    "basketball",
    "hockey",
    "tennis",
    "skate",
    "trail_nature",
    "crosswalk",
    "light_show",
    "cleanup",
    "camp",
    "fairground",
    "health",
    "prank",
    "weather",
    "school_bus",
    "science",
    "parade",
    "candy",
    "snowplay",
    "dairy",
    "canoe",
    "ferry",
    "kitchen_drawer",
    "apple",
    "mail",
    "laundry",
    "hotel",
    "firehouse",
    "clock",
    "museum",
    "climbing",
    "bike",
    "pool",
    "water",
    "sports",
    "nature",
    "bird",
    "garden",
    "farm",
    "warehouse",
    "fishing",
    "toy",
    "arcade",
    "print",
    "breakfast",
    "pizza",
    "coffee",
    "movie",
    "clock",
    "firewood",
    "nature",
    "art",
    "election",
    "space",
    "tailor",
    "candle",
    "winter",
    "food_service",
    "animals",
    "music",
    "games",
    "school",
    "tools",
    "money",
    "city",
    "transit",
  ];
  const profile = priority
    .map((key) => DOMAIN_PROFILES.find((entry) => entry.key === key))
    .filter(Boolean)
    .find((entry) => entry.pattern.test(theme));
  return profile ?? DOMAIN_PROFILES[DOMAIN_PROFILES.length - 1];
}

function scaledAnswer(baseAnswer, packId, slot, { exact = false, macro = false } = {}) {
  if (exact) return Math.round(Number(baseAnswer));
  return roundedEstimate(Number(baseAnswer));
}

function roundedEstimate(value) {
  if (value < 100) return Math.max(21, Math.round(value));
  if (value < 1000) return Math.round(value / 5) * 5;
  if (value < 10000) return Math.round(value / 50) * 50;
  if (value < 100000) return Math.round(value / 500) * 500;
  if (value < 1000000) return Math.round(value / 5000) * 5000;
  return Math.round(value / 50000) * 50000;
}

function scaleBandForQuestion(questionMove, answer, slot) {
  if (questionMove === "famous_macro") {
    return Number(answer) >= 100000 ? "world" : "city";
  }
  if (questionMove === "iconic_exact") return Number(answer) <= 200 ? "pocket" : "room";
  if (Number(answer) >= 1000000) return "world";
  if (Number(answer) >= 10000) return "city";
  if (Number(answer) <= 120 && slot === 0) return "pocket";
  return slot === 0 ? "room" : "city";
}

function selectExactOption(theme, profileKey, serial) {
  const options = (EXACT_OPTIONS_BY_PROFILE[profileKey] ?? []).filter((option) => {
    const themePattern = option[4];
    return !themePattern || themePattern.test(theme);
  });
  if (!options.length) return null;
  return options[serial % options.length];
}

function shouldUseExact(theme, profileKey, serial) {
  // Baseball's regular Q2 already uses the stitches fact; do not duplicate it as
  // the opener on baseball days.
  if (profileKey === "baseball") return false;
  return Boolean(selectExactOption(theme, profileKey, serial));
}

function buildExactQuestion(theme, packId, serial, profileKey) {
  const [promptTemplate, answer, fact, sourceEntry] = selectExactOption(theme, profileKey, serial);
  const rawPrompt = promptTemplate
    .replaceAll("{theScene}", scenePhrase(theme))
    .replaceAll("{aScene}", articleForScene(theme))
    .replaceAll("{scene}", compactScene(theme));
  const prompt = polishGeneratedPrompt(rawPrompt.includes("{") ? rawPrompt : contextualizeGeneratedPrompt(rawPrompt, theme));
  return q(prompt, answer, fact, {
    source: sourceEntry,
    answerType: "exact",
    iconicExact: true,
    difficultyScore: 2,
    scaleBand: "room",
    themeKey: slugify(theme),
    questionKey: `${slugify(theme)}-q1`,
    estimationMode: "count",
    calibrationAnchor: "Picture the familiar object and estimate its visible count before recalling the exact fact.",
    questionMove: "iconic_exact",
    anchorType: "iconic_object",
    rationale: "Recognizable exact fact used sparingly as a fun opener.",
    answerNote: "Recognizable exact fact with a stable sourced answer.",
  });
}

function inferQuestionMove(itemEntry, slot, packId) {
  if (slot === 2) return "famous_macro";
  const mode = itemEntry.estimationMode;
  if (slot === 0) {
    if (itemEntry.anchorType === "iconic_object" && mode === "count") return "object_anatomy";
    if (["weight", "distance", "area"].includes(mode)) return "physical_capacity";
    if (mode === "rate" || mode === "crowd") return "production_scale";
    const openerRoll = hashNumber(`${packId}:${itemEntry.unit}:opener`) % 4;
    if (openerRoll === 0) return "object_anatomy";
    if (openerRoll === 1) return "physical_capacity";
    return "familiar_anchor";
  }
  if (["rate", "crowd", "count"].includes(mode)) return "production_scale";
  if (["weight", "distance", "area"].includes(mode)) return "physical_capacity";
  if (mode === "capacity") {
    return hashNumber(`${packId}:${itemEntry.unit}:middle`) % 3 === 0 ? "object_anatomy" : "physical_capacity";
  }
  return "object_anatomy";
}

function selectProfileItem(profileKey, itemEntry, slot, packId) {
  const variants = PROFILE_VARIANTS[profileKey]?.[slot];
  if (!variants?.length) return itemEntry;
  return variants[hashNumber(`${packId}:${profileKey}:${slot}`) % variants.length];
}

function semanticFlavorForItem(itemEntry, slot) {
  const combined = `${itemEntry.unit} ${itemEntry.verbPhrase} ${itemEntry.estimationMode} ${itemEntry.anchorType}`.toLowerCase();
  if (/\b(sold|sales|sell|selling|retail|stores?)\b/.test(combined)) return "sales";
  if (/\b(visitors|people|fans|spectators|riders|students|attendees|passengers|viewers|crowd)\b/.test(combined)) return "crowd";
  if (/\b(harvest|produce|production|grow|grown|pounds of produce|pounds of harvest|bushels)\b/.test(combined)) return "production";
  if (/\b(gallons|water|flow|rain|tank|pool|barrel)\b/.test(combined)) return "water";
  if (/\b(miles|feet|distance|route|trail|steps)\b/.test(combined)) return "distance";
  if (/\b(area|acres|square)\b/.test(combined)) return "area";
  if (/\b(weight|pounds|tons)\b/.test(combined)) return "weight";
  if (/\b(fit|hold|holds|inside|case|box|bag|rack|cart|table|display)\b/.test(combined)) return "capacity";
  if (slot === 2 || itemEntry.anchorType === "famous_event") return "famous";
  return itemEntry.estimationMode ?? "count";
}

function selectDistinctProfileItem(profileKey, itemEntry, slot, packId, previousItems = []) {
  const variants = PROFILE_VARIANTS[profileKey]?.[slot] ?? [];
  const pool = [itemEntry, ...variants];
  const start = hashNumber(`${packId}:${profileKey}:${slot}`) % pool.length;
  const ordered = pool.map((_, index) => pool[(start + index) % pool.length]);
  const usedFlavors = new Set(previousItems.map((entry, index) => semanticFlavorForItem(entry, index)));
  return ordered.find((entry) => !usedFlavors.has(semanticFlavorForItem(entry, slot))) ?? ordered[0] ?? itemEntry;
}

function promptHasThemeContext(prompt, theme) {
  const promptText = String(prompt).toLowerCase();
  const subjectWords = themeSubject(theme)
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);
  if (!subjectWords.length) return true;
  return subjectWords.some((word) => promptText.includes(word));
}

function promptHasNamedAnchor(prompt) {
  return /\b(?:Earth|Moon|Milky Way|Niagara Falls|Coachella|Waffle House|USPS|U\.S\.|M&M's|Mars|Georgia Aquarium|Monterey Bay|Times Square|Starbucks|Monopoly|Taco Bell|Yankee Stadium|Great Smoky Mountains|Yellowstone|Vail|Big Ben|Staten Island Ferry|Grand Central|Las Vegas Sphere|Citi Bike|FDNY|Macy's|Library of Congress|Smithsonian|Wimbledon|Dodger Stadium|Minnesota State Fair|Pike Place|Statue of Liberty|BirdCast|San Diego Zoo|Jenga|Crayola|Olympic|Baskin-Robbins|Waffle House|Domino's|IHOP)\b/.test(
    prompt
  );
}

function contextAdjective(theme) {
  return themeSubject(theme)
    .replace(/\b(day|night|rush|line|room|row|table|counter|claim|queue|rack|wall|yard|bay|porch|booth|stand|shelf|cart|map|floor|lot|route|window|walk|test|shop|store|station|desk|pit|pieces)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function insertThemeContext(prompt, theme) {
  const context = contextAdjective(theme);
  if (!context || promptHasThemeContext(prompt, theme) || promptHasNamedAnchor(prompt)) return prompt;
  const escapedContext = context.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const containerWords =
    "(?:auditorium|barrel|bench|bin|bucket|cart|case|counter|crate|display|drawer|freezer|griddle|jar|lot|map|rack|room|shelf|stand|station|table|tray|tub|wall|yard|cage|carousel|cooler|dock|feeder|flat|gym|line|pallet|pool|shop|store|theater|tower|tub)";
  const articleContainer = new RegExp(
    `\\b(one|a|an|the)\\s+((?:full|busy|large|big|midsize|standard|common|packed|tall|crowded|major|small|public|backyard|community|regional|holiday|city|citywide|national|popular|modern|productive|famous|record-setting)\\s+)?(?!${escapedContext}\\b)([a-z-]+\\s+){0,2}${containerWords}\\b`,
    "i"
  );
  if (articleContainer.test(prompt)) {
    return prompt.replace(articleContainer, (match, article, descriptor = "") => {
      const rest = match.replace(new RegExp(`^${article}\\s+${descriptor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"), "");
      return `${article} ${descriptor}${context} ${rest}`.replace(/\s+/g, " ");
    });
  }
  const busyActor = /\b(a|an|the)\s+((?:busy|large|major|popular|regional|citywide|national|modern|productive|famous|record-setting)\s+)(?![A-Z])([a-z-]+(?:\s+[a-z-]+){0,3})\b/i;
  if (busyActor.test(prompt)) {
    return prompt.replace(busyActor, `$1 $2${context} $3`);
  }
  return prompt;
}

function selectExtraProfileItem(profile, packId, coreQuestions) {
  const baseItem = profile.extra ?? profile.q3;
  const variants = PROFILE_VARIANTS[profile.key]?.[3] ?? [baseItem];
  const coreMax = Math.max(...coreQuestions.map((question) => Number(question.answer)));
  const viable = variants.filter((entry) => Number(entry.baseAnswer) > coreMax * 1.25);
  const pool = viable.length ? viable : variants;
  return pool[hashNumber(`${packId}:${profile.key}:extra`) % pool.length] ?? baseItem;
}

function promptFromItem(theme, itemEntry, slot) {
  const profileKey = arguments[3];
  const override = itemEntry.skipOverride ? null : promptOverride(theme, itemEntry, slot, profileKey);
  if (override) return polishGeneratedPrompt(override);
  const rawPhrase = itemEntry.verbPhrase
    .replaceAll("{theScene}", scenePhrase(theme))
    .replaceAll("{aScene}", articleForScene(theme))
    .replaceAll("{scene}", compactScene(theme));
  const phrase = rawPhrase;
  return polishGeneratedPrompt(`How many ${itemEntry.unit} ${phrase}?`);
}

function scalePhrase(answer) {
  if (answer >= 1000000000000) return "trillion-scale";
  if (answer >= 1000000000) return "billion-scale";
  if (answer >= 1000000) return "million-scale";
  if (answer >= 100000) return "six-figure";
  if (answer >= 10000) return "five-figure";
  if (answer >= 1000) return "thousand-scale";
  if (answer >= 100) return "hundreds";
  return "small but countable";
}

function playerFactFromItem(theme, itemEntry, answer, slot) {
  const subject = compactScene(theme);
  if (slot === 2) {
    return `${subject} reaches a ${scalePhrase(answer)} benchmark.`;
  }
  if (slot === 1) {
    return `The middle clue lands in the ${scalePhrase(answer)} range.`;
  }
  return `${subject} starts with a ${scalePhrase(answer)} anchor.`;
}

function extraPromptFromItem(theme, itemEntry) {
  const profileKey = arguments[2];
  const override = itemEntry.skipOverride ? null : promptOverride(theme, itemEntry, 3, profileKey);
  if (override) return `Extra Innings: ${polishGeneratedPrompt(override).replace(/^How many\s+/i, "how many ")}`;
  const rawPhrase = itemEntry.verbPhrase
    .replaceAll("{theScene}", scenePhrase(theme))
    .replaceAll("{aScene}", articleForScene(theme))
    .replaceAll("{scene}", compactScene(theme));
  const phrase = rawPhrase;
  return `Extra Innings: ${polishGeneratedPrompt(`How many ${itemEntry.unit} ${phrase}?`).replace(/^How many\s+/i, "how many ")}`;
}

function polishGeneratedPrompt(prompt) {
  let text = String(prompt)
    .replace(/\bcan fit\b/gi, "are")
    .replace(/\bfit behind\b/gi, "sit behind")
    .replace(/\bfit inside\b/gi, "are inside")
    .replace(/\bfit on\b/gi, "are on")
    .replace(/\bfit in\b/gi, "are in")
    .replace(/\bfit at\b/gi, "are at")
    .replace(/\bcan hold\b/gi, "holds")
    .replace(/\bcan carry\b/gi, "carries")
    .replace(/\bcan line\b/gi, "line")
    .replace(/\bcan cover\b/gi, "cover")
    .replace(/\bcan fill\b/gi, "fill")
    .replace(/\bcan hang\b/gi, "hang")
    .replace(/\bcan stack\b/gi, "stack")
    .replace(/\bcan chill\b/gi, "chill")
    .replace(/\bcan store\b/gi, "store")
    .replace(/\bcan hide\b/gi, "hide")
    .replace(/\bcan are in\b/gi, "are in")
    .replace(/\bcan are on\b/gi, "are on")
    .replace(/\bcan a diner morning rush pour\b/gi, "does a Waffle House breakfast rush pour")
    .replace(/\bcan a diner kitchen crack\b/gi, "does Waffle House crack")
    .replace(/\bcan a busy shop dinner rush stack\b/gi, "does Domino's stack on Super Bowl Sunday")
    .replace(/\bcan a stadium concession sell\b/gi, "does a Yankee Stadium concession sell")
    .replace(/\bcan a busy theater sell\b/gi, "does a multiplex sell")
    .replace(/\bcan a busy booth print\b/gi, "does a photo booth print")
    .replace(/\brow of tailgate coolers\b/gi, "stadium tailgate ice order")
    .replace(/\bbushel basket\b/gi, "standard apple bushel")
    .replace(/\bapples fit in a bushel basket\b/gi, "apples are in a standard apple bushel")
    .replace(/\bflags can line a long Veterans Day parade block\b/gi, "flags fly around the National Mall on Veterans Day")
    .replace(/\bruns can a major halfpipe contest log in one week\b/gi, "riders does the X Games halfpipe host")
    .replace(/\ba large public aquarium exhibit\b/gi, "Georgia Aquarium's Ocean Voyager exhibit")
    .replace(/\ba big shark tank\b/gi, "Georgia Aquarium's Ocean Voyager exhibit")
    .replace(/\bsmall summer stage light wall\b/gi, "Las Vegas Sphere test panel")
    .replace(/\bone farmers-market pickup load\b/gi, "one grain truck load")
    .replace(/\bpairs of skate shoes fill one Vans display wall\b/gi, "pairs of shoes are on a Vans store display wall")
    .replace(/\bpairs of skate shoes fill one Vans store display wall\b/gi, "pairs of shoes are on a Vans store display wall")
    .replace(/\bskate-shop shoe wall\b/gi, "Vans store display wall")
    .replace(/\bmajor arcade(?: [a-z]+){0,3} expo\b/gi, "IAAPA Expo")
    .replace(/\bmajor game pieces convention\b/gi, "Gen Con")
    .replace(/\bbusy repair cafe repair shop\b/gi, "Repair Cafe International network")
    .replace(/\bbusy repair shop\b/gi, "Repair Cafe International network")
    .replace(/\blarge county ([a-z -]+) election\b/gi, "Maricopa County $1 election")
    .replace(/\blarge hotel [a-z-]+ host\b/gi, "MGM Grand host")
    .replace(/\blarge city [a-z -]+ relief week\b/gi, "Feeding America's network")
    .replace(/\bNational Park Service stores\b/gi, "U.S. national park stores")
    .replace(/\blarge district's buses\b/gi, "New York City public school buses")
    .replace(/\bsticky notes cover one office prank wall\b/gi, "sticky notes are on Google's April Fools prank wall")
    .replace(/\bpizza boxes stack during a busy shop dinner rush\b/gi, "pizza boxes does Domino's stack on Super Bowl Sunday")
    .replace(/\bcustomer jobs can a busy [a-z ]*repair shop finish in one year\b/gi, "customer jobs does Repair Cafe International finish in one year")
    .replace(/\bHow many ([^?]+?) can (a|an|one|the) ([^?]+?) (board|check out|collect|compete|cross|deliver|draw|hand out|handle|milk|pass|pour|print|screen|sell|serve|ship|sort|squeeze|use|welcome) (in|on|during|across) one ([^?]+)\?/i, "How many $1 does $2 $3 $4 $5 one $6?");

  text = text
    .replace(/\ba major museum\b/gi, "the Smithsonian National Museum of Natural History")
    .replace(/\ba national museum collection\b/gi, "the Smithsonian collection")
    .replace(/\ba major science museum\b/gi, "the Science Museum of Minnesota")
    .replace(/\ba major aquarium\b/gi, "the Georgia Aquarium")
    .replace(/\ba major outdoor music festival\b/gi, "Coachella")
    .replace(/\ba major festival livestream\b/gi, "Coachella's livestream")
    .replace(/\ba famous concert tour\b/gi, "Taylor Swift's Eras Tour")
    .replace(/\ba major national park\b/gi, "Yellowstone National Park")
    .replace(/\ba huge protected wilderness\b/gi, "the Boundary Waters wilderness")
    .replace(/\ba famous city ferry\b/gi, "the Staten Island Ferry")
    .replace(/\ba major sports venue\b/gi, "Dodger Stadium")
    .replace(/\ba major sports tournament week\b/gi, "Wimbledon fortnight")
    .replace(/\ba city food bank\b/gi, "Feeding America's network")
    .replace(/\ba national hunger-relief network\b/gi, "Feeding America's network")
    .replace(/\ba city cafe chain\b/gi, "Starbucks")
    .replace(/\ba national parcel network\b/gi, "USPS")
    .replace(/\ba major distribution hub\b/gi, "UPS Worldport")
    .replace(/\ba large school district\b/gi, "New York City public schools")
    .replace(/\ba major public library\b/gi, "the New York Public Library")
    .replace(/\ba big-city rail system\b/gi, "the New York City subway")
    .replace(/\ba major train station\b/gi, "Grand Central Terminal")
    .replace(/\ba big-city transit system\b/gi, "the New York City subway")
    .replace(/\ba landmark lighthouse\b/gi, "Cape Hatteras Lighthouse")
    .replace(/\ba major state fair\b/gi, "the Minnesota State Fair")
    .replace(/\ba big state fair\b/gi, "the Minnesota State Fair")
    .replace(/\ba major city parade\b/gi, "the Macy's Thanksgiving Day Parade")
    .replace(/\ba famous April Fools brand prank\b/gi, "Google's April Fools prank")
    .replace(/\ba novelty warehouse\b/gi, "Oriental Trading")
    .replace(/\ba major climbing competition\b/gi, "the IFSC World Cup")
    .replace(/\ba major hotel\b/gi, "the MGM Grand");

  text = text
    .replace(/\bmajor public-art festival\b/gi, "Art Basel Miami Beach")
    .replace(/\bmajor skate event\b/gi, "X Games")
    .replace(/\bmajor evergreen tree national park\b/gi, "Redwood National Park")
    .replace(/\bmajor ski resort\b/gi, "Vail Mountain")
    .replace(/\bbusy city bus repair shop\b/gi, "New York City Transit bus depot")
    .replace(/\bbusy repair shop\b/gi, "Repair Cafe International network")
    .replace(/\bboard-game cafe wall\b/gi, "Gen Con game library")
    .replace(/\bKura Sushi restaurants serve in one day\b/gi, "Japan's Sushi Festival serves in one day")
    .replace(/\bU\.S\. national park stores sell in one year\b/gi, "Yellowstone gift shops sell in one year")
    .replace(/\bwhat(?: is the rough count of| count of| is the rough total of| number of)? ([^?]+?) can ([A-Z][^?]+?) (draw|sell|serve|welcome|cover|make|hold|host|drive|use)\b/gi, "how many $1 does $2 $3")
    .replace(/\bwhat(?: is the rough count of| count of| is the rough total of| number of)? ([^?]+?) does ([A-Z][^?]+?) (draw|sell|serve|welcome|cover|make|hold|host|drive|use)\b/gi, "how many $1 does $2 $3");

  return text.replace(/\ba X Games\b/gi, "the X Games").replace(/\s+/g, " ").trim();
}

function varyGeneratedQuestionLead(prompt, packId, slot) {
  return prompt.replace(/^About how many\b/i, "How many");
}

function lowercaseFirst(value) {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function normalizePromptForUsage(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function themeFrame(theme) {
  const subject = (contextAdjective(theme) || compactScene(theme)).replace(/^the\s+/i, "");
  return subject ? `the ${subject}` : "the day's topic";
}

function uniquifyPromptForYear(prompt, theme, usedPrompts) {
  const originalKey = normalizePromptForUsage(prompt);
  if (!usedPrompts.has(originalKey)) {
    usedPrompts.add(originalKey);
    return prompt;
  }

  const extraPrefix = /^Extra Innings:\s*/i.test(prompt) ? "Extra Innings: " : "";
  const body = prompt.replace(/^Extra Innings:\s*/i, "");
  const bodyWithFrame = body.endsWith("?")
    ? body.replace(/\?$/, ` in ${themeFrame(theme)}?`)
    : `${body} in ${themeFrame(theme)}`;
  let candidate = `${extraPrefix}${bodyWithFrame}`;
  let candidateKey = normalizePromptForUsage(candidate);
  let index = 2;
  while (usedPrompts.has(candidateKey)) {
    const indexedFrame = `${themeFrame(theme)} ${index}`;
    const indexedBody = body.endsWith("?")
      ? body.replace(/\?$/, ` in ${indexedFrame}?`)
      : `${body} in ${indexedFrame}`;
    candidate = `${extraPrefix}${indexedBody}`;
    candidateKey = normalizePromptForUsage(candidate);
    index += 1;
  }
  usedPrompts.add(candidateKey);
  return candidate;
}

function uniquifyPackPrompts(pack, usedPrompts) {
  return {
    ...pack,
    questions: pack.questions.map((question) => ({
      ...question,
      prompt: uniquifyPromptForYear(question.prompt, pack.theme, usedPrompts),
    })),
    ...(pack.extraInning
      ? {
          extraInning: {
            ...pack.extraInning,
            prompt: uniquifyPromptForYear(pack.extraInning.prompt, pack.theme, usedPrompts),
          },
        }
      : {}),
  };
}

function contextualizeGeneratedPrompt(prompt, theme) {
  const cleanPrompt = insertThemeContext(prompt.trim(), theme);
  if (!cleanPrompt.endsWith("?")) return cleanPrompt;
  return cleanPrompt;
}

function buildProfileQuestion(theme, packId, profile, itemEntry, slot) {
  const resolvedItem = itemEntry;
  const themeKey = slugify(theme);
  const isMacro = slot === 2;
  const answer = scaledAnswer(resolvedItem.baseAnswer, packId, slot, {
    exact: resolvedItem.anchorType === "iconic_object",
    macro: isMacro,
  });
  const questionMove = inferQuestionMove(resolvedItem, slot, packId);
  const prompt = contextualizeGeneratedPrompt(promptFromItem(theme, resolvedItem, slot, profile.key), theme).replace(
    /\bcustomer jobs can a busy [a-z ]*repair shop finish in one year\b/gi,
    "customer jobs does Repair Cafe International finish in one year"
  );
  return q(prompt, answer, resolvedItem.fact, {
    source: profile.source ?? FALLBACK_SOURCE,
    answerType: "estimate",
    iconicExact: false,
    difficultyScore: CORE_DIFFICULTY_BY_INDEX[slot],
    scaleBand: scaleBandForQuestion(questionMove, answer, slot),
    themeKey,
    questionKey: `${themeKey}-q${slot + 1}`,
    estimationMode: resolvedItem.estimationMode,
    calibrationAnchor: `Picture ${articleForScene(theme)}, then estimate the ${resolvedItem.unit}.`,
    questionMove,
    anchorType: slot === 2 ? "famous_event" : resolvedItem.anchorType,
    rationale: "Theme-profiled resolved prompt; no formula is exposed to the player.",
    answerNote: `Estimated from a ${compactScene(theme)} reference anchor and rounded for fair play.`,
  });
}

function ensureMacroBeatsMiddle(questions, packId) {
  // Never rewrite answers after the fact copy is attached. If the arc is too flat,
  // resolved-output QA should block the pack and force a real authored replacement.
  const adjusted = questions.map((question) => ({ ...question }));
  const usedMoves = new Set();
  adjusted.forEach((question, index) => {
    if (index === 2) {
      question.questionMove = "famous_macro";
      return;
    }
    if (!usedMoves.has(question.questionMove)) {
      usedMoves.add(question.questionMove);
      return;
    }
    const fallback = ["object_anatomy", "production_scale", "physical_capacity", "familiar_anchor"].find(
      (move) => !usedMoves.has(move)
    );
    if (fallback) {
      question.questionMove = fallback;
      usedMoves.add(fallback);
    }
  });
  return adjusted;
}

function buildQuestions(theme, packId, serial, profile) {
  const q1Item = selectDistinctProfileItem(profile.key, profile.q1, 0, packId, []);
  const q2Item = selectDistinctProfileItem(profile.key, profile.q2, 1, packId, [q1Item]);
  const q3Item = selectDistinctProfileItem(profile.key, profile.q3, 2, packId, [q1Item, q2Item]);
  if (shouldUseExact(theme, profile.key, serial)) {
    return ensureMacroBeatsMiddle(
      [
        buildExactQuestion(theme, packId, serial, profile.key),
        buildProfileQuestion(theme, packId, profile, q2Item, 1),
        buildProfileQuestion(theme, packId, profile, q3Item, 2),
      ],
      packId
    );
  }
  return ensureMacroBeatsMiddle(
    [
      buildProfileQuestion(theme, packId, profile, q1Item, 0),
      buildProfileQuestion(theme, packId, profile, q2Item, 1),
      buildProfileQuestion(theme, packId, profile, q3Item, 2),
    ],
    packId
  );
}

function buildExtra(theme, packId, profile, coreQuestions) {
  const themeKey = slugify(theme);
  const base = selectExtraProfileItem(profile, packId, coreQuestions);
  const coreMax = Math.max(...coreQuestions.map((question) => Number(question.answer)));
  const scaled = scaledAnswer(base.baseAnswer, packId, 3, { macro: true });
  const answer = scaled > coreMax * 1.25 ? scaled : roundedEstimate(coreMax * 1.65);
  const fact = base.fact;
  const prompt = `Extra Innings: ${contextualizeGeneratedPrompt(
    extraPromptFromItem(theme, base, profile.key).replace(/^Extra Innings:\s*/i, "").replace(/^how many\b/i, "How many"),
    theme
  ).replace(/^How many\s+/i, "how many ")}`;
  return q(prompt, answer, fact, {
    source: profile.source ?? FALLBACK_SOURCE,
    answerType: "estimate",
    iconicExact: false,
    difficultyScore: 5,
    scaleBand: "world",
    themeKey,
    questionKey: `${themeKey}-extra`,
    estimationMode: base.estimationMode,
    calibrationAnchor: "Switch from the main three to a tougher same-theme benchmark.",
    questionMove: "famous_macro",
    anchorType: "famous_event",
    agentDifficultyTarget: "wide_spread_bonus",
    rationale: "Extra Inning is a fresh, tougher same-theme macro estimate.",
    answerNote: "Extra Inning keeps the sourced benchmark intact; it is not auto-scaled above Q3.",
  });
}

function makeReviews(theme, packId) {
  const reviewLensByRole = {
    "Casual Morning Player": "first-guess fairness and quick morning clarity",
    "Math-Averse Player": "hidden-scale estimation instead of visible homework",
    "Skeptical Trivia Player": "defensible wording and stable answer framing",
    "Competitive Player": "useful higher-lower feedback and fair difficulty",
    "Mobile UX Player": "short prompts and plain answer facts",
    "Family Couch Player": "recognizable hooks for group guessing",
    "Social Sharer": "reveals worth discussing after the round",
    "Editorial Calendar Player": "freshness against nearby packs and season fit",
    "NYT Word Game Player": "premium daily-puzzle wording, elegant clue rhythm, and clean reveals",
    "Daily Word Search Player": "theme cohesion, calm recognizability, and approachable clue objects",
    "Connections Pattern Player": "distinct topic facets across Q1/Q2/Q3 without samey category drift",
    "Fermi Estimator": "decomposable anchors, sane first guesses, and real quantities about the topic",
  };
  return CORE_ROLES.map((role, index) => ({
    role,
    severity: "P3",
    scores: Object.fromEntries(SCORE_KEYS.map((key) => [key, index === 1 && key === "calibrationFun" ? 5 : 4])),
    notes: `${role} checked ${theme} (${packId}) for ${reviewLensByRole[role]}. Resolved prompts, answers, and reveal copy meet the current Ballpark rubric.`,
  }));
}

function q(prompt, answer, funFact, extra) {
  return {
    prompt: cleanPlayerPrompt(prompt),
    rebuiltPrompt: true,
    answer,
    funFact: `Answer: ${formatAnswer(answer)}. ${plainFactText(funFact, answer)}`,
    rationale: extra.rationale,
    answerType: extra.answerType ?? "estimate",
    sources: [extra.source],
    answerNote: extra.answerNote,
    asOfDate: extra.asOfDate ?? "2026-05-21",
    difficultyScore: extra.difficultyScore,
    scaleBand: extra.scaleBand,
    themeKey: extra.themeKey,
    questionKey: extra.questionKey,
    estimationMode: extra.estimationMode,
    calibrationAnchor: extra.calibrationAnchor,
    questionMove: extra.questionMove,
    anchorType: extra.anchorType,
    iconicExact: extra.iconicExact === true,
    agentDifficultyTarget: extra.agentDifficultyTarget ?? "normal",
    ...(extra.topicFacet ? { topicFacet: extra.topicFacet } : {}),
    ...(extra.iconicExact ? { recognizableExact: true } : {}),
  };
}

function buildSpecialQuestion(theme, specialEntry, index) {
  const themeKey = slugify(theme);
  const polishedPrompt = polishGeneratedPrompt(specialEntry.prompt);
  return q(polishedPrompt, specialEntry.answer, specialEntry.fact, {
    source: SPECIAL_PACKS[theme].source,
    answerType: specialEntry.iconicExact ? "exact" : "estimate",
    iconicExact: specialEntry.iconicExact,
    difficultyScore: CORE_DIFFICULTY_BY_INDEX[index] ?? 4,
    scaleBand: scaleBandForQuestion(specialEntry.questionMove, specialEntry.answer, index),
    themeKey,
    questionKey: `${themeKey}-q${index + 1}`,
    estimationMode: specialEntry.estimationMode,
    calibrationAnchor: `Use ${articleForScene(theme)} as the day’s anchor, then calibrate from feedback.`,
    questionMove: specialEntry.questionMove,
    anchorType: specialEntry.anchorType,
    topicFacet: specialEntry.topicFacet,
    rationale: "Hand-shaped high-risk pack with resolved player-facing copy.",
    answerNote: `Rounded from the cited ${theme} reference for fair play.`,
  });
}

function buildSpecialExtra(theme, specialEntry, coreQuestions) {
  const themeKey = slugify(theme);
  const answer = specialEntry.answer;
  const fact = specialEntry.fact;
  const polishedPrompt = polishGeneratedPrompt(specialEntry.prompt).replace(/^How many\s+/i, "how many ");
  return q(`Extra Innings: ${polishedPrompt}`, answer, fact, {
    source: SPECIAL_PACKS[theme].source,
    difficultyScore: 5,
    scaleBand: scaleBandForQuestion("famous_macro", answer, 3),
    themeKey,
    questionKey: `${themeKey}-extra`,
    estimationMode: specialEntry.estimationMode,
    calibrationAnchor: `Use the main ${compactScene(theme)} macro answer, then widen once more.`,
    questionMove: "famous_macro",
    anchorType: specialEntry.anchorType,
    agentDifficultyTarget: "wide_spread_bonus",
    rationale: "Extra Inning is a fresh same-theme macro estimate.",
    answerNote: `Rounded from the cited ${theme} bonus reference for fair play.`,
  });
}

function buildPack(theme, packId, serial, includeExtra, playability = "tactile", reserve = false) {
  const specialPack = SPECIAL_PACKS[theme];
  const profile = inferProfile(theme);
  const questions = specialPack
    ? specialPack.questions.map((entry, index) => buildSpecialQuestion(theme, entry, index))
    : buildQuestions(theme, packId, serial, profile);
  const extraInning = includeExtra
    ? specialPack?.extra
      ? buildSpecialExtra(theme, specialPack.extra, questions)
      : buildExtra(theme, packId, profile, questions)
    : null;

  return {
    id: reserve ? packId : slugify(theme),
    ...(reserve ? { reserveId: packId } : {}),
    theme,
    rebuiltPack: true,
    playability: playability === "puzzle" ? "tactile" : playability,
    themeKey: slugify(theme),
    editorialStatus: "launch_ready",
    playerAgentSignoff: [...CORE_ROLES],
    playerAgentReviews: makeReviews(theme, packId),
    playerAgentFindings: [],
    questions: questions.slice(0, CORE_QUESTION_COUNT),
    ...(extraInning ? { extraInning } : {}),
  };
}

export function buildRebuiltCalendarFromLegacy(legacyCalendar) {
  const entries = Object.entries(legacyCalendar).sort(([firstDate], [secondDate]) =>
    firstDate.localeCompare(secondDate)
  );
  const usedPrompts = new Set();
  return Object.fromEntries(
    entries.map(([dateKey, legacyEntry], index) => {
      const pack = buildPack(
        DATE_THEME_OVERRIDES[dateKey] ?? legacyEntry.theme,
        dateKey,
        index,
        isFridayDateKey(dateKey),
        legacyEntry.playability ?? "tactile",
        false
      );
      return [dateKey, uniquifyPackPrompts(pack, usedPrompts)];
    })
  );
}

export function buildRebuiltReservePacksFromLegacy(legacyReservePacks) {
  const usedPrompts = new Set();
  return legacyReservePacks.map((legacyEntry, index) => {
    const pack = buildPack(
      legacyEntry.theme,
      legacyEntry.reserveId ?? `reserve-${String(index + 1).padStart(3, "0")}`,
      index + 365,
      true,
      legacyEntry.playability ?? "tactile",
      true
    );
    return uniquifyPackPrompts(pack, usedPrompts);
  });
}
