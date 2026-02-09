import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { BUILD_ID } from '../src/constants/build';
import { getDailyPuzzle } from '../src/data/mojiMashPuzzles';
import { getDailyWhodunit } from '../src/data/whodunitPuzzles';
import { getDailyWordle } from '../src/data/wordlePuzzles';
import { getDailyTriviaCategories } from '../src/data/triviaPuzzles';
import { getDailySudoku } from '../src/data/sudokuPuzzles';

export default function HomeScreen() {
  const router = useRouter();
  const puzzle = getDailyPuzzle();
  const whodunit = getDailyWhodunit();
  const wordle = getDailyWordle();
  const triviaCategories = getDailyTriviaCategories();
  const sudoku = getDailySudoku();
  const [streak, setStreak] = useState(0);
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  const quickLinks = useMemo(
    () => [
      { label: 'Moji Mash', route: '/moji-mash', emoji: '🧩' },
      { label: 'Wordle', route: '/wordle', emoji: '🔤' },
      { label: 'Mini Sudoku', route: '/sudoku', emoji: '🧠' },
      { label: 'Whodunit', route: '/whodunit', emoji: '🔍' },
      { label: 'Trivia', route: '/trivia', emoji: '⚡' },
    ],
    []
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setStreak(0);
      return;
    }

    const storage = window.localStorage;
    const keyForDate = (date: Date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    };

    const hasDaily = (date: Date) =>
      storage.getItem(`mojimash:daily:${keyForDate(date)}`) === '1';

    let count = 0;
    const cursor = new Date();
    while (hasDaily(cursor)) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    setStreak(count);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleAlign: 'left',
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>Daybreak Games</Text>
              <Text style={styles.headerTaglineText}>For the curious</Text>
            </View>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.dateSubtitle}>{dateLabel}</Text>
          </View>

          <View style={styles.quickLinksSection}>
            <View style={styles.quickLinksHeader}>
              <Text style={styles.quickLinksTitle}>Quick links</Text>
              <Text style={styles.quickLinksSubtitle}>Jump back into a game.</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickLinksRow}
            >
              {quickLinks.map((item) => (
                <Pressable
                  key={item.route}
                  style={({ pressed }) => [
                    styles.quickLinkCard,
                    pressed && styles.quickLinkCardPressed,
                  ]}
                  onPress={() => router.push(item.route)}
                >
                  <Text style={styles.quickLinkEmoji}>{item.emoji}</Text>
                  <Text style={styles.quickLinkLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Moji Mash card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Word Puzzle</Text>
              <Text style={styles.gameTitle}>Moji Mash</Text>
            </View>
            <Text style={styles.blurb}>
              Genmojis are AI-styled emoji blends - guess the words behind today's image.
            </Text>
            {streak > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{streak}-day streak</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.preview}>
                <Image source={puzzle.image} style={styles.previewImage} />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/moji-mash')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Wordle card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Word Guess</Text>
              <Text style={styles.gameTitle}>Wordle</Text>
            </View>
            <Text style={styles.blurb}>
              Solve the five-letter word in six guesses.
            </Text>
            <View style={styles.dailyCard}>
              <View style={styles.wordlePreview}>
                {Array.from({ length: 2 }).map((_, row) => (
                  <View key={row} style={styles.wordleRow}>
                    {Array.from({ length: 5 }).map((_, col) => (
                      <View key={col} style={styles.wordleTile}>
                        {row === 0 && col === 0 ? (
                          <Text style={styles.wordleTileText}>{wordle[0]}</Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/wordle')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Mini Sudoku card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Logic Grid</Text>
              <Text style={styles.gameTitle}>Mini Sudoku</Text>
            </View>
            <Text style={styles.blurb}>
              A 6x6 daily Sudoku with a medium-hard bite.
            </Text>
            <View style={styles.dailyCard}>
              <View style={styles.sudokuPreview}>
                {sudoku.grid.map((row, rowIndex) => (
                  <View key={`sudoku-row-${rowIndex}`} style={styles.sudokuRow}>
                    {row.map((value, colIndex) => (
                      <View
                        key={`sudoku-${rowIndex}-${colIndex}`}
                        style={[
                          styles.sudokuCell,
                          value !== 0 && styles.sudokuCellFilled,
                        ]}
                      >
                        <Text style={styles.sudokuCellText}>
                          {value !== 0 ? value : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/sudoku')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Trivia card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Quickfire</Text>
              <Text style={styles.gameTitle}>Daily Trivia</Text>
            </View>
            <Text style={styles.blurb}>
              Eight rapid questions - pick one of today's categories and race the clock.
            </Text>
            <View style={styles.dailyCard}>
              <View style={styles.triviaPreview}>
                <Text style={styles.triviaPreviewTitle}>Today's choices</Text>
                <View style={styles.triviaCategoryRow}>
                  {triviaCategories.map((cat) => (
                    <View key={cat.id} style={styles.triviaCategoryChip}>
                      <Text style={styles.triviaCategoryText}>{cat.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/trivia')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Whodunit card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Logic Deduction</Text>
              <Text style={styles.gameTitle}>Whodunit</Text>
            </View>
            <Text style={styles.blurb}>
              A daily murder mystery. Read clues, eliminate suspects, deduce the killer.
            </Text>
            <View style={styles.dailyCard}>
              <View style={styles.whodunitPreview}>
                <Text style={styles.whodunitPreviewEmoji}>🔍</Text>
                <Text style={styles.whodunitCaseName}>
                  Case #{String(whodunit.caseNumber).padStart(3, '0')} - {whodunit.caseName}
                </Text>
                <View style={styles.whodunitSuspects}>
                  {whodunit.suspects.map((s, i) => (
                    <Text key={i} style={styles.whodunitSuspectChip}>
                      {s.emoji} {s.name}
                    </Text>
                  ))}
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/whodunit')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.buildFooter}>
            <Text style={styles.buildText}>Build: {BUILD_ID}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  page: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    paddingVertical: 4,
  },
  headerTitleText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  headerTaglineText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dateSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  quickLinksSection: {
    marginBottom: Spacing.xl,
  },
  quickLinksHeader: {
    marginBottom: Spacing.sm,
  },
  quickLinksTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  quickLinksSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quickLinksRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  quickLinkCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  quickLinkCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  quickLinkEmoji: {
    fontSize: 22,
  },
  quickLinkLabel: {
    marginTop: Spacing.xs,
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  gameSection: {
    marginBottom: Spacing.xl,
  },
  gameLabel: {
    marginBottom: Spacing.xs,
  },
  kicker: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
  },
  blurb: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    maxWidth: 420,
  },
  streakPill: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dailyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginTop: Spacing.md,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  preview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
  },
  previewImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  wordlePreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  wordleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  wordleTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordleTileText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  sudokuPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  sudokuRow: {
    flexDirection: 'row',
    gap: 4,
  },
  sudokuCell: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sudokuCellFilled: {
    backgroundColor: Colors.surface,
  },
  sudokuCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  triviaPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  triviaPreviewTitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  triviaCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  triviaCategoryChip: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triviaCategoryText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  whodunitPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  whodunitPreviewEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  whodunitCaseName: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    textAlign: 'center',
  },
  whodunitSuspects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  whodunitSuspectChip: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    overflow: 'hidden',
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  playButtonPressed: {
    backgroundColor: Colors.primaryLight,
    transform: [{ scale: 0.99 }],
  },
  playButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  buildFooter: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buildText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
