import bankData from './miniCrosswordBank.json';
import {
  MINI_CROSSWORD_VARIANT_SEEDS,
  type MiniCrosswordVariantSeed,
} from './miniCrosswordVariantSeeds';

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

export interface MiniCrosswordPuzzle {
  id: string;
  templateId: string;
  size: number;
  cells: MiniCrosswordCell[];
  across: MiniCrosswordClue[];
  down: MiniCrosswordClue[];
}

interface BankTemplate {
  id: string;
  rows: string[];
}

interface BankEntry {
  answer: string;
  clue: string;
}

interface CrosswordBank {
  templates: BankTemplate[];
  entries: BankEntry[];
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

const SIZE = 5;
const DAY_MS = 1000 * 60 * 60 * 24;
const MAX_CANDIDATES_PER_SLOT = 180;
export const MINI_CROSSWORD_VARIANT_COUNT = 400;

const BANK = bankData as CrosswordBank;

const clueByAnswer = new Map<string, string>();
const wordsByLength = new Map<number, string[]>();

for (const entry of BANK.entries) {
  const answer = entry.answer.toUpperCase().trim();
  if (!answer || !/^[A-Z]+$/.test(answer)) continue;
  clueByAnswer.set(answer, entry.clue);
  const arr = wordsByLength.get(answer.length) ?? [];
  arr.push(answer);
  wordsByLength.set(answer.length, arr);
}

for (const [length, words] of wordsByLength.entries()) {
  const deduped = Array.from(new Set(words)).sort();
  wordsByLength.set(length, deduped);
}

const wordSetByLength = new Map<number, Set<string>>();
for (const [length, words] of wordsByLength.entries()) {
  wordSetByLength.set(length, new Set(words));
}

const positionIndex = new Map<number, Array<Record<string, Set<string>>>>();
for (const [length, words] of wordsByLength.entries()) {
  const buckets = Array.from({ length }, () => ({} as Record<string, Set<string>>));
  for (const word of words) {
    for (let i = 0; i < word.length; i += 1) {
      const ch = word[i];
      if (!buckets[i][ch]) buckets[i][ch] = new Set();
      buckets[i][ch].add(word);
    }
  }
  positionIndex.set(length, buckets);
}

const prefixIndex = new Map<string, Set<string>>();
for (const [length, words] of wordsByLength.entries()) {
  for (let prefixLen = 1; prefixLen <= length; prefixLen += 1) {
    const key = `${length}:${prefixLen}`;
    const set = new Set<string>();
    words.forEach((word) => set.add(word.slice(0, prefixLen)));
    prefixIndex.set(key, set);
  }
}

function keyForCell(row: number, col: number): string {
  return `${row}:${col}`;
}

function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  return function () {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildTemplateMeta(template: BankTemplate): TemplateMeta {
  const rows = template.rows.map((row) => row.trim());
  const blocks = rows.map((row) => row.split('').map((ch) => ch === '#'));
  const numbering: Record<string, number> = {};
  const slots: Slot[] = [];
  let nextNumber = 1;

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
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
        while (cc < SIZE && !blocks[row][cc]) {
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
        while (rr < SIZE && !blocks[rr][col]) {
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

function getCandidates(length: number, pattern: string, usedWords: Set<string>): string[] {
  const allWords = wordsByLength.get(length) ?? [];
  const buckets = positionIndex.get(length);
  if (!buckets) return [];

  let candidatePool: Set<string> | null = null;
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    if (ch === '.') continue;
    const bucket = buckets[i][ch];
    if (!bucket || bucket.size === 0) return [];
    if (!candidatePool) {
      candidatePool = new Set(bucket);
    } else {
      const intersection = new Set<string>();
      candidatePool.forEach((word) => {
        if (bucket.has(word)) intersection.add(word);
      });
      candidatePool = intersection;
      if (candidatePool.size === 0) return [];
    }
  }

  const source = candidatePool ? Array.from(candidatePool) : [...allWords];
  return source.filter((word) => !usedWords.has(word)).sort();
}

function patternForSlot(slot: Slot, grid: string[][]): string {
  return slot.cells
    .map(({ row, col }) => {
      const value = grid[row][col];
      return value ? value : '.';
    })
    .join('');
}

function prefixValidForUnassigned(
  slots: Slot[],
  assigned: Array<string | null>,
  grid: string[][]
): boolean {
  for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
    if (assigned[slotIndex]) continue;
    const slot = slots[slotIndex];
    const pattern = patternForSlot(slot, grid);
    let prefixLen = 0;
    while (prefixLen < pattern.length && pattern[prefixLen] !== '.') {
      prefixLen += 1;
    }
    if (prefixLen === 0) continue;
    const key = `${slot.length}:${prefixLen}`;
    const prefixSet = prefixIndex.get(key);
    if (!prefixSet) return false;
    if (!prefixSet.has(pattern.slice(0, prefixLen))) return false;
  }
  return true;
}

function finalConstraintsHold(slots: Slot[], assigned: Array<string | null>): boolean {
  const acrossWords: string[] = [];
  const downWords: string[] = [];

  for (let index = 0; index < slots.length; index += 1) {
    const word = assigned[index];
    if (!word) return false;
    const slot = slots[index];
    const lengthWords = wordSetByLength.get(slot.length);
    if (!lengthWords?.has(word)) return false;
    if (slot.direction === 'across') acrossWords.push(word);
    if (slot.direction === 'down') downWords.push(word);
  }

  if (new Set(acrossWords).size !== acrossWords.length) return false;
  if (new Set(downWords).size !== downWords.length) return false;
  for (const word of acrossWords) {
    if (downWords.includes(word)) return false;
  }
  return true;
}

function solveTemplate(meta: TemplateMeta, seed: number): string[] | null {
  const rand = mulberry32(seed);
  const grid: string[][] = Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => (meta.blocks[row][col] ? '#' : ''))
  );
  const usedWords = new Set<string>();
  const assigned: Array<string | null> = Array(meta.slots.length).fill(null);

  const recurse = (): boolean => {
    if (assigned.every((word) => word !== null)) {
      return finalConstraintsHold(meta.slots, assigned);
    }

    let bestSlotIndex = -1;
    let bestCandidates: string[] | null = null;

    for (let slotIndex = 0; slotIndex < meta.slots.length; slotIndex += 1) {
      if (assigned[slotIndex]) continue;
      const slot = meta.slots[slotIndex];
      const pattern = patternForSlot(slot, grid);
      let candidates = getCandidates(slot.length, pattern, usedWords);
      if (candidates.length === 0) return false;
      candidates = shuffle(candidates, rand);
      if (!bestCandidates || candidates.length < bestCandidates.length) {
        bestSlotIndex = slotIndex;
        bestCandidates = candidates;
      }
    }

    if (bestSlotIndex < 0 || !bestCandidates) return false;

    const slot = meta.slots[bestSlotIndex];
    for (
      let candidateIndex = 0;
      candidateIndex < Math.min(bestCandidates.length, MAX_CANDIDATES_PER_SLOT);
      candidateIndex += 1
    ) {
      const candidate = bestCandidates[candidateIndex];
      assigned[bestSlotIndex] = candidate;
      usedWords.add(candidate);

      const touched: Array<{ row: number; col: number }> = [];
      let conflict = false;
      for (let i = 0; i < slot.cells.length; i += 1) {
        const { row, col } = slot.cells[i];
        const existing = grid[row][col];
        const letter = candidate[i];
        if (existing && existing !== letter) {
          conflict = true;
          break;
        }
        if (!existing) {
          grid[row][col] = letter;
          touched.push({ row, col });
        }
      }

      if (!conflict && prefixValidForUnassigned(meta.slots, assigned, grid) && recurse()) {
        return true;
      }

      touched.forEach(({ row, col }) => {
        grid[row][col] = '';
      });
      usedWords.delete(candidate);
      assigned[bestSlotIndex] = null;
    }

    return false;
  };

  if (!recurse()) return null;
  return assigned.filter((word): word is string => Boolean(word));
}

function makeFallbackClue(answer: string): string {
  const chars = answer.split('');
  const rand = mulberry32(
    answer.split('').reduce((sum, ch, index) => sum + ch.charCodeAt(0) * (index + 1), 0) +
      answer.length * 97
  );
  const scrambled = shuffle(chars, rand).join('');
  const scrambleWord = scrambled === answer ? `${answer.slice(1)}${answer[0]}` : scrambled;
  return `Anagram: ${scrambleWord}`;
}

function buildPuzzleFromSeed(seedInfo: MiniCrosswordVariantSeed): MiniCrosswordPuzzle {
  const meta = templateMetaById.get(seedInfo.templateId);
  if (!meta) {
    throw new Error(`Unknown mini crossword template: ${seedInfo.templateId}`);
  }

  const solvedWords = solveTemplate(meta, seedInfo.seed);
  if (!solvedWords) {
    throw new Error(`Failed to solve mini crossword for seed ${seedInfo.seed}`);
  }

  const solutionGrid: string[][] = Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => (meta.blocks[row][col] ? '#' : ''))
  );
  meta.slots.forEach((slot, index) => {
    const answer = solvedWords[index];
    slot.cells.forEach(({ row, col }, letterIndex) => {
      solutionGrid[row][col] = answer[letterIndex];
    });
  });

  const clues: MiniCrosswordClue[] = meta.slots.map((slot, index) => {
    const answer = solvedWords[index];
    return {
      id: `${slot.direction}-${slot.number}-${slot.row}-${slot.col}`,
      number: slot.number,
      direction: slot.direction,
      row: slot.row,
      col: slot.col,
      answer,
      clue: clueByAnswer.get(answer) ?? makeFallbackClue(answer),
    };
  });

  const across = clues
    .filter((clue) => clue.direction === 'across')
    .sort((a, b) => a.number - b.number || a.row - b.row || a.col - b.col);
  const down = clues
    .filter((clue) => clue.direction === 'down')
    .sort((a, b) => a.number - b.number || a.row - b.row || a.col - b.col);

  const cells: MiniCrosswordCell[] = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
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

  return {
    id: `mini-crossword-${seedInfo.seed}`,
    templateId: meta.id,
    size: SIZE,
    cells,
    across,
    down,
  };
}

function getLocalDayIndex(date: Date): number {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(localMidnight.getTime() / DAY_MS);
}

function positiveMod(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

export function getDailyMiniCrosswordVariantIndex(date: Date = new Date()): number {
  const available = Math.min(MINI_CROSSWORD_VARIANT_COUNT, MINI_CROSSWORD_VARIANT_SEEDS.length);
  if (available <= 0) {
    return 0;
  }
  const dayIndex = getLocalDayIndex(date);
  return positiveMod(dayIndex, available);
}

export function getDailyMiniCrossword(date: Date = new Date()): MiniCrosswordPuzzle {
  const variantIndex = getDailyMiniCrosswordVariantIndex(date);
  const seedInfo = MINI_CROSSWORD_VARIANT_SEEDS[variantIndex];
  if (!seedInfo) {
    throw new Error('Mini crossword seed bank is empty.');
  }
  return buildPuzzleFromSeed(seedInfo);
}
