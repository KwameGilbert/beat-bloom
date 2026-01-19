import { create } from "zustand";
import { persist } from "zustand/middleware";

// User Profile Type
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cover: string;
  role: "producer" | "buyer" | "admin";
  location: string;
  website: string;
  joinedDate: string;
  stats: {
    beats: number;
    totalPlays: number;
    sales: number;
    earnings: number;
  };
}

// Default user profile
const defaultUser: UserProfile = {
  id: "user-1",
  name: "BeatBloom User",
  email: "user@beatbloom.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80",
  cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80",
  role: "producer",
  location: "Los Angeles, CA",
  website: "beatbloom.com",
  joinedDate: "January 2026",
  stats: {
    beats: 0,
    totalPlays: 0,
    sales: 0,
    earnings: 0,
  },
};

interface UserState {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateStats: (updates: Partial<UserProfile["stats"]>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      
      updateUser: (updates) => set((state) => ({
        user: { ...state.user, ...updates }
      })),

      updateStats: (updates) => set((state) => ({
        user: {
          ...state.user,
          stats: { ...state.user.stats, ...updates }
        }
      })),
    }),
    {
      name: "beatbloom-user-profile",
    }
  )
);
