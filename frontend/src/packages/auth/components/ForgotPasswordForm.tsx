import React, { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { OtpInput } from './OtpInput';
import { AppConfig } from '../../../core/config/app.config';

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const fp = useForgotPassword();

  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <div className="login-form-wrapper">
      <div className="login-form__mobile-logo" aria-hidden="true">
        <img src="/src/core/assets/logo.svg" alt={AppConfig.brandName} />
        <span>{AppConfig.brandName}</span>
      </div>

      <div className="login-form__card">
        {fp.step === 'email' ? (
          <>
            <header className="login-form__header">
              <h1 className="login-form__title">{t('auth.forgotPasswordTitle')}</h1>
              <p className="login-form__subtitle">{t('auth.forgotPasswordSubtitle')}</p>
            </header>

            {fp.formError && (
              <div className="login-form__alert" role="alert">
                <span className="login-form__alert-icon" aria-hidden="true">!</span>
                <span>{fp.formError}</span>
              </div>
            )}

            <form onSubmit={fp.handleSendOtp} noValidate className="login-form__form">
              <div className="form-field">
                <label htmlFor={emailId} className="form-field__label">
                  {t('auth.emailOrPhone')}
                </label>
                <input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder={t('auth.emailPlaceholder')}
                  value={fp.email}
                  onChange={(e) => fp.setEmail(e.target.value)}
                  aria-invalid={!!fp.emailError}
                  className={`form-field__input${fp.emailError ? ' form-field__input--error' : ''}`}
                />
                {fp.emailError && (
                  <span className="form-field__error" role="alert">{fp.emailError}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={fp.isLoading}
                className={`btn-primary${fp.isLoading ? ' btn-primary--loading' : ''}`}
              >
                {fp.isLoading ? (
                  <>
                    <span className="btn-primary__spinner" aria-hidden="true" />
                    {t('auth.sendingCode')}
                  </>
                ) : (
                  t('auth.sendCode')
                )}
              </button>
            </form>

            <p className="login-form__footer">
              <Link to="/login" className="login-form__footer-link" style={{ marginLeft: 0 }}>
                {t('auth.backToLogin')}
              </Link>
            </p>
          </>
        ) : (
          <>
            <header className="login-form__header">
              <h1 className="login-form__title">{t('auth.enterOtpTitle')}</h1>
              <p className="login-form__subtitle">
                {t('auth.otpSentMessage', { email: fp.email })}
              </p>
            </header>

            {fp.formError && (
              <div className="login-form__alert" role="alert">
                <span className="login-form__alert-icon" aria-hidden="true">!</span>
                <span>{fp.formError}</span>
              </div>
            )}

            {fp.isSuccess && (
              <div className="login-form__success" role="status">
                <span aria-hidden="true">✓</span>
                <span>{t('auth.resetPasswordSuccess')}</span>
              </div>
            )}

            <form onSubmit={fp.handleResetPassword} noValidate className="login-form__form">
              <div className="form-field">
                <label className="form-field__label">{t('auth.otpLabel')}</label>
                <OtpInput
                  value={fp.otp}
                  onChange={fp.setOtp}
                  error={!!fp.otpError}
                  disabled={fp.isOtpVerified}
                />
                {fp.otpError && (
                  <span className="form-field__error" role="alert">{fp.otpError}</span>
                )}

                {!fp.isOtpVerified ? (
                  <button
                    type="button"
                    onClick={fp.handleVerifyOtp}
                    disabled={fp.isVerifying || fp.otp.length !== 6}
                    className="btn-social"
                    style={{ marginTop: '0.625rem' }}
                  >
                    {fp.isVerifying ? t('auth.verifyingCode') : t('auth.verifyCode')}
                  </button>
                ) : (
                  <div className="login-form__success" style={{ marginTop: '0.625rem' }}>
                    <span aria-hidden="true">✓</span>
                    <span>{t('auth.otpVerified')}</span>
                  </div>
                )}

                <div className="form-field__label-row" style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={fp.goBackToEmailStep}
                    className="form-field__link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {t('auth.changeEmail')}
                  </button>
                  <button
                    type="button"
                    onClick={fp.handleResendOtp}
                    disabled={fp.resendCooldown > 0 || fp.isLoading}
                    className="form-field__link"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {fp.resendCooldown > 0
                      ? t('auth.resendIn', { s: fp.resendCooldown })
                      : t('auth.resendCode')}
                  </button>
                </div>
              </div>

              {fp.isOtpVerified && (
                <>
                  <div className="form-field">
                    <label htmlFor={passwordId} className="form-field__label">
                      {t('auth.newPassword')}
                    </label>
                    <input
                      id={passwordId}
                      type="password"
                      autoComplete="new-password"
                      placeholder={t('auth.passwordPlaceholder')}
                      value={fp.newPassword}
                      onChange={(e) => fp.setNewPassword(e.target.value)}
                      aria-invalid={!!fp.passwordError}
                      className={`form-field__input${fp.passwordError ? ' form-field__input--error' : ''}`}
                    />
                    {fp.passwordError ? (
                      <span className="form-field__error" role="alert">{fp.passwordError}</span>
                    ) : (
                      <span className="form-field__hint">{t('auth.passwordHint')}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor={confirmPasswordId} className="form-field__label">
                      {t('auth.confirmPassword')}
                    </label>
                    <input
                      id={confirmPasswordId}
                      type="password"
                      autoComplete="new-password"
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      value={fp.confirmPassword}
                      onChange={(e) => fp.setConfirmPassword(e.target.value)}
                      aria-invalid={!!fp.confirmPasswordError}
                      className={`form-field__input${fp.confirmPasswordError ? ' form-field__input--error' : ''}`}
                    />
                    {fp.confirmPasswordError && (
                      <span className="form-field__error" role="alert">{fp.confirmPasswordError}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={fp.isResetting || fp.isSuccess}
                    className={`btn-primary${fp.isResetting ? ' btn-primary--loading' : ''}${fp.isSuccess ? ' btn-primary--success' : ''}`}
                  >
                    {fp.isResetting ? (
                      <>
                        <span className="btn-primary__spinner" aria-hidden="true" />
                        {t('auth.resettingPassword')}
                      </>
                    ) : fp.isSuccess ? (
                      <>
                        <span aria-hidden="true">✓</span>
                        {t('auth.resetPasswordSuccess')}
                      </>
                    ) : (
                      t('auth.resetPasswordButton')
                    )}
                  </button>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};