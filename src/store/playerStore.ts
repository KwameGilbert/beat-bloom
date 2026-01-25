import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/types";
import { marketplaceService } from "@/lib/marketplace";

interface PlayerState {
  currentBeat: Beat | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  recentlyPlayed: Beat[];
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  playlist: Beat[];
  playBeat: (beat: Beat, playlist?: Beat[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearRecentlyPlayed: () => void;
  nextTrack: () => Promise<void>;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  closePlayer: () => void;
  setPlaylist: (playlist: Beat[]) => void;
}

const MAX_RECENTLY_PLAYED = 20;

// Get a random beat from playlist (for shuffle)
const getRandomBeat = (playlist: Beat[], currentId: string | number | undefined): Beat | null => {
  if (!currentId) return playlist[0] || null;
  const idStr = currentId.toString();
  const available = playlist.filter(b => b.id.toString() !== idStr);
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
      playlist: [],
      
      playBeat: async (beat, playlist) => {
        const { recentlyPlayed } = get();
        const idStr = beat.id.toString();
        // Remove the beat if it already exists in recently played
        const filtered = recentlyPlayed.filter((b) => b.id.toString() !== idStr);
        // Add to the beginning of the array
        const updated = [beat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
        
        // Set both currentBeat and playlist if provided
        const stateUpdate: Partial<PlayerState> = { 
          currentBeat: beat, 
          isPlaying: true, 
          recentlyPlayed: updated 
        };
        
        // If a playlist is provided, use it; otherwise keep existing playlist
        if (playlist && playlist.length > 0) {
          stateUpdate.playlist = playlist;
        }
        
        set(stateUpdate as any);

        // Record play on backend
        try {
          await marketplaceService.recordPlay(beat.id);
        } catch (error) {
          console.error("Failed to record play on backend:", error);
        }
      },
      
      pause: () => set({ isPlaying: false }),
      resume: () => set({ isPlaying: true }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setVolume: (volume) => set({ volume }),
      setIsLoading: (isLoading) => set({ isLoading }),
      clearRecentlyPlayed: () => set({ recentlyPlayed: [] }),

      nextTrack: async () => {
        const { currentBeat, playlist, shuffle, repeat, recentlyPlayed } = get();
        
        // If no playlist but we have a current beat, try to fetch trending as new playlist
        if (playlist.length === 0 && currentBeat) {
          try {
            const response = await marketplaceService.getTrending(20);
            if (response.data && response.data.length > 0) {
              // Filter out current beat and set as new playlist
              const newPlaylist = response.data.filter(
                (b: Beat) => b.id.toString() !== currentBeat.id.toString()
              );
              if (newPlaylist.length > 0) {
                const nextBeat = newPlaylist[0];
                const nextIdStr = nextBeat.id.toString();
                const filtered = recentlyPlayed.filter((b) => b.id.toString() !== nextIdStr);
                const updated = [nextBeat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
                set({ 
                  currentBeat: nextBeat, 
                  isPlaying: true, 
                  recentlyPlayed: updated,
                  playlist: response.data 
                });
                return;
              }
            }
          } catch (error) {
            console.error("Failed to fetch trending for continuous playback:", error);
          }
          return;
        }

        if (!currentBeat || playlist.length === 0) return;

        let nextBeat: Beat | null = null;
        const currentIdStr = currentBeat.id.toString();

        if (shuffle) {
          // Random track
          nextBeat = getRandomBeat(playlist, currentBeat.id);
        } else {
          // Sequential - always go to next track
          const currentIndex = playlist.findIndex(b => b.id.toString() === currentIdStr);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex >= playlist.length) {
            // End of playlist
            if (repeat === "all") {
              // Loop back to beginning
              nextBeat = playlist[0];
            } else {
              // Fetch trending beats as the next playlist for continuous playback
              try {
                const response = await marketplaceService.getTrending(20);
                if (response.data && response.data.length > 0) {
                  // Filter out beats already in current playlist to get fresh content
                  const playlistIds = new Set(playlist.map(b => b.id.toString()));
                  const newBeats = response.data.filter(
                    (b: Beat) => !playlistIds.has(b.id.toString())
                  );
                  
                  if (newBeats.length > 0) {
                    nextBeat = newBeats[0];
                    // Update playlist with trending beats
                    set({ playlist: response.data });
                  } else {
                    // All trending are in playlist, just wrap around
                    nextBeat = playlist[0];
                  }
                } else {
                  // No trending available, wrap around
                  nextBeat = playlist[0];
                }
              } catch (error) {
                console.error("Failed to fetch next playlist:", error);
                // Fallback to wrapping around
                nextBeat = playlist[0];
              }
            }
          } else {
            nextBeat = playlist[nextIndex];
          }
        }

        if (nextBeat) {
          const nextIdStr = nextBeat.id.toString();
          const filtered = recentlyPlayed.filter((b) => b.id.toString() !== nextIdStr);
          const updated = [nextBeat, ...filtered].slice(0, MAX_RECENTLY_PLAYED);
          set({ currentBeat: nextBeat, isPlaying: true, recentlyPlayed: updated });
        }
      },

      previousTrack: () => {
        const { currentBeat, playlist, shuffle, recentlyPlayed } = get();
        if (!currentBeat || playlist.length === 0) return;

        let prevBeat: Beat | null = null;
        const currentIdStr = currentBeat.id.toString();

        if (shuffle) {
          // Random track
          prevBeat = getRandomBeat(playlist, currentBeat.id);
        } else {
          // Sequential
          const currentIndex = playlist.findIndex(b => b.id.toString() === currentIdStr);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex < 0) {
            // Start of playlist - go to end
            prevBeat = playlist[playlist.length - 1];
          } else {
            prevBeat = playlist[prevIndex];
          }
        }

        if (prevBeat) {
          const prevIdStr = prevBeat.id.toString();
          const filtered = recentlyPlayed.filter((b) => b.id.toString() !== prevIdStr);
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

      setPlaylist: (playlist) => set({ playlist }),
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
