// ============================================================
// detectLanguage.ts — src/core/i18n/detectLanguage.ts
// Gọi BE để detect ngôn ngữ theo IP, có fallback an toàn.
// ============================================================

import { AppConfig } from '../config/app.config';

interface LanguageDetectResponse {
  countryCode: string | null;
  language: string;
}

const FALLBACK_LANGUAGE = 'en';

export const detectLanguageFromIp = async (): Promise<string> => {
  try {
    const response = await fetch(`${AppConfig.apiUrl}/v1/geo/language`, {
      method: 'GET',
    });

    if (!response.ok) {
      return FALLBACK_LANGUAGE;
    }

    const json = await response.json();
    const data: LanguageDetectResponse = json.data;

    if (data?.language && AppConfig.supportedLanguages.includes(data.language)) {
      return data.language;
    }

    return FALLBACK_LANGUAGE;
  } catch (error) {
    console.warn('[detectLanguage] Failed to detect language from IP:', error);
    return FALLBACK_LANGUAGE;
  }
};