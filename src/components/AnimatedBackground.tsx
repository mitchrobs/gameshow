import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/theme';

export default function AnimatedBackground() {
  const blobOne = useRef(new Animated.Value(0)).current;
  const blobTwo = useRef(new Animated.Value(0)).current;
  const blobThree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeLoop = (value: Animated.Value, duration: number, to: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: to,
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

    const one = makeLoop(blobOne, 18000, 40);
    const two = makeLoop(blobTwo, 22000, -50);
    const three = makeLoop(blobThree, 20000, 30);

    one.start();
    two.start();
    three.start();

    return () => {
      one.stop();
      two.stop();
      three.stop();
    };
  }, [blobOne, blobTwo, blobThree]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.base} />
      <Animated.View
        style={[
          styles.blob,
          styles.blobOne,
          { transform: [{ translateX: blobOne }, { translateY: blobTwo }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blobTwo,
          { transform: [{ translateX: blobTwo }, { translateY: blobThree }] },
        ]}
      />
      <Animated.View
        style={[
          styles.blob,
          styles.blobThree,
          { transform: [{ translateX: blobThree }, { translateY: blobOne }] },
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
    width: 320,
    height: 320,
    borderRadius: 999,
    opacity: 0.35,
  },
  blobOne: {
    backgroundColor: '#f2d9d5',
    top: -80,
    left: -40,
  },
  blobTwo: {
    backgroundColor: '#e7e0cc',
    bottom: -120,
    right: -60,
  },
  blobThree: {
    backgroundColor: '#d5e3da',
    top: 180,
    right: -80,
  },
});
