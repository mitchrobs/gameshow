import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
import { Colors, Spacing, FontSize, BorderRadius } from '../src/constants/theme';
import {
  getDailyWhodunit,
  getDateLabel,
  WhodunitPuzzle,
  Clue,
} from '../src/data/whodunitPuzzles';

const TIME_PENALTY = 15;
const STORAGE_PREFIX = 'whodunit';

type GameState = 'playing' | 'won' | 'lost';

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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function WhodunitScreen() {
  const router = useRouter();
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const dateLabel = useMemo(() => getDateLabel(), []);
  const storageKey = `${STORAGE_PREFIX}:daily:${dateKey}`;

  const puzzle = useMemo<WhodunitPuzzle>(() => getDailyWhodunit(), []);

  // Game state
  const [gameState, setGameState] = useState<GameState>('playing');
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);
  const [revealedClues, setRevealedClues] = useState<Set<number>>(() => {
    // Free clues (first 3, which are unlocked) start revealed
    const free = new Set<number>();
    puzzle.clues.forEach((c, i) => {
      if (!c.locked) free.add(i);
    });
    return free;
  });
  const [eliminatedSuspects, setEliminatedSuspects] = useState<Set<number>>(
    () => {
      // Auto-eliminate from initially revealed alibi clues
      const elim = new Set<number>();
      puzzle.clues.forEach((c, i) => {
        if (!c.locked && c.type === 'alibi' && c.clearsIndex >= 0) {
          elim.add(c.clearsIndex);
        }
      });
      return elim;
    }
  );
  const [timePenalty, setTimePenalty] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cluesUsed = revealedClues.size;
  const totalClues = puzzle.clues.length;

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Check localStorage for completion
  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    if (storage.getItem(storageKey) === '1') {
      setAlreadyCompleted(true);
    }
  }, [storageKey]);

  // Save completion
  useEffect(() => {
    if (gameState === 'playing') return;
    const storage = getStorage();
    storage?.setItem(storageKey, '1');
  }, [gameState, storageKey]);

  const totalTime = elapsedSeconds + timePenalty;

  const handleRevealClue = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (revealedClues.has(index)) return;

      const newRevealed = new Set(revealedClues);
      newRevealed.add(index);
      setRevealedClues(newRevealed);
      setTimePenalty((prev) => prev + TIME_PENALTY);

      // Auto-eliminate if alibi
      const clue = puzzle.clues[index];
      if (clue.type === 'alibi' && clue.clearsIndex >= 0) {
        setEliminatedSuspects((prev) => {
          const next = new Set(prev);
          next.add(clue.clearsIndex);
          return next;
        });
      }
    },
    [gameState, revealedClues, puzzle.clues]
  );

  const handleSelectSuspect = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (eliminatedSuspects.has(index)) return;
      setSelectedSuspect((prev) => (prev === index ? null : index));
    },
    [gameState, eliminatedSuspects]
  );

  const handleAccuse = useCallback(() => {
    if (selectedSuspect === null || gameState !== 'playing') return;
    if (selectedSuspect === puzzle.killerIndex) {
      setGameState('won');
    } else {
      setGameState('lost');
    }
  }, [selectedSuspect, gameState, puzzle.killerIndex]);

  const shareText = useMemo(() => {
    const result = gameState === 'won' ? '✅ Case Closed' : '❌ Wrong Suspect';
    return [
      `🔍 Whodunit — ${dateLabel}`,
      result,
      `⏱ ${formatTime(totalTime)} · ${cluesUsed}/${totalClues} clues`,
      'daybreak.com',
    ].join('\n');
  }, [gameState, dateLabel, totalTime, cluesUsed, totalClues]);

  const handleCopyResults = useCallback(async () => {
    if (Platform.OS !== 'web') return;
    const clipboard = (
      globalThis as typeof globalThis & {
        navigator?: {
          clipboard?: { writeText?: (text: string) => Promise<void> };
        };
      }
    ).navigator?.clipboard;
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

  const killer = puzzle.suspects[puzzle.killerIndex];

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Whodunit',
          headerBackTitle: 'Home',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.caseHeader}>
            <Text style={styles.caseTitle}>Whodunit</Text>
            <Text style={styles.caseNumber}>
              Case #{String(puzzle.caseNumber).padStart(3, '0')} — {puzzle.caseName}
            </Text>
          </View>

          {/* Timer */}
          {gameState === 'playing' && (
            <View style={styles.timerRow}>
              <Text style={styles.timerText}>⏱ {formatTime(totalTime)}</Text>
              {timePenalty > 0 && (
                <Text style={styles.penaltyText}>
                  (+{timePenalty}s penalty)
                </Text>
              )}
            </View>
          )}

          {/* Crime scene narrative */}
          <View style={styles.narrativeCard}>
            <Text style={styles.narrativeText}>"{puzzle.narrative}"</Text>
          </View>

          {/* Suspects grid */}
          <View style={styles.suspectsGrid}>
            {puzzle.suspects.map((suspect, i) => {
              const isEliminated = eliminatedSuspects.has(i);
              const isSelected = selectedSuspect === i;
              return (
                <Pressable
                  key={i}
                  style={[
                    styles.suspectCard,
                    isEliminated && styles.suspectEliminated,
                    isSelected && styles.suspectSelected,
                  ]}
                  onPress={() => handleSelectSuspect(i)}
                  disabled={isEliminated || gameState !== 'playing'}
                >
                  <Text style={styles.suspectEmoji}>{suspect.emoji}</Text>
                  <Text
                    style={[
                      styles.suspectName,
                      isEliminated && styles.suspectTextEliminated,
                    ]}
                  >
                    {suspect.name}
                  </Text>
                  <Text
                    style={[
                      styles.suspectTrait,
                      isEliminated && styles.suspectTextEliminated,
                    ]}
                    numberOfLines={2}
                  >
                    {suspect.trait}
                  </Text>
                  {isEliminated && (
                    <View style={styles.eliminatedOverlay}>
                      <Text style={styles.eliminatedX}>✕</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Clues */}
          <View style={styles.cluesSection}>
            <Text style={styles.cluesHeader}>
              Clues Revealed ({cluesUsed} / {totalClues})
            </Text>
            {puzzle.clues.map((clue, i) => {
              const isRevealed = revealedClues.has(i);
              return (
                <View key={i} style={styles.clueRow}>
                  {isRevealed ? (
                    <>
                      <View style={styles.clueNumber}>
                        <Text style={styles.clueNumberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.clueText}>{clue.text}</Text>
                    </>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.lockedClue,
                        pressed && styles.lockedCluePressed,
                      ]}
                      onPress={() => handleRevealClue(i)}
                      disabled={gameState !== 'playing'}
                    >
                      <View style={styles.clueNumberLocked}>
                        <Text style={styles.clueNumberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.lockedClueText}>
                        Tap to reveal (+{TIME_PENALTY}s)
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>

          {/* Accusation button */}
          {gameState === 'playing' && (
            <Pressable
              style={({ pressed }) => [
                styles.accuseButton,
                pressed && selectedSuspect !== null && styles.accuseButtonPressed,
                selectedSuspect === null && styles.accuseButtonDisabled,
              ]}
              onPress={handleAccuse}
              disabled={selectedSuspect === null}
            >
              <Text style={styles.accuseButtonText}>
                {selectedSuspect !== null
                  ? `🔎 Accuse ${puzzle.suspects[selectedSuspect].name}`
                  : '🔎 Make Accusation'}
              </Text>
            </Pressable>
          )}

          {/* Result modal */}
          {gameState !== 'playing' && (
            <View style={styles.resultCard}>
              <Text style={styles.resultEmoji}>
                {gameState === 'won' ? '🎉' : '😔'}
              </Text>
              <Text style={styles.resultTitle}>
                {gameState === 'won' ? 'Case Closed!' : 'Wrong Suspect'}
              </Text>

              {gameState === 'lost' && (
                <Text style={styles.resultReveal}>
                  The killer was {killer.name}.
                </Text>
              )}

              <View style={styles.solutionBox}>
                <Text style={styles.solutionLabel}>Solution</Text>
                <Text style={styles.solutionText}>
                  {killer.name} used {puzzle.weapon.name} in{' '}
                  {puzzle.room.name}.
                </Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {formatTime(totalTime)}
                  </Text>
                  <Text style={styles.statLabel}>Time</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {cluesUsed}/{totalClues}
                  </Text>
                  <Text style={styles.statLabel}>Clues</Text>
                </View>
              </View>

              {/* Share */}
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },

  // Case header
  caseHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  caseTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    fontStyle: 'italic',
  },
  caseNumber: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },

  // Timer
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  timerText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  penaltyText: {
    fontSize: FontSize.sm,
    color: Colors.accent,
    fontWeight: '600',
  },

  // Narrative
  narrativeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  narrativeText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },

  // Suspects
  suspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  suspectCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
  },
  suspectSelected: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(255, 77, 109, 0.06)',
  },
  suspectEliminated: {
    opacity: 0.45,
    backgroundColor: Colors.surfaceLight,
  },
  suspectEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  suspectName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  suspectTrait: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  suspectTextEliminated: {
    color: Colors.textMuted,
  },
  eliminatedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eliminatedX: {
    fontSize: 48,
    color: Colors.error,
    fontWeight: '800',
    opacity: 0.3,
  },

  // Clues
  cluesSection: {
    marginBottom: Spacing.lg,
  },
  cluesHeader: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: Spacing.md,
  },
  clueRow: {
    marginBottom: Spacing.sm,
  },
  clueNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: Spacing.md,
    top: Spacing.md,
  },
  clueNumberLocked: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  clueNumberText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  clueText: {
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: 22,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    paddingLeft: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  lockedClue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  lockedCluePressed: {
    backgroundColor: Colors.border,
  },
  lockedClueText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Accuse button
  accuseButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  accuseButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  accuseButtonDisabled: {
    opacity: 0.5,
  },
  accuseButtonText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Result
  resultCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
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
  resultReveal: {
    fontSize: FontSize.md,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  solutionBox: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  solutionLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  solutionText: {
    fontSize: FontSize.md,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },

  // Share
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

  // Navigation
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
