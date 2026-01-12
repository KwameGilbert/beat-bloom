import { Flame, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export const SectionHeader = ({ 
  title, 
  subtitle, 
  icon: Icon,
  actionLabel = "View All", 
  actionHref,
  className
}: SectionHeaderProps) => {
  return (
    <div className={cn("flex flex-col justify-between gap-4 md:flex-row md:items-end", className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="rounded-lg bg-orange-500/10 p-2">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
        )}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      {actionHref && (
        <Link 
          to={actionHref} 
          className="group flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          {actionLabel}
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};
