import { WeatherProvider } from './WeatherProvider';
import { OpenWeatherProvider } from './OpenWeatherProvider';
import { MockWeatherProvider } from './MockWeatherProvider';
import { getApiKey, isMockMode, checkAndWarnApiKey } from '../../utils/env';

export * from './types';
export * from './WeatherProvider';
export * from './OpenWeatherProvider';
export * from './MockWeatherProvider';
export * from './mappers';

let cachedProvider: WeatherProvider | null = null;
let cachedKey: string | undefined = undefined;

/**
 * Mevcut ortama (.env) uygun hava durumu sağlayıcısını döndürür.
 * Anahtar yoksa MockWeatherProvider devreye girer.
 */
export function getWeatherProvider(): WeatherProvider {
  checkAndWarnApiKey();
  const currentKey = getApiKey();

  if (cachedProvider && cachedKey === currentKey) {
    return cachedProvider;
  }

  cachedKey = currentKey;
  if (currentKey) {
    cachedProvider = new OpenWeatherProvider(currentKey);
  } else {
    cachedProvider = new MockWeatherProvider();
  }

  return cachedProvider;
}

export { isMockMode };
