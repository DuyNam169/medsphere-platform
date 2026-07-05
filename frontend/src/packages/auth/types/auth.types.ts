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

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
  provider: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserInfo;
}

export type LoginResponse = AuthResponse;
export type RegisterResponse = AuthResponse;
export type AuthUser = UserInfo;


export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'BUSINESS' | 'USER';

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

// --- Register form state ---
export interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;      
  phoneCountry: string;  
  agreeTerms: boolean;
}

export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  agreeTerms?: string;
  form?: string;
}

export interface UseRegisterReturn {
  values: RegisterFormValues;
  errors: RegisterFormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  handleChange: (field: keyof RegisterFormValues, value: string | boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: (field: keyof RegisterFormErrors) => void;
}

// --- Social login ---
export type SocialProvider = 'google' | 'facebook';