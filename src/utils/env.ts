/**
 * API Anahtarı ve Çevre Değişkenleri Yönetimi
 * API anahtarı yoksa, boşsa veya varsayılan yer tutucu değerindeyse mock moda geçer
 * ve konsola uyarı basar.
 */

const PLACEHOLDER_KEY = 'BURAYA_API_ANAHTARINIZI_YAZIN';
const BACKUP_KEY = '67cd44ee9d65056e366646c0ac66461f';

let hasWarnedInConsole = false;

export function getApiKey(): string | undefined {
  const envKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  const key =
    envKey && envKey.trim() !== '' && envKey.trim() !== PLACEHOLDER_KEY
      ? envKey.trim()
      : BACKUP_KEY;

  if (!key || key.trim() === '' || key.trim() === PLACEHOLDER_KEY) {
    return undefined;
  }
  return key.trim();
}

export function isMockMode(): boolean {
  return getApiKey() === undefined;
}

export function checkAndWarnApiKey(): void {
  if (isMockMode() && !hasWarnedInConsole) {
    hasWarnedInConsole = true;
    console.warn(
      '\n=======================================================\n' +
      '⚠️  UYARI: EXPO_PUBLIC_WEATHER_API_KEY EKSİK VEYA GEÇERSİZ!\n' +
      'Uygulama MOCK (sahte veri) modunda çalışıyor.\n' +
      'Gerçek verileri almak için lütfen .env dosyasına geçerli bir OpenWeatherMap API anahtarı ekleyin:\n' +
      'EXPO_PUBLIC_WEATHER_API_KEY=your_api_key_here\n' +
      '=======================================================\n'
    );
  }
}
