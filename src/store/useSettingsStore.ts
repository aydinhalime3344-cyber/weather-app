import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TemperatureUnit, WindSpeedUnit } from '../utils/unitConverter';

const SETTINGS_STORAGE_KEY = '@weather_app_settings_v1';

export interface SettingsState {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  theme: 'system' | 'light' | 'dark';
  lang: 'tr' | 'en';
  isLoaded: boolean;
  setTempUnit: (unit: TemperatureUnit) => void;
  setWindUnit: (unit: WindSpeedUnit) => void;
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  setLang: (lang: 'tr' | 'en') => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  tempUnit: 'celsius',
  windUnit: 'kmh',
  theme: 'system',
  lang: 'tr',
  isLoaded: false,

  setTempUnit: (tempUnit) => {
    set({ tempUnit });
    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...get(), tempUnit })
    ).catch(console.error);
  },

  setWindUnit: (windUnit) => {
    set({ windUnit });
    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...get(), windUnit })
    ).catch(console.error);
  },

  setTheme: (theme) => {
    set({ theme });
    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...get(), theme })
    ).catch(console.error);
  },

  setLang: (lang) => {
    set({ lang });
    AsyncStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...get(), lang })
    ).catch(console.error);
  },

  loadSettings: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          tempUnit: parsed.tempUnit || 'celsius',
          windUnit: parsed.windUnit || 'kmh',
          theme: parsed.theme || 'system',
          lang: parsed.lang || 'tr',
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },
}));
