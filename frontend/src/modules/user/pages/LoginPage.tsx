import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { AuthLayout } from '../../../core/layouts';
import { Button, Input, Card } from '../../../core/components';
import { useAuth } from '../../../core/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login({ email, password });

    if (!result.success) {
      setError(t('auth.loginError'));
    }
  };

  return (
    <AuthLayout>
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">{t('auth.login')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Input
            type="password"
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <Button type="submit" fullWidth isLoading={isLoading}>
            {t('auth.signIn')}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
};
