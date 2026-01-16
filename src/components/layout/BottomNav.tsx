import { Home, Search, BarChart2, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { name: "Home", icon: Home, path: "/home" },
  { name: "Browse", icon: Search, path: "/browse" },
  { name: "Charts", icon: BarChart2, path: "/charts" },
  { name: "Liked", icon: Heart, path: "/liked" },
  { name: "Profile", icon: User, path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/50 bg-background/60 px-2 backdrop-blur-xl md:hidden">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-[10px] font-medium transition-colors",
              isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "text-orange-500")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
