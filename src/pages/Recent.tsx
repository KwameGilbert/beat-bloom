import { Link } from "react-router-dom";
import { 
  Clock, 
  Play, 
  Pause, 
  Heart, 
  ShoppingCart,
  Loader2,
  Trash2,
  Music
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useLikesStore } from "@/store/likesStore";
import { useCartStore } from "@/store/cartStore";
import { type Beat } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

const Recent = () => {
  const { recentlyPlayed, playBeat, currentBeat, isPlaying, togglePlay, isLoading, clearRecentlyPlayed } = usePlayerStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

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

  const handleLikeClick = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(beat);
  };

  // Empty state
  if (recentlyPlayed.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-4 pb-32">
        {/* Header */}
        <div className="px-4 py-6 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Recently Played
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
              <Music className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">No recently played beats</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground max-w-sm">
              Start listening to beats and they'll appear here
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
            >
              <Music className="h-5 w-5" />
              Browse Beats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      {/* Header */}
      <div className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Recently Played
                </h1>
                <p className="text-sm text-muted-foreground">
                  {recentlyPlayed.length} {recentlyPlayed.length === 1 ? "beat" : "beats"}
                </p>
              </div>
            </div>
            <button
              onClick={clearRecentlyPlayed}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Recently Played List */}
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="col-span-6">Beat</div>
            <div className="col-span-2 text-center">Duration</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2"></div>
          </div>

          {/* List */}
          <div className="divide-y divide-border">
            {recentlyPlayed.map((beat, index) => {
              const isCurrentBeat = currentBeat?.id === beat.id;
              const isPlayingCurrent = isCurrentBeat && isPlaying;
              const isLoadingCurrent = isCurrentBeat && isLoading;
              const inCart = isInCart(beat.id);
              const liked = isLiked(beat.id);

              return (
                <Link
                  key={`${beat.id}-${index}`}
                  to={`/beat/${beat.id}`}
                  className="group grid grid-cols-12 items-center gap-2 sm:gap-4 px-4 py-3 transition-colors hover:bg-secondary/50"
                >
                  {/* Beat Info */}
                  <div className="col-span-8 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <div
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-secondary cursor-pointer"
                      onClick={(e) => handlePlayClick(beat, e)}
                    >
                      <img
                        src={beat.coverImage}
                        alt={beat.title}
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                          isPlayingCurrent || isLoadingCurrent
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        )}
                      >
                        {isLoadingCurrent ? (
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : isPlayingCurrent ? (
                          <Pause className="h-5 w-5 fill-current text-white" />
                        ) : (
                          <Play className="ml-0.5 h-5 w-5 fill-current text-white" />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-foreground group-hover:text-orange-500">
                        {beat.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {beat.producerName}
                      </p>
                    </div>
                  </div>

                  {/* Duration - Hidden on mobile */}
                  <div className="hidden sm:block col-span-2 text-center text-sm text-muted-foreground">
                    {beat.duration}
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center text-sm font-bold text-foreground">
                    ${Number(beat.price || 0).toFixed(2)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => handleLikeClick(beat, e)}
                      className={cn(
                        "hidden sm:flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        liked
                          ? "text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      )}
                    >
                      <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                    </button>
                    <button
                      onClick={(e) => handleCartToggle(beat, e)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        inCart
                          ? "bg-green-600 text-white hover:bg-red-500"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
