import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AUTH_ROUTES } from '@/constants/auth';
import { useAuthStore } from '../store/authStore';
import { AuthLoadingScreen } from '../provider/AuthLoadingScreen';

type ProtectedRouteProps = {
  /** When set, user.role must be one of these values. */
  roles?: string[];
  /** Optional redirect path when unauthenticated. Defaults to login. */
  redirectTo?: string;
};

/**
 * Blocks protected content until auth initialization finishes.
 * Redirects to login only after initialization when the user is not authenticated.
 */
export function ProtectedRoute({
  roles,
  redirectTo = AUTH_ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const location = useLocation();
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
