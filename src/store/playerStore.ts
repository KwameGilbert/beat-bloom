import { create } from "zustand";
import type { Beat } from "@/data/beats";

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  playBeat: (beat: Beat) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentBeat: null,
  isPlaying: false,
  isLoading: false,
  volume: 1,
  playBeat: (beat) => set({ currentBeat: beat, isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
