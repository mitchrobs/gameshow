import { type TextStyle, type ViewStyle } from 'react-native';
import type { ScreenAccentTokens, ThemeTokens } from '../constants/theme';

export interface DaybreakPrimitives {
  page: ViewStyle;
  card: ViewStyle;
  glassCard: ViewStyle;
  subtleCard: ViewStyle;
  pill: ViewStyle;
  cta: ViewStyle;
  ctaPressed: ViewStyle;
  ctaText: TextStyle;
  accentBar: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

export function createDaybreakPrimitives(
  theme: ThemeTokens,
  screenAccent: ScreenAccentTokens
): DaybreakPrimitives {
  return {
    page: {
      width: '100%',
      maxWidth: 520,
      alignSelf: 'center',
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.card,
    },
    glassCard: {
      backgroundColor: theme.colors.surfaceGlass,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.line,
      ...theme.shadows.glass,
    },
    subtleCard: {
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pill: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
    },
    cta: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1,
      borderColor: theme.colors.line,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ctaPressed: {
      backgroundColor: theme.colors.primaryLight,
      transform: [{ scale: 0.99 }],
    },
    ctaText: {
      color: theme.colors.white,
      fontSize: theme.fontSize.sm,
      textTransform: 'uppercase',
      letterSpacing: 1.3,
      fontWeight: '700',
    },
    accentBar: {
      height: 6,
      width: 84,
      borderRadius: theme.borderRadius.full,
      backgroundColor: screenAccent.main,
      shadowColor: screenAccent.main,
      shadowOpacity: theme.mode === 'dark' ? 0.45 : 0.26,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontWeight: '800',
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.xs,
    },
  };
}
