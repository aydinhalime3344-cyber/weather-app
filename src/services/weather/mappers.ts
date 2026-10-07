import {
  WeatherCondition,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  RawOpenWeatherCurrent,
  RawOpenWeatherForecastItem,
  RawOpenWeatherForecastResponse,
  GeoLocation,
} from './types';
import { formatDayName, formatTime } from '../../utils/dateUtils';
import { interpolateHourlyForecast } from '../../utils/interpolation';

/**
 * OpenWeatherMap hava durumu kodunu dahili WeatherCondition tipine dönüştürür.
 */
export function mapWeatherCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id === 741 || id === 701 || id === 711 || id === 721) return 'fog';
  if (id > 700 && id < 800) return 'mist';
  if (id === 800) return 'clear';
  if (id > 800 && id < 900) return 'clouds';
  return 'clear';
}

/**
 * OpenWeatherMap Türkçe açıklamalarını daha şık ve tutarlı bir hale getirir
 */
export function capitalizeDescription(desc: string): string {
  if (!desc) return '';
  return desc.charAt(0).toLocaleUpperCase('tr-TR') + desc.slice(1);
}

/**
 * Ham Current Weather API yanıtını dahili CurrentWeather tipine dönüştürür
 */
export function mapRawCurrentToWeather(
  raw: RawOpenWeatherCurrent,
  overrideLocation?: GeoLocation
): CurrentWeather {
  const weatherItem = raw.weather[0] || {
    id: 800,
    main: 'Clear',
    description: 'Açık',
    icon: '01d',
  };

  const isDay = weatherItem.icon.endsWith('d');

  const location: GeoLocation = overrideLocation || {
    name: raw.name || 'Bilinmeyen Konum',
    country: raw.sys?.country,
    lat: raw.coord.lat,
    lon: raw.coord.lon,
  };

  return {
    location,
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    tempMin: Math.round(raw.main.temp_min),
    tempMax: Math.round(raw.main.temp_max),
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg || 0,
    visibility: raw.visibility ?? 10000,
    clouds: raw.clouds?.all ?? 0,
    condition: mapWeatherCondition(weatherItem.id),
    description: capitalizeDescription(weatherItem.description),
    icon: weatherItem.icon,
    sunrise: raw.sys?.sunrise || Math.floor(Date.now() / 1000) - 21600,
    sunset: raw.sys?.sunset || Math.floor(Date.now() / 1000) + 21600,
    dt: raw.dt,
    isDay,
  };
}

/**
 * Ham 3 saatlik tahmin satırını HourlyForecast modeline dönüştürür
 */
export function mapRawItemToHourly(item: RawOpenWeatherForecastItem): HourlyForecast {
  const weather = item.weather[0] || {
    id: 800,
    main: 'Clear',
    description: 'Açık',
    icon: '01d',
  };

  return {
    dt: item.dt,
    time: formatTime(item.dt),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    pop: item.pop ?? 0,
    condition: mapWeatherCondition(weather.id),
    icon: weather.icon,
    description: capitalizeDescription(weather.description),
    windSpeed: item.wind.speed,
  };
}

/**
 * Ham 5 günlük / 3 saatlik tahmin yanıtından saatlik (24 saat interpolasyonlu)
 * ve 5 günlük kümelenmiş tahmin listelerini üretir.
 */
export function mapForecastResponse(
  raw: RawOpenWeatherForecastResponse,
  lang: 'tr' | 'en' = 'tr'
): { hourly: HourlyForecast[]; daily: DailyForecast[] } {
  const threeHourItems = raw.list.map(mapRawItemToHourly);

  // 1. 24 saatlik yumuşak tahmin üretimi (lineer interpolasyon)
  const hourly = interpolateHourlyForecast(threeHourItems, 24);

  // 2. Gün bazlı kümeleme (Daily forecast)
  const daysMap = new Map<string, RawOpenWeatherForecastItem[]>();

  raw.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

    const existing = daysMap.get(dateKey) || [];
    existing.push(item);
    daysMap.set(dateKey, existing);
  });

  const daily: DailyForecast[] = [];

  daysMap.forEach((dayItems, dateKey) => {
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let maxPop = 0;
    let totalHumidity = 0;
    let totalWind = 0;

    // Baskın hava durumu ikonu bulmak için frekans sayacı
    const conditionCounts = new Map<number, number>();
    const iconByCondition = new Map<number, { icon: string; desc: string }>();

    dayItems.forEach((item) => {
      if (item.main.temp_min < minTemp) minTemp = item.main.temp_min;
      if (item.main.temp_max > maxTemp) maxTemp = item.main.temp_max;
      if ((item.pop ?? 0) > maxPop) maxPop = item.pop ?? 0;
      totalHumidity += item.main.humidity;
      totalWind += item.wind.speed;

      const w = item.weather[0];
      if (w) {
        conditionCounts.set(w.id, (conditionCounts.get(w.id) || 0) + 1);
        iconByCondition.set(w.id, { icon: w.icon, desc: w.description });
      }
    });

    // En çok tekrar eden durum
    let dominantId = 800;
    let highestCount = 0;
    conditionCounts.forEach((count, id) => {
      if (count > highestCount) {
        highestCount = count;
        dominantId = id;
      }
    });

    const dominantMeta = iconByCondition.get(dominantId) || { icon: '01d', desc: 'Açık' };
    const firstItem = dayItems[0];
    const avgHumidity = Math.round(totalHumidity / dayItems.length);
    const avgWind = Math.round((totalWind / dayItems.length) * 10) / 10;

    // Günün saatlik detayları
    const dayHourly = dayItems.map(mapRawItemToHourly);

    daily.push({
      dt: firstItem.dt,
      date: dateKey,
      dayName: formatDayName(firstItem.dt, lang),
      tempMin: Math.round(minTemp),
      tempMax: Math.round(maxTemp),
      pop: Math.round(maxPop * 100) / 100,
      condition: mapWeatherCondition(dominantId),
      icon: dominantMeta.icon.replace('n', 'd'), // Günlük kartlarda gündüz ikonları daha belirgindir
      description: capitalizeDescription(dominantMeta.desc),
      humidity: avgHumidity,
      windSpeed: avgWind,
      hourlyDetails: dayHourly,
    });
  });

  return {
    hourly,
    daily: daily.slice(0, 5), // İlk 5 gün
  };
}
