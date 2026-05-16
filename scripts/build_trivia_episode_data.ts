import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import legacyMixCategories from '../src/data/triviaPuzzles.ts';
import { SPORTS_DAILY_PACKS } from '../src/data/triviaSportsBank.ts';
import {
  CURATED_MIX_PATCHES,
  CURATED_SPORTS_BOOSTERS,
  type CuratedTriviaSourceQuestion,
} from '../src/data/trivia/curatedTriviaSources.ts';
import type {
  TriviaAuditReport,
  TriviaCalibrationEvidence,
  TriviaCitation,
  TriviaCouncilFlag,
  TriviaCurveballKind,
  TriviaDifficulty,
  TriviaDifficultyTarget,
  TriviaEditorialBucket,
  TriviaEpisodeDefinition,
  TriviaFeed,
  TriviaLegacyFamily,
  TriviaLookupRisk,
  TriviaObscurityFlag,
  TriviaPlayerAgentProfile,
  TriviaPlayerCalibrationFeedReport,
  TriviaPlayerCalibrationReport,
  TriviaPlayerDaySample,
  TriviaPlayerAgentSummary,
  TriviaQuestionScheduleEvidence,
  TriviaPlayerSlotSummary,
  TriviaPromptKind,
  TriviaQuestionRecord,
  TriviaSourceLabel,
  TriviaSourceTier,
  TriviaTasteTag,
  TriviaTelemetryQuestionAggregate,
  TriviaTelemetrySlotAggregate,
  TriviaTelemetrySnapshot,
} from '../src/data/trivia/types.ts';
import {
  evaluateTriviaCouncilQuestion,
  TRIVIA_PLAYER_CALIBRATION_DAYS,
  TRIVIA_SOLVE_AGENTS,
} from '../src/data/trivia/agentCouncil.ts';
import { canArmShield, resolveShieldAfterQuestion } from '../src/data/trivia/gameplay.ts';
import { getTriviaTelemetryBlendWeights } from '../src/data/trivia/telemetry.ts';
import {
  hasGimmickDistractorPattern,
  hasStaleRelativePhrasing,
  validateEpisodeDefinition,
  validateQuestionRecord,
} from '../src/data/trivia/validation.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const TRIVIA_DIR = path.join(ROOT, 'src/data/trivia');
const TELEMETRY_SNAPSHOT_PATH = path.join(TRIVIA_DIR, 'triviaTelemetrySnapshot.json');
const START_DATE_KEY = '2026-04-26';
const TOTAL_DAYS = 365;
const ACCESS_DATE = '2026-04-26';
const VERSION = 'trivia-v1';
const MIX_SCHEDULED_COUNT = TOTAL_DAYS * 12;
const SPORTS_SCHEDULED_COUNT = TOTAL_DAYS * 9;
const MIX_RESERVE_HEADROOM_TARGET = 500;
const SPORTS_RESERVE_HEADROOM_TARGET = 300;
const MIX_POOL_TARGET = MIX_SCHEDULED_COUNT + MIX_RESERVE_HEADROOM_TARGET;
const SPORTS_POOL_TARGET = SPORTS_SCHEDULED_COUNT + SPORTS_RESERVE_HEADROOM_TARGET;
const AUTHORED_SHARE_MINIMUMS: Record<TriviaFeed, Record<TriviaDifficulty, number>> = {
  mix: { easy: 0.7, hard: 0.85 },
  sports: { easy: 0.98, hard: 0.95 },
};
const SCHEDULE_ALLOWED_SOURCE_FAMILIES: Record<
  TriviaFeed,
  Record<TriviaDifficulty, readonly string[]>
> = {
  mix: {
    easy: ['mix-authored-evergreen', 'mix-authored-culture'],
    hard: ['mix-authored-evergreen', 'mix-authored-culture', 'mix-authored-hard'],
  },
  sports: {
    easy: ['sports-authored-core', 'sports-authored-hardcore'],
    hard: ['sports-authored-core', 'sports-authored-hardcore', 'sports-authored-mainstream-hard'],
  },
} as const;
const SPORTS_POOL_DIFFICULTY_MINIMUMS: Record<
  TriviaDifficulty,
  Partial<Record<TriviaDifficultyTarget, number>>
> = {
  easy: {},
  hard: { 2: 1600 },
};
const MIX_POOL_DIFFICULTY_MINIMUMS: Record<
  TriviaDifficulty,
  Partial<Record<TriviaDifficultyTarget, number>>
> = {
  easy: {},
  hard: { 2: 1250 },
};
const TRIVIA_DIFFICULTIES: TriviaDifficulty[] = ['easy', 'hard'];
const TIMER_SECONDS = 15;
const BASE_POINTS = 100;
const SPEED_BONUS = 50;
const SHIELD_POINTS = 50;
const MIX_DOMAIN_DISTRIBUTION = {
  science: 0.26,
  world: 0.26,
  history: 0.24,
  arts: 0.24,
} as const;
const MIX_DOMAIN_LAUNCH_TARGETS: Record<keyof typeof MIX_DOMAIN_DISTRIBUTION, number> = {
  science: 1139,
  world: 1139,
  history: 1051,
  arts: 1051,
};
const SPORTS_SUBDOMAIN_DISTRIBUTION = {
  football: 0.21,
  basketball: 0.19,
  baseball: 0.19,
  hockey: 0.13,
  soccer: 0.09,
  olympics: 0.05,
  golf: 0.04,
  tennis: 0.04,
  motorsport: 0.03,
  combat: 0.01,
  'general-sports': 0.02,
} as const;
const MIX_SLOT_CONFIDENCE_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.008, 0.012, 0.016, 0.03, 0.04, 0.05, 0.068, 0.082, 0.098, 0.05, 0.06, 0.055],
  hard: [0.045, 0.05, 0.055, 0.08, 0.09, 0.1, 0.14, 0.16, 0.18, 0.29, 0.31, 0.3],
};
const MIX_SLOT_TIMEOUT_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0, 0.001, 0.002, 0.004, 0.005, 0.006, 0.008, 0.011, 0.013, 0.009, 0.011, 0.01],
  hard: [0.001, 0.002, 0.004, 0.008, 0.01, 0.012, 0.016, 0.02, 0.024, 0.038, 0.04, 0.038],
};
const SPORTS_SLOT_CONFIDENCE_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.04, 0.065, 0.08, 0.11, 0.13, 0.18, 0.24, 0.31, 0.37],
  hard: [0.055, 0.08, 0.145, 0.17, 0.18, 0.29, 0.42, 0.52, 0.62],
};
const SPORTS_SLOT_TIMEOUT_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.002, 0.006, 0.009, 0.013, 0.016, 0.022, 0.03, 0.04, 0.05],
  hard: [0.002, 0.006, 0.011, 0.016, 0.018, 0.038, 0.054, 0.07, 0.082],
};
const FIRST_90_CALIBRATION_DAYS = 90;
const FULL_YEAR_CALIBRATION_DAYS = TOTAL_DAYS;
const SPORTS_CURVEBALL_GAP_DAYS = 7;
const SPORTS_CURVEBALL_TARGET_PER_MONTH = 1;
const SPORTS_CURVEBALL_ANCHOR_DAYS = [16] as const;
const SPORTS_Q9_GENERAL_PROMPT_KINDS = new Set<TriviaPromptKind>(['rule', 'term']);
const SPORTS_CORE_SUBDOMAINS = new Set(['football', 'basketball', 'baseball', 'hockey']);
const SPORTS_REPEATABLE_CORE_SUBDOMAINS = new Set(['football', 'basketball', 'baseball', 'hockey']);
const SPORTS_ROTATION_SUBDOMAINS = new Set(['golf', 'tennis', 'olympics', 'motorsport', 'soccer', 'combat']);
const SPORTS_NICHE_FLAGS: TriviaObscurityFlag[] = [
  'surname-inference',
  'roster-deep-cut',
  'stat-only',
];
const SPORTS_BLOCKED_FLAGS: TriviaObscurityFlag[] = [
  'media-tie-in',
  'incidental-context',
  'vague-stem',
  'timer-friction',
];
const SPORTS_ALLOWED_CURVEBALL_KINDS = new Set<TriviaPromptKind>([
  'rule',
  'term',
  'sport-id',
  'player',
  'event',
  'achievement',
]);
const MIX_ALLOWED_CURVEBALL_KINDS = new Set<TriviaPromptKind>([
  'term',
  'concept',
  'place',
  'work',
  'person',
  'rule',
]);
const MIX_TRICK_BLOCKLIST_REGEX =
  /\b(best definition|choose the best definition|definition of the term|what is the definition of the term|which word is defined as|missing word from the popular saying|which word refers|practitioner of the martial art of okinawan origin|female worshippers of god dionysos|self-discipline and refraining from worldly pleasures)\b/i;
const MIX_ARCHIVE_REJECT_REGEX =
  /\b(all of these|none of these|complete this line|missing (?:word|part|letter)|what saying|popular saying|which word in this sentence is incorrectly used|find the (?:missing|next) number|guess the missing number|what number comes next|fill in the missing letter|mode of this list|referring to the previous question|which statement (?:is|about)|one of the following|odd one out|pmh, psh, sh and fh|identify the \d{4} movie from the quote|this quote is from|the following quote belongs to|is a quote from|credited with the following quote|which word is defined as|what is the definition of the term|choose the best definition|winner of the \d{4} nobel prize|the devils dictionary)\b/i;
const MIX_RELATIONSHIP_REJECT_REGEX =
  /\b(wife|husband|daughter|son|mother|father|brother|sister|cousin|girlfriend|boyfriend|married to|eventual wife|start dating|dating)\b/i;
const MIX_POP_DEEPCUT_REJECT_REGEX =
  /\b(devil went down to georgia|the french connection|the light in the piazza|what about bob|rappers delight|sammy davis jr|tommy lee, vince neil|a thousand clowns|joe mcginnis|wilson pickett|backstairs at the white house|steven tyler and joe perry|osmond brothers|abbott and costello|love connection and lingo|drake and josh|happy days|eric wilson|sublime|the heidi chronicles|night of the living dead and dawn of the dead|james bonds aston martin|the birth of venus, the annunciation, medusa, and flora)\b/i;
const MIX_MEDIA_DEEPCUT_REJECT_REGEX =
  /\b(?:what|which) \d{4} movie\b|\bin the (?:movie|film)\b|\bat the end of the (?:movie|film)\b|\bwhat do we first see\b|\bwhat was the name of\b|\bwho portrays\b|\bwho portrayed\b|\bwhat actor played\b|\bwhich character from the \d{4} movie\b|\bwhat singer and actor portrayed\b|\bname the movie\b|\btag line\b|\btagline\b|\bquote from\b|\bwas telling us\b|\bduring the summer of\b/i;
const MIX_COUNT_TRIVIA_REGEX = /^how many\b/i;
const MIX_YEAR_TRIVIA_REGEX =
  /\bwhat year\b|^(?:in|during)\s+(?:19|20)\d{2}\b|\bin\s+(?:19|20)\d{2}\b/i;
const MIX_ACCORDING_TO_REGEX = /^according to\b/i;
const MIX_LINE_COMPLETE_REGEX = /^complete the line\b/i;
const MIX_PILOT_EPISODE_REGEX = /\bpilot episode\b|\bepisode title\b/i;
const MIX_ACTOR_DIRECTOR_REGEX =
  /\bwho (?:played|starred|directed|recorded)\b|\bwho portrayed\b|\bwhat actress starred\b|\bwhat actor played\b/i;
const MIX_ARCHIVE_MEDIA_REGEX =
  /\b(?:movie|film|tv|television|sitcom|series|show)\b.*\b(?:called|about|based in|pilot episode|directed|played|portrayed|starred)\b|\bghost hunters\b|\bthe waltons\b/i;
const MIX_DEFINITION_LOW_PAYOFF_REGEX =
  /^(?:what is|what does)\s+[a-z][a-z' -]{1,24}\??$/i;
const MIX_CONTEXTUAL_DEFINITION_ALLOW_REGEX =
  /^(?:in|on)\s+[a-z][a-z' -]+,\s+what is\b|^(?:in|on)\s+[a-z][a-z' -]+,\s+what does\b/i;
const MIX_STATEMENT_ELIMINATION_REGEX =
  /\bwhich statement is true\b|\bone of the following\b|\bwhich of the following\b/i;
const SPORTS_GENERAL_ALLOWED_REGEX =
  /\b(hat trick|home[- ](?:field|court) advantage|playoff|playoffs|overtime|sudden death|photo finish|wild card|seed(?:ed)?|bye week|match point|power play|penalty kill|under par|over par|home team|neutral site|rings|medal positions?|all-star|scoreless|tie-break|safety|relay|torch relay|walk-off)\b/i;
const SPORTS_GENERAL_REJECT_REGEX =
  /\b(chess|scrabble|seinfeld|reindeer|coach on the show|girlfriend|wife|brother-in-law|real name|ring name|anthrax scare|festivus|talk show|world class promotion|wrestlemania storyline|wrestlemania|battle of the billionaires|professional wrestler|pro wrestler|wwe|wwf|wcw|slammy award|rudolph the red-nosed reindeer|judge|court of appeals|board of education|special force|war was fought|battle of(?! the sexes))\b/i;
const SPORTS_NOVELTY_REJECT_REGEX =
  /\b(chess|scrabble|reindeer|rudolph the red-nosed reindeer|battle of the billionaires|wrestlemania|professional wrestler|pro wrestler|wwe|wwf|wcw|slammy award|anthrax scare|coach on the show|ring name|real name)\b/i;
const SPORTS_ARCHIVE_HARD_REJECT_REGEX =
  /\bwhich of the following\b|\bwhat was the name of\b|\bwho was the first\b|\bmany major league baseball players are from\b|\bthere is some debate as to which city\b|\bthe three [a-z]+ brothers\b|\bthis sports official\b|\bwhen he was made the commissioner\b|\bwhat arkansas [a-z]+ coach said\b|\bwhat was the name of the two brothers\b|\baccording to the official classification\b|\bancient greek wrestling school\b|\bwhat was the name of the colourful celebration\b|\bpittsburgh steelers of the 50s\b|\bjoe tinker was the shortstop\b|\bmajor leaguer from the dominican republic\b|\bduring the \d{4} nfl playoffs\b|\bbanned his players from\b/i;
const SPORTS_ICONIC_ALLOWLIST_REGEX =
  /\b(super bowl|stanley cup|world series|rose bowl|heisman|masters|wimbledon|olympic rings|miracle on ice|daytona 500|lambeau field|vince lombardi|larry o'brien|cy young|frozen tundra)\b/i;
const SPORTS_EXACT_DATE_REGEX =
  /^(?:on\s+(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2},\s+\d{4}|in\s+\d{4}\b)/i;
const SPORTS_ARCHIVE_STEM_REGEX =
  /^(?:name the|this (?:baseball|basketball|football|hockey|soccer) player\b|in \d{4} this\b|on [a-z]+\s+\d{1,2},\s+\d{4}\b)/i;
const SPORTS_LEGACY_REJECT_REGEX =
  /\b(all of these|none of these|how old was|middle name|birth year|born in what year|which other (?:nba |nfl |mlb |nhl )?teams? did|started his career with which team|what team lost that day|name the right fielder|wore #\d+|who was the winning pitcher|which coach|what university|unable to throw out any of the \d+|strikeout 3,?000 batters|first player to make these two accomplishments|what other nba teams did he also play for|which city did .* start (?:his|her|their) (?:major league )?career|national collegiate athletic association basketball championship|played nearly (?:his|her|their) entire career|what other teams did he also play for)\b/i;
const SPORTS_LEGACY_SOCCER_ALLOW_REGEX =
  /\b(world cup|lionel messi|cristiano ronaldo|pele|mia hamm|megan rapinoe|david beckham|goalkeeper|own goal|penalty area|penalty kick|red card|yellow card|hat trick|ballon d'or|champions league|premier league|emirates stadium|anfield|old trafford|camp nou|santiago bernabeu)\b/i;
const SPORTS_LEGACY_OLYMPICS_ALLOW_REGEX =
  /\b(michael phelps|simone biles|usain bolt|katie ledecky|allyson felix|shaun white|carl lewis|olympic rings|torch relay|medley|biathlon|decathlon|nordic combined|gold medal|swimming|gymnastics|track and field|winter games|summer games|relay)\b/i;
const SPORTS_REGEX =
  /\b(baseball|basketball|football|soccer|hockey|tennis|golf|olympic|olympics|nba|nfl|mlb|nhl|fifa|ncaa|world cup|super bowl|stanley cup|wimbledon|pga|athlete|coach|quarterback|pitcher|goalkeeper|touchdown|home run|slam dunk|inning|playoff|franchise|racing|nascar|formula 1|boxing|ufc|mma|wrestling|cricket|rugby|lacrosse|badminton|volleyball|skating|ski|snowboard|cycling|tour de france|marathon|stadium|medal|medalist|champion|championship|tournament|mvp|rookie|hall of fame|relay|track|golfer|birdie|bogey|\bpar\b|grand slam|field goal|figure skater|doubles match|world series|baseball team|soccer team|football club|golf ball|basketball coach|sprinter|diver|gymnast|skater|jockey|rider|umpire|referee|midfielder|striker|defender|pitch\b|rink|court|arena|player|league|serve|seed|batting|fielder|goal\b)\b/i;
const NON_SPORTS_SUPPLEMENT_REGEX =
  /\b(depression|anxiety|insomnia|therapy|symptom|disease|device|curve|economics|mathematics|grammar|chemistry|biology|astronomy|geology|religion|philosophy|literature|poetry|novel|computer|software|network|telephone|magazine|fashion|model|pantyhose|shaving cream)\b/i;
const SPORTS_MEDIA_TIEIN_REGEX =
  /\b(movie|film|tv|television|episode|series|novel|book|song|lyrics|band|musician|actor|actress|character|fictional|imaginary|showgirl|widow|cameo|animated|academy award|box-office|poster)\b/i;
const SPORTS_OFF_TONE_REGEX =
  /\b(most popular sport|national sport of|favorite football team|favourite football team|mascot|beauties as well|judging by their surnames|what country are they from|how many brothers|profession before becoming|tv ratings|famous sponsor|what honor did|what role did|what is his name|tagline|special force|counter-terrorism|supreme court|court of appeals|board of education|peoples court|judge|lawyer|other company|which war was fought|during which war|battle of marathon|this wrestler played|pretty woman|medal of honor|university of southern california|governor of|battle of the billionaires|chess opening|wwe|wwf|wcw|professional wrestler|pro wrestler|reindeer games)\b/i;
const SPORTS_MAINSTREAM_CORE_REJECT_REGEX =
  /\b(?:edson arantes do nascimento|atletico madrids youth system|queen of all sports|first gold in athletics during the 2008 olympic games|bull doggers partner|steer wrestling|dohy|attitude\. what is it called in japanese|a golf player hits the ball from the tee onto the green and in the hole all in one shot|parc ferme|undercut|bafana, bafana|pocket rocket|american mens basketball team at the olympic games held in beijing|ronaldo luis nazario de lima|in a relay race, which swimmer is called an anchor|made this statement)\b/i;
const DARK_CONTENT_REGEX =
  /\b(murder|rape|suicide|genocide|torture|massacre|serial killer|fatal disease)\b/i;
const LOW_SIGNAL_REGEX =
  /\b(who said|once said|start dating|dated|cover of (?:what|which) popular magazine|socialite|what popular model|world-famous female model|model turned actress|what manufacturers first|cdma2000|pantyhose|shaving cream|magazine|quote\b|noxema|gto as a separate model|hypermodern opening)\b/i;
const SPORTS_LOW_SIGNAL_LEGACY_REGEX =
  /\b(initial aims of the tiger woods foundation|real first name of golf champion|when he was younger|what age did he start playing golf|golf ball marshal|first ever us masters golf tournament|official colors of the wimbledon tournament|international tennis hall of fame|game winning goal for the detroit red wings in the 1950 stanley cup finals|go kart|peanuts believed to be bad for auto racing|what does nascar stand for|grand prix of endurance|pitching triple crown|what decade witnessed|winningest basketball coach in ncaa history|what are the two shots that are the same movement|what were the initial aims)\b/i;
const SPORTS_ARCHIVE_FRAGMENT_REGEX =
  /\b(?:what job does|what profession before becoming|what age did he start|what are the initials|renamed this to honor|took the cup|where did goaltender|what role did|what honor did|what was his name|how many brothers)\b/i;
const SPORTS_COUNT_TRIVIA_REGEX = /^how many\b/i;
const SPORTS_YEAR_TRIVIA_REGEX =
  /\bwhat year\b|^(?:in|during)\s+(?:19|20)\d{2}\b|\bin\s+(?:19|20)\d{2}\b/i;
const SPORTS_ACCORDING_TO_REGEX = /^according to\b/i;
const SPORTS_NICKNAME_ONLY_REGEX =
  /^(?:which nickname belongs to|which athlete is nicknamed|why was .* nicknamed)\b|\bbetter known by (?:his|her|their) nickname\b/i;
const SPORTS_TEAM_ASSOCIATION_REGEX =
  /\bwhich team plays at\b|\bthe team that plays at\b|\bwhich venue is home to the\b|\bcompetes in which league\b/i;
const SPORTS_ATHLETE_ASSOCIATION_REGEX =
  /\bwhich athlete is most closely associated with\b|\bmost closely associated with which team\b|\bwas primarily the .* for the\b|\bwhich .* star was primarily the\b/i;
const SPORTS_LEGACY_HISTORY_REGEX =
  /\bwinning pitcher\b|\bfounded\b|\bwhen .* won\b|\bfirst .* to\b|\bquarterback .* when they won\b|\bwon the .* in \d{4}\b/i;
const US_MAINSTREAM_SPORTS_REGEX =
  /\b(nfl|nba|mlb|super bowl|world series|march madness|final four|stanley cup|heisman|yankees|lakers|cowboys|patriots|cubs|red sox)\b/i;
const HEAVY_LOOKUP_REGEX =
  /\b(what year|which year|record|stat|average|percentage|miles per gallon|model \d)\b/i;
const TRICK_PATTERN =
  /\b(riddle|trick|which statement is true|what happens if|what is true about this rule|which of these is not|mode of this list|what do the following|complete this|idiom|saying|brain teaser|lateral)\b/i;
const SPORTS_TRICK_PATTERN =
  /\b(infield fly|touchback|fair catch|strip sack|intentional grounding|backcourt violation|five-hole|biathlon|decathlon|nordic combined|pole position|parc ferme|split decision|medley)\b/i;
const PROPER_ENTITY_REGEX =
  /\b(?:[A-Z][a-z]+|[A-Z]{2,}|[0-9]{4})(?:\s+(?:[A-Z][a-z]+|[A-Z]{2,}|[0-9]{4})){0,3}\b/g;
const STOP_ENTITY_WORDS = new Set([
  'A',
  'An',
  'And',
  'At',
  'By',
  'For',
  'From',
  'How',
  'In',
  'Of',
  'On',
  'Or',
  'The',
  'This',
  'What',
  'When',
  'Where',
  'Which',
  'Who',
  'Why',
]);

type SourceTriviaQuestion = {
  prompt: string;
  options: string[];
  answerIndex: number;
  difficulty: TriviaDifficultyTarget;
  domain?: string;
  subdomain?: string;
  citations?: TriviaCitation[];
  rationaleShort?: string;
  rationaleLong?: string;
  editorialBucket?: TriviaEditorialBucket;
  lookupRisk?: TriviaLookupRisk;
  promptKind?: TriviaPromptKind;
  salienceScore?: number;
  obscurityFlags?: TriviaObscurityFlag[];
  anchorSubdomain?: string;
  curveballKind?: TriviaCurveballKind;
  legacyFamily?: TriviaLegacyFamily;
  isTrickQuestion?: boolean;
  curveballOnly?: boolean;
  themeTags?: string[];
};

type MixSlotConfig = {
  difficulty: TriviaDifficultyTarget;
  buckets: TriviaEditorialBucket[];
  domainOrder: string[];
  refreshable: boolean;
  maxStemLength?: number;
  allowedLookupRisks?: TriviaLookupRisk[];
  minSalienceScore?: number;
  maxSalienceScore?: number;
  preferredPromptKinds?: TriviaPromptKind[];
  targetSalienceScore?: number;
  preferHigherLookupRisk?: boolean;
  blockedObscurityFlags?: TriviaObscurityFlag[];
};

type SportsSlotConfig = {
  difficulty: TriviaDifficultyTarget;
  buckets: TriviaEditorialBucket[];
  subdomainOrder: string[];
  refreshable: boolean;
  maxStemLength?: number;
  allowedLookupRisks?: TriviaLookupRisk[];
  minSalienceScore?: number;
  maxSalienceScore?: number;
  preferredPromptKinds?: TriviaPromptKind[];
  targetSalienceScore?: number;
  preferHigherLookupRisk?: boolean;
  blockedObscurityFlags?: TriviaObscurityFlag[];
};

type FeedTheme = {
  tag: string;
  mixDomains?: string[];
  sportsSubdomains?: string[];
};

type SlotSelectionState = {
  feed: TriviaFeed;
  scheduleDifficulty: TriviaDifficulty;
  slotIndex: number;
  usedPromptKinds: Set<TriviaPromptKind>;
  usedSurfaceForms: Set<string>;
  recentSurfaceForms: string[];
  generalSportsCount: number;
  nicheCount: number;
  rotationCount: number;
  minimumRotationTarget: number;
  allowHighRisk: boolean;
  crossDifficultyUsedVariantGroups: Set<string>;
  crossDifficultyBlockedVariantGroups: Set<string>;
};

type ScheduleBuildConstraints = {
  crossDifficultyUsedVariantGroups?: Set<string>;
  crossDifficultyBlockedVariantGroupsByDay?: Set<string>[];
};

const MIX_WEEKLY_THEMES: FeedTheme[] = [
  { tag: 'broad-mix', mixDomains: ['world', 'history', 'science', 'arts'] },
  { tag: 'culture-spark', mixDomains: ['arts', 'history', 'world', 'science'] },
  { tag: 'science-history', mixDomains: ['science', 'history', 'world', 'arts'] },
  { tag: 'places-life', mixDomains: ['world', 'science', 'arts', 'history'] },
  { tag: 'pop-momentum', mixDomains: ['arts', 'world', 'science', 'history'] },
  { tag: 'deep-cut', mixDomains: ['history', 'science', 'arts', 'world'] },
  { tag: 'spotlight', mixDomains: ['world', 'arts', 'history', 'science'] },
];

const SPORTS_WEEKLY_THEMES: FeedTheme[] = [
  { tag: 'weekend-recap', sportsSubdomains: ['football', 'basketball', 'baseball', 'hockey'] },
  { tag: 'league-rotation', sportsSubdomains: ['baseball', 'basketball', 'hockey', 'football'] },
  { tag: 'legends-and-lore', sportsSubdomains: ['hockey', 'olympics', 'golf', 'tennis'] },
  { tag: 'form-and-finals', sportsSubdomains: ['basketball', 'baseball', 'football', 'hockey'] },
  { tag: 'rivalry-night', sportsSubdomains: ['football', 'hockey', 'basketball', 'baseball'] },
  { tag: 'fan-challenge', sportsSubdomains: ['hockey', 'golf', 'tennis', 'motorsport'] },
  { tag: 'marquee-moments', sportsSubdomains: ['football', 'basketball', 'baseball', 'hockey'] },
];

function getStartDate(): Date {
  return new Date(`${START_DATE_KEY}T12:00:00`);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getMonthKey(date: Date): string {
  return getDateKey(date).slice(0, 7);
}

function getRemainingDaysInMonth(date: Date): number {
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return last.getDate() - date.getDate();
}

function getScheduleEndDate(): Date {
  return addDays(getStartDate(), TOTAL_DAYS - 1);
}

function getSportsCurveballTargetDays(date: Date): number[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1, 12);
  const lastOfMonth = new Date(year, month + 1, 0, 12);
  const scheduleStart = getStartDate();
  const scheduleEnd = getScheduleEndDate();
  const activeStartDay =
    year === scheduleStart.getFullYear() && month === scheduleStart.getMonth()
      ? scheduleStart.getDate()
      : 1;
  const activeEndDay =
    year === scheduleEnd.getFullYear() && month === scheduleEnd.getMonth()
      ? scheduleEnd.getDate()
      : lastOfMonth.getDate();
  const anchoredTargets = SPORTS_CURVEBALL_ANCHOR_DAYS.filter(
    (day) => day >= activeStartDay && day <= activeEndDay
  );

  if (anchoredTargets.length > 0) return anchoredTargets;

  const midpointDay = Math.max(
    activeStartDay,
    Math.min(activeEndDay, activeStartDay + Math.floor((activeEndDay - activeStartDay) / 2))
  );
  return [midpointDay];
}

function isSportsCurveballTargetDate(date: Date): boolean {
  return getSportsCurveballTargetDays(date).includes(date.getDate());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const next = [...items];
  const rand = mulberry32(seed);
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function dedupe<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function clampDifficulty(value: number): TriviaDifficultyTarget {
  return clamp(Math.round(value), 1, 3) as TriviaDifficultyTarget;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function rewritePrompt(prompt: string): string {
  let next = normalizeText(prompt);
  next = next.replace(/\(now ([^)]+)\)/gi, '(present-day $1)');
  next = next.replace(/\bnow-commonplace\b/gi, 'widely used');
  next = next.replace(/\bnow famous\b/gi, 'famous');
  next = next.replace(/\bcurrently headed\b/gi, 'headed');
  next = next.replace(/\bToday in Major League Baseball\b/gi, 'In modern Major League Baseball');
  next = next.replace(/\bits now stuck\b/gi, "it's stuck");

  if (/^In this year\b/i.test(next)) {
    next = next.replace(/^In this year[, ]*/i, 'Which year fits this clue: ');
    if (!/[?.!]$/.test(next)) next += '?';
  }

  next = next.replace(/\bin this year\b/gi, 'in which year');
  next = next.replace(/\bthis year\b/gi, 'which year');
  next = next.replace(/\bthis season\b/gi, 'that season');
  next = next.replace(/\blast season\b/gi, 'that season');
  next = next.replace(/\bcurrently\b/gi, 'at publication time');
  next = next.replace(/\brecently\b/gi, 'in the reported period');
  next = next.replace(/\bnow\b/gi, 'at that point');
  return normalizeText(next);
}

function looksLikeFragmentStem(prompt: string): boolean {
  const normalized = normalizeText(prompt);
  if (!normalized) return true;
  if (/[?]/.test(normalized)) return false;
  if (/^(what|which|who|where|when|why|how|name)\b/i.test(normalized)) return false;
  if (/^(in|on|at|from|for|with)\b/i.test(normalized) && normalized.split(/\s+/).length >= 4) {
    return false;
  }
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length <= 4) return true;
  if (/^[A-Z0-9][A-Za-z0-9'’:.,&/-]+(?:\s+[A-Z0-9][A-Za-z0-9'’:.,&/-]+){0,4}$/.test(normalized)) {
    return true;
  }
  return false;
}

function deriveTasteTags(params: {
  feed: TriviaFeed;
  prompt: string;
  promptKind: TriviaPromptKind;
  subdomain: string;
  editorialSourceFamily: string;
  lookupRisk: TriviaLookupRisk;
  salienceScore: number;
  isTrickQuestion: boolean;
  curveballKind: TriviaCurveballKind;
}): TriviaTasteTag[] {
  const {
    feed,
    prompt,
    promptKind,
    subdomain,
    editorialSourceFamily,
    lookupRisk,
    salienceScore,
    isTrickQuestion,
    curveballKind,
  } = params;
  const tags = new Set<TriviaTasteTag>();
  const normalizedPrompt = normalizeText(prompt);
  const lower = normalizedPrompt.toLowerCase();

  if (feed === 'mix') {
    if (MIX_COUNT_TRIVIA_REGEX.test(normalizedPrompt)) tags.add('count-trivia');
    if (MIX_YEAR_TRIVIA_REGEX.test(normalizedPrompt)) tags.add('year-trivia');
    if (MIX_ACCORDING_TO_REGEX.test(normalizedPrompt)) tags.add('according-to');
    if (MIX_LINE_COMPLETE_REGEX.test(normalizedPrompt)) tags.add('line-complete');
    if (MIX_PILOT_EPISODE_REGEX.test(normalizedPrompt)) tags.add('pilot-episode');
    if (MIX_ACTOR_DIRECTOR_REGEX.test(normalizedPrompt)) tags.add('actor-director-credit');
    if (MIX_ARCHIVE_MEDIA_REGEX.test(normalizedPrompt)) tags.add('archive-media');
    if (looksLikeFragmentStem(normalizedPrompt)) tags.add('fragment-stem');
    if (
      MIX_STATEMENT_ELIMINATION_REGEX.test(normalizedPrompt) ||
      /\bwhich of these\b/i.test(normalizedPrompt)
    ) {
      tags.add('statement-elimination');
    }
    if (
      MIX_DEFINITION_LOW_PAYOFF_REGEX.test(normalizedPrompt) &&
      !MIX_CONTEXTUAL_DEFINITION_ALLOW_REGEX.test(normalizedPrompt) &&
      salienceScore < 78
    ) {
      tags.add('definition-low-payoff');
    }
    if (
      normalizedPrompt.length > 150 ||
      /^this\b/i.test(normalizedPrompt) ||
      /^the character portrayed\b/i.test(normalizedPrompt)
    ) {
      tags.add('long-setup');
    }
  } else {
    if (
      SPORTS_COUNT_TRIVIA_REGEX.test(normalizedPrompt) &&
      promptKind !== 'rule' &&
      promptKind !== 'term'
    ) {
      tags.add('count-trivia');
    }
    if (SPORTS_YEAR_TRIVIA_REGEX.test(normalizedPrompt)) tags.add('year-trivia');
    if (SPORTS_ACCORDING_TO_REGEX.test(normalizedPrompt)) tags.add('according-to');
    if (SPORTS_NICKNAME_ONLY_REGEX.test(normalizedPrompt)) tags.add('nickname-only');
    if (SPORTS_TEAM_ASSOCIATION_REGEX.test(normalizedPrompt)) tags.add('team-association');
    if (SPORTS_ATHLETE_ASSOCIATION_REGEX.test(normalizedPrompt)) tags.add('athlete-association');
    if (looksLikeFragmentStem(normalizedPrompt)) tags.add('fragment-stem');
    if (
      SPORTS_LEGACY_HISTORY_REGEX.test(normalizedPrompt) ||
      SPORTS_MAINSTREAM_CORE_REJECT_REGEX.test(normalizedPrompt) ||
      (
        editorialSourceFamily === 'sports-core-bank' &&
        (lookupRisk === 'high' ||
          salienceScore < 80 ||
          /\b(?:19|20)\d{2}\b/.test(normalizedPrompt))
      )
    ) {
      tags.add('legacy-sports-history');
    }
    if (
      normalizedPrompt.length > 145 ||
      /^this\b/i.test(normalizedPrompt) ||
      /^a golfer who has done any one of these\b/i.test(lower)
    ) {
      tags.add('long-setup');
    }
    if (
      promptKind === 'player' &&
      isTrickQuestion &&
      curveballKind === 'famous-nickname' &&
      salienceScore >= 90
    ) {
      tags.delete('nickname-only');
    }
  }

  return [...tags];
}

function inferSurfaceFormKey(question: TriviaQuestionRecord): string {
  const stem = question.stem;

  if (question.feed === 'mix') {
    if (/is best known as which kind of work\?/i.test(stem)) return 'mix-work-form';
    if (/^Who (?:wrote|composed|created) /i.test(stem)) return 'mix-creator-credit';
    if (/^Which historical figure is most associated with/i.test(stem)) return 'mix-history-association';
    if (/^Which title is most closely associated with /i.test(stem)) return 'mix-title-association';
    if (/^Which place is most closely associated with /i.test(stem)) return 'mix-place-association';
    if (/^Which scientist is most closely associated with /i.test(stem)) return 'mix-science-association';
    if (/^What does /i.test(stem) || question.tasteTags.includes('definition-low-payoff')) {
      return 'mix-definition';
    }
    if (/\bmovie|film|tv|television|series|show|song\b/i.test(stem)) return 'mix-pop-culture';
    return `mix-${question.promptKind}`;
  }

  if (question.tasteTags.includes('team-association')) return 'sports-team-association';
  if (question.tasteTags.includes('athlete-association')) return 'sports-athlete-association';
  if (/^Which venue is home to the\b/i.test(stem) || /^The team that plays at\b/i.test(stem)) {
    return 'sports-venue-home';
  }
  if (question.tasteTags.includes('nickname-only')) return 'sports-nickname';
  if (question.promptKind === 'rule' && /^What (?:is|does)\b/i.test(stem)) return 'sports-rule-definition';
  if (question.promptKind === 'term' && /^What (?:is|does)\b/i.test(stem)) return 'sports-term-definition';
  if (/^Which team won\b/i.test(stem)) return 'sports-title-winner';
  return `sports-${question.promptKind}`;
}

function isSurfaceFormConstrained(surfaceForm: string): boolean {
  return [
    'mix-work-form',
    'mix-history-association',
    'mix-title-association',
    'mix-place-association',
    'mix-science-association',
    'mix-definition',
    'mix-pop-culture',
    'sports-team-association',
    'sports-athlete-association',
    'sports-venue-home',
    'sports-nickname',
    'sports-rule-definition',
    'sports-term-definition',
    'sports-title-winner',
  ].includes(surfaceForm);
}

function getRecentSurfaceFormLimit(feed: TriviaFeed, surfaceForm: string): number {
  if (feed === 'mix') {
    if (surfaceForm === 'mix-pop-culture') return 4;
    if (surfaceForm === 'mix-creator-credit') return 3;
    return 2;
  }

  if (surfaceForm === 'sports-rule-definition' || surfaceForm === 'sports-term-definition') return 3;
  return 2;
}

function isLowSignalQuestion(prompt: string, options: string[]): boolean {
  const hay = `${prompt} ${options.join(' ')}`;
  return LOW_SIGNAL_REGEX.test(hay);
}

function countSportsSignals(value: string): number {
  const matches = value.match(new RegExp(SPORTS_REGEX.source, 'gi'));
  return matches?.length ?? 0;
}

function inferPromptKind(
  feed: TriviaFeed,
  prompt: string,
  answerText: string,
  subdomain: string,
  domain: string
): TriviaPromptKind {
  const hay = `${prompt} ${answerText}`.toLowerCase();

  if (/\b(which city|home to the|based in|capital of|continent|ocean|country)\b/.test(hay)) return 'place';
  if (/\b(which venue|stadium|arena|field|park|course|surface)\b/.test(hay)) return 'venue';
  if (/\b(which sport|what sport|compete in which sport)\b/.test(hay)) return 'sport-id';
  if (/\b(what does|what is the name for|what term|stands for|called|known as|refers to)\b/.test(hay))
    return 'term';
  if (/\b(rule|illegal|allowed|worth|how many points|how many players|offside|icing|balk|deuce|let|fair catch|touchback|shot clock)\b/.test(hay))
    return 'rule';
  if (/\b(trophy|award|champion|championship|medal|mvp|winner|wins|won|title)\b/.test(hay))
    return 'achievement';
  if (/\b(record|streak|all-time|most|fewest|longest|leading)\b/.test(hay)) return 'record';
  if (/\b(movie|song|novel|series|album|painting|document)\b/.test(hay)) return 'work';
  if (/\b(author|artist|actor|actress|president|king|queen|who wrote|who painted)\b/.test(hay))
    return 'person';
  if (/\b(war|battle|holiday|games|tournament|cup|open|grand prix|world cup|super bowl|masters|wimbledon|olympics)\b/.test(hay))
    return 'event';
  if (/\b(team|club|franchise)\b/.test(hay)) return 'team';
  if (/\b(player|position|goalkeeper|quarterback|pitcher|golfer|boxer|forward|guard|center)\b/.test(hay))
    return 'player';
  if (/\b(instrument|device|equipment|tool)\b/.test(hay)) return 'equipment';

  if (feed === 'sports') {
    if (subdomain === 'general-sports') return 'term';
    if (subdomain === 'football' || subdomain === 'basketball' || subdomain === 'baseball' || subdomain === 'hockey' || subdomain === 'soccer')
      return 'player';
    if (subdomain === 'golf' || subdomain === 'tennis' || subdomain === 'motorsport') return 'event';
    return 'sport-id';
  }

  if (domain === 'world') return 'place';
  if (domain === 'arts') return 'work';
  if (domain === 'history') return 'event';
  return 'concept';
}

function deriveObscurityFlags(
  feed: TriviaFeed,
  prompt: string,
  subdomain: string,
  lookupRisk: TriviaLookupRisk,
  promptKind: TriviaPromptKind
): TriviaObscurityFlag[] {
  const hay = prompt.toLowerCase();
  const flags: TriviaObscurityFlag[] = [];

  if (
    /\b(record|streak|how many|what year|average|percentage|all-time|most (?:points|wins|titles|medals|yards|touchdowns|home runs|career))\b/.test(
      hay
    ) ||
    lookupRisk === 'high'
  ) {
    flags.push('stat-only');
  }
  if (/\b(which statement|one of the following|odd one out|best describes|what distinction)\b/.test(hay)) {
    flags.push('vague-stem');
  }
  const timerFrictionLengthThreshold = feed === 'mix' ? 170 : 160;
  if (prompt.length > timerFrictionLengthThreshold || (prompt.match(/,/g) ?? []).length >= 5) {
    flags.push('timer-friction');
  }

  if (feed === 'sports') {
    if (/\b(surname|judging by|what country are they from)\b/.test(hay)) flags.push('surname-inference');
    if (
      /\b(what number|college did|draft choice|start his career with|first round|which team did .* start)\b/.test(
        hay
      )
    ) {
      flags.push('roster-deep-cut');
    }
    if (SPORTS_MEDIA_TIEIN_REGEX.test(prompt)) flags.push('media-tie-in');
    if (SPORTS_OFF_TONE_REGEX.test(prompt)) flags.push('incidental-context');
    if (
      /\b(nickname|nicknamed|known as the|called the|better known by|goes by|the great one|the pocket rocket|the rocket|airness|intimidator)\b/.test(
        hay
      )
    ) {
      flags.push('famous-nickname');
    }
    if (SPORTS_TRICK_PATTERN.test(prompt) || (promptKind === 'rule' && /\b(except|unless)\b/.test(hay))) {
      flags.push('edge-case');
    }
  }

  return dedupe(flags);
}

function computeSalienceScore(
  feed: TriviaFeed,
  prompt: string,
  promptKind: TriviaPromptKind,
  lookupRisk: TriviaLookupRisk,
  subdomain: string,
  obscurityFlags: TriviaObscurityFlag[],
  explicitScore?: number
): number {
  if (explicitScore != null) return clamp(Math.round(explicitScore), 0, 100);

  let score = feed === 'sports' ? 74 : 72;
  if (US_MAINSTREAM_SPORTS_REGEX.test(prompt)) score += 8;
  if (feed === 'sports' && ['rule', 'term', 'achievement', 'venue', 'event'].includes(promptKind)) score += 4;
  if (feed === 'mix' && ['place', 'work', 'concept', 'person'].includes(promptKind)) score += 3;
  if (prompt.length <= 88) score += 4;
  if (prompt.length > 125) score -= 8;
  if (subdomain === 'general-sports') score -= 4;
  if (lookupRisk === 'medium') score -= 4;
  if (lookupRisk === 'high') score -= 10;
  if (feed === 'sports' && promptKind === 'player' && /\bwhich of these .* players? was primarily a\b/i.test(prompt)) {
    score -= 8;
  }
  if (feed === 'sports' && promptKind === 'player' && /\bwhich .* star was primarily the\b/i.test(prompt)) {
    score -= 5;
  }
  if (feed === 'sports' && promptKind === 'venue' && /\bwhich venue is home to the\b/i.test(prompt)) {
    score -= 10;
  }
  if (feed === 'sports' && promptKind === 'achievement' && /\bbecame famous for\b/i.test(prompt)) {
    score -= 10;
  }
  if (feed === 'sports' && ['term', 'rule'].includes(promptKind) && /^In\b/i.test(prompt)) {
    score -= 4;
  }

  obscurityFlags.forEach((flag) => {
    if (flag === 'media-tie-in' || flag === 'incidental-context' || flag === 'vague-stem') score -= 28;
    if (flag === 'surname-inference') score -= 12;
    if (flag === 'roster-deep-cut') score -= 10;
    if (flag === 'stat-only') score -= 8;
    if (flag === 'timer-friction') score -= 6;
    if (flag === 'famous-nickname') score += 2;
    if (flag === 'edge-case') score += 1;
  });

  return clamp(Math.round(score), 20, 98);
}

function inferSourceTier(sourceCategory: string, variantIndex: number): TriviaSourceTier {
  if (variantIndex > 0) return 'variant';
  if (sourceCategory.startsWith('curated-')) return 'curated';
  if (sourceCategory.includes('supplement')) return 'supplemental';
  return 'legacy';
}

function inferSourceLabel(sourceCategory: string, variantIndex: number): TriviaSourceLabel {
  if (variantIndex > 0) return 'variant';
  if (sourceCategory === 'curated-sports-template') return 'curated-template';
  if (sourceCategory.startsWith('curated-')) return 'curated-authored';
  if (sourceCategory.includes('supplement')) return 'supplemental';
  return 'legacy-base';
}

function inferLegacyFamily(
  feed: TriviaFeed,
  prompt: string,
  promptKind: TriviaPromptKind,
  subdomain: string,
  sourceTier: TriviaSourceTier
): TriviaLegacyFamily {
  if (sourceTier !== 'legacy') return 'none';

  if (SPORTS_OFF_TONE_REGEX.test(prompt) || SPORTS_GENERAL_REJECT_REGEX.test(prompt)) {
    return 'off-tone';
  }
  if (MIX_RELATIONSHIP_REJECT_REGEX.test(prompt) || /\b(wife|husband|daughter|son|mother|father|brother|sister|middle name)\b/i.test(prompt)) {
    return 'relationship';
  }
  if (SPORTS_EXACT_DATE_REGEX.test(prompt)) return 'exact-date';
  if (HEAVY_LOOKUP_REGEX.test(prompt) || promptKind === 'record') return 'stat-trap';
  if (SPORTS_ARCHIVE_STEM_REGEX.test(prompt) || /^This\b/.test(prompt)) return 'archive-bio';
  if (feed === 'sports' && !SPORTS_CORE_SUBDOMAINS.has(subdomain) && !SPORTS_ROTATION_SUBDOMAINS.has(subdomain) && subdomain !== 'general-sports') {
    return 'fringe-subdomain';
  }
  if (SPORTS_LEGACY_REJECT_REGEX.test(prompt) || MIX_ARCHIVE_REJECT_REGEX.test(prompt)) {
    return 'misc-trivia';
  }
  return 'none';
}

function inferCurveballKind(
  feed: TriviaFeed,
  promptKind: TriviaPromptKind,
  obscurityFlags: TriviaObscurityFlag[],
  isTrickQuestion: boolean
): TriviaCurveballKind {
  if (!isTrickQuestion) return 'none';

  if (feed === 'sports') {
    if (obscurityFlags.includes('famous-nickname')) return 'famous-nickname';
    if (promptKind === 'rule') return 'rule-nuance';
    if (promptKind === 'term') return 'terminology';
    if (promptKind === 'sport-id') return 'sport-identification';
    return 'famous-edge-case';
  }

  if (promptKind === 'term') return 'clean-term';
  return 'clean-concept';
}

function isAllowedCurveballQuestion(feed: TriviaFeed, question: TriviaQuestionRecord): boolean {
  if (question.obscurityFlags.includes('media-tie-in') || question.obscurityFlags.includes('vague-stem')) {
    return false;
  }

  if (feed === 'sports') {
    if (SPORTS_LEGACY_REJECT_REGEX.test(question.stem) || HEAVY_LOOKUP_REGEX.test(question.stem)) {
      return false;
    }
    return (
      ['rule-nuance', 'terminology', 'sport-identification', 'famous-nickname', 'famous-edge-case'].includes(
        question.curveballKind
      ) &&
      SPORTS_ALLOWED_CURVEBALL_KINDS.has(question.promptKind) &&
      (question.promptKind !== 'record' || !question.obscurityFlags.includes('stat-only'))
    );
  }

  if (MIX_TRICK_BLOCKLIST_REGEX.test(question.stem)) {
    return false;
  }

  return MIX_ALLOWED_CURVEBALL_KINDS.has(question.promptKind);
}

function isMixEditorialFit(question: TriviaQuestionRecord, difficultyPool: TriviaDifficulty): boolean {
  if (question.obscurityFlags.includes('vague-stem')) return false;
  if (question.obscurityFlags.includes('timer-friction') && difficultyPool === 'easy') return false;
  if (question.isTrickQuestion && !isAllowedCurveballQuestion('mix', question)) return false;
  if (MIX_ARCHIVE_REJECT_REGEX.test(question.stem)) return false;
  if (LOW_SIGNAL_REGEX.test(question.stem)) return false;
  if (MIX_MEDIA_DEEPCUT_REJECT_REGEX.test(question.stem)) return false;
  if (/\bquote\b/i.test(question.stem) && /\b(?:movie|film|song|speaker|scientist|man|woman)\b/i.test(question.stem)) {
    return false;
  }
  if (MIX_RELATIONSHIP_REJECT_REGEX.test(question.stem)) return false;
  if (difficultyPool === 'easy' && /^This\b/i.test(question.stem)) return false;
  if (difficultyPool === 'hard' && /^This\b/i.test(question.stem) && question.salienceScore < 82) {
    return false;
  }
  if (
    difficultyPool === 'hard' &&
    /\b(?:movie|film)\b/i.test(question.stem) &&
    /\b(?:quote|character|actor|actress|played|portrayed|starring|tag line|tagline|at the end|what do we first see)\b/i.test(
      question.stem
    )
  ) {
    return false;
  }
  if (difficultyPool === 'easy') {
    if (question.stem.length > 155) return false;
    if (question.stem.length > 142 && question.salienceScore < 76) return false;
  } else {
    if (question.stem.length > 188) return false;
    if (question.stem.length > 170 && question.salienceScore < 60) return false;
    if (
      question.salienceScore < 68 &&
      (/^this [a-z]+,/i.test(question.stem) ||
        /\b(?:winner of the \d{4}|quoted? in|The Devils Dictionary)\b/i.test(question.stem))
    ) {
      return false;
    }
  }
  if (question.editorialBucket === 'topical' && difficultyPool === 'easy' && question.salienceScore < 68) {
    return false;
  }
  if (
    question.tasteTags.some((tag) =>
      [
        'count-trivia',
        'year-trivia',
        'according-to',
        'line-complete',
        'pilot-episode',
        'actor-director-credit',
        'archive-media',
        'statement-elimination',
      ].includes(tag)
    )
  ) {
    return false;
  }
  if (question.tasteTags.includes('definition-low-payoff')) return false;
  return true;
}

function isMixPoolCandidateFit(question: TriviaQuestionRecord): boolean {
  if (
    /\b(all the people on this list|best describe all the people|would best describe|best describe all of these)\b/i.test(
      question.stem
    )
  ) {
    return false;
  }
  if ((question.stem.match(/,/g) ?? []).length >= 3 && /\b(list|describe)\b/i.test(question.stem)) {
    return false;
  }
  return question.options.length === 3;
}

function isAllowedGeneralSportsFallback(question: TriviaQuestionRecord): boolean {
  if (question.subdomain !== 'general-sports') return true;
  if (question.id.includes('sports-supplement')) return false;
  if (!['term', 'rule', 'event', 'achievement'].includes(question.promptKind)) return false;
  if (question.salienceScore < 80) return false;
  if (question.lookupRisk !== 'low') return false;
  if (question.obscurityFlags.includes('stat-only')) return false;
  if (question.obscurityFlags.includes('famous-nickname')) return false;
  if (SPORTS_GENERAL_REJECT_REGEX.test(question.stem)) return false;
  if (/^In sports, what does\b/i.test(question.stem) || /^What is the sports term for\b/i.test(question.stem)) {
    return true;
  }
  return SPORTS_GENERAL_ALLOWED_REGEX.test(question.stem);
}

function isOffToneScheduledSportsQuestion(question: TriviaQuestionRecord): boolean {
  if (question.obscurityFlags.some((flag) => SPORTS_BLOCKED_FLAGS.includes(flag))) return true;
  if (question.legacyFamily === 'off-tone' || question.legacyFamily === 'relationship') return true;
  if (question.subdomain === 'general-sports' && question.promptKind === 'player') return true;
  return false;
}

function isSportsSupplementQuestion(question: SourceTriviaQuestion): boolean {
  const prompt = rewritePrompt(question.prompt);
  const promptSignals = countSportsSignals(prompt);
  const answerText = question.options[question.answerIndex] ?? '';
  const answerSignals = countSportsSignals(answerText);
  const optionSignals = question.options.map((option) => countSportsSignals(option));
  const totalSignals = promptSignals + optionSignals.reduce((sum, count) => sum + count, 0);
  const bestDistractorSignal = optionSignals
    .filter((_, index) => index !== question.answerIndex)
    .reduce((max, count) => Math.max(max, count), 0);
  const hay = `${prompt} ${question.options.join(' ')}`;

  if (!totalSignals) return false;
  if (NON_SPORTS_SUPPLEMENT_REGEX.test(prompt) && promptSignals === 0) return false;
  if (promptSignals >= 1) return true;
  if (answerSignals >= 1 && totalSignals >= 2) return true;
  if (answerSignals >= 1 && bestDistractorSignal === 0 && !NON_SPORTS_SUPPLEMENT_REGEX.test(hay)) return true;
  return false;
}

function isSportsEditorialFit(question: TriviaQuestionRecord, difficultyPool: TriviaDifficulty): boolean {
  const isLegacySportsRow =
    question.id.startsWith('sports-sports-') || question.id.startsWith('sports-sports-supplement-');

  if (isOffToneScheduledSportsQuestion(question)) return false;
  if (/\bwas born in\b/i.test(question.stem) && question.salienceScore < 90) return false;
  if (
    /\bGames of the [XVI]+\b|\bwhat country hosted the \d{4} Summer Olympic Games\b|\bhosted by this Asian country\b/i.test(
      question.stem
    )
  ) {
    return false;
  }
  if (/\bparkour\b/i.test(question.stem)) return false;
  if (/\bdohy[ōo]\b/i.test(question.stem)) return false;
  if (SPORTS_MAINSTREAM_CORE_REJECT_REGEX.test(question.stem)) return false;
  if (SPORTS_NOVELTY_REJECT_REGEX.test(question.stem)) return false;
  if (difficultyPool === 'hard' && SPORTS_ARCHIVE_HARD_REJECT_REGEX.test(question.stem)) return false;
  if (SPORTS_LEGACY_REJECT_REGEX.test(question.stem)) return false;
  if (SPORTS_ARCHIVE_FRAGMENT_REGEX.test(question.stem)) return false;
  if (LOW_SIGNAL_REGEX.test(question.stem)) return false;
  if (/\breal name is\b/i.test(question.stem)) return false;
  if (/\b(?:what|which|in what) year\b/i.test(question.stem)) return false;
  if (SPORTS_EXACT_DATE_REGEX.test(question.stem) && !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)) {
    return false;
  }
  if (question.sourceTier === 'legacy' && ['off-tone', 'relationship', 'exact-date', 'misc-trivia'].includes(question.legacyFamily)) {
    return false;
  }
  if (
    question.sourceTier === 'supplemental' &&
    (question.salienceScore < 88 ||
      SPORTS_MEDIA_TIEIN_REGEX.test(question.stem) ||
      SPORTS_OFF_TONE_REGEX.test(question.stem))
  ) {
    return false;
  }
  if (question.subdomain === 'general-sports' && question.lookupRisk === 'high') return false;
  if (question.subdomain === 'general-sports' && !isAllowedGeneralSportsFallback(question)) return false;
  if (
    question.sourceTier === 'curated' &&
    !isLegacySportsRow &&
    !question.obscurityFlags.some((flag) => ['media-tie-in', 'incidental-context', 'vague-stem'].includes(flag))
  ) {
    if (
      difficultyPool === 'easy' &&
      (question.stem.length > 118 || question.salienceScore < 72)
    ) {
      return false;
    }
    if (
      difficultyPool === 'hard' &&
      (question.stem.length > 160 || question.salienceScore < 60)
    ) {
      return false;
    }
    return true;
  }
  if (isLegacySportsRow && SPORTS_ARCHIVE_STEM_REGEX.test(question.stem)) return false;
  if (isLegacySportsRow && SPORTS_LEGACY_REJECT_REGEX.test(question.stem)) return false;
  if (
    isLegacySportsRow &&
    SPORTS_EXACT_DATE_REGEX.test(question.stem) &&
    !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (
    isLegacySportsRow &&
    /\b(?:19|20)\d{2}\b/.test(question.stem) &&
    question.salienceScore < 86 &&
    !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (
    isLegacySportsRow &&
    question.subdomain === 'soccer' &&
    !SPORTS_LEGACY_SOCCER_ALLOW_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (
    isLegacySportsRow &&
    question.subdomain === 'olympics' &&
    !SPORTS_LEGACY_OLYMPICS_ALLOW_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (
    isLegacySportsRow &&
    ['golf', 'tennis', 'motorsport', 'combat'].includes(question.subdomain) &&
    question.difficultyTarget === 3 &&
    question.salienceScore < 82
  ) {
    return false;
  }
  if (isLegacySportsRow && SPORTS_LOW_SIGNAL_LEGACY_REGEX.test(question.stem)) return false;
  if (isLegacySportsRow && SPORTS_ARCHIVE_FRAGMENT_REGEX.test(question.stem)) return false;
  if (isLegacySportsRow && LOW_SIGNAL_REGEX.test(question.stem)) return false;
  if (
    isLegacySportsRow &&
    question.difficultyTarget === 3 &&
    !(
      (['rule', 'term', 'achievement'].includes(question.promptKind) && question.salienceScore >= 84) ||
      (SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem) && question.salienceScore >= 86)
    )
  ) {
    return false;
  }
  if (isLegacySportsRow && question.obscurityFlags.includes('roster-deep-cut')) return false;
  if (
    isLegacySportsRow &&
    question.obscurityFlags.includes('stat-only') &&
    !['rule', 'term', 'achievement'].includes(question.promptKind)
  ) {
    return false;
  }
  if (isLegacySportsRow && question.difficultyTarget === 1 && question.salienceScore < 82) return false;
  if (question.lookupRisk === 'high' && question.salienceScore < (difficultyPool === 'hard' ? 56 : 62)) return false;
  if (difficultyPool === 'hard' && question.promptKind === 'player' && question.salienceScore < 64) return false;
  if (difficultyPool === 'hard' && question.promptKind === 'record' && question.salienceScore < 68) return false;
  if (question.obscurityFlags.includes('roster-deep-cut') && question.salienceScore < 82) return false;
  if (
    question.tasteTags.some((tag) => ['year-trivia', 'according-to'].includes(tag)) &&
    !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (
    question.tasteTags.includes('nickname-only') &&
    !(
      (question.isTrickQuestion && question.curveballKind === 'famous-nickname' && question.salienceScore >= 90) ||
      (question.editorialSourceFamily.startsWith('sports-authored-') && question.salienceScore >= 88)
    )
  ) {
    return false;
  }
  if (question.obscurityFlags.includes('surname-inference')) return false;
  if (
    question.obscurityFlags.includes('stat-only') &&
    question.salienceScore < (difficultyPool === 'hard' ? 74 : 80) &&
    !['rule', 'term', 'achievement'].includes(question.promptKind)
  ) {
    return false;
  }
  if (question.isTrickQuestion && !isAllowedCurveballQuestion('sports', question)) return false;
  return question.salienceScore >= 48;
}

function isSportsPoolCandidateFit(question: TriviaQuestionRecord): boolean {
  if (question.options.length !== 3) return false;
  if (SPORTS_MEDIA_TIEIN_REGEX.test(question.stem)) return false;
  if (SPORTS_OFF_TONE_REGEX.test(question.stem)) return false;
  if (question.sourceTier !== 'curated' && /^Which .* star was primarily the\b/i.test(question.stem)) return false;
  if (question.sourceTier !== 'curated' && /\bfor the team from\b/i.test(question.stem)) return false;
  if (question.sourceTier !== 'curated' && /^Which of these .* players? was primarily a\b/i.test(question.stem)) return false;
  if (question.obscurityFlags.includes('media-tie-in')) return false;
  if (question.obscurityFlags.includes('incidental-context')) return false;
  return true;
}

function isSportsVariantSourceRecord(question: TriviaQuestionRecord): boolean {
  if (question.sourceTier !== 'curated') return false;
  if (question.legacyFamily !== 'none') return false;
  if (question.salienceScore < 80) return false;
  if (question.difficultyTarget === 1) {
    return ['team', 'sport-id', 'player', 'venue', 'place', 'achievement', 'event'].includes(
      question.promptKind
    );
  }
  if (question.promptKind === 'sport-id') return false;
  if (
    /^Which athlete is best known for\b/i.test(question.stem) ||
    /^Which of these teams plays in\b/i.test(question.stem) ||
    /^Which venue is home to the\b/i.test(question.stem) ||
    /\bbelongs to a\b.*\bteam from which city\?$/i.test(question.stem) ||
    /^The team that plays at\b/i.test(question.stem)
  ) {
    return false;
  }

  return ['rule', 'term', 'achievement', 'record', 'event', 'player', 'venue', 'place'].includes(
    question.promptKind
  );
}

function buildLaunchFlag(
  agentId: string,
  code: TriviaCouncilFlag['code'],
  severity: TriviaCouncilFlag['severity'],
  message: string
): TriviaCouncilFlag {
  return {
    agentId,
    code,
    severity,
    message,
    scope: 'question',
  };
}

function inferEditorialSourceFamily(
  sourceCategory: string,
  domain: string,
  subdomain: string,
  themeTags: string[] = []
): string {
  if (sourceCategory === 'curated-mix') {
    if (themeTags.includes('hard-preferred')) return 'mix-authored-hard';
    if (domain === 'arts' && ['pop-culture', 'music', 'movies', 'television'].includes(subdomain)) {
      return 'mix-authored-culture';
    }
    return 'mix-authored-evergreen';
  }
  if (sourceCategory === 'curated-mix-hard') return 'mix-authored-hard';
  if (sourceCategory.startsWith('curated-mix-')) return `mix-rewrite-${sourceCategory.replace('curated-mix-', '')}`;
  if (sourceCategory === 'curated-sports') {
    if (themeTags.includes('hard-preferred')) return 'sports-authored-mainstream-hard';
    return SPORTS_CORE_SUBDOMAINS.has(subdomain) ? 'sports-authored-core' : 'sports-authored-hardcore';
  }
  if (sourceCategory === 'curated-sports-hard') return 'sports-authored-mainstream-hard';
  if (sourceCategory === 'curated-sports-core') return 'sports-core-bank';
  if (sourceCategory === 'curated-sports-template') return 'sports-template-booster';
  if (sourceCategory.startsWith('curated-')) return sourceCategory.replace(/^curated-/, '');
  if (sourceCategory.includes('supplement')) return 'supplemental';
  return 'legacy';
}

function normalizeEditorialSourceFamily(
  feed: TriviaFeed,
  sourceCategory: string,
  editorialSourceFamily: string,
  prompt: string,
  promptKind: TriviaPromptKind,
  subdomain: string,
  salienceScore: number,
  lookupRisk: TriviaLookupRisk,
  difficultyTarget: TriviaDifficultyTarget
): string {
  if (feed !== 'sports' || sourceCategory !== 'curated-sports-core' || editorialSourceFamily !== 'sports-core-bank') {
    return editorialSourceFamily;
  }

  if (
    SPORTS_LEGACY_HISTORY_REGEX.test(prompt) ||
    SPORTS_MAINSTREAM_CORE_REJECT_REGEX.test(prompt) ||
    SPORTS_LEGACY_REJECT_REGEX.test(prompt) ||
    SPORTS_ARCHIVE_HARD_REJECT_REGEX.test(prompt) ||
    /\b(?:what|which|in what) year\b|\bfounded\b|\bwinning pitcher\b|\bwhich of the following\b|\baccording to\b/i.test(prompt)
  ) {
    return editorialSourceFamily;
  }

  if (lookupRisk === 'high') return editorialSourceFamily;
  if (!['rule', 'term', 'achievement', 'event', 'sport-id'].includes(promptKind)) {
    return editorialSourceFamily;
  }
  if (['player', 'team', 'venue', 'place', 'record'].includes(promptKind)) {
    return editorialSourceFamily;
  }

  const minimumSalience = SPORTS_CORE_SUBDOMAINS.has(subdomain) ? 72 : 74;
  if (salienceScore < minimumSalience) return editorialSourceFamily;
  if (difficultyTarget === 1 && salienceScore < 76) return editorialSourceFamily;

  if (SPORTS_CORE_SUBDOMAINS.has(subdomain)) {
    return 'sports-authored-core';
  }
  return difficultyTarget >= 2 ? 'sports-authored-mainstream-hard' : 'sports-authored-hardcore';
}

function isAllowedMixStatQuestion(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): boolean {
  if (!question.obscurityFlags.includes('stat-only')) return true;
  if (difficultyPool === 'easy') return false;
  const allowedPromptKinds =
    question.domain === 'arts'
      ? ['term', 'concept']
      : ['term', 'concept', 'person', 'place', 'event'];
  return (
    question.salienceScore >= 76 &&
    allowedPromptKinds.includes(question.promptKind) &&
    !/\b(?:what|which|in what) year\b|\bpercentage\b/i.test(question.stem) &&
    !/\b(?:fictional|character|sitcom|series|show|movie|film|novel)\b/i.test(question.stem) &&
    !HEAVY_LOOKUP_REGEX.test(question.stem)
  );
}

function isAllowedSportsStatQuestion(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): boolean {
  if (!question.obscurityFlags.includes('stat-only')) return true;
  if (
    ['record', 'player'].includes(question.promptKind) &&
    (HEAVY_LOOKUP_REGEX.test(question.stem) || /\b(?:19|20)\d{2}\b/.test(question.stem))
  ) {
    return false;
  }
  if (difficultyPool === 'easy' && question.promptKind === 'record') return false;
  return (
    ['term', 'rule', 'achievement', 'record', 'player'].includes(question.promptKind) &&
    question.salienceScore >= 78
  );
}

function getLaunchBlockReasons(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): TriviaCouncilFlag[] {
  const stagedQuestion = {
    ...question,
    difficultyPool,
  };
  const evaluationSlot =
    question.feed === 'mix'
      ? difficultyPool === 'hard'
        ? 9
        : 4
      : difficultyPool === 'hard'
        ? 7
        : 4;
  const reasons: TriviaCouncilFlag[] = evaluateTriviaCouncilQuestion(
    stagedQuestion,
    question.feed,
    evaluationSlot
  )
    .filter((flag) => flag.severity === 'fail')
    .map((flag) => ({ ...flag, scope: 'question' as const }));

  const pushIfMissing = (flag: TriviaCouncilFlag) => {
    if (
      reasons.some(
        (existing) =>
          existing.agentId === flag.agentId &&
          existing.code === flag.code &&
          existing.message === flag.message
      )
    ) {
      return;
    }
    reasons.push(flag);
  };

  if (question.obscurityFlags.includes('media-tie-in')) {
    pushIfMissing(
      buildLaunchFlag(
        'off-feed-fit',
        'off-feed-fit',
        'fail',
        'Media or entertainment tie-ins are not launch-ready trivia clues.'
      )
    );
  }
  if (question.obscurityFlags.includes('timer-friction')) {
    pushIfMissing(
      buildLaunchFlag(
        'timer-friction',
        'timer-friction',
        'fail',
        'Question is too long or clock-fragile for launch scheduling.'
      )
    );
  }
  if (
    question.obscurityFlags.includes('vague-stem') ||
    question.obscurityFlags.includes('incidental-context')
  ) {
    pushIfMissing(
      buildLaunchFlag(
        'ambiguity-detector',
        'ambiguity',
        'fail',
        'Question depends on vague or incidental setup instead of a clean clue.'
      )
    );
  }
  if (question.feed === 'mix') {
    if (
      question.tasteTags.some((tag) =>
        [
          'count-trivia',
          'year-trivia',
          'according-to',
          'line-complete',
          'pilot-episode',
          'actor-director-credit',
          'archive-media',
          'statement-elimination',
          'definition-low-payoff',
        ].includes(tag)
      )
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'reveal-value',
          'low-reveal-value',
          'fail',
          'Mix launch questions should avoid archive-y, low-payoff, or media-detail prompt shapes.'
        )
      );
    }
    if (!isMixEditorialFit(question, difficultyPool)) {
      pushIfMissing(
        buildLaunchFlag(
          'ambiguity-detector',
          'ambiguity',
          'fail',
          'Mix question misses the launch editorial fit bar.'
        )
      );
    }
    if (!isAllowedMixStatQuestion(question, difficultyPool) || HEAVY_LOOKUP_REGEX.test(question.stem)) {
      const hardMixStatSoftPass =
        difficultyPool === 'hard' &&
        question.domain !== 'arts' &&
        !/\b(?:what|which|in what) year\b|\bwhat percentage\b|\bthis decade\b|\bwhat decade\b/i.test(question.stem) &&
        !/\b(?:fictional|character|sitcom|series|show|movie|film|novel)\b/i.test(question.stem) &&
        !HEAVY_LOOKUP_REGEX.test(question.stem);
      if ((question.obscurityFlags.includes('stat-only') || HEAVY_LOOKUP_REGEX.test(question.stem)) && !hardMixStatSoftPass) {
        pushIfMissing(
          buildLaunchFlag(
            'analytical-reasoner',
            'obscurity-mismatch',
            'fail',
            'Mix launch questions cannot rely on year, percentage, or stat bait.'
          )
        );
      }
    }
    if (difficultyPool === 'easy' && (question.stem.length > 124 || question.salienceScore < 70)) {
      pushIfMissing(
        buildLaunchFlag(
          'casual-pace',
          'timer-friction',
          'fail',
          'Mix Easy launch questions must be short, direct, and high-salience.'
        )
      );
    }
    if (difficultyPool === 'hard' && question.stem.length > 196 && question.salienceScore < 34) {
      pushIfMissing(
        buildLaunchFlag(
          'broad-generalist',
          'obscurity-mismatch',
          'fail',
          'Mix Hard should be challenging through recall, not long archive wording.'
        )
      );
    }
    if (MIX_POP_DEEPCUT_REJECT_REGEX.test(question.stem) || /\b(?:what|which|in what) year\b|\bwhat percentage\b/i.test(question.stem)) {
      pushIfMissing(
        buildLaunchFlag(
          'reveal-value',
          'low-reveal-value',
          'fail',
          'Mix launch questions should avoid deep-cut or naked year/percentage prompts.'
        )
      );
    }
  } else {
    if (
      question.tasteTags.some((tag) => ['year-trivia', 'according-to'].includes(tag)) &&
      !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-core',
          'obscurity-mismatch',
          'fail',
          'Sports launch questions should not rely on archive-history or year-heavy framing.'
        )
      );
    }
    if (
      question.tasteTags.includes('nickname-only') &&
      !(
        (question.isTrickQuestion && question.curveballKind === 'famous-nickname' && question.salienceScore >= 90) ||
        (question.editorialSourceFamily.startsWith('sports-authored-') && question.salienceScore >= 88)
      )
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'curveball-fairness',
          'dirty-curveball',
          'fail',
          'Sports nickname prompts should be reserved for famous, fair curveball use.'
        )
      );
    }
    if (!isSportsEditorialFit(question, difficultyPool)) {
      pushIfMissing(
        buildLaunchFlag(
          'off-feed-fit',
          'off-feed-fit',
          'fail',
          'Sports question misses the launch editorial fit bar.'
        )
      );
    }
    if (
      question.obscurityFlags.includes('roster-deep-cut') ||
      question.obscurityFlags.includes('surname-inference')
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-core',
          'obscurity-mismatch',
          'fail',
          'Sports launch questions should not hinge on roster deep cuts or surname inference.'
        )
      );
    }
    if (!isAllowedSportsStatQuestion(question, difficultyPool)) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-casual',
          'obscurity-mismatch',
          'fail',
          'Sports launch questions should not lean on year or stat bait unless the fact is canonical.'
        )
      );
    }
    if (
      /\b(?:what|which|in what) year\b|\bwinning pitcher\b|\bfounded\b/i.test(question.stem) &&
      !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-core',
          'obscurity-mismatch',
          'fail',
          'Sports launch questions should prefer canonical recall over year, founding, or box-score trivia.'
        )
      );
    }
    if (
      difficultyPool === 'easy' &&
      (question.stem.length > 112 || question.salienceScore < 74)
    ) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-casual',
          'timer-friction',
          'fail',
          'Sports Easy launch questions must stay fast to parse and broadly legible.'
        )
      );
    }
    if (difficultyPool === 'hard' && (question.stem.length > 170 || question.salienceScore < 58)) {
      pushIfMissing(
        buildLaunchFlag(
          'sports-core',
          'obscurity-mismatch',
          'fail',
          'Sports Hard should stay difficult through canon, not bloated setup or fringe salience.'
        )
      );
    }
  }

  return reasons;
}

function applyLaunchState(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): TriviaQuestionRecord {
  const launchBlockReasons = getLaunchBlockReasons(question, difficultyPool);
  const launchEligible = launchBlockReasons.length === 0;
  const scheduleEligible = isRecordScheduleEligibleForPool(
    {
      ...question,
      difficultyPool,
      launchEligible,
      launchBlockReasons,
    },
    difficultyPool
  );
  return {
    ...question,
    difficultyPool,
    launchEligible,
    launchBlockReasons,
    scheduleEligible,
  };
}

function isRecordLaunchEligibleForPool(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): boolean {
  return getLaunchBlockReasons(question, difficultyPool).length === 0;
}

function isAllowedSourceFamilyForSchedule(
  feed: TriviaFeed,
  difficultyPool: TriviaDifficulty,
  family: string
): boolean {
  return SCHEDULE_ALLOWED_SOURCE_FAMILIES[feed][difficultyPool].includes(family);
}

function isRecordScheduleEligibleForPool(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): boolean {
  if (!question.launchEligible) return false;
  if (!isAllowedSourceFamilyForSchedule(question.feed, difficultyPool, question.editorialSourceFamily)) {
    return false;
  }
  if (question.sourceTier === 'variant' || question.sourceTier === 'supplemental') return false;
  if (question.tasteTags.some((tag) => isBlockingTasteTag(question.feed, question, tag))) return false;

  if (question.feed === 'mix') {
    if (question.tasteTags.includes('fragment-stem')) return false;
    if (question.editorialSourceFamily === 'mix-authored-culture' && question.salienceScore < 72) return false;
    if (
      difficultyPool === 'easy' &&
      (question.editorialBucket === 'experimental' || question.promptKind === 'record')
    ) {
      return false;
    }
    return true;
  }

  if (question.tasteTags.includes('fragment-stem')) return false;
  if (
    question.tasteTags.includes('team-association') &&
    /\bcompetes in which league\b|\bteam that plays at\b|\bplays in\b/i.test(question.stem)
  ) {
    return false;
  }
  if (
    question.tasteTags.includes('athlete-association') &&
    /\bbest known for competing in which sport\b|\bmost closely associated with which league\b/i.test(
      question.stem
    )
  ) {
    return false;
  }
  if (
    question.editorialSourceFamily === 'sports-authored-hardcore' &&
    difficultyPool === 'easy' &&
    question.difficultyTarget === 3 &&
    question.salienceScore < 74
  ) {
    return false;
  }
  if (
    question.editorialSourceFamily === 'sports-authored-mainstream-hard' &&
    difficultyPool === 'hard' &&
    (question.salienceScore < 62 || (question.difficultyTarget < 2 && question.salienceScore < 76))
  ) {
    return false;
  }
  return true;
}

function isRecordPoolEligibleForPool(
  question: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): boolean {
  if (question.sourceTier === 'variant' || question.sourceTier === 'supplemental') return false;

  if (question.feed === 'mix') {
    if (!isMixPoolCandidateFit(question)) return false;
    if (MIX_RELATIONSHIP_REJECT_REGEX.test(question.stem)) return false;
    if (
      question.tasteTags.some((tag) =>
        [
          'year-trivia',
          'according-to',
          'line-complete',
          'pilot-episode',
          'statement-elimination',
        ].includes(tag)
      )
    ) {
      return false;
    }
    if (question.obscurityFlags.includes('media-tie-in')) return false;
    if (question.obscurityFlags.includes('incidental-context') && question.salienceScore < 68) return false;
    if (difficultyPool === 'easy' && question.stem.length > 178) return false;
    if (difficultyPool === 'hard' && question.stem.length > 208) return false;
    return true;
  }

  if (!isSportsPoolCandidateFit(question)) return false;
  if (!Object.prototype.hasOwnProperty.call(SPORTS_SUBDOMAIN_DISTRIBUTION, question.subdomain)) return false;
  if (
    question.tasteTags.some((tag) => ['year-trivia', 'according-to'].includes(tag)) &&
    !SPORTS_ICONIC_ALLOWLIST_REGEX.test(question.stem)
  ) {
    return false;
  }
  if (question.obscurityFlags.includes('media-tie-in') || question.obscurityFlags.includes('incidental-context')) {
    return false;
  }
  if (question.obscurityFlags.includes('surname-inference')) return false;
  if (difficultyPool === 'easy' && question.stem.length > 138) return false;
  if (difficultyPool === 'hard' && question.stem.length > 182) return false;
  return true;
}

function inferTrickQuestionCandidate(
  feed: TriviaFeed,
  prompt: string,
  subdomain: string,
  editorialBucket: TriviaEditorialBucket,
  promptKind: TriviaPromptKind,
  obscurityFlags: TriviaObscurityFlag[]
): boolean {
  if (feed === 'mix') {
    return editorialBucket === 'experimental' || subdomain === 'brain-teaser' || TRICK_PATTERN.test(prompt);
  }

  if (obscurityFlags.includes('media-tie-in') || obscurityFlags.includes('vague-stem')) {
    return false;
  }
  if (
    promptKind === 'player' &&
    obscurityFlags.includes('famous-nickname') &&
    /\b(nicknamed|known as|called|goes by)\b/i.test(prompt)
  ) {
    return true;
  }
  if (
    promptKind === 'rule' &&
    /\b(neutral zone infraction|intentional grounding|infield fly)\b/i.test(prompt)
  ) {
    return true;
  }
  if (
    promptKind === 'term' &&
    /\b(parc ferme|undercut)\b/i.test(prompt)
  ) {
    return true;
  }
  if (
    subdomain === 'olympics' &&
    promptKind === 'event' &&
    obscurityFlags.includes('edge-case') &&
    /\b(decathlon|biathlon|nordic combined|medley|relay)\b/i.test(prompt)
  ) {
    return true;
  }
  return false;
}

function normalizeDifficulty(
  feed: TriviaFeed,
  sourceDifficulty: TriviaDifficultyTarget,
  prompt: string,
  options: string[],
  subdomain: string
): TriviaDifficultyTarget {
  let next = sourceDifficulty;
  const hay = `${prompt} ${options.join(' ')}`;

  if (HEAVY_LOOKUP_REGEX.test(hay)) {
    next += 1;
  }

  if (feed === 'sports') {
    if (SPORTS_TRICK_PATTERN.test(hay)) {
      next += 1;
    }
  }

  return clampDifficulty(next);
}

function looksNumeric(value: string): boolean {
  return /^-?\d+(?:\.\d+)?$/.test(value.replace(/,/g, ''));
}

function getNumericValue(value: string): number | null {
  if (!looksNumeric(value)) return null;
  return Number(value.replace(/,/g, ''));
}

function pickDistractors(correct: string, distractors: string[], variantIndex = 0): string[] {
  if (distractors.length <= 2) return distractors.slice(0, 2);

  const numericCorrect = getNumericValue(correct);
  const numericScores =
    numericCorrect === null
      ? null
      : distractors
          .map((option) => ({
            option,
            score: Math.abs((getNumericValue(option) ?? Number.MAX_SAFE_INTEGER) - numericCorrect),
          }))
          .filter((entry) => Number.isFinite(entry.score));

  if (numericScores && numericScores.length >= 2) {
    const sorted = [...numericScores].sort((left, right) => left.score - right.score);
    if (variantIndex === 0) return sorted.slice(0, 2).map((entry) => entry.option);
    if (variantIndex === 1 && sorted.length >= 3) {
      return [sorted[0].option, sorted[2].option];
    }
    return [sorted[1]?.option ?? sorted[0].option, sorted[2]?.option ?? sorted[1].option];
  }

  const correctWords = correct.split(/\s+/).length;
  const scored = distractors.map((option) => {
    const optionWords = option.split(/\s+/).length;
    const score =
      Math.abs(option.length - correct.length) +
      Math.abs(optionWords - correctWords) * 4 +
      (option.charAt(0).toLowerCase() === correct.charAt(0).toLowerCase() ? -1 : 0);
    return { option, score };
  });

  scored.sort((left, right) => left.score - right.score || left.option.localeCompare(right.option));
  const combos = [
    [scored[0], scored[1]],
    [scored[0], scored[2] ?? scored[1]],
    [scored[1] ?? scored[0], scored[2] ?? scored[1]],
  ];
  return combos[Math.min(variantIndex, combos.length - 1)].map((entry) => entry.option);
}

function buildRationaleShort(correct: string): string {
  return `${correct} is the right answer.`;
}

function buildRationaleLong(correct: string, domain: string, subdomain: string): string {
  return `${correct} matches the clue for this ${domain}/${subdomain} item. Use the cited reference trail to review the underlying fact before refreshing or localizing the question.`;
}

function buildCitations(sourceLabel: string, answer: string) {
  const searchQuery = encodeURIComponent(answer);
  return [
    {
      title: sourceLabel,
      url: 'https://github.com/uberspot/OpenTriviaQA',
      sourceType: 'dataset' as const,
      accessedAt: ACCESS_DATE,
    },
    {
      title: `Reference search: ${answer}`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${searchQuery}`,
      sourceType: 'reference-search' as const,
      accessedAt: ACCESS_DATE,
    },
  ];
}

function extractEntities(values: string[]): string[] {
  const entities = new Set<string>();
  values.forEach((value) => {
    const matches = value.match(PROPER_ENTITY_REGEX) ?? [];
    matches.forEach((match) => {
      const normalized = normalizeText(match);
      if (!normalized) return;
      if (STOP_ENTITY_WORDS.has(normalized)) return;
      entities.add(normalized);
    });
  });
  return dedupe([...entities]).slice(0, 8);
}

function inferMixDomain(categoryId: string): string {
  if (categoryId === 'world') return 'world';
  if (categoryId === 'science') return 'science';
  if (categoryId === 'arts') return 'arts';
  return 'history';
}

function inferMixSubdomain(categoryId: string, prompt: string): string {
  const hay = prompt.toLowerCase();
  if (categoryId === 'world') {
    if (/\b(country|capital|continent|border|city)\b/.test(hay)) return 'geography';
    if (/\b(language|culture|custom|festival|food)\b/.test(hay)) return 'culture';
    return 'world-facts';
  }
  if (categoryId === 'science') {
    if (/\b(planet|galaxy|star|space|moon)\b/.test(hay)) return 'space';
    if (/\b(animal|bird|mammal|fish|insect|nature)\b/.test(hay)) return 'nature';
    if (/\b(technology|computer|internet|device|inventor)\b/.test(hay)) return 'technology';
    if (/\b(riddle|brain|puzzle)\b/.test(hay)) return 'brain-teaser';
    return 'science-facts';
  }
  if (categoryId === 'arts') {
    if (/\b(movie|film|actor|director|screen)\b/.test(hay)) return 'movies';
    if (/\b(song|album|band|singer|music)\b/.test(hay)) return 'music';
    if (/\b(tv|television|series|sitcom|show)\b/.test(hay)) return 'television';
    if (/\b(book|novel|author|poem|literature)\b/.test(hay)) return 'literature';
    return 'pop-culture';
  }
  if (/\b(president|king|queen|emperor|dynasty)\b/.test(hay)) return 'people';
  if (/\b(religion|faith|church|bible|myth)\b/.test(hay)) return 'belief';
  return 'history-facts';
}

function inferSportsSubdomain(prompt: string, options: string[]): string {
  const hay = `${prompt} ${options.join(' ')}`.toLowerCase();
  if (/\b(cricket|icc world cup|table tennis|volleyball|libero|wrist-wrestling|arm wrestling)\b/.test(hay)) {
    return 'general-sports';
  }
  if (/\b(boxing|ufc|mma|wrestling|sumo|karate|kung fu|judo|taekwondo|martial art)\b/.test(hay)) {
    return 'combat';
  }
  if (
    /\b(baseball|mlb|major league|major leaguer|home run|homeruns?|inning|pitcher|catcher|outfielder|infielder|shortstop|yankees|red sox|dodgers|mets|phillies|ted williams|pete rose|johnny bench|cy young)\b/.test(
      hay
    )
  )
    return 'baseball';
  if (
    /\b(basketball|nba|slam dunk|point guard|march madness|celtics|lakers|knicks|bulls|warriors|michael jordan|larry bird)\b/.test(
      hay
    )
  )
    return 'basketball';
  if (
    /\b(football|nfl|touchdown|quarterback|super bowl|field goal|wide receiver|heisman|rose bowl|troy aikman|walter payton|travis kelce|aaron rodgers|brett favre|dan marino)\b/.test(
      hay
    )
  )
    return 'football';
  if (
    /\b(hockey|nhl|stanley cup|goalie|goaltender|ice rink|icing|power play|conn smythe|puck|tom renney|patrick roy|gordie howe|dominik hasek|jaromir jagr|steve yzerman)\b/.test(
      hay
    )
  )
    return 'hockey';
  if (
    /\b(olympic|olympics|gymnastics|ski jump|snowboarding|snowboard|speed skating|figure skating|medal|torch relay|biathlon|decathlon|nordic combined|relay|medley|swimming|track and field|michael phelps|simone biles|usain bolt|katie ledecky|allyson felix|shaun white|gabby douglas|michael johnson|carl lewis)\b/.test(
      hay
    )
  )
    return 'olympics';
  if (
    /\b(soccer|fifa|premier league|champions league|goalkeeper|own goal|penalty area|penalty kick|red card|yellow card|ballon d'or|manchester united|arsenal|chelsea|barcelona|real madrid|liverpool|messi|ronaldo|pele|beckham|mia hamm|megan rapinoe)\b/.test(
      hay
    )
  )
    return 'soccer';
  if (
    /\b(tennis|wimbledon|us open|australian open|french open|roland garros|atp|wta|deuce|break point|service box|tie-break|tiebreak|davis cup|venus williams|serena williams|coco gauff|federer|djokovic|nadal|sampras|agassi|navratilova|gauff)\b/.test(
      hay
    )
  )
    return 'tennis';
  if (
    /\b(golf|golfer|golfers|masters|pga|birdie|bogey|green jacket|tiger woods|greg norman|geoff ogilvy|adam scott|rory mcilroy|scottie scheffler|ryder cup|under par|over par|hole in one|putter|fairway|tee box)\b/.test(
      hay
    )
  )
    return 'golf';
  if (
    /\b(nascar|formula 1|f1|racing|grand prix|indy 500|daytona 500|kevin harvick|travis pastrana|pocono|ryan newman|denny hamlin|kart|go kart|pit lane|pit stop|pole position|drafting|checkered flag|caution flag)\b/.test(
      hay
    )
  )
    return 'motorsport';
  return 'general-sports';
}

function inferMixBucket(categoryId: string, prompt: string, subdomain: string): TriviaEditorialBucket {
  const hay = prompt.toLowerCase();
  if (
    subdomain === 'brain-teaser' ||
    /\b(complete this|what do the following|definition of|which word|saying|idiom|quote|riddle|word incorrectly used)\b/.test(
      hay
    )
  ) {
    return 'experimental';
  }
  if (categoryId === 'arts') return 'topical';
  if (/\b(internet|celebrity|television|movie|music)\b/.test(hay)) return 'topical';
  return 'evergreen';
}

function inferSportsBucket(prompt: string, subdomain: string): TriviaEditorialBucket {
  const hay = prompt.toLowerCase();
  if (
    /\b(playoff|final|championship|olympic|draft|opening day|world cup|super bowl|world series|stanley cup|masters|wimbledon)\b/.test(
      hay
    )
  ) {
    return 'event';
  }
  if (
    /\b(season|coach|captain|rookie|franchise|league|cup|title|record|tournament|team|player|manager|club|goalkeeper|pitcher|quarterback|golfer)\b/.test(
      hay
    ) &&
    subdomain !== 'olympics'
  ) {
    return 'current';
  }
  return 'evergreen';
}

function inferLookupRisk(feed: TriviaFeed, prompt: string, options: string[]): TriviaLookupRisk {
  const hay = `${prompt} ${options.join(' ')}`.toLowerCase();
  const numericCount = (hay.match(/\b\d{4}\b/g) ?? []).length;
  if (
    numericCount >= 2 ||
    (feed === 'sports'
      ? /\b(stat|record|score|year|season|title|wins|touchdowns|home runs|playoff|championship)\b/.test(hay)
      : /\b(stat|record|score|year|average|percentage|population|elevation)\b/.test(hay))
  ) {
    return 'high';
  }
  if (/\b(which city|which country|who|what was the name)\b/.test(hay)) return 'medium';
  return 'low';
}

function inferFreshUntil(bucket: TriviaEditorialBucket): string {
  if (bucket === 'current') return '2027-12-31';
  if (bucket === 'event' || bucket === 'topical') return '2027-09-30';
  return '2035-12-31';
}

function scoreQuestion(prompt: string, options: string[], bucket: TriviaEditorialBucket): number {
  let score = 100;
  const normalizedPrompt = prompt.toLowerCase();
  if (hasStaleRelativePhrasing(prompt)) score -= 12;
  if (hasGimmickDistractorPattern(prompt)) score -= 25;
  if (DARK_CONTENT_REGEX.test(normalizedPrompt)) score -= 30;
  if (isLowSignalQuestion(prompt, options)) score -= 35;
  if (prompt.length < 45) score -= 5;
  if (prompt.length > 170) score -= 10;
  if (options.some((option) => option.length > 40)) score -= 8;
  if (options.some((option) => hasGimmickDistractorPattern(option))) score -= 25;
  if (bucket === 'experimental') score += 4;
  return score;
}

function isEligibleQuestion(prompt: string, options: string[]): boolean {
  const sanitizedPrompt = rewritePrompt(prompt);
  if (DARK_CONTENT_REGEX.test(sanitizedPrompt.toLowerCase())) return false;
  if (hasStaleRelativePhrasing(sanitizedPrompt)) return false;
  if (hasGimmickDistractorPattern(sanitizedPrompt)) return false;
  if (isLowSignalQuestion(sanitizedPrompt, options)) return false;
  if (options.some((option) => hasGimmickDistractorPattern(option))) return false;
  return true;
}

function extractQuotedTitle(prompt: string): string | null {
  const quotedMatch = prompt.match(/["“”']([^"“”']{2,120})["“”']/);
  if (quotedMatch) return normalizeText(quotedMatch[1]);

  const punctuationMatch = prompt.match(/(?:novel|book|poem|play|film|movie|song|album)\s+([^?.!]+?)(?:\?|$)/i);
  if (punctuationMatch) return normalizeText(punctuationMatch[1].replace(/\s+by\s+.+$/i, ''));
  return null;
}

function rewriteMixLeadPrompt(
  categoryId: string,
  prompt: string,
  answerText: string,
  options: string[]
): string {
  const normalizedAnswer = normalizeText(answerText);

  const wordRefersMatch = prompt.match(/^Which word refers to (.+?)\??$/i);
  if (wordRefersMatch) {
    return `What is the term for ${normalizeText(wordRefersMatch[1])}?`;
  }

  const wordMeansMatch = prompt.match(/^Which word means (.+?)\??$/i);
  if (wordMeansMatch) {
    return `What word means ${normalizeText(wordMeansMatch[1])}?`;
  }

  const definitionMatch = prompt.match(
    /^What is the definition of(?: the (?:biological|medical|mathematical) term)? ([^?]+)\??$/i
  );
  if (definitionMatch) {
    const term = normalizeText(definitionMatch[1].replace(/\(.+?\)/g, '').trim());
    return `What does ${term} mean?`;
  }

  const statisticsDefinitionMatch = prompt.match(
    /^Which of the following definitions is the definition of the (mean|median|mode)\??$/i
  );
  if (statisticsDefinitionMatch) {
    return `In statistics, what is the ${statisticsDefinitionMatch[1].toLowerCase()}?`;
  }

  const capitalCountryMatch = prompt.match(
    /^What is the (?:name of the )?capital(?: city)?(?: and largest city)? of (.+?)\??$/i
  );
  if (capitalCountryMatch) {
    return `What is the capital of ${normalizeText(capitalCountryMatch[1])}?`;
  }

  const capitalStateMatch = prompt.match(
    /^What is the capital(?: city)? of the U\.S\. state of (.+?)\??$/i
  );
  if (capitalStateMatch) {
    return `What is the capital of ${normalizeText(capitalStateMatch[1])}?`;
  }

  const reverseCapitalMatch = prompt.match(
    /^(.+?) is the capital(?: city)?(?: and largest city)? of (?:what|which) (?:country|state|province|territory|nation|republic)\??$/i
  );
  if (reverseCapitalMatch) {
    return `Which place has ${normalizeText(reverseCapitalMatch[1])} as its capital?`;
  }

  const clueCapitalMatch = prompt.match(/\bcapital(?: city)? is ([A-Z][A-Za-z .'-]+)\b/i);
  if (clueCapitalMatch && /^(what|which|who|where)\b/i.test(prompt) === false) {
    return `Which place has ${normalizeText(clueCapitalMatch[1])} as its capital?`;
  }

  const languagePlaceMatch = prompt.match(
    /^What is the official language(?: spoken by [^?]+)?(?: in| of| for) (.+?)\??$/i
  );
  if (languagePlaceMatch) {
    return `Which language is official in ${normalizeText(languagePlaceMatch[1])}?`;
  }

  if (/\bofficial language\b/i.test(prompt) && /^(what|which|who)\b/i.test(prompt) === false) {
    return `Which place lists ${normalizedAnswer} as an official language?`;
  }

  const currencyPlaceMatch = prompt.match(
    /^What (?:currency|currency unit|official currency) (?:is used in|does) (.+?)(?: use)?\??$/i
  );
  if (currencyPlaceMatch) {
    return `Which currency is used in ${normalizeText(currencyPlaceMatch[1])}?`;
  }

  const priorCurrencyPlaceMatch = prompt.match(
    /^What was the currency unit in (.+?) (?:prior to|until) \d{4}\??$/i
  );
  if (priorCurrencyPlaceMatch) {
    return `Which currency did ${normalizeText(priorCurrencyPlaceMatch[1])} use before adopting the euro?`;
  }

  if (/\bcurrency\b/i.test(prompt) && /^(what|which|who)\b/i.test(prompt) === false) {
    return `Which place uses ${normalizedAnswer} as its currency?`;
  }

  const continentMatch = prompt.match(/^On what continent is (.+?) located\??$/i);
  if (continentMatch) {
    return `Which continent is ${normalizeText(continentMatch[1])} on?`;
  }

  const riverPlaceMatch = prompt.match(/^On what river is (.+?) situated\??$/i);
  if (riverPlaceMatch) {
    return `Which river runs through ${normalizeText(riverPlaceMatch[1])}?`;
  }

  const authorPromptMatch = prompt.match(
    /^(?:Who is|Who was|What [A-Za-z-]+ author wrote|Which [A-Za-z-]+ author wrote|What author wrote|Which author wrote)\s+(.+?)\??$/i
  );
  if (authorPromptMatch) {
    const title = extractQuotedTitle(authorPromptMatch[1]) ?? normalizeText(authorPromptMatch[1]);
    return `Who wrote ${title}?`;
  }

  if (/\bwho wrote\b/i.test(prompt)) {
    const title = extractQuotedTitle(prompt);
    if (title) return `Who wrote ${title}?`;
  }

  const authorByWorkMatch = prompt.match(/^This [^?.!]+ author [^?.!]* wrote (.+?)\??$/i);
  if (authorByWorkMatch) {
    const title = extractQuotedTitle(authorByWorkMatch[1]) ?? normalizeText(authorByWorkMatch[1]);
    return `Who wrote ${title}?`;
  }

  const conceptMatch = prompt.match(/^What does (?:the )?(.+?) (?:describe|mean|stand for)\??$/i);
  if (conceptMatch) {
    return `What does ${normalizeText(conceptMatch[1])} ${/\bstand for\b/i.test(prompt) ? 'stand for' : /\bmean\b/i.test(prompt) ? 'mean' : 'describe'}?`;
  }

  if (categoryId === 'arts' && /\bmovie\b/i.test(prompt)) {
    return prompt.replace(/\bwhat kind of movie\b/i, 'which kind of movie');
  }

  return prompt;
}

function buildMixCuratedLead(categoryId: string, question: SourceTriviaQuestion): SourceTriviaQuestion {
  const prompt = rewritePrompt(question.prompt);
  const answerText = question.options[question.answerIndex] ?? '';
  const rewrittenPrompt = rewriteMixLeadPrompt(categoryId, prompt, answerText, question.options);
  const domain = inferMixDomain(categoryId);
  const subdomain = question.subdomain ?? inferMixSubdomain(categoryId, rewrittenPrompt);
  return {
    ...question,
    prompt: rewrittenPrompt,
    domain,
    subdomain,
    editorialBucket: question.editorialBucket ?? inferMixBucket(categoryId, rewrittenPrompt, subdomain),
    themeTags: question.themeTags ?? [domain, subdomain, 'rewritten'],
  };
}

const MIX_PROMOTION_BLOCKING_TAGS: TriviaTasteTag[] = [
  'count-trivia',
  'year-trivia',
  'according-to',
  'line-complete',
  'pilot-episode',
  'actor-director-credit',
  'archive-media',
  'definition-low-payoff',
  'statement-elimination',
  'fragment-stem',
  'long-setup',
];

const SPORTS_PROMOTION_BLOCKING_TAGS: TriviaTasteTag[] = [
  'count-trivia',
  'year-trivia',
  'according-to',
  'fragment-stem',
  'legacy-sports-history',
  'long-setup',
];

function buildPromotedThemeTags(
  question: SourceTriviaQuestion,
  preferenceTag?: 'easy-preferred' | 'hard-preferred'
): string[] {
  return dedupe([
    ...(question.themeTags ?? []),
    'promoted-authored',
    ...(preferenceTag ? [preferenceTag] : []),
  ]);
}

function promoteMixLeadToSourceCategory(
  categoryId: string,
  question: SourceTriviaQuestion
): { sourceCategory: string; question: SourceTriviaQuestion } {
  const candidate = buildQuestionRecord('mix', 'curated-mix', question);
  const blockedByTaste = candidate.tasteTags.some((tag) => MIX_PROMOTION_BLOCKING_TAGS.includes(tag));
  const blockedByFlags = candidate.obscurityFlags.some((flag) =>
    ['media-tie-in', 'incidental-context', 'vague-stem', 'timer-friction'].includes(flag)
  );

  if (
    !isEligibleQuestion(candidate.stem, candidate.options) ||
    blockedByTaste ||
    blockedByFlags ||
    candidate.salienceScore < 60 ||
    candidate.stem.length > 166
  ) {
    return {
      sourceCategory: `curated-mix-${categoryId}`,
      question,
    };
  }

  const hardPreferred =
    candidate.difficultyTarget === 3 ||
    question.editorialBucket === 'experimental' ||
    (candidate.lookupRisk !== 'low' && candidate.salienceScore <= 78) ||
    (candidate.domain !== 'arts' && candidate.salienceScore <= 74);
  const easyPreferred =
    candidate.difficultyTarget === 1 ||
    (candidate.domain === 'arts' &&
      ['pop-culture', 'music', 'movies', 'television'].includes(candidate.subdomain) &&
      candidate.salienceScore >= 82);
  return {
    sourceCategory: 'curated-mix',
    question: {
      ...question,
      themeTags: buildPromotedThemeTags(
        question,
        hardPreferred ? 'hard-preferred' : easyPreferred ? 'easy-preferred' : undefined
      ),
    },
  };
}

function promoteSportsLeadToSourceCategory(
  question: SourceTriviaQuestion
): { sourceCategory: string; question: SourceTriviaQuestion } {
  const candidate = buildQuestionRecord('sports', 'curated-sports', question);
  const blockedByTaste = candidate.tasteTags.some((tag) => SPORTS_PROMOTION_BLOCKING_TAGS.includes(tag));
  const blockedByFlags = candidate.obscurityFlags.some((flag) =>
    ['media-tie-in', 'incidental-context', 'surname-inference', 'roster-deep-cut'].includes(flag)
  );
  const blockedBySoftShape =
    /\bbest known for competing in which sport\b|\bcompetes in which league\b/i.test(candidate.stem) ||
    (candidate.promptKind === 'sport-id' && candidate.salienceScore >= 78);

  if (
    !isEligibleQuestion(candidate.stem, candidate.options) ||
    blockedByTaste ||
    blockedByFlags ||
    blockedBySoftShape ||
    candidate.salienceScore < 72 ||
    candidate.stem.length > 132
  ) {
    return {
      sourceCategory: 'curated-sports-core',
      question,
    };
  }

  const hardPreferred =
    candidate.difficultyTarget === 3 ||
    candidate.lookupRisk === 'high' ||
    ['rule', 'term', 'record', 'event', 'achievement'].includes(candidate.promptKind) ||
    candidate.salienceScore <= 80;
  const easyPreferred =
    candidate.difficultyTarget === 1 &&
    candidate.lookupRisk === 'low' &&
    candidate.salienceScore >= 84;
  return {
    sourceCategory: 'curated-sports',
    question: {
      ...question,
      themeTags: buildPromotedThemeTags(
        question,
        hardPreferred ? 'hard-preferred' : easyPreferred ? 'easy-preferred' : undefined
      ),
    },
  };
}

function buildCoreFactId(
  feed: TriviaFeed,
  sourceCategory: string,
  prompt: string,
  answerText: string
): string {
  return `${feed}-${sourceCategory}-${slugify(`${prompt}-${answerText}`)}`;
}

function buildQuestionRecord(
  feed: TriviaFeed,
  sourceCategory: string,
  question: SourceTriviaQuestion,
  variantIndex = 0
): TriviaQuestionRecord {
  const sanitizedPrompt = rewritePrompt(question.prompt);
  const correct = question.options[question.answerIndex] ?? '';
  const distractors = question.options.filter((_, index) => index !== question.answerIndex);
  const selectedDistractors = pickDistractors(correct, distractors, variantIndex);
  const domain =
    question.domain ?? (feed === 'mix' ? inferMixDomain(sourceCategory) : 'sports');
  const subdomain =
    question.subdomain ??
    (feed === 'mix'
      ? inferMixSubdomain(sourceCategory, sanitizedPrompt)
      : inferSportsSubdomain(sanitizedPrompt, question.options));
  const editorialBucket =
    question.editorialBucket ??
    (feed === 'mix'
      ? inferMixBucket(sourceCategory, sanitizedPrompt, subdomain)
      : inferSportsBucket(sanitizedPrompt, subdomain));
  const difficultyTarget = normalizeDifficulty(
    feed,
    question.difficulty,
    sanitizedPrompt,
    question.options,
    subdomain
  );
  const lookupRisk = question.lookupRisk ?? inferLookupRisk(feed, sanitizedPrompt, question.options);
  const prompt = sanitizedPrompt;
  const answerText = normalizeText(correct);
  const options = [answerText, ...selectedDistractors.map((option) => normalizeText(option))];
  const coreFactId = buildCoreFactId(feed, sourceCategory, sanitizedPrompt, answerText);
  const idBase = coreFactId;
  const id = variantIndex === 0 ? idBase : `${idBase}-variant-${variantIndex + 1}`;
  const variantGroup = idBase;
  const promptKind =
    question.promptKind ?? inferPromptKind(feed, prompt, answerText, subdomain, domain);
  const obscurityFlags = dedupe([
    ...(question.obscurityFlags ?? []),
    ...deriveObscurityFlags(feed, prompt, subdomain, lookupRisk, promptKind),
  ]);
  const salienceScore = computeSalienceScore(
    feed,
    prompt,
    promptKind,
    lookupRisk,
    subdomain,
    obscurityFlags,
    question.salienceScore
  );
  const sourceTier = inferSourceTier(sourceCategory, variantIndex);
  const sourceLabel = inferSourceLabel(sourceCategory, variantIndex);
  const isTrickQuestion =
    question.isTrickQuestion ??
    inferTrickQuestionCandidate(feed, sanitizedPrompt, subdomain, editorialBucket, promptKind, obscurityFlags);
  const curveballKind =
    question.curveballKind ?? inferCurveballKind(feed, promptKind, obscurityFlags, isTrickQuestion);
  const curveballOnly = question.curveballOnly ?? (feed === 'sports' && isTrickQuestion);
  const editorialSourceFamily = normalizeEditorialSourceFamily(
    feed,
    sourceCategory,
    inferEditorialSourceFamily(
      sourceCategory,
      domain,
      subdomain,
      question.themeTags
    ),
    prompt,
    promptKind,
    subdomain,
    salienceScore,
    lookupRisk,
    difficultyTarget
  );
  const tasteTags = deriveTasteTags({
    feed,
    prompt,
    promptKind,
    subdomain,
    editorialSourceFamily,
    lookupRisk,
    salienceScore,
    isTrickQuestion,
    curveballKind,
  });
  const legacyFamily =
    question.legacyFamily ?? inferLegacyFamily(feed, prompt, promptKind, subdomain, sourceTier);
  const entities = extractEntities([prompt, answerText, ...options]);
  const citations =
    question.citations ??
    buildCitations(
      sourceCategory === 'sports'
        ? 'OpenTriviaQA sports legacy bank'
        : sourceCategory.startsWith('curated-')
          ? `Daybreak ${sourceCategory.replace('curated-', '')} curated bank`
          : `OpenTriviaQA ${sourceCategory} legacy bank`,
      answerText
    );
  const curatedMixHardPreferred =
    feed === 'mix' &&
    sourceCategory === 'curated-mix' &&
    question.difficulty === 3 &&
    (question.salienceScore ?? 0) <= 74;
  const curatedMixEasyPreferred =
    feed === 'mix' &&
    sourceCategory === 'curated-mix' &&
    !curatedMixHardPreferred &&
    (question.difficulty === 1 || question.difficulty === 2 || (question.salienceScore ?? 0) >= 78);
  const defaultThemeTags =
    curatedMixHardPreferred
      ? [editorialBucket, subdomain, 'hard-preferred']
      : curatedMixEasyPreferred
        ? [editorialBucket, subdomain, 'easy-preferred']
      : isTrickQuestion
        ? [editorialBucket, subdomain, 'trick']
        : [editorialBucket, subdomain];

  return {
    id,
    feed,
    coreFactId,
    difficultyPool: 'hard',
    reserveOnly: false,
    launchEligible: true,
    launchBlockReasons: [],
    scheduleEligible: true,
    editorialSourceFamily,
    tasteTags,
    stem: prompt,
    options,
    answerIndex: 0,
    rationaleShort: question.rationaleShort ?? buildRationaleShort(answerText),
    rationaleLong: question.rationaleLong ?? buildRationaleLong(answerText, domain, subdomain),
    citations,
    domain,
    subdomain,
    entities,
    difficultyTarget,
    lookupRisk,
    freshUntil: inferFreshUntil(editorialBucket),
    status: 'reviewed',
    schemaVersion: 1,
    promptKind,
    salienceScore,
    obscurityFlags,
    sourceTier,
    sourceLabel,
    anchorSubdomain: question.anchorSubdomain ?? subdomain,
    curveballKind,
    legacyFamily,
    isTrickQuestion,
    curveballOnly,
    variantGroup,
    editorialBucket,
    themeTags:
      question.themeTags ?? defaultThemeTags,
  };
}

function dedupeQuestionRecords(records: TriviaQuestionRecord[]): TriviaQuestionRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    if (seen.has(record.coreFactId)) return false;
    seen.add(record.coreFactId);
    return true;
  });
}

function getMixRawCandidates(): TriviaQuestionRecord[] {
  const categories = Array.from(legacyMixCategories as any[]);
  const rows: { sourceCategory: string; question: SourceTriviaQuestion }[] = [];

  categories.forEach((category) => {
    category.questions.forEach((question: SourceTriviaQuestion) => {
      const promoted = promoteMixLeadToSourceCategory(category.id, buildMixCuratedLead(category.id, question));
      rows.push({
        sourceCategory: promoted.sourceCategory,
        question: promoted.question,
      });
    });
  });

  const curatedRows = CURATED_MIX_PATCHES.map((question) => ({
    sourceCategory: 'curated-mix',
    question,
  }));

  const scored = [...rows, ...curatedRows]
    .map(({ sourceCategory, question }) => buildQuestionRecord('mix', sourceCategory, question))
    .filter((record) => isMixPoolCandidateFit(record))
    .filter((record) => validateQuestionRecord(record).length === 0)
    .map((record) => ({
      record,
      score: scoreQuestion(record.stem, record.options, record.editorialBucket ?? 'evergreen') + record.salienceScore,
    }))
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));

  return dedupeQuestionRecords(scored.map((entry) => entry.record));
}

function getSportsRawCandidates(): TriviaQuestionRecord[] {
  const baseSports = SPORTS_DAILY_PACKS.flat();
  const curatedBoosters = CURATED_SPORTS_BOOSTERS;

  const acceptedBase = baseSports
    .map((question) => {
      const promoted = promoteSportsLeadToSourceCategory(question);
      return {
        question: promoted.question,
        record: buildQuestionRecord('sports', promoted.sourceCategory, promoted.question),
      };
    })
    .filter(({ record }) => isSportsPoolCandidateFit(record));
  const acceptedCurated = curatedBoosters
    .map((question) => ({ question, record: buildQuestionRecord('sports', 'curated-sports', question) }))
    .filter(({ record }) => isSportsPoolCandidateFit(record));
  return dedupeQuestionRecords(
    [...acceptedBase.map(({ record }) => record), ...acceptedCurated.map(({ record }) => record)]
      .filter((record) => validateQuestionRecord(record).length === 0)
      .map((record) => ({
        record,
        score:
          scoreQuestion(record.stem, record.options, record.editorialBucket ?? 'evergreen') +
          record.salienceScore -
          (record.curveballOnly ? -36 : record.isTrickQuestion ? -10 : 0) -
          (record.legacyFamily !== 'none' ? 28 : 0),
      }))
      .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id))
      .map((entry) => entry.record)
  );
}

function buildPoolTargetsFromAvailability(
  records: TriviaQuestionRecord[],
  groupKey: 'domain' | 'subdomain',
  distribution: Record<string, number>,
  poolTarget: number,
  eligibilityFn: (record: TriviaQuestionRecord, difficultyPool: TriviaDifficulty) => boolean
): Record<TriviaDifficulty, Record<string, number>> {
  const totalTarget = poolTarget * 2;
  const keys = Object.keys(distribution).filter((key) => distribution[key] > 0);
  const availability = Object.fromEntries(
    keys.map((key) => [
      key,
      records.filter(
        (record) =>
          record[groupKey] === key &&
          (eligibilityFn(record, 'easy') || eligibilityFn(record, 'hard'))
      ).length,
    ])
  ) as Record<string, number>;
  const combinedTargets: Record<string, number> = {};
  const fractional = keys.map((key) => {
    const exact = distribution[key] * totalTarget;
    const cappedBase = Math.min(Math.floor(exact), availability[key] ?? 0);
    combinedTargets[key] = cappedBase;
    return {
      key,
      remainder: exact - Math.floor(exact),
    };
  });

  let assigned = Object.values(combinedTargets).reduce((sum, value) => sum + value, 0);
  while (assigned < totalTarget) {
    const nextKey = [...fractional]
      .sort((left, right) => {
        const leftCapacity = (availability[left.key] ?? 0) - (combinedTargets[left.key] ?? 0);
        const rightCapacity = (availability[right.key] ?? 0) - (combinedTargets[right.key] ?? 0);
        if (rightCapacity !== leftCapacity) return rightCapacity - leftCapacity;
        if (right.remainder !== left.remainder) return right.remainder - left.remainder;
        return left.key.localeCompare(right.key);
      })
      .find((entry) => (availability[entry.key] ?? 0) > (combinedTargets[entry.key] ?? 0));
    if (!nextKey) {
      throw new Error(
        `Insufficient ${groupKey} supply to build ${poolTarget} easy and ${poolTarget} hard questions. ` +
          `availableTotal=${records.length} availability=${JSON.stringify(availability)} currentTargets=${JSON.stringify(combinedTargets)}`
      );
    }
    combinedTargets[nextKey.key] += 1;
    assigned += 1;
  }

  const easyTargets: Record<string, number> = {};
  const hardTargets: Record<string, number> = {};
  const oddGroups: string[] = [];
  keys.forEach((key) => {
    easyTargets[key] = Math.floor(combinedTargets[key] / 2);
    hardTargets[key] = Math.floor(combinedTargets[key] / 2);
    if (combinedTargets[key] % 2 === 1) oddGroups.push(key);
  });

  let easyAssigned = Object.values(easyTargets).reduce((sum, value) => sum + value, 0);
  const easyRemaindersNeeded = poolTarget - easyAssigned;
  oddGroups
    .sort((left, right) => distribution[right] - distribution[left] || left.localeCompare(right))
    .forEach((key, index) => {
      if (index < easyRemaindersNeeded) {
        easyTargets[key] += 1;
      } else {
        hardTargets[key] += 1;
      }
    });

  return {
    easy: easyTargets,
    hard: hardTargets,
  };
}

function getLookupRiskRank(risk: TriviaLookupRisk): number {
  if (risk === 'low') return 0;
  if (risk === 'medium') return 1;
  return 2;
}

function getSourceFamilyPreferenceScore(
  record: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): number {
  if (record.feed === 'mix') {
    if (record.editorialSourceFamily === 'mix-authored-evergreen') return difficultyPool === 'easy' ? 220 : 170;
    if (record.editorialSourceFamily === 'mix-authored-culture') return difficultyPool === 'easy' ? 180 : 150;
    if (record.editorialSourceFamily === 'mix-authored-hard') return difficultyPool === 'hard' ? 230 : 80;
    if (record.editorialSourceFamily.startsWith('mix-rewrite-')) {
      let penalty = difficultyPool === 'easy' ? -90 : -60;
      if (record.editorialSourceFamily === 'mix-rewrite-arts') penalty += 10;
      if (record.editorialSourceFamily === 'mix-rewrite-world') penalty -= 10;
      if (record.editorialSourceFamily === 'mix-rewrite-history') penalty -= 8;
      if (record.editorialSourceFamily === 'mix-rewrite-science') penalty -= 4;
      return penalty;
    }
  } else {
    if (record.editorialSourceFamily === 'sports-authored-core') return difficultyPool === 'easy' ? 180 : 210;
    if (record.editorialSourceFamily === 'sports-authored-hardcore') return difficultyPool === 'easy' ? 100 : 165;
    if (record.editorialSourceFamily === 'sports-authored-mainstream-hard') {
      return difficultyPool === 'hard' ? 240 : 70;
    }
    if (record.editorialSourceFamily === 'sports-core-bank') return difficultyPool === 'easy' ? -120 : -75;
  }

  return 0;
}

function getPoolPreferenceScore(record: TriviaQuestionRecord, difficultyPool: TriviaDifficulty): number {
  const lookupRank = getLookupRiskRank(record.lookupRisk);
  const launchBonus = isRecordLaunchEligibleForPool(record, difficultyPool) ? 1000 : -600;
  const easyPreferredBias = record.themeTags?.includes('easy-preferred') ? 220 : 0;
  const hardPreferredBias = record.themeTags?.includes('hard-preferred')
    ? difficultyPool === 'hard'
      ? 260
      : -180
    : 0;
  const obscurityPenalty =
    record.obscurityFlags.length * 6 +
    (record.obscurityFlags.includes('timer-friction') ? 10 : 0) +
    (record.obscurityFlags.includes('vague-stem') ? 14 : 0);
  const tastePenalty =
    record.tasteTags.length * 10 +
    (record.tasteTags.includes('count-trivia') ? 20 : 0) +
    (record.tasteTags.includes('year-trivia') ? 24 : 0) +
    (record.tasteTags.includes('archive-media') ? 26 : 0) +
    (record.tasteTags.includes('definition-low-payoff') ? 16 : 0) +
    (record.tasteTags.includes('legacy-sports-history') ? 22 : 0) +
    (record.tasteTags.includes('team-association') ? 6 : 0) +
    (record.tasteTags.includes('athlete-association') ? 6 : 0);
  const sourceFamilyBias = getSourceFamilyPreferenceScore(record, difficultyPool);

  if (difficultyPool === 'easy') {
    const easyDifficultyBias =
      record.feed === 'sports' ? (4 - record.difficultyTarget) * 11 : (4 - record.difficultyTarget) * 20;
    const sportsEasyHardBias =
      record.feed === 'sports'
        ? record.difficultyTarget === 3
          ? 18
          : record.difficultyTarget === 2
            ? 6
            : 0
        : 0;
    const easyTrickPenalty = record.isTrickQuestion
      ? record.feed === 'mix'
        ? -10
        : 6
      : 0;
    return (
      launchBonus +
      record.salienceScore * 2 +
      easyDifficultyBias +
      sportsEasyHardBias -
      lookupRank * 18 -
      obscurityPenalty -
      tastePenalty +
      easyTrickPenalty +
      easyPreferredBias +
      hardPreferredBias +
      sourceFamilyBias
    );
  }

  const targetSalience = record.feed === 'sports' ? 67 : 69;
  const hardDifficultyBias =
    record.feed === 'mix'
      ? record.difficultyTarget === 2
        ? 86
        : record.difficultyTarget === 3
          ? 70
          : 32
      : record.feed === 'sports'
        ? record.difficultyTarget === 3
          ? 110
          : record.difficultyTarget === 2
            ? 62
            : -18
        : record.difficultyTarget * 28;
    return (
      launchBonus +
      hardDifficultyBias +
      lookupRank * 22 +
      (100 - Math.abs(record.salienceScore - targetSalience)) -
      obscurityPenalty * 0.45 * -1 +
      tastePenalty * 0.9 * -1 +
      (record.isTrickQuestion ? -18 : 0) -
      easyPreferredBias +
      hardPreferredBias +
      sourceFamilyBias
    );
  }

function cloneIntoDifficultyPool(
  record: TriviaQuestionRecord,
  difficultyPool: TriviaDifficulty
): TriviaQuestionRecord {
  return applyLaunchState({
    ...record,
    id: `${record.coreFactId}-${difficultyPool}`,
    reserveOnly: false,
    variantGroup: record.coreFactId,
  }, difficultyPool);
}

function rebalanceSportsCurveballPools(
  rawCandidates: TriviaQuestionRecord[],
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>,
  minimumCurveballsPerPool: number
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const rawByCoreFact = new Map(rawCandidates.map((question) => [question.coreFactId, question]));
  const selectedCoreFacts = new Set(
    [...pools.easy, ...pools.hard].map((question) => question.coreFactId)
  );
  let leftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));

  TRIVIA_DIFFICULTIES.forEach((difficulty) => {
    let pool = [...pools[difficulty]];
    let replacements = 0;
    const countCurveballs = () =>
      pool.filter(
        (question) =>
          question.isTrickQuestion &&
          question.scheduleEligible &&
          isAllowedCurveballQuestion('sports', question)
      ).length;

    while (countCurveballs() < minimumCurveballsPerPool) {
      const replacement = leftovers
        .filter(
          (question) =>
            question.isTrickQuestion &&
            isAllowedCurveballQuestion('sports', question) &&
            isRecordScheduleEligibleForPool(question, difficulty)
        )
        .sort(
          (left, right) =>
            getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
            left.coreFactId.localeCompare(right.coreFactId)
        )[0];
      if (!replacement) {
        const availableCurveballs = leftovers.filter(
          (question) => question.isTrickQuestion && isAllowedCurveballQuestion('sports', question)
        );
        const eligibleCurveballs = availableCurveballs.filter((question) =>
          isRecordScheduleEligibleForPool(question, difficulty)
        );
        const summarize = (questions: TriviaQuestionRecord[]) =>
          questions
            .slice(0, 16)
            .map(
              (question) =>
                `${question.editorialSourceFamily}/${question.subdomain}/d${question.difficultyTarget}/${question.curveballKind ?? 'none'}:${question.stem}`
            )
            .join(' || ');
        throw new Error(
          `Unable to provision enough sports curveballs for ${difficulty} pool. ` +
            `current=${countCurveballs()} target=${minimumCurveballsPerPool} ` +
            `available=${availableCurveballs.length} eligible=${eligibleCurveballs.length} ` +
            `availableSamples=[${summarize(availableCurveballs)}] eligibleSamples=[${summarize(eligibleCurveballs)}]`
        );
      }

      const removalIndex = pool
        .map((question, index) => ({ question, index }))
        .filter(
          ({ question }) =>
            !question.isTrickQuestion &&
            question.subdomain === replacement.subdomain
        )
        .sort(
          (left, right) =>
            getPoolPreferenceScore(left.question, difficulty) -
              getPoolPreferenceScore(right.question, difficulty) ||
            left.question.coreFactId.localeCompare(right.question.coreFactId)
        )[0]?.index;

      const fallbackRemovalIndex =
        removalIndex ??
        pool
          .map((question, index) => ({ question, index }))
          .filter(({ question }) => !question.isTrickQuestion)
          .sort(
            (left, right) =>
              getPoolPreferenceScore(left.question, difficulty) -
                getPoolPreferenceScore(right.question, difficulty) ||
              left.question.coreFactId.localeCompare(right.question.coreFactId)
          )[0]?.index;

      if (fallbackRemovalIndex == null) {
        throw new Error(`Unable to free a non-curveball slot in sports ${difficulty} pool.`);
      }

      const removed = pool[fallbackRemovalIndex];
      pool[fallbackRemovalIndex] = cloneIntoDifficultyPool(replacement, difficulty);
      leftovers = leftovers.filter((question) => question.coreFactId !== replacement.coreFactId);
      const removedRaw = rawByCoreFact.get(removed.coreFactId);
      if (removedRaw) leftovers.push(removedRaw);
    }

    pools[difficulty] = pool;
  });

  return pools;
}

function capSportsTrickPools(
  rawCandidates: TriviaQuestionRecord[],
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>,
  maximumTrickQuestionsPerPool: number
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const rawByCoreFact = new Map(rawCandidates.map((question) => [question.coreFactId, question]));
  let selectedCoreFacts = new Set(
    [...pools.easy, ...pools.hard].map((question) => question.coreFactId)
  );
  let leftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));

  TRIVIA_DIFFICULTIES.forEach((difficulty) => {
    let pool = [...pools[difficulty]];
    const trickCap = difficulty === 'hard' ? maximumTrickQuestionsPerPool : 160;
    const countTricks = () => pool.filter((question) => question.isTrickQuestion).length;

    while (countTricks() > trickCap) {
      const removable = pool
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => question.isTrickQuestion)
        .sort(
          (left, right) =>
            getPoolPreferenceScore(left.question, difficulty) -
              getPoolPreferenceScore(right.question, difficulty) ||
            left.question.coreFactId.localeCompare(right.question.coreFactId)
        )[0];

      if (!removable) {
        break;
      }

      const replacement =
        leftovers
          .filter(
            (question) =>
              isRecordScheduleEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.subdomain === removable.question.subdomain &&
              question.difficultyTarget === removable.question.difficultyTarget
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) =>
              isRecordScheduleEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.subdomain === removable.question.subdomain &&
              Math.abs(question.difficultyTarget - removable.question.difficultyTarget) <= 1
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) =>
              isRecordScheduleEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.difficultyTarget === removable.question.difficultyTarget
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) => isRecordScheduleEligibleForPool(question, difficulty) && !question.isTrickQuestion
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) =>
              isRecordLaunchEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.subdomain === removable.question.subdomain &&
              question.difficultyTarget === removable.question.difficultyTarget
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) =>
              isRecordLaunchEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.subdomain === removable.question.subdomain &&
              Math.abs(question.difficultyTarget - removable.question.difficultyTarget) <= 1
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) =>
              isRecordLaunchEligibleForPool(question, difficulty) &&
              !question.isTrickQuestion &&
              question.difficultyTarget === removable.question.difficultyTarget
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0] ??
        leftovers
          .filter(
            (question) => isRecordLaunchEligibleForPool(question, difficulty) && !question.isTrickQuestion
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0];

      if (!replacement) {
        break;
      }

      pool[removable.index] = cloneIntoDifficultyPool(replacement, difficulty);
      leftovers = leftovers.filter((question) => question.coreFactId !== replacement.coreFactId);
      const removedRaw = rawByCoreFact.get(removable.question.coreFactId);
      if (removedRaw) leftovers.push(removedRaw);
      selectedCoreFacts = new Set(
        [...pools[difficulty === 'easy' ? 'hard' : 'easy'], ...pool].map((question) => question.coreFactId)
      );
      leftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));
    }

    pools[difficulty] = pool;
  });

  return pools;
}

function maximizeScheduleEligiblePoolCoverage(
  rawCandidates: TriviaQuestionRecord[],
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const isRotationSubdomain = (subdomain: string) =>
    SPORTS_ROTATION_SUBDOMAINS.has(subdomain) || subdomain === 'general-sports';

  TRIVIA_DIFFICULTIES.forEach((difficulty) => {
    let pool = [...pools[difficulty]];
    let replacements = 0;
    const otherPool = pools[difficulty === 'easy' ? 'hard' : 'easy'];
    const selectedCoreFacts = new Set(
      [...pool, ...otherPool].map((question) => question.coreFactId)
    );
    const eligibleLeftovers = rawCandidates
      .filter(
        (question) =>
          !selectedCoreFacts.has(question.coreFactId) &&
          isRecordScheduleEligibleForPool(question, difficulty)
      )
      .sort(
        (left, right) =>
          getPoolPreferenceScore(right, difficulty) - getPoolPreferenceScore(left, difficulty) ||
          left.coreFactId.localeCompare(right.coreFactId)
      );
    const claimedCoreFacts = new Set<string>();

    const pickReplacement = (
      removable: TriviaQuestionRecord
    ): TriviaQuestionRecord | undefined => {
      const sameBand = (question: TriviaQuestionRecord) =>
        SPORTS_CORE_SUBDOMAINS.has(question.subdomain) === SPORTS_CORE_SUBDOMAINS.has(removable.subdomain) &&
        isRotationSubdomain(question.subdomain) === isRotationSubdomain(removable.subdomain);
      const candidateGroups: Array<(question: TriviaQuestionRecord) => boolean> = [
        (question) =>
          question.subdomain === removable.subdomain &&
          question.difficultyTarget === removable.difficultyTarget,
        (question) =>
          question.subdomain === removable.subdomain &&
          Math.abs(question.difficultyTarget - removable.difficultyTarget) <= 1,
        (question) =>
          sameBand(question) &&
          question.difficultyTarget === removable.difficultyTarget,
        (question) =>
          sameBand(question) &&
          Math.abs(question.difficultyTarget - removable.difficultyTarget) <= 1,
        (question) => question.difficultyTarget === removable.difficultyTarget,
        () => true,
      ];

      for (const matcher of candidateGroups) {
        const replacement = eligibleLeftovers.find(
          (question) => !claimedCoreFacts.has(question.coreFactId) && matcher(question)
        );
        if (replacement) return replacement;
      }

      return undefined;
    };

    const removables = pool
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => !question.scheduleEligible)
      .sort(
        (left, right) =>
          getPoolPreferenceScore(left.question, difficulty) -
            getPoolPreferenceScore(right.question, difficulty) ||
          left.question.coreFactId.localeCompare(right.question.coreFactId)
      );

    removables.forEach((removable) => {
      const replacement = pickReplacement(removable.question);
      if (!replacement) return;

      pool[removable.index] = cloneIntoDifficultyPool(replacement, difficulty);
      claimedCoreFacts.add(replacement.coreFactId);
      replacements += 1;
    });

    logBuildStage(
      `maximizeScheduleEligiblePoolCoverage:${difficulty}: replacements=${replacements} scheduleEligible=${pool.filter((question) => question.scheduleEligible).length}/${pool.length}`
    );
    pools[difficulty] = pool;
  });

  return pools;
}

function rebalanceSportsHardFromEasy(
  rawCandidates: TriviaQuestionRecord[],
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const targetHardScheduleEligible = SPORTS_SCHEDULED_COUNT;
  const hardScheduleEligibleCount = () => pools.hard.filter((question) => question.scheduleEligible).length;
  if (hardScheduleEligibleCount() >= targetHardScheduleEligible) {
    return pools;
  }

  const rawByCoreFact = new Map(rawCandidates.map((question) => [question.coreFactId, question]));
  const selectedCoreFacts = new Set(
    [...pools.easy, ...pools.hard].map((question) => question.coreFactId)
  );
  const availableLeftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));
  const claimedReplacementCoreFacts = new Set<string>();
  const hardClaimedDonors = new Set<string>();

  const easyReplacementPool = availableLeftovers
    .filter((question) => isRecordPoolEligibleForPool(question, 'easy'))
    .sort(
      (left, right) =>
        getPoolPreferenceScore(right, 'easy') - getPoolPreferenceScore(left, 'easy') ||
        left.coreFactId.localeCompare(right.coreFactId)
    );
  const hardDonorPool = pools.easy
    .map((question, index) => ({ question, index, raw: rawByCoreFact.get(question.coreFactId) ?? question }))
    .filter(({ raw }) => isRecordScheduleEligibleForPool(raw, 'hard'))
    .sort(
      (left, right) =>
        getPoolPreferenceScore(right.raw, 'hard') - getPoolPreferenceScore(left.raw, 'hard') ||
        left.raw.coreFactId.localeCompare(right.raw.coreFactId)
    );
  const hardRemovables = pools.hard
    .map((question, index) => ({ question, index }))
    .filter(({ question }) => !question.scheduleEligible)
    .sort(
      (left, right) =>
        getPoolPreferenceScore(left.question, 'hard') - getPoolPreferenceScore(right.question, 'hard') ||
        left.question.coreFactId.localeCompare(right.question.coreFactId)
    );

  const pickEasyReplacement = (donor: TriviaQuestionRecord): TriviaQuestionRecord | undefined => {
    const sameBand = (question: TriviaQuestionRecord) =>
      SPORTS_CORE_SUBDOMAINS.has(question.subdomain) === SPORTS_CORE_SUBDOMAINS.has(donor.subdomain) &&
      (SPORTS_ROTATION_SUBDOMAINS.has(question.subdomain) || question.subdomain === 'general-sports') ===
        (SPORTS_ROTATION_SUBDOMAINS.has(donor.subdomain) || donor.subdomain === 'general-sports');
    const candidateGroups: Array<(question: TriviaQuestionRecord) => boolean> = [
      (question) => question.subdomain === donor.subdomain && question.difficultyTarget === donor.difficultyTarget,
      (question) =>
        question.subdomain === donor.subdomain &&
        Math.abs(question.difficultyTarget - donor.difficultyTarget) <= 1,
      (question) => sameBand(question) && question.difficultyTarget === donor.difficultyTarget,
      (question) => isRecordScheduleEligibleForPool(question, 'easy'),
      () => true,
    ];

    for (const matcher of candidateGroups) {
      const replacement = easyReplacementPool.find(
        (question) => !claimedReplacementCoreFacts.has(question.coreFactId) && matcher(question)
      );
      if (replacement) return replacement;
    }

    return undefined;
  };

  let swaps = 0;
  for (const removable of hardRemovables) {
    if (hardScheduleEligibleCount() >= targetHardScheduleEligible) break;

    const donor = hardDonorPool.find(
      (candidate) =>
        !hardClaimedDonors.has(candidate.raw.coreFactId) &&
        candidate.raw.coreFactId !== removable.question.coreFactId
    );
    if (!donor) break;

    const easyReplacement = pickEasyReplacement(donor.raw);
    if (!easyReplacement) break;

    pools.hard[removable.index] = cloneIntoDifficultyPool(donor.raw, 'hard');
    pools.easy[donor.index] = cloneIntoDifficultyPool(easyReplacement, 'easy');
    hardClaimedDonors.add(donor.raw.coreFactId);
    claimedReplacementCoreFacts.add(easyReplacement.coreFactId);
    swaps += 1;
  }

  logBuildStage(
    `rebalanceSportsHardFromEasy: swaps=${swaps} hardScheduleEligible=${hardScheduleEligibleCount()}/${pools.hard.length} easyScheduleEligible=${pools.easy.filter((question) => question.scheduleEligible).length}/${pools.easy.length}`
  );
  return pools;
}

function rebalancePoolDifficultyTargets(
  rawCandidates: TriviaQuestionRecord[],
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>,
  targets: Record<TriviaDifficulty, Partial<Record<TriviaDifficultyTarget, number>>>
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const rawByCoreFact = new Map(rawCandidates.map((question) => [question.coreFactId, question]));
  let selectedCoreFacts = new Set(
    [...pools.easy, ...pools.hard].map((question) => question.coreFactId)
  );
  let leftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));

  TRIVIA_DIFFICULTIES.forEach((difficultyPool) => {
    let pool = [...pools[difficultyPool]];
    ([1, 2, 3] as TriviaDifficultyTarget[]).forEach((targetDifficulty) => {
      const targetCount = targets[difficultyPool][targetDifficulty];
      if (targetCount == null) return;
      const currentCount = () =>
        pool.filter((question) => question.difficultyTarget === targetDifficulty).length;
      while (currentCount() < targetCount) {
        const replacement = leftovers
          .filter(
            (question) =>
              question.difficultyTarget === targetDifficulty &&
              isRecordScheduleEligibleForPool(question, difficultyPool)
          )
          .sort(
            (left, right) =>
              getPoolPreferenceScore(right, difficultyPool) -
                getPoolPreferenceScore(left, difficultyPool) ||
              left.coreFactId.localeCompare(right.coreFactId)
          )[0];
        if (!replacement) {
          throw new Error(
            `Unable to provision enough difficulty ${targetDifficulty} questions for ${difficultyPool} pool.`
          );
        }

        const poolCounts = {
          1: pool.filter((question) => question.difficultyTarget === 1).length,
          2: pool.filter((question) => question.difficultyTarget === 2).length,
          3: pool.filter((question) => question.difficultyTarget === 3).length,
        } satisfies Record<TriviaDifficultyTarget, number>;

        const removalIndex =
          pool
            .map((question, index) => ({ question, index }))
            .filter(
              ({ question }) =>
                question.difficultyTarget !== targetDifficulty &&
                poolCounts[question.difficultyTarget] >
                  (targets[difficultyPool][question.difficultyTarget] ?? 0)
            )
            .sort(
              (left, right) =>
                getPoolPreferenceScore(left.question, difficultyPool) -
                  getPoolPreferenceScore(right.question, difficultyPool) ||
                left.question.coreFactId.localeCompare(right.question.coreFactId)
            )[0]?.index ??
          pool
            .map((question, index) => ({ question, index }))
            .filter(({ question }) => question.difficultyTarget !== targetDifficulty)
            .sort(
              (left, right) =>
                getPoolPreferenceScore(left.question, difficultyPool) -
                  getPoolPreferenceScore(right.question, difficultyPool) ||
                left.question.coreFactId.localeCompare(right.question.coreFactId)
            )[0]?.index;

        if (removalIndex == null) {
          throw new Error(`Unable to free a slot while rebalancing ${difficultyPool} difficulty targets.`);
        }

        const removed = pool[removalIndex];
        pool[removalIndex] = cloneIntoDifficultyPool(replacement, difficultyPool);
        leftovers = leftovers.filter((question) => question.coreFactId !== replacement.coreFactId);
        const removedRaw = rawByCoreFact.get(removed.coreFactId);
        if (removedRaw) leftovers.push(removedRaw);
        selectedCoreFacts = new Set([...pool, ...pools[difficultyPool === 'easy' ? 'hard' : 'easy']].map((question) => question.coreFactId));
        leftovers = rawCandidates.filter((question) => !selectedCoreFacts.has(question.coreFactId));
      }
    });
    pools[difficultyPool] = pool;
  });

  return pools;
}

function partitionRecordsIntoPools(
  records: TriviaQuestionRecord[],
  groupKey: 'domain' | 'subdomain',
  distribution: Record<string, number>,
  poolTarget: number,
  eligibilityFn: (record: TriviaQuestionRecord, difficultyPool: TriviaDifficulty) => boolean
): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  const poolTargets = buildPoolTargetsFromAvailability(records, groupKey, distribution, poolTarget, eligibilityFn);
  const easyTargets = poolTargets.easy;
  const hardTargets = poolTargets.hard;
  const easyPool: TriviaQuestionRecord[] = [];
  const hardPool: TriviaQuestionRecord[] = [];

  Object.keys(distribution).forEach((group) => {
    const isMixDomainPartition = records[0]?.feed === 'mix' && groupKey === 'domain';
    const groupRecords = records.filter((record) => record[groupKey] === group);
    const easyTarget = easyTargets[group] ?? 0;
    const hardTarget = hardTargets[group] ?? 0;
    const easyLaunchTarget = isMixDomainPartition
      ? Math.min(easyTarget, MIX_DOMAIN_LAUNCH_TARGETS[group as keyof typeof MIX_DOMAIN_DISTRIBUTION] ?? easyTarget)
      : easyTarget;
    const hardLaunchTarget = isMixDomainPartition
      ? Math.min(hardTarget, MIX_DOMAIN_LAUNCH_TARGETS[group as keyof typeof MIX_DOMAIN_DISTRIBUTION] ?? hardTarget)
      : hardTarget;
    const easyPoolEligible = groupRecords.filter((record) => eligibilityFn(record, 'easy'));
    const hardPoolEligible = groupRecords.filter((record) => eligibilityFn(record, 'hard'));
    const easyPoolEligibleCoreFacts = new Set(easyPoolEligible.map((record) => record.coreFactId));
    const hardPoolEligibleCoreFacts = new Set(hardPoolEligible.map((record) => record.coreFactId));
    const easyOnlyPool = easyPoolEligible.filter((record) => !hardPoolEligibleCoreFacts.has(record.coreFactId));
    const hardOnlyPool = hardPoolEligible.filter((record) => !easyPoolEligibleCoreFacts.has(record.coreFactId));
    const sharedPool = groupRecords.filter(
      (record) => easyPoolEligibleCoreFacts.has(record.coreFactId) && hardPoolEligibleCoreFacts.has(record.coreFactId)
    );

    const easyLaunchEligible = groupRecords.filter((record) => isRecordScheduleEligibleForPool(record, 'easy'));
    const hardLaunchEligible = groupRecords.filter((record) => isRecordScheduleEligibleForPool(record, 'hard'));
    const easyLaunchCoreFacts = new Set(easyLaunchEligible.map((record) => record.coreFactId));
    const hardLaunchCoreFacts = new Set(hardLaunchEligible.map((record) => record.coreFactId));

    const easyLaunchOnly = easyLaunchEligible.filter((record) => !hardLaunchCoreFacts.has(record.coreFactId));
    const hardLaunchOnly = hardLaunchEligible.filter((record) => !easyLaunchCoreFacts.has(record.coreFactId));
    const sharedLaunch = groupRecords.filter(
      (record) => easyLaunchCoreFacts.has(record.coreFactId) && hardLaunchCoreFacts.has(record.coreFactId)
    );

    const sortForPool = (pool: TriviaDifficulty) => (left: TriviaQuestionRecord, right: TriviaQuestionRecord) =>
      getPoolPreferenceScore(right, pool) - getPoolPreferenceScore(left, pool) ||
      left.coreFactId.localeCompare(right.coreFactId);
    const sortForFill = (pool: TriviaDifficulty, preferLaunch: boolean) => (left: TriviaQuestionRecord, right: TriviaQuestionRecord) => {
      const leftLaunchRank = isRecordScheduleEligibleForPool(left, pool) ? 0 : 1;
      const rightLaunchRank = isRecordScheduleEligibleForPool(right, pool) ? 0 : 1;
      if (preferLaunch) {
        if (leftLaunchRank !== rightLaunchRank) return leftLaunchRank - rightLaunchRank;
      } else if (leftLaunchRank !== rightLaunchRank) {
        return rightLaunchRank - leftLaunchRank;
      }
      return sortForPool(pool)(left, right);
    };

    const easySelected: TriviaQuestionRecord[] = [...easyLaunchOnly]
      .sort(sortForPool('easy'))
      .slice(0, easyLaunchTarget);
    const hardSelected: TriviaQuestionRecord[] = [...hardLaunchOnly]
      .sort(sortForPool('hard'))
      .slice(0, hardLaunchTarget);
    const selectedCoreFacts = new Set([...easySelected, ...hardSelected].map((record) => record.coreFactId));
    const remainingLaunch = [...sharedLaunch].filter((record) => !selectedCoreFacts.has(record.coreFactId));

    let easyRemaining = easyLaunchTarget - easySelected.length;
    let hardRemaining = hardLaunchTarget - hardSelected.length;

    if (isMixDomainPartition) {
      const easyNeedsSharedPool = Math.max(0, easyTarget - easyOnlyPool.length);
      const hardSharedCap = Math.max(0, sharedPool.length - easyNeedsSharedPool);
      const hardSharedSelected = [...remainingLaunch]
        .sort(sortForPool('hard'))
        .slice(0, Math.min(hardRemaining, hardSharedCap));
      hardSharedSelected.forEach((record) => selectedCoreFacts.add(record.coreFactId));
      hardSelected.push(...hardSharedSelected);
      hardRemaining = hardLaunchTarget - hardSelected.length;

      const easySharedSelected = remainingLaunch
        .filter((record) => !selectedCoreFacts.has(record.coreFactId))
        .sort(sortForPool('easy'))
        .slice(0, easyRemaining);
      easySharedSelected.forEach((record) => selectedCoreFacts.add(record.coreFactId));
      easySelected.push(...easySharedSelected);
      easyRemaining = easyLaunchTarget - easySelected.length;
    } else {
      const hardNeedsSharedPool = Math.max(0, hardLaunchTarget - hardOnlyPool.length);
      const easySharedCap = Math.max(0, sharedPool.length - hardNeedsSharedPool);
      const easySharedSelected = [...remainingLaunch]
        .sort(sortForPool('easy'))
        .slice(0, Math.min(easyRemaining, easySharedCap));
      easySharedSelected.forEach((record) => selectedCoreFacts.add(record.coreFactId));
      easySelected.push(...easySharedSelected);
      easyRemaining = easyLaunchTarget - easySelected.length;
      const hardSharedSelected = remainingLaunch
        .filter((record) => !selectedCoreFacts.has(record.coreFactId))
        .sort(sortForPool('hard'))
        .slice(0, hardRemaining);
      hardSharedSelected.forEach((record) => selectedCoreFacts.add(record.coreFactId));
      hardSelected.push(...hardSharedSelected);
      hardRemaining = hardLaunchTarget - hardSelected.length;
    }

    const fillPoolToTarget = (
      selected: TriviaQuestionRecord[],
      eligiblePool: TriviaQuestionRecord[],
      target: number,
      launchTarget: number,
      pool: TriviaDifficulty
    ) => {
      if (isMixDomainPartition) {
        const launchShortfall = Math.max(
          0,
          launchTarget - selected.filter((record) => isRecordScheduleEligibleForPool(record, pool)).length
        );
        const launchFill = eligiblePool
          .filter(
            (record) =>
              !selectedCoreFacts.has(record.coreFactId) && isRecordScheduleEligibleForPool(record, pool)
          )
          .sort(sortForPool(pool))
          .slice(0, launchShortfall);
        launchFill.forEach((record) => selectedCoreFacts.add(record.coreFactId));
        selected.push(...launchFill);
      }

      const reserveFill = eligiblePool
        .filter((record) => !selectedCoreFacts.has(record.coreFactId))
        .sort(sortForFill(pool, !isMixDomainPartition))
        .slice(0, target - selected.length);
      reserveFill.forEach((record) => selectedCoreFacts.add(record.coreFactId));
      selected.push(...reserveFill);
    };

    fillPoolToTarget(easySelected, easyPoolEligible, easyTarget, easyLaunchTarget, 'easy');
    fillPoolToTarget(hardSelected, hardPoolEligible, hardTarget, hardLaunchTarget, 'hard');

    if (easySelected.length !== easyTarget || hardSelected.length !== hardTarget) {
      throw new Error(
        `Failed to build launch-eligible ${groupKey} pools for ${group}: easy=${easySelected.length}/${easyTarget} hard=${hardSelected.length}/${hardTarget}.`
      );
    }

    easyPool.push(...easySelected.map((record) => cloneIntoDifficultyPool(record, 'easy')));
    hardPool.push(...hardSelected.map((record) => cloneIntoDifficultyPool(record, 'hard')));
  });

  if (easyPool.length !== poolTarget || hardPool.length !== poolTarget) {
    throw new Error(
      `Failed to build dedicated pools for ${groupKey}: easy=${easyPool.length} hard=${hardPool.length} target=${poolTarget}.`
    );
  }

  return {
    easy: seededShuffle(easyPool, hashString(`${groupKey}-easy-pool`)),
    hard: seededShuffle(hardPool, hashString(`${groupKey}-hard-pool`)),
  };
}

function buildDedicatedMixPools(): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  logBuildStage('buildDedicatedMixPools:start');
  const rawCandidates = getMixRawCandidates();
  logBuildStage(`buildDedicatedMixPools:raw=${rawCandidates.length}`);
  const partitioned = partitionRecordsIntoPools(
    rawCandidates,
    'domain',
    MIX_DOMAIN_DISTRIBUTION,
    MIX_POOL_TARGET,
    isRecordPoolEligibleForPool
  );
  logBuildStage(
    `buildDedicatedMixPools:partitioned easy=${partitioned.easy.length} hard=${partitioned.hard.length}`
  );
  const rebalanced = rebalancePoolDifficultyTargets(
    rawCandidates,
    partitioned,
    MIX_POOL_DIFFICULTY_MINIMUMS
  );
  logBuildStage(
    `buildDedicatedMixPools:rebalanced easy=${rebalanced.easy.length} hard=${rebalanced.hard.length}`
  );
  return rebalanced;
}

function buildDedicatedSportsPools(): Record<TriviaDifficulty, TriviaQuestionRecord[]> {
  logBuildStage('buildDedicatedSportsPools:start');
  const rawCandidates = getSportsRawCandidates().filter((record) =>
    Object.prototype.hasOwnProperty.call(SPORTS_SUBDOMAIN_DISTRIBUTION, record.subdomain)
  );
  logBuildStage(`buildDedicatedSportsPools:raw=${rawCandidates.length}`);
  const optimized = rebalanceSportsHardFromEasy(
    rawCandidates,
    maximizeScheduleEligiblePoolCoverage(
      rawCandidates,
      capSportsTrickPools(
        rawCandidates,
        rebalanceSportsCurveballPools(
          rawCandidates,
          rebalancePoolDifficultyTargets(
            rawCandidates,
            partitionRecordsIntoPools(
              rawCandidates,
              'subdomain',
              SPORTS_SUBDOMAIN_DISTRIBUTION,
              SPORTS_POOL_TARGET,
              isRecordPoolEligibleForPool
            ),
            SPORTS_POOL_DIFFICULTY_MINIMUMS
          ),
          12
        ),
        96
      )
    )
  );
  logBuildStage(
    `buildDedicatedSportsPools:optimized easy=${optimized.easy.length} hard=${optimized.hard.length}`
  );
  return optimized;
}

function printPoolDiagnostics(
  label: string,
  pools: Record<TriviaDifficulty, TriviaQuestionRecord[]>,
  groupKey: 'domain' | 'subdomain'
): void {
  const formatPool = (records: TriviaQuestionRecord[]) => {
    const byGroupDifficulty = new Map<string, number>();
    const launchEligibleByGroup = new Map<string, number>();
    const scheduleEligibleByFamily = new Map<string, number>();
    const blockedByFamily = new Map<string, number>();
    const launchOnlyByFamily = new Map<string, number>();
    const scheduleBlockedReasons = new Map<string, number>();
    const scheduleBlockedSamples = new Map<string, string[]>();
    let launchEligibleCount = 0;
    let scheduleEligibleCount = 0;
    let trickCount = 0;
    records.forEach((record) => {
      if (record.launchEligible) launchEligibleCount += 1;
      if (record.scheduleEligible) {
        scheduleEligibleCount += 1;
        scheduleEligibleByFamily.set(
          record.editorialSourceFamily,
          (scheduleEligibleByFamily.get(record.editorialSourceFamily) ?? 0) + 1
        );
      } else {
        blockedByFamily.set(
          record.editorialSourceFamily,
          (blockedByFamily.get(record.editorialSourceFamily) ?? 0) + 1
        );
        if (record.launchEligible) {
          launchOnlyByFamily.set(
            record.editorialSourceFamily,
            (launchOnlyByFamily.get(record.editorialSourceFamily) ?? 0) + 1
          );
          const reason =
            !isAllowedSourceFamilyForSchedule(record.feed, record.difficultyPool, record.editorialSourceFamily)
              ? `family:${record.editorialSourceFamily}`
              : record.tasteTags.find((tag) => isBlockingTasteTag(record.feed, record, tag))
                ? `taste:${record.tasteTags.find((tag) => isBlockingTasteTag(record.feed, record, tag))}`
                : record.tasteTags.includes('fragment-stem')
                  ? 'taste:fragment-stem'
                  : record.tasteTags.includes('team-association') &&
                      /\bcompetes in which league\b|\bteam that plays at\b|\bplays in\b/i.test(record.stem)
                    ? 'sports:team-association'
                    : record.tasteTags.includes('athlete-association') &&
                        /\bbest known for competing in which sport\b|\bmost closely associated with which league\b/i.test(
                          record.stem
                        )
                      ? 'sports:athlete-association'
                      : record.editorialSourceFamily === 'sports-authored-hardcore' &&
                          record.difficultyPool === 'easy' &&
                          record.difficultyTarget === 3 &&
                          record.salienceScore < 74
                        ? 'sports:easy-hardcore-tail'
                        : record.editorialSourceFamily === 'sports-authored-mainstream-hard' &&
                            record.difficultyPool === 'hard' &&
                            (record.salienceScore < 62 ||
                              (record.difficultyTarget < 2 && record.salienceScore < 76))
                          ? 'sports:mainstream-hard-floor'
                          : 'other';
          scheduleBlockedReasons.set(reason, (scheduleBlockedReasons.get(reason) ?? 0) + 1);
          const samples = scheduleBlockedSamples.get(reason) ?? [];
          if (samples.length < 4) {
            samples.push(`${record.editorialSourceFamily}/${record.subdomain}/d${record.difficultyTarget}:${record.stem}`);
            scheduleBlockedSamples.set(reason, samples);
          }
        }
      }
      if (record.isTrickQuestion) trickCount += 1;
      if (record.launchEligible) {
        launchEligibleByGroup.set(record[groupKey], (launchEligibleByGroup.get(record[groupKey]) ?? 0) + 1);
      }
      const key = `${record[groupKey]}/${record.difficultyTarget}`;
      byGroupDifficulty.set(key, (byGroupDifficulty.get(key) ?? 0) + 1);
    });
    return {
      total: records.length,
      launchEligible: launchEligibleCount,
      scheduleEligible: scheduleEligibleCount,
      nonTrickLaunchEligible: records.filter((record) => record.launchEligible && !record.isTrickQuestion).length,
      trickCount,
      launchEligibleByGroup: Object.fromEntries(
        [...launchEligibleByGroup.entries()].sort(([left], [right]) => left.localeCompare(right))
      ),
      scheduleEligibleByFamily: Object.fromEntries(
        [...scheduleEligibleByFamily.entries()].sort(([left], [right]) => left.localeCompare(right))
      ),
      launchOnlyByFamily: Object.fromEntries(
        [...launchOnlyByFamily.entries()].sort(([left], [right]) => left.localeCompare(right))
      ),
      blockedByFamily: Object.fromEntries(
        [...blockedByFamily.entries()].sort(([left], [right]) => left.localeCompare(right))
      ),
      scheduleBlockedReasons: [...scheduleBlockedReasons.entries()]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .map(([reason, count]) => ({
          reason,
          count,
          samples: scheduleBlockedSamples.get(reason) ?? [],
        })),
      byGroupDifficulty: Object.fromEntries([...byGroupDifficulty.entries()].sort(([left], [right]) => left.localeCompare(right))),
    };
  };

  console.log(
    JSON.stringify(
      {
        label,
        easy: formatPool(pools.easy),
        hard: formatPool(pools.hard),
      },
      null,
      2
    )
  );
}

function printRawEligibilityDiagnostics(
  label: string,
  records: TriviaQuestionRecord[],
  groupKey: 'domain' | 'subdomain'
): void {
  const easyEligibleSet = new Set(
    records
      .filter((record) => isRecordLaunchEligibleForPool(record, 'easy'))
      .map((record) => record.coreFactId)
  );
  const hardEligibleSet = new Set(
    records
      .filter((record) => isRecordLaunchEligibleForPool(record, 'hard'))
      .map((record) => record.coreFactId)
  );
  const overlap = {
    easyOnly: records.filter(
      (record) => easyEligibleSet.has(record.coreFactId) && !hardEligibleSet.has(record.coreFactId)
    ).length,
    hardOnly: records.filter(
      (record) => !easyEligibleSet.has(record.coreFactId) && hardEligibleSet.has(record.coreFactId)
    ).length,
    both: records.filter(
      (record) => easyEligibleSet.has(record.coreFactId) && hardEligibleSet.has(record.coreFactId)
    ).length,
    neither: records.filter(
      (record) => !easyEligibleSet.has(record.coreFactId) && !hardEligibleSet.has(record.coreFactId)
    ).length,
  };
  const summarize = (difficultyPool: TriviaDifficulty) => {
    const eligible = records.filter((record) => isRecordLaunchEligibleForPool(record, difficultyPool));
    const counts = new Map<string, number>();
    eligible.forEach((record) => {
      const key = `${record[groupKey]}/${record.difficultyTarget}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return {
      eligibleCount: eligible.length,
      nonTrickEligibleCount: eligible.filter((record) => !record.isTrickQuestion).length,
      byGroupDifficulty: Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right))),
    };
  };

  const blockReasons = new Map<string, number>();
  const blockSamples = new Map<string, string[]>();
  records.forEach((record) => {
    const reasons = getLaunchBlockReasons(record, 'hard');
    if (reasons.length === 0) return;
    const seen = new Set<string>();
    reasons.forEach((reason) => {
      const key = `${reason.agentId}:${reason.code}`;
      if (seen.has(key)) return;
      seen.add(key);
      blockReasons.set(key, (blockReasons.get(key) ?? 0) + 1);
      const samples = blockSamples.get(key) ?? [];
      if (samples.length < 4) {
        samples.push(`${record.editorialSourceFamily} :: ${record.stem}`);
        blockSamples.set(key, samples);
      }
    });
  });

  console.log(
    JSON.stringify(
      {
        label,
        total: records.length,
        overlap,
        topHardBlockReasons: [...blockReasons.entries()]
          .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
          .slice(0, 20)
          .map(([reason, count]) => ({ reason, count, samples: blockSamples.get(reason) ?? [] })),
        easy: summarize('easy'),
        hard: summarize('hard'),
      },
      null,
      2
    )
  );
}

function getMixSlotConfigs(dayIndex: number, difficulty: TriviaDifficulty): MixSlotConfig[] {
  const theme = MIX_WEEKLY_THEMES[dayIndex % MIX_WEEKLY_THEMES.length];
  const heavyTopical = dayIndex % 2 === 1;
  const bucketPattern: TriviaEditorialBucket[] = heavyTopical
    ? [
        'evergreen',
        'evergreen',
        'evergreen',
        'topical',
        'evergreen',
        'evergreen',
        'topical',
        'evergreen',
        'experimental',
        'evergreen',
        'topical',
        'evergreen',
      ]
    : [
        'evergreen',
        'evergreen',
        'evergreen',
        'evergreen',
        'evergreen',
        'topical',
        'evergreen',
        'topical',
        'experimental',
        'evergreen',
        'topical',
        'evergreen',
      ];

  const difficulties: TriviaDifficultyTarget[] =
    difficulty === 'easy' ? [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3] : [1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3];
  const targetSalienceScores =
    difficulty === 'easy'
      ? [80, 79, 78, 78, 77, 76, 72, 70, 69, 71, 70, 70]
      : [76, 73, 72, 71, 69, 68, 67, 66, 64, 60, 59, 58];
  const maxSalienceScores =
    difficulty === 'easy'
      ? [88, 86, 85, 84, 82, 81, 77, 75, 74, 74, 73, 73]
      : [84, 81, 80, 78, 76, 75, 74, 73, 70, 66, 65, 64];
  return difficulties.map((targetDifficulty, index) => ({
    difficulty: targetDifficulty,
    buckets: [bucketPattern[index], 'evergreen', 'topical', 'experimental'],
    domainOrder: theme.mixDomains ?? ['world', 'science', 'arts', 'history'],
    refreshable: bucketPattern[index] !== 'evergreen',
    minSalienceScore:
      difficulty === 'easy'
        ? index < 4
          ? 72
          : index < 6
            ? 71
            : index < 9
              ? 69
              : 69
        : index < 1
          ? 70
          : index < 4
            ? 68
            : index < 7
              ? 66
              : index < 9
                ? 64
                : 61,
    maxSalienceScore: maxSalienceScores[index],
    targetSalienceScore: targetSalienceScores[index],
    preferredPromptKinds:
      difficulty === 'easy'
        ? index === 8
          ? ['term', 'concept', 'place', 'work', 'rule']
          : index >= 9
            ? ['person', 'place', 'work', 'concept', 'event', 'term']
            : index >= 7
              ? ['person', 'concept', 'event', 'term', 'place', 'work']
              : ['place', 'work', 'person', 'concept', 'term']
        : index === 0
          ? ['person', 'place', 'concept', 'event', 'work', 'term']
          : index < 4
            ? ['person', 'concept', 'event', 'place', 'term', 'work']
            : index < 7
              ? ['concept', 'person', 'event', 'term', 'rule', 'place', 'work']
              : ['concept', 'event', 'person', 'term', 'rule', 'place', 'work'],
    preferHigherLookupRisk: difficulty === 'easy' ? index >= 8 : index >= 4,
    blockedObscurityFlags: ['media-tie-in', 'incidental-context', 'vague-stem', 'timer-friction'],
  }));
}

function getSportsSlotConfigs(dayIndex: number, difficulty: TriviaDifficulty): SportsSlotConfig[] {
  const theme = SPORTS_WEEKLY_THEMES[dayIndex % SPORTS_WEEKLY_THEMES.length];
  const eventHeavy = dayIndex % 3 === 2;
  const bucketPattern: TriviaEditorialBucket[] = eventHeavy
    ? ['evergreen', 'evergreen', 'current', 'evergreen', 'current', 'event', 'evergreen', 'event', 'evergreen']
    : ['evergreen', 'evergreen', 'evergreen', 'current', 'evergreen', 'current', 'evergreen', 'event', 'evergreen'];
  const difficulties: TriviaDifficultyTarget[] =
    difficulty === 'easy' ? [1, 2, 2, 2, 3, 3, 3, 3, 3] : [2, 2, 2, 2, 3, 3, 3, 3, 3];
  const slotLeadOrders = [
    ['football', 'basketball', 'baseball', 'hockey'],
    ['basketball', 'football', 'baseball', 'hockey'],
    ['baseball', 'football', 'basketball', 'hockey'],
    ['hockey', 'football', 'basketball', 'baseball', 'golf'],
    ['football', 'basketball', 'baseball', 'hockey', 'tennis', 'golf'],
    ['basketball', 'baseball', 'football', 'hockey', 'olympics', 'tennis', 'golf'],
    ['football', 'hockey', 'basketball', 'baseball', 'golf', 'tennis', 'olympics', 'soccer'],
    ['baseball', 'basketball', 'football', 'hockey', 'tennis', 'golf', 'motorsport', 'olympics', 'soccer'],
    ['hockey', 'baseball', 'football', 'basketball', 'tennis', 'golf', 'olympics', 'motorsport', 'soccer', 'combat'],
  ] as const;
  const slotMaxStemLength = [92, 100, 104, 116, 122, 128, 148, 164, 172];
  const slotAllowedLookupRisks: TriviaLookupRisk[][] =
    difficulty === 'easy'
      ? [
          ['low', 'medium'],
          ['low', 'medium'],
          ['low', 'medium'],
          ['low', 'medium'],
          ['low', 'medium', 'high'],
          ['low', 'medium', 'high'],
          ['low', 'medium', 'high'],
          ['low', 'medium', 'high'],
          ['low', 'medium', 'high'],
        ]
      : [
          ['medium', 'low'],
          ['medium', 'low', 'high'],
          ['medium', 'high', 'low'],
          ['medium', 'high', 'low'],
          ['medium', 'high', 'low'],
          ['high', 'medium', 'low'],
          ['high', 'medium', 'low'],
          ['high', 'medium', 'low'],
          ['high', 'medium', 'low'],
        ];
  const slotMinSalience =
    difficulty === 'easy' ? [81, 76, 75, 73, 70, 66, 64, 62, 61] : [80, 73, 66, 66, 65, 63, 61, 60, 59];
  const slotMaxSalience =
    difficulty === 'easy' ? [90, 84, 82, 80, 76, 72, 69, 67, 66] : [94, 92, 90, 88, 82, 78, 75, 73, 72];
  const slotTargetSalience =
    difficulty === 'easy' ? [80, 75, 73, 71, 68, 64, 61, 59, 58] : [78, 73, 69, 68, 67, 63, 61, 60, 59];
  const slotPromptKinds: TriviaPromptKind[][] =
    difficulty === 'easy'
      ? [
          ['achievement', 'player', 'team', 'term', 'rule', 'place', 'sport-id'],
          ['player', 'achievement', 'team', 'term', 'venue', 'place', 'sport-id'],
          ['player', 'achievement', 'event', 'venue', 'place', 'term', 'team', 'sport-id'],
          ['achievement', 'event', 'player', 'term', 'rule', 'venue', 'place'],
          ['player', 'achievement', 'event', 'term', 'rule', 'venue', 'place', 'sport-id'],
          ['achievement', 'player', 'event', 'term', 'rule', 'venue', 'place', 'record', 'sport-id'],
          ['achievement', 'player', 'event', 'term', 'rule', 'record', 'venue', 'place', 'sport-id'],
          ['achievement', 'player', 'event', 'term', 'rule', 'record', 'place', 'sport-id'],
          ['achievement', 'player', 'event', 'term', 'rule', 'record', 'place', 'sport-id'],
        ]
      : [
          ['achievement', 'player', 'team', 'venue', 'place', 'event', 'term', 'rule'],
          ['achievement', 'player', 'event', 'venue', 'place', 'term', 'rule', 'sport-id'],
          ['achievement', 'event', 'player', 'record', 'term', 'rule', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
          ['achievement', 'term', 'rule', 'event', 'record', 'player', 'sport-id', 'venue', 'place'],
        ];
  return difficulties.map((targetDifficulty, index) => ({
    difficulty: targetDifficulty,
    buckets: [bucketPattern[index], 'evergreen', 'current', 'event'],
    subdomainOrder: dedupe([
      ...(index >= 4 ? (theme.sportsSubdomains ?? []) : slotLeadOrders[index]),
      ...(index >= 4 ? slotLeadOrders[index] : (theme.sportsSubdomains ?? [])),
      'football',
      'basketball',
      'baseball',
      'hockey',
      'tennis',
      'golf',
      'olympics',
      'soccer',
      'motorsport',
      'combat',
      'general-sports',
    ]),
    refreshable: bucketPattern[index] !== 'evergreen',
    maxStemLength: slotMaxStemLength[index],
    allowedLookupRisks: slotAllowedLookupRisks[index],
    minSalienceScore: slotMinSalience[index],
    maxSalienceScore: slotMaxSalience[index],
    targetSalienceScore: slotTargetSalience[index],
    preferredPromptKinds: slotPromptKinds[index],
    preferHigherLookupRisk: difficulty === 'easy' ? index >= 5 : true,
    blockedObscurityFlags: SPORTS_BLOCKED_FLAGS,
  }));
}

function pickQuestionForSlot(
  questions: TriviaQuestionRecord[],
  usedIds: Set<string>,
  usedVariantGroups: Set<string>,
  recentEntities: string[],
  config: MixSlotConfig | SportsSlotConfig,
  key: 'domain' | 'subdomain',
  usedKeysInEpisode: Set<string>,
  state: SlotSelectionState,
  requireTrickQuestion = false,
  avoidTrickQuestion = false
): TriviaQuestionRecord {
  const entitySet = new Set(recentEntities);
  const hasSurfaceFormRoom = (question: TriviaQuestionRecord) => {
    const surfaceForm = inferSurfaceFormKey(question);
    if (!isSurfaceFormConstrained(surfaceForm)) return true;
    if (state.usedSurfaceForms.has(surfaceForm)) return false;
    const recentCount = state.recentSurfaceForms.filter((value) => value === surfaceForm).length;
    return recentCount < getRecentSurfaceFormLimit(state.feed, surfaceForm);
  };
  const violatesSportsEpisodeCaps = (question: TriviaQuestionRecord) => {
    if (state.feed !== 'sports') return false;
    if (state.generalSportsCount >= 1 && question.subdomain === 'general-sports') return true;
    if (state.nicheCount >= 1 && question.obscurityFlags.some((flag) => SPORTS_NICHE_FLAGS.includes(flag))) {
      return true;
    }
    return false;
  };
  const passesSportsStateGuard = (question: TriviaQuestionRecord) => {
    if (state.feed !== 'sports') return true;
    const allowLateHardCuratedFallback =
      config.difficulty === 3 &&
      state.slotIndex >= 6 &&
      question.sourceTier === 'curated' &&
      question.salienceScore >= 76;
    const allowLateHardCanonicalFallback =
      config.difficulty === 3 &&
      state.slotIndex >= 8 &&
      question.sourceTier === 'curated' &&
      question.salienceScore >= 78;
    const allowMainstreamHardRuleTerm =
      question.editorialSourceFamily === 'sports-authored-mainstream-hard' &&
      question.difficultyTarget >= 2 &&
      question.salienceScore <= 88;
    if (question.curveballOnly && !requireTrickQuestion) return false;
    if (question.obscurityFlags.some((flag) => SPORTS_BLOCKED_FLAGS.includes(flag))) return false;
    if (state.slotIndex >= 4 && question.sourceTier === 'legacy') return false;
    if (state.slotIndex >= 8 && !['curated', 'variant'].includes(question.sourceTier)) return false;
    if (state.slotIndex >= 7 && question.promptKind === 'team' && !allowLateHardCanonicalFallback) {
      return false;
    }
    if (state.slotIndex >= 7 && question.promptKind === 'venue' && !allowLateHardCuratedFallback) {
      return false;
    }
    if (
      !allowLateHardCuratedFallback &&
      state.slotIndex >= 8 &&
      question.promptKind === 'sport-id' &&
      question.salienceScore >= 76
    ) {
      return false;
    }
    if (
      question.difficultyPool === 'easy' &&
      state.slotIndex >= 3 &&
      question.promptKind === 'event' &&
      /\bmost closely associated with which league\b/i.test(question.stem)
    ) {
      return false;
    }
    if (
      question.difficultyPool === 'easy' &&
      state.slotIndex >= 6 &&
      question.promptKind === 'sport-id' &&
      /\b(?:is|was) best known for competing in which sport\b|\bwhich athlete is best known for\b/i.test(question.stem)
    ) {
      return false;
    }
    if (
      question.difficultyPool === 'easy' &&
      state.slotIndex >= 6 &&
      question.promptKind === 'player' &&
      /\bmost closely associated with which team\b|\bmost closely associated with as a\b|\bwas primarily the .* for the\b|\bteam from .* as a\b/i.test(
        question.stem
      )
    ) {
      return false;
    }
    if (!state.allowHighRisk && question.lookupRisk === 'high') return false;
    if (SPORTS_CORE_SUBDOMAINS.has(question.subdomain)) {
      const remainingSportsSlots = 9 - state.slotIndex;
      const rotationsNeeded = state.minimumRotationTarget - state.rotationCount;
      if (state.slotIndex < 8 && rotationsNeeded > 0 && remainingSportsSlots <= rotationsNeeded) {
        return false;
      }
    }
    if (
      state.slotIndex >= 7 &&
      question.subdomain === 'general-sports' &&
      !SPORTS_Q9_GENERAL_PROMPT_KINDS.has(question.promptKind)
    ) {
      return false;
    }
    return true;
  };
  const matchesConfiguredDifficulty = (question: TriviaQuestionRecord) => {
    if (
      state.feed === 'sports' &&
      state.scheduleDifficulty === 'hard' &&
      state.slotIndex <= 3
    ) {
      return question.difficultyTarget === 1 || question.difficultyTarget === 2;
    }
    return question.difficultyTarget === config.difficulty;
  };
  const allowsRepeatedSportsSubdomain = (question: TriviaQuestionRecord) =>
    state.feed === 'sports' &&
    key === 'subdomain' &&
    question.sourceTier !== 'legacy' &&
    question.legacyFamily === 'none' &&
    (
      (
        state.slotIndex >=
          (state.scheduleDifficulty === 'hard' ? 4 : question.subdomain === 'hockey' ? 6 : 4) &&
        SPORTS_REPEATABLE_CORE_SUBDOMAINS.has(question.subdomain) &&
        question.salienceScore >=
          (
            state.scheduleDifficulty === 'hard'
              ? state.slotIndex >= 6
                ? 74
                : 76
              : state.slotIndex >= 6
                ? question.subdomain === 'hockey'
                  ? 84
                  : 82
                : 84
          )
      ) ||
      (
        state.slotIndex >= (state.scheduleDifficulty === 'hard' ? 5 : 5) &&
        SPORTS_ROTATION_SUBDOMAINS.has(question.subdomain) &&
        question.sourceTier === 'curated' &&
        question.salienceScore >=
          (
            state.scheduleDifficulty === 'hard'
              ? state.slotIndex >= 7
                ? 78
                : 80
              : state.slotIndex >= 7
                ? 82
                : 84
          )
      )
    );
  const canUseTaxonomyKey = (question: TriviaQuestionRecord) =>
    !usedKeysInEpisode.has(question[key]) || allowsRepeatedSportsSubdomain(question);
  const primary = questions.filter((question) => {
    if (usedIds.has(question.id)) return false;
    if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
    if (!question.scheduleEligible) return false;
    if (!matchesConfiguredDifficulty(question)) return false;
    if (!config.buckets.includes(question.editorialBucket ?? 'evergreen')) return false;
    if (requireTrickQuestion && !question.isTrickQuestion) return false;
    if (avoidTrickQuestion && question.isTrickQuestion) return false;
    if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
    if (config.minSalienceScore && question.salienceScore < config.minSalienceScore) return false;
    if (config.blockedObscurityFlags && question.obscurityFlags.some((flag) => config.blockedObscurityFlags?.includes(flag))) {
      return false;
    }
    if (!hasSurfaceFormRoom(question)) return false;
    if (!passesSportsStateGuard(question)) return false;
    if (violatesSportsEpisodeCaps(question)) return false;
    return true;
  });

  const constrained =
    config.maxStemLength || config.allowedLookupRisks || config.preferredPromptKinds || config.maxSalienceScore
      ? primary.filter((question) => {
          if (config.maxStemLength && question.stem.length > config.maxStemLength) return false;
          if (config.allowedLookupRisks && !config.allowedLookupRisks.includes(question.lookupRisk)) return false;
          if (config.maxSalienceScore && question.salienceScore > config.maxSalienceScore) return false;
          return true;
        })
      : primary;

  const candidatePool = constrained.length > 0 ? constrained : primary;

  const secondary = candidatePool.filter((question) => {
    const order = key === 'domain' ? (config as MixSlotConfig).domainOrder : (config as SportsSlotConfig).subdomainOrder;
    return order.includes(question[key]);
  });

  const uniqueSecondary = secondary.filter((question) => canUseTaxonomyKey(question));
  const uniquePrimary = candidatePool.filter((question) => canUseTaxonomyKey(question));
  const uniquePromptKinds = candidatePool.filter((question) => !state.usedPromptKinds.has(question.promptKind));
  const uniqueSecondaryPromptKinds = uniqueSecondary.filter(
    (question) => !state.usedPromptKinds.has(question.promptKind)
  );
  const secondaryPromptKinds = secondary.filter(
    (question) => !state.usedPromptKinds.has(question.promptKind)
  );
  const uniquePrimaryPromptKinds = uniquePrimary.filter(
    (question) => !state.usedPromptKinds.has(question.promptKind)
  );
  const pool = pickCrossDifficultyPreferredPool(
    [
      uniqueSecondaryPromptKinds,
      uniqueSecondary,
      secondaryPromptKinds,
      secondary,
      uniquePrimaryPromptKinds,
      uniquePrimary,
      uniquePromptKinds,
      candidatePool,
    ],
    state
  );
  if (pool.length === 0) {
    const sportsLateSafetyFallback = () =>
      state.feed === 'sports' && state.slotIndex >= 6
        ? questions.find((question) => {
            if (usedIds.has(question.id)) return false;
            if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
            if (!question.scheduleEligible) return false;
            if (question.isTrickQuestion && avoidTrickQuestion) return false;
            if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) {
              return false;
            }
            if (violatesSportsEpisodeCaps(question)) return false;
            if (question.obscurityFlags.some((flag) => SPORTS_BLOCKED_FLAGS.includes(flag))) {
              return false;
            }
            return true;
          }) ?? null
        : null;

    if (requireTrickQuestion) {
      const trickFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
        if (!question.scheduleEligible) return false;
        if (!question.isTrickQuestion) return false;
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return Math.abs(question.difficultyTarget - config.difficulty) <= 1;
      });
      if (trickFallback) {
        return trickFallback;
      }

      const trickAnyFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
        if (!question.scheduleEligible) return false;
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return question.isTrickQuestion;
      });
      if (trickAnyFallback) {
        return trickAnyFallback;
      }

      return pickQuestionForSlot(
        questions,
        usedIds,
        usedVariantGroups,
        recentEntities,
        config,
        key,
        usedKeysInEpisode,
        { ...state, allowHighRisk: true },
        false,
        false
      );
    }

    if (avoidTrickQuestion) {
      const sportsSafetyFallback = sportsLateSafetyFallback();
      if (sportsSafetyFallback && !sportsSafetyFallback.isTrickQuestion) {
        return sportsSafetyFallback;
      }

      const nonTrickAdjacentFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (!question.scheduleEligible) return false;
        if (question.isTrickQuestion) return false;
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return Math.abs(question.difficultyTarget - config.difficulty) <= 1;
      });
      if (nonTrickAdjacentFallback) {
        return nonTrickAdjacentFallback;
      }

      const anyNonTrickFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
        if (!question.scheduleEligible) return false;
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return !question.isTrickQuestion;
      });
      if (anyNonTrickFallback) {
        return anyNonTrickFallback;
      }

      const repeatedVariantNonTrickFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (!question.scheduleEligible) return false;
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return !question.isTrickQuestion;
      });
      if (repeatedVariantNonTrickFallback) {
        return repeatedVariantNonTrickFallback;
      }

      const desperateNonTrickFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (!question.scheduleEligible) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return !question.isTrickQuestion;
      });
      if (desperateNonTrickFallback) {
        return desperateNonTrickFallback;
      }

      const finalFlexibleFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
        if (!question.scheduleEligible) return false;
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return true;
      });
      if (finalFlexibleFallback) {
        return finalFlexibleFallback;
      }

      const finalUltraFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (!question.scheduleEligible) return false;
        if (!passesSportsStateGuard(question)) return false;
        return true;
      });
      if (finalUltraFallback) {
        return finalUltraFallback;
      }

      if (state.allowHighRisk) {
        const candidateSummary = Object.entries(
          candidatePool.reduce((accumulator, question) => {
            const summaryKey = `${question.subdomain}:${question.promptKind}`;
            accumulator[summaryKey] = (accumulator[summaryKey] ?? 0) + 1;
            return accumulator;
          }, {} as Record<string, number>)
        )
          .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
          .slice(0, 8)
          .map(([summaryKey, count]) => `${summaryKey}=${count}`)
          .join(', ');
        const remainingDifficultySummary = Object.entries(
          questions.reduce((accumulator, question) => {
            if (usedIds.has(question.id) || !question.scheduleEligible) return accumulator;
            const summaryKey = `${question.difficultyTarget}:${question.editorialSourceFamily}`;
            accumulator[summaryKey] = (accumulator[summaryKey] ?? 0) + 1;
            return accumulator;
          }, {} as Record<string, number>)
        )
          .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
          .slice(0, 12)
          .map(([summaryKey, count]) => `${summaryKey}=${count}`)
          .join(', ');
        const rejectionSummary = questions
          .filter((question) => !usedIds.has(question.id) && question.scheduleEligible)
          .map((question) => {
            const reasons: string[] = [];
            if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) reasons.push('variant');
            if (!matchesConfiguredDifficulty(question)) reasons.push(`difficulty:${question.difficultyTarget}`);
            if (!config.buckets.includes(question.editorialBucket ?? 'evergreen')) {
              reasons.push(`bucket:${question.editorialBucket ?? 'evergreen'}`);
            }
            if (requireTrickQuestion && !question.isTrickQuestion) reasons.push('needs-trick');
            if (avoidTrickQuestion && question.isTrickQuestion) reasons.push('avoid-trick');
            if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) reasons.push('entity');
            if (config.minSalienceScore && question.salienceScore < config.minSalienceScore) {
              reasons.push(`salience:${question.salienceScore}`);
            }
            if (
              config.blockedObscurityFlags &&
              question.obscurityFlags.some((flag) => config.blockedObscurityFlags?.includes(flag))
            ) {
              reasons.push('blocked-flag');
            }
            if (!hasSurfaceFormRoom(question)) reasons.push('surface');
            if (!passesSportsStateGuard(question)) reasons.push('state');
            if (violatesSportsEpisodeCaps(question)) reasons.push('caps');
            if (config.maxStemLength && question.stem.length > config.maxStemLength) {
              reasons.push(`stem:${question.stem.length}`);
            }
            if (config.allowedLookupRisks && !config.allowedLookupRisks.includes(question.lookupRisk)) {
              reasons.push(`lookup:${question.lookupRisk}`);
            }
            if (config.maxSalienceScore && question.salienceScore > config.maxSalienceScore) {
              reasons.push(`max-salience:${question.salienceScore}`);
            }
            if (!canUseTaxonomyKey(question)) reasons.push(`taxonomy:${question[key]}`);
            return `${question.subdomain}/${question.promptKind}/${question.editorialSourceFamily}/${question.salienceScore}:${
              reasons.join('|') || 'candidate'
            }:${question.stem}`;
          })
          .slice(0, 12)
          .join(' || ');
        throw new Error(
          `Unable to fill non-trick slot for ${state.feed}:${state.slotIndex + 1} ${key}/${config.difficulty}; ` +
            `primary=${primary.length} constrained=${constrained.length} candidate=${candidatePool.length} ` +
            `secondary=${secondary.length} uniqueSecondary=${uniqueSecondary.length} uniquePrimary=${uniquePrimary.length} ` +
            `rotation=${state.rotationCount}/${state.minimumRotationTarget} ` +
            `generalSports=${state.generalSportsCount} niche=${state.nicheCount} ` +
            `usedPromptKinds=${state.usedPromptKinds.size} topCandidates=[${candidateSummary}] ` +
            `remaining=[${remainingDifficultySummary}] ` +
            `rejections=[${rejectionSummary}]`
        );
      }

      return pickQuestionForSlot(
        questions,
        usedIds,
        usedVariantGroups,
        recentEntities,
        config,
        key,
        usedKeysInEpisode,
        { ...state, allowHighRisk: true },
        false,
        true
      );
    }

    const fallback = questions.find((question) => {
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
      if (!question.scheduleEligible) return false;
      if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
      if (!passesSportsStateGuard(question)) return false;
      if (violatesSportsEpisodeCaps(question)) return false;
      return matchesConfiguredDifficulty(question);
    });
    if (fallback) {
      return fallback;
    }

    const variantFallback = questions.find((question) => {
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
      if (!question.scheduleEligible) return false;
      if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
      if (!passesSportsStateGuard(question)) return false;
      if (violatesSportsEpisodeCaps(question)) return false;
      return matchesConfiguredDifficulty(question);
    });
    if (variantFallback) {
      return variantFallback;
    }

    const adjacentDifficultyFallback = questions.find((question) => {
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
      if (!question.scheduleEligible) return false;
      if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
      if (!passesSportsStateGuard(question)) return false;
      if (violatesSportsEpisodeCaps(question)) return false;
      return Math.abs(question.difficultyTarget - config.difficulty) <= 1;
    });
    if (adjacentDifficultyFallback) {
      return adjacentDifficultyFallback;
    }

    const anyUnusedFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        question.scheduleEligible &&
        (!question.variantGroup || !usedVariantGroups.has(question.variantGroup)) &&
        (entitySet.size === 0 || !question.entities.some((entity) => entitySet.has(entity))) &&
        passesSportsStateGuard(question) &&
        !violatesSportsEpisodeCaps(question) &&
        (!avoidTrickQuestion || !question.isTrickQuestion)
    );
    if (anyUnusedFallback) {
      return anyUnusedFallback;
    }

    const repeatedVariantFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        question.scheduleEligible &&
        (entitySet.size === 0 || !question.entities.some((entity) => entitySet.has(entity))) &&
        passesSportsStateGuard(question) &&
        (!avoidTrickQuestion || !question.isTrickQuestion)
    );
    if (repeatedVariantFallback) {
      return repeatedVariantFallback;
    }

    const sportsSafetyFallback = sportsLateSafetyFallback();
    if (sportsSafetyFallback) {
      return sportsSafetyFallback;
    }

    const ultraFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        question.scheduleEligible &&
        passesSportsStateGuard(question) &&
        (!avoidTrickQuestion || !question.isTrickQuestion)
    );
    if (ultraFallback) {
      return ultraFallback;
    }

    const launchEligibleTrickFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        question.scheduleEligible &&
        passesSportsStateGuard(question)
    );
    if (launchEligibleTrickFallback) {
      return launchEligibleTrickFallback;
    }

    const emergencyFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        question.scheduleEligible &&
        (!avoidTrickQuestion || !question.isTrickQuestion) &&
        passesSportsStateGuard(question)
    );
    if (emergencyFallback) {
      return emergencyFallback;
    }

    if (!state.allowHighRisk) {
      return pickQuestionForSlot(
        questions,
        usedIds,
        usedVariantGroups,
        recentEntities,
        config,
        key,
        usedKeysInEpisode,
        { ...state, allowHighRisk: true },
        requireTrickQuestion,
        avoidTrickQuestion
      );
    }

    const genericRejectionSummary = questions
      .filter((question) => !usedIds.has(question.id) && question.scheduleEligible)
      .map((question) => {
        const reasons: string[] = [];
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) reasons.push('variant');
        if (question.difficultyTarget !== config.difficulty) reasons.push(`difficulty:${question.difficultyTarget}`);
        if (!config.buckets.includes(question.editorialBucket ?? 'evergreen')) {
          reasons.push(`bucket:${question.editorialBucket ?? 'evergreen'}`);
        }
        if (requireTrickQuestion && !question.isTrickQuestion) reasons.push('needs-trick');
        if (avoidTrickQuestion && question.isTrickQuestion) reasons.push('avoid-trick');
        if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) reasons.push('entity');
        if (config.minSalienceScore && question.salienceScore < config.minSalienceScore) {
          reasons.push(`salience:${question.salienceScore}`);
        }
        if (config.maxStemLength && question.stem.length > config.maxStemLength) {
          reasons.push(`stem:${question.stem.length}`);
        }
        if (config.allowedLookupRisks && !config.allowedLookupRisks.includes(question.lookupRisk)) {
          reasons.push(`lookup:${question.lookupRisk}`);
        }
        if (config.maxSalienceScore && question.salienceScore > config.maxSalienceScore) {
          reasons.push(`max-salience:${question.salienceScore}`);
        }
        if (
          config.blockedObscurityFlags &&
          question.obscurityFlags.some((flag) => config.blockedObscurityFlags?.includes(flag))
        ) {
          reasons.push('blocked-flag');
        }
        if (!hasSurfaceFormRoom(question)) reasons.push('surface');
        if (!passesSportsStateGuard(question)) reasons.push('state');
        if (violatesSportsEpisodeCaps(question)) reasons.push('caps');
        if (!canUseTaxonomyKey(question)) reasons.push(`taxonomy:${question[key]}`);
        return `${question.subdomain}/${question.promptKind}/${question.editorialSourceFamily}/${question.salienceScore}:${
          reasons.join('|') || 'candidate'
        }:${question.stem}`;
      })
      .slice(0, 16)
      .join(' || ');
    throw new Error(
      `Unable to fill trivia schedule slot for ${state.feed}:${state.slotIndex + 1} ${key}/${config.difficulty} ` +
        `allowHighRisk=${state.allowHighRisk} usedPromptKinds=${[...state.usedPromptKinds].join(',')} ` +
        `usedKeys=${[...usedKeysInEpisode].join(',')} rejections=[${genericRejectionSummary}]`
    );
  }

  const order = key === 'domain' ? (config as MixSlotConfig).domainOrder : (config as SportsSlotConfig).subdomainOrder;
  pool.sort((left, right) => {
    const leftIndex = order.indexOf(left[key]);
    const rightIndex = order.indexOf(right[key]);
    const normalizedLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const normalizedRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    if (normalizedLeftIndex !== normalizedRightIndex) return normalizedLeftIndex - normalizedRightIndex;
    if (state.feed === 'mix') {
      const sourcePenalty = (question: TriviaQuestionRecord) => {
        if (question.editorialSourceFamily === 'mix-authored-culture') return 0;
        if (question.editorialSourceFamily === 'mix-authored-hard') return state.slotIndex >= 8 ? 0 : 2;
        if (question.editorialSourceFamily === 'mix-authored-evergreen') return state.slotIndex >= 8 ? 0 : 1;
        if (question.editorialSourceFamily === 'mix-rewrite-arts') return state.slotIndex >= 8 ? 6 : 4;
        if (question.editorialSourceFamily === 'mix-rewrite-history') return state.slotIndex >= 8 ? 7 : 5;
        if (question.editorialSourceFamily === 'mix-rewrite-science') return state.slotIndex >= 8 ? 7 : 5;
        if (question.editorialSourceFamily === 'mix-rewrite-world') return state.slotIndex >= 8 ? 8 : 6;
        return 3;
      };
      const leftPenalty = sourcePenalty(left);
      const rightPenalty = sourcePenalty(right);
      if (leftPenalty !== rightPenalty) return leftPenalty - rightPenalty;
    }
    if (state.feed === 'sports') {
      const sourcePenalty = (question: TriviaQuestionRecord) => {
        let penalty =
          question.editorialSourceFamily === 'sports-authored-core'
            ? 0
            : question.editorialSourceFamily === 'sports-authored-mainstream-hard'
              ? state.slotIndex >= 4 ? 0 : 1
            : question.editorialSourceFamily === 'sports-authored-hardcore'
              ? state.slotIndex >= 5 ? 0 : 1
              : question.editorialSourceFamily === 'sports-core-bank'
                ? state.slotIndex >= 5 ? 4 : 3
                : question.sourceTier === 'curated'
                  ? 1
                  : question.sourceTier === 'supplemental'
                    ? 2
                    : question.sourceTier === 'legacy'
                      ? 3
                      : 4;
        if (state.slotIndex >= 8 && question.sourceTier !== 'curated') penalty += 1;
        if (state.slotIndex >= 6 && question.legacyFamily !== 'none') penalty += 1;
        return penalty;
      };
      const leftPenalty = sourcePenalty(left);
      const rightPenalty = sourcePenalty(right);
      if (leftPenalty !== rightPenalty) return leftPenalty - rightPenalty;
    }
    if (config.preferredPromptKinds) {
      const leftPromptIndex = config.preferredPromptKinds.indexOf(left.promptKind);
      const rightPromptIndex = config.preferredPromptKinds.indexOf(right.promptKind);
      if (leftPromptIndex !== rightPromptIndex) {
        const normalizedLeft = leftPromptIndex === -1 ? Number.MAX_SAFE_INTEGER : leftPromptIndex;
        const normalizedRight = rightPromptIndex === -1 ? Number.MAX_SAFE_INTEGER : rightPromptIndex;
        if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
      }
    }
    if (config.targetSalienceScore !== undefined) {
      const leftDistance = Math.abs(left.salienceScore - config.targetSalienceScore);
      const rightDistance = Math.abs(right.salienceScore - config.targetSalienceScore);
      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    }
    const leftPromptUsed = state.usedPromptKinds.has(left.promptKind) ? 1 : 0;
    const rightPromptUsed = state.usedPromptKinds.has(right.promptKind) ? 1 : 0;
    if (leftPromptUsed !== rightPromptUsed) return leftPromptUsed - rightPromptUsed;
    const leftLookupPenalty = left.lookupRisk === 'low' ? 0 : left.lookupRisk === 'medium' ? 1 : 2;
    const rightLookupPenalty = right.lookupRisk === 'low' ? 0 : right.lookupRisk === 'medium' ? 1 : 2;
    if (leftLookupPenalty !== rightLookupPenalty) {
      return config.preferHigherLookupRisk
        ? rightLookupPenalty - leftLookupPenalty
        : leftLookupPenalty - rightLookupPenalty;
    }
    if (left.salienceScore !== right.salienceScore) return right.salienceScore - left.salienceScore;
    if (left.stem.length !== right.stem.length) return left.stem.length - right.stem.length;
    return left.id.localeCompare(right.id);
  });
  return pool[0];
}

function pickScheduledSportsCurveball(
  questions: TriviaQuestionRecord[],
  usedIds: Set<string>,
  usedVariantGroups: Set<string>,
  recentEntities: string[],
  config: SportsSlotConfig,
  state: SlotSelectionState
): TriviaQuestionRecord {
  const entitySet = new Set(recentEntities);
  const buildPool = (ignoreRecentEntities: boolean) =>
    questions.filter((question) => {
      if (!question.isTrickQuestion) return false;
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
      if (!question.scheduleEligible) return false;
      if (!ignoreRecentEntities && entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) {
        return false;
      }
      if (question.obscurityFlags.some((flag) => SPORTS_BLOCKED_FLAGS.includes(flag))) return false;
      return true;
    });

  const exactPool = buildPool(false);
  const fallbackPool = exactPool.length > 0 ? exactPool : buildPool(true);
  if (fallbackPool.length === 0) {
    throw new Error(`Unable to schedule sports curveball for slot ${state.slotIndex + 1}`);
  }

  const pool = [
    ...pickCrossDifficultyPreferredPool(
      [
        exactPool,
        fallbackPool,
      ],
      state
    ),
  ];
  pool.sort((left, right) => {
    const leftSubdomainIndex = config.subdomainOrder.indexOf(left.subdomain);
    const rightSubdomainIndex = config.subdomainOrder.indexOf(right.subdomain);
    const normalizedLeftSubdomain = leftSubdomainIndex === -1 ? Number.MAX_SAFE_INTEGER : leftSubdomainIndex;
    const normalizedRightSubdomain = rightSubdomainIndex === -1 ? Number.MAX_SAFE_INTEGER : rightSubdomainIndex;
    if (normalizedLeftSubdomain !== normalizedRightSubdomain) {
      return normalizedLeftSubdomain - normalizedRightSubdomain;
    }

    const leftDifficultyDistance = Math.abs(left.difficultyTarget - 2);
    const rightDifficultyDistance = Math.abs(right.difficultyTarget - 2);
    if (leftDifficultyDistance !== rightDifficultyDistance) {
      return leftDifficultyDistance - rightDifficultyDistance;
    }

    const leftPromptIndex = config.preferredPromptKinds?.indexOf(left.promptKind) ?? Number.MAX_SAFE_INTEGER;
    const rightPromptIndex = config.preferredPromptKinds?.indexOf(right.promptKind) ?? Number.MAX_SAFE_INTEGER;
    if (leftPromptIndex !== rightPromptIndex) {
      return leftPromptIndex - rightPromptIndex;
    }

    const leftLookupPenalty = left.lookupRisk === 'high' ? 0 : left.lookupRisk === 'medium' ? 1 : 2;
    const rightLookupPenalty = right.lookupRisk === 'high' ? 0 : right.lookupRisk === 'medium' ? 1 : 2;
    if (leftLookupPenalty !== rightLookupPenalty) {
      return leftLookupPenalty - rightLookupPenalty;
    }

    if (config.targetSalienceScore !== undefined) {
      const leftDistance = Math.abs(left.salienceScore - config.targetSalienceScore);
      const rightDistance = Math.abs(right.salienceScore - config.targetSalienceScore);
      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
    }

    if (left.salienceScore !== right.salienceScore) return right.salienceScore - left.salienceScore;
    if (left.stem.length !== right.stem.length) return left.stem.length - right.stem.length;
    return left.id.localeCompare(right.id);
  });

  return pool[0];
}

function buildEpisodeSchedule(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  library: TriviaQuestionRecord[],
  constraints: ScheduleBuildConstraints = {}
): {
  episodes: TriviaEpisodeDefinition[];
  audit: TriviaAuditReport['feeds'][TriviaFeed][TriviaDifficulty];
} {
  const usedIds = new Set<string>();
  const usedVariantGroups = new Set<string>();
  const crossDifficultyUsedVariantGroups =
    constraints.crossDifficultyUsedVariantGroups ?? new Set<string>();
  const trickCountByMonth = new Map<string, number>();
  const episodes: TriviaEpisodeDefinition[] = [];
  const recentEntities: string[] = [];
  const recentSurfaceForms: string[] = [];
  const bucketCounts: Partial<Record<TriviaEditorialBucket, number>> = {};
  const difficultyCounts: Record<string, number> = { '1': 0, '2': 0, '3': 0 };
  let lastHighRiskDayOffset = -10;
  let lastTrickDayOffset = -10;
  let refreshableCount = 0;
  let staleQuestionCount = 0;
  let trickQuestionCount = 0;

  for (let offset = 0; offset < TOTAL_DAYS; offset += 1) {
    const date = addDays(getStartDate(), offset);
    const dateKey = getDateKey(date);
    const monthKey = getMonthKey(date);
    const theme = feed === 'mix' ? MIX_WEEKLY_THEMES[offset % 7] : SPORTS_WEEKLY_THEMES[offset % 7];
    const slotConfigs =
      feed === 'mix'
        ? getMixSlotConfigs(offset, difficulty)
        : getSportsSlotConfigs(offset, difficulty);
    const questionIds: string[] = [];
    const difficultyTargets: TriviaDifficultyTarget[] = [];
    const refreshableSlotIds: string[] = [];
    let curveballQuestionId: string | null = null;
    const usedTaxonomyKeys = new Set<string>();
    const usedPromptKinds = new Set<TriviaPromptKind>();
    const usedSurfaceForms = new Set<string>();
    const preferredTrickSlot = feed === 'mix' ? 8 : 2;
    const monthTrickCount = trickCountByMonth.get(monthKey) ?? 0;
    const trickSpacingReady = feed !== 'sports' || offset - lastTrickDayOffset >= SPORTS_CURVEBALL_GAP_DAYS;
    const daysRemaining = getRemainingDaysInMonth(date);
    const desiredTrickCountByNow =
      date.getDate() >= 22
        ? SPORTS_CURVEBALL_TARGET_PER_MONTH
        : date.getDate() >= 14
          ? 2
          : date.getDate() >= 7
            ? 1
            : 0;
    const sportsTargetDays = getSportsCurveballTargetDays(date);
    const sportsTargetDay =
      sportsTargetDays[Math.min(monthTrickCount, Math.max(0, sportsTargetDays.length - 1))] ??
      sportsTargetDays[sportsTargetDays.length - 1] ??
      24;
    const trickDue =
      feed === 'sports'
        ? monthTrickCount < SPORTS_CURVEBALL_TARGET_PER_MONTH &&
          trickSpacingReady &&
          (date.getDate() >= sportsTargetDay ||
            daysRemaining <= (SPORTS_CURVEBALL_TARGET_PER_MONTH - monthTrickCount) * 5)
        : monthTrickCount < 3 &&
          (monthTrickCount < desiredTrickCountByNow || daysRemaining <= (3 - monthTrickCount) * 4);
    let trickUsedToday = false;
    let generalSportsCount = 0;
    let nicheCount = 0;
    let rotationCount = 0;
    let highRiskUsedToday = false;
    const minimumRotationTarget = feed === 'sports' ? 1 : 0;

    slotConfigs.forEach((config, index) => {
      const allowFlexibleTrickQuestion =
        feed === 'sports' && difficulty === 'hard';
      const requireTrickQuestion = trickDue && !trickUsedToday && index === preferredTrickSlot;
      const avoidTrickQuestion = !requireTrickQuestion;
      let question: TriviaQuestionRecord;
      try {
        const selectionState = {
          feed,
          scheduleDifficulty: difficulty,
          slotIndex: index,
          usedPromptKinds,
          usedSurfaceForms,
          recentSurfaceForms,
          generalSportsCount,
          nicheCount,
          rotationCount,
          minimumRotationTarget,
          allowHighRisk: !highRiskUsedToday && offset - lastHighRiskDayOffset >= 3,
          crossDifficultyUsedVariantGroups,
          crossDifficultyBlockedVariantGroups:
            constraints.crossDifficultyBlockedVariantGroupsByDay?.[offset] ?? new Set<string>(),
        };
        if (feed === 'sports' && requireTrickQuestion) {
          question = pickScheduledSportsCurveball(
            library,
            usedIds,
            usedVariantGroups,
            recentEntities,
            config as SportsSlotConfig,
            selectionState
          );
        } else {
          const taxonomyKey: 'domain' | 'subdomain' = feed === 'mix' ? 'domain' : 'subdomain';
          try {
            question = pickQuestionForSlot(
              library,
              usedIds,
              usedVariantGroups,
              recentEntities,
              config,
              taxonomyKey,
              usedTaxonomyKeys,
              selectionState,
              requireTrickQuestion,
              avoidTrickQuestion
            );
          } catch (error) {
            if (!(allowFlexibleTrickQuestion && avoidTrickQuestion)) {
              throw error;
            }
            question = pickQuestionForSlot(
              library,
              usedIds,
              usedVariantGroups,
              recentEntities,
              config,
              taxonomyKey,
              usedTaxonomyKeys,
              selectionState,
              requireTrickQuestion,
              false
            );
          }
        }
      } catch (error) {
        const debugSummary =
          feed === 'sports'
            ? (() => {
                const remaining = library.filter(
                  (candidate) =>
                    !usedIds.has(candidate.id) &&
                    candidate.scheduleEligible
                );
                const bySubdomainDifficulty = new Map<string, number>();
                remaining.forEach((candidate) => {
                  const key = `${candidate.subdomain}/d${candidate.difficultyTarget}`;
                  bySubdomainDifficulty.set(key, (bySubdomainDifficulty.get(key) ?? 0) + 1);
                });
                return ` remainingEligible=${remaining.length} counts=[${[...bySubdomainDifficulty.entries()]
                  .sort((left, right) => left[0].localeCompare(right[0]))
                  .map(([key, value]) => `${key}:${value}`)
                  .join(', ')}]`;
              })()
            : '';
        throw new Error(
          `Failed to schedule ${feed}/${dateKey} slot ${index + 1} after using ${usedIds.size} questions: ${
            error instanceof Error ? error.message : String(error)
          }${debugSummary}`
        );
      }

      usedIds.add(question.id);
      if (question.variantGroup) usedVariantGroups.add(question.variantGroup);
      usedTaxonomyKeys.add(feed === 'mix' ? question.domain : question.subdomain);
      usedPromptKinds.add(question.promptKind);
      const surfaceForm = inferSurfaceFormKey(question);
      usedSurfaceForms.add(surfaceForm);
      recentSurfaceForms.push(surfaceForm);
      while (recentSurfaceForms.length > 24) recentSurfaceForms.shift();
      question.entities.forEach((entity) => recentEntities.push(entity));
      while (recentEntities.length > 36) recentEntities.shift();
      if (question.subdomain === 'general-sports') generalSportsCount += 1;
      if (feed === 'sports' && !SPORTS_CORE_SUBDOMAINS.has(question.subdomain)) rotationCount += 1;
      if (question.obscurityFlags.some((flag) => SPORTS_NICHE_FLAGS.includes(flag))) nicheCount += 1;
      if (question.lookupRisk === 'high') {
        highRiskUsedToday = true;
        lastHighRiskDayOffset = offset;
      }

      questionIds.push(question.id);
      difficultyTargets.push(config.difficulty);
      difficultyCounts[String(config.difficulty)] += 1;
      bucketCounts[question.editorialBucket ?? 'evergreen'] =
        (bucketCounts[question.editorialBucket ?? 'evergreen'] ?? 0) + 1;

      if (config.refreshable) {
        refreshableSlotIds.push(question.id);
        refreshableCount += 1;
      }
      if (new Date(`${question.freshUntil}T12:00:00`).getTime() < date.getTime()) {
        staleQuestionCount += 1;
      }
      const countsAsScheduledCurveball =
        feed === 'sports'
          ? requireTrickQuestion && question.isTrickQuestion
          : question.isTrickQuestion && !trickUsedToday;
      if (countsAsScheduledCurveball) {
        trickCountByMonth.set(monthKey, monthTrickCount + 1);
        trickUsedToday = true;
        trickQuestionCount += 1;
        lastTrickDayOffset = offset;
        curveballQuestionId = question.id;
      }
    });

    const episode: TriviaEpisodeDefinition = {
      date: dateKey,
      feed,
      difficulty,
      questionIds,
      curveballQuestionId,
      difficultyTargets,
      finalStretchStartsAt: feed === 'mix' ? 9 : 6,
      themeTag: theme.tag,
      refreshableSlotIds,
      publishedAt: ACCESS_DATE,
      version: VERSION,
    };
    const episodeIssues = validateEpisodeDefinition(episode);
    if (episodeIssues.length > 0) {
      throw new Error(`Episode ${feed}/${dateKey} failed validation: ${episodeIssues.join(', ')}`);
    }
    episodes.push(episode);
  }

  const rollingQuotaViolations = 0;
  return {
    episodes,
    audit: {
      feed,
      difficulty,
      libraryCount: library.length,
      poolScheduledCount: usedIds.size,
      poolReserveCount: library.length - usedIds.size,
      reserveHeadroomTarget: feed === 'mix' ? MIX_RESERVE_HEADROOM_TARGET : SPORTS_RESERVE_HEADROOM_TARGET,
      reserveShortfall: Math.max(
        0,
        (feed === 'mix' ? MIX_RESERVE_HEADROOM_TARGET : SPORTS_RESERVE_HEADROOM_TARGET) -
          (library.length - usedIds.size)
      ),
      scheduledCount: usedIds.size,
      reserveCount: library.length - usedIds.size,
      refreshableCount,
      byBucket: bucketCounts,
      byDifficulty: difficultyCounts,
      rollingQuotaViolations,
      staleQuestionCount,
      repeatedVariantGroups: usedIds.size - usedVariantGroups.size,
      variantReuseCount: usedIds.size - usedVariantGroups.size,
      coreFactReuseViolations: 0,
      crossDifficultyCoreFactOverlap: 0,
      crossDifficultyVariantOverlap: 0,
      trickQuestionCount,
      scheduledOffToneCount: 0,
      scheduledOffToneExamples: [],
      lateSlotGeneralSportsCount: 0,
      curveballSpacingViolations: 0,
      first90BlockedPatternCount: 0,
      blockedPatternExamples: [],
      blockingTasteTagCount: 0,
      blockingTasteTagExamples: [],
      tasteTagCounts: {},
      scheduleEligibleShare: 0,
      scheduledBlockedSourceFamilies: {},
      first28SampleStems: [],
      sourceFamilyDistribution: {},
      authoredFamilyShare: 0,
      curveballCoverageByMonth: {},
      topRepeatedGroups: [],
      lateSlotLegibilityScore: 0,
      agentFrictionBySlot: [],
      coreSubdomainShare: 0,
      observedCorrectRate: null,
      observedTimeoutRate: null,
      observedShieldRate: null,
      blendedCorrectRate: 0,
      telemetrySampleSize: 0,
      telemetryConfidence: 'agent-only',
      replacementCount: 0,
      replacementReasons: [],
      slotGroupEvidence: {},
      questionEvidence: [],
      councilFlags: [],
      playerGatePass: false,
      playerGateFailures: [],
      playerAgentSummaries: [],
      launchReady: false,
    },
  };
}

function randomFromKey(key: string): number {
  return mulberry32(hashString(key))();
}

function buildQuestionMap(library: TriviaQuestionRecord[]) {
  return new Map(library.map((question) => [question.id, question]));
}

function isAuthoredSourceFamily(family: string): boolean {
  return (
    family.startsWith('mix-authored-') ||
    family.startsWith('sports-authored-')
  );
}

function isBlockingTasteTag(
  feed: TriviaFeed,
  question: TriviaQuestionRecord,
  tag: TriviaTasteTag
): boolean {
  if (feed === 'mix') {
    return [
      'count-trivia',
      'year-trivia',
      'according-to',
      'line-complete',
      'pilot-episode',
      'actor-director-credit',
      'archive-media',
      'definition-low-payoff',
      'statement-elimination',
      'fragment-stem',
      'long-setup',
    ].includes(tag);
  }

  if (tag === 'nickname-only') {
    return !(question.isTrickQuestion && question.curveballKind === 'famous-nickname' && question.salienceScore >= 90);
  }

  if (tag === 'count-trivia') {
    if (
      question.difficultyPool === 'hard' &&
      question.salienceScore >= 84 &&
      ['rule', 'term', 'event', 'achievement', 'sport-id'].includes(question.promptKind)
    ) {
      return false;
    }
    return true;
  }

  if (tag === 'legacy-sports-history') {
    if (question.editorialSourceFamily === 'sports-core-bank') return true;
    if (
      question.difficultyPool === 'hard' &&
      question.salienceScore >= 84 &&
      ['rule', 'term', 'event', 'achievement', 'sport-id'].includes(question.promptKind) &&
      !SPORTS_ARCHIVE_HARD_REJECT_REGEX.test(question.stem) &&
      !SPORTS_MAINSTREAM_CORE_REJECT_REGEX.test(question.stem) &&
      !/\b(?:what|which|in what) year\b|\bfounded\b|\bwinning pitcher\b/i.test(question.stem)
    ) {
      return false;
    }
    return true;
  }

  return ['year-trivia', 'according-to', 'fragment-stem', 'long-setup'].includes(
    tag
  );
}

function buildTasteTagCounts(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): {
  counts: Partial<Record<TriviaTasteTag, number>>;
  blockingCount: number;
  blockingExamples: string[];
} {
  const counts: Partial<Record<TriviaTasteTag, number>> = {};
  let blockingCount = 0;
  const blockingExamples: string[] = [];

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      question.tasteTags.forEach((tag) => {
        counts[tag] = (counts[tag] ?? 0) + 1;
        if (isBlockingTasteTag(feed, question, tag)) {
          blockingCount += 1;
          if (blockingExamples.length < 18) {
            blockingExamples.push(`${episode.date} :: ${question.editorialSourceFamily} :: ${question.stem}`);
          }
        }
      });
    });
  });

  return { counts, blockingCount, blockingExamples };
}

function buildSourceFamilyDistribution(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): Record<string, number> {
  const counts = new Map<string, number>();
  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      counts.set(
        question.editorialSourceFamily,
        (counts.get(question.editorialSourceFamily) ?? 0) + 1
      );
    });
  });

  return Object.fromEntries(
    [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  );
}

function computeAuthoredFamilyShare(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  let total = 0;
  let authored = 0;

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      total += 1;
      if (isAuthoredSourceFamily(question.editorialSourceFamily)) authored += 1;
    });
  });

  if (total === 0) return 0;
  return Number((authored / total).toFixed(3));
}

function computeScheduleEligibleShare(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  let total = 0;
  let scheduleEligible = 0;

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      total += 1;
      if (question.scheduleEligible) scheduleEligible += 1;
    });
  });

  if (total === 0) return 0;
  return Number((scheduleEligible / total).toFixed(3));
}

function buildScheduledBlockedSourceFamilies(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): Record<string, number> {
  const counts = new Map<string, number>();

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      if (isAllowedSourceFamilyForSchedule(feed, difficulty, question.editorialSourceFamily)) {
        return;
      }
      counts.set(question.editorialSourceFamily, (counts.get(question.editorialSourceFamily) ?? 0) + 1);
    });
  });

  return Object.fromEntries(
    [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  );
}

function collectFirst28SampleStems(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  limit = 24
): string[] {
  const samples: string[] = [];
  episodes.slice(0, 28).forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      if (samples.length >= limit) return;
      const question = questionMap.get(questionId);
      if (!question) return;
      samples.push(`${episode.date} :: ${question.editorialSourceFamily} :: ${question.stem}`);
    });
  });
  return samples;
}

function getQuestionVariantGroup(
  question: Pick<TriviaQuestionRecord, 'id' | 'variantGroup' | 'coreFactId'>
): string {
  return question.variantGroup ?? question.coreFactId ?? question.id;
}

function pickCrossDifficultyPreferredPool(
  buckets: TriviaQuestionRecord[][],
  state: Pick<SlotSelectionState, 'crossDifficultyBlockedVariantGroups' | 'crossDifficultyUsedVariantGroups'>
): TriviaQuestionRecord[] {
  const firstNonEmpty = (candidateBuckets: TriviaQuestionRecord[][]) =>
    candidateBuckets.find((bucket) => bucket.length > 0) ?? [];

  const freshBuckets = buckets.map((bucket) =>
    bucket.filter(
      (question) => !state.crossDifficultyUsedVariantGroups.has(getQuestionVariantGroup(question))
    )
  );
  const freshPool = firstNonEmpty(freshBuckets);
  if (freshPool.length > 0) return freshPool;

  const cooledDownBuckets = buckets.map((bucket) =>
    bucket.filter(
      (question) => !state.crossDifficultyBlockedVariantGroups.has(getQuestionVariantGroup(question))
    )
  );
  const cooledDownPool = firstNonEmpty(cooledDownBuckets);
  if (cooledDownPool.length > 0) return cooledDownPool;

  return firstNonEmpty(buckets);
}

function buildVariantGroupsByDay(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): Set<string>[] {
  return episodes.map((episode) => {
    const groups = new Set<string>();
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      groups.add(getQuestionVariantGroup(question));
    });
    return groups;
  });
}

function buildScheduledVariantGroupSet(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): Set<string> {
  const groups = new Set<string>();
  buildVariantGroupsByDay(episodes, questionMap).forEach((dayGroups) => {
    dayGroups.forEach((group) => groups.add(group));
  });
  return groups;
}

function buildCrossDifficultyBlockedVariantGroupsByDay(
  referenceEpisodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  cooldownDays: number
): Set<string>[] {
  const byDay = buildVariantGroupsByDay(referenceEpisodes, questionMap);
  return byDay.map((_, dayIndex) => {
    const blocked = new Set<string>();
    for (
      let otherIndex = Math.max(0, dayIndex - cooldownDays);
      otherIndex <= Math.min(byDay.length - 1, dayIndex + cooldownDays);
      otherIndex += 1
    ) {
      byDay[otherIndex]?.forEach((group) => blocked.add(group));
    }
    return blocked;
  });
}

type TriviaTelemetryMaps = {
  questionAggregates: Map<string, TriviaTelemetryQuestionAggregate>;
  slotAggregates: Map<string, TriviaTelemetrySlotAggregate>;
};

type SimulatedQuestionStats = {
  date: string;
  slot: number;
  questionId: string;
  question: TriviaQuestionRecord;
  total: number;
  correct: number;
  timeouts: number;
  shields: number;
  totalAnswerMilliseconds: number;
  replacementReason: string | null;
};

type ReplacementLogEntry = {
  date: string;
  slot: number;
  questionId: string;
  replacementQuestionId: string;
  reason: string;
};

function logBuildStage(message: string) {
  if (process.env.TRIVIA_DEBUG_STAGE === '1') {
    console.error(`[trivia-build] ${message}`);
  }
}

function getEmptyTelemetrySnapshot(): TriviaTelemetrySnapshot {
  return {
    generatedAt: ACCESS_DATE,
    questions: [],
    slots: [],
  };
}

async function loadTriviaTelemetrySnapshot(): Promise<TriviaTelemetrySnapshot> {
  try {
    const raw = await fs.readFile(TELEMETRY_SNAPSHOT_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<TriviaTelemetrySnapshot>;
    return {
      generatedAt: parsed.generatedAt ?? ACCESS_DATE,
      questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      slots: Array.isArray(parsed.slots) ? parsed.slots : [],
    };
  } catch {
    return getEmptyTelemetrySnapshot();
  }
}

function buildQuestionTelemetryKey(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  questionId: string
) {
  return `${feed}:${difficulty}:${questionId}`;
}

function buildSlotTelemetryKey(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  slot: number
) {
  return `${feed}:${difficulty}:${slot}`;
}

function buildTelemetryMaps(snapshot: TriviaTelemetrySnapshot): TriviaTelemetryMaps {
  return {
    questionAggregates: new Map(
      snapshot.questions.map((aggregate) => [
        buildQuestionTelemetryKey(aggregate.feed, aggregate.difficulty, aggregate.questionId),
        aggregate,
      ])
    ),
    slotAggregates: new Map(
      snapshot.slots.map((aggregate) => [
        buildSlotTelemetryKey(aggregate.feed, aggregate.difficulty, aggregate.slot),
        aggregate,
      ])
    ),
  };
}

function calculateLateClockStress(
  histogram: Partial<Record<'lt-4s' | 'lt-8s' | 'lt-12s' | 'lt-15s' | 'timeout', number>>
): number | null {
  const total = Object.values(histogram).reduce((sum, value) => sum + (value ?? 0), 0);
  if (total <= 0) return null;
  const underFour = histogram['lt-4s'] ?? 0;
  const underEight = histogram['lt-8s'] ?? 0;
  const underTwelve = histogram['lt-12s'] ?? 0;
  const underFifteen = histogram['lt-15s'] ?? 0;
  const timeout = histogram.timeout ?? 0;
  const late = underTwelve + underFifteen + timeout;
  const moderatelyLate = underEight + underTwelve + underFifteen + timeout;
  return Number((((late * 1.1 + moderatelyLate * 0.35 - underFour * 0.2) / total)).toFixed(3));
}

function buildCalibrationEvidence(params: {
  agentCorrectRate: number;
  agentTimeoutRate: number;
  agentShieldRate: number;
  agentMeanAnswerMilliseconds: number | null;
  telemetryAggregate?: {
    plays: number;
    correctCount: number;
    timeoutCount: number;
    shieldSaveCount: number;
    totalAnswerMilliseconds: number;
    timeBucketHistogram: Partial<Record<'lt-4s' | 'lt-8s' | 'lt-12s' | 'lt-15s' | 'timeout', number>>;
  };
}): TriviaCalibrationEvidence {
  const observedCorrectRate =
    params.telemetryAggregate && params.telemetryAggregate.plays > 0
      ? Number((params.telemetryAggregate.correctCount / params.telemetryAggregate.plays).toFixed(3))
      : null;
  const observedTimeoutRate =
    params.telemetryAggregate && params.telemetryAggregate.plays > 0
      ? Number((params.telemetryAggregate.timeoutCount / params.telemetryAggregate.plays).toFixed(3))
      : null;
  const observedShieldRate =
    params.telemetryAggregate && params.telemetryAggregate.plays > 0
      ? Number((params.telemetryAggregate.shieldSaveCount / params.telemetryAggregate.plays).toFixed(3))
      : null;
  const meanAnswerMilliseconds =
    params.telemetryAggregate && params.telemetryAggregate.plays > 0
      ? Number((params.telemetryAggregate.totalAnswerMilliseconds / params.telemetryAggregate.plays).toFixed(1))
      : params.agentMeanAnswerMilliseconds;
  const telemetrySampleSize = params.telemetryAggregate?.plays ?? 0;
  const weights = getTriviaTelemetryBlendWeights(telemetrySampleSize);
  const blendedCorrectRate =
    weights.telemetryWeight > 0 && observedCorrectRate !== null
      ? Number(
          (
            params.agentCorrectRate * weights.agentWeight +
            observedCorrectRate * weights.telemetryWeight
          ).toFixed(3)
        )
      : Number(params.agentCorrectRate.toFixed(3));
  const blendedTimeoutRate =
    weights.telemetryWeight > 0 && observedTimeoutRate !== null
      ? Number(
          (
            params.agentTimeoutRate * weights.agentWeight +
            observedTimeoutRate * weights.telemetryWeight
          ).toFixed(3)
        )
      : Number(params.agentTimeoutRate.toFixed(3));
  const blendedShieldRate =
    weights.telemetryWeight > 0 && observedShieldRate !== null
      ? Number(
          (
            params.agentShieldRate * weights.agentWeight +
            observedShieldRate * weights.telemetryWeight
          ).toFixed(3)
        )
      : Number(params.agentShieldRate.toFixed(3));

  return {
    agentCorrectRate: Number(params.agentCorrectRate.toFixed(3)),
    observedCorrectRate,
    blendedCorrectRate,
    agentTimeoutRate: Number(params.agentTimeoutRate.toFixed(3)),
    observedTimeoutRate,
    blendedTimeoutRate,
    agentShieldRate: Number(params.agentShieldRate.toFixed(3)),
    observedShieldRate,
    blendedShieldRate,
    meanAnswerMilliseconds,
    lateClockStress: calculateLateClockStress(params.telemetryAggregate?.timeBucketHistogram ?? {}),
    telemetrySampleSize,
    telemetryConfidence: weights.confidence,
  };
}

function getGroupLabel(feed: TriviaFeed, slot: number) {
  if (feed === 'mix') {
    if (slot <= 3) return 'q1-q3';
    if (slot <= 6) return 'q4-q6';
    if (slot <= 9) return 'q7-q9';
    return 'q10-q12';
  }
  if (slot <= 2) return 'q1-q2';
  if (slot <= 5) return 'q3-q5';
  if (slot === 6) return 'q6';
  return 'q7-q9';
}

function buildSlotGroupEvidence(
  feed: TriviaFeed,
  slotSummaries: TriviaPlayerSlotSummary[]
): Record<string, TriviaCalibrationEvidence> {
  const groups = new Map<
    string,
    {
      agentCorrectRate: number[];
      observedCorrectRate: number[];
      blendedCorrectRate: number[];
      agentTimeoutRate: number[];
      observedTimeoutRate: number[];
      blendedTimeoutRate: number[];
      agentShieldRate: number[];
      observedShieldRate: number[];
      blendedShieldRate: number[];
      meanAnswerMilliseconds: number[];
      lateClockStress: number[];
      telemetrySampleSize: number;
      confidenceRanks: number[];
    }
  >();

  const confidenceRank = { 'agent-only': 0, emerging: 1, trusted: 2 } as const;
  const confidenceByRank = ['agent-only', 'emerging', 'trusted'] as const;

  slotSummaries.forEach((summary) => {
    const label = getGroupLabel(feed, summary.slot);
    const entry = groups.get(label) ?? {
      agentCorrectRate: [],
      observedCorrectRate: [],
      blendedCorrectRate: [],
      agentTimeoutRate: [],
      observedTimeoutRate: [],
      blendedTimeoutRate: [],
      agentShieldRate: [],
      observedShieldRate: [],
      blendedShieldRate: [],
      meanAnswerMilliseconds: [],
      lateClockStress: [],
      telemetrySampleSize: 0,
      confidenceRanks: [],
    };
    entry.agentCorrectRate.push(summary.agentCorrectRate);
    if (summary.observedCorrectRate != null) entry.observedCorrectRate.push(summary.observedCorrectRate);
    entry.blendedCorrectRate.push(summary.blendedCorrectRate);
    entry.agentTimeoutRate.push(summary.agentTimeoutRate);
    if (summary.observedTimeoutRate != null) entry.observedTimeoutRate.push(summary.observedTimeoutRate);
    entry.blendedTimeoutRate.push(summary.blendedTimeoutRate);
    entry.agentShieldRate.push(summary.agentShieldRate);
    if (summary.observedShieldRate != null) entry.observedShieldRate.push(summary.observedShieldRate);
    entry.blendedShieldRate.push(summary.blendedShieldRate);
    if (summary.meanAnswerMilliseconds != null) entry.meanAnswerMilliseconds.push(summary.meanAnswerMilliseconds);
    if (summary.lateClockStress != null) entry.lateClockStress.push(summary.lateClockStress);
    entry.telemetrySampleSize += summary.telemetrySampleSize;
    entry.confidenceRanks.push(confidenceRank[summary.telemetryConfidence]);
    groups.set(label, entry);
  });

  const average = (values: number[]) =>
    values.length > 0
      ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3))
      : null;

  return Object.fromEntries(
    [...groups.entries()].map(([label, entry]) => [
      label,
      {
        agentCorrectRate: average(entry.agentCorrectRate) ?? 0,
        observedCorrectRate: average(entry.observedCorrectRate),
        blendedCorrectRate: average(entry.blendedCorrectRate) ?? 0,
        agentTimeoutRate: average(entry.agentTimeoutRate) ?? 0,
        observedTimeoutRate: average(entry.observedTimeoutRate),
        blendedTimeoutRate: average(entry.blendedTimeoutRate) ?? 0,
        agentShieldRate: average(entry.agentShieldRate) ?? 0,
        observedShieldRate: average(entry.observedShieldRate),
        blendedShieldRate: average(entry.blendedShieldRate) ?? 0,
        meanAnswerMilliseconds: average(entry.meanAnswerMilliseconds),
        lateClockStress: average(entry.lateClockStress),
        telemetrySampleSize: entry.telemetrySampleSize,
        telemetryConfidence:
          confidenceByRank[Math.max(...entry.confidenceRanks, 0)] ?? 'agent-only',
      } satisfies TriviaCalibrationEvidence,
    ])
  );
}

const GROUP_TARGET_RANGES: Record<
  TriviaFeed,
  Record<TriviaDifficulty, Record<string, { min: number; max: number }>>
> = {
  mix: {
    easy: {
      'q1-q3': { min: 0.85, max: 0.93 },
      'q4-q6': { min: 0.71, max: 0.82 },
      'q7-q9': { min: 0.47, max: 0.57 },
      'q10-q12': { min: 0.42, max: 0.53 },
    },
    hard: {
      'q1-q3': { min: 0.6, max: 0.82 },
      'q4-q6': { min: 0.35, max: 0.62 },
      'q7-q9': { min: 0.2, max: 0.37 },
      'q10-q12': { min: 0.08, max: 0.22 },
    },
  },
  sports: {
    easy: {
      'q1-q2': { min: 0.78, max: 0.86 },
      'q3-q5': { min: 0.55, max: 0.66 },
      q6: { min: 0.36, max: 0.46 },
      'q7-q9': { min: 0.22, max: 0.32 },
    },
    hard: {
      'q1-q2': { min: 0.5, max: 0.77 },
      'q3-q5': { min: 0.31, max: 0.45 },
      q6: { min: 0.1, max: 0.33 },
      'q7-q9': { min: 0.03, max: 0.13 },
    },
  },
};

function getGroupTargetRange(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  label: string
) {
  return GROUP_TARGET_RANGES[feed][difficulty][label];
}

function getAgentConfidence(
  agent: TriviaPlayerAgentProfile,
  feed: TriviaFeed,
  question: TriviaQuestionRecord,
  isScheduledCurveball = false
): number {
  const bucket = question.editorialBucket ?? 'evergreen';
  let confidence = agent.baseAccuracyByDifficulty[question.difficultyTarget];
  confidence += agent.feedAdjustments[feed] ?? 0;
  confidence += agent.domainAdjustments?.[question.domain] ?? 0;
  confidence += agent.subdomainAdjustments?.[question.subdomain] ?? 0;
  confidence += agent.lookupRiskAdjustments?.[question.lookupRisk] ?? 0;
  confidence += agent.editorialBucketAdjustments?.[bucket] ?? 0;
  confidence += (question.salienceScore - 75) / 180;
  if (feed === 'sports') confidence -= 0.02;
  if (question.obscurityFlags.includes('roster-deep-cut')) confidence -= 0.035;
  if (question.obscurityFlags.includes('surname-inference')) confidence -= 0.045;
  if (question.obscurityFlags.includes('stat-only')) confidence -= 0.03;
  if (question.obscurityFlags.includes('vague-stem')) confidence -= 0.04;
  if (feed === 'sports') {
    if (question.promptKind === 'player') confidence -= question.difficultyTarget === 3 ? 0.03 : 0.015;
    if (question.promptKind === 'achievement') confidence -= question.difficultyTarget === 3 ? 0.02 : 0.01;
    if (question.promptKind === 'term' || question.promptKind === 'rule') {
      confidence -= question.difficultyTarget === 3 ? 0.02 : 0.01;
    }
    if (question.promptKind === 'record') confidence -= 0.04;
    if (question.promptKind === 'venue') confidence -= 0.03;
    if (question.promptKind === 'sport-id') confidence -= 0.035;
    if (question.promptKind === 'team') confidence -= 0.01;
  }
  if (isScheduledCurveball) {
    confidence += agent.archetype === 'analytical-reasoner' ? 0.03 : -0.02;
  }
  if (question.stem.length > 135) confidence -= 0.03;
  return clamp(confidence, 0.16, 0.96);
}

function getAgentTimeoutRisk(
  agent: TriviaPlayerAgentProfile,
  feed: TriviaFeed,
  question: TriviaQuestionRecord,
  isScheduledCurveball = false
): number {
  let timeoutRisk = agent.baseTimeoutByDifficulty[question.difficultyTarget];
  if (!agent.favoredFeeds.includes(feed)) timeoutRisk += 0.02;
  if (feed === 'sports') timeoutRisk += 0.005;
  if (question.lookupRisk === 'medium') timeoutRisk += 0.015;
  if (question.lookupRisk === 'high') timeoutRisk += 0.04;
  timeoutRisk -= Math.max(0, question.salienceScore - 78) / 500;
  if (question.stem.length > 135) timeoutRisk += 0.025;
  if (question.obscurityFlags.includes('timer-friction')) timeoutRisk += 0.02;
  if (question.obscurityFlags.includes('vague-stem')) timeoutRisk += 0.015;
  if (
    feed === 'sports' &&
    question.difficultyTarget === 3 &&
    ['player', 'record', 'term', 'rule'].includes(question.promptKind)
  ) {
    timeoutRisk += 0.004;
  }
  if (isScheduledCurveball) timeoutRisk += 0.015;
  return clamp(timeoutRisk, 0.01, 0.28);
}

function buildPlayerDayNote(
  agent: TriviaPlayerAgentProfile,
  feed: TriviaFeed,
  date: string,
  correctCount: number,
  totalQuestions: number,
  timeoutCount: number,
  shieldUsed: boolean,
  trickCount: number
): string {
  const feedLabel = feed === 'mix' ? 'Mix' : 'Sports';
  if (timeoutCount >= 2) {
    return `${agent.displayName} hit timer pressure on ${feedLabel} for ${date}, suggesting the day needs shorter stems or less lookup drag.`;
  }
  if (shieldUsed && correctCount < totalQuestions - 1) {
    return `${agent.displayName} needed the shield to stay in rhythm on ${feedLabel} for ${date}.`;
  }
  if (trickCount > 0 && correctCount >= totalQuestions - 2) {
    return `${agent.displayName} enjoyed one of the monthly curveballs on ${feedLabel} for ${date} without it feeling dirty.`;
  }
  if (correctCount <= Math.floor(totalQuestions / 2)) {
    return `${agent.displayName} found ${feedLabel} rough on ${date}; the miss pattern suggests the day may be too sharp for this archetype.`;
  }
  return `${agent.displayName} found ${feedLabel} shareable on ${date}, with clean pacing and solid reveal value.`;
}

function simulateCalibrationFeed(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  telemetryMaps: TriviaTelemetryMaps,
  replacementLogMap: Map<string, string>,
  sampleDays = TRIVIA_PLAYER_CALIBRATION_DAYS
): TriviaPlayerCalibrationFeedReport {
  const sampleEpisodes = episodes.slice(0, sampleDays);
  const agentSummaries: TriviaPlayerAgentSummary[] = [];
  const daySamples: TriviaPlayerDaySample[] = [];
  const slotStats = new Map<
    number,
    {
      total: number;
      correct: number;
      timeouts: number;
      shields: number;
      totalAnswerMilliseconds: number;
    }
  >();
  const questionStats = new Map<string, SimulatedQuestionStats>();

  TRIVIA_SOLVE_AGENTS.forEach((agent) => {
    let totalCorrect = 0;
    let totalScore = 0;
    let shieldDays = 0;
    let totalTimeouts = 0;
    let cleanRunDays = 0;
    let highLookupMisses = 0;
    let trickMisses = 0;
    let toughestDay: TriviaPlayerDaySample | null = null;

    sampleEpisodes.forEach((episode) => {
      const scheduledCurveballIds = getEpisodeCurveballQuestionIds(feed, episode, questionMap);
      let shieldAvailable = true;
      let shieldQuestionsUsed = 0;
      let shieldUsed = false;
      let correctCount = 0;
      let score = 0;
      let timeoutCount = 0;
      let trickCount = 0;

      episode.questionIds.forEach((questionId, questionIndex) => {
        const question = questionMap.get(questionId);
        if (!question) {
          throw new Error(`Missing question ${questionId} while simulating ${feed}/${episode.date}`);
        }
        const slotStat = slotStats.get(questionIndex + 1) ?? {
          total: 0,
          correct: 0,
          timeouts: 0,
          shields: 0,
          totalAnswerMilliseconds: 0,
        };
        slotStat.total += 1;
        slotStats.set(questionIndex + 1, slotStat);
        const questionKey = `${episode.date}:${questionIndex + 1}:${question.id}`;
        const questionStat = questionStats.get(questionKey) ?? {
          date: episode.date,
          slot: questionIndex + 1,
          questionId: question.id,
          question,
          total: 0,
          correct: 0,
          timeouts: 0,
          shields: 0,
          totalAnswerMilliseconds: 0,
          replacementReason: replacementLogMap.get(questionKey) ?? null,
        };
        questionStat.total += 1;
        questionStats.set(questionKey, questionStat);

        const isScheduledCurveball = scheduledCurveballIds.has(question.id);
        let confidence = getAgentConfidence(agent, feed, question, isScheduledCurveball);
        let timeoutRisk = getAgentTimeoutRisk(agent, feed, question, isScheduledCurveball);
        if (feed === 'mix') {
          confidence = clamp(
            confidence - (MIX_SLOT_CONFIDENCE_ADJUSTMENTS[difficulty][questionIndex] ?? 0),
            0.08,
            0.96
          );
          timeoutRisk = clamp(
            timeoutRisk + (MIX_SLOT_TIMEOUT_ADJUSTMENTS[difficulty][questionIndex] ?? 0),
            0.01,
            0.38
          );
        }
        if (feed === 'sports') {
          confidence = clamp(
            confidence - (SPORTS_SLOT_CONFIDENCE_ADJUSTMENTS[difficulty][questionIndex] ?? 0),
            0.08,
            0.96
          );
          timeoutRisk = clamp(
            timeoutRisk + (SPORTS_SLOT_TIMEOUT_ADJUSTMENTS[difficulty][questionIndex] ?? 0),
            0.01,
            0.4
          );
        }
        const timeoutRoll = randomFromKey(`${agent.id}:${feed}:${episode.date}:${question.id}:timeout`);
        const didTimeout = timeoutRoll < timeoutRisk;
        const correctRoll = randomFromKey(`${agent.id}:${feed}:${episode.date}:${question.id}:correct`);
        const didCorrect = !didTimeout && correctRoll < confidence;
        const speedRoll = randomFromKey(`${agent.id}:${feed}:${episode.date}:${question.id}:speed`);
        const answerMilliseconds = didTimeout
          ? TIMER_SECONDS * 1000
          : Math.max(
              1200,
              Math.round(
                TIMER_SECONDS *
                  1000 *
                  clamp(
                    (didCorrect ? 0.76 : 0.86) -
                      confidence * (didCorrect ? 0.42 : 0.24) +
                      speedRoll * 0.22 +
                      timeoutRisk * 0.28,
                    0.16,
                    0.96
                  )
              )
            );
        const inFinalStretch = questionIndex >= episode.questionIds.length - 3;
        const inBackHalf = questionIndex >= Math.floor(episode.questionIds.length / 2);
        const runCleanBeforeQuestion = correctCount === questionIndex && !shieldUsed;
        const shieldConfidenceGate = agent.shieldConfidenceFloor + (feed === 'sports' ? 0.08 : 0.03);
        const wouldArmShield =
          canArmShield(shieldAvailable, shieldQuestionsUsed) &&
          ((runCleanBeforeQuestion &&
            inBackHalf &&
            confidence >= shieldConfidenceGate &&
            (isScheduledCurveball ||
              (inFinalStretch && question.salienceScore >= (feed === 'sports' ? 87 : 84)) ||
              (feed !== 'sports' && question.salienceScore >= 84))) ||
            (didTimeout && inFinalStretch && confidence >= shieldConfidenceGate + (feed === 'sports' ? 0.04 : 0.02)) ||
            (isScheduledCurveball &&
              inBackHalf &&
              confidence >= shieldConfidenceGate &&
              question.salienceScore >= 82) ||
            (inFinalStretch &&
              question.difficultyTarget === 3 &&
              confidence >= shieldConfidenceGate + (feed === 'sports' ? 0.05 : 0.03) &&
              question.salienceScore >= (feed === 'sports' ? 89 : 86)));

        if (isScheduledCurveball) trickCount += 1;

        if (didTimeout) {
          timeoutCount += 1;
          slotStat.timeouts += 1;
          questionStat.timeouts += 1;
        }
        slotStat.totalAnswerMilliseconds += answerMilliseconds;
        questionStat.totalAnswerMilliseconds += answerMilliseconds;

        if (didCorrect) {
          if (wouldArmShield) {
            const shieldResolution = resolveShieldAfterQuestion({
              shieldArmed: true,
              shieldAvailable,
              shieldQuestionsUsed,
              actualCorrect: true,
            });
            shieldAvailable = shieldResolution.shieldAvailable;
            shieldQuestionsUsed = shieldResolution.shieldQuestionsUsed;
          }
          correctCount += 1;
          slotStat.correct += 1;
          questionStat.correct += 1;
          const timeRemaining = Math.max(1, Math.round((TIMER_SECONDS * 1000 - answerMilliseconds) / 1000));
          score += BASE_POINTS + Math.max(0, Math.round((timeRemaining / TIMER_SECONDS) * SPEED_BONUS));
        } else if (wouldArmShield) {
          const shieldResolution = resolveShieldAfterQuestion({
            shieldArmed: true,
            shieldAvailable,
            shieldQuestionsUsed,
            actualCorrect: false,
          });
          shieldAvailable = shieldResolution.shieldAvailable;
          shieldQuestionsUsed = shieldResolution.shieldQuestionsUsed;
          shieldUsed = true;
          slotStat.shields += 1;
          questionStat.shields += 1;
          score += SHIELD_POINTS;
        } else {
          if (isScheduledCurveball) trickMisses += 1;
          if (question.lookupRisk === 'high') highLookupMisses += 1;
        }
      });

      totalCorrect += correctCount;
      totalScore += score;
      totalTimeouts += timeoutCount;
      if (shieldUsed) shieldDays += 1;
      if (!shieldUsed && correctCount === episode.questionIds.length) cleanRunDays += 1;

      const note = buildPlayerDayNote(
        agent,
        feed,
        episode.date,
        correctCount,
        episode.questionIds.length,
        timeoutCount,
        shieldUsed,
        trickCount
      );
      const daySample: TriviaPlayerDaySample = {
        date: episode.date,
        agentId: agent.id,
        displayName: agent.displayName,
        correctCount,
        timeoutCount,
        shieldUsed,
        note,
      };

      if (
        !toughestDay ||
        correctCount < toughestDay.correctCount ||
        (correctCount === toughestDay.correctCount && timeoutCount > toughestDay.timeoutCount)
      ) {
        toughestDay = daySample;
      }
    });

    const sampleDays = sampleEpisodes.length;
    const averageCorrect = Number((totalCorrect / sampleDays).toFixed(2));
    const averageScore = Number((totalScore / sampleDays).toFixed(1));
    const shieldUseRate = Number((shieldDays / sampleDays).toFixed(2));
    const timeoutRate = Number((totalTimeouts / (sampleDays * (feed === 'mix' ? 12 : 9))).toFixed(2));
    const cleanRunRate = Number((cleanRunDays / sampleDays).toFixed(2));
    const frictionFlags: string[] = [];

    if (averageCorrect < (feed === 'mix' ? 4.8 : 2.6)) frictionFlags.push('difficulty-spike');
    if (timeoutRate > 0.14) frictionFlags.push('timer-friction');
    if (shieldUseRate > 0.62) frictionFlags.push('shield-dependency');
    if (highLookupMisses >= sampleDays * 2) frictionFlags.push('lookup-fatigue');
    if (trickMisses >= Math.max(2, Math.floor(sampleDays / 8))) frictionFlags.push('trick-needs-softening');
    if (averageCorrect > (feed === 'mix' ? 8.8 : 5.6)) frictionFlags.push('too-free');

    const standoutStrengths = dedupe([
      ...(agent.favoredFeeds.includes(feed) ? ['native fit for this feed'] : []),
      ...Object.entries(agent.subdomainAdjustments ?? {})
        .filter(([, value]) => value >= 0.04)
        .slice(0, 2)
        .map(([key]) => key),
      ...Object.entries(agent.domainAdjustments ?? {})
        .filter(([, value]) => value >= 0.04)
        .slice(0, 1)
        .map(([key]) => key),
    ]).slice(0, 3);

    agentSummaries.push({
      agentId: agent.id,
      displayName: agent.displayName,
      archetype: agent.archetype,
      sampleDays,
      averageCorrect,
      averageScore,
      shieldUseRate,
      timeoutRate,
      cleanRunRate,
      standoutStrengths,
      frictionFlags,
    });

    if (toughestDay) {
      daySamples.push(toughestDay);
    }
  });

  const slotSummaries = [...slotStats.entries()]
    .sort(([left], [right]) => left - right)
    .map(([slot, stat]) => {
      const telemetryAggregate = telemetryMaps.slotAggregates.get(
        buildSlotTelemetryKey(feed, difficulty, slot)
      );
      const evidence = buildCalibrationEvidence({
        agentCorrectRate: stat.correct / stat.total,
        agentTimeoutRate: stat.timeouts / stat.total,
        agentShieldRate: stat.shields / stat.total,
        agentMeanAnswerMilliseconds: stat.totalAnswerMilliseconds / stat.total,
        telemetryAggregate,
      });
      return {
        slot,
        averageCorrectRate: evidence.blendedCorrectRate,
        timeoutRate: evidence.blendedTimeoutRate,
        shieldUseRate: evidence.blendedShieldRate,
        agentCorrectRate: evidence.agentCorrectRate,
        observedCorrectRate: evidence.observedCorrectRate,
        blendedCorrectRate: evidence.blendedCorrectRate,
        agentTimeoutRate: evidence.agentTimeoutRate,
        observedTimeoutRate: evidence.observedTimeoutRate,
        blendedTimeoutRate: evidence.blendedTimeoutRate,
        agentShieldRate: evidence.agentShieldRate,
        observedShieldRate: evidence.observedShieldRate,
        blendedShieldRate: evidence.blendedShieldRate,
        telemetrySampleSize: evidence.telemetrySampleSize,
        telemetryConfidence: evidence.telemetryConfidence,
        meanAnswerMilliseconds: evidence.meanAnswerMilliseconds,
        lateClockStress: evidence.lateClockStress,
      } satisfies TriviaPlayerSlotSummary;
    });

  const questionEvidence = [...questionStats.values()]
    .sort((left, right) => {
      if (left.date !== right.date) return left.date.localeCompare(right.date);
      return left.slot - right.slot;
    })
    .map((stat) => {
      const telemetryAggregate = telemetryMaps.questionAggregates.get(
        buildQuestionTelemetryKey(feed, difficulty, stat.questionId)
      );
      const evidence = buildCalibrationEvidence({
        agentCorrectRate: stat.correct / stat.total,
        agentTimeoutRate: stat.timeouts / stat.total,
        agentShieldRate: stat.shields / stat.total,
        agentMeanAnswerMilliseconds: stat.totalAnswerMilliseconds / stat.total,
        telemetryAggregate,
      });
      return {
        date: stat.date,
        slot: stat.slot,
        questionId: stat.questionId,
        subdomain: stat.question.subdomain,
        promptKind: stat.question.promptKind,
        telemetrySampleSize: evidence.telemetrySampleSize,
        telemetryConfidence: evidence.telemetryConfidence,
        agentCorrectRate: evidence.agentCorrectRate,
        observedCorrectRate: evidence.observedCorrectRate,
        blendedCorrectRate: evidence.blendedCorrectRate,
        councilFlags: evaluateTriviaCouncilQuestion(stat.question, feed, stat.slot, evidence),
        replacementReason: stat.replacementReason,
      } satisfies TriviaQuestionScheduleEvidence;
    });

  const slotGroupEvidence = buildSlotGroupEvidence(feed, slotSummaries);
  const councilFlags: TriviaCouncilFlag[] = [];
  Object.entries(slotGroupEvidence).forEach(([label, evidence]) => {
    const target = getGroupTargetRange(feed, difficulty, label);
    if (!target) return;
    if (evidence.blendedCorrectRate > target.max) {
      councilFlags.push({
        agentId: feed === 'sports' ? 'sports-casual' : 'casual-pace',
        code: 'over-soft-opening',
        severity: label === 'q1-q3' || label === 'q1-q2' ? 'fail' : 'warn',
        message: `${label} is landing too soft for ${feed}/${difficulty}.`,
        scope: 'slot-group',
      });
    }
    if (evidence.blendedCorrectRate < target.min) {
      councilFlags.push({
        agentId: feed === 'sports' ? 'analytical-reasoner' : 'broad-generalist',
        code: label === 'q7-q9' || label === 'q10-q12' ? 'over-harsh-finish' : 'timer-friction',
        severity: label === 'q7-q9' || label === 'q10-q12' ? 'warn' : 'fail',
        message: `${label} is landing too harsh for ${feed}/${difficulty}.`,
        scope: 'slot-group',
      });
    }
  });
  const failCounts = new Map<string, number>();
  questionEvidence.forEach((entry) => {
    entry.councilFlags
      .filter((flag) => flag.severity === 'fail')
      .forEach((flag) => {
        failCounts.set(flag.code, (failCounts.get(flag.code) ?? 0) + 1);
      });
  });
  failCounts.forEach((count, code) => {
    councilFlags.push({
      agentId: 'ambiguity-detector',
      code: code as TriviaCouncilFlag['code'],
      severity: 'warn',
      message: `${count} scheduled questions triggered ${code} in ${feed}/${difficulty}.`,
      scope: 'slot-group',
    });
  });

  return {
    feed,
    difficulty,
    sampleDays: sampleEpisodes.length,
    agentSummaries,
    daySamples: daySamples.sort((left, right) => left.correctCount - right.correctCount).slice(0, 6),
    slotSummaries,
    slotGroupEvidence,
    councilFlags,
    questionEvidence,
  };
}

function buildPlayerCalibrationReport(
  schedules: Record<TriviaFeed, Record<TriviaDifficulty, TriviaEpisodeDefinition[]>>,
  mixLibrary: TriviaQuestionRecord[],
  sportsLibrary: TriviaQuestionRecord[],
  telemetryMaps: TriviaTelemetryMaps,
  replacementLogMap: Map<string, string>
): TriviaPlayerCalibrationReport {
  const mixQuestionMap = buildQuestionMap(mixLibrary);
  const sportsQuestionMap = buildQuestionMap(sportsLibrary);
  const questionMaps: Record<TriviaFeed, Map<string, TriviaQuestionRecord>> = {
    mix: mixQuestionMap,
    sports: sportsQuestionMap,
  };
  const openingFeeds = { mix: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport>, sports: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport> };
  const first90Feeds = { mix: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport>, sports: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport> };
  const fullYearFeeds = { mix: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport>, sports: {} as Record<TriviaDifficulty, TriviaPlayerCalibrationFeedReport> };

  (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
    TRIVIA_DIFFICULTIES.forEach((difficulty) => {
      const episodes = schedules[feed][difficulty];
      const questionMap = questionMaps[feed];
      openingFeeds[feed][difficulty] = simulateCalibrationFeed(
        feed,
        difficulty,
        episodes,
        questionMap,
        telemetryMaps,
        replacementLogMap,
        TRIVIA_PLAYER_CALIBRATION_DAYS
      );
      first90Feeds[feed][difficulty] = simulateCalibrationFeed(
        feed,
        difficulty,
        episodes,
        questionMap,
        telemetryMaps,
        replacementLogMap,
        FIRST_90_CALIBRATION_DAYS
      );
      fullYearFeeds[feed][difficulty] = simulateCalibrationFeed(
        feed,
        difficulty,
        episodes,
        questionMap,
        telemetryMaps,
        replacementLogMap,
        FULL_YEAR_CALIBRATION_DAYS
      );
    });
  });

  return {
    generatedAt: ACCESS_DATE,
    sampleDays: TRIVIA_PLAYER_CALIBRATION_DAYS,
    feeds: openingFeeds,
    cohorts: {
      first90: {
        sampleDays: FIRST_90_CALIBRATION_DAYS,
        feeds: first90Feeds,
      },
      fullYear: {
        sampleDays: FULL_YEAR_CALIBRATION_DAYS,
        feeds: fullYearFeeds,
      },
    },
  };
}

function collectReplacementCandidates(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  calibrationFeed: TriviaPlayerCalibrationFeedReport
) {
  const replacements = new Map<string, string>();

  calibrationFeed.questionEvidence.forEach((entry) => {
    const failFlags = entry.councilFlags.filter((flag) => flag.severity === 'fail');
    if (failFlags.length === 0) return;
    replacements.set(
      `${entry.date}:${entry.slot}:${entry.questionId}`,
      failFlags.map((flag) => `${flag.agentId}:${flag.code}`).join(', ')
    );
  });

  Object.entries(calibrationFeed.slotGroupEvidence).forEach(([label, evidence]) => {
    const target = getGroupTargetRange(feed, difficulty, label);
    if (!target) return;
    if (evidence.telemetryConfidence === 'agent-only') {
      return;
    }
    if (evidence.blendedCorrectRate >= target.min && evidence.blendedCorrectRate <= target.max) {
      return;
    }

    const groupQuestions = calibrationFeed.questionEvidence.filter(
      (entry) => getGroupLabel(feed, entry.slot) === label
    );
    if (groupQuestions.length === 0) return;
    const selected =
      evidence.blendedCorrectRate > target.max
        ? [...groupQuestions].sort((left, right) => right.blendedCorrectRate - left.blendedCorrectRate)[0]
        : [...groupQuestions].sort((left, right) => left.blendedCorrectRate - right.blendedCorrectRate)[0];
    if (!selected) return;
    replacements.set(
      `${selected.date}:${selected.slot}:${selected.questionId}`,
      evidence.blendedCorrectRate > target.max
        ? `blended-too-soft:${label}`
        : `blended-too-harsh:${label}`
    );
  });

  return replacements;
}

function findReplacementQuestion(params: {
  feed: TriviaFeed;
  difficulty: TriviaDifficulty;
  slot: number;
  currentQuestion: TriviaQuestionRecord;
  reason: string;
  library: TriviaQuestionRecord[];
  usedIds: Set<string>;
  usedVariantGroups: Set<string>;
  blockedVariantGroups?: Set<string>;
}) {
  const {
    feed,
    difficulty,
    slot,
    currentQuestion,
    reason,
    library,
    usedIds,
    usedVariantGroups,
    blockedVariantGroups = new Set<string>(),
  } = params;
  const soften = reason.startsWith('blended-too-harsh');
  const sharpen = reason.startsWith('blended-too-soft');
  const slotConfig =
    feed === 'mix'
      ? getMixSlotConfigs(Math.max(0, slot - 1), difficulty)[slot - 1]
      : getSportsSlotConfigs(Math.max(0, slot - 1), difficulty)[slot - 1];

  const scoreCandidate = (candidate: TriviaQuestionRecord) => {
    let score = 0;
    if (candidate.subdomain === currentQuestion.subdomain) score += 30;
    if (candidate.promptKind === currentQuestion.promptKind) score += 12;
    if (candidate.difficultyTarget === currentQuestion.difficultyTarget) score += 16;
    if (Math.abs(candidate.difficultyTarget - currentQuestion.difficultyTarget) === 1) score += 8;
    if (candidate.editorialBucket === currentQuestion.editorialBucket) score += 6;
    if (slotConfig.preferredPromptKinds?.includes(candidate.promptKind)) score += 6;
    if ((slotConfig as MixSlotConfig | SportsSlotConfig).maxStemLength) {
      const maxStemLength = (slotConfig as MixSlotConfig | SportsSlotConfig).maxStemLength ?? 999;
      if (candidate.stem.length <= maxStemLength) score += 4;
    }
    if (soften) {
      score += candidate.salienceScore;
      if (candidate.lookupRisk === 'low') score += 10;
    } else if (sharpen) {
      score += 100 - candidate.salienceScore;
      if (candidate.lookupRisk === 'high') score += 10;
    } else {
      score += 100 - Math.abs(candidate.salienceScore - currentQuestion.salienceScore);
    }
    return score;
  };

  const baseCandidates = library
    .filter((candidate) => candidate.id !== currentQuestion.id)
    .filter((candidate) => !usedIds.has(candidate.id))
    .filter((candidate) => candidate.scheduleEligible)
    .filter((candidate) => candidate.sourceTier !== 'legacy' && candidate.sourceTier !== 'supplemental')
    .filter(
      (candidate) => Boolean(candidate.isTrickQuestion) === Boolean(currentQuestion.isTrickQuestion)
    )
    .filter((candidate) => {
      const flags = evaluateTriviaCouncilQuestion(candidate, feed, slot);
      return !flags.some((flag) => flag.severity === 'fail');
    })
    .filter((candidate) => {
      if (feed === 'sports' && slot >= 7 && candidate.subdomain === 'general-sports') {
        return candidate.promptKind === 'rule' || candidate.promptKind === 'term';
      }
      return true;
    })
    .filter((candidate) => {
      if (soften) {
        return candidate.lookupRisk !== 'high' || candidate.salienceScore >= currentQuestion.salienceScore;
      }
      if (sharpen) {
        return candidate.difficultyTarget >= currentQuestion.difficultyTarget;
      }
      return true;
    });

  const isBlockedVariantGroup = (candidate: TriviaQuestionRecord) =>
    blockedVariantGroups.has(getQuestionVariantGroup(candidate));
  const isUsedVariantGroup = (candidate: TriviaQuestionRecord) =>
    usedVariantGroups.has(getQuestionVariantGroup(candidate));

  const candidatePasses = [
    (candidate: TriviaQuestionRecord) =>
      !isBlockedVariantGroup(candidate) &&
      !isUsedVariantGroup(candidate) &&
      candidate.subdomain === currentQuestion.subdomain &&
      candidate.difficultyTarget === currentQuestion.difficultyTarget,
    (candidate: TriviaQuestionRecord) =>
      !isBlockedVariantGroup(candidate) &&
      !isUsedVariantGroup(candidate) &&
      candidate.subdomain === currentQuestion.subdomain &&
      Math.abs(candidate.difficultyTarget - currentQuestion.difficultyTarget) <= 1,
    (candidate: TriviaQuestionRecord) =>
      !isBlockedVariantGroup(candidate) &&
      !isUsedVariantGroup(candidate) &&
      Math.abs(candidate.difficultyTarget - currentQuestion.difficultyTarget) <= 1,
    (candidate: TriviaQuestionRecord) =>
      !isBlockedVariantGroup(candidate) &&
      Math.abs(candidate.difficultyTarget - currentQuestion.difficultyTarget) <= 1,
    (candidate: TriviaQuestionRecord) =>
      !isBlockedVariantGroup(candidate) && !isUsedVariantGroup(candidate),
    (candidate: TriviaQuestionRecord) => !isBlockedVariantGroup(candidate),
    (candidate: TriviaQuestionRecord) =>
      !isUsedVariantGroup(candidate) &&
      Math.abs(candidate.difficultyTarget - currentQuestion.difficultyTarget) <= 1,
    (_candidate: TriviaQuestionRecord) => true,
  ];

  for (const matcher of candidatePasses) {
    const match = baseCandidates
      .filter(matcher)
      .map((candidate) => ({ candidate, score: scoreCandidate(candidate) }))
      .sort((left, right) => right.score - left.score)[0];
    if (match) {
      return match.candidate;
    }
  }

  return null;
}

function applyAutomatedReplacements(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  episodes: TriviaEpisodeDefinition[],
  library: TriviaQuestionRecord[],
  calibrationFeed: TriviaPlayerCalibrationFeedReport
): ReplacementLogEntry[] {
  const plannedReplacements = collectReplacementCandidates(feed, difficulty, calibrationFeed);
  if (plannedReplacements.size === 0) return [];

  const usedIds = new Set(episodes.flatMap((episode) => episode.questionIds));
  const questionMap = buildQuestionMap(library);
  const usedVariantGroups = new Set(
    episodes.flatMap((episode) =>
      episode.questionIds
        .map((questionId) => questionMap.get(questionId)?.variantGroup)
        .filter((variantGroup): variantGroup is string => Boolean(variantGroup))
    )
  );
  const replacements: ReplacementLogEntry[] = [];

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId, index) => {
      const key = `${episode.date}:${index + 1}:${questionId}`;
      const reason = plannedReplacements.get(key);
      if (!reason) return;

      const currentQuestion = questionMap.get(questionId);
      if (!currentQuestion) {
        throw new Error(`Missing scheduled question ${questionId} while applying replacements.`);
      }
      const replacement = findReplacementQuestion({
        feed,
        difficulty,
        slot: index + 1,
        currentQuestion,
        reason,
        library,
        usedIds,
        usedVariantGroups,
      });

      if (!replacement) {
        throw new Error(
          `No acceptable ${feed}/${difficulty} replacement for ${episode.date} slot ${index + 1} (${questionId}) after ${reason}.`
        );
      }

      usedIds.delete(questionId);
      if (currentQuestion.variantGroup) usedVariantGroups.delete(currentQuestion.variantGroup);
      usedIds.add(replacement.id);
      if (replacement.variantGroup) usedVariantGroups.add(replacement.variantGroup);
      episode.questionIds[index] = replacement.id;
      replacements.push({
        date: episode.date,
        slot: index + 1,
        questionId,
        replacementQuestionId: replacement.id,
        reason,
      });
    });
  });

  return replacements;
}

function applyVariantReuseCleanup(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  episodes: TriviaEpisodeDefinition[],
  library: TriviaQuestionRecord[]
): ReplacementLogEntry[] {
  const questionMap = buildQuestionMap(library);
  const usedIds = new Set(episodes.flatMap((episode) => episode.questionIds));
  const seenVariantGroups = new Set<string>();
  const replacements: ReplacementLogEntry[] = [];

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId, index) => {
      const currentQuestion = questionMap.get(questionId);
      if (!currentQuestion) {
        throw new Error(`Missing scheduled question ${questionId} during variant reuse cleanup.`);
      }
      const currentGroup = getQuestionVariantGroup(currentQuestion);
      if (!seenVariantGroups.has(currentGroup)) {
        seenVariantGroups.add(currentGroup);
        return;
      }

      usedIds.delete(questionId);
      const replacement = findReplacementQuestion({
        feed,
        difficulty,
        slot: index + 1,
        currentQuestion,
        reason: 'repeated-variant-group',
        library,
        usedIds,
        usedVariantGroups: seenVariantGroups,
      });

      if (!replacement) {
        throw new Error(
          `Unable to replace repeated variant group for ${feed}/${difficulty} ${episode.date} slot ${
            index + 1
          } (${questionId}).`
        );
      }

      usedIds.add(replacement.id);
      seenVariantGroups.add(getQuestionVariantGroup(replacement));
      episode.questionIds[index] = replacement.id;
      replacements.push({
        date: episode.date,
        slot: index + 1,
        questionId,
        replacementQuestionId: replacement.id,
        reason: 'repeat-variant-group-cleanup',
      });
    });
  });

  return replacements;
}

function applyCrossDifficultyCooldownCleanup(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  referenceEpisodes: TriviaEpisodeDefinition[],
  targetEpisodes: TriviaEpisodeDefinition[],
  library: TriviaQuestionRecord[],
  cooldownDays: number
): ReplacementLogEntry[] {
  const questionMap = buildQuestionMap(library);
  const usedIds = new Set(targetEpisodes.flatMap((episode) => episode.questionIds));
  const usedVariantGroups = buildScheduledVariantGroupSet(targetEpisodes, questionMap);
  const blockedVariantGroupsByDay = buildCrossDifficultyBlockedVariantGroupsByDay(
    referenceEpisodes,
    questionMap,
    cooldownDays
  );
  const replacements: ReplacementLogEntry[] = [];

  targetEpisodes.forEach((episode, dayIndex) => {
    const blockedVariantGroups = blockedVariantGroupsByDay[dayIndex] ?? new Set<string>();
    episode.questionIds.forEach((questionId, index) => {
      const currentQuestion = questionMap.get(questionId);
      if (!currentQuestion) {
        throw new Error(`Missing scheduled question ${questionId} during cross-difficulty cleanup.`);
      }
      const currentGroup = getQuestionVariantGroup(currentQuestion);
      if (!blockedVariantGroups.has(currentGroup)) return;

      usedIds.delete(questionId);
      usedVariantGroups.delete(currentGroup);
      const replacement = findReplacementQuestion({
        feed,
        difficulty,
        slot: index + 1,
        currentQuestion,
        reason: `cross-difficulty-cooldown-${cooldownDays}`,
        library,
        usedIds,
        usedVariantGroups,
        blockedVariantGroups,
      });

      if (!replacement) {
        usedIds.add(questionId);
        usedVariantGroups.add(currentGroup);
        return;
      }

      usedIds.add(replacement.id);
      usedVariantGroups.add(getQuestionVariantGroup(replacement));
      episode.questionIds[index] = replacement.id;
      replacements.push({
        date: episode.date,
        slot: index + 1,
        questionId,
        replacementQuestionId: replacement.id,
        reason: `cross-difficulty-cooldown-${cooldownDays}`,
      });
    });
  });

  return replacements;
}

function countScheduledOffToneQuestions(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  return episodes.reduce((count, episode) => {
    return (
      count +
      episode.questionIds.reduce((episodeCount, questionId) => {
        const question = questionMap.get(questionId);
        if (!question) return episodeCount;
        return episodeCount + (getScheduledOffToneReason(feed, question) ? 1 : 0);
      }, 0)
    );
  }, 0);
}

function getScheduledOffToneReason(
  feed: TriviaFeed,
  question: TriviaQuestionRecord
): string | null {
  if (!question.scheduleEligible) {
    return (
      question.launchBlockReasons[0]?.message ??
      'question is not schedule-eligible'
    );
  }

  if (feed === 'sports') {
    if (!isSportsEditorialFit(question, question.difficultyPool) || isOffToneScheduledSportsQuestion(question)) {
      return 'sports clue missed the launch editorial fit bar';
    }
    return null;
  }

  if (!isMixEditorialFit(question, question.difficultyPool)) {
    return 'mix clue missed the launch editorial fit bar';
  }
  return null;
}

function countLateSlotGeneralSportsQuestions(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  if (feed !== 'sports') return 0;

  return episodes.reduce((count, episode) => {
    const lastQuestionId = episode.questionIds[episode.questionIds.length - 1];
    const question = lastQuestionId ? questionMap.get(lastQuestionId) : undefined;
    if (!question) return count;
    if (question.subdomain !== 'general-sports') return count;
    return count + (SPORTS_Q9_GENERAL_PROMPT_KINDS.has(question.promptKind) ? 0 : 1);
  }, 0);
}

function getEpisodeCurveballQuestionIds(
  feed: TriviaFeed,
  episode: TriviaEpisodeDefinition,
  questionMap: Map<string, TriviaQuestionRecord>
): Set<string> {
  if (feed !== 'sports') {
    return new Set(
      episode.questionIds.filter((questionId) => questionMap.get(questionId)?.isTrickQuestion)
    );
  }
  const scheduledCurveballId = episode.curveballQuestionId ?? undefined;
  return scheduledCurveballId ? new Set([scheduledCurveballId]) : new Set();
}

function countCurveballSpacingViolations(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  if (feed !== 'sports') return 0;

  let lastTrickDayIndex = -100;
  let violations = 0;

  episodes.forEach((episode, dayIndex) => {
    const hasTrickQuestion = getEpisodeCurveballQuestionIds(feed, episode, questionMap).size > 0;
    if (!hasTrickQuestion) return;

    if (dayIndex - lastTrickDayIndex < SPORTS_CURVEBALL_GAP_DAYS) {
      violations += 1;
    }
    lastTrickDayIndex = dayIndex;
  });

  return violations;
}

function getCurveballCoverageByMonth(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): Record<string, number> {
  const coverage = new Map<string, number>();
  if (episodes.length === 0) return {};

  const firstDate = new Date(`${episodes[0].date}T12:00:00`);
  const lastDate = new Date(`${episodes[episodes.length - 1].date}T12:00:00`);
  const cursor = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1, 12);
  const endCursor = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1, 12);

  while (cursor.getTime() <= endCursor.getTime()) {
    coverage.set(getMonthKey(cursor), 0);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  episodes.forEach((episode) => {
    const monthKey = episode.date.slice(0, 7);
    const trickCount = getEpisodeCurveballQuestionIds(feed, episode, questionMap).size;
    coverage.set(monthKey, (coverage.get(monthKey) ?? 0) + trickCount);
  });
  return Object.fromEntries([...coverage.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function countFirst90BlockedPatterns(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  return episodes.slice(0, FIRST_90_CALIBRATION_DAYS).reduce((count, episode) => {
    return (
      count +
      episode.questionIds.reduce((episodeCount, questionId) => {
        const question = questionMap.get(questionId);
        if (!question) return episodeCount;

        if (feed === 'sports') {
          const blocked =
            !question.scheduleEligible ||
            SPORTS_LEGACY_REJECT_REGEX.test(question.stem) ||
            SPORTS_GENERAL_REJECT_REGEX.test(question.stem) ||
            question.legacyFamily === 'off-tone' ||
            question.legacyFamily === 'relationship' ||
            question.legacyFamily === 'exact-date' ||
            question.legacyFamily === 'misc-trivia' ||
            hasGimmickDistractorPattern(question.stem);
          return episodeCount + (blocked ? 1 : 0);
        }

        const blocked =
          !question.scheduleEligible ||
          MIX_ARCHIVE_REJECT_REGEX.test(question.stem) ||
          MIX_TRICK_BLOCKLIST_REGEX.test(question.stem) ||
          MIX_POP_DEEPCUT_REJECT_REGEX.test(question.stem) ||
          MIX_RELATIONSHIP_REJECT_REGEX.test(question.stem) ||
          hasGimmickDistractorPattern(question.stem);
        return episodeCount + (blocked ? 1 : 0);
      }, 0)
    );
  }, 0);
}

function collectScheduledOffToneExamples(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  limit = 25
): string[] {
  const examples: string[] = [];
  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId, index) => {
      if (examples.length >= limit) return;
      const question = questionMap.get(questionId);
      if (!question) return;
      const reason = getScheduledOffToneReason(feed, question);
      if (!reason) return;
      examples.push(`${episode.date} Q${index + 1} ${question.id}: ${reason}`);
    });
  });
  return examples;
}

function collectFirst90BlockedPatternExamples(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  limit = 25
): string[] {
  const examples: string[] = [];
  episodes.slice(0, FIRST_90_CALIBRATION_DAYS).forEach((episode) => {
    episode.questionIds.forEach((questionId, index) => {
      if (examples.length >= limit) return;
      const question = questionMap.get(questionId);
      if (!question) return;
      const blocked =
        feed === 'sports'
          ? !question.scheduleEligible ||
            SPORTS_LEGACY_REJECT_REGEX.test(question.stem) ||
            SPORTS_GENERAL_REJECT_REGEX.test(question.stem) ||
            question.legacyFamily === 'off-tone' ||
            question.legacyFamily === 'relationship' ||
            question.legacyFamily === 'exact-date' ||
            question.legacyFamily === 'misc-trivia' ||
            hasGimmickDistractorPattern(question.stem)
          : !question.scheduleEligible ||
            MIX_ARCHIVE_REJECT_REGEX.test(question.stem) ||
            MIX_TRICK_BLOCKLIST_REGEX.test(question.stem) ||
            MIX_POP_DEEPCUT_REJECT_REGEX.test(question.stem) ||
            MIX_RELATIONSHIP_REJECT_REGEX.test(question.stem) ||
            hasGimmickDistractorPattern(question.stem);
      if (!blocked) return;
      const reason =
        question.launchBlockReasons[0]?.message ??
        'blocked launch pattern survived into the first 90 days';
      examples.push(`${episode.date} Q${index + 1} ${question.id}: ${reason}`);
    });
  });
  return examples;
}

function buildTopRepeatedGroups(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): TriviaAuditReport['feeds'][TriviaFeed][TriviaDifficulty]['topRepeatedGroups'] {
  const groups = new Map<
    string,
    {
      count: number;
      stem: string;
      subdomain: string;
      sourceTier: TriviaSourceTier;
      lateSlotHits: number;
    }
  >();

  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId, index) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      const variantGroup = question.variantGroup ?? question.id;
      const entry = groups.get(variantGroup) ?? {
        count: 0,
        stem: question.stem,
        subdomain: question.subdomain,
        sourceTier: question.sourceTier,
        lateSlotHits: 0,
      };
      entry.count += 1;
      if (index >= episode.questionIds.length - 3) entry.lateSlotHits += 1;
      groups.set(variantGroup, entry);
    });
  });

  return [...groups.entries()]
    .filter(([, entry]) => entry.count > 1)
    .sort((left, right) => {
      if (right[1].count !== left[1].count) return right[1].count - left[1].count;
      if (right[1].lateSlotHits !== left[1].lateSlotHits) return right[1].lateSlotHits - left[1].lateSlotHits;
      return left[1].stem.localeCompare(right[1].stem);
    })
    .slice(0, 12)
    .map(([variantGroup, entry]) => ({
      variantGroup,
      stem: entry.stem,
      subdomain: entry.subdomain,
      sourceTier: entry.sourceTier,
      count: entry.count,
      lateSlotHits: entry.lateSlotHits,
    }));
}

function countRepeatedVariantGroups(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  const counts = new Map<string, number>();
  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      const variantGroup = getQuestionVariantGroup(question);
      counts.set(variantGroup, (counts.get(variantGroup) ?? 0) + 1);
    });
  });

  let repeated = 0;
  counts.forEach((count) => {
    if (count > 1) repeated += count - 1;
  });
  return repeated;
}

function countRepeatedCoreFacts(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  const counts = new Map<string, number>();
  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      counts.set(question.coreFactId, (counts.get(question.coreFactId) ?? 0) + 1);
    });
  });

  let repeated = 0;
  counts.forEach((count) => {
    if (count > 1) repeated += count - 1;
  });
  return repeated;
}

function countCrossScheduleOverlap(
  referenceEpisodes: TriviaEpisodeDefinition[],
  targetEpisodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>,
  key: 'coreFactId' | 'variantGroup'
): number {
  const referenceValues = new Set<string>();
  referenceEpisodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      const value = key === 'coreFactId' ? question.coreFactId : getQuestionVariantGroup(question);
      referenceValues.add(value);
    });
  });

  let overlap = 0;
  targetEpisodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      const value = key === 'coreFactId' ? question.coreFactId : getQuestionVariantGroup(question);
      if (referenceValues.has(value)) overlap += 1;
    });
  });

  return overlap;
}

function computeLateSlotLegibilityScore(
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  const scores: number[] = [];
  episodes.forEach((episode) => {
    episode.questionIds.slice(-3).forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      let score = question.salienceScore;
      if (question.lookupRisk === 'medium') score -= 4;
      if (question.lookupRisk === 'high') score -= 10;
      if (question.sourceTier !== 'curated') score -= 3;
      if (question.sourceTier === 'variant') score -= 5;
      if (question.legacyFamily !== 'none') score -= 6;
      if (question.stem.length > 130) score -= 4;
      if (question.obscurityFlags.includes('timer-friction')) score -= 4;
      scores.push(clamp(score, 20, 100));
    });
  });

  if (scores.length === 0) return 0;
  return Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2));
}

function computeCoreSubdomainShare(
  feed: TriviaFeed,
  episodes: TriviaEpisodeDefinition[],
  questionMap: Map<string, TriviaQuestionRecord>
): number {
  if (feed !== 'sports') return 0;

  let total = 0;
  let core = 0;
  episodes.forEach((episode) => {
    episode.questionIds.forEach((questionId) => {
      const question = questionMap.get(questionId);
      if (!question) return;
      total += 1;
      if (SPORTS_CORE_SUBDOMAINS.has(question.subdomain)) core += 1;
    });
  });

  if (!total) return 0;
  return Number((core / total).toFixed(3));
}

function evaluatePlayerGate(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  audit: TriviaAuditReport['feeds'][TriviaFeed][TriviaDifficulty],
  _calibrationFeed: TriviaPlayerCalibrationFeedReport,
  first90Feed: TriviaPlayerCalibrationFeedReport,
  fullYearFeed: TriviaPlayerCalibrationFeedReport
): { playerGatePass: boolean; playerGateFailures: string[] } {
  const failures: string[] = [];
  const byAgent = new Map(fullYearFeed.agentSummaries.map((summary) => [summary.agentId, summary]));
  const summaries = fullYearFeed.agentSummaries;
  const first90BySlot = new Map(first90Feed.slotSummaries.map((summary) => [summary.slot, summary]));
  const shieldDependencyCount = summaries.filter((summary) =>
    summary.frictionFlags.includes('shield-dependency')
  ).length;
  const trickSofteningCount = summaries.filter((summary) =>
    summary.frictionFlags.includes('trick-needs-softening')
  ).length;
  const timerFrictionAgents = summaries.filter((summary) =>
    summary.frictionFlags.includes('timer-friction')
  );
  const openingTimerFrictionAgents = first90Feed.agentSummaries.filter((summary) =>
    summary.frictionFlags.includes('timer-friction')
  );

  const expectSlotRange = (slot: number, min: number, max: number) => {
    const value = first90BySlot.get(slot)?.averageCorrectRate;
    if (value == null || value < min || value > max) {
      failures.push(`slot${slot}=${value ?? 'missing'}`);
    }
  };
  const expectGroupRange = (label: string, slots: number[], min: number, max?: number) => {
    const values = slots.map((slot) => first90BySlot.get(slot)?.averageCorrectRate).filter((value): value is number => value != null);
    if (values.length !== slots.length) {
      failures.push(`${label}=missing`);
      return;
    }
    const average = Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(3));
    if (average < min || (max !== undefined && average > max)) {
      failures.push(`${label}=${average}`);
    }
  };

  if (feed === 'sports') {
    const curveballCoverageEntries = Object.entries(audit.curveballCoverageByMonth).sort(([left], [right]) =>
      left.localeCompare(right)
    );
    const startMonth = START_DATE_KEY.slice(0, 7);
    const endMonth = getDateKey(addDays(getStartDate(), TOTAL_DAYS - 1)).slice(0, 7);
    curveballCoverageEntries.forEach(([monthKey, count]) => {
      if (monthKey === startMonth || monthKey === endMonth) {
        if (count < 0 || count > 1) {
          failures.push(`curveballCoverage:${monthKey}=${count}`);
        }
        return;
      }
      if (count !== SPORTS_CURVEBALL_TARGET_PER_MONTH) {
        failures.push(`curveballCoverage:${monthKey}=${count}`);
      }
    });

    if (audit.scheduledOffToneCount !== 0) {
      failures.push(`scheduledOffToneCount=${audit.scheduledOffToneCount}`);
    }
    if (audit.lateSlotGeneralSportsCount !== 0) {
      failures.push(`lateSlotGeneralSportsCount=${audit.lateSlotGeneralSportsCount}`);
    }
    if (audit.curveballSpacingViolations !== 0) {
      failures.push(`curveballSpacingViolations=${audit.curveballSpacingViolations}`);
    }
    if (audit.repeatedVariantGroups !== 0) {
      failures.push(`repeatedVariantGroups=${audit.repeatedVariantGroups}`);
    }
    if (audit.coreFactReuseViolations !== 0) {
      failures.push(`coreFactReuseViolations=${audit.coreFactReuseViolations}`);
    }
    if (audit.crossDifficultyCoreFactOverlap !== 0) {
      failures.push(`crossDifficultyCoreFactOverlap=${audit.crossDifficultyCoreFactOverlap}`);
    }
    if (audit.crossDifficultyVariantOverlap !== 0) {
      failures.push(`crossDifficultyVariantOverlap=${audit.crossDifficultyVariantOverlap}`);
    }
    if (audit.reserveShortfall !== 0) {
      failures.push(`reserveCount=${audit.reserveCount}`);
    }
    if (audit.first90BlockedPatternCount !== 0) {
      failures.push(`first90BlockedPatternCount=${audit.first90BlockedPatternCount}`);
    }
    if (audit.blockingTasteTagCount !== 0) {
      failures.push(`blockingTasteTagCount=${audit.blockingTasteTagCount}`);
    }
    if (audit.authoredFamilyShare < AUTHORED_SHARE_MINIMUMS[feed][difficulty]) {
      failures.push(`authoredFamilyShare=${audit.authoredFamilyShare}`);
    }
    if (audit.coreSubdomainShare < 0.68 || audit.coreSubdomainShare > 0.82) {
      failures.push(`coreSubdomainShare=${audit.coreSubdomainShare}`);
    }

    if (difficulty === 'easy') {
      expectGroupRange('sports-q1-q2', [1, 2], 0.74, 0.86);
      expectGroupRange('sports-q3-q5', [3, 4, 5], 0.5, 0.66);
      expectSlotRange(6, 0.32, 0.46);
      expectGroupRange('sports-q7-q9', [7, 8, 9], 0.22, 0.32);
    } else {
      expectGroupRange('sports-q1-q2', [1, 2], 0.5, 0.77);
      expectGroupRange('sports-q3-q5', [3, 4, 5], 0.31, 0.5);
      expectSlotRange(6, 0.1, 0.33);
      expectGroupRange('sports-q7-q9', [7, 8, 9], 0.03, 0.13);
    }

    const commuter = byAgent.get('sports-casual');
    if (
      !commuter ||
      commuter.averageCorrect < (difficulty === 'easy' ? 4 : 2.6) ||
      commuter.timeoutRate > 0.16
    ) {
      failures.push(
        `sports-casual averageCorrect=${commuter?.averageCorrect ?? 'missing'} timeoutRate=${commuter?.timeoutRate ?? 'missing'}`
      );
    }

    const culture = byAgent.get('culture-generalist');
    if (!culture || culture.averageCorrect < (difficulty === 'easy' ? 3.8 : 2.6)) {
      failures.push(`culture-generalist averageCorrect=${culture?.averageCorrect ?? 'missing'}`);
    }

    const sportsCore = byAgent.get('sports-core');
    if (
      !sportsCore ||
      sportsCore.averageCorrect < (difficulty === 'easy' ? 5.5 : 4.8) ||
      sportsCore.shieldUseRate >= (difficulty === 'easy' ? 0.55 : 0.4)
    ) {
      failures.push(`sports-core averageCorrect=${sportsCore?.averageCorrect ?? 'missing'}`);
    }

    const broad = byAgent.get('broad-generalist');
    if (
      !broad ||
      broad.averageCorrect < (difficulty === 'easy' ? 4.8 : 3.7) ||
      broad.shieldUseRate >= (difficulty === 'easy' ? 0.6 : 0.45)
    ) {
      failures.push(`broad-generalist averageCorrect=${broad?.averageCorrect ?? 'missing'}`);
    }

    if (
      dedupe([
        ...timerFrictionAgents.map((summary) => summary.agentId),
        ...openingTimerFrictionAgents.map((summary) => summary.agentId),
      ]).length > 2
    ) {
      failures.push(
        `timer-friction:${dedupe([
          ...timerFrictionAgents.map((summary) => summary.agentId),
          ...openingTimerFrictionAgents.map((summary) => summary.agentId),
        ]).join(',')}`
      );
    }
    if (shieldDependencyCount > 2) {
      failures.push(`shield-dependency=${shieldDependencyCount}`);
    }
    if (trickSofteningCount > 1) {
      failures.push(`trick-needs-softening=${trickSofteningCount}`);
    }
  } else {
    if (audit.scheduledOffToneCount !== 0) {
      failures.push(`scheduledOffToneCount=${audit.scheduledOffToneCount}`);
    }
    if (audit.repeatedVariantGroups !== 0) {
      failures.push(`repeatedVariantGroups=${audit.repeatedVariantGroups}`);
    }
    if (audit.coreFactReuseViolations !== 0) {
      failures.push(`coreFactReuseViolations=${audit.coreFactReuseViolations}`);
    }
    if (audit.crossDifficultyCoreFactOverlap !== 0) {
      failures.push(`crossDifficultyCoreFactOverlap=${audit.crossDifficultyCoreFactOverlap}`);
    }
    if (audit.crossDifficultyVariantOverlap !== 0) {
      failures.push(`crossDifficultyVariantOverlap=${audit.crossDifficultyVariantOverlap}`);
    }
    if (audit.reserveShortfall !== 0) {
      failures.push(`reserveCount=${audit.reserveCount}`);
    }
    if (audit.first90BlockedPatternCount !== 0) {
      failures.push(`first90BlockedPatternCount=${audit.first90BlockedPatternCount}`);
    }
    if (audit.blockingTasteTagCount !== 0) {
      failures.push(`blockingTasteTagCount=${audit.blockingTasteTagCount}`);
    }
    if (audit.authoredFamilyShare < AUTHORED_SHARE_MINIMUMS[feed][difficulty]) {
      failures.push(`authoredFamilyShare=${audit.authoredFamilyShare}`);
    }
    if (difficulty === 'easy') {
      expectGroupRange('mix-q1-q3', [1, 2, 3], 0.85, 0.93);
      expectGroupRange('mix-q4-q6', [4, 5, 6], 0.7, 0.82);
      expectGroupRange('mix-q7-q9', [7, 8, 9], 0.47, 0.57);
      expectGroupRange('mix-q10-q12', [10, 11, 12], 0.42, 0.53);
    } else {
      expectGroupRange('mix-q1-q3', [1, 2, 3], 0.6, 0.82);
      expectGroupRange('mix-q4-q6', [4, 5, 6], 0.35, 0.62);
      expectGroupRange('mix-q7-q9', [7, 8, 9], 0.2, 0.37);
      expectGroupRange('mix-q10-q12', [10, 11, 12], 0.08, 0.22);
    }
    if (timerFrictionAgents.length > 1 || openingTimerFrictionAgents.length > 1) {
      failures.push(
        `timer-friction:${dedupe([
          ...timerFrictionAgents.map((summary) => summary.agentId),
          ...openingTimerFrictionAgents.map((summary) => summary.agentId),
        ]).join(',')}`
      );
    }
    if (trickSofteningCount > 1) {
      failures.push(`trick-needs-softening=${trickSofteningCount}`);
    }

    const commuter = byAgent.get('casual-pace');
    if (
      !commuter ||
      commuter.averageCorrect < (difficulty === 'easy' ? 6 : 3.3) ||
      commuter.timeoutRate > 0.14
    ) {
      failures.push(
        `casual-pace averageCorrect=${commuter?.averageCorrect ?? 'missing'} timeoutRate=${commuter?.timeoutRate ?? 'missing'}`
      );
    }
    if ((byAgent.get('culture-generalist')?.averageCorrect ?? 0) < (difficulty === 'easy' ? 7 : 5)) {
      failures.push(
        `culture-generalist averageCorrect=${byAgent.get('culture-generalist')?.averageCorrect ?? 'missing'}`
      );
    }
    if ((byAgent.get('broad-generalist')?.averageCorrect ?? 0) < (difficulty === 'easy' ? 6.4 : 4.5)) {
      failures.push(
        `broad-generalist averageCorrect=${byAgent.get('broad-generalist')?.averageCorrect ?? 'missing'}`
      );
    }

    ['culture-generalist', 'broad-generalist', 'analytical-reasoner'].forEach((agentId) => {
      const summary = byAgent.get(agentId);
      if (!summary || summary.shieldUseRate >= (difficulty === 'easy' ? 0.75 : 0.85)) {
        failures.push(`${agentId} shieldUseRate=${summary?.shieldUseRate ?? 'missing'}`);
      }
    });
  }

  return {
    playerGatePass: failures.length === 0,
    playerGateFailures: failures,
  };
}

function applyAuditSignals(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  audit: TriviaAuditReport['feeds'][TriviaFeed][TriviaDifficulty],
  episodes: TriviaEpisodeDefinition[],
  crossDifficultyEpisodes: TriviaEpisodeDefinition[],
  library: TriviaQuestionRecord[],
  calibrationFeed: TriviaPlayerCalibrationFeedReport,
  first90Feed: TriviaPlayerCalibrationFeedReport,
  fullYearFeed: TriviaPlayerCalibrationFeedReport
) {
  const questionMap = buildQuestionMap(library);
  audit.repeatedVariantGroups = countRepeatedVariantGroups(episodes, questionMap);
  audit.variantReuseCount = audit.repeatedVariantGroups;
  audit.coreFactReuseViolations = countRepeatedCoreFacts(episodes, questionMap);
  audit.crossDifficultyCoreFactOverlap = countCrossScheduleOverlap(
    crossDifficultyEpisodes,
    episodes,
    questionMap,
    'coreFactId'
  );
  audit.crossDifficultyVariantOverlap = countCrossScheduleOverlap(
    crossDifficultyEpisodes,
    episodes,
    questionMap,
    'variantGroup'
  );
  audit.reserveHeadroomTarget = feed === 'mix' ? MIX_RESERVE_HEADROOM_TARGET : SPORTS_RESERVE_HEADROOM_TARGET;
  audit.poolScheduledCount = episodes.reduce((sum, episode) => sum + episode.questionIds.length, 0);
  audit.poolReserveCount = library.length - audit.poolScheduledCount;
  audit.reserveShortfall = Math.max(0, audit.reserveHeadroomTarget - audit.poolReserveCount);
  audit.libraryCount = library.length;
  audit.scheduledCount = audit.poolScheduledCount;
  audit.reserveCount = audit.poolReserveCount;
  audit.scheduledOffToneCount = countScheduledOffToneQuestions(feed, episodes, questionMap);
  audit.scheduledOffToneExamples = collectScheduledOffToneExamples(feed, episodes, questionMap);
  audit.lateSlotGeneralSportsCount = countLateSlotGeneralSportsQuestions(feed, episodes, questionMap);
  audit.curveballSpacingViolations = countCurveballSpacingViolations(feed, episodes, questionMap);
  audit.first90BlockedPatternCount = countFirst90BlockedPatterns(feed, episodes, questionMap);
  audit.blockedPatternExamples = collectFirst90BlockedPatternExamples(feed, episodes, questionMap);
  const tasteSummary = buildTasteTagCounts(feed, episodes, questionMap);
  audit.blockingTasteTagCount = tasteSummary.blockingCount;
  audit.blockingTasteTagExamples = tasteSummary.blockingExamples;
  audit.tasteTagCounts = tasteSummary.counts;
  audit.scheduleEligibleShare = computeScheduleEligibleShare(episodes, questionMap);
  audit.scheduledBlockedSourceFamilies = buildScheduledBlockedSourceFamilies(
    feed,
    difficulty,
    episodes,
    questionMap
  );
  audit.first28SampleStems = collectFirst28SampleStems(episodes, questionMap);
  audit.sourceFamilyDistribution = buildSourceFamilyDistribution(episodes, questionMap);
  audit.authoredFamilyShare = computeAuthoredFamilyShare(episodes, questionMap);
  audit.curveballCoverageByMonth = getCurveballCoverageByMonth(feed, episodes, questionMap);
  audit.topRepeatedGroups = buildTopRepeatedGroups(episodes, questionMap);
  audit.lateSlotLegibilityScore = computeLateSlotLegibilityScore(episodes, questionMap);
  audit.agentFrictionBySlot = first90Feed.slotSummaries;
  audit.slotGroupEvidence = first90Feed.slotGroupEvidence;
  audit.questionEvidence = fullYearFeed.questionEvidence;
  audit.councilFlags = fullYearFeed.councilFlags;
  audit.coreSubdomainShare = computeCoreSubdomainShare(feed, episodes, questionMap);
  const observedCorrectValues = first90Feed.slotSummaries
    .map((summary) => summary.observedCorrectRate)
    .filter((value): value is number => value != null);
  const observedTimeoutValues = first90Feed.slotSummaries
    .map((summary) => summary.observedTimeoutRate)
    .filter((value): value is number => value != null);
  const observedShieldValues = first90Feed.slotSummaries
    .map((summary) => summary.observedShieldRate)
    .filter((value): value is number => value != null);
  audit.observedCorrectRate =
    observedCorrectValues.length > 0
      ? Number(
          (
            observedCorrectValues.reduce((sum, value) => sum + value, 0) / observedCorrectValues.length
          ).toFixed(3)
        )
      : null;
  audit.observedTimeoutRate =
    observedTimeoutValues.length > 0
      ? Number(
          (
            observedTimeoutValues.reduce((sum, value) => sum + value, 0) / observedTimeoutValues.length
          ).toFixed(3)
        )
      : null;
  audit.observedShieldRate =
    observedShieldValues.length > 0
      ? Number(
          (
            observedShieldValues.reduce((sum, value) => sum + value, 0) / observedShieldValues.length
          ).toFixed(3)
        )
      : null;
  audit.blendedCorrectRate = Number(
    (
      first90Feed.slotSummaries.reduce((sum, summary) => sum + summary.blendedCorrectRate, 0) /
      first90Feed.slotSummaries.length
    ).toFixed(3)
  );
  audit.telemetrySampleSize = first90Feed.slotSummaries.reduce(
    (sum, summary) => sum + summary.telemetrySampleSize,
    0
  );
  const confidenceRanks = { 'agent-only': 0, emerging: 1, trusted: 2 } as const;
  audit.telemetryConfidence =
    (['agent-only', 'emerging', 'trusted'] as const)[
      Math.max(
        ...first90Feed.slotSummaries.map((summary) => confidenceRanks[summary.telemetryConfidence]),
        0
      )
    ] ?? 'agent-only';
  const replacementEntries = fullYearFeed.questionEvidence.filter((entry) => entry.replacementReason);
  audit.replacementCount = replacementEntries.length;
  audit.replacementReasons = replacementEntries
    .map(
      (entry) =>
        `${entry.date} slot ${entry.slot}: ${entry.questionId} (${entry.replacementReason ?? 'replaced'})`
    )
    .slice(0, 50);
  const gate = evaluatePlayerGate(feed, difficulty, audit, calibrationFeed, first90Feed, fullYearFeed);
  audit.playerGatePass = gate.playerGatePass;
  audit.playerGateFailures = gate.playerGateFailures;
  audit.launchReady =
    gate.playerGatePass &&
    audit.scheduledOffToneCount === 0 &&
    audit.first90BlockedPatternCount === 0 &&
    audit.blockingTasteTagCount === 0 &&
    audit.scheduleEligibleShare === 1 &&
    Object.keys(audit.scheduledBlockedSourceFamilies).length === 0 &&
    audit.crossDifficultyCoreFactOverlap === 0 &&
    audit.crossDifficultyVariantOverlap === 0 &&
    audit.repeatedVariantGroups === 0 &&
    audit.coreFactReuseViolations === 0 &&
    audit.reserveShortfall === 0;
}

async function writeJson(filename: string, value: unknown) {
  await fs.writeFile(path.join(TRIVIA_DIR, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function markReserveOnly(
  library: TriviaQuestionRecord[],
  scheduledQuestionIds: Set<string>
): TriviaQuestionRecord[] {
  return library.map((question) => ({
    ...question,
    reserveOnly: !scheduledQuestionIds.has(question.id),
  }));
}

async function main() {
  logBuildStage('main:start');
  const telemetrySnapshot = await loadTriviaTelemetrySnapshot();
  logBuildStage(`telemetry:questions=${telemetrySnapshot.questions.length}:slots=${telemetrySnapshot.slots.length}`);
  const telemetryMaps = buildTelemetryMaps(telemetrySnapshot);
  if (process.env.TRIVIA_DEBUG_RAW === '1') {
    logBuildStage('debug:raw');
    printRawEligibilityDiagnostics('mix-raw', getMixRawCandidates(), 'domain');
    printRawEligibilityDiagnostics(
      'sports-raw',
      getSportsRawCandidates().filter((record) =>
        Object.prototype.hasOwnProperty.call(SPORTS_SUBDOMAIN_DISTRIBUTION, record.subdomain)
      ),
      'subdomain'
    );
    return;
  }
  logBuildStage('buildPools:mix:start');
  const mixPools = buildDedicatedMixPools();
  logBuildStage('buildPools:mix:done');
  logBuildStage('buildPools:sports:start');
  const sportsPools = buildDedicatedSportsPools();
  logBuildStage('buildPools:sports:done');
  if (process.env.TRIVIA_DEBUG_POOLS === '1') {
    logBuildStage('debug:pools');
    printPoolDiagnostics('mix', mixPools, 'domain');
    printPoolDiagnostics('sports', sportsPools, 'subdomain');
    return;
  }
  if (mixPools.easy.length < MIX_POOL_TARGET || mixPools.hard.length < MIX_POOL_TARGET) {
    throw new Error(
      `Mix pool shortfall: easy=${mixPools.easy.length} hard=${mixPools.hard.length} target=${MIX_POOL_TARGET}.`
    );
  }
  if (sportsPools.easy.length < SPORTS_POOL_TARGET || sportsPools.hard.length < SPORTS_POOL_TARGET) {
    throw new Error(
      `Sports pool shortfall: easy=${sportsPools.easy.length} hard=${sportsPools.hard.length} target=${SPORTS_POOL_TARGET}.`
    );
  }
  const mixLibrary = [...mixPools.easy, ...mixPools.hard];
  const sportsLibrary = [...sportsPools.easy, ...sportsPools.hard];
  logBuildStage(`libraries:mix=${mixLibrary.length}:sports=${sportsLibrary.length}`);
  const mixEasyCoreFacts = new Set(mixPools.easy.map((question) => question.coreFactId));
  const sportsEasyCoreFacts = new Set(sportsPools.easy.map((question) => question.coreFactId));
  const mixCrossOverlap = mixPools.hard.filter((question) => mixEasyCoreFacts.has(question.coreFactId)).length;
  const sportsCrossOverlap = sportsPools.hard.filter((question) => sportsEasyCoreFacts.has(question.coreFactId)).length;
  if (mixCrossOverlap !== 0 || sportsCrossOverlap !== 0) {
    throw new Error(
      `Cross-difficulty core fact overlap detected before scheduling: mix=${mixCrossOverlap} sports=${sportsCrossOverlap}.`
    );
  }

  const invalidMix = mixLibrary.flatMap((question) =>
    validateQuestionRecord(question).map((issue) => `${question.id}: ${issue}`)
  );
  const invalidSports = sportsLibrary.flatMap((question) =>
    validateQuestionRecord(question).map((issue) => `${question.id}: ${issue}`)
  );
  if (invalidMix.length > 0 || invalidSports.length > 0) {
    throw new Error(
      `Trivia question validation failed:\n${[...invalidMix, ...invalidSports].slice(0, 20).join('\n')}`
    );
  }

  const mixHardSchedule = buildEpisodeSchedule('mix', 'hard', mixPools.hard);
  logBuildStage('schedules:mix-hard:done');
  const mixEasySchedule = buildEpisodeSchedule('mix', 'easy', mixPools.easy);
  logBuildStage('schedules:mix-easy:done');
  const sportsHardSchedule = buildEpisodeSchedule('sports', 'hard', sportsPools.hard);
  logBuildStage('schedules:sports-hard:done');
  const sportsEasySchedule = buildEpisodeSchedule('sports', 'easy', sportsPools.easy);
  logBuildStage('schedules:sports-easy:done');
  const schedules = {
    mix: {
      easy: mixEasySchedule,
      hard: mixHardSchedule,
    },
    sports: {
      easy: sportsEasySchedule,
      hard: sportsHardSchedule,
    },
  } as const;
  const replacementLogMap = new Map<string, string>();

  let playerCalibration = buildPlayerCalibrationReport(
    {
      mix: {
        easy: schedules.mix.easy.episodes,
        hard: schedules.mix.hard.episodes,
      },
      sports: {
        easy: schedules.sports.easy.episodes,
        hard: schedules.sports.hard.episodes,
      },
    },
    mixLibrary,
    sportsLibrary,
    telemetryMaps,
    replacementLogMap
  );

  const replacementLogs: ReplacementLogEntry[] = [];
  const rebuildCalibration = () =>
    buildPlayerCalibrationReport(
      {
        mix: {
          easy: schedules.mix.easy.episodes,
          hard: schedules.mix.hard.episodes,
        },
        sports: {
          easy: schedules.sports.easy.episodes,
          hard: schedules.sports.hard.episodes,
        },
      },
      mixLibrary,
      sportsLibrary,
      telemetryMaps,
      replacementLogMap
    );

  const runAutomatedReplacementRounds = (maxRounds: number) => {
    for (let round = 0; round < maxRounds; round += 1) {
      const roundLogs: ReplacementLogEntry[] = [];
      (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
        TRIVIA_DIFFICULTIES.forEach((difficulty) => {
          const library =
            feed === 'mix' ? mixPools[difficulty] : sportsPools[difficulty];
          const logs = applyAutomatedReplacements(
            feed,
            difficulty,
            schedules[feed][difficulty].episodes,
            library,
            playerCalibration.cohorts.fullYear.feeds[feed][difficulty]
          );
          logs.forEach((log) => {
            replacementLogMap.set(
              `${log.date}:${log.slot}:${log.replacementQuestionId}`,
              log.reason
            );
          });
          roundLogs.push(...logs);
        });
      });

      if (roundLogs.length === 0) {
        return;
      }

      replacementLogs.push(...roundLogs);
      playerCalibration = rebuildCalibration();
    }
  };

  runAutomatedReplacementRounds(8);

  let variantCleanupLogs: ReplacementLogEntry[] = [];
  (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
    TRIVIA_DIFFICULTIES.forEach((difficulty) => {
      const library =
        feed === 'mix' ? mixPools[difficulty] : sportsPools[difficulty];
      const logs = applyVariantReuseCleanup(feed, difficulty, schedules[feed][difficulty].episodes, library);
      logs.forEach((log) => {
        replacementLogMap.set(
          `${log.date}:${log.slot}:${log.replacementQuestionId}`,
          log.reason
        );
      });
      variantCleanupLogs.push(...logs);
    });
  });

  if (variantCleanupLogs.length > 0) {
    replacementLogs.push(...variantCleanupLogs);
    playerCalibration = rebuildCalibration();
    runAutomatedReplacementRounds(4);
  }

  (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
    TRIVIA_DIFFICULTIES.forEach((difficulty) => {
      const library =
        feed === 'mix' ? mixPools[difficulty] : sportsPools[difficulty];
      const schedule = schedules[feed][difficulty];
      schedule.audit.playerAgentSummaries = playerCalibration.feeds[feed][difficulty].agentSummaries;
      applyAuditSignals(
        feed,
        difficulty,
        schedule.audit,
        schedule.episodes,
        schedules[feed][difficulty === 'easy' ? 'hard' : 'easy'].episodes,
        library,
        playerCalibration.feeds[feed][difficulty],
        playerCalibration.cohorts.first90.feeds[feed][difficulty],
        playerCalibration.cohorts.fullYear.feeds[feed][difficulty]
      );
    });
  });

  const audit: TriviaAuditReport = {
    version: VERSION,
    generatedAt: ACCESS_DATE,
    scheduleStart: START_DATE_KEY,
    scheduleEnd: getDateKey(addDays(getStartDate(), TOTAL_DAYS - 1)),
    calibrationDays: 28,
    feeds: {
      mix: {
        easy: schedules.mix.easy.audit,
        hard: schedules.mix.hard.audit,
      },
      sports: {
        easy: schedules.sports.easy.audit,
        hard: schedules.sports.hard.audit,
      },
    },
  };

  const mixScheduledIds = new Set([
    ...schedules.mix.easy.episodes.flatMap((episode) => episode.questionIds),
    ...schedules.mix.hard.episodes.flatMap((episode) => episode.questionIds),
  ]);
  const sportsScheduledIds = new Set([
    ...schedules.sports.easy.episodes.flatMap((episode) => episode.questionIds),
    ...schedules.sports.hard.episodes.flatMap((episode) => episode.questionIds),
  ]);
  const finalMixLibrary = markReserveOnly(mixLibrary, mixScheduledIds);
  const finalSportsLibrary = markReserveOnly(sportsLibrary, sportsScheduledIds);

  await writeJson('mixQuestionLibrary.json', finalMixLibrary);
  await writeJson('sportsQuestionLibrary.json', finalSportsLibrary);
  await writeJson('mixEasyEpisodeSchedule.json', schedules.mix.easy.episodes);
  await writeJson('mixHardEpisodeSchedule.json', schedules.mix.hard.episodes);
  await writeJson('sportsEasyEpisodeSchedule.json', schedules.sports.easy.episodes);
  await writeJson('sportsHardEpisodeSchedule.json', schedules.sports.hard.episodes);
  await writeJson('triviaAudit.json', audit);
  await writeJson('triviaPlayerCalibration.json', playerCalibration);

  console.log(
    JSON.stringify(
      {
        mixQuestions: finalMixLibrary.length,
        sportsQuestions: finalSportsLibrary.length,
        mixEasyEpisodes: schedules.mix.easy.episodes.length,
        mixHardEpisodes: schedules.mix.hard.episodes.length,
        sportsEasyEpisodes: schedules.sports.easy.episodes.length,
        sportsHardEpisodes: schedules.sports.hard.episodes.length,
        playerAgents: TRIVIA_SOLVE_AGENTS.length,
        telemetryQuestions: telemetrySnapshot.questions.length,
        telemetrySlots: telemetrySnapshot.slots.length,
        replacements: replacementLogs.length,
      },
      null,
      2
    )
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
