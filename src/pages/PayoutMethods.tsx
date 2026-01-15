import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Building2, 
  Trash2,
  CheckCircle2,
  Banknote,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const PayoutMethods = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState([
    { id: "1", type: "PayPal", account: "alex.p***@example.com", isDefault: true, icon: Banknote },
    { id: "2", type: "Bank Transfer", account: "Standard Chartered **** 1234", isDefault: false, icon: Building2 },
  ]);

  const removeMethod = (id: string) => {
    if (confirm("Remove this payout method?")) {
      setMethods(methods.filter(m => m.id !== id));
    }
  };

  const setDefault = (id: string) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/settings")}
              className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Payout Methods</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Earnings Overview */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white shadow-2xl shadow-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Available Balance</span>
            <DollarSign className="h-6 w-6 opacity-40" />
          </div>
          <p className="text-4xl font-bold">$12,450.00</p>
          <div className="mt-6 flex gap-3">
            <button className="flex-1 rounded-xl bg-white/20 px-4 py-3 text-sm font-bold backdrop-blur-md transition-all hover:bg-white/30">
              Withdraw Funds
            </button>
            <button className="flex-1 rounded-xl bg-white/20 px-4 py-3 text-sm font-bold backdrop-blur-md transition-all hover:bg-white/30">
              Set Auto-Payout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">My Methods</h2>
            <span className="text-xs text-muted-foreground">{methods.length} Linked</span>
          </div>

          <div className="space-y-3">
            {methods.map((method) => {
              const Icon = method.icon;
              return (
                <div 
                  key={method.id}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl border bg-card p-4 transition-all hover:shadow-md",
                    method.isDefault ? "border-orange-500/50 bg-orange-500/5 shadow-inner" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        method.isDefault ? "bg-orange-500 text-white" : "bg-secondary text-muted-foreground"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{method.type}</p>
                        {method.isDefault && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-500">
                            <CheckCircle2 className="h-3 w-3" />
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.account}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button 
                        onClick={() => setDefault(method.id)}
                        className="hidden rounded-full px-3 py-1.5 text-xs font-bold text-orange-500 hover:bg-orange-500/10 group-hover:block"
                      >
                        MAKE DEFAULT
                      </button>
                    )}
                    <button 
                      onClick={() => removeMethod(method.id)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {methods.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-border">
                <Banknote className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No payout methods linked.</p>
                <button className="mt-4 text-sm font-bold text-orange-500 hover:underline">Add Method</button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6">
          <h4 className="text-sm font-bold text-foreground mb-4">Payout Schedule</h4>
          <div className="space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Verification state</span>
              <span className="font-bold text-green-500">VERIFIED</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Next payout date</span>
              <span className="font-bold text-foreground">Feb 01, 2026</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Minimum threshold</span>
              <span className="font-bold text-foreground">$100.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutMethods;
