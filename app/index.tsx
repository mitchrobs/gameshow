import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type ThemeMode,
  type ThemeTokens,
  resolveTheme,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { BUILD_ID } from '../src/constants/build';
import { getDailyPuzzle } from '../src/data/mojiMashPuzzles';
import { getDailyWhodunit } from '../src/data/whodunitPuzzles';
import { getDailyWordie } from '../src/data/wordiePuzzles';
import { getDailyThreadline } from '../src/data/threadlinePuzzles';
import { getTriviaFeedSummary } from '../src/data/trivia/summaries';
import { getDailySudoku } from '../src/data/sudokuPuzzles';
import { getDailyBarter, getGoodById } from '../src/data/barterPuzzles';
import { getDailyBridges } from '../src/data/bridgesPuzzles';
import { getDailyMiniCrossword } from '../src/data/miniCrosswordPuzzles';
import { getDailyMuseumArtwork } from '../src/data/museumArtworks';
import { getDailyDawnCabinet } from '../src/data/dawnCabinetPuzzles';
import { getGlobalPlayCounts } from '../src/globalPlayCount';
import { formatUtcDateLabel, getUtcDateKey } from '../src/utils/dailyUtc';

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

const STRADDLE_HOME_PILLAR_WORD = 'JAM';

type HomeGameCategory = 'all' | 'word' | 'logic' | 'trivia';
type FilterableGameCategory = Exclude<HomeGameCategory, 'all'>;

const HOME_GAME_FILTERS: { label: string; value: HomeGameCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Word', value: 'word' },
  { label: 'Logic', value: 'logic' },
  { label: 'Trivia', value: 'trivia' },
];

function coerceThemeMode(value: string | null | undefined): ThemeMode | null {
  return value === 'dark' || value === 'light' ? value : null;
}

function getWebThemeMode(): ThemeMode | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const root = document.documentElement;
  const datasetMode = root ? coerceThemeMode(root.dataset.daybreakTheme) : null;
  if (datasetMode) return datasetMode;

  const globalMode = coerceThemeMode(
    (window as typeof window & { __DAYBREAK_THEME__?: string }).__DAYBREAK_THEME__
  );
  if (globalMode) return globalMode;

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return null;
}

function useHomeTheme(baseTheme: ThemeTokens): ThemeTokens {
  const [webThemeMode, setWebThemeMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const apply = () => {
      const nextMode = getWebThemeMode();
      setWebThemeMode((prevMode) => {
        return prevMode === nextMode ? prevMode : nextMode;
      });
    };

    apply();

    const media =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;
    if (media && typeof media.addEventListener === 'function') {
      media.addEventListener('change', apply);
    } else if (media) {
      // Legacy Safari.
      // eslint-disable-next-line deprecation/deprecation
      media.addListener(apply);
    }

    const root = document.documentElement;
    const observer =
      typeof MutationObserver !== 'undefined' && root
        ? new MutationObserver(() => {
            apply();
          })
        : null;
    if (observer && root) {
      observer.observe(root, {
        attributes: true,
        attributeFilter: ['data-daybreak-theme'],
      });
    }

    window.addEventListener('focus', apply);
    window.addEventListener('pageshow', apply);

    return () => {
      if (media && typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', apply);
      } else if (media) {
        // eslint-disable-next-line deprecation/deprecation
        media.removeListener(apply);
      }
      window.removeEventListener('focus', apply);
      window.removeEventListener('pageshow', apply);
      observer?.disconnect();
    };
  }, []);

  return useMemo(() => {
    if (!webThemeMode || webThemeMode === baseTheme.mode) return baseTheme;
    return resolveTheme(webThemeMode);
  }, [baseTheme, webThemeMode]);
}

export default function HomeScreen() {
  const baseTheme = useDaybreakTheme();
  const theme = useHomeTheme(baseTheme);
  const screenAccent = useMemo(() => resolveScreenAccent('home', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const [isHydrated, setIsHydrated] = useState(Platform.OS !== 'web');
  const router = useRouter();
  const puzzle = getDailyPuzzle();
  const whodunit = getDailyWhodunit();
  const wordie = getDailyWordie();
  const threadline = getDailyThreadline();
  const mixTriviaSummary = useMemo(() => getTriviaFeedSummary('mix', 'hard'), []);
  const sportsTriviaSummary = useMemo(() => getTriviaFeedSummary('sports', 'hard'), []);
  const sudokuEntry = getDailySudoku();
  const sudoku = sudokuEntry.puzzle;
  const barterPuzzle = getDailyBarter();
  const bridgesPuzzle = getDailyBridges();
  const miniCrossword = getDailyMiniCrossword();
  const museumArtwork = getDailyMuseumArtwork();
  const dawnCabinet = getDailyDawnCabinet();
  const miniCrosswordPreview = useMemo(() => {
    const map = new Map<string, { isBlock: boolean; number?: number }>();
    miniCrossword.cells.forEach((cell) => {
      map.set(`${cell.row}:${cell.col}`, { isBlock: cell.isBlock, number: cell.number });
    });
    return Array.from({ length: miniCrossword.size }, (_, row) =>
      Array.from({ length: miniCrossword.size }, (_, col) => map.get(`${row}:${col}`))
    );
  }, [miniCrossword]);
  const bridgesPreviewValues = useMemo(() => {
    const values = bridgesPuzzle.islands.slice(0, 3).map((island) => island.requiredBridges);
    return values.length === 3 ? values : [2, 3, 1];
  }, [bridgesPuzzle]);
  const sudokuPreviewCellSize = sudoku.size === 9 ? 16 : 26;
  const sudokuPreviewBaseGap = sudoku.size === 9 ? 3 : 4;
  const sudokuPreviewBlockGap = sudoku.size === 9 ? 7 : 4;
  const sudokuDateLabel = useMemo(
    () => `${formatUtcDateLabel(sudokuEntry.date)} UTC`,
    [sudokuEntry.date]
  );
  const [streak, setStreak] = useState(0);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<HomeGameCategory>('all');
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
  const quickLinks = useMemo(() => {
    const baseLinks = [
      { label: 'Moji Mash', route: '/moji-mash', emoji: '🧩', countKey: 'mojimash', category: 'word' },
      { label: 'Wordie', route: '/wordie', emoji: '🔤', countKey: 'wordie', category: 'word' },
      { label: 'Straddle', route: '/straddle', emoji: '🔗', countKey: 'straddle', category: 'word', isNew: true },
      {
        label: 'Threadline',
        route: '/threadline',
        emoji: '🧵',
        countKey: 'threadline',
        category: 'word',
        isNew: true,
      },
      {
        label: 'Mini Crossword',
        route: '/mini-crossword',
        emoji: '✍️',
        countKey: 'crossword',
        category: 'word',
        isNew: true,
      },
      { label: 'Mini Sudoku', route: '/sudoku', emoji: '🧠', countKey: 'sudoku', category: 'logic' },
      {
        label: 'Dawn Cabinet',
        route: '/dawn-cabinet',
        emoji: '🀄',
        countKey: 'dawn-cabinet',
        category: 'logic',
        isNew: true,
      },
      { label: 'Bridges', route: '/bridges', emoji: '🏝️', countKey: 'bridges', category: 'logic' },
      { label: 'Museum', route: '/museum', emoji: '🖼️', countKey: 'museum', category: 'trivia', isNew: true },
      { label: 'Whodunit', route: '/whodunit', emoji: '🔍', countKey: 'whodunit', category: 'logic' },
      { label: 'Ballpark', route: '/ballpark', emoji: '🎯', countKey: 'ballpark', category: 'trivia', isNew: true },
      { label: 'Daily Mix', route: '/daily-mix', emoji: '⚡', countKey: 'trivia-mix', category: 'trivia' },
      { label: 'Daily Sports', route: '/daily-sports', emoji: '🏅', countKey: 'trivia-sports', category: 'trivia' },
      { label: 'Barter', route: '/barter', emoji: '↔️', countKey: 'barter', category: 'logic', isNew: true },
    ] satisfies {
      label: string;
      route: string;
      emoji: string;
      countKey: string;
      category: FilterableGameCategory;
      isNew?: boolean;
    }[];

    const entries = baseLinks.map((link, index) => ({
      ...link,
      baseIndex: index,
      playCount: playCounts[link.countKey] ?? 0,
    }));

    const hotKeys = [...entries]
      .sort((a, b) => b.playCount - a.playCount)
      .filter((entry) => entry.playCount > 0)
      .slice(0, 2)
      .map((entry) => entry.countKey);

    return entries
      .map((entry) => ({ ...entry, isHot: hotKeys.includes(entry.countKey) }))
      .sort((a, b) => {
        const aRank = a.isHot ? 0 : a.isNew ? 1 : 2;
        const bRank = b.isHot ? 0 : b.isNew ? 1 : 2;
        if (aRank !== bRank) return aRank - bRank;
        if (aRank === 0) return b.playCount - a.playCount || a.baseIndex - b.baseIndex;
        return a.baseIndex - b.baseIndex;
      });
  }, [playCounts]);
  const filteredQuickLinks = useMemo(
    () =>
      quickLinks.filter((item) => activeCategory === 'all' || item.category === activeCategory),
    [activeCategory, quickLinks]
  );
  const shouldShowGame = (category: FilterableGameCategory) =>
    activeCategory === 'all' || activeCategory === category;

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

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

    const hasAnyDaily = (date: Date) => {
      const key = keyForDate(date);
      const utcKey = getUtcDateKey(date);
      return (
        storage.getItem(`mojimash:daily:${key}`) === '1' ||
        storage.getItem(`wordie:daily:${key}`) === '1' ||
        storage.getItem(`straddle:daily:${key}`) === '1' ||
        storage.getItem(`threadline:daily:${key}`) === '1' ||
        storage.getItem(`crossword:daily:${key}`) === '1' ||
        storage.getItem(`museum:daily:${key}`) === '1' ||
        storage.getItem(`whodunit:daily:${key}`) === '1' ||
        storage.getItem(`ballpark:daily:${key}`) === '1' ||
        storage.getItem(`trivia:mix:daily:${key}`) === '1' ||
        storage.getItem(`trivia:sports:daily:${key}`) === '1' ||
        storage.getItem(`barter:daily:${key}`) === '1' ||
        storage.getItem(`dawn-cabinet:daily:${key}`) === '1' ||
        storage.getItem(`dawn-cabinet:daily:${utcKey}`) === '1' ||
        storage.getItem(`dawn-cabinet-v10:daily:${utcKey}:Standard`) === '1' ||
        storage.getItem(`dawn-cabinet-v10:daily:${utcKey}:Hard`) === '1' ||
        storage.getItem(`dawn-cabinet-v10:daily:${utcKey}:Expert`) === '1' ||
        storage.getItem(`sudoku:daily:${key}`) === '1' ||
        storage.getItem(`sudoku:daily:${utcKey}`) === '1' ||
        storage.getItem(`bridges:daily:${key}`) === '1' ||
        storage.getItem(`bridges:daily:${utcKey}`) === '1'
      );
    };

    let count = 0;
    const cursor = new Date();
    while (hasAnyDaily(cursor)) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    setStreak(count);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    getGlobalPlayCounts([
      'mojimash',
      'wordie',
      'straddle',
      'threadline',
      'crossword',
      'sudoku',
      'dawn-cabinet',
      'bridges',
      'museum',
      'whodunit',
      'ballpark',
      'trivia-mix',
      'trivia-sports',
      'barter',
    ])
      .then((counts) => {
        if (Object.keys(counts).length > 0) {
          setPlayCounts(counts);
        }
      });
  }, [isHydrated]);

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.topbarSticky}>
          <View style={styles.topbar}>
            <View style={styles.topbarLeft}>
              <Text style={styles.wordmark}>Daybreak</Text>
            </View>
            {streak > 0 && (
              <View style={styles.topbarStreak}>
                <Text style={styles.streakText}>{streak}-day streak</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.dateSubtitle}>{dateLabel}</Text>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Browse games</Text>
            <View style={styles.filterTabs}>
              {HOME_GAME_FILTERS.map((filter) => {
                const selected = activeCategory === filter.value;
                return (
                  <Pressable
                    key={filter.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={({ pressed }) => [
                      styles.filterTab,
                      selected && styles.filterTabActive,
                      pressed && styles.filterTabPressed,
                    ]}
                    onPress={() => setActiveCategory(filter.value)}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        selected && styles.filterTabTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.quickLinksSection}>
            <View style={styles.quickLinksHeader}>
              <Text style={styles.quickLinksTitle}>Quick links</Text>
              <Text style={styles.quickLinksSubtitle}>Jump into a game.</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickLinksRow}
            >
              {filteredQuickLinks.map((item) => (
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
                  {item.isHot && (
                    <View style={styles.quickLinkHotBadge}>
                      <Text style={styles.quickLinkHotText}>Hot</Text>
                    </View>
                  )}
                  {(playCounts[item.countKey] ?? 0) > 0 && (
                    <Text style={styles.quickLinkCount}>{playCounts[item.countKey]} plays</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Museum card */}
          <View style={[styles.gameSection, !shouldShowGame('trivia') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.museumKicker}>Learn</Text>
                <Text style={styles.gameTitle}>Museum</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Discover one artwork, read its story, then answer three quick noticing questions.
            </Text>
            {(playCounts['museum'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['museum']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.museumPreview}>
                <Image
                  source={{ uri: museumArtwork.images.thumbnailUrl }}
                  style={styles.museumPreviewImage}
                />
                <View style={styles.museumPreviewText}>
                  <Text style={styles.museumPreviewTitle}>{museumArtwork.title}</Text>
                  <Text style={styles.museumPreviewMeta}>
                    {museumArtwork.artist} - {museumArtwork.objectDate}
                  </Text>
                  <Text style={styles.museumPreviewTag}>{museumArtwork.periodTag}</Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/museum')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Moji Mash card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Word Puzzle</Text>
              <Text style={styles.gameTitle}>Moji Mash</Text>
            </View>
            <Text style={styles.blurb}>
              Genmojis are AI-styled emoji blends - guess the words behind today's image.
            </Text>
            {(playCounts['mojimash'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['mojimash']} plays today</Text>
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

          {/* Wordie card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Word Guess</Text>
              <Text style={styles.gameTitle}>Wordie</Text>
            </View>
            <Text style={styles.blurb}>
              Solve the {wordie.length}-letter word in {wordie.guesses_allowed} guesses.
            </Text>
            {(playCounts['wordie'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['wordie']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.wordiePreview}>
                {Array.from({ length: 2 }).map((_, row) => (
                  <View key={row} style={styles.wordieRow}>
                    {Array.from({ length: wordie.length }).map((_, col) => (
                      <View
                        key={col}
                        style={[
                          styles.wordieTile,
                          wordie.length === 6 && styles.wordieTileCompact,
                        ]}
                      >
                        {row === 0 && col === 0 ? (
                          <Text style={styles.wordieTileText}>{wordie.word[0]}</Text>
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
                onPress={() => router.push('/wordie')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Straddle card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.straddleKicker}>Word Grid</Text>
                <Text style={styles.gameTitle}>Straddle</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Arrange nine words so every row and column reveals a hidden category.
            </Text>
            {(playCounts['straddle'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['straddle']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.straddlePreview}>
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <View key={`straddle-row-${rowIndex}`} style={styles.straddlePreviewRow}>
                    {Array.from({ length: 3 }, (_, columnIndex) => {
                      const isPillar = rowIndex === 1 && columnIndex === 1;
                      return (
                        <View
                          key={`straddle-preview-${rowIndex}-${columnIndex}`}
                          style={[
                            styles.straddlePreviewTile,
                            isPillar && styles.straddlePreviewTilePillar,
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={styles.straddlePreviewText}
                          >
                            {isPillar ? STRADDLE_HOME_PILLAR_WORD : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
                <Text style={styles.straddlePreviewMeta}>6 hidden links · 4 misses</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/straddle')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Threadline card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.threadlineKicker}>Daily Word Puzzle</Text>
                <Text style={styles.gameTitle}>Threadline</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Fill the blanks by drawing each missing word in the grid.
            </Text>
            {(playCounts['threadline'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['threadline']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.threadlinePreview}>
                <Text style={styles.threadlinePreviewTitle}>{threadline.title}</Text>
                <Text style={styles.threadlinePreviewCopy}>
                  {threadline.words.length} hidden words - {threadline.threads.length} hidden themes.
                </Text>
                <View style={styles.threadlinePreviewGrid}>
                  {threadline.grid.slice(0, 4).map((row, rowIndex) => (
                    <View key={`threadline-preview-row-${rowIndex}`} style={styles.threadlinePreviewRow}>
                      {row.slice(0, 4).split('').map((letter, colIndex) => (
                        <View
                          key={`threadline-preview-${rowIndex}-${colIndex}`}
                          style={[
                            styles.threadlinePreviewCell,
                            rowIndex === colIndex && styles.threadlinePreviewCellActive,
                          ]}
                        >
                          <Text style={styles.threadlinePreviewCellText}>{letter}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/threadline')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Mini Crossword card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.crosswordKicker}>Word Grid</Text>
                <Text style={styles.gameTitle}>Mini Crossword</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              A quick 5x5 crossword with fresh clues every day.
            </Text>
            {(playCounts['crossword'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['crossword']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.crosswordPreview}>
                {miniCrosswordPreview.map((row, rowIndex) => (
                  <View key={`crossword-row-${rowIndex}`} style={styles.crosswordPreviewRow}>
                    {row.map((cell, colIndex) => (
                      <View
                        key={`crossword-${rowIndex}-${colIndex}`}
                        style={[
                          styles.crosswordPreviewCell,
                          cell?.isBlock && styles.crosswordPreviewBlock,
                        ]}
                      >
                        {!cell?.isBlock && cell?.number ? (
                          <Text style={styles.crosswordPreviewNumber}>{cell.number}</Text>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ))}
                <Text style={styles.crosswordPreviewMeta}>
                  {miniCrossword.across.length} across • {miniCrossword.down.length} down
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/mini-crossword')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Mini Sudoku card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Logic Grid</Text>
              <Text style={styles.gameTitle}>Mini Sudoku</Text>
            </View>
            <Text style={styles.blurb}>
              A daily Sudoku that ramps from breezy 6x6 boards to full 9x9 hard days.
            </Text>
            {(playCounts['sudoku'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['sudoku']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.sudokuPreview}>
                <Text style={styles.sudokuPreviewDate}>{sudokuDateLabel}</Text>
                <Text style={styles.sudokuPreviewMeta}>
                  {sudokuEntry.difficulty} · {sudoku.size}x{sudoku.size}
                </Text>
                {sudoku.grid.map((row, rowIndex) => (
                  <View
                    key={`sudoku-row-${rowIndex}`}
                    style={[
                      styles.sudokuRow,
                      {
                        marginBottom:
                          rowIndex % sudoku.boxRows === sudoku.boxRows - 1 &&
                          rowIndex !== sudoku.size - 1
                            ? sudokuPreviewBlockGap
                            : sudokuPreviewBaseGap,
                      },
                    ]}
                  >
                    {row.map((value, colIndex) => (
                      <View
                        key={`sudoku-${rowIndex}-${colIndex}`}
                        style={[
                          styles.sudokuCell,
                          {
                            width: sudokuPreviewCellSize,
                            height: sudokuPreviewCellSize,
                            marginRight:
                              colIndex % sudoku.boxCols === sudoku.boxCols - 1 &&
                              colIndex !== sudoku.size - 1
                                ? sudokuPreviewBlockGap
                                : sudokuPreviewBaseGap,
                          },
                          value !== 0 && styles.sudokuCellFilled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sudokuCellText,
                            sudoku.size === 9 && styles.sudokuCellTextCompact,
                          ]}
                        >
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

          {/* Dawn Cabinet card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.cabinetKicker}>Tile Logic</Text>
                <Text style={styles.gameTitle}>Dawn Cabinet</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              A Mahjong-inspired logic cabinet with hidden rails, exact tile banks, and reserve goals.
            </Text>
            {(playCounts['dawn-cabinet'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['dawn-cabinet']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.cabinetPreview}>
                <Text style={styles.cabinetPreviewMeta}>
                  Choose Standard, Hard, or Expert · {dawnCabinet.lines.length} rails
                </Text>
                {Array.from({ length: Math.min(dawnCabinet.rows, 3) }, (_, rowIndex) => (
                  <View key={`cabinet-row-${rowIndex}`} style={styles.cabinetPreviewRow}>
                    {Array.from({ length: Math.min(dawnCabinet.columns, 5) }, (_, colIndex) => {
                      const tile = dawnCabinet.givens[`${rowIndex}:${colIndex}`];
                      return (
                        <View
                          key={`cabinet-${rowIndex}-${colIndex}`}
                          style={[
                            styles.cabinetPreviewCell,
                            tile && styles.cabinetPreviewCellFilled,
                          ]}
                        >
                          <Text style={styles.cabinetPreviewCellText}>
                            {tile ? tile.rank : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/dawn-cabinet')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Bridges card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.bridgesKicker}>Logic Puzzle</Text>
              <Text style={styles.gameTitle}>Bridges</Text>
            </View>
            <Text style={styles.blurb}>
              Match each island&apos;s number with bridges. Connect all islands with no crossings.
            </Text>
            {(playCounts['bridges'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['bridges']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.bridgesPreview}>
                <Text style={styles.bridgesPreviewEmoji}>🏝️</Text>
                <View style={styles.bridgesPreviewRow}>
                  {bridgesPreviewValues.map((value, index) => (
                    <View key={`bridge-preview-${index}`} style={styles.bridgesPreviewRowItem}>
                      <View style={styles.bridgesPreviewIsland}>
                        <Text style={styles.bridgesPreviewIslandText}>{value}</Text>
                      </View>
                      {index < bridgesPreviewValues.length - 1 && (
                        <View style={styles.bridgesPreviewConnector} />
                      )}
                    </View>
                  ))}
                </View>
                <Text style={styles.bridgesPreviewCaption}>Tap islands to add bridges.</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/bridges')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Ballpark card */}
          <View style={[styles.gameSection, !shouldShowGame('trivia') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.ballparkKicker}>Estimation Trivia</Text>
              <Text style={styles.gameTitle}>Ballpark</Text>
            </View>
            <Text style={styles.blurb}>
              Three themed number questions every day, with a tougher Extra Inning on Fridays.
            </Text>
            {(playCounts['ballpark'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['ballpark']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.ballparkPreview}>
                <Text style={styles.ballparkPreviewLabel}>Today&apos;s format</Text>
                <View style={styles.ballparkPreviewStats}>
                  <View style={styles.ballparkPreviewStat}>
                    <Text style={styles.ballparkPreviewValue}>3</Text>
                    <Text style={styles.ballparkPreviewStatText}>Questions</Text>
                  </View>
                  <View style={styles.ballparkPreviewStat}>
                    <Text style={styles.ballparkPreviewValue}>4</Text>
                    <Text style={styles.ballparkPreviewStatText}>Guesses</Text>
                  </View>
                  <View style={styles.ballparkPreviewStat}>
                    <Text style={styles.ballparkPreviewValue}>Fri</Text>
                    <Text style={styles.ballparkPreviewStatText}>Bonus</Text>
                  </View>
                </View>
                <Text style={styles.ballparkPreviewCaption}>
                  Good guesses beat good memory.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/ballpark')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Daily Mix card */}
          <View style={[styles.gameSection, !shouldShowGame('trivia') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Quickfire</Text>
              <Text style={styles.gameTitle}>Daily Mix</Text>
            </View>
            <Text style={styles.blurb}>
              Broad daily trivia with Easy and Hard variants, one shield, and a clean share at the
              end.
            </Text>
            {(playCounts['trivia-mix'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['trivia-mix']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.triviaPreview}>
                <Text style={styles.triviaPreviewTitle}>Today's game</Text>
                <View style={styles.triviaFeedGrid}>
                  <View style={styles.triviaFeedCard}>
                    <Text style={styles.triviaFeedName}>{mixTriviaSummary.title}</Text>
                    <Text style={styles.triviaFeedMeta}>
                      {mixTriviaSummary.questionCount} questions · {mixTriviaSummary.timerSeconds}s timer
                    </Text>
                  </View>
                  <View style={styles.triviaFeedCard}>
                    <Text style={styles.triviaFeedName}>Easy / Hard</Text>
                    <Text style={styles.triviaFeedMeta}>Choose your version before the run starts</Text>
                  </View>
                </View>
                <Text style={styles.triviaPreviewNote}>
                  Three choices each, one shield, and a steady 15-second pace.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/daily-mix')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Daily Sports card */}
          <View style={[styles.gameSection, !shouldShowGame('trivia') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Quickfire</Text>
              <Text style={styles.gameTitle}>Daily Sports</Text>
            </View>
            <Text style={styles.blurb}>
              Sports-only daily trivia with Easy and Hard variants, a sharper curve, and the same
              quick share at the end.
            </Text>
            {(playCounts['trivia-sports'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['trivia-sports']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.triviaPreview}>
                <Text style={styles.triviaPreviewTitle}>Today's game</Text>
                <View style={styles.triviaFeedGrid}>
                  <View style={styles.triviaFeedCard}>
                    <Text style={styles.triviaFeedName}>{sportsTriviaSummary.title}</Text>
                    <Text style={styles.triviaFeedMeta}>
                      {sportsTriviaSummary.questionCount} questions · {sportsTriviaSummary.timerSeconds}s timer
                    </Text>
                  </View>
                  <View style={styles.triviaFeedCard}>
                    <Text style={styles.triviaFeedName}>Easy / Hard</Text>
                    <Text style={styles.triviaFeedMeta}>Choose your version before the run starts</Text>
                  </View>
                </View>
                <Text style={styles.triviaPreviewNote}>
                  Hard stays the tougher daily. Easy is a full parallel schedule.
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/daily-sports')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Barter card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.barterKicker}>Resource Exchange</Text>
                <Text style={styles.gameTitle}>Barter</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              A daily trade-chain puzzle inspired by historic markets. Reach the goal in as few
              swaps as possible.
            </Text>
            {(playCounts['barter'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['barter']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.barterPreview}>
                <Text style={styles.barterPreviewLabel}>Today&apos;s Goal</Text>
                <View style={styles.barterPreviewGoal}>
                  <Text style={styles.barterPreviewEmoji}>
                    {getGoodById(barterPuzzle.goal.good).emoji}
                  </Text>
                  <Text style={styles.barterPreviewGoalText}>
                    {barterPuzzle.goal.qty} {getGoodById(barterPuzzle.goal.good).name}
                  </Text>
                </View>
                <View style={styles.barterPreviewMeta}>
                  <Text style={styles.barterPreviewMetaText}>Par {barterPuzzle.par} trades</Text>
                  <Text style={styles.barterPreviewMetaDivider}>•</Text>
                  <Text style={styles.barterPreviewMetaText}>
                    {barterPuzzle.goods.length} goods
                  </Text>
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/barter')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Whodunit card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Logic Deduction</Text>
              <Text style={styles.gameTitle}>Whodunit</Text>
            </View>
            <Text style={styles.blurb}>
              A daily murder mystery. Read clues, eliminate suspects, deduce the killer.
            </Text>
            {(playCounts['whodunit'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['whodunit']} plays today</Text>
              </View>
            )}
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

const createStyles = (
  theme: ThemeTokens,
  screenAccent: ReturnType<typeof resolveScreenAccent>
) => {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const FontSize = theme.fontSize;
  const BorderRadius = theme.borderRadius;
  const ui = createDaybreakPrimitives(theme, screenAccent);
  const bridgesAccent = resolveScreenAccent('bridges', theme);
  const barterAccent = resolveScreenAccent('barter', theme);
  const crosswordAccent = resolveScreenAccent('mini-crossword', theme);
  const straddleAccent = resolveScreenAccent('wordie', theme);
  const threadlineAccent = resolveScreenAccent('threadline', theme);
  const museumAccent = resolveScreenAccent('museum', theme);
  const ballparkAccent = resolveScreenAccent('trivia', theme);
  const cabinetAccent = resolveScreenAccent('dawn-cabinet', theme);
  const quickLinkPressed = theme.mode === 'dark' ? screenAccent.soft : screenAccent.badgeBg;
  const hotBadge = theme.mode === 'dark'
    ? {
        bg: screenAccent.badgeBg,
        border: screenAccent.badgeBorder,
        text: screenAccent.badgeText,
      }
    : {
        bg: '#fff1df',
        border: '#f2bc79',
        text: '#8a4300',
      };

  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSoft,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundSoft,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: Colors.backgroundSoft,
  },
  page: {
    ...ui.page,
  },
  topbarSticky: {
    ...ui.page,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    zIndex: 2,
  },
  topbar: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: Colors.line,
    borderRadius: 18,
    backgroundColor: Colors.surfaceGlass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    ...theme.shadows.glass,
  },
  topbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  topbarStreak: {
    ...ui.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  wordmark: {
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 3.2,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  dateSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  filterSection: {
    marginBottom: Spacing.lg,
  },
  filterLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterTab: {
    ...WEB_NO_SELECT,
    minHeight: 38,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceGlass,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  filterTabActive: {
    borderColor: screenAccent.badgeBorder,
    backgroundColor: screenAccent.badgeBg,
  },
  filterTabPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  filterTabText: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: screenAccent.badgeText,
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
    ...ui.glassCard,
    ...WEB_NO_SELECT,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minWidth: 120,
    alignItems: 'center',
  },
  quickLinkCardPressed: {
    backgroundColor: quickLinkPressed,
    borderColor: screenAccent.badgeBorder,
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
  quickLinkCount: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  quickLinkHotBadge: {
    marginTop: Spacing.xs,
    backgroundColor: hotBadge.bg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: hotBadge.border,
  },
  quickLinkHotText: {
    fontSize: 11,
    fontWeight: '700',
    color: hotBadge.text,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  gameSection: {
    marginBottom: Spacing.xl,
  },
  gameSectionHidden: {
    display: 'none',
  },
  gameLabelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
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
  bridgesKicker: {
    color: bridgesAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  barterKicker: {
    color: barterAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  crosswordKicker: {
    color: crosswordAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  straddleKicker: {
    color: straddleAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  threadlineKicker: {
    color: threadlineAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  museumKicker: {
    color: museumAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  cabinetKicker: {
    color: cabinetAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  ballparkKicker: {
    color: ballparkAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  streakPill: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    ...ui.pill,
  },
  streakText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dailyCard: {
    ...ui.card,
    padding: Spacing.xl,
    marginTop: Spacing.md,
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
  wordiePreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  wordieRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  wordieTile: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordieTileCompact: {
    width: 38,
    height: 38,
  },
  wordieTileText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  straddlePreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 6,
  },
  straddlePreviewRow: {
    flexDirection: 'row',
    gap: 6,
  },
  straddlePreviewTile: {
    width: 76,
    height: 38,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  straddlePreviewTilePillar: {
    backgroundColor: straddleAccent.soft,
    borderColor: straddleAccent.main,
  },
  straddlePreviewText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.text,
  },
  straddlePreviewMeta: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  threadlinePreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  threadlinePreviewTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text,
  },
  threadlinePreviewCopy: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  threadlinePreviewGrid: {
    marginTop: Spacing.xs,
    gap: 4,
  },
  threadlinePreviewRow: {
    flexDirection: 'row',
    gap: 4,
  },
  threadlinePreviewCell: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadlinePreviewCellActive: {
    backgroundColor: threadlineAccent.badgeBg,
    borderColor: threadlineAccent.badgeBorder,
  },
  threadlinePreviewCellText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  crosswordPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  crosswordPreviewRow: {
    flexDirection: 'row',
    gap: 4,
  },
  crosswordPreviewCell: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 2,
    paddingTop: 1,
  },
  crosswordPreviewBlock: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  crosswordPreviewNumber: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  crosswordPreviewMeta: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
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
  sudokuPreviewDate: {
    fontSize: 11,
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  sudokuPreviewMeta: {
    marginBottom: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  cabinetPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 5,
  },
  cabinetPreviewMeta: {
    marginBottom: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  cabinetPreviewRow: {
    flexDirection: 'row',
    gap: 5,
  },
  cabinetPreviewCell: {
    width: 30,
    height: 38,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: cabinetAccent.badgeBorder,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cabinetPreviewCellFilled: {
    backgroundColor: theme.mode === 'dark' ? '#fff8e9' : '#fff7e7',
    borderColor: cabinetAccent.main,
  },
  cabinetPreviewCellText: {
    fontSize: FontSize.sm,
    fontWeight: '900',
    color: theme.mode === 'dark' ? '#221a12' : Colors.text,
  },
  bridgesPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  bridgesPreviewEmoji: {
    fontSize: 22,
  },
  bridgesPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgesPreviewRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bridgesPreviewIsland: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgesPreviewIslandText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  bridgesPreviewConnector: {
    width: 28,
    height: 3,
    marginHorizontal: Spacing.xs,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  bridgesPreviewCaption: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sudokuRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sudokuCell: {
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  },
  sudokuCellFilled: {
    backgroundColor: Colors.surfaceLight,
  },
  sudokuCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  sudokuCellTextCompact: {
    fontSize: 10,
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
  triviaFeedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  triviaFeedCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    minWidth: 132,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  triviaFeedName: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '700',
  },
  triviaFeedMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  triviaPreviewNote: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  ballparkPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  ballparkPreviewLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  ballparkPreviewStats: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  ballparkPreviewStat: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    minWidth: 74,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ballparkPreviewValue: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
  },
  ballparkPreviewStatText: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  ballparkPreviewCaption: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 280,
  },
  museumPreview: {
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  museumPreviewImage: {
    width: '100%',
    height: 190,
    backgroundColor: Colors.surface,
  },
  museumPreviewText: {
    padding: Spacing.md,
  },
  museumPreviewTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: Colors.text,
  },
  museumPreviewMeta: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 3,
  },
  museumPreviewTag: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    backgroundColor: museumAccent.badgeBg,
    color: museumAccent.badgeText,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barterPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  barterPreviewLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  barterPreviewGoal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  barterPreviewEmoji: {
    fontSize: 24,
  },
  barterPreviewGoalText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  barterPreviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  barterPreviewMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  barterPreviewMetaDivider: {
    fontSize: 12,
    color: Colors.textMuted,
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
    ...ui.cta,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.lg,
  },
  playButtonPressed: {
    ...ui.ctaPressed,
  },
  playButtonText: {
    ...ui.ctaText,
    fontSize: FontSize.md,
    letterSpacing: 0.7,
    textTransform: 'none',
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
};
