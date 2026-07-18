/**
 * Backwards-compatible auth store exports.
 * Implementation lives in `@/features/auth`.
 */
export {
  useAuth,
  setAuth,
  getAuth,
  useAuthStore,
  clearAuthSession,
} from '@/features/auth';

export type { UserProfile, AuthState } from '@/features/auth';
