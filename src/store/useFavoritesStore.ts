import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeoLocation } from '../services/weather/types';

const FAVORITES_STORAGE_KEY = '@weather_app_favorites_v1';

const DEFAULT_FAVORITES: GeoLocation[] = [
  { name: 'İstanbul', country: 'TR', lat: 41.0082, lon: 28.9784 },
  { name: 'Ankara', country: 'TR', lat: 39.9334, lon: 32.8597 },
  { name: 'İzmir', country: 'TR', lat: 38.4192, lon: 27.1287 },
];

export interface FavoritesState {
  favorites: GeoLocation[];
  isLoaded: boolean;
  addFavorite: (city: GeoLocation) => void;
  removeFavorite: (cityName: string) => void;
  isFavorite: (cityName: string) => boolean;
  loadFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: DEFAULT_FAVORITES,
  isLoaded: false,

  addFavorite: (city: GeoLocation) => {
    const current = get().favorites;
    if (current.some((f) => f.name.toLowerCase() === city.name.toLowerCase())) {
      return;
    }
    const updated = [city, ...current];
    set({ favorites: updated });
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  },

  removeFavorite: (cityName: string) => {
    const updated = get().favorites.filter(
      (f) => f.name.toLowerCase() !== cityName.toLowerCase()
    );
    set({ favorites: updated });
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  },

  isFavorite: (cityName: string) => {
    return get().favorites.some(
      (f) => f.name.toLowerCase() === cityName.toLowerCase()
    );
  },

  loadFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed: GeoLocation[] = JSON.parse(stored);
        set({ favorites: parsed, isLoaded: true });
      } else {
        set({ favorites: DEFAULT_FAVORITES, isLoaded: true });
      }
    } catch {
      set({ favorites: DEFAULT_FAVORITES, isLoaded: true });
    }
  },
}));
