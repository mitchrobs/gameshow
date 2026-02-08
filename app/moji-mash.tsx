import { useState, useCallback, useRef } from 'react';
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
import { getDailyPuzzle, getRandomPuzzle, MojiMashPuzzle } from '../src/data/mojiMashPuzzles';

const MAX_WRONG_GUESSES = 5;

type GameState = 'playing' | 'won' | 'lost';

export default function MojiMashScreen() {
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<MojiMashPuzzle>(getDailyPuzzle);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isPractice, setIsPractice] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

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

  const startPractice = useCallback(() => {
    const newPuzzle = getRandomPuzzle();
    setPuzzle(newPuzzle);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('playing');
    setFoundWords(new Set());
    setWrongCount(0);
    setShowHint(false);
    setIsPractice(true);
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
                {isPractice ? 'Practice Mode' : "Today's Genmoji"}
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
                          Hidden
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
                <Pressable
                  style={({ pressed }) => [
                    styles.practiceButton,
                    pressed && styles.practiceButtonPressed,
                  ]}
                  onPress={startPractice}
                >
                  <Text style={styles.practiceButtonText}>
                    Play a random puzzle
                  </Text>
                </Pressable>
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
    backgroundColor: Colors.background,
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
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  slotFound: {
    borderColor: Colors.success,
    borderStyle: 'solid',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  slotText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.success,
  },
  slotPlaceholder: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
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
    backgroundColor: Colors.primary,
  },
  lifeDotUsed: {
    backgroundColor: Colors.error,
    opacity: 0.4,
  },
  livesText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  hintContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  guessTagText: {
    color: Colors.errorLight,
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
