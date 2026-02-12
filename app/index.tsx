import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  type ThemeTokens,
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { BUILD_ID } from '../src/constants/build';
import { getDailyPuzzle } from '../src/data/mojiMashPuzzles';
import { getDailyWhodunit } from '../src/data/whodunitPuzzles';
import { getDailyWordie } from '../src/data/wordiePuzzles';
import { getDailyTriviaCategories } from '../src/data/triviaPuzzles';
import { getDailySudoku } from '../src/data/sudokuPuzzles';
import { getDailyBarter, getGoodById } from '../src/data/barterPuzzles';
import { getDailyBridges } from '../src/data/bridgesPuzzles';
import { getDailyMiniCrossword } from '../src/data/miniCrosswordPuzzles';
import { getGlobalPlayCounts } from '../src/globalPlayCount';

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

export default function HomeScreen() {
  const theme = useDaybreakTheme();
  const screenAccent = useMemo(() => resolveScreenAccent('home', theme), [theme]);
  const styles = useMemo(() => createStyles(theme, screenAccent), [theme, screenAccent]);
  const router = useRouter();
  const puzzle = getDailyPuzzle();
  const whodunit = getDailyWhodunit();
  const wordie = getDailyWordie();
  const triviaCategories = getDailyTriviaCategories();
  const sudoku = getDailySudoku();
  const barterPuzzle = getDailyBarter();
  const bridgesPuzzle = getDailyBridges();
  const miniCrossword = getDailyMiniCrossword();
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
  const [streak, setStreak] = useState(0);
  const [playCounts, setPlayCounts] = useState<Record<string, number>>({});
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
      { label: 'Moji Mash', route: '/moji-mash', emoji: '🧩', countKey: 'mojimash' },
      { label: 'Wordie', route: '/wordie', emoji: '🔤', countKey: 'wordie' },
      {
        label: 'Mini Crossword',
        route: '/mini-crossword',
        emoji: '✍️',
        countKey: 'crossword',
        isNew: true,
      },
      { label: 'Mini Sudoku', route: '/sudoku', emoji: '🧠', countKey: 'sudoku' },
      { label: 'Bridges', route: '/bridges', emoji: '🏝️', countKey: 'bridges', isNew: true },
      { label: 'Whodunit', route: '/whodunit', emoji: '🔍', countKey: 'whodunit' },
      { label: 'Trivia', route: '/trivia', emoji: '⚡', countKey: 'trivia' },
      { label: 'Barter', route: '/barter', emoji: '↔️', countKey: 'barter', isNew: true },
    ];

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

    const hasAnyDaily = (date: Date) => {
      const key = keyForDate(date);
      return (
        storage.getItem(`mojimash:daily:${key}`) === '1' ||
        storage.getItem(`wordie:daily:${key}`) === '1' ||
        storage.getItem(`crossword:daily:${key}`) === '1' ||
        storage.getItem(`sudoku:daily:${key}`) === '1' ||
        storage.getItem(`bridges:daily:${key}`) === '1' ||
        storage.getItem(`whodunit:daily:${key}`) === '1' ||
        storage.getItem(`trivia:daily:${key}`) === '1' ||
        storage.getItem(`barter:daily:${key}`) === '1'
      );
    };

    let count = 0;
    const cursor = new Date();
    while (hasAnyDaily(cursor)) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    setStreak(count);
  }, []);

  useEffect(() => {
    getGlobalPlayCounts([
      'mojimash',
      'wordie',
      'crossword',
      'sudoku',
      'bridges',
      'whodunit',
      'trivia',
      'barter',
    ])
      .then((counts) => {
        if (Object.keys(counts).length > 0) {
          setPlayCounts(counts);
        }
      });
  }, []);

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

          <View style={styles.quickLinksSection}>
            <View style={styles.quickLinksHeader}>
              <Text style={styles.quickLinksTitle}>Quick links</Text>
              <Text style={styles.quickLinksSubtitle}>Jump back into a game.</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickLinksRow}
            >
              {quickLinks.map((item) => (
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
                  {item.isNew && (
                    <View style={styles.quickLinkNewBadge}>
                      <Text style={styles.quickLinkNewText}>Beta</Text>
                    </View>
                  )}
                  {(playCounts[item.countKey] ?? 0) > 0 && (
                    <Text style={styles.quickLinkCount}>{playCounts[item.countKey]} plays</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Moji Mash card */}
          <View style={styles.gameSection}>
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
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Word Guess</Text>
              <Text style={styles.gameTitle}>Wordie</Text>
            </View>
            <Text style={styles.blurb}>
              Solve the five-letter word in six guesses.
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
                    {Array.from({ length: 5 }).map((_, col) => (
                      <View key={col} style={styles.wordieTile}>
                        {row === 0 && col === 0 ? (
                          <Text style={styles.wordieTileText}>{wordie[0]}</Text>
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

          {/* Mini Crossword card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.crosswordKicker}>Word Grid</Text>
                <Text style={styles.gameTitle}>Mini Crossword</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>Beta</Text>
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
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Logic Grid</Text>
              <Text style={styles.gameTitle}>Mini Sudoku</Text>
            </View>
            <Text style={styles.blurb}>
              A 6x6 daily Sudoku with a medium-hard bite.
            </Text>
            {(playCounts['sudoku'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['sudoku']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.sudokuPreview}>
                {sudoku.grid.map((row, rowIndex) => (
                  <View key={`sudoku-row-${rowIndex}`} style={styles.sudokuRow}>
                    {row.map((value, colIndex) => (
                      <View
                        key={`sudoku-${rowIndex}-${colIndex}`}
                        style={[
                          styles.sudokuCell,
                          value !== 0 && styles.sudokuCellFilled,
                        ]}
                      >
                        <Text style={styles.sudokuCellText}>
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

          {/* Bridges card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.bridgesKicker}>Logic Puzzle</Text>
                <Text style={styles.gameTitle}>Bridges</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>Beta</Text>
              </View>
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

          {/* Trivia card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabel}>
              <Text style={styles.kicker}>Quickfire</Text>
              <Text style={styles.gameTitle}>Daily Trivia</Text>
            </View>
            <Text style={styles.blurb}>
              Eight rapid questions - pick one of today's categories and race the clock.
            </Text>
            {(playCounts['trivia'] ?? 0) > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>{playCounts['trivia']} plays today</Text>
              </View>
            )}
            <View style={styles.dailyCard}>
              <View style={styles.triviaPreview}>
                <Text style={styles.triviaPreviewTitle}>Today's choices</Text>
                <View style={styles.triviaCategoryRow}>
                  {triviaCategories.map((cat) => (
                    <View key={cat.id} style={styles.triviaCategoryChip}>
                      <Text style={styles.triviaCategoryText}>{cat.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.playButton,
                  pressed && styles.playButtonPressed,
                ]}
                onPress={() => router.push('/trivia')}
              >
                <Text style={styles.playButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>

          {/* Barter card */}
          <View style={styles.gameSection}>
            <View style={styles.gameLabelRow}>
              <View style={styles.gameLabel}>
                <Text style={styles.barterKicker}>Resource Exchange</Text>
                <Text style={styles.gameTitle}>Barter</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>Beta</Text>
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
          <View style={styles.gameSection}>
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
  quickLinkNewBadge: {
    marginTop: Spacing.xs,
    backgroundColor: barterAccent.badgeBg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: barterAccent.badgeBorder,
  },
  quickLinkNewText: {
    fontSize: 11,
    fontWeight: '700',
    color: barterAccent.badgeText,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  gameSection: {
    marginBottom: Spacing.xl,
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
  newBadge: {
    marginTop: Spacing.xs,
    backgroundColor: barterAccent.badgeBg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: barterAccent.badgeBorder,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: barterAccent.badgeText,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
  wordieTileText: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
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
    gap: 4,
  },
  sudokuCell: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sudokuCellFilled: {
    backgroundColor: Colors.surface,
  },
  sudokuCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
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
  triviaCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  triviaCategoryChip: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  triviaCategoryText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
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
