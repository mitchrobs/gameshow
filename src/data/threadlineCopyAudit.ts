import type { ThreadlineDifficulty, ThreadlinePuzzle } from './threadlinePuzzles';
import {
  THREADLINE_RECENTLY_RETIRED_LEAD_COPY,
  isThreadlineMechanicalWeave,
  isThreadlineRoboticLead,
  isThreadlineRoboticTitle,
  normalizeThreadlineEditorialTokenText,
} from './threadlineEditorialCopy.ts';
import { THREADLINE_REJECTED_COPY_ANSWERS } from './threadlineQualityRules.ts';

export type ThreadlineCopyAuditSeverity = 'critical' | 'warning';

export type ThreadlineCopyAuditCode =
  | 'abstract-title-frame'
  | 'answer-set-reuse'
  | 'answer-led-payoff'
  | 'generic-title-suffix'
  | 'lead-answer-repeat'
  | 'lead-structure-repeat'
  | 'lead-template-scaffold'
  | 'lead-render-error'
  | 'lead-semicolon-rhythm'
  | 'mechanical-payoff-bridge'
  | 'missing-payoff'
  | 'missing-puzzle'
  | 'missing-review'
  | 'mixed-gerund-thread'
  | 'payoff-format'
  | 'payoff-title-duplicate'
  | 'payoff-reuse-window'
  | 'payoff-structure-repeat'
  | 'rejected-copy-answer'
  | 'same-puzzle-root-repeat'
  | 'thread-triple-reuse'
  | 'score-below-threshold'
  | 'score-not-number'
  | 'title-spoiler'
  | 'title-coherence'
  | 'title-reuse-window';

export interface ThreadlineAuditScheduleEntry {
  dateKey: string;
  puzzleId: string;
}

export interface ThreadlineAuditReview {
  overallEditorialScore?: number;
  playerAverageScore?: number;
  finalLinePayoffScore?: number;
  safetyFlags?: readonly string[];
  scores?: object;
}

export interface ThreadlineCopyAuditIssue {
  severity: ThreadlineCopyAuditSeverity;
  code: ThreadlineCopyAuditCode;
  message: string;
  puzzleId?: string;
  dateKey?: string;
  value?: string | number;
}

export interface ThreadlineRenderedLead {
  puzzleId: string;
  completedLead: string;
  missingWordIds: string[];
}

export interface ThreadlineReuseEntry {
  value: string;
  count: number;
  puzzleIds: string[];
  dateKeys: string[];
}

export interface ThreadlineTitlePayoffInspection {
  duplicateTitles: ThreadlineReuseEntry[];
  duplicatePayoffs: ThreadlineReuseEntry[];
  exactTitleReuseIssues: ThreadlineCopyAuditIssue[];
  genericSuffixTitles: ThreadlineCopyAuditIssue[];
  titleCooldownIssues: ThreadlineCopyAuditIssue[];
  payoffCooldownIssues: ThreadlineCopyAuditIssue[];
}

export interface ThreadlineTitlePayoffCoherence {
  puzzleId: string;
  title: string;
  payoff: string;
  completedLead: string;
  sharedTitleTokens: string[];
  sharedPayoffTokens: string[];
  issues: ThreadlineCopyAuditIssue[];
}

export interface ThreadlineDifficultyProfile {
  puzzleId: string;
  difficulty: ThreadlineDifficulty;
  index: number;
  averageAnswerLength: number;
  maxAnswerLength: number;
  longAnswerCount: number;
  answerCount: number;
  crossingCellCount: number;
  averageHintWords: number;
  declaredDifficultyWeight: number;
}

export interface ThreadlineDifficultyBandSummary {
  difficulty: ThreadlineDifficulty;
  count: number;
  averageIndex: number;
  minIndex: number;
  maxIndex: number;
}

export interface ThreadlineScoreDimensionSummary {
  key: string;
  minimum: number;
  present: number;
  missing: number;
  belowThreshold: number;
  average: number | null;
  min: number | null;
  max: number | null;
}

export type ThreadlineVoiceFloorPatternId =
  | 'answer-as-payoff-subject'
  | 'weave-answer-anchor'
  | 'weave-construction-where-formula'
  | 'weave-becomes-through-formula'
  | 'weave-explanatory-abstraction'
  | 'weave-make-feel-formula'
  | 'weave-thread-label-prose'
  | 'lead-then-someone-can'
  | 'lead-someone-can'
  | 'lead-nearby-wait'
  | 'lead-is-ready-to'
  | 'lead-hands-know-how'
  | 'lead-eye-somewhere'
  | 'lead-next-motion'
  | 'lead-static-list-location'
  | 'lead-second-look-scaffold'
  | 'lead-look-again-scaffold'
  | 'lead-focus-later-scaffold'
  | 'lead-you-notice-scaffold'
  | 'lead-starts-with-scaffold'
  | 'lead-first-layer-scaffold'
  | 'lead-will-verb-chain'
  | 'lead-scene-texture-scaffold'
  | 'lead-forced-infinitive-chain'
  | 'lead-doubled-anchor'
  | 'lead-close-at-hand-scaffold'
  | 'lead-already-there-scaffold'
  | 'lead-wait-for-dark-scaffold'
  | 'lead-spatial-depth-scaffold'
  | 'lead-stillness-action-scaffold'
  | 'lead-close-by-handoff-scaffold'
  | 'lead-generic-motion-utility-scaffold'
  | 'lead-domain-observation-scaffold'
  | 'lead-domain-task-scaffold'
  | 'lead-procedural-domain-filler'
  | 'lead-gallery-slow-look-scaffold'
  | 'lead-trail-path-offers-scaffold'
  | 'lead-picnic-blanket-scaffold'
  | 'lead-theater-stage-scaffold'
  | 'lead-bench-lab-scaffold'
  | 'lead-abstract-stage-direction';

export interface ThreadlineVoiceFloorHit {
  patternId: ThreadlineVoiceFloorPatternId;
  label: string;
  puzzleId: string;
  dateKey?: string;
  title: string;
  completedLead: string;
  weave: string;
}

export interface ThreadlineVoiceFloorSummary {
  patternId: ThreadlineVoiceFloorPatternId;
  label: string;
  phase: 'lead' | 'weave';
  count: number;
  whyItMatters: string;
  sampleHits: ThreadlineVoiceFloorHit[];
}

export interface ThreadlineCopyAuditOptions {
  puzzles: readonly ThreadlinePuzzle[];
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[];
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>;
  editorReview?: Readonly<Record<string, ThreadlineAuditReview | undefined>>;
  titleReuseCooldownDays?: number;
  payoffReuseCooldownDays?: number;
  scoreThresholds?: Readonly<Record<string, number>>;
  maxSemicolonLeads?: number;
  maxLeadStructureRepeats?: number;
  maxWeaveStructureRepeats?: number;
}

export interface ThreadlineCopyAuditReport {
  issues: ThreadlineCopyAuditIssue[];
  criticalIssues: ThreadlineCopyAuditIssue[];
  warningIssues: ThreadlineCopyAuditIssue[];
  titlePayoff: ThreadlineTitlePayoffInspection;
  difficultyBands: ThreadlineDifficultyBandSummary[];
  scoreDimensions: ThreadlineScoreDimensionSummary[];
  voiceFloor: ThreadlineVoiceFloorSummary[];
}

export const THREADLINE_COPY_SCORE_THRESHOLDS: Readonly<Record<string, number>> = {
  leadWordEditor: 4.5,
  themeEditor: 4.5,
  calendarEditor: 4.45,
  copyEditor: 4.5,
  safetyEditor: 4,
  gridEditor: 4.25,
  grammarScore: 4.5,
  titleCoherenceScore: 4.5,
  payoffBridgeScore: 4.6,
  poeticTextureScore: 4.45,
  difficultyIntegrityScore: 4.3,
  overallEditorialScore: 4.55,
  playerAverageScore: 4.5,
  finalLinePayoffScore: 4.6,
};

const DIFFICULTY_ORDER: ThreadlineDifficulty[] = ['Easy', 'Medium', 'Hard'];

const DECLARED_DIFFICULTY_WEIGHT: Record<ThreadlineDifficulty, number> = {
  Easy: 0,
  Medium: 0.4,
  Hard: 0.8,
};

const GENERIC_TITLE_SUFFIXES = new Set([
  'corner',
  'hour',
  'loop',
  'morning',
  'path',
  'shelf',
  'table',
  'window',
]);

const TOKEN_STOP_WORDS = new Set([
  'and',
  'are',
  'for',
  'from',
  'into',
  'its',
  'one',
  'the',
  'their',
  'this',
  'through',
  'when',
  'where',
  'with',
]);

const BANNED_LEAD_COPY = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first|the scene moves through|a second look finds|look again|come into focus a moment later|close at hand|the moment turns toward|are already there|wait for dark|the night gathers around|sit in plain sight|stay up front|gather farther back|wait (?:a little )?farther in|farther out are|where the eye lands|wait where the place opens|stay nearest|sit nearest|nearest part|are the still things|hold the still part|make a small still life|make the pause|make the stillness useful|carry the moving part|make it breathe|break it open|bring the shift|point it onward|start the action|close by|close to hand|the turn is|come after them|take it from there|make the room busier|make the quiet busier|complete the view|make a small inventory|make it less empty|make the place recognizable|make it particular|make the place easy to enter|make it worth staying|make the place tangible|make it move|keep the day moving|keep things going|keep it moving|keep it active|keep the room busy|keep the moment moving|keep the hour alive|keep moving|catch your eye|visitor lingers over|visitor slows for|hold the first look|attention settles on|slower look finds|looking slows around|another pass finds|keeps returning|attention drifts toward|trail is marked by|path is marked by|woods answer with|mark the way|walk opens toward|walk finds|path offers|day keeps offering|keep the route clear|recipe calls for|recipe line|dinner turns toward|the cook turns (?:next )?to|cook goes on to|the water starts to|the water begins to|the edge begins to|the shoreline begins to|the tide starts to|shoreline keeps moving through|station platform points|tell people when to move|fill the waiting|put the trip in view|travelers pass|soften the wait|fill the pause|waiting gathers around|work waits in|tell the day where to begin|surface toward work|first real task|workday its first shape|the beds are bright with|the day's work is|morning work is|beyond it, the work is|garden path shows|morning is for|hands move through|room settles into|afternoon moves through|hour moves through|work is mostly|washday has|line moves through|slow the line into|counter turns busy|breakfast becomes|order takes shape through|line pauses over|morning waits on|order moves through|before long, .+ take over|by noon, .+ take over|morning opens toward|next hour turns toward|day turns to|rail is busy with|cut into the sky|fill the hour|settle over the evening|hold the skyline|looks out past|rail looks out on|fill the view|high rail looks past|front step keeps|hold the house in place|porch light catches|turn the step toward|set the edge of the house|house is ready with|hold the light|carry the street|turn the doorway outward|pull the door into|front edge has|bring the block close|picnic blanket|on the blanket|across the blanket|blanket holds|blanket is set|spread out|lunch is set out with|make lunch visible|make a table|after a few minutes|afternoon loosens|afternoon calls for|beyond it are|park adds|afternoon gathers around|park keeps .+ in the day|leaves room for|day has room for|park is easy with|afternoon keeps .+ close|lunch has|the grass is ready for|the food is simple|the park gives|onstage|before the curtain|house lights|in the house|out front|people in the seats|stage is set|stage has|audience sits with|room begins to|audience brings|room leans toward|room is full of|room answers with|room gives back|workbench|lab bench|bench light|bench holds|bench is ready|sit ready|are laid out|repair turns|repair note names|damaged piece shows|loose part shows|broken part points|small problem shows itself|test calls for|test turns to|result turns on|question narrows around|experiment turns on|answer gathers around|fix comes down to|repair needs|thing to solve|notebook fills with|work follows|you notice|starts with|begins with|at first glance|first layer|second layer|first small facts|first clues|other clues|within reach|in reach|are closest; the rest of the scene|make an easy first read|scene texture|make the scene fuller|make the scene legible|the clerk can|the operator can|the voice can|signal is shaped by|signal takes shape through|a visitor (?:begins|stops|pauses|starts|chooses|has time|takes time|takes a moment) to|keeps up with|answers with|wait quietly|outside are|outside,? the block|front step has|porch light falls|seats hold|from (?:the )?(?:block|street|sidewalk|counter) come|after dark come|after dusk|evening moves through|campsite opens around|are unpacked|will [a-z]+, [a-z]+, and [a-z]+|has to [a-z]+, [a-z]+, and [a-z]+|is there to [a-z]+, [a-z]+, and [a-z]+|work is to [a-z]+, [a-z]+, and [a-z]+|it is time to [a-z]+, [a-z]+, and [a-z]+|asks? (?:the )?[a-z]+ to [a-z]+, [a-z]+, and [a-z]+|moves next to|moves? on to|hiding in|depends on|near (?:near|along|on|in|inside|outside|toward|by|around|at)|hold the room steady|pull the edges wider|hold the practical side|make the place feel particular|make the room recognizable|the rest leans on|steady the room|make it feel inhabited|settle the eye|stir the moment|hold the ordinary ground|change the air|settle first|turn the page|fill out the edges|fill the quiet edges|hold the front of the moment|collect around the edges|make the place feel lived in|round out the room|nearest edge|farther part|finish the picture|give the (?:place|moment|day|room|work|rest)|pull the place forward|keep the day from (?:staying still|stopping)|keep the room from stopping|carry the day forward|keep the scene awake|keep the moment close|send it forward|make the day shift|carry the room past them|loosen it|give the stillness a turn|then someone can|someone can|the clerk can (?:order|request)|nearby, .+ wait|is ready to|hands know how|give the eye somewhere else to land|the next motion is to|already part of the setting|show what the setting is becoming|has a job|has a voice|doing real work|comes alive when|holds together because|belong with|read as|first family|second family|two plain vocabularies|can be named|sort .+ forcing|show up as|come through as|arrive as|warmer|sitdown|fogbound|lockup|platen|stellar|skyward|recedes|clouding|seaward|aiming|marking|cueing|ducking)\b/i;
const BANNED_LEAD_RHYTHM_COPY =
  /\b(hour fills with|next hour gathers|small work of|the room finds|day fills with|morning fills with|feels made from|keep it from feeling empty|keep the beach brief|first hour is full|night fills with|firelight settles over|keep going through|glass catches|room steadies itself|broadcast goes out|counter turns to|order becomes|make the first idea visible|make the draft visible|take the boat out|counter handles|rehearsal gathers around|settle into [a-z]+ing|bring the draft into view|give the quiet shape|keep the fire tended|keep the sand unsettled|wait for [a-z]+ing, [a-z]+ing, and [a-z]+ing|wait while|sit close while|look ready while|decide what (?:goes|leaves)|make breakfast specific|visit becomes|draws its outline|hour is spent|keeps the room busy|are what rehearsal is for|give the first hour its shape|works through|wait beyond the rail|make the wait sweet)\b/i;
const RETIRED_EXCEPTIONAL_FLOOR_LEAD_COPY =
  /\b(the first desks have|the morning has|the room slows around|attention turns to|the day steadies itself|the day leans into|the morning turns to|the boat turns to|the page waits with|show where hands should go|give breakfast its rhythm|the hour softens into|the back room handles|the room warms into|gather in a corner|point past the pause|wait while shoppers|visitors keep|room is just|waiting for|wait for|counter work is|shape the first run|the rest is|makes a place|settle into the rest|mailroom shelf has|back room hums|are ready before|room agrees to listen|stay close before the trip becomes|are still separate when|tempt the line while|cover the desks, and after it|give the run a count|move one choice into paper|first decisions|wait as|cross the night|mark the sand while|long enough for|show where the fix begins|carry the room onward|broadcast runs on|water ahead means|come back from .* ready|keep the line looking|stay close to the eye|people keep|on the page are|are ready as|give the room a sound|city below becomes|protocol says|work moves toward|near the surface|finish the thought|sitting toward|first, then lets|has room for|same quiet|rest of the moment calls|hands slipping|signal is built from|move the work along|keep the room in motion|signal leaves with|add the next turn|enter the day|carry the hour|move the day along|give the scene another pulse|fill the back of the scene|ready for a morning of|hold the view|show what clay can become|notes say|screens say|wait for hands to|sit ready for|water stream|shift the scene|move the scene onward|drills for [a-z]+, [a-z]+, and [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ find the beat|shape an hour of|carry the evening|plan is to|notes settle on|drills? to [a-z]+, [a-z]+, and [a-z]+|make the room look ready|room look ready|make the next move|make the turn|hour goes out with|bring the room alive|house answers with|point farther on|stay close to the cup|the table has|a regular table has|a walk by|the first mile has|the forecast has [^.?!]+ by the door and the route has|bring the train close|share the table with|stay close while hands|hands are [a-z]+, [a-z]+, and [a-z]+|keep people close|fill the room|ready for one|come back through|come back after|pass through [^.?!]+ before the drawer|by way of|give the morning voices|turn camp into a room|pass through the seats|ready for a carrier|ready for the kiln|hold the stage|make every choice sweeter|stay under their hands|raise the questions|for one [a-z]+, one [a-z]+, and one [a-z]+|clerks keep [a-z]+ing, [a-z]+ing, and [a-z]+ing|sit beside a loose [a-z]+, a split [a-z]+, and a rough [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ take over|forecast shifts toward|answers through|reports report|pressure keeps reveal|skies (?:update|gusting)|gusts keep thaw|swing wind|warn pressure|drizzle wind|and a clear|make a clear beginning|add a little weight|pile feels wearable|water keeps [a-z]+ing, [a-z]+ing, and [a-z]+ing|can disappear before|make people linger over|short list:|card sit beside|change under hands that)\b/i;
const BANNED_PAYOFF_COPY = /\b(theme|clue|hidden turn|line land|same thread|final line|in miniature|hiding between|need each other|opposite sides|make .+ click|works because|works? (?:where|when)|meets?|where [^.?!]+ meet|(?:begins|lives|settles|pauses|wakes|gathers|improves) where|feels human where|becomes? [^.?!]+ through|makes? [^.?!]+ feel|are the handoff|resolves when|lands when|shared place|appears between|make the connection visible|what you can point to|still detail|live one|scene turns on|has a voice|start with|listen for|now you are at|first .+ then|fills the wait|keeps you walking|makes it an afternoon|tells people what to do|sends it moving again|makes the room lean in|is why you sat down|where it is|slow taste begins|shore finds|water motion|camp gear|camp moves|matters because|less quiet|hunger gets specific|make the draft visible|make the first idea visible|turns wanting into choosing|turns appetite practical|turns sugar into (?:a plan|a choice)|turns waiting into breakfast|line ends where hunger gets named|ordinary work makes order visible|work is ordinary and merciful|can be reset by small care|makes waiting practical|gets kinder as the shape settles|gets kinder when the coast can read|silence becomes part of the artwork|finger on the glass makes breakfast specific|box gives breakfast a handle|room becomes inward around the page|shelf becomes useful when the room starts moving|desk becomes useful when the day gets specific|room gets one fresh ending|quiet turns a room into a show|first minutes turn the room into class|(?:broken edge|nick) can make the whole room practical|above traffic,? evening becomes gentle|public room can become one quiet place|room turns waiting into arrival|warm box makes the morning sweeter|dome turns waiting into wonder|room gets larger when sound leaves it|music makes the room visible|small room gives the voice longer reach|care turns a heap back into a home|breakfast feels chosen before the box closes)\b/i;
const RETIRED_EXCEPTIONAL_FLOOR_WEAVE_COPY =
  /\b(soft care gives the day its shape back|the day gets real|art turns a pause into attention|the loop turns motion into neighborhood|the day gets greener where care repeats|the day gets less abstract|shape gets personal|wanting becomes practical|distance becomes practical|the water gives the rail a reason|quiet work gives green its confidence|desk turns scattered work|repair begins when the damage gets specific|a room gets quiet enough for distance|gives breakfast a regular|last light makes distance kind|the door gives the room its purpose|marks turn the table toward shape|the meal gets real|gentle work gives the shelf its purpose|a deadline can make doubt useful|desk order gives the work|wonder becomes evidence one careful step|the gate wakes when the sky gets close|a quiet counter can make time present|a fix begins where the damage speaks|doubt gives the day|low water gives the sand|box closes on the thing|supper begins before the pan|a rehearsal turns patience|the roof opens and the room looks|breakfast gets chosen|small work gives the season somewhere|the breath before open water|turns separate ingredients toward supper|one chosen sweetness|tells the room what the supplies are for|makes sound by agreeing on time|stops being work|starts with a choice under glass|materials stop being separate|far sky feels near|memory it cannot keep|teaches looking to slow down|the city softens from above|care makes wonder useful|street sounds farther away|noise becomes evening|curiosity slowed down|hand leaves something the fire can keep|story earns trust before daylight|care made measurable|alarm gives readiness|alarm gives the room|distance becomes care|pressure stays after the clay hardens|every stop becomes borrowed shelter|a flaw decides which tool feels right|sky gets counted where instruments wait|measurement gives tomorrow a little warning|a measured sky warns early|station listens through instruments and forecast shifts|instruments turn pressure into forecast shifts|a remedy is care measured small|the pile comes back ready|the pile returns as something wearable|ready for drawers|ready to be worn|ready for ordinary use|turns supplies into a (?:class|morning)|a fire gives the wild a room|fabric leaves the wash folded and warm|forecast shifts|the water turns the tank into weather)\b/i;
const MAX_PAYOFF_WORDS = 18;

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function normalizeThreadlineCopy(copy: string): string {
  return copy
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function meaningfulTokens(copy: string): string[] {
  return normalizeThreadlineCopy(copy)
    .split(' ')
    .filter((token) => token.length > 2 && !TOKEN_STOP_WORDS.has(token));
}

function repeatedPlayableAnswersInLead(puzzle: ThreadlinePuzzle, completedLead: string): string[] {
  const leadTokenCounts = new Map<string, number>();
  normalizeThreadlineCopy(completedLead)
    .split(' ')
    .filter(Boolean)
    .forEach((token) => leadTokenCounts.set(token, (leadTokenCounts.get(token) ?? 0) + 1));

  return puzzle.words.flatMap((word) => {
    const answer = normalizeThreadlineCopy(word.answer);
    if (answer.length < 4 || answer.includes(' ')) return [];
    const count = leadTokenCounts.get(answer) ?? 0;
    return count > 1 ? [`${word.answer} x${count}`] : [];
  });
}

function hasTitleSpoiler(puzzle: ThreadlinePuzzle, titleTokens: readonly string[]): boolean {
  const answerTokens = new Set(puzzle.words.map((word) => normalizeThreadlineCopy(word.answer)));
  const threadTokens = new Set(
    puzzle.threads.flatMap((thread) => meaningfulTokens(`${thread.name} ${thread.clue}`))
  );
  return titleTokens.some((token) => answerTokens.has(token) || threadTokens.has(token));
}

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

function domainFromPuzzleId(puzzleId: string): string {
  return puzzleId.replace(/^threadline-\d{4}-\d{2}-\d{2}-/, '');
}

function hasSemanticPayoffBridge(puzzle: ThreadlinePuzzle, payoffTokens: readonly string[]): boolean {
  const domain = domainFromPuzzleId(puzzle.id);
  const semanticTokens = PAYOFF_SEMANTIC_BRIDGE_TOKENS[domain];
  if (!semanticTokens) return false;
  const payoffTokenSet = new Set(payoffTokens);
  return semanticTokens.some((token) => payoffTokenSet.has(token));
}

function hasPayoffThreadBridge(puzzle: ThreadlinePuzzle, payoffTokens: readonly string[]): boolean {
  const payoffTokenSet = new Set(payoffTokens);
  const explicitBridge = puzzle.threads.every((thread) => {
    const threadTokens = meaningfulTokens(`${thread.name} ${thread.clue}`);
    const answerTokens = puzzle.words
      .filter((word) => word.threadId === thread.id)
      .flatMap((word) => meaningfulTokens(word.answer));
    return [...threadTokens, ...answerTokens].some((token) => payoffTokenSet.has(token));
  });
  return explicitBridge || hasSemanticPayoffBridge(puzzle, payoffTokens);
}

function startsWithAnswerAsPayoffSubject(puzzle: ThreadlinePuzzle, payoff = puzzle.weave): boolean {
  const normalizedPayoff = normalizeThreadlineCopy(payoff);
  const subjectVerbs = [
    'is',
    'waits',
    'gets',
    'keeps',
    'catches',
    'stops',
    'marks',
    'holds',
    'appears',
    'hangs',
    'gives',
    'carries',
    'turns',
    'makes',
    'sends',
  ];

  return puzzle.words.some((word) => {
    const answer = normalizeThreadlineCopy(word.answer);
    return subjectVerbs.some((verb) => normalizedPayoff.startsWith(`${answer} ${verb} `));
  });
}

function payoffMentionsPlayableAnswer(puzzle: ThreadlinePuzzle, payoff = puzzle.weave): boolean {
  const payoffTokenSet = new Set(meaningfulTokens(payoff));
  return puzzle.words.some((word) => meaningfulTokens(word.answer).some((token) => payoffTokenSet.has(token)));
}

function formatLeadAnswer(answer: string): string {
  return answer.toLowerCase();
}

export function renderThreadlineCompletedLead(puzzle: ThreadlinePuzzle): string {
  const wordsById = new Map(puzzle.words.map((word) => [word.id, word.answer]));

  return puzzle.lead
    .map((segment) => {
      if (segment.type === 'text') return segment.text;
      const answer = wordsById.get(segment.wordId);
      return answer ? formatLeadAnswer(answer) : `[missing:${segment.wordId}]`;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

export function renderThreadlineLeadForAudit(puzzle: ThreadlinePuzzle): ThreadlineRenderedLead {
  const wordsById = new Set(puzzle.words.map((word) => word.id));
  const missingWordIds = puzzle.lead
    .filter((segment) => segment.type === 'blank' && !wordsById.has(segment.wordId))
    .map((segment) => (segment.type === 'blank' ? segment.wordId : ''));

  return {
    puzzleId: puzzle.id,
    completedLead: renderThreadlineCompletedLead(puzzle),
    missingWordIds,
  };
}

export function getThreadlineGenericTitleSuffix(title: string): string | null {
  const titleOnly = normalizeThreadlineCopy(title);
  if (GENERIC_TITLE_SUFFIXES.has(titleOnly)) return titleOnly;

  const suffix = title.match(/:\s*([A-Za-z ]+)$/)?.[1];
  const normalizedSuffix = suffix ? normalizeThreadlineCopy(suffix) : '';
  return GENERIC_TITLE_SUFFIXES.has(normalizedSuffix) ? normalizedSuffix : null;
}

function makePuzzleLookup(
  puzzles: readonly ThreadlinePuzzle[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>
): Readonly<Record<string, ThreadlinePuzzle | undefined>> {
  return puzzleById ?? Object.fromEntries(puzzles.map((puzzle) => [puzzle.id, puzzle]));
}

function getOrderedPuzzleEntries(
  puzzles: readonly ThreadlinePuzzle[],
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>
): Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }> {
  if (!datedSchedule) {
    return puzzles.map((puzzle, dayIndex) => ({ puzzle, dayIndex }));
  }

  const lookup = makePuzzleLookup(puzzles, puzzleById);
  return datedSchedule.flatMap((entry, dayIndex) => {
    const puzzle = lookup[entry.puzzleId];
    return puzzle ? [{ puzzle, dateKey: entry.dateKey, dayIndex }] : [];
  });
}

function buildReuseEntries(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>,
  getValue: (puzzle: ThreadlinePuzzle) => string
): ThreadlineReuseEntry[] {
  const grouped = new Map<string, ThreadlineReuseEntry>();

  entries.forEach(({ puzzle, dateKey }) => {
    const value = getValue(puzzle).trim();
    const key = normalizeThreadlineCopy(value);
    if (!key) return;

    const existing =
      grouped.get(key) ??
      ({
        value,
        count: 0,
        puzzleIds: [],
        dateKeys: [],
      } satisfies ThreadlineReuseEntry);

    existing.count += 1;
    existing.puzzleIds.push(puzzle.id);
    if (dateKey) existing.dateKeys.push(dateKey);
    grouped.set(key, existing);
  });

  return Array.from(grouped.values())
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

function getCooldownIssues(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  getValue: (puzzle: ThreadlinePuzzle) => string,
  cooldownDays: number,
  code: 'payoff-reuse-window' | 'title-reuse-window',
  label: string
): ThreadlineCopyAuditIssue[] {
  const lastSeen = new Map<string, { dateKey?: string; dayIndex: number; puzzleId: string; value: string }>();
  const issues: ThreadlineCopyAuditIssue[] = [];

  entries.forEach(({ puzzle, dateKey, dayIndex }) => {
    const value = getValue(puzzle).trim();
    const key = normalizeThreadlineCopy(value);
    const previous = lastSeen.get(key);

    if (previous && dayIndex - previous.dayIndex <= cooldownDays) {
      issues.push({
        severity: 'critical',
        code,
        puzzleId: puzzle.id,
        dateKey,
        value,
        message: `${label} repeats after ${dayIndex - previous.dayIndex} days: ${previous.puzzleId} -> ${puzzle.id}`,
      });
    }

    if (key) lastSeen.set(key, { dateKey, dayIndex, puzzleId: puzzle.id, value });
  });

  return issues;
}

export function getThreadlineLeadStructureSignature(puzzle: ThreadlinePuzzle): string {
  const raw = puzzle.lead
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

export function getThreadlineAnswerSetSignature(puzzle: ThreadlinePuzzle): string {
  return puzzle.words.map((word) => word.answer.toUpperCase()).sort().join('|');
}

export function getThreadlineThreadTripleSignatures(puzzle: ThreadlinePuzzle): string[] {
  return puzzle.threads.map((thread) => {
    const answers = puzzle.words
      .filter((word) => word.threadId === thread.id)
      .map((word) => word.answer.toUpperCase())
      .sort()
      .join('|');
    return `${thread.name}:${answers}`;
  });
}

const WEAVE_STRUCTURE_TOKENS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'become',
  'becomes',
  'before',
  'by',
  'can',
  'does',
  'for',
  'from',
  'gets',
  'give',
  'gives',
  'has',
  'have',
  'in',
  'into',
  'is',
  'it',
  'its',
  'keep',
  'keeps',
  'let',
  'lets',
  'make',
  'makes',
  'of',
  'on',
  'out',
  'that',
  'the',
  'to',
  'turn',
  'turns',
  'when',
  'where',
  'with',
  'without',
]);

export function getThreadlineWeaveStructureSignature(weaveOrPuzzle: string | ThreadlinePuzzle): string {
  const weave = typeof weaveOrPuzzle === 'string' ? weaveOrPuzzle : weaveOrPuzzle.weave;
  return normalizeThreadlineEditorialTokenText(weave)
    .split(/\s+/)
    .filter(Boolean)
    .map((token, index) => (index === 0 || WEAVE_STRUCTURE_TOKENS.has(token) ? token : 'x'))
    .join(' ');
}

function inspectThreadlineLeadStructureRepeats(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  maxRepeats: number
): ThreadlineCopyAuditIssue[] {
  const grouped = new Map<string, Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>>();

  entries.forEach(({ puzzle, dateKey }) => {
    const signature = getThreadlineLeadStructureSignature(puzzle);
    const bucket = grouped.get(signature) ?? [];
    bucket.push({ puzzle, dateKey });
    grouped.set(signature, bucket);
  });

  return Array.from(grouped.entries()).flatMap(([signature, bucket]) => {
    if (bucket.length <= maxRepeats) return [];
    const first = bucket[0];
    return [
      {
        severity: 'critical',
        code: 'lead-structure-repeat',
        puzzleId: first.puzzle.id,
        dateKey: first.dateKey,
        value: bucket.length,
        message: `Lead structure repeats ${bucket.length} times, above the ${maxRepeats}-puzzle editorial pursuit floor: ${signature}`,
      } satisfies ThreadlineCopyAuditIssue,
    ];
  });
}

function inspectThreadlineWeaveStructureRepeats(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  maxRepeats: number
): ThreadlineCopyAuditIssue[] {
  const grouped = new Map<string, Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>>();

  entries.forEach(({ puzzle, dateKey }) => {
    const signature = getThreadlineWeaveStructureSignature(puzzle);
    const bucket = grouped.get(signature) ?? [];
    bucket.push({ puzzle, dateKey });
    grouped.set(signature, bucket);
  });

  return Array.from(grouped.entries()).flatMap(([signature, bucket]) => {
    if (bucket.length <= maxRepeats) return [];
    const first = bucket[0];
    return [
      {
        severity: 'critical',
        code: 'payoff-structure-repeat',
        puzzleId: first.puzzle.id,
        dateKey: first.dateKey,
        value: bucket.length,
        message: `Final weave structure repeats ${bucket.length} times, above the ${maxRepeats}-use poetic texture floor: ${signature}`,
      } satisfies ThreadlineCopyAuditIssue,
    ];
  });
}

function inspectThreadlineThreadTripleRepeats(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  maxRepeats = 3
): ThreadlineCopyAuditIssue[] {
  const grouped = new Map<string, Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>>();

  entries.forEach(({ puzzle, dateKey }) => {
    getThreadlineThreadTripleSignatures(puzzle).forEach((signature) => {
      const bucket = grouped.get(signature) ?? [];
      bucket.push({ puzzle, dateKey });
      grouped.set(signature, bucket);
    });
  });

  return Array.from(grouped.entries()).flatMap(([signature, bucket]) => {
    if (bucket.length <= maxRepeats) return [];
    const first = bucket[0];
    return [
      {
        severity: 'critical',
        code: 'thread-triple-reuse',
        puzzleId: first.puzzle.id,
        dateKey: first.dateKey,
        value: bucket.length,
        message: `Exact thread answer trio repeats ${bucket.length} times, above the ${maxRepeats}-use variety floor: ${signature}`,
      } satisfies ThreadlineCopyAuditIssue,
    ];
  });
}

function inspectThreadlineAnswerSetRepeats(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string; dayIndex: number }>,
  maxRepeats = 1
): ThreadlineCopyAuditIssue[] {
  const grouped = new Map<string, Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>>();

  entries.forEach(({ puzzle, dateKey }) => {
    const signature = getThreadlineAnswerSetSignature(puzzle);
    const bucket = grouped.get(signature) ?? [];
    bucket.push({ puzzle, dateKey });
    grouped.set(signature, bucket);
  });

  return Array.from(grouped.entries()).flatMap(([signature, bucket]) => {
    if (bucket.length <= maxRepeats) return [];
    const first = bucket[0];
    return [
      {
        severity: 'critical',
        code: 'answer-set-reuse',
        puzzleId: first.puzzle.id,
        dateKey: first.dateKey,
        value: bucket.length,
        message: `Exact six-answer set repeats ${bucket.length} times across the schedule: ${signature}`,
      } satisfies ThreadlineCopyAuditIssue,
    ];
  });
}

function inspectThreadlineRejectedCopyAnswers(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>
): ThreadlineCopyAuditIssue[] {
  return entries.flatMap(({ puzzle, dateKey }) =>
    puzzle.words
      .filter((word) => THREADLINE_REJECTED_COPY_ANSWERS.has(word.answer.toUpperCase()))
      .map(
        (word) =>
          ({
            severity: 'critical',
            code: 'rejected-copy-answer',
            puzzleId: puzzle.id,
            dateKey,
            value: word.answer,
            message: `Answer "${word.answer}" is barred from the shipped schedule because it repeatedly forced stiff lead or weave copy.`,
          } satisfies ThreadlineCopyAuditIssue)
      )
  );
}

function getThreadlineAnswerRootVariants(answer: string): string[] {
  const normalized = normalizeThreadlineCopy(answer).replace(/\s+/g, '').toUpperCase();
  const variants = new Set([normalized]);
  const suffixes = ['ING', 'ED', 'ES', 'S'];

  suffixes.forEach((suffix) => {
    if (!normalized.endsWith(suffix) || normalized.length - suffix.length < 4) return;
    const stem = normalized.slice(0, -suffix.length);
    variants.add(stem);
    if (suffix === 'ING' || suffix === 'ED') variants.add(`${stem}E`);
  });

  return Array.from(variants);
}

function inspectThreadlineSamePuzzleRootRepeats(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>
): ThreadlineCopyAuditIssue[] {
  return entries.flatMap(({ puzzle, dateKey }) => {
    const issues: ThreadlineCopyAuditIssue[] = [];

    puzzle.words.forEach((word, index) => {
      const roots = getThreadlineAnswerRootVariants(word.answer);
      const earlier = puzzle.words.slice(0, index).find((candidate) => {
        const candidateRoots = new Set(getThreadlineAnswerRootVariants(candidate.answer));
        return roots.some((root) => candidateRoots.has(root));
      });

      if (!earlier) return;
      issues.push({
        severity: 'critical',
        code: 'same-puzzle-root-repeat',
        puzzleId: puzzle.id,
        dateKey,
        value: `${earlier.answer}/${word.answer}`,
        message:
          `Answers "${earlier.answer}" and "${word.answer}" share a root inside one puzzle; ` +
          'the weave should earn difficulty through variety, not repeated word family texture.',
      });
    });

    return issues;
  });
}

function isThreadlineMotionLikeThreadName(threadName: string): boolean {
  return /(move|moves|motion|motions|steps|calls|cues|signals|habits|routines)/i.test(threadName);
}

function inspectThreadlineMixedGerundThreads(
  entries: Array<{ puzzle: ThreadlinePuzzle; dateKey?: string }>
): ThreadlineCopyAuditIssue[] {
  return entries.flatMap(({ puzzle, dateKey }) =>
    puzzle.threads.flatMap((thread) => {
      if (!isThreadlineMotionLikeThreadName(thread.name)) return [];

      const answers = puzzle.words.filter((word) => word.threadId === thread.id).map((word) => word.answer);
      const gerundCount = answers.filter((answer) => /ING$/.test(answer)).length;
      if (gerundCount === 0 || gerundCount === answers.length) return [];

      return [
        {
          severity: 'critical',
          code: 'mixed-gerund-thread',
          puzzleId: puzzle.id,
          dateKey,
          value: answers.join(', '),
          message: `Motion-like thread "${thread.name}" mixes gerunds with non-gerunds, which makes the filled lead read like a generated list: ${answers.join(
            ', '
          )}`,
        } satisfies ThreadlineCopyAuditIssue,
      ];
    })
  );
}

export function inspectThreadlineTitlePayoffReuse(
  puzzles: readonly ThreadlinePuzzle[],
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>,
  options: { titleReuseCooldownDays?: number; payoffReuseCooldownDays?: number } = {}
): ThreadlineTitlePayoffInspection {
  const entries = getOrderedPuzzleEntries(puzzles, datedSchedule, puzzleById);
  const genericSuffixTitles = entries
    .map(({ puzzle, dateKey }) => {
      const suffix = getThreadlineGenericTitleSuffix(puzzle.title);
      if (!suffix) return null;

      return {
        severity: 'critical',
        code: 'generic-title-suffix',
        puzzleId: puzzle.id,
        dateKey,
        value: puzzle.title,
        message: `Title uses generic suffix "${suffix}" instead of a specific title angle.`,
      } satisfies ThreadlineCopyAuditIssue;
    })
    .filter((issue): issue is ThreadlineCopyAuditIssue => Boolean(issue));
  const duplicateTitles = buildReuseEntries(entries, (puzzle) => puzzle.title);
  const duplicatePayoffs = buildReuseEntries(entries, (puzzle) => puzzle.weave);
  const exactTitleReuseIssues = duplicateTitles.map((entry) => ({
    severity: 'critical',
    code: 'exact-title-reuse',
    puzzleId: entry.puzzleIds[1] ?? entry.puzzleIds[0],
    dateKey: entry.dateKeys[1] ?? entry.dateKeys[0],
    value: entry.value,
    message: `Title repeats exactly across the shipped schedule (${entry.count} uses): ${entry.puzzleIds.join(
      ' -> '
    )}`,
  } satisfies ThreadlineCopyAuditIssue));

  return {
    duplicateTitles,
    duplicatePayoffs,
    exactTitleReuseIssues,
    genericSuffixTitles,
    titleCooldownIssues: getCooldownIssues(
      entries,
      (puzzle) => puzzle.title,
      options.titleReuseCooldownDays ?? 180,
      'title-reuse-window',
      'Title'
    ),
    payoffCooldownIssues: getCooldownIssues(
      entries,
      (puzzle) => puzzle.weave,
      options.payoffReuseCooldownDays ?? 180,
      'payoff-reuse-window',
      'Payoff'
    ),
  };
}

export function inspectThreadlineTitlePayoffCoherence(
  puzzle: ThreadlinePuzzle
): ThreadlineTitlePayoffCoherence {
  const rendered = renderThreadlineLeadForAudit(puzzle);
  const title = puzzle.title.trim();
  const payoff = puzzle.weave.trim();
  const titleTokens = meaningfulTokens(title);
  const payoffTokens = meaningfulTokens(payoff);
  const leadTokens = new Set(meaningfulTokens(rendered.completedLead));
  const threadTokens = new Set(puzzle.threads.flatMap((thread) => meaningfulTokens(`${thread.name} ${thread.clue}`)));
  const answerTokens = new Set(puzzle.words.map((word) => word.answer.toLowerCase()));
  const contextTokens = new Set([...leadTokens, ...threadTokens, ...answerTokens]);
  const sharedTitleTokens = titleTokens.filter((token) => contextTokens.has(token));
  const sharedPayoffTokens = payoffTokens.filter((token) => contextTokens.has(token) || titleTokens.includes(token));
  const issues: ThreadlineCopyAuditIssue[] = [];

  if (rendered.missingWordIds.length > 0 || rendered.completedLead.includes('[missing:')) {
    issues.push({
      severity: 'critical',
      code: 'lead-render-error',
      puzzleId: puzzle.id,
      value: rendered.missingWordIds.join(', '),
      message: `Completed lead cannot render missing word ids: ${rendered.missingWordIds.join(', ')}`,
    });
  }

  const repeatedLeadAnswers = repeatedPlayableAnswersInLead(puzzle, rendered.completedLead);
  if (repeatedLeadAnswers.length > 0) {
    issues.push({
      severity: 'critical',
      code: 'lead-answer-repeat',
      puzzleId: puzzle.id,
      value: repeatedLeadAnswers.join(', '),
      message:
        `Completed lead repeats playable answer text outside its blank: ${repeatedLeadAnswers.join(', ')}`,
    });
  }

  if (
    BANNED_LEAD_COPY.test(rendered.completedLead) ||
    BANNED_LEAD_RHYTHM_COPY.test(rendered.completedLead) ||
    RETIRED_EXCEPTIONAL_FLOOR_LEAD_COPY.test(rendered.completedLead) ||
    THREADLINE_RECENTLY_RETIRED_LEAD_COPY.test(rendered.completedLead)
  ) {
    issues.push({
      severity: 'critical',
      code: 'lead-template-scaffold',
      puzzleId: puzzle.id,
      value: rendered.completedLead,
      message: 'Completed lead uses puzzle-meta scaffolding instead of a standalone sentence.',
    });
  }

  if (isThreadlineRoboticLead(rendered.completedLead)) {
    issues.push({
      severity: 'critical',
      code: 'lead-template-scaffold',
      puzzleId: puzzle.id,
      value: rendered.completedLead,
      message: 'Completed lead carries a visible template fingerprint instead of reading like authored prose.',
    });
  }

  if (/[.!?]\s+[a-z]/.test(rendered.completedLead)) {
    issues.push({
      severity: 'critical',
      code: 'lead-render-error',
      puzzleId: puzzle.id,
      value: rendered.completedLead,
      message: 'Completed lead starts a new sentence with a lowercase filled answer.',
    });
  }

  if (!payoff) {
    issues.push({
      severity: 'critical',
      code: 'missing-payoff',
      puzzleId: puzzle.id,
      message: 'Puzzle is missing final payoff copy.',
    });
  } else if (normalizeThreadlineCopy(payoff) === normalizeThreadlineCopy(title)) {
    issues.push({
      severity: 'critical',
      code: 'payoff-title-duplicate',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff repeats the title instead of landing the completed line.',
    });
  }

  if (payoff && !/[.!?]$/.test(payoff)) {
    issues.push({
      severity: 'warning',
      code: 'payoff-format',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff should read as a finished sentence.',
    });
  }

  if (payoff && payoff.split(/\s+/).filter(Boolean).length > MAX_PAYOFF_WORDS) {
    issues.push({
      severity: 'critical',
      code: 'mechanical-payoff-bridge',
      puzzleId: puzzle.id,
      value: payoff,
      message: `Payoff is too explanatory; final weaves must stay at ${MAX_PAYOFF_WORDS} words or fewer.`,
    });
  }

  if (payoff && (BANNED_PAYOFF_COPY.test(payoff) || RETIRED_EXCEPTIONAL_FLOOR_WEAVE_COPY.test(payoff))) {
    issues.push({
      severity: 'critical',
      code: 'payoff-format',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff uses puzzle-meta scaffolding instead of an exceptional final sentence.',
    });
  }

  if (payoff && isThreadlineMechanicalWeave(payoff)) {
    issues.push({
      severity: 'critical',
      code: 'mechanical-payoff-bridge',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff uses a mechanical answer-adjacency bridge instead of an aha connection.',
    });
  }

  if (payoff && startsWithAnswerAsPayoffSubject(puzzle, payoff)) {
    issues.push({
      severity: 'critical',
      code: 'answer-led-payoff',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff starts with a raw answer as the subject instead of a theme-level reveal.',
    });
  }

  if (payoff && !hasPayoffThreadBridge(puzzle, payoffTokens)) {
    issues.push({
      severity: 'critical',
      code: 'mechanical-payoff-bridge',
      puzzleId: puzzle.id,
      value: payoff,
      message: 'Payoff does not explicitly bridge both answer families into one conceptual reveal.',
    });
  }

  if (title && isThreadlineRoboticTitle(title)) {
    issues.push({
      severity: 'critical',
      code: 'abstract-title-frame',
      puzzleId: puzzle.id,
      value: title,
      message: 'Title uses an abstract generated frame instead of a specific nonspoiling idea.',
    });
  }

  if (titleTokens.length > 0 && hasTitleSpoiler(puzzle, titleTokens)) {
    issues.push({
      severity: 'critical',
      code: 'title-spoiler',
      puzzleId: puzzle.id,
      value: title,
      message: 'Title gives away an answer or theme token before the solve.',
    });
  }

  return {
    puzzleId: puzzle.id,
    title,
    payoff,
    completedLead: rendered.completedLead,
    sharedTitleTokens,
    sharedPayoffTokens,
    issues,
  };
}

export function computeThreadlineDifficultyIndex(puzzle: ThreadlinePuzzle): ThreadlineDifficultyProfile {
  const answerLengths = puzzle.words.map((word) => word.answer.length);
  const answerCount = answerLengths.length;
  const averageAnswerLength =
    answerCount === 0 ? 0 : answerLengths.reduce((total, length) => total + length, 0) / answerCount;
  const maxAnswerLength = answerCount === 0 ? 0 : Math.max(...answerLengths);
  const longAnswerCount = answerLengths.filter((length) => length >= 6).length;
  const averageHintWords =
    answerCount === 0
      ? 0
      : puzzle.words.reduce((total, word) => total + word.hint.split(/\s+/).filter(Boolean).length, 0) /
        answerCount;
  const cellCounts = new Map<string, number>();

  puzzle.words.forEach((word) => {
    word.path.forEach((coord) => {
      const key = `${coord.row},${coord.col}`;
      cellCounts.set(key, (cellCounts.get(key) ?? 0) + 1);
    });
  });

  const crossingCellCount = Array.from(cellCounts.values()).filter((count) => count > 1).length;
  const declaredDifficultyWeight = DECLARED_DIFFICULTY_WEIGHT[puzzle.difficulty];
  const index = round(
    averageAnswerLength +
      longAnswerCount * 0.08 +
      maxAnswerLength * 0.03 +
      averageHintWords * 0.01 +
      crossingCellCount * 0.015 +
      declaredDifficultyWeight
  );

  return {
    puzzleId: puzzle.id,
    difficulty: puzzle.difficulty,
    index,
    averageAnswerLength: round(averageAnswerLength),
    maxAnswerLength,
    longAnswerCount,
    answerCount,
    crossingCellCount,
    averageHintWords: round(averageHintWords),
    declaredDifficultyWeight,
  };
}

export function summarizeThreadlineDifficultyBands(
  puzzles: readonly ThreadlinePuzzle[]
): ThreadlineDifficultyBandSummary[] {
  const profiles = puzzles.map(computeThreadlineDifficultyIndex);

  return DIFFICULTY_ORDER.map((difficulty) => {
    const indexes = profiles
      .filter((profile) => profile.difficulty === difficulty)
      .map((profile) => profile.index);

    return {
      difficulty,
      count: indexes.length,
      averageIndex: indexes.length === 0 ? 0 : round(indexes.reduce((total, index) => total + index, 0) / indexes.length),
      minIndex: indexes.length === 0 ? 0 : Math.min(...indexes),
      maxIndex: indexes.length === 0 ? 0 : Math.max(...indexes),
    };
  });
}

function readReviewScore(review: ThreadlineAuditReview, key: string): unknown {
  if (key === 'overallEditorialScore') return review.overallEditorialScore;
  if (key === 'playerAverageScore') return review.playerAverageScore;
  if (key === 'finalLinePayoffScore') return review.finalLinePayoffScore;
  const scores = review.scores;
  if (!scores || typeof scores !== 'object') return undefined;
  const scoreRecord = scores as Record<string, unknown>;
  return Object.prototype.hasOwnProperty.call(scoreRecord, key) ? scoreRecord[key] : undefined;
}

function inspectReviewScores(
  puzzleIds: readonly string[],
  editorReview: Readonly<Record<string, ThreadlineAuditReview | undefined>>,
  thresholds: Readonly<Record<string, number>>
): { issues: ThreadlineCopyAuditIssue[]; dimensions: ThreadlineScoreDimensionSummary[] } {
  const issues: ThreadlineCopyAuditIssue[] = [];
  const dimensions = Object.entries(thresholds).map(([key, minimum]) => {
    const values: number[] = [];
    let missing = 0;
    let belowThreshold = 0;

    puzzleIds.forEach((puzzleId) => {
      const review = editorReview[puzzleId];
      if (!review) {
        missing += 1;
        return;
      }

      const rawValue = readReviewScore(review, key);
      if (rawValue === undefined || rawValue === null) {
        missing += 1;
        return;
      }

      if (typeof rawValue !== 'number' || Number.isNaN(rawValue)) {
        issues.push({
          severity: 'critical',
          code: 'score-not-number',
          puzzleId,
          value: String(rawValue),
          message: `${key} is present but is not numeric.`,
        });
        return;
      }

      values.push(rawValue);
      if (rawValue < minimum) {
        belowThreshold += 1;
        issues.push({
          severity: 'critical',
          code: 'score-below-threshold',
          puzzleId,
          value: rawValue,
          message: `${key} score ${rawValue} is below the ${minimum} production floor.`,
        });
      }
    });

    return {
      key,
      minimum,
      present: values.length,
      missing,
      belowThreshold,
      average: values.length === 0 ? null : round(values.reduce((total, value) => total + value, 0) / values.length),
      min: values.length === 0 ? null : Math.min(...values),
      max: values.length === 0 ? null : Math.max(...values),
    } satisfies ThreadlineScoreDimensionSummary;
  });

  return { issues, dimensions };
}

const VOICE_FLOOR_PATTERNS: Array<{
  patternId: ThreadlineVoiceFloorPatternId;
  label: string;
  phase: 'lead' | 'weave';
  whyItMatters: string;
  test: (puzzle: ThreadlinePuzzle, completedLead: string) => boolean;
}> = [
  {
    patternId: 'answer-as-payoff-subject',
    label: 'Answer-as-subject weave',
    phase: 'weave',
    whyItMatters:
      'The reveal can feel like category math when the final line starts with a raw answer instead of a theme-level image.',
    test: (puzzle) => {
      return startsWithAnswerAsPayoffSubject(puzzle);
    },
  },
  {
    patternId: 'weave-answer-anchor',
    label: 'Weave names a playable answer',
    phase: 'weave',
    whyItMatters:
      'A final line can still feel like answer adjacency when its aha depends on repeating a solved word instead of naming the theme relationship.',
    test: (puzzle) => payoffMentionsPlayableAnswer(puzzle),
  },
  {
    patternId: 'weave-construction-where-formula',
    label: 'Weave uses construction-where formula',
    phase: 'weave',
    whyItMatters:
      'Where/works formulas explain the join like category construction; exceptional weaves should land as concise, concrete human lines.',
    test: (puzzle) =>
      /\b(works? (?:where|when)|meets?|where [^.?!]+ meet|(?:begins|lives|settles|pauses|wakes|gathers|improves) where|feels human where)\b/i.test(
        puzzle.weave
      ),
  },
  {
    patternId: 'weave-becomes-through-formula',
    label: 'Weave uses becomes-through formula',
    phase: 'weave',
    whyItMatters:
      '"Becomes through" is grammatical but explanatory; the final line should feel like an image or insight, not a category transformation note.',
    test: (puzzle) => /\bbecomes? [^.?!]+ through\b/i.test(puzzle.weave),
  },
  {
    patternId: 'weave-make-feel-formula',
    label: 'Weave uses make-feel formula',
    phase: 'weave',
    whyItMatters:
      '"Makes X feel Y" is a high-volume generated payoff crutch; stronger weaves should name the concrete shift directly.',
    test: (puzzle) => /\bmakes? [^.?!]+ feel\b/i.test(puzzle.weave),
  },
  {
    patternId: 'weave-thread-label-prose',
    label: 'Weave says thread labels aloud',
    phase: 'weave',
    whyItMatters:
      'The final line should connect the ideas, not recite labels like "stage details" or "packed things" that expose the generator scaffolding.',
    test: (puzzle) =>
      /\b(stage details|audience cues|packed things|park motions|repair clues|lab pieces|bench steps|art details|visitor moves|stall goods|buyer moves|path details|passing routines|trail signs|natural details|book details|quiet habits|classroom objects|starting signals|first-hour work|fabric details|wash-day moves|lens pieces|sky motions|skyline details|evening motions|news pieces|press moves|type pieces|beacon pieces|tower pieces|coast cues|growing things|tending moves|doorstep details|street signals|neighbor signals|doorstep objects|evening cues|porch details|bright-night motions|dome sights|show cues|ceiling sights|sky sights|case treats|shop motions|counter details|street cues|weather gear|route cues|paper trails|delivery steps|dock objects|boat motions|instrument details|listening cues)\b/i.test(
        puzzle.weave
      ),
  },
  {
    patternId: 'weave-explanatory-abstraction',
    label: 'Weave uses explanatory abstraction',
    phase: 'weave',
    whyItMatters:
      'Phrases like "weather becomes logistics" or "gives shore finds a closing time" explain the category join instead of landing as a simple human aha.',
    test: (puzzle) =>
      /\b(weather becomes logistics|gives shore finds|feel human when|becomes company by traveling|is a promise to leave|finishes the dark)\b/i.test(
        puzzle.weave
      ),
  },
  {
    patternId: 'lead-then-someone-can',
    label: 'Lead says "then someone can"',
    phase: 'lead',
    whyItMatters:
      'The phrase is grammatical but procedural; repeated use makes leads sound assembled instead of spoken.',
    test: (_puzzle, completedLead) => /\bthen someone can\b/i.test(completedLead),
  },
  {
    patternId: 'lead-someone-can',
    label: 'Lead says "someone can"',
    phase: 'lead',
    whyItMatters:
      'Even without "then," this phrase turns a scene into instructions and makes the voice feel generated.',
    test: (_puzzle, completedLead) => /\bsomeone can\b/i.test(completedLead),
  },
  {
    patternId: 'lead-nearby-wait',
    label: 'Lead uses "nearby ... wait"',
    phase: 'lead',
    whyItMatters:
      'The construction parks a list beside the first list without giving the sentence a natural point of view.',
    test: (_puzzle, completedLead) => /\bnearby, .+ wait\b/i.test(completedLead),
  },
  {
    patternId: 'lead-is-ready-to',
    label: 'Lead says "is ready to"',
    phase: 'lead',
    whyItMatters:
      'It is a utility phrase that often makes answer lists feel like verbs in a drill, not details in a human sentence.',
    test: (_puzzle, completedLead) => /\bis ready to\b/i.test(completedLead),
  },
  {
    patternId: 'lead-hands-know-how',
    label: 'Lead says "hands know how"',
    phase: 'lead',
    whyItMatters:
      'The phrase makes answer lists pretend to be labor instead of letting the sentence name a believable person or situation.',
    test: (_puzzle, completedLead) => /\bhands know how\b/i.test(completedLead),
  },
  {
    patternId: 'lead-eye-somewhere',
    label: 'Lead says "give the eye somewhere"',
    phase: 'lead',
    whyItMatters:
      'This abstract viewing phrase is a template crutch; authored leads should say what a person would actually notice.',
    test: (_puzzle, completedLead) => /\bgive the eye somewhere else to land\b/i.test(completedLead),
  },
  {
    patternId: 'lead-next-motion',
    label: 'Lead says "next motion"',
    phase: 'lead',
    whyItMatters:
      'It labels the second list as mechanics instead of making the filled sentence sound like ordinary human language.',
    test: (_puzzle, completedLead) => /\bthe next motion is to\b/i.test(completedLead),
  },
  {
    patternId: 'lead-static-list-location',
    label: 'Lead ends lists in locations',
    phase: 'lead',
    whyItMatters:
      'Static list-plus-preposition copy can pass grammar checks while still sounding like a template.',
    test: (_puzzle, completedLead) =>
      /, and [a-z]+ (?:are|wait) (?:on|in|at|around|near|inside|toward|by|along)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-second-look-scaffold',
    label: 'Lead uses "second look"',
    phase: 'lead',
    whyItMatters:
      'The phrase can be useful once, but repeated across the schedule it makes the lead feel assembled from a stock reveal beat.',
    test: (_puzzle, completedLead) => /\ba second look finds\b/i.test(completedLead),
  },
  {
    patternId: 'lead-look-again-scaffold',
    label: 'Lead uses "look again"',
    phase: 'lead',
    whyItMatters:
      'This repeated viewing instruction can make otherwise grammatical leads sound like generated observation copy instead of human prose.',
    test: (_puzzle, completedLead) => /\blook again\b/i.test(completedLead),
  },
  {
    patternId: 'lead-focus-later-scaffold',
    label: 'Lead uses delayed focus',
    phase: 'lead',
    whyItMatters:
      'The delayed-focus sentence is a visible template rhythm; future passes should replace it with domain-specific points of view.',
    test: (_puzzle, completedLead) => /\bcome into focus a moment later\b/i.test(completedLead),
  },
  {
    patternId: 'lead-you-notice-scaffold',
    label: 'Lead opens with noticing',
    phase: 'lead',
    whyItMatters:
      'Repeated "you notice" leads keep the player outside the scene; the approved floor asks the sentence to sound observed, not instructed.',
    test: (_puzzle, completedLead) => /\byou notice\b/i.test(completedLead),
  },
  {
    patternId: 'lead-starts-with-scaffold',
    label: 'Lead says "starts with"',
    phase: 'lead',
    whyItMatters:
      'The phrase is a generator shortcut that describes construction order instead of letting the filled sentence behave like ordinary prose.',
    test: (_puzzle, completedLead) => /\b(starts with|begins with)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-first-layer-scaffold',
    label: 'Lead uses clue/layer language',
    phase: 'lead',
    whyItMatters:
      'Layer and clue language exposes the puzzle machinery; the lead should be a standalone sentence about the world of the puzzle.',
    test: (_puzzle, completedLead) =>
      /\b(first layer|second layer|first small facts|first clues|other clues)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-will-verb-chain',
    label: 'Lead uses future verb chain',
    phase: 'lead',
    whyItMatters:
      'A future-tense verb chain often forces answer lists into place; stronger leads make the verbs feel like something a person is doing now.',
    test: (_puzzle, completedLead) =>
      /\b(will [a-z]+, [a-z]+, and [a-z]+|moves next to|moves? on to)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-scene-texture-scaffold',
    label: 'Lead uses texture scaffolding',
    phase: 'lead',
    whyItMatters:
      'Phrases like "scene texture" or "at first glance" name the writing move instead of sounding like a natural line read aloud.',
    test: (_puzzle, completedLead) =>
      /\b(at first glance|within reach|in reach|make an easy first read|scene texture|make the scene fuller|make the scene legible)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-forced-infinitive-chain',
    label: 'Lead forces an infinitive chain',
    phase: 'lead',
    whyItMatters:
      'The sentence may be grammatical, but "has to" or "the work is to" makes the answer list feel installed by the generator instead of spoken by the scene.',
    test: (_puzzle, completedLead) =>
      /\b(has to [a-z]+, [a-z]+, and [a-z]+|is there to [a-z]+, [a-z]+, and [a-z]+|work is to [a-z]+, [a-z]+, and [a-z]+|it is time to [a-z]+, [a-z]+, and [a-z]+|asks? (?:the )?[a-z]+ to [a-z]+, [a-z]+, and [a-z]+)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-doubled-anchor',
    label: 'Lead doubles a place anchor',
    phase: 'lead',
    whyItMatters:
      'Doubled anchors such as "near on the stair" prove the sentence was assembled from parts instead of read as a human line.',
    test: (_puzzle, completedLead) => /\bnear (?:near|along|on|in|inside|outside|toward|by|around|at)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-close-at-hand-scaffold',
    label: 'Lead uses close-at-hand turn',
    phase: 'lead',
    whyItMatters:
      'The close-at-hand turn parks one answer list beside another and describes the transition instead of sounding like a lived sentence.',
    test: (_puzzle, completedLead) => /\b(close at hand|the moment turns toward)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-already-there-scaffold',
    label: 'Lead says "already there"',
    phase: 'lead',
    whyItMatters:
      '"Already there" is a filler staging phrase; authored leads should say what the objects are doing in the scene.',
    test: (_puzzle, completedLead) => /\bare already there\b/i.test(completedLead),
  },
  {
    patternId: 'lead-wait-for-dark-scaffold',
    label: 'Lead uses wait-for-dark scaffold',
    phase: 'lead',
    whyItMatters:
      'The wait-for-dark sentence repeats campsite staging instead of using the selected answers to make a natural moment.',
    test: (_puzzle, completedLead) => /\b(wait for dark|the night gathers around)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-spatial-depth-scaffold',
    label: 'Lead uses spatial-depth staging',
    phase: 'lead',
    whyItMatters:
      'Nearest/farther staging is a visible inventory template; stronger leads let the answer lists belong to a specific human moment.',
    test: (_puzzle, completedLead) =>
      /\b(sit in plain sight|stay up front|gather farther back|wait (?:a little )?farther in|farther out are|where the eye lands|wait where the place opens|stay nearest|sit nearest|nearest part)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-stillness-action-scaffold',
    label: 'Lead uses stillness/action staging',
    phase: 'lead',
    whyItMatters:
      'Still-life/action phrasing describes the generator handoff; authored leads should make the selected nouns and motions feel naturally related.',
    test: (_puzzle, completedLead) =>
      /\b(are the still things|hold the still part|make a small still life|make the pause|make the stillness useful|carry the moving part|make it breathe|break it open|bring the shift|point it onward|start the action)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-close-by-handoff-scaffold',
    label: 'Lead uses close-by handoff',
    phase: 'lead',
    whyItMatters:
      'Close-by/come-after phrasing makes the lead read like answer staging instead of a sentence with its own lived logic.',
    test: (_puzzle, completedLead) =>
      /\b(close by|close to hand|the turn is|come after them|take it from there)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-generic-motion-utility-scaffold',
    label: 'Lead uses generic motion utility',
    phase: 'lead',
    whyItMatters:
      'Utility phrases such as "keep it moving" and "make the room busier" are grammatical filler, not authored scene language.',
    test: (_puzzle, completedLead) =>
      /\b(make the room busier|make the quiet busier|complete the view|make a small inventory|make it less empty|make the place recognizable|make it particular|make the place easy to enter|make it worth staying|make the place tangible|make it move|keep the day moving|keep things going|keep it moving|keep it active|keep the room busy|keep the moment moving|keep the hour alive|keep moving)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-domain-observation-scaffold',
    label: 'Lead uses domain observation scaffold',
    phase: 'lead',
    whyItMatters:
      'Gallery and trail observation phrases like "catch your eye" or "mark the way" repeat a stock viewpoint instead of sounding freshly observed.',
    test: (_puzzle, completedLead) =>
      /\b(catch your eye|visitor lingers over|looking slows around|another pass finds|keeps returning|attention drifts toward|trail is marked by|mark the way|walk opens toward|walk finds)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-gallery-slow-look-scaffold',
    label: 'Lead uses gallery slow-look scaffold',
    phase: 'lead',
    whyItMatters:
      'Gallery leads were repeating "hold the first look" and "visitor slows" copy; the stronger voice puts the visitor into a specific sentence.',
    test: (_puzzle, completedLead) =>
      /\b(visitor slows for|hold the first look|attention settles on|slower look finds)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-trail-path-offers-scaffold',
    label: 'Lead uses trail path-offers scaffold',
    phase: 'lead',
    whyItMatters:
      'Trail leads should feel like a hike, not a repeated "path offers" inventory of signs and scenery.',
    test: (_puzzle, completedLead) =>
      /\b(path offers|day keeps offering|keep the route clear)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-domain-task-scaffold',
    label: 'Lead uses domain task scaffold',
    phase: 'lead',
    whyItMatters:
      'Task-domain phrases like "recipe calls for" and "work waits in" reveal template mechanics instead of giving the scene a natural speaker.',
    test: (_puzzle, completedLead) =>
      /\b(recipe calls for|recipe line|dinner turns toward|station platform points|travelers pass|soften the wait|fill the pause|waiting gathers around|work waits in|tell the day where to begin|surface toward work|first real task|workday its first shape)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-procedural-domain-filler',
    label: 'Lead uses procedural domain filler',
    phase: 'lead',
    whyItMatters:
      'Phrases like "water calls for," "fill the spare minutes," and "follow after" keep the sentence grammatically valid but make it feel assembled.',
    test: (_puzzle, completedLead) =>
      /\b(the water calls for|the water wants|leaving will mean|morning is headed for|the day leans toward|fill the spare minutes|keep the route legible|the way out runs through|arrive next|arrives next|follow after|the first task arrives as|the work behind it is|the quiet work is|the first sound waits for|the room's first signs are|the room's first cues are|the first cues from the room are|soon the room has|the next hour is|the work turns to|the room turns toward|the first signs outside are|the first signs from the block are|the first signs from the street are|the counter is already calling out|by the time the server brings|make the work concrete|people pass the wait with|soon they are|by noon they are|soon the crew is|the evening turns to|the hour turns to|the clerk starts to|the operator starts to|the operator begins to|the voice begins to|give the first sound its shape)\b/i.test(
        completedLead
      ),
  },
  {
    patternId: 'lead-picnic-blanket-scaffold',
    label: 'Lead uses picnic blanket scaffold',
    phase: 'lead',
    whyItMatters:
      'Picnic leads were falling into the same blanket inventory and afternoon-loosens rhythm; stronger rows need a sentence someone might actually say.',
    test: (_puzzle, completedLead) =>
      /\b(picnic blanket|on the blanket|across the blanket|blanket holds|blanket is set|spread out|after a few minutes|afternoon loosens|afternoon calls for|beyond it are|park adds|afternoon gathers around|park keeps .+ in the day|leaves room for|day has room for|park is easy with|afternoon keeps .+ close)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-theater-stage-scaffold',
    label: 'Lead uses theater stage scaffold',
    phase: 'lead',
    whyItMatters:
      'Theater leads should feel like a room about to respond, not a repeated stage/out-front split with the same blocking every time.',
    test: (_puzzle, completedLead) =>
      /\b(onstage|before the curtain|house lights|in the house|out front|people in the seats|stage is set|stage has|audience sits with|room begins to|audience brings|room leans toward|room is full of|room answers with|room gives back)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-bench-lab-scaffold',
    label: 'Lead uses bench/lab scaffold',
    phase: 'lead',
    whyItMatters:
      'Workbench and lab copy can sound mechanically valid while repeating "turns on," "calls for," and "bench ready" phrasing; the floor now requires more direct human syntax.',
    test: (_puzzle, completedLead) =>
      /\b(workbench|lab bench|bench light|bench holds|bench is ready|sit ready|are laid out|repair turns|broken part points|small problem shows itself|test calls for|test turns to|result turns on|question narrows around|experiment turns on|answer gathers around|fix comes down to|repair needs|thing to solve|notebook fills with|work follows)\b/i.test(completedLead),
  },
  {
    patternId: 'lead-abstract-stage-direction',
    label: 'Lead uses abstract stage direction',
    phase: 'lead',
    whyItMatters:
      'Phrases like "pull the edges wider" or "stir the moment" describe the copy move instead of naming something a person can picture.',
    test: (_puzzle, completedLead) =>
      /\b(hold the room steady|pull the edges wider|hold the practical side|make the place feel particular|make the room recognizable|the rest leans on|steady the room|make it feel inhabited|settle the eye|stir the moment|hold the ordinary ground|change the air|settle first|turn the page|fill out the edges|fill the quiet edges|hold the front of the moment|collect around the edges|make the place feel lived in|round out the room|nearest edge|farther part|finish the picture|give the (?:place|moment|day|room|work|rest)|pull the place forward|keep the day from (?:staying still|stopping)|keep the room from stopping|carry the day forward|keep the scene awake|keep the moment close|send it forward|make the day shift|carry the room past them|loosen it|give the stillness a turn)\b/i.test(completedLead),
  },
];

export function inspectThreadlineVoiceFloor(
  puzzles: readonly ThreadlinePuzzle[],
  datedSchedule?: readonly ThreadlineAuditScheduleEntry[],
  puzzleById?: Readonly<Record<string, ThreadlinePuzzle | undefined>>,
  sampleLimit = 8
): ThreadlineVoiceFloorSummary[] {
  const entries = getOrderedPuzzleEntries(puzzles, datedSchedule, puzzleById);

  return VOICE_FLOOR_PATTERNS.map((pattern) => {
    const hits = entries
      .map(({ puzzle, dateKey }) => {
        const completedLead = renderThreadlineCompletedLead(puzzle);
        if (!pattern.test(puzzle, completedLead)) return null;

        return {
          patternId: pattern.patternId,
          label: pattern.label,
          puzzleId: puzzle.id,
          dateKey,
          title: puzzle.title,
          completedLead,
          weave: puzzle.weave,
        } satisfies ThreadlineVoiceFloorHit;
      })
      .filter((hit): hit is ThreadlineVoiceFloorHit => Boolean(hit));

    return {
      patternId: pattern.patternId,
      label: pattern.label,
      phase: pattern.phase,
      count: hits.length,
      whyItMatters: pattern.whyItMatters,
      sampleHits: hits.slice(0, sampleLimit),
    } satisfies ThreadlineVoiceFloorSummary;
  });
}

export function auditThreadlineCopy(options: ThreadlineCopyAuditOptions): ThreadlineCopyAuditReport {
  const {
    puzzles,
    datedSchedule,
    puzzleById,
    editorReview,
    titleReuseCooldownDays,
    payoffReuseCooldownDays,
    scoreThresholds = THREADLINE_COPY_SCORE_THRESHOLDS,
    maxSemicolonLeads,
    maxLeadStructureRepeats = 3,
    maxWeaveStructureRepeats = 6,
  } = options;
  const issues: ThreadlineCopyAuditIssue[] = [];
  const lookup = makePuzzleLookup(puzzles, puzzleById);

  datedSchedule?.forEach((entry) => {
    if (!lookup[entry.puzzleId]) {
      issues.push({
        severity: 'critical',
        code: 'missing-puzzle',
        puzzleId: entry.puzzleId,
        dateKey: entry.dateKey,
        message: 'Dated schedule references a missing puzzle.',
      });
    }
  });

  if (maxSemicolonLeads !== undefined) {
    const semicolonLeads = getOrderedPuzzleEntries(puzzles, datedSchedule, lookup)
      .map(({ puzzle, dateKey }) => ({
        puzzle,
        dateKey,
        completedLead: renderThreadlineCompletedLead(puzzle),
      }))
      .filter((entry) => entry.completedLead.includes(';'));

    if (semicolonLeads.length > maxSemicolonLeads) {
      semicolonLeads.forEach((entry) => {
        issues.push({
          severity: 'critical',
          code: 'lead-semicolon-rhythm',
          puzzleId: entry.puzzle.id,
          dateKey: entry.dateKey,
          value: semicolonLeads.length,
          message: `Completed lead uses the retired semicolon two-list rhythm; shipped ceiling is ${maxSemicolonLeads}.`,
        });
      });
    }
  }

  puzzles.forEach((puzzle) => {
    issues.push(...inspectThreadlineTitlePayoffCoherence(puzzle).issues);

    if (editorReview && !editorReview[puzzle.id]) {
      issues.push({
        severity: 'critical',
        code: 'missing-review',
        puzzleId: puzzle.id,
        message: 'Puzzle is missing editor review metadata.',
      });
    }
  });

  const titlePayoff = inspectThreadlineTitlePayoffReuse(puzzles, datedSchedule, lookup, {
    titleReuseCooldownDays,
    payoffReuseCooldownDays,
  });
  const orderedEntries = getOrderedPuzzleEntries(puzzles, datedSchedule, lookup);
  issues.push(
    ...titlePayoff.genericSuffixTitles,
    ...titlePayoff.exactTitleReuseIssues,
    ...titlePayoff.titleCooldownIssues,
    ...titlePayoff.payoffCooldownIssues,
    ...inspectThreadlineRejectedCopyAnswers(orderedEntries),
    ...inspectThreadlineSamePuzzleRootRepeats(orderedEntries),
    ...inspectThreadlineMixedGerundThreads(orderedEntries),
    ...inspectThreadlineAnswerSetRepeats(orderedEntries),
    ...inspectThreadlineThreadTripleRepeats(orderedEntries),
    ...inspectThreadlineWeaveStructureRepeats(orderedEntries, maxWeaveStructureRepeats),
    ...inspectThreadlineLeadStructureRepeats(orderedEntries, maxLeadStructureRepeats)
  );

  const scoreResult = editorReview
    ? inspectReviewScores(
        orderedEntries.map(({ puzzle }) => puzzle.id),
        editorReview,
        scoreThresholds
      )
    : { issues: [], dimensions: [] };
  issues.push(...scoreResult.issues);

  const criticalIssues = issues.filter((issue) => issue.severity === 'critical');
  const warningIssues = issues.filter((issue) => issue.severity === 'warning');

  return {
    issues,
    criticalIssues,
    warningIssues,
    titlePayoff,
    difficultyBands: summarizeThreadlineDifficultyBands(puzzles),
    scoreDimensions: scoreResult.dimensions,
    voiceFloor: inspectThreadlineVoiceFloor(puzzles, datedSchedule, lookup),
  };
}

export function formatThreadlineCopyAuditIssues(issues: readonly ThreadlineCopyAuditIssue[]): string[] {
  return issues.map((issue) => {
    const location = [issue.dateKey, issue.puzzleId].filter(Boolean).join(' ') || 'pack';
    return `${issue.severity}:${issue.code}:${location}: ${issue.message}`;
  });
}
