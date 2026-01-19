import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  ShoppingCart,
  Download,
  Clock,
  Music2,
  Loader2,
  MapPin,
  CheckCircle,
  ListPlus,
  Check,
  Crown,
  FileAudio,
  Sparkles
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useLikesStore } from "@/store/likesStore";
import { useAuthStore } from "@/store/authStore";
import { useBeatsStore } from "@/store/beatsStore";
import { BeatCard } from "@/components/shared/BeatCard";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";
import { cn } from "@/lib/utils";

const BeatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [beat, setBeat] = useState<any>(null);
  const [producerBeats, setProducerBeats] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading: isPlayerLoading } = usePlayerStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { isAuthenticated } = useAuthStore();
  const { getBeat, beats: allBeats, fetchBeats } = useBeatsStore();
  
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  useEffect(() => {
    const loadBeatData = async () => {
      if (!id) return;
      setIsPageLoading(true);
      const data = await getBeat(id);
      if (data) {
        setBeat(data);
        // Fetch more from same producer
        const pb = await fetchBeats({ producer: data.producerUsername || data.producerId });
        // Since fetchBeats updates the store, we can filter from store or just use the response if we had it
        // For now, use the beats from store that match producer
      }
      setIsPageLoading(false);
    };
    loadBeatData();
  }, [id, getBeat, fetchBeats]);

  useEffect(() => {
      if (beat) {
          const pb = allBeats.filter(b => 
              (b.producerId === beat.producerId || b.producerUsername === beat.producerUsername) && 
              b.id.toString() !== beat.id.toString()
          ).slice(0, 6);
          setProducerBeats(pb);
      }
  }, [allBeats, beat]);

  if (isPageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!beat) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="space-y-4 text-center">
          <h1 className="font-display text-4xl font-bold">Beat Not Found</h1>
          <p className="text-muted-foreground">The beat you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const normalizedId = beat.id.toString();
  const isCurrentBeat = currentBeat?.id.toString() === normalizedId;
  const isPlayingCurrent = isCurrentBeat && isPlaying;
  const isLoadingCurrent = isCurrentBeat && isPlayerLoading;
  
  const producerName = beat.producerName || beat.producer;
  const producerId = beat.producerId.toString();
  const cover = beat.coverImage || beat.cover;
  const musicalKey = beat.musicalKey || beat.key;
  const price = beat.price || (beat.licenseTiers && beat.licenseTiers[0]?.price) || 0;
  const tags = Array.isArray(beat.tags) ? beat.tags : (typeof beat.tags === 'string' ? JSON.parse(beat.tags) : []);

  const handlePlayClick = () => {
    if (isCurrentBeat) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="relative z-10 border-b border-border px-3 sm:px-4 py-3 sm:py-4 md:px-8">
        <button
          onClick={() => navigate("/browse")}
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </button>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:px-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left: Beat Cover & Waveform */}
          <div className="space-y-4 md:space-y-6 min-w-0">
            {/* Cover Image */}
            <div className="group relative w-full aspect-[1/1] max-w-[100%] overflow-hidden rounded-xl md:rounded-2xl bg-secondary shadow-2xl cursor-pointer">
              <img
                src={cover}
                alt={beat.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
              
              <div 
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300",
                  isPlayingCurrent || isLoadingCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                onClick={handlePlayClick}
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

          {/* Right: Beat Info & Purchase */}
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
                onClick={handlePlayClick}
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
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: location } });
                    return;
                  }
                  toggleLike(beat);
                }}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all",
                  isLiked(normalizedId) ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked(normalizedId) && "fill-current")} />
              </button>

              <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground">
                <Share2 className="h-5 w-5" />
              </button>

              <button 
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login", { state: { from: location } });
                    return;
                  }
                  setIsPlaylistModalOpen(true);
                }}
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

            {/* License Tiers / Pricing */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Choose Your License
              </h3>
              
              {beat.licenseTiers && beat.licenseTiers.length > 0 ? (
                <>
                  <div className="grid gap-3 mb-4">
                    {beat.licenseTiers.map((tier: any, index: number) => {
                      const isSelected = selectedTierIndex === index;
                      const isExclusive = tier.tierType === 'exclusive';
                      
                      // Convert includedFiles if single string
                      const includedFiles = Array.isArray(tier.includedFiles) ? tier.includedFiles : (typeof tier.includedFiles === 'string' ? JSON.parse(tier.includedFiles) : []);

                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedTierIndex(index)}
                          className={cn(
                            "relative w-full rounded-xl border-2 p-4 text-left transition-all",
                            isSelected
                              ? isExclusive
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-orange-500 bg-orange-500/10"
                              : "border-border bg-secondary/30 hover:border-muted-foreground/50"
                          )}
                        >
                          <div className={cn(
                            "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                            isSelected
                              ? isExclusive
                                ? "border-purple-500 bg-purple-500 text-white"
                                : "border-orange-500 bg-orange-500 text-white"
                              : "border-muted-foreground/30"
                          )}>
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                          
                          <div className="flex items-start gap-3 pr-10">
                            <div className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                              isExclusive ? "bg-purple-500/20 text-purple-500" : "bg-orange-500/20 text-orange-500"
                            )}>
                              {tier.tierType === 'exclusive' ? <Crown className="h-5 w-5" /> : <FileAudio className="h-5 w-5" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-foreground">{tier.name}</span>
                                {isExclusive && (
                                  <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">
                                    Exclusive
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{tier.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {includedFiles.map((file: string, idx: number) => (
                                  <span 
                                    key={idx} 
                                    className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                  >
                                    {file}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className={cn(
                                "text-xl font-bold",
                                isExclusive ? "text-purple-500" : "text-orange-500"
                              )}>
                                ${Number(tier.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <AddToCartButtonWithTier beat={beat} selectedTier={beat.licenseTiers[selectedTierIndex]} />
                    <button 
                      onClick={() => {
                        const { addToCart, isInCart } = useCartStore.getState();
                        const selectedTier = beat.licenseTiers![selectedTierIndex];
                        const beatWithTier = { ...beat, price: selectedTier.price, selectedLicense: selectedTier };
                        if (!isInCart(normalizedId)) {
                          addToCart(beatWithTier);
                        }
                        navigate("/checkout");
                      }}
                      className={cn(
                        "flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-bold transition-all",
                        beat.licenseTiers[selectedTierIndex].tierType === 'exclusive'
                          ? "border-purple-500 bg-purple-500 text-white hover:bg-purple-600"
                          : "border-border bg-secondary text-foreground hover:bg-secondary/80"
                      )}
                    >
                      <Download className="h-4 w-4" />
                      Buy Now - ${Number(beat.licenseTiers[selectedTierIndex].price).toFixed(2)}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <AddToCartButton beat={beat} />
                  <button 
                    onClick={() => {
                      const { addToCart, isInCart } = useCartStore.getState();
                      if (!isInCart(normalizedId)) {
                        addToCart(beat);
                      }
                      navigate("/checkout");
                    }}
                    className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary/80"
                  >
                    <Download className="h-4 w-4" />
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More from Producer */}
        {producerBeats.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="mb-4 md:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                More from {producerName}
              </h2>
              <Link
                to={`/producer/${beat.producerUsername || beat.producerId}`}
                className="text-xs sm:text-sm font-medium text-orange-500 hover:underline whitespace-nowrap"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {producerBeats.map((producerBeat) => (
                <BeatCard key={producerBeat.id} beat={producerBeat} />
              ))}
            </div>
          </div>
        )}

        {/* About Producer */}
        {beat.producerBio && (
          <div className="mt-8 md:mt-12">
            <h2 className="mb-4 md:mb-6 font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              About Producer
            </h2>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-orange-500/20">
                    <img
                      src={beat.producerAvatar || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80"}
                      alt={producerName}
                      className="h-full w-full object-cover"
                    />
                    {beat.isProducerVerified && (
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-center md:justify-start gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {producerName}
                      </h3>
                      {beat.isProducerVerified && (
                        <CheckCircle className="h-6 w-6 text-orange-500" />
                      )}
                    </div>
                  </div>

                  <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {beat.producerBio}
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Link
                    to={`/producer/${beat.producerUsername || beat.producerId}`}
                    className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm sm:text-base font-bold text-foreground transition-all hover:bg-secondary/80"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {beat && (
        <AddToPlaylistModal 
          isOpen={isPlaylistModalOpen}
          onClose={() => setIsPlaylistModalOpen(false)}
          beat={beat}
        />
      )}
    </div>
  );
};

// Add to Cart Button Component
const AddToCartButton = ({ beat }: { beat: any }) => {
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const id = beat.id.toString();
  const inCart = isInCart(id);

  const handleClick = () => {
    if (inCart) {
      removeFromCart(id);
    } else {
      addToCart(beat);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-95",
        inCart
          ? "bg-green-600 text-white hover:bg-red-500"
          : "bg-orange-500 text-white hover:bg-orange-600"
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {inCart ? "Remove from Cart" : "Add to Cart"}
    </button>
  );
};

// Add to Cart Button with License Tier
const AddToCartButtonWithTier = ({ beat, selectedTier }: { beat: any; selectedTier: any }) => {
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const id = beat.id.toString();
  const inCart = isInCart(id);

  const handleClick = () => {
    if (inCart) {
      removeFromCart(id);
    } else {
      const beatWithTier = { 
        ...beat, 
        price: selectedTier.price, 
        selectedLicense: selectedTier 
      };
      addToCart(beatWithTier);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-lg transition-all active:scale-95",
        inCart
          ? "bg-green-600 text-white hover:bg-red-500"
          : selectedTier.tierType === 'exclusive'
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-orange-500 text-white hover:bg-orange-600"
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      {inCart ? "Remove from Cart" : `Add to Cart - $${Number(selectedTier.price).toFixed(2)}`}
    </button>
  );
};

export default BeatDetail;