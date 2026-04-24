import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { AppConfig } from '../config/app.config';
import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: AppConfig.defaultLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
