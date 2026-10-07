import React, { useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  Text,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWeatherQuery } from '../../src/hooks/useWeatherQuery';
import { useUserLocation } from '../../src/hooks/useUserLocation';
import { useWeatherStore } from '../../src/store/useWeatherStore';
import { DynamicBackground } from '../../src/components/animations/DynamicBackground';
import { ApiKeyBanner } from '../../src/components/banner/ApiKeyBanner';
import { DevWeatherPicker } from '../../src/components/common/DevWeatherPicker';
import { WeatherHeader } from '../../src/components/weather/WeatherHeader';
import { CurrentWeatherCard } from '../../src/components/weather/CurrentWeatherCard';
import { HourlyForecastSection } from '../../src/components/weather/HourlyForecastSection';
import { DailyForecastAccordion } from '../../src/components/weather/DailyForecastAccordion';
import { WeatherDetailGrid } from '../../src/components/weather/WeatherDetailGrid';
import { ErrorStateView, ErrorType } from '../../src/components/common/ErrorStateView';
import { SkeletonScreen } from '../../src/components/common/SkeletonCard';
import { StaggerItem } from '../../src/components/common/StaggerItem';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { WeatherCondition } from '../../src/services/weather/types';

export default function WeatherHomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const lang = useSettingsStore((s) => s.lang);
  const { error: locError, errorMessage: locErrorMsg } = useUserLocation();
  const { data, isLoading, isError, error, isFetching, refetch } = useWeatherQuery();

  const devConditionOverride = useWeatherStore((s) => s.devConditionOverride);
  const devIsDayOverride = useWeatherStore((s) => s.devIsDayOverride);
  const devIsGoldenHourOverride = useWeatherStore((s) => s.devIsGoldenHourOverride);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Determine error type for friendly display
  const getErrorType = (): ErrorType => {
    if (locError === 'PERMISSION_DENIED') return 'PERMISSION_DENIED';
    if (!error) return 'GENERIC';
    const msg = error.message || '';
    if (msg.includes('401') || msg.includes('Geçersiz API')) return 'API_401';
    if (msg.includes('429') || msg.includes('limit')) return 'API_429';
    if (msg.includes('bağlantı') || msg.includes('Network')) return 'OFFLINE';
    return 'GENERIC';
  };

  // Weather condition with Dev override support
  const activeCondition: WeatherCondition =
    (devConditionOverride as WeatherCondition) ||
    data?.current?.condition ||
    'clear';

  const activeIsDay: boolean =
    devIsDayOverride !== null ? devIsDayOverride : data?.current?.isDay ?? true;

  const activeIsGoldenHour: boolean = devIsGoldenHourOverride ?? false;

  return (
    <DynamicBackground
      condition={activeCondition}
      isDay={activeIsDay}
      sunrise={data?.current?.sunrise}
      sunset={data?.current?.sunset}
      currentDt={data?.current?.dt}
      isGoldenHour={activeIsGoldenHour}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Sticky / Top API Key Banner */}
        <ApiKeyBanner />

        {/* Developer Weather Simulator (Active in mock mode or for testing) */}
        <DevWeatherPicker />

        {/* Offline cache notice banner if applicable */}
        {data && data.updatedAt && data.updatedAt.includes('Çevrimdışı') && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerText}>
              📶 {lang === 'tr' ? 'Çevrimdışı Mod:' : 'Offline Mode:'} Son güncelleme {data.updatedAt}
            </Text>
          </View>
        )}

        {/* Initial Loading Skeleton Shimmer */}
        {isLoading && !data && <SkeletonScreen />}

        {/* Error State with No Cached Data */}
        {!isLoading && isError && !data && (
          <ScrollView
            contentContainerStyle={styles.centerScroll}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                tintColor="#FFFFFF"
              />
            }
          >
            <ErrorStateView
              type={getErrorType()}
              message={error?.message || locErrorMsg || undefined}
              onRetry={handleRefresh}
              onSearchCity={() => router.push('/cities')}
            />
          </ScrollView>
        )}

        {/* Successful Data Presentation */}
        {data && (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={handleRefresh}
                tintColor="#FFFFFF"
                colors={['#0288D1']}
              />
            }
          >
            <View style={[styles.mainWrapper, isWide && styles.wideMainWrapper]}>
              {/* Header Area */}
              <StaggerItem index={0}>
                <WeatherHeader
                  cityName={data.current.location.name}
                  country={data.current.location.country}
                  isFetching={isFetching}
                  onRefresh={handleRefresh}
                />
              </StaggerItem>

              {/* Responsive Layout */}
              {isWide ? (
                /* Two-Column Tablet / Web Wide Layout */
                <View style={styles.twoColRow}>
                  {/* Left Column: Hero Card & Hourly Forecast */}
                  <View style={styles.columnLeft}>
                    <StaggerItem index={1}>
                      <CurrentWeatherCard
                        weather={{
                          ...data.current,
                          condition: activeCondition,
                          isDay: activeIsDay,
                        }}
                      />
                    </StaggerItem>
                    <StaggerItem index={2}>
                      <HourlyForecastSection hourly={data.hourly} />
                    </StaggerItem>
                  </View>

                  {/* Right Column: 5-Day Accordion & Details Grid */}
                  <View style={styles.columnRight}>
                    <StaggerItem index={3}>
                      <DailyForecastAccordion daily={data.daily} />
                    </StaggerItem>
                    <StaggerItem index={4}>
                      <WeatherDetailGrid weather={data.current} />
                    </StaggerItem>
                  </View>
                </View>
              ) : (
                /* Single-Column Mobile Layout */
                <>
                  <StaggerItem index={1}>
                    <CurrentWeatherCard
                      weather={{
                        ...data.current,
                        condition: activeCondition,
                        isDay: activeIsDay,
                      }}
                    />
                  </StaggerItem>

                  <StaggerItem index={2}>
                    <HourlyForecastSection hourly={data.hourly} />
                  </StaggerItem>

                  <StaggerItem index={3}>
                    <DailyForecastAccordion daily={data.daily} />
                  </StaggerItem>

                  <StaggerItem index={4}>
                    <WeatherDetailGrid weather={data.current} />
                  </StaggerItem>
                </>
              )}

              {/* Footer Status */}
              <StaggerItem index={5}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    {lang === 'tr' ? 'Son Güncelleme' : 'Last Updated'}: {data.updatedAt}
                  </Text>
                  {data.isMock && (
                    <Text style={styles.footerMockNotice}>
                      {lang === 'tr'
                        ? '• OpenWeatherMap Mock Veri Modu Aktif •'
                        : '• OpenWeatherMap Mock Data Mode Active •'}
                    </Text>
                  )}
                </View>
              </StaggerItem>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  mainWrapper: {
    width: '100%',
  },
  wideMainWrapper: {
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  columnLeft: {
    flex: 1.1,
  },
  columnRight: {
    flex: 1,
  },
  centerScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  offlineBanner: {
    backgroundColor: 'rgba(239, 83, 80, 0.25)',
    borderColor: 'rgba(239, 83, 80, 0.6)',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#FFCDD2',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    opacity: 0.7,
  },
  footerText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  footerMockNotice: {
    fontSize: 11,
    color: '#FFE082',
    marginTop: 4,
    fontWeight: '600',
  },
});
