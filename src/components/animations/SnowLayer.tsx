import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface SnowflakeData {
  id: number;
  xPercent: number;
  size: number;
  duration: number;
  swayDistance: number;
  delay: number;
  opacity: number;
}

const Snowflake: React.FC<{ flake: SnowflakeData; screenHeight: number; reducedMotion?: boolean }> = ({
  flake,
  screenHeight,
  reducedMotion,
}) => {
  const translateY = useSharedValue(-flake.size - 20);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;

    translateY.value = withDelay(
      flake.delay,
      withRepeat(
        withTiming(screenHeight + 30, {
          duration: flake.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Horizontal gentle swaying
    translateX.value = withRepeat(
      withSequence(
        withTiming(flake.swayDistance, {
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(-flake.swayDistance, {
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
        })
      ),
      -1,
      true
    );
  }, [screenHeight, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
    left: `${flake.xPercent}%`,
    width: flake.size,
    height: flake.size,
    borderRadius: flake.size / 2,
    opacity: flake.opacity,
  }));

  return <Animated.View style={[styles.flake, style]} />;
};

export const SnowLayer: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const { width, height } = useWindowDimensions();
  const flakeCount = Platform.OS === 'web' && width > 768 ? 32 : 20;

  const flakes = useMemo<SnowflakeData[]>(() => {
    const list: SnowflakeData[] = [];
    for (let i = 0; i < flakeCount; i++) {
      const xPercent = (i * 23 + 9) % 94 + 3;
      const size = 3 + (i % 4) * 1.5;
      const duration = 4000 + (i % 5) * 800;
      const swayDistance = 8 + (i % 3) * 6;
      const delay = (i * 280) % 3500;
      const opacity = 0.5 + (i % 3) * 0.2;
      list.push({ id: i, xPercent, size, duration, swayDistance, delay, opacity });
    }
    return list;
  }, [flakeCount]);

  return (
    <View style={styles.container} pointerEvents="none">
      {flakes.map((f) => (
        <Snowflake
          key={f.id}
          flake={f}
          screenHeight={height}
          reducedMotion={reducedMotion}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  flake: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#E1F5FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
});
