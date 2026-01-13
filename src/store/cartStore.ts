import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";

export interface CartItem {
  beat: Beat;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  addToCart: (beat: Beat) => void;
  removeFromCart: (beatId: string) => void;
  clearCart: () => void;
  isInCart: (beatId: string) => boolean;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (beat) => {
        const { items } = get();
        // Check if already in cart
        if (items.some(item => item.beat.id === beat.id)) {
          return; // Already in cart
        }
        set({ items: [...items, { beat, addedAt: new Date() }] });
      },
      
      removeFromCart: (beatId) => {
        set({ items: get().items.filter(item => item.beat.id !== beatId) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      isInCart: (beatId) => {
        return get().items.some(item => item.beat.id === beatId);
      },
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.beat.price, 0);
      },
      
      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "beatbloom-cart", // localStorage key
    }
  )
);
