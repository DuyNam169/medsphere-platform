// ============================================================
// useGoogleLogin.ts — src/packages/auth/hooks/useGoogleLogin.ts
// Wraps Google Identity Services (One Tap / prompt flow).
// Returns an idToken (JWT) which backend verifies via
// GoogleIdTokenVerifier — NOT an access_token.
// ============================================================

import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../core/store/authStore';
import { AppConfig } from '../../../core/config/app.config';
import { authService } from '../services/authService';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          prompt: (cb?: (notification: unknown) => void) => void;
        };
      };
    };
  }
}

export const useGoogleLogin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const initializedRef = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const authRes = await authService.googleLogin(response.credential);
        login(authRes.user, authRes.accessToken, authRes.refreshToken);
        navigate('/');
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: { message: string } } } };
        setError(e?.response?.data?.error?.message || t('auth.unknownError'));
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate, t]
  );

  useEffect(() => {
    if (!AppConfig.googleClientId) {
      console.warn('[useGoogleLogin] Missing VITE_GOOGLE_CLIENT_ID');
      return;
    }

    // Chờ script GSI load xong (async/defer trong index.html)
    const checkReady = setInterval(() => {
      if (window.google?.accounts?.id && !initializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: AppConfig.googleClientId,
          callback: handleCredentialResponse,
        });
        initializedRef.current = true;
        setIsReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [handleCredentialResponse]);

  const triggerGoogleLogin = useCallback(() => {
    if (!isReady || !window.google?.accounts?.id) {
      setError(t('auth.googleNotReady'));
      return;
    }
    window.google.accounts.id.prompt();
  }, [isReady, t]);

  return { triggerGoogleLogin, isLoading, error, isReady };
};