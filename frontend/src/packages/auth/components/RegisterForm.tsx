import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { AppConfig } from '../../../core/config/app.config';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { PhoneInput } from '../../../core/components/PhoneInput';
import { Spinner } from '../../../core/components/Spinner';

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
  </svg>
);


export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { values, errors, isLoading, isSuccess, handleChange, handleSubmit } =
    useRegister();

  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const agreeTermsId = useId();
    
  const { triggerGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin();

  return (
    <div className="login-form-wrapper">
      <div className="login-form__mobile-logo" aria-hidden="true">
        <img src="/src/core/assets/logo.svg" alt={AppConfig.brandName} />
        <span>{AppConfig.brandName}</span>
      </div>

      <div className="login-form__card">
        <header className="login-form__header">
          <h1 className="login-form__title">{t('auth.registerPageTitle')}</h1>
          <p className="login-form__subtitle">{t('auth.registerPageSubtitle')}</p>
        </header>

        {errors.form && (
          <div className="login-form__alert" role="alert">
            <span className="login-form__alert-icon" aria-hidden="true">!</span>
            <span>{errors.form}</span>
          </div>
        )}

        {isSuccess && (
          <div className="login-form__success" role="status">
            <span aria-hidden="true">✓</span>
            <span>{t('auth.registerSuccess')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="login-form__form">
          {/* Full name */}
          <div className="form-field">
            <label htmlFor={nameId} className="form-field__label">
              {t('auth.fullName')}
            </label>
            <input
              id={nameId}
              type="text"
              autoComplete="name"
              autoFocus
              placeholder={t('auth.fullNamePlaceholder')}
              value={values.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? `${nameId}-error` : undefined}
              className={`form-field__input${errors.fullName ? ' form-field__input--error' : ''}`}
            />
            {errors.fullName && (
              <span id={`${nameId}-error`} className="form-field__error" role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor={emailId} className="form-field__label">
              {t('auth.emailOrPhone')}
            </label>
            <input
              id={emailId}
              type="text"
              autoComplete="email"
              placeholder={t('auth.emailPlaceholder')}
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              className={`form-field__input${errors.email ? ' form-field__input--error' : ''}`}
            />
            {errors.email && (
              <span id={`${emailId}-error`} className="form-field__error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Phone (optional) */}
          <div className="form-field">
            <label htmlFor={phoneId} className="form-field__label">
                {t('auth.phone')}
            </label>
            <PhoneInput
                id={phoneId}
                value={values.phone}
                countryCode={values.phoneCountry}
                onChange={(localNumber, countryCode) => {
                handleChange('phone', localNumber);
                handleChange('phoneCountry', countryCode);
                }}
                error={errors.phone}
                placeholder={t('auth.phonePlaceholder')}
            />
            {errors.phone && (
                <span id={`${phoneId}-error`} className="form-field__error" role="alert">
                {errors.phone}
                </span>
            )}
            </div>

          {/* Password */}
          <div className="form-field">
            <label htmlFor={passwordId} className="form-field__label">
              {t('auth.password')}
            </label>
            <input
              id={passwordId}
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.passwordPlaceholder')}
              value={values.password}
              onChange={(e) => handleChange('password', e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${passwordId}-error` : undefined}
              className={`form-field__input${errors.password ? ' form-field__input--error' : ''}`}
            />
            {errors.password ? (
            <span id={`${passwordId}-error`} className="form-field__error" role="alert">
                {errors.password}
            </span>
            ) : (
            <span className="form-field__hint">{t('auth.passwordHint')}</span>
            )}
          </div>

          {/* Confirm password */}
          <div className="form-field">
            <label htmlFor={confirmPasswordId} className="form-field__label">
              {t('auth.confirmPassword')}
            </label>
            <input
              id={confirmPasswordId}
              type="password"
              autoComplete="new-password"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? `${confirmPasswordId}-error` : undefined
              }
              className={`form-field__input${errors.confirmPassword ? ' form-field__input--error' : ''}`}
            />
            {errors.confirmPassword && (
              <span id={`${confirmPasswordId}-error`} className="form-field__error" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Agree terms */}
          <div className="form-field form-field--checkbox">
            <input
              id={agreeTermsId}
              type="checkbox"
              checked={values.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              className="form-field__checkbox"
            />
            <label htmlFor={agreeTermsId} className="form-field__checkbox-label">
              {t('auth.agreeTerms')}
            </label>
          </div>
          {errors.agreeTerms && (
            <span className="form-field__error" role="alert">
              {errors.agreeTerms}
            </span>
          )}

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`btn-primary${isLoading ? ' btn-primary--loading' : ''}${isSuccess ? ' btn-primary--success' : ''}`}
          >
            {isLoading ? (
              <>
                <Spinner size={16} color="#fff" />
                {t('auth.registering')}
              </>
            ) : isSuccess ? (
              <>
                <span aria-hidden="true">✓</span>
                {t('auth.registerSuccess')}
              </>
            ) : (
              t('auth.createAccount')
            )}
          </button>
        </form>

        <div className="login-form__divider">
          <span className="login-form__divider-line" />
          <span className="login-form__divider-text">{t('auth.orContinueWith')}</span>
          <span className="login-form__divider-line" />
        </div>

        <div className="login-form__social">
            <button
            type="button"
            onClick={triggerGoogleLogin}
            disabled={isGoogleLoading}
            className="btn-social"
            >
            {isGoogleLoading ? <Spinner size={16} color="#65676B" /> : <GoogleIcon />}
            <span>
                {isGoogleLoading ? t('auth.signingIn') : t('auth.continueWithGoogle')}
            </span>
            </button>
        </div>

        <p className="login-form__footer">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="login-form__footer-link">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};