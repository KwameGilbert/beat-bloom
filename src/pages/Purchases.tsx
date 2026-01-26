import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Download, 
  Play, 
  Pause, 
  Music, 
  ShoppingBag,
  Calendar,
  FileMusic,
  Loader2
} from "lucide-react";
import { usePurchasesStore } from "@/store/purchasesStore";
import { usePlayerStore } from "@/store/playerStore";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Purchases = () => {
  const { purchases, fetchPurchases, isLoading: isLoadingPurchases } = usePurchasesStore();
  const { currentBeat, isPlaying, playBeat, togglePlay, isLoading: isPlayerLoading } = usePlayerStore();

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoadingPurchases && purchases.length === 0) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const handlePlayClick = (beat: typeof purchases[0]["beat"], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentBeat?.id.toString() === beat.id.toString()) {
      togglePlay();
    } else {
      playBeat(beat);
    }
  };

  const handleDownload = async (purchaseId: string | number) => {
    try {
      const response = await api.get<{ data: any[] }>(`/orders/purchases/${purchaseId}/download`);
      const files = response.data;
      
      if (files && files.length > 0) {
        if (files.length > 1) {
          toast("Multiple formats available", {
            description: "This purchase includes multiple file versions.",
            action: {
              label: "Download All",
              onClick: () => {
                files.forEach((file, index) => {
                  setTimeout(() => window.open(file.url, "_blank"), index * 300);
                });
              },
            },
          });
        }
        
        // Always open the primary file (first in list)
        window.open(files[0].url, "_blank");
        toast.success("Download started!");
      } else {
        toast.error("No files found for this purchase. Please contact support.");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to retrieve download links.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      {/* Header */}
      <div className="px-4 md:px-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              My Purchases
            </h1>
            <p className="text-sm text-muted-foreground">
              {purchases.length} {purchases.length === 1 ? "beat" : "beats"} purchased
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6">
        {purchases.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
              <Music className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No purchases yet</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              When you purchase beats, they will appear here. You can download them anytime.
            </p>
            <Link
              to="/browse"
              className="rounded-full bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600 transition-colors"
            >
              Browse Beats
            </Link>
          </div>
        ) : (
          /* Purchases List */
          <div className="space-y-3">
            {purchases.map((purchase: any) => {
              // Handle both new nested structure and potential old flat structure from stale localStorage
              const beat = purchase.beat || purchase;
              
              if (!beat || !beat.id) return null;
              
              const isCurrentBeat = currentBeat?.id.toString() === beat.id.toString();
              const isCurrentPlaying = isCurrentBeat && isPlaying;

              return (
                <Link
                  key={`${beat.id}-${purchase.licenseTierId || purchase.purchasedAt}`}
                  to={`/beat/${beat.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:bg-secondary/50"
                >
                  {/* Cover with Play Button */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={beat.coverImage}
                      alt={beat.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayClick(beat, e)}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                        isCurrentBeat ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {isCurrentBeat && isPlayerLoading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : isCurrentPlaying ? (
                        <Pause className="h-6 w-6 text-white fill-current" />
                      ) : (
                        <Play className="h-6 w-6 text-white fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-foreground truncate">{beat.title}</h3>
                      {purchase.isExclusive && (
                        <span className="shrink-0 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                          Exclusive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{beat.producerName}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {/* License Type Badge */}
                      <span className="rounded bg-orange-500/20 text-orange-500 px-2 py-0.5 text-xs font-medium">
                        {purchase.tierName || purchase.tierType?.toUpperCase() || "License"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(purchase.purchasedAt || new Date().toISOString())}
                      </span>
                      <span className="text-green-500 text-xs font-medium">
                        ${Number(purchase.amount || beat.price || 0).toFixed(2)}
                      </span>
                    </div>
                    {/* Included Files */}
                    {purchase.includedFiles && purchase.includedFiles.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(Array.isArray(purchase.includedFiles) 
                          ? purchase.includedFiles 
                          : JSON.parse(purchase.includedFiles || '[]')
                        ).map((file: string) => (
                          <span key={file} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Download Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload(purchase.id);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Purchase Info */}
        {purchases.length > 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileMusic className="h-5 w-5 text-orange-500" />
              <h3 className="font-bold text-foreground">Download Information</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• All purchased beats include MP3 and WAV files</p>
              <p>• Downloads are available immediately after purchase</p>
              <p>• Your purchases are saved and accessible anytime</p>
              <p>• For licensing questions, contact the producer</p>
            </div>
          </div>
        )}

        {/* Total Stats */}
        {purchases.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{purchases.length}</p>
              <p className="text-sm text-muted-foreground">Beats Owned</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="text-2xl font-bold text-green-500">
                ${purchases.reduce((acc: number, p: any) => acc + (p.amount || p.beat?.price || p.price || 0), 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
