import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Check,
  Copy,
  Delete,
  Play,
  Share2,
  Shuffle,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import {
  KILTER_GAME_SECONDS,
  KILTER_RANK_COUNT,
  KILTER_SHARE_URL,
  formatKilterShareText,
  getDailyKilter,
  getKilterAllowedLetters,
  getKilterRank,
  getKilterRemainingSeconds,
  getLocalKilterDateKey,
  isKilterTimeUp,
  scoreKilterWord,
  validateKilterGuess,
  type KilterPackEntry,
  type KilterWordKind,
} from '../src/data/kilter';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

type KilterPhase = 'intro' | 'playing' | 'ended';

interface SavedKilterState {
  puzzleId: string;
  phase: KilterPhase;
  foundWords: string[];
  startedAtMs: number | null;
  looseLetters: string[];
}

interface FoundWordView {
  word: string;
  kind: KilterWordKind;
  points: number;
  isSweep: boolean;
}

interface SweepBurst {
  id: number;
  word: string;
  points: number;
}

type FeedbackTone = 'neutral' | 'invalid' | 'valid' | 'bonus' | 'sweep';

const INTRO_RULES = [
  {
    label: '1',
    title: 'Make words fast',
    body: 'You have 5 minutes. Tap letters to spell a word, then press Enter.',
  },
  {
    label: '2',
    title: 'Use the green center',
    body: 'Every word needs the green letter or green letters.',
  },
  {
    label: '3',
    title: 'Keep greens together',
    body: 'If there are 2 or 3 green letters, use them together in that order.',
  },
  {
    label: '4',
    title: 'Reuse letters',
    body: 'Use only the letters on the board. You can use any letter more than once.',
  },
  {
    label: '5',
    title: 'Find the Sweep',
    body: 'A Sweep uses all six outside letters. It adds a star and helps you reach Mastered.',
  },
  {
    label: '6',
    title: 'Score and form',
    body: 'Core words raise your score. Bonus words are accepted for +1.',
  },
] as const;

interface LetterPosition {
  left: number;
  top: number;
}

const STORAGE_PREFIX = 'kilter';
const MAX_WORD_LENGTH = 18;
const LETTER_BOARD_WIDTH = 320;
const LETTER_BOARD_HEIGHT = 220;
const LOOSE_TILE_SIZE = 60;
const REQUIRED_TILE_WIDTH = 60;
const REQUIRED_TILE_HEIGHT = 60;
const REQUIRED_ROW_Y = 80;
const LOOSE_ARC_SIDE_GAP = 10;
const LOOSE_ARC_TOP_CENTER_Y = 0;
const LOOSE_ARC_TOP_SIDE_Y = 26;
const LOOSE_ARC_BOTTOM_SIDE_Y = 134;
const LOOSE_ARC_BOTTOM_CENTER_Y = 160;
const WEB_NO_SELECT =
  Platform.OS === 'web'
    ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }
    : {};

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function dateFromLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function formatDateLabel(dateKey: string): string {
  return dateFromLocalDateKey(dateKey).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getShareUrl(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
      return `${window.location.origin}${path || '/kilter'}`;
    }
  }
  return KILTER_SHARE_URL;
}

function prefersReducedMotion(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function shuffleLetters(letters: readonly string[]): string[] {
  const copy = [...letters];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex]!, copy[index]!];
  }
  return copy;
}

function getLooseLetterPositions(requiredLeft: number, requiredWidth: number): {
  top: LetterPosition[];
  bottom: LetterPosition[];
} {
  const sideLeft = requiredLeft - LOOSE_TILE_SIZE - LOOSE_ARC_SIDE_GAP;
  const sideRight = requiredLeft + requiredWidth + LOOSE_ARC_SIDE_GAP;
  const centerLeft = (LETTER_BOARD_WIDTH - LOOSE_TILE_SIZE) / 2;
  return {
    top: [
      { left: sideLeft, top: LOOSE_ARC_TOP_SIDE_Y },
      { left: centerLeft, top: LOOSE_ARC_TOP_CENTER_Y },
      { left: sideRight, top: LOOSE_ARC_TOP_SIDE_Y },
    ],
    bottom: [
      { left: sideLeft, top: LOOSE_ARC_BOTTOM_SIDE_Y },
      { left: centerLeft, top: LOOSE_ARC_BOTTOM_CENTER_Y },
      { left: sideRight, top: LOOSE_ARC_BOTTOM_SIDE_Y },
    ],
  };
}

function getFoundWordViews(foundWords: readonly string[], puzzle: KilterPackEntry): FoundWordView[] {
  return foundWords.map((word) => ({
    word,
    kind: puzzle.coreWords.includes(word) ? 'core' : 'bonus',
    points: scoreKilterWord(word, puzzle),
    isSweep: puzzle.sweeps.includes(word),
  }));
}

export default function KilterScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('kilter', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const [todayKey, setTodayKey] = useState(() => getLocalKilterDateKey());
  const activeDate = useMemo(() => dateFromLocalDateKey(todayKey), [todayKey]);
  const puzzle = useMemo(() => getDailyKilter(activeDate), [activeDate]);
  const [phase, setPhase] = useState<KilterPhase>('intro');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(KILTER_GAME_SECONDS);
  const [looseLetters, setLooseLetters] = useState<string[]>(() => puzzle.letters);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<FeedbackTone>('neutral');
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [sweepBurst, setSweepBurst] = useState<SweepBurst | null>(null);
  const [isLoaded, setLoaded] = useState(Platform.OS !== 'web');
  const hasCountedRef = useRef(false);
  const sweepScale = useRef(new Animated.Value(0.92)).current;
  const sweepOpacity = useRef(new Animated.Value(0)).current;
  const wordScale = useRef(new Animated.Value(1)).current;
  const wordShift = useRef(new Animated.Value(0)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;
  const shareUrl = useMemo(() => getShareUrl(), []);
  const dateLabel = useMemo(() => formatDateLabel(puzzle.date), [puzzle.date]);
  const allowedLetters = useMemo(() => getKilterAllowedLetters(puzzle), [puzzle]);
  const foundViews = useMemo(() => getFoundWordViews(foundWords, puzzle), [foundWords, puzzle]);
  const score = useMemo(
    () => foundViews.reduce((total, entry) => total + entry.points, 0),
    [foundViews]
  );
  const coreScore = useMemo(
    () =>
      foundViews
        .filter((entry) => entry.kind === 'core')
        .reduce((total, entry) => total + entry.points, 0),
    [foundViews]
  );
  const foundSweeps = useMemo(
    () => foundWords.filter((word) => puzzle.sweeps.includes(word)).length,
    [foundWords, puzzle.sweeps]
  );
  const rank = useMemo(
    () => getKilterRank(coreScore, puzzle.availableCoreScore, foundSweeps > 0),
    [coreScore, foundSweeps, puzzle.availableCoreScore]
  );
  const foundBonusWords = useMemo(
    () => foundViews.filter((entry) => entry.kind === 'bonus'),
    [foundViews]
  );
  const missedSweeps = useMemo(
    () => puzzle.sweeps.filter((word) => !foundWords.includes(word)),
    [foundWords, puzzle.sweeps]
  );
  const isClockUrgent = phase === 'playing' && remainingSeconds <= 60;
  const shareText = useMemo(
    () =>
      formatKilterShareText({
        puzzle,
        score,
        foundWords,
        foundSweeps,
        url: shareUrl,
      }),
    [foundSweeps, foundWords, puzzle, score, shareUrl]
  );
  const requiredGroupWidth = puzzle.key.length * REQUIRED_TILE_WIDTH;
  const requiredGroupLeft = (LETTER_BOARD_WIDTH - requiredGroupWidth) / 2;
  const looseLetterPositions = useMemo(
    () => getLooseLetterPositions(requiredGroupLeft, requiredGroupWidth),
    [requiredGroupLeft, requiredGroupWidth]
  );

  const finishGame = useCallback(
    (countGlobalPlay: boolean) => {
      setPhase('ended');
      setCurrentWord('');
      setRemainingSeconds(0);
      const storage = getStorage();
      storage?.setItem(`${STORAGE_PREFIX}:daily:${puzzle.date}`, '1');
      if (countGlobalPlay && !hasCountedRef.current) {
        hasCountedRef.current = true;
        incrementGlobalPlayCount('kilter');
      }
    },
    [puzzle.date]
  );

  useEffect(() => {
    const checkDateRollover = () => {
      setTodayKey((current) => {
        const next = getLocalKilterDateKey();
        return current === next ? current : next;
      });
    };
    checkDateRollover();
    const intervalId = setInterval(checkDateRollover, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const storage = getStorage();
    setStatusMessage(null);
    setFeedbackTone('neutral');
    setShareStatus(null);
    setCurrentWord('');
    hasCountedRef.current = false;

    const fallback = () => {
      setPhase('intro');
      setFoundWords([]);
      setStartedAtMs(null);
      setRemainingSeconds(KILTER_GAME_SECONDS);
      setLooseLetters(puzzle.letters);
      setLoaded(true);
    };

    if (!storage) {
      fallback();
      return;
    }

    const raw = storage.getItem(`${STORAGE_PREFIX}:state:${puzzle.date}`);
    if (!raw) {
      fallback();
      return;
    }

    try {
      const saved = JSON.parse(raw) as Partial<SavedKilterState>;
      if (saved.puzzleId !== puzzle.id) {
        fallback();
        return;
      }
      const nextFoundWords = (saved.foundWords ?? []).filter(
        (word) => puzzle.coreWords.includes(word) || puzzle.bonusWords.includes(word)
      );
      const savedPhase: KilterPhase =
        saved.phase === 'playing' || saved.phase === 'ended' ? saved.phase : 'intro';
      const savedStartedAt = typeof saved.startedAtMs === 'number' ? saved.startedAtMs : null;
      const nextLooseLetters =
        Array.isArray(saved.looseLetters) && saved.looseLetters.length === puzzle.letters.length
          ? saved.looseLetters.filter((letter) => puzzle.letters.includes(letter))
          : puzzle.letters;

      setFoundWords(nextFoundWords);
      setStartedAtMs(savedStartedAt);
      setLooseLetters(
        nextLooseLetters.length === puzzle.letters.length ? nextLooseLetters : puzzle.letters
      );

      if (savedPhase === 'playing' && isKilterTimeUp(savedStartedAt, Date.now())) {
        setPhase('ended');
        setRemainingSeconds(0);
        storage.setItem(`${STORAGE_PREFIX}:daily:${puzzle.date}`, '1');
      } else {
        setPhase(savedPhase);
        setRemainingSeconds(getKilterRemainingSeconds(savedStartedAt, Date.now()));
      }
      setLoaded(true);
    } catch {
      fallback();
    }
  }, [puzzle]);

  useEffect(() => {
    if (!isLoaded) return;
    const storage = getStorage();
    if (!storage) return;
    const saved: SavedKilterState = {
      puzzleId: puzzle.id,
      phase,
      foundWords,
      startedAtMs,
      looseLetters,
    };
    storage.setItem(`${STORAGE_PREFIX}:state:${puzzle.date}`, JSON.stringify(saved));
  }, [foundWords, isLoaded, looseLetters, phase, puzzle.date, puzzle.id, startedAtMs]);

  useEffect(() => {
    if (phase !== 'playing' || startedAtMs === null) return;
    const tick = () => {
      const nextRemaining = getKilterRemainingSeconds(startedAtMs, Date.now());
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        finishGame(true);
      }
    };
    tick();
    const intervalId = setInterval(tick, 250);
    return () => clearInterval(intervalId);
  }, [finishGame, phase, startedAtMs]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  const triggerWordMotion = useCallback(
    (tone: FeedbackTone) => {
      setFeedbackTone(tone);
      if (prefersReducedMotion()) return;

      wordScale.stopAnimation();
      wordShift.stopAnimation();
      wordScale.setValue(1);
      wordShift.setValue(0);

      if (tone === 'invalid') {
        Animated.sequence([
          Animated.timing(wordShift, {
            toValue: -7,
            duration: 55,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wordShift, {
            toValue: 6,
            duration: 65,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wordShift, {
            toValue: -3,
            duration: 55,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wordShift, {
            toValue: 0,
            duration: 80,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
        return;
      }

      if (tone === 'valid' || tone === 'bonus' || tone === 'sweep') {
        Animated.sequence([
          Animated.timing(wordScale, {
            toValue: tone === 'sweep' ? 1.06 : 1.025,
            duration: 100,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(wordScale, {
            toValue: 1,
            duration: 150,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [wordScale, wordShift]
  );

  useEffect(() => {
    if (!sweepBurst) return;

    sweepScale.setValue(0.92);
    sweepOpacity.setValue(0);

    if (prefersReducedMotion()) {
      sweepScale.setValue(1);
      sweepOpacity.setValue(1);
      const timeoutId = setTimeout(() => {
        setSweepBurst(null);
      }, 900);
      return () => clearTimeout(timeoutId);
    }

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(sweepOpacity, {
          toValue: 1,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sweepScale, {
          toValue: 1.08,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(sweepScale, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(720),
      Animated.timing(sweepOpacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setSweepBurst(null);
      }
    });

    return () => animation.stop();
  }, [sweepBurst, sweepOpacity, sweepScale]);

  useEffect(() => {
    if (!isClockUrgent || prefersReducedMotion()) {
      timerPulse.stopAnimation();
      timerPulse.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(timerPulse, {
          toValue: 1.08,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(timerPulse, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [isClockUrgent, timerPulse]);

  const startGame = useCallback(() => {
    const now = Date.now();
    setStartedAtMs(now);
    setRemainingSeconds(KILTER_GAME_SECONDS);
    setPhase('playing');
    setStatusMessage(null);
    setFeedbackTone('neutral');
  }, []);

  const appendLetter = useCallback(
    (letter: string) => {
      if (phase !== 'playing') return;
      const normalized = letter.toUpperCase();
      if (!allowedLetters.has(normalized)) {
        setStatusMessage('Not in today\'s letters.');
        triggerWordMotion('invalid');
        return;
      }
      setStatusMessage(null);
      setFeedbackTone('neutral');
      setCurrentWord((word) =>
        word.length >= MAX_WORD_LENGTH ? word : `${word}${normalized}`
      );
    },
    [allowedLetters, phase, triggerWordMotion]
  );

  const deleteLetter = useCallback(() => {
    if (phase !== 'playing') return;
    setStatusMessage(null);
    setFeedbackTone('neutral');
    setCurrentWord((word) => word.slice(0, -1));
  }, [phase]);

  const submitWord = useCallback(() => {
    if (phase !== 'playing') return;
    const result = validateKilterGuess(currentWord, puzzle, foundWords);
    if (!result.ok) {
      setStatusMessage(result.message);
      triggerWordMotion('invalid');
      return;
    }
    setFoundWords((words) => [result.word, ...words]);
    setCurrentWord('');
    if (result.isSweep) {
      setStatusMessage(`Composed +${result.points}`);
      triggerWordMotion('sweep');
      setSweepBurst({
        id: Date.now(),
        word: result.word,
        points: result.points,
      });
    } else if (result.kind === 'bonus') {
      setStatusMessage('Bonus +1');
      triggerWordMotion('bonus');
    } else {
      setStatusMessage(`+${result.points}`);
      triggerWordMotion('valid');
    }
  }, [currentWord, foundWords, phase, puzzle, triggerWordMotion]);

  const shuffleLooseLetters = useCallback(() => {
    if (phase !== 'playing') return;
    setFeedbackTone('neutral');
    setLooseLetters((letters) => shuffleLetters(letters));
  }, [phase]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        submitWord();
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        deleteLetter();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        setCurrentWord('');
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        appendLetter(event.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appendLetter, deleteLetter, submitWord]);

  const handleShareResults = useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Share.share({ message: shareText });
        setShareStatus('Share sheet opened');
      } catch {
        setShareStatus('Share failed');
      }
      return;
    }

    const clipboard = (globalThis as typeof globalThis & {
      navigator?: { clipboard?: { writeText?: (text: string) => Promise<void> } };
    }).navigator?.clipboard;
    if (!clipboard?.writeText) {
      setShareStatus('Copy not supported');
      return;
    }
    try {
      await clipboard.writeText(shareText);
      setShareStatus('Copied to clipboard');
    } catch {
      setShareStatus('Copy failed');
    }
  }, [shareText]);

  const renderLooseLetterButton = (
    letter: string,
    id: string,
    position: LetterPosition
  ) => (
    <Pressable
      key={id}
      testID={`kilter-letter-${id}`}
      accessibilityRole="button"
      accessibilityLabel={`Add ${letter}`}
      disabled={phase !== 'playing'}
      style={({ pressed }) => [
        styles.looseLetterButton,
        { left: position.left, top: position.top },
        phase !== 'playing' && styles.letterButtonDisabled,
        pressed && phase === 'playing' && styles.letterButtonPressed,
      ]}
      onPress={() => appendLetter(letter)}
    >
      <Text style={styles.looseLetterButtonText}>{letter}</Text>
    </Pressable>
  );

  const renderKeyLetterButton = (
    letter: string,
    index: number,
    total: number,
    requiredLeft: number
  ) => {
    const id = `required-${letter}-${index}`;
    return (
    <Pressable
      key={id}
      testID={`kilter-letter-${id}`}
	      accessibilityRole="button"
	      accessibilityLabel={`Add green letter ${letter}`}
	      disabled={phase !== 'playing'}
	      style={({ pressed }) => [
	        styles.keyLetterButton,
	        { left: requiredLeft + index * REQUIRED_TILE_WIDTH, top: REQUIRED_ROW_Y },
	        index === 0 && styles.keyLetterButtonFirst,
	        index === total - 1 && styles.keyLetterButtonLast,
	        total === 1 && styles.keyLetterButtonSingle,
	        phase !== 'playing' && styles.letterButtonDisabled,
	        pressed && phase === 'playing' && styles.keyLetterButtonPressed,
      ]}
      onPress={() => appendLetter(letter)}
    >
      <Text style={styles.keyLetterButtonText}>{letter}</Text>
    </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Composed' }} />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.page}>
            {phase === 'intro' ? (
              <View style={styles.introCard}>
                <View style={styles.introMetaRow}>
                  <Text style={styles.introEyebrow}>Today's game</Text>
                  <View style={styles.introDatePill}>
                    <Text style={styles.introDateText}>{dateLabel}</Text>
                  </View>
                </View>
                <Text style={styles.introTitle}>Composed</Text>
                <View style={styles.instructionsBlock}>
                  <Text style={styles.instructionsTitle}>How to play</Text>
                  <Text style={styles.instructionsDeck}>
                    Build as many real words as you can before the clock runs out.
                  </Text>
                  <View style={styles.instructionsList}>
                    {INTRO_RULES.map((rule, index) => (
                      <View
                        key={rule.label}
                        style={[
                          styles.instructionRow,
                          index > 0 && styles.instructionRowDivider,
                        ]}
                      >
                        <View style={styles.instructionBadge}>
                          <Text style={styles.instructionBadgeText}>{rule.label}</Text>
                        </View>
                        <View style={styles.instructionCopy}>
                          <Text style={styles.instructionHeading}>{rule.title}</Text>
                          <Text style={styles.instructionsText}>{rule.body}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
                <Pressable
                  testID="kilter-start"
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.startButton,
                    pressed && styles.startButtonPressed,
                  ]}
                  onPress={startGame}
                >
                  <View style={styles.primaryButtonContent}>
                    <Play size={17} strokeWidth={2.5} color={theme.colors.white} />
                    <Text style={styles.startButtonText}>Start</Text>
                  </View>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.headerRow}>
                  <View>
                    <Text style={styles.title}>Composed</Text>
                    <Text style={styles.dateText}>{dateLabel}</Text>
                  </View>
                  {phase === 'playing' ? (
                    <Animated.View
                      style={[
                        styles.timerPill,
                        isClockUrgent && styles.timerPillHot,
                        { transform: [{ scale: timerPulse }] },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timerText,
                          isClockUrgent && styles.timerTextUrgent,
                        ]}
                      >
                        {formatSeconds(remainingSeconds)}
                      </Text>
                    </Animated.View>
                  ) : (
                    <View style={styles.finalPill}>
                      <Text style={styles.finalPillText}>Final</Text>
                    </View>
                  )}
                </View>

                {phase === 'playing' ? (
                  <>
                    <View style={styles.statRail}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Score</Text>
                        <Text style={styles.statValue}>{score}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Form</Text>
                        <Text style={styles.statValue}>
                          {rank.tier}/{KILTER_RANK_COUNT}
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Sweep</Text>
                        <Text style={styles.statValue}>
                          {foundSweeps}/{puzzle.sweeps.length}
                        </Text>
                      </View>
                    </View>

                    <View testID="kilter-play-surface" style={styles.playSurface}>
                      {sweepBurst ? (
                        <Animated.View
                          pointerEvents="none"
                          style={[
                            styles.sweepBurst,
                            {
                              opacity: sweepOpacity,
                              transform: [{ scale: sweepScale }],
                            },
                          ]}
                        >
                          <View style={styles.sweepBurstRing} />
                          <Text style={styles.sweepBurstTitle}>Composed</Text>
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={styles.sweepBurstWord}
                          >
                            {sweepBurst.word}
                          </Text>
                          <Text style={styles.sweepBurstPoints}>+{sweepBurst.points}</Text>
                        </Animated.View>
                      ) : null}

                      <Animated.View
                        testID="kilter-word-stage"
                        style={[
                          styles.wordStage,
                          {
                            transform: [{ translateX: wordShift }, { scale: wordScale }],
                          },
                        ]}
                      >
                        {currentWord ? (
                          <Text
                            selectable
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            accessibilityLabel={`Current word ${currentWord}`}
                            style={styles.wordStageText}
                          >
                            {currentWord}
                          </Text>
                        ) : (
                          <View accessibilityLabel="No current word" style={styles.wordStageBlank} />
                        )}
                      </Animated.View>

                      <View style={styles.statusSlot}>
                        {statusMessage ? (
                          <Text
                            style={[
                              styles.statusText,
                              feedbackTone === 'invalid' && styles.statusTextInvalid,
                              feedbackTone === 'valid' && styles.statusTextValid,
                              feedbackTone === 'bonus' && styles.statusTextBonus,
                              feedbackTone === 'sweep' && styles.statusTextSweep,
                            ]}
                          >
                            {statusMessage}
                          </Text>
                        ) : null}
                      </View>

                      <View style={styles.letterStageSlot}>
                        <View
                          testID="kilter-letter-stage"
                          style={styles.letterStage}
                        >
                          <View
                            testID="kilter-required-group"
                            pointerEvents="none"
                            style={[
                              styles.requiredGroupMarker,
                              {
                                left: requiredGroupLeft,
                                top: REQUIRED_ROW_Y,
                                width: requiredGroupWidth,
                              },
                            ]}
                          />
                          {looseLetters.slice(0, 3).map((letter, index) =>
                            renderLooseLetterButton(
                              letter,
                              `loose-top-${index}`,
                              looseLetterPositions.top[index] ?? looseLetterPositions.top[0]!
                            )
                          )}
                          {puzzle.key
                            .split('')
                            .map((letter, index, letters) =>
                              renderKeyLetterButton(letter, index, letters.length, requiredGroupLeft)
                            )}
                          {looseLetters.slice(3, 6).map((letter, index) =>
                            renderLooseLetterButton(
                              letter,
                              `loose-bottom-${index}`,
                              looseLetterPositions.bottom[index] ?? looseLetterPositions.bottom[0]!
                            )
                          )}
                        </View>
                      </View>

                      <View style={styles.controlRow}>
                        <Pressable
                          testID="kilter-delete"
                          accessibilityRole="button"
                          disabled={phase !== 'playing'}
                          style={({ pressed }) => [
                            styles.controlButton,
                            pressed && styles.controlButtonPressed,
                          ]}
                          onPress={deleteLetter}
                        >
                          <View style={styles.controlButtonContent}>
                            <Delete size={16} strokeWidth={2.3} color={theme.colors.textSecondary} />
                            <Text style={styles.controlButtonText}>Delete</Text>
                          </View>
                        </Pressable>
                        <Pressable
                          testID="kilter-shuffle"
                          accessibilityRole="button"
                          disabled={phase !== 'playing'}
                          style={({ pressed }) => [
                            styles.controlButton,
                            pressed && styles.controlButtonPressed,
                          ]}
                          onPress={shuffleLooseLetters}
                        >
                          <View style={styles.controlButtonContent}>
                            <Shuffle size={16} strokeWidth={2.3} color={theme.colors.textSecondary} />
                            <Text style={styles.controlButtonText}>Shuffle</Text>
                          </View>
                        </Pressable>
                        <Pressable
                          testID="kilter-enter"
                          accessibilityRole="button"
                          disabled={phase !== 'playing'}
                          style={({ pressed }) => [
                            styles.enterButton,
                            pressed && styles.enterButtonPressed,
                          ]}
                          onPress={submitWord}
                        >
                          <View style={styles.controlButtonContent}>
                            <Check size={17} strokeWidth={2.6} color={theme.colors.white} />
                            <Text style={styles.enterButtonText}>Enter</Text>
                          </View>
                        </Pressable>
                      </View>

                      <Pressable
                        testID="kilter-finish"
                        accessibilityRole="button"
                        style={({ pressed }) => [
                          styles.finishButton,
                          pressed && styles.finishButtonPressed,
                        ]}
                        onPress={() => finishGame(true)}
                      >
                        <Text style={styles.finishButtonText}>Finish</Text>
                      </Pressable>
                    </View>

                    <View style={styles.foundPanel}>
                      <View style={styles.foundHeader}>
                        <Text style={styles.sectionTitle}>Found</Text>
                        <Text style={styles.sectionMeta}>
                          {foundWords.length} found - {puzzle.coreWords.length} core
                        </Text>
                      </View>
                      {foundViews.length === 0 ? (
                        <Text style={styles.emptyFound}>No words yet.</Text>
                      ) : (
                        <View style={styles.foundList}>
                          {foundViews.slice(0, 48).map((entry) => (
                            <View key={entry.word} style={styles.foundRow}>
                              <Text style={styles.foundWord}>{entry.word}</Text>
                              <Text
                                style={[
                                  styles.foundPoints,
                                  entry.kind === 'bonus' && styles.foundBonus,
                                  entry.isSweep && styles.foundSweep,
                                ]}
                              >
                                {entry.kind === 'bonus' ? 'Bonus +1' : `+${entry.points}`}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <View style={styles.resultCard}>
                    <Text style={styles.resultEyebrow}>Final</Text>
                    <Text style={styles.resultTitle}>{rank.name}</Text>
                    <Text style={styles.resultMeta}>
                      {score} points - {foundWords.length} words - {rank.percent}% core score
                    </Text>
                    <View style={styles.revealBlock}>
                      <Text style={styles.revealLabel}>Found Words</Text>
                      <Text style={styles.revealWords}>
                        {foundWords.length ? foundWords.join(', ') : 'None'}
                      </Text>
                    </View>
                    <View style={styles.revealBlock}>
                      <Text style={styles.revealLabel}>Missed Sweep</Text>
                      <Text style={styles.revealWords}>
                        {missedSweeps.length ? missedSweeps.join(', ') : 'None'}
                      </Text>
                    </View>
                    <View style={styles.revealBlock}>
                      <Text style={styles.revealLabel}>Core Words</Text>
                      <Text style={styles.revealWords}>
                        {foundViews.filter((entry) => entry.kind === 'core').length}/
                        {puzzle.coreWords.length}
                      </Text>
                    </View>
                    {foundBonusWords.length ? (
                      <View style={styles.revealBlock}>
                        <Text style={styles.revealLabel}>Bonus Found</Text>
                        <Text style={styles.revealWords}>
                          {foundBonusWords.map((entry) => entry.word).join(', ')}
                        </Text>
                      </View>
                    ) : null}

                    <View style={styles.shareCard}>
                      <Text style={styles.shareTitle}>Share</Text>
                      <View style={styles.shareBox}>
                        <Text selectable style={styles.shareText}>
                          {shareText}
                        </Text>
                      </View>
                      {Platform.OS === 'web' ? (
                        <Pressable
                          testID="kilter-share"
                          accessibilityRole="button"
                          style={({ pressed }) => [
                            styles.shareButton,
                            pressed && styles.shareButtonPressed,
                          ]}
                          onPress={handleShareResults}
                        >
                          <View style={styles.primaryButtonContent}>
                            <Copy size={16} strokeWidth={2.5} color={theme.colors.white} />
                            <Text style={styles.shareButtonText}>Copy Results</Text>
                          </View>
                        </Pressable>
                      ) : (
                        <Pressable
                          testID="kilter-share"
                          accessibilityRole="button"
                          style={({ pressed }) => [
                            styles.shareButton,
                            pressed && styles.shareButtonPressed,
                          ]}
                          onPress={handleShareResults}
                        >
                          <View style={styles.primaryButtonContent}>
                            <Share2 size={16} strokeWidth={2.5} color={theme.colors.white} />
                            <Text style={styles.shareButtonText}>Share Results</Text>
                          </View>
                        </Pressable>
                      )}
                      {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                      ]}
                      onPress={() => router.back()}
                    >
                      <View style={styles.backButtonContent}>
                        <ArrowLeft size={15} strokeWidth={2.4} color={theme.colors.textSecondary} />
                        <Text style={styles.backButtonText}>Back to games</Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const createStyles = (
  theme: ThemeTokens,
  screenAccent: ReturnType<typeof resolveScreenAccent>
) => {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
	  const FontSize = theme.fontSize;
	  const BorderRadius = theme.borderRadius;
	  const ui = createDaybreakPrimitives(theme, screenAccent);
	  const danger = theme.mode === 'dark' ? '#ff8a76' : '#c73a26';
	  const material = theme.mode === 'dark' ? 'rgba(21, 28, 38, 0.76)' : 'rgba(255, 255, 255, 0.78)';
	  const materialStrong = theme.mode === 'dark' ? 'rgba(27, 36, 48, 0.9)' : 'rgba(255, 255, 255, 0.92)';
	  const pressedOverlay = theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(11, 11, 11, 0.05)';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: Spacing.xxl,
    },
	    page: {
	      ...ui.page,
	      gap: 12,
	    },
	    introCard: {
	      padding: 22,
	      gap: Spacing.lg,
	      borderRadius: 24,
	      borderWidth: 1,
	      borderColor: Colors.line,
	      backgroundColor: materialStrong,
	      ...theme.shadows.glass,
	    },
	    introMetaRow: {
	      flexDirection: 'row',
	      alignItems: 'center',
	      justifyContent: 'space-between',
	      gap: Spacing.md,
	    },
	    introEyebrow: {
	      color: screenAccent.main,
	      fontSize: 11,
	      fontWeight: '900',
	      textTransform: 'uppercase',
	      letterSpacing: 0,
	    },
	    introDatePill: {
	      borderRadius: BorderRadius.full,
	      borderWidth: 1,
	      borderColor: Colors.line,
	      backgroundColor: material,
	      paddingHorizontal: Spacing.md,
	      paddingVertical: 7,
	    },
	    introDateText: {
	      color: Colors.textSecondary,
	      fontSize: FontSize.sm,
	      fontWeight: '800',
	    },
	    introTitle: {
	      color: Colors.text,
	      fontSize: 42,
	      fontWeight: '900',
	    },
	    instructionsBlock: {
	      gap: 10,
	    },
	    instructionsTitle: {
	      color: Colors.text,
	      fontSize: FontSize.lg,
	      fontWeight: '900',
	    },
    instructionsDeck: {
      color: Colors.textSecondary,
      fontSize: FontSize.md,
      fontWeight: '700',
      lineHeight: 21,
    },
    instructionsList: {
      marginTop: 2,
      borderTopWidth: 1,
      borderTopColor: Colors.line,
    },
    instructionRow: {
      flexDirection: 'row',
      gap: 12,
      paddingVertical: 12,
    },
    instructionRowDivider: {
      borderTopWidth: 1,
      borderTopColor: Colors.line,
    },
    instructionBadge: {
      width: 28,
      height: 28,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: screenAccent.badgeBg,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    instructionBadgeText: {
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: '900',
      fontVariant: ['tabular-nums'],
    },
    instructionCopy: {
      flex: 1,
      gap: 3,
    },
    instructionHeading: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
	    instructionsText: {
	      color: Colors.textSecondary,
	      fontSize: FontSize.sm,
	      fontWeight: '700',
	      lineHeight: 19,
	    },
	    headerRow: {
	      flexDirection: 'row',
	      justifyContent: 'space-between',
	      alignItems: 'center',
      gap: Spacing.md,
      paddingHorizontal: 2,
    },
    title: {
      fontSize: 34,
      fontWeight: '900',
      color: Colors.text,
    },
    dateText: {
      marginTop: 2,
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '600',
    },
    timerPill: {
      ...ui.pill,
      minWidth: 76,
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: materialStrong,
    },
    timerPillHot: {
      borderColor: danger,
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 138, 118, 0.14)' : '#fff0ed',
    },
	    timerText: {
	      color: Colors.text,
	      fontSize: FontSize.lg,
	      fontWeight: '900',
	      fontVariant: ['tabular-nums'],
	    },
    timerTextUrgent: {
      color: danger,
    },
	    finalPill: {
	      ...ui.pill,
	      minWidth: 76,
	      alignItems: 'center',
	      paddingVertical: 8,
	      backgroundColor: materialStrong,
	    },
	    finalPillText: {
	      color: screenAccent.main,
	      fontSize: FontSize.sm,
	      fontWeight: '900',
	      textTransform: 'uppercase',
	      letterSpacing: 0,
	    },
    statRail: {
      paddingVertical: 11,
      paddingHorizontal: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.sm,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: material,
      ...theme.shadows.glass,
    },
    statItem: {
      flex: 1,
    },
    statLabel: {
      color: Colors.textMuted,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    statValue: {
      marginTop: 4,
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
    },
	    playSurface: {
	      position: 'relative',
	      overflow: 'hidden',
	      paddingTop: 10,
	      paddingBottom: 16,
	      paddingHorizontal: 14,
	      gap: 7,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: materialStrong,
      ...theme.shadows.glass,
    },
    sweepBurst: {
      position: 'absolute',
      top: 22,
      left: 18,
      right: 18,
      zIndex: 4,
      minHeight: 116,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: theme.mode === 'dark' ? 'rgba(20, 52, 49, 0.94)' : 'rgba(245, 253, 251, 0.96)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
      ...theme.shadows.elevated,
    },
    sweepBurstRing: {
      position: 'absolute',
      width: 92,
      height: 92,
      borderRadius: 46,
      borderWidth: 2,
      borderColor: screenAccent.glow,
      opacity: 0.72,
    },
    sweepBurstTitle: {
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    sweepBurstWord: {
      marginTop: 4,
      color: Colors.text,
      fontSize: 30,
      fontWeight: '900',
      textAlign: 'center',
      width: '100%',
    },
    sweepBurstPoints: {
      marginTop: 2,
      color: Colors.textSecondary,
      fontSize: FontSize.md,
      fontWeight: '900',
    },
	    wordStage: {
	      minHeight: 56,
	      alignItems: 'center',
	      justifyContent: 'flex-end',
	      paddingTop: 0,
	      paddingBottom: 2,
	      paddingHorizontal: Spacing.sm,
	    },
    wordStageText: {
      color: Colors.text,
      fontSize: 34,
      fontWeight: '900',
      textAlign: 'center',
      width: '100%',
    },
	    wordStageBlank: {
	      minHeight: 30,
	      width: '100%',
	    },
    letterStageSlot: {
      minHeight: 313,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
	    letterStage: {
	      position: 'relative',
	      alignItems: 'center',
	      alignSelf: 'center',
	      width: LETTER_BOARD_WIDTH,
      height: LETTER_BOARD_HEIGHT,
	      marginTop: 0,
	      marginBottom: 0,
	    },
	    requiredGroupMarker: {
	      position: 'absolute',
	      height: REQUIRED_TILE_HEIGHT,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.main,
      ...theme.shadows.card,
	    },
    looseLetterButton: {
      ...WEB_NO_SELECT,
      position: 'absolute',
      width: LOOSE_TILE_SIZE,
      height: LOOSE_TILE_SIZE,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.card,
    },
	    keyLetterButton: {
	      ...WEB_NO_SELECT,
	      position: 'absolute',
	      zIndex: 1,
	      width: REQUIRED_TILE_WIDTH,
	      height: REQUIRED_TILE_HEIGHT,
	      backgroundColor: 'transparent',
	      borderColor: 'transparent',
	      borderWidth: 1,
	      alignItems: 'center',
	      justifyContent: 'center',
	    },
	    keyLetterButtonFirst: {
	      borderTopLeftRadius: 14,
	      borderBottomLeftRadius: 14,
	    },
	    keyLetterButtonLast: {
	      borderTopRightRadius: 14,
	      borderBottomRightRadius: 14,
	    },
	    keyLetterButtonSingle: {
	      borderRadius: 14,
	    },
    letterButtonPressed: {
      transform: [{ scale: 0.95 }],
      backgroundColor: pressedOverlay,
    },
    keyLetterButtonPressed: {
      transform: [{ scale: 0.97 }],
      backgroundColor: theme.mode === 'dark' ? '#397c77' : '#244f4b',
    },
    letterButtonDisabled: {
      opacity: 0.55,
    },
    looseLetterButtonText: {
      color: Colors.text,
      fontSize: 22,
      fontWeight: '900',
    },
    keyLetterButtonText: {
      color: Colors.white,
      fontSize: 22,
      fontWeight: '900',
    },
    controlRow: {
      flexDirection: 'row',
      gap: 9,
      paddingHorizontal: 2,
      marginTop: 2,
    },
    controlButton: {
      ...WEB_NO_SELECT,
      flex: 0.9,
      minHeight: 44,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.sm,
    },
    controlButtonPressed: {
      backgroundColor: pressedOverlay,
      transform: [{ scale: 0.98 }],
    },
    controlButtonDisabled: {
      opacity: 0.5,
    },
    controlButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    enterButton: {
      ...WEB_NO_SELECT,
      flex: 1.15,
      minHeight: 44,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.main,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.sm,
    },
    enterButtonPressed: {
      transform: [{ scale: 0.98 }],
      backgroundColor: theme.mode === 'dark' ? '#397c77' : '#244f4b',
    },
    enterButtonText: {
      color: Colors.white,
      fontSize: FontSize.sm,
      fontWeight: '900',
    },
    controlButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    primaryButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
    },
	    statusSlot: {
	      minHeight: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '700',
      textAlign: 'center',
    },
    statusTextInvalid: {
      color: danger,
    },
    statusTextValid: {
      color: screenAccent.main,
    },
    statusTextBonus: {
      color: screenAccent.badgeText,
    },
    statusTextSweep: {
      color: screenAccent.main,
    },
	    startButton: {
	      ...ui.cta,
	      minWidth: 180,
	      backgroundColor: screenAccent.main,
	    },
    startButtonPressed: {
      transform: [{ scale: 0.98 }],
      backgroundColor: theme.mode === 'dark' ? '#397c77' : '#244f4b',
    },
    startButtonText: {
      ...ui.ctaText,
    },
    finishButton: {
      alignSelf: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    finishButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    finishButtonText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '700',
    },
    foundPanel: {
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: material,
    },
    foundHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.sm,
    },
    sectionTitle: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '900',
    },
    sectionMeta: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    emptyFound: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '600',
    },
    foundList: {
      gap: 0,
    },
    foundRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: Colors.line,
      paddingVertical: 8,
    },
    foundWord: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '900',
      letterSpacing: 0,
    },
    foundPoints: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
    foundBonus: {
      color: screenAccent.badgeText,
    },
    foundSweep: {
      color: screenAccent.main,
    },
    resultCard: {
      padding: 18,
      gap: Spacing.md,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: materialStrong,
      ...theme.shadows.glass,
    },
    resultEyebrow: {
      color: screenAccent.main,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
    resultTitle: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '900',
    },
    resultMeta: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '700',
    },
    revealBlock: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: material,
      padding: Spacing.md,
      gap: 4,
    },
    revealLabel: {
      color: Colors.textMuted,
      fontSize: 11,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    revealWords: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '800',
      lineHeight: 20,
    },
    shareCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: material,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    shareTitle: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 0,
    },
    shareBox: {
      backgroundColor: Colors.backgroundSoft,
      borderRadius: 12,
      padding: Spacing.md,
    },
    shareText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      lineHeight: 19,
      fontWeight: '600',
    },
    shareButton: {
      ...ui.cta,
      borderRadius: 14,
      paddingVertical: Spacing.sm,
      backgroundColor: screenAccent.main,
    },
    shareButtonPressed: {
      transform: [{ scale: 0.98 }],
      backgroundColor: theme.mode === 'dark' ? '#397c77' : '#244f4b',
    },
    shareButtonText: {
      ...ui.ctaText,
    },
    shareStatus: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      textAlign: 'center',
      fontWeight: '700',
    },
    backButton: {
      alignSelf: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: 14,
    },
    backButtonPressed: {
      backgroundColor: pressedOverlay,
    },
    backButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    backButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '800',
    },
  });
};
