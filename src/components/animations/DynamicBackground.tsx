import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { WeatherCondition } from '../../services/weather/types';
import { WeatherGradients } from '../../theme/colors';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SunRaysLayer } from './SunRaysLayer';
import { StarsLayer } from './StarsLayer';
import { CloudsLayer } from './CloudsLayer';
import { RainLayer } from './RainLayer';
import { SnowLayer } from './SnowLayer';
import { FogLayer } from './FogLayer';

interface DynamicBackgroundProps {
  condition?: WeatherCondition;
  isDay?: boolean;
  sunrise?: number;
  sunset?: number;
  currentDt?: number;
  isGoldenHour?: boolean;
  children: React.ReactNode;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  condition = 'clear',
  isDay = true,
  sunrise,
  sunset,
  currentDt,
  isGoldenHour = false,
  children,
}) => {
  const reducedMotion = useReducedMotion();

  // Check if current time is golden hour (sunrise / sunset)
  const isTimeGoldenHour = (): boolean => {
    if (isGoldenHour) return true;
    if (!sunrise || !sunset) return false;
    const now = currentDt || Math.floor(Date.now() / 1000);
    const SUNRISE_WINDOW = 2400; // 40 minutes
    const SUNSET_WINDOW = 2400;
    const nearSunrise = Math.abs(now - sunrise) <= SUNRISE_WINDOW;
    const nearSunset = Math.abs(now - sunset) <= SUNSET_WINDOW;
    return nearSunrise || nearSunset;
  };

  const getGradientColors = (): readonly [string, string, ...string[]] => {
    if (isTimeGoldenHour()) {
      return WeatherGradients.goldenHour;
    }

    if (!isDay) {
      switch (condition) {
        case 'rain':
        case 'drizzle':
          return WeatherGradients.rainNight;
        case 'thunderstorm':
          return WeatherGradients.thunderstorm;
        case 'snow':
          return WeatherGradients.snowNight;
        case 'clouds':
          return WeatherGradients.cloudsNight;
        case 'fog':
        case 'mist':
          return WeatherGradients.fog;
        case 'clear':
        default:
          return WeatherGradients.clearNight;
      }
    }

    switch (condition) {
      case 'thunderstorm':
        return WeatherGradients.thunderstorm;
      case 'rain':
      case 'drizzle':
        return WeatherGradients.rainDay;
      case 'snow':
        return WeatherGradients.snowDay;
      case 'clouds':
        return WeatherGradients.cloudsDay;
      case 'fog':
      case 'mist':
        return WeatherGradients.fog;
      case 'clear':
      default:
        return WeatherGradients.clearDay;
    }
  };

  const currentColors = getGradientColors();
  const [prevColors, setPrevColors] = useState(currentColors);
  const [activeColors, setActiveColors] = useState(currentColors);
  const fadeProgress = useSharedValue(1);

  const prevColorsKey = useRef(currentColors.join(','));

  useEffect(() => {
    const key = currentColors.join(',');
    if (key !== prevColorsKey.current) {
      setPrevColors(activeColors);
      setActiveColors(currentColors);
      prevColorsKey.current = key;

      fadeProgress.value = 0;
      fadeProgress.value = withTiming(1, {
        duration: reducedMotion ? 150 : 850,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [currentColors, reducedMotion]);

  const crossFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeProgress.value,
  }));

  // Render particle effect layer
  const renderParticleLayer = () => {
    if (isTimeGoldenHour()) {
      return <SunRaysLayer reducedMotion={reducedMotion} />;
    }

    switch (condition) {
      case 'clear':
        return isDay ? (
          <SunRaysLayer reducedMotion={reducedMotion} />
        ) : (
          <StarsLayer reducedMotion={reducedMotion} />
        );
      case 'clouds':
        return <CloudsLayer reducedMotion={reducedMotion} />;
      case 'rain':
      case 'drizzle':
        return <RainLayer isThunderstorm={false} reducedMotion={reducedMotion} />;
      case 'thunderstorm':
        return <RainLayer isThunderstorm={true} reducedMotion={reducedMotion} />;
      case 'snow':
        return <SnowLayer reducedMotion={reducedMotion} />;
      case 'fog':
      case 'mist':
        return <FogLayer reducedMotion={reducedMotion} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient Layer 1 (Previous) */}
      <LinearGradient colors={prevColors as [string, string, ...string[]]} style={StyleSheet.absoluteFill} />

      {/* Background Gradient Layer 2 (Active with Cross-fade) */}
      <Animated.View style={[StyleSheet.absoluteFill, crossFadeStyle]}>
        <LinearGradient
          colors={activeColors as [string, string, ...string[]]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Active Ambient Particle Layer */}
      {renderParticleLayer()}

      {/* Main Content Layer */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
