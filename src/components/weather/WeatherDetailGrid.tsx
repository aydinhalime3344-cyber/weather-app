import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CurrentWeather } from '../../services/weather/types';
import { GlassCard } from '../common/GlassCard';
import { WindCompassCard } from './WindCompassCard';
import { SunCycleCard } from './SunCycleCard';
import { useSettingsStore } from '../../store/useSettingsStore';

interface WeatherDetailGridProps {
  weather: CurrentWeather;
}

export const WeatherDetailGrid: React.FC<WeatherDetailGridProps> = ({ weather }) => {
  const lang = useSettingsStore((s) => s.lang);

  const visibilityKm = (weather.visibility / 1000).toFixed(1);
  const visibilityText =
    weather.visibility >= 10000
      ? lang === 'tr'
        ? 'Görüş mükemmel'
        : 'Perfect visibility'
      : weather.visibility >= 5000
      ? lang === 'tr'
        ? 'Görüş iyi'
        : 'Good visibility'
      : lang === 'tr'
      ? 'Kısıtlı görüş'
      : 'Reduced visibility';

  const pressureStatus =
    weather.pressure >= 1013
      ? lang === 'tr'
        ? 'Standart / Yüksek'
        : 'Standard / High'
      : lang === 'tr'
      ? 'Düşük basınç'
      : 'Low pressure';

  const uvLevelText = (uv: number) => {
    if (uv <= 2) return lang === 'tr' ? 'Düşük' : 'Low';
    if (uv <= 5) return lang === 'tr' ? 'Orta' : 'Moderate';
    if (uv <= 7) return lang === 'tr' ? 'Yüksek' : 'High';
    return lang === 'tr' ? 'Çok Yüksek' : 'Very High';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {lang === 'tr' ? 'Hava Koşulları Detayları' : 'Weather Details'}
      </Text>

      {/* Row 1: Wind Compass & Sun Cycle */}
      <View style={styles.gridRow}>
        <View style={styles.col}>
          <WindCompassCard windSpeed={weather.windSpeed} windDeg={weather.windDeg} />
        </View>
        <View style={styles.col}>
          <SunCycleCard
            sunrise={weather.sunrise}
            sunset={weather.sunset}
            currentDt={weather.dt}
          />
        </View>
      </View>

      {/* Row 2: Humidity & Pressure */}
      <View style={styles.gridRow}>
        <View style={styles.col}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="water-outline" size={16} color="#81D4FA" />
              <Text style={styles.cardTitle}>{lang === 'tr' ? 'NEM' : 'HUMIDITY'}</Text>
            </View>
            <Text style={styles.cardBigVal}>%{weather.humidity}</Text>
            <Text style={styles.cardDesc}>
              {weather.humidity > 65
                ? lang === 'tr'
                  ? 'Nemli hava'
                  : 'Humid'
                : lang === 'tr'
                ? 'Konforlu seviye'
                : 'Comfortable'}
            </Text>
          </GlassCard>
        </View>

        <View style={styles.col}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="speedometer-outline" size={16} color="#FFE082" />
              <Text style={styles.cardTitle}>{lang === 'tr' ? 'BASINÇ' : 'PRESSURE'}</Text>
            </View>
            <Text style={styles.cardBigVal}>{weather.pressure} hPa</Text>
            <Text style={styles.cardDesc}>{pressureStatus}</Text>
          </GlassCard>
        </View>
      </View>

      {/* Row 3: Visibility & Clouds */}
      <View style={styles.gridRow}>
        <View style={styles.col}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="eye-outline" size={16} color="#80CBC4" />
              <Text style={styles.cardTitle}>
                {lang === 'tr' ? 'GÖRÜŞ MESAFESİ' : 'VISIBILITY'}
              </Text>
            </View>
            <Text style={styles.cardBigVal}>{visibilityKm} km</Text>
            <Text style={styles.cardDesc}>{visibilityText}</Text>
          </GlassCard>
        </View>

        <View style={styles.col}>
          <GlassCard style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cloud-outline" size={16} color="#B0BEC5" />
              <Text style={styles.cardTitle}>
                {lang === 'tr' ? 'BULUTLULUK' : 'CLOUDS'}
              </Text>
            </View>
            <Text style={styles.cardBigVal}>%{weather.clouds}</Text>
            <Text style={styles.cardDesc}>
              {weather.clouds < 20
                ? lang === 'tr'
                  ? 'Açık gökyüzü'
                  : 'Clear sky'
                : weather.clouds < 60
                ? lang === 'tr'
                  ? 'Parçalı bulut'
                  : 'Scattered'
                : lang === 'tr'
                ? 'Yoğun bulut örtüsü'
                : 'Overcast'}
            </Text>
          </GlassCard>
        </View>
      </View>

      {/* Row 4: UV Index (Conditionally rendered if available) */}
      {weather.uvIndex !== undefined && (
        <View style={styles.gridRow}>
          <View style={[styles.col, { flex: 1 }]}>
            <GlassCard style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="sunny-outline" size={16} color="#FFB74D" />
                <Text style={styles.cardTitle}>
                  {lang === 'tr' ? 'UV ENDEKSİ' : 'UV INDEX'}
                </Text>
              </View>
              <Text style={styles.cardBigVal}>{weather.uvIndex}</Text>
              <Text style={styles.cardDesc}>
                {uvLevelText(weather.uvIndex)} {lang === 'tr' ? 'korunma önerilir' : 'protection'}
              </Text>
            </GlassCard>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  card: {
    padding: 14,
    borderRadius: 20,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.6,
  },
  cardBigVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '500',
  },
});
