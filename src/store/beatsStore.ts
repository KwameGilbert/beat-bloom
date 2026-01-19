import { create } from "zustand";
import type { Beat, Producer, Pagination, Genre } from "@/lib/marketplace";
import { marketplaceService } from "@/lib/marketplace";
import { pagesService } from "@/lib/pages";

interface BeatsState {
  // Beats
  beats: Beat[];
  trendingBeats: Beat[];
  featuredBeats: Beat[];
  recentBeats: Beat[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;

  // Producers
  producers: Producer[];
  isLoadingProducers: boolean;

  // Genres
  genres: Genre[];
  isLoadingGenres: boolean;

  // Actions
  fetchBeats: (params?: Record<string, any>) => Promise<Beat[]>;
  fetchTrending: (limit?: number) => Promise<Beat[]>;
  fetchProducers: (params?: Record<string, any>) => Promise<void>;
  fetchGenres: () => Promise<Genre[]>;
  fetchHomePage: () => Promise<void>;
  getBeatPageData: (id: string | number) => Promise<any>;
  getBeat: (id: string | number) => Promise<Beat | null>;
  getProducer: (username: string) => Promise<Producer | null>;
}

export const useBeatsStore = create<BeatsState>((set) => ({
  beats: [],
  trendingBeats: [],
  featuredBeats: [],
  recentBeats: [],
  pagination: null,
  isLoading: false,
  error: null,

  producers: [],
  isLoadingProducers: false,

  genres: [],
  isLoadingGenres: false,

  fetchBeats: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await marketplaceService.getBeats(params);
      set({ 
        beats: response.data, 
        pagination: response.pagination,
        isLoading: false 
      });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  fetchTrending: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await marketplaceService.getTrending(limit);
      set({ 
        trendingBeats: response.data,
        isLoading: false 
      });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  fetchProducers: async (params = {}) => {
    set({ isLoadingProducers: true });
    try {
      const response = await marketplaceService.getProducers(params);
      set({ 
        producers: response.data,
        isLoadingProducers: false 
      });
    } catch (error: any) {
      set({ isLoadingProducers: false });
    }
  },

  fetchGenres: async () => {
    set({ isLoadingGenres: true });
    try {
      const response = await marketplaceService.getGenres();
      set({ 
        genres: response.data,
        isLoadingGenres: false 
      });
      return response.data;
    } catch (error: any) {
      set({ isLoadingGenres: false });
      return [];
    }
  },

  fetchHomePage: async () => {
    set({ isLoading: true });
    try {
      const response = await pagesService.getHomePage();
      if (response.success) {
        set({
          trendingBeats: response.data.trendingBeats,
          genres: response.data.genres,
          producers: response.data.featuredProducers,
          isLoading: false
        });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  getBeatPageData: async (id) => {
    try {
      const response = await pagesService.getBeatDetail(id);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getBeat: async (id) => {
    try {
      const response = await marketplaceService.getBeat(id);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  getProducer: async (username) => {
    try {
      const response = await marketplaceService.getProducer(username);
      return response.data;
    } catch (error) {
      return null;
    }
  },
}));
