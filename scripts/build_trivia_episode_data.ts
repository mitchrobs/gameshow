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
  TriviaCitation,
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
  TriviaPlayerSlotSummary,
  TriviaPromptKind,
  TriviaQuestionRecord,
  TriviaSourceLabel,
  TriviaSourceTier,
} from '../src/data/trivia/types.ts';
import {
  TRIVIA_PLAYER_AGENTS,
  TRIVIA_PLAYER_CALIBRATION_DAYS,
} from '../src/data/trivia/playerAgents.ts';
import { canArmShield, resolveShieldAfterQuestion } from '../src/data/trivia/gameplay.ts';
import {
  hasGimmickDistractorPattern,
  hasStaleRelativePhrasing,
  validateEpisodeDefinition,
  validateQuestionRecord,
} from '../src/data/trivia/validation.ts';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const TRIVIA_DIR = path.join(ROOT, 'src/data/trivia');
const START_DATE_KEY = '2026-04-26';
const TOTAL_DAYS = 365;
const ACCESS_DATE = '2026-04-26';
const VERSION = 'trivia-v1';
const MIX_LIBRARY_TARGET = 5400;
const SPORTS_LIBRARY_TARGET = 4600;
const SPORTS_VARIANT_COUNTS = {
  easy: 240,
  medium: 420,
  hard: 820,
  easySecond: 120,
  mediumSecond: 300,
  hardSecond: 560,
  easyThird: 60,
  mediumThird: 180,
  hardThird: 320,
  easyFourth: 40,
  mediumFourth: 20,
  hardFourth: 20,
} as const;
const TRIVIA_DIFFICULTIES: TriviaDifficulty[] = ['easy', 'hard'];
const TIMER_SECONDS = 15;
const BASE_POINTS = 100;
const SPEED_BONUS = 50;
const SHIELD_POINTS = 50;
const MIX_SLOT_CONFIDENCE_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.008, 0.012, 0.016, 0.03, 0.04, 0.05, 0.068, 0.082, 0.098, 0.078, 0.084, 0.08],
  hard: [0.045, 0.05, 0.055, 0.08, 0.09, 0.1, 0.14, 0.16, 0.18, 0.29, 0.31, 0.3],
};
const MIX_SLOT_TIMEOUT_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0, 0.001, 0.002, 0.004, 0.005, 0.006, 0.008, 0.011, 0.013, 0.011, 0.012, 0.011],
  hard: [0.001, 0.002, 0.004, 0.008, 0.01, 0.012, 0.016, 0.02, 0.024, 0.038, 0.04, 0.038],
};
const SPORTS_SLOT_CONFIDENCE_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.028, 0.05, 0.074, 0.102, 0.136, 0.158, 0.23, 0.3, 0.35],
  hard: [0.055, 0.08, 0.15, 0.18, 0.19, 0.3, 0.42, 0.52, 0.62],
};
const SPORTS_SLOT_TIMEOUT_ADJUSTMENTS: Record<TriviaDifficulty, number[]> = {
  easy: [0.001, 0.005, 0.009, 0.012, 0.015, 0.018, 0.026, 0.034, 0.042],
  hard: [0.002, 0.006, 0.012, 0.017, 0.019, 0.038, 0.052, 0.068, 0.08],
};
const FIRST_90_CALIBRATION_DAYS = 90;
const FULL_YEAR_CALIBRATION_DAYS = TOTAL_DAYS;
const SPORTS_CURVEBALL_GAP_DAYS = 7;
const SPORTS_CURVEBALL_TARGET_PER_MONTH = 3;
const SPORTS_CURVEBALL_ANCHOR_DAYS = [8, 16, 24] as const;
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
  /\b(best definition|definition of the term|missing word from the popular saying|which word refers|practitioner of the martial art of okinawan origin|female worshippers of god dionysos|self-discipline and refraining from worldly pleasures)\b/i;
const MIX_ARCHIVE_REJECT_REGEX =
  /\b(all of these|none of these|complete this line|missing (?:word|part|letter)|what saying|popular saying|which word in this sentence is incorrectly used|find the (?:missing|next) number|guess the missing number|what number comes next|fill in the missing letter|mode of this list|referring to the previous question|which statement (?:is|about)|one of the following|pmh, psh, sh and fh)\b/i;
const MIX_RELATIONSHIP_REJECT_REGEX =
  /\b(wife|husband|daughter|son|mother|father|brother|sister|cousin|girlfriend|boyfriend|married to|eventual wife|start dating|dating)\b/i;
const MIX_POP_DEEPCUT_REJECT_REGEX =
  /\b(devil went down to georgia|the french connection|the light in the piazza|what about bob|rappers delight|sammy davis jr|tommy lee, vince neil|a thousand clowns|joe mcginnis|wilson pickett|backstairs at the white house|steven tyler and joe perry|osmond brothers|abbott and costello|love connection and lingo|drake and josh|happy days|eric wilson|sublime|the heidi chronicles|night of the living dead and dawn of the dead|james bonds aston martin|the birth of venus, the annunciation, medusa, and flora)\b/i;
const SPORTS_GENERAL_ALLOWED_REGEX =
  /\b(hat trick|home[- ](?:field|court) advantage|playoff|playoffs|overtime|sudden death|photo finish|wild card|seed(?:ed)?|bye week|match point|power play|penalty kill|under par|over par|home team|neutral site|rings|medal positions?|all-star|scoreless|tie-break|safety|relay|torch relay|walk-off)\b/i;
const SPORTS_GENERAL_REJECT_REGEX =
  /\b(chess|scrabble|seinfeld|santa|reindeer|coach on the show|movie|film|tv|television|series|novel|book|song|lyrics|band|actor|actress|fictional|imaginary|girlfriend|wife|brother-in-law|dad(?:'|’)s nickname|real name|ring name|what college did|what year|how many foster homes|what company|which state to have two ivy league colleges|royal palace|bicycle pump|anthrax scare|festivus|what documentary|talk show|world class promotion|wrestlemania storyline|rudolph the red-nosed reindeer|judge|court of appeals|board of education|special force|war was fought|battle of(?! the sexes))\b/i;
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
  /\b(most popular sport|national sport of|favorite football team|favourite football team|mascot|beauties as well|judging by their surnames|what country are they from|how many brothers|profession before becoming|tv ratings|famous sponsor|what honor did|what role did|what is his name|tagline|special force|counter-terrorism|supreme court|court of appeals|board of education|peoples court|judge|lawyer|other company|which war was fought|during which war|battle of marathon|this wrestler played|pretty woman|medal of honor|university of southern california|governor of)\b/i;
const DARK_CONTENT_REGEX =
  /\b(murder|rape|suicide|genocide|torture|massacre|serial killer|fatal disease)\b/i;
const LOW_SIGNAL_REGEX =
  /\b(who said|once said|start dating|dated|cover of (?:what|which) popular magazine|socialite|what popular model|world-famous female model|model turned actress|what manufacturers first|cdma2000|pantyhose|shaving cream|magazine|quote\b|noxema|gto as a separate model|hypermodern opening)\b/i;
const SPORTS_LOW_SIGNAL_LEGACY_REGEX =
  /\b(initial aims of the tiger woods foundation|real first name of golf champion|when he was younger|what age did he start playing golf|golf ball marshal|first ever us masters golf tournament|official colors of the wimbledon tournament|international tennis hall of fame|game winning goal for the detroit red wings in the 1950 stanley cup finals|go kart|peanuts believed to be bad for auto racing|what does nascar stand for|grand prix of endurance|pitching triple crown|what decade witnessed|winningest basketball coach in ncaa history|what are the two shots that are the same movement|what were the initial aims)\b/i;
const SPORTS_ARCHIVE_FRAGMENT_REGEX =
  /\b(?:what job does|what profession before becoming|what age did he start|what are the initials|renamed this to honor|took the cup|where did goaltender|what role did|what honor did|what was his name|how many brothers)\b/i;
const US_MAINSTREAM_SPORTS_REGEX =
  /\b(nfl|nba|mlb|super bowl|world series|march madness|final four|stanley cup|heisman|yankees|lakers|cowboys|patriots|cubs|red sox)\b/i;
const HEAVY_LOOKUP_REGEX =
  /\b(what year|which year|this decade|what decade|record|stat|average|percentage|miles per gallon|model \d|first modern)\b/i;
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
  slotIndex: number;
  usedPromptKinds: Set<TriviaPromptKind>;
  generalSportsCount: number;
  nicheCount: number;
  rotationCount: number;
  minimumRotationTarget: number;
  allowHighRisk: boolean;
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
  prompt: string,
  subdomain: string,
  lookupRisk: TriviaLookupRisk,
  promptKind: TriviaPromptKind
): TriviaObscurityFlag[] {
  const hay = prompt.toLowerCase();
  const flags: TriviaObscurityFlag[] = [];

  if (/\b(surname|judging by|what country are they from)\b/.test(hay)) flags.push('surname-inference');
  if (
    /\b(what number|college did|draft choice|start his career with|first round|position did|which team did .* start)\b/.test(
      hay
    )
  ) {
    flags.push('roster-deep-cut');
  }
  if (/\b(record|streak|how many|what year|average|percentage|all-time|most)\b/.test(hay) || lookupRisk === 'high') {
    flags.push('stat-only');
  }
  if (/\b(which statement|one of the following|odd one out|best describes|what distinction)\b/.test(hay)) {
    flags.push('vague-stem');
  }
  if (SPORTS_MEDIA_TIEIN_REGEX.test(prompt)) flags.push('media-tie-in');
  if (SPORTS_OFF_TONE_REGEX.test(prompt)) flags.push('incidental-context');
  if (/\b(nickname|known as|called|great one|king of|airness|greatest|intimidator|legend)\b/.test(hay)) {
    flags.push('famous-nickname');
  }
  if (SPORTS_TRICK_PATTERN.test(prompt) || (promptKind === 'rule' && /\b(except|unless)\b/.test(hay))) {
    flags.push('edge-case');
  }
  if (prompt.length > 135 || (prompt.match(/,/g) ?? []).length >= 3) flags.push('timer-friction');

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

function isMixEditorialFit(question: TriviaQuestionRecord): boolean {
  if (question.obscurityFlags.includes('vague-stem')) return false;
  if (question.obscurityFlags.includes('timer-friction')) return false;
  if (question.isTrickQuestion && !isAllowedCurveballQuestion('mix', question)) return false;
  if (MIX_ARCHIVE_REJECT_REGEX.test(question.stem)) return false;
  if (MIX_RELATIONSHIP_REJECT_REGEX.test(question.stem)) return false;
  if (MIX_POP_DEEPCUT_REJECT_REGEX.test(question.stem)) return false;
  if (question.stem.length > 145) return false;
  if (question.stem.length > 126 && question.salienceScore < 86) return false;
  if (question.promptKind === 'equipment' && question.domain === 'arts') return false;
  if (question.editorialBucket === 'topical' && question.salienceScore < 80) return false;
  return true;
}

function isAllowedGeneralSportsFallback(question: TriviaQuestionRecord): boolean {
  if (question.subdomain !== 'general-sports') return true;
  if (question.id.includes('sports-supplement')) return false;
  if (!['term', 'rule'].includes(question.promptKind)) return false;
  if (question.salienceScore < 82) return false;
  if (question.lookupRisk !== 'low') return false;
  if (question.obscurityFlags.includes('stat-only')) return false;
  if (question.obscurityFlags.includes('famous-nickname')) return false;
  if (SPORTS_GENERAL_REJECT_REGEX.test(question.stem)) return false;
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

function isSportsEditorialFit(question: TriviaQuestionRecord): boolean {
  const isLegacySportsRow =
    question.id.startsWith('sports-sports-') || question.id.startsWith('sports-sports-supplement-');

  if (isOffToneScheduledSportsQuestion(question)) return false;
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
  if (question.lookupRisk === 'high' && question.salienceScore < 62) return false;
  if (question.obscurityFlags.includes('roster-deep-cut') && question.salienceScore < 82) return false;
  if (question.obscurityFlags.includes('surname-inference')) return false;
  if (
    question.obscurityFlags.includes('stat-only') &&
    question.salienceScore < 80 &&
    !['rule', 'term', 'achievement'].includes(question.promptKind)
  ) {
    return false;
  }
  if (question.isTrickQuestion && !isAllowedCurveballQuestion('sports', question)) return false;
  return question.salienceScore >= 48;
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

function inferLookupRisk(prompt: string, options: string[]): TriviaLookupRisk {
  const hay = `${prompt} ${options.join(' ')}`.toLowerCase();
  const numericCount = (hay.match(/\b\d{4}\b/g) ?? []).length;
  if (numericCount >= 2 || /\b(stat|record|score|year|season|title)\b/.test(hay)) return 'high';
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
  const lookupRisk = question.lookupRisk ?? inferLookupRisk(sanitizedPrompt, question.options);
  const prompt = sanitizedPrompt;
  const answerText = normalizeText(correct);
  const options = [answerText, ...selectedDistractors.map((option) => normalizeText(option))];
  const idBase = `${feed}-${sourceCategory}-${slugify(`${sanitizedPrompt}-${answerText}`)}`;
  const id = variantIndex === 0 ? idBase : `${idBase}-variant-${variantIndex + 1}`;
  const variantGroup = idBase;
  const promptKind =
    question.promptKind ?? inferPromptKind(feed, prompt, answerText, subdomain, domain);
  const obscurityFlags = question.obscurityFlags ?? deriveObscurityFlags(prompt, subdomain, lookupRisk, promptKind);
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
  return {
    id,
    feed,
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
      question.themeTags ??
      (isTrickQuestion ? [editorialBucket, subdomain, 'trick'] : [editorialBucket, subdomain]),
  };
}

function dedupeQuestionRecords(records: TriviaQuestionRecord[]): TriviaQuestionRecord[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
}

function getMixCandidates(): TriviaQuestionRecord[] {
  const categories = Array.from(legacyMixCategories as any[]);
  const rows: { sourceCategory: string; question: SourceTriviaQuestion }[] = [];

  categories.forEach((category) => {
    category.questions.forEach((question: SourceTriviaQuestion) => {
      const hay = `${question.prompt} ${question.options.join(' ')}`;
      if (SPORTS_REGEX.test(hay)) return;
      if (!isEligibleQuestion(question.prompt, question.options)) return;
      rows.push({
        sourceCategory: `curated-mix-${category.id}`,
        question: buildMixCuratedLead(category.id, question),
      });
    });
  });

  const curatedRows = CURATED_MIX_PATCHES.filter((question) => isEligibleQuestion(question.prompt, question.options)).map(
    (question) => ({ sourceCategory: 'curated-mix', question })
  );

  const scored = [...rows, ...curatedRows]
    .map(({ sourceCategory, question }) => buildQuestionRecord('mix', sourceCategory, question))
    .filter((record) => isMixEditorialFit(record))
    .map((record) => ({
      record,
      score: scoreQuestion(record.stem, record.options, record.editorialBucket ?? 'evergreen') + record.salienceScore,
    }))
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));

  const byDifficulty = new Map<TriviaDifficultyTarget, TriviaQuestionRecord[]>();
  ([1, 2, 3] as TriviaDifficultyTarget[]).forEach((difficulty) => {
    byDifficulty.set(
      difficulty,
      scored.filter((entry) => entry.record.difficultyTarget === difficulty).map((entry) => entry.record)
    );
  });

  const easy = (byDifficulty.get(1) ?? []).slice(0, 1550);
  const medium = (byDifficulty.get(2) ?? []).slice(0, 1650);
  const hard = (byDifficulty.get(3) ?? []).slice(0, MIX_LIBRARY_TARGET - easy.length - medium.length);
  const candidates = dedupeQuestionRecords([...easy, ...medium, ...hard]);

  return seededShuffle(candidates, hashString('mix-library'));
}

function getSportsSupplementalCandidates(): SourceTriviaQuestion[] {
  const categories = Array.from(legacyMixCategories as any[]);
  const matches: SourceTriviaQuestion[] = [];
  categories.forEach((category) => {
    category.questions.forEach((question: SourceTriviaQuestion) => {
      if (!isSportsSupplementQuestion(question)) return;
      if (!isEligibleQuestion(question.prompt, question.options)) return;
      matches.push(question);
    });
  });
  return matches;
}

function getSportsCandidates(): TriviaQuestionRecord[] {
  const baseSports = SPORTS_DAILY_PACKS.flat().filter((question) =>
    isEligibleQuestion(question.prompt, question.options)
  );
  const curatedBoosters = CURATED_SPORTS_BOOSTERS.filter((question) =>
    isEligibleQuestion(question.prompt, question.options)
  );
  const supplemental = getSportsSupplementalCandidates();

  const acceptedBase = baseSports
    .map((question) => ({ question, record: buildQuestionRecord('sports', 'curated-sports-core', question) }))
    .filter(({ record }) => isSportsEditorialFit(record));
  const acceptedCurated = curatedBoosters
    .map((question) => ({ question, record: buildQuestionRecord('sports', 'curated-sports', question) }))
    .filter(({ record }) => isSportsEditorialFit(record));
  const acceptedSupplemental = supplemental
    .map((question) => ({
      question,
      record: buildQuestionRecord('sports', 'sports-supplement', question),
    }))
    .filter(({ record }) => record.subdomain !== 'general-sports' && isSportsEditorialFit(record) && record.salienceScore >= 80);

  const records = [
    ...acceptedBase.map(({ record }) => record),
    ...acceptedCurated.map(({ record }) => record),
    ...acceptedSupplemental.map(({ record }) => record),
  ];

  const curatedVariantSources = [...acceptedCurated];
  const easySources = curatedVariantSources
    .filter(({ record }) => record.difficultyTarget === 1)
    .map(({ question }) => question);
  const mediumSources = curatedVariantSources
    .filter(({ record }) => record.difficultyTarget === 2 && isSportsVariantSourceRecord(record))
    .map(({ question }) => question);
  const hardSources = curatedVariantSources
    .filter(({ record }) => record.difficultyTarget === 3 && isSportsVariantSourceRecord(record))
    .map(({ question }) => question);

  const variantPool = [
    ...easySources.slice(0, SPORTS_VARIANT_COUNTS.easy).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 1)
    ),
    ...mediumSources.slice(0, SPORTS_VARIANT_COUNTS.medium).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 1)
    ),
    ...hardSources.slice(0, SPORTS_VARIANT_COUNTS.hard).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 1)
    ),
    ...easySources.slice(0, SPORTS_VARIANT_COUNTS.easySecond).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 2)
    ),
    ...mediumSources.slice(0, SPORTS_VARIANT_COUNTS.mediumSecond).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 2)
    ),
    ...hardSources.slice(0, SPORTS_VARIANT_COUNTS.hardSecond).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 2)
    ),
    ...easySources.slice(0, SPORTS_VARIANT_COUNTS.easyThird).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 3)
    ),
    ...mediumSources.slice(0, SPORTS_VARIANT_COUNTS.mediumThird).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 3)
    ),
    ...hardSources.slice(0, SPORTS_VARIANT_COUNTS.hardThird).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 3)
    ),
    ...easySources.slice(0, SPORTS_VARIANT_COUNTS.easyFourth).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 4)
    ),
    ...mediumSources.slice(0, SPORTS_VARIANT_COUNTS.mediumFourth).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 4)
    ),
    ...hardSources.slice(0, SPORTS_VARIANT_COUNTS.hardFourth).map((question) =>
      buildQuestionRecord('sports', 'curated-sports-core', question, 4)
    ),
  ].filter((record) => isSportsEditorialFit(record));

  const combined = dedupeQuestionRecords(
    [...records, ...variantPool]
      .map((record) => ({
        record,
        score:
          scoreQuestion(record.stem, record.options, record.editorialBucket ?? 'evergreen') +
          record.salienceScore -
          (record.curveballOnly ? -36 : record.isTrickQuestion ? -10 : 0) -
          (record.sourceTier === 'curated' ? 0 : record.sourceTier === 'supplemental' ? 10 : record.sourceTier === 'legacy' ? 24 : 42) -
          (record.id.includes('-variant-5')
            ? 134
            : record.id.includes('-variant-4')
              ? 108
              : record.id.includes('-variant-3')
                ? 82
                : record.id.includes('-variant-2')
                  ? 52
                  : 0) -
          (record.legacyFamily !== 'none' ? 28 : 0),
      }))
      .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id))
      .map((entry) => entry.record)
  );

  const byDifficulty = new Map<TriviaDifficultyTarget, TriviaQuestionRecord[]>();
  ([1, 2, 3] as TriviaDifficultyTarget[]).forEach((difficulty) => {
    byDifficulty.set(
      difficulty,
      combined.filter((entry) => entry.difficultyTarget === difficulty)
    );
  });

  const easy = (byDifficulty.get(1) ?? []).slice(0, 1200);
  const medium = (byDifficulty.get(2) ?? []).slice(0, 1300);
  const hard = (byDifficulty.get(3) ?? []).slice(0, SPORTS_LIBRARY_TARGET - easy.length - medium.length);
  const combinedSelection = [...easy, ...medium, ...hard];

  return [...combinedSelection].sort((left, right) => {
    const leftVariantPenalty = left.id.includes('-variant-') ? 1 : 0;
    const rightVariantPenalty = right.id.includes('-variant-') ? 1 : 0;
    if (leftVariantPenalty !== rightVariantPenalty) return leftVariantPenalty - rightVariantPenalty;
    if (left.difficultyTarget !== right.difficultyTarget) return left.difficultyTarget - right.difficultyTarget;
    if (left.salienceScore !== right.salienceScore) return right.salienceScore - left.salienceScore;
    const leftLookupPenalty = left.lookupRisk === 'low' ? 0 : left.lookupRisk === 'medium' ? 1 : 2;
    const rightLookupPenalty = right.lookupRisk === 'low' ? 0 : right.lookupRisk === 'medium' ? 1 : 2;
    if (leftLookupPenalty !== rightLookupPenalty) return leftLookupPenalty - rightLookupPenalty;
    if (left.stem.length !== right.stem.length) return left.stem.length - right.stem.length;
    return left.id.localeCompare(right.id);
  });
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
      ? [80, 79, 78, 78, 77, 76, 72, 70, 69, 74, 74, 74]
      : [76, 73, 72, 71, 69, 68, 67, 66, 64, 60, 59, 58];
  const maxSalienceScores =
    difficulty === 'easy'
      ? [88, 86, 85, 84, 82, 81, 77, 75, 74, 77, 77, 77]
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
              : 71
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
    difficulty === 'easy' ? [1, 1, 2, 2, 3, 3, 3, 3, 3] : [1, 2, 2, 3, 3, 3, 3, 3, 3];
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
    difficulty === 'easy' ? [81, 79, 76, 74, 72, 70, 69, 67, 66] : [78, 74, 70, 68, 67, 63, 61, 59, 58];
  const slotMaxSalience =
    difficulty === 'easy' ? [90, 88, 84, 82, 78, 76, 74, 72, 71] : [86, 82, 78, 76, 75, 70, 67, 65, 64];
  const slotTargetSalience =
    difficulty === 'easy' ? [80, 78, 75, 73, 70, 68, 66, 64, 63] : [78, 73, 69, 67, 66, 61, 58, 56, 55];
  const slotPromptKinds: TriviaPromptKind[][] =
    difficulty === 'easy'
      ? [
          ['achievement', 'rule', 'term', 'team', 'sport-id', 'player'],
          ['player', 'achievement', 'term', 'team', 'sport-id', 'rule'],
          ['player', 'achievement', 'venue', 'term', 'rule', 'team'],
          ['player', 'achievement', 'event', 'term', 'rule', 'sport-id'],
          ['player', 'event', 'achievement', 'term', 'rule', 'venue'],
          ['player', 'record', 'achievement', 'event', 'rule', 'term', 'sport-id'],
          ['player', 'record', 'event', 'achievement', 'rule', 'term', 'venue'],
          ['player', 'record', 'event', 'achievement', 'rule', 'term'],
          ['player', 'record', 'event', 'achievement', 'rule', 'term'],
        ]
      : [
          ['player', 'achievement', 'team', 'venue', 'term', 'rule'],
          ['player', 'event', 'achievement', 'term', 'rule', 'venue'],
          ['record', 'player', 'event', 'achievement', 'term', 'rule'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term', 'sport-id'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term', 'sport-id'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term', 'sport-id'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term', 'sport-id'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term'],
          ['record', 'player', 'event', 'achievement', 'rule', 'term'],
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
    if (question.curveballOnly && !requireTrickQuestion) return false;
    if (question.obscurityFlags.some((flag) => SPORTS_BLOCKED_FLAGS.includes(flag))) return false;
    if (state.slotIndex >= 4 && question.sourceTier === 'legacy') return false;
    if (state.slotIndex >= 8 && !['curated', 'variant'].includes(question.sourceTier)) return false;
    if (state.slotIndex >= 6 && ['team', 'venue'].includes(question.promptKind)) return false;
    if (
      state.slotIndex >= 1 &&
      question.lookupRisk === 'low' &&
      question.salienceScore >= 84 &&
      ['team', 'term', 'rule'].includes(question.promptKind)
    ) {
      return false;
    }
    if (
      state.slotIndex >= 6 &&
      question.promptKind === 'achievement' &&
      question.salienceScore >= 84
    ) {
      return false;
    }
    if (
      state.slotIndex >= 6 &&
      ['term', 'rule'].includes(question.promptKind) &&
      question.lookupRisk === 'low' &&
      question.salienceScore >= 82
    ) {
      return false;
    }
    if (
      state.slotIndex >= 5 &&
      ['term', 'rule'].includes(question.promptKind) &&
      question.salienceScore >= 79
    ) {
      return false;
    }
    if (
      state.slotIndex >= 8 &&
      question.promptKind === 'sport-id' &&
      question.salienceScore >= 76
    ) {
      return false;
    }
    if (!state.allowHighRisk && question.lookupRisk === 'high') return false;
    if (SPORTS_CORE_SUBDOMAINS.has(question.subdomain)) {
      const remainingSportsSlots = 9 - state.slotIndex;
      const rotationsNeeded = state.minimumRotationTarget - state.rotationCount;
      if (rotationsNeeded > 0 && remainingSportsSlots <= rotationsNeeded) return false;
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
  const allowsRepeatedSportsSubdomain = (question: TriviaQuestionRecord) =>
    state.feed === 'sports' &&
    key === 'subdomain' &&
    question.sourceTier !== 'legacy' &&
    question.legacyFamily === 'none' &&
    (
      (
        state.slotIndex >= (question.subdomain === 'hockey' ? 6 : 4) &&
        SPORTS_REPEATABLE_CORE_SUBDOMAINS.has(question.subdomain) &&
        question.salienceScore >= (state.slotIndex >= 6 ? (question.subdomain === 'hockey' ? 84 : 82) : 84)
      ) ||
      (
        state.slotIndex >= 5 &&
        SPORTS_ROTATION_SUBDOMAINS.has(question.subdomain) &&
        question.sourceTier === 'curated' &&
        question.salienceScore >= (state.slotIndex >= 7 ? 82 : 84)
      )
    );
  const canUseTaxonomyKey = (question: TriviaQuestionRecord) =>
    !usedKeysInEpisode.has(question[key]) || allowsRepeatedSportsSubdomain(question);
  const primary = questions.filter((question) => {
    if (usedIds.has(question.id)) return false;
    if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
    if (question.difficultyTarget !== config.difficulty) return false;
    if (!config.buckets.includes(question.editorialBucket ?? 'evergreen')) return false;
    if (requireTrickQuestion && !question.isTrickQuestion) return false;
    if (avoidTrickQuestion && question.isTrickQuestion) return false;
    if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
    if (config.minSalienceScore && question.salienceScore < config.minSalienceScore) return false;
    if (config.blockedObscurityFlags && question.obscurityFlags.some((flag) => config.blockedObscurityFlags?.includes(flag))) {
      return false;
    }
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
  const pool =
    uniqueSecondaryPromptKinds.length > 0
      ? uniqueSecondaryPromptKinds
      : uniqueSecondary.length > 0
        ? uniqueSecondary
        : secondaryPromptKinds.length > 0
          ? secondaryPromptKinds
          : secondary.length > 0
            ? secondary
            : uniquePrimaryPromptKinds.length > 0
              ? uniquePrimaryPromptKinds
              : uniquePrimary.length > 0
                ? uniquePrimary
                : uniquePromptKinds.length > 0
                  ? uniquePromptKinds
                  : candidatePool;
  if (pool.length === 0) {
    if (requireTrickQuestion) {
      const trickFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
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
      const nonTrickAdjacentFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
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
        if (!passesSportsStateGuard(question)) return false;
        if (violatesSportsEpisodeCaps(question)) return false;
        return true;
      });
      if (finalFlexibleFallback) {
        return finalFlexibleFallback;
      }

      const finalUltraFallback = questions.find((question) => {
        if (usedIds.has(question.id)) return false;
        if (!passesSportsStateGuard(question)) return false;
        return true;
      });
      if (finalUltraFallback) {
        return finalUltraFallback;
      }

      const emergencyFallback = questions.find((question) => !usedIds.has(question.id));
      if (emergencyFallback) {
        return emergencyFallback;
      }

      if (state.allowHighRisk) {
        throw new Error(
          `Unable to fill non-trick slot for ${state.feed}:${state.slotIndex + 1} ${key}/${config.difficulty}`
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
      if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
      if (!passesSportsStateGuard(question)) return false;
      if (violatesSportsEpisodeCaps(question)) return false;
      return question.difficultyTarget === config.difficulty;
    });
    if (fallback) {
      return fallback;
    }

    const variantFallback = questions.find((question) => {
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
      if (entitySet.size > 0 && question.entities.some((entity) => entitySet.has(entity))) return false;
      if (!passesSportsStateGuard(question)) return false;
      if (violatesSportsEpisodeCaps(question)) return false;
      return question.difficultyTarget === config.difficulty;
    });
    if (variantFallback) {
      return variantFallback;
    }

    const adjacentDifficultyFallback = questions.find((question) => {
      if (usedIds.has(question.id)) return false;
      if (question.variantGroup && usedVariantGroups.has(question.variantGroup)) return false;
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
        (entitySet.size === 0 || !question.entities.some((entity) => entitySet.has(entity))) &&
        passesSportsStateGuard(question) &&
        (!avoidTrickQuestion || !question.isTrickQuestion)
    );
    if (repeatedVariantFallback) {
      return repeatedVariantFallback;
    }

    const ultraFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
        passesSportsStateGuard(question) &&
        (!avoidTrickQuestion || !question.isTrickQuestion)
    );
    if (ultraFallback) {
      return ultraFallback;
    }

    const emergencyFallback = questions.find(
      (question) =>
        !usedIds.has(question.id) &&
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

    throw new Error(
      `Unable to fill trivia schedule slot for ${state.feed}:${state.slotIndex + 1} ${key}/${config.difficulty} ` +
        `allowHighRisk=${state.allowHighRisk} usedPromptKinds=${[...state.usedPromptKinds].join(',')} ` +
        `usedKeys=${[...usedKeysInEpisode].join(',')}`
    );
  }

  const order = key === 'domain' ? (config as MixSlotConfig).domainOrder : (config as SportsSlotConfig).subdomainOrder;
  pool.sort((left, right) => {
    const leftIndex = order.indexOf(left[key]);
    const rightIndex = order.indexOf(right[key]);
    const normalizedLeftIndex = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const normalizedRightIndex = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
    if (normalizedLeftIndex !== normalizedRightIndex) return normalizedLeftIndex - normalizedRightIndex;
    if (config.preferredPromptKinds) {
      const leftPromptIndex = config.preferredPromptKinds.indexOf(left.promptKind);
      const rightPromptIndex = config.preferredPromptKinds.indexOf(right.promptKind);
      if (leftPromptIndex !== rightPromptIndex) {
        const normalizedLeft = leftPromptIndex === -1 ? Number.MAX_SAFE_INTEGER : leftPromptIndex;
        const normalizedRight = rightPromptIndex === -1 ? Number.MAX_SAFE_INTEGER : rightPromptIndex;
        if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
      }
    }
    if (state.feed === 'sports') {
      const sourcePenalty = (question: TriviaQuestionRecord) => {
        let penalty = question.sourceTier === 'curated' ? 0 : question.sourceTier === 'supplemental' ? 1 : question.sourceTier === 'legacy' ? 2 : 3;
        if (state.slotIndex >= 8 && question.sourceTier !== 'curated') penalty += 1;
        if (state.slotIndex >= 6 && question.legacyFamily !== 'none') penalty += 1;
        return penalty;
      };
      const leftPenalty = sourcePenalty(left);
      const rightPenalty = sourcePenalty(right);
      if (leftPenalty !== rightPenalty) return leftPenalty - rightPenalty;
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

  const pool = [...fallbackPool];
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
  library: TriviaQuestionRecord[]
): {
  episodes: TriviaEpisodeDefinition[];
  audit: TriviaAuditReport['feeds'][TriviaFeed][TriviaDifficulty];
} {
  const usedIds = new Set<string>();
  const usedVariantGroups = new Set<string>();
  const trickCountByMonth = new Map<string, number>();
  const episodes: TriviaEpisodeDefinition[] = [];
  const recentEntities: string[] = [];
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
    const usedTaxonomyKeys = new Set<string>();
    const usedPromptKinds = new Set<TriviaPromptKind>();
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
    const minimumRotationTarget = feed === 'sports' ? (offset >= 150 ? 3 : 2) : 0;

    slotConfigs.forEach((config, index) => {
      const allowFlexibleTrickQuestion = false;
      const requireTrickQuestion = trickDue && !trickUsedToday && index === preferredTrickSlot;
      const avoidTrickQuestion = !(requireTrickQuestion || allowFlexibleTrickQuestion);
      let question: TriviaQuestionRecord;
      try {
        const selectionState = {
          feed,
          slotIndex: index,
          usedPromptKinds,
          generalSportsCount,
          nicheCount,
          rotationCount,
          minimumRotationTarget,
          allowHighRisk: !highRiskUsedToday && offset - lastHighRiskDayOffset >= 3,
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
          const sourceQuestions =
            feed === 'sports' && !requireTrickQuestion
              ? library.filter((candidate) => !candidate.isTrickQuestion)
              : library;
          question = pickQuestionForSlot(
            sourceQuestions,
            usedIds,
            usedVariantGroups,
            recentEntities,
            config,
            feed === 'mix' ? 'domain' : 'subdomain',
            usedTaxonomyKeys,
            selectionState,
            requireTrickQuestion,
            avoidTrickQuestion
          );
        }
      } catch (error) {
        throw new Error(
          `Failed to schedule ${feed}/${dateKey} slot ${index + 1} after using ${usedIds.size} questions: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      usedIds.add(question.id);
      if (question.variantGroup) usedVariantGroups.add(question.variantGroup);
      usedTaxonomyKeys.add(feed === 'mix' ? question.domain : question.subdomain);
      usedPromptKinds.add(question.promptKind);
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
      }
    });

    const episode: TriviaEpisodeDefinition = {
      date: dateKey,
      feed,
      difficulty,
      questionIds,
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
      scheduledCount: usedIds.size,
      reserveCount: library.length - usedIds.size,
      refreshableCount,
      byBucket: bucketCounts,
      byDifficulty: difficultyCounts,
      rollingQuotaViolations,
      staleQuestionCount,
      repeatedVariantGroups: usedIds.size - usedVariantGroups.size,
      variantReuseCount: usedIds.size - usedVariantGroups.size,
      trickQuestionCount,
      scheduledOffToneCount: 0,
      lateSlotGeneralSportsCount: 0,
      curveballSpacingViolations: 0,
      first90BlockedPatternCount: 0,
      curveballCoverageByMonth: {},
      topRepeatedGroups: [],
      lateSlotLegibilityScore: 0,
      agentFrictionBySlot: [],
      coreSubdomainShare: 0,
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
    confidence += agent.archetype === 'analytical' ? 0.03 : -0.02;
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
  sampleDays = TRIVIA_PLAYER_CALIBRATION_DAYS
): TriviaPlayerCalibrationFeedReport {
  const sampleEpisodes = episodes.slice(0, sampleDays);
  const agentSummaries: TriviaPlayerAgentSummary[] = [];
  const daySamples: TriviaPlayerDaySample[] = [];
  const slotStats = new Map<number, { total: number; correct: number; timeouts: number; shields: number }>();

  TRIVIA_PLAYER_AGENTS.forEach((agent) => {
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
        };
        slotStat.total += 1;
        slotStats.set(questionIndex + 1, slotStat);

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
        }

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
          const speedRoll = randomFromKey(`${agent.id}:${feed}:${episode.date}:${question.id}:speed`);
          const timeRemaining = Math.max(
            1,
            Math.round(TIMER_SECONDS * clamp(0.28 + confidence * 0.5 - speedRoll * 0.22, 0.12, 0.95))
          );
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

  return {
    feed,
    difficulty,
    sampleDays: sampleEpisodes.length,
    agentSummaries,
    daySamples: daySamples.sort((left, right) => left.correctCount - right.correctCount).slice(0, 6),
    slotSummaries: [...slotStats.entries()]
      .sort(([left], [right]) => left - right)
      .map(([slot, stat]) => ({
        slot,
        averageCorrectRate: Number((stat.correct / stat.total).toFixed(3)),
        timeoutRate: Number((stat.timeouts / stat.total).toFixed(3)),
        shieldUseRate: Number((stat.shields / stat.total).toFixed(3)),
      })),
  };
}

function buildPlayerCalibrationReport(
  schedules: Record<TriviaFeed, Record<TriviaDifficulty, TriviaEpisodeDefinition[]>>,
  mixLibrary: TriviaQuestionRecord[],
  sportsLibrary: TriviaQuestionRecord[]
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
        TRIVIA_PLAYER_CALIBRATION_DAYS
      );
      first90Feeds[feed][difficulty] = simulateCalibrationFeed(
        feed,
        difficulty,
        episodes,
        questionMap,
        FIRST_90_CALIBRATION_DAYS
      );
      fullYearFeeds[feed][difficulty] = simulateCalibrationFeed(
        feed,
        difficulty,
        episodes,
        questionMap,
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

        if (feed === 'sports') {
          return episodeCount + (!isSportsEditorialFit(question) || isOffToneScheduledSportsQuestion(question) ? 1 : 0);
        }

        const isMixOffTone =
          question.obscurityFlags.includes('vague-stem') ||
          question.obscurityFlags.includes('timer-friction') ||
          (question.isTrickQuestion ? !isAllowedCurveballQuestion(feed, question) : false);
        return episodeCount + (isMixOffTone ? 1 : 0);
      }, 0)
    );
  }, 0);
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
  const scheduledCurveballId =
    episode.questionIds[2] && questionMap.get(episode.questionIds[2])?.isTrickQuestion
      ? episode.questionIds[2]
      : episode.questionIds.find((questionId) => questionMap.get(questionId)?.isTrickQuestion);
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

  const curveballCoverageEntries = Object.entries(audit.curveballCoverageByMonth).sort(([left], [right]) =>
    left.localeCompare(right)
  );
  const startMonth = START_DATE_KEY.slice(0, 7);
  const endMonth = getDateKey(addDays(getStartDate(), TOTAL_DAYS - 1)).slice(0, 7);
  curveballCoverageEntries.forEach(([monthKey, count]) => {
    if (monthKey === startMonth || monthKey === endMonth) {
      if (count < 1) failures.push(`curveballCoverage:${monthKey}=${count}`);
      return;
    }
    if (count !== 3) failures.push(`curveballCoverage:${monthKey}=${count}`);
  });

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
    if (audit.scheduledOffToneCount !== 0) {
      failures.push(`scheduledOffToneCount=${audit.scheduledOffToneCount}`);
    }
    if (audit.lateSlotGeneralSportsCount !== 0) {
      failures.push(`lateSlotGeneralSportsCount=${audit.lateSlotGeneralSportsCount}`);
    }
    if (audit.curveballSpacingViolations !== 0) {
      failures.push(`curveballSpacingViolations=${audit.curveballSpacingViolations}`);
    }
    if (audit.repeatedVariantGroups > 300) {
      failures.push(`repeatedVariantGroups=${audit.repeatedVariantGroups}`);
    }
    if (audit.reserveCount < 250) {
      failures.push(`reserveCount=${audit.reserveCount}`);
    }
    if (audit.first90BlockedPatternCount !== 0) {
      failures.push(`first90BlockedPatternCount=${audit.first90BlockedPatternCount}`);
    }
    if (audit.coreSubdomainShare < 0.68 || audit.coreSubdomainShare > 0.8) {
      failures.push(`coreSubdomainShare=${audit.coreSubdomainShare}`);
    }

    if (difficulty === 'easy') {
      expectGroupRange('sports-q1-q2', [1, 2], 0.78, 0.86);
      expectGroupRange('sports-q3-q5', [3, 4, 5], 0.55, 0.66);
      expectSlotRange(6, 0.36, 0.46);
      expectGroupRange('sports-q7-q9', [7, 8, 9], 0.22, 0.32);
    } else {
      expectGroupRange('sports-q1-q2', [1, 2], 0.5, 0.77);
      expectGroupRange('sports-q3-q5', [3, 4, 5], 0.31, 0.45);
      expectSlotRange(6, 0.1, 0.33);
      expectGroupRange('sports-q7-q9', [7, 8, 9], 0.03, 0.13);
    }

    const commuter = byAgent.get('commuter-max');
    if (
      !commuter ||
      commuter.averageCorrect < (difficulty === 'easy' ? 4 : 2.6) ||
      commuter.timeoutRate > 0.16
    ) {
      failures.push(
        `commuter-max averageCorrect=${commuter?.averageCorrect ?? 'missing'} timeoutRate=${commuter?.timeoutRate ?? 'missing'}`
      );
    }

    const culture = byAgent.get('culture-maya');
    if (!culture || culture.averageCorrect < (difficulty === 'easy' ? 3.8 : 2.8)) {
      failures.push(`culture-maya averageCorrect=${culture?.averageCorrect ?? 'missing'}`);
    }

    const sportsCore = byAgent.get('sports-ryan');
    if (
      !sportsCore ||
      sportsCore.averageCorrect < (difficulty === 'easy' ? 5.5 : 4.8) ||
      sportsCore.shieldUseRate >= (difficulty === 'easy' ? 0.55 : 0.4)
    ) {
      failures.push(`sports-ryan averageCorrect=${sportsCore?.averageCorrect ?? 'missing'}`);
    }

    const broad = byAgent.get('broad-ava');
    if (
      !broad ||
      broad.averageCorrect < (difficulty === 'easy' ? 4.8 : 3.8) ||
      broad.shieldUseRate >= (difficulty === 'easy' ? 0.6 : 0.45)
    ) {
      failures.push(`broad-ava averageCorrect=${broad?.averageCorrect ?? 'missing'}`);
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
    if (audit.first90BlockedPatternCount !== 0) {
      failures.push(`first90BlockedPatternCount=${audit.first90BlockedPatternCount}`);
    }
    if (difficulty === 'easy') {
      expectGroupRange('mix-q1-q3', [1, 2, 3], 0.85, 0.93);
      expectGroupRange('mix-q4-q6', [4, 5, 6], 0.72, 0.82);
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

    const commuter = byAgent.get('commuter-max');
    if (
      !commuter ||
      commuter.averageCorrect < (difficulty === 'easy' ? 6 : 4) ||
      commuter.timeoutRate > 0.14
    ) {
      failures.push(
        `commuter-max averageCorrect=${commuter?.averageCorrect ?? 'missing'} timeoutRate=${commuter?.timeoutRate ?? 'missing'}`
      );
    }
    if ((byAgent.get('culture-maya')?.averageCorrect ?? 0) < (difficulty === 'easy' ? 7 : 5.5)) {
      failures.push(`culture-maya averageCorrect=${byAgent.get('culture-maya')?.averageCorrect ?? 'missing'}`);
    }
    if ((byAgent.get('broad-ava')?.averageCorrect ?? 0) < (difficulty === 'easy' ? 6.4 : 5)) {
      failures.push(`broad-ava averageCorrect=${byAgent.get('broad-ava')?.averageCorrect ?? 'missing'}`);
    }

    ['culture-maya', 'broad-ava', 'analyst-eli'].forEach((agentId) => {
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
  library: TriviaQuestionRecord[],
  calibrationFeed: TriviaPlayerCalibrationFeedReport,
  first90Feed: TriviaPlayerCalibrationFeedReport,
  fullYearFeed: TriviaPlayerCalibrationFeedReport
) {
  const questionMap = buildQuestionMap(library);
  audit.variantReuseCount = audit.repeatedVariantGroups;
  audit.scheduledOffToneCount = countScheduledOffToneQuestions(feed, episodes, questionMap);
  audit.lateSlotGeneralSportsCount = countLateSlotGeneralSportsQuestions(feed, episodes, questionMap);
  audit.curveballSpacingViolations = countCurveballSpacingViolations(feed, episodes, questionMap);
  audit.first90BlockedPatternCount = countFirst90BlockedPatterns(feed, episodes, questionMap);
  audit.curveballCoverageByMonth = getCurveballCoverageByMonth(feed, episodes, questionMap);
  audit.topRepeatedGroups = buildTopRepeatedGroups(episodes, questionMap);
  audit.lateSlotLegibilityScore = computeLateSlotLegibilityScore(episodes, questionMap);
  audit.agentFrictionBySlot = first90Feed.slotSummaries;
  audit.coreSubdomainShare = computeCoreSubdomainShare(feed, episodes, questionMap);
  const gate = evaluatePlayerGate(feed, difficulty, audit, calibrationFeed, first90Feed, fullYearFeed);
  audit.playerGatePass = gate.playerGatePass;
  audit.playerGateFailures = gate.playerGateFailures;
  audit.launchReady = gate.playerGatePass && audit.first90BlockedPatternCount === 0;
}

async function writeJson(filename: string, value: unknown) {
  await fs.writeFile(path.join(TRIVIA_DIR, filename), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function main() {
  const mixLibrary = getMixCandidates();
  const sportsLibrary = getSportsCandidates();

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

  const schedules = {
    mix: {
      easy: buildEpisodeSchedule('mix', 'easy', mixLibrary),
      hard: buildEpisodeSchedule('mix', 'hard', mixLibrary),
    },
    sports: {
      easy: buildEpisodeSchedule('sports', 'easy', sportsLibrary),
      hard: buildEpisodeSchedule('sports', 'hard', sportsLibrary),
    },
  } as const;
  const playerCalibration = buildPlayerCalibrationReport(
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
    sportsLibrary
  );

  (['mix', 'sports'] as TriviaFeed[]).forEach((feed) => {
    const library = feed === 'mix' ? mixLibrary : sportsLibrary;
    TRIVIA_DIFFICULTIES.forEach((difficulty) => {
      const schedule = schedules[feed][difficulty];
      schedule.audit.playerAgentSummaries = playerCalibration.feeds[feed][difficulty].agentSummaries;
      applyAuditSignals(
        feed,
        difficulty,
        schedule.audit,
        schedule.episodes,
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

  await writeJson('mixQuestionLibrary.json', mixLibrary);
  await writeJson('sportsQuestionLibrary.json', sportsLibrary);
  await writeJson('mixEasyEpisodeSchedule.json', schedules.mix.easy.episodes);
  await writeJson('mixHardEpisodeSchedule.json', schedules.mix.hard.episodes);
  await writeJson('sportsEasyEpisodeSchedule.json', schedules.sports.easy.episodes);
  await writeJson('sportsHardEpisodeSchedule.json', schedules.sports.hard.episodes);
  await writeJson('triviaAudit.json', audit);
  await writeJson('triviaPlayerCalibration.json', playerCalibration);

  console.log(
    JSON.stringify(
      {
        mixQuestions: mixLibrary.length,
        sportsQuestions: sportsLibrary.length,
        mixEasyEpisodes: schedules.mix.easy.episodes.length,
        mixHardEpisodes: schedules.mix.hard.episodes.length,
        sportsEasyEpisodes: schedules.sports.easy.episodes.length,
        sportsHardEpisodes: schedules.sports.hard.episodes.length,
        playerAgents: TRIVIA_PLAYER_AGENTS.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
