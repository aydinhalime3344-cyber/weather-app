import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SunRaysLayerProps {
  reducedMotion?: boolean;
}

export const SunRaysLayer: React.FC<SunRaysLayerProps> = ({ reducedMotion }) => {
  const { width, height } = useWindowDimensions();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    rotation.value = withRepeat(
      withTiming(360, { duration: 50000, easing: Easing.linear }),
      -1,
      false
    );
  }, [reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const size = Math.max(width, height) * 1.5;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.rotator,
          { width: size, height: size, top: -size * 0.35, right: -size * 0.35 },
          animatedStyle,
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 400 400">
          <Defs>
            <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.45" />
              <Stop offset="50%" stopColor="#FFE082" stopOpacity="0.18" />
              <Stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* 8 Soft Sun Rays */}
          <G fill="url(#sunGlow)">
            <Path d="M 200 200 L 175 0 L 225 0 Z" />
            <Path d="M 200 200 L 375 25 L 400 75 Z" />
            <Path d="M 200 200 L 400 175 L 400 225 Z" />
            <Path d="M 200 200 L 375 375 L 325 400 Z" />
            <Path d="M 200 200 L 175 400 L 225 400 Z" />
            <Path d="M 200 200 L 25 375 L 0 325 Z" />
            <Path d="M 200 200 L 0 175 L 0 225 Z" />
            <Path d="M 200 200 L 25 25 L 75 0 Z" />
          </G>
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
  rotator: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
