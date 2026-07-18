import { useCallback } from 'react';
import { useAuthStore, setAuth } from '../store/authStore';
import type { UserProfile } from '../types';

/**
 * Primary auth hook for components.
 * Backwards-compatible with the previous `@/store` useAuth API.
 *
 * Note: `logout` clears the local session only. Pages that already call
 * `userService.logout()` + navigate should keep that pattern.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoading = useAuthStore((s) => s.isLoading);
  const clearSession = useAuthStore((s) => s.clearSession);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const login = useCallback(async (_email: string, _password: string) => {
    // Login is handled by LoginPage via auth/user services + setAuth.
  }, []);

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    login,
    logout,
    setUser: setAuth as (user: UserProfile) => void,
  };
}
