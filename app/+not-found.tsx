import { Redirect, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useDaybreakTheme } from '../src/constants/theme';

export default function NotFoundScreen() {
  const pathname = usePathname();
  const theme = useDaybreakTheme();
  const prefixedPath = pathname === '/gameshow' || pathname.startsWith('/gameshow/');

  if (prefixedPath) {
    const strippedPath = pathname.replace(/^\/gameshow/, '') || '/';
    return <Redirect href={strippedPath as never} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundSoft }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Route not found</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          This Daybreak game route does not exist.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
});
