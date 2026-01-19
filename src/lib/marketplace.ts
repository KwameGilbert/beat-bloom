/**
 * Marketplace API Client 
 * 
 * Handles all requests related to Beats and Producers
 */

import { api } from './api';

// Types
export interface LicenseTier {
  id: number;
  beatId: number;
  tierType: 'mp3' | 'wav' | 'stems' | 'exclusive';
  name: string;
  price: number;
  description: string;
  includedFiles: string[];
  isExclusive: boolean;
  isEnabled: boolean;
}

export interface Beat {
  id: number | string;
  producerId: number | string;
  genreId?: number | string;
  title: string;
  slug: string;
  description?: string;
  bpm: number;
  musicalKey: string;
  duration?: string;
  durationSeconds?: number;
  coverImage?: string;
  previewAudioUrl?: string;
  tags: string[];
  playsCount: number;
  likesCount: number;
  isExclusiveSold: boolean;
  status: 'draft' | 'active' | 'archived' | 'soldExclusive';
  isFeatured: boolean;
  producerName: string;
  producerUsername: string;
  genreName?: string;
  licenseTiers?: LicenseTier[];
  price?: number;
  createdAt: string;
}

export interface Producer {
  id: number | string;
  userId: number | string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  isVerified: boolean;
  beats?: Beat[];
  createdAt: string;
}

export interface Genre {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  beatCount?: number;
  isActive: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

// Service
export const marketplaceService = {
  /**
   * Get all beats with filters
   */
  async getBeats(params: Record<string, any> = {}): Promise<ListResponse<Beat>> {
    const query = new URLSearchParams(params).toString();
    return api.get<ListResponse<Beat>>(`/beats?${query}`);
  },

  /**
   * Get trending beats
   */
  async getTrending(limit = 10): Promise<SingleResponse<Beat[]>> {
    return api.get<SingleResponse<Beat[]>>(`/beats/trending?limit=${limit}`);
  },

  /**
   * Get single beat detail
   */
  async getBeat(id: string | number): Promise<SingleResponse<Beat>> {
    return api.get<SingleResponse<Beat>>(`/beats/${id}`);
  },

  /**
   * Record a play for a beat
   */
  async recordPlay(id: string | number, details: { duration?: number; sessionId?: string } = {}): Promise<void> {
    return api.post(`/activity/plays/${id}`, details);
  },

  /**
   * Toggle like on a beat
   */
  async toggleLike(id: string | number): Promise<SingleResponse<{ liked: boolean }>> {
    return api.post<SingleResponse<{ liked: boolean }>>(`/activity/likes/${id}`);
  },

  /**
   * Get all producers
   */
  async getProducers(params: Record<string, any> = {}): Promise<ListResponse<Producer>> {
    const query = new URLSearchParams(params).toString();
    return api.get<ListResponse<Producer>>(`/producers?${query}`);
  },

  /**
   * Get producer profile
   */
  async getProducer(username: string): Promise<SingleResponse<Producer>> {
    return api.get<SingleResponse<Producer>>(`/producers/${username}`);
  },

  /**
   * Get all genres
   */
  async getGenres(): Promise<SingleResponse<Genre[]>> {
    return api.get<SingleResponse<Genre[]>>(`/genres`);
  },

  /**
   * Get genre by slug
   */
  async getGenre(slug: string): Promise<SingleResponse<Genre>> {
    return api.get<SingleResponse<Genre>>(`/genres/${slug}`);
  },
};

export default marketplaceService;
