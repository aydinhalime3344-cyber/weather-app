import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const CloudsLayer: React.FC<{ reducedMotion?: boolean }> = ({ reducedMotion }) => {
  const { width } = useWindowDimensions();

  // Parallax layers
  const slowOffset = useSharedValue(0);
  const fastOffset = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;

    slowOffset.value = withRepeat(
      withTiming(width, { duration: 42000, easing: Easing.linear }),
      -1,
      false
    );

    fastOffset.value = withRepeat(
      withTiming(width, { duration: 26000, easing: Easing.linear }),
      -1,
      false
    );
  }, [width, reducedMotion]);

  const slowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slowOffset.value - width }],
  }));

  const fastStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: fastOffset.value - width }],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background Slower Cloud Layer */}
      <Animated.View style={[styles.cloudRow, { top: 60, opacity: 0.22 }, slowStyle]}>
        <CloudSvg width={260} height={110} color="#FFFFFF" />
        <View style={{ width: 140 }} />
        <CloudSvg width={320} height={130} color="#CFD8DC" />
        <View style={{ width: 160 }} />
        <CloudSvg width={260} height={110} color="#FFFFFF" />
      </Animated.View>

      {/* Foreground Faster Cloud Layer */}
      <Animated.View style={[styles.cloudRow, { top: 160, opacity: 0.35 }, fastStyle]}>
        <CloudSvg width={340} height={140} color="#ECEFF1" />
        <View style={{ width: 100 }} />
        <CloudSvg width={280} height={120} color="#FFFFFF" />
        <View style={{ width: 120 }} />
        <CloudSvg width={340} height={140} color="#ECEFF1" />
      </Animated.View>
    </View>
  );
};

const CloudSvg: React.FC<{ width: number; height: number; color: string }> = ({
  width,
  height,
  color,
}) => (
  <Svg width={width} height={height} viewBox="0 0 100 50">
    <Defs>
      <SvgLinearGradient id={`cloudG_${width}`} x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={color} stopOpacity="0.9" />
        <Stop offset="100%" stopColor={color} stopOpacity="0.4" />
      </SvgLinearGradient>
    </Defs>
    <Path
      d="M20,40 A15,15 0 0,1 25,18 A22,22 0 0,1 68,14 A18,18 0 0,1 86,30 A12,12 0 0,1 80,42 Z"
      fill={`url(#cloudG_${width})`}
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  cloudRow: {
    position: 'absolute',
    flexDirection: 'row',
    width: 3000,
  },
});
