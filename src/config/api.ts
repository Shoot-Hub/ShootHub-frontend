export const API_CONFIG = {
  BASE_URL: 'https://shoothub-backend-apis.onrender.com/api/v1',
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Photographer endpoints
    PHOTOGRAPHER_GET_PROFILE: '/photographers/me/profile',
    PHOTOGRAPHER_UPDATE_INFO: '/photographers/me/info',
    PHOTOGRAPHER_ADD_PACKAGE: '/photographers/me/packages',
    PHOTOGRAPHER_UPDATE_PACKAGE: (id: string) => `/photographers/me/packages/${id}`,
    PHOTOGRAPHER_DELETE_PACKAGE: (id: string) => `/photographers/me/packages/${id}`,
    PHOTOGRAPHER_ADD_EQUIPMENT: '/photographers/me/equipment',
    PHOTOGRAPHER_DELETE_EQUIPMENT: (id: string) => `/photographers/me/equipment/${id}`,
    PHOTOGRAPHER_SET_AVAILABILITY: '/photographers/me/availability',
  },
} as const;