import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useLikesStore } from "@/store/likesStore";
import { getProducerById } from "@/data/beats";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";
import { audioManager } from "@/lib/audioManager";

// Import sub-components
import { MobileCompactPlayer } from "./MobileCompactPlayer";
import { MobileFullPlayer } from "./MobileFullPlayer";
import { DesktopPlayer } from "./DesktopPlayer";

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const PlayerBar = () => {
  const { 
    currentBeat, 
    isPlaying, 
    pause, 
    resume,  
    volume, 
    setVolume, 
    isLoading, 
    setIsLoading,
    nextTrack,
    previousTrack,
    shuffle,
    toggleShuffle,
    repeat,
    toggleRepeat,
    closePlayer
  } = usePlayerStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const { toggleLike, isLiked } = useLikesStore();

  // Get producer info from current beat
  const producer = useMemo(() => {
    if (!currentBeat?.producerId) return null;
    return getProducerById(currentBeat.producerId) ?? null;
  }, [currentBeat?.producerId]);

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioManager.getAudio();
    
    const handleLoadedData = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      const { repeat } = usePlayerStore.getState();
      if (repeat === "one") {
        audioManager.seek(0);
        audioManager.resume().catch(() => {});
      } else {
        nextTrack();
      }
    };
    
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      pause();
    };

    audioManager.on("loadeddata", handleLoadedData);
    audioManager.on("timeupdate", handleTimeUpdate);
    audioManager.on("ended", handleEnded);
    audioManager.on("waiting", handleWaiting);
    audioManager.on("canplay", handleCanPlay);
    audioManager.on("error", handleError);

    return () => {
      audioManager.off("loadeddata", handleLoadedData);
      audioManager.off("timeupdate", handleTimeUpdate);
      audioManager.off("ended", handleEnded);
      audioManager.off("waiting", handleWaiting);
      audioManager.off("canplay", handleCanPlay);
      audioManager.off("error", handleError);
    };
  }, [setIsLoading, nextTrack, pause]);

  // Handle Track Change - use the singleton audio manager
  useEffect(() => {
    if (currentBeat?.audio) {
      setIsLoading(true);
      // Don't close the mobile player when track changes (e.g., next/previous)
      // setIsMobileOpen(false) was causing the player to collapse on track change
      
      // Use the audio manager to play - it handles stopping previous audio
      audioManager.play(currentBeat.audio)
        .then(() => {
          // Successfully started playing
        })
        .catch(() => {
          pause();
        });
    }
  }, [currentBeat?.id, currentBeat?.audio, setIsLoading, pause]);

  // Handle Play/Pause state changes
  useEffect(() => {
    if (currentBeat?.audio) {
      if (isPlaying) {
        audioManager.resume().catch(() => pause());
      } else {
        audioManager.pause();
      }
    }
  }, [isPlaying, currentBeat?.audio, pause]);

  // Handle Volume changes
  useEffect(() => {
    audioManager.setVolume(volume);
  }, [volume]);

  // Event handlers
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    audioManager.seek(time);
    setCurrentTime(time);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  }, [setVolume]);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.stop();
    closePlayer();
  }, [closePlayer]);

  const handleCloseFromFullscreen = useCallback(() => {
    audioManager.stop();
    closePlayer();
  }, [closePlayer]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const handleBuyClick = useCallback(() => {
    if (!currentBeat) return;
    if (!isInCart(currentBeat.id)) {
      addToCart(currentBeat);
    }
    setIsMobileOpen(false);
    navigate("/checkout");
  }, [currentBeat, isInCart, addToCart, navigate]);

  const handleShare = useCallback(async () => {
    if (!currentBeat) return;
    
    const shareUrl = `${window.location.origin}/beat/${currentBeat.id}`;
    const shareData = {
      title: currentBeat.title,
      text: `Check out "${currentBeat.title}" by ${currentBeat.producer} on BeatBloom!`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch (err) {
      console.log("Share failed", err);
    }
  }, [currentBeat]);

  const handleToggleLike = useCallback(() => {
    if (currentBeat) {
      toggleLike(currentBeat);
    }
  }, [currentBeat, toggleLike]);

  const handleMinimize = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const handleExpand = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const handleAddToPlaylist = useCallback(() => {
    setIsPlaylistModalOpen(true);
  }, []);
  
  // Don't render if no beat is selected
  if (!currentBeat) return null;

  const beatIsLiked = isLiked(currentBeat.id);
  const beatInCart = isInCart(currentBeat.id);

  return (
    <>
      {/* Mobile Compact Player */}
      <MobileCompactPlayer
        currentBeat={currentBeat}
        isPlaying={isPlaying}
        isLoading={isLoading}
        currentTime={currentTime}
        duration={duration}
        onPlayPause={handlePlayPause}
        onNext={nextTrack}
        onClose={handleClose}
        onExpand={handleExpand}
      />

      {/* Mobile Full Screen Player */}
      <MobileFullPlayer
        currentBeat={currentBeat}
        producer={producer}
        isOpen={isMobileOpen}
        isPlaying={isPlaying}
        isLoading={isLoading}
        isLiked={beatIsLiked}
        isInCart={beatInCart}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        shuffle={shuffle}
        repeat={repeat}
        shareSuccess={shareSuccess}
        onClose={handleCloseFromFullscreen}
        onMinimize={handleMinimize}
        onPlayPause={handlePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleLike={handleToggleLike}
        onShare={handleShare}
        onBuy={handleBuyClick}
        onAddToPlaylist={handleAddToPlaylist}
        formatTime={formatTime}
      />

      {/* Desktop Player */}
      <DesktopPlayer
        currentBeat={currentBeat}
        isPlaying={isPlaying}
        isLoading={isLoading}
        isLiked={beatIsLiked}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        shuffle={shuffle}
        repeat={repeat}
        onPlayPause={handlePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleLike={handleToggleLike}
        onClose={handleClose}
        onAddToPlaylist={handleAddToPlaylist}
        formatTime={formatTime}
      />

      {/* Playlist Modal */}
      {currentBeat && (
        <AddToPlaylistModal 
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          beat={currentBeat}
        />
      )}
    </>
  );
};
