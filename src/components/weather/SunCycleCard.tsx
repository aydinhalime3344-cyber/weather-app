import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { GlassCard } from '../common/GlassCard';
import { formatTime } from '../../utils/dateUtils';
import { useSettingsStore } from '../../store/useSettingsStore';

interface SunCycleCardProps {
  sunrise: number; // unix timestamp in seconds
  sunset: number;  // unix timestamp in seconds
  currentDt?: number;
}

export const SunCycleCard: React.FC<SunCycleCardProps> = ({
  sunrise,
  sunset,
  currentDt,
}) => {
  const lang = useSettingsStore((s) => s.lang);
  const now = currentDt || Math.floor(Date.now() / 1000);

  const formattedSunrise = formatTime(sunrise);
  const formattedSunset = formatTime(sunset);

  // Compute progress of the sun across the day (0 = sunrise, 1 = sunset)
  let progress = 0;
  if (now <= sunrise) {
    progress = 0;
  } else if (now >= sunset) {
    progress = 1;
  } else {
    progress = (now - sunrise) / (sunset - sunrise);
  }

  // Sun coordinate on semicircle arc
  // Radius R = 50, Center cx = 70, cy = 60
  // Angle theta goes from PI (left, sunrise) to 0 (right, sunset)
  const cx = 70;
  const cy = 60;
  const r = 45;
  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  const isDay = now >= sunrise && now <= sunset;

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>
        {lang === 'tr' ? 'GÜNEŞ DÖNGÜSÜ' : 'SUN CYCLE'}
      </Text>

      <View style={styles.arcContainer}>
        <Svg width={140} height={70} viewBox="0 0 140 70">
          <Defs>
            <SvgLinearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFA000" stopOpacity="0.4" />
              <Stop offset="0.5" stopColor="#FFEB3B" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#FF7043" stopOpacity="0.4" />
            </SvgLinearGradient>
          </Defs>

          {/* Semicircle Dashed Arc */}
          <Path
            d="M 25 60 A 45 45 0 0 1 115 60"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="3"
            strokeDasharray="4,4"
          />

          {/* Horizon Line */}
          <Line
            x1="10"
            y1="60"
            x2="130"
            y2="60"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
          />

          {/* Sun Body at current position */}
          <Circle
            cx={sunX}
            cy={sunY}
            r="7"
            fill={isDay ? '#FFD54F' : '#90A4AE'}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        </Svg>
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>
            {lang === 'tr' ? 'Doğuş' : 'Sunrise'}
          </Text>
          <Text style={styles.timeValue}>{formattedSunrise}</Text>
        </View>

        <View style={[styles.timeItem, { alignItems: 'flex-end' }]}>
          <Text style={styles.timeLabel}>
            {lang === 'tr' ? 'Batış' : 'Sunset'}
          </Text>
          <Text style={styles.timeValue}>{formattedSunset}</Text>
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
  arcContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeItem: {},
  timeLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
});
