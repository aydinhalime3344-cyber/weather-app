import { WeatherProvider } from './WeatherProvider';
import {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  GeoLocation,
  RawOpenWeatherCurrent,
  RawOpenWeatherForecastResponse,
} from './types';
import { mapRawCurrentToWeather, mapForecastResponse } from './mappers';

export class WeatherApiError extends Error {
  statusCode?: number;
  isNetworkError?: boolean;

  constructor(message: string, statusCode?: number, isNetworkError: boolean = false) {
    super(message);
    this.name = 'WeatherApiError';
    this.statusCode = statusCode;
    this.isNetworkError = isNetworkError;
  }
}

export class OpenWeatherProvider implements WeatherProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetchJson<T>(url: string): Promise<T> {
    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      throw new WeatherApiError(
        'İnternet bağlantısı kurulamadı. Lütfen bağlantınızı kontrol edin.',
        undefined,
        true
      );
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new WeatherApiError(
          'Geçersiz API anahtarı. Lütfen .env dosyasındaki EXPO_PUBLIC_WEATHER_API_KEY değerini kontrol edin.',
          401
        );
      }
      if (response.status === 429) {
        throw new WeatherApiError(
          'API istek limiti aşıldı. Lütfen biraz bekleyip tekrar deneyin.',
          429
        );
      }
      if (response.status === 404) {
        throw new WeatherApiError('İstenen konum için hava durumu verisi bulunamadı.', 404);
      }
      if (response.status >= 500) {
        throw new WeatherApiError('Hava durumu sunucusunda geçici bir hata oluştu.', response.status);
      }
      throw new WeatherApiError(
        `API hatası (${response.status}): ${response.statusText}`,
        response.status
      );
    }

    return (await response.json()) as T;
  }

  async getCurrentWeather(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<CurrentWeather> {
    const url = `${this.baseUrl}/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=${lang}&appid=${this.apiKey}`;
    const raw = await this.fetchJson<RawOpenWeatherCurrent>(url);
    return mapRawCurrentToWeather(raw);
  }

  async getForecast(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
    const url = `${this.baseUrl}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=${lang}&appid=${this.apiKey}`;
    const raw = await this.fetchJson<RawOpenWeatherForecastResponse>(url);
    return mapForecastResponse(raw, lang);
  }

  async searchCities(query: string, lang: 'tr' | 'en' = 'tr'): Promise<GeoLocation[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const url = `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(trimmed)}&limit=5&appid=${this.apiKey}`;
    const raw = await this.fetchJson<
      Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
        local_names?: Record<string, string>;
      }>
    >(url);

    return raw.map((item) => ({
      name: (lang === 'tr' && item.local_names?.tr) || item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }));
  }

  async reverseGeocode(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<GeoLocation> {
    const url = `${this.baseUrl}/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lon}&limit=1&appid=${this.apiKey}`;
    const raw = await this.fetchJson<
      Array<{
        name: string;
        lat: number;
        lon: number;
        country: string;
        state?: string;
        local_names?: Record<string, string>;
      }>
    >(url);

    if (raw && raw.length > 0) {
      const item = raw[0];
      return {
        name: (lang === 'tr' && item.local_names?.tr) || item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      };
    }

    return {
      name: `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}`,
      lat: coords.lat,
      lon: coords.lon,
    };
  }
}
