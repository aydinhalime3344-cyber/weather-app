import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatCurrentDate } from '../../utils/dateUtils';

interface WeatherHeaderProps {
  cityName: string;
  country?: string;
  isFetching?: boolean;
  onRefresh?: () => void;
}

export const WeatherHeader: React.FC<WeatherHeaderProps> = ({
  cityName,
  country,
  isFetching,
  onRefresh,
}) => {
  const router = useRouter();
  const lang = useSettingsStore((s) => s.lang);
  const isUsingGps = useWeatherStore((s) => s.isUsingGps);
  const useCurrentLocation = useWeatherStore((s) => s.useCurrentLocation);
  const userLocation = useWeatherStore((s) => s.userLocation);

  const displayCity = country ? `${cityName}, ${country}` : cityName;
  const currentDateStr = formatCurrentDate(lang);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.locationInfo}>
          <View style={styles.titleRow}>
            <Ionicons
              name={isUsingGps ? 'navigate' : 'location-sharp'}
              size={22}
              color={isUsingGps ? '#4FC3F7' : '#FFFFFF'}
              style={styles.locIcon}
            />
            <Text style={styles.cityName} numberOfLines={1}>
              {displayCity}
            </Text>
          </View>
          <Text style={styles.dateText}>{currentDateStr}</Text>
        </View>

        <View style={styles.actionsRow}>
          {/* Web / Desktop manual refresh button */}
          {(Platform.OS === 'web' || onRefresh) && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onRefresh}
              disabled={isFetching}
              activeOpacity={0.7}
              accessibilityLabel="Yenile"
            >
              {isFetching ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}

          {/* Search Button */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/cities')}
            activeOpacity={0.7}
            accessibilityLabel="Şehir Ara"
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Switch to current GPS location pill if currently viewing a manual city */}
      {!isUsingGps && userLocation && (
        <TouchableOpacity
          style={styles.gpsPill}
          onPress={useCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate-circle" size={16} color="#81D4FA" />
          <Text style={styles.gpsPillText}>
            {lang === 'tr' ? 'Mevcut Konumuma Dön' : 'Switch to My Location'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 16 : 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    paddingRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locIcon: {
    marginTop: 1,
  },
  cityName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(2, 136, 209, 0.35)',
    borderColor: 'rgba(129, 212, 250, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  gpsPillText: {
    fontSize: 12,
    color: '#E1F5FE',
    fontWeight: '600',
  },
});
