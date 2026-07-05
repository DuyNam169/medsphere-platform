import React from 'react';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { BrandPanel } from '../components/BrandPanel';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <BrandPanel />
      </aside>

      <main className="auth-form-panel">
        <ForgotPasswordForm />
      </main>
    </div>
  );
};

export default ForgotPasswordPage;