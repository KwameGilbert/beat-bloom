import { useState, useEffect, useRef } from "react";
import { Bell, User, Menu, Sun, Moon, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";

interface ProducerHeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  unreadNotificationsCount: number;
}

export const ProducerHeader = ({
  onMenuClick,
  onNotificationClick,
  unreadNotificationsCount,
}: ProducerHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Exclude clicks outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/producer/dashboard":
        return "Studio Overview";
      case "/producer/beats":
        return "My Beats";
      case "/producer/sales":
        return "Sales & Earnings";
      case "/producer/payouts":
        return "Payouts & Wallet";
      case "/producer/analytics":
        return "Studio Analytics";
      case "/producer/settings":
        return "Studio Settings";
      case "/producer/upload":
        return "Upload New Beat";
      default:
        return "Producer Studio";
    }
  };

  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center border-b border-border/50 px-4 backdrop-blur-2xl bg-background/80 md:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left Side: Mobile Menu and Page Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground md:hidden"
            onClick={onMenuClick}
            aria-label="Open Sidebar Menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-col text-left">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground leading-none">
              {getPageTitle()}
            </h1>
            <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1 hidden sm:inline">
              Producer Studio
            </span>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Notifications button linked to the sidebar trigger */}
          <button
            onClick={onNotificationClick}
            className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Notifications Feed"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-card animate-pulse"></span>
            )}
          </button>

          {/* Profile Dropdown */}
          {isAuthenticated && (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Profile menu</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-border bg-background/95 backdrop-blur-xl p-2 shadow-xl"
                  >
                    {/* User Info */}
                    <div className="px-3 py-2 mb-1 border-b border-border text-left">
                      <p className="font-bold text-sm text-foreground truncate">{user?.name || "Producer"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/home"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                      Back to Store
                    </Link>

                    <Link
                      to="/producer/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Studio Settings
                    </Link>

                    <div className="my-1 border-t border-border" />

                    <button
                      onClick={async () => {
                        setIsProfileOpen(false);
                        await logout();
                        navigate("/login");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
