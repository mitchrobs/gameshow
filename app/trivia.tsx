import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { BUILD_ID } from '../src/constants/build';
import {
  getDailyTriviaCategories,
  getTriviaQuestionPools,
  getTriviaCategory,
  TriviaQuestion,
  TriviaDifficulty,
} from '../src/data/triviaPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const QUESTION_COUNT = 8;
const TIME_PER_QUESTION = 12;
const STORAGE_PREFIX = 'trivia';

function getLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

type GameMode = 'choose' | 'quiz' | 'finished';

type QuestionPools = Record<TriviaDifficulty, TriviaQuestion[]>;

function clampDifficulty(value: number): TriviaDifficulty {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return value as TriviaDifficulty;
}

function drawFromPools(pools: QuestionPools, target: TriviaDifficulty): TriviaQuestion | null {
  const order: TriviaDifficulty[] =
    target === 1 ? [1, 2, 3] : target === 2 ? [2, 3, 1] : [3, 2, 1];
  for (const diff of order) {
    const next = pools[diff].shift();
    if (next) return next;
  }
  return null;
}

export default function TriviaScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('trivia', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const router = useRouter();
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const dailyCategories = useMemo(() => getDailyTriviaCategories(), []);
  const [mode, setMode] = useState<GameMode>('choose');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [questionOrder, setQuestionOrder] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; timedOut: boolean }[]>([]);
  const [countdown, setCountdown] = useState(TIME_PER_QUESTION);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<TriviaDifficulty>(1);
  const poolsRef = useRef<QuestionPools | null>(null);

  const category = useMemo(
    () => (selectedCategoryId ? getTriviaCategory(selectedCategoryId) : undefined),
    [selectedCategoryId]
  );

  const currentQuestion = questionOrder[currentIndex];
  const correctCount = answers.filter((a) => a.correct).length;

  const takeNextQuestion = useCallback(
    (nextDifficulty: TriviaDifficulty) => {
      if (!poolsRef.current) return;
      const next = drawFromPools(poolsRef.current, nextDifficulty);
      if (!next) return;
      setQuestionOrder((prev) => [...prev, next]);
    },
    []
  );

  const startTrivia = useCallback(
    (categoryId: string) => {
      const pools = getTriviaQuestionPools(categoryId);
      poolsRef.current = pools;
      const first = drawFromPools(pools, 1);
      setSelectedCategoryId(categoryId);
      setQuestionOrder(first ? [first] : []);
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedOption(null);
      setCountdown(TIME_PER_QUESTION);
      setDifficulty(1);
      setMode('quiz');
    },
    []
  );

  const goNext = useCallback((nextDifficulty: TriviaDifficulty) => {
    setSelectedOption(null);
    setCountdown(TIME_PER_QUESTION);
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= QUESTION_COUNT) {
        setMode('finished');
        return prev;
      }
      takeNextQuestion(nextDifficulty);
      return next;
    });
  }, [takeNextQuestion]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (mode !== 'quiz') return;
      if (selectedOption !== null) return;
      if (!currentQuestion) return;
      setSelectedOption(index);
      const isCorrect = index === currentQuestion.answerIndex;
      const nextDifficulty = clampDifficulty(difficulty + (isCorrect ? 1 : -1));
      setDifficulty(nextDifficulty);
      setAnswers((prev) => [...prev, { correct: isCorrect, timedOut: false }]);
      setTimeout(() => goNext(nextDifficulty), 650);
    },
    [mode, selectedOption, currentQuestion, goNext, difficulty]
  );

  const handleTimeout = useCallback(() => {
    if (mode !== 'quiz') return;
    if (selectedOption !== null) return;
    setSelectedOption(-1);
    const nextDifficulty = clampDifficulty(difficulty - 1);
    setDifficulty(nextDifficulty);
    setAnswers((prev) => [...prev, { correct: false, timedOut: true }]);
    setTimeout(() => goNext(nextDifficulty), 500);
  }, [mode, selectedOption, goNext, difficulty]);

  useEffect(() => {
    if (mode !== 'quiz') return;
    if (selectedOption !== null) return;
    if (countdown <= 0) return;
    const id = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [mode, selectedOption, countdown]);

  useEffect(() => {
    if (mode !== 'quiz') return;
    if (selectedOption !== null) return;
    if (countdown <= 0) {
      handleTimeout();
    }
  }, [countdown, handleTimeout, mode, selectedOption]);

  const shareText = useMemo(() => {
    const resultRow = answers
      .map((a) => (a.correct ? '🟩' : a.timedOut ? '⏱️' : '⬛️'))
      .join('');
    return [
      `Trivia ${dateLabel} ${correctCount}/${QUESTION_COUNT}`,
      category?.name ?? 'Daily Trivia',
      resultRow,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [answers, dateLabel, correctCount, category?.name]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${getLocalDateKey()}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, []);

  const hasCountedRef = useRef(false);
  useEffect(() => {
    if (mode === 'finished' && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('trivia');
    }
  }, [mode]);

  const handleCopyResults = useCallback(async () => {
    if (Platform.OS !== 'web') return;
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

  return (
    <>
      <Stack.Screen options={{ title: 'Daily Trivia', headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <View style={styles.pageAccent} />
            <View style={styles.header}>
              <Text style={styles.title}>Daily Trivia</Text>
              <Text style={styles.subtitle}>{dateLabel}</Text>
            </View>

            {mode === 'choose' && (
              <View style={styles.choiceCard}>
                <Text style={styles.choiceTitle}>Pick a category</Text>
                <Text style={styles.choiceSubtitle}>
                  Choose one of today's two categories to start.
                </Text>
                {dailyCategories.map((cat) => (
                  <Pressable
                    key={cat.id}
                    style={({ pressed }) => [
                      styles.categoryCard,
                      pressed && styles.categoryCardPressed,
                    ]}
                    onPress={() => startTrivia(cat.id)}
                  >
                    <Text style={styles.categoryName}>{cat.name}</Text>
                    <Text style={styles.categoryDesc}>{cat.description}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {mode === 'quiz' && currentQuestion && (
              <View style={styles.quizCard}>
                <View style={styles.quizTop}>
                  <Text style={styles.quizMeta}>
                    Question {currentIndex + 1} / {QUESTION_COUNT}
                  </Text>
                  <View style={styles.timerPill}>
                    <Text style={styles.timerText}>{countdown}s</Text>
                  </View>
                </View>
                <Text style={styles.question}>{currentQuestion.prompt}</Text>
                <View style={styles.optionsList}>
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.answerIndex;
                    const showResult = selectedOption !== null;
                    return (
                      <Pressable
                        key={option}
                        style={({ pressed }) => [
                          styles.option,
                          pressed && styles.optionPressed,
                          showResult && isSelected && styles.optionSelected,
                          showResult && isCorrect && styles.optionCorrect,
                          showResult && isSelected && !isCorrect && styles.optionWrong,
                        ]}
                        onPress={() => handleAnswer(idx)}
                        disabled={selectedOption !== null}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {mode === 'finished' && (
              <View style={styles.resultCard}>
                <Text style={styles.resultEmoji}>🎯</Text>
                <Text style={styles.resultTitle}>You scored {correctCount}/8</Text>
                <Text style={styles.resultSubtitle}>{category?.name}</Text>
                <View style={styles.shareCard}>
                  <Text style={styles.shareTitle}>Share your result</Text>
                  <View style={styles.shareBox}>
                    <Text selectable style={styles.shareText}>
                      {shareText}
                    </Text>
                  </View>
                  {Platform.OS === 'web' && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.shareButton,
                        pressed && styles.shareButtonPressed,
                      ]}
                      onPress={handleCopyResults}
                    >
                      <Text style={styles.shareButtonText}>Copy results</Text>
                    </Pressable>
                  )}
                  {shareStatus && <Text style={styles.shareStatus}>{shareStatus}</Text>}
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.homeButton,
                    pressed && styles.homeButtonPressed,
                  ]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.homeButtonText}>Back to games</Text>
                </Pressable>
                <Text style={styles.buildText}>Build: {BUILD_ID}</Text>
              </View>
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

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSoft,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  page: {
    ...ui.page,
  },
  pageAccent: {
    ...ui.accentBar,
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  choiceCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  choiceTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  choiceSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryCard: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  categoryCardPressed: {
    backgroundColor: Colors.border,
  },
  categoryName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  categoryDesc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quizCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quizTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quizMeta: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  timerPill: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.text,
  },
  question: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  optionsList: {
    gap: Spacing.sm,
  },
  option: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionPressed: {
    backgroundColor: Colors.border,
  },
  optionSelected: {
    borderColor: Colors.primary,
  },
  optionCorrect: {
    backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.22)' : 'rgba(24, 169, 87, 0.15)',
    borderColor: Colors.success,
  },
  optionWrong: {
    backgroundColor: theme.mode === 'dark' ? 'rgba(255, 107, 107, 0.22)' : 'rgba(224, 68, 68, 0.15)',
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: '600',
  },
  resultCard: {
    alignItems: 'center',
    ...ui.card,
    padding: Spacing.lg,
  },
  resultEmoji: {
    fontSize: 56,
  },
  resultTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  resultSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  shareCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  shareBox: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  shareText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  shareButton: {
    ...ui.cta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  shareButtonPressed: {
    ...ui.ctaPressed,
  },
  shareButtonText: {
    ...ui.ctaText,
  },
  shareStatus: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  homeButton: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  homeButtonPressed: {
    backgroundColor: Colors.surfaceLight,
  },
  homeButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  buildText: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  });
};
