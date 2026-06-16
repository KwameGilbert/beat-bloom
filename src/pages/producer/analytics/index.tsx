import { useState } from "react";
import { AreaChart, BarChart } from "@/components/ui/analytics-charts";
import { BarChart3, TrendingUp, Music, Play, Heart } from "lucide-react";

export default function ProducerAnalytics() {
  const [timeRange, setTimeRange] = useState("7days");

  // Sample data for charts
  const playData = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 250 },
    { label: "Wed", value: 190 },
    { label: "Thu", value: 340 },
    { label: "Fri", value: 410 },
    { label: "Sat", value: 300 },
    { label: "Sun", value: 480 },
  ];

  const salesData = [
    { label: "Jun 10", value: 25 },
    { label: "Jun 11", value: 50 },
    { label: "Jun 12", value: 0 },
    { label: "Jun 13", value: 75 },
    { label: "Jun 14", value: 25 },
    { label: "Jun 15", value: 120 },
    { label: "Jun 16", value: 50 },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Detailed Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track play count trends, listener engagement, and sales over time.
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-lg border border-border bg-card/40 backdrop-blur-md px-3 py-2 text-sm text-foreground focus:border-orange-500 focus:outline-none self-start sm:self-auto"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Play className="h-4 w-4 text-orange-500" />
            Total Plays
          </div>
          <p className="text-3xl font-black text-foreground">2,090</p>
          <p className="text-xs text-green-500 font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +15.4% this week
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Heart className="h-4 w-4 text-orange-500" />
            New Likes
          </div>
          <p className="text-3xl font-black text-foreground">142</p>
          <p className="text-xs text-green-500 font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +8.1% this week
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <BarChart3 className="h-4 w-4 text-orange-500" />
            Total Sales
          </div>
          <p className="text-3xl font-black text-foreground">$345.00</p>
          <p className="text-xs text-green-500 font-medium flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +24.3% this week
          </p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Play counts Area Chart */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-bold text-foreground text-lg">Play Count History</h3>
          <div className="pt-4">
            <AreaChart data={playData} />
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-bold text-foreground text-lg">Sales Revenue ($)</h3>
          <div className="pt-4">
            <BarChart data={salesData} prefix="$" />
          </div>
        </div>
      </div>

      {/* Top Beats Table */}
      <div className="space-y-4">
        <h3 className="font-bold text-foreground text-lg">Your Top Performing Beats</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-4">Beat</th>
                  <th className="px-6 py-4">Plays</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                <tr className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Music className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-foreground">Midnight Dreams</span>
                  </td>
                  <td className="px-6 py-4 text-foreground">1,240</td>
                  <td className="px-6 py-4 text-foreground">84</td>
                  <td className="px-6 py-4 font-bold text-orange-500">$749.70</td>
                </tr>
                <tr className="hover:bg-secondary/15 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <Music className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold text-foreground">Urban Legend</span>
                  </td>
                  <td className="px-6 py-4 text-foreground">850</td>
                  <td className="px-6 py-4 text-foreground">58</td>
                  <td className="px-6 py-4 font-bold text-orange-500">$499.80</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
