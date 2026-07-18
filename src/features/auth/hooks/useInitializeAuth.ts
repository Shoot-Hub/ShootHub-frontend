import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';
import { useAuthStore } from '../store/authStore';
import type { UserProfile } from '../types';

export const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const;

/** Survives React StrictMode remounts so bootstrap runs once per page load. */
let authBootstrapPromise: Promise<void> | null = null;

/**
 * Bootstraps authentication on app start:
 * refresh token → new access token → GET /users/me → store user.
 * Does not redirect to login; marks initialization complete either way.
 */
export function useInitializeAuth() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const clearSession = useAuthStore((s) => s.clearSession);

  useEffect(() => {
    if (useAuthStore.getState().isInitialized) {
      return;
    }

    if (!authBootstrapPromise) {
      authBootstrapPromise = (async () => {
        if (!tokenService.hasRefreshToken()) {
          setUser(null);
          setInitialized(true);
          return;
        }

        try {
          const accessToken = await authService.refreshToken();

          if (!accessToken) {
            clearSession();
            setInitialized(true);
            return;
          }

          const user = await queryClient.fetchQuery({
            queryKey: AUTH_ME_QUERY_KEY,
            queryFn: () => authService.getMe(),
          });

          setUser(user as UserProfile);
        } catch {
          clearSession();
          queryClient.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
        } finally {
          setInitialized(true);
        }
      })();
    }

    void authBootstrapPromise;
  }, [queryClient, setUser, setInitialized, clearSession]);
}
