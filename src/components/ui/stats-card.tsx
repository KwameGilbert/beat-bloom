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
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, icon, change, changeLabel, trend, ...props }, ref) => {
    const computedTrend = trend || (change !== undefined ? (change > 0 ? "up" : change < 0 ? "down" : "neutral") : "neutral");

    return (
      <Card ref={ref} className={cn("relative overflow-hidden group border border-border/60 bg-card/60 backdrop-blur-md", className)} {...props}>
        {/* Glow Accent */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl transition-all duration-500 group-hover:bg-orange-500/10" />

        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white duration-300">
                {icon}
              </div>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              {value}
            </h3>
          </div>

          {(change !== undefined || changeLabel) && (
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              {change !== undefined && (
                <span
                  className={cn(
                    "flex items-center font-bold px-1.5 py-0.5 rounded",
                    {
                      "bg-emerald-500/10 text-emerald-500": computedTrend === "up",
                      "bg-rose-500/10 text-rose-500": computedTrend === "down",
                      "bg-secondary text-muted-foreground": computedTrend === "neutral",
                    }
                  )}
                >
                  {computedTrend === "up" && <ArrowUpRight className="mr-0.5 h-3.5 w-3.5 shrink-0" />}
                  {computedTrend === "down" && <ArrowDownRight className="mr-0.5 h-3.5 w-3.5 shrink-0" />}
                  {computedTrend === "neutral" && <Minus className="mr-0.5 h-3.5 w-3.5 shrink-0" />}
                  {Math.abs(change)}%
                </span>
              )}
              {changeLabel && (
                <span className="text-muted-foreground/85">
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
