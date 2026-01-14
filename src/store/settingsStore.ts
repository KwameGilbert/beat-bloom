import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  emailNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  setEmailNotifications: (value: boolean) => void;
  setPushNotifications: (value: boolean) => void;
  setPublicProfile: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      pushNotifications: false,
      publicProfile: true,

      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setPublicProfile: (publicProfile) => set({ publicProfile }),
    }),
    {
      name: "beatbloom-user-settings",
    }
  )
);
