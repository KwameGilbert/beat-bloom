import { useState } from "react";
import { 
  X, 
  Plus, 
  Check, 
  Music2, 
  Pencil, 
  Trash2
} from "lucide-react";
import { usePlaylistsStore, playlistColors, type Playlist } from "@/store/playlistsStore";
import type { Beat } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: Beat;
}

export const AddToPlaylistModal = ({ isOpen, onClose, beat }: AddToPlaylistModalProps) => {
  const { 
    playlists, 
    createPlaylist, 
    deletePlaylist, 
    renamePlaylist, 
    changePlaylistColor,
    addBeatToPlaylist, 
    removeBeatFromPlaylist,
    isBeatInPlaylist 
  } = usePlaylistsStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedColor, setSelectedColor] = useState(playlistColors[0].value);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editName, setEditName] = useState("");

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlist = createPlaylist(newPlaylistName.trim(), selectedColor);
      addBeatToPlaylist(playlist.id, beat);
      setNewPlaylistName("");
      setSelectedColor(playlistColors[0].value);
      setIsCreating(false);
    }
  };

  const handleToggleBeat = (playlistId: string) => {
    if (isBeatInPlaylist(playlistId, beat.id)) {
      removeBeatFromPlaylist(playlistId, beat.id);
    } else {
      addBeatToPlaylist(playlistId, beat);
    }
  };

  const handleStartEdit = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlaylist(playlist);
    setEditName(playlist.name);
    setSelectedColor(playlist.color);
  };

  const handleSaveEdit = () => {
    if (editingPlaylist && editName.trim()) {
      renamePlaylist(editingPlaylist.id, editName.trim());
      changePlaylistColor(editingPlaylist.id, selectedColor);
      setEditingPlaylist(null);
    }
  };

  const handleDelete = (playlistId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlistId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-[201] max-h-[80vh] rounded-t-3xl bg-card border-t border-border overflow-hidden md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl md:border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">
            {editingPlaylist ? "Edit Playlist" : isCreating ? "New Playlist" : "Add to Playlist"}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Beat Preview */}
        {!isCreating && !editingPlaylist && (
          <div className="flex items-center gap-3 border-b border-border px-6 py-3 bg-secondary/30">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
              <img src={beat.coverImage} alt={beat.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{beat.title}</p>
              <p className="text-sm text-muted-foreground truncate">{beat.producerName}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto p-4">
          {/* Create New Playlist Form */}
          {isCreating && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Playlist"
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Color</label>
                <div className="flex flex-wrap gap-2">
                  {playlistColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        color.value,
                        selectedColor === color.value 
                          ? "ring-2 ring-offset-2 ring-offset-card ring-foreground scale-110" 
                          : "hover:scale-105"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 rounded-lg border border-border py-3 font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 rounded-lg bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  Create & Add
                </button>
              </div>
            </div>
          )}

          {/* Edit Playlist Form */}
          {editingPlaylist && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Playlist Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Color</label>
                <div className="flex flex-wrap gap-2">
                  {playlistColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        "h-8 w-8 rounded-full transition-all",
                        color.value,
                        selectedColor === color.value 
                          ? "ring-2 ring-offset-2 ring-offset-card ring-foreground scale-110" 
                          : "hover:scale-105"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingPlaylist(null)}
                  className="flex-1 rounded-lg border border-border py-3 font-medium text-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editName.trim()}
                  className="flex-1 rounded-lg bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Playlists List */}
          {!isCreating && !editingPlaylist && (
            <div className="space-y-2">
              {/* Create New Button */}
              <button
                onClick={() => setIsCreating(true)}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-orange-500 hover:text-orange-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-medium">Create New Playlist</span>
              </button>

              {/* Existing Playlists */}
              {playlists.map((playlist) => {
                const isInPlaylist = isBeatInPlaylist(playlist.id, beat.id);
                
                return (
                  <div
                    key={playlist.id}
                    className="group flex items-center gap-3 rounded-xl bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                  >
                    {/* Color Indicator */}
                    <div className={cn("h-10 w-10 shrink-0 rounded-lg flex items-center justify-center", playlist.color)}>
                      <Music2 className="h-5 w-5 text-white" />
                    </div>

                    {/* Info */}
                    <button
                      onClick={() => handleToggleBeat(playlist.id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className="font-medium text-foreground truncate">{playlist.name}</p>
                      <p className="text-xs text-muted-foreground">{playlist.beats.length} beats</p>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleStartEdit(playlist, e)}
                        className="hidden group-hover:flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(playlist.id, e)}
                        className="hidden group-hover:flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-background hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleBeat(playlist.id)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                          isInPlaylist 
                            ? "bg-green-500 text-white" 
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {isInPlaylist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                );
              })}

              {playlists.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No playlists yet. Create one to get started!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
