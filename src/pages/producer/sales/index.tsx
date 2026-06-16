import { useState } from "react";
import { DollarSign, Calendar, Filter, FileText } from "lucide-react";

export default function ProducerSales() {
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Sales & Earnings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your sales history, monitor license orders, and view earnings.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gross Earnings
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">$1,452.88</span>
            <span className="text-xs font-medium text-green-500">+10.2%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime revenue before fees</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Net Earnings
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">$1,234.95</span>
            <span className="text-xs font-medium text-green-500">+8.7%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Available balance after platform cut</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Orders
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">53</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Total individual licenses sold</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card/40 backdrop-blur-md rounded-xl border border-border p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-orange-500 focus:outline-none">
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Licenses</option>
            <option value="mp3">MP3 Lease</option>
            <option value="wav">WAV Lease</option>
            <option value="stems">Unlimited Stems</option>
            <option value="exclusive">Exclusive</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-4">Order Info</th>
                <th className="px-6 py-4">Buyer</th>
                <th className="px-6 py-4">License Type</th>
                <th className="px-6 py-4">Net Revenue</th>
                <th className="px-6 py-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {/* Sale Row 1 */}
              <tr className="hover:bg-secondary/15 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-foreground">Midnight Dreams</p>
                    <p className="text-xs text-muted-foreground">Order #BB-178146-218 • Jun 14, 2026</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground">buyer@example.com</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                    MP3 Lease
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-foreground">
                  $21.24 <span className="text-xs font-normal text-muted-foreground">($24.99 Gross)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="View invoice">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
              {/* Sale Row 2 */}
              <tr className="hover:bg-secondary/15 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-foreground">Chill Vibes</p>
                    <p className="text-xs text-muted-foreground">Order #BB-178119-943 • Jun 12, 2026</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-foreground">artist@beatbloom.com</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-500">
                    WAV Lease
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-foreground">
                  $42.49 <span className="text-xs font-normal text-muted-foreground">($49.99 Gross)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all" aria-label="View invoice">
                    <FileText className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
