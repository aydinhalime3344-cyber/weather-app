import tr from './tr.json';
import en from './en.json';
import { useSettingsStore } from '../store/useSettingsStore';

type TranslationType = typeof tr;

const translations: Record<'tr' | 'en', TranslationType> = {
  tr,
  en,
};

export function useI18n() {
  const lang = useSettingsStore((s) => s.lang);
  const current = translations[lang] || translations.tr;

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = current;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return path;
      }
    }
    return typeof result === 'string' ? result : path;
  };

  return { t, lang, strings: current };
}
