import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { DynamicBackground } from '../../src/components/animations/DynamicBackground';
import { GlassCard } from '../../src/components/common/GlassCard';
import { ApiKeyBanner } from '../../src/components/banner/ApiKeyBanner';
import { useWeatherStore } from '../../src/store/useWeatherStore';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { getWeatherProvider } from '../../src/services/weather';
import { GeoLocation } from '../../src/services/weather/types';

export default function CitiesScreen() {
  const router = useRouter();
  const lang = useSettingsStore((s) => s.lang);
  const activeLocation = useWeatherStore((s) => s.activeLocation);
  const setActiveLocation = useWeatherStore((s) => s.setActiveLocation);
  const userLocation = useWeatherStore((s) => s.userLocation);
  const useCurrentLocation = useWeatherStore((s) => s.useCurrentLocation);
  const isUsingGps = useWeatherStore((s) => s.isUsingGps);

  const favorites = useFavoritesStore((s) => s.favorites);
  const addFavorite = useFavoritesStore((s) => s.addFavorite);
  const removeFavorite = useFavoritesStore((s) => s.removeFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Search cities when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const provider = getWeatherProvider();
        const results = await provider.searchCities(trimmed, lang);
        setSearchResults(results);
      } catch (err: any) {
        setSearchError(
          lang === 'tr'
            ? 'Şehir arama sırasında bir sorun oluştu.'
            : 'An error occurred while searching.'
        );
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, lang]);

  const handleSelectLocation = (loc: GeoLocation) => {
    setActiveLocation(loc, false);
    Keyboard.dismiss();
    router.push('/(tabs)');
  };

  const handleSelectGps = () => {
    useCurrentLocation();
    Keyboard.dismiss();
    router.push('/(tabs)');
  };

  const POPULAR_SUGGESTIONS: GeoLocation[] = [
    { name: 'İstanbul', country: 'TR', lat: 41.0082, lon: 28.9784 },
    { name: 'Ankara', country: 'TR', lat: 39.9334, lon: 32.8597 },
    { name: 'İzmir', country: 'TR', lat: 38.4192, lon: 27.1287 },
    { name: 'Antalya', country: 'TR', lat: 36.8969, lon: 30.7133 },
    { name: 'Bursa', country: 'TR', lat: 40.1885, lon: 29.061 },
  ];

  return (
    <DynamicBackground condition="clear" isDay={false}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ApiKeyBanner />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {lang === 'tr' ? 'Şehirler ve Konum' : 'Cities & Locations'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {lang === 'tr'
              ? 'Hava durumunu takip etmek istediğiniz şehri seçin'
              : 'Choose the city you want to track weather for'}
          </Text>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBarWrap}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.7)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={lang === 'tr' ? 'Şehir adı arayın (ör. Ankara, Londra)...' : 'Search city (e.g. Ankara, London)...'}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="words"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="rgba(255, 255, 255, 0.7)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results Dropdown/List */}
        {isSearching && (
          <View style={styles.searchingRow}>
            <ActivityIndicator size="small" color="#4FC3F7" />
            <Text style={styles.searchingText}>
              {lang === 'tr' ? 'Şehirler aranıyor...' : 'Searching cities...'}
            </Text>
          </View>
        )}

        {searchError && (
          <View style={styles.errorNotice}>
            <Text style={styles.errorText}>{searchError}</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <GlassCard style={styles.resultsCard}>
            <Text style={styles.sectionHeader}>
              {lang === 'tr' ? 'Arama Sonuçları' : 'Search Results'}
            </Text>
            {searchResults.map((item, idx) => {
              const fav = isFavorite(item.name);
              return (
                <View key={`${item.name}_${idx}`} style={styles.resultItem}>
                  <TouchableOpacity
                    style={styles.resultItemTouchable}
                    onPress={() => handleSelectLocation(item)}
                  >
                    <Ionicons name="location-outline" size={20} color="#81D4FA" />
                    <View style={styles.resultTextCol}>
                      <Text style={styles.resultName}>{item.name}</Text>
                      <Text style={styles.resultSub}>
                        {item.state ? `${item.state}, ` : ''}{item.country || ''}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => (fav ? removeFavorite(item.name) : addFavorite(item))}
                    style={styles.favIconBtn}
                  >
                    <Ionicons
                      name={fav ? 'heart' : 'heart-outline'}
                      size={22}
                      color={fav ? '#FF5252' : 'rgba(255, 255, 255, 0.7)'}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </GlassCard>
        )}

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Current Location GPS Quick Card */}
              <TouchableOpacity onPress={handleSelectGps} activeOpacity={0.8}>
                <GlassCard
                  style={[styles.gpsCard, isUsingGps ? styles.activeGpsCard : undefined]}
                  variant={isUsingGps ? 'highlight' : 'normal'}
                >
                  <View style={styles.gpsRow}>
                    <View style={styles.gpsIconCircle}>
                      <Ionicons name="navigate" size={22} color="#0288D1" />
                    </View>
                    <View style={styles.gpsTextCol}>
                      <Text style={styles.gpsTitle}>
                        {lang === 'tr' ? 'Mevcut Konumum' : 'My Current Location'}
                      </Text>
                      <Text style={styles.gpsSubtitle}>
                        {userLocation
                          ? `${userLocation.name}, ${userLocation.country || ''}`
                          : lang === 'tr'
                          ? 'GPS ile otomatik algıla'
                          : 'Auto-detect via GPS'}
                      </Text>
                    </View>
                    {isUsingGps && (
                      <View style={styles.activePill}>
                        <Text style={styles.activePillText}>
                          {lang === 'tr' ? 'AKTİF' : 'ACTIVE'}
                        </Text>
                      </View>
                    )}
                  </View>
                </GlassCard>
              </TouchableOpacity>

              {/* Popular City Suggestions Chips */}
              <View style={styles.chipsSection}>
                <Text style={styles.sectionHeader}>
                  {lang === 'tr' ? 'Hızlı Seçim' : 'Quick Select'}
                </Text>
                <View style={styles.chipsRow}>
                  {POPULAR_SUGGESTIONS.map((city) => (
                    <TouchableOpacity
                      key={city.name}
                      style={[
                        styles.chip,
                        !isUsingGps &&
                        activeLocation.name.toLowerCase() === city.name.toLowerCase()
                          ? styles.activeChip
                          : undefined,
                      ]}
                      onPress={() => handleSelectLocation(city)}
                    >
                      <Text style={styles.chipText}>{city.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.sectionHeader}>
                {lang === 'tr' ? 'Favori Şehirler' : 'Favorite Cities'}
              </Text>
            </>
          }
          renderItem={({ item }) => {
            const isSelected =
              !isUsingGps &&
              activeLocation.name.toLowerCase() === item.name.toLowerCase();

            return (
              <GlassCard
                style={[styles.favCard, isSelected ? styles.activeFavCard : undefined]}
                variant={isSelected ? 'highlight' : 'normal'}
              >
                <TouchableOpacity
                  style={styles.favCardTouchable}
                  onPress={() => handleSelectLocation(item)}
                >
                  <Ionicons name="business-outline" size={22} color="#4FC3F7" />
                  <View style={styles.favTextCol}>
                    <Text style={styles.favCityName}>{item.name}</Text>
                    <Text style={styles.favCountryName}>{item.country || 'TR'}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.activePill}>
                      <Text style={styles.activePillText}>
                        {lang === 'tr' ? 'AKTİF' : 'ACTIVE'}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeFavorite(item.name)}
                  style={styles.trashBtn}
                  accessibilityLabel="Favorilerden Kaldır"
                >
                  <Ionicons name="trash-outline" size={18} color="#FF8A80" />
                </TouchableOpacity>
              </GlassCard>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                {lang === 'tr'
                  ? 'Henüz favori şehir eklemediniz. Yukarıdan arayarak ekleyebilirsiniz.'
                  : 'No favorite cities added yet. Search above to add some.'}
              </Text>
            </View>
          }
        />
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
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    paddingVertical: 8,
  },
  clearBtn: {
    padding: 4,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  searchingText: {
    fontSize: 13,
    color: '#81D4FA',
  },
  errorNotice: {
    backgroundColor: 'rgba(239, 83, 80, 0.2)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  errorText: {
    color: '#FFCDD2',
    fontSize: 13,
    textAlign: 'center',
  },
  resultsCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultTextCol: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  favIconBtn: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  gpsCard: {
    marginBottom: 14,
    padding: 14,
  },
  activeGpsCard: {
    borderColor: '#4FC3F7',
    borderWidth: 1.5,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E1F5FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gpsTextCol: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gpsSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 1,
  },
  activePill: {
    backgroundColor: '#0288D1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chipsSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeChip: {
    backgroundColor: '#0288D1',
    borderColor: '#4FC3F7',
  },
  chipText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  favCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 12,
  },
  activeFavCard: {
    borderColor: '#4FC3F7',
    borderWidth: 1.5,
  },
  favCardTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favTextCol: {
    flex: 1,
  },
  favCityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  favCountryName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trashBtn: {
    padding: 8,
  },
  emptyWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
