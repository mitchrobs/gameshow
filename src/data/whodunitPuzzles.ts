// ── Content pools ──────────────────────────────────────────────

export interface Suspect {
  name: string;
  emoji: string;
  trait: string;
}

export interface Victim {
  name: string;
  title: string;
}

export interface Setting {
  name: string;
  description: string;
}

export interface Weapon {
  name: string;
}

export interface Room {
  name: string;
}

export type ClueType = 'alibi' | 'evidence' | 'motive' | 'red_herring';

export interface Clue {
  type: ClueType;
  text: string;
  /** Index of suspect cleared by this alibi clue, or -1 */
  clearsIndex: number;
  locked: boolean;
}

export interface WhodunitPuzzle {
  caseNumber: number;
  caseName: string;
  narrative: string;
  suspects: Suspect[];
  killerIndex: number;
  victim: Victim;
  setting: Setting;
  weapon: Weapon;
  room: Room;
  clues: Clue[];
}

const SUSPECTS: Suspect[] = [
  { name: 'Dr. Voss', emoji: '🎭', trait: 'Renowned surgeon with a gambling debt' },
  { name: 'Ms. Liang', emoji: '👩‍🎨', trait: 'Art curator with a forged past' },
  { name: 'Col. Marsh', emoji: '🎖️', trait: 'Retired officer haunted by old secrets' },
  { name: 'R. Okafor', emoji: '💼', trait: 'Corporate lawyer with a grudge' },
  { name: 'Lady Ashford', emoji: '👑', trait: 'Socialite hiding a ruined fortune' },
  { name: 'Prof. Navarro', emoji: '📚', trait: 'Academic rival with a bitter dispute' },
  { name: 'Mr. Huang', emoji: '🎩', trait: 'Antique dealer with suspicious imports' },
  { name: 'Mme. Duval', emoji: '🌹', trait: 'Ex-diplomat with classified contacts' },
  { name: 'Sgt. Petrov', emoji: '🔧', trait: 'Mechanic turned private investigator' },
  { name: 'Dr. Chandra', emoji: '🔬', trait: 'Chemist who knows too many poisons' },
  { name: 'Rev. Whitmore', emoji: '📿', trait: 'Clergy member with a hidden life' },
  { name: 'Capt. Reyes', emoji: '⚓', trait: 'Retired sailor with smuggling ties' },
];

const VICTIMS: Victim[] = [
  { name: 'Lord Pemberton', title: 'the host' },
  { name: 'Baroness Kline', title: 'the guest of honor' },
  { name: 'Mr. Whitfield', title: 'the estate manager' },
  { name: 'Contessa Moreau', title: 'the art collector' },
  { name: 'Sir Reginald', title: 'the retired judge' },
  { name: 'Mrs. Hargrove', title: 'the philanthropist' },
  { name: 'Prof. Sterling', title: 'the keynote speaker' },
];

const SETTINGS: Setting[] = [
  { name: 'a sprawling country estate during a winter gala', description: 'winter gala' },
  { name: 'a fog-bound lighthouse on the Devon coast', description: 'lighthouse gathering' },
  { name: 'a lavish penthouse overlooking the city', description: 'penthouse soirée' },
  { name: 'an old university hall during a reunion dinner', description: 'reunion dinner' },
  { name: 'a private yacht anchored in the harbor', description: 'harbor cruise' },
  { name: 'a secluded mountain lodge after a snowstorm', description: 'mountain retreat' },
  { name: 'a grand opera house during intermission', description: 'opera night' },
];

const WEAPONS: Weapon[] = [
  { name: 'a poisoned glass of wine' },
  { name: 'a heavy brass candlestick' },
  { name: 'a silk scarf twisted tight' },
  { name: 'a letter opener from the desk' },
  { name: 'a vial of rare toxin' },
  { name: 'a blunt marble bookend' },
  { name: 'a syringe filled with sedative' },
  { name: 'a length of piano wire' },
];

const ROOMS: Room[] = [
  { name: 'the conservatory' },
  { name: 'the library' },
  { name: 'the wine cellar' },
  { name: 'the ballroom' },
  { name: 'the drawing room' },
  { name: 'the study' },
  { name: 'the gallery' },
  { name: 'the kitchen' },
];

const CASE_NAMES = [
  'The Gilded Alibi',
  'The Midnight Heir',
  'The Scarlet Ledger',
  'A Cold Reckoning',
  'The Final Curtain',
  'The Hollow Portrait',
  'Ashes at Dawn',
  'The Glass Witness',
  'A Silent Encore',
  'The Iron Garden',
  'The Velvet Confession',
  'The Broken Seal',
];

// ── Seeded random ──────────────────────────────────────────────

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function seededPick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

// ── Alibi templates ────────────────────────────────────────────

const ALIBI_TEMPLATES = [
  (name: string, room: string, time: string) =>
    `${name} was seen in ${room} at ${time} by multiple witnesses.`,
  (name: string, _room: string, time: string) =>
    `Phone records confirm ${name} was on a call at ${time}.`,
  (name: string, room: string, time: string) =>
    `Security footage shows ${name} entering ${room} at ${time}, far from the scene.`,
  (name: string, _room: string, time: string) =>
    `The staff confirmed ${name} requested room service at ${time}.`,
  (name: string, room: string, time: string) =>
    `${name} was in ${room} at ${time}, confirmed by two guests.`,
  (name: string, _room: string, time: string) =>
    `A signed receipt places ${name} at the bar at ${time}.`,
];

const MOTIVE_TEMPLATES = [
  (name: string, victimName: string) =>
    `Financial records show ${name} stood to inherit if ${victimName} died.`,
  (name: string, victimName: string) =>
    `A bitter letter from ${name} to ${victimName} was found in the desk.`,
  (name: string, victimName: string) =>
    `${name} had recently been cut from ${victimName}'s will.`,
  (name: string, _victimName: string) =>
    `Insurance documents reveal a large policy recently taken out by ${name}.`,
  (name: string, victimName: string) =>
    `Witnesses say ${name} and ${victimName} had a heated argument earlier that evening.`,
];

const RED_HERRING_TEMPLATES = [
  (name: string) =>
    `${name} was seen nervously pacing the hallway, but the timing is unclear.`,
  (name: string) =>
    `A monogrammed handkerchief belonging to ${name} was found nearby, though it may have been dropped earlier.`,
  (name: string) =>
    `${name} left the party briefly, but no one can confirm where they went.`,
  (name: string) =>
    `${name} was overheard whispering about "taking care of something tonight."`,
  (name: string) =>
    `Mud on ${name}'s shoes suggests a trip outside, but the path is inconclusive.`,
];

// ── Puzzle generation ──────────────────────────────────────────

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function generatePuzzle(seed: number): WhodunitPuzzle {
  const rand = mulberry32(seed);

  // Pick 4 suspects
  const shuffledSuspects = seededShuffle(SUSPECTS, rand);
  const suspects = shuffledSuspects.slice(0, 4);

  // Pick killer (index 0-3)
  const killerIndex = Math.floor(rand() * 4);

  // Pick content
  const victim = seededPick(VICTIMS, rand);
  const setting = seededPick(SETTINGS, rand);
  const weapon = seededPick(WEAPONS, rand);
  const room = seededPick(ROOMS, rand);
  const caseName = seededPick(CASE_NAMES, rand);
  const caseNumber = (seed % 900) + 1;

  // Generate narrative
  const suspectNames = suspects.map((s) => s.name).join(', ');
  const narrative = `${victim.name} has been found dead at ${setting.name}. The ${weapon.name.replace(/^a /, '')} was discovered in ${room.name}. Four guests remain under suspicion: ${suspectNames}.`;

  // Generate clues
  const innocents = suspects
    .map((s, i) => ({ suspect: s, index: i }))
    .filter((_, i) => i !== killerIndex);

  const alibiRooms = seededShuffle(ROOMS.filter((r) => r.name !== room.name), rand);
  const times = ['8:15 PM', '8:30 PM', '8:45 PM'];
  const alibiTemplates = seededShuffle(ALIBI_TEMPLATES, rand);

  const alibiClues: Clue[] = innocents.map((innocent, i) => ({
    type: 'alibi' as ClueType,
    text: alibiTemplates[i](
      innocent.suspect.name,
      alibiRooms[i]?.name ?? 'the lounge',
      times[i]
    ),
    clearsIndex: innocent.index,
    locked: false,
  }));

  const evidenceClue: Clue = {
    type: 'evidence',
    text: `The weapon was ${weapon.name}, found in ${room.name}.`,
    clearsIndex: -1,
    locked: false,
  };

  const motiveTemplate = seededPick(MOTIVE_TEMPLATES, rand);
  const motiveClue: Clue = {
    type: 'motive',
    text: motiveTemplate(suspects[killerIndex].name, victim.name),
    clearsIndex: -1,
    locked: false,
  };

  const redHerringTarget = innocents[Math.floor(rand() * innocents.length)];
  const redHerringTemplate = seededPick(RED_HERRING_TEMPLATES, rand);
  const redHerringClue: Clue = {
    type: 'red_herring',
    text: redHerringTemplate(redHerringTarget.suspect.name),
    clearsIndex: -1,
    locked: false,
  };

  // Shuffle all 6 clues
  const allClues = seededShuffle(
    [...alibiClues, evidenceClue, motiveClue, redHerringClue],
    rand
  );

  // First 3 free, rest locked. Ensure not all 3 free are alibis.
  // Count alibis in first 3
  let freeClues = allClues.slice(0, 3);
  let lockedClues = allClues.slice(3);
  const freeAlibiCount = freeClues.filter((c) => c.type === 'alibi').length;

  if (freeAlibiCount === 3) {
    // Swap one alibi from free with a non-alibi from locked
    const freeAlibiIdx = freeClues.findIndex((c) => c.type === 'alibi');
    const lockedNonAlibiIdx = lockedClues.findIndex((c) => c.type !== 'alibi');
    if (freeAlibiIdx !== -1 && lockedNonAlibiIdx !== -1) {
      const temp = freeClues[freeAlibiIdx];
      freeClues[freeAlibiIdx] = lockedClues[lockedNonAlibiIdx];
      lockedClues[lockedNonAlibiIdx] = temp;
    }
  }

  const clues: Clue[] = [
    ...freeClues.map((c) => ({ ...c, locked: false })),
    ...lockedClues.map((c) => ({ ...c, locked: true })),
  ];

  return {
    caseNumber,
    caseName,
    narrative,
    suspects,
    killerIndex,
    victim,
    setting,
    weapon,
    room,
    clues,
  };
}

// ── Public API ──────────────────────────────────────────────────

export function getDailyWhodunit(date: Date = new Date()): WhodunitPuzzle {
  return generatePuzzle(getDailySeed(date));
}

export function getDateLabel(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}
