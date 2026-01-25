import { api } from './api';
import type { 
  Beat, 
  BeatDetailPageData, 
  Genre, 
  HomePageData, 
  Producer, 
  ProfilePageData, 
  Purchase, 
  SingleResponse 
} from '@/types';

export type { 
  Beat, 
  BeatDetailPageData, 
  Genre, 
  HomePageData, 
  Producer, 
  ProfilePageData, 
  Purchase, 
  SingleResponse 
};

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
