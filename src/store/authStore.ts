/**
 * @deprecated Import from `@/features/auth` or `@/store` instead.
 * Kept so any deep imports of `./authStore` continue to work.
 */
export {
  useAuth,
  setAuth,
  getAuth,
  useAuthStore,
  clearAuthSession,
} from '@/features/auth';

export type { UserProfile, AuthState } from '@/features/auth';
