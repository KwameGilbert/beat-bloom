import { Bell, Search, ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b border-white/10 px-4 backdrop-blur-3xl md:px-6">

      {/* Mobile Menu Trigger */}
      <button 
        className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Search Bar - Flexible width on mobile/desktop */}
      <div className="flex flex-1 items-center gap-4">
        <form className="flex-1 md:w-96 md:flex-none">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50 transition-colors group-hover:text-white" />
            <input
              type="search"
              placeholder="Search beats..."
              className="h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 pl-10 text-sm text-white transition-all placeholder:text-white/40 hover:bg-white/10 hover:border-white/20 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            />
          </div>
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="ml-4 flex items-center gap-2 md:gap-3">
        <Link to="/cart">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span>
          </button>
        </Link>
        
        {/* Desktop Only Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse"></span>
          </button>

          <Link to="/profile">
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-all hover:bg-white/10 hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};