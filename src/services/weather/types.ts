export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog'
  | 'windy';

export interface GeoLocation {
  id?: string;
  name: string;
  country?: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  location: GeoLocation;
  temperature: number;      // °C
  feelsLike: number;        // °C
  tempMin: number;          // °C
  tempMax: number;          // °C
  humidity: number;         // %
  pressure: number;         // hPa
  windSpeed: number;        // m/s
  windDeg: number;          // degrees 0-360
  visibility: number;       // meters
  clouds: number;           // %
  condition: WeatherCondition;
  description: string;      // e.g. "Parçalı Bulutlu"
  icon: string;             // openweather icon code like "02d"
  sunrise: number;          // unix timestamp in seconds
  sunset: number;           // unix timestamp in seconds
  dt: number;               // observation unix timestamp in seconds
  isDay: boolean;
  uvIndex?: number;         // UV index if available
}

export interface HourlyForecast {
  dt: number;
  time: string;             // "14:00"
  temp: number;
  feelsLike: number;
  pop: number;              // 0 to 1 (precipitation probability)
  condition: WeatherCondition;
  icon: string;
  description: string;
  windSpeed: number;
  isInterpolated?: boolean;
}

export interface DailyForecast {
  dt: number;
  date: string;             // "YYYY-MM-DD"
  dayName: string;          // "Bugün", "Yarın", "Pazartesi" vs.
  tempMin: number;
  tempMax: number;
  pop: number;              // max precipitation probability 0 to 1
  condition: WeatherCondition;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
  hourlyDetails: HourlyForecast[];
}

export interface CompleteWeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isMock: boolean;
  updatedAt: string;        // "HH:mm" formatted or ISO string
}

export interface RawOpenWeatherCurrent {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility?: number;
  wind: { speed: number; deg: number; gust?: number };
  clouds: { all: number };
  dt: number;
  sys: {
    country?: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

export interface RawOpenWeatherForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  clouds: { all: number };
  wind: { speed: number; deg: number };
  visibility?: number;
  pop?: number;
  dt_txt: string;
}

export interface RawOpenWeatherForecastResponse {
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: RawOpenWeatherForecastItem[];
}
