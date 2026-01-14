import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";

interface CartState {
  items: Beat[];
  addToCart: (beat: Beat) => void;
  removeFromCart: (beatId: string) => void;
  clearCart: () => void;
  isInCart: (beatId: string) => boolean;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },
      
      addToCart: (beat) => {
        const { items } = get();
        // Check if already in cart
        if (items.some(item => item.id === beat.id)) {
          return; // Already in cart
        }
        set({ items: [...items, beat] });
      },
      
      removeFromCart: (beatId) => {
        set({ items: get().items.filter(item => item.id !== beatId) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      isInCart: (beatId) => {
        return get().items.some(item => item.id === beatId);
      },
    }),
    {
      name: "beatbloom-cart",
    }
  )
);
