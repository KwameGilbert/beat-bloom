import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  recentlyPlayed: Beat[];
  playBeat: (beat: Beat) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearRecentlyPlayed: () => void;
}

const MAX_RECENTLY_PLAYED = 20;

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentBeat: null,
      isPlaying: false,
      isLoading: false,
      volume: 1,
      recentlyPlayed: [],
      
      playBeat: (beat) => {
        const { recentlyPlayed } = get();
        // Remove the beat if it already exists in recently played
        const filtered = recentlyPlayed.filter((b) => b.id !== beat.id);
        // Add to the beginning of the array
        const updated = [beat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
        set({ currentBeat: beat, isPlaying: true, recentlyPlayed: updated });
      },
      
      pause: () => set({ isPlaying: false }),
      resume: () => set({ isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setVolume: (volume) => set({ volume }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearRecentlyPlayed: () => set({ recentlyPlayed: [] }),
    }),
    {
      name: "beatbloom-player",
      partialize: (state) => ({ 
        recentlyPlayed: state.recentlyPlayed,
        volume: state.volume 
      }),
    }
  )
);
