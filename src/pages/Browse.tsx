import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Filter, Music, User, DollarSign, Loader2 } from "lucide-react";
import { BeatCard } from "@/components/shared/BeatCard";
import { BeatFilter, type PriceRange } from "@/components/shared/GenreFilter";
import { cn } from "@/lib/utils";
import { useBeatsStore } from "@/store/beatsStore";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  
  const { beats, isLoading, fetchBeats, fetchProducers, producers } = useBeatsStore();
  
  // Get filters from URL
  const selectedGenre = searchParams.get("genre");
  const selectedProducer = searchParams.get("producer");
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    // Fetch producers for the filter list if not already loaded
    fetchProducers();
  }, [fetchProducers]);

  useEffect(() => {
    // Fetch beats based on current URL params
    const params: Record<string, any> = {};
    if (selectedGenre) params.genre = selectedGenre;
    if (selectedProducer) params.producer = selectedProducer;
    if (searchQuery) params.search = searchQuery;
    
    // For price range, we'll handle it client-side for now or add to API later
    // Current backend doesn't have explicit price filter (though it has applyFilters)
    
    fetchBeats(params);
  }, [selectedGenre, selectedProducer, searchQuery, fetchBeats]);

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
                {searchQuery ? `Search: ${searchQuery}` : activeFiltersCount > 0 ? "Filtered Beats" : "Browse All Beats"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading ? "Finding beats..." : `${beats.length} ${beats.length === 1 ? "beat" : "beats"} found`}
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
                  {["Trap", "Hip Hop", "R&B", "Electronic", "Lo-Fi", "Pop", "Drill", "Synthwave"].map((tag) => (
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
                  {producers.map((producer) => (
                    <button
                      key={producer.id}
                      onClick={() => handleProducerSelect(producer.username)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selectedProducer === producer.username 
                          ? "bg-orange-500 text-white" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {producer.displayName}
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
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : beats.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in duration-500">
                {beats.map((beat) => (
                  <BeatCard key={beat.id} beat={beat} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                <p className="mb-2 text-lg font-bold text-foreground">No beats found</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  No beats match your current search or filters.
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
        allTags={["Trap", "Hip Hop", "R&B", "Electronic", "Lo-Fi", "Pop", "Drill", "Synthwave"]}
        tagCounts={{}}
        selectedProducer={selectedProducer}
        onProducerSelect={handleProducerSelect}
        allProducers={producers.map(p => p.username)}
        producerCounts={{}}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeSelect={handlePriceRangeSelect}
        totalBeats={beats.length}
      />
    </div>
  );
};

export default Browse;
