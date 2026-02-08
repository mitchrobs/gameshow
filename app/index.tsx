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
        <Text style={styles.kicker}>Puzzle of the Day</Text>
        <Text style={styles.title}>Moji Mash</Text>
        <Text style={styles.subtitle}>{dateLabel}</Text>
        <Text style={styles.blurb}>
          Genmojis are AI-styled emoji blends — guess the words behind today’s image.
        </Text>
      </View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  kicker: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  blurb: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    maxWidth: 320,
  },
  dailyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
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
