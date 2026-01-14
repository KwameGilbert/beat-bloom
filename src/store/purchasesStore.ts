import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/data/beats";

interface Purchase {
  beat: Beat;
  purchasedAt: string;
  transactionRef: string;
  amount: number;
}

interface PurchasesState {
  purchases: Purchase[];
  addPurchase: (beat: Beat, transactionRef: string, amount: number) => void;
  addPurchases: (beats: Beat[], transactionRef: string, totalAmount: number) => void;
  isPurchased: (beatId: string) => boolean;
  getPurchase: (beatId: string) => Purchase | undefined;
  clearPurchases: () => void;
}

export const usePurchasesStore = create<PurchasesState>()(
  persist(
    (set, get) => ({
      purchases: [],

      addPurchase: (beat, transactionRef, amount) => {
        const { purchases } = get();
        // Don't add duplicate purchases
        if (purchases.some((p) => p.beat.id === beat.id)) return;
        
        const purchase: Purchase = {
          beat,
          purchasedAt: new Date().toISOString(),
          transactionRef,
          amount,
        };
        
        set({ purchases: [purchase, ...purchases] });
      },

      addPurchases: (beats, transactionRef, totalAmount) => {
        const { purchases } = get();
        const amountPerBeat = totalAmount / beats.length;
        
        const newPurchases: Purchase[] = beats
          .filter((beat) => !purchases.some((p) => p.beat.id === beat.id))
          .map((beat) => ({
            beat,
            purchasedAt: new Date().toISOString(),
            transactionRef,
            amount: amountPerBeat,
          }));
        
        if (newPurchases.length > 0) {
          set({ purchases: [...newPurchases, ...purchases] });
        }
      },

      isPurchased: (beatId) => {
        return get().purchases.some((p) => p.beat.id === beatId);
      },

      getPurchase: (beatId) => {
        return get().purchases.find((p) => p.beat.id === beatId);
      },

      clearPurchases: () => set({ purchases: [] }),
    }),
    {
      name: "beatbloom-purchases",
    }
  )
);

export type { Purchase };
