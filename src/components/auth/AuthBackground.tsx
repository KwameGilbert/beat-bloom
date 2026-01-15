import { motion } from "framer-motion";
import { 
  Music, 
  Mic2, 
  Headphones, 
  Disc, 
  Volume2, 
  Music2, 
  Radio, 
  Speaker, 
  Ear, 
  PlayCircle,
  Activity,
  Waves
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [
  { icon: Music, color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { icon: Mic2, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { icon: Headphones, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  { icon: Disc, color: "bg-green-500/10 text-green-500 border-green-500/20" },
  { icon: Volume2, color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { icon: Music2, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { icon: Radio, color: "bg-red-500/10 text-red-500 border-red-500/20" },
  { icon: Speaker, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { icon: Ear, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { icon: PlayCircle, color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
  { icon: Activity, color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  { icon: Waves, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
];

const SlidingColumn = ({ items, direction = "down", speed = 40 }: { items: typeof icons, direction?: "up" | "down", speed?: number }) => {
  return (
    <div className="flex flex-col gap-3 overflow-hidden h-full">
      <motion.div
        animate={{
          y: direction === "down" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-3"
      >
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className={cn(
              "flex aspect-square w-full items-center justify-center rounded-2xl shadow-sm border",
              item.color
            )}
          >
            <item.icon className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const AuthBackground = () => {
  // Fixed seeds for consistent background across navigations
  const cols = [
    [...icons].sort((a, b) => a.color.localeCompare(b.color)),
    [...icons].sort((a, b) => b.color.localeCompare(a.color)),
    [...icons].reverse(),
    [...icons],
  ];

  return (
    <div className="absolute inset-0 z-0 flex gap-3 px-3 pt-3 overflow-hidden">
      {cols.map((colItems, i) => (
        <div key={i} className="flex-1 min-w-0">
          <SlidingColumn 
              items={colItems} 
              direction={i % 2 === 0 ? "down" : "up"} 
              speed={35 + (i * 2)} 
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
    </div>
  );
};
