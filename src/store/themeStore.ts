import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/lib/auth";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeOnly: (theme: Theme) => void;
  toggleTheme: () => void;
  syncThemeWithBackend: (theme: Theme) => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
        get().syncThemeWithBackend(theme);
      },

      setThemeOnly: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        set({ theme: newTheme });
        applyTheme(newTheme);
        get().syncThemeWithBackend(newTheme);
      },

      syncThemeWithBackend: async (theme: Theme) => {
        // We check for token to see if user is logged in
        // A direct import of authStore here might cause circular dependency
        const token = localStorage.getItem('beatbloom-auth-token'); 
        if (token) {
          try {
            await authService.updateSettings({ theme });
          } catch (error) {
            console.error("Failed to sync theme with backend:", error);
          }
        }
      },
    }),
    {
      name: "beatbloom-theme",
      onRehydrateStorage: () => (state) => {
        // Apply theme on initial load
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// Apply theme to document
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
  }
}

// Initialize theme on load
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("beatbloom-theme");
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      applyTheme(state.theme || "dark");
    } catch {
      applyTheme("dark");
    }
  } else {
    applyTheme("dark");
  }
}
