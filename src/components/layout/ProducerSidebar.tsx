import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Music2,
  DollarSign,
  Wallet,
  BarChart2,
  Settings,
  ArrowLeft,
  X,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const producerNav = [
  { name: "Overview", icon: Home, path: "/producer/dashboard" },
  { name: "My Beats", icon: Music2, path: "/producer/beats" },
  { name: "Sales & Earnings", icon: DollarSign, path: "/producer/sales" },
  { name: "Payouts & Wallet", icon: Wallet, path: "/producer/payouts" },
  { name: "Analytics", icon: BarChart2, path: "/producer/analytics" },
  { name: "Licensing Settings", icon: Settings, path: "/producer/settings" },
];

interface ProducerSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ProducerSidebar = ({ isOpen, onClose }: ProducerSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[65] flex w-64 flex-col border-r border-border bg-background px-6 py-8 transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand Logo & Close Button */}
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground leading-none">
                EasyBeats
              </span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
                Producer Studio
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-secondary md:hidden"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto">
          {/* Action Button: Upload */}
          <div>
            <Link
              to="/producer/upload"
              onClick={onClose}
              className="group flex w-full items-center gap-3 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 px-4 py-3 text-sm font-bold text-orange-500 transition-all hover:from-orange-500 hover:to-orange-600 hover:text-white shadow-sm shadow-orange-500/5 active:scale-[0.98]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
                <UploadCloud className="h-4 w-4" />
              </div>
              Upload Beat
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col gap-2">
            <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
              Studio Menu
            </h3>
            {producerNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground",
                    isActive
                      ? "bg-secondary text-foreground animate-pulse-subtle"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-orange-500"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Footer Navigation (Back to main store) */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <Link
              to="/home"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:-translate-x-1" />
              Back to Store
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
