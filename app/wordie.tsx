import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
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
import { getDailyWordie } from '../src/data/wordiePuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const STORAGE_PREFIX = 'wordie';
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const KEYBOARD_ROWS = [
  'QWERTYUIOP'.split(''),
  [...'ASDFGHJKL'.split(''), 'BACK'],
  [...'ZXCVBNM'.split(''), 'ENTER'],
];

function getLocalDateKey(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function getDateFromLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

type GameState = 'playing' | 'won' | 'lost';
type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

function evaluateGuess(guess: string, answer: string): TileStatus[] {
  const result: TileStatus[] = Array(WORD_LENGTH).fill('absent');
  const answerChars = answer.split('');
  const used = Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      used[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] !== 'absent') continue;
    for (let j = 0; j < WORD_LENGTH; j += 1) {
      if (used[j]) continue;
      if (guess[i] === answer[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

export default function WordieScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('wordie', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const [dateKey, setDateKey] = useState(() => getLocalDateKey());
  const activeDate = useMemo(() => getDateFromLocalDateKey(dateKey), [dateKey]);
  const answer = useMemo(() => getDailyWordie(activeDate), [activeDate]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [removedLetters, setRemovedLetters] = useState<Set<string>>(() => new Set());
  const [removingLetters, setRemovingLetters] = useState<Set<string>>(() => new Set());
  const [showRemovedLetters, setShowRemovedLetters] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const hasCountedRef = useRef(false);
  const keyAnimRefs = useRef<Record<string, Animated.Value>>({});
  const rowShakeAnim = useRef(new Animated.Value(0)).current;
  const dateLabel = useMemo(
    () =>
      activeDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [activeDate]
  );

  useEffect(() => {
    const checkDateRollover = () => {
      const nextKey = getLocalDateKey();
      setDateKey((currentKey) => (currentKey === nextKey ? currentKey : nextKey));
    };
    checkDateRollover();
    const intervalId = setInterval(checkDateRollover, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

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

  const getKeyAnim = useCallback((letter: string) => {
    if (!keyAnimRefs.current[letter]) {
      keyAnimRefs.current[letter] = new Animated.Value(1);
    }
    return keyAnimRefs.current[letter];
  }, []);

  const triggerRowShake = useCallback(() => {
    rowShakeAnim.stopAnimation();
    rowShakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(rowShakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(rowShakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(rowShakeAnim, { toValue: 5, duration: 35, useNativeDriver: true }),
      Animated.timing(rowShakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();
  }, [rowShakeAnim]);

  const announceRemovedLetters = useCallback((letters: string[], remainingCount: number) => {
    if (letters.length === 0) return;
    const letterText =
      letters.length === 1 ? `${letters[0]} disappeared` : `${letters.join(', ')} disappeared`;
    const remainingText =
      remainingCount === 1 ? 'visible letter remaining' : 'visible letters remaining';
    AccessibilityInfo.announceForAccessibility(`${letterText}, ${remainingCount} ${remainingText}`);
  }, []);

  const removeLettersFromKeyboard = useCallback(
    (letters: string[]) => {
      if (letters.length === 0) return;
      const remainingCount = ALPHABET.length - removedLetters.size - letters.length;

      if (reduceMotionEnabled) {
        setRemovedLetters((previous) => {
          const next = new Set(previous);
          letters.forEach((letter) => next.add(letter));
          return next;
        });
        announceRemovedLetters(letters, remainingCount);
        return;
      }

      setRemovingLetters((previous) => {
        const next = new Set(previous);
        letters.forEach((letter) => next.add(letter));
        return next;
      });
      letters.forEach((letter) => getKeyAnim(letter).setValue(1));

      Animated.stagger(
        30,
        letters.map((letter) =>
          Animated.timing(getKeyAnim(letter), {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        )
      ).start(() => {
        setRemovedLetters((previous) => {
          const next = new Set(previous);
          letters.forEach((letter) => next.add(letter));
          return next;
        });
        setRemovingLetters((previous) => {
          const next = new Set(previous);
          letters.forEach((letter) => next.delete(letter));
          return next;
        });
        letters.forEach((letter) => getKeyAnim(letter).setValue(1));
        announceRemovedLetters(letters, remainingCount);
      });
    },
    [announceRemovedLetters, getKeyAnim, reduceMotionEnabled, removedLetters.size]
  );

  const handleAppendLetter = useCallback(
    (letter: string) => {
      if (gameState !== 'playing') return;
      if (removingLetters.has(letter) || (removedLetters.has(letter) && !showRemovedLetters)) {
        triggerRowShake();
        return;
      }
      setCurrentGuess((guess) => (guess.length >= WORD_LENGTH ? guess : `${guess}${letter}`));
    },
    [gameState, removedLetters, removingLetters, showRemovedLetters, triggerRowShake]
  );

  const handleBackspace = useCallback(() => {
    if (gameState !== 'playing') return;
    setCurrentGuess((guess) => guess.slice(0, -1));
  }, [gameState]);

  const handleSubmit = useCallback(() => {
    if (gameState !== 'playing') return;
    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== WORD_LENGTH) {
      triggerRowShake();
      return;
    }
    const nextGuesses = [...guesses, guess];
    const nextGameState: GameState =
      guess === answer ? 'won' : nextGuesses.length >= MAX_GUESSES ? 'lost' : 'playing';
    const lettersToRemove = Array.from(new Set(guess.split(''))).filter(
      (letter) => !answer.includes(letter) && !removedLetters.has(letter)
    );

    setGuesses(nextGuesses);
    setCurrentGuess('');
    setGameState(nextGameState);

    if (nextGameState === 'playing') {
      removeLettersFromKeyboard(lettersToRemove);
    }
  }, [
    answer,
    currentGuess,
    gameState,
    guesses,
    removeLettersFromKeyboard,
    removedLetters,
    triggerRowShake,
  ]);

  const shareText = useMemo(() => {
    const result = gameState === 'won' ? `${guesses.length}/${MAX_GUESSES}` : 'X/6';
    const rows = guesses
      .map((guess) =>
        evaluateGuess(guess, answer)
          .map((status) =>
            status === 'correct' ? '🟩' : status === 'present' ? '🟨' : '⬛️'
          )
          .join('')
      )
      .join('\n');

    return [
      `Wordie ${dateLabel} ${result}`,
      rows,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [guesses, answer, dateLabel, gameState]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setShareStatus(null);
    setRemovedLetters(new Set());
    setRemovingLetters(new Set());
    setShowRemovedLetters(false);
    Object.values(keyAnimRefs.current).forEach((anim) => anim.setValue(1));
    rowShakeAnim.setValue(0);
    hasCountedRef.current = false;
  }, [dateKey, rowShakeAnim]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
  }, [dateKey]);
  useEffect(() => {
    if (gameState !== 'playing' && !hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('wordie');
    }
  }, [gameState]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit();
        return;
      }
      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        return;
      }
      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        handleAppendLetter(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAppendLetter, handleBackspace, handleSubmit]);

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

  const renderKeyboardKey = (keyValue: string) => {
    const isEnter = keyValue === 'ENTER';
    const isBack = keyValue === 'BACK';
    const isControl = isEnter || isBack;
    const letter = isControl ? null : keyValue;
    const keyAnim = letter ? getKeyAnim(letter) : null;
    const isRemoving = letter ? removingLetters.has(letter) : false;
    const isRemoved = letter ? removedLetters.has(letter) : false;
    const isHiddenRemoved = Boolean(letter && isRemoved && !showRemovedLetters);
    const isShownRemoved = Boolean(letter && isRemoved && showRemovedLetters);
    const animatedLetterStyle = keyAnim
      ? {
          opacity: keyAnim,
          transform: [
            {
              scale: keyAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.86, 1],
              }),
            },
          ],
        }
      : null;
    const label = isEnter ? 'Enter' : isBack ? 'Back' : isHiddenRemoved ? '' : keyValue;
    const accessibilityLabel = isEnter
      ? 'Enter guess'
      : isBack
        ? 'Delete letter'
        : isShownRemoved
          ? `Letter ${keyValue}, disappeared`
          : `Letter ${keyValue}`;

    const keyContent = (
      <Animated.Text
        style={[
          styles.keyboardKeyText,
          isControl && styles.keyboardControlKeyText,
          isShownRemoved && styles.keyboardRemovedKeyText,
          isRemoving && animatedLetterStyle,
        ]}
      >
        {label}
      </Animated.Text>
    );

    return (
      <Animated.View
        key={keyValue}
        style={[styles.keyboardKeyShell, isControl && styles.keyboardControlKeyShell]}
      >
        {isHiddenRemoved ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.keyboardKey, styles.keyboardRemovedKey]}
          >
            {keyContent}
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            disabled={isRemoving}
            style={({ pressed }) => [
              styles.keyboardKey,
              isControl && styles.keyboardControlKey,
              isRemoved && styles.keyboardRemovedKey,
              pressed && styles.keyboardKeyPressed,
            ]}
            onPress={() => {
              if (isEnter) {
                handleSubmit();
              } else if (isBack) {
                handleBackspace();
              } else {
                handleAppendLetter(keyValue);
              }
            }}
          >
            {keyContent}
          </Pressable>
        )}
      </Animated.View>
    );
  };
  const showGhostLettersToggle = guesses.length > 0;
  const ghostLettersLabel = showRemovedLetters ? 'Hide Ghost Letters' : 'Show Ghost Letters';

  return (
    <>
      <Stack.Screen options={{ title: 'Wordie', headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.page}>
            <View style={styles.pageAccent} />
            <View style={styles.header}>
              <Text style={styles.title}>Wordie</Text>
              <Text style={styles.subtitle}>Guess the 5-letter word in 6 tries.</Text>
            </View>

            <View style={styles.grid}>
              {Array.from({ length: MAX_GUESSES }).map((_, row) => {
                const guess = guesses[row] ?? '';
                const isCurrent = row === guesses.length && gameState === 'playing';
                const letters = (isCurrent ? currentGuess : guess).padEnd(WORD_LENGTH, ' ');
                const statuses = guess
                  ? evaluateGuess(guess, answer)
                  : Array(WORD_LENGTH).fill('empty');

                return (
                  <Animated.View
                    key={row}
                    style={[
                      styles.row,
                      isCurrent && { transform: [{ translateX: rowShakeAnim }] },
                    ]}
                  >
                    {letters.split('').map((char, i) => {
                      const status = statuses[i] as TileStatus;
                      return (
                        <View
                          key={i}
                          style={[
                            styles.tile,
                            status === 'correct' && styles.tileCorrect,
                            status === 'present' && styles.tilePresent,
                            status === 'absent' && styles.tileAbsent,
                            status === 'empty' && styles.tileEmpty,
                          ]}
                        >
                          <Text style={styles.tileText}>{char.trim()}</Text>
                        </View>
                      );
                    })}
                  </Animated.View>
                );
              })}
            </View>

            {gameState === 'playing' && (
              <View style={styles.keyboard}>
                <View style={styles.keyboardRows}>
                  {KEYBOARD_ROWS.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keyboardRow}>
                      {row.map(renderKeyboardKey)}
                    </View>
                  ))}
                </View>
                {showGhostLettersToggle && (
                  <View style={styles.keyboardOptionsRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={ghostLettersLabel}
                      style={({ pressed }) => [
                        styles.removedLettersToggle,
                        pressed && styles.removedLettersTogglePressed,
                      ]}
                      onPress={() => setShowRemovedLetters((isShowing) => !isShowing)}
                    >
                      <Text style={styles.removedLettersToggleText}>{ghostLettersLabel}</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}

            {gameState !== 'playing' && (
              <View style={styles.resultCard}>
                <Text style={styles.resultEmoji}>{gameState === 'won' ? '🎉' : '😔'}</Text>
                <Text style={styles.resultTitle}>
                  {gameState === 'won' ? 'You got it!' : 'Out of guesses'}
                </Text>
                {gameState === 'lost' && (
                  <Text style={styles.answerText}>The word was {answer}.</Text>
                )}
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
  const dimmedKeyBorder =
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(11, 11, 11, 0.07)';
  const dimmedLetterText =
    theme.mode === 'dark' ? 'rgba(156, 167, 184, 0.5)' : 'rgba(106, 113, 128, 0.5)';

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
  grid: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  tile: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmpty: {
    backgroundColor: Colors.surface,
  },
  tileCorrect: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  tilePresent: {
    backgroundColor: screenAccent.main,
    borderColor: screenAccent.main,
  },
  tileAbsent: {
    backgroundColor: Colors.textMuted,
    borderColor: Colors.textMuted,
  },
  tileText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  keyboard: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  keyboardOptionsRow: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  keyboardRows: {
    gap: Spacing.sm,
  },
  keyboardRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    justifyContent: 'center',
  },
  keyboardKeyShell: {
    flex: 1,
    maxWidth: 42,
  },
  keyboardControlKeyShell: {
    flex: 1.35,
    maxWidth: 64,
  },
  keyboardKey: {
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  keyboardControlKey: {
    backgroundColor: Colors.surfaceLight,
  },
  keyboardRemovedKey: {
    backgroundColor: Colors.backgroundSoft,
    borderColor: dimmedKeyBorder,
  },
  keyboardKeyPressed: {
    backgroundColor: Colors.surfaceLight,
    transform: [{ scale: 0.98 }],
  },
  keyboardKeyText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  keyboardControlKeyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  keyboardRemovedKeyText: {
    color: dimmedLetterText,
  },
  removedLettersToggle: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: dimmedKeyBorder,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  removedLettersTogglePressed: {
    backgroundColor: Colors.surfaceLight,
    transform: [{ scale: 0.98 }],
  },
  removedLettersToggleText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  resultCard: {
    alignItems: 'center',
    ...ui.card,
    padding: Spacing.lg,
  },
  resultEmoji: {
    fontSize: 64,
  },
  resultTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  answerText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
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
  });
};
