import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { getDailyWordie } from '../src/data/wordiePuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const STORAGE_PREFIX = 'wordie';

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

export default function WordleScreen() {
  const router = useRouter();
  const answer = useMemo(() => getDailyWordie(), []);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const handleSubmit = useCallback(() => {
    if (gameState !== 'playing') return;
    const guess = currentGuess.trim().toUpperCase();
    if (guess.length !== WORD_LENGTH) return;
    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setCurrentGuess('');

    if (guess === answer) {
      setGameState('won');
    } else if (nextGuesses.length >= MAX_GUESSES) {
      setGameState('lost');
    }
  }, [gameState, currentGuess, guesses, answer]);

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
    const storage = getStorage();
    if (!storage) return;
    const key = `${STORAGE_PREFIX}:playcount:${getLocalDateKey()}`;
    const current = parseInt(storage.getItem(key) || '0', 10);
    storage.setItem(key, String(current + 1));
    incrementGlobalPlayCount('wordie');
  }, []);

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
                  <View key={row} style={styles.row}>
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
                  </View>
                );
              })}
            </View>

            {gameState === 'playing' && (
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={currentGuess}
                  onChangeText={(text) => setCurrentGuess(text.toUpperCase().replace(/[^A-Z]/g, ''))}
                  maxLength={WORD_LENGTH}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder="Enter guess"
                  placeholderTextColor={Colors.textMuted}
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                  ]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>Guess</Text>
                </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  pageAccent: {
    height: 6,
    width: 80,
    backgroundColor: '#2f6bff',
    borderRadius: 999,
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
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  tilePresent: {
    backgroundColor: '#f4b400',
    borderColor: '#f4b400',
  },
  tileAbsent: {
    backgroundColor: '#9aa0a6',
    borderColor: '#9aa0a6',
  },
  tileText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  submitButtonPressed: {
    backgroundColor: Colors.primaryLight,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
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
