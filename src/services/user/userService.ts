/**
 * User Service - Handles API calls for user authentication and profile management
 */
import { apiRequest, setTokens, clearTokens } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';
import type { ApiResponse, AuthResponseData, UserProfile } from '@/features/auth';

export const userService = {
  // User login
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
        requiresAuth: false,
      },
    );

    if (response.data) {
      setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response;
  },

  /** Current authenticated user */
  getMe: async () => {
    const response = await apiRequest<ApiResponse<NonNullable<UserProfile>>>(
      API_CONFIG.ENDPOINTS.ME,
      {
        method: 'GET',
        requiresAuth: true,
      },
    );
    return response;
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: { email },
        requiresAuth: false,
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
        requiresAuth: false,
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
      await apiRequest<ApiResponse>(API_CONFIG.ENDPOINTS.LOGOUT, {
        method: 'POST',
        requiresAuth: true,
      });
    } finally {
      clearTokens();
    }
  },
};
