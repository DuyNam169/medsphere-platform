// ============================================================
// router.tsx — src/app/router.tsx  (hoặc src/routes/index.tsx)
// App-level routing. Imports pages from packages.
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Packages — import from barrel
import { LoginPage, RegisterPage, ForgotPasswordPage, LogoutAllDevicesPage } from '../packages/auth';

// Home & AI (existing)
import { HomePage } from '../packages/home';
import { AiPage } from '../packages/ai';
import { RouteLoadingBar } from '../core/components';

// Dashboard / Users (existing)
import { DashboardPage, UsersPage } from '../packages/user/pages';


export const AppRoutes = () => (
  <BrowserRouter>
  <RouteLoadingBar />
    <Routes>
      {/* Public */}
      <Route path="/"       element={<HomePage />} />
      <Route path="/ai"     element={<AiPage />} />
      <Route path="/login"  element={<LoginPage />} />

      {/* TODO: add /register → RegisterPage from auth package */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/security/logout-all-devices" element={<LogoutAllDevicesPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users"     element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);