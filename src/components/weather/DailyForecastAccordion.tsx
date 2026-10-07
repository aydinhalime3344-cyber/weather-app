import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyForecast } from '../../services/weather/types';
import { GlassCard } from '../common/GlassCard';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { formatTemperature, convertTemperature } from '../../utils/unitConverter';
import { useSettingsStore } from '../../store/useSettingsStore';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DailyForecastAccordionProps {
  daily: DailyForecast[];
}

export const DailyForecastAccordion: React.FC<DailyForecastAccordionProps> = ({ daily }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const tempUnit = useSettingsStore((s) => s.tempUnit);
  const lang = useSettingsStore((s) => s.lang);

  if (!daily || daily.length === 0) return null;

  // Global min and max across 5 days for normalizing range bars
  const allMins = daily.map((d) => convertTemperature(d.tempMin, tempUnit));
  const allMaxs = daily.map((d) => convertTemperature(d.tempMax, tempUnit));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalSpan = Math.max(globalMax - globalMin, 1);

  const toggleExpand = (dateKey: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedDate((curr) => (curr === dateKey ? null : dateKey));
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {lang === 'tr' ? '5 Günlük Tahmin' : '5-Day Forecast'}
        </Text>
        <Text style={styles.hint}>
          {lang === 'tr' ? 'Detaylar için dokunun' : 'Tap for details'}
        </Text>
      </View>

      <View style={styles.list}>
        {daily.map((item, index) => {
          const isExpanded = expandedDate === item.date;
          const minTemp = convertTemperature(item.tempMin, tempUnit);
          const maxTemp = convertTemperature(item.tempMax, tempUnit);
          const popPercent = Math.round(item.pop * 100);

          // Calculate bar offsets relative to 5-day span
          const leftPercent = Math.max(0, ((minTemp - globalMin) / globalSpan) * 100);
          const barWidthPercent = Math.max(15, (((maxTemp - minTemp) / globalSpan) * 100));

          return (
            <View key={item.date} style={styles.dayItemWrapper}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => toggleExpand(item.date)}
                style={styles.dayRow}
              >
                {/* Day Name */}
                <View style={styles.dayNameCol}>
                  <Text style={styles.dayName}>{item.dayName}</Text>
                  <Text style={styles.dateSubText}>
                    {item.date.split('-').slice(1).join('/')}
                  </Text>
                </View>

                {/* Weather Icon */}
                <View style={styles.iconCol}>
                  <AnimatedWeatherIcon
                    condition={item.condition}
                    isDay={true}
                    size={28}
                  />
                </View>

                {/* Pop */}
                <View style={styles.popCol}>
                  {popPercent > 0 ? (
                    <Text style={styles.popText}>💧 {popPercent}%</Text>
                  ) : (
                    <Text style={styles.popMuted}>-</Text>
                  )}
                </View>

                {/* Temperature Range Bar */}
                <View style={styles.barCol}>
                  <Text style={styles.minTempLabel}>
                    {formatTemperature(item.tempMin, tempUnit)}
                  </Text>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.rangeBar,
                        {
                          left: `${leftPercent}%`,
                          width: `${Math.min(100 - leftPercent, barWidthPercent)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.maxTempLabel}>
                    {formatTemperature(item.tempMax, tempUnit)}
                  </Text>
                </View>

                {/* Chevron */}
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="rgba(255, 255, 255, 0.6)"
                  style={styles.chevron}
                />
              </TouchableOpacity>

              {/* Expanded Accordion Details */}
              {isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.expandedDesc}>{item.description}</Text>
                  <View style={styles.subGrid}>
                    <View style={styles.subDetail}>
                      <Text style={styles.subDetailLabel}>
                        {lang === 'tr' ? 'Nem' : 'Humidity'}
                      </Text>
                      <Text style={styles.subDetailValue}>%{item.humidity}</Text>
                    </View>
                    <View style={styles.subDetail}>
                      <Text style={styles.subDetailLabel}>
                        {lang === 'tr' ? 'Rüzgar' : 'Wind'}
                      </Text>
                      <Text style={styles.subDetailValue}>{item.windSpeed} m/s</Text>
                    </View>
                    <View style={styles.subDetail}>
                      <Text style={styles.subDetailLabel}>
                        {lang === 'tr' ? 'Yağış İhtimali' : 'Rain Chance'}
                      </Text>
                      <Text style={styles.subDetailValue}>%{popPercent}</Text>
                    </View>
                  </View>

                  {/* Hourly snapshot if available */}
                  {item.hourlyDetails && item.hourlyDetails.length > 0 && (
                    <View style={styles.hourSegmentsRow}>
                      {item.hourlyDetails.map((h, hIdx) => (
                        <View key={hIdx} style={styles.hourSegment}>
                          <Text style={styles.segmentTime}>{h.time}</Text>
                          <AnimatedWeatherIcon condition={h.condition} size={22} />
                          <Text style={styles.segmentTemp}>
                            {formatTemperature(h.temp, tempUnit)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {index < daily.length - 1 && <View style={styles.divider} />}
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  list: {},
  dayItemWrapper: {},
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayNameCol: {
    width: 80,
  },
  dayName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateSubText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 1,
  },
  iconCol: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popCol: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#81D4FA',
  },
  popMuted: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  barCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  minTempLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  rangeBar: {
    position: 'absolute',
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFB74D',
  },
  maxTempLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    width: 36,
    textAlign: 'left',
  },
  chevron: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  expandedContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 8,
  },
  expandedDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0F7FA',
    marginBottom: 8,
  },
  subGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subDetail: {
    flex: 1,
  },
  subDetailLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  subDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  hourSegmentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  hourSegment: {
    alignItems: 'center',
    gap: 2,
  },
  segmentTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  segmentTemp: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
