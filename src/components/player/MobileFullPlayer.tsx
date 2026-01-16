import { Link } from "react-router-dom";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Repeat1,
  Shuffle, 
  Volume2, 
  Heart,
  ChevronDown,
  Loader2,
  Share2,
  X,
  ShoppingCart,
  Check,
  ListPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Beat, Producer } from "@/data/beats";

interface MobileFullPlayerProps {
  currentBeat: Beat;
  producer: Producer | null;
  isOpen: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  isLiked: boolean;
  isInCart: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  shareSuccess: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onBuy: () => void;
  onAddToPlaylist: () => void;
  formatTime: (time: number) => string;
}

export const MobileFullPlayer = ({
  currentBeat,
  producer,
  isOpen,
  isPlaying,
  isLoading,
  isLiked,
  isInCart,
  currentTime,
  duration,
  volume,
  shuffle,
  repeat,
  shareSuccess,
  onClose,
  onMinimize,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onShare,
  onBuy,
  onAddToPlaylist,
  formatTime,
}: MobileFullPlayerProps) => {
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col bg-background transition-transform duration-300 ease-out md:hidden overflow-y-auto",
      isOpen ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-8">
        <button onClick={onMinimize} className="text-foreground">
          <ChevronDown className="h-8 w-8" />
        </button>
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Now Playing</span>
        <button onClick={onClose} className="text-muted-foreground hover:text-red-500">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content Container - Scrollable part */}
      <div className="flex-1 flex flex-col">
        {/* Art */}
        <div className="flex flex-1 items-center justify-center px-8 min-h-[300px]">
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-orange-500/10 border border-border">
            <img 
              src={currentBeat.cover} 
              alt={currentBeat.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
          </div>
        </div>

        {/* Info & Controls */}
        <div className="flex flex-col px-8 pb-32 pt-8">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-8">
            <div className="overflow-hidden pr-4">
              <Link to={`/beat/${currentBeat.id}`} onClick={onMinimize}>
                <h2 className="text-2xl font-bold text-foreground mb-2 truncate hover:text-orange-500">{currentBeat.title}</h2>
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/producer/${currentBeat.producerId}`} onClick={onMinimize}>
                  <p className="text-lg text-muted-foreground truncate mr-1 hover:text-orange-500">{currentBeat.producer}</p>
                </Link>
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground pointer-events-none border border-border">
                  {currentBeat.bpm} BPM
                </span>
                <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground pointer-events-none border border-border">
                  {currentBeat.key}
                </span>
              </div>
            </div>
            <button 
              onClick={onToggleLike}
              className={cn(
                "shrink-0 transition-colors",
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("h-8 w-8", isLiked && "fill-current")} />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6 space-y-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={onSeek}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800/50 accent-orange-500 hover:accent-orange-400"
              style={{
                background: `linear-gradient(to right, #f97316 ${(currentTime / (duration || 1)) * 100}%, #27272a ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={onToggleShuffle}
              className={cn(
                "transition-colors",
                shuffle ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shuffle className="h-6 w-6" />
            </button>
            <button 
              onClick={onPrevious}
              className="text-foreground hover:text-foreground"
            >
              <SkipBack className="h-8 w-8 fill-current" />
            </button>
            <button 
              onClick={onPlayPause}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg active:scale-95 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8 fill-current" />
              ) : (
                <Play className="h-8 w-8 fill-current ml-1" />
              )}
            </button>
            <button 
              onClick={onNext}
              className="text-foreground hover:text-foreground"
            >
              <SkipForward className="h-8 w-8 fill-current" />
            </button>
            <button 
              onClick={onToggleRepeat}
              className={cn(
                "transition-colors relative",
                repeat !== "off" ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <RepeatIcon className="h-6 w-6" />
              {repeat === "one" && (
                <span className="absolute -top-1 -right-1 text-[8px] font-bold text-orange-500">1</span>
              )}
            </button>
          </div>

          {/* Volume Control (Mobile) */}
          <div className="flex items-center gap-4 mb-8">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={onVolumeChange}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-white hover:accent-orange-500"
              style={{
                background: `linear-gradient(to right, white ${volume * 100}%, #27272a ${volume * 100}%)`
              }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center">
            <button 
              onClick={onShare}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors",
                shareSuccess ? "text-green-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {shareSuccess ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
            </button>
            <button 
              onClick={onBuy}
              className={cn(
                "w-full mx-4 py-3 rounded-full font-bold transition-colors flex items-center justify-center gap-2",
                isInCart
                  ? "bg-green-600 text-white"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {isInCart ? "In Cart - Checkout" : `Buy $${currentBeat.price}`}
            </button>
            <button 
              onClick={onAddToPlaylist}
              className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
              title="Add to Playlist"
            >
              <ListPlus className="h-5 w-5" />
            </button>
          </div>

          {/* Producer Info Section */}
          {producer && (
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-4">Producer</p>
              <Link 
                to={`/producer/${producer.username}`} 
                onClick={onMinimize}
                className="flex items-start gap-4 group/prod"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border group-hover/prod:border-orange-500 transition-colors">
                  <img 
                    src={producer.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"} 
                    alt={producer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-foreground group-hover/prod:text-orange-500 transition-colors">{producer.name}</h4>
                    {producer.verified && (
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  {producer.location && (
                    <p className="text-xs text-muted-foreground mb-2">{producer.location}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">{producer.bio}</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
