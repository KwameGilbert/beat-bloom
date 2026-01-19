import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/lib/marketplace";
import { api } from "@/lib/api";

export interface Playlist {
  id: string | number;
  name: string;
  color: string;
  beats: Beat[];
  beatsCount?: number;
  description?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Available playlist colors
export const playlistColors = [
  { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
  { name: "Red", value: "bg-red-500", hex: "#ef4444" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
  { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { name: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
  { name: "Cyan", value: "bg-cyan-500", hex: "#06b6d4" },
  { name: "Green", value: "bg-green-500", hex: "#22c55e" },
  { name: "Yellow", value: "bg-yellow-500", hex: "#eab308" },
];

interface PlaylistsState {
  playlists: Playlist[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchPlaylists: () => Promise<void>;
  createPlaylist: (name: string, color?: string) => Promise<Playlist | undefined>;
  deletePlaylist: (playlistId: string | number) => Promise<void>;
  renamePlaylist: (playlistId: string | number, newName: string) => Promise<void>;
  changePlaylistColor: (playlistId: string | number, newColor: string) => Promise<void>;
  addBeatToPlaylist: (playlistId: string | number, beat: Beat) => Promise<void>;
  removeBeatFromPlaylist: (playlistId: string | number, beatId: string | number) => Promise<void>;
  isBeatInPlaylist: (playlistId: string | number, beatId: string | number) => boolean;
  getPlaylist: (playlistId: string | number) => Playlist | undefined;
  getPlaylistsContainingBeat: (beatId: string | number) => Playlist[];
}

export const usePlaylistsStore = create<PlaylistsState>()(
  persist(
    (set, get) => ({
      playlists: [],
      isLoading: false,
      hasFetched: false,

      fetchPlaylists: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true });
        try {
          const response = await api.get<{ success: boolean; data: Playlist[] }>('/playlists');
          if (response.success && response.data) {
            // Replace all playlists with backend data to avoid stale local IDs
            const playlists = response.data.map(p => ({
              ...p,
              beats: p.beats || [],
            }));
            set({ 
              playlists,
              hasFetched: true,
              isLoading: false 
            });
          } else {
            set({ isLoading: false, hasFetched: true });
          }
        } catch (error) {
          console.error("Failed to fetch playlists:", error);
          set({ isLoading: false, hasFetched: true });
        }
      },

      createPlaylist: async (name, color = "bg-orange-500") => {
        try {
          const response = await api.post<{ success: boolean; data: Playlist }>('/playlists', {
            name,
            color,
          });
          
          if (response.success && response.data) {
            const newPlaylist = {
              ...response.data,
              beats: response.data.beats || [],
            };
            set((state) => ({
              playlists: [...state.playlists, newPlaylist],
            }));
            return newPlaylist;
          }
          throw new Error("Failed to create playlist");
        } catch (error) {
          console.error("Failed to create playlist:", error);
          throw error; // Re-throw so the UI can handle the error
        }
      },

      deletePlaylist: async (playlistId) => {
        // Optimistic update
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id.toString() !== playlistId.toString()),
        }));

        // Sync with backend
        try {
          await api.delete(`/playlists/${playlistId}`);
        } catch (error) {
          console.error("Failed to delete playlist on backend:", error);
        }
      },

      renamePlaylist: async (playlistId, newName) => {
        // Optimistic update
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id.toString() === playlistId.toString() ? { ...p, name: newName } : p
          ),
        }));

        // Sync with backend
        try {
          await api.patch(`/playlists/${playlistId}`, { name: newName });
        } catch (error) {
          console.error("Failed to rename playlist on backend:", error);
        }
      },

      changePlaylistColor: async (playlistId, newColor) => {
        // Optimistic update
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id.toString() === playlistId.toString() ? { ...p, color: newColor } : p
          ),
        }));

        // Sync with backend
        try {
          await api.patch(`/playlists/${playlistId}`, { color: newColor });
        } catch (error) {
          console.error("Failed to update playlist color on backend:", error);
        }
      },

      addBeatToPlaylist: async (playlistId, beat) => {
        // Optimistic update
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id.toString() === playlistId.toString()) {
              // Don't add duplicates
              if (p.beats.some((b) => b.id.toString() === beat.id.toString())) return p;
              return { ...p, beats: [...p.beats, beat] };
            }
            return p;
          }),
        }));

        // Sync with backend
        try {
          await api.post(`/playlists/${playlistId}/beats`, { beatId: beat.id });
        } catch (error) {
          console.error("Failed to add beat to playlist on backend:", error);
        }
      },

      removeBeatFromPlaylist: async (playlistId, beatId) => {
        const idStr = beatId.toString();
        // Optimistic update
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id.toString() === playlistId.toString()) {
              return { ...p, beats: p.beats.filter((b) => b.id.toString() !== idStr) };
            }
            return p;
          }),
        }));

        // Sync with backend
        try {
          await api.delete(`/playlists/${playlistId}/beats/${beatId}`);
        } catch (error) {
          console.error("Failed to remove beat from playlist on backend:", error);
        }
      },

      isBeatInPlaylist: (playlistId, beatId) => {
        const idStr = beatId.toString();
        const playlist = get().playlists.find((p) => p.id.toString() === playlistId.toString());
        return playlist?.beats.some((b) => b.id.toString() === idStr) ?? false;
      },

      getPlaylist: (playlistId) => {
        return get().playlists.find((p) => p.id.toString() === playlistId.toString());
      },

      getPlaylistsContainingBeat: (beatId) => {
        const idStr = beatId.toString();
        return get().playlists.filter((p) => p.beats.some((b) => b.id.toString() === idStr));
      },
    }),
    {
      name: "beatbloom-playlists",
    }
  )
);
