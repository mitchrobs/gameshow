import bankData from './miniCrosswordBank.json';
import {
  MINI_CROSSWORD_PACK_LENGTH,
  MINI_CROSSWORD_SCHEDULE,
  type MiniCrosswordScheduleDifficulty,
  type MiniCrosswordScheduleEntry,
} from './miniCrosswordSchedule.generated';

export type MiniCrosswordDirection = 'across' | 'down';

export interface MiniCrosswordCell {
  row: number;
  col: number;
  isBlock: boolean;
  solution: string;
  number?: number;
}

export interface MiniCrosswordClue {
  id: string;
  number: number;
  direction: MiniCrosswordDirection;
  row: number;
  col: number;
  answer: string;
  clue: string;
}

export interface MiniCrosswordTheme {
  id: string;
  label: string;
  description: string;
  visual: MiniCrosswordBonusVisual;
}

export interface MiniCrosswordBonusVisual {
  motif: string;
  accent: string;
  tint: string;
}

export interface MiniCrosswordBonus {
  answer: string;
  clue: string;
  themeId: string;
  difficulty: 'hard';
  instructionText: string;
  visual: MiniCrosswordBonusVisual;
}

export interface MiniCrosswordPuzzle {
  id: string;
  date: string;
  templateId: string;
  size: number;
  difficulty: MiniCrosswordScheduleDifficulty;
  cells: MiniCrosswordCell[];
  across: MiniCrosswordClue[];
  down: MiniCrosswordClue[];
  theme: MiniCrosswordTheme;
  bonus: MiniCrosswordBonus;
  quality: MiniCrosswordScheduleEntry['quality'];
}

interface BankTheme {
  id: string;
  label: string;
  description: string;
  visual?: MiniCrosswordBonusVisual;
}

interface BankTemplate {
  id: string;
  rows: string[];
}

interface BankEntry {
  answer: string;
  clueOptions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  themeTags: string[];
  isModern: boolean;
  isBonusEligible: boolean;
}

interface BankBonusWord {
  answer: string;
  themeId: string;
  clue: string;
  difficulty: 'hard';
}

interface CrosswordBank {
  themes: BankTheme[];
  templates: BankTemplate[];
  entries: BankEntry[];
  bonusWords: BankBonusWord[];
}

interface Slot {
  direction: MiniCrosswordDirection;
  row: number;
  col: number;
  length: number;
  cells: Array<{ row: number; col: number }>;
  number: number;
}

interface TemplateMeta {
  id: string;
  rows: string[];
  blocks: boolean[][];
  numbering: Record<string, number>;
  slots: Slot[];
}

const DAY_MS = 1000 * 60 * 60 * 24;
const BONUS_INSTRUCTION =
  "You unlocked today's 7-letter bonus word. Solve it for extra bragging rights.";

const BANK = bankData as CrosswordBank;
const DEFAULT_VISUAL: MiniCrosswordBonusVisual = {
  motif: 'spark',
  accent: '#c95f23',
  tint: '#fff2e8',
};

function keyForCell(row: number, col: number): string {
  return `${row}:${col}`;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
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

function buildTemplateMeta(template: BankTemplate): TemplateMeta {
  const rows = template.rows.map((row) => row.trim());
  const blocks = rows.map((row) => row.split('').map((ch) => ch === '#'));
  const size = rows.length;
  const numbering: Record<string, number> = {};
  const slots: Slot[] = [];
  let nextNumber = 1;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (blocks[row][col]) continue;
      const startsAcross = col === 0 || blocks[row][col - 1];
      const startsDown = row === 0 || blocks[row - 1][col];
      if (startsAcross || startsDown) {
        numbering[keyForCell(row, col)] = nextNumber;
        nextNumber += 1;
      }

      if (startsAcross) {
        const cells: Array<{ row: number; col: number }> = [];
        let cc = col;
        while (cc < size && !blocks[row][cc]) {
          cells.push({ row, col: cc });
          cc += 1;
        }
        if (cells.length >= 3) {
          slots.push({
            direction: 'across',
            row,
            col,
            length: cells.length,
            cells,
            number: numbering[keyForCell(row, col)],
          });
        }
      }

      if (startsDown) {
        const cells: Array<{ row: number; col: number }> = [];
        let rr = row;
        while (rr < size && !blocks[rr][col]) {
          cells.push({ row: rr, col });
          rr += 1;
        }
        if (cells.length >= 3) {
          slots.push({
            direction: 'down',
            row,
            col,
            length: cells.length,
            cells,
            number: numbering[keyForCell(row, col)],
          });
        }
      }
    }
  }

  return {
    id: template.id,
    rows,
    blocks,
    numbering,
    slots,
  };
}

const templateMetaById = new Map<string, TemplateMeta>();
BANK.templates.forEach((template) => {
  const meta = buildTemplateMeta(template);
  templateMetaById.set(meta.id, meta);
});

const entryByAnswer = new Map<string, BankEntry>();
BANK.entries.forEach((entry) => {
  const answer = entry.answer.toUpperCase().trim();
  if (!answer || !/^[A-Z]+$/.test(answer)) return;
  entryByAnswer.set(answer, {
    ...entry,
    answer,
    clueOptions: entry.clueOptions
      .map((clue) => clue.trim())
      .filter((clue) => clue.length > 0),
  });
});

const themeById = new Map<string, MiniCrosswordTheme>();
BANK.themes.forEach((theme) => {
  themeById.set(theme.id, {
    id: theme.id,
    label: theme.label,
    description: theme.description,
    visual: theme.visual ?? DEFAULT_VISUAL,
  });
});

const bonusByAnswer = new Map<string, BankBonusWord>();
const bonusByThemeId = new Map<string, BankBonusWord[]>();
BANK.bonusWords.forEach((bonus) => {
  const answer = bonus.answer.toUpperCase().trim();
  if (!answer || !/^[A-Z]{7}$/.test(answer)) return;
  const normalized: BankBonusWord = {
    ...bonus,
    answer,
    difficulty: 'hard',
  };
  bonusByAnswer.set(answer, normalized);
  const byTheme = bonusByThemeId.get(normalized.themeId) ?? [];
  byTheme.push(normalized);
  bonusByThemeId.set(normalized.themeId, byTheme);
});

bonusByThemeId.forEach((list, themeId) => {
  const deduped = Array.from(new Map(list.map((item) => [item.answer, item])).values()).sort((a, b) =>
    a.answer.localeCompare(b.answer)
  );
  bonusByThemeId.set(themeId, deduped);
});

function parseSignatureWords(
  meta: TemplateMeta,
  scheduleInfo: MiniCrosswordScheduleEntry
): { acrossWords: string[]; downWords: string[] } {
  const prefix = `${scheduleInfo.templateId}:`;
  const normalizedSignature = scheduleInfo.signature.trim();
  const encoded = normalizedSignature.startsWith(prefix)
    ? normalizedSignature.slice(prefix.length)
    : normalizedSignature.split(':').slice(1).join(':');

  const [acrossPart = '', downPart = ''] = encoded.split('/');
  const acrossWords = acrossPart.length > 0 ? acrossPart.split('|').map((word) => word.toUpperCase()) : [];
  const downWords = downPart.length > 0 ? downPart.split('|').map((word) => word.toUpperCase()) : [];

  const acrossSlots = meta.slots.filter((slot) => slot.direction === 'across');
  const downSlots = meta.slots.filter((slot) => slot.direction === 'down');
  if (acrossWords.length !== acrossSlots.length || downWords.length !== downSlots.length) {
    throw new Error(`Invalid crossword signature payload for ${scheduleInfo.signature}`);
  }

  for (let index = 0; index < acrossSlots.length; index += 1) {
    if (acrossWords[index].length !== acrossSlots[index].length) {
      throw new Error(`Across signature length mismatch for ${scheduleInfo.signature}`);
    }
  }
  for (let index = 0; index < downSlots.length; index += 1) {
    if (downWords[index].length !== downSlots[index].length) {
      throw new Error(`Down signature length mismatch for ${scheduleInfo.signature}`);
    }
  }

  return { acrossWords, downWords };
}

function pickClue(answer: string, slot: Slot, seed: number): string {
  const entry = entryByAnswer.get(answer);
  const fallback = `Everyday ${answer.length}-letter word`;
  if (!entry || entry.clueOptions.length === 0) {
    return fallback;
  }

  const options = entry.clueOptions;
  const playful = options.filter((clue) => clue.includes('?'));
  const straightforward = options.filter((clue) => !clue.includes('?'));

  const rand = mulberry32(seed ^ hashString(`${slot.direction}:${slot.number}:${slot.row}:${slot.col}:${answer}`));
  const preferPlayful = playful.length > 0 && rand() < 0.22;
  const pool = preferPlayful ? playful : straightforward.length > 0 ? straightforward : options;
  if (pool.length === 0) {
    return fallback;
  }

  const index = Math.floor(rand() * pool.length);
  return pool[index] ?? pool[0] ?? fallback;
}

function buildPuzzleFromSchedule(scheduleInfo: MiniCrosswordScheduleEntry): MiniCrosswordPuzzle {
  const meta = templateMetaById.get(scheduleInfo.templateId);
  if (!meta) {
    throw new Error(`Unknown mini crossword template: ${scheduleInfo.templateId}`);
  }

  const { acrossWords, downWords } = parseSignatureWords(meta, scheduleInfo);
  const acrossSlots = meta.slots.filter((slot) => slot.direction === 'across');
  const downSlots = meta.slots.filter((slot) => slot.direction === 'down');

  const solutionGrid: string[][] = Array.from({ length: meta.rows.length }, (_, row) =>
    Array.from({ length: meta.rows.length }, (_, col) => (meta.blocks[row][col] ? '#' : ''))
  );

  acrossSlots.forEach((slot, index) => {
    const answer = acrossWords[index];
    slot.cells.forEach(({ row, col }, letterIndex) => {
      solutionGrid[row][col] = answer[letterIndex];
    });
  });

  downSlots.forEach((slot, index) => {
    const answer = downWords[index];
    slot.cells.forEach(({ row, col }, letterIndex) => {
      const letter = answer[letterIndex];
      const existing = solutionGrid[row][col];
      if (existing && existing !== '#' && existing !== letter) {
        throw new Error(`Crossword signature conflict for ${scheduleInfo.signature}`);
      }
      solutionGrid[row][col] = letter;
    });
  });

  const across: MiniCrosswordClue[] = acrossSlots
    .map((slot, index) => {
      const answer = acrossWords[index];
      const scheduledClue = scheduleInfo.clues?.across?.[index];
      return {
        id: `${slot.direction}-${slot.number}-${slot.row}-${slot.col}`,
        number: slot.number,
        direction: slot.direction,
        row: slot.row,
        col: slot.col,
        answer,
        clue: scheduledClue?.answer === answer ? scheduledClue.text : pickClue(answer, slot, scheduleInfo.seed),
      };
    })
    .sort((a, b) => a.number - b.number || a.row - b.row || a.col - b.col);

  const down: MiniCrosswordClue[] = downSlots
    .map((slot, index) => {
      const answer = downWords[index];
      const scheduledClue = scheduleInfo.clues?.down?.[index];
      return {
        id: `${slot.direction}-${slot.number}-${slot.row}-${slot.col}`,
        number: slot.number,
        direction: slot.direction,
        row: slot.row,
        col: slot.col,
        answer,
        clue: scheduledClue?.answer === answer ? scheduledClue.text : pickClue(answer, slot, scheduleInfo.seed),
      };
    })
    .sort((a, b) => a.number - b.number || a.row - b.row || a.col - b.col);

  const cells: MiniCrosswordCell[] = [];
  for (let row = 0; row < meta.rows.length; row += 1) {
    for (let col = 0; col < meta.rows.length; col += 1) {
      const isBlock = meta.blocks[row][col];
      const cellNumber = meta.numbering[keyForCell(row, col)];
      cells.push({
        row,
        col,
        isBlock,
        solution: isBlock ? '' : solutionGrid[row][col],
        number: isBlock ? undefined : cellNumber,
      });
    }
  }

  const theme =
    themeById.get(scheduleInfo.themeId) ?? {
      id: scheduleInfo.themeId,
      label: scheduleInfo.themeId,
      description: 'Daily crossword theme',
      visual: DEFAULT_VISUAL,
    };

  const rawBonus =
    bonusByAnswer.get(scheduleInfo.bonusAnswer) ??
    (bonusByThemeId.get(theme.id)?.[0] as BankBonusWord | undefined);

  if (!rawBonus) {
    throw new Error(`No bonus word available for theme '${theme.id}'`);
  }

  const bonus: MiniCrosswordBonus = {
    answer: rawBonus.answer,
    clue: rawBonus.clue,
    themeId: rawBonus.themeId,
    difficulty: 'hard',
    instructionText: BONUS_INSTRUCTION,
    visual: theme.visual,
  };

  return {
    id: `mini-crossword-${scheduleInfo.date}`,
    date: scheduleInfo.date,
    templateId: meta.id,
    size: meta.rows.length,
    difficulty: scheduleInfo.difficulty,
    cells,
    across,
    down,
    theme,
    bonus,
    quality: scheduleInfo.quality,
  };
}

function getLocalDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function positiveMod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / DAY_MS);
}

const scheduleByDate = new Map(MINI_CROSSWORD_SCHEDULE.map((entry) => [entry.date, entry]));

export function getDailyMiniCrosswordVariantIndex(date: Date = new Date()): number {
  const available = MINI_CROSSWORD_PACK_LENGTH;
  if (available <= 0) {
    return 0;
  }
  const dayIndex = getLocalDayIndex(date);
  return positiveMod(dayIndex, available);
}

export function getDailyMiniCrossword(date: Date = new Date()): MiniCrosswordPuzzle {
  const dateKey = getLocalDateKey(date);
  const scheduleInfo =
    scheduleByDate.get(dateKey) ??
    MINI_CROSSWORD_SCHEDULE[getDailyMiniCrosswordVariantIndex(date)];
  if (!scheduleInfo) {
    throw new Error('Mini crossword schedule is empty.');
  }
  return buildPuzzleFromSchedule(scheduleInfo);
}
