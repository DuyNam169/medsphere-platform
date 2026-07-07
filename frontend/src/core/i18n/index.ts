// ============================================================
// index.ts — src/core/i18n/index.ts
// Core i18n setup. Merges translations from all packages.
// Priority: user-saved setting > IP-detected language > English.
// ============================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '../utils/storage';
import { detectLanguageFromIp } from './detectLanguage';

// Core translations (common keys only — no package-specific)
import coreEn from './locales/en.json';
import coreVi from './locales/vi.json';

// Package translations — import and merge
import authEn from '../../packages/auth/i18n/en';
import authVi from '../../packages/auth/i18n/vi';
import aiEn from '../../packages/ai/i18n/en';
import aiVi from '../../packages/ai/i18n/vi';

export const LANGUAGE_STORAGE_KEY = 'app_language';

// Deep merge helper
const merge = (...sources: object[]) => Object.assign({}, ...sources);

const resources = {
  en: {
    translation: merge(coreEn, authEn, aiEn),
  },
  vi: {
    translation: merge(coreVi, authVi, aiVi),
  },
};

// Ngôn ngữ khởi động tạm thời — dùng setting đã lưu nếu có, không thì 'en' trong lúc chờ detect
const savedLanguage = storage.get(LANGUAGE_STORAGE_KEY);
const initialLanguage = savedLanguage || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  initImmediate: false,
});

// Chỉ auto-detect qua IP nếu người dùng CHƯA từng chọn ngôn ngữ trong Settings.
// Nếu đã có setting đã lưu, setting luôn được ưu tiên — không detect lại.
if (!savedLanguage) {
  detectLanguageFromIp().then((detectedLang) => {
    i18n.changeLanguage(detectedLang);
  });
}

/**
 * Gọi hàm này từ trang Settings khi người dùng chọn ngôn ngữ thủ công.
 * Việc lưu vào storage khiến setting có độ ưu tiên cao nhất từ lần load sau.
 */
export const setUserLanguagePreference = (lang: string) => {
  storage.set(LANGUAGE_STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
};

export default i18n;