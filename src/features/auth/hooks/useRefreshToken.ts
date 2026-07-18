import { useCallback } from 'react';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

/**
 * Refresh the access token using the persisted refresh token.
 * Returns the new access token, or null if refresh is not possible.
 */
export function useRefreshToken() {
  const refresh = useCallback(async (): Promise<string | null> => {
    if (!tokenService.hasRefreshToken()) {
      return null;
    }

    return authService.refreshToken();
  }, []);

  return { refresh, hasRefreshToken: tokenService.hasRefreshToken() };
}
