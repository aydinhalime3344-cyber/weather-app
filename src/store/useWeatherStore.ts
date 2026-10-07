import { create } from 'zustand';
import { GeoLocation } from '../services/weather/types';

export interface WeatherState {
  activeLocation: GeoLocation;
  userLocation: GeoLocation | null;
  isUsingGps: boolean;
  lastUpdated: string | null;
  devConditionOverride: string | null;
  devIsDayOverride: boolean | null;
  devIsGoldenHourOverride: boolean | null;
  setActiveLocation: (location: GeoLocation, isGps?: boolean) => void;
  setUserLocation: (location: GeoLocation | null) => void;
  setLastUpdated: (time: string) => void;
  useCurrentLocation: () => void;
  setDevOverride: (
    condition: any | null,
    isDay: boolean | null,
    isGoldenHour?: boolean | null
  ) => void;
  resetDevOverride: () => void;
}

const DEFAULT_LOCATION: GeoLocation = {
  name: 'Ankara',
  country: 'TR',
  lat: 39.9334,
  lon: 32.8597,
};

export const useWeatherStore = create<WeatherState>((set, get) => ({
  activeLocation: DEFAULT_LOCATION,
  userLocation: null,
  isUsingGps: true,
  lastUpdated: null,
  devConditionOverride: null,
  devIsDayOverride: null,
  devIsGoldenHourOverride: null,

  setDevOverride: (condition, isDay, isGoldenHour = false) => {
    set({
      devConditionOverride: condition,
      devIsDayOverride: isDay,
      devIsGoldenHourOverride: isGoldenHour ?? false,
    });
  },

  resetDevOverride: () => {
    set({
      devConditionOverride: null,
      devIsDayOverride: null,
      devIsGoldenHourOverride: null,
    });
  },

  setActiveLocation: (location: GeoLocation, isGps: boolean = false) => {
    set({
      activeLocation: location,
      isUsingGps: isGps,
    });
  },

  setUserLocation: (location: GeoLocation | null) => {
    set({ userLocation: location });
    if (get().isUsingGps && location) {
      set({ activeLocation: location });
    }
  },

  setLastUpdated: (time: string) => {
    set({ lastUpdated: time });
  },

  useCurrentLocation: () => {
    const userLoc = get().userLocation;
    if (userLoc) {
      set({
        activeLocation: userLoc,
        isUsingGps: true,
      });
    } else {
      set({ isUsingGps: true });
    }
  },
}));
