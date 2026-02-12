import {
  createContext,
  createElement,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Appearance,
  Platform,
  type ColorSchemeName,
  type ViewStyle,
  useColorScheme,
} from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemePalette {
  background: string;
  backgroundSoft: string;
  surface: string;
  surfaceElevated: string;
  surfaceLight: string;
  surfaceGlass: string;
  primary: string;
  primaryLight: string;
  accent: string;
  success: string;
  error: string;
  errorLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  line: string;
  white: string;
  overlay: string;
  shadow: string;
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  display: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

interface ThemeShadows {
  card: ViewStyle;
  elevated: ViewStyle;
  glass: ViewStyle;
}

export interface ThemeTokens {
  mode: ThemeMode;
  colors: ThemePalette;
  spacing: typeof Spacing;
  fontSize: typeof FontSize;
  borderRadius: typeof BorderRadius;
  typography: {
    sans: string;
    display: string;
  };
  shadows: ThemeShadows;
}

export type ScreenAccentId =
  | 'home'
  | 'moji-mash'
  | 'wordie'
  | 'mini-crossword'
  | 'sudoku'
  | 'trivia'
  | 'bridges'
  | 'whodunit'
  | 'barter';

export interface ScreenAccentTokens {
  main: string;
  soft: string;
  contrast: string;
  glow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}

const LIGHT_COLORS: ThemePalette = {
  background: '#fafbfd',
  backgroundSoft: '#f3f6fb',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  surfaceLight: '#eef2f8',
  surfaceGlass: 'rgba(255, 255, 255, 0.78)',
  primary: '#0b0b0b',
  primaryLight: '#22252d',
  accent: '#ff3b30',
  success: '#18a957',
  error: '#e04444',
  errorLight: '#f7b2b2',
  text: '#0b0b0b',
  textSecondary: '#4d5360',
  textMuted: '#6a7180',
  border: 'rgba(11, 11, 11, 0.14)',
  line: 'rgba(11, 11, 11, 0.12)',
  white: '#ffffff',
  overlay: 'rgba(10, 16, 24, 0.45)',
  shadow: '#0b0b0b',
};

const DARK_COLORS: ThemePalette = {
  background: '#0b0f15',
  backgroundSoft: '#0f141d',
  surface: '#151c26',
  surfaceElevated: '#1b2430',
  surfaceLight: '#232f3e',
  surfaceGlass: 'rgba(21, 28, 38, 0.75)',
  primary: '#273241',
  primaryLight: '#314054',
  accent: '#ff5a51',
  success: '#4fb477',
  error: '#ff6b6b',
  errorLight: '#523437',
  text: '#f7f7f7',
  textSecondary: '#d3d8e0',
  textMuted: '#9ca7b8',
  border: 'rgba(255, 255, 255, 0.18)',
  line: 'rgba(255, 255, 255, 0.2)',
  white: '#ffffff',
  overlay: 'rgba(5, 8, 12, 0.68)',
  shadow: '#000000',
};

function createTheme(mode: ThemeMode): ThemeTokens {
  const colors = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  return {
    mode,
    colors,
    spacing: Spacing,
    fontSize: FontSize,
    borderRadius: BorderRadius,
    typography: {
      sans: 'Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'Sora, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    shadows: {
      card: {
        shadowColor: colors.shadow,
        shadowOpacity: mode === 'dark' ? 0.24 : 0.08,
        shadowRadius: mode === 'dark' ? 24 : 16,
        shadowOffset: { width: 0, height: mode === 'dark' ? 14 : 10 },
        elevation: mode === 'dark' ? 7 : 4,
      },
      elevated: {
        shadowColor: colors.shadow,
        shadowOpacity: mode === 'dark' ? 0.32 : 0.12,
        shadowRadius: mode === 'dark' ? 28 : 20,
        shadowOffset: { width: 0, height: mode === 'dark' ? 16 : 12 },
        elevation: mode === 'dark' ? 10 : 6,
      },
      glass: {
        shadowColor: colors.shadow,
        shadowOpacity: mode === 'dark' ? 0.2 : 0.06,
        shadowRadius: mode === 'dark' ? 18 : 12,
        shadowOffset: { width: 0, height: mode === 'dark' ? 12 : 8 },
        elevation: mode === 'dark' ? 6 : 3,
      },
    },
  };
}

const LIGHT_THEME = createTheme('light');
const DARK_THEME = createTheme('dark');

export function resolveTheme(mode: ThemeMode): ThemeTokens {
  return mode === 'dark' ? DARK_THEME : LIGHT_THEME;
}

function toThemeMode(scheme: ColorSchemeName | null | undefined): ThemeMode {
  return scheme === 'dark' ? 'dark' : 'light';
}

function coerceThemeMode(value: string | null | undefined): ThemeMode | null {
  if (value === 'dark' || value === 'light') return value;
  return null;
}

function getWebPreferredMode(): ThemeMode | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }
  const mediaMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (mediaMode) return mediaMode;
  if (typeof document === 'undefined') return null;
  const root = document.documentElement;
  if (!root) return null;
  const cssMode = window.getComputedStyle(root).getPropertyValue('--daybreak-system-theme').trim();
  return coerceThemeMode(cssMode);
}

function getInitialMode(): ThemeMode {
  if (Platform.OS === 'web') {
    return getWebPreferredMode() ?? toThemeMode(Appearance.getColorScheme());
  }
  return toThemeMode(Appearance.getColorScheme());
}

export function useResolvedDaybreakTheme(): ThemeTokens {
  const colorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode());

  useEffect(() => {
    if (Platform.OS === 'web') {
      const apply = () => {
        const nextMode = getWebPreferredMode() ?? toThemeMode(colorScheme);
        setMode((prevMode) => (prevMode === nextMode ? prevMode : nextMode));
      };

      apply();

      const onVisibility = () => apply();
      const onFocus = () => apply();
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibility);
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('focus', onFocus);
        window.addEventListener('pageshow', onFocus);
      }

      const media =
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
          ? window.matchMedia('(prefers-color-scheme: dark)')
          : null;

      if (media && typeof media.addEventListener === 'function') {
        media.addEventListener('change', apply);
      } else if (media) {
        // Legacy Safari.
        // eslint-disable-next-line deprecation/deprecation
        media.addListener(apply);
      }

      const appearanceSubscription = Appearance.addChangeListener(() => {
        apply();
      });

      // Some browsers settle preferred color scheme shortly after hydration.
      const settleTimeout =
        typeof window !== 'undefined' ? window.setTimeout(() => apply(), 80) : null;

      return () => {
        if (media && typeof media.removeEventListener === 'function') {
          media.removeEventListener('change', apply);
        } else if (media) {
          // eslint-disable-next-line deprecation/deprecation
          media.removeListener(apply);
        }
        appearanceSubscription.remove();
        if (typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', onVisibility);
        }
        if (typeof window !== 'undefined') {
          window.removeEventListener('focus', onFocus);
          window.removeEventListener('pageshow', onFocus);
          if (settleTimeout !== null) {
            window.clearTimeout(settleTimeout);
          }
        }
      };
    }

    const nextMode = toThemeMode(colorScheme);
    setMode((prevMode) => (prevMode === nextMode ? prevMode : nextMode));

    return undefined;
  }, [colorScheme]);

  return useMemo(() => resolveTheme(mode), [mode]);
}

const DaybreakThemeContext = createContext<ThemeTokens | null>(null);

interface DaybreakThemeProviderProps extends PropsWithChildren {
  value: ThemeTokens;
}

export function DaybreakThemeProvider({ value, children }: DaybreakThemeProviderProps) {
  return createElement(DaybreakThemeContext.Provider, { value }, children);
}

export function useDaybreakTheme(): ThemeTokens {
  const theme = useContext(DaybreakThemeContext);
  if (!theme) {
    throw new Error('useDaybreakTheme must be used within DaybreakThemeProvider.');
  }
  return theme;
}

function alpha(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return hex;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const SCREEN_ACCENT_HEX: Record<ScreenAccentId, string> = {
  home: '#ff3b30',
  'moji-mash': '#6d4aff',
  wordie: '#2f6bff',
  'mini-crossword': '#c95f23',
  sudoku: '#4fb477',
  trivia: '#00a48a',
  bridges: '#e8a838',
  whodunit: '#7f1d1d',
  barter: '#0d7c5f',
};

export function resolveScreenAccent(
  accent: ScreenAccentId,
  theme: ThemeTokens
): ScreenAccentTokens {
  const main = SCREEN_ACCENT_HEX[accent];
  return {
    main,
    soft: alpha(main, theme.mode === 'dark' ? 0.3 : 0.12),
    contrast: theme.mode === 'dark' ? '#f7f7f7' : '#0b0b0b',
    glow: alpha(main, theme.mode === 'dark' ? 0.4 : 0.24),
    badgeBg: alpha(main, theme.mode === 'dark' ? 0.2 : 0.1),
    badgeBorder: alpha(main, theme.mode === 'dark' ? 0.45 : 0.28),
    badgeText: theme.mode === 'dark' ? '#f7f7f7' : main,
  };
}

// Backwards-compatible exports for files that still import these directly.
export const Colors = LIGHT_THEME.colors;
