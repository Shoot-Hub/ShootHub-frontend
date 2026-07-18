/**
 * Axios API client with automatic access-token refresh.
 */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from '@/config/api';
import { tokenService } from '@/features/auth/services/tokenService';
import { clearAuthSession } from '@/features/auth/store/authStore';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
};

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  requiresAuth?: boolean;
};

type QueueItem = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

function notifyUnauthorized(): void {
  clearAuthSession();
  onUnauthorized?.();
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });
  failedQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    // Use plain axios to avoid interceptor recursion on the refresh call.
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const payload = response.data?.data ?? response.data;
    const newAccessToken: string | undefined =
      payload?.accessToken ?? response.data?.accessToken;
    const newRefreshToken: string | undefined =
      payload?.refreshToken ?? response.data?.refreshToken;

    if (!newAccessToken) {
      return null;
    }

    tokenService.setTokens(newAccessToken, newRefreshToken ?? refreshToken);
    return newAccessToken;
  } catch {
    return null;
  }
}

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const req = config as RetryableConfig;

  if (req.requiresAuth) {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableConfig | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? '';
    const isRefreshCall = url.includes(API_CONFIG.ENDPOINTS.REFRESH_TOKEN);

    // Public endpoints or already-retried requests: do not refresh again.
    if (!originalRequest.requiresAuth || isRefreshCall || originalRequest._retry) {
      if (originalRequest.requiresAuth || isRefreshCall) {
        notifyUnauthorized();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (!token) {
          return Promise.reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        processQueue(error, null);
        notifyUnauthorized();
        return Promise.reject(error);
      }

      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      notifyUnauthorized();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export function setTokens(accessToken: string, refreshToken: string): void {
  tokenService.setTokens(accessToken, refreshToken);
}

export function clearTokens(): void {
  tokenService.clearTokens();
}

export function getAccessToken(): string | null {
  return tokenService.getAccessToken();
}

export function getRefreshToken(): string | null {
  return tokenService.getRefreshToken();
}

/** Expose refresh for auth bootstrap (outside interceptor). */
export async function refreshTokens(): Promise<string | null> {
  return refreshAccessToken();
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, requiresAuth = false } = options;

  const config: AxiosRequestConfig & { requiresAuth?: boolean } = {
    url: endpoint,
    method,
    headers,
    requiresAuth,
  };

  if (body !== undefined && method !== 'GET') {
    config.data = body;
  }

  try {
    const response = await axiosInstance.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as Record<string, unknown> | undefined;
      const message =
        (typeof data?.message === 'string' && data.message) ||
        (typeof data?.error === 'string' && data.error) ||
        error.message ||
        `Request failed with status ${error.response?.status ?? 'unknown'}`;

      throw new ApiError(message, error.response?.status ?? 0, data);
    }
    throw error;
  }
}
