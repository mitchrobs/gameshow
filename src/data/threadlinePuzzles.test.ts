import { describe, expect, it } from 'vitest';
import {
  getDailyThreadline,
  getThreadlinePuzzles,
  pathToLetters,
  validateThreadlinePuzzle,
} from './threadlinePuzzles';
import type { ThreadlinePuzzle } from './threadlinePuzzles';
import {
  THREADLINE_APPROVED_COPY_BY_DATE,
  THREADLINE_APPROVED_COPY_BY_PUZZLE_ID,
  THREADLINE_DATED_PUZZLE_BY_DATE,
  THREADLINE_DATED_SCHEDULE,
  THREADLINE_EDITOR_REVIEW,
  THREADLINE_HOLIDAY_NODS,
  THREADLINE_PUZZLE_BANK,
  THREADLINE_PUZZLE_BY_ID,
  THREADLINE_RESERVES,
  THREADLINE_RETIRED_APPROVAL_NOTE_COPY,
  THREADLINE_SHIPPED_DATED_DAYS,
  THREADLINE_SHIPPED_END_DATE_KEY,
  THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS,
  THREADLINE_SHIPPED_FORMER_RESERVE_DAYS,
  THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS,
  THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS,
  THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS,
  THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS,
  THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS,
  THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS,
  THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH,
  THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH,
  THREADLINE_REJECTED_COPY_ANSWERS,
  THREADLINE_SHIPPED_CANDIDATE_DAYS,
  THREADLINE_SHIPPED_RESERVE_DAYS,
  THREADLINE_SHIPPED_REJECTED_DATE_KEYS,
  THREADLINE_SHIPPED_START_DATE_KEY,
  THREADLINE_SHIPPED_TOTAL_PUZZLES,
  THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS,
  THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS,
  THREADLINE_SHIPPED_WORDS_PER_DAY,
  THREADLINE_WORDS_BY_DOMAIN_THREAD,
  formatThreadlineShippedPackMarkdown,
  getThreadlineOutOfWindowFallback,
  getThreadlineRollingAverageLengths as getShippedRollingAverageLengths,
  getThreadlineShippedRootFamilyWarnings,
} from './threadlineShippedPack';
import {
  THREADLINE_ANSWER_COOLDOWN_DAYS,
  THREADLINE_MAX_ROLLING_AVERAGE_LENGTH,
  THREADLINE_MIN_ROLLING_AVERAGE_LENGTH,
  THREADLINE_RESERVE_DAYS,
  THREADLINE_REVIEW_DAYS,
  THREADLINE_WORDS_PER_DAY,
  generateThreadlineCalendarReview,
  getThreadlineRollingAverageLengths,
  getThreadlineRootFamilyWarnings,
  validateThreadlineReviewCalendar,
} from './threadlineCalendarReview';
import {
  THREADLINE_COPY_SCORE_THRESHOLDS,
  auditThreadlineCopy,
  formatThreadlineCopyAuditIssues,
  getThreadlineAnswerSetSignature,
  getThreadlineLeadStructureSignature,
  getThreadlineThreadTripleSignatures,
  getThreadlineWeaveStructureSignature,
  inspectThreadlineVoiceFloor,
  inspectThreadlineTitlePayoffCoherence,
  inspectThreadlineTitlePayoffReuse,
  renderThreadlineCompletedLead,
  summarizeThreadlineDifficultyBands,
} from './threadlineCopyAudit';
import {
  THREADLINE_RECENTLY_RETIRED_LEAD_COPY,
  isThreadlineMechanicalWeave,
  isThreadlineRoboticLead,
  isThreadlineRoboticTitle,
  normalizeThreadlineEditorialTokenText,
} from './threadlineEditorialCopy';

const THREADLINE_COPY_AUDIT_OPTIONS = {
  titleReuseCooldownDays: 180,
  payoffReuseCooldownDays: 180,
  scoreThresholds: THREADLINE_COPY_SCORE_THRESHOLDS,
  maxLeadStructureRepeats: THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS,
  maxWeaveStructureRepeats: THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS,
};
const THREADLINE_TITLE_STOP_WORDS = new Set(['AND', 'ARE', 'FOR', 'FROM', 'INTO', 'ITS', 'ONE', 'THE', 'THIS', 'WITH']);
const THREADLINE_WEAK_TASTE_PATTERNS =
  /\b(fills the wait|keeps you walking|makes it an afternoon|tells people what to do|sends it moving again|makes the room lean in|is why you sat down|has a voice|where it is|weather becomes logistics|gives shore finds|feel human when|becomes company by traveling|is a promise to leave|finishes the dark|slow taste begins|the water calls for|the water wants|leaving will mean|morning is headed for|the day leans toward|fill the spare minutes|keep the route legible|the way out runs through|arrive next|arrives next|follow after|the first task arrives as|the work behind it is|the quiet work is|the first sound waits for|the room's first signs are|the room's first cues are|the first cues from the room are|soon the room has|the next hour is|the work turns to|the room turns toward|the first signs outside are|the first signs from the block are|the first signs from the street are|the counter is already calling out|by the time the server brings|make the work concrete|people pass the wait with|soon they are|by noon they are|soon the crew is|the evening turns to|the hour turns to|the clerk starts to|the clerk can|a visitor (?:begins|stops|pauses|starts|chooses|has time|takes time|takes a moment) to|the cook turns (?:next )?to|cook goes on to|the water starts to|the water begins to|the edge begins to|the shoreline begins to|the tide starts to|shoreline keeps moving through|tell people when to move|fill the waiting|put the trip in view|path is marked by|woods answer with|repair note names|damaged piece shows|loose part shows|the operator starts to|the operator begins to|the voice begins to|the operator can|the voice can|signal is shaped by|signal takes shape through|give the first sound its shape|the beds are bright with|the day's work is|morning work is|beyond it, the work is|garden path shows|morning is for|hands move through|room settles into|afternoon moves through|hour moves through|work is mostly|washday has|line moves through|slow the line into|counter turns busy|breakfast becomes|order takes shape through|line pauses over|morning waits on|order moves through|before long, .+ take over|by noon, .+ take over|morning opens toward|next hour turns toward|day turns to|rail is busy with|cut into the sky|fill the hour|settle over the evening|hold the skyline|looks out past|rail looks out on|fill the view|high rail looks past|front step keeps|hold the house in place|porch light catches|turn the step toward|set the edge of the house|house is ready with|hold the light|carry the street|turn the doorway outward|pull the door into|front edge has|bring the block close|shore finds|water motion|camp gear|camp moves|keeps up with|answers with|wait quietly|outside are|outside,? the block|front step has|porch light falls|seats hold|from (?:the )?(?:block|street|sidewalk|counter) come|after dark come|after dusk|evening moves through|campsite opens around|are unpacked|lunch is set out with|make lunch visible|make a table|lunch has|the grass is ready for|the food is simple|the park gives|stage details|audience cues|packed things|park motions|repair clues|lab pieces|bench steps|art details|visitor moves|stall goods|buyer moves|path details|passing routines|trail signs|natural details|book details|quiet habits|classroom objects|starting signals|first-hour work|fabric details|wash-day moves|lens pieces|sky motions|skyline details|evening motions|news pieces|press moves|type pieces|beacon pieces|tower pieces|coast cues|growing things|tending moves|doorstep details|street signals|neighbor signals|doorstep objects|evening cues|porch details|bright-night motions|dome sights|show cues|ceiling sights|sky sights|case treats|shop motions|counter details|street cues|weather gear|route cues|paper trails|delivery steps|dock objects|boat motions|instrument details|listening cues)\b/i;
const THREADLINE_NEWLY_RETIRED_LEAD_PATTERNS =
  /\b(hour fills with|next hour gathers|small work of|the room finds|day fills with|morning fills with|feels made from|keep it from feeling empty|keep the beach brief|first hour is full|night fills with|firelight settles over|keep going through|glass catches|room steadies itself|broadcast goes out|counter turns to|order becomes|make the first idea visible|make the draft visible|take the boat out|counter handles|rehearsal gathers around|settle into [a-z]+ing|bring the draft into view|give the quiet shape|keep the fire tended|keep the sand unsettled|wait for [a-z]+ing, [a-z]+ing, and [a-z]+ing|wait while|sit close while|look ready while|decide what (?:goes|leaves)|make breakfast specific|visit becomes|draws its outline|hour is spent|keeps the room busy|are what rehearsal is for|give the first hour its shape|works through|wait beyond the rail|make the wait sweet|the first desks have|the morning has|the room slows around|attention turns to|the day steadies itself|the day leans into|the morning turns to|the boat turns to|the page waits with|show where hands should go|give breakfast its rhythm|the hour softens into|the back room handles|the room warms into|gather in a corner|point past the pause|wait while shoppers|visitors keep|room is just|waiting for|wait for|counter work is|shape the first run|the rest is|makes a place|settle into the rest|mailroom shelf has|back room hums|are ready before|room agrees to listen|stay close before the trip becomes|are still separate when|tempt the line while|cover the desks, and after it|give the run a count|move one choice into paper|first decisions|wait as|cross the night|mark the sand while|long enough for|show where the fix begins|carry the room onward|broadcast runs on|water ahead means|come back from .* ready|keep the line looking|stay close to the eye|people keep|on the page are|are ready as|give the room a sound|city below becomes|protocol says|work moves toward|near the surface|finish the thought|sitting toward|first, then lets|has room for|same quiet|rest of the moment calls|hands slipping|signal is built from|move the work along|keep the room in motion|signal leaves with|add the next turn|enter the day|carry the hour|move the day along|give the scene another pulse|fill the back of the scene|ready for a morning of|hold the view|show what clay can become|notes say|screens say|wait for hands to|sit ready for|water stream|shift the scene|move the scene onward|drills for [a-z]+, [a-z]+, and [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ find the beat|shape an hour of|carry the evening|plan is to|notes settle on|drills? to [a-z]+, [a-z]+, and [a-z]+|make the room look ready|room look ready|make the next move|make the turn|hour goes out with|bring the room alive|house answers with|point farther on|stay close to the cup|the table has|a regular table has|a walk by|the first mile has|the forecast has [^.?!]+ by the door and the route has|bring the train close|share the table with|stay close while hands|hands are [a-z]+, [a-z]+, and [a-z]+|keep people close|fill the room|ready for one|come back through|come back after|pass through [^.?!]+ before the drawer|make room for|make the dark practical|sit on the shelf|by way of|give the morning voices|turn camp into a room|pass through the seats|ready for a carrier|ready for the kiln|hold the stage|make every choice sweeter|stay under their hands|raise the questions|for one [a-z]+, one [a-z]+, and one [a-z]+|clerks keep [a-z]+ing, [a-z]+ing, and [a-z]+ing|sit beside a loose [a-z]+, a split [a-z]+, and a rough [a-z]+|before [a-z]+, [a-z]+, and [a-z]+ take over|forecast shifts toward|answers through|reports report|pressure keeps reveal|skies (?:update|gusting)|gusts keep thaw|swing wind|warn pressure|drizzle wind|and a clear|make a clear beginning|add a little weight|pile feels wearable|water keeps [a-z]+ing, [a-z]+ing, and [a-z]+ing|can disappear before|make people linger over|short list:|card sit beside|change under hands that)\b/i;
const THREADLINE_NEWLY_RETIRED_WEAVE_PATTERNS =
  /\b(matters because|less quiet|hunger gets specific|make the draft visible|make the first idea visible|turns wanting into choosing|turns appetite practical|turns sugar into (?:a plan|a choice)|turns waiting into breakfast|line ends where hunger gets named|ordinary work makes order visible|work is ordinary and merciful|can be reset by small care|makes waiting practical|gets kinder as the shape settles|gets kinder when the coast can read|silence becomes part of the artwork|finger on the glass makes breakfast specific|box gives breakfast a handle|room becomes inward around the page|shelf becomes useful when the room starts moving|desk becomes useful when the day gets specific|room gets one fresh ending|quiet turns a room into a show|first minutes turn the room into class|(?:broken edge|nick) can make the whole room practical|above traffic,? evening becomes gentle|public room can become one quiet place|room turns waiting into arrival|warm box makes the morning sweeter|dome turns waiting into wonder|room gets larger when sound leaves it|music makes the room visible|small room gives the voice longer reach|care turns a heap back into a home|breakfast feels chosen before the box closes|soft care gives the day its shape back|the day gets real|art turns a pause into attention|the loop turns motion into neighborhood|the day gets greener where care repeats|the day gets less abstract|shape gets personal|wanting becomes practical|distance becomes practical|the water gives the rail a reason|quiet work gives green its confidence|desk turns scattered work|repair begins when the damage gets specific|a room gets quiet enough for distance|gives breakfast a regular|last light makes distance kind|the door gives the room its purpose|marks turn the table toward shape|the meal gets real|gentle work gives the shelf its purpose|a deadline can make doubt useful|desk order gives the work|wonder becomes evidence one careful step|the gate wakes when the sky gets close|a quiet counter can make time present|a fix begins where the damage speaks|doubt gives the day|low water gives the sand|box closes on the thing|supper begins before the pan|a rehearsal turns patience|the roof opens and the room looks|breakfast gets chosen|small work gives the season somewhere|the breath before open water|turns separate ingredients toward supper|one chosen sweetness|tells the room what the supplies are for|makes sound by agreeing on time|stops being work|starts with a choice under glass|materials stop being separate|far sky feels near|memory it cannot keep|teaches looking to slow down|the city softens from above|care makes wonder useful|street sounds farther away|noise becomes evening|curiosity slowed down|hand leaves something the fire can keep|story earns trust before daylight|care made measurable|alarm gives readiness|alarm gives the room|distance becomes care|station listens through instruments and forecast shifts|instruments turn pressure into forecast shifts|a remedy is care measured small|the pile comes back ready|the pile returns as something wearable|ready for drawers|ready to be worn|ready for ordinary use|turns supplies into a (?:class|morning)|a fire gives the wild a room|fabric leaves the wash folded and warm|forecast shifts|the water turns the tank into weather)\b/i;
const THREADLINE_WEAK_SLOT_WORDS =
  /\b(warmer|sitdown|fogbound|lockup|platen|stellar|skyward|recedes|clouding|seaward|aiming|marking|cueing|ducking)\b/i;

function countThreadlineLeadAnswerOccurrences(completedLead: string, answer: string): number {
  const target = normalizeThreadlineEditorialTokenText(answer);
  if (target.length < 4 || target.includes(' ')) return 1;
  return normalizeThreadlineEditorialTokenText(completedLead)
    .split(/\s+/)
    .filter((token) => token === target).length;
}

function getShippedThreadlineCopyAudit() {
  return auditThreadlineCopy({
    puzzles: THREADLINE_PUZZLE_BANK,
    datedSchedule: THREADLINE_DATED_SCHEDULE,
    puzzleById: THREADLINE_PUZZLE_BY_ID,
    editorReview: THREADLINE_EDITOR_REVIEW,
    ...THREADLINE_COPY_AUDIT_OPTIONS,
  });
}

describe('threadline puzzles', () => {
  it('ships every approved puzzle in the dated Threadline schedule', () => {
    expect(THREADLINE_PUZZLE_BANK).toHaveLength(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(THREADLINE_DATED_SCHEDULE).toHaveLength(THREADLINE_SHIPPED_DATED_DAYS);
    expect(THREADLINE_RESERVES).toHaveLength(THREADLINE_SHIPPED_RESERVE_DAYS);

    const dateKeys = new Set(THREADLINE_DATED_SCHEDULE.map((entry) => entry.dateKey));
    const puzzleIds = new Set(THREADLINE_PUZZLE_BANK.map((puzzle) => puzzle.id));
    const scheduledPuzzleIds = new Set(THREADLINE_DATED_SCHEDULE.map((entry) => entry.puzzleId));
    const reservePuzzleIds = new Set(THREADLINE_RESERVES.map((entry) => entry.puzzleId));
    const packedPuzzleIds = new Set([...scheduledPuzzleIds, ...reservePuzzleIds]);

    expect(dateKeys.size).toBe(THREADLINE_SHIPPED_DATED_DAYS);
    expect(puzzleIds.size).toBe(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(packedPuzzleIds).toEqual(puzzleIds);
    expect(scheduledPuzzleIds.size + reservePuzzleIds.size).toBe(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(THREADLINE_SHIPPED_TOTAL_PUZZLES + THREADLINE_SHIPPED_REJECTED_DATE_KEYS.length).toBe(
      THREADLINE_SHIPPED_CANDIDATE_DAYS
    );
    expect(THREADLINE_DATED_SCHEDULE[0].dateKey).toBe(THREADLINE_SHIPPED_START_DATE_KEY);
    expect(THREADLINE_DATED_SCHEDULE.at(-1)?.dateKey).toBe(THREADLINE_SHIPPED_END_DATE_KEY);
    expect(THREADLINE_SHIPPED_RESERVE_DAYS).toBeGreaterThan(0);

    const rejectedDateKeys = new Set<string>(THREADLINE_SHIPPED_REJECTED_DATE_KEYS);
    THREADLINE_DATED_SCHEDULE.forEach((entry, index) => {
      if (index > 0) {
        expect(entry.dateKey > THREADLINE_DATED_SCHEDULE[index - 1].dateKey).toBe(true);
      }
      expect(rejectedDateKeys.has(entry.dateKey)).toBe(false);
      expect(THREADLINE_PUZZLE_BY_ID[entry.puzzleId]).toBeTruthy();
    });
    THREADLINE_RESERVES.forEach((entry) => {
      expect(scheduledPuzzleIds.has(entry.puzzleId)).toBe(false);
      expect(THREADLINE_PUZZLE_BY_ID[entry.puzzleId]).toBeTruthy();
      expect(entry.sourceDateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (entry.reserveStatus === 'needs-tightening') {
        expect(entry.tighteningNote).toMatch(/Former dated row held for later tightening/);
        expect(entry.tighteningNote).toContain(THREADLINE_PUZZLE_BY_ID[entry.puzzleId].title);
      } else {
        expect(entry.reserveStatus).toBe('ready');
        expect(entry.tighteningNote).toBeNull();
      }
    });
  });

  it('moves the 86 lowest former dated rows into a reserve tightening queue', () => {
    const tighteningReserves = THREADLINE_RESERVES.filter((entry) => entry.reserveStatus === 'needs-tightening');
    const readyReserves = THREADLINE_RESERVES.filter((entry) => entry.reserveStatus === 'ready');
    const scheduledAndTighteningSourceDates = new Set([
      ...THREADLINE_DATED_SCHEDULE.map((entry) => entry.dateKey),
      ...tighteningReserves.map((entry) => entry.sourceDateKey),
    ]);

    expect(THREADLINE_DATED_SCHEDULE).toHaveLength(
      THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS - THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS
    );
    expect(tighteningReserves).toHaveLength(THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS);
    expect(readyReserves).toHaveLength(THREADLINE_SHIPPED_RESERVE_DAYS - THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS);
    expect(scheduledAndTighteningSourceDates.size).toBe(THREADLINE_SHIPPED_FORMER_DATED_CANDIDATE_DAYS);
    tighteningReserves.forEach((entry) => {
      const review = THREADLINE_EDITOR_REVIEW[entry.puzzleId];

      expect(review.dateKey).toBeNull();
      expect(review.freshnessNote).toContain(`Reserve source date ${entry.sourceDateKey}`);
      expect(review.freshnessNote).toContain(entry.tighteningNote ?? '');
      expect(entry.tighteningNote).toMatch(/improve .+\(\d\.\d{2}\)/);
      expect(entry.tighteningNote).toContain('filled lead');
      expect(entry.tighteningNote).toContain('weave');
    });
  });

  it('resolves shipped dates through the dated schedule instead of the old rotation', () => {
    const firstScheduled = THREADLINE_DATED_SCHEDULE[0];
    const fourthScheduled = THREADLINE_DATED_SCHEDULE[3];
    const firstPuzzle = getDailyThreadline(new Date(`${firstScheduled.dateKey}T12:00:00`));
    const fourthPuzzle = getDailyThreadline(new Date(`${fourthScheduled.dateKey}T12:00:00`));

    expect(firstPuzzle.id).toBe(firstScheduled.puzzleId);
    expect(fourthPuzzle.id).toBe(fourthScheduled.puzzleId);
    expect(firstPuzzle.id).not.toBe(fourthPuzzle.id);
    expect(THREADLINE_DATED_PUZZLE_BY_DATE[firstScheduled.dateKey]).toBe(firstScheduled.puzzleId);
  });

  it('distributes out-of-window fallback across the reserve bank', () => {
    const reservePuzzleIds = new Set(THREADLINE_RESERVES.map((entry) => entry.puzzleId));
    const packedPuzzleIds = new Set(THREADLINE_PUZZLE_BANK.map((puzzle) => puzzle.id));
    const seenPuzzleIds = new Set<string>();

    for (let offset = 1; offset <= 140; offset += 1) {
      const date = new Date(`${THREADLINE_SHIPPED_END_DATE_KEY}T12:00:00`);
      date.setDate(date.getDate() + offset);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const fallback = getThreadlineOutOfWindowFallback(`${date.getFullYear()}-${month}-${day}`);
      expect(packedPuzzleIds.has(fallback.id)).toBe(true);
      expect(reservePuzzleIds.has(fallback.id)).toBe(true);
      seenPuzzleIds.add(fallback.id);
    }

    expect(seenPuzzleIds.size).toBeGreaterThanOrEqual(30);
  });

  it('keeps authored paths legal and synced to answers', () => {
    const errors = getThreadlinePuzzles().flatMap(validateThreadlinePuzzle);
    expect(errors).toEqual([]);
  });

  it('uses every blank reference as a playable hidden word', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      const wordIds = new Set(puzzle.words.map((word) => word.id));
      const blankIds = puzzle.lead
        .filter((segment) => segment.type === 'blank')
        .map((segment) => segment.wordId);

      expect(blankIds.length).toBeGreaterThan(0);
      blankIds.forEach((id) => expect(wordIds.has(id)).toBe(true));
    });
  });

  it('ships every packed puzzle through the manual read-aloud approval layer', () => {
    expect(Object.keys(THREADLINE_APPROVED_COPY_BY_PUZZLE_ID)).toHaveLength(THREADLINE_SHIPPED_TOTAL_PUZZLES);
    expect(Object.keys(THREADLINE_APPROVED_COPY_BY_DATE)).toHaveLength(THREADLINE_SHIPPED_DATED_DAYS);
    const approvalNoteFrames = new Map<string, number>();
    const scheduledDatesByPuzzleId = new Map(
      THREADLINE_DATED_SCHEDULE.map((entry) => [entry.puzzleId, entry.dateKey] as const)
    );

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const approval = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[puzzle.id];
      const scheduledDate = scheduledDatesByPuzzleId.get(puzzle.id);

      expect(approval).toBeTruthy();
      if (scheduledDate) {
        expect(approval.dateKey).toBe(scheduledDate);
        expect(THREADLINE_APPROVED_COPY_BY_DATE[scheduledDate]).toBe(approval);
      } else {
        expect(approval.dateKey).toBeNull();
      }
      expect(approval.editorStatus).toBe('approved');
      expect(approval.approvalSource).toBe('manual-600-exceptional-floor');
      expect(approval.title).toBe(puzzle.title);
      expect(approval.filledLead).toBe(renderThreadlineCompletedLead(puzzle));
      expect(approval.weave).toBe(puzzle.weave);
      expect(approval.reviewNote).toMatch(/^Title "/);
      expect(approval.reviewNote).not.toMatch(THREADLINE_RETIRED_APPROVAL_NOTE_COPY);
      expect(approval.reviewNote).toContain(`Title "${approval.title}"`);
      expect(approval.reviewNote).toContain(`Lead read: "${approval.filledLead.slice(0, 24)}`);
      expect(approval.reviewNote).toContain(`Weave "${approval.weave}"`);
      expect(approval.reviewNote).toMatch(/Scores: \d\.\d{2} grammar, \d\.\d{2} weave\./);
      expect(approval.reviewNote).not.toMatch(/cleared editorial pursuit checks/i);
      const noteFrame = approval.reviewNote
        .replace(/"[^"]+"/g, '"..."')
        .replace(/Scores: \d\.\d{2} grammar, \d\.\d{2} weave\./g, 'Scores: # grammar, # weave.');
      approvalNoteFrames.set(noteFrame, (approvalNoteFrames.get(noteFrame) ?? 0) + 1);
      expect(approval.readAloudChecklist).toEqual([
        'title is natural and nonspoiling',
        'filled lead reads aloud as a standalone sentence',
        'answers have plausible grammatical roles',
        'weave connects the two themes without category math',
      ]);
    });

    expect(approvalNoteFrames.size).toBeGreaterThanOrEqual(80);
    expect(Math.max(...approvalNoteFrames.values())).toBeLessThanOrEqual(12);
  });

  it('keeps both threads represented by playable words', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      expect(puzzle.threads).toHaveLength(2);
      puzzle.threads.forEach((thread) => {
        expect(puzzle.words.some((word) => word.threadId === thread.id)).toBe(true);
      });
    });
  });

  it('spells each answer from the grid in path order', () => {
    getThreadlinePuzzles().forEach((puzzle) => {
      puzzle.words.forEach((word) => {
        expect(pathToLetters(puzzle, word.path)).toBe(word.answer);
      });
    });
  });

  it('generates a valid 365-day plus reserve review calendar', () => {
    const expectedDays = THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS;
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: expectedDays,
    });

    expect(review.candidates).toHaveLength(expectedDays);
    expect(validateThreadlineReviewCalendar(review.candidates)).toEqual([]);
    expect(review.scoreAverages.threadBalance).toBe(5);
    expect(review.scoreAverages.safetyBrandRisk).toBe(5);
  });

  it('keeps generated answers outside the cooldown window', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });
    const lastSeen = new Map<string, number>();

    review.candidates.forEach((candidate) => {
      candidate.puzzle.words.forEach((word) => {
        const previousDay = lastSeen.get(word.answer);
        if (previousDay !== undefined) {
          expect(candidate.dayIndex - previousDay).toBeGreaterThan(
            THREADLINE_ANSWER_COOLDOWN_DAYS
          );
        }
        lastSeen.set(word.answer, candidate.dayIndex);
      });
    });
  });

  it('keeps generated days at six words with a longer-word bias', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });

    review.candidates.forEach((candidate) => {
      expect(candidate.puzzle.words).toHaveLength(THREADLINE_WORDS_PER_DAY);
      expect(candidate.puzzle.words.filter((word) => word.answer.length >= 6).length).toBeGreaterThanOrEqual(3);
      expect(candidate.puzzle.words.every((word) => word.answer.length >= 4)).toBe(true);
      candidate.puzzle.threads.forEach((thread) => {
        expect(candidate.puzzle.words.filter((word) => word.threadId === thread.id)).toHaveLength(3);
      });
    });
  });

  it('keeps the rolling answer length in the editorial target band', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });
    const rollingAverages = getThreadlineRollingAverageLengths(review.candidates);

    expect(rollingAverages.length).toBeGreaterThan(0);
    rollingAverages.forEach((window) => {
      expect(window.averageLength).toBeGreaterThanOrEqual(THREADLINE_MIN_ROLLING_AVERAGE_LENGTH);
      expect(window.averageLength).toBeLessThanOrEqual(THREADLINE_MAX_ROLLING_AVERAGE_LENGTH);
    });
  });

  it('separates root-family repeats from exact cooldown errors', () => {
    const review = generateThreadlineCalendarReview({
      startDate: new Date('2026-05-01T12:00:00'),
      days: THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS,
    });

    expect(validateThreadlineReviewCalendar(review.candidates)).toEqual([]);
    expect(Array.isArray(getThreadlineRootFamilyWarnings(review.candidates))).toBe(true);
  });

  it('keeps the shipped pack inside production editorial gates', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(validateThreadlinePuzzle(puzzle)).toEqual([]);
      expect(puzzle.words).toHaveLength(THREADLINE_SHIPPED_WORDS_PER_DAY);
      expect(puzzle.words.every((word) => word.answer.length >= 4)).toBe(true);
      expect(puzzle.words.filter((word) => word.answer.length >= 6).length).toBeGreaterThanOrEqual(3);
      expect(puzzle.note).not.toMatch(/deterministic candidates|editor-player|review/i);
      puzzle.threads.forEach((thread) => {
        expect(puzzle.words.filter((word) => word.threadId === thread.id)).toHaveLength(3);
      });
      const blankIds = puzzle.lead
        .filter((segment) => segment.type === 'blank')
        .map((segment) => segment.wordId);
      expect(new Set(blankIds)).toEqual(new Set(puzzle.words.map((word) => word.id)));
    });
  });

  it('keeps shipped answers inside their declared thread word pools', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const review = THREADLINE_EDITOR_REVIEW[puzzle.id];
      const domain = review.tags.at(-2) ?? '';
      puzzle.words.forEach((word) => {
        const thread = puzzle.threads.find((candidate) => candidate.id === word.threadId);
        const allowedWords = thread ? THREADLINE_WORDS_BY_DOMAIN_THREAD[domain]?.[thread.name] : undefined;

        expect(allowedWords).toBeTruthy();
        expect(allowedWords).toContain(word.answer);
        expect(word.hint).not.toBe(thread?.clue);
        expect(word.hint).not.toMatch(/^A motion around /);
      });
    });
  });

  it('keeps shipped lead skeletons varied across the calendar', () => {
    const skeletonCounts = new Map<string, number>();
    let semicolonLeadCount = 0;

    THREADLINE_DATED_SCHEDULE.forEach((entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      const skeleton = getThreadlineLeadStructureSignature(puzzle);
      skeletonCounts.set(skeleton, (skeletonCounts.get(skeleton) ?? 0) + 1);
      if (renderThreadlineCompletedLead(puzzle).includes(';')) {
        semicolonLeadCount += 1;
      }
    });

    expect(skeletonCounts.size).toBeGreaterThanOrEqual(18);
    expect(Math.max(...skeletonCounts.values())).toBeLessThanOrEqual(THREADLINE_SHIPPED_MAX_LEAD_STRUCTURE_REPEATS);
    expect(semicolonLeadCount).toBeLessThanOrEqual(THREADLINE_SHIPPED_MAX_SEMICOLON_LEADS);
  });

  it('renders completed shipped leads through the reusable copy audit helper', () => {
    const bannedLeadCopy = /\b(theme|clue|line begins|line at|first texture|finish its turn|complete the second|complete the first|the scene moves through|a second look finds|look again|come into focus a moment later|close at hand|the moment turns toward|are already there|wait for dark|the night gathers around|sit in plain sight|stay up front|gather farther back|wait (?:a little )?farther in|farther out are|where the eye lands|wait where the place opens|stay nearest|sit nearest|nearest part|are the still things|hold the still part|make a small still life|make the pause|make the stillness useful|carry the moving part|make it breathe|break it open|bring the shift|point it onward|start the action|close by|close to hand|the turn is|come after them|take it from there|make the room busier|make the quiet busier|complete the view|make a small inventory|make it less empty|make the place recognizable|make it particular|make the place easy to enter|make it worth staying|make the place tangible|make it move|keep the day moving|keep things going|keep it moving|keep it active|keep the room busy|keep the moment moving|keep the hour alive|keep moving|catch your eye|visitor lingers over|visitor slows for|hold the first look|attention settles on|slower look finds|looking slows around|another pass finds|keeps returning|attention drifts toward|trail is marked by|mark the way|walk opens toward|walk finds|path offers|day keeps offering|keep the route clear|recipe calls for|recipe line|dinner turns toward|shoreline keeps moving through|station platform points|travelers pass|soften the wait|fill the pause|waiting gathers around|work waits in|tell the day where to begin|surface toward work|first real task|workday its first shape|picnic blanket|on the blanket|across the blanket|blanket holds|blanket is set|spread out|after a few minutes|afternoon loosens|afternoon calls for|beyond it are|park adds|afternoon gathers around|park keeps .+ in the day|leaves room for|day has room for|park is easy with|afternoon keeps .+ close|lunch has|the grass is ready for|the food is simple|the park gives|onstage|before the curtain|house lights|in the house|out front|people in the seats|stage is set|stage has|audience sits with|room begins to|audience brings|room leans toward|room is full of|room answers with|room gives back|workbench|lab bench|bench light|bench holds|bench is ready|sit ready|are laid out|repair turns|broken part points|small problem shows itself|test calls for|test turns to|result turns on|question narrows around|experiment turns on|answer gathers around|fix comes down to|repair needs|thing to solve|notebook fills with|work follows|you notice|starts with|begins with|at first glance|first layer|second layer|first small facts|first clues|other clues|within reach|in reach|make an easy first read|scene texture|make the scene fuller|make the scene legible|the operator can|the voice can|signal is shaped by|signal takes shape through|after dark come|after dusk|evening moves through|campsite opens around|are unpacked|will [a-z]+, [a-z]+, and [a-z]+|has to [a-z]+, [a-z]+, and [a-z]+|is there to [a-z]+, [a-z]+, and [a-z]+|work is to [a-z]+, [a-z]+, and [a-z]+|it is time to [a-z]+, [a-z]+, and [a-z]+|asks? (?:the )?[a-z]+ to [a-z]+, [a-z]+, and [a-z]+|moves next to|moves? on to|hiding in|depends on|near (?:near|along|on|in|inside|outside|toward|by|around|at)|hold the room steady|pull the edges wider|hold the practical side|make the place feel particular|make the room recognizable|the rest leans on|steady the room|make it feel inhabited|settle the eye|stir the moment|hold the ordinary ground|change the air|settle first|turn the page|fill out the edges|fill the quiet edges|hold the front of the moment|collect around the edges|make the place feel lived in|round out the room|nearest edge|farther part|finish the picture|give the (?:place|moment|day|room|work|rest)|pull the place forward|keep the day from (?:staying still|stopping)|keep the room from stopping|carry the day forward|keep the scene awake|keep the moment close|send it forward|make the day shift|carry the room past them|loosen it|give the stillness a turn|two sets start|answer starts|someone can|hands know how|give the eye somewhere else to land|the next motion is to|already part of the setting|show what the setting is becoming|has a job|doing real work|comes alive when|holds together because|belong with|read as|first family|second family|two plain vocabularies|can be named|sort .+ forcing|show up as|come through as|arrive as)\b/i;

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const completedLead = renderThreadlineCompletedLead(puzzle);

      expect(completedLead).not.toContain('[missing:');
      expect(completedLead).not.toMatch(bannedLeadCopy);
      expect(completedLead).not.toMatch(THREADLINE_WEAK_TASTE_PATTERNS);
      expect(completedLead).not.toMatch(THREADLINE_NEWLY_RETIRED_LEAD_PATTERNS);
      expect(completedLead).not.toMatch(THREADLINE_RECENTLY_RETIRED_LEAD_COPY);
      expect(completedLead).not.toContain(';');
      expect(completedLead).not.toMatch(THREADLINE_WEAK_SLOT_WORDS);
      expect(completedLead).not.toMatch(/[.!?]\s+[a-z]/);
      expect(isThreadlineRoboticLead(completedLead)).toBe(false);
      expect(completedLead.length).toBeGreaterThan(puzzle.title.length);
      puzzle.words.forEach((word) => {
        expect(completedLead).toContain(word.answer.toLowerCase());
        expect(countThreadlineLeadAnswerOccurrences(completedLead, word.answer)).toBe(1);
      });
    });
  });

  it('keeps puzzle titles from giving away answers or themes', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const titleTokens = new Set(
        puzzle.title
          .toUpperCase()
          .replace(/[^A-Z\s]/g, ' ')
          .split(/\s+/)
          .filter((token) => token.length > 2 && !THREADLINE_TITLE_STOP_WORDS.has(token))
      );
      const answerTokens = new Set(puzzle.words.map((word) => word.answer));
      const threadTokens = new Set(
        puzzle.threads
          .flatMap((thread) => `${thread.name} ${thread.clue}`.toUpperCase().split(/[^A-Z]+/))
          .filter((token) => token.length > 2 && !THREADLINE_TITLE_STOP_WORDS.has(token))
      );

      titleTokens.forEach((token) => {
        expect(answerTokens.has(token)).toBe(false);
        expect(threadTokens.has(token)).toBe(false);
      });
      expect(puzzle.title).not.toContain(':');
      expect(puzzle.title).not.toContain('&');
      expect(isThreadlineRoboticTitle(puzzle.title)).toBe(false);
    });
  });

  it('keeps weave copy exceptional and free of puzzle-meta scaffolding', () => {
    const bannedWeaveCopy = /\b(theme|clue|hidden turn|line land|same thread|final line|in miniature|hiding between|need each other|opposite sides|make .+ click|works because|works? (?:where|when)|meets?|where [^.?!]+ meet|(?:begins|lives|settles|pauses|wakes|gathers|improves) where|feels human where|becomes? [^.?!]+ through|makes? [^.?!]+ feel|are the handoff|resolves when|lands when|shared place|appears between|make the connection visible|what you can point to|still detail|live one|scene turns on|has a voice|start with|listen for|now you are at|first .+ then)\b/i;

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(puzzle.weave).not.toMatch(bannedWeaveCopy);
      expect(puzzle.weave).not.toMatch(THREADLINE_WEAK_TASTE_PATTERNS);
      expect(puzzle.weave).not.toMatch(THREADLINE_NEWLY_RETIRED_WEAVE_PATTERNS);
      expect(puzzle.weave).not.toMatch(THREADLINE_WEAK_SLOT_WORDS);
      expect(isThreadlineMechanicalWeave(puzzle.weave)).toBe(false);
      expect(puzzle.weave).toMatch(/[.!?]$/);
      expect(puzzle.weave.length).toBeGreaterThanOrEqual(24);
      expect(puzzle.weave.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(18);
    });
  });

  it('keeps rejected copy answers out of the shipped schedule', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      puzzle.words.forEach((word) => {
        expect(THREADLINE_REJECTED_COPY_ANSWERS.has(word.answer.toUpperCase())).toBe(false);
      });
    });

    const audit = getShippedThreadlineCopyAudit();
    expect(audit.criticalIssues.filter((issue) => issue.code === 'rejected-copy-answer')).toHaveLength(0);
  });

  it('prevents same-puzzle answer root repeats from flattening the weave', () => {
    const audit = getShippedThreadlineCopyAudit();

    expect(audit.criticalIssues.filter((issue) => issue.code === 'same-puzzle-root-repeat')).toHaveLength(0);
  });

  it('keeps manual approval notes concrete instead of rubber-stamped', () => {
    THREADLINE_DATED_SCHEDULE.forEach((entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      const approvedCopy = THREADLINE_APPROVED_COPY_BY_PUZZLE_ID[entry.puzzleId];
      const completedLead = renderThreadlineCompletedLead(puzzle);
      const normalizedNote = approvedCopy.reviewNote.toLowerCase();

      expect(approvedCopy.reviewNote).not.toMatch(THREADLINE_RETIRED_APPROVAL_NOTE_COPY);
      expect(approvedCopy.reviewNote).toContain(`Title "${puzzle.title}"`);
      expect(approvedCopy.reviewNote).toContain(`Lead read: "${completedLead.slice(0, 24)}`);
      expect(approvedCopy.reviewNote).toContain(`Weave "${puzzle.weave}"`);
      expect(approvedCopy.reviewNote).toMatch(/Scores: \d\.\d{2} grammar, \d\.\d{2} weave\./);
      puzzle.threads.forEach((thread) => {
        expect(normalizedNote).toContain(thread.name.toLowerCase());
      });
    });

    const audit = getShippedThreadlineCopyAudit();
    expect(audit.criticalIssues.filter((issue) => issue.code === 'approval-note-rubber-stamp')).toHaveLength(0);
  });

  it('keeps motion-like thread lists grammatically cohesive', () => {
    const motionThreadName = /(move|moves|motion|motions|steps|calls|cues|signals|habits|routines)/i;

    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      puzzle.threads.filter((thread) => motionThreadName.test(thread.name)).forEach((thread) => {
        const answers = puzzle.words.filter((word) => word.threadId === thread.id).map((word) => word.answer);
        const gerundCount = answers.filter((answer) => /ING$/.test(answer)).length;
        expect(gerundCount === 0 || gerundCount === answers.length).toBe(true);
      });
    });

    const audit = getShippedThreadlineCopyAudit();
    expect(audit.criticalIssues.filter((issue) => issue.code === 'mixed-gerund-thread')).toHaveLength(0);
  });

  it('keeps the 200 new variety puzzles split between dated schedule and reserves', () => {
    const expansionEntries = THREADLINE_DATED_SCHEDULE.filter((entry) =>
      THREADLINE_EDITOR_REVIEW[entry.puzzleId].tags.includes('variety-expansion')
    );
    const expansionReserveEntries = THREADLINE_RESERVES.filter((entry) =>
      THREADLINE_EDITOR_REVIEW[entry.puzzleId].tags.includes('variety-expansion')
    );
    const expansionFamilies = new Set(
      [...expansionEntries, ...expansionReserveEntries].map((entry) => THREADLINE_EDITOR_REVIEW[entry.puzzleId].tags.at(-2))
    );

    expect(expansionEntries.length + expansionReserveEntries.length).toBe(THREADLINE_SHIPPED_VARIETY_EXPANSION_DAYS);
    expect(expansionEntries.length).toBeGreaterThan(0);
    expect(expansionReserveEntries.length).toBeGreaterThan(0);
    expect(expansionFamilies.size).toBe(20);
    expansionEntries.forEach((entry) => {
      const review = THREADLINE_EDITOR_REVIEW[entry.puzzleId];

      expect(review.dateKey).toBe(entry.dateKey);
      expect(review.tags).toContain('variety-expansion');
    });
    expansionReserveEntries.forEach((entry) => {
      const review = THREADLINE_EDITOR_REVIEW[entry.puzzleId];

      expect(review.dateKey).toBeNull();
      expect(review.tags).toContain('variety-expansion');
    });
    expect(
      THREADLINE_RESERVES.filter(
        (entry) =>
          entry.reserveStatus === 'ready' && !THREADLINE_EDITOR_REVIEW[entry.puzzleId].tags.includes('variety-expansion')
      )
    ).toHaveLength(THREADLINE_SHIPPED_FORMER_RESERVE_DAYS);
    expect(THREADLINE_RESERVES.filter((entry) => entry.reserveStatus === 'needs-tightening')).toHaveLength(
      THREADLINE_SHIPPED_TIGHTENING_RESERVE_DAYS
    );
  });

  it('keeps shipped copy audit free of critical title, lead, payoff, and review issues', () => {
    const audit = getShippedThreadlineCopyAudit();

    expect(formatThreadlineCopyAuditIssues(audit.criticalIssues)).toEqual([]);
  });

  it('keeps the next human-read voice floor queue ratcheted to the latest approved floor', () => {
    const voiceFloor = inspectThreadlineVoiceFloor(
      THREADLINE_PUZZLE_BANK,
      THREADLINE_DATED_SCHEDULE,
      THREADLINE_PUZZLE_BY_ID
    );
    const summaryById = Object.fromEntries(voiceFloor.map((summary) => [summary.patternId, summary]));

    expect(voiceFloor).toHaveLength(41);
    expect(summaryById['answer-as-payoff-subject'].phase).toBe('weave');
    expect(summaryById['answer-as-payoff-subject'].count).toBe(0);
    expect(summaryById['weave-answer-anchor'].phase).toBe('weave');
    expect(summaryById['weave-answer-anchor'].count).toBe(0);
    expect(summaryById['weave-construction-where-formula'].phase).toBe('weave');
    expect(summaryById['weave-construction-where-formula'].count).toBe(0);
    expect(summaryById['weave-becomes-through-formula'].phase).toBe('weave');
    expect(summaryById['weave-becomes-through-formula'].count).toBe(0);
    expect(summaryById['weave-make-feel-formula'].phase).toBe('weave');
    expect(summaryById['weave-make-feel-formula'].count).toBe(0);
    expect(summaryById['weave-thread-label-prose'].phase).toBe('weave');
    expect(summaryById['weave-thread-label-prose'].count).toBe(0);
    expect(summaryById['weave-explanatory-abstraction'].phase).toBe('weave');
    expect(summaryById['weave-explanatory-abstraction'].count).toBe(0);
    expect(summaryById['lead-then-someone-can'].phase).toBe('lead');
    expect(summaryById['lead-someone-can'].phase).toBe('lead');
    expect(summaryById['lead-hands-know-how'].phase).toBe('lead');
    expect(summaryById['lead-eye-somewhere'].phase).toBe('lead');
    expect(summaryById['lead-next-motion'].phase).toBe('lead');
    expect(summaryById['lead-second-look-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-second-look-scaffold'].count).toBe(0);
    expect(summaryById['lead-look-again-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-look-again-scaffold'].count).toBe(0);
    expect(summaryById['lead-focus-later-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-focus-later-scaffold'].count).toBe(0);
    expect(summaryById['lead-you-notice-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-you-notice-scaffold'].count).toBe(0);
    expect(summaryById['lead-starts-with-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-starts-with-scaffold'].count).toBe(0);
    expect(summaryById['lead-first-layer-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-first-layer-scaffold'].count).toBe(0);
    expect(summaryById['lead-will-verb-chain'].phase).toBe('lead');
    expect(summaryById['lead-will-verb-chain'].count).toBe(0);
    expect(summaryById['lead-scene-texture-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-scene-texture-scaffold'].count).toBe(0);
    expect(summaryById['lead-forced-infinitive-chain'].phase).toBe('lead');
    expect(summaryById['lead-forced-infinitive-chain'].count).toBe(0);
    expect(summaryById['lead-doubled-anchor'].phase).toBe('lead');
    expect(summaryById['lead-doubled-anchor'].count).toBe(0);
    expect(summaryById['lead-close-at-hand-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-close-at-hand-scaffold'].count).toBe(0);
    expect(summaryById['lead-already-there-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-already-there-scaffold'].count).toBe(0);
    expect(summaryById['lead-wait-for-dark-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-wait-for-dark-scaffold'].count).toBe(0);
    expect(summaryById['lead-spatial-depth-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-spatial-depth-scaffold'].count).toBe(0);
    expect(summaryById['lead-stillness-action-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-stillness-action-scaffold'].count).toBe(0);
    expect(summaryById['lead-close-by-handoff-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-close-by-handoff-scaffold'].count).toBe(0);
    expect(summaryById['lead-generic-motion-utility-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-generic-motion-utility-scaffold'].count).toBe(0);
    expect(summaryById['lead-domain-observation-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-domain-observation-scaffold'].count).toBe(0);
    expect(summaryById['lead-gallery-slow-look-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-gallery-slow-look-scaffold'].count).toBe(0);
    expect(summaryById['lead-trail-path-offers-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-trail-path-offers-scaffold'].count).toBe(0);
    expect(summaryById['lead-domain-task-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-domain-task-scaffold'].count).toBe(0);
    expect(summaryById['lead-procedural-domain-filler'].phase).toBe('lead');
    expect(summaryById['lead-procedural-domain-filler'].count).toBe(0);
    expect(summaryById['lead-picnic-blanket-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-picnic-blanket-scaffold'].count).toBe(0);
    expect(summaryById['lead-theater-stage-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-theater-stage-scaffold'].count).toBe(0);
    expect(summaryById['lead-bench-lab-scaffold'].phase).toBe('lead');
    expect(summaryById['lead-bench-lab-scaffold'].count).toBe(0);
    expect(summaryById['lead-abstract-stage-direction'].phase).toBe('lead');
    expect(summaryById['lead-abstract-stage-direction'].count).toBe(0);
    voiceFloor.forEach((summary) => {
      expect(summary.count).toBe(0);
      expect(summary.whyItMatters.length).toBeGreaterThan(40);
      expect(summary.sampleHits.length).toBeLessThanOrEqual(8);
      summary.sampleHits.forEach((hit) => {
        expect(hit.patternId).toBe(summary.patternId);
        expect(hit.title).toBeTruthy();
        expect(hit.completedLead).toContain(', ');
        expect(hit.weave).toMatch(/[.!?]$/);
      });
    });
  });

  it('keeps the shipped QA markdown anchored to a concrete next editorial pass plan', () => {
    const markdown = formatThreadlineShippedPackMarkdown();

    expect(markdown).toContain('## Voice Floor Watchlist');
    expect(markdown).toContain('## Next Editorial Pass Plan');
    expect(markdown).toContain('Theme-level weave rewrite');
    expect(markdown).toContain('Lead point-of-view rewrite');
    expect(markdown).toContain('Utility phrase removal');
    expect(markdown).toContain('Gate promotion');
    expect(markdown).toMatch(/\| 1 \| Theme-level weave rewrite \| \d+ answer-as-subject weaves; \d+ answer-anchored weaves \|/);
  });

  it('rejects the calibration example that exposed generated copy fingerprints', () => {
    const badPuzzle = {
      id: 'threadline-copy-calibration-bad-diner',
      title: 'Crossing For Later',
      deck: 'Booth details and order calls keep a small meal moving.',
      difficulty: 'Medium' as const,
      grid: Array.from({ length: 8 }, () => 'ABCDEFGH'),
      lead: [
        { type: 'text' as const, text: 'Around the diner booth, ' },
        { type: 'blank' as const, wordId: 'ketchup-1' },
        { type: 'text' as const, text: ', ' },
        { type: 'blank' as const, wordId: 'dinner-2' },
        { type: 'text' as const, text: ', and ' },
        { type: 'blank' as const, wordId: 'hashes-3' },
        { type: 'text' as const, text: ' make the table feel familiar, while the scene moves through ' },
        { type: 'blank' as const, wordId: 'dining-4' },
        { type: 'text' as const, text: ', ' },
        { type: 'blank' as const, wordId: 'refill-5' },
        { type: 'text' as const, text: ', and ' },
        { type: 'blank' as const, wordId: 'boxing-6' },
        { type: 'text' as const, text: ' to move the order down the counter.' },
      ],
      threads: [
        { id: 'thread-a', name: 'Booth details', clue: 'What sits around the table.' },
        { id: 'thread-b', name: 'Order calls', clue: 'How the meal moves.' },
      ],
      words: [
        { id: 'ketchup-1', answer: 'KETCHUP', threadId: 'thread-a', hint: '', path: [] },
        { id: 'dinner-2', answer: 'DINNER', threadId: 'thread-a', hint: '', path: [] },
        { id: 'hashes-3', answer: 'HASHES', threadId: 'thread-a', hint: '', path: [] },
        { id: 'dining-4', answer: 'DINING', threadId: 'thread-b', hint: '', path: [] },
        { id: 'refill-5', answer: 'REFILL', threadId: 'thread-b', hint: '', path: [] },
        { id: 'boxing-6', answer: 'BOXING', threadId: 'thread-b', hint: '', path: [] },
      ],
      weave: 'With ketchup beside refill, the booth turns breakfast into a rhythm.',
      note: 'Known-bad copy fixture.',
    } satisfies ThreadlinePuzzle;
    const issueCodes = inspectThreadlineTitlePayoffCoherence(badPuzzle).issues.map((issue) => issue.code);

    expect(issueCodes).toContain('abstract-title-frame');
    expect(issueCodes).toContain('lead-template-scaffold');
    expect(issueCodes).toContain('mechanical-payoff-bridge');

    const answerLedPuzzle = {
      ...badPuzzle,
      id: 'threadline-copy-calibration-answer-led-weave',
      title: 'Diner Morning',
      weave: 'Ketchup waits by the booth; counter talk asks for refill.',
    } satisfies ThreadlinePuzzle;
    const answerLedIssueCodes = inspectThreadlineTitlePayoffCoherence(answerLedPuzzle).issues.map(
      (issue) => issue.code
    );

    expect(answerLedIssueCodes).toContain('answer-led-payoff');

    const genericTitlePuzzle = {
      ...badPuzzle,
      id: 'threadline-copy-calibration-generic-title',
      title: 'Common Answer',
      weave: 'The booth knows breakfast; the counter answers with refill.',
    } satisfies ThreadlinePuzzle;
    const genericTitleIssueCodes = inspectThreadlineTitlePayoffCoherence(genericTitlePuzzle).issues.map(
      (issue) => issue.code
    );

    expect(genericTitleIssueCodes).toContain('abstract-title-frame');

    const contextualTitlePuzzle = {
      ...badPuzzle,
      id: 'threadline-copy-calibration-contextual-title',
      title: 'A Good Place Near The Lighthouse Stair',
      weave: 'The booth knows breakfast; the counter answers with refill.',
    } satisfies ThreadlinePuzzle;
    const contextualTitleIssueCodes = inspectThreadlineTitlePayoffCoherence(contextualTitlePuzzle).issues.map(
      (issue) => issue.code
    );

    expect(contextualTitleIssueCodes).toContain('abstract-title-frame');

    const broadFallbackTitlePuzzle = {
      ...badPuzzle,
      id: 'threadline-copy-calibration-broad-title',
      title: 'Where The Hour Turns',
      weave: 'The booth knows breakfast; the counter answers with refill.',
    } satisfies ThreadlinePuzzle;
    const broadFallbackTitleIssueCodes = inspectThreadlineTitlePayoffCoherence(broadFallbackTitlePuzzle).issues.map(
      (issue) => issue.code
    );

    expect(broadFallbackTitleIssueCodes).toContain('abstract-title-frame');
  });

  it('does not ship generic suffix titles or close title/payoff repeats', () => {
    const titlePayoff = inspectThreadlineTitlePayoffReuse(
      THREADLINE_PUZZLE_BANK,
      THREADLINE_DATED_SCHEDULE,
      THREADLINE_PUZZLE_BY_ID,
      THREADLINE_COPY_AUDIT_OPTIONS
    );
    const reuseIssues = [
      ...titlePayoff.genericSuffixTitles,
      ...titlePayoff.exactTitleReuseIssues,
      ...titlePayoff.titleCooldownIssues,
      ...titlePayoff.payoffCooldownIssues,
    ];

    expect(formatThreadlineCopyAuditIssues(reuseIssues)).toEqual([]);
  });

  it('keeps scheduled title copy above the latest uniqueness floor', () => {
    const scheduledTitles = THREADLINE_DATED_SCHEDULE.map(
      (entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId].title
    );
    const titleCounts = scheduledTitles.reduce<Map<string, number>>((counts, title) => {
      counts.set(title, (counts.get(title) ?? 0) + 1);
      return counts;
    }, new Map());
    expect(titleCounts.size).toBe(scheduledTitles.length);
    expect(Math.max(...titleCounts.values())).toBe(1);
  });

  it('keeps every scheduled payoff exact-unique', () => {
    const scheduledPayoffs = THREADLINE_DATED_SCHEDULE.map(
      (entry) => THREADLINE_PUZZLE_BY_ID[entry.puzzleId].weave
    );

    expect(new Set(scheduledPayoffs).size).toBe(scheduledPayoffs.length);
  });

  it('keeps final weave structures below the poetic texture floor', () => {
    const weaveStructureCounts = THREADLINE_DATED_SCHEDULE.reduce<Map<string, number>>((counts, entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      const signature = getThreadlineWeaveStructureSignature(puzzle);
      counts.set(signature, (counts.get(signature) ?? 0) + 1);
      return counts;
    }, new Map());

    expect(Math.max(...weaveStructureCounts.values())).toBeLessThanOrEqual(
      THREADLINE_SHIPPED_MAX_WEAVE_STRUCTURE_REPEATS
    );
  });

  it('keeps every scheduled six-answer set exact-unique', () => {
    const answerSetCounts = THREADLINE_DATED_SCHEDULE.reduce<Map<string, number>>((counts, entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      const signature = getThreadlineAnswerSetSignature(puzzle);
      counts.set(signature, (counts.get(signature) ?? 0) + 1);
      return counts;
    }, new Map());

    expect(answerSetCounts.size).toBe(THREADLINE_DATED_SCHEDULE.length);
    expect(Math.max(...answerSetCounts.values())).toBe(THREADLINE_SHIPPED_MAX_ANSWER_SET_REPEATS);
  });

  it('keeps exact thread-half trios below the variety floor', () => {
    const threadTripleCounts = THREADLINE_DATED_SCHEDULE.reduce<Map<string, number>>((counts, entry) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      getThreadlineThreadTripleSignatures(puzzle).forEach((signature) => {
        counts.set(signature, (counts.get(signature) ?? 0) + 1);
      });
      return counts;
    }, new Map());

    expect(Math.max(...threadTripleCounts.values())).toBeLessThanOrEqual(
      THREADLINE_SHIPPED_MAX_THREAD_TRIPLE_REPEATS
    );
  });

  it('keeps shipped difficulty bands separated by the audit index', () => {
    const bands = summarizeThreadlineDifficultyBands(THREADLINE_PUZZLE_BANK);
    const byDifficulty = Object.fromEntries(
      bands.map((band) => [band.difficulty, band])
    );

    expect(byDifficulty.Easy.count).toBeGreaterThan(0);
    expect(byDifficulty.Medium.count).toBeGreaterThan(0);
    expect(byDifficulty.Hard.count).toBeGreaterThan(0);
    expect(byDifficulty.Medium.averageIndex - byDifficulty.Easy.averageIndex).toBeGreaterThanOrEqual(0.15);
    expect(byDifficulty.Hard.averageIndex - byDifficulty.Medium.averageIndex).toBeGreaterThanOrEqual(0.25);
  });

  it('keeps objective shipped difficulty integrity from relying on awkward copy', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const lengths = puzzle.words.map((word) => word.answer.length);
      const longCount = lengths.filter((length) => length >= 6).length;
      const veryLongCount = lengths.filter((length) => length >= 7).length;

      expect(longCount).toBeGreaterThanOrEqual(3);
      if (puzzle.difficulty === 'Hard') {
        expect(longCount).toBeGreaterThanOrEqual(4);
        expect(veryLongCount).toBeGreaterThanOrEqual(2);
      }
    });
  });

  it('enforces shipped review score dimensions when the generator provides them', () => {
    const audit = getShippedThreadlineCopyAudit();
    const presentDimensions = audit.scoreDimensions.filter((dimension) => dimension.present > 0);

    expect(presentDimensions.length).toBeGreaterThan(0);
    presentDimensions.forEach((dimension) => {
      expect(dimension.present).toBe(THREADLINE_DATED_SCHEDULE.length);
      expect(dimension.belowThreshold).toBe(0);
      expect(dimension.min).toBeGreaterThanOrEqual(dimension.minimum);
    });
  });

  it('keeps shipped score integrity varied and explained', () => {
    const reviews = Object.values(THREADLINE_EDITOR_REVIEW);
    const overallScores = new Set(reviews.map((review) => review.overallEditorialScore.toFixed(2)));
    const playerScores = new Set(reviews.map((review) => review.playerAverageScore.toFixed(2)));
    const weakest = reviews
      .slice()
      .sort((a, b) => a.overallEditorialScore + a.playerAverageScore - (b.overallEditorialScore + b.playerAverageScore))
      .slice(0, 20);

    expect(overallScores.size).toBeGreaterThan(10);
    expect(playerScores.size).toBeGreaterThan(10);
    weakest.forEach((review) => {
      const puzzle = THREADLINE_PUZZLE_BY_ID[review.puzzleId];
      expect(review.editorNote).toMatch(/copy review/i);
      expect(review.editorNote).toContain(puzzle.title);
      expect(review.editorNote).toContain(renderThreadlineCompletedLead(puzzle).slice(0, 20));
      expect(review.editorNote).toContain(puzzle.weave);
      expect(review.editorNote).not.toMatch(/cleared editorial pursuit checks/i);
      expect(review.freshnessNote).toMatch(/length profile \d(?:-\d)+; difficulty index \d\.\d{2}/);
    });
  });

  it('keeps shipped scheduled answers outside the exact cooldown window', () => {
    const lastSeen = new Map<string, { dateKey: string; time: number }>();

    THREADLINE_DATED_SCHEDULE.forEach((entry) => {
      const currentTime = new Date(`${entry.dateKey}T12:00:00`).getTime();
      const puzzle = THREADLINE_PUZZLE_BY_ID[entry.puzzleId];
      puzzle.words.forEach((word) => {
        const previous = lastSeen.get(word.answer);
        if (previous !== undefined) {
          const dayDistance = Math.round((currentTime - previous.time) / 86_400_000);
          expect(dayDistance).toBeGreaterThan(THREADLINE_SHIPPED_EXACT_COOLDOWN_DAYS);
        }
        lastSeen.set(word.answer, { dateKey: entry.dateKey, time: currentTime });
      });
    });
  });

  it('keeps shipped rolling answer length in the longer-word target band', () => {
    const rollingAverages = getShippedRollingAverageLengths();

    expect(rollingAverages.length).toBeGreaterThan(0);
    rollingAverages.forEach((window) => {
      expect(window.averageLength).toBeGreaterThanOrEqual(THREADLINE_SHIPPED_MIN_AVERAGE_LENGTH);
      expect(window.averageLength).toBeLessThanOrEqual(THREADLINE_SHIPPED_MAX_AVERAGE_LENGTH);
    });
  });

  it('ships only editor/player-agent approved puzzles', () => {
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      const review = THREADLINE_EDITOR_REVIEW[puzzle.id];

      expect(review).toBeTruthy();
      expect(review.approvalStatus).toBe('approved');
      expect(review.overallEditorialScore).toBeGreaterThanOrEqual(4.4);
      expect(review.playerAverageScore).toBeGreaterThanOrEqual(4.3);
      expect(review.minCoreScore).toBeGreaterThanOrEqual(3.5);
      expect(review.confusionRisk).toBeLessThanOrEqual(2);
      expect(review.wouldPlayAgainCount).toBeGreaterThanOrEqual(4);
      expect(review.finalLinePayoffScore).toBeGreaterThanOrEqual(4.4);
      expect(review.safetyFlags).toEqual([]);
    });
  });

  it('places holiday nods near but not on the exact holiday dates', () => {
    expect(THREADLINE_HOLIDAY_NODS.length).toBeGreaterThan(0);
    THREADLINE_HOLIDAY_NODS.forEach((nod) => {
      expect(nod.dateKey).not.toBe(nod.holidayDateKey);
      expect(THREADLINE_DATED_PUZZLE_BY_DATE[nod.dateKey]).toBe(nod.puzzleId);

      const date = new Date(`${nod.dateKey}T12:00:00`);
      const holiday = new Date(`${nod.holidayDateKey}T12:00:00`);
      const distance = Math.round(Math.abs(date.getTime() - holiday.getTime()) / 86_400_000);
      expect(distance).toBeLessThanOrEqual(nod.windowDays);
    });
  });

  it('reports root-family repeats for editor awareness without blocking approved shipped data', () => {
    const warnings = getThreadlineShippedRootFamilyWarnings();

    expect(Array.isArray(warnings)).toBe(true);
    THREADLINE_PUZZLE_BANK.forEach((puzzle) => {
      expect(THREADLINE_EDITOR_REVIEW[puzzle.id]?.approvalStatus).toBe('approved');
    });
  });
});
