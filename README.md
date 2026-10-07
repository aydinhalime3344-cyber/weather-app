# WeatherPulse - Çapraz Platform (Mobil + Web) Animasyonlu Hava Durumu Uygulaması

Modern, akıcı animasyonlara sahip, iOS, Android ve Web (React Native Web) üzerinde çalışan, Expo SDK ve TypeScript ile geliştirilmiş hava durumu uygulaması.

---

## ⚠️ API ANAHTARINI EKLEMEYİ UNUTMAYIN!

Uygulama, geçerli bir API anahtarı eklenene kadar **MOCK (Sahte Veri) Modunda** çalışır ve ekranın üstünde kalıcı bir uyarı banner'ı gösterir.

### API Anahtarı Nasıl Eklenir? (Adım Adım)

1. **API Anahtarı Alın:**
   - [OpenWeatherMap Kayıt Sayfası](https://openweathermap.org/appid) adresine gidin ve ücretsiz bir hesap açın.
   - Hesabınızın "API keys" bölümünden ücretsiz API anahtarınızı kopyalayın (yeni oluşturulan anahtarların OpenWeather tarafında aktifleşmesi 10-30 dakika sürebilir).

2. **`.env` Dosyasını Düzenleyin:**
   - Projenin kök dizininde bulunan `.env` dosyasını açın (eğer yoksa `.env.example` dosyasını kopyalayarak `.env` oluşturun).
   - `EXPO_PUBLIC_WEATHER_API_KEY` değişkenine anahtarınızı yapıştırın:
     ```env
     EXPO_PUBLIC_WEATHER_API_KEY=buraya_aldiginiz_gercek_api_anahtarinizi_yazin
     ```

3. **Uygulamayı Yeniden Başlatın:**
   - Terminalde çalışan sunucuyu durdurun (`Ctrl + C`) ve önbelleği temizleyerek yeniden başlatın:
     ```bash
     npm run start -c
     # veya web için
     npm run web
     ```

> 🔒 **GÜVENLİK NOTU:**
> İstemci tarafında tanımlanan `EXPO_PUBLIC_` değişkenleri tarayıcıda derlenmiş JavaScript dosyaları incelenerek görülebilir. Canlıya (production) çıkarken API isteklerinin doğrudan istemciden değil, bir backend proxy (ör. Cloudflare Worker, Firebase Cloud Functions veya Vercel Serverless) üzerinden atılması önerilir.

---

## 🌟 Öne Çıkan Özellikler

1. **Çapraz Platform:**
   - iOS, Android ve Web üzerinde tam uyumlu tek kod tabanı (`react-native-web`).
2. **Sağlayıcı Soyutlaması (Provider Pattern):**
   - `WeatherProvider` arayüzü sayesinde OpenWeatherMap, Mock veriler veya gelecekte eklenebilecek sağlayıcılar (Open-Meteo, WeatherAPI) tek satırla değiştirilebilir.
3. **Akıcı Animasyonlar & SVG Grafikler:**
   - 24 saatlik yumuşak Bezier eğrisi (`react-native-svg`).
   - Dinamik rüzgar pusulası ve dönen iğne (`react-native-reanimated`).
   - Güneşin doğuş ve batış yayını hesaplayıp mevcut konumunu gösteren interaktif gün döngüsü arkı (`SunCycleCard`).
   - Hava durumuna göre canlanan SVG ikonlar (dönen güneş ışınları, nefes alan bulutlar, düşen yağmur damlaları, çakan şimşekler).
4. **Tahmin Seçimi & Lineer İnterpolasyon:**
   - OpenWeather 5 gün / 3 saatlik API verisinden **lineer interpolasyon** tekniği kullanılarak 24 saatlik kesintisiz saatlik sıcaklık, hissedilen sıcaklık ve yağış olasılığı eğrisi üretilmiştir. Bu sayede grafikte kesintili kırılmalar yerine ipeksi yumuşaklıkta bir Bezier eğrisi sunulmaktadır.
   - 5 günlük tahmin bölümünde 3 saatlik bloklar gün bazında kümelenerek min/max sıcaklıklar, baskın hava durumu ikonu ve açılır/kapanır (accordion) gün detayları listelenir.
5. **Konum ve Şehir Yönetimi:**
   - `expo-location` ile GPS tabanlı otomatik konum tespiti ve tersine coğrafi kodlama (reverse geocoding).
   - Canlı şehir arama ve favori şehirler listesi (`AsyncStorage` kalıcı depolama).
   - "Mevcut Konumum" ve seçilen şehirler arasında tek dokunuşla geçiş.
6. **Önbellek & Çevrimdışı Çalışma:**
   - `@tanstack/react-query` ile 10 dakika `staleTime` önbellekleme.
   - Son başarılı veri `AsyncStorage`'a kaydedilir; internet bağlantısı kesildiğinde son veri `"Son güncelleme: HH:mm (Çevrimdışı)"` rozetiyle kesintisiz gösterilir.
7. **Özelleştirme ve Ayarlar:**
   - Birimler: Santigrat (°C) / Fahrenhayt (°F)
   - Rüzgar Birimleri: km/s, m/s, mph
   - Tema: Sistem / Koyu / Açık
   - Dil Desteği: Türkçe ve İngilizce

> 🌐 **Web Ortamı Konum Notu:**
> Web tarayıcılarında Geolocation API'nin çalışması için tarayıcı güvenlik politikaları gereği sayfanın `localhost` veya geçerli bir `HTTPS` bağlantısı üzerinden açılması gerekir.

---

## 🛠️ Teknoloji Yığını

- **Framework:** Expo SDK 57 + React Native 0.86 + React 19
- **Yönlendirme:** Expo Router 57 (File-based routing)
- **Durum Yönetimi:** Zustand 5
- **Veri Çekme & Önbellek:** TanStack React Query 5
- **Kalıcı Depolama:** `@react-native-async-storage/async-storage`
- **Animasyon & Vektör Çizim:** `react-native-reanimated` + `react-native-svg` + `expo-linear-gradient`
- **İkonlar:** `@expo/vector-icons` (Ionicons)
- **Test:** Jest + ts-jest

---

## 🚀 Kurulum ve Çalıştırma

### Bağımlılıkları Yükleme
```bash
npm install
```

### Web'de Çalıştırma
```bash
npm run web
```

### Android veya iOS'ta Çalıştırma
```bash
# Android emülatör veya cihaz için
npm run android

# iOS simülatör için (yalnızca macOS)
npm run ios
```

### Testleri Çalıştırma
```bash
npm test
```

---

## 📁 Proje Yapısı

```
weather-app/
├── app/                           # Expo Router rotaları
│   ├── _layout.tsx                # Kök layout (QueryClient, StatusBar, Temalar)
│   └── (tabs)/
│       ├── _layout.tsx            # Alt sekme çubuğu
│       ├── index.tsx              # Ana Hava Durumu Paneli
│       ├── cities.tsx             # Şehir Arama ve Favoriler
│       └── settings.tsx           # Ayarlar ve API Anahtarı Durumu
├── src/
│   ├── components/
│   │   ├── banner/ApiKeyBanner.tsx
│   │   ├── common/                # GlassCard, DynamicWeatherBackground, ErrorStateView
│   │   └── weather/               # HeroCard, HourlyForecast, SunCycle, WindCompass, SvgChart
│   ├── services/
│   │   └── weather/               # Provider arayüzü, OpenWeather, MockProvider, Mappers
│   ├── store/                     # Zustand store'ları (Settings, Favorites, Weather)
│   ├── hooks/                     # useWeatherQuery, useUserLocation
│   └── utils/                     # interpolation, dateUtils, unitConverter, env
└── __tests__/                     # Servis ve mapper birim testleri
```
