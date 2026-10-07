export const WeatherGradients = {
  clearDay: ['#1E88E5', '#42A5F5', '#1565C0'] as const,
  clearNight: ['#0B1021', '#1B2735', '#090A0F'] as const,
  goldenHour: ['#E65100', '#F57C00', '#FF8F00', '#D84315'] as const, // Gün doğumu/batımı
  cloudsDay: ['#3949AB', '#5C6BC0', '#283593'] as const,
  cloudsNight: ['#141E30', '#243B55', '#111827'] as const,
  rainDay: ['#283E51', '#4B79A1', '#1E3C72'] as const,
  rainNight: ['#0F2027', '#203A43', '#2C5364'] as const,
  thunderstorm: ['#1F1C2C', '#2A0845', '#120E1C'] as const,
  snowDay: ['#5C7894', '#8AA9C6', '#3D5A75'] as const,
  snowNight: ['#1A2980', '#26D0CE', '#141E30'] as const,
  fog: ['#4E5D6C', '#606C88', '#2C3E50'] as const,
};

export const AppTheme = {
  dark: {
    background: '#0B1021',
    surface: 'rgba(255, 255, 255, 0.12)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.22)',
    surfaceSubtle: 'rgba(255, 255, 255, 0.07)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.78)',
    textMuted: 'rgba(255, 255, 255, 0.45)',
    border: 'rgba(255, 255, 255, 0.22)',
    accent: '#4FC3F7',
    warning: '#FFA000',
    danger: '#FF5252',
    tabBar: '#0F172A',
  },
  light: {
    background: '#F0F4F8',
    surface: 'rgba(255, 255, 255, 0.65)',
    surfaceHighlight: 'rgba(255, 255, 255, 0.85)',
    surfaceSubtle: 'rgba(255, 255, 255, 0.45)',
    textPrimary: '#1E293B',
    textSecondary: 'rgba(30, 41, 59, 0.82)',
    textMuted: 'rgba(30, 41, 59, 0.55)',
    border: 'rgba(255, 255, 255, 0.8)',
    accent: '#0288D1',
    warning: '#F57C00',
    danger: '#D32F2F',
    tabBar: '#FFFFFF',
  },
};
