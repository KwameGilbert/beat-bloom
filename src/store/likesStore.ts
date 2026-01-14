import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Beat } from "@/data/beats";

interface LikesState {
  likedBeats: Beat[];
  addLike: (beat: Beat) => void;
  removeLike: (beatId: string) => void;
  toggleLike: (beat: Beat) => void;
  isLiked: (beatId: string) => boolean;
  clearLikes: () => void;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedBeats: [],

      addLike: (beat) => {
        const { likedBeats } = get();
        if (!likedBeats.find((b) => b.id === beat.id)) {
          set({ likedBeats: [...likedBeats, beat] });
        }
      },

      removeLike: (beatId) => {
        set((state) => ({
          likedBeats: state.likedBeats.filter((b) => b.id !== beatId),
        }));
      },

      toggleLike: (beat) => {
        const { likedBeats, addLike, removeLike } = get();
        if (likedBeats.find((b) => b.id === beat.id)) {
          removeLike(beat.id);
        } else {
          addLike(beat);
        }
      },

      isLiked: (beatId) => {
        return get().likedBeats.some((b) => b.id === beatId);
      },

      clearLikes: () => {
        set({ likedBeats: [] });
      },
    }),
    {
      name: "beatbloom-likes",
    }
  )
);
