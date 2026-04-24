import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/register', data);
  },

  logout: async (): Promise<void> => {
    return apiService.post<void>('/auth/logout');
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return apiService.get<AuthResponse['user']>('/auth/me');
  },
};
