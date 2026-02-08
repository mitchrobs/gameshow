import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/theme';

export default function AnimatedBackground() {
  const phaseOne = useRef(new Animated.Value(0)).current;
  const phaseTwo = useRef(new Animated.Value(0)).current;
  const phaseThree = useRef(new Animated.Value(0)).current;
  const phaseFour = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration,
            useNativeDriver: true,
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

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.base} />
      <Animated.View
        style={[
          styles.blob,
          styles.blobOne,
          {
            transform: [
              { translateX: drift(phaseOne, -80, 80) },
              { translateY: drift(phaseOne, -40, 60) },
              { scale: pulse(phaseOne, 1, 1.15) },
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
              { translateX: drift(phaseTwo, 70, -70) },
              { translateY: drift(phaseTwo, 60, -60) },
              { scale: pulse(phaseTwo, 1.05, 1.2) },
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
              { translateX: drift(phaseThree, -50, 90) },
              { translateY: drift(phaseThree, 80, -30) },
              { scale: pulse(phaseThree, 0.95, 1.12) },
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
              { translateX: drift(phaseFour, 40, -90) },
              { translateY: drift(phaseFour, -70, 50) },
              { scale: pulse(phaseFour, 1, 1.18) },
            ],
          },
        ]}
      />
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
});
