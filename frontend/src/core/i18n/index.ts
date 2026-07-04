// ============================================================
// index.ts — src/core/i18n/index.ts
// Core i18n setup. Merges translations from all packages.
// Pattern: each package exports its own en/vi, we deep-merge here.
// ============================================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppConfig } from '../config/app.config';

// Core translations (common keys only — no package-specific)
import coreEn from './locales/en.json';
import coreVi from './locales/vi.json';

// Package translations — import and merge
import authEn from '../../packages/auth/i18n/en';
import authVi from '../../packages/auth/i18n/vi';

// Deep merge helper
const merge = (...sources: object[]) =>
  Object.assign({}, ...sources);

const resources = {
  en: {
    translation: merge(coreEn, authEn),
  },
  vi: {
    translation: merge(coreVi, authVi),
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: AppConfig.defaultLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  // Avoid re-initializing in HMR
  initImmediate: false,
});

export default i18n;