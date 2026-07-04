// ============================================================
// auth.types.ts — src/packages/auth/types/auth.types.ts
// All TypeScript types for the auth package.
// ============================================================

// --- Request / Response DTOs ---
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'doctor' | 'patient' | 'user';

// --- Form state ---
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

// --- Hook return type ---
export interface UseLoginReturn {
  values: LoginFormValues;
  errors: LoginFormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  handleChange: (field: keyof LoginFormValues, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: (field: keyof LoginFormErrors) => void;
}

// --- Social login ---
export type SocialProvider = 'google' | 'facebook';