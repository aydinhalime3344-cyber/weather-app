import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WeatherCondition } from '../../services/weather/types';

interface DynamicWeatherBackgroundProps {
  condition?: WeatherCondition;
  isDay?: boolean;
  children: React.ReactNode;
}

export const DynamicWeatherBackground: React.FC<DynamicWeatherBackgroundProps> = ({
  condition = 'clear',
  isDay = true,
  children,
}) => {
  const getGradientColors = (): [string, string, string] => {
    if (!isDay) {
      // Night themes
      switch (condition) {
        case 'rain':
        case 'drizzle':
          return ['#0F2027', '#203A43', '#2C5364'];
        case 'thunderstorm':
          return ['#1F1C2C', '#2A0845', '#100E17'];
        case 'snow':
          return ['#1A2980', '#26D0CE', '#141E30'];
        case 'clouds':
          return ['#141E30', '#243B55', '#111827'];
        case 'clear':
        default:
          return ['#0B1021', '#1B2735', '#090A0F'];
      }
    }

    // Day themes
    switch (condition) {
      case 'thunderstorm':
        return ['#283048', '#859398', '#1c1f24'];
      case 'rain':
      case 'drizzle':
        return ['#3a7bd5', '#3a6073', '#233237'];
      case 'snow':
        return ['#83a4d4', '#b6fbff', '#4b6cb7'];
      case 'clouds':
        return ['#3f51b5', '#5c6bc0', '#283593'];
      case 'fog':
      case 'mist':
        return ['#606c88', '#3f4c6b', '#242b35'];
      case 'clear':
      default:
        return ['#1E88E5', '#42A5F5', '#1565C0'];
    }
  };

  return (
    <LinearGradient colors={getGradientColors()} style={styles.container}>
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
