import { create } from 'zustand';
import { storage, TOKEN_KEY } from '../utils/storage';

const REFRESH_TOKEN_KEY = 'refresh_token';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'BUSINESS' | 'USER';
  provider: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storage.get(TOKEN_KEY),
  isAuthenticated: !!storage.get(TOKEN_KEY),
  isLoading: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      storage.set(TOKEN_KEY, token);
    } else {
      storage.remove(TOKEN_KEY);
    }
    set({ token });
  },

  login: (user, accessToken, refreshToken) => {
    storage.set(TOKEN_KEY, accessToken);
    if (refreshToken) storage.set(REFRESH_TOKEN_KEY, refreshToken);
    set({
      user,
      token: accessToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.remove(TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
