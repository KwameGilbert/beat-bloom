import { Link } from "react-router-dom";
import type { Genre } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

// Default colors for genres
const genreColors = [
  "bg-orange-700/80 hover:bg-orange-600/80",
  "bg-purple-700/80 hover:bg-purple-600/80",
  "bg-blue-700/80 hover:bg-blue-600/80",
  "bg-emerald-700/80 hover:bg-emerald-600/80",
  "bg-yellow-700/80 hover:bg-yellow-600/80",
  "bg-pink-700/80 hover:bg-pink-600/80",
];

interface GenreGridProps {
  genres: Genre[];
}

export const GenreGrid = ({ genres }: GenreGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {genres.map((genre, index) => (
        <Link
          key={genre.id}
          to={`/browse?genre=${genre.slug}`}
          className={cn(
            "group relative flex h-24 flex-col items-center justify-center overflow-hidden rounded-lg p-4 text-center transition-all hover:scale-105 hover:shadow-lg",
            genreColors[index % genreColors.length]
          )}
        >
           {/* Abstract Circle Decoration */}
           <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
           <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-black/10 blur-xl" />

           <span className="relative z-10 text-lg font-bold text-white">{genre.name}</span>
           <span className="relative z-10 text-xs font-medium text-white/80">{genre.beatCount || 0} beats</span>
        </Link>
      ))}
    </div>
  );
};
