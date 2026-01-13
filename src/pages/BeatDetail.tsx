import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  CheckCircle
} from "lucide-react";
import { featuredBeats, trendingBeats, getProducerById, type Beat } from "@/data/beats";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { BeatCard } from "@/components/shared/BeatCard";
import { cn } from "@/lib/utils";

const allBeats = [...featuredBeats, ...trendingBeats];

const BeatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading } = usePlayerStore();
  const [isLiked, setIsLiked] = useState(false);

  const beat = allBeats.find((b) => b.id === id);

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

  const isCurrentBeat = currentBeat?.id === beat.id;
  const isPlayingCurrent = isCurrentBeat && isPlaying;
  const isLoadingCurrent = isCurrentBeat && isLoading;

  const handlePlayClick = () => {
    if (isCurrentBeat) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  // Get producer info
  const producer = getProducerById(beat.producerId);

  // Get more beats from the same producer
  const producerBeats = allBeats
    .filter((b) => b.producerId === beat.producerId && b.id !== beat.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="border-b border-border px-3 sm:px-4 py-3 sm:py-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Discover
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
                src={beat.cover}
                alt={beat.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity" />
              
              {/* Play Button Overlay */}
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
                  const height = Math.random() * 100;
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
                {beat.tags[0]}
              </span>
            </div>

            {/* Title & Producer */}
            <div>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground break-words sm:text-3xl md:text-4xl lg:text-5xl">
                {beat.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                by <span className="font-medium text-foreground hover:underline cursor-pointer">{beat.producer}</span>
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
                <span>Key: {beat.key}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{beat.duration}</span>
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
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border border-border transition-all",
                  isLiked ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </button>

              <button className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-foreground break-words">
                {beat.description}
              </p>
            </div>

            {/* Price & Purchase */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price
                  </h3>
                  <p className="mt-1 text-2xl sm:text-3xl font-bold text-orange-500">
                    ${beat.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  {beat.includedFiles.map((file, idx) => (
                    <p key={idx} className="text-xs text-muted-foreground">{file}</p>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <AddToCartButton beat={beat} />
                <button className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary/80">
                  <Download className="h-4 w-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* More from Producer */}
        {producerBeats.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="mb-4 md:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                More from {beat.producer}
              </h2>
              <Link
                to={`/producer/${beat.producer}`}
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
        {producer && (
          <div className="mt-8 md:mt-12">
            <h2 className="mb-4 md:mb-6 font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              About Producer
            </h2>
            <div className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
                {/* Producer Avatar */}
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-orange-500/20">
                    <img
                      src={producer.avatar || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80"}
                      alt={producer.name}
                      className="h-full w-full object-cover"
                    />
                    {producer.verified && (
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Producer Info */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-center md:justify-start gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {producer.name}
                      </h3>
                      {producer.verified && (
                        <CheckCircle className="h-6 w-6 text-orange-500" />
                      )}
                    </div>
                    {producer.location && (
                      <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">{producer.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {producer.bio}
                  </p>

                  {/* Producer Stats */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-orange-500">
                        {producerBeats.length + 1}
                      </p>
                      <p className="text-xs text-muted-foreground">Beats</p>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-orange-500">
                        {producer.verified ? "Verified" : "New"}
                      </p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="shrink-0 w-full md:w-auto">
                  <Link
                    to={`/producer/${beat.producerId}`}
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
    </div>
  );
};

// Add to Cart Button Component
const AddToCartButton = ({ beat }: { beat: Beat }) => {
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const inCart = isInCart(beat.id);

  const handleClick = () => {
    if (inCart) {
      removeFromCart(beat.id);
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

export default BeatDetail;