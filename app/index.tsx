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
import { getDailyKilter } from '../src/data/kilter';
import { getDailyMuseumArtwork } from '../src/data/museumArtworks';
import { getGlobalPlayCounts } from '../src/globalPlayCount';
import { getUtcDateKey } from '../src/utils/dailyUtc';

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

const SUBSET_HOME_PILLAR_WORD = 'JAM';
const HOME_MOJI_PREVIEW_IMAGE = require('../assets/genmoji/spicy-curry.png');
const HOME_WORDIE_PREVIEW = { length: 5, guessesAllowed: 6, firstLetter: 'P' };
const HOME_THREADLINE_PREVIEW = {
  title: 'Threadline',
  words: 8,
  threads: 3,
  grid: ['WORD', 'GRID', 'PLAY', 'LINE'],
};
const HOME_CROSSWORD_PREVIEW = {
  across: 5,
  down: 5,
  cells: [
    [{ number: 1 }, { number: 2 }, { number: 3 }, { isBlock: true }, { number: 4 }],
    [{}, {}, {}, { number: 5 }, {}],
    [{ number: 6 }, {}, { isBlock: true }, {}, {}],
    [{}, { number: 7 }, {}, {}, {}],
    [{ number: 8 }, {}, {}, { isBlock: true }, {}],
  ],
};
const HOME_SUDOKU_PREVIEW = {
  dateLabel: 'Daily UTC',
  difficulty: 'Medium',
  size: 6,
  boxRows: 2,
  boxCols: 3,
  grid: [
    [3, 0, 0, 4, 1, 0],
    [0, 0, 5, 3, 0, 0],
    [5, 0, 6, 0, 0, 2],
    [0, 1, 0, 0, 6, 0],
    [0, 4, 0, 6, 0, 0],
    [2, 0, 1, 0, 0, 5],
  ],
};
const HOME_CABINET_PREVIEW = {
  rails: 8,
  rows: 3,
  columns: 5,
  givens: {
    '0:0': { rank: '1' },
    '0:2': { rank: '4' },
    '1:1': { rank: '7' },
    '1:4': { rank: '2' },
    '2:0': { rank: 'D' },
    '2:3': { rank: '6' },
  } as Record<string, { rank: string }>,
};
type HomeLibertiesCell = 'black' | 'white' | 'frozen' | null;
const HOME_LIBERTIES_PREVIEW: HomeLibertiesCell[][] = [
  [null, null, 'black', null, null, 'frozen', null, null],
  [null, 'white', 'white', null, 'black', null, 'white', null],
  ['black', null, null, null, null, null, 'white', null],
  [null, null, 'black', 'white', 'white', null, null, null],
  [null, 'frozen', null, null, 'black', null, 'black', null],
  [null, null, 'white', null, null, 'white', 'white', null],
  [null, 'black', null, null, null, null, null, null],
  [null, null, null, 'frozen', null, 'black', null, null],
];
const HOME_LIBERTIES_GROUP_COUNT = 5;
const HOME_BRIDGES_PREVIEW_VALUES = [2, 3, 1];
const HOME_TRIVIA_MIX_SUMMARY = {
  title: 'Daily Mix',
  questionCount: 10,
  timerSeconds: 15,
};
const HOME_TRIVIA_SPORTS_SUMMARY = {
  title: 'Daily Sports',
  questionCount: 10,
  timerSeconds: 15,
};
const HOME_BARTER_PREVIEW = {
  goal: { emoji: '🏺', qty: 2, name: 'Pottery' },
  par: 12,
  goods: 6,
};
const HOME_WHODUNIT_PREVIEW = {
  caseNumber: 17,
  caseName: 'The Locked Study',
  suspects: [
    { emoji: '🎩', name: 'Avery' },
    { emoji: '🕰️', name: 'Blair' },
    { emoji: '🗝️', name: 'Casey' },
  ],
};
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
  const kilter = getDailyKilter();
  const sudokuPreviewCellSize = HOME_SUDOKU_PREVIEW.size === 9 ? 16 : 26;
  const sudokuPreviewBaseGap = HOME_SUDOKU_PREVIEW.size === 9 ? 3 : 4;
  const sudokuPreviewBlockGap = HOME_SUDOKU_PREVIEW.size === 9 ? 7 : 4;
  const [streak, setStreak] = useState(0);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<HomeGameCategory>('all');
  const museumArtwork = useMemo(() => getDailyMuseumArtwork(), []);
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
      { label: 'Composed', route: '/kilter', emoji: '✒️', countKey: 'kilter', category: 'word', isNew: true },
      { label: 'Subset', route: '/subset', emoji: '🟦', countKey: 'subset', category: 'word', isNew: true },
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
      {
        label: 'Liberties',
        route: '/liberties',
        emoji: '⚫',
        countKey: 'liberties',
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
        storage.getItem(`kilter:daily:${key}`) === '1' ||
        storage.getItem(`subset:daily:${key}`) === '1' ||
        storage.getItem(`threadline:daily:${key}`) === '1' ||
        storage.getItem(`crossword:daily:${key}`) === '1' ||
        storage.getItem(`museum:daily:${key}`) === '1' ||
        storage.getItem(`whodunit:daily:${key}`) === '1' ||
        storage.getItem(`ballpark:daily:${key}`) === '1' ||
        storage.getItem(`trivia:mix:daily:${key}`) === '1' ||
        storage.getItem(`trivia:sports:daily:${key}`) === '1' ||
        storage.getItem(`barter:daily:${key}`) === '1' ||
        storage.getItem(`closeout:daily:${key}`) === '1' ||
        storage.getItem(`closeout:daily:${utcKey}`) === '1' ||
        storage.getItem(`liberties:daily:${key}`) === '1' ||
        storage.getItem(`liberties:daily:${utcKey}`) === '1' ||
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
      'kilter',
      'subset',
      'threadline',
      'crossword',
      'sudoku',
      'dawn-cabinet',
      'liberties',
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
                <Image source={HOME_MOJI_PREVIEW_IMAGE} style={styles.previewImage} />
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
              Solve the {HOME_WORDIE_PREVIEW.length}-letter word in {HOME_WORDIE_PREVIEW.guessesAllowed} guesses.
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
                    {Array.from({ length: HOME_WORDIE_PREVIEW.length }).map((_, col) => (
                      <View
                        key={col}
                        style={[
                          styles.wordieTile,
                          HOME_WORDIE_PREVIEW.length === 6 && styles.wordieTileCompact,
                        ]}
                      >
                        {row === 0 && col === 0 ? (
                          <Text style={styles.wordieTileText}>{HOME_WORDIE_PREVIEW.firstLetter}</Text>
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

          {/* Composed card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.kilterKicker}>Word Sprint</Text>
                <Text style={styles.gameTitle}>Composed</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Build as many words as you can in five minutes, using today's green letters every time.
            </Text>
            {(playCounts['kilter'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['kilter']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.kilterPreview}>
                <View style={styles.kilterAnchorPreview}>
                  {kilter.key.split('').map((letter, index) => (
                    <Text key={`kilter-anchor-${letter}-${index}`} style={styles.kilterAnchorText}>
                      {letter}
                    </Text>
                  ))}
                </View>
                <View style={styles.kilterLooseRow}>
                  {kilter.letters.map((letter) => (
                    <View key={`kilter-${letter}`} style={styles.kilterLooseTile}>
                      <Text style={styles.kilterLooseText}>{letter}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.kilterPreviewMeta}>
                  {kilter.coreWords.length} core - Sweep 0/{kilter.sweeps.length}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/kilter')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Subset card */}
          <View style={[styles.gameSection, !shouldShowGame('word') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.subsetKicker}>Word Grid</Text>
                <Text style={styles.gameTitle}>Subset</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Arrange nine words into hidden groups across every row and column.
            </Text>
            {(playCounts['subset'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['subset']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.subsetPreview}>
                {Array.from({ length: 3 }, (_, rowIndex) => (
                  <View key={`subset-row-${rowIndex}`} style={styles.subsetPreviewRow}>
                    {Array.from({ length: 3 }, (_, columnIndex) => {
                      const isPillar = rowIndex === 1 && columnIndex === 1;
                      return (
                        <View
                          key={`subset-preview-${rowIndex}-${columnIndex}`}
                          style={[
                            styles.subsetPreviewTile,
                            isPillar && styles.subsetPreviewTilePillar,
                          ]}
                        >
                          <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={styles.subsetPreviewText}
                          >
                            {isPillar ? SUBSET_HOME_PILLAR_WORD : ''}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
                <Text style={styles.subsetPreviewMeta}>6 hidden links · 4 misses</Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/subset')}
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
                <Text style={styles.threadlinePreviewTitle}>{HOME_THREADLINE_PREVIEW.title}</Text>
                <Text style={styles.threadlinePreviewCopy}>
                  {HOME_THREADLINE_PREVIEW.words} hidden words - {HOME_THREADLINE_PREVIEW.threads} hidden themes.
                </Text>
                <View style={styles.threadlinePreviewGrid}>
                  {HOME_THREADLINE_PREVIEW.grid.map((row, rowIndex) => (
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
                {HOME_CROSSWORD_PREVIEW.cells.map((row, rowIndex) => (
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
                  {HOME_CROSSWORD_PREVIEW.across} across • {HOME_CROSSWORD_PREVIEW.down} down
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
                <Text style={styles.sudokuPreviewDate}>{HOME_SUDOKU_PREVIEW.dateLabel}</Text>
                <Text style={styles.sudokuPreviewMeta}>
                  {HOME_SUDOKU_PREVIEW.difficulty} · {HOME_SUDOKU_PREVIEW.size}x{HOME_SUDOKU_PREVIEW.size}
                </Text>
                {HOME_SUDOKU_PREVIEW.grid.map((row, rowIndex) => (
                  <View
                    key={`sudoku-row-${rowIndex}`}
                    style={[
                      styles.sudokuRow,
                      {
                        marginBottom:
                          rowIndex % HOME_SUDOKU_PREVIEW.boxRows === HOME_SUDOKU_PREVIEW.boxRows - 1 &&
                          rowIndex !== HOME_SUDOKU_PREVIEW.size - 1
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
                              colIndex % HOME_SUDOKU_PREVIEW.boxCols === HOME_SUDOKU_PREVIEW.boxCols - 1 &&
                              colIndex !== HOME_SUDOKU_PREVIEW.size - 1
                                ? sudokuPreviewBlockGap
                                : sudokuPreviewBaseGap,
                          },
                          value !== 0 && styles.sudokuCellFilled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.sudokuCellText,
                            HOME_SUDOKU_PREVIEW.size === 9 && styles.sudokuCellTextCompact,
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
                  Choose Standard, Hard, or Expert · {HOME_CABINET_PREVIEW.rails} rails
                </Text>
                {Array.from({ length: Math.min(HOME_CABINET_PREVIEW.rows, 3) }, (_, rowIndex) => (
                  <View key={`cabinet-row-${rowIndex}`} style={styles.cabinetPreviewRow}>
                    {Array.from({ length: Math.min(HOME_CABINET_PREVIEW.columns, 5) }, (_, colIndex) => {
                      const tile = HOME_CABINET_PREVIEW.givens[`${rowIndex}:${colIndex}`];
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

          {/* Liberties card */}
          <View style={[styles.gameSection, !shouldShowGame('logic') && styles.gameSectionHidden]}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.libertiesKicker}>Spatial Logic</Text>
                <Text style={styles.gameTitle}>Liberties</Text>
              </View>
            </View>
            <Text style={styles.blurb}>
              Place dark pebbles to clear the pale pebbles while they keep stretching.
            </Text>
            {(playCounts['liberties'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['liberties']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.libertiesPreview}>
                <Text style={styles.libertiesPreviewMeta}>
                  Today's board · {HOME_LIBERTIES_GROUP_COUNT} pale groups
                </Text>
                {HOME_LIBERTIES_PREVIEW.map((row, rowIndex) => (
                  <View key={`liberties-row-${rowIndex}`} style={styles.libertiesPreviewRow}>
                    {row.map((cell, colIndex) => (
                      <View
                        key={`liberties-${rowIndex}-${colIndex}`}
                        style={styles.libertiesPreviewCell}
                      >
                        {cell === 'frozen' && <View style={styles.libertiesPreviewFrozen} />}
                        {(cell === 'black' || cell === 'white') && (
                          <View
                            style={[
                              styles.libertiesPreviewStone,
                              cell === 'black'
                                ? styles.libertiesPreviewBlackStone
                                : styles.libertiesPreviewWhiteStone,
                            ]}
                          />
                        )}
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
                onPress={() => router.push('/liberties')}
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
                  {HOME_BRIDGES_PREVIEW_VALUES.map((value, index) => (
                    <View key={`bridge-preview-${index}`} style={styles.bridgesPreviewRowItem}>
                      <View style={styles.bridgesPreviewIsland}>
                        <Text style={styles.bridgesPreviewIslandText}>{value}</Text>
                      </View>
                      {index < HOME_BRIDGES_PREVIEW_VALUES.length - 1 && (
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
                    <Text style={styles.triviaFeedName}>{HOME_TRIVIA_MIX_SUMMARY.title}</Text>
                    <Text style={styles.triviaFeedMeta}>
                      {HOME_TRIVIA_MIX_SUMMARY.questionCount} questions · {HOME_TRIVIA_MIX_SUMMARY.timerSeconds}s timer
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
                    <Text style={styles.triviaFeedName}>{HOME_TRIVIA_SPORTS_SUMMARY.title}</Text>
                    <Text style={styles.triviaFeedMeta}>
                      {HOME_TRIVIA_SPORTS_SUMMARY.questionCount} questions · {HOME_TRIVIA_SPORTS_SUMMARY.timerSeconds}s timer
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
                    {HOME_BARTER_PREVIEW.goal.emoji}
                  </Text>
                  <Text style={styles.barterPreviewGoalText}>
                    {HOME_BARTER_PREVIEW.goal.qty} {HOME_BARTER_PREVIEW.goal.name}
                  </Text>
                </View>
                <View style={styles.barterPreviewMeta}>
                  <Text style={styles.barterPreviewMetaText}>Par {HOME_BARTER_PREVIEW.par} trades</Text>
                  <Text style={styles.barterPreviewMetaDivider}>•</Text>
                  <Text style={styles.barterPreviewMetaText}>
                    {HOME_BARTER_PREVIEW.goods} goods
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
                  Case #{String(HOME_WHODUNIT_PREVIEW.caseNumber).padStart(3, '0')} - {HOME_WHODUNIT_PREVIEW.caseName}
                </Text>
                <View style={styles.whodunitSuspects}>
                  {HOME_WHODUNIT_PREVIEW.suspects.map((s, i) => (
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
  const libertiesAccent = resolveScreenAccent('liberties', theme);
  const barterAccent = resolveScreenAccent('barter', theme);
  const crosswordAccent = resolveScreenAccent('mini-crossword', theme);
  const subsetAccent = resolveScreenAccent('wordie', theme);
  const kilterAccent = resolveScreenAccent('kilter', theme);
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
  libertiesKicker: {
    color: libertiesAccent.main,
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
  subsetKicker: {
    color: subsetAccent.main,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  kilterKicker: {
    color: kilterAccent.main,
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
  kilterPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  kilterAnchorPreview: {
    minWidth: 96,
    minHeight: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: kilterAccent.main,
    backgroundColor: kilterAccent.main,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  kilterAnchorText: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
  },
  kilterLooseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  kilterLooseTile: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kilterLooseText: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: Colors.text,
  },
  kilterPreviewMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  subsetPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 6,
  },
  subsetPreviewRow: {
    flexDirection: 'row',
    gap: 6,
  },
  subsetPreviewTile: {
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
  subsetPreviewTilePillar: {
    backgroundColor: subsetAccent.soft,
    borderColor: subsetAccent.main,
  },
  subsetPreviewText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.text,
  },
  subsetPreviewMeta: {
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
  libertiesPreview: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: 4,
  },
  libertiesPreviewMeta: {
    marginBottom: Spacing.xs,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  libertiesPreviewRow: {
    flexDirection: 'row',
  },
  libertiesPreviewCell: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(43, 58, 67, 0.14)',
    backgroundColor: theme.mode === 'dark' ? '#1a2631' : '#f4f7f8',
  },
  libertiesPreviewStone: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1,
  },
  libertiesPreviewBlackStone: {
    backgroundColor: theme.mode === 'dark' ? '#10161e' : '#15171c',
    borderColor: theme.mode === 'dark' ? '#303b48' : '#000000',
  },
  libertiesPreviewWhiteStone: {
    backgroundColor: theme.mode === 'dark' ? '#f4efe5' : '#fff8e8',
    borderColor: theme.mode === 'dark' ? '#6f6657' : '#b59a73',
  },
  libertiesPreviewFrozen: {
    width: 18,
    height: 18,
    borderRadius: 5,
    backgroundColor: theme.mode === 'dark' ? '#35404a' : '#c9d2d7',
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
