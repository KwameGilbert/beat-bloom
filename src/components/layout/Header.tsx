import { Bell, Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/[0.08] bg-white/5 px-4 backdrop-blur-sm shadow-lg shadow-black/5 md:px-6">

      {/* Mobile Menu Trigger */}
      <button 
        className="mr-4 text-muted-foreground md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search Bar - Flexible width on mobile/desktop */}
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:w-96 md:flex-none">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            <input
              type="search"
              placeholder="Search beats..."
              className="h-10 w-full rounded-full border-none bg-white/5 px-3 pl-10 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-white/80 focus:bg-white"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="ml-4 flex items-center gap-2 md:gap-3">
        <Link to="/cart">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <ShoppingCart className="h-5 w-5 text-muted-foreground transition-colors hover:text-white" />
            <span className="sr-only">Cart</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-white ring-2 ring-background"></span>
          </button>
        </Link>
        
        {/* Desktop Only Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-white" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse"></span>
          </button>

          <Link to="/profile">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-sm font-medium transition-all hover:bg-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:pointer-events-none disabled:opacity-50 overflow-hidden border border-white/5">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};
