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

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^(\+84|84|0)(3[2-9]|5[25689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/;

export const useLogin = (): UseLoginReturn => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (vals: LoginFormValues): LoginFormErrors => {
    const errs: LoginFormErrors = {};

    if (!vals.email.trim()) {
      errs.email = t('auth.emailRequired');
    } else {
      const value = vals.email.trim();
      const isEmailFormat = value.includes('@');
      if (isEmailFormat && !EMAIL_PATTERN.test(value)) {
        errs.email = t('auth.emailInvalid');
      } else if (!isEmailFormat && !PHONE_PATTERN.test(value)) {
        errs.email = t('auth.phoneInvalid');
      }
    }

    if (!vals.password) {
      errs.password = t('auth.passwordRequired');
    } else if (vals.password.length < 6) {
      errs.password = t('auth.passwordMinLength');
    }

    return errs;
  };

  const handleChange = useCallback(
    (field: keyof LoginFormValues, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    },
    []
  );

  const clearError = useCallback((field: keyof LoginFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

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

        login(response.user, response.accessToken, response.refreshToken);
        setIsSuccess(true);

        setTimeout(() => navigate('/'), 400);
      } catch (err: unknown) {
        const e = err as {
          response?: { status: number; data?: { error?: { code: string; message: string } } };
        };
        const status = e?.response?.status;
        const beMessage = e?.response?.data?.error?.message;

        if (status === 401 || status === 403) {
          setErrors({ form: t('auth.invalidCredentials') });
        } else if (status === 423) {
          setErrors({ form: t('auth.accountLocked') });
        } else if (!navigator.onLine) {
          setErrors({ form: t('auth.networkError') });
        } else if (beMessage) {
          setErrors({ form: beMessage });
        } else {
          setErrors({ form: t('auth.unknownError') });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [values, t, login, navigate]
  );

  return { values, errors, isLoading, isSuccess, handleChange, handleSubmit, clearError };
};