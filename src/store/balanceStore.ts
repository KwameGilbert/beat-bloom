import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BalanceState {
  showBalance: boolean;
  toggleBalance: () => void;
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set) => ({
      showBalance: true,
      toggleBalance: () => set((state) => ({ showBalance: !state.showBalance })),
    }),
    {
      name: "EasyBeats-balance-visibility",
    }
  )
);
