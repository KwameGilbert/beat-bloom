import { useRef } from "react";
import { FileAudio, Check, Upload as UploadIcon, ToggleLeft, ToggleRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LicenseTier } from "./types";

interface LicenseTierCardProps {
  type: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tier: LicenseTier;
  onToggle: () => void;
  onPriceChange: (price: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  colorScheme?: "orange" | "purple";
  uploadPlaceholder?: string;
}

export const LicenseTierCard = ({
  type,
  title,
  subtitle,
  icon: Icon,
  tier,
  onToggle,
  onPriceChange,
  onFileChange,
  accept,
  colorScheme = "orange",
  uploadPlaceholder
}: LicenseTierCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPurple = colorScheme === "purple";

  return (
    <div className={cn(
      "rounded-2xl border-2 p-4 transition-all",
      tier.enabled 
        ? (isPurple ? "border-purple-500/50 bg-purple-500/5" : "border-orange-500/50 bg-orange-500/5")
        : "border-border bg-secondary/20"
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            tier.enabled 
              ? (isPurple ? "bg-purple-500/20 text-purple-500" : "bg-orange-500/20 text-orange-500")
              : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">{title}</h3>
              {isPurple && <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-500">Premium</span>}
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <span className="text-lg font-bold text-muted-foreground">$</span>
            <input
              type="number"
              value={tier.price}
              onChange={(e) => onPriceChange(e.target.value)}
              disabled={!tier.enabled}
              className="w-24 rounded-xl border border-border bg-secondary/50 px-3 py-2 text-lg font-bold text-center disabled:opacity-50"
            />
          </div>
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {tier.enabled 
              ? <ToggleRight className={cn("h-8 w-8", isPurple ? "text-purple-500" : "text-orange-500")} /> 
              : <ToggleLeft className="h-8 w-8" />
            }
          </button>
        </div>
      </div>

      {tier.enabled && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border border-dashed border-border p-3 cursor-pointer transition-all hover:border-orange-500/50 hover:bg-orange-500/5",
              tier.file && "border-solid border-green-500/30 bg-green-500/5"
            )}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept={accept} onChange={onFileChange} />
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary",
                tier.file && "bg-green-500 text-white"
              )}>
                {tier.file ? <Check className="h-4 w-4" /> : <UploadIcon className="h-4 w-4" />}
              </div>
              <span className="text-sm font-medium truncate">
                {tier.file ? tier.file.name : uploadPlaceholder}
              </span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">
              {tier.file ? "Change" : "Browse"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
