import { useColorScheme } from 'react-native';
import { AppTheme, WeatherGradients } from './colors';
import { useSettingsStore } from '../store/useSettingsStore';

export * from './colors';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themePreference = useSettingsStore((s) => s.theme);

  const isDark =
    themePreference === 'system'
      ? systemScheme !== 'light'
      : themePreference === 'dark';

  const theme = isDark ? AppTheme.dark : AppTheme.light;

  return {
    isDark,
    theme,
    gradients: WeatherGradients,
  };
}
