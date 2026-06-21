import { api } from './api';
import type { SingleResponse } from '@/types';

export interface PayoutMethod {
  id: number;
  producerId: number;
  type: 'paypal' | 'bank' | 'mobileMoney' | 'payoneer';
  details: any;
  currency: string;
  country: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface PayoutHistoryItem {
  id: number;
  payoutNumber: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: string;
  methodType: string;
  methodDetails: any;
}

export interface SalesHistoryItem {
  id: number;
  orderNumber: string;
  date: string;
  beatTitle: string;
  buyerEmail: string;
  buyerName: string;
  licenseType: string;
  gross: number;
  net: number;
}

export interface OverviewStats {
  totalGross: number;
  totalNet: number;
  pendingBalance: number;
  availableBalance: number;
  totalSales: number;
  activeListeners: number;
}

export interface DashboardOverviewResponse {
  stats: OverviewStats;
  recentSales: SalesHistoryItem[];
  topBeats: any[];
  chartPointsRevenue: { label: string; value: number }[];
  chartPointsPlays: { label: string; value: number }[];
}

export const producerService = {
  // Dashboard overview
  async getDashboardOverview(): Promise<SingleResponse<DashboardOverviewResponse>> {
    return api.get<SingleResponse<DashboardOverviewResponse>>('/producers/dashboard/overview');
  },

  // Sales ledger
  async getSalesList(search?: string): Promise<SingleResponse<SalesHistoryItem[]>> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return api.get<SingleResponse<SalesHistoryItem[]>>(`/producers/dashboard/sales${query}`);
  },

  // Beats Catalog management
  async getMyBeats(): Promise<SingleResponse<any[]>> {
    return api.get<SingleResponse<any[]>>('/beats/my-beats');
  },

  async updateBeat(id: string | number, data: any): Promise<SingleResponse<any>> {
    return api.put<SingleResponse<any>>(`/beats/${id}`, data);
  },

  async deleteBeat(id: string | number): Promise<SingleResponse<void>> {
    return api.delete<SingleResponse<void>>(`/beats/${id}`);
  },

  // Payout methods & requests
  async getPayoutMethods(): Promise<SingleResponse<PayoutMethod[]>> {
    return api.get<SingleResponse<PayoutMethod[]>>('/payouts/methods');
  },

  async addPayoutMethod(data: any): Promise<SingleResponse<PayoutMethod>> {
    return api.post<SingleResponse<PayoutMethod>>('/payouts/methods', data);
  },

  async deletePayoutMethod(id: string | number): Promise<SingleResponse<void>> {
    return api.delete<SingleResponse<void>>(`/payouts/methods/${id}`);
  },

  async getPayoutHistory(): Promise<SingleResponse<PayoutHistoryItem[]>> {
    return api.get<SingleResponse<PayoutHistoryItem[]>>('/payouts/history');
  },

  async requestPayout(amount: number, payoutMethodId: number): Promise<SingleResponse<PayoutHistoryItem>> {
    return api.post<SingleResponse<PayoutHistoryItem>>('/payouts/request', { amount, payoutMethodId });
  }
};

export default producerService;
