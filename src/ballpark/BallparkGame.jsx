import { useEffect, useRef, useState } from "react";
import {
  DAYBREAK_CYCLE_LENGTH,
  DIFFICULTY_META,
  MAX_GUESSES,
  WIN_THRESHOLD,
  formatDisplayDate,
  getCycleDay,
  getDailySet,
  getThemePreview,
  getTodayKey,
  shiftDateKey,
} from "./daybreak-v1-data.mjs";
import { incrementGlobalPlayCount } from "../globalPlayCount";

const COLORS = {
  background: "#f6f1e7",
  backgroundTint: "#fffaf2",
  surface: "rgba(255,253,248,0.96)",
  surfaceStrong: "#efe7da",
  border: "rgba(112,102,84,0.18)",
  text: "#1f2a24",
  subtext: "#5f665f",
  muted: "#897f70",
  accent: "#2f8f64",
  accentBorder: "rgba(47,143,100,0.28)",
  accentSoft: "rgba(47,143,100,0.11)",
  success: "#258355",
  successSoft: "rgba(37,131,85,0.13)",
  warning: "#b3833c",
  warningSoft: "rgba(179,131,60,0.13)",
  danger: "#c56b4b",
  dangerSoft: "rgba(197,107,75,0.12)",
  shadow: "rgba(74, 58, 36, 0.12)",
};

const STORAGE_VERSION = 2;

function getProgressStorageKey(dateKey) {
  return `gameshow-ballpark-v1-progress:${dateKey}`;
}

function loadSavedProgress(dateKey) {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(getProgressStorageKey(dateKey));
    if (!rawValue) return null;

    const parsedValue = JSON.parse(rawValue);
    if (parsedValue?.version !== STORAGE_VERSION) return null;
    return parsedValue;
  } catch (error) {
    return null;
  }
}

function saveProgress(dateKey, progress) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(getProgressStorageKey(dateKey), JSON.stringify(progress));
  } catch (error) {
    // Ignore storage failures in the prototype shell.
  }
}

function clearSavedProgress(dateKey) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(getProgressStorageKey(dateKey));
  } catch (error) {
    // Ignore storage failures in the prototype shell.
  }
}

function formatCompactNumber(value) {
  const rounded = Math.round(value);
  if (rounded >= 1e12) return `${(rounded / 1e12).toFixed(1).replace(/\.0$/, "")}T`;
  if (rounded >= 1e9) return `${(rounded / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
  if (rounded >= 1e6) return `${(rounded / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
  if (rounded >= 1e3) return `${(rounded / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return String(rounded);
}

function formatFullNumber(value) {
  return Math.round(value).toLocaleString();
}

function formatLongDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateKey}T12:00:00`));
}

function sanitizeGuessInput(value) {
  return value.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");
}

function parseGuessInput(value) {
  const digits = sanitizeGuessInput(value);
  if (!digits) return null;

  const parsed = Number(digits);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

function deriveRestoredRoundPhase(savedQuestionState) {
  if (!savedQuestionState) return "active";

  const history = Array.isArray(savedQuestionState.history) ? savedQuestionState.history : [];
  const done = Boolean(savedQuestionState.isWon) || history.length >= MAX_GUESSES;
  if (!done) return "active";

  return "ready_to_continue";
}

function orderOfMagnitude(value) {
  if (value <= 0) return 0;
  return Math.floor(Math.log10(value));
}

function evaluateGuess(guess, answer) {
  const pctOff = Math.abs(guess - answer) / answer;
  const sameOOM = orderOfMagnitude(guess) === orderOfMagnitude(answer);

  let tier = "cold";
  if (pctOff <= WIN_THRESHOLD) tier = "bullseye";
  else if (pctOff <= 0.5) tier = "close";
  else if (sameOOM) tier = "warm";

  return {
    tier,
    pctOff,
    sameOOM,
    direction: guess > answer ? "down" : guess < answer ? "up" : null,
  };
}

function SurfaceButton({ children, onClick, disabled = false, className = "", style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`surface-button ${className}`.trim()}
      style={style}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} className="ghost-button" style={style}>
      {children}
    </button>
  );
}

function GuessRow({ guess, evaluation, index }) {
  const tierConfig = {
    bullseye: {
      bg: COLORS.successSoft,
      border: "rgba(47,143,100,0.42)",
      text: COLORS.text,
      label: "Within 10%",
    },
    close: {
      bg: COLORS.accentSoft,
      border: COLORS.accentBorder,
      text: COLORS.text,
      label: "Within 50%",
    },
    warm: {
      bg: COLORS.surfaceStrong,
      border: COLORS.border,
      text: COLORS.text,
      label: "Right scale",
    },
    cold: {
      bg: "rgba(143, 127, 103, 0.08)",
      border: COLORS.border,
      text: COLORS.subtext,
      label: "Reset scale",
    },
  };
  const tier = tierConfig[evaluation.tier];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: tier.bg,
        border: `1px solid ${tier.border}`,
        borderRadius: 10,
        marginBottom: 6,
        animation: "slideIn 0.28s ease-out",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(47,143,100,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: tier.text,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 15,
          fontWeight: 600,
          color: tier.text,
          minWidth: 68,
        }}
      >
        {formatCompactNumber(guess)}
      </div>
      {evaluation.direction && evaluation.tier !== "bullseye" && (
        <div style={{ fontSize: 17, color: tier.text, opacity: 0.76 }}>
          {evaluation.direction === "up" ? "↑" : "↓"}
        </div>
      )}
      <div style={{ flex: 1 }} />
      <div
        style={{
          fontSize: 11,
          color: tier.text,
          opacity: 0.82,
          fontWeight: 500,
        }}
      >
        {tier.label}
      </div>
    </div>
  );
}

function DayNavigator({
  dateKey,
  cycleDay,
  onPrevDay,
  onNextDay,
  compact = false,
  label = compact ? "ARCHIVE" : "ARCHIVE",
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: compact ? 0 : 18,
      }}
    >
      <GhostButton onClick={onPrevDay} style={{ width: 38 }}>
        ←
      </GhostButton>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 1,
            color: COLORS.muted,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: compact ? 13 : 15,
            color: COLORS.text,
            fontWeight: 600,
            marginBottom: 2,
          }}
        >
          {formatDisplayDate(dateKey)}
        </div>
        <div
          style={{
            fontSize: 11,
            color: COLORS.subtext,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Day {String(cycleDay).padStart(2, "0")} of {DAYBREAK_CYCLE_LENGTH}
        </div>
      </div>
      <GhostButton onClick={onNextDay} style={{ width: 38 }}>
        →
      </GhostButton>
    </div>
  );
}

function LoadingScreen({ dateKey }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "32px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: `2px solid ${COLORS.accentBorder}`,
          borderTopColor: COLORS.accent,
          animation: "spin 0.9s linear infinite",
          marginBottom: 16,
        }}
      />
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 28,
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        Setting the table
      </div>
      <div style={{ fontSize: 14, color: COLORS.subtext, lineHeight: 1.6, maxWidth: 280 }}>
        Opening {getThemePreview(dateKey).toLowerCase()} for this day.
      </div>
    </div>
  );
}

function StartScreen({
  dailySet,
  dateKey,
  cycleDay,
  isTodayView = true,
  showArchiveNavigator = false,
  onPrevDay,
  onNextDay,
  onStart,
  onBrowseArchive,
  onGoToToday,
  onHideArchive,
}) {
  const startLabel = isTodayView && !showArchiveNavigator ? "Play Ballpark" : "Play This Ballpark";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 22px 28px",
        textAlign: "center",
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 58,
          fontWeight: 600,
          color: COLORS.text,
          letterSpacing: -1.5,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        Ballpark
      </div>
      <div
        style={{
          fontSize: 15,
          color: COLORS.subtext,
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        Three estimation-trivia questions. One shared theme. Four guesses each. Ballpark is the
        slower, estimation-led side of the trivia lineup.
      </div>

      <div
        style={{
          width: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "16px 16px 18px",
          marginBottom: 14,
        }}
      >
        {showArchiveNavigator ? (
          <div style={{ marginBottom: 14 }}>
            <DayNavigator
              dateKey={dateKey}
              cycleDay={cycleDay}
              onPrevDay={onPrevDay}
              onNextDay={onNextDay}
              label="ARCHIVE"
            />
            <div
              style={{
                textAlign: "left",
                padding: "12px 12px 0",
                fontSize: 12,
                color: COLORS.subtext,
                lineHeight: 1.5,
              }}
            >
              Browse nearby authored days, then jump back to today whenever you are ready.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: COLORS.surfaceStrong,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "14px 14px 12px",
              textAlign: "left",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: 1,
                color: COLORS.muted,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              TODAY'S CHALLENGE
            </div>
            <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 600, marginBottom: 3 }}>
              {formatLongDate(dateKey)}
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.subtext,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Day {String(cycleDay).padStart(2, "0")} of {DAYBREAK_CYCLE_LENGTH}
            </div>
          </div>
        )}

        <div
          style={{
            background: COLORS.accentSoft,
            border: `1px solid ${COLORS.accentBorder}`,
            borderRadius: 12,
            padding: "14px 14px 12px",
            textAlign: "left",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: 1,
              color: COLORS.accent,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            TODAY'S THEME
          </div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 26,
              color: COLORS.text,
              lineHeight: 1.15,
              letterSpacing: -0.4,
              marginBottom: 4,
            }}
          >
            {dailySet.theme}
          </div>
          <div style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.55 }}>
            {formatLongDate(dateKey)}. A compact Ballpark set that ramps from a clean foothold into a bigger closing reveal.
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {dailySet.questions.map((question) => (
            <div
              key={question.id}
              style={{
                textAlign: "left",
                padding: "11px 12px",
                background: COLORS.surfaceStrong,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 1,
                  color: COLORS.muted,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {DIFFICULTY_META[question.difficulty].label}
              </div>
              <div style={{ fontSize: 12, color: COLORS.subtext, lineHeight: 1.45 }}>
                {DIFFICULTY_META[question.difficulty].blurb}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "18px 18px 16px",
          textAlign: "left",
          marginBottom: 24,
          lineHeight: 1.6,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 1,
            color: COLORS.muted,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          HOW IT WORKS
        </div>
        <div style={{ fontSize: 14, color: "#cfc7b6" }}>
          Each round gives you up to <strong style={{ color: COLORS.text }}>{MAX_GUESSES} guesses</strong>. Type a number directly, nudge it with the magnitude chips, then use higher/lower feedback to get within{" "}
          <strong style={{ color: COLORS.text }}>{Math.round(WIN_THRESHOLD * 100)}%</strong>.
        </div>
      </div>

      <SurfaceButton onClick={onStart} className="primary-button" style={{ width: "100%", maxWidth: 360 }}>
        {startLabel}
      </SurfaceButton>
      {showArchiveNavigator ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTodayView ? "1fr" : "1fr",
            gap: 10,
            width: "100%",
            maxWidth: 360,
            marginTop: 10,
          }}
        >
          {isTodayView ? (
            <GhostButton onClick={onHideArchive}>Hide Archive</GhostButton>
          ) : (
            <GhostButton onClick={onGoToToday}>Back to Today</GhostButton>
          )}
        </div>
      ) : (
        <GhostButton onClick={onBrowseArchive} style={{ width: "100%", maxWidth: 360, marginTop: 10 }}>
          Browse Archive
        </GhostButton>
      )}
    </div>
  );
}

function QuestionScreen({ dailySet, questionIndex, savedQuestionState, onStateChange, onComplete }) {
  const question = dailySet.questions[questionIndex];
  const inputRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const restoredState =
    savedQuestionState && savedQuestionState.questionId === question.id ? savedQuestionState : null;
  const [guessInput, setGuessInput] = useState(restoredState?.guessInput ?? "");
  const [history, setHistory] = useState(restoredState?.history ?? []);
  const [latestFeedback, setLatestFeedback] = useState(restoredState?.latestFeedback ?? null);
  const [isWon, setIsWon] = useState(restoredState?.isWon ?? false);
  const [roundPhase, setRoundPhase] = useState(deriveRestoredRoundPhase(restoredState));
  const [lastGuess, setLastGuess] = useState(restoredState?.lastGuess ?? null);

  const guessesLeft = MAX_GUESSES - history.length;
  const done = isWon || history.length >= MAX_GUESSES;
  const currentGuess = parseGuessInput(guessInput);
  const adjustmentBase = currentGuess ?? lastGuess;

  useEffect(() => {
    inputRef.current?.focus();
  }, [question.id]);

  useEffect(() => {
    if (roundPhase !== "resolved") return undefined;

    const delay = isWon ? 850 : 650;
    revealTimeoutRef.current = window.setTimeout(() => {
      setRoundPhase("ready_to_continue");
    }, delay);

    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
        revealTimeoutRef.current = null;
      }
    };
  }, [isWon, roundPhase]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
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

  const handleAdjust = (multiplier) => {
    setGuessInput((currentValue) => {
      const parsed = parseGuessInput(currentValue) ?? lastGuess;
      if (!parsed) return currentValue;
      return String(Math.max(1, Math.round(parsed * multiplier)));
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSubmit = () => {
    if (done || currentGuess === null) return;

    const evaluation = evaluateGuess(currentGuess, question.answer);
    const nextHistory = [...history, { guess: currentGuess, evaluation }];
    setHistory(nextHistory);
    setLatestFeedback(evaluation);
    setLastGuess(currentGuess);
    setGuessInput("");
    requestAnimationFrame(() => inputRef.current?.focus());

    if (evaluation.tier === "bullseye") {
      setIsWon(true);
      setRoundPhase("resolved");
    } else if (nextHistory.length >= MAX_GUESSES) {
      setRoundPhase("resolved");
    }
  };

  const handleContinue = () => {
    const bestGuess = [...history].sort((left, right) => left.evaluation.pctOff - right.evaluation.pctOff)[0];

    onComplete({
      questionId: question.id,
      prompt: question.prompt,
      difficulty: question.difficulty,
      answer: question.answer,
      won: isWon,
      guesses: history.length,
      bestGuess: bestGuess.guess,
      bestPctOff: bestGuess.evaluation.pctOff,
      history,
    });
  };

  const hitOOMFirst =
    history.length > 0 &&
    latestFeedback?.sameOOM &&
    latestFeedback?.tier !== "bullseye" &&
    history.filter((entry) => entry.evaluation.sameOOM).length === 1;

  return (
    <div
      style={{
        padding: "20px 20px 24px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: COLORS.muted,
              letterSpacing: 1,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            QUESTION {questionIndex + 1} / {dailySet.questions.length}
          </div>
          <div style={{ fontSize: 12, color: COLORS.subtext }}>{formatDisplayDate(dailySet.date)}</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {dailySet.questions.map((entry, index) => (
            <div
              key={entry.id}
              style={{
                width: 26,
                height: 4,
                borderRadius: 2,
                background:
                  index === questionIndex
                    ? COLORS.accent
                    : index < questionIndex
                      ? "rgba(47,143,100,0.34)"
                      : "rgba(114,103,86,0.18)",
                transition: "background 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <div className="chip accent-chip">{dailySet.theme}</div>
        <div className="chip neutral-chip">{DIFFICULTY_META[question.difficulty].label}</div>
      </div>

      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 25,
          fontWeight: 500,
          color: COLORS.text,
          lineHeight: 1.28,
          letterSpacing: -0.3,
          marginBottom: 10,
        }}
      >
        {question.prompt}
      </div>

      <div style={{ fontSize: 13, color: COLORS.subtext, lineHeight: 1.55, marginBottom: 20 }}>
        {DIFFICULTY_META[question.difficulty].blurb}
        {question.asOfDate ? (
          <span style={{ color: "#4a7a61" }}> Measured as of {formatLongDate(question.asOfDate)}.</span>
        ) : null}
      </div>

      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 16,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              letterSpacing: 0.8,
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Your guess
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={guessInput}
            placeholder="Type a number"
            onChange={(event) => setGuessInput(sanitizeGuessInput(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            className="guess-input"
          />
          <div style={{ marginTop: 6, fontSize: 12, color: COLORS.subtext, minHeight: 18 }}>
            {currentGuess !== null
              ? `${formatFullNumber(currentGuess)} ready to submit`
              : lastGuess !== null
                ? `Last guess: ${formatFullNumber(lastGuess)}. Type fresh or use the chips to iterate.`
                : "Use digits only, then nudge with the chips below."}
          </div>
          {currentGuess !== null && (
            <div style={{ marginTop: 8 }}>
              <GhostButton
                onClick={() => {
                  setGuessInput("");
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                style={{ padding: "6px 9px", fontSize: 11 }}
              >
                Clear
              </GhostButton>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              letterSpacing: 0.8,
              fontWeight: 500,
              marginBottom: 4,
            }}
          >
            Guesses left
          </div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 34,
              fontWeight: 600,
              color: guessesLeft <= 1 ? COLORS.danger : COLORS.text,
              lineHeight: 1,
            }}
          >
            {guessesLeft}
          </div>
        </div>
      </div>

      {hitOOMFirst && !isWon && (
        <div
          style={{
            background: COLORS.accentSoft,
            border: `1px solid ${COLORS.accentBorder}`,
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 14,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            color: "#3b7e5a",
            animation: "fadeIn 0.28s ease-out",
          }}
        >
          Right ballpark. Now tighten the number.
        </div>
      )}

      {isWon && latestFeedback && (
        <div
          style={{
            background: COLORS.successSoft,
            border: `1px solid rgba(47,143,100,0.45)`,
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 14,
            textAlign: "center",
            animation: "fadeIn 0.28s ease-out",
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 21,
              color: COLORS.text,
              fontWeight: 600,
              letterSpacing: -0.3,
            }}
          >
            Nailed it.
          </div>
          <div style={{ fontSize: 13, color: COLORS.subtext, marginTop: 4, lineHeight: 1.5 }}>
            Answer: <strong style={{ color: COLORS.text }}>{formatFullNumber(question.answer)}</strong> and you landed within{" "}
            {Math.round(latestFeedback.pctOff * 100)}%.
          </div>
        </div>
      )}

      {done && !isWon && roundPhase !== "active" && (
        <div
          style={{
            background: COLORS.dangerSoft,
            border: `1px solid rgba(217,119,87,0.35)`,
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              color: COLORS.text,
              fontWeight: 500,
            }}
          >
            Out of guesses
          </div>
          <div style={{ fontSize: 13, color: COLORS.subtext, marginTop: 4, lineHeight: 1.5 }}>
            The answer was <strong style={{ color: COLORS.text }}>{formatFullNumber(question.answer)}</strong>.
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {history
            .slice()
            .reverse()
            .map((entry, reverseIndex) => {
              const originalIndex = history.length - 1 - reverseIndex;
              return (
                <GuessRow
                  key={`${entry.guess}-${originalIndex}`}
                  guess={entry.guess}
                  evaluation={entry.evaluation}
                  index={originalIndex}
                />
              );
            })}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {!done ? (
        <div>
          <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 0.8, fontWeight: 600, marginBottom: 8 }}>
            QUICK ADJUST
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "÷10", factor: 0.1 },
              { label: "÷2", factor: 0.5 },
              { label: "×2", factor: 2 },
              { label: "×10", factor: 10 },
            ].map((button) => (
              <SurfaceButton
                key={button.label}
                disabled={adjustmentBase === null}
                onClick={() => handleAdjust(button.factor)}
                style={{ padding: "11px 0" }}
              >
                {button.label}
              </SurfaceButton>
            ))}
          </div>

          <SurfaceButton
            onClick={handleSubmit}
            disabled={currentGuess === null}
            className="primary-button"
            style={{ width: "100%" }}
          >
            Submit Guess
          </SurfaceButton>
        </div>
      ) : roundPhase === "ready_to_continue" ? (
        <>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "13px 14px",
              marginBottom: 12,
              fontSize: 13,
              color: COLORS.subtext,
              lineHeight: 1.55,
            }}
          >
            <span style={{ color: COLORS.muted, fontWeight: 600 }}>Fact: </span>
            {question.funFact}
          </div>
          <SurfaceButton onClick={handleContinue} style={{ width: "100%" }}>
            {questionIndex >= dailySet.questions.length - 1 ? "See Results" : "Next Question →"}
          </SurfaceButton>
        </>
      ) : null}
    </div>
  );
}

function SummaryScreen({
  dailySet,
  results,
  cycleDay,
  isTodayView,
  showArchiveNavigator,
  onReplayDay,
  onBrowseArchive,
  onGoToToday,
  onHideArchive,
  onPrevDay,
  onNextDay,
}) {
  const wins = results.filter((result) => result.won).length;
  const totalGuesses = results.reduce((sum, result) => sum + result.guesses, 0);
  const misses = results.filter((result) => !result.won);
  const closestMiss = misses.length > 0 ? Math.min(...misses.map((result) => result.bestPctOff)) : null;

  return (
    <div style={{ padding: "26px 22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
      {showArchiveNavigator ? (
        <DayNavigator
          dateKey={dailySet.date}
          cycleDay={cycleDay}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          compact
          label="ARCHIVE"
        />
      ) : (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div
            style={{
              fontSize: 11,
              color: COLORS.muted,
              letterSpacing: 1,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            TODAY'S RESULT
          </div>
          <div style={{ fontSize: 12, color: COLORS.subtext }}>{formatLongDate(dailySet.date)}</div>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 22 }}>
        <div
          style={{
            fontSize: 11,
            color: COLORS.muted,
            letterSpacing: 1,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          RESULTS
        </div>
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 40,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: -1,
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          {wins} of {dailySet.questions.length}
        </div>
        <div style={{ fontSize: 15, color: COLORS.subtext, marginBottom: 10 }}>{dailySet.theme}</div>
        <div style={{ fontSize: 12, color: COLORS.muted }}>{formatLongDate(dailySet.date)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
        {[
          { label: "Wins", value: `${wins}/${dailySet.questions.length}` },
          {
            label: "Closest Miss",
            value: closestMiss === null ? "Clean" : `${Math.round(closestMiss * 100)}%`,
          },
          { label: "Total Guesses", value: String(totalGuesses) },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "14px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                color: COLORS.text,
                lineHeight: 1,
                marginBottom: 6,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 0.8, fontWeight: 600 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "14px 16px",
          marginBottom: 18,
        }}
      >
        {dailySet.questions.map((question, index) => {
          const result = results[index];
          return (
            <div
              key={question.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderTop: index > 0 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: result?.won ? COLORS.success : COLORS.surfaceStrong,
                  color: result?.won ? "#ffffff" : COLORS.subtext,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {result?.won ? "✓" : index + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 0.9, fontWeight: 600, marginBottom: 3 }}>
                  {DIFFICULTY_META[question.difficulty].label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: COLORS.text,
                    fontWeight: 500,
                    lineHeight: 1.45,
                    marginBottom: 3,
                  }}
                >
                  {question.prompt}
                </div>
                <div style={{ fontSize: 12, color: COLORS.subtext }}>
                  Best guess {result ? formatCompactNumber(result.bestGuess) : "—"} • Answer {formatCompactNumber(question.answer)}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: COLORS.subtext,
                  flexShrink: 0,
                }}
              >
                {result ? `${result.guesses}/${MAX_GUESSES}` : `0/${MAX_GUESSES}`}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <SurfaceButton onClick={onReplayDay} className="primary-button" style={{ width: "100%", marginBottom: 10 }}>
        Play Again
      </SurfaceButton>
      {showArchiveNavigator ? (
        <GhostButton onClick={isTodayView ? onHideArchive : onGoToToday}>
          {isTodayView ? "Hide Archive" : "Today's Challenge"}
        </GhostButton>
      ) : (
        <GhostButton onClick={onBrowseArchive}>Browse Archive</GhostButton>
      )}
    </div>
  );
}

export default function BallparkGame() {
  const [phase, setPhase] = useState("start");
  const todayKey = getTodayKey();
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
        (savedProgress.phase === "question" || savedProgress.phase === "summary");

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
        setPhase(savedProgress.phase);
        setQIndex(restoredIndex);
        setResults(Array.isArray(savedProgress.results) ? savedProgress.results : []);
        setCurrentQuestionState(savedProgress.currentQuestionState ?? null);
      } else {
        setPhase("start");
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
      phase !== "start" ||
      results.length > 0 ||
      (currentQuestionState &&
        (currentQuestionState.history?.length > 0 ||
          currentQuestionState.guessInput ||
          currentQuestionState.lastGuess ||
          currentQuestionState.roundPhase === "resolved" ||
          currentQuestionState.roundPhase === "ready_to_continue"));

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
    if (phase !== "summary" || !dailySet) return;
    if (countedSummaryDateRef.current === dailySet.date) return;

    countedSummaryDateRef.current = dailySet.date;
    incrementGlobalPlayCount("ballpark");

    if (typeof window === "undefined" || dailySet.date !== todayKey) return;

    try {
      window.localStorage.setItem(`ballpark:daily:${dailySet.date}`, "1");
    } catch (error) {
      // Ignore storage failures in the app shell.
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
    setPhase("question");
    setQIndex(0);
    setResults([]);
    setCurrentQuestionState(null);
  };

  const handleQuestionComplete = (result) => {
    const nextResults = [...results, result];
    setResults(nextResults);
    setCurrentQuestionState(null);

    if (!dailySet || qIndex >= dailySet.questions.length - 1) {
      setPhase("summary");
    } else {
      setQIndex(qIndex + 1);
    }
  };

  const handleReplayDay = () => {
    setPhase("question");
    setQIndex(0);
    setResults([]);
    setCurrentQuestionState(null);
  };

  const cycleDay = getCycleDay(dateKey);
  const isTodayView = dateKey === todayKey;
  const showArchiveNavigator = archiveMode || !isTodayView;

  return (
    <div
      className="ballpark-root"
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COLORS.backgroundTint}, ${COLORS.background})`,
        color: COLORS.text,
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        maxWidth: 460,
        margin: "0 auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: `0 26px 70px ${COLORS.shadow}`,
        borderLeft: `1px solid ${COLORS.border}`,
        borderRight: `1px solid ${COLORS.border}`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

        .ballpark-root,
        .ballpark-root * { box-sizing: border-box; }

        @keyframes slideIn {
          0% { transform: translateY(-4px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .surface-button,
        .ghost-button {
          appearance: none;
          border: 1px solid ${COLORS.border};
          border-radius: 10px;
          background: ${COLORS.surface};
          color: ${COLORS.text};
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease, transform 0.15s ease;
          padding: 13px 14px;
        }

        .surface-button:hover:not(:disabled),
        .ghost-button:hover:not(:disabled) {
          background: ${COLORS.surfaceStrong};
          border-color: rgba(47,143,100,0.22);
        }

        .surface-button:disabled,
        .ghost-button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .primary-button {
          background: ${COLORS.accent};
          border-color: ${COLORS.accent};
          color: white;
          box-shadow: 0 8px 20px rgba(47,143,100,0.20);
        }

        .primary-button:hover:not(:disabled) {
          background: #24714d;
          border-color: #24714d;
        }

        .ghost-button {
          background: transparent;
          padding: 10px 12px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 11px;
          letter-spacing: 0.8px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .accent-chip {
          background: ${COLORS.accentSoft};
          border: 1px solid ${COLORS.accentBorder};
          color: #2c7852;
        }

        .neutral-chip {
          background: rgba(137,127,112,0.08);
          border: 1px solid ${COLORS.border};
          color: ${COLORS.subtext};
        }

        .guess-input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          color: ${COLORS.text};
          font-family: 'JetBrains Mono', monospace;
          font-size: 31px;
          font-weight: 600;
          line-height: 1;
          letter-spacing: -0.6px;
          padding: 0;
        }

        .guess-input::placeholder {
          color: #9d9789;
        }
      `}</style>

      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.text,
              letterSpacing: -0.2,
            }}
          >
            Ballpark
          </div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>A Daybreak trivia game.</div>
        </div>
        <div className="chip accent-chip">Day {String(cycleDay).padStart(2, "0")}</div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {loading || !dailySet ? (
          <LoadingScreen dateKey={dateKey} />
        ) : phase === "start" ? (
          <StartScreen
            dailySet={dailySet}
            dateKey={dateKey}
            cycleDay={cycleDay}
            isTodayView={isTodayView}
            showArchiveNavigator={showArchiveNavigator}
            onPrevDay={() => handleShiftDay(-1)}
            onNextDay={() => handleShiftDay(1)}
            onStart={handleStart}
            onBrowseArchive={handleBrowseArchive}
            onGoToToday={handleGoToToday}
            onHideArchive={handleHideArchive}
          />
        ) : phase === "question" ? (
          <QuestionScreen
            key={`${dailySet.date}-${qIndex}`}
            dailySet={dailySet}
            questionIndex={qIndex}
            savedQuestionState={currentQuestionState}
            onStateChange={setCurrentQuestionState}
            onComplete={handleQuestionComplete}
          />
        ) : (
          <SummaryScreen
            dailySet={dailySet}
            results={results}
            cycleDay={cycleDay}
            isTodayView={isTodayView}
            showArchiveNavigator={showArchiveNavigator}
            onReplayDay={handleReplayDay}
            onBrowseArchive={handleBrowseArchive}
            onGoToToday={handleGoToToday}
            onHideArchive={handleHideArchive}
            onPrevDay={() => handleShiftDay(-1)}
            onNextDay={() => handleShiftDay(1)}
          />
        )}
      </div>
    </div>
  );
}
