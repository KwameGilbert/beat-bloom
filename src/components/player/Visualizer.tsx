import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VisualizerProps {
  isPlaying: boolean;
  className?: string;
  count?: number;
  color?: string;
  isStatic?: boolean;
}

export const Visualizer = ({ 
  isPlaying, 
  className, 
  count = 40,
  color = "bg-orange-500",
  isStatic = false 
}: VisualizerProps) => {
  return (
    <div className={cn("flex items-end gap-0.5 overflow-hidden", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={isPlaying && !isStatic ? { 
            height: [
              `${Math.random() * 20 + 10}%`, 
              `${Math.random() * 70 + 30}%`, 
              `${Math.random() * 20 + 10}%`
            ] 
          } : { 
            height: "15%" 
          }}
          transition={isPlaying && !isStatic ? { 
            duration: 1.5 + Math.random() * 1.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          } : { 
            duration: 0.5 
          }}
          className={cn("flex-1 rounded-t-full transition-colors", color)}
          style={{ 
            opacity: 0.2 + (Math.random() * 0.3) 
          }}
        />
      ))}
    </div>
  );
};
