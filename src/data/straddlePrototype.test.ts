import { describe, expect, it } from "vitest";
import {
  STRADDLE_CATEGORIES,
  STRADDLE_COLUMN_CATEGORIES,
  STRADDLE_FIXED_CELL,
  STRADDLE_GRID_SIZE,
  STRADDLE_MAX_INCORRECT_GUESSES,
  STRADDLE_ROW_CATEGORIES,
  STRADDLE_SOLUTION_BOARD,
  STRADDLE_TILES,
  type StraddleTileId,
  boardIndex,
  canSwapStraddleTiles,
  createEmptyStraddleSolvedLines,
  createRandomUnsolvedStraddleBoard,
  formatStraddleShareText,
  getLineTileIds,
  getMatchingCategory,
  getSolvedLineCategory,
  hasAnySolvedLine,
  isBoardComplete,
  isTilePinned,
  markLineSolved,
  preservesSolvedLines,
  swapBoardTiles,
} from "./straddlePrototype";

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = Math.imul(1664525, state) + 1013904223;
    return (state >>> 0) / 4294967296;
  };
}

describe("Straddle prototype data", () => {
  it("assigns every tile to exactly one row category and one column category", () => {
    const counts = new Map<StraddleTileId, { row: number; column: number }>(
      STRADDLE_TILES.map((tile) => [tile.id, { row: 0, column: 0 }]),
    );

    STRADDLE_CATEGORIES.forEach((category) => {
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
      Array.from({ length: STRADDLE_TILES.length }, () => ({
        row: 1,
        column: 1,
      })),
    );
  });

  it("matches the intended solution-grid row and column categories", () => {
    for (let index = 0; index < STRADDLE_GRID_SIZE; index += 1) {
      expect(
        getSolvedLineCategory(STRADDLE_SOLUTION_BOARD, "row", index)?.id,
      ).toBe(STRADDLE_ROW_CATEGORIES[index].id);
      expect(
        getSolvedLineCategory(STRADDLE_SOLUTION_BOARD, "column", index)?.id,
      ).toBe(STRADDLE_COLUMN_CATEGORIES[index].id);
    }
  });

  it("does not let row submits match column-only categories or vice versa", () => {
    const animals = STRADDLE_COLUMN_CATEGORIES[0].tileIds;
    const computers = STRADDLE_ROW_CATEGORIES[0].tileIds;

    expect(getMatchingCategory("column", animals)?.id).toBe("animals");
    expect(getMatchingCategory("row", animals)).toBeNull();
    expect(getMatchingCategory("row", computers)?.id).toBe("computer-terms");
    expect(getMatchingCategory("column", computers)).toBeNull();
  });

  it("creates shuffled starts with no already-correct row or column", () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const board = createRandomUnsolvedStraddleBoard(seededRandom(seed));
      expect(board).toHaveLength(STRADDLE_TILES.length);
      expect(new Set(board)).toHaveLength(STRADDLE_TILES.length);
      expect(board[STRADDLE_FIXED_CELL.index]).toBe(STRADDLE_FIXED_CELL.tileId);
      expect(hasAnySolvedLine(board)).toBe(false);
    }
  });

  it("blocks swaps that break a revealed line and allows swaps inside its membership", () => {
    const solvedLines = markLineSolved(
      createEmptyStraddleSolvedLines(),
      "row",
      0,
    );
    const breakingSwap = swapBoardTiles(
      STRADDLE_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(1, 0),
    );
    const safeSwap = swapBoardTiles(
      STRADDLE_SOLUTION_BOARD,
      boardIndex(0, 0),
      boardIndex(0, 2),
    );

    expect(
      preservesSolvedLines(STRADDLE_SOLUTION_BOARD, breakingSwap, solvedLines),
    ).toBe(false);
    expect(
      canSwapStraddleTiles(
        STRADDLE_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(1, 0),
        solvedLines,
      ),
    ).toBe(false);
    expect(
      preservesSolvedLines(STRADDLE_SOLUTION_BOARD, safeSwap, solvedLines),
    ).toBe(true);
    expect(
      canSwapStraddleTiles(
        STRADDLE_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 2),
        solvedLines,
      ),
    ).toBe(true);
  });

  it("pins a tile only after its row and column are both solved", () => {
    const rowSolved = markLineSolved(
      createEmptyStraddleSolvedLines(),
      "row",
      0,
    );
    const rowAndColumnSolved = markLineSolved(rowSolved, "column", 0);

    expect(isTilePinned(rowSolved, boardIndex(0, 0))).toBe(false);
    expect(isTilePinned(rowAndColumnSolved, boardIndex(0, 0))).toBe(true);
    expect(
      canSwapStraddleTiles(
        STRADDLE_SOLUTION_BOARD,
        boardIndex(0, 0),
        boardIndex(0, 1),
        rowAndColumnSolved,
      ),
    ).toBe(false);
  });

  it("keeps the starting seed tile fixed", () => {
    const solvedLines = createEmptyStraddleSolvedLines();

    expect(
      canSwapStraddleTiles(
        STRADDLE_SOLUTION_BOARD,
        STRADDLE_FIXED_CELL.index,
        boardIndex(0, 0),
        solvedLines,
      ),
    ).toBe(false);
    expect(
      canSwapStraddleTiles(
        STRADDLE_SOLUTION_BOARD,
        boardIndex(0, 0),
        STRADDLE_FIXED_CELL.index,
        solvedLines,
      ),
    ).toBe(false);
  });

  it("keeps the starting seed tile fixed in the fallback board", () => {
    const board = createRandomUnsolvedStraddleBoard(seededRandom(1), 0);

    expect(board[STRADDLE_FIXED_CELL.index]).toBe(STRADDLE_FIXED_CELL.tileId);
    expect(hasAnySolvedLine(board)).toBe(false);
  });

  it("reports completion only after all rows and columns are revealed", () => {
    let solvedLines = createEmptyStraddleSolvedLines();
    for (let index = 0; index < STRADDLE_GRID_SIZE; index += 1) {
      solvedLines = markLineSolved(solvedLines, "row", index);
      solvedLines = markLineSolved(solvedLines, "column", index);
    }

    expect(isBoardComplete(solvedLines)).toBe(true);
    expect(getLineTileIds(STRADDLE_SOLUTION_BOARD, "row", 0)).toEqual([
      "mouse",
      "cookie",
      "boot",
    ]);
  });

  it("formats a compact non-spoiling share code with four misses", () => {
    const solvedLines = markLineSolved(
      markLineSolved(createEmptyStraddleSolvedLines(), "row", 0),
      "column",
      1,
    );

    expect(STRADDLE_MAX_INCORRECT_GUESSES).toBe(4);
    expect(
      formatStraddleShareText({
        dateLabel: "May 2, 2026",
        solvedLines,
        wrongGuesses: 6,
        won: false,
        url: "https://example.com/straddle",
      }),
    ).toBe(
      [
        "Straddle May 2, 2026",
        "Stumped | 4/4 misses",
        "Rows 🟦⬜️⬜️ | Cols ⬜️🟦⬜️",
        "https://example.com/straddle",
      ].join("\n"),
    );
  });
});
