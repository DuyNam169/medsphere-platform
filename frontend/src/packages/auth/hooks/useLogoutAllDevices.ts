import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../../../core/store/authStore';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useLogoutAllDevices = () => {
  const [searchParams] = useSearchParams();
  const { logout } = useAuthStore();
  const [status, setStatus] = useState<Status>('idle');

  const token = searchParams.get('token');

  const execute = useCallback(async () => {
    if (!token) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await authService.logoutAllDevices(token);
      logout(); // xóa luôn token local nếu người dùng đang đăng nhập trên chính máy này
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [token, logout]);

  useEffect(() => {
    execute();
  }, [execute]);

  return { status, retry: execute };
};