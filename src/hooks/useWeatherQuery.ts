import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWeatherStore } from '../store/useWeatherStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getWeatherProvider, isMockMode } from '../services/weather';
import { CompleteWeatherData } from '../services/weather/types';
import { formatTime } from '../utils/dateUtils';

const CACHE_PREFIX = '@weather_cache_v1_';

export function useWeatherQuery() {
  const activeLocation = useWeatherStore((s) => s.activeLocation);
  const lang = useSettingsStore((s) => s.lang);
  const setLastUpdated = useWeatherStore((s) => s.setLastUpdated);

  const cacheKey = `${CACHE_PREFIX}${activeLocation.lat.toFixed(2)}_${activeLocation.lon.toFixed(2)}`;

  return useQuery<CompleteWeatherData, Error>({
    queryKey: ['weather', activeLocation.lat, activeLocation.lon, lang],
    queryFn: async () => {
      const provider = getWeatherProvider();
      const coords = { lat: activeLocation.lat, lon: activeLocation.lon };

      try {
        const [current, forecast] = await Promise.all([
          provider.getCurrentWeather(coords, lang),
          provider.getForecast(coords, lang),
        ]);

        // Always keep active location's custom name if user chose a specific named city
        if (activeLocation.name) {
          current.location.name = activeLocation.name;
        }

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;

        const completeData: CompleteWeatherData = {
          current,
          hourly: forecast.hourly,
          daily: forecast.daily,
          isMock: isMockMode(),
          updatedAt: timeStr,
        };

        // Cache successful response to AsyncStorage
        await AsyncStorage.setItem(cacheKey, JSON.stringify(completeData)).catch(
          console.error
        );
        setLastUpdated(timeStr);

        return completeData;
      } catch (err: any) {
        // Fallback: try reading from offline AsyncStorage cache
        try {
          const cached = await AsyncStorage.getItem(cacheKey);
          if (cached) {
            const parsed: CompleteWeatherData = JSON.parse(cached);
            return {
              ...parsed,
              updatedAt: `${parsed.updatedAt} (Çevrimdışı)`,
            };
          }
        } catch {
          // ignore cache read error
        }

        throw err;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache freshness
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
