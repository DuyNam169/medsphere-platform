// ============================================================
// useForgotPassword.ts — src/packages/auth/hooks/useForgotPassword.ts
// State machine 2 bước: email -> otp + đặt mật khẩu mới
// ============================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';  
import i18n from '../../../core/i18n';

type Step = 'email' | 'reset';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,128}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const RESEND_COOLDOWN_SECONDS = 60;

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState<string | undefined>();
  const [otpError, setOtpError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const startCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleSendOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(undefined);
      setEmailError(undefined);

      const trimmed = email.trim();
      if (!trimmed) {
        setEmailError(t('auth.emailRequired'));
        return;
      }
      if (!EMAIL_PATTERN.test(trimmed)) {
        setEmailError(t('auth.emailInvalid'));
        return;
      }

      setIsLoading(true);
      try {
        await authService.requestPasswordResetOtp(trimmed);
        setStep('reset');
        startCooldown();
      } catch (err: unknown) {
        const e2 = err as {
          response?: { status: number; data?: { error?: { code: string; message: string } } };
        };
        if (e2?.response?.status === 429) {
          setEmailError(t('auth.otpResendTooSoon'));
        } else {
          setFormError(e2?.response?.data?.error?.message || t('auth.unknownError'));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [email, t, startCooldown]
  );

  const handleResendOtp = useCallback(async () => {
    if (resendCooldown > 0) return;
    setFormError(undefined);
    setIsLoading(true);
    try {
      await authService.requestPasswordResetOtp(email.trim());
      setOtp('');
      setIsOtpVerified(false);
      startCooldown();
    } catch (err: unknown) {
      const e2 = err as { response?: { status: number } };
      if (e2?.response?.status === 429) {
        setFormError(t('auth.otpResendTooSoon'));
      } else {
        setFormError(t('auth.unknownError'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, i18n.language, resendCooldown, t, startCooldown]);

  const handleVerifyOtp = useCallback(async () => {
    setOtpError(undefined);
    setFormError(undefined);

    if (otp.length !== 6) {
      setOtpError(t('auth.otpIncomplete'));
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyPasswordResetOtp(email.trim(), otp);
      setIsOtpVerified(true);
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { error?: { code: string } } } };
      const code = e2?.response?.data?.error?.code;
      if (code === 'OTP_EXPIRED') {
        setOtpError(t('auth.otpExpired'));
      } else {
        setOtpError(t('auth.otpInvalid'));
      }
    } finally {
      setIsVerifying(false);
    }
  }, [email, otp, t]);

  const handleResetPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordError(undefined);
      setConfirmPasswordError(undefined);
      setFormError(undefined);

      if (!isOtpVerified) {
        setOtpError(t('auth.otpNotVerified'));
        return;
      }

      let hasError = false;
      if (!newPassword) {
        setPasswordError(t('auth.passwordRequired'));
        hasError = true;
      } else if (!PASSWORD_PATTERN.test(newPassword)) {
        setPasswordError(t('auth.passwordWeak'));
        hasError = true;
      }

      if (!confirmPassword) {
        setConfirmPasswordError(t('auth.confirmPasswordRequired'));
        hasError = true;
      } else if (confirmPassword !== newPassword) {
        setConfirmPasswordError(t('auth.passwordMismatch'));
        hasError = true;
      }

      if (hasError) return;

      setIsResetting(true);
      try {
        await authService.resetPassword(email.trim(), otp, newPassword);
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 1200);
      } catch (err: unknown) {
        const e2 = err as { response?: { data?: { error?: { code: string; message: string } } } };
        const code = e2?.response?.data?.error?.code;
        if (code === 'OTP_INVALID' || code === 'OTP_EXPIRED' || code === 'OTP_NOT_VERIFIED') {
          setFormError(t('auth.otpExpiredRestart'));
          setStep('email');
          setIsOtpVerified(false);
          setOtp('');
        } else {
          setFormError(e2?.response?.data?.error?.message || t('auth.unknownError'));
        }
      } finally {
        setIsResetting(false);
      }
    },
    [email, otp, newPassword, confirmPassword, isOtpVerified, navigate, t]
  );

  const goBackToEmailStep = useCallback(() => {
    setStep('email');
    setOtp('');
    setIsOtpVerified(false);
    setOtpError(undefined);
    setFormError(undefined);
  }, []);

  return {
    step,
    email,
    setEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    emailError,
    otpError,
    passwordError,
    confirmPasswordError,
    formError,
    isLoading,
    isVerifying,
    isResetting,
    isSuccess,
    isOtpVerified,
    resendCooldown,
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
    goBackToEmailStep,
  };
};