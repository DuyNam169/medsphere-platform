// ============================================================
// LoginForm.tsx — src/packages/auth/components/LoginForm.tsx
// The actual login form — purely presentational.
// All logic delegated to useLogin hook.
// ============================================================

import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { AppConfig } from '../../../core/config/app.config';

// Google icon SVG (inline, no dependency)
const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { values, errors, isLoading, isSuccess, handleChange, handleSubmit } =
    useLogin();

  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  return (
    <div className="login-form-wrapper">
      {/* Mobile-only logo */}
      <div className="login-form__mobile-logo" aria-hidden="true">
        <img src="/src/core/assets/logo.svg" alt={AppConfig.brandName} />
        <span>{AppConfig.brandName}</span>
      </div>

      <div className="login-form__card">
        {/* Heading */}
        <header className="login-form__header">
          <h1 className="login-form__title">{t('auth.pageTitle')}</h1>
          <p className="login-form__subtitle">{t('auth.pageSubtitle')}</p>
        </header>

        {/* Form-level error */}
        {errors.form && (
          <div className="login-form__alert" role="alert">
            <span className="login-form__alert-icon" aria-hidden="true">!</span>
            <span>{errors.form}</span>
          </div>
        )}

        {/* Success state */}
        {isSuccess && (
          <div className="login-form__success" role="status">
            <span aria-hidden="true">✓</span>
            <span>{t('auth.loginSuccess')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="login-form__form">
          {/* Email / phone field */}
          <div className="form-field">
            <label htmlFor={emailId} className="form-field__label">
              {t('auth.emailOrPhone')}
            </label>
            <input
              id={emailId}
              type="text"
              autoComplete="username"
              autoFocus
              placeholder={t('auth.emailPlaceholder')}
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              className={`form-field__input${errors.email ? ' form-field__input--error' : ''}`}
            />
            {errors.email && (
              <span
                id={`${emailId}-error`}
                className="form-field__error"
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Password field */}
          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor={passwordId} className="form-field__label">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="form-field__link">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <input
              id={passwordId}
              type="password"
              autoComplete="current-password"
              placeholder={t('auth.passwordPlaceholder')}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? `${passwordId}-error` : undefined
              }
              className={`form-field__input${errors.password ? ' form-field__input--error' : ''}`}
            />
            {errors.password && (
              <span
                id={`${passwordId}-error`}
                className="form-field__error"
                role="alert"
              >
                {errors.password}
              </span>
            )}
          </div>

          {/* Remember me */}
          <div className="form-field form-field--checkbox">
            <input
              id={rememberMeId}
              type="checkbox"
              checked={values.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              className="form-field__checkbox"
            />
            <label htmlFor={rememberMeId} className="form-field__checkbox-label">
              {t('auth.rememberMe')}
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`btn-primary${isLoading ? ' btn-primary--loading' : ''}${isSuccess ? ' btn-primary--success' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="btn-primary__spinner" aria-hidden="true" />
                {t('auth.signingIn')}
              </>
            ) : isSuccess ? (
              <>
                <span aria-hidden="true">✓</span>
                {t('auth.loginSuccess')}
              </>
            ) : (
              t('auth.signIn')
            )}
          </button>
        </form>

        {/* Social login divider */}
        <div className="login-form__divider">
          <span className="login-form__divider-line" />
          <span className="login-form__divider-text">
            {t('auth.orContinueWith')}
          </span>
          <span className="login-form__divider-line" />
        </div>

        {/* Social buttons */}
        <div className="login-form__social">
          <button type="button" className="btn-social">
            <GoogleIcon />
            <span>{t('auth.continueWithGoogle')}</span>
          </button>
        </div>

        {/* Footer */}
        <p className="login-form__footer">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="login-form__footer-link">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
};