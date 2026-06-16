import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ProducerSidebar } from "./ProducerSidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";

export const ProducerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Custom Producer Sidebar */}
      <ProducerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProducerLayout;
