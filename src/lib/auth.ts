/**
 * Auth Service
 * 
 * Handle all authentication-related API calls
 */

import { api, ApiError, getRefreshToken } from './api';
import type { 
  AuthResponse, 
  ChangePasswordData,
  LoginData, 
  ProducerProfile, 
  RegisterData, 
  UpdateProfileData, 
  UpdateSettingsData, 
  User 
} from '@/types';

export type { 
  AuthResponse, 
  ChangePasswordData,
  LoginData, 
  ProducerProfile, 
  RegisterData, 
  UpdateProfileData, 
  UpdateSettingsData, 
  User 
};

export { ApiError };

/**
 * Auth API Service
 */
export const authService = {
  /**
   * Check username availability
   */
  async checkUsername(username: string): Promise<{ data: { available: boolean } }> {
    return api.get<{ data: { available: boolean } }>(`/auth/check-username?username=${username}`);
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ data: { accessToken: string; refreshToken?: string } }> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401);
    }
    return api.post('/auth/refresh', { refreshToken });
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{ data: User }> {
    return api.get('/auth/me');
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData | FormData): Promise<{ data: User }> {
    return api.patch('/auth/me', data);
  },

  /**
   * Update user settings
   */
  async updateSettings(data: UpdateSettingsData): Promise<{ data: User }> {
    return api.patch('/auth/settings', data);
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean }> {
    return api.post('/auth/change-password', data);
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with OTP
   */
  async resetPassword(email: string, otp: string, password: string): Promise<{ success: boolean }> {
    return api.post('/auth/reset-password', { email, otp, password });
  },

  /**
   * Verify password reset OTP
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    return api.post('/auth/verify-otp', { email, otp });
  },

  /**
   * Resend password reset OTP
   */
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    return api.post('/auth/resend-otp', { email });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ data: { verified: boolean } }> {
    return api.get(`/auth/verify-email?token=${token}`);
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean }> {
    return api.post('/auth/resend-verification', { email });
  },

  /**
   * Logout - revoke tokens
   */
  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore errors on logout
    }
  },

  /**
   * Delete account
   */
  async deleteAccount(): Promise<{ success: boolean }> {
    return api.delete('/auth/me');
  },

  /**
   * 2FA Support
   */
  async setup2FA(): Promise<{ data: { secret: string; qrCode: string } }> {
    return api.get('/auth/2fa/setup');
  },

  async verify2FA(code: string): Promise<{ data: { backupCodes: string[] } }> {
    return api.post('/auth/2fa/verify', { code });
  },

  async disable2FA(): Promise<{ success: boolean }> {
    return api.post('/auth/disable-2fa');
  },

  /**
   * Upgrade to producer role
   */
  async upgradeToProducer(): Promise<{ data: { user: User; accessToken: string; refreshToken?: string } }> {
    return api.post('/auth/upgrade');
  },
};

export default authService;
