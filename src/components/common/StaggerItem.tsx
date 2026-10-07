import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface StaggerItemProps {
  index: number;
  delayStep?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  index,
  delayStep = 90,
  children,
  style,
}) => {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(reducedMotion ? 1 : 0);
  const translateY = useSharedValue(reducedMotion ? 0 : 28);

  useEffect(() => {
    if (reducedMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const delay = index * delayStep;
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 550, easing: Easing.out(Easing.cubic) })
    );
  }, [index, delayStep, reducedMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
