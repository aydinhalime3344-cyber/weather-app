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

interface RainDropData {
  id: number;
  xPercent: number;
  length: number;
  duration: number;
  delay: number;
}

const RainDrop: React.FC<{ drop: RainDropData; screenHeight: number; reducedMotion?: boolean }> = ({
  drop,
  screenHeight,
  reducedMotion,
}) => {
  const translateY = useSharedValue(-drop.length - 20);

  useEffect(() => {
    if (reducedMotion) return;

    translateY.value = withDelay(
      drop.delay,
      withRepeat(
        withTiming(screenHeight + 30, {
          duration: drop.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, [screenHeight, reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: '12deg' }],
    left: `${drop.xPercent}%`,
    height: drop.length,
  }));

  return <Animated.View style={[styles.drop, style]} />;
};

export const RainLayer: React.FC<{ isThunderstorm?: boolean; reducedMotion?: boolean }> = ({
  isThunderstorm = false,
  reducedMotion,
}) => {
  const { width, height } = useWindowDimensions();
  const flashOpacity = useSharedValue(0);

  const dropCount = Platform.OS === 'web' && width > 768 ? 36 : 22;

  const drops = useMemo<RainDropData[]>(() => {
    const list: RainDropData[] = [];
    for (let i = 0; i < dropCount; i++) {
      const xPercent = (i * 17 + 5) % 96 + 2;
      const length = 16 + (i % 5) * 6;
      const duration = 650 + (i % 6) * 110;
      const delay = (i * 110) % 900;
      list.push({ id: i, xPercent, length, duration, delay });
    }
    return list;
  }, [dropCount]);

  useEffect(() => {
    if (!isThunderstorm || reducedMotion) {
      flashOpacity.value = 0;
      return;
    }

    // Intermittent realistic lightning flash
    flashOpacity.value = withRepeat(
      withSequence(
        withDelay(
          3500,
          withSequence(
            withTiming(0.7, { duration: 80, easing: Easing.linear }),
            withTiming(0.1, { duration: 60, easing: Easing.linear }),
            withTiming(0.95, { duration: 110, easing: Easing.linear }),
            withTiming(0, { duration: 350, easing: Easing.out(Easing.quad) })
          )
        )
      ),
      -1,
      false
    );
  }, [isThunderstorm, reducedMotion]);

  const lightningStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Lightning Flash Backdrop */}
      {isThunderstorm && (
        <Animated.View style={[styles.lightningOverlay, lightningStyle]} />
      )}

      {/* Falling Raindrops */}
      {drops.map((d) => (
        <RainDrop
          key={d.id}
          drop={d}
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
  drop: {
    position: 'absolute',
    top: 0,
    width: 1.8,
    backgroundColor: 'rgba(179, 229, 252, 0.65)',
    borderRadius: 1,
  },
  lightningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
});
