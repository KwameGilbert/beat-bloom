import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { AuthBackground } from "../auth/AuthBackground";

export const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background - In the shadows */}
      <div className="absolute inset-0 opacity-20 scale-110 blur-[1px]">
        <AuthBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      </div>
      <div className="relative flex items-center justify-center">
        {/* Pulsing background glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Logo Container */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-orange-600 shadow-2xl shadow-primary/20"
        >
          <Music className="h-12 w-12 text-white" />
        </motion.div>
      </div>

      {/* App Name */}
      <motion.div
        className="mt-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tighter text-foreground font-display">
          Beat<span className="text-primary">Bloom</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Rhythm of the Future
        </p>
      </motion.div>

      {/* Loading Progress Bar */}
      <motion.div
        className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};
