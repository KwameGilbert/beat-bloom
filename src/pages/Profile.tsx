import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Edit, 
  Settings, 
  Music, 
  Heart, 
  BarChart3,
  Upload,
  Play,
  Pause,
  ShoppingCart,
  Loader2,
  DollarSign,
  Download,
  TrendingUp,
  ShoppingBag
} from "lucide-react";
import { type Beat } from "@/lib/marketplace";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useLikesStore } from "@/store/likesStore";
import { usePlayerStore } from "@/store/playerStore";
import { useCartStore } from "@/store/cartStore";
import { useProfileStore } from "@/store/profileStore";
import { authService } from "@/lib/auth";
import { showNotification } from "@/components/ui/custom-notification";
import { format } from "date-fns";

type ProfileTab = "beats" | "liked" | "analytics" | "purchases";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("purchases");
  const navigate = useNavigate();
  const { toggleLike, isLiked } = useLikesStore();
  const { playBeat, currentBeat, isPlaying, togglePlay, isLoading: isPlayerLoading } = usePlayerStore();
  const { addToCart, removeFromCart, isInCart } = useCartStore();
  const { fetchProfile, profileData, isLoading } = useProfileStore();
  const { upgradeToProducer } = useAuthStore();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpgrade = async () => {
    if (window.confirm("Are you sure you want to become a producer? This will allow you to upload and sell your beats.")) {
      setIsUpgrading(true);
      try {
        await upgradeToProducer();
        fetchProfile();
        showNotification("Success", "You are now a producer!", "success");
      } catch {
        showNotification("Error", "Failed to upgrade role.", "error");
      } finally {
        setIsUpgrading(false);
      }
    }
  };

  const user = profileData?.user;
  const purchases = profileData?.purchases || [];
  const liked = profileData?.likes || [];
  const stats = profileData?.stats;

  if (isLoading && !profileData) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return null;


  const handlePlayClick = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBeat?.id === beat.id) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handleCartToggle = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart(beat.id)) {
      removeFromCart(beat.id);
    } else {
      addToCart(beat);
    }
  };

  const handleLikeClick = (beat: Beat, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(beat);
  };

  const allTabs = [
    { id: "purchases" as ProfileTab, label: "Purchases", icon: ShoppingBag },
    { id: "liked" as ProfileTab, label: "Liked", icon: Heart },
    { id: "beats" as ProfileTab, label: "My Beats", icon: Music, producerOnly: true },
    { id: "analytics" as ProfileTab, label: "Analytics", icon: BarChart3, producerOnly: true },
  ];

  // Filter tabs based on user role
  const tabs = user?.role === 'producer' 
    ? allTabs 
    : allTabs.filter(tab => !tab.producerOnly);

  const renderBeatCard = (beat: Beat, uniqueKey?: string | number) => {
    const isCurrentBeat = currentBeat?.id.toString() === beat.id.toString();
    const isPlayingCurrent = isCurrentBeat && isPlaying;
    const isLoadingCurrent = isCurrentBeat && isPlayerLoading;
    const inCart = isInCart(beat.id);
    const liked = isLiked(beat.id);

    return (
      <button
        key={uniqueKey || beat.id}
        onClick={() => navigate(`/beat/${beat.id}`)}
        className="group block text-left"
      >
        <div className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-border/80 hover:shadow-lg">
          {/* Cover Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={beat.coverImage}
              alt={beat.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Play Button Overlay */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity",
                isPlayingCurrent || isLoadingCurrent
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              <button
                onClick={(e) => handlePlayClick(beat, e)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl transition-transform hover:scale-110"
              >
                {isLoadingCurrent ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlayingCurrent ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </button>
            </div>
          </div>

          {/* Beat Info */}
          <div className="p-3">
            <h3 className="truncate font-bold text-foreground group-hover:text-orange-500">
              {beat.title}
            </h3>
            <p className="truncate text-sm text-muted-foreground">
              {beat.producerName}
            </p>

            {/* Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {beat.bpm} BPM
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {beat.musicalKey}
              </span>
            </div>

            {/* Price & Actions */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold text-orange-500">
                ${Number(beat.price || 0).toFixed(2)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleLikeClick(beat, e)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    liked
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                </button>
                <button
                  onClick={(e) => handleCartToggle(beat, e)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                    inCart
                      ? "bg-green-600 text-white hover:bg-red-500"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-4">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-56 md:h-64">
        <img
          src={user.coverImage || "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80"}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="relative -mt-16 sm:-mt-20">
          {/* Avatar */}
          <div className="mb-4">
            <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl border-4 border-background bg-secondary shadow-xl">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Name & Role */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {user.name}
                </h1>
                {user.username && (
                  <p className="text-sm font-medium text-orange-500">@{user.username}</p>
                )}
              </div>
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            {/* Location & Joined */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {user.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </span>
            </div>

            {/* Website */}
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <a href={`https://${user.website}`} className="text-orange-500 hover:underline">
                {user.website}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex items-center gap-2">
            <button 
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
            <button 
              onClick={() => navigate("/settings")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            {user.role === 'artist' && (
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="ml-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isUpgrading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                Become a Producer
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Music className="h-4 w-4" />
                Beats
              </div>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Likes
              </div>
              <p className="text-2xl font-bold text-foreground">{stats?.likesCount || 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                Purchases
              </div>
              <p className="text-2xl font-bold text-foreground">{stats?.purchasesCount || 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Spending
              </div>
              <p className="text-2xl font-bold text-foreground">$0</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "purchases" && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-foreground">My Purchases</h2>
            
            {purchases.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {purchases.map((purchase, index) => 
                  renderBeatCard(purchase.beat, purchase.id || `purchase-${index}`)
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-bold text-foreground">No purchases yet</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap text-center">
                  Beats you buy will appear here.{"\n"}
                  Start browsing to find your next hit!
                </p>
                <Link
                  to="/browse"
                  className="mt-6 rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Browse Beats
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "beats" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Published Beats</h2>
              {user?.role === 'producer' && (
                <button 
                  onClick={() => navigate("/upload")}
                  className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                >
                  <Upload className="h-4 w-4" />
                  Upload New Beat
                </button>
              )}
            </div>

            {/* Beats Grid (Empty for now as most users are buyers) */}
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 px-4 text-center">
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-lg font-bold text-foreground">No beats published</p>
              {user?.role === 'producer' ? (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    You haven't uploaded any beats yet. Start sharing your sound!
                  </p>
                  <button 
                    onClick={() => navigate("/upload")}
                    className="rounded-full bg-orange-500 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                  >
                    Upload Your First Beat
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Apply as a producer to start selling your beats
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === "liked" && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-foreground">Liked Beats</h2>
            
            {liked.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {liked.map((item, index) => {
                  const beat = 'beat' in item ? item.beat : item;
                  const id = 'id' in item ? (item as any).id : beat.id;
                  return renderBeatCard(beat, id || `like-${index}`);
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-2 text-lg font-bold text-foreground">No liked beats yet</p>
                <p className="text-sm text-muted-foreground">
                  Beats you like will appear here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
            <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-bold text-foreground">Analytics Dashboard</h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Detailed analytics and insights about your beats performance
            </p>
            <button className="rounded-full bg-secondary px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
              Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
