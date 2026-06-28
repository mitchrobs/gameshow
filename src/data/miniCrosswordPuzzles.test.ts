import { describe, expect, it } from 'vitest';
import bankData from './miniCrosswordBank.json';
import {
  MINI_CROSSWORD_PACK_END_DATE,
  MINI_CROSSWORD_PACK_LENGTH,
  MINI_CROSSWORD_PACK_START_DATE,
  MINI_CROSSWORD_SCHEDULE,
} from './miniCrosswordSchedule.generated';
import {
  getDailyMiniCrossword,
  type MiniCrosswordClue,
  type MiniCrosswordPuzzle,
} from './miniCrosswordPuzzles';

const BAD_CLUE_PATTERN =
  /\b(abbreviation|acronym|initialism|roman numeral|street names?|enzyme|genus|province|capital|taxonomic|archaic|obsolete|biblical|terrorist|federal agency|metallic element|radioactive|coenzyme|personality inventory|collagen disease|parasitic|witchcraft|talipot|cuttlefish|dynasty|profane|everyday \d-letter word)\b/i;

const BANK = bankData as {
  themes: Array<{ id: string; keywords?: string[] }>;
  entries: Array<{ answer: string }>;
  bonusWords: Array<{ answer: string; themeId: string }>;
};

function dateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function keyForCell(row: number, col: number): string {
  return `${row}:${col}`;
}

function orderedCellsForClue(clue: MiniCrosswordClue): string[] {
  const stepRow = clue.direction === 'down' ? 1 : 0;
  const stepCol = clue.direction === 'across' ? 1 : 0;
  return Array.from({ length: clue.answer.length }, (_, index) =>
    keyForCell(clue.row + stepRow * index, clue.col + stepCol * index)
  );
}

function assertValidPuzzle(puzzle: MiniCrosswordPuzzle) {
  expect(puzzle.size === 5 || puzzle.size === 7).toBe(true);
  expect(puzzle.cells).toHaveLength(puzzle.size * puzzle.size);
  expect(puzzle.bonus.answer).toMatch(/^[A-Z]{7}$/);
  expect(puzzle.bonus.visual.accent).toMatch(/^#[0-9a-f]{6}$/i);
  expect(puzzle.bonus.visual.tint).toMatch(/^#[0-9a-f]{6}$/i);

  const cellMap = new Map(puzzle.cells.map((cell) => [keyForCell(cell.row, cell.col), cell]));
  const allClues = [...puzzle.across, ...puzzle.down];
  const answers = new Set<string>();
  const checkedCells = new Set<string>();

  allClues.forEach((clue) => {
    expect(clue.answer).toMatch(/^[A-Z]+$/);
    expect(clue.answer.length).toBeGreaterThanOrEqual(3);
    expect(clue.clue).not.toMatch(BAD_CLUE_PATTERN);
    expect(clue.clue.toLowerCase().replace(/\s/g, '')).not.toContain(clue.answer.toLowerCase());
    expect(answers.has(clue.answer)).toBe(false);
    answers.add(clue.answer);

    orderedCellsForClue(clue).forEach((cellKey, letterIndex) => {
      const cell = cellMap.get(cellKey);
      expect(cell).toBeTruthy();
      expect(cell?.isBlock).toBe(false);
      expect(cell?.solution).toBe(clue.answer[letterIndex]);
      checkedCells.add(cellKey);
    });
  });

  puzzle.cells.forEach((cell) => {
    if (cell.isBlock) {
      expect(cell.solution).toBe('');
      return;
    }
    expect(cell.solution).toMatch(/^[A-Z]$/);
    expect(checkedCells.has(keyForCell(cell.row, cell.col))).toBe(true);
  });
}

describe('mini crossword dated schedule', () => {
  it('covers 500 consecutive dates from launch', () => {
    expect(MINI_CROSSWORD_PACK_START_DATE).toBe('2026-05-15');
    expect(MINI_CROSSWORD_PACK_END_DATE).toBe('2027-09-26');
    expect(MINI_CROSSWORD_SCHEDULE).toHaveLength(MINI_CROSSWORD_PACK_LENGTH);
    expect(MINI_CROSSWORD_PACK_LENGTH).toBe(500);

    const seen = new Set<string>();
    MINI_CROSSWORD_SCHEDULE.forEach((entry, index) => {
      expect(seen.has(entry.date)).toBe(false);
      seen.add(entry.date);

      const expected = new Date(2026, 4, 15 + index);
      expect(entry.date).toBe(
        `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(
          expected.getDate()
        ).padStart(2, '0')}`
      );
    });
  });

  it('uses 7x7 Mega Minis every Sunday and 5x5 grids otherwise', () => {
    const sundayEntries = MINI_CROSSWORD_SCHEDULE.filter((entry) => entry.size === 7);
    expect(sundayEntries).toHaveLength(72);

    MINI_CROSSWORD_SCHEDULE.forEach((entry) => {
      const day = dateFromKey(entry.date);
      expect(entry.size).toBe(day.getDay() === 0 ? 7 : 5);
      expect(entry.difficulty).toBe(day.getDay() === 0 ? 'mega' : entry.difficulty);
    });
  });

  it('keeps at least 100 hidden theme lanes available', () => {
    const counts = new Map<string, number>();
    MINI_CROSSWORD_SCHEDULE.forEach((entry) => {
      counts.set(entry.themeId, (counts.get(entry.themeId) ?? 0) + 1);
    });
    expect(BANK.themes).toHaveLength(100);
    expect(counts.size).toBe(100);
    BANK.themes.forEach((theme) => {
      expect(theme.keywords?.length ?? 0).toBeGreaterThanOrEqual(1);
      expect(BANK.bonusWords.filter((bonus) => bonus.themeId === theme.id)).toHaveLength(2);
    });
  });

  it('keeps generated clue metadata above the editorial floor', () => {
    const bankAnswers = new Set(BANK.entries.map((entry) => entry.answer));
    MINI_CROSSWORD_SCHEDULE.forEach((entry) => {
      expect(entry.quality.editorialStatus).toBe('passed');
      expect(entry.quality.generatedAnswerCount).toBe(0);
      expect(entry.quality.fallbackClueCount).toBe(0);
      expect(entry.quality.legacyClueCount).toBe(0);
      expect(entry.quality.bonusGridCollision).toBe(0);
      expect(entry.quality.layoutScore).toBeGreaterThanOrEqual(80);
      expect(entry.quality.themeLaneCount).toBeGreaterThanOrEqual(100);
      [...entry.clues.across, ...entry.clues.down].forEach((clue) => {
        expect(bankAnswers.has(clue.answer)).toBe(true);
        expect(['editorial', 'theme-editor']).toContain(clue.source);
        expect(clue.score).toBeGreaterThanOrEqual(76);
        expect(clue.text).not.toMatch(BAD_CLUE_PATTERN);
        expect(clue.text).not.toBe('Crossword answer');
        expect(clue.themeMatch).toBe(clue.themeTags.includes(entry.themeId));
      });
    });
  });

  it('builds every shipped puzzle with valid fill, clues, and bonus visuals', () => {
    MINI_CROSSWORD_SCHEDULE.forEach((entry) => {
      assertValidPuzzle(getDailyMiniCrossword(dateFromKey(entry.date)));
    });
  });
});
