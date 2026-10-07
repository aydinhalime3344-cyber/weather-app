import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { useSettingsStore } from '../../store/useSettingsStore';

export type ErrorType =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'OFFLINE'
  | 'API_401'
  | 'API_429'
  | 'API_SERVER'
  | 'GENERIC';

interface ErrorStateViewProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
  onSearchCity?: () => void;
}

export const ErrorStateView: React.FC<ErrorStateViewProps> = ({
  type = 'GENERIC',
  message,
  onRetry,
  onSearchCity,
}) => {
  const lang = useSettingsStore((s) => s.lang);

  const getErrorContent = () => {
    switch (type) {
      case 'PERMISSION_DENIED':
        return {
          icon: 'location-outline' as const,
          iconColor: '#FFA726',
          title: lang === 'tr' ? 'Konum İzni Gerekli' : 'Location Permission Required',
          defaultMsg:
            lang === 'tr'
              ? 'Mevcut konumunuzdaki hava durumunu otomatik görmek için lütfen konum izni verin.'
              : 'Please grant location permission to view weather for your current position.',
        };
      case 'OFFLINE':
        return {
          icon: 'cloud-offline-outline' as const,
          iconColor: '#EF5350',
          title: lang === 'tr' ? 'İnternet Bağlantısı Yok' : 'No Internet Connection',
          defaultMsg:
            lang === 'tr'
              ? 'Lütfen internet bağlantınızı kontrol edip tekrar deneyin.'
              : 'Please check your internet connection and try again.',
        };
      case 'API_401':
        return {
          icon: 'key-outline' as const,
          iconColor: '#FF7043',
          title: lang === 'tr' ? 'Geçersiz API Anahtarı' : 'Invalid API Key',
          defaultMsg:
            lang === 'tr'
              ? '.env dosyasındaki EXPO_PUBLIC_WEATHER_API_KEY anahtarı geçersiz veya henüz aktifleşmemiş olabilir.'
              : 'The EXPO_PUBLIC_WEATHER_API_KEY in .env may be invalid or not yet activated.',
        };
      case 'API_429':
        return {
          icon: 'timer-outline' as const,
          iconColor: '#FFA726',
          title: lang === 'tr' ? 'İstek Limiti Aşıldı' : 'Rate Limit Exceeded',
          defaultMsg:
            lang === 'tr'
              ? 'Kısa süre içinde çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyin.'
              : 'Too many requests sent in a short time. Please try again later.',
        };
      case 'POSITION_UNAVAILABLE':
        return {
          icon: 'navigate-outline' as const,
          iconColor: '#42A5F5',
          title: lang === 'tr' ? 'Konum Alınamadı' : 'Location Unavailable',
          defaultMsg:
            lang === 'tr'
              ? 'Cihazınızdan GPS konumu alınamadı. Manuel olarak şehir arayabilirsiniz.'
              : 'Could not obtain GPS coordinates. You can search for a city manually.',
        };
      default:
        return {
          icon: 'alert-circle-outline' as const,
          iconColor: '#FF7043',
          title: lang === 'tr' ? 'Bir Hata Oluştu' : 'An Error Occurred',
          defaultMsg:
            lang === 'tr'
              ? 'Hava durumu bilgisi yüklenirken bir sorun oluştu.'
              : 'Something went wrong while loading weather data.',
        };
    }
  };

  const content = getErrorContent();

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <View style={[styles.iconCircle, { backgroundColor: `${content.iconColor}22` }]}>
          <Ionicons name={content.icon} size={38} color={content.iconColor} />
        </View>

        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.message}>{message || content.defaultMsg}</Text>

        <View style={styles.actionsRow}>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.8}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>
                {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
              </Text>
            </TouchableOpacity>
          )}

          {onSearchCity && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={onSearchCity}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={16} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>
                {lang === 'tr' ? 'Şehir Ara' : 'Search City'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0288D1',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
