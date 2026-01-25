import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Search, ShoppingCart, User, Menu, Sun, Moon, X, Settings, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { useBeatsStore } from "@/store/beatsStore";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { SearchPanel } from "./SearchPanel";
import type { Beat, Producer } from "@/types";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((state) => state.items.length);
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { searchBeats } = useBeatsStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([]);
  const [filteredProducers, setFilteredProducers] = useState<Producer[]>([]);
  // const [isSearching, setIsSearching] = useState(false); // Removed unused state
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    const newRecent = [
      query,
      ...recentSearches.filter((s) => s !== query)
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  const clearRecentSearch = (query: string) => {
    const newRecent = recentSearches.filter((s) => s !== query);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
  };

  // Debounced search function that calls backend
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredBeats([]);
      setFilteredProducers([]);
      return;
    }
    
    // setIsSearching(true);
    try {
      const results = await searchBeats(query);
      setFilteredBeats(results.beats);
      setFilteredProducers(results.producers);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      // setIsSearching(false);
    }
  }, [searchBeats]);

  // Handle search query changes with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Handle click outside for search and profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setIsProfileOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const handleResultClick = (path: string, query?: string) => {
    if (query) saveSearch(query);
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      navigate(`/browse?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center border-b border-border/50 px-4 backdrop-blur-2xl bg-background/80 md:px-6">
      <div className="flex w-full items-center gap-2 sm:gap-4 lg:gap-8">
        {/* Mobile Menu Trigger */}
        <button 
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar Container - Expands to fit available space */}
        <div ref={searchRef} className="relative flex-1 max-w-none sm:max-w-2xl md:max-w-4xl lg:max-w-5xl">
            <form onSubmit={handleSearchSubmit} className="relative group w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search beats, producers..."
                className="h-10 w-full rounded-full border border-border bg-secondary/50 px-4 pl-10 pr-10 text-sm text-foreground transition-all placeholder:text-muted-foreground hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Panel */}
              <AnimatePresence>
                {isSearchOpen && (
                  <SearchPanel
                    searchQuery={searchQuery}
                    filteredBeats={filteredBeats}
                    filteredProducers={filteredProducers}
                    recentSearches={recentSearches}
                    onResultClick={(path) => handleResultClick(path, searchQuery)}
                    onRecentClick={(query) => {
                      setSearchQuery(query);
                      inputRef.current?.focus();
                    }}
                    onClearRecent={clearRecentSearch}
                  />
                )}
              </AnimatePresence>
            </form>
          </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
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

          <Link to="/cart">
            <button className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] sm:text-xs font-bold text-white shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </Link>
          
          {/* Expanded Actions - Show earlier for Tablets (sm breakpoint) */}
          <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
            <Link to="/profile">
              <button className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Notifications</span>
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
              </button>
            </Link>

            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Profile menu</span>
                </button>

                {/* Profile Dropdown */}
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
                      <div className="px-3 py-2 mb-1 border-b border-border">
                        <p className="font-bold text-sm text-foreground truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-4 w-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
                      
                      <div className="my-1 border-t border-border" />
                      
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await logout();
                          navigate('/login');
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
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/login">
                  <button className="px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                    Log In
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-95">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};