import { WeatherProvider } from './WeatherProvider';
import {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  GeoLocation,
  WeatherCondition,
} from './types';
import { formatDayName, formatTime } from '../../utils/dateUtils';

interface PredefinedCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  baseTemp: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
}

const PREDEFINED_CITIES: PredefinedCity[] = [
  {
    name: 'İstanbul',
    country: 'TR',
    lat: 41.0082,
    lon: 28.9784,
    baseTemp: 19,
    condition: 'clouds',
    description: 'Parçalı Bulutlu',
    icon: '03d',
  },
  {
    name: 'Ankara',
    country: 'TR',
    lat: 39.9334,
    lon: 32.8597,
    baseTemp: 16,
    condition: 'clear',
    description: 'Güneşli ve Açık',
    icon: '01d',
  },
  {
    name: 'İzmir',
    country: 'TR',
    lat: 38.4192,
    lon: 27.1287,
    baseTemp: 23,
    condition: 'clear',
    description: 'Açık',
    icon: '01d',
  },
  {
    name: 'Antalya',
    country: 'TR',
    lat: 36.8969,
    lon: 30.7133,
    baseTemp: 26,
    condition: 'clear',
    description: 'Güneşli',
    icon: '01d',
  },
  {
    name: 'Bursa',
    country: 'TR',
    lat: 40.1885,
    lon: 29.061,
    baseTemp: 20,
    condition: 'clouds',
    description: 'Az Bulutlu',
    icon: '02d',
  },
  {
    name: 'Trabzon',
    country: 'TR',
    lat: 41.0027,
    lon: 39.7168,
    baseTemp: 15,
    condition: 'rain',
    description: 'Hafif Yağmurlu',
    icon: '10d',
  },
  {
    name: 'Londra',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    baseTemp: 14,
    condition: 'rain',
    description: 'Çiseleyen Yağmur',
    icon: '09d',
  },
  {
    name: 'Tokyo',
    country: 'JP',
    lat: 35.6762,
    lon: 139.6503,
    baseTemp: 18,
    condition: 'clouds',
    description: 'Bulutlu',
    icon: '04d',
  },
  {
    name: 'New York',
    country: 'US',
    lat: 40.7128,
    lon: -74.006,
    baseTemp: 17,
    condition: 'clear',
    description: 'Açık',
    icon: '01d',
  },
];

export class MockWeatherProvider implements WeatherProvider {
  private findClosestCity(lat: number, lon: number): PredefinedCity {
    let closest = PREDEFINED_CITIES[0];
    let minDistance = Infinity;

    for (const city of PREDEFINED_CITIES) {
      const distance = Math.sqrt(
        Math.pow(city.lat - lat, 2) + Math.pow(city.lon - lon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = city;
      }
    }
    return closest;
  }

  async getCurrentWeather(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<CurrentWeather> {
    const city = this.findClosestCity(coords.lat, coords.lon);
    const now = Math.floor(Date.now() / 1000);

    // Sunrise at 06:45, Sunset at 19:15 today
    const today = new Date();
    today.setHours(6, 45, 0, 0);
    const sunrise = Math.floor(today.getTime() / 1000);
    today.setHours(19, 15, 0, 0);
    const sunset = Math.floor(today.getTime() / 1000);

    const isDay = now >= sunrise && now <= sunset;

    return {
      location: {
        name: city.name,
        country: city.country,
        lat: coords.lat,
        lon: coords.lon,
      },
      temperature: city.baseTemp,
      feelsLike: city.baseTemp + 1,
      tempMin: city.baseTemp - 4,
      tempMax: city.baseTemp + 4,
      humidity: 58,
      pressure: 1014,
      windSpeed: 4.2,
      windDeg: 220,
      visibility: 10000,
      clouds: city.condition === 'clouds' ? 45 : 10,
      condition: city.condition,
      description:
        lang === 'en'
          ? city.condition === 'clouds'
            ? 'Partly Cloudy'
            : city.condition === 'rain'
            ? 'Light Rain'
            : 'Clear Sky'
          : city.description,
      icon: isDay ? city.icon : city.icon.replace('d', 'n'),
      sunrise,
      sunset,
      dt: now,
      isDay,
      uvIndex: isDay ? 6 : 0,
    };
  }

  async getForecast(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<{ hourly: HourlyForecast[]; daily: DailyForecast[] }> {
    const city = this.findClosestCity(coords.lat, coords.lon);
    const nowSeconds = Math.floor(Date.now() / 1000);
    const currentHourDate = new Date();
    currentHourDate.setMinutes(0, 0, 0);
    const startHourSeconds = Math.floor(currentHourDate.getTime() / 1000);

    // 24 saatlik gerçekçi sıcaklık eğrisi (öğleden sonra pik, gece düşüş)
    const hourly: HourlyForecast[] = [];
    for (let i = 0; i < 24; i++) {
      const targetDt = startHourSeconds + i * 3600;
      const hourOfDay = new Date(targetDt * 1000).getHours();

      // Sıcaklık diürnal eğrisi (15:00 pik, 05:00 min)
      const rad = ((hourOfDay - 6) / 24) * 2 * Math.PI;
      const diurnalOffset = Math.sin(rad - Math.PI / 4) * 4.5;
      const temp = Math.round((city.baseTemp + diurnalOffset) * 10) / 10;
      const pop = Math.max(0, Math.min(1, Math.round((Math.sin(i / 3) * 0.2 + 0.15) * 100) / 100));

      const isNight = hourOfDay < 6 || hourOfDay > 19;
      const cond = i % 8 === 0 ? 'clouds' : city.condition;

      hourly.push({
        dt: targetDt,
        time: formatTime(targetDt),
        temp,
        feelsLike: Math.round((temp + (pop > 0.3 ? -1 : 0.5)) * 10) / 10,
        pop,
        condition: cond,
        icon: isNight ? '02n' : '02d',
        description: lang === 'en' ? 'Partly Cloudy' : 'Parçalı Bulutlu',
        windSpeed: Math.round((3.5 + Math.sin(i) * 1.5) * 10) / 10,
        isInterpolated: true,
      });
    }

    // 5 Günlük Tahmin
    const daily: DailyForecast[] = [];
    const conditionCycle: Array<{ cond: WeatherCondition; icon: string; tr: string; en: string }> = [
      { cond: 'clouds', icon: '03d', tr: 'Parçalı Bulutlu', en: 'Partly Cloudy' },
      { cond: 'clear', icon: '01d', tr: 'Güneşli ve Açık', en: 'Clear & Sunny' },
      { cond: 'rain', icon: '10d', tr: 'Aralıklı Yağmurlu', en: 'Scattered Rain' },
      { cond: 'clouds', icon: '02d', tr: 'Az Bulutlu', en: 'Few Clouds' },
      { cond: 'clear', icon: '01d', tr: 'Açık', en: 'Clear' },
    ];

    for (let d = 0; d < 5; d++) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + d);
      dayDate.setHours(12, 0, 0, 0);
      const dt = Math.floor(dayDate.getTime() / 1000);

      const meta = conditionCycle[d % conditionCycle.length];
      const offset = (d % 3) - 1;
      const tempMin = city.baseTemp - 5 + offset;
      const tempMax = city.baseTemp + 4 + offset;
      const pop = meta.cond === 'rain' ? 0.65 : meta.cond === 'clouds' ? 0.2 : 0.05;

      const dateStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(
        dayDate.getDate()
      ).padStart(2, '0')}`;

      // 4 alt saatlik örnek
      const dayHours: HourlyForecast[] = [0, 6, 12, 18].map((h) => {
        const hDt = dt - 43200 + h * 3600;
        return {
          dt: hDt,
          time: `${String(h).padStart(2, '0')}:00`,
          temp: h === 12 ? tempMax : h === 6 ? tempMin : tempMin + 3,
          feelsLike: tempMax - 1,
          pop,
          condition: meta.cond,
          icon: h < 6 || h >= 20 ? meta.icon.replace('d', 'n') : meta.icon,
          description: lang === 'en' ? meta.en : meta.tr,
          windSpeed: 4.1,
        };
      });

      daily.push({
        dt,
        date: dateStr,
        dayName: formatDayName(dt, lang),
        tempMin,
        tempMax,
        pop,
        condition: meta.cond,
        icon: meta.icon,
        description: lang === 'en' ? meta.en : meta.tr,
        humidity: 55 + d * 3,
        windSpeed: 4.0 + (d % 2),
        hourlyDetails: dayHours,
      });
    }

    return { hourly, daily };
  }

  async searchCities(query: string, lang: 'tr' | 'en' = 'tr'): Promise<GeoLocation[]> {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return [];

    const matches = PREDEFINED_CITIES.filter((c) =>
      c.name.toLocaleLowerCase('tr-TR').includes(q)
    );

    return matches.map((c) => ({
      name: c.name,
      country: c.country,
      lat: c.lat,
      lon: c.lon,
    }));
  }

  async reverseGeocode(
    coords: { lat: number; lon: number },
    lang: 'tr' | 'en' = 'tr'
  ): Promise<GeoLocation> {
    const city = this.findClosestCity(coords.lat, coords.lon);
    return {
      name: city.name,
      country: city.country,
      lat: coords.lat,
      lon: coords.lon,
    };
  }
}
