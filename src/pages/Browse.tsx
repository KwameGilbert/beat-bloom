import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Filter, X, Music, User, DollarSign } from "lucide-react";
import { featuredBeats, trendingBeats } from "@/data/beats";
import { BeatCard } from "@/components/shared/BeatCard";
import { BeatFilter, type PriceRange } from "@/components/shared/GenreFilter";
import { cn } from "@/lib/utils";

const allBeats = [...featuredBeats, ...trendingBeats];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  
  // Get filters from URL
  const selectedGenre = searchParams.get("genre");
  const selectedProducer = searchParams.get("producer");
  
  // Get unique tags from all beats
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allBeats.forEach(beat => {
      beat.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Get unique producers from all beats
  const allProducers = useMemo(() => {
    const producers = new Set<string>();
    allBeats.forEach(beat => producers.add(beat.producer));
    return Array.from(producers).sort();
  }, []);

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach(tag => {
      counts[tag] = allBeats.filter(b => b.tags.includes(tag)).length;
    });
    return counts;
  }, [allTags]);

  // Calculate producer counts
  const producerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducers.forEach(producer => {
      counts[producer] = allBeats.filter(b => b.producer === producer).length;
    });
    return counts;
  }, [allProducers]);

  // Filter beats based on all filters
  const filteredBeats = useMemo(() => {
    let beats = allBeats;
    
    if (selectedGenre) {
      beats = beats.filter(beat => 
        beat.tags.some(tag => tag.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    if (selectedProducer) {
      beats = beats.filter(beat => beat.producer === selectedProducer);
    }

    if (selectedPriceRange) {
      beats = beats.filter(beat => 
        beat.price >= selectedPriceRange.min && beat.price <= selectedPriceRange.max
      );
    }
    
    return beats;
  }, [selectedGenre, selectedProducer, selectedPriceRange]);

  const handleGenreSelect = (genre: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (genre) {
      params.set("genre", genre);
    } else {
      params.delete("genre");
    }
    setSearchParams(params);
  };

  const handleProducerSelect = (producer: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (producer) {
      params.set("producer", producer);
    } else {
      params.delete("producer");
    }
    setSearchParams(params);
  };

  const handlePriceRangeSelect = (range: PriceRange | null) => {
    setSelectedPriceRange(range);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedPriceRange(null);
  };

  // Count active filters
  const activeFiltersCount = [selectedGenre, selectedProducer, selectedPriceRange].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      {/* Header */}
      <div className="border-b border-border px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                {activeFiltersCount > 0 ? "Filtered Beats" : "Browse All Beats"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredBeats.length} {filteredBeats.length === 1 ? "beat" : "beats"} found
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:hidden",
                activeFiltersCount > 0
                  ? "border-orange-500 bg-orange-500/20 text-orange-500" 
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              )}
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 ? `${activeFiltersCount} Active` : "Filters"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Genre Filter */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Music className="h-4 w-4 text-orange-500" />
                    Genre
                  </h2>
                  {selectedGenre && (
                    <button 
                      onClick={() => handleGenreSelect(null)}
                      className="text-xs text-orange-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => handleGenreSelect(null)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      !selectedGenre 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleGenreSelect(tag)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedGenre === tag 
                          ? "bg-orange-500 text-white" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {tag}
                      <span className="ml-2 text-xs opacity-60">({tagCounts[tag]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Producer Filter */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <User className="h-4 w-4 text-orange-500" />
                    Producer
                  </h2>
                  {selectedProducer && (
                    <button 
                      onClick={() => handleProducerSelect(null)}
                      className="text-xs text-orange-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => handleProducerSelect(null)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      !selectedProducer 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    All
                  </button>
                  {allProducers.map((producer) => (
                    <button
                      key={producer}
                      onClick={() => handleProducerSelect(producer)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedProducer === producer 
                          ? "bg-orange-500 text-white" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {producer}
                      <span className="ml-2 text-xs opacity-60">({producerCounts[producer]})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    Price
                  </h2>
                  {selectedPriceRange && (
                    <button 
                      onClick={() => handlePriceRangeSelect(null)}
                      className="text-xs text-orange-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handlePriceRangeSelect(null)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      !selectedPriceRange 
                        ? "bg-orange-500 text-white" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    Any Price
                  </button>
                  {[
                    { label: "Under $30", min: 0, max: 29.99 },
                    { label: "$30 - $40", min: 30, max: 40 },
                    { label: "$40 - $50", min: 40, max: 50 },
                    { label: "Over $50", min: 50, max: 1000 },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => handlePriceRangeSelect(range)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedPriceRange?.label === range.label 
                          ? "bg-orange-500 text-white" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                  
                  {/* Custom Price Range */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Custom</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                        id="desktopMinPrice"
                      />
                      <span className="text-muted-foreground text-xs">–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none"
                        id="desktopMaxPrice"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const minInput = document.getElementById("desktopMinPrice") as HTMLInputElement;
                        const maxInput = document.getElementById("desktopMaxPrice") as HTMLInputElement;
                        const min = parseFloat(minInput?.value) || 0;
                        const max = parseFloat(maxInput?.value) || 1000;
                        if (min >= 0 && max > min) {
                          handlePriceRangeSelect({ label: `$${min} - $${max}`, min, max });
                        }
                      }}
                      className="mt-2 w-full rounded bg-orange-500 py-1.5 text-xs font-bold text-white hover:bg-orange-600"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Clear All */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full rounded-lg border border-border bg-secondary py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Beat Grid */}
          <main className="flex-1 min-w-0">
            {/* Active Filter Badges - Mobile only */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
                <span className="text-sm text-muted-foreground">Active:</span>
                {selectedGenre && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-500">
                    {selectedGenre}
                    <button onClick={() => handleGenreSelect(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedProducer && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-500">
                    {selectedProducer}
                    <button onClick={() => handleProducerSelect(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedPriceRange && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-500">
                    {selectedPriceRange.label}
                    <button onClick={() => handlePriceRangeSelect(null)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {filteredBeats.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {filteredBeats.map((beat) => (
                  <BeatCard key={beat.id} beat={beat} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                <p className="mb-2 text-lg font-bold text-foreground">No beats found</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  No beats match your current filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Component */}
      <BeatFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
        allTags={allTags}
        tagCounts={tagCounts}
        selectedProducer={selectedProducer}
        onProducerSelect={handleProducerSelect}
        allProducers={allProducers}
        producerCounts={producerCounts}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeSelect={handlePriceRangeSelect}
        totalBeats={allBeats.length}
      />
    </div>
  );
};

export default Browse;
