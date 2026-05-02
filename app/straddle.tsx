import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type PanResponderGestureState,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import {
  type ScreenAccentTokens,
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from "../src/constants/theme";
import { createDaybreakPrimitives } from "../src/ui/daybreakPrimitives";
import {
  STRADDLE_GRID_SIZE,
  STRADDLE_DEMO_PUZZLE,
  STRADDLE_MAX_INCORRECT_GUESSES as MAX_INCORRECT_GUESSES,
  type StraddleAxis,
  type StraddleBoard,
  type StraddlePuzzleDefinition,
  type StraddleSolvedLines,
  type StraddleTileId,
  boardIndex,
  canSwapStraddleTiles,
  createEmptyStraddleSolvedLines,
  createRandomUnsolvedStraddleBoard,
  formatStraddleShareText,
  getCellFromIndex,
  getSolvedLineCategory,
  getStraddleTile,
  isBoardComplete,
  isLineSolved,
  isTilePinned,
  markLineSolved,
  shuffleStraddleTiles,
  swapBoardTiles,
} from "../src/data/straddlePrototype";
import {
  STRADDLE_SCHEDULE_START_DATE,
  createStraddlePuzzleDefinitionFromScheduledPuzzle,
  getStraddlePackPuzzleForDate,
} from "../src/data/straddleSchedule";
import { incrementGlobalPlayCount } from "../src/globalPlayCount";

type GamePhase = "intro" | "shuffling" | "playing" | "won" | "lost";
type PreviewLine = { axis: StraddleAxis; index: number } | null;

const SHUFFLE_DURATION_MS = 900;
const SHUFFLE_TICK_MS = 90;
const GRID_GAP = 8;
const CATEGORY_RAIL_THICKNESS = 42;
const STORAGE_PREFIX = "straddle";
const WEB_NO_SELECT =
  Platform.OS === "web"
    ? {
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
      }
    : {};

function getStorage(): Storage | null {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
}

function formatDateLabel(date = new Date()): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getShareUrl(): string {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return `${window.location.origin}/straddle`;
    }
  }
  return "https://mitchrobs.github.io/gameshow/straddle";
}

function formatGuessesLeft(guessesLeft: number): string {
  return `${guessesLeft} ${guessesLeft === 1 ? "guess" : "guesses"} left`;
}

function formatPackStartLabel(): string {
  const [year, month, day] =
    STRADDLE_SCHEDULE_START_DATE.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTargetIndex(
  fromIndex: number,
  gestureState: PanResponderGestureState,
  cellSpan: number,
) {
  const { row, column } = getCellFromIndex(fromIndex);
  const targetRow = clamp(
    row + Math.round(gestureState.dy / cellSpan),
    0,
    STRADDLE_GRID_SIZE - 1,
  );
  const targetColumn = clamp(
    column + Math.round(gestureState.dx / cellSpan),
    0,
    STRADDLE_GRID_SIZE - 1,
  );
  return boardIndex(targetRow, targetColumn);
}

function formatRowRailLabel(label: string): string {
  if (label === "?") return label;
  return label.split(" ")[0] ?? label;
}

function formatVerticalRowRailLabel(label: string): string {
  const compact = formatRowRailLabel(label);
  if (compact === "?") return compact;
  return compact.toUpperCase().split("").join("\n");
}

interface TileViewProps {
  tileId: StraddleTileId;
  puzzle: StraddlePuzzleDefinition;
  index: number;
  cellSize: number;
  cellSpan: number;
  fontSize: number;
  disabled: boolean;
  highlighted: boolean;
  pinned: boolean;
  onSwapAttempt: (fromIndex: number, targetIndex: number) => void;
  styles: ReturnType<typeof createStyles>;
}

function StraddleTileView({
  tileId,
  puzzle,
  index,
  cellSize,
  cellSpan,
  fontSize,
  disabled,
  highlighted,
  pinned,
  onSwapAttempt,
  styles,
}: TileViewProps) {
  const drag = useMemo(() => new Animated.ValueXY({ x: 0, y: 0 }), []);
  const [dragging, setDragging] = useState(false);
  const tile = getStraddleTile(tileId, puzzle);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          !disabled &&
          Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 5,
        onPanResponderGrant: () => {
          drag.stopAnimation();
          drag.setValue({ x: 0, y: 0 });
          setDragging(true);
        },
        onPanResponderMove: (_event, gestureState) => {
          drag.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (_event, gestureState) => {
          setDragging(false);
          onSwapAttempt(index, getTargetIndex(index, gestureState, cellSpan));
          Animated.spring(drag, {
            toValue: { x: 0, y: 0 },
            speed: 22,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          setDragging(false);
          Animated.spring(drag, {
            toValue: { x: 0, y: 0 },
            speed: 22,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        },
      }),
    [cellSpan, disabled, drag, index, onSwapAttempt],
  );

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.tile,
        {
          width: cellSize,
          height: cellSize,
          transform: [
            ...drag.getTranslateTransform(),
            ...(dragging ? [{ scale: 1.03 }] : []),
          ],
        },
        highlighted && styles.tileHighlighted,
        pinned && styles.tilePinned,
        dragging && styles.tileDragging,
        disabled && styles.tileDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${tile.word}${pinned ? ", pinned" : ""}`}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.tileText, { fontSize }]}
      >
        {tile.word}
      </Text>
    </Animated.View>
  );
}

export default function StraddleScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(
    () => resolveScreenAccent("wordie", theme),
    [theme],
  );
  const primitives = useMemo(
    () => createDaybreakPrimitives(theme, screenAccent),
    [theme, screenAccent],
  );
  const styles = useMemo(
    () => createStyles(theme, screenAccent),
    [theme, screenAccent],
  );
  const { width } = useWindowDimensions();
  const todayKey = useMemo(() => formatLocalDateKey(), []);
  const dailyKey = useMemo(() => `${STORAGE_PREFIX}:daily:${todayKey}`, [todayKey]);
  const dateLabel = useMemo(() => formatDateLabel(), []);
  const shareUrl = useMemo(() => getShareUrl(), []);
  const scheduledPuzzle = useMemo(() => {
    return getStraddlePackPuzzleForDate(todayKey);
  }, [todayKey]);
  const activePuzzle = useMemo(
    () =>
      scheduledPuzzle
        ? createStraddlePuzzleDefinitionFromScheduledPuzzle(scheduledPuzzle)
        : STRADDLE_DEMO_PUZZLE,
    [scheduledPuzzle],
  );
  const tileIds = useMemo(
    () => activePuzzle.tiles.map((tile) => tile.id),
    [activePuzzle],
  );
  const isDemoPuzzle = !scheduledPuzzle;
  const packStartLabel = useMemo(() => formatPackStartLabel(), []);
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [board, setBoard] = useState<StraddleBoard>(() =>
    shuffleStraddleTiles(tileIds),
  );
  const [solvedLines, setSolvedLines] = useState<StraddleSolvedLines>(() =>
    createEmptyStraddleSolvedLines(),
  );
  const [message, setMessage] = useState("Ready when you are.");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [previewLine, setPreviewLine] = useState<PreviewLine>(null);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const shuffleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCountedRef = useRef(false);

  const railWidth = CATEGORY_RAIL_THICKNESS;
  const shellWidth = Math.min(width - theme.spacing.md * 2, 520);
  const maxGridWidth = Math.min(shellWidth - railWidth - theme.spacing.sm, 360);
  const cellSize = Math.max(
    58,
    Math.floor((maxGridWidth - GRID_GAP * 2) / STRADDLE_GRID_SIZE),
  );
  const cellSpan = cellSize + GRID_GAP;
  const tileFontSize = cellSize < 70 ? 12 : 14;

  const clearShuffleTimers = useCallback(() => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
  }, []);

  const startRound = useCallback(() => {
    clearShuffleTimers();
    const finalBoard = createRandomUnsolvedStraddleBoard(
      Math.random,
      200,
      activePuzzle,
    );
    setSolvedLines(createEmptyStraddleSolvedLines());
    setWrongGuesses(0);
    setPreviewLine(null);
    setShareStatus(null);
    setMessage(reduceMotion ? "Find a hidden row or column." : "Shuffling...");

    if (reduceMotion) {
      setBoard(finalBoard);
      setPhase("playing");
      return clearShuffleTimers;
    }

    setPhase("shuffling");
    setBoard(shuffleStraddleTiles(tileIds));

    shuffleIntervalRef.current = setInterval(() => {
      setBoard(shuffleStraddleTiles(tileIds));
    }, SHUFFLE_TICK_MS);

    shuffleTimeoutRef.current = setTimeout(() => {
      clearShuffleTimers();
      setBoard(finalBoard);
      setPhase("playing");
      setMessage("Find a hidden row or column.");
    }, SHUFFLE_DURATION_MS);

    return clearShuffleTimers;
  }, [activePuzzle, clearShuffleTimers, reduceMotion, tileIds]);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!mounted) return;
      setReduceMotion(enabled);
      setMotionReady(true);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    return clearShuffleTimers;
  }, [clearShuffleTimers]);

  useEffect(() => {
    if (phase !== "won" && phase !== "lost") return;
    getStorage()?.setItem(dailyKey, "1");
    if (hasCountedRef.current) return;
    hasCountedRef.current = true;
    incrementGlobalPlayCount("straddle");
  }, [dailyKey, phase]);

  const shareText = useMemo(
    () =>
      formatStraddleShareText({
        dateLabel,
        solvedLines,
        wrongGuesses,
        won: phase === "won",
        url: shareUrl,
      }),
    [dateLabel, phase, shareUrl, solvedLines, wrongGuesses],
  );

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  const handleCopyShareText = useCallback(async () => {
    if (Platform.OS !== "web") return;
    const clipboard = (
      globalThis as typeof globalThis & {
        navigator?: {
          clipboard?: { writeText?: (text: string) => Promise<void> };
        };
      }
    ).navigator?.clipboard;

    if (!clipboard?.writeText) {
      setShareStatus("Copy not supported");
      return;
    }

    try {
      await clipboard.writeText(shareText);
      setShareStatus("Copied to clipboard");
    } catch {
      setShareStatus("Copy failed");
    }
  }, [shareText]);

  const handleSubmitLine = useCallback(
    (axis: StraddleAxis, index: number) => {
      if (phase !== "playing") return;
      if (isLineSolved(solvedLines, axis, index)) return;

      const category = getSolvedLineCategory(board, axis, index, activePuzzle);
      if (!category) {
        setWrongGuesses((current) => {
          const next = current + 1;
          const remaining = Math.max(0, MAX_INCORRECT_GUESSES - next);
          if (next >= MAX_INCORRECT_GUESSES) {
            setPhase("lost");
            setPreviewLine(null);
            setMessage("Out of guesses. Shuffle again or reset.");
          } else {
            setMessage(
              `Not quite. ${remaining} ${remaining === 1 ? "guess" : "guesses"} left.`,
            );
          }
          return next;
        });
        return;
      }

      const nextSolvedLines = markLineSolved(solvedLines, axis, index);
      setSolvedLines(nextSolvedLines);
      if (isBoardComplete(nextSolvedLines)) {
        setPhase("won");
        setMessage("Solved. Every word straddles two categories.");
      } else {
        setMessage(`${category.label} revealed. Reorder this ${axis}.`);
      }
    },
    [activePuzzle, board, phase, solvedLines],
  );

  const handlePreviewLine = useCallback(
    (axis: StraddleAxis, index: number, active: boolean) => {
      if (phase !== "playing" || isLineSolved(solvedLines, axis, index)) {
        setPreviewLine(null);
        return;
      }
      setPreviewLine(active ? { axis, index } : null);
    },
    [phase, solvedLines],
  );

  const handleSwapAttempt = useCallback(
    (fromIndex: number, targetIndex: number) => {
      if (phase !== "playing") return;
      if (fromIndex === targetIndex) return;
      if (
        !canSwapStraddleTiles(
          board,
          fromIndex,
          targetIndex,
          solvedLines,
          activePuzzle,
        )
      ) {
        setMessage("Solved lines stay together.");
        return;
      }
      setBoard((currentBoard) =>
        swapBoardTiles(currentBoard, fromIndex, targetIndex),
      );
      setMessage("Keep looking.");
    },
    [activePuzzle, board, phase, solvedLines],
  );

  const rowLabels = useMemo(
    () =>
      Array.from({ length: STRADDLE_GRID_SIZE }, (_, row) =>
        solvedLines.rows[row]
          ? (getSolvedLineCategory(board, "row", row, activePuzzle)?.label ??
            "?")
          : "?",
      ),
    [activePuzzle, board, solvedLines.rows],
  );

  const columnLabels = useMemo(
    () =>
      Array.from({ length: STRADDLE_GRID_SIZE }, (_, column) =>
        solvedLines.columns[column]
          ? (getSolvedLineCategory(board, "column", column, activePuzzle)
              ?.label ?? "?")
          : "?",
      ),
    [activePuzzle, board, solvedLines.columns],
  );

  const hasRevealedLine =
    solvedLines.rows.some(Boolean) || solvedLines.columns.some(Boolean);

  return (
    <>
      <Stack.Screen options={{ title: "Straddle", headerBackTitle: "Home" }} />
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[primitives.page, styles.page]}>
            {phase === "intro" ? (
              <View style={[primitives.card, styles.introCard]}>
                <View style={primitives.accentBar} />
                <View style={styles.introMetaRow}>
                  <Text style={styles.introEyebrow}>
                    {isDemoPuzzle ? "Daily demo" : "Today's game"}
                  </Text>
                  <View style={styles.introDatePill}>
                    <Text style={styles.introDateText}>{dateLabel}</Text>
                  </View>
                </View>

                <View style={styles.introTitleBlock}>
                  <Text style={styles.introTitle}>Straddle</Text>
                  <Text style={styles.introSubtitle}>
                    {isDemoPuzzle
                      ? `Arrange the words so every row and column makes a clean group. The daily pack begins ${packStartLabel}.`
                      : "Arrange the words so every row and column makes a clean group."}
                  </Text>
                </View>

                <View style={styles.introStatsRow}>
                  <View style={styles.introStatPill}>
                    <Text style={styles.introStatText}>
                      {isDemoPuzzle ? "Demo" : "Daily"}
                    </Text>
                  </View>
                  <View style={styles.introStatPill}>
                    <Text style={styles.introStatText}>3x3 grid</Text>
                  </View>
                  <View style={styles.introStatPill}>
                    <Text style={styles.introStatText}>6 links</Text>
                  </View>
                  <View style={styles.introStatPill}>
                    <Text style={styles.introStatText}>4 misses</Text>
                  </View>
                </View>

                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>How to play</Text>
                  <Text style={styles.instructionsText}>
                    Drag words to swap them into the 3x3 grid. Each word must
                    work across its row and down its column.
                  </Text>
                  <Text style={styles.instructionsText}>
                    Tap a ? to check that row or column. Correct lines reveal
                    their category and stay together. The center word starts
                    locked; four misses end the round.
                  </Text>
                </View>

                <Pressable
                  disabled={!motionReady}
                  onPress={() => startRound()}
                  style={({ pressed }) => [
                    primitives.cta,
                    styles.introCta,
                    pressed && primitives.ctaPressed,
                    !motionReady && styles.introCtaDisabled,
                  ]}
                >
                  <Text style={primitives.ctaText}>
                    {motionReady ? "Play Straddle" : "Preparing..."}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={primitives.accentBar} />
                <Text style={primitives.title}>Straddle</Text>
                <Text style={primitives.subtitle}>
                  9 words. 6 hidden links.
                </Text>

                <View style={[primitives.card, styles.boardCard]}>
                  <View style={styles.statusRow}>
                    <View style={styles.statusPill}>
                      <Text style={styles.statusText}>
                        {phase === "shuffling"
                          ? "Shuffling"
                          : phase === "won"
                            ? "Complete"
                            : phase === "lost"
                              ? "Game over"
                              : isDemoPuzzle
                                ? "Demo"
                                : "Playing"}
                      </Text>
                    </View>
                    <View style={styles.guessPill}>
                      <Text style={styles.guessText}>
                        {formatGuessesLeft(
                          Math.max(0, MAX_INCORRECT_GUESSES - wrongGuesses),
                        )}
                      </Text>
                    </View>
                    <Text style={styles.messageText}>{message}</Text>
                  </View>
                  {!hasRevealedLine && phase !== "won" && phase !== "lost" ? (
                    <Text style={styles.instructionText}>
                      Tap a ? to check that row or column.
                    </Text>
                  ) : null}

                  <View style={styles.boardShell}>
                    <View style={styles.columnHeaderRow}>
                      <View style={{ width: railWidth }} />
                      {columnLabels.map((label, column) => {
                        const solved = solvedLines.columns[column];
                        const isPreviewed =
                          previewLine?.axis === "column" &&
                          previewLine.index === column;
                        return (
                          <View
                            key={`column-${column}`}
                            style={[styles.columnHeader, { width: cellSize }]}
                          >
                            <Pressable
                              disabled={phase !== "playing" || solved}
                              onPress={() => handleSubmitLine("column", column)}
                              onHoverIn={() =>
                                handlePreviewLine("column", column, true)
                              }
                              onHoverOut={() =>
                                handlePreviewLine("column", column, false)
                              }
                              onPressIn={() =>
                                handlePreviewLine("column", column, true)
                              }
                              onPressOut={() =>
                                handlePreviewLine("column", column, false)
                              }
                              style={({ pressed }) => [
                                styles.categoryRail,
                                styles.columnRail,
                                solved && styles.categoryRailSolved,
                                isPreviewed && styles.categoryRailPreviewed,
                                (phase !== "playing" || solved) &&
                                  styles.categoryRailDisabled,
                                pressed &&
                                  phase === "playing" &&
                                  !solved &&
                                  styles.categoryRailPressed,
                              ]}
                              accessibilityRole="button"
                              accessibilityLabel={
                                solved
                                  ? `${label} column solved`
                                  : `Check column ${column + 1}`
                              }
                            >
                              <Text
                                numberOfLines={2}
                                adjustsFontSizeToFit
                                style={styles.categoryLabel}
                              >
                                {label}
                              </Text>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>

                    {Array.from({ length: STRADDLE_GRID_SIZE }, (_, row) => (
                      <View key={`row-${row}`} style={styles.gridRow}>
                        <View
                          style={[
                            styles.rowHeader,
                            { width: railWidth, height: cellSize },
                          ]}
                        >
                          {(() => {
                            const solved = solvedLines.rows[row];
                            const isPreviewed =
                              previewLine?.axis === "row" &&
                              previewLine.index === row;
                            return (
                              <Pressable
                                disabled={phase !== "playing" || solved}
                                onPress={() => handleSubmitLine("row", row)}
                                onHoverIn={() =>
                                  handlePreviewLine("row", row, true)
                                }
                                onHoverOut={() =>
                                  handlePreviewLine("row", row, false)
                                }
                                onPressIn={() =>
                                  handlePreviewLine("row", row, true)
                                }
                                onPressOut={() =>
                                  handlePreviewLine("row", row, false)
                                }
                                style={({ pressed }) => [
                                  styles.categoryRail,
                                  styles.rowRail,
                                  { height: cellSize },
                                  solved && styles.categoryRailSolved,
                                  isPreviewed && styles.categoryRailPreviewed,
                                  (phase !== "playing" || solved) &&
                                    styles.categoryRailDisabled,
                                  pressed &&
                                    phase === "playing" &&
                                    !solved &&
                                    styles.categoryRailPressed,
                                ]}
                                accessibilityRole="button"
                                accessibilityLabel={
                                  solved
                                    ? `${rowLabels[row]} row solved`
                                    : `Check row ${row + 1}`
                                }
                              >
                                <Text
                                  numberOfLines={solved ? 12 : 2}
                                  adjustsFontSizeToFit
                                  style={[
                                    styles.categoryLabel,
                                    solved && styles.rowCategoryLabelRevealed,
                                  ]}
                                >
                                  {solved
                                    ? formatVerticalRowRailLabel(rowLabels[row])
                                    : rowLabels[row]}
                                </Text>
                              </Pressable>
                            );
                          })()}
                        </View>
                        {Array.from(
                          { length: STRADDLE_GRID_SIZE },
                          (_, column) => {
                            const index = boardIndex(row, column);
                            const tileId = board[index];
                            const highlighted =
                              solvedLines.rows[row] ||
                              solvedLines.columns[column] ||
                              (previewLine?.axis === "row" &&
                                previewLine.index === row) ||
                              (previewLine?.axis === "column" &&
                                previewLine.index === column);
                            const fixed =
                              activePuzzle.fixedCell.index === index &&
                              activePuzzle.fixedCell.tileId === tileId;
                            const pinned =
                              fixed || isTilePinned(solvedLines, index);
                            return (
                              <View
                                key={`cell-${row}-${column}`}
                                style={[
                                  styles.cell,
                                  { width: cellSize, height: cellSize },
                                  column < STRADDLE_GRID_SIZE - 1 && {
                                    marginRight: GRID_GAP,
                                  },
                                ]}
                              >
                                <StraddleTileView
                                  key={tileId}
                                  tileId={tileId}
                                  puzzle={activePuzzle}
                                  index={index}
                                  cellSize={cellSize}
                                  cellSpan={cellSpan}
                                  fontSize={tileFontSize}
                                  disabled={phase !== "playing" || pinned}
                                  highlighted={highlighted}
                                  pinned={pinned}
                                  onSwapAttempt={handleSwapAttempt}
                                  styles={styles}
                                />
                              </View>
                            );
                          },
                        )}
                      </View>
                    ))}
                  </View>

                  <View style={styles.footerActions}>
                    <Pressable
                      onPress={() => startRound()}
                      style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.secondaryButtonPressed,
                      ]}
                    >
                      <Text style={styles.secondaryButtonText}>
                        Shuffle again
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setBoard(
                          createRandomUnsolvedStraddleBoard(
                            Math.random,
                            200,
                            activePuzzle,
                          ),
                        );
                        setSolvedLines(createEmptyStraddleSolvedLines());
                        setWrongGuesses(0);
                        setPreviewLine(null);
                        setPhase("playing");
                        setMessage("Find a hidden row or column.");
                      }}
                      style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed && styles.secondaryButtonPressed,
                      ]}
                    >
                      <Text style={styles.secondaryButtonText}>Reset</Text>
                    </Pressable>
                  </View>

                  {phase === "won" || phase === "lost" ? (
                    <View style={styles.shareCard}>
                      <Text style={styles.shareEyebrow}>
                        {phase === "won" ? "Solved" : "Round ended"}
                      </Text>
                      <Text style={styles.shareTitle}>Sharecode</Text>
                      <View style={styles.shareBox}>
                        <Text selectable style={styles.shareText}>
                          {shareText}
                        </Text>
                      </View>
                      {Platform.OS === "web" ? (
                        <Pressable
                          onPress={handleCopyShareText}
                          style={({ pressed }) => [
                            styles.shareButton,
                            pressed && styles.shareButtonPressed,
                          ]}
                        >
                          <Text style={styles.shareButtonText}>
                            Copy share text
                          </Text>
                        </Pressable>
                      ) : null}
                      {shareStatus ? (
                        <Text style={styles.shareStatus}>{shareStatus}</Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const createStyles = (theme: ThemeTokens, screenAccent: ScreenAccentTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSoft,
    },
    scrollContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    page: {
      gap: theme.spacing.md,
    },
    introCard: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    introMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    introEyebrow: {
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    introDatePill: {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    introDateText: {
      color: screenAccent.badgeText,
      fontSize: 12,
      fontWeight: "800",
    },
    introTitleBlock: {
      gap: theme.spacing.xs,
    },
    introTitle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.xxl,
      fontWeight: "900",
    },
    introSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.md,
      lineHeight: 22,
      fontWeight: "600",
    },
    introStatsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    introStatPill: {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    introStatText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      fontWeight: "800",
    },
    instructionsCard: {
      gap: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    instructionsTitle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.sm,
      fontWeight: "900",
    },
    instructionsText: {
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      lineHeight: 20,
      fontWeight: "600",
    },
    introCta: {
      alignSelf: "stretch",
    },
    introCtaDisabled: {
      opacity: 0.55,
    },
    boardCard: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    statusRow: {
      minHeight: 34,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    },
    statusPill: {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      backgroundColor: screenAccent.soft,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    statusText: {
      color: screenAccent.badgeText,
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    guessPill: {
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    guessText: {
      color: theme.colors.textSecondary,
      fontSize: 11,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    messageText: {
      flex: 1,
      minWidth: 160,
      color: theme.colors.textSecondary,
      fontSize: theme.fontSize.sm,
      fontWeight: "600",
    },
    instructionText: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.sm,
      fontWeight: "600",
      textAlign: "center",
    },
    boardShell: {
      alignSelf: "center",
      gap: GRID_GAP,
      ...WEB_NO_SELECT,
    },
    columnHeaderRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: GRID_GAP,
    },
    columnHeader: {
      minHeight: 52,
      justifyContent: "flex-end",
    },
    rowHeader: {
      marginRight: GRID_GAP,
      justifyContent: "center",
    },
    categoryRail: {
      minHeight: CATEGORY_RAIL_THICKNESS,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    columnRail: {
      width: "100%",
    },
    rowRail: {
      width: "100%",
      minHeight: 42,
    },
    categoryRailPreviewed: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
      transform: [{ scale: 1.02 }],
    },
    categoryRailPressed: {
      backgroundColor: screenAccent.soft,
      transform: [{ scale: 0.98 }],
    },
    categoryRailSolved: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    categoryRailDisabled: {
      opacity: 0.88,
    },
    categoryLabel: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: "800",
      textAlign: "center",
      minHeight: 18,
    },
    rowCategoryLabelRevealed: {
      fontSize: 9,
      lineHeight: 10,
      minHeight: 0,
      letterSpacing: 0,
    },
    gridRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    cell: {
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceLight,
    },
    tile: {
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.xs,
      ...theme.shadows.card,
    },
    tileHighlighted: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    tilePinned: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    tileDragging: {
      zIndex: 20,
      elevation: 20,
    },
    tileDisabled: {},
    tileText: {
      color: theme.colors.text,
      fontWeight: "900",
      textAlign: "center",
    },
    footerActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    shareCard: {
      gap: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    shareEyebrow: {
      color: screenAccent.main,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    shareTitle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.lg,
      fontWeight: "900",
    },
    shareBox: {
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    shareText: {
      color: theme.colors.text,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "700",
    },
    shareButton: {
      minHeight: 38,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: screenAccent.main,
      borderWidth: 1,
      borderColor: screenAccent.main,
    },
    shareButtonPressed: {
      transform: [{ scale: 0.98 }],
      opacity: 0.9,
    },
    shareButtonText: {
      color: theme.colors.white,
      fontSize: theme.fontSize.sm,
      fontWeight: "900",
    },
    shareStatus: {
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.sm,
      fontWeight: "700",
      textAlign: "center",
    },
    secondaryButton: {
      minHeight: 38,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryButtonPressed: {
      backgroundColor: theme.colors.surface,
      transform: [{ scale: 0.98 }],
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: theme.fontSize.sm,
      fontWeight: "800",
    },
  });
