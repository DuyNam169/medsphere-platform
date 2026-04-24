// ============================================================
// app.config.ts — src/core/config/app.config.ts
// MARK: Đổi brandName, tagline, logo tại đây để áp dụng toàn app
// ============================================================

export const AppConfig = {
  appName: 'Modular App',
  // MARK: Đổi tên thương hiệu hiển thị trên giao diện
  brandName: 'Medsphere',
  // MARK: Tagline cho trang login
  tagline: 'Kết nối cộng đồng y tế',
  logo: '/src/core/assets/logo.svg',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  version: '1.0.0',
  defaultLanguage: 'vi',
  supportedLanguages: ['en', 'vi'],
};
