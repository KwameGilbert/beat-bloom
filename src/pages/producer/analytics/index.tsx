import { useState } from "react";
import { AreaChart, BarChart } from "@/components/ui/analytics-charts";
import { BarChart3, TrendingUp, Music, Play, Heart, DollarSign } from "lucide-react";
import { Table, type TableColumn } from "@/components/ui/table";
import { StatsCard } from "@/components/ui/stats-card";

interface TopBeatData {
  id: string;
  title: string;
  plays: number;
  likes: number;
  revenue: number;
  cover: string;
}

const mockTopBeats: TopBeatData[] = [
  { id: "1", title: "Midnight Dreams", plays: 1240, likes: 84, revenue: 749.70, cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80" },
  { id: "2", title: "Urban Legend", plays: 850, likes: 58, revenue: 499.80, cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=120&q=80" },
  { id: "3", title: "Chill Vibes", plays: 620, likes: 45, revenue: 299.90, cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=120&q=80" },
  { id: "4", title: "Sunset Boulevard", plays: 480, likes: 32, revenue: 199.50, cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=120&q=80" },
];

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

  const columns: TableColumn<TopBeatData>[] = [
    {
      key: "title",
      header: "Beat Track",
      sortable: true,
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-3 text-left">
          <img src={row.cover} alt="" className="h-9 w-9 rounded-lg object-cover border border-border/80 shadow-sm shrink-0" />
          <span className="font-bold text-foreground truncate">{row.title}</span>
        </div>
      ),
    },
    {
      key: "plays",
      header: "Plays",
      sortable: true,
      className: "text-left",
    },
    {
      key: "likes",
      header: "Likes",
      sortable: true,
      className: "text-left",
    },
    {
      key: "revenue",
      header: "Revenue",
      sortable: true,
      render: (row) => (
        <span className="font-bold text-orange-500 text-left">
          ${row.revenue.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8 pb-20 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-foreground sm:text-3xl tracking-tight">
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
        <StatsCard
          title="Total Plays"
          value="2,090"
          change={15.4}
          changeLabel="vs last week"
          icon={<Play className="h-4 w-4" />}
          variant="compact"
        />
        <StatsCard
          title="New Likes"
          value="142"
          change={8.1}
          changeLabel="vs last week"
          icon={<Heart className="h-4 w-4" />}
          variant="compact"
        />
        <StatsCard
          title="Total Sales"
          value="$345.00"
          change={24.3}
          changeLabel="vs last week"
          icon={<DollarSign className="h-4 w-4" />}
          variant="compact"
        />
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
        <Table
          columns={columns}
          data={mockTopBeats}
          defaultSort={{ key: "plays", direction: "desc" }}
        />
      </div>
    </div>
  );
}
