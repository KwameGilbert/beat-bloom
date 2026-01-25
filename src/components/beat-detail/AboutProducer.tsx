import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import type { Beat } from "./types";

interface AboutProducerProps {
  beat: Beat;
  producerName: string;
}

export const AboutProducer = ({ beat, producerName }: AboutProducerProps) => {
  if (!beat.producerBio) return null;

  return (
    <div className="mt-8 md:mt-12">
      <h2 className="mb-4 md:mb-6 font-display text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
        About Producer
      </h2>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-start md:gap-8">
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-orange-500/20">
              <img
                src={beat.producerAvatar || "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&q=80"}
                alt={producerName}
                className="h-full w-full object-cover"
              />
              {beat.isProducerVerified && (
                <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-center md:justify-start gap-3">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                  {producerName}
                </h3>
                {beat.isProducerVerified && (
                  <CheckCircle className="h-6 w-6 text-orange-500" />
                )}
              </div>
            </div>

            <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {beat.producerBio}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              to={`/producer/${beat.producerUsername || beat.producerId}`}
              className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 text-sm sm:text-base font-bold text-foreground transition-all hover:bg-secondary/80"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
