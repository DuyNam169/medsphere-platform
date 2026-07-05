import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import { RegisterForm } from '../components/RegisterForm';
import { BrandPanel } from '../components/BrandPanel';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <BrandPanel />
      </aside>

      <main className="auth-form-panel">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;