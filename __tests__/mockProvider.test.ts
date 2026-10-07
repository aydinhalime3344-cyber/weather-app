import { MockWeatherProvider } from '../src/services/weather/MockWeatherProvider';

describe('MockWeatherProvider', () => {
  const provider = new MockWeatherProvider();

  it('provides current weather for coordinates', async () => {
    const data = await provider.getCurrentWeather({ lat: 41.0082, lon: 28.9784 }, 'tr');
    expect(data.location.name).toBe('İstanbul');
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.feelsLike).toBe('number');
    expect(data.condition).toBeDefined();
    expect(data.sunrise).toBeGreaterThan(0);
    expect(data.sunset).toBeGreaterThan(data.sunrise);
  });

  it('provides 24 hours of hourly and 5 daily forecasts', async () => {
    const { hourly, daily } = await provider.getForecast({ lat: 39.9334, lon: 32.8597 }, 'tr');
    expect(hourly).toHaveLength(24);
    expect(daily).toHaveLength(5);
    expect(daily[0].hourlyDetails.length).toBeGreaterThan(0);
  });

  it('searches cities by name with case insensitivity', async () => {
    const results = await provider.searchCities('ank');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Ankara');
  });

  it('reverse geocodes coordinates to closest city', async () => {
    const loc = await provider.reverseGeocode({ lat: 41.01, lon: 28.97 });
    expect(loc.name).toBe('İstanbul');
  });
});
