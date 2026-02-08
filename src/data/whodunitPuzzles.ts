// ── Content pools ──────────────────────────────────────────────

export interface Suspect {
  name: string;
  emoji: string;
  trait: string;
  alibiClue: string;
  motiveClue: string;
  tellClue: string;
  opportunityClue: string;
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

export type ClueType = 'alibi' | 'evidence' | 'motive' | 'opportunity' | 'red_herring';

export interface Clue {
  id: string;
  type: ClueType;
  text: string;
  /** Index of suspect cleared by this alibi clue, or -1 */
  clearsIndex: number;
  locked: boolean;
}

export interface LeadChoice {
  label: string;
  description: string;
  clueId: string;
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
  leadPrompt: string;
  leadChoices: LeadChoice[];
  clues: Clue[];
}

const SUSPECTS: Suspect[] = [
  {
    name: 'Dr. Voss',
    emoji: '🎭',
    trait: 'Renowned surgeon with a gambling debt',
    alibiClue:
      "Dr. Voss was stitching a staff member's cut in the library at 8:30 PM, confirmed by the butler.",
    motiveClue:
      'The victim had called in a large debt from a renowned surgeon days ago.',
    tellClue: 'A faint smell of antiseptic and surgical tape lingered on the weapon.',
    opportunityClue:
      'The killer moved with clinical precision, as if trained in the operating room.',
  },
  {
    name: 'Ms. Liang',
    emoji: '👩‍🎨',
    trait: 'Art curator with a forged past',
    alibiClue:
      'Ms. Liang was cataloging the gallery exhibits at 8:15 PM, seen by the security guard.',
    motiveClue:
      'The victim threatened to expose a forged provenance tied to a curator.',
    tellClue: 'A smudge of oil paint and gold leaf was found near the scene.',
    opportunityClue:
      "Only someone who knows the gallery's alarm bypass could slip in unnoticed.",
  },
  {
    name: 'Col. Marsh',
    emoji: '🎖️',
    trait: 'Retired officer haunted by old secrets',
    alibiClue:
      'Col. Marsh was on the terrace calling an old comrade at 8:45 PM.',
    motiveClue:
      'A sealed file from the victim could have ruined a retired officer.',
    tellClue: 'Boot scuffs with military polish were found in the hallway.',
    opportunityClue:
      'The killer knew how to move quietly and methodically, like a trained officer.',
  },
  {
    name: 'R. Okafor',
    emoji: '💼',
    trait: 'Corporate lawyer with a grudge',
    alibiClue:
      'R. Okafor was reviewing contracts in the study at 8:30 PM, witnessed by the secretary.',
    motiveClue:
      'A bitter lawsuit against the victim had just collapsed for a prominent lawyer.',
    tellClue: 'A torn legal brief was discovered in the wastebasket.',
    opportunityClue:
      'The killer exploited the estate’s paperwork chaos to move unseen.',
  },
  {
    name: 'Lady Ashford',
    emoji: '👑',
    trait: 'Socialite hiding a ruined fortune',
    alibiClue:
      'Lady Ashford was hosting guests in the ballroom at 8:15 PM, photographed by a guest.',
    motiveClue:
      "The victim threatened to reveal a socialite's ruined finances.",
    tellClue: 'A strand of pearl and a trace of jasmine perfume were found near the scene.',
    opportunityClue:
      'The killer used the crowd’s attention to slip away unnoticed.',
  },
  {
    name: 'Prof. Navarro',
    emoji: '📚',
    trait: 'Academic rival with a bitter dispute',
    alibiClue:
      'Prof. Navarro was debating in the conservatory at 8:45 PM, overheard by two guests.',
    motiveClue:
      "The victim was about to claim credit for a rival's research.",
    tellClue: 'Chalk dust and a torn lecture note were found near the victim.',
    opportunityClue:
      'The killer knew how to access restricted archives and staff passages.',
  },
  {
    name: 'Mr. Huang',
    emoji: '🎩',
    trait: 'Antique dealer with suspicious imports',
    alibiClue:
      'Mr. Huang was appraising a vase in the drawing room at 8:30 PM, observed by the concierge.',
    motiveClue:
      'Customs were closing in on a dealer’s smuggling ring tied to the victim.',
    tellClue: 'Splinters of lacquered wood were found, like from an antique crate.',
    opportunityClue:
      'The killer knew the estate’s storage crates and back corridors.',
  },
  {
    name: 'Mme. Duval',
    emoji: '🌹',
    trait: 'Ex-diplomat with classified contacts',
    alibiClue:
      'Mme. Duval was on a secure call in the wine cellar at 8:15 PM.',
    motiveClue:
      'The victim hinted at leaking a diplomat’s classified contacts.',
    tellClue: 'A drop of rare French perfume and a silk glove were left behind.',
    opportunityClue:
      'The killer knew how to avoid surveillance and create a clean exit.',
  },
  {
    name: 'Sgt. Petrov',
    emoji: '🔧',
    trait: 'Mechanic turned private investigator',
    alibiClue:
      'Sgt. Petrov was inspecting the generator outside at 8:45 PM, seen by the groundskeeper.',
    motiveClue:
      'The victim had ruined a mechanic’s last investigation.',
    tellClue: 'Grease and engine oil were smeared on the handle of the weapon.',
    opportunityClue:
      'The killer understood the estate’s systems and could cut the lights.',
  },
  {
    name: 'Dr. Chandra',
    emoji: '🔬',
    trait: 'Chemist who knows too many poisons',
    alibiClue:
      'Dr. Chandra was mixing a tonic in the kitchen at 8:30 PM, confirmed by the chef.',
    motiveClue:
      'The victim threatened to report a chemist for illegal experiments.',
    tellClue: 'A faint chemical scent and reagent stains were found at the scene.',
    opportunityClue:
      'The killer knew how to prepare a quick-acting toxin.',
  },
  {
    name: 'Rev. Whitmore',
    emoji: '📿',
    trait: 'Clergy member with a hidden life',
    alibiClue:
      'Rev. Whitmore was counseling a guest in the parlor at 8:15 PM.',
    motiveClue:
      'The victim had discovered a clergy member’s hidden life.',
    tellClue: 'A prayer card was left behind, marked in the margins.',
    opportunityClue:
      'The killer used trust and confession to get close.',
  },
  {
    name: 'Capt. Reyes',
    emoji: '⚓',
    trait: 'Retired sailor with smuggling ties',
    alibiClue:
      'Capt. Reyes was on the balcony watching the harbor at 8:45 PM.',
    motiveClue:
      'The victim had seized a shipment tied to a retired sailor.',
    tellClue: 'Saltwater and rope fibers were found near the scene.',
    opportunityClue:
      'The killer knew knots and could improvise a swift restraint.',
  },
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

const NARRATIVE_BEATS = [
  'Earlier in the evening, a tense exchange drew quiet attention.',
  'A brief blackout swept the {setting}, leaving the guests unsettled.',
  'Whispers of an argument drifted from the {room} moments before the discovery.',
  'The party had been lively, but private grudges simmered beneath the music.',
];

const NARRATIVE_AFTER = [
  'Staff reported hurried footsteps retreating from the {room}.',
  'Someone tried to tidy the scene, but the {weapon} was left behind.',
  'A sharp clatter echoed down the hall, then the room fell quiet.',
  'The clock chimed and the room went still as the body was found.',
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

function fillTemplate(template: string, data: Record<string, string>): string {
  return template
    .replace('{victim}', data.victim)
    .replace('{weapon}', data.weapon)
    .replace('{room}', data.room)
    .replace('{setting}', data.setting);
}

// ── Puzzle generation ──────────────────────────────────────────

function getDailySeed(date: Date = new Date()): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

function generatePuzzle(seed: number): WhodunitPuzzle {
  const rand = mulberry32(seed);

  // Pick 5 suspects (harder)
  const shuffledSuspects = seededShuffle(SUSPECTS, rand);
  const suspects = shuffledSuspects.slice(0, 5);

  // Pick killer (index 0-4)
  const killerIndex = Math.floor(rand() * 5);

  // Pick content
  const victim = seededPick(VICTIMS, rand);
  const setting = seededPick(SETTINGS, rand);
  const weapon = seededPick(WEAPONS, rand);
  const room = seededPick(ROOMS, rand);
  const caseName = seededPick(CASE_NAMES, rand);
  const caseNumber = (seed % 900) + 1;

  // Generate narrative
  const suspectNames = suspects.map((s) => s.name).join(', ');
  const context = {
    victim: victim.name,
    weapon: weapon.name,
    room: room.name,
    setting: setting.description,
  };
  const leadIn = fillTemplate(seededPick(NARRATIVE_BEATS, rand), context);
  const aftermath = fillTemplate(seededPick(NARRATIVE_AFTER, rand), context);
  const narrative = `At ${setting.name}, ${victim.name} (${victim.title}) was found dead. The ${weapon.name.replace(
    /^a /,
    ''
  )} was discovered in ${room.name}. ${leadIn} ${aftermath} Five guests remain under suspicion: ${suspectNames}.`;

  const killer = suspects[killerIndex];
  const innocents = suspects
    .map((s, i) => ({ suspect: s, index: i }))
    .filter((_, i) => i !== killerIndex);

  const [alibiOne, alibiTwo, alibiThree] = seededShuffle(innocents, rand).slice(0, 3);

  const evidenceClue: Clue = {
    id: 'evidence',
    type: 'evidence',
    text: `${fillTemplate(killer.tellClue, context)} The ${weapon.name} was found in ${room.name}.`,
    clearsIndex: -1,
    locked: false,
  };

  const motiveClue: Clue = {
    id: 'motive',
    type: 'motive',
    text: fillTemplate(killer.motiveClue, context),
    clearsIndex: -1,
    locked: false,
  };

  const opportunityClue: Clue = {
    id: 'opportunity',
    type: 'opportunity',
    text: fillTemplate(killer.opportunityClue, context),
    clearsIndex: -1,
    locked: false,
  };

  const alibiClueOne: Clue = {
    id: 'alibi-1',
    type: 'alibi',
    text: fillTemplate(alibiOne.suspect.alibiClue, context),
    clearsIndex: alibiOne.index,
    locked: false,
  };

  const alibiClueTwo: Clue = {
    id: 'alibi-2',
    type: 'alibi',
    text: fillTemplate(alibiTwo.suspect.alibiClue, context),
    clearsIndex: alibiTwo.index,
    locked: false,
  };

  const alibiClueThree: Clue = {
    id: 'alibi-3',
    type: 'alibi',
    text: fillTemplate(alibiThree.suspect.alibiClue, context),
    clearsIndex: alibiThree.index,
    locked: false,
  };

  const redHerringClue: Clue = {
    id: 'red-herring',
    type: 'red_herring',
    text: `${fillTemplate(alibiTwo.suspect.tellClue, context)} The timing, however, is unclear.`,
    clearsIndex: -1,
    locked: false,
  };

  const freeClues = seededShuffle(
    [evidenceClue, motiveClue, alibiClueOne],
    rand
  ).map((clue) => ({ ...clue, locked: false }));

  const lockedClues = seededShuffle(
    [opportunityClue, alibiClueTwo, alibiClueThree, redHerringClue],
    rand
  ).map((clue) => ({ ...clue, locked: true }));

  const clues: Clue[] = [...freeClues, ...lockedClues];

  const clueIndexById = (id: string) => clues.findIndex((c) => c.id === id);

  const leadPrompt = 'Choose your first lead:';
  const leadChoices: LeadChoice[] = [
    {
      label: `Interview ${alibiTwo.suspect.name}`,
      description: 'Confirm their alibi or catch a slip.',
      clueId: 'alibi-2',
    },
    {
      label: `Inspect ${room.name}`,
      description: 'Search the room for fresh details.',
      clueId: 'opportunity',
    },
    {
      label: `Follow the odd detail`,
      description: 'Pursue a risky hunch.',
      clueId: 'red-herring',
    },
  ].filter((choice) => clueIndexById(choice.clueId) >= 0);

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
    leadPrompt,
    leadChoices,
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
