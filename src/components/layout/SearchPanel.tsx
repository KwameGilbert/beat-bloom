import { Music, Users, Clock, X, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { type Beat, type Producer } from "@/lib/marketplace";

interface SearchPanelProps {
  searchQuery: string;
  filteredBeats: Beat[];
  filteredProducers: Producer[];
  recentSearches: string[];
  onResultClick: (path: string) => void;
  onRecentClick: (query: string) => void;
  onClearRecent: (query: string) => void;
}

export const SearchPanel = ({ 
  searchQuery, 
  filteredBeats, 
  filteredProducers, 
  recentSearches,
  onResultClick,
  onRecentClick,
  onClearRecent
}: SearchPanelProps) => {
  const isQueryEmpty = searchQuery.trim() === "";
  const hasResults = !isQueryEmpty && (filteredBeats.length > 0 || filteredProducers.length > 0);
  const showRecent = isQueryEmpty && recentSearches.length > 0;

  if (isQueryEmpty && recentSearches.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed sm:absolute top-[72px] sm:top-[calc(100%+8px)] left-4 right-4 sm:left-0 sm:right-0 z-[100] sm:translate-x-0 max-h-[85vh] overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl"
    >
      <div className="overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-muted">
        {/* Recent Searches Section */}
        {showRecent && (
          <div className="py-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                Recent Searches
              </span>
            </div>
            <div className="space-y-1">
              {recentSearches.map((query, index) => (
                <div
                  key={`${query}-${index}`}
                  className="group flex items-center justify-between rounded-xl px-3 py-2 transition-all hover:bg-secondary/80"
                >
                  <button
                    onClick={() => onRecentClick(query)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{query}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearRecent(query);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-red-500 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Sections */}
        {!isQueryEmpty && (
          <>
            {!hasResults ? (
              <div className="p-12 text-center">
                <SearchIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  No matches for <span className="font-bold text-foreground">"{searchQuery}"</span>
                </p>
              </div>
            ) : (
              <div className="space-y-6 py-2">
                {/* Beats Section */}
                {filteredBeats.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      <Music className="h-3 w-3" />
                      <span>Beats</span>
                    </div>
                    <div className="space-y-1">
                      {filteredBeats.map((beat) => (
                        <button
                          key={beat.id}
                          onClick={() => onResultClick(`/beat/${beat.id}`)}
                          className="flex items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-secondary/80 group"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm group-hover:shadow-md transition-all">
                            <img src={beat.coverImage} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-orange-500">
                              {beat.title}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {beat.producerName} • {beat.bpm} BPM
                            </p>
                          </div>
                          <div className="text-xs font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                            ${beat.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Producers Section */}
                {filteredProducers.length > 0 && (
                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      <Users className="h-3 w-3" />
                      <span>Artists</span>
                    </div>
                    <div className="space-y-1 px-1">
                      {filteredProducers.map((producer) => (
                        <button
                          key={producer.id}
                          onClick={() => onResultClick(`/producer/${producer.username}`)}
                          className="flex items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-secondary/80 group"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted shadow-sm group-hover:shadow-md transition-all">
                            <img src={producer.avatar} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-orange-500">
                              {producer.displayName}
                            </p>
                            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              Artist {producer.isVerified && (
                                <span className="inline-block h-3 w-3 fill-blue-500 text-blue-500">
                                  <svg viewBox="0 0 24 24" className="fill-current"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-3.3-3.3 1.4-1.4 1.9 1.9 4.3-4.3 1.4 1.4-5.7 5.7z"/></svg>
                                </span>
                              )}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Panel Footer */}
      {hasResults && (
        <div className="border-t border-border/50 bg-secondary/30 p-2 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Live Global Results
          </p>
        </div>
      )}
    </motion.div>
  );
};
