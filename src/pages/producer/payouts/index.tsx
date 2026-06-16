import { useState } from "react";
import { Wallet, CreditCard, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default function ProducerPayouts() {
  const [isRequesting, setIsRequesting] = useState(false);

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
            <h2 className="text-4xl font-black text-foreground">$824.50</h2>
            <p className="text-xs text-muted-foreground">
              Minimum payout threshold: $50.00
            </p>
          </div>
          <button
            onClick={() => setIsRequesting(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 shadow-lg shadow-orange-500/15"
          >
            Request Payout <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Payout Method Card */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payout Destination
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <CreditCard className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Mobile Money (MTN)</p>
                <p className="text-xs text-muted-foreground">**** **** 2981</p>
              </div>
            </div>
          </div>
          <button className="text-xs font-semibold text-orange-500 hover:text-orange-600 text-left mt-4">
            Manage Payout Accounts
          </button>
        </div>
      </div>

      {/* Payout History */}
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-lg">Payout History</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {/* Row 1 */}
                <tr className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground">
                    TXN-90281-2981
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    MTN Mobile Money
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    Jun 05, 2026
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    $450.00
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </span>
                  </td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-foreground">
                    TXN-82193-4122
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    MTN Mobile Money
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    May 20, 2026
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    $350.00
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
