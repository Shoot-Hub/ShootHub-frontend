import { apiRequest, refreshTokens, clearTokens } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';
import { tokenService } from './tokenService';
import type { ApiResponse, AuthResponseData, UserProfile } from '../types';

export const authService = {
  refreshToken: async (): Promise<string | null> => {
    return refreshTokens();
  },

  getMe: async (): Promise<NonNullable<UserProfile>> => {
    const response = await apiRequest<ApiResponse<NonNullable<UserProfile>>>(
      API_CONFIG.ENDPOINTS.ME,
      {
        method: 'GET',
        requiresAuth: true,
      },
    );

    if (!response.data) {
      throw new Error(response.message || 'Failed to load current user');
    }

    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest<ApiResponse<AuthResponseData>>(
      API_CONFIG.ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: { email, password },
        requiresAuth: false,
      },
    );

    if (response.data) {
      tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest<ApiResponse>(API_CONFIG.ENDPOINTS.LOGOUT, {
        method: 'POST',
        requiresAuth: true,
      });
    } finally {
      clearTokens();
    }
  },
};
