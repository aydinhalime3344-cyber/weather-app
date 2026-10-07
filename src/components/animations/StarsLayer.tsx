import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface StarData {
  id: number;
  xPercent: number;
  yPercent: number;
  size: number;
  delay: number;
  duration: number;
}

const Star: React.FC<{ star: StarData; reducedMotion?: boolean }> = ({ star, reducedMotion }) => {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 0.6;
      return;
    }
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: star.duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.15, { duration: star.duration, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    top: `${star.yPercent}%`,
    left: `${star.xPercent}%`,
    width: star.size,
    height: star.size,
    borderRadius: star.size / 2,
  }));

  return <Animated.View style={[styles.star, style]} />;
};

export const StarsLayer: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const { width } = useWindowDimensions();
  const starCount = Platform.OS === 'web' && width > 768 ? 40 : 25;

  // Generate pseudo-random deterministic stars
  const stars = useMemo<StarData[]>(() => {
    const list: StarData[] = [];
    for (let i = 0; i < starCount; i++) {
      // Avoid placing stars right behind the header or moon
      const xPercent = (i * 37 + 13) % 94 + 3;
      const yPercent = (i * 43 + 7) % 75 + 5;
      const size = (i % 3) + 1.8;
      const delay = (i * 220) % 2500;
      const duration = 1200 + (i % 4) * 500;

      list.push({ id: i, xPercent, yPercent, size, delay, duration });
    }
    return list;
  }, [starCount]);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Stars */}
      {stars.map((s) => (
        <Star key={s.id} star={s} reducedMotion={reducedMotion} />
      ))}

      {/* Glowing Moon in upper right */}
      <View style={styles.moonWrap}>
        <Svg width={64} height={64} viewBox="0 0 100 100">
          <Defs>
            <SvgLinearGradient id="bgMoonGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#FFFDE7" stopOpacity="0.85" />
              <Stop offset="100%" stopColor="#FFF59D" stopOpacity="0.3" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M65,15 C42,15 25,32 25,55 C25,78 42,92 65,92 C52,85 45,72 45,55 C45,38 52,24 65,15 Z"
            fill="url(#bgMoonGrad)"
          />
        </Svg>
      </View>
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
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
  },
  moonWrap: {
    position: 'absolute',
    top: 36,
    right: 28,
    opacity: 0.7,
  },
});
