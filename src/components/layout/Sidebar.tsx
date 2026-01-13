import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  BarChart2, 
  Heart, 
  Clock, 
  Library, 
  Plus, 
  Music2,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { name: "Discover", icon: Home, path: "/" },
  { name: "Browse", icon: Search, path: "/browse" },
  { name: "Charts", icon: BarChart2, path: "/charts" },
];

const libraryNav = [
  { name: "Liked Beats", icon: Heart, path: "/liked" },
  { name: "Recent", icon: Clock, path: "/recent" },
  { name: "Purchases", icon: Library, path: "/purchases" },
];

const playlists = [
  { name: "Workout Beats", color: "bg-purple-500", path: "/playlist/workout" },
  { name: "Chill Vibes", color: "bg-blue-400", path: "/playlist/chill" },
  { name: "Studio Session", color: "bg-orange-500", path: "/playlist/studio" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-64 flex-col border-r border-white/10 bg-black px-6 py-8 text-white transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Logo & Close Button */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">BeatBloom</span>
          </div>
          
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 md:hidden"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto">
          {/* Main Navigation */}
          <div className="flex flex-col gap-2">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose} // Close sidebar on nav click
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/5 hover:text-white",
                    isActive ? "bg-white/10 text-white" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-orange-500" : "text-muted-foreground group-hover:text-white")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Library Section */}
          <div>
            <h3 className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Your Library
            </h3>
            <div className="flex flex-col gap-2">
              {libraryNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-white/5 hover:text-white",
                      isActive ? "bg-white/10 text-white" : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-orange-500" : "text-muted-foreground group-hover:text-white")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Playlists Section */}
          <div className="mt-auto">
            <div className="mb-4 flex items-center justify-between px-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                Playlists
              </h3>
              <button className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.name}
                  to={playlist.path}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-white/5 hover:text-white"
                >
                  <div className={cn("h-4 w-4 rounded shadow-sm", playlist.color)} />
                  {playlist.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
