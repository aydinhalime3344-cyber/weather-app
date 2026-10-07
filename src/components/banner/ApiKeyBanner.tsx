import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { isMockMode } from '../../utils/env';

export const ApiKeyBanner: React.FC = () => {
  const isMock = isMockMode();

  if (!isMock) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={22} color="#FFA000" />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>⚠️ API Anahtarı Eksik</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MOCK MODU AKTİF</Text>
          </View>
        </View>
        <Text style={styles.message}>
          Lütfen .env dosyasına{' '}
          <Text style={styles.codeText}>EXPO_PUBLIC_WEATHER_API_KEY</Text> değerini ekleyin.
          Şu an gerçekçi sahte verilerle çalışılıyor.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: 'rgba(255, 160, 0, 0.16)',
    borderColor: 'rgba(255, 179, 0, 0.55)',
    borderWidth: 1.5,
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: Platform.OS === 'web' ? 12 : 6,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 10,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFE082',
  },
  badge: {
    backgroundColor: '#FF8F00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 16,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '600',
    color: '#FFF59D',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
});
