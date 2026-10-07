const TURKISH_DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const ENGLISH_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatDayName(dateInput: Date | number | string, lang: 'tr' | 'en' = 'tr'): string {
  const date = typeof dateInput === 'object' ? dateInput : new Date(typeof dateInput === 'number' && dateInput < 10000000000 ? dateInput * 1000 : dateInput);
  const today = new Date();
  
  // Check if today
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return lang === 'tr' ? 'Bugün' : 'Today';
  }

  // Check if tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isTomorrow) {
    return lang === 'tr' ? 'Yarın' : 'Tomorrow';
  }

  const dayIndex = date.getDay();
  return lang === 'tr' ? TURKISH_DAYS[dayIndex] : ENGLISH_DAYS[dayIndex];
}

export function formatTime(timestampSeconds: number): string {
  const date = new Date(timestampSeconds * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatCurrentDate(lang: 'tr' | 'en' = 'tr'): string {
  const date = new Date();
  const day = date.getDate();
  const monthsTr = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = lang === 'tr' ? monthsTr[date.getMonth()] : monthsEn[date.getMonth()];
  const dayName = formatDayName(date, lang);
  return `${day} ${monthName}, ${dayName}`;
}
