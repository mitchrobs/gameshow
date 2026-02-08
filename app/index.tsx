import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { getDailyPuzzle } from '../src/data/mojiMashPuzzles';
import { getDailyWhodunit } from '../src/data/whodunitPuzzles';

export default function HomeScreen() {
  const router = useRouter();
  const puzzle = getDailyPuzzle();
  const whodunit = getDailyWhodunit();
  const [streak, setStreak] = useState(0);
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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
      <Stack.Screen options={{ title: 'Daybreak Games' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.brand}>Daybreak Games</Text>
          <Text style={styles.tagline}>For the curious</Text>
          <Text style={styles.dateSubtitle}>{dateLabel}</Text>
        </View>

        {/* Moji Mash card */}
        <View style={styles.gameSection}>
          <View style={styles.gameLabel}>
            <Text style={styles.kicker}>Word Puzzle</Text>
            <Text style={styles.gameTitle}>Moji Mash</Text>
          </View>
          <Text style={styles.blurb}>
            Genmojis are AI-styled emoji blends — guess the words behind today's image.
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
                Case #{String(whodunit.caseNumber).padStart(3, '0')} — {whodunit.caseName}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  brand: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dateSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
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
    maxWidth: 320,
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
});
