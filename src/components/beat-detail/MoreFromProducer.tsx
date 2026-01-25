import { Link } from "react-router-dom";
import { BeatCard } from "@/components/shared/BeatCard";

import { type Beat } from "@/lib/marketplace";

interface MoreFromProducerProps {
  producerName: string;
  producerLink: string;
  beats: Beat[];
}

export const MoreFromProducer = ({ producerName, producerLink, beats }: MoreFromProducerProps) => {
  if (beats.length === 0) return null;

  return (
    <div className="mt-12 md:mt-16">
      <div className="mb-4 md:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
          More from {producerName}
        </h2>
        <Link
          to={producerLink}
          className="text-xs sm:text-sm font-medium text-orange-500 hover:underline whitespace-nowrap"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {beats.map((producerBeat) => (
          <BeatCard key={producerBeat.id} beat={producerBeat} />
        ))}
      </div>
    </div>
  );
};
