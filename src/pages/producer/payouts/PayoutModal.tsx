import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBalanceStore } from "@/store/balanceStore";

export interface PayoutData {
  id: string;
  transactionId: string;
  method: string;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed";
}

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSubmit: (amount: number, payoutMethodId: number, methodName: string) => Promise<PayoutData>;
  payoutMethods: any[];
}

export const PayoutModal = ({ isOpen, onClose, balance, onSubmit, payoutMethods }: PayoutModalProps) => {
  const { showBalance } = useBalanceStore();
  const [amountInput, setAmountInput] = useState<string>("");
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDetails, setSuccessDetails] = useState<PayoutData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync default values when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmountInput(balance.toFixed(2));
      setSuccessDetails(null);
      setErrorMsg(null);
      
      const defaultMethod = payoutMethods.find(m => m.isDefault) || payoutMethods[0];
      if (defaultMethod) {
        setSelectedMethodId(defaultMethod.id);
      } else {
        setSelectedMethodId(null);
      }
    }
  }, [isOpen, balance, payoutMethods]);

  const getMethodName = (method: any) => {
    if (!method) return "";
    
    // Parse details safely
    let parsedDetails = method.details;
    if (typeof parsedDetails === 'string') {
      try {
        parsedDetails = JSON.parse(parsedDetails);
      } catch {
        parsedDetails = {};
      }
    }

    if (method.type === 'paypal') {
      return `PayPal (${parsedDetails.email || parsedDetails.paypalEmail || 'PayPal account'})`;
    }
    if (method.type === 'mobileMoney') {
      return `${parsedDetails.operator || 'Mobile Money'} (${parsedDetails.phone || 'Phone number'})`;
    }
    if (method.type === 'bank') {
      return `${parsedDetails.bankName || 'Bank'} (**** ${String(parsedDetails.accountNumber || '').slice(-4)})`;
    }
    return `Payoneer (${parsedDetails.email || 'Payoneer account'})`;
  };

  const getMethodDetails = (method: any) => {
    if (!method) return "";
    if (method.type === 'paypal') return "Settles in 24 Hours • Instant confirmation";
    if (method.type === 'mobileMoney') return "Settles in 2-5 Hours • Standard rates";
    if (method.type === 'bank') return "Settles in 1-2 Biz Days • standard fees";
    return "Settles in 24 Hours • Payoneer rate";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amountInput);

    if (isNaN(numericAmount) || numericAmount < 50 || numericAmount > balance) {
      setErrorMsg("Amount must be between $50.00 and your available balance");
      return;
    }

    if (!selectedMethodId) {
      setErrorMsg("Please select a payout method");
      return;
    }

    const selectedMethod = payoutMethods.find(m => m.id === selectedMethodId);
    const methodName = selectedMethod ? getMethodName(selectedMethod) : "Payout Account";

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await onSubmit(numericAmount, selectedMethodId, methodName);
      setSuccessDetails(result);
    } catch (err: any) {
      console.error("Payout submission failed:", err);
      setErrorMsg(err.message || "Payout request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xl z-10 text-left"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {successDetails ? (
              /* Stage 2: Success Screen */
              <div className="text-center py-6 space-y-4 font-sans">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8 animate-bounce-subtle" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-foreground">Withdrawal Requested!</h3>
                  <p className="text-xs text-muted-foreground">Your transaction has been queued successfully.</p>
                </div>

                <div className="rounded-xl border border-border/80 bg-secondary/10 p-4 space-y-2.5 text-xs text-left max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Requested</span>
                    <span className="font-bold text-foreground">${successDetails.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination Method</span>
                    <span className="font-bold text-foreground truncate max-w-[200px] inline-block">{successDetails.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Ref</span>
                    <span className="font-mono text-foreground font-semibold">{successDetails.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Settlement</span>
                    <span className="text-emerald-500 font-bold">2 - 24 Hours</span>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
                  A confirmation email has been dispatched. Funds will clear into your selected destination shortly.
                </p>

                <Button
                  onClick={onClose}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-lg mt-2"
                >
                  Done
                </Button>
              </div>
            ) : (
              /* Stage 1: Request Form */
              <form onSubmit={handleSubmit} className="space-y-5 font-sans">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg text-foreground">Request Withdrawal</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Withdraw funds from your available studio balance.
                  </p>
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-xs text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Available Balance Helper */}
                <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-3 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Available to Withdraw</span>
                  <span className="font-bold text-orange-500">
                    {showBalance ? `$${balance.toFixed(2)}` : "$ *,***.**"}
                  </span>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Withdrawal Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-sm text-muted-foreground font-semibold">$</span>
                    <input
                      type="number"
                      required
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="0.00"
                      min="50"
                      max={balance}
                      step="0.01"
                      className="w-full rounded-xl border border-border bg-secondary/15 py-3 pl-8 pr-24 text-sm text-foreground focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setAmountInput(balance.toFixed(2))}
                      className="absolute right-3 top-2 rounded-lg bg-orange-500/10 hover:bg-orange-500 hover:text-white px-3 py-1.5 text-[10px] font-bold text-orange-500 transition-all active:scale-95"
                    >
                      Withdraw Max
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground/85 px-1 leading-none">
                    Minimum threshold: $50.00
                  </p>
                </div>

                {/* Payout Method */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-1">
                    Select Payout Account
                  </label>
                  
                  {payoutMethods.length > 0 ? (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {payoutMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethodId(method.id)}
                          className={cn(
                            "flex w-full flex-col rounded-xl border p-3 text-left transition-all",
                            selectedMethodId === method.id
                              ? "border-orange-500/60 bg-orange-500/5 text-orange-500 shadow-sm"
                              : "border-border/60 bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                          )}
                        >
                          <span className="text-xs font-bold text-foreground leading-none">{getMethodName(method)}</span>
                          <span className="text-[9px] text-muted-foreground/80 mt-1">{getMethodDetails(method)}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center">
                      <p className="text-xs text-muted-foreground mb-2">No payout methods connected.</p>
                      <p className="text-[10px] text-muted-foreground">Please close this and click "Manage Payout Accounts" to add one.</p>
                    </div>
                  )}
                </div>

                {/* Warning banner */}
                <div className="flex gap-2 p-3 rounded-xl bg-secondary/20 border border-border/80 text-[10px] text-muted-foreground leading-relaxed">
                  <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Please ensure your payout credentials are valid. Failed payouts trigger security audits.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedMethodId || parseFloat(amountInput) > balance || parseFloat(amountInput) < 50}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 shadow-lg shadow-orange-500/10 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      Confirm Payout
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
