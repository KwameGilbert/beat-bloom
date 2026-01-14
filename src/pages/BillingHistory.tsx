import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  ExternalLink
} from "lucide-react";
import { featuredBeats } from "@/data/beats";
import { cn } from "@/lib/utils";

// Mock Transaction Data
const dummyTransactions = [
  { id: "TX-90210", date: "2026-01-14", beat: featuredBeats[0], type: "purchase", amount: 150.00, status: "completed", method: "Mastercard" },
  { id: "TX-90211", date: "2026-01-12", beat: featuredBeats[1], type: "sale", amount: 250.00, status: "completed", method: "PayPal Balance" },
  { id: "TX-90212", date: "2026-01-10", type: "withdrawal", amount: 500.00, status: "completed", method: "Bank Transfer" },
  { id: "TX-90213", date: "2026-01-08", beat: featuredBeats[2], type: "purchase", amount: 200.00, status: "completed", method: "Visa" },
  { id: "TX-90214", date: "2026-01-05", beat: featuredBeats[3], type: "sale", amount: 180.00, status: "completed", method: "PayPal Balance" },
];

const BillingHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  
  const filteredTransactions = dummyTransactions.filter(tx => 
    filter === "all" ? true : tx.type === filter
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/settings")}
              className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Billing History</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-all">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1 rounded-xl bg-secondary p-1">
            {["all", "purchase", "sale", "withdrawal"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  "rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  filter === t 
                    ? "bg-background text-orange-500 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search TX ID..." 
                className="rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          tx.type === "sale" ? "bg-green-500/10 text-green-500" : 
                          tx.type === "withdrawal" ? "bg-blue-500/10 text-blue-500" :
                          "bg-orange-500/10 text-orange-500"
                        )}>
                          {tx.type === "sale" ? <ArrowDownLeft className="h-5 w-5" /> : 
                           tx.type === "withdrawal" ? <ExternalLink className="h-5 w-5" /> :
                           <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">
                            {tx.type === "purchase" ? `Purchase: ${tx.beat?.title}` : 
                             tx.type === "sale" ? `Sale: ${tx.beat?.title}` :
                             "Funds Withdrawal"}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{tx.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {tx.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={cn(
                        "font-bold",
                        tx.type === "sale" ? "text-green-500" : "text-foreground"
                      )}>
                        {tx.type === "sale" ? "+" : "-"} GH₵{tx.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        {tx.method}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-500">
                        {tx.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-border">
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground font-medium">No transactions found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
