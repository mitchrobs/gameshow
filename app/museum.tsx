import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Linking,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
  type PanResponderGestureState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  getDailyMuseumArtwork,
  getMuseumLocalDateKey,
  getNextMuseumArtwork,
  MUSEUM_ARTWORKS,
  type MuseumArtwork,
  type MuseumQuestion,
} from '../src/data/museumArtworks';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const STORAGE_PREFIX = 'museum';
const REVEAL_CONTEXT_SECONDS = 30;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const FONT_SANS = 'DM Sans, Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_SERIF = 'Instrument Serif, Georgia, "Times New Roman", serif';

const COLORS = {
  bg: '#0c0a09',
  panel: '#171311',
  panelAlt: '#1d1714',
  panelSoft: 'rgba(255,255,255,0.04)',
  panelGlass: 'rgba(12, 10, 9, 0.56)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#faf7f2',
  textDim: '#d8ccc2',
  textMuted: '#a89a8f',
  pink: '#a7664f',
  pinkSoft: 'rgba(167,102,79,0.16)',
  amber: '#f5b455',
  amberSoft: 'rgba(245,180,85,0.14)',
  blue: '#76a7f7',
  blueSoft: 'rgba(118,167,247,0.14)',
  green: '#38d39f',
  greenSoft: 'rgba(56,211,159,0.14)',
  red: '#f16e86',
  redSoft: 'rgba(241,110,134,0.14)',
  white: '#ffffff',
};

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

interface PassportPreviewItem {
  key: string;
  label: string;
  seen: number;
  accuracy: number | null;
  active: boolean;
}

interface PassportMetric {
  key: string;
  label: string;
  value: string;
  note: string;
  accent: string;
}

interface PassportSummary {
  intro: string;
  currentLabel: string;
  currentSeen: number;
  currentAccuracy: number | null;
  topMediumLabel: string;
  topMediumSeen: number;
  metrics: PassportMetric[];
}

function useArtworkAspectRatio(uri: string, fallback = 1.25): number {
  const [aspectRatio, setAspectRatio] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    Image.getSize(
      uri,
      (width, height) => {
        if (!cancelled && width > 0 && height > 0) {
          setAspectRatio(width / height);
        }
      },
      () => {
        if (!cancelled) {
          setAspectRatio(fallback);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [fallback, uri]);

  return aspectRatio;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTouchDistance(touches: readonly { pageX: number; pageY: number }[]): number {
  if (touches.length < 2) return 1;
  const [first, second] = touches;
  return Math.hypot(first.pageX - second.pageX, first.pageY - second.pageY);
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
      museum: getMuseumLabel(artwork),
      geoRegion: artwork.geoRegion,
    };

    if (!passport.artworkIds.includes(artwork.id)) {
      passport.artworkIds.push(artwork.id);
    }

    const statBuckets: Array<[Record<string, PassportStats>, string]> = [
      [passport.periodStats, artwork.periodKey],
      [passport.mediumStats, artwork.mediumCategory],
      [passport.museumStats, getMuseumLabel(artwork)],
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

function getMuseumLabel(artwork: MuseumArtwork): string {
  if (artwork.source.institution === 'met') return 'The Met';
  return 'Museum';
}

function getShortFact(fact: string): string {
  const firstSentence = fact.split('. ')[0] ?? fact;
  return firstSentence.length > 96 ? `${firstSentence.slice(0, 93)}...` : firstSentence;
}

function getResultHeadline(score: number): string {
  if (score === 3) return 'A close study';
  if (score === 2) return 'A strong reading';
  if (score === 1) return 'A detail remained';
  return 'An unhurried first look';
}

function getResultAccent(score: number): string {
  if (score === 3) return COLORS.green;
  if (score === 2) return COLORS.amber;
  return COLORS.pink;
}

function getResultNote(score: number): string {
  if (score === 3) return 'A close reading of the work, held with confidence.';
  if (score === 2) return 'A thoughtful visit. One more detail and it would have been exact.';
  if (score === 1) return 'Something from the work stayed with you, which is how collections grow in memory.';
  return 'Time spent looking still counts. The questions simply sharpen the next visit.';
}

function getPeriodLabelMap(): Map<string, string> {
  return new Map(
    MUSEUM_ARTWORKS.map((artwork) => [
      artwork.periodKey,
      artwork.passportLabel || splitPeriodTag(artwork.periodTag)[0] || artwork.periodTag,
    ])
  );
}

const PERIOD_LABELS = getPeriodLabelMap();

function getPassportPreview(
  passport: MuseumPassport,
  artwork: MuseumArtwork
): PassportPreviewItem[] {
  const activeLabel =
    PERIOD_LABELS.get(artwork.periodKey) ?? artwork.periodTag.split(' · ')[0] ?? artwork.periodTag;

  const items = Object.entries(passport.periodStats).map(([key, stats]) => ({
    key,
    label: PERIOD_LABELS.get(key) ?? key.replace(/-/g, ' '),
    seen: stats.seen,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null,
    active: key === artwork.periodKey,
  }));

  if (!items.find((item) => item.key === artwork.periodKey)) {
    items.push({
      key: artwork.periodKey,
      label: activeLabel,
      seen: 0,
      accuracy: null,
      active: true,
    });
  }

  items.sort((left, right) => {
    if (left.active && !right.active) return -1;
    if (!left.active && right.active) return 1;
    return right.seen - left.seen;
  });

  return items.slice(0, 3);
}

function getRevealHintText(contextUnlocked: boolean, elapsedSeconds: number): string {
  if (contextUnlocked) return 'View notes';
  const remaining = Math.max(0, REVEAL_CONTEXT_SECONDS - elapsedSeconds);
  return remaining > 0 ? 'View notes' : 'View notes';
}

function getQuestionKindLabel(question: MuseumQuestion): string {
  if (question.kind === 'observation') return 'From the work';
  if (question.kind === 'context') return 'From the notes';
  return 'Across the period';
}

function splitPeriodTag(periodTag: string): [string, string, string] {
  const [movement = periodTag, place = '', date = ''] = periodTag.split(' - ');
  return [movement, place, date];
}

function getPlacardFacts(artwork: MuseumArtwork): Array<{ label: string; value: string }> {
  const [movement, place, date] = splitPeriodTag(artwork.periodTag);
  return [
    { label: 'Movement', value: movement },
    { label: 'Origin', value: place || artwork.geoRegion },
    { label: 'Date', value: date || artwork.objectDate },
    { label: 'Medium', value: artwork.mediumCategory },
    { label: 'Collection', value: getMuseumLabel(artwork) },
    { label: 'Access', value: 'Open access (CC0)' },
  ];
}

function getHeroPlacardLine(artwork: MuseumArtwork): string {
  return `${artwork.medium} · ${artwork.geoRegion}`;
}

function getContextLead(artwork: MuseumArtwork): string {
  const [movement] = splitPeriodTag(artwork.periodTag);
  return `${artwork.title} belongs to ${movement}. These notes gather how the work was made, one detail worth holding onto, and the broader thread it joins.`;
}

function getAccuracy(stats: PassportStats | undefined): number | null {
  if (!stats || stats.total <= 0) return null;
  return Math.round((stats.correct / stats.total) * 100);
}

function getTopStatEntry(
  bucket: Record<string, PassportStats>
): [string, PassportStats] | null {
  const entries = Object.entries(bucket);
  if (entries.length === 0) return null;

  entries.sort((left, right) => {
    if (right[1].seen !== left[1].seen) {
      return right[1].seen - left[1].seen;
    }

    const rightAccuracy = right[1].total > 0 ? right[1].correct / right[1].total : 0;
    const leftAccuracy = left[1].total > 0 ? left[1].correct / left[1].total : 0;
    return rightAccuracy - leftAccuracy;
  });

  return entries[0] ?? null;
}

function getPassportSummary(
  passport: MuseumPassport,
  artwork: MuseumArtwork
): PassportSummary {
  const worksLogged = passport.artworkIds.length;
  const periodCount = Object.keys(passport.periodStats).length;
  const regionCount = Object.keys(passport.geoRegionStats).length;
  const mediumCount = Object.keys(passport.mediumStats).length;

  const aggregate = Object.values(passport.periodStats).reduce(
    (totals, stats) => ({
      correct: totals.correct + stats.correct,
      total: totals.total + stats.total,
    }),
    { correct: 0, total: 0 }
  );

  const overallAccuracy =
    aggregate.total > 0 ? Math.round((aggregate.correct / aggregate.total) * 100) : 0;
  const currentStats = passport.periodStats[artwork.periodKey];
  const currentLabel =
    PERIOD_LABELS.get(artwork.periodKey) ?? artwork.periodTag.split(' · ')[0] ?? artwork.periodTag;
  const topMediumEntry = getTopStatEntry(passport.mediumStats);
  const topMediumLabel = topMediumEntry?.[0] ?? artwork.mediumCategory;
  const topMediumSeen = topMediumEntry?.[1].seen ?? 0;

  const intro =
    worksLogged <= 1
      ? 'Your passport has begun. Each return adds another work, movement, and place to remember.'
      : `A growing collection of ${worksLogged} works across ${periodCount} movements, ${regionCount} regions, and ${mediumCount} materials.`;

  return {
    intro,
    currentLabel,
    currentSeen: currentStats?.seen ?? 0,
    currentAccuracy: getAccuracy(currentStats),
    topMediumLabel,
    topMediumSeen,
    metrics: [
      {
        key: 'works',
        label: 'Works',
        value: `${worksLogged}`,
        note: 'Seen so far',
        accent: COLORS.amber,
      },
      {
        key: 'periods',
        label: 'Styles',
        value: `${periodCount}`,
        note: 'Movements visited',
        accent: COLORS.pink,
      },
      {
        key: 'regions',
        label: 'Regions',
        value: `${regionCount}`,
        note: 'Places represented',
        accent: COLORS.blue,
      },
      {
        key: 'accuracy',
        label: 'Recall',
        value: `${overallAccuracy}%`,
        note: 'Across your visits',
        accent: COLORS.green,
      },
    ],
  };
}

function StatTile({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ContextSection({
  label,
  accent,
  icon,
  children,
  emphasized,
}: {
  label: string;
  accent: string;
  icon: string;
  children: string;
  emphasized?: boolean;
}) {
  return (
    <View
      style={[
        styles.contextSection,
        emphasized && styles.contextSectionEmphasized,
        emphasized && { borderColor: 'rgba(245,180,85,0.2)' },
      ]}
    >
      <View style={styles.contextSectionHeader}>
        <View style={[styles.contextIcon, { backgroundColor: accent }]}>
          <Text style={styles.contextIconText}>{icon}</Text>
        </View>
        <Text style={[styles.contextSectionLabel, emphasized && styles.contextSectionLabelStrong]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.contextSectionText, emphasized && styles.contextSectionTextStrong]}>
        {children}
      </Text>
    </View>
  );
}

interface ArtworkLayerProps {
  uri: string;
  opacity: number;
  transformStyle: object;
  onLoad?: () => void;
  onError?: () => void;
}

function ArtworkLayer({
  uri,
  opacity,
  transformStyle,
  onLoad,
  onError,
}: ArtworkLayerProps) {
  return (
    <View style={[styles.viewerImageShell, transformStyle, { opacity }]}>
      {Platform.OS === 'web' ? (
        <>
          <View
            style={[
              styles.webArtworkFill,
              {
                backgroundImage: `url("${uri}")`,
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              } as object,
            ]}
          />
          <Image
            source={{ uri }}
            style={styles.hiddenProbeImage}
            resizeMode="contain"
            onLoad={onLoad}
            onError={onError}
          />
        </>
      ) : (
        <Image
          source={{ uri }}
          style={styles.viewerImage}
          resizeMode="contain"
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </View>
  );
}

function MuseumArtworkCard({
  artwork,
  uri,
  style,
  variant = 'card',
}: {
  artwork: MuseumArtwork;
  uri?: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'thumb' | 'card' | 'hero' | 'share';
}) {
  const variantStyle =
    variant === 'thumb'
      ? styles.artworkCardThumb
      : variant === 'hero'
        ? styles.artworkCardHero
        : variant === 'share'
          ? styles.artworkCardShare
          : styles.artworkCard;

  return (
    <View style={[styles.artworkCardBase, variantStyle, style]}>
      <View style={styles.artworkCardInner}>
        <Image
          source={{ uri: uri ?? artwork.images.displayUrl }}
          style={styles.staticArtworkImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

function MuseumArtworkStage({
  artwork,
  height,
  onInteraction,
}: {
  artwork: MuseumArtwork;
  height: number;
  onInteraction: () => void;
}) {
  const { width } = useWindowDimensions();
  const aspectRatio = useArtworkAspectRatio(artwork.images.displayUrl, 1.25);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const [displayLoaded, setDisplayLoaded] = useState(false);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [displayFailed, setDisplayFailed] = useState(false);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gestureRef = useRef({
    startDistance: 1,
    startZoom: 1,
    startPan: { x: 0, y: 0 },
  });

  const clearControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearControlsTimer();
    setShowControls(true);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2200);
  }, [clearControlsTimer]);

  const markInteraction = useCallback(() => {
    onInteraction();
    revealControls();
  }, [onInteraction, revealControls]);

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
    revealControls();
  }, [revealControls, updatePan, updateZoom]);

  useEffect(() => {
    setZoom(1);
    zoomRef.current = 1;
    setPan({ x: 0, y: 0 });
    panRef.current = { x: 0, y: 0 };
    setShowControls(false);
    setDisplayLoaded(false);
    setHighResLoaded(false);
    setDisplayFailed(false);
  }, [artwork.id]);

  useEffect(() => {
    Image.prefetch(artwork.images.displayUrl);
  }, [artwork.images.displayUrl]);

  useEffect(() => {
    if (zoom <= 1.05) return;
    Image.prefetch(artwork.images.fullUrl);
  }, [artwork.images.fullUrl, zoom]);

  useEffect(() => () => clearControlsTimer(), [clearControlsTimer]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: (event) => event.nativeEvent.touches.length > 1,
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
          markInteraction();
          if (touches.length >= 2) {
            const nextZoom =
              gestureRef.current.startZoom *
              (getTouchDistance(touches) / gestureRef.current.startDistance);
            updateZoom(nextZoom);
            return;
          }

          if (zoomRef.current <= MIN_ZOOM) return;

          updatePan({
            x: gestureRef.current.startPan.x + gestureState.dx,
            y: gestureRef.current.startPan.y + gestureState.dy,
          });
        },
      }),
    [markInteraction, updatePan, updateZoom]
  );

  const preferredMaxWidth = aspectRatio > 1.3 ? Math.min(width - 32, 760) : Math.min(width - 32, 560);
  const maxHeight = height * 0.52;
  const cardPadding = aspectRatio > 1.3 ? 14 : 18;
  let artWidth = preferredMaxWidth - cardPadding * 2;
  let artHeight = artWidth / aspectRatio;
  if (artHeight + cardPadding * 2 > maxHeight) {
    artHeight = maxHeight - cardPadding * 2;
    artWidth = artHeight * aspectRatio;
  }

  const cardWidth = artWidth + cardPadding * 2;
  const cardHeight = artHeight + cardPadding * 2;
  const transformStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoom }],
  } as const;
  const showFullRes = zoom > 1.05;
  const loadingVisible = !displayLoaded && !displayFailed;
  const hardFailure = displayFailed;
  const artworkVisible = displayLoaded || highResLoaded || hardFailure;

  return (
    <View style={[styles.viewer, { height }]}>
      <View style={styles.viewerWallGlow} />

      <View
        style={[
          styles.stageArtworkCard,
          {
            width: cardWidth,
            height: cardHeight,
            padding: cardPadding,
          },
        ]}
      >
        <View style={styles.stageArtworkInset} {...panResponder.panHandlers}>
          {!displayFailed ? (
            <ArtworkLayer
              uri={artwork.images.displayUrl}
              transformStyle={transformStyle}
              opacity={displayLoaded && !(showFullRes && highResLoaded) ? 1 : 0.01}
              onLoad={() => setDisplayLoaded(true)}
              onError={() => setDisplayFailed(true)}
            />
          ) : null}
          {showFullRes ? (
            <ArtworkLayer
              uri={artwork.images.fullUrl}
              transformStyle={transformStyle}
              opacity={highResLoaded ? 1 : 0.01}
              onLoad={() => setHighResLoaded(true)}
            />
          ) : null}
        </View>
      </View>

      {loadingVisible ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Text style={styles.loadingTitle}>{artwork.title}</Text>
            <Text style={styles.loadingMeta}>
              {artwork.artist} · {artwork.objectDate}
            </Text>
          </View>
        </View>
      ) : null}

      {hardFailure ? (
        <View style={styles.fallbackArtwork}>
          <Text style={styles.fallbackTitle}>{artwork.title}</Text>
          <Text style={styles.loadingMeta}>{artwork.artist}</Text>
        </View>
      ) : null}

      {artworkVisible ? (
        <View style={styles.zoomLauncherWrap}>
          <Pressable
            style={({ pressed }) => [styles.zoomLauncher, pressed && styles.zoomLauncherPressed]}
            onPress={() => {
              markInteraction();
              if (zoomRef.current <= 1.05) {
                updateZoom(1.45);
              }
              setShowControls((current) => !current);
            }}
          >
            <Text style={styles.zoomLauncherText}>
              {zoomRef.current <= 1.05 ? 'Zoom artwork' : 'Zoom'}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {artworkVisible && showControls ? (
        <View style={styles.zoomControls}>
          <Pressable
            style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
            onPress={() => {
              markInteraction();
              updateZoom(zoom + 0.35);
            }}
          >
            <Text style={styles.zoomButtonText}>+</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.zoomButton, pressed && styles.zoomButtonPressed]}
            onPress={() => {
              markInteraction();
              updateZoom(zoom - 0.35);
            }}
          >
            <Text style={styles.zoomButtonText}>-</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.zoomResetButton, pressed && styles.zoomButtonPressed]}
            onPress={resetView}
          >
            <Text style={styles.zoomResetText}>Reset</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default function MuseumScreen() {
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
  const placardFacts = useMemo(() => getPlacardFacts(artwork), [artwork]);
  const [movement, place, periodDate] = useMemo(
    () => splitPeriodTag(artwork.periodTag),
    [artwork.periodTag]
  );

  const [phase, setPhase] = useState<MuseumPhase>('reveal');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [contextUnlocked, setContextUnlocked] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>(
    Array.from({ length: artwork.questions.length }, () => null)
  );
  const [museumStreak, setMuseumStreak] = useState(0);
  const [passport, setPassport] = useState<MuseumPassport>(createEmptyPassport());
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const hasRecordedRef = useRef(false);
  const hasCountedRef = useRef(false);

  const viewerHeight = Math.max(520, height);
  const currentQuestion = artwork.questions[currentQuestionIndex];
  const selectedOption = selectedAnswers[currentQuestionIndex];

  const score = useMemo(
    () =>
      selectedAnswers.reduce<number>((total, answer, index) => {
        return total + (answer === artwork.questions[index].answerIndex ? 1 : 0);
      }, 0),
    [artwork.questions, selectedAnswers]
  );

  const periodSeen = passport.periodStats[artwork.periodKey]?.seen ?? 0;
  const passportPreview = useMemo(() => getPassportPreview(passport, artwork), [artwork, passport]);
  const passportSummary = useMemo(() => getPassportSummary(passport, artwork), [artwork, passport]);
  const shareText = useMemo(
    () =>
      [
        `Museum · ${dateLabel}`,
        `${artwork.title} — ${artwork.artist} (${artwork.objectDate})`,
        `Today's visit: ${score}/3 · Day ${museumStreak}`,
        `${getMuseumLabel(artwork)} · ${movement}`,
        `"${getShortFact(artwork.context.surprisingFact)}"`,
        'Daybreak',
      ].join('\n'),
    [
      artwork,
      artwork.context.surprisingFact,
      artwork.objectDate,
      artwork.title,
      dateLabel,
      movement,
      museumStreak,
      score,
    ]
  );

  useEffect(() => {
    Image.prefetch(artwork.images.displayUrl);
    Image.prefetch(nextArtwork.images.displayUrl);
  }, [artwork.images.displayUrl, nextArtwork.images.displayUrl]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;
    const appRoot = document.getElementById('root');

    const previousRoot = root.style.backgroundColor;
    const previousBody = body.style.backgroundColor;
    const previousApp = appRoot?.style.backgroundColor ?? '';

    root.style.backgroundColor = COLORS.bg;
    body.style.backgroundColor = COLORS.bg;
    if (appRoot) {
      appRoot.style.backgroundColor = COLORS.bg;
    }

    return () => {
      root.style.backgroundColor = previousRoot;
      body.style.backgroundColor = previousBody;
      if (appRoot) {
        appRoot.style.backgroundColor = previousApp;
      }
    };
  }, []);

  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    setPassport(readPassport(storage));
    setMuseumStreak(readStreak(storage).count);
  }, [artwork.id]);

  useEffect(() => {
    if (phase !== 'reveal' || contextUnlocked) return undefined;
    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => {
        const next = seconds + 1;
        if (next >= REVEAL_CONTEXT_SECONDS) {
          setContextUnlocked(true);
          setPhase('context');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
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
        const recorded = recordPassportEntry(storage, artwork, dateKey, score);
        setPassport(recorded.passport);
        setMuseumStreak(recorded.streak.count);
      } else {
        setMuseumStreak(1);
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

  const handleShare = useCallback(async () => {
    if (Platform.OS !== 'web') return;
    const nav = (globalThis as typeof globalThis & {
      navigator?: {
        clipboard?: { writeText?: (text: string) => Promise<void> };
        share?: (payload: { title?: string; text?: string; url?: string }) => Promise<void>;
      };
    }).navigator;

    if (nav?.share) {
      try {
        await nav.share({
          title: `Museum - ${artwork.title}`,
          text: shareText,
        });
        setShareStatus('Shared');
        return;
      } catch {
        // Fall through to clipboard.
      }
    }

    if (!nav?.clipboard?.writeText) {
      setShareStatus('Share not supported');
      return;
    }

    try {
      await nav.clipboard.writeText(shareText);
      setShareStatus('Copied to clipboard');
    } catch {
      setShareStatus('Copy failed');
    }
  }, [artwork.title, shareText]);

  const openArtwork = useCallback(() => {
    Linking.openURL(artwork.source.objectUrl);
  }, [artwork.source.objectUrl]);

  const showTitle = true;
  const showDetails = contextUnlocked || phase !== 'reveal' || elapsedSeconds >= 8;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        {(phase === 'reveal' || phase === 'context') && (
          <View style={[styles.stage, { minHeight: height }]}>
            <MuseumArtworkStage
              artwork={artwork}
              height={viewerHeight}
              onInteraction={() => {}}
            />

            <View style={styles.stageTopRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.badgeButton,
                  pressed && styles.badgeButtonPressed,
                ]}
                onPress={() => router.back()}
              >
                <Text style={styles.badgeChevron}>{'<'}</Text>
                <Text style={styles.badgeLabel}>Museum</Text>
              </Pressable>
              <View style={styles.streakPill}>
                <Text style={styles.streakPillLabel}>Day</Text>
                <Text style={styles.streakPillValue}>{Math.max(museumStreak, 1)}</Text>
              </View>
            </View>

            <View style={styles.heroFooter}>
              {showTitle && (
                <>
                  <Text style={styles.periodTag}>On view today</Text>
                  <Text style={styles.heroTitle}>{artwork.title}</Text>
                  <Text style={styles.heroArtist}>
                    {artwork.artist} · {artwork.objectDate}
                  </Text>
                </>
              )}

              {showDetails && (
                <>
                  <Text style={styles.heroMeta}>{getHeroPlacardLine(artwork)}</Text>
                  <Text style={styles.heroMetaMuted}>
                    {movement}
                    {place ? ` · ${place}` : ''}
                    {periodDate ? ` · ${periodDate}` : ''}
                    {' · '}
                    {getMuseumLabel(artwork)}
                  </Text>
                </>
              )}

              {phase === 'reveal' && (
                <>
                  <Pressable
                    style={({ pressed }) => [
                      styles.heroCta,
                      pressed && styles.heroCtaPressed,
                    ]}
                    onPress={() => {
                      setContextUnlocked(true);
                      setPhase('context');
                    }}
                  >
                    <Text style={styles.heroCtaText}>
                      {getRevealHintText(contextUnlocked, elapsedSeconds)}
                    </Text>
                  </Pressable>
                  {!contextUnlocked && (
                    <Text style={styles.heroHint}>
                      Stay with the image for a moment. You can zoom into the work before opening the notes.
                    </Text>
                  )}
                </>
              )}
            </View>

            {phase === 'context' && (
              <View style={styles.contextSheet}>
                <View style={styles.contextSheetHandle} />
                <View style={styles.contextHeader}>
                  <MuseumArtworkCard
                    artwork={artwork}
                    style={styles.contextThumbWrap}
                    uri={artwork.images.thumbnailUrl}
                    variant="thumb"
                  />
                  <View style={styles.contextHeaderText}>
                    <Text style={styles.contextHeaderTitle}>{artwork.title}</Text>
                    <Text style={styles.contextHeaderMeta}>
                      {artwork.artist} · {artwork.objectDate}
                    </Text>
                    <Text style={styles.contextHeaderMetaMuted}>
                      {artwork.medium} · {getMuseumLabel(artwork)}
                    </Text>
                  </View>
                </View>

                <ScrollView
                  style={styles.contextScroll}
                  contentContainerStyle={styles.contextScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.periodBanner}>
                    <Text style={styles.periodBannerLabel}>Notes</Text>
                    <Text style={styles.periodBannerValue}>{artwork.periodTag}</Text>
                  </View>

                  <Text style={styles.contextLead}>{getContextLead(artwork)}</Text>

                  <View style={styles.placardGrid}>
                    {placardFacts.map((fact) => (
                      <View key={fact.label} style={styles.placardGridItem}>
                        <Text style={styles.placardGridLabel}>{fact.label}</Text>
                        <Text style={styles.placardGridValue}>{fact.value}</Text>
                      </View>
                    ))}
                  </View>

                  <ContextSection label="Technique" accent={COLORS.pinkSoft} icon="T">
                    {artwork.context.technique}
                  </ContextSection>
                  <ContextSection label="Collection note" accent={COLORS.amberSoft} icon="N" emphasized>
                    {artwork.context.surprisingFact}
                  </ContextSection>
                  <ContextSection label="Connection" accent={COLORS.blueSoft} icon="C">
                    {artwork.context.connection}
                  </ContextSection>
                </ScrollView>

                <View style={styles.contextActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={() => setPhase('reveal')}
                  >
                    <Text style={styles.secondaryButtonText}>Return to work</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.primaryButtonPressed,
                    ]}
                    onPress={() => setPhase('quiz')}
                  >
                    <Text style={styles.primaryButtonText}>Museum Quiz</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        {phase === 'quiz' && currentQuestion && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.page}>
              <View style={styles.quizHeader}>
                <View>
                  <Text style={styles.quizEyebrow}>Museum quiz</Text>
                  <Text style={styles.quizDate}>
                    {artwork.artist} · {artwork.title}
                  </Text>
                </View>
                <View style={styles.quizCountWrap}>
                  <Text style={styles.quizCountText}>
                    {currentQuestionIndex + 1}/{artwork.questions.length}
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                {artwork.questions.map((question, index) => {
                  const answered = selectedAnswers[index] !== null;
                  const active = index === currentQuestionIndex;
                  return (
                    <View
                      key={`${question.prompt}-${index}`}
                      style={[
                        styles.progressTrack,
                        answered && styles.progressTrackFilled,
                        active && styles.progressTrackActive,
                      ]}
                    />
                  );
                })}
              </View>

              <MuseumArtworkCard
                artwork={artwork}
                style={styles.quizArtworkWrap}
                uri={artwork.images.thumbnailUrl}
                variant="card"
              />
              <View style={styles.quizPlacard}>
                <Text style={styles.quizArtworkTitle}>{artwork.title}</Text>
                <Text style={styles.quizArtworkMeta}>
                  {artwork.artist} · {artwork.objectDate} · {movement}
                </Text>
              </View>

              <Text style={styles.questionKind}>{getQuestionKindLabel(currentQuestion)}</Text>
              <Text style={styles.questionText}>{currentQuestion.prompt}</Text>

              <View style={styles.optionsList}>
                {currentQuestion.options.map((option, index) => {
                  const showResult = selectedOption !== null;
                  const isCorrect = index === currentQuestion.answerIndex;
                  const isSelected = selectedOption === index;
                  const letter = String.fromCharCode(65 + index);

                  return (
                    <Pressable
                      key={`${option}-${index}`}
                      style={({ pressed }) => [
                        styles.option,
                        pressed && !showResult && styles.optionPressed,
                        showResult && isCorrect && styles.optionCorrect,
                        showResult && isSelected && !isCorrect && styles.optionWrong,
                      ]}
                      disabled={showResult}
                      onPress={() => answerQuestion(index)}
                    >
                      <View
                        style={[
                          styles.optionChip,
                          showResult && isCorrect && styles.optionChipCorrect,
                          showResult && isSelected && !isCorrect && styles.optionChipWrong,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionChipText,
                            showResult && isCorrect && styles.optionChipTextAccent,
                            showResult && isSelected && !isCorrect && styles.optionChipTextAccent,
                          ]}
                        >
                          {showResult && (isCorrect || isSelected)
                            ? isCorrect
                              ? 'OK'
                              : 'NO'
                            : letter}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          showResult && isCorrect && styles.optionTextCorrect,
                          showResult && isSelected && !isCorrect && styles.optionTextWrong,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedOption !== null && (
                <View style={styles.answerReveal}>
                  <Text style={styles.answerRevealTitle}>From today's notes</Text>
                  <Text style={styles.answerRevealText}>{currentQuestion.reinforcement}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.primaryButton,
                      pressed && styles.primaryButtonPressed,
                    ]}
                    onPress={goToNextQuestion}
                  >
                    <Text style={styles.primaryButtonText}>
                      {currentQuestionIndex >= artwork.questions.length - 1
                        ? 'View summary'
                        : 'Continue'}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {phase === 'result' && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.page}>
              <Text style={styles.quizEyebrow}>Visit summary</Text>
              <Text style={styles.resultDate}>{dateLabel}</Text>

              <View style={styles.resultSummaryCard}>
                <MuseumArtworkCard
                  artwork={artwork}
                  style={styles.resultHero}
                  uri={artwork.images.displayUrl}
                  variant="share"
                />
                <View style={styles.resultSummaryBody}>
                  <Text style={styles.resultHeroTitle}>{artwork.title}</Text>
                  <Text style={styles.resultHeroMeta}>
                    {artwork.artist} · {artwork.objectDate} · {getMuseumLabel(artwork)}
                  </Text>

                  <View style={styles.resultScoreRow}>
                    <Text style={[styles.resultScore, { color: getResultAccent(score) }]}>{score}/3</Text>
                    <View style={styles.resultScoreCopy}>
                      <Text style={styles.resultHeadline}>{getResultHeadline(score)}</Text>
                      <Text style={styles.resultNote}>{getResultNote(score)}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.resultStatsGrid}>
                <StatTile value={`${museumStreak}`} label="Day streak" accent={COLORS.amber} />
                <StatTile
                  value={`${periodSeen}`}
                  label="In this movement"
                  accent={COLORS.pink}
                />
              </View>

              <View style={styles.resultProgressCard}>
                <Text style={styles.resultProgressLine}>
                  You have now seen {periodSeen} work{periodSeen === 1 ? '' : 's'} in{' '}
                  {passportSummary.currentLabel}
                  {passportSummary.currentAccuracy !== null
                    ? ` and remembered ${passportSummary.currentAccuracy}% of the details here.`
                    : '.'}
                </Text>
              </View>

              <View style={styles.passportSection}>
                <View style={styles.passportHeaderCompact}>
                  <View>
                    <Text style={styles.passportEyebrow}>Museum Passport</Text>
                    <Text style={styles.passportCount}>{passport.artworkIds.length} works seen</Text>
                  </View>
                  <View style={styles.passportBadge}>
                    <Text style={styles.passportBadgeText}>
                      {passportSummary.currentAccuracy !== null
                        ? `${passportSummary.currentAccuracy}% remembered here`
                        : 'First work here'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.passportIntroCompact}>
                  {passportSummary.currentSeen > 0
                    ? `${passportSummary.currentLabel}: ${passportSummary.currentSeen} work${passportSummary.currentSeen === 1 ? '' : 's'} seen`
                    : `Today begins your ${passportSummary.currentLabel} collection`}
                  {passportSummary.currentAccuracy !== null
                    ? ` · ${passportSummary.currentAccuracy}% remembered`
                    : ''}
                </Text>

                <View style={styles.passportQuickRow}>
                  <View style={styles.passportQuickPill}>
                    <Text style={styles.passportQuickLabel}>Most seen medium</Text>
                    <Text style={styles.passportQuickValue}>{passportSummary.topMediumLabel}</Text>
                  </View>
                  <View style={styles.passportQuickPill}>
                    <Text style={styles.passportQuickLabel}>Overall recall</Text>
                    <Text style={styles.passportQuickValue}>
                      {passportSummary.metrics.find((item) => item.key === 'accuracy')?.value ?? '0%'}
                    </Text>
                  </View>
                </View>

                <View style={styles.passportStrip}>
                  {passportPreview.map((item) => (
                    <View
                      key={item.key}
                      style={[styles.passportTile, item.active && styles.passportTileActive]}
                    >
                      <Text style={[styles.passportTileValue, item.active && styles.passportTileValueActive]}>
                        {item.seen}
                      </Text>
                      <Text style={[styles.passportTileLabel, item.active && styles.passportTileLabelActive]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.passportTileNote, item.active && styles.passportTileNoteActive]}>
                        {item.accuracy !== null ? `${item.accuracy}% remembered` : 'First work'}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.shareSection}>
                <Text style={styles.shareSectionTitle}>Share preview</Text>
                <View style={styles.sharePreviewCompact}>
                  <MuseumArtworkCard
                    artwork={artwork}
                    style={styles.sharePreviewImage}
                    uri={artwork.images.thumbnailUrl}
                    variant="thumb"
                  />
                  <View style={styles.sharePreviewTextWrap}>
                    <View style={styles.sharePreviewHeader}>
                      <Text style={styles.sharePreviewEyebrow}>Museum</Text>
                      <View style={styles.sharePreviewBadge}>
                        <Text style={styles.sharePreviewBadgeText}>
                          Day {museumStreak} · {score}/3
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.sharePreviewTitle}>{artwork.title}</Text>
                    <Text style={styles.sharePreviewMeta}>
                      {artwork.artist} · {artwork.objectDate} · {getMuseumLabel(artwork)}
                    </Text>
                    <Text style={styles.sharePreviewQuote}>
                      "{getShortFact(artwork.context.surprisingFact)}"
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.primaryButtonPressed,
                  ]}
                  onPress={handleShare}
                >
                  <Text style={styles.primaryButtonText}>Copy share text</Text>
                </Pressable>
                {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
              </View>

              <View style={styles.resultActionRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={openArtwork}
                  >
                    <Text style={styles.secondaryButtonText}>Open museum page</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.secondaryButton,
                      pressed && styles.secondaryButtonPressed,
                    ]}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.secondaryButtonText}>Return home</Text>
                  </Pressable>
                </View>
              </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: COLORS.bg,
  },
  stage: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: COLORS.bg,
    overflow: 'hidden',
  },
  viewer: {
    width: '100%',
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 80,
  },
  viewerWallGlow: {
    position: 'absolute',
    top: '16%',
    width: '74%',
    height: '50%',
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowColor: COLORS.white,
    shadowOpacity: 0.08,
    shadowRadius: 44,
    shadowOffset: { width: 0, height: 0 },
  },
  stageArtworkCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(17,14,13,0.94)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    shadowColor: '#000000',
    shadowOpacity: 0.28,
    shadowRadius: 34,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },
  stageArtworkInset: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#080707',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  viewerImageShell: {
    ...StyleSheet.absoluteFillObject,
  },
  webArtworkFill: {
    ...StyleSheet.absoluteFillObject,
  },
  hiddenProbeImage: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  viewerImage: {
    width: '100%',
    height: '100%',
  },
  artworkCardBase: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: 'rgba(19,17,16,0.96)',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  artworkCard: {
    borderRadius: 22,
    padding: 14,
  },
  artworkCardHero: {
    borderRadius: 24,
    padding: 16,
  },
  artworkCardThumb: {
    borderRadius: 16,
    padding: 8,
  },
  artworkCardShare: {
    borderRadius: 18,
    padding: 10,
  },
  artworkCardInner: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#0a0908',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  staticArtworkImage: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: 'rgba(23, 19, 17, 0.9)',
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingPeriod: {
    color: COLORS.amber,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingTitle: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: FONT_SERIF,
    textAlign: 'center',
    marginBottom: 6,
  },
  loadingMeta: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FONT_SANS,
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingBadge: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(12, 10, 9, 0.75)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBadgeLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  fallbackArtwork: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#171311',
  },
  fallbackLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT_SANS,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  fallbackTitle: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: FONT_SERIF,
    textAlign: 'center',
    marginBottom: 6,
  },
  fallbackMeta: {
    color: COLORS.textDim,
    fontSize: 15,
    fontFamily: FONT_SANS,
    textAlign: 'center',
  },
  zoomLauncherWrap: {
    position: 'absolute',
    right: 16,
    bottom: 18,
  },
  zoomLauncher: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(23, 19, 17, 0.82)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomLauncherPressed: {
    backgroundColor: 'rgba(31, 25, 23, 0.94)',
  },
  zoomLauncherText: {
    color: COLORS.textDim,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    gap: 8,
    alignItems: 'flex-end',
  },
  zoomButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(23, 19, 17, 0.92)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonPressed: {
    backgroundColor: 'rgba(31, 25, 23, 0.98)',
  },
  zoomButtonText: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  zoomResetButton: {
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(23, 19, 17, 0.92)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomResetText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  heroTopScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.26)',
  },
  heroBottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
    justifyContent: 'flex-end',
  },
  heroBottomTint: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.88))',
        } as object)
      : null),
  },
  stageTopRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeButton: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(23, 19, 17, 0.84)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  badgeButtonPressed: {
    backgroundColor: 'rgba(31, 25, 23, 0.98)',
  },
  badgeChevron: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  badgeLabel: {
    color: COLORS.pink,
    fontSize: 13,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  streakPill: {
    minHeight: 38,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(23, 19, 17, 0.84)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakPillLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  streakPillValue: {
    color: COLORS.amber,
    fontSize: 14,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  heroFooter: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
  },
  periodTag: {
    color: COLORS.amber,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: FONT_SERIF,
    marginBottom: 4,
  },
  heroArtist: {
    color: COLORS.textDim,
    fontSize: 15,
    fontFamily: FONT_SANS,
    fontWeight: '500',
  },
  heroMeta: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    marginTop: 4,
  },
  heroMetaMuted: {
    color: '#c9b8a9',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    marginTop: 3,
  },
  heroCta: {
    minHeight: 50,
    borderRadius: 14,
    marginTop: 18,
    backgroundColor: 'rgba(23, 19, 17, 0.84)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  heroCtaPressed: {
    backgroundColor: 'rgba(31, 25, 23, 0.98)',
  },
  heroCtaText: {
    color: COLORS.text,
    fontSize: 15,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  heroHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: FONT_SANS,
    marginTop: 10,
    maxWidth: 320,
  },
  contextSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '74%',
    minHeight: '62%',
    backgroundColor: '#12100f',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingTop: 12,
  },
  contextSheetHandle: {
    width: 56,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  contextHeader: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  contextThumbWrap: {
    width: 78,
    height: 96,
  },
  contextHeaderText: {
    flex: 1,
  },
  contextHeaderTitle: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: FONT_SERIF,
    marginBottom: 2,
  },
  contextHeaderMeta: {
    color: COLORS.textDim,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_SANS,
  },
  contextHeaderMetaMuted: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: FONT_SANS,
    marginTop: 2,
  },
  contextScroll: {
    flex: 1,
  },
  contextScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 12,
  },
  periodBanner: {
    backgroundColor: COLORS.panelSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  periodBannerLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  periodBannerValue: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  contextLead: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT_SANS,
  },
  placardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  placardGridItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  placardGridLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  placardGridValue: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  contextSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  contextSectionEmphasized: {
    backgroundColor: 'rgba(245,180,85,0.06)',
  },
  contextSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  contextIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextIconText: {
    color: COLORS.text,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  contextSectionLabel: {
    color: COLORS.pink,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  contextSectionLabelStrong: {
    color: COLORS.amber,
  },
  contextSectionText: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT_SANS,
  },
  contextSectionTextStrong: {
    color: '#f7d8a3',
  },
  contextActions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 12,
  },
  primaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: '#8c6a45',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonPressed: {
    backgroundColor: '#75583a',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  secondaryButtonText: {
    color: COLORS.textDim,
    fontSize: 15,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: COLORS.bg,
  },
  page: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quizEyebrow: {
    color: COLORS.pink,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  quizDate: {
    color: COLORS.textDim,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT_SANS,
  },
  quizCountWrap: {
    minWidth: 58,
    minHeight: 36,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: COLORS.panelSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCountText: {
    color: COLORS.textDim,
    fontSize: 13,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progressTrackFilled: {
    backgroundColor: 'rgba(167,102,79,0.4)',
  },
  progressTrackActive: {
    backgroundColor: COLORS.pink,
  },
  quizArtworkWrap: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  quizPlacard: {
    marginTop: -4,
    marginBottom: 18,
  },
  quizArtworkTitle: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: FONT_SERIF,
    marginBottom: 2,
  },
  quizArtworkMeta: {
    color: COLORS.textDim,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: FONT_SANS,
  },
  questionKind: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  questionText: {
    color: COLORS.text,
    fontSize: 30,
    lineHeight: 36,
    fontFamily: FONT_SERIF,
    marginBottom: 22,
  },
  optionsList: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.panelSoft,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionPressed: {
    backgroundColor: 'rgba(167,102,79,0.12)',
    borderColor: 'rgba(167,102,79,0.28)',
  },
  optionCorrect: {
    backgroundColor: COLORS.greenSoft,
    borderColor: 'rgba(56,211,159,0.34)',
  },
  optionWrong: {
    backgroundColor: COLORS.redSoft,
    borderColor: 'rgba(241,110,134,0.34)',
  },
  optionChip: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipCorrect: {
    backgroundColor: 'rgba(56,211,159,0.18)',
  },
  optionChipWrong: {
    backgroundColor: 'rgba(241,110,134,0.18)',
  },
  optionChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  optionChipTextAccent: {
    color: COLORS.text,
  },
  optionText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: FONT_SANS,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: '#d7fff0',
  },
  optionTextWrong: {
    color: '#ffe1e8',
  },
  answerReveal: {
    marginTop: 14,
    backgroundColor: COLORS.panelSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 14,
  },
  answerRevealTitle: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  answerRevealText: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: FONT_SANS,
  },
  resultDate: {
    color: COLORS.textDim,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    marginBottom: 12,
  },
  resultSummaryCard: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 14,
    marginBottom: 14,
  },
  resultHero: {
    width: 154,
    height: 154,
    flexShrink: 0,
  },
  resultSummaryBody: {
    flex: 1,
  },
  resultHeroTitle: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: FONT_SERIF,
    marginBottom: 4,
  },
  resultHeroMeta: {
    color: COLORS.textDim,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: FONT_SANS,
  },
  resultScoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 14,
  },
  resultScoreCopy: {
    flex: 1,
  },
  resultScore: {
    fontSize: 48,
    lineHeight: 50,
    fontFamily: FONT_SERIF,
  },
  resultHeadline: {
    color: COLORS.text,
    fontSize: 17,
    lineHeight: 22,
    fontFamily: FONT_SANS,
    fontWeight: '600',
  },
  resultNote: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: FONT_SANS,
    marginTop: 4,
  },
  resultStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: COLORS.panelSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    lineHeight: 30,
    fontFamily: FONT_SERIF,
    marginBottom: 4,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: FONT_SANS,
    textAlign: 'center',
  },
  resultProgressCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  resultProgressLine: {
    color: COLORS.textDim,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONT_SANS,
  },
  passportSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    padding: 14,
    marginBottom: 14,
  },
  passportHeaderCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  passportEyebrow: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  passportCount: {
    color: COLORS.pink,
    fontSize: 12,
    fontFamily: FONT_SANS,
    fontWeight: '600',
    marginTop: 4,
  },
  passportBadge: {
    minHeight: 28,
    borderRadius: 999,
    paddingHorizontal: 10,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: 'rgba(167,102,79,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passportBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  passportIntroCompact: {
    color: COLORS.textDim,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: FONT_SANS,
    marginBottom: 10,
  },
  passportQuickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  passportQuickPill: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  passportQuickLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 15,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  passportQuickValue: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONT_SANS,
    fontWeight: '600',
    marginTop: 4,
  },
  passportStrip: {
    flexDirection: 'row',
    gap: 8,
  },
  passportTile: {
    width: '31.5%',
    minHeight: 82,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'flex-start',
  },
  passportTileActive: {
    backgroundColor: COLORS.pinkSoft,
    borderColor: 'rgba(167,102,79,0.24)',
  },
  passportTileValue: {
    color: COLORS.textMuted,
    fontSize: 20,
    lineHeight: 22,
    fontFamily: FONT_SERIF,
    marginBottom: 4,
  },
  passportTileValueActive: {
    color: COLORS.pink,
  },
  passportTileLabel: {
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    marginBottom: 6,
  },
  passportTileLabelActive: {
    color: COLORS.text,
  },
  passportTileNote: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT_SANS,
  },
  passportTileNoteActive: {
    color: '#edd6cc',
  },
  shareSection: {
    backgroundColor: COLORS.panelSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  shareSectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  sharePreviewCompact: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  sharePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sharePreviewBadge: {
    minHeight: 30,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: 'rgba(167,102,79,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sharePreviewBadgeText: {
    color: COLORS.text,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FONT_SANS,
    fontWeight: '700',
  },
  sharePreviewImage: {
    width: 92,
    height: 92,
    flexShrink: 0,
  },
  sharePreviewTextWrap: {
    flex: 1,
    gap: 6,
  },
  sharePreviewEyebrow: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: FONT_SANS,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sharePreviewTitle: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: FONT_SERIF,
  },
  sharePreviewMeta: {
    color: COLORS.textDim,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FONT_SANS,
  },
  sharePreviewQuote: {
    color: '#f5d8b3',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONT_SANS,
  },
  shareStatus: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FONT_SANS,
    textAlign: 'center',
  },
  resultActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
});
