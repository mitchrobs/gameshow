export const HARD_WIN_THRESHOLD = 0.05;
export const BALLPARK_TIME_ZONE = 'America/Chicago';
export const GUESS_INPUT_MAX_DIGITS = 12;

export type GuessDirection = 'up' | 'down' | null;
export type GuessTier = 'bullseye' | 'close' | 'warm' | 'cold';

export type GuessEvaluation = {
  tier: GuessTier;
  pctOff: number;
  sameOOM: boolean;
  direction: GuessDirection;
};

export type BallparkResultLike = {
  won: boolean;
  bestPctOff: number;
  guesses: number;
};

function getDatePartsInBallparkZone(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BALLPARK_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: byType.year,
    month: byType.month,
    day: byType.day,
  };
}

export function getBallparkDateKey(date = new Date()) {
  const { year, month, day } = getDatePartsInBallparkZone(date);
  return `${year}-${month}-${day}`;
}

export function formatBallparkLongDate(dateKey: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: BALLPARK_TIME_ZONE,
  }).format(new Date(`${dateKey}T12:00:00`));
}

export function formatCompactNumber(value: number) {
  const rounded = Math.round(value);
  if (rounded >= 1e12) return `${(rounded / 1e12).toFixed(1).replace(/\.0$/, '')}T`;
  if (rounded >= 1e9) return `${(rounded / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (rounded >= 1e6) return `${(rounded / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (rounded >= 1e3) return `${(rounded / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return String(rounded);
}

export function formatFullNumber(value: number) {
  return Math.round(value).toLocaleString('en-US');
}

export function sanitizeGuessInput(value: string) {
  return value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '').slice(0, GUESS_INPUT_MAX_DIGITS);
}

export function appendDigit(value: string, digit: string) {
  return sanitizeGuessInput(`${value}${digit}`);
}

export function parseGuessInput(value: string) {
  const digits = sanitizeGuessInput(value);
  if (!digits) return null;

  const parsed = Number(digits);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
}

export function orderOfMagnitude(value: number) {
  if (value <= 0) return 0;
  return Math.floor(Math.log10(value));
}

export function evaluateGuess(guess: number, answer: number, winThreshold: number): GuessEvaluation {
  const pctOff = Math.abs(guess - answer) / answer;
  const sameOOM = orderOfMagnitude(guess) === orderOfMagnitude(answer);

  let tier: GuessTier = 'cold';
  if (pctOff <= winThreshold) tier = 'bullseye';
  else if (pctOff <= 0.5) tier = 'close';
  else if (sameOOM) tier = 'warm';

  return {
    tier,
    pctOff,
    sameOOM,
    direction: guess > answer ? 'down' : guess < answer ? 'up' : null,
  };
}

export function getShareGlyph(result?: BallparkResultLike | null) {
  if (!result) return '⬜️';
  if (result.won) return '🟩';
  if (result.bestPctOff <= 0.5) return '🟨';
  return '⬛️';
}

export function getPctOffBucket(pctOff: number) {
  if (pctOff <= 0.05) return 'within_5';
  if (pctOff <= 0.1) return 'within_10';
  if (pctOff <= 0.5) return 'within_50';
  if (pctOff <= 1) return 'within_100';
  return 'over_100';
}

export function formatBallparkShareText({
  dateKey,
  extraInningResult,
  hardMode,
  results,
  theme,
}: {
  dateKey: string;
  extraInningResult?: BallparkResultLike | null;
  hardMode?: boolean;
  results: BallparkResultLike[];
  theme: string;
}) {
  const resultList = extraInningResult ? [...results, extraInningResult] : results;
  const resultRow = resultList.map((result) => getShareGlyph(result)).join('');
  const totalGuesses = resultList.reduce((sum, result) => sum + result.guesses, 0);
  const guessToken = hardMode ? `${totalGuesses}H` : String(totalGuesses);
  const resultLine = extraInningResult ? `${guessToken} | ${resultRow} EI` : `${guessToken} | ${resultRow}`;

  return [`Ballpark ${formatBallparkLongDate(dateKey)}`, theme, resultLine].join('\n');
}
