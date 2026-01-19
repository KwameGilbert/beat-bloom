import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Beat } from "@/lib/marketplace";

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
  isPurchased: (beatId: string | number) => boolean;
  getPurchase: (beatId: string | number) => Purchase | undefined;
  clearPurchases: () => void;
}

export const usePurchasesStore = create<PurchasesState>()(
  persist(
    (set, get) => ({
      purchases: [],

      addPurchase: (beat, transactionRef, amount) => {
        const { purchases } = get();
        // Don't add duplicate purchases
        if (purchases.some((p) => p.beat.id.toString() === beat.id.toString())) return;
        
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
          .filter((beat) => !purchases.some((p) => p.beat.id.toString() === beat.id.toString()))
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
        const idStr = beatId.toString();
        return get().purchases.some((p) => p.beat.id.toString() === idStr);
      },

      getPurchase: (beatId) => {
        const idStr = beatId.toString();
        return get().purchases.find((p) => p.beat.id.toString() === idStr);
      },

      clearPurchases: () => set({ purchases: [] }),
    }),
    {
      name: "beatbloom-purchases",
    }
  )
);

export type { Purchase };
