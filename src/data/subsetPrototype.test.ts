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
  hasAnySolvedLine,
  isBoardComplete,
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
    const animals = SUBSET_COLUMN_CATEGORIES[0].tileIds;
    const computers = SUBSET_ROW_CATEGORIES[0].tileIds;

    expect(getMatchingCategory("column", animals)?.id).toBe("animals");
    expect(getMatchingCategory("row", animals)).toBeNull();
    expect(getMatchingCategory("row", computers)?.id).toBe("computer-terms");
    expect(getMatchingCategory("column", computers)).toBeNull();
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
    expect(canonicalMatch?.category.id).toBe("computer-terms");
    expect(transposedMatch?.orientation).toBe("transposed");
    expect(transposedMatch?.category.id).toBe("animals");
    expect(
      getOrientedSolvedLineCategory(
        TRANSPOSED_SOLUTION_BOARD,
        "row",
        0,
        "transposed",
      )?.id,
    ).toBe("animals");
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
    ).toBe("animals");
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

  it("blocks swaps that break a revealed line and allows swaps inside its membership", () => {
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
    ).toBe(true);
    expect(
      canSwapSubsetTiles(
        SUBSET_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 2),
        solvedLines,
      ),
    ).toBe(true);
  });

  it("preserves solved-line membership under transposed orientation", () => {
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
    ).toBe(true);
    expect(
      canSwapSubsetTiles(
        TRANSPOSED_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 2),
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
      "mouse",
      "cookie",
      "boot",
    ]);
  });

  it("formats a compact non-spoiling share code with three misses", () => {
    const solvedLines = markLineSolved(
      markLineSolved(createEmptySubsetSolvedLines(), "row", 0),
      "column",
      1,
    );

    expect(SUBSET_MAX_INCORRECT_GUESSES).toBe(3);
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
        "Stumped | 3/3 misses",
        "Rows 🟦⬜️⬜️ | Cols ⬜️🟦⬜️",
        "https://example.com/subset",
      ].join("\n"),
    );
  });
});
