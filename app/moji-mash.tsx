import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { getDailyPuzzle, getBonusPuzzle, MojiMashPuzzle } from '../src/data/mojiMashPuzzles';

const MAX_WRONG_GUESSES = 5;
const STORAGE_PREFIX = 'mojimash';

type GameState = 'playing' | 'won' | 'lost';
type PuzzleMode = 'daily' | 'bonus';

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

export default function MojiMashScreen() {
  const router = useRouter();
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );
  const dailyKey = `${STORAGE_PREFIX}:daily:${dateKey}`;
  const bonusKey = `${STORAGE_PREFIX}:bonus:${dateKey}`;

  const [puzzle, setPuzzle] = useState<MojiMashPuzzle>(getDailyPuzzle);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [mode, setMode] = useState<PuzzleMode>('daily');
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [bonusCompleted, setBonusCompleted] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const foundCount = foundWords.size;
  const totalWords = puzzle.words.length;

  const shareText = useMemo(() => {
    const wordRow =
      'Words: ' +
      '🟩'.repeat(foundCount) +
      '⬜️'.repeat(Math.max(0, totalWords - foundCount));
    const mistakeRow =
      'Mistakes: ' +
      '🟥'.repeat(wrongCount) +
      '⬜️'.repeat(Math.max(0, MAX_WRONG_GUESSES - wrongCount));
    const result =
      gameState === 'won'
        ? `Solved in ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}`
        : 'Did not solve';
    const modeLabel = mode === 'bonus' ? 'Bonus' : 'Daily';

    return [
      `Moji Mash ${dateLabel} (${modeLabel})`,
      result,
      wordRow,
      mistakeRow,
      'https://mitchrobs.github.io/gameshow/',
    ].join('\n');
  }, [dateLabel, mode, gameState, foundCount, totalWords, wrongCount, guesses.length]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    setDailyCompleted(storage.getItem(dailyKey) === '1');
    setBonusCompleted(storage.getItem(bonusKey) === '1');
  }, [dailyKey, bonusKey]);

  useEffect(() => {
    if (gameState !== 'won' || mode !== 'daily') return;
    if (dailyCompleted) return;
    const storage = getStorage();
    storage?.setItem(dailyKey, '1');
    setDailyCompleted(true);
  }, [gameState, mode, dailyCompleted, dailyKey]);

  useEffect(() => {
    if (mode !== 'bonus' || gameState === 'playing') return;
    if (bonusCompleted) return;
    const storage = getStorage();
    storage?.setItem(bonusKey, '1');
    setBonusCompleted(true);
  }, [gameState, mode, bonusCompleted, bonusKey]);

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

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleGuess = useCallback(() => {
    const guess = currentGuess.trim().toLowerCase();
    if (!guess || gameState !== 'playing') return;

    // Already guessed this word
    if (guesses.includes(guess)) {
      triggerShake();
      setCurrentGuess('');
      return;
    }

    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Check if the guess matches any of the puzzle words
    if (puzzle.words.includes(guess)) {
      const newFound = new Set(foundWords);
      newFound.add(guess);
      setFoundWords(newFound);

      // Check for win — all words found
      if (newFound.size === puzzle.words.length) {
        setGameState('won');
      }
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);
      triggerShake();

      // Show hint after 3 wrong guesses
      if (newWrongCount >= 3) {
        setShowHint(true);
      }

      if (newWrongCount >= MAX_WRONG_GUESSES) {
        setGameState('lost');
      }
    }

    // Refocus input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentGuess, gameState, guesses, puzzle.words, foundWords, wrongCount, triggerShake]);

  const startBonus = useCallback(() => {
    const newPuzzle = getBonusPuzzle();
    setPuzzle(newPuzzle);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setFoundWords(new Set());
    setWrongCount(0);
    setShowHint(false);
    setMode('bonus');
    setTimeout(() => inputRef.current?.focus(), 150);
  }, []);

  const wrongGuesses = guesses.filter((g) => !puzzle.words.includes(g));

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Moji Mash',
          headerBackTitle: 'Home',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Emoji display */}
            <View style={styles.emojiContainer}>
              <Image source={puzzle.image} style={styles.genmojiImage} />
              <Text style={styles.emojiLabel}>
                {mode === 'bonus' ? 'Bonus Puzzle' : "Today's Genmoji"}
              </Text>
            </View>

            {/* Word slots */}
            <View style={styles.wordSlots}>
              <Text style={styles.sectionLabel}>
                Guess the {puzzle.words.length} words used to create this genmoji
              </Text>
              <View style={styles.slots}>
                {puzzle.words.map((word, i) => {
                  const isFound = foundWords.has(word);
                  return (
                    <View
                      key={i}
                      style={[styles.slot, isFound && styles.slotFound]}
                    >
                      {isFound ? (
                        <Text style={styles.slotText}>{word}</Text>
                      ) : (
                        <Text style={styles.slotPlaceholder}>
                          Word {i + 1}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Lives indicator */}
            <View style={styles.livesContainer}>
              {Array.from({ length: MAX_WRONG_GUESSES }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.lifeDot,
                    i < wrongCount && styles.lifeDotUsed,
                  ]}
                />
              ))}
              <Text style={styles.livesText}>
                {MAX_WRONG_GUESSES - wrongCount} guess{MAX_WRONG_GUESSES - wrongCount !== 1 ? 'es' : ''} remaining
              </Text>
            </View>

            {/* Hint */}
            {showHint && gameState === 'playing' && (
              <View style={styles.hintContainer}>
                <Text style={styles.hintLabel}>Hint</Text>
                <Text style={styles.hintText}>{puzzle.hint}</Text>
              </View>
            )}

            {/* Input area */}
            {gameState === 'playing' && (
              <Animated.View
                style={[
                  styles.inputContainer,
                  { transform: [{ translateX: shakeAnim }] },
                ]}
              >
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={currentGuess}
                  onChangeText={setCurrentGuess}
                  onSubmitEditing={handleGuess}
                  placeholder="Type a word..."
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="go"
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.guessButton,
                    pressed && styles.guessButtonPressed,
                    !currentGuess.trim() && styles.guessButtonDisabled,
                  ]}
                  onPress={handleGuess}
                  disabled={!currentGuess.trim()}
                >
                  <Text style={styles.guessButtonText}>Guess</Text>
                </Pressable>
              </Animated.View>
            )}

            {/* Previous guesses */}
            {wrongGuesses.length > 0 && (
              <View style={styles.previousGuesses}>
                <Text style={styles.sectionLabel}>Wrong guesses</Text>
                <View style={styles.guessTags}>
                  {wrongGuesses.map((guess, i) => (
                    <View key={i} style={styles.guessTag}>
                      <Text style={styles.guessTagText}>{guess}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* End state */}
            {gameState !== 'playing' && (
              <View style={styles.endState}>
                <Text style={styles.endEmoji}>
                  {gameState === 'won' ? '🎉' : '😔'}
                </Text>
                <Text style={styles.endTitle}>
                  {gameState === 'won' ? 'You got it!' : 'Better luck next time'}
                </Text>
                {gameState === 'lost' && (
                  <View style={styles.answerReveal}>
                    <Text style={styles.answerLabel}>The words were:</Text>
                    <Text style={styles.answerWords}>
                      {puzzle.words.join(' + ')}
                    </Text>
                  </View>
                )}
                {gameState === 'won' && (
                  <Text style={styles.endStats}>
                    Solved with {wrongCount} wrong guess{wrongCount !== 1 ? 'es' : ''}
                  </Text>
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
                  {shareStatus && (
                    <Text style={styles.shareStatus}>{shareStatus}</Text>
                  )}
                </View>
                {dailyCompleted && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.practiceButton,
                      pressed && styles.practiceButtonPressed,
                      (bonusCompleted || mode === 'bonus') &&
                        styles.practiceButtonDisabled,
                    ]}
                    onPress={startBonus}
                    disabled={bonusCompleted || mode === 'bonus'}
                  >
                    <Text style={styles.practiceButtonText}>
                      {bonusCompleted ? 'Bonus completed' : 'Play bonus puzzle'}
                    </Text>
                  </Pressable>
                )}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  emojiContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  genmojiImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  emojiLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  wordSlots: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  slot: {
    flexGrow: 1,
    flexBasis: 120,
    minWidth: 120,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  slotFound: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(24, 169, 87, 0.12)',
  },
  slotText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.success,
  },
  slotPlaceholder: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  lifeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.text,
  },
  lifeDotUsed: {
    backgroundColor: Colors.border,
    opacity: 1,
  },
  livesText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  hintContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hintLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hintText: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guessButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  guessButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  guessButtonDisabled: {
    opacity: 0.5,
  },
  guessButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  previousGuesses: {
    marginBottom: Spacing.lg,
  },
  guessTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  guessTag: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guessTagText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  endState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  endEmoji: {
    fontSize: 64,
  },
  endTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  endStats: {
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
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  shareButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  shareStatus: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  answerReveal: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  answerLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  answerWords: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: Spacing.xs,
  },
  practiceButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  practiceButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  practiceButtonDisabled: {
    opacity: 0.5,
  },
  practiceButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
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
