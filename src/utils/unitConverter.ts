export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'ms' | 'kmh' | 'mph';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  const value = convertTemperature(celsius, unit);
  const symbol = unit === 'fahrenheit' ? '°F' : '°C';
  return `${value}${symbol}`;
}

export function convertWindSpeed(ms: number, unit: WindSpeedUnit): number {
  switch (unit) {
    case 'kmh':
      return Math.round(ms * 3.6);
    case 'mph':
      return Math.round(ms * 2.23694);
    case 'ms':
    default:
      return Math.round(ms * 10) / 10;
  }
}

export function formatWindSpeed(ms: number, unit: WindSpeedUnit, lang: 'tr' | 'en' = 'tr'): string {
  const val = convertWindSpeed(ms, unit);
  switch (unit) {
    case 'kmh':
      return `${val} km/s`;
    case 'mph':
      return `${val} mph`;
    case 'ms':
    default:
      return `${val} m/s`;
  }
}

export function getWindDirectionText(deg: number, lang: 'tr' | 'en' = 'tr'): string {
  const directionsTr = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  const directionsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return lang === 'tr' ? directionsTr[index] : directionsEn[index];
}
