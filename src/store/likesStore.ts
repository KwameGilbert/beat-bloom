import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Beat } from "@/lib/marketplace";

interface LikesState {
  likedBeats: Beat[];
  addLike: (beat: Beat) => void;
  removeLike: (beatId: string | number) => void;
  toggleLike: (beat: Beat) => void;
  isLiked: (beatId: string | number) => boolean;
  clearLikes: () => void;
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedBeats: [],

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

      toggleLike: (beat) => {
        const { likedBeats, addLike, removeLike } = get();
        if (likedBeats.find((b) => b.id.toString() === beat.id.toString())) {
          removeLike(beat.id);
        } else {
          addLike(beat);
        }
      },

      isLiked: (beatId) => {
        const idStr = beatId.toString();
        return get().likedBeats.some((b) => b.id.toString() === idStr);
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
