import {
  convertTemperature,
  formatTemperature,
  convertWindSpeed,
  formatWindSpeed,
  getWindDirectionText,
} from '../src/utils/unitConverter';

describe('Unit Converters', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
    expect(convertTemperature(20, 'fahrenheit')).toBe(68);
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
    expect(convertTemperature(20, 'celsius')).toBe(20);
  });

  it('formats temperature with unit symbols', () => {
    expect(formatTemperature(22, 'celsius')).toBe('22°C');
    expect(formatTemperature(22, 'fahrenheit')).toBe('72°F');
  });

  it('converts wind speeds correctly', () => {
    expect(convertWindSpeed(10, 'kmh')).toBe(36);
    expect(convertWindSpeed(10, 'ms')).toBe(10);
    expect(convertWindSpeed(10, 'mph')).toBe(22);
  });

  it('computes wind direction text', () => {
    expect(getWindDirectionText(0, 'tr')).toBe('K');
    expect(getWindDirectionText(90, 'tr')).toBe('D');
    expect(getWindDirectionText(180, 'tr')).toBe('G');
    expect(getWindDirectionText(270, 'tr')).toBe('B');
    expect(getWindDirectionText(45, 'tr')).toBe('KD');
  });
});
