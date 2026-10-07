import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CurrentWeather } from '../../services/weather/types';
import { GlassCard } from '../common/GlassCard';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { formatTemperature, convertTemperature } from '../../utils/unitConverter';
import { useSettingsStore } from '../../store/useSettingsStore';
import { CountUpText } from '../common/CountUpText';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather }) => {
  const tempUnit = useSettingsStore((s) => s.tempUnit);
  const lang = useSettingsStore((s) => s.lang);

  const numericTemp = convertTemperature(weather.temperature, tempUnit);
  const tempSuffix = tempUnit === 'fahrenheit' ? '°F' : '°C';
  const formattedFeelsLike = formatTemperature(weather.feelsLike, tempUnit);
  const formattedMin = formatTemperature(weather.tempMin, tempUnit);
  const formattedMax = formatTemperature(weather.tempMax, tempUnit);

  return (
    <GlassCard style={styles.card} variant="highlight">
      <View style={styles.contentRow}>
        <View style={styles.leftCol}>
          <CountUpText
            target={numericTemp}
            suffix={tempSuffix}
            style={styles.temperature}
          />
          <Text style={styles.conditionText}>{weather.description}</Text>
          
          <View style={styles.detailsRow}>
            <Text style={styles.feelsLike}>
              {lang === 'tr' ? 'Hissedilen' : 'Feels like'} {formattedFeelsLike}
            </Text>
          </View>

          <View style={styles.minMaxRow}>
            <View style={styles.minMaxItem}>
              <Text style={styles.arrowIcon}>↓</Text>
              <Text style={styles.minMaxText}>{formattedMin}</Text>
            </View>
            <View style={styles.minMaxDivider} />
            <View style={styles.minMaxItem}>
              <Text style={styles.arrowIcon}>↑</Text>
              <Text style={styles.minMaxText}>{formattedMax}</Text>
            </View>
          </View>
        </View>

        <View style={styles.iconCol}>
          <AnimatedWeatherIcon
            condition={weather.condition}
            isDay={weather.isDay}
            size={110}
          />
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    flex: 1,
    paddingRight: 8,
  },
  temperature: {
    fontSize: 58,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 2,
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.78)',
    fontWeight: '500',
  },
  minMaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  minMaxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowIcon: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
  },
  minMaxText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  minMaxDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 8,
  },
  iconCol: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
