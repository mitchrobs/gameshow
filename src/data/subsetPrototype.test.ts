import { describe, expect, it } from "vitest";
import {
  SUBSET_CATEGORIES,
  SUBSET_COLUMN_CATEGORIES,
  SUBSET_FIXED_CELL,
  SUBSET_GRID_SIZE,
  SUBSET_MAX_INCORRECT_GUESSES,
  SUBSET_ROW_CATEGORIES,
  SUBSET_SOLUTION_BOARD,
  SUBSET_TILES,
  type SubsetTileId,
  adaptSubsetPuzzleToFirstLinePlacement,
  boardIndex,
  canSwapSubsetTiles,
  createEmptySubsetSolvedLines,
  createRandomUnsolvedSubsetBoard,
  formatSubsetShareText,
  getLineTileIds,
  getMatchingCategory,
  getOrientedSolvedLineCategory,
  getSolvedLineCategory,
  getSubsetLineMatch,
  getSubsetMisplacedLineMatch,
  hasAnySolvedLine,
  isBoardComplete,
  isTileInSolvedLine,
  isTilePinned,
  markLineSolved,
  preservesSolvedLines,
  swapBoardTiles,
} from "./subsetPrototype";

const TRANSPOSED_SOLUTION_BOARD: SubsetTileId[] = [
  SUBSET_SOLUTION_BOARD[boardIndex(0, 0)],
  SUBSET_SOLUTION_BOARD[boardIndex(1, 0)],
  SUBSET_SOLUTION_BOARD[boardIndex(2, 0)],
  SUBSET_SOLUTION_BOARD[boardIndex(0, 1)],
  SUBSET_SOLUTION_BOARD[boardIndex(1, 1)],
  SUBSET_SOLUTION_BOARD[boardIndex(2, 1)],
  SUBSET_SOLUTION_BOARD[boardIndex(0, 2)],
  SUBSET_SOLUTION_BOARD[boardIndex(1, 2)],
  SUBSET_SOLUTION_BOARD[boardIndex(2, 2)],
];

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

describe("Subset prototype data", () => {
  it("assigns every tile to exactly one row category and one column category", () => {
    const counts = new Map<SubsetTileId, { row: number; column: number }>(
      SUBSET_TILES.map((tile) => [tile.id, { row: 0, column: 0 }]),
    );

    SUBSET_CATEGORIES.forEach((category) => {
      category.tileIds.forEach((tileId) => {
        const count = counts.get(tileId);
        expect(count).toBeDefined();
        if (category.axis === "row") {
          count!.row += 1;
        } else {
          count!.column += 1;
        }
      });
    });

    expect([...counts.values()]).toEqual(
      Array.from({ length: SUBSET_TILES.length }, () => ({
        row: 1,
        column: 1,
      })),
    );
  });

  it("matches the intended solution-grid row and column categories", () => {
    for (let index = 0; index < SUBSET_GRID_SIZE; index += 1) {
      expect(
        getSolvedLineCategory(SUBSET_SOLUTION_BOARD, "row", index)?.id,
      ).toBe(SUBSET_ROW_CATEGORIES[index].id);
      expect(
        getSolvedLineCategory(SUBSET_SOLUTION_BOARD, "column", index)?.id,
      ).toBe(SUBSET_COLUMN_CATEGORIES[index].id);
    }
  });

  it("does not let row submits match column-only categories or vice versa", () => {
    const cafe = SUBSET_COLUMN_CATEGORIES[0].tileIds;
    const workers = SUBSET_ROW_CATEGORIES[0].tileIds;

    expect(getMatchingCategory("column", cafe)?.id).toBe("cafe");
    expect(getMatchingCategory("row", cafe)).toBeNull();
    expect(getMatchingCategory("row", workers)?.id).toBe("workers");
    expect(getMatchingCategory("column", workers)).toBeNull();
  });

  it("lets the first correct line silently choose canonical or transposed orientation", () => {
    const canonicalMatch = getSubsetLineMatch(
      SUBSET_SOLUTION_BOARD,
      "row",
      0,
      null,
    );
    const transposedMatch = getSubsetLineMatch(
      TRANSPOSED_SOLUTION_BOARD,
      "row",
      0,
      null,
    );

    expect(canonicalMatch?.orientation).toBe("canonical");
    expect(canonicalMatch?.category.id).toBe("workers");
    expect(transposedMatch?.orientation).toBe("transposed");
    expect(transposedMatch?.category.id).toBe("cafe");
    expect(
      getOrientedSolvedLineCategory(
        TRANSPOSED_SOLUTION_BOARD,
        "row",
        0,
        "transposed",
      )?.id,
    ).toBe("cafe");
  });

  it("uses only the locked orientation after the first correct line", () => {
    expect(
      getSubsetLineMatch(TRANSPOSED_SOLUTION_BOARD, "row", 0, "canonical"),
    ).toBeNull();
    expect(
      getSubsetLineMatch(SUBSET_SOLUTION_BOARD, "row", 0, "transposed"),
    ).toBeNull();
    expect(
      getSubsetLineMatch(
        TRANSPOSED_SOLUTION_BOARD,
        "row",
        0,
        "transposed",
      )?.category.id,
    ).toBe("cafe");
  });

  it("treats a right group in the wrong crossing positions as misplaced", () => {
    const misplacedMusicColumn = swapBoardTiles(
      TRANSPOSED_SOLUTION_BOARD,
      boardIndex(0, 1),
      boardIndex(2, 1),
    );

    expect(
      getSubsetLineMatch(
        misplacedMusicColumn,
        "column",
        1,
        "transposed",
      ),
    ).toBeNull();
    expect(
      getSubsetMisplacedLineMatch(
        misplacedMusicColumn,
        "column",
        1,
        "transposed",
      )?.category.id,
    ).toBe("handhelds");
  });

  it("adapts the first right group in a compatible wrong order", () => {
    const mirroredBoard = [
      "gardener",
      "librarian",
      "barista",
      "trowel",
      "book",
      "mug",
      "rustle",
      "whisper",
      "clink",
    ];

    expect(getSubsetLineMatch(mirroredBoard, "row", 0, null)).toBeNull();
    expect(
      getSubsetMisplacedLineMatch(mirroredBoard, "row", 0, null)?.category.id,
    ).toBe("workers");

    const adaptation = adaptSubsetPuzzleToFirstLinePlacement(
      mirroredBoard,
      "row",
      0,
      null,
    );

    expect(adaptation?.adjusted).toBe(false);
    expect(adaptation?.board).toEqual(mirroredBoard);
    expect(adaptation?.match.orientation).toBe("canonical");
    expect(adaptation?.match.category.id).toBe("workers");
    expect(adaptation?.puzzle.solutionBoard[SUBSET_FIXED_CELL.index]).toBe(
      SUBSET_FIXED_CELL.tileId,
    );
    expect(
      getSubsetLineMatch(
        mirroredBoard,
        "row",
        0,
        adaptation!.match.orientation,
        adaptation!.puzzle,
      )?.category.id,
    ).toBe("workers");
  });

  it("snaps the first right group to a compatible order when needed", () => {
    const pillarBreakingBoard = [
      "librarian",
      "barista",
      "gardener",
      "mug",
      "book",
      "trowel",
      "clink",
      "whisper",
      "rustle",
    ];

    expect(
      getSubsetMisplacedLineMatch(pillarBreakingBoard, "row", 0, null)
        ?.category.id,
    ).toBe("workers");

    const adaptation = adaptSubsetPuzzleToFirstLinePlacement(
      pillarBreakingBoard,
      "row",
      0,
      null,
    );

    expect(adaptation?.adjusted).toBe(true);
    expect(getLineTileIds(adaptation!.board, "row", 0)).toEqual([
      "barista",
      "librarian",
      "gardener",
    ]);
    expect(
      getSubsetLineMatch(
        adaptation!.board,
        "row",
        0,
        adaptation!.match.orientation,
        adaptation!.puzzle,
      )?.category.id,
    ).toBe("workers");
  });

  it("supports completing the board under transposed orientation", () => {
    let solvedLines = createEmptySubsetSolvedLines();

    for (let index = 0; index < SUBSET_GRID_SIZE; index += 1) {
      expect(
        getOrientedSolvedLineCategory(
          TRANSPOSED_SOLUTION_BOARD,
          "row",
          index,
          "transposed",
        )?.id,
      ).toBe(SUBSET_COLUMN_CATEGORIES[index].id);
      expect(
        getOrientedSolvedLineCategory(
          TRANSPOSED_SOLUTION_BOARD,
          "column",
          index,
          "transposed",
        )?.id,
      ).toBe(SUBSET_ROW_CATEGORIES[index].id);

      solvedLines = markLineSolved(solvedLines, "row", index);
      solvedLines = markLineSolved(solvedLines, "column", index);
    }

    expect(isBoardComplete(solvedLines)).toBe(true);
  });

  it("creates shuffled starts with no already-correct row or column in either orientation", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const board = createRandomUnsolvedSubsetBoard(seededRandom(seed));
      expect(board).toHaveLength(SUBSET_TILES.length);
      expect(new Set(board)).toHaveLength(SUBSET_TILES.length);
      expect(board[SUBSET_FIXED_CELL.index]).toBe(SUBSET_FIXED_CELL.tileId);
      expect(hasAnySolvedLine(board)).toBe(false);
    }
  });

  it("blocks swaps that break a revealed line's exact order", () => {
    const solvedLines = markLineSolved(
      createEmptySubsetSolvedLines(),
      "row",
      0,
    );
    const breakingSwap = swapBoardTiles(
      SUBSET_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(1, 0),
    );
    const safeSwap = swapBoardTiles(
      SUBSET_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(0, 2),
    );
    const awayFromSolvedLineSwap = swapBoardTiles(
      SUBSET_SOLUTION_BOARD,
      boardIndex(1, 0),
      boardIndex(2, 0),
    );

    expect(
      preservesSolvedLines(SUBSET_SOLUTION_BOARD, breakingSwap, solvedLines),
    ).toBe(false);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(1, 0),
        solvedLines,
      ),
    ).toBe(false);
    expect(
      preservesSolvedLines(SUBSET_SOLUTION_BOARD, safeSwap, solvedLines),
    ).toBe(false);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 2),
        solvedLines,
      ),
    ).toBe(false);
    expect(
      preservesSolvedLines(
        SUBSET_SOLUTION_BOARD,
        awayFromSolvedLineSwap,
        solvedLines,
      ),
    ).toBe(true);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(1, 0),
        boardIndex(2, 0),
        solvedLines,
      ),
    ).toBe(true);
  });

  it("preserves solved-line exact order under transposed orientation", () => {
    const solvedLines = markLineSolved(
      createEmptySubsetSolvedLines(),
      "row",
      0,
    );
    const breakingSwap = swapBoardTiles(
      TRANSPOSED_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(1, 0),
    );
    const safeSwap = swapBoardTiles(
      TRANSPOSED_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(0, 2),
    );
    const awayFromSolvedLineSwap = swapBoardTiles(
      TRANSPOSED_SOLUTION_BOARD,
      boardIndex(1, 0),
      boardIndex(2, 0),
    );

    expect(
      preservesSolvedLines(
        TRANSPOSED_SOLUTION_BOARD,
        breakingSwap,
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(false);
    expect(
      canSwapSubsetTiles(
        TRANSPOSED_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(1, 0),
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(false);
    expect(
      preservesSolvedLines(
        TRANSPOSED_SOLUTION_BOARD,
        safeSwap,
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(false);
    expect(
      canSwapSubsetTiles(
        TRANSPOSED_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 2),
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(false);
    expect(
      preservesSolvedLines(
        TRANSPOSED_SOLUTION_BOARD,
        awayFromSolvedLineSwap,
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(true);
    expect(
      canSwapSubsetTiles(
        TRANSPOSED_SOLUTION_BOARD,
        boardIndex(1, 0),
        boardIndex(2, 0),
        solvedLines,
        undefined,
        "transposed",
      ),
    ).toBe(true);
  });

  it("pins a tile only after its row and column are both solved", () => {
    const rowSolved = markLineSolved(
      createEmptySubsetSolvedLines(),
      "row",
      0,
    );
    const rowAndColumnSolved = markLineSolved(rowSolved, "column", 0);

    expect(isTilePinned(rowSolved, boardIndex(0, 0))).toBe(false);
    expect(isTilePinned(rowAndColumnSolved, boardIndex(0, 0))).toBe(true);
    expect(isTileInSolvedLine(rowSolved, boardIndex(0, 0))).toBe(true);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 1),
        rowAndColumnSolved,
      ),
    ).toBe(false);
  });

  it("keeps the starting seed tile fixed", () => {
    const solvedLines = createEmptySubsetSolvedLines();

    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        SUBSET_FIXED_CELL.index,
        boardIndex(0, 0),
        solvedLines,
      ),
    ).toBe(false);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(0, 0),
        SUBSET_FIXED_CELL.index,
        solvedLines,
      ),
    ).toBe(false);
  });

  it("keeps the starting seed tile fixed in the fallback board", () => {
    const board = createRandomUnsolvedSubsetBoard(seededRandom(1), 0);

    expect(board[SUBSET_FIXED_CELL.index]).toBe(SUBSET_FIXED_CELL.tileId);
    expect(hasAnySolvedLine(board)).toBe(false);
  });

  it("reports completion only after all rows and columns are revealed", () => {
    let solvedLines = createEmptySubsetSolvedLines();
    for (let index = 0; index < SUBSET_GRID_SIZE; index += 1) {
      solvedLines = markLineSolved(solvedLines, "row", index);
      solvedLines = markLineSolved(solvedLines, "column", index);
    }

    expect(isBoardComplete(solvedLines)).toBe(true);
    expect(getLineTileIds(SUBSET_SOLUTION_BOARD, "row", 0)).toEqual([
      "barista",
      "librarian",
      "gardener",
    ]);
  });

  it("formats a compact non-spoiling share code with four misses", () => {
    const solvedLines = markLineSolved(
      markLineSolved(createEmptySubsetSolvedLines(), "row", 0),
      "column",
      1,
    );

    expect(SUBSET_MAX_INCORRECT_GUESSES).toBe(4);
    expect(
      formatSubsetShareText({
        dateLabel: "May 2, 2026",
        solvedLines,
        wrongGuesses: 6,
        won: false,
        url: "https://example.com/subset",
      }),
    ).toBe(
      [
        "Subset May 2, 2026",
        "Stumped | 4/4 misses",
        "Rows 🟦⬜️⬜️ | Cols ⬜️🟦⬜️",
        "https://example.com/subset",
      ].join("\n"),
    );
  });
});
