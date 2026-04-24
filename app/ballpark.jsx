import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import BallparkGame from '../src/ballpark/BallparkGame.jsx';

export default function BallparkRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Ballpark', headerBackTitle: 'Home' }} />
      {Platform.OS === 'web' ? (
        <BallparkGame />
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Ballpark</Text>
            <Text style={styles.copy}>
              Ballpark is currently tuned for the web build. Open it from the Gameshow site to
              play the full estimation-trivia experience.
            </Text>
            <Pressable style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Back to games</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6fb',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(11, 11, 11, 0.12)',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0b0b0b',
  },
  copy: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4d5360',
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    borderRadius: 12,
    backgroundColor: '#0b0b0b',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
