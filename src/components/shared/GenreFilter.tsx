import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenreFilterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  allTags: string[];
  tagCounts: Record<string, number>;
  totalBeats: number;
}

export const GenreFilter = ({
  isOpen,
  onClose,
  selectedGenre,
  onGenreSelect,
  allTags,
  tagCounts,
  totalBeats,
}: GenreFilterProps) => {
  const handleSelect = (genre: string | null) => {
    onGenreSelect(genre);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out lg:hidden",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div className="relative max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card px-4 pb-8 pt-3 shadow-2xl">
        {/* Handle */}
        <div className="mb-4 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Filter className="h-5 w-5 text-orange-500" />
            Filter by Genre
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Genre Options */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {/* All Genres Option */}
          <button
            onClick={() => handleSelect(null)}
            className={cn(
              "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
              !selectedGenre
                ? "bg-orange-500 text-white"
                : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            )}
          >
            All Genres
            <span className="ml-1 text-xs opacity-70">({totalBeats})</span>
          </button>

          {/* Dynamic Tags from Beats */}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelect(tag)}
              className={cn(
                "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                selectedGenre === tag
                  ? "bg-orange-500 text-white"
                  : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {tag}
              <span className="ml-1 text-xs opacity-70">({tagCounts[tag] || 0})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
