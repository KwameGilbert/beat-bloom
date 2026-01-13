import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Play, 
  Pause, 
  Heart, 
  Trophy, 
  TrendingUp, 
  Flame,
  Loader2
} from "lucide-react";
import { featuredBeats, trendingBeats, type Beat } from "@/data/beats";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

// Combine all beats and add mock plays data
const allBeats = [...featuredBeats, ...trendingBeats];

// Generate mock plays for each beat (for demo purposes)
const generatePlays = () => Math.floor(Math.random() * 500 + 50);

type ChartTab = "top50" | "trending" | "hot";

const Charts = () => {
  const [activeTab, setActiveTab] = useState<ChartTab>("top50");
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const { addToCart, isInCart } = useCartStore();

  // Sort beats differently based on tab (simulated)
  const chartBeats = useMemo(() => {
    const beatsWithPlays = allBeats.map((beat, index) => ({
      ...beat,
      plays: generatePlays() * (allBeats.length - index), // Higher plays for earlier beats
    }));

    switch (activeTab) {
      case "top50":
        return beatsWithPlays.sort((a, b) => b.plays - a.plays);
      case "trending":
        return [...beatsWithPlays].sort((a, b) => b.price - a.price);
      case "hot":
        return [...beatsWithPlays].reverse();
      default:
        return beatsWithPlays;
    }
  }, [activeTab]);

  const top3Beats = chartBeats.slice(0, 3);
  const remainingBeats = chartBeats.slice(3);

  const handlePlayClick = (beat: Beat, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (currentBeat?.id === beat.id) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handleAddToCart = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart(beat.id)) {
      addToCart(beat);
    }
  };

  const formatPlays = (plays: number) => {
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
        <div className="space-y-4 mb-8">
          {top3Beats.map((beat, index) => {
            const rank = index + 1;
            const isCurrentBeat = currentBeat?.id === beat.id;
            const isPlayingCurrent = isCurrentBeat && isPlaying;
            const isLoadingCurrent = isCurrentBeat && isLoading;

            return (
              <Link
                key={beat.id}
                to={`/beat/${beat.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                  {/* Rank Badge */}
                  <div
                    className={cn(
                      "absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold shadow-lg",
                      getRankColor(rank)
                    )}
                  >
                    {rank}
                  </div>

                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                    <img
                      src={beat.cover}
                      alt={beat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Play Button Overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity",
                        isPlayingCurrent || isLoadingCurrent
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <button
                        onClick={(e) => handlePlayClick(beat, e)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-transform hover:scale-110"
                      >
                        {isLoadingCurrent ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : isPlayingCurrent ? (
                          <Pause className="h-6 w-6 fill-current" />
                        ) : (
                          <Play className="ml-1 h-6 w-6 fill-current" />
                        )}
                      </button>
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">
                        {beat.title}
                      </h3>
                      <p className="text-sm text-white/70">{beat.producer}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between p-4">
                    <span className="text-sm text-muted-foreground">
                      {formatPlays(beat.plays)} plays
                    </span>
                    <span className="text-lg font-bold text-orange-500">
                      ${beat.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Remaining Beats Table */}
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
            {remainingBeats.map((beat, index) => {
              const rank = index + 4;
              const isCurrentBeat = currentBeat?.id === beat.id;
              const isPlayingCurrent = isCurrentBeat && isPlaying;
              const isLoadingCurrent = isCurrentBeat && isLoading;
              const inCart = isInCart(beat.id);

              return (
                <Link
                  key={beat.id}
                  to={`/beat/${beat.id}`}
                  className="group grid grid-cols-12 items-center gap-2 sm:gap-4 px-4 py-3 transition-colors hover:bg-secondary/50"
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
                        src={beat.cover}
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
                        {beat.producer}
                      </p>
                    </div>
                  </div>

                  {/* Plays - Hidden on mobile */}
                  <div className="hidden sm:block col-span-2 text-center text-sm text-muted-foreground">
                    {formatPlays(beat.plays)}
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center text-sm font-bold text-foreground">
                    ${beat.price.toFixed(2)}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-red-500"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(beat, e)}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                        inCart
                          ? "bg-green-600 text-white"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      )}
                    >
                      {inCart ? "Added" : "Buy"}
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

export default Charts;
