import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  G,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { WeatherCondition } from '../../services/weather/types';

interface AnimatedWeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  size?: number;
}

export const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({
  condition,
  isDay = true,
  size = 80,
}) => {
  // Animation shared values
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const translateY = useSharedValue(0);
  const dropOffset = useSharedValue(0);
  const flashOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Sun ray rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 16000, easing: Easing.linear }),
      -1,
      false
    );

    // Subtle breathing pulse
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Cloud floating
    translateY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(3, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Rain drop falling
    dropOffset.value = withRepeat(
      withTiming(12, { duration: 800, easing: Easing.linear }),
      -1,
      false
    );

    // Lightning flash
    flashOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150, easing: Easing.linear }),
        withTiming(0.2, { duration: 200, easing: Easing.linear }),
        withTiming(0.8, { duration: 150, easing: Easing.linear }),
        withTiming(0.1, { duration: 1200, easing: Easing.linear })
      ),
      -1,
      false
    );
  }, []);

  const sunRaysStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const cloudFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const rainDropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropOffset.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  // Render based on weather condition
  if (condition === 'clear' && isDay) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[StyleSheet.absoluteFill, sunRaysStyle]}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <SvgLinearGradient id="sunRayGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFD54F" />
                <Stop offset="1" stopColor="#FFA000" />
              </SvgLinearGradient>
            </Defs>
            {/* Sun Rays */}
            <G stroke="url(#sunRayGrad)" strokeWidth="4" strokeLinecap="round">
              <Path d="M50 10 L50 22" />
              <Path d="M50 78 L50 90" />
              <Path d="M10 50 L22 50" />
              <Path d="M78 50 L90 50" />
              <Path d="M22 22 L30 30" />
              <Path d="M70 70 L78 78" />
              <Path d="M22 78 L30 70" />
              <Path d="M70 30 L78 22" />
            </G>
          </Svg>
        </Animated.View>
        <Animated.View style={pulseStyle}>
          <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 60 60">
            <Defs>
              <SvgLinearGradient id="sunCoreGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF176" />
                <Stop offset="0.6" stopColor="#FFB300" />
                <Stop offset="1" stopColor="#FF8F00" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx="30" cy="30" r="24" fill="url(#sunCoreGrad)" />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  if (condition === 'clear' && !isDay) {
    // Night moon + star twinkle
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={pulseStyle}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              <SvgLinearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF9C4" />
                <Stop offset="1" stopColor="#FBC02D" />
              </SvgLinearGradient>
            </Defs>
            {/* Moon Crescent */}
            <Path
              d="M60,20 C40,20 25,35 25,55 C25,75 40,88 60,88 C50,82 44,70 44,55 C44,40 50,28 60,20 Z"
              fill="url(#moonGrad)"
            />
            {/* Twinkling star */}
            <Path
              d="M72,26 L74,32 L80,34 L74,36 L72,42 L70,36 L64,34 L70,32 Z"
              fill="#FFFDE7"
              opacity="0.9"
            />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  if (condition === 'rain' || condition === 'drizzle') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={cloudFloatStyle}>
          <Svg width={size} height={size * 0.75} viewBox="0 0 100 70">
            <Defs>
              <SvgLinearGradient id="rainCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ECEFF1" />
                <Stop offset="1" stopColor="#90A4AE" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M30,55 A18,18 0 0,1 30,22 A24,24 0 0,1 70,20 A18,18 0 0,1 82,42 A14,14 0 0,1 78,55 Z"
              fill="url(#rainCloud)"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={rainDropStyle}>
          <Svg width={size * 0.7} height={size * 0.35} viewBox="0 0 60 30">
            <Path d="M15 5 L12 20" stroke="#4FC3F7" strokeWidth="3" strokeLinecap="round" />
            <Path d="M30 8 L27 23" stroke="#29B6F6" strokeWidth="3" strokeLinecap="round" />
            <Path d="M45 4 L42 19" stroke="#4FC3F7" strokeWidth="3" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  if (condition === 'thunderstorm') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={cloudFloatStyle}>
          <Svg width={size} height={size * 0.75} viewBox="0 0 100 70">
            <Defs>
              <SvgLinearGradient id="stormCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#78909C" />
                <Stop offset="1" stopColor="#37474F" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M30,55 A18,18 0 0,1 30,22 A24,24 0 0,1 70,20 A18,18 0 0,1 82,42 A14,14 0 0,1 78,55 Z"
              fill="url(#stormCloud)"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={flashStyle}>
          <Svg width={size * 0.4} height={size * 0.45} viewBox="0 0 40 45">
            <Path
              d="M24 2 L8 22 L20 22 L14 42 L32 18 L20 18 Z"
              fill="#FFD600"
              stroke="#FFF"
              strokeWidth="1"
            />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  if (condition === 'snow') {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={cloudFloatStyle}>
          <Svg width={size} height={size * 0.75} viewBox="0 0 100 70">
            <Defs>
              <SvgLinearGradient id="snowCloud" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFFFFF" />
                <Stop offset="1" stopColor="#CFD8DC" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M30,55 A18,18 0 0,1 30,22 A24,24 0 0,1 70,20 A18,18 0 0,1 82,42 A14,14 0 0,1 78,55 Z"
              fill="url(#snowCloud)"
            />
          </Svg>
        </Animated.View>
        <Animated.View style={rainDropStyle}>
          <Svg width={size * 0.7} height={size * 0.3} viewBox="0 0 70 30">
            <Circle cx="20" cy="12" r="3.5" fill="#E1F5FE" />
            <Circle cx="35" cy="18" r="4" fill="#FFFFFF" />
            <Circle cx="50" cy="10" r="3.5" fill="#E1F5FE" />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  // Default: Cloud / Partly cloudy
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={cloudFloatStyle}>
        <Svg width={size} height={size * 0.8} viewBox="0 0 100 75">
          <Defs>
            <SvgLinearGradient id="defaultCloud" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="0.6" stopColor="#ECEFF1" />
              <Stop offset="1" stopColor="#B0BEC5" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d="M30,60 A18,18 0 0,1 30,25 A24,24 0 0,1 72,22 A18,18 0 0,1 84,45 A14,14 0 0,1 78,60 Z"
            fill="url(#defaultCloud)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};
