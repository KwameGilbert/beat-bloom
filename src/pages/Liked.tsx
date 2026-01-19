import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Play, 
  Pause, 
  ShoppingCart,
  Loader2,
  Music2,
  HeartOff
} from "lucide-react";
import { useLikesStore } from "@/store/likesStore";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { type Beat } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

const Liked = () => {
  const { likedBeats, removeLike, fetchLikedBeats, isLoading: isLoadingLikes } = useLikesStore();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Fetch liked beats from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedBeats();
    }
  }, [isAuthenticated, fetchLikedBeats]);

  const handlePlayClick = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBeat?.id === beat.id) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handleCartToggle = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(beat.id)) {
      removeFromCart(beat.id);
    } else {
      addToCart(beat);
    }
  };

  const handleUnlike = (beatId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeLike(beatId);
  };

  // Loading state
  if (isLoadingLikes) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Empty state
  if (likedBeats.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-500 shadow-lg">
                <Heart className="h-7 w-7 text-white fill-current" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Liked Beats
                </h1>
                <p className="text-sm text-muted-foreground">0 beats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <HeartOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">No liked beats yet</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground max-w-sm">
              Start exploring and like beats to save them here for later
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
            >
              <Music2 className="h-5 w-5" />
              Browse Beats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-500 shadow-lg">
              <Heart className="h-7 w-7 text-white fill-current" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                Liked Beats
              </h1>
              <p className="text-sm text-muted-foreground">
                {likedBeats.length} {likedBeats.length === 1 ? "beat" : "beats"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Beats Grid */}
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {likedBeats.map((beat) => {
            const isCurrentBeat = currentBeat?.id === beat.id;
            const isPlayingCurrent = isCurrentBeat && isPlaying;
            const isLoadingCurrent = isCurrentBeat && isLoading;
            const inCart = isInCart(beat.id);

            return (
              <Link
                key={beat.id}
                to={`/beat/${beat.id}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-lg">
                  {/* Cover Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={beat.coverImage}
                      alt={beat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Play Button Overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                        isPlayingCurrent || isLoadingCurrent
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <button
                        onClick={(e) => handlePlayClick(beat, e)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-transform hover:scale-110"
                      >
                        {isLoadingCurrent ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : isPlayingCurrent ? (
                          <Pause className="h-5 w-5 fill-current" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Beat Info */}
                  <div className="p-3">
                    <h3 className="truncate font-bold text-foreground group-hover:text-orange-500">
                      {beat.title}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {beat.producerName}
                    </p>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {beat.bpm} BPM
                      </span>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {beat.musicalKey}
                      </span>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">
                        ${Number(beat.price || 0).toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleUnlike(beat.id.toString(), e)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-500/10"
                          title="Remove from liked"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                        <button
                          onClick={(e) => handleCartToggle(beat, e)}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                            inCart
                              ? "bg-green-600 text-white hover:bg-red-500"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                          title={inCart ? "Remove from cart" : "Add to cart"}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Liked;
