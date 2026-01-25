/**
 * Marketplace API Client 
 * 
 * Handles all requests related to Beats and Producers
 */

import { api } from './api';
import type { 
  Beat, 
  Genre, 
  LicenseTier, 
  ListResponse, 
  Pagination, 
  Producer, 
  SingleResponse 
} from '@/types';

export type { 
  Beat, 
  Genre, 
  LicenseTier, 
  ListResponse, 
  Pagination, 
  Producer, 
  SingleResponse 
};

// Service
export const marketplaceService = {
  /**
   * Get all beats with filters
   */
  async getBeats(params: Record<string, string | number | boolean> = {}): Promise<ListResponse<Beat>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
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
  async getProducers(params: Record<string, string | number | boolean> = {}): Promise<ListResponse<Producer>> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
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

  /**
   * Get platform fee settings
   */
  async getFeeSettings(): Promise<SingleResponse<{
    platformCommissionRate: number;
    processingFeePercentage: number;
    processingFeeFixed: number;
  }>> {
    return api.get('/settings/fees');
  },

  /**
   * Calculate fees for an amount
   */
  async calculateFees(amount: number): Promise<SingleResponse<{
    subtotal: number;
    processingFee: number;
    platformFee: number;
    producerEarnings: number;
    total: number;
    platformCommissionRate: number;
  }>> {
    return api.post('/settings/fees/calculate', { amount });
  },
  /**
   * Get user's purchased beats
   */
  async getPurchases(): Promise<SingleResponse<unknown[]>> {
    return api.get<SingleResponse<unknown[]>>('/orders/purchases');
  },
  /**
   * Create an order
   */
  async createOrder(data: {
    items: { beatId: number | string; licenseTierId?: number | string }[];
    paymentMethod: string;
    paymentReference: string;
    email: string;
  }): Promise<SingleResponse<unknown>> {
    return api.post<SingleResponse<unknown>>('/orders', data);
  },
  /**
   * Verify a payment
   */
  async verifyPayment(reference: string): Promise<SingleResponse<unknown>> {
    return api.get<SingleResponse<unknown>>(`/payments/verify/paystack/${reference}`);
  },

  /**
   * Get user's purchased license tiers for a specific beat
   */
  async getPurchasedTiersForBeat(beatId: string | number): Promise<SingleResponse<{
    licenseTierId: number;
    licenseType: string;
    purchasedAt: string;
    tierName: string;
    tierType: string;
  }[]>> {
    return api.get(`/orders/purchases/beat/${beatId}`);
  },
  /**
   * Create a new beat
   */
  async createBeat(data: any): Promise<SingleResponse<Beat>> {
    return api.post<SingleResponse<Beat>>('/beats', data);
  },
};

export default marketplaceService;
