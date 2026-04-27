import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BarterMarketTab } from '../data/barter/uiState';

interface BarterUxColors {
  day: string;
  night: string;
  text: string;
  muted: string;
  border: string;
  surface: string;
  surfaceMuted: string;
  button: string;
  buttonPressed: string;
  buttonText: string;
  disabledBg: string;
  disabledText: string;
}

export function BarterPhaseTabs({
  activeTab,
  lateWindowOpen,
  dayLabel,
  nightLabel,
  colors,
  onSelectTab,
}: {
  activeTab: BarterMarketTab;
  lateWindowOpen: boolean;
  dayLabel: string;
  nightLabel: string;
  colors: BarterUxColors;
  onSelectTab: (tab: BarterMarketTab) => void;
}) {
  const renderTab = (tab: BarterMarketTab, title: string, label: string, disabled = false) => {
    const selected = activeTab === tab;
    const accent = tab === 'day' ? colors.day : colors.night;
    const preview = tab === 'night' && !lateWindowOpen;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected, disabled }}
        disabled={disabled}
        onPress={() => onSelectTab(tab)}
        style={({ pressed }) => [
          styles.tab,
          {
            backgroundColor: selected ? colors.surface : 'transparent',
            borderColor: selected ? `${accent}66` : 'transparent',
            opacity: disabled ? 0.55 : 1,
          },
          pressed && !disabled ? { transform: [{ scale: 0.99 }] } : null,
        ]}
      >
        <View style={styles.tabTitleRow}>
          <Text style={styles.tabIcon}>{tab === 'day' ? '☀️' : '🌙'}</Text>
          <Text style={[styles.tabTitle, { color: selected ? accent : colors.text }]}>
            {title}
          </Text>
          {preview && (
            <View style={[styles.previewBadge, { backgroundColor: colors.surfaceMuted }]}>
              <Text style={[styles.previewBadgeText, { color: colors.night }]}>preview</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color: disabled ? colors.disabledText : colors.muted }]}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.tabs,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
      ]}
    >
      {renderTab('day', 'Day Market', lateWindowOpen ? 'Done' : dayLabel, lateWindowOpen)}
      {renderTab('night', 'Night Market', nightLabel)}
    </View>
  );
}

export function BarterActionIsland({
  title,
  tradeLine,
  detail,
  missingLine,
  buttonLabel,
  canExecute,
  activeTab,
  tradesUsed,
  maxTrades,
  dayTradeCount,
  colors,
  onTrade,
  children,
}: {
  title: string;
  tradeLine: string;
  detail: string;
  missingLine?: string;
  buttonLabel: string;
  canExecute: boolean;
  activeTab: BarterMarketTab;
  tradesUsed: number;
  maxTrades: number;
  dayTradeCount: number;
  colors: BarterUxColors;
  onTrade: () => void;
  children?: ReactNode;
}) {
  const accent = activeTab === 'night' ? colors.night : colors.day;

  return (
    <View style={[styles.actionShell, { borderColor: accent, backgroundColor: colors.surface }]}>
      <View style={[styles.actionRail, { borderBottomColor: colors.border }]}>
        <View style={styles.actionRailLeft}>
          <Text style={[styles.actionRailLabel, { color: colors.muted }]}>Trades left</Text>
          <View style={styles.actionDots}>
            {Array.from({ length: maxTrades }).map((_, index) => {
              const phaseAccent = index < dayTradeCount ? colors.day : colors.night;
              const remaining = index >= tradesUsed;
              return (
                <View
                  key={`trade-dot-${index}`}
                  style={[
                    styles.actionDot,
                    {
                      backgroundColor: remaining ? phaseAccent : colors.surfaceMuted,
                      borderColor: remaining ? phaseAccent : colors.border,
                      opacity: remaining ? 1 : 0.45,
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
        <Text style={[styles.actionRailCount, { color: colors.text }]}>
          {tradesUsed}
          <Text style={{ color: colors.muted }}>/{maxTrades}</Text>
        </Text>
      </View>

      <View style={styles.actionBody}>
        <View style={styles.actionTextColumn}>
          <Text style={[styles.actionTitle, { color: colors.muted }]} numberOfLines={1}>
            {title}
          </Text>
          <Text style={[styles.actionTrade, { color: colors.text }]} numberOfLines={1}>
            {tradeLine}
          </Text>
          <Text style={[styles.actionDetail, { color: colors.muted }]} numberOfLines={1}>
            {missingLine || detail}
          </Text>
          {children}
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={!canExecute}
          onPress={onTrade}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: canExecute ? colors.button : colors.disabledBg,
            },
            pressed && canExecute ? { backgroundColor: colors.buttonPressed } : null,
          ]}
        >
          <Text
            style={[
              styles.actionButtonText,
              { color: canExecute ? colors.buttonText : colors.disabledText },
            ]}
          >
            {canExecute ? `${buttonLabel} →` : buttonLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 12,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  tabIcon: {
    fontSize: 12,
    lineHeight: 14,
  },
  tabTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewBadge: {
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  previewBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  actionShell: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionRail: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  actionRailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  actionRailLabel: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  actionDots: {
    flexDirection: 'row',
    gap: 3,
    flexShrink: 1,
    flexWrap: 'nowrap',
  },
  actionDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  actionRailCount: {
    fontSize: 11,
    fontWeight: '800',
  },
  actionBody: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionTextColumn: {
    flex: 1,
    minWidth: 0,
  },
  actionTitle: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  actionTrade: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '800',
  },
  actionDetail: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
  },
  actionButton: {
    borderRadius: 12,
    minWidth: 100,
    paddingVertical: 11,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
