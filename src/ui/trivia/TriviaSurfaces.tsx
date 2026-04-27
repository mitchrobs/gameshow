import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ScreenAccentTokens, ThemeTokens } from '../../constants/theme';
import type {
  TriviaAnswerMark,
  TriviaEpisode,
  TriviaFeed,
  TriviaFeedSummary,
  TriviaRunAnswer,
  TriviaRunResult,
} from '../../data/trivia';
import { createDaybreakPrimitives } from '../daybreakPrimitives';

const FEEDS: TriviaFeed[] = ['mix', 'sports'];
const ANSWER_LETTERS = ['A', 'B', 'C'];

function getChoiceLetter(index: number): string {
  return ANSWER_LETTERS[index] ?? String.fromCharCode(65 + index);
}

function getFeedSubtitle(feed: TriviaFeed): string {
  return feed === 'mix'
    ? 'Culture, history, science, and broad general knowledge.'
    : 'Leagues, legends, records, and the details that matter.';
}

function getRunLabel(result: TriviaRunResult): string {
  if (result.cleanRun) return 'Clean run';
  return result.shieldUsed ? 'Shield used' : 'Shield unused';
}

function getAnswerMarkGlyph(mark: TriviaAnswerMark): string {
  if (mark === 'correct') return '✓';
  if (mark === 'shielded') return '◌';
  if (mark === 'wrong') return '×';
  return '·';
}

function getAnswerMarkLabel(mark: TriviaAnswerMark): string {
  if (mark === 'correct') return 'Correct';
  if (mark === 'shielded') return 'Shielded';
  if (mark === 'wrong') return 'Wrong';
  return 'Time';
}

export function createTriviaStyles(theme: ThemeTokens, screenAccent: ScreenAccentTokens) {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const FontSize = theme.fontSize;
  const BorderRadius = theme.borderRadius;
  const ui = createDaybreakPrimitives(theme, screenAccent);
  const infoColor = theme.mode === 'dark' ? '#70b8ff' : '#2563eb';
  const activeToggleBackground = theme.mode === 'dark' ? Colors.white : Colors.text;
  const activeToggleBorder = theme.mode === 'dark' ? Colors.white : Colors.text;
  const activeToggleText = theme.mode === 'dark' ? Colors.background : Colors.white;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    page: {
      ...ui.page,
      position: 'relative',
      gap: Spacing.md,
    },
    headerShell: {
      gap: Spacing.xs,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    headerDot: {
      width: 10,
      height: 10,
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
      shadowColor: screenAccent.main,
      shadowOpacity: theme.mode === 'dark' ? 0.42 : 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    headerTitle: {
      fontSize: FontSize.xl,
      fontWeight: '700',
      color: Colors.text,
      letterSpacing: -0.4,
    },
    headerMeta: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    headerDate: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      letterSpacing: 0.2,
    },
    surfaceCard: {
      ...ui.card,
      overflow: 'hidden',
      padding: 0,
    },
    surfaceAccent: {
      height: 4,
      backgroundColor: screenAccent.main,
      width: '100%',
    },
    introCardBody: {
      padding: Spacing.xl,
      gap: Spacing.lg,
    },
    introMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.md,
      flexWrap: 'wrap',
    },
    introEyebrow: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
    },
    introDatePill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      paddingHorizontal: Spacing.md,
      paddingVertical: 7,
    },
    introDateText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '600',
    },
    feedToggleRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    feedToggle: {
      flex: 1,
      minHeight: 44,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    feedToggleActive: {
      backgroundColor: activeToggleBackground,
      borderColor: activeToggleBorder,
    },
    feedTogglePressed: {
      opacity: 0.92,
    },
    feedToggleText: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textSecondary,
    },
    feedToggleTextActive: {
      color: activeToggleText,
    },
    introTitleBlock: {
      gap: Spacing.sm,
    },
    introTitle: {
      fontSize: 42,
      lineHeight: 44,
      color: Colors.text,
      fontWeight: '800',
      letterSpacing: -1.4,
    },
    introSubtitle: {
      maxWidth: 420,
      fontSize: FontSize.md,
      color: Colors.textSecondary,
      lineHeight: 24,
    },
    introStatsRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    introStatPill: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      paddingHorizontal: Spacing.md,
      paddingVertical: 9,
    },
    introStatText: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textSecondary,
    },
    introRules: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 22,
    },
    introCta: {
      borderRadius: BorderRadius.full,
      backgroundColor: screenAccent.main,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
      paddingHorizontal: Spacing.lg,
      ...theme.shadows.elevated,
    },
    introCtaPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.995 }],
    },
    introCtaText: {
      fontSize: FontSize.md,
      color: Colors.white,
      fontWeight: '800',
      letterSpacing: -0.2,
    },
    questionCard: {
      ...ui.card,
      overflow: 'hidden',
      padding: 0,
    },
    questionCardPaused: {
      opacity: 0.98,
    },
    questionCardBody: {
      padding: Spacing.xl,
      gap: Spacing.lg,
    },
    questionTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    questionMetaBlock: {
      flex: 1,
      gap: 6,
    },
    questionKicker: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
      fontWeight: '700',
    },
    questionCounter: {
      fontSize: FontSize.md,
      color: Colors.text,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    inlineFinalStretch: {
      fontSize: 12,
      color: screenAccent.main,
      textTransform: 'uppercase',
      letterSpacing: 1.4,
      fontWeight: '800',
    },
    timerPill: {
      minWidth: 76,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      paddingHorizontal: Spacing.md,
      paddingVertical: 9,
      alignItems: 'center',
    },
    timerText: {
      fontSize: FontSize.md,
      color: Colors.text,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      letterSpacing: 0.2,
    },
    progressBlock: {
      gap: Spacing.sm,
    },
    progressMeta: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      letterSpacing: 0.2,
    },
    progressRail: {
      flexDirection: 'row',
      gap: 6,
    },
    progressSegment: {
      flex: 1,
      height: 7,
      borderRadius: BorderRadius.full,
      backgroundColor: Colors.border,
    },
    progressSegmentCurrent: {
      backgroundColor: screenAccent.main,
    },
    progressSegmentDone: {
      backgroundColor: Colors.surfaceLight,
    },
    progressSegmentCorrect: {
      backgroundColor: Colors.success,
    },
    progressSegmentShielded: {
      backgroundColor: infoColor,
    },
    progressSegmentMissed: {
      backgroundColor: Colors.error,
    },
    questionText: {
      fontSize: 36,
      lineHeight: 42,
      color: Colors.text,
      fontWeight: '800',
      letterSpacing: -1.2,
    },
    optionsList: {
      gap: Spacing.sm,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      minHeight: 72,
    },
    optionPressed: {
      opacity: 0.94,
    },
    optionSelected: {
      borderColor: screenAccent.main,
    },
    optionCorrect: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.22)' : 'rgba(24, 169, 87, 0.12)',
      borderColor: Colors.success,
    },
    optionWrong: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(255, 107, 107, 0.22)' : 'rgba(224, 68, 68, 0.12)',
      borderColor: Colors.error,
    },
    optionShielded: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(112, 184, 255, 0.2)' : 'rgba(37, 99, 235, 0.12)',
      borderColor: infoColor,
    },
    optionLetter: {
      width: 34,
      height: 34,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    optionLetterActive: {
      backgroundColor: screenAccent.main,
      borderColor: screenAccent.main,
    },
    optionLetterCorrect: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
    },
    optionLetterWrong: {
      backgroundColor: Colors.error,
      borderColor: Colors.error,
    },
    optionLetterShielded: {
      backgroundColor: infoColor,
      borderColor: infoColor,
    },
    optionLetterText: {
      fontSize: FontSize.sm,
      fontWeight: '800',
      color: Colors.textSecondary,
    },
    optionLetterTextActive: {
      color: Colors.white,
    },
    optionText: {
      flex: 1,
      fontSize: 22,
      lineHeight: 28,
      color: Colors.text,
      fontWeight: '700',
      letterSpacing: -0.3,
    },
    shieldRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.md,
      paddingTop: Spacing.xs,
      flexWrap: 'wrap',
    },
    shieldMeta: {
      gap: 4,
      flex: 1,
    },
    shieldTitle: {
      fontSize: FontSize.sm,
      color: Colors.text,
      fontWeight: '700',
    },
    shieldBody: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 20,
    },
    shieldButton: {
      minHeight: 42,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shieldButtonActive: {
      backgroundColor: infoColor,
      borderColor: infoColor,
    },
    shieldButtonPressed: {
      opacity: 0.92,
    },
    shieldButtonDisabled: {
      opacity: 0.6,
    },
    shieldButtonText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '800',
      letterSpacing: 0.1,
    },
    shieldButtonTextActive: {
      color: Colors.white,
    },
    revealCard: {
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      padding: Spacing.md,
      gap: Spacing.xs,
    },
    revealTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.4,
    },
    revealBody: {
      fontSize: FontSize.md,
      lineHeight: 24,
      color: Colors.text,
    },
    revealMeta: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
    },
    overlayRoot: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
      backgroundColor: Colors.overlay,
    },
    overlayCard: {
      ...ui.card,
      overflow: 'hidden',
      padding: 0,
      alignSelf: 'center',
      width: '100%',
      maxWidth: 420,
    },
    overlayCardBody: {
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    overlayKicker: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
      fontWeight: '700',
    },
    overlayTitle: {
      fontSize: 44,
      lineHeight: 46,
      color: Colors.text,
      fontWeight: '800',
      letterSpacing: -1.8,
    },
    overlayBody: {
      maxWidth: 260,
      fontSize: FontSize.md,
      color: Colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    resultsCard: {
      ...ui.card,
      overflow: 'hidden',
      padding: 0,
    },
    resultsBody: {
      padding: Spacing.xl,
      gap: Spacing.lg,
    },
    resultsTop: {
      gap: Spacing.sm,
    },
    resultsEyebrow: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
      fontWeight: '700',
    },
    resultsTitle: {
      fontSize: 38,
      lineHeight: 42,
      color: Colors.text,
      fontWeight: '800',
      letterSpacing: -1.4,
    },
    resultsDate: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    marksBlock: {
      gap: Spacing.sm,
      alignItems: 'center',
    },
    marksRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    markChipWrap: {
      alignItems: 'center',
      gap: 6,
      minWidth: 26,
    },
    markChip: {
      width: 34,
      height: 34,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
    },
    markChipCorrect: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
    },
    markChipShielded: {
      backgroundColor: infoColor,
      borderColor: infoColor,
    },
    markChipWrong: {
      backgroundColor: theme.mode === 'dark' ? Colors.errorLight : '#fbe5e5',
      borderColor: Colors.error,
    },
    markChipTimeout: {
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.surfaceLight,
    },
    markChipText: {
      fontSize: FontSize.md,
      fontWeight: '800',
      color: Colors.text,
    },
    markChipTextLight: {
      color: Colors.white,
    },
    markChipLabel: {
      fontSize: 11,
      color: Colors.textMuted,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    resultStatsRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      flexWrap: 'wrap',
    },
    resultStatCard: {
      flex: 1,
      minWidth: 110,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surfaceLight,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      gap: 4,
    },
    resultStatLabel: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      fontWeight: '700',
    },
    resultStatValue: {
      fontSize: FontSize.lg,
      color: Colors.text,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    shareCard: {
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    shareTitle: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.6,
      fontWeight: '800',
    },
    shareBox: {
      borderRadius: BorderRadius.md,
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    shareText: {
      fontSize: FontSize.sm,
      color: Colors.text,
      lineHeight: 20,
    },
    shareButton: {
      minHeight: 44,
      borderRadius: BorderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.text,
      paddingHorizontal: Spacing.md,
    },
    shareButtonPressed: {
      opacity: 0.92,
    },
    shareButtonText: {
      fontSize: FontSize.sm,
      color: Colors.white,
      fontWeight: '800',
    },
    shareStatus: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: 'center',
    },
    resultActions: {
      gap: Spacing.sm,
    },
    secondaryButton: {
      minHeight: 46,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.md,
    },
    secondaryButtonPressed: {
      opacity: 0.92,
    },
    secondaryButtonText: {
      fontSize: FontSize.sm,
      color: Colors.text,
      fontWeight: '800',
    },
    reviewStack: {
      gap: Spacing.md,
      paddingTop: Spacing.xs,
    },
    reviewCard: {
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: theme.mode === 'dark' ? Colors.surfaceLight : Colors.background,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    reviewQuestionMeta: {
      fontSize: 12,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      fontWeight: '700',
    },
    reviewQuestion: {
      fontSize: FontSize.lg,
      lineHeight: 28,
      color: Colors.text,
      fontWeight: '800',
    },
    reviewAnswer: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
    },
    reviewRationale: {
      fontSize: FontSize.sm,
      color: Colors.text,
      lineHeight: 22,
    },
    citationList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    citationChip: {
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: Colors.line,
      backgroundColor: Colors.surface,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    citationChipPressed: {
      opacity: 0.92,
    },
    citationChipText: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      fontWeight: '700',
    },
    buildText: {
      fontSize: 12,
      color: Colors.textMuted,
      textAlign: 'center',
      paddingTop: Spacing.xs,
    },
  });
}

type TriviaStyles = ReturnType<typeof createTriviaStyles>;

interface TriviaPageHeaderProps {
  dateLabel: string;
  questionCount: number;
  styles: TriviaStyles;
}

export function TriviaPageHeader({
  dateLabel,
  questionCount,
  styles,
}: TriviaPageHeaderProps) {
  return (
    <View style={styles.headerShell}>
      <View style={styles.headerRow}>
        <View style={styles.headerDot} />
        <Text style={styles.headerTitle}>Trivia</Text>
        <Text style={styles.headerMeta}>
          {questionCount} questions · daily
        </Text>
      </View>
      <Text style={styles.headerDate}>{dateLabel}</Text>
    </View>
  );
}

interface TriviaIntroSurfaceProps {
  dateLabel: string;
  onSelectFeed: (feed: TriviaFeed) => void;
  onStart: () => void;
  previewEpisode: TriviaEpisode;
  previewSummary: TriviaFeedSummary;
  selectedFeed: TriviaFeed;
  styles: TriviaStyles;
}

export function TriviaIntroSurface({
  dateLabel,
  onSelectFeed,
  onStart,
  previewEpisode,
  previewSummary,
  selectedFeed,
  styles,
}: TriviaIntroSurfaceProps) {
  return (
    <View style={styles.surfaceCard}>
      <View style={styles.surfaceAccent} />
      <View style={styles.introCardBody}>
        <View style={styles.introMetaRow}>
          <Text style={styles.introEyebrow}>Today&apos;s game</Text>
          <View style={styles.introDatePill}>
            <Text style={styles.introDateText}>{dateLabel}</Text>
          </View>
        </View>

        <View style={styles.feedToggleRow}>
          {FEEDS.map((feed) => {
            const active = selectedFeed === feed;
            return (
              <Pressable
                key={feed}
                style={({ pressed }) => [
                  styles.feedToggle,
                  active && styles.feedToggleActive,
                  pressed && styles.feedTogglePressed,
                ]}
                onPress={() => onSelectFeed(feed)}
              >
                <Text style={[styles.feedToggleText, active && styles.feedToggleTextActive]}>
                  {feed === 'mix' ? 'Daily Mix' : 'Daily Sports'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.introTitleBlock}>
          <Text style={styles.introTitle}>{previewSummary.title}</Text>
          <Text style={styles.introSubtitle}>{getFeedSubtitle(selectedFeed)}</Text>
        </View>

        <View style={styles.introStatsRow}>
          <View style={styles.introStatPill}>
            <Text style={styles.introStatText}>{previewEpisode.questionCount} questions</Text>
          </View>
          <View style={styles.introStatPill}>
            <Text style={styles.introStatText}>{previewEpisode.timerSeconds}s timer</Text>
          </View>
          <View style={styles.introStatPill}>
            <Text style={styles.introStatText}>1 shield</Text>
          </View>
        </View>

        <Text style={styles.introRules}>Three choices. One shield. Finish the run.</Text>

        <Pressable
          style={({ pressed }) => [styles.introCta, pressed && styles.introCtaPressed]}
          onPress={onStart}
        >
          <Text style={styles.introCtaText}>
            {selectedFeed === 'mix' ? 'Play Daily Mix' : 'Play Daily Sports'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

interface TriviaQuestionSurfaceProps {
  activeEpisode: TriviaEpisode;
  answers: TriviaRunAnswer[];
  countdown: number;
  currentQuestion: TriviaEpisode['questions'][number];
  disabled: boolean;
  lastAnswer: TriviaRunAnswer | null;
  onAnswer: (optionIndex: number) => void;
  onToggleShield: () => void;
  questionAnimatedStyle: object;
  questionIndex: number;
  revealAnimatedStyle: object;
  revealVisible: boolean;
  screenMode: 'question' | 'reveal' | 'transition';
  selectedOption: number | null;
  shieldArmed: boolean;
  shieldAvailable: boolean;
  showFinalStretchTag: boolean;
  styles: TriviaStyles;
}

export function TriviaQuestionSurface({
  activeEpisode,
  answers,
  countdown,
  currentQuestion,
  disabled,
  lastAnswer,
  onAnswer,
  onToggleShield,
  questionAnimatedStyle,
  questionIndex,
  revealAnimatedStyle,
  revealVisible,
  screenMode,
  selectedOption,
  shieldArmed,
  shieldAvailable,
  showFinalStretchTag,
  styles,
}: TriviaQuestionSurfaceProps) {
  return (
    <Animated.View
      style={[
        styles.questionCard,
        screenMode === 'transition' && styles.questionCardPaused,
        questionAnimatedStyle,
      ]}
    >
      <View style={styles.surfaceAccent} />
      <View style={styles.questionCardBody}>
        <View style={styles.questionTopRow}>
          <View style={styles.questionMetaBlock}>
            <Text style={styles.questionKicker}>
              {activeEpisode.feed === 'mix' ? 'Daily Mix' : 'Daily Sports'}
            </Text>
            <Text style={styles.questionCounter}>
              Question {questionIndex + 1} of {activeEpisode.questionCount}
            </Text>
            {showFinalStretchTag ? <Text style={styles.inlineFinalStretch}>Final 3</Text> : null}
          </View>
          <View style={styles.timerPill}>
            <Text style={styles.timerText}>{countdown}s</Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <Text style={styles.progressMeta}>Three choices · one shield · steady pace</Text>
          <View style={styles.progressRail}>
            {activeEpisode.questions.map((question, index) => {
              const answer = answers[index];
              const isCurrent = index === questionIndex;
              const isDone = index < answers.length;
              return (
                <View
                  key={question.id}
                  style={[
                    styles.progressSegment,
                    isCurrent && styles.progressSegmentCurrent,
                    isDone && styles.progressSegmentDone,
                    answer?.shielded && styles.progressSegmentShielded,
                    answer?.correct && styles.progressSegmentCorrect,
                    answer && !answer.correct && !answer.shielded && styles.progressSegmentMissed,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <Text style={styles.questionText}>{currentQuestion.stem}</Text>

        <View style={styles.optionsList}>
          {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.answerIndex;
            const isSelected = selectedOption === index;
            const showReveal = revealVisible;
            const selectedWrong = !!(showReveal && isSelected && !isCorrect);
            const selectedShielded = !!(showReveal && lastAnswer?.shielded && isSelected);
            const showActiveLetter = showReveal && (isSelected || isCorrect);
            return (
              <Pressable
                key={`${currentQuestion.id}:${option}`}
                style={({ pressed }) => [
                  styles.optionButton,
                  pressed && !disabled && styles.optionPressed,
                  showReveal && isSelected && styles.optionSelected,
                  showReveal && isCorrect && styles.optionCorrect,
                  selectedWrong && styles.optionWrong,
                  selectedShielded && styles.optionShielded,
                ]}
                onPress={() => onAnswer(index)}
                disabled={disabled}
              >
                <View
                  style={[
                    styles.optionLetter,
                    showActiveLetter && styles.optionLetterActive,
                    showReveal && isCorrect && styles.optionLetterCorrect,
                    selectedWrong && styles.optionLetterWrong,
                    selectedShielded && styles.optionLetterShielded,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetterText,
                      showActiveLetter && styles.optionLetterTextActive,
                    ]}
                  >
                    {getChoiceLetter(index)}
                  </Text>
                </View>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {!revealVisible ? (
          <View style={styles.shieldRow}>
            <View style={styles.shieldMeta}>
              <Text style={styles.shieldTitle}>
                {shieldAvailable
                  ? shieldArmed
                    ? 'Shield is on this question'
                    : 'You still have your shield'
                  : 'Shield already used'}
              </Text>
              <Text style={styles.shieldBody}>
                {shieldAvailable
                  ? shieldArmed
                    ? 'One miss or timeout on this question will turn into a save.'
                    : 'Use it before you answer if you want one question to turn into a save.'
                  : 'You got your one save already. The rest is all you.'}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.shieldButton,
                shieldArmed && styles.shieldButtonActive,
                !shieldAvailable && styles.shieldButtonDisabled,
                pressed && styles.shieldButtonPressed,
              ]}
              onPress={onToggleShield}
              disabled={!shieldAvailable || disabled}
            >
              <Text
                style={[
                  styles.shieldButtonText,
                  shieldArmed && styles.shieldButtonTextActive,
                ]}
              >
                {shieldArmed ? 'Shield on' : 'Use shield here'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {revealVisible && lastAnswer ? (
          <Animated.View style={[styles.revealCard, revealAnimatedStyle]}>
            <Text style={styles.revealTitle}>
              {lastAnswer.correct
                ? 'Correct'
                : lastAnswer.shielded
                  ? 'Shield save'
                  : lastAnswer.timedOut
                    ? 'Time'
                    : 'Miss'}
            </Text>
            <Text style={styles.revealBody}>{currentQuestion.rationaleShort}</Text>
            {!lastAnswer.correct ? (
              <Text style={styles.revealMeta}>
                Correct answer: {currentQuestion.options[currentQuestion.answerIndex]}
              </Text>
            ) : null}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

interface TriviaFinalStretchOverlayProps {
  activeEpisode: TriviaEpisode;
  backdropAnimatedStyle: object;
  cardAnimatedStyle: object;
  styles: TriviaStyles;
}

export function TriviaFinalStretchOverlay({
  activeEpisode,
  backdropAnimatedStyle,
  cardAnimatedStyle,
  styles,
}: TriviaFinalStretchOverlayProps) {
  return (
    <Animated.View pointerEvents="auto" style={[styles.overlayRoot, backdropAnimatedStyle]}>
      <Animated.View style={[styles.overlayCard, cardAnimatedStyle]}>
        <View style={styles.surfaceAccent} />
        <View style={styles.overlayCardBody}>
          <Text style={styles.overlayKicker}>
            {activeEpisode.feed === 'mix' ? 'Daily Mix' : 'Daily Sports'}
          </Text>
          <Text style={styles.overlayTitle}>Final 3</Text>
          <Text style={styles.overlayBody}>Three left. Stay sharp.</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

interface TriviaResultsSurfaceProps {
  activeEpisode: TriviaEpisode;
  answers: TriviaRunAnswer[];
  buildId: string;
  dateLabel: string;
  onBack: () => void;
  onCopy: () => void;
  onOpenCitation: (url: string) => void;
  onToggleReview: () => void;
  runResult: TriviaRunResult;
  shareStatus: string | null;
  shareText: string;
  showReview: boolean;
  styles: TriviaStyles;
}

export function TriviaResultsSurface({
  activeEpisode,
  answers,
  buildId,
  dateLabel,
  onBack,
  onCopy,
  onOpenCitation,
  onToggleReview,
  runResult,
  shareStatus,
  shareText,
  showReview,
  styles,
}: TriviaResultsSurfaceProps) {
  return (
    <View style={styles.resultsCard}>
      <View style={styles.surfaceAccent} />
      <View style={styles.resultsBody}>
        <View style={styles.resultsTop}>
          <Text style={styles.resultsEyebrow}>Daybreak</Text>
          <Text style={styles.resultsTitle}>
            {activeEpisode.feed === 'mix' ? 'Daily Mix' : 'Daily Sports'}
          </Text>
          <Text style={styles.resultsDate}>{dateLabel}</Text>
        </View>

        <View style={styles.marksBlock}>
          <View style={styles.marksRow}>
            {runResult.answerMarks.map((mark, index) => {
              const isLightChip = mark === 'correct' || mark === 'shielded';
              return (
                <View key={`${activeEpisode.date}:${index}`} style={styles.markChipWrap}>
                  <View
                    style={[
                      styles.markChip,
                      mark === 'correct' && styles.markChipCorrect,
                      mark === 'shielded' && styles.markChipShielded,
                      mark === 'wrong' && styles.markChipWrong,
                      mark === 'timeout' && styles.markChipTimeout,
                    ]}
                  >
                    <Text style={[styles.markChipText, isLightChip && styles.markChipTextLight]}>
                      {getAnswerMarkGlyph(mark)}
                    </Text>
                  </View>
                  <Text style={styles.markChipLabel}>Q{index + 1}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.resultStatsRow}>
          <View style={styles.resultStatCard}>
            <Text style={styles.resultStatLabel}>Correct</Text>
            <Text style={styles.resultStatValue}>
              {runResult.correctCount}/{runResult.totalQuestions}
            </Text>
          </View>
          <View style={styles.resultStatCard}>
            <Text style={styles.resultStatLabel}>Score</Text>
            <Text style={styles.resultStatValue}>{runResult.score} pts</Text>
          </View>
          <View style={styles.resultStatCard}>
            <Text style={styles.resultStatLabel}>Run</Text>
            <Text style={styles.resultStatValue}>{getRunLabel(runResult)}</Text>
          </View>
        </View>

        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>Share result</Text>
          <View style={styles.shareBox}>
            <Text selectable style={styles.shareText}>
              {shareText}
            </Text>
          </View>
          {Platform.OS === 'web' ? (
            <Pressable
              style={({ pressed }) => [styles.shareButton, pressed && styles.shareButtonPressed]}
              onPress={onCopy}
            >
              <Text style={styles.shareButtonText}>Copy share text</Text>
            </Pressable>
          ) : null}
          {shareStatus ? <Text style={styles.shareStatus}>{shareStatus}</Text> : null}
        </View>

        <View style={styles.resultActions}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={onToggleReview}
          >
            <Text style={styles.secondaryButtonText}>
              {showReview ? 'Hide review' : 'Review answers'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={onBack}
          >
            <Text style={styles.secondaryButtonText}>Back to games</Text>
          </Pressable>
        </View>

        {showReview ? (
          <View style={styles.reviewStack}>
            {activeEpisode.questions.map((question, index) => {
              const answer = answers[index];
              const selectedLabel =
                answer?.selectedOption == null
                  ? 'Timeout'
                  : question.options[answer.selectedOption] ?? 'No answer';
              return (
                <View key={question.id} style={styles.reviewCard}>
                  <Text style={styles.reviewQuestionMeta}>
                    Question {index + 1} · {question.themeTags?.[0] ?? question.domain}
                  </Text>
                  <Text style={styles.reviewQuestion}>{question.stem}</Text>
                  <Text style={styles.reviewAnswer}>
                    {getAnswerMarkLabel(runResult.answerMarks[index])} · You answered: {selectedLabel}
                  </Text>
                  <Text style={styles.reviewAnswer}>
                    Correct answer: {question.options[question.answerIndex]}
                  </Text>
                  <Text style={styles.reviewRationale}>{question.rationaleLong}</Text>
                  <View style={styles.citationList}>
                    {question.citations.map((citation) => (
                      <Pressable
                        key={`${question.id}:${citation.url}`}
                        style={({ pressed }) => [
                          styles.citationChip,
                          pressed && styles.citationChipPressed,
                        ]}
                        onPress={() => onOpenCitation(citation.url)}
                      >
                        <Text style={styles.citationChipText}>{citation.title}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        <Text style={styles.buildText}>Build: {buildId}</Text>
      </View>
    </View>
  );
}
