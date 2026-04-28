import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Linking,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, Stack, useRouter } from 'expo-router';
import { resolveScreenAccent, useDaybreakTheme } from '../src/constants/theme';
import { BUILD_ID } from '../src/constants/build';
import {
  formatTriviaShareText,
  getTodayTriviaEpisode,
  getTriviaFeedSummary,
  getTriviaLocalDateKey,
  type TriviaDifficulty,
  type TriviaEpisode,
  type TriviaFeed,
  type TriviaRunAnswer,
  type TriviaRunResult,
} from '../src/data/trivia';
import { canArmShield, resolveShieldAfterQuestion } from '../src/data/trivia/gameplay';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';
import {
  createTriviaStyles,
  TriviaFinalStretchOverlay,
  TriviaIntroSurface,
  TriviaPageHeader,
  TriviaQuestionSurface,
  TriviaResultsSurface,
} from '../src/ui/trivia/TriviaSurfaces';

const STORAGE_PREFIX = 'trivia';
const BASE_POINTS = 100;
const SPEED_BONUS = 50;
const SHIELD_POINTS = 50;
const QUESTION_ENTRY_MS = 220;
const REVEAL_ENTRY_MS = 180;
const OVERLAY_ENTRY_MS = 240;
const REVEAL_DELAY_MS = 1350;
const FINAL_STRETCH_DELAY_MS = 1500;

type ScreenMode = 'start' | 'question' | 'transition' | 'reveal' | 'results';

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function isTriviaDifficulty(value: string | null): value is TriviaDifficulty {
  return value === 'easy' || value === 'hard';
}

function getFeedRouteTitle(feed: TriviaFeed): string {
  return feed === 'mix' ? 'Daily Mix' : 'Daily Sports';
}

function getGlobalPlayCountKey(feed: TriviaFeed): string {
  return feed === 'mix' ? 'trivia-mix' : 'trivia-sports';
}

function formatLocalDateLabel(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTimerSeconds(episode: TriviaEpisode): number {
  return episode.timerSeconds;
}

function buildRunStorageKey(feed: TriviaFeed, difficulty: TriviaDifficulty, dateKey: string): string {
  return `${STORAGE_PREFIX}:run:${feed}:${difficulty}:${dateKey}`;
}

function buildDifficultyChoiceKey(
  feed: TriviaFeed,
  dateKey: string
): string {
  return `${STORAGE_PREFIX}:${feed}:choice:${dateKey}`;
}

function buildDifficultyCompletionKey(
  feed: TriviaFeed,
  difficulty: TriviaDifficulty,
  dateKey: string
): string {
  return `${STORAGE_PREFIX}:${feed}:${difficulty}:daily:${dateKey}`;
}

function buildGameCompletionKey(feed: TriviaFeed, dateKey: string): string {
  return `${STORAGE_PREFIX}:${feed}:daily:${dateKey}`;
}

export function TriviaGameScreen({ feed }: { feed: TriviaFeed }) {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('trivia', theme), [theme]);
  const styles = useMemo(() => createTriviaStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const todayKey = getTriviaLocalDateKey();

  const [selectedDifficulty, setSelectedDifficulty] = useState<TriviaDifficulty>('hard');
  const [screenMode, setScreenMode] = useState<ScreenMode>('start');
  const [activeEpisode, setActiveEpisode] = useState<TriviaEpisode | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [answers, setAnswers] = useState<TriviaRunAnswer[]>([]);
  const [shieldAvailable, setShieldAvailable] = useState(true);
  const [shieldArmed, setShieldArmed] = useState(false);
  const [shieldQuestionsUsed, setShieldQuestionsUsed] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCountedRef = useRef(false);

  const surfaceOpacity = useRef(new Animated.Value(1)).current;
  const surfaceTranslateY = useRef(new Animated.Value(0)).current;
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const questionTranslateY = useRef(new Animated.Value(0)).current;
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const revealTranslateY = useRef(new Animated.Value(8)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayCardOpacity = useRef(new Animated.Value(0)).current;
  const overlayCardTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const storage = getStorage();
    if (!storage) {
      setSelectedDifficulty('hard');
      return;
    }
    const savedDifficulty = storage.getItem(buildDifficultyChoiceKey(feed, todayKey));
    setSelectedDifficulty(isTriviaDifficulty(savedDifficulty) ? savedDifficulty : 'hard');
  }, [feed, todayKey]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    storage.setItem(buildDifficultyChoiceKey(feed, todayKey), selectedDifficulty);
  }, [feed, selectedDifficulty, todayKey]);

  const previewEpisode = useMemo(
    () => getTodayTriviaEpisode(feed, selectedDifficulty),
    [feed, selectedDifficulty]
  );
  const previewSummary = useMemo(
    () => getTriviaFeedSummary(feed, selectedDifficulty),
    [feed, selectedDifficulty]
  );
  const currentEpisode = activeEpisode ?? previewEpisode;
  const currentQuestion = activeEpisode?.questions[questionIndex] ?? null;
  const dateLabel = useMemo(() => formatLocalDateLabel(currentEpisode.date), [currentEpisode.date]);
  const currentTimerSeconds = useMemo(() => getTimerSeconds(currentEpisode), [currentEpisode]);
  const lastAnswer = answers[answers.length - 1] ?? null;

  const runResult = useMemo<TriviaRunResult | null>(() => {
    if (!activeEpisode || answers.length === 0) return null;
    const answerMarks = answers.map((answer) => {
      if (answer.shielded) return 'shielded';
      if (answer.correct) return 'correct';
      if (answer.timedOut) return 'timeout';
      return 'wrong';
    });
    const score = answers.reduce((total, answer) => total + answer.points, 0);
    const correctCount = answers.filter((answer) => answer.correct).length;
    const shieldUsed = answers.some((answer) => answer.shielded);
    const cleanRun =
      answers.length === activeEpisode.questionCount &&
      !shieldUsed &&
      answers.every((answer) => answer.correct);
    return {
      feed: activeEpisode.feed,
      difficulty: activeEpisode.difficulty,
      dateKey: activeEpisode.date,
      timerSeconds: activeEpisode.timerSeconds,
      score,
      correctCount,
      totalQuestions: activeEpisode.questionCount,
      shieldUsed,
      cleanRun,
      answerMarks,
    };
  }, [activeEpisode, answers]);

  const shareText = useMemo(() => {
    if (!runResult || !activeEpisode) return '';
    return formatTriviaShareText(runResult, activeEpisode, dateLabel);
  }, [activeEpisode, dateLabel, runResult]);

  const resetTimers = useCallback(() => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    transitionTimerRef.current = null;
    revealTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) {
        setReduceMotionEnabled(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled
    );
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${todayKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [todayKey]);

  useEffect(() => {
    if (screenMode !== 'start' && screenMode !== 'results') return;
    surfaceOpacity.stopAnimation();
    surfaceTranslateY.stopAnimation();
    if (reduceMotionEnabled) {
      surfaceOpacity.setValue(1);
      surfaceTranslateY.setValue(0);
      return;
    }
    surfaceOpacity.setValue(0);
    surfaceTranslateY.setValue(14);
    Animated.parallel([
      Animated.timing(surfaceOpacity, {
        toValue: 1,
        duration: QUESTION_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(surfaceTranslateY, {
        toValue: 0,
        duration: QUESTION_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [reduceMotionEnabled, screenMode, surfaceOpacity, surfaceTranslateY]);

  useEffect(() => {
    if (!activeEpisode) return;
    if (screenMode !== 'question' && screenMode !== 'transition') return;
    questionOpacity.stopAnimation();
    questionTranslateY.stopAnimation();
    if (reduceMotionEnabled) {
      questionOpacity.setValue(1);
      questionTranslateY.setValue(0);
      return;
    }
    questionOpacity.setValue(0);
    questionTranslateY.setValue(12);
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 1,
        duration: QUESTION_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: 0,
        duration: QUESTION_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    activeEpisode,
    questionIndex,
    questionOpacity,
    questionTranslateY,
    reduceMotionEnabled,
    screenMode,
  ]);

  useEffect(() => {
    if (screenMode !== 'reveal') {
      revealOpacity.setValue(0);
      revealTranslateY.setValue(8);
      return;
    }
    revealOpacity.stopAnimation();
    revealTranslateY.stopAnimation();
    if (reduceMotionEnabled) {
      revealOpacity.setValue(1);
      revealTranslateY.setValue(0);
      return;
    }
    revealOpacity.setValue(0);
    revealTranslateY.setValue(8);
    Animated.parallel([
      Animated.timing(revealOpacity, {
        toValue: 1,
        duration: REVEAL_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(revealTranslateY, {
        toValue: 0,
        duration: REVEAL_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [reduceMotionEnabled, revealOpacity, revealTranslateY, screenMode]);

  useEffect(() => {
    if (screenMode !== 'transition') {
      overlayOpacity.setValue(0);
      overlayCardOpacity.setValue(0);
      overlayCardTranslateY.setValue(12);
      return;
    }
    overlayOpacity.stopAnimation();
    overlayCardOpacity.stopAnimation();
    overlayCardTranslateY.stopAnimation();
    if (reduceMotionEnabled) {
      overlayOpacity.setValue(1);
      overlayCardOpacity.setValue(1);
      overlayCardTranslateY.setValue(0);
      return;
    }
    overlayOpacity.setValue(0);
    overlayCardOpacity.setValue(0);
    overlayCardTranslateY.setValue(12);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: OVERLAY_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayCardOpacity, {
        toValue: 1,
        duration: OVERLAY_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayCardTranslateY, {
        toValue: 0,
        duration: OVERLAY_ENTRY_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    overlayCardOpacity,
    overlayCardTranslateY,
    overlayOpacity,
    reduceMotionEnabled,
    screenMode,
  ]);

  const startRun = useCallback(() => {
    const nextEpisode = getTodayTriviaEpisode(feed, selectedDifficulty);
    resetTimers();
    setActiveEpisode(nextEpisode);
    setQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setShieldAvailable(true);
    setShieldArmed(false);
    setShieldQuestionsUsed(0);
    setShareStatus(null);
    setShowReview(false);
    setCountdown(getTimerSeconds(nextEpisode));
    setScreenMode('question');
    hasCountedRef.current = false;
  }, [feed, resetTimers, selectedDifficulty]);

  const advanceToNextQuestion = useCallback(
    (nextIndex: number) => {
      if (!activeEpisode) return;
      setQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShieldArmed(false);
      setCountdown(getTimerSeconds(activeEpisode));
      setScreenMode(nextIndex === activeEpisode.finalStretchStartsAt ? 'transition' : 'question');
    },
    [activeEpisode]
  );

  const advanceAfterReveal = useCallback(() => {
    if (!activeEpisode) return;
    const nextIndex = questionIndex + 1;
    if (nextIndex >= activeEpisode.questionCount) {
      setScreenMode('results');
      return;
    }
    advanceToNextQuestion(nextIndex);
  }, [activeEpisode, advanceToNextQuestion, questionIndex]);

  const resolveAnswer = useCallback(
    (optionIndex: number | null, timedOut: boolean) => {
      if (!activeEpisode || !currentQuestion) return;
      if (screenMode !== 'question') return;
      if (selectedOption !== null) return;

      const actualCorrect = !timedOut && optionIndex === currentQuestion.answerIndex;
      const shieldResolution = resolveShieldAfterQuestion({
        shieldArmed,
        shieldAvailable,
        shieldQuestionsUsed,
        actualCorrect,
      });
      const savedByShield = shieldResolution.savedByShield;
      const points = actualCorrect
        ? BASE_POINTS + Math.max(0, Math.round((countdown / currentTimerSeconds) * SPEED_BONUS))
        : savedByShield
          ? SHIELD_POINTS
          : 0;

      setSelectedOption(timedOut ? -1 : optionIndex);
      setShieldArmed(false);
      setShieldAvailable(shieldResolution.shieldAvailable);
      setShieldQuestionsUsed(shieldResolution.shieldQuestionsUsed);

      setAnswers((previous) => [
        ...previous,
        {
          questionId: currentQuestion.id,
          selectedOption: timedOut ? null : optionIndex,
          correct: actualCorrect,
          timedOut,
          shielded: savedByShield,
          points,
          timeRemaining: countdown,
          correctAnswerIndex: currentQuestion.answerIndex,
        },
      ]);
      setScreenMode('reveal');
    },
    [
      activeEpisode,
      countdown,
      currentQuestion,
      currentTimerSeconds,
      screenMode,
      selectedOption,
      shieldArmed,
      shieldAvailable,
      shieldQuestionsUsed,
    ]
  );

  const handleAnswer = useCallback(
    (optionIndex: number) => {
      resolveAnswer(optionIndex, false);
    },
    [resolveAnswer]
  );

  const handleTimeout = useCallback(() => {
    resolveAnswer(null, true);
  }, [resolveAnswer]);

  const toggleShield = useCallback(() => {
    if (!canArmShield(shieldAvailable, shieldQuestionsUsed)) return;
    if (screenMode !== 'question') return;
    setShieldArmed((previous) => !previous);
  }, [screenMode, shieldAvailable, shieldQuestionsUsed]);

  useEffect(() => {
    if (screenMode !== 'question') return;
    if (selectedOption !== null) return;
    if (countdown <= 0) {
      handleTimeout();
      return;
    }
    const intervalId = setInterval(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown, handleTimeout, screenMode, selectedOption]);

  useEffect(() => {
    if (screenMode !== 'transition') return;
    transitionTimerRef.current = setTimeout(() => {
      setScreenMode('question');
    }, FINAL_STRETCH_DELAY_MS);
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [screenMode]);

  useEffect(() => {
    if (screenMode !== 'reveal') return;
    revealTimerRef.current = setTimeout(() => {
      advanceAfterReveal();
    }, REVEAL_DELAY_MS);
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, [advanceAfterReveal, screenMode]);

  useEffect(() => {
    if (screenMode !== 'results' || !activeEpisode || !runResult) return;
    const storage = getStorage();
    if (storage) {
      storage.setItem(
        buildDifficultyCompletionKey(
          activeEpisode.feed,
          activeEpisode.difficulty,
          activeEpisode.date
        ),
        '1'
      );
      storage.setItem(buildGameCompletionKey(activeEpisode.feed, activeEpisode.date), '1');
      storage.setItem(
        buildRunStorageKey(activeEpisode.feed, activeEpisode.difficulty, activeEpisode.date),
        JSON.stringify(runResult)
      );
    }
  }, [activeEpisode, runResult, screenMode]);

  useEffect(() => {
    if (screenMode === 'results' && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount(getGlobalPlayCountKey(feed));
    }
  }, [feed, screenMode]);

  const handleCopyResults = useCallback(async () => {
    if (!shareText || Platform.OS !== 'web') return;
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

  const handleOpenCitation = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Ignore citation-open failures in static/web contexts.
    }
  }, []);

  const panelAnimatedStyle = {
    opacity: surfaceOpacity,
    transform: [{ translateY: surfaceTranslateY }],
  };

  const questionAnimatedStyle = {
    opacity: questionOpacity,
    transform: [{ translateY: questionTranslateY }],
  };

  const revealAnimatedStyle = {
    opacity: revealOpacity,
    transform: [{ translateY: revealTranslateY }],
  };

  const overlayBackdropAnimatedStyle = {
    opacity: overlayOpacity,
  };

  const overlayCardAnimatedStyle = {
    opacity: overlayCardOpacity,
    transform: [{ translateY: overlayCardTranslateY }],
  };

  return (
    <>
      <Stack.Screen options={{ title: getFeedRouteTitle(feed), headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <TriviaPageHeader
              dateLabel={dateLabel}
              difficulty={currentEpisode.difficulty}
              questionCount={currentEpisode.questionCount}
              styles={styles}
              title={currentEpisode.title}
            />

            {screenMode === 'start' ? (
              <Animated.View style={panelAnimatedStyle}>
                <TriviaIntroSurface
                  dateLabel={dateLabel}
                  feed={feed}
                  onSelectDifficulty={setSelectedDifficulty}
                  onStart={startRun}
                  previewEpisode={previewEpisode}
                  previewSummary={previewSummary}
                  selectedDifficulty={selectedDifficulty}
                  styles={styles}
                />
              </Animated.View>
            ) : null}

            {(screenMode === 'question' ||
              screenMode === 'reveal' ||
              screenMode === 'transition') &&
            activeEpisode &&
            currentQuestion ? (
              <TriviaQuestionSurface
                activeEpisode={activeEpisode}
                answers={answers}
                countdown={countdown}
                currentQuestion={currentQuestion}
                disabled={screenMode !== 'question'}
                lastAnswer={lastAnswer}
                onAnswer={handleAnswer}
                onToggleShield={toggleShield}
                questionAnimatedStyle={questionAnimatedStyle}
                questionIndex={questionIndex}
                revealAnimatedStyle={revealAnimatedStyle}
                revealVisible={screenMode === 'reveal'}
                screenMode={screenMode}
                selectedOption={selectedOption}
                shieldArmed={shieldArmed}
                shieldAvailable={shieldAvailable}
                shieldQuestionsUsed={shieldQuestionsUsed}
                showFinalStretchTag={
                  questionIndex >= activeEpisode.finalStretchStartsAt && screenMode !== 'transition'
                }
                styles={styles}
              />
            ) : null}

            {screenMode === 'results' && activeEpisode && runResult ? (
              <Animated.View style={panelAnimatedStyle}>
                <TriviaResultsSurface
                  activeEpisode={activeEpisode}
                  answers={answers}
                  buildId={BUILD_ID}
                  dateLabel={dateLabel}
                  onBack={() => router.replace('/')}
                  onCopy={handleCopyResults}
                  onOpenCitation={handleOpenCitation}
                  onToggleReview={() => setShowReview((previous) => !previous)}
                  runResult={runResult}
                  shareStatus={shareStatus}
                  shareText={shareText}
                  showReview={showReview}
                  styles={styles}
                />
              </Animated.View>
            ) : null}
          </View>
        </ScrollView>

        {screenMode === 'transition' && activeEpisode ? (
          <TriviaFinalStretchOverlay
            activeEpisode={activeEpisode}
            backdropAnimatedStyle={overlayBackdropAnimatedStyle}
            cardAnimatedStyle={overlayCardAnimatedStyle}
            styles={styles}
          />
        ) : null}
      </SafeAreaView>
    </>
  );
}

export default function TriviaRedirectScreen() {
  return <Redirect href="/daily-mix" />;
}
