// ============================================================
// useLogin.ts — src/packages/auth/hooks/useLogin.ts
// Handles all login form logic: validation, submission, errors.
// Component stays dumb — all state lives here.
// ============================================================

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import { authService } from '../services/authService';
import type {
  LoginFormValues,
  LoginFormErrors,
  UseLoginReturn,
} from '../types/auth.types';

const initialValues: LoginFormValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const useLogin = (): UseLoginReturn => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Validation ---
  const validate = (vals: LoginFormValues): LoginFormErrors => {
    const errs: LoginFormErrors = {};

    if (!vals.email.trim()) {
      errs.email = t('auth.emailRequired');
    } else if (
      vals.email.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)
    ) {
      errs.email = t('auth.emailInvalid');
    }

    if (!vals.password) {
      errs.password = t('auth.passwordRequired');
    } else if (vals.password.length < 6) {
      errs.password = t('auth.passwordMinLength');
    }

    return errs;
  };

  // --- Field change ---
  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      // Clear field error on change
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    },
    []
  );

  // --- Clear a specific error ---
  const clearError = useCallback((field: keyof LoginFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // --- Submit ---
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const response = await authService.login({
          email: values.email.trim(),
          password: values.password,
          rememberMe: values.rememberMe,
        });

        login(response.user, response.token);
        setIsSuccess(true);

        // Small delay so success state is visible
        setTimeout(() => navigate('/'), 400);
      } catch (err: unknown) {
        const status = (err as { response?: { status: number } })?.response?.status;

        if (status === 401 || status === 403) {
          setErrors({ form: t('auth.invalidCredentials') });
        } else if (status === 423) {
          setErrors({ form: t('auth.accountLocked') });
        } else if (!navigator.onLine) {
          setErrors({ form: t('auth.networkError') });
        } else {
          setErrors({ form: t('auth.unknownError') });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [values, t, login, navigate]
  );

  return {
    values,
    errors,
    isLoading,
    isSuccess,
    handleChange,
    handleSubmit,
    clearError,
  };
};