import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from '../common/GlassCard';
import { formatWindSpeed, getWindDirectionText } from '../../utils/unitConverter';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WindCompassCardProps {
  windSpeed: number; // m/s
  windDeg: number;   // 0-360 degrees
}

export const WindCompassCard: React.FC<WindCompassCardProps> = ({
  windSpeed,
  windDeg,
}) => {
  const windUnit = useSettingsStore((s) => s.windUnit);
  const lang = useSettingsStore((s) => s.lang);

  const rotation = useSharedValue(windDeg);

  useEffect(() => {
    rotation.value = withSpring(windDeg, { damping: 14, stiffness: 90 });
  }, [windDeg]);

  const needleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const formattedSpeed = formatWindSpeed(windSpeed, windUnit, lang);
  const directionText = getWindDirectionText(windDeg, lang);

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>
        {lang === 'tr' ? 'RÜZGAR' : 'WIND'}
      </Text>

      <View style={styles.centerContent}>
        {/* Compass Dial */}
        <View style={styles.compassContainer}>
          <Svg width={72} height={72} viewBox="0 0 100 100">
            {/* Outer Dial Circle */}
            <Circle
              cx="50"
              cy="50"
              r="44"
              fill="rgba(255, 255, 255, 0.05)"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2"
            />
            {/* Cardinal Marks */}
            <SvgText x="50" y="16" fill="#FF8A80" fontSize="11" fontWeight="800" textAnchor="middle">
              K
            </SvgText>
            <SvgText x="88" y="54" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontWeight="700" textAnchor="middle">
              D
            </SvgText>
            <SvgText x="50" y="92" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontWeight="700" textAnchor="middle">
              G
            </SvgText>
            <SvgText x="12" y="54" fill="rgba(255, 255, 255, 0.7)" fontSize="10" fontWeight="700" textAnchor="middle">
              B
            </SvgText>
          </Svg>

          {/* Animated Needle */}
          <Animated.View style={[styles.needleWrap, needleAnimatedStyle]}>
            <Svg width={72} height={72} viewBox="0 0 100 100">
              {/* North pointer (red) */}
              <Path d="M 50 18 L 44 50 L 50 44 Z" fill="#FF5252" />
              {/* South pointer (white) */}
              <Path d="M 50 82 L 44 50 L 50 44 Z" fill="rgba(255, 255, 255, 0.85)" />
              <Path d="M 50 18 L 56 50 L 50 44 Z" fill="#FF1744" />
              <Path d="M 50 82 L 56 50 L 50 44 Z" fill="rgba(255, 255, 255, 0.6)" />
              {/* Center Pivot */}
              <Circle cx="50" cy="50" r="4.5" fill="#FFFFFF" stroke="#37474F" strokeWidth="2" />
            </Svg>
          </Animated.View>
        </View>

        <View style={styles.speedInfo}>
          <Text style={styles.speedValue}>{formattedSpeed}</Text>
          <Text style={styles.directionValue}>
            {directionText} ({Math.round(windDeg)}°)
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 20,
    justifyContent: 'space-between',
    minHeight: 155,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  compassContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needleWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedInfo: {
    marginLeft: 8,
  },
  speedValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  directionValue: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
});
