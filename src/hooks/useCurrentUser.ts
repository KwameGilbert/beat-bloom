/**
 * useCurrentUser Hook
 * 
 * Provides the current authenticated user with computed properties.
 * This is a compatibility layer between the old userStore and new authStore.
 */

import { useAuthStore } from '@/store/authStore';

export interface CurrentUserProfile {
  id: number;
  email: string;
  name: string;
  role: 'producer' | 'artist' | 'admin';
  avatar?: string;
  coverImage?: string;
  location?: string;
  website?: string;
  bio?: string;
  isVerified: boolean;
  producer?: {
    id: number;
    username: string;
    displayName: string;
  };
  stats: {
    totalBeats: number;
    totalPlays: number;
    totalSales: number;
    totalEarnings: number;
    followers: number;
  };
  createdAt: string;
}

// Default mock stats for now (will be fetched from API later)
const defaultStats = {
  totalBeats: 0,
  totalPlays: 0,
  totalSales: 0,
  totalEarnings: 0,
  followers: 0,
};

/**
 * Hook to get the current user with computed properties
 */
export const useCurrentUser = (): CurrentUserProfile | null => {
  const user = useAuthStore((state) => state.user);
  
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    coverImage: user.coverImage,
    location: user.location,
    website: user.website,
    bio: user.bio,
    isVerified: !!user.emailVerifiedAt,
    producer: user.producer ? {
      id: user.producer.id,
      username: user.producer.username,
      displayName: user.producer.displayName,
    } : undefined,
    stats: defaultStats, // TODO: Fetch from API
    createdAt: user.createdAt,
  };
};

/**
 * Re-export useUserStore for backward compatibility
 * This maps to useAuthStore functionality
 */
export const useUserStore = () => {
  const user = useCurrentUser();
  const { updateProfile } = useAuthStore();
  
  return {
    user: user || {
      id: 0,
      email: '',
      name: 'Guest',
      role: 'artist' as const,
      avatar: undefined,
      stats: defaultStats,
      createdAt: new Date().toISOString(),
    },
    updateUser: async (updates: Partial<CurrentUserProfile>) => {
      if (!user) return;
      await updateProfile(updates);
    },
    updateStats: () => {
      // Stats are fetched from API, not updated locally
      console.warn('Stats should be updated via API, not locally');
    },
  };
};

export default useCurrentUser;
