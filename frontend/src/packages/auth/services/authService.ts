// ============================================================
// authService.ts — src/packages/auth/services/authService.ts
// API calls for authentication.
// Uses the core apiClient — no direct axios here.
// ============================================================

import { apiService } from '../../../core/services/api';
import type {
  LoginRequest,
  AuthResponse,
  RegisterRequest,
} from '../types/auth.types';

const BASE = '/v1/auth';

export const authService = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiService.post<AuthResponse>(`${BASE}/login`, data),

  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiService.post<AuthResponse>(`${BASE}/register`, data),

  googleLogin: (idToken: string): Promise<AuthResponse> =>
    apiService.post<AuthResponse>(`${BASE}/google-login`, { idToken }),

  logout: (refreshToken: string): Promise<void> =>
    apiService.post<void>(`${BASE}/logout`, { refreshToken }),

  refreshToken: (
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number }> =>
    apiService.post(`${BASE}/refresh`, { refreshToken }),

  requestPasswordResetOtp: (email: string): Promise<void> =>
    apiService.post<void>(`${BASE}/forgot-password/request-otp`, { email }),

  verifyPasswordResetOtp: (email: string, otp: string): Promise<void> =>
    apiService.post<void>(`${BASE}/forgot-password/verify-otp`, { email, otp }),

  resetPassword: (email: string, otp: string, newPassword: string): Promise<void> =>
    apiService.post<void>(`${BASE}/forgot-password/reset`, { email, otp, newPassword }),
  logoutAllDevices: (token: string): Promise<void> =>
    apiService.post<void>(`${BASE}/security/logout-all-devices`, { token }),
};