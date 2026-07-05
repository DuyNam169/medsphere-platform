// ============================================================
// LoginPage.tsx — src/packages/auth/pages/LoginPage.tsx
// Split-screen layout:
//   Left  — brand panel (hidden on mobile)
//   Right — login form
// Fully responsive: mobile / tablet / desktop
// ============================================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import { LoginForm } from '../components/LoginForm';
import { BrandPanel } from '../components/BrandPanel';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      {/* Left: brand panel (tablet+ only) */}
      <aside className="auth-brand-panel">
        <BrandPanel />
      </aside>

      {/* Right: form panel */}
      <main className="auth-form-panel">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;