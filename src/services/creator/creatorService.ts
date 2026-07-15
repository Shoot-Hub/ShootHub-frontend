/**
 * Creator Service - Handles API calls for photographer-specific features
 */
import { apiRequest } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export const creatorService = {
  // Get my profile (photographer)
  getMyProfile: async () => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_GET_PROFILE,
      { requiresAuth: true },
    );
    return response;
  },

  // Update profile info
  updateInfo: async (data: {
    displayName?: string;
    about?: string;
    experienceYears?: number;
    specializations?: string[];
    skills?: string[];
    editingStyles?: string[];
    isNegotiable?: boolean;
    willingToTravel?: boolean;
    travelRadiusKm?: number;
    travelChargePerKm?: number;
  }) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_UPDATE_INFO,
      {
        method: 'PATCH',
        body: data,
        requiresAuth: true,
      },
    );
    return response;
  },

  // Add package
  addPackage: async (data: {
    name: string;
    description: string;
    price: number;
    currency: string;
    durationHours: number;
    deliverables: string[];
  }) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_ADD_PACKAGE,
      {
        method: 'POST',
        body: data,
        requiresAuth: true,
      },
    );
    return response;
  },

  // Update package
  updatePackage: async (packageId: string, data: Record<string, unknown>) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_UPDATE_PACKAGE(packageId),
      {
        method: 'PUT',
        body: data,
        requiresAuth: true,
      },
    );
    return response;
  },

  // Delete package
  deletePackage: async (packageId: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_DELETE_PACKAGE(packageId),
      {
        method: 'DELETE',
        requiresAuth: true,
      },
    );
    return response;
  },

  // Add equipment
  addEquipment: async (data: {
    brand: string;
    model: string;
    type: string;
    owned: boolean;
    notes?: string;
  }) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_ADD_EQUIPMENT,
      {
        method: 'POST',
        body: data,
        requiresAuth: true,
      },
    );
    return response;
  },

  // Delete equipment
  deleteEquipment: async (equipmentId: string) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_DELETE_EQUIPMENT(equipmentId),
      {
        method: 'DELETE',
        requiresAuth: true,
      },
    );
    return response;
  },

  // Set availability
  setAvailability: async (availability: Array<{
    day: string;
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
  }>) => {
    const response = await apiRequest<ApiResponse>(
      API_CONFIG.ENDPOINTS.PHOTOGRAPHER_SET_AVAILABILITY,
      {
        method: 'PUT',
        body: { availability },
        requiresAuth: true,
      },
    );
    return response;
  },
};