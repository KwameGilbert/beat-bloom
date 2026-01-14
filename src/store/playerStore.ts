import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";
import { featuredBeats, trendingBeats } from "@/data/beats";

// All beats as the default playlist
const allBeats = [...featuredBeats, ...trendingBeats];

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  recentlyPlayed: Beat[];
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  playlist: Beat[];
  playBeat: (beat: Beat) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearRecentlyPlayed: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  closePlayer: () => void;
}

const MAX_RECENTLY_PLAYED = 20;

// Get a random beat from playlist (for shuffle)
const getRandomBeat = (playlist: Beat[], currentId: string | undefined): Beat | null => {
  const available = playlist.filter(b => b.id !== currentId);
  if (available.length === 0) return playlist[0] || null;
  return available[Math.floor(Math.random() * available.length)];
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentBeat: null,
      isPlaying: false,
      isLoading: false,
      volume: 1,
      recentlyPlayed: [],
      shuffle: false,
      repeat: "off",
      playlist: allBeats,
      
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

      nextTrack: () => {
        const { currentBeat, playlist, shuffle, recentlyPlayed } = get();
        if (!currentBeat || playlist.length === 0) return;

        let nextBeat: Beat | null = null;

        if (shuffle) {
          // Random track
          nextBeat = getRandomBeat(playlist, currentBeat.id);
        } else {
          // Sequential - always go to next track
          const currentIndex = playlist.findIndex(b => b.id === currentBeat.id);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex >= playlist.length) {
            // End of playlist - wrap to beginning
            nextBeat = playlist[0];
          } else {
            nextBeat = playlist[nextIndex];
          }
        }

        if (nextBeat) {
          const filtered = recentlyPlayed.filter((b) => b.id !== nextBeat!.id);
          const updated = [nextBeat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
          set({ currentBeat: nextBeat, isPlaying: true, recentlyPlayed: updated });
        }
      },

      previousTrack: () => {
        const { currentBeat, playlist, shuffle, recentlyPlayed } = get();
        if (!currentBeat || playlist.length === 0) return;

        let prevBeat: Beat | null = null;

        if (shuffle) {
          // Random track
          prevBeat = getRandomBeat(playlist, currentBeat.id);
        } else {
          // Sequential
          const currentIndex = playlist.findIndex(b => b.id === currentBeat.id);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex < 0) {
            // Start of playlist - go to end
            prevBeat = playlist[playlist.length - 1];
          } else {
            prevBeat = playlist[prevIndex];
          }
        }

        if (prevBeat) {
          const filtered = recentlyPlayed.filter((b) => b.id !== prevBeat!.id);
          const updated = [prevBeat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
          set({ currentBeat: prevBeat, isPlaying: true, recentlyPlayed: updated });
        }
      },

      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
      
      toggleRepeat: () => set((state) => {
        const modes: Array<"off" | "one" | "all"> = ["off", "one", "all"];
        const currentIndex = modes.indexOf(state.repeat);
        const nextIndex = (currentIndex + 1) % modes.length;
        return { repeat: modes[nextIndex] };
      }),

      closePlayer: () => set({ currentBeat: null, isPlaying: false }),
    }),
    {
      name: "beatbloom-player",
      partialize: (state) => ({ 
        recentlyPlayed: state.recentlyPlayed,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
      }),
    }
  )
);
