import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Clock, 
  Music, 
  Users, 
  Verified,
  Loader2,
  ShoppingCart,
  MessageCircle
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useLikesStore } from "@/store/likesStore";
import { useCartStore } from "@/store/cartStore";
import { usePlaylistsStore } from "@/store/playlistsStore";
import { useBeatsStore } from "@/store/beatsStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ProducerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [producer, setProducer] = useState<any>(null);
  const [producerBeats, setProducerBeats] = useState<any[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const { playBeat, currentBeat, isPlaying, togglePlay } = usePlayerStore();
  const { toggleLike, isLiked } = useLikesStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { playlists } = usePlaylistsStore();
  const { getProducer, fetchBeats, trendingBeats } = useBeatsStore();

  useEffect(() => {
    const loadProducerData = async () => {
      if (!id) return;
      setIsPageLoading(true);
      
      const data = await getProducer(id);
      if (data) {
        setProducer(data);
        // Fetch discography
        const beats = await fetchBeats({ producer: data.username });
        if (beats && beats.length > 0) setProducerBeats(beats);
      }
      setIsPageLoading(false);
    };
    loadProducerData();
  }, [id, getProducer, fetchBeats]);

  if (isPageLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Producer Not Found</h2>
        <Link to="/browse" className="text-orange-500 hover:underline">Back to Browse</Link>
      </div>
    );
  }

  const handlePlayClick = (beat: any) => {
    const normalizedId = beat.id.toString();
    if (currentBeat?.id.toString() === normalizedId) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const formatPlays = (plays: number) => {
    if (!plays) return "0";
    if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
    if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
    return plays.toString();
  };

  const totalPlays = producerBeats.reduce((acc, b) => acc + (b.playsCount || 0), 0);
  const avatar = producer.avatar || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80";

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Dynamic Header - Spotify Artist Style */}
      <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
        {/* Producer Cover/Background */}
        <div className="absolute inset-0">
          <img 
            src={producer.coverImage || avatar} 
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            alt={producer.displayName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </div>

        {/* Header Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Verified className="h-5 w-5 fill-current" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">Verified Artist</span>
              </div>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white drop-shadow-2xl">
              {producer.displayName}
            </h1>

            <div className="flex items-center gap-6 mt-2 text-white/90 font-medium">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {formatPlays(totalPlays)} monthly listeners
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md px-6 md:px-12 py-6 border-b border-border/10">
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          {/* Main Play Button */}
          <button 
            onClick={() => producerBeats.length > 0 && handlePlayClick(producerBeats[0])}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-orange-600 active:scale-95"
          >
            {isPlaying && producerBeats.some(b => b.id.toString() === currentBeat?.id.toString()) ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="ml-1 h-6 w-6 fill-current" />
            )}
          </button>

          {/* Follow Button */}
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={cn(
              "rounded-full px-8 py-2.5 text-sm font-bold tracking-tight transition-all uppercase",
              isFollowing 
                ? "bg-transparent border border-white/20 text-white hover:border-white" 
                : "bg-white text-black hover:scale-105 active:scale-95"
            )}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>

          {/* More Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-muted-foreground transition-colors hover:text-white">
              <MessageCircle className="h-6 w-6" />
            </button>
            <button className="text-muted-foreground transition-colors hover:text-white">
              <Share2 className="h-6 w-6" />
            </button>
            <button className="text-muted-foreground transition-colors hover:text-white">
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Beats & Popular */}
        <div className="lg:col-span-2 space-y-12">
          {/* Popular Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Popular</h2>
            <div className="space-y-1">
              {producerBeats.slice(0, 10).map((beat, index) => {
                const id = beat.id.toString();
                const isCurrent = currentBeat?.id.toString() === id;
                const playing = isCurrent && isPlaying;
                const cover = beat.coverImage || beat.cover;
                const price = beat.price || (beat.licenseTiers && beat.licenseTiers[0]?.price) || 0;

                return (
                  <div 
                    key={id}
                    className={cn(
                      "group flex items-center gap-4 rounded-xl p-3 transition-all hover:bg-white/5",
                      isCurrent && "bg-white/10"
                    )}
                  >
                    <div className="w-8 shrink-0 text-center text-sm font-medium text-muted-foreground group-hover:hidden">
                      {index + 1}
                    </div>
                    <button 
                      onClick={() => handlePlayClick(beat)}
                      className="hidden w-8 shrink-0 items-center justify-center text-white group-hover:flex"
                    >
                      {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                    </button>
                    
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-lg">
                      <img src={cover} alt={beat.title} className="h-full w-full object-cover" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link to={`/beat/${id}`} className={cn(
                        "truncate block font-bold transition-colors group-hover:text-white",
                        isCurrent ? "text-orange-500" : "text-white/90"
                      )}>
                        {beat.title}
                      </Link>
                      <p className="truncate text-xs text-muted-foreground">
                        {beat.bpm} BPM • {beat.musicalKey}
                      </p>
                    </div>

                    <div className="hidden md:block w-24 text-right text-xs text-muted-foreground">
                      {formatPlays(beat.playsCount || 0)} plays
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <button 
                        onClick={() => toggleLike(beat)}
                        className={cn("transition-colors", isLiked(id) ? "text-red-500" : "text-muted-foreground group-hover:text-white")}
                      >
                        <Heart className={cn("h-4 w-4", isLiked(id) && "fill-current")} />
                      </button>
                      
                      <div className="text-sm font-bold text-orange-500 w-16 text-right">
                        ${Number(price).toFixed(2)}
                      </div>

                      <button 
                        onClick={() => isInCart(id) ? removeFromCart(id) : addToCart(beat)}
                        className={cn(
                          "rounded-full p-2 transition-all",
                          isInCart(id) ? "bg-orange-500 text-white" : "text-muted-foreground hover:bg-white/10 hover:text-white"
                        )}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Producer Beats Collection */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Discography</h2>
              <Link to="/browse" className="text-sm font-bold text-muted-foreground hover:text-white hover:underline transition-colors uppercase tracking-widest">
                Browse All
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {producerBeats.map((beat) => {
                const id = beat.id.toString();
                const cover = beat.coverImage || beat.cover;
                return (
                  <Link 
                    key={id}
                    to={`/beat/${id}`}
                    className="group flex flex-col p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 hover:border-white/10"
                  >
                    <div className="relative aspect-square mb-4 rounded-xl overflow-hidden shadow-2xl">
                      <img src={cover} alt={beat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePlayClick(beat);
                          }}
                          className="h-12 w-12 rounded-full bg-orange-500 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110"
                        >
                          {currentBeat?.id.toString() === id && isPlaying ? (
                            <Pause className="h-5 w-5 fill-current" />
                          ) : (
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground truncate">{beat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {beat.bpm} BPM • {beat.musicalKey}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: Discover & Info */}
        <div className="space-y-12">
          {/* About Section */}
          <section className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
            <h2 className="text-2xl font-bold mb-6">About</h2>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {producer.bio || "No biography available."}
              </p>
              
              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Verified className="h-4 w-4" />
                  </div>
                  Verified Producer
                </div>
                <div className="flex items-center gap-3 text-sm font-medium">
                  <div className="h-8 w-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  Active Producer
                </div>
                {producer.location && (
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                      <Music className="h-4 w-4" />
                    </div>
                    Based in {producer.location}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Fans also like (Trending Beats) */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Fans also like</h2>
            <div className="space-y-4">
              {trendingBeats.filter(b => b.producerId !== producer.id).slice(0, 5).map(beat => {
                const id = beat.id.toString();
                const cover = beat.coverImage || (beat as any).cover;
                return (
                  <Link 
                    key={id}
                    to={`/beat/${id}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg">
                      <img src={cover} alt={beat.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground group-hover:text-orange-500 transition-colors truncate">
                        {beat.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Artist • {beat.producerName}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Artist Playlists */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Artist Playlists</h2>
            <div className="space-y-4">
              {playlists.slice(0, 3).map(playlist => (
                <Link 
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="flex items-center gap-4 group"
                >
                  <div className={cn("h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-lg flex items-center justify-center", playlist.color)}>
                    <Music className="h-8 w-8 text-white/50" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground group-hover:text-orange-500 transition-colors truncate">
                      {playlist.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {playlist.beats.length} beats
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProducerProfile;
