import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ProducerSidebar } from "./ProducerSidebar";
import { ProducerHeader } from "./ProducerHeader";
import { ToolkitSidebar, type StudioNotification } from "./ToolkitSidebar";

export const ProducerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState<StudioNotification[]>([
    {
      id: "1",
      title: "New Beat Sale!",
      message: "You sold 'Retro Wave' WAV Lease to artist Drake for $49.99.",
      time: "2 hours ago",
      type: "sale",
      read: false
    },
    {
      id: "2",
      title: "Payout Processed",
      message: "Weekly payout of $340.50 was sent to your Paypal wallet.",
      time: "1 day ago",
      type: "payout",
      read: false
    },
    {
      id: "3",
      title: "Collab Invitation",
      message: "Producer 'MetroBoomin' sent a collaboration request on 'Trap Banger'.",
      time: "2 days ago",
      type: "collab",
      read: true
    },
    {
      id: "4",
      title: "Beat Approved",
      message: "Your beat 'Chilled Out' was approved and is now live on the marketplace.",
      time: "3 days ago",
      type: "system",
      read: true
    }
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Custom Producer Sidebar */}
      <ProducerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <ProducerHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          onNotificationClick={() => setActivePanel(activePanel === "notifications" ? null : "notifications")}
          unreadNotificationsCount={unreadCount}
        />

        {/* Main Page Content */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toolkit Sidebar System (Gmail-like slim right sidebar with sliding panels) */}
      <ToolkitSidebar
        layoutDirection="vertical"
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
};

export default ProducerLayout;
