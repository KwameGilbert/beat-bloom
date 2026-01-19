import { api } from './api';
import type { Beat, Genre, Producer, SingleResponse } from './marketplace';

export interface HomePageData {
  trendingBeats: Beat[];
  genres: Genre[];
  featuredProducers: Producer[];
}

export interface BeatDetailPageData {
  beat: Beat & { licenseTiers: any[] };
  producer: Producer;
  relatedBeats: Beat[];
}

export interface ProfilePageData {
  user: {
    id: number | string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    bio?: string;
    location?: string;
    website?: string;
    createdAt: string;
  };
  purchases: any[];
  likes: Beat[];
  stats: {
    purchasesCount: number;
    likesCount: number;
  };
}

export const pagesService = {
  /**
   * Get all data for Home page in one request
   */
  async getHomePage(): Promise<SingleResponse<HomePageData>> {
    return api.get<SingleResponse<HomePageData>>('/pages/home');
  },

  /**
   * Get all data for Beat Detail page in one request
   */
  async getBeatDetail(id: string | number): Promise<SingleResponse<BeatDetailPageData>> {
    return api.get<SingleResponse<BeatDetailPageData>>(`/pages/beat-detail/${id}`);
  },

  /**
   * Get all data for Profile page in one request
   */
  async getProfile(): Promise<SingleResponse<ProfilePageData>> {
    return api.get<SingleResponse<ProfilePageData>>('/pages/profile');
  },
};
