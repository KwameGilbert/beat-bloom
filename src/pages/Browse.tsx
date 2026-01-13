import { useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { featuredBeats, trendingBeats } from "@/data/beats";
import { BeatCard } from "@/components/shared/BeatCard";
import { GenreFilter } from "@/components/shared/GenreFilter";
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

  // Calculate tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach(tag => {
      counts[tag] = allBeats.filter(b => b.tags.includes(tag)).length;
    });
    
    return counts;
  }, [allTags]);

  // Filter beats based on genre
  const filteredBeats = useMemo(() => {
    let beats = allBeats;
    
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                {selectedGenre ? `${selectedGenre} Beats` : "Browse All Beats"}
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
                selectedGenre 
                  ? "border-orange-500 bg-orange-500/20 text-orange-500" 
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
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
          {/* Desktop Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
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
                {/* All Genres */}
                <button
                  onClick={() => handleGenreSelect(null)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    !selectedGenre 
                      ? "bg-orange-500 text-white" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  All Genres
                  <span className="ml-2 text-xs opacity-60">({allBeats.length})</span>
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
          </aside>

          {/* Beat Grid */}
          <main className="flex-1 min-w-0">
            {/* Active Filter Badge - Mobile only */}
            {selectedGenre && (
              <div className="mb-4 flex items-center gap-2 lg:hidden">
                <span className="text-sm text-muted-foreground">Filtering by:</span>
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16">
                <p className="mb-2 text-lg font-bold text-foreground">No beats found</p>
                <p className="mb-4 text-sm text-muted-foreground">
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

      {/* Mobile Genre Filter Component */}
      <GenreFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedGenre={selectedGenre}
        onGenreSelect={handleGenreSelect}
        allTags={allTags}
        tagCounts={tagCounts}
        totalBeats={allBeats.length}
      />
    </div>
  );
};

export default Browse;
