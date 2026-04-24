import { create } from 'zustand';
import { storage, TOKEN_KEY } from '../utils/storage';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
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

  login: (user, token) => {
    storage.set(TOKEN_KEY, token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    storage.remove(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
