import { create } from "zustand";
import { persist } from "zustand/middleware";
import { currentUser as mockUser, type UserProfile } from "@/data/beats";

interface UserState {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateStats: (updates: Partial<UserProfile["stats"]>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser,
      
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
