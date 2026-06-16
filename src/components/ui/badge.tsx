import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "orange" | "green" | "red" | "blue" | "gray" | "outline";
}

function Badge({ className, variant = "gray", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors select-none",
        {
          "bg-orange-500/10 text-orange-500 border border-orange-500/20": variant === "orange",
          "bg-green-500/10 text-green-500 border border-green-500/20": variant === "green",
          "bg-red-500/10 text-red-500 border border-red-500/20": variant === "red",
          "bg-blue-500/10 text-blue-500 border border-blue-500/20": variant === "blue",
          "bg-secondary text-muted-foreground border border-border": variant === "gray",
          "border border-border text-foreground bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
