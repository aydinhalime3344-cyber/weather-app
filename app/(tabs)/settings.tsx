import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DynamicBackground } from '../../src/components/animations/DynamicBackground';
import { GlassCard } from '../../src/components/common/GlassCard';
import { ApiKeyBanner } from '../../src/components/banner/ApiKeyBanner';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { isMockMode } from '../../src/utils/env';
import { TemperatureUnit, WindSpeedUnit } from '../../src/utils/unitConverter';

export default function SettingsScreen() {
  const {
    tempUnit,
    setTempUnit,
    windUnit,
    setWindUnit,
    theme,
    setTheme,
    lang,
    setLang,
  } = useSettingsStore();

  const isMock = isMockMode();

  return (
    <DynamicBackground condition="clear" isDay={false}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ApiKeyBanner />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {lang === 'tr' ? 'Ayarlar' : 'Settings'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {lang === 'tr'
              ? 'Uygulama tercihlerinizi ve birimlerinizi özelleştirin'
              : 'Customize your preferences and display units'}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Temperature Unit Setting */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="thermometer-outline" size={20} color="#FF8A80" />
              <Text style={styles.sectionTitle}>
                {lang === 'tr' ? 'Sıcaklık Birimi' : 'Temperature Unit'}
              </Text>
            </View>

            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  tempUnit === 'celsius' && styles.segmentActive,
                ]}
                onPress={() => setTempUnit('celsius')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    tempUnit === 'celsius' && styles.segmentTextActive,
                  ]}
                >
                  Santigrat (°C)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  tempUnit === 'fahrenheit' && styles.segmentActive,
                ]}
                onPress={() => setTempUnit('fahrenheit')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    tempUnit === 'fahrenheit' && styles.segmentTextActive,
                  ]}
                >
                  Fahrenhayt (°F)
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Wind Speed Unit Setting */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="navigate-outline" size={20} color="#81D4FA" />
              <Text style={styles.sectionTitle}>
                {lang === 'tr' ? 'Rüzgar Hızı Birimi' : 'Wind Speed Unit'}
              </Text>
            </View>

            <View style={styles.segmentedControl}>
              {(['kmh', 'ms', 'mph'] as WindSpeedUnit[]).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.segmentBtn,
                    windUnit === unit && styles.segmentActive,
                  ]}
                  onPress={() => setWindUnit(unit)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      windUnit === unit && styles.segmentTextActive,
                    ]}
                  >
                    {unit === 'kmh' ? 'km/s' : unit === 'ms' ? 'm/s' : 'mph'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          {/* Language Setting */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="language-outline" size={20} color="#AED581" />
              <Text style={styles.sectionTitle}>
                {lang === 'tr' ? 'Dil (Language)' : 'Language'}
              </Text>
            </View>

            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segmentBtn, lang === 'tr' && styles.segmentActive]}
                onPress={() => setLang('tr')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    lang === 'tr' && styles.segmentTextActive,
                  ]}
                >
                  🇹🇷 Türkçe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, lang === 'en' && styles.segmentActive]}
                onPress={() => setLang('en')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    lang === 'en' && styles.segmentTextActive,
                  ]}
                >
                  🇬🇧 English
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Theme Setting */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="color-palette-outline" size={20} color="#BA68C8" />
              <Text style={styles.sectionTitle}>
                {lang === 'tr' ? 'Görünüm Teması' : 'Appearance Theme'}
              </Text>
            </View>

            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segmentBtn, theme === 'system' && styles.segmentActive]}
                onPress={() => setTheme('system')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    theme === 'system' && styles.segmentTextActive,
                  ]}
                >
                  {lang === 'tr' ? 'Sistem' : 'System'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, theme === 'dark' && styles.segmentActive]}
                onPress={() => setTheme('dark')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    theme === 'dark' && styles.segmentTextActive,
                  ]}
                >
                  {lang === 'tr' ? 'Koyu' : 'Dark'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.segmentBtn, theme === 'light' && styles.segmentActive]}
                onPress={() => setTheme('light')}
              >
                <Text
                  style={[
                    styles.segmentText,
                    theme === 'light' && styles.segmentTextActive,
                  ]}
                >
                  {lang === 'tr' ? 'Açık' : 'Light'}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* API Key Status & Instructions Card */}
          <GlassCard style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="key-outline" size={20} color="#FFB74D" />
              <Text style={styles.sectionTitle}>
                {lang === 'tr' ? 'API Anahtarı Durumu' : 'API Key Status'}
              </Text>
            </View>

            <View style={styles.statusBox}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  {lang === 'tr' ? 'Mevcut Durum:' : 'Current Status:'}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isMock ? '#FFA000' : '#4CAF50' },
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {isMock
                      ? lang === 'tr'
                        ? 'MOCK (Sahte Veri)'
                        : 'MOCK MODE'
                      : lang === 'tr'
                      ? 'CANLI (OpenWeather)'
                      : 'LIVE'}
                  </Text>
                </View>
              </View>

              <Text style={styles.apiInstructions}>
                {lang === 'tr'
                  ? 'Canlı OpenWeather verilerine bağlanmak için projenin kök dizinindeki .env dosyasına anahtarınızı ekleyin:'
                  : 'To connect to live OpenWeather data, add your key to the .env file in the project root:'}
              </Text>

              <View style={styles.codeSnippet}>
                <Text style={styles.codeText}>
                  EXPO_PUBLIC_WEATHER_API_KEY=your_key_here
                </Text>
              </View>

              <Text style={styles.securityNote}>
                🔒 {lang === 'tr'
                  ? 'Güvenlik Notu: İstemci tarafı anahtarlar tarayıcıda görülebilir; canlıya çıkarken Cloudflare Worker veya Firebase Function gibi bir backend proxy üzerinden istek atılması önerilir.'
                  : 'Security Note: Client-side keys are visible in browsers; for production, use a backend proxy like Cloudflare Worker or Firebase Function.'}
              </Text>
            </View>
          </GlassCard>

          {/* App Info Footer */}
          <View style={styles.appInfo}>
            <Text style={styles.appName}>WeatherPulse v1.0.0</Text>
            <Text style={styles.appSub}>Expo • React Native • TypeScript</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  sectionCard: {
    marginBottom: 14,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#0288D1',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    padding: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  apiInstructions: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
    marginBottom: 8,
  },
  codeSnippet: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#FFE082',
    fontSize: 12,
  },
  securityNote: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    opacity: 0.6,
  },
  appName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
});
