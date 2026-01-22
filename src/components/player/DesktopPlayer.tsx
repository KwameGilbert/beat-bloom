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
  Maximize2,
  Loader2,
  X,
  ListPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Beat } from "@/lib/marketplace";

interface DesktopPlayerProps {
  currentBeat: Beat;
  isPlaying: boolean;
  isLoading: boolean;
  isLiked: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: "off" | "one" | "all";
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleLike: () => void;
  onClose: (e: React.MouseEvent) => void;
  onAddToPlaylist: () => void;
  formatTime: (time: number) => string;
}

export const DesktopPlayer = ({
  currentBeat,
  isPlaying,
  isLoading,
  isLiked,
  currentTime,
  duration,
  volume,
  shuffle,
  repeat,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onToggleLike,
  onClose,
  onAddToPlaylist,
  formatTime,
}: DesktopPlayerProps) => {
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] hidden h-24 items-center justify-between border-t border-border bg-card px-6 md:flex">
      
      {/* Left: Info */}
      <div className="flex flex-1 items-center gap-4 min-w-0">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md group relative border border-border">
          <img 
            src={currentBeat.coverImage } 
            alt={currentBeat.title}
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
            <Maximize2 className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <Link to={`/beat/${currentBeat.id}`} className="text-sm font-bold text-foreground hover:text-orange-500 hover:underline truncate">
            {currentBeat.title}
          </Link>
          <Link to={`/producer/${currentBeat.producerId}`} className="text-xs text-muted-foreground hover:text-orange-500 hover:underline truncate">
            {currentBeat.producerName }
          </Link>
        </div>
        <button 
          onClick={onToggleLike}
          className={cn(
            "ml-2 transition-colors shrink-0",
            isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </button>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-1 max-w-xl flex-col items-center gap-2 px-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={onToggleShuffle}
            className={cn(
              "transition-colors",
              shuffle ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button 
            onClick={onPrevious}
            className="text-foreground hover:text-foreground transition-colors"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          
          <button 
            onClick={onPlayPause}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background hover:scale-105 active:scale-95 transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <button 
            onClick={onNext}
            className="text-foreground hover:text-foreground transition-colors"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button 
            onClick={onToggleRepeat}
            className={cn(
              "transition-colors relative",
              repeat !== "off" ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <RepeatIcon className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex w-full items-center gap-2 text-xs text-muted-foreground font-medium">
          <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={onSeek}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800/50 accent-orange-500 hover:accent-orange-400"
            style={{
              background: `linear-gradient(to right, #f97316 ${(currentTime / (duration || 1)) * 100}%, #27272a ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />
          <span className="w-8 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-1 justify-end items-center gap-2 md:gap-4 min-w-0">
        {/* BPM Badge - Visible on larger screens */}
        <div className="flex items-center gap-2 hidden lg:flex shrink-0">
          <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-foreground pointer-events-none border border-border whitespace-nowrap">
            {currentBeat.bpm} BPM
          </span>
          <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-foreground pointer-events-none border border-border whitespace-nowrap">
            {currentBeat.musicalKey}
          </span>
        </div>

        <div className="mx-2 h-6 w-px bg-border hidden lg:block shrink-0" />
        
        <button 
          onClick={onAddToPlaylist}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title="Add to Playlist"
        >
          <ListPlus className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 w-24 lg:w-32 group shrink-0">
          <Volume2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800/50 accent-orange-500 hover:accent-orange-400"
            style={{
              background: `linear-gradient(to right, #f97316 ${volume * 100}%, #27272a ${volume * 100}%)`
            }}
          />
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
