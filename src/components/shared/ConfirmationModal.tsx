import { X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info"
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[201] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 fade-in duration-300">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-secondary/30">
            <div className="flex items-center gap-2">
              <AlertCircle className={cn(
                "h-5 w-5",
                variant === "danger" ? "text-red-500" : 
                variant === "warning" ? "text-orange-500" : 
                "text-blue-500"
              )} />
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-border bg-secondary/10 p-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-95",
                variant === "danger" ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20" : 
                variant === "warning" ? "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20" : 
                "bg-foreground text-background hover:opacity-90 shadow-lg shadow-foreground/10"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
