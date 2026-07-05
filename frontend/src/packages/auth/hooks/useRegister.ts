import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../core/store/authStore';
import { authService } from '../services/authService';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { countries } from '../../../core/data/countries';
import type {
  RegisterFormValues,
  RegisterFormErrors,
  UseRegisterReturn,
} from '../types/auth.types';

const initialValues: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  phoneCountry: 'VN',
  agreeTerms: false,
};

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,128}$/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


export const useRegister = (): UseRegisterReturn => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Khớp validation Java: fullName max 100, password 8-128, phone optional ^(\+?[0-9]{9,15})?$
  const validate = (vals: RegisterFormValues): RegisterFormErrors => {
    const errs: RegisterFormErrors = {};

    if (!vals.fullName.trim()) {
      errs.fullName = t('auth.nameRequired');
    } else if (vals.fullName.length > 100) {
      errs.fullName = t('auth.nameTooLong');
    }

    if (!vals.email.trim()) {
    errs.email = t('auth.emailRequired');
    } else if (!EMAIL_PATTERN.test(vals.email.trim())) {
    errs.email = t('auth.emailInvalid');
    }


    if (!vals.password) {
    errs.password = t('auth.passwordRequired');
    } else if (!PASSWORD_PATTERN.test(vals.password)) {
    errs.password = t('auth.passwordWeak');
    }

    if (!vals.confirmPassword) {
      errs.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (vals.confirmPassword !== vals.password) {
      errs.confirmPassword = t('auth.passwordMismatch');
    }

    if (vals.phone.trim()) {
    const country = countries.find((c) => c.code === vals.phoneCountry);
    const fullNumber = `${country?.dialCode ?? ''}${vals.phone.trim()}`;
    if (!isValidPhoneNumber(fullNumber)) {
            errs.phone = t('auth.phoneInvalid');
        }
    }

    if (!vals.agreeTerms) {
      errs.agreeTerms = t('auth.agreeTermsRequired');
    }

    return errs;
  };

  const handleChange = useCallback(
    (field: keyof RegisterFormValues, value: string | boolean) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    },
    []
  );

  const clearError = useCallback((field: keyof RegisterFormErrors) => {
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
        // confirmPassword chỉ dùng validate FE, KHÔNG gửi lên BE
        const country = countries.find((c) => c.code === values.phoneCountry);
        const fullPhone = values.phone.trim()
        ? `${country?.dialCode ?? ''}${values.phone.trim()}`
        : undefined;

        const response = await authService.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: fullPhone,
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

        if (status === 409) {
          setErrors({ form: t('auth.emailAlreadyExists') });
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