import { useState } from "react";
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
  X,
  UploadCloud
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaylistsStore, playlistColors } from "@/store/playlistsStore";

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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { playlists, createPlaylist } = usePlaylistsStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(playlistColors[0].value);

  const handleCreate = () => {
    if (newName.trim()) {
      createPlaylist(newName.trim(), newColor);
      setNewName("");
      setNewColor(playlistColors[0].value);
      setIsCreating(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[80] flex w-64 flex-col border-r border-border bg-background px-6 py-8 transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Logo & Close Button */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">BeatBloom</span>
          </div>
          
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-secondary md:hidden"
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
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground",
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-orange-500" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Producer Actions */}
          <div>
            <Link
              to="/upload"
              onClick={onClose}
              className="group flex w-full items-center gap-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 px-4 py-3 text-sm font-bold text-orange-500 transition-all hover:from-orange-500 hover:to-orange-600 hover:text-white shadow-sm shadow-orange-500/5 active:scale-[0.98]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
                <UploadCloud className="h-4 w-4" />
              </div>
              Upload Beat
            </Link>
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
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-orange-500" : "text-muted-foreground group-hover:text-foreground")} />
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
              <button 
                onClick={() => setIsCreating(!isCreating)}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                  isCreating 
                    ? "bg-orange-500 text-white" 
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <Plus className={cn("h-4 w-4", isCreating && "rotate-45")} />
              </button>
            </div>

            {/* Create New Playlist Inline */}
            {isCreating && (
              <div className="mb-4 space-y-3 rounded-lg bg-secondary/50 p-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Playlist name"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5">
                  {playlistColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewColor(color.value)}
                      className={cn(
                        "h-5 w-5 rounded-full transition-all",
                        color.value,
                        newColor === color.value && "ring-2 ring-offset-1 ring-offset-secondary ring-foreground"
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 rounded py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="flex-1 rounded bg-orange-500 py-1.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              {playlists.map((playlist) => {
                const isActive = location.pathname === `/playlist/${playlist.id}`;
                
                return (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground",
                      isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <div className={cn("h-4 w-4 rounded shadow-sm shrink-0", playlist.color)} />
                    <span className="truncate">{playlist.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground/60">{playlist.beats.length}</span>
                  </Link>
                );
              })}

              {playlists.length === 0 && !isCreating && (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                  No playlists yet
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
