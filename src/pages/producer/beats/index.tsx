import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Download, 
  Play, 
  Share2, 
  Pause, 
  DollarSign,
  X,
  Loader2
} from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EditBeatModal } from "./EditBeatModal";
import { DeleteBeatModal } from "./DeleteBeatModal";
import producerService from "@/lib/producer";

interface BeatData {
  id: string;
  title: string;
  genre: string;
  bpm: number;
  key: string;
  status: "Active" | "Draft" | "Sold";
  basePrice: number;
  exclusivePrice: number;
  plays: number;
  downloads: number;
  cover: string;
  previewUrl: string;
  salesCount: number;
  revenue: number;
}

export default function ProducerBeats() {
  const [beatsList, setBeatsList] = useState<BeatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBeat, setEditingBeat] = useState<BeatData | null>(null);
  const [deletingBeat, setDeletingBeat] = useState<BeatData | null>(null);
  const [playingBeatId, setPlayingBeatId] = useState<string | null>(null);
  const [audio] = useState(() => new Audio());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchBeats = async () => {
    try {
      const response = await producerService.getMyBeats();
      if (response.success && response.data) {
        const mapped = response.data.map((b: any) => ({
          id: String(b.id),
          title: b.title,
          genre: b.genre,
          bpm: b.bpm,
          key: b.key,
          status: b.status,
          basePrice: b.basePrice,
          exclusivePrice: b.exclusivePrice,
          plays: b.plays,
          downloads: b.downloads,
          cover: b.coverImage || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80",
          previewUrl: b.previewAudioUrl,
          salesCount: b.downloads,
          revenue: b.revenue
        }));
        setBeatsList(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch beats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeats();
  }, []);

  // Toggle audio player playback
  const togglePlay = (id: string, url: string) => {
    if (playingBeatId === id) {
      audio.pause();
      setPlayingBeatId(null);
    } else {
      audio.src = url;
      audio.play().catch(err => console.log("Audio play failed:", err));
      setPlayingBeatId(id);
    }
  };

  // Listen for audio play ending
  useEffect(() => {
    const handleEnded = () => setPlayingBeatId(null);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [audio]);

  // Handle Toast notification copy confirmations
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyShareLink = (id: string, title: string) => {
    const link = `${window.location.origin}/beat/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      triggerToast(`Share link copied for "${title}"!`);
    }).catch(() => {
      triggerToast("Failed to copy share link.");
    });
  };

  const handleSaveEdit = async (updatedBeat: BeatData) => {
    try {
      const response = await producerService.updateBeat(updatedBeat.id, {
        title: updatedBeat.title,
        bpm: updatedBeat.bpm,
        musicalKey: updatedBeat.key,
        status: updatedBeat.status,
        coverImage: updatedBeat.cover,
        previewAudioUrl: updatedBeat.previewUrl
      });

      if (response.success) {
        setBeatsList(prev => prev.map(b => b.id === updatedBeat.id ? updatedBeat : b));
        triggerToast(`"${updatedBeat.title}" updated successfully!`);
      } else {
        triggerToast("Failed to update beat.");
      }
    } catch (error) {
      console.error("Save edit error:", error);
      triggerToast("Failed to save beat changes.");
    } finally {
      setEditingBeat(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBeat) return;
    try {
      const response = await producerService.deleteBeat(deletingBeat.id);
      if (response.success) {
        if (playingBeatId === deletingBeat.id) {
          audio.pause();
          setPlayingBeatId(null);
        }
        setBeatsList(prev => prev.filter(b => b.id !== deletingBeat.id));
        triggerToast(`"${deletingBeat.title}" deleted from catalog.`);
      } else {
        triggerToast("Failed to delete beat.");
      }
    } catch (error) {
      console.error("Delete beat error:", error);
      triggerToast("Failed to delete beat.");
    } finally {
      setDeletingBeat(null);
    }
  };

  const columns: TableColumn<BeatData>[] = [
    {
      key: "title",
      header: "Beat Track",
      sortable: true,
      searchable: true,
      render: (row) => {
        const isPlaying = playingBeatId === row.id;

        return (
          <div className="flex items-center gap-3">
            {/* Interactive Playable Beat Cover Artwork */}
            <div 
              onClick={() => togglePlay(row.id, row.previewUrl)}
              className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-lg overflow-hidden bg-orange-500/10 shrink-0 cursor-pointer border border-border group shadow-sm flex items-center justify-center"
              title={isPlaying ? "Pause Beat" : "Play Beat"}
            >
              <img 
                src={row.cover} 
                alt="" 
                className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" 
              />
              
              {/* Cover masking hover overlay */}
              <div className={cn(
                "absolute inset-0 bg-black/40 transition-opacity",
                isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />
              
              {/* Play/Equalizer overlays */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                  </div>
                ) : (
                  <Play className="h-4 w-4 text-white fill-white transition-transform duration-200 group-hover:scale-110" />
                )}
              </div>
            </div>
            
            <div className="min-w-0 text-left">
              <p className="font-bold text-foreground truncate">{row.title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                <span className="text-orange-500 font-semibold">{row.genre}</span> • {row.bpm} BPM • {row.key}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      render: (row) => (
        <span className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border shadow-sm",
          row.status === "Active" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          row.status === "Draft" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          row.status === "Sold" && "bg-rose-500/10 text-rose-500 border-rose-500/20"
        )}>
          {row.status}
        </span>
      ),
    },
    {
      key: "basePrice",
      header: "License Pricing",
      sortable: true,
      render: (row) => (
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">${row.basePrice.toFixed(2)} <span className="text-xs text-muted-foreground font-normal">(Base)</span></p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Exclusive: ${row.exclusivePrice.toFixed(2)}</p>
        </div>
      ),
    },
    {
      key: "plays",
      header: "Statistics",
      sortable: true,
      render: (row) => (
        <div className="text-left space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{row.plays.toLocaleString()}</span>
            <span>plays</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Download className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{row.downloads.toLocaleString()}</span>
            <span>downloads</span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Catalog Actions",
      sortable: false,
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button 
            onClick={() => copyShareLink(row.id, row.title)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95" 
            title="Copy marketplace link"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setEditingBeat(row)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95" 
            title="Edit track settings"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setDeletingBeat(row)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all active:scale-95" 
            title="Delete track"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-8 pb-24 text-left font-sans relative">
      
      {/* Toast Alert overlay notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md px-4 py-3 shadow-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-scale-up">
          <span className="text-foreground">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground sm:text-3xl tracking-tight">
            My Beats Catalog
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your beat catalog, configure lease structures, copy links, and audit stats.
          </p>
        </div>
        <Button
          to="/producer/upload"
          className="rounded-xl px-5 py-2.5 flex items-center gap-2 h-auto text-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" /> Upload New Beat
        </Button>
      </div>

      {/* Quick Metrics Audit Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Catalog Size"
          value={`${beatsList.length} Beat${beatsList.length === 1 ? "" : "s"}`}
          variant="compact"
        />
        <StatsCard
          title="Combined Plays"
          value={beatsList.reduce((sum, b) => sum + b.plays, 0).toLocaleString()}
          variant="compact"
        />
        <StatsCard
          title="Combined Downloads"
          value={beatsList.reduce((sum, b) => sum + b.downloads, 0).toLocaleString()}
          variant="compact"
        />
        <StatsCard
          title="Catalog Revenue"
          value={`$${beatsList.reduce((sum, b) => sum + b.revenue, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          variant="compact"
        />
      </div>

      {/* Interactive Table Container */}
      <Table
        columns={columns}
        data={beatsList}
        defaultSort={{ key: "title", direction: "asc" }}
      />

      {/* Edit Beat Details Modal */}
      <EditBeatModal
        isOpen={editingBeat !== null}
        onClose={() => setEditingBeat(null)}
        beat={editingBeat}
        onSave={handleSaveEdit}
      />

      {/* Delete Beat Confirmation Modal */}
      <DeleteBeatModal
        isOpen={deletingBeat !== null}
        onClose={() => setDeletingBeat(null)}
        beatTitle={deletingBeat?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
