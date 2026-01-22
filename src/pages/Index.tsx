import { useEffect } from "react";
import { Flame, Sparkles, Loader2 } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { GenreGrid } from "@/components/home/GenreGrid";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BeatCard } from "@/components/shared/BeatCard";
import { useBeatsStore } from "@/store/beatsStore";

const Index = () => {
  const { trendingBeats, genres, isLoading, fetchHomePage } = useBeatsStore();

  useEffect(() => {
    fetchHomePage();
  }, [fetchHomePage]);

  // For featured, we'll just use the first few trending for now until we have a featured endpoint
  const featuredBeats = trendingBeats.slice(0, 3);
  const newReleases = [...trendingBeats].reverse().slice(0, 6);

  if (isLoading && trendingBeats.length === 0) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-12 p-6 md:p-8 pb-20">
      {/* Hero Section */}
      <section>
        <HeroCarousel beats={featuredBeats} />
      </section>

      {/* Trending Section */}
      <section className="space-y-6">
        <SectionHeader 
          title="Trending Now" 
          subtitle="The hottest beats this week"
          icon={Flame}
          actionHref="/charts"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {trendingBeats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} playlist={trendingBeats} />
          ))}
        </div>
      </section>

      {/* Genres Section */}
      {genres.length > 0 && (
        <section className="space-y-6">
          <SectionHeader 
            title="Browse by Genre" 
            subtitle="Find beats that match your style"
            actionHref="/browse"
          />
          <GenreGrid genres={genres} />
        </section>
      )}

      {/* New Releases Section */}
      <section className="space-y-6">
        <SectionHeader 
          title="New Releases" 
          subtitle="Fresh beats just dropped"
          icon={Sparkles}
          actionHref="/browse?sort=newest"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {newReleases.map((beat) => (
            <BeatCard key={`new-${beat.id}`} beat={beat} playlist={newReleases} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
