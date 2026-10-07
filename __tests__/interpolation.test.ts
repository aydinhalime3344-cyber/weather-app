import { interpolateHourlyForecast } from '../src/utils/interpolation';
import { HourlyForecast } from '../src/services/weather/types';

describe('interpolateHourlyForecast', () => {
  const baseTime = 1700000000;
  const mock3HourPoints: HourlyForecast[] = [
    {
      dt: baseTime,
      time: '12:00',
      temp: 10,
      feelsLike: 9,
      pop: 0.1,
      condition: 'clear',
      icon: '01d',
      description: 'Açık',
      windSpeed: 3,
    },
    {
      dt: baseTime + 3 * 3600, // +3 hours
      time: '15:00',
      temp: 16,
      feelsLike: 15,
      pop: 0.4,
      condition: 'clouds',
      icon: '02d',
      description: 'Bulutlu',
      windSpeed: 6,
    },
  ];

  it('generates continuous hourly items between 3-hour anchors', () => {
    const result = interpolateHourlyForecast(mock3HourPoints, 4);
    expect(result).toHaveLength(4);

    // Hour 0: exact point A
    expect(result[0].dt).toBe(baseTime);
    expect(result[0].temp).toBe(10);
    expect(result[0].isInterpolated).toBe(false);

    // Hour 1: 1/3 between 10 and 16 -> 12
    expect(result[1].dt).toBe(baseTime + 3600);
    expect(result[1].temp).toBe(12);
    expect(result[1].isInterpolated).toBe(true);

    // Hour 2: 2/3 between 10 and 16 -> 14
    expect(result[2].dt).toBe(baseTime + 7200);
    expect(result[2].temp).toBe(14);
    expect(result[2].isInterpolated).toBe(true);

    // Hour 3: exact point B -> 16
    expect(result[3].dt).toBe(baseTime + 10800);
    expect(result[3].temp).toBe(16);
  });

  it('handles empty input gracefully', () => {
    const result = interpolateHourlyForecast([], 24);
    expect(result).toEqual([]);
  });

  it('handles single item input', () => {
    const result = interpolateHourlyForecast([mock3HourPoints[0]], 24);
    expect(result).toHaveLength(1);
    expect(result[0].temp).toBe(10);
  });
});
