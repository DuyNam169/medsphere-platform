// ============================================================
// routes/index.tsx — Cấu hình routing toàn bộ app
// "/" → HomePage
// "/ai" → AiPage (AI Chatbot)
// "/login" → LoginPage
// "/dashboard" → DashboardPage (cần đăng nhập)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage, DashboardPage, UsersPage } from '../modules/user/pages';
import { HomePage } from '../modules/home';
import { AiPage } from '../modules/ai';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ — public */}
        <Route path="/" element={<HomePage />} />

        {/* AI Chatbot — public (không cần đăng nhập để chat cơ bản) */}
        <Route path="/ai" element={<AiPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};