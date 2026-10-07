import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CountUpTextProps {
  target: number;
  suffix?: string;
  style?: StyleProp<TextStyle>;
  durationMs?: number;
}

export const CountUpText: React.FC<CountUpTextProps> = ({
  target,
  suffix = '',
  style,
  durationMs = 900,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(target);
      return;
    }

    const startValue = 0;
    const diff = target - startValue;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * easeProgress);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [target, durationMs, reducedMotion]);

  return <Text style={style}>{`${displayValue}${suffix}`}</Text>;
};
