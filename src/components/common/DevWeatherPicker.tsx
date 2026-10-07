import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWeatherStore } from '../../store/useWeatherStore';
import { WeatherCondition } from '../../services/weather/types';
import { useSettingsStore } from '../../store/useSettingsStore';

interface Scenario {
  id: string;
  labelTr: string;
  labelEn: string;
  icon: string;
  condition: WeatherCondition;
  isDay: boolean;
  isGoldenHour?: boolean;
}

const SCENARIOS: Scenario[] = [
  { id: 'clear_day', labelTr: 'Açık Gündüz', labelEn: 'Clear Day', icon: 'sunny', condition: 'clear', isDay: true },
  { id: 'clear_night', labelTr: 'Açık Gece', labelEn: 'Clear Night', icon: 'moon', condition: 'clear', isDay: false },
  { id: 'golden', labelTr: 'Altın Saat', labelEn: 'Golden Hour', icon: 'partly-sunny', condition: 'clear', isDay: true, isGoldenHour: true },
  { id: 'clouds', labelTr: 'Bulutlu', labelEn: 'Clouds', icon: 'cloud', condition: 'clouds', isDay: true },
  { id: 'rain', labelTr: 'Yağmur', labelEn: 'Rain', icon: 'rainy', condition: 'rain', isDay: true },
  { id: 'storm', labelTr: 'Fırtına', labelEn: 'Storm', icon: 'thunderstorm', condition: 'thunderstorm', isDay: false },
  { id: 'snow', labelTr: 'Kar', labelEn: 'Snow', icon: 'snow', condition: 'snow', isDay: true },
  { id: 'fog', labelTr: 'Sis', labelEn: 'Fog', icon: 'reorder-three', condition: 'fog', isDay: true },
];

export const DevWeatherPicker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const lang = useSettingsStore((s) => s.lang);
  const {
    devConditionOverride,
    devIsDayOverride,
    devIsGoldenHourOverride,
    setDevOverride,
    resetDevOverride,
  } = useWeatherStore();

  const hasOverride = devConditionOverride !== null;

  return (
    <View style={styles.container}>
      {/* Floating Toggle Bar */}
      <TouchableOpacity
        style={[styles.toggleBar, hasOverride && styles.toggleBarActive]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}
        accessibilityLabel="Geliştirici Hava Simülatörü"
      >
        <Ionicons name="flask-outline" size={16} color="#FFE082" />
        <Text style={styles.toggleText}>
          {lang === 'tr' ? 'Hava Simülatörü' : 'Weather Simulator'}
          {hasOverride ? ' (Aktif)' : ''}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="rgba(255, 255, 255, 0.7)"
        />
      </TouchableOpacity>

      {/* Expanded Scenario Buttons */}
      {isOpen && (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>
              {lang === 'tr' ? 'Hava Durumu Senaryosu Test Et:' : 'Test Weather Scenario:'}
            </Text>
            {hasOverride && (
              <TouchableOpacity onPress={resetDevOverride} style={styles.resetBtn}>
                <Ionicons name="refresh" size={12} color="#81D4FA" />
                <Text style={styles.resetBtnText}>
                  {lang === 'tr' ? 'Orijinale Dön' : 'Reset'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenarioList}
          >
            {SCENARIOS.map((sc) => {
              const isSelected =
                devConditionOverride === sc.condition &&
                devIsDayOverride === sc.isDay &&
                (sc.isGoldenHour ? devIsGoldenHourOverride : !devIsGoldenHourOverride);

              return (
                <TouchableOpacity
                  key={sc.id}
                  style={[styles.scenarioChip, isSelected && styles.scenarioChipActive]}
                  onPress={() =>
                    setDevOverride(sc.condition, sc.isDay, sc.isGoldenHour ?? false)
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={sc.icon as any}
                    size={14}
                    color={isSelected ? '#FFFFFF' : '#FFD54F'}
                  />
                  <Text
                    style={[
                      styles.scenarioText,
                      isSelected && styles.scenarioTextActive,
                    ]}
                  >
                    {lang === 'tr' ? sc.labelTr : sc.labelEn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  toggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 224, 130, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 6,
    alignSelf: 'center',
  },
  toggleBarActive: {
    backgroundColor: 'rgba(255, 160, 0, 0.25)',
    borderColor: '#FFA000',
  },
  toggleText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  panel: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 12,
    marginTop: 6,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  panelTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(2, 136, 209, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 11,
    color: '#81D4FA',
    fontWeight: '700',
  },
  scenarioList: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  scenarioChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  scenarioChipActive: {
    backgroundColor: '#0288D1',
    borderColor: '#4FC3F7',
  },
  scenarioText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  scenarioTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
