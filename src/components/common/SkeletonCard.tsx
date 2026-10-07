import React, { useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from './GlassCard';

export const SkeletonCard: React.FC<{ height?: number; style?: any }> = ({
  height = 160,
  style,
}) => {
  const { width } = useWindowDimensions();
  const shimmerTranslate = useSharedValue(-width);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(width * 1.5, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, [width]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  return (
    <GlassCard style={[styles.card, { height }, style]}>
      <View style={styles.contentWrap}>
        <View style={styles.boneLarge} />
        <View style={styles.boneMedium} />
        <View style={styles.boneSmall} />
      </View>

      <Animated.View style={[styles.shimmerSweep, shimmerStyle]} />
    </GlassCard>
  );
};

export const SkeletonScreen: React.FC = () => {
  return (
    <View style={styles.screenContainer}>
      {/* Header skeleton */}
      <View style={styles.headerBone} />
      {/* Hero card skeleton */}
      <SkeletonCard height={180} />
      {/* Hourly skeleton */}
      <SkeletonCard height={130} />
      {/* Daily accordion skeleton */}
      <SkeletonCard height={240} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    gap: 16,
  },
  headerBone: {
    height: 36,
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    marginBottom: 4,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  contentWrap: {
    gap: 12,
  },
  boneLarge: {
    height: 48,
    width: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 12,
  },
  boneMedium: {
    height: 20,
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
  },
  boneSmall: {
    height: 16,
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  shimmerSweep: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
});
