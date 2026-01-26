import { Link } from "react-router-dom";
import { Play, Pause, SkipForward, X, Loader2 } from "lucide-react";
import { Visualizer } from "./Visualizer";
import type { Beat } from "@/lib/marketplace";

interface MobileCompactPlayerProps {
  currentBeat: Beat;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onClose: (e: React.MouseEvent) => void;
  onExpand: () => void;
}

export const MobileCompactPlayer = ({
  currentBeat,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  onPlayPause,
  onNext,
  onClose,
  onExpand,
}: MobileCompactPlayerProps) => {
  return (
    <div 
      onClick={onExpand}
      className="fixed bottom-16 left-2 right-2 z-[100] flex h-16 items-center justify-between rounded-lg bg-card/95 px-3 shadow-xl backdrop-blur-lg border border-border md:hidden transition-transform active:scale-[0.98] overflow-hidden"
    >
      {/* Background Visualizer */}
      <div className="absolute inset-0 z-[-1] opacity-10 pointer-events-none">
        <Visualizer 
          isPlaying={isPlaying} 
          count={30} 
          className="h-full w-full" 
          color="bg-orange-500"
        />
      </div>
      {/* Simple Progress Bar on Top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-muted overflow-hidden rounded-t-lg">
        <div 
          className="h-full bg-orange-500 transition-all duration-100 ease-linear"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-3 overflow-hidden">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-secondary">
          <img 
            src={currentBeat.coverImage} 
            alt={currentBeat.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <Link 
            to={`/beat/${currentBeat.id}`} 
            onClick={onExpand} 
            className="truncate text-sm font-bold text-foreground leading-tight hover:text-orange-500"
          >
            {currentBeat.title}
          </Link>
          <Link 
            to={`/producer/${currentBeat.producerId}`} 
            onClick={(e) => e.stopPropagation()} 
            className="truncate text-xs text-muted-foreground hover:text-orange-500"
          >
            {currentBeat.producerName}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Next Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
        
        {/* Play/Pause Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-secondary"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="h-6 w-6 fill-current ml-0.5" />
          )}
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
