import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  Heart,
  ListMusic,
  Maximize2,
  ChevronDown,
  Loader2,
  Share2,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const PlayerBar = () => {
  const { currentBeat, isPlaying, pause, resume, volume, setVolume, isLoading, setIsLoading } = usePlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Configure event listeners
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => pause(); // Or handle auto-next
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  // Handle Beat Change
  useEffect(() => {
    if (currentBeat && audioRef.current) {
      if (audioRef.current.src !== currentBeat.audio) {
        setIsLoading(true);
        audioRef.current.src = currentBeat.audio;
        audioRef.current.volume = volume;
        if (isPlaying) {
          audioRef.current.play().catch(() => pause());
        }
      }
    }
  }, [currentBeat?.id]);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => pause());
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Seek Handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };
  
  if (!currentBeat) return null;

  return (
    <>
      {/* ==================== MOBILE COMPACT PLAYER ==================== */}
      <div 
        onClick={() => setIsMobileOpen(true)}
        className="fixed bottom-16 left-2 right-2 z-50 flex h-16 items-center justify-between rounded-lg bg-card/95 px-3 shadow-xl backdrop-blur-lg border border-border md:hidden transition-transform active:scale-[0.98]"
      >
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
               src={currentBeat.cover} 
               alt={currentBeat.title}
               className="h-full w-full object-cover"
             />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-foreground leading-tight">{currentBeat.title}</span>
            <span className="truncate text-xs text-muted-foreground">{currentBeat.producer}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); isPlaying ? pause() : resume(); }}
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
        </div>
      </div>


      {/* ==================== MOBILE FULL SCREEN PLAYER ==================== */}
      {/* Slide-up Container */}
      <div className={cn(
        "fixed inset-0 z-[100] flex flex-col bg-background transition-transform duration-300 ease-out md:hidden overflow-y-auto",
        isMobileOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-8">
           <button onClick={() => setIsMobileOpen(false)} className="text-foreground">
             <ChevronDown className="h-8 w-8" />
           </button>
           <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Now Playing</span>
           <button className="text-foreground">
             <MoreVertical className="h-6 w-6" />
           </button>
        </div>

        {/* Content Container - Scrollable part */}
        <div className="flex-1 flex flex-col">
            {/* Art */}
            <div className="flex flex-1 items-center justify-center px-8 min-h-[300px]">
               <div className="aspect-square w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl shadow-orange-500/10 border border-border">
                  <img 
                    src={currentBeat.cover} 
                    alt={currentBeat.title}
                    className="h-full w-full object-cover"
                  />
               </div>
            </div>

            {/* Info & Controls */}
            <div className="flex flex-col px-8 pb-32 pt-8">
               {/* Title Row */}
               <div className="flex items-center justify-between mb-8">
                  <div className="overflow-hidden pr-4">
                    <h2 className="text-2xl font-bold text-foreground mb-2 truncate">{currentBeat.title}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                       <p className="text-lg text-muted-foreground truncate mr-1">{currentBeat.producer}</p>
                       <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground pointer-events-none border border-border">
                          {currentBeat.bpm} BPM
                       </span>
                       <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-foreground pointer-events-none border border-border">
                          {currentBeat.key}
                       </span>
                    </div>
                  </div>
                  <button className="text-orange-500 shrink-0">
                    <Heart className="h-8 w-8" />
                  </button>
               </div>

               {/* Progress */}
               <div className="mb-6 space-y-2">
                 <input
                   type="range"
                   min={0}
                   max={duration || 100}
                   value={currentTime}
                   onChange={handleSeek}
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
                  <button className="text-muted-foreground hover:text-foreground"><Shuffle className="h-6 w-6" /></button>
                  <button className="text-foreground hover:text-foreground"><SkipBack className="h-8 w-8 fill-current" /></button>
                  <button 
                    onClick={isPlaying ? pause : resume}
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
                  <button className="text-foreground hover:text-foreground"><SkipForward className="h-8 w-8 fill-current" /></button>
                  <button className="text-muted-foreground hover:text-foreground"><Repeat className="h-6 w-6" /></button>
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
                     onChange={handleVolumeChange}
                     className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-white hover:accent-orange-500"
                  />
               </div>

               {/* Bottom Actions */}
               <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 text-muted-foreground text-sm">
                     <Share2 className="h-5 w-5" />
                  </button>
                  <button className="w-full mx-4 py-3 rounded-full bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-colors">
                    Buy for ${currentBeat.price}
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground text-sm">
                     <ListMusic className="h-5 w-5" />
                  </button>
               </div>
            </div>
        </div>
      </div>


      {/* ==================== DESKTOP PLAYER ==================== */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] hidden h-24 items-center justify-between border-t border-border bg-card px-6 md:flex">
        
        {/* Left: Info */}
        <div className="flex flex-1 items-center gap-4 min-w-0">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md group relative border border-border">
             <img 
               src={currentBeat.cover} 
               alt={currentBeat.title}
               className="h-full w-full object-cover" 
             />
             <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                <Maximize2 className="h-5 w-5 text-white" />
             </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="text-sm font-bold text-foreground hover:underline cursor-pointer truncate">{currentBeat.title}</h4>
            <span className="text-xs text-muted-foreground hover:underline cursor-pointer truncate">{currentBeat.producer}</span>
          </div>
          <button className="ml-2 text-muted-foreground hover:text-red-500 transition-colors shrink-0">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-1 max-w-xl flex-col items-center gap-2 px-8">
          <div className="flex items-center gap-6">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="text-foreground hover:text-foreground transition-colors">
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            
            <button 
              onClick={isPlaying ? pause : resume}
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

            <button className="text-foreground hover:text-foreground transition-colors">
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Repeat className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex w-full items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <input
               type="range"
               min={0}
               max={duration || 100}
               value={currentTime}
               onChange={handleSeek}
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
               {currentBeat.key}
             </span>
           </div>

           <div className="mx-2 h-6 w-px bg-border hidden lg:block shrink-0" />
           
           <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
             <ListMusic className="h-5 w-5" />
           </button>

           <div className="flex items-center gap-2 w-24 lg:w-32 group shrink-0">
             <Volume2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
             <input
               type="range"
               min={0}
               max={1}
               step={0.01}
               value={volume}
               onChange={handleVolumeChange}
               className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800/50 accent-white hover:accent-orange-500"
               style={{
                 background: `linear-gradient(to right, white ${volume * 100}%, #27272a ${volume * 100}%)`
               }}
             />
           </div>
        </div>
      </div>
    </>
  );
};
