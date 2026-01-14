import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Play, 
  Pause, 
  Music2, 
  Trash2,
  Pencil,
  MoreVertical,
  Loader2,
  Shuffle
} from "lucide-react";
import { usePlaylistsStore, playlistColors } from "@/store/playlistsStore";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const { getPlaylist, removeBeatFromPlaylist, renamePlaylist, changePlaylistColor, deletePlaylist } = usePlaylistsStore();
  const { currentBeat, isPlaying, playBeat, togglePlay, isLoading } = usePlayerStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const playlist = getPlaylist(playlistId || "");

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background pt-4 pb-32">
        <div className="px-4 md:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music2 className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Playlist not found</h2>
            <p className="text-muted-foreground">This playlist may have been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePlayClick = (beat: typeof playlist.beats[0], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBeat?.id === beat.id) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handlePlayAll = () => {
    if (playlist.beats.length > 0) {
      playBeat(playlist.beats[0]);
    }
  };

  const handleShufflePlay = () => {
    if (playlist.beats.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.beats.length);
      playBeat(playlist.beats[randomIndex]);
    }
  };

  const handleRemoveBeat = (beatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBeatFromPlaylist(playlist.id, beatId);
  };

  const handleStartEdit = () => {
    setEditName(playlist.name);
    setEditColor(playlist.color);
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      renamePlaylist(playlist.id, editName.trim());
      changePlaylistColor(playlist.id, editColor);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      deletePlaylist(playlist.id);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      {/* Header */}
      <div className="px-4 md:px-6 mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>

        {/* Playlist Header */}
        <div className="flex items-start gap-4">
          <div className={cn("h-24 w-24 shrink-0 rounded-xl flex items-center justify-center", playlist.color)}>
            <Music2 className="h-12 w-12 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-bold text-foreground focus:border-orange-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-2">
                  {playlistColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setEditColor(color.value)}
                      className={cn(
                        "h-6 w-6 rounded-full transition-all",
                        color.value,
                        editColor === color.value && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="rounded-lg bg-orange-500 px-4 py-1.5 text-sm font-bold text-white hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-2xl font-bold text-foreground truncate">{playlist.name}</h1>
                <p className="text-muted-foreground">
                  {playlist.beats.length} {playlist.beats.length === 1 ? "beat" : "beats"}
                </p>
              </>
            )}
          </div>

          {/* Menu */}
          {!isEditing && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-card py-2 shadow-xl">
                    <button
                      onClick={handleStartEdit}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-secondary"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Playlist
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-500 hover:bg-secondary"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Playlist
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Play Controls */}
        {playlist.beats.length > 0 && !isEditing && (
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-colors"
            >
              <Play className="h-5 w-5 fill-current" />
              Play All
            </button>
            <button
              onClick={handleShufflePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary text-foreground hover:bg-secondary/80"
            >
              <Shuffle className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 md:px-6">
        {playlist.beats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
              <Music2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No beats in this playlist</h2>
            <p className="text-muted-foreground mb-6">
              Add beats to this playlist from the player or beat details page.
            </p>
            <Link
              to="/browse"
              className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-colors"
            >
              Browse Beats
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.beats.map((beat, index) => {
              const isCurrentBeat = currentBeat?.id === beat.id;
              const isCurrentPlaying = isCurrentBeat && isPlaying;

              return (
                <Link
                  key={beat.id}
                  to={`/beat/${beat.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:bg-secondary/50"
                >
                  {/* Index */}
                  <span className="w-6 text-center text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </span>

                  {/* Cover */}
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={beat.cover}
                      alt={beat.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayClick(beat, e)}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                        isCurrentBeat ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isCurrentBeat && isLoading ? (
                        <Loader2 className="h-5 w-5 text-white animate-spin" />
                      ) : isCurrentPlaying ? (
                        <Pause className="h-5 w-5 text-white fill-current" />
                      ) : (
                        <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      isCurrentBeat ? "text-orange-500" : "text-foreground"
                    )}>
                      {beat.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{beat.producer}</p>
                  </div>

                  {/* Duration & Actions */}
                  <span className="text-sm text-muted-foreground hidden sm:block">{beat.duration}</span>
                  
                  <button
                    onClick={(e) => handleRemoveBeat(beat.id, e)}
                    className="hidden group-hover:flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
