import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { HourlyForecast } from '../../services/weather/types';
import { convertTemperature } from '../../utils/unitConverter';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface HourlyTemperatureChartProps {
  hourly: HourlyForecast[];
  itemWidth?: number;
  height?: number;
}

export const HourlyTemperatureChart: React.FC<HourlyTemperatureChartProps> = ({
  hourly,
  itemWidth = 72,
  height = 80,
}) => {
  const tempUnit = useSettingsStore((s) => s.tempUnit);
  const reducedMotion = useReducedMotion();

  if (!hourly || hourly.length === 0) {
    return null;
  }

  const chartWidth = hourly.length * itemWidth;
  const temps = hourly.map((h) => convertTemperature(h.temp, tempUnit));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 1);

  const paddingTop = 24;
  const paddingBottom = 16;
  const availableHeight = height - paddingTop - paddingBottom;

  // Compute (x, y) coordinates for each point
  const points = hourly.map((h, i) => {
    const x = i * itemWidth + itemWidth / 2;
    const temp = convertTemperature(h.temp, tempUnit);
    const y = paddingTop + (1 - (temp - minTemp) / tempRange) * availableHeight;
    return { x, y, temp };
  });

  // Generate cubic Bezier curve command
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp1y = curr.y;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    const cp2y = next.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }

  // Area path for gradient fill
  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const areaD = `${pathD} L ${lastX} ${height} L ${firstX} ${height} Z`;

  // Total stroke length approximation
  const totalLength = chartWidth * 1.2;
  const strokeProgress = useSharedValue(reducedMotion ? 0 : totalLength);
  const fillOpacity = useSharedValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion) {
      strokeProgress.value = 0;
      fillOpacity.value = 1;
      return;
    }

    strokeProgress.value = totalLength;
    fillOpacity.value = 0;

    strokeProgress.value = withTiming(0, {
      duration: 1300,
      easing: Easing.out(Easing.cubic),
    });

    fillOpacity.value = withTiming(1, {
      duration: 1600,
      easing: Easing.inOut(Easing.ease),
    });
  }, [hourly, reducedMotion]);

  const animatedCurveProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeProgress.value,
  }));

  const animatedAreaProps = useAnimatedProps(() => ({
    opacity: fillOpacity.value,
  }));

  return (
    <View style={{ width: chartWidth, height }}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <SvgLinearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#4FC3F7" stopOpacity="0.45" />
            <Stop offset="0.7" stopColor="#0288D1" stopOpacity="0.1" />
            <Stop offset="1" stopColor="#01579B" stopOpacity="0.0" />
          </SvgLinearGradient>
        </Defs>

        {/* Gradient Area Fill (Animated fade-in) */}
        <AnimatedPath
          d={areaD}
          fill="url(#tempGradient)"
          animatedProps={animatedAreaProps}
        />

        {/* Bezier Stroke Curve (Animated left-to-right draw) */}
        <AnimatedPath
          d={pathD}
          fill="none"
          stroke="#B3E5FC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${totalLength}`}
          animatedProps={animatedCurveProps}
        />

        {/* Points & Labels */}
        {points.map((p, idx) => (
          <React.Fragment key={idx}>
            <Circle
              cx={p.x}
              cy={p.y}
              r={idx === 0 ? '5' : '3.5'}
              fill={idx === 0 ? '#FFD54F' : '#FFFFFF'}
              stroke="#0288D1"
              strokeWidth="2"
            />
            <SvgText
              x={p.x}
              y={p.y - 8}
              fill="#FFFFFF"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              {`${p.temp}°`}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
};
