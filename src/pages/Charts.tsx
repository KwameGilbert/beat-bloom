import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Play, 
  Pause, 
  Heart, 
  Trophy, 
  TrendingUp, 
  Flame,
  Loader2,
  ShoppingCart
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useLikesStore } from "@/store/likesStore";
import { useBeatsStore } from "@/store/beatsStore";
import { cn } from "@/lib/utils";

type ChartTab = "top50" | "trending" | "hot";

const Charts = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>("top50");
  const { trendingBeats, isLoading: isBeatsLoading, fetchTrending } = useBeatsStore();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  useEffect(() => {
    fetchTrending(50);
  }, [fetchTrending]);

  const chartBeats = useMemo(() => {
    // Current backend only has one trending endpoint, so we'll use it for all tabs for now
    // but we could sort locally as a simulation
    const beats = [...trendingBeats];
    if (activeTab === "hot") {
      return beats.sort((a, b) => b.bpm - a.bpm);
    }
    return beats;
  }, [trendingBeats, activeTab]);

  const top3Beats = chartBeats.slice(0, 3);
  const remainingBeats = chartBeats.slice(3);

  const handlePlayClick = (beat: any, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentBeat?.id.toString() === beat.id.toString()) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handleCartToggle = (beat: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = beat.id.toString();
    if (isInCart(id)) {
      removeFromCart(id);
    } else {
      addToCart(beat);
    }
  };

  const formatPlays = (plays: number) => {
    if (!plays) return "0";
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    }
    if (plays >= 1000) {
      return `${Math.floor(plays / 1000)}K`;
    }
    return plays.toString();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-orange-500 text-white";
      case 2:
        return "bg-secondary text-foreground";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  const tabs = [
    { id: "top50" as ChartTab, label: "Top 50", icon: Trophy },
    { id: "trending" as ChartTab, label: "Trending", icon: TrendingUp },
    { id: "hot" as ChartTab, label: "Hot This Week", icon: Flame },
  ];

  if (isBeatsLoading && trendingBeats.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Charts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The most popular beats right now
          </p>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-orange-500 text-white"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        {/* Top 3 Hero Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
          {top3Beats.map((beat: any, index) => {
            const rank = index + 1;
            const id = beat.id.toString();
            const isCurrentBeat = currentBeat?.id.toString() === id;
            const isPlayingCurrent = isCurrentBeat && isPlaying;
            const isLoadingCurrent = isCurrentBeat && isLoading;
            const cover = beat.coverImage || beat.cover;

            return (
              <div
                key={id}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-orange-500/50"
              >
                <Link to={`/beat/${id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={cover}
                      alt={beat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white truncate">
                        {beat.title}
                      </h3>
                      <p className="text-xs text-white/70">{beat.producerName || beat.producer}</p>
                    </div>
                  </div>
                </Link>

                {/* Rank Badge */}
                <div
                  className={cn(
                    "absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-lg",
                    getRankColor(rank)
                  )}
                >
                  {rank}
                </div>

                <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{formatPlays(beat.plays)} plays</span>
                    <span className="text-sm font-bold text-orange-500">
                      ${Number(beat.price || (beat.licenseTiers && beat.licenseTiers[0]?.price) || 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handlePlayClick(beat, e)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-transform hover:scale-110"
                    >
                      {isLoadingCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlayingCurrent ? (
                        <Pause className="h-4 w-4 fill-current" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4 fill-current" />
                      )}
                    </button>
                    <button
                      onClick={(e) => handleCartToggle(beat, e)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                        isInCart(id)
                          ? "bg-green-600 text-white"
                          : "bg-secondary text-foreground hover:bg-orange-500 hover:text-white"
                      )}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Remaining Beats Table */}
        {remainingBeats.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-border px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Beat</div>
              <div className="col-span-2 text-center">Plays</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {remainingBeats.map((beat: any, index) => {
                const rank = index + 4;
                const id = beat.id.toString();
                const isCurrentBeat = currentBeat?.id.toString() === id;
                const isPlayingCurrent = isCurrentBeat && isPlaying;
                const isLoadingCurrent = isCurrentBeat && isLoading;
                const inCart = isInCart(id);
                const cover = beat.coverImage || beat.cover;

                return (
                  <div
                    key={id}
                    className="group grid grid-cols-12 items-center gap-2 sm:gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    {/* Rank */}
                    <div className="col-span-1 text-sm font-bold text-orange-500">
                      {rank}
                    </div>

                    {/* Beat Info */}
                    <div className="col-span-7 sm:col-span-5 flex items-center gap-3 min-w-0">
                      <div
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-secondary cursor-pointer"
                        onClick={(e) => handlePlayClick(beat, e)}
                      >
                        <img
                          src={cover}
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
                        <Link to={`/beat/${id}`} className="truncate block font-bold text-foreground hover:text-orange-500">
                          {beat.title}
                        </Link>
                        <p className="truncate text-xs text-muted-foreground">
                          {beat.producerName || beat.producer}
                        </p>
                      </div>
                    </div>

                    {/* Plays - Hidden on mobile */}
                    <div className="hidden sm:block col-span-2 text-center text-sm text-muted-foreground">
                      {formatPlays(beat.plays)}
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center text-sm font-bold text-orange-500">
                      ${Number(beat.price || (beat.licenseTiers && beat.licenseTiers[0]?.price) || 0).toFixed(2)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(beat);
                        }}
                        className={cn(
                          "hidden sm:flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                          isLiked(id)
                            ? "text-red-500"
                            : "text-muted-foreground hover:text-red-500"
                        )}
                      >
                        <Heart className={cn("h-4 w-4", isLiked(id) && "fill-current")} />
                      </button>
                      <button
                        onClick={(e) => handleCartToggle(beat, e)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                          inCart
                            ? "bg-green-600 text-white hover:bg-red-500"
                            : "bg-secondary text-foreground hover:bg-orange-500 hover:text-white"
                        )}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
