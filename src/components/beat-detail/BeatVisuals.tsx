import { motion } from "framer-motion";
import { Play, Pause, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeatVisualsProps {
  cover: string;
  title: string;
  isPlayingCurrent: boolean;
  isLoadingCurrent: boolean;
  onPlayClick: () => void;
}

export const BeatVisuals = ({ 
  cover, 
  title, 
  isPlayingCurrent, 
  isLoadingCurrent, 
  onPlayClick 
}: BeatVisualsProps) => {
  return (
    <div className="space-y-4 md:space-y-6 min-w-0">
      {/* Cover Image */}
      <div className="group relative w-full aspect-[1/1] max-w-[100%] overflow-hidden rounded-xl md:rounded-2xl bg-secondary shadow-2xl cursor-pointer">
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
        
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300",
            isPlayingCurrent || isLoadingCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={onPlayClick}
        >
          <button className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl transition-transform hover:scale-110 active:scale-95">
            {isLoadingCurrent ? (
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin" />
            ) : isPlayingCurrent ? (
              <Pause className="h-8 w-8 sm:h-10 sm:w-10 fill-current" />
            ) : (
              <Play className="ml-1 h-8 w-8 sm:h-10 sm:w-10 fill-current" />
            )}
          </button>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="flex h-12 items-center justify-center rounded-xl bg-secondary/50 px-2">
        <div className="flex h-[80%] w-full items-center justify-center gap-1">
          {Array.from({ length: 60 }).map((_, i) => {
            const height = Math.random() * 80 + 20;
            const isActive = isPlayingCurrent && i < 20;
            return (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all",
                  isActive ? "bg-orange-500" : "bg-muted"
                )}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
