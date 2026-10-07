import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HourlyForecast } from '../../services/weather/types';
import { GlassCard } from '../common/GlassCard';
import { HourlyTemperatureChart } from './HourlyTemperatureChart';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { formatTemperature } from '../../utils/unitConverter';
import { useSettingsStore } from '../../store/useSettingsStore';

interface HourlyForecastSectionProps {
  hourly: HourlyForecast[];
}

export const HourlyForecastSection: React.FC<HourlyForecastSectionProps> = ({ hourly }) => {
  const tempUnit = useSettingsStore((s) => s.tempUnit);
  const lang = useSettingsStore((s) => s.lang);

  if (!hourly || hourly.length === 0) return null;

  const ITEM_WIDTH = 76;

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {lang === 'tr' ? 'Saatlik Tahmin' : 'Hourly Forecast'}
        </Text>
        <Text style={styles.subTitle}>
          {lang === 'tr' ? 'Önümüzdeki 24 Saat' : 'Next 24 Hours'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          {/* SVG Bezier Temperature Curve */}
          <HourlyTemperatureChart hourly={hourly} itemWidth={ITEM_WIDTH} height={75} />

          {/* Hourly Cards Row */}
          <View style={styles.cardsRow}>
            {hourly.map((item, index) => {
              const isNow = index === 0;
              const formattedTemp = formatTemperature(item.temp, tempUnit);
              const popPercent = Math.round(item.pop * 100);

              return (
                <View
                  key={`${item.dt}_${index}`}
                  style={[
                    styles.hourCard,
                    { width: ITEM_WIDTH },
                    isNow && styles.nowCard,
                  ]}
                >
                  {isNow ? (
                    <View style={styles.nowBadge}>
                      <Text style={styles.nowBadgeText}>
                        {lang === 'tr' ? 'ŞİMDİ' : 'NOW'}
                      </Text>
                    </View>
                  ) : (
                    <Text style={styles.timeText}>{item.time}</Text>
                  )}

                  <View style={styles.iconWrap}>
                    <AnimatedWeatherIcon
                      condition={item.condition}
                      isDay={!item.icon.endsWith('n')}
                      size={32}
                    />
                  </View>

                  <Text style={[styles.tempText, isNow && styles.nowTempText]}>
                    {formattedTemp}
                  </Text>

                  {/* Precipitation Probability */}
                  <View style={styles.popRow}>
                    {popPercent > 0 ? (
                      <Text style={styles.popText}>💧 {popPercent}%</Text>
                    ) : (
                      <Text style={styles.popPlaceholder}>-</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  cardsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  hourCard: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 16,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  nowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: '#4FC3F7',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  nowBadge: {
    backgroundColor: '#0288D1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  nowBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 2,
  },
  iconWrap: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  tempText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  nowTempText: {
    color: '#E1F5FE',
    fontSize: 15,
  },
  popRow: {
    marginTop: 4,
    minHeight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popText: {
    fontSize: 11,
    color: '#81D4FA',
    fontWeight: '600',
  },
  popPlaceholder: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
});
