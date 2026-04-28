import {
  formatThreadlineReviewMarkdown,
  generateThreadlineCalendarReview,
  THREADLINE_RESERVE_DAYS,
  THREADLINE_REVIEW_DAYS,
} from '../src/data/threadlineCalendarReview.ts';

declare const process: { argv: string[] };

function readArg(name: string, fallback: string): string {
  const prefix = `--${name}=`;
  const entry = process.argv.find((arg) => arg.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : fallback;
}

const start = readArg('start', '2026-05-01');
const defaultDays = THREADLINE_REVIEW_DAYS + THREADLINE_RESERVE_DAYS;
const days = Number.parseInt(readArg('days', String(defaultDays)), 10);
const review = generateThreadlineCalendarReview({
  startDate: new Date(`${start}T12:00:00`),
  days: Number.isFinite(days) ? days : defaultDays,
});

console.log(formatThreadlineReviewMarkdown(review));
