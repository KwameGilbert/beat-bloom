import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";

export interface Playlist {
  id: string;
  name: string;
  color: string;
  beats: Beat[];
  createdAt: string;
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
  createPlaylist: (name: string, color?: string) => Playlist;
  deletePlaylist: (playlistId: string) => void;
  renamePlaylist: (playlistId: string, newName: string) => void;
  changePlaylistColor: (playlistId: string, newColor: string) => void;
  addBeatToPlaylist: (playlistId: string, beat: Beat) => void;
  removeBeatFromPlaylist: (playlistId: string, beatId: string) => void;
  isBeatInPlaylist: (playlistId: string, beatId: string) => boolean;
  getPlaylist: (playlistId: string) => Playlist | undefined;
  getPlaylistsContainingBeat: (beatId: string) => Playlist[];
}

const generateId = () => `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const usePlaylistsStore = create<PlaylistsState>()(
  persist(
    (set, get) => ({
      playlists: [
        // Default playlists
        {
          id: "favorites",
          name: "My Favorites",
          color: "bg-red-500",
          beats: [],
          createdAt: new Date().toISOString(),
        },
        {
          id: "workout",
          name: "Workout Vibes",
          color: "bg-green-500",
          beats: [],
          createdAt: new Date().toISOString(),
        },
      ],

      createPlaylist: (name, color = "bg-orange-500") => {
        const newPlaylist: Playlist = {
          id: generateId(),
          name,
          color,
          beats: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));
        return newPlaylist;
      },

      deletePlaylist: (playlistId) => {
        set((state) => ({
          playlists: state.playlists.filter((p) => p.id !== playlistId),
        }));
      },

      renamePlaylist: (playlistId, newName) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, name: newName } : p
          ),
        }));
      },

      changePlaylistColor: (playlistId, newColor) => {
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId ? { ...p, color: newColor } : p
          ),
        }));
      },

      addBeatToPlaylist: (playlistId, beat) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id === playlistId) {
              // Don't add duplicates
              if (p.beats.some((b) => b.id === beat.id)) return p;
              return { ...p, beats: [...p.beats, beat] };
            }
            return p;
          }),
        }));
      },

      removeBeatFromPlaylist: (playlistId, beatId) => {
        set((state) => ({
          playlists: state.playlists.map((p) => {
            if (p.id === playlistId) {
              return { ...p, beats: p.beats.filter((b) => b.id !== beatId) };
            }
            return p;
          }),
        }));
      },

      isBeatInPlaylist: (playlistId, beatId) => {
        const playlist = get().playlists.find((p) => p.id === playlistId);
        return playlist?.beats.some((b) => b.id === beatId) ?? false;
      },

      getPlaylist: (playlistId) => {
        return get().playlists.find((p) => p.id === playlistId);
      },

      getPlaylistsContainingBeat: (beatId) => {
        return get().playlists.filter((p) => p.beats.some((b) => b.id === beatId));
      },
    }),
    {
      name: "beatbloom-playlists",
    }
  )
);
