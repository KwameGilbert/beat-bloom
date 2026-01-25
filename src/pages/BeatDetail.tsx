import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useLikesStore } from "@/store/likesStore";
import { useAuthStore } from "@/store/authStore";
import { useBeatsStore } from "@/store/beatsStore";
import { usePurchasesStore } from "@/store/purchasesStore";
import { AddToPlaylistModal } from "@/components/shared/AddToPlaylistModal";
import { toast } from "sonner";

// Extracted Components
import { BeatHeader } from "@/components/beat-detail/BeatHeader";
import { BeatVisuals } from "@/components/beat-detail/BeatVisuals";
import { BeatInfo } from "@/components/beat-detail/BeatInfo";
import { LicenseTiers } from "@/components/beat-detail/LicenseTiers";
import { MoreFromProducer } from "@/components/beat-detail/MoreFromProducer";
import { AboutProducer } from "@/components/beat-detail/AboutProducer";
import { type Beat } from "@/components/beat-detail/types";

const BeatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [beat, setBeat] = useState<Beat | null>(null);
  const [producerBeats, setProducerBeats] = useState<Beat[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading: isPlayerLoading } = usePlayerStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { isAuthenticated } = useAuthStore();
  const { getBeatPageData } = useBeatsStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { isPurchasedWithTier } = usePurchasesStore();
  
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  useEffect(() => {
    const loadBeatData = async () => {
      if (!id) return;
      setIsPageLoading(true);
      const data = await getBeatPageData(id);
      if (data && data.beat) {
        setBeat({
          ...data.beat,
          isProducerVerified: data.beat.producerIsVerified
        } as any);
        setProducerBeats(data.relatedBeats || []);
      }
      setIsPageLoading(false);
    };
    loadBeatData();
  }, [id, getBeatPageData]);

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
  
  const producerName = beat.producerName || "Unknown Producer";
  const coverImage = beat.coverImage || "/placeholder-cover.jpg";
  const musicalKey = beat.musicalKey || "N/A";

  const tags = (() => {
    if (Array.isArray(beat.tags)) return beat.tags;
    if (typeof beat.tags === 'string') {
      try {
        if (beat.tags.startsWith("[")) return JSON.parse(beat.tags);
        return beat.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      } catch {
        return beat.tags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
    }
    return [];
  })();

  const handlePlayClick = () => {
    if (isCurrentBeat) {
      togglePlay();
    } else {
      playBeat(beat as any);
    }
  };

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    toggleLike(beat as any);
  };

  const handlePlaylistAdd = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setIsPlaylistModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <BeatHeader />

      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-6 sm:py-8 md:px-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left: Beat Visuals */}
          <BeatVisuals
            cover={coverImage}
            title={beat.title}
            isPlayingCurrent={isPlayingCurrent}
            isLoadingCurrent={isLoadingCurrent}
            onPlayClick={handlePlayClick}
          />

          {/* Right: Info & Purchase */}
          <div className="flex flex-col space-y-4 md:space-y-6 min-w-0">
            <BeatInfo
              beat={beat}
              producerName={producerName}
              musicalKey={musicalKey}
              tags={tags}
              isPlayingCurrent={isPlayingCurrent}
              isLoadingCurrent={isLoadingCurrent}
              isLiked={isLiked(normalizedId)}
              onPlayClick={handlePlayClick}
              onLikeToggle={handleLikeToggle}
              onPlaylistAdd={handlePlaylistAdd}
                onShareClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
            />

            <LicenseTiers
              beat={beat}
              selectedTierIndex={selectedTierIndex}
              setSelectedTierIndex={setSelectedTierIndex}
              isPurchased={(tierId) => isPurchasedWithTier(normalizedId, tierId)}
              isInCart={isInCart}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>

        <MoreFromProducer 
          producerName={producerName}
          producerLink={`/producer/${beat.producerUsername || beat.producerId}`}
          beats={producerBeats}
        />

        <AboutProducer 
          beat={beat}
          producerName={producerName}
        />
      </div>

      <AddToPlaylistModal 
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        beat={beat as any}
      />
    </div>
  );
};

export default BeatDetail;
