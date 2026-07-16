/**
 * Reel Service - Handles API calls for reel management (photographer/creator)
 */
import { apiRequest, getAccessToken } from '@/lib/apiClient';
import { API_CONFIG } from '@/config/api';

type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type ReelPhotographer = {
  avatar: { public_id: string | null; url: string | null };
  _id: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  slug: string;
  fullName: string;
  isLocked: boolean;
  id: string;
};

export type Reel = {
  video: {
    public_id: string;
    url: string;
    sizeBytes: number;
    mimeType: string;
    playbackUrl: string | null;
  };
  thumbnail: {
    public_id: string;
    url: string;
  };
  _id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  durationSeconds: number;
  photographer: ReelPhotographer;
  likesCount: number;
  views: number;
  sharesCount: number;
  commentsCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  locationTag: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type ReelPagination = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type ReelsResponse = {
  reels: Reel[];
  pagination: ReelPagination;
};

export type ReelUploadData = {
  video: File;
  thumbnail: File;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
};

export type ReelUpdateData = {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  thumbnail?: File;
  isPublished?: boolean;
};

export type FetchReelsParams = {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
};

export type FetchMyReelsParams = {
  page?: number;
  limit?: number;
  isPublished?: boolean;
};

const BASE_URL = API_CONFIG.BASE_URL;

export const reelService = {
  // Upload a new reel (multipart/form-data)
  uploadReel: async (data: ReelUploadData): Promise<ApiResponse<Reel>> => {
    const formData = new FormData();
    formData.append('video', data.video);
    formData.append('thumbnail', data.thumbnail);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }

    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.REELS}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await response.json();
      } catch {
        // ignore
      }
      throw new Error(
        (errorData?.message as string) || `Upload failed with status ${response.status}`,
      );
    }

    return response.json();
  },

  // Get all public reels
  getReels: async (params?: FetchReelsParams): Promise<ApiResponse<ReelsResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.category) searchParams.set('category', params.category);
    if (params?.tag) searchParams.set('tag', params.tag);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    const endpoint = query ? `${API_CONFIG.ENDPOINTS.REELS}?${query}` : API_CONFIG.ENDPOINTS.REELS;
    return apiRequest<ApiResponse<ReelsResponse>>(endpoint);
  },

  // Get my reels (photographer's own reels)
  getMyReels: async (params?: FetchMyReelsParams): Promise<ApiResponse<ReelsResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.isPublished !== undefined) searchParams.set('isPublished', String(params.isPublished));

    const query = searchParams.toString();
    const endpoint = query ? `${API_CONFIG.ENDPOINTS.MY_REELS}?${query}` : API_CONFIG.ENDPOINTS.MY_REELS;
    return apiRequest<ApiResponse<ReelsResponse>>(endpoint, { requiresAuth: true });
  },

  // Update a reel (multipart/form-data for thumbnail + fields)
  updateReel: async (reelId: string, data: ReelUpdateData): Promise<ApiResponse<Reel>> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', JSON.stringify(data.tags));
    }
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.isPublished !== undefined) formData.append('isPublished', String(data.isPublished));

    const token = getAccessToken();
    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.REEL_BY_ID(reelId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData: Record<string, unknown> = {};
      try {
        errorData = await response.json();
      } catch {
        // ignore
      }
      throw new Error(
        (errorData?.message as string) || `Update failed with status ${response.status}`,
      );
    }

    return response.json();
  },

  // Like / Unlike a reel (toggles)
  toggleLikeReel: async (reelId: string): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
    return apiRequest<ApiResponse<{ liked: boolean; likesCount: number }>>(
      API_CONFIG.ENDPOINTS.REEL_LIKE(reelId),
      { method: 'POST', requiresAuth: true },
    );
  },
};