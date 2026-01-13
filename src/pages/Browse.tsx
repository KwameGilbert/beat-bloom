import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { featuredBeats, trendingBeats } from "@/data/beats";
import { BeatCard } from "@/components/shared/BeatCard";
import { cn } from "@/lib/utils";

const allBeats = [...featuredBeats, ...trendingBeats];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get genre from URL
  const selectedGenre = searchParams.get("genre");
  
  // Get unique tags from all beats
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allBeats.forEach(beat => {
      beat.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter beats based on genre
  const filteredBeats = useMemo(() => {
    let beats = allBeats;
    
    // Filter by genre/tag
    if (selectedGenre) {
      beats = beats.filter(beat => 
        beat.tags.some(tag => tag.toLowerCase() === selectedGenre.toLowerCase())
      );
    }
    
    return beats;
  }, [selectedGenre]);

  const handleGenreSelect = (genre: string | null) => {
    if (genre) {
      setSearchParams({ genre });
    } else {
      setSearchParams({});
    }
    setIsFilterOpen(false); // Close mobile filter after selection
  };

  // Filter Content Component (reused for both mobile and desktop)
  const FilterContent = () => (
    <>
      {/* All Genres Option */}
      <button
        onClick={() => handleGenreSelect(null)}
        className={cn(
          "rounded-lg px-3 py-2 text-left text-sm transition-colors",
          !selectedGenre 
            ? "bg-orange-500 text-white" 
            : "text-zinc-400 hover:bg-white/5 hover:text-white"
        )}
      >
        All Genres
        <span className="ml-2 text-xs opacity-60">({allBeats.length})</span>
      </button>
      
      {/* Dynamic Tags from Beats */}
      {allTags.map((tag) => {
        const count = allBeats.filter(b => b.tags.includes(tag)).length;
        return (
          <button
            key={tag}
            onClick={() => handleGenreSelect(tag)}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm transition-colors",
              selectedGenre === tag 
                ? "bg-orange-500 text-white" 
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {tag}
            <span className="ml-2 text-xs opacity-60">({count})</span>
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                {selectedGenre ? `${selectedGenre} Beats` : "Browse All Beats"}
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                {filteredBeats.length} {filteredBeats.length === 1 ? "beat" : "beats"} found
              </p>
            </div>
            
            {/* Mobile Filter Button - Hidden on desktop */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors lg:hidden",
                selectedGenre 
                  ? "border-orange-500 bg-orange-500/20 text-orange-500" 
                  : "border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              <Filter className="h-4 w-4" />
              {selectedGenre || "Filter"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar - Hidden on mobile */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Filter className="h-4 w-4" />
                  Filter by Genre
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
              
              <div className="flex flex-col gap-1">
                <FilterContent />
              </div>
            </div>
          </aside>

          {/* Beat Grid */}
          <main className="flex-1 min-w-0">
            {/* Active Filter Badge - Mobile only */}
            {selectedGenre && (
              <div className="mb-4 flex items-center gap-2 lg:hidden">
                <span className="text-sm text-zinc-400">Filtering by:</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-500">
                  {selectedGenre}
                  <button 
                    onClick={() => handleGenreSelect(null)}
                    className="ml-1 hover:text-orange-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}

            {filteredBeats.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {filteredBeats.map((beat) => (
                  <BeatCard key={beat.id} beat={beat} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16">
                <p className="mb-2 text-lg font-bold text-white">No beats found</p>
                <p className="mb-4 text-sm text-zinc-400">
                  No beats match the "{selectedGenre}" genre.
                </p>
                <button
                  onClick={() => handleGenreSelect(null)}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Slide-Up Filter Panel - Only visible on mobile */}
      <div 
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out lg:hidden",
          isFilterOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Backdrop */}
        {isFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
        )}
        
        {/* Panel */}
        <div className="relative max-h-[60vh] overflow-y-auto rounded-t-2xl border-t border-white/10 bg-zinc-900 px-4 pb-6 pt-3 shadow-2xl">
          {/* Handle */}
          <div className="mb-3 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-zinc-700" />
          </div>
          
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-white">
              <Filter className="h-4 w-4 text-orange-500" />
              Filter by Genre
            </h2>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Genre Options */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {/* All Genres Option */}
            <button
              onClick={() => handleGenreSelect(null)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                !selectedGenre 
                  ? "bg-orange-500 text-white" 
                  : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
              )}
            >
              All Genres
              <span className="ml-1 text-xs opacity-70">({allBeats.length})</span>
            </button>
            
            {/* Dynamic Tags from Beats */}
            {allTags.map((tag) => {
              const count = allBeats.filter(b => b.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => handleGenreSelect(tag)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                    selectedGenre === tag 
                      ? "bg-orange-500 text-white" 
                      : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
