/**
 * API Configuration and HTTP Client
 * 
 * Centralized API client with interceptors for auth tokens
 */

// API Base URL - change in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://beat-bloom-api.kantatech.io';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  message: string;
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Get stored access token
 */
export const getAccessToken = (): string | null => {
  const authData = localStorage.getItem('EasyBeats-auth');
  if (!authData) return null;
  
  try {
    const parsed = JSON.parse(authData);
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  const authData = localStorage.getItem('EasyBeats-auth');
  if (!authData) return null;
  
  try {
    const parsed = JSON.parse(authData);
    return parsed.state?.refreshToken || null;
  } catch {
    return null;
  }
};

// Active promise for refreshing tokens to prevent multiple concurrent refresh requests
let refreshPromise: Promise<boolean> | null = null;

/**
 * Base fetch wrapper with auth headers and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only set Content-Type to JSON if it's not FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  // Add auth header if token exists
  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Parse response
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Handle errors
  if (!response.ok) {
    // If unauthorized and we have an access token, try to refresh it (exclude the refresh token endpoint itself)
    if (response.status === 401 && !endpoint.includes('/auth/refresh-token') && getAccessToken()) {
      try {
        if (!refreshPromise) {
          const { useAuthStore } = await import('../store/authStore');
          refreshPromise = useAuthStore.getState().refreshTokens().finally(() => {
            refreshPromise = null;
          });
        }

        const refreshed = await refreshPromise;
        if (refreshed) {
          const { useAuthStore } = await import('../store/authStore');
          const newToken = useAuthStore.getState().accessToken;

          // Re-create headers with the new token
          const retryHeaders: HeadersInit = {
            ...options.headers,
          };
          if (!(options.body instanceof FormData)) {
            (retryHeaders as Record<string, string>)['Content-Type'] = 'application/json';
          }
          if (newToken) {
            (retryHeaders as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
          }

          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });

          let retryData;
          const retryContentType = retryResponse.headers.get('content-type');
          if (retryContentType?.includes('application/json')) {
            retryData = await retryResponse.json();
          } else {
            retryData = await retryResponse.text();
          }

          if (!retryResponse.ok) {
            const message = retryData?.message || retryData?.error || 'An error occurred';
            const errors = retryData?.errors;
            throw new ApiError(message, retryResponse.status, errors);
          }

          return retryData;
        }
      } catch (refreshError) {
        console.error('Error during token refresh/retry:', refreshError);
      }
    }

    const message = data?.message || data?.error || 'An error occurred';
    const errors = data?.errors;
    throw new ApiError(message, response.status, errors);
  }

  return data;
}

/**
 * API methods
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
