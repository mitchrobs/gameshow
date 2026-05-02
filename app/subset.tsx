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
  SUBSET_GRID_SIZE,
  SUBSET_DEMO_PUZZLE,
  SUBSET_MAX_INCORRECT_GUESSES as MAX_INCORRECT_GUESSES,
  type SubsetAxis,
  type SubsetBoard,
  type SubsetOrientation,
  type SubsetPuzzleDefinition,
  type SubsetSolvedLines,
  type SubsetTileId,
  adaptSubsetPuzzleToFirstLinePlacement,
  boardIndex,
  canSwapSubsetTiles,
  createEmptySubsetSolvedLines,
  createRandomUnsolvedSubsetBoard,
  formatSubsetShareText,
  getCellFromIndex,
  getOrientedSolvedLineCategory,
  getSubsetLineMatch,
  getSubsetMisplacedLineMatch,
  getSubsetTile,
  isBoardComplete,
  isLineSolved,
  isTileInSolvedLine,
  markLineSolved,
  shuffleSubsetTiles,
  swapBoardTiles,
} from "../src/data/subsetPrototype";
import {
  SUBSET_SCHEDULE_START_DATE,
  createSubsetPuzzleDefinitionFromScheduledPuzzle,
  getSubsetPackPuzzleForDate,
} from "../src/data/subsetSchedule";
import { incrementGlobalPlayCount } from "../src/globalPlayCount";

type GamePhase = "intro" | "shuffling" | "playing" | "won" | "lost";
type PreviewLine = { axis: SubsetAxis; index: number } | null;
type FeedbackTone = "correct" | "wrong" | "invalid";

const SHUFFLE_DURATION_MS = 900;
const SHUFFLE_TICK_MS = 90;
const GRID_GAP = 6;
const CATEGORY_RAIL_THICKNESS = 42;
const MAX_RESHUFFLES = 2;
const STORAGE_PREFIX = "subset";
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
      return `${window.location.origin}/subset`;
    }
  }
  return "https://mitchrobs.github.io/gameshow/subset";
}

function formatPackStartLabel(): string {
  const [year, month, day] =
    SUBSET_SCHEDULE_START_DATE.split("-").map(Number);
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
    SUBSET_GRID_SIZE - 1,
  );
  const targetColumn = clamp(
    column + Math.round(gestureState.dx / cellSpan),
    0,
    SUBSET_GRID_SIZE - 1,
  );
  return boardIndex(targetRow, targetColumn);
}

function isCellOnLine(
  axis: SubsetAxis,
  lineIndex: number,
  row: number,
  column: number,
): boolean {
  return axis === "row" ? row === lineIndex : column === lineIndex;
}

function getProtectedLineForSwap(
  fromIndex: number,
  targetIndex: number,
  solvedLines: SubsetSolvedLines,
): PreviewLine {
  const cells = [getCellFromIndex(fromIndex), getCellFromIndex(targetIndex)];
  for (const cell of cells) {
    if (solvedLines.rows[cell.row]) return { axis: "row", index: cell.row };
    if (solvedLines.columns[cell.column]) {
      return { axis: "column", index: cell.column };
    }
  }
  return null;
}

interface TileViewProps {
  tileId: SubsetTileId;
  puzzle: SubsetPuzzleDefinition;
  index: number;
  cellSize: number;
  cellSpan: number;
  fontSize: number;
  disabled: boolean;
  highlighted: boolean;
  fixed: boolean;
  pillarPulse: boolean;
  pinned: boolean;
  target: boolean;
  feedbackTone: FeedbackTone | null;
  onSwapAttempt: (fromIndex: number, targetIndex: number) => void;
  onDragTargetChange: (targetIndex: number | null) => void;
  styles: ReturnType<typeof createStyles>;
}

function SubsetTileView({
  tileId,
  puzzle,
  index,
  cellSize,
  cellSpan,
  fontSize,
  disabled,
  highlighted,
  fixed,
  pillarPulse,
  pinned,
  target,
  feedbackTone,
  onSwapAttempt,
  onDragTargetChange,
  styles,
}: TileViewProps) {
  const drag = useMemo(() => new Animated.ValueXY({ x: 0, y: 0 }), []);
  const [dragging, setDragging] = useState(false);
  const tile = getSubsetTile(tileId, puzzle);

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
          onDragTargetChange(index);
        },
        onPanResponderMove: (_event, gestureState) => {
          onDragTargetChange(getTargetIndex(index, gestureState, cellSpan));
          drag.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (_event, gestureState) => {
          const targetIndex = getTargetIndex(index, gestureState, cellSpan);
          setDragging(false);
          onDragTargetChange(null);
          onSwapAttempt(index, targetIndex);
          Animated.spring(drag, {
            toValue: { x: 0, y: 0 },
            speed: 22,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          setDragging(false);
          onDragTargetChange(null);
          Animated.spring(drag, {
            toValue: { x: 0, y: 0 },
            speed: 22,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        },
      }),
    [cellSpan, disabled, drag, index, onDragTargetChange, onSwapAttempt],
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
        fixed && styles.tileFixed,
        fixed && pillarPulse && styles.tilePillarPulse,
        target && styles.tileTarget,
        feedbackTone === "correct" && styles.tileFeedbackCorrect,
        feedbackTone === "wrong" && styles.tileFeedbackWrong,
        feedbackTone === "invalid" && styles.tileFeedbackInvalid,
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

export default function SubsetScreen() {
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
    return getSubsetPackPuzzleForDate(todayKey);
  }, [todayKey]);
  const activePuzzle = useMemo(
    () =>
      scheduledPuzzle
        ? createSubsetPuzzleDefinitionFromScheduledPuzzle(scheduledPuzzle)
        : SUBSET_DEMO_PUZZLE,
    [scheduledPuzzle],
  );
  const tileIds = useMemo(
    () => activePuzzle.tiles.map((tile) => tile.id),
    [activePuzzle],
  );
  const isDemoPuzzle = !scheduledPuzzle;
  const packStartLabel = useMemo(() => formatPackStartLabel(), []);
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [roundPuzzle, setRoundPuzzle] =
    useState<SubsetPuzzleDefinition>(activePuzzle);
  const [board, setBoard] = useState<SubsetBoard>(() =>
    shuffleSubsetTiles(tileIds),
  );
  const [solvedLines, setSolvedLines] = useState<SubsetSolvedLines>(() =>
    createEmptySubsetSolvedLines(),
  );
  const [message, setMessage] = useState("Ready when you are.");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [previewLine, setPreviewLine] = useState<PreviewLine>(null);
  const [feedbackLine, setFeedbackLine] = useState<PreviewLine>(null);
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone | null>(null);
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);
  const [pillarPulse, setPillarPulse] = useState(false);
  const [orientation, setOrientation] = useState<SubsetOrientation | null>(
    null,
  );
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [reshufflesUsed, setReshufflesUsed] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const shuffleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const shuffleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pillarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const winAnim = useRef(new Animated.Value(0)).current;
  const hasCountedRef = useRef(false);

  const shellWidth = Math.min(width - theme.spacing.md * 2, 520);
  const cardContentWidth = Math.max(shellWidth - theme.spacing.md * 2, 0);
  const boardMaxWidth = Math.min(cardContentWidth, 456);
  const cellSize = clamp(
    Math.floor((boardMaxWidth - GRID_GAP * SUBSET_GRID_SIZE) / 4),
    52,
    112,
  );
  const headerSize = cellSize;
  const cellSpan = cellSize + GRID_GAP;
  const tileFontSize = cellSize < 70 ? 12 : 14;
  const reshufflesRemaining = Math.max(0, MAX_RESHUFFLES - reshufflesUsed);
  const canShuffleAgain = phase !== "shuffling" && reshufflesRemaining > 0;

  const clearShuffleTimers = useCallback(() => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
      shuffleIntervalRef.current = null;
    }
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current);
      shuffleTimeoutRef.current = null;
    }
    if (pillarTimeoutRef.current) {
      clearTimeout(pillarTimeoutRef.current);
      pillarTimeoutRef.current = null;
    }
  }, []);

  const pulsePillar = useCallback(() => {
    setPillarPulse(true);
    if (pillarTimeoutRef.current) {
      clearTimeout(pillarTimeoutRef.current);
    }
    pillarTimeoutRef.current = setTimeout(() => {
      setPillarPulse(false);
      pillarTimeoutRef.current = null;
    }, reduceMotion ? 500 : 900);
  }, [reduceMotion]);

  const triggerLineFeedback = useCallback(
    (line: PreviewLine, tone: FeedbackTone) => {
      setFeedbackLine(line);
      setFeedbackTone(tone);
      feedbackAnim.stopAnimation();
      feedbackAnim.setValue(0);
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: tone === "correct" ? 520 : 380,
        useNativeDriver: true,
      }).start(() => {
        setFeedbackLine(null);
        setFeedbackTone(null);
      });
    },
    [feedbackAnim],
  );

  const startRound = useCallback((options?: { resetReshuffles?: boolean }) => {
    clearShuffleTimers();
    const finalBoard = createRandomUnsolvedSubsetBoard(
      Math.random,
      200,
      activePuzzle,
    );
    if (options?.resetReshuffles) {
      setReshufflesUsed(0);
    }
    setRoundPuzzle(activePuzzle);
    setSolvedLines(createEmptySubsetSolvedLines());
    setOrientation(null);
    setWrongGuesses(0);
    setPreviewLine(null);
    setFeedbackLine(null);
    setFeedbackTone(null);
    setDragTargetIndex(null);
    setPillarPulse(false);
    setShareStatus(null);
    setMessage(reduceMotion ? "Find a hidden row or column." : "Shuffling...");

    if (reduceMotion) {
      setBoard(finalBoard);
      setPhase("playing");
      pulsePillar();
      return clearShuffleTimers;
    }

    setPhase("shuffling");
    setBoard(shuffleSubsetTiles(tileIds));

    shuffleIntervalRef.current = setInterval(() => {
      setBoard(shuffleSubsetTiles(tileIds));
    }, SHUFFLE_TICK_MS);

    shuffleTimeoutRef.current = setTimeout(() => {
      clearShuffleTimers();
      setBoard(finalBoard);
      setPhase("playing");
      setMessage("Find a hidden row or column.");
      pulsePillar();
    }, SHUFFLE_DURATION_MS);

    return clearShuffleTimers;
  }, [activePuzzle, clearShuffleTimers, pulsePillar, reduceMotion, tileIds]);

  const handleShuffleAgain = useCallback(() => {
    if (!canShuffleAgain) return;
    setReshufflesUsed((current) => Math.min(current + 1, MAX_RESHUFFLES));
    startRound();
  }, [canShuffleAgain, startRound]);

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
    incrementGlobalPlayCount("subset");
  }, [dailyKey, phase]);

  const shareText = useMemo(
    () =>
      formatSubsetShareText({
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
    (axis: SubsetAxis, index: number) => {
      if (phase !== "playing") return;
      if (isLineSolved(solvedLines, axis, index)) return;

      const lineMatch = getSubsetLineMatch(
        board,
        axis,
        index,
        orientation,
        roundPuzzle,
      );
      if (!lineMatch) {
        const hasLockedLine =
          solvedLines.rows.some(Boolean) || solvedLines.columns.some(Boolean);
        const placementAdaptation = hasLockedLine
          ? null
          : adaptSubsetPuzzleToFirstLinePlacement(
              board,
              axis,
              index,
              orientation,
              roundPuzzle,
        );
        if (placementAdaptation) {
          setRoundPuzzle(placementAdaptation.puzzle);
          setBoard(placementAdaptation.board);
          if (!orientation) {
            setOrientation(placementAdaptation.match.orientation);
          }
          triggerLineFeedback({ axis, index }, "correct");
          const nextSolvedLines = markLineSolved(solvedLines, axis, index);
          setSolvedLines(nextSolvedLines);
          if (isBoardComplete(nextSolvedLines)) {
            setPhase("won");
            setMessage("Solved. Every word fits two categories.");
          } else {
            setMessage(`${placementAdaptation.match.category.label} revealed.`);
          }
          return;
        }

        const misplacedLineMatch = getSubsetMisplacedLineMatch(
          board,
          axis,
          index,
          orientation,
          roundPuzzle,
        );
        const missMessage = misplacedLineMatch
          ? `${misplacedLineMatch.category.label}: wrong places.`
          : "No link there.";
        triggerLineFeedback({ axis, index }, "wrong");
        setWrongGuesses((current) => {
          const next = current + 1;
          if (next >= MAX_INCORRECT_GUESSES) {
            setPhase("lost");
            setPreviewLine(null);
            setMessage(`Game over. ${missMessage}`);
          } else {
            setMessage(missMessage);
          }
          return next;
        });
        return;
      }

      if (!orientation) {
        setOrientation(lineMatch.orientation);
      }
      triggerLineFeedback({ axis, index }, "correct");
      const nextSolvedLines = markLineSolved(solvedLines, axis, index);
      setSolvedLines(nextSolvedLines);
      if (isBoardComplete(nextSolvedLines)) {
        setPhase("won");
        setMessage("Solved. Every word fits two categories.");
      } else {
        setMessage(`${lineMatch.category.label} revealed.`);
      }
    },
    [
      board,
      orientation,
      phase,
      roundPuzzle,
      solvedLines,
      triggerLineFeedback,
    ],
  );

  const handlePreviewLine = useCallback(
    (axis: SubsetAxis, index: number, active: boolean) => {
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
      const fixedCellTouched =
        fromIndex === roundPuzzle.fixedCell.index ||
        targetIndex === roundPuzzle.fixedCell.index;
      if (
        !canSwapSubsetTiles(
          board,
          fromIndex,
          targetIndex,
          solvedLines,
          roundPuzzle,
          orientation ?? "canonical",
        )
      ) {
        const protectedLine = getProtectedLineForSwap(
          fromIndex,
          targetIndex,
          solvedLines,
        );
        triggerLineFeedback(protectedLine, "invalid");
        setMessage(
          fixedCellTouched
            ? "Center word stays locked."
            : "Solved lines stay together.",
        );
        return;
      }
      setBoard((currentBoard) =>
        swapBoardTiles(currentBoard, fromIndex, targetIndex),
      );
      setMessage("Keep looking.");
    },
    [
      board,
      orientation,
      phase,
      roundPuzzle,
      solvedLines,
      triggerLineFeedback,
    ],
  );

  const handleDragTargetChange = useCallback((targetIndex: number | null) => {
    setDragTargetIndex(targetIndex);
  }, []);

  const rowLabels = useMemo(
    () =>
      Array.from({ length: SUBSET_GRID_SIZE }, (_, row) =>
        solvedLines.rows[row]
          ? (getOrientedSolvedLineCategory(
              board,
              "row",
              row,
              orientation ?? "canonical",
              roundPuzzle,
            )?.label ?? "?")
          : "?",
      ),
    [board, orientation, roundPuzzle, solvedLines.rows],
  );

  const columnLabels = useMemo(
    () =>
      Array.from({ length: SUBSET_GRID_SIZE }, (_, column) =>
        solvedLines.columns[column]
          ? (getOrientedSolvedLineCategory(
              board,
              "column",
              column,
              orientation ?? "canonical",
              roundPuzzle,
            )?.label ?? "?")
          : "?",
      ),
    [board, orientation, roundPuzzle, solvedLines.columns],
  );

  const hasRevealedLine =
    solvedLines.rows.some(Boolean) || solvedLines.columns.some(Boolean);

  useEffect(() => {
    if (phase === "won") {
      winAnim.setValue(0);
      Animated.spring(winAnim, {
        toValue: 1,
        speed: 10,
        bounciness: 5,
        useNativeDriver: true,
      }).start();
      return;
    }
    winAnim.setValue(0);
  }, [phase, winAnim]);

  const feedbackShake = feedbackAnim.interpolate({
    inputRange: [0, 0.18, 0.36, 0.54, 0.72, 1],
    outputRange: [0, -4, 4, -3, 3, 0],
  });
  const feedbackScale = feedbackAnim.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [1, 1.04, 1],
  });
  const feedbackOpacity = feedbackAnim.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [1, 0.82, 1],
  });
  const winScale = winAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015],
  });

  const getRailFeedbackStyle = (axis: SubsetAxis, index: number) => {
    if (feedbackLine?.axis !== axis || feedbackLine.index !== index) {
      return null;
    }
    if (feedbackTone === "correct") {
      return {
        opacity: feedbackOpacity,
        transform: [{ scale: feedbackScale }],
      };
    }
    return {
      transform: [{ translateX: feedbackShake }],
    };
  };

  return (
    <>
      <Stack.Screen options={{ title: "Subset", headerBackTitle: "Home" }} />
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
                  <Text style={styles.introTitle}>Subset</Text>
                  <Text style={styles.introSubtitle}>
                    {isDemoPuzzle
                      ? `Arrange the grid so every row and column becomes a hidden word group. The daily pack begins ${packStartLabel}.`
                      : "Arrange the grid so every row and column becomes a hidden word group."}
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
                  <View style={styles.introStatPill}>
                    <Text style={styles.introStatText}>2 shuffles</Text>
                  </View>
                </View>

                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>How to play</Text>
                  <View style={styles.instructionRow}>
                    <Text style={styles.instructionNumber}>1</Text>
                    <Text style={styles.instructionsText}>
                      Make six hidden groups: three across and three down.
                    </Text>
                  </View>
                  <View style={styles.instructionRow}>
                    <Text style={styles.instructionNumber}>2</Text>
                    <Text style={styles.instructionsText}>
                      Drag words to swap them. The center word stays fixed and
                      belongs to both its row and column.
                    </Text>
                  </View>
                  <View style={styles.instructionRow}>
                    <Text style={styles.instructionNumber}>3</Text>
                    <Text style={styles.instructionsText}>
                      Tap a ? to check a row or column. Correct lines reveal
                      and lock; four misses end the round.
                    </Text>
                  </View>
                </View>

                <Pressable
                  disabled={!motionReady}
                  onPress={() => startRound({ resetReshuffles: true })}
                  style={({ pressed }) => [
                    primitives.cta,
                    styles.introCta,
                    pressed && primitives.ctaPressed,
                    !motionReady && styles.introCtaDisabled,
                  ]}
                >
                  <Text style={primitives.ctaText}>
                    {motionReady ? "Play Subset" : "Preparing..."}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={primitives.accentBar} />
                <Text style={primitives.title}>Subset</Text>
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
                    <View
                      style={styles.missMeter}
                      accessibilityLabel={`${wrongGuesses} of ${MAX_INCORRECT_GUESSES} misses`}
                    >
                      {Array.from(
                        { length: MAX_INCORRECT_GUESSES },
                        (_, missIndex) => (
                          <View
                            key={`miss-${missIndex}`}
                            style={[
                              styles.missDot,
                              missIndex < wrongGuesses && styles.missDotUsed,
                            ]}
                          />
                        ),
                      )}
                    </View>
                    <Text style={styles.messageText}>{message}</Text>
                  </View>
                  {!hasRevealedLine && phase !== "won" && phase !== "lost" ? (
                    <Text style={styles.instructionText}>
                      Tap a ? to check that row or column.
                    </Text>
                  ) : null}

                  <Animated.View
                    style={[
                      styles.boardShell,
                      phase === "won" && { transform: [{ scale: winScale }] },
                    ]}
                  >
                    <View style={styles.columnHeaderRow}>
                      <View style={{ width: headerSize, height: headerSize }} />
                      {columnLabels.map((label, column) => {
                        const solved = solvedLines.columns[column];
                        const isPreviewed =
                          previewLine?.axis === "column" &&
                          previewLine.index === column;
                        return (
                          <View
                            key={`column-${column}`}
                            style={[
                              styles.columnHeader,
                              { width: headerSize, height: headerSize },
                            ]}
                          >
                            <Animated.View
                              style={getRailFeedbackStyle("column", column)}
                            >
                              <Pressable
                                disabled={phase !== "playing" || solved}
                                onPress={() =>
                                  handleSubmitLine("column", column)
                                }
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
                                  { height: headerSize },
                                  solved && styles.categoryRailSolved,
                                  isPreviewed && styles.categoryRailPreviewed,
                                  feedbackLine?.axis === "column" &&
                                    feedbackLine.index === column &&
                                    feedbackTone === "correct" &&
                                    styles.categoryRailFeedbackCorrect,
                                  feedbackLine?.axis === "column" &&
                                    feedbackLine.index === column &&
                                    feedbackTone === "wrong" &&
                                    styles.categoryRailFeedbackWrong,
                                  feedbackLine?.axis === "column" &&
                                    feedbackLine.index === column &&
                                    feedbackTone === "invalid" &&
                                    styles.categoryRailFeedbackInvalid,
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
                                  minimumFontScale={0.72}
                                  style={[
                                    styles.categoryLabel,
                                    styles.columnCategoryLabel,
                                  ]}
                                >
                                  {label}
                                </Text>
                              </Pressable>
                            </Animated.View>
                          </View>
                        );
                      })}
                    </View>

                    {Array.from({ length: SUBSET_GRID_SIZE }, (_, row) => (
                      <View key={`row-${row}`} style={styles.gridRow}>
                        <View
                          style={[
                            styles.rowHeader,
                            { width: headerSize, height: cellSize },
                          ]}
                        >
                          {(() => {
                            const solved = solvedLines.rows[row];
                            const isPreviewed =
                              previewLine?.axis === "row" &&
                              previewLine.index === row;
                            return (
                              <Animated.View
                                style={getRailFeedbackStyle("row", row)}
                              >
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
                                    isPreviewed &&
                                      styles.categoryRailPreviewed,
                                    feedbackLine?.axis === "row" &&
                                      feedbackLine.index === row &&
                                      feedbackTone === "correct" &&
                                      styles.categoryRailFeedbackCorrect,
                                    feedbackLine?.axis === "row" &&
                                      feedbackLine.index === row &&
                                      feedbackTone === "wrong" &&
                                      styles.categoryRailFeedbackWrong,
                                    feedbackLine?.axis === "row" &&
                                      feedbackLine.index === row &&
                                      feedbackTone === "invalid" &&
                                      styles.categoryRailFeedbackInvalid,
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
                                    numberOfLines={2}
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.68}
                                    style={[
                                      styles.categoryLabel,
                                      styles.rowCategoryLabel,
                                    ]}
                                  >
                                    {rowLabels[row]}
                                  </Text>
                                </Pressable>
                              </Animated.View>
                            );
                          })()}
                        </View>
                        {Array.from(
                          { length: SUBSET_GRID_SIZE },
                          (_, column) => {
                            const index = boardIndex(row, column);
                            const tileId = board[index];
                            const solved =
                              solvedLines.rows[row] ||
                              solvedLines.columns[column];
                            const previewed =
                              (previewLine?.axis === "row" &&
                                previewLine.index === row) ||
                              (previewLine?.axis === "column" &&
                                previewLine.index === column);
                            const feedbackActive = feedbackLine
                              ? isCellOnLine(
                                  feedbackLine.axis,
                                  feedbackLine.index,
                                  row,
                                  column,
                                )
                              : false;
                            const highlighted =
                              solved ||
                              previewed ||
                              feedbackActive ||
                              phase === "won";
                            const fixed =
                              roundPuzzle.fixedCell.index === index &&
                              roundPuzzle.fixedCell.tileId === tileId;
                            const pinned =
                              fixed || isTileInSolvedLine(solvedLines, index);
                            return (
                              <View
                                key={`cell-${row}-${column}`}
                                style={[
                                  styles.cell,
                                  { width: cellSize, height: cellSize },
                                  column < SUBSET_GRID_SIZE - 1 && {
                                    marginRight: GRID_GAP,
                                  },
                                  dragTargetIndex === index &&
                                    styles.cellTarget,
                                ]}
                              >
                                <SubsetTileView
                                  key={tileId}
                                  tileId={tileId}
                                  puzzle={roundPuzzle}
                                  index={index}
                                  cellSize={cellSize}
                                  cellSpan={cellSpan}
                                  fontSize={tileFontSize}
                                  disabled={phase !== "playing" || pinned}
                                  highlighted={highlighted}
                                  fixed={fixed}
                                  pillarPulse={pillarPulse}
                                  pinned={pinned}
                                  target={dragTargetIndex === index}
                                  feedbackTone={
                                    feedbackActive ? feedbackTone : null
                                  }
                                  onSwapAttempt={handleSwapAttempt}
                                  onDragTargetChange={handleDragTargetChange}
                                  styles={styles}
                                />
                              </View>
                            );
                          },
                        )}
                      </View>
                    ))}
                  </Animated.View>

                  <View style={styles.footerActions}>
                    <Pressable
                      disabled={!canShuffleAgain}
                      onPress={handleShuffleAgain}
                      style={({ pressed }) => [
                        styles.secondaryButton,
                        !canShuffleAgain && styles.secondaryButtonDisabled,
                        pressed && styles.secondaryButtonPressed,
                      ]}
                    >
                      <Text style={styles.secondaryButtonText}>
                        {reshufflesRemaining > 0
                          ? `Shuffle again (${reshufflesRemaining})`
                          : "No shuffles left"}
                      </Text>
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
    instructionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.sm,
    },
    instructionNumber: {
      width: 22,
      height: 22,
      borderRadius: 11,
      overflow: "hidden",
      backgroundColor: screenAccent.soft,
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: "900",
      lineHeight: 22,
      textAlign: "center",
    },
    instructionsText: {
      flex: 1,
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
      gap: theme.spacing.sm,
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
    missMeter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 9,
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    missDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: screenAccent.main,
      opacity: 0.92,
    },
    missDotUsed: {
      backgroundColor: theme.colors.textMuted,
      opacity: 0.35,
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
      justifyContent: "center",
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
      height: "100%",
    },
    rowRail: {
      width: "100%",
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
      shadowColor: screenAccent.main,
      shadowOpacity: 0.12,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    categoryRailFeedbackCorrect: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    categoryRailFeedbackWrong: {
      borderColor: theme.colors.textMuted,
      backgroundColor: theme.colors.surface,
    },
    categoryRailFeedbackInvalid: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    categoryRailDisabled: {
      opacity: 0.88,
    },
    categoryLabel: {
      color: theme.colors.text,
      fontSize: 12,
      lineHeight: 14,
      fontWeight: "800",
      textAlign: "center",
      minHeight: 0,
      letterSpacing: 0,
      includeFontPadding: false,
    },
    columnCategoryLabel: {
      fontSize: 11,
      lineHeight: 13,
    },
    rowCategoryLabel: {
      fontSize: 11,
      lineHeight: 13,
      maxWidth: "100%",
    },
    gridRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    cell: {
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceLight,
    },
    cellTarget: {
      backgroundColor: screenAccent.soft,
      shadowColor: screenAccent.main,
      shadowOpacity: 0.14,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
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
    tileFixed: {
      borderWidth: 2,
      borderColor: screenAccent.main,
      backgroundColor: theme.mode === "dark" ? screenAccent.soft : "#eef6ff",
    },
    tilePillarPulse: {
      shadowColor: screenAccent.main,
      shadowOpacity: 0.24,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      transform: [{ scale: 1.02 }],
    },
    tileTarget: {
      borderColor: screenAccent.main,
      shadowColor: screenAccent.main,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    tileFeedbackCorrect: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
    },
    tileFeedbackWrong: {
      borderColor: theme.colors.textMuted,
    },
    tileFeedbackInvalid: {
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.soft,
    },
    tilePinned: {
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.soft,
      opacity: 0.96,
    },
    tileDragging: {
      zIndex: 20,
      elevation: 20,
      shadowColor: screenAccent.main,
      shadowOpacity: 0.24,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
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
      minHeight: 36,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
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
    secondaryButtonDisabled: {
      opacity: 0.52,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: theme.fontSize.sm,
      fontWeight: "800",
    },
  });
