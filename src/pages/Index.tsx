import { Flame, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { GenreGrid } from "@/components/home/GenreGrid";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BeatCard } from "@/components/shared/BeatCard";
import { featuredBeats, trendingBeats, genres } from "@/data/beats";

const Index = () => {
  // We can derive "New Releases" from trending for now, or shuffle them
  // For this demo, I'll just slice the trending array differently to fake variety
  const newReleases = [...trendingBeats].reverse();

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
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      </section>

      {/* Genres Section */}
      <section className="space-y-6">
        <SectionHeader 
          title="Browse by Genre" 
          subtitle="Find beats that match your style"
          actionHref="/browse"
        />
        <GenreGrid genres={genres} />
      </section>

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
            <BeatCard key={`new-${beat.id}`} beat={beat} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
