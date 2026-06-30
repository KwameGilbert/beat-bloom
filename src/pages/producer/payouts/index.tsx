import { useState, useEffect, useMemo } from "react";
import { Wallet, CreditCard, ArrowUpRight, CheckCircle2, Clock, X, Loader2, Trash2, PlusCircle, AlertCircle } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBalanceStore } from "@/store/balanceStore";
import { PayoutModal, type PayoutData } from "./PayoutModal";
import producerService from "@/lib/producer";
import { showNotification } from "@/components/ui/custom-notification";

export default function ProducerPayouts() {
  const [isRequesting, setIsRequesting] = useState(false);
  const { showBalance } = useBalanceStore();
  
  // Dynamic States
  const [balance, setBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [payoutList, setPayoutList] = useState<PayoutData[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Linking accounts state
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [newMethodType, setNewMethodType] = useState<'paypal' | 'bank' | 'mobileMoney'>('mobileMoney');
  const [paypalEmail, setPaypalEmail] = useState("");
  const [momoPhone, setMomoPhone] = useState("");
  const [momoOperator, setMomoOperator] = useState("MTN");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankRoutingNumber, setBankRoutingNumber] = useState("");
  const [bankHolderName, setBankHolderName] = useState("");
  const [isLinkingAccount, setIsLinkingAccount] = useState(false);

  const fetchData = async () => {
    try {
      const [historyRes, methodsRes, statsRes] = await Promise.all([
        producerService.getPayoutHistory(),
        producerService.getPayoutMethods(),
        producerService.getDashboardStats()
      ]);

      if (statsRes.success && statsRes.data) {
        setBalance(statsRes.data.availableBalance);
        setPendingBalance(statsRes.data.pendingBalance);
      }

      if (historyRes.success && historyRes.data) {
        const mapped = historyRes.data.map((p: any) => ({
          id: String(p.id),
          transactionId: p.payoutNumber,
          method: p.methodType === 'paypal' ? 'PayPal' : 
                  p.methodType === 'bank' ? 'Bank Transfer' : 
                  p.methodType === 'mobileMoney' ? 'Mobile Money' : 'Payoneer',
          date: new Date(p.requestedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amount: parseFloat(p.amount),
          status: p.status === 'completed' ? 'Completed' : 
                  p.status === 'failed' ? 'Failed' : 'Pending',
        }));
        setPayoutList(mapped);
      }

      if (methodsRes.success && methodsRes.data) {
        setPayoutMethods(methodsRes.data);
      }
    } catch (err) {
      console.error("Failed to load payout details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestPayout = async (amountNum: number, methodId: number, methodName: string): Promise<PayoutData> => {
    const response = await producerService.requestPayout(amountNum, methodId);
    if (!response.success || !response.data) {
      throw new Error(response.message || "Failed to request payout");
    }
    
    const p = response.data;
    const newPayout: PayoutData = {
      id: String(p.id),
      transactionId: p.payoutNumber,
      method: methodName,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      amount: amountNum,
      status: "Pending",
    };

    setPayoutList(prev => [newPayout, ...prev]);
    setBalance(prev => prev - amountNum);
    showNotification("Success", `Withdrawal request for $${amountNum.toFixed(2)} submitted.`, "success");
    return newPayout;
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLinkingAccount(true);

    let details: any = {};
    if (newMethodType === 'paypal') {
      details = { email: paypalEmail };
    } else if (newMethodType === 'mobileMoney') {
      details = { phone: momoPhone, operator: momoOperator };
    } else if (newMethodType === 'bank') {
      details = {
        bankName,
        accountNumber: bankAccountNumber,
        routingNumber: bankRoutingNumber,
        holderName: bankHolderName
      };
    }

    try {
      const response = await producerService.addPayoutMethod({
        type: newMethodType,
        ...details,
        isDefault: payoutMethods.length === 0,
      });

      if (response.success && response.data) {
        // Refresh methods
        const methodsRes = await producerService.getPayoutMethods();
        if (methodsRes.success) {
          setPayoutMethods(methodsRes.data);
        }
        showNotification("Success", "Payout account linked successfully.", "success");
        // Reset form
        setPaypalEmail("");
        setMomoPhone("");
        setBankName("");
        setBankAccountNumber("");
        setBankRoutingNumber("");
        setBankHolderName("");
      }
    } catch (err: any) {
      showNotification("Error", err.message || "Failed to link account", "error");
    } finally {
      setIsLinkingAccount(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!confirm("Are you sure you want to unlink this payout account?")) return;
    try {
      const response = await producerService.deletePayoutMethod(id);
      if (response.success) {
        setPayoutMethods(prev => prev.filter(m => m.id !== id));
        showNotification("Success", "Payout account unlinked.", "success");
      }
    } catch (err: any) {
      showNotification("Error", err.message || "Failed to delete account", "error");
    }
  };

  const defaultPayoutMethod = useMemo(() => {
    return payoutMethods.find(m => m.isDefault) || payoutMethods[0];
  }, [payoutMethods]);

  const getMethodDisplayLabel = (method: any) => {
    if (!method) return "No account connected";
    let details = method.details;
    if (typeof details === 'string') {
      try { details = JSON.parse(details); } catch { details = {}; }
    }
    
    if (method.type === 'paypal') {
      return `PayPal (${details.email || details.paypalEmail || 'Email'})`;
    }
    if (method.type === 'mobileMoney') {
      return `Mobile Money (${details.phone || 'Phone'})`;
    }
    if (method.type === 'bank') {
      return `${details.bankName || 'Bank'} (**** ${String(details.accountNumber || '').slice(-4)})`;
    }
    return `Payoneer (${details.email || 'Email'})`;
  };

  const columns: TableColumn<PayoutData>[] = [
    {
      key: "transactionId",
      header: "Transaction ID",
      sortable: true,
      searchable: true,
      className: "font-mono text-xs text-left",
    },
    {
      key: "method",
      header: "Method",
      sortable: true,
      filterable: true,
      filterType: "select",
      className: "text-left",
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      className: "text-muted-foreground text-left",
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-foreground text-left">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      render: (row) => (
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          row.status === "Completed" && "bg-green-500/10 text-green-500",
          row.status === "Pending" && "bg-yellow-500/10 text-yellow-500",
          row.status === "Failed" && "bg-red-500/10 text-red-500"
        )}>
          {row.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
          {row.status === "Pending" && <Clock className="h-3 w-3" />}
          {row.status === "Failed" && <X className="h-3 w-3" />}
          {row.status}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Payouts & Wallet
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Withdraw your earnings, manage payment accounts, and view payout history.
        </p>
      </div>

      {/* Wallet Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Balance Card */}
        <div className="md:col-span-2 rounded-xl border border-border bg-gradient-to-br from-orange-500/10 via-card to-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Wallet className="h-4 w-4 text-orange-500" />
              Available Balance
            </div>
            <h2 className="text-4xl font-black text-foreground">
              {showBalance ? `$${balance.toFixed(2)}` : "$ *,***.**"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Escrow cleared. Pending clearance: {showBalance ? `$${pendingBalance.toFixed(2)}` : "$ *,***.**"}
            </p>
          </div>
          <Button
            onClick={() => {
              if (payoutMethods.length === 0) {
                showNotification("Notice", "Please connect a payout method first.", "info");
                setIsAccountManagerOpen(true);
              } else {
                setIsRequesting(true);
              }
            }}
            className="px-6 py-3 flex items-center gap-2 h-auto text-sm animate-scale-click bg-orange-500 hover:bg-orange-600 text-white"
          >
            Request Payout <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Payout Method Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payout Destination
            </p>
            {defaultPayoutMethod ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground capitalize truncate">{defaultPayoutMethod.type === 'mobileMoney' ? 'Mobile Money' : defaultPayoutMethod.type}</p>
                  <p className="text-xs text-muted-foreground truncate">{getMethodDisplayLabel(defaultPayoutMethod)}</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No payout method linked. Add an account to receive payouts.
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsAccountManagerOpen(true)}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 text-left mt-4"
          >
            Manage Payout Accounts
          </button>
        </div>
      </div>

      {/* Payout History */}
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-lg">Payout History</h2>
        <Table
          columns={columns}
          data={payoutList}
          defaultSort={{ key: "date", direction: "desc" }}
        />
      </div>

      {/* Account Manager Modal */}
      {isAccountManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAccountManagerOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-left max-h-[90vh] overflow-y-auto font-sans">
            <button
              onClick={() => setIsAccountManagerOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">Manage Payout Accounts</h2>

            {/* List existing accounts */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Linked Accounts</h3>
              {payoutMethods.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {payoutMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground capitalize">
                          {method.type === 'mobileMoney' ? 'Mobile Money' : method.type}
                          {method.isDefault && <span className="ml-2 text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Default</span>}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{getMethodDisplayLabel(method)}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteAccount(method.id)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                        title="Remove Account"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-2">No payout methods currently linked.</p>
              )}
            </div>

            {/* Link New Account Form */}
            <form onSubmit={handleLinkAccount} className="border-t border-border pt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Link New Account</h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Account Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mobileMoney', label: 'Mobile Money' },
                    { id: 'paypal', label: 'PayPal' },
                    { id: 'bank', label: 'Bank Account' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setNewMethodType(opt.id as any)}
                      className={cn(
                        "rounded-xl border p-2 text-center text-xs font-semibold transition-all",
                        newMethodType === opt.id 
                          ? "border-orange-500 bg-orange-500/5 text-orange-500" 
                          : "border-border/60 bg-secondary/10 text-muted-foreground hover:bg-secondary/20 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {newMethodType === 'paypal' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">PayPal Email Address</label>
                  <input
                    type="email"
                    required
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="paypal@example.com"
                    className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                  />
                </div>
              )}

              {newMethodType === 'mobileMoney' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Operator</label>
                    <select
                      value={momoOperator}
                      onChange={(e) => setMomoOperator(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="Telecel">Telecel Cash</option>
                      <option value="AT">AT Money</option>
                      <option value="M-Pesa">M-Pesa</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      placeholder="e.g. 0244123456"
                      className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {newMethodType === 'bank' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Bank Name</label>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. Barclays Bank"
                        className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Account Holder Name</label>
                      <input
                        type="text"
                        required
                        value={bankHolderName}
                        onChange={(e) => setBankHolderName(e.target.value)}
                        placeholder="Account name"
                        className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Account Number</label>
                      <input
                        type="text"
                        required
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="Account number"
                        className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Routing Number / Sort Code</label>
                      <input
                        type="text"
                        required
                        value={bankRoutingNumber}
                        onChange={(e) => setBankRoutingNumber(e.target.value)}
                        placeholder="Routing code"
                        className="w-full rounded-xl border border-border bg-secondary/15 py-2.5 px-3.5 text-xs text-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLinkingAccount}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-xs shadow-md transition-all active:scale-95 disabled:opacity-40"
              >
                {isLinkingAccount ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Linking Account...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" /> Link Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payout Dialog Modal component */}
      <PayoutModal
        isOpen={isRequesting}
        onClose={() => setIsRequesting(false)}
        balance={balance}
        onSubmit={handleRequestPayout}
        payoutMethods={payoutMethods}
      />
    </div>
  );
}
