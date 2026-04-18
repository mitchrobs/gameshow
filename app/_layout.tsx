import { Text, TextInput, View, StyleSheet, type TextStyle } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import {
  DaybreakThemeProvider,
  type ThemeTokens,
  useResolvedDaybreakTheme,
} from '../src/constants/theme';

export default function RootLayout() {
  const theme = useResolvedDaybreakTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fontStyle: TextStyle = { fontFamily: theme.typography.sans };
    const DefaultText = Text as typeof Text & { defaultProps?: { style?: TextStyle } };
    const DefaultTextInput = TextInput as typeof TextInput & {
      defaultProps?: { style?: TextStyle };
    };

    DefaultText.defaultProps = DefaultText.defaultProps ?? {};
    DefaultText.defaultProps.style = fontStyle;

    DefaultTextInput.defaultProps = DefaultTextInput.defaultProps ?? {};
    DefaultTextInput.defaultProps.style = fontStyle;
  }, [theme.typography.sans]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const bg = theme.colors.backgroundSoft;
    const root = document.documentElement;
    const body = document.body;
    const appRoot = document.getElementById('root');

    root.style.backgroundColor = bg;
    root.style.colorScheme = theme.mode;
    root.dataset.daybreakTheme = theme.mode;

    if (body) {
      body.style.backgroundColor = bg;
    }
    if (appRoot) {
      appRoot.style.backgroundColor = bg;
    }
  }, [theme.colors.backgroundSoft, theme.mode]);

  return (
    <DaybreakThemeProvider value={theme}>
      <SafeAreaProvider>
        <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
        <View style={styles.app}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.backgroundSoft },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: '700',
                color: theme.colors.text,
              },
              headerLargeTitleStyle: {
                color: theme.colors.text,
              },
              contentStyle: {
                backgroundColor: theme.colors.backgroundSoft,
              },
              headerShadowVisible: false,
              headerTitleAlign: 'left',
              animation: 'slide_from_right',
            }}
          />
        </View>
      </SafeAreaProvider>
    </DaybreakThemeProvider>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSoft,
    },
  });
