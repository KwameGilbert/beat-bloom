import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { PlayerBar } from "@/components/player/PlayerBar";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentBeat } = usePlayerStore();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main 
            className={cn(
              "transition-all duration-300",
              // Mobile: Nav (16) + Spacing (4) -> Base pb-20. 
              // If player: Nav (16) + Player (16) + Spacing (4) -> pb-36
              currentBeat ? "pb-36 md:pb-24" : "pb-20 md:pb-0"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <PlayerBar />
      <BottomNav />
    </div>
  );
};
