import { describe, expect, test } from 'vitest';
import dawnCabinetSchedule from './dawnCabinetSchedule.json';
import {
  DAWN_CABINET_DAILY_DIFFICULTIES,
  DAWN_CABINET_SCHEDULE_DAYS,
  DAWN_CABINET_SCHEDULE_START,
  classifyCabinetLine,
  countCabinetSolutions,
  formatDawnCabinetShareText,
  getCabinetEntryCount,
  type DawnCabinetDailyDifficulty,
  type DawnCabinetPuzzle,
  getDailyDawnCabinet,
  getDemoDawnCabinet,
  getLedgerState,
  isCabinetSolved,
  isValidCabinetLine,
  makeTutorialPuzzle,
  rateDawnCabinetPuzzle,
} from './dawnCabinetPuzzles';

function suitCount(puzzle: DawnCabinetPuzzle): number {
  return new Set(Object.values(puzzle.solution).map((tile) => tile.suit)).size;
}

function blankCount(puzzle: DawnCabinetPuzzle): number {
  return puzzle.cells.length - Object.keys(puzzle.givens).length;
}

function hiddenCount(puzzle: DawnCabinetPuzzle): number {
  return puzzle.lines.filter((line) => line.goal === 'hidden').length;
}

function visibleSetKindCount(puzzle: DawnCabinetPuzzle): number {
  return new Set(puzzle.lines.filter((line) => line.goal !== 'hidden').map((line) => line.goal)).size;
}

function expectLedgerMatchesSolution(puzzle: DawnCabinetPuzzle) {
  const ledgerState = getLedgerState(puzzle, puzzle.solution);
  expect(ledgerState.invalid).toBe(0);
  expect(ledgerState.unknown).toBe(0);
  Object.entries(puzzle.ledger ?? {}).forEach(([kind, count]) => {
    expect(ledgerState.counts[kind as keyof typeof ledgerState.counts]).toBe(count);
  });
}

function expectDifficultyTargets(puzzle: DawnCabinetPuzzle) {
  const blanks = blankCount(puzzle);
  const hidden = hiddenCount(puzzle);
  const suits = suitCount(puzzle);

  if (puzzle.difficulty === 'Easy') {
    expect(suits).toBe(2);
    expect(blanks).toBeGreaterThanOrEqual(5);
    expect(blanks).toBeLessThanOrEqual(6);
    expect(puzzle.lines.length).toBeGreaterThanOrEqual(8);
    expect(puzzle.lines.length).toBeLessThanOrEqual(9);
    expect(hidden).toBeGreaterThanOrEqual(3);
    expect(hidden).toBeLessThanOrEqual(4);
    expect(puzzle.spareCount).toBe(0);
    expect(puzzle.ledger).toEqual({ run: 2, match: 1 });
    expect(puzzle.bankGoal).toBeUndefined();
    return;
  }

  if (puzzle.difficulty === 'Standard') {
    expect(suits).toBe(3);
    expect(blanks).toBeGreaterThanOrEqual(13);
    expect(blanks).toBeLessThanOrEqual(18);
    expect(puzzle.lines.length).toBeGreaterThanOrEqual(18);
    expect(puzzle.lines.length).toBeLessThanOrEqual(22);
    expect(hidden).toBeGreaterThanOrEqual(11);
    expect(hidden).toBeLessThanOrEqual(16);
    expect(puzzle.spareCount).toBeGreaterThanOrEqual(1);
    expect(puzzle.spareCount).toBeLessThanOrEqual(2);
    expect(puzzle.ledger?.run ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.gapRun ?? 0).toBe(0);
    expect(puzzle.ledger?.mixedGap ?? 0).toBe(0);
    expect(puzzle.ledger?.match ?? 0).toBeGreaterThan(0);
    expect((puzzle.ledger?.flush ?? 0) + puzzle.lines.filter((line) => line.goal === 'flush').length).toBeGreaterThan(0);
    expect(puzzle.ledger?.number ?? 0).toBe(0);
    expect(puzzle.bankGoal).toBeUndefined();
    expect(puzzle.dawnTile).toBeDefined();
    expect(puzzle.dawnTile?.options).toHaveLength(3);
    expect(visibleSetKindCount(puzzle)).toBeGreaterThanOrEqual(2);
    expect(visibleSetKindCount(puzzle)).toBeLessThanOrEqual(4);
    expect(puzzle.motifs.length).toBeGreaterThanOrEqual(8);
    expect(puzzle.motifs.length).toBeLessThanOrEqual(9);
    expect(puzzle.macroFamily).toBeDefined();
    expect(puzzle.exposureProfile).toBeDefined();
    expect(puzzle.playProfile?.key).toBeTruthy();
    expect(puzzle.shapeSignature.length).toBeGreaterThan(40);
    return;
  }

  if (puzzle.difficulty === 'Hard') {
    expect(suits).toBe(4);
    expect(blanks).toBeGreaterThanOrEqual(21);
    expect(blanks).toBeLessThanOrEqual(25);
    expect(puzzle.lines.length).toBeGreaterThanOrEqual(25);
    expect(puzzle.lines.length).toBeLessThanOrEqual(33);
    expect(hidden).toBeGreaterThanOrEqual(17);
    expect(hidden).toBeLessThanOrEqual(24);
    expect(puzzle.spareCount).toBeGreaterThanOrEqual(2);
    expect(puzzle.spareCount).toBeLessThanOrEqual(4);
    expect(puzzle.ledger?.run ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.mixedRun ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.gapRun ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.mixedGap ?? 0).toBe(0);
    expect(puzzle.ledger?.match ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.flush ?? 0).toBeGreaterThan(0);
    expect(puzzle.ledger?.number ?? 0).toBeGreaterThan(0);
    if (puzzle.bankGoal) {
      expect(['pair', 'run', 'mixedRun', 'gapRun', 'match', 'flush', 'number']).toContain(puzzle.bankGoal.type);
    }
    expect(puzzle.dawnTile).toBeDefined();
    expect(puzzle.dawnTile?.options).toHaveLength(3);
    expect(visibleSetKindCount(puzzle)).toBeGreaterThanOrEqual(3);
    expect(visibleSetKindCount(puzzle)).toBeLessThanOrEqual(5);
    expect(puzzle.motifs.length).toBeGreaterThanOrEqual(9);
    expect(puzzle.motifs.length).toBeLessThanOrEqual(12);
    expect(puzzle.macroFamily).toBeDefined();
    expect(puzzle.exposureProfile).toBeDefined();
    expect(puzzle.playProfile?.key).toBeTruthy();
    return;
  }

  expect(suits).toBe(5);
  expect(blanks).toBeGreaterThanOrEqual(37);
  expect(blanks).toBeLessThanOrEqual(39);
  expect(puzzle.lines.length).toBeGreaterThanOrEqual(43);
  expect(puzzle.lines.length).toBeLessThanOrEqual(52);
  expect(hidden).toBeGreaterThanOrEqual(32);
  expect(hidden).toBeLessThanOrEqual(37);
  expect(puzzle.spareCount).toBeGreaterThanOrEqual(3);
  expect(puzzle.spareCount).toBeLessThanOrEqual(5);
  expect(puzzle.ledger?.run ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.mixedRun ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.gapRun ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.mixedGap ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.match ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.flush ?? 0).toBeGreaterThan(0);
  expect(puzzle.ledger?.number ?? 0).toBeGreaterThan(0);
  if (puzzle.bankGoal) {
    expect(['run', 'mixedRun', 'gapRun', 'mixedGap', 'match', 'flush', 'number']).toContain(puzzle.bankGoal.type);
  }
  expect(puzzle.dawnTile).toBeDefined();
  expect(puzzle.dawnTile?.options).toHaveLength(4);
  expect(visibleSetKindCount(puzzle)).toBeGreaterThanOrEqual(4);
  expect(visibleSetKindCount(puzzle)).toBeLessThanOrEqual(6);
  expect(puzzle.motifs.length).toBeGreaterThanOrEqual(14);
  expect(puzzle.motifs.length).toBeLessThanOrEqual(17);
  expect(puzzle.macroFamily).toBeDefined();
  expect(puzzle.exposureProfile).toBeDefined();
  expect(puzzle.playProfile?.key).toBeTruthy();
}

describe('dawn cabinet puzzle engine', () => {
  test('accepts true matches, pairs, suited runs, gapped runs, flushes, and number sets', () => {
    expect(
      isValidCabinetLine([
        { suit: 'bamboo', rank: 2 },
        { suit: 'bamboo', rank: 3 },
        { suit: 'bamboo', rank: 4 },
      ])
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'dots', rank: 7 },
          { suit: 'dots', rank: 7 },
          { suit: 'dots', rank: 7 },
        ],
        'match'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'characters', rank: 8 },
          { suit: 'characters', rank: 8 },
        ],
        'pair'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'bamboo', rank: 3 },
          { suit: 'dots', rank: 4 },
          { suit: 'characters', rank: 5 },
        ],
        'mixedRun'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'bamboo', rank: 2 },
          { suit: 'bamboo', rank: 4 },
          { suit: 'bamboo', rank: 6 },
        ],
        'gapRun'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'bamboo', rank: 1 },
          { suit: 'dots', rank: 3 },
          { suit: 'characters', rank: 5 },
        ],
        'mixedGap'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'bamboo', rank: 1 },
          { suit: 'bamboo', rank: 4 },
          { suit: 'bamboo', rank: 7 },
        ],
        'flush'
      )
    ).toBe(true);

    expect(
      isValidCabinetLine(
        [
          { suit: 'bamboo', rank: 5 },
          { suit: 'dots', rank: 5 },
          { suit: 'characters', rank: 5 },
        ],
        'number'
      )
    ).toBe(true);
  });

  test('rejects mixed suit runs, rainbow matches, and rank gaps', () => {
    expect(
      isValidCabinetLine([
        { suit: 'bamboo', rank: 2 },
        { suit: 'dots', rank: 3 },
        { suit: 'bamboo', rank: 4 },
      ])
    ).toBe(false);

    expect(
      isValidCabinetLine(
        [
          { suit: 'dots', rank: 7 },
          { suit: 'bamboo', rank: 7 },
          { suit: 'characters', rank: 7 },
        ],
        'match'
      )
    ).toBe(false);

    expect(
      isValidCabinetLine(
        [
          { suit: 'characters', rank: 2 },
          { suit: 'characters', rank: 4 },
          { suit: 'characters', rank: 5 },
        ],
        'run'
      )
    ).toBe(false);
  });

  test('line classifier uses friendly set grammar priority', () => {
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 2 },
        { suit: 'bamboo', rank: 3 },
        { suit: 'bamboo', rank: 4 },
      ])
    ).toBe('run');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 3 },
        { suit: 'dots', rank: 4 },
        { suit: 'characters', rank: 5 },
      ])
    ).toBe('mixedRun');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 2 },
        { suit: 'bamboo', rank: 4 },
        { suit: 'bamboo', rank: 6 },
      ])
    ).toBe('gapRun');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 1 },
        { suit: 'dots', rank: 3 },
        { suit: 'characters', rank: 5 },
      ])
    ).toBe('mixedGap');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 5 },
        { suit: 'bamboo', rank: 5 },
        { suit: 'bamboo', rank: 5 },
      ])
    ).toBe('match');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 5 },
        { suit: 'bamboo', rank: 5 },
      ])
    ).toBe('pair');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 1 },
        { suit: 'bamboo', rank: 4 },
        { suit: 'bamboo', rank: 7 },
      ])
    ).toBe('flush');
    expect(
      classifyCabinetLine([
        { suit: 'bamboo', rank: 5 },
        { suit: 'dots', rank: 5 },
        { suit: 'characters', rank: 5 },
      ])
    ).toBe('number');
  });

  test('tutorial puzzle has one exact-bank solution', () => {
    const puzzle = makeTutorialPuzzle();
    expect(puzzle.rows).toBe(3);
    expect(puzzle.columns).toBe(3);
    expect(suitCount(puzzle)).toBe(1);
    expect(puzzle.bank).toHaveLength(2);
    expect(new Set(puzzle.lines.map((line) => line.goal))).toEqual(new Set(['run', 'match', 'pair']));
    expect(countCabinetSolutions(puzzle, 2)).toBe(1);
    expect(isCabinetSolved(puzzle, puzzle.solution)).toBe(true);
  });

  test('daily puzzles are deterministic by selected difficulty and uniquely solvable', () => {
    const first = getDailyDawnCabinet('2026-04-25', 'Hard');
    const second = getDailyDawnCabinet('2026-04-25', 'Hard');
    const next = getDailyDawnCabinet('2026-04-26', 'Hard');
    const standard = getDailyDawnCabinet('2026-04-25', 'Standard');

    expect(first).toEqual(second);
    expect(first.id).not.toEqual(next.id);
    expect(first.id).not.toEqual(standard.id);
    expect(first.difficulty).toBe('Hard');
    expect(countCabinetSolutions(first, 2)).toBe(1);
    expect(getCabinetEntryCount(first)).toBe(first.cells.length - Object.keys(first.givens).length + first.spareCount);
    expect(first.dawnTile).toBeDefined();
    expect(first.bank).toHaveLength(first.cells.length - Object.keys(first.givens).length + first.spareCount - 1);
  }, 30000);

  test('demo and daily puzzle templates hit the doubled target bands', () => {
    const easy = getDemoDawnCabinet('Easy', '2026-04-26');
    const standard = getDemoDawnCabinet('Standard', '2026-04-26');
    const hard = getDemoDawnCabinet('Hard', '2026-04-26');
    const expert = getDemoDawnCabinet('Expert', '2026-04-26');

    [easy, standard, hard, expert].forEach(expectDifficultyTargets);

    expect(getCabinetEntryCount(standard)).toBeGreaterThan(getCabinetEntryCount(easy));
    expect(getCabinetEntryCount(hard)).toBeGreaterThan(getCabinetEntryCount(standard));
    expect(getCabinetEntryCount(expert)).toBeGreaterThan(getCabinetEntryCount(hard));
    expect(expert.lines.length).toBeGreaterThan(hard.lines.length);

    const ratings = [easy, standard, hard, expert].map((puzzle) => rateDawnCabinetPuzzle(puzzle).score);
    expect(ratings[1]).toBeGreaterThan(ratings[0]);
    expect(ratings[2]).toBeGreaterThan(ratings[1]);
    expect(ratings[3]).toBeGreaterThan(ratings[2]);

    [easy, standard, hard, expert].forEach((puzzle) => {
      expect(countCabinetSolutions(puzzle, 2)).toBe(1);
      expectLedgerMatchesSolution(puzzle);
    });
  }, 180000);

  test('daily schedule covers Standard, Hard, and Expert for 365 days from May 15', () => {
    let generated = 0;
    expect(dawnCabinetSchedule.start).toBe(DAWN_CABINET_SCHEDULE_START);
    expect(dawnCabinetSchedule.days).toBe(DAWN_CABINET_SCHEDULE_DAYS);
    expect(dawnCabinetSchedule.entries).toHaveLength(DAWN_CABINET_SCHEDULE_DAYS);
    expect(dawnCabinetSchedule.entries[0]?.date).toBe('2026-05-15');
    expect(dawnCabinetSchedule.entries.at(-1)?.date).toBe('2027-05-14');

    dawnCabinetSchedule.entries.forEach((entry) => {
      DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
        const puzzle = getDailyDawnCabinet(entry.date, difficulty);
        generated += 1;
        expect(puzzle.id).toBe(entry.puzzles[difficulty].id);
        expect(puzzle.id).toContain(entry.date);
        expect(puzzle.difficulty).toBe(difficulty);
        expectDifficultyTargets(puzzle);
        expect(isCabinetSolved(puzzle, puzzle.solution)).toBe(true);
        expect(getCabinetEntryCount(puzzle)).toBe(puzzle.cells.length - Object.keys(puzzle.givens).length + puzzle.spareCount);
        expect(puzzle.dawnTile).toBeDefined();
        expect(puzzle.bank).toHaveLength(blankCount(puzzle) + puzzle.spareCount - 1);
      });
    });

    expect(generated).toBe(DAWN_CABINET_SCHEDULE_DAYS * DAWN_CABINET_DAILY_DIFFICULTIES.length);
  }, 180000);

  test('scheduled modular grammar varies shapes, profiles, and macro families', () => {
    DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
      const signatures: string[] = [];
      const compositeSignatures: string[] = [];
      const profiles: string[] = [];
      const motifs = new Set<string>();
      const macroFamilies = new Set<string>();
      const exposureProfiles = new Set<string>();
      const motifProfiles = new Set<string>();

      for (let index = 0; index < 90; index += 1) {
        const date = dawnCabinetSchedule.entries[index].date;
        const puzzle = getDailyDawnCabinet(date, difficulty);
        signatures.push(puzzle.shapeSignature);
        compositeSignatures.push(puzzle.compositeSignature);
        puzzle.motifs.forEach((motif) => motifs.add(motif));
        if (puzzle.macroFamily) macroFamilies.add(puzzle.macroFamily);
        if (puzzle.exposureProfile) exposureProfiles.add(puzzle.exposureProfile);
        if (puzzle.playProfile?.motifProfile) motifProfiles.add(puzzle.playProfile.motifProfile);
        profiles.push([
          blankCount(puzzle),
          puzzle.lines.length,
          puzzle.bank.length,
          puzzle.spareCount,
          puzzle.bankGoal?.type ?? 'any',
        ].join('/'));
      }

      expect(new Set(signatures).size).toBeGreaterThanOrEqual(difficulty === 'Standard' ? 45 : 60);
      expect(new Set(profiles).size).toBeGreaterThanOrEqual(difficulty === 'Standard' ? 8 : 14);
      expect(motifProfiles.size).toBeGreaterThanOrEqual(difficulty === 'Standard' ? 18 : 18);
      expect(exposureProfiles.size).toBe(6);
      expect(motifs.has('mixed-run-braid')).toBe(true);
      if (difficulty === 'Standard') {
        expect(macroFamilies).toEqual(new Set(['splitHinge', 'cornerExchange', 'threePocket', 'shortBasin']));
        expect(motifs.has('switchback-ladder')).toBe(true);
        expect(motifs.has('copy-block')).toBe(true);
      } else {
        expect(macroFamilies).toEqual(
          difficulty === 'Hard'
            ? new Set(['braidedReservoir', 'mirrorTrap', 'offsetBridge', 'reserveFork'])
            : new Set(['ringCabinet', 'fiveDistrict', 'doubleBasin', 'brokenSpine', 'lanternWeb'])
        );
        expect(motifs.has('knot-cell')).toBe(true);
        expect(motifs.has('gap-run-pocket')).toBe(true);
      }
      if (difficulty === 'Expert') {
        expect(motifs.has('flush-basin')).toBe(true);
        expect(motifs.has('mixed-gap-braid')).toBe(true);
      }
      compositeSignatures.forEach((signature, index) => {
        const recent = compositeSignatures.slice(Math.max(0, index - 90), index);
        expect(recent).not.toContain(signature);
      });
    });
  }, 120000);

  test('scheduled pack prevents Composite 90 and Posture 21 repeats', () => {
    DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
      const compositeSignatures: string[] = [];
      const postureKeys: string[] = [];
      let postureFallbackRepeats = 0;
      dawnCabinetSchedule.entries.forEach((entry, index) => {
        const puzzle = getDailyDawnCabinet(entry.date, difficulty);
        const recentComposite = compositeSignatures.slice(Math.max(0, index - 90), index);
        const recentPostures = postureKeys.slice(Math.max(0, index - 21), index);
        expect(recentComposite).not.toContain(puzzle.compositeSignature);
        if (recentPostures.includes(puzzle.playProfile?.key ?? 'none')) postureFallbackRepeats += 1;
        compositeSignatures.push(puzzle.compositeSignature);
        postureKeys.push(puzzle.playProfile?.key ?? 'none');
      });
      expect(postureFallbackRepeats).toBeLessThanOrEqual(difficulty === 'Expert' ? 2 : 0);
    });
  });

  test('scheduled Dawn pressure meets difficulty posture targets', () => {
    DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
      const touchCounts = dawnCabinetSchedule.entries.map((entry) => {
        const puzzle = getDailyDawnCabinet(entry.date, difficulty);
        return rateDawnCabinetPuzzle(puzzle).dawnRailTouchCount;
      });
      if (difficulty === 'Standard') {
        expect(touchCounts.every((count) => count >= 2 && count <= 3)).toBe(true);
        expect(touchCounts.filter((count) => count === 3).length).toBeGreaterThan(90);
      } else if (difficulty === 'Hard') {
        expect(touchCounts.every((count) => count >= 3)).toBe(true);
        expect(touchCounts.filter((count) => count >= 4).length).toBeGreaterThan(100);
      } else {
        expect(touchCounts.filter((count) => count >= 3).length).toBeGreaterThan(350);
        expect(touchCounts.filter((count) => count >= 4).length).toBeGreaterThan(150);
      }
    });
  });

  test('sampled daily puzzles remain uniquely solvable', () => {
    const dates = ['2026-05-15', '2026-06-15', '2026-09-01', '2027-05-14'];
    dates.forEach((date) => {
      DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
        const puzzle = getDailyDawnCabinet(date, difficulty);
        expect(countCabinetSolutions(puzzle, 2)).toBe(1);
      });
    });
  }, 120000);

  test('Dawn tiles are bounded, non-reserve, and unique on daily difficulties', () => {
    const dates = ['2026-05-15', '2026-06-15', '2026-09-01', '2027-05-14'];
    dates.forEach((date) => {
      DAWN_CABINET_DAILY_DIFFICULTIES.forEach((difficulty) => {
        const puzzle = getDailyDawnCabinet(date, difficulty);
        expect(puzzle.dawnTile).toBeDefined();
        expect(puzzle.dawnTile?.options).toHaveLength(difficulty === 'Expert' ? 4 : 3);
        expect(puzzle.dawnTile?.options.map((tile) => `${tile.suit}:${tile.rank}`)).toContain(
          `${puzzle.dawnTile?.resolvedTile.suit}:${puzzle.dawnTile?.resolvedTile.rank}`
        );
        expect(puzzle.givens[puzzle.dawnTile?.solutionCell ?? '']).toBeUndefined();
        expect(getCabinetEntryCount(puzzle)).toBe(blankCount(puzzle) + puzzle.spareCount);
        expect(puzzle.bank).toHaveLength(blankCount(puzzle) + puzzle.spareCount - 1);
        expect(countCabinetSolutions(puzzle, 2)).toBe(1);
      });
    });
  }, 120000);

  test('daily difficulty selection controls suit variety', () => {
    const samples = DAWN_CABINET_DAILY_DIFFICULTIES.map((difficulty) =>
      getDailyDawnCabinet('2026-05-01', difficulty)
    );

    samples.forEach((puzzle) => {
      expectDifficultyTargets(puzzle);
      expect(puzzle.lines.some((line) => line.goal === 'run' || line.goal === 'hidden')).toBe(true);
      expect(puzzle.lines.some((line) => line.goal === 'match' || line.goal === 'hidden')).toBe(true);
      expect(puzzle.lines.some((line) => line.goal === 'pair')).toBe(true);
    });
  });

  test('expert reserve goals rotate through all three-tile set types', () => {
    const goals = new Set(
      dawnCabinetSchedule.entries
        .slice(0, 160)
        .map((entry) => getDailyDawnCabinet(entry.date, 'Expert').bankGoal?.type)
        .filter(Boolean)
    );

    expect(goals).toEqual(new Set(['run', 'mixedRun', 'gapRun', 'mixedGap', 'match', 'flush', 'number']));
  }, 120000);

  test('daily tile families rotate through the full fourteen-family set', () => {
    const seenFamilies = new Set(
      dawnCabinetSchedule.entries.slice(0, 32).map((entry) => {
        return DAWN_CABINET_DAILY_DIFFICULTIES.map((difficulty) =>
          getDailyDawnCabinet(entry.date, difficulty as DawnCabinetDailyDifficulty)
        );
      }).flatMap((puzzles) =>
        puzzles.flatMap((puzzle) => Object.values(puzzle.solution).map((tile) => tile.suit))
      )
    );

    expect(seenFamilies.size).toBe(14);
  });

  test('formats compact non-spoiling daily share text', () => {
    const text = formatDawnCabinetShareText({
      date: '2026-04-26',
      difficulty: 'Hard',
      elapsedSeconds: 312,
      railCount: 22,
      tileTrail: [
        { suit: 'characters', rank: 4 },
        { suit: 'bamboo', rank: 5 },
        { suit: 'coins', rank: 6 },
      ],
      url: 'https://mitchrobs.github.io/gameshow/',
    });

    expect(text).toBe(
      [
        'Dawn Cabinet 2026-04-26',
        'Hard | 05:12 | 22 rails',
        'First correct: 🟥 🟩 🟨',
        'https://mitchrobs.github.io/gameshow/',
      ].join('\n')
    );
    expect(text).not.toContain('Ledger');
    expect(text).not.toContain('Reserve');
    expect(text).not.toContain('Runs');
    expect(text).not.toContain('Matches');
  });
});
