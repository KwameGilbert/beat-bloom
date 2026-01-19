import { useState, useEffect, useRef } from "react";
import { Bell, Search, ShoppingCart, User, Menu, Sun, Moon, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";
import { useBeatsStore } from "@/store/beatsStore";
import { useAuthStore } from "@/store/authStore";
import { AnimatePresence } from "framer-motion";
import { SearchPanel } from "./SearchPanel";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((state) => state.items.length);
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const { trendingBeats, producers } = useBeatsStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Use beats from store for searching
  const allBeats = trendingBeats;

  // Filter results
  const filteredBeats = searchQuery.trim() === "" 
    ? [] 
    : allBeats.filter(beat => 
        beat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beat.producerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const filteredProducers = searchQuery.trim() === ""
    ? []
    : producers.filter(producer => 
        producer.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
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
              <Link to="/profile">
                <button className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Profile</span>
                </button>
              </Link>
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