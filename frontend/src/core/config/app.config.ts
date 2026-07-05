// ============================================================
// app.config.ts — src/core/config/app.config.ts
// MARK: Đổi brandName, tagline, logo tại đây để áp dụng toàn app
// ============================================================

export const AppConfig = {
  appName: 'Modular App',
  brandName: 'Medsphere',
  tagline: 'Kết nối cộng đồng y tế',
  logo: '/src/core/assets/logo.svg',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  version: '1.0.0',
  defaultLanguage: 'vi',
  supportedLanguages: ['en', 'vi'],
};