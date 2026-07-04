// ============================================================
// index.ts — src/packages/auth/index.ts
// Barrel export for auth package.
// Import CSS here so it's loaded once when package is used.
// ============================================================

import './styles/auth.css';

// Pages
export { default as LoginPage } from './pages/LoginPage';

// Components (if needed by other packages — e.g. LoginModal)
export { LoginForm } from './components/LoginForm';
export { BrandPanel } from './components/BrandPanel';

// Hook (for embedding login logic elsewhere)
export { useLogin } from './hooks/useLogin';

// Types
export type {
  LoginRequest,
  LoginResponse,
  AuthUser,
  LoginFormValues,
  LoginFormErrors,
  UseLoginReturn,
} from './types/auth.types';

// i18n — merged into core i18n on app init
export { default as authEn } from './i18n/en';
export { default as authVi } from './i18n/vi';