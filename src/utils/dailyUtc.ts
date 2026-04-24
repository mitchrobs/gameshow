const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const DEFAULT_DATE_LABEL_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

export function getUtcDayOrdinal(date: Date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY
  );
}

export function getUtcDateKey(date: Date = new Date()): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
    .toISOString()
    .slice(0, 10);
}

export function parseUtcDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function getUtcDateNumber(date: Date = new Date()): number {
  return Number(getUtcDateKey(date).replaceAll('-', ''));
}

export function formatUtcDateLabel(
  dateOrKey: Date | string,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_LABEL_OPTIONS
): string {
  const date = typeof dateOrKey === 'string' ? parseUtcDateKey(dateOrKey) : dateOrKey;
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    ...options,
  });
}

export function addUtcDays(dateKey: string, days: number): string {
  const date = parseUtcDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return getUtcDateKey(date);
}

export function dateKeyToUtcOrdinal(dateKey: string): number {
  return getUtcDayOrdinal(parseUtcDateKey(dateKey));
}
