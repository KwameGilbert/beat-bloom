import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { PlayerBar } from "@/components/player/PlayerBar";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentBeat } = usePlayerStore();

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main 
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300",
            // Mobile: Nav (16) + Spacing (4) -> Base pb-20. 
            // If player: Nav (16) + Player (16) + Spacing (4) -> pb-36
            currentBeat ? "pb-36 md:pb-24" : "pb-20 md:pb-0"
          )}
        >
          <Outlet />
        </main>
      </div>
      <PlayerBar />
      <BottomNav />
    </div>
  );
};
