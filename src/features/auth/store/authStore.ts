import { create } from 'zustand';
import { tokenService } from '../services/tokenService';
import type { UserProfile } from '../types';

type AuthStore = {
  user: UserProfile;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  setInitialized: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setInitialized: (value) =>
    set({
      isInitialized: value,
      isLoading: !value,
    }),

  setLoading: (value) => set({ isLoading: value }),

  clearSession: () => {
    tokenService.clearTokens();
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));

/** Imperative helpers for non-React callers (api client, services). */
export function setAuth(user: UserProfile): void {
  useAuthStore.getState().setUser(user);
}

export function getAuth() {
  const state = useAuthStore.getState();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
  };
}

export function clearAuthSession(): void {
  useAuthStore.getState().clearSession();
}
