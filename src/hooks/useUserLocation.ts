import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { useWeatherStore } from '../store/useWeatherStore';
import { getWeatherProvider } from '../services/weather';
import { useSettingsStore } from '../store/useSettingsStore';

export type LocationErrorType =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'UNKNOWN'
  | null;

export interface LocationState {
  isLoading: boolean;
  error: LocationErrorType;
  errorMessage: string | null;
  requestLocation: () => Promise<void>;
}

export function useUserLocation(): LocationState {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationErrorType>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setUserLocation = useWeatherStore((s) => s.setUserLocation);
  const lang = useSettingsStore((s) => s.lang);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorMessage(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('PERMISSION_DENIED');
        setErrorMessage(
          lang === 'tr'
            ? 'Konum izni verilmedi. Hava durumunu görmek için şehir arayabilir veya izin verebilirsiniz.'
            : 'Location permission was denied. You can search for cities or enable permissions in settings.'
        );
        setIsLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode with weather provider
      const provider = getWeatherProvider();
      const geo = await provider.reverseGeocode({ lat: latitude, lon: longitude }, lang);

      setUserLocation({
        name: geo.name,
        country: geo.country,
        state: geo.state,
        lat: latitude,
        lon: longitude,
      });
      setError(null);
    } catch (err: any) {
      setError('POSITION_UNAVAILABLE');
      setErrorMessage(
        lang === 'tr'
          ? 'Konum bilgisi alınamadı. Lütfen GPS bağlantınızı kontrol edin.'
          : 'Unable to retrieve location. Please check your GPS connection.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [lang, setUserLocation]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    isLoading,
    error,
    errorMessage,
    requestLocation,
  };
}
