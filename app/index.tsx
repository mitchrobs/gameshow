import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import { getDailyPuzzle } from '../src/data/mojiMashPuzzles';

export default function HomeScreen() {
  const router = useRouter();
  const puzzle = getDailyPuzzle();
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gameshow</Text>
        <Text style={styles.subtitle}>Daily puzzle games</Text>
      </View>

      <View style={styles.dailyCard}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Puzzle of the Day</Text>
        </View>
        <Text style={styles.dateText}>{dateLabel}</Text>
        <View style={styles.preview}>
          <Image source={puzzle.image} style={styles.previewImage} />
        </View>
        <Text style={styles.gameTitle}>Moji Mash</Text>
        <Text style={styles.gameDescription}>
          Guess the words behind the genmoji.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            pressed && styles.playButtonPressed,
          ]}
          onPress={() => router.push('/moji-mash')}
        >
          <Text style={styles.playButtonText}>Play today’s puzzle</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  dailyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  badge: {
    alignSelf: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  dateText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  preview: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  previewImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  gameTitle: {
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  gameDescription: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
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
