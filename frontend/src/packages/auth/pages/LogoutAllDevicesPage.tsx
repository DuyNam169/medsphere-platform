import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogoutAllDevices } from '../hooks/useLogoutAllDevices';
import { BrandPanel } from '../components/BrandPanel';
import { AppConfig } from '../../../core/config/app.config';

const LogoutAllDevicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { status, retry } = useLogoutAllDevices();

  return (
    <div className="auth-page">
      <aside className="auth-brand-panel">
        <BrandPanel />
      </aside>

      <main className="auth-form-panel">
        <div className="login-form-wrapper">
          <div className="login-form__mobile-logo" aria-hidden="true">
            <img src="/src/core/assets/logo.svg" alt={AppConfig.brandName} />
            <span>{AppConfig.brandName}</span>
          </div>

          <div className="login-form__card" style={{ textAlign: 'center' }}>
            {status === 'loading' && (
              <>
                <div className="btn-primary__spinner" style={{ margin: '0 auto', borderTopColor: '#1E3A5F', borderColor: 'rgba(30,58,95,0.2)' }} />
                <h1 className="login-form__title" style={{ marginTop: '1rem' }}>
                  {t('auth.loggingOutAllDevices')}
                </h1>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="login-form__title">{t('auth.logoutAllSuccessTitle')}</h1>
                <p className="login-form__subtitle" style={{ marginBottom: '1.5rem' }}>
                  {t('auth.logoutAllSuccessMessage')}
                </p>
                <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                  {t('auth.backToLogin')}
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <h1 className="login-form__title">{t('auth.logoutAllErrorTitle')}</h1>
                <p className="login-form__subtitle" style={{ marginBottom: '1.5rem' }}>
                  {t('auth.logoutAllErrorMessage')}
                </p>
                <button onClick={retry} className="btn-primary">
                  {t('auth.retry')}
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogoutAllDevicesPage;