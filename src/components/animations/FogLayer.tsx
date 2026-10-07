import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const FogLayer: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const { width } = useWindowDimensions();

  const fogOffset1 = useSharedValue(0);
  const fogOffset2 = useSharedValue(0);
  const opacityPulse = useSharedValue(0.4);

  useEffect(() => {
    if (reducedMotion) return;

    fogOffset1.value = withRepeat(
      withTiming(width * 0.4, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    fogOffset2.value = withRepeat(
      withTiming(-width * 0.35, { duration: 22000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    opacityPulse.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [width, reducedMotion]);

  const style1 = useAnimatedStyle(() => ({
    transform: [{ translateX: fogOffset1.value }],
    opacity: opacityPulse.value,
  }));

  const style2 = useAnimatedStyle(() => ({
    transform: [{ translateX: fogOffset2.value }],
    opacity: 0.5,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Fog Band 1 (Top-Mid) */}
      <Animated.View style={[styles.fogBand, { top: 90 }, style1]}>
        <Svg width={width * 1.8} height={180}>
          <Defs>
            <SvgLinearGradient id="fogG1" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#B0BEC5" stopOpacity="0.05" />
              <Stop offset="50%" stopColor="#ECEFF1" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#B0BEC5" stopOpacity="0.05" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width={width * 1.8} height="180" fill="url(#fogG1)" />
        </Svg>
      </Animated.View>

      {/* Fog Band 2 (Mid-Bottom) */}
      <Animated.View style={[styles.fogBand, { top: 280 }, style2]}>
        <Svg width={width * 1.8} height={220}>
          <Defs>
            <SvgLinearGradient id="fogG2" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#CFD8DC" stopOpacity="0.08" />
              <Stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.32" />
              <Stop offset="100%" stopColor="#CFD8DC" stopOpacity="0.08" />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="0" width={width * 1.8} height="220" fill="url(#fogG2)" />
        </Svg>
      </Animated.View>
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
  fogBand: {
    position: 'absolute',
    left: -100,
  },
});
