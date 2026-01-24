/**
 * Auth Store
 * 
 * Manages authentication state with Zustand
 * Persists tokens and user data to localStorage
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type User, type RegisterData, type LoginData, type UpdateProfileData, type UpdateSettingsData, type ChangePasswordData, ApiError } from '@/lib/auth';
import { usePlaylistsStore } from './playlistsStore';
import { useThemeStore } from './themeStore';

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileData | FormData) => Promise<void>;
  updateSettings: (data: UpdateSettingsData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  // TODO: Re-enable when 2FA is fully implemented
  // setup2FA: () => Promise<{ secret: string; qrCode: string }>;
  // verify2FA: (code: string) => Promise<string[]>;
  // disable2FA: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  setOAuthTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Register a new user
       */
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          const { user, accessToken, refreshToken } = response.data;

          set({
            user,
            accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Sync theme from database
          if (user.theme) {
            useThemeStore.getState().setThemeOnly(user.theme);
          }
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Login user
       */
      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(data);
          const { user, accessToken, refreshToken } = response.data;

          set({
            user,
            accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Sync theme from database
          if (user.theme) {
            useThemeStore.getState().setThemeOnly(user.theme);
          }
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // Ignore logout errors
        } finally {
          // Clear playlists store
          usePlaylistsStore.getState().clearPlaylists();
          
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Refresh tokens
       */
      refreshTokens: async () => {
        try {
          const response = await authService.refreshToken();
          set({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken || get().refreshToken,
          });
          return true;
        } catch {
          // Token refresh failed, logout user
          get().logout();
          return false;
        }
      },

      /**
       * Fetch current user profile
       */
      fetchProfile: async () => {
        if (!get().accessToken) return;
        
        set({ isLoading: true });
        try {
          const response = await authService.getProfile();
          set({ user: response.data, isLoading: false });

          // Sync theme from database
          if (response.data.theme) {
            useThemeStore.getState().setThemeOnly(response.data.theme);
          }
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            // Try to refresh token
            const refreshed = await get().refreshTokens();
            if (refreshed) {
              // Retry profile fetch
              const response = await authService.getProfile();
              set({ user: response.data, isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        }
      },

      /**
       * Update user profile
       */
      updateProfile: async (data: UpdateProfileData | FormData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(data);
          set({ user: response.data, isLoading: false });

          // Sync theme from database
          if (response.data.theme) {
            useThemeStore.getState().setThemeOnly(response.data.theme);
          }
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Profile update failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Update user settings
       */
      updateSettings: async (data: UpdateSettingsData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateSettings(data);
          set({ user: response.data, isLoading: false });

          // Sync theme from database
          if (response.data.theme) {
            useThemeStore.getState().setThemeOnly(response.data.theme);
          }
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Settings update failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Change user password
       */
      changePassword: async (data: ChangePasswordData) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(data);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Password change failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Request password reset
       */
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword(email);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Request failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Verify password reset OTP
       */
      verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.verifyOTP(email, otp);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Verification failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Resend password reset OTP
       */
      resendOTP: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resendOTP(email);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Resend failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Reset password with OTP
       */
      resetPassword: async (email: string, otp: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email, otp, password);
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Reset failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      /**
       * Delete user account
       */
      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : 'Account deletion failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      // TODO: Re-enable when 2FA is fully implemented
      /*
      setup2FA: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.setup2FA();
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : '2FA setup failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      verify2FA: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.verify2FA(code);
          await get().fetchProfile();
          set({ isLoading: false });
          return response.data.backupCodes;
        } catch (error) {
          const message = error instanceof ApiError ? error.message : '2FA verification failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      disable2FA: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.disable2FA();
          await get().fetchProfile();
          set({ isLoading: false });
        } catch (error) {
          const message = error instanceof ApiError ? error.message : '2FA disable failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },
      */

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),

      /**
       * Set user directly (for optimistic updates)
       */
      setUser: (user: User) => {
        set({ user });
        // Sync theme from database
        if (user.theme) {
          useThemeStore.getState().setThemeOnly(user.theme);
        }
      },

      /**
       * Set OAuth tokens (for OAuth callback flow)
       */
      setOAuthTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'beatbloom-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * Hook to check if user is a producer
 */
export const useIsProducer = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'producer' || user?.role === 'admin';
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin';
};

export default useAuthStore;
