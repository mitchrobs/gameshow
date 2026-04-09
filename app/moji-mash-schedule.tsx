import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDaybreakTheme, type ThemeTokens } from '../src/constants/theme';
import puzzles, { getLocalDateKey, getDailyPuzzleIndex } from '../src/data/mojiMashPuzzles';

// ---------------------------------------------------------------------------
// Holiday labels (mirrors show_calendar.py)
// ---------------------------------------------------------------------------

const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': "New Year's",
  '02-14': "Valentine's Day",
  '03-17': "St. Patrick's Day",
  '04-15': 'Tax Day',
  '04-22': 'Earth Day',
  '07-04': 'Independence Day',
  '10-31': 'Halloween',
  '12-25': 'Christmas',
  '12-31': "New Year's Eve",
};

const VARIABLE_HOLIDAYS: Record<string, string> = {
  '2026-04-05': 'Easter',
  '2026-05-10': "Mother's Day",
  '2026-05-25': 'Memorial Day',
  '2026-06-21': "Father's Day",
  '2026-09-07': 'Labor Day',
  '2026-11-26': 'Thanksgiving',
};

function holidayLabel(dateKey: string): string | null {
  return (
    VARIABLE_HOLIDAYS[dateKey] ??
    FIXED_HOLIDAYS[dateKey.slice(5)] ??
    null
  );
}

// ---------------------------------------------------------------------------
// Calendar helpers
// ---------------------------------------------------------------------------

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthWeeks(year: number, month: number): (number | null)[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

function addMonths(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

// ---------------------------------------------------------------------------
// Difficulty colour tokens (word count → colour set)
// ---------------------------------------------------------------------------

const DIFFICULTY_COLORS = {
  2: { bg: '#e3f4e9', text: '#1a6e35' },
  3: { bg: '#e3eaff', text: '#1a35a0' },
  4: { bg: '#f0e3ff', text: '#6a1a9a' },
} as const;

const PINNED_COLORS = { bg: '#fff0b0', text: '#7a4e00' };

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function WordTag({ word, bg, color }: { word: string; bg: string; color: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, { color }]}>{word}</Text>
    </View>
  );
}

function renderWordTags(words: string[], bg: string, color: string) {
  return words.map((w) => (
    <View key={w} style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.tagText, { color }]}>{w}</Text>
    </View>
  ));
}

function DayCell({
  dayNum,
  dateKey,
  isToday,
  theme,
}: {
  dayNum: number;
  dateKey: string;
  isToday: boolean;
  theme: ThemeTokens;
}) {
  const puzzleIndex = getDailyPuzzleIndex(new Date(dateKey + 'T12:00:00'));
  const puzzle = puzzles[puzzleIndex];
  const pinned = !!puzzle.date;
  const holiday = holidayLabel(dateKey);
  const wordCount = puzzle.words.length as 2 | 3 | 4;
  const colors = pinned ? PINNED_COLORS : (DIFFICULTY_COLORS[wordCount] ?? DIFFICULTY_COLORS[4]);

  return (
    <View
      style={[
        styles.cell,
        { backgroundColor: pinned ? '#fffbf0' : theme.colors.surface },
        isToday && styles.cellToday,
        pinned && !isToday && styles.cellPinned,
      ]}
    >
      <Text style={[styles.dayNum, { color: isToday ? '#007aff' : theme.colors.text }]}>
        {dayNum}
        {pinned ? ' 📌' : ''}
      </Text>
      {holiday ? (
        <Text style={styles.holidayLabel} numberOfLines={1}>
          {holiday}
        </Text>
      ) : null}
      <View style={styles.tagRow}>
        {renderWordTags(puzzle.words, colors.bg, colors.text)}
      </View>
    </View>
  );
}

function MonthGrid({
  year,
  month,
  todayKey,
  theme,
}: {
  year: number;
  month: number;
  todayKey: string;
  theme: ThemeTokens;
}) {
  const monthLabel = new Date(year, month, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const weeks = getMonthWeeks(year, month);

  return (
    <View style={styles.monthBlock}>
      <Text style={[styles.monthTitle, { color: theme.colors.text }]}>{monthLabel}</Text>
      {/* Day-of-week header */}
      <View style={styles.weekRow}>
        {DAY_HEADERS.map((d) => (
          <View key={d} style={styles.headerCell}>
            <Text style={[styles.headerText, { color: theme.colors.textMuted }]}>{d}</Text>
          </View>
        ))}
      </View>
      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((dayNum, di) => {
            if (dayNum === null) {
              return <View key={di} style={[styles.cell, styles.cellEmpty]} />;
            }
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = dateKey === todayKey;
            return (
              <View key={di} style={{ flex: 1 }}>
                <DayCell dayNum={dayNum} dateKey={dateKey} isToday={isToday} theme={theme} />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function MojiMashScheduleScreen() {
  const theme = useDaybreakTheme();
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => getLocalDateKey(today), [today]);

  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const d = addMonths(today, i);
      result.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    return result;
  }, [today]);

  const rotationCount = puzzles.filter((p) => !p.date).length;
  const pinnedCount = puzzles.filter((p) => !!p.date).length;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ title: 'Moji Mash Schedule', headerShown: true }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Moji Mash Schedule</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
          {rotationCount} in rotation · {pinnedCount} date-pinned
        </Text>

        {/* Legend */}
        <View style={styles.legendRow}>
          {[
            { label: '2-word', ...DIFFICULTY_COLORS[2] },
            { label: '3-word', ...DIFFICULTY_COLORS[3] },
            { label: '4-word', ...DIFFICULTY_COLORS[4] },
            { label: '📌 Pinned', ...PINNED_COLORS },
          ].map(({ label, bg, text }) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendSwatch, { backgroundColor: bg }]} />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{label}</Text>
            </View>
          ))}
        </View>

        {months.map(({ year, month }: { year: number; month: number }) => (
          <View key={`${year}-${month}`}>
            <MonthGrid year={year} month={month} todayKey={todayKey} theme={theme} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CELL_GAP = 4;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20, paddingBottom: 60 },

  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 16 },

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendSwatch: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 12 },

  monthBlock: { marginBottom: 36 },
  monthTitle: { fontSize: 17, fontWeight: '600', marginBottom: 8 },

  weekRow: {
    flexDirection: 'row',
    gap: CELL_GAP,
    marginBottom: CELL_GAP,
  },

  headerCell: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  headerText: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },

  cell: {
    flex: 1,
    borderRadius: 8,
    padding: 6,
    minHeight: 88,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  cellEmpty: { backgroundColor: 'transparent', borderColor: 'transparent' },
  cellToday: { borderColor: '#007aff', backgroundColor: '#f0f7ff' },
  cellPinned: { borderColor: '#e8b800' },

  dayNum: { fontSize: 12, fontWeight: '600', marginBottom: 3 },
  holidayLabel: {
    fontSize: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    color: '#b07000',
    marginBottom: 3,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  tag: { borderRadius: 3, paddingHorizontal: 4, paddingVertical: 1, marginBottom: 1 },
  tagText: { fontSize: 9, fontWeight: '500' },
});
