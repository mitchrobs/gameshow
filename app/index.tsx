import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';

const games = [
  {
    id: 'moji-mash',
    title: 'Moji Mash',
    emoji: '🎨',
    description: 'Guess the words behind the genmoji',
    route: '/moji-mash' as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gameshow</Text>
        <Text style={styles.subtitle}>Daily puzzle games</Text>
      </View>

      <View style={styles.gamesGrid}>
        {games.map((game) => (
          <Pressable
            key={game.id}
            style={({ pressed }) => [
              styles.gameCard,
              pressed && styles.gameCardPressed,
            ]}
            onPress={() => router.push(game.route)}
          >
            <Text style={styles.gameEmoji}>{game.emoji}</Text>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>Play</Text>
            </View>
          </Pressable>
        ))}
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
  gamesGrid: {
    gap: Spacing.md,
  },
  gameCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gameCardPressed: {
    backgroundColor: Colors.surfaceLight,
    transform: [{ scale: 0.98 }],
  },
  gameEmoji: {
    fontSize: FontSize.display,
    marginBottom: Spacing.sm,
  },
  gameTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  gameDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  playButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  playButtonText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
