import { Bell, Search, ShoppingCart, User, Menu, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useThemeStore } from "@/store/themeStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const itemCount = useCartStore((state) => state.getItemCount());
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center border-b border-border/50 px-4 backdrop-blur-3xl bg-background/80 md:px-6">

      {/* Mobile Menu Trigger */}
      <button 
        className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search Bar - Flexible width on mobile/desktop */}
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:w-96 md:flex-none">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            <input
              type="search"
              placeholder="Search beats..."
              className="h-10 w-full rounded-full border border-border bg-secondary/50 px-4 pl-10 text-sm text-foreground transition-all placeholder:text-muted-foreground hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="ml-4 flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </button>

        <Link to="/cart">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </Link>
        
        {/* Desktop Only Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
          </button>

          <Link to="/profile">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-foreground/80 transition-all hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};