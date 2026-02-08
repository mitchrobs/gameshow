import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Platform } from 'react-native';
import { Colors } from '../constants/theme';

export default function AnimatedBackground() {
  const phaseOne = useRef(new Animated.Value(0)).current;
  const phaseTwo = useRef(new Animated.Value(0)).current;
  const phaseThree = useRef(new Animated.Value(0)).current;
  const phaseFour = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const makeLoop = (
      value: Animated.Value,
      duration: number,
      delay: number
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration,
            useNativeDriver,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver,
          }),
        ])
      );

    const one = makeLoop(phaseOne, 20000, 0);
    const two = makeLoop(phaseTwo, 24000, 2000);
    const three = makeLoop(phaseThree, 22000, 4000);
    const four = makeLoop(phaseFour, 26000, 6000);

    one.start();
    two.start();
    three.start();
    four.start();

    return () => {
      one.stop();
      two.stop();
      three.stop();
      four.stop();
    };
  }, [phaseOne, phaseTwo, phaseThree, phaseFour]);

  const drift = (value: Animated.Value, from: number, to: number) =>
    value.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
  const pulse = (value: Animated.Value, from: number, to: number) =>
    value.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  const webGradientStyle =
    Platform.OS === 'web'
      ? ({
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255, 95, 177, 0.9), rgba(255, 95, 177, 0) 60%),' +
            'radial-gradient(circle at 80% 25%, rgba(89, 169, 255, 0.85), rgba(89, 169, 255, 0) 58%),' +
            'radial-gradient(circle at 35% 85%, rgba(110, 242, 201, 0.8), rgba(110, 242, 201, 0) 60%),' +
            'radial-gradient(circle at 85% 80%, rgba(255, 195, 106, 0.85), rgba(255, 195, 106, 0) 58%)',
        } as const)
      : undefined;

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.base} />
      {Platform.OS === 'web' ? (
        <Animated.View
          style={[
            styles.webGradient,
            {
              transform: [
                { translateX: drift(phaseOne, -120, 120) },
                { translateY: drift(phaseTwo, 90, -90) },
                { scale: pulse(phaseThree, 1, 1.1) },
                { rotate: drift(phaseFour, '-6deg', '6deg') },
              ],
            },
            webGradientStyle as any,
          ] as const}
        />
      ) : (
        <>
          <Animated.View
            style={[
              styles.blob,
              styles.blobOne,
              {
                transform: [
                  { translateX: drift(phaseOne, -120, 120) },
                  { translateY: drift(phaseOne, -80, 90) },
                  { scale: pulse(phaseOne, 1, 1.2) },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.blob,
              styles.blobTwo,
              {
                transform: [
                  { translateX: drift(phaseTwo, 110, -110) },
                  { translateY: drift(phaseTwo, 100, -90) },
                  { scale: pulse(phaseTwo, 1.05, 1.25) },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.blob,
              styles.blobThree,
              {
                transform: [
                  { translateX: drift(phaseThree, -90, 130) },
                  { translateY: drift(phaseThree, 120, -70) },
                  { scale: pulse(phaseThree, 0.95, 1.18) },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.blob,
              styles.blobFour,
              {
                transform: [
                  { translateX: drift(phaseFour, 80, -120) },
                  { translateY: drift(phaseFour, -110, 80) },
                  { scale: pulse(phaseFour, 1, 1.22) },
                ],
              },
            ]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
  },
  blob: {
    position: 'absolute',
    width: 680,
    height: 680,
    borderRadius: 999,
    opacity: 0.8,
  },
  blobOne: {
    backgroundColor: '#ff5fb1',
    top: -220,
    left: -180,
    shadowColor: '#ff5fb1',
    shadowOpacity: 0.45,
    shadowRadius: 120,
  },
  blobTwo: {
    backgroundColor: '#59a9ff',
    bottom: -240,
    right: -200,
    shadowColor: '#59a9ff',
    shadowOpacity: 0.45,
    shadowRadius: 120,
  },
  blobThree: {
    backgroundColor: '#6ef2c9',
    top: 80,
    right: -240,
    shadowColor: '#6ef2c9',
    shadowOpacity: 0.4,
    shadowRadius: 110,
  },
  blobFour: {
    backgroundColor: '#ffc36a',
    bottom: 60,
    left: -240,
    shadowColor: '#ffc36a',
    shadowOpacity: 0.45,
    shadowRadius: 120,
  },
  webGradient: {
    position: 'absolute',
    width: '160%',
    height: '160%',
    top: '-30%',
    left: '-30%',
    opacity: 0.9,
  } as const,
});
