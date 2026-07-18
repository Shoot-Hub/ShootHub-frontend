import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_ROUTES } from '@/constants/auth';
import { setUnauthorizedHandler } from '@/lib/apiClient';
import { useInitializeAuth } from '../hooks/useInitializeAuth';
import { useAuthStore } from '../store/authStore';
import { AuthLoadingScreen } from './AuthLoadingScreen';

type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Initializes authentication on mount and blocks route rendering
 * until the refresh-token bootstrap completes.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const clearSession = useAuthStore((s) => s.clearSession);

  useInitializeAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate, clearSession]);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
