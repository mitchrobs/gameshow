import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import {
  MAX_GUESSES,
  WIN_THRESHOLD,
  formatDisplayDate,
  getCycleDay,
  getDailySet,
  getTodayKey,
  shiftDateKey,
} from '../src/ballpark/daybreak-v1-data.mjs';
import { BUILD_ID } from '../src/constants/build';
import {
  resolveScreenAccent,
  useDaybreakTheme,
} from '../src/constants/theme';
import { createDaybreakPrimitives } from '../src/ui/daybreakPrimitives';
import { incrementGlobalPlayCount } from '../src/globalPlayCount';

const STORAGE_VERSION = 5;
const KEYPAD_LAYOUT = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['clear', '0', 'back'],
];
const ADJUSTMENTS = [
  { label: '÷10', factor: 0.1 },
  { label: '÷2', factor: 0.5 },
  { label: '×2', factor: 2 },
  { label: '×10', factor: 10 },
];

function getStorage() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}

function getProgressStorageKey(dateKey) {
  return `gameshow-ballpark-v2-progress:${dateKey}`;
}

function loadSavedProgress(dateKey) {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const rawValue = storage.getItem(getProgressStorageKey(dateKey));
    if (!rawValue) return null;
    const parsedValue = JSON.parse(rawValue);
    return parsedValue?.version === STORAGE_VERSION ? parsedValue : null;
  } catch {
    return null;
  }
}

function saveProgress(dateKey, progress) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(getProgressStorageKey(dateKey), JSON.stringify(progress));
  } catch {
    // Ignore storage failures.
  }
}

function clearSavedProgress(dateKey) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(getProgressStorageKey(dateKey));
  } catch {
    // Ignore storage failures.
  }
}

function formatLongDate(dateKey) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00`));
}

function formatCompactNumber(value) {
  const rounded = Math.round(value);
  if (rounded >= 1e12) return `${(rounded / 1e12).toFixed(1).replace(/\.0$/, '')}T`;
  if (rounded >= 1e9) return `${(rounded / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (rounded >= 1e6) return `${(rounded / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (rounded >= 1e3) return `${(rounded / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return String(rounded);
}

function formatFullNumber(value) {
  return Math.round(value).toLocaleString();
}

function sanitizeGuessInput(value) {
  return value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
}

function appendDigit(value, digit) {
  const next = `${value}${digit}`;
  return sanitizeGuessInput(next).slice(0, 12);
}

function parseGuessInput(value) {
  const digits = sanitizeGuessInput(value);
  if (!digits) return null;

  const parsed = Number(digits);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

function orderOfMagnitude(value) {
  if (value <= 0) return 0;
  return Math.floor(Math.log10(value));
}

function evaluateGuess(guess, answer) {
  const pctOff = Math.abs(guess - answer) / answer;
  const sameOOM = orderOfMagnitude(guess) === orderOfMagnitude(answer);

  let tier = 'cold';
  if (pctOff <= WIN_THRESHOLD) tier = 'bullseye';
  else if (pctOff <= 0.5) tier = 'close';
  else if (sameOOM) tier = 'warm';

  return {
    tier,
    pctOff,
    sameOOM,
    direction: guess > answer ? 'down' : guess < answer ? 'up' : null,
  };
}

function deriveRoundPhase(savedQuestionState) {
  if (!savedQuestionState) return 'active';

  const history = Array.isArray(savedQuestionState.history) ? savedQuestionState.history : [];
  const isDone = Boolean(savedQuestionState.isWon) || history.length >= MAX_GUESSES;
  if (!isDone) return 'active';

  return savedQuestionState.roundPhase === 'resolved'
    ? 'ready_to_continue'
    : savedQuestionState.roundPhase ?? 'ready_to_continue';
}

function getFeedbackMessage(evaluation) {
  if (!evaluation) return null;

  if (evaluation.tier === 'bullseye') {
    return {
      title: 'Bullseye',
      body: `You landed within ${Math.round(evaluation.pctOff * 100)}% of the answer.`,
    };
  }

  if (evaluation.tier === 'close') {
    return {
      title: evaluation.direction === 'up' ? 'Go higher' : 'Come down',
      body: 'You are close now. One more calibrated move could do it.',
    };
  }

  if (evaluation.tier === 'warm') {
    return {
      title: evaluation.direction === 'up' ? 'Same scale, higher' : 'Same scale, lower',
      body: 'You found the right ballpark. Tighten the number next.',
    };
  }

  return {
    title: evaluation.direction === 'up' ? 'Much higher' : 'Much lower',
    body: 'Reset the scale first, then work back in.',
  };
}

function getBestGuess(history) {
  return [...history].sort((left, right) => left.evaluation.pctOff - right.evaluation.pctOff)[0];
}

function getShareGlyph(result) {
  if (!result) return '⬜️';
  if (result.won) return '🟩';
  if (result.bestPctOff <= 0.5) return '🟨';
  return '⬛️';
}

function KeyButton({
  label,
  onPress,
  disabled = false,
  styles,
  isWide = false,
  kind = 'default',
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.keyButton,
        isWide && styles.keyButtonWide,
        kind === 'muted' && styles.keyButtonMuted,
        pressed && !disabled && styles.keyButtonPressed,
        disabled && styles.keyButtonDisabled,
      ]}
    >
      <Text
        style={[
          styles.keyButtonText,
          kind === 'muted' && styles.keyButtonTextMuted,
          disabled && styles.keyButtonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function AppButton({
  label,
  onPress,
  styles,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        fullWidth && styles.buttonFullWidth,
        disabled &&
          (variant === 'primary' ? styles.buttonPrimaryDisabled : styles.buttonSecondaryDisabled),
        pressed && !disabled && (variant === 'primary'
          ? styles.buttonPrimaryPressed
          : styles.buttonSecondaryPressed),
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' ? styles.buttonPrimaryText : styles.buttonSecondaryText,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ArchiveNavigator({
  cycleDay,
  dateKey,
  onNextDay,
  onPrevDay,
  styles,
  subtitle = 'Archive',
}) {
  return (
    <View style={styles.archiveRow}>
      <Pressable onPress={onPrevDay} style={({ pressed }) => [styles.archiveArrow, pressed && styles.archiveArrowPressed]}>
        <Text style={styles.archiveArrowText}>←</Text>
      </Pressable>
      <View style={styles.archiveCenter}>
        <Text style={styles.archiveEyebrow}>{subtitle}</Text>
        <Text style={styles.archiveDate}>{formatLongDate(dateKey)}</Text>
        <Text style={styles.archiveMeta}>
          Day {String(cycleDay).padStart(2, '0')} • {formatDisplayDate(dateKey)}
        </Text>
      </View>
      <Pressable onPress={onNextDay} style={({ pressed }) => [styles.archiveArrow, pressed && styles.archiveArrowPressed]}>
        <Text style={styles.archiveArrowText}>→</Text>
      </Pressable>
    </View>
  );
}

function GuessHistoryRow({ entry, index, styles }) {
  const statusMap = {
    bullseye: {
      label: 'Within 10%',
      row: styles.historyRowBullseye,
      pill: styles.historyPillBullseye,
    },
    close: {
      label: 'Within 50%',
      row: styles.historyRowClose,
      pill: styles.historyPillClose,
    },
    warm: {
      label: 'Right scale',
      row: styles.historyRowWarm,
      pill: styles.historyPillWarm,
    },
    cold: {
      label: 'Reset scale',
      row: styles.historyRowCold,
      pill: styles.historyPillCold,
    },
  };
  const status = statusMap[entry.evaluation.tier];

  return (
    <View style={[styles.historyRow, status.row]}>
      <View style={styles.historyIndex}>
        <Text style={styles.historyIndexText}>{index + 1}</Text>
      </View>
      <Text style={styles.historyGuess}>{formatCompactNumber(entry.guess)}</Text>
      {entry.evaluation.direction && entry.evaluation.tier !== 'bullseye' ? (
        <Text style={styles.historyArrow}>
          {entry.evaluation.direction === 'up' ? '↑' : '↓'}
        </Text>
      ) : (
        <View style={styles.historyArrowSpacer} />
      )}
      <View style={[styles.historyPill, status.pill]}>
        <Text style={styles.historyPillText}>{status.label}</Text>
      </View>
    </View>
  );
}

function StartScreen({
  cycleDay,
  dailySet,
  dateKey,
  isTodayView,
  onBrowseArchive,
  onGoToToday,
  onHideArchive,
  onNextDay,
  onPrevDay,
  onStart,
  showArchiveNavigator,
  styles,
}) {
  return (
    <View>
      <View style={styles.heroCard}>
        {showArchiveNavigator ? (
          <ArchiveNavigator
            cycleDay={cycleDay}
            dateKey={dateKey}
            onNextDay={onNextDay}
            onPrevDay={onPrevDay}
            styles={styles}
          />
        ) : (
          <View style={styles.heroMetaCard}>
            <Text style={styles.heroEyebrow}>Today&apos;s challenge</Text>
            <Text style={styles.heroDate}>{formatLongDate(dateKey)}</Text>
            <Text style={styles.heroMeta}>
              Day {String(cycleDay).padStart(2, '0')} of 30
            </Text>
          </View>
        )}

        <View style={styles.themeCard}>
          <Text style={styles.themeEyebrow}>Today&apos;s theme</Text>
          <Text style={styles.themeTitle}>{dailySet.theme}</Text>
          <Text style={styles.themeBody}>
            Three questions, one shared thread, and four guesses each.
          </Text>
        </View>
      </View>

      <Text style={styles.compactRule}>
        Use the keypad, tap the quick chips, and get within {Math.round(WIN_THRESHOLD * 100)}%
        {' '}in four guesses.
      </Text>

      <AppButton label="Play Ballpark" onPress={onStart} styles={styles} fullWidth />

      {showArchiveNavigator ? (
        <View style={styles.footerButtonRow}>
          <AppButton
            label={isTodayView ? 'Hide Archive' : 'Back to Today'}
            onPress={isTodayView ? onHideArchive : onGoToToday}
            styles={styles}
            variant="secondary"
            fullWidth
          />
        </View>
      ) : (
        <View style={styles.footerButtonRow}>
          <AppButton
            label="Browse Archive"
            onPress={onBrowseArchive}
            styles={styles}
            variant="secondary"
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

function QuestionScreen({
  dailySet,
  onComplete,
  onStateChange,
  questionIndex,
  savedQuestionState,
  styles,
}) {
  const question = dailySet.questions[questionIndex];
  const restoredState =
    savedQuestionState && savedQuestionState.questionId === question.id ? savedQuestionState : null;
  const [guessInput, setGuessInput] = useState(restoredState?.guessInput ?? '');
  const [history, setHistory] = useState(restoredState?.history ?? []);
  const [latestFeedback, setLatestFeedback] = useState(restoredState?.latestFeedback ?? null);
  const [isWon, setIsWon] = useState(restoredState?.isWon ?? false);
  const [roundPhase, setRoundPhase] = useState(deriveRoundPhase(restoredState));
  const [lastGuess, setLastGuess] = useState(restoredState?.lastGuess ?? null);
  const revealTimeoutRef = useRef(null);

  const currentGuess = parseGuessInput(guessInput);
  const guessesLeft = MAX_GUESSES - history.length;
  const isDone = isWon || history.length >= MAX_GUESSES;
  const adjustmentBase = currentGuess ?? lastGuess;
  const feedbackMessage = getFeedbackMessage(latestFeedback);

  useEffect(() => {
    if (roundPhase !== 'resolved') return undefined;

    revealTimeoutRef.current = setTimeout(() => {
      setRoundPhase('ready_to_continue');
    }, isWon ? 900 : 750);

    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }
    };
  }, [isWon, roundPhase]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onStateChange({
      questionId: question.id,
      guessInput,
      history,
      latestFeedback,
      isWon,
      roundPhase,
      lastGuess,
    });
  }, [guessInput, history, latestFeedback, isWon, roundPhase, lastGuess, onStateChange, question.id]);

  const handleAdjust = (factor) => {
    if (isDone || adjustmentBase === null) return;
    setGuessInput(String(Math.max(1, Math.round(adjustmentBase * factor))));
  };

  const handleNumberTap = (value) => {
    if (isDone) return;
    setGuessInput((currentValue) => appendDigit(currentValue, value));
  };

  const handleBackspace = () => {
    if (isDone) return;
    setGuessInput((currentValue) => currentValue.slice(0, -1));
  };

  const handleClear = () => {
    if (isDone) return;
    setGuessInput('');
  };

  const handleSubmit = () => {
    if (isDone || currentGuess === null) return;

    const evaluation = evaluateGuess(currentGuess, question.answer);
    const nextHistory = [...history, { guess: currentGuess, evaluation }];
    setHistory(nextHistory);
    setLatestFeedback(evaluation);
    setLastGuess(currentGuess);
    setGuessInput('');

    if (evaluation.tier === 'bullseye') {
      setIsWon(true);
      setRoundPhase('resolved');
      return;
    }

    if (nextHistory.length >= MAX_GUESSES) {
      setRoundPhase('resolved');
    }
  };

  const handleContinue = () => {
    const bestGuess = getBestGuess(history);
    onComplete({
      answer: question.answer,
      bestGuess: bestGuess.guess,
      bestPctOff: bestGuess.evaluation.pctOff,
      difficulty: question.difficulty,
      guesses: history.length,
      history,
      prompt: question.prompt,
      questionId: question.id,
      won: isWon,
    });
  };

  return (
    <View>
      <View style={styles.metaRow}>
        <View style={styles.metaCopy}>
          <Text style={styles.sectionEyebrow}>
            Question {questionIndex + 1} / {dailySet.questions.length}
          </Text>
          <Text style={styles.metaSubcopy}>{formatLongDate(dailySet.date)}</Text>
          <View style={styles.progressRow}>
            {dailySet.questions.map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.progressSegment,
                  index === questionIndex && styles.progressSegmentActive,
                  index < questionIndex && styles.progressSegmentComplete,
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.guessCounter}>
          <Text style={styles.guessCounterValue}>{guessesLeft}</Text>
          <Text style={styles.guessCounterLabel}>left</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.themeChip}>
          <Text style={styles.themeChipText}>{dailySet.theme}</Text>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionPrompt}>{question.prompt}</Text>
        {question.asOfDate ? (
          <Text style={styles.questionBlurb}>Measured as of {formatLongDate(question.asOfDate)}.</Text>
        ) : null}
      </View>

      <View style={styles.guessDisplayCard}>
        <Text style={styles.sectionEyebrow}>Current guess</Text>
        <Text style={guessInput ? styles.guessDisplayValue : styles.guessDisplayPlaceholder}>
          {guessInput ? formatFullNumber(Number(guessInput)) : 'Enter a guess'}
        </Text>
        <Text style={styles.guessDisplayHint}>
          {currentGuess !== null
            ? `${formatCompactNumber(currentGuess)} ready to submit`
            : lastGuess !== null
              ? `Last guess: ${formatFullNumber(lastGuess)}`
              : 'Use the keypad or quick chips to jump scales.'}
        </Text>
      </View>

      {feedbackMessage && (
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{feedbackMessage.title}</Text>
          <Text style={styles.feedbackBody}>{feedbackMessage.body}</Text>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.historyCard}>
          <Text style={styles.sectionEyebrow}>Recent guesses</Text>
          {history
            .slice()
            .reverse()
            .map((entry, reverseIndex) => {
              const originalIndex = history.length - reverseIndex - 1;
              return (
                <GuessHistoryRow
                  key={`${entry.guess}-${originalIndex}`}
                  entry={entry}
                  index={originalIndex}
                  styles={styles}
                />
              );
            })}
        </View>
      )}

      {isDone && roundPhase === 'ready_to_continue' ? (
        <View>
          <View style={styles.answerCard}>
            <Text style={styles.answerTitle}>{isWon ? 'Locked in' : 'Round complete'}</Text>
            <Text style={styles.answerCopy}>
              Answer: <Text style={styles.answerStrong}>{formatFullNumber(question.answer)}</Text>
            </Text>
            <Text style={styles.answerFact}>{question.funFact}</Text>
          </View>
          <AppButton
            label={
              questionIndex >= dailySet.questions.length - 1 ? 'See Results' : 'Next Question'
            }
            onPress={handleContinue}
            styles={styles}
            fullWidth
          />
        </View>
      ) : (
        <View style={styles.controlsWrap}>
          <View style={styles.adjustmentsRow}>
            {ADJUSTMENTS.map((button) => (
              <Pressable
                key={button.label}
                disabled={adjustmentBase === null || isDone}
                onPress={() => handleAdjust(button.factor)}
                style={({ pressed }) => [
                  styles.adjustmentButton,
                  pressed && adjustmentBase !== null && !isDone && styles.adjustmentButtonPressed,
                  (adjustmentBase === null || isDone) && styles.adjustmentButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.adjustmentButtonText,
                    (adjustmentBase === null || isDone) && styles.adjustmentButtonTextDisabled,
                  ]}
                >
                  {button.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.keypadCard}>
            {KEYPAD_LAYOUT.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.keypadRow}>
                {row.map((keyValue) => {
                  if (keyValue === 'clear') {
                    return (
                      <KeyButton
                        key={keyValue}
                        label="Clear"
                        onPress={handleClear}
                        disabled={guessInput.length === 0 || isDone}
                        styles={styles}
                        kind="muted"
                      />
                    );
                  }

                  if (keyValue === 'back') {
                    return (
                      <KeyButton
                        key={keyValue}
                        label="⌫"
                        onPress={handleBackspace}
                        disabled={guessInput.length === 0 || isDone}
                        styles={styles}
                        kind="muted"
                      />
                    );
                  }

                  return (
                    <KeyButton
                      key={keyValue}
                      label={keyValue}
                      onPress={() => handleNumberTap(keyValue)}
                      disabled={isDone}
                      styles={styles}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <AppButton
            label="Submit Guess"
            onPress={handleSubmit}
            styles={styles}
            disabled={currentGuess === null || isDone}
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

function SummaryScreen({
  cycleDay,
  dailySet,
  dateKey,
  isTodayView,
  onBrowseArchive,
  onGoToToday,
  onHideArchive,
  onNextDay,
  onPrevDay,
  onReplayDay,
  results,
  showArchiveNavigator,
  styles,
}) {
  const wins = results.filter((result) => result.won).length;
  const totalGuesses = results.reduce((sum, result) => sum + result.guesses, 0);
  const misses = results.filter((result) => !result.won);
  const closestMiss = misses.length > 0 ? Math.min(...misses.map((result) => result.bestPctOff)) : null;
  const shareText = useMemo(() => {
    const resultRow = results.map((result) => getShareGlyph(result)).join('');

    return [
      `Ballpark ${formatLongDate(dateKey)}`,
      dailySet.theme,
      `${totalGuesses} | ${resultRow}`,
    ].join('\n');
  }, [dailySet.theme, dateKey, results, totalGuesses]);
  const [copyStatus, setCopyStatus] = useState(null);

  useEffect(() => {
    setCopyStatus(null);
  }, [shareText]);

  const handleCopyResults = useCallback(async () => {
    if (Platform.OS !== 'web') return;

    const clipboard = globalThis.navigator?.clipboard;
    if (!clipboard?.writeText) {
      setCopyStatus('Copy not supported');
      return;
    }

    try {
      await clipboard.writeText(shareText);
      setCopyStatus('Copied to clipboard');
    } catch {
      setCopyStatus('Copy failed');
    }
  }, [shareText]);

  return (
    <View>
      <View style={styles.heroCard}>
        {showArchiveNavigator ? (
          <ArchiveNavigator
            cycleDay={cycleDay}
            dateKey={dateKey}
            onNextDay={onNextDay}
            onPrevDay={onPrevDay}
            styles={styles}
            subtitle="Review"
          />
        ) : (
          <View style={styles.summaryIntro}>
            <Text style={styles.sectionEyebrow}>Today&apos;s result</Text>
            <Text style={styles.metaSubcopy}>{formatLongDate(dateKey)}</Text>
          </View>
        )}

        <View style={styles.summaryHero}>
          <Text style={styles.summaryScore}>
            {wins} / {dailySet.questions.length}
          </Text>
          <Text style={styles.summaryTheme}>{dailySet.theme}</Text>
        </View>

        <View style={styles.summaryStatsRow}>
          <View style={styles.summaryStatCard}>
            <Text style={styles.summaryStatValue}>{wins}</Text>
            <Text style={styles.summaryStatLabel}>Wins</Text>
          </View>
          <View style={styles.summaryStatCard}>
            <Text style={styles.summaryStatValue}>
              {closestMiss === null ? 'Clean' : `${Math.round(closestMiss * 100)}%`}
            </Text>
            <Text style={styles.summaryStatLabel}>Closest miss</Text>
          </View>
          <View style={styles.summaryStatCard}>
            <Text style={styles.summaryStatValue}>{totalGuesses}</Text>
            <Text style={styles.summaryStatLabel}>Total guesses</Text>
          </View>
        </View>
        <View style={styles.shareCodeCard}>
          <Text style={styles.shareCodeTitle}>Share your result</Text>
          <View style={styles.shareCodeBox}>
            <Text selectable style={styles.shareCodeValue}>
              {shareText}
            </Text>
          </View>
          {Platform.OS === 'web' && (
            <Pressable
              onPress={handleCopyResults}
              style={({ pressed }) => [
                styles.shareCodeButton,
                pressed && styles.shareCodeButtonPressed,
              ]}
            >
              <Text style={styles.shareCodeButtonText}>Copy results</Text>
            </Pressable>
          )}
          {copyStatus ? <Text style={styles.shareCodeStatus}>{copyStatus}</Text> : null}
        </View>
      </View>

      <View style={styles.summaryListCard}>
        <Text style={styles.sectionEyebrow}>Question breakdown</Text>
        {dailySet.questions.map((question, index) => {
          const result = results[index];
          return (
            <View
              key={question.id}
              style={[styles.summaryRow, index > 0 && styles.summaryRowBorder]}
            >
              <View style={[styles.summaryBadge, result?.won && styles.summaryBadgeWon]}>
                <Text style={[styles.summaryBadgeText, result?.won && styles.summaryBadgeTextWon]}>
                  {result?.won ? '✓' : index + 1}
                </Text>
              </View>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryPrompt}>{question.prompt}</Text>
                <Text style={styles.summaryMeta}>
                  Best guess {result ? formatCompactNumber(result.bestGuess) : '—'} • Answer{' '}
                  {formatCompactNumber(question.answer)}
                </Text>
              </View>
              <Text style={styles.summaryGuesses}>
                {result ? `${result.guesses}/${MAX_GUESSES}` : `0/${MAX_GUESSES}`}
              </Text>
            </View>
          );
        })}
      </View>

      <AppButton label="Play Again" onPress={onReplayDay} styles={styles} fullWidth />
      <View style={styles.footerButtonRow}>
        {showArchiveNavigator ? (
          <AppButton
            label={isTodayView ? 'Hide Archive' : 'Back to Today'}
            onPress={isTodayView ? onHideArchive : onGoToToday}
            styles={styles}
            variant="secondary"
            fullWidth
          />
        ) : (
          <AppButton
            label="Browse Archive"
            onPress={onBrowseArchive}
            styles={styles}
            variant="secondary"
            fullWidth
          />
        )}
      </View>
    </View>
  );
}

function createStyles(theme, screenAccent, viewportWidth) {
  const Colors = theme.colors;
  const Spacing = theme.spacing;
  const FontSize = theme.fontSize;
  const BorderRadius = theme.borderRadius;
  const ui = createDaybreakPrimitives(theme, screenAccent);
  const controlRailMaxWidth =
    viewportWidth >= 1100 ? 360 : viewportWidth >= 768 ? 400 : undefined;
  const keySurface = theme.mode === 'dark'
    ? 'rgba(26, 34, 46, 0.48)'
    : 'rgba(235, 240, 246, 0.74)';
  const keySurfaceMuted = theme.mode === 'dark'
    ? 'rgba(20, 27, 38, 0.56)'
    : 'rgba(226, 233, 242, 0.68)';
  const keyBorder = theme.mode === 'dark'
    ? 'rgba(110, 136, 167, 0.18)'
    : 'rgba(100, 122, 148, 0.12)';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.backgroundSoft,
    },
    scrollContent: {
      padding: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    page: {
      ...ui.page,
    },
    pageAccent: {
      ...ui.accentBar,
      marginBottom: Spacing.sm,
    },
    header: {
      marginBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
    },
    heroCard: {
      ...ui.card,
      padding: Spacing.md,
      gap: Spacing.sm,
      marginBottom: Spacing.sm,
    },
    heroMetaCard: {
      ...ui.subtleCard,
      padding: Spacing.md,
      gap: 2,
    },
    heroEyebrow: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      color: Colors.textMuted,
    },
    heroDate: {
      fontSize: FontSize.md,
      fontWeight: '700',
      color: Colors.text,
      marginTop: 4,
    },
    heroMeta: {
      fontSize: 12,
      color: Colors.textMuted,
      marginTop: 2,
    },
    themeCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      padding: Spacing.md,
      gap: 6,
    },
    themeEyebrow: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      color: screenAccent.badgeText,
    },
    themeTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors.text,
      lineHeight: 28,
    },
    themeBody: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 18,
    },
    sectionEyebrow: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      color: Colors.textMuted,
    },
    compactRule: {
      fontSize: FontSize.sm,
      lineHeight: 18,
      color: Colors.textMuted,
      marginBottom: Spacing.sm,
    },
    buttonBase: {
      borderRadius: BorderRadius.full,
      minHeight: 42,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
    },
    buttonFullWidth: {
      width: '100%',
    },
    buttonPrimary: {
      backgroundColor: Colors.primary,
      borderColor: Colors.line,
    },
    buttonPrimaryPressed: {
      backgroundColor: Colors.primaryLight,
      transform: [{ scale: 0.99 }],
    },
    buttonSecondary: {
      backgroundColor: Colors.surface,
      borderColor: Colors.border,
    },
    buttonSecondaryPressed: {
      backgroundColor: Colors.surfaceLight,
      transform: [{ scale: 0.99 }],
    },
    buttonDisabled: {
      opacity: 0.42,
    },
    buttonPrimaryDisabled: {
      backgroundColor: 'transparent',
      borderColor: Colors.border,
      opacity: 1,
    },
    buttonSecondaryDisabled: {
      opacity: 0.52,
    },
    buttonText: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    buttonPrimaryText: {
      color: Colors.white,
    },
    buttonSecondaryText: {
      color: Colors.text,
    },
    buttonTextDisabled: {
      color: Colors.textMuted,
    },
    footerButtonRow: {
      marginTop: Spacing.sm,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
      gap: Spacing.sm,
    },
    metaCopy: {
      flex: 1,
      minWidth: 0,
    },
    metaSubcopy: {
      fontSize: 12,
      color: Colors.textMuted,
      marginTop: 2,
    },
    guessCounter: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      paddingTop: 1,
    },
    guessCounterLabel: {
      fontSize: 10,
      color: Colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    guessCounterValue: {
      fontSize: 14,
      fontWeight: '800',
      color: Colors.textSecondary,
      fontVariant: ['tabular-nums'],
    },
    progressRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 8,
      maxWidth: 140,
    },
    progressSegment: {
      flex: 1,
      height: 4,
      borderRadius: BorderRadius.full,
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(121, 137, 160, 0.2)' : 'rgba(82, 98, 122, 0.14)',
    },
    progressSegmentActive: {
      backgroundColor: screenAccent.primary,
    },
    progressSegmentComplete: {
      backgroundColor:
        theme.mode === 'dark' ? 'rgba(42, 191, 166, 0.42)' : 'rgba(18, 163, 138, 0.28)',
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: Spacing.sm,
    },
    themeChip: {
      borderRadius: BorderRadius.full,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      paddingHorizontal: 8,
      paddingVertical: 3,
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    themeChipText: {
      color: screenAccent.badgeText,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0,
    },
    questionCard: {
      ...ui.card,
      padding: Spacing.md,
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    questionPrompt: {
      fontSize: 24,
      lineHeight: 30,
      color: Colors.text,
      fontWeight: '800',
    },
    questionBlurb: {
      fontSize: 15,
      lineHeight: 19,
      color: Colors.textMuted,
    },
    guessDisplayCard: {
      ...ui.card,
      padding: Spacing.md,
      gap: Spacing.xs,
      marginBottom: Spacing.sm,
    },
    guessDisplayValue: {
      fontSize: 30,
      lineHeight: 34,
      color: Colors.text,
      fontWeight: '800',
      fontVariant: ['tabular-nums'],
    },
    guessDisplayPlaceholder: {
      fontSize: 22,
      lineHeight: 28,
      color: Colors.textMuted,
      fontWeight: '700',
    },
    guessDisplayHint: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.textMuted,
    },
    feedbackCard: {
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: screenAccent.badgeBorder,
      backgroundColor: screenAccent.badgeBg,
      padding: Spacing.sm,
      marginBottom: Spacing.sm,
      gap: 4,
    },
    feedbackTitle: {
      fontSize: FontSize.md,
      fontWeight: '700',
      color: Colors.text,
    },
    feedbackBody: {
      fontSize: FontSize.sm,
      lineHeight: 20,
      color: Colors.textSecondary,
    },
    historyCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
    },
    historyRowBullseye: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.18)' : 'rgba(24, 169, 87, 0.12)',
      borderColor: Colors.success,
    },
    historyRowClose: {
      backgroundColor: screenAccent.badgeBg,
      borderColor: screenAccent.badgeBorder,
    },
    historyRowWarm: {
      backgroundColor: Colors.surfaceLight,
      borderColor: Colors.border,
    },
    historyRowCold: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(11,11,11,0.03)',
      borderColor: Colors.border,
    },
    historyIndex: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
    },
    historyIndexText: {
      fontSize: 11,
      fontWeight: '700',
      color: Colors.text,
    },
    historyGuess: {
      flex: 1,
      fontSize: FontSize.md,
      fontWeight: '700',
      color: Colors.text,
      fontVariant: ['tabular-nums'],
    },
    historyArrow: {
      width: 18,
      textAlign: 'center',
      fontSize: 16,
      color: Colors.textMuted,
      fontWeight: '700',
    },
    historyArrowSpacer: {
      width: 18,
    },
    historyPill: {
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 5,
      borderWidth: 1,
    },
    historyPillBullseye: {
      backgroundColor: theme.mode === 'dark' ? 'rgba(79, 180, 119, 0.22)' : 'rgba(24, 169, 87, 0.16)',
      borderColor: Colors.success,
    },
    historyPillClose: {
      backgroundColor: screenAccent.badgeBg,
      borderColor: screenAccent.badgeBorder,
    },
    historyPillWarm: {
      backgroundColor: Colors.surface,
      borderColor: Colors.border,
    },
    historyPillCold: {
      backgroundColor: Colors.surface,
      borderColor: Colors.border,
    },
    historyPillText: {
      fontSize: 11,
      fontWeight: '700',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.7,
    },
    answerCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    answerTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: Colors.text,
    },
    answerCopy: {
      fontSize: FontSize.sm,
      color: Colors.textSecondary,
      lineHeight: 20,
    },
    answerStrong: {
      fontWeight: '800',
      color: Colors.text,
    },
    answerFact: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      lineHeight: 20,
    },
    controlsWrap: {
      width: '100%',
      maxWidth: controlRailMaxWidth,
      alignSelf: 'flex-start',
    },
    adjustmentsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
      marginBottom: Spacing.xs,
    },
    adjustmentButton: {
      flexGrow: 1,
      minWidth: 0,
      borderRadius: BorderRadius.full,
      paddingVertical: 6,
      paddingHorizontal: Spacing.sm,
      backgroundColor: Colors.surface,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    adjustmentButtonPressed: {
      backgroundColor: Colors.surfaceLight,
    },
    adjustmentButtonDisabled: {
      opacity: 0.45,
    },
    adjustmentButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.text,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    adjustmentButtonTextDisabled: {
      color: Colors.textMuted,
    },
    keypadCard: {
      gap: 5,
      marginBottom: Spacing.sm,
    },
    keypadRow: {
      flexDirection: 'row',
      gap: 5,
    },
    keyButton: {
      flex: 1,
      minHeight: 36,
      borderRadius: 12,
      backgroundColor: keySurface,
      borderWidth: 1,
      borderColor: keyBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyButtonWide: {
      flex: 2,
    },
    keyButtonMuted: {
      backgroundColor: keySurfaceMuted,
    },
    keyButtonPressed: {
      backgroundColor: theme.mode === 'dark'
        ? 'rgba(41, 57, 78, 0.86)'
        : 'rgba(214, 225, 238, 0.96)',
      transform: [{ scale: 0.98 }],
    },
    keyButtonDisabled: {
      opacity: 0.4,
    },
    keyButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.text,
    },
    keyButtonTextMuted: {
      fontSize: 11,
    },
    keyButtonTextDisabled: {
      color: Colors.textMuted,
    },
    archiveRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.sm,
    },
    archiveArrow: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    archiveArrowPressed: {
      backgroundColor: Colors.surfaceElevated,
    },
    archiveArrowText: {
      fontSize: 18,
      color: Colors.text,
      fontWeight: '700',
    },
    archiveCenter: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    archiveEyebrow: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontWeight: '700',
      color: Colors.textMuted,
    },
    archiveDate: {
      fontSize: FontSize.md,
      fontWeight: '700',
      color: Colors.text,
    },
    archiveMeta: {
      fontSize: 12,
      color: Colors.textMuted,
    },
    summaryIntro: {
      gap: 4,
    },
    summaryHero: {
      alignItems: 'center',
      gap: 6,
    },
    summaryScore: {
      fontSize: 48,
      fontWeight: '800',
      color: Colors.text,
      lineHeight: 52,
    },
    summaryTheme: {
      fontSize: FontSize.md,
      color: Colors.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    summaryStatsRow: {
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    summaryStatCard: {
      flex: 1,
      ...ui.subtleCard,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.xs,
      alignItems: 'center',
      gap: 2,
    },
    summaryStatValue: {
      fontSize: FontSize.lg,
      fontWeight: '800',
      color: Colors.text,
    },
    summaryStatLabel: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      fontWeight: '700',
      color: Colors.textMuted,
      textAlign: 'center',
    },
    summaryListCard: {
      ...ui.card,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      gap: Spacing.xs,
    },
    shareCodeCard: {
      marginTop: Spacing.sm,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    shareCodeTitle: {
      fontSize: FontSize.sm,
      fontWeight: '700',
      color: Colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    shareCodeBox: {
      backgroundColor: Colors.surfaceLight,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
    },
    shareCodeValue: {
      fontSize: FontSize.sm,
      color: Colors.text,
      lineHeight: 18,
    },
    shareCodeButton: {
      ...ui.cta,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
    },
    shareCodeButtonPressed: {
      ...ui.ctaPressed,
    },
    shareCodeButtonText: {
      ...ui.ctaText,
    },
    shareCodeStatus: {
      fontSize: FontSize.sm,
      color: Colors.textMuted,
      textAlign: 'center',
    },
    summaryRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingVertical: 10,
      alignItems: 'flex-start',
    },
    summaryRowBorder: {
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    summaryBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.surfaceLight,
      borderWidth: 1,
      borderColor: Colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    summaryBadgeWon: {
      backgroundColor: Colors.success,
      borderColor: Colors.success,
    },
    summaryBadgeText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.text,
    },
    summaryBadgeTextWon: {
      color: Colors.white,
    },
    summaryCopy: {
      flex: 1,
      gap: 3,
    },
    summaryPrompt: {
      fontSize: 13,
      color: Colors.text,
      lineHeight: 17,
      fontWeight: '600',
    },
    summaryMeta: {
      fontSize: 12,
      color: Colors.textMuted,
      lineHeight: 15,
    },
    summaryGuesses: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.textSecondary,
      marginTop: 2,
    },
    buildText: {
      fontSize: 12,
      color: Colors.textMuted,
      textAlign: 'center',
      marginTop: Spacing.md,
    },
    loadingCard: {
      ...ui.card,
      padding: Spacing.xl,
      gap: Spacing.sm,
      alignItems: 'center',
    },
    loadingTitle: {
      fontSize: FontSize.xl,
      color: Colors.text,
      fontWeight: '800',
    },
    loadingBody: {
      fontSize: FontSize.sm,
      lineHeight: 20,
      color: Colors.textMuted,
      textAlign: 'center',
    },
  });
}

export default function BallparkRoute() {
  const theme = useDaybreakTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const screenAccent = useMemo(() => resolveScreenAccent('trivia', theme), [theme]);
  const styles = useMemo(
    () => createStyles(theme, screenAccent, viewportWidth),
    [theme, screenAccent, viewportWidth]
  );
  const todayKey = getTodayKey();
  const [phase, setPhase] = useState('start');
  const [dateKey, setDateKey] = useState(todayKey);
  const [loadedDateKey, setLoadedDateKey] = useState(null);
  const [dailySet, setDailySet] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [currentQuestionState, setCurrentQuestionState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [archiveMode, setArchiveMode] = useState(false);
  const countedSummaryDateRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);

    getDailySet(dateKey).then((resolvedSet) => {
      if (!isActive) return;

      const savedProgress = loadSavedProgress(dateKey);
      const canRestoreSavedProgress =
        savedProgress?.version === STORAGE_VERSION &&
        savedProgress?.dateKey === dateKey &&
        savedProgress?.contentFingerprint === resolvedSet.contentFingerprint &&
        (savedProgress.phase === 'question' ||
          savedProgress.phase === 'transition' ||
          savedProgress.phase === 'summary');

      setDailySet(resolvedSet);
      setLoadedDateKey(dateKey);

      if (savedProgress && !canRestoreSavedProgress) {
        clearSavedProgress(dateKey);
      }

      if (canRestoreSavedProgress) {
        const restoredIndex = Math.min(
          Math.max(savedProgress.qIndex ?? 0, 0),
          resolvedSet.questions.length - 1
        );
        setPhase(savedProgress.phase === 'transition' ? 'question' : savedProgress.phase);
        setQIndex(restoredIndex);
        setResults(Array.isArray(savedProgress.results) ? savedProgress.results : []);
        setCurrentQuestionState(savedProgress.currentQuestionState ?? null);
      } else {
        setPhase('start');
        setQIndex(0);
        setResults([]);
        setCurrentQuestionState(null);
      }

      setLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [dateKey]);

  useEffect(() => {
    if (loading || !dailySet || !loadedDateKey) return;

    const hasSavedProgress =
      phase !== 'start' ||
      results.length > 0 ||
      (currentQuestionState &&
        (currentQuestionState.history?.length > 0 ||
          currentQuestionState.guessInput ||
          currentQuestionState.lastGuess ||
          currentQuestionState.roundPhase === 'resolved' ||
          currentQuestionState.roundPhase === 'ready_to_continue'));

    if (!hasSavedProgress) {
      clearSavedProgress(loadedDateKey);
      return;
    }

    saveProgress(loadedDateKey, {
      version: STORAGE_VERSION,
      dateKey: loadedDateKey,
      contentFingerprint: dailySet.contentFingerprint,
      phase,
      qIndex,
      results,
      currentQuestionState,
    });
  }, [currentQuestionState, dailySet, loadedDateKey, loading, phase, qIndex, results]);

  useEffect(() => {
    if (phase !== 'summary' || !dailySet) return;
    if (countedSummaryDateRef.current === dailySet.date) return;

    countedSummaryDateRef.current = dailySet.date;
    incrementGlobalPlayCount('ballpark');

    const storage = getStorage();
    if (!storage || dailySet.date !== todayKey) return;

    try {
      storage.setItem(`ballpark:daily:${dailySet.date}`, '1');
    } catch {
      // Ignore storage failures.
    }
  }, [dailySet, phase, todayKey]);

  const handleShiftDay = (offset) => {
    if (loading) return;
    setArchiveMode(true);
    setDateKey((currentDateKey) => shiftDateKey(currentDateKey, offset));
  };

  const handleBrowseArchive = () => {
    setArchiveMode(true);
  };

  const handleHideArchive = () => {
    if (dateKey !== todayKey) {
      setDateKey(todayKey);
    }
    setArchiveMode(false);
  };

  const handleGoToToday = () => {
    setDateKey(todayKey);
    setArchiveMode(false);
  };

  const handleStart = () => {
    if (!dailySet) return;
    setPhase('question');
    setQIndex(0);
    setResults([]);
    setCurrentQuestionState(null);
  };

  const handleQuestionComplete = (result) => {
    if (!dailySet) return;

    const nextResults = [...results, result];
    setResults(nextResults);
    setCurrentQuestionState(null);

    if (qIndex >= dailySet.questions.length - 1) {
      setPhase('summary');
      return;
    }

    setQIndex((current) => current + 1);
  };

  const handleReplayDay = () => {
    setPhase('question');
    setQIndex(0);
    setResults([]);
    setCurrentQuestionState(null);
  };

  const cycleDay = getCycleDay(dateKey);
  const isTodayView = dateKey === todayKey;
  const showArchiveNavigator = archiveMode || !isTodayView;

  return (
    <>
      <Stack.Screen options={{ title: 'Ballpark', headerBackTitle: 'Home' }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.page}>
            <View style={styles.pageAccent} />
            <View style={styles.header}>
              <Text style={styles.subtitle}>
                Estimation trivia inside the Gameshow shell.
              </Text>
            </View>

            {loading || !dailySet ? (
              <View style={styles.loadingCard}>
                <Text style={styles.loadingTitle}>Setting the table</Text>
                <Text style={styles.loadingBody}>
                  Pulling today&apos;s Ballpark set into the lineup.
                </Text>
              </View>
            ) : null}

            {!loading && dailySet && phase === 'start' ? (
              <StartScreen
                cycleDay={cycleDay}
                dailySet={dailySet}
                dateKey={dateKey}
                isTodayView={isTodayView}
                onBrowseArchive={handleBrowseArchive}
                onGoToToday={handleGoToToday}
                onHideArchive={handleHideArchive}
                onNextDay={() => handleShiftDay(1)}
                onPrevDay={() => handleShiftDay(-1)}
                onStart={handleStart}
                showArchiveNavigator={showArchiveNavigator}
                styles={styles}
              />
            ) : null}

            {!loading && dailySet && phase === 'question' ? (
              <QuestionScreen
                key={dailySet.questions[qIndex].id}
                dailySet={dailySet}
                onComplete={handleQuestionComplete}
                onStateChange={setCurrentQuestionState}
                questionIndex={qIndex}
                savedQuestionState={currentQuestionState}
                styles={styles}
              />
            ) : null}

            {!loading && dailySet && phase === 'summary' ? (
              <SummaryScreen
                cycleDay={cycleDay}
                dailySet={dailySet}
                dateKey={dateKey}
                isTodayView={isTodayView}
                onBrowseArchive={handleBrowseArchive}
                onGoToToday={handleGoToToday}
                onHideArchive={handleHideArchive}
                onNextDay={() => handleShiftDay(1)}
                onPrevDay={() => handleShiftDay(-1)}
                onReplayDay={handleReplayDay}
                results={results}
                showArchiveNavigator={showArchiveNavigator}
                styles={styles}
              />
            ) : null}

            {!loading && (
              <Text style={styles.buildText}>Build: {BUILD_ID}</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
