import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50",
          {
            // Variants
            "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99]":
              variant === "primary",
            "border border-border bg-card text-foreground hover:bg-secondary hover:text-foreground active:bg-secondary/80":
              variant === "secondary",
            "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-foreground":
              variant === "outline",
            "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/20 active:bg-red-700":
              variant === "danger",
            "text-muted-foreground hover:bg-secondary hover:text-foreground":
              variant === "ghost",
            // Sizes
            "px-4 py-2 text-xs": size === "sm",
            "px-6 py-3 text-sm": size === "md",
            "px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
