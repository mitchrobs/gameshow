import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import {
  getDailyWhodunit,
  getDateLabel,
  WhodunitPuzzle,
  Clue,
} from '../src/data/whodunitPuzzles';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const TIME_PENALTY = 10;
const STORAGE_PREFIX = 'whodunit';
const WEB_NO_SELECT =
  Platform.OS === 'web'
    ? {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }
    : {};

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
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('whodunit', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const Colors = theme.colors;
  const router = useRouter();
  const dateKey = useMemo(() => getLocalDateKey(), []);
  const dateLabel = useMemo(() => getDateLabel(), []);
  const storageKey = `${STORAGE_PREFIX}:daily:${dateKey}`;

  const puzzle = useMemo<WhodunitPuzzle>(() => getDailyWhodunit(), []);

  // Game state
  const [gameState, setGameState] = useState<GameState>('playing');
  const [selectedSuspect, setSelectedSuspect] = useState<number | null>(null);
  const [leadChoiceId, setLeadChoiceId] = useState<string | null>(null);
  const initialRevealed = useMemo(() => {
    const free: number[] = [];
    puzzle.clues.forEach((c, i) => {
      if (!c.locked) free.push(i);
    });
    return free;
  }, [puzzle.clues]);
  const [revealedClues, setRevealedClues] = useState<Set<number>>(
    () => new Set(initialRevealed)
  );
  const [revealedOrder, setRevealedOrder] = useState<number[]>(() => initialRevealed);
  const [eliminatedSuspects, setEliminatedSuspects] = useState<Set<number>>(
    () => new Set<number>()
  );
  const [timePenalty, setTimePenalty] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [showLeadCard, setShowLeadCard] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const leadCardAnim = useRef(new Animated.Value(1)).current;

  const cluesUsed = revealedClues.size;
  const totalClues = puzzle.clues.length;
  const leadChoiceLabel = useMemo(() => {
    if (!leadChoiceId) return null;
    const choice = puzzle.leadChoices.find((c) => c.clueId === leadChoiceId);
    return choice?.label ?? null;
  }, [leadChoiceId, puzzle.leadChoices]);
  const unlockedClues = useMemo(
    () =>
      revealedOrder.map((index, orderIndex) => ({
        clue: puzzle.clues[index],
        displayNumber: orderIndex + 1,
      })),
    [puzzle.clues, revealedOrder]
  );
  const remainingLockedClues = useMemo(
    () =>
      puzzle.clues
        .map((clue, index) => ({ clue, index }))
        .filter(({ clue, index }) => clue.locked && !revealedClues.has(index)),
    [puzzle.clues, revealedClues]
  );

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

  const hasStartedRef = useRef(false);
  const markPlayStarted = useCallback(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const storage = getStorage();
    if (storage) {
      const key = `${STORAGE_PREFIX}:playcount:${dateKey}`;
      const current = parseInt(storage.getItem(key) || '0', 10);
      storage.setItem(key, String(current + 1));
    }
    incrementGlobalPlayCount('whodunit');
  }, [dateKey]);

  const totalTime = elapsedSeconds + timePenalty;

  const handleRevealClue = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (revealedClues.has(index)) return;
      markPlayStarted();

      const newRevealed = new Set(revealedClues);
      newRevealed.add(index);
      setRevealedClues(newRevealed);
      setRevealedOrder((prev) => (prev.includes(index) ? prev : [...prev, index]));
      setTimePenalty((prev) => prev + TIME_PENALTY);

      // No auto-elimination — player decides who to eliminate
    },
    [gameState, markPlayStarted, revealedClues]
  );

  const handleSelectLead = useCallback(
    (choiceId: string) => {
      if (gameState !== 'playing') return;
      if (leadChoiceId) return;
      const clueIndex = puzzle.clues.findIndex((c) => c.id === choiceId);
      if (clueIndex === -1) return;
      markPlayStarted();
      if (!revealedClues.has(clueIndex)) {
        const next = new Set(revealedClues);
        next.add(clueIndex);
        setRevealedClues(next);
        setRevealedOrder((prev) =>
          prev.includes(clueIndex) ? prev : [...prev, clueIndex]
        );
      }
      setLeadChoiceId(choiceId);
      Animated.timing(leadCardAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowLeadCard(false);
      });
    },
    [gameState, leadCardAnim, leadChoiceId, markPlayStarted, puzzle.clues, revealedClues]
  );

  const handleSelectSuspect = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      if (eliminatedSuspects.has(index)) return;
      markPlayStarted();
      setSelectedSuspect((prev) => (prev === index ? null : index));
    },
    [gameState, eliminatedSuspects, markPlayStarted]
  );

  const handleToggleEliminate = useCallback(
    (index: number) => {
      if (gameState !== 'playing') return;
      markPlayStarted();
      setEliminatedSuspects((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
      if (selectedSuspect === index) {
        setSelectedSuspect(null);
      }
    },
    [gameState, markPlayStarted, selectedSuspect]
  );

  const handleAccuse = useCallback(() => {
    if (selectedSuspect === null || gameState !== 'playing') return;
    markPlayStarted();
    if (selectedSuspect === puzzle.killerIndex) {
      setGameState('won');
    } else {
      setGameState('lost');
    }
  }, [selectedSuspect, gameState, markPlayStarted, puzzle.killerIndex]);

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
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          stickyHeaderIndices={[0]}
        >
          <View style={styles.stickyHeader}>
            <View style={styles.stickyHeaderInner}>
              <View style={styles.stickyHeaderRow}>
                <View style={styles.stickyCaseMeta}>
                  <Text style={styles.stickyCaseId}>
                    Case #{String(puzzle.caseNumber).padStart(3, '0')}
                  </Text>
                  <Text
                    style={styles.stickyCaseName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {puzzle.caseName}
                  </Text>
                </View>
                <View style={styles.stickyStatsRow}>
                  {gameState === 'playing' ? (
                    <>
                      <View style={styles.stickyChip}>
                        <Text style={styles.stickyChipText}>
                          Time {formatTime(totalTime)}
                        </Text>
                      </View>
                      <View style={styles.stickyChip}>
                        <Text style={styles.stickyChipText}>
                          Clues {cluesUsed}/{totalClues}
                        </Text>
                      </View>
                      {timePenalty > 0 && (
                        <View style={[styles.stickyChip, styles.stickyChipPenalty]}>
                          <Text style={styles.stickyChipPenaltyText}>+{timePenalty}s</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      <View style={styles.stickyChip}>
                        <Text style={styles.stickyChipText}>
                          {gameState === 'won' ? 'Solved' : 'Missed'}
                        </Text>
                      </View>
                      <View style={styles.stickyChip}>
                        <Text style={styles.stickyChipText}>
                          Time {formatTime(totalTime)}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.page}>
            <View style={styles.pageAccent} />

            {/* Unified case board */}
            <View style={styles.caseBoard}>
              <Text style={styles.caseBoardTitle}>Case Board</Text>
              <View style={styles.caseVisual}>
                <View style={styles.caseVisualBadge}>
                  <Text style={styles.caseVisualEmoji}>{puzzle.setting.icon}</Text>
                </View>
                <View style={styles.caseVisualText}>
                  <Text style={styles.caseVisualKicker}>{puzzle.setting.description}</Text>
                  <Text style={styles.caseVisualTitle}>{puzzle.caseName}</Text>
                </View>
              </View>
              <Text style={styles.caseNarrative}>{puzzle.narrative}</Text>
              <View style={styles.caseBoardRow}>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Victim</Text>
                  <Text style={styles.caseChipValue}>
                    {puzzle.victim.name} ({puzzle.victim.title})
                  </Text>
                </View>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Setting</Text>
                  <Text style={styles.caseChipValue}>{puzzle.setting.description}</Text>
                </View>
              </View>
              <View style={styles.caseBoardRow}>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Weapon</Text>
                  <Text style={styles.caseChipValue}>{puzzle.weapon.name}</Text>
                </View>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Room</Text>
                  <Text style={styles.caseChipValue}>{puzzle.room.name}</Text>
                </View>
              </View>
              <View style={styles.caseBoardRow}>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Time of death</Text>
                  <Text style={styles.caseChipValue}>{puzzle.timeOfDeath}</Text>
                </View>
                <View style={styles.caseChip}>
                  <Text style={styles.caseChipLabel}>Window</Text>
                  <Text style={styles.caseChipValue}>{puzzle.timeWindow}</Text>
                </View>
              </View>
              <View style={styles.caseUnlocked}>
                <Text style={styles.caseUnlockedTitle}>Unlocked clues</Text>
                {unlockedClues.length === 0 ? (
                  <Text style={styles.caseUnlockedEmpty}>No clues yet.</Text>
                ) : (
                  unlockedClues.map(({ clue, displayNumber }) => (
                    <View key={clue.id} style={styles.caseUnlockedItem}>
                      <Text style={styles.caseUnlockedNumber}>{displayNumber}</Text>
                      <Text style={styles.caseUnlockedText}>{clue.text}</Text>
                    </View>
                  ))
                )}
                {leadChoiceId !== null && (
                  <View style={styles.caseLockedClues}>
                    {remainingLockedClues.length === 0 ? (
                      <Text style={styles.caseLockedCluesEmpty}>No more clues left.</Text>
                    ) : (
                      remainingLockedClues.map(({ clue, index }) => (
                        <Pressable
                          key={clue.id}
                          style={({ pressed }) => [
                            styles.lockedClue,
                            styles.caseLockedClueItem,
                            pressed && styles.lockedCluePressed,
                          ]}
                          onPress={() => handleRevealClue(index)}
                          disabled={gameState !== 'playing'}
                        >
                          <View style={styles.clueNumberLocked}>
                            <Text style={styles.clueNumberText}>•</Text>
                          </View>
                          <Text style={styles.lockedClueText}>Tap to reveal +{TIME_PENALTY}s</Text>
                        </Pressable>
                      ))
                    )}
                    {leadChoiceLabel && (
                      <Text style={styles.caseLeadPicked}>Lead chosen: {leadChoiceLabel}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>

          {/* Lead choice */}
          {showLeadCard && (
            <Animated.View
              style={[
                styles.leadCardAnimated,
                {
                  opacity: leadCardAnim,
                  transform: [{ scaleY: leadCardAnim }],
                },
              ]}
            >
              <View style={styles.leadCard}>
                <Text style={styles.leadTitle}>{puzzle.leadPrompt}</Text>
                <Text style={styles.leadSubtitle}>
                  Pick one lead to reveal a clue immediately.
                </Text>
                {leadChoiceId === null ? (
                  <View style={styles.leadChoiceRow}>
                    {puzzle.leadChoices.map((choice) => (
                      <Pressable
                        key={choice.clueId}
                        style={({ pressed }) => [
                          styles.leadChoice,
                          pressed && styles.leadChoicePressed,
                        ]}
                        onPress={() => handleSelectLead(choice.clueId)}
                      >
                        <View style={styles.leadRadio}>
                          <View style={styles.leadRadioDot} />
                        </View>
                        <View style={styles.leadChoiceContent}>
                          <Text style={styles.leadChoiceLabel}>{choice.label}</Text>
                          <Text style={styles.leadChoiceDesc}>{choice.description}</Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.leadPicked}>Lead locked in. Updating clues...</Text>
                )}
              </View>
            </Animated.View>
          )}

          {/* Suspects board */}
          <View style={[styles.suspectsBoard, styles.noSelect]}>
            <View style={styles.suspectsHeaderRow}>
              <Text selectable={false} style={styles.suspectsTitle}>
                Suspects Board
              </Text>
              <View style={styles.suspectsCounter}>
                <Text
                  pointerEvents="none"
                  selectable={false}
                  style={[styles.suspectsCounterText, styles.noSelectText]}
                >
                  Active {puzzle.suspects.length - eliminatedSuspects.size} • Eliminated{' '}
                  {eliminatedSuspects.size}
                </Text>
              </View>
            </View>
            <View style={[styles.suspectsGrid, styles.noSelect]}>
              {puzzle.suspects.map((suspect, i) => {
                const isEliminated = eliminatedSuspects.has(i);
                const isSelected = selectedSuspect === i;
                return (
                  <Pressable
                    key={i}
                    style={({ pressed }) => [
                      styles.suspectCard,
                      styles.noSelect,
                      isEliminated && styles.suspectCardEliminated,
                      isSelected && styles.suspectSelected,
                      pressed && styles.suspectCardPressed,
                    ]}
                    onPress={() => handleSelectSuspect(i)}
                    onLongPress={() => handleToggleEliminate(i)}
                    delayLongPress={250}
                    disabled={gameState !== 'playing'}
                  >
                    <Text
                      pointerEvents="none"
                      selectable={false}
                      style={[styles.suspectEmoji, styles.noSelectText]}
                    >
                      {suspect.emoji}
                    </Text>
                    <Text
                      pointerEvents="none"
                      selectable={false}
                      style={[
                        styles.suspectName,
                        isEliminated && styles.suspectTextEliminated,
                        styles.noSelectText,
                      ]}
                    >
                      {suspect.name}
                    </Text>
                    <Text
                      pointerEvents="none"
                      selectable={false}
                      style={[
                        styles.suspectTrait,
                        isEliminated && styles.suspectTextEliminated,
                        styles.noSelectText,
                      ]}
                      numberOfLines={2}
                    >
                      {suspect.trait}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text
              pointerEvents="none"
              selectable={false}
              style={[styles.suspectHint, styles.noSelectText]}
            >
              Tap to select • Long-press to eliminate
            </Text>
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
              {selectedSuspect === null && (
                <Text style={styles.accuseHelper}>Select a suspect first.</Text>
              )}
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

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSoft,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  stickyHeader: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
    elevation: 4,
  },
  stickyHeaderInner: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: Spacing.xs,
  },
  page: {
    ...ui.page,
  },
  pageAccent: {
    ...ui.accentBar,
    marginBottom: Spacing.md,
  },

  stickyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 54,
    gap: Spacing.md,
    flexWrap: 'nowrap',
  },
  stickyCaseMeta: {
    flex: 1,
    minWidth: 0,
  },
  stickyCaseId: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontWeight: '600',
  },
  stickyCaseName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  stickyStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexShrink: 0,
  },
  stickyChip: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  stickyChipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stickyChipPenalty: {
    backgroundColor: screenAccent.soft,
    borderColor: screenAccent.main,
  },
  stickyChipPenaltyText: {
    fontSize: FontSize.sm,
    color: screenAccent.main,
    fontWeight: '700',
  },

  // Narrative
  caseBoard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caseVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  caseVisualBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caseVisualEmoji: {
    fontSize: 28,
  },
  caseVisualText: {
    flex: 1,
    minWidth: 0,
  },
  caseVisualKicker: {
    fontSize: FontSize.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  caseVisualTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  caseNarrative: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontStyle: 'normal',
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  caseBoardTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    marginBottom: Spacing.sm,
  },
  caseBoardRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  caseChip: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  caseChipLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  caseChipValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '600',
  },
  caseUnlocked: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  caseLockedClues: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  caseLockedClueItem: {
    marginTop: 0,
  },
  caseLockedCluesEmpty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  caseLeadPicked: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  caseUnlockedTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  caseUnlockedEmpty: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  caseUnlockedItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  caseUnlockedNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: screenAccent.main,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 11,
    fontWeight: '700',
  },
  caseUnlockedText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 18,
    flex: 1,
    minWidth: 0,
  },
  leadCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leadCardAnimated: {
    overflow: 'hidden',
  },
  leadTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  leadSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  leadChoiceRow: {
    gap: Spacing.sm,
  },
  leadChoice: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  leadChoicePressed: {
    backgroundColor: Colors.border,
  },
  leadChoiceSelected: {
    borderColor: screenAccent.main,
    backgroundColor: screenAccent.soft,
    shadowColor: screenAccent.main,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  leadChoiceDisabled: {
    opacity: 0.5,
  },
  leadRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  leadRadioDotActive: {
    backgroundColor: screenAccent.main,
  },
  leadChoiceContent: {
    flex: 1,
  },
  leadChoiceLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  leadChoiceDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  leadPicked: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  suspectsBoard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...WEB_NO_SELECT,
  },
  noSelect: {
    ...WEB_NO_SELECT,
  },
  noSelectText: {
    ...WEB_NO_SELECT,
  },
  suspectsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  suspectsTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  suspectsCounter: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  suspectsCounterText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // Suspects
  suspectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  suspectCard: {
    width: '48%',
    flexBasis: '48%',
    flexGrow: 0,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
    overflow: 'hidden',
    ...WEB_NO_SELECT,
  },
  suspectCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  suspectSelected: {
    borderColor: screenAccent.main,
    backgroundColor: screenAccent.soft,
    shadowColor: screenAccent.main,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  suspectCardEliminated: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.border,
    opacity: 0.65,
  },
  suspectEmoji: {
    fontSize: 28,
    marginBottom: 2,
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
  suspectHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  suspectTextEliminated: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },

  // Clues / Lead result
  clueNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: screenAccent.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
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
  lockedClue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    flex: 1,
    gap: Spacing.sm,
  },
  lockedCluePressed: {
    backgroundColor: Colors.border,
  },
  lockedClueText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: '600',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  // Accuse button
  accuseButton: {
    ...ui.cta,
    backgroundColor: screenAccent.main,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  accuseButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  accuseButtonDisabled: {
    opacity: 0.5,
  },
  accuseButtonText: {
    ...ui.ctaText,
    fontSize: FontSize.lg,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  accuseHelper: {
    marginTop: 4,
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.7,
  },

  // Result
  resultCard: {
    ...ui.card,
    alignItems: 'center',
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
  resultReveal: {
    fontSize: FontSize.md,
    color: screenAccent.main,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
  solutionBox: {
    width: '100%',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
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
    marginTop: Spacing.md,
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
    padding: Spacing.sm,
    marginTop: Spacing.md,
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
    marginTop: Spacing.xs,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  shareText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    lineHeight: 18,
  },
  shareButton: {
    ...ui.cta,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs,
    marginTop: Spacing.xs,
  },
  shareButtonPressed: {
    ...ui.ctaPressed,
  },
  shareButtonText: {
    ...ui.ctaText,
    textTransform: 'none',
    letterSpacing: 0.6,
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
};
