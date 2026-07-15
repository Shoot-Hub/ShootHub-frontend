/**
 * User Service - Handles API calls for user authentication and profile management
 */
import { apiRequest, setTokens, clearTokens } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';
import type { UserProfile } from '@/store';

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

type AuthResponseData = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
};

export const userService = {
  // User login
  login: async (email: string, password: string) => {
    const response = await apiRequest<ApiResponse<AuthResponseData>>(
      API_CONFIG.ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: { email, password },
      },
    );

    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  },

  // User signup / register
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone: string;
  }) => {
    const response = await apiRequest<ApiResponse<AuthResponseData>>(
      API_CONFIG.ENDPOINTS.REGISTER,
      {
        method: 'POST',
        body: data,
      },
    );

    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: { email },
      },
    );
    return response;
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.RESET_PASSWORD,
      {
        method: 'POST',
        body: { token, password },
      },
    );
    return response;
  },

  // Change password (requires auth)
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.CHANGE_PASSWORD,
      {
        method: 'PATCH',
        body: { currentPassword, newPassword },
        requiresAuth: true,
      },
    );
    return response;
  },

  // Logout (requires auth)
  logout: async () => {
    try {
      await apiRequest<ApiResponse>(
        API_CONFIG.ENDPOINTS.LOGOUT,
        {
          method: 'POST',
          requiresAuth: true,
        },
      );
    } finally {
      clearTokens();
    }
  },
};