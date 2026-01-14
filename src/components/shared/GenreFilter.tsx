import { useState } from "react";
import { Filter, X, Music, User, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "genre" | "producer" | "price";

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const priceRanges: PriceRange[] = [
  { label: "Under GH₵30", min: 0, max: 29.99 },
  { label: "GH₵30 - GH₵40", min: 30, max: 40 },
  { label: "GH₵40 - GH₵50", min: 40, max: 50 },
  { label: "Over GH₵50", min: 50, max: 1000 },
];

interface BeatFilterProps {
  isOpen: boolean;
  onClose: () => void;
  // Genre filter
  selectedGenre: string | null;
  onGenreSelect: (genre: string | null) => void;
  allTags: string[];
  tagCounts: Record<string, number>;
  // Producer filter
  selectedProducer: string | null;
  onProducerSelect: (producer: string | null) => void;
  allProducers: string[];
  producerCounts: Record<string, number>;
  // Price filter
  selectedPriceRange: PriceRange | null;
  onPriceRangeSelect: (range: PriceRange | null) => void;
  // Total
  totalBeats: number;
}

export const BeatFilter = ({
  isOpen,
  onClose,
  selectedGenre,
  onGenreSelect,
  allTags,
  tagCounts,
  selectedProducer,
  onProducerSelect,
  allProducers,
  producerCounts,
  selectedPriceRange,
  onPriceRangeSelect,
  totalBeats,
}: BeatFilterProps) => {
  const [activeFilterType, setActiveFilterType] = useState<FilterType>("genre");

  const handleGenreSelect = (genre: string | null) => {
    onGenreSelect(genre);
    onClose();
  };

  const handleProducerSelect = (producer: string | null) => {
    onProducerSelect(producer);
    onClose();
  };

  const handlePriceSelect = (range: PriceRange | null) => {
    onPriceRangeSelect(range);
    onClose();
  };

  const filterTabs = [
    { id: "genre" as FilterType, label: "Genre", icon: Music },
    { id: "producer" as FilterType, label: "Producer", icon: User },
    { id: "price" as FilterType, label: "Price", icon: DollarSign },
  ];

  // Count active filters
  const activeFiltersCount = [selectedGenre, selectedProducer, selectedPriceRange].filter(Boolean).length;

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
      <div className="relative max-h-[75vh] overflow-hidden rounded-t-2xl border-t border-border bg-card shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Filter className="h-5 w-5 text-orange-500" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Type Tabs */}
        <div className="flex border-b border-border px-4">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilterType(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors",
                  activeFilterType === tab.id
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

        {/* Filter Content */}
        <div className="max-h-[50vh] overflow-y-auto px-4 py-4">
          {/* Genre Filter */}
          {activeFilterType === "genre" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                onClick={() => handleGenreSelect(null)}
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
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleGenreSelect(tag)}
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
          )}

          {/* Producer Filter */}
          {activeFilterType === "producer" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                onClick={() => handleProducerSelect(null)}
                className={cn(
                  "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                  !selectedProducer
                    ? "bg-orange-500 text-white"
                    : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                All Producers
                <span className="ml-1 text-xs opacity-70">({totalBeats})</span>
              </button>
              {allProducers.map((producer) => (
                <button
                  key={producer}
                  onClick={() => handleProducerSelect(producer)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                    selectedProducer === producer
                      ? "bg-orange-500 text-white"
                      : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  {producer}
                  <span className="ml-1 text-xs opacity-70">({producerCounts[producer] || 0})</span>
                </button>
              ))}
            </div>
          )}

          {/* Price Filter */}
          {activeFilterType === "price" && (
            <div className="space-y-4 pb-16">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePriceSelect(null)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                    !selectedPriceRange
                      ? "bg-orange-500 text-white"
                      : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  )}
                >
                  Any Price
                </button>
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePriceSelect(range)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                      selectedPriceRange?.label === range.label
                        ? "bg-orange-500 text-white"
                        : "border border-border bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              {/* Custom Price Range */}
              <div className="rounded-xl border border-border bg-secondary/50 p-4">
                <p className="mb-3 text-sm font-medium text-foreground">Custom Range</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-muted-foreground">Min (GH₵)</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                      id="customMinPrice"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">–</span>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-muted-foreground">Max (GH₵)</label>
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                      id="customMaxPrice"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const minInput = document.getElementById("customMinPrice") as HTMLInputElement;
                    const maxInput = document.getElementById("customMaxPrice") as HTMLInputElement;
                    const min = parseFloat(minInput?.value) || 0;
                    const max = parseFloat(maxInput?.value) || 1000;
                    if (min >= 0 && max > min) {
                      handlePriceSelect({ label: `GH₵${min} - GH₵${max}`, min, max });
                    }
                  }}
                  className="mt-3 w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600"
                >
                  Apply Custom Range
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <div className="border-t border-border px-4 py-3">
            <button
              onClick={() => {
                onGenreSelect(null);
                onProducerSelect(null);
                onPriceRangeSelect(null);
                onClose();
              }}
              className="w-full rounded-lg bg-secondary py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Export price ranges for use in Browse page
export { priceRanges };
export type { PriceRange };

// Keep the old GenreFilter for backwards compatibility
export const GenreFilter = BeatFilter;
