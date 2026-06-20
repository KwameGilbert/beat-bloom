import { useState, useEffect } from "react";
import { X, Music2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BeatData {
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

interface EditBeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  beat: BeatData | null;
  onSave: (updatedBeat: BeatData) => void;
}

export const EditBeatModal = ({ isOpen, onClose, beat, onSave }: EditBeatModalProps) => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState<number>(120);
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"Active" | "Draft" | "Sold">("Active");
  const [basePrice, setBasePrice] = useState<number>(29.99);
  const [exclusivePrice, setExclusivePrice] = useState<number>(499.00);

  useEffect(() => {
    if (isOpen && beat) {
      setTitle(beat.title);
      setGenre(beat.genre);
      setBpm(beat.bpm);
      setKey(beat.key);
      setStatus(beat.status);
      setBasePrice(beat.basePrice);
      setExclusivePrice(beat.exclusivePrice);
    }
  }, [isOpen, beat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beat) return;

    onSave({
      ...beat,
      title,
      genre,
      bpm: Number(bpm),
      key,
      status,
      basePrice: Number(basePrice),
      exclusivePrice: Number(exclusivePrice),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && beat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl z-10 text-left font-sans max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3 mb-1">
                <Music2 className="h-4.5 w-4.5 text-orange-500" />
                <h3 className="font-display font-bold text-lg text-foreground">Edit Beat Track</h3>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                  Track Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Split Row for Genre & Status */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {["Trap", "Hip Hop", "Lo-Fi", "Synthwave", "R&B", "Pop", "Afrobeats"].map((g) => (
                      <option key={g} value={g} className="bg-card">{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="Active" className="bg-card">Active</option>
                    <option value="Draft" className="bg-card">Draft</option>
                    <option value="Sold" className="bg-card">Sold</option>
                  </select>
                </div>
              </div>

              {/* Split Row for BPM & Key */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Tempo (BPM)
                  </label>
                  <input
                    type="number"
                    required
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    min="30"
                    max="300"
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Musical Key
                  </label>
                  <input
                    type="text"
                    required
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="e.g. Am, F#m, C"
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Split Row for Lease and Exclusive Prices */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Base Lease Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Exclusive License Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={exclusivePrice}
                    onChange={(e) => setExclusivePrice(Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-border/40 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold px-4 py-2 border-border/80 hover:bg-secondary"
                >
                  Cancel
                </Button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 shadow-lg shadow-orange-500/15 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
