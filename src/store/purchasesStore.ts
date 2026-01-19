import { create } from "zustand";
import { persist } from "zustand/middleware";
import { marketplaceService, type Beat } from "@/lib/marketplace";

interface Purchase {
  beat: Beat;
  purchasedAt: string;
  transactionRef: string;
  amount: number;
}

interface PurchasesState {
  purchases: Purchase[];
  isLoading: boolean;
  error: string | null;
  addPurchase: (beat: Beat, transactionRef: string, amount: number) => void;
  addPurchases: (beats: Beat[], transactionRef: string, totalAmount: number) => void;
  isPurchased: (beatId: string | number) => boolean;
  getPurchase: (beatId: string | number) => Purchase | undefined;
  fetchPurchases: () => Promise<void>;
  clearPurchases: () => void;
}

export const usePurchasesStore = create<PurchasesState>()(
  persist(
    (set, get) => ({
      purchases: [],
      isLoading: false,
      error: null,

      addPurchase: (beat, transactionRef, amount) => {
        const { purchases } = get();
        // Don't add duplicate purchases
        if (purchases.some((p) => p.beat?.id.toString() === beat.id.toString())) return;
        
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
          .filter((beat) => !purchases.some((p) => p.beat?.id.toString() === beat.id.toString()))
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
        return get().purchases.some((p) => p.beat?.id.toString() === idStr);
      },

      getPurchase: (beatId) => {
        const idStr = beatId.toString();
        return get().purchases.find((p) => p.beat?.id.toString() === idStr);
      },

      fetchPurchases: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await marketplaceService.getPurchases();
          if (response.success) {
            const mappedPurchases: Purchase[] = (response.data || []).map((p: any) => ({
              beat: {
                id: p.beatId,
                producerId: p.producerId || 0,
                title: p.title,
                slug: p.slug || "",
                coverImage: p.coverImage,
                previewAudioUrl: p.previewAudioUrl,
                producerName: p.producerName || "Unknown Producer",
                producerUsername: p.producerUsername || "unknown",
                bpm: p.bpm || 0,
                musicalKey: p.musicalKey || "N/A",
                tags: [],
                playsCount: 0,
                likesCount: 0,
                isExclusiveSold: false,
                status: "active",
                isFeatured: false,
                createdAt: p.createdAt || new Date().toISOString(),
                price: p.price || 0,
              } as Beat,
              purchasedAt: p.purchasedAt,
              transactionRef: p.orderItemId?.toString() || "N/A",
              amount: parseFloat(p.price || 0), 
            }));
            set({ purchases: mappedPurchases, isLoading: false });
          } else {
            set({ error: "Failed to fetch purchases", isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "An error occurred", isLoading: false });
        }
      },

      clearPurchases: () => set({ purchases: [] }),
    }),
    {
      name: "beatbloom-purchases",
    }
  )
);

export type { Purchase };
