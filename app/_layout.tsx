import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../src/constants/theme';
import AnimatedBackground from '../src/components/AnimatedBackground';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AnimatedBackground />
      <StatusBar style="dark" />
      <View style={styles.app}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colors.background },
            headerTintColor: Colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: 'transparent' },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
