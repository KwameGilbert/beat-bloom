import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Beat, marketplaceService } from "@/lib/marketplace";
import { api } from "@/lib/api";

interface LikesState {
  likedBeats: Beat[];
  isLoading: boolean;
  hasFetched: boolean;
  addLike: (beat: Beat) => void;
  removeLike: (beatId: string | number) => void;
  toggleLike: (beat: Beat) => void;
  isLiked: (beatId: string | number) => boolean;
  clearLikes: () => void;
  fetchLikedBeats: () => Promise<void>;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedBeats: [],
      isLoading: false,
      hasFetched: false,

      addLike: (beat) => {
        const { likedBeats } = get();
        if (!likedBeats.find((b) => b.id.toString() === beat.id.toString())) {
          set({ likedBeats: [...likedBeats, beat] });
        }
      },

      removeLike: (beatId) => {
        const idStr = beatId.toString();
        set((state) => ({
          likedBeats: state.likedBeats.filter((b) => b.id.toString() !== idStr),
        }));
      },

      toggleLike: async (beat) => {
        const { likedBeats, addLike, removeLike } = get();
        const isCurrentlyLiked = likedBeats.find((b) => b.id.toString() === beat.id.toString());
        
        if (isCurrentlyLiked) {
          removeLike(beat.id);
        } else {
          addLike(beat);
        }

        // Backend integration
        try {
          // marketplaceService.toggleLike internally uses api.post which includes token if available
          await marketplaceService.toggleLike(beat.id);
        } catch (error) {
          console.error("Failed to sync like with backend:", error);
          // Optional: Revert local state if not authenticated or error
        }
      },

      isLiked: (beatId) => {
        const idStr = beatId.toString();
        return get().likedBeats.some((b) => b.id.toString() === idStr);
      },

      clearLikes: () => {
        set({ likedBeats: [], hasFetched: false });
      },

      fetchLikedBeats: async () => {
        const { hasFetched, isLoading } = get();
        if (hasFetched || isLoading) return;

        set({ isLoading: true });
        try {
          interface LikedBeatsResponse {
            success: boolean;
            data: {
              data: Beat[];
              pagination: { total: number; page: number; limit: number };
            };
          }
          const response = await api.get<LikedBeatsResponse>('/activity/likes');
          // Response format: { success: true, data: { data: Beat[], pagination: {...} } }
          if (response.success && response.data?.data) {
            set({ 
              likedBeats: response.data.data,
              hasFetched: true,
              isLoading: false 
            });
          } else {
            set({ isLoading: false, hasFetched: true });
          }
        } catch (error) {
          console.error("Failed to fetch liked beats:", error);
          set({ isLoading: false, hasFetched: true });
        }
      },
    }),
    {
      name: "beatbloom-likes",
    }
  )
);
