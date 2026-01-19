import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/lib/marketplace";
import { api } from "@/lib/api";

// Cart item from API includes additional info
interface CartItem extends Beat {
  licenseTierId?: number;
  tierName?: string;
  tierType?: string;
  includedFiles?: string[];
}

interface FeeSettings {
  processingFeePercentage: number;
  processingFeeFixed: number;
  platformCommissionRate: number;
}

interface CartData {
  items: CartItem[];
  count: number;
  subtotal: number;
  processingFee: number;
  platformFee: number;
  total: number;
  feeSettings: FeeSettings;
}

interface CartResponse {
  success: boolean;
  data: CartData;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  processingFee: number;
  platformFee: number;
  total: number;
  feeSettings: FeeSettings | null;
  isLoading: boolean;
  hasFetched: boolean;
  addToCart: (beat: Beat, licenseTierId?: number) => Promise<void>;
  removeFromCart: (beatId: string | number) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (beatId: string | number) => boolean;
  fetchCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
}

// Generate a session ID for guest carts
const getSessionId = () => {
  let sessionId = localStorage.getItem('beatbloom-session-id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('beatbloom-session-id', sessionId);
  }
  return sessionId;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      processingFee: 0,
      platformFee: 0,
      total: 0,
      feeSettings: null,
      isLoading: false,
      hasFetched: false,
      
      addToCart: async (beat, licenseTierId) => {
        // Optimistic update using functional set to avoid race conditions
        set((state) => {
          if (!state.items.some(item => item.id.toString() === beat.id.toString())) {
            return { items: [...state.items, beat] };
          }
          return state;
        });

        // Sync with backend
        try {
          const response = await api.post<CartResponse>('/cart/items', {
            beatId: beat.id,
            licenseTierId,
          }, {
            headers: { 'x-session-id': getSessionId() }
          });
          
          if (response.success && response.data) {
            set({ 
              items: response.data.items,
              subtotal: response.data.subtotal,
              processingFee: response.data.processingFee,
              platformFee: response.data.platformFee,
              total: response.data.total,
              feeSettings: response.data.feeSettings,
            });
          }
        } catch (error) {
          console.error("Failed to sync cart with backend:", error);
          // Keep optimistic update on error
        }
      },
      
      removeFromCart: async (beatId) => {
        const idStr = beatId.toString();
        // Optimistic update
        set((state) => ({ 
          items: state.items.filter(item => 
            item.id.toString() !== idStr && (item as any).beatId?.toString() !== idStr
          ) 
        }));

        // Sync with backend
        try {
          const response = await api.delete<CartResponse>(`/cart/items/${beatId}`, {
            headers: { 'x-session-id': getSessionId() }
          });
          
          if (response.success && response.data) {
            set({ 
              items: response.data.items,
              subtotal: response.data.subtotal,
              processingFee: response.data.processingFee,
              platformFee: response.data.platformFee,
              total: response.data.total,
              feeSettings: response.data.feeSettings,
            });
          }
        } catch (error) {
          console.error("Failed to sync cart removal with backend:", error);
        }
      },
      
      clearCart: async () => {
        // Optimistic update
        set({ 
          items: [],
          subtotal: 0,
          processingFee: 0,
          platformFee: 0,
          total: 0,
        });

        // Sync with backend
        try {
          await api.delete('/cart', {
            headers: { 'x-session-id': getSessionId() }
          });
        } catch (error) {
          console.error("Failed to clear cart on backend:", error);
        }
      },
      
      isInCart: (beatId) => {
        const idStr = beatId.toString();
        const { items } = get();
        return items.some(item => 
          item.id.toString() === idStr || (item as any).beatId?.toString() === idStr
        );
      },

      fetchCart: async () => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true });
        try {
          const response = await api.get<CartResponse>('/cart', {
            headers: { 'x-session-id': getSessionId() }
          });
          
          if (response.success && response.data) {
            set({ 
              items: response.data.items,
              subtotal: response.data.subtotal,
              processingFee: response.data.processingFee,
              platformFee: response.data.platformFee,
              total: response.data.total,
              feeSettings: response.data.feeSettings,
              hasFetched: true,
              isLoading: false 
            });
          } else {
            set({ isLoading: false, hasFetched: true });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          set({ isLoading: false, hasFetched: true });
        }
      },

      mergeCart: async () => {
        try {
          const response = await api.post<CartResponse>('/cart/merge', {}, {
            headers: { 'x-session-id': getSessionId() }
          });
          
          if (response.success && response.data) {
            set({ 
              items: response.data.items,
              subtotal: response.data.subtotal,
              processingFee: response.data.processingFee,
              platformFee: response.data.platformFee,
              total: response.data.total,
              feeSettings: response.data.feeSettings,
              hasFetched: true 
            });
          }
        } catch (error) {
          console.error("Failed to merge cart:", error);
        }
      },
    }),
    {
      name: "beatbloom-cart",
    }
  )
);
