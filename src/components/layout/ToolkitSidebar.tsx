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
  Briefcase,
  Bell,
  Check,
  Wallet,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { showNotification } from "@/components/ui/custom-notification";

const menuVariants = {
  open: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    }
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  open: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  closed: (isHorizontal: boolean) => ({
    opacity: 0,
    scale: 0.7,
    x: isHorizontal ? 20 : 0,
    y: isHorizontal ? 0 : 20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
};

export interface StudioNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "sale" | "payout" | "system" | "collab";
  read: boolean;
}

export interface ToolkitSidebarProps {
  layoutDirection?: "horizontal" | "vertical";
  activePanel?: string | null;
  setActivePanel?: (panelName: string | null) => void;
  notifications?: StudioNotification[];
  setNotifications?: React.Dispatch<React.SetStateAction<StudioNotification[]>>;
}

export const ToolkitSidebar = ({
  layoutDirection = "horizontal",
  activePanel: propActivePanel,
  setActivePanel: propSetActivePanel,
  notifications: propNotifications,
  setNotifications: propSetNotifications,
}: ToolkitSidebarProps) => {
  const navigate = useNavigate();
  const [internalActivePanel, setInternalActivePanel] = useState<string | null>(null);
  const activePanel = propActivePanel !== undefined ? propActivePanel : internalActivePanel;
  const setActivePanel = propSetActivePanel || setInternalActivePanel;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [internalNotifications, setInternalNotifications] = useState<StudioNotification[]>([
    {
      id: "1",
      title: "New Beat Sale!",
      message: "You sold 'Retro Wave' WAV Lease to artist Drake for $49.99.",
      time: "2 hours ago",
      type: "sale",
      read: false
    },
    {
      id: "2",
      title: "Payout Processed",
      message: "Weekly payout of $340.50 was sent to your Paypal wallet.",
      time: "1 day ago",
      type: "payout",
      read: false
    },
    {
      id: "3",
      title: "Collab Invitation",
      message: "Producer 'MetroBoomin' sent a collaboration request on 'Trap Banger'.",
      time: "2 days ago",
      type: "collab",
      read: true
    },
    {
      id: "4",
      title: "Beat Approved",
      message: "Your beat 'Chilled Out' was approved and is now live on the marketplace.",
      time: "3 days ago",
      type: "system",
      read: true
    }
  ]);
  const notifications = propNotifications !== undefined ? propNotifications : internalNotifications;
  const setNotifications = propSetNotifications || setInternalNotifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showNotification("All Read", "All studio notifications marked as read.", "success", 1500);
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your notifications?")) {
      setNotifications([]);
      showNotification("Cleared", "Your notification feed has been cleared.", "info", 1500);
    }
  };

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

  const handleMobileIconClick = (panelName: string) => {
    handleIconClick(panelName);
    setIsMobileMenuOpen(false);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const mobileTools = [
    {
      id: "settings",
      icon: Settings,
      label: "Studio Settings",
      type: "link",
      path: "/producer/settings"
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Producer Support",
      type: "button",
      action: () => handleIconClick("help")
    },
    {
      id: "calculator",
      icon: Calculator,
      label: "Earnings Calculator",
      type: "button",
      action: () => handleIconClick("calculator")
    },
    {
      id: "notes",
      icon: FileText,
      label: "Quick Notes",
      type: "button",
      action: () => handleIconClick("notes")
    },
    {
      id: "notifications",
      icon: Bell,
      label: `Notifications (${unreadCount} new)`,
      type: "button",
      action: () => handleIconClick("notifications"),
      hasBadge: unreadCount > 0
    },
    {
      id: "upload",
      icon: UploadCloud,
      label: "Upload New Beat",
      type: "link",
      path: "/producer/upload"
    }
  ];

  const isHorizontal = layoutDirection === "horizontal";

  return (
    <div className="flex h-full shrink-0 select-none z-30">
      <AnimatePresence>
        {activePanel && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[70] md:hidden"
              onClick={handleClosePanel}
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="h-full border-l border-border bg-card/95 backdrop-blur-md overflow-hidden shrink-0 fixed inset-y-0 right-0 md:relative z-[75] md:z-30 shadow-2xl md:shadow-none"
            >
            <div className="w-[280px] h-full p-5">
              {activePanel === "notifications" && (
                <NotificationsPanel
                  onClose={handleClosePanel}
                  notifications={notifications}
                  onMarkAllRead={handleMarkAllRead}
                  onMarkRead={handleMarkRead}
                  onClearAll={handleClearAll}
                />
              )}
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
        </>
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

          {/* Studio Notifications Feed */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleIconClick("notifications")}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                  activePanel === "notifications"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-card shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="font-sans font-bold text-xs bg-popover text-popover-foreground">
              Notifications ({unreadCount} new)
            </TooltipContent>
          </Tooltip>

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

      {/* Mobile Floating Action Button (FAB) Toolkit */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-[65] md:hidden flex items-center gap-3",
          isHorizontal ? "flex-row-reverse" : "flex-col-reverse"
        )}
        onMouseLeave={() => setIsMobileMenuOpen(false)}
      >
        {/* Main floating button */}
        <div className="group relative">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            onMouseEnter={() => setIsMobileMenuOpen(true)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/35 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-50",
              isMobileMenuOpen ? "rotate-90" : ""
            )}
            aria-label="Toggle Creator Toolkit"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Briefcase className="h-5 w-5" />
            )}
          </button>
          <span className={isHorizontal
            ? "absolute -top-8 right-0 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-1 rounded bg-popover text-[10px] font-sans font-bold text-popover-foreground whitespace-nowrap shadow border border-border/80 pointer-events-none"
            : "absolute right-full mr-3 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-1 rounded bg-popover text-[10px] font-sans font-bold text-popover-foreground whitespace-nowrap shadow border border-border/80 pointer-events-none"
          }>
            Creator Toolkit
          </span>
        </div>

        {/* Animated list of items */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className={cn(
                "flex items-center gap-3",
                isHorizontal ? "flex-row-reverse" : "flex-col-reverse"
              )}
            >
              {mobileTools.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    custom={isHorizontal}
                    variants={itemVariants}
                    className="group relative"
                  >
                    {item.type === "link" ? (
                      <Link
                        to={item.path!}
                        onClick={handleMobileLinkClick}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30 shadow-md active:scale-95 transition-all duration-200"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleMobileIconClick(item.id)}
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30 shadow-md active:scale-95 transition-all duration-200"
                      >
                        <Icon className="h-4 w-4" />
                        {item.hasBadge && (
                          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-red-500 border border-card shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" />
                        )}
                      </button>
                    )}
                    {/* Tooltip / Label */}
                    <span className={isHorizontal
                      ? "absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-1 rounded bg-popover text-[10px] font-sans font-bold text-popover-foreground whitespace-nowrap shadow border border-border/80 pointer-events-none"
                      : "absolute right-full mr-3 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all duration-150 px-2 py-1 rounded bg-popover text-[10px] font-sans font-bold text-popover-foreground whitespace-nowrap shadow border border-border/80 pointer-events-none"
                    }>
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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

// 4. Notifications Panel Content
export const NotificationsPanel = ({
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onClearAll,
}: {
  onClose: () => void;
  notifications: StudioNotification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case "payout":
        return <Wallet className="h-4 w-4 text-blue-500" />;
      case "collab":
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-orange-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "sale":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "payout":
        return "bg-blue-500/10 border-blue-500/20";
      case "collab":
        return "bg-purple-500/10 border-purple-500/20";
      default:
        return "bg-orange-500/10 border-orange-500/20";
    }
  };

  return (
    <div className="h-full flex flex-col font-sans text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-orange-500" />
          <h4 className="font-bold text-sm text-foreground">Studio Feed</h4>
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllRead}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={onClearAll}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-red-500 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="flex gap-1.5 mb-3 bg-secondary/15 p-1 rounded-lg">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 text-[10px] font-bold py-1 px-2 rounded-md transition-all",
              filter === "all"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "flex-1 text-[10px] font-bold py-1 px-2 rounded-md transition-all",
              filter === "unread"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40 text-muted-foreground mb-3">
              <Bell className="h-6 w-6 opacity-40" />
            </div>
            <p className="text-xs font-bold text-foreground mb-1">All caught up!</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              No new updates or alerts at the moment.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && onMarkRead(item.id)}
              className={cn(
                "relative group flex gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left",
                item.read
                  ? "border-border/40 bg-secondary/5 hover:bg-secondary/10"
                  : "border-orange-500/20 bg-orange-500/[0.03] hover:bg-orange-500/[0.06] shadow-sm shadow-orange-500/[0.01]"
              )}
            >
              {/* Left icon badge */}
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", getBgColor(item.type))}>
                {getIcon(item.type)}
              </div>

              {/* Middle details */}
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex justify-between items-baseline gap-1.5">
                  <p className={cn("text-xs truncate", item.read ? "font-semibold text-foreground/90" : "font-bold text-foreground")}>
                    {item.title}
                  </p>
                  <span className="text-[9px] font-bold text-muted-foreground/80 shrink-0">{item.time}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal break-words">
                  {item.message}
                </p>
              </div>

              {/* Unread dot */}
              {!item.read && (
                <div className="absolute right-3.5 bottom-3.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
