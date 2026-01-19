import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/lib/marketplace";

interface CartState {
  items: Beat[];
  addToCart: (beat: Beat) => void;
  removeFromCart: (beatId: string | number) => void;
  clearCart: () => void;
  isInCart: (beatId: string | number) => boolean;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      get total() {
        return get().items.reduce((sum, item) => sum + (item.price || 0), 0);
      },
      
      addToCart: (beat) => {
        const { items } = get();
        // Check if already in cart
        if (items.some(item => item.id.toString() === beat.id.toString())) {
          return; // Already in cart
        }
        set({ items: [...items, beat] });
      },
      
      removeFromCart: (beatId) => {
        const idStr = beatId.toString();
        set({ items: get().items.filter(item => item.id.toString() !== idStr) });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      isInCart: (beatId) => {
        const idStr = beatId.toString();
        return get().items.some(item => item.id.toString() === idStr);
      },
    }),
    {
      name: "beatbloom-cart",
    }
  )
);
