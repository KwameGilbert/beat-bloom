import { Link } from "react-router-dom";
import { Play, Pause, Heart, Share2, ListPlus, Music2, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Beat } from "./types";

interface BeatInfoProps {
  beat: Beat;
  producerName: string;
  musicalKey: string;
  tags: string[];
  isPlayingCurrent: boolean;
  isLoadingCurrent: boolean;
  isLiked: boolean;
  onPlayClick: () => void;
  onLikeToggle: () => void;
  onShareClick?: () => void;
  onPlaylistAdd: () => void;
}

export const BeatInfo = ({
  beat,
  producerName,
  musicalKey,
  tags,
  isPlayingCurrent,
  isLoadingCurrent,
  isLiked,
  onPlayClick,
  onLikeToggle,
  onShareClick,
  onPlaylistAdd
}: BeatInfoProps) => {
  return (
    <div className="flex flex-col space-y-4 md:space-y-6 min-w-0">
      {/* Genre Tag */}
      <div>
        <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-500">
          {tags[0] || "Instrumental"}
        </span>
      </div>

      {/* Title & Producer */}
      <div>
        <h1 className="mb-2 font-display text-2xl font-bold text-foreground break-words sm:text-3xl md:text-4xl lg:text-5xl">
          {beat.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          by <Link to={`/producer/${beat.producerUsername || beat.producerId}`} className="font-medium text-foreground hover:text-orange-500 hover:underline cursor-pointer">{producerName}</Link>
        </p>
      </div>

      {/* Beat Specs */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs sm:text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4" />
          <span>{beat.bpm} BPM</span>
        </div>
        <div className="flex items-center gap-2">
          <Music2 className="h-4 w-4" />
          <span>Key: {musicalKey}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{beat.duration ? (typeof beat.duration === 'number' ? `${Math.floor(beat.duration / 60)}:${(beat.duration % 60).toString().padStart(2, '0')}` : beat.duration) : '3:00'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          onClick={onPlayClick}
          className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-bold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95"
        >
          {isLoadingCurrent ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : isPlayingCurrent ? (
            <>
              <Pause className="h-5 w-5 fill-current" />
              Pause Preview
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current" />
              Play Preview
            </>
          )}
        </button>

        <button
          onClick={onLikeToggle}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all",
            isLiked ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
        </button>

        <button 
          onClick={onShareClick}
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
        >
          <Share2 className="h-5 w-5" />
        </button>

        <button 
          onClick={onPlaylistAdd}
          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
          title="Add to Playlist"
        >
          <ListPlus className="h-5 w-5" />
        </button>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Description
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-foreground break-words">
          {beat.description || "No description provided for this beat."}
        </p>
      </div>
    </div>
  );
};
