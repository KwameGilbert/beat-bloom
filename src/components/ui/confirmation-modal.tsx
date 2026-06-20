import { ReactNode } from "react";
import { X, AlertTriangle, LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  icon?: LucideIcon;
  variant?: "danger" | "warning" | "info" | "success";
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  icon: Icon = AlertTriangle,
  variant = "warning",
  isLoading = false,
}: ConfirmationModalProps) => {
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  // Variant styling classes map
  const variantStyles = {
    danger: {
      iconBg: "bg-red-500/10 text-red-500 border-red-500/20",
      confirmBtn: "bg-red-500 hover:bg-red-600 shadow-red-500/15 text-white focus:ring-red-500/30",
    },
    warning: {
      iconBg: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      confirmBtn: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/15 text-white focus:ring-orange-500/30",
    },
    info: {
      iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      confirmBtn: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/15 text-white focus:ring-blue-500/30",
    },
    success: {
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      confirmBtn: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/15 text-white focus:ring-emerald-500/30",
    },
  };

  const activeStyles = variantStyles[variant] || variantStyles.warning;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl z-10 text-left font-sans"
          >
            {/* Close Icon Button */}
            <button
              onClick={handleCancel}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Icon + Title/Desc Row */}
            <div className="flex items-start gap-3 mt-1">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full border", activeStyles.iconBg)}>
                <Icon className="h-5 w-5 animate-pulse-slow" />
              </div>
              <div className="space-y-1.5 min-w-0">
                <h3 className="font-display font-bold text-lg text-foreground truncate">{title}</h3>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex justify-end gap-3 mt-6 border-t border-border/40 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="text-xs font-semibold px-4 py-2 border-border/80 hover:bg-secondary animate-scale-click"
              >
                {cancelLabel}
              </Button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "rounded-xl font-bold text-xs px-5 py-2.5 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none animate-scale-click",
                  activeStyles.confirmBtn
                )}
              >
                {isLoading ? (
                  <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : null}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
