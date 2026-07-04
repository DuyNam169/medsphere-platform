// ============================================================
// authService.ts — src/packages/auth/services/authService.ts
// API calls for authentication.
// Uses the core apiClient — no direct axios here.
// ============================================================

import { apiService } from '../../../core/services/api';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const authService = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiService.post<LoginResponse>('/auth/login', data),

  logout: (): Promise<void> =>
    apiService.post<void>('/auth/logout'),

  refreshToken: (refreshToken: string): Promise<Pick<LoginResponse, 'token'>> =>
    apiService.post('/auth/refresh', { refreshToken }),

  forgotPassword: (email: string): Promise<{ message: string }> =>
    apiService.post('/auth/forgot-password', { email }),
};