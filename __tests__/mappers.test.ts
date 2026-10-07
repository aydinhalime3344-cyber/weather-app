import {
  mapWeatherCondition,
  mapRawCurrentToWeather,
  mapForecastResponse,
  capitalizeDescription,
} from '../src/services/weather/mappers';
import {
  RawOpenWeatherCurrent,
  RawOpenWeatherForecastResponse,
} from '../src/services/weather/types';

describe('Weather Mappers', () => {
  it('maps weather IDs correctly to condition types', () => {
    expect(mapWeatherCondition(201)).toBe('thunderstorm');
    expect(mapWeatherCondition(310)).toBe('drizzle');
    expect(mapWeatherCondition(500)).toBe('rain');
    expect(mapWeatherCondition(602)).toBe('snow');
    expect(mapWeatherCondition(741)).toBe('fog');
    expect(mapWeatherCondition(721)).toBe('fog');
    expect(mapWeatherCondition(711)).toBe('fog');
    expect(mapWeatherCondition(781)).toBe('mist');
    expect(mapWeatherCondition(800)).toBe('clear');
    expect(mapWeatherCondition(802)).toBe('clouds');
  });

  it('capitalizes Turkish descriptions properly', () => {
    expect(capitalizeDescription('parçalı bulutlu')).toBe('Parçalı bulutlu');
    expect(capitalizeDescription('açık')).toBe('Açık');
  });

  it('maps RawOpenWeatherCurrent to CurrentWeather model', () => {
    const raw: RawOpenWeatherCurrent = {
      coord: { lon: 28.9784, lat: 41.0082 },
      weather: [{ id: 801, main: 'Clouds', description: 'az bulutlu', icon: '02d' }],
      main: {
        temp: 21.4,
        feels_like: 21.1,
        temp_min: 19.0,
        temp_max: 23.5,
        pressure: 1015,
        humidity: 60,
      },
      visibility: 10000,
      wind: { speed: 3.5, deg: 180 },
      clouds: { all: 20 },
      dt: 1700000000,
      sys: {
        country: 'TR',
        sunrise: 1699980000,
        sunset: 1700020000,
      },
      name: 'İstanbul',
    };

    const current = mapRawCurrentToWeather(raw);
    expect(current.location.name).toBe('İstanbul');
    expect(current.temperature).toBe(21);
    expect(current.feelsLike).toBe(21);
    expect(current.condition).toBe('clouds');
    expect(current.isDay).toBe(true);
    expect(current.description).toBe('Az bulutlu');
  });

  it('groups 3-hour forecasts into daily forecasts with min/max temp and dominant condition', () => {
    const rawForecast: RawOpenWeatherForecastResponse = {
      city: {
        id: 745044,
        name: 'İstanbul',
        coord: { lat: 41.0, lon: 29.0 },
        country: 'TR',
        sunrise: 1700000000,
        sunset: 1700040000,
      },
      list: [
        {
          dt: 1700010000,
          dt_txt: '2026-10-07 09:00:00',
          main: { temp: 18, feels_like: 17, temp_min: 17, temp_max: 19, pressure: 1012, humidity: 65 },
          weather: [{ id: 800, main: 'Clear', description: 'açık', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3.0, deg: 120 },
          pop: 0.1,
        },
        {
          dt: 1700020800,
          dt_txt: '2026-10-07 12:00:00',
          main: { temp: 22, feels_like: 21, temp_min: 20, temp_max: 24, pressure: 1011, humidity: 50 },
          weather: [{ id: 800, main: 'Clear', description: 'açık', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 4.0, deg: 150 },
          pop: 0.2,
        },
      ],
    };

    const result = mapForecastResponse(rawForecast, 'tr');
    expect(result.hourly.length).toBeGreaterThan(0);
    expect(result.daily.length).toBeGreaterThan(0);
    expect(result.daily[0].tempMin).toBe(17);
    expect(result.daily[0].tempMax).toBe(24);
    expect(result.daily[0].pop).toBe(0.2);
    expect(result.daily[0].condition).toBe('clear');
  });
});
