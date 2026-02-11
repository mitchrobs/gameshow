import { Platform, Text, TextInput, View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useMemo } from 'react';
import { type ThemeTokens, useDaybreakTheme } from '../src/constants/theme';

export default function RootLayout() {
  const theme = useDaybreakTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const fontStyle = { fontFamily: theme.typography.sans };

    Text.defaultProps = Text.defaultProps ?? {};
    Text.defaultProps.style = fontStyle;

    TextInput.defaultProps = TextInput.defaultProps ?? {};
    TextInput.defaultProps.style = fontStyle;
  }, [theme.typography.sans]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

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
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSoft,
    },
  });
