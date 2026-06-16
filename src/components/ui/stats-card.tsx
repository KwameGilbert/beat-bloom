import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "compact";
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, icon, change, changeLabel, trend, variant = "default", ...props }, ref) => {
    const computedTrend = trend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral");
    const isCompact = variant === "compact";

    return (
      <Card 
        ref={ref} 
        className={cn(
          "relative overflow-hidden group border transition-all duration-300",
          isCompact 
            ? "border-border/80 bg-card/40 backdrop-blur-md hover:bg-card/60 shadow-sm" 
            : "border-border/60 bg-card/60 backdrop-blur-md hover:border-border/80 shadow-md",
          className
        )} 
        {...props}
      >
        {/* Glow Accent - only for default variant */}
        {!isCompact && (
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl transition-all duration-500 group-hover:bg-orange-500/10" />
        )}

        <CardContent className={isCompact ? "p-4" : "p-6"}>
          <div className="flex items-center justify-between">
            <span className={cn(
              "font-bold uppercase tracking-wider text-muted-foreground",
              isCompact ? "text-[10px]" : "text-xs"
            )}>
              {title}
            </span>
            {icon && (
              <div className={cn(
                "flex items-center justify-center rounded-lg transition-colors duration-300 shrink-0",
                isCompact 
                  ? "h-8 w-8 bg-orange-500/5 text-orange-500/80 group-hover:bg-orange-500/10" 
                  : "h-10 w-10 bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
              )}>
                {icon}
              </div>
            )}
          </div>

          <div className={isCompact ? "mt-1.5" : "mt-4"}>
            <h3 className={cn(
              "font-black tracking-tight text-foreground",
              isCompact ? "text-lg" : "text-2xl sm:text-3xl"
            )}>
              {value}
            </h3>
          </div>

          {(change !== undefined || changeLabel) && (
            <div className={cn(
              "flex items-center flex-wrap text-muted-foreground",
              isCompact ? "mt-2 gap-1 text-[10px]" : "mt-3 gap-1.5 text-xs"
            )}>
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center font-bold rounded shrink-0",
                    isCompact ? "px-1 py-0.5 text-[9px]" : "px-1.5 py-0.5 text-xs",
                    {
                      "bg-emerald-500/10 text-emerald-500": computedTrend === "up",
                      "bg-rose-500/10 text-rose-500": computedTrend === "down",
                      "bg-secondary text-muted-foreground": computedTrend === "neutral",
                    }
                  )}
                >
                  {computedTrend === "up" && <ArrowUpRight className={cn("shrink-0", isCompact ? "mr-0.5 h-2.5 w-2.5" : "mr-0.5 h-3.5 w-3.5")} />}
                  {computedTrend === "down" && <ArrowDownRight className={cn("shrink-0", isCompact ? "mr-0.5 h-2.5 w-2.5" : "mr-0.5 h-3.5 w-3.5")} />}
                  {computedTrend === "neutral" && <Minus className={cn("shrink-0", isCompact ? "mr-0.5 h-2.5 w-2.5" : "mr-0.5 h-3.5 w-3.5")} />}
                  {Math.abs(change)}%
                </span>
              )}
              {changeLabel && (
                <span className="text-muted-foreground/80 truncate">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };
