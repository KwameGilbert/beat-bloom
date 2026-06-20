import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Calculator,
  HelpCircle,
  Settings,
  X,
  Trash2,
  DollarSign,
  Percent,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { showNotification } from "@/components/ui/custom-notification";

export const ToolkitSidebar = () => {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleIconClick = (panelName: string) => {
    if (activePanel === panelName) {
      setActivePanel(null);
    } else {
      setActivePanel(panelName);
    }
  };

  const handleClosePanel = () => {
    setActivePanel(null);
  };

  return (
    <div className="flex h-full shrink-0 select-none z-30">
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="h-full border-l border-border bg-card/95 backdrop-blur-md overflow-hidden shrink-0"
          >
            <div className="w-[280px] h-full p-5">
              {activePanel === "notes" && (
                <QuickNotesPanel onClose={handleClosePanel} />
              )}
              {activePanel === "calculator" && (
                <RevenueCalculatorPanel onClose={handleClosePanel} />
              )}
              {activePanel === "help" && (
                <SupportHelpPanel onClose={handleClosePanel} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="flex h-full w-12 flex-col items-center border-l border-border bg-card py-6 gap-6 z-40 hidden md:flex shrink-0">
        {/* Top tools section */}
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Upload Beat - Page Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/producer/upload"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 transition-all duration-200"
              >
                <UploadCloud className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Upload New Beat
            </TooltipContent>
          </Tooltip>

          {/* Separator line */}
          <div className="w-6 h-px bg-border/60" />

          {/* Quick Notes - Panel Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleIconClick("notes")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  activePanel === "notes"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <FileText className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Quick Notes
            </TooltipContent>
          </Tooltip>

          {/* Revenue Calculator - Panel Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleIconClick("calculator")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  activePanel === "calculator"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Calculator className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Earnings Calculator
            </TooltipContent>
          </Tooltip>

          {/* Help Center - Panel Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleIconClick("help")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  activePanel === "help"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Producer Support
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Bottom settings section */}
        <div className="mt-auto flex flex-col items-center gap-4 w-full">
          {/* Settings - Page Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/producer/settings"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Studio Settings
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </div>
  );
};

/* ==========================================================================
   PANEL COMPONENTS FOR THE SLIDING DRAWER
   ========================================================================== */

// 1. Quick Notes Panel Content
export const QuickNotesPanel = ({ onClose }: { onClose: () => void }) => {
  const [note, setNote] = useState(() => {
    return localStorage.getItem("easybeats-producer-notes") || "";
  });

  useEffect(() => {
    localStorage.setItem("easybeats-producer-notes", note);
  }, [note]);

  const clearNotes = () => {
    if (window.confirm("Are you sure you want to clear your notes?")) {
      setNote("");
      showNotification("Notes Cleared", "Your workspace notes have been cleared.", "info", 1500);
    }
  };

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-orange-500" />
          <h4 className="font-bold text-sm text-foreground">Studio Notes</h4>
        </div>
        <div className="flex items-center gap-1.5">
          {note && (
            <button
              onClick={clearNotes}
              className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-red-500 transition-colors"
              title="Clear Notes"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">
          Write down song ideas, lyrics, collab info, or track structures. Saves automatically!
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Start typing your ideas here..."
          className="flex-1 w-full rounded-xl border border-border/80 bg-secondary/10 p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-orange-500 focus:outline-none resize-none font-mono"
        />
      </div>
    </div>
  );
};

// 2. Earnings Calculator Panel Content
export const RevenueCalculatorPanel = ({ onClose }: { onClose: () => void }) => {
  const [listPrice, setListPrice] = useState<string>("29.99");
  const [licenseType, setLicenseType] = useState<"mp3" | "wav" | "stems" | "exclusive">("mp3");

  const platformFees = {
    mp3: 0.15,      // 15% Platform Commission
    wav: 0.15,      // 15%
    stems: 0.12,    // 12%
    exclusive: 0.10 // 10%
  };

  const calculated = (() => {
    const priceNum = parseFloat(listPrice) || 0;
    const rate = platformFees[licenseType];
    const feeAmount = priceNum * rate;
    const netAmount = priceNum - feeAmount;

    return {
      rate: rate * 100,
      fee: feeAmount,
      net: netAmount
    };
  })();

  return (
    <div className="h-full flex flex-col font-sans text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-orange-500" />
          <h4 className="font-bold text-sm text-foreground">Earnings Estimator</h4>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          Estimate your net payouts after standard platform commission fees based on contract tier.
        </p>

        {/* Input List Price */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Beat List Price ($)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs text-muted-foreground/80">$</span>
            <input
              type="number"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full rounded-xl border border-border/80 bg-secondary/15 py-2 pl-7 pr-3 text-xs text-foreground focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Select License Tier */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            License Type / Tier
          </label>
          <div className="space-y-1.5">
            {[
              { id: "mp3", name: "MP3 Lease", fee: "15%" },
              { id: "wav", name: "WAV Lease", fee: "15%" },
              { id: "stems", name: "Stems/Trackout", fee: "12%" },
              { id: "exclusive", name: "Exclusive Rights", fee: "10%" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLicenseType(item.id as any)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-2.5 text-xs font-semibold transition-all text-left",
                  licenseType === item.id
                    ? "border-orange-500/50 bg-orange-500/5 text-orange-500 shadow-sm shadow-orange-500/5"
                    : "border-border/60 bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                )}
              >
                <span>{item.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted-foreground/10">
                  Fee: {item.fee}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator Breakdown Results */}
        <div className="rounded-xl border border-border/80 bg-secondary/10 p-4 space-y-3 mt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Commission Rate</span>
            <span className="font-bold text-foreground">{calculated.rate}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-bold text-red-500/90">-${calculated.fee.toFixed(2)}</span>
          </div>
          <div className="h-px bg-border/40 my-2" />
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-foreground">Estimated Net Profit</span>
            <span className="text-lg font-black text-emerald-500">+${calculated.net.toFixed(2)}</span>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground/80 leading-relaxed text-center px-1">
          * Commission rates are structured dynamically to support high-tier producers. Exclusive licenses benefit from the lowest platform cut.
        </p>
      </div>
    </div>
  );
};

// 3. Help Center Panel Content
export const SupportHelpPanel = ({ onClose }: { onClose: () => void }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I upload stems?",
      a: "Export separate tracks (kick, snare, synth, etc.) as high-fidelity WAV files. Zip them into a single file archive and attach it in the Upload Beat portal."
    },
    {
      q: "When do I get paid?",
      a: "Automatic weekly payouts are processed every Sunday once your wallet crosses the $50 threshold. You can also request a manual withdrawal at any time in the payouts screen."
    },
    {
      q: "Can I offer discount codes?",
      a: "Yes! Navigate to licensing settings or discounts tab. You can establish discount tiers (e.g. buy 2 get 1 free) or custom promo code keys."
    },
    {
      q: "What are the platform fees?",
      a: "Platform commission is simple: 15% for MP3 and WAV leases, 12% for trackouts, and only 10% for high-value exclusive contract sales."
    }
  ];

  return (
    <div className="h-full flex flex-col font-sans text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-orange-500" />
          <h4 className="font-bold text-sm text-foreground">Studio Support</h4>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="rounded-xl border border-border/60 bg-gradient-to-br from-orange-500/5 to-secondary/10 p-3 shadow-sm mb-2">
          <p className="text-[10px] font-bold text-orange-500 mb-1">Need direct assistance?</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Our creator support team answers within 24 hours. Contact us via <span className="font-bold text-foreground">support@easybeats.com</span>.
          </p>
        </div>

        <div className="space-y-2">
          <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
            Frequently Asked Questions
          </h5>

          <div className="space-y-1.5">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div key={index} className="rounded-xl border border-border/60 overflow-hidden bg-secondary/5 transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-3 text-left text-[11px] font-bold text-foreground hover:bg-secondary/20 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-orange-500 font-extrabold text-[12px]">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-3 pt-0 text-[10px] text-muted-foreground leading-relaxed border-t border-border/30 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
