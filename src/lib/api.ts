/**
 * API Configuration and HTTP Client
 * 
 * Centralized API client with interceptors for auth tokens
 */

// API Base URL - change in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
  const authData = localStorage.getItem('beatbloom-auth');
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
  const authData = localStorage.getItem('beatbloom-auth');
  if (!authData) return null;
  
  try {
    const parsed = JSON.parse(authData);
    return parsed.state?.refreshToken || null;
  } catch {
    return null;
  }
};

/**
 * Base fetch wrapper with auth headers and error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

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
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
