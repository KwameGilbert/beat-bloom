import { create } from "zustand";
import { pagesService, type ProfilePageData } from "@/lib/pages";

interface ProfileState {
  profileData: ProfilePageData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileData: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await pagesService.getProfile();
      if (response.success) {
        const data = response.data;
        if (data.purchases) {
          data.purchases = data.purchases.map((p: Record<string, any>) => ({
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
              price: p.price || 0,
              tags: [],
              playsCount: p.playsCount || 0,
              likesCount: p.likesCount || 0,
              isExclusiveSold: false,
              status: "active",
              isFeatured: false,
              createdAt: p.createdAt || new Date().toISOString()
            },
            purchasedAt: p.purchasedAt,
            amount: parseFloat(p.price || 0)
          }));
        }
        set({ profileData: data, isLoading: false });
      } else {
        set({ error: "Failed to fetch profile", isLoading: false });
      }
    } catch (error: Error | any) {
      set({ error: (error as Error).message || "An error occurred", isLoading: false });
    }
  },
}));
