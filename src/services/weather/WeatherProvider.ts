import { CurrentWeather, HourlyForecast, DailyForecast, GeoLocation } from './types';

export interface WeatherProvider {
  /**
   * Belirtilen koordinatlar için anlık hava durumunu getirir.
   */
  getCurrentWeather(
    coords: { lat: number; lon: number },
    lang?: 'tr' | 'en'
  ): Promise<CurrentWeather>;

  /**
   * Belirtilen koordinatlar için saatlik ve 5 günlük tahminleri getirir.
   */
  getForecast(
    coords: { lat: number; lon: number },
    lang?: 'tr' | 'en'
  ): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }>;

  /**
   * Şehir adına göre arama yapar (Direct geocoding).
   */
  searchCities(query: string, lang?: 'tr' | 'en'): Promise<GeoLocation[]>;

  /**
   * Koordinatlardan şehir/ilçe bilgisini çözer (Reverse geocoding).
   */
  reverseGeocode(
    coords: { lat: number; lon: number },
    lang?: 'tr' | 'en'
  ): Promise<GeoLocation>;
}
