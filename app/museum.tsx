import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Image,
  Linking,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { BUILD_ID } from '../src/constants/build';
import {
  getDailyMuseumArtwork,
  getMuseumLocalDateKey,
  getNextMuseumArtwork,
  type MuseumArtwork,
} from '../src/data/museumArtworks';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const STORAGE_PREFIX = 'museum';
const REVEAL_CONTEXT_SECONDS = 30;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

type MuseumPhase = 'reveal' | 'context' | 'quiz' | 'result';

interface PassportStats {
  seen: number;
  correct: number;
  total: number;
}

interface PassportEntry {
  date: string;
  artworkId: string;
  score: number;
  periodKey: string;
  periodTag: string;
  mediumCategory: string;
  museum: string;
  geoRegion: string;
}

interface MuseumPassport {
  artworkIds: string[];
  days: Record<string, PassportEntry>;
  periodStats: Record<string, PassportStats>;
  mediumStats: Record<string, PassportStats>;
  museumStats: Record<string, PassportStats>;
  geoRegionStats: Record<string, PassportStats>;
}

interface MuseumStreak {
  count: number;
  lastPlayed: string;
}

function getStorage(): Storage | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function createEmptyPassport(): MuseumPassport {
  return {
    artworkIds: [],
    days: {},
    periodStats: {},
    mediumStats: {},
    museumStats: {},
    geoRegionStats: {},
  };
}

function readPassport(storage: Storage): MuseumPassport {
  const raw = storage.getItem(`${STORAGE_PREFIX}:passport`);
  if (!raw) return createEmptyPassport();
  try {
    const parsed = JSON.parse(raw) as MuseumPassport;
    return {
      artworkIds: Array.isArray(parsed.artworkIds) ? parsed.artworkIds : [],
      days: parsed.days ?? {},
      periodStats: parsed.periodStats ?? {},
      mediumStats: parsed.mediumStats ?? {},
      museumStats: parsed.museumStats ?? {},
      geoRegionStats: parsed.geoRegionStats ?? {},
    };
  } catch {
    return createEmptyPassport();
  }
}

function readStreak(storage: Storage): MuseumStreak {
  const raw = storage.getItem(`${STORAGE_PREFIX}:streak`);
  if (!raw) return { count: 0, lastPlayed: '' };
  try {
    const parsed = JSON.parse(raw) as MuseumStreak;
    return {
      count: Number.isFinite(parsed.count) ? parsed.count : 0,
      lastPlayed: typeof parsed.lastPlayed === 'string' ? parsed.lastPlayed : '',
    };
  } catch {
    return { count: 0, lastPlayed: '' };
  }
}

function getPreviousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map((part) => parseInt(part, 10));
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getMuseumLocalDateKey(date);
}

function ensureStats(
  bucket: Record<string, PassportStats>,
  key: string
): PassportStats {
  if (!bucket[key]) {
    bucket[key] = { seen: 0, correct: 0, total: 0 };
  }
  return bucket[key];
}

function recordPassportEntry(
  storage: Storage,
  artwork: MuseumArtwork,
  dateKey: string,
  score: number
): { passport: MuseumPassport; streak: MuseumStreak } {
  const passport = readPassport(storage);
  const alreadyRecorded = Boolean(passport.days[dateKey]);

  if (!alreadyRecorded) {
    passport.days[dateKey] = {
      date: dateKey,
      artworkId: artwork.id,
      score,
      periodKey: artwork.periodKey,
      periodTag: artwork.periodTag,
      mediumCategory: artwork.mediumCategory,
      museum: 'Metropolitan Museum of Art',
      geoRegion: artwork.geoRegion,
    };

    if (!passport.artworkIds.includes(artwork.id)) {
      passport.artworkIds.push(artwork.id);
    }

    const statBuckets: Array<[Record<string, PassportStats>, string]> = [
      [passport.periodStats, artwork.periodKey],
      [passport.mediumStats, artwork.mediumCategory],
      [passport.museumStats, 'Metropolitan Museum of Art'],
      [passport.geoRegionStats, artwork.geoRegion],
    ];

    statBuckets.forEach(([bucket, key]) => {
      const stats = ensureStats(bucket, key);
      stats.seen += 1;
      stats.correct += score;
      stats.total += artwork.questions.length;
    });
  }

  storage.setItem(`${STORAGE_PREFIX}:daily:${dateKey}`, '1');
  storage.setItem(`${STORAGE_PREFIX}:passport`, JSON.stringify(passport));

  const currentStreak = readStreak(storage);
  let nextStreak = currentStreak;
  if (currentStreak.lastPlayed !== dateKey) {
    const previousDateKey = getPreviousDateKey(dateKey);
    nextStreak = {
      count: currentStreak.lastPlayed === previousDateKey ? currentStreak.count + 1 : 1,
      lastPlayed: dateKey,
    };
  }

  storage.setItem(`${STORAGE_PREFIX}:streak`, JSON.stringify(nextStreak));
  return { passport, streak: nextStreak };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]): number {
  if (touches.length < 2) return 1;
  const [first, second] = touches;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
}

function getShortFact(fact: string): string {
  const firstSentence = fact.split('. ')[0] ?? fact;
  return firstSentence.length > 96 ? `${firstSentence.slice(0, 93)}...` : firstSentence;
}

interface ArtworkViewerProps {
  artwork: MuseumArtwork;
  height: number;
  styles: ReturnType<typeof createStyles>;
}

function ArtworkViewer({ artwork, height, styles }: ArtworkViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const gestureRef = useRef({
    startDistance: 1,
    startZoom: 1,
    startPan: { x: 0, y: 0 },
  });

  const updateZoom = useCallback((value: number) => {
    const nextZoom = clamp(value, MIN_ZOOM, MAX_ZOOM);
    zoomRef.current = nextZoom;
    setZoom(nextZoom);
    if (nextZoom === MIN_ZOOM) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
    }
  }, []);

  const updatePan = useCallback((value: { x: number; y: number }) => {
    if (zoomRef.current <= MIN_ZOOM) {
      panRef.current = { x: 0, y: 0 };
      setPan({ x: 0, y: 0 });
      return;
    }
    const limit = 120 * zoomRef.current;
    const nextPan = {
      x: clamp(value.x, -limit, limit),
      y: clamp(value.y, -limit, limit),
    };
    panRef.current = nextPan;
    setPan(nextPan);
  }, []);

  const resetView = useCallback(() => {
    updateZoom(MIN_ZOOM);
    updatePan({ x: 0, y: 0 });
  }, [updatePan, updateZoom]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
        onPanResponderGrant: (event: GestureResponderEvent) => {
          const touches = event.nativeEvent.touches;
          gestureRef.current = {
            startDistance: getTouchDistance(touches),
            startZoom: zoomRef.current,
            startPan: panRef.current,
          };
        },
        onPanResponderMove: (
          event: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          const touches = event.nativeEvent.touches;
          if (touches.length >= 2) {
            const nextZoom =
              gestureRef.current.startZoom *
              (getTouchDistance(touches) / gestureRef.current.startDistance);
            updateZoom(nextZoom);
            return;
          }

          updatePan({
            x: gestureRef.current.startPan.x + gestureState.dx,
            y: gestureRef.current.startPan.y + gestureState.dy,
          });
        },
      }),
    [updatePan, updateZoom]
  );

  useEffect(() => {
    Image.prefetch(zoom > 1.05 ? artwork.images.fullUrl : artwork.images.displayUrl);
  }, [artwork.images.displayUrl, artwork.images.fullUrl, zoom]);

  return (
    <View style={[styles.viewer, { height }]}>
      <View style={styles.viewerImageClip} {...panResponder.panHandlers}>
        <Image
          source={{ uri: zoom > 1.05 ? artwork.images.fullUrl : artwork.images.displayUrl }}
          style={[
            styles.artworkImage,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: zoom },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.zoomControls}>
        <Pressable style={styles.zoomButton} onPress={() => updateZoom(zoom + 0.35)}>
          <Text style={styles.zoomButtonText}>+</Text>
        </Pressable>
        <Pressable style={styles.zoomButton} onPress={() => updateZoom(zoom - 0.35)}>
          <Text style={styles.zoomButtonText}>-</Text>
        </Pressable>
        <Pressable style={styles.zoomResetButton} onPress={resetView}>
          <Text style={styles.zoomResetText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function MuseumScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('museum', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const { height } = useWindowDimensions();
  const activeDate = useMemo(() => new Date(), []);
  const dateKey = useMemo(() => getMuseumLocalDateKey(activeDate), [activeDate]);
  const dateLabel = useMemo(
    () =>
      activeDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    [activeDate]
  );
  const artwork = useMemo(() => getDailyMuseumArtwork(activeDate), [activeDate]);
  const nextArtwork = useMemo(() => getNextMuseumArtwork(activeDate), [activeDate]);
  const [phase, setPhase] = useState<MuseumPhase>('reveal');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [contextUnlocked, setContextUnlocked] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>(
    Array.from({ length: artwork.questions.length }, () => null)
  );
  const [museumStreak, setMuseumStreak] = useState(0);
  const [periodSeen, setPeriodSeen] = useState(0);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const hasRecordedRef = useRef(false);
  const hasCountedRef = useRef(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const score = useMemo<number>(
    () =>
      selectedAnswers.reduce<number>((total, answer, index) => {
        return total + (answer === artwork.questions[index].answerIndex ? 1 : 0);
      }, 0),
    [artwork.questions, selectedAnswers]
  );

  const currentQuestion = artwork.questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestionIndex];
  const resultLabel = score === 3 ? 'Perfect' : score === 2 ? 'Sharp looking' : score === 1 ? 'One detail caught' : 'Still seen';
  const viewerHeight = Math.max(420, Math.min(720, height - 32));

  const shareText = useMemo(
    () =>
      [
        `Museum ${dateLabel}`,
        `Today: ${artwork.title} (${artwork.objectDate})`,
        `Score: ${score}/3 - Streak: ${museumStreak}`,
        `"${getShortFact(artwork.context.surprisingFact)}"`,
        'Daybreak',
      ].join('\n'),
    [artwork.context.surprisingFact, artwork.objectDate, artwork.title, dateLabel, museumStreak, score]
  );

  useEffect(() => {
    Image.prefetch(artwork.images.displayUrl);
    Image.prefetch(nextArtwork.images.displayUrl);
  }, [artwork.images.displayUrl, nextArtwork.images.displayUrl]);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    const passport = readPassport(storage);
    const streak = readStreak(storage);
    setMuseumStreak(streak.count);
    setPeriodSeen(passport.periodStats[artwork.periodKey]?.seen ?? 0);
  }, [artwork.periodKey]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  useEffect(() => {
    if (phase !== 'reveal' || contextUnlocked) return undefined;
    const id = setInterval(() => {
      setElapsedSeconds((seconds) => {
        const next = seconds + 1;
        if (next >= REVEAL_CONTEXT_SECONDS) {
          setContextUnlocked(true);
          setPhase('context');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [contextUnlocked, phase]);

  useEffect(() => {
    setShareStatus(null);
  }, [shareText]);

  useEffect(() => {
    if (phase !== 'result') return;

    if (!hasRecordedRef.current) {
      hasRecordedRef.current = true;
      const storage = getStorage();
      if (storage) {
        const { passport, streak } = recordPassportEntry(storage, artwork, dateKey, score);
        setMuseumStreak(streak.count);
        setPeriodSeen(passport.periodStats[artwork.periodKey]?.seen ?? 1);
      } else {
        setMuseumStreak(1);
        setPeriodSeen(1);
      }
    }

    if (!hasCountedRef.current) {
      hasCountedRef.current = true;
      incrementGlobalPlayCount('museum');
    }
  }, [artwork, dateKey, phase, score]);

  const answerQuestion = useCallback(
    (index: number) => {
      if (selectedAnswers[currentQuestionIndex] !== null) return;
      setSelectedAnswers((answers) => {
        const next = [...answers];
        next[currentQuestionIndex] = index;
        return next;
      });
    },
    [currentQuestionIndex, selectedAnswers]
  );

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= artwork.questions.length - 1) {
      setPhase('result');
      return;
    }
    setCurrentQuestionIndex((index) => index + 1);
  }, [artwork.questions.length, currentQuestionIndex]);

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

  const openArtwork = useCallback(() => {
    Linking.openURL(artwork.source.objectUrl);
  }, [artwork.source.objectUrl]);

  const showTitle = contextUnlocked || phase !== 'reveal' || elapsedSeconds >= 10;
  const showDetails = contextUnlocked || phase !== 'reveal' || elapsedSeconds >= 20;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {(phase === 'reveal' || phase === 'context') && (
          <View style={styles.stage}>
            <ArtworkViewer artwork={artwork} height={viewerHeight} styles={styles} />
            <View style={styles.stageTopbar}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>Museum</Text>
              </View>
            </View>

            {phase === 'reveal' && (
              <Animated.View
                style={[
                  styles.interestPulse,
                  {
                    opacity: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.28, 0.72],
                    }),
                    transform: [
                      {
                        scale: pulseAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.86, 1.18],
                        }),
                      },
                    ],
                  },
                ]}
              />
            )}

            <View style={styles.metadataOverlay}>
              {showTitle && (
                <>
                  <Text style={styles.artTitle}>{artwork.title}</Text>
                  <Text style={styles.artistName}>{artwork.artist}</Text>
                </>
              )}
              {showDetails && (
                <Text style={styles.artMeta}>
                  {artwork.objectDate} - {artwork.medium}
                </Text>
              )}
            </View>

            {phase === 'reveal' && (
              <Pressable
                style={({ pressed }) => [
                  styles.contextButton,
                  pressed && styles.contextButtonPressed,
                ]}
                onPress={() => {
                  setContextUnlocked(true);
                  setPhase('context');
                }}
              >
                <Text style={styles.contextButtonText}>
                  {contextUnlocked ? 'Return to the story' : 'Read the story'}
                </Text>
              </Pressable>
            )}

            {phase === 'context' && (
              <View style={styles.contextSheet}>
                <View style={styles.periodPill}>
                  <Text style={styles.periodPillText}>{artwork.periodTag}</Text>
                </View>
                <Text style={styles.contextLine}>{artwork.context.technique}</Text>
                <Text style={styles.contextFact}>{artwork.context.surprisingFact}</Text>
                <Text style={styles.contextLine}>{artwork.context.connection}</Text>
                <View style={styles.contextActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={() => setPhase('reveal')}
                  >
                    <Text style={styles.secondaryButtonText}>Look again</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.primaryButtonPressed,
                    ]}
                    onPress={() => setPhase('quiz')}
                  >
                    <Text style={styles.primaryButtonText}>Start quiz</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        {phase === 'quiz' && currentQuestion && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.page}>
              <View style={styles.pageAccent} />
              <View style={styles.quizHeader}>
                <View>
                  <Text style={styles.title}>Museum</Text>
                  <Text style={styles.subtitle}>{dateLabel}</Text>
                </View>
                <Text style={styles.quizCounter}>
                  {currentQuestionIndex + 1}/{artwork.questions.length}
                </Text>
              </View>

              <View style={styles.quizArtworkCard}>
                <Image source={{ uri: artwork.images.thumbnailUrl }} style={styles.quizThumbnail} />
                <View style={styles.quizArtworkText}>
                  <Text style={styles.quizArtworkTitle}>{artwork.title}</Text>
                  <Text style={styles.quizArtworkMeta}>{artwork.artist}</Text>
                </View>
              </View>

              <View style={styles.quizCard}>
                <Text style={styles.questionKind}>{currentQuestion.kind}</Text>
                <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
                <View style={styles.optionsList}>
                  {currentQuestion.options.map((option, index) => {
                    const showResult = selectedOption !== null;
                    const isCorrect = index === currentQuestion.answerIndex;
                    const isSelected = selectedOption === index;
                    return (
                      <Pressable
                        key={option}
                        style={({ pressed }) => [
                          styles.option,
                          pressed && styles.optionPressed,
                          showResult && isCorrect && styles.optionCorrect,
                          showResult && isSelected && !isCorrect && styles.optionWrong,
                        ]}
                        disabled={showResult}
                        onPress={() => answerQuestion(index)}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </Pressable>
                    );
                  })}
                </View>

                {selectedOption !== null && (
                  <View style={styles.reinforcementBox}>
                    <Text style={styles.reinforcementTitle}>
                      {selectedOption === currentQuestion.answerIndex ? 'Correct' : 'Good eye for trying'}
                    </Text>
                    <Text style={styles.reinforcementText}>{currentQuestion.reinforcement}</Text>
                  </View>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  selectedOption === null && styles.disabledButton,
                  pressed && selectedOption !== null && styles.primaryButtonPressed,
                ]}
                disabled={selectedOption === null}
                onPress={goToNextQuestion}
              >
                <Text style={styles.primaryButtonText}>
                  {currentQuestionIndex >= artwork.questions.length - 1 ? 'See result' : 'Next'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {phase === 'result' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.page}>
              <View style={styles.pageAccent} />
              <View style={styles.resultCard}>
                <Image source={{ uri: artwork.images.thumbnailUrl }} style={styles.resultImage} />
                <Text style={styles.resultTitle}>
                  {score}/3 - {resultLabel}
                </Text>
                <Text style={styles.resultSubtitle}>{artwork.title}</Text>
                <View style={styles.resultStats}>
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>Day {museumStreak}</Text>
                    <Text style={styles.statLabel}>Museum streak</Text>
                  </View>
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>{periodSeen}</Text>
                    <Text style={styles.statLabel}>{artwork.periodKey.replace(/-/g, ' ')}</Text>
                  </View>
                </View>

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
                        styles.primaryButton,
                        pressed && styles.primaryButtonPressed,
                      ]}
                      onPress={handleCopyResults}
                    >
                      <Text style={styles.primaryButtonText}>Copy results</Text>
                    </Pressable>
                  )}
                  {shareStatus && <Text style={styles.shareStatus}>{shareStatus}</Text>}
                </View>

                <View style={styles.resultActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={openArtwork}
                  >
                    <Text style={styles.secondaryButtonText}>Learn more</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.secondaryButtonText}>Back to games</Text>
                  </Pressable>
                </View>
                <Text style={styles.buildText}>Build: {BUILD_ID}</Text>
              </View>
            </View>
          </ScrollView>
        )}
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
      backgroundColor: '#050505',
    },
    stage: {
      flex: 1,
      backgroundColor: '#050505',
      overflow: 'hidden',
    },
    viewer: {
      width: '100%',
      backgroundColor: '#050505',
      alignItems: 'center',
      justifyContent: 'center',
    },
    viewerImageClip: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    artworkImage: {
      width: '100%',
      height: '100%',
    },
    zoomControls: {
      position: 'absolute',
      right: Spacing.md,
      top: 86,
      gap: Spacing.sm,
      alignItems: 'flex-end',
    },
    zoomButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(8, 8, 8, 0.62)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.28)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    zoomButtonText: {
      color: '#ffffff',
      fontSize: FontSize.lg,
      fontWeight: '800',
      lineHeight: 22,
    },
    zoomResetButton: {
      minHeight: 38,
      borderRadius: 19,
      backgroundColor: 'rgba(8, 8, 8, 0.62)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.28)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    zoomResetText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '700',
    },
    stageTopbar: {
      position: 'absolute',
      top: Spacing.md,
      left: Spacing.md,
      right: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      minHeight: 40,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(8, 8, 8, 0.54)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    backButtonText: {
      color: '#ffffff',
      fontSize: FontSize.sm,
      fontWeight: '700',
    },
    stageBadge: {
      minHeight: 40,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(8, 8, 8, 0.54)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.22)',
    },
    stageBadgeText: {
      color: '#ffffff',
      fontSize: FontSize.sm,
      fontWeight: '800',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    interestPulse: {
      position: 'absolute',
      left: '59%',
      top: '33%',
      width: 52,
      height: 52,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    metadataOverlay: {
      position: 'absolute',
      left: Spacing.md,
      right: Spacing.md,
      bottom: 92,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      backgroundColor: 'rgba(5, 5, 5, 0.58)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    artTitle: {
      color: '#ffffff',
      fontSize: FontSize.xl,
      fontWeight: '800',
    },
    artistName: {
      marginTop: Spacing.xs,
      color: 'rgba(255, 255, 255, 0.88)',
      fontSize: FontSize.md,
      fontWeight: '600',
    },
    artMeta: {
      marginTop: Spacing.sm,
      color: 'rgba(255, 255, 255, 0.72)',
      fontSize: FontSize.sm,
      lineHeight: 20,
    },
    contextButton: {
      position: 'absolute',
      left: Spacing.md,
      right: Spacing.md,
      bottom: Spacing.lg,
      minHeight: 52,
      borderRadius: BorderRadius.sm,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
    },
    contextButtonPressed: {
      backgroundColor: 'rgba(255, 255, 255, 0.82)',
      transform: [{ scale: 0.99 }],
    },
    contextButtonText: {
      color: '#050505',
      fontSize: FontSize.md,
      fontWeight: '800',
    },
    contextSheet: {
      position: 'absolute',
      left: Spacing.md,
      right: Spacing.md,
      bottom: Spacing.md,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.elevated,
    },
    periodPill: {
      alignSelf: 'flex-start',
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      backgroundColor: screenAccent.badgeBg,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      marginBottom: Spacing.md,
    },
    periodPillText: {
      color: screenAccent.badgeText,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    contextLine: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 21,
      marginBottom: Spacing.sm,
    },
    contextFact: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '700',
      lineHeight: 23,
      marginBottom: Spacing.sm,
    },
    contextActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
      backgroundColor: Colors.backgroundSoft,
    },
    page: {
      ...ui.page,
    },
    pageAccent: {
      ...ui.accentBar,
      marginBottom: Spacing.md,
    },
    quizHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    title: {
      ...ui.title,
    },
    subtitle: {
      ...ui.subtitle,
    },
    quizCounter: {
      ...ui.pill,
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      fontWeight: '800',
      overflow: 'hidden',
    },
    quizArtworkCard: {
      ...ui.subtleCard,
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.sm,
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    quizThumbnail: {
      width: 72,
      height: 72,
      borderRadius: BorderRadius.sm,
      backgroundColor: Colors.surface,
    },
    quizArtworkText: {
      flex: 1,
    },
    quizArtworkTitle: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '800',
    },
    quizArtworkMeta: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      marginTop: 2,
    },
    quizCard: {
      ...ui.card,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
    },
    questionKind: {
      color: screenAccent.main,
      fontSize: 12,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },
    questionText: {
      color: Colors.text,
      fontSize: FontSize.lg,
      fontWeight: '800',
      lineHeight: 26,
      marginBottom: Spacing.md,
    },
    optionsList: {
      gap: Spacing.sm,
    },
    option: {
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: Spacing.md,
    },
    optionPressed: {
      backgroundColor: Colors.border,
    },
    optionCorrect: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.22)' : 'rgba(24, 169, 87, 0.15)',
      borderColor: Colors.success,
    },
    optionWrong: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255, 107, 107, 0.22)' : 'rgba(224, 68, 68, 0.15)',
      borderColor: Colors.error,
    },
    optionText: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '700',
      lineHeight: 22,
    },
    reinforcementBox: {
      marginTop: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.sm,
      backgroundColor: screenAccent.badgeBg,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
    },
    reinforcementTitle: {
      color: Colors.text,
      fontSize: FontSize.sm,
      fontWeight: '800',
      marginBottom: 2,
    },
    reinforcementText: {
      color: Colors.textSecondary,
      fontSize: FontSize.sm,
      lineHeight: 20,
    },
    primaryButton: {
      ...ui.cta,
      borderRadius: BorderRadius.sm,
      flex: 1,
    },
    primaryButtonPressed: {
      ...ui.ctaPressed,
    },
    primaryButtonText: {
      ...ui.ctaText,
      fontSize: FontSize.md,
      letterSpacing: 0.6,
      textTransform: 'none',
    },
    disabledButton: {
      opacity: 0.48,
    },
    secondaryButton: {
      flex: 1,
      minHeight: 52,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    secondaryButtonPressed: {
      backgroundColor: Colors.border,
      transform: [{ scale: 0.99 }],
    },
    secondaryButtonText: {
      color: Colors.textSecondary,
      fontSize: FontSize.md,
      fontWeight: '800',
    },
    resultCard: {
      ...ui.card,
      padding: Spacing.lg,
      alignItems: 'center',
    },
    resultImage: {
      width: '100%',
      height: 230,
      borderRadius: BorderRadius.sm,
      backgroundColor: Colors.surfaceLight,
    },
    resultTitle: {
      color: Colors.text,
      fontSize: FontSize.xl,
      fontWeight: '900',
      marginTop: Spacing.lg,
      textAlign: 'center',
    },
    resultSubtitle: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      marginTop: Spacing.xs,
      textAlign: 'center',
    },
    resultStats: {
      flexDirection: 'row',
      width: '100%',
      gap: Spacing.sm,
      marginTop: Spacing.lg,
    },
    statBlock: {
      flex: 1,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceLight,
      padding: Spacing.md,
      minHeight: 82,
      justifyContent: 'center',
    },
    statValue: {
      color: Colors.text,
      fontSize: FontSize.md,
      fontWeight: '900',
      textAlign: 'center',
    },
    statLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      marginTop: 4,
      textAlign: 'center',
      textTransform: 'capitalize',
    },
    shareCard: {
      width: '100%',
      backgroundColor: Colors.surface,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
      marginTop: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      gap: Spacing.sm,
    },
    shareTitle: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    shareBox: {
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
    },
    shareText: {
      color: Colors.text,
      fontSize: FontSize.sm,
      lineHeight: 20,
    },
    shareStatus: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      textAlign: 'center',
    },
    resultActions: {
      flexDirection: 'row',
      width: '100%',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    buildText: {
      color: Colors.textMuted,
      fontSize: FontSize.sm,
      marginTop: Spacing.md,
    },
  });
};
