import { useState, useEffect } from "react";
import { Play, Pause, Heart, ShoppingCart, Loader2, Check, ListPlus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useLikesStore } from "@/store/likesStore";
import { useAuthStore } from "@/store/authStore";
import { usePlaylistsStore } from "@/store/playlistsStore";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";
import { cn } from "@/lib/utils";

interface BeatCardProps {
  beat: any;
  playlist?: any[]; // Optional list of beats for next/previous navigation
}

export const BeatCard = ({ beat, playlist }: BeatCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { isAuthenticated } = useAuthStore();
  const { playlists, fetchPlaylists } = usePlaylistsStore();
  
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  
  // Normalize fields between API and Mock data
  const id = beat.id.toString();
  const title = beat.title;
  const producerName = beat.producerName || beat.producer;
  const producerId = beat.producerId.toString();
  const cover = beat.coverImage || beat.cover;
  const bpm = beat.bpm;
  const musicalKey = beat.musicalKey || beat.key;
  const price = beat.price || (beat.licenseTiers && beat.licenseTiers[0]?.price) || 0;
  
  const isCurrentBeat = currentBeat?.id.toString() === id;
  const isPlayingCurrent = isCurrentBeat && isPlaying;
  const isLoadingCurrent = isCurrentBeat && isLoading;
  const inCart = isInCart(id);
  const liked = isLiked(id);
  
  // Check if beat is in any playlist
  const isInAnyPlaylist = playlists.some(p => p.beats.some(b => b.id.toString() === id));

  // Fetch playlists when modal opens (if authenticated)
  useEffect(() => {
    if (isPlaylistModalOpen && isAuthenticated) {
      fetchPlaylists();
    }
  }, [isPlaylistModalOpen, isAuthenticated, fetchPlaylists]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCurrentBeat) {
      togglePlay();
    } else {
      playBeat(beat, playlist);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart) {
      removeFromCart(id);
    } else {
      const defaultTierId = beat.licenseTiers?.[0]?.id;
      addToCart(beat, defaultTierId);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    toggleLike(beat);
  };

  const handleAddToPlaylistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  // Normalize beat for modal (ensure it has coverImage)
  const normalizedBeat = {
    ...beat,
    coverImage: cover,
    producerName: producerName,
  };

  return (
    <>
      <div className="group relative flex flex-col gap-3 rounded-lg p-2 transition-all hover:bg-white/5 dark:hover:bg-white/5">
        {/* Cover Image Container */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-secondary/50">
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Hover Overlay with Play Button */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isPlayingCurrent || isLoadingCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <button 
              onClick={handlePlayClick}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
            >
              {isLoadingCurrent ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlayingCurrent ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="ml-1 h-5 w-5 fill-current" />
              )}
            </button>
          </div>
          
          {/* In Cart Badge */}
          {inCart && (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
              <Check className="h-3 w-3" />
              In Cart
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-1">
          <Link to={`/beat/${id}`} className="font-display font-bold text-foreground hover:underline truncate">
            {title}
          </Link>
          <Link 
            to={beat.producerUsername ? `/producer/${beat.producerUsername}` : `/producer/${producerId}`} 
            className="text-xs text-muted-foreground hover:text-orange-500 hover:underline transition-colors"
          >
            {producerName}
          </Link>
        </div>

        {/* Tags / Stats */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-1.5 py-0.5">{bpm} BPM</span>
          <span className="rounded bg-secondary px-1.5 py-0.5">{musicalKey}</span>
        </div>

        {/* Footer Actions */}
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">${Number(price).toFixed(2)}</span>
          
          <div className="flex items-center gap-1">
            {/* Add to Playlist */}
            <button 
              onClick={handleAddToPlaylistClick}
              className={cn(
                "rounded-full p-2 transition-colors",
                isInAnyPlaylist 
                  ? "text-purple-500 hover:bg-secondary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-purple-500"
              )}
              title={isInAnyPlaylist ? "In playlist" : "Add to playlist"}
            >
              <ListPlus className={cn("h-4 w-4", isInAnyPlaylist && "fill-current")} />
            </button>
            {/* Like */}
            <button 
              onClick={handleLikeClick}
              className={cn(
                "rounded-full p-2 transition-colors",
                liked 
                  ? "text-red-500 hover:bg-secondary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-red-500"
              )}
              title={liked ? "Remove from liked" : "Add to liked"}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            </button>
            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className={cn(
                "rounded-full p-2 transition-colors",
                inCart 
                  ? "bg-green-600 text-white hover:bg-red-500" 
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}
              title={inCart ? "Remove from cart" : "Add to cart"}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        beat={normalizedBeat}
      />
    </>
  );
};