import { HourlyForecast } from '../services/weather/types';
import { formatTime } from './dateUtils';

/**
 * 3 saatlik hava durumu tahmin verilerinden lineer interpolasyon ile
 * 24 saatlik kesintisiz saatlik tahmin listesi üretir.
 */
export function interpolateHourlyForecast(
  threeHourItems: HourlyForecast[],
  totalHours: number = 24
): HourlyForecast[] {
  if (!threeHourItems || threeHourItems.length === 0) {
    return [];
  }

  if (threeHourItems.length === 1) {
    return [threeHourItems[0]];
  }

  const result: HourlyForecast[] = [];
  const startDt = threeHourItems[0].dt;
  const ONE_HOUR = 3600;

  for (let i = 0; i < totalHours; i++) {
    const targetDt = startDt + i * ONE_HOUR;

    // Find bounding items A and B
    let indexA = 0;
    while (
      indexA < threeHourItems.length - 1 &&
      threeHourItems[indexA + 1].dt <= targetDt
    ) {
      indexA++;
    }

    const itemA = threeHourItems[indexA];
    const itemB = threeHourItems[indexA + 1] || itemA;

    if (itemA.dt === itemB.dt || targetDt >= itemB.dt) {
      // At or beyond the last available anchor
      result.push({
        ...itemB,
        dt: targetDt,
        time: formatTime(targetDt),
        isInterpolated: targetDt !== itemB.dt,
      });
      continue;
    }

    // Linear interpolation factor
    const ratio = (targetDt - itemA.dt) / (itemB.dt - itemA.dt);
    const interpolatedTemp = Math.round((itemA.temp + ratio * (itemB.temp - itemA.temp)) * 10) / 10;
    const interpolatedFeels = Math.round((itemA.feelsLike + ratio * (itemB.feelsLike - itemA.feelsLike)) * 10) / 10;
    const interpolatedPop = Math.round((itemA.pop + ratio * (itemB.pop - itemA.pop)) * 100) / 100;
    const interpolatedWind = Math.round((itemA.windSpeed + ratio * (itemB.windSpeed - itemA.windSpeed)) * 10) / 10;

    // Select icon/condition from nearest anchor
    const nearestItem = ratio < 0.5 ? itemA : itemB;

    result.push({
      dt: targetDt,
      time: formatTime(targetDt),
      temp: interpolatedTemp,
      feelsLike: interpolatedFeels,
      pop: Math.max(0, Math.min(1, interpolatedPop)),
      condition: nearestItem.condition,
      icon: nearestItem.icon,
      description: nearestItem.description,
      windSpeed: interpolatedWind,
      isInterpolated: ratio !== 0,
    });
  }

  return result;
}
