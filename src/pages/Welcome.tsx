import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Music2, ChevronRight } from "lucide-react";

const panelTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 100,
  mass: 1.2,
};

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      key="welcome-panel"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={panelTransition}
      className="relative z-20 flex min-h-[500px] w-full flex-col items-center rounded-t-[40px] bg-background px-8 pt-10 pb-8 shadow-[0_-20px_60px_-12px_rgba(0,0,0,0.2)] md:rounded-[40px] md:max-w-[450px] md:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.2)]"
    >
      <div className="absolute top-4 h-1.5 w-12 rounded-full bg-secondary md:hidden" />

      <div className="mb-12 flex flex-col items-center text-center">
          <motion.div 
              layoutId="auth-logo"
              transition={panelTransition}
              className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl shadow-orange-500/40"
          >
              <Music2 className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h1 
              layoutId="auth-title"
              transition={panelTransition}
              className="mt-8 font-display text-4xl font-bold tracking-tight text-foreground"
          >
              BeatBloom
          </motion.h1>
          <motion.p 
              layoutId="auth-subtitle"
              transition={panelTransition}
              className="mt-3 text-balance text-lg font-medium text-muted-foreground px-4"
          >
              Your journey into the future of sound starts here.
          </motion.p>
      </div>

      <div className="mt-auto w-full space-y-4">
        <button
          onClick={() => navigate("/signup")}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-900 active:scale-95 shadow-lg dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
        >
          Get Started
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
        
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 text-sm font-bold text-foreground transition-all hover:bg-secondary active:scale-95"
        >
          Log In
        </button>
      </div>

      <p className="mt-8 text-[11px] text-center text-muted-foreground px-8 leading-relaxed opacity-60">
          Experience premium beat delivery and discovery.
      </p>
    </motion.div>
  );
};

export default Welcome;
