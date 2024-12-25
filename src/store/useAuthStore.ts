// src/store/useAuthStore.ts
import { create } from 'zustand';
import type { AuthState, AuthUser } from '../types/auth';

interface AuthStore extends AuthState {
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: (user) => set({ user, isAuthenticated: true, error: null }),
  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message ? { code: 'error', message } : null })
}));