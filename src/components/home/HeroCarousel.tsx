import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Pause, ShoppingCart, Heart, ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import type { Beat } from "@/data/beats";
import { usePlayerStore } from "@/store/playerStore";
import { useLikesStore } from "@/store/likesStore";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  beats: Beat[];
}

export const HeroCarousel = ({ beats }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();

  useEffect(() => {
    const interval = setInterval(() => {
      // Pause auto-rotation if user is interacting or if this beat is playing? 
      // Actually usually carousels keep rotating unless hovered. 
      // For now, keep it simple.
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % beats.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + beats.length) % beats.length);
  };

  const currentFeaturedBeat = beats[currentIndex];
  // Check if the currently displayed featured beat is the one playing
  const isFeaturedPlaying = currentBeat?.id === currentFeaturedBeat?.id && isPlaying;
  const isFeaturedLoading = currentBeat?.id === currentFeaturedBeat?.id && isLoading;

  if (!currentFeaturedBeat) return null;

  const handlePlayClick = () => {
      if (currentBeat?.id === currentFeaturedBeat.id) {
          togglePlay();
      } else {
          playBeat(currentFeaturedBeat);
      }
  };

  const handleLikeClick = () => {
      toggleLike(currentFeaturedBeat);
  };

  const handleCartClick = () => {
      if (isInCart(currentFeaturedBeat.id)) {
        removeFromCart(currentFeaturedBeat.id);
      } else {
        addToCart(currentFeaturedBeat);
      }
  };

  const isCurrentLiked = isLiked(currentFeaturedBeat.id);
  const isCurrentInCart = isInCart(currentFeaturedBeat.id);

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFeaturedBeat.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentFeaturedBeat.cover})` }}
          />
          {/* ... Gradients ... */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12">
        <div className="flex flex-col items-start gap-4">
          {/* ... Tags ... */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
              Featured Beat
            </span>
            {currentFeaturedBeat.tags.map(tag => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                {tag}
              </span>
            ))}
          </div>

          <AnimatePresence mode="wait">
             <motion.div
               key={currentFeaturedBeat.id}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="space-y-2"
             >
                <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
                  {currentFeaturedBeat.title}
                </h1>
                <Link 
                  to={`/producer/${currentFeaturedBeat.producerId}`}
                  className="text-lg text-white/60 md:text-xl hover:text-orange-500 hover:underline transition-colors"
                >
                  {currentFeaturedBeat.producer}
                </Link>
             </motion.div>
          </AnimatePresence>
          
          {/* ... Stats ... */}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60 md:gap-4 md:text-sm">
             <span className="flex items-center gap-1">
               <span className="h-1 w-1 rounded-full bg-current" />
               {currentFeaturedBeat.bpm} BPM
             </span>
             <span className="flex items-center gap-1">
               <span className="h-1 w-1 rounded-full bg-current" />
               {currentFeaturedBeat.key}
             </span>
             <span className="flex items-center gap-1">
               <span className="h-1 w-1 rounded-full bg-current" />
               {currentFeaturedBeat.duration}
             </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 md:mt-6 md:gap-4">
            <button 
                onClick={handlePlayClick}
                className="group flex h-10 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 md:h-12 md:px-8 md:text-base"
            >
              {isFeaturedLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin md:h-5 md:w-5" />
              ) : isFeaturedPlaying ? (
                  <Pause className="h-4 w-4 fill-current md:h-5 md:w-5" />
              ) : (
                  <Play className="h-4 w-4 fill-current md:h-5 md:w-5" />
              )}
              {isFeaturedLoading ? "Loading..." : isFeaturedPlaying ? "Pause Preview" : "Play Preview"}
            </button>
            <button 
              onClick={handleCartClick}
              className={cn(
                "group flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all md:h-12 md:px-6 md:text-base",
                isCurrentInCart
                  ? "bg-green-600 text-white border-green-600"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20"
              )}
            >
              {isCurrentInCart ? (
                <Check className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              )}
              <span>{isCurrentInCart ? "In Cart" : `$${currentFeaturedBeat.price}`}</span>
            </button>
            <button 
              onClick={handleLikeClick}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all md:h-12 md:w-12",
                isCurrentLiked 
                  ? "bg-red-500 text-white border-red-500" 
                  : "bg-white/5 text-white hover:bg-white/10 hover:text-red-500"
              )}
            >
               <Heart className={cn("h-4 w-4 md:h-5 md:w-5", isCurrentLiked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
      
      {/* ... Nav Buittons ... */}
      <div className="absolute bottom-4 right-4 flex gap-2 md:bottom-8 md:right-8">
        <button 
          onClick={handlePrev} 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button 
          onClick={handleNext} 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};