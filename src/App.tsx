import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/routes";
import { SplashScreen } from "./components/ui/splash-screen";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

/**
 * Auth Initializer Component
 * Fetches user profile on app load if authenticated
 */
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, fetchProfile, user } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated && !user) {
        await fetchProfile();
      }
      setInitialized(true);
    };
    init();
  }, [isAuthenticated, user, fetchProfile]);

  // Wait for auth initialization before rendering
  if (!initialized && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash if it hasn't been shown in this session
    return sessionStorage.getItem('hasShownSplash') !== 'true';
  });

  useEffect(() => {
    // Apply dark mode based on system preference or saved theme
    const authData = localStorage.getItem('beatbloom-auth');
    let userTheme: string | null = null;
    
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        userTheme = parsed.state?.user?.theme;
      } catch {
        // Ignore parse errors
      }
    }

    if (userTheme === 'dark' || userTheme === 'light') {
      document.documentElement.classList.toggle('dark', userTheme === 'dark');
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }

    // If splash is currently showing, set timer to hide it and mark as shown
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasShownSplash', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {showSplash ? (
            <SplashScreen key="splash" />
          ) : (
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-screen bg-background text-foreground"
            >
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthInitializer>
                  <AppRoutes />
                </AuthInitializer>
              </BrowserRouter>
            </motion.div>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;